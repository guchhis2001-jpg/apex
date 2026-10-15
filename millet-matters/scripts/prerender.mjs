// Static prerender: renders <App/> to HTML and injects it into dist/index.html,
// so the hero (headline + pack) paints before any JS runs. The client then hydrates.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { render } = await import(pathToFileURL(path.join(ROOT, 'dist-ssr', 'entry-server.js')).href);
const file = path.join(ROOT, 'dist', 'index.html');
const html = await fs.readFile(file, 'utf8');
const out = html.replace('<!--app-html-->', render());
await fs.writeFile(file, out);
await fs.rm(path.join(ROOT, 'dist-ssr'), { recursive: true, force: true });
console.log(`prerendered dist/index.html (${(out.length / 1024).toFixed(0)} KB)`);
