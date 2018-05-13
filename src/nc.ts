import Config, { Middleware } from './Config';
import ConfigSource from './ConfigSource';
import entries from './entries';
import placeholder from './middlewares/placeholder';

export default function nc(...args: any[]) {
  const middlewares: Middleware[] = [
    placeholder(),
  ];

  return {
    use(...middleware: Middleware[]) {
      middlewares.push(...middleware);
      return this;
    },

    defaults<T>(obj: T): T {
      const sources = [...args, obj].map(x => new ConfigSource(entries(x)));
      const config = new Config(sources, middlewares);
      return config.extend(obj);
    },
  };
}
