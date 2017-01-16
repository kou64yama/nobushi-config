import test from 'ava';
import * as fs from 'fs';
import { readdir, access, stat, readFile } from './fs';

test('readdir()', async (t) => {
  await t.throws(readdir('/foo/bar'), Error);
});

test('access()', async (t) => {
  await t.throws(access('/foo/bar', fs.constants.R_OK));
});

test('stat()', async (t) => {
  await t.throws(stat('/foo/bar'));
});

test('readFile()', async (t) => {
  await t.throws(readFile('/foo/bar', 'utf8'));
});
