import { ContractOptions } from "../../decorators/contract";

// TODO method params if string
export class ContractHelper {
  private hasMapName: string;
  private primaryColumn: any;
  private structName: string;
  private restriction = "";
  constructor(
    private readonly contractName: string,
    private readonly columns: any[],
    private readonly options?: ContractOptions
  ) {
    this.hasMapName = `${this.contractName.toLowerCase()}s`;
    this.structName = ` _${this.contractName}`;
  }

  generateRawContract() {
    let contract = `pragma solidity = 0.8.13;\ncontract ${this.contractName} {\n`;
    const disabledMethods = this.options?.disabledMethods ?? [];

    contract += this.generateStruct();

    contract += this.generateRestrictions();

    contract += `struct Map {\n string[] keys;\nmapping(string => ${this.structName}) values;\nmapping(string => uint256) indexOf;\nmapping(string => bool) inserted;\n}\nMap map;\n`;
    contract += `
    function getKeyAtIndex(uint256 index) private view returns (string memory) {
      return map.keys[index];
  }
  function size() ${
    disabledMethods?.indexOf("count") === -1 ? "public" : "private"
  } view returns (uint256) {
      return map.keys.length;
  }
    `;
    if (
      disabledMethods?.indexOf("create") === -1 ||
      disabledMethods?.indexOf("update") === -1
    ) {
      const createDisabled = disabledMethods.indexOf("create") > -1;
      const updateDisabled = disabledMethods.indexOf("update") > -1;

      contract += this.generateSaveMethod(createDisabled, updateDisabled);
    }
    if (disabledMethods.indexOf("get") === -1) {
      contract += this.generateFindById();
    }
    if (disabledMethods.indexOf("delete") === -1) {
      contract += this.generateDeleteById();
    }
    if (disabledMethods.indexOf("getAll") === -1) {
      contract += this.generateGetAll();
    }
    contract += `}`;
    return contract;
  }
  generateRestrictions() {
    if (this.options?.restriction === "owner") {
      this.restriction = "_ownerOnly";
      return `
      address owner;
      modifier _ownerOnly() {
        require(msg.sender == owner);
        _;
      }
  
      constructor(address _owner) payable {
          owner = _owner;
      }`;
    }

    if (this.options?.restriction === "editors") {
      this.restriction = "_editorsOnly";
      return `
      address[] editors;
      modifier _editorsOnly() {
      bool exist = false;
      for (uint i; i< editors.length;i++){
            if (editors[i] == msg.sender)
            exist =  true;
        }
        require(exist == true);
        _;
      }

      constructor(address[] memory _editors) payable {
        editors = _editors;
      }
      `;
    }

    return "";
  }
  generateStruct() {
    let struct = `\n struct ${this.structName} {\n string _id; \n`;
    this.columns.forEach((column) => {
      // skip _id
      if (column.type.toLowerCase() !== "_id") {
        struct += `  ${column.type.toLowerCase()} ${column.name}; \n`;
      }
    });
    struct += ` }\n`;

    return struct;
  }

  generateSaveMethod(createDisabled: boolean, updateDisabled: boolean) {
    return `\n  function set(string memory key, ${
      this.structName
    } memory val) ${this.restriction} public {
      ${
        !updateDisabled
          ? `if (map.inserted[key]) {
        map.values[key] = val;
    } else {`
          : ""
      }
      ${
        !createDisabled
          ? ` map.inserted[key] = true;
      map.values[key] = val;
      map.indexOf[key] = map.keys.length;
      map.keys.push(key);`
          : ""
      }
         
    ${!updateDisabled ? `}` : ""}
      
  } \n`;
  }

  generateFindById() {
    return `\n function get(string memory key) public view returns (${this.structName} memory) {
        return map.values[key];
      } \n`;
  }

  generateDeleteById() {
    return `\n function remove(string memory key) ${this.restriction} public {
      if (!map.inserted[key]) {
          return;
      }

      delete map.inserted[key];
      delete map.values[key];

      uint256 index = map.indexOf[key];
      uint256 lastIndex = map.keys.length - 1;
      string memory lastKey = map.keys[lastIndex];

      map.indexOf[lastKey] = index;
      delete map.indexOf[key];

      map.keys[index] = lastKey;
      map.keys.pop();
      } \n`;
  }

  generateGetAll() {
    return `\n  function getAll() public view returns (${this.structName}[] memory) {
      ${this.structName}[] memory values = new ${this.structName}[](size());
      for (uint256 i = 0; i < size(); i++) {
        values[i] = get(getKeyAtIndex(i));
      }
      return values;
  }\n`;
  }
}
