import type { ResourceRecharge } from "@/lib/characterResources";

export type AbilityKind = "spell" | "power" | "technique" | "regent";

export interface PerRestCharacterContext {
	level: number;
	proficiencyBonus: number;
	primaryStatModifier?: number;
	isCrossClassAdaptation?: boolean;
	runeRarity?: string | null;
}

export interface PerRestChargeProfile {
	abilityKind: AbilityKind;
	usesMax: number | null;
	recharge: ResourceRecharge;
	isAtWill: boolean;
}

export interface PerRestChargePool {
	id: string;
	current: number;
	max: number | null;
	recharge?: ResourceRecharge | null;
}

type ChargeSource = {
	uses_per_rest?: string | number | null;
	uses_per_rest_formula?: string | number | null;
	frequency?: string | null;
	recharge?: string | null;
	limitations?: {
		uses?: string | number | null;
		uses_per_rest?: string | number | null;
		charges?: number | null;
		recharge?: string | null;
	} | null;
	mechanics?: { frequency?: string | null; recharge?: string | null } | null;
};

export function getRarityBonus(rarity: string | null | undefined): number {
	switch ((rarity || "uncommon").toLowerCase()) {
		case "rare":
			return 1;
		case "very_rare":
		case "very rare":
			return 2;
		case "legendary":
			return 3;
		default:
			return 0;
	}
}

export function computeCrossClassUses(input: {
	proficiencyBonus: number;
	primaryStatModifier?: number;
	rarity?: string | null;
}): number {
	return Math.max(
		1,
		input.proficiencyBonus +
			(input.primaryStatModifier ?? 0) +
			getRarityBonus(input.rarity),
	);
}

export function normalizeRecharge(
	value: string | null | undefined,
): ResourceRecharge {
	const normalized = (value || "none")
		.trim()
		.toLowerCase()
		.replace(/\s+/g, "-");
	if (normalized === "short-rest" || normalized === "per-short-rest") {
		return "short-rest";
	}
	if (normalized === "long-rest" || normalized === "per-long-rest") {
		return "long-rest";
	}
	if (
		normalized === "daily" ||
		normalized === "once-per-day" ||
		normalized === "once-per-long-rest"
	) {
		return "daily";
	}
	if (normalized === "encounter") return "encounter";
	return "none";
}

function extractUses(source: ChargeSource): string | number | null | undefined {
	return (
		source.uses_per_rest ??
		source.uses_per_rest_formula ??
		source.limitations?.uses_per_rest ??
		source.limitations?.charges ??
		source.limitations?.uses
	);
}

function extractRecharge(source: ChargeSource): ResourceRecharge {
	return normalizeRecharge(
		source.recharge ??
			source.frequency ??
			source.limitations?.recharge ??
			source.mechanics?.recharge ??
			source.mechanics?.frequency,
	);
}

function parseUses(
	uses: string | number | null | undefined,
	context: PerRestCharacterContext,
): number | null {
	if (typeof uses === "number") return Math.max(0, uses);
	if (!uses) return null;
	const normalized = uses.trim().toLowerCase();
	if (
		normalized === "at-will" ||
		normalized === "at will" ||
		normalized.includes("unlimited")
	) {
		return null;
	}
	const numericMatch = normalized.match(/^(\d+)/);
	if (numericMatch) return Number(numericMatch[1]);
	if (normalized.includes("proficiency") || normalized.includes("prof")) {
		const bonusMatch = normalized.match(/\+\s*(\d+)/);
		return context.proficiencyBonus + (bonusMatch ? Number(bonusMatch[1]) : 0);
	}
	if (normalized.includes("level")) {
		const bonusMatch = normalized.match(/\+\s*(\d+)/);
		return context.level + (bonusMatch ? Number(bonusMatch[1]) : 0);
	}
	return 1;
}

function computeAbilityUses(
	abilityKind: AbilityKind,
	source: ChargeSource,
	context: PerRestCharacterContext,
): PerRestChargeProfile {
	if (context.isCrossClassAdaptation) {
		return {
			abilityKind,
			usesMax: computeCrossClassUses({
				proficiencyBonus: context.proficiencyBonus,
				primaryStatModifier: context.primaryStatModifier,
				rarity: context.runeRarity,
			}),
			recharge: "long-rest",
			isAtWill: false,
		};
	}

	const usesMax = parseUses(extractUses(source), context);
	const recharge = usesMax === null ? "none" : extractRecharge(source);
	return {
		abilityKind,
		usesMax,
		recharge,
		isAtWill: usesMax === null,
	};
}

export function computePowerUses(
	power: ChargeSource,
	character: PerRestCharacterContext,
): PerRestChargeProfile {
	return computeAbilityUses("power", power, character);
}

export function computeTechniqueUses(
	technique: ChargeSource,
	character: PerRestCharacterContext,
): PerRestChargeProfile {
	return computeAbilityUses("technique", technique, character);
}

function recoverPool<T extends PerRestChargePool>(
	pool: T,
	recoverable: Set<ResourceRecharge>,
): T {
	const recharge = pool.recharge ?? "none";
	if (pool.max === null || !recoverable.has(recharge)) return pool;
	return { ...pool, current: pool.max };
}

export function applyShortRestCharges<T extends PerRestChargePool>(
	pools: T[],
): T[] {
	return pools.map((pool) =>
		recoverPool(pool, new Set<ResourceRecharge>(["short-rest", "encounter"])),
	);
}

export function applyLongRestCharges<T extends PerRestChargePool>(
	pools: T[],
): T[] {
	return pools.map((pool) =>
		recoverPool(
			pool,
			new Set<ResourceRecharge>([
				"short-rest",
				"long-rest",
				"encounter",
				"daily",
			]),
		),
	);
}
