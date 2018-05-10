import ConfigSource, { Value } from './ConfigSource';
import normalize from './normalize';
import { EventEmitter } from 'events';

export type NextFunction = (error: any, value?: Value) => void;
export type Middleware = (config: Config, key: string, value: Value, next: NextFunction) => void;

export default class Config extends EventEmitter {
  private keys = new Set<string>();

  public constructor(
    private sources: ConfigSource[],
    private middlewares: Middleware[] = [],
  ) {
    super();
    sources.reduce((keys, source) => [...keys, ...source.keys()], [])
      .forEach(key => this.keys.add(normalize(key)));
  }

  public get(key: string): Value {
    const found = this.findSourceAndKey(key);
    if (!found) {
      return null;
    }

    let result: Value | undefined;
    this.middlewares.reduce<NextFunction>(
      (next, middleware) => (err, value: Value) => {
        if (err) {
          return next(err);
        }
        return middleware(this, key, value, next);
      }, (err, value) => {
        if (err) {
          this.emit('error', err);
        }
        result = value;
      },
    )(null, found[0].get(found[1]));
    return result || null;
  }

  private findSourceAndKey(key: string): [ConfigSource, string] | null {
    const normalizedKey = normalize(key);
    for (const source of this.sources) {
      for (const x of source.keys()) {
        const normalizedX = normalize(x);
        if (normalizedX === normalizedKey) {
          return [source, x];
        }
      }
    }

    return null;
  }

  public extend<T>(obj: T, prefix = ''): T {
    return [...Object.keys(obj)]
      .reduce((prev, name) => Object.defineProperty(prev, name, {
        enumerable: true,
        get: () => {
          const key = normalize(`${prefix}${name}`);
          return this.keys.has(key)
            ? this.get(key)
            : this.extend((obj as any)[name], `${key}_`);
        },
      }), {});
  }
}
