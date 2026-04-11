import {
	type SandboxNPC,
	sandboxRecruitableNPCs,
} from "@/data/compendium/sandbox-npcs";
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
	npcs: SandboxNPC[];
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
	{
		title: "NPC Directory: Bureau Sentinels",
		content: `# Bureau Sentinels — NPC Roster

The Bureau of Ascendant Affairs maintains the last functioning government outpost in Sector B. These NPCs represent the military and administrative personnel stationed at Ground Zero Safehouse.

## Commander Park Jae-won (Level 8 Vanguard)
**Location**: Ground Zero Safehouse | **Recruitment**: Complete 3 eradication quests + earn Bureau 'Trusted' reputation

Battle-scarred veteran with cybernetic left arm. Commands the outpost with iron will. Abilities: Fortification Aura, Command Strike, Cybernetic Overcharge.

## Quartermaster Lin Mei-hua (Level 4 Artificer)
**Location**: Ground Zero Safehouse | **Recruitment**: Joins if Black Market Bazaar is destroyed

Logistics clerk trapped in a warzone. Not military, just indispensable. Abilities: Equipment Maintenance, Inventory Mastery, Emergency Fabrication.

## Sergeant Yoon Hye-jin (Level 5 Ranger)
**Location**: Ground Zero Safehouse | **Recruitment**: Help find missing Squad Seven

Scout leader who's never lost a squad member — until now. Abilities: Shadow Step, Anomaly Sense, Precision Strike.

## Dr. Elara Voss (Level 6 Scholar)
**Location**: Ground Zero Safehouse | **Recruitment**: Bring 3 anomaly tissue samples (Rank C+)

Aetheric researcher who believes the Regent can be communicated with. Abilities: Analyze Weakness, Aetheric Shield, Research Insight.

## Agent Kira Blackwood (Level 7 Shadow)
**Location**: Ground Zero Safehouse | **Recruitment**: Bureau reputation 'Trusted' + complete her personal quest

Bureau intelligence operative with a classified mission. Was in Sector B before the Quarantine. Abilities: Infiltration, Killing Blow, Dead Drop.

## Corporal Deng Wei (Level 4 Warrior)
**Location**: Ground Zero Safehouse | **Recruitment**: Show kindness after nightmare episode

Gentle giant haunted by The Executioner. Former chef. Abilities: Suppressing Fire, Heavy Hitter, Fortify Position.

## Comms Officer Reyes (Level 3 Technician)
**Location**: Ground Zero Safehouse | **Recruitment**: Help repair secondary comms relay

The only person who can reach Central Command. Abilities: Signal Boost, Decrypt, EMP Burst.

## Warden-Aspirant Sato Ken (Level 2 Initiate)
**Location**: Ground Zero Safehouse | **Recruitment**: Ask him — he volunteers immediately

Eighteen-year-old recruit. Photo of his sister inside his helmet. Abilities: Determination, Quick Learner, Inspire.`,
	},
	{
		title: "NPC Directory: Vermillion Guild",
		content: `# Vermillion Guild — NPC Roster

Mercenaries, criminals, and outcasts who control the underground economy.

## Rat-king Ji (Level 6 Merchant)
**Location**: The Lower City Bazaar | **Recruitment**: Vermillion 'Respected' reputation + retrieve stashed funds

Black market fence with one aetheric eye implant. Knows where a Regent Relic is hidden.

## Vex "Quicksilver" (Level 7 Assassin)
**Location**: The Lower City Bazaar | **Recruitment**: Help eliminate High Priestess Nyx

Guild assassin with absorbed haste-rune. Partner was killed by the Cult. Uses they/them pronouns.

## Mother Rust (Level 5 Alchemist)
**Location**: The Lower City Bazaar | **Recruitment**: Bring a vial of 'living aether' from Botanical Sector

Disgraced university chemist turned junk potion brewer. Working on a compound to close Gates permanently.

## Torch (Level 6 Pyromancer)
**Location**: The Lower City Bazaar | **Recruitment**: Pay 5,000 Credits or help send a letter through Quarantine perimeter

Pyrokinetic enforcer. Gentle demeanor, devastating power.

## Old Man Crane (Level 10 Sage)
**Location**: The Lower City Bazaar | **Recruitment**: Only joins for the final Regent confrontation

Retired S-Rank 'White Heron.' Veteran of twelve Gate Collapses.

## Ash & Ember (Level 3 Twin Rogues)
**Location**: The Lower City Bazaar | **Recruitment**: Ask nicely, promise to find their brother

Identical twins. Joint recruit, never separated.

## Guildmaster Orin (Level 9 Tactician)
**Location**: The Lower City Bazaar | **Recruitment**: Unite Bureau and Vermillion factions

Former Bureau Warden court-martialed for saving lives.`,
	},
	{
		title: "NPC Directory: Awoko Cult & Others",
		content: `# Awoko Cult — Mostly Hostile

## High Priestess Nyx (Level 9) ☠ — Primary antagonist. Cannot be recruited.
## The Prophet / Whisper (Level 5) ✓ — Defector hiding in Sewers. Persuasion DC 14.
## Blood Zealot Karn (Level 7) ☠ — Boss encounter. Kill on sight.
## Sister Veil (Level 6) ✓ — Show her Dr. Voss's research. Persuasion DC 16.
## Acolyte Mara (Level 2) ✓ — Rescue from Financial District. Joins immediately.

---

# Independents & Anomaly-Adjacent

## Doc Tanaka (L4 Medic) — Underground surgeon. Outer Slums.
## Zara the Scrapper (L3 Engineer) — Self-taught mechanic. Outer Slums.
## Father Gregor (L5 Cleric) — Divine magic chaplain. Outer Slums.
## Mika the Kid (L1 Civilian) — Orphan with prophetic drawings. Roaming.
## Professor Lun (L6 Scholar) — Regent entity expert. Outer Slums.
## Ghost (L8 Unknown) — Amnesiac A-Rank combatant. Outer Slums.
## Mama Chen (L3 Guardian) — Shelter matron protecting 47 civilians. Outer Slums.
## Jax the Runner (L2 Scout) — Fastest courier in Sector B. Bazaar.
## Iron Belle (L7 Brawler) — Undefeated fighting champion. Bazaar.
## The Architect (L7 Artificer) — Building the Gate Disruption Device. Sewers.
## Echo-7 (L5 Hybrid) — Partially transformed human. Botanical Sector.
## The Watcher (L8 Guardian) — Ancient Gate entity with Regent Relic. Citadel.
## Specimen X (L6 Mutant) — Sapient lab escapee. Sewers.
## Lyra (L7 Psychic) — Dream frequency walker. Botanical Sector.
## The Archivist (L4 Repository) — Sapient AI with classified data. Hospital.
## Rex (L3 Beast) — Very good mutated war hound. Subway Network.`,
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
	description:
		"A massive open-world sandbox campaign (Level 1-10) featuring 40+ unique NPCs across 5 factions, 10 VTT maps, and a non-linear story driven by player choice.",
	chapters: sandboxWikiChapters,
	scenes: sandboxVTTScenes,
	handouts: sandboxHandouts,
	npcs: sandboxRecruitableNPCs,
};
