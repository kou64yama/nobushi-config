import entries from './entries';

describe('entries(obj: any): [string, any][]', () => {
  it('should return flatten entries', () => {
    const obj = {
      foo: {
        bar: 'foobar',
      },
      baz: 'baz',
      qux: 'qux',
    };

    const es = entries(obj)
      .sort((a, b) => a[0].localeCompare(b[0]));

    expect(es).toEqual([
      ['baz', 'baz'],
      ['foo.bar', 'foobar'],
      ['qux', 'qux'],
    ]);
  });
});
