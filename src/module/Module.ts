import glob from 'glob';
import { AbstractContract } from '..';
import configStore from '../config/config';
import provider from '../provider/Provider';
import { getStore } from '../store/store';

export class SolyModule {
  static async load() {
    await configStore.readConfig();

    await provider.loadContracts();
  }

  static getContract(contract: any) {
    const test = new AbstractContract(
      typeof contract === 'string' ? contract : contract.name
    );
    return test;
  }

  static registerContract(contractName: string, contract: any) {
    getStore().contracts.push({
      name: contractName,
      target: contract,
      options: contract.options,
    });
    Object.keys(contract.columns).forEach((key) => {
      getStore().columns.push({
        name: key,
        type: contract.columns[key],
        target: contract,
        targetName: contractName,
      });
    });

    return { name: contractName };
  }
}
