/**
 * SANDBOX ENCOUNTERS — "The Shadow of the Regent"
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
 *   - A-rank → Levels 8-13  (CR 9-12,   48 Anomalies; e.g. anomaly-0004)  Obsidian Spire, Citadel approach
 *   - S-rank → Levels 13-15 (CR 13-21,  51 Anomalies; e.g. anomaly-0005)  the Regent and his Anchor-throne
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
			"Introductory pocket-breach horror. The Diagnosed is a Gloamreach symptom reaching through a mirror, not a normal monster. Use this fight to introduce memory loss, names, and Regent-Marked consequences.",
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
			"A Regent-Marked clue, not an Identity-Erosion point.",
		],
		monsters: [
			{
				name: "The Diagnosed",
				quantity: 1,
				hp: 28,
				ac: 13,
				initiative: 3,
				notes:
					"D-Rank elite. Mirror Retreat once per fight. Forgetting Gaze may apply Regent-Marked instead of raw damage pressure.",
			},
			{
				name: "Forgetting Swarm",
				quantity: 1,
				hp: 22,
				ac: 12,
				initiative: 1,
				notes: "Appears in the lengthening hallway if the party runs from the wrong question.",
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
			"The Name-Gate demands fare; giving a true name grants easy passage but risks Regent-Marked.",
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
			"Death-records surface and update each round unless destroyed, drowned, or contradicted by a Claim.",
		],
		rewards: ["D-Rank loot table roll.", "Catalog access.", "Void Claim clue."],
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
		rewards: ["D-Rank loot table roll.", "Mycelium reagent.", "Mother Rust treatment component."],
		monsters: [
			{ name: "Fungal Swarm", quantity: 12, hp: 18, ac: 11, initiative: 0 },
			{
				name: "Mycelium Hive Queen",
				quantity: 1,
				hp: 72,
				ac: 14,
				initiative: 1,
				notes: "Regenerates while touching the network. Fire stops regeneration for one round.",
			},
		],
	},
	{
		name: "Remembering Orchard — Harvest Bell",
		description:
			"A beautiful orchard where tribute memories hang like fruit and the Caretaker prunes pain until people forget why they wanted freedom.",
		difficulty: "hard",
		sceneRef: "Remembering Orchard",
		hazards: [
			"Memory fruit grants clues but risks personality bleed if eaten carelessly.",
			"Harvest Bell summons orchard thralls unless silenced or its claim on a stolen memory is broken.",
			"Attacking the Caretaker before learning the tribute law turns villagers hostile or terrified.",
		],
		rewards: ["Memory fruit clue.", "Blood Claim clue.", "Civilian trust if tribute is broken safely."],
		monsters: [
			{ name: "Orchard Thrall", quantity: 6, hp: 45, ac: 14, initiative: 3 },
			{
				name: "The Orchard Caretaker",
				quantity: 1,
				hp: 80,
				ac: 15,
				initiative: 4,
				notes: "Can graft memories, redirect attacks, and call the Harvest Bell.",
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
		rewards: ["C-Rank loot table roll.", "A truth the burning hall cannot deny.", "Abyss Claim clue."],
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
		rewards: ["B-Rank loot table.", "Pressure Sigil.", "Blood Claim clue."],
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
		rewards: ["B-Rank loot table.", "Armor or shield Sigil.", "Abyss Claim clue."],
		monsters: [
			{ name: "Oathbound Armor", quantity: 5, hp: 60, ac: 16, initiative: 2 },
			{
				name: "Oath-Forge Colossus",
				quantity: 1,
				hp: 180,
				ac: 18,
				initiative: 1,
				notes: "Cannot be defeated permanently while the Bastion's oath remains unresolved.",
			},
		],
	},
	{
		name: "Obsidian Spire — Mirror Gauntlet",
		description:
			"The Spire tests whether the party seeks resolution or a cleaner-looking throne. Reflections tempt, accuse, and offer genuinely useful power.",
		difficulty: "deadly",
		sceneRef: "Obsidian Spire",
		hazards: [
			"Each trial mirrors one character's desire for authority, safety, revenge, or control.",
			"Unresolved reflections grant the Regent insight into that character during the finale.",
			"Accepting a Spire bargain grants power and establishes a visible cost.",
		],
		rewards: ["A-Rank loot table.", "Obsidian Prism.", "Claim placement access or Watcher alliance."],
		monsters: [
			{
				name: "Mirror-Self",
				quantity: 1,
				hp: 0,
				ac: 0,
				initiative: 0,
				notes: "Stats scale to the character being tested. Defeat, confession, refusal, or reconciliation can resolve the trial.",
			},
			{ name: "Spire Guardian", quantity: 1, hp: 200, ac: 18, initiative: 5 },
		],
	},
	{
		name: "Regent's Citadel — Throne Confrontation",
		description:
			"S-Rank finale. The Regent receives the party in court, fights as the sovereign Anchor, and may be forced into the Human Remnant phase — the Domain's curated costume flickering, never a real soul — by truth, Claim contradiction, or emotional proof.",
		difficulty: "legendary",
		sceneRef: "The Regent's Citadel",
		hazards: [
			"Phase 1 — The Wearer of Faces: he greets them wearing the dead, with soft offers, convincing grief, and temptation.",
			"Phase 2 — The All-Seeing Domain: lair effects from roads, the dark, weather, the claimed dead, and the horror of being seen everywhere at once.",
			"Phase 3 — Human Remnant: the Domain's costume flickers (no soul beneath; he was never human) — triggered by the Faded Family Photo, Ms. Park, a Claim contradiction, or major sacrifice.",
		],
		rewards: [
			"Ending-based artifact slate.",
			"Anchor resolved: broken, sealed, transformed, or inherited.",
			"Gloamreach fate determined.",
		],
		monsters: [
			{ name: "Regent Courtier", quantity: 6, hp: 75, ac: 15, initiative: 4 },
			{
				name: "The Regent",
				quantity: 1,
				hp: 400,
				ac: 20,
				initiative: 6,
				notes: "Legendary actions x3 per round. See Chapter 16 and Chapter 28 framing.",
			},
		],
	},
	{
		name: "Gloamreach Road Pressure",
		description:
			"Generic travel pressure encounter for the Road of Writs, tribute settlements, and wild Domain routes. Use when the party delays, travels while marked, carries a Claim openly, or breaks a settlement's rule.",
		difficulty: "easy",
		sceneRef: "Road of Writs",
		hazards: [
			"Civilian bystanders, settlement witnesses, or a visible toll marker make collateral damage socially costly.",
			"A local law is active; reveal it before punishing the party for violating it.",
		],
		rewards: ["Small reputation shift toward whoever the party protected.", "One road-law clue."],
		monsters: [
			{ name: "Wandering Domain Beast", quantity: 3, hp: 30, ac: 12, initiative: 1 },
		],
	},
];
