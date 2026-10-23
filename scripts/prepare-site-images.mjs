// Convert the Cosmic Neon artwork (docs/design/image-assets.md) into responsive WebP files.
// Usage: node scripts/prepare-site-images.mjs <folder with IMG-01.png … IMG-10.png>
// Originals stay outside the repo; the output and src/lib/art-manifest.json are committed.
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ASSETS = [
  { id: "IMG-01", name: "hero-wide", widths: [800, 1280, 1920] },
  { id: "IMG-01M", name: "hero-tall", widths: [480, 800, 1200] },
  { id: "IMG-02", name: "cat-thai-seven", widths: [480, 960] },
  { id: "IMG-03", name: "cat-playing-cards", widths: [480, 960] },
  { id: "IMG-04", name: "cat-tarot", widths: [480, 960] },
  { id: "IMG-05", name: "cat-oraculum", widths: [480, 960] },
  { id: "IMG-06", name: "cat-bazi", widths: [480, 960] },
  { id: "IMG-07", name: "daily", widths: [480, 900] },
  { id: "IMG-08", name: "cat-zodiac", widths: [480, 960] },
  { id: "IMG-09", name: "cat-iching", widths: [480, 960] },
  { id: "IMG-10", name: "cat-numerology", widths: [480, 960] },
];

const src = process.argv[2];
if (!src) throw new Error("usage: node scripts/prepare-site-images.mjs <source folder>");
const out = path.resolve("public/art");
await mkdir(out, { recursive: true });

const manifest = {};
for (const a of ASSETS) {
  const input = sharp(path.join(src, `${a.id}.png`));
  const { width, height } = await input.metadata();
  // Never upscale: the largest variant is capped at the original width.
  const widths = [...new Set(a.widths.map((w) => Math.min(w, width)))];
  for (const w of widths) {
    await input.clone().resize({ width: w }).webp({ quality: 72 }).toFile(path.join(out, `${a.name}-${w}.webp`));
  }
  manifest[a.name] = { id: a.id, width, height, widths };
  console.log(a.id, "→", a.name, widths.join("/"));
}
await writeFile("src/lib/art-manifest.json", JSON.stringify(manifest, null, 2) + "\n");
