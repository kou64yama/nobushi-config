import toEntries from './entries';
import DefaultMiddleware from './middleware/DefaultMiddleware';

export type Value = string | number | boolean | null | undefined;
export type Entry = [string, Value];

export interface Middleware {
  has(entryMap: Map<string, Value>, key: string): boolean;
  get(entryMap: Map<string, Value>, key: string): Value;
}

export default class Config {
  public static generate<T>(config: T, middleware: Middleware = new DefaultMiddleware()): T {
    const entries = toEntries(config);
    const keys = entries.map(([key]) => key);
    const entryMap = new Map(entries);
    return new Config(entryMap, keys, '', middleware) as any;
  }

  private constructor(entryMap: Map<string, Value>, keys: string[], prefix: string, middleware: Middleware) {
    const propNames = (
      prefix ?
        keys
          .filter(key => key.startsWith(`${prefix}.`))
          .map(key => key.slice(prefix.length + 1)) :
        keys
    ).map(fullName => {
      const offset = fullName.indexOf('.');
      const name = offset >= 0 ? fullName.slice(0, offset) : fullName;
      return name;
    });

    new Set(propNames).forEach((name) => {
      const get = (): Config | Value => {
        const key = prefix ? `${prefix}.${name}` : name;
        if (!middleware.has(entryMap, key)) {
          return new Config(entryMap, keys, key, middleware);
        }

        return middleware.get(entryMap, key);
      };

      let getFromCache = () => {
        const cache = get();
        getFromCache = () => cache;
        return cache;
      };

      Object.defineProperty(this, name, {
        enumerable: true,
        get: () => getFromCache(),
      });
    });
  }
}
