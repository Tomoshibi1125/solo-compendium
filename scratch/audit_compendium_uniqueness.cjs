/**
 * Audit script: analyze all spells, powers, and techniques for uniqueness.
 * Detects duplicate names, near-identical descriptions, template repetition,
 * and mechanical sameness.
 */
const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "..", "src", "data", "compendium");

// Helper: extract array literals from TS file
function extractEntries(filePath) {
	const raw = fs.readFileSync(filePath, "utf-8");
	// Find all object blocks that look like { id: "...", name: "...", ... }
	const entries = [];

	// Use a simple regex to find all id/name/description/effects blocks
	const idRegex = /id:\s*["'`]([^"'`]+)["'`]/g;
	const nameRegex = /\bname:\s*["'`]([^"'`]+)["'`]/g;
	const descRegex = /description:\s*\n?\s*["'`]([^"'`]+)["'`]/g;
	const primaryRegex = /primary:\s*["'`]([^"'`]+)["'`]/g;
	const secondaryRegex = /secondary:\s*["'`]([^"'`]+)["'`]/g;
	const flavorRegex = /flavor:\s*\n?\s*["'`]([^"'`]+)["'`]/g;
	const castingTimeRegex = /casting_time:\s*["'`]([^"'`]+)["'`]/g;
	const rangeRegex = /range:\s*["'`]([^"'`]+)["'`]/g;
	const durationRegex = /duration:\s*["'`]([^"'`]+)["'`]/g;
	const schoolRegex = /school:\s*["'`]([^"'`]+)["'`]/g;
	const damageRollRegex = /damage_roll:\s*["'`]([^"'`]+)["'`]/g;
	const usesRegex = /uses:\s*["'`]([^"'`]+)["'`]/g;
	const damageProfileRegex = /damage_profile:\s*["'`]([^"'`]+)["'`]/g;
	const powerLevelRegex = /power_level:\s*(\d+)/g;
	const levelRegex = /level(?:_requirement)?:\s*(\d+)/g;
	const typeRegex = /(?:power_type|type):\s*["'`]([^"'`]+)["'`]/g;

	// Parse as structured data using eval-like approach
	// Actually, let's just regex-match individual fields from each entry block

	// Split file by top-level objects in the array
	const blocks = raw.split(/\n\t\{/).filter((b) => b.includes("id:"));

	for (const block of blocks) {
		const entry = {};

		const idM = block.match(/id:\s*["'`]([^"'`]+)["'`]/);
		if (idM) entry.id = idM[1];

		const nameM = block.match(/\bname:\s*["'`]([^"'`]+)["'`]/);
		if (nameM) entry.name = nameM[1];

		const descM = block.match(/description:\s*\n?\s*["'`]([^"'`]+)["'`]/);
		if (descM) entry.description = descM[1];

		const primaryM = block.match(/primary:\s*["'`]([^"'`]+)["'`]/);
		if (primaryM) entry.primary_effect = primaryM[1];

		const secondaryM = block.match(/secondary:\s*\n?\s*["'`]([^"'`]+)["'`]/);
		if (secondaryM) entry.secondary_effect = secondaryM[1];

		const flavorM = block.match(/flavor:\s*\n?\s*["'`]([^"'`]+)["'`]/);
		if (flavorM) entry.flavor = flavorM[1];

		const castM = block.match(/casting_time:\s*["'`]([^"'`]+)["'`]/);
		if (castM) entry.casting_time = castM[1];

		const rangeM = block.match(/\brange:\s*["'`]([^"'`]+)["'`]/);
		if (rangeM) entry.range = rangeM[1];

		const durM = block.match(/duration:\s*["'`]([^"'`]+)["'`]/);
		if (durM) entry.duration = durM[1];

		const schoolM = block.match(/school:\s*["'`]([^"'`]+)["'`]/);
		if (schoolM) entry.school = schoolM[1];

		const dmgRollM = block.match(/damage_roll:\s*["'`]([^"'`]+)["'`]/);
		if (dmgRollM) entry.damage_roll = dmgRollM[1];

		const usesM = block.match(/uses:\s*["'`]([^"'`]+)["'`]/);
		if (usesM) entry.uses = usesM[1];

		const dpM = block.match(/damage_profile:\s*["'`]([^"'`]+)["'`]/);
		if (dpM) entry.damage_profile = dpM[1];

		const plM = block.match(/power_level:\s*(\d+)/);
		if (plM) entry.power_level = parseInt(plM[1]);

		const lvM = block.match(/level_requirement:\s*(\d+)/);
		if (lvM) entry.level_requirement = parseInt(lvM[1]);

		const dlM = block.match(/discovery_lore:\s*\n?\s*["'`]([^"'`]+)["'`]/);
		if (dlM) entry.discovery_lore = dlM[1];

		if (entry.id) entries.push(entry);
	}

	return entries;
}

// Gather all files
const spellFiles = [
	path.join(dataDir, "spells", "rank-d.ts"),
	path.join(dataDir, "spells", "supplemental.ts"),
];
const powerFiles = [
	path.join(dataDir, "powers-core.ts"),
	path.join(dataDir, "powers-supplemental.ts"),
];
const techniqueFiles = [
	path.join(dataDir, "techniques-core.ts"),
	path.join(dataDir, "techniques-supplemental.ts"),
];

const allSpells = [];
const allPowers = [];
const allTechniques = [];

for (const f of spellFiles) {
	if (fs.existsSync(f)) allSpells.push(...extractEntries(f));
}
for (const f of powerFiles) {
	if (fs.existsSync(f)) allPowers.push(...extractEntries(f));
}
for (const f of techniqueFiles) {
	if (fs.existsSync(f)) allTechniques.push(...extractEntries(f));
}

const report = {
	counts: {
		spells: allSpells.length,
		powers: allPowers.length,
		techniques: allTechniques.length,
		total: allSpells.length + allPowers.length + allTechniques.length,
	},
	duplicateNames: [],
	duplicateDescriptions: [],
	templatePrimaryEffects: {},
	templateSecondaryEffects: {},
	templateFlavors: {},
	templateDiscoveryLore: {},
	mechanicalHomogeneity: {
		allSameUses: null,
		allSameSchool: null,
		allSameDuration: null,
		allSameCastingTime: null,
		allSameDamageRoll: null,
	},
	schoolDistribution: {},
	damageProfileDistribution: {},
	rangeDistribution: {},
	durationDistribution: {},
	usesDistribution: {},
	castingTimeDistribution: {},
};

const allEntries = [
	...allSpells.map((s) => ({ ...s, category: "spell" })),
	...allPowers.map((p) => ({ ...p, category: "power" })),
	...allTechniques.map((t) => ({ ...t, category: "technique" })),
];

// 1. Duplicate names
const nameMap = {};
for (const e of allEntries) {
	const key = (e.name || "").toLowerCase().trim();
	if (!nameMap[key]) nameMap[key] = [];
	nameMap[key].push({ id: e.id, category: e.category });
}
for (const [name, entries] of Object.entries(nameMap)) {
	if (entries.length > 1) {
		report.duplicateNames.push({ name, count: entries.length, entries });
	}
}

// 2. Duplicate descriptions (exact)
const descMap = {};
for (const e of allEntries) {
	if (!e.description) continue;
	const key = e.description.toLowerCase().trim();
	if (!descMap[key]) descMap[key] = [];
	descMap[key].push({ id: e.id, name: e.name, category: e.category });
}
for (const [desc, entries] of Object.entries(descMap)) {
	if (entries.length > 1) {
		report.duplicateDescriptions.push({
			description: desc.substring(0, 80) + "...",
			count: entries.length,
			entries,
		});
	}
}

// 3. Template analysis: primary effects
for (const e of allEntries) {
	if (!e.primary_effect) continue;
	if (!report.templatePrimaryEffects[e.primary_effect]) {
		report.templatePrimaryEffects[e.primary_effect] = 0;
	}
	report.templatePrimaryEffects[e.primary_effect]++;
}

// 4. Template analysis: secondary effects
for (const e of allEntries) {
	if (!e.secondary_effect) continue;
	if (!report.templateSecondaryEffects[e.secondary_effect]) {
		report.templateSecondaryEffects[e.secondary_effect] = 0;
	}
	report.templateSecondaryEffects[e.secondary_effect]++;
}

// 5. Template analysis: flavors
for (const e of allEntries) {
	if (!e.flavor) continue;
	if (!report.templateFlavors[e.flavor]) {
		report.templateFlavors[e.flavor] = 0;
	}
	report.templateFlavors[e.flavor]++;
}

// 6. Template analysis: discovery_lore
for (const e of allEntries) {
	if (!e.discovery_lore) continue;
	if (!report.templateDiscoveryLore[e.discovery_lore]) {
		report.templateDiscoveryLore[e.discovery_lore] = 0;
	}
	report.templateDiscoveryLore[e.discovery_lore]++;
}

// 7. Distribution analysis
for (const e of allEntries) {
	if (e.school) {
		report.schoolDistribution[e.school] =
			(report.schoolDistribution[e.school] || 0) + 1;
	}
	if (e.damage_profile) {
		report.damageProfileDistribution[e.damage_profile] =
			(report.damageProfileDistribution[e.damage_profile] || 0) + 1;
	}
	if (e.range) {
		report.rangeDistribution[e.range] =
			(report.rangeDistribution[e.range] || 0) + 1;
	}
	if (e.duration) {
		report.durationDistribution[e.duration] =
			(report.durationDistribution[e.duration] || 0) + 1;
	}
	if (e.uses) {
		report.usesDistribution[e.uses] =
			(report.usesDistribution[e.uses] || 0) + 1;
	}
	if (e.casting_time) {
		report.castingTimeDistribution[e.casting_time] =
			(report.castingTimeDistribution[e.casting_time] || 0) + 1;
	}
}

// Count how many entries are "Transmutation" school
const transCount = allEntries.filter(
	(e) => e.school === "Transmutation",
).length;
report.mechanicalHomogeneity.allSameSchool = `${transCount}/${allEntries.length} are Transmutation`;

const instCount = allEntries.filter(
	(e) => e.duration === "Instantaneous",
).length;
report.mechanicalHomogeneity.allSameDuration = `${instCount}/${allEntries.length} are Instantaneous`;

const usesCount = allEntries.filter((e) => e.uses === "3/long rest").length;
report.mechanicalHomogeneity.allSameUses = `${usesCount}/${allEntries.length} use 3/long rest`;

const dmgDash = allEntries.filter(
	(e) => e.damage_roll === "—" || e.damage_roll === "-",
).length;
report.mechanicalHomogeneity.allSameDamageRoll = `${dmgDash}/${allEntries.length} have — damage_roll`;

// Summarize: keep only top repeated entries
const filterTopN = (obj, n = 20) => {
	return Object.fromEntries(
		Object.entries(obj)
			.sort((a, b) => b[1] - a[1])
			.slice(0, n),
	);
};

report.templatePrimaryEffects = filterTopN(report.templatePrimaryEffects);
report.templateSecondaryEffects = filterTopN(report.templateSecondaryEffects);
report.templateFlavors = filterTopN(report.templateFlavors, 30);
report.templateDiscoveryLore = filterTopN(report.templateDiscoveryLore, 30);

const outPath = path.join(__dirname, "uniqueness_audit.json");
fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
console.log(`Audit complete. Results written to ${outPath}`);
console.log(`\nTotal entries: ${report.counts.total}`);
console.log(`  Spells: ${report.counts.spells}`);
console.log(`  Powers: ${report.counts.powers}`);
console.log(`  Techniques: ${report.counts.techniques}`);
console.log(`\nDuplicate names: ${report.duplicateNames.length}`);
console.log(`Duplicate descriptions: ${report.duplicateDescriptions.length}`);
console.log(`\nMechanical homogeneity:`);
for (const [key, val] of Object.entries(report.mechanicalHomogeneity)) {
	console.log(`  ${key}: ${val}`);
}
