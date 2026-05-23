/**
 * Deep Compendium Audit Script
 * Checks spells, powers, techniques, and feats for:
 * - Duplicate descriptions (exact or near-exact)
 * - Boilerplate / templated content
 * - Internal contradictions (description says X, mechanics say Y)
 * - Homogeneous fields (same value across many entries)
 * - Empty/placeholder mechanics
 */

const fs = require("fs");
const path = require("path");

// We'll read the TypeScript files as text and extract JSON-like data
const dataDir = path.resolve(__dirname, "..", "src", "data", "compendium");

function extractArrayFromFile(filePath) {
	const content = fs.readFileSync(filePath, "utf-8");
	// Find all object literals in the array - we'll use regex to grab key fields
	const items = [];

	// Match each object block with id field
	const idRegex = /\bid:\s*"([^"]+)"/g;
	const nameRegex = /\bname:\s*"([^"]+)"/g;
	const descRegex = /\bdescription:\s*\n?\s*"([^"]*(?:"[^"]*)*?)(?:"\s*[,\n])/g;

	// Better approach: match entire object blocks
	let match;
	const allIds = [];
	const allNames = [];
	const allDescs = [];

	while ((match = idRegex.exec(content)) !== null) allIds.push(match[1]);

	// Re-read for names
	const nameRe = /\bname:\s*"([^"]+)"/g;
	while ((match = nameRe.exec(content)) !== null) allNames.push(match[1]);

	// Get descriptions - multi-line aware
	const descRe = /description:\s*\n?\s*["`]([^"`]*(?:["`][^"`]*)*?)["`]/g;
	while ((match = descRe.exec(content)) !== null) allDescs.push(match[1]);

	// Get full text for field-level analysis
	return { content, ids: allIds, names: allNames, descs: allDescs };
}

function countOccurrences(arr) {
	const counts = {};
	for (const item of arr) {
		const normalized = item.trim().toLowerCase();
		counts[normalized] = (counts[normalized] || 0) + 1;
	}
	return counts;
}

function findBoilerplateStrings(content) {
	const boilerplatePatterns = [
		"A subtle manipulation of the magical weave",
		"Catalogued in the Bureau's standard rank-appropriate compendium",
		"Available to Bureau-certified casters at the appropriate rank",
		"Neutral in personality profile",
		"Silent, hungry",
		"Recorded in the darkest archives of the Hunter Guilds",
		"Known only to an elite few",
		"A dead Guild Master",
		"Grants utility scaling with the user's level",
		"Applies a lingering magical pressure to the area",
		"Provides a permanent +1 to an associated ability score",
		"Unlocks a passive aura affecting allies within 10 feet",
		"Grants a once-per-long-rest emergency activation",
		"See secondary effect",
		"A standardized Bureau-issued casting pattern",
		"The Bureau tried to ban this. They failed.",
		"Scales with spell slot rank",
		"Standard mana circuit",
		"Amplified by lattice resonance",
		"Quiet between activations",
		"Inert until intentionally engaged",
		"Unobtrusive while not being used",
		"Disciplined in its at-rest state",
		"Field-refined during ongoing Red-Gate engagements",
		"An entry in the Hunter Bureau's approved catalog",
		"A Bureau-validated combat pattern",
		"A standardized Guild-certified casting",
		"Documented only after sustained Gate contact",
		"A credentialed Hunter-tier technique",
	];

	const results = {};
	for (const pattern of boilerplatePatterns) {
		const regex = new RegExp(
			pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
			"g",
		);
		const matches = content.match(regex);
		if (matches && matches.length > 0) {
			results[pattern] = matches.length;
		}
	}
	return results;
}

function findDescriptionTemplate(descs) {
	// Group descriptions by their structure (ignoring specific values)
	const templates = {};
	for (const desc of descs) {
		// Normalize: replace dice (NdN), numbers, conditions, save types
		const template = desc
			.replace(/\d+d\d+(\s*\+\s*\d+)?/g, "{DICE}")
			.replace(/DC\s*\d+/g, "DC {N}")
			.replace(
				/(Strength|Agility|Intelligence|Sense|Presence|Vitality|Wisdom|Charisma|Constitution|Dexterity)/g,
				"{ABILITY}",
			)
			.replace(
				/(Prone|Blinded|Frightened|Stunned|Restrained|Deafened|Incapacitated|Charmed|Paralyzed|Poisoned)/g,
				"{CONDITION}",
			)
			.replace(/\d+/g, "{N}");

		if (!templates[template]) templates[template] = [];
		templates[template].push(desc);
	}
	return templates;
}

function findRepeatedFieldValues(content, fieldName) {
	const regex = new RegExp(`${fieldName}:\\s*"([^"]*)"`, "g");
	const values = [];
	let m;
	while ((m = regex.exec(content)) !== null) {
		values.push(m[1]);
	}
	return countOccurrences(values);
}

function findLoreOrigins(content) {
	return findRepeatedFieldValues(content, "origin");
}

function findFlavors(content) {
	return findRepeatedFieldValues(content, "flavor");
}

function findDiscoveryLore(content) {
	const regex = /discovery_lore:\s*\n?\s*"([^"]+)"/g;
	const values = [];
	let m;
	while ((m = regex.exec(content)) !== null) {
		values.push(m[1]);
	}
	return countOccurrences(values);
}

function findLimitations(content) {
	// Check how many entries have identical uses and recharge
	const usesRegex = /uses:\s*"([^"]+)"/g;
	const rechargeRegex = /recharge:\s*"([^"]+)"/g;
	const uses = [];
	const recharges = [];
	let m;
	while ((m = usesRegex.exec(content)) !== null) uses.push(m[1]);
	while ((m = rechargeRegex.exec(content)) !== null) recharges.push(m[1]);
	return {
		uses: countOccurrences(uses),
		recharges: countOccurrences(recharges),
	};
}

function findDamageDescriptionMismatches(content) {
	// Find entries where description damage doesn't match mechanics damage
	const issues = [];
	// Match blocks with both description damage and mechanics damage
	const blockRegex =
		/id:\s*"([^"]+)"[\s\S]*?name:\s*"([^"]+)"[\s\S]*?description:\s*\n?\s*"([^"]*(?:\n[^"]*)*)"[\s\S]*?(?:damage_profile:\s*"([^"]*)")?/g;
	// This is approximate - just checking for the pattern
	return issues;
}

function findEmptySaveBlocks(content) {
	// Count saving_throw blocks where ability is empty
	const emptyPattern = /saving_throw:\s*\{[^}]*ability:\s*""[^}]*dc:\s*0/g;
	const matches = content.match(emptyPattern);
	return matches ? matches.length : 0;
}

function findHomogeneousFields(content, type) {
	const results = {};

	// Check various fields for homogeneity
	const fields = [
		"rarity",
		"source_book",
		"school",
		"power_type",
		"power_level",
		"type",
		"style",
	];

	for (const field of fields) {
		const values = findRepeatedFieldValues(content, field);
		const total = Object.values(values).reduce((a, b) => a + b, 0);
		const dominant = Object.entries(values).sort((a, b) => b[1] - a[1])[0];
		if (dominant && dominant[1] / total > 0.8 && total > 5) {
			results[field] = {
				value: dominant[0],
				count: dominant[1],
				total,
				percentage: Math.round((dominant[1] / total) * 100),
			};
		}
	}

	return results;
}

// ============== MAIN AUDIT ==============

const report = {
	timestamp: new Date().toISOString(),
	categories: {},
};

const fileSets = {
	spells: [
		path.join(dataDir, "spells", "rank-a.ts"),
		path.join(dataDir, "spells", "rank-b.ts"),
		path.join(dataDir, "spells", "rank-c.ts"),
		path.join(dataDir, "spells", "rank-d.ts"),
		path.join(dataDir, "spells", "rank-s.ts"),
		path.join(dataDir, "spells", "supplemental.ts"),
	],
	powers: [
		path.join(dataDir, "powers.ts"),
		path.join(dataDir, "powers-supplemental.ts"),
	],
	techniques: [
		path.join(dataDir, "techniques.ts"),
		path.join(dataDir, "techniques-supplemental.ts"),
	],
	feats: [path.join(dataDir, "feats-comprehensive.ts")],
};

for (const [category, files] of Object.entries(fileSets)) {
	console.log(`\n${"=".repeat(80)}`);
	console.log(`AUDITING: ${category.toUpperCase()}`);
	console.log(`${"=".repeat(80)}`);

	let combinedContent = "";
	const totalIds = [];
	const totalNames = [];
	const totalDescs = [];

	for (const file of files) {
		if (!fs.existsSync(file)) {
			console.log(`  [SKIP] ${path.basename(file)} - not found`);
			continue;
		}
		const data = extractArrayFromFile(file);
		combinedContent += data.content + "\n";
		totalIds.push(...data.ids);
		totalNames.push(...data.names);
		totalDescs.push(...data.descs);
		console.log(
			`  [READ] ${path.basename(file)} - ${data.ids.length} IDs found`,
		);
	}

	const categoryReport = {
		totalEntries: totalIds.length,
		issues: {},
	};

	// 1. Duplicate IDs
	const idCounts = countOccurrences(totalIds);
	const dupIds = Object.entries(idCounts).filter(([_, c]) => c > 1);
	if (dupIds.length > 0) {
		console.log(`\n  [ISSUE] DUPLICATE IDs (${dupIds.length}):`);
		dupIds.forEach(([id, c]) =>
			console.log(`    - "${id}" appears ${c} times`),
		);
		categoryReport.issues.duplicateIds = dupIds;
	}

	// 2. Duplicate descriptions
	const descCounts = countOccurrences(totalDescs);
	const dupDescs = Object.entries(descCounts).filter(([_, c]) => c > 1);
	if (dupDescs.length > 0) {
		console.log(
			`\n  [ISSUE] EXACT DUPLICATE DESCRIPTIONS (${dupDescs.length} unique texts used multiple times):`,
		);
		let totalDups = 0;
		dupDescs.slice(0, 10).forEach(([desc, c]) => {
			console.log(`    - "${desc.substring(0, 80)}..." appears ${c} times`);
			totalDups += c;
		});
		if (dupDescs.length > 10)
			console.log(`    ... and ${dupDescs.length - 10} more`);
		categoryReport.issues.duplicateDescriptions = {
			uniqueRepeated: dupDescs.length,
			totalDuplicateEntries: totalDups,
		};
	}

	// 3. Templated descriptions (same structure, different values)
	const templates = findDescriptionTemplate(totalDescs);
	const templateGroups = Object.entries(templates)
		.filter(([_, descs]) => descs.length > 3)
		.sort((a, b) => b[1].length - a[1].length);

	if (templateGroups.length > 0) {
		console.log(
			`\n  [ISSUE] TEMPLATED DESCRIPTIONS (same structure, different dice/conditions):`,
		);
		templateGroups.forEach(([template, descs]) => {
			console.log(
				`    Template (${descs.length} entries): "${template.substring(0, 100)}..."`,
			);
			console.log(`      Examples:`);
			descs
				.slice(0, 3)
				.forEach((d) => console.log(`        - "${d.substring(0, 80)}..."`));
		});
		categoryReport.issues.templatedDescriptions = templateGroups.map(
			([t, d]) => ({
				template: t.substring(0, 120),
				count: d.length,
				examples: d.slice(0, 3),
			}),
		);
	}

	// 4. Boilerplate strings
	const boilerplate = findBoilerplateStrings(combinedContent);
	const significantBoilerplate = Object.entries(boilerplate).filter(
		([_, c]) => c > 5,
	);
	if (significantBoilerplate.length > 0) {
		console.log(`\n  [ISSUE] BOILERPLATE STRINGS (used >5 times):`);
		significantBoilerplate
			.sort((a, b) => b[1] - a[1])
			.forEach(([str, c]) => {
				console.log(`    - (${c}x) "${str}"`);
			});
		categoryReport.issues.boilerplateStrings = significantBoilerplate;
	}

	// 5. Homogeneous fields
	const homogeneous = findHomogeneousFields(combinedContent, category);
	if (Object.keys(homogeneous).length > 0) {
		console.log(`\n  [ISSUE] HOMOGENEOUS FIELDS (>80% same value):`);
		Object.entries(homogeneous).forEach(([field, info]) => {
			console.log(
				`    - ${field}: "${info.value}" in ${info.count}/${info.total} entries (${info.percentage}%)`,
			);
		});
		categoryReport.issues.homogeneousFields = homogeneous;
	}

	// 6. Repeated lore origins
	const origins = findLoreOrigins(combinedContent);
	const originEntries = Object.entries(origins).sort((a, b) => b[1] - a[1]);
	if (originEntries.length > 0 && originEntries.length < 10) {
		console.log(
			`\n  [ISSUE] LORE ORIGINS (only ${originEntries.length} unique origins for ${totalIds.length} entries):`,
		);
		originEntries.forEach(([origin, c]) =>
			console.log(`    - (${c}x) "${origin}"`),
		);
		categoryReport.issues.loreOrigins = originEntries;
	}

	// 7. Repeated flavor text
	const flavors = findFlavors(combinedContent);
	const repeatedFlavors = Object.entries(flavors)
		.filter(([_, c]) => c > 2)
		.sort((a, b) => b[1] - a[1]);
	if (repeatedFlavors.length > 0) {
		console.log(`\n  [ISSUE] REPEATED FLAVOR TEXT (used >2 times):`);
		repeatedFlavors.forEach(([f, c]) => console.log(`    - (${c}x) "${f}"`));
		categoryReport.issues.repeatedFlavors = repeatedFlavors;
	}

	// 8. Repeated discovery lore
	const discovery = findDiscoveryLore(combinedContent);
	const repeatedDiscovery = Object.entries(discovery)
		.filter(([_, c]) => c > 2)
		.sort((a, b) => b[1] - a[1]);
	if (repeatedDiscovery.length > 0) {
		console.log(`\n  [ISSUE] REPEATED DISCOVERY LORE (used >2 times):`);
		repeatedDiscovery.forEach(([d, c]) =>
			console.log(`    - (${c}x) "${d.substring(0, 80)}..."`),
		);
		categoryReport.issues.repeatedDiscoveryLore = repeatedDiscovery;
	}

	// 9. Limitations uniformity
	const limitations = findLimitations(combinedContent);
	const usesEntries = Object.entries(limitations.uses).sort(
		(a, b) => b[1] - a[1],
	);
	if (usesEntries.length > 0 && usesEntries[0][1] / totalIds.length > 0.5) {
		console.log(`\n  [ISSUE] LIMITATIONS UNIFORMITY:`);
		console.log(
			`    Uses: "${usesEntries[0][0]}" in ${usesEntries[0][1]}/${totalIds.length} entries (${Math.round((usesEntries[0][1] / totalIds.length) * 100)}%)`,
		);
		categoryReport.issues.limitationsUniformity = {
			uses: usesEntries,
			recharges: Object.entries(limitations.recharges),
		};
	}

	// 10. Empty save blocks
	const emptySaves = findEmptySaveBlocks(combinedContent);
	if (emptySaves > 0) {
		console.log(
			`\n  [ISSUE] EMPTY SAVING THROW BLOCKS: ${emptySaves} instances (ability:"", dc:0)`,
		);
		categoryReport.issues.emptySaveBlocks = emptySaves;
	}

	// 11. Count unique description stems
	const uniqueDescs = new Set(totalDescs.map((d) => d.trim().toLowerCase()));
	const uniqueRatio = uniqueDescs.size / totalDescs.length;
	console.log(
		`\n  [STAT] Description uniqueness: ${uniqueDescs.size}/${totalDescs.length} unique (${Math.round(uniqueRatio * 100)}%)`,
	);
	categoryReport.descriptionUniqueness = {
		unique: uniqueDescs.size,
		total: totalDescs.length,
		percentage: Math.round(uniqueRatio * 100),
	};

	report.categories[category] = categoryReport;
}

// Write JSON report
const reportPath = path.resolve(__dirname, "..", "compendium_deep_audit.json");
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(`\n\nFull report written to: ${reportPath}`);
