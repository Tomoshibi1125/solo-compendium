import { describe, expect, it } from "vitest";
import { GUILD_BASE_MATERIALS } from "@/data/compendium/guild-base-materials";
import { GUILD_FACILITIES } from "@/data/compendium/guild-base-mods";
import { GUILD_BASES } from "@/data/compendium/guild-bases";
import { GUILD_SKILLS } from "@/data/compendium/guild-skills";
import { staticDataProvider } from "@/data/compendium/providers";
import { summarizeGuildBenefits } from "@/lib/guildBase";

describe("guild-base compendium category", () => {
	it("getGuildBase returns every base, facility, and skill, split by guild_base_type", async () => {
		const entries = await staticDataProvider.getGuildBase("");
		expect(entries.length).toBe(
			GUILD_BASES.length + GUILD_FACILITIES.length + GUILD_SKILLS.length,
		);

		const bases = entries.filter((e) => e.guild_base_type === "base");
		const facilities = entries.filter((e) => e.guild_base_type === "facility");
		const skills = entries.filter((e) => e.guild_base_type === "skill");
		expect(bases.length).toBe(GUILD_BASES.length);
		expect(facilities.length).toBe(GUILD_FACILITIES.length);
		expect(skills.length).toBe(GUILD_SKILLS.length);
	});

	it("every entry is RA canon with a name, blurb, and discriminator", async () => {
		const entries = await staticDataProvider.getGuildBase("");
		for (const entry of entries) {
			expect(entry.source_book).toBe("Rift Ascendant Canon");
			expect(entry.guild_base_type).toMatch(/^(base|facility|skill)$/);
			expect(entry.name.length).toBeGreaterThan(0);
			expect((entry.description ?? "").length).toBeGreaterThan(0);
		}
	});

	it("base entries surface cost, bundled facilities, and mark the buildable lot", async () => {
		const entries = await staticDataProvider.getGuildBase("");
		const bases = entries.filter((e) => e.guild_base_type === "base");
		for (const base of bases) {
			expect(base.cost?.amount).toBeGreaterThan(0);
			expect(base.included_facilities).toBeDefined();
		}
		// Exactly one buildable lot, and it bundles no facilities.
		const lots = bases.filter((e) => e.is_lot);
		expect(lots.length).toBe(1);
		expect(Object.keys(lots[0].included_facilities ?? {}).length).toBe(0);
		// The pre-built bases each bundle at least one facility tier.
		for (const base of bases.filter((e) => !e.is_lot)) {
			expect(
				Object.keys(base.included_facilities ?? {}).length,
			).toBeGreaterThan(0);
		}
	});

	it("facilities surface 3 upgrade tiers; skills surface cost + grounded benefits", async () => {
		const entries = await staticDataProvider.getGuildBase("");
		const facility = entries.find((e) => e.guild_base_type === "facility");
		const skill = entries.find((e) => e.guild_base_type === "skill");

		expect(facility?.tiers?.length).toBe(3);
		for (const tier of facility?.tiers ?? []) {
			expect(tier.cost.amount).toBeGreaterThan(0);
			// Honest model: each tier grants a real capability / effect / benefit.
			expect(summarizeGuildBenefits(tier).length).toBeGreaterThan(0);
		}
		expect(skill?.cost?.amount).toBeGreaterThan(0);
		expect(
			summarizeGuildBenefits({
				capability: skill?.capability ?? undefined,
				effects: skill?.guild_effects ?? undefined,
				benefit: skill?.benefit ?? undefined,
			}).length,
		).toBeGreaterThan(0);
	});

	it("filters by search across name + summary/description", async () => {
		const results = await staticDataProvider.getGuildBase("barracks");
		expect(results.some((e) => e.id === "barracks")).toBe(true);
		expect(results.every((e) => e.id !== "forge")).toBe(true);
	});

	it("folds guild salvage materials into the Crafting category with their value", async () => {
		const crafting = await staticDataProvider.getCrafting("");
		for (const material of GUILD_BASE_MATERIALS) {
			const mapped = crafting.find((e) => e.id === material.id);
			expect(mapped, `${material.id} should appear in Crafting`).toBeDefined();
			expect(mapped?.crafting_type).toBe("material");
			expect(mapped?.material_type).toBe("guild-salvage");
			expect(mapped?.rarity).toBe(material.rarity);
			expect(mapped?.source).toBe(material.source);
			expect(mapped?.uses).toBe(material.uses);
			expect(mapped?.cost).toEqual(material.value);
		}
	});

	it("prices materials across varied denominations (mana → core)", () => {
		const currencies = new Set(
			GUILD_BASE_MATERIALS.map((m) => m.value.currency),
		);
		// Catalog spans multiple credit types, not just Rift.
		expect(currencies.size).toBeGreaterThanOrEqual(3);
		expect(currencies.has("core")).toBe(true);
		for (const material of GUILD_BASE_MATERIALS) {
			expect(material.value.amount).toBeGreaterThan(0);
		}
	});
});
