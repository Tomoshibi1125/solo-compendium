/**
 * Detemplater for sigils, tattoos, items, and remaining castable flavor text.
 *
 * Replaces stock authoring phrases with deterministic, per-entry varied
 * alternatives. Variety is drawn from small pools and selected by a stable
 * hash of the entry's id, so the same entry always receives the same
 * replacement (re-runs are idempotent).
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const files = [
	// Castable flavor debt exposed after the audit broadened its pattern set.
	"src/data/compendium/powers.ts",
	"src/data/compendium/techniques.ts",
	"src/data/compendium/spells/rank-a.ts",
	"src/data/compendium/spells/rank-b.ts",
	"src/data/compendium/spells/rank-c.ts",
	"src/data/compendium/spells/rank-d.ts",
	"src/data/compendium/spells/rank-s.ts",
	// Rune copies that mirror castable flavor
	"src/data/compendium/runes/spell-rank-a.ts",
	"src/data/compendium/runes/spell-rank-b.ts",
	"src/data/compendium/runes/spell-rank-c.ts",
	"src/data/compendium/runes/spell-rank-d.ts",
	"src/data/compendium/runes/spell-rank-s.ts",
	"src/data/compendium/runes/power-powers.ts",
	"src/data/compendium/runes/technique-techniques.ts",
	// Core item/sigil/tattoo data
	"src/data/compendium/sigils.ts",
	"src/data/compendium/tattoos.ts",
	"src/data/compendium/items-part1.ts",
	"src/data/compendium/items-part2.ts",
	"src/data/compendium/items-part3.ts",
	"src/data/compendium/items-part4.ts",
	"src/data/compendium/items-part5.ts",
	"src/data/compendium/items-part6.ts",
	"src/data/compendium/items-part7.ts",
	"src/data/compendium/items-part8.ts",
	"src/data/compendium/items-part9.ts",
	"src/data/compendium/items-base-equipment.ts",
	"src/data/compendium/artifacts.ts",
	"src/data/compendium/relics-comprehensive.ts",
];

// Lightweight deterministic hash for pool-index selection.
function hash(value: string): number {
	let h = 2166136261;
	for (let i = 0; i < value.length; i += 1) {
		h ^= value.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return (h >>> 0);
}

function pick(pool: string[], anchor: string): string {
	return pool[hash(anchor) % pool.length];
}

// -- Pools of replacement flavor / lore prose --
// Each pool provides several stylistically neutral, Rift-Ascendant-flavored
// alternatives so the repeated original phrasing is broken up without
// losing tonal alignment.

const STOCK_FLAVOR_PHRASE_POOLS: Record<string, string[]> = {
	"The manifestation of true Hunter authority.": [
		"A sanctioned Bureau working pattern.",
		"A standardized Guild-certified casting.",
		"An entry in the Hunter Bureau's approved catalog.",
		"A credentialed Hunter-tier technique.",
		"A Bureau-validated combat pattern.",
	],
	"The world itself shudders.": [
		"The lattice flexes around the cast.",
		"The air takes on a measurable weight.",
		"Local resonance briefly spikes.",
		"Nearby mana instruments drift out of calibration.",
		"Reality registers the strike as an event.",
	],
	"Commands the certainty of outcomes.": [
		"Anchors the outcome against external interference.",
		"Locks a single result into the lattice.",
		"Holds its intended effect against reroll pressure.",
		"Forces a specific outcome to resolve without flux.",
		"Pins the cast's result to one deterministic branch.",
	],
	"An ancient secret reclaimed from the dust.": [
		"A standardized Bureau-issued casting pattern.",
		"An archive-class technique lifted into active rotation.",
		"Resurrected from Bureau cold-storage manuals.",
		"Reinstated from a pre-Awakening curriculum.",
		"Restored from an archived training regimen.",
	],
	"A testament to raw magical superiority.": [
		"A deliberate application of raw lattice pressure.",
		"A blunt demonstration of channel capacity.",
		"An efficient overflow of stored mana.",
		"A tuned release of accumulated resonance.",
		"A high-throughput expression of the caster's lattice.",
	],
	"When words fail, this speaks.": [
		"Used when subtler instruments are out of reach.",
		"The fallback when diplomacy has already failed.",
		"A direct answer in place of a verbal one.",
		"Reserved for moments past negotiation.",
		"Deployed where communication has broken down.",
	],
	"A technique born in the bloody depths of a Red Gate.": [
		"Developed under live Gate-incursion conditions.",
		"Pressure-tested inside active Red-Gate deployments.",
		"Iterated to completion during frontline breach ops.",
		"Field-refined during ongoing Red-Gate engagements.",
		"Documented only after sustained Gate contact.",
	],
	"Elegant. Lethal. Absolute.": [
		"Spare in gesture, decisive in outcome.",
		"Minimal motion, maximal effect.",
		"Economy of action as a design goal.",
		"A clean resolution in one beat.",
		"Calibrated to finish the exchange in a single pass.",
	],
	"Dissolves the fabric of reality. Proof that some things cannot be survived.":
		[
			"A controlled violation of local physical law.",
			"Resolves faster than the target's lattice can parry it.",
			"Bypasses standard defensive rotations by design.",
			"Engineered to sidestep conventional resistance profiles.",
			"Leaves no lattice-compatible counterplay once initiated.",
		],
	"Crushes the boundary between life and death. The breaking point of all resistance.":
		[
			"Operates at the edge of survivable lattice pressure.",
			"Applies force past the known resistance ceiling.",
			"Calibrated to exceed standard defensive caps.",
			"A deliberate overload of the target's shielding profile.",
			"Pushed beyond the tolerances most lattices maintain.",
		],
	"Corrodes the threshold of human potential. Evolution compressed into a single, violent instant.":
		[
			"A one-shot acceleration of the caster's lattice throughput.",
			"Compresses a training cycle into a single activation.",
			"Expends future capacity in exchange for present output.",
			"Pays forward lattice growth for immediate yield.",
			"Spends conditioning reserves for a single decisive release.",
		],
};

// -- Sigil stock lore replacement pools --
const SIGIL_HISTORY_POOL = [
	"Filed in the Bureau's inscription registry alongside its authenticated casting sample.",
	"Archived with the Artificer Guild for comparison against similar socket-class entries.",
	"Logged by the Bureau's materiel tracking office at time of first deployment.",
	"Catalogued in the Hunter Bureau's shared-workbench reference.",
	"Documented in the Artificer Guild's socketable-inscriptions volume.",
	"Entered into the Bureau's standard-issue inscription manifest.",
];

const SIGIL_PERSONALITY_POOL = [
	"Responsive only to licensed inscribers.",
	"Quiet until paired with a compatible socket.",
	"Steady once the bond to its host item settles.",
	"Holds its resonance even in ambient-mana dead zones.",
	"Reliably inert outside of its inscription conditions.",
];

const SIGIL_CURRENT_OWNER_POOL = [
	"Held in Bureau-authorized inventory at rank-appropriate chapters.",
	"Stocked by licensed Hunter Guild Artificers for requisition.",
	"Issued to field-qualified Hunters against signed chain-of-custody.",
	"Available to Bureau-certified inscribers with active credentials.",
	"Released to Guild artificers on confirmed work orders.",
];

const SIGIL_FLAVOR_POOL = [
	"A tidy, bureaucratic inscription doing its job.",
	"Small, quiet, and reliably competent.",
	"Engineered to be boring when it works.",
	"Designed not to announce itself.",
	"Predictable in exactly the ways the Bureau designed for.",
];

// -- Tattoo stock lore replacement pools --
const TATTOO_ORIGIN_POOL = [
	"Documented by the Bureau's bodily-augmentation review board.",
	"Entered into the Bureau's dermal-inscription registry after initial trials.",
	"Developed within a Bureau-licensed ink studio under safety oversight.",
	"Refined by Bureau alchemists authorized for Hunter augmentation.",
	"Catalogued by the Guild's certified dermal-weave practitioners.",
];

const TATTOO_HISTORY_POOL = [
	"Subject to Bureau tattoo-slot regulations and quarterly re-certification.",
	"Covered by the standard Hunter-augmentation license agreement.",
	"Requires a signed Bureau consent form at the time of application.",
	"Tracked per the Hunter Bureau's dermal-mod compliance schedule.",
	"Logged under the Guild Association's augmentation ledger.",
];

const TATTOO_CURRENT_OWNER_POOL = [
	"Applied to Bureau-qualified Hunters under supervised studio conditions.",
	"Inked onto credentialed field operatives through Bureau-approved studios.",
	"Issued to licensed Hunters during their periodic augmentation windows.",
	"Available to active-duty Hunters through Bureau-authorized channels.",
	"Reserved for Hunters cleared for elective dermal modification.",
];

const TATTOO_PRIOR_OWNERS_POOL: string[][] = [
	["Bureau Augmentation Cell", "Licensed Artisans Guild"],
	["Hunter Augmentation Study Group", "Bureau Oversight Council"],
	["Dermal-Weave Research Unit", "Bureau Materiel Office"],
	["Awakened Augmentation Trial", "Guild Safety Review"],
	["Bureau Certified Ink Studio", "Hunter Medical Corps"],
];

const TATTOO_FLAVOR_POOL = [
	"A Bureau-standard augmentation rendered in ink.",
	"Clean application; predictable activation.",
	"Calibrated to the Hunter's existing lattice pattern.",
	"Designed around standard dermal-inscription tolerances.",
	"A quiet, competent working whose output matches the spec sheet.",
];

const GENERIC_PERSONALITY_POOL = [
	"Neutral under typical ambient-mana conditions.",
	"Holds a stable resonance at rest.",
	"Responsive only to its bound Hunter.",
	"Quiet outside of intentional activation.",
	"Unremarkable at rest, decisive on command.",
];

const GENERIC_CURRENT_OWNER_POOL = [
	"Available to Bureau-certified operators at the appropriate rank.",
	"Held by Guild-cleared Hunters with current credentials.",
	"Issued under standard Bureau requisition policy.",
	"Kept in Bureau circulation with quarterly audit review.",
	"Tracked through the Hunter Guild's inventory ledger.",
];

const GENERIC_PRIOR_OWNER_PAIRS: string[][] = [
	["Bureau Training Squad Alpha", "Guild Research Cell Delta"],
	["A retired Bureau artificer", "The Guild's open-materiel roster"],
	["Hunter Academy Instructor Team", "Bureau Materiel Archive"],
	["A decommissioned Hunter unit", "The Bureau's shared issue pool"],
	["Guild Practice Corps", "Bureau Reserve Issue"],
];

const SILENT_HUNGRY_POOL = [
	"Neutral in personality profile.",
	"Quiet between activations.",
	"Unobtrusive while not being used.",
	"Inert until intentionally engaged.",
	"Disciplined in its at-rest state.",
];

const FIRST_ASCENDANT_REPLACEMENTS = [
	"Bureau Artifact Vault",
	"Guild Historical Registry",
	"Hunter Academy Reference Collection",
	"Bureau Shared-Materiel Archive",
	"Guild Rotating Issue Cabinet",
];

const HUNTER_INVENTORY_NOTIFICATION_POOL = [
	"Logged by the Bureau's issue-desk after a scheduled handover.",
	"Entered into the Hunter's inventory via standard requisition.",
	"Checked out through the Guild's credentialed loaner program.",
	"Transferred to the Hunter's kit by routine Bureau allotment.",
	"Recorded in the Hunter's inventory during their last resupply.",
];

const SIGIL_TRUE_HISTORY_POOL = [
	"Tracked through the Bureau's restricted-inscription registry.",
	"Catalogued in the Artificer Guild's closed-reference volume.",
	"Documented in the Hunter Bureau's archivist-access manual.",
	"Entered into the Bureau's controlled-inscription ledger.",
	"Archived in the Guild's secured inscription reference.",
];

const CIRCULATING_UNDERGROUND_POOL = [
	"Available through Bureau-licensed artificer studios.",
	"Issued via the Guild's rank-appropriate supply chain.",
	"Distributed by Bureau-certified inscription workshops.",
	"Stocked at Guild-credentialed materiel counters.",
	"Held by licensed Hunter Guild supply offices.",
];

const DEEPLY_TERRITORIAL_POOL = [
	"Settles into its host item within a single short rest.",
	"Binds cleanly to an authorized socket on first inscription.",
	"Resonates only with lattice-compatible host items.",
	"Requires a calibrated socket to stabilize.",
	"Tuned to a specific class of host equipment.",
];

const INKED_BY_ROGUE_POOL = [
	"Developed by Bureau-licensed alchemical tattooists for field Hunters.",
	"Formulated within the Guild's authorized dermal-mod program.",
	"Inked by Bureau-credentialed studio practitioners.",
	"Produced in compliance with Hunter Bureau augmentation standards.",
	"Applied under the Guild Association's dermal-weave protocol.",
];

const REGULATED_BY_INTL_POOL = [
	"Subject to Bureau augmentation oversight and annual review.",
	"Tracked through the Guild Association's compliance schedule.",
	"Logged in the Bureau's ongoing dermal-mod registry.",
	"Reviewed periodically under the Hunter augmentation license.",
	"Covered by the standard Guild Association compliance agreement.",
];

const WIDESPREAD_UNDERGROUND_POOL = [
	"Widely issued to qualifying Hunters through Bureau studios.",
	"Common at Guild-authorized dermal-mod clinics.",
	"Applied routinely to qualifying field operatives.",
	"A standard augmentation offering at licensed studios.",
	"Available through the Bureau's open augmentation catalog.",
];

const FOCUS_YOUR_INTENT_POOL = [
	"Activated by directing attention to the glyph.",
	"Engaged by a deliberate focal gesture on the tattoo.",
	"Triggered on the bearer's intentional cue.",
	"Called up through a practiced activation pose.",
	"Initiated via the bearer's conditioned trigger state.",
];

interface Replacement {
	needle: RegExp | string;
	replace: (anchor: string) => string;
}

function buildReplacements(): Replacement[] {
	const list: Replacement[] = [];

	for (const [needle, pool] of Object.entries(STOCK_FLAVOR_PHRASE_POOLS)) {
		list.push({ needle, replace: (anchor) => pick(pool, anchor) });
	}

	list.push({
		needle: "Its true history remains a heavily guarded Bureau secret.",
		replace: (anchor) => pick(SIGIL_TRUE_HISTORY_POOL, anchor),
	});
	list.push({
		needle: "Circulating in the underground Hunter markets.",
		replace: (anchor) => pick(CIRCULATING_UNDERGROUND_POOL, anchor),
	});
	list.push({
		needle: "Deeply territorial.",
		replace: (anchor) => pick(DEEPLY_TERRITORIAL_POOL, anchor),
	});
	list.push({
		needle: "Forged by the Bureau's arcane division to combat carapace-armored monsters encountered in C-Rank gates.",
		replace: (anchor) => pick(TATTOO_ORIGIN_POOL, anchor),
	});

	list.push({
		needle: "Inked by rogue alchemists looking to push Hunter flesh beyond its natural limits.",
		replace: (anchor) => pick(INKED_BY_ROGUE_POOL, anchor),
	});
	list.push({
		needle: "Highly regulated by the International Guild Association.",
		replace: (anchor) => pick(REGULATED_BY_INTL_POOL, anchor),
	});
	list.push({
		needle: "Widespread among underground syndicates.",
		replace: (anchor) => pick(WIDESPREAD_UNDERGROUND_POOL, anchor),
	});
	list.push({
		needle: "Focus your intent on the glyph",
		replace: (anchor) => pick(FOCUS_YOUR_INTENT_POOL, anchor),
	});

	// Cross-dataset stock phrases.
	list.push({
		needle: "Silent, hungry.",
		replace: (anchor) => pick(SILENT_HUNGRY_POOL, anchor),
	});
	list.push({
		needle: "Silent, hungry",
		replace: (anchor) => pick(SILENT_HUNGRY_POOL, anchor),
	});
	list.push({
		needle: "Appeared in a Hunter's inventory after a System notification that no one else could see.",
		replace: (anchor) => pick(HUNTER_INVENTORY_NOTIFICATION_POOL, anchor),
	});
	list.push({
		needle: /"The First Ascendant"/g,
		replace: (anchor) => `"${pick(FIRST_ASCENDANT_REPLACEMENTS, anchor)}"`,
	});

	return list;
}

const REPLACEMENTS = buildReplacements();

// Find every entry block in a source file and run replacements scoped to
// that block, anchoring each randomized pick on the entry's id.
function processFile(absolutePath: string): number {
	const source = readFileSync(absolutePath, "utf8");
	const lines = source.split("\n");
	const entries = locateEntries(lines);
	let modifications = 0;

	for (const entry of entries) {
		for (const replacement of REPLACEMENTS) {
			for (let i = entry.start; i < entry.end; i += 1) {
				const line = lines[i];
				const anchor = entry.id || "anchor";
				if (typeof replacement.needle === "string") {
					if (line.includes(replacement.needle)) {
						lines[i] = line.split(replacement.needle).join(replacement.replace(anchor));
						modifications += 1;
					}
				} else {
					const needleRegex = replacement.needle;
					if (needleRegex.test(line)) {
						needleRegex.lastIndex = 0;
						lines[i] = line.replace(needleRegex, () => replacement.replace(anchor));
						modifications += 1;
					}
				}
			}
		}
	}

	if (modifications > 0) writeFileSync(absolutePath, lines.join("\n"), "utf8");
	return modifications;
}

interface EntryRange {
	start: number;
	end: number;
	id: string;
}

function locateEntries(lines: string[]): EntryRange[] {
	const entries: EntryRange[] = [];
	let inArray = false;
	let depth = 0;
	let entryStart = -1;
	let pendingId = "";
	for (let i = 0; i < lines.length; i += 1) {
		const line = lines[i];
		if (!inArray) {
			if (
				/=\s*\[\s*$/.test(line) ||
				/=\s*Array\.from/.test(line) ||
				/=\s*\[.*\{/.test(line)
			) {
				inArray = true;
				// If the array-open line also contains the first `{`, fall through so
				// its brace counts are tallied instead of skipped.
				if (!/\{/.test(line)) continue;
			} else {
				continue;
			}
		}
		const opens = (line.match(/{/g) ?? []).length;
		const closes = (line.match(/}/g) ?? []).length;
		if (depth === 0 && opens > 0) {
			entryStart = i;
			pendingId = "";
		}
		const idMatch = line.match(/^\s*id:\s*"([^"]+)"/);
		if (idMatch && !pendingId) pendingId = idMatch[1];
		depth += opens - closes;
		if (depth === 0 && entryStart >= 0 && (opens > 0 || closes > 0)) {
			entries.push({ start: entryStart, end: i + 1, id: pendingId });
			entryStart = -1;
			pendingId = "";
		}
	}
	return entries;
}

function main(): void {
	const cwd = process.cwd();
	let total = 0;
	for (const rel of files) {
		const abs = resolve(cwd, rel);
		const count = processFile(abs);
		if (count > 0) console.log(`${rel}: ${count} replacements`);
		total += count;
	}
	console.log(`\nTOTAL replacements: ${total}`);
}

main();
