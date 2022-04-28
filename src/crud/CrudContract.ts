import { FileManager } from "../helpers/FileManager";
import provider from "../provider/Provider";
import { getStore } from "../store/store";
import { nanoid } from "nanoid";
import { ContractOptions } from "../decorators/contract";
import { Methods } from "../driver/helpers/method";
export interface ObjectLiteral {
  [key: string]: any;
}
export class CrudContract<Contract extends ObjectLiteral> {
  private contractName: string;
  private definedContract: any;
  private fileManager: FileManager;
  private abi: any[];
  private contractAddress: string;
  private contractOptions: ContractOptions;

  constructor(contractName: string) {
    this.contractName = contractName;
    this.getContract();
    this.fileManager = new FileManager();
    this.readConfig();
  }
  private async readConfig() {
    return this.fileManager.readDeploy(this.contractName);
  }

  private mapData(colums: any[], data: any, type?: string) {
    let result: any[] = [];
    const abiFunc = this.abi.find((abiEl) => abiEl.name === type);
    const inputs = abiFunc.inputs[1].components;
    inputs.forEach((column) => {
      result.push(data[column.name]);
    });
    return result;
  }
  private getContract() {
    const contract = getStore().deployedContracts.find(
      (contract) => contract.name === this.contractName
    );

    this.contractOptions = getStore().contracts.find(
      (contract) => contract.name === this.contractName
    ).options;
    this.definedContract = contract.contract;

    this.abi = contract.abi;
    this.contractAddress = contract.address;
  }

  async create(data: Contract): Promise<Contract> {
    this.checkMethod("create");
    const id = nanoid();

    const columns = getStore()
      .parseContractsAndColumns()
      .find((contract) => contract.targetName === this.contractName).columns;

    const account = provider.account.address;
    const transaction = this.definedContract.methods.set(id, [
      ...this.mapData(columns, { ...data, _id: id }, "set"),
    ]);
    const options = {
      to: transaction._parent._address,
      data: transaction.encodeABI(),
      gas: await transaction.estimateGas({ from: account }),
      gasPrice: await provider.web3.eth.getGasPrice(),
    };
    const signed = await provider.web3.eth.accounts.signTransaction(
      options,
      provider.account.privateKey
    );
    const receipt = await provider.web3.eth.sendSignedTransaction(
      signed?.rawTransaction ?? ""
    );

    return receipt as unknown as Contract;
  }

  async getAll(): Promise<Contract[]> {
    this.checkMethod("getAll");

    const items = await this.definedContract.methods.getAll().call();
    return items;
  }

  async count(): Promise<number> {
    this.checkMethod("count");
    const size = await this.definedContract.methods.size().call();
    return size;
  }

  async getById(_id: string): Promise<Contract> {
    this.checkMethod("get");

    return this.definedContract.methods.get(_id).call();
  }

  async deleteById(_id: string): Promise<Contract> {
    this.checkMethod("delete");

    const account = provider.account.address;
    const transaction = this.definedContract.methods.remove(_id);
    const options = {
      to: transaction._parent._address,
      data: transaction.encodeABI(),
      gas: await transaction.estimateGas({ from: account }),
      gasPrice: await provider.web3.eth.getGasPrice(),
    };
    const signed = await provider.web3.eth.accounts.signTransaction(
      options,
      provider.account.privateKey
    );
    const receipt = await provider.web3.eth.sendSignedTransaction(
      signed?.rawTransaction ?? ""
    );

    return receipt as unknown as Contract;
  }

  async updateById(_id: string, data: any): Promise<Contract> {
    this.checkMethod("update");

    const columns = getStore()
      .parseContractsAndColumns()
      .find((contract) => contract.targetName === this.contractName).columns;
    const account = provider.account.address;
    const transaction = this.definedContract.methods.set(_id, [
      _id,
      ...this.mapData(columns, data, "set"),
    ]);
    const options = {
      to: transaction._parent._address,
      data: transaction.encodeABI(),
      gas: await transaction.estimateGas({ from: account }),
      gasPrice: await provider.web3.eth.getGasPrice(),
    };
    const signed = await provider.web3.eth.accounts.signTransaction(
      options,
      provider.account.privateKey
    );
    const receipt = await provider.web3.eth.sendSignedTransaction(
      signed?.rawTransaction ?? ""
    );

    return receipt as unknown as Contract;
  }

  private checkMethod(methodName: Methods) {
    if (
      this.contractOptions?.disabledMethods &&
      this.contractOptions?.disabledMethods?.indexOf(methodName) !== -1
    ) {
      throw new Error("MethodNotAllowed");
    }
  }
}
