import type { CompendiumSigil } from "../../types/compendium";

export const sigils: CompendiumSigil[] = [
	{
		id: "sigil-sharpness-1",
		name: "Sigil of the Razor Wind",
		description:
			"An ancient dwarven rune that sharpens a blade continuously with ambient wind mana.",
		rarity: "common",
		can_inscribe_on: ["weapon"],
		effect_description:
			"Passive: Ignores the first 2 points of a target's damage reduction or physical resistance.",
		tags: ["sigil", "weapon", "offensive", "physical"],
		source_book: "Ascendant Bureau Armory",
		lore: {
			origin:
				"Forged by the Bureau's arcane division to combat carapace-armored monsters encountered in C-Rank gates.",
			history: "Its true history remains a heavily guarded Bureau secret.",
			curse: "Mumbles ominous whispers into the user's mind.",
			personality: "Deeply territorial.",
			current_owner: "Circulating in the underground Hunter markets.",
			prior_owners: ["The First Ascendant"],
		},
		flavor: "Cut through the noise.",
		mechanics: {
			action_type: "Passive (socketed)",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None",
			special_abilities: [
				"Passive: Grants a +1 bonus to attack rolls. Does not stack with existing +X enhancements.",
			],
			restrictions: [
				"Socket type: weapon",
				"Inscription DC: 14",
				"Material cost: 50gp",
			],
			damage_profile: "1d6",
			condition: "Blindness",
		},
		limitations: {
			uses: "Permanent",
			requires_attunement: false,
			consumable: false,
			cost: 50,
		},
		passive_bonuses: {
			effect: "Enhances the wielder's resilience.",
			combat_advantage: "Deals 1d6 physical or magical damage on hit.",
		},
		discovery_lore: "Traded for thirty vials of wyvern blood.",
		effects: {
			primary: "Deals 1d6 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Blindness for 1 round.",
		},
	},
	{
		id: "sigil-impact-1",
		name: "Sigil of the Crushing Mountain",
		description:
			"Infuses the weapon with earth mana, making it strike with the weight of falling rock.",
		rarity: "common",
		can_inscribe_on: ["weapon"],
		effect_description:
			"Passive: Whenever you score a critical hit, the force knocks the target prone if they are Large or smaller.",
		tags: ["sigil", "weapon", "force"],
		source_book: "Ascendant Bureau Armory",
		lore: {
			origin:
				"Salvaged from crushed gravity-crystals found in the Ruins of the Old World.",
			history: "Its true history remains a heavily guarded Bureau secret.",
			curse: "Draws the ire of nearby low-level fiends.",
			personality: "Chaotic and unpredictable.",
			current_owner: "Lost to the depths of a high-tier dungeon.",
			prior_owners: ["Warden Thorne", "A-Rank Hunter 'Ghost'"],
		},
		flavor: "The weight of the earth.",
		mechanics: {
			action_type: "Passive (socketed)",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None",
			special_abilities: [
				"Passive: Re-roll 1s on damage dice for bludgeoning weapons.",
			],
			restrictions: [
				"Socket type: weapon",
				"Inscription DC: 15",
				"Material cost: 75gp",
			],
			damage_profile: "2d6",
			condition: "Lethargy",
		},
		limitations: {
			uses: "Permanent",
			requires_attunement: false,
			consumable: false,
			cost: 75,
		},
		passive_bonuses: {
			effect: "Enhances the wielder's resilience.",
			combat_advantage: "Deals 2d6 physical or magical damage on hit.",
		},
		discovery_lore: "Recovered after a massive Guild raid.",
		effects: {
			primary: "Deals 2d6 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Lethargy for 1 round.",
		},
	},
	{
		id: "sigil-bleeding-1",
		name: "Sigil of the Crimson Weeping",
		description:
			"A jagged, thorn-like glyph that forces ambient mana to violently reject biological tissue.",
		rarity: "uncommon",
		can_inscribe_on: ["weapon"],
		effect_description:
			"Passive: Slashing or piercing damage inflicted by this weapon causes the target to bleed, losing 1d4 HP at the start of their next turn.",
		tags: ["sigil", "weapon", "necrotic"],
		source_book: "Shadow Legion Archives",
		lore: {
			origin:
				"Outlawed in seventy-two countries due to its horrific lingering effects on unawakened tissue.",
			history: "Its true history remains a heavily guarded Bureau secret.",
			curse: "Mumbles ominous whispers into the user's mind.",
			personality: "Sorrowful, weeping mana.",
			current_owner: "Circulating in the underground Hunter markets.",
			prior_owners: ["An unknown rogue Awakened"],
		},
		flavor: "They won't stop bleeding.",
		mechanics: {
			action_type: "Passive (socketed)",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None",
			special_abilities: [
				"Passive: Extends duration of lingering damage effects caused by this weapon by 1 round.",
			],
			restrictions: [
				"Socket type: weapon",
				"Inscription DC: 16",
				"Material cost: 200gp",
			],
			damage_profile: "2d6",
			condition: "Stunning",
		},
		limitations: {
			uses: "Permanent",
			requires_attunement: false,
			consumable: false,
			cost: 200,
		},
		passive_bonuses: {
			effect: "Enhances the wielder's resilience.",
			combat_advantage: "Deals 2d6 physical or magical damage on hit.",
		},
		discovery_lore: "Recovered after a massive Guild raid.",
		effects: {
			primary: "Deals 2d6 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Stunning for 1 round.",
		},
	},
	{
		id: "sigil-fire-1",
		name: "Sigil of the Salamander's Breath",
		description:
			"Bathes the weapon in magical flames drawn directly from the Elemental Plane of Fire.",
		rarity: "uncommon",
		can_inscribe_on: ["weapon"],
		effect_description:
			"Active: Once per short rest, convert all physical damage of your next attack into Fire damage, bypassing standard resistance.",
		tags: ["sigil", "weapon", "fire"],
		source_book: "Academy of High Magic",
		lore: {
			origin:
				"Refined from the ashes of a Fire Drake's heart extracted during a massive raid in Johannesburg.",
			history: "Its true history remains a heavily guarded Bureau secret.",
			curse: "Mumbles ominous whispers into the user's mind.",
			personality: "Proud and unyielding.",
			current_owner: "Heavily guarded in the Bureau's Armory.",
			prior_owners: ["The First Ascendant"],
		},
		flavor: "Burn away the impurities.",
		mechanics: {
			action_type: "Bonus Action",
			type: "Sigil",
			duration: "Instantaneous",
			action: "Bonus Action to ignite",
			special_abilities: [
				"Active: Overloads the blade to deal an extra 2d6 Fire damage (1/short rest).",
			],
			restrictions: [
				"Socket type: weapon",
				"Inscription DC: 15",
				"Material cost: 150gp",
			],
			damage_profile: "1d12",
			condition: "Lethargy",
		},
		limitations: {
			uses: "1/short rest",
			requires_attunement: false,
			consumable: false,
			cost: 150,
		},
		passive_bonuses: {
			effect: "Enhances the wielder's resilience.",
			combat_advantage: "Deals 1d12 physical or magical damage on hit.",
		},
		discovery_lore: "Unearthed from the ashes of a collapsed Rift.",
		effects: {
			primary: "Deals 1d12 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Lethargy for 1 round.",
		},
	},
	{
		id: "sigil-frost-1",
		name: "Sigil of the Winter Court",
		description:
			"The weapon leaves magical frost trails in the air, chilling the blood of those it strikes.",
		rarity: "uncommon",
		can_inscribe_on: ["weapon"],
		effect_description:
			"Passive: Hitting an enemy reduces their movement speed by 5 feet until the end of their next turn. Does not stack.",
		tags: ["sigil", "weapon", "cold"],
		source_book: "Ascendant Bureau Armory",
		lore: {
			origin:
				"Engineered in the Siberian dead-zones where frost magic is key to survival.",
			history: "Its true history remains a heavily guarded Bureau secret.",
			curse: "Occasionally burns the skin with raw mana.",
			personality: "Dormant and silent.",
			current_owner: "Held by a rogue guild.",
			prior_owners: ["Guild Master Kael"],
		},
		flavor: "The chill of the grave.",
		mechanics: {
			action_type: "Passive (socketed)",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None",
			special_abilities: [
				"Passive: Grants the user advantage on survival checks against extreme heat environmental hazards while drawn.",
			],
			restrictions: [
				"Socket type: weapon",
				"Inscription DC: 15",
				"Material cost: 150gp",
			],
			damage_profile: "2d4",
			condition: "Blindness",
		},
		limitations: {
			uses: "Permanent",
			requires_attunement: false,
			consumable: false,
			cost: 150,
		},
		passive_bonuses: {
			effect: "Enhances the wielder's resilience.",
			combat_advantage: "Deals 2d4 physical or magical damage on hit.",
		},
		discovery_lore: "Found pinned to a monstrous corpse.",
		effects: {
			primary: "Deals 2d4 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Blindness for 1 round.",
		},
	},
	{
		id: "sigil-lightning-1",
		name: "Sigil of the Thunder-Bird",
		description:
			"Sparks of storm mana constantly arc across the weapon's surface.",
		rarity: "uncommon",
		can_inscribe_on: ["weapon"],
		effect_description:
			"Active: If you hit the same target twice in one turn, release a shockwave dealing 1d8 lightning damage to an adjacent enemy.",
		tags: ["sigil", "weapon", "lightning"],
		source_book: "Ascendant Bureau Armory",
		lore: {
			origin: "A traditional shamanic rune adapted by modern Guild enchanters.",
			history: "Its true history remains a heavily guarded Bureau secret.",
			curse: "Erodes non-magical clothing over time.",
			personality: "Dormant and silent.",
			current_owner: "Lost to the depths of a high-tier dungeon.",
			prior_owners: ["Guild Master Kael"],
		},
		flavor: "The storm's fury.",
		mechanics: {
			action_type: "Passive trigger",
			type: "Sigil",
			duration: "Instantaneous",
			action: "None",
			special_abilities: [
				"Passive: Weapon emits bright light in a 5-foot radius and dim light for 5 more feet.",
			],
			restrictions: [
				"Socket type: weapon",
				"Inscription DC: 15",
				"Material cost: 150gp",
			],
			damage_profile: "1d6",
			condition: "Lethargy",
		},
		limitations: {
			uses: "Permanent",
			requires_attunement: false,
			consumable: false,
			cost: 150,
		},
		passive_bonuses: {
			effect: "Enhances the wielder's resilience.",
			combat_advantage: "Deals 1d6 physical or magical damage on hit.",
		},
		discovery_lore: "Recovered after a massive Guild raid.",
		effects: {
			primary: "Deals 1d6 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Lethargy for 1 round.",
		},
	},
	{
		id: "sigil-holy-1",
		name: "Sigil of the Radiant Truth",
		description:
			"A blessed inlay of pure silver that resonates aggressively with corrupted or necrotic essence.",
		rarity: "rare",
		can_inscribe_on: ["weapon"],
		effect_description:
			"Passive: Against Undead or Shadow-type anomalies, the weapon's damage die increases by one step (e.g., 1d6 becomes 1d8).",
		tags: ["sigil", "weapon", "radiant"],
		source_book: "Holylight Cathedral",
		lore: {
			origin:
				"Sanctified by the High Priests of the Cathedral to purge the encroaching darkness of S-Rank gates.",
			history: "Its true history remains a heavily guarded Bureau secret.",
			curse: "Causes the user's shadow to sometimes move independently.",
			personality: "Dormant and silent.",
			current_owner: "Heavily guarded in the Bureau's Armory.",
			prior_owners: ["Archmage Valerius"],
		},
		flavor: "The light burns away the rot.",
		mechanics: {
			action_type: "Passive (socketed)",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None",
			special_abilities: [
				"Active: Flare the weapon as a reaction to blind a target entering melee range (DC 14 Sense, 1/long rest).",
			],
			restrictions: [
				"Socket type: weapon",
				"Inscription DC: 18",
				"Material cost: 500gp",
			],
			damage_profile: "2d4",
			condition: "Stunning",
		},
		limitations: {
			uses: "Permanent passive, 1/long rest active",
			requires_attunement: false,
			consumable: false,
			cost: 500,
		},
		passive_bonuses: {
			effect: "Enhances the wielder's resilience.",
			combat_advantage: "Deals 2d4 physical or magical damage on hit.",
		},
		discovery_lore: "Found pinned to a monstrous corpse.",
		effects: {
			primary: "Deals 2d4 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Stunning for 1 round.",
		},
	},
	{
		id: "sigil-shadow-1",
		name: "Sigil of the Void-Walker",
		description:
			"Absorbs light in its immediate vicinity, rendering the weapon visually blurry and silent.",
		rarity: "rare",
		can_inscribe_on: ["weapon"],
		effect_description:
			"Passive: Your attacks with this weapon make no sound and give off no light. You do not break stealth when drawing it.",
		tags: ["sigil", "weapon", "necrotic", "stealth"],
		source_book: "Shadow Legion Archives",
		lore: {
			origin:
				"Carved from the obsidian bone shards of stealth-type assassins from the Shadow Domain.",
			history: "Its true history remains a heavily guarded Bureau secret.",
			curse: "Induces temporary colorblindness after use.",
			personality: "Proud and unyielding.",
			current_owner: "Currently unaccounted for.",
			prior_owners: ["The Obsidian Vanguard"],
		},
		flavor: "Silence is a weapon.",
		mechanics: {
			action_type: "Passive (socketed)",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None",
			special_abilities: [
				"Active: Once per short rest, deal 2d6 extra Necrotic damage on an attack made with combat advantage.",
			],
			restrictions: [
				"Socket type: weapon",
				"Inscription DC: 18",
				"Material cost: 500gp",
			],
			damage_profile: "1d12",
			condition: "Fear",
		},
		limitations: {
			uses: "Active 1/short rest",
			requires_attunement: false,
			consumable: false,
			cost: 500,
		},
		passive_bonuses: {
			effect: "Enhances the wielder's resilience.",
			combat_advantage: "Deals 1d12 physical or magical damage on hit.",
		},
		discovery_lore: "Traded for thirty vials of wyvern blood.",
		effects: {
			primary: "Deals 1d12 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Fear for 1 round.",
		},
	},
	{
		id: "sigil-ward-1",
		name: "Sigil of the Aegis",
		description: "A circular lattice of force mana that repels striking blows.",
		rarity: "common",
		can_inscribe_on: ["armor", "shield"],
		effect_description:
			"Passive: Reduces damage taken from ranged weapon attacks by 3.",
		tags: ["sigil", "armor", "defensive"],
		source_book: "Ascendant Bureau Armory",
		lore: {
			origin:
				"Standard issue for Guild operatives facing goblin archers and magical artillery.",
			history: "Its true history remains a heavily guarded Bureau secret.",
			curse: "Induces temporary colorblindness after use.",
			personality: "Hungry for ambient magic.",
			current_owner: "Lost to the depths of a high-tier dungeon.",
			prior_owners: ["An unknown rogue Awakened"],
		},
		flavor: "The shield holds.",
		mechanics: {
			action_type: "Passive (socketed)",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None",
			special_abilities: [
				"Passive: Grants a permanent +1 AC against attacks of opportunity.",
			],
			restrictions: [
				"Socket type: armor",
				"Inscription DC: 13",
				"Material cost: 100gp",
			],
			damage_profile: "2d6",
			condition: "Fear",
		},
		limitations: {
			uses: "Permanent",
			requires_attunement: false,
			consumable: false,
			cost: 100,
		},
		passive_bonuses: {
			effect: "Enhances the wielder's resilience.",
			combat_advantage: "Deals 2d6 physical or magical damage on hit.",
		},
		discovery_lore: "Unearthed from the ashes of a collapsed Rift.",
		effects: {
			primary: "Deals 2d6 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Fear for 1 round.",
		},
	},
	{
		id: "sigil-fortitude-1",
		name: "Sigil of the Unyielding",
		description:
			"Taps into the bearer's mana core to subtly reinforce armor integrity when they are close to death.",
		rarity: "common",
		can_inscribe_on: ["armor"],
		effect_description:
			"Passive: While below 50% max HP, you gain a +1 bonus to Armor Class.",
		tags: ["sigil", "armor", "vitality"],
		source_book: "Ascendant Bureau Armory",
		lore: {
			origin:
				"Developed by healers attempting to keep critically wounded Hunters alive long enough for Evacuation.",
			history: "Its true history remains a heavily guarded Bureau secret.",
			curse: "Occasionally burns the skin with raw mana.",
			personality: "Dormant and silent.",
			current_owner: "Currently unaccounted for.",
			prior_owners: ["The First Ascendant"],
		},
		flavor: "Hold the line.",
		mechanics: {
			action_type: "Passive (socketed)",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None",
			special_abilities: [
				"Active: Gain temporary HP equal to double your level as a reaction when taking damage (1/long rest).",
			],
			restrictions: [
				"Socket type: armor",
				"Inscription DC: 14",
				"Material cost: 200gp",
			],
			damage_profile: "2d8",
			condition: "Fear",
		},
		limitations: {
			uses: "Passive / Active 1/long rest",
			requires_attunement: false,
			consumable: false,
			cost: 200,
		},
		passive_bonuses: {
			effect: "Enhances the wielder's resilience.",
			combat_advantage: "Deals 2d8 physical or magical damage on hit.",
		},
		discovery_lore: "Traded for thirty vials of wyvern blood.",
		effects: {
			primary: "Deals 2d8 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Fear for 1 round.",
		},
	},
	{
		id: "sigil-res-fire-1",
		name: "Sigil of the Frost-Ward",
		description:
			"A rune that continually absorbs and safely extinguishes ambient heat.",
		rarity: "uncommon",
		can_inscribe_on: ["armor"],
		effect_description: "Passive: Reduces all Fire damage taken by 5.",
		tags: ["sigil", "armor", "protection"],
		source_book: "Ascendant Bureau Armory",
		lore: {
			origin:
				"Invented after a tragic eruption of a Red Gate composed of volcanic anomalies.",
			history: "Its true history remains a heavily guarded Bureau secret.",
			curse: "Leaves a lingering smell of ozone and ash.",
			personality: "Hungry for ambient magic.",
			current_owner: "Heavily guarded in the Bureau's Armory.",
			prior_owners: ["Warden Thorne", "A-Rank Hunter 'Ghost'"],
		},
		flavor: "Cooler heads prevail.",
		mechanics: {
			action_type: "Passive (socketed)",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None",
			special_abilities: [
				"Passive: You are immune to igniting from mundane or low-grade magical fire.",
			],
			restrictions: [
				"Socket type: armor",
				"Inscription DC: 16",
				"Material cost: 300gp",
			],
			damage_profile: "2d8",
			condition: "Fear",
		},
		limitations: {
			uses: "Permanent",
			requires_attunement: false,
			consumable: false,
			cost: 300,
		},
		passive_bonuses: {
			effect: "Enhances the wielder's resilience.",
			combat_advantage: "Deals 2d8 physical or magical damage on hit.",
		},
		discovery_lore: "Discovered encoded in an ancient grimoire.",
		effects: {
			primary: "Deals 2d8 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Fear for 1 round.",
		},
	},
	{
		id: "sigil-res-cold-1",
		name: "Sigil of the Hearth-Fire",
		description:
			"Generates an invisible, hyper-localized thermal blanket across the armor's surface using innate mana.",
		rarity: "uncommon",
		can_inscribe_on: ["armor"],
		effect_description: "Passive: Reduces all Cold damage taken by 5.",
		tags: ["sigil", "armor", "protection"],
		source_book: "Ascendant Bureau Armory",
		lore: {
			origin:
				"Favored by hunters operating in the Siberian outposts, where freezing to death is a greater threat than monsters.",
			history: "Its true history remains a heavily guarded Bureau secret.",
			curse: "Erodes non-magical clothing over time.",
			personality: "Chaotic and unpredictable.",
			current_owner: "Currently unaccounted for.",
			prior_owners: ["Archmage Valerius"],
		},
		flavor: "The cold will not claim me.",
		mechanics: {
			action_type: "Passive (socketed)",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None",
			special_abilities: [
				"Passive: Immune to negative environmental effects of extreme cold weather.",
			],
			restrictions: [
				"Socket type: armor",
				"Inscription DC: 16",
				"Material cost: 300gp",
			],
			damage_profile: "3d6",
			condition: "Fear",
		},
		limitations: {
			uses: "Permanent",
			requires_attunement: false,
			consumable: false,
			cost: 300,
		},
		passive_bonuses: {
			effect: "Enhances the wielder's resilience.",
			combat_advantage: "Deals 3d6 physical or magical damage on hit.",
		},
		discovery_lore: "Recovered after a massive Guild raid.",
		effects: {
			primary: "Deals 3d6 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Fear for 1 round.",
		},
	},
	{
		id: "sigil-res-lightning-1",
		name: "Sigil of the Grounded Soul",
		description:
			"A defensive ward that absorbs magical lightning and dissipates it harmlessly.",
		rarity: "uncommon",
		can_inscribe_on: ["armor"],
		effect_description: "Passive: Reduces all Lightning damage taken by 5.",
		tags: ["sigil", "armor", "protection"],
		source_book: "Ascendant Bureau Armory",
		lore: {
			origin: "Built by reverse-engineering the scales of the Storm Wyvern.",
			history: "Its true history remains a heavily guarded Bureau secret.",
			curse: "Leaves a lingering smell of ozone and ash.",
			personality: "Proud and unyielding.",
			current_owner: "Heavily guarded in the Bureau's Armory.",
			prior_owners: ["Warden Thorne", "A-Rank Hunter 'Ghost'"],
		},
		flavor: "The storm breaks upon me.",
		mechanics: {
			action_type: "Passive (socketed)",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None",
			special_abilities: [
				"Passive: Advantage on saves against being Paralyzed by electrical attacks.",
			],
			restrictions: [
				"Socket type: armor",
				"Inscription DC: 16",
				"Material cost: 300gp",
			],
			damage_profile: "4d10",
			condition: "Lethargy",
		},
		limitations: {
			uses: "Permanent",
			requires_attunement: false,
			consumable: false,
			cost: 300,
		},
		passive_bonuses: {
			effect: "Enhances the wielder's resilience.",
			combat_advantage: "Deals 4d10 physical or magical damage on hit.",
		},
		discovery_lore: "Found pinned to a monstrous corpse.",
		effects: {
			primary: "Deals 4d10 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Lethargy for 1 round.",
		},
	},
	{
		id: "sigil-mobility-1",
		name: "Sigil of the Zephyr's Tread",
		description:
			"Imbues boots or armor with wind magic, making the wearer's footsteps unnaturally light.",
		rarity: "uncommon",
		can_inscribe_on: ["armor", "boots"],
		effect_description:
			"Passive: You ignore difficult terrain penalties created by rubble or natural ground.",
		tags: ["sigil", "armor", "utility"],
		source_book: "Ascendant Bureau Armory",
		lore: {
			origin: "An agile enhancement favored by the Guild's scouting corps.",
			history: "Its true history remains a heavily guarded Bureau secret.",
			curse: "Leaves a lingering smell of ozone and ash.",
			personality: "Dormant and silent.",
			current_owner: "Circulating in the underground Hunter markets.",
			prior_owners: ["Guild Master Kael"],
		},
		flavor: "Weightless steps.",
		mechanics: {
			action_type: "Passive (socketed)",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None",
			special_abilities: [
				"Active: Increase jumping distance by 10 feet for one minute (1/short rest).",
			],
			restrictions: [
				"Socket type: boots/armor",
				"Inscription DC: 15",
				"Material cost: 400gp",
			],
			damage_profile: "3d12 + 6",
			condition: "Lethargy",
		},
		limitations: {
			uses: "Permanent passive, active 1/short rest",
			requires_attunement: false,
			consumable: false,
			cost: 400,
		},
		passive_bonuses: {
			effect: "Enhances the wielder's resilience.",
			combat_advantage: "Deals 3d12 + 6 physical or magical damage on hit.",
		},
		discovery_lore: "Discovered encoded in an ancient grimoire.",
		effects: {
			primary: "Deals 3d12 + 6 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Lethargy for 1 round.",
		},
	},
	{
		id: "sigil-intel-1",
		name: "Sigil of the Archmage's Clarity",
		description:
			"Clears the mind of distraction, focusing the wearer's mana into pure deductive power.",
		rarity: "rare",
		can_inscribe_on: ["accessory", "helmet"],
		effect_description:
			"Passive: You have advantage on Intelligence (Investigation) checks to identify enemy weaknesses.",
		tags: ["sigil", "accessory", "intelligence"],
		source_book: "Academy of High Magic",
		lore: {
			origin:
				"Created by a mage attempting to decode the language of the Rifts.",
			history: "Its true history remains a heavily guarded Bureau secret.",
			curse: "Induces temporary colorblindness after use.",
			personality: "Aggressive and volatile.",
			current_owner: "Heavily guarded in the Bureau's Armory.",
			prior_owners: ["Guild Master Kael"],
		},
		flavor: "Perfect clarity.",
		mechanics: {
			action_type: "Passive (socketed)",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None",
			special_abilities: [
				"Active: Automatically succeed a failed Intelligence-based check, but take 1d4 psychic damage from strain (1/long rest).",
			],
			restrictions: [
				"Socket type: accessory/helmet",
				"Inscription DC: 18",
				"Material cost: 1000gp",
			],
			damage_profile: "1d10 + 2",
			condition: "Stunning",
		},
		limitations: {
			uses: "Permanent passive",
			requires_attunement: false,
			consumable: false,
			cost: 1000,
		},
		passive_bonuses: {
			effect: "Enhances the wielder's resilience.",
			combat_advantage: "Deals 1d10 + 2 physical or magical damage on hit.",
		},
		discovery_lore: "Unearthed from the ashes of a collapsed Rift.",
		effects: {
			primary: "Deals 1d10 + 2 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Stunning for 1 round.",
		},
	},
	{
		id: "sigil-sense-1",
		name: "Sigil of the Hawk's Vision",
		description:
			"A magical lens effect that enhances the wearer's physical and mystical sight.",
		rarity: "rare",
		can_inscribe_on: ["accessory", "goggles"],
		effect_description:
			"Passive: You cannot be surprised by visible enemies, and your ranged weapon attacks ignore half cover.",
		tags: ["sigil", "accessory", "sense"],
		source_book: "Academy of High Magic",
		lore: {
			origin:
				"An essential component for Ranger-class Hunters defending the Safe Zones.",
			history: "Its true history remains a heavily guarded Bureau secret.",
			curse: "Mumbles ominous whispers into the user's mind.",
			personality: "Hungry for ambient magic.",
			current_owner: "Lost to the depths of a high-tier dungeon.",
			prior_owners: ["Warden Thorne", "A-Rank Hunter 'Ghost'"],
		},
		flavor: "Nothing escapes your gaze.",
		mechanics: {
			action_type: "Passive (socketed)",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None",
			special_abilities: [
				"Passive: Grants low-light vision and removes disadvantage from firing at maximum normal range up to your sense distance.",
			],
			restrictions: [
				"Socket type: accessory",
				"Inscription DC: 18",
				"Material cost: 1000gp",
			],
			damage_profile: "1d12",
			condition: "Stunning",
		},
		limitations: {
			uses: "Permanent",
			requires_attunement: false,
			consumable: false,
			cost: 1000,
		},
		passive_bonuses: {
			effect: "Enhances the wielder's resilience.",
			combat_advantage: "Deals 1d12 physical or magical damage on hit.",
		},
		discovery_lore: "Recovered after a massive Guild raid.",
		effects: {
			primary: "Deals 1d12 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Stunning for 1 round.",
		},
	},
	{
		id: "sigil-agility-1",
		name: "Sigil of the Wind-Walker",
		description:
			"Enhances the wearer's reaction time by speeding up the flow of mana through their limbs.",
		rarity: "rare",
		can_inscribe_on: ["accessory", "armor"],
		effect_description:
			"Passive: When you take the ready action, you can move up to 10 feet as part of the reaction.",
		tags: ["sigil", "accessory", "agility"],
		source_book: "Academy of High Magic",
		lore: {
			origin:
				"A favorite among Assassin-class Hunters looking for the perfect opening.",
			history: "Its true history remains a heavily guarded Bureau secret.",
			curse: "Causes the user's shadow to sometimes move independently.",
			personality: "Deeply territorial.",
			current_owner: "Held by a rogue guild.",
			prior_owners: ["Warden Thorne", "A-Rank Hunter 'Ghost'"],
		},
		flavor: "Strike first.",
		mechanics: {
			action_type: "Passive (socketed)",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None",
			special_abilities: ["Passive: Gives a +2 bonus to initiative checks."],
			restrictions: [
				"Socket type: accessory",
				"Inscription DC: 18",
				"Material cost: 1000gp",
			],
			damage_profile: "3d6",
			condition: "Paralysis",
		},
		limitations: {
			uses: "Permanent",
			requires_attunement: false,
			consumable: false,
			cost: 1000,
		},
		passive_bonuses: {
			effect: "Enhances the wielder's resilience.",
			combat_advantage: "Deals 3d6 physical or magical damage on hit.",
		},
		discovery_lore: "Unearthed from the ashes of a collapsed Rift.",
		effects: {
			primary: "Deals 3d6 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Paralysis for 1 round.",
		},
	},
	{
		id: "sigil-strength-1",
		name: "Sigil of the Titan's Grasp",
		description:
			"A fierce magical enhancement that physically reinforces the wearer's lifting power.",
		rarity: "rare",
		can_inscribe_on: ["accessory", "gloves"],
		effect_description:
			"Passive: You count as one size category larger for the purposes of grappling, shoving, and carrying capacity.",
		tags: ["sigil", "accessory", "strength"],
		source_book: "Academy of High Magic",
		lore: {
			origin:
				"Used by Vanguard Hunters to physically wrestle dungeon bosses to the ground.",
			history: "Its true history remains a heavily guarded Bureau secret.",
			curse: "Draws the ire of nearby low-level fiends.",
			personality: "Dormant and silent.",
			current_owner: "Heavily guarded in the Bureau's Armory.",
			prior_owners: ["Archmage Valerius"],
		},
		flavor: "Unbreakable strength.",
		mechanics: {
			action_type: "Passive (socketed)",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None",
			special_abilities: [
				"Active: Once per long rest, automatically break any grapple or physical restraint as a bonus action.",
			],
			restrictions: [
				"Socket type: accessory",
				"Inscription DC: 18",
				"Material cost: 1000gp",
			],
			damage_profile: "4d10",
			condition: "Lethargy",
		},
		limitations: {
			uses: "Permanent",
			requires_attunement: false,
			consumable: false,
			cost: 1000,
		},
		passive_bonuses: {
			effect: "Enhances the wielder's resilience.",
			combat_advantage: "Deals 4d10 physical or magical damage on hit.",
		},
		discovery_lore: "Unearthed from the ashes of a collapsed Rift.",
		effects: {
			primary: "Deals 4d10 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Lethargy for 1 round.",
		},
	},
	{
		id: "sigil-presence-1",
		name: "Sigil of the Sovereign's Will",
		description:
			"Projects an aura of overwhelming leadership and intimidating magical pressure.",
		rarity: "rare",
		can_inscribe_on: ["accessory", "cloak"],
		effect_description:
			"Passive: Hostile creatures must succeed on a DC 13 Sense check to target you if another ally is within 5 feet.",
		tags: ["sigil", "accessory", "presence"],
		source_book: "Academy of High Magic",
		lore: {
			origin:
				"Reserved for Guild Masters and those who lead raids into the Abyss.",
			history: "Its true history remains a heavily guarded Bureau secret.",
			curse: "Leaves a lingering smell of ozone and ash.",
			personality: "Dormant and silent.",
			current_owner: "Wielded by Vanguard Hunters.",
			prior_owners: ["The Obsidian Vanguard"],
		},
		flavor: "Bow before authority.",
		mechanics: {
			action_type: "Passive (socketed)",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None",
			special_abilities: [
				"Passive: Advantage on all Intimidation checks against unawakened individuals.",
			],
			restrictions: [
				"Socket type: accessory",
				"Inscription DC: 18",
				"Material cost: 1000gp",
			],
			damage_profile: "1d10 + 2",
			condition: "Lethargy",
		},
		limitations: {
			uses: "Permanent",
			requires_attunement: false,
			consumable: false,
			cost: 1000,
		},
		passive_bonuses: {
			effect: "Enhances the wielder's resilience.",
			combat_advantage: "Deals 1d10 + 2 physical or magical damage on hit.",
		},
		discovery_lore: "Discovered encoded in an ancient grimoire.",
		effects: {
			primary: "Deals 1d10 + 2 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Lethargy for 1 round.",
		},
	},
	{
		id: "sigil-mana-regen-1",
		name: "Sigil of the Mana Font",
		description:
			"Continuously draws ambient mana fragments from the surroundings to sustain the wearer.",
		rarity: "very_rare",
		can_inscribe_on: ["accessory", "amulet"],
		effect_description:
			"Passive: Whenever you score a critical hit, recover 1 expended Job resource (or spell slot of level 1).",
		tags: ["sigil", "accessory", "mana"],
		source_book: "Ascendant Bureau Armory",
		lore: {
			origin:
				"Extremely rare; typically awarded only to National-Level Hunters.",
			history: "Its true history remains a heavily guarded Bureau secret.",
			curse: "Leaves a lingering smell of ozone and ash.",
			personality: "Deeply territorial.",
			current_owner: "Held by a rogue guild.",
			prior_owners: ["Warden Thorne", "A-Rank Hunter 'Ghost'"],
		},
		flavor: "An unending well of power.",
		mechanics: {
			action_type: "Passive (socketed)",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None",
			special_abilities: [
				"Active: Spend an action to immediately regain 1d4+1 hit points and 1 spell resource of tier 1. (1/long rest)",
			],
			restrictions: [
				"Socket type: accessory",
				"Inscription DC: 22",
				"Material cost: 5000gp",
			],
			damage_profile: "3d12 + 6",
			condition: "Fear",
		},
		limitations: {
			uses: "Permanent",
			requires_attunement: true,
			consumable: false,
			cost: 5000,
		},
		passive_bonuses: {
			effect: "Enhances the wielder's resilience.",
			combat_advantage: "Deals 3d12 + 6 physical or magical damage on hit.",
		},
		discovery_lore: "Unearthed from the ashes of a collapsed Rift.",
		effects: {
			primary: "Deals 3d12 + 6 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Fear for 1 round.",
		},
	},
	{
		id: "sigil-shadow-king",
		name: "Sigil of the Shadow Regent",
		description:
			"A pitch-black rune that seems to swallow the light around it, radiating pure necrotic mana.",
		rarity: "legendary",
		can_inscribe_on: ["weapon"],
		effect_description:
			"Passive: Any humanoid killed by this weapon instantly rises as a Shadow Minion under your control for 1 minute.",
		tags: ["sigil", "weapon", "necrotic", "summoning"],
		source_book: "Shadow Legion Archives",
		lore: {
			origin:
				"A forbidden artifact; those who study its design too closely often lose their minds to the whispering dark.",
			history: "Its true history remains a heavily guarded Bureau secret.",
			curse: "Occasionally burns the skin with raw mana.",
			personality: "Hungry for ambient magic.",
			current_owner: "Currently unaccounted for.",
			prior_owners: ["Warden Thorne", "A-Rank Hunter 'Ghost'"],
		},
		flavor: "Serve me in death.",
		mechanics: {
			action_type: "Passive (socketed)",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None",
			special_abilities: [
				"Passive: The weapon's damage is entirely converted to irresistible Necrotic damage against non-undead.",
			],
			restrictions: [
				"Socket type: weapon",
				"Inscription DC: 25",
				"Material cost: 25000gp",
			],
			damage_profile: "1d10 + 2",
			condition: "Fear",
		},
		limitations: {
			uses: "Permanent",
			requires_attunement: true,
			consumable: false,
			cost: 25000,
		},
		passive_bonuses: {
			effect: "Enhances the wielder's resilience.",
			combat_advantage: "Deals 1d10 + 2 physical or magical damage on hit.",
		},
		discovery_lore: "Discovered encoded in an ancient grimoire.",
		effects: {
			primary: "Deals 1d10 + 2 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Fear for 1 round.",
		},
	},
	{
		id: "sigil-immortality",
		name: "Sigil of the Undying Flame",
		description:
			"A grand sigil of healing magic that binds the wearer's soul to their physical body.",
		rarity: "legendary",
		can_inscribe_on: ["armor"],
		effect_description:
			"Passive: If an attack would reduce you to 0 HP, it instead reduces you to 1 HP, and releases a 20ft fiery explosion (4d10 Fire damage).",
		tags: ["sigil", "armor", "vitality"],
		source_book: "Holylight Cathedral",
		lore: {
			origin:
				"The ultimate safeguard for Hunters entering uncharted Red Gates.",
			history: "Its true history remains a heavily guarded Bureau secret.",
			curse: "Drains minor amounts of stamina when used repeatedly.",
			personality: "Sorrowful, weeping mana.",
			current_owner: "Currently unaccounted for.",
			prior_owners: ["An unknown rogue Awakened"],
		},
		flavor: "Refuse to fall.",
		mechanics: {
			action_type: "Passive threshold",
			type: "Sigil",
			duration: "Instant",
			action: "None",
			special_abilities: [
				"Active: You can consciously trigger the fiery explosion as an action, damaging yourself for 20 HP in the process.",
			],
			restrictions: [
				"Socket type: armor",
				"Inscription DC: 26",
				"Material cost: 50000gp",
			],
			damage_profile: "1d12",
			condition: "Stunning",
		},
		limitations: {
			uses: "Passive 1/week",
			requires_attunement: true,
			consumable: false,
			cost: 50000,
		},
		passive_bonuses: {
			effect: "Enhances the wielder's resilience.",
			combat_advantage: "Deals 1d12 physical or magical damage on hit.",
		},
		discovery_lore: "Traded for thirty vials of wyvern blood.",
		effects: {
			primary: "Deals 1d12 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Stunning for 1 round.",
		},
	},
	{
		id: "sigil-res-fire-2",
		name: "Sigil of the Dragon's Scale",
		description:
			"An advanced ward that completely neutralizes ambient thermal magic.",
		rarity: "rare",
		can_inscribe_on: ["armor"],
		effect_description:
			"Passive: Grants Resistance to Fire damage. If you already have resistance, you gain Immunity.",
		tags: ["sigil", "armor", "protection"],
		source_book: "Ascendant Bureau Armory",
		lore: {
			origin:
				"A necessity when traversing the deeper layers of Hell-Class gates.",
			history: "Its true history remains a heavily guarded Bureau secret.",
			curse: "Causes the user's shadow to sometimes move independently.",
			personality: "Proud and unyielding.",
			current_owner: "Lost to the depths of a high-tier dungeon.",
			prior_owners: ["Archmage Valerius"],
		},
		flavor: "Unburned.",
		mechanics: {
			action_type: "Passive (socketed)",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None",
			special_abilities: [
				"Passive: Fire damage dealt to attackers in melee is absorbed to heal the armor's durability.",
			],
			restrictions: [
				"Socket type: armor",
				"Inscription DC: 18",
				"Material cost: 1500gp",
			],
			damage_profile: "2d8",
			condition: "Lethargy",
		},
		limitations: {
			uses: "Permanent",
			requires_attunement: false,
			consumable: false,
			cost: 1500,
		},
		passive_bonuses: {
			effect: "Enhances the wielder's resilience.",
			combat_advantage: "Deals 2d8 physical or magical damage on hit.",
		},
		discovery_lore: "Recovered after a massive Guild raid.",
		effects: {
			primary: "Deals 2d8 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Lethargy for 1 round.",
		},
	},
	{
		id: "sigil-res-frost-2",
		name: "Sigil of the True Glacier",
		description:
			"Channels body heat to perfectly repel magical and natural cold.",
		rarity: "rare",
		can_inscribe_on: ["armor"],
		effect_description:
			"Passive: Grants Resistance to Cold damage. If you already have resistance, you gain Immunity.",
		tags: ["sigil", "armor", "protection"],
		source_book: "Ascendant Bureau Armory",
		lore: {
			origin:
				"Invented to survive encounters with Ice-type anomalies beyond the Northern Rifts.",
			history: "Its true history remains a heavily guarded Bureau secret.",
			curse: "Erodes non-magical clothing over time.",
			personality: "Chaotic and unpredictable.",
			current_owner: "Lost to the depths of a high-tier dungeon.",
			prior_owners: ["Guild Master Kael"],
		},
		flavor: "The freeze breaks against you.",
		mechanics: {
			action_type: "Passive (socketed)",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None",
			special_abilities: [
				"Passive: You ignore all difficult terrain caused by ice or snow.",
			],
			restrictions: [
				"Socket type: armor",
				"Inscription DC: 18",
				"Material cost: 1500gp",
			],
			damage_profile: "3d12 + 6",
			condition: "Lethargy",
		},
		limitations: {
			uses: "Permanent",
			requires_attunement: false,
			consumable: false,
			cost: 1500,
		},
		passive_bonuses: {
			effect: "Enhances the wielder's resilience.",
			combat_advantage: "Deals 3d12 + 6 physical or magical damage on hit.",
		},
		discovery_lore: "Found pinned to a monstrous corpse.",
		effects: {
			primary: "Deals 3d12 + 6 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Lethargy for 1 round.",
		},
	},
	{
		id: "sigil-res-lightning-2",
		name: "Sigil of the Storm-Wall",
		description:
			"An intricately woven mana-barrier that completely nullifies electrical shock hazards.",
		rarity: "rare",
		can_inscribe_on: ["armor"],
		effect_description:
			"Passive: Grants Resistance to Lightning damage. If you already have resistance, you gain Immunity.",
		tags: ["sigil", "armor", "protection"],
		source_book: "Ascendant Bureau Armory",
		lore: {
			origin:
				"Carved into the shields of Vanguard Hunters facing storm-elemental bosses.",
			history: "Its true history remains a heavily guarded Bureau secret.",
			curse: "Induces temporary colorblindness after use.",
			personality: "Coldly analytical.",
			current_owner: "Wielded by Vanguard Hunters.",
			prior_owners: ["The First Ascendant"],
		},
		flavor: "The storm ignored.",
		mechanics: {
			action_type: "Passive (socketed)",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None",
			special_abilities: [
				"Active: Once per day, you can absorb a lightning attack entirely and recharge one low-level ability.",
			],
			restrictions: [
				"Socket type: armor",
				"Inscription DC: 18",
				"Material cost: 1500gp",
			],
			damage_profile: "1d6",
			condition: "Stunning",
		},
		limitations: {
			uses: "Permanent",
			requires_attunement: false,
			consumable: false,
			cost: 1500,
		},
		passive_bonuses: {
			effect: "Enhances the wielder's resilience.",
			combat_advantage: "Deals 1d6 physical or magical damage on hit.",
		},
		discovery_lore: "Traded for thirty vials of wyvern blood.",
		effects: {
			primary: "Deals 1d6 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Stunning for 1 round.",
		},
	},
	{
		id: "sigil-res-acid-2",
		name: "Sigil of the Obsidian Polish",
		description:
			"A slick, magical coating that causes acid to evaporate before making contact with armor.",
		rarity: "rare",
		can_inscribe_on: ["armor"],
		effect_description:
			"Passive: Grants Resistance to Acid damage. If you already have resistance, you gain Immunity.",
		tags: ["sigil", "armor", "protection"],
		source_book: "Ascendant Bureau Armory",
		lore: {
			origin:
				"Crucial for fighting the acid-spitting Arachnids of Sector D gates.",
			history: "Its true history remains a heavily guarded Bureau secret.",
			curse: "Causes the user's shadow to sometimes move independently.",
			personality: "Deeply territorial.",
			current_owner: "Wielded by Vanguard Hunters.",
			prior_owners: ["Archmage Valerius"],
		},
		flavor: "Nothing sticks.",
		mechanics: {
			action_type: "Passive (socketed)",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None",
			special_abilities: [
				"Passive: Unaffected by pools of acid or corrosive environments.",
			],
			restrictions: [
				"Socket type: armor",
				"Inscription DC: 18",
				"Material cost: 1500gp",
			],
			damage_profile: "1d10 + 2",
			condition: "Fear",
		},
		limitations: {
			uses: "Permanent",
			requires_attunement: false,
			consumable: false,
			cost: 1500,
		},
		passive_bonuses: {
			effect: "Enhances the wielder's resilience.",
			combat_advantage: "Deals 1d10 + 2 physical or magical damage on hit.",
		},
		discovery_lore: "Recovered after a massive Guild raid.",
		effects: {
			primary: "Deals 1d10 + 2 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Fear for 1 round.",
		},
	},
	{
		id: "sigil-res-poison-2",
		name: "Sigil of the Cleansed Blood",
		description:
			"A restorative runic pattern that purges magical toxins via proximity.",
		rarity: "rare",
		can_inscribe_on: ["armor"],
		effect_description:
			"Passive: Grants Resistance to Poison damage. If you already have resistance, you gain Immunity.",
		tags: ["sigil", "armor", "protection"],
		source_book: "Ascendant Bureau Armory",
		lore: {
			origin:
				"Derived from the antidote protocols used in the Amazon Rift Zone.",
			history: "Its true history remains a heavily guarded Bureau secret.",
			curse: "Induces temporary colorblindness after use.",
			personality: "Aggressive and volatile.",
			current_owner: "Circulating in the underground Hunter markets.",
			prior_owners: ["An unknown rogue Awakened"],
		},
		flavor: "A pure heart.",
		mechanics: {
			action_type: "Passive (socketed)",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None",
			special_abilities: [
				"Passive: Grants permanent advantage on saving throws to resist the Poisoned condition.",
			],
			restrictions: [
				"Socket type: armor",
				"Inscription DC: 18",
				"Material cost: 1500gp",
			],
			damage_profile: "4d10",
			condition: "Paralysis",
		},
		limitations: {
			uses: "Permanent",
			requires_attunement: false,
			consumable: false,
			cost: 1500,
		},
		passive_bonuses: {
			effect: "Enhances the wielder's resilience.",
			combat_advantage: "Deals 4d10 physical or magical damage on hit.",
		},
		discovery_lore: "Unearthed from the ashes of a collapsed Rift.",
		effects: {
			primary: "Deals 4d10 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Paralysis for 1 round.",
		},
	},
	{
		id: "sigil-res-thunder-2",
		name: "Sigil of the Silent Guardian",
		description:
			"Absorbs sonic booms and magical shockwaves, neutralizing forceful disruption.",
		rarity: "rare",
		can_inscribe_on: ["armor"],
		effect_description:
			"Passive: Grants Resistance to Thunder damage. If you already have resistance, you gain Immunity.",
		tags: ["sigil", "armor", "protection"],
		source_book: "Ascendant Bureau Armory",
		lore: {
			origin:
				"Favored by operatives exploring dwarven ruin-gates where sound triggers traps.",
			history: "Its true history remains a heavily guarded Bureau secret.",
			curse: "Mumbles ominous whispers into the user's mind.",
			personality: "Aggressive and volatile.",
			current_owner: "Heavily guarded in the Bureau's Armory.",
			prior_owners: ["Warden Thorne", "A-Rank Hunter 'Ghost'"],
		},
		flavor: "Quiet resilience.",
		mechanics: {
			action_type: "Passive (socketed)",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None",
			special_abilities: ["Passive: Immune to the Deafened condition."],
			restrictions: [
				"Socket type: armor",
				"Inscription DC: 18",
				"Material cost: 1500gp",
			],
			damage_profile: "3d6",
			condition: "Fear",
		},
		limitations: {
			uses: "Permanent",
			requires_attunement: false,
			consumable: false,
			cost: 1500,
		},
		passive_bonuses: {
			effect: "Enhances the wielder's resilience.",
			combat_advantage: "Deals 3d6 physical or magical damage on hit.",
		},
		discovery_lore: "Recovered after a massive Guild raid.",
		effects: {
			primary: "Deals 3d6 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Fear for 1 round.",
		},
	},
	{
		id: "sigil-res-force-2",
		name: "Sigil of the Unmoving Stone",
		description:
			"Reinforces the localized physical space of the wearer, preventing crushing magical force.",
		rarity: "rare",
		can_inscribe_on: ["armor"],
		effect_description:
			"Passive: Grants Resistance to Force damage. If you already have resistance, you gain Immunity.",
		tags: ["sigil", "armor", "protection"],
		source_book: "Ascendant Bureau Armory",
		lore: {
			origin:
				"An absolute requirement to survive a high-tier Telekinetic anomaly's assault.",
			history: "Its true history remains a heavily guarded Bureau secret.",
			curse: "Leaves a lingering smell of ozone and ash.",
			personality: "Sorrowful, weeping mana.",
			current_owner: "Held by a rogue guild.",
			prior_owners: ["Guild Master Kael"],
		},
		flavor: "Unbreakable presence.",
		mechanics: {
			action_type: "Passive (socketed)",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None",
			special_abilities: [
				"Passive: Advantage against abilities that would forcibly teleport or banish the user.",
			],
			restrictions: [
				"Socket type: armor",
				"Inscription DC: 18",
				"Material cost: 1500gp",
			],
			damage_profile: "3d6",
			condition: "Paralysis",
		},
		limitations: {
			uses: "Permanent",
			requires_attunement: false,
			consumable: false,
			cost: 1500,
		},
		passive_bonuses: {
			effect: "Enhances the wielder's resilience.",
			combat_advantage: "Deals 3d6 physical or magical damage on hit.",
		},
		discovery_lore: "Unearthed from the ashes of a collapsed Rift.",
		effects: {
			primary: "Deals 3d6 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Paralysis for 1 round.",
		},
	},
	{
		id: "sigil-res-psychic-2",
		name: "Sigil of the Iron Mind",
		description:
			"A headache-inducing geometric mana pattern that scrambles telepathic intrusions.",
		rarity: "rare",
		can_inscribe_on: ["armor", "helmet"],
		effect_description:
			"Passive: Grants Resistance to Psychic damage. If you already have resistance, you gain Immunity.",
		tags: ["sigil", "armor", "protection"],
		source_book: "Ascendant Bureau Armory",
		lore: {
			origin:
				"Constructed after an Illithid-variant gate resulted in hundreds of mind-controlled casualties.",
			history: "Its true history remains a heavily guarded Bureau secret.",
			curse: "Leaves a lingering smell of ozone and ash.",
			personality: "Chaotic and unpredictable.",
			current_owner: "Held by a rogue guild.",
			prior_owners: ["Guild Master Kael"],
		},
		flavor: "My thoughts are my own.",
		mechanics: {
			action_type: "Passive (socketed)",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None",
			special_abilities: [
				"Passive: You cannot have your mind read unless you allow it.",
			],
			restrictions: [
				"Socket type: armor/helmet",
				"Inscription DC: 18",
				"Material cost: 1500gp",
			],
			damage_profile: "1d10 + 2",
			condition: "Fear",
		},
		limitations: {
			uses: "Permanent",
			requires_attunement: false,
			consumable: false,
			cost: 1500,
		},
		passive_bonuses: {
			effect: "Enhances the wielder's resilience.",
			combat_advantage: "Deals 1d10 + 2 physical or magical damage on hit.",
		},
		discovery_lore: "Recovered after a massive Guild raid.",
		effects: {
			primary: "Deals 1d10 + 2 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Fear for 1 round.",
		},
	},
	{
		id: "sigil-mastery-blade",
		name: "Sigil of the Grandmaster's Edge",
		description:
			"Attunes a bladed weapon to perfectly seek the path of least resistance through monster hide.",
		rarity: "very_rare",
		can_inscribe_on: ["weapon"],
		effect_description:
			"Passive: Attacks with this slashing weapon ignore slashing resistance and treat immunity as resistance.",
		tags: ["sigil", "weapon", "mastery"],
		source_book: "Ascendant Bureau Armory",
		lore: {
			origin:
				"The pinnacle of cutting augmentation, designed by an elite Guild Master who broke too many swords.",
			history: "Its true history remains a heavily guarded Bureau secret.",
			curse: "Induces temporary colorblindness after use.",
			personality: "Hungry for ambient magic.",
			current_owner: "Circulating in the underground Hunter markets.",
			prior_owners: ["The Obsidian Vanguard"],
		},
		flavor: "Nothing stands in the way.",
		mechanics: {
			action_type: "Passive (socketed)",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None",
			special_abilities: [
				"Passive: Critical hits with this weapon deal maximum damage on the dice.",
			],
			restrictions: [
				"Socket type: weapon",
				"Inscription DC: 22",
				"Material cost: 5000gp",
			],
			damage_profile: "3d12 + 6",
			condition: "Blindness",
		},
		limitations: {
			uses: "Permanent",
			requires_attunement: true,
			consumable: false,
			cost: 5000,
		},
		passive_bonuses: {
			effect: "Enhances the wielder's resilience.",
			combat_advantage: "Deals 3d12 + 6 physical or magical damage on hit.",
		},
		discovery_lore: "Traded for thirty vials of wyvern blood.",
		effects: {
			primary: "Deals 3d12 + 6 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Blindness for 1 round.",
		},
	},
	{
		id: "sigil-mastery-mallet",
		name: "Sigil of the Earth-Shatterer",
		description:
			"Infuses the weapon with heavy earth mana so it strikes with the mass of a boulder.",
		rarity: "very_rare",
		can_inscribe_on: ["weapon"],
		effect_description:
			"Passive: Attacks with this bludgeoning weapon push targets 10 feet backward on a hit.",
		tags: ["sigil", "weapon", "mastery"],
		source_book: "Ascendant Bureau Armory",
		lore: {
			origin:
				"Built for Vanguard hunters dealing with heavily armored stone golems.",
			history: "Its true history remains a heavily guarded Bureau secret.",
			curse: "Drains minor amounts of stamina when used repeatedly.",
			personality: "Sorrowful, weeping mana.",
			current_owner: "Held by a rogue guild.",
			prior_owners: ["Archmage Valerius"],
		},
		flavor: "Shatter their foundations.",
		mechanics: {
			action_type: "Passive (socketed)",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None",
			special_abilities: [
				"Passive: Deals double damage to inanimate objects and gate structures.",
			],
			restrictions: [
				"Socket type: weapon",
				"Inscription DC: 22",
				"Material cost: 5000gp",
			],
			damage_profile: "1d8",
			condition: "Blindness",
		},
		limitations: {
			uses: "Permanent",
			requires_attunement: true,
			consumable: false,
			cost: 5000,
		},
		passive_bonuses: {
			effect: "Enhances the wielder's resilience.",
			combat_advantage: "Deals 1d8 physical or magical damage on hit.",
		},
		discovery_lore: "Discovered encoded in an ancient grimoire.",
		effects: {
			primary: "Deals 1d8 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Blindness for 1 round.",
		},
	},
	{
		id: "sigil-mastery-bow",
		name: "Sigil of the Ranger's Eye",
		description: "Guides projectiles with subtle bursts of wind magic.",
		rarity: "very_rare",
		can_inscribe_on: ["weapon"],
		effect_description:
			"Passive: Your ranged attacks ignore half and three-quarters cover entirely.",
		tags: ["sigil", "weapon", "mastery"],
		source_book: "Ascendant Bureau Armory",
		lore: {
			origin: "Ensured a 100% kill rate for the Guild's elite archer division.",
			history: "Its true history remains a heavily guarded Bureau secret.",
			curse: "Induces temporary colorblindness after use.",
			personality: "Sorrowful, weeping mana.",
			current_owner: "Wielded by Vanguard Hunters.",
			prior_owners: ["The First Ascendant"],
		},
		flavor: "There's nowhere to hide.",
		mechanics: {
			action_type: "Passive (socketed)",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None",
			special_abilities: [
				"Passive: If an attack misses, you can reroll it once per turn.",
			],
			restrictions: [
				"Socket type: weapon",
				"Inscription DC: 22",
				"Material cost: 5000gp",
			],
			damage_profile: "1d10 + 2",
			condition: "Paralysis",
		},
		limitations: {
			uses: "Permanent",
			requires_attunement: true,
			consumable: false,
			cost: 5000,
		},
		passive_bonuses: {
			effect: "Enhances the wielder's resilience.",
			combat_advantage: "Deals 1d10 + 2 physical or magical damage on hit.",
		},
		discovery_lore: "Traded for thirty vials of wyvern blood.",
		effects: {
			primary: "Deals 1d10 + 2 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Paralysis for 1 round.",
		},
	},
	{
		id: "sigil-mastery-spear",
		name: "Sigil of the Pierce-Through",
		description:
			"Concentrates mana at the tip of a polearm into a razor-sharp point of light.",
		rarity: "very_rare",
		can_inscribe_on: ["weapon"],
		effect_description:
			"Passive: Attacks made at a 10-foot reach or 20-foot range deal an additional 1d6 piercing damage.",
		tags: ["sigil", "weapon", "mastery"],
		source_book: "Ascendant Bureau Armory",
		lore: {
			origin: "Keeps the deadliest horrors exactly an arm's length away.",
			history: "Its true history remains a heavily guarded Bureau secret.",
			curse: "Erodes non-magical clothing over time.",
			personality: "Aggressive and volatile.",
			current_owner: "Held by a rogue guild.",
			prior_owners: ["Guild Master Kael"],
		},
		flavor: "Distance is safety.",
		mechanics: {
			action_type: "Passive (socketed)",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None",
			special_abilities: [
				"Passive: Opportunity attacks bypass all armor AC bonuses from shields.",
			],
			restrictions: [
				"Socket type: weapon",
				"Inscription DC: 22",
				"Material cost: 5000gp",
			],
			damage_profile: "2d6",
			condition: "Stunning",
		},
		limitations: {
			uses: "Permanent",
			requires_attunement: true,
			consumable: false,
			cost: 5000,
		},
		passive_bonuses: {
			effect: "Enhances the wielder's resilience.",
			combat_advantage: "Deals 2d6 physical or magical damage on hit.",
		},
		discovery_lore: "Recovered after a massive Guild raid.",
		effects: {
			primary: "Deals 2d6 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Stunning for 1 round.",
		},
	},
	{
		id: "sigil-mastery-axe",
		name: "Sigil of the Executioner's Swing",
		description: "Accelerates downward swings by compounding mana weight.",
		rarity: "very_rare",
		can_inscribe_on: ["weapon"],
		effect_description:
			"Passive: Once per turn, you can declare a reckless attack. On hit, the target is stunned until their turn.",
		tags: ["sigil", "weapon", "mastery"],
		source_book: "Ascendant Bureau Armory",
		lore: {
			origin:
				"For when you absolutely must cleave the monster in two on the first swing.",
			history: "Its true history remains a heavily guarded Bureau secret.",
			curse: "Erodes non-magical clothing over time.",
			personality: "Hungry for ambient magic.",
			current_owner: "Lost to the depths of a high-tier dungeon.",
			prior_owners: ["Archmage Valerius"],
		},
		flavor: "A heavy toll.",
		mechanics: {
			action_type: "Passive (socketed)",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None",
			special_abilities: [
				"Passive: If you drop a creature to 0 HP, immediately make another attack roll against an adjacent enemy.",
			],
			restrictions: [
				"Socket type: weapon",
				"Inscription DC: 22",
				"Material cost: 5000gp",
			],
			damage_profile: "3d6",
			condition: "Blindness",
		},
		limitations: {
			uses: "Permanent",
			requires_attunement: true,
			consumable: false,
			cost: 5000,
		},
		passive_bonuses: {
			effect: "Enhances the wielder's resilience.",
			combat_advantage: "Deals 3d6 physical or magical damage on hit.",
		},
		discovery_lore: "Unearthed from the ashes of a collapsed Rift.",
		effects: {
			primary: "Deals 3d6 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Blindness for 1 round.",
		},
	},
	{
		id: "sigil-mastery-wand",
		name: "Sigil of the Mage's Focus",
		description:
			"Functions as a perfect mana-conductor, refining raw spells into cleaner, faster casts.",
		rarity: "very_rare",
		can_inscribe_on: ["weapon"],
		effect_description:
			"Passive: Spells requiring an attack roll score a critical hit on a 19 or 20.",
		tags: ["sigil", "weapon", "mastery"],
		source_book: "Ascendant Bureau Armory",
		lore: {
			origin: "The mage's ultimate catalyst.",
			history: "Its true history remains a heavily guarded Bureau secret.",
			curse: "Leaves a lingering smell of ozone and ash.",
			personality: "Hungry for ambient magic.",
			current_owner: "Circulating in the underground Hunter markets.",
			prior_owners: ["The First Ascendant"],
		},
		flavor: "Precision of the unseen.",
		mechanics: {
			action_type: "Passive (socketed)",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None",
			special_abilities: [
				"Active: Once per long rest, cast a spell as a Bonus Action instead of an Action without altering its cost.",
			],
			restrictions: [
				"Socket type: weapon",
				"Inscription DC: 22",
				"Material cost: 5000gp",
			],
			damage_profile: "1d6",
			condition: "Paralysis",
		},
		limitations: {
			uses: "Permanent",
			requires_attunement: true,
			consumable: false,
			cost: 5000,
		},
		passive_bonuses: {
			effect: "Enhances the wielder's resilience.",
			combat_advantage: "Deals 1d6 physical or magical damage on hit.",
		},
		discovery_lore: "Found pinned to a monstrous corpse.",
		effects: {
			primary: "Deals 1d6 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Paralysis for 1 round.",
		},
	},
	{
		id: "sigil-essence-vigor",
		name: "Sigil of Endless Vitality",
		description:
			"Beats with the rhythm of life magic, flooding the body with restorative mana.",
		rarity: "rare",
		can_inscribe_on: ["armor", "accessory"],
		effect_description:
			"Passive: Increases Maximum HP by your Character Level x 2.",
		tags: ["sigil", "armor", "vitality"],
		source_book: "Ascendant Bureau Armory",
		lore: {
			origin:
				"Stolen from a regenerating Troll boss inside an A-Rank labyrinth.",
			history: "Its true history remains a heavily guarded Bureau secret.",
			curse: "Causes the user's shadow to sometimes move independently.",
			personality: "Coldly analytical.",
			current_owner: "Wielded by Vanguard Hunters.",
			prior_owners: ["Archmage Valerius"],
		},
		flavor: "Refuse to yield.",
		mechanics: {
			action_type: "Passive (socketed)",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None",
			special_abilities: [
				"Passive: Recover 2 HP at the start of each of your turns as long as you have 1 HP.",
			],
			restrictions: [
				"Socket type: armor",
				"Inscription DC: 20",
				"Material cost: 2500gp",
			],
			damage_profile: "1d8",
			condition: "Paralysis",
		},
		limitations: {
			uses: "Permanent",
			requires_attunement: true,
			consumable: false,
			cost: 2500,
		},
		passive_bonuses: {
			effect: "Enhances the wielder's resilience.",
			combat_advantage: "Deals 1d8 physical or magical damage on hit.",
		},
		discovery_lore: "Found pinned to a monstrous corpse.",
		effects: {
			primary: "Deals 1d8 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Paralysis for 1 round.",
		},
	},
	{
		id: "sigil-essence-haste",
		name: "Sigil of the Wind-Step",
		description:
			"Constantly envelops the wearer's feet in a swirling eddy of wind magic.",
		rarity: "rare",
		can_inscribe_on: ["armor", "boots"],
		effect_description:
			"Passive: Your base walking speed increases by 10 feet.",
		tags: ["sigil", "armor", "agility"],
		source_book: "Ascendant Bureau Armory",
		lore: {
			origin: "For when you need to outrun an angry S-Rank anomaly.",
			history: "Its true history remains a heavily guarded Bureau secret.",
			curse: "Mumbles ominous whispers into the user's mind.",
			personality: "Dormant and silent.",
			current_owner: "Wielded by Vanguard Hunters.",
			prior_owners: ["Warden Thorne", "A-Rank Hunter 'Ghost'"],
		},
		flavor: "Catch me if you can.",
		mechanics: {
			action_type: "Passive (socketed)",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None",
			special_abilities: [
				"Passive: Opportunity attacks against you are made with disadvantage when you dash.",
			],
			restrictions: [
				"Socket type: boots",
				"Inscription DC: 20",
				"Material cost: 2500gp",
			],
			damage_profile: "2d6",
			condition: "Blindness",
		},
		limitations: {
			uses: "Permanent",
			requires_attunement: true,
			consumable: false,
			cost: 2500,
		},
		passive_bonuses: {
			effect: "Enhances the wielder's resilience.",
			combat_advantage: "Deals 2d6 physical or magical damage on hit.",
		},
		discovery_lore: "Recovered after a massive Guild raid.",
		effects: {
			primary: "Deals 2d6 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Blindness for 1 round.",
		},
	},
	{
		id: "sigil-essence-bravery",
		name: "Sigil of the Lionhearted",
		description:
			"Channels radiant courage into the wearer's mana core, suppressing extreme fear responses.",
		rarity: "rare",
		can_inscribe_on: ["accessory"],
		effect_description:
			"Passive: You are entirely immune to the Frightened condition.",
		tags: ["sigil", "accessory", "presence"],
		source_book: "Ascendant Bureau Armory",
		lore: {
			origin: "Monsters feed on fear; this sigil starves them.",
			history: "Its true history remains a heavily guarded Bureau secret.",
			curse: "Leaves a lingering smell of ozone and ash.",
			personality: "Coldly analytical.",
			current_owner: "Heavily guarded in the Bureau's Armory.",
			prior_owners: ["Archmage Valerius"],
		},
		flavor: "Look terror in the eye.",
		mechanics: {
			action_type: "Passive (socketed)",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None",
			special_abilities: [
				"Active: When an ally within 30 ft is Frightened, you can use your Reaction to cure them.",
			],
			restrictions: [
				"Socket type: accessory",
				"Inscription DC: 20",
				"Material cost: 2500gp",
			],
			damage_profile: "2d8",
			condition: "Stunning",
		},
		limitations: {
			uses: "Permanent",
			requires_attunement: true,
			consumable: false,
			cost: 2500,
		},
		passive_bonuses: {
			effect: "Enhances the wielder's resilience.",
			combat_advantage: "Deals 2d8 physical or magical damage on hit.",
		},
		discovery_lore: "Traded for thirty vials of wyvern blood.",
		effects: {
			primary: "Deals 2d8 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Stunning for 1 round.",
		},
	},
	{
		id: "sigil-essence-iron-skin",
		name: "Sigil of the Unbreakable Mountain",
		description:
			"Hardens the magical aura resting over the armor into an invisible shield.",
		rarity: "rare",
		can_inscribe_on: ["armor"],
		effect_description: "Passive: Grants a permanent +2 to Armor Class.",
		tags: ["sigil", "armor", "defensive"],
		source_book: "Ascendant Bureau Armory",
		lore: {
			origin:
				"Favored by solo-tank specialists holding the front line of Rift breaks.",
			history: "Its true history remains a heavily guarded Bureau secret.",
			curse: "Drains minor amounts of stamina when used repeatedly.",
			personality: "Deeply territorial.",
			current_owner: "Wielded by Vanguard Hunters.",
			prior_owners: ["The Obsidian Vanguard"],
		},
		flavor: "Like hitting a mountain.",
		mechanics: {
			action_type: "Passive (socketed)",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None",
			special_abilities: [
				"Passive: Critical hits against you are treated as normal hits instead (1/long rest).",
			],
			restrictions: [
				"Socket type: armor",
				"Inscription DC: 20",
				"Material cost: 2500gp",
			],
			damage_profile: "4d10",
			condition: "Stunning",
		},
		limitations: {
			uses: "Permanent",
			requires_attunement: true,
			consumable: false,
			cost: 2500,
		},
		passive_bonuses: {
			effect: "Enhances the wielder's resilience.",
			combat_advantage: "Deals 4d10 physical or magical damage on hit.",
		},
		discovery_lore: "Traded for thirty vials of wyvern blood.",
		effects: {
			primary: "Deals 4d10 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Stunning for 1 round.",
		},
	},
	{
		id: "sigil-essence-insight",
		name: "Sigil of the Inner Eye",
		description:
			"Translates subtle environmental mana fluctuations into true sight.",
		rarity: "rare",
		can_inscribe_on: ["helmet", "accessory"],
		effect_description:
			"Passive: You can perceive invisible creatures and illusions for what they truly are within 30 feet.",
		tags: ["sigil", "accessory", "sense"],
		source_book: "Ascendant Bureau Armory",
		lore: {
			origin: "Bypasses the cloaking mechanisms of Class-A stalker anomalies.",
			history: "Its true history remains a heavily guarded Bureau secret.",
			curse: "Drains minor amounts of stamina when used repeatedly.",
			personality: "Coldly analytical.",
			current_owner: "Held by a rogue guild.",
			prior_owners: ["The First Ascendant"],
		},
		flavor: "Nothing remains hidden.",
		mechanics: {
			action_type: "Passive (socketed)",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None",
			special_abilities: ["Passive: Gain a +5 bonus to Passive Perception."],
			restrictions: [
				"Socket type: helmet",
				"Inscription DC: 20",
				"Material cost: 2500gp",
			],
			damage_profile: "1d6",
			condition: "Stunning",
		},
		limitations: {
			uses: "Permanent",
			requires_attunement: true,
			consumable: false,
			cost: 2500,
		},
		passive_bonuses: {
			effect: "Enhances the wielder's resilience.",
			combat_advantage: "Deals 1d6 physical or magical damage on hit.",
		},
		discovery_lore: "Found pinned to a monstrous corpse.",
		effects: {
			primary: "Deals 1d6 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Stunning for 1 round.",
		},
	},
];
