import { SolyModule } from '..';

const test = async () => {
  await SolyModule.load();

  const contract = SolyModule.getContract('Omer');
  await contract.create({ firstName: 'omer', lastName: 'omer' });
  console.log('create contract');
  const a = await contract.getAll();
  console.log(a, 'a');
};

test();
