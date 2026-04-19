import * as fs from "node:fs";
import * as path from "node:path";

// Helper to write files
function arrayToTypeScriptExport(
	arrayName: string,
	data: unknown[],
	headerDocs: string,
) {
	const jsonStr = JSON.stringify(data, null, "\t").replace(
		/"([a-zA-Z_$][0-9a-zA-Z_$]*)":/g,
		"$1:",
	);
	return `${headerDocs}\n\nexport const ${arrayName} = ${jsonStr};\n`;
}

// 1. Anomalies
const anomalyRanks = ["a", "b", "c", "d", "s"];
for (const rank of anomalyRanks) {
	const filePath = path.join(process.cwd(), `src/data/compendium/anomalies/rank-${rank}.ts`);
	if (!fs.existsSync(filePath)) continue;
	
	// Dynamic import might be tricky in CommonJS, but we can read and use a regex or just let TSX run it.
	// Actually we'll use dynamic imports since we're using TSX.
}

async function dedupeLocal(modulePath: string, exportName: string, header: string) {
	const fullPath = path.join(process.cwd(), modulePath);
	if (!fs.existsSync(fullPath)) return;

	// Use require to bypass caching if we wanted, or dynamic import
    const fileUrl = "file://" + fullPath.replace(/\\/g, "/") + "?t=" + Date.now();
	const mod = await import(fileUrl);
	const arr = mod[exportName] || mod.default || Object.values(mod)[0];

	if (!Array.isArray(arr)) {
		console.log(`Skip ${modulePath}: not an array`);
		return;
	}

	const unique: any[] = [];
	const ids = new Set();
	const names = new Set();

	for (const item of arr) {
		const id = item.id || item.name;
		if (!ids.has(id) && !names.has(item.name)) {
			unique.push(item);
			ids.add(id);
			names.add(item.name);
		}
	}

	const originalContent = fs.readFileSync(fullPath, "utf-8");
	const exportRegex = new RegExp(`([\\s\\S]*?)(export const ${exportName}[^=]*=)\\s*\\[`);
	const match = originalContent.match(exportRegex);
	if (!match) {
		console.log(`Could not find export for ${exportName} in ${modulePath}`);
		return;
	}
	const precedingText = match[1];
	const exportDecl = match[2];
	
	const jsonStr = JSON.stringify(unique, null, "\t").replace(
		/"([a-zA-Z_$][0-9a-zA-Z_$]*)":/g,
		"$1:",
	);
	
	const finalContent = `${precedingText}${exportDecl} ${jsonStr};\n`;
	fs.writeFileSync(fullPath, finalContent);
	console.log(`[Dedupe] ${modulePath} processed. Unique: ${unique.length} (from ${arr.length})`);
}

async function run() {
	await dedupeLocal("src/data/compendium/anomalies/rank-a.ts", "anomalies_a", "// A-Rank Anomalies");
	await dedupeLocal("src/data/compendium/anomalies/rank-b.ts", "anomalies_b", "// B-Rank Anomalies");
	await dedupeLocal("src/data/compendium/anomalies/rank-c.ts", "anomalies_c", "// C-Rank Anomalies");
	await dedupeLocal("src/data/compendium/anomalies/rank-d.ts", "anomalies_d", "// D-Rank Anomalies");
	await dedupeLocal("src/data/compendium/anomalies/rank-s.ts", "anomalies_s", "// S-Rank Anomalies");
	
	await dedupeLocal("src/data/compendium/artifacts.ts", "artifacts", "// Artifacts");
	await dedupeLocal("src/data/compendium/backgrounds.ts", "backgrounds", "// Backgrounds");
	await dedupeLocal("src/data/compendium/feats-comprehensive.ts", "comprehensiveFeats", "// Feats");
	await dedupeLocal("src/data/compendium/jobs.ts", "jobs", "// Jobs");
	await dedupeLocal("src/data/compendium/paths.ts", "paths", "// Paths");

	console.log("Local deduplication complete.");
}

run().catch(console.error);
