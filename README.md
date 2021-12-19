# SolyJS

### Nodejs Solidity CRUD generator

Move your application on new level.
SolyJS convert javascript defined struct to solidity crud.

- Define your JS object
- Compile and deploy with SolyJS cli
- ✨Magic ✨

Start using SolyJS
`solyjs init` -> This command will create directories which solyjs need for works

on your app init

```typescript
import { SolyModule } from 'solyjs';

await SolyModule.load();
```

With SolyJs you can define your contract like `user.contract.ts`:

```typescript
import { Contract, Column } from 'solyjs';

@Contract()
export class User {
  @Column()
  firstName: string;

  @Column()
  firstName: string;

  @Column({ type: 'int' })
  age: number;
}
```

OR

```typescript
import { SolyModule } from 'solyjs';

const User = {
  firstName: 'string',
  lastName: 'string',
};

SolyModule.registerContract('User', User);
```

Create config inside your root project `solyjs.config.js`

```
module.exports = {
  privateKey:
    '98ed3412c00cbe4f11xxxxxxxxxxxxxxxx',
  provider: 'https://data-seed-prebsc-1-s1.binance.org:8545',
  cli: {
    contracts: ['/build/**/*.contract{.ts,.js}'],
  },
};
```

And run CLI

1. Compile contracts:
   `solyjs contracts:compile`
2. Deploy contracts:
   `solyjs contracts:deploy`

Start using your contracts through app

```typescript
import {CrudContract, AbstractContract} from 'solyjs'

@CrudContract(User)
export class UserContract extends AbstractContract<User> {

    // SolyJs will automaticaly create _id for your user
    async createUser(){
        retun this.contract.create({firstName: 'John', lastName: 'Doe'});
    }

    async getUser(id){
        retun this.contract.get(id);
    }

    async getAllUsers(){
        retun this.contract.getAll();
    }
    ....
}
```

OR

```typescript
import {SolyModule} from 'solyjs'
import {User} from './user.contract'

const userContract = SolyModule.getContract(User);
await userContract.create({firstName: 'John', lastName: 'Doe'});
 ....
```

Allowed methods:
`create(data)`, `getAll()`, `get(_id)`, `count()`, `updateById(_id, data)`, `deleteById(_id)`

## IMPORTANT

This package is in development phase, so a lot of new features coming soon
