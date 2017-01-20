import { Middleware, Value } from '../Config';

export default class DefaultMiddleware implements Middleware {
  public has(entryMap: Map<string, Value>, key: string): boolean {
    return entryMap.has(key);
  }

  public get(entryMap: Map<string, Value>, key: string): Value {
    return entryMap.get(key);
  }
}
