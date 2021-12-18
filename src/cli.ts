#!/usr/bin/env node
import 'reflect-metadata';
import yargs from 'yargs';
import { CompilerCommand } from './commands/CompilerCommand';
import { DeployCommand } from './commands/DeployCommand';
import { InitCommand } from './commands/InitCommand';

yargs
  .usage('Usage: $0 <command> [options]')
  .command(new CompilerCommand())
  .command(new InitCommand())
  .command(new DeployCommand())
  .recommendCommands()
  .demandCommand(1)
  .strict()
  .alias('v', 'version')
  .help('h')
  .alias('h', 'help').argv;
