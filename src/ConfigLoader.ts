import { join } from 'path';
import * as fs from 'fs';
import * as Bluebird from 'bluebird';
import * as YAML from 'yamljs';
import entries from './entries';
import { Entry } from './Config';

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

const readdir = (path: string) => new Promise<string[]>((resolve, reject) => {
  fs.readdir(path, (err, files) => (err ? reject(err) : resolve(files)));
});

const isReadable = (path: string) => new Promise<boolean>((resolve) => {
  fs.access(path, fs.constants.R_OK, err => resolve(!err));
});

const isReadableSync = (path: string) => {
  try {
    fs.accessSync(path, fs.constants.R_OK);
    return true;
  } catch (err) {
    return false;
  }
}

const stat = (path: string) => new Promise<fs.Stats>((resolve, reject) => {
  fs.stat(path, (err, stats) => (err ? reject(err) : resolve(stats)));
});

const readFile = (path: string, encoding: string) => new Promise<string>((resolve, reject) => {
  fs.readFile(path, encoding, (err, data) => (err ? reject(err) : resolve(data)));
});

const parse = ({ data, type }: { data: string, type: string }) => {
  switch (type) {
    case 'yml':
      return YAML.parse(data);
    case 'json':
      return JSON.parse(data);
    default:
      return {};
  }
}

const NODE_CONFIG_DIR = process.env.NODE_CONFIG_DIR || join(process.cwd(), 'config');
const SUFFIXES = ['yml', 'json'];

export default class ConfigLoader {
  private configDir: string;
  private argv: Map<string, string | boolean>;
  private env: Map<string, string>;

  public constructor(configDir: string = NODE_CONFIG_DIR, argv = process.argv, env = process.env) {
    this.configDir = configDir;
    this.argv = argv
      .filter(x => x.startsWith('-D') && x.length >= 3)
      .map(x => x.slice(2))
      .map<[string, string | boolean]>((x) => {
        const offset = x.indexOf('=');
        const key = x.slice(0, offset);
        const value = offset >= 0 ? x.slice(offset + 1) : true;
        return [key, value];
      })
      .reduce((map, [key, value]) => {
        map.set(key, value);
        return map;
      }, new Map<string, string | boolean>());
    this.env = new Map<string, string>(Object.entries(env));
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

  private overwriteFromEnv = ([key, value]: Entry): Entry => {
    const envName = key.toUpperCase().replace(/\./g, '_');
    if (this.env.has(envName)) {
      return [key, this.env.get(envName)];
    }
    return [key, value];
  }

  private parse(files: FileWithPathAndData[]): Entry[] {
    return [
      ...files
        .map(parse)
        .map(entries)
        .reduce((merged, e) => [...merged, ...e])
        .map(this.overwriteFromEnv),
      ...Array.from(this.argv),
    ];
  }

  public async load(names: string[] = []): Promise<Entry[]> {
    const existing = new Set(await readdir(this.configDir));
    const files = await Bluebird.filter(
      this.createCandidates(names, existing),
      async ({ path }) => await isReadable(path) && (await stat(path)).isFile(),
    ).map<FileWithPath, FileWithPathAndData>(async (file) => ({
      ...file,
      data: await readFile(file.path, 'utf8')
    }));

    return this.parse(files);
  }

  public loadSync(names: string[] = []): Entry[] {
    const existing = new Set(fs.readdirSync(this.configDir));
    const files = this.createCandidates(names, existing)
      .filter(({ path }) => isReadableSync(path) && fs.statSync(path).isFile())
      .map(file => ({ ...file, data: fs.readFileSync(file.path, 'utf8') }));

    return this.parse(files);
  }
}
