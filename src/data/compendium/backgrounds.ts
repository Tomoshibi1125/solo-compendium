// Backgrounds Compendium - Authoritative PDF Content
// Extracted from internal compendium data pack
// This is the authoritative source for backgrounds data - FULL ADMIN PRIVILEGES INTEGRATION
// Generated on: 2026-01-13T22:03:39.609Z
// 22 Backgrounds from System Ascendant Canon

export interface Background {
	id: string;
	name: string;
	type: string;
	rank: "D" | "C" | "B" | "A" | "S";
	// System Ascendant background features
	skill_proficiencies: string[];
	toolProficiencies?: string[];
	languages?: string[];
	equipment: string[];
	features: {
		name: string;
		description: string;
	}[];
	personalityTraits?: string[];
	ideals?: string[];
	bonds?: string[];
	flaws?: string[];
	// System Ascendant specific
	image: string;
	description: string;
	dangers: string[];
	abilities?: string[];
	// Additional properties
	source?: string;
	suggestedCharacteristics?: {
		personality?: string[];
		ideal?: string[];
		bond?: string[];
		flaw?: string[];
	};
	// Legacy properties for backward compatibility
	skills?: string[];
}

export const backgrounds = [
	{
		id: "umbral-realm-exile",
		name: "Binary Void-Data Realm Exile",
		type: "Background",
		rank: "C",
		skill_proficiencies: ["Stealth", "Perception", "Survival", "Arcana"],
		tool_proficiencies: ["Thieves' Tools"],
		languages: ["English", "Binary Void-Data"],
		equipment: [
			"A set of dark clothes",
			"A umbral-infused dagger",
			"A small pouch containing 10 Credits",
			"A memento from the abyssal realm",
			"Thieves' tools",
		],
		features: [
			{
				name: "Umbral Affinity",
				description:
					"You have advantage on saving throws against being frightened and can see in dim light within 60 feet as if it were bright light.",
			},
			{
				name: "Dimensional Awareness",
				description:
					"You can sense the presence of dimensional portals within 300 feet and know their general direction.",
			},
			{
				name: "Essence Sensitivity",
				description:
					"You can detect the presence of magical essence in creatures and objects, allowing you to identify magical items without using a spell.",
			},
		],
		personalityTraits: [
			"I am constantly looking over my shoulder, expecting danger from the umbrals.",
			"I speak in whispers and avoid drawing attention to myself.",
			"I trust no one completely, having learned betrayal in the abyssal realm.",
			"I am fascinated by umbrals and darkness, finding comfort in them.",
		],
		ideals: [
			"Survival. I will do whatever it takes to survive, no matter the cost. (Neutral)",
			"Freedom. No one should be trapped between worlds as I was. (Chaotic)",
			"Power. The umbrals taught me that only the strong survive. (Evil)",
			"Knowledge. I seek to understand the mysteries of the abyssal realm. (Neutral)",
		],
		bonds: [
			"I will protect anyone who is trapped between worlds.",
			"I seek revenge on those who exiled me to the abyssal realm.",
			"I have a family member still trapped in the abyssal realm.",
			"I owe my life to someone who helped me escape.",
		],
		flaws: [
			"I am paranoid and see threats everywhere.",
			"I have nightmares about the abyssal realm that affect my judgment.",
			"I trust umbrals more than people.",
			"I am willing to sacrifice others for my own survival.",
		],
		image: "/generated/compendium/backgrounds/umbral-realm-exile.webp",
		description:
			"Background as a Binary Void-Data Realm Exile from System Ascendant, with unique experiences and abilities.",
		dangers: [
			"Post-Traumatic Stress",
			"Dimensional Instability",
			"Rift Attraction",
			"Memory Loss",
		],
		abilities: [
			"Enhanced Umbral Resistance",
			"Dimensional Awareness",
			"Umbral Affinity",
			"Essence Sensitivity",
		],
		source: "System Ascendant Canon",
	},
	{
		id: "gate-survivor",
		name: "Rift Survivor",
		type: "Background",
		rank: "S",
		skill_proficiencies: ["Survival", "Perception"],
		tool_proficiencies: ["Herbalism Kit"],
		languages: ["English", "Proto-Indo-European"],
		equipment: [
			"A jagged shard of rift crystal",
			"A set of tattered but serviceable clothes",
			"A healer's kit",
			"A small pouch containing 15 Credits",
			"Herbalism kit",
		],
		features: [
			{
				name: "Rift Sense",
				description:
					"You can feel vibrations that precede a dimensional rift opening. You have advantage on Wisdom (Perception) checks to detect planar disturbances, and you can sense when a rift will open within 1 mile up to 10 minutes before it manifests.",
			},
			{
				name: "Survivor's Fortitude",
				description:
					"Having endured the raw energy of a rift collapse, your body has adapted. You have resistance to force damage from dimensional sources, and you have advantage on death saving throws when within 60 feet of an active rift.",
			},
		],
		personalityTraits: [
			"I compulsively count exits and escape routes in every room I enter.",
			"I flinch at sudden bursts of light or energy—they remind me of the rift.",
			"I carry a keepsake from someone who didn't survive the rift event.",
			"I am eerily calm in disasters; I've already survived the worst.",
		],
		ideals: [
			"Preparedness. I will never be caught off guard again. (Lawful)",
			"Sacrifice. Those who survive owe a debt to those who didn't. (Good)",
			"Resilience. What doesn't kill you makes you stronger—literally. (Neutral)",
			"Revenge. I will find whatever caused the rift and destroy it. (Chaotic)",
		],
		bonds: [
			"I carry the names of everyone who died in the rift event, etched into my armor.",
			"A fellow survivor saved my life, and I will repay that debt.",
			"The rift took my home; I seek a new place to belong.",
			"I saw something inside the rift—something that's still looking for me.",
		],
		flaws: [
			"I freeze up when I hear the sound of tearing reality.",
			"I push people away because everyone I've been close to has died.",
			"I take unnecessary risks because I feel I should have died in the rift.",
			"I hoard supplies obsessively, terrified of being unprepared.",
		],
		description:
			"You survived a catastrophic rift event that claimed the lives of countless others. The raw dimensional energy seared your body and mind, but you emerged changed—tougher, sharper, and haunted by the screams of those who weren't so fortunate.",
		dangers: [
			"Post-Traumatic Stress",
			"Dimensional Instability",
			"Rift Attraction",
			"Survivor's Guilt",
		],
		image: "/generated/compendium/backgrounds/gate-survivor.webp",
		source: "System Ascendant Canon",
	},
	{
		id: "ascendant-academy-graduate",
		name: "Ascendant Academy Graduate",
		type: "Background",
		rank: "C",
		skill_proficiencies: ["Investigation", "Arcana"],
		tool_proficiencies: ["Cartographer's Tools"],
		languages: ["English", "Ancient Hebrew"],
		equipment: [
			"Academy uniform (fine clothes)",
			"Academy signet ring",
			"Cartographer's tools",
			"A textbook on dimensional theory",
			"A small pouch containing 15 Credits",
		],
		features: [
			{
				name: "Academy Credentials",
				description:
					"You can gain access to ascendant organizations, libraries, and restricted archives by presenting your academy credentials. Fellow graduates offer you lodging and aid, and officials of ascendant guilds treat you with professional respect.",
			},
			{
				name: "Theoretical Framework",
				description:
					"Your academic training allows you to identify rift types, monster classifications, and dimensional anomalies. You have advantage on Intelligence checks to recall lore about rifts, gates, and dimensional entities.",
			},
		],
		personalityTraits: [
			"I quote academy texts and instructors whenever the opportunity arises.",
			"I approach every problem methodically, as if writing a thesis.",
			"I'm competitive with other ascendants—my academy ranking still matters to me.",
			"I keep meticulous notes on everything I observe in the field.",
		],
		ideals: [
			"Knowledge. Understanding the system is the key to mastering it. (Neutral)",
			"Duty. The Academy trained me to protect the world, and I will. (Lawful)",
			"Excellence. I will prove I am the best graduate of my class. (Any)",
			"Innovation. Textbook methods aren't enough—we need new approaches. (Chaotic)",
		],
		bonds: [
			"My academy mentor believed in me when no one else did.",
			"I made a promise to my graduating class to make a difference.",
			"The Academy library holds secrets I haven't yet uncovered.",
			"A fellow graduate went missing on their first mission—I will find them.",
		],
		flaws: [
			"I look down on self-taught ascendants as undisciplined amateurs.",
			"I overthink situations instead of acting on instinct.",
			"I can't resist showing off my knowledge, even when it's inappropriate.",
			"I was sheltered at the academy and sometimes misjudge real-world dangers.",
		],
		description:
			"You graduated from the prestigious Ascendant Academy, receiving formal training in combat, magic, and dimensional theory. The Academy's rigorous curriculum covered rift classification, monster taxonomy, essence manipulation, and tactical coordination.",
		dangers: [
			"Academic Rivals",
			"Organization Politics",
			"High Expectations",
			"Standardized Thinking",
		],
		image: "/generated/compendium/backgrounds/ascendant-academy-graduate.webp",
		source: "System Ascendant Canon",
	},
	{
		id: "guild-master",
		name: "Guild Master",
		type: "Background",
		rank: "C",
		skill_proficiencies: ["Persuasion", "Insight"],
		tool_proficiencies: ["Gaming Set (one of your choice)"],
		languages: ["English", "Russian"],
		equipment: [
			"A guild master's signet ring",
			"Fine clothes",
			"A ledger of guild accounts",
			"A gaming set",
			"A belt pouch containing 25 Credits",
		],
		features: [
			{
				name: "Guild Authority",
				description:
					"You can leverage your reputation as a guild leader to requisition supplies, recruit temporary help from ascendant guilds, and negotiate favorable contracts. Guild members and merchants in ascendant districts recognize your authority.",
			},
			{
				name: "Strategic Command",
				description:
					"Once per long rest, you can spend 10 minutes briefing your allies on a battle plan, granting each participating ally a +1 bonus to initiative rolls for the next encounter.",
			},
		],
		personalityTraits: [
			"I evaluate everyone I meet as a potential recruit or rival.",
			"I delegate tasks naturally and expect my orders to be followed.",
			"I keep track of favors—both owed and owing.",
			"I have a story about 'how we used to do things in my guild' for every situation.",
		],
		ideals: [
			"Leadership. A good leader serves their people, not the other way around. (Good)",
			"Profit. Resources win wars—I make sure we have plenty. (Neutral)",
			"Order. Structure and discipline keep people alive. (Lawful)",
			"Ambition. My guild was just the beginning of something greater. (Any)",
		],
		bonds: [
			"My former guild members still look to me for guidance.",
			"I disbanded my guild after a disastrous rift raid—I carry that weight.",
			"A rival guild master betrayed me, and I will settle that score.",
			"I promised my guild's founder I would uphold their legacy.",
		],
		flaws: [
			"I have difficulty taking orders from others.",
			"I micromanage everything and everyone around me.",
			"I invested everything in my guild and lost it—I'm rebuilding from nothing.",
			"I judge people by their usefulness and discard those who aren't productive.",
		],
		description:
			"You have led or managed an ascendant guild, taking responsibility for organizing raids, managing resources, and training new ascendants. You've balanced budgets, mediated disputes, and sent people into rifts knowing some might not return.",
		dangers: [
			"Guild Politics",
			"Resource Shortages",
			"Member Disputes",
			"Reputation Risks",
		],
		image: "/generated/compendium/backgrounds/guild-master.webp",
		source: "System Ascendant Canon",
	},
	{
		id: "dimensional-traveler",
		name: "Dimensional Traveler",
		type: "Background",
		rank: "B",
		skill_proficiencies: ["Arcana", "Survival"],
		tool_proficiencies: ["Navigator's Tools"],
		languages: ["English", "Quantum Resonance"],
		equipment: [
			"A set of traveler's clothes",
			"Navigator's tools",
			"A fragment of another dimension",
			"A journal of dimensional coordinates",
			"A belt pouch containing 10 Credits",
		],
		features: [
			{
				name: "Planar Pathfinder",
				description:
					"You have an innate sense of direction that works across dimensions. You cannot become lost by non-magical means while traveling between planes, and you have advantage on Wisdom (Survival) checks to navigate within rifts or pocket dimensions.",
			},
			{
				name: "Dimensional Adaptation",
				description:
					"Your body has adapted to the stresses of dimensional travel. You are immune to the disorientation effects of planar transitions and have advantage on Constitution saving throws against environmental hazards caused by dimensional instability.",
			},
		],
		personalityTraits: [
			"I compare everything to places I've visited in other dimensions.",
			"I have an unsettling habit of knowing things about places I've never been.",
			"I collect small trinkets from every dimension I visit.",
			"I am remarkably unfazed by bizarre or alien phenomena.",
		],
		ideals: [
			"Discovery. There are infinite dimensions to explore, and I intend to see them all. (Chaotic)",
			"Balance. The dimensions must remain separate and stable. (Lawful)",
			"Wonder. Every new world is a gift to be cherished. (Good)",
			"Power. Each dimension holds secrets that can make me stronger. (Evil)",
		],
		bonds: [
			"I left part of myself in another dimension—literally or figuratively.",
			"A guide helped me navigate my first dimensional crossing; I owe them everything.",
			"I discovered a dimension in peril and feel compelled to save it.",
			"Something followed me back from a dimension, and I must deal with it.",
		],
		flaws: [
			"I sometimes forget which dimension I'm currently in.",
			"I have trouble forming attachments because I always want to move on.",
			"Dimensional travel has made me age unevenly—sometimes I lose time.",
			"I'm addicted to the sensation of crossing between worlds.",
		],
		description:
			"You have journeyed between dimensions, either by choice or necessity. You've seen worlds of fire and worlds of crystal silence. These experiences have given you a unique perspective on reality and the ability to navigate the spaces between worlds.",
		dangers: [
			"Dimensional Sickness",
			"Reality Drift",
			"Entity Attention",
			"Memory Fragmentation",
		],
		image: "/generated/compendium/backgrounds/dimensional-traveler.webp",
		source: "System Ascendant Canon",
	},
	{
		id: "essence-user",
		name: "Essence User",
		type: "Background",
		rank: "B",
		skill_proficiencies: ["Arcana", "Insight"],
		tool_proficiencies: ["Alchemist's Supplies"],
		languages: ["English", "Finnish"],
		equipment: [
			"A set of common clothes with essence-stained cuffs",
			"Alchemist's supplies",
			"An essence focus crystal",
			"A vial of concentrated essence (non-magical)",
			"A belt pouch containing 10 Credits",
		],
		features: [
			{
				name: "Essence Sensitivity",
				description:
					"You can feel the flow of magical essence in your environment. You can detect the presence of magical essence in creatures and objects within 30 feet, allowing you to identify magical items and sense spellcasting without using a spell.",
			},
			{
				name: "Raw Channeling",
				description:
					"Your body naturally draws in ambient essence. Once per long rest, when you finish a short rest in an area with high magical energy (near rifts, ley lines, or powerful artifacts), you regain one expended spell slot of 1st level.",
			},
		],
		personalityTraits: [
			"My eyes glow faintly when I'm concentrating on essence flows.",
			"I instinctively reach out to touch magical objects, feeling their resonance.",
			"I speak about essence as though it were alive—because to me, it is.",
			"I am deeply uncomfortable in areas devoid of magical energy.",
		],
		ideals: [
			"Harmony. Essence flows through all things; I seek to align with it. (Good)",
			"Mastery. Raw talent means nothing without discipline and control. (Lawful)",
			"Freedom. Essence should flow freely, not be bottled and sold. (Chaotic)",
			"Power. I was born with this gift, and I will use it to its fullest. (Neutral)",
		],
		bonds: [
			"My mentor helped me control my abilities before they destroyed me.",
			"I accidentally hurt someone with uncontrolled essence—I will make amends.",
			"An organization wants to study me; I must stay one step ahead.",
			"The source of my essence sensitivity holds answers I need.",
		],
		flaws: [
			"I sometimes lose control of my essence manipulation when emotional.",
			"I'm arrogant about my natural talent compared to trained mages.",
			"I crave magical energy and sometimes take risks to be near it.",
			"I underestimate conventional (non-magical) threats.",
		],
		description:
			"You possess the rare ability to manipulate essence directly, without the need for complex spells or rituals. This natural talent makes you exceptionally powerful but also draws dangerous attention from those who would exploit or study your gift.",
		dangers: [
			"Essence Overload",
			"Regent Attention",
			"Power Corruption",
			"Essence Addiction",
		],
		image: "/generated/compendium/backgrounds/essence-user.webp",
		source: "System Ascendant Canon",
	},
	{
		id: "regent's-chosen",
		name: "Regent's Chosen",
		type: "Background",
		rank: "B",
		skill_proficiencies: ["Intimidation", "Arcana"],
		tool_proficiencies: ["Poisoner's Kit"],
		languages: ["English", "Sumerian Protocols"],
		equipment: [
			"A dark cloak bearing your regent's sigil",
			"A set of fine clothes",
			"A poisoner's kit",
			"A sealed letter of authority from your regent",
			"A belt pouch containing 20 Credits",
		],
		features: [
			{
				name: "Regent's Mark",
				description:
					"You bear the invisible mark of a regent—a being of immense dimensional power. You have advantage on Charisma (Intimidation) checks against creatures of lower rank than your regent, and creatures that serve your regent will not attack you unless provoked.",
			},
			{
				name: "Umbral Communion",
				description:
					"Once per long rest, you can meditate for 10 minutes to receive a cryptic vision or sensation from your regent's domain. The Protocol Warden (PW) determines the nature of the communication.",
			},
		],
		personalityTraits: [
			"I speak of my regent with a mixture of reverence and fear.",
			"I carry myself with authority that I know is borrowed power.",
			"I test everyone I meet to determine their loyalty and usefulness.",
			"I am haunted by the things my regent has shown me.",
		],
		ideals: [
			"Loyalty. My regent chose me for a reason; I will not fail them. (Lawful)",
			"Power. My regent's power flows through me, and I will wield it. (Evil)",
			"Independence. I serve my regent, but I am not their puppet. (Chaotic)",
			"Understanding. I must learn why I was chosen to fulfill my purpose. (Neutral)",
		],
		bonds: [
			"My regent saved my life, and I have pledged my service in return.",
			"I have a rival—another chosen servant of a different regent.",
			"My family doesn't know about my connection to the regent.",
			"I am searching for something my regent lost or desires.",
		],
		flaws: [
			"I sometimes act on my regent's commands without questioning their morality.",
			"I am paranoid that my regent will abandon me if I fail.",
			"The mark of the regent is slowly changing me, and I'm afraid of what I'm becoming.",
			"I look down on the unchosen as lesser beings.",
		],
		description:
			"You have been selected by a regent—one of the immensely powerful dimensional entities that rule vast umbral domains. This connection grants you a fragment of their authority and insight, but it comes with expectations and obligations that weigh heavily on your soul.",
		dangers: [
			"Regent Control",
			"Rival Assassination",
			"Umbral Corruption",
			"Obligation Binding",
		],
		image: "/generated/compendium/backgrounds/regents-chosen.webp",
		source: "System Ascendant Canon",
	},
	{
		id: "umbral-soldier",
		name: "Umbral Legionnaire",
		type: "Background",
		rank: "D",
		skill_proficiencies: ["Athletics", "Intimidation"],
		tool_proficiencies: ["Smith's Tools"],
		languages: ["English"],
		equipment: [
			"A legionnaire's tabard (dark purple and black)",
			"A set of common clothes",
			"Smith's tools",
			"A rank insignia badge",
			"A belt pouch containing 10 Credits",
		],
		features: [
			{
				name: "Legion Discipline",
				description:
					"When you are within 5 feet of an ally, you have advantage on saving throws against being frightened. You can use a bonus action to grant an adjacent ally +2 to their AC against the next attack that targets them before your next turn.",
			},
			{
				name: "Umbral March",
				description:
					"You can march for up to 12 hours before suffering exhaustion, and you have advantage on Constitution saving throws against forced marches and extreme weather.",
			},
		],
		personalityTraits: [
			"I stand at attention when addressed by authority figures.",
			"I eat quickly and efficiently—old habits from the mess hall.",
			"I unconsciously form tactical assessments of every room I enter.",
			"I use military jargon and speak in clipped, efficient sentences.",
		],
		ideals: [
			"Duty. Orders exist for a reason—follow them. (Lawful)",
			"Comradeship. The soldier next to you is more important than the mission. (Good)",
			"Survival. The mission is what matters, not the cost. (Neutral)",
			"Glory. I fight to be remembered, to make my name legendary. (Any)",
		],
		bonds: [
			"I lost my entire squad in a rift operation—I carry their dog tags.",
			"My commanding officer gave me a chance when no one else would.",
			"I deserted the legion and must avoid those who would bring me back.",
			"I made a vow to my fallen comrades that I would see the war through.",
		],
		flaws: [
			"I follow orders without question, even when I shouldn't.",
			"I have nightmares about battles I've fought and comrades I've lost.",
			"I'm uncomfortable making decisions for myself.",
			"I solve problems with violence before considering other options.",
		],
		description:
			"You served as a legionnaire in the umbral legions, the disciplined military force that fights to hold the line against dimensional incursions. Your combat experience is extensive and you understand the art of warfare better than most.",
		dangers: [
			"Battle Trauma",
			"Enemy Vendettas",
			"Combat Addiction",
			"Umbral Corruption",
		],
		image: "/generated/compendium/backgrounds/umbral-soldier.webp",
		source: "System Ascendant Canon",
	},
	{
		id: "rune-master",
		name: "Rune Master",
		type: "Background",
		rank: "B",
		skill_proficiencies: ["Arcana", "History"],
		tool_proficiencies: ["Calligrapher's Supplies", "Jeweler's Tools"],
		languages: ["English", "Old Norse"],
		equipment: [
			"Calligrapher's supplies",
			"Jeweler's tools",
			"A set of scholar's clothes",
			"A rune reference codex",
			"A belt pouch containing 15 Credits",
		],
		features: [
			{
				name: "Rune Lore",
				description:
					"You can identify and read runic inscriptions of any origin. When you encounter a rune, you automatically know its school of magic and general purpose. You have advantage on Intelligence (Arcana) checks to understand, activate, or disable runic traps and enchantments.",
			},
			{
				name: "Master Inscriber",
				description:
					"During a long rest, you can inscribe a temporary protective rune on a surface or object. The rune lasts for 24 hours and provides one effect: a faint alarm when a creature passes within 10 feet, dim light in a 5-foot radius, or resistance to one damage type for the first attack.",
			},
		],
		personalityTraits: [
			"I absentmindedly trace runic symbols on surfaces with my finger.",
			"I examine every magical inscription I encounter, even in dangerous situations.",
			"I speak reverently about the ancient rune-smiths who created the first inscriptions.",
			"I become frustrated when people treat rune craft as simple enchanting.",
		],
		ideals: [
			"Preservation. Runic knowledge must be preserved for future generations. (Lawful)",
			"Discovery. Ancient runes hold secrets that could change the world. (Neutral)",
			"Sharing. Knowledge hoarded is knowledge wasted—I teach freely. (Good)",
			"Mastery. I will craft runes more powerful than any before. (Any)",
		],
		bonds: [
			"I am searching for a legendary rune said to grant dominion over a specific element.",
			"My master died before passing on their final secret—I must uncover it myself.",
			"A rune I inscribed malfunctioned and caused great harm; I seek to atone.",
			"I possess a rune codex that others would kill to obtain.",
		],
		flaws: [
			"I become obsessive when studying new runes, ignoring everything else.",
			"I'm possessive of rare runic knowledge and reluctant to share.",
			"I underestimate the danger of ancient runes, assuming I can handle anything.",
			"I've developed a dependence on rune-enhanced items and feel vulnerable without them.",
		],
		description:
			"You have mastered the ancient art of rune crafting, able to inscribe magical symbols that produce powerful effects. Your knowledge of runes makes you invaluable for enchantment and protection work.",
		dangers: [
			"Rune Backlash",
			"Ancient Curses",
			"Knowledge Theft",
			"Rune Addiction",
		],
		image: "/generated/compendium/backgrounds/rune-master.webp",
		source: "System Ascendant Canon",
	},
	{
		id: "artifact-keeper",
		name: "Artifact Keeper",
		type: "Background",
		rank: "S",
		skill_proficiencies: ["Arcana", "History"],
		tool_proficiencies: ["Tinker's Tools"],
		languages: ["English", "Latin Archival"],
		equipment: [
			"A set of scholar's clothes",
			"Tinker's tools",
			"A leather-bound artifact registry",
			"Protective gloves woven with containment sigils",
			"A belt pouch containing 15 Credits",
		],
		features: [
			{
				name: "Artifact Attunement",
				description:
					"Your long exposure to magical artifacts has made you sensitive to their auras. You can determine whether an object is magical by handling it for 1 minute (no spell required). You also have advantage on Intelligence checks to identify the properties and history of magical items.",
			},
			{
				name: "Containment Protocols",
				description:
					"You know the proper procedures for safely handling dangerous magical items. You have advantage on saving throws against cursed items, and when you attune to a cursed item, you become aware of the curse before it fully takes effect.",
			},
		],
		personalityTraits: [
			"I handle all objects—magical or not—with extreme care and reverence.",
			"I catalog everything obsessively, cross-referencing properties and histories.",
			"I get visibly distressed when someone mishandles a magical item.",
			"I speak about artifacts as if they have feelings and personalities.",
		],
		ideals: [
			"Stewardship. These artifacts are not ours to own—we merely protect them. (Good)",
			"Knowledge. Every artifact tells a story that must be understood. (Neutral)",
			"Security. Dangerous artifacts must be locked away from those who would misuse them. (Lawful)",
			"Power. The most powerful artifacts should be wielded, not hidden. (Evil)",
		],
		bonds: [
			"I am the last keeper of a collection that must never fall into the wrong hands.",
			"An artifact I was guarding was stolen, and I must recover it.",
			"My predecessor entrusted me with a secret about one of the artifacts.",
			"A particular artifact speaks to me in dreams.",
		],
		flaws: [
			"I trust artifacts more than people—they're more predictable.",
			"I am tempted to use the artifacts I'm supposed to merely protect.",
			"I struggle to let go of items, even mundane ones.",
			"I am rigid about protocols and become unreasonable when others don't follow them.",
		],
		description:
			"You have been entrusted with the care and protection of powerful magical artifacts—relics of fallen civilizations, weapons of legendary heroes, and objects of terrible purpose. This sacred responsibility has given you deep knowledge of ancient items and the dangers they possess.",
		dangers: [
			"Artifact Corruption",
			"Threat Attraction",
			"Responsibility Burden",
			"Item Bonding",
		],
		image: "/generated/compendium/backgrounds/artifact-keeper.webp",
		source: "System Ascendant Canon",
	},
	{
		id: "dragon-slayer",
		name: "Dragon Slayer",
		type: "Background",
		rank: "A",
		skill_proficiencies: ["Athletics", "Nature"],
		tool_proficiencies: ["Leatherworker's Tools"],
		languages: ["English", "Latin Archival"],
		equipment: [
			"A trophy from a slain dragon (scale, tooth, or claw)",
			"Leatherworker's tools",
			"A set of traveler's clothes",
			"A hunting journal with dragon weaknesses annotated",
			"A belt pouch containing 15 Credits",
		],
		features: [
			{
				name: "Dragon Sense",
				description:
					"You can identify dragon species by their tracks, lairs, or territorial markings. You have advantage on Wisdom (Survival) checks to track dragons and on Intelligence (Nature) checks to recall information about draconic creatures.",
			},
			{
				name: "Slayer's Reputation",
				description:
					"Common folk in settlements threatened by dragons treat you as a hero and offer free lodging and supplies. However, draconic creatures and their servants can sense your slayer's intent and may react with hostility.",
			},
		],
		personalityTraits: [
			"I speak of my kills in reverent detail—every scar tells a story.",
			"I instinctively look up and scan the sky when I'm in open terrain.",
			"I am calm and methodical in combat—panic is what gets you killed.",
			"I collect dragon parts and know the value of every scale and bone.",
		],
		ideals: [
			"Protection. I slay dragons to protect the people who cannot protect themselves. (Good)",
			"Challenge. The hunt is what gives life meaning—I seek the greatest prey. (Chaotic)",
			"Balance. Dragons are part of the natural order; I only kill those that threaten it. (Neutral)",
			"Glory. I want my name whispered with fear by every dragon alive. (Any)",
		],
		bonds: [
			"I hunt in honor of a loved one who was killed by a dragon.",
			"A dragon spared my life once—I need to understand why.",
			"I belong to a brotherhood of slayers bound by oath and tradition.",
			"I carry a weapon forged from dragon bone that was passed down to me.",
		],
		flaws: [
			"I am overconfident when facing draconic creatures.",
			"I see draconic corruption everywhere and can be paranoid about it.",
			"I disregard other threats as trivial compared to dragons.",
			"The thrill of the hunt has become an obsession I cannot control.",
		],
		description:
			"You have successfully hunted and killed dragons—among the most feared entities that emerge from high-rank rifts. These legendary feats earned you both respect and enmity. You know where to strike, when to dodge, and how to use a dragon's own elemental fury against it.",
		dangers: [
			"Dragon Vendettas",
			"Power Attraction",
			"Slayer Addiction",
			"Latin Archival Corruption",
		],
		image: "/generated/compendium/backgrounds/dragon-slayer.webp",
		source: "System Ascendant Canon",
	},
	{
		id: "demon-ascendant",
		name: "Demon Slayer",
		type: "Background",
		rank: "D",
		skill_proficiencies: ["Religion", "Insight"],
		tool_proficiencies: ["Herbalism Kit"],
		languages: ["English", "Binary Void-Data"],
		equipment: [
			"A set of dark religious vestments",
			"A vial of holy water",
			"A silver holy symbol",
			"A journal of demon true names (partial)",
			"A belt pouch containing 10 Credits",
		],
		features: [
			{
				name: "Demon Lore",
				description:
					"You can identify demon types by their physical manifestations, auras, or the corruption they leave behind. You have advantage on Intelligence (Religion) checks related to demons, fiends, and abyssal entities.",
			},
			{
				name: "Warding Knowledge",
				description:
					"During a short or long rest, you can inscribe a protective circle that covers a 10-foot radius. Fiends have disadvantage on attack rolls against creatures within the circle. The ward lasts until you move or until 8 hours pass.",
			},
		],
		personalityTraits: [
			"I pray before every battle—habit from years of fighting fiends.",
			"I examine people's eyes when I meet them, looking for signs of corruption.",
			"I carry blessed salt and scatter it on thresholds without thinking.",
			"I speak bluntly about evil—I've seen too much to sugarcoat anything.",
		],
		ideals: [
			"Purification. Demonic taint must be cleansed wherever it is found. (Good)",
			"Vigilance. Evil never rests, and neither can those who fight it. (Lawful)",
			"Knowledge. Understanding your enemy is the first step to destroying them. (Neutral)",
			"Vengeance. The demons took something from me, and I will repay them in kind. (Chaotic)",
		],
		bonds: [
			"A demon killed someone I loved, and I hunt their kind in memory of that person.",
			"My order of demon ascendants was destroyed, and I am the last surviving member.",
			"I know the true name of a powerful demon and it knows I know.",
			"I was briefly possessed by a demon—its whispers still echo in my mind.",
		],
		flaws: [
			"I see demonic influence behind every misfortune and act of cruelty.",
			"I am ruthless in pursuit of demons, sometimes harming innocents in the crossfire.",
			"The horrors I've witnessed have made me cold and distant.",
			"I struggle to trust anyone, fearing they might be a demon in disguise.",
		],
		description:
			"You specialize in hunting demonic entities, understanding their nature and knowing how to banish them permanently. Your expertise makes you the first line of defense against demonic incursions, but the work takes its toll on body and soul alike.",
		dangers: [
			"Demonic Retribution",
			"Corruption Risk",
			"Obsession Danger",
			"Soul Erosion",
		],
		image: "/generated/compendium/backgrounds/demon-ascendant.webp",
		source: "System Ascendant Canon",
	},
	{
		id: "time-walker",
		name: "Time Walker",
		type: "Background",
		rank: "C",
		skill_proficiencies: ["Arcana", "Perception"],
		tool_proficiencies: ["Tinker's Tools"],
		languages: ["English", "Japanese"],
		equipment: [
			"A set of fine clothes from an indeterminate era",
			"Tinker's tools",
			"A broken pocket watch that occasionally ticks backward",
			"A journal written in multiple hands—all your own",
			"A belt pouch containing 10 Credits",
		],
		features: [
			{
				name: "Temporal Intuition",
				description:
					"You always know the exact time of day and how much time has passed since any event you personally experienced. You have advantage on initiative rolls, as you unconsciously perceive events a split second before they occur.",
			},
			{
				name: "Déjà Vu",
				description:
					"Once per long rest, when you fail an ability check or saving throw, you can declare that you've 'already seen this moment' and reroll. You must use the new result.",
			},
		],
		personalityTraits: [
			"I sometimes finish people's sentences before they say them.",
			"I stare at clocks and hourglasses with uncomfortable intensity.",
			"I use past and future tense inconsistently, as if time is fluid to me.",
			"I pause before acting, as though consulting a memory that hasn't happened yet.",
		],
		ideals: [
			"Preservation. The timeline must not be altered—the consequences are catastrophic. (Lawful)",
			"Curiosity. I want to understand time itself, even if it drives me mad. (Neutral)",
			"Correction. I've seen futures that must not come to pass, and I will prevent them. (Good)",
			"Control. Time is the ultimate power, and I seek to master it. (Evil)",
		],
		bonds: [
			"I carry a message from my future self that I don't yet understand.",
			"Someone I loved exists in a timeline that no longer exists.",
			"A paradox I caused is slowly unraveling, and I must fix it.",
			"I owe a debt to a being that exists outside of time.",
		],
		flaws: [
			"I am plagued by visions of possible futures that may never occur.",
			"I have difficulty living in the present—my mind drifts to other times.",
			"I sometimes panic when events don't match the timeline I remember.",
			"I've lived through the same traumatic event multiple times and can't forget any version.",
		],
		description:
			"You have experienced temporal anomalies that shattered your linear perception of time. You've seen moments that haven't happened yet, relived days that already passed, and occasionally lost weeks entirely. These experiences give you insights that others cannot comprehend.",
		dangers: [
			"Temporal Instability",
			"Paradox Creation",
			"Memory Overload",
			"Time Sickness",
		],
		image: "/generated/compendium/backgrounds/time-walker.webp",
		source: "System Ascendant Canon",
	},
	{
		id: "reality-bender",
		name: "Reality Bender",
		type: "Background",
		rank: "C",
		skill_proficiencies: ["Arcana", "Investigation"],
		tool_proficiencies: ["Glassblower's Tools"],
		languages: ["English", "Quantum Resonance"],
		equipment: [
			"A set of eccentric clothes that shimmer slightly",
			"Glassblower's tools",
			"A lens that shows things differently when looked through",
			"A notebook of 'corrections' to reality",
			"A belt pouch containing 10 Credits",
		],
		features: [
			{
				name: "Reality Sight",
				description:
					"You can see through mundane illusions automatically (no check required) and have advantage on saving throws against illusion spells. You can detect seams in reality—places where dimensional barriers are thin—within 60 feet.",
			},
			{
				name: "Minor Bend",
				description:
					"Once per long rest, you can make a minor alteration to local reality: change an object's color, make a small object appear or disappear, create a harmless sensory effect, or light or snuff out a candle. Changes last 1 hour.",
			},
		],
		personalityTraits: [
			"I question whether anything I see is real—including this conversation.",
			"I have an unnerving habit of staring at empty space as if something is there.",
			"I laugh at things no one else finds funny because I see layers others don't.",
			"I correct people's descriptions of reality with uncomfortable accuracy.",
		],
		ideals: [
			"Truth. Reality is a construct—I seek what lies beneath it. (Neutral)",
			"Stability. Reality must be maintained, not bent to anyone's will. (Lawful)",
			"Freedom. If reality can be changed, why accept a version that causes suffering? (Good)",
			"Chaos. The rules of reality are arbitrary—I'll rewrite them. (Chaotic)",
		],
		bonds: [
			"I accidentally erased something from reality and am trying to bring it back.",
			"A mentor taught me to control my abilities before they consumed me.",
			"Something that shouldn't exist keeps appearing in my peripheral vision.",
			"I am connected to a place where reality is permanently fractured.",
		],
		flaws: [
			"I sometimes can't distinguish between real memories and altered ones.",
			"My perception shifts make me seem unreliable or unhinged to others.",
			"I am tempted to 'fix' things in reality that aren't broken.",
			"I've lost fragments of my own existence—moments, relationships, even body parts that flicker.",
		],
		description:
			"You can perceive and manipulate the fundamental fabric of reality itself. This rare ability manifested after exposure to a rift event that tore the dimensional membrane, leaving you permanently attuned to the scaffolding beneath the world.",
		dangers: [
			"Existence Erosion",
			"Memory Loss",
			"Emotional Detachment",
			"Void Addiction",
		],
		image: "/generated/compendium/backgrounds/reality-bender.webp",
		source: "System Ascendant Canon",
	},
	{
		id: "void-touched",
		name: "Void Touched",
		type: "Background",
		rank: "S",
		skill_proficiencies: ["Arcana", "Stealth"],
		tool_proficiencies: ["Disguise Kit"],
		languages: ["English", "Quantum Resonance"],
		equipment: [
			"A set of dark clothes that seem to absorb light",
			"A disguise kit",
			"A shard of crystallized void (non-magical)",
			"A journal with entries in a language you don't remember learning",
			"A belt pouch containing 10 Credits",
		],
		features: [
			{
				name: "Void Touched",
				description:
					"You have darkvision out to 120 feet. Once per long rest, you can become invisible in dim light or darkness for 1 minute or until you attack or cast a spell.",
			},
			{
				name: "Null Aura",
				description:
					"You emanate a subtle field that disrupts magical detection. You cannot be detected by divination magic unless the caster succeeds on a DC 15 ability check using their spellcasting ability.",
			},
		],
		personalityTraits: [
			"I cast no umbral when I'm not paying attention.",
			"I speak softly, as if sound itself is trying to avoid me.",
			"I am drawn to places of absolute darkness and silence.",
			"I sometimes forget I exist—I have to remind myself I'm real.",
		],
		ideals: [
			"Acceptance. I am what the void made me; I will not deny my nature. (Neutral)",
			"Protection. No one else should suffer what I suffered. (Good)",
			"Isolation. I am dangerous to be around, and I accept that. (Lawful)",
			"Hunger. The void showed me true power, and I want more. (Evil)",
		],
		bonds: [
			"I am searching for a way to reverse what the void did to me.",
			"Someone pulled me back from the void's edge—I owe them everything.",
			"The void gave me a vision of something terrible that will happen—I must prevent it.",
			"Part of me is still in the void, and sometimes it calls me back.",
		],
		flaws: [
			"I feel disconnected from normal emotions and struggle to empathize.",
			"I am terrified of returning to the void but simultaneously drawn to it.",
			"My void-touched nature frightens people, and I've stopped trying to reassure them.",
			"I make decisions that prioritize the void's interests over my companions'.",
		],
		description:
			"You have been exposed to the pure void between dimensions—the absolute nothingness that exists where reality ends. Most who touch the void are unmade entirely. You survived, but you were changed in fundamental ways.",
		dangers: [
			"Existence Erosion",
			"Memory Loss",
			"Emotional Detachment",
			"Void Addiction",
		],
		image: "/generated/compendium/backgrounds/void-touched.webp",
		source: "System Ascendant Canon",
	},
	{
		id: "star-born",
		name: "Star Born",
		type: "Background",
		rank: "S",
		skill_proficiencies: ["Arcana", "Religion"],
		tool_proficiencies: ["Navigator's Tools"],
		languages: ["English", "Ancient Hebrew"],
		equipment: [
			"A set of fine clothes woven with star-thread",
			"Navigator's tools",
			"A star chart that updates itself at night",
			"A small meteorite fragment that is always warm",
			"A belt pouch containing 15 Credits",
		],
		features: [
			{
				name: "Stellar Knowledge",
				description:
					"Once per long rest, you can meditate under an open sky for 10 minutes to gain advantage on one Intelligence check of your choice within the next 24 hours. The knowledge comes as flashes of cosmic understanding.",
			},
			{
				name: "Ancient Hebrew Resilience",
				description:
					"You have resistance to radiant damage, and you have advantage on saving throws against effects that would banish you to another plane of existence.",
			},
		],
		personalityTraits: [
			"I look at the stars every night, as if reading messages from home.",
			"I experience the world with childlike wonder—everything here is new to me.",
			"I speak in cosmic metaphors that confuse and fascinate people.",
			"I have an aura of otherworldliness that makes people uneasy.",
		],
		ideals: [
			"Harmony. All worlds are connected by the stars; I seek universal balance. (Good)",
			"Understanding. I must learn what it means to be mortal before I can fulfill my purpose. (Neutral)",
			"Guidance. I was sent here to guide others, and I will not fail. (Lawful)",
			"Transcendence. This mortal form is temporary—I will ascend beyond it. (Any)",
		],
		bonds: [
			"I was sent here with a purpose I don't fully understand yet.",
			"A mortal showed me kindness when I first arrived—I will protect them always.",
			"I am searching for others like me who may have fallen to this world.",
			"The stars are dimming, and I fear it means something terrible for my origin.",
		],
		flaws: [
			"I struggle with mortal concepts like hunger, fatigue, and attachment.",
			"I can be condescending about mortal concerns without meaning to be.",
			"I am homesick for a place I can barely remember.",
			"I sometimes prioritize cosmic concerns over immediate mortal ones.",
		],
		description:
			"You were born under a cosmic alignment—or perhaps you came from beyond the stars entirely, a fragment of celestial intelligence given mortal form. You possess knowledge and abilities that transcend normal mortal understanding.",
		dangers: [
			"Cosmic Attention",
			"Ancient Hebrew Obligations",
			"Humanity Drift",
			"Star Sickness",
		],
		image: "/generated/compendium/backgrounds/star-born.webp",
		source: "System Ascendant Canon",
	},
	{
		id: "ancient-guardian",
		name: "Ancient Guardian",
		type: "Background",
		rank: "S",
		skill_proficiencies: ["History", "Perception"],
		tool_proficiencies: ["Mason's Tools"],
		languages: ["English", "Proto-Indo-European"],
		equipment: [
			"A guardian's medallion (ancient and weathered)",
			"Mason's tools",
			"A set of traveler's clothes from a bygone era",
			"A scroll of protective wards",
			"A belt pouch containing 10 Credits",
		],
		features: [
			{
				name: "Ancient Vigil",
				description:
					"You cannot be surprised while you are conscious. You have advantage on Wisdom (Perception) checks to detect hidden creatures or objects in structures, ruins, or underground environments.",
			},
			{
				name: "Timeless Lore",
				description:
					"You have advantage on Intelligence (History) checks, and when you encounter ancient ruins, artifacts, or inscriptions, the Protocol Warden (PW) may provide you with additional information about their origin and purpose.",
			},
		],
		personalityTraits: [
			"I measure time in centuries and find mortal urgency amusing.",
			"I speak with archaic formality that confuses modern folk.",
			"I am fiercely protective of things under my care—sometimes irrationally so.",
			"I have a deep melancholy from watching civilizations rise and fall.",
		],
		ideals: [
			"Protection. I was entrusted with a sacred duty, and I will not abandon it. (Lawful)",
			"Legacy. The past must be preserved so future generations can learn from it. (Good)",
			"Patience. Time reveals all truths—rushing leads to ruin. (Neutral)",
			"Adaptation. The old ways must evolve, or they will be forgotten entirely. (Chaotic)",
		],
		bonds: [
			"I guard a site of immense power that must never be breached.",
			"The being that charged me with my vigil has not spoken to me in centuries.",
			"I remember a world before the rifts, and I mourn what was lost.",
			"A young mortal reminds me of someone I protected long ago.",
		],
		flaws: [
			"I am stubbornly set in my ways and resist change.",
			"I have difficulty relating to beings with mortal lifespans.",
			"I have lost pieces of my memory over the centuries and sometimes confuse eras.",
			"I am so focused on my duty that I neglect everything else.",
		],
		description:
			"You are an ancient being tasked with protecting something of immense importance. Your long life has given you wisdom and perspective that few can match, but it has also left you disconnected from the rapid pace of modern times.",
		dangers: [
			"Usurper Threats",
			"Kingdom Ghosts",
			"Responsibility Weight",
			"Power Isolation",
		],
		image: "/generated/compendium/backgrounds/ancient-guardian.webp",
		source: "System Ascendant Canon",
	},
	{
		id: "forgotten-king",
		name: "Forgotten King",
		type: "Background",
		rank: "A",
		skill_proficiencies: ["Persuasion", "History"],
		tool_proficiencies: ["Gaming Set (Chess)"],
		languages: ["English", "Japanese"],
		equipment: [
			"A crown fragment or royal signet ring",
			"A set of fine clothes (faded but regal)",
			"A gaming set (chess)",
			"A partial map of a kingdom that no longer exists",
			"A belt pouch containing 20 Credits",
		],
		features: [
			{
				name: "Royal Bearing",
				description:
					"You have advantage on Charisma (Persuasion) checks when negotiating with nobles, officials, and leaders. Common folk instinctively defer to you, offering respectful treatment and accommodation.",
			},
			{
				name: "Kingdom's Memory",
				description:
					"You have advantage on Intelligence checks related to politics, governance, military strategy, and heraldry.",
			},
		],
		personalityTraits: [
			"I instinctively command rooms and expect people to listen when I speak.",
			"I reference my former kingdom in conversation, even when no one recognizes it.",
			"I carry a quiet dignity that persists even in the worst circumstances.",
			"I judge people by their honor and integrity, not their station.",
		],
		ideals: [
			"Justice. A true ruler serves the people, not the other way around. (Good)",
			"Restoration. I will reclaim what was taken from me—my kingdom and my crown. (Any)",
			"Wisdom. The fall of my kingdom taught me humility I lacked as a ruler. (Neutral)",
			"Legacy. Though my kingdom is gone, its ideals must endure. (Lawful)",
		],
		bonds: [
			"Loyal subjects from my lost kingdom still search for me.",
			"The one who destroyed my kingdom still lives, and I will face them.",
			"I carry a relic of my kingdom that is the key to its restoration.",
			"A prophecy foretold the fall of my kingdom—and my rise from its ashes.",
		],
		flaws: [
			"I struggle to accept that I am no longer a king.",
			"I make promises I cannot keep, still thinking in terms of royal resources.",
			"I can be haughty and dismissive of those I perceive as beneath my station.",
			"I am haunted by the decisions I made as king that led to my kingdom's fall.",
		],
		description:
			"You once ruled a kingdom that has been lost to time—whether through conquest, catastrophe, or dimensional displacement. Your crown is gone, your subjects scattered or dead, and your palace exists only in your memory. But your royal bearing and leadership experience remain.",
		dangers: [
			"Usurper Threats",
			"Kingdom Ghosts",
			"Responsibility Weight",
			"Power Isolation",
		],
		image: "/generated/compendium/backgrounds/forgotten-king.webp",
		source: "System Ascendant Canon",
	},
	{
		id: "champion-of-light",
		name: "Champion of Light",
		type: "Background",
		rank: "A",
		skill_proficiencies: ["Religion", "Medicine"],
		tool_proficiencies: ["Herbalism Kit"],
		languages: ["English", "Ancient Hebrew"],
		equipment: [
			"A holy symbol of radiant gold",
			"A set of fine white vestments",
			"An herbalism kit",
			"A vial of blessed water",
			"A belt pouch containing 15 Credits",
		],
		features: [
			{
				name: "Radiant Aura",
				description:
					"You can cause your body to emit bright light in a 10-foot radius and dim light for an additional 10 feet as a bonus action. Undead and fiends within this light have disadvantage on attack rolls against you. The light lasts for 1 minute or until you dismiss it.",
			},
			{
				name: "Beacon of Hope",
				description:
					"Once per long rest, you can inspire an ally within 30 feet who can see or hear you. They gain temporary hit points equal to your level + your Charisma modifier and have advantage on their next saving throw.",
			},
		],
		personalityTraits: [
			"I believe in the good in every person, even when evidence suggests otherwise.",
			"I rise before dawn and greet each day as a gift.",
			"I cannot pass by suffering without trying to help.",
			"I speak with calm conviction that steadies those around me.",
		],
		ideals: [
			"Compassion. Every soul deserves mercy and a chance at redemption. (Good)",
			"Justice. The light reveals truth and burns away corruption. (Lawful)",
			"Hope. Even in the darkest times, light endures—I am proof of that. (Good)",
			"Sacrifice. I will lay down my life if it means others survive. (Any)",
		],
		bonds: [
			"I was chosen by a divine entity to carry the light into the world's darkest places.",
			"I fight to honor a fallen champion whose mantle I now bear.",
			"A community depends on me as their protector and spiritual guide.",
			"I seek to purify a corrupted holy site and restore it to its former glory.",
		],
		flaws: [
			"I am naive about the depths of evil and am often blindsided.",
			"I hold myself to impossibly high standards and crumble under guilt when I fail.",
			"I can be self-righteous and dismissive of those who take a darker path.",
			"My devotion to the light makes me inflexible in moral gray areas.",
		],
		description:
			"You have been chosen as a champion of radiant power—a beacon against the encroaching darkness of corrupted rifts and umbral entities. Whether anointed by a divine being, awakened through a near-death experience, or simply born with an inner light, you carry a responsibility that transcends personal ambition.",
		dangers: [
			"Dark Retribution",
			"Hope Burden",
			"Light Dependency",
			"Target Status",
		],
		image: "/generated/compendium/backgrounds/champion-of-light.webp",
		source: "System Ascendant Canon",
	},
	{
		id: "bringer-of-dawn",
		name: "Bringer of Dawn",
		type: "Background",
		rank: "D",
		skill_proficiencies: ["Performance", "Persuasion"],
		tool_proficiencies: ["Musical Instrument (one of your choice)"],
		languages: ["English"],
		equipment: [
			"A musical instrument of your choice",
			"A set of traveler's clothes",
			"A lantern that never fully goes out",
			"A collection of uplifting stories and songs",
			"A belt pouch containing 10 Credits",
		],
		features: [
			{
				name: "Dawn's Inspiration",
				description:
					"Your words and presence uplift those around you. Once per long rest, you can spend 10 minutes performing, speaking, or simply being present to remove the frightened condition from up to 6 friendly creatures who can hear or see you.",
			},
			{
				name: "First Light",
				description:
					"You have an innate connection to the concept of renewal. When you take a long rest, one ally who rests within 30 feet of you regains one additional hit die.",
			},
		],
		personalityTraits: [
			"I greet every morning with genuine enthusiasm, no matter how bad things are.",
			"I tell stories and sing songs to keep spirits high during dark times.",
			"I believe that small acts of kindness ripple outward to change the world.",
			"I light candles in dark places—literally and figuratively.",
		],
		ideals: [
			"Hope. Dawn always comes, no matter how long the night. (Good)",
			"Service. I exist to bring light to those who have lost their way. (Lawful)",
			"Joy. Life is precious and should be celebrated, not mourned. (Chaotic)",
			"Renewal. Every ending is a new beginning waiting to happen. (Neutral)",
		],
		bonds: [
			"I made a promise to someone in despair that I would bring them hope.",
			"A community in a dark place depends on my visits to sustain their morale.",
			"I carry a flame that was lit at the first dawn—it must never go out.",
			"I lost someone to darkness, and I swore no one else would suffer the same fate.",
		],
		flaws: [
			"I refuse to acknowledge how dire a situation truly is.",
			"My relentless optimism can be exhausting and dismissive of real pain.",
			"I neglect my own well-being in my drive to help others.",
			"I am terrified of the dark and what it represents.",
		],
		description:
			"You are a beacon of hope in a world increasingly consumed by umbral and dimensional horror. Whether through song, story, healing, or simply your unwavering presence, you bring light to dark places and courage to the despairing. The System may have given humanity power, but you remind them why that power is worth wielding.",
		dangers: [
			"Isolation",
			"Information Overload",
			"Helplessness",
			"Memory Burden",
		],
		image: "/generated/compendium/backgrounds/bringer-of-dawn.webp",
		source: "System Ascendant Canon",
	},
	{
		id: "eternal-watcher",
		name: "Eternal Watcher",
		type: "Background",
		rank: "B",
		skill_proficiencies: ["Perception", "Investigation"],
		tool_proficiencies: ["Spyglass"],
		languages: ["English", "Japanese"],
		equipment: [
			"A set of nondescript clothes",
			"A spyglass",
			"A journal of observations spanning decades",
			"A brass compass that points to dimensional anomalies",
			"A belt pouch containing 10 Credits",
		],
		features: [
			{
				name: "Vigilant Eye",
				description:
					"Your centuries of observation have honed your senses to supernatural sharpness. You have advantage on Wisdom (Perception) checks to notice hidden details, and you can read lips from up to 120 feet away. You also have advantage on Intelligence (Investigation) checks to spot inconsistencies or forgeries.",
			},
			{
				name: "Witnessed History",
				description:
					"You have personally observed significant historical events. Once per long rest, when encountering a person, place, or object of historical significance, you can recall a relevant detail that provides advantage on your next ability check related to that subject.",
			},
		],
		personalityTraits: [
			"I observe everything and everyone, cataloging details others miss.",
			"I rarely speak first—I prefer to listen and watch.",
			"I have an encyclopedic memory for faces, names, and events.",
			"I struggle with the urge to intervene versus my duty to observe.",
		],
		ideals: [
			"Truth. I record what happens without bias or judgment. (Neutral)",
			"Duty. I was tasked with watching, and I will not abandon my post. (Lawful)",
			"Warning. I watch so that I can warn others of dangers to come. (Good)",
			"Knowledge. Everything I observe adds to the sum of understanding. (Any)",
		],
		bonds: [
			"I am compiling a chronicle that must survive even if I don't.",
			"I watched a tragedy unfold and did nothing—I carry that guilt.",
			"There is one specific event or person I was assigned to watch.",
			"I discovered something during my vigil that could change everything.",
		],
		flaws: [
			"I am a passive observer by nature and hesitate to take direct action.",
			"I have trouble connecting emotionally after centuries of detached observation.",
			"I know secrets that make people uncomfortable around me.",
			"I sometimes forget that I'm allowed to participate in events, not just watch.",
		],
		description:
			"You have been tasked with observing important events or places across time. This vigil has given you incredible perception and an unmatched understanding of patterns in history—but it has also isolated you from normal life. You see connections others miss and remember things everyone else has forgotten.",
		dangers: [
			"Cosmic Dangers",
			"Identity Drift",
			"Endless Journey",
			"Loneliness",
		],
		image: "/generated/compendium/backgrounds/eternal-watcher.webp",
		source: "System Ascendant Canon",
	},
	{
		id: "cosmic-wanderer",
		name: "Cosmic Wanderer",
		type: "Background",
		rank: "B",
		skill_proficiencies: ["Survival", "Insight"],
		tool_proficiencies: ["Cook's Utensils"],
		languages: ["English", "Proto-Indo-European"],
		equipment: [
			"A set of well-worn traveler's clothes",
			"Cook's utensils",
			"A walking staff carved with symbols from many worlds",
			"A collection of souvenirs from different dimensions",
			"A belt pouch containing 10 Credits",
		],
		features: [
			{
				name: "Wanderer's Wisdom",
				description:
					"Your travels have taught you to adapt to any environment. You can find food and fresh water for yourself and up to five other people each day in any environment, including dimensions with hostile atmospheres. You also have advantage on Wisdom (Survival) checks in unfamiliar terrain.",
			},
			{
				name: "Cosmic Perspective",
				description:
					"Having seen the vastness of existence, you are difficult to deceive or intimidate. You have advantage on Wisdom (Insight) checks to determine if someone is lying, and advantage on saving throws against being frightened by creatures of CR 5 or lower.",
			},
		],
		personalityTraits: [
			"I have a story from another world for every situation.",
			"I taste everything—you never know when a local plant might be medicine.",
			"I am equally comfortable sleeping under alien stars as in a warm bed.",
			"I speak fragments of dozens of languages and mix them unconsciously.",
		],
		ideals: [
			"Freedom. The road is my home, and I answer to no one. (Chaotic)",
			"Connection. Every world I visit enriches my understanding of all of them. (Good)",
			"Wisdom. Travel teaches lessons that books never can. (Neutral)",
			"Purpose. I wander because I'm searching for something—I'll know it when I find it. (Any)",
		],
		bonds: [
			"I carry a map to a place I've never been—I was told I'd know when to use it.",
			"A friend from another dimension asked me to deliver a message.",
			"I am running from something across dimensions, and it is catching up.",
			"I promised to return to a world I visited, and I always keep my promises.",
		],
		flaws: [
			"I can never stay in one place for long—wanderlust consumes me.",
			"I sometimes share knowledge from other worlds that causes unintended consequences.",
			"I have trouble remembering which customs belong to which world.",
			"I am lonely but afraid of putting down roots.",
		],
		description:
			"You travel between worlds and dimensions as a wanderer, seeking knowledge, experience, and the ineffable something that drives you ever onward. Your journeys have given you cosmic perspective, diverse survival skills, and a collection of stories that would fill a library. You've broken bread with beings of pure thought and slept under skies with three moons.",
		dangers: [
			"Umbral Corruption",
			"Rift Instability",
			"Regent's Wrath",
			"Dimensional Sickness",
		],
		image: "/generated/compendium/backgrounds/cosmic-wanderer.webp",
		source: "System Ascendant Canon",
	},

	// ── MODERN-DAY BACKGROUNDS ───────────────────────────────────────────
	{
		id: "viral-streamer",
		name: "Viral Streamer",
		type: "Background",
		rank: "C",
		skill_proficiencies: ["Performance", "Persuasion"],
		tool_proficiencies: ["Streaming Equipment", "Video Editing Software"],
		languages: ["English"],
		equipment: [
			"A high-end streaming laptop",
			"A ring light and portable camera",
			"A branded hoodie with your channel logo",
			"A portable Wi-Fi hotspot",
			"A belt pouch containing 15 Credits",
		],
		features: [
			{
				name: "Viral Reach",
				description:
					"Your online following gives you access to information networks. You can spend 1 hour broadcasting a request to your followers to gain advantage on one Intelligence (Investigation) or Charisma (Persuasion) check within the next 24 hours as your audience crowdsources answers or applies social pressure.",
			},
			{
				name: "Content Creator's Eye",
				description:
					"You have an instinct for what captures attention. You have advantage on Wisdom (Perception) checks to notice unusual or noteworthy events happening around you.",
			},
		],
		personalityTraits: [
			"I narrate everything I do as if someone is watching—because someone usually is.",
			"I can't resist documenting a dramatic moment, even in the middle of danger.",
			"I speak in catchphrases and memes that I've made famous.",
			"I treat every social interaction like an interview opportunity.",
		],
		ideals: [
			"Authenticity. My audience trusts me because I never fake it. (Good)",
			"Fame. More followers means more power, and power is everything. (Neutral)",
			"Connection. I stream because loneliness is a disease the internet can cure. (Any)",
			"Truth. I use my platform to expose corruption and injustice. (Lawful)",
		],
		bonds: [
			"My first subscriber stuck with me from zero—I'd do anything for them.",
			"A corporation tried to buy my silence about a gate incident I streamed live.",
			"My streaming rival disappeared after exploring a gate on camera.",
			"I accidentally captured classified Ascendant Association footage and now I'm a target.",
		],
		flaws: [
			"I can't stop checking my viewer count, even during life-or-death moments.",
			"I'll take insane risks for content that will go viral.",
			"I've built a persona so thick I've forgotten who I actually am.",
			"I overshare everything online and have no concept of operational security.",
		],
		description:
			"Before the System chose you, you were already famous—or at least internet-famous. Your live streams, reaction videos, or documentary content had built an audience of thousands, maybe millions. When gates started opening and ascendants started awakening, you pointed your camera at the chaos and never looked away. Now that you've awakened yourself, your audience watches your ascension in real time.",
		dangers: [
			"Doxxing",
			"Corporate Exploitation",
			"Parasocial Stalkers",
			"Content Addiction",
		],
		image: "/generated/compendium/backgrounds/viral-streamer.webp",
		source: "System Ascendant Canon",
	},
	{
		id: "kpop-idol",
		name: "K-Pop Idol",
		type: "Background",
		rank: "B",
		skill_proficiencies: ["Performance", "Acrobatics"],
		tool_proficiencies: ["Musical Instrument (any one)", "Disguise Kit"],
		languages: ["Common", "Korean"],
		equipment: [
			"A designer stage outfit",
			"A musical instrument of your choice",
			"A disguise kit",
			"A signed photo collection from your group",
			"A belt pouch containing 25 Credits",
		],
		features: [
			{
				name: "Stage Presence",
				description:
					"Your years of idol training have given you supernatural charisma. When you perform for at least 1 minute, all friendly creatures within 30 feet gain temporary hit points equal to your Charisma modifier + your proficiency bonus. This can be used once per short rest.",
			},
			{
				name: "Fandom Network",
				description:
					"Your devoted fan base spans the globe. In any major city, you can find a fan willing to provide shelter, information, or minor assistance within 1d4 hours of making your presence known.",
			},
		],
		personalityTraits: [
			"I maintain perfect posture and appearance at all times—training never ends.",
			"I count beats in my head during combat, turning every fight into choreography.",
			"I bow to everyone I meet, a habit from years of fan meets.",
			"I practice my smile so often it's become my default expression, even when I'm terrified.",
		],
		ideals: [
			"Perfection. I trained 16 hours a day for years—I refuse to accept anything less than my best. (Lawful)",
			"Inspiration. My purpose is to give people hope through my art. (Good)",
			"Freedom. The agency controlled my life—never again. (Chaotic)",
			"Legacy. I want to be remembered for more than just a pretty face and catchy songs. (Any)",
		],
		bonds: [
			"My former group members are scattered across different ascendant guilds—I need to find them.",
			"My agency still holds my contract and wants me back, dead or alive.",
			"A sasaeng fan awakened the same day I did and is obsessed with following my ascension.",
			"I dedicated my last song to someone who disappeared into a gate—I'll find them.",
		],
		flaws: [
			"I am terrified of being seen without makeup or my stage persona.",
			"I instinctively try to please everyone, even enemies.",
			"I can't handle being ignored—I need to be the center of attention.",
			"Years of strict dieting have left me with a complicated relationship with food and rest.",
		],
		description:
			"You were one of the brightest stars in the entertainment industry—a trained performer whose face graced billboards, whose songs topped charts, and whose every movement was choreographed to perfection. Then the System awakened you, and suddenly your stage presence became something far more dangerous. Your fans now watch you fight monsters instead of performing, and somehow, you make even that look beautiful.",
		dangers: [
			"Paparazzi Exposure",
			"Agency Debt",
			"Sasaeng Stalkers",
			"Identity Crisis",
		],
		image: "/generated/compendium/backgrounds/kpop-idol.webp",
		source: "System Ascendant Canon",
	},
	{
		id: "movie-star",
		name: "Movie Star",
		type: "Background",
		rank: "B",
		skill_proficiencies: ["Performance", "Deception"],
		tool_proficiencies: ["Disguise Kit", "Vehicles (land)"],
		languages: ["Common"],
		equipment: [
			"A set of luxury clothes",
			"A disguise kit",
			"An autographed headshot (your own)",
			"A pair of designer sunglasses",
			"A belt pouch containing 30 Credits",
		],
		features: [
			{
				name: "Method Actor",
				description:
					"Your acting training lets you assume identities with frightening accuracy. You have advantage on Charisma (Deception) checks when impersonating a specific person you have observed for at least 10 minutes. Additionally, you can perfectly mimic accents and speech patterns.",
			},
			{
				name: "Celebrity Status",
				description:
					"Your fame opens doors. You can gain access to exclusive locations, VIP areas, and high-society events. Important NPCs are more likely to grant you an audience, giving you advantage on the first Charisma check when meeting someone who recognizes you.",
			},
		],
		personalityTraits: [
			"I quote my own movies in conversation and expect people to recognize the reference.",
			"I approach every situation like it's a scene—I need motivation, stakes, and a dramatic arc.",
			"I am genuinely kind to fans but ruthless in negotiations.",
			"I've played so many characters that I sometimes lose track of my real personality.",
		],
		ideals: [
			"Art. Acting taught me empathy—I've lived a thousand lives and understand them all. (Good)",
			"Power. Fame is just another word for influence, and influence changes the world. (Neutral)",
			"Authenticity. I'm tired of pretending—I want to be someone real for once. (Any)",
			"Justice. I've seen how the powerful exploit the weak, and I won't stand for it. (Lawful)",
		],
		bonds: [
			"My stunt double was killed when a gate opened on set—I carry their memory.",
			"A director I trust implicitly has been asking me to investigate strange gate activity.",
			"My co-star awakened as a villain, and only I know their true identity.",
			"I promised my late parent I'd use my platform to help people.",
		],
		flaws: [
			"I need an audience to function—I freeze when no one is watching.",
			"I've been pampered so long that roughing it genuinely distresses me.",
			"I trust my agent's judgment over my own, even when it's clearly wrong.",
			"I can't resist a dramatic entrance, even when stealth is critical.",
		],
		description:
			"Hollywood royalty, box office gold, the face that launched a thousand franchises—that was your life before the gates. You had everything: mansions, private jets, adoring fans. Then the System chose you, and suddenly the action scenes weren't choreographed anymore. The monsters were real. The stakes were real. And for the first time in your career, no one was going to yell 'cut.'",
		dangers: [
			"Tabloid Exposure",
			"Stalker Fans",
			"Typecasting",
			"Reality Dissociation",
		],
		image: "/generated/compendium/backgrounds/movie-star.webp",
		source: "System Ascendant Canon",
	},
	{
		id: "pro-athlete",
		name: "Pro Athlete",
		type: "Background",
		rank: "C",
		skill_proficiencies: ["Athletics", "Intimidation"],
		tool_proficiencies: ["Sports Equipment (any one)", "Vehicles (land)"],
		languages: ["Common"],
		equipment: [
			"A set of athletic wear",
			"Sports equipment of your choice",
			"A championship medal or trophy replica",
			"A training journal",
			"A belt pouch containing 20 Credits",
		],
		features: [
			{
				name: "Peak Conditioning",
				description:
					"Your professional training has pushed your body to its limits. You can add your proficiency bonus to Constitution saving throws against exhaustion, and you require only 4 hours of sleep to gain the benefits of a long rest.",
			},
			{
				name: "Competitive Spirit",
				description:
					"When you fail an ability check or saving throw, you can choose to reroll it with advantage. You can use this feature once per long rest. Additionally, you have advantage on Athletics checks related to running, jumping, or climbing.",
			},
		],
		personalityTraits: [
			"I turn everything into a competition, even eating breakfast.",
			"I maintain a strict training regimen no matter what—6 AM runs in the dungeon if I have to.",
			"I motivate others with intense pre-battle speeches that sound like locker room pep talks.",
			"I keep detailed stats on everything: kills, damage dealt, gates cleared, personal bests.",
		],
		ideals: [
			"Excellence. Second place is first loser—I will be the absolute best. (Lawful)",
			"Teamwork. No champion wins alone—I protect my team above all else. (Good)",
			"Glory. I fight so the world will remember my name. (Neutral)",
			"Resilience. It's not about how hard you hit—it's about how hard you can get hit and keep going. (Any)",
		],
		bonds: [
			"My coach was killed by a gate beast and I fight in their memory.",
			"My old team was my family—I'd cross dimensions to protect them.",
			"A rival athlete awakened with powers that dwarf mine, and I refuse to fall behind.",
			"I still have a contract with my sports team, and they expect me to play AND clear gates.",
		],
		flaws: [
			"I push myself past my limits and refuse to admit when I'm injured.",
			"I can't stand losing—a defeat sends me into a spiral of self-doubt.",
			"I rely too heavily on my physical abilities and neglect studying or planning.",
			"I have a massive ego that makes cooperation with equals difficult.",
		],
		description:
			"You were at the top of your game—a professional athlete whose name was synonymous with peak human performance. Your body was a finely tuned instrument, honed through years of brutal training and competition. When the System awakened you, it took that foundation and built something superhuman on top of it. Now you compete on a very different field, where the losers don't go home—they don't go anywhere at all.",
		dangers: [
			"Career-Ending Injury",
			"Performance-Enhancing Temptation",
			"Sponsor Pressure",
			"Burnout",
		],
		image: "/generated/compendium/backgrounds/pro-athlete.webp",
		source: "System Ascendant Canon",
	},
	{
		id: "corporate-executive",
		name: "Corporate Executive",
		type: "Background",
		rank: "B",
		skill_proficiencies: ["Persuasion", "Insight"],
		tool_proficiencies: ["Forgery Kit"],
		languages: ["Common", "one additional Earth language"],
		equipment: [
			"A tailored business suit",
			"A leather briefcase",
			"A corporate ID badge",
			"A burner phone",
			"A belt pouch containing 50 Credits",
		],
		features: [
			{
				name: "Corporate Connections",
				description:
					"Your business network spans industries and governments. You can call in a favor once per week to arrange meetings with powerful figures, access restricted corporate facilities, or obtain classified market information. The favor's scope is at the Warden's discretion.",
			},
			{
				name: "Hostile Negotiator",
				description:
					"You are ruthlessly effective in negotiations. When you engage in a contested Charisma check during negotiations, you can treat a roll of 9 or lower as a 10.",
			},
		],
		personalityTraits: [
			"I evaluate every person I meet in terms of their usefulness to me.",
			"I schedule everything, including leisure time, in 15-minute increments.",
			"I speak in corporate buzzwords and motivational quotes without realizing it.",
			"I always have an exit strategy—for meetings, relationships, and combat.",
		],
		ideals: [
			"Order. Systems and hierarchies exist for a reason—they create efficiency. (Lawful)",
			"Ambition. Power flows to those who seize it. I intend to be at the top. (Neutral)",
			"Innovation. The old world is dying. The System is the future, and I will shape it. (Any)",
			"Responsibility. With great power comes great fiduciary responsibility to stakeholders. (Lawful)",
		],
		bonds: [
			"My company is secretly funding gate research, and I know things that could topple governments.",
			"My family's wealth was built on exploiting ascendants, and I'm trying to make it right.",
			"A business rival has awakened and is using their powers for corporate espionage.",
			"I owe my position to a mentor who disappeared into an S-Rank gate.",
		],
		flaws: [
			"I treat people like assets to be leveraged rather than individuals.",
			"I am addicted to control and become erratic when things don't go according to plan.",
			"I will sacrifice almost anything—including allies—to protect my reputation.",
			"I look down on people who lack ambition or education.",
		],
		description:
			"Corner office, seven-figure salary, a name that made markets move—you were a titan of industry before the gates changed everything. You managed portfolios worth more than some countries' GDP and made decisions that affected millions. When the System awakened you, you treated it like any other hostile takeover: assess, strategize, dominate. The boardroom prepared you for battle better than anyone expected.",
		dangers: [
			"Corporate Espionage",
			"Hostile Takeover",
			"Burnout",
			"Moral Compromise",
		],
		image: "/generated/compendium/backgrounds/corporate-executive.webp",
		source: "System Ascendant Canon",
	},
	{
		id: "underground-hacker",
		name: "Underground Hacker",
		type: "Background",
		rank: "C",
		skill_proficiencies: ["Investigation", "Stealth"],
		tool_proficiencies: ["Hacking Tools", "Thieves' Tools"],
		languages: ["Common"],
		equipment: [
			"A custom-built laptop with encrypted drives",
			"A set of nondescript clothes",
			"Hacking tools",
			"A collection of USB drives with unknown data",
			"A belt pouch containing 10 Credits",
		],
		features: [
			{
				name: "Digital Ghost",
				description:
					"You can interface with electronic systems and security networks with supernatural ease. You have advantage on Intelligence checks related to technology, hacking, or digital systems. Once per long rest, you can spend 10 minutes to access a secured digital system without leaving a trace.",
			},
			{
				name: "Dark Web Contacts",
				description:
					"You have connections in the digital underground. You can spend 1 hour to contact an anonymous informant who can provide you with information about a person, organization, or location. The information is reliable but may come at a price.",
			},
		],
		personalityTraits: [
			"I see the world as systems and code—everything can be hacked if you know where to look.",
			"I use a different alias for every situation and never give my real name.",
			"I compulsively encrypt everything, including handwritten notes.",
			"I speak in technical jargon that no one else understands and refuse to simplify it.",
		],
		ideals: [
			"Freedom. Information wants to be free, and so do people. (Chaotic)",
			"Knowledge. Data is power, and I want to know everything. (Neutral)",
			"Justice. I hack the powerful to protect the powerless. (Good)",
			"Chaos. The old systems are broken—I'm just helping them fall faster. (Chaotic)",
		],
		bonds: [
			"My hacker collective was targeted by a ascendant guild for exposing their corruption.",
			"I found something in the Ascendant Association's classified servers that terrified me.",
			"The System's code structure reminds me of something I've seen before, and I need to find the connection.",
			"A fellow hacker was forcibly recruited by a umbral organization—I'm going to get them out.",
		],
		flaws: [
			"I trust machines more than people.",
			"I am paranoid about surveillance and sometimes see conspiracies where there are none.",
			"I can't resist poking at secure systems, even when it's suicidal to try.",
			"I've spent so long online that I have serious difficulty with face-to-face social interaction.",
		],
		description:
			"In the digital umbrals, you were a ghost—a phantom who moved through firewalls like they were tissue paper. Governments feared your keystrokes, corporations trembled at your handle. When the System awakened you, you realized that reality itself was just another system to hack. The code that underlies gates, essence, and ascension looks hauntingly familiar to someone who's spent their whole life reading between the lines of code.",
		dangers: [
			"Government Surveillance",
			"Cyberattack Retaliation",
			"Digital Addiction",
			"Identity Erasure",
		],
		image: "/generated/compendium/backgrounds/underground-hacker.webp",
		source: "System Ascendant Canon",
	},
	{
		id: "social-media-influencer",
		name: "Social Media Influencer",
		type: "Background",
		rank: "D",
		skill_proficiencies: ["Persuasion", "Deception"],
		tool_proficiencies: ["Photography Equipment"],
		languages: ["Common"],
		equipment: [
			"A smartphone with high-end camera",
			"A portable ring light",
			"A curated wardrobe of trendy clothes",
			"Brand partnership contracts",
			"A belt pouch containing 20 Credits",
		],
		features: [
			{
				name: "Influencer's Reach",
				description:
					"You can sway public opinion with a single post. Once per long rest, you can make a Charisma (Persuasion) check to influence the attitude of a community or organization toward a person, idea, or cause. The DC is set by the Warden based on how controversial the stance is.",
			},
			{
				name: "Brand Recognition",
				description:
					"Merchants and vendors recognize you. You receive a 15% discount on non-magical goods and services in any settlement with access to the internet or media networks.",
			},
		],
		personalityTraits: [
			"I instinctively pose when someone points anything at me that might be a camera.",
			"I rate everything on a 1-to-10 scale and share my opinion whether asked or not.",
			"I genuinely care about my followers and consider them an extended family.",
			"I curate my life so carefully that I sometimes forget what's real and what's a brand.",
		],
		ideals: [
			"Community. My platform connects people—that matters more than money. (Good)",
			"Image. Perception is reality, and I control how people perceive me. (Neutral)",
			"Growth. Every day is a chance to reach more people and expand my brand. (Any)",
			"Truth. I refuse to promote anything I don't believe in, even if it costs me sponsors. (Lawful)",
		],
		bonds: [
			"My followers funded my first gate expedition through crowdfunding.",
			"A rival influencer has been spreading lies about me and my ascendant abilities.",
			"I promised to document the truth about gates for the public, no matter how dangerous.",
			"My brand manager knows my darkest secret and uses it as leverage.",
		],
		flaws: [
			"My self-worth is entirely tied to engagement metrics and follower counts.",
			"I'll do almost anything for content, including putting others at risk.",
			"I can't handle negative comments—criticism sends me into a tailspin.",
			"I present a perfect life online but I'm deeply insecure underneath it all.",
		],
		description:
			"Likes, shares, followers, brand deals—that was your world. You built an empire of content, turning your personality into a product and your life into a performance. When the System chose you, your audience exploded overnight. Millions now watch an influencer fight actual monsters, and the engagement has never been better. But behind the filters and the curated feeds, you're starting to realize that the person your followers love might not be the person you actually are.",
		dangers: [
			"Cancel Culture",
			"Brand Dependency",
			"Authenticity Crisis",
			"Doxxing",
		],
		image: "/generated/compendium/backgrounds/social-media-influencer.webp",
		source: "System Ascendant Canon",
	},
	{
		id: "esports-champion",
		name: "E-Sports Champion",
		type: "Background",
		rank: "C",
		skill_proficiencies: ["Perception", "Investigation"],
		tool_proficiencies: ["Gaming Equipment", "Vehicles (land)"],
		languages: ["Common"],
		equipment: [
			"A custom gaming peripheral set",
			"A team jersey",
			"A tournament trophy replica",
			"Energy drinks (1 week supply)",
			"A belt pouch containing 15 Credits",
		],
		features: [
			{
				name: "Tactical Overlay",
				description:
					"Years of competitive gaming have trained your brain to process complex tactical information instantly. You can take the Help action as a bonus action once per short rest. Additionally, you have advantage on Intelligence checks to analyze tactical situations, traps, or puzzles.",
			},
			{
				name: "Clutch Factor",
				description:
					"When the pressure is highest, you perform your best. When you are at half hit points or below, you gain a +2 bonus to attack rolls and saving throws. This represents your ability to perform in clutch moments.",
			},
		],
		personalityTraits: [
			"I call out ability names when I use them, like a character in a game.",
			"I analyze everyone's 'build' and suggest optimizations whether they want them or not.",
			"I treat real combat encounters like raid bosses—I need strategy, roles, and a shot caller.",
			"I use gaming terminology for everything: 'aggro,' 'DPS,' 'tank,' 'res me.'",
		],
		ideals: [
			"Strategy. Every problem has an optimal solution—you just have to find it. (Lawful)",
			"Competition. I don't just want to win—I want to be the undisputed best. (Neutral)",
			"Teamwork. No carry is complete without a team. I protect my squad. (Good)",
			"Innovation. The meta is always evolving, and I evolve with it. (Any)",
		],
		bonds: [
			"My former esports team was my real family—I'd queue into an S-Rank gate for them.",
			"My biggest rival in gaming awakened the same day I did, and we're still competing.",
			"I was scouted by a ascendant guild specifically because they saw my tactical ability in tournaments.",
			"My gaming sponsor is secretly a front for an organization researching System mechanics.",
		],
		flaws: [
			"I sometimes forget that death in real life doesn't have a respawn timer.",
			"I min-max everything, including relationships.",
			"I can be incredibly toxic when we're losing—old gaming habits die hard.",
			"I've spent so many years indoors that I'm physically underdeveloped compared to other ascendants.",
		],
		description:
			"You were the best—or close to it. Your reflexes were measured in milliseconds, your strategic thinking could dismantle world-class teams, and your name was known in every gaming community on the planet. When the System awakened you, it was like the ultimate game had finally begun. The HUD, the stats, the skill trees—it all felt terrifyingly familiar. As if the games you'd been playing your whole life were just training simulations for this moment.",
		dangers: [
			"Overconfidence",
			"Gaming Addiction Relapse",
			"Physical Weakness",
			"Toxic Behavior",
		],
		image: "/generated/compendium/backgrounds/esports-champion.webp",
		source: "System Ascendant Canon",
	},
];
