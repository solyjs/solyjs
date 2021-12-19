export class Store {
  readonly contracts: any[] = [];
  readonly columns: any[] = [];
  readonly crudContracts: any[] = [];
  readonly deployedContracts: any[] = [];

  parseContractsAndColumns() {
    let result: any[] = [];
    for (const contract of this.contracts) {
      const targetName = contract.name;

      const columns = this.columns.filter(
        (column) => column.targetName === targetName
      );

      result.push({ ...contract, columns, targetName });
    }
    return result;
  }
}

export const getStore = (): Store => {
  const store = global as any;
  if (!store.SolidityOrm) store.SolidityOrm = new Store();

  return store.SolidityOrm;
};
