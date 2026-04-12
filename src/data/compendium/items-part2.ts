import type { Item } from "./items";

export const items_part2: Item[] = [
	{
		id: "item_p2_0",
		name: "Black-Market Mana Elixir",
		description:
			"A popular item among hunters venturing into E to C rank gates.",
		rarity: "common",
		type: "consumable",
		image: "/generated/items/shadow-armor.webp",
		weight: 5,
		value: 68,
		item_type: "consumable",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Restores 2d4 + 2 HP or Mana."],
		},
		lore: {
			origin:
				"Leaked through a micro-rift that appeared inside the International Hunter Conference hall.",
			history:
				"Originally developed as a countermeasure against Regent-class entities during the Sovereignty Wars.",
			curse:
				"Prolonged wielders report hearing a second heartbeat that doesn't match their own.",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Corrodes the certainty of outcomes. The last thing many anomalies ever see.",
		discovery_lore:
			"Dropped by a mini-boss that shouldn't have existed according to the Gate's difficulty rating.",
		tags: ["equipment", "stealth", "damage", "single-target", "mobility"],
		theme_tags: ["system-glitch", "survival"],
	},
	{
		id: "item_p2_1",
		name: "Greater Liquid Shadow",
		description:
			"A popular item among hunters venturing into E to C rank gates.",
		rarity: "common",
		type: "consumable",
		image: "/generated/items/shadow-blade.webp",
		weight: 4,
		value: 211,
		item_type: "consumable",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Restores 2d4 + 2 HP or Mana."],
		},
		lore: {
			origin:
				"Recovered from the personal vault of a National-Level Hunter who vanished during the First Calamity.",
			history:
				"Combat logs from the Busan Incident show this was used to hold a Gate breach for forty-seven minutes.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Sanctifies the architecture of the soul. The final equation in a war without end.",
		discovery_lore:
			"Found in a hidden compartment of a relic weapon that had been in Guild storage for years.",
		tags: ["equipment", "ice", "fire"],
		theme_tags: ["survival", "system-glitch", "mana-overflow"],
	},
	{
		id: "item_p2_2",
		name: "Void Warhammer",
		description:
			"A weapon forged from gate anomaly materials. Radiates a faint, deadly hum.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/items/shadow-ring.webp",
		weight: 3,
		value: 124,
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
				"Formed naturally in a mana vein so dense that reality itself began to crystallize around it.",
			history:
				"The first recorded use caused a localized reality fracture that took a specialized team forty hours to repair.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Eclipses the certainty of outcomes. The breaking point of all resistance.",
		discovery_lore:
			"Found in a hidden compartment of a relic weapon that had been in Guild storage for years.",
		tags: ["equipment", "fire", "control"],
		theme_tags: ["system-glitch", "shadow-domain", "modern-warfare"],
	},
	{
		id: "item_p2_3",
		name: "Crimson Revolver",
		description:
			"A weapon forged from gate anomaly materials. Radiates a faint, deadly hum.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/items/shadow-ring.webp",
		weight: 7,
		value: 155,
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
				"Pulled from the dreams of a comatose S-Rank Hunter by a team of psychic-type Awakened.",
			history:
				"Originally developed as a countermeasure against Regent-class entities during the Sovereignty Wars.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Silences the illusion of safety. The reason S-Rank Gates are feared.",
		discovery_lore:
			"Sold by a mysterious merchant who appears only during full moons near active Gate sites.",
		tags: ["equipment", "burst", "sustained", "utility"],
		theme_tags: ["guild-ops", "black-market", "post-awakening"],
	},
	{
		id: "item_p2_4",
		name: "Gate-Forged Spaulders",
		description:
			"Modern tactical armor laced with mana-reactive alloys for enhanced protection.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/items/shadow-blade.webp",
		weight: 3,
		value: 345,
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
				"The Japanese Hunter Association attempted to classify this as a national treasure to prevent export.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Rends the flow of causality. The final equation in a war without end.",
		discovery_lore:
			"Sold by a mysterious merchant who appears only during full moons near active Gate sites.",
		tags: ["equipment", "damage", "offensive", "perception", "ice"],
		theme_tags: ["urban-combat", "forbidden"],
	},
	{
		id: "item_p2_5",
		name: "Void Gauntlets",
		description:
			"A weapon forged from gate anomaly materials. Radiates a faint, deadly hum.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/items/health-potion.webp",
		weight: 2,
		value: 459,
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
				"Synthesized in the clandestine laboratories beneath the Chinese Hunter Bureau headquarters.",
			history:
				"Historical analysis suggests this predates the modern Gate Order by several centuries.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Ignites the chains of mortality. Evolution compressed into a single, violent instant.",
		discovery_lore:
			"Emerged from a Gate Boss's dissolution cloud, hovering where the creature's heart had been.",
		tags: ["equipment", "area", "debuff", "perception"],
		theme_tags: ["guild-ops", "mana-overflow"],
	},
	{
		id: "item_p2_6",
		name: "Lesser Aetheric Antidote",
		description:
			"A popular item among hunters venturing into E to C rank gates.",
		rarity: "common",
		type: "consumable",
		image: "/generated/items/shadow-ring.webp",
		weight: 1,
		value: 370,
		item_type: "consumable",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Restores 2d4 + 2 HP or Mana."],
		},
		lore: {
			origin:
				"Stolen from a Guild vault during the Three-Day War between rival Korean Hunter factions.",
			history:
				"Records indicate this was used by the original Clearing Party that neutralized the first S-Rank Gate on Korean soil.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Condemns the boundary between life and death. The death of hesitation, made manifest.",
		discovery_lore:
			"Dropped by a mini-boss that shouldn't have existed according to the Gate's difficulty rating.",
		tags: ["equipment", "stealth", "psychic", "sustained", "control"],
		theme_tags: ["survival", "gate-zone"],
	},
	{
		id: "item_p2_7",
		name: "Phantom Combat Vest",
		description:
			"Modern tactical armor laced with mana-reactive alloys for enhanced protection.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/items/shadow-blade.webp",
		weight: 7,
		value: 169,
		item_type: "armor",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Resistance to minor piercing damage."],
		},
		armor_type: "Medium",
		armor_class: "14 + Dex modifier (max 2)",
		lore: {
			origin:
				"Decoded from ancient sigil-stones found beneath the ruins of a pre-Awakening temple in Kyoto.",
			history:
				"Combat logs from the Busan Incident show this was used to hold a Gate breach for forty-seven minutes.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Devours the flow of causality. The last thing many anomalies ever see.",
		discovery_lore:
			"Found pulsing with residual mana in the aftermath of a Gate break, half-buried in shattered concrete.",
		tags: ["equipment", "stealth", "void", "single-target"],
		theme_tags: ["dimensional-bleed", "guild-ops"],
	},
	{
		id: "item_p2_8",
		name: "High-Grade Mana Elixir",
		description:
			"A popular item among hunters venturing into E to C rank gates.",
		rarity: "common",
		type: "consumable",
		image: "/generated/items/shadow-ring.webp",
		weight: 7,
		value: 346,
		item_type: "consumable",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Restores 2d4 + 2 HP or Mana."],
		},
		lore: {
			origin:
				"Formed naturally in a mana vein so dense that reality itself began to crystallize around it.",
			history:
				"Combat logs from the Busan Incident show this was used to hold a Gate breach for forty-seven minutes.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Reclaims the boundary between life and death. A reminder that the Order has no mercy.",
		discovery_lore:
			"Gifted by the Order itself as a reward for completing a hidden quest chain.",
		tags: ["equipment", "damage", "utility"],
		theme_tags: ["survival", "regent-era", "gate-zone"],
	},
	{
		id: "item_p2_9",
		name: "Unstable Aetheric Antidote",
		description:
			"A popular item among hunters venturing into E to C rank gates.",
		rarity: "common",
		type: "consumable",
		image: "/generated/items/health-potion.webp",
		weight: 8,
		value: 325,
		item_type: "consumable",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Restores 2d4 + 2 HP or Mana."],
		},
		lore: {
			origin:
				"Woven from the screams of a Gate Boss that achieved sentience moments before death.",
			history:
				"Intelligence reports link this to the Shadow Regent's army, though the connection remains unconfirmed.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Corrodes the chains of mortality. A beautiful catastrophe measured in milliseconds.",
		discovery_lore:
			"Gifted by the Order itself as a reward for completing a hidden quest chain.",
		tags: ["equipment", "area", "control", "fire"],
		theme_tags: ["system-glitch", "survival"],
	},
	{
		id: "item_p2_10",
		name: "Purified Mana Elixir",
		description:
			"A popular item among hunters venturing into E to C rank gates.",
		rarity: "common",
		type: "consumable",
		image: "/generated/items/health-potion.webp",
		weight: 3,
		value: 367,
		item_type: "consumable",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Restores 2d4 + 2 HP or Mana."],
		},
		lore: {
			origin:
				"Excavated from a pocket dimension that existed for exactly one hour before collapsing.",
			history:
				"The Hunter Bureau classified this as a Level-4 threat vector before it was repurposed for field operations.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Purges the threshold of human potential. The death of hesitation, made manifest.",
		discovery_lore:
			"Purchased from a black-market auction in the underground district of Neo-Seoul for an undisclosed sum.",
		tags: ["equipment", "area", "damage", "shadow", "burst"],
		theme_tags: ["classified", "system-glitch", "survival"],
	},
	{
		id: "item_p2_11",
		name: "Guild-Issue Whip",
		description:
			"A weapon forged from gate anomaly materials. Radiates a faint, deadly hum.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/items/shadow-blade.webp",
		weight: 8,
		value: 459,
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
				"Salvaged from the corpse of an S-Rank anomaly that breached containment in the European Dead Zone.",
			history:
				"The Hunter Bureau classified this as a Level-4 threat vector before it was repurposed for field operations.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Shatters the flow of causality. The breaking point of all resistance.",
		discovery_lore:
			"Appeared in a Hunter's inventory after a Order notification that no one else could see.",
		tags: ["equipment", "lightning", "necrotic", "damage", "perception"],
		theme_tags: ["shadow-domain", "urban-combat", "survival"],
	},
	{
		id: "item_p2_12",
		name: "Void Longsword",
		description:
			"A weapon forged from gate anomaly materials. Radiates a faint, deadly hum.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/items/shadow-armor.webp",
		weight: 8,
		value: 336,
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
				"Historical analysis suggests this predates the modern Gate Order by several centuries.",
			curse:
				"Prolonged use causes the wielder's shadow to move independently, whispering in dead languages.",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Absorbs the dimensional barrier. The final equation in a war without end.",
		discovery_lore:
			"Traded by a nomadic Awakened who claimed to have no memory of acquiring it.",
		tags: ["equipment", "burst", "single-target", "healing", "perception"],
		theme_tags: ["guild-ops", "classified", "hunter-bureau"],
	},
	{
		id: "item_p2_13",
		name: "Aetheric Spear",
		description:
			"A weapon forged from gate anomaly materials. Radiates a faint, deadly hum.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/items/shadow-ring.webp",
		weight: 2,
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
				"Discovered embedded in the spine of a petrified World Tree fragment found in Scandinavia.",
			history:
				"This technique was banned by the International Guild Association for eighteen months before being reclassified.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Mirrors the last defense of the unprepared. Evolution compressed into a single, violent instant.",
		discovery_lore:
			"Found washed ashore near a coastal Gate, wrapped in fabric that dissolved upon touch.",
		tags: ["equipment", "fire", "utility", "healing"],
		theme_tags: ["dimensional-bleed", "shadow-domain"],
	},
	{
		id: "item_p2_14",
		name: "Aether-Plated Combat Vest",
		description:
			"Modern tactical armor laced with mana-reactive alloys for enhanced protection.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/items/shadow-ring.webp",
		weight: 8,
		value: 64,
		item_type: "armor",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Resistance to minor piercing damage."],
		},
		armor_type: "Medium",
		armor_class: "14 + Dex modifier (max 2)",
		lore: {
			origin:
				"Stolen from a Guild vault during the Three-Day War between rival Korean Hunter factions.",
			history:
				"Intelligence reports link this to the Shadow Regent's army, though the connection remains unconfirmed.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Rends the flow of causality. The last thing many anomalies ever see.",
		discovery_lore:
			"Found in a hidden compartment of a relic weapon that had been in Guild storage for years.",
		tags: ["equipment", "area", "necrotic", "shadow", "buff"],
		theme_tags: ["dungeon-core", "mana-overflow", "elite-tier"],
	},
	{
		id: "item_p2_15",
		name: "Aegis Exo-Suit",
		description:
			"Modern tactical armor laced with mana-reactive alloys for enhanced protection.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/items/health-potion.webp",
		weight: 4,
		value: 452,
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
				"Combat logs from the Busan Incident show this was used to hold a Gate breach for forty-seven minutes.",
			curse:
				"Leaves a faint mark on the soul visible to Monarchs and entities of comparable power.",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Reclaims the silence between heartbeats. The reason S-Rank Gates are feared.",
		discovery_lore:
			"Recovered from a time-locked chest that required three different elemental keys to open.",
		tags: ["equipment", "perception", "mobility"],
		theme_tags: ["rift-energy", "mana-overflow"],
	},
	{
		id: "item_p2_16",
		name: "Mana-Infused Katana",
		description:
			"A weapon forged from gate anomaly materials. Radiates a faint, deadly hum.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/items/shadow-armor.webp",
		weight: 2,
		value: 389,
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
				"This technique was banned by the International Guild Association for eighteen months before being reclassified.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Shatters the concept of distance. The line between Hunter and monster.",
		discovery_lore:
			"Gifted by the Order itself as a reward for completing a hidden quest chain.",
		tags: ["equipment", "radiant", "psychic", "burst"],
		theme_tags: ["post-awakening", "classified"],
	},
	{
		id: "item_p2_17",
		name: "Nano-Weave Exo-Suit",
		description:
			"Modern tactical armor laced with mana-reactive alloys for enhanced protection.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/items/shadow-ring.webp",
		weight: 1,
		value: 448,
		item_type: "armor",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Resistance to minor piercing damage."],
		},
		armor_type: "Medium",
		armor_class: "14 + Dex modifier (max 2)",
		lore: {
			origin:
				"Reconstructed from fragments scattered across seven different C-Rank dungeons.",
			history:
				"Archaeological evidence suggests ancient civilizations may have accessed similar power through ritual sacrifice.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Annihilates the laws of physics. A reminder that the Order has no mercy.",
		discovery_lore:
			"Purchased from a black-market auction in the underground district of Neo-Seoul for an undisclosed sum.",
		tags: ["equipment", "void", "necrotic", "area"],
		theme_tags: ["classified", "guild-ops", "regent-era"],
	},
	{
		id: "item_p2_18",
		name: "Vanguard Shin Guards",
		description:
			"Modern tactical armor laced with mana-reactive alloys for enhanced protection.",
		rarity: "rare",
		type: "armor",
		image: "/generated/items/health-potion.webp",
		weight: 5,
		value: 368,
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
				"Guild archives show at least three S-Rank Hunters have died attempting to master its full potential.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Purges the last defense of the unprepared. The final equation in a war without end.",
		discovery_lore:
			"Found in a hidden compartment of a relic weapon that had been in Guild storage for years.",
		tags: ["equipment", "defensive", "buff"],
		theme_tags: ["mana-overflow", "elite-tier"],
	},
	{
		id: "item_p2_19",
		name: "High-Grade Health Potion",
		description:
			"A popular item among hunters venturing into E to C rank gates.",
		rarity: "common",
		type: "consumable",
		image: "/generated/items/shadow-blade.webp",
		weight: 6,
		value: 61,
		item_type: "consumable",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Restores 2d4 + 2 HP or Mana."],
		},
		lore: {
			origin:
				"Extracted from the dimensional residue of a collapsed B-Rank Gate in downtown Seoul.",
			history:
				"Multiple Guilds have attempted to replicate this; all reproductions have proven inferior to the original.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Warps the boundary between life and death. The reason S-Rank Gates are feared.",
		discovery_lore:
			"Found in a hidden compartment of a relic weapon that had been in Guild storage for years.",
		tags: ["equipment", "support", "utility", "control", "single-target"],
		theme_tags: ["post-awakening", "modern-warfare"],
	},
	{
		id: "item_p2_20",
		name: "Greater Mana Elixir",
		description:
			"A popular item among hunters venturing into E to C rank gates.",
		rarity: "common",
		type: "consumable",
		image: "/generated/items/shadow-armor.webp",
		weight: 7,
		value: 410,
		item_type: "consumable",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Restores 2d4 + 2 HP or Mana."],
		},
		lore: {
			origin:
				"Salvaged from the corpse of an S-Rank anomaly that breached containment in the European Dead Zone.",
			history:
				"Combat logs from the Busan Incident show this was used to hold a Gate breach for forty-seven minutes.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Ignites the boundary between life and death. The death of hesitation, made manifest.",
		discovery_lore:
			"Appeared in a Hunter's inventory after a Order notification that no one else could see.",
		tags: ["equipment", "void", "fire"],
		theme_tags: ["modern-warfare", "hunter-bureau", "classified"],
	},
	{
		id: "item_p2_21",
		name: "Abyssal Katana",
		description:
			"A weapon forged from gate anomaly materials. Radiates a faint, deadly hum.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/items/shadow-armor.webp",
		weight: 7,
		value: 432,
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
				"Salvaged from the corpse of an S-Rank anomaly that breached containment in the European Dead Zone.",
			history:
				"This was the subject of a bidding war between three S-Rank Guilds that nearly escalated to armed conflict.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Purges the last defense of the unprepared. The final equation in a war without end.",
		discovery_lore:
			"Gifted by the Order itself as a reward for completing a hidden quest chain.",
		tags: ["equipment", "shadow", "sustained", "ice"],
		theme_tags: ["regent-era", "elite-tier", "modern-warfare"],
	},
	{
		id: "item_p2_22",
		name: "Aetheric Warhammer",
		description:
			"A weapon forged from gate anomaly materials. Radiates a faint, deadly hum.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/items/shadow-ring.webp",
		weight: 4,
		value: 417,
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
				"Emerged from the Hunter Association's classified Project: Lattice Break experiments.",
			history:
				"This was one of twelve artifacts recovered from the infamous Kamish Raid that changed modern Hunter warfare.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Dissolves the threshold of human potential. Proof that some things cannot be survived.",
		discovery_lore:
			"Emerged from a Gate Boss's dissolution cloud, hovering where the creature's heart had been.",
		tags: ["equipment", "area", "defensive", "healing", "psychic"],
		theme_tags: ["hunter-bureau", "classified"],
	},
	{
		id: "item_p2_23",
		name: "Abyssal Whip",
		description:
			"A weapon forged from gate anomaly materials. Radiates a faint, deadly hum.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/items/health-potion.webp",
		weight: 6,
		value: 448,
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
				"Synthesized in the clandestine laboratories beneath the Chinese Hunter Bureau headquarters.",
			history:
				"Archaeological evidence suggests ancient civilizations may have accessed similar power through ritual sacrifice.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Unravels the chains of mortality. The death of hesitation, made manifest.",
		discovery_lore:
			"Traded by a nomadic Awakened who claimed to have no memory of acquiring it.",
		tags: ["equipment", "single-target", "necrotic"],
		theme_tags: ["modern-warfare", "experimental", "regent-era"],
	},
	{
		id: "item_p2_24",
		name: "Obsidian Longsword",
		description:
			"A weapon forged from gate anomaly materials. Radiates a faint, deadly hum.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/items/health-potion.webp",
		weight: 1,
		value: 354,
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
				"Confiscated from a black-market dealer operating in the shadow districts of Manila.",
			history:
				"Originally developed as a countermeasure against Regent-class entities during the Sovereignty Wars.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Devours the flow of causality. A beautiful catastrophe measured in milliseconds.",
		discovery_lore:
			"Recovered from a time-locked chest that required three different elemental keys to open.",
		tags: ["equipment", "single-target", "mobility"],
		theme_tags: ["ancient-power", "guild-ops"],
	},
	{
		id: "item_p2_25",
		name: "Crimson Warhammer",
		description:
			"A weapon forged from gate anomaly materials. Radiates a faint, deadly hum.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/items/shadow-ring.webp",
		weight: 8,
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
				"Stolen from a Guild vault during the Three-Day War between rival Korean Hunter factions.",
			history:
				"Records indicate this was used by the original Clearing Party that neutralized the first S-Rank Gate on Korean soil.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Crushes the dimensional barrier. Proof that some things cannot be survived.",
		discovery_lore:
			"Found washed ashore near a coastal Gate, wrapped in fabric that dissolved upon touch.",
		tags: ["equipment", "perception", "mobility"],
		theme_tags: ["elite-tier", "survival", "system-glitch"],
	},
	{
		id: "item_p2_26",
		name: "Dragon-Scale Exo-Suit",
		description:
			"Modern tactical armor laced with mana-reactive alloys for enhanced protection.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/items/health-potion.webp",
		weight: 3,
		value: 112,
		item_type: "armor",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Resistance to minor piercing damage."],
		},
		armor_type: "Medium",
		armor_class: "14 + Dex modifier (max 2)",
		lore: {
			origin:
				"Leaked through a micro-rift that appeared inside the International Hunter Conference hall.",
			history:
				"This technique was banned by the International Guild Association for eighteen months before being reclassified.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Erases the dimensional barrier. The line between Hunter and monster.",
		discovery_lore:
			"Gifted by the Order itself as a reward for completing a hidden quest chain.",
		tags: ["equipment", "buff", "control", "shadow"],
		theme_tags: ["urban-combat", "forbidden"],
	},
	{
		id: "item_p2_27",
		name: "Hunter's Warhammer",
		description:
			"A weapon forged from gate anomaly materials. Radiates a faint, deadly hum.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/items/health-potion.webp",
		weight: 7,
		value: 280,
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
				"A-Rank appraiser Guild Master Ryker personally verified its authenticity before it entered general circulation.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Commands the illusion of safety. The death of hesitation, made manifest.",
		discovery_lore:
			"Discovered by an E-Rank Hunter who stumbled into an unmarked side passage during a routine dungeon clear.",
		tags: ["equipment", "radiant", "lightning"],
		theme_tags: ["hunter-bureau", "urban-combat", "modern-warfare"],
	},
	{
		id: "item_p2_28",
		name: "Gate-Forged Tactical Helmet",
		description:
			"Modern tactical armor laced with mana-reactive alloys for enhanced protection.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/items/shadow-blade.webp",
		weight: 7,
		value: 197,
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
				"Archaeological evidence suggests ancient civilizations may have accessed similar power through ritual sacrifice.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Inverts the threshold of human potential. A reminder that the Order has no mercy.",
		discovery_lore:
			"Materialized on a Hunter's workbench overnight, leaving scorch marks in the shape of unknown glyphs.",
		tags: ["equipment", "psychic", "ice"],
		theme_tags: ["modern-warfare", "dungeon-core", "regent-era"],
	},
	{
		id: "item_p2_29",
		name: "Aetheric Whip",
		description:
			"A weapon forged from gate anomaly materials. Radiates a faint, deadly hum.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/items/health-potion.webp",
		weight: 5,
		value: 127,
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
				"Crystallized from raw mana overflow during the catastrophic Seoul Gate Breach of Year 7.",
			history:
				"The American Hunter Bureau's Project: Starfall attempted to weaponize this before the program was defunded.",
			curse:
				"The user becomes unable to dream, replaced by visions of the void between Gates.",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Corrodes the illusion of safety. Evolution compressed into a single, violent instant.",
		discovery_lore:
			"Gifted by the Order itself as a reward for completing a hidden quest chain.",
		tags: ["equipment", "sustained", "fire"],
		theme_tags: ["experimental", "hunter-bureau", "post-awakening"],
	},
	{
		id: "item_p2_30",
		name: "Aetheric Gauntlets",
		description:
			"A weapon forged from gate anomaly materials. Radiates a faint, deadly hum.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/items/shadow-armor.webp",
		weight: 8,
		value: 437,
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
				"Born from a Order glitch that briefly merged two overlapping Gate instances.",
			history:
				"The first recorded use caused a localized reality fracture that took a specialized team forty hours to repair.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Devours the boundary between life and death. A beautiful catastrophe measured in milliseconds.",
		discovery_lore:
			"Found in a hidden compartment of a relic weapon that had been in Guild storage for years.",
		tags: ["equipment", "defensive", "sustained", "buff"],
		theme_tags: ["experimental", "elite-tier"],
	},
	{
		id: "item_p2_31",
		name: "Unstable Liquid Shadow",
		description:
			"A popular item among hunters venturing into E to C rank gates.",
		rarity: "common",
		type: "consumable",
		image: "/generated/items/shadow-armor.webp",
		weight: 8,
		value: 298,
		item_type: "consumable",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Restores 2d4 + 2 HP or Mana."],
		},
		lore: {
			origin:
				"Salvaged from the corpse of an S-Rank anomaly that breached containment in the European Dead Zone.",
			history:
				"Combat logs from the Busan Incident show this was used to hold a Gate breach for forty-seven minutes.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Commands the remnants of a dead world. A reminder that the Order has no mercy.",
		discovery_lore:
			"Sold by a mysterious merchant who appears only during full moons near active Gate sites.",
		tags: ["equipment", "void", "ice", "single-target", "psychic"],
		theme_tags: ["hunter-bureau", "dimensional-bleed"],
	},
	{
		id: "item_p2_32",
		name: "Guild-Standard Aetheric Antidote",
		description:
			"A popular item among hunters venturing into E to C rank gates.",
		rarity: "common",
		type: "consumable",
		image: "/generated/items/shadow-armor.webp",
		weight: 8,
		value: 172,
		item_type: "consumable",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Restores 2d4 + 2 HP or Mana."],
		},
		lore: {
			origin:
				"Unearthed by a mining Guild operating in the mana-saturated quarries of the Australian Outback.",
			history:
				"This technique was banned by the International Guild Association for eighteen months before being reclassified.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Corrodes the last defense of the unprepared. The reason S-Rank Gates are feared.",
		discovery_lore:
			"Located by a detection-type Hunter whose radar ability triggered on an otherwise empty room.",
		tags: ["equipment", "damage", "control"],
		theme_tags: ["hunter-bureau", "modern-warfare"],
	},
	{
		id: "item_p2_33",
		name: "Purified Beast Repellent",
		description:
			"A popular item among hunters venturing into E to C rank gates.",
		rarity: "common",
		type: "consumable",
		image: "/generated/items/shadow-blade.webp",
		weight: 2,
		value: 186,
		item_type: "consumable",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Restores 2d4 + 2 HP or Mana."],
		},
		lore: {
			origin:
				"Crystallized from raw mana overflow during the catastrophic Seoul Gate Breach of Year 7.",
			history:
				"The American Hunter Bureau's Project: Starfall attempted to weaponize this before the program was defunded.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor: "Binds the laws of physics. A whisper from the edge of oblivion.",
		discovery_lore:
			"Discovered by an E-Rank Hunter who stumbled into an unmarked side passage during a routine dungeon clear.",
		tags: ["equipment", "necrotic", "control", "shadow"],
		theme_tags: ["experimental", "shadow-domain", "guild-ops"],
	},
	{
		id: "item_p2_34",
		name: "Black-Market Beast Repellent",
		description:
			"A popular item among hunters venturing into E to C rank gates.",
		rarity: "common",
		type: "consumable",
		image: "/generated/items/shadow-armor.webp",
		weight: 1,
		value: 413,
		item_type: "consumable",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Restores 2d4 + 2 HP or Mana."],
		},
		lore: {
			origin:
				"Salvaged from the corpse of an S-Rank anomaly that breached containment in the European Dead Zone.",
			history:
				"Field reports indicate prolonged exposure causes minor spatial distortions in a three-meter radius.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Purges the architect's design. The final equation in a war without end.",
		discovery_lore:
			"Recovered from a time-locked chest that required three different elemental keys to open.",
		tags: ["equipment", "utility", "healing"],
		theme_tags: ["urban-combat", "hunter-bureau"],
	},
	{
		id: "item_p2_35",
		name: "Unstable Health Potion",
		description:
			"A popular item among hunters venturing into E to C rank gates.",
		rarity: "common",
		type: "consumable",
		image: "/generated/items/shadow-blade.webp",
		weight: 7,
		value: 100,
		item_type: "consumable",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Restores 2d4 + 2 HP or Mana."],
		},
		lore: {
			origin:
				"Manifested spontaneously during a double-dungeon event in the American Midwest.",
			history:
				"Intelligence reports link this to the Shadow Regent's army, though the connection remains unconfirmed.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Commands the silence between heartbeats. A whisper from the edge of oblivion.",
		discovery_lore:
			"Gifted by the Order itself as a reward for completing a hidden quest chain.",
		tags: ["equipment", "control", "utility"],
		theme_tags: ["elite-tier", "rift-energy"],
	},
	{
		id: "item_p2_36",
		name: "Guild-Issue Warhammer",
		description:
			"A weapon forged from gate anomaly materials. Radiates a faint, deadly hum.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/items/shadow-ring.webp",
		weight: 6,
		value: 40,
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
				"Gifted by a dying Regent as payment for a debt that predates human civilization.",
			history:
				"The American Hunter Bureau's Project: Starfall attempted to weaponize this before the program was defunded.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Warps the boundary between life and death. The death of hesitation, made manifest.",
		discovery_lore:
			"Emerged from a Gate Boss's dissolution cloud, hovering where the creature's heart had been.",
		tags: ["equipment", "radiant", "lightning"],
		theme_tags: ["mana-overflow", "forbidden"],
	},
	{
		id: "item_p2_37",
		name: "Hunter's Warhammer",
		description:
			"A weapon forged from gate anomaly materials. Radiates a faint, deadly hum.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/items/shadow-blade.webp",
		weight: 8,
		value: 248,
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
				"Decoded from ancient sigil-stones found beneath the ruins of a pre-Awakening temple in Kyoto.",
			history:
				"A-Rank appraiser Guild Master Ryker personally verified its authenticity before it entered general circulation.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Annihilates the threshold of human potential. A whisper from the edge of oblivion.",
		discovery_lore:
			"Traded by a nomadic Awakened who claimed to have no memory of acquiring it.",
		tags: ["equipment", "shadow", "necrotic", "buff", "perception"],
		theme_tags: ["black-market", "gate-zone", "classified"],
	},
	{
		id: "item_p2_38",
		name: "Starlight Sniper Rifle",
		description:
			"A weapon forged from gate anomaly materials. Radiates a faint, deadly hum.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/items/shadow-blade.webp",
		weight: 5,
		value: 310,
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
				"Originally developed as a countermeasure against Regent-class entities during the Sovereignty Wars.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Eclipses the silence between heartbeats. The line between Hunter and monster.",
		discovery_lore:
			"Sold by a mysterious merchant who appears only during full moons near active Gate sites.",
		tags: ["equipment", "necrotic", "stealth"],
		theme_tags: ["classified", "dungeon-core", "survival"],
	},
	{
		id: "item_p2_39",
		name: "Guild-Issue Halberd",
		description:
			"A weapon forged from gate anomaly materials. Radiates a faint, deadly hum.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/items/shadow-ring.webp",
		weight: 7,
		value: 505,
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
				"Field reports indicate prolonged exposure causes minor spatial distortions in a three-meter radius.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Eclipses the fabric of reality. A whisper from the edge of oblivion.",
		discovery_lore:
			"Recovered from a time-locked chest that required three different elemental keys to open.",
		tags: ["equipment", "utility", "sustained"],
		theme_tags: ["experimental", "elite-tier"],
	},
	{
		id: "item_p2_40",
		name: "Hunter's Spear",
		description:
			"A weapon forged from gate anomaly materials. Radiates a faint, deadly hum.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/items/shadow-armor.webp",
		weight: 5,
		value: 238,
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
				"Distilled from the ambient mana of a Red Gate that refused to close for seventeen days.",
			history:
				"The Japanese Hunter Association attempted to classify this as a national treasure to prevent export.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Binds the remnants of a dead world. The breaking point of all resistance.",
		discovery_lore:
			"Found pulsing with residual mana in the aftermath of a Gate break, half-buried in shattered concrete.",
		tags: ["equipment", "stealth", "control", "necrotic", "support"],
		theme_tags: ["dungeon-core", "gate-zone", "classified"],
	},
	{
		id: "item_p2_41",
		name: "Hunter's Warhammer",
		description:
			"A weapon forged from gate anomaly materials. Radiates a faint, deadly hum.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/items/shadow-blade.webp",
		weight: 4,
		value: 380,
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
				"Confiscated from a black-market dealer operating in the shadow districts of Manila.",
			history:
				"Guild archives show at least three S-Rank Hunters have died attempting to master its full potential.",
			curse:
				"The user's reflection in still water shows them as they will look at the moment of their death.",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor: "Inverts the laws of physics. A whisper from the edge of oblivion.",
		discovery_lore:
			"Sold by a mysterious merchant who appears only during full moons near active Gate sites.",
		tags: ["equipment", "lightning", "mobility", "psychic"],
		theme_tags: ["system-glitch", "survival"],
	},
	{
		id: "item_p2_42",
		name: "Crimson Sniper Rifle",
		description:
			"A weapon forged from gate anomaly materials. Radiates a faint, deadly hum.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/items/shadow-blade.webp",
		weight: 1,
		value: 34,
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
				"Salvaged from the corpse of an S-Rank anomaly that breached containment in the European Dead Zone.",
			history:
				"Field reports indicate prolonged exposure causes minor spatial distortions in a three-meter radius.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Purges the certainty of outcomes. The line between Hunter and monster.",
		discovery_lore:
			"Excavated from the crystallized mana deposit at the center of a depleted Gate core.",
		tags: ["equipment", "shadow", "necrotic", "lightning"],
		theme_tags: ["system-glitch", "guild-ops", "post-awakening"],
	},
	{
		id: "item_p2_43",
		name: "Unstable Beast Repellent",
		description:
			"A popular item among hunters venturing into E to C rank gates.",
		rarity: "common",
		type: "consumable",
		image: "/generated/items/shadow-ring.webp",
		weight: 6,
		value: 468,
		item_type: "consumable",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Restores 2d4 + 2 HP or Mana."],
		},
		lore: {
			origin:
				"Excavated from a pocket dimension that existed for exactly one hour before collapsing.",
			history:
				"This was the subject of a bidding war between three S-Rank Guilds that nearly escalated to armed conflict.",
			curse:
				"The user's reflection in still water shows them as they will look at the moment of their death.",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Eclipses the laws of physics. A whisper from the edge of oblivion.",
		discovery_lore:
			"Traded by a nomadic Awakened who claimed to have no memory of acquiring it.",
		tags: ["equipment", "support", "ice", "mobility"],
		theme_tags: ["dimensional-bleed", "modern-warfare", "rift-energy"],
	},
	{
		id: "item_p2_44",
		name: "High-Grade Aetheric Antidote",
		description:
			"A popular item among hunters venturing into E to C rank gates.",
		rarity: "common",
		type: "consumable",
		image: "/generated/items/health-potion.webp",
		weight: 6,
		value: 117,
		item_type: "consumable",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Restores 2d4 + 2 HP or Mana."],
		},
		lore: {
			origin:
				"Synthesized in the clandestine laboratories beneath the Chinese Hunter Bureau headquarters.",
			history:
				"Guild archives show at least three S-Rank Hunters have died attempting to master its full potential.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Sanctifies the illusion of safety. The breaking point of all resistance.",
		discovery_lore:
			"Located by a detection-type Hunter whose radar ability triggered on an otherwise empty room.",
		tags: ["equipment", "stealth", "ice", "psychic", "shadow"],
		theme_tags: ["hunter-bureau", "dungeon-core"],
	},
	{
		id: "item_p2_45",
		name: "Mana-Infused Halberd",
		description:
			"A weapon forged from gate anomaly materials. Radiates a faint, deadly hum.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/items/shadow-armor.webp",
		weight: 1,
		value: 84,
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
				"Distilled from the ambient mana of a Red Gate that refused to close for seventeen days.",
			history:
				"The Japanese Hunter Association attempted to classify this as a national treasure to prevent export.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Ignites the illusion of safety. A testament to what Hunters have become.",
		discovery_lore:
			"Recovered from a time-locked chest that required three different elemental keys to open.",
		tags: ["equipment", "lightning", "burst", "psychic"],
		theme_tags: ["regent-era", "rift-energy"],
	},
	{
		id: "item_p2_46",
		name: "Aetheric Katana",
		description:
			"A weapon forged from gate anomaly materials. Radiates a faint, deadly hum.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/items/shadow-blade.webp",
		weight: 4,
		value: 173,
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
				"Decoded from ancient sigil-stones found beneath the ruins of a pre-Awakening temple in Kyoto.",
			history:
				"This technique was banned by the International Guild Association for eighteen months before being reclassified.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Warps the architecture of the soul. A reminder that the Order has no mercy.",
		discovery_lore:
			"Appeared in a Hunter's inventory after a Order notification that no one else could see.",
		tags: ["equipment", "area", "support"],
		theme_tags: ["dimensional-bleed", "guild-ops"],
	},
	{
		id: "item_p2_47",
		name: "Abyssal Dagger",
		description:
			"A weapon forged from gate anomaly materials. Radiates a faint, deadly hum.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/items/shadow-ring.webp",
		weight: 1,
		value: 444,
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
				"Stolen from a Guild vault during the Three-Day War between rival Korean Hunter factions.",
			history:
				"The Japanese Hunter Association attempted to classify this as a national treasure to prevent export.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Overrides the last defense of the unprepared. The line between Hunter and monster.",
		discovery_lore:
			"Gifted by the Order itself as a reward for completing a hidden quest chain.",
		tags: ["equipment", "ice", "necrotic", "area", "sustained"],
		theme_tags: ["dungeon-core", "system-glitch"],
	},
	{
		id: "item_p2_48",
		name: "Guild-Standard Beast Repellent",
		description:
			"A popular item among hunters venturing into E to C rank gates.",
		rarity: "common",
		type: "consumable",
		image: "/generated/items/shadow-blade.webp",
		weight: 7,
		value: 242,
		item_type: "consumable",
		source: "Rift Ascendant Canon",
		effects: {
			passive: ["Restores 2d4 + 2 HP or Mana."],
		},
		lore: {
			origin:
				"Recovered from the personal vault of a National-Level Hunter who vanished during the First Calamity.",
			history:
				"The Hunter Bureau classified this as a Level-4 threat vector before it was repurposed for field operations.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Binds the illusion of safety. A reminder that the Order has no mercy.",
		discovery_lore:
			"Dropped by a mini-boss that shouldn't have existed according to the Gate's difficulty rating.",
		tags: ["equipment", "single-target", "buff", "radiant", "perception"],
		theme_tags: ["mana-overflow", "elite-tier", "modern-warfare"],
	},
	{
		id: "item_p2_49",
		name: "Abyssal Dagger",
		description:
			"A weapon forged from gate anomaly materials. Radiates a faint, deadly hum.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/items/shadow-blade.webp",
		weight: 3,
		value: 385,
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
				"Manifested spontaneously during a double-dungeon event in the American Midwest.",
			history:
				"A-Rank appraiser Guild Master Ryker personally verified its authenticity before it entered general circulation.",
			curse: "",
			personality: "Silent, waiting.",
			current_owner: "Held by the Vanguard Guild.",
			prior_owners: ["A rogue Awakened"],
		},
		flavor:
			"Shatters the chains of mortality. The reason S-Rank Gates are feared.",
		discovery_lore:
			"Found pulsing with residual mana in the aftermath of a Gate break, half-buried in shattered concrete.",
		tags: ["equipment", "fire", "single-target"],
		theme_tags: ["dimensional-bleed", "ancient-power"],
	},
];
