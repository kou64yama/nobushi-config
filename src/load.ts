import { join } from 'path';
import Config, { Middleware } from './Config';
import ConfigLoader from './ConfigLoader';
import applyFilter from './applyFilter';
import DefaultMiddleware from './middleware/DefaultMiddleware';
import SecureMiddleware from './middleware/SecureMiddleware';
import environment from './filter/environment';

let middleware: Middleware;
if (process.env.NODE_CONFIG_PRIVATE_KEY) {
  const privateKey = new Buffer(process.env.NODE_CONFIG_PRIVATE_KEY, 'base64');
  middleware = new SecureMiddleware(privateKey.toString('utf8'));
} else {
  middleware = new DefaultMiddleware();
}

const configDir = process.env.NODE_CONFIG_DIR as string || join(process.cwd(), 'config');
const files = ['default', process.env.NODE_ENV].filter(x => x);
const loader = new ConfigLoader(configDir);
const config = Config.generate(
  loader.loadSync(files),
  applyFilter(middleware, [environment(process.env)]),
);

module.exports = config;
