import configStore from './config/config';
import provider from './provider/Provider';
import { UserContract } from './test/contract';

import { Baci, User } from './test/user.contract';

const bootstap = async () => {
  await configStore.readConfig();
  const user = new User();
  const baci = new Baci();

  await provider.loadContracts();
  const a = new UserContract();
  // const b = await a.createUser();
  // await a.updateById('1e043bc5-b74c-4c49-859d-085ede09f68e', {
  //   name: 'Omer',
  //   lastName: 'tito',
  // });
  // const c = await a.getAll();
  //console.log(c);
};

bootstap();
