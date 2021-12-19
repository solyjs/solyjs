import { getStore } from '../store/store';

export function Contract(options?: ContractOptions): any;

export function Contract(options?: ContractOptions) {
  return function (target: any) {
    getStore().contracts.push({ target: target, name: target.name, options });
  };
}

export interface ContractOptions {
  restriction: 'owner' | 'public' | 'editors';
  editors?: string[];
}
