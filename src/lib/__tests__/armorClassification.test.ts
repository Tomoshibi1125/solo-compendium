/**
 * Worn-armor classification guard (Jul 18 deep audit, Phase A).
 *
 * "light"/"medium"/"heavy" are 5e WEAPON properties as well as armor
 * tiers. The derived-stats hook classified any equipped row whose
 * properties contained those tokens as worn armor, so an equipped
 * Sickle ("light") made the AC engine pick the Armored formula
 * (10 + AGI from the parse fallback) and disqualified every unarmored-
 * defense formula — a level-1 Revenant showed AC 11 instead of 15 on
 * the live sheet with NO armor in inventory.
 */
import { describe, expect, it } from "vitest";
import { isWornArmorRow } from "@/lib/equipmentModifiers";

describe("isWornArmorRow", () => {
	it("light/heavy WEAPONS are never worn armor (the Sickle bug)", () => {
		expect(
			isWornArmorRow({
				item_type: "weapon",
				properties: ["1d4 slashing", "simple melee", "light"],
			}),
		).toBe(false);
		expect(
			isWornArmorRow({
				item_type: "weapon",
				properties: ["2d6 slashing", "martial melee", "heavy", "two-handed"],
			}),
		).toBe(false);
	});

	it("bare tier tokens do not classify non-armor gear as armor", () => {
		// A misc row with a stray "light" property (e.g. a lantern's "light")
		// must not become armor either.
		expect(isWornArmorRow({ item_type: "misc", properties: ["light"] })).toBe(
			false,
		);
	});

	it("armor-typed rows are worn armor", () => {
		expect(
			isWornArmorRow({ item_type: "armor", properties: ["light", "ac 12"] }),
		).toBe(true);
	});

	it("explicit '<tier> armor' properties classify homebrew gear as armor", () => {
		expect(
			isWornArmorRow({
				item_type: "gear",
				properties: ["light armor", "ac 11"],
			}),
		).toBe(true);
		expect(
			isWornArmorRow({
				item_type: "gear",
				properties: ["Heavy Armor", "ac 16"],
			}),
		).toBe(true);
	});

	it("shields are not WORN armor (they must not suppress unarmored defense)", () => {
		expect(
			isWornArmorRow({ item_type: "armor", properties: ["shield", "+2 ac"] }),
		).toBe(false);
		expect(isWornArmorRow({ item_type: "shield", properties: [] })).toBe(false);
	});

	it("tolerates null/missing fields", () => {
		expect(isWornArmorRow({})).toBe(false);
		expect(isWornArmorRow({ item_type: null, properties: null })).toBe(false);
		expect(
			isWornArmorRow({ item_type: "armor", properties: [null, undefined] }),
		).toBe(true);
	});
});
