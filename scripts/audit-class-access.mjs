import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "..");
const COMPENDIUM_DIR = join(ROOT, "src", "data", "compendium");

const JOBS = {
	destroyer: { kind: "martial", spells: false, powers: true, techniques: true },
	berserker: { kind: "martial", spells: false, powers: true, techniques: true },
	assassin: { kind: "martial", spells: false, powers: true, techniques: true },
	striker: { kind: "martial", spells: false, powers: true, techniques: true },
	"holy knight": {
		kind: "half-caster",
		spells: true,
		powers: true,
		techniques: true,
	},
	technomancer: {
		kind: "half-caster",
		spells: true,
		powers: true,
		techniques: true,
	},
	stalker: {
		kind: "half-caster",
		spells: true,
		powers: true,
		techniques: true,
	},
	mage: { kind: "full-caster", spells: true, powers: false, techniques: false },
	esper: {
		kind: "full-caster",
		spells: true,
		powers: false,
		techniques: false,
	},
	revenant: {
		kind: "full-caster",
		spells: true,
		powers: false,
		techniques: false,
	},
	summoner: {
		kind: "full-caster",
		spells: true,
		powers: false,
		techniques: false,
	},
	idol: { kind: "full-caster", spells: true, powers: false, techniques: false },
	herald: {
		kind: "full-caster",
		spells: true,
		powers: false,
		techniques: false,
	},
	contractor: {
		kind: "pact-caster",
		spells: true,
		powers: false,
		techniques: false,
	},
};

const JOB_NAMES = Object.keys(JOBS);

function getBaseJobs(type) {
	return JOB_NAMES.filter((job) => JOBS[job][type] === true);
}

function normalizeJob(j) {
	if (j.toLowerCase() === "holyknight") return "holy knight";
	return j.toLowerCase().trim();
}

function capitalize(s) {
	return s
		.split(" ")
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
		.join(" ");
}

const KEYWORD_RULES = [
	{
		keywords: [
			"smite",
			"oath",
			"divine",
			"radiant",
			"sacred",
			"sanctified",
			"judgment",
			"aegis",
			"devotion",
			"bastion",
			"purge",
			"searing",
			"war god",
		],
		allowed: ["holy knight"],
		type: "holy-knight",
	},
	{
		keywords: ["pact", "eldritch", "patron", "hex", "retaliation"],
		allowed: [],
		type: "contractor",
	},
	{
		keywords: [
			"idol",
			"hymn",
			"crescendo",
			"dance",
			"signal",
			"rhythm",
			"sonic",
		],
		allowed: [],
		type: "idol",
	},
	{
		keywords: ["shadow", "phantom", "withering", "execution"],
		allowed: ["assassin", "stalker"],
		type: "stealth",
	},
	{
		keywords: [
			"prey",
			"quarry",
			"hamstring",
			"entangle",
			"anomaly hunter",
			"predator",
		],
		allowed: ["assassin", "stalker"],
		type: "hunter",
	},
	{
		keywords: ["berserker", "fury", "overload", "rupture", "crimson howl"],
		allowed: ["berserker", "destroyer"],
		type: "berserker",
	},
	{
		keywords: ["gate", "lattice", "circuit", "emp", "device"],
		allowed: ["technomancer"],
		type: "technomancer",
	},
	{
		keywords: ["nerve", "kinetic", "velocity", "impulse", "unarmed"],
		allowed: ["striker", "destroyer"],
		type: "striker",
	},
];

function parseItemArrayFile(filePath, exportName) {
	const text = readFileSync(filePath, "utf8");
	const re = new RegExp(
		`export\\s+const\\s+${exportName}\\s*:\\s*[A-Za-z_][\\w<>\\[\\]\\s]*\\s*=\\s*(\\[[\\s\\S]*\\])\\s*;\\s*$`,
		"m",
	);
	const m = text.match(re);
	if (!m) {
		throw new Error(
			`Could not extract array literal for ${exportName} in ${filePath}`,
		);
	}
	const literal = m[1];
	let arr;
	try {
		arr = Function(`"use strict"; return (${literal});`)();
	} catch (err) {
		throw new Error(`Failed to parse ${exportName}: ${err.message}`);
	}
	return {
		text,
		literal,
		arr,
		header: text.slice(0, m.index),
		tail: text.slice(m.index + m[0].length),
	};
}

function auditAndFixFile(fileName, exportName, abilityType) {
	const filePath = join(COMPENDIUM_DIR, fileName);
	const { arr, text } = parseItemArrayFile(filePath, exportName);

	const baseJobs = getBaseJobs(abilityType);
	let modifiedText = text;

	const report = [];

	for (const entry of arr) {
		const currentClasses = Array.isArray(entry.classes)
			? entry.classes.map(normalizeJob)
			: [];
		let newClasses = [...currentClasses];

		// 1. Base jobs constraint: never allow full/pact-casters on powers/techniques naturally
		// Never allow martial-only jobs on spells
		newClasses = newClasses.filter((j) => baseJobs.includes(j));

		// 2. Keyword check
		let appliedRule = null;

		for (const rule of KEYWORD_RULES) {
			if (
				rule.keywords.some((kw) =>
					new RegExp(`\\b${kw}\\b`, "i").test(entry.name),
				)
			) {
				appliedRule = rule;
				// Filter to only allowed jobs
				newClasses = newClasses.filter((j) => rule.allowed.includes(j));
				// Add allowed jobs if they are natively allowed for this ability type
				for (const allowed of rule.allowed) {
					if (baseJobs.includes(allowed) && !newClasses.includes(allowed)) {
						newClasses.push(allowed);
					}
				}
				break;
			}
		}

		currentClasses.sort();
		newClasses.sort();

		if (JSON.stringify(currentClasses) !== JSON.stringify(newClasses)) {
			report.push({
				id: entry.id,
				name: entry.name,
				currentClasses: currentClasses.map(capitalize),
				expectedClasses: newClasses.map(capitalize),
				action: appliedRule ? appliedRule.type : "base-trim",
			});

			// Regex to find just this entry's classes array string
			const idMatch = new RegExp(
				`id:\\s*"${entry.id}"[\\s\\S]*?classes:\\s*\\[([^\\]]*)\\]`,
			);
			modifiedText = modifiedText.replace(idMatch, (match, classesStr) => {
				const newClassesStr =
					newClasses.length > 0
						? newClasses.map((c) => `"${capitalize(c)}"`).join(", ")
						: "";
				return match.replace(`[${classesStr}]`, `[${newClassesStr}]`);
			});
		}
	}

	if (modifiedText !== text) {
		writeFileSync(filePath, modifiedText, "utf8");
	}

	return report;
}

const report1 = auditAndFixFile("powers-core.ts", "powers_core", "powers");
const report2 = auditAndFixFile(
	"powers-supplemental.ts",
	"powers_supplemental",
	"powers",
);
const report3 = auditAndFixFile(
	"techniques-core.ts",
	"techniques_core",
	"techniques",
);
const report4 = auditAndFixFile(
	"techniques-supplemental.ts",
	"techniques_supplemental",
	"techniques",
);

const fullReport = [...report1, ...report2, ...report3, ...report4];
const reportPath = join(ROOT, "scripts", "audit", "class-access-report.json");
writeFileSync(reportPath, JSON.stringify(fullReport, null, 2));

console.log(`Audited and fixed ${fullReport.length} entries.`);
