import ConfigSource from "./ConfigSource";

describe('ConfigSource', () => {
  describe('#get(key: string)', () => {
    it('should return a value if exists', () => {
      const source = new ConfigSource([
        ['foo', 'bar'],
        ['baz', 'qux'],
      ]);
      expect(source.get('foo')).toBe('bar');
      expect(source.get('baz')).toBe('qux');
    });

    it('should return null if not exists', () => {
      const source = new ConfigSource([]);
      expect(source.get('foo')).toBeNull();
    });
  });
});
