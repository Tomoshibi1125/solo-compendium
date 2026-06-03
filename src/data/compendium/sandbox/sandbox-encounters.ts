/**
 * SANDBOX ENCOUNTERS - The Shadow of the Regent
 */

export type SandboxEncounterDifficulty =
	| "easy"
	| "medium"
	| "hard"
	| "deadly"
	| "legendary";

export interface SandboxEncounterEntry {
	name: string;
	quantity: number;
	hp: number;
	ac: number;
	initiative: number;
	notes?: string;
}

export interface SandboxEncounter {
	name: string;
	description: string;
	difficulty: SandboxEncounterDifficulty;
	sceneRef: string;
	hazards: string[];
	rewards: string[];
	monsters: SandboxEncounterEntry[];
}

export const sandboxEncounters: SandboxEncounter[] = [
	{
		name: "Rift Threshold - Tax Hounds",
		description: "First proof that the Domain herds intruders toward its roads.",
		difficulty: "easy",
		sceneRef: "Gate Domain: Rift Threshold",
		hazards: ["Gate sealed behind party.", "AFA route pings fail beyond 60 feet."],
		rewards: ["Roadward Chalk.", "First Gallows Road map fragment."],
		monsters: [
			{ name: "Tax Hound", quantity: 4, hp: 14, ac: 12, initiative: 3, notes: "Attempts to drive targets toward the road rather than kill." },
		],
	},
	{
		name: "Thornwake - Tribute Courier",
		description: "A court courier arrives to collect Thornwake's payment.",
		difficulty: "medium",
		sceneRef: "Gate Domain: Thornwake",
		hazards: ["Crowd panic.", "Hollow Choir agitators protect the courier."],
		rewards: ["Dinner Invitation.", "Thornwake trust if the tribute is stopped."],
		monsters: [
			{ name: "Court Courier", quantity: 1, hp: 45, ac: 15, initiative: 4, notes: "Cannot be harmed before it speaks unless party breaks guest law." },
			{ name: "Copper-Mask Singer", quantity: 3, hp: 18, ac: 12, initiative: 2 },
		],
	},
	{
		name: "Gallows Road - Blue Flame Patrol",
		description: "A formal patrol tests the party's manners before attacking.",
		difficulty: "medium",
		sceneRef: "Gate Domain: Gallows Road",
		hazards: ["Blue flame reveals lies.", "Road lengthens after failed Presence checks."],
		rewards: ["Court Patrol Pass if negotiated.", "Patrol Mask Fragment if defeated."],
		monsters: [
			{ name: "Court Mask", quantity: 2, hp: 32, ac: 14, initiative: 2 },
			{ name: "Chain Bearer", quantity: 2, hp: 40, ac: 15, initiative: 1, notes: "Restrains on hit." },
		],
	},
	{
		name: "Bureau Bastion - Denial Protocol",
		description: "Automated defenses and altered dead guard the sealed supplies.",
		difficulty: "hard",
		sceneRef: "Gate Domain: Bureau Forward Bastion",
		hazards: ["Locked doors split the party.", "Broken AFA relay emits false commands."],
		rewards: ["Bureau Foil Seals.", "Bastion safe rest if relay restored."],
		monsters: [
			{ name: "Denial Turret", quantity: 3, hp: 28, ac: 16, initiative: 0 },
			{ name: "Altered Sentinel", quantity: 4, hp: 34, ac: 15, initiative: 2 },
		],
	},
	{
		name: "Essence Mill - Stop the Wheel",
		description: "The rendering wheel defends itself while the Millwarden bargains.",
		difficulty: "deadly",
		sceneRef: "Gate Domain: Essence Mill",
		hazards: ["Rendering gutters deal acid damage.", "Wheel advances each round until disabled."],
		rewards: ["Millstone Heart.", "Malformed cores.", "Red Phase pressure if wheel explodes."],
		monsters: [
			{ name: "Millwarden", quantity: 1, hp: 140, ac: 17, initiative: 3, notes: "Can convert fallen creatures into temporary healing." },
			{ name: "Render Hook", quantity: 6, hp: 26, ac: 13, initiative: 2 },
		],
	},
	{
		name: "Glassvine Works - Root Engine",
		description: "A living supply chain fights to keep feeding the Domain.",
		difficulty: "hard",
		sceneRef: "Gate Domain: Glassvine Works",
		hazards: ["Open flowers react to blood.", "Vines learn repeated tactics."],
		rewards: ["Crown of Thorns.", "Glassvine Sap Vials."],
		monsters: [
			{ name: "Glassvine Butcher", quantity: 3, hp: 55, ac: 15, initiative: 2 },
			{ name: "Root Engine", quantity: 1, hp: 120, ac: 16, initiative: 0, notes: "Stationary Anchor guardian." },
		],
	},
	{
		name: "Aegis Hollow - Oath Furnace",
		description: "Bound defenders test whether the party understands protection.",
		difficulty: "hard",
		sceneRef: "Gate Domain: Aegis Hollow",
		hazards: ["Breaking an oath empowers the knights.", "Furnace heat drains VIT saves."],
		rewards: ["Aegis Nail.", "Aegis ally if released."],
		monsters: [
			{ name: "Bound Aegis Knight", quantity: 5, hp: 48, ac: 18, initiative: 1 },
			{ name: "Oath Furnace Warden", quantity: 1, hp: 100, ac: 17, initiative: 2 },
		],
	},
	{
		name: "Choir Warrens - Bell Rite",
		description: "The Hollow Choir sings a Citadel road open through tribute law.",
		difficulty: "hard",
		sceneRef: "Gate Domain: Choir Warrens",
		hazards: ["Singing imposes Presence save pressure.", "Copper masks amplify command effects."],
		rewards: ["Choir Bell.", "Citadel route if rite inverted."],
		monsters: [
			{ name: "Bell-Captain", quantity: 1, hp: 95, ac: 16, initiative: 3 },
			{ name: "Copper-Mask Singer", quantity: 8, hp: 20, ac: 12, initiative: 2 },
		],
	},
	{
		name: "Black Vault - The Offer Works",
		description: "A combat that can be avoided by accepting a real bargain.",
		difficulty: "deadly",
		sceneRef: "Gate Domain: Black Vault",
		hazards: ["Zero-pressure suppresses healing.", "Every round spent inside advances dread."],
		rewards: ["Black Vault Key.", "Subject Zero bargain."],
		monsters: [
			{ name: "Pressure Husk", quantity: 4, hp: 60, ac: 15, initiative: 2 },
			{ name: "Vault Aperture", quantity: 1, hp: 160, ac: 18, initiative: 0, notes: "Can be sealed, not killed normally." },
		],
	},
	{
		name: "Beast Crown Den - Apex Trial",
		description: "Predator survival encounter where planning can become bait.",
		difficulty: "deadly",
		sceneRef: "Gate Domain: Beast Crown Den",
		hazards: ["Blood scent marks wounded characters.", "Loud tactics summon lesser packs."],
		rewards: ["Beast Crown Fang.", "Predator road access."],
		monsters: [
			{ name: "Crownbeast", quantity: 1, hp: 210, ac: 18, initiative: 6, notes: "Can be killed, tamed, or released." },
			{ name: "Glass-Eyed Packbeast", quantity: 6, hp: 38, ac: 14, initiative: 4 },
		],
	},
	{
		name: "Regent's Citadel - Court of Laws",
		description: "The lower Citadel tests every Relic and faction choice.",
		difficulty: "legendary",
		sceneRef: "Gate Domain: Regent's Citadel",
		hazards: ["Guest law protects and constrains.", "Tribute law alters healing."],
		rewards: ["Access to Anchor Heart.", "Final vulnerability if Relics are inverted."],
		monsters: [
			{ name: "Court Mask Noble", quantity: 4, hp: 70, ac: 16, initiative: 3 },
			{ name: "Umbral Echo Guard", quantity: 6, hp: 45, ac: 15, initiative: 4 },
		],
	},
	{
		name: "Citadel Anchor Heart - The Regent",
		description: "Final confrontation with the sovereign Anchor of the Gloamreach.",
		difficulty: "legendary",
		sceneRef: "Gate Domain: Citadel Anchor Heart",
		hazards: ["Anchor laws change by phase.", "Red Phase pressure becomes battlefield terrain."],
		rewards: ["Campaign ending.", "Regent Anchor Core if destroyed or transformed."],
		monsters: [
			{ name: "The Regent", quantity: 1, hp: 420, ac: 20, initiative: 7, notes: "Vulnerability depends on Anchor Scan and Relic inversions." },
			{ name: "Umbral Echo Guard", quantity: 8, hp: 45, ac: 15, initiative: 4 },
		],
	},
];
