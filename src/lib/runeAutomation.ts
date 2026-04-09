import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { logger } from "./logger";

export type Rune = Database["public"]["Tables"]["compendium_runes"]["Row"];

/**
 * Automatically learn runes based on character progression
 * Some runes may be learned through features or as rewards
 */
export async function autoLearnRunes(
	character: { id: string; level: number; job?: string | null },
	runeIds?: string[],
	isMastered: boolean = false,
): Promise<string[]> {
	if (!runeIds && character) {
		// Logic to determine runes based on character level/job
		console.log(
			`[Warden] Calculating auto-learned runes for Level ${character.level} ${String(character.job)}`,
		);
		return [];
	}
	const targetIds = runeIds || [];
	const characterId = character.id;
	try {
		for (const runeId of targetIds) {
			await supabase.from("character_rune_knowledge").upsert(
				{
					character_id: characterId,
					rune_id: runeId,
					mastery_level: isMastered ? 5 : 1,
					can_teach: isMastered,
				},
				{
					onConflict: "character_id,rune_id",
				},
			);
		}
		return targetIds;
	} catch (error) {
		logger.error("Failed to auto-learn runes:", error);
		throw error;
	}
}

/**
 * Check if character can learn/consume a rune
 * Validates if the character already knows the rune's contents
 */
export async function canLearnRune(
	characterId: string,
	runeId: string,
): Promise<{ canLearn: boolean; reason?: string }> {
	try {
		// Get character data
		const { data: character, error: charError } = await supabase
			.from("characters")
			.select("id")
			.eq("id", characterId)
			.single();

		if (charError || !character) {
			return { canLearn: false, reason: "Character not found" };
		}

		// Get rune data
		const { data: rune, error: runeError } = await supabase
			.from("compendium_runes")
			.select("id, name")
			.eq("id", runeId)
			.single();

		if (runeError || !rune) {
			return { canLearn: false, reason: "Rune not found" };
		}

		// Check if rune already learned
		const { data: existing } = await supabase
			.from("character_rune_knowledge")
			.select("id")
			.eq("character_id", characterId)
			.eq("rune_id", runeId)
			.single();

		if (existing) {
			return {
				canLearn: false,
				reason: "You have already absorbed the knowledge of this rune.",
			};
		}

		return { canLearn: true };
	} catch (error) {
		logger.error("Failed to check rune learning status:", error);
		return { canLearn: false, reason: "Error checking requirements" };
	}
}

// ---------------------------------------------------------------------------
// Rift Ascendant Rune Absorption — cross-type resolution
// ---------------------------------------------------------------------------

const FULL_CASTERS = [
	"Mage",
	"Esper",
	"Herald",
	"Revenant",
	"Contractor",
	"Technomancer",
	"Summoner",
	"Idol",
];
const HALF_CASTERS = ["Holy Knight", "Stalker"];
const MARTIAL_JOBS = ["Assassin", "Berserker", "Destroyer", "Striker"];

const _CASTER_JOBS = [...FULL_CASTERS, ...HALF_CASTERS];

export type RuneAbsorptionResult = {
	/** True if the character's archetype doesn't match the rune type */
	isCrossType: boolean;
	/** Recharge cadence for the learned ability */
	recharge: "at-will" | "short-rest" | "long-rest";
	/** Max uses per rest period (null = unlimited / at-will) */
	usesMax: number | null;
	/** Description of how the ability was adapted */
	adaptationNote: string;
	/** Action type for the learned ability */
	actionType: "action" | "bonus-action" | "reaction" | "passive";
	/** Prefix to prepend to the ability description when cross-type */
	descriptionPrefix: string;
};

/**
 * Determine how a rune's ability should be adapted when absorbed.
 */
export function resolveRuneAbsorption(
	runeType: string | null,
	runeUsesPerRest: string | null | undefined,
	characterJob: string | null,
	characterLevel: number,
	proficiencyBonus: number,
	runeRarity: string = "uncommon",
): RuneAbsorptionResult {
	const job = characterJob || "";
	const isCaster = FULL_CASTERS.includes(job) || HALF_CASTERS.includes(job);
	const isMartial = MARTIAL_JOBS.includes(job);
	const isHalfCaster = HALF_CASTERS.includes(job);
	const isHybrid = !isCaster && !isMartial;

	const runeIsMartial =
		runeType === "martial" ||
		runeType === "offensive" ||
		runeType === "defensive";
	const runeIsCaster = runeType === "caster";

	// Determine if adaptation is needed.
	const isCrossType =
		!isHybrid &&
		!isHalfCaster &&
		((isCaster && (runeIsMartial || runeType === "martial")) ||
			(isMartial && (runeIsCaster || runeType === "caster")));

	if (isCrossType) {
		// Calculate uses based on rarity
		let rarityBonus = 0;
		if (runeRarity === "rare") rarityBonus = 1;
		else if (runeRarity === "very_rare") rarityBonus = 2;
		else if (runeRarity === "legendary") rarityBonus = 3;

		const usesMax = proficiencyBonus + rarityBonus;

		// Job-specific flavor and stat adaptation
		let descriptionPrefix = "";
		if (isMartial) {
			const flavor =
				job === "Striker" || job === "Assassin"
					? "channeled through your lightning-fast strikes and focused breath"
					: "manifested as a raw physical technique channeled through your weapons";
			descriptionPrefix = `[Adapted Technique] You have adapted this energy into your martial repertoire. It is now ${flavor}. This ability now uses your STR or AGI modifier for checks and saves. (${usesMax} uses per Long Rest)`;
		} else {
			descriptionPrefix = `[Arcane Adaptation] You manifest this physical technique through a magical construct, telekinetic force, or aura projection. This ability now uses your spellcasting modifier (INT, SENSE, or PRE) instead of a physical stat. (${usesMax} uses per Long Rest)`;
		}

		return {
			isCrossType: true,
			recharge: "long-rest",
			usesMax,
			adaptationNote: isMartial
				? `Cross-type: Spell adapted as martial technique (${usesMax} uses).`
				: `Cross-type: Martial ability adapted as magical construct (${usesMax} uses).`,
			actionType: "action",
			descriptionPrefix,
		};
	}

	// Natural absorption: use the rune's native cadence
	const usesModifier = isHalfCaster || isHybrid ? 1 : 0;
	const nativeUsesBase = calculateRuneMaxUses(
		runeUsesPerRest,
		characterLevel,
		proficiencyBonus,
	);

	const usesMax = nativeUsesBase === -1 ? null : nativeUsesBase + usesModifier;

	if (usesMax === null) {
		return {
			isCrossType: false,
			recharge: "at-will",
			usesMax: null,
			adaptationNote: "Natural absorption: at-will",
			actionType: "action",
			descriptionPrefix: "",
		};
	}

	const recharge: "short-rest" | "long-rest" = runeUsesPerRest
		?.toLowerCase()
		.includes("short")
		? "short-rest"
		: "long-rest";

	return {
		isCrossType: false,
		recharge,
		usesMax,
		adaptationNote: `Natural absorption: ${usesMax} uses per ${recharge}`,
		actionType: "action",
		descriptionPrefix: "",
	};
}

/**
 * Calculate max uses from uses_per_rest string
 * Examples: 'at-will', '1', '2', 'proficiency bonus', 'level', 'proficiency bonus + level'
 */
export function calculateRuneMaxUses(
	usesPerRest: string | null | undefined,
	characterLevel: number,
	proficiencyBonus: number,
): number {
	if (!usesPerRest || usesPerRest === "at-will") {
		return -1; // -1 indicates unlimited uses
	}

	// Handle numeric strings
	const numericMatch = usesPerRest.match(/^(\d+)$/);
	if (numericMatch) {
		return parseInt(numericMatch[1], 10);
	}

	// Handle proficiency bonus
	if (
		usesPerRest.toLowerCase().includes("proficiency") ||
		usesPerRest.toLowerCase().includes("prof")
	) {
		if (usesPerRest.toLowerCase().includes("+")) {
			// Extract additional number if present (e.g., "proficiency bonus + 2")
			const additionalMatch = usesPerRest.match(/\+?\s*(\d+)/);
			const additional = additionalMatch ? parseInt(additionalMatch[1], 10) : 0;
			return proficiencyBonus + additional;
		}
		return proficiencyBonus;
	}

	// Handle level
	if (usesPerRest.toLowerCase().includes("level")) {
		if (usesPerRest.toLowerCase().includes("+")) {
			// Extract additional number if present (e.g., "level + 1")
			const additionalMatch = usesPerRest.match(/\+?\s*(\d+)/);
			const additional = additionalMatch ? parseInt(additionalMatch[1], 10) : 0;
			return characterLevel + additional;
		}
		return characterLevel;
	}

	// Default to 1 if we can't parse
	return 1;
}
