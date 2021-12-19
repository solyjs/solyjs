import { SolyModule } from '..';
import { Test } from './test.contract';

const test = async () => {
  await SolyModule.load();

  const contract = SolyModule.getContract(Test);
  await contract.create({
    test1: 'omer123',
    test: 0,
  });
  const a = await contract.getAll();
  console.log(a, 'a');
};

test();
