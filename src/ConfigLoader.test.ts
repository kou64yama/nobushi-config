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
  'datasource.password.secure': 'AyXnD0pieD2FUJZfC5sA1OkvGfB3mJ9A+WI0111Ou4w3zBSf5BODZdDJleWhM5PKXHCI5+1CPU3blfyp5IqxiytONhsupZwdW449d2cfbcdByXJN641oUiQd4cgmKGjz26jkMNVOeyoWnvFoQBwmQWLqFI+rZWXPdhT6xQhFVEc68xBICJ78Mb6nCp+uTxfUAso9uZA/iXwYuPmmjNTme8vFPWe4WiotM/Kb0Gcd7Nk1U8sgIarHRZ5WyUb6LgftnFK20hSiVm3qpI78Yj/QEmINV5mhuLTXRPQHP7zH1IvoxlkkFSrg5nQzOww8N1amnmeMjZlU1SpUIfGj1SEY6A==',
};

test((t) => {
  const config = loader.loadSync(['default', 'test']);
  t.deepEqual(config, expect);
});

test(async (t) => {
  const config = (await loader.load(['default', 'test']));
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
