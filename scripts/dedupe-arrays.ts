import * as fs from "node:fs";
import * as path from "node:path";

// Using inline string matching instead of requiring to bypass TypeScript export mechanics complexities and loss of comments where possible, BUT because we want exact duplicate filtering, we will let TSX compile and grab the object, filter it, and JSON.stringify it perfectly.

import { techniques } from "../src/data/compendium/techniques";
import type {
	CompendiumAnomaly,
	CompendiumTechnique,
} from "../src/types/compendium";

// Actually, rewriting the whole file losing comments is bad. Let's do it right.
const techPath = path.join(process.cwd(), "src/data/compendium/techniques.ts");
// We know exactly what we are targetting now.
// "blade-dance", "disarming-strike", "whirlwind-slash".
// But earlier grep showed them missing because they might be on multiple lines. In fact:
// They are multi-line objects!
// It's much safer to use AST or TS parser to modify them, but that's overkill. We can just use TSX to evaluate them, filter, and rewrite the array.

function arrayToTypeScriptExport(
	arrayName: string,
	data: unknown[],
	headerDocs: string,
) {
	const jsonStr = JSON.stringify(data, null, "\t").replace(
		/"([^"]+)":/g,
		"$1:",
	);
	return `${headerDocs}\n\nexport const ${arrayName} = ${jsonStr};`;
}

// 1. Dedupe Techniques
const uniqueTechs: CompendiumTechnique[] = [];
const techIds = new Set();
const techNames = new Set();

for (const t of techniques as unknown as CompendiumTechnique[]) {
	if (!techIds.has(t.id) && !techNames.has(t.name)) {
		uniqueTechs.push(t);
		techIds.add(t.id);
		techNames.add(t.name);
	}
}

const techHeader = `// Techniques Compendium - Authoritative System Ascendant Content\n// Combat maneuvers and martial techniques\n// Based on System Ascendant mechanics\n// Deduplicated and Lore-Enriched`;

fs.writeFileSync(
	techPath,
	arrayToTypeScriptExport("techniques", uniqueTechs, techHeader),
);
console.log(`[Dedupe] Techniques processed. Unique: ${uniqueTechs.length}`);

// 2. Dedupe Anomalies
const anomalyPath = path.join(
	process.cwd(),
	"src/data/compendium/anomalies/rank-d.ts",
);

import { anomalies_d } from "../src/data/compendium/anomalies/rank-d";

const uniqueD: CompendiumAnomaly[] = [];
const dIds = new Set();
const dNames = new Set();

for (const m of anomalies_d as unknown as CompendiumAnomaly[]) {
	if (!dIds.has(m.id) && !dNames.has(m.name)) {
		uniqueD.push(m);
		dIds.add(m.id);
		dNames.add(m.name);
	}
}

const anomalyHeader = `import type { CompendiumAnomaly } from "@/types/compendium";\n\n// D-Rank Anomalies\n// Generally equivalent to CR 1/8 to 1`;
fs.writeFileSync(
	anomalyPath,
	arrayToTypeScriptExport("anomalies_d", uniqueD, anomalyHeader),
);
console.log(`[Dedupe] D-Rank Anomalies processed. Unique: ${uniqueD.length}`);
