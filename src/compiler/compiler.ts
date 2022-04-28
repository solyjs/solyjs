import { readFileSync } from "fs";
//@ts-ignore
import solc from "solc";
import { FileManager } from "../helpers/FileManager";
import { getStore } from "../store/store";

export class Compiler {
  async compile() {
    const fileManager = new FileManager();

    const contracts = await fileManager.readContracts();
    for (const contract of contracts) {
      const contractName = contract.name;
      const contractNameFile = `${contractName}.sol`;
      const storeContract = getStore().contracts.find(
        (c) => c.name === contractName
      );
      const input = {
        language: "Solidity",
        sources: {
          [contractNameFile]: {
            content: contract.content,
          },
        },
        settings: {
          outputSelection: {
            "*": {
              "*": ["*"],
            },
          },
        },
      };
      var output = JSON.parse(solc.compile(JSON.stringify(input)));
      await fileManager.saveArtifact(contractName, {
        ...output.contracts[contractNameFile][contractName],
        contractOptions: storeContract?.options,
      });
    }
  }
}
