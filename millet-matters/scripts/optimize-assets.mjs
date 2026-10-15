// Builds .avif + .webp siblings for every PNG/JPG in packs/, dishes/ and brand/.
// Drop a transparent PNG in, run `npm run assets:optimize`, done.
// The page requests  <picture>: .avif → .webp → original.
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'assets');
const DIRS = ['packs', 'dishes'];
const MAX_W = { packs: 800, dishes: 900 };

for (const dir of DIRS) {
  const abs = path.join(ROOT, dir);
  const files = (await fs.readdir(abs)).filter((f) => /\.(png|jpe?g)$/i.test(f));
  for (const f of files) {
    const src = path.join(abs, f);
    const base = src.replace(/\.(png|jpe?g)$/i, '');
    const img = sharp(src).resize({ width: MAX_W[dir], withoutEnlargement: true });
    await img.clone().webp({ quality: 78, alphaQuality: 85, effort: 5 }).toFile(`${base}.webp`);
    await img.clone().avif({ quality: 55, effort: 5 }).toFile(`${base}.avif`);
    const [a, w] = await Promise.all([fs.stat(`${base}.avif`), fs.stat(`${base}.webp`)]);
    console.log(`${dir}/${f}  →  avif ${(a.size / 1024).toFixed(0)}KB · webp ${(w.size / 1024).toFixed(0)}KB`);
  }
}
