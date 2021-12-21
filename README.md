# SolyJS

### Nodejs Solidity CRUD generator

Sometimes creating CRUDS in solidity and connecting with javascript can be a hassle.\
SolyJS convert javascript defined struct to solidity crud.

- Define your JS object
- Compile and deploy with SolyJS cli
- ✨ Magic ✨

## Installation

```bash
$ npm install -g solyjs # for cli
$ npm install solyjs # for library
```

or add cli in your scripts

```
"solyjs": "node ./node_modules/solyjs/build/cli.js"
```

Start using SolyJS
`solyjs init`\
 This command will create directories which solyjs need for works

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
}
```

OR

```typescript
import { SolyModule } from 'solyjs';

const User = {
  firstName: 'string',
  lastName: 'string',
};

const UserContract = SolyModule.registerContract('User', User);
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
        retun this.create({firstName: 'John', lastName: 'Doe'});
    }

    async getUser(id){
        retun this.get(id);
    }

    async getAllUsers(){
        retun this.getAll();
    }
    ....
}
```

OR

```typescript
import {SolyModule} from 'solyjs'
import {UserContract} from './user.contract'

const userContract = SolyModule.getContract(UserContract);
await userContract.create({firstName: 'John', lastName: 'Doe'});
 ....
```

Allowed methods:
`create(data)`, `getAll()`, `get(_id)`, `count()`, `updateById(_id, data)`, `deleteById(_id)`

## Restrictions

| Restriction |                                              Description                                              |
| :---------: | :---------------------------------------------------------------------------------------------------: |
| **public**  |                             Everyone can create/update/delete **default**                             |
|  **owner**  |         Only contract owner (the address that deployed the contract) can create/update/delete         |
| **editors** | List of provided editors on deploy can create/update/delete (_manipulation with editors coming soon_) |

##### How to use?

Restriction type `owner`

```typescript
@Contract({ restriction: 'owner' })
export class User {
  @Column()
  firstName: string;

  @Column()
  firstName: string;
}

const User = {
  options: { restriction: 'owner' },
  columns: { firstName: 'string', lastName: 'string' },
};

export const UserContract = SolyModule.registerContract('User', User);
```

Restriction type `editors`

```typescript
@Contract({
  restriction: 'editors',
  editors: [
    '0x25a39f7E0b8b2D6b2Ebe1f155B09EE6FfB7D11F9',
    '0xbAce2110fA28910B48a5ed08F7ad844d8f1Af6c2',
  ],
})
export class User {
  @Column()
  firstName: string;

  @Column()
  firstName: string;
}
```

### Disable Methods

```typescript
@Contract({ disabledMethods: ['delete', 'update'] })
export class User {
  @Column()
  firstName: string;

  @Column()
  firstName: string;
}

const User = {
  options: { disabledMethods: ['update'] },
  columns: { firstName: 'string', lastName: 'string' },
};

export const UserContract = SolyModule.registerContract('User', User);
```

List of methods: `'delete' | 'create' | 'update' | 'get' | 'count' | 'getAll' `

## IMPORTANT

This package is in development phase, so a lot of new features coming soon
