import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const manifest = JSON.parse(
  readFileSync(resolve(root, "dist/server/.vite/manifest.json"), "utf-8")
);

// Locate CSS and JS entry assets from the manifest
const cssEntry = Object.values(manifest).find((v) =>
  v.file?.endsWith(".css")
);
const jsEntries = Object.values(manifest).filter(
  (v) => v.file?.startsWith("assets/") && v.file?.endsWith(".js") && !v.isDynamicEntry
);

const cssFile = cssEntry?.file ?? "";

// The two non-dynamic JS chunks land in dist/client — find them via disk
import { readdirSync } from "fs";
const clientAssets = readdirSync(resolve(root, "dist/client/assets"));
const jsFiles = clientAssets.filter((f) => f.endsWith(".js"));

// Larger file = main bundle (React + app), smaller = entry that imports it
const sorted = jsFiles
  .map((f) => ({
    name: f,
    size: readFileSync(resolve(root, "dist/client/assets", f)).length,
  }))
  .sort((a, b) => a.size - b.size);

const entryJs = sorted[0]?.name; // smaller file is the entry (imports the big one)
const mainJs = sorted[1]?.name;  // larger file is the main bundle

const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Apex — The Agency Behind the Game</title>
    <meta name="description" content="Apex is a premium sports marketing agency: social, PR, paid ads, content &amp; sponsorship sales for leagues and teams." />
    ${cssFile ? `<link rel="stylesheet" crossorigin href="/assets/${cssFile.replace("assets/", "")}" />` : ""}
    ${mainJs ? `<link rel="modulepreload" crossorigin href="/assets/${mainJs}" />` : ""}
    ${entryJs ? `<script type="module" crossorigin src="/assets/${entryJs}"></script>` : ""}
  </head>
  <body>
  </body>
</html>
`;

writeFileSync(resolve(root, "dist/client/index.html"), html);
console.log(`✓ Generated dist/client/index.html (entry: ${entryJs}, css: ${cssFile})`);
