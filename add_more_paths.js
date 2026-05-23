import * as fs from 'fs';

const pathAccessFile = 'src/lib/pathAbilityAccess.ts';
let content = fs.readFileSync(pathAccessFile, 'utf-8');

const newGrants = `
	{
		jobName: "Contractor",
		pathName: "Path of the Infernal Conduit",
		level: 1,
		kind: "spell",
		sourceTokens: ["Mage"],
		entryNames: [
			"Burning Hands",
			"Command",
			"Blindness/Deafness",
			"Scorching Ray",
			"Fireball",
			"Stinking Cloud",
			"Fire Shield",
			"Wall of Fire",
			"Flame Strike",
			"Hallow"
		],
		progression: "full",
	},
	{
		jobName: "Contractor",
		pathName: "Path of the Void Whisperer",
		level: 1,
		kind: "spell",
		sourceTokens: ["Esper", "Mage"],
		entryNames: [
			"Dissonant Whispers",
			"Tasha's Hideous Laughter",
			"Detect Thoughts",
			"Phantasmal Force",
			"Clairvoyance",
			"Sending",
			"Dominate Beast",
			"Evard's Black Tentacles",
			"Dominate Person",
			"Telekinesis"
		],
		progression: "full",
	},
	{
		jobName: "Contractor",
		pathName: "Path of the Glamour Weaver",
		level: 1,
		kind: "spell",
		sourceTokens: ["Idol", "Summoner"],
		entryNames: [
			"Faerie Fire",
			"Sleep",
			"Calm Emotions",
			"Phantasmal Force",
			"Blink",
			"Plant Growth",
			"Dominate Beast",
			"Greater Invisibility",
			"Dominate Person",
			"Seeming"
		],
		progression: "full",
	},
	{
		jobName: "Esper",
		pathName: "Path of the Tempest Core",
		level: 1,
		kind: "spell",
		sourceTokens: ["Mage"],
		entryNames: [
			"Thunderwave",
			"Shatter",
			"Call Lightning",
			"Lightning Bolt",
			"Storm Sphere",
			"Control Water",
			"Destructive Wave",
			"Chain Lightning"
		],
		progression: "full",
	},
	{
		jobName: "Holy Knight",
		pathName: "Path of the Absolute Devotion",
		level: 1,
		kind: "spell",
		sourceTokens: ["Herald"],
		entryNames: [
			"Protection from Evil and Good",
			"Sanctuary",
			"Lesser Restoration",
			"Zone of Truth",
			"Beacon of Hope",
			"Dispel Magic",
			"Freedom of Movement",
			"Guardian of Faith",
			"Commune",
			"Flame Strike"
		],
		progression: "base",
	},
	{
		jobName: "Holy Knight",
		pathName: "Path of the Retribution Mandate",
		level: 1,
		kind: "spell",
		sourceTokens: ["Mage", "Herald"],
		entryNames: [
			"Bane",
			"Hunter's Mark",
			"Hold Person",
			"Misty Step",
			"Haste",
			"Protection from Energy",
			"Banishment",
			"Dimension Door",
			"Hold Monster",
			"Scrying"
		],
		progression: "base",
	},
	{
		jobName: "Holy Knight",
		pathName: "Path of the Verdant Mandate",
		level: 1,
		kind: "spell",
		sourceTokens: ["Summoner"],
		entryNames: [
			"Ensnaring Strike",
			"Speak with Animals",
			"Moonbeam",
			"Misty Step",
			"Plant Growth",
			"Protection from Energy",
			"Ice Storm",
			"Stoneskin",
			"Commune with Nature",
			"Tree Stride"
		],
		progression: "base",
	},
	{
		jobName: "Stalker",
		pathName: "Path of the Rift Strider",
		level: 1,
		kind: "spell",
		sourceTokens: ["Mage"],
		entryNames: [
			"Protection from Evil and Good",
			"Misty Step",
			"Haste",
			"Banishment",
			"Teleportation Circle"
		],
		progression: "base",
	},
	{
		jobName: "Stalker",
		pathName: "Path of the Hive Synchronist",
		level: 1,
		kind: "spell",
		sourceTokens: ["Mage", "Summoner"],
		entryNames: [
			"Faerie Fire",
			"Mage Hand",
			"Web",
			"Gaseous Form",
			"Arcane Eye",
			"Insect Plague"
		],
		progression: "base",
	},
	{
		jobName: "Technomancer",
		pathName: "Design: Resonance Siege",
		level: 1,
		kind: "spell",
		sourceTokens: ["Mage"],
		entryNames: [
			"Shield",
			"Thunderwave",
			"Scorching Ray",
			"Shatter",
			"Fireball",
			"Wind Wall",
			"Ice Storm",
			"Wall of Fire",
			"Cone of Cold",
			"Wall of Force"
		],
		progression: "base",
	},
	{
		jobName: "Technomancer",
		pathName: "Design: Synchronist Binary",
		level: 1,
		kind: "spell",
		sourceTokens: ["Herald"],
		entryNames: [
			"Heroism",
			"Shield",
			"Warding Bond",
			"Branding Smite",
			"Aura of Vitality",
			"Blinding Smite",
			"Aura of Purity",
			"Fire Shield",
			"Banishing Smite",
			"Mass Cure Wounds"
		],
		progression: "base",
	},
	{
		jobName: "Striker",
		pathName: "Path of the Aetheric Channeler",
		level: 3,
		kind: "spell",
		sourceTokens: ["Mage", "Herald"],
		entryNames: [
			"Burning Hands",
			"Scorching Ray",
			"Fireball",
			"Wall of Fire",
			"Flame Strike"
		],
		maxLevel: 5,
	},
	{
		jobName: "Summoner",
		pathName: "Path of the Symbiotic Host",
		level: 1,
		kind: "spell",
		sourceTokens: ["Mage", "Revenant"],
		entryNames: [
			"Chill Touch",
			"Blindness/Deafness",
			"Ray of Enfeeblement",
			"Animate Dead",
			"Gaseous Form",
			"Blight",
			"Confusion",
			"Cloudkill",
			"Contagion"
		],
		progression: "full",
	},
	{
		jobName: "Summoner",
		pathName: "Path of the Cosmic Conduit",
		level: 1,
		kind: "spell",
		sourceTokens: ["Herald", "Mage"],
		entryNames: [
			"Guiding Bolt",
			"Magic Missile",
			"Detect Thoughts",
			"See Invisibility",
			"Hypnotic Pattern",
			"Melf's Minute Meteors",
			"Divination",
			"Fire Shield",
			"Circle of Power",
			"Wall of Light",
			"Sunburst",
			"Meteor Swarm"
		],
		progression: "full",
	},
`;

const insertIndex = content.lastIndexOf('];');
if (insertIndex !== -1) {
    content = content.slice(0, insertIndex) + newGrants + content.slice(insertIndex);
    fs.writeFileSync(pathAccessFile, content);
    console.log("Successfully added new path grants.");
} else {
    console.log("Could not find insertion point.");
}
