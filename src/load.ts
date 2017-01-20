import { join } from 'path';
import Config, { Middleware } from './Config';
import ConfigLoader from './ConfigLoader';
import SecureMiddleware from './middleware/SecureMiddleware';

let middleware: Middleware | undefined;
if (process.env.NODE_CONFIG_PRIVATE_KEY) {
  middleware = new SecureMiddleware(process.env.NODE_CONFIG_PRIVATE_KEY);
}

const configDir = process.env.NODE_CONFIG_DIR as string || join(process.cwd(), 'config');
const files = ['default', process.env.NODE_ENV].filter(x => x);
const loader = new ConfigLoader(configDir);
const config = Config.generate(loader.loadSync(files), middleware);

export default config;
