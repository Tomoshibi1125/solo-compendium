// ============================================================================
// SANDBOX NPC ROSTER: "The Shadow of the Regent"
//
// 42 unique named NPCs across 5 factions, aligned to the Gloamreach Gate Domain.
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

const makeNPC = (npc: NPCInput): SandboxNPC => ({
	...npc,
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
			"Prevent Red Phase collapse, recover missing teams, and keep Central Command from sacrificing survivors for clean reports.",
		backstory:
			"Park survived earlier high-rank Gate responses and knows the difference between a bad clear and a ruler wearing a Gate as a crown.",
		keyAbilities: ["Fortification Aura", "Command Strike", "Hold the Line"],
		recruitCondition:
			"Reach Bureau Trusted reputation and help Park defy an order that would abandon civilians.",
		isRecruitable: true,
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
		keyAbilities: ["Equipment Maintenance", "Inventory Mastery", "Emergency Fabrication"],
		recruitCondition:
			"Protect the Annex supply line or save the armory during a Domain bleed event.",
		isRecruitable: true,
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
			"Find her missing scouts and learn why the Road of Writs keeps returning their signals from impossible directions.",
		backstory:
			"Yoon has never lost a team until the Gloamreach began answering radio calls in their voices.",
		keyAbilities: ["Shadow Step", "Anomaly Sense", "Precision Strike"],
		recruitCondition:
			"Resolve the Missing Strike Team quest and give Yoon the truth instead of a comforting lie.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Road of Writs patrol route",
		questHook:
			"Yoon needs escorts to follow an AFA ghost-ping toward Bastion Golemfall.",
	}),
	makeNPC({
		id: "npc-bureau-004",
		name: "Dr. Serin Hayashi",
		title: "Regent Domain Researcher",
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
			"Prove that killing the Regent is not the only possible Anchor resolution.",
		backstory:
			"Hayashi's research on Gate Domains was classified because it made command staff uncomfortable. The Gloamreach proves she was underestimating the problem.",
		keyAbilities: ["Analyze Weakness", "Aetheric Shield", "Anchor Theory"],
		recruitCondition:
			"Bring her three Domain-touched samples and protect her research from being suppressed.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Bureau Domain Response Annex - Evidence Locker",
		questHook:
			"Hayashi needs a live reading from a Mana Vein node before the Citadel approach.",
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
			"Complete her mission without letting Central Command turn the Regent's law into a weapon.",
		backstory:
			"Blackwood knew more than the briefing allowed. Her secrecy can become betrayal, confession, or sacrifice.",
		keyAbilities: ["Infiltration", "Dead Drop", "Counter-Intelligence"],
		recruitCondition:
			"Complete her personal quest and force her to choose the party over Central Command.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Bureau Domain Response Annex - Intelligence desk",
		questHook:
			"Blackwood needs deniable assets to identify which Claim manifested before the threshold stabilized.",
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
			"Stand his ground when the Regent's Bailiff comes for someone he can protect.",
		backstory:
			"Deng froze during a Bailiff judgment and three people were taken. He has cooked for every survivor he could not save.",
		keyAbilities: ["Suppressing Fire", "Heavy Hitter", "Fortify Position"],
		recruitCondition:
			"Help Deng survive a nightmare scene and later face the Bailiff without mocking his fear.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Bureau Domain Response Annex - Field kitchen",
		questHook:
			"Deng's cannon needs a gear-heart from the Tithe Mill to stabilize its output.",
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
			"Decode the Regent's frequency and prove the messages from tomorrow are warnings, not hallucinations.",
		backstory:
			"Reyes was deployed too early and promoted by necessity. She is the reason the Annex still hears anything from inside.",
		keyAbilities: ["Signal Boost", "Decrypt", "Aetheric Jammer"],
		recruitCondition:
			"Repair a relay inside the Hollow Subway or carry a booster through the Road of Writs.",
		isRecruitable: true,
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
			"Sato found a map fragment that changes when read under Citadel light.",
	}),
];

// ============================================================================
// VERMILLION GUILD - Salvage, shelter, black-market support, and hard choices
// ============================================================================

const vermillionGuild: SandboxNPC[] = [
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
		personality: "Slippery, charming, fair in business, and never fully honest.",
		motivation:
			"Profit, survival, and control of one secret about a Claim before someone more dangerous buys it.",
		backstory:
			"Ji built a shadow economy inside the Vermillion Outpost because official supply chains were too slow to keep people alive.",
		keyAbilities: ["Appraise", "Black Market Network", "Escape Artist"],
		recruitCondition:
			"Reach Vermillion Trusted reputation and recover Ji's stash before the Road of Writs transfers ownership.",
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
		job: "Tactician",
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
			"Broker a Bureau-Vermillion alliance without letting either side erase its failures.",
		isRecruitable: true,
		guildAffiliation: "Vermillion Guild",
		location: "Vermillion Outpost - Orin's chamber",
		questHook:
			"Orin has old Regent-combat notes, but sharing them means admitting why he left the Bureau.",
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
		motivation: "Find out why strong fighters vanish after certain Outpost matches.",
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
		motivation: "Make beauty the Regent cannot own.",
		backstory:
			"Bright lost her stage career to Awakening complications and found a new one writing power into scars.",
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
			"Create tools that survive the Citadel without making their wielders monsters.",
		backstory:
			"Baek learned sanctioned Sigil work, then left when regulation became more important than results.",
		keyAbilities: ["Sigil Engraving", "Runic Appraisal", "Stabilize Relic"],
		recruitCondition: "Recover his master lens from the Ashen Counting-House.",
		isRecruitable: true,
		guildAffiliation: "Vermillion Guild",
		location: "Vermillion Outpost - Sigil parlour",
		questHook:
			"Baek can engrave a Claim-safe housing if the party brings him Citadel iron.",
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
			"A wiry courier who knows shortcuts the Road of Writs has not yet learned to punish.",
		personality:
			"Cocky, restless, brave, and secretly terrified of locked rooms.",
		motivation: "Stay faster than ownership.",
		backstory:
			"Jax carried food between isolated shelters until the road started asking his name back.",
		keyAbilities: ["Parkour", "Sprint", "Shortcut Finder"],
		recruitCondition: "Help him break a road-debt before the Bailiff collects him.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Road of Writs and Vermillion Outpost",
		questHook:
			"Jax found a shortcut to the Citadel that appears only after someone lies kindly.",
	}),
];

// ============================================================================
// AWOKO CULT - Grief, false ascension, and the Ritual of Inheritance
// ============================================================================

const awokoCult: SandboxNPC[] = [
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
		motivation: "Inherit the Gloamreach when the Regent weakens.",
		backstory:
			"The Hollow Mother learned that grief can be refined into authority. She calls this mercy because she can no longer bear its true name.",
		keyAbilities: ["Grief Choir", "Inheritance Rite", "Void Benediction"],
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
			"Whisper knows which candle-station will break the Ritual of Inheritance.",
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
		keyAbilities: ["Counter-Ritual", "Containment Field", "Ritual Amplification"],
		recruitCondition:
			"Show her evidence that the Hollow Mother plans to inherit the Domain by burning her followers as fuel.",
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
			"Identify threats to the Ritual of Inheritance and remove them quietly.",
		backstory: "The cult taught him to become nobody. The lesson worked too well.",
		keyAbilities: ["Perfect Disguise", "Forgettable", "Poisoned Hospitality"],
		recruitCondition: "Cannot be recruited. He is a mole to expose.",
		isRecruitable: false,
		guildAffiliation: "Awoko Cult",
		location: "Bureau Annex or tribute settlement",
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
			"Gregor knows which settlement elder has already sold names to the Regent's court.",
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
		personality:
			"Soft, artistic, impressionable, and terrified of silence.",
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
		recruitCondition: "Resupply his clinic and protect it from a collection attempt.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Mother Rust's Outreach Post or tribute settlement clinic",
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
		job: "Oracle",
		hp: 8,
		ac: 10,
		description:
			"A quiet child whose drawings show roads, bells, castles, and people who have not yet arrived.",
		personality:
			"Gentle, strange, honest, and more observant than most adults can bear.",
		motivation:
			"Draw the bad things early enough that someone kind might stop them.",
		backstory:
			"Mika began drawing the Citadel before anyone in the settlement admitted seeing it.",
		keyAbilities: ["Prophetic Drawing", "Danger Sense", "Small Mercy"],
		recruitCondition: "Protect Mika without exploiting her visions.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Bellweather School",
		questHook:
			"Mika's latest drawing shows a party member standing beside the Bailiff.",
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
			"A retired S-Rank Ascendant who drinks tea like a ritual and remembers how sealing a Regent smells.",
		personality:
			"Patient, sorrowful, dryly funny, and old enough to distrust easy endings.",
		motivation: "Teach the party that not every victory is destruction.",
		backstory:
			"Crane survived a prior Regent-class event by sacrificing more than any report records.",
		keyAbilities: ["Sealing Lore", "White Heron Step", "Memory Blade"],
		recruitCondition:
			"Earn his respect and accept that his final technique may cost his life.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Old Man Crane's Teahouse",
		questHook:
			"Crane knows a sealing route through the Citadel but refuses to teach it to conquerors.",
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
		description: "A precise academic whose fear is expressed through better diagrams.",
		personality:
			"Dry, fussy, exact, and quietly brave around impossible evidence.",
		motivation:
			"Prove that Mana Vein nodes can weaken the Regent's battlefield authority.",
		backstory:
			"Lun was ignored until the Gate Domain made his theories operationally inconvenient.",
		keyAbilities: ["Relic Identification", "Vein Sensor", "Rune Decoding"],
		recruitCondition:
			"Activate the three Mana Vein nodes and keep him alive through the third reading.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Bureau Annex or Glass Sub-Basement",
		questHook:
			"Lun needs escorts to install sensors in nodes the Regent can feel.",
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
			"Ghost returned from a failed team operation with memories filed away by a Claim-touched object.",
		keyAbilities: ["Silent Takedown", "Memory Flash", "AFA Ghost-Ping"],
		recruitCondition:
			"Complete Ghost's Memory and let Ghost choose what to do with the truth.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Road of Writs or Bureau Echo Room",
		questHook:
			"Ghost's missing gear is displayed in the Citadel as if it was tribute.",
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
		personality:
			"Warm, fierce, unsentimental, and impossible to buy.",
		motivation: "Keep her people fed without paying the Regent in names.",
		backstory: "Chen organized a shelter when everyone else was waiting for permission.",
		keyAbilities: ["Community Leader", "Iron Will", "Shelter Network"],
		recruitCondition:
			"Move her shelter without letting the road choose the weakest people.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Tribute settlement shelter",
		questHook: "Her water stores now reflect the Citadel instead of the drinker.",
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
			"Complete a device that suppresses one local Domain law without collapsing the people under it.",
		backstory:
			"No one knows whether the Millwright came from the material world or an older part of the Gloamreach.",
		keyAbilities: ["Construct", "Domain Suppression Pulse", "Fortification"],
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
		title: "Gate-Tamer",
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
			"Keep Little Sister alive and learn why Domain beasts are practicing party tactics.",
		backstory:
			"Yu-jin was a veterinarian before Awakening taught her that some monsters respond to care before command.",
		keyAbilities: ["Bonded Companion", "Summon Swarm", "Lyra's Whisper"],
		recruitCondition: "Protect Little Sister from an Awoko abduction attempt.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Covered Market",
		questHook: "Yu-jin says the predators have started learning names instead of scents.",
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
		backstory: "The Caretaker began as a protector and became an accountant of pain.",
		keyAbilities: ["Pruning Hook", "Graft Memory", "Harvest Bell"],
		recruitCondition:
			"Prove the settlement can survive without memory tribute.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Remembering Orchard",
		questHook: "The Caretaker knows where the Blood Claim grew last season.",
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
		description: "A voice in empty armor, still commanding a wall that already fell.",
		personality:
			"Honorable, severe, ashamed, and hungry for proof that oaths can still matter.",
		motivation:
			"Release the dead defenders from service without calling their sacrifice meaningless.",
		backstory: "The commander held Bastion Golemfall until duty became a prison.",
		keyAbilities: ["Oath Command", "Shield Wall", "Dead Muster"],
		recruitCondition:
			"Resolve the Bastion's oath without claiming its soldiers as tools.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Bastion Golemfall",
		questHook:
			"The commander can open a Citadel route if the party restores the fallen banner.",
	}),
];

// ============================================================================
// ANOMALY-ADJACENT - Domain-born, transformed, or nonhuman allies
// ============================================================================

const anomalyAdjacent: SandboxNPC[] = [
	makeNPC({
		id: "npc-anom-001",
		name: "Echo-7",
		title: "Changed Survivor",
		faction: "anomaly_adjacent",
		level: 5,
		job: "Hybrid",
		hp: 44,
		ac: 15,
		description:
			"A humanoid survivor with crystalline growths and two voices trying to remain one person.",
		personality: "Gentle, afraid, curious, and exhausted by being studied.",
		motivation: "Stabilize without being claimed as specimen, monster, or miracle.",
		backstory:
			"Echo-7 survived partial transformation in the Remembering Orchard's deeper growths.",
		keyAbilities: ["Anomaly Form", "Resonance Pulse", "Gate Sense"],
		recruitCondition:
			"Approach without exploitation and help Hayashi design a stabilizing treatment.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Remembering Orchard or Fungal Depths",
		questHook: "Echo-7 can hear a Claim pulse when the party lies about fear.",
	}),
	makeNPC({
		id: "npc-anom-002",
		name: "The Watcher",
		title: "Trial Guardian",
		faction: "anomaly_adjacent",
		level: 8,
		job: "Guardian",
		hp: 90,
		ac: 18,
		description:
			"An ancient guardian of the Obsidian Spire that tests rulers by asking what they refuse to command.",
		personality: "Formal, patient, alien, and amused by mortal certainty.",
		motivation:
			"Protect a Claim until someone proves they will not use it like the Regent did.",
		backstory:
			"The Watcher predates the current Regent and remembers older laws of the Gloamreach.",
		keyAbilities: ["Judgement Trial", "Aetheric Imprisonment", "Relic Ward"],
		recruitCondition: "Pass its trial without choosing domination as the answer.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Obsidian Spire",
		questHook: "The Watcher can identify which Claim the Regent fears most.",
	}),
	makeNPC({
		id: "npc-anom-003",
		name: "Specimen X",
		title: "Sapient Transformed Survivor",
		faction: "anomaly_adjacent",
		level: 6,
		job: "Mutant",
		hp: 65,
		ac: 14,
		description:
			"A frightening, intelligent mass of altered flesh that apologizes for how hard it is to look at.",
		personality:
			"Gentle, lonely, articulate, and carrying justified anger with great care.",
		motivation: "Be treated as a person before choosing whether to forgive anyone.",
		backstory:
			"Specimen X was changed by Bureau research and later hidden by the Domain's own records.",
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
			"A closed-eyed psychic whose skin glows with dream patterns when the Citadel watches.",
		personality:
			"Serene, unsettling, compassionate, and half a step outside the room.",
		motivation: "Map a dream path into the Citadel without becoming part of the map.",
		backstory:
			"Echo-Nine woke from a long coma able to walk through the layer where Domains rehearse possibilities.",
		keyAbilities: ["Dream Walk", "Telepathy", "Psychic Blast"],
		recruitCondition:
			"Share a dream and prove the party seeks resolution, not conquest.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Obsidian Spire dream platform",
		questHook:
			"Echo-Nine found a dream path that bypasses one Citadel defense and awakens another.",
	}),
	makeNPC({
		id: "npc-anom-005",
		name: "The Catalog",
		title: "Living Memory Construct",
		faction: "anomaly_adjacent",
		level: 4,
		job: "Repository",
		hp: 28,
		ac: 13,
		description:
			"A crystalline record-entity that trades knowledge for memories and speaks like an archive learning grief.",
		personality: "Precise, curious, literal, and confused by affection.",
		motivation: "Preserve truth before the Regent's ledgers rewrite it.",
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
		job: "Beast Companion",
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
		recruitCondition: "Feed him, protect him, and follow where he keeps trying to lead you.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Hollow Subway or Road of Writs",
		questHook:
			"Rex whines at a sealed Citadel door that no one else can see yet.",
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
		keyAbilities: newAbility ? [...npc.keyAbilities, newAbility] : npc.keyAbilities,
		leveling: {
			...npc.leveling,
			xp: 0,
			xpToNextLevel: getXPForLevel(newLevel),
		},
	};
};
