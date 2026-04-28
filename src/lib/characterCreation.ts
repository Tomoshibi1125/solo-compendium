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
	addLocalSpell,
	isLocalCharacterId,
	listLocalFeatures,
	listLocalSpells,
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

/**
 * Get the engine-facing modifiers for a job's racial trait (the "race" half of
 * the race+class fused job). Unlike `getJobTraitModifiers` (class-layer traits),
 * these encode the lineage/physiology grants at Awakening: AC bumps, save
 * advantages/bonuses, racial skill proficiencies, resistances, and the like.
 * New traits authored in `jobs.ts` should be mirrored here.
 */
export function getRacialTraitModifiers(
	jobName: string,
	traitName: string,
): FeatureModifier[] {
	const job = jobName.trim().toLowerCase();
	const trait = traitName.trim().toLowerCase();

	// 1. DESTROYER — crystalline gate-frame lineage (Fighter analog).
	if (job === "destroyer") {
		if (trait === "crystalline bone density") {
			return [
				{
					type: "advantage",
					value: 0,
					target: "STR_saves:prone",
					source: traitName,
				},
				{
					type: "skill_prof",
					value: 0,
					target: "Athletics",
					source: traitName,
				},
			];
		}
		if (trait === "kinetic battery") {
			return [
				{
					type: "damage_reflect",
					value: 0,
					target: "bludgeoning|force",
					source: traitName,
				},
			];
		}
	}

	// 2. BERSERKER — thermal-vent mana physiology (Barbarian analog).
	if (job === "berserker") {
		if (trait === "thermal venting") {
			return [
				{
					type: "reactive_damage",
					value: 6,
					target: "fire",
					source: traitName,
				},
			];
		}
		if (trait === "mana-saturated metabolism") {
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
		if (trait === "volatile resonance aura") {
			return [
				{
					type: "skill_prof",
					value: 0,
					target: "Intimidation",
					source: traitName,
				},
			];
		}
	}

	// 3. ASSASSIN — partial-dimensional umbral lineage (Rogue analog).
	if (job === "assassin") {
		if (trait === "partial dimensional existence") {
			return [
				{ type: "skill_prof", value: 0, target: "Stealth", source: traitName },
				{
					type: "tool_prof",
					value: 0,
					target: "Thieves' Tools",
					source: traitName,
				},
			];
		}
		if (trait === "apex sensory array") {
			return [
				{ type: "darkvision", value: 120, target: "range", source: traitName },
				{
					type: "advantage",
					value: 0,
					target: "AGI_saves:sound",
					source: traitName,
				},
			];
		}
	}

	// 4. STRIKER — hyper-twitch kinetic lineage (Monk analog).
	if (job === "striker") {
		if (trait === "hyper-twitch fibers") {
			return [
				{ type: "speed", value: 10, target: "walking", source: traitName },
				{
					type: "skill_prof",
					value: 0,
					target: "Acrobatics",
					source: traitName,
				},
			];
		}
		if (trait === "adrenaline synthesizer") {
			return [
				{
					type: "initiative_bonus",
					value: 0,
					target: "prof",
					source: traitName,
				},
				{
					type: "advantage",
					value: 0,
					target: "save:paralyzed|restrained",
					source: traitName,
				},
			];
		}
	}

	// 5. MAGE — aetheric-cortex lineage (Wizard analog).
	if (job === "mage") {
		if (trait === "mana-bleed dependency") {
			return [
				{ type: "healing_max", value: 0, target: "self", source: traitName },
				{
					type: "disadvantage",
					value: 0,
					target: "save:psychic",
					source: traitName,
				},
			];
		}
		if (trait === "aetheric resonance shield") {
			return [
				{
					type: "advantage",
					value: 0,
					target: "INT_saves:magic",
					source: traitName,
				},
			];
		}
		if (trait === "arcane optic mutation") {
			return [
				{ type: "skill_prof", value: 0, target: "Arcana", source: traitName },
				{
					type: "see_invisible",
					value: 30,
					target: "range",
					source: traitName,
				},
			];
		}
	}

	// 6. ESPER — neural-overclock psionic lineage (Sorcerer analog).
	if (job === "esper") {
		if (trait === "neural overclocking") {
			return [
				{
					type: "advantage",
					value: 0,
					target: "INT_saves",
					source: traitName,
				},
				{ type: "skill_prof", value: 0, target: "Insight", source: traitName },
				{
					type: "immunity",
					value: 0,
					target: "surprised",
					source: traitName,
				},
			];
		}
	}

	// 7. REVENANT — death-scarred undying lineage (Necromancer analog).
	if (job === "revenant") {
		if (trait === "death-scarred physiology") {
			return [
				{
					type: "advantage",
					value: 0,
					target: "save:poison",
					source: traitName,
				},
				{
					type: "immunity",
					value: 0,
					target: "disease",
					source: traitName,
				},
				{ type: "skill_prof", value: 0, target: "Medicine", source: traitName },
			];
		}
	}

	// 8. SUMMONER — biome-bonded anchor lineage (Druid analog).
	if (job === "summoner") {
		if (trait === "aetheric anchor") {
			return [
				{ type: "skill_prof", value: 0, target: "Nature", source: traitName },
			];
		}
		if (trait === "summoner's ward") {
			return [
				{
					type: "advantage",
					value: 0,
					target: "save:banishment|teleport",
					source: traitName,
				},
			];
		}
	}

	// 9. HERALD — signal-receiver sanctified antenna (Cleric analog).
	if (job === "herald") {
		if (trait === "mandate-receptive cortex") {
			return [
				{ type: "skill_prof", value: 0, target: "Religion", source: traitName },
				{
					type: "advantage",
					value: 0,
					target: "save:deafened",
					source: traitName,
				},
				{
					type: "immunity",
					value: 0,
					target: "silence",
					source: traitName,
				},
			];
		}
	}

	// 10. CONTRACTOR — pact-branded rift-vessel lineage (Warlock analog).
	if (job === "contractor") {
		if (trait === "pact brand physiology") {
			return [
				{
					type: "skill_prof",
					value: 0,
					target: "Deception",
					source: traitName,
				},
				{
					type: "advantage",
					value: 0,
					target: "save:charm:non_patron",
					source: traitName,
				},
			];
		}
	}

	// 11. STALKER — predator-optimized rift-tracker lineage (Ranger analog).
	if (job === "stalker") {
		if (trait === "predator-optimized physiology") {
			return [
				{ type: "speed", value: 5, target: "walking", source: traitName },
				{
					type: "skill_prof",
					value: 0,
					target: "Athletics",
					source: traitName,
				},
			];
		}
		if (trait === "rift resonance sense") {
			return [
				{
					type: "skill_prof",
					value: 0,
					target: "Survival",
					source: traitName,
				},
				{
					type: "gate_detect",
					value: 5280,
					target: "range_ft",
					source: traitName,
				},
			];
		}
	}

	// 12. HOLY KNIGHT — radiant-scaled covenant lineage (Paladin analog).
	if (job === "holy-knight" || job === "holy knight") {
		if (trait === "radiant scales") {
			return [
				{
					type: "advantage",
					value: 0,
					target: "save:blinded",
					source: traitName,
				},
				{
					type: "crit_mitigation",
					value: 1,
					target: "per_long_rest",
					source: traitName,
				},
			];
		}
		if (trait === "aura of command") {
			return [
				{ type: "skill_prof", value: 0, target: "History", source: traitName },
				{
					type: "advantage",
					value: 0,
					target: "skill:Persuasion|Intimidation:lower_ranked",
					source: traitName,
				},
			];
		}
	}

	// 13. TECHNOMANCER — cyber-mana alloyed lineage (Artificer analog).
	if (job === "technomancer") {
		if (trait === "cyber-mana integration") {
			return [
				{
					type: "advantage",
					value: 0,
					target: "INT_saves",
					source: traitName,
				},
				{
					type: "skill_prof",
					value: 0,
					target: "Investigation",
					source: traitName,
				},
			];
		}
		if (trait === "metallic dermis") {
			return [
				{
					type: "advantage",
					value: 0,
					target: "save:poisoned",
					source: traitName,
				},
			];
		}
	}

	// 14. IDOL — harmonic-frequency resonance lineage (Bard analog).
	if (job === "idol") {
		if (trait === "harmonic frequency physiology") {
			return [
				{
					type: "skill_prof",
					value: 0,
					target: "Performance",
					source: traitName,
				},
				{
					type: "advantage",
					value: 0,
					target: "skill:Persuasion|Performance",
					source: traitName,
				},
			];
		}
		if (trait === "dissonance immunity") {
			return [
				{
					type: "advantage",
					value: 0,
					target: "save:frightened|charmed",
					source: traitName,
				},
				{
					type: "immunity",
					value: 0,
					target: "magical_sleep",
					source: traitName,
				},
				{
					type: "immunity",
					value: 0,
					target: "silence",
					source: traitName,
				},
			];
		}
	}

	return [];
}

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

	// Add climb/swim/fly speed entries into senses so they display on the
	// sheet until dedicated columns exist.
	if (typeof job.climb_speed === "number" && job.climb_speed > 0) {
		jobSenses.push(`Climb speed ${job.climb_speed} ft.`);
	}
	if (typeof job.swim_speed === "number" && job.swim_speed > 0) {
		jobSenses.push(`Swim speed ${job.swim_speed} ft.`);
	}
	if (typeof job.fly_speed === "number" && job.fly_speed > 0) {
		jobSenses.push(`Fly speed ${job.fly_speed} ft.`);
	}

	// Racial saving throw proficiencies (jobs are race+class fused, so the
	// job's saving_throws are the character's save profs).
	const asiSystemAbilityMap: Record<string, string> = {
		strength: "STR",
		agility: "AGI",
		vitality: "VIT",
		intelligence: "INT",
		sense: "SENSE",
		presence: "PRE",
	};
	const jobSaves = dedupe(
		(job.saving_throws ?? []).map(
			(s) => asiSystemAbilityMap[String(s).toLowerCase()] ?? String(s),
		),
	);

	const jobWeaponProfs = dedupe(
		job.weapon_proficiencies,
		job.weaponProficiencies,
	);
	const jobArmorProfs = dedupe(job.armor_proficiencies, job.armorProficiencies);
	const jobToolProfs = dedupe(job.tool_proficiencies, job.toolProficiencies);

	// Merged languages for future Phase 4 column; kept here so guests see them
	// in whatever shape local storage supports.
	const mergedLanguages = dedupe(job.languages, selectedLanguages);

	// Compute ASI delta (idempotent — applied once per character-job pair via
	// a hidden marker feature).
	const jobName = job.name;
	const asiApplyKey = `Racial ASI: ${jobName}`;
	const asiEntries: Array<{
		db: "str" | "agi" | "vit" | "int" | "sense" | "pre";
		delta: number;
	}> = [];
	if (
		job.abilityScoreImprovements &&
		!Array.isArray(job.abilityScoreImprovements)
	) {
		const rawASI = job.abilityScoreImprovements as Record<string, number>;
		const map: Record<string, "str" | "agi" | "vit" | "int" | "sense" | "pre"> =
			{
				strength: "str",
				agility: "agi",
				vitality: "vit",
				intelligence: "int",
				sense: "sense",
				presence: "pre",
			};
		for (const [key, value] of Object.entries(rawASI)) {
			const col = map[key.toLowerCase()];
			if (col && typeof value === "number" && value !== 0) {
				asiEntries.push({ db: col, delta: value });
			}
		}
	}

	// Load existing arrays so we merge instead of overwrite. For guest/local
	// characters this goes through updateLocalCharacter; for Supabase we read
	// the current row and write back a merged update.
	if (isLocalCharacterId(characterId)) {
		const {
			getLocalCharacterWithAbilities,
			updateLocalCharacter,
			listLocalFeatures,
		} = await import("@/lib/guestStore");
		const existing = getLocalCharacterWithAbilities(characterId);
		if (!existing) return;

		// Idempotent ASI apply (guest): track via a marker feature.
		const existingFeatures = listLocalFeatures(characterId);
		const asiAlreadyApplied = existingFeatures.some(
			(f) =>
				(f?.source ?? "") === asiApplyKey || (f?.name ?? "") === asiApplyKey,
		);
		const statsPatch: Record<string, number> = {};
		if (!asiAlreadyApplied) {
			for (const { db, delta } of asiEntries) {
				const current =
					(existing as unknown as Record<string, number | null | undefined>)[
						db
					] ?? 0;
				statsPatch[db] = Number(current) + delta;
			}
		}

		const existingLanguages =
			(existing as unknown as { languages?: string[] | null }).languages ??
			null;

		updateLocalCharacter(characterId, {
			senses: dedupe(existing.senses, jobSenses),
			resistances: dedupe(existing.resistances, jobResistances),
			immunities: dedupe(existing.immunities, jobImmunities),
			condition_immunities: dedupe(
				existing.condition_immunities,
				jobConditionImmunities,
			),
			speed: Math.max(existing.speed ?? 30, job.speed ?? 30),
			saving_throw_proficiencies: dedupe(
				existing.saving_throw_proficiencies,
				jobSaves,
			) as never,
			weapon_proficiencies: dedupe(
				existing.weapon_proficiencies,
				jobWeaponProfs,
			),
			armor_proficiencies: dedupe(existing.armor_proficiencies, jobArmorProfs),
			tool_proficiencies: dedupe(existing.tool_proficiencies, jobToolProfs),
			languages: dedupe(existingLanguages, mergedLanguages),
			...statsPatch,
		} as never);

		if (!asiAlreadyApplied && asiEntries.length > 0) {
			addLocalFeature(characterId, {
				name: asiApplyKey,
				source: asiApplyKey,
				level_acquired: 1,
				description: `Racial ASI applied: ${asiEntries
					.map((e) => `${e.db.toUpperCase()} +${e.delta}`)
					.join(", ")}.`,
				action_type: null,
				uses_max: null,
				uses_current: null,
				recharge: null,
				is_active: false,
			});
		}
		return;
	}

	const { data: existing, error: readErr } = await supabase
		.from("characters")
		.select(
			"senses, resistances, immunities, condition_immunities, vulnerabilities, speed, saving_throw_proficiencies, weapon_proficiencies, armor_proficiencies, tool_proficiencies, languages, str, agi, vit, int, sense, pre",
		)
		.eq("id", characterId)
		.single();
	if (readErr || !existing) return;

	// Idempotent ASI apply (supabase): check marker feature.
	const { data: asiMarkerRows } = await supabase
		.from("character_features")
		.select("id")
		.eq("character_id", characterId)
		.eq("source", asiApplyKey)
		.limit(1);
	const asiAlreadyApplied = !!(asiMarkerRows && asiMarkerRows.length > 0);
	const statsPatch: Record<string, number> = {};
	if (!asiAlreadyApplied) {
		for (const { db, delta } of asiEntries) {
			const current =
				(existing as unknown as Record<string, number | null | undefined>)[
					db
				] ?? 0;
			statsPatch[db] = Number(current) + delta;
		}
	}

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
			speed: Math.max(existing.speed ?? 30, job.speed ?? 30),
			saving_throw_proficiencies: dedupe(
				existing.saving_throw_proficiencies as string[] | null,
				jobSaves,
			) as Database["public"]["Enums"]["ability_score"][],
			weapon_proficiencies: dedupe(
				existing.weapon_proficiencies,
				jobWeaponProfs,
			),
			armor_proficiencies: dedupe(existing.armor_proficiencies, jobArmorProfs),
			tool_proficiencies: dedupe(existing.tool_proficiencies, jobToolProfs),
			languages: dedupe(
				(existing as { languages?: string[] | null }).languages,
				mergedLanguages,
			),
			// Vulnerabilities intentionally not job-granted today; preserved as-is.
			...statsPatch,
		})
		.eq("id", characterId);
	if (writeErr) {
		console.warn(
			"applyJobAwakeningTraitsToCharacter: failed to persist job traits",
			writeErr,
		);
	}

	if (!asiAlreadyApplied && asiEntries.length > 0) {
		await supabase.from("character_features").insert({
			character_id: characterId,
			name: asiApplyKey,
			source: asiApplyKey,
			level_acquired: 1,
			description: `Racial ASI applied: ${asiEntries
				.map((e) => `${e.db.toUpperCase()} +${e.delta}`)
				.join(", ")}.`,
			is_active: false,
		});
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

	// Canonical static awakening features at the target level.
	if (isStaticJob(job) && job.awakeningFeatures) {
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

		// Racial traits — the "race" half of the race+class fused job.
		// Each becomes a character feature at level 1 with engine modifiers.
		for (const trait of job.racialTraits || []) {
			if (existingNames.has(trait.name)) continue;

			const modifiers = getRacialTraitModifiers(jobName, trait.name);
			await insertCharacterFeature(characterId, {
				name: trait.name,
				source: `Racial Trait: ${jobName}`,
				level_acquired: 1,
				description: trait.description,
				is_active: true,
				modifiers: modifiers.length > 0 ? (modifiers as Json) : null,
			});
		}

		// Natural weapons (Gate-Crystal Fists, Hyper-Cadence Strikes, Necrotic Grasp, etc).
		// Each becomes a read-only feature describing the innate unarmed attack.
		for (const nw of job.naturalWeapons || []) {
			const featureName = `Natural Weapon: ${nw.name}`;
			if (existingNames.has(featureName)) continue;
			await insertCharacterFeature(characterId, {
				name: featureName,
				source: `Racial Trait: ${jobName}`,
				level_acquired: 1,
				description:
					nw.description ?? `${nw.damage} ${nw.damage_type} (natural weapon)`,
				is_active: true,
				modifiers: [
					{
						type: "natural_weapon",
						target: nw.damage_type,
						value: nw.damage,
						source: nw.name,
					},
				] as unknown as Json,
			});
		}

		// Natural armor (Metallic Dermis — base AC 13 + INT mod, etc.).
		if (job.naturalArmor) {
			const featureName = `Natural Armor`;
			if (!existingNames.has(featureName)) {
				const na = job.naturalArmor;
				await insertCharacterFeature(characterId, {
					name: featureName,
					source: `Racial Trait: ${jobName}`,
					level_acquired: 1,
					description:
						na.description ??
						`Base AC = ${na.baseAC}${na.abilityMod ? ` + ${na.abilityMod} mod` : ""}${na.addDex ? " + Dex mod" : ""}.`,
					is_active: true,
					modifiers: [
						{
							type: "ac_base",
							value: na.baseAC,
							target: na.addDex ? "with_dex" : "no_dex",
							source: "Natural Armor",
							// `abilityMod` stored on the modifier so the AC engine can
							// add the right ability modifier (e.g. Technomancer INT).
							...(na.abilityMod ? { ability_mod: na.abilityMod } : {}),
						},
					] as unknown as Json,
				});
			}
		}

		// Resonance breath (thermal vent / judgment ray / resonant pulse).
		if (job.resonanceBreath) {
			const rb = job.resonanceBreath;
			const featureName = `Resonance Breath: ${rb.name}`;
			if (!existingNames.has(featureName)) {
				await insertCharacterFeature(characterId, {
					name: featureName,
					source: `Racial Trait: ${jobName}`,
					level_acquired: 1,
					description: `${rb.size}-ft ${rb.shape} of ${rb.damage_type}. ${rb.save} save for half. ${rb.damage_die} damage (scaling with level). Recharges on a ${rb.rechargeRest}.`,
					is_active: true,
					modifiers: [
						{
							type: "resonance_breath",
							target: rb.damage_type,
							value: rb.damage_die,
							source: rb.name,
						},
					] as unknown as Json,
				});
			}
		}

		// Bonus HP per level (Destroyer crystalline frame — +1 HP per level).
		if (typeof job.bonusHpPerLevel === "number" && job.bonusHpPerLevel > 0) {
			const featureName = `Reinforced Constitution`;
			if (!existingNames.has(featureName)) {
				await insertCharacterFeature(characterId, {
					name: featureName,
					source: `Racial Trait: ${jobName}`,
					level_acquired: 1,
					description: `Your reinforced physiology grants +${job.bonusHpPerLevel} HP per character level.`,
					is_active: true,
					modifiers: [
						{
							type: "hp-max",
							value: job.bonusHpPerLevel,
							target: "per_level",
							source: featureName,
						},
					] as unknown as Json,
				});
			}
		}
	}

	// Innate channeling spells unlocking at this level.
	if (isStaticJob(job) && job.innateChanneling) {
		await addInnateChannelingForLevel(characterId, job, level);
	}
}

/**
 * Insert any innate channeling spells (RA racial spellcasting) that unlock at
 * the given level into the character's spell list. Idempotent: re-running at
 * the same level skips spells already present.
 */
export async function addInnateChannelingForLevel(
	characterId: string,
	job: StaticJob,
	level: number,
): Promise<void> {
	const channeling = job.innateChanneling;
	if (!channeling) return;

	const jobName = job.name;
	const unlocked = (channeling.spells ?? []).filter(
		(s) => s.unlockLevel === level,
	);
	if (unlocked.length === 0) return;

	for (const spell of unlocked) {
		const sourceLabel = `Racial Channeling: ${jobName}`;
		const { findCanonicalCastableByName } = await import(
			"@/lib/canonicalCompendium"
		);
		const canonicalSpell = await findCanonicalCastableByName(
			spell.name,
			undefined,
			["spells"],
		);
		const usesMax =
			spell.uses && spell.uses !== "at-will" ? spell.uses.value : null;
		const usesCurrent = usesMax;
		const recharge =
			spell.uses && spell.uses !== "at-will"
				? spell.uses.per
				: spell.uses === "at-will"
					? "at-will"
					: null;

		if (isLocalCharacterId(characterId)) {
			const existingSpells = listLocalSpells(characterId);
			if (
				existingSpells.some(
					(p) => p?.name === spell.name && p?.source === sourceLabel,
				)
			)
				continue;
			addLocalSpell(characterId, {
				spell_id: canonicalSpell?.id ?? null,
				name: spell.name,
				source: sourceLabel,
				spell_level: spell.level,
				is_prepared: true,
				is_known: true,
				counts_against_limit: false,
				description: spell.description ?? canonicalSpell?.description ?? null,
				higher_levels: canonicalSpell?.higher_levels ?? null,
				casting_time: canonicalSpell?.casting_time ?? null,
				range: canonicalSpell?.range ?? null,
				duration: canonicalSpell?.duration ?? null,
				concentration: canonicalSpell?.concentration ?? false,
				ritual: canonicalSpell?.ritual ?? false,
				recharge,
				uses_max: usesMax,
				uses_current: usesCurrent,
			});
			continue;
		}

		const { data: existingSpells } = await supabase
			.from("character_spells")
			.select("id, name, source")
			.eq("character_id", characterId)
			.eq("name", spell.name)
			.eq("source", sourceLabel)
			.limit(1);
		if (existingSpells && existingSpells.length > 0) continue;

		await supabase.from("character_spells").insert({
			character_id: characterId,
			spell_id: canonicalSpell?.id ?? null,
			name: spell.name,
			source: sourceLabel,
			spell_level: spell.level,
			is_prepared: true,
			is_known: true,
			counts_against_limit: false,
			description: spell.description ?? canonicalSpell?.description ?? null,
			higher_levels: canonicalSpell?.higher_levels ?? null,
			casting_time: canonicalSpell?.casting_time ?? null,
			range: canonicalSpell?.range ?? null,
			duration: canonicalSpell?.duration ?? null,
			concentration: canonicalSpell?.concentration ?? false,
			ritual: canonicalSpell?.ritual ?? false,
			recharge,
			uses_max: usesMax,
			uses_current: usesCurrent,
		});
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

	// Canonical static classFeatures at level 1.
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

	const backgroundEquipment =
		background?.starting_equipment && background.starting_equipment.length > 0
			? background.starting_equipment
			: background?.equipment;

	// Add background starting equipment from canonical static compendium.
	if (backgroundEquipment && backgroundEquipment.length > 0) {
		const equipmentItems = backgroundEquipment;

		for (const itemName of equipmentItems) {
			const item = findStaticItemByName(itemName);
			if (!item) continue;

			// Respect sourcebook entitlements for the canonical item.
			if (!(await isSourcebookAccessible(item.source_book, { campaignId }))) {
				continue;
			}

			const normalizedItem = normalizeToStaticItem(item);
			const itemProps = buildItemProperties(normalizedItem);
			const itemType = deriveItemType(normalizedItem);
			const weightValue =
				typeof normalizedItem.weight === "string"
					? parseFloat(normalizedItem.weight) || 0
					: (normalizedItem.weight ?? null);

			if (isLocalCharacterId(characterId)) {
				addLocalEquipment(characterId, {
					name: normalizedItem.name,
					item_type: itemType,
					description: normalizedItem.description || null,
					properties: itemProps,
					weight: weightValue,
					quantity: 1,
					is_equipped: false,
					sigil_slots_base: getDefaultSigilSlotsBaseForEquipment({
						item_type: itemType,
						properties: itemProps,
						name: normalizedItem.name,
						rarity: normalizedItem.rarity,
					}),
				});
			} else {
				await supabase.from("character_equipment").insert({
					character_id: characterId,
					name: normalizedItem.name,
					item_type: itemType,
					description: normalizedItem.description || null,
					properties: itemProps,
					weight: weightValue,
					quantity: 1,
					is_equipped: false,
					sigil_slots_base: getDefaultSigilSlotsBaseForEquipment({
						item_type: itemType,
						properties: itemProps,
						name: normalizedItem.name,
						rarity: mapToDbRarity(normalizedItem.rarity),
					}),
				});
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

	const { listLearnablePowers } = await import("@/lib/canonicalCompendium");
	const accessiblePowers = await listLearnablePowers({
		accessContext: { campaignId },
		jobName: jobName ?? null,
	});

	if (accessiblePowers.length > 0) {
		for (const power of accessiblePowers) {
			const powerLevel = power.power_level ?? power.level ?? 0;
			const castingTime = power.casting_time || null;
			const range = power.range || null;
			const duration = power.duration || null;
			const higherLevels = power.higher_levels ?? null;
			const source = `Job Power: ${jobName}`;

			if (isLocalCharacterId(characterId)) {
				addLocalPower(characterId, {
					name: power.name,
					power_level: powerLevel,
					source,
					casting_time: castingTime,
					range,
					duration,
					concentration: power.concentration ?? false,
					description: power.description || null,
					higher_levels: higherLevels,
					is_prepared: false,
					is_known: true,
				});
			} else {
				await supabase.from("character_powers").insert({
					character_id: characterId,
					name: power.name,
					power_level: powerLevel,
					source,
					casting_time: castingTime,
					range,
					duration,
					concentration: power.concentration ?? false,
					description: power.description || null,
					higher_levels: higherLevels,
					is_prepared: false,
					is_known: true,
				});
			}
		}
	}
}
