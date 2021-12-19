import Web3 from 'web3';
import configStore from '../config/config';
import { FileManager } from '../helpers/FileManager';

export const deploy = async () => {
  let selectedHost = configStore.config.provider;

  const web3 = new Web3(new Web3.providers.HttpProvider(selectedHost));
  const fileManager = new FileManager();
  const artifacts = await fileManager.readArtifacts();

  for await (const artifact of artifacts) {
    const fileContnent = JSON.parse(artifact.content);
    let abi = fileContnent['abi'];
    const options = fileContnent.contractOptions;

    let bytecode = fileContnent['evm']['bytecode']['object'];
    const account = web3.eth.accounts.privateKeyToAccount(
      '0x' + configStore.config.privateKey
    );

    let contract = new web3.eth.Contract(abi);

    let contractA = contract.deploy({
      data: bytecode,
      arguments:
        options.restriction === 'owner'
          ? [account.address]
          : options.restriction === 'editors'
          ? [options.editors ?? []]
          : [],
    });
    const createTransaction = await account.signTransaction({
      data: contractA.encodeABI(),
      gas: await contractA.estimateGas(),
      gasPrice: await web3.eth.getGasPrice(),
      value: 0,
      from: account.address,
    });
    const createReceipt = await web3.eth.sendSignedTransaction(
      createTransaction.rawTransaction ?? ''
    );

    await fileManager.saveDeploy(artifact.name, {
      address: createReceipt.contractAddress,
      abi: abi,
      deployed: new Date().getTime(),
    });
    console.log(
      `Contract deployed at address: ${createReceipt.contractAddress}`
    );
  }
};
