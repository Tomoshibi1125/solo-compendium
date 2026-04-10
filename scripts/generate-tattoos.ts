import fs from "node:fs";
import path from "node:path";

const TATTOO_THEMES = [
	{
		name: "Mana Core Circuit",
		ink: "Liquid Mana",
		element: "Force",
		effect: "Increases max MP/Mana equivalent",
	},
	{
		name: "Shadow Sovereign Crest",
		ink: "Abyssal Extract",
		element: "Shadow",
		effect: "Grants command over shadows",
	},
	{
		name: "Beast Monarch Fang",
		ink: "S-Rank Beast Blood",
		element: "Physical",
		effect: "Enhances physical strength under moonlight",
	},
	{
		name: "Frost Elf Sigil",
		ink: "Absolute Zero Ink",
		element: "Cold",
		effect: "Radiates an aura of frost",
	},
	{
		name: "System Interface Node",
		ink: "Dimensional Dust",
		element: "Utility",
		effect: "Allows mental interfacing with artifacts",
	},
	{
		name: "Ironclad Veins",
		ink: "Liquid Tungsten",
		element: "Defense",
		effect: "Skin hardens on impact",
	},
	{
		name: "Rift Walker Mark",
		ink: "Void Energy",
		element: "Teleportation",
		effect: "Short-range spatial jumps",
	},
	{
		name: "Necromancer's Pact",
		ink: "Wraith Essence",
		element: "Necromancy",
		effect: "Hear the whispers of the fallen",
	},
	{
		name: "Ignis Brand",
		ink: "Dragon's Breath",
		element: "Fire",
		effect: "Fire damage absorption",
	},
	{
		name: "Aegis Matrix",
		ink: "Arcane Gold",
		element: "Shielding",
		effect: "Generates an auto-shield when HP is low",
	},
];

const TATTOO_ADJECTIVES = [
	"Awakened",
	"Resonant",
	"Dormant",
	"Volatile",
	"Harmonic",
	"Fractured",
	"Ascendant",
	"Primordial",
	"Ethereal",
	"Cursed",
];
const BODY_PARTS = [
	"Left Forearm",
	"Right Forearm",
	"Back",
	"Chest",
	"Neck",
	"Left Shoulder",
	"Right Shoulder",
	"Spine",
	"Left Hand",
	"Right Hand",
];

const tattoos = [];

for (let i = 0; i < 50; i++) {
	const theme = TATTOO_THEMES[Math.floor(Math.random() * TATTOO_THEMES.length)];
	const adj =
		TATTOO_ADJECTIVES[Math.floor(Math.random() * TATTOO_ADJECTIVES.length)];
	const part = BODY_PARTS[Math.floor(Math.random() * BODY_PARTS.length)];

	const name = `${adj} ${theme.name}`;

	tattoos.push({
		id: `tattoo_${i + 1}`,
		name: name,
		display_name: name,
		description: `A modern urban fantasy tattoo etched using ${theme.ink}. When mana flows through it, the circuits glow with ${theme.element} energy.`,
		rarity:
			Math.random() > 0.8
				? "rare"
				: Math.random() > 0.5
					? "uncommon"
					: "common",
		attunement: true,
		body_part: part,
		ink_type: theme.ink,
		active_veins: [part],
		resonance_effect: theme.effect,
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "cyber-magic", "mana-circuit"],
	});
}

// Generate highly unique S-Rank specific tattoos
const sRankTattoos = [
	{
		id: "tattoo_s_1",
		name: "Karmic Retribution Matrix",
		display_name: "Karmic Retribution Matrix",
		description:
			"A full-back tattoo depicting an ancient deity of vengeance. The ink was synthesized from the core of an S-Rank Calamity class anomaly.",
		rarity: "legendary",
		attunement: true,
		body_part: "Back",
		ink_type: "Calamity Core Extract",
		active_veins: ["Back", "Spine", "Shoulders"],
		resonance_effect:
			"Reflects 50% of incoming physical damage as Force damage once per short rest.",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "s-rank", "legendary"],
	},
	{
		id: "tattoo_s_2",
		name: "Ouroboros Mana Loop",
		display_name: "Ouroboros Mana Loop",
		description:
			"A serpent devouring its own tail, etched around the dominant arm. Pulses with infinite looping mana.",
		rarity: "very_rare",
		attunement: true,
		body_part: "Right Arm",
		ink_type: "Liquid Paradox",
		active_veins: ["Right Arm"],
		resonance_effect:
			"Allows casting a 1st-level spell without consuming a spell slot once per day.",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "mana", "utility"],
	},
];

tattoos.push(...sRankTattoos);

const fileContent = `import type { CompendiumTattoo } from "@/types/compendium";

export const tattoos: CompendiumTattoo[] = ${JSON.stringify(tattoos, null, 2)};
`;

fs.writeFileSync(
	path.join(process.cwd(), "src/data/compendium/tattoos.ts"),
	fileContent,
	"utf8",
);

console.log(`Successfully generated ${tattoos.length} tattoos.`);
