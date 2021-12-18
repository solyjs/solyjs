import { readFileSync } from 'fs';
//@ts-ignore
import solc from 'solc';
import { FileManager } from '../helpers/FileManager';

export class Compiler {
  async compile() {
    const fileManager = new FileManager();
    const contracts = await fileManager.readContracts();
    for (const contract of contracts) {
      const contractName = contract.name;
      const contractNameFile = `${contractName}.sol`;
      const input = {
        language: 'Solidity',
        sources: {
          [contractNameFile]: {
            content: contract.content,
          },
        },
        settings: {
          outputSelection: {
            '*': {
              '*': ['*'],
            },
          },
        },
      };

      var output = JSON.parse(solc.compile(JSON.stringify(input)));
      await fileManager.saveArtifact(
        contractName,
        output.contracts[contractNameFile][contractName]
      );
    }
  }
}
