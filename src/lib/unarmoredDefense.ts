import { getAbilityModifier } from "@/lib/5eRulesEngine";

export function getUnarmoredDefenseBaseAC(
	jobName: string | null | undefined,
	abilities: Record<string, number>,
): number | null {
	const normalized = (jobName || "").trim().toLowerCase();

	if (normalized === "striker") {
		// Striker is the only UD job that keys off AGI: 10 + AGI + SENSE.
		return (
			10 +
			getAbilityModifier(abilities.AGI ?? 10) +
			getAbilityModifier(abilities.SENSE ?? 10)
		);
	}

	if (normalized === "berserker") {
		// 10 + STR + VIT, no AGI (raw muscle and mass, not finesse).
		return (
			10 +
			getAbilityModifier(abilities.STR ?? 10) +
			getAbilityModifier(abilities.VIT ?? 10)
		);
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
