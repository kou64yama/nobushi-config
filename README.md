# nobushi-config

[![Build Status](https://travis-ci.org/kou64yama/nobushi-config.svg?branch=master)](https://travis-ci.org/kou64yama/nobushi-config)

## Installation

```sh
npm install --save nobushi-config
```

## Usage

### `config/default.yml`

```yml
server:
  host: localhost
  port: 3000

datasource:
  url: postgresql://localhost:5432/apps
  username: username
  # Encrypted by AES-192
  password.secure: '848fe72e8b1f59e4472f0cf7ca6c61c5'
```

### `main.js`

```js
import path from 'path';
import { Config, ConfigLoader } from 'nobushi-config';

const NODE_CONFIG_DIR = process.env.NODE_CONFIG_DIR || path.join(process.cwd(), 'config');
const NODE_CONFIG_SECRET = process.env.NODE_CONFIG_SECRET || 'aes192:secret';

const offset = NODE_CONFIG_SECRET.indexOf(':');
const algorithm = NODE_CONFIG_SECRET.slice(0, offset);
const password = NODE_CONFIG_SECRET.slice(offset + 1);

const loader = new ConfigLoader(NODE_CONFIG_DIR);
const config = new Config(loader.loadSync(['default']), (cipherText) => {
  const decipher = crypto.createDecipher(algorithm, password);
  let plainText = decipher.update(cipherText, 'hex', 'utf8');
  plainText += decipher.final('utf8');
  return plainText;
});

// Get plaintext.
console.log(config.server.host);          // localhost
console.log(config.datasource.url);       // postgresql://localhost:5432/apps
// Decrypt ciphertext.
console.log(config.datasource.password);  // password
```
