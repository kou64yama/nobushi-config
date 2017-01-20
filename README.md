# nobushi-config

[![Build Status](https://travis-ci.org/kou64yama/nobushi-config.svg?branch=master)](https://travis-ci.org/kou64yama/nobushi-config)

Library to read the configuration file written in YAML or JSON.

## Installation

```sh
npm install --save nobushi-config
```

## Usage

Load config file in `config` directory or `NODE_CONFIG_DIR` (if set).

##### config/default.yml

```yml
server:
  host: localhost
  port: ${PORT}

# Allow dot delimited format.
datasource.rdb.url: postgresql://localhost:5432/apps
datasource:
  rdb.username: apps
  rdb.password.secure: '<base64 encoded, crypted string>'
```

##### app.js

```js
import config from 'nobushi-config/lib/load';

// Get the config value.
console.log(config.server);                 // => { host: 'localhost', port: 3000 }
console.log(config.database.rdb.url);       // => 'postgresql://localhost:5432/apps'

// Extract environment variables.
console.log(config.server.port);            // => 3000

// Decrypt the value of the key with '.secure' suffix
// if NODE_CONFIG_PRIVATE_KEY is set
console.log(config.database.rdb.password);  // => 'secret'
```

## Author

[kou64yama](https://github.com/kou64yama)
