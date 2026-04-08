import fs from "node:fs";
import path from "node:path";
import axios from "axios";
import sharp from "sharp";
import { anomalies } from "../src/data/compendium/anomalies";
import { allItems as rawItems } from "../src/data/compendium/items-index";

import type { CompendiumItem } from "../src/types/compendium";

const vehicles = (rawItems as CompendiumItem[]).filter(
	(x) => x.item_type === "vehicle",
);

const PUBLIC_DIR = path.resolve(process.cwd(), "public");

// Distinct colors for placeholders
const colors = [
	"#ef4444",
	"#f97316",
	"#f59e0b",
	"#84cc16",
	"#22c55e",
	"#10b981",
	"#14b8a6",
	"#06b6d4",
	"#0ea5e9",
	"#3b82f6",
	"#6366f1",
	"#8b5cf6",
	"#a855f7",
	"#d946ef",
	"#f43f5e",
];

async function generatePlaceholder(name: string, outPath: string) {
	const initials = name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.substring(0, 2)
		.toUpperCase();
	const color = colors[name.length % colors.length];

	const svg = `
    <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}" />
      <circle cx="256" cy="256" r="230" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="12" />
      <text x="50%" y="54%" font-family="Arial, sans-serif" font-size="200" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">
        ${initials}
      </text>
    </svg>
  `;

	const dir = path.dirname(outPath);
	if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

	await sharp(Buffer.from(svg)).webp({ quality: 90 }).toFile(outPath);
}

async function searchWikimedia(query: string): Promise<string | null> {
	// Extract just the core noun, e.g. "System Drone" -> "Drone", "Storm Wyvern" -> "Wyvern"
	const terms = query.split(" ");
	const coreTerm = terms[terms.length - 1];

	try {
		const res = await axios.get(
			`https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(`${coreTerm} art|drawing|illustration`)}&gsrnamespace=6&gsrlimit=1&prop=imageinfo&iiprop=url&format=json`,
		);

		const pages = res.data?.query?.pages;
		if (!pages) return null;

		const firstPageId = Object.keys(pages)[0];
		const url = pages[firstPageId]?.imageinfo?.[0]?.url;
		return url || null;
	} catch {
		return null;
	}
}

async function downloadImage(url: string, outPath: string): Promise<boolean> {
	try {
		const response = await axios({
			url,
			method: "GET",
			responseType: "arraybuffer",
			timeout: 8000,
		});
		const dir = path.dirname(outPath);
		if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

		await sharp(Buffer.from(response.data))
			.resize(512, 512, { fit: "cover" })
			.webp({ quality: 80 })
			.toFile(outPath);
		return true;
	} catch {
		return false;
	}
}

async function processEntry(entryName: string, imagePathStr: string) {
	if (!imagePathStr) return;
	const fullPath = path.join(PUBLIC_DIR, imagePathStr);

	if (fs.existsSync(fullPath)) return;

	console.log(`Missing image for: ${entryName}. Searching Wikimedia...`);
	const url = await searchWikimedia(entryName);

	if (url) {
		const success = await downloadImage(url, fullPath);
		if (success) {
			console.log(`  -> Downloaded ${url}`);
			return;
		}
	}

	console.log(`  -> Not found or failed. Generating placeholder.`);
	await generatePlaceholder(entryName, fullPath);
}

async function main() {
	console.log("Scanning vehicles...");
	for (const v of vehicles) {
		if (v.image) await processEntry(v.name, v.image);
	}

	console.log("Scanning anomalies/companions/mounts...");
	for (const m of anomalies) {
		if (m.image) await processEntry(m.name, m.image);
	}

	console.log("Finished processing tokens.");
}

main().catch(console.error);
