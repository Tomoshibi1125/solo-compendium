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

import type { Effect, EffectTarget, EffectType } from "./characterEngine";
import { parseModifiers } from "./equipmentModifiers";

// ─── Canonical EffectTarget expansions ──────────────────────
// Define the expanded target set that feat/spell modules produce.
// These are bridged into the narrower engine targets via `mapTarget`.

const _TARGET_MAP: Record<string, EffectTarget> = {
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

const _TYPE_MAP: Record<string, EffectType> = {
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

export const EFFECT_SOURCE_PRIORITIES = {
	relic: 110,
	rune: 120,
	sigil: 130,
	tattoo: 140,
} as const;

export type UnifiedEffectKind = keyof typeof EFFECT_SOURCE_PRIORITIES;

export type UnifiedEffectEntry = {
	id?: string | null;
	name?: string | null;
	description?: string | null;
	properties?: unknown;
	mechanics?: unknown;
	passive_bonuses?: unknown;
	effect_description?: string | null;
	effects?: unknown;
};

const ABILITY_TARGETS: Record<string, EffectTarget> = {
	strength: "str",
	str: "str",
	agility: "agi",
	agi: "agi",
	vitality: "vit",
	vit: "vit",
	intelligence: "int",
	int: "int",
	sense: "sense",
	presence: "pre",
	pre: "pre",
};

const STAT_TARGETS: Record<string, EffectTarget> = {
	...ABILITY_TARGETS,
	ac: "ac",
	ac_bonus: "ac",
	armor_class: "ac",
	"armor class": "ac",
	speed: "speed",
	speed_bonus: "speed",
	"movement speed": "speed",
	initiative: "initiative",
	initiative_bonus: "initiative",
	attack: "attack_bonus",
	attack_bonus: "attack_bonus",
	"attack bonus": "attack_bonus",
	damage: "damage_bonus",
	damage_bonus: "damage_bonus",
	"damage bonus": "damage_bonus",
	saving_throw: "saving_throw",
	saving_throws: "saving_throw",
	"saving throws": "saving_throw",
	tattoo_attunement: "tattoo_attunement",
	"tattoo attunement": "tattoo_attunement",
};

function isRecord(value: unknown): value is Record<string, unknown> {
	return !!value && typeof value === "object" && !Array.isArray(value);
}

function normalizeStatTarget(
	stat: string | null | undefined,
): EffectTarget | null {
	if (!stat) return null;
	return STAT_TARGETS[stat.trim().toLowerCase().replaceAll("-", "_")] ?? null;
}

function toNumericValue(value: unknown): number | null {
	if (typeof value === "number" && Number.isFinite(value)) return value;
	if (typeof value !== "string") return null;
	const trimmed = value.trim();
	if (!/^[+-]?\d+$/.test(trimmed)) return null;
	return Number(trimmed);
}

function makeModifierEffect(
	stat: string,
	value: unknown,
	priority: number,
	condition?: string,
): Effect | null {
	const target = normalizeStatTarget(stat);
	const numericValue = toNumericValue(value);
	if (!target || numericValue === null) return null;
	return {
		type: "modifier",
		target,
		value: numericValue,
		condition,
		priority,
	};
}

function makeDomainEffect(
	target: EffectTarget,
	value: unknown,
	priority: number,
	condition?: string,
): Effect | null {
	if (typeof value !== "string" && !Array.isArray(value)) return null;
	return {
		type: "validation",
		target,
		value: value as Effect["value"],
		condition,
		priority,
	};
}

function collectDelimitedValues(value: unknown): string[] {
	if (Array.isArray(value)) {
		return value.filter((entry): entry is string => typeof entry === "string");
	}
	if (typeof value !== "string") return [];
	return value
		.split(/,|\band\b/i)
		.map((entry) => entry.trim())
		.filter(Boolean);
}

function pushRecordStatBonuses(
	effects: Effect[],
	record: Record<string, unknown> | null | undefined,
	priority: number,
	condition?: string,
) {
	if (!record) return;
	for (const [stat, value] of Object.entries(record)) {
		if (stat === "ability_scores" && isRecord(value)) {
			pushRecordStatBonuses(effects, value, priority, condition);
			continue;
		}
		const effect = makeModifierEffect(stat, value, priority, condition);
		if (effect) effects.push(effect);
	}
}

function pushDomainEffects(
	effects: Effect[],
	mechanics: Record<string, unknown> | null | undefined,
	priority: number,
) {
	if (!mechanics) return;
	const domainSources: Array<[string, EffectTarget]> = [
		["resistance", "damage_resistance"],
		["resistances", "damage_resistance"],
		["immunity", "damage_immunity"],
		["immunities", "damage_immunity"],
		["vulnerability", "damage_vulnerability"],
		["vulnerabilities", "damage_vulnerability"],
		["condition_immunity", "condition_immunity"],
		["condition_immunities", "condition_immunity"],
	];
	for (const [key, target] of domainSources) {
		const values = collectDelimitedValues(mechanics[key]);
		if (values.length === 0) continue;
		const effect = makeDomainEffect(target, values, priority);
		if (effect) effects.push(effect);
	}
}

function collectEffectText(entry: UnifiedEffectEntry): string[] {
	const texts: string[] = [];
	if (entry.effect_description) texts.push(entry.effect_description);
	if (typeof entry.description === "string") texts.push(entry.description);
	const effectBlock = entry.effects;
	if (Array.isArray(effectBlock)) {
		texts.push(
			...effectBlock.filter(
				(entry): entry is string => typeof entry === "string",
			),
		);
	} else if (isRecord(effectBlock)) {
		for (const key of [
			"primary",
			"secondary",
			"tertiary",
			"primaryEffect",
			"secondaryEffect",
		]) {
			const value = effectBlock[key];
			if (typeof value === "string") texts.push(value);
		}
		const passive = effectBlock.passive;
		if (Array.isArray(passive)) {
			texts.push(
				...passive.filter(
					(entry): entry is string => typeof entry === "string",
				),
			);
		}
	}
	const mechanics = entry.mechanics;
	if (isRecord(mechanics) && Array.isArray(mechanics.special_abilities)) {
		texts.push(
			...mechanics.special_abilities.filter(
				(entry): entry is string => typeof entry === "string",
			),
		);
	}
	return texts;
}

function bridgeTextEffects(text: string, priority: number): Effect[] {
	const effects: Effect[] = [];
	const lower = text.toLowerCase();
	const isConditional = /\b(per|allies|creatures|when|whenever|if)\b/i.test(
		text,
	);
	if (!isConditional) {
		const acMatch = text.match(/([+-]\d+)\s*(?:to\s*)?(?:AC|armor class)\b/i);
		if (acMatch?.[1]) {
			const effect = makeModifierEffect("ac", acMatch[1], priority, text);
			if (effect) effects.push(effect);
		}
		const speedMatch =
			text.match(/speed increases by\s+(\d+)\s*(?:feet|ft)?/i) ??
			text.match(/([+-]\d+)\s*(?:feet|ft)?\s*(?:to\s*)?(?:movement\s*)?speed/i);
		if (speedMatch?.[1]) {
			const effect = makeModifierEffect("speed", speedMatch[1], priority, text);
			if (effect) effects.push(effect);
		}
		const saveMatch = text.match(/([+-]\d+)\s+to\s+(?:all\s+)?saving throws?/i);
		if (saveMatch?.[1]) {
			const effect = makeModifierEffect(
				"saving throws",
				saveMatch[1],
				priority,
				text,
			);
			if (effect) effects.push(effect);
		}
		for (const [ability, target] of Object.entries(ABILITY_TARGETS)) {
			const abilityMatch = lower.match(
				new RegExp(`([+-]?\\d+)\\s+(?:to\\s+)?${ability}\\b`, "i"),
			);
			if (!abilityMatch?.[1]) continue;
			effects.push({
				type: "modifier",
				target,
				value: Number(abilityMatch[1]),
				condition: text,
				priority,
			});
			break;
		}
	}
	const resistanceMatch =
		text.match(/resistance to ([a-z,\s-]+) damage/i) ??
		text.match(/resistant to ([a-z,\s-]+) damage/i);
	if (resistanceMatch?.[1]) {
		const effect = makeDomainEffect(
			"damage_resistance",
			collectDelimitedValues(resistanceMatch[1]),
			priority,
			text,
		);
		if (effect) effects.push(effect);
	}
	return effects;
}

export function bridgeEffectBearingEntry(
	entry: UnifiedEffectEntry,
	kind: UnifiedEffectKind,
): Effect[] {
	const priority = EFFECT_SOURCE_PRIORITIES[kind];
	const effects: Effect[] = [];
	const mechanics = isRecord(entry.mechanics) ? entry.mechanics : null;
	const properties = Array.isArray(entry.properties)
		? entry.properties.filter(
				(property): property is string => typeof property === "string",
			)
		: [];
	if (kind === "relic" && properties.length > 0) {
		effects.push(
			...bridgeEquipmentEffects(properties).map((effect) => ({
				...effect,
				priority,
			})),
		);
	}
	pushRecordStatBonuses(
		effects,
		mechanics?.stat_bonuses as Record<string, unknown> | undefined,
		priority,
	);
	pushDomainEffects(effects, mechanics, priority);
	if (isRecord(entry.passive_bonuses)) {
		pushRecordStatBonuses(effects, entry.passive_bonuses, priority);
	}
	if (isRecord(entry.effects) && Array.isArray(entry.effects.passiveBonuses)) {
		for (const bonus of entry.effects.passiveBonuses) {
			if (!isRecord(bonus)) continue;
			const effect = makeModifierEffect(
				String(bonus.stat ?? ""),
				bonus.value,
				priority,
			);
			if (effect) effects.push(effect);
		}
	}
	for (const text of collectEffectText(entry)) {
		effects.push(...bridgeTextEffects(text, priority));
	}
	return effects;
}

export function bridgeRelicEffects(entry: UnifiedEffectEntry): Effect[] {
	return bridgeEffectBearingEntry(entry, "relic");
}

export function bridgeRuneEffects(entry: UnifiedEffectEntry): Effect[] {
	return bridgeEffectBearingEntry(entry, "rune");
}

export function bridgeSigilEffects(entry: UnifiedEffectEntry): Effect[] {
	return bridgeEffectBearingEntry(entry, "sigil");
}

export function bridgeTattooEffects(entry: UnifiedEffectEntry): Effect[] {
	return bridgeEffectBearingEntry(entry, "tattoo");
}
