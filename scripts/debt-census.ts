/**
 * Content-debt census.
 *
 * Walks the raw static compendium and enumerates remaining content concerns
 * that the audit does not currently cover: cross-tier name collisions,
 * name-vs-damage-type mismatches, naming case inconsistency, and entries
 * that carry damage mechanics when their name implies a non-damage effect.
 */

import { spells as allSpells } from "../src/data/compendium/spells/index";
import { powers as allPowers } from "../src/data/compendium/powers";
import { techniques as allTechniques } from "../src/data/compendium/techniques";
import { allRunes } from "../src/data/compendium/runes/index";

type Entry = {
	id?: string;
	name?: string;
	display_name?: string;
	description?: string;
	rank?: string;
	attack?: { damage?: unknown; [k: string]: unknown } | undefined;
	mechanics?: {
		damage_profile?: unknown;
		attack?: { damage_type?: unknown } | undefined;
		[k: string]: unknown;
	} | undefined;
	effects?: { primary?: unknown; secondary?: unknown; [k: string]: unknown } | undefined;
};

type DatasetEntry = { dataset: string; entry: Entry };

const datasets: Array<[string, Entry[]]> = [
	["spells", allSpells as Entry[]],
	["powers", allPowers as Entry[]],
	["techniques", allTechniques as Entry[]],
	["runes", allRunes as Entry[]],
];

const allEntries: DatasetEntry[] = datasets.flatMap(([dataset, entries]) =>
	entries.map((entry) => ({ dataset, entry })),
);

// -- Cross-tier name collisions within a single dataset --
function crossTierNameCollisions(dataset: string, entries: Entry[]): string[] {
	const byName = new Map<string, Entry[]>();
	for (const entry of entries) {
		const key = (entry.name ?? "").trim();
		if (!key) continue;
		byName.set(key, [...(byName.get(key) ?? []), entry]);
	}
	const messages: string[] = [];
	for (const [name, rows] of byName) {
		if (rows.length > 1) {
			const ranks = rows.map((row) => row.rank ?? "?").join(",");
			messages.push(`${dataset}: "${name}" appears ${rows.length}× (ranks: ${ranks})`);
		}
	}
	return messages;
}

// -- Naming case inconsistency (Title Case vs sentence case) --
// A reliable heuristic: multi-word names where a non-leading, non-stopword
// word is lowercased. If the same base noun appears with different case
// conventions across entries, it's a normalization gap.
const STOPWORDS = new Set([
	"of",
	"the",
	"and",
	"or",
	"a",
	"an",
	"in",
	"to",
	"for",
	"with",
]);

function namingCaseMismatches(entries: DatasetEntry[]): string[] {
	const messages: string[] = [];
	for (const { dataset, entry } of entries) {
		const name = (entry.name ?? "").trim();
		if (!name || !name.includes(" ")) continue;
		const parts = name.split(/\s+/);
		for (let i = 1; i < parts.length; i += 1) {
			const word = parts[i];
			if (STOPWORDS.has(word.toLowerCase())) continue;
			if (!/^[A-Z]/.test(word) && /^[a-z]/.test(word)) {
				messages.push(
					`${dataset}: "${name}" — word "${word}" is lowercase but should be Title Case`,
				);
				break;
			}
		}
	}
	return messages;
}

// -- Damage-type vs name-theme mismatch --
// Map of theme tokens (as might appear in a spell name) to the damage types
// we expect. If an entry's name carries the token but its damage_type does
// not, flag it.
const THEME_DAMAGE_MAP: Array<[RegExp, string[]]> = [
	[/\b(chill|ice|frost|arctic|glacial|blizzard|cold)\b/i, ["cold"]],
	[/\b(fire|flame|blaze|inferno|scorch|pyre|molten|burning)\b/i, ["fire"]],
	[/\b(lightning|thunder|storm|tempest|surge|shock|electric)\b/i, ["lightning", "thunder"]],
	[/\b(shadow|void|night|dark|umbral|eclipse)\b/i, ["necrotic", "psychic", "cold"]],
	[/\b(radiant|sun|solar|corona|blaze of light|holy|divine|light|dawn)\b/i, ["radiant", "fire"]],
	[/\b(blood|crimson|sanguine|carnage|gore)\b/i, ["necrotic", "slashing", "force"]],
	[/\b(poison|toxin|venom|plague|blight)\b/i, ["poison"]],
	[/\b(psychic|mind|psion|mental|nightmare)\b/i, ["psychic"]],
	[/\b(acid|corrosive)\b/i, ["acid"]],
	[/\b(force|arcane|mana|aether)\b/i, ["force"]],
	[/\b(entropy|decay|rot|wither|siphon|drain|necrotic)\b/i, ["necrotic"]],
];

function collectDamageType(entry: Entry): string | null {
	const fromAttack = entry.mechanics?.attack?.damage_type;
	if (typeof fromAttack === "string" && fromAttack.length > 0) return fromAttack;
	const profile = entry.mechanics?.damage_profile;
	if (typeof profile === "string") {
		const m = profile.match(/\b(fire|cold|lightning|thunder|necrotic|radiant|psychic|force|acid|poison|slashing|piercing|bludgeoning)\b/i);
		if (m) return m[1].toLowerCase();
	}
	return null;
}

function damageTypeMismatches(entries: DatasetEntry[]): string[] {
	const messages: string[] = [];
	for (const { dataset, entry } of entries) {
		const name = (entry.name ?? "").trim();
		if (!name) continue;
		const damageType = collectDamageType(entry);
		if (!damageType) continue;
		for (const [themeRegex, expected] of THEME_DAMAGE_MAP) {
			if (themeRegex.test(name)) {
				if (!expected.includes(damageType.toLowerCase())) {
					messages.push(
						`${dataset}: "${name}" (rank ${entry.rank ?? "?"}) — name theme expects ${expected.join("/")} but damage_type is "${damageType}"`,
					);
				}
				break;
			}
		}
	}
	return messages;
}

// -- Non-damage-themed names carrying damage mechanics --
// Names that semantically imply support/utility effects but have damage rolls.
const UTILITY_NAME_TOKENS = [
	/\b(regenerat|heal|restor|mend|cure|revital)/i,
	/\b(invisibil|invisible|cloak|veil|obscure)/i,
	/\b(telepath|mind link|mind speech|mind speak)/i,
	/\b(true sight|clairvoy|scry|detect|reveal)/i,
	/\b(shadow step|blink|teleport|phase|step of)/i,
	/\b(resilience|fortitude|endurance|guard|ward)/i,
	/\b(charm|persuade|calm|beguile|pacify)/i,
	/\b(recovery|refresh|renew|meditate)/i,
	/\b(lycanthrop|shapeshift|polymorph|transform)/i,
	/\b(petrif|paralysis|stun|freeze mind)/i,
];

function hasDamageRoll(entry: Entry): boolean {
	const dmg = entry.attack?.damage;
	if (typeof dmg === "string" && /\d+d\d+/.test(dmg)) return true;
	const profile = entry.mechanics?.damage_profile;
	if (typeof profile === "string" && /\d+d\d+/.test(profile)) return true;
	return false;
}

function utilityNameWithDamage(entries: DatasetEntry[]): string[] {
	const messages: string[] = [];
	for (const { dataset, entry } of entries) {
		const name = (entry.name ?? "").trim();
		if (!name) continue;
		if (!hasDamageRoll(entry)) continue;
		for (const token of UTILITY_NAME_TOKENS) {
			if (token.test(name)) {
				messages.push(
					`${dataset}: "${name}" (rank ${entry.rank ?? "?"}) — utility/support name carries damage roll`,
				);
				break;
			}
		}
	}
	return messages;
}

function main(): void {
	console.log("=== Cross-tier name collisions ===");
	for (const [name, entries] of datasets) {
		const results = crossTierNameCollisions(name, entries);
		for (const r of results) console.log("- " + r);
	}

	console.log("\n=== Damage-type vs name-theme mismatches ===");
	for (const m of damageTypeMismatches(allEntries)) console.log("- " + m);

	console.log("\n=== Utility/support names with damage rolls ===");
	for (const m of utilityNameWithDamage(allEntries)) console.log("- " + m);

	console.log("\n=== Naming case inconsistency (sample of 20) ===");
	const caseMessages = namingCaseMismatches(allEntries);
	for (const m of caseMessages.slice(0, 20)) console.log("- " + m);
	if (caseMessages.length > 20) console.log(`... and ${caseMessages.length - 20} more`);

	console.log("\n=== TOTALS ===");
	const crossTier = datasets.reduce(
		(acc, [name, rows]) => acc + crossTierNameCollisions(name, rows).length,
		0,
	);
	console.log(`cross-tier name collisions: ${crossTier}`);
	console.log(`damage-type mismatches: ${damageTypeMismatches(allEntries).length}`);
	console.log(`utility-with-damage: ${utilityNameWithDamage(allEntries).length}`);
	console.log(`naming case inconsistency: ${caseMessages.length}`);
}

main();
