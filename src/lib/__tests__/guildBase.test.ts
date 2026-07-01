import { describe, expect, it } from "vitest";
import { GUILD_FACILITIES } from "@/data/compendium/guild-base-mods";
import { GUILD_BASES } from "@/data/compendium/guild-bases";
import { GUILD_SKILLS } from "@/data/compendium/guild-skills";
import type { CharacterFeature } from "@/hooks/useCharacterFeatures";
import { featureEffectsToCustomModifiers } from "@/hooks/useCharacterFeatures";
import { sumCustomModifiers } from "@/lib/customModifiers";
import {
	aggregateGuildEffects,
	facilityLevel,
	facilityUpgradeCost,
	type GuildFacility,
	type GuildFacilityId,
	type GuildSkill,
	grantFacilityTier,
	grantGuildBaseProperty,
	grantGuildSkill,
	nextFacilityTier,
	purchaseFacilityUpgrade,
	purchaseGuildBaseProperty,
	purchaseGuildSkill,
	summarizeGuildBenefits,
} from "@/lib/guildBase";
import { memberCapForContribution } from "@/lib/guildTreasury";
import type { FeatureEffect } from "@/types/featureEffects";

const barracks = GUILD_FACILITIES.find((f) => f.id === "barracks");
if (!barracks) throw new Error("test fixture: barracks facility missing");

describe("guildBase — facility tiers", () => {
	it("reads the built level (0 when absent)", () => {
		expect(facilityLevel(undefined, "barracks")).toBe(0);
		expect(facilityLevel({ barracks: 2 }, "barracks")).toBe(2);
		expect(facilityLevel({ barracks: -3 }, "barracks")).toBe(0);
	});

	it("resolves the next tier + its cost, null when maxed", () => {
		const max = barracks.tiers.length;
		expect(nextFacilityTier(barracks, 0)?.tier).toBe(1);
		expect(facilityUpgradeCost(barracks, 0)).toEqual(barracks.tiers[0].cost);
		expect(nextFacilityTier(barracks, max)).toBeNull();
		expect(facilityUpgradeCost(barracks, max)).toBeNull();
	});
});

describe("guildBase — purchasing (ungated, fund-debited)", () => {
	it("buys the next tier and debits funds", () => {
		const cost = barracks.tiers[0].cost;
		const funds = { [cost.currency]: cost.amount + 100 };
		const res = purchaseFacilityUpgrade({
			baseState: {},
			funds,
			facility: barracks,
		});
		expect(res.baseState.barracks).toBe(1);
		expect(res.funds[cost.currency]).toBe(100);
	});

	it("rejects an unaffordable upgrade", () => {
		const cost = barracks.tiers[0].cost;
		expect(() =>
			purchaseFacilityUpgrade({
				baseState: {},
				funds: { [cost.currency]: cost.amount - 1 },
				facility: barracks,
			}),
		).toThrow(/Insufficient/i);
	});

	it("rejects upgrading past the max tier", () => {
		const max = barracks.tiers.length;
		expect(() =>
			purchaseFacilityUpgrade({
				baseState: { barracks: max },
				funds: { gate: 99999 },
				facility: barracks,
			}),
		).toThrow(/highest tier/i);
	});

	it("buys a skill and rejects re-buying / unaffordable", () => {
		const skill = GUILD_SKILLS[0];
		const ok = purchaseGuildSkill({
			skillsState: [],
			funds: { [skill.cost.currency]: skill.cost.amount },
			skill,
		});
		expect(ok.skillsState).toContain(skill.id);
		expect(ok.funds[skill.cost.currency]).toBe(0);

		expect(() =>
			purchaseGuildSkill({
				skillsState: [skill.id],
				funds: { gate: 99999 },
				skill,
			}),
		).toThrow(/already unlocked/i);

		expect(() =>
			purchaseGuildSkill({
				skillsState: [],
				funds: { [skill.cost.currency]: skill.cost.amount - 1 },
				skill,
			}),
		).toThrow(/Insufficient/i);
	});
});

describe("guildBase — Warden grants (no cost)", () => {
	it("sets a facility tier and unlocks a skill with no funds", () => {
		expect(grantFacilityTier({}, "forge", 2).forge).toBe(2);
		const skills = grantGuildSkill([], "gs-mining-doctrine");
		expect(skills).toEqual(["gs-mining-doctrine"]);
		// idempotent
		expect(grantGuildSkill(skills, "gs-mining-doctrine")).toBe(skills);
	});
});

describe("guildBase — effect aggregation", () => {
	const facilities: GuildFacility[] = [
		{
			id: "barracks",
			name: "Test Barracks",
			summary: "",
			source_book: "Rift Ascendant Canon",
			tiers: [
				{
					tier: 1,
					name: "t1",
					cost: { currency: "gate", amount: 10 },
					capability: { memberCap: 2 },
					description: "",
				},
				{
					tier: 2,
					name: "t2",
					cost: { currency: "gate", amount: 20 },
					capability: { memberCap: 3 },
					description: "",
				},
			],
		},
		{
			id: "war_room",
			name: "Test War Room",
			summary: "",
			source_book: "Rift Ascendant Canon",
			tiers: [
				{
					tier: 1,
					name: "w1",
					cost: { currency: "gate", amount: 10 },
					effects: [{ kind: "initiative_bonus", value: 1 }],
					description: "",
				},
				{
					tier: 2,
					name: "w2",
					cost: { currency: "gate", amount: 20 },
					effects: [{ kind: "initiative_bonus", value: 1 }],
					description: "",
				},
			],
		},
	];
	const skills: GuildSkill[] = [
		{
			id: "s1",
			name: "S1",
			cost: { currency: "gate", amount: 10 },
			capability: { memberCap: 5, craftingOptions: ["recipe-x"] },
			description: "",
			source_book: "Rift Ascendant Canon",
		},
	];

	it("sums member-cap cumulatively across tiers + skills, de-dupes recipes", () => {
		// barracks t2 built (2+3) + skill s1 (5) = 10
		const agg = aggregateGuildEffects({
			facilities,
			skills,
			baseState: { barracks: 2 },
			skillsState: ["s1"],
		});
		expect(agg.memberCapBonus).toBe(10);
		expect(agg.craftingOptions).toEqual(["recipe-x"]);
	});

	it("collects real effects cumulatively (tiered War Room initiative)", () => {
		const agg = aggregateGuildEffects({
			facilities,
			skills,
			baseState: { war_room: 2 },
			skillsState: [],
		});
		// tier1 + tier2 each +1 → two raw initiative effects
		const initiative = agg.effects.filter((e) => e.kind === "initiative_bonus");
		expect(initiative).toHaveLength(2);
	});

	it("contributes nothing when nothing is built", () => {
		const agg = aggregateGuildEffects({
			facilities,
			skills,
			baseState: {},
			skillsState: [],
		});
		expect(agg.memberCapBonus).toBe(0);
		expect(agg.effects).toHaveLength(0);
		expect(agg.craftingOptions).toHaveLength(0);
	});
});

describe("guildBase — effects actually apply to a member's sheet", () => {
	// Mirrors how `useCharacterGuildBenefits` packages guild effects into a
	// synthetic feature consumed by the SAME converter feats use.
	const toGuildModifiers = (effects: FeatureEffect[]) =>
		featureEffectsToCustomModifiers(
			[
				{
					id: "guild-benefits-test",
					character_id: "c1",
					name: "Guild Benefits",
					source: "guild",
					level_acquired: 0,
					description: null,
					uses_current: null,
					uses_max: null,
					recharge: null,
					action_type: null,
					is_active: true,
					modifiers: null,
					homebrew_id: null,
					created_at: new Date(0).toISOString(),
					effects,
				} as CharacterFeature & { effects: FeatureEffect[] },
			],
			5,
		);

	it("a tier-3 War Room grants its member +3 Initiative on the computed sheet", () => {
		const warRoom = GUILD_FACILITIES.find((f) => f.id === "war_room");
		if (!warRoom) throw new Error("war_room missing");
		const agg = aggregateGuildEffects({
			facilities: [warRoom],
			skills: [],
			baseState: { war_room: 3 },
			skillsState: [],
		});
		const mods = toGuildModifiers(agg.effects);
		expect(sumCustomModifiers(mods, "initiative_bonus")).toBe(3);
	});

	it("Vanguard Tactics grants its member +1 Attack", () => {
		const vanguard = GUILD_SKILLS.find((s) => s.id === "gs-vanguard-tactics");
		if (!vanguard) throw new Error("gs-vanguard-tactics missing");
		const agg = aggregateGuildEffects({
			facilities: [],
			skills: [vanguard],
			baseState: {},
			skillsState: [vanguard.id],
		});
		const mods = toGuildModifiers(agg.effects);
		expect(sumCustomModifiers(mods, "attack_bonus")).toBe(1);
	});

	it("the member-cap bonus stacks on the contribution-derived cap", () => {
		const veteran = GUILD_SKILLS.find((s) => s.id === "gs-veteran-cadre");
		if (!veteran) throw new Error("gs-veteran-cadre missing");
		const agg = aggregateGuildEffects({
			facilities: [],
			skills: [veteran],
			baseState: {},
			skillsState: [veteran.id],
		});
		const realCap = memberCapForContribution(0) + agg.memberCapBonus;
		expect(realCap).toBe(memberCapForContribution(0) + 3);
	});
});

describe("guildBase — content invariants", () => {
	it("every facility has sequential tiers 1..N with positive cost + a real benefit", () => {
		for (const f of GUILD_FACILITIES) {
			expect(f.source_book).toBe("Rift Ascendant Canon");
			f.tiers.forEach((t, i) => {
				expect(t.tier).toBe(i + 1);
				expect(t.cost.amount).toBeGreaterThan(0);
				// Honest model: every tier grants at least one capability / effect / benefit.
				expect(summarizeGuildBenefits(t).length).toBeGreaterThan(0);
			});
		}
	});

	it("every guild skill has a positive cost + at least one benefit + unique id", () => {
		const ids = new Set<string>();
		for (const s of GUILD_SKILLS) {
			expect(s.source_book).toBe("Rift Ascendant Canon");
			expect(s.cost.amount).toBeGreaterThan(0);
			expect(summarizeGuildBenefits(s).length).toBeGreaterThan(0);
			expect(ids.has(s.id)).toBe(false);
			ids.add(s.id);
		}
	});

	it("Forge crafting options reference real recipe ids", async () => {
		const { craftingRecipes } = await import("@/data/compendium/crafting");
		const recipeIds = new Set(craftingRecipes.map((r) => r.id));
		const forge = GUILD_FACILITIES.find((f) => f.id === "forge");
		if (!forge) throw new Error("forge missing");
		const optionIds = forge.tiers.flatMap(
			(t) => t.capability?.craftingOptions ?? [],
		);
		expect(optionIds.length).toBeGreaterThan(0);
		for (const id of optionIds) expect(recipeIds.has(id)).toBe(true);
	});

	it("EVERY facility/skill/base crafting option references a real recipe id", async () => {
		const { craftingRecipes } = await import("@/data/compendium/crafting");
		const recipeIds = new Set(craftingRecipes.map((r) => r.id));
		const allOptionIds = [
			...GUILD_FACILITIES.flatMap((f) =>
				f.tiers.flatMap((t) => t.capability?.craftingOptions ?? []),
			),
			...GUILD_SKILLS.flatMap((s) => s.capability?.craftingOptions ?? []),
			...GUILD_BASES.flatMap((b) => b.capability?.craftingOptions ?? []),
		];
		for (const id of allOptionIds) expect(recipeIds.has(id)).toBe(true);
	});
});

describe("guildBase — base properties (the owned HQ)", () => {
	const facilityIds = new Set(GUILD_FACILITIES.map((f) => f.id));
	const lot = GUILD_BASES.find((b) => b.isLot);
	const bastion = GUILD_BASES.find((b) => b.id === "base-ironhold-bastion");
	if (!lot) throw new Error("test fixture: buildable lot missing");
	if (!bastion) throw new Error("test fixture: Ironhold Bastion missing");

	it("content: unique ids, positive cost, exactly one lot, real bundled facilities", () => {
		const ids = new Set<string>();
		let lots = 0;
		for (const b of GUILD_BASES) {
			expect(b.source_book).toBe("Rift Ascendant Canon");
			expect(b.cost.amount).toBeGreaterThan(0);
			expect(ids.has(b.id)).toBe(false);
			ids.add(b.id);
			if (b.isLot) lots += 1;
			for (const [fid, tier] of Object.entries(b.includedFacilities)) {
				expect(facilityIds.has(fid as GuildFacilityId)).toBe(true);
				expect(tier).toBeGreaterThan(0);
			}
		}
		expect(lots).toBe(1);
		expect(Object.keys(lot.includedFacilities).length).toBe(0);
		// The five pre-built bases each bundle at least one wing.
		for (const b of GUILD_BASES.filter((x) => !x.isLot)) {
			expect(Object.keys(b.includedFacilities).length).toBeGreaterThan(0);
		}
	});

	it("the five pre-built bases are unique — no two bundle the same facility set", () => {
		const signatures = GUILD_BASES.filter((b) => !b.isLot).map((b) =>
			Object.entries(b.includedFacilities)
				.map(([id, tier]) => `${id}:${tier}`)
				.sort()
				.join("|"),
		);
		expect(new Set(signatures).size).toBe(signatures.length);
	});

	it("buying a base installs its bundled facilities, records it, and debits funds", () => {
		const res = purchaseGuildBaseProperty({
			ownedBaseId: null,
			baseState: {},
			funds: { [bastion.cost.currency]: bastion.cost.amount + 5 },
			base: bastion,
		});
		expect(res.baseProperty).toBe(bastion.id);
		expect(res.funds[bastion.cost.currency]).toBe(5);
		for (const [fid, tier] of Object.entries(bastion.includedFacilities)) {
			expect(res.baseState[fid as GuildFacilityId]).toBe(tier);
		}
	});

	it("the buildable lot installs nothing but still becomes the owned base", () => {
		const res = purchaseGuildBaseProperty({
			ownedBaseId: null,
			baseState: {},
			funds: { [lot.cost.currency]: lot.cost.amount },
			base: lot,
		});
		expect(res.baseProperty).toBe(lot.id);
		expect(Object.keys(res.baseState).length).toBe(0);
		expect(res.funds[lot.cost.currency]).toBe(0);
	});

	it("relocating never downgrades a wing the guild already raised higher", () => {
		// Guild already built Barracks tier 3; Ironhold only bundles Barracks tier 2.
		const res = purchaseGuildBaseProperty({
			ownedBaseId: lot.id,
			baseState: { barracks: 3 },
			funds: { [bastion.cost.currency]: bastion.cost.amount },
			base: bastion,
		});
		expect(res.baseState.barracks).toBe(3);
	});

	it("rejects re-buying the base the guild already calls home, and unaffordable ones", () => {
		expect(() =>
			purchaseGuildBaseProperty({
				ownedBaseId: bastion.id,
				baseState: {},
				funds: { core: 99999 },
				base: bastion,
			}),
		).toThrow(/already calls/i);

		expect(() =>
			purchaseGuildBaseProperty({
				ownedBaseId: null,
				baseState: {},
				funds: { [bastion.cost.currency]: bastion.cost.amount - 1 },
				base: bastion,
			}),
		).toThrow(/Insufficient/i);
	});

	it("Warden-grant installs a base's facilities at no cost", () => {
		const res = grantGuildBaseProperty({ baseState: {}, base: bastion });
		expect(res.baseProperty).toBe(bastion.id);
		for (const [fid, tier] of Object.entries(bastion.includedFacilities)) {
			expect(res.baseState[fid as GuildFacilityId]).toBe(tier);
		}
	});

	it("the owned base's inherent perk folds into aggregated guild effects", () => {
		// Ironhold Bastion's perk grants +1 member cap.
		const agg = aggregateGuildEffects({
			facilities: [],
			skills: [],
			baseState: {},
			skillsState: [],
			bases: GUILD_BASES,
			baseProperty: bastion.id,
		});
		expect(agg.memberCapBonus).toBe(1);
	});
});
