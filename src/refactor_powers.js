import fs from "node:fs";
import path from "node:path";

const targetPath = path.resolve(
	"C:/Users/jjcal/Documents/solo-compendium/src/data/compendium/powers.ts",
);
let content = fs.readFileSync(targetPath, "utf8");

// Strip requirements block from all powers
content = content.replace(/\t*requirements:\s*\{[\s\S]*?\},?\n/g, "");

const newPowers = `
	// NEW EXPANDED ADAPTIVE POWERS
	{
		id: "void-collapse",
		name: "Void Collapse",
		description: "Crush targets with localized gravitational singularities.",
		type: "awakening",
		rarity: "legendary",
		activation: { type: "action" },
		range: { type: "feet", distance: 60 },
		effects: {
			primary: "Create a 20-foot radius sphere of crushing gravity. Creatures inside take 8d10 force damage and are knocked prone and restrained.",
			secondary: "Adapts to your highest applicable attribute for saving throws."
		},
		limitations: { uses: "Once per day", cooldown: "Long rest" },
		flavor: "The fabric of space buckles at your command.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/void-collapse.webp"
	},
	{
		id: "chronos-shift",
		name: "Chronos Shift",
		description: "Rewind time for a single entity.",
		type: "divine",
		rarity: "very_rare",
		activation: { type: "reaction" },
		range: { type: "feet", distance: 30 },
		effects: {
			primary: "When a creature takes damage or fails a save, rewind time for them to completely undo the event.",
			secondary: "Adapts to your highest applicable attribute."
		},
		limitations: { uses: "Once per week", cooldown: "Week" },
		flavor: "Time is but a stream you can navigate backward.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/chronos-shift.webp"
	},
	{
		id: "mana-burn",
		name: "Mana Burn",
		description: "Ignite the essence within a target's body.",
		type: "awakening",
		rarity: "rare",
		activation: { type: "bonus-action" },
		range: { type: "feet", distance: 60 },
		effects: {
			primary: "Target loses an unexpended resource (spell slot, ki, mana) and takes 1d8 psychic damage per level of resource lost.",
			secondary: "Adapts to your highest applicable attribute."
		},
		limitations: { uses: "3 times per day", cooldown: "Long rest" },
		flavor: "Their very power becomes their undoing.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/mana-burn.webp"
	},
	{
		id: "obsidian-carapace",
		name: "Obsidian Carapace",
		description: "Encase yourself in impenetrable jagged armor.",
		type: "monstrous",
		rarity: "uncommon",
		activation: { type: "action" },
		duration: { type: "concentration", time: "1 hour" },
		effects: {
			primary: "Gain 30 temporary hit points. While you have these, attackers taking melee swings at you take 1d6 piercing damage.",
			secondary: "Adapts to your highest applicable attribute."
		},
		limitations: { uses: "Twice per day", cooldown: "Long rest" },
		flavor: "Your skin crystallizes into jagged plates of volcanic glass.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/obsidian-carapace.webp"
	},
	{
		id: "soul-rend",
		name: "Soul Rend",
		description: "Tear a fragment of spirit from the target.",
		type: "innate",
		rarity: "very_rare",
		activation: { type: "action" },
		range: { type: "feet", distance: 15 },
		effects: {
			primary: "Deal 4d10 necrotic damage and reduce the target's maximum hit points by the same amount.",
			secondary: "Adapts to your highest applicable attribute."
		},
		limitations: { uses: "Once per day", cooldown: "Long rest" },
		flavor: "You bypass the flesh to strike directly at the core of their being.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/soul-rend.webp"
	},
	{
		id: "aegis-of-light",
		name: "Aegis of Light",
		description: "Project an impenetrable shield of holy energy.",
		type: "divine",
		rarity: "rare",
		activation: { type: "reaction" },
		range: { type: "self" },
		effects: {
			primary: "Gain immunity to magical damage until the start of your next turn.",
			secondary: "Adapts to your highest applicable attribute."
		},
		limitations: { uses: "Once per short rest", cooldown: "Short rest" },
		flavor: "A blinding flash intercepts the lethal blow.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/aegis-of-light.webp"
	},
	{
		id: "phantom-barrage",
		name: "Phantom Barrage",
		description: "Summon spectral versions of your weapons to strike continuously.",
		type: "awakening",
		rarity: "rare",
		activation: { type: "action" },
		range: { type: "feet", distance: 120 },
		effects: {
			primary: "Make 5 ranged spell attacks. Each deals 1d10 force damage.",
			secondary: "Adapts to your highest applicable attribute."
		},
		limitations: { uses: "Twice per day", cooldown: "Long rest" },
		flavor: "Weapons of pure essence rain down from the sky.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/phantom-barrage.webp"
	},
	{
		id: "venom-blood",
		name: "Venom Blood",
		description: "Your essence turns toxic to enemies.",
		type: "monstrous",
		rarity: "uncommon",
		activation: { type: "passive" },
		effects: {
			primary: "Whenever you take piercing or slashing damage, the attacker takes 2d6 poison damage.",
			secondary: "You are immune to poison."
		},
		flavor: "Corrosive ichor runs through your veins.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/venom-blood.webp"
	},
	{
		id: "absolute-zero",
		name: "Absolute Zero",
		description: "Freeze the kinetic energy in an area.",
		type: "awakening",
		rarity: "very_rare",
		activation: { type: "action" },
		range: { type: "feet", distance: 60 },
		effects: {
			primary: "All creatures in a 20-foot sphere take 6d8 cold damage and are paralyzed for 1 minute (Con save ends).",
			secondary: "Adapts to your highest applicable attribute."
		},
		limitations: { uses: "Once per day", cooldown: "Long rest" },
		flavor: "The air crystallizes, and all movement ceases.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/absolute-zero.webp"
	},
	{
		id: "kinetic-absorption",
		name: "Kinetic Absorption",
		description: "Absorb physical impacts and convert them to strength.",
		type: "innate",
		rarity: "rare",
		activation: { type: "reaction" },
		effects: {
			primary: "Reduce incoming physical damage by 1d10 + attribute. Store this energy.",
			secondary: "Next melee attack deals additional force damage equal to the absorbed amount."
		},
		limitations: { uses: "Proficiency bonus times per rest", cooldown: "Short rest" },
		flavor: "Every blow that fails to break you only makes you stronger.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/kinetic-absorption.webp"
	},
	{
		id: "infernal-forge",
		name: "Infernal Forge",
		description: "Summon weapons woven from hellfire.",
		type: "awakening",
		rarity: "rare",
		activation: { type: "bonus-action" },
		duration: { type: "timed", time: "10 minutes" },
		effects: {
			primary: "Manifest a weapon of pure fire in your empty hand.",
			secondary: "Attacks deal 2d6 fire damage instead of normal damage, and ignore fire resistance. Adapts to highest attribute."
		},
		limitations: { uses: "At-will" },
		flavor: "You pull a burning blade directly from the molten core of the earth.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/infernal-forge.webp"
	},
	{
		id: "celestial-judgment",
		name: "Celestial Judgment",
		description: "Mark a target for absolute destruction.",
		type: "divine",
		rarity: "legendary",
		activation: { type: "bonus-action" },
		range: { type: "sight" },
		effects: {
			primary: "Target loses all damage resistances and immunities for 1 minute.",
			secondary: "Any damage dealt to them is doubled."
		},
		limitations: { uses: "Once per month", cooldown: "Month" },
		flavor: "A divine decree strips away their defenses, exposing their mortal frailty.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/celestial-judgment.webp"
	},
	{
		id: "mind-control",
		name: "Dominate Will",
		description: "Take absolute control over a lesser creature's mind.",
		type: "innate",
		rarity: "very_rare",
		activation: { type: "action" },
		range: { type: "feet", distance: 30 },
		duration: { type: "concentration", time: "1 hour" },
		effects: {
			primary: "You dictate the creature's actions completely. Adapts to your highest applicable attribute.",
			secondary: "Target gets a save each time it takes damage."
		},
		limitations: { uses: "Once per day", cooldown: "Long rest" },
		flavor: "Your consciousness overwrites theirs.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/mind-control.webp"
	},
	{
		id: "warp-strike",
		name: "Warp Strike",
		description: "Throw your weapon and instantly teleport to its location.",
		type: "awakening",
		rarity: "uncommon",
		activation: { type: "action" },
		range: { type: "feet", distance: 60 },
		effects: {
			primary: "Make a ranged attack with a melee weapon. Hit or miss, you teleport to an unoccupied space adjacent to the target.",
			secondary: "Adapts to your highest applicable attribute."
		},
		limitations: { uses: "At-will" },
		flavor: "You dissolve into mist and re-materialize where your blade lands.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/warp-strike.webp"
	},
	{
		id: "life-transfer",
		name: "Life Transfer",
		description: "Trade your own vitality to heal another.",
		type: "innate",
		rarity: "uncommon",
		activation: { type: "action" },
		range: { type: "touch" },
		effects: {
			primary: "Take 4d8 necrotic damage (ignores resistance/immunity).",
			secondary: "One creature you touch instantly regains double the damage taken as hit points. Adapts to your highest applicable attribute."
		},
		limitations: { uses: "Unlimited" },
		flavor: "You drain your own essence to stitch their wounds shut.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/life-transfer.webp"
	},
	{
		id: "gravity-crush",
		name: "Gravity Crush",
		description: "Intensify gravity on a single target.",
		type: "awakening",
		rarity: "rare",
		activation: { type: "action" },
		range: { type: "feet", distance: 60 },
		effects: {
			primary: "Target takes 5d10 force damage and has its movement speed reduced to 5 feet.",
			secondary: "Adapts to your highest applicable attribute."
		},
		limitations: { uses: "3 times per day", cooldown: "Long rest" },
		flavor: "The weight of the world settles entirely on their shoulders.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/gravity-crush.webp"
	},
	{
		id: "echo-clone",
		name: "Echo Clone",
		description: "Manifest a perfect solid clone of yourself made of shadow and dust.",
		type: "monstrous",
		rarity: "very_rare",
		activation: { type: "action" },
		duration: { type: "concentration", time: "1 hour" },
		effects: {
			primary: "Create a clone with 1 HP and your exact AC and stats. It shares your turn and can attack.",
			secondary: "Adapts to your highest applicable attribute."
		},
		limitations: { uses: "Once per day", cooldown: "Long rest" },
		flavor: "Your shadow splits off the wall and stands beside you.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/echo-clone.webp"
	},
	{
		id: "storm-call",
		name: "Storm Call",
		description: "Summon an apocalyptic thunderstorm.",
		type: "divine",
		rarity: "very_rare",
		activation: { type: "action" },
		range: { type: "miles", distance: 1 },
		duration: { type: "concentration", time: "10 minutes" },
		effects: {
			primary: "Call down lightning bolts every turn as a bonus action (6d10 damage).",
			secondary: "Adapts to your highest applicable attribute."
		},
		limitations: { uses: "Once per day", cooldown: "Long rest" },
		flavor: "The sky blackens, answering your ancient call.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/storm-call.webp"
	},
	{
		id: "blight-touch",
		name: "Blight Touch",
		description: "Instill rapid decay and necrosis with a simple physical touch.",
		type: "innate",
		rarity: "rare",
		activation: { type: "action" },
		range: { type: "touch" },
		effects: {
			primary: "Deal 8d8 necrotic damage. Plants and non-magical structures instantly wither or degrade.",
			secondary: "Adapts to your highest applicable attribute."
		},
		limitations: { uses: "Twice per day", cooldown: "Long rest" },
		flavor: "Everything you touch rots away to ash.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/blight-touch.webp"
	},
	{
		id: "starfall",
		name: "Starfall",
		description: "Pull a meteorite from the upper atmosphere.",
		type: "awakening",
		rarity: "legendary",
		activation: { type: "action" },
		range: { type: "feet", distance: 300 },
		effects: {
			primary: "A blazing meteorite impacts a 40-foot radius. Deals 15d6 fire and 15d6 bludgeoning damage.",
			secondary: "Adapts to your highest applicable attribute."
		},
		limitations: { uses: "Once per month", cooldown: "Month" },
		flavor: "The heavens themselves become your artillery.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/starfall.webp"
	}
];`;

content = content.replace(/\];$/, newPowers);

fs.writeFileSync(targetPath, content, "utf8");
console.log("Powers refactored and expanded!");
