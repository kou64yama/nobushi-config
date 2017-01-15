import test from 'ava';
import Config from './Config';

const crypto = require('crypto');

const c = {
  datasource: {
    url: 'postgresql://localhost:5432/config',
    username: 'config',
    password: { secure: '848fe72e8b1f59e4472f0cf7ca6c61c5' },
  },
};

const config = Config.generate(c, (cipherText) => {
  const decipher = crypto.createDecipher('aes192', 'secret');
  let plainText = decipher.update(cipherText, 'hex', 'utf8');
  plainText += decipher.final('utf8');
  return plainText;
});

test((t) => {
  // Plaintext.
  t.is(config.datasource.url, 'postgresql://localhost:5432/config');
  t.is(config.datasource.username, 'config');
  // Ciphertext.
  t.is(config.datasource.password, 'config');
  // undefined.
  t.is(config.foobar, undefined);
});
