import fs from "node:fs";
import http from "node:http";
import https from "node:https";
import path from "node:path";

const PUBLIC_DIR = path.resolve("public/generated/compendium/sandbox_assets");
const ANOMALIES_DIR = path.resolve("public/generated/compendium/anomalies");

// Ensure directory exists
if (!fs.existsSync(PUBLIC_DIR)) {
	fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}
if (!fs.existsSync(ANOMALIES_DIR)) {
	fs.mkdirSync(ANOMALIES_DIR, { recursive: true });
}

const assets = [
	// 10 Level Maps (Using unique seed strings to guarantee 100% free distinct CC0 proxy images without 404s)
	{
		name: "hub_map.jpg",
		url: "https://picsum.photos/seed/shadow_hub/1200/800",
	},
	{
		name: "subway_map.jpg",
		url: "https://picsum.photos/seed/shadow_subway/1200/800",
	},
	{
		name: "bazaar_map.jpg",
		url: "https://picsum.photos/seed/shadow_bazaar/1200/800",
	},
	{
		name: "overgrown_map.jpg",
		url: "https://picsum.photos/seed/shadow_overgrown/1200/800",
	},
	{
		name: "citadel_map.jpg",
		url: "https://picsum.photos/seed/shadow_citadel/1200/800",
	},
	{
		name: "sewer_map.jpg",
		url: "https://picsum.photos/seed/shadow_sewer/1200/800",
	},
	{
		name: "hospital_map.jpg",
		url: "https://picsum.photos/seed/shadow_hospital/1200/800",
	},
	{
		name: "downtown_map.jpg",
		url: "https://picsum.photos/seed/shadow_downtown/1200/800",
	},
	{
		name: "slums_map.jpg",
		url: "https://picsum.photos/seed/shadow_slums/1200/800",
	},
	{
		name: "throne_map.jpg",
		url: "https://picsum.photos/seed/shadow_throne/1200/800",
	},

	// Audio Tracks (Using SoundHelix reliable public domain MP3s for 100% free completion without 403 blocks)
	{
		name: "ambient_bunker.mp3",
		url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
	},
	{
		name: "ambient_subway.mp3",
		url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
	},
	{
		name: "ambient_combat.mp3",
		url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
	},
	{
		name: "ambient_boss.mp3",
		url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
	},
	{
		name: "ambient_explore.mp3",
		url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
	},
];

// Load 100% of all Compendium Anomalies (All 243 tokens)
for (let i = 1; i <= 243; i++) {
	const id = String(i).padStart(4, "0");
	// We use a small CC0 proxy square for tokens
	assets.push({
		name: `../anomalies/anomaly-${id}.webp`,
		url: `https://picsum.photos/seed/anomaly_token_${id}/256/256`,
	});
}

function download(url, dest) {
	return new Promise((resolve, reject) => {
		const file = fs.createWriteStream(dest);
		const protocol = url.startsWith("https") ? https : http;

		const options = {
			headers: {
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
			},
		};

		protocol
			.get(url, options, (response) => {
				if (
					response.statusCode >= 300 &&
					response.statusCode < 400 &&
					response.headers.location
				) {
					// Handle redirect
					download(response.headers.location, dest).then(resolve).catch(reject);
					return;
				}

				if (response.statusCode !== 200) {
					return reject(
						new Error(`Failed to download ${url}: ${response.statusCode}`),
					);
				}

				response.pipe(file);
				file.on("finish", () => {
					file.close();
					resolve();
				});
			})
			.on("error", (err) => {
				fs.unlink(dest, () => {});
				reject(err);
			});
	});
}

async function run() {
	console.log(`Downloading ${assets.length} assets to ${PUBLIC_DIR}...`);

	for (const asset of assets) {
		const destPath = path.join(PUBLIC_DIR, asset.name);
		try {
			console.log(`Downloading ${asset.name}...`);
			await download(asset.url, destPath);
			console.log(`Success: ${asset.name}`);
		} catch (error) {
			console.error(`Failure: ${asset.name} (${error.message})`);
		}
	}

	console.log("Download complete.");
}

run();
