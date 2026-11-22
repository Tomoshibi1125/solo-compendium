/**
 * Initiative Tracker allegiance labels.
 *
 * An Anomaly is a species, not a side. Whether a creature is hostile belongs
 * to the encounter (Encounter Builder "Disposition" + "Hostile now"), and a
 * tamed creature is a character-owned companion. The tracker therefore labels
 * each non-Ascendant row by its encounter disposition, or as a Companion,
 * instead of calling every creature an "Anomaly".
 */
import type { EncounterDisposition } from "@/lib/planning/adapters/encounterWorkflow";

const ENCOUNTER_DISPOSITIONS: readonly EncounterDisposition[] = [
	"neutral",
	"wary",
	"friendly",
	"hostile",
];

export const ENCOUNTER_DISPOSITION_LABELS: Record<
	EncounterDisposition,
	string
> = {
	neutral: "Neutral",
	wary: "Wary",
	friendly: "Friendly",
	hostile: "Hostile",
};

/** Narrow persisted JSON (tool state or combatant flags) to a disposition. */
export function toEncounterDisposition(
	value: unknown,
): EncounterDisposition | undefined {
	return typeof value === "string" &&
		(ENCOUNTER_DISPOSITIONS as readonly string[]).includes(value)
		? (value as EncounterDisposition)
		: undefined;
}

export interface CombatantAllegianceInput {
	isHunter: boolean;
	isCompanion?: boolean;
	disposition?: EncounterDisposition;
	currentlyHostile?: boolean;
}

export interface CombatantAllegianceBadge {
	label: string;
	variant: "secondary" | "outline" | "destructive";
}

/**
 * Badges for one tracker row. A missing disposition uses the Encounter
 * Builder default (neutral); a missing hostility flag follows the disposition,
 * matching the builder, where choosing "Hostile" also ticks "Hostile now".
 * The text always states the hostility so it never relies on color alone.
 */
export function combatantAllegianceBadges(
	combatant: CombatantAllegianceInput,
): CombatantAllegianceBadge[] {
	if (combatant.isHunter) return [{ label: "Ascendant", variant: "secondary" }];
	if (combatant.isCompanion)
		return [{ label: "Companion", variant: "outline" }];

	const disposition = combatant.disposition ?? "neutral";
	const hostileNow = combatant.currentlyHostile ?? disposition === "hostile";
	const badges: CombatantAllegianceBadge[] = [
		{
			label: ENCOUNTER_DISPOSITION_LABELS[disposition],
			variant:
				disposition === "hostile" && hostileNow ? "destructive" : "outline",
		},
	];
	if (hostileNow && disposition !== "hostile") {
		badges.push({ label: "Hostile now", variant: "destructive" });
	}
	if (!hostileNow && disposition === "hostile") {
		badges.push({ label: "Not hostile now", variant: "outline" });
	}
	return badges;
}
