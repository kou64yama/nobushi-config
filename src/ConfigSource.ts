export type Value = null | boolean | number | string;
export type Entry = [string, Value];

export default class ConfigSource {
  private map: Map<string, Value>;

  public constructor(entries: Entry[]) {
    this.map = new Map(entries);
  }

  public get(key: string): Value {
    return this.map.get(key) || null;
  }

  public keys(): IterableIterator<string> {
    return this.map.keys();
  }
}
