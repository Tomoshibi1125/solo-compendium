/**
 * Senses Engine — Computes character senses (darkvision, blindsight, tremorsense, truesight)
 *
 * Aggregates senses from Job, Path, Regent, equipment, and spell effects.
 * Uses "best-of" stacking: multiple sources of darkvision use the highest range.
 */

import { jobs as STATIC_JOBS } from "@/data/compendium/jobs";

// ─── Types ──────────────────────────────────────────────────
export interface CharacterSenses {
	darkvision: number; // range in feet, 0 = no darkvision
	blindsight: number; // range in feet
	tremorsense: number; // range in feet
	truesight: number; // range in feet
	passivePerception: number;
	passiveInvestigation: number;
	passiveInsight: number;
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

const JOB_SENSES: Record<string, SenseSource[]> = (() => {
	const out: Record<string, SenseSource[]> = {};
	for (const job of STATIC_JOBS) {
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
	return out;
})();

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
): CharacterSenses {
	const allSources: SenseSource[] = [...equipmentSenses, ...spellSenses];

	// Add Job senses
	if (job) {
		const jobKey = job.toLowerCase().trim();
		if (JOB_SENSES[jobKey]) {
			allSources.push(...JOB_SENSES[jobKey]);
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

	// Passive scores: 10 + modifier + proficiency (if proficient) + expertise (if expert)
	const perceptionProf = perceptionProficient ? proficiencyBonus : 0;
	const perceptionExp = perceptionExpertise ? proficiencyBonus : 0; // expertise adds prof again
	const observantBonus = observantFeat ? 5 : 0;

	const passivePerception =
		10 + wisdomModifier + perceptionProf + perceptionExp + observantBonus;
	const passiveInvestigation =
		10 +
		intelligenceModifier +
		(investigationProficient ? proficiencyBonus : 0) +
		observantBonus;
	const passiveInsight =
		10 + wisdomModifier + (insightProficient ? proficiencyBonus : 0);

	return {
		darkvision,
		blindsight,
		tremorsense,
		truesight,
		passivePerception,
		passiveInvestigation,
		passiveInsight,
	};
}

/**
 * Format senses for display (e.g., "Darkvision 60 ft., Passive Perception 14")
 */
export function formatSenses(senses: CharacterSenses): string {
	const parts: string[] = [];
	if (senses.darkvision > 0) parts.push(`Darkvision ${senses.darkvision} ft.`);
	if (senses.blindsight > 0) parts.push(`Blindsight ${senses.blindsight} ft.`);
	if (senses.tremorsense > 0)
		parts.push(`Tremorsense ${senses.tremorsense} ft.`);
	if (senses.truesight > 0) parts.push(`Truesight ${senses.truesight} ft.`);
	parts.push(`Passive Perception ${senses.passivePerception}`);
	return parts.join(", ");
}
