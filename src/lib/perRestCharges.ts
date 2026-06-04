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
	// Full canonical ladder. Accept hyphen/underscore/space variants of
	// very-rare (previously only `very_rare`/`very rare` matched, so hyphenated
	// `very-rare` silently scored 0).
	switch ((rarity || "uncommon").toLowerCase()) {
		case "rare":
			return 1;
		case "very-rare":
		case "very_rare":
		case "very rare":
			return 2;
		case "epic":
			return 3;
		case "legendary":
			return 4;
		case "mythic":
			return 5;
		case "artifact":
			return 6;
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
	// A leading explicit count ("3/long rest", "2/short rest") wins outright.
	const numericMatch = normalized.match(/^(\d+)/);
	if (numericMatch) return Number(numericMatch[1]);

	// 5e per-use scaling. Detect the building blocks anywhere in the string so
	// authored formulas read naturally, e.g.:
	//   "Proficiency bonus/short rest"            => PB
	//   "PB + main stat mod/long rest"            => PB + primary ability mod
	//   "Intelligence modifier/long rest"         => primary ability mod (>=1)
	//   "level/long rest"                          => character level
	// Mirrors the Math.max(1, …) clamp used by computeCrossClassUses so an
	// ability-only formula never yields zero uses for a dump-stat caster.
	const stat = context.primaryStatModifier ?? 0;
	const hasProficiency =
		normalized.includes("proficiency") || /\bpb\b|\bprof\b/.test(normalized);
	const hasAbilityMod =
		/\bmod(?:ifier)?\b/.test(normalized) ||
		normalized.includes("main stat") ||
		normalized.includes("primary stat") ||
		normalized.includes("ability mod") ||
		/\b(str|dex|con|int|wis|cha|strength|agility|vitality|intelligence|sense|presence)\b/.test(
			normalized,
		);
	const flatBonusMatch = normalized.match(/\+\s*(\d+)/);
	const flatBonus = flatBonusMatch ? Number(flatBonusMatch[1]) : 0;

	if (hasProficiency && hasAbilityMod) {
		return Math.max(1, context.proficiencyBonus + stat + flatBonus);
	}
	if (hasAbilityMod) {
		return Math.max(1, stat + flatBonus);
	}
	if (hasProficiency) {
		return Math.max(1, context.proficiencyBonus + flatBonus);
	}
	if (normalized.includes("level")) {
		return Math.max(1, context.level + flatBonus);
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
