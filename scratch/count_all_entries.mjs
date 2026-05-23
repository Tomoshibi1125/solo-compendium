/**
 * Count ALL entries including procedurally generated supplemental entries
 * by calculating family × prefix × form counts
 */

import fs from "fs";
import path from "path";

const dataDir = path.resolve("src/data/compendium");

// ======= SPELLS =======
// Core rank files - count by regex
function countIdsInFile(filePath) {
	if (!fs.existsSync(filePath)) return 0;
	const content = fs.readFileSync(filePath, "utf-8");
	const matches = content.match(/\bid:\s*"/g);
	return matches ? matches.length : 0;
}

// Supplemental spell generator - count from family definitions
function countSpellSupplemental() {
	const content = fs.readFileSync(
		path.join(dataDir, "spells", "supplemental.ts"),
		"utf-8",
	);

	// Count all families and uniqueFamilies
	// Each family produces prefixes.length × forms.length entries
	const familyBlocks = content.match(/prefixes:\s*\[([\s\S]*?)\]/g) || [];
	const formBlocks = content.match(/forms:\s*\[([\s\S]*?)\]/g) || [];

	let total = 0;
	for (let i = 0; i < familyBlocks.length; i++) {
		const prefixCount = (familyBlocks[i].match(/"/g) || []).length / 2;
		const formCount = (formBlocks[i].match(/"/g) || []).length / 2;
		total += prefixCount * formCount;
		console.log(
			`  Spell family ${i + 1}: ${prefixCount} prefixes × ${formCount} forms = ${prefixCount * formCount}`,
		);
	}
	return total;
}

// Supplemental powers generator
function countPowerSupplemental() {
	const content = fs.readFileSync(
		path.join(dataDir, "powers-supplemental.ts"),
		"utf-8",
	);

	const familyBlocks = content.match(/prefixes:\s*\[([\s\S]*?)\]/g) || [];
	const formBlocks = content.match(/forms:\s*\[([\s\S]*?)\]/g) || [];

	let total = 0;
	for (let i = 0; i < familyBlocks.length; i++) {
		const prefixCount = (familyBlocks[i].match(/"/g) || []).length / 2;
		const formCount = (formBlocks[i].match(/"/g) || []).length / 2;
		total += prefixCount * formCount;
		console.log(
			`  Power family ${i + 1}: ${prefixCount} prefixes × ${formCount} forms = ${prefixCount * formCount}`,
		);
	}
	return total;
}

// Supplemental techniques generator
function countTechniqueSupplemental() {
	const content = fs.readFileSync(
		path.join(dataDir, "techniques-supplemental.ts"),
		"utf-8",
	);

	const familyBlocks = content.match(/prefixes:\s*\[([\s\S]*?)\]/g) || [];
	const formBlocks = content.match(/forms:\s*\[([\s\S]*?)\]/g) || [];

	let total = 0;
	for (let i = 0; i < familyBlocks.length; i++) {
		const prefixCount = (familyBlocks[i].match(/"/g) || []).length / 2;
		const formCount = (formBlocks[i].match(/"/g) || []).length / 2;
		total += prefixCount * formCount;
		console.log(
			`  Technique family ${i + 1}: ${prefixCount} prefixes × ${formCount} forms = ${prefixCount * formCount}`,
		);
	}
	return total;
}

console.log("=".repeat(80));
console.log("COMPLETE ENTRY COUNT");
console.log("=".repeat(80));

// Spells
console.log("\n--- SPELLS ---");
const spellCoreFiles = [
	"rank-a.ts",
	"rank-b.ts",
	"rank-c.ts",
	"rank-d.ts",
	"rank-s.ts",
];
let spellCore = 0;
for (const f of spellCoreFiles) {
	const count = countIdsInFile(path.join(dataDir, "spells", f));
	console.log(`  ${f}: ${count} entries`);
	spellCore += count;
}
console.log(`  Core spell total: ${spellCore}`);
console.log("\n  Supplemental spell families:");
const spellSupp = countSpellSupplemental();
console.log(`  Supplemental spell total: ${spellSupp}`);
console.log(`  >>> TOTAL SPELLS: ${spellCore + spellSupp}`);

// Powers
console.log("\n--- POWERS ---");
const powerCore = countIdsInFile(path.join(dataDir, "powers.ts"));
console.log(`  powers.ts core: ${powerCore} entries`);
console.log("\n  Supplemental power families:");
const powerSupp = countPowerSupplemental();
console.log(`  Supplemental power total: ${powerSupp}`);
console.log(`  >>> TOTAL POWERS: ${powerCore + powerSupp}`);

// Techniques
console.log("\n--- TECHNIQUES ---");
const techCore = countIdsInFile(path.join(dataDir, "techniques.ts"));
console.log(`  techniques.ts core: ${techCore} entries`);
console.log("\n  Supplemental technique families:");
const techSupp = countTechniqueSupplemental();
console.log(`  Supplemental technique total: ${techSupp}`);
console.log(`  >>> TOTAL TECHNIQUES: ${techCore + techSupp}`);

// Feats
console.log("\n--- FEATS ---");
const featCount = countIdsInFile(path.join(dataDir, "feats-comprehensive.ts"));
console.log(`  feats-comprehensive.ts: ${featCount} entries`);
console.log(`  >>> TOTAL FEATS: ${featCount} (no supplemental generator)`);

// Check index/provider to see how they're combined
console.log("\n--- CHECKING HOW THEY MERGE ---");
const spellIndex = fs.readFileSync(
	path.join(dataDir, "spells", "index.ts"),
	"utf-8",
);
console.log("\nspells/index.ts:");
console.log(spellIndex);

// Check staticDataProvider for how powers/techniques are exported
const provider = fs.readFileSync(
	path.join(dataDir, "staticDataProvider.ts"),
	"utf-8",
);
// Just search for relevant exports
const powerLines = provider
	.split("\n")
	.filter(
		(l) =>
			/power/i.test(l) &&
			/import|export|concat|spread|\.\.\.|push|combine/i.test(l),
	);
const techLines = provider
	.split("\n")
	.filter(
		(l) =>
			/technique/i.test(l) &&
			/import|export|concat|spread|\.\.\.|push|combine/i.test(l),
	);
const spellLines = provider
	.split("\n")
	.filter(
		(l) =>
			/spell/i.test(l) &&
			/import|export|concat|spread|\.\.\.|push|combine/i.test(l),
	);
const featLines = provider
	.split("\n")
	.filter(
		(l) =>
			/feat/i.test(l) &&
			/import|export|concat|spread|\.\.\.|push|combine/i.test(l),
	);

console.log("\nstaticDataProvider.ts references:");
console.log(
	"  Spells:",
	spellLines.map((l) => l.trim()),
);
console.log(
	"  Powers:",
	powerLines.map((l) => l.trim()),
);
console.log(
	"  Techniques:",
	techLines.map((l) => l.trim()),
);
console.log(
	"  Feats:",
	featLines.map((l) => l.trim()),
);

console.log("\n" + "=".repeat(80));
console.log("GRAND TOTAL");
console.log("=".repeat(80));
console.log(
	`  Spells:     ${spellCore} core + ${spellSupp} supplemental = ${spellCore + spellSupp}`,
);
console.log(
	`  Powers:     ${powerCore} core + ${powerSupp} supplemental = ${powerCore + powerSupp}`,
);
console.log(
	`  Techniques: ${techCore} core + ${techSupp} supplemental = ${techCore + techSupp}`,
);
console.log(`  Feats:      ${featCount} (no supplemental)`);
console.log(
	`  COMBINED:   ${spellCore + spellSupp + powerCore + powerSupp + techCore + techSupp + featCount}`,
);
