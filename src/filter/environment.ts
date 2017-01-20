import { Filter } from '../applyFilter';

type Env = { [name: string]: any };

const environment = (env: Env): Filter => (value) => {
  if (typeof value !== 'string') {
    return value;
  }

  return value.replace(/\${([a-z_][a-z0-9_]*)}/ig, (_m, name) => env[name] || '');
}

export default environment;
