import { readFile, access } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
const root = new URL('../', import.meta.url);
for (const page of ['index.html', 'dist/index.html']) {
  const url = new URL(page, root);
  const html = await readFile(url, 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, page + ': duplicate IDs');
  for (const match of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
    const value = match[1];
    if (value.startsWith('#')) assert(ids.includes(value.slice(1)), 'Missing anchor ' + value);
    else if (!/^(?:data:|https?:|mailto:)/.test(value)) await access(new URL(value, url));
  }
  for (const id of ['web', 'ai', 'it', 'network', 'contact']) assert(ids.includes(id));
  assert(html.includes('Nothing is sent or stored by this website.'));
}
const source = await readFile(new URL('dist/index.html', root), 'utf8');
assert.equal(await readFile(new URL('index.html', root), 'utf8'), source.replaceAll('"assets/', '"dist/assets/'), 'Run scripts/sync.mjs');
execFileSync(process.execPath, ['--check', fileURLToPath(new URL('dist/assets/app.js', root))]);
assert((await readFile(new URL('dist/assets/styles.css', root), 'utf8')).includes('prefers-reduced-motion'));
console.log('Passed: both entrypoints, local assets, page anchors, source sync and JavaScript syntax.');
