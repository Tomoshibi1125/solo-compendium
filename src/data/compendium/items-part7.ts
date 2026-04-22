import type { Item } from "./items";

export const items_part7: Item[] = [
	{
		id: "item_p7_0",
		name: "Void Revolver",
		description:
			"A weapon forged from gate anomaly materials. Radiates a faint, deadly hum.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/items/shadow-blade.webp",
		weight: 6,
		value: 390,
		item_type: "weapon",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["+1 to attack rolls against beasts."],
		},
		damage: "1d8",
		damage_type: "kinetic",
		weapon_type: "martial melee",
		lore: {
			origin:
				"Manifested spontaneously during a double-dungeon event in the American Midwest.",
			history:
				"First documented during the Second Awakening Wave, when Hunters worldwide reported spontaneous power surges.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Mirrors the threshold of human potential. Evolution compressed into a single, violent instant.",
		discovery_lore:
			"Found in a hidden compartment of a relic weapon that had been in Guild storage for years.",
		tags: ["equipment", "single-target", "lightning", "radiant"],
		theme_tags: ["urban-combat", "regent-era"],
	},
	{
		id: "item_p7_1",
		name: "Abyssal Dagger",
		description:
			"A weapon forged from gate anomaly materials. Radiates a faint, deadly hum.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/items/health-potion.webp",
		weight: 6,
		value: 416,
		item_type: "weapon",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["+1 to attack rolls against beasts."],
		},
		damage: "1d8",
		damage_type: "kinetic",
		weapon_type: "martial melee",
		lore: {
			origin:
				"Woven from the screams of a Gate Boss that achieved sentience moments before death.",
			history:
				"This was one of twelve artifacts recovered from the infamous Kamish Raid that changed modern Hunter warfare.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Reclaims the laws of physics. The final equation in a war without end.",
		discovery_lore:
			"Emerged from a Gate Boss's dissolution cloud, hovering where the creature's heart had been.",
		tags: ["equipment", "psychic", "single-target", "void"],
		theme_tags: ["experimental", "system-glitch", "survival"],
	},
	{
		id: "item_p7_2",
		name: "Aether-Plated Tactical Helmet",
		description:
			"Modern tactical armor laced with mana-reactive alloys for enhanced protection.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/items/shadow-blade.webp",
		weight: 6,
		value: 507,
		item_type: "armor",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Resistance to minor piercing damage."],
		},
		armor_type: "Medium",
		armor_class: "14 + Dex modifier (max 2)",
		lore: {
			origin:
				"Crystallized from raw mana overflow during the catastrophic Seoul Gate Breach of Year 7.",
			history:
				"Multiple Guilds have attempted to replicate this; all reproductions have proven inferior to the original.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Purges the illusion of safety. A testament to what Hunters have become.",
		discovery_lore:
			"Emerged from a Gate Boss's dissolution cloud, hovering where the creature's heart had been.",
		tags: ["equipment", "lightning", "mobility"],
		theme_tags: ["survival", "black-market"],
	},
	{
		id: "item_p7_3",
		name: "Abyssal Spear",
		description:
			"A weapon forged from gate anomaly materials. Radiates a faint, deadly hum.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/items/health-potion.webp",
		weight: 6,
		value: 53,
		item_type: "weapon",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["+1 to attack rolls against beasts."],
		},
		damage: "1d10",
		damage_type: "kinetic",
		weapon_type: "martial melee",
		lore: {
			origin:
				"Found clutched in the hand of a petrified E-Rank Hunter who had been missing for three years.",
			history:
				"Guild archives show at least three S-Rank Hunters have died attempting to master its full potential.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Eclipses the boundary between life and death. The reason S-Rank Gates are feared.",
		discovery_lore:
			"Found pulsing with residual mana in the aftermath of a Gate break, half-buried in shattered concrete.",
		tags: ["equipment", "necrotic", "sustained", "debuff", "healing"],
		theme_tags: ["ancient-power", "elite-tier", "survival"],
	},
	{
		id: "item_p7_4",
		name: "Aegis Breastplate",
		description:
			"Modern tactical armor laced with mana-reactive alloys for enhanced protection.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/items/shadow-armor.webp",
		weight: 7,
		value: 387,
		item_type: "armor",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Resistance to minor piercing damage."],
		},
		armor_type: "Medium",
		armor_class: "14 + Dex modifier (max 2)",
		lore: {
			origin:
				"Translated from forbidden shadow-language inscriptions found in a Regent's throne room.",
			history:
				"The Japanese Hunter Association attempted to classify this as a national treasure to prevent export.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Mirrors the flow of causality. A whisper from the edge of oblivion.",
		discovery_lore:
			"Found pulsing with residual mana in the aftermath of a Gate break, half-buried in shattered concrete.",
		tags: ["equipment", "single-target", "buff", "shadow", "area"],
		theme_tags: ["mana-overflow", "survival"],
	},
	{
		id: "item_p7_5",
		name: "Lesser Stamina Stim",
		description:
			"A popular item among hunters venturing into E to C rank gates.",
		rarity: "common",
		type: "consumable",
		image: "/generated/items/shadow-blade.webp",
		weight: 5,
		value: 30,
		item_type: "consumable",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Restores 2d4 + 2 HP or Mana."],
		},
		lore: {
			origin:
				"Reverse-engineered from Architect combat data recovered by the Hunter Bureau's R&D division.",
			history:
				"First documented during the Second Awakening Wave, when Hunters worldwide reported spontaneous power surges.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Eclipses the last defense of the unprepared. The death of hesitation, made manifest.",
		discovery_lore:
			"Emerged from a Gate Boss's dissolution cloud, hovering where the creature's heart had been.",
		tags: ["equipment", "utility", "support"],
		theme_tags: ["experimental", "system-glitch"],
	},
	{
		id: "item_p7_6",
		name: "Concentrated Liquid Shadow",
		description:
			"A popular item among hunters venturing into E to C rank gates.",
		rarity: "common",
		type: "consumable",
		image: "/generated/items/shadow-ring.webp",
		weight: 1,
		value: 106,
		item_type: "consumable",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Restores 2d4 + 2 HP or Mana."],
		},
		lore: {
			origin:
				"Reconstructed from fragments scattered across seven different C-Rank dungeons.",
			history:
				"This technique was banned by the International Guild Association for eighteen months before being reclassified.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Commands the last defense of the unprepared. A beautiful catastrophe measured in milliseconds.",
		discovery_lore:
			"Gifted by the Order itself as a reward for completing a hidden quest chain.",
		tags: ["equipment", "void", "support", "radiant"],
		theme_tags: ["dungeon-core", "classified"],
	},
	{
		id: "item_p7_7",
		name: "Phantom Combat Vest",
		description:
			"Modern tactical armor laced with mana-reactive alloys for enhanced protection.",
		rarity: "rare",
		type: "armor",
		image: "/generated/items/shadow-blade.webp",
		weight: 8,
		value: 250,
		item_type: "armor",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Resistance to minor piercing damage."],
		},
		armor_type: "Medium",
		armor_class: "14 + Dex modifier (max 2)",
		lore: {
			origin:
				"Recovered from the personal vault of a National-Level Hunter who vanished during the First Calamity.",
			history:
				"Intelligence reports link this to the Shadow Regent's army, though the connection remains unconfirmed.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Purges the silence between heartbeats. The death of hesitation, made manifest.",
		discovery_lore:
			"Excavated from the crystallized mana deposit at the center of a depleted Gate core.",
		tags: ["equipment", "healing", "radiant"],
		theme_tags: ["dimensional-bleed", "shadow-domain", "system-glitch"],
	},
	{
		id: "item_p7_8",
		name: "Vanguard Bracers",
		description:
			"Modern tactical armor laced with mana-reactive alloys for enhanced protection.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/items/shadow-armor.webp",
		weight: 1,
		value: 339,
		item_type: "armor",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Resistance to minor piercing damage."],
		},
		armor_type: "Medium",
		armor_class: "14 + Dex modifier (max 2)",
		lore: {
			origin:
				"Born from a Order glitch that briefly merged two overlapping Gate instances.",
			history:
				"The Japanese Hunter Association attempted to classify this as a national treasure to prevent export.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Commands the dimensional barrier. Proof that some things cannot be survived.",
		discovery_lore:
			"Materialized on a Hunter's workbench overnight, leaving scorch marks in the shape of unknown glyphs.",
		tags: ["equipment", "shadow", "single-target"],
		theme_tags: ["black-market", "classified", "hunter-bureau"],
	},
	{
		id: "item_p7_9",
		name: "Black-Market Mana Elixir",
		description:
			"A popular item among hunters venturing into E to C rank gates.",
		rarity: "common",
		type: "consumable",
		image: "/generated/items/health-potion.webp",
		weight: 7,
		value: 124,
		item_type: "consumable",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Restores 2d4 + 2 HP or Mana."],
		},
		lore: {
			origin:
				"Woven from the screams of a Gate Boss that achieved sentience moments before death.",
			history:
				"Multiple Guilds have attempted to replicate this; all reproductions have proven inferior to the original.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Inverts the concept of distance. A reminder that the Order has no mercy.",
		discovery_lore:
			"Materialized on a Hunter's workbench overnight, leaving scorch marks in the shape of unknown glyphs.",
		tags: ["equipment", "radiant", "area", "debuff", "necrotic"],
		theme_tags: ["hunter-bureau", "forbidden", "elite-tier"],
	},
	{
		id: "item_p7_10",
		name: "Hunter's Spear",
		description:
			"A weapon forged from gate anomaly materials. Radiates a faint, deadly hum.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/items/health-potion.webp",
		weight: 5,
		value: 502,
		item_type: "weapon",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["+1 to attack rolls against beasts."],
		},
		damage: "1d10",
		damage_type: "kinetic",
		weapon_type: "martial melee",
		lore: {
			origin:
				"Woven from the screams of a Gate Boss that achieved sentience moments before death.",
			history:
				"Originally developed as a countermeasure against Regent-class entities during the Sovereignty Wars.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Shatters the architecture of the soul. The reason S-Rank Gates are feared.",
		discovery_lore:
			"Sold by a mysterious merchant who appears only during full moons near active Gate sites.",
		tags: ["equipment", "shadow", "lightning", "burst"],
		theme_tags: ["post-awakening", "shadow-domain", "dungeon-core"],
	},
	{
		id: "item_p7_11",
		name: "Nano-Weave Shin Guards",
		description:
			"Modern tactical armor laced with mana-reactive alloys for enhanced protection.",
		rarity: "rare",
		type: "armor",
		image: "/generated/items/shadow-blade.webp",
		weight: 6,
		value: 463,
		item_type: "armor",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Resistance to minor piercing damage."],
		},
		armor_type: "Medium",
		armor_class: "14 + Dex modifier (max 2)",
		lore: {
			origin:
				"Crystallized from raw mana overflow during the catastrophic Seoul Gate Breach of Year 7.",
			history:
				"Records indicate this was used by the original Clearing Party that neutralized the first S-Rank Gate on Korean soil.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Warps the boundary between life and death. A beautiful catastrophe measured in milliseconds.",
		discovery_lore:
			"Found pulsing with residual mana in the aftermath of a Gate break, half-buried in shattered concrete.",
		tags: ["equipment", "single-target", "fire", "control", "buff"],
		theme_tags: ["dimensional-bleed", "forbidden"],
	},
	{
		id: "item_p7_12",
		name: "Hunter's Halberd",
		description:
			"A weapon forged from gate anomaly materials. Radiates a faint, deadly hum.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/items/shadow-blade.webp",
		weight: 3,
		value: 95,
		item_type: "weapon",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["+1 to attack rolls against beasts."],
		},
		damage: "1d8",
		damage_type: "kinetic",
		weapon_type: "martial melee",
		lore: {
			origin:
				"Recovered from the personal vault of a National-Level Hunter who vanished during the First Calamity.",
			history:
				"First documented during the Second Awakening Wave, when Hunters worldwide reported spontaneous power surges.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Binds the threshold of human potential. A beautiful catastrophe measured in milliseconds.",
		discovery_lore:
			"Found washed ashore near a coastal Gate, wrapped in fabric that dissolved upon touch.",
		tags: ["equipment", "lightning", "psychic"],
		theme_tags: ["experimental", "dungeon-core"],
	},
	{
		id: "item_p7_13",
		name: "Black-Market Aetheric Antidote",
		description:
			"A popular item among hunters venturing into E to C rank gates.",
		rarity: "common",
		type: "consumable",
		image: "/generated/items/shadow-armor.webp",
		weight: 4,
		value: 168,
		item_type: "consumable",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Restores 2d4 + 2 HP or Mana."],
		},
		lore: {
			origin:
				"Salvaged from the corpse of an S-Rank anomaly that breached containment in the European Dead Zone.",
			history:
				"Originally thought to be a failed experiment, it was rediscovered when a junior researcher noticed anomalous readings.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Dissolves the architecture of the soul. The death of hesitation, made manifest.",
		discovery_lore:
			"Found pulsing with residual mana in the aftermath of a Gate break, half-buried in shattered concrete.",
		tags: ["equipment", "healing", "radiant"],
		theme_tags: ["guild-ops", "experimental", "modern-warfare"],
	},
	{
		id: "item_p7_14",
		name: "Crimson Sniper Rifle",
		description:
			"A weapon forged from gate anomaly materials. Radiates a faint, deadly hum.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/items/shadow-armor.webp",
		weight: 3,
		value: 226,
		item_type: "weapon",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["+1 to attack rolls against beasts."],
		},
		damage: "1d8",
		damage_type: "kinetic",
		weapon_type: "martial melee",
		lore: {
			origin:
				"Unearthed by a mining Guild operating in the mana-saturated quarries of the Australian Outback.",
			history:
				"Historical analysis suggests this predates the modern Gate Order by several centuries.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Dissolves the boundary between life and death. A reminder that the Order has no mercy.",
		discovery_lore:
			"Sold by a mysterious merchant who appears only during full moons near active Gate sites.",
		tags: ["equipment", "stealth", "utility", "control"],
		theme_tags: ["elite-tier", "post-awakening"],
	},
	{
		id: "item_p7_15",
		name: "Hunter's Dagger",
		description:
			"A weapon forged from gate anomaly materials. Radiates a faint, deadly hum.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/items/shadow-ring.webp",
		weight: 2,
		value: 385,
		item_type: "weapon",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["+1 to attack rolls against beasts."],
		},
		damage: "1d8",
		damage_type: "kinetic",
		weapon_type: "martial melee",
		lore: {
			origin:
				"Pulled from the dreams of a comatose S-Rank Hunter by a team of psychic-type Awakened.",
			history:
				"This was the subject of a bidding war between three S-Rank Guilds that nearly escalated to armed conflict.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Eclipses the last defense of the unprepared. The death of hesitation, made manifest.",
		discovery_lore:
			"Emerged from a Gate Boss's dissolution cloud, hovering where the creature's heart had been.",
		tags: ["equipment", "damage", "void"],
		theme_tags: ["post-awakening", "classified"],
	},
	{
		id: "item_p7_16",
		name: "Lesser Beast Repellent",
		description:
			"A popular item among hunters venturing into E to C rank gates.",
		rarity: "common",
		type: "consumable",
		image: "/generated/items/shadow-armor.webp",
		weight: 7,
		value: 276,
		item_type: "consumable",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Restores 2d4 + 2 HP or Mana."],
		},
		lore: {
			origin:
				"Unearthed by a mining Guild operating in the mana-saturated quarries of the Australian Outback.",
			history:
				"Combat logs from the Busan Incident show this was used to hold a Gate breach for forty-seven minutes.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Corrodes the last defense of the unprepared. The last thing many anomalies ever see.",
		discovery_lore:
			"Traded by a nomadic Awakened who claimed to have no memory of acquiring it.",
		tags: ["equipment", "burst", "buff", "offensive"],
		theme_tags: ["black-market", "system-glitch", "urban-combat"],
	},
	{
		id: "item_p7_17",
		name: "Guild-Issue Katana",
		description:
			"A weapon forged from gate anomaly materials. Radiates a faint, deadly hum.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/items/shadow-ring.webp",
		weight: 2,
		value: 165,
		item_type: "weapon",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["+1 to attack rolls against beasts."],
		},
		damage: "1d8",
		damage_type: "kinetic",
		weapon_type: "martial melee",
		lore: {
			origin:
				"Formed naturally in a mana vein so dense that reality itself began to crystallize around it.",
			history:
				"The European Hunter Council maintains a standing bounty for information regarding its original creator.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Eclipses the architecture of the soul. Evolution compressed into a single, violent instant.",
		discovery_lore:
			"Appeared in a Hunter's inventory after a Order notification that no one else could see.",
		tags: ["equipment", "psychic", "single-target", "shadow", "support"],
		theme_tags: ["post-awakening", "survival"],
	},
	{
		id: "item_p7_18",
		name: "High-Grade Aetheric Antidote",
		description:
			"A popular item among hunters venturing into E to C rank gates.",
		rarity: "common",
		type: "consumable",
		image: "/generated/items/shadow-ring.webp",
		weight: 3,
		value: 115,
		item_type: "consumable",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Restores 2d4 + 2 HP or Mana."],
		},
		lore: {
			origin:
				"Emerged from the Hunter Association's classified Project: Lattice Break experiments.",
			history:
				"This technique was banned by the International Guild Association for eighteen months before being reclassified.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Silences the flow of causality. The last thing many anomalies ever see.",
		discovery_lore:
			"Appeared in a Hunter's inventory after a Order notification that no one else could see.",
		tags: ["equipment", "healing", "necrotic", "buff", "utility"],
		theme_tags: ["classified", "hunter-bureau"],
	},
	{
		id: "item_p7_19",
		name: "Aetheric Whip",
		description:
			"A weapon forged from gate anomaly materials. Radiates a faint, deadly hum.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/items/shadow-armor.webp",
		weight: 1,
		value: 451,
		item_type: "weapon",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["+1 to attack rolls against beasts."],
		},
		damage: "1d10",
		damage_type: "kinetic",
		weapon_type: "martial melee",
		lore: {
			origin:
				"Unearthed by a mining Guild operating in the mana-saturated quarries of the Australian Outback.",
			history:
				"Originally developed as a countermeasure against Regent-class entities during the Sovereignty Wars.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Corrodes the boundary between life and death. The breaking point of all resistance.",
		discovery_lore:
			"Excavated from the crystallized mana deposit at the center of a depleted Gate core.",
		tags: ["equipment", "radiant", "psychic"],
		theme_tags: ["forbidden", "hunter-bureau"],
	},
	{
		id: "item_p7_20",
		name: "Greater Liquid Shadow",
		description:
			"A popular item among hunters venturing into E to C rank gates.",
		rarity: "common",
		type: "consumable",
		image: "/generated/items/health-potion.webp",
		weight: 7,
		value: 358,
		item_type: "consumable",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Restores 2d4 + 2 HP or Mana."],
		},
		lore: {
			origin:
				"Synthesized in the clandestine laboratories beneath the Chinese Hunter Bureau headquarters.",
			history:
				"This was one of twelve artifacts recovered from the infamous Kamish Raid that changed modern Hunter warfare.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Absorbs the silence between heartbeats. The last thing many anomalies ever see.",
		discovery_lore:
			"Dropped by a mini-boss that shouldn't have existed according to the Gate's difficulty rating.",
		tags: ["equipment", "support", "offensive"],
		theme_tags: ["modern-warfare", "dungeon-core"],
	},
	{
		id: "item_p7_21",
		name: "Greater Liquid Shadow",
		description:
			"A popular item among hunters venturing into E to C rank gates.",
		rarity: "common",
		type: "consumable",
		image: "/generated/items/shadow-ring.webp",
		weight: 4,
		value: 275,
		item_type: "consumable",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Restores 2d4 + 2 HP or Mana."],
		},
		lore: {
			origin:
				"Reconstructed from fragments scattered across seven different C-Rank dungeons.",
			history:
				"This was the subject of a bidding war between three S-Rank Guilds that nearly escalated to armed conflict.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor: "Ignites the laws of physics. The reason S-Rank Gates are feared.",
		discovery_lore:
			"Emerged from a Gate Boss's dissolution cloud, hovering where the creature's heart had been.",
		tags: ["equipment", "stealth", "fire", "psychic"],
		theme_tags: ["dimensional-bleed", "urban-combat"],
	},
	{
		id: "item_p7_22",
		name: "Nano-Weave Trench Coat",
		description:
			"Modern tactical armor laced with mana-reactive alloys for enhanced protection.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/items/shadow-armor.webp",
		weight: 2,
		value: 14,
		item_type: "armor",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Resistance to minor piercing damage."],
		},
		armor_type: "Medium",
		armor_class: "14 + Dex modifier (max 2)",
		lore: {
			origin:
				"Unearthed by a mining Guild operating in the mana-saturated quarries of the Australian Outback.",
			history:
				"This was one of twelve artifacts recovered from the infamous Kamish Raid that changed modern Hunter warfare.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Ignites the certainty of outcomes. The death of hesitation, made manifest.",
		discovery_lore:
			"Discovered by an E-Rank Hunter who stumbled into an unmarked side passage during a routine dungeon clear.",
		tags: ["equipment", "necrotic", "support"],
		theme_tags: ["forbidden", "ancient-power", "rift-energy"],
	},
	{
		id: "item_p7_23",
		name: "Aegis Spaulders",
		description:
			"Modern tactical armor laced with mana-reactive alloys for enhanced protection.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/items/shadow-armor.webp",
		weight: 7,
		value: 440,
		item_type: "armor",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Resistance to minor piercing damage."],
		},
		armor_type: "Medium",
		armor_class: "14 + Dex modifier (max 2)",
		lore: {
			origin:
				"Distilled from the ambient mana of a Red Gate that refused to close for seventeen days.",
			history:
				"First documented during the Second Awakening Wave, when Hunters worldwide reported spontaneous power surges.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Shatters the architect's design. The line between Hunter and monster.",
		discovery_lore:
			"Emerged from a Gate Boss's dissolution cloud, hovering where the creature's heart had been.",
		tags: ["equipment", "shadow", "mobility", "single-target"],
		theme_tags: ["elite-tier", "dungeon-core"],
	},
	{
		id: "item_p7_24",
		name: "Gate-Forged Combat Vest",
		description:
			"Modern tactical armor laced with mana-reactive alloys for enhanced protection.",
		rarity: "rare",
		type: "armor",
		image: "/generated/items/shadow-armor.webp",
		weight: 3,
		value: 292,
		item_type: "armor",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Resistance to minor piercing damage."],
		},
		armor_type: "Medium",
		armor_class: "14 + Dex modifier (max 2)",
		lore: {
			origin:
				"Discovered embedded in the spine of a petrified World Tree fragment found in Scandinavia.",
			history:
				"A-Rank appraiser Guild Master Ryker personally verified its authenticity before it entered general circulation.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Dissolves the certainty of outcomes. The breaking point of all resistance.",
		discovery_lore:
			"Found in a hidden compartment of a relic weapon that had been in Guild storage for years.",
		tags: ["equipment", "area", "support", "single-target"],
		theme_tags: ["experimental", "guild-ops"],
	},
	{
		id: "item_p7_25",
		name: "Ceramic Bracers",
		description:
			"Modern tactical armor laced with mana-reactive alloys for enhanced protection.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/items/shadow-ring.webp",
		weight: 6,
		value: 306,
		item_type: "armor",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Resistance to minor piercing damage."],
		},
		armor_type: "Medium",
		armor_class: "14 + Dex modifier (max 2)",
		lore: {
			origin:
				"Gifted by a dying Regent as payment for a debt that predates human civilization.",
			history:
				"The European Hunter Council maintains a standing bounty for information regarding its original creator.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Overrides the dimensional barrier. A beautiful catastrophe measured in milliseconds.",
		discovery_lore:
			"Emerged from a Gate Boss's dissolution cloud, hovering where the creature's heart had been.",
		tags: ["equipment", "sustained", "damage"],
		theme_tags: ["modern-warfare", "shadow-domain"],
	},
	{
		id: "item_p7_26",
		name: "Shattered Katana",
		description:
			"A weapon forged from gate anomaly materials. Radiates a faint, deadly hum.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/items/shadow-ring.webp",
		weight: 2,
		value: 423,
		item_type: "weapon",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["+1 to attack rolls against beasts."],
		},
		damage: "1d8",
		damage_type: "kinetic",
		weapon_type: "martial melee",
		lore: {
			origin:
				"Stolen from a Guild vault during the Three-Day War between rival Korean Hunter factions.",
			history:
				"Guild archives show at least three S-Rank Hunters have died attempting to master its full potential.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor: "Binds the illusion of safety. The reason S-Rank Gates are feared.",
		discovery_lore:
			"Recovered from a time-locked chest that required three different elemental keys to open.",
		tags: ["equipment", "fire", "single-target", "burst"],
		theme_tags: ["rift-energy", "survival"],
	},
	{
		id: "item_p7_27",
		name: "Black-Market Mana Elixir",
		description:
			"A popular item among hunters venturing into E to C rank gates.",
		rarity: "common",
		type: "consumable",
		image: "/generated/items/shadow-blade.webp",
		weight: 7,
		value: 228,
		item_type: "consumable",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Restores 2d4 + 2 HP or Mana."],
		},
		lore: {
			origin:
				"Manifested spontaneously during a double-dungeon event in the American Midwest.",
			history:
				"Guild archives show at least three S-Rank Hunters have died attempting to master its full potential.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Commands the threshold of human potential. The line between Hunter and monster.",
		discovery_lore:
			"Found pulsing with residual mana in the aftermath of a Gate break, half-buried in shattered concrete.",
		tags: ["equipment", "offensive", "radiant"],
		theme_tags: ["dimensional-bleed", "regent-era", "hunter-bureau"],
	},
	{
		id: "item_p7_28",
		name: "Unstable Mana Elixir",
		description:
			"A popular item among hunters venturing into E to C rank gates.",
		rarity: "common",
		type: "consumable",
		image: "/generated/items/shadow-armor.webp",
		weight: 3,
		value: 179,
		item_type: "consumable",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Restores 2d4 + 2 HP or Mana."],
		},
		lore: {
			origin:
				"Created by an unnamed Awakened blacksmith who fed their own life force into the forge.",
			history:
				"Multiple Guilds have attempted to replicate this; all reproductions have proven inferior to the original.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Binds the silence between heartbeats. The breaking point of all resistance.",
		discovery_lore:
			"Located by a detection-type Hunter whose radar ability triggered on an otherwise empty room.",
		tags: ["equipment", "stealth", "mobility"],
		theme_tags: ["urban-combat", "survival"],
	},
	{
		id: "item_p7_29",
		name: "Shadow Shin Guards",
		description:
			"Modern tactical armor laced with mana-reactive alloys for enhanced protection.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/items/shadow-blade.webp",
		weight: 8,
		value: 364,
		item_type: "armor",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Resistance to minor piercing damage."],
		},
		armor_type: "Medium",
		armor_class: "14 + Dex modifier (max 2)",
		lore: {
			origin:
				"Recovered from the personal vault of a National-Level Hunter who vanished during the First Calamity.",
			history:
				"This was the subject of a bidding war between three S-Rank Guilds that nearly escalated to armed conflict.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Condemns the laws of physics. The death of hesitation, made manifest.",
		discovery_lore:
			"Found washed ashore near a coastal Gate, wrapped in fabric that dissolved upon touch.",
		tags: ["equipment", "debuff", "buff", "support"],
		theme_tags: ["modern-warfare", "mana-overflow"],
	},
	{
		id: "item_p7_30",
		name: "Void Sniper Rifle",
		description:
			"A weapon forged from gate anomaly materials. Radiates a faint, deadly hum.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/items/shadow-armor.webp",
		weight: 4,
		value: 118,
		item_type: "weapon",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["+1 to attack rolls against beasts."],
		},
		damage: "1d10",
		damage_type: "kinetic",
		weapon_type: "martial melee",
		lore: {
			origin:
				"Discovered embedded in the spine of a petrified World Tree fragment found in Scandinavia.",
			history:
				"Field reports indicate prolonged exposure causes minor spatial distortions in a three-meter radius.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Condemns the fabric of reality. Evolution compressed into a single, violent instant.",
		discovery_lore:
			"Traded by a nomadic Awakened who claimed to have no memory of acquiring it.",
		tags: ["equipment", "fire", "buff"],
		theme_tags: ["black-market", "elite-tier"],
	},
	{
		id: "item_p7_31",
		name: "Nano-Weave Combat Vest",
		description:
			"Modern tactical armor laced with mana-reactive alloys for enhanced protection.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/items/health-potion.webp",
		weight: 2,
		value: 450,
		item_type: "armor",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Resistance to minor piercing damage."],
		},
		armor_type: "Medium",
		armor_class: "14 + Dex modifier (max 2)",
		lore: {
			origin:
				"Synthesized in the clandestine laboratories beneath the Chinese Hunter Bureau headquarters.",
			history:
				"Archaeological evidence suggests ancient civilizations may have accessed similar power through ritual sacrifice.",
			curse:
				"Corrupts nearby healing magic by 10%, causing heals to occasionally deal damage instead.",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Sanctifies the dimensional barrier. A testament to what Hunters have become.",
		discovery_lore:
			"Excavated from the crystallized mana deposit at the center of a depleted Gate core.",
		tags: ["equipment", "lightning", "void", "burst", "single-target"],
		theme_tags: ["survival", "guild-ops", "urban-combat"],
	},
	{
		id: "item_p7_32",
		name: "Phantom Tactical Helmet",
		description:
			"Modern tactical armor laced with mana-reactive alloys for enhanced protection.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/items/shadow-armor.webp",
		weight: 1,
		value: 209,
		item_type: "armor",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Resistance to minor piercing damage."],
		},
		armor_type: "Medium",
		armor_class: "14 + Dex modifier (max 2)",
		lore: {
			origin:
				"Translated from forbidden shadow-language inscriptions found in a Regent's throne room.",
			history:
				"The Japanese Hunter Association attempted to classify this as a national treasure to prevent export.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Binds the last defense of the unprepared. Evolution compressed into a single, violent instant.",
		discovery_lore:
			"Recovered from a time-locked chest that required three different elemental keys to open.",
		tags: ["equipment", "utility", "debuff", "mobility", "support"],
		theme_tags: ["shadow-domain", "regent-era", "mana-overflow"],
	},
	{
		id: "item_p7_33",
		name: "Dragon-Scale Combat Vest",
		description:
			"Modern tactical armor laced with mana-reactive alloys for enhanced protection.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/items/health-potion.webp",
		weight: 8,
		value: 389,
		item_type: "armor",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Resistance to minor piercing damage."],
		},
		armor_type: "Medium",
		armor_class: "14 + Dex modifier (max 2)",
		lore: {
			origin:
				"Excavated from a pocket dimension that existed for exactly one hour before collapsing.",
			history:
				"Archaeological evidence suggests ancient civilizations may have accessed similar power through ritual sacrifice.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Shatters the flow of causality. The line between Hunter and monster.",
		discovery_lore:
			"Gifted by the Order itself as a reward for completing a hidden quest chain.",
		tags: ["equipment", "void", "burst", "damage", "fire"],
		theme_tags: ["urban-combat", "rift-energy", "gate-zone"],
	},
	{
		id: "item_p7_34",
		name: "Ceramic Bracers",
		description:
			"Modern tactical armor laced with mana-reactive alloys for enhanced protection.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/items/shadow-ring.webp",
		weight: 4,
		value: 470,
		item_type: "armor",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Resistance to minor piercing damage."],
		},
		armor_type: "Medium",
		armor_class: "14 + Dex modifier (max 2)",
		lore: {
			origin:
				"Formed naturally in a mana vein so dense that reality itself began to crystallize around it.",
			history:
				"Archaeological evidence suggests ancient civilizations may have accessed similar power through ritual sacrifice.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Overrides the laws of physics. A beautiful catastrophe measured in milliseconds.",
		discovery_lore:
			"Excavated from the crystallized mana deposit at the center of a depleted Gate core.",
		tags: ["equipment", "radiant", "burst", "stealth", "healing"],
		theme_tags: ["dimensional-bleed", "experimental", "elite-tier"],
	},
	{
		id: "item_p7_35",
		name: "Shattered Spear",
		description:
			"A weapon forged from gate anomaly materials. Radiates a faint, deadly hum.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/items/health-potion.webp",
		weight: 7,
		value: 131,
		item_type: "weapon",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["+1 to attack rolls against beasts."],
		},
		damage: "1d8",
		damage_type: "kinetic",
		weapon_type: "martial melee",
		lore: {
			origin:
				"Excavated from a pocket dimension that existed for exactly one hour before collapsing.",
			history:
				"This technique was banned by the International Guild Association for eighteen months before being reclassified.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Binds the remnants of a dead world. Evolution compressed into a single, violent instant.",
		discovery_lore:
			"Emerged from a Gate Boss's dissolution cloud, hovering where the creature's heart had been.",
		tags: ["equipment", "defensive", "single-target", "sustained", "radiant"],
		theme_tags: ["black-market", "urban-combat"],
	},
	{
		id: "item_p7_36",
		name: "Titanium Breastplate",
		description:
			"Modern tactical armor laced with mana-reactive alloys for enhanced protection.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/items/shadow-armor.webp",
		weight: 8,
		value: 156,
		item_type: "armor",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Resistance to minor piercing damage."],
		},
		armor_type: "Medium",
		armor_class: "14 + Dex modifier (max 2)",
		lore: {
			origin:
				"Salvaged from the corpse of an S-Rank anomaly that breached containment in the European Dead Zone.",
			history:
				"The first recorded use caused a localized reality fracture that took a specialized team forty hours to repair.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Dissolves the dimensional barrier. A reminder that the Order has no mercy.",
		discovery_lore:
			"Traded by a nomadic Awakened who claimed to have no memory of acquiring it.",
		tags: ["equipment", "damage", "offensive", "debuff"],
		theme_tags: ["regent-era", "dimensional-bleed"],
	},
	{
		id: "item_p7_37",
		name: "Aether-Plated Spaulders",
		description:
			"Modern tactical armor laced with mana-reactive alloys for enhanced protection.",
		rarity: "rare",
		type: "armor",
		image: "/generated/items/shadow-ring.webp",
		weight: 7,
		value: 125,
		item_type: "armor",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Resistance to minor piercing damage."],
		},
		armor_type: "Medium",
		armor_class: "14 + Dex modifier (max 2)",
		lore: {
			origin:
				"Manifested spontaneously during a double-dungeon event in the American Midwest.",
			history:
				"Field reports indicate prolonged exposure causes minor spatial distortions in a three-meter radius.",
			curse:
				"Each activation permanently reduces the user's maximum HP by 1, imperceptible until it's too late.",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Reclaims the architecture of the soul. A reminder that the Order has no mercy.",
		discovery_lore:
			"Discovered by an E-Rank Hunter who stumbled into an unmarked side passage during a routine dungeon clear.",
		tags: ["equipment", "support", "psychic", "void", "perception"],
		theme_tags: ["system-glitch", "ancient-power"],
	},
	{
		id: "item_p7_38",
		name: "Void Spear",
		description:
			"A weapon forged from gate anomaly materials. Radiates a faint, deadly hum.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/items/health-potion.webp",
		weight: 6,
		value: 77,
		item_type: "weapon",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["+1 to attack rolls against beasts."],
		},
		damage: "1d8",
		damage_type: "kinetic",
		weapon_type: "martial melee",
		lore: {
			origin:
				"Created by an unnamed Awakened blacksmith who fed their own life force into the forge.",
			history:
				"Archaeological evidence suggests ancient civilizations may have accessed similar power through ritual sacrifice.",
			curse:
				"Causes mild paranoia after extended use; the user becomes convinced they are being watched through mirrors.",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Reclaims the laws of physics. Evolution compressed into a single, violent instant.",
		discovery_lore:
			"Appeared in a Hunter's inventory after a Order notification that no one else could see.",
		tags: ["equipment", "single-target", "shadow", "radiant", "fire"],
		theme_tags: ["shadow-domain", "black-market"],
	},
	{
		id: "item_p7_39",
		name: "Concentrated Beast Repellent",
		description:
			"A popular item among hunters venturing into E to C rank gates.",
		rarity: "common",
		type: "consumable",
		image: "/generated/items/health-potion.webp",
		weight: 1,
		value: 31,
		item_type: "consumable",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Restores 2d4 + 2 HP or Mana."],
		},
		lore: {
			origin:
				"Found clutched in the hand of a petrified E-Rank Hunter who had been missing for three years.",
			history:
				"Originally developed as a countermeasure against Regent-class entities during the Sovereignty Wars.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Overrides the illusion of safety. A reminder that the Order has no mercy.",
		discovery_lore:
			"Located by a detection-type Hunter whose radar ability triggered on an otherwise empty room.",
		tags: ["equipment", "perception", "psychic", "burst", "single-target"],
		theme_tags: ["guild-ops", "modern-warfare"],
	},
	{
		id: "item_p7_40",
		name: "Guild-Standard Aetheric Antidote",
		description:
			"A popular item among hunters venturing into E to C rank gates.",
		rarity: "common",
		type: "consumable",
		image: "/generated/items/shadow-blade.webp",
		weight: 6,
		value: 305,
		item_type: "consumable",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Restores 2d4 + 2 HP or Mana."],
		},
		lore: {
			origin:
				"Decoded from ancient sigil-stones found beneath the ruins of a pre-Awakening temple in Kyoto.",
			history:
				"Originally developed as a countermeasure against Regent-class entities during the Sovereignty Wars.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Corrodes the threshold of human potential. The last thing many anomalies ever see.",
		discovery_lore:
			"Gifted by the Order itself as a reward for completing a hidden quest chain.",
		tags: ["equipment", "lightning", "healing", "damage", "single-target"],
		theme_tags: ["dimensional-bleed", "survival", "hunter-bureau"],
	},
	{
		id: "item_p7_41",
		name: "Concentrated Beast Repellent",
		description:
			"A popular item among hunters venturing into E to C rank gates.",
		rarity: "common",
		type: "consumable",
		image: "/generated/items/shadow-blade.webp",
		weight: 7,
		value: 481,
		item_type: "consumable",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Restores 2d4 + 2 HP or Mana."],
		},
		lore: {
			origin:
				"Discovered embedded in the spine of a petrified World Tree fragment found in Scandinavia.",
			history:
				"First documented during the Second Awakening Wave, when Hunters worldwide reported spontaneous power surges.",
			curse:
				"Causes mild paranoia after extended use; the user becomes convinced they are being watched through mirrors.",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Inverts the silence between heartbeats. The last thing many anomalies ever see.",
		discovery_lore:
			"Found in a hidden compartment of a relic weapon that had been in Guild storage for years.",
		tags: ["equipment", "necrotic", "buff", "damage", "utility"],
		theme_tags: ["rift-energy", "experimental", "guild-ops"],
	},
	{
		id: "item_p7_42",
		name: "Nano-Weave Tactical Helmet",
		description:
			"Modern tactical armor laced with mana-reactive alloys for enhanced protection.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/items/shadow-blade.webp",
		weight: 7,
		value: 357,
		item_type: "armor",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Resistance to minor piercing damage."],
		},
		armor_type: "Medium",
		armor_class: "14 + Dex modifier (max 2)",
		lore: {
			origin:
				"Manifested spontaneously during a double-dungeon event in the American Midwest.",
			history:
				"Originally thought to be a failed experiment, it was rediscovered when a junior researcher noticed anomalous readings.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Pins the cast's result to one deterministic branch. A testament to what Hunters have become.",
		discovery_lore:
			"Emerged from a Gate Boss's dissolution cloud, hovering where the creature's heart had been.",
		tags: ["equipment", "support", "perception", "defensive"],
		theme_tags: ["gate-zone", "classified", "post-awakening"],
	},
	{
		id: "item_p7_43",
		name: "Obsidian Halberd",
		description:
			"A weapon forged from gate anomaly materials. Radiates a faint, deadly hum.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/items/shadow-blade.webp",
		weight: 6,
		value: 323,
		item_type: "weapon",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["+1 to attack rolls against beasts."],
		},
		damage: "1d8",
		damage_type: "kinetic",
		weapon_type: "martial melee",
		lore: {
			origin:
				"Extracted from the dimensional residue of a collapsed B-Rank Gate in downtown Seoul.",
			history:
				"Records indicate this was used by the original Clearing Party that neutralized the first S-Rank Gate on Korean soil.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Ignites the last defense of the unprepared. The death of hesitation, made manifest.",
		discovery_lore:
			"Located by a detection-type Hunter whose radar ability triggered on an otherwise empty room.",
		tags: ["equipment", "psychic", "utility", "burst", "control"],
		theme_tags: ["dungeon-core", "dimensional-bleed", "rift-energy"],
	},
	{
		id: "item_p7_44",
		name: "Aether-Plated Bracers",
		description:
			"Modern tactical armor laced with mana-reactive alloys for enhanced protection.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/items/health-potion.webp",
		weight: 4,
		value: 34,
		item_type: "armor",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Resistance to minor piercing damage."],
		},
		armor_type: "Medium",
		armor_class: "14 + Dex modifier (max 2)",
		lore: {
			origin:
				"Woven from the screams of a Gate Boss that achieved sentience moments before death.",
			history:
				"Combat logs from the Busan Incident show this was used to hold a Gate breach for forty-seven minutes.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Shatters the chains of mortality. The last thing many anomalies ever see.",
		discovery_lore:
			"Materialized on a Hunter's workbench overnight, leaving scorch marks in the shape of unknown glyphs.",
		tags: ["equipment", "lightning", "sustained"],
		theme_tags: ["forbidden", "urban-combat", "black-market"],
	},
	{
		id: "item_p7_45",
		name: "Unstable Mana Elixir",
		description:
			"A popular item among hunters venturing into E to C rank gates.",
		rarity: "common",
		type: "consumable",
		image: "/generated/items/shadow-ring.webp",
		weight: 8,
		value: 412,
		item_type: "consumable",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Restores 2d4 + 2 HP or Mana."],
		},
		lore: {
			origin:
				"Formed naturally in a mana vein so dense that reality itself began to crystallize around it.",
			history:
				"First documented during the Second Awakening Wave, when Hunters worldwide reported spontaneous power surges.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Fractures the concept of distance. The reason S-Rank Gates are feared.",
		discovery_lore:
			"Found in a hidden compartment of a relic weapon that had been in Guild storage for years.",
		tags: ["equipment", "perception", "offensive"],
		theme_tags: ["system-glitch", "experimental", "forbidden"],
	},
	{
		id: "item_p7_46",
		name: "Gate-Forged Combat Vest",
		description:
			"Modern tactical armor laced with mana-reactive alloys for enhanced protection.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/items/shadow-blade.webp",
		weight: 4,
		value: 371,
		item_type: "armor",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Resistance to minor piercing damage."],
		},
		armor_type: "Medium",
		armor_class: "14 + Dex modifier (max 2)",
		lore: {
			origin:
				"Reverse-engineered from Architect combat data recovered by the Hunter Bureau's R&D division.",
			history:
				"The American Hunter Bureau's Project: Starfall attempted to weaponize this before the program was defunded.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Overrides the remnants of a dead world. The line between Hunter and monster.",
		discovery_lore:
			"Discovered by an E-Rank Hunter who stumbled into an unmarked side passage during a routine dungeon clear.",
		tags: ["equipment", "area", "utility", "support", "necrotic"],
		theme_tags: ["experimental", "post-awakening"],
	},
	{
		id: "item_p7_47",
		name: "Ceramic Shin Guards",
		description:
			"Modern tactical armor laced with mana-reactive alloys for enhanced protection.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/items/shadow-blade.webp",
		weight: 2,
		value: 225,
		item_type: "armor",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Resistance to minor piercing damage."],
		},
		armor_type: "Medium",
		armor_class: "14 + Dex modifier (max 2)",
		lore: {
			origin:
				"Extracted from the dimensional residue of a collapsed B-Rank Gate in downtown Seoul.",
			history:
				"This technique was banned by the International Guild Association for eighteen months before being reclassified.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Overrides the remnants of a dead world. A testament to what Hunters have become.",
		discovery_lore:
			"Emerged from a Gate Boss's dissolution cloud, hovering where the creature's heart had been.",
		tags: ["equipment", "offensive", "control", "support", "mobility"],
		theme_tags: ["forbidden", "dungeon-core", "dimensional-bleed"],
	},
	{
		id: "item_p7_48",
		name: "Vanguard Breastplate",
		description:
			"Modern tactical armor laced with mana-reactive alloys for enhanced protection.",
		rarity: "rare",
		type: "armor",
		image: "/generated/items/shadow-blade.webp",
		weight: 3,
		value: 230,
		item_type: "armor",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Resistance to minor piercing damage."],
		},
		armor_type: "Medium",
		armor_class: "14 + Dex modifier (max 2)",
		lore: {
			origin:
				"Reverse-engineered from Architect combat data recovered by the Hunter Bureau's R&D division.",
			history:
				"The European Hunter Council maintains a standing bounty for information regarding its original creator.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Crushes the remnants of a dead world. A whisper from the edge of oblivion.",
		discovery_lore:
			"Purchased from a black-market auction in the underground district of Neo-Seoul for an undisclosed sum.",
		tags: ["equipment", "healing", "necrotic", "stealth"],
		theme_tags: ["mana-overflow", "hunter-bureau"],
	},
	{
		id: "item_p7_49",
		name: "Abyssal Longsword",
		description:
			"A weapon forged from gate anomaly materials. Radiates a faint, deadly hum.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/items/health-potion.webp",
		weight: 1,
		value: 148,
		item_type: "weapon",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["+1 to attack rolls against beasts."],
		},
		damage: "1d10",
		damage_type: "kinetic",
		weapon_type: "martial melee",
		lore: {
			origin:
				"Woven from the screams of a Gate Boss that achieved sentience moments before death.",
			history:
				"A-Rank appraiser Guild Master Ryker personally verified its authenticity before it entered general circulation.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Sanctifies the last defense of the unprepared. The reason S-Rank Gates are feared.",
		discovery_lore:
			"Appeared in a Hunter's inventory after a Order notification that no one else could see.",
		tags: ["equipment", "sustained", "mobility", "buff", "debuff"],
		theme_tags: ["gate-zone", "hunter-bureau", "experimental"],
	},
];
