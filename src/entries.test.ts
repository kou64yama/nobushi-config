import test from 'ava';
import entries from './entries';

test((t) => {
  const obj = {
    foo: {
      bar: 'foobar'
    },
    baz: 'baz',
    qux: 'qux',
  };

  const flat = entries(obj)
    .reduce((mem, [key, value]) => ({ ...mem, [key]: value }), {});

  t.deepEqual<any>(flat, {
    'foo.bar': 'foobar',
    baz: 'baz',
    qux: 'qux',
  })
});
