import { Entry } from './ConfigSource';

export default function entries(obj: any): Entry[] {
  return Object.keys(obj)
    .map(key => [key, obj[key]])
    .reduce(
      (mem, [prefix, x]) => {
        if (typeof x !== 'object' || x === null) {
          return [...mem, [prefix, x]];
        }

        return [
          ...mem,
          ...entries(x).map(([key, value]) => [`${prefix}.${key}`, value]),
        ];
      },
      [],
    );
}
