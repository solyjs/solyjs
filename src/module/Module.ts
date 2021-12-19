import glob from 'glob';
import { AbstractContract } from '..';
import configStore from '../config/config';
import provider from '../provider/Provider';
import { getStore } from '../store/store';

export class SolyModule {
  static async load() {
    await configStore.readConfig();
    const contracts = await glob.sync(
      process.cwd() + configStore.config.cli.contracts
    );
    // for (const contract of contracts) {
    //   require(contract);
    // }
    await provider.loadContracts();
  }

  static getContract(contract: any) {
    const test = new AbstractContract(
      typeof contract === 'string' ? contract : contract.name
    );
    return test;
  }

  static registerContract(contractName: string, contract: any) {
    getStore().contracts.push({ name: contractName, target: contract });
    Object.keys(contract).forEach((key) => {
      getStore().columns.push({
        name: key,
        type: contract[key],
        target: contract,
        targetName: contractName,
      });
    });
  }
}
