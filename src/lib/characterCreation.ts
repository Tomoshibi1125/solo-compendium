/**
 * Character creation automation
 * Handles automatic feature/equipment/power addition from compendium
 */

import { supabase } from "@/integrations/supabase/client";
import type { Database, Json } from "@/integrations/supabase/types";
import { calculateFeatureUses } from "@/lib/characterEngine";
import {
	addLocalEquipment,
	addLocalFeature,
	addLocalPower,
	isLocalCharacterId,
	listLocalFeatures,
	updateLocalFeature,
} from "@/lib/guestStore";
import { getStaticPathUnlockLevel } from "@/lib/levelGating";
import {
	getStaticBackgrounds,
	getStaticItems,
	getStaticJobs,
	getStaticPaths,
} from "@/lib/ProtocolDataManager";
import {
	filterRowsBySourcebookAccess,
	getCharacterCampaignId,
	isSourcebookAccessible,
} from "@/lib/sourcebookAccess";
import type {
	Background as DbBackground,
	Job as DbJob,
	StaticBackground,
	StaticJob,
} from "@/types/character";
import type {
	CompendiumBackground,
	CompendiumJob as CompendiumJobType,
	CompendiumItem as StaticItem,
} from "@/types/compendium";
export type { StaticBackground, StaticJob };

import { getProficiencyBonus } from "@/types/core-rules";
import { getDefaultSigilSlotsBaseForEquipment } from "./sigilAutomation";

export type Job = DbJob;
export type Background = DbBackground;

export function normalizeItemLookupName(value: string): string {
	return value
		.trim()
		.replace(/^a\s+/i, "")
		.replace(/^an\s+/i, "")
		.replace(/^a\s+set\s+of\s+/i, "")
		.replace(/^set\s+of\s+/i, "")
		.replace(/^a\s+pair\s+of\s+/i, "")
		.replace(/^pair\s+of\s+/i, "")
		.trim()
		.toLowerCase();
}

export function findStaticItemByName(itemName: string): StaticItem | null {
	const staticItems = getStaticItems();
	const normalized = normalizeItemLookupName(itemName);

	// Exact match first
	const exact =
		staticItems.find((i) => normalizeItemLookupName(i.name) === normalized) ??
		null;
	if (exact) return exact;

	// Fuzzy fallback: background equipment strings often include adjectives ("portable", "high-end", etc.)
	// so we do a conservative contains check.
	return (
		staticItems.find((i) => {
			const n = normalizeItemLookupName(i.name);
			return normalized.includes(n) || n.includes(normalized);
		}) ?? null
	);
}

export function _findStaticBackgroundByName(
	backgroundName: string | null | undefined,
): CompendiumBackground | null {
	if (!backgroundName) return null;
	const staticBackgrounds = getStaticBackgrounds();
	const normalized = backgroundName.trim().toLowerCase();
	return (
		staticBackgrounds.find((b) => b.name.trim().toLowerCase() === normalized) ??
		null
	);
}

export function _splitCompoundEquipmentEntry(entry: string): string[] {
	const trimmed = entry.trim();
	if (!trimmed) return [];

	// Handle common compound phrasing from modern backgrounds.
	// Example: "A ring light and portable camera"
	if (trimmed.toLowerCase().includes(" and ")) {
		return trimmed
			.split(/\s+and\s+/i)
			.map((s) => s.trim())
			.filter(Boolean);
	}

	return [trimmed];
}

export function deriveItemType(item: StaticItem): string {
	if (item.item_type) return item.item_type;
	const t = item.type?.toLowerCase() ?? "";
	if (t === "weapon") return "weapon";
	if (t === "armor") return "armor";
	if (t === "consumable") return "consumable";
	if (t === "scroll" || t === "wand" || t === "staff") return "tool";
	return "misc";
}

export function findStaticJobByName(
	jobName: string | null | undefined,
): CompendiumJobType | null {
	if (!jobName) return null;
	const staticJobs = getStaticJobs();
	const normalized = jobName.trim().toLowerCase();
	return (
		staticJobs.find((j) => j.name.trim().toLowerCase() === normalized) ?? null
	);
}

/**
 * Build a properties string array from a static compendium item's mechanical fields.
 * The equipmentModifiers.ts parser reads these strings to apply AC, damage, etc.
 */
export function buildItemProperties(item: StaticItem): string[] {
	const props: string[] = [];

	// Armor: emit "AC <value>" so the modifier parser picks it up
	if (item.armor_class) {
		if (item.armor_type === "Shield") {
			props.push("+2 AC");
		} else {
			// e.g. "16" from "16", or "14 + Dex modifier (max 2)" → extract leading number
			const acNum = parseInt(String(item.armor_class), 10);
			if (!Number.isNaN(acNum) && acNum > 10) {
				props.push(`AC ${acNum}`);
			}
		}
		if (item.armor_type) props.push(item.armor_type);
	}
	if (item.stealth_disadvantage) props.push("Stealth disadvantage");
	if (item.strength_requirement)
		props.push(`Requires STR ${item.strength_requirement}`);

	// Weapon: damage string
	if (item.damage && item.damage_type) {
		props.push(`${item.damage} ${item.damage_type}`);
	}
	if (item.weapon_type) props.push(item.weapon_type);
	if (item.simple_properties) {
		props.push(...item.simple_properties);
	}
	if (item.range && item.range !== "Melee") props.push(`Range ${item.range}`);

	const passive = Array.isArray(item.effects)
		? item.effects
		: (item.effects as { passive?: string[] })?.passive;
	if (Array.isArray(passive)) {
		for (const line of passive) {
			if (typeof line === "string" && line.trim().length > 0) {
				props.push(line.trim());
			}
		}
	}

	return props;
}

/**
 * Auto-update feature uses when level changes
 */
export async function autoUpdateFeatureUses(
	characterId: string,
): Promise<void> {
	const { data: character } = await supabase
		.from("characters")
		.select("level")
		.eq("id", characterId)
		.single();

	if (!character) return;

	const proficiencyBonus = getProficiencyBonus(character.level);

	const { data: features } = await supabase
		.from("character_features")
		.select("*")
		.eq("character_id", characterId);

	if (!features) return;

	for (const feature of features) {
		// Use type-safe property extraction from JSON field
		const modifiers = feature.modifiers as Array<{
			type: string;
			target: string;
			value: string | number | boolean;
		}> | null;
		const usesFormula = modifiers?.find(
			(m) => m.type === "resource" && m.target === "uses_formula",
		)?.value as string | undefined;

		if (usesFormula) {
			const newMax = calculateFeatureUses(
				usesFormula,
				character.level,
				proficiencyBonus,
			);

			if (newMax !== null && feature.uses_max !== newMax) {
				await supabase
					.from("character_features")
					.update({
						uses_max: newMax,
						uses_current: Math.min(feature.uses_current ?? newMax, newMax),
					})
					.eq("id", feature.id);
			}
		}
	}
}

export function isChoiceFeatureText(value: string | null | undefined): boolean {
	if (!value) return false;
	return /\b(choose|select|pick)\b/i.test(value);
}

export function _isChoiceFeatureRow(feature: {
	name?: string | null;
	description?: string | null;
	prerequisites?: string | null;
}): boolean {
	return (
		isChoiceFeatureText(feature.name ?? null) ||
		isChoiceFeatureText(feature.description ?? null) ||
		isChoiceFeatureText(feature.prerequisites ?? null)
	);
}

export type SpellProgression = "none" | "full" | "half" | "pact";

export function normalizeJobName(jobName: string | null | undefined): string {
	return (jobName || "").trim().toLowerCase();
}

export type JobReference = StaticJob | DbJob | string | null | undefined;

export function isStaticJob(job: JobReference): job is StaticJob {
	return !!job && typeof job !== "string" && "awakeningFeatures" in job;
}

export function getSpellProgressionForJob(job: JobReference): SpellProgression {
	const jobName = typeof job === "string" ? job : job?.name;
	const normalized = normalizeJobName(jobName);

	// Full casters
	const fullCasters = [
		"mage",
		"revenant",
		"herald",
		"esper",
		"summoner",
		"idol",
	];
	if (fullCasters.includes(normalized)) return "full";

	// Half casters
	const halfCasters = ["holy knight", "stalker", "technomancer"];
	if (halfCasters.includes(normalized)) return "half";

	// Pact caster
	if (normalized === "contractor") return "pact";

	return "none";
}

/**
 * 5e-accurate max spell level unlocked for a class at a given level.
 * We use this to gate compendium powers (treating `power_level` like spell level).
 */
export function getMaxPowerLevelForJobAtLevel(
	job: JobReference,
	level: number,
): number {
	const clamped = Math.min(Math.max(level, 1), 20);
	const progression = getSpellProgressionForJob(job);

	if (progression === "none") return 0;

	if (progression === "pact") {
		if (clamped >= 9) return 5;
		if (clamped >= 7) return 4;
		if (clamped >= 5) return 3;
		if (clamped >= 3) return 2;
		return 1;
	}

	if (progression === "half") {
		if (clamped >= 17) return 5;
		if (clamped >= 13) return 4;
		if (clamped >= 9) return 3;
		if (clamped >= 5) return 2;
		if (clamped >= 2) return 1;
		return 0;
	}

	// full caster
	if (clamped >= 17) return 9;
	if (clamped >= 15) return 8;
	if (clamped >= 13) return 7;
	if (clamped >= 11) return 6;
	if (clamped >= 9) return 5;
	if (clamped >= 7) return 4;
	if (clamped >= 5) return 3;
	if (clamped >= 3) return 2;
	return 1;
}

export async function getExistingFeatureNames(
	characterId: string,
): Promise<Set<string>> {
	if (isLocalCharacterId(characterId)) {
		return new Set(listLocalFeatures(characterId).map((f) => f.name));
	}

	const { data } = await supabase
		.from("character_features")
		.select("name")
		.eq("character_id", characterId);

	return new Set((data || []).map((row) => row.name));
}

export async function insertCharacterFeature(
	characterId: string,
	payload: Omit<
		Database["public"]["Tables"]["character_features"]["Insert"],
		"character_id"
	>,
): Promise<void> {
	if (isLocalCharacterId(characterId)) {
		addLocalFeature(characterId, {
			name: payload.name,
			source: payload.source ?? undefined,
			level_acquired: payload.level_acquired ?? undefined,
			description: payload.description ?? undefined,
			action_type: payload.action_type ?? null,
			uses_max: payload.uses_max ?? null,
			uses_current: payload.uses_current ?? null,
			recharge: payload.recharge ?? null,
			is_active: payload.is_active ?? true,
			modifiers: (payload.modifiers ??
				null) as Database["public"]["Tables"]["character_features"]["Row"]["modifiers"],
			homebrew_id: (payload.homebrew_id as string) ?? null,
		});
		return;
	}

	await supabase.from("character_features").insert({
		character_id: characterId,
		...payload,
	});
}

export async function updateCharacterFeatureModifiersByName(
	characterId: string,
	name: string,
	modifiers: FeatureModifier[] | null,
): Promise<void> {
	if (isLocalCharacterId(characterId)) {
		const local = listLocalFeatures(characterId);
		const existing = local.find(
			(f: { name?: string | null; id: string }) => f.name === name,
		);
		if (!existing) return;
		updateLocalFeature(existing.id, { modifiers: (modifiers || null) as Json });
		return;
	}

	await supabase
		.from("character_features")
		.update({ modifiers: (modifiers || null) as Json })
		.eq("character_id", characterId)
		.eq("name", name);
}

export type FeatureModifier = {
	type: string;
	value: number;
	target?: string;
	source: string;
};

export function getJobTraitModifiers(
	jobName: string,
	traitName: string,
): FeatureModifier[] {
	const job = jobName.trim().toLowerCase();
	const trait = traitName.trim().toLowerCase();

	// 1. DESTROYER
	if (job === "destroyer") {
		if (trait === "gate breaker") {
			return [
				{ type: "advantage", value: 0, target: "save:fear", source: traitName },
			];
		}
		if (trait === "combat telemetry") {
			// Bonus action scan: advantage on Investigation checks
			return [
				{
					type: "advantage",
					value: 0,
					target: "skill:investigation",
					source: traitName,
				},
			];
		}
	}

	// 2. BERSERKER
	if (job === "berserker") {
		if (trait === "threat reflex") {
			return [
				{ type: "advantage", value: 0, target: "AGI_saves", source: traitName },
			];
		}
		if (trait === "predator instinct") {
			return [
				{
					type: "advantage",
					value: 0,
					target: "initiative",
					source: traitName,
				},
			];
		}
		if (trait === "mana intimidation") {
			return [
				{ type: "save_dc_bonus", value: 0, target: "PRE", source: traitName },
			];
		}
		if (trait === "feral instinct") {
			return [
				{
					type: "advantage",
					value: 0,
					target: "initiative",
					source: traitName,
				},
			];
		}
	}

	// 3. ASSASSIN
	if (job === "assassin") {
		if (trait === "dimensional sight") {
			return [
				{
					type: "advantage",
					value: 0,
					target: "skill:perception_hearing",
					source: traitName,
				},
			];
		}
		if (trait === "ghost walk") {
			return [
				{
					type: "advantage",
					value: 0,
					target: "skill:stealth",
					source: traitName,
				},
			];
		}
		if (trait === "specialist training") {
			return [
				{ type: "expertise", value: 0, target: "choice:2", source: traitName },
			];
		}
	}

	// 4. STRIKER
	if (job === "striker") {
		if (trait === "impulse sense") {
			return [
				{
					type: "advantage",
					value: 0,
					target: "skill:perception",
					source: traitName,
				},
			];
		}
		if (trait === "gyroscopic core") {
			return [
				{ type: "immunity", value: 0, target: "prone", source: traitName },
			];
		}
	}

	// 5. MAGE
	if (job === "mage") {
		if (trait === "arcane sight") {
			return [
				{
					type: "advantage",
					value: 0,
					target: "skill:arcana",
					source: traitName,
				},
			];
		}
		if (trait === "spell resistance lattice") {
			return [
				{ type: "resistance", value: 0, target: "psychic", source: traitName },
			];
		}
	}

	// 6. ESPER
	if (job === "esper") {
		if (trait === "mana sensitivity") {
			return [
				{
					type: "advantage",
					value: 0,
					target: "skill:arcana",
					source: traitName,
				},
			];
		}
		if (trait === "anomalous resistance") {
			return [
				{
					type: "advantage",
					value: 0,
					target: "save:charm",
					source: traitName,
				},
			];
		}
		if (trait === "focused discharge") {
			return [
				{
					type: "disadvantage",
					value: 0,
					target: "save:target",
					source: traitName,
				},
			];
		}
	}

	// 7. REVENANT
	if (job === "revenant") {
		if (trait === "deathsight") {
			return [
				{
					type: "advantage",
					value: 0,
					target: "skill:perception_life",
					source: traitName,
				},
			];
		}
		if (trait === "necrotic shell") {
			return [
				{ type: "resistance", value: 0, target: "necrotic", source: traitName },
				{
					type: "immunity",
					value: 0,
					target: "hp_reduction",
					source: traitName,
				},
			];
		}
		if (trait === "voice of the dead") {
			return [
				{
					type: "at_will_spell",
					value: 0,
					target: "Speak with Dead",
					source: traitName,
				},
			];
		}
	}

	// 8. SUMMONER
	if (job === "summoner") {
		if (trait === "wild intuition") {
			return [
				{
					type: "advantage",
					value: 0,
					target: "skill:animal_handling",
					source: traitName,
				},
			];
		}
		if (trait === "toxin resistance") {
			return [
				{
					type: "advantage",
					value: 0,
					target: "save:poison",
					source: traitName,
				},
				{ type: "resistance", value: 0, target: "poison", source: traitName },
			];
		}
	}

	// 9. HERALD
	if (job === "herald") {
		if (trait === "entity detection") {
			return [
				{
					type: "advantage",
					value: 0,
					target: "skill:religion",
					source: traitName,
				},
			];
		}
		if (trait === "signal hardening") {
			return [
				{ type: "resistance", value: 0, target: "necrotic", source: traitName },
				{ type: "resistance", value: 0, target: "radiant", source: traitName },
			];
		}
	}

	// 10. CONTRACTOR
	if (job === "contractor") {
		if (trait === "pact resilience") {
			return [
				{
					type: "advantage",
					value: 0,
					target: "save:charm",
					source: traitName,
				},
			];
		}
		if (trait === "contract vision") {
			return [
				{
					type: "advantage",
					value: 0,
					target: "skill:insight",
					source: traitName,
				},
			];
		}
	}

	// 11. STALKER
	if (job === "stalker") {
		if (trait === "rift navigator") {
			return [
				{
					type: "advantage",
					value: 0,
					target: "save:gate_hazard",
					source: traitName,
				},
			];
		}
		if (trait === "apex predator") {
			return [
				{
					type: "advantage",
					value: 0,
					target: "skill:survival_track",
					source: traitName,
				},
			];
		}
	}

	// 12. HOLY KNIGHT
	if (job === "holy knight" || job === "holy-knight") {
		if (trait === "covenant ward") {
			return [
				{ type: "save_bonus", value: 0, target: "PRE_mod", source: traitName },
			];
		}
		if (trait === "oath ward") {
			return [
				{ type: "save_bonus", value: 0, target: "PRE_mod", source: traitName },
			];
		}
	}

	// 13. TECHNOMANCER
	if (job === "technomancer") {
		if (trait === "system analysis") {
			return [
				{
					type: "advantage",
					value: 0,
					target: "skill:investigation_tech",
					source: traitName,
				},
			];
		}
		if (trait === "hardware bond") {
			return [
				{ type: "expertise", value: 0, target: "all_tools", source: traitName },
			];
		}
		if (trait === "specialist training") {
			return [
				{ type: "expertise", value: 0, target: "choice:2", source: traitName },
			];
		}
		if (trait === "tool mastery") {
			return [
				{ type: "expertise", value: 0, target: "all_tools", source: traitName },
			];
		}
	}

	// 14. IDOL
	if (job === "idol") {
		if (trait === "rift versatility") {
			return [
				{
					type: "jack_of_all_trades",
					value: 0,
					target: "ability_checks",
					source: traitName,
				},
			];
		}
		if (trait === "resonance shield") {
			return [
				{
					type: "advantage",
					value: 0,
					target: "save:charm",
					source: traitName,
				},
				{
					type: "immunity",
					value: 0,
					target: "magical_sleep",
					source: traitName,
				},
			];
		}
		if (trait === "frequency restoration") {
			return [
				{
					type: "short_rest_hp_bonus",
					value: 0,
					target: "1d6",
					source: traitName,
				},
			];
		}
		if (trait === "specialist training") {
			return [
				{ type: "expertise", value: 0, target: "choice:2", source: traitName },
			];
		}
	}

	return [];
}

export function getJobAwakeningFeatureModifiers(
	jobName: string,
	featureName: string,
	level: number,
): FeatureModifier[] {
	const job = jobName.trim().toLowerCase();
	const feature = featureName.trim().toLowerCase();

	// 1. DESTROYER
	if (job === "destroyer") {
		if (feature === "reinforced frame") {
			return [
				{
					type: "death_save_success_regain_hp",
					value: 1,
					target: "self",
					source: featureName,
				},
			];
		}
		if (feature === "system targeting hud") {
			return [
				{
					type: "advantage",
					value: 0,
					target: "initiative",
					source: featureName,
				},
				{
					type: "crit_die_count",
					value: 1,
					target: "weapon",
					source: featureName,
				},
			];
		}
		if (feature === "adrenal regulator") {
			return [
				{ type: "damage", value: 0, target: "force:1d4", source: featureName },
			];
		}
		if (feature === "weapon neural bond") {
			const bonus = level >= 17 ? 2 : 1;
			return [
				{ type: "attack", value: bonus, target: "melee", source: featureName },
				{ type: "damage", value: bonus, target: "melee", source: featureName },
				{ type: "attack", value: bonus, target: "ranged", source: featureName },
				{ type: "damage", value: bonus, target: "ranged", source: featureName },
				{
					type: "disarm_immunity",
					value: 0,
					target: "self",
					source: featureName,
				},
			];
		}
	}

	// 2. BERSERKER
	if (job === "berserker") {
		if (
			feature === "mana-dense physiology" ||
			feature === "mana-dense-physiology"
		) {
			return [
				{
					type: "hp-max",
					value: level,
					target: "hp_max",
					source: featureName,
				},
			];
		}
		if (feature === "toxin purge") {
			return [
				{
					type: "advantage",
					value: 0,
					target: "save:poison",
					source: featureName,
				},
				{ type: "resistance", value: 0, target: "poison", source: featureName },
			];
		}
		if (feature === "feedback frenzy") {
			return [
				{
					type: "disadvantage",
					value: 0,
					target: "ability_checks",
					source: featureName,
				},
			];
		}
		if (feature === "mana saturation") {
			return [
				{
					type: "resistance",
					value: 0,
					target: "all_but_psychic",
					source: featureName,
				},
				{
					type: "unconscious_immunity_if_hp_above_0",
					value: 0,
					target: "self",
					source: featureName,
				},
			];
		}
		if (feature === "unstable discharge") {
			return [
				{ type: "damage", value: 0, target: "force:1d6", source: featureName },
			];
		}
	}

	// 3. ASSASSIN
	if (job === "assassin") {
		if (feature === "phase-shifted mind") {
			return [
				{
					type: "advantage",
					value: 0,
					target: "save:charm",
					source: featureName,
				},
				{
					type: "immunity",
					value: 0,
					target: "magical_sleep",
					source: featureName,
				},
			];
		}
		if (feature === "shadow phase") {
			return [
				{
					type: "advantage",
					value: 0,
					target: "attack_after_teleport",
					source: featureName,
				},
			];
		}
		if (feature === "lethal geometry") {
			const dieCount = level >= 13 ? 2 : 1;
			return [
				{
					type: "damage",
					value: 0,
					target: `force:${dieCount}d6`,
					source: featureName,
				},
			];
		}
		if (feature === "kill designation") {
			return [
				{
					type: "crit_threshold",
					value: 19,
					target: "designated_target",
					source: featureName,
				},
			];
		}
	}

	// 4. STRIKER
	if (job === "striker") {
		if (feature === "neural overclock") {
			return [
				{ type: "reroll_ones", value: 0, target: "self", source: featureName },
			];
		}
		if (feature === "fluid physiology") {
			return [
				{
					type: "move_through_larger",
					value: 0,
					target: "self",
					source: featureName,
				},
				{
					type: "prone_immunity",
					value: 0,
					target: "self",
					source: featureName,
				},
			];
		}
		if (feature === "impulse sense") {
			return [
				{ type: "blindsight", value: 120, target: "self", source: featureName },
			];
		}
		if (feature === "autonomic mastery") {
			return [
				{
					type: "walk_on_liquids",
					value: 0,
					target: "self",
					source: featureName,
				},
			];
		}
		if (feature === "force channeling") {
			return [
				{ type: "damage", value: 0, target: "force:1d4", source: featureName },
			];
		}
	}

	// 5. MAGE
	if (job === "mage") {
		if (feature === "mana-shielded cortex") {
			return [
				{
					type: "advantage",
					value: 0,
					target: "save:INT",
					source: featureName,
				},
				{
					type: "advantage",
					value: 0,
					target: "save:SENSE",
					source: featureName,
				},
				{
					type: "advantage",
					value: 0,
					target: "save:PRE",
					source: featureName,
				},
			];
		}
		if (feature === "system read access") {
			return [
				{
					type: "advantage",
					value: 0,
					target: "skill:arcana",
					source: featureName,
				},
			];
		}
		if (feature === "real-time decompilation") {
			return [
				{
					type: "advantage",
					value: 0,
					target: "save:spells",
					source: featureName,
				},
			];
		}
	}

	// 6. ESPER
	if (job === "esper") {
		if (
			feature === "mana-saturated body" ||
			feature === "mana-dense-physiology"
		) {
			return [
				{
					type: "hp-max",
					value: level,
					target: "hp_max",
					source: featureName,
				},
			];
		}
		if (feature === "unstable reactor") {
			return [
				{
					type: "mana_surge_on_cast",
					value: 1,
					target: "self",
					source: featureName,
				},
			];
		}
		if (feature === "willpower amplifier") {
			return [
				{
					type: "damage",
					value: 0,
					target: "force:PRE_mod",
					source: featureName,
				},
			];
		}
		if (feature === "reality distortion") {
			return [
				{
					type: "reroll_spell_damage",
					value: 1,
					target: "self",
					source: featureName,
				},
			];
		}
	}

	// 7. REVENANT
	if (job === "revenant") {
		if (feature === "reconstructed biology") {
			return [
				{ type: "immunity", value: 0, target: "disease", source: featureName },
				{ type: "no_breathing", value: 0, target: "self", source: featureName },
				{
					type: "no_food_water",
					value: 0,
					target: "self",
					source: featureName,
				},
			];
		}
		if (feature === "death's threshold") {
			return [
				{
					type: "advantage",
					value: 0,
					target: "save:death",
					source: featureName,
				},
				{
					type: "immunity",
					value: 0,
					target: "frightened",
					source: featureName,
				},
			];
		}
		if (feature === "entropic aura") {
			return [
				{
					type: "aura_wither_plants",
					value: 10,
					target: "radius",
					source: featureName,
				},
			];
		}
		if (feature === "life siphon") {
			return [
				{
					type: "hp-regain",
					value: 0.5,
					target: "necrotic_damage_dealt",
					source: featureName,
				},
			];
		}
	}

	// 8. SUMMONER
	if (job === "summoner") {
		if (feature === "gate attunement" || feature === "biome attunement") {
			return [
				{ type: "resistance", value: 0, target: "poison", source: featureName },
				{
					type: "advantage",
					value: 0,
					target: "save:poison",
					source: featureName,
				},
			];
		}
		if (feature === "entity bond" || feature === "gate ecology sense") {
			return [
				{
					type: "telepathic_bond",
					value: 100,
					target: "summon",
					source: featureName,
				},
			];
		}
		if (feature === "stabilized entity shift") {
			return [
				{ type: "hp-temp", value: level, target: "shift", source: featureName },
			];
		}
		if (feature === "reinforced summons") {
			return [
				{
					type: "hp-max",
					value: 0,
					target: "summons:prof",
					source: featureName,
				},
				{
					type: "damage",
					value: 0,
					target: "summons:1d4_force",
					source: featureName,
				},
			];
		}
	}

	// 9. HERALD
	if (job === "herald") {
		if (
			feature === "system transmission" ||
			feature === "restoration protocol"
		) {
			return [
				{
					type: "hp-temp-on-heal",
					value: 1,
					target: "target",
					source: featureName,
				},
			];
		}
		if (feature === "mana redistribution" || feature === "system uplink") {
			return [
				{
					type: "slot_recovery_on_kill",
					value: 1,
					target: "self",
					source: featureName,
				},
			];
		}
		if (feature === "broadcast aura") {
			const bonus = level >= 11 ? 2 : 1;
			return [
				{
					type: "save_bonus",
					value: bonus,
					target: "all",
					source: featureName,
				},
			];
		}
	}

	// 10. CONTRACTOR
	if (job === "contractor") {
		if (feature === "contract magic" || feature === "pact-warded mind") {
			return [
				{
					type: "slot_recovery_on_kill",
					value: 1,
					target: "self",
					source: featureName,
				},
			];
		}
		if (feature === "entity manifestation" || feature === "entity awareness") {
			return [
				{ type: "speed_fly", value: 30, target: "self", source: featureName },
				{ type: "aura_fear", value: 10, target: "radius", source: featureName },
			];
		}
		if (feature === "empowered conduit") {
			return [
				{
					type: "damage",
					value: 0,
					target: "force:PRE_mod",
					source: featureName,
				},
				{ type: "push", value: 10, target: "target", source: featureName },
			];
		}
		if (feature === "patron's boon") {
			return [
				{ type: "resistance", value: 0, target: "choice", source: featureName },
			];
		}
	}

	// 11. STALKER
	if (job === "stalker") {
		if (feature === "prey lock" || feature === "predator physiology") {
			return [
				{
					type: "damage_bonus",
					value: 0,
					target: "marked_target",
					source: featureName,
				},
			];
		}
		if (feature === "ambush tactics" || feature === "enhanced locomotion") {
			return [
				{
					type: "damage_bonus_first_turn",
					value: 0,
					target: "weapon",
					source: featureName,
				},
			];
		}
		if (feature === "terrain adaptation") {
			return [
				{
					type: "initiative_advantage",
					value: 0,
					target: "favored_terrain",
					source: featureName,
				},
			];
		}
		if (feature === "apex instinct") {
			return [
				{ type: "damage", value: 0, target: "prof", source: featureName },
			];
		}
	}

	// 12. HOLY KNIGHT
	if (job === "holy knight" || job === "holy-knight") {
		if (feature === "covenant strike" || feature === "covenant bond") {
			return [
				{
					type: "speed_reduction_on_hit",
					value: 10,
					target: "target",
					source: featureName,
				},
			];
		}
		if (feature === "radiant conduit" || feature === "oath sense") {
			return [
				{
					type: "hp-regain-aura",
					value: 0,
					target: "allies",
					source: featureName,
				},
			];
		}
		if (feature === "aura of resolve") {
			return [
				{
					type: "immunity",
					value: 0,
					target: "frightened",
					source: featureName,
				},
			];
		}
		if (feature === "purification touch") {
			return [
				{
					type: "dispel_magic",
					value: 0,
					target: "touch",
					source: featureName,
				},
			];
		}
	}

	// 13. TECHNOMANCER
	if (job === "technomancer") {
		if (feature === "blueprint vision") {
			return [
				{
					type: "expertise",
					value: 0,
					target: "skill:INT_magic_items",
					source: featureName,
				},
			];
		}
		if (feature === "core integration" || feature === "system write access") {
			return [
				{
					type: "mana_pulse_on_cast",
					value: 10,
					target: "radius",
					source: featureName,
				},
			];
		}
		if (feature === "infusion optimization") {
			const bonus = level >= 14 ? 2 : 1;
			return [
				{
					type: "item_bonus",
					value: bonus,
					target: "infusion",
					source: featureName,
				},
			];
		}
		if (feature === "construct reinforcement") {
			return [
				{
					type: "hp-max-summons",
					value: level * 2,
					target: "constructs",
					source: featureName,
				},
			];
		}
	}

	// 14. IDOL
	if (job === "idol") {
		if (feature === "broad-spectrum awakening") {
			return [
				{
					type: "proficiency",
					value: 0,
					target: "choice:2",
					source: featureName,
				},
			];
		}
		if (feature === "resonance shield") {
			return [
				{
					type: "advantage",
					value: 0,
					target: "save:charm",
					source: featureName,
				},
				{
					type: "immunity",
					value: 0,
					target: "magical_sleep",
					source: featureName,
				},
			];
		}
		if (feature === "amplified hype") {
			return [
				{
					type: "hype_temp_hp",
					value: 0,
					target: "PRE_mod",
					source: featureName,
				},
			];
		}
	}

	return [];
}

/**
 * Map from 5e ability names (used in static job data) to Rift Ascendant ability names.
 */
const JOB_ASI_TO_SYSTEM: Record<string, string> = {
	strength: "STR",
	agility: "AGI",
	vitality: "VIT",
	intelligence: "INT",
	sense: "SENSE",
	presence: "PRE",
};

/**
 * Get the ability score improvements for a job, mapped to Rift Ascendant ability names.
 * Returns a Record like { STR: 2, VIT: 1 }.
 */
export function getJobASI(
	jobName: string | null | undefined,
	level: number,
): Record<string, number> {
	const job = findStaticJobByName(jobName);
	if (!job || !job.ability_score_improvements) return {};

	const result: Record<string, number> = {};
	const asi = job.ability_score_improvements;
	if (Array.isArray(asi) && asi.includes(level)) {
		// This handles the case where improvements are gated by level
		// (Common in path scaling)
	} else if (asi && !Array.isArray(asi)) {
		const rawASI = asi as Record<string, number>;
		for (const [ability, bonus] of Object.entries(rawASI)) {
			const systemAbility = JOB_ASI_TO_SYSTEM[ability.toLowerCase()];
			if (systemAbility && typeof bonus === "number" && bonus !== 0) {
				result[systemAbility] = bonus;
			}
		}
	}
	return result;
}

export function getPathFeatureModifiers(
	jobName: string,
	pathName: string,
	featureName: string,
	level: number,
): FeatureModifier[] {
	const job = jobName.trim().toLowerCase();
	const path = pathName.trim().toLowerCase();
	const feature = featureName.trim().toLowerCase();

	// 1. DESTROYER PATHS
	if (job === "destroyer") {
		if (path === "path of the apex predator") {
			if (feature === "optimized lethality")
				return [
					{
						type: "crit_threshold",
						value: 19,
						target: "weapon",
						source: featureName,
					},
				];
			if (feature === "peak conditioning")
				return [
					{
						type: "jack_of_all_trades",
						value: 0,
						target: "STR_AGI_VIT",
						source: featureName,
					},
				];
			if (feature === "expanded kill zone")
				return [
					{
						type: "crit_threshold",
						value: 18,
						target: "weapon",
						source: featureName,
					},
				];
			if (feature === "auto-repair protocol")
				return [
					{
						type: "hp_regain_start_of_turn",
						value: 5,
						target: "VIT_mod",
						source: featureName,
					},
				];
		}
		if (path === "path of the tactician") {
			if (feature === "tactical charge")
				return [
					{
						type: "resource_max",
						value: 4,
						target: "tactical_dice",
						source: featureName,
					},
				];
		}
		if (path === "path of the spell breaker") {
			if (feature === "lattice combat flow")
				return [
					{
						type: "caster_level",
						value: 0.33,
						target: "INT",
						source: featureName,
					},
				];
		}
		if (path === "path of the bulwark") {
			if (feature === "threat lock")
				return [
					{
						type: "advantage",
						value: 0,
						target: "marked_attacks",
						source: featureName,
					},
				];
		}
	}

	// 2. BERSERKER PATHS
	if (job === "berserker") {
		if (path === "path of the feedback loop") {
			if (feature === "escalating loop")
				return [
					{
						type: "bonus_action_attack",
						value: 1,
						target: "weapon",
						source: featureName,
					},
				];
		}
		if (path === "path of the gate beast") {
			if (feature === "bonded aspect" && feature.includes("tank-beast"))
				return [
					{
						type: "resistance",
						value: 0,
						target: "all_but_psychic",
						source: featureName,
					},
				];
		}
	}

	// 3. ASSASSIN PATHS
	if (job === "assassin") {
		if (path === "path of the gate runner") {
			if (feature === "wall runner")
				return [
					{
						type: "climb_speed",
						value: 0,
						target: "walking",
						source: featureName,
					},
				];
		}
		if (path === "path of the terminus") {
			if (feature === "first strike protocol")
				return [
					{
						type: "advantage",
						value: 0,
						target: "first_turn",
						source: featureName,
					},
				];
		}
	}

	// 4. STRIKER PATHS
	if (job === "striker") {
		if (path === "path of the kinetic fist") {
			if (feature === "impact technique")
				return [
					{
						type: "impact_effect",
						value: 0,
						target: "gate_of_force",
						source: featureName,
					},
				];
			if (feature === "neural repair")
				return [
					{
						type: "hp_regain_action",
						value: 3,
						target: "striker_level",
						source: featureName,
					},
				];
		}
		if (path === "path of the phantom step") {
			if (feature === "shadow impulse")
				return [
					{
						type: "at_will_spell",
						value: 0,
						target: "Minor Illusion",
						source: featureName,
					},
				];
		}
	}

	// 5. MAGE PATHS
	if (job === "mage") {
		if (path === "school of evocation" || path === "path of the mana burst") {
			if (feature === "evocation savant")
				return [
					{
						type: "gold_cost_reduction",
						value: 0.5,
						target: "evocation_spells",
						source: featureName,
					},
				];
			if (feature === "sculpt spells")
				return [
					{
						type: "spell_safety",
						value: 0,
						target: "allies",
						source: featureName,
					},
				];
		}
	}

	// 6. ESPER PATHS
	if (job === "esper") {
		if (path === "draconic bloodline" || path === "path of the mana dragon") {
			if (feature === "dragon hide")
				return [
					{ type: "ac_base", value: 13, target: "AGI", source: featureName },
				];
			if (feature === "draconic resilience")
				return [
					{
						type: "hp-max",
						value: level,
						target: "hp_max",
						source: featureName,
					},
				];
		}
	}

	// 7. REVENANT PATHS
	if (job === "revenant") {
		if (path === "grave lord" || path === "path of the soul reaper") {
			if (feature === "grim harvest")
				return [
					{
						type: "hp_regain_on_kill",
						value: 2,
						target: "spell_level",
						source: featureName,
					},
				];
		}
	}

	// 8. SUMMONER PATHS
	if (job === "summoner") {
		if (path === "circle of the moon" || path === "path of the entity shift") {
			if (feature === "combat shift")
				return [
					{
						type: "bonus_action_shift",
						value: 0,
						target: "self",
						source: featureName,
					},
				];
		}
	}

	// 9. HERALD PATHS
	if (job === "herald") {
		if (path === "life domain" || path === "path of the restorer") {
			if (feature === "disciple of life")
				return [
					{
						type: "healing_bonus",
						value: 2,
						target: "spell_level",
						source: featureName,
					},
				];
		}
	}

	// 10. CONTRACTOR PATHS
	if (job === "contractor") {
		if (path === "the fiend" || path === "path of the abyss") {
			if (feature === "dark one's blessing")
				return [
					{
						type: "hp-temp-on-kill",
						value: 0,
						target: "PRE_mod",
						source: featureName,
					},
				];
		}
	}

	// 11. STALKER PATHS
	if (job === "stalker") {
		if (path === "ascendant" || path === "path of the apex stalker") {
			if (feature === "ascendant's prey")
				return [
					{
						type: "choice:1",
						value: 0,
						target: "prey_type",
						source: featureName,
					},
				];
		}
	}

	// 12. HOLY KNIGHT PATHS
	if (job === "holy knight" || job === "holy-knight") {
		if (path === "oath of devotion" || path === "path of the pure protocol") {
			if (feature === "aura of devotion")
				return [
					{
						type: "immunity_aura",
						value: 10,
						target: "charm",
						source: featureName,
					},
				];
		}
	}

	// 13. TECHNOMANCER PATHS
	if (job === "technomancer") {
		if (path === "alchemist" || path === "path of the bio-architect") {
			if (feature === "experimental elixir")
				return [
					{
						type: "resource_max",
						value: 1,
						target: "elixirs",
						source: featureName,
					},
				];
		}
	}

	// 14. IDOL PATHS
	if (job === "idol") {
		if (path === "college of lore" || path === "path of the chronicler") {
			if (feature === "cutting words")
				return [
					{
						type: "dissonance_effect",
						value: 0,
						target: "hype_die",
						source: featureName,
					},
				];
		}
	}

	return [];
}

export function getRegentFeatureModifiers(
	regentName: string,
	featureName: string,
	_level: number,
): FeatureModifier[] {
	const regent = regentName.trim().toLowerCase();
	const feature = featureName.trim().toLowerCase();

	// 1. Shadow/Umbral Regent
	if (regent === "umbral regent" || regent === "shadow regent") {
		if (feature === "umbral command" || feature === "shadow extraction")
			return [
				{
					type: "summon_max",
					value: 20,
					target: "umbral_creatures",
					source: featureName,
				},
			];
		if (feature === "veilstep supreme" || feature === "shadow exchange")
			return [
				{
					type: "teleport_range",
					value: 120,
					target: "dim_light",
					source: featureName,
				},
			];
		if (feature === "umbral dominion")
			return [
				{ type: "immunity", value: 0, target: "necrotic", source: featureName },
				{
					type: "advantage",
					value: 0,
					target: "save:umbral",
					source: featureName,
				},
			];
		if (feature === "regent's presence")
			return [
				{ type: "aura_fear", value: 30, target: "radius", source: featureName },
			];
		if (feature === "absolute umbral")
			return [
				{ type: "immunity", value: 0, target: "all", source: featureName },
			];
		if (feature === "legion of the veil")
			return [
				{
					type: "summon_count",
					value: 0,
					target: "2d6_shadows",
					source: featureName,
				},
			];
		if (feature === "umbral mastery")
			return [
				{
					type: "at_will_spell",
					value: 0,
					target: "umbral_spells",
					source: featureName,
				},
			];
		if (feature === "death's command")
			return [
				{
					type: "command_undead",
					value: 0,
					target: "all",
					source: featureName,
				},
			];
	}

	// 2. Dragon Regent
	if (regent === "dragon regent") {
		if (feature === "breath of annihilation")
			return [
				{
					type: "aoe_damage",
					value: 0,
					target: "12d10_fire",
					source: featureName,
				},
			];
		if (feature === "destruction aura")
			return [
				{
					type: "aura_damage",
					value: 4,
					target: "4d6_fire",
					source: featureName,
				},
			];
		if (feature === "cataclysm wings")
			return [
				{
					type: "fly_speed",
					value: 90,
					target: undefined,
					source: featureName,
				},
			];
		if (feature === "scale armor")
			return [
				{
					type: "ac_set",
					value: 17,
					target: "natural_armor",
					source: featureName,
				},
			];
		if (feature === "true dragon form")
			return [
				{
					type: "ac_set",
					value: 22,
					target: "transformation",
					source: featureName,
				},
				{
					type: "fly_speed",
					value: 120,
					target: undefined,
					source: featureName,
				},
				{ type: "immunity", value: 0, target: "fire", source: featureName },
			];
		if (feature === "primordial flame")
			return [
				{
					type: "ignore_resistance",
					value: 0,
					target: "fire",
					source: featureName,
				},
			];
		if (feature === "absolute dragon")
			return [
				{ type: "immunity", value: 0, target: "fire", source: featureName },
				{ type: "immunity", value: 0, target: "physical", source: featureName },
			];
	}

	// 3. Frost Regent
	if (regent === "frost regent" || regent === "frost sovereign") {
		if (feature === "frost dominion" || feature === "glacial domain")
			return [
				{ type: "immunity", value: 0, target: "cold", source: featureName },
				{ type: "resistance", value: 0, target: "fire", source: featureName },
			];
		if (feature === "absolute zero")
			return [
				{
					type: "aura_speed_reduction",
					value: 20,
					target: "radius:30",
					source: featureName,
				},
			];
		if (feature === "ice age advent")
			return [
				{
					type: "aoe_damage",
					value: 0,
					target: "cold_zone",
					source: featureName,
				},
			];
		if (feature === "glacial time")
			return [
				{
					type: "speed_reduction",
					value: 50,
					target: "radius:60",
					source: featureName,
				},
			];
		if (feature === "winter's immortality")
			return [
				{ type: "immunity", value: 0, target: "cold", source: featureName },
				{ type: "immunity", value: 0, target: "fire", source: featureName },
				{
					type: "hp_regen",
					value: 20,
					target: "per_round",
					source: featureName,
				},
			];
		if (feature === "temporal frost")
			return [
				{
					type: "time_stop",
					value: 1,
					target: "120ft_radius",
					source: featureName,
				},
			];
		if (feature === "absolute frost")
			return [
				{
					type: "maximize_damage",
					value: 0,
					target: "cold",
					source: featureName,
				},
			];
	}

	// 4. Beast Regent
	if (regent === "beast regent") {
		if (feature === "apex form")
			return [
				{ type: "stat_bonus", value: 6, target: "str", source: featureName },
				{ type: "stat_bonus", value: 6, target: "agi", source: featureName },
				{ type: "stat_bonus", value: 6, target: "vit", source: featureName },
				{
					type: "hp_regen",
					value: 15,
					target: "per_turn",
					source: featureName,
				},
			];
		if (feature === "alpha's presence")
			return [
				{
					type: "aura_fear",
					value: 120,
					target: "radius",
					source: featureName,
				},
			];
		if (feature === "beast king's call")
			return [
				{
					type: "command_beasts",
					value: 10,
					target: "miles",
					source: featureName,
				},
			];
		if (feature === "primordial regeneration")
			return [
				{
					type: "hp_regen",
					value: 25,
					target: "per_turn",
					source: featureName,
				},
				{ type: "immunity", value: 0, target: "disease", source: featureName },
			];
		if (feature === "pack tactics")
			return [
				{
					type: "advantage",
					value: 0,
					target: "attack_allies",
					source: featureName,
				},
			];
		if (feature === "absolute beast")
			return [
				{ type: "immunity", value: 0, target: "physical", source: featureName },
			];
	}

	// 5. Titan Regent (maps to Steel Regent in compendium)
	if (regent === "titan regent" || regent === "steel regent") {
		if (
			feature === "true invulnerability" ||
			feature === "flesh reconstruction"
		)
			return [
				{
					type: "immunity",
					value: 0,
					target: "all_damage",
					source: featureName,
				},
			];
		if (feature === "immovable anchor" || feature === "steel weaving")
			return [
				{ type: "ac_bonus", value: 3, target: undefined, source: featureName },
				{
					type: "resistance",
					value: 0,
					target: "physical",
					source: featureName,
				},
			];
		if (feature === "infinite stamina" || feature === "regeneration core")
			return [
				{ type: "hp_regen", value: 1, target: "per_turn", source: featureName },
				{
					type: "immunity",
					value: 0,
					target: "exhaustion",
					source: featureName,
				},
			];
		if (feature === "titan's retaliation" || feature === "adaptive defense")
			return [
				{
					type: "damage_reflect",
					value: 0,
					target: "melee",
					source: featureName,
				},
			];
		if (feature === "absolute titan" || feature === "absolute steel")
			return [
				{ type: "immunity", value: 0, target: "all", source: featureName },
			];
	}

	// 6. Plague Regent
	if (regent === "plague regent") {
		if (feature === "typhoid incarnate" || feature === "apocalypse plague")
			return [
				{
					type: "aura_damage",
					value: 0,
					target: "disease_aura:60",
					source: featureName,
				},
			];
		if (feature === "insect god")
			return [
				{
					type: "command_insects",
					value: 5,
					target: "miles",
					source: featureName,
				},
			];
		if (feature === "billion swarm")
			return [
				{
					type: "fly_speed",
					value: 60,
					target: undefined,
					source: featureName,
				},
				{ type: "immunity", value: 0, target: "non_aoe", source: featureName },
			];
		if (feature === "pathogen mastery")
			return [
				{ type: "immunity", value: 0, target: "disease", source: featureName },
				{ type: "immunity", value: 0, target: "poison", source: featureName },
			];
		if (feature === "biological apocalypse")
			return [
				{
					type: "aoe_damage",
					value: 0,
					target: "8d10_necrotic",
					source: featureName,
				},
			];
		if (feature === "absolute plague")
			return [
				{
					type: "permanent_disease",
					value: 0,
					target: "incurable",
					source: featureName,
				},
			];
	}

	// 7. Architect Regent
	if (regent === "architect regent") {
		if (feature === "world creation")
			return [
				{
					type: "create_demiplane",
					value: 1,
					target: "mile_cube",
					source: featureName,
				},
			];
		if (feature === "instant architecture")
			return [
				{
					type: "create_structure",
					value: 300,
					target: "cube_ft",
					source: featureName,
				},
			];
		if (feature === "spatial anchors")
			return [
				{
					type: "teleport_anchors",
					value: 12,
					target: "permanent",
					source: featureName,
				},
			];
		if (feature === "living lair")
			return [
				{
					type: "lair_control",
					value: 0,
					target: "own_structures",
					source: featureName,
				},
			];
		if (feature === "dimensional lock")
			return [
				{
					type: "antimagic_zone",
					value: 1,
					target: "mile_radius",
					source: featureName,
				},
			];
		if (feature === "blueprint vision")
			return [
				{ type: "truesight", value: 5, target: "miles", source: featureName },
			];
		if (feature === "reality rewrite")
			return [
				{
					type: "terrain_reshape",
					value: 1,
					target: "mile_radius",
					source: featureName,
				},
			];
		if (feature === "absolute architect")
			return [
				{
					type: "at_will_creation",
					value: 0,
					target: "demiplanes",
					source: featureName,
				},
			];
	}

	// 8. Radiant Regent (maps to Flame Regent in compendium)
	if (regent === "radiant regent" || regent === "flame regent") {
		if (feature === "flame step")
			return [
				{
					type: "teleport_range",
					value: 120,
					target: "flames",
					source: featureName,
				},
			];
		if (feature === "flame dominion" || feature === "white fire")
			return [
				{ type: "immunity", value: 0, target: "fire", source: featureName },
				{
					type: "resistance",
					value: 0,
					target: "radiant",
					source: featureName,
				},
			];
		if (feature === "immolation aura")
			return [
				{
					type: "aura_damage",
					value: 1,
					target: "1d6_fire",
					source: featureName,
				},
			];
		if (feature === "white flame burst")
			return [
				{
					type: "aoe_damage",
					value: 0,
					target: "10d10_fire",
					source: featureName,
				},
			];
		if (feature === "purification flame" || feature === "divine purge")
			return [
				{
					type: "aoe_cleanse",
					value: 60,
					target: "radius",
					source: featureName,
				},
			];
		if (feature === "phoenix rebirth")
			return [
				{
					type: "auto_resurrection",
					value: 1,
					target: "self",
					source: featureName,
				},
			];
		if (feature === "seraphim form")
			return [
				{
					type: "fly_speed",
					value: 120,
					target: undefined,
					source: featureName,
				},
				{ type: "immunity", value: 0, target: "all", source: featureName },
				{
					type: "aura_damage",
					value: 6,
					target: "6d8_radiant",
					source: featureName,
				},
			];
		if (feature === "judgment day")
			return [
				{
					type: "aoe_damage",
					value: 0,
					target: "20d10_radiant",
					source: featureName,
				},
			];
	}

	// 9. Mimic Regent
	if (regent === "mimic regent") {
		if (feature === "perfect imitation")
			return [
				{
					type: "shapeshift",
					value: 0,
					target: "unlimited",
					source: featureName,
				},
			];
		if (feature === "power theft")
			return [
				{
					type: "copy_ability",
					value: 0,
					target: "permanent",
					source: featureName,
				},
			];
		if (feature === "reactive evolution")
			return [
				{
					type: "adaptive_immunity",
					value: 0,
					target: "last_damage_type",
					source: featureName,
				},
				{
					type: "adaptive_save",
					value: 0,
					target: "last_failed_save",
					source: featureName,
				},
			];
		if (feature === "quantum existence")
			return [
				{
					type: "illusion",
					value: 0,
					target: "per_observer",
					source: featureName,
				},
			];
		if (feature === "memory access")
			return [
				{
					type: "skill_copy",
					value: 0,
					target: "mimicked_target",
					source: featureName,
				},
			];
		if (feature === "form archive")
			return [
				{
					type: "form_storage",
					value: 0,
					target: "unlimited",
					source: featureName,
				},
			];
		if (feature === "perfect copy")
			return [
				{
					type: "legendary_copy",
					value: 0,
					target: "observed",
					source: featureName,
				},
			];
		if (feature === "absolute mimic")
			return [
				{
					type: "copy_concepts",
					value: 0,
					target: "no_limit",
					source: featureName,
				},
			];
	}

	return [];
}

/**
 * Apply a job's innate "awakening traits" to the character row.
 *
 * In Rift Ascendant, Jobs function as both race and class — so the racial-equivalent
 * data (senses, damage resistances, damage/condition immunities, vulnerabilities,
 * languages) lives on the Job and must be merged onto the character at creation.
 * Without this step, a Revenant never gains Darkvision 120 ft and an Oracle never
 * gets Radiant resistance on its sheet even though the Job explicitly grants them.
 *
 * Merges (de-dupes) with anything already on the character row so that background
 * grants, regent grants, and later level-ups never clobber prior values.
 */
export async function applyJobAwakeningTraitsToCharacter(
	characterId: string,
	job: JobReference,
	selectedLanguages: string[] = [],
): Promise<void> {
	if (!isStaticJob(job)) return;

	const dedupe = (...lists: (string[] | null | undefined)[]): string[] => {
		const out: string[] = [];
		const seen = new Set<string>();
		for (const list of lists) {
			if (!list) continue;
			for (const raw of list) {
				if (typeof raw !== "string") continue;
				const value = raw.trim();
				if (!value) continue;
				const key = value.toLowerCase();
				if (seen.has(key)) continue;
				seen.add(key);
				out.push(value);
			}
		}
		return out;
	};

	// Build senses: compose Darkvision + any listed specialSenses into the
	// string[] shape that characters.senses expects (e.g. "Darkvision 60 ft.").
	const jobSenses: string[] = [];
	if (typeof job.darkvision === "number" && job.darkvision > 0) {
		jobSenses.push(`Darkvision ${job.darkvision} ft.`);
	}
	if (job.specialSenses && job.specialSenses.length > 0) {
		jobSenses.push(...job.specialSenses);
	}

	const jobResistances = dedupe(job.damage_resistances, job.damageResistances);
	const jobImmunities = dedupe(job.damage_immunities, job.damageImmunities);
	const jobConditionImmunities = dedupe(
		job.condition_immunities,
		job.conditionImmunities,
	);

	// Languages are not persisted on characters today (no column). We still
	// pass-through via job traits / awakening features for display; the
	// selectedLanguages argument is retained so callers can forward the
	// player's chosen language once a languages column or table is added.
	void selectedLanguages;

	// Load existing arrays so we merge instead of overwrite. For guest/local
	// characters this goes through updateLocalCharacter; for Supabase we read
	// the current row and write back a merged update.
	if (isLocalCharacterId(characterId)) {
		const { getLocalCharacterWithAbilities, updateLocalCharacter } =
			await import("@/lib/guestStore");
		const existing = getLocalCharacterWithAbilities(characterId);
		if (!existing) return;
		updateLocalCharacter(characterId, {
			senses: dedupe(existing.senses, jobSenses),
			resistances: dedupe(existing.resistances, jobResistances),
			immunities: dedupe(existing.immunities, jobImmunities),
			condition_immunities: dedupe(
				existing.condition_immunities,
				jobConditionImmunities,
			),
		});
		return;
	}

	const { data: existing, error: readErr } = await supabase
		.from("characters")
		.select(
			"senses, resistances, immunities, condition_immunities, vulnerabilities",
		)
		.eq("id", characterId)
		.single();
	if (readErr || !existing) return;

	const { error: writeErr } = await supabase
		.from("characters")
		.update({
			senses: dedupe(existing.senses, jobSenses),
			resistances: dedupe(existing.resistances, jobResistances),
			immunities: dedupe(existing.immunities, jobImmunities),
			condition_immunities: dedupe(
				existing.condition_immunities,
				jobConditionImmunities,
			),
			// Vulnerabilities intentionally not job-granted today; preserved as-is.
		})
		.eq("id", characterId);
	if (writeErr) {
		console.warn(
			"applyJobAwakeningTraitsToCharacter: failed to persist job traits",
			writeErr,
		);
	}
}

/**
 * Grant job awakening benefits (awakening features + job traits) at a specific level.
 */
export async function addJobAwakeningBenefitsForLevel(
	characterId: string,
	job: JobReference, // Standardized
	level: number,
): Promise<void> {
	if (!job) {
		console.warn("Cannot add awakening benefits: job missing");
		return;
	}
	const jobName = typeof job === "string" ? job : job?.name;
	const existingNames = await getExistingFeatureNames(characterId);

	// Handle scaling awakening features that need to update with character level.
	if (
		jobName.trim().toLowerCase() === "berserker" &&
		existingNames.has("Mana-Dense Physiology")
	) {
		const next = getJobAwakeningFeatureModifiers(
			jobName,
			"Mana-Dense Physiology",
			level,
		);
		await updateCharacterFeatureModifiersByName(
			characterId,
			"Mana-Dense Physiology",
			next.length > 0 ? next : null,
		);
	}

	// Direct Job Features from DB first (Rift Ascendant authoritative)
	const { data: jobFeatures } = await supabase
		.from("compendium_job_features")
		.select("*")
		.eq("job_id", typeof job !== "string" && job ? job.id : "")
		.eq("level", level)
		.eq("is_path_feature", false);

	// If no DB features, check static Job Awakening (new Zero-Legacy enrichment)
	if (
		(!jobFeatures || jobFeatures.length === 0) &&
		isStaticJob(job) &&
		job.awakeningFeatures
	) {
		const awakeningAtLevel = job.awakeningFeatures.filter(
			(f) => f.level === level,
		);
		for (const feature of awakeningAtLevel) {
			if (existingNames.has(feature.name)) continue;

			const modifiers = getJobAwakeningFeatureModifiers(
				jobName,
				feature.name,
				level,
			);
			await insertCharacterFeature(characterId, {
				name: feature.name,
				source: `Job Awakening: ${jobName}`,
				level_acquired: level,
				description: feature.description,
				is_active: true,
				modifiers: modifiers.length > 0 ? (modifiers as Json) : null,
			});
		}
	}

	// Path benefits
	const { data: character } = await supabase
		.from("characters")
		.select("path")
		.eq("id", characterId)
		.single();
	if (character?.path) {
		const staticPaths = getStaticPaths();
		const pathData = staticPaths.find((p) => p.name === character.path);
		const pathUnlockLevel = pathData
			? getStaticPathUnlockLevel(pathData)
			: null;
		if (pathData && pathUnlockLevel === 1) {
			const pathFeaturesAtLevel = (pathData.features ?? []).filter(
				(f: { level: number }) => f.level === level,
			);
			for (const feature of pathFeaturesAtLevel) {
				if (existingNames.has(feature.name)) continue;
				const modifiers = getPathFeatureModifiers(
					jobName,
					pathData.name,
					feature.name,
					level,
				);
				await insertCharacterFeature(characterId, {
					name: feature.name,
					source: `Path Feature: ${pathData.name}`,
					level_acquired: level,
					description: feature.description,
					is_active: true,
					modifiers: modifiers.length > 0 ? (modifiers as never) : null,
				});
			}
		}
	}

	// Regent benefits
	const { data: regentChoices } = await supabase
		.from("character_regents")
		.select("regent_id")
		.eq("character_id", characterId);
	if (regentChoices && regentChoices.length > 0) {
		const { regents: staticRegents } = await import(
			"@/data/compendium/regents"
		);
		for (const choice of regentChoices as Array<{ regent_id: string }>) {
			const regentData = staticRegents.find((r) => r.id === choice.regent_id);
			if (regentData) {
				const regentFeaturesAtLevel = (regentData.class_features || []).filter(
					(f) => f.level === level,
				);
				for (const feature of regentFeaturesAtLevel) {
					if (existingNames.has(feature.name)) continue;
					const modifiers = getRegentFeatureModifiers(
						regentData.name,
						feature.name,
						level,
					);
					await insertCharacterFeature(characterId, {
						name: feature.name,
						source: `Regent Feature: ${regentData.name}`,
						level_acquired: level,
						description: feature.description,
						is_active: true,
						modifiers: modifiers.length > 0 ? (modifiers as Json) : null,
					});
				}
			}
		}
	}

	if (level === 1 && isStaticJob(job)) {
		for (const trait of job.jobTraits || []) {
			if (existingNames.has(trait.name)) continue;

			const modifiers = getJobTraitModifiers(jobName, trait.name);
			const isActiveByDefault = trait.type !== "active";
			await insertCharacterFeature(characterId, {
				name: trait.name,
				source: `Job Trait: ${jobName}`,
				level_acquired: 1,
				description: trait.description,
				is_active: isActiveByDefault,
				modifiers: modifiers.length > 0 ? (modifiers as Json) : null,
			});
		}
	}
}

/**
 * Add level 1 features from job to character
 */
export async function addLevel1Features(
	characterId: string,
	job: JobReference,
	background: StaticBackground | null | undefined,
): Promise<void> {
	const jobName = typeof job === "string" ? job : job?.name;
	if (!jobName || !background) {
		console.warn("Cannot add level 1 features: job or background missing");
		return;
	}
	const campaignId = await getCharacterCampaignId(characterId);

	// Get level 1 job features
	const { data: jobFeatures } = await supabase
		.from("compendium_job_features")
		.select("*")
		.eq("job_id", typeof job !== "string" && job ? job.id : "")
		.eq("level", 1)
		.eq("is_path_feature", false);

	const accessibleJobFeatures = await filterRowsBySourcebookAccess(
		jobFeatures || [],
		(feature) => feature.source_name,
		{ campaignId },
	);

	if (accessibleJobFeatures.length > 0) {
		for (const feature of accessibleJobFeatures) {
			const usesMax = calculateFeatureUses(feature.uses_formula, 1, 2);

			if (isLocalCharacterId(characterId)) {
				addLocalFeature(characterId, {
					name: feature.name,
					source: "Job: Level 1",
					level_acquired: 1,
					description: feature.description,
					action_type: feature.action_type || null,
					uses_max: usesMax,
					uses_current: usesMax,
					recharge: feature.recharge || null,
					is_active: true,
				});
			} else {
				await supabase.from("character_features").insert({
					character_id: characterId,
					name: feature.name,
					source: "Job: Level 1",
					level_acquired: 1,
					description: feature.description,
					action_type: feature.action_type || null,
					uses_max: usesMax,
					uses_current: usesMax,
					recharge: feature.recharge || null,
					is_active: true,
				});
			}
		}
	} else {
		// Static fallback: if DB had no features, use static classFeatures
		if (isStaticJob(job) && job.classFeatures) {
			const level1Features = job.classFeatures.filter((cf) => cf.level === 1);
			for (const cf of level1Features) {
				if (isLocalCharacterId(characterId)) {
					addLocalFeature(characterId, {
						name: cf.name,
						source: "Job: Level 1",
						level_acquired: 1,
						description: cf.description,
						action_type: null,
						uses_max: null,
						uses_current: null,
						recharge: null,
						is_active: true,
					});
				} else {
					await supabase.from("character_features").insert({
						character_id: characterId,
						name: cf.name,
						source: "Job: Level 1",
						level_acquired: 1,
						description: cf.description,
						action_type: null,
						uses_max: null,
						uses_current: null,
						recharge: null,
						is_active: true,
					});
				}
			}
		}
	}
}

/**
 * Add background proficiencies and features
 */
export async function addBackgroundFeatures(
	characterId: string,
	background: StaticBackground,
): Promise<void> {
	// Add background feature if any
	if (background.feature_name) {
		if (isLocalCharacterId(characterId)) {
			addLocalFeature(characterId, {
				name: background.feature_name,
				source: `Background: ${background.name}`,
				level_acquired: 1,
				description:
					background.feature_description ||
					`Background feature: ${background.feature_name}`,
				is_active: true,
			});
		} else {
			await supabase.from("character_features").insert({
				character_id: characterId,
				name: background.feature_name,
				source: `Background: ${background.name}`,
				level_acquired: 1,
				description:
					background.feature_description ||
					`Background feature: ${background.feature_name}`,
				is_active: true,
			});
		}
	}
}

/**
 * Add starting equipment from job and background
 */
function normalizeToStaticItem(entry: StaticItem): StaticItem {
	return {
		...entry,
		rarity: (["common", "uncommon", "rare", "epic", "legendary"].includes(
			entry.rarity as string,
		)
			? entry.rarity
			: "common") as StaticItem["rarity"],
	} as StaticItem;
}

function mapToDbRarity(
	rarity: string | null | undefined,
): "common" | "uncommon" | "rare" | "very_rare" | "legendary" | null {
	if (!rarity) return null;
	if (rarity === "epic") return "very_rare";
	const valid = [
		"common",
		"uncommon",
		"rare",
		"very_rare",
		"legendary",
	] as const;
	type DbRarity = (typeof valid)[number];
	if ((valid as readonly string[]).includes(rarity)) return rarity as DbRarity;
	return "common";
}

export async function addStartingEquipment(
	character_id: string,
	job: JobReference, // Standardized
	background: StaticBackground | null | undefined,
	_skill_choices: string[],
	equipment_choices: Record<number, string>,
): Promise<void> {
	const jobName = typeof job === "string" ? job : job?.name;
	if (!jobName || !background) {
		console.warn("Cannot add starting equipment: job or background missing");
		return;
	}
	const characterId = character_id;
	const equipmentChoices = equipment_choices;
	const campaignId = await getCharacterCampaignId(characterId);

	// Add job starting equipment from static data
	if (isStaticJob(job) && job.startingEquipment) {
		for (
			let groupIndex = 0;
			groupIndex < job.startingEquipment.length;
			groupIndex++
		) {
			const equipmentGroup = job.startingEquipment[groupIndex];
			// Use player's choice if provided, otherwise default to first option
			const itemName = equipmentChoices?.[groupIndex] ?? equipmentGroup[0];
			if (!itemName) continue;

			// Look up item in static compendium for proper metadata
			const compendiumItem = findStaticItemByName(itemName);
			const normalizedItem = compendiumItem
				? normalizeToStaticItem(compendiumItem)
				: null;
			const itemType = normalizedItem ? deriveItemType(normalizedItem) : "gear";
			// Auto-equip armor, shields, and weapons so new characters start ready
			const shouldAutoEquip = ["armor", "shield", "weapon"].includes(itemType);
			const equipData = normalizedItem
				? {
						name: normalizedItem.name,
						item_type: itemType,
						weight:
							typeof normalizedItem.weight === "string"
								? parseFloat(normalizedItem.weight) || 0
								: (normalizedItem.weight ?? null),
						description: normalizedItem.description ?? null,
						properties: buildItemProperties(normalizedItem),
						rarity: mapToDbRarity(normalizedItem.rarity),
						quantity: 1,
						is_equipped: shouldAutoEquip,
						sigil_slots_base: normalizedItem
							? getDefaultSigilSlotsBaseForEquipment({
									item_type: itemType,
									properties: buildItemProperties(normalizedItem),
									name: normalizedItem.name,
									rarity: mapToDbRarity(normalizedItem.rarity),
								})
							: 1,
					}
				: {
						name: itemName,
						item_type: "gear",
						quantity: 1,
						is_equipped: false,
						sigil_slots_base: 1,
					};

			if (isLocalCharacterId(characterId)) {
				addLocalEquipment(characterId, equipData);
			} else {
				await supabase.from("character_equipment").insert({
					character_id: characterId,
					...equipData,
				});
			}
		}
	}

	// Add background starting equipment (DB field)
	if (
		background?.starting_equipment &&
		background.starting_equipment.length > 0
	) {
		const equipmentItems = background.starting_equipment;

		for (const itemName of equipmentItems) {
			const { data: equipment } = await supabase
				.from("compendium_equipment")
				.select("*")
				.ilike("name", `%${itemName}%`)
				.limit(1)
				.maybeSingle();

			if (
				equipment &&
				(await isSourcebookAccessible(equipment.source_book, { campaignId }))
			) {
				if (isLocalCharacterId(characterId)) {
					addLocalEquipment(characterId, {
						name: equipment.name,
						item_type: equipment.equipment_type || "gear",
						description: equipment.description || null,
						properties: equipment.properties || [],
						weight: equipment.weight || null,
						quantity: 1,
						is_equipped: false,
						sigil_slots_base: getDefaultSigilSlotsBaseForEquipment({
							item_type: equipment.equipment_type || "gear",
							properties: equipment.properties || [],
							name: equipment.name,
							rarity: equipment.rarity ?? null,
						}),
					});
				} else {
					await supabase.from("character_equipment").insert({
						character_id: characterId,
						name: equipment.name,
						item_type: equipment.equipment_type || "gear",
						description: equipment.description || null,
						properties: equipment.properties || [],
						weight: equipment.weight || null,
						quantity: 1,
						is_equipped: false,
						sigil_slots_base: getDefaultSigilSlotsBaseForEquipment({
							item_type: equipment.equipment_type || "gear",
							properties: equipment.properties || [],
							name: equipment.name,
							rarity: mapToDbRarity(equipment.rarity),
						}),
					});
				}
			} else {
				const item = findStaticItemByName(itemName);
				if (item) {
					// Use formal normalization for the builder
					const normalizedItem = normalizeToStaticItem(item);
					const itemProps = buildItemProperties(normalizedItem);
					const itemType = deriveItemType(normalizedItem);

					if (isLocalCharacterId(characterId)) {
						addLocalEquipment(characterId, {
							name: item.name,
							item_type: itemType,
							description: item.description || null,
							properties: itemProps,
							weight:
								typeof item.weight === "string"
									? parseFloat(item.weight) || 0
									: item.weight || null,
							quantity: 1,
							is_equipped: false,
							sigil_slots_base: getDefaultSigilSlotsBaseForEquipment({
								item_type: itemType,
								properties: itemProps,
								name: item.name,
								rarity: item.rarity,
							}),
						});
					} else {
						await supabase.from("character_equipment").insert({
							character_id: characterId,
							name: item.name,
							item_type: itemType,
							description: item.description || null,
							properties: itemProps,
							weight:
								typeof item.weight === "string"
									? parseFloat(item.weight) || 0
									: item.weight || null,
							quantity: 1,
							is_equipped: false,
							sigil_slots_base: getDefaultSigilSlotsBaseForEquipment({
								item_type: itemType,
								properties: itemProps,
								name: item.name,
								rarity: item.rarity,
							}),
						});
					}
				}
			}
		}
	}
}

/**
 * Add starting powers from job
 */
export async function addStartingPowers(
	characterId: string,
	job: JobReference,
): Promise<void> {
	if (!job) {
		console.warn("Cannot add starting powers: job missing");
		return;
	}
	const jobName = typeof job === "string" ? job : job?.name;
	const campaignId = await getCharacterCampaignId(characterId);

	const maxPowerLevel = getMaxPowerLevelForJobAtLevel(job, 1);

	// Get powers available to this job at level 1
	const { data: powers } = await supabase
		.from("compendium_powers")
		.select("*")
		.contains("job_names", [jobName])
		.lte("power_level", maxPowerLevel); // 5e-accurate max spell level (includes cantrips at 0)

	const accessiblePowers = await filterRowsBySourcebookAccess(
		powers || [],
		(power) => power.source_book,
		{ campaignId },
	);

	if (accessiblePowers.length > 0) {
		for (const power of accessiblePowers) {
			if (isLocalCharacterId(characterId)) {
				addLocalPower(characterId, {
					name: power.name,
					power_level: power.power_level,
					source: `Job: ${jobName}`,
					casting_time: power.casting_time || null,
					range: power.range || null,
					duration: power.duration || null,
					concentration: power.concentration || false,
					description: power.description || null,
					higher_levels: power.higher_levels || null,
					is_prepared: power.power_level === 0, // Auto-prepare cantrips
					is_known: true,
				});
			} else {
				await supabase.from("character_powers").insert({
					character_id: characterId,
					name: power.name,
					power_level: power.power_level,
					source: `Job: ${jobName}`,
					casting_time: power.casting_time || null,
					range: power.range || null,
					duration: power.duration || null,
					concentration: power.concentration || false,
					description: power.description || null,
					higher_levels: power.higher_levels || null,
					is_prepared: power.power_level === 0,
					is_known: true,
				});
			}
		}
	}
}
