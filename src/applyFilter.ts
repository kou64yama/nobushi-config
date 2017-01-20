import { Middleware, Value } from './Config';

export type Filter = (value: Value, key?: string) => Value;

export default (middleware: Middleware, filters: Filter[]): Middleware => ({
  has: (map, key) => middleware.has(map, key),
  get: (map, key) => filters.reduce((value, filter) => filter(value, key), middleware.get(map, key))
});
