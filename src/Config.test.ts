import test from 'ava';
import Config from './Config';

const c = {
  datasource: {
    url: 'postgresql://localhost:5432/config',
    username: 'config',
    password: '848fe72e8b1f59e4472f0cf7ca6c61c5',
  },
};

const config = Config.generate(c);

test((t) => {
  // Plaintext.
  t.is(config.datasource.url, c.datasource.url);
  t.is(config.datasource.username, c.datasource.username);
  // Ciphertext.
  t.is(config.datasource.password, c.datasource.password);
  // undefined.
  t.is((config as any).foobar, undefined);
});
