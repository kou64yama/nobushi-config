import nc from './nc';

const index = require('./index'); // tslint:disable-line no-var-requires

describe('index', () => {
  it('export nc as CommonJS module', () => {
    expect(index).toBe(nc);
  });

  it('export nc as ES module', () => {
    expect(index.default).toBe(nc);
  });
});
