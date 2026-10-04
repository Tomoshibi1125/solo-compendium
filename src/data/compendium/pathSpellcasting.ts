/**
 * Third-caster Paths: a non-casting Job that learns Mage spells through its
 * Path (the RA counterpart of the 5e Eldritch Knight and Arcane Trickster).
 * Kept apart from the Path catalog so casting rules can resolve a character's
 * Path without loading every Path.
 */
import type { PathSpellcasting } from "./paths";

/** Cantrips known by character level (index = level - 1). */
export const THIRD_CASTER_CANTRIPS_KNOWN: readonly number[] = [
	0, 0, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
];

/** Spells known by character level (index = level - 1). */
export const THIRD_CASTER_SPELLS_KNOWN: readonly number[] = [
	0, 0, 3, 4, 4, 4, 5, 6, 6, 7, 8, 8, 9, 10, 10, 11, 11, 11, 12, 13,
];

export interface PathCasterRecord {
	pathId: string;
	jobId: string;
	/** The Path's name and declared aliases, as stored on characters. */
	names: readonly string[];
	spellcasting: PathSpellcasting;
}

export const PATH_CASTERS: readonly PathCasterRecord[] = [
	{
		pathId: "destroyer--spell-breaker",
		jobId: "destroyer",
		names: ["Path of the Spell Breaker"],
		spellcasting: {
			source: "Weave-Combat Attunement",
			list: "Mage",
			ability: "Intelligence",
			casterType: "third",
			cantripsKnown: [...THIRD_CASTER_CANTRIPS_KNOWN],
			spellsKnown: [...THIRD_CASTER_SPELLS_KNOWN],
		},
	},
	{
		pathId: "assassin--weave-infiltrator",
		jobId: "assassin",
		names: [
			"Path of the Weave Infiltrator",
			"assassin--spell-thief",
			"Path of the Lattice-Breaker",
		],
		spellcasting: {
			source: "Weave Intrusion",
			list: "Mage",
			ability: "Intelligence",
			casterType: "third",
			cantripsKnown: [...THIRD_CASTER_CANTRIPS_KNOWN],
			spellsKnown: [...THIRD_CASTER_SPELLS_KNOWN],
		},
	},
];

export const getPathCaster = (pathId: string): PathCasterRecord | undefined =>
	PATH_CASTERS.find((caster) => caster.pathId === pathId);
