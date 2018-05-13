import { Middleware } from '../Config';

export default function placeholder(): Middleware {
  return (config, key, value, next) => {
    if (typeof value !== 'string') {
      return next(null, value);
    }

    next(null, value.replace(
      /\${([^:}]+)(:([^}]*))?}/g,
      (match, name, p2, defaultValue) => config.get(name) || defaultValue,
    ));
  };
}
