import { getAbilityModifier } from "@/lib/5eRulesEngine";
import { getCanonicalJobRules } from "@/lib/jobRules";

export function getUnarmoredDefenseBaseAC(
	jobName: string | null | undefined,
	abilities: Record<string, number>,
): number | null {
	const defense = getCanonicalJobRules(jobName)?.unarmoredDefense;
	if (!defense) return null;
	return defense.abilities.reduce(
		(total, ability) => total + getAbilityModifier(abilities[ability] ?? 10),
		defense.baseAC,
	);
}
