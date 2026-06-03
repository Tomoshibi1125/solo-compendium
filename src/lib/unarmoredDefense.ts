import { getAbilityModifier } from "@/lib/5eRulesEngine";

export type UnarmoredDefenseJob = "Striker" | "Berserker" | "Revenant";

export function getUnarmoredDefenseBaseAC(
	jobName: string | null | undefined,
	abilities: Record<string, number>,
): number | null {
	const normalized = (jobName || "").trim().toLowerCase();
	const base = 10 + getAbilityModifier(abilities.AGI ?? 10);

	if (normalized === "striker") {
		return base + getAbilityModifier(abilities.SENSE ?? 10);
	}

	if (normalized === "berserker") {
		return base + getAbilityModifier(abilities.VIT ?? 10);
	}

	if (normalized === "revenant") {
		// Unarmored Requiem: 10 + INT + VIT, with no AGI base (the entropy-sheathed
		// drain tank keys off its caster stat and durability, not finesse).
		return (
			10 +
			getAbilityModifier(abilities.INT ?? 10) +
			getAbilityModifier(abilities.VIT ?? 10)
		);
	}

	return null;
}
