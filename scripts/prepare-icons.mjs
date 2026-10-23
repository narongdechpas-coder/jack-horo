// Builds the app icons (glowing orb) from scripts/icons/orb.svg
//   src/app/icon.svg        favicon, rounded square
//   src/app/apple-icon.png  iOS home screen (iOS rounds the corners itself)
//   public/icon-192.png, public/icon-512.png  Android / PWA (full bleed, safe for maskable)
import { readFileSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const base = readFileSync(new URL("./icons/orb.svg", import.meta.url), "utf8");
const withBg = (rx) => base.replace("<!--RECT-->", `<rect width="512" height="512" rx="${rx}" fill="url(#bg)"/>`);

writeFileSync("src/app/icon.svg", withBg(112));
const square = Buffer.from(withBg(0));
await sharp(square).resize(180, 180).png({ palette: true, quality: 90, compressionLevel: 9 }).toFile("src/app/apple-icon.png");
for (const size of [192, 512]) await sharp(square).resize(size, size).png({ palette: true, quality: 90, compressionLevel: 9 }).toFile(`public/icon-${size}.png`);
console.log("icons written");
