import * as fs from 'fs';

const pathAccessFile = 'src/lib/pathAbilityAccess.ts';
let content = fs.readFileSync(pathAccessFile, 'utf-8');

const newGrants = `
	{
		jobName: "Herald",
		pathName: "Path of the Radiance Mandate",
		level: 1,
		kind: "spell",
		sourceTokens: ["Mage"],
		entryNames: [
			"Ember Trail",
			"Searing Oath",
			"Hallowed Ground",
			"Oath Smite",
			"Absolute Beacon",
			"Binding Oath",
			"Anomaly Cage",
			"Anomaly Leash",
			"Absolute Judgment",
			"Radiant Condemnation"
		],
		progression: "full",
	},
	{
		jobName: "Herald",
		pathName: "Path of the Storm Mandate",
		level: 1,
		kind: "spell",
		sourceTokens: ["Mage"],
		entryNames: [
			"Healing Resonance",
			"Mana Bolt",
			"Blood Tear",
			"Circuit Overload",
			"Harmonic Barrage",
			"Idol's Crescendo",
			"Resonance Cascade",
			"Thorn Fortress",
			"Bureau Authority Override",
			"Mana Storm"
		],
		progression: "full",
	},
	{
		jobName: "Contractor",
		pathName: "Path of the Radiant Vessel",
		level: 1,
		kind: "spell",
		sourceTokens: ["Herald"],
		entryNames: [
			"Fade to Shadow",
			"Frost Lattice",
			"Corrosive Aura",
			"Entropic Wave",
			"Circuit Overclock",
			"Harmonic Barrage",
			"Death's Harvest",
			"Entropic Reaping",
			"Absolute Judgment",
			"Radiant Condemnation"
		],
		progression: "full",
	},
	{
		jobName: "Esper",
		pathName: "Path of the Absolute Spark",
		level: 1,
		kind: "spell",
		sourceTokens: ["Herald"],
		entryNames: [
			"Fade to Shadow",
			"Frost Lattice",
			"Corrosive Aura",
			"Entropic Wave",
			"Circuit Overclock",
			"Harmonic Barrage",
			"Death's Harvest",
			"Entropic Reaping",
			"Absolute Judgment",
			"Radiant Condemnation"
		],
		progression: "full",
	},
	{
		jobName: "Summoner",
		pathName: "Path of the Biome Architect",
		level: 1,
		kind: "spell",
		sourceTokens: ["Mage"],
		entryNames: [
			"Bright Tomb",
			"Ember Trail",
			"Crimson Cleave",
			"Mana Thorn Barrier",
			"Gate Flora Eruption",
			"Mana Detonation Charge",
			"Anomaly Mimicry",
			"Ghost Protocol",
			"Absolute Wrath"
		],
		progression: "full",
	},
	{
		jobName: "Contractor",
		pathName: "Path of the Glamour Weaver",
		level: 1,
		kind: "spell",
		sourceTokens: ["Idol"],
		entryNames: [
			"Fade to Shadow",
			"Phantom Step",
			"Hymn of Courage",
			"Psychic Barrier",
			"Idol's Crescendo",
			"Harmonic Resonance",
			"Anomaly Mimicry",
			"Enthralling Performance",
			"Psionic Bastion",
			"Mind Fracture"
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
			"Aegis of the Absolute",
			"Bright Tomb",
			"Crimson Cleave",
			"Entropy Siphon",
			"Absolute Beacon",
			"Mana Overcharge",
			"Gate Ward",
			"Oath Aura",
			"Bureau Authority Override",
			"Pact Renegotiation"
		],
		progression: "base",
	},
	{
		jobName: "Contractor",
		pathName: "Path of the Void Whisperer",
		level: 1,
		kind: "spell",
		sourceTokens: ["Esper"],
		entryNames: [
			"Synaptic Static",
			"Entropic Wave",
			"Binding Oath",
			"Whisper Network",
			"Mind Fracture",
			"Pact Dominion",
			"Psionic Bastion"
		],
		progression: "full",
	},
	{
		jobName: "Contractor",
		pathName: "Path of the Infernal Conduit",
		level: 1,
		kind: "spell",
		sourceTokens: ["Mage"],
		entryNames: [
			"Ember Trail",
			"Searing Oath",
			"Hallowed Ground",
			"Triple Ignition",
			"Absolute Beacon",
			"Mana Barrage",
			"Absolute Judgment",
			"Radiant Condemnation"
		],
		progression: "full",
	},
	{
		jobName: "Herald",
		pathName: "Path of the Knowledge Mandate",
		level: 1,
		kind: "spell",
		sourceTokens: ["Mage"],
		entryNames: [
			"Thunder Shackle",
			"Entropic Wave",
			"Surge Storm",
			"Ghost Protocol",
			"Pact Dominion",
			"Psionic Bastion"
		],
		progression: "full",
	},
	{
		jobName: "Holy Knight",
		pathName: "Path of the Retribution Mandate",
		level: 1,
		kind: "spell",
		sourceTokens: ["Mage"],
		entryNames: [
			"Bright Tomb",
			"Gate Resonance Spike",
			"Arctic Lance",
			"Blood Tear",
			"Pact Brand",
			"Phase Strike"
		],
		progression: "base",
	},
`;

const insertIndex = content.lastIndexOf('];');
if (insertIndex !== -1) {
    content = content.slice(0, insertIndex) + newGrants + content.slice(insertIndex);
    fs.writeFileSync(pathAccessFile, content);
    console.log("Successfully added new curated domain lists based on RA 5e-style mapping!");
} else {
    console.log("Could not find insertion point.");
}
