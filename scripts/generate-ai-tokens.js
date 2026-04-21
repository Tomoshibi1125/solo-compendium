import fs from "node:fs";
import path from "node:path";
import { GoogleGenAI } from "@google/genai";
import sharp from "sharp";
import { anomalies } from "../src/data/compendium/anomalies";
import { allItems as rawItems } from "../src/data/compendium/items-index";
const items = rawItems;
const vehicles = items.filter((x) => x.item_type === "vehicle");
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("Please set GEMINI_API_KEY environment variable");
    process.exit(1);
}
const ai = new GoogleGenAI({ apiKey });
const PUBLIC_DIR = path.resolve("public");
// Collect all new entries that need tokens
const entriesToProcess = [
    ...anomalies
        .filter((x) => x.id.startsWith("companion-") ||
        x.id.startsWith("mount-") ||
        x.id.startsWith("pet-"))
        .map((x) => ({ name: x.name, img: x.image, desc: x.description || "" })),
    ...vehicles.map((x) => ({
        name: x.name,
        img: x.image || "",
        desc: x.description || "",
    })),
].filter((x) => !!x.img);
async function generateToken(item) {
    const fullPath = path.join(PUBLIC_DIR, item.img);
    if (fs.existsSync(fullPath)) {
        // Check if it's a real image (>10KB) or a placeholder (<10KB)
        const stats = fs.statSync(fullPath);
        if (stats.size > 10000) {
            console.log(`Skipping ${item.name}, already has a real image (${stats.size} bytes)`);
            return;
        }
        console.log(`Replacing placeholder for ${item.name} (${stats.size} bytes)...`);
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
                if (!fs.existsSync(dir))
                    fs.mkdirSync(dir, { recursive: true });
                const data = part.inlineData.data;
                if (!data)
                    continue;
                const buffer = Buffer.from(data, "base64");
                await sharp(buffer)
                    .resize(512, 512, { fit: "cover" })
                    .webp({ quality: 90 })
                    .toFile(fullPath);
                console.log(` -> Saved to ${item.img}`);
                return;
            }
        }
        console.log(` -> No image data in response for ${item.name}`);
    }
    catch (e) {
        const err = e;
        console.error(` -> Error generating ${item.name}: ${err.message?.substring(0, 100)}`);
    }
}
async function main() {
    console.log(`Found ${entriesToProcess.length} tokens to potentially generate.`);
    for (let i = 0; i < entriesToProcess.length; i++) {
        console.log(`\n[${i + 1}/${entriesToProcess.length}] Processing...`);
        await generateToken(entriesToProcess[i]);
        // 3 second delay between requests to respect rate limits
        await new Promise((r) => setTimeout(r, 3000));
    }
    console.log("\n=== Finished token generation sequence. ===");
}
main().catch(console.error);
