import { Middleware, Value } from '../Config';

const crypto = require('crypto');

interface PrivateKey {
  key: string;
  passphrase?: string;
  padding?: number;
}

export default class SecureMiddleware implements Middleware {
  private privateKey: PrivateKey;

  public constructor(privateKey: string | PrivateKey) {
    this.privateKey = typeof privateKey === 'string' ? { key: privateKey } : privateKey;
  }

  public has(entryMap: Map<string, Value>, key: string): boolean {
    return entryMap.has(`${key}.secure`) || entryMap.has(key);
  }

  public get(entryMap: Map<string, Value>, key: string): Value {
    const secureKey = `${key}.secure`;
    if (!entryMap.get(secureKey)) {
      return entryMap.get(key);
    }

    const value = entryMap.get(secureKey);
    if (typeof value !== 'string') {
      throw new TypeError(`The value '${secureKey}' is not string`);
    }

    const buffer = new Buffer(value, 'base64');
    return crypto.privateDecrypt(this.privateKey, buffer).toString('utf8');
  }
}
