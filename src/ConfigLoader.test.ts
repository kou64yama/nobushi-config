import test from 'ava';
import * as rewire from 'rewire';
import * as path from 'path';
import ConfigLoader from './ConfigLoader';

const rewired = rewire('./ConfigLoader');
const notThrows = rewired.__get__('notThrows');
const notThrowsSync = rewired.__get__('notThrowsSync');
const parse = rewired.__get__('parse');

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

test('notThrows', (t) => {
  t.notThrows(async () => {
    t.falsy(await notThrows(() => { throw new Error() }));
  });
});

test('notThrows', async (t) => {
  t.truthy(await notThrows(() => {}));
});

test('notThrowsSync', (t) => {
  t.notThrows(() => {
    t.falsy(notThrowsSync(() => { throw new Error() }));
  });
});

test('notThrowsSync', async (t) => {
  t.truthy(notThrowsSync(() => {}));
});

test('parse', (t) => {
  t.deepEqual(parse('{"foo":"bar"}', 'json'), { foo: 'bar' });
  t.deepEqual(parse('foo: bar', 'yml'), { foo: 'bar' });
  t.deepEqual(parse('', ''), {});
});
