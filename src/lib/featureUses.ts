import type { AbilityScore } from "@/lib/5eRulesEngine";
import { calculateFeatureUses } from "@/lib/characterEngine";
import type {
	FeatureRestRecharge,
	FeatureUseDefinition,
} from "@/types/character";

export interface FeatureUseResourceModifier {
	type: "resource";
	target:
		| "uses_formula"
		| "recharge_base"
		| "recharge_changes"
		| "unlimited_at_level";
	value: string | number;
	source: string;
}

export interface StoredFeatureUseMetadata {
	formula: string | null;
	recharge: FeatureRestRecharge | null;
	rechargeChanges: FeatureUseDefinition["rechargeChanges"];
	unlimitedAtLevel: number | null;
}

const isRestRecharge = (value: unknown): value is FeatureRestRecharge =>
	value === "short-rest" || value === "long-rest";

export function isFeatureUseUnlimited(
	definition: FeatureUseDefinition,
	level: number,
): boolean {
	return (
		typeof definition.unlimitedAtLevel === "number" &&
		level >= definition.unlimitedAtLevel
	);
}

export function resolveFeatureRecharge(
	definition: FeatureUseDefinition,
	level: number,
): FeatureRestRecharge | null {
	if (isFeatureUseUnlimited(definition, level)) return null;

	let recharge = definition.recharge;
	for (const change of [...(definition.rechargeChanges ?? [])].sort(
		(a, b) => a.level - b.level,
	)) {
		if (level >= change.level) recharge = change.recharge;
	}
	return recharge;
}

export function resolveFeatureUsesMax(
	definition: FeatureUseDefinition,
	level: number,
	proficiencyBonus: number,
	abilities?: Partial<Record<AbilityScore, number>> | null,
): number | null {
	if (isFeatureUseUnlimited(definition, level)) return null;
	return calculateFeatureUses(
		definition.formula,
		level,
		proficiencyBonus,
		abilities,
	);
}

export function buildFeatureUseModifiers(
	definition: FeatureUseDefinition,
	source: string,
): FeatureUseResourceModifier[] {
	const modifiers: FeatureUseResourceModifier[] = [
		{
			type: "resource",
			target: "uses_formula",
			value: definition.formula,
			source,
		},
		{
			type: "resource",
			target: "recharge_base",
			value: definition.recharge,
			source,
		},
	];
	if (definition.rechargeChanges?.length) {
		modifiers.push({
			type: "resource",
			target: "recharge_changes",
			value: JSON.stringify(definition.rechargeChanges),
			source,
		});
	}
	if (typeof definition.unlimitedAtLevel === "number") {
		modifiers.push({
			type: "resource",
			target: "unlimited_at_level",
			value: definition.unlimitedAtLevel,
			source,
		});
	}
	return modifiers;
}

export function readFeatureUseMetadata(
	modifiers: unknown,
): StoredFeatureUseMetadata {
	const rows = Array.isArray(modifiers)
		? modifiers.filter(
				(value): value is Record<string, unknown> =>
					value !== null && typeof value === "object" && !Array.isArray(value),
			)
		: [];
	const valueFor = (target: FeatureUseResourceModifier["target"]): unknown =>
		rows.find((row) => row.type === "resource" && row.target === target)?.value;

	const formulaValue = valueFor("uses_formula");
	const rechargeValue = valueFor("recharge_base");
	const changesValue = valueFor("recharge_changes");
	const unlimitedValue = valueFor("unlimited_at_level");

	let rechargeChanges: FeatureUseDefinition["rechargeChanges"];
	if (typeof changesValue === "string") {
		try {
			const parsed: unknown = JSON.parse(changesValue);
			if (Array.isArray(parsed)) {
				rechargeChanges = parsed.flatMap((change) => {
					if (!change || typeof change !== "object") return [];
					const level = (change as { level?: unknown }).level;
					const recharge = (change as { recharge?: unknown }).recharge;
					return typeof level === "number" && isRestRecharge(recharge)
						? [{ level, recharge }]
						: [];
				});
			}
		} catch {
			// Invalid legacy metadata remains non-authoritative and is ignored.
		}
	}

	return {
		formula: typeof formulaValue === "string" ? formulaValue : null,
		recharge: isRestRecharge(rechargeValue) ? rechargeValue : null,
		rechargeChanges,
		unlimitedAtLevel:
			typeof unlimitedValue === "number" && Number.isFinite(unlimitedValue)
				? unlimitedValue
				: null,
	};
}

export function resolveStoredFeatureRecharge(
	metadata: StoredFeatureUseMetadata,
	level: number,
): FeatureRestRecharge | null | undefined {
	if (
		metadata.unlimitedAtLevel !== null &&
		level >= metadata.unlimitedAtLevel
	) {
		return null;
	}
	if (!metadata.recharge) return undefined;
	return resolveFeatureRecharge(
		{
			formula: metadata.formula ?? "0",
			recharge: metadata.recharge,
			rechargeChanges: metadata.rechargeChanges,
		},
		level,
	);
}
