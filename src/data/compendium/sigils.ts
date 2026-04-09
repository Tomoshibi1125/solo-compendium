import type { CompendiumSigil as SigilCompendiumEntry } from "@/types/compendium";

/**
 * Sigils Compendium - Authoritative Rift Ascendant Library
 *
 * Sigils are equipment-based modifiers inscribed onto Weapons, Armor, and Accessories.
 * They provide passive bonuses or active abilities while the gear is equipped.
 */

export const sigils: SigilCompendiumEntry[] = [
	// --- WEAPON SIGILS (Primary Offensive) ---
	{
		id: "sigil-sharpness-1",
		name: "Sigil of Sharpness",
		description:
			"A micro-etched rune that hones the edge of a blade using high-frequency mana vibrations.",
		rarity: "common",
		can_inscribe_on: ["weapon"],
		passive_bonuses: { attack_bonus: 1, damage_bonus: 1 },
		effect_description:
			"Grants +1 to attack and damage rolls with this weapon.",
		tags: ["sigil", "weapon", "offensive"],
		source_book: "Ascendant Bureau Armory",
	},
	{
		id: "sigil-impact-1",
		name: "Sigil of Impact",
		description: "Increases the kinetic weight of the weapon upon impact.",
		rarity: "common",
		can_inscribe_on: ["weapon"],
		passive_bonuses: { damage_bonus: 2 },
		effect_description: "Grants +2 to damage rolls with this weapon.",
		tags: ["sigil", "weapon", "offensive"],
		source_book: "Ascendant Bureau Armory",
	},
	{
		id: "sigil-bleeding-1",
		name: "Sigil of Laceration",
		description:
			"Causes the weapon to leave jagged mana-wounds that resist closing.",
		rarity: "uncommon",
		can_inscribe_on: ["weapon"],
		passive_bonuses: { critical_range: 1 },
		effect_description:
			"Increases critical hit range by 1 (e.g., 20 becomes 19-20).",
		tags: ["sigil", "weapon", "offensive"],
		source_book: "Ascendant Bureau Armory",
	},
	{
		id: "sigil-fire-1",
		name: "Sigil of the Hearth-Fire",
		description:
			"Imbues the weapon with a flickering orange glow of low-grade thermal energy.",
		rarity: "uncommon",
		can_inscribe_on: ["weapon"],
		passive_bonuses: { fire_damage: "1d4" },
		effect_description: "Deals an extra 1d4 fire damage on hit.",
		tags: ["sigil", "weapon", "fire"],
		source_book: "Ascendant Bureau Armory",
	},
	{
		id: "sigil-frost-1",
		name: "Sigil of the Arctic Breath",
		description: "Coats the weapon in a thin layer of frost that never melts.",
		rarity: "uncommon",
		can_inscribe_on: ["weapon"],
		passive_bonuses: { cold_damage: "1d4" },
		effect_description: "Deals an extra 1d4 cold damage on hit.",
		tags: ["sigil", "weapon", "cold"],
		source_book: "Ascendant Bureau Armory",
	},
	{
		id: "sigil-lightning-1",
		name: "Sigil of the Storm-Spark",
		description:
			"Arks of electricity occasionally dance across the weapon's surface.",
		rarity: "uncommon",
		can_inscribe_on: ["weapon"],
		passive_bonuses: { lightning_damage: "1d4" },
		effect_description: "Deals an extra 1d4 lightning damage on hit.",
		tags: ["sigil", "weapon", "lightning"],
		source_book: "Ascendant Bureau Armory",
	},
	{
		id: "sigil-holy-1",
		name: "Sigil of Divine Radiance",
		description:
			"A pure white sigil that glows brighter in the presence of shadow creatures.",
		rarity: "rare",
		can_inscribe_on: ["weapon"],
		passive_bonuses: { radiant_damage: "1d6" },
		effect_description: "Deals an extra 1d6 radiant damage on hit.",
		tags: ["sigil", "weapon", "radiant"],
		source_book: "Holylight Cathedral",
	},
	{
		id: "sigil-shadow-1",
		name: "Sigil of Umbral Depth",
		description:
			"Consumes light around the weapon, making it look like a void in reality.",
		rarity: "rare",
		can_inscribe_on: ["weapon"],
		passive_bonuses: { necrotic_damage: "1d6" },
		effect_description: "Deals an extra 1d6 necrotic damage on hit.",
		tags: ["sigil", "weapon", "necrotic"],
		source_book: "Shadow Legion Archives",
	},

	// --- ARMOR SIGILS (Primary Defensive) ---
	{
		id: "sigil-ward-1",
		name: "Sigil of the Bastion",
		description:
			"Denses the atmospheric mana around the wearer, creating a subtle kinetic barrier.",
		rarity: "common",
		can_inscribe_on: ["armor", "shield"],
		passive_bonuses: { ac_bonus: 1 },
		effect_description: "Provides +1 to Armor Class.",
		tags: ["sigil", "armor", "defensive"],
		source_book: "Ascendant Bureau Armory",
	},
	{
		id: "sigil-fortitude-1",
		name: "Sigil of the Iron Heart",
		description:
			"Channels mana into the wearer's biological systems to reinforce vital organs.",
		rarity: "common",
		can_inscribe_on: ["armor"],
		passive_bonuses: { hp_bonus: 5 },
		effect_description: "Increases maximum HP by 5.",
		tags: ["sigil", "armor", "vitality"],
		source_book: "Ascendant Bureau Armory",
	},
	{
		id: "sigil-res-fire-1",
		name: "Sigil of the Salamander",
		description:
			"Absorbs thermal energy and dissipates it into the environment.",
		rarity: "uncommon",
		can_inscribe_on: ["armor"],
		passive_bonuses: { resistance_fire: true },
		effect_description: "Grants resistance to fire damage.",
		tags: ["sigil", "armor", "protection"],
		source_book: "Ascendant Bureau Armory",
	},
	{
		id: "sigil-res-cold-1",
		name: "Sigil of the Winter-Coat",
		description:
			"Maintains a constant internal temperature despite external cold.",
		rarity: "uncommon",
		can_inscribe_on: ["armor"],
		passive_bonuses: { resistance_cold: true },
		effect_description: "Grants resistance to cold damage.",
		tags: ["sigil", "armor", "protection"],
		source_book: "Ascendant Bureau Armory",
	},
	{
		id: "sigil-res-lightning-1",
		name: "Sigil of the Grounding-Wire",
		description:
			"Diverts electrical currents safely away from the wearer's body.",
		rarity: "uncommon",
		can_inscribe_on: ["armor"],
		passive_bonuses: { resistance_lightning: true },
		effect_description: "Grants resistance to lightning damage.",
		tags: ["sigil", "armor", "protection"],
		source_book: "Ascendant Bureau Armory",
	},
	{
		id: "sigil-mobility-1",
		name: "Sigil of the Zephyr",
		description:
			"Lightens the wearer's load by creating a slight upward mana-lift.",
		rarity: "uncommon",
		can_inscribe_on: ["armor", "accessory"],
		passive_bonuses: { speed_bonus: 5 },
		effect_description: "Increases movement speed by 5 feet.",
		tags: ["sigil", "armor", "utility"],
		source_book: "Ascendant Bureau Armory",
	},

	// --- ACCESSORY SIGILS (Stat & Utility) ---
	{
		id: "sigil-intel-1",
		name: "Sigil of the Clear-Mind",
		description:
			"Optimizes synaptic pathways for faster processing and recall.",
		rarity: "rare",
		can_inscribe_on: ["accessory"],
		passive_bonuses: { intelligence_mod: 1 },
		effect_description: "Increases Intelligence by 1.",
		tags: ["sigil", "accessory", "intelligence"],
		source_book: "Academy of High Magic",
	},
	{
		id: "sigil-sense-1",
		name: "Sigil of the Eagle-Eye",
		description: "sharpens visual acuity and mana-sensing capabilities.",
		rarity: "rare",
		can_inscribe_on: ["accessory"],
		passive_bonuses: { sense_mod: 1 },
		effect_description: "Increases Sense by 1.",
		tags: ["sigil", "accessory", "sense"],
		source_book: "Academy of High Magic",
	},
	{
		id: "sigil-agility-1",
		name: "Sigil of the Feline-Grace",
		description: "Enhances neuromuscular coordination and reflexive response.",
		rarity: "rare",
		can_inscribe_on: ["accessory"],
		passive_bonuses: { agility_mod: 1 },
		effect_description: "Increases Agility by 1.",
		tags: ["sigil", "accessory", "agility"],
		source_book: "Academy of High Magic",
	},
	{
		id: "sigil-strength-1",
		name: "Sigil of the Titan-Grip",
		description: "Reinforces skeletal structure and muscle fiber density.",
		rarity: "rare",
		can_inscribe_on: ["accessory"],
		passive_bonuses: { strength_mod: 1 },
		effect_description: "Increases Strength by 1.",
		tags: ["sigil", "accessory", "strength"],
		source_book: "Academy of High Magic",
	},
	{
		id: "sigil-presence-1",
		name: "Sigil of the Commander",
		description:
			"Radiates an aura of authority and calm that others instinctively follow.",
		rarity: "rare",
		can_inscribe_on: ["accessory"],
		passive_bonuses: { presence_mod: 1 },
		effect_description: "Increases Presence by 1.",
		tags: ["sigil", "accessory", "presence"],
		source_book: "Academy of High Magic",
	},
	{
		id: "sigil-mana-regen-1",
		name: "Sigil of the Flowing-Lattice",
		description:
			"Slowly draws mana from the environment to replenish the user's reserves.",
		rarity: "very_rare",
		can_inscribe_on: ["accessory"],
		passive_bonuses: { mana_regen: 1 },
		effect_description: "Regenerates 1 additional Mana point per turn.",
		tags: ["sigil", "accessory", "mana"],
		source_book: "Academy of High Magic",
	},

	// --- EPIC / LEGENDARY SIGILS (Unique Effects) ---
	{
		id: "sigil-shadow-king",
		name: "Sigil of the Umbral Monarch",
		description:
			"The rarest sigil found in the deepest rifts. It pulses with a dark, commanding power.",
		rarity: "legendary",
		can_inscribe_on: ["weapon"],
		passive_bonuses: { necrotic_damage: "2d8", shadow_soldier_lord: true },
		effect_description:
			"Deals 2d8 extra necrotic damage and allows you to command one additional Shadow Soldier.",
		tags: ["sigil", "weapon", "legendary", "necrotic"],
		source_book: "Shadow Legion Archives",
	},
	{
		id: "sigil-immortality",
		name: "Sigil of the Eternal Phoenix",
		description:
			"Forged from the heart of a solar flare. It refuses to let the wearer expire.",
		rarity: "legendary",
		can_inscribe_on: ["armor"],
		passive_bonuses: { auto_stabilize: true, fire_immunity: true },
		effect_description:
			"Grants immunity to fire damage and automatically stabilizes you if you fall to 0 HP.",
		tags: ["sigil", "armor", "legendary", "protection"],
		source_book: "Rift Ascendant Canon",
	},

	// --- ADDITIONAL MASS VARIATIONS ---
	// (Adding more for breadth as requested)
	...[
		"Fire",
		"Frost",
		"Lightning",
		"Acid",
		"Poison",
		"Thunder",
		"Force",
		"Psychic",
	].map((element, _index) => ({
		id: `sigil-res-${element.toLowerCase()}-2`,
		name: `Sigil of Greater ${element} Guard`,
		description: `Advanced protection against ${element.toLowerCase()} and environmental hazards.`,
		rune_type: "Defense",
		rune_category: "Armor",
		rarity: "rare",
		can_inscribe_on: ["armor"],
		passive_bonuses: {
			[`resistance_${element.toLowerCase()}`]: true,
			saving_throw_bonus: 1,
		},
		effect_description: `Grants resistance to ${element.toLowerCase()} damage and +1 to all saving throws.`,
		tags: ["sigil", "armor", "protection", element.toLowerCase()],
		source_book: "Ascendant Bureau Armory",
	})),

	...["Blade", "Mallet", "Bow", "Spear", "Axe", "Wand"].map(
		(weaponType, _index) => ({
			id: `sigil-mastery-${weaponType.toLowerCase()}`,
			name: `Sigil of the ${weaponType} Master`,
			description: `Automatically adjusts the weapon's weight and balance to the wielder's preferences.`,
			rune_type: "Combat",
			rune_category: "Weapon",
			rarity: "rare",
			can_inscribe_on: ["weapon"],
			passive_bonuses: { attack_bonus: 2, crit_damage_multiplier: 1.5 },
			effect_description: `Provides +2 to attack rolls and increases critical hit damage multiplier to 1.5x.`,
			tags: ["sigil", "weapon", "mastery", weaponType.toLowerCase()],
			source_book: "Ascendant Bureau Armory",
		}),
	),

	...["Vigor", "Haste", "Bravery", "Iron-Skin", "Insight"].map(
		(focus, _index) => ({
			id: `sigil-essence-${focus.toLowerCase()}`,
			name: `Sigil of Bound ${focus}`,
			description: `Channels raw essence into a specific aspect of the user's being.`,
			rune_type: "Utility",
			rune_category: "Accessory",
			rarity: "rare",
			can_inscribe_on: ["accessory"],
			passive_bonuses: { [`stat_boost_${focus.toLowerCase()}`]: 2 },
			effect_description: `Grants a significant boost to ${focus.toLowerCase()} related checks and saving throws.`,
			tags: ["sigil", "accessory", "essence", focus.toLowerCase()],
			source_book: "Rift Ascendant Canon",
		}),
	),
];
