import Web3 from 'web3';
import { FileManager } from '../helpers/FileManager';
import provider from '../provider/Provider';
import { getStore } from '../store/store';
import { v4 as uuidv4 } from 'uuid';

export class AbstractContract<Contract extends any> {
  private contractName: string;
  private contract: any;
  private fileManager: FileManager;
  private abi: any[];
  private contractAddress: string;
  constructor() {
    this.getContract();
    this.fileManager = new FileManager();
    this.readConfig();
  }
  private async readConfig() {
    return this.fileManager.readDeploy(this.contractName);
  }
  private mapData(colums: any[], data: any) {
    let result: any[] = [];
    colums.forEach((column) => {
      result.push(data[column.name]);
    });

    return result;
  }
  private getContract() {
    const injectedContract = getStore().injectedContracts.find(
      (contract) => (contract.target = this.constructor)
    );
    this.contractName = injectedContract.contract.name;

    const contract = getStore().deployedContracts.find(
      (contract) => contract.name === injectedContract.contract.name
    );
    this.contract = contract.contract;

    this.abi = contract.abi;
    this.contractAddress = contract.address;
  }

  async create(data: any) {
    const id = uuidv4();
    // TODO save to configuration
    const columns = getStore()
      .parseContractsAndColumns()
      .find((contract) => contract.targetName === this.contractName).columns;
    const set = this.contract.methods.set(id, [
      id,
      ...this.mapData(columns, data),
    ]);
    console.log(columns, [id, ...this.mapData(columns, data)]);
    const gas = await set.estimateGas();

    const createTransaction = await provider.account.signTransaction({
      data: set.encodeABI(),
      gas: gas,
      gasLimit: 3000000,
      value: 0,
      to: this.contractAddress,
      from: provider.account.address,
    });
    const createReceipt = await provider.web3.eth.sendSignedTransaction(
      createTransaction.rawTransaction ?? ''
    );
    return { tx: createReceipt.transactionHash };
  }

  async getAll() {
    const items = await this.contract.methods.getAll().call();
    return items;
  }

  async count() {
    const size = await this.contract.methods.size().call();
    return size;
  }

  async getById(_id: string) {
    return this.contract.methods.get(_id).call();
  }

  async deleteById(_id: string) {
    const remove = this.contract.methods.remove(_id);

    const gas = await remove.estimateGas();

    const createTransaction = await provider.account.signTransaction({
      data: remove.encodeABI(),
      gas: gas,
      gasLimit: 3000000,
      value: 0,
      to: this.contractAddress,
      from: provider.account.address,
    });
    const createReceipt = await provider.web3.eth.sendSignedTransaction(
      createTransaction.rawTransaction ?? ''
    );
    return { tx: createReceipt.transactionHash };
  }

  async updateById(_id: string, data: any) {
    // TODO save to configuration
    const columns = getStore()
      .parseContractsAndColumns()
      .find((contract) => contract.targetName === this.contractName).columns;
    const set = this.contract.methods.set(_id, [
      _id,
      ...this.mapData(columns, data),
    ]);
    const gas = await set.estimateGas();

    const createTransaction = await provider.account.signTransaction({
      data: set.encodeABI(),
      gas: gas,
      gasLimit: 3000000,
      value: 0,
      to: this.contractAddress,
      from: provider.account.address,
    });
    const createReceipt = await provider.web3.eth.sendSignedTransaction(
      createTransaction.rawTransaction ?? ''
    );
    return { tx: createReceipt.transactionHash };
  }
}
