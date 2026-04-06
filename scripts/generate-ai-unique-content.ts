import * as fs from "node:fs";
import * as path from "node:path";
import { config } from "dotenv";

config({ path: path.resolve(process.cwd(), ".env") });

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
	console.error("GEMINI_API_KEY is missing from .env");
	process.exit(1);
}

const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

interface CompendiumEntry {
	id: string;
	name: string;
	description: string;
	lore?: string;
	flavor?: string;
	mechanics?: { system_interaction?: string; [k: string]: string | undefined };
}

function arrayToTypeScriptExport(
	arrayName: string,
	data: CompendiumEntry[],
	headerDocs: string,
) {
	const jsonStr = JSON.stringify(data, null, "\t").replace(
		/"([a-zA-Z0-9_]+)":/g,
		"$1:",
	);
	return `${headerDocs}\n\nexport const ${arrayName} = ${jsonStr};\n`;
}

async function generateUniqueContent(
	batch: CompendiumEntry[],
	type: string,
): Promise<CompendiumEntry[]> {
	const minifiedInput = batch.map((b) => ({
		id: b.id,
		name: b.name,
		description: b.description,
	}));

	const prompt = `
You are a master worldbuilder and game designer for "System Ascendant", a modern-earth setting inspired by Solo Leveling where dimensional rifts open up and Hunters fight monsters using a high-tech magical System.

I have a batch of exactly ${batch.length} ${type} items.
I need you to generate 100% unique, bespoke, non-repetitive descriptions. DO NOT use generic repeated phrases.

For each item, generate:
1. "lore": A rich 2-3 sentence paragraph detailing the item's origin. E.g., which specific sovereign or ancient dimension it came from, or which incident caused its creation.
2. "flavor": A cool 3-10 word one-liner.
3. "system": A single sentence describing a unique mechanical "System" interaction under 'system' (e.g., "The system recognizes this as an S-Rank threat...").

Return ONLY a valid, raw JSON object where keys are the item "id", and the value is {"lore": "...", "flavor": "...", "system": "..."}.
NO markdown wrapping (\`\`\`json). Just the raw object {"id1": {...}, "id2": {...}}.

INPUT DATA:
${JSON.stringify(minifiedInput)}
`;

	try {
		const response = await fetch(URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				contents: [{ parts: [{ text: prompt }] }],
				safetySettings: [
					{ category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
					{ category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
					{
						category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
						threshold: "BLOCK_NONE",
					},
					{
						category: "HARM_CATEGORY_DANGEROUS_CONTENT",
						threshold: "BLOCK_NONE",
					},
				],
				generationConfig: {
					temperature: 0.9,
					responseMimeType: "application/json",
				},
			}),
		});

		const json = await response.json();

		if (!json.candidates || json.candidates.length === 0) {
			console.error("No candidates returned", JSON.stringify(json, null, 2));
			return batch;
		}

		const rawText = json.candidates[0].content.parts[0].text;
		const parsed = JSON.parse(rawText);

		// Merge AI properties back into the original batch objects
		for (let i = 0; i < batch.length; i++) {
			const aiData = parsed[batch[i].id];
			if (aiData) {
				batch[i].lore = aiData.lore || batch[i].lore;
				batch[i].flavor = aiData.flavor || batch[i].flavor;
				if (aiData.system) {
					const entry = batch[i];
					if (entry) {
						entry.mechanics = entry.mechanics || {};
						entry.mechanics.system_interaction = aiData.system;
					}
				}
			}
		}
		return batch;
	} catch (err) {
		console.error("AI Generation failed:", err);
		return batch;
	}
}

async function processFile(
	filePath: string,
	exportName: string,
	typeDesc: string,
	header: string,
) {
	const absolutePath = path.resolve(process.cwd(), filePath);
	console.log(`\nImporting ${absolutePath}...`);

	let dataModule: Record<string, CompendiumEntry[]>;
	try {
		dataModule = await import(`file:///${absolutePath.replace(/\\/g, "/")}`);
	} catch (e) {
		console.error("Failed to import module statically", e);
		return;
	}

	const dataArray = dataModule[exportName];
	if (!dataArray || !Array.isArray(dataArray)) {
		console.error(`Export ${exportName} not found or not array in ${filePath}`);
		return;
	}

	console.log(
		`Found ${dataArray.length} items. Processing in batches of 20...`,
	);
	const finalArray = [];
	const BATCH_SIZE = 20; // safe since we only request 3 text fields per item.

	for (let i = 0; i < dataArray.length; i += BATCH_SIZE) {
		process.stdout.write(
			`[${exportName}] Batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(dataArray.length / BATCH_SIZE)}... `,
		);
		const chunk = dataArray.slice(i, i + BATCH_SIZE);
		const enrichedChunk = await generateUniqueContent(chunk, typeDesc);
		finalArray.push(...enrichedChunk);
		console.log("Done.");
		await new Promise((r) => setTimeout(r, 5000));
	}

	const fileContent = arrayToTypeScriptExport(exportName, finalArray, header);
	fs.writeFileSync(absolutePath, fileContent, "utf8");

	console.log(
		`[SUCCESS] Rewrote ${filePath} with ${finalArray.length} ultra-unique entries.`,
	);
}

async function runAll() {
	console.log(
		"=== STARTING EXPERIMENTAL SYSTEM ASCENDANT AI GENERATION ENGINE ===",
	);

	const targets = [
		{
			file: "src/data/compendium/spells/rank-s.ts",
			name: "spells_s",
			type: "S-Rank Spell Protocols",
			header:
				"// S-Rank Spells\n// Massive system protocols requiring immense mana resources.",
		},
		{
			file: "src/data/compendium/powers.ts",
			name: "powers",
			type: "Awakened Powers",
			header:
				"// Awakened Powers\n// Core abilities utilized by advanced Hunters.",
		},
	];

	for (const t of targets) {
		await processFile(t.file, t.name, t.type, t.header);
	}

	console.log("\n=== AI GENERATION COMPLETE ===");
}

runAll();
