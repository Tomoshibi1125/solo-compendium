import type { CompendiumSigil as SigilCompendiumEntry } from "@/types/compendium";

export const sigils: SigilCompendiumEntry[] = [
	{
		id: "sigil-sharpness-1",
		name: "Sigil of Sharpness",
		description:
			"A micro-etched rune that hones the edge of a blade using high-frequency mana vibrations.",
		rarity: "common",
		can_inscribe_on: ["weapon"],
		passive_bonuses: {
			attack_bonus: 1,
			damage_bonus: 1,
		},
		effect_description:
			"Grants +1 to attack and damage rolls with this weapon.",
		tags: ["sigil", "weapon", "offensive"],
		source_book: "Ascendant Bureau Armory",
		lore: "Unearthed by a mining Guild operating in the mana-saturated quarries of the Australian Outback.",
		flavor:
			"Devours the concept of distance. The final equation in a war without end.",
		discovery_lore:
			"Located by a detection-type Hunter whose radar ability triggered on an otherwise empty room.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			ability: "Agility",
			damage_profile: "See active effect",
			lattice_interaction:
				"Inscribed using Arcane Chisel — bonds with item's mana lattice",
			stat_bonuses: {},
			special_abilities: [
				"Passive: Resistance to psychic damage",
				"Active: Gain +2 AC for 1 minute (1/long rest)",
			],
			restrictions: [
				"Socket type: accessory",
				"Inscription DC: 14 (Arcane Chisel)",
				"Material cost: 50gp",
			],
		},
		limitations: {
			uses: "Permanent while socketed",
			recharge: "Active ability recharges per rest",
			requires_attunement: false,
			conditions: [
				"Max sigils per item: 2 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 19 check or destroys the sigil",
			],
			charges: 0,
			consumable: false,
			cost: 50,
		},
	},
	{
		id: "sigil-impact-1",
		name: "Sigil of Impact",
		description: "Increases the kinetic weight of the weapon upon impact.",
		rarity: "common",
		can_inscribe_on: ["weapon"],
		passive_bonuses: {
			damage_bonus: 2,
		},
		effect_description: "Grants +2 to damage rolls with this weapon.",
		tags: ["sigil", "weapon", "offensive"],
		source_book: "Ascendant Bureau Armory",
		lore: "Confiscated from a black-market dealer operating in the shadow districts of Manila.",
		flavor:
			"Condemns the architecture of the soul. A beautiful catastrophe measured in milliseconds.",
		discovery_lore:
			"Located by a detection-type Hunter whose radar ability triggered on an otherwise empty room.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			ability: "Sense",
			damage_profile: "See active effect",
			lattice_interaction:
				"Inscribed using Shadow Quill — bonds with item's mana lattice",
			stat_bonuses: {},
			special_abilities: [
				"Passive: +1d6 to first damage roll each turn",
				"Active: Gain +2 AC for 1 minute (1/long rest)",
			],
			restrictions: [
				"Socket type: gloves",
				"Inscription DC: 21 (Shadow Quill)",
				"Material cost: 100gp",
			],
		},
		limitations: {
			uses: "Permanent while socketed",
			recharge: "Active ability recharges per rest",
			requires_attunement: false,
			conditions: [
				"Max sigils per item: 3 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 26 check or destroys the sigil",
			],
			charges: 0,
			consumable: false,
			cost: 100,
		},
	},
	{
		id: "sigil-bleeding-1",
		name: "Sigil of Laceration",
		description:
			"Causes the weapon to leave jagged mana-wounds that resist closing.",
		rarity: "uncommon",
		can_inscribe_on: ["weapon"],
		passive_bonuses: {
			critical_range: 1,
		},
		effect_description:
			"Increases critical hit range by 1 (e.g., 20 becomes 19-20).",
		tags: ["sigil", "weapon", "offensive"],
		source_book: "Ascendant Bureau Armory",
		lore: "Salvaged from the corpse of an S-Rank anomaly that breached containment in the European Dead Zone.",
		flavor:
			"Eclipses the threshold of human potential. A beautiful catastrophe measured in milliseconds.",
		discovery_lore:
			"Dropped by a mini-boss that shouldn't have existed according to the Gate's difficulty rating.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			ability: "Intelligence",
			damage_profile: "See active effect",
			lattice_interaction:
				"Inscribed using Arcane Chisel — bonds with item's mana lattice",
			stat_bonuses: {},
			special_abilities: [
				"Passive: Resistance to lightning damage",
				"Active: Automatically succeed on next ability check of a chosen type (1/long rest)",
			],
			restrictions: [
				"Socket type: armor",
				"Inscription DC: 18 (Arcane Chisel)",
				"Material cost: 100gp",
			],
		},
		limitations: {
			uses: "Permanent while socketed",
			recharge: "Active ability recharges per rest",
			requires_attunement: false,
			conditions: [
				"Max sigils per item: 2 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 23 check or destroys the sigil",
			],
			charges: 0,
			consumable: false,
			cost: 100,
		},
	},
	{
		id: "sigil-fire-1",
		name: "Sigil of the Hearth-Fire",
		description:
			"Imbues the weapon with a flickering orange glow of low-grade thermal energy.",
		rarity: "uncommon",
		can_inscribe_on: ["weapon"],
		passive_bonuses: {
			fire_damage: "1d4",
		},
		effect_description: "Deals an extra 1d4 fire damage on hit.",
		tags: ["sigil", "weapon", "fire"],
		source_book: "Ascendant Bureau Armory",
		lore: "Confiscated from a black-market dealer operating in the shadow districts of Manila.",
		flavor:
			"Condemns the certainty of outcomes. The breaking point of all resistance.",
		discovery_lore:
			"Emerged from a Gate Boss's dissolution cloud, hovering where the creature's heart had been.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			ability: "Sense",
			damage_profile: "See active effect",
			lattice_interaction:
				"Inscribed using Shadow Quill — bonds with item's mana lattice",
			stat_bonuses: {},
			special_abilities: [
				"Passive: Cannot be surprised while conscious",
				"Active: Automatically succeed on next ability check of a chosen type (1/long rest)",
			],
			restrictions: [
				"Socket type: gloves",
				"Inscription DC: 20 (Shadow Quill)",
				"Material cost: 250gp",
			],
		},
		limitations: {
			uses: "Permanent while socketed",
			recharge: "Active ability recharges per rest",
			requires_attunement: false,
			conditions: [
				"Max sigils per item: 3 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 25 check or destroys the sigil",
			],
			charges: 0,
			consumable: false,
			cost: 250,
		},
	},
	{
		id: "sigil-frost-1",
		name: "Sigil of the Arctic Breath",
		description: "Coats the weapon in a thin layer of frost that never melts.",
		rarity: "uncommon",
		can_inscribe_on: ["weapon"],
		passive_bonuses: {
			cold_damage: "1d4",
		},
		effect_description: "Deals an extra 1d4 cold damage on hit.",
		tags: ["sigil", "weapon", "cold"],
		source_book: "Ascendant Bureau Armory",
		lore: "Excavated from a pocket dimension that existed for exactly one hour before collapsing.",
		flavor:
			"Mirrors the concept of distance. The breaking point of all resistance.",
		discovery_lore:
			"Traded by a nomadic Awakened who claimed to have no memory of acquiring it.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			ability: "Sense",
			damage_profile: "See active effect",
			lattice_interaction:
				"Inscribed using Rift Calligraphy Brush — bonds with item's mana lattice",
			stat_bonuses: {},
			special_abilities: [
				"Passive: Resistance to psychic damage",
				"Active: Cast Shield as a reaction (1/short rest)",
			],
			restrictions: [
				"Socket type: gloves",
				"Inscription DC: 14 (Rift Calligraphy Brush)",
				"Material cost: 250gp",
			],
		},
		limitations: {
			uses: "Permanent while socketed",
			recharge: "Active ability recharges per rest",
			requires_attunement: false,
			conditions: [
				"Max sigils per item: 2 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 19 check or destroys the sigil",
			],
			charges: 0,
			consumable: false,
			cost: 250,
		},
	},
	{
		id: "sigil-lightning-1",
		name: "Sigil of the Storm-Spark",
		description:
			"Arks of electricity occasionally dance across the weapon's surface.",
		rarity: "uncommon",
		can_inscribe_on: ["weapon"],
		passive_bonuses: {
			lightning_damage: "1d4",
		},
		effect_description: "Deals an extra 1d4 lightning damage on hit.",
		tags: ["sigil", "weapon", "lightning"],
		source_book: "Ascendant Bureau Armory",
		lore: "Distilled from the ambient mana of a Red Gate that refused to close for seventeen days.",
		flavor: "Corrodes the laws of physics. The reason S-Rank Gates are feared.",
		discovery_lore:
			"Excavated from the crystallized mana deposit at the center of a depleted Gate core.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			ability: "Sense",
			damage_profile: "See active effect",
			lattice_interaction:
				"Inscribed using Crystal Engraver — bonds with item's mana lattice",
			stat_bonuses: {},
			special_abilities: [
				"Passive: Darkvision 30 feet",
				"Active: Automatically succeed on next ability check of a chosen type (1/long rest)",
			],
			restrictions: [
				"Socket type: shield",
				"Inscription DC: 10 (Crystal Engraver)",
				"Material cost: 100gp",
			],
		},
		limitations: {
			uses: "Permanent while socketed",
			recharge: "Active ability recharges per rest",
			requires_attunement: false,
			conditions: [
				"Max sigils per item: 1 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 15 check or destroys the sigil",
			],
			charges: 0,
			consumable: false,
			cost: 100,
		},
	},
	{
		id: "sigil-holy-1",
		name: "Sigil of Divine Radiance",
		description:
			"A pure white sigil that glows brighter in the presence of shadow creatures.",
		rarity: "rare",
		can_inscribe_on: ["weapon"],
		passive_bonuses: {
			radiant_damage: "1d6",
		},
		effect_description: "Deals an extra 1d6 radiant damage on hit.",
		tags: ["sigil", "weapon", "radiant"],
		source_book: "Holylight Cathedral",
		lore: "Synthesized in the clandestine laboratories beneath the Chinese Hunter Bureau headquarters.",
		flavor:
			"Binds the architecture of the soul. The reason S-Rank Gates are feared.",
		discovery_lore:
			"Gifted by the System itself as a reward for completing a hidden quest chain.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			ability: "Intelligence",
			damage_profile: "See active effect",
			lattice_interaction:
				"Inscribed using Void Stylus — bonds with item's mana lattice",
			stat_bonuses: {},
			special_abilities: [
				"Passive: +5 temporary HP on short rest",
				"Active: Impose disadvantage on next attack against you (Proficiency/long rest)",
			],
			restrictions: [
				"Socket type: boots",
				"Inscription DC: 20 (Void Stylus)",
				"Material cost: 100gp",
			],
		},
		limitations: {
			uses: "Permanent while socketed",
			recharge: "Active ability recharges per rest",
			requires_attunement: false,
			conditions: [
				"Max sigils per item: 3 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 25 check or destroys the sigil",
			],
			charges: 0,
			consumable: false,
			cost: 100,
		},
	},
	{
		id: "sigil-shadow-1",
		name: "Sigil of Umbral Depth",
		description:
			"Consumes light around the weapon, making it look like a void in reality.",
		rarity: "rare",
		can_inscribe_on: ["weapon"],
		passive_bonuses: {
			necrotic_damage: "1d6",
		},
		effect_description: "Deals an extra 1d6 necrotic damage on hit.",
		tags: ["sigil", "weapon", "necrotic"],
		source_book: "Shadow Legion Archives",
		lore: "Discovered embedded in the spine of a petrified World Tree fragment found in Scandinavia.",
		flavor:
			"Dissolves the threshold of human potential. The death of hesitation, made manifest.",
		discovery_lore:
			"Emerged from a Gate Boss's dissolution cloud, hovering where the creature's heart had been.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			ability: "Sense",
			damage_profile: "See active effect",
			lattice_interaction:
				"Inscribed using Rift Calligraphy Brush — bonds with item's mana lattice",
			stat_bonuses: {},
			special_abilities: [
				"Passive: Cannot be surprised while conscious",
				"Active: Gain +2 AC for 1 minute (1/long rest)",
			],
			restrictions: [
				"Socket type: shield",
				"Inscription DC: 18 (Rift Calligraphy Brush)",
				"Material cost: 1000gp",
			],
		},
		limitations: {
			uses: "Permanent while socketed",
			recharge: "Active ability recharges per rest",
			requires_attunement: false,
			conditions: [
				"Max sigils per item: 1 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 23 check or destroys the sigil",
			],
			charges: 0,
			consumable: false,
			cost: 1000,
		},
	},
	{
		id: "sigil-ward-1",
		name: "Sigil of the Bastion",
		description:
			"Denses the atmospheric mana around the wearer, creating a subtle kinetic barrier.",
		rarity: "common",
		can_inscribe_on: ["armor", "shield"],
		passive_bonuses: {
			ac_bonus: 1,
		},
		effect_description: "Provides +1 to Armor Class.",
		tags: ["sigil", "armor", "defensive"],
		source_book: "Ascendant Bureau Armory",
		lore: "Leaked through a micro-rift that appeared inside the International Hunter Conference hall.",
		flavor:
			"Shatters the silence between heartbeats. The last thing many anomalies ever see.",
		discovery_lore:
			"Discovered by an E-Rank Hunter who stumbled into an unmarked side passage during a routine dungeon clear.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			ability: "Sense",
			damage_profile: "See active effect",
			lattice_interaction:
				"Inscribed using Arcane Chisel — bonds with item's mana lattice",
			stat_bonuses: {},
			special_abilities: [
				"Passive: +1 to AC",
				"Active: Move 10 additional feet without provoking opportunity attacks (at will)",
			],
			restrictions: [
				"Socket type: boots",
				"Inscription DC: 17 (Arcane Chisel)",
				"Material cost: 500gp",
			],
		},
		limitations: {
			uses: "Permanent while socketed",
			recharge: "Active ability recharges per rest",
			requires_attunement: false,
			conditions: [
				"Max sigils per item: 2 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 22 check or destroys the sigil",
			],
			charges: 0,
			consumable: false,
			cost: 500,
		},
	},
	{
		id: "sigil-fortitude-1",
		name: "Sigil of the Iron Heart",
		description:
			"Channels mana into the wearer's biological systems to reinforce vital organs.",
		rarity: "common",
		can_inscribe_on: ["armor"],
		passive_bonuses: {
			hp_bonus: 5,
		},
		effect_description: "Increases maximum HP by 5.",
		tags: ["sigil", "armor", "vitality"],
		source_book: "Ascendant Bureau Armory",
		lore: "Created by an unnamed Awakened blacksmith who fed their own life force into the forge.",
		flavor:
			"Purges the last defense of the unprepared. The reason S-Rank Gates are feared.",
		discovery_lore:
			"Found washed ashore near a coastal Gate, wrapped in fabric that dissolved upon touch.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			ability: "Intelligence",
			damage_profile: "See active effect",
			lattice_interaction:
				"Inscribed using Shadow Quill — bonds with item's mana lattice",
			stat_bonuses: {},
			special_abilities: [
				"Passive: Ignore difficult terrain",
				"Active: Cast Shield as a reaction (1/short rest)",
			],
			restrictions: [
				"Socket type: shield",
				"Inscription DC: 19 (Shadow Quill)",
				"Material cost: 100gp",
			],
		},
		limitations: {
			uses: "Permanent while socketed",
			recharge: "Active ability recharges per rest",
			requires_attunement: false,
			conditions: [
				"Max sigils per item: 2 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 24 check or destroys the sigil",
			],
			charges: 0,
			consumable: false,
			cost: 100,
		},
	},
	{
		id: "sigil-res-fire-1",
		name: "Sigil of the Salamander",
		description:
			"Absorbs thermal energy and dissipates it into the environment.",
		rarity: "uncommon",
		can_inscribe_on: ["armor"],
		passive_bonuses: {
			resistance_fire: true,
		},
		effect_description: "Grants resistance to fire damage.",
		tags: ["sigil", "armor", "protection"],
		source_book: "Ascendant Bureau Armory",
		lore: "Reconstructed from fragments scattered across seven different C-Rank dungeons.",
		flavor:
			"Mirrors the silence between heartbeats. A beautiful catastrophe measured in milliseconds.",
		discovery_lore:
			"Found washed ashore near a coastal Gate, wrapped in fabric that dissolved upon touch.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			ability: "Intelligence",
			damage_profile: "See active effect",
			lattice_interaction:
				"Inscribed using Rift Calligraphy Brush — bonds with item's mana lattice",
			stat_bonuses: {},
			special_abilities: [
				"Passive: +1 to spell save DC",
				"Active: Grant one ally within 30 feet temporary HP equal to your level (1/short rest)",
			],
			restrictions: [
				"Socket type: boots",
				"Inscription DC: 17 (Rift Calligraphy Brush)",
				"Material cost: 100gp",
			],
		},
		limitations: {
			uses: "Permanent while socketed",
			recharge: "Active ability recharges per rest",
			requires_attunement: false,
			conditions: [
				"Max sigils per item: 1 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 22 check or destroys the sigil",
			],
			charges: 0,
			consumable: false,
			cost: 100,
		},
	},
	{
		id: "sigil-res-cold-1",
		name: "Sigil of the Winter-Coat",
		description:
			"Maintains a constant internal temperature despite external cold.",
		rarity: "uncommon",
		can_inscribe_on: ["armor"],
		passive_bonuses: {
			resistance_cold: true,
		},
		effect_description: "Grants resistance to cold damage.",
		tags: ["sigil", "armor", "protection"],
		source_book: "Ascendant Bureau Armory",
		lore: "Salvaged from the corpse of an S-Rank anomaly that breached containment in the European Dead Zone.",
		flavor:
			"Fractures the fabric of reality. Evolution compressed into a single, violent instant.",
		discovery_lore:
			"Located by a detection-type Hunter whose radar ability triggered on an otherwise empty room.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			ability: "Agility",
			damage_profile: "See active effect",
			lattice_interaction:
				"Inscribed using Crystal Engraver — bonds with item's mana lattice",
			stat_bonuses: {},
			special_abilities: [
				"Passive: Resistance to psychic damage",
				"Active: Heal 2d8+2 HP as a bonus action (1/short rest)",
			],
			restrictions: [
				"Socket type: armor",
				"Inscription DC: 10 (Crystal Engraver)",
				"Material cost: 2500gp",
			],
		},
		limitations: {
			uses: "Permanent while socketed",
			recharge: "Active ability recharges per rest",
			requires_attunement: false,
			conditions: [
				"Max sigils per item: 1 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 15 check or destroys the sigil",
			],
			charges: 0,
			consumable: false,
			cost: 2500,
		},
	},
	{
		id: "sigil-res-lightning-1",
		name: "Sigil of the Grounding-Wire",
		description:
			"Diverts electrical currents safely away from the wearer's body.",
		rarity: "uncommon",
		can_inscribe_on: ["armor"],
		passive_bonuses: {
			resistance_lightning: true,
		},
		effect_description: "Grants resistance to lightning damage.",
		tags: ["sigil", "armor", "protection"],
		source_book: "Ascendant Bureau Armory",
		lore: "Unearthed by a mining Guild operating in the mana-saturated quarries of the Australian Outback.",
		flavor:
			"Shatters the chains of mortality. The line between Hunter and monster.",
		discovery_lore:
			"Emerged from a Gate Boss's dissolution cloud, hovering where the creature's heart had been.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			ability: "Intelligence",
			damage_profile: "See active effect",
			lattice_interaction:
				"Inscribed using Arcane Chisel — bonds with item's mana lattice",
			stat_bonuses: {},
			special_abilities: [
				"Passive: Cannot be surprised while conscious",
				"Active: Create dim light in 20-foot radius for 10 minutes (at will)",
			],
			restrictions: [
				"Socket type: accessory",
				"Inscription DC: 15 (Arcane Chisel)",
				"Material cost: 2500gp",
			],
		},
		limitations: {
			uses: "Permanent while socketed",
			recharge: "Active ability recharges per rest",
			requires_attunement: false,
			conditions: [
				"Max sigils per item: 2 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 20 check or destroys the sigil",
			],
			charges: 0,
			consumable: false,
			cost: 2500,
		},
	},
	{
		id: "sigil-mobility-1",
		name: "Sigil of the Zephyr",
		description:
			"Lightens the wearer's load by creating a slight upward mana-lift.",
		rarity: "uncommon",
		can_inscribe_on: ["armor", "accessory"],
		passive_bonuses: {
			speed_bonus: 5,
		},
		effect_description: "Increases movement speed by 5 feet.",
		tags: ["sigil", "armor", "utility"],
		source_book: "Ascendant Bureau Armory",
		lore: "Decoded from ancient sigil-stones found beneath the ruins of a pre-Awakening temple in Kyoto.",
		flavor:
			"Crushes the last defense of the unprepared. The death of hesitation, made manifest.",
		discovery_lore:
			"Materialized on a Hunter's workbench overnight, leaving scorch marks in the shape of unknown glyphs.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			ability: "Sense",
			damage_profile: "See active effect",
			lattice_interaction:
				"Inscribed using Mana Etching Needle — bonds with item's mana lattice",
			stat_bonuses: {},
			special_abilities: [
				"Passive: +1d4 to initiative rolls",
				"Active: Gain +2 AC for 1 minute (1/long rest)",
			],
			restrictions: [
				"Socket type: weapon",
				"Inscription DC: 18 (Mana Etching Needle)",
				"Material cost: 1000gp",
			],
		},
		limitations: {
			uses: "Permanent while socketed",
			recharge: "Active ability recharges per rest",
			requires_attunement: false,
			conditions: [
				"Max sigils per item: 1 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 23 check or destroys the sigil",
			],
			charges: 0,
			consumable: false,
			cost: 1000,
		},
	},
	{
		id: "sigil-intel-1",
		name: "Sigil of the Clear-Mind",
		description:
			"Optimizes synaptic pathways for faster processing and recall.",
		rarity: "rare",
		can_inscribe_on: ["accessory"],
		passive_bonuses: {
			intelligence_mod: 1,
		},
		effect_description: "Increases Intelligence by 1.",
		tags: ["sigil", "accessory", "intelligence"],
		source_book: "Academy of High Magic",
		lore: "Translated from forbidden shadow-language inscriptions found in a Monarch's throne room.",
		flavor:
			"Overrides the fabric of reality. The last thing many anomalies ever see.",
		discovery_lore:
			"Found washed ashore near a coastal Gate, wrapped in fabric that dissolved upon touch.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			ability: "Intelligence",
			damage_profile: "See active effect",
			lattice_interaction:
				"Inscribed using Void Stylus — bonds with item's mana lattice",
			stat_bonuses: {},
			special_abilities: [
				"Passive: +1 to spell save DC",
				"Active: Add 1d8 radiant damage to weapon attacks for 1 minute (1/long rest)",
			],
			restrictions: [
				"Socket type: accessory",
				"Inscription DC: 10 (Void Stylus)",
				"Material cost: 500gp",
			],
		},
		limitations: {
			uses: "Permanent while socketed",
			recharge: "Active ability recharges per rest",
			requires_attunement: false,
			conditions: [
				"Max sigils per item: 1 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 15 check or destroys the sigil",
			],
			charges: 0,
			consumable: false,
			cost: 500,
		},
	},
	{
		id: "sigil-sense-1",
		name: "Sigil of the Eagle-Eye",
		description: "sharpens visual acuity and mana-sensing capabilities.",
		rarity: "rare",
		can_inscribe_on: ["accessory"],
		passive_bonuses: {
			sense_mod: 1,
		},
		effect_description: "Increases Sense by 1.",
		tags: ["sigil", "accessory", "sense"],
		source_book: "Academy of High Magic",
		lore: "Born from a System glitch that briefly merged two overlapping Gate instances.",
		flavor:
			"Reclaims the concept of distance. The death of hesitation, made manifest.",
		discovery_lore:
			"Located by a detection-type Hunter whose radar ability triggered on an otherwise empty room.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			ability: "Agility",
			damage_profile: "See active effect",
			lattice_interaction:
				"Inscribed using Void Stylus — bonds with item's mana lattice",
			stat_bonuses: {},
			special_abilities: [
				"Passive: Resistance to psychic damage",
				"Active: Create a 10-foot zone of difficult terrain (2/long rest)",
			],
			restrictions: [
				"Socket type: accessory",
				"Inscription DC: 14 (Void Stylus)",
				"Material cost: 1000gp",
			],
		},
		limitations: {
			uses: "Permanent while socketed",
			recharge: "Active ability recharges per rest",
			requires_attunement: false,
			conditions: [
				"Max sigils per item: 2 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 19 check or destroys the sigil",
			],
			charges: 0,
			consumable: false,
			cost: 1000,
		},
	},
	{
		id: "sigil-agility-1",
		name: "Sigil of the Feline-Grace",
		description: "Enhances neuromuscular coordination and reflexive response.",
		rarity: "rare",
		can_inscribe_on: ["accessory"],
		passive_bonuses: {
			agility_mod: 1,
		},
		effect_description: "Increases Agility by 1.",
		tags: ["sigil", "accessory", "agility"],
		source_book: "Academy of High Magic",
		lore: "Extracted from the dimensional residue of a collapsed B-Rank Gate in downtown Seoul.",
		flavor:
			"Eclipses the architecture of the soul. The final equation in a war without end.",
		discovery_lore:
			"Excavated from the crystallized mana deposit at the center of a depleted Gate core.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			ability: "Sense",
			damage_profile: "See active effect",
			lattice_interaction:
				"Inscribed using Arcane Chisel — bonds with item's mana lattice",
			stat_bonuses: {},
			special_abilities: [
				"Passive: Darkvision 30 feet",
				"Active: Grant one ally within 30 feet temporary HP equal to your level (1/short rest)",
			],
			restrictions: [
				"Socket type: weapon",
				"Inscription DC: 21 (Arcane Chisel)",
				"Material cost: 50gp",
			],
		},
		limitations: {
			uses: "Permanent while socketed",
			recharge: "Active ability recharges per rest",
			requires_attunement: false,
			conditions: [
				"Max sigils per item: 1 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 26 check or destroys the sigil",
			],
			charges: 0,
			consumable: false,
			cost: 50,
		},
	},
	{
		id: "sigil-strength-1",
		name: "Sigil of the Titan-Grip",
		description: "Reinforces skeletal structure and muscle fiber density.",
		rarity: "rare",
		can_inscribe_on: ["accessory"],
		passive_bonuses: {
			strength_mod: 1,
		},
		effect_description: "Increases Strength by 1.",
		tags: ["sigil", "accessory", "strength"],
		source_book: "Academy of High Magic",
		lore: "Unearthed by a mining Guild operating in the mana-saturated quarries of the Australian Outback.",
		flavor:
			"Rends the laws of physics. A reminder that the System has no mercy.",
		discovery_lore:
			"Found washed ashore near a coastal Gate, wrapped in fabric that dissolved upon touch.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			ability: "Sense",
			damage_profile: "See active effect",
			lattice_interaction:
				"Inscribed using Rift Calligraphy Brush — bonds with item's mana lattice",
			stat_bonuses: {},
			special_abilities: [
				"Passive: Ignore difficult terrain",
				"Active: Move 10 additional feet without provoking opportunity attacks (at will)",
			],
			restrictions: [
				"Socket type: armor",
				"Inscription DC: 11 (Rift Calligraphy Brush)",
				"Material cost: 250gp",
			],
		},
		limitations: {
			uses: "Permanent while socketed",
			recharge: "Active ability recharges per rest",
			requires_attunement: false,
			conditions: [
				"Max sigils per item: 1 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 16 check or destroys the sigil",
			],
			charges: 0,
			consumable: false,
			cost: 250,
		},
	},
	{
		id: "sigil-presence-1",
		name: "Sigil of the Commander",
		description:
			"Radiates an aura of authority and calm that others instinctively follow.",
		rarity: "rare",
		can_inscribe_on: ["accessory"],
		passive_bonuses: {
			presence_mod: 1,
		},
		effect_description: "Increases Presence by 1.",
		tags: ["sigil", "accessory", "presence"],
		source_book: "Academy of High Magic",
		lore: "Stolen from a Guild vault during the Three-Day War between rival Korean Hunter factions.",
		flavor:
			"Commands the last defense of the unprepared. The death of hesitation, made manifest.",
		discovery_lore:
			"Purchased from a black-market auction in the underground district of Neo-Seoul for an undisclosed sum.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			ability: "Intelligence",
			damage_profile: "See active effect",
			lattice_interaction:
				"Inscribed using Mana Etching Needle — bonds with item's mana lattice",
			stat_bonuses: {},
			special_abilities: [
				"Passive: +2 to Agility checks",
				"Active: Grant one ally within 30 feet temporary HP equal to your level (1/short rest)",
			],
			restrictions: [
				"Socket type: helm",
				"Inscription DC: 19 (Mana Etching Needle)",
				"Material cost: 1000gp",
			],
		},
		limitations: {
			uses: "Permanent while socketed",
			recharge: "Active ability recharges per rest",
			requires_attunement: false,
			conditions: [
				"Max sigils per item: 3 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 24 check or destroys the sigil",
			],
			charges: 0,
			consumable: false,
			cost: 1000,
		},
	},
	{
		id: "sigil-mana-regen-1",
		name: "Sigil of the Flowing-Lattice",
		description:
			"Slowly draws mana from the environment to replenish the user's reserves.",
		rarity: "very_rare",
		can_inscribe_on: ["accessory"],
		passive_bonuses: {
			mana_regen: 1,
		},
		effect_description: "Regenerates 1 additional Mana point per turn.",
		tags: ["sigil", "accessory", "mana"],
		source_book: "Academy of High Magic",
		lore: "Found clutched in the hand of a petrified E-Rank Hunter who had been missing for three years.",
		flavor:
			"Sanctifies the remnants of a dead world. Proof that some things cannot be survived.",
		discovery_lore:
			"Located by a detection-type Hunter whose radar ability triggered on an otherwise empty room.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			ability: "Intelligence",
			damage_profile: "See active effect",
			lattice_interaction:
				"Inscribed using Rift Calligraphy Brush — bonds with item's mana lattice",
			stat_bonuses: {},
			special_abilities: [
				"Passive: +1d6 to first damage roll each turn",
				"Active: Add 1d8 radiant damage to weapon attacks for 1 minute (1/long rest)",
			],
			restrictions: [
				"Socket type: boots",
				"Inscription DC: 21 (Rift Calligraphy Brush)",
				"Material cost: 500gp",
			],
		},
		limitations: {
			uses: "Permanent while socketed",
			recharge: "Active ability recharges per rest",
			requires_attunement: false,
			conditions: [
				"Max sigils per item: 1 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 26 check or destroys the sigil",
			],
			charges: 0,
			consumable: false,
			cost: 500,
		},
	},
	{
		id: "sigil-shadow-king",
		name: "Sigil of the Umbral Monarch",
		description:
			"The rarest sigil found in the deepest rifts. It pulses with a dark, commanding power.",
		rarity: "legendary",
		can_inscribe_on: ["weapon"],
		passive_bonuses: {
			necrotic_damage: "2d8",
			shadow_soldier_lord: true,
		},
		effect_description:
			"Deals 2d8 extra necrotic damage and allows you to command one additional Shadow Soldier.",
		tags: ["sigil", "weapon", "legendary", "necrotic"],
		source_book: "Shadow Legion Archives",
		lore: "Found clutched in the hand of a petrified E-Rank Hunter who had been missing for three years.",
		flavor:
			"Purges the architect's design. The last thing many anomalies ever see.",
		discovery_lore:
			"Traded by a nomadic Awakened who claimed to have no memory of acquiring it.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			ability: "Agility",
			damage_profile: "See active effect",
			lattice_interaction:
				"Inscribed using Shadow Quill — bonds with item's mana lattice",
			stat_bonuses: {},
			special_abilities: [
				"Passive: +2 to Sense (Perception)",
				"Active: Gain +2 AC for 1 minute (1/long rest)",
			],
			restrictions: [
				"Socket type: gloves",
				"Inscription DC: 13 (Shadow Quill)",
				"Material cost: 500gp",
			],
		},
		limitations: {
			uses: "Permanent while socketed",
			recharge: "Active ability recharges per rest",
			requires_attunement: false,
			conditions: [
				"Max sigils per item: 2 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 18 check or destroys the sigil",
			],
			charges: 0,
			consumable: false,
			cost: 500,
		},
	},
	{
		id: "sigil-immortality",
		name: "Sigil of the Eternal Phoenix",
		description:
			"Forged from the heart of a solar flare. It refuses to let the wearer expire.",
		rarity: "legendary",
		can_inscribe_on: ["armor"],
		passive_bonuses: {
			auto_stabilize: true,
			fire_immunity: true,
		},
		effect_description:
			"Grants immunity to fire damage and automatically stabilizes you if you fall to 0 HP.",
		tags: ["sigil", "armor", "legendary", "protection"],
		source_book: "Rift Ascendant Canon",
		lore: "Leaked through a micro-rift that appeared inside the International Hunter Conference hall.",
		flavor:
			"Eclipses the silence between heartbeats. The line between Hunter and monster.",
		discovery_lore:
			"Discovered by an E-Rank Hunter who stumbled into an unmarked side passage during a routine dungeon clear.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			ability: "Agility",
			damage_profile: "See active effect",
			lattice_interaction:
				"Inscribed using Arcane Chisel — bonds with item's mana lattice",
			stat_bonuses: {},
			special_abilities: [
				"Passive: +1 to saving throws",
				"Active: Heal 2d8+2 HP as a bonus action (1/short rest)",
			],
			restrictions: [
				"Socket type: boots",
				"Inscription DC: 17 (Arcane Chisel)",
				"Material cost: 2500gp",
			],
		},
		limitations: {
			uses: "Permanent while socketed",
			recharge: "Active ability recharges per rest",
			requires_attunement: false,
			conditions: [
				"Max sigils per item: 2 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 22 check or destroys the sigil",
			],
			charges: 0,
			consumable: false,
			cost: 2500,
		},
	},
	{
		id: "sigil-res-fire-2",
		name: "Sigil of Greater Fire Guard",
		description: "Advanced protection against fire and environmental hazards.",
		rune_type: "Defense",
		rune_category: "Armor",
		rarity: "rare",
		can_inscribe_on: ["armor"],
		passive_bonuses: {
			resistance_fire: true,
			saving_throw_bonus: 1,
		},
		effect_description:
			"Grants resistance to fire damage and +1 to all saving throws.",
		tags: ["sigil", "armor", "protection", "fire"],
		source_book: "Ascendant Bureau Armory",
		lore: "Stolen from a Guild vault during the Three-Day War between rival Korean Hunter factions.",
		flavor:
			"Corrodes the certainty of outcomes. The death of hesitation, made manifest.",
		discovery_lore:
			"Purchased from a black-market auction in the underground district of Neo-Seoul for an undisclosed sum.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			ability: "Sense",
			damage_profile: "See active effect",
			lattice_interaction:
				"Inscribed using Crystal Engraver — bonds with item's mana lattice",
			stat_bonuses: {},
			special_abilities: [
				"Passive: +2 to Agility checks",
				"Active: Deal 2d6 bonus fire damage on next hit (2/short rest)",
			],
			restrictions: [
				"Socket type: helm",
				"Inscription DC: 20 (Crystal Engraver)",
				"Material cost: 1000gp",
			],
		},
		limitations: {
			uses: "Permanent while socketed",
			recharge: "Active ability recharges per rest",
			requires_attunement: false,
			conditions: [
				"Max sigils per item: 2 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 25 check or destroys the sigil",
			],
			charges: 0,
			consumable: false,
			cost: 1000,
		},
	},
	{
		id: "sigil-res-frost-2",
		name: "Sigil of Greater Frost Guard",
		description: "Advanced protection against frost and environmental hazards.",
		rune_type: "Defense",
		rune_category: "Armor",
		rarity: "rare",
		can_inscribe_on: ["armor"],
		passive_bonuses: {
			resistance_frost: true,
			saving_throw_bonus: 1,
		},
		effect_description:
			"Grants resistance to frost damage and +1 to all saving throws.",
		tags: ["sigil", "armor", "protection", "frost"],
		source_book: "Ascendant Bureau Armory",
		lore: "Pulled from the dreams of a comatose S-Rank Hunter by a team of psychic-type Awakened.",
		flavor:
			"Devours the silence between heartbeats. The line between Hunter and monster.",
		discovery_lore:
			"Discovered by an E-Rank Hunter who stumbled into an unmarked side passage during a routine dungeon clear.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			ability: "Sense",
			damage_profile: "See active effect",
			lattice_interaction:
				"Inscribed using Arcane Chisel — bonds with item's mana lattice",
			stat_bonuses: {},
			special_abilities: [
				"Passive: +1 to saving throws",
				"Active: Cast Shield as a reaction (1/short rest)",
			],
			restrictions: [
				"Socket type: helm",
				"Inscription DC: 17 (Arcane Chisel)",
				"Material cost: 2500gp",
			],
		},
		limitations: {
			uses: "Permanent while socketed",
			recharge: "Active ability recharges per rest",
			requires_attunement: false,
			conditions: [
				"Max sigils per item: 2 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 22 check or destroys the sigil",
			],
			charges: 0,
			consumable: false,
			cost: 2500,
		},
	},
	{
		id: "sigil-res-lightning-2",
		name: "Sigil of Greater Lightning Guard",
		description:
			"Advanced protection against lightning and environmental hazards.",
		rune_type: "Defense",
		rune_category: "Armor",
		rarity: "rare",
		can_inscribe_on: ["armor"],
		passive_bonuses: {
			resistance_lightning: true,
			saving_throw_bonus: 1,
		},
		effect_description:
			"Grants resistance to lightning damage and +1 to all saving throws.",
		tags: ["sigil", "armor", "protection", "lightning"],
		source_book: "Ascendant Bureau Armory",
		lore: "Synthesized in the clandestine laboratories beneath the Chinese Hunter Bureau headquarters.",
		flavor:
			"Absorbs the illusion of safety. The last thing many anomalies ever see.",
		discovery_lore:
			"Recovered from a time-locked chest that required three different elemental keys to open.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			ability: "Intelligence",
			damage_profile: "See active effect",
			lattice_interaction:
				"Inscribed using Void Stylus — bonds with item's mana lattice",
			stat_bonuses: {},
			special_abilities: [
				"Passive: +2 to Strength checks",
				"Active: Heal 2d8+2 HP as a bonus action (1/short rest)",
			],
			restrictions: [
				"Socket type: boots",
				"Inscription DC: 14 (Void Stylus)",
				"Material cost: 500gp",
			],
		},
		limitations: {
			uses: "Permanent while socketed",
			recharge: "Active ability recharges per rest",
			requires_attunement: false,
			conditions: [
				"Max sigils per item: 3 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 19 check or destroys the sigil",
			],
			charges: 0,
			consumable: false,
			cost: 500,
		},
	},
	{
		id: "sigil-res-acid-2",
		name: "Sigil of Greater Acid Guard",
		description: "Advanced protection against acid and environmental hazards.",
		rune_type: "Defense",
		rune_category: "Armor",
		rarity: "rare",
		can_inscribe_on: ["armor"],
		passive_bonuses: {
			resistance_acid: true,
			saving_throw_bonus: 1,
		},
		effect_description:
			"Grants resistance to acid damage and +1 to all saving throws.",
		tags: ["sigil", "armor", "protection", "acid"],
		source_book: "Ascendant Bureau Armory",
		lore: "Synthesized in the clandestine laboratories beneath the Chinese Hunter Bureau headquarters.",
		flavor:
			"Purges the laws of physics. The final equation in a war without end.",
		discovery_lore:
			"Discovered by an E-Rank Hunter who stumbled into an unmarked side passage during a routine dungeon clear.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			ability: "Intelligence",
			damage_profile: "See active effect",
			lattice_interaction:
				"Inscribed using Shadow Quill — bonds with item's mana lattice",
			stat_bonuses: {},
			special_abilities: [
				"Passive: +2 to Sense (Perception)",
				"Active: Heal 2d8+2 HP as a bonus action (1/short rest)",
			],
			restrictions: [
				"Socket type: boots",
				"Inscription DC: 10 (Shadow Quill)",
				"Material cost: 50gp",
			],
		},
		limitations: {
			uses: "Permanent while socketed",
			recharge: "Active ability recharges per rest",
			requires_attunement: false,
			conditions: [
				"Max sigils per item: 2 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 15 check or destroys the sigil",
			],
			charges: 0,
			consumable: false,
			cost: 50,
		},
	},
	{
		id: "sigil-res-poison-2",
		name: "Sigil of Greater Poison Guard",
		description:
			"Advanced protection against poison and environmental hazards.",
		rune_type: "Defense",
		rune_category: "Armor",
		rarity: "rare",
		can_inscribe_on: ["armor"],
		passive_bonuses: {
			resistance_poison: true,
			saving_throw_bonus: 1,
		},
		effect_description:
			"Grants resistance to poison damage and +1 to all saving throws.",
		tags: ["sigil", "armor", "protection", "poison"],
		source_book: "Ascendant Bureau Armory",
		lore: "Leaked through a micro-rift that appeared inside the International Hunter Conference hall.",
		flavor:
			"Warps the threshold of human potential. A beautiful catastrophe measured in milliseconds.",
		discovery_lore:
			"Excavated from the crystallized mana deposit at the center of a depleted Gate core.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			ability: "Agility",
			damage_profile: "See active effect",
			lattice_interaction:
				"Inscribed using Crystal Engraver — bonds with item's mana lattice",
			stat_bonuses: {},
			special_abilities: [
				"Passive: Darkvision 30 feet",
				"Active: Heal 2d8+2 HP as a bonus action (1/short rest)",
			],
			restrictions: [
				"Socket type: boots",
				"Inscription DC: 18 (Crystal Engraver)",
				"Material cost: 100gp",
			],
		},
		limitations: {
			uses: "Permanent while socketed",
			recharge: "Active ability recharges per rest",
			requires_attunement: false,
			conditions: [
				"Max sigils per item: 1 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 23 check or destroys the sigil",
			],
			charges: 0,
			consumable: false,
			cost: 100,
		},
	},
	{
		id: "sigil-res-thunder-2",
		name: "Sigil of Greater Thunder Guard",
		description:
			"Advanced protection against thunder and environmental hazards.",
		rune_type: "Defense",
		rune_category: "Armor",
		rarity: "rare",
		can_inscribe_on: ["armor"],
		passive_bonuses: {
			resistance_thunder: true,
			saving_throw_bonus: 1,
		},
		effect_description:
			"Grants resistance to thunder damage and +1 to all saving throws.",
		tags: ["sigil", "armor", "protection", "thunder"],
		source_book: "Ascendant Bureau Armory",
		lore: "Distilled from the ambient mana of a Red Gate that refused to close for seventeen days.",
		flavor:
			"Dissolves the boundary between life and death. The reason S-Rank Gates are feared.",
		discovery_lore:
			"Located by a detection-type Hunter whose radar ability triggered on an otherwise empty room.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			ability: "Intelligence",
			damage_profile: "See active effect",
			lattice_interaction:
				"Inscribed using Rift Calligraphy Brush — bonds with item's mana lattice",
			stat_bonuses: {},
			special_abilities: [
				"Passive: +2 to Agility checks",
				"Active: Automatically succeed on next ability check of a chosen type (1/long rest)",
			],
			restrictions: [
				"Socket type: accessory",
				"Inscription DC: 12 (Rift Calligraphy Brush)",
				"Material cost: 100gp",
			],
		},
		limitations: {
			uses: "Permanent while socketed",
			recharge: "Active ability recharges per rest",
			requires_attunement: false,
			conditions: [
				"Max sigils per item: 3 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 17 check or destroys the sigil",
			],
			charges: 0,
			consumable: false,
			cost: 100,
		},
	},
	{
		id: "sigil-res-force-2",
		name: "Sigil of Greater Force Guard",
		description: "Advanced protection against force and environmental hazards.",
		rune_type: "Defense",
		rune_category: "Armor",
		rarity: "rare",
		can_inscribe_on: ["armor"],
		passive_bonuses: {
			resistance_force: true,
			saving_throw_bonus: 1,
		},
		effect_description:
			"Grants resistance to force damage and +1 to all saving throws.",
		tags: ["sigil", "armor", "protection", "force"],
		source_book: "Ascendant Bureau Armory",
		lore: "Created by an unnamed Awakened blacksmith who fed their own life force into the forge.",
		flavor:
			"Purges the architecture of the soul. A whisper from the edge of oblivion.",
		discovery_lore:
			"Recovered from a time-locked chest that required three different elemental keys to open.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			ability: "Agility",
			damage_profile: "See active effect",
			lattice_interaction:
				"Inscribed using Shadow Quill — bonds with item's mana lattice",
			stat_bonuses: {},
			special_abilities: [
				"Passive: +2 to Strength checks",
				"Active: Create a 10-foot zone of difficult terrain (2/long rest)",
			],
			restrictions: [
				"Socket type: shield",
				"Inscription DC: 20 (Shadow Quill)",
				"Material cost: 1000gp",
			],
		},
		limitations: {
			uses: "Permanent while socketed",
			recharge: "Active ability recharges per rest",
			requires_attunement: false,
			conditions: [
				"Max sigils per item: 1 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 25 check or destroys the sigil",
			],
			charges: 0,
			consumable: false,
			cost: 1000,
		},
	},
	{
		id: "sigil-res-psychic-2",
		name: "Sigil of Greater Psychic Guard",
		description:
			"Advanced protection against psychic and environmental hazards.",
		rune_type: "Defense",
		rune_category: "Armor",
		rarity: "rare",
		can_inscribe_on: ["armor"],
		passive_bonuses: {
			resistance_psychic: true,
			saving_throw_bonus: 1,
		},
		effect_description:
			"Grants resistance to psychic damage and +1 to all saving throws.",
		tags: ["sigil", "armor", "protection", "psychic"],
		source_book: "Ascendant Bureau Armory",
		lore: "Woven from the screams of a Gate Boss that achieved sentience moments before death.",
		flavor:
			"Crushes the dimensional barrier. A whisper from the edge of oblivion.",
		discovery_lore:
			"Materialized on a Hunter's workbench overnight, leaving scorch marks in the shape of unknown glyphs.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			ability: "Intelligence",
			damage_profile: "See active effect",
			lattice_interaction:
				"Inscribed using Mana Etching Needle — bonds with item's mana lattice",
			stat_bonuses: {},
			special_abilities: [
				"Passive: Advantage on death saving throws",
				"Active: Reduce incoming damage by 1d10 as a reaction (Proficiency/long rest)",
			],
			restrictions: [
				"Socket type: gloves",
				"Inscription DC: 13 (Mana Etching Needle)",
				"Material cost: 1000gp",
			],
		},
		limitations: {
			uses: "Permanent while socketed",
			recharge: "Active ability recharges per rest",
			requires_attunement: false,
			conditions: [
				"Max sigils per item: 1 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 18 check or destroys the sigil",
			],
			charges: 0,
			consumable: false,
			cost: 1000,
		},
	},
	{
		id: "sigil-mastery-blade",
		name: "Sigil of the Blade Master",
		description:
			"Automatically adjusts the weapon's weight and balance to the wielder's preferences.",
		rune_type: "Combat",
		rune_category: "Weapon",
		rarity: "rare",
		can_inscribe_on: ["weapon"],
		passive_bonuses: {
			attack_bonus: 2,
			crit_damage_multiplier: 1.5,
		},
		effect_description:
			"Provides +2 to attack rolls and increases critical hit damage multiplier to 1.5x.",
		tags: ["sigil", "weapon", "mastery", "blade"],
		source_book: "Ascendant Bureau Armory",
		lore: "Gifted by a dying Regent as payment for a debt that predates human civilization.",
		flavor:
			"Purges the concept of distance. A testament to what Hunters have become.",
		discovery_lore:
			"Traded by a nomadic Awakened who claimed to have no memory of acquiring it.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			ability: "Agility",
			damage_profile: "See active effect",
			lattice_interaction:
				"Inscribed using Shadow Quill — bonds with item's mana lattice",
			stat_bonuses: {},
			special_abilities: [
				"Passive: +2 to Sense (Perception)",
				"Active: Automatically succeed on next ability check of a chosen type (1/long rest)",
			],
			restrictions: [
				"Socket type: helm",
				"Inscription DC: 14 (Shadow Quill)",
				"Material cost: 50gp",
			],
		},
		limitations: {
			uses: "Permanent while socketed",
			recharge: "Active ability recharges per rest",
			requires_attunement: false,
			conditions: [
				"Max sigils per item: 1 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 19 check or destroys the sigil",
			],
			charges: 0,
			consumable: false,
			cost: 50,
		},
	},
	{
		id: "sigil-mastery-mallet",
		name: "Sigil of the Mallet Master",
		description:
			"Automatically adjusts the weapon's weight and balance to the wielder's preferences.",
		rune_type: "Combat",
		rune_category: "Weapon",
		rarity: "rare",
		can_inscribe_on: ["weapon"],
		passive_bonuses: {
			attack_bonus: 2,
			crit_damage_multiplier: 1.5,
		},
		effect_description:
			"Provides +2 to attack rolls and increases critical hit damage multiplier to 1.5x.",
		tags: ["sigil", "weapon", "mastery", "mallet"],
		source_book: "Ascendant Bureau Armory",
		lore: "Gifted by a dying Regent as payment for a debt that predates human civilization.",
		flavor:
			"Dissolves the boundary between life and death. The death of hesitation, made manifest.",
		discovery_lore:
			"Traded by a nomadic Awakened who claimed to have no memory of acquiring it.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			ability: "Sense",
			damage_profile: "See active effect",
			lattice_interaction:
				"Inscribed using Rift Calligraphy Brush — bonds with item's mana lattice",
			stat_bonuses: {},
			special_abilities: [
				"Passive: Resistance to fire damage",
				"Active: Deal 1d8 lightning damage to attacker when hit (passive trigger)",
			],
			restrictions: [
				"Socket type: helm",
				"Inscription DC: 12 (Rift Calligraphy Brush)",
				"Material cost: 1000gp",
			],
		},
		limitations: {
			uses: "Permanent while socketed",
			recharge: "Active ability recharges per rest",
			requires_attunement: false,
			conditions: [
				"Max sigils per item: 2 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 17 check or destroys the sigil",
			],
			charges: 0,
			consumable: false,
			cost: 1000,
		},
	},
	{
		id: "sigil-mastery-bow",
		name: "Sigil of the Bow Master",
		description:
			"Automatically adjusts the weapon's weight and balance to the wielder's preferences.",
		rune_type: "Combat",
		rune_category: "Weapon",
		rarity: "rare",
		can_inscribe_on: ["weapon"],
		passive_bonuses: {
			attack_bonus: 2,
			crit_damage_multiplier: 1.5,
		},
		effect_description:
			"Provides +2 to attack rolls and increases critical hit damage multiplier to 1.5x.",
		tags: ["sigil", "weapon", "mastery", "bow"],
		source_book: "Ascendant Bureau Armory",
		lore: "Born from a System glitch that briefly merged two overlapping Gate instances.",
		flavor:
			"Binds the dimensional barrier. The reason S-Rank Gates are feared.",
		discovery_lore:
			"Found in a hidden compartment of a relic weapon that had been in Guild storage for years.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			ability: "Sense",
			damage_profile: "See active effect",
			lattice_interaction:
				"Inscribed using Void Stylus — bonds with item's mana lattice",
			stat_bonuses: {},
			special_abilities: [
				"Passive: Resistance to necrotic damage",
				"Active: Create a 10-foot zone of difficult terrain (2/long rest)",
			],
			restrictions: [
				"Socket type: accessory",
				"Inscription DC: 13 (Void Stylus)",
				"Material cost: 100gp",
			],
		},
		limitations: {
			uses: "Permanent while socketed",
			recharge: "Active ability recharges per rest",
			requires_attunement: false,
			conditions: [
				"Max sigils per item: 1 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 18 check or destroys the sigil",
			],
			charges: 0,
			consumable: false,
			cost: 100,
		},
	},
	{
		id: "sigil-mastery-spear",
		name: "Sigil of the Spear Master",
		description:
			"Automatically adjusts the weapon's weight and balance to the wielder's preferences.",
		rune_type: "Combat",
		rune_category: "Weapon",
		rarity: "rare",
		can_inscribe_on: ["weapon"],
		passive_bonuses: {
			attack_bonus: 2,
			crit_damage_multiplier: 1.5,
		},
		effect_description:
			"Provides +2 to attack rolls and increases critical hit damage multiplier to 1.5x.",
		tags: ["sigil", "weapon", "mastery", "spear"],
		source_book: "Ascendant Bureau Armory",
		lore: "Born from a System glitch that briefly merged two overlapping Gate instances.",
		flavor:
			"Fractures the last defense of the unprepared. The death of hesitation, made manifest.",
		discovery_lore:
			"Recovered from a time-locked chest that required three different elemental keys to open.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			ability: "Intelligence",
			damage_profile: "See active effect",
			lattice_interaction:
				"Inscribed using Crystal Engraver — bonds with item's mana lattice",
			stat_bonuses: {},
			special_abilities: [
				"Passive: Advantage on death saving throws",
				"Active: Move 10 additional feet without provoking opportunity attacks (at will)",
			],
			restrictions: [
				"Socket type: accessory",
				"Inscription DC: 19 (Crystal Engraver)",
				"Material cost: 1000gp",
			],
		},
		limitations: {
			uses: "Permanent while socketed",
			recharge: "Active ability recharges per rest",
			requires_attunement: false,
			conditions: [
				"Max sigils per item: 3 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 24 check or destroys the sigil",
			],
			charges: 0,
			consumable: false,
			cost: 1000,
		},
	},
	{
		id: "sigil-mastery-axe",
		name: "Sigil of the Axe Master",
		description:
			"Automatically adjusts the weapon's weight and balance to the wielder's preferences.",
		rune_type: "Combat",
		rune_category: "Weapon",
		rarity: "rare",
		can_inscribe_on: ["weapon"],
		passive_bonuses: {
			attack_bonus: 2,
			crit_damage_multiplier: 1.5,
		},
		effect_description:
			"Provides +2 to attack rolls and increases critical hit damage multiplier to 1.5x.",
		tags: ["sigil", "weapon", "mastery", "axe"],
		source_book: "Ascendant Bureau Armory",
		lore: "Crystallized from raw mana overflow during the catastrophic Seoul Gate Breach of Year 7.",
		flavor:
			"Shatters the illusion of safety. The death of hesitation, made manifest.",
		discovery_lore:
			"Located by a detection-type Hunter whose radar ability triggered on an otherwise empty room.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			ability: "Intelligence",
			damage_profile: "See active effect",
			lattice_interaction:
				"Inscribed using Arcane Chisel — bonds with item's mana lattice",
			stat_bonuses: {},
			special_abilities: [
				"Passive: Resistance to psychic damage",
				"Active: Automatically succeed on next ability check of a chosen type (1/long rest)",
			],
			restrictions: [
				"Socket type: armor",
				"Inscription DC: 15 (Arcane Chisel)",
				"Material cost: 1000gp",
			],
		},
		limitations: {
			uses: "Permanent while socketed",
			recharge: "Active ability recharges per rest",
			requires_attunement: false,
			conditions: [
				"Max sigils per item: 2 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 20 check or destroys the sigil",
			],
			charges: 0,
			consumable: false,
			cost: 1000,
		},
	},
	{
		id: "sigil-mastery-wand",
		name: "Sigil of the Wand Master",
		description:
			"Automatically adjusts the weapon's weight and balance to the wielder's preferences.",
		rune_type: "Combat",
		rune_category: "Weapon",
		rarity: "rare",
		can_inscribe_on: ["weapon"],
		passive_bonuses: {
			attack_bonus: 2,
			crit_damage_multiplier: 1.5,
		},
		effect_description:
			"Provides +2 to attack rolls and increases critical hit damage multiplier to 1.5x.",
		tags: ["sigil", "weapon", "mastery", "wand"],
		source_book: "Ascendant Bureau Armory",
		lore: "Found clutched in the hand of a petrified E-Rank Hunter who had been missing for three years.",
		flavor:
			"Unravels the certainty of outcomes. A beautiful catastrophe measured in milliseconds.",
		discovery_lore:
			"Dropped by a mini-boss that shouldn't have existed according to the Gate's difficulty rating.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			ability: "Sense",
			damage_profile: "See active effect",
			lattice_interaction:
				"Inscribed using Arcane Chisel — bonds with item's mana lattice",
			stat_bonuses: {},
			special_abilities: [
				"Passive: Resistance to lightning damage",
				"Active: Impose disadvantage on next attack against you (Proficiency/long rest)",
			],
			restrictions: [
				"Socket type: boots",
				"Inscription DC: 20 (Arcane Chisel)",
				"Material cost: 100gp",
			],
		},
		limitations: {
			uses: "Permanent while socketed",
			recharge: "Active ability recharges per rest",
			requires_attunement: false,
			conditions: [
				"Max sigils per item: 3 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 25 check or destroys the sigil",
			],
			charges: 0,
			consumable: false,
			cost: 100,
		},
	},
	{
		id: "sigil-essence-vigor",
		name: "Sigil of Bound Vigor",
		description:
			"Channels raw essence into a specific aspect of the user's being.",
		rune_type: "Utility",
		rune_category: "Accessory",
		rarity: "rare",
		can_inscribe_on: ["accessory"],
		passive_bonuses: {
			stat_boost_vigor: 2,
		},
		effect_description:
			"Grants a significant boost to vigor related checks and saving throws.",
		tags: ["sigil", "accessory", "essence", "vigor"],
		source_book: "Rift Ascendant Canon",
		lore: "Reconstructed from fragments scattered across seven different C-Rank dungeons.",
		flavor:
			"Absorbs the concept of distance. A testament to what Hunters have become.",
		discovery_lore:
			"Gifted by the System itself as a reward for completing a hidden quest chain.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			ability: "Sense",
			damage_profile: "See active effect",
			lattice_interaction:
				"Inscribed using Void Stylus — bonds with item's mana lattice",
			stat_bonuses: {},
			special_abilities: [
				"Passive: +5 temporary HP on short rest",
				"Active: Move 10 additional feet without provoking opportunity attacks (at will)",
			],
			restrictions: [
				"Socket type: boots",
				"Inscription DC: 14 (Void Stylus)",
				"Material cost: 50gp",
			],
		},
		limitations: {
			uses: "Permanent while socketed",
			recharge: "Active ability recharges per rest",
			requires_attunement: false,
			conditions: [
				"Max sigils per item: 1 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 19 check or destroys the sigil",
			],
			charges: 0,
			consumable: false,
			cost: 50,
		},
	},
	{
		id: "sigil-essence-haste",
		name: "Sigil of Bound Haste",
		description:
			"Channels raw essence into a specific aspect of the user's being.",
		rune_type: "Utility",
		rune_category: "Accessory",
		rarity: "rare",
		can_inscribe_on: ["accessory"],
		passive_bonuses: {
			stat_boost_haste: 2,
		},
		effect_description:
			"Grants a significant boost to haste related checks and saving throws.",
		tags: ["sigil", "accessory", "essence", "haste"],
		source_book: "Rift Ascendant Canon",
		lore: "Woven from the screams of a Gate Boss that achieved sentience moments before death.",
		flavor:
			"Fractures the silence between heartbeats. A beautiful catastrophe measured in milliseconds.",
		discovery_lore:
			"Traded by a nomadic Awakened who claimed to have no memory of acquiring it.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			ability: "Intelligence",
			damage_profile: "See active effect",
			lattice_interaction:
				"Inscribed using Crystal Engraver — bonds with item's mana lattice",
			stat_bonuses: {},
			special_abilities: [
				"Passive: Ignore difficult terrain",
				"Active: Impose disadvantage on next attack against you (Proficiency/long rest)",
			],
			restrictions: [
				"Socket type: gloves",
				"Inscription DC: 17 (Crystal Engraver)",
				"Material cost: 100gp",
			],
		},
		limitations: {
			uses: "Permanent while socketed",
			recharge: "Active ability recharges per rest",
			requires_attunement: false,
			conditions: [
				"Max sigils per item: 2 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 22 check or destroys the sigil",
			],
			charges: 0,
			consumable: false,
			cost: 100,
		},
	},
	{
		id: "sigil-essence-bravery",
		name: "Sigil of Bound Bravery",
		description:
			"Channels raw essence into a specific aspect of the user's being.",
		rune_type: "Utility",
		rune_category: "Accessory",
		rarity: "rare",
		can_inscribe_on: ["accessory"],
		passive_bonuses: {
			stat_boost_bravery: 2,
		},
		effect_description:
			"Grants a significant boost to bravery related checks and saving throws.",
		tags: ["sigil", "accessory", "essence", "bravery"],
		source_book: "Rift Ascendant Canon",
		lore: "Found clutched in the hand of a petrified E-Rank Hunter who had been missing for three years.",
		flavor:
			"Dissolves the boundary between life and death. The death of hesitation, made manifest.",
		discovery_lore:
			"Dropped by a mini-boss that shouldn't have existed according to the Gate's difficulty rating.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			ability: "Intelligence",
			damage_profile: "See active effect",
			lattice_interaction:
				"Inscribed using Rift Calligraphy Brush — bonds with item's mana lattice",
			stat_bonuses: {},
			special_abilities: [
				"Passive: Resistance to lightning damage",
				"Active: Gain advantage on next saving throw (2/short rest)",
			],
			restrictions: [
				"Socket type: boots",
				"Inscription DC: 12 (Rift Calligraphy Brush)",
				"Material cost: 1000gp",
			],
		},
		limitations: {
			uses: "Permanent while socketed",
			recharge: "Active ability recharges per rest",
			requires_attunement: false,
			conditions: [
				"Max sigils per item: 3 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 17 check or destroys the sigil",
			],
			charges: 0,
			consumable: false,
			cost: 1000,
		},
	},
	{
		id: "sigil-essence-iron-skin",
		name: "Sigil of Bound Iron-Skin",
		description:
			"Channels raw essence into a specific aspect of the user's being.",
		rune_type: "Utility",
		rune_category: "Accessory",
		rarity: "rare",
		can_inscribe_on: ["accessory"],
		passive_bonuses: {
			"stat_boost_iron-skin": 2,
		},
		effect_description:
			"Grants a significant boost to iron-skin related checks and saving throws.",
		tags: ["sigil", "accessory", "essence", "iron-skin"],
		source_book: "Rift Ascendant Canon",
		lore: "Unearthed by a mining Guild operating in the mana-saturated quarries of the Australian Outback.",
		flavor:
			"Dissolves the flow of causality. The final equation in a war without end.",
		discovery_lore:
			"Found pulsing with residual mana in the aftermath of a Gate break, half-buried in shattered concrete.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			ability: "Agility",
			damage_profile: "See active effect",
			lattice_interaction:
				"Inscribed using Rift Calligraphy Brush — bonds with item's mana lattice",
			stat_bonuses: {},
			special_abilities: [
				"Passive: +1 to attack rolls",
				"Active: Heal 2d8+2 HP as a bonus action (1/short rest)",
			],
			restrictions: [
				"Socket type: armor",
				"Inscription DC: 16 (Rift Calligraphy Brush)",
				"Material cost: 50gp",
			],
		},
		limitations: {
			uses: "Permanent while socketed",
			recharge: "Active ability recharges per rest",
			requires_attunement: false,
			conditions: [
				"Max sigils per item: 3 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 21 check or destroys the sigil",
			],
			charges: 0,
			consumable: false,
			cost: 50,
		},
	},
	{
		id: "sigil-essence-insight",
		name: "Sigil of Bound Insight",
		description:
			"Channels raw essence into a specific aspect of the user's being.",
		rune_type: "Utility",
		rune_category: "Accessory",
		rarity: "rare",
		can_inscribe_on: ["accessory"],
		passive_bonuses: {
			stat_boost_insight: 2,
		},
		effect_description:
			"Grants a significant boost to insight related checks and saving throws.",
		tags: ["sigil", "accessory", "essence", "insight"],
		source_book: "Rift Ascendant Canon",
		lore: "Stolen from a Guild vault during the Three-Day War between rival Korean Hunter factions.",
		flavor:
			"Inverts the architect's design. The final equation in a war without end.",
		discovery_lore:
			"Emerged from a Gate Boss's dissolution cloud, hovering where the creature's heart had been.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			ability: "Agility",
			damage_profile: "See active effect",
			lattice_interaction:
				"Inscribed using Shadow Quill — bonds with item's mana lattice",
			stat_bonuses: {},
			special_abilities: [
				"Passive: Cannot be surprised while conscious",
				"Active: Reduce incoming damage by 1d10 as a reaction (Proficiency/long rest)",
			],
			restrictions: [
				"Socket type: helm",
				"Inscription DC: 12 (Shadow Quill)",
				"Material cost: 50gp",
			],
		},
		limitations: {
			uses: "Permanent while socketed",
			recharge: "Active ability recharges per rest",
			requires_attunement: false,
			conditions: [
				"Max sigils per item: 3 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 17 check or destroys the sigil",
			],
			charges: 0,
			consumable: false,
			cost: 50,
		},
	},
];
