/**
 * Encumbrance calculations for System Ascendant 5e SRD
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
	const percentage = (totalWeight / carryingCapacity) * 100;

	let status: EncumbranceStatus["status"];
	let statusColor: string;
	let statusMessage: string;

	if (totalWeight === 0) {
		status = "unencumbered";
		statusColor = "text-green-400";
		statusMessage = "No encumbrance";
	} else if (percentage <= 33) {
		status = "unencumbered";
		statusColor = "text-green-400";
		statusMessage = "Unencumbered";
	} else if (percentage <= 66) {
		status = "light";
		statusColor = "text-blue-400";
		statusMessage = "Light Load";
	} else if (percentage <= 100) {
		status = "medium";
		statusColor = "text-yellow-400";
		statusMessage = "Medium Load";
	} else if (percentage <= 200) {
		status = "heavy";
		statusColor = "text-orange-400";
		statusMessage = "Heavy Load (Speed -10)";
	} else {
		status = "overloaded";
		statusColor = "text-red-400";
		statusMessage = "Overloaded (Speed -20, Disadvantage)";
	}

	return {
		totalWeight,
		carryingCapacity,
		pushDragLift: calculatePushDragLift(Math.floor(carryingCapacity / 15)),
		status,
		statusColor,
		statusMessage,
	};
}

/**
 * Get speed penalty from encumbrance
 */
export function getEncumbranceSpeedPenalty(
	status: EncumbranceStatus["status"],
): number {
	switch (status) {
		case "heavy":
			return -10;
		case "overloaded":
			return -20;
		default:
			return 0;
	}
}
