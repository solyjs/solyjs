import yargs from 'yargs';
import configStore from '../config/config';

import { deploy } from '../deployer/deployer';

export class DeployCommand implements yargs.CommandModule {
  command = 'contracts:deploy';
  async handler() {
    try {
      await configStore.readConfig();

      await deploy();

      console.log('Deploying contracts done.');
    } catch (e) {
      console.log('Error during deploying');
      console.error(e);
      process.exit(1);
    }
  }
}
