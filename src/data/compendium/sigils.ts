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
				"Entered into the Bureau's dermal-inscription registry after initial trials.",
			history: "Catalogued in the Artificer Guild's closed-reference volume.",
			curse: "",
			personality: "Binds cleanly to an authorized socket on first inscription.",
			current_owner: "Issued via the Guild's rank-appropriate supply chain.",
			prior_owners: ["Guild Historical Registry"],
		},
		flavor: "Cut through the noise.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			special_abilities: [
				"Passive: Resistance to fire damage",
				"Active: Deal 1d8 lightning damage to attacker when hit (passive trigger)",
			],
			restrictions: [
				"Socket type: weapon",
				"Inscription DC: 11 (Void Stylus)",
				"Material cost: 2500gp",
			],
			damage_profile: "See active effect",
			condition: "Blindness",
			ability: "Agility",
			lattice_interaction:
				"Inscribed using Void Stylus — bonds with item's mana lattice",
			stat_bonuses: {},
		},
		limitations: {
			uses: "Permanent while socketed",
			requires_attunement: false,
			consumable: false,
			cost: 2500,
			recharge: "Active ability recharges per rest",
			conditions: [
				"Max sigils per item: 3 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 16 check or destroys the sigil",
			],
			charges: 0,
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
		image: "/generated/effects/darkness-shroud.webp",
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
			history: "Archived in the Guild's secured inscription reference.",
			curse: "",
			personality: "Chaotic and unpredictable.",
			current_owner: "Lost to the depths of a high-tier dungeon.",
			prior_owners: ["Warden Thorne", "A-Rank Hunter 'Ghost'"],
		},
		flavor: "The weight of the earth.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			special_abilities: [
				"Passive: Resistance to cold damage",
				"Active: Create dim light in 20-foot radius for 10 minutes (at will)",
			],
			restrictions: [
				"Socket type: gloves",
				"Inscription DC: 12 (Shadow Quill)",
				"Material cost: 2500gp",
			],
			damage_profile: "See active effect",
			condition: "Lethargy",
			ability: "Sense",
			lattice_interaction:
				"Inscribed using Shadow Quill — bonds with item's mana lattice",
			stat_bonuses: {},
		},
		limitations: {
			uses: "Permanent while socketed",
			requires_attunement: false,
			consumable: false,
			cost: 2500,
			recharge: "Active ability recharges per rest",
			conditions: [
				"Max sigils per item: 2 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 17 check or destroys the sigil",
			],
			charges: 0,
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
		image: "/generated/effects/arcane-sigil.webp",
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
			history: "Tracked through the Bureau's restricted-inscription registry.",
			curse: "",
			personality: "Sorrowful, weeping mana.",
			current_owner: "Available through Bureau-licensed artificer studios.",
			prior_owners: ["An unknown rogue Awakened"],
		},
		flavor: "They won't stop bleeding.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			special_abilities: [
				"Passive: Cannot be surprised while conscious",
				"Active: Cast Shield as a reaction (1/short rest)",
			],
			restrictions: [
				"Socket type: armor",
				"Inscription DC: 12 (Rift Calligraphy Brush)",
				"Material cost: 100gp",
			],
			damage_profile: "See active effect",
			condition: "Stunning",
			ability: "Agility",
			lattice_interaction:
				"Inscribed using Rift Calligraphy Brush — bonds with item's mana lattice",
			stat_bonuses: {},
		},
		limitations: {
			uses: "Permanent while socketed",
			requires_attunement: false,
			consumable: false,
			cost: 100,
			recharge: "Active ability recharges per rest",
			conditions: [
				"Max sigils per item: 2 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 17 check or destroys the sigil",
			],
			charges: 0,
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
		image: "/generated/effects/darkness-shroud.webp",
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
			history: "Entered into the Bureau's controlled-inscription ledger.",
			curse: "",
			personality: "Proud and unyielding.",
			current_owner: "Heavily guarded in the Bureau's Armory.",
			prior_owners: ["Bureau Shared-Materiel Archive"],
		},
		flavor: "Burn away the impurities.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			special_abilities: [
				"Passive: Cannot be surprised while conscious",
				"Active: Reduce incoming damage by 1d10 as a reaction (Proficiency/long rest)",
			],
			restrictions: [
				"Socket type: gloves",
				"Inscription DC: 15 (Shadow Quill)",
				"Material cost: 2500gp",
			],
			damage_profile: "See active effect",
			condition: "Lethargy",
			ability: "Sense",
			lattice_interaction:
				"Inscribed using Shadow Quill — bonds with item's mana lattice",
			stat_bonuses: {},
		},
		limitations: {
			uses: "Permanent while socketed",
			requires_attunement: false,
			consumable: false,
			cost: 2500,
			recharge: "Active ability recharges per rest",
			conditions: [
				"Max sigils per item: 3 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 20 check or destroys the sigil",
			],
			charges: 0,
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
		image: "/generated/effects/arcane-sigil.webp",
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
			history: "Documented in the Hunter Bureau's archivist-access manual.",
			curse: "",
			personality: "Dormant and silent.",
			current_owner: "Held by a rogue guild.",
			prior_owners: ["Guild Master Kael"],
		},
		flavor: "The chill of the grave.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			special_abilities: [
				"Passive: +1 to attack rolls",
				"Active: Create dim light in 20-foot radius for 10 minutes (at will)",
			],
			restrictions: [
				"Socket type: helm",
				"Inscription DC: 15 (Void Stylus)",
				"Material cost: 2500gp",
			],
			damage_profile: "See active effect",
			condition: "Blindness",
			ability: "Agility",
			lattice_interaction:
				"Inscribed using Void Stylus — bonds with item's mana lattice",
			stat_bonuses: {},
		},
		limitations: {
			uses: "Permanent while socketed",
			requires_attunement: false,
			consumable: false,
			cost: 2500,
			recharge: "Active ability recharges per rest",
			conditions: [
				"Max sigils per item: 2 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 20 check or destroys the sigil",
			],
			charges: 0,
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
		image: "/generated/effects/arcane-sigil.webp",
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
			history: "Catalogued in the Artificer Guild's closed-reference volume.",
			curse: "",
			personality: "Dormant and silent.",
			current_owner: "Lost to the depths of a high-tier dungeon.",
			prior_owners: ["Guild Master Kael"],
		},
		flavor: "The storm's fury.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			special_abilities: [
				"Passive: Cannot be surprised while conscious",
				"Active: Grant one ally within 30 feet temporary HP equal to your level (1/short rest)",
			],
			restrictions: [
				"Socket type: helm",
				"Inscription DC: 13 (Arcane Chisel)",
				"Material cost: 1000gp",
			],
			damage_profile: "See active effect",
			condition: "Lethargy",
			ability: "Intelligence",
			lattice_interaction:
				"Inscribed using Arcane Chisel — bonds with item's mana lattice",
			stat_bonuses: {},
		},
		limitations: {
			uses: "Permanent while socketed",
			requires_attunement: false,
			consumable: false,
			cost: 1000,
			recharge: "Active ability recharges per rest",
			conditions: [
				"Max sigils per item: 2 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 18 check or destroys the sigil",
			],
			charges: 0,
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
		image: "/generated/effects/arcane-sigil.webp",
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
			history: "Tracked through the Bureau's restricted-inscription registry.",
			curse: "",
			personality: "Dormant and silent.",
			current_owner: "Heavily guarded in the Bureau's Armory.",
			prior_owners: ["Archmage Valerius"],
		},
		flavor: "The light burns away the rot.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			special_abilities: [
				"Passive: Advantage on death saving throws",
				"Active: Heal 2d8+2 HP as a bonus action (1/short rest)",
			],
			restrictions: [
				"Socket type: accessory",
				"Inscription DC: 13 (Shadow Quill)",
				"Material cost: 500gp",
			],
			damage_profile: "See active effect",
			condition: "Stunning",
			ability: "Sense",
			lattice_interaction:
				"Inscribed using Shadow Quill — bonds with item's mana lattice",
			stat_bonuses: {},
		},
		limitations: {
			uses: "Permanent while socketed",
			requires_attunement: false,
			consumable: false,
			cost: 500,
			recharge: "Active ability recharges per rest",
			conditions: [
				"Max sigils per item: 1 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 18 check or destroys the sigil",
			],
			charges: 0,
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
		image: "/generated/effects/darkness-shroud.webp",
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
			history: "Tracked through the Bureau's restricted-inscription registry.",
			curse: "",
			personality: "Proud and unyielding.",
			current_owner: "Currently unaccounted for.",
			prior_owners: ["The Obsidian Vanguard"],
		},
		flavor: "Silence is a weapon.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			special_abilities: [
				"Passive: Resistance to cold damage",
				"Active: Automatically succeed on next ability check of a chosen type (1/long rest)",
			],
			restrictions: [
				"Socket type: boots",
				"Inscription DC: 19 (Rift Calligraphy Brush)",
				"Material cost: 2500gp",
			],
			damage_profile: "See active effect",
			condition: "Fear",
			ability: "Intelligence",
			lattice_interaction:
				"Inscribed using Rift Calligraphy Brush — bonds with item's mana lattice",
			stat_bonuses: {},
		},
		limitations: {
			uses: "Permanent while socketed",
			requires_attunement: false,
			consumable: false,
			cost: 2500,
			recharge: "Active ability recharges per rest",
			conditions: [
				"Max sigils per item: 3 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 24 check or destroys the sigil",
			],
			charges: 0,
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
		image: "/generated/effects/arcane-sigil.webp",
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
			history: "Catalogued in the Artificer Guild's closed-reference volume.",
			curse: "",
			personality: "Hungry for ambient magic.",
			current_owner: "Lost to the depths of a high-tier dungeon.",
			prior_owners: ["An unknown rogue Awakened"],
		},
		flavor: "The shield holds.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			special_abilities: [
				"Passive: +2 to Intelligence checks",
				"Active: Add 1d8 radiant damage to weapon attacks for 1 minute (1/long rest)",
			],
			restrictions: [
				"Socket type: weapon",
				"Inscription DC: 17 (Crystal Engraver)",
				"Material cost: 50gp",
			],
			damage_profile: "See active effect",
			condition: "Fear",
			ability: "Agility",
			lattice_interaction:
				"Inscribed using Crystal Engraver — bonds with item's mana lattice",
			stat_bonuses: {},
		},
		limitations: {
			uses: "Permanent while socketed",
			requires_attunement: false,
			consumable: false,
			cost: 50,
			recharge: "Active ability recharges per rest",
			conditions: [
				"Max sigils per item: 2 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 22 check or destroys the sigil",
			],
			charges: 0,
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
		image: "/generated/effects/darkness-shroud.webp",
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
			history: "Tracked through the Bureau's restricted-inscription registry.",
			curse: "",
			personality: "Dormant and silent.",
			current_owner: "Currently unaccounted for.",
			prior_owners: ["Bureau Artifact Vault"],
		},
		flavor: "Hold the line.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			special_abilities: [
				"Passive: +1 to AC",
				"Active: Gain +2 AC for 1 minute (1/long rest)",
			],
			restrictions: [
				"Socket type: gloves",
				"Inscription DC: 13 (Rift Calligraphy Brush)",
				"Material cost: 1000gp",
			],
			damage_profile: "See active effect",
			condition: "Fear",
			ability: "Agility",
			lattice_interaction:
				"Inscribed using Rift Calligraphy Brush — bonds with item's mana lattice",
			stat_bonuses: {},
		},
		limitations: {
			uses: "Permanent while socketed",
			requires_attunement: false,
			consumable: false,
			cost: 1000,
			recharge: "Active ability recharges per rest",
			conditions: [
				"Max sigils per item: 3 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 18 check or destroys the sigil",
			],
			charges: 0,
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
		image: "/generated/effects/arcane-sigil.webp",
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
			history: "Documented in the Hunter Bureau's archivist-access manual.",
			curse: "",
			personality: "Hungry for ambient magic.",
			current_owner: "Heavily guarded in the Bureau's Armory.",
			prior_owners: ["Warden Thorne", "A-Rank Hunter 'Ghost'"],
		},
		flavor: "Cooler heads prevail.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			special_abilities: [
				"Passive: +2 to Sense (Perception)",
				"Active: Gain +2 AC for 1 minute (1/long rest)",
			],
			restrictions: [
				"Socket type: boots",
				"Inscription DC: 12 (Crystal Engraver)",
				"Material cost: 1000gp",
			],
			damage_profile: "See active effect",
			condition: "Fear",
			ability: "Intelligence",
			lattice_interaction:
				"Inscribed using Crystal Engraver — bonds with item's mana lattice",
			stat_bonuses: {},
		},
		limitations: {
			uses: "Permanent while socketed",
			requires_attunement: false,
			consumable: false,
			cost: 1000,
			recharge: "Active ability recharges per rest",
			conditions: [
				"Max sigils per item: 1 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 17 check or destroys the sigil",
			],
			charges: 0,
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
		image: "/generated/effects/arcane-sigil.webp",
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
			history: "Documented in the Hunter Bureau's archivist-access manual.",
			curse: "",
			personality: "Chaotic and unpredictable.",
			current_owner: "Currently unaccounted for.",
			prior_owners: ["Archmage Valerius"],
		},
		flavor: "The cold will not claim me.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			special_abilities: [
				"Passive: Resistance to lightning damage",
				"Active: Impose disadvantage on next attack against you (Proficiency/long rest)",
			],
			restrictions: [
				"Socket type: shield",
				"Inscription DC: 20 (Arcane Chisel)",
				"Material cost: 2500gp",
			],
			damage_profile: "See active effect",
			condition: "Fear",
			ability: "Intelligence",
			lattice_interaction:
				"Inscribed using Arcane Chisel — bonds with item's mana lattice",
			stat_bonuses: {},
		},
		limitations: {
			uses: "Permanent while socketed",
			requires_attunement: false,
			consumable: false,
			cost: 2500,
			recharge: "Active ability recharges per rest",
			conditions: [
				"Max sigils per item: 2 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 25 check or destroys the sigil",
			],
			charges: 0,
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
		image: "/generated/effects/arcane-sigil.webp",
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
			history: "Tracked through the Bureau's restricted-inscription registry.",
			curse: "",
			personality: "Proud and unyielding.",
			current_owner: "Heavily guarded in the Bureau's Armory.",
			prior_owners: ["Warden Thorne", "A-Rank Hunter 'Ghost'"],
		},
		flavor: "The storm breaks upon me.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			special_abilities: [
				"Passive: Ignore difficult terrain",
				"Active: Teleport 15 feet as a bonus action (Proficiency/long rest)",
			],
			restrictions: [
				"Socket type: weapon",
				"Inscription DC: 21 (Void Stylus)",
				"Material cost: 2500gp",
			],
			damage_profile: "See active effect",
			condition: "Lethargy",
			ability: "Agility",
			lattice_interaction:
				"Inscribed using Void Stylus — bonds with item's mana lattice",
			stat_bonuses: {},
		},
		limitations: {
			uses: "Permanent while socketed",
			requires_attunement: false,
			consumable: false,
			cost: 2500,
			recharge: "Active ability recharges per rest",
			conditions: [
				"Max sigils per item: 2 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 26 check or destroys the sigil",
			],
			charges: 0,
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
		image: "/generated/effects/darkness-shroud.webp",
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
			history: "Archived in the Guild's secured inscription reference.",
			curse: "",
			personality: "Dormant and silent.",
			current_owner: "Held by licensed Hunter Guild supply offices.",
			prior_owners: ["Guild Master Kael"],
		},
		flavor: "Weightless steps.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			special_abilities: [
				"Passive: Resistance to fire damage",
				"Active: Add 1d8 radiant damage to weapon attacks for 1 minute (1/long rest)",
			],
			restrictions: [
				"Socket type: armor",
				"Inscription DC: 19 (Rift Calligraphy Brush)",
				"Material cost: 250gp",
			],
			damage_profile: "See active effect",
			condition: "Lethargy",
			ability: "Intelligence",
			lattice_interaction:
				"Inscribed using Rift Calligraphy Brush — bonds with item's mana lattice",
			stat_bonuses: {},
		},
		limitations: {
			uses: "Permanent while socketed",
			requires_attunement: false,
			consumable: false,
			cost: 250,
			recharge: "Active ability recharges per rest",
			conditions: [
				"Max sigils per item: 2 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 24 check or destroys the sigil",
			],
			charges: 0,
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
		image: "/generated/effects/darkness-shroud.webp",
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
			history: "Archived in the Guild's secured inscription reference.",
			curse: "",
			personality: "Aggressive and volatile.",
			current_owner: "Heavily guarded in the Bureau's Armory.",
			prior_owners: ["Guild Master Kael"],
		},
		flavor: "Perfect clarity.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			special_abilities: [
				"Passive: Darkvision 30 feet",
				"Active: Gain +2 AC for 1 minute (1/long rest)",
			],
			restrictions: [
				"Socket type: shield",
				"Inscription DC: 17 (Arcane Chisel)",
				"Material cost: 1000gp",
			],
			damage_profile: "See active effect",
			condition: "Stunning",
			ability: "Intelligence",
			lattice_interaction:
				"Inscribed using Arcane Chisel — bonds with item's mana lattice",
			stat_bonuses: {},
		},
		limitations: {
			uses: "Permanent while socketed",
			requires_attunement: false,
			consumable: false,
			cost: 1000,
			recharge: "Active ability recharges per rest",
			conditions: [
				"Max sigils per item: 3 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 22 check or destroys the sigil",
			],
			charges: 0,
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
		image: "/generated/effects/darkness-shroud.webp",
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
			history: "Catalogued in the Artificer Guild's closed-reference volume.",
			curse: "",
			personality: "Hungry for ambient magic.",
			current_owner: "Lost to the depths of a high-tier dungeon.",
			prior_owners: ["Warden Thorne", "A-Rank Hunter 'Ghost'"],
		},
		flavor: "Nothing escapes your gaze.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			special_abilities: [
				"Passive: Resistance to necrotic damage",
				"Active: Create a 10-foot zone of difficult terrain (2/long rest)",
			],
			restrictions: [
				"Socket type: accessory",
				"Inscription DC: 19 (Void Stylus)",
				"Material cost: 2500gp",
			],
			damage_profile: "See active effect",
			condition: "Stunning",
			ability: "Agility",
			lattice_interaction:
				"Inscribed using Void Stylus — bonds with item's mana lattice",
			stat_bonuses: {},
		},
		limitations: {
			uses: "Permanent while socketed",
			requires_attunement: false,
			consumable: false,
			cost: 2500,
			recharge: "Active ability recharges per rest",
			conditions: [
				"Max sigils per item: 1 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 24 check or destroys the sigil",
			],
			charges: 0,
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
		image: "/generated/effects/darkness-shroud.webp",
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
			history: "Entered into the Bureau's controlled-inscription ledger.",
			curse:
				"Each activation permanently reduces the user's maximum HP by 1, imperceptible until it's too late.",
			personality: "Requires a calibrated socket to stabilize.",
			current_owner: "Held by a rogue guild.",
			prior_owners: ["Warden Thorne", "A-Rank Hunter 'Ghost'"],
		},
		flavor: "Strike first.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			special_abilities: [
				"Passive: Darkvision 30 feet",
				"Active: Heal 2d8+2 HP as a bonus action (1/short rest)",
			],
			restrictions: [
				"Socket type: gloves",
				"Inscription DC: 18 (Arcane Chisel)",
				"Material cost: 1000gp",
			],
			damage_profile: "See active effect",
			condition: "Paralysis",
			ability: "Sense",
			lattice_interaction:
				"Inscribed using Arcane Chisel — bonds with item's mana lattice",
			stat_bonuses: {},
		},
		limitations: {
			uses: "Permanent while socketed",
			requires_attunement: false,
			consumable: false,
			cost: 1000,
			recharge: "Active ability recharges per rest",
			conditions: [
				"Max sigils per item: 3 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 23 check or destroys the sigil",
			],
			charges: 0,
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
		image: "/generated/effects/arcane-sigil.webp",
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
			history: "Archived in the Guild's secured inscription reference.",
			curse: "",
			personality: "Dormant and silent.",
			current_owner: "Heavily guarded in the Bureau's Armory.",
			prior_owners: ["Archmage Valerius"],
		},
		flavor: "Unbreakable strength.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			special_abilities: [
				"Passive: +5 temporary HP on short rest",
				"Active: Create dim light in 20-foot radius for 10 minutes (at will)",
			],
			restrictions: [
				"Socket type: boots",
				"Inscription DC: 14 (Arcane Chisel)",
				"Material cost: 1000gp",
			],
			damage_profile: "See active effect",
			condition: "Lethargy",
			ability: "Intelligence",
			lattice_interaction:
				"Inscribed using Arcane Chisel — bonds with item's mana lattice",
			stat_bonuses: {},
		},
		limitations: {
			uses: "Permanent while socketed",
			requires_attunement: false,
			consumable: false,
			cost: 1000,
			recharge: "Active ability recharges per rest",
			conditions: [
				"Max sigils per item: 1 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 19 check or destroys the sigil",
			],
			charges: 0,
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
		image: "/generated/effects/arcane-sigil.webp",
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
			history: "Archived in the Guild's secured inscription reference.",
			curse: "",
			personality: "Dormant and silent.",
			current_owner: "Wielded by Vanguard Hunters.",
			prior_owners: ["The Obsidian Vanguard"],
		},
		flavor: "Bow before authority.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			special_abilities: [
				"Passive: +2 to Sense (Perception)",
				"Active: Cast Shield as a reaction (1/short rest)",
			],
			restrictions: [
				"Socket type: accessory",
				"Inscription DC: 19 (Rift Calligraphy Brush)",
				"Material cost: 500gp",
			],
			damage_profile: "See active effect",
			condition: "Lethargy",
			ability: "Sense",
			lattice_interaction:
				"Inscribed using Rift Calligraphy Brush — bonds with item's mana lattice",
			stat_bonuses: {},
		},
		limitations: {
			uses: "Permanent while socketed",
			requires_attunement: false,
			consumable: false,
			cost: 500,
			recharge: "Active ability recharges per rest",
			conditions: [
				"Max sigils per item: 2 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 24 check or destroys the sigil",
			],
			charges: 0,
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
		image: "/generated/effects/darkness-shroud.webp",
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
			history: "Documented in the Hunter Bureau's archivist-access manual.",
			curse: "",
			personality: "Resonates only with lattice-compatible host items.",
			current_owner: "Held by a rogue guild.",
			prior_owners: ["Warden Thorne", "A-Rank Hunter 'Ghost'"],
		},
		flavor: "An unending well of power.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			special_abilities: [
				"Passive: +1 to saving throws",
				"Active: Gain advantage on next saving throw (2/short rest)",
			],
			restrictions: [
				"Socket type: helm",
				"Inscription DC: 16 (Shadow Quill)",
				"Material cost: 2500gp",
			],
			damage_profile: "See active effect",
			condition: "Fear",
			ability: "Agility",
			lattice_interaction:
				"Inscribed using Shadow Quill — bonds with item's mana lattice",
			stat_bonuses: {},
		},
		limitations: {
			uses: "Permanent while socketed",
			requires_attunement: false,
			consumable: false,
			cost: 2500,
			recharge: "Active ability recharges per rest",
			conditions: [
				"Max sigils per item: 2 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 21 check or destroys the sigil",
			],
			charges: 0,
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
		image: "/generated/effects/arcane-sigil.webp",
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
			history: "Archived in the Guild's secured inscription reference.",
			curse: "",
			personality: "Hungry for ambient magic.",
			current_owner: "Currently unaccounted for.",
			prior_owners: ["Warden Thorne", "A-Rank Hunter 'Ghost'"],
		},
		flavor: "Serve me in death.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			special_abilities: [
				"Passive: +2 to Agility checks",
				"Active: Teleport 15 feet as a bonus action (Proficiency/long rest)",
			],
			restrictions: [
				"Socket type: gloves",
				"Inscription DC: 17 (Mana Etching Needle)",
				"Material cost: 2500gp",
			],
			damage_profile: "See active effect",
			condition: "Fear",
			ability: "Agility",
			lattice_interaction:
				"Inscribed using Mana Etching Needle — bonds with item's mana lattice",
			stat_bonuses: {},
		},
		limitations: {
			uses: "Permanent while socketed",
			requires_attunement: false,
			consumable: false,
			cost: 2500,
			recharge: "Active ability recharges per rest",
			conditions: [
				"Max sigils per item: 2 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 22 check or destroys the sigil",
			],
			charges: 0,
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
		image: "/generated/effects/arcane-sigil.webp",
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
			history: "Entered into the Bureau's controlled-inscription ledger.",
			curse: "",
			personality: "Sorrowful, weeping mana.",
			current_owner: "Currently unaccounted for.",
			prior_owners: ["An unknown rogue Awakened"],
		},
		flavor: "Refuse to fall.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			special_abilities: [
				"Passive: Resistance to cold damage",
				"Active: Move 10 additional feet without provoking opportunity attacks (at will)",
			],
			restrictions: [
				"Socket type: armor",
				"Inscription DC: 21 (Crystal Engraver)",
				"Material cost: 50gp",
			],
			damage_profile: "See active effect",
			condition: "Stunning",
			ability: "Agility",
			lattice_interaction:
				"Inscribed using Crystal Engraver — bonds with item's mana lattice",
			stat_bonuses: {},
		},
		limitations: {
			uses: "Permanent while socketed",
			requires_attunement: false,
			consumable: false,
			cost: 50,
			recharge: "Active ability recharges per rest",
			conditions: [
				"Max sigils per item: 3 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 26 check or destroys the sigil",
			],
			charges: 0,
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
		image: "/generated/effects/darkness-shroud.webp",
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
			history: "Tracked through the Bureau's restricted-inscription registry.",
			curse: "",
			personality: "Proud and unyielding.",
			current_owner: "Lost to the depths of a high-tier dungeon.",
			prior_owners: ["Archmage Valerius"],
		},
		flavor:
			"Corrodes the certainty of outcomes. The death of hesitation, made manifest.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			special_abilities: [
				"Passive: +5 feet movement speed",
				"Active: Create dim light in 20-foot radius for 10 minutes (at will)",
			],
			restrictions: [
				"Socket type: helm",
				"Inscription DC: 19 (Shadow Quill)",
				"Material cost: 500gp",
			],
			damage_profile: "See active effect",
			condition: "Lethargy",
			ability: "Agility",
			lattice_interaction:
				"Inscribed using Shadow Quill — bonds with item's mana lattice",
			stat_bonuses: {},
		},
		limitations: {
			uses: "Permanent while socketed",
			requires_attunement: false,
			consumable: false,
			cost: 500,
			recharge: "Active ability recharges per rest",
			conditions: [
				"Max sigils per item: 1 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 24 check or destroys the sigil",
			],
			charges: 0,
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
		image: "/generated/effects/arcane-sigil.webp",
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
			history: "Documented in the Hunter Bureau's archivist-access manual.",
			curse: "",
			personality: "Chaotic and unpredictable.",
			current_owner: "Lost to the depths of a high-tier dungeon.",
			prior_owners: ["Guild Master Kael"],
		},
		flavor: "The freeze breaks against you.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			special_abilities: [
				"Passive: +1 to attack rolls",
				"Active: Reduce incoming damage by 1d10 as a reaction (Proficiency/long rest)",
			],
			restrictions: [
				"Socket type: weapon",
				"Inscription DC: 21 (Crystal Engraver)",
				"Material cost: 50gp",
			],
			damage_profile: "See active effect",
			condition: "Lethargy",
			ability: "Agility",
			lattice_interaction:
				"Inscribed using Crystal Engraver — bonds with item's mana lattice",
			stat_bonuses: {},
		},
		limitations: {
			uses: "Permanent while socketed",
			requires_attunement: false,
			consumable: false,
			cost: 50,
			recharge: "Active ability recharges per rest",
			conditions: [
				"Max sigils per item: 3 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 26 check or destroys the sigil",
			],
			charges: 0,
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
		image: "/generated/effects/darkness-shroud.webp",
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
			history: "Entered into the Bureau's controlled-inscription ledger.",
			curse: "",
			personality: "Coldly analytical.",
			current_owner: "Wielded by Vanguard Hunters.",
			prior_owners: ["Bureau Shared-Materiel Archive"],
		},
		flavor: "The storm ignored.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			special_abilities: [
				"Passive: Resistance to lightning damage",
				"Active: Gain +2 AC for 1 minute (1/long rest)",
			],
			restrictions: [
				"Socket type: accessory",
				"Inscription DC: 17 (Void Stylus)",
				"Material cost: 250gp",
			],
			damage_profile: "See active effect",
			condition: "Stunning",
			ability: "Sense",
			lattice_interaction:
				"Inscribed using Void Stylus — bonds with item's mana lattice",
			stat_bonuses: {},
		},
		limitations: {
			uses: "Permanent while socketed",
			requires_attunement: false,
			consumable: false,
			cost: 250,
			recharge: "Active ability recharges per rest",
			conditions: [
				"Max sigils per item: 2 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 22 check or destroys the sigil",
			],
			charges: 0,
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
		image: "/generated/effects/darkness-shroud.webp",
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
			history: "Documented in the Hunter Bureau's archivist-access manual.",
			curse: "",
			personality: "Resonates only with lattice-compatible host items.",
			current_owner: "Wielded by Vanguard Hunters.",
			prior_owners: ["Archmage Valerius"],
		},
		flavor: "Nothing sticks.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			special_abilities: [
				"Passive: Resistance to lightning damage",
				"Active: Grant one ally within 30 feet temporary HP equal to your level (1/short rest)",
			],
			restrictions: [
				"Socket type: gloves",
				"Inscription DC: 11 (Arcane Chisel)",
				"Material cost: 50gp",
			],
			damage_profile: "See active effect",
			condition: "Fear",
			ability: "Intelligence",
			lattice_interaction:
				"Inscribed using Arcane Chisel — bonds with item's mana lattice",
			stat_bonuses: {},
		},
		limitations: {
			uses: "Permanent while socketed",
			requires_attunement: false,
			consumable: false,
			cost: 50,
			recharge: "Active ability recharges per rest",
			conditions: [
				"Max sigils per item: 1 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 16 check or destroys the sigil",
			],
			charges: 0,
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
		image: "/generated/effects/arcane-sigil.webp",
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
			history: "Tracked through the Bureau's restricted-inscription registry.",
			curse: "",
			personality: "Aggressive and volatile.",
			current_owner: "Available through Bureau-licensed artificer studios.",
			prior_owners: ["An unknown rogue Awakened"],
		},
		flavor: "A pure heart.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			special_abilities: [
				"Passive: Resistance to lightning damage",
				"Active: Deal 1d8 lightning damage to attacker when hit (passive trigger)",
			],
			restrictions: [
				"Socket type: helm",
				"Inscription DC: 12 (Rift Calligraphy Brush)",
				"Material cost: 1000gp",
			],
			damage_profile: "See active effect",
			condition: "Paralysis",
			ability: "Intelligence",
			lattice_interaction:
				"Inscribed using Rift Calligraphy Brush — bonds with item's mana lattice",
			stat_bonuses: {},
		},
		limitations: {
			uses: "Permanent while socketed",
			requires_attunement: false,
			consumable: false,
			cost: 1000,
			recharge: "Active ability recharges per rest",
			conditions: [
				"Max sigils per item: 2 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 17 check or destroys the sigil",
			],
			charges: 0,
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
		image: "/generated/effects/arcane-sigil.webp",
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
			history: "Documented in the Hunter Bureau's archivist-access manual.",
			curse: "",
			personality: "Aggressive and volatile.",
			current_owner: "Heavily guarded in the Bureau's Armory.",
			prior_owners: ["Warden Thorne", "A-Rank Hunter 'Ghost'"],
		},
		flavor: "Quiet resilience.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			special_abilities: [
				"Passive: Resistance to fire damage",
				"Active: Gain advantage on next saving throw (2/short rest)",
			],
			restrictions: [
				"Socket type: boots",
				"Inscription DC: 13 (Mana Etching Needle)",
				"Material cost: 2500gp",
			],
			damage_profile: "See active effect",
			condition: "Fear",
			ability: "Sense",
			lattice_interaction:
				"Inscribed using Mana Etching Needle — bonds with item's mana lattice",
			stat_bonuses: {},
		},
		limitations: {
			uses: "Permanent while socketed",
			requires_attunement: false,
			consumable: false,
			cost: 2500,
			recharge: "Active ability recharges per rest",
			conditions: [
				"Max sigils per item: 1 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 18 check or destroys the sigil",
			],
			charges: 0,
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
		image: "/generated/effects/arcane-sigil.webp",
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
			history: "Documented in the Hunter Bureau's archivist-access manual.",
			curse: "",
			personality: "Sorrowful, weeping mana.",
			current_owner: "Held by a rogue guild.",
			prior_owners: ["Guild Master Kael"],
		},
		flavor: "Unbreakable presence.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			special_abilities: [
				"Passive: Resistance to fire damage",
				"Active: Create dim light in 20-foot radius for 10 minutes (at will)",
			],
			restrictions: [
				"Socket type: gloves",
				"Inscription DC: 18 (Shadow Quill)",
				"Material cost: 500gp",
			],
			damage_profile: "See active effect",
			condition: "Paralysis",
			ability: "Agility",
			lattice_interaction:
				"Inscribed using Shadow Quill — bonds with item's mana lattice",
			stat_bonuses: {},
		},
		limitations: {
			uses: "Permanent while socketed",
			requires_attunement: false,
			consumable: false,
			cost: 500,
			recharge: "Active ability recharges per rest",
			conditions: [
				"Max sigils per item: 2 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 23 check or destroys the sigil",
			],
			charges: 0,
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
		image: "/generated/effects/arcane-sigil.webp",
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
			history: "Catalogued in the Artificer Guild's closed-reference volume.",
			curse: "",
			personality: "Chaotic and unpredictable.",
			current_owner: "Held by a rogue guild.",
			prior_owners: ["Guild Master Kael"],
		},
		flavor: "My thoughts are my own.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			special_abilities: [
				"Passive: Resistance to psychic damage",
				"Active: Heal 2d8+2 HP as a bonus action (1/short rest)",
			],
			restrictions: [
				"Socket type: armor",
				"Inscription DC: 18 (Mana Etching Needle)",
				"Material cost: 250gp",
			],
			damage_profile: "See active effect",
			condition: "Fear",
			ability: "Intelligence",
			lattice_interaction:
				"Inscribed using Mana Etching Needle — bonds with item's mana lattice",
			stat_bonuses: {},
		},
		limitations: {
			uses: "Permanent while socketed",
			requires_attunement: false,
			consumable: false,
			cost: 250,
			recharge: "Active ability recharges per rest",
			conditions: [
				"Max sigils per item: 1 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 23 check or destroys the sigil",
			],
			charges: 0,
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
		image: "/generated/effects/darkness-shroud.webp",
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
			history: "Documented in the Hunter Bureau's archivist-access manual.",
			curse: "",
			personality: "Hungry for ambient magic.",
			current_owner: "Distributed by Bureau-certified inscription workshops.",
			prior_owners: ["The Obsidian Vanguard"],
		},
		flavor: "Nothing stands in the way.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			special_abilities: [
				"Passive: Cannot be surprised while conscious",
				"Active: Create a 10-foot zone of difficult terrain (2/long rest)",
			],
			restrictions: [
				"Socket type: gloves",
				"Inscription DC: 10 (Void Stylus)",
				"Material cost: 1000gp",
			],
			damage_profile: "See active effect",
			condition: "Blindness",
			ability: "Intelligence",
			lattice_interaction:
				"Inscribed using Void Stylus — bonds with item's mana lattice",
			stat_bonuses: {},
		},
		limitations: {
			uses: "Permanent while socketed",
			requires_attunement: false,
			consumable: false,
			cost: 1000,
			recharge: "Active ability recharges per rest",
			conditions: [
				"Max sigils per item: 1 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 15 check or destroys the sigil",
			],
			charges: 0,
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
		image: "/generated/effects/arcane-sigil.webp",
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
			history: "Entered into the Bureau's controlled-inscription ledger.",
			curse: "",
			personality: "Sorrowful, weeping mana.",
			current_owner: "Held by a rogue guild.",
			prior_owners: ["Archmage Valerius"],
		},
		flavor: "Shatter their foundations.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			special_abilities: [
				"Passive: +5 temporary HP on short rest",
				"Active: Deal 2d6 bonus fire damage on next hit (2/short rest)",
			],
			restrictions: [
				"Socket type: boots",
				"Inscription DC: 19 (Mana Etching Needle)",
				"Material cost: 1000gp",
			],
			damage_profile: "See active effect",
			condition: "Blindness",
			ability: "Agility",
			lattice_interaction:
				"Inscribed using Mana Etching Needle — bonds with item's mana lattice",
			stat_bonuses: {},
		},
		limitations: {
			uses: "Permanent while socketed",
			requires_attunement: false,
			consumable: false,
			cost: 1000,
			recharge: "Active ability recharges per rest",
			conditions: [
				"Max sigils per item: 3 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 24 check or destroys the sigil",
			],
			charges: 0,
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
		image: "/generated/effects/arcane-sigil.webp",
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
			history: "Documented in the Hunter Bureau's archivist-access manual.",
			curse: "",
			personality: "Sorrowful, weeping mana.",
			current_owner: "Wielded by Vanguard Hunters.",
			prior_owners: ["Hunter Academy Reference Collection"],
		},
		flavor: "There's nowhere to hide.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			special_abilities: [
				"Passive: Resistance to necrotic damage",
				"Active: Reduce incoming damage by 1d10 as a reaction (Proficiency/long rest)",
			],
			restrictions: [
				"Socket type: accessory",
				"Inscription DC: 13 (Mana Etching Needle)",
				"Material cost: 250gp",
			],
			damage_profile: "See active effect",
			condition: "Paralysis",
			ability: "Intelligence",
			lattice_interaction:
				"Inscribed using Mana Etching Needle — bonds with item's mana lattice",
			stat_bonuses: {},
		},
		limitations: {
			uses: "Permanent while socketed",
			requires_attunement: false,
			consumable: false,
			cost: 250,
			recharge: "Active ability recharges per rest",
			conditions: [
				"Max sigils per item: 2 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 18 check or destroys the sigil",
			],
			charges: 0,
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
		image: "/generated/effects/darkness-shroud.webp",
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
			history: "Tracked through the Bureau's restricted-inscription registry.",
			curse: "",
			personality: "Aggressive and volatile.",
			current_owner: "Held by a rogue guild.",
			prior_owners: ["Guild Master Kael"],
		},
		flavor: "Distance is safety.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			special_abilities: [
				"Passive: +1d6 to first damage roll each turn",
				"Active: Cast Shield as a reaction (1/short rest)",
			],
			restrictions: [
				"Socket type: shield",
				"Inscription DC: 19 (Rift Calligraphy Brush)",
				"Material cost: 250gp",
			],
			damage_profile: "See active effect",
			condition: "Stunning",
			ability: "Agility",
			lattice_interaction:
				"Inscribed using Rift Calligraphy Brush — bonds with item's mana lattice",
			stat_bonuses: {},
		},
		limitations: {
			uses: "Permanent while socketed",
			requires_attunement: false,
			consumable: false,
			cost: 250,
			recharge: "Active ability recharges per rest",
			conditions: [
				"Max sigils per item: 2 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 24 check or destroys the sigil",
			],
			charges: 0,
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
		image: "/generated/effects/arcane-sigil.webp",
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
			history: "Tracked through the Bureau's restricted-inscription registry.",
			curse: "",
			personality: "Hungry for ambient magic.",
			current_owner: "Lost to the depths of a high-tier dungeon.",
			prior_owners: ["Archmage Valerius"],
		},
		flavor: "A heavy toll.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			special_abilities: [
				"Passive: +1d6 to first damage roll each turn",
				"Active: Teleport 15 feet as a bonus action (Proficiency/long rest)",
			],
			restrictions: [
				"Socket type: weapon",
				"Inscription DC: 19 (Void Stylus)",
				"Material cost: 2500gp",
			],
			damage_profile: "See active effect",
			condition: "Blindness",
			ability: "Agility",
			lattice_interaction:
				"Inscribed using Void Stylus — bonds with item's mana lattice",
			stat_bonuses: {},
		},
		limitations: {
			uses: "Permanent while socketed",
			requires_attunement: false,
			consumable: false,
			cost: 2500,
			recharge: "Active ability recharges per rest",
			conditions: [
				"Max sigils per item: 2 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 24 check or destroys the sigil",
			],
			charges: 0,
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
		image: "/generated/effects/darkness-shroud.webp",
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
			history: "Entered into the Bureau's controlled-inscription ledger.",
			curse: "",
			personality: "Hungry for ambient magic.",
			current_owner: "Stocked at Guild-credentialed materiel counters.",
			prior_owners: ["Bureau Shared-Materiel Archive"],
		},
		flavor: "Precision of the unseen.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			special_abilities: [
				"Passive: +1d4 to initiative rolls",
				"Active: Grant one ally within 30 feet temporary HP equal to your level (1/short rest)",
			],
			restrictions: [
				"Socket type: weapon",
				"Inscription DC: 12 (Shadow Quill)",
				"Material cost: 100gp",
			],
			damage_profile: "See active effect",
			condition: "Paralysis",
			ability: "Sense",
			lattice_interaction:
				"Inscribed using Shadow Quill — bonds with item's mana lattice",
			stat_bonuses: {},
		},
		limitations: {
			uses: "Permanent while socketed",
			requires_attunement: false,
			consumable: false,
			cost: 100,
			recharge: "Active ability recharges per rest",
			conditions: [
				"Max sigils per item: 2 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 17 check or destroys the sigil",
			],
			charges: 0,
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
		image: "/generated/effects/darkness-shroud.webp",
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
			history: "Entered into the Bureau's controlled-inscription ledger.",
			curse: "",
			personality: "Coldly analytical.",
			current_owner: "Wielded by Vanguard Hunters.",
			prior_owners: ["Archmage Valerius"],
		},
		flavor: "Refuse to yield.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			special_abilities: [
				"Passive: +5 temporary HP on short rest",
				"Active: Automatically succeed on next ability check of a chosen type (1/long rest)",
			],
			restrictions: [
				"Socket type: accessory",
				"Inscription DC: 10 (Void Stylus)",
				"Material cost: 500gp",
			],
			damage_profile: "See active effect",
			condition: "Paralysis",
			ability: "Intelligence",
			lattice_interaction:
				"Inscribed using Void Stylus — bonds with item's mana lattice",
			stat_bonuses: {},
		},
		limitations: {
			uses: "Permanent while socketed",
			requires_attunement: false,
			consumable: false,
			cost: 500,
			recharge: "Active ability recharges per rest",
			conditions: [
				"Max sigils per item: 2 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 15 check or destroys the sigil",
			],
			charges: 0,
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
		image: "/generated/effects/darkness-shroud.webp",
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
			history: "Documented in the Hunter Bureau's archivist-access manual.",
			curse: "",
			personality: "Dormant and silent.",
			current_owner: "Wielded by Vanguard Hunters.",
			prior_owners: ["Warden Thorne", "A-Rank Hunter 'Ghost'"],
		},
		flavor: "Catch me if you can.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			special_abilities: [
				"Passive: +1d4 to initiative rolls",
				"Active: Deal 2d6 bonus fire damage on next hit (2/short rest)",
			],
			restrictions: [
				"Socket type: shield",
				"Inscription DC: 12 (Crystal Engraver)",
				"Material cost: 1000gp",
			],
			damage_profile: "See active effect",
			condition: "Blindness",
			ability: "Agility",
			lattice_interaction:
				"Inscribed using Crystal Engraver — bonds with item's mana lattice",
			stat_bonuses: {},
		},
		limitations: {
			uses: "Permanent while socketed",
			requires_attunement: false,
			consumable: false,
			cost: 1000,
			recharge: "Active ability recharges per rest",
			conditions: [
				"Max sigils per item: 3 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 17 check or destroys the sigil",
			],
			charges: 0,
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
		image: "/generated/effects/arcane-sigil.webp",
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
			history: "Tracked through the Bureau's restricted-inscription registry.",
			curse: "",
			personality: "Coldly analytical.",
			current_owner: "Heavily guarded in the Bureau's Armory.",
			prior_owners: ["Archmage Valerius"],
		},
		flavor: "Look terror in the eye.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			special_abilities: [
				"Passive: +2 to Strength checks",
				"Active: Deal 2d6 bonus fire damage on next hit (2/short rest)",
			],
			restrictions: [
				"Socket type: boots",
				"Inscription DC: 19 (Mana Etching Needle)",
				"Material cost: 100gp",
			],
			damage_profile: "See active effect",
			condition: "Stunning",
			ability: "Sense",
			lattice_interaction:
				"Inscribed using Mana Etching Needle — bonds with item's mana lattice",
			stat_bonuses: {},
		},
		limitations: {
			uses: "Permanent while socketed",
			requires_attunement: false,
			consumable: false,
			cost: 100,
			recharge: "Active ability recharges per rest",
			conditions: [
				"Max sigils per item: 2 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 24 check or destroys the sigil",
			],
			charges: 0,
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
		image: "/generated/effects/arcane-sigil.webp",
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
			history: "Documented in the Hunter Bureau's archivist-access manual.",
			curse: "",
			personality: "Resonates only with lattice-compatible host items.",
			current_owner: "Wielded by Vanguard Hunters.",
			prior_owners: ["The Obsidian Vanguard"],
		},
		flavor: "Like hitting a mountain.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			special_abilities: [
				"Passive: Resistance to cold damage",
				"Active: Gain advantage on next saving throw (2/short rest)",
			],
			restrictions: [
				"Socket type: boots",
				"Inscription DC: 11 (Crystal Engraver)",
				"Material cost: 50gp",
			],
			damage_profile: "See active effect",
			condition: "Stunning",
			ability: "Sense",
			lattice_interaction:
				"Inscribed using Crystal Engraver — bonds with item's mana lattice",
			stat_bonuses: {},
		},
		limitations: {
			uses: "Permanent while socketed",
			requires_attunement: false,
			consumable: false,
			cost: 50,
			recharge: "Active ability recharges per rest",
			conditions: [
				"Max sigils per item: 1 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 16 check or destroys the sigil",
			],
			charges: 0,
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
		image: "/generated/effects/arcane-sigil.webp",
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
			history: "Catalogued in the Artificer Guild's closed-reference volume.",
			curse: "",
			personality: "Coldly analytical.",
			current_owner: "Held by a rogue guild.",
			prior_owners: ["Guild Historical Registry"],
		},
		flavor: "Nothing remains hidden.",
		mechanics: {
			action_type: "Passive (socketed) / See active ability",
			type: "Sigil",
			duration: "While socketed/inscribed",
			action: "None (passive) / Varies (active)",
			special_abilities: [
				"Passive: Resistance to psychic damage",
				"Active: Create a 10-foot zone of difficult terrain (2/long rest)",
			],
			restrictions: [
				"Socket type: gloves",
				"Inscription DC: 11 (Mana Etching Needle)",
				"Material cost: 2500gp",
			],
			damage_profile: "See active effect",
			condition: "Stunning",
			ability: "Sense",
			lattice_interaction:
				"Inscribed using Mana Etching Needle — bonds with item's mana lattice",
			stat_bonuses: {},
		},
		limitations: {
			uses: "Permanent while socketed",
			requires_attunement: false,
			consumable: false,
			cost: 2500,
			recharge: "Active ability recharges per rest",
			conditions: [
				"Max sigils per item: 3 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 16 check or destroys the sigil",
			],
			charges: 0,
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
		image: "/generated/effects/arcane-sigil.webp",
	},
];
