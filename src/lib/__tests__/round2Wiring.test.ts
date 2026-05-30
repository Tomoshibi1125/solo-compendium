/**
 * Round 2 wiring tests — verify the automations that were previously
 * library-only now fire end-to-end through their live entry points.
 *
 * Covers:
 *  - B1: crit damage doubling through resolveAttack (forceCritical)
 *  - B1/D5: Brutal Critical extra dice via critExtraDice
 *  - B4: feat-effect → customModifier bridge (Tough per-level HP)
 *  - D1: hybridSearchQuery uses textSearch when the builder supports it
 */

import { describe, expect, it } from "vitest";
import type { CharacterFeature } from "@/hooks/useCharacterFeatures";
import { featureEffectsToCustomModifiers } from "@/hooks/useCharacterFeatures";
import {
	type ActionResolutionPayload,
	resolveAttack,
} from "@/lib/actionResolution";
import { sumCustomModifiers } from "@/lib/customModifiers";
import { hybridSearchQuery } from "@/lib/fullTextSearch";

const mkFeature = (over: Partial<CharacterFeature>): CharacterFeature => ({
	id: "feat-1",
	character_id: "c1",
	name: "Tough",
	source: "Feat",
	level_acquired: 1,
	description: null,
	uses_current: null,
	uses_max: null,
	recharge: null,
	action_type: "passive",
	is_active: true,
	modifiers: null,
	homebrew_id: null,
	created_at: new Date().toISOString(),
	...over,
});

describe("B1 — crit damage doubling through resolveAttack", () => {
	const basePayload: ActionResolutionPayload = {
		version: 1,
		id: "atk",
		name: "Greatsword",
		source: { type: "item", entryId: "w1" },
		kind: "attack",
		attack: { roll: "1d20+5", forceCritical: true },
		damage: { roll: "2d6+3", type: "slashing" },
	};

	it("doubles damage dice (not the modifier) on a forced crit", () => {
		// Run several times to bound the result: 4d6+3 ∈ [7, 27],
		// strictly above the non-crit 2d6+3 max of 15 is NOT guaranteed,
		// but the dice COUNT must be 4 (doubled) — assert via min/max bounds.
		for (let i = 0; i < 50; i++) {
			const outcome = resolveAttack(basePayload, 10);
			if (outcome.kind !== "attack") throw new Error("wrong kind");
			expect(outcome.criticalHit).toBe(true);
			// 4d6+3 → min 7, max 27
			expect(outcome.damageTotal).toBeGreaterThanOrEqual(7);
			expect(outcome.damageTotal).toBeLessThanOrEqual(27);
		}
	});

	it("non-crit hit keeps a single dice set (2d6+3 ∈ [5,15])", () => {
		const payload: ActionResolutionPayload = {
			...basePayload,
			attack: { roll: "1d20+20" }, // always hits; nat-20 still crits (5e)
		};
		for (let i = 0; i < 80; i++) {
			const outcome = resolveAttack(payload, 10);
			if (outcome.kind === "attack" && outcome.damageTotal !== undefined) {
				// A natural 20 legitimately crits even here; only assert the
				// single-dice bound on NON-crit hits.
				if (!outcome.criticalHit) {
					expect(outcome.damageTotal).toBeLessThanOrEqual(15);
					expect(outcome.damageTotal).toBeGreaterThanOrEqual(5);
				}
			}
		}
	});

	it("D5 — critExtraDice adds extra weapon dice on a crit", () => {
		const payload: ActionResolutionPayload = {
			...basePayload,
			attack: { roll: "1d20+5", forceCritical: true, critExtraDice: 2 },
		};
		// 2d6 doubled = 4d6, +2 extra = 6d6, +3 mod → [9, 39]
		for (let i = 0; i < 50; i++) {
			const outcome = resolveAttack(payload, 10);
			if (outcome.kind !== "attack") throw new Error("wrong kind");
			expect(outcome.damageTotal).toBeGreaterThanOrEqual(9);
			expect(outcome.damageTotal).toBeLessThanOrEqual(39);
		}
	});
});

describe("B4 — feat-effect → customModifier bridge", () => {
	it("Tough preset emits +2 HP per level as an hp-max modifier", () => {
		const mods = featureEffectsToCustomModifiers([mkFeature({})], 5);
		const hpMax = sumCustomModifiers(mods, "hp-max");
		expect(hpMax).toBe(10); // 2 × level 5
	});

	it("does not emit HP when the feature already authored an hp-max modifier", () => {
		const feat = mkFeature({
			modifiers: [{ type: "hp-max", value: 99, source: "explicit" }],
		});
		const mods = featureEffectsToCustomModifiers([feat], 5);
		// The preset hp_per_level is skipped to avoid double counting.
		expect(sumCustomModifiers(mods, "hp-max")).toBe(0);
	});

	it("inactive features contribute nothing", () => {
		const mods = featureEffectsToCustomModifiers(
			[mkFeature({ is_active: false })],
			10,
		);
		expect(mods.length).toBe(0);
	});
});

describe("D1 — hybridSearchQuery FTS wiring", () => {
	it("uses textSearch (websearch) for longer queries when available", () => {
		const calls: Array<{ method: string; args: unknown[] }> = [];
		const builder = {
			or(filter: string) {
				calls.push({ method: "or", args: [filter] });
				return this;
			},
			textSearch(col: string, q: string, opts?: unknown) {
				calls.push({ method: "textSearch", args: [col, q, opts] });
				return this;
			},
		};
		hybridSearchQuery(builder as never, "fireball", ["name", "description"]);
		expect(calls.some((c) => c.method === "textSearch")).toBe(true);
		expect(calls.some((c) => c.method === "or")).toBe(false);
	});

	it("falls back to ILIKE for short queries", () => {
		const calls: string[] = [];
		const builder = {
			or(filter: string) {
				calls.push(filter);
				return this;
			},
			textSearch() {
				return this;
			},
		};
		hybridSearchQuery(builder as never, "fb", ["name"]);
		expect(calls.length).toBe(1);
		expect(calls[0]).toContain("ilike");
	});

	it("falls back to ILIKE when the builder lacks textSearch", () => {
		const calls: string[] = [];
		const builder = {
			or(filter: string) {
				calls.push(filter);
				return this;
			},
		};
		hybridSearchQuery(builder as never, "fireball", ["name"]);
		expect(calls.length).toBe(1);
		expect(calls[0]).toContain("ilike");
	});
});
