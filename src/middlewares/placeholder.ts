import { Middleware } from "../Config";

export default function placeholder(): Middleware {
  return (config, _key, value, next) => {
    if (typeof value !== 'string') {
      return next(null, value);
    }

    next(null, value.replace(
      /\${([^:}]+)(:([^}]*))?}/g,
      (_match, name, _p2, defaultValue) => config.get(name) || defaultValue,
    ));
  }
}
