import test from 'ava';
import environment from './environment';

const filter = environment({
  TEST: 'test message',
  fizz: 'fizz',
  buzz: 'buzz',
});

test((t) => {
  t.is(filter('test'), 'test');
  t.is(filter('${TEST}'), 'test message');
  t.is(filter('<${fizz} ${buzz} ${fizz}${buzz}>'), '<fizz buzz fizzbuzz>');
  t.is(filter('My name is ${MY_NAME}'), 'My name is ');
  t.is(filter(123), 123);
});
