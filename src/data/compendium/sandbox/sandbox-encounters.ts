/**
 * SANDBOX ENCOUNTERS — "Run Silent"
 *
 * One encounter deck per major combat, horror, or pressure scene in the
 * Gloamreach sandbox. Each encounter declares the enemy roster, hazards,
 * and reward notes the Warden should surface.
 *
 * BESTIARY SOURCING (the module's "Appendix C"): every enemy stat block below
 * is a rank-appropriate reskin of a canonical RA compendium Anomaly from the
 * bestiary in `src/data/compendium/anomalies/rank-{d,c,b,a,s}.ts`
 * (source_book: "Rift Ascendant Canon"). The costume and encounter alias may
 * change; the source mechanics (HP/AC/CR/abilities) do not. The bestiary holds
 * 243 canonical Anomalies. Rank → level band → party-of-4 budget (verified CR
 * bands; HP/AC here are pre-tuned to it):
 *   - D-rank → Levels 1-5   (CR 1/8-1,  48 Anomalies; e.g. anomaly-0006)  early sites, Hollow Way, road encounters
 *   - C-rank → Levels 3-7   (CR 2-5,    48 Anomalies; e.g. anomaly-0002)  Drowned Ledgerfen, Fungal Depths, Orchard, Counting-House
 *   - B-rank → Levels 6-10  (CR 6-8,    48 Anomalies; e.g. anomaly-0003)  Sunken Tunnels, Bastion Golemfall, Awoko Sanctum
 *   - A-rank → Levels 8-10  (CR 9-12,   48 Anomalies; e.g. anomaly-0004)  Obsidian Spire, the final crossing
 *   - S-rank → Levels 9-10 (CR 13-21,  52 Anomalies; e.g. anomaly-0700 "The Quiet")  the gated kill
 * The Quiet and its worn dead are bespoke canon creatures referenced directly by
 * id (no reskin needed): anomaly-0700 The Quiet, 0701 The Worn, 0702 The Caller,
 * 0703 The Wrong Shape, 0704 The Hollowed — use them for persecution and the hunt.
 * An encounter's `difficulty` + the level band of its `sceneRef` choose the
 * rank; the Warden (or the site's "Boss" notes) pulls the matching Anomaly by
 * `id` from that rank file and reskins it without altering the source numbers.
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
		name: "Day Zero — The Diagnosed",
		description:
			"Introductory pocket-breach horror. The Diagnosed is a Gloamreach symptom reaching through a mirror, not a normal monster. Use this fight to introduce memory loss, names, and Quiet-Marked consequences.",
		difficulty: "easy",
		sceneRef: "Day Zero: The Diagnosed's Mirror (R5)",
		hazards: [
			"Flickering hospital light: disadvantage on Perception beyond 15 ft.",
			"Mirror frost: a creature shoved into the bathroom mirror takes 1d6 cold damage and hears a forgotten name.",
			"Resident danger: reckless area effects risk civilian harm and should matter narratively.",
		],
		rewards: [
			"The Faded Family Photo, if recovered.",
			"Bureau trust if the party reports the breach honestly.",
			"A Quiet-Marked clue, not an Identity-Erosion point.",
		],
		monsters: [
			{
				name: "The Diagnosed",
				quantity: 1,
				hp: 28,
				ac: 13,
				initiative: 3,
				notes:
					"D-Rank elite. Mirror Retreat once per fight. Forgetting Gaze may apply Quiet-Marked instead of raw damage pressure.",
			},
			{
				name: "Forgetting Swarm",
				quantity: 1,
				hp: 22,
				ac: 12,
				initiative: 1,
				notes:
					"Appears in the lengthening hallway if the party runs from the wrong question.",
			},
		],
	},
	{
		name: "Hollow Way — Beacon Retrieval",
		description:
			"The party hunts Strike Team Seven's beacon down the Hollow Way — the Domain's Essence-lit intake-throat — toward its source. The Name-Gate counts passage in names, not coin: money works poorly, names work too well. The beacon is a lure; there are no survivors at its end.",
		difficulty: "medium",
		sceneRef: "The Hollow Way",
		hazards: [
			"Exposed Essence-vein in the stone: 2d6 lightning to anyone forced into contact with a live conduit.",
			"The Name-Gate demands fare; giving a true name grants easy passage but risks Quiet-Marked.",
			"The Way speaks names into the dark — including names of those who have not entered yet.",
		],
		rewards: [
			"Squad Seven beacon.",
			"Minor Relic or D-Rank Rune.",
			"Rex may become a companion if treated kindly.",
		],
		monsters: [
			{ name: "Transit Wretch", quantity: 8, hp: 15, ac: 12, initiative: 2 },
			{
				name: "Beacon-Host Anomaly",
				quantity: 1,
				hp: 48,
				ac: 14,
				initiative: 3,
				notes:
					"Mini-boss. Speaks in broken Strike Team phrases. Careful examination reveals the beacon is being used as bait, not just lodged in flesh.",
			},
		],
	},
	{
		name: "Drowned Ledgerfen — Triage Ambush",
		description:
			"Waterlogged archive ward where the black water tries to make its diagnoses, deaths, and dooms come true.",
		difficulty: "medium",
		sceneRef: "Drowned Ledgerfen",
		hazards: [
			"Half the floor is 2 ft. deep: difficult terrain.",
			"Mana-tainted water: Vitality save DC 12 or poisoned for 1 minute.",
			"Death-records surface and update each round unless destroyed, drowned, or contradicted by a spoken ward.",
		],
		rewards: ["D-Rank loot table roll.", "Catalog access.", "A Means clue."],
		monsters: [
			{ name: "Drowned Record", quantity: 10, hp: 28, ac: 13, initiative: 2 },
			{
				name: "The Head Surgeon",
				quantity: 1,
				hp: 65,
				ac: 15,
				initiative: 4,
				notes: "Lifesteal on crit. Treats wounds as paperwork errors.",
			},
		],
	},
	{
		name: "Fungal Depths — Spore Bloom",
		description:
			"Cavern ecology where secrets grow bodies and old grief becomes a spore pattern.",
		difficulty: "medium",
		sceneRef: "Fungal Depths",
		hazards: [
			"Spore cloud: Sense save DC 14 or frightened of a hallucinated figure.",
			"Bioluminescent caps reveal hidden paths on a DC 15 Perception check.",
			"Secrets spoken aloud here may return later as fungal echoes.",
		],
		rewards: [
			"D-Rank loot table roll.",
			"Mycelium reagent.",
			"Mother Rust treatment component.",
		],
		monsters: [
			{ name: "Fungal Swarm", quantity: 12, hp: 18, ac: 11, initiative: 0 },
			{
				name: "Mycelium Hive Queen",
				quantity: 1,
				hp: 72,
				ac: 14,
				initiative: 1,
				notes:
					"Regenerates while touching the network. Fire stops regeneration for one round.",
			},
		],
	},
	{
		name: "Remembering Orchard — Harvest Bell",
		description:
			"A beautiful orchard where given memories hang like fruit and the Caretaker prunes pain until people forget why they wanted freedom.",
		difficulty: "hard",
		sceneRef: "Remembering Orchard",
		hazards: [
			"Memory fruit grants clues but risks personality bleed if eaten carelessly.",
			"Harvest Bell summons orchard thralls unless silenced or its claim on a stolen memory is broken.",
			"Attacking the Caretaker before learning the orchard's custom turns villagers hostile or terrified.",
		],
		rewards: [
			"Memory fruit clue.",
			"A Means clue.",
			"Civilian trust if the custom is broken safely.",
		],
		monsters: [
			{ name: "Orchard Thrall", quantity: 6, hp: 45, ac: 14, initiative: 3 },
			{
				name: "The Orchard Caretaker",
				quantity: 1,
				hp: 80,
				ac: 15,
				initiative: 4,
				notes:
					"Can graft memories, redirect attacks, and call the Harvest Bell.",
			},
		],
	},
	{
		name: "Ashen Counting-House — Furnace Audit",
		description:
			"Burning financial hall where debts survive death and the furnace decides which records must remain.",
		difficulty: "hard",
		sceneRef: "Ashen Counting-House",
		hazards: [
			"Ambient heat: Vitality save DC 13 each round or exhaustion pressure.",
			"Furnace detonation on round 6 if not disabled: 8d6 fire in 20 ft. radius.",
			"Chains of molten memory can bind characters to a fresh grief or loss.",
		],
		rewards: [
			"C-Rank loot table roll.",
			"A truth the burning hall cannot deny.",
			"A Means clue.",
		],
		monsters: [
			{ name: "Cinder-Wraith", quantity: 8, hp: 38, ac: 13, initiative: 3 },
			{
				name: "Warden of Embers",
				quantity: 1,
				hp: 110,
				ac: 16,
				initiative: 2,
				notes: "Attacks with grasping fire and chains of molten memory.",
			},
		],
	},
	{
		name: "Sunken Tunnels — Pressure Crush",
		description:
			"Drowned under-road where names of the dead are still charged for passage and the water listens for anyone who speaks too loudly.",
		difficulty: "hard",
		sceneRef: "Sunken Tunnels",
		hazards: [
			"Water rises 5 ft. per round during the collapse sequence.",
			"Pressure pops: Vitality save DC 15 or 1d6 thunder damage on round 5.",
			"Speaking a drowned name aloud may summon or soothe a fused commuter.",
		],
		rewards: ["B-Rank loot table.", "Pressure Sigil.", "A Means clue."],
		monsters: [
			{ name: "Fused Commuter", quantity: 6, hp: 55, ac: 14, initiative: 3 },
			{
				name: "Abyssal Leviathan",
				quantity: 1,
				hp: 160,
				ac: 17,
				initiative: 2,
				notes: "Grapples, drags, separates, and uses the tunnels as its body.",
			},
		],
	},
	{
		name: "Bastion Golemfall — Oath-Forge Siege",
		description:
			"A fallen fortress where empty armor keeps defending a wall that already failed.",
		difficulty: "hard",
		sceneRef: "Bastion Golemfall",
		hazards: [
			"Siege bells impose fear pressure unless the party carries the fallen banner.",
			"Unresolved oaths regenerate construct defenders each round.",
			"A character who swears to defend another gains advantage here, but the oath follows them.",
		],
		rewards: ["B-Rank loot table.", "Armor or shield Sigil.", "A Means clue."],
		monsters: [
			{ name: "Oathbound Armor", quantity: 5, hp: 60, ac: 16, initiative: 2 },
			{
				name: "Oath-Forge Colossus",
				quantity: 1,
				hp: 180,
				ac: 18,
				initiative: 1,
				notes:
					"Cannot be defeated permanently while the Bastion's oath remains unresolved.",
			},
		],
	},
	{
		name: "Obsidian Spire — Mirror Gauntlet",
		description:
			"The Spire tests whether the party seek a way home or the power to stop being prey. Reflections tempt, accuse, and offer genuinely useful power.",
		difficulty: "deadly",
		sceneRef: "Obsidian Spire",
		hazards: [
			"Each trial mirrors one character's desire for authority, safety, revenge, or control.",
			"Unresolved reflections give the Quiet a lure shaped for that character during the finale.",
			"Accepting a Spire bargain grants power and establishes a visible cost.",
		],
		rewards: [
			"A-Rank loot table.",
			"Obsidian Prism.",
			"A truth about the Quiet, or Watcher alliance.",
		],
		monsters: [
			{
				name: "Mirror-Self",
				quantity: 1,
				hp: 0,
				ac: 0,
				initiative: 0,
				notes:
					"Stats scale to the character being tested. Defeat, confession, refusal, or reconciliation can resolve the trial.",
			},
			{ name: "Spire Guardian", quantity: 1, hp: 200, ac: 18, initiative: 5 },
		],
	},
	{
		name: "The Threshold — Escape or the Gated Kill",
		description:
			"The climax of Run Silent. There is no throne and no court. Either the party are running for the threshold to escape the Gloamreach, or — at Level 9+, with the Means assembled (see The Means to End It) — they have chosen the one place they can try to put the Quiet down for good. Run the Quiet at its full stat block, with the Hunt Clock and everything it can do. It is not a boss waiting in a room; it is the dark closing in while the party do the one thing they came to do.",
		difficulty: "legendary",
		sceneRef: "The Threshold",
		hazards: [
			"It hunts by noise, light, and Essence: every loud action and every power used fills the Hunt Clock and brings it faster.",
			"It wears the dead: it comes first as someone the party loves or lost, and the natives who helped them cannot follow them out.",
			"Nothing Ordinary Can End It: unless the party are Level 9+ and hold the Means, the Quiet cannot be reduced below 1 HP and simply withdraws — escape is the only victory then.",
		],
		rewards: [
			"Escape: the party, and whoever they kept alive, get out; the Gloamreach keeps everyone else.",
			"The gated kill: the Quiet is ended, at a cost it always takes.",
			"Either way, who lived and who was taken is the campaign's real ending.",
		],
		monsters: [
			{
				name: "The Worn",
				quantity: 4,
				hp: 78,
				ac: 13,
				initiative: 2,
				notes:
					"anomaly-0701. The dead it sends ahead, wearing faces the party knows.",
			},
			{
				name: "The Quiet",
				quantity: 1,
				hp: 444,
				ac: 19,
				initiative: 8,
				notes:
					"anomaly-0700. Legendary + lair actions. Unkillable unless the party are Level 9+ and hold the Means (see The Means to End It). It takes someone if it can.",
			},
		],
	},
	{
		name: "The Hunt — Persecution in the Open",
		description:
			"The default persecution beat for any stretch of exposed hunting ground. Use it when the party live loud, linger, burn Essence, or break a native rule and the Hunt Clock fills. The Quiet rarely comes itself this early — it sends the worn dead ahead. The goal is not to win the fight; it is to reach a wardline, or the dark and silence, before more come.",
		difficulty: "medium",
		sceneRef: "The Hunting Ground",
		hazards: [
			"This is a stalk-hide-flee scene, not a brawl: standing and fighting fills the Hunt Clock and draws worse.",
			"Light and noise made here bring the next wave faster; a single Essence use can bring the Quiet itself.",
			"Reaching a native safe-hold (and keeping its rules) ends the scene; running water and hard thresholds buy moments.",
		],
		rewards: [
			"Distance, and the lesson that silence and the dark are the only reliable safety.",
			"Scavenged survival gear (light, warding, quiet); a native's trust if the party protected one.",
		],
		monsters: [
			{
				name: "The Worn",
				quantity: 3,
				hp: 78,
				ac: 13,
				initiative: 2,
				notes:
					"anomaly-0701 (scale up by tier to The Caller 0702, The Wrong Shape 0703, The Hollowed 0704). Lures and ambushers wearing the dead.",
			},
		],
	},
];
