import { Fragment } from "react";
import type { ScaledCompanionCombatStats } from "@/lib/companionProgression";
import type { CompanionSpeciesFacts } from "@/lib/companionScaling";
import { ABILITY_NAMES } from "@/types/core-rules";

const signed = (value: number) => (value >= 0 ? `+${value}` : `${value}`);

/**
 * Species facts of a scaled companion: ability scores, proficient saves and
 * skills at its proficiency bonus, senses, languages, and defenses.
 */
export function CompanionStatBlock({
	facts,
	scaling,
}: {
	facts: CompanionSpeciesFacts;
	scaling: ScaledCompanionCombatStats;
}) {
	const rows = [
		{
			label: "Saving Throws",
			value: facts.savingThrows
				.map((save) => `${ABILITY_NAMES[save.ability]} ${signed(save.bonus)}`)
				.join(", "),
		},
		{
			label: "Skills",
			value: facts.skills
				.map((skill) => `${skill.name} ${signed(skill.bonus)}`)
				.join(", "),
		},
		{
			label: "Damage Vulnerabilities",
			value: facts.damageVulnerabilities.join(", "),
		},
		{ label: "Damage Resistances", value: facts.damageResistances.join(", ") },
		{ label: "Damage Immunities", value: facts.damageImmunities.join(", ") },
		{
			label: "Condition Immunities",
			value: facts.conditionImmunities.join(", "),
		},
		{ label: "Senses", value: facts.senses ?? "" },
		{ label: "Languages", value: facts.languages ?? "" },
		{ label: "Weaknesses", value: facts.weaknesses.join(", ") },
	].filter((row) => row.value.trim().length > 0);

	return (
		<div className="space-y-3" data-testid="companion-stat-block">
			{facts.abilities.length > 0 ? (
				<dl className="grid grid-cols-3 gap-2 sm:grid-cols-6">
					{facts.abilities.map((entry) => (
						<div
							key={entry.ability}
							className="rounded border border-border/40 bg-black/30 p-2 text-center"
						>
							<dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
								<abbr
									title={ABILITY_NAMES[entry.ability]}
									className="no-underline"
								>
									{entry.ability}
								</abbr>
							</dt>
							<dd className="font-display text-lg font-bold">{entry.score}</dd>
							<dd className="text-xs text-muted-foreground">
								{signed(entry.modifier)}
							</dd>
						</div>
					))}
				</dl>
			) : (
				<p className="text-xs text-muted-foreground">
					{scaling.kind === "size"
						? `This mount has no Anomaly stat block. It scales from its size Hit Die (d${scaling.hitDie}) and uses the natural attacks and abilities below.`
						: "No ability scores are recorded for this species."}
				</p>
			)}
			{rows.length > 0 && (
				<dl className="grid grid-cols-1 gap-x-3 gap-y-1.5 text-xs sm:grid-cols-[max-content_1fr]">
					{rows.map((row) => (
						<Fragment key={row.label}>
							<dt className="font-semibold">{row.label}</dt>
							<dd className="text-muted-foreground">{row.value}</dd>
						</Fragment>
					))}
				</dl>
			)}
			{(facts.savingThrows.length > 0 || facts.skills.length > 0) && (
				<p className="text-[11px] text-muted-foreground">
					Ability scores come from the species. Proficient saves and skills add
					its proficiency bonus ({signed(scaling.proficiencyBonus)}).
				</p>
			)}
		</div>
	);
}
