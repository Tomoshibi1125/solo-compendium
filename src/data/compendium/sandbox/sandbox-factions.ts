/**
 * SANDBOX FACTIONS - The Shadow of the Regent
 */

export type FactionId =
	| "bureau-remnant"
	| "vermillion-camp"
	| "hollow-choir"
	| "free-ascendants"
	| "gloamreach-bound";

export interface SandboxFactionReputationThreshold {
	threshold: number;
	tier: "hostile" | "unfriendly" | "neutral" | "friendly" | "trusted" | "kin";
	unlocks: string;
}

export interface SandboxFaction {
	id: FactionId;
	name: string;
	tagline: string;
	emblem: string;
	description: string;
	startingReputation: number;
	reputationThresholds: SandboxFactionReputationThreshold[];
	joiningBenefits: string[];
	enmities: FactionId[];
}

const thresholds = (
	kin: string,
	trusted: string,
): SandboxFactionReputationThreshold[] => [
	{ threshold: -5, tier: "hostile", unlocks: "Faction acts openly against the party." },
	{ threshold: -2, tier: "unfriendly", unlocks: "Faction denies shelter and information." },
	{ threshold: 0, tier: "neutral", unlocks: "Faction will trade if paid." },
	{ threshold: 3, tier: "friendly", unlocks: "Faction offers one useful lead or safe contact." },
	{ threshold: 6, tier: "trusted", unlocks: trusted },
	{ threshold: 10, tier: "kin", unlocks: kin },
];

export const sandboxFactions: SandboxFaction[] = [
	{
		id: "bureau-remnant",
		name: "Bureau Remnant",
		tagline: "Procedure after the wall has fallen.",
		emblem: "A cracked silver shield over a blue Gate arc.",
		description: [
			"The Bureau Remnant is what remains of the official expedition inside the Gloamreach. They have Rank charts, sealed supply rooms, damaged AFA relays, and a terrifying amount of paperwork explaining why people died.",
			"",
			"They want the Gate cleared, the Anchor classified, and the final report to look controlled.",
		].join("\n"),
		startingReputation: 1,
		reputationThresholds: thresholds(
			"Bureau command codes unlock one Citadel route.",
			"Forward Bastion becomes a safe rest and AFA routing site.",
		),
		joiningBenefits: [
			"AFA repairs and route pings.",
			"Access to sealed medical stores.",
			"Rank clearance cover for risky operations.",
		],
		enmities: ["hollow-choir", "gloamreach-bound"],
	},
	{
		id: "vermillion-camp",
		name: "Vermillion Camp",
		tagline: "Everyone eats. Nobody eats free.",
		emblem: "A red hook over a black Essence core.",
		description: [
			"Vermillion Camp is a stranded salvage market built from wrecked expedition rigs and Anomaly shell. Its people are practical, brave, predatory, and tired.",
			"",
			"They save lives every day and keep a ledger for every one of them.",
		].join("\n"),
		startingReputation: 0,
		reputationThresholds: thresholds(
			"Vermillion opens its private vault and joins the final assault.",
			"Camp surgeons can turn one fatal wound into a lasting injury.",
		),
		joiningBenefits: [
			"Relic appraisal and salvage contacts.",
			"Black-market Runes, Sigils, and Tattoos.",
			"Emergency surgery paid in Essence or favors.",
		],
		enmities: ["bureau-remnant", "hollow-choir"],
	},
	{
		id: "hollow-choir",
		name: "Hollow Choir",
		tagline: "Order is mercy. Tribute is law.",
		emblem: "A copper mask beneath a black bell.",
		description: [
			"The Hollow Choir serves the Regent because it believes rule is kinder than panic. Its members buy safety for chosen settlements through tribute rites, obedience, and ritualized betrayal.",
			"",
			"They are wrong in ways that still make sense to starving people.",
		].join("\n"),
		startingReputation: -1,
		reputationThresholds: thresholds(
			"The Choir Bell can be inverted in the Citadel without a fight.",
			"A Choir defector teaches the party how to break a tribute rite.",
		),
		joiningBenefits: [
			"Access to Warrens routes.",
			"Ritual knowledge of tribute law.",
			"Temporary protection from some court patrols.",
		],
		enmities: ["bureau-remnant", "vermillion-camp", "free-ascendants"],
	},
	{
		id: "free-ascendants",
		name: "Free Ascendants",
		tagline: "No crown. No leash. No one left behind.",
		emblem: "A broken Rank tag tied with white cord.",
		description: [
			"Free Ascendants are stranded operators, deserters, refugees, and unlicensed survivors who refuse all formal control inside the Gate Domain.",
			"",
			"They are under-equipped, overextended, and often the only people doing the right thing without a contract.",
		].join("\n"),
		startingReputation: 0,
		reputationThresholds: thresholds(
			"Free Ascendant cells coordinate an evacuation route for an ending.",
			"Hidden shelters allow safe rests on two dangerous travel legs.",
		),
		joiningBenefits: [
			"Mutual-aid shelters.",
			"Guides through off-road routes.",
			"Information from survivors the Bureau missed.",
		],
		enmities: ["hollow-choir"],
	},
	{
		id: "gloamreach-bound",
		name: "Gloamreach-Bound",
		tagline: "Changed is not the same as lost.",
		emblem: "A green eye inside a thorn ring.",
		description: [
			"The Gloamreach-Bound are people and Anomalies altered by long exposure to the Domain. Some are monstrous. Some are peaceful. Some remember being Ascendants. Some never were.",
			"",
			"They know the Domain's instincts better than anyone, and they fear being dragged back to the material side as specimens.",
		].join("\n"),
		startingReputation: -1,
		reputationThresholds: thresholds(
			"The Bound turn one Domain ecology against the Citadel.",
			"A Bound guide can lead the party through Beast Crown territory.",
		),
		joiningBenefits: [
			"Predator warnings.",
			"Lyra-signature survival knowledge.",
			"Safe passage through one altered ecology.",
		],
		enmities: ["bureau-remnant"],
	},
];
