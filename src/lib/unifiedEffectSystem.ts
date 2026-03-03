/**
 * Unified Effect System
 *
 * Bridges the standalone FeatEffect / SpellEngineEffect types used in the
 * parity engine modules back into the canonical `characterEngine.Effect`
 * type. This module is the single integration point that normalises all
 * effect sources into the engine-consumable format.
 *
 * Priority layers:
 *   100 – Equipment modifiers
 *   150 – Racial/trait effects
 *   200 – Feat & fighting style effects
 *   300 – Active spell effects
 *   400 – Condition effects (override all)
 */

import type {
	Effect,
	EffectSource,
	EffectTarget,
	EffectType,
} from "./characterEngine";
import { parseModifiers } from "./equipmentModifiers";
import type { FeatEffect } from "./featEffectParser";
import type { SpellEngineEffect } from "./spellEffectPipeline";

// ─── Canonical EffectTarget expansions ──────────────────────
// Define the expanded target set that feat/spell modules produce.
// These are bridged into the narrower engine targets via `mapTarget`.

const TARGET_MAP: Record<string, EffectTarget> = {
	// Direct matches (already in EffectTarget union)
	ac: "ac",
	speed: "speed",
	initiative: "initiative",
	str: "str",
	agi: "agi",
	vit: "vit",
	int: "int",
	sense: "sense",
	pre: "pre",
	hp_max: "hp_max",
	hp_temp: "hp_current",
	spell_dc: "spell_dc",
	attack_bonus: "attack_bonus",
	damage_bonus: "damage_bonus",
	saving_throw: "saving_throw",
	saving_throws: "saving_throw",

	// Feat/spell expanded targets → closest engine target
	ranged_attack: "attack_bonus",
	melee_attack: "attack_bonus",
	melee_damage: "damage_bonus",
	ranged_damage: "damage_bonus",
	thrown_damage: "damage_bonus",
	offhand_damage: "damage_bonus",
	unarmed_damage: "damage_bonus",
	attack_rolls: "attack_bonus",
	ability_checks: "skill",
	damage: "damage_bonus",

	// Senses → closest
	blindsight: "advantage",
	passive_perception: "skill",
	passive_investigation: "skill",

	// Combat specials → roll tags
	concentration_save: "advantage",
	concentration_break: "advantage",
	opportunity_attack: "advantage",
	surprise_immunity: "advantage",
	damage_reroll: "reroll",
	damage_reduction: "hp_regen",

	// Spell-specific save targets
	str_save: "saving_throw",
	agi_save: "saving_throw",
	vit_save: "saving_throw",
	int_save: "saving_throw",
	sense_save: "saving_throw",
	pre_save: "saving_throw",

	// Resource targets
	luck_points: "feature_uses",
	ally_ac: "ac",
};

const TYPE_MAP: Record<string, EffectType> = {
	bonus: "modifier",
	penalty: "modifier",
	set: "modifier",
	advantage: "roll_tag",
	disadvantage: "roll_tag",
	modifier: "modifier",
	resource: "resource",
	validation: "validation",
	roll_tag: "roll_tag",
};

// ─── Bridge Functions ───────────────────────────────────────

function mapTarget(raw: string): EffectTarget {
	return TARGET_MAP[raw] ?? "skill"; // default to 'skill' for unknown targets
}

function mapType(raw: string): EffectType {
	return TYPE_MAP[raw] ?? "modifier";
}

/**
 * Convert a FeatEffect into a canonical Effect + EffectSource pair
 */
export function bridgeFeatEffect(feat: FeatEffect): {
	effect: Effect;
	source: EffectSource;
} {
	return {
		effect: {
			type: mapType(feat.type),
			target: mapTarget(feat.target),
			value: feat.value,
			condition: feat.description,
			priority: feat.priority,
		},
		source: {
			sourceType: "feat",
			sourceId: feat.source,
			sourceName: feat.source,
		},
	};
}

/**
 * Convert a SpellEngineEffect into a canonical Effect + EffectSource pair
 */
export function bridgeSpellEffect(spell: SpellEngineEffect): {
	effect: Effect;
	source: EffectSource;
} {
	return {
		effect: {
			type: mapType(spell.type),
			target: mapTarget(spell.target),
			value: spell.value,
			condition: spell.description,
			priority: spell.priority,
		},
		source: {
			sourceType: "condition", // Spell effects act like conditions in the engine
			sourceId: spell.source,
			sourceName: spell.source,
		},
	};
}

/**
 * Bridge equipment property strings → Effect[] via parseModifiers.
 * Equipment modifiers use priority 200 (typed equipment bonus bucket).
 */
export function bridgeEquipmentEffects(properties: string[]): Effect[] {
	const mods = parseModifiers(properties);
	const effects: Effect[] = [];
	const EQUIP_PRIORITY = 200;

	if (mods.ac)
		effects.push({
			type: "modifier",
			target: "ac",
			value: mods.ac,
			priority: EQUIP_PRIORITY,
		});
	if (mods.attack)
		effects.push({
			type: "modifier",
			target: "attack_bonus",
			value: mods.attack,
			priority: EQUIP_PRIORITY,
		});
	if (mods.damage)
		effects.push({
			type: "modifier",
			target: "damage_bonus",
			value: mods.damage,
			priority: EQUIP_PRIORITY,
		});
	if (mods.speed)
		effects.push({
			type: "modifier",
			target: "speed",
			value: mods.speed,
			priority: EQUIP_PRIORITY,
		});
	if (mods.str)
		effects.push({
			type: "modifier",
			target: "str",
			value: mods.str,
			priority: EQUIP_PRIORITY,
		});
	if (mods.agi)
		effects.push({
			type: "modifier",
			target: "agi",
			value: mods.agi,
			priority: EQUIP_PRIORITY,
		});
	if (mods.vit)
		effects.push({
			type: "modifier",
			target: "vit",
			value: mods.vit,
			priority: EQUIP_PRIORITY,
		});
	if (mods.int)
		effects.push({
			type: "modifier",
			target: "int",
			value: mods.int,
			priority: EQUIP_PRIORITY,
		});
	if (mods.sense)
		effects.push({
			type: "modifier",
			target: "sense",
			value: mods.sense,
			priority: EQUIP_PRIORITY,
		});
	if (mods.pre)
		effects.push({
			type: "modifier",
			target: "pre",
			value: mods.pre,
			priority: EQUIP_PRIORITY,
		});

	// Saving throw bonuses
	if (mods.savingThrows) {
		for (const [, value] of Object.entries(mods.savingThrows)) {
			if (value)
				effects.push({
					type: "modifier",
					target: "saving_throw",
					value,
					priority: EQUIP_PRIORITY,
				});
		}
	}

	// Skill bonuses
	if (mods.skills) {
		for (const [, value] of Object.entries(mods.skills)) {
			if (value)
				effects.push({
					type: "modifier",
					target: "skill",
					value,
					priority: EQUIP_PRIORITY,
				});
		}
	}

	return effects;
}

/**
 * Batch-convert all FeatEffects into canonical Effects
 */
export function bridgeAllFeatEffects(feats: FeatEffect[]): Effect[] {
	return feats.map((f) => bridgeFeatEffect(f).effect);
}

/**
 * Batch-convert all SpellEngineEffects into canonical Effects
 */
export function bridgeAllSpellEffects(spells: SpellEngineEffect[]): Effect[] {
	return spells.map((s) => bridgeSpellEffect(s).effect);
}

/**
 * Merge multiple effect arrays, sort by priority (lower = applied first),
 * and return the unified list ready for characterEngine consumption.
 */
export function mergeAndSortEffects(...effectArrays: Effect[][]): Effect[] {
	return effectArrays
		.flat()
		.sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
}

/**
 * Resolve conflicts: for each EffectTarget, if there are both 'modifier'
 * and 'roll_tag' effects, keep both. If there are duplicate modifiers
 * for the same target, highest priority wins (last in sorted order).
 */
export function resolveEffectConflicts(effects: Effect[]): Effect[] {
	const sorted = [...effects].sort(
		(a, b) => (a.priority ?? 0) - (b.priority ?? 0),
	);
	const byTarget = new Map<EffectTarget, Effect[]>();

	for (const effect of sorted) {
		const existing = byTarget.get(effect.target) ?? [];
		existing.push(effect);
		byTarget.set(effect.target, existing);
	}

	const resolved: Effect[] = [];
	for (const [, targetEffects] of byTarget) {
		// Keep all roll_tag effects (they stack: advantage + disadvantage = normal)
		const rollTags = targetEffects.filter((e) => e.type === "roll_tag");
		// Keep highest priority modifier effect
		const modifiers = targetEffects.filter((e) => e.type === "modifier");
		const resources = targetEffects.filter((e) => e.type === "resource");
		// Keep all other types (validation, etc.) — don't silently drop them
		const others = targetEffects.filter(
			(e) =>
				e.type !== "roll_tag" && e.type !== "modifier" && e.type !== "resource",
		);

		if (modifiers.length > 0) {
			resolved.push(modifiers[modifiers.length - 1]); // Highest priority last
		}
		resolved.push(...rollTags);
		resolved.push(...resources);
		resolved.push(...others);
	}

	return resolved;
}
