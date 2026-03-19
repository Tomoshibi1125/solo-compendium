import type { Database } from "@/integrations/supabase/types";

export type EquipmentRow =
	Database["public"]["Tables"]["character_equipment"]["Row"];

export type SigilRarity =
	| "common"
	| "uncommon"
	| "rare"
	| "epic"
	| "legendary"
	| "very_rare";

export function getSigilSlotBonusForRarity(
	rarity: string | null | undefined,
): number {
	switch ((rarity || "common").toLowerCase()) {
		case "uncommon":
			return 1;
		case "rare":
			return 2;
		case "epic":
			return 3;
		case "legendary":
			return 4;
		case "very_rare":
			return 3;
		default:
			return 0;
	}
}

export function getDefaultSigilSlotsBaseForEquipment(equipment: {
	item_type: string | null | undefined;
	properties: unknown;
	name: string;
	rarity?: string | null | undefined;
}): number {
	const itemType = (equipment.item_type || "").toLowerCase();
	const name = (equipment.name || "").toLowerCase();
	const props = (
		Array.isArray(equipment.properties) ? equipment.properties : []
	).map((p) => String(p).toLowerCase());

	const isShield =
		itemType === "armor" &&
		(name.includes("shield") || props.includes("shield"));
	if (isShield) return 1;

	if (itemType === "weapon") return 1;
	if (itemType === "armor") return 2;
	if (itemType === "gear") return 1;
	if (itemType === "tool") return 0;

	return 0;
}

export function getEffectiveSigilSlots(equipment: {
	sigil_slots_base?: number | null;
	rarity?: string | null;
}): number {
	const base =
		typeof equipment.sigil_slots_base === "number"
			? equipment.sigil_slots_base
			: 0;
	return base + getSigilSlotBonusForRarity(equipment.rarity);
}

export function getEquipmentSigilCategory(equipment: {
	item_type: string | null | undefined;
	properties: unknown;
	name: string;
}): string {
	const itemType = (equipment.item_type || "").toLowerCase();
	const name = (equipment.name || "").toLowerCase();
	const props = (
		Array.isArray(equipment.properties) ? equipment.properties : []
	).map((p) => String(p).toLowerCase());

	if (itemType === "weapon") return "weapon";
	if (itemType === "armor") {
		if (name.includes("shield") || props.includes("shield")) return "shield";
		return "armor";
	}

	if (
		name.includes("boots") ||
		name.includes("shoes") ||
		name.includes("greaves") ||
		name.includes("sabaton") ||
		props.includes("boots") ||
		props.includes("shoes") ||
		props.includes("greaves")
	)
		return "boots";

	if (name.includes("ring") || props.includes("ring")) return "ring";
	if (
		name.includes("amulet") ||
		name.includes("pendant") ||
		name.includes("necklace") ||
		props.includes("amulet") ||
		props.includes("pendant") ||
		props.includes("necklace")
	)
		return "amulet";
	if (
		name.includes("cloak") ||
		name.includes("cape") ||
		name.includes("mantle") ||
		props.includes("cloak") ||
		props.includes("cape") ||
		props.includes("mantle")
	)
		return "cloak";
	if (
		name.includes("belt") ||
		name.includes("girdle") ||
		props.includes("belt")
	)
		return "belt";
	if (
		name.includes("glove") ||
		name.includes("gauntlet") ||
		props.includes("glove") ||
		props.includes("gauntlet")
	)
		return "gloves";
	if (
		name.includes("bracer") ||
		name.includes("vambrace") ||
		props.includes("bracer") ||
		props.includes("vambrace")
	)
		return "bracers";
	if (
		name.includes("helm") ||
		name.includes("helmet") ||
		name.includes("hood") ||
		props.includes("helm") ||
		props.includes("helmet") ||
		props.includes("hood")
	)
		return "headwear";

	return "accessory";
}

export function applySigilBonuses(
	baseStats: {
		ac: number;
		speed: number;
		abilities: Record<string, number>;
		attackBonus: number;
		damageBonus: string;
	},
	activeSigils: Array<{
		sigil: {
			passive_bonuses: unknown;
		};
		is_active: boolean;
	}>,
): {
	ac: number;
	speed: number;
	abilities: Record<string, number>;
	attackBonus: number;
	damageBonus: string;
} {
	let ac = baseStats.ac;
	let speed = baseStats.speed;
	let attackBonus = baseStats.attackBonus;
	let damageBonus = baseStats.damageBonus;
	const abilities = { ...baseStats.abilities };

	for (const entry of activeSigils) {
		if (!entry.is_active) continue;
		const bonuses = entry.sigil.passive_bonuses as unknown;
		if (!bonuses || typeof bonuses !== "object") continue;
		const b = bonuses as Record<string, unknown>;

		if (typeof b.ac_bonus === "number") ac += b.ac_bonus;
		if (typeof b.speed_bonus === "number") speed += b.speed_bonus;
		if (typeof b.attack_bonus === "number") attackBonus += b.attack_bonus;

		if (typeof b.damage_bonus === "number") {
			const n = b.damage_bonus;
			damageBonus = n === 0 ? damageBonus : `${n >= 0 ? "+" : ""}${n}`;
		} else if (typeof b.damage_bonus === "string") {
			damageBonus = b.damage_bonus;
		}

		const abilityScores = b.ability_scores;
		if (abilityScores && typeof abilityScores === "object") {
			for (const [k, v] of Object.entries(
				abilityScores as Record<string, unknown>,
			)) {
				if (typeof v !== "number") continue;
				const key = k.toUpperCase();
				abilities[key] = (abilities[key] || 0) + v;
			}
		}
	}

	return { ac, speed, abilities, attackBonus, damageBonus };
}
