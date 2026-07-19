/**
 * Encumbrance calculations for Rift Ascendant 5e SRD
 * Based on STR score - Ascendants must manage their Rift loot carefully
 */

interface EncumbranceStatus {
	totalWeight: number;
	carryingCapacity: number;
	pushDragLift: number;
	status: "unencumbered" | "light" | "medium" | "heavy" | "overloaded";
	statusColor: string;
	statusMessage: string;
}

/**
 * Encumbrance tiers, weakest → heaviest.
 *
 * RA uses a deliberately LENIENT load model rather than 5e's optional variant
 * encumbrance: nothing slows you until you exceed your carrying capacity.
 * (Variant encumbrance would penalise from 5×STR, which at the table meant a
 * fully-kitted Ascendant was permanently slowed.)
 *
 * This is the single source of truth — `characterEngine.computeEncumbrance`
 * and `calculateEncumbrance` both derive from it. They previously carried
 * independent thresholds and disagreed about whether a loaded character was
 * slowed at all (Jul 18 audit).
 */
export type EncumbranceTier =
	| "unencumbered"
	| "light"
	| "medium"
	| "heavy"
	| "overloaded";

/** Speed penalty in feet for each tier (subtractive, floored at 0 by callers). */
export const ENCUMBRANCE_SPEED_PENALTY: Record<EncumbranceTier, number> = {
	unencumbered: 0,
	light: 0,
	medium: 0,
	heavy: 10,
	overloaded: 20,
};

/**
 * Classify carried weight against capacity (15 × STR).
 *   ≤33% unencumbered · ≤66% light · ≤100% medium
 *   ≤200% heavy (−10 ft) · >200% overloaded (−20 ft)
 */
export function encumbranceTierForWeight(
	totalWeight: number,
	carryingCapacity: number,
): EncumbranceTier {
	if (totalWeight <= 0 || carryingCapacity <= 0) return "unencumbered";
	const percentage = (totalWeight / carryingCapacity) * 100;
	if (percentage <= 33) return "unencumbered";
	if (percentage <= 66) return "light";
	if (percentage <= 100) return "medium";
	if (percentage <= 200) return "heavy";
	return "overloaded";
}

/**
 * Calculate carrying capacity based on STR score
 * Standard calculation: 15 * STR score
 */
export function calculateCarryingCapacity(strScore: number): number {
	return strScore * 15;
}

/**
 * Calculate push/drag/lift capacity (2x carrying capacity)
 */
export function calculatePushDragLift(strScore: number): number {
	return calculateCarryingCapacity(strScore) * 2;
}

/**
 * Calculate total weight from equipment, respecting magical containers
 */
export function calculateTotalWeight(
	equipment: Array<{
		id?: string;
		container_id?: string | null;
		weight?: number | null;
		quantity?: number | null;
		is_container?: boolean | null;
		is_active?: boolean | null;
		name?: string;
		item_type?: string | null;
	}>,
	ignoreCurrencyWeight: boolean = false,
): number {
	const magicalContainerIds = new Set<string>();
	const inactiveContainerIds = new Set<string>();

	equipment.forEach((item) => {
		if (item.is_container && item.id) {
			if (item.is_active === false) {
				inactiveContainerIds.add(item.id);
			} else if (
				item.name?.toLowerCase().includes("bag of holding") ||
				item.name?.toLowerCase().includes("haversack") ||
				item.name?.toLowerCase().includes("portable hole")
			) {
				magicalContainerIds.add(item.id);
			}
		}
	});

	const isInsideIgnoredContainer = (item: Record<string, unknown>): boolean => {
		let currentId = item.container_id as string | null | undefined;
		let depth = 0;
		while (currentId && depth < 10) {
			if (
				inactiveContainerIds.has(currentId as string) ||
				magicalContainerIds.has(currentId as string)
			) {
				return true;
			}
			const parent = equipment.find((e) => e.id === currentId);
			currentId = parent?.container_id;
			depth++;
		}
		return false;
	};

	return equipment.reduce((total, item) => {
		if (item.is_active === false || isInsideIgnoredContainer(item)) {
			return total;
		}
		if (ignoreCurrencyWeight && item.item_type === "currency") {
			return total;
		}
		const weight = item.weight || 0;
		const quantity = item.quantity || 1;
		return total + weight * quantity;
	}, 0);
}

/**
 * Determine encumbrance status
 * - Unencumbered: 0-33% of capacity
 * - Light: 34-66% of capacity
 * - Medium: 67-100% of capacity
 * - Heavy: 101-200% of capacity (speed reduced by 10)
 * - Overloaded: >200% of capacity (speed reduced by 20, disadvantage on STR/AGI/AGI checks)
 */
export function calculateEncumbrance(
	totalWeight: number,
	carryingCapacity: number,
): EncumbranceStatus {
	const status = encumbranceTierForWeight(totalWeight, carryingCapacity);

	const PRESENTATION: Record<
		EncumbranceTier,
		{ statusColor: string; statusMessage: string }
	> = {
		unencumbered: {
			statusColor: "text-success",
			statusMessage: totalWeight === 0 ? "No encumbrance" : "Unencumbered",
		},
		light: { statusColor: "text-shadow-blue", statusMessage: "Light Load" },
		medium: { statusColor: "text-warning", statusMessage: "Medium Load" },
		heavy: {
			statusColor: "text-resurge",
			statusMessage: "Heavy Load (Speed -10)",
		},
		overloaded: {
			statusColor: "text-destructive",
			statusMessage: "Overloaded (Speed -20, Disadvantage)",
		},
	};
	const { statusColor, statusMessage } = PRESENTATION[status];

	return {
		totalWeight,
		carryingCapacity,
		pushDragLift: calculatePushDragLift(Math.floor(carryingCapacity / 15)),
		status,
		statusColor,
		statusMessage,
	};
}
