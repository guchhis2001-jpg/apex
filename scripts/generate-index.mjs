import { readFileSync, writeFileSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const manifest = JSON.parse(
  readFileSync(resolve(root, "dist/server/.vite/manifest.json"), "utf-8")
);

// Find CSS from the manifest
const cssEntry = Object.values(manifest).find((v) => v.file?.endsWith(".css"));
const cssFile = cssEntry?.file?.replace("assets/", "") ?? "";

// Find the bootstrap entry: the JS file that contains the hydrateRoot call
const clientAssets = readdirSync(resolve(root, "dist/client/assets"));
const jsFiles = clientAssets.filter((f) => f.endsWith(".js"));

let entryJs = null;
const preloadJs = [];

for (const f of jsFiles) {
  const content = readFileSync(resolve(root, "dist/client/assets", f), "utf-8");
  if (content.includes("hydrateRoot")) {
    entryJs = f;
  } else {
    preloadJs.push(f);
  }
}

if (!entryJs) {
  // Fallback: use the largest JS file
  entryJs = jsFiles
    .map((f) => ({ name: f, size: readFileSync(resolve(root, "dist/client/assets", f)).length }))
    .sort((a, b) => b.size - a.size)[0]?.name;
}

const preloadTags = preloadJs
  .map((f) => `    <link rel="modulepreload" crossorigin href="/assets/${f}" />`)
  .join("\n");

const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Apex — The Agency Behind the Game</title>
    <meta name="description" content="Apex is a premium sports marketing agency: social, PR, paid ads, content &amp; sponsorship sales for leagues and teams." />
    ${cssFile ? `<link rel="stylesheet" crossorigin href="/assets/${cssFile}" />` : ""}
${preloadTags}
    <script type="module" crossorigin src="/assets/${entryJs}"></script>
  </head>
  <body>
  </body>
</html>
`;

writeFileSync(resolve(root, "dist/client/index.html"), html);
console.log(`✓ Generated dist/client/index.html`);
console.log(`  entry:   ${entryJs}`);
console.log(`  preload: ${preloadJs.join(", ")}`);
console.log(`  css:     ${cssFile}`);
