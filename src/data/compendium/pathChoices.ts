/**
 * Structured Path choices (RA-23), keyed by Path id. Each entry's `source`
 * is the name of the Path feature that grants it.
 *
 * - `path-option` entries name every option; the sheet's Path choices panel
 *   records each pick as its own feature entry.
 * - Other types add to the choice totals that creation and level-up use.
 */
import type { PathChoiceOption, PathLevelChoice } from "./paths";

/** `spells`: what the option grants, as names or { name, level } pairs. */
const option = (
	name: string,
	description: string,
	spells?: ReadonlyArray<string | { name: string; level: number }>,
): PathChoiceOption => ({
	name,
	description,
	...(spells?.length
		? {
				grants: {
					spells: spells.map((spell) =>
						typeof spell === "string" ? { name: spell } : { ...spell },
					),
				},
			}
		: {}),
});

/** A Biome Mantras option: its four spells unlock at 3rd, 5th, 7th, and 9th. */
const biome = (
	name: string,
	spells: readonly [string, string, string, string],
): PathChoiceOption =>
	option(
		name,
		`Always prepared: ${spells[0]} (3rd level), ${spells[1]} (5th), ${spells[2]} (7th), ${spells[3]} (9th).`,
		spells.map((spell, index) => ({ name: spell, level: 3 + index * 2 })),
	);

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
	// Blade Flourish fighting discipline.
	"idol--blade-resonance": [
		{
			level: 3,
			type: "path-option",
			count: 1,
			source: "Combat Discipline",
			options: [
				option(
					"Dueling",
					"While you wield a melee weapon in one hand and no other weapon, you gain a +2 bonus to damage rolls with it.",
				),
				option(
					"Two-Weapon Fighting",
					"When you fight with two weapons, you add your ability modifier to the damage of the second attack.",
				),
			],
		},
	],
	// Mandated Proficiencies and the Arcane Secrets spell list.
	"idol--lore-resonance": [
		{ level: 3, type: "skill", count: 3, source: "Mandated Proficiencies" },
		{
			level: 6,
			type: "path-option",
			count: 2,
			source: "Arcane Secrets",
			options: [
				option("Mana Armor", "1st-level abjuration from the Mage list.", [
					"Mana Armor",
				]),
				option("Shield Lattice", "1st-level abjuration from the Mage list.", [
					"Shield Lattice",
				]),
				option("Gravity Spike", "1st-level transmutation from the Mage list.", [
					"Gravity Spike",
				]),
				option("Frost Lattice", "1st-level evocation from the Mage list.", [
					"Frost Lattice",
				]),
				option(
					"Verdant Grasp",
					"1st-level conjuration from the Summoner list.",
					["Verdant Grasp"],
				),
				option(
					"Necrotic Shroud",
					"1st-level necromancy from the Revenant list.",
					["Necrotic Shroud"],
				),
				option("Misty Blink", "2nd-level conjuration from the Mage list.", [
					"Misty Blink",
				]),
				option(
					"Awakening Surge",
					"2nd-level transmutation from the Technomancer list.",
					["Awakening Surge"],
				),
				option("Rift Snare", "2nd-level conjuration from the Summoner list.", [
					"Rift Snare",
				]),
				option("Triple Ignition", "2nd-level evocation from the Mage list.", [
					"Triple Ignition",
				]),
				option("Mana Barrage", "3rd-level evocation from the Mage list.", [
					"Mana Barrage",
				]),
				option(
					"Revenant's Embrace",
					"3rd-level necromancy from the Revenant list.",
					["Revenant's Embrace"],
				),
				option(
					"Quarantine Membrane",
					"3rd-level abjuration from the Technomancer list.",
					["Quarantine Membrane"],
				),
				option(
					"Summon Rift Echo",
					"3rd-level conjuration from the Summoner list.",
					["Summon Rift Echo"],
				),
			],
		},
	],
	// The dragon's resonance binds Elemental Affinity and Dragon Breath.
	"esper--draconic-lineage": [
		{
			level: 1,
			type: "path-option",
			count: 1,
			source: "regent-tier Resonance",
			options: [
				option("Ember", "Your resonance damage type is fire."),
				option("Storm", "Your resonance damage type is lightning."),
				option("Frost", "Your resonance damage type is cold."),
				option("Venom", "Your resonance damage type is poison."),
				option("Corrosion", "Your resonance damage type is acid."),
			],
		},
	],
	// Affinity spells; Dual Manifestation Access also opens the Herald list.
	"esper--absolute-spark": [
		{
			level: 1,
			type: "path-option",
			count: 1,
			source: "Dual Manifestation Access",
			options: [
				option("Restoration", "You learn Healing Resonance.", [
					"Healing Resonance",
				]),
				option("Entropy", "You learn Soul Siphon.", ["Soul Siphon"]),
				option("Order", "You learn Resonance Pulse.", ["Resonance Pulse"]),
				option("Chaos", "You learn Hex Contract.", ["Hex Contract"]),
				option("Balance", "You learn Aegis of the Absolute.", [
					"Aegis of the Absolute",
				]),
			],
		},
	],
	// Each biome's spells unlock at 3rd, 5th, 7th, and 9th level.
	"summoner--biome-architect": [
		{
			level: 3,
			type: "path-option",
			count: 1,
			source: "Biome Mantras",
			options: [
				biome("Arctic", [
					"Arctic Lance",
					"Pressure Wave",
					"Rending Flux",
					"Mana Storm",
				]),
				biome("Coastal", [
					"Misty Blink",
					"Harmonic Barrage",
					"Tentacle Field",
					"Rift Walk",
				]),
				biome("Desert", [
					"Triple Ignition",
					"Mana Barrage",
					"Ghost Protocol",
					"Mana Storm",
				]),
				biome("Forest", [
					"Snaring Vines",
					"Rift Flora Eruption",
					"Thorn Fortress",
					"Predator's Web",
				]),
				biome("Grassland", [
					"Awakening Surge",
					"Circuit Overclock",
					"Pack Ambush",
					"Mass Circuit Boost",
				]),
				biome("Mountain", [
					"Stone Spikes",
					"Gravity Well",
					"Gravity Crush",
					"Rift Fissure",
				]),
				biome("Swamp", [
					"Corrosive Aura",
					"Revenant's Embrace",
					"Rust Wave",
					"Predator's Web",
				]),
				biome("Subterranean", [
					"Rift Snare",
					"Mana Detonation Charge",
					"Unstable Rift Tear",
					"Rift Fissure",
				]),
			],
		},
	],
	// Hunter-style picks, one recorded option per feature.
	"stalker--apex-hunter": [
		{
			level: 3,
			type: "path-option",
			count: 1,
			source: "Ascendant's Resonance",
			options: [
				option(
					"Giant Slayer",
					"Once per turn, when you hit a Large or larger creature with a weapon attack, it takes an extra 1d8 damage of the weapon's type.",
				),
				option(
					"Horde Breaker",
					"Once on each of your turns when you make a weapon attack, you can attack a different creature within 5 feet of the original target and within your weapon's range.",
				),
				option(
					"Absolute Will",
					"You have advantage on saving throws against being charmed or frightened.",
				),
			],
		},
		{
			level: 7,
			type: "path-option",
			count: 1,
			source: "Evasive Resilience",
			options: [
				option(
					"Multi-target Defense",
					"When a creature hits you with an attack, you gain +4 AC against its later attacks this turn.",
				),
				option(
					"Aetheric Escape",
					"Opportunity attacks against you have disadvantage.",
				),
			],
		},
		{
			level: 11,
			type: "path-option",
			count: 1,
			source: "Absolute Multi-strike",
			options: [
				option(
					"Volley",
					"As an action, make a ranged weapon attack against any number of creatures within 10 feet of a point in range.",
				),
				option(
					"Whirlwind",
					"As an action, make a melee weapon attack against any number of creatures within 5 feet of you.",
				),
			],
		},
		{
			level: 15,
			type: "path-option",
			count: 1,
			source: "Apex Defense",
			options: [
				option(
					"Evasion",
					"AGI saves for half damage: no damage on a success, half on a failure.",
				),
				option(
					"Redirect",
					"Reaction when a creature misses you with a melee attack: it repeats the attack against another creature of your choice in its reach.",
				),
				option(
					"Uncanny Reflexes",
					"Reaction when an attacker you can see hits you: halve the attack's damage.",
				),
			],
		},
	],
	// Aether-Frame model.
	"technomancer--aether-vessel-design": [
		{
			level: 3,
			type: "path-option",
			count: 1,
			source: "Aether-Frame Integration",
			options: [
				option(
					"Arbiter",
					"Thunder gauntlets (1d8 thunder); a creature you hit has disadvantage on attacks against others until your next turn.",
				),
				option(
					"Outrider",
					"Lightning launcher (90/300 ft., 1d6 lightning, +1d6 once per turn); walking speed +5 feet.",
				),
			],
		},
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
