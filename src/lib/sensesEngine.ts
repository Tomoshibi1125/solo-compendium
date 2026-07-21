/**
 * Senses Engine — Computes character senses (darkvision, blindsight, tremorsense, truesight)
 *
 * Aggregates senses from Job, Path, Regent, equipment, and spell effects.
 * Uses "best-of" stacking: multiple sources of darkvision use the highest range.
 */

import { getStaticJobs } from "@/lib/ProtocolDataManager";

// ─── Types ──────────────────────────────────────────────────
export interface CharacterSenses {
	darkvision: number; // range in feet, 0 = no darkvision
	blindsight: number; // range in feet
	tremorsense: number; // range in feet
	truesight: number; // range in feet
	passivePerception: number;
	passiveInvestigation: number;
	passiveInsight: number;
	passiveStealth: number;
}

/** The four special senses RA tracks, matching `CharacterSenses` keys. */
export type SpecialSense =
	| "darkvision"
	| "blindsight"
	| "tremorsense"
	| "truesight";

const SENSE_ALT = "darkvision|blindsight|tremorsense|truesight";

// A sense binds to the WEARER only from canonical, self-directed phrasing —
// mirroring the closed-vocabulary approach parseModifiers uses for resistances
// (equipmentModifiers.ts). Two accepted shapes:
//   1. a bare mechanical property token — "darkvision 60 ft" — the sense at
//      the very start of the property, how buildItemProperties emits it; and
//   2. explicit self-directed prose — "you gain/have darkvision 60 ft",
//      "grants darkvision 60 ft".
// Narrative that assigns the sense to someone/something else ("your ally
// gains…", "the target has…", "a scanner (truesight 120 ft)") must NEVER
// bind — the item-effect-prose-binding house rule. No current item data
// exercises the prose forms, but the guard keeps a future authoring mistake
// from silently granting the wearer a drone's or ally's sense.
const SENSE_TOKEN_RE = new RegExp(`^\\s*(${SENSE_ALT})\\s*(\\d+)\\s*ft`, "i");
// Self-directed prose only: the property must START with the granting phrase
// (anchored), so "your ally gains darkvision 60 ft" — where another subject
// precedes the verb — cannot match. "you gain/have …", "grants …", "gain …".
const SENSE_PROSE_RE = new RegExp(
	`^\\s*(?:you\\s+(?:gain|have)|grants?|gain)\\s+(${SENSE_ALT})\\s*(\\d+)\\s*ft`,
	"i",
);

/**
 * Extract special senses granted by gear from its property strings, keeping
 * the LONGEST range per sense ("best-of" stacking, per this module's header).
 *
 * Item-granted senses previously reached only `characterEngine.computeSenses`,
 * which had no production caller — so a relic granting darkvision showed
 * nothing on the sheet (Jul 19 audit). Job/racial senses were unaffected:
 * those persist on the `senses` column.
 */
export function extractSensesFromProperties(
	sources: ReadonlyArray<{
		properties?: ReadonlyArray<string | null | undefined> | null;
	}>,
): Partial<Record<SpecialSense, number>> {
	const found: Partial<Record<SpecialSense, number>> = {};
	const bind = (match: RegExpMatchArray | null) => {
		if (!match) return;
		const sense = match[1].toLowerCase() as SpecialSense;
		const range = Number.parseInt(match[2], 10);
		if (!Number.isFinite(range)) return;
		found[sense] = Math.max(found[sense] ?? 0, range);
	};
	for (const source of sources) {
		for (const prop of source.properties ?? []) {
			if (typeof prop !== "string") continue;
			bind(prop.match(SENSE_TOKEN_RE));
			bind(prop.match(SENSE_PROSE_RE));
		}
	}
	return found;
}

/**
 * Canonical formula for all passive scores.
 *  passive = 10 + skill modifier (+ optional flat bonus such as Observant +5)
 *
 * Per SRD 5e + DDB behavior: a passive score is the equivalent of taking a
 * 10 on the skill check, so any modifier that applies to the active check
 * (ability mod + proficiency + expertise + feat bonuses) applies here too.
 */
export function computePassiveScore(
	skillModifier: number,
	flatBonus: number = 0,
): number {
	return 10 + skillModifier + flatBonus;
}

interface SenseSource {
	type: "job" | "path" | "regent" | "equipment" | "spell" | "feat" | "rune";
	name: string;
	sense: keyof Omit<
		CharacterSenses,
		"passivePerception" | "passiveInvestigation" | "passiveInsight"
	>;
	range: number;
}

// ─── Job Senses (derived from compendium) ───────────────────
// Build the Job→senses lookup from the authoritative static jobs.ts so that
// darkvision ranges and specialSenses (e.g. "Keen Hearing and Smell") stay in
// sync with the compendium without requiring a duplicated hardcoded table.
const SPECIAL_SENSE_PATTERNS: Array<{
	pattern: RegExp;
	sense: SenseSource["sense"];
}> = [
	{ pattern: /\btruesight\b/i, sense: "truesight" },
	{ pattern: /\bblindsight\b/i, sense: "blindsight" },
	{ pattern: /\btremorsense\b/i, sense: "tremorsense" },
	{ pattern: /\bdarkvision\b/i, sense: "darkvision" },
];

function parseSpecialSense(jobName: string, text: string): SenseSource | null {
	for (const { pattern, sense } of SPECIAL_SENSE_PATTERNS) {
		if (!pattern.test(text)) continue;
		const range = /(\d+)\s*(?:ft|feet)/i.exec(text);
		return {
			type: "job",
			name: jobName,
			sense,
			range: range ? Number.parseInt(range[1], 10) : 30,
		};
	}
	return null;
}

let _jobSensesCache: Record<string, SenseSource[]> | null = null;

function getJobSenses(): Record<string, SenseSource[]> {
	if (_jobSensesCache) return _jobSensesCache;
	const staticJobs = getStaticJobs();
	const out: Record<string, SenseSource[]> = {};
	for (const job of staticJobs) {
		const sources: SenseSource[] = [];
		if (typeof job.darkvision === "number" && job.darkvision > 0) {
			sources.push({
				type: "job",
				name: job.name,
				sense: "darkvision",
				range: job.darkvision,
			});
		}
		for (const special of job.specialSenses ?? []) {
			const parsed = parseSpecialSense(job.name, special);
			if (parsed) sources.push(parsed);
		}
		if (sources.length > 0) {
			out[job.name.toLowerCase().trim()] = sources;
		}
	}
	_jobSensesCache = out;
	return out;
}

// ─── Compute Functions ──────────────────────────────────────

/**
 * Compute character senses from all sources
 * Uses "best-of" stacking: multiple darkvision sources → highest range wins
 */
export function computeSenses(
	job: string | null | undefined,
	_path: string | null | undefined,
	regentIds: string[],
	equipmentSenses: SenseSource[],
	spellSenses: SenseSource[],
	wisdomModifier: number,
	intelligenceModifier: number,
	proficiencyBonus: number,
	perceptionProficient: boolean,
	investigationProficient: boolean,
	insightProficient: boolean,
	perceptionExpertise: boolean = false,
	observantFeat: boolean = false,
	dexterityModifier: number = 0,
	stealthProficient: boolean = false,
	stealthExpertise: boolean = false,
): CharacterSenses {
	const allSources: SenseSource[] = [...equipmentSenses, ...spellSenses];

	// Add Job senses
	if (job) {
		const jobKey = job.toLowerCase().trim();
		const jobSenses = getJobSenses();
		if (jobSenses[jobKey]) {
			allSources.push(...jobSenses[jobKey]);
		}
	}

	// Add Regent senses
	for (const regentId of regentIds) {
		const rKey = regentId.toLowerCase().trim();
		if (rKey === "shadow" || rKey === "umbral") {
			allSources.push({
				type: "regent",
				name: "Shadow Regent",
				sense: "darkvision",
				range: 120,
			});
		}
		if (rKey === "dragon") {
			allSources.push({
				type: "regent",
				name: "Dragon Regent",
				sense: "blindsight",
				range: 30,
			});
			allSources.push({
				type: "regent",
				name: "Dragon Regent",
				sense: "darkvision",
				range: 120,
			});
		}
		if (rKey === "beast") {
			allSources.push({
				type: "regent",
				name: "Beast Regent",
				sense: "darkvision",
				range: 60,
			});
			allSources.push({
				type: "regent",
				name: "Beast Regent",
				sense: "tremorsense",
				range: 30,
			});
		}
	}

	// Resolve best-of stacking
	const darkvision = Math.max(
		0,
		...allSources.filter((s) => s.sense === "darkvision").map((s) => s.range),
	);
	const blindsight = Math.max(
		0,
		...allSources.filter((s) => s.sense === "blindsight").map((s) => s.range),
	);
	const tremorsense = Math.max(
		0,
		...allSources.filter((s) => s.sense === "tremorsense").map((s) => s.range),
	);
	const truesight = Math.max(
		0,
		...allSources.filter((s) => s.sense === "truesight").map((s) => s.range),
	);

	// Passive scores: 10 + ability modifier + proficiency (if proficient) +
	// expertise (if expert) + Observant +5 (Perception & Investigation only).
	// Matches SRD 5e + DDB behavior exactly.
	const observantBonus = observantFeat ? 5 : 0;

	const perceptionMod =
		wisdomModifier +
		(perceptionProficient ? proficiencyBonus : 0) +
		(perceptionExpertise ? proficiencyBonus : 0);
	const investigationMod =
		intelligenceModifier + (investigationProficient ? proficiencyBonus : 0);
	const insightMod =
		wisdomModifier + (insightProficient ? proficiencyBonus : 0);
	const stealthMod =
		dexterityModifier +
		(stealthProficient ? proficiencyBonus : 0) +
		(stealthExpertise ? proficiencyBonus : 0);

	const passivePerception = computePassiveScore(perceptionMod, observantBonus);
	const passiveInvestigation = computePassiveScore(
		investigationMod,
		observantBonus,
	);
	const passiveInsight = computePassiveScore(insightMod);
	const passiveStealth = computePassiveScore(stealthMod);

	return {
		darkvision,
		blindsight,
		tremorsense,
		truesight,
		passivePerception,
		passiveInvestigation,
		passiveInsight,
		passiveStealth,
	};
}
