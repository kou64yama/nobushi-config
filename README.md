# nobushi-config

[![NPM](https://nodei.co/npm/nobushi-config.png)](https://nodei.co/npm/nobushi-config/)
[![Build Status](https://travis-ci.org/kou64yama/nobushi-config.svg)](https://travis-ci.org/kou64yama/nobushi-config)
![npm type definitions](https://img.shields.io/npm/types/nobushi-config.svg)

Configuration control library for PaaS like Heroku or Azure.

## Quick start

Install `nobushi-config` via NPM or YARN.

```bash
npm install nobushi-config
# or
yarn add nobuhsi-config
```

Create an application (`app.js`):

```js
const nc = require('nobushi-config');

const config = nc(process.env).defaults({
  port: 3000,
  databaseUrl: 'sqlite:database.sqlite',
});

console.log('port:', config.port);
console.log('databaseUrl:', config.databaseUrl);
```

Run `app.js`:

```shell
$ node app.js
port: 3000
databaseUrl: sqlite:database.sqlite

# Overwrite configurations by environment variables.
$ export PORT='8080'
$ export DATABASE_URL='postgresql://username:password@hostname:5432/db'
$ node app.js
port: 8080
databaseUrl: postgresql://username:password@hostname:5432/db
```

## Usage

### Overwrite configurations

```js
const config = nc(arguments...).defaults(defaultConfig);
```

Can overwrite `defaultConfig` by `nc`'s `arguments`. Different naming
conventions (such as camelCase, SNAKE_CASE, etc.) are considered the same
property. For example, `DATABASE_URL`, `databaseUrl`, `database.url` and
`database-url` are same property.

### Support placeholder

The part surrounded by `${}` is interpreted as a placeholder and the
corresponding configuration value is expanded. The value following `:` is used
as the value when the configuration value does not exist. For example:

```js
const config = nc(process.env).default({
  databaseUrl: 'postgresql://username:${DATABASE_PASSWORD:secret}@localhost:5432/db',
});
```

## Author

[kou64yama](https://github.com/kou64yama)
