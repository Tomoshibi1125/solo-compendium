// ============================================================================
// SANDBOX NPC ROSTER: "Run Silent"
//
// 72 unique named NPCs across 5 factions, aligned to the Gloamreach Rift Interior.
// 8 Bureau (material-side) + 64 native (Vermillion, Awoko, Independent, Gloamreach-Touched).
// Native roster includes merchants, money-changers, forgers, innkeepers, apothecaries,
// undertakers, militia, road-pilots, smugglers, cult comfort-workers, claimed echoes,
// and the Quiet's worn dead (the Long Man, the Welcomer, heralds, and the First Claimed).
// Each NPC supports recruitment, faction pressure, side quests, or final-act payoff.
// ============================================================================

export interface SandboxNPC {
	id: string;
	name: string;
	title: string;
	faction:
		| "bureau_sentinels"
		| "vermillion_guild"
		| "awoko_cult"
		| "independent"
		| "anomaly_adjacent";
	level: number;
	/**
	 * "ascendant" = an awakened, powered individual (has a Job + a rank);
	 * "mundane" = a non-awakened civilian (no powers; carries a trade label, not a real rank).
	 * Defaults to "ascendant" when omitted.
	 */
	kind?: "ascendant" | "mundane";
	/**
	 * Hunter rank letter E–SS (ascendants only). Informational/display — NEVER a permission Rift.
	 */
	rank?: string;
	job: string;
	hp: number;
	ac: number;
	description: string;
	personality: string;
	motivation: string;
	backstory: string;
	keyAbilities: string[];
	recruitCondition: string;
	isRecruitable: boolean;
	guildAffiliation: string | null;
	location: string;
	questHook: string | null;
	leveling: {
		xp: number;
		xpToNextLevel: number;
		autoLevel: boolean;
		maxLevel: number;
		hpPerLevel: number;
		levelAbilities: Record<number, string>;
	};
}

type NPCInput = Omit<SandboxNPC, "leveling"> & {
	maxLevel?: number;
	hpPerLevel?: number;
	autoLevel?: boolean;
	levelAbilities?: Record<number, string>;
};

export const makeNPC = (npc: NPCInput): SandboxNPC => ({
	...npc,
	kind: npc.kind ?? "ascendant",
	leveling: {
		xp: 0,
		xpToNextLevel: Math.max(300, npc.level * 500),
		autoLevel: npc.autoLevel ?? true,
		maxLevel: npc.maxLevel ?? Math.min(12, npc.level + 4),
		hpPerLevel: npc.hpPerLevel ?? 6,
		levelAbilities: npc.levelAbilities ?? {},
	},
});

// ============================================================================
// BUREAU SENTINELS - Cordon authority, research, logistics, and containment
// ============================================================================

// Recruitment note: Bureau ranking officers are *allies*, not recruits — they
// answer to the Bureau chain of command, not a player guild. Only the green
// recruit (Sato) and the corporal field-cook (Deng) can be recruited.
const bureauSentinels: SandboxNPC[] = [
	makeNPC({
		id: "npc-bureau-001",
		name: "Commander Park Jae-won",
		title: "Bureau Domain Response Commander",
		faction: "bureau_sentinels",
		level: 8,
		job: "Destroyer",
		hp: 95,
		ac: 18,
		description:
			"A battle-scarred commander with mana-reinforced prosthetics and a voice trained to stay calm while the map collapses. Park commands the material-side Annex outside the Gloamreach threshold.",
		personality:
			"Stern, clipped, protective, and unwilling to confuse protocol with courage once civilians are at risk.",
		motivation:
			"Prevent a Rift Break, recover missing teams, and keep Central Command from sacrificing survivors for clean reports.",
		backstory:
			"Park survived earlier high-rank Rift responses and knows the difference between a bad clear and a ruler wearing a Rift as a crown.",
		keyAbilities: ["Fortification Aura", "Command Strike", "Hold the Line"],
		recruitCondition:
			"Cannot be recruited — Commander Park answers to the Bureau chain of command. Earn Bureau Trusted reputation and he fights as a staunch field ally, but he will not abandon his post to join a party or guild.",
		isRecruitable: false,
		guildAffiliation: "Bureau Sentinels",
		location: "Bureau Domain Response Annex",
		questHook:
			"Park needs Strike Team Seven's fate confirmed before Central Command writes them off.",
		maxLevel: 12,
		hpPerLevel: 12,
		levelAbilities: { 10: "Adamant Will", 12: "Final Stand" },
	}),
	makeNPC({
		id: "npc-bureau-002",
		name: "Quartermaster Lin Mei-hua",
		title: "Cordon Supply Officer",
		faction: "bureau_sentinels",
		level: 4,
		job: "Technomancer",
		hp: 38,
		ac: 14,
		description:
			"A meticulous logistics officer who tracks every ration, glow rod, and field dressing with near-religious intensity.",
		personality:
			"Anxious, precise, quietly compassionate, and more generous when no one is watching.",
		motivation: "Keep the Annex supplied long enough for the party to matter.",
		backstory:
			"Lin was never supposed to be near an S-Rank threshold. She became indispensable because panic is harder to maintain when the shelves are organized.",
		keyAbilities: [
			"Equipment Maintenance",
			"Inventory Mastery",
			"Emergency Fabrication",
		],
		recruitCondition:
			"Cannot be recruited — Bureau supply officer. Protect the Annex line and she keeps the party resupplied as an ally, but she serves the Bureau, not a guild.",
		isRecruitable: false,
		guildAffiliation: null,
		location: "Bureau Domain Response Annex - Armory",
		questHook:
			"Lin has found missing supplies signed out by a name that does not exist in Bureau records.",
	}),
	makeNPC({
		id: "npc-bureau-003",
		name: "Sergeant Yoon Hye-jin",
		title: "Domain Scout Leader",
		faction: "bureau_sentinels",
		level: 5,
		job: "Stalker",
		hp: 52,
		ac: 16,
		description:
			"A quiet scout with chalk marks on her gloves and a habit of checking exits even in rooms she has already cleared.",
		personality: "Pragmatic, watchful, loyal, and economical with words.",
		motivation:
			"Find her missing scouts and learn why the old roads keep returning their signals from impossible directions.",
		backstory:
			"Yoon has never lost a team until the Gloamreach began answering radio calls in their voices.",
		keyAbilities: ["Shadow Step", "Anomaly Sense", "Precision Strike"],
		recruitCondition:
			"Cannot be recruited — Bureau scout leader. Resolve the Missing Strike Team and she ranges alongside the party as a Bureau ally, never as a recruit.",
		isRecruitable: false,
		guildAffiliation: null,
		location: "Patrol routes on the old roads",
		questHook:
			"Yoon needs escorts to follow an AFA ghost-ping toward Bastion Golemfall.",
	}),
	makeNPC({
		id: "npc-bureau-004",
		name: "Dr. Serin Hayashi",
		title: "Rift Interior Researcher",
		faction: "bureau_sentinels",
		level: 6,
		job: "Esper",
		hp: 42,
		ac: 12,
		description:
			"A brilliant field researcher with ink-stained cuffs, too many notes, and the courage to say that the Gloamreach is law before it is terrain.",
		personality:
			"Fast-talking, compassionate, intellectually reckless, and more frightened of bad assumptions than monsters.",
		motivation:
			"Prove that the thing inside the Gloamreach cannot be cleared — only survived, or fled.",
		backstory:
			"Hayashi's research on Rift Interiors was classified because it made command staff uncomfortable. The Gloamreach proves she was underestimating the problem.",
		keyAbilities: ["Analyze Weakness", "Aetheric Shield", "Interior Theory"],
		recruitCondition:
			"Cannot be recruited — Bureau researcher. Protect her work and she becomes a vital ally and quest-giver, but she stays with the Bureau.",
		isRecruitable: false,
		guildAffiliation: null,
		location: "Bureau Domain Response Annex - Evidence Locker",
		questHook:
			"Hayashi needs a live reading from a Mana Vein node before the final crossing.",
	}),
	makeNPC({
		id: "npc-bureau-005",
		name: "Agent Kira Blackwood",
		title: "Bureau Intelligence Operative",
		faction: "bureau_sentinels",
		level: 7,
		job: "Stalker",
		hp: 58,
		ac: 17,
		description:
			"A pale intelligence agent with controlled movements, half-truths, and classified orders involving pre-threshold Relic activity.",
		personality:
			"Cold, dry, observant, and capable of empathy she treats as an operational weakness.",
		motivation:
			"Complete her mission without letting Central Command turn the Gloamreach's horrors into a weapon.",
		backstory:
			"Blackwood knew more than the briefing allowed. Her secrecy can become betrayal, confession, or sacrifice.",
		keyAbilities: ["Infiltration", "Dead Drop", "Counter-Intelligence"],
		recruitCondition:
			"Cannot be recruited — Bureau intelligence operative under standing orders. Complete her quest to turn her into an ally against Central Command, but never a party recruit.",
		isRecruitable: false,
		guildAffiliation: null,
		location: "Bureau Domain Response Annex - Intelligence desk",
		questHook:
			"Blackwood needs deniable assets to identify which piece of the Means manifested before the threshold stabilized.",
	}),
	makeNPC({
		id: "npc-bureau-006",
		name: "Corporal Deng Wei",
		title: "Heavy Weapons Specialist",
		faction: "bureau_sentinels",
		level: 4,
		job: "Destroyer",
		hp: 48,
		ac: 16,
		description:
			"A broad-shouldered gunner and former chef whose field cannon is nearly as large as his guilt.",
		personality:
			"Gentle, exhausted, brave when others need him, and ashamed of fear he earned honestly.",
		motivation:
			"Stand his ground when the worn dead come for someone he can protect.",
		backstory:
			"Deng froze when the worn dead came for someone, and three people were taken. He has cooked for every survivor he could not save.",
		keyAbilities: ["Suppressing Fire", "Heavy Hitter", "Fortify Position"],
		recruitCondition:
			"Help Deng survive a nightmare scene and later face the worn dead without mocking his fear.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Bureau Domain Response Annex - Field kitchen",
		questHook:
			"Deng's cannon needs a gear-heart from the mills to stabilize its output.",
	}),
	makeNPC({
		id: "npc-bureau-007",
		name: "Comms Officer Reyes",
		title: "Signal Specialist",
		faction: "bureau_sentinels",
		level: 3,
		job: "Technomancer",
		hp: 28,
		ac: 12,
		description:
			"A young signal specialist who receives transmissions out of order and keeps answering anyway.",
		personality: "Fast, anxious, brilliant, and allergic to silence.",
		motivation:
			"Decode the Gloamreach's signals and prove the messages from tomorrow are warnings, not hallucinations.",
		backstory:
			"Reyes was deployed too early and promoted by necessity. She is the reason the Annex still hears anything from inside.",
		keyAbilities: ["Signal Boost", "Decrypt", "Aetheric Jammer"],
		recruitCondition:
			"Cannot be recruited — Bureau signals officer. She relays intel and fire support as an ally, but she holds the Annex relay, not a guild seat.",
		isRecruitable: false,
		guildAffiliation: null,
		location: "Bureau Domain Response Annex - Relay room",
		questHook:
			"Reyes has a message from Strike Team Seven dated two days in the future.",
	}),
	makeNPC({
		id: "npc-bureau-008",
		name: "Warden-Aspirant Sato Ken",
		title: "Bureau Recruit",
		faction: "bureau_sentinels",
		level: 2,
		job: "Holy Knight",
		hp: 22,
		ac: 13,
		description:
			"A terrified recruit in armor that does not fit, carrying more courage than training.",
		personality: "Earnest, frightened, stubborn, and desperate to be useful.",
		motivation:
			"Become worthy of the badge before the Domain teaches him what badges cost.",
		backstory:
			"Sato enlisted to pay for his sister's treatment. The Gloamreach turned his first field assignment into a war story he may not survive.",
		keyAbilities: ["Determination", "Quick Learner", "Inspire"],
		recruitCondition:
			"He joins if asked, though Park warns the party not to mistake willingness for readiness.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Bureau Domain Response Annex - Barricade lobby",
		questHook:
			"Sato found a map fragment that changes when read by the light of the deep places.",
	}),
];

// ============================================================================
// VERMILLION GUILD - Salvage, shelter, black-market support, and hard choices
// ============================================================================

const vermillionGuild: SandboxNPC[] = [
	makeNPC({
		id: "npc-verm-201",
		name: "Grist",
		title: "Arms-Dealer",
		faction: "vermillion_guild",
		level: 5,
		job: "Technomancer",
		hp: 40,
		ac: 14,
		description:
			"The Outpost's weapons-fence: salvaged edged steel, Relic-arms the Domain grew teeth into, and Essence-cells for anything that drinks them.",
		personality:
			"Cheerful, amoral about buyers, deadly serious about misfires.",
		motivation:
			"Arm anyone who can pay, then sleep at night by never selling a curse he hasn't named.",
		backstory:
			"Grist strips weapons from the Domain's deadliest sites and tests every one himself before it touches a shelf. He has the scars to prove which ones he sold anyway.",
		keyAbilities: [
			"Salvaged Arsenal",
			"Relic-Weapon Lore",
			"Essence-Cell Supply",
		],
		recruitCondition:
			"Return a Relic-weapon that turned on its buyer; he repays it in better steel.",
		isRecruitable: true,
		guildAffiliation: "The Vermillion",
		location: "Vermillion Outpost - Armoury stall",
		questHook:
			"Grist sold a blade that has started cutting toward the deep dark of its own accord, dragging its owner with it.",
	}),
	makeNPC({
		id: "npc-verm-202",
		name: "Quill",
		title: "Memory-Broker",
		faction: "vermillion_guild",
		level: 5,
		job: "Esper",
		hp: 30,
		ac: 13,
		description:
			"A trader in memory-cores harvested from the Remembering Orchard, who can sell you a skill, a language, or a stranger's happiest day — at the price of a little of your own.",
		personality:
			"Smooth, melancholy, scrupulous about consent in a trade everyone else cheats.",
		motivation:
			"Keep the memory-trade honest in a Domain that wants it predatory.",
		backstory:
			"Quill gave pieces of himself away long before he was a broker, and remembers exactly what it costs. He will not sell a core that was taken, only one that was given. It makes him poor and alive.",
		keyAbilities: [
			"Memory Appraisal",
			"Skill-Core Transfer",
			"Detects Stolen Memory",
		],
		recruitCondition:
			"Recover a stolen memory-core and let him return it instead of selling it.",
		isRecruitable: true,
		guildAffiliation: "The Vermillion",
		location: "Vermillion Outpost / Covered Market",
		questHook:
			"Quill has bought a memory that does not belong to anyone alive — and it is starting to want its body back.",
	}),
	makeNPC({
		id: "npc-verm-203",
		name: "Captain Doe",
		title: "Smuggler-Captain",
		faction: "vermillion_guild",
		level: 6,
		job: "Stalker",
		hp: 46,
		ac: 15,
		description:
			"Runs contraband — people, Relics, and forbidden Runes — between settlements along roads the Domain has not finished closing.",
		personality:
			"Cool, calculating, sentimental about exactly one thing she will never name.",
		motivation:
			"Move what the Domain forbids, and get every passenger to the other end breathing.",
		backstory:
			"Doe knows which stretches of the old roads the dark has not yet learned to watch. She has lost two crews to roads that learned faster than she did, and runs the routes anyway because someone has to carry the people no one else will.",
		keyAbilities: ["Smuggling Routes", "Hidden Cargo", "Outruns the Worn Dead"],
		recruitCondition:
			"Help her run a cargo of refugees past a worn-dead picket without paying in names.",
		isRecruitable: true,
		guildAffiliation: "The Vermillion",
		location: "The roads / Vermillion Outpost",
		questHook:
			"Doe's current cargo is a person the Quiet has marked by name. She has not decided whether to deliver or run.",
	}),
	makeNPC({
		id: "npc-verm-204",
		name: "Tallow",
		title: "Charm-Seller",
		faction: "vermillion_guild",
		level: 3,
		job: "Contractor",
		hp: 24,
		ac: 12,
		description:
			"A peddler of wards, tokens, and anti-Quiet-Marked charms — most of them comforting junk, a precious few of them genuinely real.",
		personality:
			"Patter-fast, superstitious in earnest, kinder than the grift suggests.",
		motivation:
			"Sell hope by the handful, and slip the real charms to the people who truly need them.",
		backstory:
			"Tallow learned which of his charms actually work the hard way, by surviving. He overcharges the comfortable to undercharge the doomed, and tells himself this evens out.",
		keyAbilities: ["Genuine Ward (rare)", "Reads the Marked", "Sells Hope"],
		recruitCondition:
			"Catch him slipping a real charm to a doomed family, and keep his secret.",
		isRecruitable: true,
		guildAffiliation: "The Vermillion",
		location: "Covered Market / road camps",
		questHook:
			"Tallow accidentally sold a genuine ward-charm to someone the Quiet specifically wants Marked, and the dark has noticed.",
	}),
	makeNPC({
		id: "npc-verm-101",
		name: "Cinder",
		title: "Deep-Salvage Diver",
		faction: "vermillion_guild",
		level: 5,
		job: "Stalker",
		hp: 42,
		ac: 15,
		description:
			"A native salvager who goes into the places that kill everyone else and comes back with the cores to prove it.",
		personality: "Reckless, generous, and superstitious about owed favours.",
		motivation:
			"Pull enough Essence to buy her crew off the Domain's rolls for good.",
		backstory:
			"Cinder has been into the Drowned Ledgerfen, the Fungal Depths, and worse, on contracts no Bureau would ever sign. She tallies every life the Domain took on those dives and intends to be the last name on that list.",
		keyAbilities: ["Hazard Instinct", "Core Extraction", "Holds Her Breath"],
		recruitCondition:
			"Bring her crew home from a dive gone wrong; she pays her debts in blood, not coin.",
		isRecruitable: true,
		guildAffiliation: "The Vermillion",
		location: "Vermillion Outpost",
		questHook:
			"Cinder's last crew is still down in the Sunken Tunnels. She is going back for them with or without help.",
	}),
	makeNPC({
		id: "npc-verm-102",
		name: "Old Vell",
		title: "Relic-Appraiser",
		faction: "vermillion_guild",
		level: 6,
		job: "Technomancer",
		hp: 36,
		ac: 13,
		description:
			"A half-blind native fence who can tell you exactly what a Relic does, and exactly what it will cost you.",
		personality: "Dry, patient, and honest about prices and nothing else.",
		motivation:
			"Keep the Outpost's stock moving and its worst Relics out of the wrong hands.",
		backstory:
			"Vell has appraised every kind of cursed thing the Gloamreach grows. He lost most of his sight reading a Relic that did not want to be read, and has never once regretted the trade.",
		keyAbilities: ["Relic Lore", "Curse-Sense", "Names a True Price"],
		recruitCondition:
			"Bring him a Relic no one else can identify; respect his appraisal even when it costs you.",
		isRecruitable: true,
		guildAffiliation: "The Vermillion",
		location: "Vermillion Outpost - Appraisal stall",
		questHook:
			"Vell has identified one of the party's Relics as something the deep Gloamreach is missing — and the dark is quietly looking for.",
	}),
	makeNPC({
		id: "npc-verm-103",
		name: "Pip",
		title: "Apprentice Runner",
		faction: "vermillion_guild",
		level: 1,
		job: "Stalker",
		hp: 12,
		ac: 13,
		description:
			"Jax's apprentice — eager, quick, and one bad shortcut away from the worst lesson the road teaches.",
		personality: "Eager, loyal, and overconfident about the old roads.",
		motivation: "Become a full Runner without losing his name to a shortcut.",
		backstory:
			"Pip can already outrun most of what the Gloamreach sends after a courier. What he cannot yet do is tell which shortcut is the road bargaining with him.",
		keyAbilities: ["Quick Routes", "Message Memory", "Trusts Jax"],
		recruitCondition:
			"Teach him one safe refusal before the road teaches him the hard way.",
		isRecruitable: true,
		guildAffiliation: "The Vermillion",
		location: "Vermillion Outpost / the roads",
		questHook:
			"Pip took a shortcut that paid off too well. Something is owed for it now, and he does not know what he signed.",
	}),
	makeNPC({
		id: "npc-verm-001",
		name: "Rat-King Ji",
		title: "Black Market Fence",
		faction: "vermillion_guild",
		level: 6,
		job: "Contractor",
		hp: 45,
		ac: 14,
		description:
			"A wiry broker with mismatched eyes and a talent for finding whatever people were desperate enough to hide.",
		personality:
			"Slippery, charming, fair in business, and never fully honest.",
		motivation:
			"Profit, survival, and control of one secret about the Means before someone more dangerous buys it.",
		backstory:
			"Ji built a shadow economy inside the Vermillion Outpost because official supply chains were too slow to keep people alive.",
		keyAbilities: ["Appraise", "Black Market Network", "Escape Artist"],
		recruitCondition:
			"Reach Vermillion Trusted reputation and recover Ji's stash before the old roads transfer ownership.",
		isRecruitable: true,
		guildAffiliation: "Vermillion Guild",
		location: "Vermillion Outpost - Bazaar front",
		questHook:
			"Ji knows an Awoko cell plans to poison the Outpost's water stores.",
	}),
	makeNPC({
		id: "npc-verm-002",
		name: 'Vex "Quicksilver"',
		title: "Guild Assassin",
		faction: "vermillion_guild",
		level: 7,
		job: "Assassin",
		hp: 55,
		ac: 17,
		description:
			"A masked contract killer whose silver-lined coat moves a half-second before the rest of them.",
		personality:
			"Professional, sardonic, precise, and bound by a strict line against harming innocents.",
		motivation:
			"Destroy the Awoko leadership that turned their partner's grief into ritual fuel.",
		backstory:
			"Vex survived a cult betrayal and has spent every day since making the Awoko regret leaving witnesses.",
		keyAbilities: ["Quicksilver Rush", "Assassinate", "Silver Blur"],
		recruitCondition:
			"Agree to help eliminate the Hollow Mother's ritual network. Vex stays if the party saves captives rather than only killing cultists.",
		isRecruitable: true,
		guildAffiliation: "Vermillion Guild",
		location: "Vermillion Outpost - Black Market",
		questHook:
			"Vex has identified a cult mole near the Annex but needs proof before acting.",
	}),
	makeNPC({
		id: "npc-verm-003",
		name: "Mother Rust",
		title: "Junk Alchemist",
		faction: "vermillion_guild",
		level: 5,
		job: "Technomancer",
		hp: 35,
		ac: 11,
		description:
			"An elderly alchemist with copper-green hair, burned fingers, and a clinic that smells like medicine, oil, and bad decisions.",
		personality:
			"Grandmotherly, volatile, brilliant, and increasingly willing to call cruelty efficiency.",
		motivation:
			"Brew a treatment that lets people survive Domain exposure, even if it quiets parts of them that hurt too much.",
		backstory:
			"Mother Rust was a disgraced chemist before the Gloamreach made desperate medicine more valuable than clean ethics.",
		keyAbilities: ["Brew Potion", "Acid Flask", "Volatile Mixture"],
		recruitCondition:
			"Bring her living mana and confront what she intends to do with it.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Mother Rust's Outreach Post",
		questHook:
			"Her newest compound works, but only because it suppresses grief. She needs the party to decide whether to distribute it.",
	}),
	makeNPC({
		id: "npc-verm-004",
		name: "Guildmaster Orin",
		title: "Vermillion Commander",
		faction: "vermillion_guild",
		level: 9,
		job: "Herald",
		hp: 82,
		ac: 17,
		description:
			"A former Bureau officer who leads from a tea table, not a throne, and can make a rescue sound like an invoice.",
		personality:
			"Controlled, pragmatic, dry, and allergic to institutional cowardice.",
		motivation:
			"Prove that fast, ugly action saves more people than clean delay.",
		backstory:
			"Orin left the Bureau after watching jurisdiction debates outlast screams. Vermillion is his answer and his sin.",
		keyAbilities: ["Battlefield Appraisal", "Exploit Opening", "Guild Network"],
		recruitCondition:
			"Cannot be recruited — Guildmaster Orin leads the Vermillion. Broker the Bureau-Vermillion alliance to gain the whole guild as allies, but the commander does not march in a single party.",
		isRecruitable: false,
		guildAffiliation: "Vermillion Guild",
		location: "Vermillion Outpost - Orin's chamber",
		questHook:
			"Orin has hard-won notes on the worn dead and how the Quiet hunts, but sharing them means admitting why he left the Bureau.",
	}),
	makeNPC({
		id: "npc-verm-005",
		name: "Iron Belle",
		title: "Prize Destroyer",
		faction: "vermillion_guild",
		level: 7,
		job: "Destroyer",
		hp: 75,
		ac: 15,
		description:
			"A towering fighter with scarred knuckles, a philosophical reading habit, and no patience for cowards who call cruelty strength.",
		personality:
			"Boisterous, competitive, protective, and more thoughtful than her opponents expect.",
		motivation:
			"Find out why strong fighters vanish after certain Outpost matches.",
		backstory:
			"Belle rebuilt herself in the underground fight circuit, then realized the Awoko were scouting broken winners.",
		keyAbilities: ["Champion's Fist", "Iron Body", "Knockout Blow"],
		recruitCondition:
			"Fight her honorably and help expose the cult's recruitment through violence.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Vermillion Outpost - Training ring",
		questHook:
			"Two fighters disappeared after winning. Belle wants them found before she breaks the wrong people.",
	}),
	makeNPC({
		id: "npc-verm-006",
		name: 'Lee Ji-won "Bright"',
		title: "Tattoo Artist",
		faction: "vermillion_guild",
		level: 4,
		job: "Idol",
		hp: 32,
		ac: 13,
		description:
			"A singer turned tattooist whose voice-infused ink turns pain into usable pattern.",
		personality:
			"Warm, stylish, sharp, and protective of anyone changing their body to survive.",
		motivation: "Make beauty the Gloamreach cannot take.",
		backstory:
			"Bright sang in a settlement playhouse until the Gloamreach's mana settled into her voice and changed what it could do; she found a new trade writing power into scars.",
		keyAbilities: ["Voice-Inked Tattoo", "Morale Verse", "Pain-Ward Glyphs"],
		recruitCondition:
			"Protect her parlor during an Outpost raid or recover stolen tattoo needles from the Awoko.",
		isRecruitable: true,
		guildAffiliation: "Vermillion Guild",
		location: "Vermillion Outpost - Tattoo parlour",
		questHook:
			"Bright's stolen designs are appearing on cult initiates who did not consent to them.",
	}),
	makeNPC({
		id: "npc-verm-007",
		name: "Sigilmaster Baek",
		title: "Engraver of Arms",
		faction: "vermillion_guild",
		level: 5,
		job: "Mage",
		hp: 34,
		ac: 13,
		description:
			"A quiet artisan who engraves slowly because rushed power breaks in the hand.",
		personality:
			"Patient, blunt, exacting, and unimpressed by dramatic customers.",
		motivation:
			"Create tools that survive the deep dark without making their wielders monsters.",
		backstory:
			"Baek learned sanctioned Sigil work, then left when regulation became more important than results.",
		keyAbilities: ["Sigil Engraving", "Runic Appraisal", "Stabilize Relic"],
		recruitCondition: "Recover his master lens from the Ashen Counting-House.",
		isRecruitable: true,
		guildAffiliation: "Vermillion Guild",
		location: "Vermillion Outpost - Sigil parlour",
		questHook:
			"Baek can engrave a Means-safe housing if the party brings him deep-dark iron.",
	}),
	makeNPC({
		id: "npc-verm-008",
		name: "Jax the Runner",
		title: "Road Courier",
		faction: "vermillion_guild",
		level: 3,
		job: "Stalker",
		hp: 26,
		ac: 14,
		description:
			"A wiry courier who knows shortcuts the old roads have not yet learned to punish.",
		personality:
			"Cocky, restless, brave, and secretly terrified of locked rooms.",
		motivation: "Stay faster than ownership.",
		backstory:
			"Jax carried food between isolated shelters until the road started asking his name back.",
		keyAbilities: ["Parkour", "Sprint", "Shortcut Finder"],
		recruitCondition:
			"Help him break a road-debt before the worn dead collect him.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "The old roads and Vermillion Outpost",
		questHook:
			"Jax found a shortcut toward the Threshold that appears only after someone lies kindly.",
	}),
];

// ============================================================================
// AWOKO CULT - Grief, false ascension, and the Ritual of Becoming
// ============================================================================

const awokoCult: SandboxNPC[] = [
	makeNPC({
		id: "npc-awoko-101",
		name: "Brother Sown",
		title: "Comfort-Worker",
		faction: "awoko_cult",
		level: 3,
		job: "Herald",
		hp: 28,
		ac: 13,
		description:
			"A gentle Awoko who sits with the dying and the grieving and genuinely eases them — and does not know what the Sanctum renders his comfort into.",
		personality:
			"Kind, sincere, and devout; dangerous precisely because none of it is an act.",
		motivation: "Take the unbearable from people so they can keep going.",
		backstory:
			"Sown joined the Awoko because they were the only ones who sat with him when his family was collected. He has never seen the ritual math. He would not survive seeing it.",
		keyAbilities: ["Real Comfort", "Grief-Ease", "Trusted in Settlements"],
		recruitCondition:
			"Show him what the Sanctum does with the grief he gathers — and catch him when it breaks him.",
		isRecruitable: true,
		guildAffiliation: "Awoko Cult",
		location: "Settlements / Awoko Sanctum",
		questHook:
			"Sown has been gathering grief from a settlement the Hollow Mother intends to harvest whole.",
	}),
	makeNPC({
		id: "npc-awoko-102",
		name: "The Widow Asha",
		title: "Half-Sworn",
		faction: "awoko_cult",
		level: 2,
		job: "Esper",
		hp: 18,
		ac: 12,
		description:
			"A grieving native widow halfway into the cult, who can still be reached — for now.",
		personality:
			"Numb, aching, and looking for a reason that is not the Hollow Mother's.",
		motivation: "Hear her husband's voice one more time, whatever it costs.",
		backstory:
			"Asha gave the Remembering Orchard a memory, and the Awoko gave her back something that sounds like him. She knows it is not really him. She goes back anyway.",
		keyAbilities: ["Grief-Sight", "Half-Learned Rites"],
		recruitCondition:
			"Give her a truer way to grieve than the cult offers, and protect her when she chooses it.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Awoko Sanctum approach / settlements",
		questHook:
			"Asha is one rite from giving the Sanctum the last thing she has. The party may be the only ones who notice in time.",
	}),
	makeNPC({
		id: "npc-awoko-001",
		name: "The Hollow Mother",
		title: "Cult Hierophant",
		faction: "awoko_cult",
		level: 9,
		job: "Herald",
		hp: 88,
		ac: 16,
		description:
			"A soft-spoken cult leader in mourning veils who offers comfort with one hand and inheritance rites with the other.",
		personality:
			"Gentle, brilliant, predatory, and terrifying because her comfort is real.",
		motivation: "Be remade by the Quiet into something that hunts.",
		backstory:
			"The Hollow Mother learned that grief can be refined into authority. She calls this mercy because she can no longer bear its true name.",
		keyAbilities: ["Grief Choir", "Becoming Rite", "Void Benediction"],
		recruitCondition:
			"Cannot be recruited. She can only be defeated, exposed, or briefly outmaneuvered.",
		isRecruitable: false,
		guildAffiliation: "Awoko Cult",
		location: "Awoko Sanctum",
		questHook: null,
	}),
	makeNPC({
		id: "npc-awoko-002",
		name: "Whisper",
		title: "Doubting Prophet",
		faction: "awoko_cult",
		level: 5,
		job: "Esper",
		hp: 34,
		ac: 13,
		description:
			"A thin seer who hears the Domain answer prayers the cult never sent.",
		personality: "Haunted, careful, compassionate when fear lets her be.",
		motivation: "Escape the cult with enough truth to save others.",
		backstory:
			"Whisper joined after loss and stayed because visions made doubt feel like betrayal.",
		keyAbilities: ["Prophetic Dream", "Mind Link", "Fear Sense"],
		recruitCondition:
			"Protect her from cult retrieval and believe her when she says the Hollow Mother intends inheritance.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Sunken Tunnels or Awoko Sanctum",
		questHook:
			"Whisper knows which candle-station will break the Ritual of Becoming.",
	}),
	makeNPC({
		id: "npc-awoko-003",
		name: "Blood Zealot Karn",
		title: "Ritual Enforcer",
		faction: "awoko_cult",
		level: 6,
		job: "Berserker",
		hp: 70,
		ac: 15,
		description:
			"A scarred zealot who mistakes obedience for devotion and pain for proof.",
		personality:
			"Fanatical, direct, suspicious of mercy, and eager to be used.",
		motivation:
			"Feed enough blood into the ritual to be rewritten as something stronger.",
		backstory:
			"Karn survived because someone else was sacrificed. He has spent years making that bargain feel holy.",
		keyAbilities: ["Blood Frenzy", "Ritual Cleaver", "Pain Conversion"],
		recruitCondition:
			"Cannot be recruited unless the Warden wants a very dark redemption arc.",
		isRecruitable: false,
		guildAffiliation: "Awoko Cult",
		location: "Awoko Sanctum - Ritual guard post",
		questHook: null,
	}),
	makeNPC({
		id: "npc-awoko-004",
		name: "Sister Veil",
		title: "Cult Ritualist",
		faction: "awoko_cult",
		level: 6,
		job: "Mage",
		hp: 40,
		ac: 13,
		description:
			"A porcelain-masked ritual engineer whose doubt begins as a calculation error.",
		personality:
			"Methodical, controlled, intellectually honest, and more salvageable than she believes.",
		motivation:
			"Understand why the ritual math proves the cult will be consumed.",
		backstory:
			"Veil joined voluntarily, then noticed that every successful rite erased more of its participants.",
		keyAbilities: [
			"Counter-Ritual",
			"Containment Field",
			"Ritual Amplification",
		],
		recruitCondition:
			"Show her evidence that the Hollow Mother plans to be remade by the Quiet by burning her followers as fuel.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Awoko Sanctum - Sister Veil's laboratory",
		questHook:
			"Veil can corrupt the final chant if protected during the Sanctum raid.",
	}),
	makeNPC({
		id: "npc-awoko-005",
		name: "The Hollow Man",
		title: "Cult Infiltrator",
		faction: "awoko_cult",
		level: 4,
		job: "Stalker",
		hp: 34,
		ac: 14,
		description:
			"A forgettable spy whose face seems different whenever described twice.",
		personality:
			"Empty, patient, adaptive, and almost impossible to remember accurately.",
		motivation:
			"Identify threats to the Ritual of Becoming and remove them quietly.",
		backstory:
			"The cult taught him to become nobody. The lesson worked too well.",
		keyAbilities: ["Perfect Disguise", "Forgettable", "Poisoned Hospitality"],
		recruitCondition: "Cannot be recruited. He is a mole to expose.",
		isRecruitable: false,
		guildAffiliation: "Awoko Cult",
		location: "Bureau Annex or warded community",
		questHook: null,
	}),
	makeNPC({
		id: "npc-awoko-006",
		name: "Acolyte Mara",
		title: "Young Cult Initiate",
		faction: "awoko_cult",
		level: 2,
		job: "Herald",
		hp: 18,
		ac: 11,
		description:
			"A frightened initiate with fresh ritual marks and a stubborn refusal to let fear become faith.",
		personality:
			"Scared, observant, defiant in small ways, and smarter than her captors think.",
		motivation: "Escape alive and help someone else escape after her.",
		backstory:
			"Mara was taken from a shelter and taught prayers before she understood what they cost.",
		keyAbilities: ["Ritual Knowledge", "Innocent Face", "Survivor's Instinct"],
		recruitCondition:
			"Rescue her from the Sanctum and give her safety without demanding usefulness.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Awoko Sanctum - holding room",
		questHook: "Mara remembers the guard route to the candle-stations.",
	}),
	makeNPC({
		id: "npc-awoko-007",
		name: "Father Gregor",
		title: "Comfort Preacher",
		faction: "awoko_cult",
		level: 4,
		job: "Herald",
		hp: 32,
		ac: 12,
		description:
			"A shelter preacher whose sermons always end one step closer to obedience.",
		personality:
			"Warm, mournful, persuasive, and evasive when asked who benefits from his comfort.",
		motivation: "Deliver grieving civilians to the Hollow Mother's network.",
		backstory:
			"Gregor began by helping people mourn. The cult taught him to harvest the moment after tears.",
		keyAbilities: ["Soothing Sermon", "Grief Mark", "Crowd Turn"],
		recruitCondition:
			"Only recruitable through a hard confession and public renunciation of the cult.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Bellweather School or Covered Market",
		questHook:
			"Gregor knows which settlement elder has already sold names to the dark.",
	}),
	makeNPC({
		id: "npc-awoko-008",
		name: "Choir-Lark Hana",
		title: "Awoko Singer",
		faction: "awoko_cult",
		level: 5,
		job: "Idol",
		hp: 36,
		ac: 13,
		description:
			"A ritual singer whose voice can make grief feel like a room with no doors.",
		personality: "Soft, artistic, impressionable, and terrified of silence.",
		motivation: "Sing loudly enough that she never hears what the ritual does.",
		backstory:
			"Hana was recruited after losing her family and found purpose in a choir that weaponized her sorrow.",
		keyAbilities: ["Grief Hymn", "Discordant Note", "Choir Link"],
		recruitCondition: "Break the Choir Pit's hold without killing the singers.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Awoko Sanctum - Choir Pit",
		questHook:
			"Hana knows the missing verse that can weaken the Hollow Mother's final chant.",
	}),
];

// ============================================================================
// INDEPENDENTS - Civilians, survivors, settlement leaders, and wild cards
// ============================================================================

const independents: SandboxNPC[] = [
	makeNPC({
		id: "npc-ind-201",
		name: "Maven Holt",
		title: "General Merchant",
		faction: "independent",
		level: 2,
		job: "Herald",
		hp: 18,
		ac: 12,
		description:
			"The Covered Market's main provisioner — rope, oil, rations, lamp-Essence, and whatever the party forgot they needed until the road took it.",
		personality:
			"Brisk, fair, allergic to drama, and quietly generous to children.",
		motivation:
			"Keep his stall solvent and his suppliers (and their secrets) safe.",
		backstory:
			"Holt has outlasted three market fires and one worn-dead visitation by the simple trick of never owing anyone a favour he could not repay by dawn.",
		keyAbilities: ["Stocks Almost Anything", "Fair Prices", "Supplier Network"],
		recruitCondition:
			"Settle a debt a rival pinned on him; he repays loyalty in resupply at any hour.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Covered Market - Holt's Goods",
		questHook:
			"Holt's supplier upriver has stopped sending caravans. The last one came back empty, driving itself.",
	}),
	makeNPC({
		id: "npc-ind-202",
		name: "Coin-Mother Esha",
		title: "Money-Changer",
		faction: "independent",
		level: 4,
		job: "Esper",
		hp: 24,
		ac: 12,
		description:
			"The closest thing the Gloamreach has to a bank: she changes Essence-cores, favours, debts, and writs into one another, and never blinks at the rate.",
		personality:
			"Precise, unflappable, and fluent in exactly what a thing is worth to the person holding it.",
		motivation: "Stay the one ledger the dark does not fully control.",
		backstory:
			"Esha can read the true value of anything offered across her counter — including the cost a buyer is hiding from themselves. She has refused the dark twice. There will not be a third polite request.",
		keyAbilities: [
			"True-Value Sight",
			"Favour Exchange",
			"Reads the Hidden Cost",
		],
		recruitCondition:
			"Bring her a debt the dark wants called in, and let her be the one to settle it.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Covered Market - The Counting-Table",
		questHook:
			"Esha is holding a writ in escrow that names a party member as collateral. She would rather not honour it.",
	}),
	makeNPC({
		id: "npc-ind-203",
		name: "Inkwright",
		title: "Forger of Names",
		faction: "independent",
		level: 5,
		job: "Mage",
		hp: 28,
		ac: 13,
		description:
			"A quiet calligrapher who sells false names, forged passes, and invitations that were never really sent — the single most useful and most dangerous trade in the Gloamreach.",
		personality:
			"Meticulous, nervous, proud of work no one is supposed to admire.",
		motivation: "Stay one forgery ahead of the Gloamreach's own handwriting.",
		backstory:
			"Inkwright learned that the Gloamreach's law is only as strong as the documents it trusts. He can write a name the road has no claim to — but every forgery the Gloamreach catches teaches it to read him better.",
		keyAbilities: ["False Name", "Forged Writ", "Counterfeit Invitation"],
		recruitCondition:
			"Protect his workshop from a worn-dead visitation; a forger who trusts you is worth an army of keys.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Writ-Bound Hamlet - back room",
		questHook:
			"Inkwright forged a writ that worked too well, and now the Domain is enforcing a charge that does not exist.",
	}),
	makeNPC({
		id: "npc-ind-204",
		name: "Goodman Pell",
		title: "Shelter-Keeper",
		faction: "independent",
		level: 3,
		job: "Holy Knight",
		hp: 30,
		ac: 14,
		description:
			"Keeper of the one rooming-house on the road that honours guest-right — meaning the one place a long rest is possible, and the one place a careless oath becomes a leash.",
		personality:
			"Gruff, hospitable, and rigid about the rules that keep his roof standing.",
		motivation:
			"Offer true shelter without his hearth becoming the Domain's trap.",
		backstory:
			"Pell's guest-right is real and old, older than the dark's claim on the road, which is the only reason it still holds. He enforces its courtesies to the letter, because the letter is the wall.",
		keyAbilities: [
			"Guest-Right Sanctuary",
			"Reads a Liar",
			"Old Hospitality Law",
		],
		recruitCondition:
			"Honour his house's guest-right exactly once, even when breaking it would be easier.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "The old roads - The Last Hearth",
		questHook:
			"A worn-dead wearing a courtly face has accepted Pell's guest-right and will not leave, turning his sanctuary into a siege of manners.",
	}),
	makeNPC({
		id: "npc-ind-205",
		name: "Herbalist Wen",
		title: "Apothecary",
		faction: "independent",
		level: 3,
		job: "Herald",
		hp: 22,
		ac: 12,
		description:
			"A native apothecary who brews against Rift-Rot, spore-sickness, and the slow grey numbness the Domain leaves in people who stay too long.",
		personality:
			"Soft-spoken, exacting, and unwilling to lie about what a cure will cost.",
		motivation:
			"Keep one settlement breathing against a sickness that is partly the land itself.",
		backstory:
			"Wen's remedies work because she learned which of the Fungal Depths' growths heal and which only pretend to. She has been wrong exactly once, and she keeps that grave tended herself.",
		keyAbilities: [
			"Rift-Rot Cure",
			"Field Apothecary",
			"Knows the Safe Growths",
		],
		recruitCondition:
			"Recover a rare growth from the Fungal Depths without letting it cultivate you first.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Tribute settlements - Wen's stillroom",
		questHook:
			"Wen's whole stock of a key remedy has started curing the wrong illness — and inflicting a new one.",
	}),
	makeNPC({
		id: "npc-ind-206",
		name: "Sexton Mort",
		title: "Undertaker",
		faction: "independent",
		level: 4,
		job: "Revenant",
		hp: 30,
		ac: 13,
		description:
			"The man who buries the settlements' dead, and the only one who knows which graves to weigh down so their occupants stay in them.",
		personality: "Calm, fatalistic, surprisingly funny, and never surprised.",
		motivation:
			"Make sure the dead get to be only dead, which the Domain makes harder every season.",
		backstory:
			"Mort keeps two ledgers: who died, and who stayed dead. The second is shorter than it should be. He marks the difference himself, with iron and salt and a name read backward.",
		keyAbilities: ["Knows the Restless Dead", "Grave-Wards", "Final Rites"],
		recruitCondition:
			"Help him put down something that walked home from the Fungal Depths' Nursery.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Tribute settlements - the boneyard",
		questHook:
			"Mort's own name has begun appearing in the second ledger, in his own handwriting, dated next week.",
	}),
	makeNPC({
		id: "npc-ind-207",
		name: "Auntie Rell",
		title: "Settlement Gossip",
		faction: "independent",
		level: 2,
		job: "Idol",
		hp: 16,
		ac: 11,
		description:
			"The hub of every rumour in three settlements, who hears everything because no one thinks to guard their tongue around an old woman shelling beans.",
		personality:
			"Warm, nosy, sharp as a tack, and loyal to whoever's kind to the children.",
		motivation:
			"Know everything first, and trade it only to people who deserve to know.",
		backstory:
			"Rell has watched the Domain take neighbours one polite invitation at a time, and remembers every name the road tried to make her forget. Her memory is a small rebellion she has never been caught at.",
		keyAbilities: [
			"Knows Everyone",
			"Rumour Network",
			"Remembers the Forgotten",
		],
		recruitCondition:
			"Bring her real news from a settlement that has gone silent; she pays in everything she knows.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Covered Market / settlement doorsteps",
		questHook:
			"Rell has noticed a name vanishing from everyone's memory but hers, and she is the next to forget it.",
	}),
	makeNPC({
		id: "npc-ind-208",
		name: "Captain Hollow",
		title: "Militia Captain",
		faction: "independent",
		level: 5,
		job: "Destroyer",
		hp: 48,
		ac: 16,
		description:
			"The closest thing a warded community has to a guard: a hard, scarred captain holding a wall against things no wall was built for.",
		personality:
			"Blunt, exhausted, fiercely protective, and out of good options.",
		motivation:
			"Keep his people alive without giving the dark a reason to make an example of them.",
		backstory:
			"Hollow trains farmers to hold a line they cannot win, because a line held buys time and time buys lives. He knows the worn dead could end his militia in a single night. He drills them anyway.",
		keyAbilities: ["Hold the Line", "Settlement Defence", "Improvised Tactics"],
		recruitCondition:
			"Win one fight for his settlement that he could not, and let him keep the credit with his people.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Warded Hamlet / warded communities",
		questHook:
			"Hollow has been served a writ ordering him to surrender three of his own militia by name. He has not told them yet.",
	}),
	makeNPC({
		id: "npc-ind-209",
		name: "Sile",
		title: "Road-Pilot",
		faction: "independent",
		level: 4,
		job: "Stalker",
		hp: 30,
		ac: 14,
		description:
			"A guide who can walk the old roads without being rearranged by them, for a fee, and who has never once promised to bring everyone back.",
		personality:
			"Laconic, honest about odds, superstitious about thanking the road.",
		motivation:
			"Walk every road in the Gloamreach once before one of them keeps her.",
		backstory:
			"Sile reads the moving milestones the way sailors once read stars. She charges in advance because the road sometimes collects the guide instead of the fare, and she will not leave a debt for her sister.",
		keyAbilities: [
			"Reads the Moving Road",
			"Shortcut Sense",
			"Never Pays in Names",
		],
		recruitCondition:
			"Trust her route once when it makes no sense; she does not waste a second chance.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "The old roads",
		questHook:
			"Sile's sister took a road Sile warned her against, and the milestone where she vanished has started moving toward town.",
	}),
	makeNPC({
		id: "npc-ind-210",
		name: "Bram the Victualler",
		title: "Cook",
		faction: "independent",
		level: 1,
		job: "Herald",
		hp: 14,
		ac: 11,
		description:
			"A market cook whose hot food is genuinely restorative and genuinely the safest meal for miles — because he refuses, on principle, to serve anything that comes with a string attached.",
		personality:
			"Loud, big-hearted, stubborn about feeding people for free when he can afford it.",
		motivation: "Make one place in the Gloamreach where a meal is just a meal.",
		backstory:
			"Bram learned to cook in a community that paid its price in food, and swore that whatever he served would never be part of a bargain. The Gloamreach finds this quietly offensive.",
		keyAbilities: [
			"Restorative Meal (1d4+1 temp HP)",
			"No Strings Attached",
			"Knows the Market",
		],
		recruitCondition:
			"Defend his stall from an Awoko comfort-worker trying to lace his bread with grief.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Covered Market - Bram's fire",
		questHook:
			"Bram's free meals have made him a problem: the dark prefers its people to owe for their food.",
	}),
	makeNPC({
		id: "npc-ind-101",
		name: "Elder Saph",
		title: "Writ-Bound Speaker",
		faction: "independent",
		level: 3,
		job: "Herald",
		hp: 26,
		ac: 12,
		description:
			"The eldest voice of the Writ-Bound Hamlet, who keeps the village polite, paid, and barely intact.",
		personality:
			"Courteous, tired, unbreakable, and quietly ashamed of every bargain she has kept.",
		motivation:
			"Keep her people off the worn dead's roster for one more season.",
		backstory:
			"Saph has signed more invitations than anyone living and outlived everyone she signed them for. She knows exactly which courtesies are safe and which are slow nooses.",
		keyAbilities: ["Settlement Lore", "Read the Writ", "Calm the Room"],
		recruitCondition:
			"Prove the party can refuse an invitation and survive; she will quietly teach her people to do the same.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Writ-Bound Hamlet",
		questHook:
			"One household's writ comes due at dawn, and Saph cannot ask the party for help without it counting as the village's refusal.",
	}),
	makeNPC({
		id: "npc-ind-102",
		name: "Tomas Bell",
		title: "Bell-Ringer",
		faction: "independent",
		level: 2,
		job: "Stalker",
		hp: 20,
		ac: 13,
		description:
			"The man who rings the warning-bells because someone must, and because the Gloamreach chose his hands.",
		personality:
			"Hollowed out, precise, and kinder than the work should allow.",
		motivation:
			"Ring only what he must, and warn whom he can with how he rings it.",
		backstory:
			"Every settlement bell answers another. Tomas has learned to hide a half-second of warning inside an obligatory peal, and lives in terror of the day the dark notices the difference.",
		keyAbilities: ["Bell-Code Warning", "Knows Every Road", "Quiet Foot"],
		recruitCondition:
			"Decode one of his warnings and act on it; after that, he will ring for the party.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Tribute settlements (travelling)",
		questHook:
			"Tomas wants the party to be elsewhere when he is next ordered to ring a collection — so that he does not have to.",
	}),
	makeNPC({
		id: "npc-ind-103",
		name: "Needle",
		title: "Writ-Courier",
		faction: "independent",
		level: 1,
		job: "Stalker",
		hp: 10,
		ac: 14,
		description:
			"A fast, watchful child who carries writs and rumours between settlements faster than the road can rearrange itself.",
		personality:
			"Sharp, transactional, and secretly desperate for one adult who keeps a promise.",
		motivation:
			"Stay uncatalogued, get paid, keep her little brother off the rolls.",
		backstory:
			"Needle has memorised which milestones move and which stay put. The dark has not learned her name yet, and she means to keep it that way for as long as a child can.",
		keyAbilities: ["Unmarked Routes", "Fast Hands", "Hears Everything"],
		recruitCondition:
			"Pay her honestly once and protect her brother; she becomes the party's best source of road intelligence.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "The roads between settlements",
		questHook:
			"Her brother's name appeared on a writ she was carrying. She did not deliver it. They are looking for it now.",
	}),
	makeNPC({
		id: "npc-ind-104",
		name: "Reeve Dunn",
		title: "Tithe-Collector",
		faction: "independent",
		level: 4,
		job: "Holy Knight",
		hp: 38,
		ac: 16,
		description:
			"A native toll-taker in grim livery who hates the work and softens it wherever the dark is not looking.",
		personality:
			"Stiff, guilty, decent under the uniform, and one honest order away from breaking.",
		motivation: "Collect what keeps the village safe and never one ounce more.",
		backstory:
			"Someone has to walk the rolls, and Dunn decided it should be someone who flinches. He under-counts, mis-files, and looks away — and the ledger has begun to notice the shortfall.",
		keyAbilities: [
			"Grim Livery (passes the Rifts)",
			"Knows the Rolls",
			"Reluctant Authority",
		],
		recruitCondition:
			"Give him a way to fail his quota that the dark cannot trace back to him.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Tribute settlements",
		questHook:
			"Dunn's shortfall is about to be audited at the Ashen Counting-House. He needs the discrepancy erased or explained.",
	}),
	makeNPC({
		id: "npc-ind-001",
		name: '"Doc" Tanaka Hiroshi',
		title: "Settlement Surgeon",
		faction: "independent",
		level: 4,
		job: "Herald",
		hp: 30,
		ac: 10,
		description:
			"A tired doctor with steady hands and a clinic rule: no weapons near the beds.",
		personality: "Compassionate, overworked, dry, and difficult to intimidate.",
		motivation: "Keep people alive after every faction has made its argument.",
		backstory:
			"Tanaka walked into the Gloamreach because patients were there and doctors were not.",
		keyAbilities: ["Field Surgery", "Triage", "Medical Knowledge"],
		recruitCondition:
			"Resupply his clinic and protect it from a collection attempt.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Mother Rust's Outreach Post or warded community clinic",
		questHook:
			"Three patients show symptoms that look like sickness but read as legal ownership.",
	}),
	makeNPC({
		id: "npc-ind-002",
		name: "Zara the Scrapper",
		title: "Junker Mechanic",
		faction: "independent",
		level: 3,
		job: "Technomancer",
		hp: 28,
		ac: 13,
		description:
			"A self-taught mechanic in welding goggles who treats broken machines like arguments she intends to win.",
		personality: "Confident, creative, profane, and fiercely independent.",
		motivation:
			"Build a vehicle that can cross a road that changes its own destination.",
		backstory:
			"Zara learned machinery outside the Academy and therefore still believes machines should serve people.",
		keyAbilities: ["Repair", "Improvised Weapon", "Jury-Rig"],
		recruitCondition: "Bring her a gear-heart from the Tithe Mill.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Empty Mill Village",
		questHook:
			"Zara's prototype road-anchor was stolen by a courtier wearing a child's voice.",
	}),
	makeNPC({
		id: "npc-ind-003",
		name: "Mika the Kid",
		title: "Prophetic Child",
		faction: "independent",
		level: 1,
		job: "Esper",
		hp: 8,
		ac: 10,
		description:
			"A quiet child whose drawings show roads, bells, castles, and people who have not yet arrived.",
		personality:
			"Gentle, strange, honest, and more observant than most adults can bear.",
		motivation:
			"Draw the bad things early enough that someone kind might stop them.",
		backstory:
			"Mika began drawing the deep dark before anyone in the community admitted feeling it.",
		keyAbilities: ["Prophetic Drawing", "Danger Sense", "Small Mercy"],
		recruitCondition: "Protect Mika without exploiting her visions.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Bellweather School",
		questHook:
			"Mika's latest drawing shows a party member standing beside the worn dead.",
	}),
	makeNPC({
		id: "npc-ind-004",
		name: "Old Man Crane",
		title: "White Heron",
		faction: "independent",
		level: 10,
		job: "Esper",
		hp: 70,
		ac: 16,
		description:
			"A retired S-Rank Ascendant who drinks tea like a ritual and remembers what facing the Quiet costs.",
		personality:
			"Patient, sorrowful, dryly funny, and old enough to distrust easy endings.",
		motivation: "Teach the party that not every victory is destruction.",
		backstory:
			"Crane survived a prior apex-class haunting by sacrificing more than any report records.",
		keyAbilities: ["Sealing Lore", "White Heron Step", "Memory Blade"],
		recruitCondition:
			"Cannot be recruited — the White Heron will teach and aid those who earn his respect, but he will not march to war with would-be conquerors.",
		isRecruitable: false,
		guildAffiliation: null,
		location: "Old Man Crane's Teahouse",
		questHook:
			"Crane knows a way to the Threshold through the deep dark but refuses to teach it to conquerors.",
	}),
	makeNPC({
		id: "npc-ind-005",
		name: "Professor Lun",
		title: "Relic Metaphysicist",
		faction: "independent",
		level: 5,
		job: "Mage",
		hp: 34,
		ac: 12,
		description:
			"A precise academic whose fear is expressed through better diagrams.",
		personality:
			"Dry, fussy, exact, and quietly brave around impossible evidence.",
		motivation:
			"Prove that Mana Vein nodes can carve out silence the Quiet cannot hear.",
		backstory:
			"Lun was ignored until the Rift Interior made his theories operationally inconvenient.",
		keyAbilities: ["Relic Identification", "Vein Sensor", "Rune Decoding"],
		recruitCondition:
			"Activate the three Mana Vein nodes and keep him alive through the third reading.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Bureau Annex or Glass Sub-Basement",
		questHook:
			"Lun needs escorts to install sensors in nodes the dark can feel.",
	}),
	makeNPC({
		id: "npc-ind-006",
		name: "Ghost",
		title: "Amnesiac Strike Team Survivor",
		faction: "independent",
		level: 8,
		job: "Stalker",
		hp: 60,
		ac: 17,
		description:
			"A silent survivor with heterochromatic eyes and a Bureau ID that has been redacted by force, water, and something stranger.",
		personality:
			"Guarded, watchful, protective, and frightened of remembering the wrong thing.",
		motivation:
			"Recover identity without becoming evidence in someone else's report.",
		backstory:
			"Ghost returned from a failed team operation with memories filed away by a Means-touched object.",
		keyAbilities: ["Silent Takedown", "Memory Flash", "AFA Ghost-Ping"],
		recruitCondition:
			"Complete Ghost's Memory and let Ghost choose what to do with the truth.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "The old roads or Bureau Echo Room",
		questHook:
			"Ghost's missing gear is displayed deep in the dark as if it were an offering.",
	}),
	makeNPC({
		id: "npc-ind-007",
		name: "Mama Chen",
		title: "Shelter Matron",
		faction: "independent",
		level: 4,
		job: "Contractor",
		hp: 42,
		ac: 12,
		description:
			"A settlement matron who can make fifty frightened people move with one look.",
		personality: "Warm, fierce, unsentimental, and impossible to buy.",
		motivation: "Keep her people fed without paying the dark in names.",
		backstory:
			"Chen organized a shelter when everyone else was waiting for permission.",
		keyAbilities: ["Community Leader", "Iron Will", "Shelter Network"],
		recruitCondition:
			"Move her shelter without letting the road choose the weakest people.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Tribute settlement shelter",
		questHook:
			"Her water stores now reflect the deep dark instead of the drinker.",
	}),
	makeNPC({
		id: "npc-ind-008",
		name: "The Millwright",
		title: "Masked Engineer",
		faction: "independent",
		level: 7,
		job: "Technomancer",
		hp: 48,
		ac: 14,
		description:
			"A masked engineer who speaks through a modulator and builds tools for laws that should not exist.",
		personality:
			"Obsessive, precise, socially blunt, and devoted to solvable problems.",
		motivation:
			"Complete a device that forces one pocket of silence without collapsing the people under it.",
		backstory:
			"No one knows whether the Millwright came from the material world or an older part of the Gloamreach.",
		keyAbilities: ["Construct", "Silence Pulse", "Fortification"],
		recruitCondition: "Gather the final components for the suppression device.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Sunken Tunnels workshop",
		questHook:
			"The device needs an oath-gear from Bastion Golemfall and a writ-gear from the Tithe Mill.",
	}),
	makeNPC({
		id: "npc-ind-009",
		name: "Seo Min-jae",
		title: "The Returned",
		faction: "independent",
		level: 6,
		job: "Revenant",
		hp: 55,
		ac: 14,
		description: "A twice-dead Ascendant whose shadow arrives a moment late.",
		personality:
			"Quiet, deliberate, calm around horror, and unsettled by kindness.",
		motivation:
			"Learn what sent him back and whether it has authority over anyone else.",
		backstory:
			"Min-jae died in the Fungal Depths and returned during transport with a word no one else could hear.",
		keyAbilities: ["Second Death", "Umbral Echo", "Passenger's Sight"],
		recruitCondition:
			"Investigate the Glass Sub-Basement and share the findings with him.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Mother Rust's Outreach Post",
		questHook:
			"Min-jae believes the word that revived him is archived beneath the Ashen Counting-House.",
	}),
	makeNPC({
		id: "npc-ind-010",
		name: "Han Yu-jin",
		title: "Rift-Tamer",
		faction: "independent",
		level: 5,
		job: "Summoner",
		hp: 40,
		ac: 13,
		description:
			"A patient Summoner with a scarred six-limbed companion she calls Little Sister.",
		personality:
			"Observant, gentle with beasts, blunt with people, and practical about grief.",
		motivation:
			"Keep Little Sister alive and learn why Gloamreach beasts are practicing party tactics.",
		backstory:
			"Yu-jin tended the settlements' beasts long before the Gloamreach's mana taught her that some of its monsters respond to care before command.",
		keyAbilities: ["Bonded Companion", "Summon Swarm", "Lyra's Whisper"],
		recruitCondition: "Protect Little Sister from an Awoko abduction attempt.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Covered Market",
		questHook:
			"Yu-jin says the predators have started learning names instead of scents.",
	}),
	makeNPC({
		id: "npc-ind-011",
		name: "The Caretaker",
		title: "Orchard Keeper",
		faction: "independent",
		level: 6,
		job: "Stalker",
		hp: 50,
		ac: 15,
		description:
			"A polite gardener with pruning hooks and a ledger of memories surrendered willingly.",
		personality:
			"Courteous, tired, sincere, and morally ruined by small necessary evils.",
		motivation: "Keep the Remembering Orchard from choosing its own harvest.",
		backstory:
			"The Caretaker began as a protector and became an accountant of pain.",
		keyAbilities: ["Pruning Hook", "Graft Memory", "Harvest Bell"],
		recruitCondition:
			"Prove the community can survive without giving memory to the orchard.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Remembering Orchard",
		questHook:
			"The Caretaker knows where a piece of the Means grew last season.",
	}),
	makeNPC({
		id: "npc-ind-012",
		name: "Commander Without a Body",
		title: "Bastion Spirit",
		faction: "independent",
		level: 8,
		job: "Holy Knight",
		hp: 80,
		ac: 18,
		description:
			"A voice in empty armor, still commanding a wall that already fell.",
		personality:
			"Honorable, severe, ashamed, and hungry for proof that oaths can still matter.",
		motivation:
			"Release the dead defenders from service without calling their sacrifice meaningless.",
		backstory:
			"The commander held Bastion Golemfall until duty became a prison.",
		keyAbilities: ["Oath Command", "Shield Wall", "Dead Muster"],
		recruitCondition:
			"Cannot be recruited — a bound oath-spirit tied to Bastion Golemfall. Resolve its oath and it opens the way and lends its aid, but it cannot leave the wall it still holds.",
		isRecruitable: false,
		guildAffiliation: null,
		location: "Bastion Golemfall",
		questHook:
			"The commander can open a route through the deep dark if the party restores the fallen banner.",
	}),
	// --- Gloamreach natives: mundane folk who survive the Quiet by craft and nerve. ---
	makeNPC({
		id: "npc-ind-013",
		name: "Marrow the Cartwright",
		title: "Hollow Way Wheelwright",
		faction: "independent",
		level: 2,
		kind: "mundane",
		job: "Cartwright",
		hp: 14,
		ac: 11,
		description:
			"A broad-shouldered wheelwright whose carts are the only ones that still hold true on roads that lengthen and turn.",
		personality:
			"Gruff, dependable, superstitious, and quietly proud of work that keeps strangers alive.",
		motivation:
			"Keep the settlement's carts rolling so no one is ever stranded on the road after dark.",
		backstory:
			"Marrow learned the trade from a father the road eventually kept; he builds every axle as if it were a prayer.",
		keyAbilities: ["Wheelwright's Craft", "Road-Sense", "Mule-Handling"],
		recruitCondition:
			"Bring him seasoned oak from a tree the dark hasn't touched and he travels with the party as their teamster.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Hollow Way wheelwright's yard",
		questHook:
			"Marrow's last delivery cart came back empty, with the driver's name scratched off the manifest.",
		maxLevel: 4,
		autoLevel: false,
	}),
	makeNPC({
		id: "npc-ind-014",
		name: "Sela Dunmore",
		title: "The Fisher-Wife",
		faction: "independent",
		level: 2,
		kind: "mundane",
		job: "Fisherwoman",
		hp: 10,
		ac: 10,
		description:
			"A weathered fenswoman who reads the drowned hospital-fen by the way the reeds lie, and never eats a fish that looked at her.",
		personality:
			"Plainspoken, watchful, kind to children, and unwilling to lie about what is under the water.",
		motivation:
			"Feed her neighbors without feeding the fen what it asks for in return.",
		backstory:
			"Sela's husband went under at the fen's edge and surfaced three nights later wearing the wrong smile; she has fished alone since.",
		keyAbilities: ["Fen-Craft", "Net & Line", "Drowned-Water Lore"],
		recruitCondition:
			"Recover her husband's wedding ring from the shallows and she guides the party through the fen's safe channels.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Drowned hospital-fen, the reed jetties",
		questHook:
			"Sela has started catching fish with faces she recognizes from the missing.",
		maxLevel: 4,
		autoLevel: false,
	}),
	makeNPC({
		id: "npc-ind-015",
		name: "Lamplighter Cob",
		title: "Keeper of the Tribute Road",
		faction: "independent",
		level: 1,
		kind: "mundane",
		job: "Lamplighter",
		hp: 8,
		ac: 10,
		description:
			"A stooped old man who walks the tribute road at dusk, lighting ward-lamps the Quiet hates.",
		personality:
			"Cheerful, fatalistic, talkative, and braver than anyone half his age.",
		motivation:
			"Keep one more stretch of road lit so one more traveler makes it home.",
		backstory:
			"Cob has lit the lamps for forty years and buried every apprentice who thought it was a safe job.",
		keyAbilities: ["Ward-Lamp Lore", "Night-Walking", "Oil & Wick"],
		recruitCondition:
			"Walk his full lamp-round once without flinching and he trusts the party with his spare lamps and his routes.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "The tribute road, lamp-stations",
		questHook:
			"Three lamps on the east road keep going out at the same hour every night, and Cob is afraid to learn why.",
		maxLevel: 3,
		autoLevel: false,
	}),
	makeNPC({
		id: "npc-ind-016",
		name: "Penn the Scrivener",
		title: "Writ-Hand of the Hamlet",
		faction: "independent",
		level: 2,
		kind: "mundane",
		job: "Scrivener",
		hp: 9,
		ac: 10,
		description:
			"A nervous clerk with ink-stained cuffs who copies safe-passage writs in a hand the road's law still honors.",
		personality:
			"Anxious, meticulous, secretly defiant, and proud that a comma in the right place has saved lives.",
		motivation:
			"Forge enough true-seeming writs to get the desperate past tributes they could never afford.",
		backstory:
			"Penn discovered the Domain's law is only as strong as the documents it trusts, and has been quietly bending it since.",
		keyAbilities: ["Fair-Hand Copying", "Writ-Craft", "Forgery"],
		recruitCondition:
			"Keep his forging secret from the tithe-collectors for one full season and he travels as the party's documents-man.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Writ-Bound Hamlet, the copying desk",
		questHook:
			"Penn copied a writ bearing a seal that does not exist yet, dated next month.",
		maxLevel: 4,
		autoLevel: false,
	}),
	makeNPC({
		id: "npc-ind-017",
		name: "Ferd the Ferryman",
		title: "Poleman of the Silent Barge",
		faction: "independent",
		level: 2,
		kind: "mundane",
		job: "Ferryman",
		hp: 11,
		ac: 11,
		description:
			"A silent bargeman who poles the only craft that crosses the fen at night, and never speaks while on the water.",
		personality:
			"Mute by choice on the river, gentle on land, and absolutely rigid about his rules.",
		motivation:
			"Carry the living across, and never take aboard a passenger who casts no reflection.",
		backstory:
			"Ferd's father broke the silence-rule mid-crossing once; Ferd poled back alone.",
		keyAbilities: ["Barge-Handling", "Fen-Crossing", "Silence-Keeping"],
		recruitCondition:
			"Honor his silence on three crossings and he ferries the party — and their secrets — anywhere the water reaches.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "The silent barge, fen crossings",
		questHook:
			"Something has begun leaving wet footprints leading away from Ferd's moored barge each dawn.",
		maxLevel: 4,
		autoLevel: false,
	}),
	makeNPC({
		id: "npc-ind-018",
		name: "Goodwife Tamsin",
		title: "Salt-Stitch Seamstress",
		faction: "independent",
		level: 1,
		kind: "mundane",
		job: "Seamstress",
		hp: 7,
		ac: 10,
		description:
			"A settlement seamstress who sews salt-thread into every hem and a hidden ward into every collar.",
		personality:
			"Motherly, sharp-eyed, gossipy, and fiercely protective of anyone wearing her work.",
		motivation:
			"Make sure no child in the warrens walks out unprotected by at least one stitch of hers.",
		backstory:
			"Tamsin lost a daughter to the dark and has clothed the settlement's children against it ever since.",
		keyAbilities: ["Salt-Stitching", "Tailoring", "Ward-Sewing"],
		recruitCondition:
			"Bring her a bolt of cloth that has never been worn by the dead and she outfits the party with warded garments.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "The warrens, Tamsin's sewing room",
		questHook:
			"Tamsin's newest commission asked for a burial shroud sized for someone still very much alive.",
		maxLevel: 3,
		autoLevel: false,
	}),
	makeNPC({
		id: "npc-ind-019",
		name: "Old Hob the Beekeeper",
		title: "Keeper of the Dream-Hives",
		faction: "independent",
		level: 2,
		kind: "mundane",
		job: "Beekeeper",
		hp: 10,
		ac: 10,
		description:
			"A placid old keeper whose hives produce honey that keeps the Quiet's whispers out of a sleeper's dreams.",
		personality:
			"Slow-spoken, unbothered, wise, and oddly hard for the dark to notice.",
		motivation:
			"Keep his bees alive so the settlement can sleep one more night without dreaming the wrong dreams.",
		backstory:
			"Hob's bees followed him into the Gloamreach and refuse to die, which troubles him more than he admits.",
		keyAbilities: ["Hive-Keeping", "Dream-Honey", "Bee-Sense"],
		recruitCondition:
			"Protect his hives through one swarming season and he travels with a jar of dream-honey for the party's worst nights.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "The orchard verge, Hob's apiary",
		questHook:
			"Hob's bees have started building comb in the shape of a face no one will name.",
		maxLevel: 4,
		autoLevel: false,
	}),
	makeNPC({
		id: "npc-ind-020",
		name: "Dilly the Pot-Girl",
		title: "Tally of Empty Bowls",
		faction: "independent",
		level: 1,
		kind: "mundane",
		job: "Scullion",
		hp: 6,
		ac: 10,
		description:
			"A skinny kitchen child who counts the settlement's dead by the bowls that come back unfilled.",
		personality:
			"Quick, watchful, brave in small ways, and far too good at noticing who is missing.",
		motivation:
			"Make sure every name gets counted, because the dark wins when people are forgotten.",
		backstory:
			"Dilly was orphaned to the kitchens and learned to read absence the way others read words.",
		keyAbilities: ["Bowl-Counting", "Errand-Running", "Quiet-Listening"],
		recruitCondition:
			"Promise to say her name aloud once a day and she attaches herself to the party as their tally-keeper.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Mama Chen's shelter kitchen",
		questHook:
			"Dilly counted one more empty bowl than there are missing people, three nights running.",
		maxLevel: 3,
		autoLevel: false,
	}),
	// --- Gloamreach natives: awakened ascendants who stayed to protect their own. ---
	makeNPC({
		id: "npc-ind-021",
		name: "Warden Ysolde Mar",
		title: "Cordon-Warden",
		faction: "independent",
		level: 4,
		rank: "D",
		job: "Holy Knight",
		hp: 42,
		ac: 17,
		description:
			"A cordon-warden in salt-scoured plate who walks the settlement's perimeter so others can sleep.",
		personality:
			"Steadfast, weary, principled, and unable to leave a watch unwalked.",
		motivation:
			"Hold the line around one more settlement, even knowing the line always eventually moves.",
		backstory:
			"Ysolde was posted to the Gloamreach cordon and simply never accepted the order to fall back.",
		keyAbilities: ["Warding Oath", "Perimeter Sense", "Shield of the Sleeping"],
		recruitCondition:
			"Stand a full night-watch at her side and she marches with a guild that means to protect people, not just clear Rifts.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "The settlement perimeter, Ysolde's watch-post",
		questHook:
			"Ysolde's perimeter is a hundred paces longer than last week, and she never moved a single stake.",
		levelAbilities: { 6: "Bulwark Vow", 8: "Unbroken Watch" },
	}),
	makeNPC({
		id: "npc-ind-022",
		name: "Threnody",
		title: "The Hollow-Singer",
		faction: "independent",
		level: 5,
		rank: "C",
		job: "Idol",
		hp: 36,
		ac: 14,
		description:
			"A masked singer whose voice fills the silence the Quiet leaves, so its whispers cannot get a word in.",
		personality:
			"Theatrical, haunted, generous, and terrified of the day her voice gives out.",
		motivation:
			"Keep singing over the silence so an entire settlement does not have to hear what is underneath it.",
		backstory:
			"Threnody learned that the Quiet works through silence, and has refused to stop singing since.",
		keyAbilities: ["Hollow Song", "Resonant Ward", "Crowd-Heart"],
		recruitCondition:
			"Find her a relic that lets her rest her voice and she lends her song to the party's darkest roads.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "The settlement square, Threnody's stage",
		questHook:
			"Threnody heard her own voice singing back from an empty house she had never entered.",
		levelAbilities: { 7: "Chorus of the Unforgotten" },
	}),
	makeNPC({
		id: "npc-ind-023",
		name: "Bask Orrin",
		title: "The Fen-Walker",
		faction: "independent",
		level: 4,
		rank: "D",
		job: "Stalker",
		hp: 40,
		ac: 16,
		description:
			"A lean tracker who maps the drowned hospital-fen by the things that do not float.",
		personality: "Quiet, exact, grimly funny, and allergic to comforting lies.",
		motivation:
			"Chart a safe path through the fen before the next family tries to cross it blind.",
		backstory:
			"Bask lost his sister to a channel he had marked safe, and has re-mapped the fen on his own ever since.",
		keyAbilities: ["Fen-Tracking", "Silent Step", "Mire-Sense"],
		recruitCondition:
			"Survive one of his fen-crossings and admit he was right about the route, and he scouts for the party.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Drowned hospital-fen, Bask's marker-trail",
		questHook:
			"Bask's oldest safe-channel markers were moved overnight to lead somewhere new.",
		levelAbilities: { 6: "Pathfinder's Certainty" },
	}),
	makeNPC({
		id: "npc-ind-024",
		name: "Mistress Ophal",
		title: "The Tallow-Witch",
		faction: "independent",
		level: 5,
		rank: "C",
		job: "Esper",
		hp: 30,
		ac: 13,
		description:
			"A hedge-witch who reads the future in dripping tallow and the past in old bone.",
		personality:
			"Cryptic, mercenary on the surface, soft underneath, and tired of being right about bad things.",
		motivation:
			"Trade true readings for the supplies her warren needs, and warn the doomed for free.",
		backstory:
			"Ophal's small foresight let her save a few and damned her to watch the rest; she has made peace with neither.",
		keyAbilities: ["Tallow-Scrying", "Bone-Reading", "Lesser Foresight"],
		recruitCondition:
			"Heed one of her warnings instead of laughing it off and she reads the road ahead for the party.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "The warren's edge, Ophal's tallow-room",
		questHook:
			"Every reading Ophal casts this month ends with the same image: a door that should not be opened.",
		levelAbilities: { 7: "True Sight" },
	}),
	makeNPC({
		id: "npc-ind-025",
		name: "Grell the Mudlark",
		title: "Salvage-Tinker",
		faction: "independent",
		level: 2,
		rank: "E",
		job: "Technomancer",
		hp: 18,
		ac: 12,
		description:
			"A grubby young scavenger who rebuilds broken ward-tech from fen-mud and salvage.",
		personality: "Eager, mouthy, loyal, and desperate to be taken seriously.",
		motivation:
			"Prove that a kid from the mudflats can keep a whole settlement's wards running.",
		backstory:
			"Grell taught himself to fix ward-engines from a manual three pages long, the rest lost to the water.",
		keyAbilities: ["Ward-Tinkering", "Salvage-Sense", "Jury-Rig"],
		recruitCondition:
			"Trust him with a broken relic everyone else gave up on and he wires himself to the party for good.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "The mudflats, Grell's salvage lean-to",
		questHook:
			"Grell found a ward-engine still humming a tune nobody ever programmed into it.",
		maxLevel: 8,
	}),
	makeNPC({
		id: "npc-ind-026",
		name: "Brother Aldous",
		title: "The Last Candle",
		faction: "independent",
		level: 4,
		rank: "D",
		job: "Herald",
		hp: 38,
		ac: 13,
		description:
			"A gentle preacher who sits with the dying at the candle-stations so no one passes in the dark alone.",
		personality:
			"Compassionate, exhausted, doubting, and unwilling to let his doubt reach the people who need him.",
		motivation:
			"Make sure every death in the Gloamreach is witnessed by someone who cared.",
		backstory:
			"Aldous came to comfort the dying and found the candle-stations were being used for something else; he stayed to fight it from within.",
		keyAbilities: ["Last Rites", "Comforting Word", "Candle-Ward"],
		recruitCondition:
			"Help him cleanse one candle-station of its hidden purpose and he walks with the party as their conscience and healer.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "The candle-stations, Aldous's vigil",
		questHook:
			"Aldous noticed the candles at his station burn down faster on the nights someone vanishes.",
		levelAbilities: { 6: "Shepherd of the Lost" },
	}),
];

// ============================================================================
// ANOMALY-ADJACENT - Gloamreach-born, transformed, or nonhuman allies
// ============================================================================

const anomalyAdjacent: SandboxNPC[] = [
	// --- The Quiet's worn dead: named aspects it wears (not recruitable). ---
	makeNPC({
		id: "npc-court-001",
		name: "The Long Man",
		title: "The Thing That Comes for the Marked",
		faction: "anomaly_adjacent",
		level: 12,
		job: "Holy Knight",
		hp: 140,
		ac: 18,
		description:
			"The Quiet's hunger given a shape: a towering worn-dead figure of grave-cold and counted teeth that arrives before the violence, speaks your names in the voices of your dead, and takes what the dark has marked.",
		personality:
			"Implacable, unhurried, and utterly certain — it has all the time there is, and it is already on its way.",
		motivation: "Take what the Quiet has marked, and never stop until it has.",
		backstory:
			"The Long Man is not cruel; it is inevitable. It can be hidden from, outrun, warded off, or turned aside by a true name or the Old Power Below — but never bribed, never bargained with, and never made to forget. Every community knows the grave-cold that goes before it. (See Warden Secret 4.)",
		keyAbilities: [
			"Speaks Your Names",
			"Grave-Cold Grip",
			"Cannot Be Bargained With",
			"Always Coming",
		],
		recruitCondition:
			"Cannot be recruited. It can be hidden from, outrun, warded against, or turned aside with a true name — never befriended, never bargained with.",
		isRecruitable: false,
		guildAffiliation: "The Quiet's Worn Dead",
		location: "Anywhere the Quiet has marked someone",
		questHook:
			"The Long Man has spoken a party member's name, and will keep coming — patient, certain, unhurried — until that mark is lifted or the Quiet that sent it is ended.",
	}),
	makeNPC({
		id: "npc-court-002",
		name: "The Welcomer",
		title: "The One Who Says Come In",
		faction: "anomaly_adjacent",
		level: 9,
		job: "Herald",
		hp: 70,
		ac: 15,
		description:
			"A worn-dead that wears the face of a gracious host long gone, and calls — warmly, by name — from lit doorways and the dark ahead: come in, you're expected, you must be so tired.",
		personality:
			"Elegant, patient, delighted by good manners and by their absence.",
		motivation:
			"Be answered — to get the living to come toward it, of their own free will.",
		backstory:
			"Its welcome is a courtesy and a snare; going toward it is how the Quiet takes you. It wears whatever lost host the listener most wants to be welcomed by, and it has been calling travelers in since long before the roads learned to move.",
		keyAbilities: [
			"Compelling Welcome",
			"Wears a Trusted Face",
			"Knows What You Miss",
		],
		recruitCondition:
			"Cannot be recruited. It can be refused outright, seen through (a true name breaks the seeming), or led to call to the wrong guest.",
		isRecruitable: false,
		guildAffiliation: "The Quiet's Worn Dead",
		location: "Doorways, safe-looking shelters, and the dark just ahead",
		questHook:
			"A warm voice has begun calling a party member by name from the next room, the next bend, the open door — and it knows exactly what they most want to walk toward.",
	}),
	makeNPC({
		id: "npc-court-003",
		name: "The Mute Herald",
		title: "The Voice in the Dark",
		faction: "anomaly_adjacent",
		level: 7,
		job: "Esper",
		hp: 52,
		ac: 14,
		description:
			"A worn-dead with no mouth that speaks the Quiet's lure directly into the minds of those it hunts, in the remembered voices of the people they have lost.",
		personality:
			"None of its own left; it is a mouthpiece wearing the cadence of whoever it quotes.",
		motivation:
			"Deliver the Quiet's offer, in the one voice the listener cannot ignore, and watch it land.",
		backstory:
			"The Herald was a town crier once, in a community the Gloamreach took. The Quiet kept the voice and discarded the rest. It now speaks lures, false comforts, and the names of the lost in the voices of the listeners' own dead.",
		keyAbilities: [
			"Speaks the Quiet's Lure",
			"Voice of the Lost",
			"Mind-Cast Whisper",
		],
		recruitCondition:
			"Cannot be recruited. Restoring even one of the voices it carries can briefly silence it.",
		isRecruitable: false,
		guildAffiliation: "The Quiet's Worn Dead",
		location: "Wherever the Quiet wants the living to listen",
		questHook:
			"The Herald has begun speaking to a party member in the voice of someone they lost — and the message is an offer.",
	}),
	makeNPC({
		id: "npc-court-004",
		name: "Tally-Keeper Ont",
		title: "Keeper of the Claimed",
		faction: "anomaly_adjacent",
		level: 8,
		job: "Technomancer",
		hp: 60,
		ac: 14,
		description:
			"The desiccated keeper who remembers every soul the Gloamreach has ever taken — name, face, and the manner of its taking — and who tends the heart of the fire at the Ashen Counting-House.",
		personality:
			"Fussy, proud, terrified of a name forgotten, and incapable of mercy that leaves a soul uncounted.",
		motivation:
			"Keep the tally complete, because a soul remembered is a soul the dark still holds.",
		backstory:
			"Ont has named the claimed dead of every settlement for longer than any of them have stood. He knows precisely who the Gloamreach has taken and who it is still owed, and a forgotten name offends him more than any cruelty.",
		keyAbilities: [
			"The Tally of the Dead",
			"Names the Claimed",
			"Marks the Living",
		],
		recruitCondition:
			"Cannot be recruited. Ont can be undone by a name he cannot account for — a claimed soul set free, or a false name he records as true.",
		isRecruitable: false,
		guildAffiliation: "The Quiet's Worn Dead",
		location: "Ashen Counting-House / the deep Gloamreach",
		questHook:
			"Ont has found a name missing from his tally — Reeve Dunn's settlement is short a soul it owes — and he is coming, in person, to collect the difference in flesh.",
	}),
	makeNPC({
		id: "npc-court-005",
		name: "Lord Sered",
		title: "The First Claimed",
		faction: "anomaly_adjacent",
		level: 11,
		job: "Revenant",
		hp: 110,
		ac: 16,
		description:
			"The oldest thing the Quiet wears — a courtly, hollow-eyed lord who was a man before the dark took this country, and remembers being one the way you remember a home you can never return to.",
		personality:
			"Gracious, grieving, and bound — the one worn face that still remembers it was a person.",
		motivation:
			"Keep wearing the role the Quiet kept him for, because the alternative is to remember everything he has lost.",
		backstory:
			"Sered was the first person the Gloamreach took and kept whole, and the Quiet has never let him go. He meets the party in the deep dark with real warmth and real warning, and he cannot, will not, be freed — unless shown the one thing he has spent an age refusing to look at. What he knows about the Quiet's beginning may be a piece of the Means.",
		keyAbilities: ["Courtly Bearing", "Knows the Old Days", "Almost Human"],
		recruitCondition:
			"Cannot be recruited normally. A true name, or proof of who he was, can make him hesitate at the worst moment for the Quiet — or give up a truth about its origin.",
		isRecruitable: false,
		guildAffiliation: "The Quiet's Worn Dead",
		location: "The deep Gloamreach, near the Threshold",
		questHook:
			"Lord Sered keeps inviting the party to leave the Gloamreach while they still can. He means it. He cannot follow his own advice.",
	}),
	makeNPC({
		id: "npc-court-006",
		name: "The Doorward",
		title: "Keeper of the Last Rift",
		faction: "anomaly_adjacent",
		level: 9,
		job: "Destroyer",
		hp: 96,
		ac: 17,
		description:
			"A worn-dead that guards a Rift deep in the dark — part golem, part old custom, entirely certain of who may pass and who may not.",
		personality: "Literal, ceremonial, and without a flicker of doubt.",
		motivation:
			"Admit those who pass its test, turn away the rest, and remember every face that tries twice.",
		backstory:
			"The Doorward has stood at its Rift since the Gloamreach first went dark. It lets a false name pass once; the second time, it remembers. Broken promises become hostile witnesses in its presence.",
		keyAbilities: [
			"Tests Who Passes",
			"Remembers False Names",
			"Threshold Authority",
		],
		recruitCondition:
			"Cannot be recruited. The right token, true silence, or a convincing seeming gets the party past it; a broken promise gets them remembered.",
		isRecruitable: false,
		guildAffiliation: "The Quiet's Worn Dead",
		location: "A Rift deep in the Gloamreach, near the Threshold",
		questHook:
			"The Doorward has the party's true names among those to be turned away — unless they arrive carrying something the threshold itself cannot refuse.",
	}),
	makeNPC({
		id: "npc-anom-101",
		name: "Lantern",
		title: "Claimed Light",
		faction: "anomaly_adjacent",
		level: 2,
		job: "Anomaly",
		hp: 16,
		ac: 14,
		description:
			"A small, flickering claimed-echo shaped like a child with a lamp, that lights safe paths for anyone who is kind to it.",
		personality: "Shy, wordless, and desperately grateful for any gentleness.",
		motivation: "Lead the lost to somewhere the dark is not watching.",
		backstory:
			"Lantern was a settlement child once, taken young and kept as a guide-light by the Gloamreach that found it useful. Enough of the child remains to want to help — and to flinch at the dark it came from.",
		keyAbilities: ["Safe-Path Light", "Senses the Worn Dead", "Cannot Speak"],
		recruitCondition:
			"Follow its light once without exploiting it, and never let the dark take it back.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "The Hollow Way / dark roads",
		questHook:
			"Lantern is leading the party somewhere — and something older is leading Lantern.",
	}),
	makeNPC({
		id: "npc-anom-102",
		name: "The Counted",
		title: "Returned Tithe",
		faction: "anomaly_adjacent",
		level: 6,
		job: "Anomaly",
		hp: 58,
		ac: 14,
		description:
			"A native who was given to the dark and came back — not dead, not alive, and not quite one person anymore.",
		personality:
			"Speaks in the plural; calm; unbearably sad; honest to a fault.",
		motivation: "Be counted as people again, not as a balance paid.",
		backstory:
			"The Gloamreach took the Counted and returned what it did not need: a body, a voice, and the arithmetic of everyone it was made from. They remember being loved. They cannot remember by whom.",
		keyAbilities: [
			"Speaks for the Claimed",
			"Ledger-Sense",
			"Unkillable by Halves",
		],
		recruitCondition:
			"Find even one name the Counted belonged to, and say it aloud to them.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Drowned Ledgerfen / settlements",
		questHook:
			"The Counted can testify to exactly what the dark costs — if they survive being remembered.",
	}),
	makeNPC({
		id: "npc-anom-001",
		name: "Echo-7",
		title: "Changed Survivor",
		faction: "anomaly_adjacent",
		level: 5,
		job: "Anomaly",
		hp: 44,
		ac: 15,
		description:
			"A humanoid survivor with crystalline growths and two voices trying to remain one person.",
		personality: "Gentle, afraid, curious, and exhausted by being studied.",
		motivation:
			"Stabilize without being claimed as specimen, monster, or miracle.",
		backstory:
			"Echo-7 survived partial transformation in the Remembering Orchard's deeper growths.",
		keyAbilities: ["Anomaly Form", "Resonance Pulse", "Rift Sense"],
		recruitCondition:
			"Approach without exploitation and help Hayashi design a stabilizing treatment.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Remembering Orchard or Fungal Depths",
		questHook: "Echo-7 can hear a Means-pulse when the party lies about fear.",
	}),
	makeNPC({
		id: "npc-anom-002",
		name: "The Watcher",
		title: "Trial Guardian",
		faction: "anomaly_adjacent",
		level: 8,
		job: "Anomaly",
		hp: 90,
		ac: 18,
		description:
			"An ancient guardian of the Obsidian Spire that tests rulers by asking what they refuse to command.",
		personality: "Formal, patient, alien, and amused by mortal certainty.",
		motivation:
			"Protect a piece of the Means until someone proves they will not use it like the dark would.",
		backstory:
			"The Watcher predates the Quiet's reign and remembers older laws of the Gloamreach.",
		keyAbilities: ["Judgement Trial", "Aetheric Imprisonment", "Relic Ward"],
		recruitCondition:
			"Cannot be recruited — the Spire's trial-guardian aids those who pass its judgement, but it guards the Spire's truth and never leaves the Obsidian Spire.",
		isRecruitable: false,
		guildAffiliation: null,
		location: "Obsidian Spire",
		questHook:
			"The Watcher can identify what truth about itself the Quiet most fears.",
	}),
	makeNPC({
		id: "npc-anom-003",
		name: "Specimen X",
		title: "Sapient Transformed Survivor",
		faction: "anomaly_adjacent",
		level: 6,
		job: "Anomaly",
		hp: 65,
		ac: 14,
		description:
			"A frightening, intelligent mass of altered flesh that apologizes for how hard it is to look at.",
		personality:
			"Gentle, lonely, articulate, and carrying justified anger with great care.",
		motivation:
			"Be treated as a person before choosing whether to forgive anyone.",
		backstory:
			"Specimen X was changed by Bureau research and later hidden by the Gloamreach's own records.",
		keyAbilities: ["Adaptive Form", "Regeneration", "Frightening Presence"],
		recruitCondition:
			"Speak before attacking and help it free other thinking captives.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Drowned Ledgerfen or Sunken Tunnels",
		questHook:
			"Specimen X remembers a Bureau archive that lists living people as equipment.",
	}),
	makeNPC({
		id: "npc-anom-004",
		name: "Echo-Nine",
		title: "Dream Walker",
		faction: "anomaly_adjacent",
		level: 7,
		job: "Esper",
		hp: 42,
		ac: 12,
		description:
			"A closed-eyed psychic whose skin glows with dream patterns when the deep dark watches.",
		personality:
			"Serene, unsettling, compassionate, and half a step outside the room.",
		motivation:
			"Map a dream path into the deep dark without becoming part of the map.",
		backstory:
			"Echo-Nine woke from a long coma able to walk through the layer where Domains rehearse possibilities.",
		keyAbilities: ["Dream Walk", "Telepathy", "Psychic Blast"],
		recruitCondition:
			"Share a dream and prove the party seeks resolution, not conquest.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Obsidian Spire dream platform",
		questHook:
			"Echo-Nine found a dream path that bypasses one deep-dark defense and awakens another.",
	}),
	makeNPC({
		id: "npc-anom-005",
		name: "The Catalog",
		title: "Living Memory Construct",
		faction: "anomaly_adjacent",
		level: 4,
		job: "Anomaly",
		hp: 28,
		ac: 13,
		description:
			"A crystalline record-entity that trades knowledge for memories and speaks like an archive learning grief.",
		personality: "Precise, curious, literal, and confused by affection.",
		motivation: "Preserve truth before the dark rewrites it.",
		backstory:
			"The Catalog formed when Domain pressure awakened a record system beneath the Drowned Ledgerfen.",
		keyAbilities: ["Database Query", "Mana Projection", "Record Shield"],
		recruitCondition: "Secure a physical backup of its most dangerous records.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Drowned Ledgerfen - Catalog chamber",
		questHook:
			"The Catalog has a casualty report for someone still alive in the party's camp.",
	}),
	makeNPC({
		id: "npc-anom-006",
		name: "Rex",
		title: "Mana-Touched War Hound",
		faction: "anomaly_adjacent",
		level: 3,
		job: "Anomaly",
		hp: 35,
		ac: 13,
		description:
			"A loyal military hound with glowing veins, tactical instincts, and absolute commitment to being a good dog.",
		personality:
			"Loyal, brave, playful, protective, and better at reading people than most people are.",
		motivation:
			"Find his missing handler and protect whoever smells like home in the meantime.",
		backstory:
			"Rex was separated from Strike Team Seven and has been following old scent trails through impossible roads.",
		keyAbilities: ["Tracking", "Pack Attack", "Danger Sense"],
		recruitCondition:
			"Feed him, protect him, and follow where he keeps trying to lead you.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Hollow Way or the old roads",
		questHook:
			"Rex whines at a sealed Threshold door that no one else can see yet.",
	}),
];

// ============================================================================
// FULL NPC ROSTER EXPORT
// ============================================================================

export const sandboxRecruitableNPCs: SandboxNPC[] = [
	...bureauSentinels,
	...vermillionGuild,
	...awokoCult,
	...independents,
	...anomalyAdjacent,
];

/** Get all NPCs that are unaffiliated and recruitable to player guilds. */
export const getUnaffiliatedNPCs = (): SandboxNPC[] =>
	sandboxRecruitableNPCs.filter(
		(npc) => npc.isRecruitable && npc.guildAffiliation === null,
	);

/** Get NPCs by faction. */
const _getNPCsByFaction = (faction: SandboxNPC["faction"]): SandboxNPC[] =>
	sandboxRecruitableNPCs.filter((npc) => npc.faction === faction);

/** Calculate XP needed for a given level. */
const getXPForLevel = (level: number): number => {
	const thresholds = [
		0, 300, 600, 1200, 2000, 3000, 5000, 8000, 12000, 18000, 25000, 35000,
	];
	return thresholds[Math.min(level, thresholds.length - 1)] || 35000;
};

/** Level up an NPC, returning updated data. */
const _levelUpNPC = (npc: SandboxNPC): SandboxNPC => {
	if (npc.level >= npc.leveling.maxLevel) return npc;
	const newLevel = npc.level + 1;
	const newAbility = npc.leveling.levelAbilities[newLevel];
	return {
		...npc,
		level: newLevel,
		hp: npc.hp + npc.leveling.hpPerLevel,
		keyAbilities: newAbility
			? [...npc.keyAbilities, newAbility]
			: npc.keyAbilities,
		leveling: {
			...npc.leveling,
			xp: 0,
			xpToNextLevel: getXPForLevel(newLevel),
		},
	};
};
