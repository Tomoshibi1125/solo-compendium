/**
 * SANDBOX SESSIONS - The Shadow of the Regent
 */

export type SandboxSessionStatus =
	| "planned"
	| "in_progress"
	| "completed"
	| "cancelled";

export type SandboxSessionLogType =
	| "session"
	| "recap"
	| "loot"
	| "event"
	| "note";

export interface SandboxSessionLog {
	logType: SandboxSessionLogType;
	title: string;
	content: string;
	isPlayerVisible: boolean;
}

export interface SandboxSession {
	title: string;
	description: string;
	status: SandboxSessionStatus;
	order: number;
	recommendedLevel: number;
	sceneRefs: string[];
	npcRefs: string[];
	logs: SandboxSessionLog[];
}

const prep = (title: string, lines: string[]): SandboxSessionLog => ({
	logType: "session",
	title,
	content: lines.join("\n"),
	isPlayerVisible: false,
});

const recap = (title: string, lines: string[]): SandboxSessionLog => ({
	logType: "recap",
	title,
	content: lines.join("\n"),
	isPlayerVisible: true,
});

export const sandboxSessions: SandboxSession[] = [
	{
		title: "Session 0 - The Rift Seals",
		description:
			"Opening briefing, S-Rank entry, Rift Threshold, first road encounter, and arrival at Thornwake.",
		status: "planned",
		order: 0,
		recommendedLevel: 1,
		sceneRefs: ["Gate Domain: Rift Threshold", "Gate Domain: Thornwake"],
		npcRefs: ["Director Ivara Quell", "Lysa Thorn"],
		logs: [
			prep("Warden Prep - Entry Beats", [
				"## Briefing",
				"Give emergency writ, AFA alert, and Anchor Scan handouts.",
				"",
				"## Threshold",
				"Seal the Gate behind the party. Make the Citadel visible immediately.",
				"",
				"## Road",
				"Run tax hounds or a court courier. The party learns that the Domain has laws.",
				"",
				"## Thornwake",
				"End with tribute due tonight.",
			]),
			recap("Session 0 Recap", [
				"You entered the S-Rank Gate.",
				"The Rift sealed behind you.",
				"The road led to Thornwake, where hunger has a schedule and tribute comes at dusk.",
			]),
		],
	},
	{
		title: "Session 1 - Tribute and the Gallows Road",
		description:
			"Thornwake's tribute crisis, first faction choices, Gallows Road travel, and the Regent's first invitation.",
		status: "planned",
		order: 1,
		recommendedLevel: 2,
		sceneRefs: ["Gate Domain: Thornwake", "Gate Domain: Gallows Road"],
		npcRefs: ["Lysa Thorn", "Bell-Captain Rhone", "The Regent"],
		logs: [
			prep("Warden Prep - Tribute Night", [
				"Make the party choose who pays the cost.",
				"Introduce the Hollow Choir as frightening but understandable.",
				"End with a dinner invitation or a patrol consequence.",
			]),
			recap("Session 1 Recap", [
				"Thornwake showed you what survival costs inside the Gloamreach.",
				"The Gallows Road answered your choices with weather, teeth, and courtesy.",
			]),
		],
	},
	{
		title: "Session 2 - Camp and Bastion",
		description:
			"Vermillion Camp, Bureau Forward Bastion, failed expedition records, and the first stable safe rest.",
		status: "planned",
		order: 2,
		recommendedLevel: 3,
		sceneRefs: ["Gate Domain: Vermillion Camp", "Gate Domain: Bureau Forward Bastion"],
		npcRefs: ["Sable Marr", "Director Ivara Quell", "Medic Cor Valen"],
		logs: [
			prep("Warden Prep - Practical Allies", [
				"Make Vermillion useful before making them ugly.",
				"Make the Bureau records precise and damning.",
				"Offer the party one safe rest if they stabilize the Bastion.",
			]),
			recap("Session 2 Recap", [
				"Vermillion traded in favors and clean Essence.",
				"The Bureau Bastion proved that procedure can fail more cleanly than courage.",
			]),
		],
	},
	{
		title: "Session 3 - Mill and Glassvine",
		description:
			"The Essence Mill, Glassvine Works, first Anchor Relics, and settlement supply consequences.",
		status: "planned",
		order: 3,
		recommendedLevel: 5,
		sceneRefs: ["Gate Domain: Essence Mill", "Gate Domain: Glassvine Works"],
		npcRefs: ["Sable Marr", "Nera of the Green Scar"],
		logs: [
			prep("Warden Prep - Production Horror", [
				"Show what the Domain uses tribute for.",
				"Let the Millstone Heart and Crown of Thorns be tempting immediately.",
				"After either site changes, update Thornwake and Vermillion Camp.",
			]),
			recap("Session 3 Recap", [
				"The Gloamreach does not merely kill. It processes, grows, and spends the living.",
			]),
		],
	},
	{
		title: "Session 4 - Oaths and Choirs",
		description:
			"Aegis Hollow, Choir Warrens, the White Heron Seal, and the moral cost of law.",
		status: "planned",
		order: 4,
		recommendedLevel: 6,
		sceneRefs: [
			"Gate Domain: Aegis Hollow",
			"Gate Domain: Choir Warrens",
			"Gate Domain: White Heron Reliquary",
		],
		npcRefs: ["Sir Cael Aster", "Bell-Captain Rhone", "Eidolon Vesh"],
		logs: [
			prep("Warden Prep - Oath Pressure", [
				"Contrast failed protection with willing obedience.",
				"Let the party learn a sealing route without making it easy.",
			]),
			recap("Session 4 Recap", [
				"Aegis Hollow asked what protection becomes when it cannot stop.",
				"The Choir asked whether order is still evil when panic is worse.",
			]),
		],
	},
	{
		title: "Session 5 - Vault and Crown",
		description:
			"Subject Zero bargain, Beast Crown Den, final Anchor Scan confirmations, and Citadel approach selection.",
		status: "planned",
		order: 5,
		recommendedLevel: 8,
		sceneRefs: ["Gate Domain: Black Vault", "Gate Domain: Beast Crown Den"],
		npcRefs: ["Vault-Voice", "Nera of the Green Scar", "Rook"],
		logs: [
			prep("Warden Prep - Forbidden Help", [
				"Make the Black Vault offer work.",
				"Make the Beast Crown Den test instinct over plans.",
				"End by asking which Citadel route the party chooses.",
			]),
			recap("Session 5 Recap", [
				"The forbidden offer did not lie.",
				"The Den proved that Rank is not the same as survival.",
			]),
		],
	},
	{
		title: "Session 6 - The Regent's Citadel",
		description:
			"Final route, Citadel lower rings, Anchor Relic inversions, and the Regent confrontation.",
		status: "planned",
		order: 6,
		recommendedLevel: 10,
		sceneRefs: ["Gate Domain: Regent's Citadel", "Gate Domain: Citadel Anchor Heart"],
		npcRefs: ["The Regent"],
		logs: [
			prep("Warden Prep - Final Lair", [
				"Spend the party's prior choices as advantages or consequences.",
				"Make the Regent polite until a Relic breaks his law.",
				"Resolve the Anchor: destroy, seal, transform, or fail.",
			]),
			recap("Final Recap Template", [
				"The Gloamreach answered the party's final choice.",
				"Record who escaped, who remained, what crossed the Gate, and what the Bureau claims happened.",
			]),
		],
	},
];
