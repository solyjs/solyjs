import 'reflect-metadata';

export class Address {
  constructor() {
    Reflect.metadata('design:type', this);
  }
}
