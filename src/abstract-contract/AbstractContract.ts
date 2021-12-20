import { FileManager } from '../helpers/FileManager';
import provider from '../provider/Provider';
import { getStore } from '../store/store';
import { nanoid } from 'nanoid';
import { ContractOptions } from '../decorators/contract';
import { Methods } from '../driver/helpers/method';

export class AbstractContract<Contract extends any> {
  private contractName: string;
  private definedContract: any;
  private fileManager: FileManager;
  private abi: any[];
  private contractAddress: string;
  private contractOptions: ContractOptions;

  constructor(contractName?: string) {
    this.getContract(contractName);
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

    console.log(getStore().contracts);
    this.contractOptions = getStore().contracts.find(
      (contract) => contract.name === this.contractName
    ).options;
    this.definedContract = contract.contract;

    this.abi = contract.abi;
    this.contractAddress = contract.address;
  }

  async create(data: any) {
    this.checkMethod('create');
    const id = nanoid();

    const columns = getStore()
      .parseContractsAndColumns()
      .find((contract) => contract.targetName === this.contractName).columns;

    const account = provider.account.address;
    const transaction = this.definedContract.methods.set(id, [
      ...this.mapData(columns, { ...data, _id: id }, 'set'),
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
      signed?.rawTransaction ?? ''
    );

    return receipt;
  }

  async getAll() {
    this.checkMethod('getAll');

    const items = await this.definedContract.methods.getAll().call();
    return items;
  }

  async count() {
    this.checkMethod('count');
    const size = await this.definedContract.methods.size().call();
    return size;
  }

  async getById(_id: string) {
    this.checkMethod('get');

    return this.definedContract.methods.get(_id).call();
  }

  async deleteById(_id: string) {
    this.checkMethod('delete');

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
      signed?.rawTransaction ?? ''
    );

    return receipt;
  }

  async updateById(_id: string, data: any) {
    this.checkMethod('update');

    const columns = getStore()
      .parseContractsAndColumns()
      .find((contract) => contract.targetName === this.contractName).columns;
    const account = provider.account.address;
    const transaction = this.definedContract.methods.set(_id, [
      _id,
      ...this.mapData(columns, data, 'set'),
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
      signed?.rawTransaction ?? ''
    );

    return receipt;
  }

  private checkMethod(methodName: Methods) {
    if (
      this.contractOptions?.disabledMethods &&
      this.contractOptions?.disabledMethods?.indexOf(methodName) !== -1
    ) {
      throw new Error('MethodNotAllowed');
    }
  }
}
