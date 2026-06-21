/**
 * Misty Pearl B1 — Active Effects v2 (Foundry v14 parity).
 *
 * Pure engine for resolving derived token stats from base stats plus a
 * stack of `TokenEffect` modifiers. Also handles expiration policies:
 * `rounds` / `minutes` countdowns, `until_long_rest`, `until_combat_end`,
 * `permanent`.
 *
 * Design contract: pure. No mutation, no React, no DOM. The host
 * (Initiative tracker turn-end hook, long-rest dialog, combat-end
 * handler) calls the appropriate `decrement*` / `clear*` helper and
 * stores the result back on the token.
 *
 * RA theming: effects are "System Imprints" — protocol-bound status
 * states. The Bureau Field Brief tracks expiration windows.
 */
import type {
	TokenEffect,
	TokenEffectDurationKind,
	TokenEffectModifier,
	VTTTokenInstance,
} from "@/types/vtt";

/**
 * Numeric derived stats with the effect stack applied. The caller
 * displays these — e.g. token rail shows `derived.speed` not
 * `token.speed`.
 */
interface DerivedTokenStats {
	ac: number;
	speedMultiplier: number;
	resistances: string[];
	conditions: string[];
	advantages: Array<{ rollType: "save" | "attack" | "check"; tag?: string }>;
	hpRegen: string[];
}

/**
 * Pure stat derivation. Takes base AC + the token's `effects` array
 * and folds the modifiers into a `DerivedTokenStats` snapshot.
 *
 * Stacking rules (intentionally simple — Foundry's is much richer; we
 * can extend later):
 *   - `ac_delta` modifiers SUM.
 *   - `speed_mult` modifiers MULTIPLY.
 *   - `damage_resist` / `condition` / `advantage` / `hp_regen` are
 *     collected as lists; duplicates are de-duped.
 */
export function resolveTokenStats(
	token: Pick<VTTTokenInstance, "ac" | "armor_class" | "conditions"> & {
		effects?: TokenEffect[];
	},
): DerivedTokenStats {
	const baseAc = token.ac ?? token.armor_class ?? 10;
	let acDelta = 0;
	let speedMult = 1;
	const resistances = new Set<string>();
	const conditions = new Set<string>(token.conditions ?? []);
	const advantages: DerivedTokenStats["advantages"] = [];
	const advantageSeen = new Set<string>();
	const hpRegen: string[] = [];

	for (const effect of token.effects ?? []) {
		for (const modifier of effect.modifiers) {
			applyModifier(modifier, {
				adjustAc: (delta) => {
					acDelta += delta;
				},
				multiplySpeed: (mult) => {
					speedMult *= mult;
				},
				addResistance: (type) => resistances.add(type),
				addCondition: (id) => conditions.add(id),
				addAdvantage: (rollType, tag) => {
					const key = `${rollType}|${tag ?? ""}`;
					if (advantageSeen.has(key)) return;
					advantageSeen.add(key);
					advantages.push({ rollType, tag });
				},
				addHpRegen: (dice) => hpRegen.push(dice),
			});
		}
	}

	return {
		ac: Math.max(0, baseAc + acDelta),
		speedMultiplier: Math.max(0, speedMult),
		resistances: Array.from(resistances),
		conditions: Array.from(conditions),
		advantages,
		hpRegen,
	};
}

interface ModifierVisitor {
	adjustAc: (delta: number) => void;
	multiplySpeed: (mult: number) => void;
	addResistance: (damageType: string) => void;
	addCondition: (conditionId: string) => void;
	addAdvantage: (
		rollType: "save" | "attack" | "check",
		tag: string | undefined,
	) => void;
	addHpRegen: (dice: string) => void;
}

function applyModifier(modifier: TokenEffectModifier, v: ModifierVisitor) {
	switch (modifier.kind) {
		case "ac_delta":
			v.adjustAc(modifier.value);
			break;
		case "speed_mult":
			v.multiplySpeed(modifier.value);
			break;
		case "damage_resist":
			v.addResistance(modifier.damageType);
			break;
		case "condition":
			v.addCondition(modifier.conditionId);
			break;
		case "advantage":
			v.addAdvantage(modifier.rollType, modifier.tag);
			break;
		case "hp_regen":
			v.addHpRegen(modifier.dice);
			break;
		default:
			break;
	}
}

// -------------------------------------------------------------------
// Expiration helpers — pure, return a new effects array.
// -------------------------------------------------------------------

/**
 * Tick down "rounds"-kind effects by 1. Removes any that hit 0.
 * Other duration kinds pass through untouched. Call once per
 * combat:turnEnd hook for the actor whose turn just ended (Foundry
 * v14 ticks at turn boundary).
 */
export function tickRoundEffects(effects: TokenEffect[]): TokenEffect[] {
	return tickByKind(effects, "rounds");
}

/** Tick down "minutes"-kind effects by 1 minute. */
export function tickMinuteEffects(effects: TokenEffect[]): TokenEffect[] {
	return tickByKind(effects, "minutes");
}

function tickByKind(
	effects: TokenEffect[],
	kind: TokenEffectDurationKind,
): TokenEffect[] {
	const next: TokenEffect[] = [];
	for (const effect of effects) {
		if (effect.durationKind !== kind) {
			next.push(effect);
			continue;
		}
		const remaining = (effect.durationValue ?? 0) - 1;
		if (remaining > 0) {
			next.push({ ...effect, durationValue: remaining });
		}
		// remaining ≤ 0 → drop
	}
	return next;
}

/** Clear every `until_long_rest` effect. Call on a long-rest dialog confirm. */
export function clearLongRestEffects(effects: TokenEffect[]): TokenEffect[] {
	return effects.filter((e) => e.durationKind !== "until_long_rest");
}

/** Clear every `until_combat_end` effect. Call on combat:end hook. */
export function clearCombatEndEffects(effects: TokenEffect[]): TokenEffect[] {
	return effects.filter((e) => e.durationKind !== "until_combat_end");
}

/**
 * Convenience for the host: given the token's current `effects` and a
 * `lifecycle` event, return the next `effects` array. Pure.
 */
export type EffectLifecycleEvent =
	| "turn_end"
	| "minute_end"
	| "long_rest"
	| "combat_end";

export function applyEffectLifecycle(
	effects: TokenEffect[] | undefined,
	event: EffectLifecycleEvent,
): TokenEffect[] {
	const list = effects ?? [];
	switch (event) {
		case "turn_end":
			return tickRoundEffects(list);
		case "minute_end":
			return tickMinuteEffects(list);
		case "long_rest":
			return clearLongRestEffects(list);
		case "combat_end":
			return clearCombatEndEffects(list);
		default:
			return list;
	}
}

/**
 * Built-in effect presets the Warden can drop on a token from the
 * action bar. Each preset is a complete `TokenEffect` template with a
 * deterministic id; the host re-id's when applying so multiple
 * instances stack cleanly.
 */
export const TOKEN_EFFECT_PRESETS: ReadonlyArray<
	Omit<TokenEffect, "id" | "appliedAt">
> = [
	{
		name: "Slowed",
		icon: "Snowflake",
		durationKind: "rounds",
		durationValue: 3,
		modifiers: [{ kind: "speed_mult", value: 0.5 }],
	},
	{
		name: "Hasted",
		icon: "Zap",
		durationKind: "rounds",
		durationValue: 5,
		modifiers: [
			{ kind: "speed_mult", value: 2 },
			{ kind: "ac_delta", value: 2 },
		],
	},
	{
		name: "Shielded",
		icon: "Shield",
		durationKind: "until_combat_end",
		modifiers: [
			{ kind: "ac_delta", value: 5 },
			{ kind: "damage_resist", damageType: "force" },
		],
	},
	{
		name: "Blessed",
		icon: "Sparkles",
		durationKind: "minutes",
		durationValue: 10,
		modifiers: [
			{ kind: "advantage", rollType: "save" },
			{ kind: "advantage", rollType: "attack" },
		],
	},
	{
		name: "Frightened",
		icon: "Ghost",
		durationKind: "rounds",
		durationValue: 3,
		modifiers: [{ kind: "condition", conditionId: "frightened" }],
	},
	{
		name: "Regeneration",
		icon: "Heart",
		durationKind: "rounds",
		durationValue: 6,
		modifiers: [{ kind: "hp_regen", dice: "1d4" }],
	},
	{
		name: "Bureau Imprint — Anomaly Sync",
		icon: "Sigil",
		durationKind: "until_long_rest",
		modifiers: [{ kind: "advantage", rollType: "check", tag: "anomaly" }],
	},
];
