import entries from './entries';

export type Value = string | number | boolean | null | undefined;
export type Entry = [string, Value];

export default class Config {
  public static generate<T>(config: T, decrypt?: (cipherText: string) => string): any {
    return new Config(entries(config), decrypt) as any;
  }

  public constructor(es: Entry[], decrypt?: (cipherText: string) => string) {
    const map = new Map<string, Value>(es);
    const keys = new Set<string>(es.map(([key]) => {
      const offset = key.indexOf('.');
      return offset >= 0 ? key.slice(0, offset) : key;
    }));

    Array.from(keys).map(key => {
      const get = () => {
        if (decrypt && map.has(`${key}.secure`)) {
          return decrypt(map.get(`${key}.secure`) as string);
        }
        if (map.has(key)) {
          return map.get(key);
        }

        const children = es
          .filter(([k]) => k.startsWith(`${key}.`))
          .map(([k, v]) => [k.slice(key.length + 1), v] as Entry);

        return new Config(children, decrypt);
      };
      let cache = () => {
        const value = get();
        cache = () => value;
        return value;
      };

      Object.defineProperty(this, key, {
        enumerable: true,
        get: () => cache(),
      });
    });
  }
}
