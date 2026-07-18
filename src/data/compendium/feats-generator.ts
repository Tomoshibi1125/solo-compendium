import type { CompendiumFeat } from "../../types/compendium";

// ─── Helpers ───────────────────────────────────────────────

// ─── Tier 1: Awakening Feats (level 1, no ASI) ────────────
const awakeningFeats: CompendiumFeat[] = [
	{
		id: "gate-survivor",
		name: "Rift Survivor",
		display_name: "Rift Survivor",
		description:
			"You survived a Rift Break before your Awakening — the ambient mana scarred your nervous system into a permanent state of threat-readiness. You have advantage on saving throws against being frightened by rift-born anomalies. Your hit point maximum increases by your character level.",
		flavor:
			"The sirens went off at 3 AM. By dawn, half the district was rubble. You walked out.",
		tags: ["awakened", "feat", "awakening", "defensive"],
		rarity: "common",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "Advantage on saves vs. fear from gate-born creatures.",
			secondary: "HP maximum increases by character level.",
		},
		repeatable: false,
		mechanics: {
			action_type: "Passive",
			duration: "Permanent",
			damage_profile: "N/A",
			range: "Self",
		},
		limitations: {
			uses: "Permanent",
			recharge: "N/A",
			requires_attunement: false,
			conditions: [],
		},
		discovery_lore:
			"Documented by Bureau psychologists studying pre-Awakening trauma survivors who later manifested heightened mana sensitivity.",
		theme_tags: ["survival", "trauma", "gate-break"],
	},
	{
		id: "bureau-analyst",
		name: "Bureau Analyst",
		display_name: "Bureau Analyst",
		description:
			"You trained under the Ascendant Bureau's intelligence division before fieldwork. You add your proficiency bonus to Intelligence (Investigation) checks involving Rift data, Rift mapping, or anomaly classification. You can read Bureau-classified documents and identify forged credentials on sight.",
		flavor: "The Bureau has a file on everything. You wrote half of them.",
		tags: ["awakened", "feat", "awakening", "utility"],
		rarity: "common",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary:
				"Add proficiency bonus to Investigation checks for Rift/anomaly data.",
			secondary: "Read Bureau-classified documents; detect forged credentials.",
		},
		repeatable: false,
		mechanics: {
			action_type: "Passive",
			duration: "Permanent",
			damage_profile: "N/A",
			range: "Self",
		},
		limitations: {
			uses: "Permanent",
			recharge: "N/A",
			requires_attunement: false,
			conditions: [],
		},
		discovery_lore:
			"Standard Bureau intake curriculum, expanded after the Meridian City Intelligence Breach proved how many field agents couldn't read a gate-frequency chart.",
		theme_tags: ["bureau", "intelligence", "analysis"],
	},
	{
		id: "street-hunter",
		name: "Street Ascendant",
		display_name: "Street Ascendant",
		description:
			"You learned to fight in the unregulated gate-adjacent districts before the Bureau found you. You ignore difficult terrain in urban environments. You have advantage on Stealth checks in crowds of 10 or more people, and you can use a bonus action to Hide when within 5 feet of two or more non-hostile creatures.",
		flavor:
			"Licensed ascendants clear Rifts. Street ascendants clear everything else.",
		tags: ["awakened", "feat", "awakening", "mobility"],
		rarity: "common",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "Ignore difficult terrain in urban environments.",
			secondary:
				"Advantage on Stealth in crowds; bonus action to Hide near non-hostile creatures.",
		},
		repeatable: false,
		mechanics: {
			action_type: "Passive",
			duration: "Permanent",
			damage_profile: "N/A",
			range: "Self",
		},
		limitations: {
			uses: "Permanent",
			recharge: "N/A",
			requires_attunement: false,
			conditions: [],
		},
		discovery_lore:
			"The Bureau eventually formalized this as a training module after E-Rank street ascendants consistently outperformed licensed C-Ranks in urban Rift Break scenarios.",
		theme_tags: ["urban", "stealth", "street"],
	},
	{
		id: "mana-sensitive",
		name: "Mana Sensitive",
		display_name: "Mana Sensitive",
		description:
			"Your Awakening left your mana receptors permanently dilated. You can detect active Rift seams within 60 feet, even through walls up to 1 foot thick. You can identify whether a creature is Awakened by observing it for one round. You have advantage on Sense (Perception) checks to notice magical auras or mana disturbances.",
		flavor:
			"Your eyes hurt near hospitals. Too much mana leaking from the healing wards.",
		tags: ["awakened", "feat", "awakening", "sense"],
		rarity: "common",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "Detect Rift seams within 60 feet through thin walls.",
			secondary:
				"Identify Awakened creatures; advantage on Perception for magical auras.",
		},
		repeatable: false,
		mechanics: {
			action_type: "Passive",
			duration: "Permanent",
			damage_profile: "N/A",
			range: "60 feet",
		},
		limitations: {
			uses: "Permanent",
			recharge: "N/A",
			requires_attunement: false,
			conditions: [],
		},
		discovery_lore:
			"First catalogued after a D-Rank Ascendant in Harrow Bay alerted authorities to a forming Rift six hours before any Bureau sensor detected it.",
		theme_tags: ["detection", "mana", "perception"],
	},
	{
		id: "guild-medic-training",
		name: "Guild Medic Training",
		display_name: "Guild Medic Training",
		description:
			"You completed field medic certification through a licensed Ascendant Guild. When you use a Healer's Kit to stabilize a creature, that creature also regains 1 hit point. You can spend one use of a Healer's Kit as an action to restore hit dice equal to your proficiency bonus to a willing creature, which it can immediately spend to heal.",
		flavor:
			"The Guild pays for the certification. The Rift teaches you how to use it.",
		tags: ["awakened", "feat", "awakening", "healing"],
		rarity: "common",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary:
				"Stabilized creatures regain 1 HP. Spend Healer's Kit use to grant hit dice recovery.",
			secondary: "Proficiency bonus hit dice restored per Healer's Kit use.",
		},
		repeatable: false,
		mechanics: {
			action_type: "Active",
			duration: "Instantaneous",
			damage_profile: "N/A",
			range: "Touch",
			action: "1 action",
		},
		limitations: {
			uses: "Limited by Healer's Kit charges",
			recharge: "N/A",
			requires_attunement: false,
			conditions: ["Requires Healer's Kit"],
		},
		discovery_lore:
			"Standardized after the Vantage Isle Raid, where 60% of casualties were attributed to delayed medical response inside the Rift.",
		theme_tags: ["healing", "guild", "support"],
	},
	{
		id: "dungeon-crawler",
		name: "Rift Crawler",
		display_name: "Rift Crawler",
		description:
			"Hundreds of Rift clears have honed your spatial awareness in enclosed environments. You have darkvision out to 30 feet (or extend existing darkvision by 30 feet). You have advantage on Sense (Perception) checks to detect traps, hidden doors, and environmental hazards within Rifts or Rift instances. You can move through spaces sized for creatures one size smaller without squeezing.",
		flavor: "You've been inside more Rifts than some Rifts have been open.",
		tags: ["awakened", "feat", "awakening", "exploration"],
		rarity: "common",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary:
				"Darkvision 30 feet (or +30 feet); advantage on trap/hazard detection.",
			secondary: "Move through spaces for creatures one size smaller.",
		},
		repeatable: false,
		mechanics: {
			action_type: "Passive",
			duration: "Permanent",
			damage_profile: "N/A",
			range: "Self",
		},
		limitations: {
			uses: "Permanent",
			recharge: "N/A",
			requires_attunement: false,
			conditions: [],
		},
		discovery_lore:
			"Evolved informally among independent Ascendants who couldn't afford Guild support teams and had to clear low-rank Rifts solo for income.",
		theme_tags: ["dungeon", "exploration", "spatial"],
	},
	{
		id: "mana-circuit-primer",
		name: "Mana Circuit Primer",
		display_name: "Mana Circuit Primer",
		description:
			"Your mana circuits were primed during Awakening with unusual efficiency. You learn one cantrip of your choice from any spell list for which you have class access. Your spellcasting ability for this cantrip matches the class from which you chose it. Additionally, you can cast a 1st-rank spell you know without expending a spell slot. Once you do so, you must finish a long rest before you can do so again.",
		flavor:
			"Most Awakened need months to cast their first spell. You did it during the measurement exam.",
		tags: ["awakened", "feat", "awakening", "spellcasting"],
		rarity: "common",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "Learn one cantrip from your class spell list.",
			secondary: "Cast one 1st-rank spell without a slot, once per long rest.",
		},
		repeatable: false,
		mechanics: {
			action_type: "Active",
			duration: "Permanent",
			damage_profile: "N/A",
			range: "Self",
		},
		limitations: {
			uses: "1/long rest (free 1st-rank cast)",
			recharge: "Long rest",
			requires_attunement: false,
			conditions: ["Must have spellcasting or power access"],
		},
		discovery_lore:
			"The Academy of High Magic identified this circuit pattern in roughly 3% of new Awakened during the annual intake assessment.",
		theme_tags: ["spellcasting", "cantrip", "mana-circuit"],
	},
	{
		id: "resonance-athlete",
		name: "Resonance Athlete",
		display_name: "Resonance Athlete",
		description:
			"Your Awakened physiology enhances raw athleticism beyond human limits. Your walking speed increases by 5 feet. When you are prone, standing up uses only 5 feet of movement. Climbing and swimming no longer cost you extra movement. You can make a running long jump or high jump after moving only 5 feet on foot, rather than 10.",
		flavor:
			"Bureau fitness tests had to recalibrate after you bent the pull-up bar.",
		tags: ["awakened", "feat", "awakening", "physical"],
		rarity: "common",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "+5 feet walking speed; standing from prone costs only 5 feet.",
			secondary: "No extra cost for climbing/swimming; shorter jump run-up.",
		},
		repeatable: false,
		mechanics: {
			action_type: "Passive",
			duration: "Permanent",
			damage_profile: "N/A",
			range: "Self",
		},
		limitations: {
			uses: "Permanent",
			recharge: "N/A",
			requires_attunement: false,
			conditions: [],
		},
		discovery_lore:
			"A Bureau kinesiologist published the first paper connecting Awakening-altered muscle fiber density to measurable athletic improvement.",
		theme_tags: ["athletic", "speed", "physical"],
	},
	{
		id: "gate-linguist",
		name: "Rift Linguist",
		display_name: "Rift Linguist",
		description:
			"Prolonged Rift exposure has imprinted fragments of anomalous languages into your subconscious. You can speak, read, and write two additional languages of your choice. You can attempt to decipher gate-born inscriptions, anomaly vocalizations, and rune scripts by making an Intelligence check (DC 15, or DC 10 if the source shares a language family with one you know).",
		flavor:
			"The runes on the Rift wall say 'TURN BACK.' You're the only one who can read them.",
		tags: ["awakened", "feat", "awakening", "knowledge"],
		rarity: "common",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "Learn two additional languages.",
			secondary: "Decipher Rift inscriptions and anomaly speech (INT check).",
		},
		repeatable: false,
		mechanics: {
			action_type: "Passive",
			duration: "Permanent",
			damage_profile: "N/A",
			range: "Self",
		},
		limitations: {
			uses: "Permanent",
			recharge: "N/A",
			requires_attunement: false,
			conditions: [],
		},
		discovery_lore:
			"Identified when a C-Rank Herald began unconsciously translating gate-runes during a routine B-Rank clear near Osaka.",
		theme_tags: ["language", "gate", "knowledge"],
	},
	{
		id: "black-market-connections",
		name: "Black Market Connections",
		display_name: "Black Market Connections",
		description:
			"You have contacts in the unregulated Awakened underground — dealers in gate-harvested materials, unlicensed rune crafters, and off-book information brokers. You can locate black market vendors in any settlement with a population above 10,000 by spending 1 hour and making a Presence (Persuasion) or Intelligence (Investigation) check (DC 12). You buy and sell gate-harvested materials at 20% better rates than standard Guild prices.",
		flavor:
			"The Bureau doesn't sell Rank-A runestones to E-Rank ascendants. The underground does.",
		tags: ["awakened", "feat", "awakening", "social"],
		rarity: "common",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "Locate black market vendors with a 1-hour check (DC 12).",
			secondary: "20% better buy/sell rates on gate-harvested materials.",
		},
		repeatable: false,
		mechanics: {
			action_type: "Active",
			duration: "Permanent",
			damage_profile: "N/A",
			range: "Self",
			action: "1 hour",
		},
		limitations: {
			uses: "Unlimited",
			recharge: "N/A",
			requires_attunement: false,
			conditions: ["Settlement population 10,000+"],
		},
		discovery_lore:
			"The underground economy formed within weeks of the first Rift Break, when governments couldn't regulate the flood of gate-crystal and anomaly drops.",
		theme_tags: ["black-market", "social", "economy"],
	},
	{
		id: "raid-party-leader",
		name: "Raid Party Leader",
		display_name: "Raid Party Leader",
		description:
			"You've led enough Rift clears to read the flow of combat instinctively. As a bonus action, you can direct one ally who can hear you to reposition — that ally can immediately use its reaction to move up to half its speed without provoking opportunity attacks. Additionally, when you roll initiative, each ally within 30 feet who can hear you adds +2 to their initiative roll.",
		flavor:
			"You don't bark orders. You state facts. 'Left flank, three seconds.' They move.",
		tags: ["awakened", "feat", "awakening", "leadership"],
		rarity: "common",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary:
				"Bonus action: ally uses reaction to move half speed without OA.",
			secondary: "Allies within 30 feet get +2 to initiative.",
		},
		repeatable: false,
		mechanics: {
			action_type: "Active",
			duration: "Instantaneous",
			damage_profile: "N/A",
			range: "30 feet",
			action: "1 bonus action",
		},
		limitations: {
			uses: "Proficiency bonus/long rest",
			recharge: "Long rest",
			requires_attunement: false,
			conditions: ["Ally must hear you"],
		},
		discovery_lore:
			"The Guild Masters' Bureau codified raid leadership doctrine after analyzing the 40% survival rate difference between led and unled Rift clears.",
		theme_tags: ["leadership", "tactical", "party"],
	},
	{
		id: "anomaly-harvester",
		name: "Anomaly Harvester",
		display_name: "Anomaly Harvester",
		description:
			"You know how to extract useful materials from slain Rift creatures before their bodies dissolve. When a gate-born creature is reduced to 0 HP within 30 feet of you, you can use your reaction to harvest one material component (gate-crystal shard, mana core, or reagent) before dissolution. You have advantage on Intelligence (Nature) or Intelligence (Arcana) checks to identify anomaly weaknesses, resistances, and drop tables.",
		flavor: "Most ascendants let the loot dissolve. You carry the right jars.",
		tags: ["awakened", "feat", "awakening", "crafting"],
		rarity: "common",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "Reaction: harvest one material from a slain Rift creature.",
			secondary: "Advantage on checks to identify anomaly traits.",
		},
		repeatable: false,
		mechanics: {
			action_type: "Active",
			duration: "Instantaneous",
			damage_profile: "N/A",
			range: "30 feet",
			action: "1 reaction",
		},
		limitations: {
			uses: "Proficiency bonus/long rest",
			recharge: "Long rest",
			requires_attunement: false,
			conditions: ["Rift-born creature must be within 30 feet"],
		},
		discovery_lore:
			"Pioneered by low-rank ascendants who couldn't afford Guild equipment and learned to recycle anomaly remains into field-expedient tools.",
		theme_tags: ["crafting", "harvesting", "anomaly"],
	},
];

export { awakeningFeats };
