import { AbstractContract } from '../abstract-contract/AbstractContract';
import { InjectContract } from '../decorators/inject-contract';
import { Baci, User } from './user.contract';

@InjectContract(User)
export class UserContract extends AbstractContract<User> {
  async createUser() {
    return this.create({ name: 'omer', lastName: 'salkanovic' });
  }
}

@InjectContract(Baci)
export class BaciContract extends AbstractContract<Baci> {
  async createUser() {
    return this.create({
      name: 'omer',
      lastName: 'salkanovic',
      kita: 'najveca',
    });
  }
}
