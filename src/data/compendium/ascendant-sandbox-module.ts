import type { VTTScene, VTTTokenInstance } from "@/types/vtt";

// ============================================================================
// RIFT ASCENDANT: SANDBOX CAMPAIGN MODULE
// "The Shadow of the Regent"
//
// A non-linear open-world sandbox (Level 1-10).
// Automatically populates the Campaign Wiki and VTT Maps.
// ============================================================================

export interface SandboxModule {
	id: string;
	title: string;
	description: string;
	chapters: SandboxChapter[];
	scenes: (VTTScene & { audioTracks?: { url: string; name: string }[] })[];
	handouts: SandboxHandout[];
}

export interface SandboxHandout {
	title: string;
	content: string;
	visibleToPlayers: boolean;
	category: string;
}

export interface SandboxChapter {
	title: string;
	content: string; // The markdown for the wiki article
}

// Helper to create enemies dynamically drawn from the anomalies compendium
function createEnemyToken(
	id: string,
	anomalyId: string, // e.g. "anomaly-0006"
	name: string,
	x: number,
	y: number,
	size: "small" | "medium" | "large" | "huge",
	imageOverride?: string,
): VTTTokenInstance {
	return {
		id,
		tokenType: "Anomaly",
		name,
		x,
		y,
		size,
		rotation: 0,
		layer: 1,
		locked: false,
		visible: true,
		// These standard anomalies can be fully populated by the VTT when dragged from compendium.
		// Providing the base image allows the VTT to render them correctly natively.
		imageUrl:
			imageOverride || `/generated/compendium/anomalies/${anomalyId}.webp`,
	};
}

// ----------------------------------------------------------------------------
// WIKI TEXT GENERATION (SANDBOX REGIONS)
// ----------------------------------------------------------------------------

export const sandboxWikiChapters: SandboxChapter[] = [
	{
		title: "Introduction & Sandbox Mechanics",
		content: `# The Shadow of the Regent

Welcome to **The Shadow of the Regent**, a massive open-world sandbox campaign taking players from Level 1 to 10. 
Unlike linear gate raids, this campaign drops players into an isolated Quarantine Zone (Sector B) where they must navigate factions, survive random anomaly spawns, and gather the **Regent Relics** before confronting the regional boss.

## The Oracle Mechanic
At the start of the campaign, the Warden must select three locations from the Sandbox where the **Regent Relics** are hidden. 
Depending on where they are hidden, the players' encounters and difficulty will change drastically.
- **Relic of the Void**: (Roll 1d4) 1. The Subway Core, 2. The Ruined Hospital, 3. The Black Market, 4. The Guild Hall Safehouse.
- **Relic of the Abyss**: (Roll 1d4) 1. The Financial District, 2. The Overgrown Park, 3. The Sewers, 4. Sector B Perimeter.

## Faction Reputations
* **The Bureau Sentinels**: Will assist players if they play by the rules. Target them if they use illegal runes.
* **The Vermillion Guild**: Mercenaries who control the bazaar. Can be bribed.
* **The Awoko Cult**: Zealots attempting to summon the Regent. Always hostile.

---`,
	},
	{
		title: "Region 1: The Safe Zones (Hubs)",
		content: `# The Safe Zones

The players cannot survive out in the Gate Zones forever. They must return to these Hubs to rest, trade, and receive quests.

## 1. The Ascendant Bureau Outpost (Sector B)
A fortified bunker.
- **NPC - Commander Park (Level 8 Fighter)**: Stern, by the book. Assigns eradication quests.
- **NPC - Quartermaster Lin**: Trades D-Rank and C-Rank equipment for Credits.

## 2. The Black Market Bazaar
Located in an abandoned underground mall. Safe from anomalies, but dangerous politically.
- **NPC - "Rat-king" Ji**: Sells illegal Sigils and Runes. Buys anomaly cores for 50% markup.
- **Rumors**: Roll 1d6 when players buy drinks here. (1. The Regent is waking up, 2-6: random lore).`,
	},
	{
		title: "Region 2: The Subway Network (Level 1-3)",
		content: `# The Subway Network (Rank D to C)

An expansive dungeon beneath Sector B connecting the Safe Zones to the deeper Gate Cores.

## Key Locations
- **Platform 4 Setup**: A pack of *Eternal Ancient Dragons* (Anomaly-0006) roost here.
- **The Maintenance Tunnels**: High chance of encountering wandering Shadow Demons (Anomaly-0021).
- **The Collapsed Train**: Potential location for a Regent Relic. Protected by an Abyssal Titan.`,
	},
	{
		title: "Region 3: The Overgrown City Blocks (Level 4-6)",
		content: `# The Overgrown City Block (Rank C to B)

Vegetation from a nature-aspect Gate has swallowed the financial district. Buildings are structurally unsafe.

## Key Locations
- **The Skyscraper Canopy**: Harpies and flying anomalies dominate this sniper-friendly terrain.
- **The Bank Vault**: The Awoko Cult is using this highly fortified location as a ritual base. Boss fight: Corrupted Ancient Lich.`,
	},
	{
		title: "Region 4: The Citadel of the Regent (Level 7-10)",
		content: `# The Citadel of the Regent (Rank A to S)

The epicenter of the quarantine zone. The sky here is permanently fractured in a terrifying vortex of aetheric energy.

## Key Encounters
- **The Gate Keepers**: Two S-Rank Abyssal Titans guard the entrance.
- **The Throne Room**: The final confrontation with the localized Regent. If the players do not have all 3 Regent Relics, the boss has 500 extra temporary HP and regains 20 HP a round.`,
	},
	{
		title: "Roaming Boss: The Executioner",
		content: `# The Executioner (S-Rank Threat)

An unstoppable S-Rank anomaly known as The Executioner roams the lower-level maps. 

**Mechanic**: Every 24 in-game hours, or whenever the players use a massive burst of Aetheric Energy, roll 1d20. On a 1, The Executioner enters the region. 
The players are not meant to fight it early on—they MUST run and hide. It moves at 60ft per round and can sense aetheric signatures.`,
	},
];

// ----------------------------------------------------------------------------
// HANDOUTS GENERATION (SANDBOX LORE & CLUES)
// ----------------------------------------------------------------------------

export const sandboxHandouts: SandboxHandout[] = [
	{
		title: "Bounty: The Executioner",
		content: `# B-RANK BOUNTY: ANOMALY-UNCLASSIFIED\n\n**Target Alias**: 'The Executioner'\n**Threat Level**: S-Rank Potential (Unconfirmed)\n**Reward**: 5,000,000 Credits, Alive or Dead (Preferably Dead).\n\n**Warning**: Target is highly mobile and tracks Aetheric signatures. Ascendants below Rank B are ordered to retreat on sight. Do not engage.`,
		visibleToPlayers: true,
		category: "handout",
	},
	{
		title: "Vermillion Guild Manifesto",
		content: `*A crumpled flyer found near the bazaar...*\n\nThe Bureau wants you to think the Gate Quotas are for your own good. They take the cores, they horde the Runes, and they let the D-Ranks die in the outer sectors.\n\nThe Vermillion Guild offers a different path. Bring your cores to us. We pay 50% above market, no questions asked. \n\n*Survive First. Obey Later.*`,
		visibleToPlayers: true,
		category: "note",
	},
	{
		title: "Corrupted Cipher (Regent Lore)",
		content: `*A heavy stone tablet etched with glowing, necrotic script...*\n\n"The Regent does not slumber. It waits. The three Relics are not keys to free it—they are the locks that bind its power. He who gathers the relic of Void, the relic of Abyss, and the relic of Blood shall either inherit the throne or burn in its wake."`,
		visibleToPlayers: false,
		category: "lore",
	},
];

// ----------------------------------------------------------------------------
// VTT SCENES GENERATION (MAPS & TOKENS)
// ----------------------------------------------------------------------------

function getRandomAnomalyId() {
	const id = Math.floor(Math.random() * 243) + 1;
	return `anomaly-${String(id).padStart(4, "0")}`;
}

// Scaffold 10 Massive Maps
const mapConfigs = [
	{
		name: "Hub: Ground Zero Safehouse",
		image: "hub_map.jpg",
		audio: "ambient_bunker.mp3",
		type: "hub",
	},
	{
		name: "Region: The Ruined Subway",
		image: "subway_map.jpg",
		audio: "ambient_subway.mp3",
		type: "combat",
	},
	{
		name: "Hub: The Lower City Bazaar",
		image: "bazaar_map.jpg",
		audio: "ambient_bunker.mp3",
		type: "hub",
	},
	{
		name: "Region: Overgrown Botanical Sector",
		image: "overgrown_map.jpg",
		audio: "ambient_explore.mp3",
		type: "combat",
	},
	{
		name: "Region: The Aetheric Sewer Network",
		image: "sewer_map.jpg",
		audio: "ambient_subway.mp3",
		type: "combat",
	},
	{
		name: "Region: Abandoned Military Hospital",
		image: "hospital_map.jpg",
		audio: "ambient_explore.mp3",
		type: "combat",
	},
	{
		name: "Region: Downtown Financial Ruins",
		image: "downtown_map.jpg",
		audio: "ambient_explore.mp3",
		type: "combat",
	},
	{
		name: "Region: The Outer Slums Quarantine",
		image: "slums_map.jpg",
		audio: "ambient_explore.mp3",
		type: "combat",
	},
	{
		name: "Region: The Inner Citadel approach",
		image: "citadel_map.jpg",
		audio: "ambient_combat.mp3",
		type: "combat",
	},
	{
		name: "Region: The Throne of the Regent",
		image: "throne_map.jpg",
		audio: "ambient_boss.mp3",
		type: "boss",
	},
];

export const sandboxVTTScenes: (VTTScene & {
	audioTracks?: { url: string; name: string }[];
})[] = mapConfigs.map((config, index) => {
	const isHub = config.type === "hub";
	const isBoss = config.type === "boss";

	const tokens: VTTTokenInstance[] = [];

	// If it's a combat zone, spawn a wild 15 enemies
	if (config.type === "combat") {
		for (let i = 0; i < 15; i++) {
			tokens.push(
				createEnemyToken(
					`e-${index}-${i}`,
					getRandomAnomalyId(),
					"Wandering Anomaly",
					Math.floor(Math.random() * 50),
					Math.floor(Math.random() * 50),
					"medium",
				),
			);
		}
	} else if (isBoss) {
		for (let i = 0; i < 5; i++) {
			tokens.push(
				createEnemyToken(
					`boss-guard-${i}`,
					getRandomAnomalyId(),
					"Regent's Guard",
					Math.floor(Math.random() * 30),
					10 + i * 2,
					"large",
				),
			);
		}
		tokens.push(
			createEnemyToken(
				"final-boss",
				getRandomAnomalyId(),
				"The Regent",
				25,
				25,
				"huge",
			),
		);
	} else {
		// Hub has some NPCs
		tokens.push(
			createEnemyToken(
				`npc-${index}-1`,
				"anomaly-0010",
				"Quartermaster",
				15,
				15,
				"medium",
			),
		);
		tokens.push(
			createEnemyToken(
				`npc-${index}-2`,
				"anomaly-0012",
				"Guild Envoy",
				20,
				20,
				"medium",
			),
		);
	}

	return {
		id: `scene-${index}`,
		name: config.name,
		width: 60,
		height: 60,
		gridSize: 70,
		gridType: "square",
		fogOfWar: !isHub,
		backgroundImage: `/generated/compendium/sandbox_assets/${config.image}`,
		audioTracks: [
			{
				url: `/generated/compendium/sandbox_assets/${config.audio}`,
				name: `${config.name} Audio`,
			},
		],
		tokens: tokens,
		drawings: [],
		annotations: [],
		walls: [],
		lights: [],
	};
});

export const massiveSandboxModule: SandboxModule = {
	id: "sandbox-shadow-regent",
	title: "The Shadow of the Regent",
	description: "A dynamic 1-10 level sandbox campaign.",
	chapters: sandboxWikiChapters,
	scenes: sandboxVTTScenes,
	handouts: sandboxHandouts,
};
