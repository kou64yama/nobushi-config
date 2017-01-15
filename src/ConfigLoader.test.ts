import test from 'ava';
import * as path from 'path';
import ConfigLoader from './ConfigLoader';

const loader = new ConfigLoader(path.join(__dirname, '../test/config'));
const expect = {
  'server.host': 'localhost',
  'server.port': 3000,
  'datasource.url': 'postgresql://localhost:5432/apps',
  'datasource.username': 'username',
  'datasource.password': 'password',
  'datasource.password.secure': '848fe72e8b1f59e4472f0cf7ca6c61c5'
};

test((t) => {
  const config = loader.loadSync(['default', 'test'])
    .reduce<{ [key: string]: any }>((c, [k, v]) => ({ ...c, [k]: v }), {});
  t.deepEqual(config, expect);
});

test(async (t) => {
  const config = (await loader.load(['default', 'test']))
    .reduce<{ [key: string]: any }>((c, [k, v]) => ({ ...c, [k]: v }), {});
  t.deepEqual(config, expect);
});
