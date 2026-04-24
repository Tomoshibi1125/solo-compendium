/**
 * SANDBOX ENCOUNTERS — "The Shadow of the Regent"
 *
 * One encounter deck per combat/boss scene in the sandbox. Each encounter
 * declares the Anomaly roster (name, quantity, baseline stats) and the
 * hazards / rewards Warden should surface. The injector writes into
 * `campaign_encounters` (header) + `campaign_encounter_entries` (one row
 * per entry in `monsters`).
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
	/** Initial HP per creature. */
	hp: number;
	ac: number;
	/** Initiative bonus. */
	initiative: number;
	notes?: string;
}

export interface SandboxEncounter {
	name: string;
	description: string;
	difficulty: SandboxEncounterDifficulty;
	/** Scene name this encounter is anchored to (must match a sandbox scene). */
	sceneRef: string;
	/** Hazards / environmental modifiers. */
	hazards: string[];
	/** Summary of rewards on successful clear. */
	rewards: string[];
	/** Ordered initiative deck. */
	monsters: SandboxEncounterEntry[];
}

export const sandboxEncounters: SandboxEncounter[] = [
	{
		name: "Day Zero — The Janitor's Fall",
		description:
			"Tutorial combat. The mana-warped janitor-Anomaly blocks the exit corridor. One round of advantage for the party before pressure ramps.",
		difficulty: "easy",
		sceneRef: "Day Zero: The Diagnosed's Mirror (R5)",
		hazards: [
			"Fluorescent lighting flickers — disadvantage on Perception beyond 15ft.",
			"Broken gurney (difficult terrain, 10ft cone in corridor center).",
		],
		rewards: [
			"Bureau-standard medical kit (3 charges of Cure Light).",
			"First Identity-Erosion fragment (story clue).",
		],
		monsters: [
			{
				name: "Janitor-Anomaly",
				quantity: 1,
				hp: 22,
				ac: 12,
				initiative: 1,
				notes: "Grapples on hit (escape DC 11). Vulnerable to fire.",
			},
		],
	},
	{
		name: "Hollow Subway — Beacon Retrieval",
		description:
			"Squad Seven's beacon is fused into the chest of a patrol-Anomaly. Ambush-friendly tunnel geometry. Body-horror tone — Sgt. Min-ho's name tag is visible on the creature.",
		difficulty: "medium",
		sceneRef: "Gate: The Hollow Subway (E-Rank)",
		hazards: [
			"Third rail live — 2d6 lightning if knocked prone in outer tunnels.",
			"Low-light: 30ft darkvision or a torch required.",
		],
		rewards: [
			"Minor Relic (roll E-Rank loot table).",
			"Squad Seven beacon (quest item).",
			"Rep +1 Bureau Sentinels.",
		],
		monsters: [
			{
				name: "Subway Anomaly (Patrol)",
				quantity: 8,
				hp: 15,
				ac: 12,
				initiative: 2,
			},
			{
				name: "Beacon-Host Anomaly (Sgt. Min-ho)",
				quantity: 1,
				hp: 48,
				ac: 14,
				initiative: 3,
				notes:
					"Mini-boss. Speaks in fragments. First PC to land a hit without checking the tag takes 1 Identity-Erosion point.",
			},
		],
	},
	{
		name: "The Drowned Ward — Triage Ambush",
		description:
			"Waterlogged hospital ward. Anomalies erupt from stretcher-bags and IV lines.",
		difficulty: "medium",
		sceneRef: "Gate: The Drowned Ward (D-Rank)",
		hazards: [
			"Half the floor is 2ft deep — difficult terrain.",
			"Mana-tainted water: CON save DC 12 or poisoned 1 minute.",
		],
		rewards: ["D-Rank loot table roll.", "Surgical Sigil (uncommon)."],
		monsters: [
			{ name: "Drowned Anomaly", quantity: 10, hp: 28, ac: 13, initiative: 2 },
			{
				name: "Surgeon-Wraith",
				quantity: 1,
				hp: 65,
				ac: 15,
				initiative: 4,
				notes: "Lifesteal on crit.",
			},
		],
	},
	{
		name: "Fungal Depths — Spore Bloom",
		description:
			"Sub-level fungal growth. Spores trigger hallucinations that mirror each PC's backstory.",
		difficulty: "medium",
		sceneRef: "Gate: The Fungal Depths (D-Rank)",
		hazards: [
			"Spore Cloud — WIS save DC 14 or frightened of a hallucinated figure.",
			"Bioluminescent cap lights reveal hidden passages on a Perception 15.",
		],
		rewards: ["D-Rank loot table roll.", "Mycelium Tattoo (uncommon)."],
		monsters: [
			{ name: "Fungal Swarm", quantity: 12, hp: 18, ac: 11, initiative: 0 },
			{
				name: "Elder Mycelium",
				quantity: 1,
				hp: 72,
				ac: 14,
				initiative: 1,
				notes: "Roots entangle on hit.",
			},
		],
	},
	{
		name: "Verdant Overgrowth — Choking Vines",
		description:
			"Office-tower choked with vegetation. The Awoko Cult has tagged walls throughout.",
		difficulty: "hard",
		sceneRef: "Gate: The Verdant Overgrowth (C-Rank)",
		hazards: [
			"Vines pull restrained targets 10ft per turn.",
			"Cult graffiti: PCs at Identity-Erosion 1+ must make a WIS save DC 13 each round or lose reaction.",
		],
		rewards: ["C-Rank loot table roll.", "First explicit Awoko Cult clue."],
		monsters: [
			{ name: "Verdant Stalker", quantity: 6, hp: 45, ac: 14, initiative: 4 },
			{
				name: "Thorn-Cleric (Awoko)",
				quantity: 1,
				hp: 80,
				ac: 15,
				initiative: 3,
			},
		],
	},
	{
		name: "Ashen Vault — Furnace Pyre",
		description:
			"Burning subterranean vault. A kidnapped Bureau researcher (Dr. Hayashi's colleague) is chained to the furnace.",
		difficulty: "hard",
		sceneRef: "Gate: The Ashen Vault (C-Rank)",
		hazards: [
			"Ambient heat: CON save DC 13 each round or 1 level of exhaustion.",
			"Furnace detonation on round 6 if not disabled (8d6 fire, 20ft radius).",
		],
		rewards: [
			"Rescued researcher unlocks a Bureau research side-quest.",
			"C-Rank loot table roll + Fireweave Runes.",
		],
		monsters: [
			{ name: "Cinder Shade", quantity: 8, hp: 38, ac: 13, initiative: 3 },
			{
				name: "Furnace-Warden Anomaly",
				quantity: 1,
				hp: 110,
				ac: 16,
				initiative: 2,
			},
		],
	},
	{
		name: "Sunken Tunnels — Pressure Crush",
		description:
			"Collapsed subway with rising water. Distant scream announces the S-Rank Anomaly is loose in the district (story beat, not engaged).",
		difficulty: "hard",
		sceneRef: "Gate: The Sunken Tunnels (B-Rank)",
		hazards: [
			"Water level rises 5ft per round — swim checks required by round 4.",
			"Pressure pops: DC 15 CON save or 1d6 thunder damage on round 5.",
		],
		rewards: ["B-Rank loot table.", "Pressure Sigil."],
		monsters: [
			{
				name: "Tunnel Anomaly (Fused Commuter)",
				quantity: 6,
				hp: 55,
				ac: 14,
				initiative: 3,
			},
			{
				name: "Brine Leviathan (sub-boss)",
				quantity: 1,
				hp: 160,
				ac: 17,
				initiative: 2,
			},
		],
	},
	{
		name: "Frozen Citadel — Thaw Threshold",
		description:
			"Glacial spire at district edge. Bureau recon beacon at the peak. The Awoko have sent a recruitment envoy.",
		difficulty: "hard",
		sceneRef: "Gate: The Frozen Citadel (B-Rank)",
		hazards: [
			"Bitter Cold (DC 15 CON each hour).",
			"Ice bridges collapse on 3+ concurrent combatants.",
		],
		rewards: ["B-Rank loot table.", "Frostweave Relic fragment."],
		monsters: [
			{ name: "Frost Revenant", quantity: 5, hp: 60, ac: 15, initiative: 2 },
			{
				name: "Awoko Herald (Envoy)",
				quantity: 1,
				hp: 90,
				ac: 16,
				initiative: 4,
				notes: "Flees at 30% HP.",
			},
		],
	},
	{
		name: "Obsidian Spire — Mirror Gauntlet",
		description:
			"A-Rank gate. Ascent through rooms that reflect each PC's backstory. Heavy Regent foreshadowing.",
		difficulty: "deadly",
		sceneRef: "Gate: The Obsidian Spire (A-Rank)",
		hazards: [
			"Each room mirrors 1 PC. That PC fights a reflection-version of themselves with 50% HP.",
			"Unresolved reflections gain 1 Identity-Erosion point to their original.",
		],
		rewards: ["A-Rank loot table.", "Obsidian Prism (legendary)."],
		monsters: [
			{
				name: "Mirror-Self (PC echo)",
				quantity: 1,
				hp: 0,
				ac: 0,
				initiative: 0,
				notes:
					"Stats scale 1:1 with the PC it mirrors — auto-populated at session start.",
			},
			{ name: "Spire Warden", quantity: 1, hp: 200, ac: 18, initiative: 5 },
		],
	},
	{
		name: "Regent's Domain — Throne Confrontation",
		description:
			"S-Rank finale. The Regent reveals their face as a composite of the PCs' own un-awakened selves. Three phases. This is the campaign's emotional and mechanical climax.",
		difficulty: "legendary",
		sceneRef: "Gate: The Regent's Domain (S-Rank)",
		hazards: [
			"Phase 1 — Throne: 6 Shadow Soldiers + The Regent (attacks single targets).",
			"Phase 2 — Archive: PCs see their mirror-selves. Save DC 18 or lose 1 Identity-Erosion.",
			"Phase 3 — The Name: Final monologue. PCs can parley if Identity-Erosion total \u2264 4.",
		],
		rewards: [
			"Regent Relic (campaign MacGuffin, grants Shadow Soldier pact).",
			"Memory-Care Wing permanently shutters (campaign closure).",
		],
		monsters: [
			{
				name: "Shadow Soldier (Anonymous)",
				quantity: 6,
				hp: 75,
				ac: 15,
				initiative: 4,
			},
			{
				name: "The Regent",
				quantity: 1,
				hp: 400,
				ac: 20,
				initiative: 6,
				notes: "Legendary actions ×3 per round. See Chapter 16 stat block.",
			},
		],
	},
	{
		name: "Random Anomaly Encounter (Filler Deck)",
		description:
			"Generic roaming Anomaly filler — rolled when the party is traveling between hubs. Warden can fire this any time.",
		difficulty: "easy",
		sceneRef: "Outer Slums: Covered Market (Ch. 31 Location 2)",
		hazards: ["Civilian bystanders — collateral damage penalty if any die."],
		rewards: [
			"Small Rep nudge toward whichever faction the Anomaly was attacking.",
		],
		monsters: [
			{ name: "Wandering Anomaly", quantity: 3, hp: 30, ac: 12, initiative: 1 },
		],
	},
];
