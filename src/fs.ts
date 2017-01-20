import * as fs from 'fs';

export const readdir = (path: string) => new Promise<string[]>((resolve, reject) => {
  fs.readdir(path, (err, files) => (err ? reject(err) : resolve(files)));
});

export const access = (path: string, mode: number) => new Promise<void>((resolve, reject) => {
  fs.access(path, mode, err => (err ? reject(err) : resolve()));
});

export const stat = (path: string) => new Promise<fs.Stats>((resolve, reject) => {
  fs.stat(path, (err, stats) => (err ? reject(err) : resolve(stats)));
});

export const readFile = (path: string, encoding: string) => new Promise<string>((resolve, reject) => {
  fs.readFile(path, encoding, (err, data) => (err ? reject(err) : resolve(data)));
});
