import type { Item } from "./items";
// Rift Ascendant Compendium — Background Starting Equipment
// Modern-day career items that background characters start with.

export const items_part1: Item[] = [
	// ────────── PARAMEDIC EQUIPMENT ──────────
	{
		id: "bg-emr-uniform",
		name: "Emergency Medical Responder Uniform",
		description:
			"A fire-resistant, high-visibility uniform worn by emergency medical technicians. Features reflective strips, reinforced elbows, and multiple utility pockets. Surprisingly durable against minor aetheric burns.",
		rarity: "common",
		type: "wondrous",
		image: "",
		weight: 4,
		value: 15,
		item_type: "misc",
		source: "Rift Ascendant Canon",
		effects: { passive: ["+1 to Medicine checks when worn"] },
	},
	{
		id: "bg-trauma-kit",
		name: "First-Aid Trauma Kit",
		description:
			"A professional-grade trauma kit containing tourniquets, chest seals, hemostatic gauze, airway management tools, and aetheric stabilization crystals added post-awakening. Functions as a Healer's Kit with 15 uses.",
		rarity: "common",
		type: "wondrous",
		image: "",
		weight: 5,
		value: 25,
		item_type: "tool",
		source: "Rift Ascendant Canon",
		effects: { passive: ["+2 to Medicine checks to stabilize a creature"] },
	},
	{
		id: "bg-phantom-pager",
		name: "Phantom Pager",
		description:
			"A pre-gate-era pager that still buzzes with phantom alerts. Sometimes it picks up frequencies from nearby rifts, providing a few seconds' warning before dimensional instability spikes. Old paramedics swear by them.",
		rarity: "uncommon",
		type: "wondrous",
		image: "",
		weight: 0.2,
		value: 5,
		item_type: "misc",
		source: "Rift Ascendant Canon",
		effects: {
			passive: [
				"Buzzes faintly when within 300 feet of an unstable rift (50% reliability)",
			],
		},
	},

	// ────────── OFFICE WORKER EQUIPMENT ──────────
	{
		id: "bg-cracked-laptop",
		name: "Cracked-Screen Laptop",
		description:
			"A battered laptop with a spiderweb crack across the screen. Still functional, loaded with spreadsheet software, encrypted corporate data, and a surprisingly useful offline database of guild regulations.",
		rarity: "common",
		type: "wondrous",
		image: "",
		weight: 3,
		value: 50,
		item_type: "tool",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["+1 to Investigation checks involving data analysis"],
		},
	},
	{
		id: "bg-company-badge",
		name: "Dissolved Corporation ID Badge",
		description:
			"A laminated ID badge from a corporation that no longer exists. The magnetic strip still works on some old security systems. A reminder of the world before gates.",
		rarity: "common",
		type: "wondrous",
		image: "",
		weight: 0.1,
		value: 1,
		item_type: "misc",
		source: "Rift Ascendant Canon",
	},
	{
		id: "bg-business-suit",
		name: "Crumpled Business Suit",
		description:
			"A once-crisp business suit now wrinkled and worn from gate-zone exposure. Still passable for formal occasions. The jacket pockets are reinforced from years of carrying too many pens.",
		rarity: "common",
		type: "wondrous",
		image: "",
		weight: 3,
		value: 20,
		item_type: "misc",
		source: "Rift Ascendant Canon",
		effects: { passive: ["+1 to Persuasion checks in formal settings"] },
	},

	// ────────── CONSTRUCTION WORKER EQUIPMENT ──────────
	{
		id: "bg-safety-vest",
		name: "Reinforced Safety Vest",
		description:
			"A high-visibility safety vest with mana-threaded reflective strips. Post-gate modifications include aetheric shielding mesh in the lining. Provides minimal protection but excellent visibility.",
		rarity: "common",
		type: "armor",
		image: "",
		weight: 2,
		value: 10,
		item_type: "armor",
		armor_type: "Light",
		armor_class: "11 + Dex modifier",
		source: "Rift Ascendant Canon",
	},
	{
		id: "bg-dented-hardhat",
		name: "Dented Hard Hat",
		description:
			"A well-worn hard hat covered in scuff marks and dents from falling debris. The interior padding has been replaced with impact-absorbing gel salvaged from gate-beast shells.",
		rarity: "common",
		type: "wondrous",
		image: "",
		weight: 1,
		value: 5,
		item_type: "misc",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Advantage on saves against falling debris and cave-ins"],
		},
	},
	{
		id: "bg-heavy-multitool",
		name: "Heavy-Duty Multi-Tool",
		description:
			"An industrial-grade multi-tool with pliers, wire cutters, screwdrivers, a bottle opener, and a small pry bar. Built to survive construction sites and gate zones alike.",
		rarity: "common",
		type: "wondrous",
		image: "",
		weight: 1,
		value: 15,
		item_type: "tool",
		source: "Rift Ascendant Canon",
		effects: { passive: ["+1 to checks involving improvised repairs"] },
	},

	// ────────── JOURNALIST EQUIPMENT ──────────
	{
		id: "bg-press-badge",
		name: "Weathered Press Badge",
		description:
			"A laminated press badge from a major news outlet. Faded but still recognizable. Opens doors that would otherwise stay shut, and commands a begrudging respect from officials.",
		rarity: "common",
		type: "wondrous",
		image: "",
		weight: 0.1,
		value: 5,
		item_type: "misc",
		source: "Rift Ascendant Canon",
		effects: {
			passive: [
				"+2 to Persuasion checks when requesting access or information from officials",
			],
		},
	},
	{
		id: "bg-voice-recorder",
		name: "Digital Voice Recorder",
		description:
			"A professional digital voice recorder with hours of gate-break interviews, eyewitness accounts, and field notes. The batteries last seemingly forever, and it picks up aetheric interference patterns.",
		rarity: "common",
		type: "wondrous",
		image: "",
		weight: 0.3,
		value: 30,
		item_type: "tool",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["+1 to Investigation checks involving interviews"],
		},
	},
	{
		id: "bg-encrypted-notebook",
		name: "Encrypted Contact Notebook",
		description:
			"A leather-bound notebook filled with contacts, encrypted notes, source information, and hastily sketched gate-zone maps. Written in a personal shorthand that only you can decipher.",
		rarity: "common",
		type: "wondrous",
		image: "",
		weight: 0.5,
		value: 10,
		item_type: "misc",
		source: "Rift Ascendant Canon",
		effects: {
			passive: [
				"Contains d4 useful contacts in any major city (Warden discretion)",
			],
		},
	},

	// ────────── STREET VENDOR EQUIPMENT ──────────
	{
		id: "bg-market-stall",
		name: "Collapsible Market Stall",
		description:
			"A lightweight, foldable aluminum frame with a canvas awning. Sets up in under 2 minutes. Has survived three gate-storms and countless turf wars. Smells faintly of fried food.",
		rarity: "common",
		type: "wondrous",
		image: "",
		weight: 15,
		value: 20,
		item_type: "misc",
		source: "Rift Ascendant Canon",
	},
	{
		id: "bg-lucky-coin",
		name: "Lucky First-Sale Coin",
		description:
			"A battered coin from your very first sale. You've carried it every day since. It's probably not magical, but you've never had a truly bad day while carrying it. Probably.",
		rarity: "common",
		type: "wondrous",
		image: "",
		weight: 0.01,
		value: 0.1,
		item_type: "misc",
		source: "Rift Ascendant Canon",
		effects: {
			passive: [
				"Once per long rest, reroll a failed Persuasion check involving commerce",
			],
		},
	},
	{
		id: "bg-customer-ledger",
		name: "Customer Ledger",
		description:
			"A dog-eared ledger filled with regular customer names, preferences, debts owed, and favors to collect. An invaluable network resource disguised as a worn notebook.",
		rarity: "common",
		type: "wondrous",
		image: "",
		weight: 0.5,
		value: 5,
		item_type: "misc",
		source: "Rift Ascendant Canon",
		effects: {
			passive: [
				"+1 to Persuasion checks in marketplace or commercial settings",
			],
		},
	},

	// ────────── SECURITY GUARD EQUIPMENT ──────────
	{
		id: "bg-security-uniform",
		name: "Reinforced Security Uniform",
		description:
			"A private security uniform with kevlar-lined panels and guild-standard reinforcement patches. The badge is from a company that was absorbed into the Ascendant Bureau.",
		rarity: "common",
		type: "armor",
		image: "",
		weight: 5,
		value: 25,
		item_type: "armor",
		armor_type: "Light",
		armor_class: "12 + Dex modifier",
		source: "Rift Ascendant Canon",
	},
	{
		id: "bg-tactical-flashlight",
		name: "Tactical Flashlight Baton",
		description:
			"A heavy-duty flashlight that doubles as a baton. Military-grade LED with 1000 lumens. The weighted aluminum body makes it an effective improvised weapon (1d4 bludgeoning).",
		rarity: "common",
		type: "weapon",
		image: "",
		weight: 2,
		value: 15,
		item_type: "weapon",
		weapon_type: "simple melee",
		damage: "1d4",
		damage_type: "bludgeoning",
		simple_properties: ["light"],
		source: "Rift Ascendant Canon",
		effects: { passive: ["Provides 60 ft bright light, 120 ft dim light"] },
	},
	{
		id: "bg-guild-radio",
		name: "Modified Security Radio",
		description:
			"A worn security radio jury-rigged to pick up guild tactical frequencies and emergency broadcasts. Range: 5 miles in urban environments, less in gate zones.",
		rarity: "common",
		type: "wondrous",
		image: "",
		weight: 0.5,
		value: 20,
		item_type: "tool",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Can monitor guild and emergency frequencies within 5 miles"],
		},
	},

	// ────────── DELIVERY DRIVER EQUIPMENT ──────────
	{
		id: "bg-delivery-uniform",
		name: "Reflective Delivery Uniform",
		description:
			"A battered delivery uniform with reflective strips and padding at the knees and elbows. Designed for long hours on the road. The company logo has been scratched off.",
		rarity: "common",
		type: "wondrous",
		image: "",
		weight: 2,
		value: 10,
		item_type: "misc",
		source: "Rift Ascendant Canon",
	},
	{
		id: "bg-gate-gps",
		name: "Gate-Zone GPS Device",
		description:
			"A GPS device jury-rigged for navigation through gate-damaged urban zones. Crowd-sourced data from other drivers keeps the maps updated with rift locations, blocked roads, and safe passages.",
		rarity: "uncommon",
		type: "wondrous",
		image: "",
		weight: 0.3,
		value: 40,
		item_type: "tool",
		source: "Rift Ascendant Canon",
		effects: {
			passive: [
				"+2 to Survival checks to navigate urban environments",
				"Shows known rift locations within 10 miles",
			],
		},
	},
	{
		id: "bg-thermal-bag",
		name: "Aetheric Thermal Bag",
		description:
			"An insulated delivery bag modified with aetheric cold crystals. Originally for keeping food fresh, now used to transport rift potions, unstable reagents, and temperature-sensitive materials.",
		rarity: "common",
		type: "wondrous",
		image: "",
		weight: 2,
		value: 15,
		item_type: "misc",
		source: "Rift Ascendant Canon",
		effects: {
			passive: [
				"Keeps contents at a stable temperature for 24 hours",
				"Potions stored inside maintain potency 50% longer",
			],
		},
	},

	// ────────── TEACHER EQUIPMENT ──────────
	{
		id: "bg-teacher-satchel",
		name: "Teacher's Leather Satchel",
		description:
			"A worn leather satchel containing a class roster from a school that no longer exists, graded papers, and a collection of educational materials. The strap has been repaired twice.",
		rarity: "common",
		type: "wondrous",
		image: "",
		weight: 3,
		value: 15,
		item_type: "misc",
		source: "Rift Ascendant Canon",
		effects: {
			passive: [
				"Can hold up to 30 lbs of books and documents without encumbrance",
			],
		},
	},
	{
		id: "bg-red-pen",
		name: "Red Grading Pen",
		description:
			"A well-used red pen. You mark everything with it out of habit—maps, notes, enemy weaknesses. Something about circling errors in red ink feels deeply satisfying.",
		rarity: "common",
		type: "wondrous",
		image: "",
		weight: 0.01,
		value: 0.5,
		item_type: "misc",
		source: "Rift Ascendant Canon",
	},
	{
		id: "bg-ironic-textbook",
		name: "World History Textbook",
		description:
			"A worn textbook on world history, now painfully ironic given how much the world has changed. Still useful as a reference for pre-gate geography, politics, and cultural context.",
		rarity: "common",
		type: "wondrous",
		image: "",
		weight: 2,
		value: 10,
		item_type: "misc",
		source: "Rift Ascendant Canon",
		effects: { passive: ["+1 to History checks involving pre-gate events"] },
	},

	// ────────── MECHANIC EQUIPMENT ──────────
	{
		id: "bg-oil-coveralls",
		name: "Oil-Stained Coveralls",
		description:
			"Durable work coveralls permanently stained with motor oil, hydraulic fluid, and aetheric residue. Fire-resistant (sort of) and covered in useful pockets.",
		rarity: "common",
		type: "wondrous",
		image: "",
		weight: 3,
		value: 10,
		item_type: "misc",
		source: "Rift Ascendant Canon",
		effects: { passive: ["Resistance to acid damage from mechanical fluids"] },
	},
	{
		id: "bg-rune-wrenches",
		name: "Rune-Modified Wrench Set",
		description:
			"A portable toolbox containing wrenches, screwdrivers, and pliers that have been etched with minor reinforcement runes. They never rust and provide better grip on aetherically charged components.",
		rarity: "uncommon",
		type: "wondrous",
		image: "",
		weight: 8,
		value: 50,
		item_type: "tool",
		source: "Rift Ascendant Canon",
		effects: {
			passive: [
				"+2 to checks involving repair or dismantling mechanical devices",
			],
		},
	},
	{
		id: "bg-aetheric-scanner",
		name: "Aetheric Diagnostic Scanner",
		description:
			"An automotive diagnostic scanner that sometimes picks up aetheric frequencies. The screen glitches near rifts, displaying energy readings that experienced mechanics have learned to interpret.",
		rarity: "uncommon",
		type: "wondrous",
		image: "",
		weight: 1,
		value: 35,
		item_type: "tool",
		source: "Rift Ascendant Canon",
		effects: {
			passive: [
				"Can detect aetheric energy in objects within 10 feet",
				"+1 to Arcana checks involving magitech",
			],
		},
	},

	// ────────── FIREFIGHTER EQUIPMENT ──────────
	{
		id: "bg-fire-jacket",
		name: "Guild-Reinforced Tactical Jacket",
		description:
			"A fire-resistant tactical jacket upgraded with guild-standard aetheric shielding. The Nomex outer layer has been treated with rift-crystal dust, providing enhanced heat protection.",
		rarity: "uncommon",
		type: "armor",
		image: "",
		weight: 8,
		value: 75,
		item_type: "armor",
		armor_type: "Medium",
		armor_class: "13 + Dex modifier (max 2)",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Resistance to fire damage from non-magical sources"],
		},
	},
	{
		id: "bg-halligan-bar",
		name: "Halligan Bar",
		description:
			"A firefighter's breaching tool—a steel bar with a claw, blade, and pike. Used for forcing open doors, breaking through walls, and prying apart wreckage. An effective improvised weapon.",
		rarity: "common",
		type: "weapon",
		image: "",
		weight: 10,
		value: 30,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d8",
		damage_type: "bludgeoning",
		simple_properties: ["versatile"],
		source: "Rift Ascendant Canon",
		effects: {
			passive: [
				"Advantage on Strength checks to force open doors and barriers",
			],
		},
	},
	{
		id: "bg-dept-radio",
		name: "Gate-Zone Department Radio",
		description:
			"A department radio modified for gate-zone frequencies. Hardened against aetheric interference. Can communicate with other radios within 3 miles, or 1 mile inside a gate.",
		rarity: "common",
		type: "wondrous",
		image: "",
		weight: 0.5,
		value: 25,
		item_type: "tool",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Communication range: 3 miles (1 mile in gate zones)"],
		},
	},

	// ────────── SOCIAL WORKER EQUIPMENT ──────────
	{
		id: "bg-case-binder",
		name: "Case File Binder",
		description:
			"A worn binder originally used for case files, now repurposed for anomaly reports, refugee tracking, and contact management. Color-coded tabs and meticulous organization.",
		rarity: "common",
		type: "wondrous",
		image: "",
		weight: 2,
		value: 10,
		item_type: "misc",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["+1 to Insight checks when reviewing documents or records"],
		},
	},
	{
		id: "bg-govt-id",
		name: "Government-Issued ID",
		description:
			"A government social services ID that still opens some doors—literally. The lamination is peeling, but the barcode still works at Bureau-affiliated facilities.",
		rarity: "common",
		type: "wondrous",
		image: "",
		weight: 0.1,
		value: 5,
		item_type: "misc",
		source: "Rift Ascendant Canon",
		effects: {
			passive: [
				"Grants access to government and Bureau-affiliated public facilities",
			],
		},
	},
	{
		id: "bg-deescalation-guide",
		name: "Crisis De-Escalation Guide",
		description:
			"A pocket-sized guide to crisis intervention techniques. Dog-eared, highlighted, and annotated with personal notes. Includes chapters on PTSD, aetheric shock syndrome, and post-awakening trauma.",
		rarity: "common",
		type: "wondrous",
		image: "",
		weight: 0.3,
		value: 10,
		item_type: "misc",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["+1 to Persuasion checks to calm frightened or hostile NPCs"],
		},
	},

	// ────────── POLICE OFFICER EQUIPMENT ──────────
	{
		id: "bg-tactical-vest",
		name: "Department-Issue Tactical Vest",
		description:
			"A reinforced tactical vest from the police department, dented from a gate-creature encounter. The ceramic plates have been swapped for aetheric-dampening inserts by the Ascendant Bureau.",
		rarity: "uncommon",
		type: "armor",
		image: "",
		weight: 8,
		value: 50,
		item_type: "armor",
		armor_type: "Medium",
		armor_class: "14 + Dex modifier (max 2)",
		source: "Rift Ascendant Canon",
	},
	{
		id: "bg-mana-handcuffs",
		name: "Mana-Inert Handcuffs",
		description:
			"Specially forged handcuffs treated with mana-dampening alloy. A restrained creature has disadvantage on attempts to cast spells or use mana-based abilities. Standard issue for Bureau enforcement.",
		rarity: "uncommon",
		type: "wondrous",
		image: "",
		weight: 1,
		value: 40,
		item_type: "misc",
		source: "Rift Ascendant Canon",
		effects: {
			passive: [
				"Restrained creature has disadvantage on spellcasting checks",
				"Requires DC 20 Strength or DC 25 Sleight of Hand to escape",
			],
		},
	},
	{
		id: "bg-police-badge",
		name: "Ascendant Bureau Badge",
		description:
			"A police badge that has been reissued by the Ascendant Bureau. Carries weight with both civilian law enforcement and guild security. The shield design incorporates a stylized rift sigil.",
		rarity: "common",
		type: "wondrous",
		image: "",
		weight: 0.2,
		value: 15,
		item_type: "misc",
		source: "Rift Ascendant Canon",
		effects: {
			passive: [
				"+2 to Intimidation checks against non-hostile NPCs",
				"Grants access to law enforcement facilities and crime scenes",
			],
		},
	},
];
