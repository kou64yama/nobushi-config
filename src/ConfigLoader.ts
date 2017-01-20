import { join } from 'path';
import * as fs from 'fs';
import * as Bluebird from 'bluebird';
import * as YAML from 'yamljs';
import { readdir, access, stat, readFile } from './fs';
import entries from './entries';
import { Value } from './Config';

interface File {
  name: string;
  type: string;
}

interface FileWithPath extends File {
  path: string;
}

interface FileWithPathAndData extends FileWithPath {
  data: string;
}

const notThrows = async (fn: () => Promise<any>): Promise<boolean> => {
  try {
    await fn();
    return true;
  } catch (err) {
    return false;
  }
};

const notThrowsSync = (fn: () => any): boolean => {
  try {
    fn();
    return true;
  } catch (err) {
    return false;
  }
};

const parse = (data: string, type: string ) => {
  switch (type) {
    case 'yml':
      return YAML.parse(data);
    case 'json':
      return JSON.parse(data);
    default:
      return {};
  }
};

const SUFFIXES = ['yml', 'json'];

export default class ConfigLoader {
  private configDir: string;

  public constructor(configDir: string) {
    this.configDir = configDir;
  }

  private createCandidates(names: string[], existing: Set<string>) {
    return Array.from(new Set(names))
      .reduce<File[]>((files, name: string) => [
        ...files,
        ...SUFFIXES.map(type => ({
            name: `${name}.${type}`,
            type,
        })),
      ], [])
      .filter(({ name }) => existing.has(name))
      .map<FileWithPath>(file => ({ ...file, path: join(this.configDir, file.name) }))
  }

  private parse(files: FileWithPathAndData[]): { [key: string]: Value } {
    return files
      .map(({ data, type }) => parse(data, type))
      .map(entries)
      .reduce((merged, e) => [...merged, ...e])
      .reduce<{ [key: string]: Value }>((c, [k, v]) => ({ ...c, [k]: v }), {});
  }

  public async load(names: string[]): Promise<{ [key: string]: Value }> {
    const existing = new Set(await readdir(this.configDir));
    const files = await Bluebird.filter(
      this.createCandidates(names, existing),
      async ({ path }) => await notThrows(() => access(path, fs.constants.R_OK)) && (await stat(path)).isFile(),
    ).map<FileWithPath, FileWithPathAndData>(async (file) => ({
      ...file,
      data: await readFile(file.path, 'utf8')
    }));

    return this.parse(files);
  }

  public loadSync(names: string[]): { [key: string]: Value } {
    const existing = new Set(fs.readdirSync(this.configDir));
    const files = this.createCandidates(names, existing)
      .filter(({ path }) => notThrowsSync(() => fs.accessSync(path, fs.constants.R_OK)) && fs.statSync(path).isFile())
      .map(file => ({ ...file, data: fs.readFileSync(file.path, 'utf8') }));

    return this.parse(files);
  }
}
