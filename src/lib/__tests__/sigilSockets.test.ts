import { describe, expect, it } from "vitest";
import {
	applySigilBonuses,
	attemptAddSocket,
	canPerformSocketWork,
	getDefaultSigilSlotsBaseForEquipment,
	getEffectiveSigilSlots,
	getMaxSocketsForRarity,
	getSigilSlotBonusForRarity,
	getSocketCraftingDC,
	isSigilCompatibleWithEquipment,
	type SocketCraftingContext,
	type SocketCraftingResult,
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
					name: "Ascendant Helm",
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

	it("applies flat ability bonus keys (e.g. intelligence_bonus)", () => {
		const result = applySigilBonuses(
			{
				ac: 10,
				speed: 30,
				abilities: {},
				attackBonus: 0,
				damageBonus: "",
				traits: [],
			},
			[
				{
					is_active: true,
					sigil: {
						passive_bonuses: {
							intelligence_bonus: 2,
							wisdom_bonus: 1,
							strength_bonus: 3,
						},
					},
				},
			],
		);
		expect(result.abilities.intelligence).toBe(2);
		expect(result.abilities.wisdom).toBe(1);
		expect(result.abilities.strength).toBe(3);
	});

	it("prefers higher value between flat bonus keys and nested ability_scores", () => {
		const result = applySigilBonuses(
			{
				ac: 10,
				speed: 30,
				abilities: { intelligence: 14 },
				attackBonus: 0,
				damageBonus: "",
				traits: [],
			},
			[
				{
					is_active: true,
					sigil: {
						passive_bonuses: {
							ability_scores: { intelligence: 16 },
							intelligence_bonus: 18,
						},
					},
				},
			],
		);
		// flat key (18) should win over nested (16) and initial (14)
		expect(result.abilities.intelligence).toBe(18);
	});

	it("handles string damage_bonus in passive_bonuses", () => {
		const result = applySigilBonuses(
			{
				ac: 10,
				speed: 30,
				abilities: {},
				attackBonus: 0,
				damageBonus: "",
				traits: [],
			},
			[
				{
					is_active: true,
					sigil: {
						passive_bonuses: {
							damage_bonus: "1d6 fire",
						},
					},
				},
			],
		);
		expect(result.damageBonus).toBe("1d6 fire");
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

describe("socket crafting DC", () => {
	it("returns base 10 for common with 0 existing sockets", () => {
		expect(getSocketCraftingDC("common", 0)).toBe(10);
	});

	it("scales by rarity step × 3", () => {
		expect(getSocketCraftingDC("uncommon", 0)).toBe(13);
		expect(getSocketCraftingDC("rare", 0)).toBe(16);
		expect(getSocketCraftingDC("very_rare", 0)).toBe(19);
		expect(getSocketCraftingDC("legendary", 0)).toBe(25);
	});

	it("scales by existing sockets × 3", () => {
		expect(getSocketCraftingDC("common", 1)).toBe(13);
		expect(getSocketCraftingDC("common", 2)).toBe(16);
		expect(getSocketCraftingDC("rare", 2)).toBe(22);
	});
});

describe("max sockets for rarity", () => {
	it.each([
		["common", 1],
		["uncommon", 2],
		["rare", 3],
		["very_rare", 4],
		["legendary", 5],
		["artifact", 6],
		[null, 1],
	])("maps %s to max %i sockets", (rarity, expected) => {
		expect(getMaxSocketsForRarity(rarity)).toBe(expected);
	});
});

describe("canPerformSocketWork", () => {
	it("allows technomancer job", () => {
		expect(canPerformSocketWork({ job: "Technomancer" })).toEqual({
			allowed: true,
			source: "technomancer",
		});
	});

	it("allows Aetheric Inscriptor feat", () => {
		expect(
			canPerformSocketWork({
				job: "Fighter",
				features: [{ name: "Aetheric Inscriptor" }],
			}),
		).toEqual({ allowed: true, source: "feat" });
	});

	it("rejects characters without qualifying job or feat", () => {
		expect(
			canPerformSocketWork({
				job: "Fighter",
				features: [{ name: "Great Weapon Master" }],
			}),
		).toEqual({ allowed: false, source: null });
	});
});

describe("attemptAddSocket", () => {
	const baseCtx: SocketCraftingContext = {
		currentSlots: 0,
		equipmentRarity: "common",
		intModifier: 3,
		proficiencyBonus: 2,
		isProficient: true,
		hasExpertise: false,
		isTechnomancer: false,
		hasInscriptorFeat: false,
		roll: 10,
	};

	it("blocks when at max sockets", () => {
		const result: SocketCraftingResult = attemptAddSocket({
			...baseCtx,
			currentSlots: 1,
		});
		expect(result.success).toBe(false);
		expect(result.materialsConsumed).toBe(false);
		expect(result.narrative).toContain("maximum socket capacity");
	});

	it("succeeds on a passing roll", () => {
		// DC = 10 (common, 0 slots), check = 10 + 3 (INT) + 2 (prof) = 15
		const result = attemptAddSocket(baseCtx);
		expect(result.success).toBe(true);
		expect(result.newSlotsBase).toBe(1);
		expect(result.dc).toBe(10);
		expect(result.checkTotal).toBe(15);
		expect(result.materialsConsumed).toBe(true);
	});

	it("critical fail causes item damage", () => {
		const result = attemptAddSocket({ ...baseCtx, roll: 1 });
		expect(result.success).toBe(false);
		expect(result.itemDamaged).toBe(true);
		expect(result.materialsConsumed).toBe(true);
	});

	it("critical success or margin >= 10 grants quality modifier", () => {
		const result = attemptAddSocket({ ...baseCtx, roll: 20 });
		expect(result.success).toBe(true);
		expect(result.qualityModifier).toBe(1);
	});

	it("close failure (margin -1 to -5) consumes materials without damage", () => {
		// DC = 10, check = 2 + 3 + 2 = 7, margin = -3
		const result = attemptAddSocket({ ...baseCtx, roll: 2 });
		expect(result.success).toBe(false);
		expect(result.materialsConsumed).toBe(true);
		expect(result.itemDamaged).toBe(false);
	});

	it("applies expertise double proficiency", () => {
		// DC = 10, check = 10 + 3 + 4 (expertise) = 17
		const result = attemptAddSocket({
			...baseCtx,
			hasExpertise: true,
		});
		expect(result.checkTotal).toBe(17);
		expect(result.success).toBe(true);
	});

	it("applies technomancer proficiency when not otherwise proficient", () => {
		// DC = 10, check = 10 + 3 + 2 (tech PB) = 15
		const result = attemptAddSocket({
			...baseCtx,
			isProficient: false,
			isTechnomancer: true,
		});
		expect(result.checkTotal).toBe(15);
	});

	it("applies Aetheric Inscriptor feat bonus", () => {
		// DC = 10, check = 10 + 3 + 2 (prof) + 2 (feat) = 17
		const result = attemptAddSocket({
			...baseCtx,
			hasInscriptorFeat: true,
		});
		expect(result.checkTotal).toBe(17);
	});
});
