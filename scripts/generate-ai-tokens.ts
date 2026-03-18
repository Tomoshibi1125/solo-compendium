import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { vehicles } from "../src/data/compendium/items-vehicles";
import { monsters } from "../src/data/compendium/monsters";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
	console.error("Please set GEMINI_API_KEY environment variable");
	process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

const PUBLIC_DIR = path.resolve("public");

// Collect all new entries that need tokens
const allItems = [
	...monsters
		.filter(
			(x) =>
				x.id.startsWith("companion-") ||
				x.id.startsWith("mount-") ||
				x.id.startsWith("pet-"),
		)
		.map((x) => ({ name: x.name, img: (x as any).image, desc: x.description })),
	...vehicles
		.filter((x) => x.item_type === "vehicle")
		.map((x) => ({ name: x.name, img: (x as any).image, desc: x.description })),
].filter((x) => x.img);

async function generateToken(item: any) {
	const fullPath = path.join(PUBLIC_DIR, item.img);
	if (fs.existsSync(fullPath)) {
		// Check if it's a real image (>10KB) or a placeholder (<10KB)
		const stats = fs.statSync(fullPath);
		if (stats.size > 10000) {
			console.log(
				`Skipping ${item.name}, already has a real image (${stats.size} bytes)`,
			);
			return;
		}
		console.log(
			`Replacing placeholder for ${item.name} (${stats.size} bytes)...`,
		);
	}

	console.log(`[Generating] ${item.name}...`);
	const prompt = `VTT Token art, portrait style, of a fantasy creature called "${item.name}". Description: ${item.desc?.substring(0, 200)}. High quality fantasy digital painting, detailed, vibrant colors, dark atmospheric background, suitable for a tabletop RPG token.`;

	try {
		const response = await ai.models.generateContent({
			model: "gemini-2.0-flash",
			contents: prompt,
			config: {
				responseModalities: ["image", "text"],
			},
		});

		// Extract inline image data from the response
		const parts = response.candidates?.[0]?.content?.parts;
		if (!parts) {
			console.log(` -> No parts in response for ${item.name}`);
			return;
		}

		for (const part of parts) {
			if (part.inlineData) {
				const dir = path.dirname(fullPath);
				if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

				const buffer = Buffer.from(part.inlineData.data!, "base64");
				await sharp(buffer)
					.resize(512, 512, { fit: "cover" })
					.webp({ quality: 90 })
					.toFile(fullPath);

				console.log(` -> Saved to ${item.img}`);
				return;
			}
		}

		console.log(` -> No image data in response for ${item.name}`);
	} catch (e: any) {
		console.error(
			` -> Error generating ${item.name}: ${e.message?.substring(0, 100)}`,
		);
	}
}

async function main() {
	console.log(`Found ${allItems.length} tokens to potentially generate.`);

	for (let i = 0; i < allItems.length; i++) {
		console.log(`\n[${i + 1}/${allItems.length}] Processing...`);
		await generateToken(allItems[i]);
		// 3 second delay between requests to respect rate limits
		await new Promise((r) => setTimeout(r, 3000));
	}
	console.log("\n=== Finished token generation sequence. ===");
}

main().catch(console.error);
