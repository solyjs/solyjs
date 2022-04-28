import { getStore } from "../store/store";
import { CrudContract } from "./CrudContract";
export interface ObjectLiteral {
  [key: string]: any;
}
export class AbstractCrudContract<Contract extends ObjectLiteral> {
  public contract: CrudContract<Contract>;
  private contractName: string;
  constructor(name?: string) {
    this.getContractName();
    this.contract = new CrudContract(this.contractName);
  }

  private getContractName(contractName?: string) {
    if (!contractName) {
      const injectedContract = getStore().crudContracts.find(
        (contract) => (contract.target = this.constructor)
      );
      this.contractName = injectedContract.contract.name;
    } else {
      this.contractName = contractName;
    }
  }
}
