/**
 * Structured Path choices (RA-23), keyed by Path id. Each entry's `source`
 * is the name of the Path feature that grants it.
 *
 * - `path-option` entries name every option; the sheet's Path choices panel
 *   records each pick as its own feature entry.
 * - Other types add to the choice totals that creation and level-up use.
 */
import type { PathChoiceOption, PathLevelChoice } from "./paths";

const option = (name: string, description: string): PathChoiceOption => ({
	name,
	description,
});

export const PATH_LEVEL_CHOICES: Readonly<
	Record<string, readonly PathLevelChoice[]>
> = {
	"destroyer--apex-predator": [
		{
			level: 10,
			type: "fighting-style",
			count: 1,
			source: "Secondary Discipline",
		},
	],
	// Maneuvers are Techniques learned through Tactical Charge.
	"destroyer--tactician": [
		{ level: 3, type: "technique", count: 3, source: "Tactical Charge" },
		{ level: 7, type: "technique", count: 2, source: "Tactical Charge" },
		{ level: 10, type: "technique", count: 2, source: "Tactical Charge" },
		{ level: 15, type: "technique", count: 2, source: "Tactical Charge" },
	],
	"mage--matter-weaver": [
		{
			level: 6,
			type: "path-option",
			count: 1,
			source: "Aetheric Core",
			options: [
				option(
					"Night Lattice",
					"The core's carrier has darkvision out to 60 feet.",
				),
				option(
					"Swift Lattice",
					"The core's carrier gains +10 feet to walking speed while not encumbered.",
				),
				option(
					"Enduring Lattice",
					"The core's carrier has proficiency in Vitality saving throws.",
				),
				option(
					"Acid Ward",
					"The core's carrier has resistance to acid damage.",
				),
				option(
					"Cold Ward",
					"The core's carrier has resistance to cold damage.",
				),
				option(
					"Fire Ward",
					"The core's carrier has resistance to fire damage.",
				),
				option(
					"Lightning Ward",
					"The core's carrier has resistance to lightning damage.",
				),
				option(
					"Thunder Ward",
					"The core's carrier has resistance to thunder damage.",
				),
			],
		},
	],
};
