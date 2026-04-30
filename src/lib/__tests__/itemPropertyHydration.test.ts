import { describe, expect, it } from "vitest";
import { linkedEntryToDeliverableItem } from "@/hooks/useWardenItemDelivery";
import { buildItemProperties } from "@/lib/characterCreation";
import { parseModifiers } from "@/lib/equipmentModifiers";
import type { WardenLinkedEntry } from "@/lib/wardenGenerationContext";
import type { CompendiumItem } from "@/types/compendium";

describe("canonical item property hydration", () => {
	it("builds complete weapon properties from canonical fields", () => {
		const item = {
			id: "test-rapier",
			name: "Test Rapier",
			description: "A calibrated blade.",
			item_type: "weapon",
			damage: "1d8",
			damage_type: "piercing",
			weapon_type: "martial melee",
			simple_properties: ["finesse", "light"],
			range: "30/120",
			effects: { passive: ["+1 to attack"] },
		} satisfies CompendiumItem;

		expect(buildItemProperties(item)).toEqual(
			expect.arrayContaining([
				"1d8 piercing",
				"martial melee",
				"finesse",
				"light",
				"Range 30/120",
				"+1 to attack",
			]),
		);
	});

	it("builds complete armor properties from canonical fields", () => {
		const item = {
			id: "test-plate",
			name: "Test Plate",
			description: "Heavy armor.",
			item_type: "armor",
			armor_class: "18",
			armor_type: "heavy",
			stealth_disadvantage: true,
			strength_requirement: 15,
			effects: {
				passive: [
					"Provides AC 18. Requires STR 15+. Stealth checks made with disadvantage.",
				],
			},
		} satisfies CompendiumItem;

		const properties = buildItemProperties(item);

		expect(properties).toEqual(
			expect.arrayContaining(["AC 18", "heavy", "Stealth disadvantage"]),
		);
		expect(
			properties.some((property) => /requires\s+str/i.test(property)),
		).toBe(false);
		expect(parseModifiers(properties).ac).toBe(18);
	});

	it("preserves legacy structured property objects and magical bonuses", () => {
		const item = {
			id: "test-structured-blade",
			name: "Test Structured Blade",
			description: "Legacy-shaped weapon.",
			item_type: "weapon",
			properties: {
				weapon: {
					damage: "1d6",
					damageType: "slashing",
					finesse: true,
					isSimple: true,
				},
				magical: { bonus: { attack: 1, damage: 2 } },
			},
		} as unknown as CompendiumItem;

		const properties = buildItemProperties(item);
		const modifiers = parseModifiers(properties);

		expect(properties).toEqual(
			expect.arrayContaining([
				"1d6 slashing",
				"finesse",
				"simple",
				"+1 to attack",
				"+2 to damage",
			]),
		);
		expect(modifiers.attack).toBe(1);
		expect(modifiers.damage).toBe(2);
	});

	it("hydrates Warden deliverable items the same way as direct compendium adds", () => {
		const linkedEntry = {
			id: "test-delivery-bow",
			type: "equipment",
			name: "Test Delivery Bow",
			description: "A bow delivered by the Warden.",
			rank: null,
			rarity: "uncommon",
			sourceBook: "Rift Ascendant Homebrew",
			tags: [],
			imageUrl: null,
			entry: {
				id: "test-delivery-bow",
				name: "Test Delivery Bow",
				description: "A bow delivered by the Warden.",
				equipment_type: "weapon",
				item_type: "weapon",
				damage: "1d8",
				damage_type: "piercing",
				weapon_type: "martial ranged",
				simple_properties: ["ammunition", "heavy"],
				range: "150/600",
				rarity: "uncommon",
				source_book: "Rift Ascendant Homebrew",
			},
		} satisfies WardenLinkedEntry;

		const deliverable = linkedEntryToDeliverableItem(linkedEntry);

		expect(deliverable.type).toBe("weapon");
		expect(deliverable.properties).toEqual(
			expect.arrayContaining([
				"1d8 piercing",
				"martial ranged",
				"ammunition",
				"heavy",
				"Range 150/600",
			]),
		);
	});
});
