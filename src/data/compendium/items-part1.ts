import type { Item } from "./items";

export const items_part1: Item[] = [
	{
		id: "bg-emr-uniform",
		name: "Emergency Medical Responder Uniform",
		description:
			"A fire-resistant, high-visibility uniform worn by emergency medical technicians. Features reflective strips, reinforced elbows, and multiple utility pockets. Surprisingly durable against minor aetheric burns.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/backgrounds/paramedic.webp",
		weight: 4,
		value: 15,
		item_type: "misc",
		effects: {
			passive: ["+1 to Medicine checks when worn"],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Paramedic uniforms became standard Hunter Association gear after the First Gate Surge. Every team needs a medic.",
			origin:
				"Standard Bureau-issued emergency response gear, distributed to medical personnel attached to gate-clearing teams.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Run toward the chaos. That's the job.",
		discovery_lore:
			"Available from Hunter Association medical supply depots. Unglamorous but essential.",
		tags: ["equipment", "area", "offensive", "single-target", "debuff"],
		theme_tags: ["black-market", "experimental", "elite-tier"],
	},
	{
		id: "bg-trauma-kit",
		name: "First-Aid Trauma Kit",
		description:
			"A professional-grade trauma kit containing tourniquets, chest seals, hemostatic gauze, airway management tools, and aetheric stabilization crystals added post-awakening. Functions as a Healer's Kit with 15 uses.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/item-0471.webp",
		weight: 5,
		value: 25,
		item_type: "tool",
		effects: {
			passive: ["+2 to Medicine checks to stabilize a creature"],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Upgraded with aetheric stabilization crystals after it was discovered that standard hemostatic agents are less effective on wounds from anomaly attacks.",
			origin:
				"Professional-grade trauma gear standard-issued to Hunter Association medical teams after the First Gate Surge.",
			personality: "",
			prior_owners: [],
		},
		flavor: "15 uses. Make them count.",
		discovery_lore:
			"Available at Hunter Association supply depots. Required kit for any certified medic on a gate team.",
		tags: ["equipment", "stealth", "control", "support"],
		theme_tags: ["mana-overflow", "guild-ops", "ancient-power"],
	},
	{
		id: "bg-phantom-pager",
		name: "Phantom Pager",
		description:
			"A pre-gate-era pager that still buzzes with phantom alerts. Sometimes it picks up frequencies from nearby rifts, providing a few seconds' warning before dimensional instability spikes. Old paramedics swear by them.",
		rarity: "uncommon",
		type: "wondrous",
		image: "/generated/compendium/items/item-0177.webp",
		weight: 0.2,
		value: 5,
		item_type: "misc",
		effects: {
			passive: [
				"Buzzes faintly when within 300 feet of an unstable rift (50% reliability)",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"This was the subject of a bidding war between three S-Rank Guilds that nearly escalated to armed conflict.",
			origin:
				"Emerged from the Hunter Association's classified Project: Lattice Break experiments.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Belongs in the bottom of every Hunter's go-bag.",
		discovery_lore:
			"Found washed ashore near a coastal Gate, wrapped in fabric that dissolved upon touch.",
		tags: ["equipment", "psychic", "single-target"],
		theme_tags: ["modern-warfare", "dimensional-bleed"],
	},
	{
		id: "bg-cracked-laptop",
		name: "Cracked-Screen Laptop",
		description:
			"A battered laptop with a spiderweb crack across the screen. Still functional, loaded with spreadsheet software, encrypted corporate data, and a surprisingly useful offline database of guild regulations.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/item-0724.webp",
		weight: 3,
		value: 50,
		item_type: "tool",
		effects: {
			passive: ["+1 to Investigation checks involving data analysis"],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Originally developed as a countermeasure against Regent-class entities during the Regent Wars.",
			origin:
				"Stolen from a Guild vault during the Three-Day War between rival Korean Hunter factions.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"Cheap, ubiquitous, and sometimes the only thing between you and a black bag.",
		discovery_lore:
			"Appeared in a Hunter's inventory after a Order notification that no one else could see.",
		tags: ["equipment", "lightning", "necrotic", "defensive"],
		theme_tags: ["guild-ops", "ancient-power", "urban-combat"],
	},
	{
		id: "bg-company-badge",
		name: "Dissolved Corporation ID Badge",
		description:
			"A laminated ID badge from a corporation that no longer exists. The magnetic strip still works on some old security systems. A reminder of the world before gates.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/item-0895.webp",
		weight: 0.1,
		value: 1,
		item_type: "misc",
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Multiple Guilds have attempted to replicate this; all reproductions have proven inferior to the original.",
			origin:
				"Born from a Order glitch that briefly merged two overlapping Gate instances.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Standard kit for those who plan to come back.",
		discovery_lore:
			"Emerged from a Gate Boss's dissolution cloud, hovering where the creature's heart had been.",
		tags: ["equipment", "shadow", "control", "void"],
		theme_tags: ["ancient-power", "elite-tier", "survival"],
	},
	{
		id: "bg-business-suit",
		name: "Crumpled Business Suit",
		description:
			"A once-crisp business suit now wrinkled and worn from gate-zone exposure. Still passable for formal occasions. The jacket pockets are reinforced from years of carrying too many pens.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/item-0656.webp",
		weight: 3,
		value: 20,
		item_type: "misc",
		effects: {
			passive: ["+1 to Persuasion checks in formal settings"],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"The American Hunter Bureau's Project: Starfall attempted to weaponize this before the program was defunded.",
			origin:
				"Translated from forbidden shadow-language inscriptions found in a Regent's throne room.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Belongs in the bottom of every Hunter's go-bag.",
		discovery_lore:
			"Reported on a salvage manifest filed two weeks after the clear that produced it.",
		tags: ["equipment", "debuff", "buff", "necrotic"],
		theme_tags: ["rift-energy", "survival"],
	},
	{
		id: "bg-safety-vest",
		name: "Reinforced Safety Vest",
		description:
			"A high-visibility safety vest with mana-threaded reflective strips. Post-gate modifications include aetheric shielding mesh in the lining. Provides minimal protection but excellent visibility.",
		rarity: "common",
		type: "armor",
		image: "/generated/compendium/items/item-0893.webp",
		weight: 2,
		value: 10,
		item_type: "armor",
		armor_class: "11 + Dex modifier",
		armor_type: "Light",
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Intelligence reports link this to the Shadow Regent's army, though the connection remains unconfirmed.",
			origin:
				"Pulled from the dreams of a comatose S-Rank Hunter by a team of psychic-type Awakened.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Built by Bureau Technomancer who've patched real wounds.",
		discovery_lore:
			"Pulled out of a B-rank gate's last-room loot pile by a recovery team.",
		tags: ["equipment", "debuff", "utility", "psychic", "healing"],
		theme_tags: ["ancient-power", "mana-overflow", "rift-energy"],
	},
	{
		id: "bg-dented-hardhat",
		name: "Dented Hard Hat",
		description:
			"A well-worn hard hat covered in scuff marks and dents from falling debris. The interior padding has been replaced with impact-absorbing gel salvaged from gate-beast shells.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/item-0675.webp",
		weight: 1,
		value: 5,
		item_type: "misc",
		effects: {
			passive: ["Advantage on saves against falling debris and cave-ins"],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"This was one of twelve artifacts recovered from the infamous Kamish Raid that changed modern Hunter warfare.",
			origin:
				"Excavated from a pocket dimension that existed for exactly one hour before collapsing.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Belongs in the bottom of every Hunter's go-bag.",
		discovery_lore:
			"Pulled out of a B-rank gate's last-room loot pile by a recovery team.",
		tags: ["equipment", "debuff", "shadow", "single-target"],
		theme_tags: ["ancient-power", "dungeon-core", "hunter-bureau"],
	},
	{
		id: "bg-heavy-multitool",
		name: "Heavy-Duty Multi-Tool",
		description:
			"An industrial-grade multi-tool with pliers, wire cutters, screwdrivers, a bottle opener, and a small pry bar. Built to survive construction sites and gate zones alike.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/item-0759.webp",
		weight: 1,
		value: 15,
		item_type: "tool",
		effects: {
			passive: ["+1 to checks involving improvised repairs"],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Records indicate this was used by the original Clearing Party that neutralized the first S-Rank Gate on Korean soil.",
			origin:
				"Manifested spontaneously during a double-dungeon event in the American Midwest.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Belongs in the bottom of every Hunter's go-bag.",
		discovery_lore:
			"Sold by a mysterious merchant who appears only during full moons near active Gate sites.",
		tags: ["equipment", "support", "damage", "stealth"],
		theme_tags: ["classified", "survival"],
	},
	{
		id: "bg-press-badge",
		name: "Weathered Press Badge",
		description:
			"A laminated press badge from a major news outlet. Faded but still recognizable. Opens doors that would otherwise stay shut, and commands a begrudging respect from officials.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/item-0887.webp",
		weight: 0.1,
		value: 5,
		item_type: "misc",
		effects: {
			passive: [
				"+2 to Persuasion checks when requesting access or information from officials",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"A-Rank appraiser Guild Master Ryker personally verified its authenticity before it entered general circulation.",
			origin:
				"Decoded from ancient sigil-stones found beneath the ruins of a pre-Awakening temple in Kyoto.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"Cheap, ubiquitous, and sometimes the only thing between you and a black bag.",
		discovery_lore:
			"Surfaced when a Guild quartermaster did a five-year locker audit.",
		tags: ["equipment", "burst", "single-target"],
		theme_tags: ["experimental", "elite-tier"],
	},
	{
		id: "bg-voice-recorder",
		name: "Digital Voice Recorder",
		description:
			"A professional digital voice recorder with hours of gate-break interviews, eyewitness accounts, and field notes. The batteries last seemingly forever, and it picks up aetheric interference patterns.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/item-0151.webp",
		weight: 0.3,
		value: 30,
		item_type: "tool",
		effects: {
			passive: ["+1 to Investigation checks involving interviews"],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Originally developed as a countermeasure against Regent-class entities during the Regent Wars.",
			origin:
				"Found clutched in the hand of a petrified E-Rank Hunter who had been missing for three years.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Belongs in the bottom of every Hunter's go-bag.",
		discovery_lore:
			"Emerged from a Gate Boss's dissolution cloud, hovering where the creature's heart had been.",
		tags: ["equipment", "healing", "stealth", "damage"],
		theme_tags: ["experimental", "rift-energy"],
	},
	{
		id: "bg-encrypted-notebook",
		name: "Encrypted Contact Notebook",
		description:
			"A leather-bound notebook filled with contacts, encrypted notes, source information, and hastily sketched gate-zone maps. Written in a personal shorthand that only you can decipher.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/item-0580.webp",
		weight: 0.5,
		value: 10,
		item_type: "misc",
		effects: {
			passive: [
				"Contains d4 useful contacts in any major city (Warden discretion)",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"The first recorded use caused a localized reality fracture that took a specialized team forty hours to repair.",
			origin:
				"Distilled from the ambient mana of a Red Gate that refused to close for seventeen days.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"Binds the fabric of reality. A testament to what Hunters have become.",
		discovery_lore:
			"Identified during a mid-tier auction after the Bureau cleared its provenance.",
		tags: ["equipment", "single-target", "stealth"],
		theme_tags: ["classified", "guild-ops"],
	},
	{
		id: "bg-market-stall",
		name: "Collapsible Market Stall",
		description:
			"A lightweight, foldable aluminum frame with a canvas awning. Sets up in under 2 minutes. Has survived three gate-storms and countless turf wars. Smells faintly of fried food.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/item-0923.webp",
		weight: 15,
		value: 20,
		item_type: "misc",
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Multiple Guilds have attempted to replicate this; all reproductions have proven inferior to the original.",
			origin:
				"Emerged from the Hunter Association's classified Project: Lattice Break experiments.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"Commands the remnants of a dead world. Proof that some things cannot be survived.",
		discovery_lore:
			"Found washed ashore near a coastal Gate, wrapped in fabric that dissolved upon touch.",
		tags: ["equipment", "damage", "lightning"],
		theme_tags: ["gate-zone", "black-market", "shadow-domain"],
	},
	{
		id: "bg-lucky-coin",
		name: "Lucky First-Sale Coin",
		description:
			"A battered coin from your very first sale. You've carried it every day since. It's probably not magical, but you've never had a truly bad day while carrying it. Probably.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/item-0004.webp",
		weight: 0.01,
		value: 0.1,
		item_type: "misc",
		effects: {
			passive: [
				"Once per long rest, reroll a failed Persuasion check involving commerce",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"A-Rank appraiser Guild Master Ryker personally verified its authenticity before it entered general circulation.",
			origin:
				"Created by an unnamed Awakened blacksmith who fed their own life force into the forge.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"Crushes the remnants of a dead world. A whisper from the edge of oblivion.",
		discovery_lore:
			"Identified during a mid-tier auction after the Bureau cleared its provenance.",
		tags: ["equipment", "healing", "sustained"],
		theme_tags: ["classified", "post-awakening", "system-glitch"],
	},
	{
		id: "bg-customer-ledger",
		name: "Customer Ledger",
		description:
			"A dog-eared ledger filled with regular customer names, preferences, debts owed, and favors to collect. An invaluable network resource disguised as a worn notebook.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/item-0022.webp",
		weight: 0.5,
		value: 5,
		item_type: "misc",
		effects: {
			passive: [
				"+1 to Persuasion checks in marketplace or commercial settings",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Field reports indicate prolonged exposure causes minor spatial distortions in a three-meter radius.",
			origin:
				"Unearthed by a mining Guild operating in the mana-saturated quarries of the Australian Outback.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"Ignites the fabric of reality. A testament to what Hunters have become.",
		discovery_lore:
			"Appeared in a Hunter's inventory after a Order notification that no one else could see.",
		tags: ["equipment", "control", "mobility", "defensive", "support"],
		theme_tags: ["dimensional-bleed", "elite-tier"],
	},
	{
		id: "bg-security-uniform",
		name: "Reinforced Security Uniform",
		description:
			"A private security uniform with kevlar-lined panels and guild-standard reinforcement patches. The badge is from a company that was absorbed into the Ascendant Bureau.",
		rarity: "common",
		type: "armor",
		image: "/generated/compendium/items/item-0755.webp",
		weight: 5,
		value: 25,
		item_type: "armor",
		armor_class: "12 + Dex modifier",
		armor_type: "Light",
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"This was the subject of a bidding war between three S-Rank Guilds that nearly escalated to armed conflict.",
			origin:
				"Decoded from ancient sigil-stones found beneath the ruins of a pre-Awakening temple in Kyoto.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Standard kit for those who plan to come back.",
		discovery_lore:
			"Traded by a nomadic Awakened who claimed to have no memory of acquiring it.",
		tags: ["equipment", "single-target", "defensive"],
		theme_tags: ["system-glitch", "black-market"],
	},
	{
		id: "bg-tactical-flashlight",
		name: "Tactical Flashlight Baton",
		description:
			"A heavy-duty flashlight that doubles as a baton. Military-grade LED with 1000 lumens. The weighted aluminum body makes it an effective improvised weapon (1d4 bludgeoning).",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0518.webp",
		weight: 2,
		value: 15,
		item_type: "weapon",
		weapon_type: "simple melee",
		damage: "1d4",
		damage_type: "bludgeoning",
		simple_properties: ["light"],
		effects: {
			passive: ["Provides 60 ft bright light, 120 ft dim light"],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"The American Hunter Bureau's Project: Starfall attempted to weaponize this before the program was defunded.",
			origin:
				"Pulled from the dreams of a comatose S-Rank Hunter by a team of psychic-type Awakened.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Bureau-issue. Inventoried. Forgotten.",
		discovery_lore:
			"Recovered from a time-locked chest that required three different elemental keys to open.",
		tags: ["equipment", "sustained", "mobility", "psychic", "buff"],
		theme_tags: ["elite-tier", "gate-zone"],
	},
	{
		id: "bg-guild-radio",
		name: "Modified Security Radio",
		description:
			"A worn security radio jury-rigged to pick up guild tactical frequencies and emergency broadcasts. Range: 5 miles in urban environments, less in gate zones.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/item-0663.webp",
		weight: 0.5,
		value: 20,
		item_type: "tool",
		effects: {
			passive: ["Can monitor guild and emergency frequencies within 5 miles"],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"The Japanese Hunter Association attempted to classify this as a national treasure to prevent export.",
			origin:
				"Stolen from a Guild vault during the Three-Day War between rival Korean Hunter factions.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"Binds the architect's design. Proof that some things cannot be survived.",
		discovery_lore:
			"Sold by a mysterious merchant who appears only during full moons near active Gate sites.",
		tags: ["equipment", "defensive", "psychic"],
		theme_tags: ["mana-overflow", "system-glitch"],
	},
	{
		id: "bg-delivery-uniform",
		name: "Reflective Delivery Uniform",
		description:
			"A battered delivery uniform with reflective strips and padding at the knees and elbows. Designed for long hours on the road. The company logo has been scratched off.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/item-0461.webp",
		weight: 2,
		value: 10,
		item_type: "misc",
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"First documented during the Second Awakening Wave, when Hunters worldwide reported spontaneous power surges.",
			origin:
				"Salvaged from the corpse of an S-Rank anomaly that breached containment in the European Dead Zone.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"Cheap, ubiquitous, and sometimes the only thing between you and a black bag.",
		discovery_lore:
			"Discovered by an E-Rank Hunter who stumbled into an unmarked side passage during a routine dungeon clear.",
		tags: ["equipment", "sustained", "defensive", "utility", "offensive"],
		theme_tags: ["survival", "regent-era", "rift-energy"],
	},
	{
		id: "bg-gate-gps",
		name: "Gate-Zone GPS Device",
		description:
			"A GPS device jury-rigged for navigation through gate-damaged urban zones. Crowd-sourced data from other drivers keeps the maps updated with rift locations, blocked roads, and safe passages.",
		rarity: "uncommon",
		type: "wondrous",
		image: "/generated/compendium/items/item-0804.webp",
		weight: 0.3,
		value: 40,
		item_type: "tool",
		effects: {
			passive: [
				"+2 to Survival checks to navigate urban environments",
				"Shows known rift locations within 10 miles",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Multiple Guilds have attempted to replicate this; all reproductions have proven inferior to the original.",
			origin:
				"Recovered from the personal vault of a National-Level Hunter who vanished during the First Calamity.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"Overrides the last defense of the unprepared. Evolution compressed into a single, violent instant.",
		discovery_lore:
			"Logged at a Bureau weigh-station after a routine post-clear inventory.",
		tags: ["equipment", "ice", "support", "lightning"],
		theme_tags: ["modern-warfare", "survival"],
	},
	{
		id: "bg-thermal-bag",
		name: "Aetheric Thermal Bag",
		description:
			"An insulated delivery bag modified with aetheric cold crystals. Originally for keeping food fresh, now used to transport rift potions, unstable reagents, and temperature-sensitive materials.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/item-0320.webp",
		weight: 2,
		value: 15,
		item_type: "misc",
		effects: {
			passive: [
				"Keeps contents at a stable temperature for 24 hours",
				"Potions stored inside maintain potency 50% longer",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"The first recorded use caused a localized reality fracture that took a specialized team forty hours to repair.",
			origin:
				"Unearthed by a mining Guild operating in the mana-saturated quarries of the Australian Outback.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"Cheap, ubiquitous, and sometimes the only thing between you and a black bag.",
		discovery_lore:
			"Reported on a salvage manifest filed two weeks after the clear that produced it.",
		tags: ["equipment", "void", "radiant", "sustained", "buff"],
		theme_tags: ["post-awakening", "gate-zone", "modern-warfare"],
	},
	{
		id: "bg-teacher-satchel",
		name: "Teacher's Leather Satchel",
		description:
			"A worn leather satchel containing a class roster from a school that no longer exists, graded papers, and a collection of educational materials. The strap has been repaired twice.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/item-0291.webp",
		weight: 3,
		value: 15,
		item_type: "misc",
		effects: {
			passive: [
				"Can hold up to 30 lbs of books and documents without encumbrance",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"A-Rank appraiser Guild Master Ryker personally verified its authenticity before it entered general circulation.",
			origin:
				"Found clutched in the hand of a petrified E-Rank Hunter who had been missing for three years.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Worn down at the seams. That's how you know it works.",
		discovery_lore:
			"Pulled out of a B-rank gate's last-room loot pile by a recovery team.",
		tags: ["equipment", "mobility", "psychic"],
		theme_tags: ["dimensional-bleed", "mana-overflow"],
	},
	{
		id: "bg-red-pen",
		name: "Red Grading Pen",
		description:
			"A well-used red pen. You mark everything with it out of habit—maps, notes, enemy weaknesses. Something about circling errors in red ink feels deeply satisfying.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/item-0867.webp",
		weight: 0.01,
		value: 0.5,
		item_type: "misc",
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"First documented during the Second Awakening Wave, when Hunters worldwide reported spontaneous power surges.",
			origin:
				"Pulled from the dreams of a comatose S-Rank Hunter by a team of psychic-type Awakened.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"Unravels the dimensional barrier. Proof that some things cannot be survived.",
		discovery_lore:
			"Surfaced when a Guild quartermaster did a five-year locker audit.",
		tags: ["equipment", "burst", "radiant", "perception"],
		theme_tags: ["dungeon-core", "rift-energy"],
	},
	{
		id: "bg-ironic-textbook",
		name: "World History Textbook",
		description:
			"A worn textbook on world history, now painfully ironic given how much the world has changed. Still useful as a reference for pre-gate geography, politics, and cultural context.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/item-0477.webp",
		weight: 2,
		value: 10,
		item_type: "misc",
		effects: {
			passive: ["+1 to History checks involving pre-gate events"],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Originally thought to be a failed experiment, it was rediscovered when a junior researcher noticed anomalous readings.",
			origin:
				"Recovered from the personal vault of a National-Level Hunter who vanished during the First Calamity.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Belongs in the bottom of every Hunter's go-bag.",
		discovery_lore:
			"Sold by a mysterious merchant who appears only during full moons near active Gate sites.",
		tags: ["equipment", "lightning", "shadow"],
		theme_tags: ["mana-overflow", "survival", "dimensional-bleed"],
	},
	{
		id: "bg-oil-coveralls",
		name: "Oil-Stained Coveralls",
		description:
			"Durable work coveralls permanently stained with motor oil, hydraulic fluid, and aetheric residue. Fire-resistant (sort of) and covered in useful pockets.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/item-0994.webp",
		weight: 3,
		value: 10,
		item_type: "misc",
		effects: {
			passive: ["Resistance to acid damage from mechanical fluids"],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"First documented during the Second Awakening Wave, when Hunters worldwide reported spontaneous power surges.",
			origin:
				"Reverse-engineered from Architect combat data recovered by the Hunter Bureau's R&D division.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"Silences the remnants of a dead world. Evolution compressed into a single, violent instant.",
		discovery_lore:
			"Sold by a mysterious merchant who appears only during full moons near active Gate sites.",
		tags: ["equipment", "support", "utility", "healing"],
		theme_tags: ["mana-overflow", "experimental"],
	},
	{
		id: "bg-rune-wrenches",
		name: "Rune-Modified Wrench Set",
		description:
			"A portable toolbox containing wrenches, screwdrivers, and pliers that have been etched with minor reinforcement runes. They never rust and provide better grip on aetherically charged components.",
		rarity: "uncommon",
		type: "wondrous",
		image: "/generated/compendium/items/item-0230.webp",
		weight: 8,
		value: 50,
		item_type: "tool",
		effects: {
			passive: [
				"+2 to checks involving repair or dismantling mechanical devices",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Originally developed as a countermeasure against Regent-class entities during the Regent Wars.",
			origin:
				"Formed naturally in a mana vein so dense that reality itself began to crystallize around it.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Bureau-issue. Inventoried. Forgotten.",
		discovery_lore:
			"Logged at a Bureau weigh-station after a routine post-clear inventory.",
		tags: ["equipment", "sustained", "defensive", "healing"],
		theme_tags: ["forbidden", "mana-overflow"],
	},
	{
		id: "bg-aetheric-scanner",
		name: "Aetheric Diagnostic Scanner",
		description:
			"An automotive diagnostic scanner that sometimes picks up aetheric frequencies. The screen glitches near rifts, displaying energy readings that experienced mechanics have learned to interpret.",
		rarity: "uncommon",
		type: "wondrous",
		image: "/generated/compendium/items/item-0916.webp",
		weight: 1,
		value: 35,
		item_type: "tool",
		effects: {
			passive: [
				"Can detect aetheric energy in objects within 10 feet",
				"+1 to Arcana checks involving magitech",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"The American Hunter Bureau's Project: Starfall attempted to weaponize this before the program was defunded.",
			origin:
				"Reconstructed from fragments scattered across seven different C-Rank dungeons.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"Cheap, ubiquitous, and sometimes the only thing between you and a black bag.",
		discovery_lore:
			"Emerged from a Gate Boss's dissolution cloud, hovering where the creature's heart had been.",
		tags: ["equipment", "support", "utility"],
		theme_tags: ["dimensional-bleed", "dungeon-core"],
	},
	{
		id: "bg-fire-jacket",
		name: "Guild-Reinforced Tactical Jacket",
		description:
			"A fire-resistant tactical jacket upgraded with guild-standard aetheric shielding. The Nomex outer layer has been treated with rift-crystal dust, providing enhanced heat protection.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0547.webp",
		weight: 8,
		value: 75,
		item_type: "armor",
		armor_class: "13 + Dex modifier (max 2)",
		armor_type: "Medium",
		effects: {
			passive: ["Resistance to fire damage from non-magical sources"],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"This technique was banned by the International Guild Association for eighteen months before being reclassified.",
			origin:
				"Discovered embedded in the spine of a petrified World Tree fragment found in Scandinavia.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Built by Bureau Technomancer who've patched real wounds.",
		discovery_lore:
			"Sold by a mysterious merchant who appears only during full moons near active Gate sites.",
		tags: ["equipment", "stealth", "damage", "debuff", "support"],
		theme_tags: ["gate-zone", "shadow-domain"],
	},
	{
		id: "bg-halligan-bar",
		name: "Halligan Bar",
		description:
			"A firefighter's breaching tool—a steel bar with a claw, blade, and pike. Used for forcing open doors, breaking through walls, and prying apart wreckage. An effective improvised weapon.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/item-0542.webp",
		weight: 10,
		value: 30,
		item_type: "weapon",
		weapon_type: "martial melee",
		damage: "1d8",
		damage_type: "bludgeoning",
		simple_properties: ["versatile"],
		effects: {
			passive: [
				"Advantage on Strength checks to force open doors and barriers",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse:
				"The user becomes unable to dream, replaced by visions of the void between Gates.",
			history:
				"Originally thought to be a failed experiment, it was rediscovered when a junior researcher noticed anomalous readings.",
			origin:
				"Unearthed by a mining Guild operating in the mana-saturated quarries of the Australian Outback.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Built to hit. Built to keep working.",
		discovery_lore:
			"Logged at a Bureau weigh-station after a routine post-clear inventory.",
		tags: ["equipment", "debuff", "control", "psychic"],
		theme_tags: ["post-awakening", "regent-era", "gate-zone"],
	},
	{
		id: "bg-dept-radio",
		name: "Gate-Zone Department Radio",
		description:
			"A department radio modified for gate-zone frequencies. Hardened against aetheric interference. Can communicate with other radios within 3 miles, or 1 mile inside a gate.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/item-0789.webp",
		weight: 0.5,
		value: 25,
		item_type: "tool",
		effects: {
			passive: ["Communication range: 3 miles (1 mile in gate zones)"],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"The Japanese Hunter Association attempted to classify this as a national treasure to prevent export.",
			origin:
				"Leaked through a micro-rift that appeared inside the International Hunter Conference hall.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Standard kit for those who plan to come back.",
		discovery_lore:
			"Recovered from a time-locked chest that required three different elemental keys to open.",
		tags: ["equipment", "shadow", "area", "debuff"],
		theme_tags: ["modern-warfare", "dimensional-bleed", "dungeon-core"],
	},
	{
		id: "bg-case-binder",
		name: "Case File Binder",
		description:
			"A worn binder originally used for case files, now repurposed for anomaly reports, refugee tracking, and contact management. Color-coded tabs and meticulous organization.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/item-0325.webp",
		weight: 2,
		value: 10,
		item_type: "misc",
		effects: {
			passive: ["+1 to Insight checks when reviewing documents or records"],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse:
				"Prolonged use causes the wielder's shadow to move independently, whispering in dead languages.",
			history:
				"This was one of twelve artifacts recovered from the infamous Kamish Raid that changed modern Hunter warfare.",
			origin:
				"Decoded from ancient sigil-stones found beneath the ruins of a pre-Awakening temple in Kyoto.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Belongs in the bottom of every Hunter's go-bag.",
		discovery_lore:
			"Appeared in a Hunter's inventory after a Order notification that no one else could see.",
		tags: ["equipment", "control", "buff", "burst"],
		theme_tags: ["forbidden", "elite-tier", "experimental"],
	},
	{
		id: "bg-govt-id",
		name: "Government-Issued ID",
		description:
			"A government social services ID that still opens some doors—literally. The lamination is peeling, but the barcode still works at Bureau-affiliated facilities.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/item-0842.webp",
		weight: 0.1,
		value: 5,
		item_type: "misc",
		effects: {
			passive: [
				"Grants access to government and Bureau-affiliated public facilities",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"The Hunter Bureau classified this as a Level-4 threat vector before it was repurposed for field operations.",
			origin:
				"Recovered from the personal vault of a National-Level Hunter who vanished during the First Calamity.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Standard kit for those who plan to come back.",
		discovery_lore:
			"Sold by a mysterious merchant who appears only during full moons near active Gate sites.",
		tags: ["equipment", "single-target", "support"],
		theme_tags: ["guild-ops", "gate-zone"],
	},
	{
		id: "bg-deescalation-guide",
		name: "Crisis De-Escalation Guide",
		description:
			"A pocket-sized guide to crisis intervention techniques. Dog-eared, highlighted, and annotated with personal notes. Includes chapters on PTSD, aetheric shock syndrome, and post-awakening trauma.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/item-0595.webp",
		weight: 0.3,
		value: 10,
		item_type: "misc",
		effects: {
			passive: ["+1 to Persuasion checks to calm frightened or hostile NPCs"],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Intelligence reports link this to the Shadow Regent's army, though the connection remains unconfirmed.",
			origin:
				"Gifted by a dying Regent as payment for a debt that predates human civilization.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Bureau-issue. Inventoried. Forgotten.",
		discovery_lore:
			"Surfaced when a Guild quartermaster did a five-year locker audit.",
		tags: ["equipment", "defensive", "damage", "perception", "debuff"],
		theme_tags: ["black-market", "elite-tier", "regent-era"],
	},
	{
		id: "bg-tactical-vest",
		name: "Department-Issue Tactical Vest",
		description:
			"A reinforced tactical vest from the police department, dented from a gate-creature encounter. The ceramic plates have been swapped for aetheric-dampening inserts by the Ascendant Bureau.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/item-0834.webp",
		weight: 8,
		value: 50,
		item_type: "armor",
		armor_class: "14 + Dex modifier (max 2)",
		armor_type: "Medium",
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"The Japanese Hunter Association attempted to classify this as a national treasure to prevent export.",
			origin:
				"Confiscated from a black-market dealer operating in the shadow districts of Manila.",
			personality: "",
			prior_owners: [],
		},
		flavor:
			"What's left of you after it's done its job is what you started with.",
		discovery_lore:
			"Logged at a Bureau weigh-station after a routine post-clear inventory.",
		tags: ["equipment", "psychic", "offensive", "single-target", "radiant"],
		theme_tags: ["survival", "elite-tier", "mana-overflow"],
	},
	{
		id: "bg-mana-handcuffs",
		name: "Mana-Inert Handcuffs",
		description:
			"Specially forged handcuffs treated with mana-dampening alloy. A restrained creature has disadvantage on attempts to cast spells or use mana-based abilities. Standard issue for Bureau enforcement.",
		rarity: "uncommon",
		type: "wondrous",
		image: "/generated/compendium/items/item-0226.webp",
		weight: 1,
		value: 40,
		item_type: "misc",
		effects: {
			passive: [
				"Restrained creature has disadvantage on spellcasting checks",
				"Requires DC 20 Strength or DC 25 Sleight of Hand to escape",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Combat logs from the Busan Incident show this was used to hold a Gate breach for forty-seven minutes.",
			origin:
				"Emerged from the Hunter Association's classified Project: Lattice Break experiments.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Standard kit for those who plan to come back.",
		discovery_lore:
			"Logged at a Bureau weigh-station after a routine post-clear inventory.",
		tags: ["equipment", "burst", "control", "ice", "necrotic"],
		theme_tags: ["experimental", "dimensional-bleed", "rift-energy"],
	},
	{
		id: "bg-police-badge",
		name: "Ascendant Bureau Badge",
		description:
			"A police badge that has been reissued by the Ascendant Bureau. Carries weight with both civilian law enforcement and guild security. The shield design incorporates a stylized rift sigil.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/item-0730.webp",
		weight: 0.2,
		value: 15,
		item_type: "misc",
		effects: {
			passive: [
				"+2 to Intimidation checks against non-hostile NPCs",
				"Grants access to law enforcement facilities and crime scenes",
			],
		},
		source: "Rift Ascendant Canon",
		lore: {
			current_owner: "",
			curse: "",
			history:
				"Multiple Guilds have attempted to replicate this; all reproductions have proven inferior to the original.",
			origin:
				"Leaked through a micro-rift that appeared inside the International Hunter Conference hall.",
			personality: "",
			prior_owners: [],
		},
		flavor: "Standard kit for those who plan to come back.",
		discovery_lore:
			"Reported on a salvage manifest filed two weeks after the clear that produced it.",
		tags: ["equipment", "control", "buff", "mobility", "necrotic"],
		theme_tags: ["survival", "post-awakening", "system-glitch"],
	},
];
