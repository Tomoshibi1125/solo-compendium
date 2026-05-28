import { describe, expect, it } from "vitest";
import {
	applyEffectLifecycle,
	clearCombatEndEffects,
	clearLongRestEffects,
	resolveTokenStats,
	tickMinuteEffects,
	tickRoundEffects,
	TOKEN_EFFECT_PRESETS,
} from "@/lib/vtt/tokenEffects";
import type { TokenEffect } from "@/types/vtt";

const effect = (
	overrides: Partial<TokenEffect> & Pick<TokenEffect, "durationKind">,
): TokenEffect => ({
	id: overrides.id ?? `effect-${Math.random().toString(36).slice(2, 8)}`,
	name: overrides.name ?? "Test",
	icon: overrides.icon ?? "Sparkles",
	appliedAt: overrides.appliedAt ?? "2026-05-26T00:00:00.000Z",
	modifiers: overrides.modifiers ?? [],
	...overrides,
});

describe("resolveTokenStats", () => {
	it("returns base AC when there are no effects", () => {
		const stats = resolveTokenStats({ ac: 15 });
		expect(stats.ac).toBe(15);
		expect(stats.speedMultiplier).toBe(1);
		expect(stats.conditions).toEqual([]);
	});

	it("sums ac_delta modifiers", () => {
		const stats = resolveTokenStats({
			ac: 15,
			effects: [
				effect({
					durationKind: "rounds",
					modifiers: [{ kind: "ac_delta", value: 2 }],
				}),
				effect({
					durationKind: "rounds",
					modifiers: [{ kind: "ac_delta", value: 3 }],
				}),
			],
		});
		expect(stats.ac).toBe(20);
	});

	it("multiplies speed modifiers (does not sum)", () => {
		const stats = resolveTokenStats({
			ac: 10,
			effects: [
				effect({
					durationKind: "rounds",
					modifiers: [{ kind: "speed_mult", value: 0.5 }],
				}),
				effect({
					durationKind: "rounds",
					modifiers: [{ kind: "speed_mult", value: 2 }],
				}),
			],
		});
		expect(stats.speedMultiplier).toBe(1);
	});

	it("aggregates resistances, conditions, advantages, hp regen", () => {
		const stats = resolveTokenStats({
			ac: 10,
			conditions: ["prone"],
			effects: [
				effect({
					durationKind: "rounds",
					modifiers: [
						{ kind: "damage_resist", damageType: "fire" },
						{ kind: "condition", conditionId: "frightened" },
						{ kind: "advantage", rollType: "save", tag: "fear" },
						{ kind: "hp_regen", dice: "1d4" },
					],
				}),
			],
		});
		expect(stats.resistances).toEqual(["fire"]);
		expect(stats.conditions.sort()).toEqual(["frightened", "prone"]);
		expect(stats.advantages).toEqual([
			{ rollType: "save", tag: "fear" },
		]);
		expect(stats.hpRegen).toEqual(["1d4"]);
	});

	it("de-duplicates identical advantage entries", () => {
		const stats = resolveTokenStats({
			ac: 10,
			effects: [
				effect({
					durationKind: "rounds",
					modifiers: [
						{ kind: "advantage", rollType: "attack" },
						{ kind: "advantage", rollType: "attack" },
					],
				}),
			],
		});
		expect(stats.advantages).toHaveLength(1);
	});

	it("falls back to armor_class when ac is missing", () => {
		const stats = resolveTokenStats({ armor_class: 13 });
		expect(stats.ac).toBe(13);
	});

	it("clamps negative AC at 0", () => {
		const stats = resolveTokenStats({
			ac: 10,
			effects: [
				effect({
					durationKind: "rounds",
					modifiers: [{ kind: "ac_delta", value: -20 }],
				}),
			],
		});
		expect(stats.ac).toBe(0);
	});
});

describe("tickRoundEffects", () => {
	it("decrements rounds-kind countdowns by 1", () => {
		const next = tickRoundEffects([
			effect({
				id: "a",
				durationKind: "rounds",
				durationValue: 3,
				modifiers: [],
			}),
		]);
		expect(next[0].durationValue).toBe(2);
	});

	it("removes effects that hit 0", () => {
		const next = tickRoundEffects([
			effect({
				id: "a",
				durationKind: "rounds",
				durationValue: 1,
				modifiers: [],
			}),
		]);
		expect(next).toEqual([]);
	});

	it("does not touch other duration kinds", () => {
		const list = [
			effect({
				id: "perm",
				durationKind: "permanent",
				modifiers: [],
			}),
			effect({
				id: "long",
				durationKind: "until_long_rest",
				modifiers: [],
			}),
		];
		const next = tickRoundEffects(list);
		expect(next.map((e) => e.id).sort()).toEqual(["long", "perm"]);
	});
});

describe("tickMinuteEffects", () => {
	it("decrements minutes-kind only", () => {
		const next = tickMinuteEffects([
			effect({
				id: "min",
				durationKind: "minutes",
				durationValue: 2,
				modifiers: [],
			}),
			effect({
				id: "rounds",
				durationKind: "rounds",
				durationValue: 2,
				modifiers: [],
			}),
		]);
		expect(next.find((e) => e.id === "min")?.durationValue).toBe(1);
		expect(next.find((e) => e.id === "rounds")?.durationValue).toBe(2);
	});
});

describe("clearLongRestEffects / clearCombatEndEffects", () => {
	it("strips only the matching duration kind", () => {
		const list = [
			effect({ id: "lr", durationKind: "until_long_rest", modifiers: [] }),
			effect({ id: "ce", durationKind: "until_combat_end", modifiers: [] }),
			effect({ id: "p", durationKind: "permanent", modifiers: [] }),
		];
		expect(clearLongRestEffects(list).map((e) => e.id).sort()).toEqual([
			"ce",
			"p",
		]);
		expect(clearCombatEndEffects(list).map((e) => e.id).sort()).toEqual([
			"lr",
			"p",
		]);
	});
});

describe("applyEffectLifecycle", () => {
	it("delegates correctly per event", () => {
		const list = [
			effect({
				id: "r",
				durationKind: "rounds",
				durationValue: 1,
				modifiers: [],
			}),
			effect({
				id: "ce",
				durationKind: "until_combat_end",
				modifiers: [],
			}),
		];
		expect(applyEffectLifecycle(list, "turn_end").map((e) => e.id)).toEqual([
			"ce",
		]);
		expect(applyEffectLifecycle(list, "combat_end").map((e) => e.id)).toEqual([
			"r",
		]);
		expect(applyEffectLifecycle(undefined, "turn_end")).toEqual([]);
	});
});

describe("TOKEN_EFFECT_PRESETS", () => {
	it("ships well-known presets", () => {
		const names = TOKEN_EFFECT_PRESETS.map((p) => p.name);
		expect(names).toContain("Slowed");
		expect(names).toContain("Hasted");
		expect(names).toContain("Shielded");
		expect(names).toContain("Blessed");
		expect(names).toContain("Frightened");
		expect(names).toContain("Regeneration");
	});

	it("every preset declares at least one modifier", () => {
		for (const preset of TOKEN_EFFECT_PRESETS) {
			expect(preset.modifiers.length).toBeGreaterThan(0);
		}
	});
});
