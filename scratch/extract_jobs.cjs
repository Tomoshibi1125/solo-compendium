const fs = require("fs");
const raw = fs.readFileSync("src/data/compendium/jobs.ts", "utf-8");

// Extract all job ids and names
const idMatches = [...raw.matchAll(/id:\s*["'`]([\w-]+)["'`]/g)];
const nameMatches = [...raw.matchAll(/\bname:\s*["'`]([^"'`]+)["'`]/g)];

// The jobs file has nested objects, so we need to find the top-level entries
// Look for the pattern: { id: "...", name: "...", type: "Job"
const jobBlocks = raw
	.split(/\n\t\{/)
	.filter((b) => b.includes('type: "Job"') || b.includes("type: 'Job'"));

console.log("Total job blocks found:", jobBlocks.length);
console.log("");

for (const block of jobBlocks) {
	const idM = block.match(/id:\s*["'`]([^"'`]+)["'`]/);
	const nameM = block.match(/\bname:\s*["'`]([^"'`]+)["'`]/);
	const typeField = block.match(/type:\s*["'`]([^"'`]+)["'`]/);
	const hitDieM = block.match(/hitDie:\s*["'`]([^"'`]+)["'`]/);
	const primaryM = block.match(/primaryAbility:\s*["'`]([^"'`]+)["'`]/);
	const spellcastingM = block.includes("spellcasting:");
	const powersM = block.includes("powersKnown:");
	const techM = block.includes("techniquesKnown:");

	if (idM && nameM) {
		const category = spellcastingM
			? powersM
				? "hybrid"
				: "caster"
			: powersM
				? "martial"
				: "unknown";
		console.log(
			`${nameM[1].padEnd(20)} id=${idM[1].padEnd(20)} hitDie=${(hitDieM ? hitDieM[1] : "?").padEnd(6)} primary=${(primaryM ? primaryM[1] : "?").padEnd(15)} spells=${spellcastingM ? "YES" : "no "}  powers=${powersM ? "YES" : "no "}  techniques=${techM ? "YES" : "no "}  => ${category}`,
		);
	}
}

// Also check for class references in spells/powers/techniques supplemental files
console.log("\n=== Classes referenced in spell supplemental ===");
const spellRaw = fs.readFileSync(
	"src/data/compendium/spells/supplemental.ts",
	"utf-8",
);
const spellClasses = new Set();
for (const m of spellRaw.matchAll(/classes:\s*\[([^\]]+)\]/g)) {
	for (const c of m[1].matchAll(/"([^"]+)"/g)) {
		spellClasses.add(c[1]);
	}
}
console.log([...spellClasses].sort().join(", "));

console.log("\n=== Classes referenced in powers supplemental ===");
const powersRaw = fs.readFileSync(
	"src/data/compendium/powers-supplemental.ts",
	"utf-8",
);
const powerClasses = new Set();
for (const m of powersRaw.matchAll(/classes:\s*\[([^\]]+)\]/g)) {
	for (const c of m[1].matchAll(/"([^"]+)"/g)) {
		powerClasses.add(c[1]);
	}
}
console.log([...powerClasses].sort().join(", "));

console.log("\n=== Classes referenced in techniques supplemental ===");
const techRaw = fs.readFileSync(
	"src/data/compendium/techniques-supplemental.ts",
	"utf-8",
);
const techClasses = new Set();
for (const m of techRaw.matchAll(/classes:\s*\[([^\]]+)\]/g)) {
	for (const c of m[1].matchAll(/"([^"]+)"/g)) {
		techClasses.add(c[1]);
	}
}
console.log([...techClasses].sort().join(", "));
