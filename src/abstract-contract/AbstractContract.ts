import { FileManager } from '../helpers/FileManager';
import provider from '../provider/Provider';
import { getStore } from '../store/store';
import { v4 as uuidv4 } from 'uuid';

export class AbstractContract<Contract extends any> {
  private contractName: string;
  private definedContract: any;
  private fileManager: FileManager;
  private abi: any[];
  private contractAddress: string;
  public contract = {
    create: this.create,
    getById: this.getById,
    getAll: this.getAll,
    deleteById: this.deleteById,
    updateById: this.updateById,
  };
  constructor(contractName?: string) {
    this.getContract(contractName);
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
  private getContract(contractName?: string) {
    if (!contractName) {
      const injectedContract = getStore().crudContracts.find(
        (contract) => (contract.target = this.constructor)
      );
      this.contractName = injectedContract.contract.name;
    } else {
      this.contractName = contractName;
    }

    const contract = getStore().deployedContracts.find(
      (contract) => contract.name === this.contractName
    );
    this.definedContract = contract.contract;

    this.abi = contract.abi;
    this.contractAddress = contract.address;
  }

  private async create(data: any) {
    const id = uuidv4();
    // TODO read from ABI
    const columns = getStore()
      .parseContractsAndColumns()
      .find((contract) => contract.targetName === this.contractName).columns;
    const set = this.definedContract.methods.set(id, [
      id,
      ...this.mapData(columns, data),
    ]);
    const gas = await set.estimateGas();
    const nonce = await provider.web3.eth.getTransactionCount(
      provider.account.address
    );
    const createTransaction = await provider.account.signTransaction({
      data: set.encodeABI(),
      gas: gas,
      gasLimit: 30000000,
      value: 0,
      to: this.contractAddress,
      from: provider.account.address,
    });
    const createReceipt = await provider.web3.eth.sendSignedTransaction(
      createTransaction.rawTransaction ?? ''
    );
    return { tx: createReceipt.transactionHash };
  }

  private async getAll() {
    const items = await this.definedContract.methods.getAll().call();
    return items;
  }

  private async count() {
    const size = await this.definedContract.methods.size().call();
    return size;
  }

  private async getById(_id: string) {
    return this.definedContract.methods.get(_id).call();
  }

  private async deleteById(_id: string) {
    const remove = this.definedContract.methods.remove(_id);

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

  private async updateById(_id: string, data: any) {
    // TODO read from ABI
    const columns = getStore()
      .parseContractsAndColumns()
      .find((contract) => contract.targetName === this.contractName).columns;
    const set = this.definedContract.methods.set(_id, [
      _id,
      ...this.mapData(columns, data),
    ]);
    const gas = await set.estimateGas();

    const createTransaction = await provider.account.signTransaction({
      data: set.encodeABI(),
      gas: gas,
      // todo provide from options
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
