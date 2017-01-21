import test from 'ava';
import { readFileSync } from 'fs';
import { join } from 'path';

process.env.NODE_ENV = 'test';
process.env.NODE_CONFIG_DIR = join(__dirname, '../test/config');
process.env.NODE_CONFIG_PRIVATE_KEY = readFileSync(join(__dirname, '../test/key/private.key'), 'base64');

const config = require('./index');

const c = {
  server: {
    host: 'localhost',
    port: 3000,
  },
  datasource: {
    url: 'postgresql://localhost:5432/apps',
    username: 'username',
    password: 'secret',
  },
};

test((t) => {
  t.deepEqual(JSON.parse(JSON.stringify(config)), c);
});
