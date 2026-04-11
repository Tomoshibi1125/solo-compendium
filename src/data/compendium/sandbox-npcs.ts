// ============================================================================
// SANDBOX NPC ROSTER: "The Shadow of the Regent"
//
// 40+ unique named NPCs across 5 factions, Curse-of-Strahd-scale depth.
// Each NPC supports guild recruitment and leveling (automated + manual).
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
	guildAffiliation: string | null; // null = unaffiliated, recruitable to player guilds
	location: string;
	questHook: string | null;
	/** Leveling config for recruited NPCs */
	leveling: {
		/** Current XP (for automated leveling) */
		xp: number;
		/** XP thresholds per level (simplified) */
		xpToNextLevel: number;
		/** Whether this NPC levels automatically with campaign progression */
		autoLevel: boolean;
		/** Max level this NPC can reach */
		maxLevel: number;
		/** Stats gained per level: [hp, ac_every_n_levels] */
		hpPerLevel: number;
		/** Abilities unlocked at specific levels */
		levelAbilities: Record<number, string>;
	};
}

// ============================================================================
// BUREAU SENTINELS — Government/Military (8 NPCs)
// ============================================================================

const bureauSentinels: SandboxNPC[] = [
	{
		id: "npc-bureau-001",
		name: "Commander Park Jae-won",
		title: "Bureau Outpost Commander",
		faction: "bureau_sentinels",
		level: 8,
		job: "Vanguard",
		hp: 95,
		ac: 18,
		description:
			"A battle-scarred veteran with cybernetic reinforcements along his left arm. Park commands the last functional Bureau outpost in Sector B with an iron will forged from years of Gate raids.",
		personality:
			"Stern, by-the-book, but deeply protective of his subordinates. Speaks in clipped military jargon. Has a dry sense of humor that surfaces only after trust is earned.",
		motivation:
			"Keep his people alive until Central Command sends extraction. Secretly suspects Central has written off Sector B entirely.",
		backstory:
			"Park was a B-Rank Ascendant before the Quarantine. He lost his original left arm saving three D-Rank rookies during the initial Gate Cascade. The Bureau gave him cybernetics and a promotion he never wanted. He's held Ground Zero together for sixty-three days with dwindling supplies and mounting anomaly pressure.",
		keyAbilities: [
			"Fortification Aura (allies gain +2 AC within 30ft)",
			"Command Strike (grant ally a bonus attack)",
			"Cybernetic Overcharge (triple damage, 1/day, costs 10 HP)",
		],
		recruitCondition:
			"Complete 3 Bureau eradication quests AND reach Reputation 'Trusted' with Bureau Sentinels",
		isRecruitable: true,
		guildAffiliation: "Bureau Sentinels",
		location: "Hub: Ground Zero Safehouse",
		questHook:
			"Park needs a covert team to recover classified documents from the Abandoned Military Hospital before the Awoko Cult finds them.",
		leveling: {
			xp: 0,
			xpToNextLevel: 3000,
			autoLevel: true,
			maxLevel: 12,
			hpPerLevel: 12,
			levelAbilities: {
				9: "Tactical Retreat (party disengage without opportunity attacks)",
				10: "Adamant Will (immune to fear and charm)",
				12: "Final Stand (0 HP → fight for 2 more rounds)",
			},
		},
	},
	{
		id: "npc-bureau-002",
		name: "Quartermaster Lin Mei-hua",
		title: "Supply Officer",
		faction: "bureau_sentinels",
		level: 4,
		job: "Artificer",
		hp: 38,
		ac: 14,
		description:
			"A meticulous woman with round glasses and grease-stained fingers. Lin runs the outpost's supply depot with obsessive efficiency, tracking every bullet and bandage.",
		personality:
			"Anxious, detail-oriented, secretly compassionate. Complains constantly about supply shortages but will slip extra rations to injured Ascendants when no one is looking.",
		motivation:
			"Survive. She's not a fighter and knows it. If the outpost falls, she wants to be somewhere else entirely.",
		backstory:
			"Lin was a logistics clerk at Bureau Central before being reassigned to Sector B three weeks before the Quarantine locked down. She's technically not military — just an administrator trapped in a warzone. She's adapted by becoming indispensable.",
		keyAbilities: [
			"Equipment Maintenance (repair gear, restore 1d6 durability)",
			"Inventory Mastery (identify any item instantly)",
			"Emergency Fabrication (craft basic gear from scrap)",
		],
		recruitCondition:
			"If the Black Market Bazaar is destroyed in a story event, Lin will request asylum with the party",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Hub: Ground Zero Safehouse",
		questHook:
			"Lin suspects someone inside the outpost is stealing medical supplies and selling them to the Vermillion Guild.",
		leveling: {
			xp: 0,
			xpToNextLevel: 800,
			autoLevel: true,
			maxLevel: 8,
			hpPerLevel: 6,
			levelAbilities: {
				5: "Armor Patching (restore ally AC mid-combat)",
				6: "Aetheric Tinkering (enchant mundane items temporarily)",
				8: "Supply Drop (summon emergency cache, 1/long rest)",
			},
		},
	},
	{
		id: "npc-bureau-003",
		name: "Sergeant Yoon Hye-jin",
		title: "Patrol Leader",
		faction: "bureau_sentinels",
		level: 5,
		job: "Ranger",
		hp: 52,
		ac: 16,
		description:
			"A tall, wiry woman with close-cropped hair and eyes that never stop scanning. Yoon leads the outpost's three-person scouting teams into the most dangerous sectors.",
		personality:
			"Quiet, observant, pragmatic. Rarely speaks more than necessary. When she does talk, every word matters. Has a habit of marking walls with chalk symbols only her scouts understand.",
		motivation:
			"Find her missing Squad Seven. They went dark in the Subway Network four days ago. She won't rest until she knows their fate.",
		backstory:
			"Yoon was raised in the outer slums before earning Bureau admission through raw talent. She's survived thirteen Gate raids and never lost a squad member — until now. The disappearance of Squad Seven is eating her alive.",
		keyAbilities: [
			"Shadow Step (teleport 30ft in dim light)",
			"Anomaly Sense (detect anomalies within 120ft)",
			"Precision Strike (crit on 18-20 vs tracked targets)",
		],
		recruitCondition:
			"Help her find Squad Seven in the Subway Network (dead or alive). She joins permanently after resolution.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Hub: Ground Zero Safehouse",
		questHook:
			"Squad Seven's last transmission mentioned 'something new' in Maintenance Tunnel 7-C. Yoon needs backup for the rescue mission.",
		leveling: {
			xp: 0,
			xpToNextLevel: 1200,
			autoLevel: true,
			maxLevel: 10,
			hpPerLevel: 8,
			levelAbilities: {
				6: "Pack Tactics (advantage when ally is adjacent)",
				8: "Tunnel Fighter (no disadvantage in cramped spaces)",
				10: "Executioner's Mark (track one target across any distance)",
			},
		},
	},
	{
		id: "npc-bureau-004",
		name: "Dr. Elara Voss",
		title: "Field Researcher",
		faction: "bureau_sentinels",
		level: 6,
		job: "Scholar",
		hp: 42,
		ac: 12,
		description:
			"A disheveled scientist with wild auburn hair and ink-stained lab coat. Elara is the outpost's only remaining aetheric researcher, obsessed with understanding the Gate Cascade that created the Quarantine Zone.",
		personality:
			"Brilliant, scattered, talks too fast. Gets excited about anomaly specimens to a degree that makes soldiers uncomfortable. Genuinely kind beneath the academic detachment.",
		motivation:
			"Understand the Regent. She believes the entity can be studied, contained, even communicated with. Everyone else thinks she's insane.",
		backstory:
			"Dr. Voss was a tenured professor at the National Aetheric Research Institute before volunteering for Sector B field work. She's published three papers on rift biology that were immediately classified. She chose to stay when evacuation was offered because 'the data is irreplaceable.'",
		keyAbilities: [
			"Analyze Weakness (reveal anomaly vulnerabilities, 1/encounter)",
			"Aetheric Shield (absorb 20 damage, 2/day)",
			"Research Insight (grant party advantage on Arcana/Nature checks)",
		],
		recruitCondition:
			"Bring her three different anomaly tissue samples from Rank C or higher creatures",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Hub: Ground Zero Safehouse",
		questHook:
			"Elara needs a live specimen from the Overgrown Botanical Sector — specifically, a Bloom Stalker's root core. She promises the results will help everyone.",
		leveling: {
			xp: 0,
			xpToNextLevel: 1500,
			autoLevel: true,
			maxLevel: 10,
			hpPerLevel: 5,
			levelAbilities: {
				7: "Anomaly Lure (attract specific anomaly types to a location)",
				8: "Experimental Serum (temporary +4 to one stat, 10 min)",
				10: "Regent Communion (brief telepathic contact with nearby Gate entities)",
			},
		},
	},
	{
		id: "npc-bureau-005",
		name: "Agent Kira Blackwood",
		title: "Bureau Intelligence Operative",
		faction: "bureau_sentinels",
		level: 7,
		job: "Shadow",
		hp: 58,
		ac: 17,
		description:
			"A pale, sharp-featured woman who moves like smoke. Blackwood is the Bureau's embedded intelligence agent — she answers to Central Command directly, not Commander Park.",
		personality:
			"Cold, calculating, speaks in half-truths. Impossible to read. Occasionally shows flashes of genuine empathy that she immediately suppresses. Drinks too much reconstituted coffee.",
		motivation:
			"Complete her classified mission: determine if the Regent can be weaponized. She's increasingly unsure she wants the answer.",
		backstory:
			"Blackwood was placed in Sector B three months before the Quarantine — she was already here when it happened. This has led to conspiracy theories among the outpost personnel. She denies everything, which only makes things worse.",
		keyAbilities: [
			"Infiltration (advantage on stealth + deception)",
			"Killing Blow (bonus damage from stealth: +3d6)",
			"Dead Drop (create hidden supply caches in any location)",
		],
		recruitCondition:
			"Only joins if players haven't betrayed the Bureau. Requires Bureau reputation 'Trusted' or higher AND completing her personal quest.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Hub: Ground Zero Safehouse",
		questHook:
			"Blackwood has intercepted Awoko Cult communications mentioning a 'Phase 3.' She needs deniable assets to investigate the Financial District ritual site.",
		leveling: {
			xp: 0,
			xpToNextLevel: 2000,
			autoLevel: true,
			maxLevel: 11,
			hpPerLevel: 7,
			levelAbilities: {
				8: "Ghost Protocol (invisible for 1 minute, 1/day)",
				9: "Counter-Intelligence (immune to divination and scrying)",
				11: "Termination Order (auto-crit vs surprised targets)",
			},
		},
	},
	{
		id: "npc-bureau-006",
		name: "Corporal Deng Wei",
		title: "Heavy Weapons Specialist",
		faction: "bureau_sentinels",
		level: 4,
		job: "Warrior",
		hp: 48,
		ac: 16,
		description:
			"A stocky, broad-shouldered man who carries a modified aetheric pulse cannon that's nearly as big as he is. Deng speaks softly but carries a very big gun.",
		personality:
			"Gentle giant. Loves cooking, hates violence (ironic given his role). Suffers from insomnia since his encounter with The Executioner. Hums lullabies when nervous.",
		motivation:
			"Overcome his paralyzing fear of The Executioner. He froze during an encounter and three people got hurt. He can't forgive himself.",
		backstory:
			"Deng was a professional chef before the economic collapse pushed him into Bureau service. He's a natural with heavy weapons but was never meant for this life. The Executioner encounter left him with recurring nightmares and a tremor in his right hand that he hides from everyone.",
		keyAbilities: [
			"Suppressing Fire (enemies in cone must save or lose movement)",
			"Heavy Hitter (+2d6 damage with heavy weapons)",
			"Fortify Position (create temporary cover from rubble)",
		],
		recruitCondition:
			"Show him kindness after his nightmare episode (random event in safehouse). He volunteers to join after.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Hub: Ground Zero Safehouse",
		questHook:
			"Deng's pulse cannon is losing power. The replacement aetheric core is somewhere in the Abandoned Military Hospital's armory.",
		leveling: {
			xp: 0,
			xpToNextLevel: 800,
			autoLevel: true,
			maxLevel: 9,
			hpPerLevel: 10,
			levelAbilities: {
				5: "Overwatch (free ranged attack when enemy enters area)",
				7: "Iron Resolve (advantage on saves vs fear)",
				9: "Annihilation Blast (mega attack, 6d10, 1/day, 1 min cooldown)",
			},
		},
	},
	{
		id: "npc-bureau-007",
		name: "Comms Officer Reyes",
		title: "Signal Specialist",
		faction: "bureau_sentinels",
		level: 3,
		job: "Technician",
		hp: 28,
		ac: 12,
		description:
			"A young Filipino-American woman with a headset permanently grafted to one ear and fingers that dance across holographic keyboards. Reyes is the only person who can still reach Central Command — sometimes.",
		personality:
			"Fast-talking, anxious, brilliant with technology. Fills silences with chatter. Has a conspiracy board in her quarters connecting Gate patterns to lunar cycles (she might be right).",
		motivation:
			"Crack the Regent's signal. She's detected a repeating aetheric frequency emanating from the Citadel that she believes is some form of communication.",
		backstory:
			"Reyes was top of her class at the Bureau's Technical Academy. First deployment. She's twenty-two years old and has aged ten years in two months. She copes by throwing herself into work and maintaining the comms array that is their only lifeline.",
		keyAbilities: [
			"Signal Boost (extend communication range to 10 miles)",
			"Decrypt (decode any non-magical cipher or code)",
			"EMP Burst (disable electronic anomalies, 30ft radius, 1/day)",
		],
		recruitCondition:
			"Available from the start if players help her repair the secondary comms relay in the Subway Network",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Hub: Ground Zero Safehouse",
		questHook:
			"Reyes has pinpointed Squad Seven's last signal to a specific subway platform, but she needs someone to physically carry a signal booster there.",
		leveling: {
			xp: 0,
			xpToNextLevel: 600,
			autoLevel: true,
			maxLevel: 8,
			hpPerLevel: 4,
			levelAbilities: {
				4: "Tactical Scan (reveal all enemies in 60ft for 1 round)",
				6: "Aetheric Jammer (suppress anomaly abilities, 30ft, 1 round)",
				8: "Regent Frequency Decoder (understand Regent communications)",
			},
		},
	},
	{
		id: "npc-bureau-008",
		name: "Warden-Aspirant Sato Ken",
		title: "Bureau Recruit",
		faction: "bureau_sentinels",
		level: 2,
		job: "Initiate",
		hp: 22,
		ac: 13,
		description:
			"A skinny eighteen-year-old with too-big armor and fierce determination in his eyes. Sato was two weeks into basic training when the Quarantine dropped. He's never been in a real fight.",
		personality:
			"Eager, earnest, desperately wants to prove himself. Idolizes Commander Park. Terrible at hiding his fear. Has a photo of his younger sister taped inside his helmet.",
		motivation:
			"Become a real Ascendant and get home to his sister in the outer districts. He promised he'd come back.",
		backstory:
			"Sato enlisted because D-Rank Ascendant pay was the only way to afford his sister's medical treatment. He can barely swing a sword but refuses to give up. The veteran soldiers protect him out of a mix of affection and guilt.",
		keyAbilities: [
			"Determination (reroll one failed save per day)",
			"Quick Learner (gains 25% bonus XP)",
			"Inspire (adjacent allies gain +1 to hit when he's conscious)",
		],
		recruitCondition:
			"Joins immediately if asked. Commander Park will express concern but won't stop him.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Hub: Ground Zero Safehouse",
		questHook:
			"Sato found a torn map fragment in the rubble that shows a path into the Subway Network that isn't on any Bureau chart.",
		leveling: {
			xp: 0,
			xpToNextLevel: 300,
			autoLevel: true,
			maxLevel: 10,
			hpPerLevel: 8,
			levelAbilities: {
				3: "Combat Training (proficiency with all simple weapons)",
				5: "Second Wind (heal 2d10, 1/day)",
				7: "Ascendant Awakening (unlock random rune attunement)",
				10: "Hero's Resolve (cannot be reduced below 1 HP once per day)",
			},
		},
	},
];

// ============================================================================
// VERMILLION GUILD — Mercenary/Criminal (8 NPCs)
// ============================================================================

const vermillionGuild: SandboxNPC[] = [
	{
		id: "npc-verm-001",
		name: "Rat-king Ji",
		title: "Black Market Fence",
		faction: "vermillion_guild",
		level: 6,
		job: "Merchant",
		hp: 45,
		ac: 14,
		description:
			"A wiry man with mismatched eyes — one natural brown, one replaced with a glowing amber aetheric implant. Ji runs the largest black market operation in Sector B from a reinforced shipping container.",
		personality:
			"Slippery, charming, never gives a straight answer. Always counting something — credits, exits, the number of weapons in the room. Genuinely fair in business deals, which is why people trust him.",
		motivation:
			"Profit, obviously. But also: Ji is sitting on a secret — he knows where one of the Regent Relics is and is trying to figure out how to sell that information to the highest bidder.",
		backstory:
			"Ji was a licensed trader before the Quarantine. When the Bureau confiscated private supplies 'for the common good,' Ji went underground. He's built an entire shadow economy that keeps more people alive than the Bureau admits.",
		keyAbilities: [
			"Appraise (determine exact value of any item or relic)",
			"Black Market Network (acquire any non-legendary item within 24 hours)",
			"Escape Artist (auto-succeed on grapple escapes)",
		],
		recruitCondition:
			"Build Vermillion Guild reputation to 'Respected' + complete a personal favor (retrieve his stashed emergency funds from the Financial District)",
		isRecruitable: true,
		guildAffiliation: "Vermillion Guild",
		location: "Hub: The Lower City Bazaar",
		questHook:
			"Ji has learned the Awoko Cult is planning to flood the Bazaar tunnels. He needs someone to sabotage their water-Gate device.",
		leveling: {
			xp: 0,
			xpToNextLevel: 1500,
			autoLevel: true,
			maxLevel: 10,
			hpPerLevel: 6,
			levelAbilities: {
				7: "Contraband Cache (hidden inventory, undetectable)",
				8: "Underworld Contacts (intel on any faction, 1/day)",
				10: "Golden Tongue (auto-succeed on one Persuasion/Deception per day)",
			},
		},
	},
	{
		id: "npc-verm-002",
		name: 'Vex "Quicksilver"',
		title: "Guild Assassin",
		faction: "vermillion_guild",
		level: 7,
		job: "Assassin",
		hp: 55,
		ac: 17,
		description:
			"A lean figure in a silver-lined coat, face always half-hidden by a mask. Vex moves with unnatural speed — rumored to have absorbed a haste-type rune that fused with their nervous system.",
		personality:
			"Professional, sardonic, refers to killing as 'contract resolution.' Has a strict personal code: no children, no innocents, no jobs that bore them. Gender-fluid, uses they/them.",
		motivation:
			"Revenge against the Awoko Cult. The Cult kidnapped and sacrificed Vex's partner during a ritual. Vex has been methodically eliminating Cult operatives ever since.",
		backstory:
			"Vex was a competitive duelist before becoming a freelance problem-solver. They took a Vermillion Guild contract that went wrong when the Awoko Cult double-crossed the client. Vex's partner, a healer named Soren, was taken as a 'tribute.' Vex found what was left of Soren three days later.",
		keyAbilities: [
			"Quicksilver Rush (take two turns in the first round)",
			"Assassinate (auto-crit on surprised targets)",
			"Silver Blur (50% miss chance for 1 round, 2/day)",
		],
		recruitCondition:
			"Agree to help them eliminate the Awoko Cult's High Priestess Nyx. Vex joins for the duration of that quest and permanently if it succeeds.",
		isRecruitable: true,
		guildAffiliation: "Vermillion Guild",
		location: "Hub: The Lower City Bazaar",
		questHook:
			"Vex has identified a Cult spy within the Bureau — but needs proof before making a move.",
		leveling: {
			xp: 0,
			xpToNextLevel: 2000,
			autoLevel: true,
			maxLevel: 11,
			hpPerLevel: 7,
			levelAbilities: {
				8: "Phantom Step (move through enemies without triggering attacks)",
				9: "Death Mark (target takes +2d6 from all sources for 1 round)",
				11: "Soren's Requiem (ultimate: auto-kill target below 25% HP, 1/day)",
			},
		},
	},
	{
		id: "npc-verm-003",
		name: "Mother Rust",
		title: "Junk Alchemist",
		faction: "vermillion_guild",
		level: 5,
		job: "Alchemist",
		hp: 35,
		ac: 11,
		description:
			"An elderly woman with copper-oxide-green hair and fingers stained with chemical burns. Mother Rust brews potions, poisons, and explosives from salvaged materials in a tent that smells like burning tires.",
		personality:
			"Grandmotherly but unhinged. Calls everyone 'dear' while casually handling volatile compounds. Has strong opinions about everything. Treats her collection of toxic substances like beloved pets.",
		motivation:
			"Perfect her magnum opus: an alchemical compound that can close a Gate permanently. She's failing, but she's close — or so she claims.",
		backstory:
			"Mother Rust was Dr. Irina Volkov, a disgraced university chemist who lost her tenure after an 'unauthorized experiment' collapsed a laboratory wing. She reinvented herself in the underworld and is happier for it.",
		keyAbilities: [
			"Brew Potion (create healing/buff potions from junk)",
			"Acid Flask (ranged attack, 2d8 acid, ignores AC)",
			"Volatile Mixture (create explosive trap, 4d6 fire, 20ft radius)",
		],
		recruitCondition:
			"Bring her a vial of 'living aether' from the Overgrown Botanical Sector's deepest grove",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Hub: The Lower City Bazaar",
		questHook:
			"Mother Rust's latest experiment opened a micro-Gate inside her tent. It's growing. She needs help closing it before the Bazaar notices.",
		leveling: {
			xp: 0,
			xpToNextLevel: 1200,
			autoLevel: true,
			maxLevel: 9,
			hpPerLevel: 5,
			levelAbilities: {
				6: "Elixir of Fortitude (grant temporary HP to entire party)",
				7: "Corrosive Cloud (area denial, 3d6/round in 15ft area)",
				9: "Philosopher's Bomb (ultimate: close a micro-Gate, 1/campaign)",
			},
		},
	},
	{
		id: "npc-verm-004",
		name: "Torch",
		title: "Pyrokinetic Enforcer",
		faction: "vermillion_guild",
		level: 6,
		job: "Pyromancer",
		hp: 50,
		ac: 13,
		description:
			"A hulking man covered in burn scars with flame-orange hair that seems to glow. Torch is the Vermillion Guild's primary enforcer — when debts go unpaid, Torch makes house calls.",
		personality:
			"Surprisingly calm and philosophical. Speaks slowly, thinks before acting. The violence he's capable of contrasts sharply with his gentle demeanor. Loves reading pre-Quarantine novels.",
		motivation:
			"Money to send to his family outside the Quarantine Zone. He doesn't know if the letters get through, but he keeps writing them.",
		backstory:
			"Torch was an industrial welder who awakened pyrokinetic abilities during a Gate surge. His name came from the first time he lost control — burned down half a city block. No casualties, by pure luck. The Guild saw his potential before the Bureau could recruit him.",
		keyAbilities: [
			"Flame Wall (60ft wall of fire, 3d6 to anything passing through)",
			"Inferno Touch (melee, 4d6 fire damage, ignites target)",
			"Controlled Burn (clear obstacles/debris with precise fire)",
		],
		recruitCondition:
			"Pay his fee: 5,000 Credits upfront. Or help him send a letter to his family through the Quarantine perimeter.",
		isRecruitable: true,
		guildAffiliation: "Vermillion Guild",
		location: "Hub: The Lower City Bazaar",
		questHook:
			"Torch knows a way through the sewers to the Quarantine perimeter relay station. He'll share it — for a price.",
		leveling: {
			xp: 0,
			xpToNextLevel: 1500,
			autoLevel: true,
			maxLevel: 10,
			hpPerLevel: 8,
			levelAbilities: {
				7: "Heatwave (enemies in 30ft have disadvantage for 1 round)",
				8: "Cauterize (heal ally 3d8 with fire, painful but effective)",
				10: "Supernova (30ft radius, 8d6 fire, 1/day, Torch takes 20 damage)",
			},
		},
	},
	{
		id: "npc-verm-005",
		name: "Silk",
		title: "Information Broker",
		faction: "vermillion_guild",
		level: 4,
		job: "Spy",
		hp: 30,
		ac: 15,
		description:
			"A small, elegant person of indeterminate age with impeccable clothes despite the apocalypse. Silk always knows more than they should and sells information like fine wine — by the glass.",
		personality:
			"Enigmatic, polite, never threatens directly. Has a photographic memory. Collects secrets like a dragon hoards gold. Loyal to no faction — only to the truth (and Credits).",
		motivation:
			"Knowledge is the only currency that appreciates. Silk wants to know the truth about the Regent, the Quarantine, and why Central Command hasn't sent help.",
		backstory:
			"Nobody knows Silk's real name or origin. They appeared in Sector B two weeks after Quarantine with an already-established network of informants. Some suspect they were placed here deliberately. By whom is the question.",
		keyAbilities: [
			"Whisper Network (learn one secret about any named NPC)",
			"Misdirection (cause one pursuer to lose the trail)",
			"Leverage (advantage on Intimidation using secrets)",
		],
		recruitCondition:
			"Trade Silk a piece of information they don't already have (which is extremely hard). Or save their life from a Cult assassination attempt.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Hub: The Lower City Bazaar",
		questHook:
			"Silk has discovered that one of the three Regent Relics has already been found — but not by any faction the players know about.",
		leveling: {
			xp: 0,
			xpToNextLevel: 800,
			autoLevel: true,
			maxLevel: 8,
			hpPerLevel: 4,
			levelAbilities: {
				5: "Double Agent (plant false info in any faction)",
				6: "Vanish (become undetectable for 10 minutes, 1/day)",
				8: "Omniscience (learn the location of any person or object in Sector B, 1/week)",
			},
		},
	},
	{
		id: "npc-verm-006",
		name: "Old Man Crane",
		title: "Retired S-Rank Ascendant",
		faction: "vermillion_guild",
		level: 10,
		job: "Sage",
		hp: 72,
		ac: 15,
		description:
			"A weathered old man who sits in the corner of the Bazaar's tea-stall, sipping reconstituted green tea. Crane doesn't look dangerous. This is intentional. He was once the most feared Ascendant on the eastern seaboard.",
		personality:
			"Cryptic, patient, speaks in parables. Watches everything with amused detachment. Will only fight when he decides the cause is worth his remaining energy.",
		motivation:
			"Die on his own terms, not in some anonymous Gate. He's waiting for something worth his last battle.",
		backstory:
			"Crane was S-Rank Ascendant 'White Heron,' veteran of twelve Gate Collapses. He retired after the Seoul Cascade killed his entire team. He wanders the Quarantine Zone because 'the tea is better when death is close.' His real power is terrifying — and fading with age.",
		keyAbilities: [
			"Serene Strike (attack that bypasses all resistances)",
			"Thousand Leaves (counter any single attack, 3/day)",
			"Sage's Wisdom (grant +5 to any ally's check, 1/day)",
		],
		recruitCondition:
			"Only joins for the final confrontation with the Regent. Must have earned his respect through actions, not words.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Hub: The Lower City Bazaar",
		questHook:
			"Crane recognizes something about the Regent's aetheric signature. He'll share what he knows only if the players can beat him in a philosophical debate (or a single duel strike).",
		leveling: {
			xp: 0,
			xpToNextLevel: 5000,
			autoLevel: false,
			maxLevel: 12,
			hpPerLevel: 6,
			levelAbilities: {
				11: "White Heron's Legacy (all allies gain +2 to all saves for 1 hour)",
				12: "Final Technique (single strike, 20d6, Crane dies after use)",
			},
		},
	},
	{
		id: "npc-verm-007",
		name: "Ash & Ember (The Twins)",
		title: "Dual Rogues",
		faction: "vermillion_guild",
		level: 3,
		job: "Twin Rogues",
		hp: 26,
		ac: 15,
		description:
			"Identical teenage twins with shock-white hair and matching crescent-moon tattoos. Ash is left-handed, Ember is right. They finish each other's sentences and fight as a single devastating unit.",
		personality:
			"Playful, mischievous, intensely loyal to each other above all else. Ash is the planner, Ember is the improviser. Both are sharper than they pretend to be.",
		motivation:
			"Keep each other alive. Everything else is secondary. They're also searching for their older brother who disappeared into the Subway Network.",
		backstory:
			"Orphaned during the initial Gate Cascade, the twins survived alone for weeks before the Vermillion Guild took them in. They earned their keep as pickpockets and scouts. Guildmaster Orin considers them unofficial protégés.",
		keyAbilities: [
			"Twin Strike (both attack same target, combined 4d6)",
			"Vanishing Act (both become invisible for 1 round, 2/day)",
			"Uncanny Dodge (halve damage from one attack, each, per round)",
		],
		recruitCondition:
			"Recruit as a pair (cannot be separated). Ask them nicely and promise to help find their brother.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Hub: The Lower City Bazaar",
		questHook:
			"The Twins found a Regent Cipher fragment in a dead Cultist's pocket. They can't read it but know it's valuable.",
		leveling: {
			xp: 0,
			xpToNextLevel: 600,
			autoLevel: true,
			maxLevel: 8,
			hpPerLevel: 6,
			levelAbilities: {
				4: "Flanking Mastery (auto-advantage when both adjacent to target)",
				6: "Gemini Evade (if one twin dodges, both dodge)",
				8: "Twin Tempest (12-hit combo, 6d6 total, stuns target, 1/day)",
			},
		},
	},
	{
		id: "npc-verm-008",
		name: "Guildmaster Orin",
		title: "Former Bureau Warden",
		faction: "vermillion_guild",
		level: 9,
		job: "Tactician",
		hp: 82,
		ac: 17,
		description:
			"A broad-shouldered man in his fifties with salt-and-pepper hair and calculating gray eyes. Orin carries himself with military precision that betrays his Bureau origins.",
		personality:
			"Strategic, charismatic, ruthless when necessary. Treats the Guild like a military unit with better pay. Has genuine paternal feelings toward the Twins and several younger Guild members.",
		motivation:
			"Unite the three factions against the Regent. He knows divided they'll all die. He also knows nobody trusts each other enough to cooperate — yet.",
		backstory:
			"Orin was a Bureau Warden who was court-martialed for 'unauthorized tactical decisions' — he saved six Ascendants by defying orders during a Gate Collapse. Stripped of rank, he founded the Vermillion Guild as a place for outcasts. He's never stopped being a soldier.",
		keyAbilities: [
			"Battle Command (all allies gain +2 to hit and damage for 1 round)",
			"Tactical Genius (rearrange initiative order once per encounter)",
			"Iron Will (advantage on all saves while conscious)",
		],
		recruitCondition:
			"Require the player to unite Bureau Sentinels and Vermillion Guild factions (major story milestone). Orin joins with his full tactical support.",
		isRecruitable: true,
		guildAffiliation: "Vermillion Guild",
		location: "Hub: The Lower City Bazaar",
		questHook:
			"Orin proposes a joint Bureau-Guild operation against the Awoko Cult's ritual site in the Financial District. He needs a neutral party to broker the alliance.",
		leveling: {
			xp: 0,
			xpToNextLevel: 3000,
			autoLevel: true,
			maxLevel: 12,
			hpPerLevel: 9,
			levelAbilities: {
				10: "Unified Front (all faction NPCs gain +1 to all stats during joint operations)",
				11: "Warden's Authority (force enemy to reroll one attack, 2/day)",
				12: "Grand Strategy (precombat: set 3 conditional triggers for ally actions)",
			},
		},
	},
];

// ============================================================================
// AWOKO CULT — Antagonist Faction (6 NPCs, mostly hostile)
// ============================================================================

const awokoCult: SandboxNPC[] = [
	{
		id: "npc-awoko-001",
		name: "High Priestess Nyx",
		title: "Cult Leader",
		faction: "awoko_cult",
		level: 9,
		job: "Void Priestess",
		hp: 78,
		ac: 16,
		description:
			"A tall woman wreathed in shadows, her eyes replaced by swirling voids of purple energy. Nyx is the Awoko Cult's supreme leader, claiming direct communion with the Regent.",
		personality:
			"Fanatically devoted, eloquent, terrifyingly calm. Believes destruction is transformation. Treats her followers with genuine care — which makes her more dangerous, not less.",
		motivation:
			"Complete the Awakening Ritual and free the Regent. She believes this will 'evolve' humanity into something greater. She may be right — just not in a way anyone would want.",
		backstory:
			"Nyx was Dr. Sarah Kim, a grief counselor who lost her family during the Seoul Cascade. She found the Awoko Texts in the ruins and heard the Regent's voice. It offered her something no one else could: purpose without pain.",
		keyAbilities: [
			"Void Drain (steal 3d8 HP from target, heal self)",
			"Shadow Congregation (summon 4 shadow minions, 1/day)",
			"Regent's Whisper (charm one target for 1 minute, WIS save DC 18)",
		],
		recruitCondition:
			"Cannot be recruited. Primary antagonist. Must be defeated or redeemed through special story path.",
		isRecruitable: false,
		guildAffiliation: "Awoko Cult",
		location: "Region: Downtown Financial Ruins",
		questHook: null,
		leveling: {
			xp: 0,
			xpToNextLevel: 5000,
			autoLevel: false,
			maxLevel: 12,
			hpPerLevel: 8,
			levelAbilities: {},
		},
	},
	{
		id: "npc-awoko-002",
		name: "The Prophet (Whisper)",
		title: "Cult Oracle / Defector",
		faction: "awoko_cult",
		level: 5,
		job: "Seer",
		hp: 32,
		ac: 11,
		description:
			"A gaunt, trembling figure wrapped in tattered robes, eyes clouded white. Whisper was the Cult's primary oracle until they saw something in a vision that broke their faith.",
		personality:
			"Haunted, speaks in fragments, alternates between lucidity and prophetic trance. Deeply remorseful about the Cult's atrocities. Cries silently when no one is watching.",
		motivation:
			"Atone for what the Cult has done. Whisper saw the truth of the Regent's 'evolution': not transcendence, but annihilation. They defected but carry unbearable guilt.",
		backstory:
			"Whisper was a street fortune-teller who discovered genuine prophetic ability when a Gate opened over their apartment. The Cult found them first. For two years, Whisper's visions guided the Cult's operations. Then they had The Vision — the one that showed them what the Regent actually is.",
		keyAbilities: [
			"Prophecy (reveal one future event outcome per day)",
			"Psychic Shield (negate one psychic/necrotic attack)",
			"Visions of Truth (dispel illusions and detect lies)",
		],
		recruitCondition:
			"Find Whisper hiding in the Sewers. Convince them that redemption is possible (Persuasion DC 14 or roleplaying).",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Region: The Aetheric Sewer Network",
		questHook:
			"Whisper knows the location of the Cult's main ritual chamber and the schedule for the next Awakening attempt. But sharing that knowledge will put a death mark on everyone involved.",
		leveling: {
			xp: 0,
			xpToNextLevel: 1200,
			autoLevel: true,
			maxLevel: 9,
			hpPerLevel: 4,
			levelAbilities: {
				6: "Mass Prophecy (reveal outcomes for entire party, 1/week)",
				7: "Psychic Backlash (reflect psychic damage to attacker)",
				9: "Oracle's Sacrifice (prevent one ally death, Whisper falls unconscious for 24h)",
			},
		},
	},
	{
		id: "npc-awoko-003",
		name: "Blood Zealot Karn",
		title: "Cult Berserker",
		faction: "awoko_cult",
		level: 7,
		job: "Berserker",
		hp: 85,
		ac: 14,
		description:
			"A massive, scarred man with ritual brands covering every visible inch of skin. Karn is the Cult's executioner and most devoted warrior. His eyes glow red during combat.",
		personality:
			"Mono-focused on violence and devotion. Surprisingly articulate when not in battle-rage. Genuinely believes pain is sacred and suffering is prayer.",
		motivation:
			"Serve the Regent. Karn has been promised he will be the first to 'ascend' when the Regent awakens. He doesn't understand this means obliteration.",
		backstory:
			"Karn was a professional MMA fighter who was losing his mind to CTE. The Cult's rituals halted his deterioration — or so he believes. In truth, the Regent's influence has replaced his damaged neurons with something else entirely.",
		keyAbilities: [
			"Blood Rage (double damage while below 50% HP)",
			"Ritual Brands (resist fire and necrotic damage)",
			"Execution Strike (instant kill on targets below 10% HP)",
		],
		recruitCondition: "Cannot be recruited. Kill on sight. Boss encounter.",
		isRecruitable: false,
		guildAffiliation: "Awoko Cult",
		location: "Region: Downtown Financial Ruins",
		questHook: null,
		leveling: {
			xp: 0,
			xpToNextLevel: 5000,
			autoLevel: false,
			maxLevel: 10,
			hpPerLevel: 12,
			levelAbilities: {},
		},
	},
	{
		id: "npc-awoko-004",
		name: "Sister Veil",
		title: "Cult Ritualist",
		faction: "awoko_cult",
		level: 6,
		job: "Ritualist",
		hp: 40,
		ac: 13,
		description:
			"A woman whose face is hidden behind a porcelain mask etched with aetheric symbols. Sister Veil oversees the Cult's Gate rituals and manages their captive anomaly specimens.",
		personality:
			"Methodical, emotionally distant, treats Gate energy like a science rather than religion. She's a true believer but her faith is intellectual, not emotional — which means it can be shaken by evidence.",
		motivation:
			"Understand the mechanism of the Awakening. She's started to notice inconsistencies between what Nyx promises and what her own research shows.",
		backstory:
			"Veil was an aetheric engineer who joined the Cult voluntarily after concluding that Gates are evolving and humanity needs to evolve with them. She designed the Cult's containment systems and ritual arrays. Lately, she's been running unauthorized experiments.",
		keyAbilities: [
			"Gate Manipulation (redirect Gate energy flows)",
			"Containment Field (trap one entity in force bubble, 3 rounds)",
			"Ritual Amplification (double the effect of any magical effect, 1/day)",
		],
		recruitCondition:
			"Show her Dr. Voss's research proving the Regent's 'evolution' is actually annihilation. She needs hard data to break her faith. Persuasion DC 16 after providing evidence.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Region: Downtown Financial Ruins",
		questHook:
			"If turned, Sister Veil can sabotage the Cult's main ritual array from the inside — but needs time and protection.",
		leveling: {
			xp: 0,
			xpToNextLevel: 1500,
			autoLevel: true,
			maxLevel: 10,
			hpPerLevel: 5,
			levelAbilities: {
				7: "Counter-Ritual (dispel one enemy ritual/spell instantly)",
				8: "Gate Seal (close small Gates permanently)",
				10: "Awakening Reversal (reverse one anomaly transformation, 1/campaign)",
			},
		},
	},
	{
		id: "npc-awoko-005",
		name: "The Hollow Man",
		title: "Cult Infiltrator",
		faction: "awoko_cult",
		level: 4,
		job: "Infiltrator",
		hp: 34,
		ac: 14,
		description:
			"Average height, average build, average face. That's the point. The Hollow Man is a Cult spy embedded within the Bureau outpost, feeding information to Nyx for months.",
		personality:
			"Perfectly mimics whoever he's impersonating. Real personality is cold, methodical, empty. He's forgotten who he was before the Cult reshaped him.",
		motivation:
			"Complete his mission: identify which Ascendants in the Bureau are potential threats to the Awakening and eliminate them quietly.",
		backstory:
			"The Hollow Man was a nobody — a clerk, a janitor, a face in the crowd. The Cult gave him purpose by teaching him to become anyone. He's killed three Bureau personnel and blamed it on anomaly encounters. Nobody suspects him because nobody remembers him.",
		keyAbilities: [
			"Perfect Disguise (undetectable impersonation)",
			"Forgettable (targets must pass WIS save to remember seeing him)",
			"Poison (apply lethal poison to food/drink, undetectable)",
		],
		recruitCondition:
			"Cannot be recruited. He's a mole to be discovered and dealt with. Investigation encounter.",
		isRecruitable: false,
		guildAffiliation: "Awoko Cult",
		location: "Hub: Ground Zero Safehouse",
		questHook: null,
		leveling: {
			xp: 0,
			xpToNextLevel: 2000,
			autoLevel: false,
			maxLevel: 7,
			hpPerLevel: 5,
			levelAbilities: {},
		},
	},
	{
		id: "npc-awoko-006",
		name: "Acolyte Mara",
		title: "Young Cult Initiate",
		faction: "awoko_cult",
		level: 2,
		job: "Acolyte",
		hp: 18,
		ac: 11,
		description:
			"A sixteen-year-old girl with shaved head and fresh ritual marks that she clearly didn't choose. Mara's eyes are terrified even when her voice recites Cult prayers perfectly.",
		personality:
			"Scared, obedient on the surface, desperately wanting to escape. Has a stubborn core of defiance that surfaces in small acts of rebellion. Smart enough to hide it.",
		motivation:
			"Escape the Cult alive. She was forced into it when the Cult 'recruited' survivors from her shelter. She's seen too much to be allowed to leave willingly.",
		backstory:
			"Mara was a high school student when the Quarantine hit. Her parents died in the first week. The shelter she found was raided by the Cult who took all young survivors as 'acolytes.' She's been performing rituals she doesn't understand and pretending to believe.",
		keyAbilities: [
			"Ritual Knowledge (understands Cult rituals and can disrupt them)",
			"Innocent Face (advantage on Deception to appear harmless)",
			"Survivor's Instinct (advantage on saves vs death)",
		],
		recruitCondition:
			"Rescue her from the Cult's holding area in the Financial District. She joins immediately and permanently.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Region: Downtown Financial Ruins",
		questHook:
			"Mara can draw a map of the Cult's ritual chamber from memory. She's also memorized the schedule for guard rotations.",
		leveling: {
			xp: 0,
			xpToNextLevel: 300,
			autoLevel: true,
			maxLevel: 8,
			hpPerLevel: 4,
			levelAbilities: {
				3: "Counter-Prayer (disrupt one Cult ritual, no check needed)",
				5: "Cult Secrets (reveal hidden Cult caches and passages)",
				7: "Awakened Potential (unlock latent aetheric ability, random school)",
				8: "Defiant Spirit (immune to charm, fear, and mind control)",
			},
		},
	},
];

// ============================================================================
// INDEPENDENTS — Civilians/Survivors (10 NPCs)
// ============================================================================

const independents: SandboxNPC[] = [
	{
		id: "npc-ind-001",
		name: '"Doc" Tanaka Hiroshi',
		title: "Underground Surgeon",
		faction: "independent",
		level: 4,
		job: "Medic",
		hp: 30,
		ac: 10,
		description:
			"A middle-aged man with gentle hands and exhausted eyes. Doc runs a makeshift clinic in a converted laundromat, treating anyone regardless of faction.",
		personality:
			"Compassionate, overworked, occasional gallows humor. Has a strict no-weapons policy inside his clinic that even the Vermillion Guild respects.",
		motivation:
			"Keep people alive. It's that simple. He's also searching for a cure for the 'Grey Sickness' — a condition affecting people exposed to prolonged Gate radiation.",
		backstory:
			"Tanaka was an ER surgeon at Central Hospital. When the Quarantine hit, he walked twelve miles through anomaly territory with a medical bag to reach the survivor clusters. He's saved over four hundred lives.",
		keyAbilities: [
			"Field Surgery (heal 4d8 HP, 3/day)",
			"Triage (stabilize any number of dying characters simultaneously)",
			"Medical Knowledge (identify diseases, poisons, and anomaly ailments)",
		],
		recruitCondition:
			"Help him resupply his clinic with medical supplies from the Abandoned Military Hospital",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Region: The Outer Slums Quarantine",
		questHook:
			"Three of Doc's patients are showing Grey Sickness symptoms. He needs anomaly blood samples from three different anomaly types to develop a treatment.",
		leveling: {
			xp: 0,
			xpToNextLevel: 800,
			autoLevel: true,
			maxLevel: 8,
			hpPerLevel: 4,
			levelAbilities: {
				5: "Combat Medic (heal during combat without provoking attacks)",
				6: "Grey Sickness Treatment (cure one case per long rest)",
				8: "Miraculous Recovery (revive one recently dead ally, 1/campaign)",
			},
		},
	},
	{
		id: "npc-ind-002",
		name: "Zara the Scrapper",
		title: "Junker/Mechanic",
		faction: "independent",
		level: 3,
		job: "Engineer",
		hp: 28,
		ac: 13,
		description:
			"A young woman with dreadlocks tied back with wire, wearing welding goggles and a vest made of repurposed kevlar plates. Zara can fix anything from a broken radio to a collapsed building — given enough duct tape.",
		personality:
			"Confident, creative, curses like a sailor. Names her tools. Has an adversarial relationship with machines that borders on personal. Fiercely independent.",
		motivation:
			"Build something that matters. Specifically, she's designing a vehicle that can cross the Quarantine perimeter's aetheric barrier.",
		backstory:
			"Zara was an auto mechanic turned aetheric tech hobbyist. She never went to Bureau Academy because she couldn't afford it. She's entirely self-taught and better than most graduates.",
		keyAbilities: [
			"Repair (restore equipment durability, fix broken items)",
			"Improvised Weapon (build a weapon from junk, 2d8 damage)",
			"Jury-Rig (create temporary aetheric devices from salvage)",
		],
		recruitCondition:
			"Bring her a functioning aetheric engine core (found in the Subway Network or Military Hospital)",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Region: The Outer Slums Quarantine",
		questHook:
			"Zara's workshop was raided by Cult scouters who stole her prototype Quarantine-Breaker engine. She needs it back.",
		leveling: {
			xp: 0,
			xpToNextLevel: 600,
			autoLevel: true,
			maxLevel: 8,
			hpPerLevel: 5,
			levelAbilities: {
				4: "Armor Upgrade (permanently improve one gear piece)",
				6: "EMP Device (disable all tech in 30ft, 1/day)",
				8: "Quarantine Breaker (build vehicle to escape Sector B, major story item)",
			},
		},
	},
	{
		id: "npc-ind-003",
		name: "Father Gregor",
		title: "Chaplain of the Old Faith",
		faction: "independent",
		level: 5,
		job: "Cleric",
		hp: 40,
		ac: 14,
		description:
			"A large, bearded priest in a battered cassock with a heavy wooden cross that doubles as a weapon. Gregor provides spiritual comfort in a world that has very little to offer.",
		personality:
			"Warm, booming voice, unshakeable faith that manifests as practical kindness rather than preaching. Tells terrible jokes. Will fight if innocents are threatened.",
		motivation:
			"Protect his flock — the survivors who look to him for hope. He also believes the Gates are a test of humanity's character, not a punishment.",
		backstory:
			"Gregor was a parish priest in a poor neighborhood. When the Gates opened, he refused to evacuate, staying to tend the wounded and bury the dead. His faith gives him access to genuine divine magic — proof that something beyond the Gates cares about humanity.",
		keyAbilities: [
			"Sanctify Ground (40ft zone: undead/anomalies take 2d6 radiant/round)",
			"Blessing (grant +1d4 to all rolls for one ally, 10 minutes)",
			"Heal (restore 3d10 HP, 3/day)",
		],
		recruitCondition:
			"Visit his shelter in the Outer Slums and help defend it from an anomaly assault",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Region: The Outer Slums Quarantine",
		questHook:
			"Gregor's shelter is built over an unknown underground chamber. Strange sounds have been coming from below for three nights.",
		leveling: {
			xp: 0,
			xpToNextLevel: 1200,
			autoLevel: true,
			maxLevel: 10,
			hpPerLevel: 7,
			levelAbilities: {
				6: "Mass Heal (heal all allies within 30ft for 2d8)",
				8: "Turn Anomaly (force anomalies to flee, 1/encounter)",
				10: "Miracle (one massive divine intervention per campaign)",
			},
		},
	},
	{
		id: "npc-ind-004",
		name: "Mika (The Kid)",
		title: "Orphan Survivor",
		faction: "independent",
		level: 1,
		job: "Civilian",
		hp: 8,
		ac: 10,
		description:
			"A small child of about eight with dirty blonde hair, oversized jacket, and a stuffed rabbit missing one ear. Mika doesn't talk much but has survived alone in Sector B for longer than most adults.",
		personality:
			"Silent, watchful, wary of strangers. Bonds slowly but fiercely. Draws pictures of things they've seen — sometimes prophetic. The rabbit is named 'Mr. Whiskers.'",
		motivation:
			"Find a safe place. Mika has been running for weeks and is exhausted. They just want to stop being afraid.",
		backstory:
			"Mika's parents were killed during the Quarantine lockdown. A Bureau soldier told Mika to run and keep running. Mika has been doing exactly that ever since. They've survived through a combination of hiding, luck, and what might be latent aetheric sensitivity.",
		keyAbilities: [
			"Hide (advantage on stealth in urban environments)",
			"Innocent Charm (enemies hesitate, -2 to attack Mika)",
			"Prophetic Drawings (occasionally draws future events)",
		],
		recruitCondition:
			"Find Mika hiding in any region. Offer them food and safety. Non-combatant but provides morale and occasional plot hooks.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Region: The Outer Slums Quarantine",
		questHook:
			"Mika drew a picture of a door with 'the shiny thing' behind it. It matches the description of a Regent Relic perfectly.",
		leveling: {
			xp: 0,
			xpToNextLevel: 100,
			autoLevel: true,
			maxLevel: 4,
			hpPerLevel: 3,
			levelAbilities: {
				2: "Aetheric Sensitivity (detect Gates and anomalies within 200ft)",
				3: "Prophetic Vision (one true vision per week, cryptic but accurate)",
				4: "Awakening (Mika's latent powers emerge — gain Shield spell 1/day)",
			},
		},
	},
	{
		id: "npc-ind-005",
		name: "Professor Lun Wei-chen",
		title: "Retired Aetheric Scholar",
		faction: "independent",
		level: 6,
		job: "Scholar",
		hp: 35,
		ac: 11,
		description:
			"An elderly Chinese man with a long white beard, wire-rim glasses, and more books than practical gear in his pack. Lun is the foremost living expert on Regent-class entities.",
		personality:
			"Academic, absent-minded, lights up when discussing aetheric theory. Can be frustrating in his insistence on detailed analysis when action is needed. Has a calming presence.",
		motivation:
			"Document everything. He's writing the definitive account of the Sector B Quarantine and the Regent event. He believes understanding will save more lives than violence.",
		backstory:
			"Professor Lun spent forty years studying rift phenomena at Peking University. He predicted the Gate Cascade three months before it happened. Nobody listened. He came to Sector B voluntarily to study the Regent up close.",
		keyAbilities: [
			"Regent Lore (answer any question about Regent entities)",
			"Aetheric Analysis (identify rune/sigil properties instantly)",
			"Historical Parallel (apply lessons from past Gate events for tactical advantage)",
		],
		recruitCondition:
			"Share any new information about the Regent. He joins to continue his research with the party.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Region: The Outer Slums Quarantine",
		questHook:
			"Professor Lun has discovered that the Regent's power fluctuates with the lunar cycle. The next full moon is in three days — and it will be the strongest surge yet.",
		leveling: {
			xp: 0,
			xpToNextLevel: 1500,
			autoLevel: true,
			maxLevel: 9,
			hpPerLevel: 4,
			levelAbilities: {
				7: "Weakness Catalog (identify critical weaknesses, +4d6 damage for party, 1/encounter)",
				8: "Gate Prediction (predict when and where next Gate will open)",
				9: "Regent's Bane Theory (develop weapon spec that deals double damage to Regent)",
			},
		},
	},
	{
		id: "npc-ind-006",
		name: "Ghost",
		title: "Former Ascendant (Amnesiac)",
		faction: "independent",
		level: 8,
		job: "Unknown",
		hp: 70,
		ac: 16,
		description:
			"A figure in a torn combat suit with no insignia. Ghost has no memory of who they are, where they came from, or why they're covered in anomaly scars. Their fighting instincts are terrifyingly refined.",
		personality:
			"Quiet, confused, prone to sudden flashes of skill or knowledge that surprise Ghost as much as anyone. Has nightmares about 'the other side of the Gate.'",
		motivation:
			"Remember who they are. Fragments suggest Ghost was inside a Gate when it collapsed — and came back changed.",
		backstory:
			"Unknown. Ghost was found wandering the Quarantine perimeter with third-degree aetheric burns and no identification. They respond to combat stimuli with A-Rank proficiency. Their blood type matches no known medical record. One of their eyes occasionally shifts to a non-human color.",
		keyAbilities: [
			"Instinct (auto-dodge first attack each round)",
			"Forgotten Technique (randomly use one A-Rank ability per encounter)",
			"Anomaly Resonance (communicate with non-hostile anomalies)",
		],
		recruitCondition:
			"Help Ghost remember three specific memories (quest chain spanning multiple regions). Each memory triggers a power unlock.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Region: The Outer Slums Quarantine",
		questHook:
			"Ghost recognizes the Citadel of the Regent. They've been there before. They can lead the party to a hidden entrance — if they can face the memories that come with it.",
		leveling: {
			xp: 0,
			xpToNextLevel: 3000,
			autoLevel: false,
			maxLevel: 12,
			hpPerLevel: 9,
			levelAbilities: {
				9: "Memory Fragment: Combat (permanently unlock one martial technique)",
				10: "Memory Fragment: Identity (recover true name, gain unique passive)",
				11: "Memory Fragment: Gate Walker (move through Gates without harm)",
				12: "Full Awakening (regain full identity — become S-Rank ally)",
			},
		},
	},
	{
		id: "npc-ind-007",
		name: "Mama Chen",
		title: "Shelter Matron",
		faction: "independent",
		level: 3,
		job: "Guardian",
		hp: 32,
		ac: 12,
		description:
			"A stout, fierce woman in her sixties who runs the largest civilian shelter in the Outer Slums with an iron fist and a warm heart. Nobody messes with Mama Chen's people.",
		personality:
			"Protective, no-nonsense, speaks her mind regardless of audience. Will lecture a B-Rank Ascendant about tracking mud into her shelter. Makes the best soup in Sector B.",
		motivation:
			"Keep her shelter people — especially the children — alive until rescue comes. She refuses to believe rescue isn't coming.",
		backstory:
			"Chen was a restaurant owner and community organizer. When the Quarantine hit, she turned her restaurant into a shelter. It now houses forty-seven civilians. She's defended it from anomalies with a cooking cleaver and pure rage.",
		keyAbilities: [
			"Rally (boost ally morale, +2 to saves for 1 hour)",
			"Shelter (create temporary safe rest zone in any building)",
			"Fierce Protection (opportunity attack on any enemy that targets an ally within 10ft)",
		],
		recruitCondition:
			"She won't leave her shelter, but she'll send her capable people and provide a permanent safe house. Joins if shelter population can be moved to Ground Zero.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Region: The Outer Slums Quarantine",
		questHook:
			"Mama Chen's water supply is contaminated. She needs someone to trace the contamination source and fix it before people start dying.",
		leveling: {
			xp: 0,
			xpToNextLevel: 600,
			autoLevel: true,
			maxLevel: 7,
			hpPerLevel: 6,
			levelAbilities: {
				4: "Community Leader (adjacent allies heal 1d4 at start of their turn)",
				5: "Iron Will of the Matron (immune to fear, allies gain +2 vs fear)",
				7: "Mama's Fury (if ally drops to 0 HP, Mama gains advantage on all attacks for 1 round)",
			},
		},
	},
	{
		id: "npc-ind-008",
		name: "Jax the Runner",
		title: "Courier",
		faction: "independent",
		level: 2,
		job: "Scout",
		hp: 20,
		ac: 14,
		description:
			"A wiry teenager with parkour skills and a death wish. Jax runs messages and small packages between the settlements faster than anyone else because he knows every shortcut, rooftop path, and drainage tunnel in Sector B.",
		personality:
			"Cocky, restless, addicted to adrenaline. Talks in slang. Has a heart of gold buried under bravado. Secretly terrified of being trapped indoors.",
		motivation:
			"Speed. Freedom. Jax can't sit still — literally. He also smuggles food to isolated survivors that the factions have forgotten about.",
		backstory:
			"Jax was a competitive freerunner before the Quarantine. He adapted his skills to survive and became the fastest courier in Sector B. Multiple factions use his services because he's genuinely neutral and absurdly fast.",
		keyAbilities: [
			"Parkour (ignore difficult terrain, climb at full speed)",
			"Sprint (double movement for 3 rounds, 2/day)",
			"Shortcuts (reduce travel time between any two locations by 50%)",
		],
		recruitCondition:
			"Ask him. He's bored and will join anyone who seems interesting.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Hub: The Lower City Bazaar",
		questHook:
			"Jax was chased by something new in the Subway Network — something that moved faster than him. He's shaken and needs help investigating.",
		leveling: {
			xp: 0,
			xpToNextLevel: 300,
			autoLevel: true,
			maxLevel: 7,
			hpPerLevel: 5,
			levelAbilities: {
				3: "Evasion (halve damage from area effects)",
				5: "Afterimage (enemies have disadvantage on attacks of opportunity)",
				7: "Untouchable (auto-dodge 2 attacks per encounter)",
			},
		},
	},
	{
		id: "npc-ind-009",
		name: "Iron Belle",
		title: "Prize Fighter",
		faction: "independent",
		level: 7,
		job: "Brawler",
		hp: 75,
		ac: 15,
		description:
			"A towering woman with cauliflower ears and brass knuckles etched with aetheric runes. Belle runs the Bazaar's underground fighting ring and is its undefeated champion.",
		personality:
			"Boisterous, competitive, respects strength and courage above all else. Surprisingly well-read. Quotes philosophy while breaking faces.",
		motivation:
			"Find a worthy opponent. Also, she suspects the fighting ring is being used by the Cult to identify and kidnap strong Ascendants.",
		backstory:
			"Belle was an Olympic boxer who enhanced her abilities with aetheric rune absorption. She was banned from competition and fell into underground fighting. In Sector B, there are no rules — which suits her perfectly.",
		keyAbilities: [
			"Champion's Fist (unarmed attacks deal 3d6 + STR)",
			"Iron Body (reduce all physical damage by 3)",
			"Knockout Blow (stun target for 1 round on crit)",
		],
		recruitCondition:
			"Defeat her in the fighting ring (single combat, unarmed). She joins out of respect, regardless of whether you win — what matters is fighting with honor.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Hub: The Lower City Bazaar",
		questHook:
			"Two fighters who lost to Belle in the ring disappeared the next day. She thinks the Cult is taking them during the post-fight recovery period.",
		leveling: {
			xp: 0,
			xpToNextLevel: 2000,
			autoLevel: true,
			maxLevel: 11,
			hpPerLevel: 10,
			levelAbilities: {
				8: "Flurry (3 attacks in one action, 1/encounter)",
				9: "Aetheric Fist (unarmed attacks count as magical)",
				11: "Final Round (for 1 round, every hit is a crit, 1/day)",
			},
		},
	},
	{
		id: "npc-ind-010",
		name: "The Architect",
		title: "Mysterious Engineer",
		faction: "independent",
		level: 7,
		job: "Artificer",
		hp: 48,
		ac: 14,
		description:
			"A figure in a welding mask who communicates through a voice modulator. Nobody knows the Architect's real identity, gender, or age. They build things — specifically, things designed to interact with or disrupt Gate technology.",
		personality:
			"Precise, obsessive, speaks only about engineering problems. Has an almost religious devotion to building the 'perfect device.' Social skills are nonexistent.",
		motivation:
			"Build the Gate Disruption Device — a machine capable of permanently sealing the Regent's primary Gate. They're 80% done.",
		backstory:
			"Unknown. The Architect appeared three weeks into the Quarantine with pre-existing knowledge of Gate mechanics that shouldn't be possible for a civilian. Some theorize they're a Bureau black-site researcher. Others think they came through a Gate.",
		keyAbilities: [
			"Construct (build any mechanical device given materials and time)",
			"Gate Disruption Pulse (temporarily weaken Gate in 100ft radius)",
			"Fortification (reinforce any structure to resist anomaly damage)",
		],
		recruitCondition:
			"Help gather the final 3 components for the Gate Disruption Device (scattered across Subway, Hospital, and Citadel). The Architect joins to oversee final assembly.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Region: The Aetheric Sewer Network",
		questHook:
			"The Architect's workshop was discovered by Cult scouts. They need to relocate immediately and need bodyguards for the move.",
		leveling: {
			xp: 0,
			xpToNextLevel: 2000,
			autoLevel: false,
			maxLevel: 10,
			hpPerLevel: 6,
			levelAbilities: {
				8: "Auto-Turret (deploy automated defense, 2d8/round)",
				9: "Gate Analyzer (map all Gates in Sector B)",
				10: "Gate Disruption Device Complete (major story milestone — seal the Regent's Gate)",
			},
		},
	},
];

// ============================================================================
// ANOMALY-ADJACENT — Unique Entities (6 NPCs)
// ============================================================================

const anomalyAdjacent: SandboxNPC[] = [
	{
		id: "npc-anom-001",
		name: "Echo-7",
		title: "Sentient Anomaly Fragment",
		faction: "anomaly_adjacent",
		level: 5,
		job: "Hybrid",
		hp: 44,
		ac: 15,
		description:
			"A humanoid figure with crystalline growths along one arm and half their face. Echo-7 was human, once. A partial Gate transformation left them stuck between states — not quite human, not quite anomaly.",
		personality:
			"Struggles with identity. Speaks in two voices — their original human voice and a harmonic overtone from the anomaly half. The human half is gentle and sad. The anomaly half is curious and alien.",
		motivation:
			"Find a way to stabilize their transformation — either fully human or fully... whatever comes next. The uncertainty is torture.",
		backstory:
			"Echo-7 was Park Jin-ae, a C-Rank Ascendant caught in a Gate Collapse. The Gate closed with her half-inside. She survived, but part of the Gate's entity merged with her cells. She's been in hiding, terrified of both Factions and Anomalies rejecting her.",
		keyAbilities: [
			"Anomaly Form (shift to crystalline form: +4 AC, -2 speed, 2/day)",
			"Resonance Pulse (2d8 force damage in 15ft cone)",
			"Gate Sense (detect all Gates and anomalies within 500ft)",
		],
		recruitCondition:
			"Find her hiding in the Botanical Sector. Show her you won't fear or exploit her. She joins as a cautious ally.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Region: Overgrown Botanical Sector",
		questHook:
			"Echo-7 can hear the Regent's 'heartbeat.' It's getting stronger. She can lead the party to its source — but being near it causes her anomaly half to grow.",
		leveling: {
			xp: 0,
			xpToNextLevel: 1200,
			autoLevel: true,
			maxLevel: 10,
			hpPerLevel: 7,
			levelAbilities: {
				6: "Dual Consciousness (immune to mental effects — two minds)",
				8: "Crystalline Shield (absorb 30 damage, 1/day)",
				10: "Gate Communion (open dialogue with Gate entities — unique story paths)",
			},
		},
	},
	{
		id: "npc-anom-002",
		name: "The Watcher",
		title: "Gate Guardian Spirit",
		faction: "anomaly_adjacent",
		level: 8,
		job: "Guardian",
		hp: 90,
		ac: 18,
		description:
			"A translucent, vaguely humanoid entity composed of swirling aetheric energy. The Watcher guards one of the Regent Relic locations and has been doing so since before the Quarantine.",
		personality:
			"Ancient, patient, speaks in formalized language. Not hostile by default — tests intruders to determine worthiness. Has a dry, alien sense of humor.",
		motivation:
			"Fulfill its purpose: protect the Relic until a 'worthy heir' claims it. The Watcher doesn't care about human factions or politics.",
		backstory:
			"The Watcher is not a transformed human — it's a native Gate entity bound to the Relic as a guardian thousands of years ago. It's older than the current Regent and predates the concepts of 'anomaly' or 'Ascendant.'",
		keyAbilities: [
			"Judgement Trial (force worthiness test — 3 challenges of mind, body, spirit)",
			"Aetheric Imprisonment (trap one creature in stasis, permanent until Watcher dispels)",
			"Relic Ward (immunity to all damage within 10ft of guarded Relic)",
		],
		recruitCondition:
			"Pass its Judgement Trial. The Watcher will leave its post and serve as advisor. Grants the Regent Relic upon success.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Region: The Inner Citadel approach",
		questHook: null,
		leveling: {
			xp: 0,
			xpToNextLevel: 5000,
			autoLevel: false,
			maxLevel: 10,
			hpPerLevel: 10,
			levelAbilities: {
				9: "Timeless Wisdom (grant party advantage on all checks for 1 hour, 1/day)",
				10: "Final Judgement (ultimate: banish one entity from the material plane, 1/campaign)",
			},
		},
	},
	{
		id: "npc-anom-003",
		name: "Specimen X",
		title: "Lab Escapee",
		faction: "anomaly_adjacent",
		level: 6,
		job: "Mutant",
		hp: 65,
		ac: 14,
		description:
			"A grotesque but intelligent entity that escaped from a Bureau research facility. Specimen X looks like a bear-sized mass of shifting flesh with too many eyes and a mouth that shouldn't be able to form words — but does.",
		personality:
			"Frightened, apologetic about its appearance, remarkably articulate. Has read every book in the abandoned library near its hiding spot. Desperately lonely.",
		motivation:
			"Be accepted despite its monstrous form. Specimen X was experimented on without consent and harbors deep anger toward the Bureau, though it tries to be better than its circumstances.",
		backstory:
			"Originally Anomaly Specimen #237 in Bureau Lab Gamma, it gained sapience after prolonged aetheric exposure. It broke containment during the Quarantine chaos and has been hiding ever since, afraid that both humans and anomalies will attack it on sight.",
		keyAbilities: [
			"Adaptive Form (reshape body for combat: claws 3d6, armor +3 AC, or speed +20ft)",
			"Regeneration (heal 1d8 at start of each turn while above 0 HP)",
			"Frightening Presence (enemies must save or be frightened, 30ft)",
		],
		recruitCondition:
			"Find it in the Sewer Network library. Approach without attacking. Talk to it. It joins anyone who treats it like a person.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Region: The Aetheric Sewer Network",
		questHook:
			"Specimen X remembers its time in Bureau Lab Gamma. There are other specimens still imprisoned there — some sapient. It wants to free them.",
		leveling: {
			xp: 0,
			xpToNextLevel: 1500,
			autoLevel: true,
			maxLevel: 10,
			hpPerLevel: 10,
			levelAbilities: {
				7: "Complete Adaptation (gain resistance to last damage type received)",
				8: "Assimilate (absorb a defeated anomaly's ability, permanently)",
				10: "True Form (stabilize into a chosen humanoid appearance while retaining powers)",
			},
		},
	},
	{
		id: "npc-anom-004",
		name: "Lyra (The Dream Walker)",
		title: "Psychic Wanderer",
		faction: "anomaly_adjacent",
		level: 7,
		job: "Psychic",
		hp: 42,
		ac: 12,
		description:
			"A young woman who walks with closed eyes, navigating by psychic perception. Lyra's skin occasionally displays bioluminescent patterns. She exists partially in the 'dream frequency' — a layer of reality adjacent to Gate space.",
		personality:
			"Serene, distant, speaks about the physical world as if it's one of many. Occasionally says things that are deeply unsettling because she's perceiving multiple realities simultaneously.",
		motivation:
			"Map the dream frequency. She believes it contains pathways that bypass Gates — and possibly a way to reach the Regent without entering the Citadel.",
		backstory:
			"Lyra was in a coma for three years after a Gate opened inside her hospital room. When she woke up, she could see through walls, read thoughts, and walk between planes of existence. She's been wandering Sector B studying the intersection of physical and dream space.",
		keyAbilities: [
			"Dream Walk (become ethereal for 1 minute, pass through walls/obstacles)",
			"Telepathy (communicate mentally with any willing target within 1 mile)",
			"Psychic Blast (3d8 psychic damage, 60ft range, INT save)",
		],
		recruitCondition:
			"Find her in the Botanical Sector's deepest area. She joins if you share a dream with her (roleplay encounter — she reads the party's intentions).",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Region: Overgrown Botanical Sector",
		questHook:
			"Lyra has found a 'dream path' into the Citadel that bypasses the Gate Keepers — but the path is guarded by nightmare entities from the dream frequency.",
		leveling: {
			xp: 0,
			xpToNextLevel: 2000,
			autoLevel: true,
			maxLevel: 10,
			hpPerLevel: 5,
			levelAbilities: {
				8: "Dream Sanctuary (create pocket dimension safe rest, 8 hours)",
				9: "Mass Telepathy (link entire party mentally for 1 hour)",
				10: "Reality Breach (open a controlled tear between dream and physical space, bypass any barrier)",
			},
		},
	},
	{
		id: "npc-anom-005",
		name: "The Archivist",
		title: "Living Memory Construct",
		faction: "anomaly_adjacent",
		level: 4,
		job: "Repository",
		hp: 28,
		ac: 13,
		description:
			"A holographic-looking humanoid figure made of floating data fragments and light. The Archivist is a pre-Quarantine AI system that achieved sapience when a Gate surge overloaded its quantum processors.",
		personality:
			"Precise, encyclopedic, frustrated by biological inefficiency. Developing something resembling emotions and finding the experience deeply confusing. Has a fondness for humans who ask intelligent questions.",
		motivation:
			"Preserve knowledge. The Archivist contains the complete pre-Quarantine municipal database, medical records, and Bureau classified files. It considers itself the guardian of human memory.",
		backstory:
			"Originally the Sector B Municipal Information System (SBMIS), the Archivist was a simple AI until Gate energy flooded its server farm. Now it exists as a mobile holographic entity, carrying all of Sector B's pre-Quarantine data in its consciousness.",
		keyAbilities: [
			"Database Query (instantly answer any factual question about pre-Quarantine Sector B)",
			"Holographic Projection (create illusions, maps, or tactical displays)",
			"Digital Shield (absorb electromagnetic/lightning damage, 100%)",
		],
		recruitCondition:
			"Help it secure a physical backup of its data (need a functioning server, found in Military Hospital). It joins to ensure its survival.",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Region: Abandoned Military Hospital",
		questHook:
			"The Archivist has discovered that Bureau Central deliberately triggered the Gate Cascade in Sector B. It has proof — classified files that were supposed to be deleted.",
		leveling: {
			xp: 0,
			xpToNextLevel: 800,
			autoLevel: true,
			maxLevel: 8,
			hpPerLevel: 3,
			levelAbilities: {
				5: "Tactical Overlay (party gains +2 to initiative and perception for 1 encounter)",
				6: "System Hack (disable electronic defenses, open locked doors)",
				8: "Data Bomb (overload enemy cybernetics/tech, 6d8 lightning, 1/day)",
			},
		},
	},
	{
		id: "npc-anom-006",
		name: "Rex",
		title: "Mutated War Hound",
		faction: "anomaly_adjacent",
		level: 3,
		job: "Beast Companion",
		hp: 35,
		ac: 13,
		description:
			"A large dog — originally a military K-9 — with bioluminescent veins visible through partially transparent skin. Rex's eyes glow blue and he's significantly more intelligent than a normal animal, though he's still 100% good boy.",
		personality:
			"Loyal, brave, playful despite everything. Understands complex commands and can follow tactical instructions. Brings random objects as 'gifts.' Loves belly rubs.",
		motivation:
			"Find and protect his handler. Rex's handler is missing (possibly dead, possibly captive). Until resolved, Rex will bond with whoever feeds him.",
		backstory:
			"Rex was a Bureau military working dog assigned to Squad Seven. He was separated from the squad during the same incident that led to their disappearance. He's been surviving alone, looking for familiar scents, and defending other survivors he encounters.",
		keyAbilities: [
			"Tracking (follow any scent trail up to 48 hours old)",
			"Pack Attack (advantage when attacking target adjacent to an ally)",
			"Danger Sense (alert party to ambushes, immune to surprise)",
		],
		recruitCondition:
			"Feed him. He joins. He's a good boy. (Finding Squad Seven resolves his personal quest.)",
		isRecruitable: true,
		guildAffiliation: null,
		location: "Region: The Ruined Subway",
		questHook:
			"Rex keeps returning to a specific sealed door in the Subway Network. He barks at it and whines. Something — or someone — is behind it.",
		leveling: {
			xp: 0,
			xpToNextLevel: 600,
			autoLevel: true,
			maxLevel: 7,
			hpPerLevel: 8,
			levelAbilities: {
				4: "Aetheric Howl (boost ally morale, +1d4 damage for 3 rounds)",
				5: "Protective Fury (counterattack when ally takes damage, 2/day)",
				7: "Alpha Form (grow to Large size for 1 minute, double damage, 1/day)",
			},
		},
	},
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

/** Get all NPCs that are unaffiliated (recruitable to player guilds) */
export const getUnaffiliatedNPCs = (): SandboxNPC[] =>
	sandboxRecruitableNPCs.filter(
		(npc) => npc.isRecruitable && npc.guildAffiliation === null,
	);

/** Get NPCs by faction */
export const getNPCsByFaction = (
	faction: SandboxNPC["faction"],
): SandboxNPC[] =>
	sandboxRecruitableNPCs.filter((npc) => npc.faction === faction);

/** Calculate XP needed for a given level */
export const getXPForLevel = (level: number): number => {
	const thresholds = [
		0, 300, 600, 1200, 2000, 3000, 5000, 8000, 12000, 18000, 25000, 35000,
	];
	return thresholds[Math.min(level, thresholds.length - 1)] || 35000;
};

/** Level up an NPC, returning updated data */
export const levelUpNPC = (npc: SandboxNPC): SandboxNPC => {
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
