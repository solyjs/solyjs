import {
  createWriteStream,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFile,
  writeFileSync,
} from 'fs';
import path from 'path';
export class FileManager {
  public rootDirectory = process.cwd();
  public workdir = 'workdir';

  async saveContract(contractName: string, rawContract: string) {
    const dirName = path.resolve(this.rootDirectory, this.workdir, 'contracts');
    const filePath = path.resolve(dirName, `${contractName}.sol`);

    let content = rawContract.replace(/\n/g, '');

    await writeFileSync(filePath, content, {
      encoding: 'utf8',
    });
  }

  async saveArtifact(artifactName: string, artifact: any) {
    const dirName = path.resolve(this.rootDirectory, this.workdir, 'artifacts');
    const filePath = path.resolve(dirName, `${artifactName}.json`);
    if (!existsSync(dirName)) {
      await mkdirSync(dirName);
    }

    await writeFileSync(filePath, JSON.stringify(artifact), {
      encoding: 'utf8',
    });
  }

  async createWorkdir() {
    const dirName = path.resolve(this.rootDirectory, this.workdir);
    if (!existsSync(dirName)) {
      await mkdirSync(dirName);
      await mkdirSync(path.resolve(dirName, 'contracts'));
      await mkdirSync(path.resolve(dirName, 'artifacts'));
      await mkdirSync(path.resolve(dirName, 'deploys'));
    }
  }

  async readArtifacts() {
    const artifacts: any[] = [];
    const artifactsPath = path.resolve(
      this.rootDirectory,
      this.workdir,
      'artifacts'
    );
    const files = await readdirSync(artifactsPath);
    for await (const file of files) {
      const fileContnentRaw = await readFileSync(
        path.resolve(artifactsPath, file),
        'utf8'
      );
      artifacts.push({
        content: fileContnentRaw,
        name: file.replace('.json', ''),
      });
    }

    return artifacts;
  }

  async readContracts() {
    const contracts: any[] = [];
    const dirPath = path.resolve(this.rootDirectory, this.workdir, 'contracts');
    const files = await readdirSync(dirPath);
    for await (const file of files) {
      const fileContnentRaw = await readFileSync(
        path.resolve(dirPath, file),
        'utf8'
      );

      contracts.push({
        content: fileContnentRaw,
        name: file.replace('.sol', ''),
      });
    }

    return contracts;
  }
  async readDeploys() {
    const contracts: any[] = [];
    const dirPath = path.resolve(this.rootDirectory, this.workdir, 'deploys');
    const files = await readdirSync(dirPath);
    for await (const file of files) {
      const fileContnentRaw = await readFileSync(
        path.resolve(dirPath, file),
        'utf8'
      );
      contracts.push({
        content: JSON.parse(fileContnentRaw),
        name: file.replace('.json', ''),
      });
    }

    return contracts;
  }

  async saveDeploy(contract: string, content: any) {
    const dirName = path.resolve(this.rootDirectory, this.workdir, 'deploys');
    const filePath = path.resolve(dirName, `${contract}.json`);
    if (!existsSync(dirName)) {
      await mkdirSync(dirName);
    }

    await writeFileSync(filePath, JSON.stringify(content), {
      encoding: 'utf8',
    });
  }

  async readDeploy(contract: string) {
    const dirName = path.resolve(this.rootDirectory, this.workdir, 'deploys');
    const filePath = path.resolve(dirName, `${contract}.json`);
    if (!existsSync(dirName)) {
      await mkdirSync(dirName);
    }

    if (!existsSync(filePath)) {
      throw Error('File doesnt exist');
    }
    const content = await readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  }
}
