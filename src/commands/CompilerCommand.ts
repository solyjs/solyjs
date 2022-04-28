import yargs from "yargs";
import glob from "glob";
import configStore from "../config/config";

import { Compiler } from "../compiler/compiler";
import { Driver } from "../driver/driver";

export class CompilerCommand implements yargs.CommandModule {
  command = "contracts:compile";
  async handler() {
    try {
      await configStore.readConfig();

      const contracts = await glob.sync(
        process.cwd() + configStore.config.cli.contracts
      );
      for (const contract of contracts) {
        require(contract);
      }

      const driver = new Driver();
      await driver.generateContract();
      const compiler = new Compiler();
      await compiler.compile();
      console.log("Compiling contracts done.");
    } catch (e) {
      console.log("Error during contracts compiling:");
      console.error(e);
      process.exit(1);
    }
  }
}
