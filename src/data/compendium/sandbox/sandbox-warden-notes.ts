/**
 * WARDEN NOTES - The Shadow of the Regent
 *
 * Campaign secrets for the Gloamreach rewrite. These notes keep the Regent
 * horror focused on dominion, corruption, predation, and Gate-domain survival.
 */

export interface SandboxWardenNote {
	title: string;
	category: "secret" | "timeline" | "faction" | "encounter" | "reward";
	content: string;
}

export const sandboxWardenNotes: SandboxWardenNote[] = [
	{
		title: "Secret - The Regent Is the Anchor",
		category: "secret",
		content: [
			"The Gloamreach is one S-Rank Gate Domain. Its Anchor is not a crystal or throne; it is the Regent himself.",
			"",
			"He is ancient, predatory, charismatic, and bored. He treats Ascendants as rare prey because most intruders break too quickly to amuse him. He does not want escape. He wants proof that someone entering his realm can become worthy of remaining there.",
			"",
			"Destroying him collapses the Domain violently. Sealing him stabilizes the Rift and traps him. Transforming the Anchor requires the party to turn one of his own Relic laws against him.",
		].join("\n"),
	},
	{
		title: "Secret - Subject Zero Is the Black Vault's Hunger",
		category: "secret",
		content: [
			"Subject Zero is not the Regent and is not loyal to him. It is an older sealed S-Rank Anomaly whose pressure leaks into the Black Vault.",
			"",
			"The Vault offers real power: extra Relic charges, restored resources, temporary Rank amplification, or a way to wound the Regent early. Every bargain advances the Red Phase clock and adds a Subject Zero consequence to the ending.",
			"",
			"Never frame the bargain as a trick. The horror is that the offer works.",
		].join("\n"),
	},
	{
		title: "Secret - The Citadel Is Reachable Early",
		category: "secret",
		content: [
			"The Regent's Citadel is visible from the Gallows Road at all times. The party can attempt the road before they are ready.",
			"",
			"If they go early, do not block them. Show the consequences: patrols that ignore normal tactics, locked Rank thresholds, doors that demand tribute, and invitation rooms where the Regent studies them.",
			"",
			"Early retreat should be possible, humiliating, and costly.",
		].join("\n"),
	},
	{
		title: "Secret - Anchor Scan Results Are Fate Pressure",
		category: "reward",
		content: [
			"The Anchor Scan replaces any card-reading style device. It is an AFA/Bureau resonance procedure corrupted by the Domain's own laws.",
			"",
			"Before play, assign three Anchor Relics, one strongest ally, one Black Vault bargain, one Regent vulnerability, and the Citadel chamber where the final confrontation begins.",
			"",
			"The Scan should feel clinical at first and ominous by the last result.",
		].join("\n"),
	},
	{
		title: "Pressure Clock - Blue Phase to Red Phase",
		category: "timeline",
		content: [
			"Blue Phase is the campaign window. Red Phase means the Gloamreach spills through the Rift and the material side begins dying by terrain overwrite, Anomaly migration, and Essence weather.",
			"",
			"Advance the clock when the party takes long rests in unsafe regions, accepts Subject Zero bargains, abandons settlements to tribute, or destroys an Anchor Relic without stabilizing its law.",
		].join("\n"),
	},
	{
		title: "Faction Truth - The Bureau Failed First",
		category: "faction",
		content: [
			"The Bureau Forward Bastion did not fail because its Ascendants were weak. It failed because command tried to classify the Domain like a normal Gate and forced teams to obey surface-side doctrine.",
			"",
			"The dead command staff still have useful files, but every file is a record of someone prioritizing clean procedure over survival.",
		].join("\n"),
	},
	{
		title: "Faction Truth - Vermillion Camp Is Not Noble",
		category: "faction",
		content: [
			"Vermillion salvagers keep people alive, but their camp is built on triage math. They trade food for cores, treatment for favors, and rescue for future shares.",
			"",
			"They can become the party's strongest practical ally if treated honestly. They become dangerous if the party moralizes without helping.",
		].join("\n"),
	},
	{
		title: "Faction Truth - The Hollow Choir Loves the Regent",
		category: "faction",
		content: [
			"The Hollow Choir does not worship absence, names, or lost records. They worship rule.",
			"",
			"Their doctrine is simple: life outside the Domain is chaos; life under the Regent has shape. Their sacrifices are tribute payments designed to buy safety for chosen settlements.",
		].join("\n"),
	},
	{
		title: "Encounter Rule - Horror Should Change the Map",
		category: "encounter",
		content: [
			"Whenever a major Anomaly falls, alter the Domain. Roads re-route, weather changes, a settlement loses protection, or the Citadel opens one new approach.",
			"",
			"The Gloamreach is not a backdrop. It is a hostile country-sized body reacting to injury.",
		].join("\n"),
	},
	{
		title: "Reward Rule - Relics Are Compromises",
		category: "reward",
		content: [
			"Anchor Relics should be powerful enough that players want them and corrupt enough that using them feels like accepting the Domain's logic.",
			"",
			"Each Relic grants a strong benefit, a visible physical or social cost, and one way to weaken the Regent when used in the correct Citadel chamber.",
		].join("\n"),
	},
];
