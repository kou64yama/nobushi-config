import nc from './nc';

const index = require('./index');

describe('index', () => {
  it('export nc as CommonJS module', () => {
    expect(index).toBe(nc);
  });

  it('export nc as ES module', () => {
    expect(index.default).toBe(nc);
  });
});
