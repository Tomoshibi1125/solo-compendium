import type { Database } from "@/integrations/supabase/types";
import type { RuneBonusResult } from "./runeAutomation";

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
		case "very_rare":
		case "very rare":
			return 3;
		case "legendary":
			return 4;
		case "artifact":
			return 5;
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
	// By default, base slots are 0 to allow rarity-based scaling (0 for common, 1 for uncommon, etc.)
	// Rare/Exotic base items can override this by having a non-zero sigil_slots_base in the DB.
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

/**
 * Apply passive bonuses from active sigils to character stats.
 */
export function applySigilBonuses(
	initialBonuses: Omit<RuneBonusResult, "traits"> & { traits?: string[] },
	activeSigils: Array<{ sigil: any; is_active: boolean }>,
): RuneBonusResult {
	const totalBonuses: RuneBonusResult = {
		...initialBonuses,
		traits: initialBonuses.traits || [],
	};

	for (const { sigil, is_active } of activeSigils) {
		if (!is_active || !sigil) continue;

		const bonuses = sigil.passive_bonuses as Record<string, unknown>;
		if (!bonuses || typeof bonuses !== "object") continue;

		if (bonuses.ac_bonus && typeof bonuses.ac_bonus === "number") {
			totalBonuses.ac += bonuses.ac_bonus;
		}

		if (bonuses.speed_bonus && typeof bonuses.speed_bonus === "number") {
			totalBonuses.speed += bonuses.speed_bonus;
		}

		if (bonuses.attack_bonus && typeof bonuses.attack_bonus === "number") {
			totalBonuses.attackBonus += bonuses.attack_bonus;
		}

		if (bonuses.damage_bonus !== undefined) {
			if (typeof bonuses.damage_bonus === "number") {
				// If initial damage bonus is numeric, add. If string, convert to string.
				const currentDamage = totalBonuses.damageBonus;
				if (!currentDamage) {
					totalBonuses.damageBonus =
						bonuses.damage_bonus > 0
							? `+${bonuses.damage_bonus}`
							: `${bonuses.damage_bonus}`;
				} else if (/^[+-]?\d+$/.test(currentDamage)) {
					const newVal = parseInt(currentDamage) + bonuses.damage_bonus;
					totalBonuses.damageBonus = newVal > 0 ? `+${newVal}` : `${newVal}`;
				} else {
					totalBonuses.damageBonus = `${currentDamage} + ${bonuses.damage_bonus}`;
				}
			} else if (typeof bonuses.damage_bonus === "string") {
				totalBonuses.damageBonus = totalBonuses.damageBonus
					? `${totalBonuses.damageBonus} + ${bonuses.damage_bonus}`
					: bonuses.damage_bonus;
			}
		}

		if (bonuses.ability_scores && typeof bonuses.ability_scores === "object") {
			const scores = bonuses.ability_scores as Record<string, number>;
			Object.entries(scores).forEach(([ability, value]) => {
				const current = totalBonuses.abilities[ability] || 0;
				totalBonuses.abilities[ability] = Math.max(current, value);
			});
		}

		if (Array.isArray(bonuses.traits)) {
			bonuses.traits.forEach((trait: unknown) => {
				if (typeof trait === "string" && !totalBonuses.traits.includes(trait)) {
					totalBonuses.traits.push(trait);
				}
			});
		}
	}

	return totalBonuses;
}
