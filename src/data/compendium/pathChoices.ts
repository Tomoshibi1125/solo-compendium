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
	// Combat Choreography: a dance discipline plus the Dance Repertoire picks.
	// The repertoire entries are the Path's grants in pathAbilityAccess.ts.
	"idol--dance-resonance": [
		{
			level: 3,
			type: "path-option",
			count: 1,
			source: "Combat Choreography",
			options: [
				option(
					"K-Pop",
					"As a bonus action, feint at a creature within 5 feet of you: advantage on your next attack roll against it this turn.",
				),
				option(
					"Contemporary",
					"When a creature hits you with an attack, use your reaction to move up to 10 feet without provoking opportunity attacks.",
				),
				option("Ballet", "Your reach with melee attacks increases by 5 feet."),
				option(
					"Hip-Hop",
					"Once per turn, when you hit a Large or smaller creature with an unarmed strike, push it up to 10 feet straight away from you.",
				),
			],
		},
		{ level: 3, type: "power", count: 1, source: "Combat Choreography" },
		{ level: 3, type: "technique", count: 1, source: "Combat Choreography" },
		{ level: 6, type: "power", count: 1, source: "Combat Choreography" },
		{ level: 6, type: "technique", count: 1, source: "Combat Choreography" },
		{ level: 14, type: "power", count: 1, source: "Combat Choreography" },
		{ level: 14, type: "technique", count: 1, source: "Combat Choreography" },
	],
	// Primal Aspect replaces the legacy "Bonded Aspect" choice group.
	"berserker--gate-beast": [
		{
			level: 3,
			type: "path-option",
			count: 1,
			source: "Primal Aspect",
			options: [
				option(
					"Tank-Beast",
					"In Overload: resistance to all damage except psychic. Adaptation: double carrying capacity and advantage on STR checks to push, pull, lift, or break. Mandate: nearby enemies have disadvantage attacking anyone but you.",
				),
				option(
					"Raptor",
					"In Overload: opportunity attacks against you have disadvantage and you can Dash as a bonus action. Adaptation: see clearly up to 1 mile. Mandate: a flying speed equal to your walking speed.",
				),
				option(
					"Pack-Leader",
					"In Overload: allies have advantage on melee attacks against enemies within 5 feet of you. Adaptation: track at a fast pace and sneak at a normal pace. Mandate: knock a Large or smaller creature prone as a bonus action on a hit.",
				),
			],
		},
	],
	"berserker--rift-storm": [
		{
			level: 3,
			type: "path-option",
			count: 1,
			source: "Aetheric Vent",
			options: [
				option(
					"Inferno",
					"Aura deals 2 fire damage to each other creature (rising to 6). Saturation: fire resistance. Discharge: fire damage to attackers in the aura.",
				),
				option(
					"Tempest",
					"Aura forces one creature to make an AGI save against 1d6 lightning damage (rising to 4d6). Saturation: lightning resistance, water breathing, swim speed. Discharge: knock prone on a hit.",
				),
				option(
					"Glacial",
					"Aura grants 2 temporary hit points to chosen creatures (rising to 6). Saturation: cold resistance. Discharge: reduce one creature's speed to 0.",
				),
			],
		},
	],
	// Disciplines: one at 3rd level, then one more at 6th, 11th, and 17th from
	// the options that level opens (earlier options stay available).
	"striker--aetheric-channeler": [
		{
			level: 3,
			type: "path-option",
			count: 1,
			source: "Elemental Conversion",
			options: [
				option(
					"Thermal Fists",
					"1 Impulse: +10 feet of reach and fire damage on unarmed strikes this turn; 1 more for +1d10 fire on a hit.",
				),
				option(
					"Concussive Blast",
					"2 Impulse: 30-foot STR save, 3d10 force, push 20 feet and knock prone.",
				),
				option(
					"Gravity Whip",
					"2 Impulse: 30-foot AGI save, 3d10 force, then pull 25 feet or knock prone.",
				),
				option("Thermal Wave", "2 Impulse: 15-foot cone, AGI save, 3d6 fire."),
				option(
					"Thunder Clap",
					"2 Impulse: 15-foot cube, VIT save, 2d8 thunder and push 10 feet.",
				),
			],
		},
		{
			level: 6,
			type: "path-option",
			count: 1,
			source: "Elemental Conversion",
			options: [
				option(
					"Essence Lock",
					"3 Impulse: a humanoid within 60 feet makes a SENSE save or is paralyzed (concentration, repeating the save each turn).",
				),
				option(
					"Sonic Shatter",
					"3 Impulse: 10-foot-radius sphere within 60 feet, VIT save, 3d8 thunder.",
				),
			],
		},
		{
			level: 11,
			type: "path-option",
			count: 1,
			source: "Elemental Conversion",
			options: [
				option(
					"Thermal Detonation",
					"4 Impulse: 20-foot-radius sphere within 150 feet, AGI save, 8d6 fire.",
				),
				option(
					"Gravity Flight",
					"4 Impulse: a 60-foot flying speed for up to 10 minutes (concentration).",
				),
			],
		},
		{
			level: 17,
			type: "path-option",
			count: 1,
			source: "Elemental Conversion",
			options: [
				option("Cryo Blast", "6 Impulse: 60-foot cone, VIT save, 8d8 cold."),
				option(
					"Force Wall",
					"5 Impulse: an invisible, undamageable wall of force within 120 feet for up to 10 minutes (concentration).",
				),
			],
		},
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
