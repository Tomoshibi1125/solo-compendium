import { describe, expect, it } from "vitest";
import {
	applySigilBonuses,
	getDefaultSigilSlotsBaseForEquipment,
	getEffectiveSigilSlots,
	getSigilSlotBonusForRarity,
	isSigilCompatibleWithEquipment,
	validateSigilInscription,
} from "@/lib/sigilAutomation";

describe("sigil socket rarity ladder", () => {
	it.each([
		["common", 0],
		["uncommon", 1],
		["rare", 2],
		["very_rare", 3],
		["very rare", 3],
		["legendary", 4],
		["artifact", 5],
		[null, 0],
		[undefined, 0],
	])("maps %s rarity to %i bonus sockets", (rarity, expected) => {
		expect(getSigilSlotBonusForRarity(rarity)).toBe(expected);
	});

	it("keeps default base sockets at zero so rarity owns the ladder", () => {
		expect(
			getDefaultSigilSlotsBaseForEquipment({
				item_type: "weapon",
				properties: ["martial"],
				name: "Test Blade",
				rarity: "legendary",
			}),
		).toBe(0);
	});

	it("combines explicit base sockets with rarity bonus", () => {
		expect(
			getEffectiveSigilSlots({ sigil_slots_base: 0, rarity: "common" }),
		).toBe(0);
		expect(
			getEffectiveSigilSlots({ sigil_slots_base: 0, rarity: "uncommon" }),
		).toBe(1);
		expect(
			getEffectiveSigilSlots({ sigil_slots_base: 0, rarity: "rare" }),
		).toBe(2);
		expect(
			getEffectiveSigilSlots({ sigil_slots_base: 0, rarity: "very_rare" }),
		).toBe(3);
		expect(
			getEffectiveSigilSlots({ sigil_slots_base: 0, rarity: "legendary" }),
		).toBe(4);
		expect(
			getEffectiveSigilSlots({ sigil_slots_base: 0, rarity: "artifact" }),
		).toBe(5);
		expect(
			getEffectiveSigilSlots({ sigil_slots_base: 2, rarity: "rare" }),
		).toBe(4);
	});

	it("validates slot bounds, occupancy, and equipment compatibility", () => {
		const equipment = {
			id: "eq-weapon",
			item_type: "weapon",
			properties: ["martial"],
			name: "Rare Test Blade",
			rarity: "rare",
			sigil_slots_base: 0,
		};

		expect(
			validateSigilInscription({
				equipment,
				sigil: { can_inscribe_on: ["weapon"] },
				slotIndex: 1,
				existingInscriptions: [],
			}),
		).toEqual({ allowed: true });
		expect(
			validateSigilInscription({
				equipment,
				sigil: { can_inscribe_on: ["weapon"] },
				slotIndex: 2,
				existingInscriptions: [],
			}),
		).toEqual({ allowed: false, reason: "Invalid slot" });
		expect(
			validateSigilInscription({
				equipment,
				sigil: { can_inscribe_on: ["weapon"] },
				slotIndex: 0,
				existingInscriptions: [
					{ equipment_id: "eq-weapon", slot_index: 0, is_active: true },
					{ equipment_id: "eq-weapon", slot_index: 1, is_active: false },
				],
			}),
		).toEqual({ allowed: false, reason: "Slot already occupied" });
		expect(
			validateSigilInscription({
				equipment,
				sigil: { can_inscribe_on: ["armor"] },
				slotIndex: 1,
				existingInscriptions: [],
			}),
		).toEqual({
			allowed: false,
			reason: "Sigil cannot be inscribed on this equipment",
		});
	});

	it("matches accessory aliases without treating accessory as a weapon wildcard", () => {
		expect(
			isSigilCompatibleWithEquipment(
				{ can_inscribe_on: ["accessory"] },
				{
					item_type: "gear",
					properties: ["ring"],
					name: "Ring of Testing",
				},
			),
		).toBe(true);
		expect(
			isSigilCompatibleWithEquipment(
				{ can_inscribe_on: ["accessory"] },
				{
					item_type: "weapon",
					properties: ["martial"],
					name: "Test Blade",
				},
			),
		).toBe(false);
		expect(
			isSigilCompatibleWithEquipment(
				{ can_inscribe_on: ["helmet"] },
				{
					item_type: "armor",
					properties: [],
					name: "Hunter Helm",
				},
			),
		).toBe(true);
		expect(
			isSigilCompatibleWithEquipment(
				{ can_inscribe_on: ["goggles"] },
				{
					item_type: "gear",
					properties: [],
					name: "Goggles of Testing",
				},
			),
		).toBe(true);
	});

	it("aggregates active passive sigil bonuses for derived stat consumers", () => {
		const result = applySigilBonuses(
			{
				ac: 16,
				speed: 30,
				abilities: { AGI: 14, STR: 12 },
				attackBonus: 1,
				damageBonus: "+1",
				traits: ["Existing"],
			},
			[
				{
					is_active: true,
					sigil: {
						passive_bonuses: {
							ac_bonus: 2,
							speed_bonus: 10,
							attack_bonus: 2,
							damage_bonus: 3,
							ability_scores: { AGI: 18, STR: 10 },
							traits: ["Keen", "Existing"],
						},
					},
				},
				{
					is_active: false,
					sigil: {
						passive_bonuses: {
							ac_bonus: 99,
							speed_bonus: 99,
							attack_bonus: 99,
							damage_bonus: 99,
							ability_scores: { AGI: 30 },
							traits: ["Inactive"],
						},
					},
				},
			],
		);

		expect(result).toEqual({
			ac: 18,
			speed: 40,
			abilities: { AGI: 18, STR: 12 },
			attackBonus: 3,
			damageBonus: "+4",
			traits: ["Existing", "Keen"],
		});
	});
});
