import Web3 from 'web3';
import configStore from '../config/config';
import { FileManager } from '../helpers/FileManager';
import { getStore } from '../store/store';

class Provider {
  public web3: Web3;
  public account: any;
  private fileManager: FileManager;
  constructor() {
    let selectedHost = 'https://data-seed-prebsc-1-s1.binance.org:8545';

    this.web3 = new Web3(new Web3.providers.HttpProvider(selectedHost));

    this.fileManager = new FileManager();
  }

  loadAccount() {
    this.account = this.web3.eth.accounts.privateKeyToAccount(
      '0x' + configStore.config.privateKey
    );
  }

  async loadContracts() {
    this.loadAccount();
    const contracts = await this.fileManager.readDeploys();
    for (const contract of contracts) {
      getStore().deployedContracts.push({
        name: contract.name,
        abi: contract.content.abi,
        address: contract.content.address,
        contract: new this.web3.eth.Contract(
          contract.content.abi,
          contract.content.address
        ),
      });
    }
  }
}

const provider = new Provider();
export default provider;
