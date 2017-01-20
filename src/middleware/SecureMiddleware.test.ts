import test from 'ava';
import * as path from 'path';
import SecureMiddleware from './SecureMiddleware';
import { readFile } from '../fs';
import { Value } from '../Config';

const crypto = require('crypto');

async function createMiddleware() {
  const [privateKey, publicKey] = await Promise.all([
    readFile(path.join(__dirname, '../../test/key/private.key'), 'utf8'),
    readFile(path.join(__dirname, '../../test/key/public.key'), 'utf8')
  ]);

  const middleware = new SecureMiddleware(privateKey);
  const map = new Map<string, Value>(Object.entries({
    username: 'user name',
    'password.secure': crypto.publicEncrypt(publicKey, new Buffer('secret')).toString('base64'),
    'number.secure': 12467890,
  }));
  return { middleware, map };
}

test('has(key) returns true if key exists', async (t) => {
  const { middleware, map } = await createMiddleware();
  t.truthy(middleware.has(map, 'username'));
  t.falsy(middleware.has(map, 'foobar'));
});

test('get(key) returns value', async (t) => {
  const { middleware, map } = await createMiddleware();
  t.is(middleware.get(map, 'username'), 'user name');
});

test('get(key) returns decrypted value', async (t) => {
  const { middleware, map } = await createMiddleware();
  t.is(middleware.get(map, 'password'), 'secret');
});

test('get(key) throws TypeError if the secure value isn\'t number', async (t) => {
  const { middleware, map } = await createMiddleware();
  t.throws(() => middleware.get(map, 'number'), TypeError);
});
