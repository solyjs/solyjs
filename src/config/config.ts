import path from 'path';

export class ConfigStore {
  public static solidityVersion = '0.8.6';
  public config: any;

  async readConfig() {
    this.config = await require(process.cwd() + '/solconfig.js');
  }
}

const config = new ConfigStore();
export default config;
