import { getStore } from '../store/store';

export function CrudContract(contract: any): any;

export function CrudContract(contract: any) {
  return function (target: any) {
    getStore().crudContracts.push({ target, contract });
  };
}
