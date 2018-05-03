import Config from './Config';
import ConfigSource from './ConfigSource';
import entries from './entries';

export default function config(...args: any[]) {
  return {
    defaults<T>(obj: T): T {
      const sources = [...args, obj].map(x => new ConfigSource(entries(x)));
      const config = new Config(sources);
      return config.extend(obj);
    },
  };
}
