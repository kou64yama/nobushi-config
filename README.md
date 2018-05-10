# nobushi-config

[![NPM](https://nodei.co/npm/nobushi-config.png)](https://nodei.co/npm/nobushi-config/)
[![Build Status](https://travis-ci.org/kou64yama/nobushi-config.svg)](https://travis-ci.org/kou64yama/nobushi-config)
![npm type definitions](https://img.shields.io/npm/types/nobushi-config.svg)

## Installation

```sh
npm install nobushi-config
```

## Usage

```js
import nc from 'nobushi-config';

const config = nc(process.env).defaults({
  port: 3000,
  databaseUrl: 'sqlite:database.sqlite',
  api: {
    serverUrl: 'http://localhost:${port}',
  },
  auth: {
    jwt: { secret: 'secret' },
    facebook: {
      id: '${FACEBOOK_ID:965881723876770}',
      secret: '${FACEBOOK_SECRET:c0e8f5ba8f8e41688eb385a24a8a40b0}',
    },
  },
});

// Get the config value.
console.log(config.port);                   // => 3000
console.log(config.databaseUrl);            // => "sqlite:database.sqlite"

// Resolve placeholder.
console.log(config.api.serverUrl);          // => "http://localhost:3000"

// Resolve placeholder (default value).
console.info(config.auth.facebook.id);      // => "965881723876770"

// Resolve placeholder (environment variable).
console.info(process.env.FACEBOOK_SECRET);  // => "7fd670edc01845e9aca2f3d70d11339d"
console.info(config.auth.facebook.secret);  // => "7fd670edc01845e9aca2f3d70d11339d"

// Replace value with environment variable.
console.info(process.env.AUTH_JWT_SECRET);  // => "*sZBFn*&Wy@#7m_="
console.info(config.auth.jwt.secret);       // => "*sZBFn*&Wy@#7m_="
```

## Author

[kou64yama](https://github.com/kou64yama)
