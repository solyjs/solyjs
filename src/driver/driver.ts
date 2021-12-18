import { FileManager } from '../helpers/FileManager';
import { getStore } from '../store/store';
import { ContractHelper } from './helpers/contract';

export class Driver {
  async generateContract() {
    const contracts = getStore().parseContractsAndColumns();
    const fileManager = new FileManager();
    for await (const contract of contracts) {
      const contractHelper = new ContractHelper(
        contract.targetName,
        contract.columns.map((column: any) => ({
          ...column,
          type: column.type.name,
        }))
      );
      const rawContract = contractHelper.generateRawContract();

      await fileManager.saveContract(contract.targetName, rawContract);
    }
  }
}
