import yargs from 'yargs';

import { FileManager } from '../helpers/FileManager';

export class InitCommand implements yargs.CommandModule {
  command = 'init';
  async handler() {
    try {
      const fileManager = new FileManager();
      fileManager.createWorkdir();
      console.log('Init done.');
    } catch (e) {
      console.log('Error during init');
      console.error(e);
      process.exit(1);
    }
  }
}
