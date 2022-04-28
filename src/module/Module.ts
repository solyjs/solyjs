import glob from "glob";
import { AbstractCrudContract } from "..";
import { ObjectLiteral } from "../crud/AbstractContract";
import configStore from "../config/config";
import provider from "../provider/Provider";
import { getStore } from "../store/store";

export class SolyModule {
  static async load() {
    await configStore.readConfig();

    await provider.loadContracts();
  }

  static getContract(contract: string | ObjectLiteral) {
    const test = new AbstractCrudContract(
      typeof contract === "string" ? contract : contract.name
    );
    return test.contract;
  }

  static registerContract(contractName: string, contract: any) {
    getStore().contracts.push({
      name: contractName,
      target: contract,
      options:
        Object.entries(contract.options ?? {}).length === 0
          ? undefined
          : contract.options,
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
