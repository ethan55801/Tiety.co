import { readFile, writeFile } from 'node:fs/promises';
const source = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
await writeFile(new URL('../index.html', import.meta.url), source.replaceAll('"assets/', '"dist/assets/'));
console.log('Updated the Desktop and GitHub Pages homepage.');
