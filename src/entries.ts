import { Entry } from './Config';

export default function entries(config: {}): Entry[] {
  return Object.entries(config).reduce((mem, [prefix, x]) => {
    if (typeof x !== 'object') {
      return [...mem, [prefix, x] as Entry];
    }

    return [
      ...mem,
      ...entries(x).map<Entry>(([key, value]) => [`${prefix}.${key}`, value]),
    ];
  }, [] as Entry[]);
}
