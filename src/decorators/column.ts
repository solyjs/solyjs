import 'reflect-metadata';
import { getStore } from '../store/store';
export function Column() {
  return function (target: any, name: string) {
    const reflectMetadataType = Reflect.getMetadata(
      'design:type',
      target,
      name
    );
    getStore().columns.push({ name, type: reflectMetadataType, target });
  };
}
