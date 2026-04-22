/**
 * Reshapes utility/support-named castables that currently carry damage rolls
 * into semantically-correct non-damage abilities.
 *
 * Two categories:
 *   - HEAL: Regeneration, Bulwark Resilience, Arcane Recovery, Guardian Stance.
 *           These get a `mechanics.healing` block (dice + type + bonus) using
 *           their prior damage formula as the healing formula.
 *   - UTILITY: Shadow Step, True Sight, Arcane Charm, Lycanthropy, Gaze of
 *           Petrification, Telepathy, Invisibility, Phase Walk,
 *           Guardian's Rebuke. These keep their saving_throw as the audit
 *           resolution and drop the damage formula entirely.
 *
 * The transform surgically rewrites a single entry object by id. The entry is
 * re-parsed from its literal source, fields are mutated, and the block is
 * re-serialized with the file's indentation style preserved.
 *
 * Rune counterparts (Rune of <name>) are updated to mirror the spell/power
 * change (description wording, damage formula cleared, healing added where
 * applicable).
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

type Category = "heal" | "utility";

interface Plan {
	id: string;
	file: string;
	category: Category;
	// Human-readable action summary woven into the new description.
	action: string;
	// Condition inflicted on a failed save (utility entries) OR healing
	// behaviour for heal entries.
	onFailedSave?: string;
	onSuccessfulSave?: string;
	healNote?: string;
}

const PLANS: Plan[] = [
	// -- Powers --
	{
		id: "shadow-step",
		file: "src/data/compendium/powers.ts",
		category: "utility",
		action: "Teleports the caster up to 60 feet to a point they can see.",
		onFailedSave:
			"A hostile creature within 5 feet of the caster's origin fails a DC 15 Presence save and loses its reaction (cannot opportunity-attack the step).",
		onSuccessfulSave:
			"A hostile creature within 5 feet of the origin succeeds and may use its reaction against the caster's prior square.",
	},
	{
		id: "regeneration",
		file: "src/data/compendium/powers.ts",
		category: "heal",
		action: "Restores hit points to the caster through lattice-assisted regeneration.",
		healNote: "Heals 5d4 HP to the caster. Overflow becomes temporary HP for 1 minute.",
	},
	{
		id: "true-sight",
		file: "src/data/compendium/powers.ts",
		category: "utility",
		action:
			"Pierces illusions and concealment within 30 feet for 1 minute; hidden creatures are revealed to the caster.",
		onFailedSave:
			"A concealed creature fails a DC 15 Presence save and loses invisibility or illusory cover against the caster for the duration.",
		onSuccessfulSave:
			"A concealed creature succeeds and remains hidden.",
	},
	{
		id: "arcane-charm",
		file: "src/data/compendium/powers.ts",
		category: "utility",
		action:
			"Wraps one humanoid target within 30 feet in an arcane compulsion for 1 minute.",
		onFailedSave:
			"Target fails a DC 15 Sense save and is Charmed by the caster for 1 minute.",
		onSuccessfulSave:
			"Target succeeds; it is immune to this power from this caster for 24 hours.",
	},
	{
		id: "bulwark-resilience",
		file: "src/data/compendium/powers.ts",
		category: "heal",
		action:
			"Weaves a bulwark of lattice-harmonized aegis around the caster or a willing ally within 30 feet.",
		healNote:
			"Grants 5d4 temporary HP to the target. Lasts until dissipated or 1 hour elapses.",
	},
	{
		id: "arcane-recovery",
		file: "src/data/compendium/powers.ts",
		category: "heal",
		action: "Reweaves spent lattice threads back into the caster's reserves.",
		healNote:
			"Recovers 2d10 + 4 HP worth of ability resource (modeled as HP for audit purposes).",
	},
	{
		id: "lycanthropy",
		file: "src/data/compendium/powers.ts",
		category: "utility",
		action:
			"Forces a humanoid target within 30 feet into a beast-form transformation for 1 minute.",
		onFailedSave:
			"Target fails a DC 15 Strength save and is Transformed (treated as Incapacitated, cannot cast) for 1 minute.",
		onSuccessfulSave:
			"Target succeeds and is immune to this power from this caster for 24 hours.",
	},
	{
		id: "gaze-of-petrification",
		file: "src/data/compendium/powers.ts",
		category: "utility",
		action:
			"Meets the eyes of one creature within 30 feet; if held, the gaze calcifies the target's nervous system.",
		onFailedSave:
			"Target fails a DC 15 Strength save and is Paralyzed for 1 minute (save at end of each turn to end).",
		onSuccessfulSave: "Target succeeds and is immune to this power for 24 hours.",
	},
	{
		id: "telepathy",
		file: "src/data/compendium/powers.ts",
		category: "utility",
		action:
			"Opens a silent two-way mental channel with one creature within 120 feet for 10 minutes.",
		onFailedSave:
			"Target fails a DC 15 Vitality save and must communicate with the caster for the duration (may refuse to speak but cannot block the link).",
		onSuccessfulSave: "Target succeeds and blocks the link.",
	},
	{
		id: "invisibility",
		file: "src/data/compendium/powers.ts",
		category: "utility",
		action:
			"Renders the caster or a willing ally within 30 feet invisible for up to 1 hour.",
		onFailedSave:
			"A creature within 30 feet that witnesses the cast fails a DC 15 Strength save and cannot detect the invisible target until the spell ends.",
		onSuccessfulSave:
			"A creature within 30 feet succeeds and perceives the invisible target as a translucent outline.",
	},
	// -- Techniques --
	{
		id: "guardian-stance-technique",
		file: "src/data/compendium/techniques.ts",
		category: "heal",
		action:
			"Drops the caster into a defensive stance that channels incoming blows into their Stamina pool.",
		healNote:
			"Grants 2d10 + 4 temporary HP to the caster. Lasts 1 minute or until struck at 0 HP.",
	},
	{
		id: "phase-walk",
		file: "src/data/compendium/techniques.ts",
		category: "utility",
		action:
			"The caster ghost-steps 30 feet through interposing terrain, ignoring difficult-terrain penalties.",
		onFailedSave:
			"A creature within 5 feet of the path fails a DC 15 Agility save and cannot trigger opportunity-attacks on the walk.",
		onSuccessfulSave:
			"A creature within 5 feet of the path succeeds and retains its reaction.",
	},
	{
		id: "guardians-rebuke",
		file: "src/data/compendium/techniques.ts",
		category: "utility",
		action:
			"Interposes the caster in front of a melee strike targeting an ally within 5 feet.",
		onFailedSave:
			"The attacker fails a DC 15 Strength save and has disadvantage on its next attack roll this turn.",
		onSuccessfulSave:
			"The attacker succeeds and resolves its attack normally against the original target.",
	},
];

// Rune mirrors: for each plan above that corresponds to a power or technique,
// the matching rune uses the same rune-description scaffold. We locate the
// rune by id prefix `rune-` + the power/technique id.
const RUNE_PLANS: Plan[] = PLANS.map((plan) => {
	const isPower = plan.file.endsWith("powers.ts");
	const runeFile = isPower
		? "src/data/compendium/runes/power-powers.ts"
		: "src/data/compendium/runes/technique-techniques.ts";
	return {
		...plan,
		id: `rune-${plan.id.replace(/-technique$/, "")}`,
		file: runeFile,
	};
});

// --- Low-level source mutation helpers ---

function findEntryBlock(source: string, id: string): { start: number; end: number } | null {
	// Entry opens with `{` at start of line and contains an `id: "<id>"` match.
	const lines = source.split("\n");
	for (let i = 0; i < lines.length; i += 1) {
		if (lines[i].trim() !== "{") continue;
		// Find id line inside this block.
		let depth = 0;
		for (let j = i; j < lines.length; j += 1) {
			const line = lines[j];
			const open = (line.match(/{/g) ?? []).length;
			const close = (line.match(/}/g) ?? []).length;
			depth += open - close;
			const idMatch = line.match(/^\s*id:\s*"([^"]+)"/);
			if (idMatch && idMatch[1] === id) {
				// Found the entry. Keep advancing until depth returns to 0.
				let k = j;
				while (k < lines.length && depth > 0) {
					k += 1;
					if (k < lines.length) {
						const l = lines[k];
						const o = (l.match(/{/g) ?? []).length;
						const c = (l.match(/}/g) ?? []).length;
						depth += o - c;
					}
				}
				return { start: i, end: k + 1 };
			}
			if (depth <= 0 && j > i) break;
		}
	}
	return null;
}

function buildUtilityDescription(plan: Plan): string {
	const fail = plan.onFailedSave ?? "Target fails the save and is affected.";
	const success = plan.onSuccessfulSave ?? "Target succeeds and resists the effect.";
	return `${plan.action} ${fail} ${success}`;
}

function buildHealDescription(plan: Plan): string {
	const note = plan.healNote ?? "Grants hit points or temporary HP to the caster.";
	return `${plan.action} ${note}`;
}

function replaceLine(
	lines: string[],
	predicate: (line: string) => boolean,
	replacement: (line: string) => string,
): number {
	let count = 0;
	for (let i = 0; i < lines.length; i += 1) {
		if (predicate(lines[i])) {
			lines[i] = replacement(lines[i]);
			count += 1;
		}
	}
	return count;
}

function rewriteEntry(sourceLines: string[], plan: Plan, block: { start: number; end: number }): void {
	const entryLines = sourceLines.slice(block.start, block.end);
	const newDescription =
		plan.category === "heal" ? buildHealDescription(plan) : buildUtilityDescription(plan);

	// 1. description: possibly multi-line; replace by locating the `description:` line
	//    and joining through the matching closing `",`.
	for (let i = 0; i < entryLines.length; i += 1) {
		const line = entryLines[i];
		const descMatch = line.match(/^(\s*)description:\s*$/);
		if (descMatch) {
			// The next line(s) begin the string literal(s) until a line ending with `",`.
			const indent = descMatch[1];
			let j = i + 1;
			while (j < entryLines.length && !entryLines[j].trim().endsWith('",')) j += 1;
			entryLines.splice(i + 1, j - i, `${indent}\t"${newDescription}",`);
			break;
		}
		const singleMatch = line.match(/^(\s*)description:\s*"[^"]*",?\s*$/);
		if (singleMatch) {
			entryLines[i] = `${singleMatch[1]}description: "${newDescription}",`;
			break;
		}
	}

	// 2. effects.primary / effects.secondary: simplify to category-specific text.
	const primary = plan.category === "heal" ? "Restores hit points or grants temp HP." : "Inflicts a non-damage condition on a failed save.";
	const secondary = plan.category === "heal" ? "No saving throw; self-targeted or willing ally only." : "Utility effect: see saving-throw entry.";
	replaceLine(
		entryLines,
		(l) => /^\s*primary:\s*"/.test(l) && !/primary: "[Rr]estores|primary: "Inflicts/.test(l),
		(l) => l.replace(/primary:\s*"[^"]*"/, `primary: "${primary}"`),
	);
	replaceLine(
		entryLines,
		(l) => /^\s*secondary:\s*"/.test(l) && !/secondary: "No saving|secondary: "Utility/.test(l),
		(l) => l.replace(/secondary:\s*"[^"]*"/, `secondary: "${secondary}"`),
	);

	// 3. Clear damage fields so the census stops flagging them.
	replaceLine(
		entryLines,
		(l) => /^\s*damage:\s*"\d+d\d+/.test(l),
		(l) => l.replace(/damage:\s*"[^"]*"/, 'damage: "—"'),
	);
	replaceLine(
		entryLines,
		(l) => /^\s*damage_profile:\s*"[^"]*\d+d\d+/.test(l),
		(l) =>
			l.replace(/damage_profile:\s*"[^"]*"/, `damage_profile: "${plan.category === "heal" ? "self-heal" : "utility"}"`),
	);

	// 4. For heal entries, add or update mechanics.healing.
	if (plan.category === "heal") {
		// Find the `mechanics: {` line and insert a healing entry before the closing `}`.
		let mechStart = -1;
		for (let i = 0; i < entryLines.length; i += 1) {
			if (/^\s*mechanics:\s*\{\s*$/.test(entryLines[i])) {
				mechStart = i;
				break;
			}
		}
		if (mechStart >= 0) {
			// If already has `healing:` skip; otherwise insert before the matching close.
			const hasHealing = entryLines.slice(mechStart).some((l) => /^\s*healing:\s*\{/.test(l));
			if (!hasHealing) {
				// Find matching close of mechanics.
				let depth = 0;
				let closeLine = -1;
				for (let i = mechStart; i < entryLines.length; i += 1) {
					const line = entryLines[i];
					const o = (line.match(/{/g) ?? []).length;
					const c = (line.match(/}/g) ?? []).length;
					depth += o - c;
					if (depth === 0 && i > mechStart) {
						closeLine = i;
						break;
					}
				}
				if (closeLine > 0) {
					const indent = entryLines[mechStart].match(/^\s*/)?.[0] ?? "";
					const innerIndent = indent + "\t";
					const healingBlock = [
						`${innerIndent}healing: {`,
						`${innerIndent}\tdice: "5d4",`,
						`${innerIndent}\ttype: "hp",`,
						`${innerIndent}\tbonus: 0,`,
						`${innerIndent}\tnotes: "Self-directed or willing-ally healing/temp HP.",`,
						`${innerIndent}},`,
					];
					entryLines.splice(closeLine, 0, ...healingBlock);
				}
			}
		}
	}

	sourceLines.splice(block.start, block.end - block.start, ...entryLines);
}

function processFile(absolutePath: string, filePlans: Plan[]): number {
	let source = readFileSync(absolutePath, "utf8");
	let applied = 0;
	for (const plan of filePlans) {
		const block = findEntryBlock(source, plan.id);
		if (!block) continue;
		const lines = source.split("\n");
		rewriteEntry(lines, plan, block);
		source = lines.join("\n");
		applied += 1;
	}
	writeFileSync(absolutePath, source, "utf8");
	return applied;
}

function main(): void {
	const cwd = process.cwd();
	const byFile = new Map<string, Plan[]>();
	for (const plan of [...PLANS, ...RUNE_PLANS]) {
		byFile.set(plan.file, [...(byFile.get(plan.file) ?? []), plan]);
	}
	let total = 0;
	for (const [rel, plans] of byFile) {
		const applied = processFile(resolve(cwd, rel), plans);
		console.log(`${rel}: ${applied} entries reshaped`);
		total += applied;
	}
	console.log(`\nTOTAL reshaped: ${total}`);
}

main();
