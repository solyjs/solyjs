import { getStore } from '../store/store';

export function Contract(): any;

export function Contract() {
  return function (target: any) {
    getStore().contracts.push({ target: target, name: target.name });
  };
}
