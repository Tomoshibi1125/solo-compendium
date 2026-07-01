/**
 * Bulk operations system
 * Perform operations on multiple items at once
 */

import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { AppError } from "@/lib/appError";
import {
	addJobAwakeningBenefitsForLevel,
	autoUpdateFeatureUses,
} from "@/lib/characterCreation";
import {
	type ChoiceSourceData,
	calculateTotalChoices,
} from "@/lib/choiceCalculations";
import {
	deleteLocalCharacter,
	getLocalCharacterState,
	isLocalCharacterId,
	updateLocalCharacter,
} from "@/lib/guestStore";
import { getMinPathUnlockLevelForJob, isASILevel } from "@/lib/levelGating";
import {
	calculateProficiencyBonusForLevel,
	calculateRiftFavorDie,
	calculateRiftFavorMax,
} from "@/lib/levelUpCalculations";
import { error as logError } from "@/lib/logger";
import { getStaticJobs } from "@/lib/ProtocolDataManager";
import type { StaticJob } from "@/types/character";

export type Character = Database["public"]["Tables"]["characters"]["Row"];
type ChoiceTotals = ReturnType<typeof calculateTotalChoices>;
type ChoiceKind = keyof ChoiceTotals;

const CHOICE_LABELS: Record<ChoiceKind, string> = {
	skills: "skill choice",
	feats: "feat choice",
	spells: "spell choice",
	powers: "power choice",
	techniques: "technique choice",
	runes: "rune choice",
	items: "item choice",
	tools: "tool choice",
	languages: "language choice",
	expertise: "expertise choice",
	cantrips: "cantrip choice",
	fightingStyles: "Fighting Style choice",
	favoredTerrains: "Favored Terrain choice",
	realitySculptings: "Reality Sculpting choice",
	contractInvocations: "Contract Invocation choice",
	absoluteInfusions: "Absolute Infusion choice",
	pactBoons: "Pact Boon choice",
	frequencyMasteries: "Frequency Mastery choice",
	crossFrequencyAccesses: "Cross-Frequency Access choice",
	channelAbsolutes: "Channel Absolute choice",
	permanentTunings: "Permanent Tuning choice",
	permanentReapings: "Permanent Reaping choice",
	spellbookInscriptions: "spellbook inscription",
};

function normalizeJobKey(value: string): string {
	return value
		.trim()
		.toLowerCase()
		.replace(/[-\s]+/g, "");
}

// Narrowed indexer for the extended Job type (jobs.ts) so we can safely read
// the new ledger + progression + spellbook fields without importing the Job
// interface directly (it lives in `src/data/compendium/jobs.ts`, outside the
// lib boundary — StaticJob in @/types/character has a compatible shape).
type StaticJobWithLedger = StaticJob & {
	levelChoices?: unknown;
	powersKnown?: number[];
	techniquesKnown?: number[];
	spellbook?: { atCreation: number; perLevel: number; label: string };
	spellcasting?: {
		ability: string;
		focus?: string;
		cantripsKnown?: number[];
		spellsKnown?: number[];
		spellSlots?: Record<string, number[]>;
	};
};

function toChoiceSourceData(job: StaticJob): ChoiceSourceData {
	const extended = job as StaticJobWithLedger;
	return {
		name: job.name,
		skill_choice_count: 0,
		awakening_features: job.awakeningFeatures ?? [],
		job_traits: job.jobTraits ?? [],
		level_choices: Array.isArray(extended.levelChoices)
			? (extended.levelChoices as ChoiceSourceData["level_choices"])
			: undefined,
		cantrips_known: extended.spellcasting?.cantripsKnown,
		spells_known: extended.spellcasting?.spellsKnown,
		powers_known: extended.powersKnown,
		techniques_known: extended.techniquesKnown,
		spellbook: extended.spellbook,
	};
}

// Buckets that should NOT block bulk level-up. These represent auto-learnable
// content — new cantrips, new known spells, and new spellbook inscriptions
// surface automatically on the sheet and the player can edit picks via the
// cantrip / spellbook panels later. Mirrors DDB's behavior where a Wizard
// bulk-levels without being gated by the "inscribe 2 new spells" step.
const NON_BLOCKING_CHOICE_KINDS: ReadonlySet<ChoiceKind> = new Set<ChoiceKind>([
	"cantrips",
	"spells",
	"spellbookInscriptions",
]);

function getChoiceDeltas(
	currentLevel: number,
	newLevel: number,
	job: string | null | undefined,
	staticJobs: readonly StaticJob[],
): Partial<Record<ChoiceKind, number>> {
	if (!job) return {};
	const jobKey = normalizeJobKey(job);
	const staticJob = staticJobs.find(
		(candidate) =>
			normalizeJobKey(candidate.name) === jobKey ||
			normalizeJobKey(candidate.id) === jobKey,
	);
	if (!staticJob) return {};

	const source = toChoiceSourceData(staticJob);
	const previous = calculateTotalChoices(source, null, [], currentLevel);
	const next = calculateTotalChoices(source, null, [], newLevel);
	const deltas: Partial<Record<ChoiceKind, number>> = {};
	for (const key of Object.keys(CHOICE_LABELS) as ChoiceKind[]) {
		if (NON_BLOCKING_CHOICE_KINDS.has(key)) continue;
		const delta = next[key] - previous[key];
		if (delta > 0) deltas[key] = delta;
	}
	return deltas;
}

function formatChoiceDeltas(
	deltas: Partial<Record<ChoiceKind, number>>,
): string {
	const parts = (Object.keys(CHOICE_LABELS) as ChoiceKind[])
		.map((key) => {
			const count = deltas[key] ?? 0;
			if (count <= 0) return null;
			const label = CHOICE_LABELS[key];
			return `${count} ${label}${count === 1 ? "" : "s"}`;
		})
		.filter((part): part is string => !!part);

	if (parts.length <= 1) return parts[0] ?? "player choices";
	return `${parts.slice(0, -1).join(", ")} and ${parts.at(-1)}`;
}

/**
 * Bulk update characters
 */
export async function bulkUpdateCharacters(
	characterIds: string[],
	updates: Partial<Character>,
): Promise<{ success: number; failed: number }> {
	let success = 0;
	let failed = 0;

	for (const id of characterIds) {
		try {
			// Guest parity: route local IDs through guestStore.
			if (isLocalCharacterId(id)) {
				const result = updateLocalCharacter(id, updates);
				if (!result)
					throw new AppError("Local character not found", "NOT_FOUND");
				success++;
				continue;
			}

			const { error } = await supabase
				.from("characters")
				.update(updates)
				.eq("id", id);

			if (error) throw error;
			success++;
		} catch (error) {
			logError(`Failed to update character ${id}:`, error);
			failed++;
		}
	}

	return { success, failed };
}

/**
 * Bulk delete characters
 */
export async function bulkDeleteCharacters(
	characterIds: string[],
): Promise<{ success: number; failed: number }> {
	let success = 0;
	let failed = 0;

	for (const id of characterIds) {
		try {
			// Guest parity: route local IDs through guestStore so the
			// roster manager can delete guest-mode Ascendants in bulk
			// just like authed ones.
			if (isLocalCharacterId(id)) {
				deleteLocalCharacter(id);
				success++;
				continue;
			}

			const { error } = await supabase.from("characters").delete().eq("id", id);

			if (error) throw error;
			success++;
		} catch (error) {
			logError(`Failed to delete character ${id}:`, error);
			failed++;
		}
	}

	return { success, failed };
}

/**
 * Bulk level-up result.
 *
 * `skipped` lists characters that *would* level into a tier requiring a
 * player decision (ASI/feat, etc.). DDB-parity: bulk advancement bypasses
 * those decisions, so we surface the skipped IDs back to the UI instead
 * of silently progressing through them.
 */
export interface BulkLevelUpResult {
	success: number;
	failed: number;
	skipped: Array<{ id: string; reason: string; newLevel: number }>;
}

/**
 * Detect when a character at `currentLevel` should be advanced through
 * the wizard rather than via bulk level-up.
 *
 * Returns a reason string when the new level requires a player choice
 * (ASI/Feat tier, first Path selection, or job-granted choice deltas),
 * otherwise null.
 */
export function detectBulkLevelUpChoiceRequirement(
	currentLevel: number,
	job: string | null | undefined,
	currentPath: string | null | undefined,
	staticJobs: readonly StaticJob[] = getStaticJobs() as unknown as StaticJob[],
): { newLevel: number; reason: string } | null {
	const newLevel = currentLevel + 1;
	if (isASILevel(newLevel, job ?? null)) {
		return {
			newLevel,
			reason: `Level ${newLevel} requires an ASI/Feat choice — use the wizard.`,
		};
	}
	if (job) {
		const minPathLevel = getMinPathUnlockLevelForJob(job);
		if (minPathLevel !== null && newLevel === minPathLevel && !currentPath) {
			return {
				newLevel,
				reason: `Level ${newLevel} unlocks a Path — use the wizard to choose one.`,
			};
		}
	}
	const choiceDeltas = getChoiceDeltas(currentLevel, newLevel, job, staticJobs);
	if (Object.keys(choiceDeltas).length > 0) {
		return {
			newLevel,
			reason: `Level ${newLevel} requires ${formatChoiceDeltas(choiceDeltas)} — use the wizard.`,
		};
	}
	return null;
}

/**
 * Bulk level up characters.
 *
 * Skips characters whose new level requires a player choice (ASI/Feat,
 * first-time Path selection, or job-granted choices such as powers and
 * techniques) — those should be advanced through the level-up wizard instead.
 */
export async function bulkLevelUp(
	characterIds: string[],
): Promise<BulkLevelUpResult> {
	let success = 0;
	let failed = 0;
	const skipped: BulkLevelUpResult["skipped"] = [];

	for (const id of characterIds) {
		try {
			// Guest parity: branch local IDs through guestStore so guest
			// roster owners get the same level-bump shape (HP, hit dice,
			// PB, rift favor) as authed characters.
			if (isLocalCharacterId(id)) {
				const localState = getLocalCharacterState(id);
				if (!localState) {
					throw new AppError("Local character not found", "NOT_FOUND");
				}
				const character = localState.character;
				// DDB parity: bulk level-up cannot apply choice-requiring tiers.
				// Skip and report — user must use the wizard for these.
				const choiceBlock = detectBulkLevelUpChoiceRequirement(
					character.level,
					character.job,
					character.path,
				);
				if (choiceBlock) {
					skipped.push({ id, ...choiceBlock });
					continue;
				}
				const newLevel = character.level + 1;
				const hpIncrease = Math.floor(character.hp_max / character.level || 5);
				const newProficiencyBonus = calculateProficiencyBonusForLevel(newLevel);
				const newRiftFavorDie = calculateRiftFavorDie(newLevel);
				const newRiftFavorMax = calculateRiftFavorMax(newLevel);

				updateLocalCharacter(id, {
					level: newLevel,
					proficiency_bonus: newProficiencyBonus,
					hp_max: character.hp_max + hpIncrease,
					hp_current: character.hp_max + hpIncrease,
					hit_dice_max: newLevel,
					hit_dice_current: newLevel,
					rift_favor_die: newRiftFavorDie,
					rift_favor_max: newRiftFavorMax,
				});
				// Awakening grants and feature-use updates are remote-only
				// flows; for guest mode we accept that they're applied next
				// time the character opens the wizard.
				success++;
				continue;
			}

			const { data: character } = await supabase
				.from("characters")
				.select("level, hp_max, hit_dice_max, job, path")
				.eq("id", id)
				.single();

			if (!character) throw new AppError("Character not found", "NOT_FOUND");

			// DDB parity: ASI/Feat tiers and first-time Path picks require
			// player choices. Skip rather than auto-advance and let the
			// wizard handle them.
			const choiceBlock = detectBulkLevelUpChoiceRequirement(
				character.level,
				character.job,
				character.path,
			);
			if (choiceBlock) {
				skipped.push({ id, ...choiceBlock });
				continue;
			}

			const newLevel = character.level + 1;

			const hpIncrease = Math.floor(character.hp_max / character.level || 5);
			const newProficiencyBonus = calculateProficiencyBonusForLevel(newLevel);
			const newRiftFavorDie = calculateRiftFavorDie(newLevel);
			const newRiftFavorMax = calculateRiftFavorMax(newLevel);

			const { error } = await supabase
				.from("characters")
				.update({
					level: newLevel,
					proficiency_bonus: newProficiencyBonus,
					hp_max: character.hp_max + hpIncrease,
					hp_current: character.hp_max + hpIncrease, // Full heal on level up
					hit_dice_max: newLevel,
					hit_dice_current: newLevel,
					rift_favor_die: newRiftFavorDie,
					rift_favor_max: newRiftFavorMax,
				})
				.eq("id", id);

			if (error) throw error;

			// Grant job awakening benefits at the new level
			try {
				const jobObj = getStaticJobs().find((j) => j.name === character.job) as
					| StaticJob
					| undefined;
				await addJobAwakeningBenefitsForLevel(id, jobObj, newLevel);
			} catch {
				// Best-effort
			}

			// Auto-update existing feature uses (proficiency-based features scale with level)
			try {
				await autoUpdateFeatureUses(id);
			} catch {
				// Best-effort
			}

			success++;
		} catch (error) {
			logError(`Failed to level up character ${id}:`, error);
			failed++;
		}
	}

	return { success, failed, skipped };
}

/**
 * Bulk rest (short or long)
 */
export async function bulkRest(
	characterIds: string[],
	restType: "short" | "long",
): Promise<{ success: number; failed: number }> {
	let success = 0;
	let failed = 0;

	for (const id of characterIds) {
		try {
			// Guest parity: branch local IDs through guestStore so the
			// roster bar can rest guest characters without requiring an
			// account. Mirrors the auth path (short = ½ hit dice, long =
			// full reset + exhaustion -1 + conditions cleared).
			if (isLocalCharacterId(id)) {
				const localState = getLocalCharacterState(id);
				if (!localState) {
					throw new AppError("Local character not found", "NOT_FOUND");
				}
				const character = localState.character;
				if (restType === "short") {
					const hitDiceToRestore = Math.ceil(character.hit_dice_max / 2);
					const newHitDiceCurrent = Math.min(
						character.hit_dice_current + hitDiceToRestore,
						character.hit_dice_max,
					);
					updateLocalCharacter(id, { hit_dice_current: newHitDiceCurrent });
				} else {
					updateLocalCharacter(id, {
						hp_current: character.hp_max,
						hit_dice_current: character.hit_dice_max,
						rift_favor_current: character.rift_favor_max,
						exhaustion_level: Math.max(0, character.exhaustion_level - 1),
						conditions: [],
					});
				}
				success++;
				continue;
			}

			const { data: character } = await supabase
				.from("characters")
				.select("*")
				.eq("id", id)
				.single();

			if (!character) throw new AppError("Character not found", "NOT_FOUND");

			if (restType === "short") {
				const hitDiceToRestore = Math.ceil(character.hit_dice_max / 2);
				const newHitDiceCurrent = Math.min(
					character.hit_dice_current + hitDiceToRestore,
					character.hit_dice_max,
				);

				await supabase
					.from("characters")
					.update({ hit_dice_current: newHitDiceCurrent })
					.eq("id", id);
			} else {
				await supabase
					.from("characters")
					.update({
						hp_current: character.hp_max,
						hit_dice_current: character.hit_dice_max,
						rift_favor_current: character.rift_favor_max,
						exhaustion_level: Math.max(0, character.exhaustion_level - 1),
						conditions: [],
					})
					.eq("id", id);
			}

			success++;
		} catch (error) {
			logError(`Failed to rest character ${id}:`, error);
			failed++;
		}
	}

	return { success, failed };
}
