import { Entry } from './Config';

export default function entries(config: {}): Entry[] {
  return Object.keys(config)
    .map<Entry>(key => [key, (config as any)[key]])
    .reduce<Entry[]>((mem, [prefix, x]) => {
      if (typeof x !== 'object' || x === null) {
        return [...mem, [prefix, x] as Entry];
      }

      return [
        ...mem,
        ...entries(x).map<Entry>(([key, value]) => [`${prefix}.${key}`, value]),
      ];
    }, []);
}
