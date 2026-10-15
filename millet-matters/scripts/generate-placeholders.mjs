// Generates every placeholder asset the landing page needs.
// Real assets dropped into public/assets/** with the same filenames replace these.
// Run: npm run assets:placeholders   (then npm run assets:optimize)
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public', 'assets');
const FONT = "'Inter Display', 'Inter', 'DejaVu Sans', sans-serif";

const C = {
  cream: '#F5EDE0', ink: '#1C1A17', field: '#2F5D3A', cocoa: '#5B3A29', turmeric: '#E3A92B',
  crisp: '#D98E3A', ragi: '#7A3B2E', leaf: '#8DB25B',
};

// Deterministic PRNG so placeholders are stable between runs.
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

async function write(file, svg, { format = 'png', quality = 80, width } = {}) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  let img = sharp(Buffer.from(svg));
  if (width) img = img.resize({ width });
  if (format === 'png') img = img.png({ compressionLevel: 9, palette: false });
  if (format === 'webp') img = img.webp({ quality, alphaQuality: 80, effort: 5 });
  await img.toFile(file);
}

/* ------------------------------------------------------------------ grains */

const GRAIN_STYLE = {
  foxtail: { base: '#E9C46A', dark: '#B88A2E', rx: 7, ry: 5 },
  jowar: { base: '#F1E4C8', dark: '#C9A979', rx: 11, ry: 10 },
  little: { base: '#D9C089', dark: '#9E8550', rx: 7, ry: 5.5 },
  kodo: { base: '#B5874F', dark: '#6E4B26', rx: 9, ry: 7 },
  barnyard: { base: '#EDE3CC', dark: '#B8A982', rx: 6.5, ry: 5 },
  ragi: { base: '#9B4A35', dark: '#4F2015', rx: 6.5, ry: 6.5 },
};

function grainDefs(id, g) {
  return `<radialGradient id="${id}" cx="35%" cy="30%" r="75%">
    <stop offset="0" stop-color="#fff" stop-opacity=".85"/>
    <stop offset=".25" stop-color="${g.base}"/>
    <stop offset="1" stop-color="${g.dark}"/>
  </radialGradient>`;
}

function grain(x, y, scale, rot, gid, g) {
  return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${(g.rx * scale).toFixed(1)}" ry="${(g.ry * scale).toFixed(1)}" transform="rotate(${rot.toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})" fill="url(#${gid})"/>`;
}

async function grainMacro(key, label) {
  const g = GRAIN_STYLE[key];
  const r = rng(key.length * 991 + key.charCodeAt(0));
  let body = '';
  // dense macro: big grains (macro lens), shadow pass first
  const n = 260;
  const pts = [];
  for (let i = 0; i < n; i++) pts.push([r() * 860 - 30, r() * 860 - 30, 4.2 + r() * 2.2, r() * 180]);
  pts.sort((a, b) => a[1] - b[1]);
  for (const [x, y, s, rot] of pts) {
    body += `<ellipse cx="${x + 6}" cy="${y + 9}" rx="${g.rx * s}" ry="${g.ry * s}" transform="rotate(${rot} ${x + 6} ${y + 9})" fill="#000" opacity=".28"/>`;
    body += grain(x, y, s, rot, 'g', g);
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <defs>${grainDefs('g', g)}
    <radialGradient id="v" cx="50%" cy="45%" r="70%"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></radialGradient>
  </defs>
  <rect width="800" height="800" fill="${g.dark}"/>
  ${body}
  <rect width="800" height="800" fill="url(#v)"/>
  <g font-family="${FONT}" font-weight="800">
    <rect x="24" y="742" width="${label.length * 13 + 150}" height="34" rx="17" fill="#1C1A17" opacity=".75"/>
    <text x="40" y="765" fill="#F5EDE0" font-size="15" letter-spacing="2">PLACEHOLDER · ${esc(label.toUpperCase())} MACRO</text>
  </g></svg>`;
  await write(path.join(OUT, 'grains', `${key}.webp`), svg, { format: 'webp', quality: 72 });
}

/* ------------------------------------------------------------------ dishes */
// Each dish is a <g> drawn in a 1000×1000 box, centred near (500, 520).

function chipDots(r, cx, cy, rx, ry, n, color, size = 9) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const a = r() * Math.PI * 2, d = Math.sqrt(r());
    const x = cx + Math.cos(a) * rx * d, y = cy + Math.sin(a) * ry * d;
    s += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${size}" ry="${size * 0.75}" fill="${color}"/>`;
  }
  return s;
}

const plate = (rx = 400, ry = 150, cy = 640) => `
  <ellipse cx="500" cy="${cy + 22}" rx="${rx + 10}" ry="${ry + 8}" fill="#000" opacity=".18"/>
  <ellipse cx="500" cy="${cy}" rx="${rx}" ry="${ry}" fill="#FBF7F0"/>
  <ellipse cx="500" cy="${cy - 4}" rx="${rx * 0.78}" ry="${ry * 0.74}" fill="#EFE7DA"/>`;

const DISHES = {
  pancakes(r) {
    let s = plate();
    for (let i = 0; i < 4; i++) {
      const y = 600 - i * 58;
      s += `<ellipse cx="500" cy="${y + 26}" rx="250" ry="78" fill="#9C5B25"/>
            <rect x="250" y="${y - 6}" width="500" height="32" fill="#B9742F"/>
            <ellipse cx="500" cy="${y - 6}" rx="250" ry="78" fill="#D9A15A"/>
            <ellipse cx="500" cy="${y - 10}" rx="205" ry="58" fill="#E6B771" opacity=".7"/>`;
    }
    s += `<path d="M330 400 C380 360 440 430 500 395 S620 360 670 410 L660 455 C600 430 560 470 500 450 S390 470 340 445Z" fill="#3B2116"/>`;
    s += chipDots(r, 500, 400, 200, 55, 26, '#2A160E', 10);
    s += `<rect x="470" y="352" width="70" height="44" rx="8" fill="#FFF3C9"/><rect x="470" y="352" width="70" height="14" rx="6" fill="#fff" opacity=".7"/>`;
    return s;
  },
  khichdi(r) {
    let s = `<ellipse cx="500" cy="760" rx="330" ry="60" fill="#000" opacity=".18"/>
      <path d="M170 520 Q180 770 500 790 Q820 770 830 520Z" fill="#8A4B2A"/>
      <path d="M200 540 Q215 740 500 760 Q785 740 800 540Z" fill="#A65E36" opacity=".6"/>
      <ellipse cx="500" cy="520" rx="330" ry="92" fill="#6E3A1F"/>
      <ellipse cx="500" cy="512" rx="300" ry="78" fill="#E9B949"/>
      <path d="M260 505 Q380 420 500 440 T740 505 Q620 560 500 560 T260 505Z" fill="#F2CA62"/>`;
    s += chipDots(r, 500, 500, 250, 55, 30, '#7FA34B', 9);
    s += chipDots(r, 500, 500, 250, 55, 40, '#5A3A1C', 4);
    s += `<ellipse cx="560" cy="470" rx="70" ry="18" fill="#FFF6D6" opacity=".75"/>`;
    for (let i = 0; i < 3; i++) {
      const x = 400 + i * 100;
      s += `<path d="M${x} 400 C${x - 40} 340 ${x + 40} 300 ${x} 240 C${x - 30} 200 ${x + 20} 170 ${x} 140" stroke="#FFFFFF" stroke-opacity=".55" stroke-width="14" fill="none" stroke-linecap="round"/>`;
    }
    return s;
  },
  dosa(r) {
    let s = plate(430, 150, 660);
    s += `<path d="M150 600 L840 470 L860 560 L170 690Z" fill="#B8672A"/>
          <path d="M150 600 L840 470 Q760 420 600 430 Q330 470 150 600Z" fill="#D98E3A"/>
          <path d="M150 600 L860 560 L840 470Z" fill="#E7A858"/>`;
    for (let i = 0; i < 9; i++) {
      const x = 220 + i * 70;
      s += `<path d="M${x} ${590 - i * 13} q30 -14 60 -8" stroke="#8C4615" stroke-width="5" fill="none" opacity=".55"/>`;
    }
    s += `<ellipse cx="300" cy="720" rx="78" ry="30" fill="#E8E2D2"/><ellipse cx="300" cy="712" rx="66" ry="22" fill="#F7F3E8"/>
          <ellipse cx="700" cy="725" rx="78" ry="30" fill="#E8E2D2"/><ellipse cx="700" cy="717" rx="66" ry="22" fill="#C2462B"/>`;
    return s;
  },
  cookies(r) {
    let s = plate(420, 150, 660);
    const spots = [[360, 560, 130], [600, 540, 125], [480, 650, 120]];
    for (const [x, y, rr] of spots) {
      s += `<ellipse cx="${x}" cy="${y + 14}" rx="${rr}" ry="${rr * 0.45}" fill="#4A1F14"/>
            <ellipse cx="${x}" cy="${y}" rx="${rr}" ry="${rr * 0.45}" fill="#7A3B2E"/>
            <ellipse cx="${x - 20}" cy="${y - 8}" rx="${rr * 0.6}" ry="${rr * 0.22}" fill="#94503D" opacity=".7"/>`;
      s += chipDots(r, x, y, rr * 0.75, rr * 0.3, 8, '#2A120B', 8);
    }
    for (const [x, y] of [[230, 680], [770, 670], [720, 760]]) {
      s += `<circle cx="${x}" cy="${y}" r="52" fill="#3E1C14"/><circle cx="${x - 14}" cy="${y - 16}" r="22" fill="#5D2E22"/>`;
      s += chipDots(r, x, y, 36, 36, 6, '#C99A5B', 4);
    }
    return s;
  },
  idli(r) {
    let s = plate(420, 150, 660);
    for (const [x, y] of [[360, 600], [560, 590], [460, 690]]) {
      s += `<ellipse cx="${x}" cy="${y + 20}" rx="120" ry="44" fill="#D8D0BE"/>
            <ellipse cx="${x}" cy="${y}" rx="120" ry="52" fill="#FBF9F3"/>
            <ellipse cx="${x - 20}" cy="${y - 14}" rx="60" ry="18" fill="#fff"/>`;
      s += chipDots(r, x, y, 90, 34, 10, '#E6DECA', 5);
    }
    s += `<ellipse cx="760" cy="720" rx="90" ry="34" fill="#9C4A22"/><ellipse cx="760" cy="712" rx="76" ry="24" fill="#D7742F"/>`;
    return s;
  },
  chilla(r) {
    let s = plate(420, 150, 660);
    s += `<ellipse cx="500" cy="620" rx="330" ry="120" fill="#C79A3B"/>
          <ellipse cx="500" cy="612" rx="315" ry="110" fill="#E6C25A"/>
          <path d="M180 615 Q500 470 820 615 Q500 560 180 615Z" fill="#D4A944"/>`;
    s += chipDots(r, 500, 612, 270, 85, 40, '#5C8A2E', 8);
    s += chipDots(r, 500, 612, 270, 85, 26, '#B8361F', 6);
    s += chipDots(r, 500, 612, 270, 85, 30, '#8A5A1F', 4);
    return s;
  },
  'ragi-delight'(r) {
    let s = `<ellipse cx="500" cy="770" rx="290" ry="55" fill="#000" opacity=".18"/>
      <path d="M220 470 Q230 760 500 780 Q770 760 780 470Z" fill="#E9E2D3"/>
      <ellipse cx="500" cy="470" rx="280" ry="80" fill="#D5CCB9"/>
      <ellipse cx="500" cy="474" rx="255" ry="66" fill="#7A3B2E"/>
      <path d="M330 470 Q420 430 500 455 T680 465" stroke="#A35A45" stroke-width="16" fill="none" stroke-linecap="round"/>`;
    s += chipDots(r, 500, 470, 190, 42, 18, '#C9A66B', 6);
    return s;
  },
};

function dishSvg(key, size = 1000) {
  const r = rng(key.length * 7919);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 1000 1000">${DISHES[key](r)}</svg>`;
}

async function dishPhoto(key) {
  const svg = dishSvg(key).replace(
    '</svg>',
    `<g font-family="${FONT}" font-weight="800"><rect x="320" y="900" width="360" height="40" rx="20" fill="#1C1A17" opacity=".7"/>
     <text x="500" y="927" fill="#F5EDE0" font-size="17" letter-spacing="2.5" text-anchor="middle">PLACEHOLDER · PLATED DISH</text></g></svg>`,
  );
  await write(path.join(OUT, 'dishes', `${key}.png`), svg, { width: 900 });
}

/* ------------------------------------------------------------------- packs */

function wrapTitle(title, max = 14) {
  const words = title.split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > max) { lines.push(cur.trim()); cur = w; } else cur += ' ' + w;
  }
  if (cur.trim()) lines.push(cur.trim());
  return lines;
}

async function pack({ file, title, millet, weight, body, ink, label, dish }) {
  const lines = wrapTitle(title.toUpperCase());
  const fs0 = lines.length > 3 ? 46 : 54;
  const titleSvg = lines
    .map((l, i) => `<text x="400" y="${300 + i * (fs0 + 4)}" text-anchor="middle" font-size="${fs0}" letter-spacing="-1">${esc(l)}</text>`)
    .join('');
  const dishG = dish ? `<g transform="translate(250 ${300 + lines.length * (fs0 + 4) + 10}) scale(.3)">${DISHES[dish](rng(3))}</g>` : '';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
  <defs>
    <linearGradient id="sh" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".28"/><stop offset=".18" stop-color="#000" stop-opacity="0"/><stop offset=".72" stop-color="#fff" stop-opacity=".12"/><stop offset=".8" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></linearGradient>
    <clipPath id="p"><path d="M140 70 Q140 48 162 48 L638 48 Q660 48 660 70 L688 900 Q690 952 640 956 L160 956 Q110 952 112 900Z"/></clipPath>
  </defs>
  <ellipse cx="400" cy="962" rx="300" ry="22" fill="#000" opacity=".22"/>
  <g clip-path="url(#p)">
    <rect width="800" height="1000" fill="${body}"/>
    <rect y="48" width="800" height="84" fill="#000" opacity=".14"/>
    ${Array.from({ length: 26 }, (_, i) => `<rect x="${140 + i * 20}" y="60" width="2" height="60" fill="#000" opacity=".12"/>`).join('')}
    <g font-family="${FONT}" font-weight="900" fill="${ink}">
      <text x="400" y="196" text-anchor="middle" font-size="26" letter-spacing="9">MILLET MATTERS</text>
      <rect x="330" y="214" width="140" height="3" fill="${ink}"/>
      ${titleSvg}
    </g>
    ${dishG}
    <rect x="150" y="790" width="500" height="96" rx="48" fill="${label}"/>
    <g font-family="${FONT}" font-weight="800" fill="${body}" text-anchor="middle">
      <text x="400" y="832" font-size="26" letter-spacing="2">${esc(millet.toUpperCase())}</text>
      <text x="400" y="866" font-size="20" letter-spacing="3" opacity=".85">${weight} G · NO MAIDA</text>
    </g>
    <text x="400" y="928" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="15" letter-spacing="3" fill="${ink}" opacity=".7">PLACEHOLDER PACK SHOT</text>
    <rect width="800" height="1000" fill="url(#sh)"/>
  </g></svg>`;
  await write(path.join(OUT, 'packs', file), svg);
}

/* -------------------------------------------------------- transformation */

function sampleInside(r, n, cx, cy, rx, ry) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = r() * Math.PI * 2, d = Math.sqrt(r());
    pts.push([cx + Math.cos(a) * rx * d, cy + Math.sin(a) * ry * d]);
  }
  return pts;
}

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp = (v) => Math.max(0, Math.min(1, v));

async function sequence(chapter, grains, dish, frames, target) {
  const r = rng(chapter.length * 31337);
  const N = 150;
  const parts = [];
  const tgt = sampleInside(r, N, ...target);
  for (let i = 0; i < N; i++) {
    const g = grains[i % grains.length];
    parts.push({
      g, gi: i % grains.length,
      x0: 80 + r() * 840, y0: 60 + r() * 880,
      x1: tgt[i][0], y1: tgt[i][1],
      s: 1.4 + r() * 1.2, rot: r() * 180, spin: (r() - 0.5) * 220,
      delay: r() * 0.25,
    });
  }
  const dishG = DISHES[dish](rng(dish.length * 7919));
  const dir = path.join(OUT, 'sequences', chapter);
  await fs.rm(dir, { recursive: true, force: true });
  await fs.mkdir(dir, { recursive: true });
  const defs = grains.map((k, i) => grainDefs(`g${i}`, GRAIN_STYLE[k])).join('');
  for (let f = 0; f < frames; f++) {
    const t = f / (frames - 1);
    const move = ease(clamp(t / 0.62));
    const dishIn = ease(clamp((t - 0.45) / 0.45));
    const fade = 1 - clamp((t - 0.6) / 0.3);
    let gs = '';
    for (const p of parts) {
      const m = ease(clamp((move - p.delay) / (1 - p.delay)));
      const x = p.x0 + (p.x1 - p.x0) * m;
      const y = p.y0 + (p.y1 - p.y0) * m;
      const sc = p.s * (1 - 0.35 * m);
      gs += grain(x, y, sc, p.rot + p.spin * m, `g${p.gi}`, GRAIN_STYLE[p.g]);
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="720" viewBox="0 0 1000 1000">
      <defs>${defs}</defs>
      <g opacity="${dishIn.toFixed(3)}" transform="translate(500 540) scale(${(0.86 + 0.14 * dishIn).toFixed(3)}) translate(-500 -540)">${dishG}</g>
      <g opacity="${fade.toFixed(3)}">${gs}</g>
    </svg>`;
    await write(path.join(dir, `${String(f + 1).padStart(4, '0')}.webp`), svg, { format: 'webp', quality: 62 });
  }
}

/* ------------------------------------------------------------------ others */

async function logo() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="72" viewBox="0 0 360 72">
  <g fill="#2F5D3A">
    <ellipse cx="22" cy="36" rx="9" ry="16" transform="rotate(-24 22 36)"/>
    <ellipse cx="44" cy="30" rx="9" ry="16" transform="rotate(18 44 30)"/>
    <ellipse cx="36" cy="54" rx="7" ry="11" transform="rotate(-70 36 54)"/>
  </g>
  <text x="66" y="47" font-family="'Arial Black', 'Inter Display', 'Inter', sans-serif" font-weight="900" font-size="30" letter-spacing="-0.5" fill="#1C1A17">MILLET MATTERS</text>
</svg>`;
  await fs.mkdir(path.join(OUT, 'brand'), { recursive: true });
  await fs.writeFile(path.join(OUT, 'brand', 'logo.svg'), svg);
}

async function ugc(i) {
  const keys = ['pancakes', 'khichdi', 'dosa', 'cookies', 'idli', 'chilla'];
  const bgs = [C.cocoa, C.turmeric, C.crisp, C.ragi, C.leaf, C.field];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 1000 1000">
    <rect width="1000" height="1000" fill="${bgs[i]}"/>
    ${DISHES[keys[i]](rng(i + 5))}
    <g font-family="${FONT}" font-weight="800"><rect x="250" y="880" width="500" height="54" rx="27" fill="#1C1A17" opacity=".75"/>
    <text x="500" y="916" fill="#F5EDE0" font-size="24" letter-spacing="3" text-anchor="middle">UGC PLACEHOLDER ${i + 1}</text></g></svg>`;
  await write(path.join(OUT, 'ugc', `ugc-${i + 1}.webp`), svg, { format: 'webp', quality: 70 });
}

/* -------------------------------------------------------------------- run */

const PACKS = [
  { file: 'double-chocochip-pancake.png', title: 'Double Chocochip Pancake Mix', millet: 'Jowar + Foxtail', weight: 175, body: C.cocoa, ink: C.cream, label: C.cream, dish: 'pancakes' },
  { file: 'vanilla-chocochip-pancake.png', title: 'Vanilla Chocochip Pancake Mix', millet: 'Jowar + Foxtail', weight: 175, body: '#EBD9B4', ink: C.cocoa, label: C.cocoa, dish: 'pancakes' },
  { file: 'instant-khichdi.png', title: 'Instant Khichdi Mix', millet: 'Kodo Millet', weight: 175, body: C.turmeric, ink: C.ink, label: C.ink, dish: 'khichdi' },
  { file: 'instant-dosa.png', title: 'Instant Dosa Mix', millet: 'Little Millet', weight: 175, body: C.crisp, ink: C.ink, label: C.ink, dish: 'dosa' },
  { file: 'instant-idli.png', title: 'Instant Idli Mix', millet: 'Barnyard Millet', weight: 175, body: C.leaf, ink: C.ink, label: C.ink, dish: 'idli' },
  { file: 'instant-chilla.png', title: 'Instant Chilla Mix', millet: 'Foxtail Millet', weight: 175, body: C.field, ink: C.cream, label: C.cream, dish: 'chilla' },
  { file: 'sprouted-ragi-delight.png', title: 'Classic Sprouted Ragi Delight', millet: 'Ragi', weight: 175, body: C.ragi, ink: C.cream, label: C.cream, dish: 'ragi-delight' },
  { file: 'ragi-cookies.png', title: 'Ragi Cookies', millet: 'Ragi', weight: 100, body: C.ragi, ink: C.cream, label: C.cream, dish: 'cookies' },
  { file: 'jowar-cookies.png', title: 'Jowar Cookies', millet: 'Jowar', weight: 100, body: '#C9A66B', ink: C.ink, label: C.ink, dish: 'cookies' },
  { file: 'multi-millet-chocochip-cookies.png', title: 'Multi-Millet Chocochip Cookies', millet: 'Multi-millet', weight: 100, body: C.cocoa, ink: C.cream, label: C.cream, dish: 'cookies' },
  { file: 'multi-millet-almond-cashew-cookies.png', title: 'Multi-Millet Almond Cashew Cookies', millet: 'Multi-millet', weight: 100, body: '#B9824F', ink: C.ink, label: C.ink, dish: 'cookies' },
  { file: 'ragi-chocolate-energy-bites.png', title: 'Ragi Chocolate Energy Bites', millet: 'Ragi', weight: 100, body: '#4A2A22', ink: C.cream, label: C.cream, dish: 'cookies' },
  { file: 'barnyard-dryfruit-energy-bites.png', title: 'Barnyard Dryfruit Energy Bites', millet: 'Barnyard', weight: 100, body: '#A7B26B', ink: C.ink, label: C.ink, dish: 'cookies' },
];

const only = process.argv[2];
const FRAMES = Number(process.env.FRAMES || 60);

if (!only || only === 'static') {
  await logo();
  for (const p of PACKS) await pack(p);
  for (const d of Object.keys(DISHES)) await dishPhoto(d);
  const names = { foxtail: 'Foxtail', jowar: 'Jowar', little: 'Little Millet', kodo: 'Kodo', barnyard: 'Barnyard', ragi: 'Ragi' };
  for (const [k, v] of Object.entries(names)) await grainMacro(k, v);
  for (let i = 0; i < 6; i++) await ugc(i);
  console.log('static placeholders done');
}
if (!only || only === 'sequences') {
  // target = ellipse the grains converge into: [cx, cy, rx, ry] in the 1000 box
  await sequence('pancake', ['jowar', 'foxtail'], 'pancakes', FRAMES, [500, 480, 240, 130]);
  await sequence('khichdi', ['kodo'], 'khichdi', FRAMES, [500, 500, 280, 70]);
  await sequence('dosa', ['little'], 'dosa', FRAMES, [500, 560, 330, 70]);
  await sequence('cookie', ['ragi'], 'cookies', FRAMES, [500, 600, 300, 110]);
  console.log(`sequences done (${FRAMES} frames each)`);
}
