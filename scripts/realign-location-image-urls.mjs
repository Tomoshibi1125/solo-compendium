/**
 * Locations had a working `image` (real generated webp that exists on disk) but
 * an `image_url` still pointing at the missing placeholder.webp — a broken-image
 * bug wherever the UI reads image_url. This realigns image_url to the entry's
 * own existing image path. Idempotent.
 *
 * Run: node scripts/realign-location-image-urls.mjs
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const FILE = path.resolve(process.cwd(), "src/data/compendium/locations.ts");
const original = await readFile(FILE, "utf8");

let count = 0;
const updated = original.replace(
	/image: "(\/generated\/compendium\/locations\/[^"]+)",(\s*\n\s*)image_url: "\/images\/compendium\/placeholder\.webp"/g,
	(_m, imgPath, ws) => {
		count += 1;
		return `image: "${imgPath}",${ws}image_url: "${imgPath}"`;
	},
);

if (updated !== original) {
	await writeFile(FILE, updated, "utf8");
}
console.log(`Realigned ${count} location image_url -> image`);
