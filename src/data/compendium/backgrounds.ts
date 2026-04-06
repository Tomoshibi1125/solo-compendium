// Backgrounds Compendium - Authoritative PDF Content
// Extracted from internal compendium data pack
// This is the authoritative source for backgrounds data - FULL ADMIN PRIVILEGES INTEGRATION
// Generated on: 2026-01-13T22:03:39.609Z
// 22 Backgrounds from Rift Ascendant Canon

export interface Background {
	id: string;
	name: string;
	type: string;
	rank: "D" | "C" | "B" | "A" | "S";
	// Rift Ascendant background features
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
	// Rift Ascendant specific
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
		id: "rift-displaced-contractor",
		name: "Rift-Displaced Contractor",
		type: "Background",
		rank: "C",
		skill_proficiencies: ["Stealth", "Perception", "Survival", "Investigation"],
		tool_proficiencies: ["Security Specialist Kit"],
		languages: ["Common", "System Dialect"],
		equipment: [
			"A set of tactical dark clothes",
			"A gate-shard combat knife",
			"A decrypted access card",
			"A small pouch containing 10 Credits",
			"Security Specialist Kit",
		],
		features: [
			{
				name: "Aetheric Affinity",
				description:
					"You have advantage on saving throws against being frightened. Your exposure to the rift allows you to see in dim light within 60 feet as if it were bright light.",
			},
			{
				name: "Urban Rift Navigation",
				description:
					"You can sense the subtle aetheric vibrations of nearby dimensional rifts within 300 feet and know their general direction, having survived the initial city-level cataclysm.",
			},
			{
				name: "Essence Discernment",
				description:
					"You can detect the presence of lingering aetheric energy in objects, allowing you to identify the raw potential of items without the use of high-tier sensory gear.",
			},
		],
		personalityTraits: [
			"I am constantly scanning the environment for high-value targets and escape routes.",
			"I prefer to keep my identity off-grid and avoid state-level surveillance.",
			"I trust only those who have bled beside me in a cleared gate.",
			"I find peace in the quiet hum of a latent rift, where the world is honest.",
		],
		ideals: [
			"Efficiency. Success is measured in extraction time and resource gain. (Neutral)",
			"Sovereignty. No one should control the gates but those who clear them. (Chaotic)",
			"Power. The Rift rewards those with the will to take it. (Evil)",
			"Discovery. I am driven to find the source of the Great Cataclysm. (Neutral)",
		],
		bonds: [
			"I will protect those who were left behind during the first Seoul Gate opening.",
			"I seek the truth about the corporate agencies that profit from rift-resource extraction.",
			"I carry the dog-tags of the squad I lost during my first gate breach.",
			"I owe my survival to a high-rank hunter who pulled me from the rubble.",
		],
		flaws: [
			"I am paranoid about System-monitored surveillance and tracking chips.",
			"I have flashbacks of the city's collapse that cloud my tactical judgment.",
			"I prioritize the mission over the safety of those I don't know.",
			"I am willing to bypass ethical mandates to secure a high-tier drop.",
		],
		image: "/generated/compendium/backgrounds/rift-displaced.webp",
		description:
			"A former professional—contractor, engineer, or investigator—whose life was shattered when a gate opened in their workplace. You didn't just survive the cataclysm; you learned to navigate the new world of rifts and hunters as an independent operator.",
		dangers: [
			"Post-Traumatic Stress",
			"System Desync",
			"Regulatory Audit",
			"Rift Attraction",
		],
		abilities: [
			"Enhanced Rift Resistance",
			"Urban Navigation",
			"Aetheric Affinity",
			"Essence Discernment",
		],
		source: "Rift Ascendant Canon",
	},
	{
		id: "gate-survivor",
		name: "Rift Survivor",
		type: "Background",
		rank: "S",
		skill_proficiencies: ["Survival", "Perception"],
		tool_proficiencies: ["Herbalism Kit"],
		languages: ["Common", "Primal Speech"],
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
					"You can feel vibrations that precede a dimensional rift opening. You have advantage on Sense (Perception) checks to detect planar disturbances, and you can sense when a rift will open within 1 mile up to 10 minutes before it manifests.",
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
		source: "Rift Ascendant Canon",
	},
	{
		id: "ascendant-academy-graduate",
		name: "Ascendant Academy Graduate",
		type: "Background",
		rank: "C",
		skill_proficiencies: ["Investigation", "Arcana"],
		tool_proficiencies: ["Cartographer's Tools"],
		languages: ["Common", "Star-Tongue"],
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
					"Your academic training allows you to identify rift types, Anomaly classifications, and dimensional anomalies. You have advantage on Intelligence checks to recall lore about rifts, gates, and dimensional entities.",
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
			"You graduated from the prestigious Ascendant Academy, receiving formal training in combat, magic, and dimensional theory. The Academy's rigorous curriculum covered rift classification, Anomaly taxonomy, essence manipulation, and tactical coordination.",
		dangers: [
			"Academic Rivals",
			"Organization Politics",
			"High Expectations",
			"Standardized Thinking",
		],
		image: "/generated/compendium/backgrounds/ascendant-academy-graduate.webp",
		source: "Rift Ascendant Canon",
	},
	{
		id: "guild-master",
		name: "Guild Master",
		type: "Background",
		rank: "C",
		skill_proficiencies: ["Persuasion", "Insight"],
		tool_proficiencies: ["Gaming Set (one of your choice)"],
		languages: ["Common", "Russian"],
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
		source: "Rift Ascendant Canon",
	},
	{
		id: "rift-scout",
		name: "Rift-Scout",
		type: "Background",
		rank: "B",
		skill_proficiencies: ["Arcana", "Survival", "Acrobatics", "Perception"],
		tool_proficiencies: ["Navigator's Tools"],
		languages: ["Common", "Aetheric Frequencies"],
		equipment: [
			"A set of reinforced traveler's clothes",
			"Navigator's tools (Aether-calibrated)",
			"A jagged fragment of unstable rift crystal",
			"A waterproof journal of gate-coordinates",
			"A belt pouch containing 10 Credits",
		],
		features: [
			{
				name: "Aether-Pathfinder",
				description:
					"You have an innate sense of orientation that works even within the distorted space of a gate. You cannot become lost by non-magical means while navigating a rift, and you have advantage on Sense (Survival) checks to track aetheric ripples.",
			},
			{
				name: "Spectral Adaptation",
				description:
					"Your body has adapted to the high-pressure aetheric flow of gate transitions. You are immune to the disorientation effects of crossing the threshold and have advantage on Vitality saving throws against environmental hazards within a gate.",
			},
		],
		personalityTraits: [
			"I compare everything to the bizarre landscapes I've seen inside the gates.",
			"I have an unsettling habit of sensing a gate opening before the authorities do.",
			"I carry a polaroid of my home city as it looked before the first cataclysm.",
			"I am remarkably unfazed by alien physics or reality-distortions.",
		],
		ideals: [
			"Discovery. Every gate holds the blueprints of our future. (Chaotic)",
			"Stability. The rifts are wounds on our world; I help heal them. (Lawful)",
			"Wonder. The rifts represent the next stage of human evolution. (Good)",
			"Utility. Each rift is a resource cache waiting to be harvested. (Evil)",
		],
		bonds: [
			"I was lost inside a gate for days during the first collapse; I quest to find others who were left behind.",
			"A veteran scout saved my life during a rift-rapture; I owe them my survival.",
			"I discovered a unique gate-anomaly and feel compelled to understand its origin.",
			"Something followed me out of a gate—a shadow that only I can see.",
		],
		flaws: [
			"I sometimes lose track of time while observing aetheric-shifts.",
			"I have trouble forming attachments because I always want to be back inside the rift.",
			"The high-concentrate aether has affected my memory—some days are a blur.",
			"I'm addicted to the sensation of crossing the gate-threshold.",
		],
		description:
			"A former hiker, urban explorer, or cartographer who was caught in a gate opening and survived. You've learned to navigate the sub-zero logic of the rift-realms, mapping the spaces between our world and the umbral domains. Your expertise is invaluable to guilds seeking to clear gates before they fully rupture.",
		dangers: [
			"Aether-Sickness",
			"Reality Drift",
			"Specter Attention",
			"Memory Fragmentation",
		],
		image: "/generated/compendium/backgrounds/rift-scout.webp",
		source: "Rift Ascendant Canon",
	},
	{
		id: "aetheric-pulse",
		name: "Aetheric Pulse",
		type: "Background",
		rank: "B",
		skill_proficiencies: ["Arcana", "Insight", "Perception"],
		tool_proficiencies: ["Aether-Calibration Kit"],
		languages: ["Common", "Aetheric Resonances"],
		equipment: [
			"A set of clothes with shimmering essence-residue",
			"Aether-calibration tools",
			"An essence-reactive crystal",
			"A vial of inert aetheric-fluid",
			"A belt pouch containing 10 Credits",
		],
		features: [
			{
				name: "Aether-Sensitivity",
				description:
					"You can feel the subtle pressure of aetheric energy in the air. You can detect active gates or high-rank essence signatures within 60 feet. This sensitivity allows you to sense the approach of gate-beasts moments before they manifest.",
			},
			{
				name: "Natural Resonance",
				description:
					"Your body is a conductor for ambient aether. Once per long rest, when you finish a short rest near an active gate or a powerful Regent-tomb, you can vent this pressure to regain a fraction of your expended potential (1st level spell slot or equivalent ability choice).",
			},
		],
		personalityTraits: [
			"My pupils pulse with faint blue light when I'm near high concentrations of aether.",
			"I instinctively touch objects to judge their essence-resonance.",
			"I speak about the Rift as though it were a living, breathing machine.",
			"I am deeply uncomfortable in the dead-zones where the Rift's presence is weak.",
		],
		ideals: [
			"Harmony. Aether is the lifeblood of the new world; we must respect its flow. (Good)",
			"Control. Raw power is a curse without the discipline to focus it. (Lawful)",
			"Freedom. The Rift should be accessible to all, not just the elite guilds. (Chaotic)",
			"Ascension. I was awakened for a purpose, and I will fulfill it. (Neutral)",
		],
		bonds: [
			"I lost my twin during our simultaneous awakening; I feel our resonance is still linked.",
			"A high-rank researcher helped me stabilize my pulse; I owe them my life.",
			"Special-interest guilds want to harvest my essence; I must stay ahead of them.",
			"The source of my frequency holds the truth of the Rift's arrival.",
		],
		flaws: [
			"I lose fine motor control when my resonance is too high.",
			"I look down on traditional 'Hunter-gear' as a crutch for the weak.",
			"I crave aetheric-peaks and take unnecessary risks to be near them.",
			"I disregard conventional technology, trusting only the aether's logic.",
		],
		description:
			"You are an 'Aetheric Pulse'—one of the rare modern individuals whose body awakened with an exceptionally high resonance frequency. Without any formal training, the Rift's power flows through you like an electric current. You weren't a mage in a fantasy realm; you were a student, a gamer, or a clerk whose biology was rewritten by the cataclysm.",
		dangers: [
			"Resonance Overload",
			"Guild Kidnapping",
			"System Desync",
			"Essence Burnout",
		],
		image: "/generated/compendium/backgrounds/aetheric-pulse.webp",
		source: "Rift Ascendant Canon",
	},
	{
		id: "regent-chosen",
		name: "Regent's Chosen",
		type: "Background",
		rank: "B",
		skill_proficiencies: ["Intimidation", "Arcana", "Insight"],
		tool_proficiencies: ["System-Decoder Kit"],
		languages: ["Common", "Elder Glyphics"],
		equipment: [
			"A dark coat bearing a spectral sigil",
			"A set of high-tier functional clothes",
			"A System-decoder kit",
			"A digital mandate of authority recognized by the guilds",
			"A belt pouch containing 20 Credits",
		],
		features: [
			{
				name: "Regent's Mark",
				description:
					"You bear the mark of a Regent—one of the apex gate-lords. You have advantage on Presence (Intimidation) checks against creatures of lower rank than your patron Regent, and gate-beasts that serve your Regent will not attack you unless provoked.",
			},
			{
				name: "Umbral Whisper",
				description:
					"Once per long rest, you can receive a Directives-flash—a cryptic sensation or vision from your Regent's domain. The Warden (Warden) determines if this is a warning or an order.",
			},
		],
		personalityTraits: [
			"I speak of my Regent as a force of nature, beyond human morality.",
			"I carry a burden of absolute confidence that borders on the divine.",
			"I test the 'spirit' of those I meet to see if they are worthy of the Rift's gaze.",
			"I am haunted by the scale of the world my Regent inhabits.",
		],
		ideals: [
			"Submission. The Regent's will is the only objective truth. (Lawful)",
			"Dominance. My patron rules a domain; I will rule this one. (Evil)",
			"Dissent. I am the Regent's chosen, not their slave. (Chaotic)",
			"Evolution. The Regent has shown me the path to the Next Stage. (Neutral)",
		],
		bonds: [
			"My Regent spared me while a gate Ruptured around me; I am their herald.",
			"I have a bitter rival—another Herald serving a competing Regent.",
			"I have a family whose safety depends on my continued service to the Gate-Lord.",
			"I am searching for the key to my Regent's final mandate.",
		],
		flaws: [
			"I follow my Regent's Directives without accounting for collateral damage.",
			"I am terrified of being 'replaced' if my utility to the Regent fails.",
			"The mark is slowly eroding my empathy for 'normal' humans.",
			"I look down on those who haven't been 'seen' by the high-rank lords.",
		],
		description:
			"You have been touched by a Regent—the absolute kings of the umbral domains. This isn't a fantasy pact; it's a System-directive written into your soul-signature. You were a modern person whose awakening was 'sponsored' by a being of unimaginable power. You are their eyes, their hands, and potentially their successor in the city you call home.",
		dangers: [
			"Regent Possession",
			"Rival Assassination",
			"Lore Fragmentation",
			"Obligation Branding",
		],
		image: "/generated/compendium/backgrounds/regents-chosen.webp",
		source: "Rift Ascendant Canon",
	},
	{
		id: "guardian-legionnaire",
		name: "Guardian Legionnaire",
		type: "Background",
		rank: "D",
		skill_proficiencies: ["Athletics", "Intimidation", "Survival"],
		tool_proficiencies: ["Tactical-Field Kit"],
		languages: ["Common", "Tactical Signals"],
		equipment: [
			"A legionnaire's tactical tabard",
			"A high-durability dark uniform",
			"A tactical-field kit",
			"A rank insignia badge",
			"A belt pouch containing 10 Credits",
		],
		features: [
			{
				name: "Legion Discipline",
				description:
					"When you are within 5 feet of an ally, you have advantage on saving throws against being frightened. You can use a bonus action to coordinate a defensive stance, granting an adjacent ally +2 to their AC until the start of your next turn.",
			},
			{
				name: "Gate-Line Stance",
				description:
					"You've been trained to hold the door. When you take the Dodge action within 10 feet of an active gate or rift, you gain resistance to all damage from non-boss enemies for that round.",
			},
		],
		personalityTraits: [
			"I still answer 'Sir' or 'Ma'am' to high-rank Hunters.",
			"I prioritize the perimeter and the evacuation route in every social setting.",
			"I feel most comfortable when my kit is clean and my boots are polished.",
			"I use military-shorthand and speak with an efficiency that scares civilians.",
		],
		ideals: [
			"Duty. The gates never sleep, and neither do we. (Lawful)",
			"Shield. I am the line between the city and the abyss. (Good)",
			"Survival. A dead Hunter clears no gates. (Neutral)",
			"Honor. I fight so my squad's names are remembered. (Any)",
		],
		bonds: [
			"I lost my squad during a 'Gate Rupture' in a major city center.",
			"My commander gave me the chance to awaken when I was just a private.",
			"I am hunting the specific rift-beast that wiped out my legion division.",
			"I will see the Shield-Corps restored to its former glory.",
		],
		flaws: [
			"I follow any order from a superior, even if it's tactically suicide.",
			"I ignore injuries to maintain the 'Front-Line' image.",
			"I am dismissive of non-combatant Hunters as 'baggage'.",
			"I solve every System-hitch with force before thinking.",
		],
		description:
			"You served in the Guardian Legion—the modern-day paramilitary force established to hold the line during Gate Ruptures. You weren't a fantasy knight; you were a soldier in a high-tech armor suit, holding a tactical shield against things that shouldn't exist. You've seen the rubble of fallen cities and the bravery of those who stayed to fight.",
		dangers: [
			"Battle Trauma",
			"Legion Debts",
			"Combat Addiction",
			"System Desync",
		],
		image: "/generated/compendium/backgrounds/guardian-legionnaire.webp",
		source: "Rift Ascendant Canon",
	},
	{
		id: "system-inscriber",
		name: "System Inscriber",
		type: "Background",
		rank: "B",
		skill_proficiencies: ["Arcana", "History", "Investigation"],
		tool_proficiencies: ["Calligrapher's Supplies", "Applied-Logic Kit"],
		languages: ["Common", "Numerical Glossolalia"],
		equipment: [
			"Calligrapher's supplies",
			"Applied-logic calibration tools",
			"A set of clean technician's clothes",
			"A encrypted rune reference codex",
			"A belt pouch containing 15 Credits",
		],
		features: [
			{
				name: "Decree Lore",
				description:
					"You can identify and read aetheric inscriptions of any origin. When you encounter a rune, you automatically know its source-domain and general Mandate. You have advantage on Intelligence (Arcana) checks to understand, activate, or disable System-wards and enchantments.",
			},
			{
				name: "Master Technician",
				description:
					"During a long rest, you can inscribe a temporary System-ward on a surface or object. The ward lasts for 24 hours and provides one effect: a faint proximity alert, aetheric illumination, or resistance to one damage type for the first breach.",
			},
		],
		personalityTraits: [
			"I absentmindedly trace geometric System-patterns on surfaces with my finger.",
			"I examine every aetheric inscription I encounter, even in active combat.",
			"I speak about the ancient rune-smiths as if they were early System-architects.",
			"I become frustrated when people treat Inscription as 'magic' instead of logic.",
		],
		ideals: [
			"Preservation. System-knowledge must be archived for the future. (Lawful)",
			"Discovery. Ancient Decrees hold secrets that could stabilize the gates. (Neutral)",
			"Access. Knowledge should be available to every Awakened soul. (Good)",
			"Optimization. I will craft codes more efficient than the Rift itself. (Any)",
		],
		bonds: [
			"I am searching for a legendary Decree said to grant dominion over a Gate-Lord's domain.",
			"My mentor died before passing on their final decryption key.",
			"An inscription I crafted malfunctioned during a raid; I seek to reclaim my reputation.",
			"I possess a Codex that the high-tier guilds would kill to obtain.",
		],
		flaws: [
			"I become obsessive when studying new System-codes, ignoring my own safety.",
			"I'm possessive of rare decryption data and reluctant to share my findings.",
			"I underestimate the danger of unstable Decrees, assuming my math is perfect.",
			"I feel vulnerable without my set of calibrated inscription-pens.",
		],
		description:
			"You are a System Inscriber—a modern intellectual who has mastered the art of applying System-logic to physical objects. You weren't a medieval rune-smith; you were a programmer, a linguist, or a calligrapher whose skills became the primary interface for enchanting Hunter equipment. Your knowledge of System-marks and Aetheric-loops makes you the backbone of any serious guild operation.",
		dangers: [
			"Logic Backlash",
			"Data Corruption",
			"Resource Theft",
			"Code Addiction",
		],
		image: "/generated/compendium/backgrounds/system-inscriber.webp",
		source: "Rift Ascendant Canon",
	},
	{
		id: "vault-warden",
		name: "Vault Warden",
		type: "Background",
		rank: "S",
		skill_proficiencies: ["Arcana", "History", "Investigation"],
		tool_proficiencies: ["Tinker's Tools"],
		languages: ["Common", "System High-Protocol"],
		equipment: [
			"A set of reinforced technician's clothes",
			"Tinker's tools",
			"A hard-linked artifact registry device",
			"Protective gloves woven with containment resonance",
			"A belt pouch containing 15 Credits",
		],
		features: [
			{
				name: "Relic Sensitivity",
				description:
					"Your long exposure to System-artifacts has made you sensitive to their auras. You can determine whether an object is high-tier by handling it for 1 minute (no Aether-Sight required). You also have advantage on Intelligence checks to identify the properties and System-history of Awakened items.",
			},
			{
				name: "Containment Mandates",
				description:
					"You know the proper Decrees for safely handling volatile gate-born items. You have advantage on saving throws against cursed System-relics, and when you examine a tainted item, you become aware of its hidden logic before it takes effect on you.",
			},
		],
		personalityTraits: [
			"I handle all objects—magical or not—with extreme care and clinical reverence.",
			"I catalog every System-hitch obsessively, cross-referencing logs and histories.",
			"I get visibly distressed when someone mishandles a stable aether-cell.",
			"I speak about relics as if they were complex programs with their own agendas.",
		],
		ideals: [
			"Stewardship. These artifacts are part of a global archive—we merely watch them. (Good)",
			"Archiving. Every relic tells a story of the Cataclysm that must be indexed. (Neutral)",
			"Security. Dangerous logic must be locked away from those who would overwrite our world. (Lawful)",
			"Utilitarianism. The most powerful artifacts should be cleared for field use. (Evil)",
		],
		bonds: [
			"I am the last warden of a private vault that must never be bridged.",
			"An artifact I was monitoring was extracted by a rogue guild; I must recover it.",
			"My predecessor entrusted me with a Master Key that accesses the Academy's inner vault.",
			"A particular relic whispers System-logs to me in my sleep.",
		],
		flaws: [
			"I trust archived relics more than people—they are consistent.",
			"I am tempted to use the high-tier relics I am assigned to monitor.",
			"I struggle to let go of any item that has a unique essence-signature.",
			"I am rigid about security Decrees and become unreasonable in high-stress breaches.",
		],
		description:
			"You are a Vault Warden—a specialist in the containment and study of System-artifacts. You weren't a temple guardian; you were a high-security professional, a museum archivist, or a laboratory technician whose job changed when 'artifacts' replaced art. You've managed enough high-rank resonance to know that sometimes the items are studying you as much as you are studying them.",
		dangers: [
			"Relic Corruption",
			"Guild Infiltration",
			"Responsibility Burden",
			"Signature Bonding",
		],
		image: "/generated/compendium/backgrounds/vault-warden.webp",
		source: "Rift Ascendant Canon",
	},
	{
		id: "breach-tactician",
		name: "Elite Breach-Tactician",
		type: "Background",
		rank: "A",
		skill_proficiencies: ["Athletics", "Nature", "Analysis"],
		tool_proficiencies: ["Biological-Scanner Kit"],
		languages: ["Common", "Anomaly Classifiers"],
		equipment: [
			"A trophy from a high-rank gate boss",
			"Biological-scanner tools",
			"A set of high-durability tactical clothes",
			"A digital hunting log with specific Regent-weaknesses",
			"A belt pouch containing 15 Credits",
		],
		features: [
			{
				name: "Boss-Sense",
				description:
					"You can identify major gate-boss classifications by their mana-prints, lairs, or territorial logic. You have advantage on Sense (Survival) checks to track high-rank entities and on Intelligence (Nature) checks to recall information about Regent-servants.",
			},
			{
				name: "Slayer's Reputation",
				description:
					"Guilds and settlements in high-risk gate zones treat you with veteran respect, offering discounted gear and premium intel. However, high-rank gate entities can sense your predatory intent and will prioritize you as the primary threat.",
			},
		],
		personalityTraits: [
			"I recount my cleared gates in tactical terms—every scar is a data-point.",
			"I instinctively scan the ceiling and the shadows when I enter an un-cleared zone.",
			"I am clinical and methodical in combat—panic is a System-error.",
			"I harvest high-value materials and know the market value of every essence-shard.",
		],
		ideals: [
			"Defense. I clear gates so the city doesn't have to witness a Rupture. (Good)",
			"Mastery. The ultimate clear is the only goal that matters. (Chaotic)",
			"Pragmatism. Every gate is a puzzle; every Boss has a solution. (Neutral)",
			"Legacy. I want my clear-times to be the standard for a thousand years. (Any)",
		],
		bonds: [
			"I hunt to avenge the district I lost during a high-rank Gate Rupture.",
			"A high-rank entity spared me once—I've spent years analyzing why.",
			"I belong to an elite clearing-squad bound by tactical cohesion.",
			"I carry a prototype weapon recovered from a redacted gate mission.",
		],
		flaws: [
			"I am arrogant when facing anything lower than a B-Rank gate.",
			"I see gate-corruption in everything and can be paranoid about civilians.",
			"I disregard lower-rank threats as trivial, leading to tactical oversights.",
			"The adrenaline of the breach has become my only focus.",
		],
		description:
			"You are an Elite Breach-Tactician—a specialist who has successfully cleared high-rank gates and survived encounters with the Regents' generals. You weren't a medieval dragon slayer; you were a veteran hunter, a tactical lead, or a breach-specialist whose name is synonymous with survival. You know where to hit, when the Rift pulses, and how to use a Gate's own logic to bring it down.",
		dangers: [
			"Target Assignment",
			"Guild Espionage",
			"Adrenaline Burnout",
			"Logic Overload",
		],
		image: "/generated/compendium/backgrounds/breach-tactician.webp",
		source: "Rift Ascendant Canon",
	},
	{
		id: "occult-investigator",
		name: "Occult Investigator",
		type: "Background",
		rank: "D",
		skill_proficiencies: ["Religion", "Insight", "Investigation"],
		tool_proficiencies: ["System-Analysis Kit"],
		languages: ["Common", "Umbral Frequencies"],
		equipment: [
			"A set of dark-stained professional clothes",
			"A vial of stabilized aetheric-wash",
			"A collection of System-signatures",
			"A journal of high-rank Regent-servants (partial)",
			"A belt pouch containing 10 Credits",
		],
		features: [
			{
				name: "Umbral Lore",
				description:
					"You can identify umbral-beast types by their aether-residue, audio-prints, or the distortion they leave in the Rift. You have advantage on Intelligence checks related to spectral entities and Regent-servants.",
			},
			{
				name: "Detection Mandate",
				description:
					"During a short rest, you can set up a tether-field in a 15-foot radius. Spectral entities have disadvantage on attack rolls while within the field, and you are immediately alerted if any 'invisible' entity enters the perimeter.",
			},
		],
		personalityTraits: [
			"I check every corner and every mirror for System-shadows.",
			"I examine a person's aether-signature when I meet them, looking for taint.",
			"I carry a specialized detection-chip and check its frequency without thinking.",
			"I speak bluntly about the darkness—I've seen too much to play at hope.",
		],
		ideals: [
			"Purification. The Rift-taint must be removed from our cities. (Good)",
			"Vigilance. The abyss never sleeps; its servants stay in our shadows. (Lawful)",
			"Knowledge. Understanding the Anomaly is the first step to deleting it. (Neutral)",
			"Vengeance. The Regents took my city; I will take their secrets. (Chaotic)",
		],
		bonds: [
			"An umbral-beast killed my partner during a precinct investigation; I hunt its print.",
			"My unit of spectral-investigators was wiped out in a redacted operation.",
			"I salvaged a unique piece of Regent-tech that I must keep hidden from the guilds.",
			"A particular System-echo has been following me since my awakening.",
		],
		flaws: [
			"I see Regent influence behind every act of corporate cruelty.",
			"I am ruthless in pursuit of aether-beats, sometimes endangering civilians.",
			"The horrors I've indexed have made me cold and unresponsive.",
			"I struggle to trust other hunters, fearing they might be Regent-hollows.",
		],
		description:
			"You are an Occult Investigator—a modern professional who specializes in hunting the things the Rift doesn't want you to see. You weren't a priest or a monk; you were a detective, a private investigator, or a tech-analyst whose awakening gave you the eyes to see the ghosts in the machine. You know how to track an umbral-beat, how to ward a modern apartment, and how to survive when the shadows start moving.",
		dangers: [
			"Spectral Retribution",
			"Signature Erosion",
			"Shadow Attraction",
			"Mental Corruption",
		],
		image: "/generated/compendium/backgrounds/occult-investigator.webp",
		source: "Rift Ascendant Canon",
	},
	{
		id: "echo-synchronizer",
		name: "Echo-Synchronizer",
		type: "Background",
		rank: "A",
		skill_proficiencies: ["Insight", "History", "Investigation"],
		tool_proficiencies: ["Temporal-Resonance Kit"],
		languages: ["Common", "Anachronic Codes"],
		equipment: [
			"A set of chronally-displaced clothes",
			"A temporal-resonance scanner",
			"A stopped watch that ticks at System-Ruptures",
			"A journal of events that haven't happened yet (fragmented)",
			"A belt pouch containing 15 Credits",
		],
		features: [
			{
				name: "Echo-Sense",
				description:
					"You can feel the ghosting of the Rift's timeline. You have advantage on Initiative rolls and cannot be surprised as long as you are conscious. You can perceive 'Echoes' of past and future breaches within a 60-foot radius.",
			},
			{
				name: "Temporal Buffer",
				description:
					"Your soul is slightly out of sync with the current Mandate. Once per long rest, you can use your reaction to force a re-roll of an attack against you, having witnessed the strike seconds before it occurred. You must take the new result.",
			},
		],
		personalityTraits: [
			"I sometimes answer questions before they are asked.",
			"I am fixated on precision and timing, appearing jittery to others.",
			"I speak about the Great Cataclysm as if it's still happening in another room.",
			"I treat every day as a gift that I've already lost at least once.",
		],
		ideals: [
			"Calibration. The timeline must be stabilized for the sake of the future. (Lawful)",
			"Presence. All that matters is the Now; everything else is just data. (Neutral)",
			"Warning. I will prevent the breaches I have already seen. (Good)",
			"Causality. The Rift's logic is the only destiny I accept. (Any)",
		],
		bonds: [
			"I am trying to find the specific temporal-gate that displaced me.",
			"A person I haven't met yet saved me in a future that won't happen unless I act.",
			"I carry a keycard to a research facility that won't be built for ten years.",
			"I am hunting the 'Gate-Warden'—the Regent-servant that guards the temporal-veins.",
		],
		flaws: [
			"I sometimes speak in the future-tense, confusing my allies.",
			"I have difficulty forming deep bonds because I've 'seen' how they end.",
			"I am prone to 'Temporal-Shakes'—visible vibrations when I'm stressed.",
			"I ignore current risks because I'm focused on potential futures.",
		],
		description:
			"You are an Echo-Synchronizer—one of the few modern people who survived a temporal-distortion gate. You weren't a time traveler in a fantasy ship; you were a regular person who got caught in a glitching rift and came back 'wrong'. You the see the ghosts of the Rift's calculations, giving you a terrifying edge in combat but leaving you forever out of sync with the world you are trying to save.",
		dangers: [
			"Timeline Erosion",
			"Echo Overlap",
			"Warden Attention",
			"Reality Rejection",
		],
		image: "/generated/compendium/backgrounds/echo-synchronizer.webp",
		source: "Rift Ascendant Canon",
	},
	{
		id: "reality-bender",
		name: "Reality Bender",
		type: "Background",
		rank: "C",
		skill_proficiencies: ["Arcana", "Investigation"],
		tool_proficiencies: ["Glassblower's Tools"],
		languages: ["Common", "Dimensional Frequency"],
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
		source: "Rift Ascendant Canon",
	},
	{
		id: "void-touched",
		name: "Void Touched",
		type: "Background",
		rank: "S",
		skill_proficiencies: ["Arcana", "Stealth"],
		tool_proficiencies: ["Disguise Kit"],
		languages: ["Common", "Dimensional Frequency"],
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
		source: "Rift Ascendant Canon",
	},
	{
		id: "star-born",
		name: "Star Born",
		type: "Background",
		rank: "S",
		skill_proficiencies: ["Arcana", "Religion"],
		tool_proficiencies: ["Navigator's Tools"],
		languages: ["Common", "Star-Tongue"],
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
				name: "Stellar Fortitude",
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
			"Stellar Obligations",
			"Humanity Drift",
			"Star Sickness",
		],
		image: "/generated/compendium/backgrounds/star-born.webp",
		source: "Rift Ascendant Canon",
	},
	{
		id: "ancient-guardian",
		name: "Ancient Guardian",
		type: "Background",
		rank: "S",
		skill_proficiencies: ["History", "Perception"],
		tool_proficiencies: ["Mason's Tools"],
		languages: ["Common", "Primal Speech"],
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
					"You cannot be surprised while you are conscious. You have advantage on Sense (Perception) checks to detect hidden creatures or objects in structures, ruins, or underground environments.",
			},
			{
				name: "Timeless Lore",
				description:
					"You have advantage on Intelligence (History) checks, and when you encounter ancient ruins, artifacts, or inscriptions, the Decree Warden (Warden) may provide you with additional information about their origin and purpose.",
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
			"You are an ancient being tasked with protecting something of immense importance. Your long life has given you sense and perspective that few can match, but it has also left you disconnected from the rapid pace of modern times.",
		dangers: [
			"Usurper Threats",
			"Kingdom Ghosts",
			"Responsibility Weight",
			"Power Isolation",
		],
		image: "/generated/compendium/backgrounds/ancient-guardian.webp",
		source: "Rift Ascendant Canon",
	},
	{
		id: "forgotten-king",
		name: "Forgotten King",
		type: "Background",
		rank: "A",
		skill_proficiencies: ["Persuasion", "History"],
		tool_proficiencies: ["Gaming Set (Chess)"],
		languages: ["Common", "Japanese"],
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
					"You have advantage on Presence (Persuasion) checks when negotiating with nobles, officials, and leaders. Common folk instinctively defer to you, offering respectful treatment and accommodation.",
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
			"Sense. The fall of my kingdom taught me humility I lacked as a ruler. (Neutral)",
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
		source: "Rift Ascendant Canon",
	},
	{
		id: "champion-of-light",
		name: "Champion of Light",
		type: "Background",
		rank: "A",
		skill_proficiencies: ["Religion", "Medicine"],
		tool_proficiencies: ["Herbalism Kit"],
		languages: ["Common", "Star-Tongue"],
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
					"Once per long rest, you can inspire an ally within 30 feet who can see or hear you. They gain temporary hit points equal to your level + your Presence modifier and have advantage on their next saving throw.",
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
		source: "Rift Ascendant Canon",
	},
	{
		id: "bringer-of-dawn",
		name: "Bringer of Dawn",
		type: "Background",
		rank: "D",
		skill_proficiencies: ["Performance", "Persuasion"],
		tool_proficiencies: ["Musical Instrument (one of your choice)"],
		languages: ["Common"],
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
			"You are a beacon of hope in a world increasingly consumed by umbral and dimensional horror. Whether through song, story, healing, or simply your unwavering presence, you bring light to dark places and courage to the despairing. The Rift may have given humanity power, but you remind them why that power is worth wielding.",
		dangers: [
			"Isolation",
			"Information Overload",
			"Helplessness",
			"Memory Burden",
		],
		image: "/generated/compendium/backgrounds/bringer-of-dawn.webp",
		source: "Rift Ascendant Canon",
	},
	{
		id: "eternal-watcher",
		name: "Eternal Watcher",
		type: "Background",
		rank: "B",
		skill_proficiencies: ["Perception", "Investigation"],
		tool_proficiencies: ["Spyglass"],
		languages: ["Common", "Japanese"],
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
					"Your centuries of observation have honed your senses to supernatural sharpness. You have advantage on Sense (Perception) checks to notice hidden details, and you can read lips from up to 120 feet away. You also have advantage on Intelligence (Investigation) checks to spot inconsistencies or forgeries.",
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
		source: "Rift Ascendant Canon",
	},
	{
		id: "cosmic-wanderer",
		name: "Cosmic Wanderer",
		type: "Background",
		rank: "B",
		skill_proficiencies: ["Survival", "Insight"],
		tool_proficiencies: ["Cook's Utensils"],
		languages: ["Common", "Primal Speech"],
		equipment: [
			"A set of well-worn traveler's clothes",
			"Cook's utensils",
			"A walking staff carved with symbols from many worlds",
			"A collection of souvenirs from different dimensions",
			"A belt pouch containing 10 Credits",
		],
		features: [
			{
				name: "Wanderer's Sense",
				description:
					"Your travels have taught you to adapt to any environment. You can find food and fresh water for yourself and up to five other people each day in any environment, including dimensions with hostile atmospheres. You also have advantage on Sense (Survival) checks in unfamiliar terrain.",
			},
			{
				name: "Cosmic Perspective",
				description:
					"Having seen the vastness of existence, you are difficult to deceive or intimidate. You have advantage on Sense (Insight) checks to determine if someone is lying, and advantage on saving throws against being frightened by creatures of CR 5 or lower.",
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
			"Sense. Travel teaches lessons that books never can. (Neutral)",
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
		source: "Rift Ascendant Canon",
	},

	// ── MODERN-DAY BACKGROUNDS ───────────────────────────────────────────
	{
		id: "viral-streamer",
		name: "Viral Streamer",
		type: "Background",
		rank: "C",
		skill_proficiencies: ["Performance", "Persuasion"],
		tool_proficiencies: ["Streaming Equipment", "Video Editing Software"],
		languages: ["Common"],
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
					"Your online following gives you access to information networks. You can spend 1 hour broadcasting a request to your followers to gain advantage on one Intelligence (Investigation) or Presence (Persuasion) check within the next 24 hours as your audience crowdsources answers or applies social pressure.",
			},
			{
				name: "Content Creator's Eye",
				description:
					"You have an instinct for what captures attention. You have advantage on Sense (Perception) checks to notice unusual or noteworthy events happening around you.",
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
			"Before the Rift chose you, you were already famous—or at least internet-famous. Your live streams, reaction videos, or documentary content had built an audience of thousands, maybe millions. When gates started opening and ascendants started awakening, you pointed your camera at the chaos and never looked away. Now that you've awakened yourself, your audience watches your ascension in real time.",
		dangers: [
			"Doxxing",
			"Corporate Exploitation",
			"Parasocial Stalkers",
			"Content Addiction",
		],
		image: "/generated/compendium/backgrounds/viral-streamer.webp",
		source: "Rift Ascendant Canon",
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
					"Your years of idol training have given you supernatural presence. When you perform for at least 1 minute, all friendly creatures within 30 feet gain temporary hit points equal to your Presence modifier + your proficiency bonus. This can be used once per short rest.",
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
			"You were one of the brightest stars in the entertainment industry—a trained performer whose face graced billboards, whose songs topped charts, and whose every movement was choreographed to perfection. Then the Rift awakened you, and suddenly your stage presence became something far more dangerous. Your fans now watch you fight Anomalies instead of performing, and somehow, you make even that look beautiful.",
		dangers: [
			"Paparazzi Exposure",
			"Agency Debt",
			"Sasaeng Stalkers",
			"Identity Crisis",
		],
		image: "/generated/compendium/backgrounds/kpop-idol.webp",
		source: "Rift Ascendant Canon",
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
					"Your acting training lets you assume identities with frightening accuracy. You have advantage on Presence (Deception) checks when impersonating a specific person you have observed for at least 10 minutes. Additionally, you can perfectly mimic accents and speech patterns.",
			},
			{
				name: "Celebrity Status",
				description:
					"Your fame opens doors. You can gain access to exclusive locations, VIP areas, and high-society events. Important NPCs are more likely to grant you an audience, giving you advantage on the first Presence check when meeting someone who recognizes you.",
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
			"Hollywood royalty, box office gold, the face that launched a thousand franchises—that was your life before the gates. You had everything: mansions, private jets, adoring fans. Then the Rift chose you, and suddenly the action scenes weren't choreographed anymore. The Anomalies were real. The stakes were real. And for the first time in your career, no one was going to yell 'cut.'",
		dangers: [
			"Tabloid Exposure",
			"Stalker Fans",
			"Typecasting",
			"Reality Dissociation",
		],
		image: "/generated/compendium/backgrounds/movie-star.webp",
		source: "Rift Ascendant Canon",
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
					"Your professional training has pushed your body to its limits. You can add your proficiency bonus to Vitality saving throws against exhaustion, and you require only 4 hours of sleep to gain the benefits of a long rest.",
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
			"You were at the top of your game—a professional athlete whose name was synonymous with peak human performance. Your body was a finely tuned instrument, honed through years of brutal training and competition. When the Rift awakened you, it took that foundation and built something superhuman on top of it. Now you compete on a very different field, where the losers don't go home—they don't go anywhere at all.",
		dangers: [
			"Career-Ending Injury",
			"Performance-Enhancing Temptation",
			"Sponsor Pressure",
			"Burnout",
		],
		image: "/generated/compendium/backgrounds/pro-athlete.webp",
		source: "Rift Ascendant Canon",
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
					"You are ruthlessly effective in negotiations. When you engage in a contested Presence check during negotiations, you can treat a roll of 9 or lower as a 10.",
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
			"Innovation. The old world is dying. The Rift is the future, and I will shape it. (Any)",
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
			"Corner office, seven-figure salary, a name that made markets move—you were a titan of industry before the gates changed everything. You managed portfolios worth more than some countries' GDP and made decisions that affected millions. When the Rift awakened you, you treated it like any other hostile takeover: assess, strategize, dominate. The boardroom prepared you for battle better than anyone expected.",
		dangers: [
			"Corporate Espionage",
			"Hostile Takeover",
			"Burnout",
			"Moral Compromise",
		],
		image: "/generated/compendium/backgrounds/corporate-executive.webp",
		source: "Rift Ascendant Canon",
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
			"The Rift's code structure reminds me of something I've seen before, and I need to find the connection.",
			"A fellow hacker was forcibly recruited by a umbral organization—I'm going to get them out.",
		],
		flaws: [
			"I trust machines more than people.",
			"I am paranoid about surveillance and sometimes see conspiracies where there are none.",
			"I can't resist poking at secure systems, even when it's suicidal to try.",
			"I've spent so long online that I have serious difficulty with face-to-face social interaction.",
		],
		description:
			"In the digital umbrals, you were a ghost—a phantom who moved through firewalls like they were tissue paper. Governments feared your keystrokes, corporations trembled at your handle. When the Rift awakened you, you realized that reality itself was just another system to hack. The code that underlies gates, essence, and ascension looks hauntingly familiar to someone who's spent their whole life reading between the lines of code.",
		dangers: [
			"Government Surveillance",
			"Cyberattack Retaliation",
			"Digital Addiction",
			"Identity Erasure",
		],
		image: "/generated/compendium/backgrounds/underground-hacker.webp",
		source: "Rift Ascendant Canon",
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
					"You can sway public opinion with a single post. Once per long rest, you can make a Presence (Persuasion) check to influence the attitude of a community or organization toward a person, idea, or cause. The DC is set by the Warden based on how controversial the stance is.",
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
			"Likes, shares, followers, brand deals—that was your world. You built an empire of content, turning your personality into a product and your life into a performance. When the Rift chose you, your audience exploded overnight. Millions now watch an influencer fight actual Anomalies, and the engagement has never been better. But behind the filters and the curated feeds, you're starting to realize that the person your followers love might not be the person you actually are.",
		dangers: [
			"Cancel Culture",
			"Brand Dependency",
			"Authenticity Crisis",
			"Doxxing",
		],
		image: "/generated/compendium/backgrounds/social-media-influencer.webp",
		source: "Rift Ascendant Canon",
	},
	{
		id: "Rift-Leagues-champion",
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
			"My former Rift-Leagues team was my real family—I'd queue into an S-Rank gate for them.",
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
			"You were the best—or close to it. Your reflexes were measured in milliseconds, your strategic thinking could dismantle world-class teams, and your name was known in every gaming community on the planet. When the Rift awakened you, it was like the ultimate game had finally begun. The Aether-Sight, the stats, the skill trees—it all felt terrifyingly familiar. As if the games you'd been playing your whole life were just training grounds for this moment.",
		dangers: [
			"Overconfidence",
			"Gaming Addiction Relapse",
			"Physical Weakness",
			"Toxic Behavior",
		],
		image: "/generated/compendium/backgrounds/Rift-Leagues-champion.webp",
		source: "Rift Ascendant Canon",
	},
];
