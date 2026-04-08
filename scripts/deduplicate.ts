import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "src/data/compendium");

function getAllTsFiles(dir: string, fileList: string[] = []): string[] {
	const files = fs.readdirSync(dir);
	for (const file of files) {
		const fullPath = path.join(dir, file);
		if (fs.statSync(fullPath).isDirectory()) {
			getAllTsFiles(fullPath, fileList);
		} else if (file.endsWith(".ts")) {
			fileList.push(fullPath);
		}
	}
	return fileList;
}

async function main() {
	console.log("Starting exact-duplicate deletion... (Safe Mode)");

	const allFiles = getAllTsFiles(DATA_DIR);
	const localSeenNames = new Set<string>();
	let removedCount = 0;

	for (const filePath of allFiles) {
		const content = fs.readFileSync(filePath, "utf-8");

		// CRUCIAL SAFETY FIX: Do not parse files that act as aggregators
		// (i.e. if they import items from other files to spread them, skip them to avoid flattening)
		if (content.includes("import ") && content.includes("from ")) {
			// Some files might import types. We only want to skip if it spreads arrays:
			if (content.includes("...")) {
				console.log(
					`[SKIP] Aggregate file skipped: ${path.basename(filePath)}`,
				);
				continue;
			}
		}
		if (filePath.includes("staticDataProvider") || filePath.includes("index")) {
			continue;
		}

		let moduleData;
		try {
			moduleData = await import(`file:///${filePath.replace(/\\/g, "/")}`);
		} catch (e) {
			console.error(`Failed to import ${path.basename(filePath)}:`, e);
			continue;
		}

		const exportKey = Object.keys(moduleData).find((k) =>
			Array.isArray(moduleData[k]),
		);
		if (!exportKey) continue;

		const originalArray = moduleData[exportKey];
		const deduplicatedArray = [];

		for (const item of originalArray) {
			if (!item.name) {
				deduplicatedArray.push(item);
				continue;
			}

			if (localSeenNames.has(item.name)) {
				removedCount++;
			} else {
				localSeenNames.add(item.name);
				deduplicatedArray.push(item);
			}
		}

		if (originalArray.length !== deduplicatedArray.length) {
			const lines = content.split("\n");
			const commentLines = lines.filter((l) => l.trim().startsWith("//"));

			const newContent = `${commentLines.join("\n")}\n\nexport const ${exportKey} = ${JSON.stringify(deduplicatedArray, null, "\t")};\n`;
			fs.writeFileSync(filePath, newContent, "utf-8");
			console.log(
				`[DEDUPE] Cleared duplicates in ${path.basename(filePath)}. Reduced from ${originalArray.length} to ${deduplicatedArray.length}.`,
			);
		}
	}

	if (removedCount > 0) {
		console.log(
			`=> Removed a total of ${removedCount} duplicates across the compendium.`,
		);
	}
	console.log("Done!");
}

main().catch(console.error);
