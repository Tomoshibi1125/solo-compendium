/**
 * Comprehensive choice calculation utilities for character creation
 * Handles additional grants from awakening features, traits, paths, regents, etc.
 *
 * Since the RA parity refactor this module is LEDGER-FIRST:
 *   - `jobData.levelChoices` (from `jobs.ts`) is the authoritative source for
 *     structured picks (cantrips, spells, powers, techniques, fighting styles,
 *     Reality Sculpting, Contract Invocations, Pact Boons, Absolute Infusions,
 *     Specialist Training, Frequency Mastery, Favored Terrain, Permanent Tuning
 *     / Reaping, Channel Absolute, Cross-Frequency Access).
 *   - `jobData.powersKnown` / `techniquesKnown` arrays drive cumulative counts
 *     for martial / hybrid jobs.
 *   - `jobData.spellcasting.cantripsKnown` / `spellsKnown` drive known-caster
 *     progression.
 *   - `jobData.spellbook.atCreation` / `perLevel` drives Mage / Revenant's
 *     Arcane Codex / Reaper's Ledger scribe panel.
 *   - The regex parser below remains as a SUPPLEMENT for unstructured
 *     awakeningFeatures, jobTraits, path features, and regent homebrew prose
 *     that hasn't been migrated into a structured ledger yet.
 */

export type LedgerChoiceType =
	| "cantrip"
	| "spell"
	| "power"
	| "technique"
	| "specialist-training"
	| "frequency-mastery"
	| "fighting-style"
	| "favored-terrain"
	| "reality-sculpting"
	| "contract-invocation"
	| "absolute-infusion"
	| "pact-boon"
	| "permanent-tuning"
	| "permanent-reaping"
	| "channel-absolute"
	| "cross-frequency-access"
	| "expertise"
	| "language"
	| "skill"
	| "tool";

export interface LedgerChoice {
	level: number;
	type: LedgerChoiceType;
	count: number;
	source: string;
	options?: string[];
	filter?: {
		maxPowerLevel?: number;
		maxLevel?: number;
		restrictTo?: "job-list" | "any-list";
	};
}

export interface ChoiceGrant {
	type:
		| "skills"
		| "feats"
		| "cantrips"
		| "spells"
		| "powers"
		| "techniques"
		| "runes"
		| "items"
		| "tools"
		| "languages"
		| "expertise";
	count: number;
	source: string;
	description: string;
}

interface TotalChoices {
	// Legacy buckets driven by regex prose + ledger skill/language/tool entries.
	skills: number;
	feats: number;
	spells: number;
	powers: number;
	techniques: number;
	runes: number;
	items: number;
	tools: number;
	languages: number;
	expertise: number;
	// Ledger-driven buckets (additive; default 0 so legacy consumers are safe).
	cantrips: number;
	fightingStyles: number;
	favoredTerrains: number;
	realitySculptings: number;
	contractInvocations: number;
	absoluteInfusions: number;
	pactBoons: number;
	frequencyMasteries: number;
	crossFrequencyAccesses: number;
	channelAbsolutes: number;
	permanentTunings: number;
	permanentReapings: number;
	spellbookInscriptions: number;
}

/**
 * Convert written number to digit
 */
const writtenNumberToDigit = (word: string): number => {
	const numbers: Record<string, number> = {
		one: 1,
		two: 2,
		three: 3,
		four: 4,
		five: 5,
		six: 6,
		seven: 7,
		eight: 8,
		nine: 9,
		ten: 10,
	};
	return numbers[word.toLowerCase()] || 0;
};

/**
 * Parse a description for choice grants using comprehensive pattern matching
 */
function parseChoiceGrants(description: string, source: string): ChoiceGrant[] {
	const grants: ChoiceGrant[] = [];
	const desc = description.toLowerCase();

	const sourceQualifiedAbilityPatterns: Array<{
		type: "cantrips" | "spells";
		pattern: RegExp;
	}> = [
		{
			type: "cantrips",
			pattern:
				/(?:\b(?:learn|gain|know|choose|select|and)\s+|\+\s*)(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+(?!additional\b)(?:[a-z][a-z'-]*\s+)?cantrips?\b/i,
		},
		{
			type: "spells",
			pattern:
				/(?:\b(?:learn|gain|know|choose|select|and)\s+|\+\s*)(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+(?!additional\b)(?:[a-z][a-z'-]*\s+)?spells?\b/i,
		},
	];

	for (const { type, pattern } of sourceQualifiedAbilityPatterns) {
		const match = desc.match(pattern);
		if (!match) continue;
		const count = /^\d+$/.test(match[1])
			? parseInt(match[1], 10)
			: writtenNumberToDigit(match[1]);
		grants.push({
			type,
			count,
			source,
			description: `${description.substring(0, 100)}...`,
		});
	}

	// Skill proficiency patterns - handle both digits and written numbers
	const skillPatterns = [
		/gain\s+proficiency\s+in\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+skills?/i,
		/gain\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+skill\s+proficiencies?/i,
		/proficient\s+in\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+skills?/i,
		/learn\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+skills?/i,
		/choose\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+skills?/i,
		/select\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+skills?/i,
	];

	for (const pattern of skillPatterns) {
		const match = desc.match(pattern);
		if (match) {
			const count = /^\d+$/.test(match[1])
				? parseInt(match[1], 10)
				: writtenNumberToDigit(match[1]);
			grants.push({
				type: "skills",
				count,
				source,
				description: `${description.substring(0, 100)}...`,
			});
			break;
		}
	}

	// Feat patterns - handle both digits and written numbers
	const featPatterns = [
		/gain\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+feats?/i,
		/learn\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+feats?/i,
		/choose\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+feats?/i,
		/select\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+feats?/i,
		/gain\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+feat(s)?\s+of\s+your\s+choice/i,
	];

	for (const pattern of featPatterns) {
		const match = desc.match(pattern);
		if (match) {
			const count = /^\d+$/.test(match[1])
				? parseInt(match[1], 10)
				: writtenNumberToDigit(match[1]);
			grants.push({
				type: "feats",
				count,
				source,
				description: `${description.substring(0, 100)}...`,
			});
			break;
		}
	}

	// Spell patterns - handle both digits and written numbers
	const spellPatterns = [
		/learn\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+spells?/i,
		/gain\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+spells?/i,
		/know\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+spells?/i,
		/choose\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+spells?/i,
		/select\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+spells?/i,
		/add\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+spells?\s+to\s+your\s+spellbook/i,
	];

	for (const pattern of spellPatterns) {
		const match = desc.match(pattern);
		if (match) {
			const count = /^\d+$/.test(match[1])
				? parseInt(match[1], 10)
				: writtenNumberToDigit(match[1]);
			grants.push({
				type: "spells",
				count,
				source,
				description: `${description.substring(0, 100)}...`,
			});
			break;
		}
	}

	// Power patterns - handle both digits and written numbers
	const powerPatterns = [
		/gain\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+powers?/i,
		/learn\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+powers?/i,
		/choose\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+powers?/i,
		/select\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+powers?/i,
		/unlock\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+powers?/i,
	];

	for (const pattern of powerPatterns) {
		const match = desc.match(pattern);
		if (match) {
			const count = /^\d+$/.test(match[1])
				? parseInt(match[1], 10)
				: writtenNumberToDigit(match[1]);
			grants.push({
				type: "powers",
				count,
				source,
				description: `${description.substring(0, 100)}...`,
			});
			break;
		}
	}

	// Technique patterns - handle both digits and written numbers
	const techniquePatterns = [
		/learn\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+maneuvers?/i,
		/gain\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+maneuvers?/i,
		/choose\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+maneuvers?/i,
		/select\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+maneuvers?/i,
		/learn\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+techniques?/i,
		/gain\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+techniques?/i,
		/master\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+techniques?/i,
		/choose\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+techniques?/i,
		/select\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+techniques?/i,
	];

	for (const pattern of techniquePatterns) {
		const match = desc.match(pattern);
		if (match) {
			const count = /^\d+$/.test(match[1])
				? parseInt(match[1], 10)
				: writtenNumberToDigit(match[1]);
			grants.push({
				type: "techniques",
				count,
				source,
				description: `${description.substring(0, 100)}...`,
			});
			break;
		}
	}

	// Rune patterns - handle both digits and written numbers
	const runePatterns = [
		/learn\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+runes?/i,
		/gain\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+runes?/i,
		/discover\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+runes?/i,
		/choose\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+runes?/i,
		/select\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+runes?/i,
		/absorb\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+runes?/i,
	];

	for (const pattern of runePatterns) {
		const match = desc.match(pattern);
		if (match) {
			const count = /^\d+$/.test(match[1])
				? parseInt(match[1], 10)
				: writtenNumberToDigit(match[1]);
			grants.push({
				type: "runes",
				count,
				source,
				description: `${description.substring(0, 100)}...`,
			});
			break;
		}
	}

	// Item patterns - handle both digits and written numbers
	const itemPatterns = [
		/gain\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+items?/i,
		/receive\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+items?/i,
		/choose\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+items?/i,
		/select\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+items?/i,
		/craft\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+items?/i,
	];

	for (const pattern of itemPatterns) {
		const match = desc.match(pattern);
		if (match) {
			const count = /^\d+$/.test(match[1])
				? parseInt(match[1], 10)
				: writtenNumberToDigit(match[1]);
			grants.push({
				type: "items",
				count,
				source,
				description: `${description.substring(0, 100)}...`,
			});
			break;
		}
	}

	// Tool patterns - handle both digits and written numbers
	const toolPatterns = [
		/gain\s+proficiency\s+in\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+tools?/i,
		/become\s+proficient\s+with\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+tools?/i,
		/learn\s+to\s+use\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+tools?/i,
		/choose\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+tool\s+proficiencies?/i,
	];

	for (const pattern of toolPatterns) {
		const match = desc.match(pattern);
		if (match) {
			const count = /^\d+$/.test(match[1])
				? parseInt(match[1], 10)
				: writtenNumberToDigit(match[1]);
			grants.push({
				type: "tools",
				count,
				source,
				description: `${description.substring(0, 100)}...`,
			});
			break;
		}
	}

	// Language patterns - handle both digits and written numbers
	const languagePatterns = [
		/learn\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+languages?/i,
		/speak\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+languages?/i,
		/know\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+languages?/i,
		/choose\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+languages?/i,
		/select\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+additional\s+languages?/i,
	];

	for (const pattern of languagePatterns) {
		const match = desc.match(pattern);
		if (match) {
			const count = /^\d+$/.test(match[1])
				? parseInt(match[1], 10)
				: writtenNumberToDigit(match[1]);
			grants.push({
				type: "languages",
				count,
				source,
				description: `${description.substring(0, 100)}...`,
			});
			break;
		}
	}

	// Expertise patterns (double proficiency) - handle both digits and written numbers
	const expertisePatterns = [
		/double\s+proficiency\s+on\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+chosen\s+skill\s+proficiencies?/i,
		/gain\s+expertise\s+in\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+skills?/i,
		/choose\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+skills?\s+to\s+gain\s+expertise\s+in/i,
		/select\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+skills?\s+for\s+expertise/i,
	];

	for (const pattern of expertisePatterns) {
		const match = desc.match(pattern);
		if (match) {
			const count = /^\d+$/.test(match[1])
				? parseInt(match[1], 10)
				: writtenNumberToDigit(match[1]);
			grants.push({
				type: "expertise",
				count,
				source,
				description: `${description.substring(0, 100)}...`,
			});
			break;
		}
	}

	return grants;
}

/**
 * Calculate total additional choices from all sources (job, path, regent).
 * Ledger-driven fields are authoritative; regex prose adds on top of them.
 */
export interface ChoiceSourceData {
	skill_choice_count?: number;
	awakening_features?: Array<{
		level: number;
		description: string;
		name: string;
	}>;
	job_traits?: Array<{ description: string; name: string }>;
	features?: Array<{ level: number; description: string; name: string }>;
	class_features?: Array<{ level: number; description: string; name: string }>;
	name?: string;
	// --- Ledger + progression inputs (all optional; populated from StaticJob). ---
	level_choices?: LedgerChoice[];
	cantrips_known?: number[];
	spells_known?: number[];
	powers_known?: number[];
	techniques_known?: number[];
	spellbook?: {
		atCreation: number;
		perLevel: number;
		label: string;
		/**
		 * Level at which the job gains its spellbook feature (default 1). Full
		 * casters (Mage) inscribe from level 1; delayed casters (Revenant, whose
		 * Reaper's Ledger is a level-2 feature) must start at their casting level
		 * so inscriptions aren't demanded before any leveled spell is learnable.
		 */
		startLevel?: number;
	};
}

function createEmptyTotals(): TotalChoices {
	return {
		skills: 0,
		feats: 0,
		spells: 0,
		powers: 0,
		techniques: 0,
		runes: 0,
		items: 0,
		tools: 0,
		languages: 0,
		expertise: 0,
		cantrips: 0,
		fightingStyles: 0,
		favoredTerrains: 0,
		realitySculptings: 0,
		contractInvocations: 0,
		absoluteInfusions: 0,
		pactBoons: 0,
		frequencyMasteries: 0,
		crossFrequencyAccesses: 0,
		channelAbsolutes: 0,
		permanentTunings: 0,
		permanentReapings: 0,
		spellbookInscriptions: 0,
	};
}

// Maps a ledger choice type to the TotalChoices bucket it contributes to.
// Note: progression arrays (cantripsKnown / spellsKnown / powersKnown /
// techniquesKnown) are the authoritative count for those types when present,
// so ledger entries of those types are not double-counted when the array is
// populated — see applyLedgerToTotals below.
const LEDGER_TO_BUCKET: Record<LedgerChoiceType, keyof TotalChoices> = {
	cantrip: "cantrips",
	spell: "spells",
	power: "powers",
	technique: "techniques",
	"specialist-training": "expertise",
	"frequency-mastery": "frequencyMasteries",
	"fighting-style": "fightingStyles",
	"favored-terrain": "favoredTerrains",
	"reality-sculpting": "realitySculptings",
	"contract-invocation": "contractInvocations",
	"absolute-infusion": "absoluteInfusions",
	"pact-boon": "pactBoons",
	"permanent-tuning": "permanentTunings",
	"permanent-reaping": "permanentReapings",
	"channel-absolute": "channelAbsolutes",
	"cross-frequency-access": "crossFrequencyAccesses",
	expertise: "expertise",
	language: "languages",
	skill: "skills",
	tool: "tools",
};

// Progression arrays authoritatively own these buckets when present.
const PROGRESSION_OWNED_BUCKETS: ReadonlySet<keyof TotalChoices> = new Set([
	"cantrips",
	"spells",
	"powers",
	"techniques",
]);

function applyLedgerToTotals(
	totals: TotalChoices,
	source: ChoiceSourceData | null | undefined,
	level: number,
): void {
	if (!source) return;

	// 1. Progression arrays (cumulative counts owned by job).
	const atIndex = (arr: number[] | undefined) =>
		arr && arr.length > 0
			? arr[Math.max(0, Math.min(level, arr.length) - 1)]
			: 0;
	const cantripsCum = atIndex(source.cantrips_known);
	const spellsCum = atIndex(source.spells_known);
	const powersCum = atIndex(source.powers_known);
	const techniquesCum = atIndex(source.techniques_known);
	totals.cantrips += cantripsCum;
	totals.spells += spellsCum;
	totals.powers += powersCum;
	totals.techniques += techniquesCum;

	// 2. Spellbook inscriptions (Mage / Revenant): atCreation at the spellbook's
	// startLevel (default 1) + perLevel for each level beyond it (cumulative).
	// startLevel gates delayed casters (e.g. Revenant, whose Reaper's Ledger is a
	// level-2 feature) so 0 are demanded at level 1, where no leveled spell is
	// learnable.
	if (source.spellbook) {
		const { atCreation, perLevel, startLevel = 1 } = source.spellbook;
		const inscribed =
			level >= startLevel
				? atCreation + Math.max(0, level - startLevel) * perLevel
				: 0;
		totals.spellbookInscriptions += inscribed;
	}

	// 3. Non-progression ledger entries (all other choice types).
	if (source.level_choices) {
		for (const choice of source.level_choices) {
			if (choice.level > level) continue;
			const bucket = LEDGER_TO_BUCKET[choice.type];
			if (!bucket) continue;
			if (PROGRESSION_OWNED_BUCKETS.has(bucket)) continue; // handled above
			totals[bucket] += choice.count;
		}
	}
}

export function calculateTotalChoices(
	jobData: ChoiceSourceData | null | undefined,
	pathData: ChoiceSourceData | null | undefined,
	regentData: ChoiceSourceData[] | null | undefined,
	level: number = 1,
): TotalChoices {
	const totals = createEmptyTotals();

	// --- Authoritative ledger + progression from jobData ---
	applyLedgerToTotals(totals, jobData, level);

	// Base job choices
	if (jobData) {
		totals.skills += jobData.skill_choice_count || 0;

		// Job awakening features
		if (jobData.awakening_features) {
			for (const feature of jobData.awakening_features) {
				if (feature.level <= level) {
					const grants = parseChoiceGrants(
						feature.description,
						`Job: ${feature.name}`,
					);
					for (const grant of grants) {
						totals[grant.type] += grant.count;
					}
				}
			}
		}

		// Job traits
		if (jobData.job_traits) {
			for (const trait of jobData.job_traits) {
				const grants = parseChoiceGrants(
					trait.description,
					`Trait: ${trait.name}`,
				);
				for (const grant of grants) {
					totals[grant.type] += grant.count;
				}
			}
		}
	}

	// Path features
	if (pathData?.features) {
		for (const feature of pathData.features) {
			if (feature.level <= level) {
				const grants = parseChoiceGrants(
					feature.description,
					`Path: ${feature.name}`,
				);
				for (const grant of grants) {
					totals[grant.type] += grant.count;
				}
			}
		}
	}

	// Regent features
	if (regentData) {
		for (const regent of regentData) {
			// Regent overlays carry the same ledger/progression fields as jobs
			// (cantrips_known / spells_known / powers_known / techniques_known /
			// level_choices), so a regent grants structured picks as a full
			// independent overlay. Backgrounds passed here at creation have none of
			// these fields, so this is a no-op for them (regents never appear in
			// creation). Indexing by character level realizes "grant every regent
			// tier up to the character's level".
			applyLedgerToTotals(totals, regent, level);
			const features = regent.class_features || regent.features;
			if (features) {
				for (const feature of features) {
					// If a feature has no level (e.g. background features), always include it
					const featureLevel = (feature as { level?: number }).level;
					if (featureLevel === undefined || featureLevel <= level) {
						const grants = parseChoiceGrants(
							feature.description,
							`Background: ${regent.name ?? ""}`,
						);
						for (const grant of grants) {
							totals[grant.type] += grant.count;
						}
					}
				}
			}
		}
	}

	return totals;
}

/**
 * Get all choice grants with details for UI display
 */
export function getChoiceGrantDetails(
	jobData: ChoiceSourceData | null | undefined,
	pathData: ChoiceSourceData | null | undefined,
	regentData: ChoiceSourceData[] | null | undefined,
	level: number = 1,
): ChoiceGrant[] {
	const allGrants: ChoiceGrant[] = [];

	// Job awakening features
	if (jobData?.awakening_features) {
		for (const feature of jobData.awakening_features) {
			if (feature.level <= level) {
				const grants = parseChoiceGrants(
					feature.description,
					`Job: ${feature.name}`,
				);
				allGrants.push(...grants);
			}
		}
	}

	// Job traits
	if (jobData?.job_traits) {
		for (const trait of jobData.job_traits) {
			const grants = parseChoiceGrants(
				trait.description,
				`Trait: ${trait.name}`,
			);
			allGrants.push(...grants);
		}
	}

	// Path features
	if (pathData?.features) {
		for (const feature of pathData.features) {
			if (feature.level <= level) {
				const grants = parseChoiceGrants(
					feature.description,
					`Path: ${feature.name}`,
				);
				allGrants.push(...grants);
			}
		}
	}

	// Regent features
	if (regentData) {
		for (const regent of regentData) {
			if (regent.class_features) {
				for (const feature of regent.class_features) {
					if (feature.level <= level) {
						const grants = parseChoiceGrants(
							feature.description,
							`Regent: ${regent.name}`,
						);
						allGrants.push(...grants);
					}
				}
			}
		}
	}

	return allGrants;
}

/**
 * Ledger-aware delta helper for the level-up wizard. Returns per-bucket deltas
 * (next - prev, clamped at 0) for every bucket in TotalChoices. Positive values
 * drive the level-up sub-step queue (one panel per bucket with delta > 0).
 */
export function getLevelUpChoiceDeltas(
	jobData: ChoiceSourceData | null | undefined,
	pathData: ChoiceSourceData | null | undefined,
	regentData: ChoiceSourceData[] | null | undefined,
	prevLevel: number,
	newLevel: number,
	previousPathData: ChoiceSourceData | null | undefined = pathData,
): Partial<Record<keyof TotalChoices, number>> {
	if (newLevel <= prevLevel) return {};
	const previous = calculateTotalChoices(
		jobData,
		previousPathData,
		regentData,
		prevLevel,
	);
	const next = calculateTotalChoices(jobData, pathData, regentData, newLevel);
	const deltas: Partial<Record<keyof TotalChoices, number>> = {};
	for (const key of Object.keys(next) as Array<keyof TotalChoices>) {
		const delta = next[key] - previous[key];
		if (delta > 0) deltas[key] = delta;
	}
	return deltas;
}

/**
 * Returns only the ledger choice entries that fire when going from prevLevel
 * to newLevel (i.e. choice.level in (prevLevel, newLevel]). Drives the
 * structured level-up sub-step queue — each entry becomes a picker panel.
 */
export function getLevelUpLedgerEntries(
	jobData: ChoiceSourceData | null | undefined,
	prevLevel: number,
	newLevel: number,
): LedgerChoice[] {
	if (!jobData?.level_choices || newLevel <= prevLevel) return [];
	return jobData.level_choices.filter(
		(c) => c.level > prevLevel && c.level <= newLevel,
	);
}
