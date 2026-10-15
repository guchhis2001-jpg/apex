// WCAG AA check (4.5:1, normal text) for every bg/text pairing in src/config/theme.json.
// Run: npm run contrast
import fs from 'node:fs';
const theme = JSON.parse(fs.readFileSync(new URL('../src/config/theme.json', import.meta.url)));
const lum = (hex) => {
  const c = hex.replace('#', '').match(/../g).map((h) => parseInt(h, 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
let fail = 0;
const check = (group, name, bg, ink) => {
  const r = ratio(bg, ink);
  if (r < 4.5) fail++;
  console.log(`${r >= 4.5 ? 'AA  ' : 'FAIL'}  ${r.toFixed(2).padStart(5)}:1  ${(group + '/' + name).padEnd(34)} ${ink} on ${bg}`);
};
for (const g of ['chapters', 'surfaces', 'moments']) {
  for (const [n, v] of Object.entries(theme[g])) {
    check(g, n, v.bg, v.ink);
    if (v.accent) check(g, n + ' (accent text)', v.bg, v.accent);
  }
}
console.log(fail ? `\n${fail} pairing(s) below AA` : '\nAll pairings pass WCAG AA');
process.exit(fail ? 1 : 0);
