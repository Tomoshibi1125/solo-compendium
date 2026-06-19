/**
 * Generates the static compendium fallback image:
 *   public/images/compendium/placeholder.webp
 *
 * This file is referenced by entries that have no bespoke art (e.g. pantheon).
 * It was missing from the repo, which made those entries render a broken image.
 * Rendered programmatically with sharp (no AI) so it is fully reproducible.
 *
 * Run: node scripts/make-placeholder.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const OUT_DIR = path.resolve(process.cwd(), "public", "images", "compendium");
const OUT_FILE = path.join(OUT_DIR, "placeholder.webp");
const SIZE = 1024;

const svg = `<svg width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bg" cx="50%" cy="42%" r="75%">
      <stop offset="0%" stop-color="#1b1830"/>
      <stop offset="55%" stop-color="#100e1c"/>
      <stop offset="100%" stop-color="#08070d"/>
    </radialGradient>
    <linearGradient id="rift" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#7c5cff"/>
      <stop offset="50%" stop-color="#9d7bff"/>
      <stop offset="100%" stop-color="#3aa0ff"/>
    </linearGradient>
    <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="26" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="${SIZE}" height="${SIZE}" fill="url(#bg)"/>
  <g filter="url(#glow)" opacity="0.92">
    <path d="M512 232 C 600 360, 600 664, 512 792 C 424 664, 424 360, 512 232 Z" fill="url(#rift)" opacity="0.20"/>
    <path d="M512 300 C 556 410, 556 614, 512 724 C 468 614, 468 410, 512 300 Z" fill="url(#rift)"/>
    <ellipse cx="512" cy="512" rx="20" ry="118" fill="#0a0814"/>
  </g>
  <circle cx="512" cy="512" r="300" fill="none" stroke="#5b4b8a" stroke-opacity="0.28" stroke-width="2"/>
  <text x="512" y="892" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif"
        font-size="46" letter-spacing="10" fill="#b9aee0" fill-opacity="0.85">RIFT ASCENDANT</text>
  <text x="512" y="936" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif"
        font-size="24" letter-spacing="6" fill="#6f659a" fill-opacity="0.7">NO IMAGE AVAILABLE</text>
</svg>`;

await mkdir(OUT_DIR, { recursive: true });
const buf = await sharp(Buffer.from(svg)).webp({ quality: 86 }).toBuffer();
await writeFile(OUT_FILE, buf);
console.log(`Wrote ${OUT_FILE} (${buf.length} bytes, ${SIZE}x${SIZE})`);
