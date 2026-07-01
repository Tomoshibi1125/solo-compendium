import type { Database, Json } from "@/integrations/supabase/types";

export interface SigilBonusResult {
	ac: number;
	speed: number;
	abilities: Record<string, number>;
	attackBonus: number;
	damageBonus: string;
	traits: string[];
}
type SigilInscriptionRow =
	Database["public"]["Tables"]["character_sigil_inscriptions"]["Row"];

type SigilCompatibleEquipment = {
	id: string;
	item_type: string | null | undefined;
	properties: string[] | null;
	name: string;
	rarity?: string | null | undefined;
	sigil_slots_base?: number | null;
};

type SigilCompatibleEntry = {
	can_inscribe_on?: string[] | null;
};

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
		case "epic":
			return 3;
		case "legendary":
			return 4;
		case "mythic":
			return 4;
		case "artifact":
			return 5;
		default:
			return 0;
	}
}

export function getDefaultSigilSlotsBaseForEquipment(_equipment: {
	item_type: string | null | undefined;
	properties: string[] | null;
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
	properties: string[] | null;
	name: string;
}): string {
	const itemType = (equipment.item_type || "").toLowerCase();
	const name = (equipment.name || "").toLowerCase();
	const props = (
		Array.isArray(equipment.properties) ? equipment.properties : []
	).map((p) => String(p).toLowerCase());

	if (itemType === "weapon") return "weapon";
	if (
		name.includes("shield") ||
		props.includes("shield") ||
		itemType === "shield"
	)
		return "shield";

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
		name.includes("goggle") ||
		name.includes("glasses") ||
		props.includes("goggles") ||
		props.includes("glasses")
	)
		return "goggles";
	if (
		name.includes("helm") ||
		name.includes("helmet") ||
		name.includes("hood") ||
		props.includes("helm") ||
		props.includes("helmet") ||
		props.includes("hood")
	)
		return "headwear";

	if (itemType === "armor") return "armor";

	return "accessory";
}

function normalizeSigilCategory(category: string): string {
	return category
		.trim()
		.toLowerCase()
		.replace(/[\s-]+/g, "_");
}

function getEquipmentSigilCategoryAliases(category: string): Set<string> {
	const normalized = normalizeSigilCategory(category);
	const aliases = new Set([normalized]);
	if (normalized === "headwear" || normalized === "helmet") {
		aliases.add("headwear");
		aliases.add("helmet");
		aliases.add("helm");
		aliases.add("hood");
	}
	if (
		[
			"ring",
			"amulet",
			"cloak",
			"belt",
			"gloves",
			"bracers",
			"boots",
			"headwear",
			"helmet",
			"goggles",
			"accessory",
		].includes(normalized)
	) {
		aliases.add("accessory");
	}
	return aliases;
}

export function isSigilCompatibleWithEquipment(
	sigil: SigilCompatibleEntry,
	equipment: {
		item_type: string | null | undefined;
		properties: string[] | null;
		name: string;
	},
): boolean {
	const allowed = Array.isArray(sigil.can_inscribe_on)
		? sigil.can_inscribe_on.map(normalizeSigilCategory)
		: [];
	if (allowed.length === 0) return false;
	const equipmentCategory = getEquipmentSigilCategory(equipment);
	const aliases = getEquipmentSigilCategoryAliases(equipmentCategory);
	return allowed.some((category) => aliases.has(category));
}

export function validateSigilInscription(input: {
	equipment: SigilCompatibleEquipment;
	sigil: SigilCompatibleEntry;
	slotIndex: number;
	existingInscriptions?: Array<
		Pick<SigilInscriptionRow, "equipment_id" | "slot_index" | "is_active">
	>;
}): { allowed: true } | { allowed: false; reason: string } {
	const effectiveSlots = getEffectiveSigilSlots(input.equipment);
	if (effectiveSlots <= 0) {
		return { allowed: false, reason: "This equipment has no sigil slots" };
	}
	if (
		!Number.isInteger(input.slotIndex) ||
		input.slotIndex < 0 ||
		input.slotIndex >= effectiveSlots
	) {
		return { allowed: false, reason: "Invalid slot" };
	}
	const slotOccupied = (input.existingInscriptions ?? []).some(
		(inscription) =>
			inscription.is_active !== false &&
			inscription.equipment_id === input.equipment.id &&
			inscription.slot_index === input.slotIndex,
	);
	if (slotOccupied) {
		return { allowed: false, reason: "Slot already occupied" };
	}
	if (!isSigilCompatibleWithEquipment(input.sigil, input.equipment)) {
		return {
			allowed: false,
			reason: "Sigil cannot be inscribed on this equipment",
		};
	}
	return { allowed: true };
}

// ─── Socket Crafting System ──────────────────────────────────────────────────
// Socket increases are magical gear work requiring a Technomancer or a character
// with an appropriate feat (e.g. Aetheric Inscriptor). Quality affects risk.

export interface SocketCraftingContext {
	/** Current sigil_slots_base on the target equipment */
	currentSlots: number;
	/** Equipment rarity for DC scaling */
	equipmentRarity: string | null | undefined;
	/** Crafter's Intelligence modifier (used as the relevant ability for this skill check) */
	intModifier: number;
	/** Crafter's proficiency bonus */
	proficiencyBonus: number;
	/** Whether crafter is proficient in the relevant skill (Arcana / Inscription Tools) */
	isProficient: boolean;
	/** Whether crafter has expertise (double proficiency) in Inscription Tools */
	hasExpertise: boolean;
	/** Whether crafter is a Technomancer (class features grant additional bonuses) */
	isTechnomancer: boolean;
	/** Whether crafter has the Aetheric Inscriptor feat */
	hasInscriptorFeat: boolean;
	/** Optional: Technomancer level for scaling bonuses */
	technomancerLevel?: number;
	/** Natural d20 roll (1-20) */
	roll: number;
}

export interface SocketCraftingResult {
	success: boolean;
	/** New sigil_slots_base value (only if success) */
	newSlotsBase: number;
	/** Total check result */
	checkTotal: number;
	/** Target DC */
	dc: number;
	/** Quality modifier applied to future inscriptions on this slot */
	qualityModifier: number;
	/** Narrative description of outcome */
	narrative: string;
	/** Whether materials are consumed (always on success, conditional on fail) */
	materialsConsumed: boolean;
	/** Whether the item took cosmetic damage (critical fail only) */
	itemDamaged: boolean;
}

/**
 * Rarity step index used for DC calculation.
 * Formula: DC = 10 + (rarityStep × 3) + (existingSockets × 3)
 *
 * Rationale: Common items have simpler mana lattice structures (DC 10).
 * Each rarity tier adds denser lattice weaving (+3 per tier).
 * Each existing socket compresses remaining lattice space (+3 per socket).
 */
const RARITY_STEP: Record<string, number> = {
	common: 0,
	uncommon: 1,
	rare: 2,
	very_rare: 3,
	"very rare": 3,
	epic: 4,
	legendary: 5,
	mythic: 5,
	artifact: 6,
};

/**
 * Calculate the DC for adding a socket to equipment.
 * DC = 10 + (rarityStep × 3) + (existingSockets × 3)
 *
 * - Base 10: minimum skill to manipulate any mana lattice
 * - +3 per rarity tier: denser lattice = harder to carve without disruption
 * - +3 per existing socket: remaining lattice area shrinks, precision required
 */
export function getSocketCraftingDC(
	equipmentRarity: string | null | undefined,
	currentSlots: number,
): number {
	const rarity = (equipmentRarity || "common").toLowerCase();
	const step = RARITY_STEP[rarity] ?? 0;
	return 10 + step * 3 + currentSlots * 3;
}

/**
 * Get the maximum number of sockets an item can ever have based on rarity.
 * Even with crafting, items have an upper bound.
 */
export function getMaxSocketsForRarity(
	rarity: string | null | undefined,
): number {
	switch ((rarity || "common").toLowerCase()) {
		case "common":
			return 1;
		case "uncommon":
			return 2;
		case "rare":
			return 3;
		case "very_rare":
		case "very rare":
			return 4;
		case "epic":
			return 4;
		case "legendary":
			return 5;
		case "mythic":
			return 5;
		case "artifact":
			return 6;
		default:
			return 1;
	}
}

/**
 * Check whether a character can perform socket crafting work.
 * Requires Technomancer job or Aetheric Inscriptor feat.
 */
export function canPerformSocketWork(character: {
	job?: string | null;
	features?: Array<{ name: string; source?: string | null }>;
}): { allowed: boolean; source: "technomancer" | "feat" | null } {
	const job = (character.job || "").toLowerCase().replace(/[\s-]+/g, "");
	if (job === "technomancer") {
		return { allowed: true, source: "technomancer" };
	}
	const hasFeat = (character.features || []).some(
		(f) =>
			f.name.toLowerCase().includes("aetheric inscriptor") ||
			f.name.toLowerCase().includes("sigil crafter") ||
			f.source?.toLowerCase().includes("aetheric inscriptor"),
	);
	if (hasFeat) {
		return { allowed: true, source: "feat" };
	}
	return { allowed: false, source: null };
}

/**
 * Attempt to add a sigil socket to a piece of equipment.
 * Returns detailed result including success/fail, quality, and narrative.
 */
export function attemptAddSocket(
	ctx: SocketCraftingContext,
): SocketCraftingResult {
	const dc = getSocketCraftingDC(ctx.equipmentRarity, ctx.currentSlots);
	const maxSlots = getMaxSocketsForRarity(ctx.equipmentRarity);

	// Cannot exceed max sockets for rarity
	if (ctx.currentSlots >= maxSlots) {
		return {
			success: false,
			newSlotsBase: ctx.currentSlots,
			checkTotal: 0,
			dc,
			qualityModifier: 0,
			narrative: `This ${ctx.equipmentRarity || "common"} item has reached its maximum socket capacity (${maxSlots}).`,
			materialsConsumed: false,
			itemDamaged: false,
		};
	}

	// Check = d20 + INT mod + skill proficiency component + class/feat bonuses
	// Skill: Arcana (Intelligence) or Inscription Tools proficiency
	let bonus = ctx.intModifier;

	// Proficiency component
	if (ctx.hasExpertise) {
		// Expertise = double proficiency bonus
		bonus += ctx.proficiencyBonus * 2;
	} else if (ctx.isProficient) {
		bonus += ctx.proficiencyBonus;
	}

	// Technomancer class bonuses (stacks with proficiency)
	if (ctx.isTechnomancer) {
		// Technomancers always add PB to inscription work (Mandate Vision)
		if (!ctx.isProficient && !ctx.hasExpertise) {
			bonus += ctx.proficiencyBonus;
		}
		// Overclocked Crafting (level 10+): +2 to all crafting checks
		if (ctx.technomancerLevel && ctx.technomancerLevel >= 10) {
			bonus += 2;
		}
	}

	// Aetheric Inscriptor feat: flat +2 to inscription checks
	if (ctx.hasInscriptorFeat) {
		bonus += 2;
	}

	const checkTotal = ctx.roll + bonus;
	const margin = checkTotal - dc;
	const isCritFail = ctx.roll === 1;
	const isCritSuccess = ctx.roll === 20;

	if (isCritFail) {
		return {
			success: false,
			newSlotsBase: ctx.currentSlots,
			checkTotal,
			dc,
			qualityModifier: 0,
			narrative:
				"Critical failure — the mana lattice rejects the inscription violently. Materials are destroyed and the item's surface is scorched.",
			materialsConsumed: true,
			itemDamaged: true,
		};
	}

	if (isCritSuccess || margin >= 10) {
		// Exceptional success — high quality socket
		return {
			success: true,
			newSlotsBase: ctx.currentSlots + 1,
			checkTotal,
			dc,
			qualityModifier: 1,
			narrative:
				"Masterwork inscription — the new socket resonates perfectly with the item's mana lattice. Future sigils inscribed here gain enhanced stability.",
			materialsConsumed: true,
			itemDamaged: false,
		};
	}

	if (margin >= 0) {
		// Standard success
		return {
			success: true,
			newSlotsBase: ctx.currentSlots + 1,
			checkTotal,
			dc,
			qualityModifier: 0,
			narrative:
				"The socket carves cleanly into the equipment's lattice structure. A new sigil slot is ready for inscription.",
			materialsConsumed: true,
			itemDamaged: false,
		};
	}

	if (margin >= -5) {
		// Close failure — materials consumed but no damage
		return {
			success: false,
			newSlotsBase: ctx.currentSlots,
			checkTotal,
			dc,
			qualityModifier: 0,
			narrative:
				"The inscription destabilizes before completion — the lattice reseals. Materials are consumed but the item is undamaged.",
			materialsConsumed: true,
			itemDamaged: false,
		};
	}

	// Severe failure — materials consumed, cosmetic damage
	return {
		success: false,
		newSlotsBase: ctx.currentSlots,
		checkTotal,
		dc,
		qualityModifier: 0,
		narrative:
			"The mana flow overloads the inscription point. Materials are destroyed and the item bears minor lattice scarring.",
		materialsConsumed: true,
		itemDamaged: true,
	};
}

/**
 * Apply passive bonuses from active sigils to character stats.
 */
export function applySigilBonuses(
	initialBonuses: Omit<SigilBonusResult, "traits"> & { traits?: string[] },
	activeSigils: Array<{
		sigil: Record<string, Json>;
		is_active: boolean;
	}>,
): SigilBonusResult {
	const totalBonuses: SigilBonusResult = {
		...initialBonuses,
		traits: initialBonuses.traits || [],
	};

	for (const { sigil, is_active } of activeSigils) {
		if (!is_active || !sigil) continue;

		const bonuses = sigil.passive_bonuses as Record<string, Json> | null;
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
					const newVal = parseInt(currentDamage, 10) + bonuses.damage_bonus;
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

		// Flat ability bonus keys: strength_bonus, dexterity_bonus, etc.
		const abilityBonusKeys = [
			"strength",
			"dexterity",
			"constitution",
			"intelligence",
			"wisdom",
			"charisma",
		];
		for (const ability of abilityBonusKeys) {
			const key = `${ability}_bonus`;
			if (typeof bonuses[key] === "number") {
				const current = totalBonuses.abilities[ability] || 0;
				totalBonuses.abilities[ability] = Math.max(
					current,
					bonuses[key] as number,
				);
			}
		}

		if (Array.isArray(bonuses.traits)) {
			bonuses.traits.forEach((trait: Json) => {
				if (typeof trait === "string" && !totalBonuses.traits.includes(trait)) {
					totalBonuses.traits.push(trait);
				}
			});
		}
	}

	return totalBonuses;
}
