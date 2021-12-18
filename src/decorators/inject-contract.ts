import { getStore } from '../store/store';

export function InjectContract(contract: any): any;

export function InjectContract(contract: any) {
  return function (target: any) {
    getStore().injectedContracts.push({ target, contract });
  };
}
