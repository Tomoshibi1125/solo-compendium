import type { CompendiumSigil } from "../../types/compendium";

export const sigils: CompendiumSigil[] = [
	{
		id: "sigil-sharpness-1",
		name: "Sigil of the Razor Wind",
		source_book: "Rift Ascendant Canon",
		description:
			"A Bureau-engraved sigil that sharpens a blade continuously with ambient wind mana.",
		rarity: "common",
		image: "/generated/effects/darkness-shroud.webp",
		effects: {
			primary:
				"Ignores first 2 points of damage reduction or physical resistance on weapon hits",
			secondary: "None",
		},
		lore: {
			current_owner: "Issued via the Guild's rank-appropriate supply chain.",
			curse: "",
			history:
				"Catalogued in the Technomancer Guild's closed-reference volume. The Sigil of the Razor Wind's service record notes as much.",
			origin:
				"Entered into the Bureau's dermal-inscription registry after initial trials.",
			personality:
				"Binds cleanly to an authorized socket on first inscription.",
			prior_owners: ["Guild Historical Registry"],
		},
		flavor: "Cut through the noise.",
		discovery_lore:
			"Recovered from the corpse of a wind-elemental anomaly that had been hunting Ascendants in the Northern Rifts.",
		tags: ["sigil", "weapon", "offensive", "physical"],
		can_inscribe_on: ["weapon"],
		effect_description:
			"Passive: Ignores the first 2 points of a target's damage reduction or physical resistance.",
		inscription_difficulty: 10,
		limitations: {
			requires_attunement: false,
			charges: 0,
			conditions: [
				"Max sigils per item: 3 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 16 check or destroys the sigil",
			],
			consumable: false,
			cost: 2500,
			recharge: "Active ability recharges per rest",
			uses: "Permanent while socketed",
		},
		mechanics: {
			type: "Sigil",
			ability: "Agility",
			action: "None (passive)",
			action_type: "Passive (socketed)",
			condition: "None",
			damage_profile: "Ignores DR/resistance, no direct damage bonus",
			duration: "While socketed/inscribed",
			lattice_interaction:
				"Inscribed using Void Stylus — bonds with item's mana lattice",
			restrictions: [
				"Socket type: weapon",
				"Inscription DC: 11 (Void Stylus)",
				"Material cost: 2,500 Gate Credits",
			],
			special_abilities: [
				"Passive: Ignores first 2 points of target's damage reduction or physical resistance on each hit",
			],
			stat_bonuses: {},
		},
		passive_bonuses: { damage_bonus: 1 },
	},
	{
		id: "sigil-impact-1",
		name: "Sigil of the Crushing Mountain",
		source_book: "Rift Ascendant Canon",
		description:
			"Infuses the weapon with earth mana, making it strike with the weight of falling rock.",
		rarity: "common",
		image: "/generated/effects/arcane-sigil.webp",
		effects: {
			primary:
				"On critical hit, target falls Prone (DC 15 Strength save, Large or smaller)",
			secondary: "None",
		},
		lore: {
			current_owner: "Lost to the depths of a high-tier dungeon.",
			curse: "",
			history:
				"Archived in the Guild's secured inscription reference. That much survives in the Sigil of the Crushing Mountain's field history.",
			origin:
				"Salvaged from crushed gravity-crystals found in the Ruins of the Old World.",
			personality: "Chaotic and unpredictable.",
			prior_owners: ["Warden Thorne", "A-Rank Ascendant 'Ghost'"],
		},
		flavor: "The weight of the earth.",
		discovery_lore:
			"Salvaged from the crushed gravity-crystals of an Old World ruin where a gravity-golem anomaly had been dormant for centuries.",
		tags: ["sigil", "weapon", "force"],
		can_inscribe_on: ["weapon"],
		effect_description:
			"Passive: Whenever you score a critical hit, the force knocks the target prone if they are Large or smaller.",
		inscription_difficulty: 10,
		limitations: {
			requires_attunement: false,
			charges: 0,
			conditions: [
				"Max sigils per item: 2 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 17 check or destroys the sigil",
			],
			consumable: false,
			cost: 2500,
			recharge: "Active ability recharges per rest",
			uses: "Permanent while socketed",
		},
		mechanics: {
			type: "Sigil",
			ability: "Strength",
			action: "None (passive)",
			action_type: "Passive (socketed)",
			condition: "Prone",
			damage_profile: "No direct damage bonus, adds Prone on crit",
			duration: "While socketed/inscribed",
			lattice_interaction:
				"Inscribed using Shadow Quill — bonds with item's mana lattice",
			restrictions: [
				"Socket type: weapon",
				"Inscription DC: 12 (Shadow Quill)",
				"Material cost: 2,500 Gate Credits",
			],
			special_abilities: [
				"Passive: On critical hit, target must succeed on DC 15 Strength save or fall Prone (Large or smaller only)",
			],
			stat_bonuses: {},
		},
		passive_bonuses: { attack_bonus: 1 },
	},
	{
		id: "sigil-bleeding-1",
		name: "Sigil of the Crimson Weeping",
		source_book: "Rift Ascendant Canon",
		description:
			"A jagged, thorn-like glyph that forces ambient mana to violently reject biological tissue.",
		rarity: "uncommon",
		image: "/generated/effects/darkness-shroud.webp",
		effects: {
			primary:
				"Slashing/piercing hits cause 1d4 bleed damage at start of target's next turn",
			secondary: "Bleeding damage is necrotic type",
		},
		lore: {
			current_owner: "Available through Bureau-licensed Technomancer studios.",
			curse: "",
			history:
				"Tracked through the Bureau's restricted-inscription registry. The Sigil of the Crimson Weeping's service record notes as much.",
			origin:
				"Outlawed in seventy-two countries due to its horrific lingering effects on unawakened tissue.",
			personality: "Sorrowful, weeping mana.",
			prior_owners: ["An unknown Assassin Awakened"],
		},
		flavor: "They won't stop bleeding.",
		discovery_lore:
			"Confiscated from a rogue Technomancer operating in the Amazon Rift Zone who was using it to torture captured anomalies.",
		tags: ["sigil", "weapon", "necrotic"],
		can_inscribe_on: ["weapon"],
		effect_description:
			"Passive: Slashing or piercing damage inflicted by this weapon causes the target to bleed, losing 1d4 HP at the start of their next turn.",
		inscription_difficulty: 13,
		limitations: {
			requires_attunement: false,
			charges: 0,
			conditions: [
				"Max sigils per item: 2 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 17 check or destroys the sigil",
			],
			consumable: false,
			cost: 100,
			recharge: "Active ability recharges per rest",
			uses: "Permanent while socketed",
		},
		mechanics: {
			type: "Sigil",
			ability: "Agility",
			action: "None (passive)",
			action_type: "Passive (socketed)",
			condition: "Bleeding",
			damage_profile: "Adds 1d4 necrotic bleed damage over time",
			duration: "While socketed/inscribed",
			lattice_interaction:
				"Inscribed using Rift Calligraphy Brush — bonds with item's mana lattice",
			restrictions: [
				"Socket type: weapon",
				"Inscription DC: 12 (Rift Calligraphy Brush)",
				"Material cost: 100 Gate Credits",
			],
			special_abilities: [
				"Passive: Slashing or piercing hits cause target to bleed, losing 1d4 HP at start of their next turn",
			],
			stat_bonuses: {},
		},
		passive_bonuses: {
			damage_bonus: "1d4 necrotic",
			traits: ["Bleeding (1d4, 1 round)"],
		},
	},
	{
		id: "sigil-fire-1",
		name: "Sigil of the Salamander's Breath",
		source_book: "Rift Ascendant Canon",
		description:
			"Bathes the weapon in magical flames drawn directly from the Elemental Plane of Fire.",
		rarity: "uncommon",
		image: "/generated/effects/arcane-sigil.webp",
		effects: {
			primary:
				"Activated attack deals +2d6 fire damage, bypasses standard fire resistance",
			secondary: "Bonus action to activate, 1/short rest",
		},
		lore: {
			current_owner: "Heavily guarded in the Bureau's Armory.",
			curse: "",
			history:
				"Entered into the Bureau's controlled-inscription ledger. The Sigil of the Salamander's Breath's service record notes as much.",
			origin:
				"Refined from the ashes of a Fire-Class Anomaly's heart extracted during a massive raid in Johannesburg.",
			personality: "Proud and unyielding.",
			prior_owners: ["Bureau Shared-Materiel Archive"],
		},
		flavor: "Burn away the impurities.",
		discovery_lore:
			"Extracted from the crystallized heart of a Fire-Class Anomaly during the Johannesburg raid, refined by Academy pyromancers.",
		tags: ["sigil", "weapon", "fire"],
		active_feature:
			"Salamander's Strike: As a bonus action, imbue your next weapon attack with fire. Deals +2d6 fire damage. (1/short rest)",
		can_inscribe_on: ["weapon"],
		effect_description:
			"Active: Once per short rest, convert all physical damage of your next attack into Fire damage, bypassing standard resistance.",
		effect_type: "active",
		inscription_difficulty: 13,
		limitations: {
			requires_attunement: false,
			charges: 0,
			conditions: [
				"Max sigils per item: 3 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 20 check or destroys the sigil",
			],
			consumable: false,
			cost: 2500,
			recharge: "Active ability recharges per rest",
			uses: "Permanent while socketed",
		},
		mechanics: {
			type: "Sigil",
			ability: "Agility",
			action: "Bonus action to activate",
			action_type: "Active (bonus action) / 1/short rest",
			condition: "Burning",
			damage_profile: "+2d6 fire damage on activated attack",
			duration: "While socketed/inscribed",
			lattice_interaction:
				"Inscribed using Shadow Quill — bonds with item's mana lattice",
			restrictions: [
				"Socket type: weapon",
				"Inscription DC: 15 (Shadow Quill)",
				"Material cost: 2,500 Gate Credits",
			],
			special_abilities: [
				"Active: Imbue next weapon attack with +2d6 fire damage, bypasses standard fire resistance (1/short rest)",
			],
			stat_bonuses: {},
		},
		passive_bonuses: {
			traits: ["Bypasses standard fire resistance"],
		},
	},
	{
		id: "sigil-frost-1",
		name: "Sigil of the Winter Court",
		source_book: "Rift Ascendant Canon",
		description:
			"The weapon leaves magical frost trails in the air, chilling the blood of those it strikes.",
		rarity: "uncommon",
		image: "/generated/effects/arcane-sigil.webp",
		effects: {
			primary:
				"On hit, target movement speed reduced by 5 feet until end of their next turn (does not stack)",
			secondary: "None",
		},
		lore: {
			current_owner: "Held by an Assassin guild.",
			curse: "",
			history:
				"Documented in the Ascendant Bureau's archivist-access manual. That much survives in the Sigil of the Winter Court's field history.",
			origin:
				"Engineered in the Siberian dead-zones where frost magic is key to survival.",
			personality: "Dormant and silent.",
			prior_owners: ["Guild Master Kael"],
		},
		flavor: "The chill of the grave.",
		discovery_lore:
			"Engineered by Siberian survivalists in the dead-zones where frost magic is essential for anomaly containment.",
		tags: ["sigil", "weapon", "cold"],
		can_inscribe_on: ["weapon"],
		effect_description:
			"Passive: Hitting an enemy reduces their movement speed by 5 feet until the end of their next turn. Does not stack.",
		inscription_difficulty: 13,
		limitations: {
			requires_attunement: false,
			charges: 0,
			conditions: [
				"Max sigils per item: 2 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 20 check or destroys the sigil",
			],
			consumable: false,
			cost: 2500,
			recharge: "Active ability recharges per rest",
			uses: "Permanent while socketed",
		},
		mechanics: {
			type: "Sigil",
			ability: "Agility",
			action: "None (passive)",
			action_type: "Passive (socketed)",
			condition: "Slowed",
			damage_profile: "No direct damage bonus, adds slow effect",
			duration: "While socketed/inscribed",
			lattice_interaction:
				"Inscribed using Void Stylus — bonds with item's mana lattice",
			restrictions: [
				"Socket type: weapon",
				"Inscription DC: 15 (Void Stylus)",
				"Material cost: 2,500 Gate Credits",
			],
			special_abilities: [
				"Passive: On hit, target's movement speed reduced by 5 feet until end of their next turn (does not stack)",
			],
			stat_bonuses: {},
		},
		passive_bonuses: {
			traits: ["Slow (5ft, 1 round)"],
		},
	},
	{
		id: "sigil-lightning-1",
		name: "Sigil of the Thunder-Bird",
		source_book: "Rift Ascendant Canon",
		description:
			"Sparks of storm mana constantly arc across the weapon's surface.",
		rarity: "uncommon",
		image: "/generated/effects/arcane-sigil.webp",
		effects: {
			primary:
				"Activated attack deals +2d8 lightning damage, target loses reactions until start of next turn",
			secondary:
				"Double-hit on same target deals 1d8 lightning damage to adjacent enemy",
		},
		lore: {
			current_owner: "Lost to the depths of a high-tier dungeon.",
			curse: "",
			history:
				"Catalogued in the Technomancer Guild's closed-reference volume. The Sigil of the Thunder-Bird carried the story forward.",
			origin: "A traditional shamanic rune adapted by modern Guild enchanters.",
			personality: "Dormant and silent.",
			prior_owners: ["Guild Master Kael"],
		},
		flavor: "The storm's fury.",
		discovery_lore:
			"Adapted from traditional shamanic runes by Guild enchanters studying storm-elemental anomalies in the Pacific Rim.",
		tags: ["sigil", "weapon", "lightning"],
		active_feature:
			"Thunder-Bird's Call: As a bonus action, your next attack deals +2d8 lightning damage and the target cannot take reactions until the start of their next turn. (1/short rest)",
		can_inscribe_on: ["weapon"],
		effect_description:
			"Active: If you hit the same target twice in one turn, release a shockwave dealing 1d8 lightning damage to an adjacent enemy.",
		effect_type: "active",
		inscription_difficulty: 13,
		limitations: {
			requires_attunement: false,
			charges: 0,
			conditions: [
				"Max sigils per item: 2 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 18 check or destroys the sigil",
			],
			consumable: false,
			cost: 1000,
			recharge: "Active ability recharges per rest",
			uses: "Permanent while socketed",
		},
		mechanics: {
			type: "Sigil",
			ability: "Agility",
			action: "Bonus action to activate",
			action_type: "Active (bonus action) / 1/short rest",
			condition: "Stunned",
			damage_profile:
				"+2d8 lightning on activated attack, 1d8 lightning splash on double-hit",
			duration: "While socketed/inscribed",
			lattice_interaction:
				"Inscribed using Arcane Chisel — bonds with item's mana lattice",
			restrictions: [
				"Socket type: weapon",
				"Inscription DC: 13 (Arcane Chisel)",
				"Material cost: 1,000 Gate Credits",
			],
			special_abilities: [
				"Passive: If you hit same target twice in one turn, deal 1d8 lightning damage to adjacent enemy",
				"Active: Next attack deals +2d8 lightning damage, target cannot take reactions until start of their next turn (1/short rest)",
			],
			stat_bonuses: {},
		},
		passive_bonuses: { damage_bonus: "1d8 lightning on second hit per turn" },
	},
	{
		id: "sigil-holy-1",
		name: "Sigil of the Radiant Truth",
		source_book: "Rift Ascendant Canon",
		description:
			"A blessed inlay of pure silver that resonates aggressively with corrupted or necrotic essence.",
		rarity: "rare",
		image: "/generated/effects/darkness-shroud.webp",
		effects: {
			primary:
				"Against Anomaly/Shadow types, weapon damage die increases by one step",
			secondary:
				"Active: 15ft radiant pulse deals 3d8 radiant damage (CON DC 15 half), 1/long rest",
		},
		lore: {
			current_owner: "Heavily guarded in the Bureau's Armory.",
			curse: "",
			history:
				"Tracked through the Bureau's restricted-inscription registry. That much survives in the Sigil of the Radiant Truth's field history.",
			origin:
				"Sanctified by the High Priests of the Cathedral to purge the encroaching darkness of S-Rank gates.",
			personality: "Dormant and silent.",
			prior_owners: ["Archmage Valerius"],
		},
		flavor: "The light burns away the rot.",
		discovery_lore:
			"Sanctified by Holylight Cathedral High Priests during the purging of S-Rank gates in the Eastern Rift Zone.",
		tags: ["sigil", "weapon", "radiant"],
		active_feature:
			"Radiant Burst: As an action, emit a 15ft radiant pulse dealing 3d8 radiant damage (CON save for half) to anomaly/anomaly. (1/long rest)",
		can_inscribe_on: ["weapon"],
		effect_description:
			"Passive: Against Anomaly or Shadow-type anomalies, the weapon's damage die increases by one step (e.g., 1d6 becomes 1d8).",
		effect_type: "hybrid",
		inscription_difficulty: 13,
		limitations: {
			requires_attunement: false,
			charges: 0,
			conditions: [
				"Max sigils per item: 1 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 18 check or destroys the sigil",
			],
			consumable: false,
			cost: 500,
			recharge: "Active ability recharges per rest",
			uses: "Permanent while socketed",
		},
		mechanics: {
			type: "Sigil",
			ability: "Sense",
			action: "None (passive) / Action to activate",
			action_type: "Passive (socketed) / Active (action) / 1/long rest",
			condition: "Blinded",
			damage_profile:
				"Damage die step increase vs anomalies, 3d8 radiant burst on activation",
			duration: "While socketed/inscribed",
			lattice_interaction:
				"Inscribed using Shadow Quill — bonds with item's mana lattice",
			restrictions: [
				"Socket type: weapon",
				"Inscription DC: 13 (Shadow Quill)",
				"Material cost: 500 Gate Credits",
			],
			special_abilities: [
				"Passive: Against Anomaly or Shadow-type anomalies, weapon damage die increases by one step (1d6→1d8, 1d8→1d10, etc.)",
				"Active: Emit 15ft radiant pulse dealing 3d8 radiant damage (CON save DC 15 for half) to anomalies (1/long rest)",
			],
			stat_bonuses: {},
		},
		passive_bonuses: { damage_bonus: "1d6 radiant" },
	},
	{
		id: "sigil-shadow-1",
		name: "Sigil of the Void-Walker",
		source_book: "Rift Ascendant Canon",
		description:
			"Absorbs light in its immediate vicinity, rendering the weapon visually blurry and silent.",
		rarity: "rare",
		image: "/generated/effects/arcane-sigil.webp",
		effects: {
			primary:
				"Weapon attacks make no sound/light, do not break stealth when drawing",
			secondary: "Advantage on Stealth checks while weapon is equipped",
		},
		lore: {
			current_owner: "Currently unaccounted for.",
			curse: "",
			history:
				"Tracked through the Bureau's restricted-inscription registry. The Sigil of the Void-Walker's service record notes as much.",
			origin:
				"Carved from the obsidian bone shards of stealth-type assassins from the Shadow Domain.",
			personality: "Proud and unyielding.",
			prior_owners: ["The Obsidian Vanguard"],
		},
		flavor: "Silence is a weapon.",
		discovery_lore:
			"Carved from obsidian bone shards of stealth-type assassins from the Shadow Domain, recovered by Bureau agents.",
		tags: ["sigil", "weapon", "necrotic", "stealth"],
		can_inscribe_on: ["weapon"],
		effect_description:
			"Passive: Your attacks with this weapon make no sound and give off no light. You do not break stealth when drawing it.",
		inscription_difficulty: 13,
		limitations: {
			requires_attunement: false,
			charges: 0,
			conditions: [
				"Max sigils per item: 3 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 24 check or destroys the sigil",
			],
			consumable: false,
			cost: 2500,
			recharge: "Active ability recharges per rest",
			uses: "Permanent while socketed",
		},
		mechanics: {
			type: "Sigil",
			ability: "Agility",
			action: "None (passive)",
			action_type: "Passive (socketed)",
			condition: "None",
			damage_profile: "No direct damage bonus, adds stealth properties",
			duration: "While socketed/inscribed",
			lattice_interaction:
				"Inscribed using Rift Calligraphy Brush — bonds with item's mana lattice",
			restrictions: [
				"Socket type: weapon",
				"Inscription DC: 19 (Rift Calligraphy Brush)",
				"Material cost: 2,500 Gate Credits",
			],
			special_abilities: [
				"Passive: Weapon attacks make no sound and give off no light, do not break stealth when drawing",
			],
			stat_bonuses: {},
		},
		passive_bonuses: {
			traits: ["Advantage on Stealth checks"],
		},
	},
	{
		id: "sigil-ward-1",
		name: "Sigil of the Aegis",
		source_book: "Rift Ascendant Canon",
		description: "A circular lattice of force mana that repels striking blows.",
		rarity: "common",
		image: "/generated/effects/darkness-shroud.webp",
		effects: {
			primary: "Reduces damage taken from ranged weapon attacks by 3",
			secondary: "None",
		},
		lore: {
			current_owner: "Lost to the depths of a high-tier dungeon.",
			curse: "",
			history:
				"Catalogued in the Technomancer Guild's closed-reference volume. The Sigil of the Aegis's service record notes as much.",
			origin:
				"Standard issue for Guild operatives facing Anomaly archers and magical artillery.",
			personality: "Hungry for ambient magic.",
			prior_owners: ["An unknown Assassin Awakened"],
		},
		flavor: "The shield holds.",
		discovery_lore:
			"Standard issue for Guild operatives facing Anomaly archers and magical artillery in the Eastern Rift Zone.",
		tags: ["sigil", "armor", "defensive"],
		can_inscribe_on: ["armor", "shield"],
		effect_description:
			"Passive: Reduces damage taken from ranged weapon attacks by 3.",
		inscription_difficulty: 10,
		limitations: {
			requires_attunement: false,
			charges: 0,
			conditions: [
				"Max sigils per item: 2 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 22 check or destroys the sigil",
			],
			consumable: false,
			cost: 50,
			recharge: "Active ability recharges per rest",
			uses: "Permanent while socketed",
		},
		mechanics: {
			type: "Sigil",
			ability: "Agility",
			action: "None (passive)",
			action_type: "Passive (socketed)",
			condition: "None",
			damage_profile:
				"No direct damage bonus, reduces incoming ranged damage by 3",
			duration: "While socketed/inscribed",
			lattice_interaction:
				"Inscribed using Crystal Engraver — bonds with item's mana lattice",
			restrictions: [
				"Socket type: armor or shield",
				"Inscription DC: 17 (Crystal Engraver)",
				"Material cost: 50 Gate Credits",
			],
			special_abilities: [
				"Passive: Reduces damage taken from ranged weapon attacks by 3",
			],
			stat_bonuses: {},
		},
		passive_bonuses: { ac_bonus: 1 },
	},
	{
		id: "sigil-fortitude-1",
		name: "Sigil of the Unyielding",
		source_book: "Rift Ascendant Canon",
		description:
			"Taps into the bearer's mana core to subtly reinforce armor integrity when they are close to death.",
		rarity: "common",
		image: "/generated/effects/arcane-sigil.webp",
		effects: {
			primary: "While below 50% max HP, gain +1 bonus to Armor Class",
			secondary: "None",
		},
		lore: {
			current_owner: "Currently unaccounted for.",
			curse: "",
			history:
				"Tracked through the Bureau's restricted-inscription registry. That much survives in the Sigil of the Unyielding's field history.",
			origin:
				"Developed by healers attempting to keep critically wounded Ascendants alive long enough for Evacuation.",
			personality: "Dormant and silent.",
			prior_owners: ["Bureau Artifact Vault"],
		},
		flavor: "Hold the line.",
		discovery_lore:
			"Developed by Bureau healers attempting to keep critically wounded Ascendants alive long enough for Evacuation from Hell-Class gates.",
		tags: ["sigil", "armor", "vitality"],
		can_inscribe_on: ["armor"],
		effect_description:
			"Passive: While below 50% max HP, you gain a +1 bonus to Armor Class.",
		inscription_difficulty: 10,
		limitations: {
			requires_attunement: false,
			charges: 0,
			conditions: [
				"Max sigils per item: 3 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 18 check or destroys the sigil",
			],
			consumable: false,
			cost: 1000,
			recharge: "Active ability recharges per rest",
			uses: "Permanent while socketed",
		},
		mechanics: {
			type: "Sigil",
			ability: "Agility",
			action: "None (passive)",
			action_type: "Passive (socketed)",
			condition: "None",
			damage_profile:
				"No direct damage bonus, conditional AC bonus when below 50% HP",
			duration: "While socketed/inscribed",
			lattice_interaction:
				"Inscribed using Rift Calligraphy Brush — bonds with item's mana lattice",
			restrictions: [
				"Socket type: armor",
				"Inscription DC: 13 (Rift Calligraphy Brush)",
				"Material cost: 1,000 Gate Credits",
			],
			special_abilities: [
				"Passive: While below 50% max HP, gain +1 bonus to Armor Class",
			],
			stat_bonuses: {},
		},
		passive_bonuses: {
			traits: ["+1 AC when below 50% max HP"],
		},
	},
	{
		id: "sigil-res-fire-1",
		name: "Sigil of the Frost-Ward",
		source_book: "Rift Ascendant Canon",
		description:
			"A rune that continually absorbs and safely extinguishes ambient heat.",
		rarity: "uncommon",
		image: "/generated/effects/arcane-sigil.webp",
		effects: {
			primary: "Reduces all Fire damage taken by 5",
			secondary: "None",
		},
		lore: {
			current_owner: "Heavily guarded in the Bureau's Armory.",
			curse: "",
			history:
				"Documented in the Ascendant Bureau's archivist-access manual. That much survives in the Sigil of the Frost-Ward's field history.",
			origin:
				"Invented after a tragic eruption of a Red Gate composed of volcanic anomalies.",
			personality: "Hungry for ambient magic.",
			prior_owners: ["Warden Thorne", "A-Rank Ascendant 'Ghost'"],
		},
		flavor: "Cooler heads prevail.",
		discovery_lore:
			"Invented after a tragic eruption of a Red Gate composed of volcanic anomalies, now standard issue for fire-zone operations.",
		tags: ["sigil", "armor", "protection"],
		can_inscribe_on: ["armor"],
		effect_description: "Passive: Reduces all Fire damage taken by 5.",
		inscription_difficulty: 13,
		limitations: {
			requires_attunement: false,
			charges: 0,
			conditions: [
				"Max sigils per item: 1 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 17 check or destroys the sigil",
			],
			consumable: false,
			cost: 1000,
			recharge: "Active ability recharges per rest",
			uses: "Permanent while socketed",
		},
		mechanics: {
			type: "Sigil",
			ability: "Agility",
			action: "None (passive)",
			action_type: "Passive (socketed)",
			condition: "None",
			damage_profile:
				"No direct damage bonus, reduces incoming Fire damage by 5",
			duration: "While socketed/inscribed",
			lattice_interaction:
				"Inscribed using Crystal Engraver — bonds with item's mana lattice",
			restrictions: [
				"Socket type: armor",
				"Inscription DC: 12 (Crystal Engraver)",
				"Material cost: 1,000 Gate Credits",
			],
			special_abilities: ["Passive: Reduces all Fire damage taken by 5"],
			stat_bonuses: {},
		},
		passive_bonuses: {
			traits: ["Fire damage reduction: 5"],
		},
	},
	{
		id: "sigil-res-cold-1",
		name: "Sigil of the Hearth-Fire",
		source_book: "Rift Ascendant Canon",
		description:
			"Generates an invisible, hyper-localized thermal blanket across the armor's surface using innate mana.",
		rarity: "uncommon",
		image: "/generated/effects/arcane-sigil.webp",
		effects: {
			primary: "Reduces all Cold damage taken by 5",
			secondary: "None",
		},
		lore: {
			current_owner: "Currently unaccounted for.",
			curse: "",
			history:
				"Documented in the Ascendant Bureau's archivist-access manual. The Sigil of the Hearth-Fire carried the story forward.",
			origin:
				"Favored by ascendants operating in the Siberian outposts, where freezing to death is a greater threat than anomalies.",
			personality: "Chaotic and unpredictable.",
			prior_owners: ["Archmage Valerius"],
		},
		flavor: "The cold will not claim me.",
		discovery_lore:
			"Favored by Siberian outpost Ascendants where freezing to death is a greater threat than anomalies, now standard issue for cold-zone operations.",
		tags: ["sigil", "armor", "protection"],
		can_inscribe_on: ["armor"],
		effect_description: "Passive: Reduces all Cold damage taken by 5.",
		inscription_difficulty: 13,
		limitations: {
			requires_attunement: false,
			charges: 0,
			conditions: [
				"Max sigils per item: 2 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 25 check or destroys the sigil",
			],
			consumable: false,
			cost: 2500,
			recharge: "Active ability recharges per rest",
			uses: "Permanent while socketed",
		},
		mechanics: {
			type: "Sigil",
			ability: "Agility",
			action: "None (passive)",
			action_type: "Passive (socketed)",
			condition: "None",
			damage_profile:
				"No direct damage bonus, reduces incoming Cold damage by 5",
			duration: "While socketed/inscribed",
			lattice_interaction:
				"Inscribed using Arcane Chisel — bonds with item's mana lattice",
			restrictions: [
				"Socket type: armor",
				"Inscription DC: 20 (Arcane Chisel)",
				"Material cost: 2,500 Gate Credits",
			],
			special_abilities: ["Passive: Reduces all Cold damage taken by 5"],
			stat_bonuses: {},
		},
		passive_bonuses: {
			traits: ["Cold damage reduction: 5"],
		},
	},
	{
		id: "sigil-res-lightning-1",
		name: "Sigil of the Grounded Soul",
		source_book: "Rift Ascendant Canon",
		description:
			"A defensive ward that absorbs magical lightning and dissipates it harmlessly.",
		rarity: "uncommon",
		image: "/generated/effects/darkness-shroud.webp",
		effects: {
			primary: "Reduces all Lightning damage taken by 5",
			secondary: "None",
		},
		lore: {
			current_owner: "Heavily guarded in the Bureau's Armory.",
			curse: "",
			history:
				"Tracked through the Bureau's restricted-inscription registry. The Sigil of the Grounded Soul carried the story forward.",
			origin: "Built by reverse-engineering the scales of the Storm anomaly.",
			personality: "Proud and unyielding.",
			prior_owners: ["Warden Thorne", "A-Rank Ascendant 'Ghost'"],
		},
		flavor: "The storm breaks upon me.",
		discovery_lore:
			"Built by reverse-engineering the scales of the Storm anomaly after a catastrophic Pacific Rim event, now standard issue for storm-zone operations.",
		tags: ["sigil", "armor", "protection"],
		can_inscribe_on: ["armor"],
		effect_description: "Passive: Reduces all Lightning damage taken by 5.",
		inscription_difficulty: 13,
		limitations: {
			requires_attunement: false,
			charges: 0,
			conditions: [
				"Max sigils per item: 2 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 26 check or destroys the sigil",
			],
			consumable: false,
			cost: 2500,
			recharge: "Active ability recharges per rest",
			uses: "Permanent while socketed",
		},
		mechanics: {
			type: "Sigil",
			ability: "Agility",
			action: "None (passive)",
			action_type: "Passive (socketed)",
			condition: "None",
			damage_profile:
				"No direct damage bonus, reduces incoming Lightning damage by 5",
			duration: "While socketed/inscribed",
			lattice_interaction:
				"Inscribed using Void Stylus — bonds with item's mana lattice",
			restrictions: [
				"Socket type: armor",
				"Inscription DC: 21 (Void Stylus)",
				"Material cost: 2,500 Gate Credits",
			],
			special_abilities: ["Passive: Reduces all Lightning damage taken by 5"],
			stat_bonuses: {},
		},
		passive_bonuses: {
			traits: ["Lightning damage reduction: 5"],
		},
	},
	{
		id: "sigil-mobility-1",
		name: "Sigil of the Zephyr's Tread",
		source_book: "Rift Ascendant Canon",
		description:
			"Imbues boots or armor with wind magic, making the wearer's footsteps unnaturally light.",
		rarity: "uncommon",
		image: "/generated/effects/darkness-shroud.webp",
		effects: {
			primary:
				"Ignore difficult terrain penalties from rubble or natural ground",
			secondary: "None",
		},
		lore: {
			current_owner: "Held by licensed Ascendant Guild supply offices.",
			curse: "",
			history:
				"Archived in the Guild's secured inscription reference. The Sigil of the Zephyr's Tread's service record notes as much.",
			origin: "An agile enhancement favored by the Guild's scouting corps.",
			personality: "Dormant and silent.",
			prior_owners: ["Guild Master Kael"],
		},
		flavor: "Weightless steps.",
		discovery_lore:
			"An agile enhancement favored by the Guild's scouting corps for navigating treacherous dungeon environments and collapsed ruins.",
		tags: ["sigil", "armor", "utility"],
		can_inscribe_on: ["armor", "boots"],
		effect_description:
			"Passive: You ignore difficult terrain penalties created by rubble or natural ground.",
		inscription_difficulty: 13,
		limitations: {
			requires_attunement: false,
			charges: 0,
			conditions: [
				"Max sigils per item: 2 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 24 check or destroys the sigil",
			],
			consumable: false,
			cost: 250,
			recharge: "Active ability recharges per rest",
			uses: "Permanent while socketed",
		},
		mechanics: {
			type: "Sigil",
			ability: "Agility",
			action: "None (passive)",
			action_type: "Passive (socketed)",
			condition: "None",
			damage_profile: "No direct damage bonus, movement utility",
			duration: "While socketed/inscribed",
			lattice_interaction:
				"Inscribed using Rift Calligraphy Brush — bonds with item's mana lattice",
			restrictions: [
				"Socket type: armor or boots",
				"Inscription DC: 19 (Rift Calligraphy Brush)",
				"Material cost: 250 Gate Credits",
			],
			special_abilities: [
				"Passive: Ignore difficult terrain penalties created by rubble or natural ground",
			],
			stat_bonuses: {},
		},
		passive_bonuses: { speed_bonus: 10 },
	},
	{
		id: "sigil-intel-1",
		name: "Sigil of the Archmage's Clarity",
		source_book: "Rift Ascendant Canon",
		description:
			"Clears the mind of distraction, focusing the wearer's mana into pure deductive power.",
		rarity: "rare",
		image: "/generated/effects/darkness-shroud.webp",
		effects: {
			primary:
				"Advantage on Intelligence (Investigation) checks to identify enemy weaknesses",
			secondary: "None",
		},
		lore: {
			current_owner: "Heavily guarded in the Bureau's Armory.",
			curse: "",
			history:
				"Archived in the Guild's secured inscription reference. The Sigil of the Archmage's Clarity carried the story forward.",
			origin:
				"Created by a mage attempting to decode the language of the Rifts.",
			personality: "Aggressive and volatile.",
			prior_owners: ["Guild Master Kael"],
		},
		flavor: "Perfect clarity.",
		discovery_lore:
			"Created by an Academy mage attempting to decode the language of the Rifts, now used by intelligence analysts studying anomaly patterns.",
		tags: ["sigil", "accessory", "intelligence"],
		can_inscribe_on: ["accessory", "helmet"],
		effect_description:
			"Passive: You have advantage on Intelligence (Investigation) checks to identify enemy weaknesses.",
		inscription_difficulty: 13,
		limitations: {
			requires_attunement: false,
			charges: 0,
			conditions: [
				"Max sigils per item: 3 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 22 check or destroys the sigil",
			],
			consumable: false,
			cost: 1000,
			recharge: "Active ability recharges per rest",
			uses: "Permanent while socketed",
		},
		mechanics: {
			type: "Sigil",
			ability: "Intelligence",
			action: "None (passive)",
			action_type: "Passive (socketed)",
			condition: "None",
			damage_profile: "No direct damage bonus, investigative utility",
			duration: "While socketed/inscribed",
			lattice_interaction:
				"Inscribed using Arcane Chisel — bonds with item's mana lattice",
			restrictions: [
				"Socket type: accessory or helmet",
				"Inscription DC: 17 (Arcane Chisel)",
				"Material cost: 1,000 Gate Credits",
			],
			special_abilities: [
				"Passive: Advantage on Intelligence (Investigation) checks to identify enemy weaknesses",
			],
			stat_bonuses: {},
		},
		passive_bonuses: { intelligence_bonus: 1 },
	},
	{
		id: "sigil-sense-1",
		name: "Sigil of the Hawk's Vision",
		source_book: "Rift Ascendant Canon",
		description:
			"A magical lens effect that enhances the wearer's physical and mystical sight.",
		rarity: "rare",
		image: "/generated/effects/darkness-shroud.webp",
		effects: {
			primary:
				"Cannot be surprised by visible enemies, ranged attacks ignore half cover",
			secondary: "None",
		},
		lore: {
			current_owner: "Lost to the depths of a high-tier dungeon.",
			curse: "",
			history:
				"Catalogued in the Technomancer Guild's closed-reference volume. The Sigil of the Hawk's Vision carried the story forward.",
			origin:
				"An essential component for Stalker-class Ascendants defending the Safe Zones.",
			personality: "Hungry for ambient magic.",
			prior_owners: ["Warden Thorne", "A-Rank Ascendant 'Ghost'"],
		},
		flavor: "Nothing escapes your gaze.",
		discovery_lore:
			"An essential component for Stalker-class Ascendants defending the Safe Zones, recovered from a fallen guardian's equipment.",
		tags: ["sigil", "accessory", "sense"],
		can_inscribe_on: ["accessory", "goggles"],
		effect_description:
			"Passive: You cannot be surprised by visible enemies, and your ranged weapon attacks ignore half cover.",
		inscription_difficulty: 13,
		limitations: {
			requires_attunement: false,
			charges: 0,
			conditions: [
				"Max sigils per item: 1 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 24 check or destroys the sigil",
			],
			consumable: false,
			cost: 2500,
			recharge: "Active ability recharges per rest",
			uses: "Permanent while socketed",
		},
		mechanics: {
			type: "Sigil",
			ability: "Sense",
			action: "None (passive)",
			action_type: "Passive (socketed)",
			condition: "None",
			damage_profile: "No direct damage bonus, combat awareness utility",
			duration: "While socketed/inscribed",
			lattice_interaction:
				"Inscribed using Void Stylus — bonds with item's mana lattice",
			restrictions: [
				"Socket type: accessory or goggles",
				"Inscription DC: 19 (Void Stylus)",
				"Material cost: 2,500 Gate Credits",
			],
			special_abilities: [
				"Passive: Cannot be surprised by visible enemies, ranged attacks ignore half cover",
			],
			stat_bonuses: {},
		},
		passive_bonuses: { wisdom_bonus: 1 },
	},
	{
		id: "sigil-agility-1",
		name: "Sigil of the Wind-Walker",
		source_book: "Rift Ascendant Canon",
		description:
			"Enhances the wearer's reaction time by speeding up the flow of mana through their limbs.",
		rarity: "rare",
		image: "/generated/effects/arcane-sigil.webp",
		effects: {
			primary:
				"When taking the ready action, can move up to 10 feet as part of the reaction",
			secondary: "None",
		},
		lore: {
			current_owner: "Held by an Assassin guild.",
			curse:
				"Each activation permanently reduces the user's maximum HP by 1, imperceptible until it's too late.",
			history:
				"Entered into the Bureau's controlled-inscription ledger. The Sigil of the Wind-Walker's service record notes as much.",
			origin:
				"A favorite among Assassin-class Ascendants looking for the perfect opening.",
			personality: "Requires a calibrated socket to stabilize.",
			prior_owners: ["Warden Thorne", "A-Rank Ascendant 'Ghost'"],
		},
		flavor: "Strike first.",
		discovery_lore:
			"A favorite among Assassin-class Ascendants looking for the perfect opening, recovered from a Guild armory after a failed assassination attempt.",
		tags: ["sigil", "accessory", "agility"],
		can_inscribe_on: ["accessory", "armor"],
		effect_description:
			"Passive: When you take the ready action, you can move up to 10 feet as part of the reaction.",
		inscription_difficulty: 13,
		limitations: {
			requires_attunement: false,
			charges: 0,
			conditions: [
				"Max sigils per item: 3 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 23 check or destroys the sigil",
			],
			consumable: false,
			cost: 1000,
			recharge: "Active ability recharges per rest",
			uses: "Permanent while socketed",
		},
		mechanics: {
			type: "Sigil",
			ability: "Agility",
			action: "None (passive)",
			action_type: "Passive (socketed)",
			condition: "None",
			damage_profile: "No direct damage bonus, tactical movement utility",
			duration: "While socketed/inscribed",
			lattice_interaction:
				"Inscribed using Arcane Chisel — bonds with item's mana lattice",
			restrictions: [
				"Socket type: accessory or armor",
				"Inscription DC: 18 (Arcane Chisel)",
				"Material cost: 1,000 Gate Credits",
			],
			special_abilities: [
				"Passive: When taking the ready action, can move up to 10 feet as part of the reaction",
			],
			stat_bonuses: {},
		},
		passive_bonuses: { dexterity_bonus: 1 },
	},
	{
		id: "sigil-strength-1",
		name: "Sigil of the Titan's Grasp",
		source_book: "Rift Ascendant Canon",
		description:
			"A fierce magical enhancement that physically reinforces the wearer's lifting power.",
		rarity: "rare",
		image: "/generated/effects/arcane-sigil.webp",
		effects: {
			primary:
				"Count as one size category larger for grappling, shoving, and carrying capacity",
			secondary: "None",
		},
		lore: {
			current_owner: "Heavily guarded in the Bureau's Armory.",
			curse: "",
			history:
				"Archived in the Guild's secured inscription reference. That much survives in the Sigil of the Titan's Grasp's field history.",
			origin:
				"Used by Holy Knights to physically wrestle dungeon bosses to the ground.",
			personality: "Dormant and silent.",
			prior_owners: ["Archmage Valerius"],
		},
		flavor: "Unbreakable strength.",
		discovery_lore:
			"Used by Holy Knights to physically wrestle dungeon bosses to the ground, recovered from a battlefield where a S-Rank anomaly was subdued.",
		tags: ["sigil", "accessory", "strength"],
		can_inscribe_on: ["accessory", "gloves"],
		effect_description:
			"Passive: You count as one size category larger for the purposes of grappling, shoving, and carrying capacity.",
		inscription_difficulty: 13,
		limitations: {
			requires_attunement: false,
			charges: 0,
			conditions: [
				"Max sigils per item: 1 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 19 check or destroys the sigil",
			],
			consumable: false,
			cost: 1000,
			recharge: "Active ability recharges per rest",
			uses: "Permanent while socketed",
		},
		mechanics: {
			type: "Sigil",
			ability: "Strength",
			action: "None (passive)",
			action_type: "Passive (socketed)",
			condition: "None",
			damage_profile: "No direct damage bonus, physical enhancement utility",
			duration: "While socketed/inscribed",
			lattice_interaction:
				"Inscribed using Arcane Chisel — bonds with item's mana lattice",
			restrictions: [
				"Socket type: accessory or gloves",
				"Inscription DC: 14 (Arcane Chisel)",
				"Material cost: 1,000 Gate Credits",
			],
			special_abilities: [
				"Passive: Count as one size category larger for grappling, shoving, and carrying capacity",
			],
			stat_bonuses: {},
		},
		passive_bonuses: { strength_bonus: 1 },
	},
	{
		id: "sigil-presence-1",
		name: "Sigil of the Sovereign's Will",
		source_book: "Rift Ascendant Canon",
		description:
			"Projects an aura of overwhelming leadership and intimidating magical pressure.",
		rarity: "rare",
		image: "/generated/effects/darkness-shroud.webp",
		effects: {
			primary:
				"Hostile creatures must succeed on DC 13 Sense check to target you if ally within 5 feet",
			secondary: "None",
		},
		lore: {
			current_owner: "Wielded by Holy Knights.",
			curse: "",
			history:
				"Archived in the Guild's secured inscription reference. That much survives in the Sigil of the Sovereign's Will's field history.",
			origin:
				"Reserved for Guild Masters and those who lead raids into the Abyss.",
			personality: "Dormant and silent.",
			prior_owners: ["The Obsidian Vanguard"],
		},
		flavor: "Bow before authority.",
		discovery_lore:
			"Reserved for Guild Masters and those who lead raids into the Abyss, recovered from a fallen commander's cloak.",
		tags: ["sigil", "accessory", "presence"],
		can_inscribe_on: ["accessory", "cloak"],
		effect_description:
			"Passive: Hostile creatures must succeed on a DC 13 Sense check to target you if another ally is within 5 feet.",
		inscription_difficulty: 13,
		limitations: {
			requires_attunement: false,
			charges: 0,
			conditions: [
				"Max sigils per item: 2 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 24 check or destroys the sigil",
			],
			consumable: false,
			cost: 500,
			recharge: "Active ability recharges per rest",
			uses: "Permanent while socketed",
		},
		mechanics: {
			type: "Sigil",
			ability: "Presence",
			action: "None (passive)",
			action_type: "Passive (socketed)",
			condition: "None",
			damage_profile: "No direct damage bonus, defensive aura utility",
			duration: "While socketed/inscribed",
			lattice_interaction:
				"Inscribed using Rift Calligraphy Brush — bonds with item's mana lattice",
			restrictions: [
				"Socket type: accessory or cloak",
				"Inscription DC: 19 (Rift Calligraphy Brush)",
				"Material cost: 500 Gate Credits",
			],
			special_abilities: [
				"Passive: Hostile creatures must succeed on DC 13 Sense check to target you if another ally is within 5 feet",
			],
			stat_bonuses: {},
		},
		passive_bonuses: { charisma_bonus: 1 },
	},
	{
		id: "sigil-mana-regen-1",
		name: "Sigil of the Mana Font",
		source_book: "Rift Ascendant Canon",
		description:
			"Continuously draws ambient mana fragments from the surroundings to sustain the wearer.",
		rarity: "very_rare",
		image: "/generated/effects/arcane-sigil.webp",
		effects: {
			primary:
				"On critical hit, recover 1 expended Job resource or level 1 spell slot",
			secondary:
				"Active: Recover one spell slot of 3rd level or lower (bonus action, 1/long rest)",
		},
		lore: {
			current_owner: "Held by an Assassin guild.",
			curse: "",
			history:
				"Documented in the Ascendant Bureau's archivist-access manual. The Sigil of the Mana Font's service record notes as much.",
			origin:
				"Extremely rare; typically awarded only to National-Level Ascendants.",
			personality: "Resonates only with lattice-compatible host items.",
			prior_owners: ["Warden Thorne", "A-Rank Ascendant 'Ghost'"],
		},
		flavor: "An unending well of power.",
		discovery_lore:
			"Awarded only to National-Level Ascendants for exceptional service, recovered from a Bureau vault after the holder's retirement.",
		tags: ["sigil", "accessory", "mana"],
		active_feature:
			"Mana Font Surge: As a bonus action, recover one expended spell slot of 3rd level or lower. (1/long rest)",
		can_inscribe_on: ["accessory", "amulet"],
		effect_description:
			"Passive: Whenever you score a critical hit, recover 1 expended Job resource (or spell slot of level 1).",
		effect_type: "hybrid",
		inscription_difficulty: 16,
		limitations: {
			requires_attunement: false,
			charges: 0,
			conditions: [
				"Max sigils per item: 2 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 21 check or destroys the sigil",
			],
			consumable: false,
			cost: 2500,
			recharge: "Active ability recharges per rest",
			uses: "Permanent while socketed",
		},
		mechanics: {
			type: "Sigil",
			ability: "Intelligence",
			action: "None (passive) / Bonus action to activate",
			action_type: "Passive (socketed) / Active (bonus action) / 1/long rest",
			condition: "None",
			damage_profile: "No direct damage bonus, resource recovery utility",
			duration: "While socketed/inscribed",
			lattice_interaction:
				"Inscribed using Shadow Quill — bonds with item's mana lattice",
			restrictions: [
				"Socket type: accessory or amulet",
				"Inscription DC: 16 (Shadow Quill)",
				"Material cost: 2,500 Gate Credits",
			],
			special_abilities: [
				"Passive: On critical hit, recover 1 expended Job resource or spell slot of level 1",
				"Active: Recover one expended spell slot of 3rd level or lower (1/long rest)",
			],
			stat_bonuses: {},
		},
		passive_bonuses: {
			traits: ["Mana Regeneration (+1 spell slot recovery on short rest)"],
		},
	},
	{
		id: "sigil-shadow-king",
		name: "Sigil of the Shadow Regent",
		source_book: "Rift Ascendant Canon",
		description:
			"A pitch-black rune that seems to swallow the light around it, radiating pure necrotic mana.",
		rarity: "legendary",
		image: "/generated/effects/arcane-sigil.webp",
		effects: {
			primary:
				"Humanoid killed by this weapon rises as Shadow Minion under your control for 1 minute",
			secondary:
				"Active: Teleport up to 30 feet to space in dim light or darkness (bonus action, Proficiency/long rest)",
		},
		lore: {
			current_owner: "Currently unaccounted for.",
			curse: "",
			history:
				"Archived in the Guild's secured inscription reference. The Sigil of the Shadow Regent's service record notes as much.",
			origin:
				"A forbidden artifact; those who study its design too closely often lose their minds to the whispering dark.",
			personality: "Hungry for ambient magic.",
			prior_owners: ["Warden Thorne", "A-Rank Ascendant 'Ghost'"],
		},
		flavor: "Serve me in death.",
		discovery_lore:
			"A forbidden artifact from the Shadow Legion Archives, recovered by Bureau agents after its previous wielder lost their mind to the whispering dark.",
		tags: ["sigil", "weapon", "necrotic", "summoning"],
		active_feature:
			"Void Step: As a bonus action, teleport up to 30 feet to an unoccupied space you can see that is in dim light or darkness. (Proficiency/long rest)",
		can_inscribe_on: ["weapon"],
		effect_description:
			"Passive: Any humanoid killed by this weapon instantly rises as a Shadow Minion under your control for 1 minute.",
		effect_type: "hybrid",
		inscription_difficulty: 22,
		limitations: {
			requires_attunement: false,
			charges: 0,
			conditions: [
				"Max sigils per item: 2 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 22 check or destroys the sigil",
			],
			consumable: false,
			cost: 2500,
			recharge: "Active ability recharges per rest",
			uses: "Permanent while socketed",
		},
		mechanics: {
			type: "Sigil",
			ability: "Agility",
			action: "None (passive) / Bonus action to activate",
			action_type:
				"Passive (socketed) / Active (bonus action) / Proficiency/long rest",
			condition: "Frightened",
			damage_profile: "+2d6 necrotic damage, shadow minion summon on kill",
			duration: "While socketed/inscribed",
			lattice_interaction:
				"Inscribed using Mana Etching Needle — bonds with item's mana lattice",
			restrictions: [
				"Socket type: weapon",
				"Inscription DC: 17 (Mana Etching Needle)",
				"Material cost: 2,500 Gate Credits",
			],
			special_abilities: [
				"Passive: Any humanoid killed by this weapon instantly rises as a Shadow Minion under your control for 1 minute",
				"Active: Teleport up to 30 feet to unoccupied space in dim light or darkness (Proficiency/long rest)",
			],
			stat_bonuses: {},
		},
		passive_bonuses: { attack_bonus: 2, damage_bonus: "2d6 necrotic" },
	},
	{
		id: "sigil-immortality",
		name: "Sigil of the Undying Flame",
		source_book: "Rift Ascendant Canon",
		description:
			"A grand sigil of healing magic that binds the wearer's soul to their physical body.",
		rarity: "legendary",
		image: "/generated/effects/darkness-shroud.webp",
		effects: {
			primary:
				"If attack would reduce to 0 HP, instead reduce to 1 HP and release 20ft fiery explosion (4d10 Fire, DEX DC 15 half)",
			secondary:
				"When dropped to 0 HP, instead drop to 1 HP and gain temporary HP equal to level (1/long rest)",
		},
		lore: {
			current_owner: "Currently unaccounted for.",
			curse: "",
			history:
				"Entered into the Bureau's controlled-inscription ledger. The Sigil of the Undying Flame carried the story forward.",
			origin:
				"The ultimate safeguard for Ascendants entering uncharted Red Gates.",
			personality: "Sorrowful, weeping mana.",
			prior_owners: ["An unknown Assassin Awakened"],
		},
		flavor: "Refuse to fall.",
		discovery_lore:
			"The ultimate safeguard for Ascendants entering uncharted Red Gates, blessed by Holylight Cathedral High Priests.",
		tags: ["sigil", "armor", "vitality"],
		active_feature:
			"Undying Flame: When you drop to 0 HP, you instead drop to 1 HP and gain temporary HP equal to your level. (1/long rest)",
		can_inscribe_on: ["armor"],
		effect_description:
			"Passive: If an attack would reduce you to 0 HP, it instead reduces you to 1 HP, and releases a 20ft fiery explosion (4d10 Fire damage).",
		effect_type: "active",
		inscription_difficulty: 22,
		limitations: {
			requires_attunement: false,
			charges: 0,
			conditions: [
				"Max sigils per item: 3 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 26 check or destroys the sigil",
			],
			consumable: false,
			cost: 50,
			recharge: "Active ability recharges per rest",
			uses: "Permanent while socketed",
		},
		mechanics: {
			type: "Sigil",
			ability: "Vitality",
			action: "None (passive) / Triggers on dropping to 0 HP",
			action_type:
				"Passive (socketed) / Triggered (when dropped to 0 HP) / 1/long rest",
			condition: "Burning",
			damage_profile:
				"No direct damage bonus, defensive trigger with 4d10 Fire explosion",
			duration: "While socketed/inscribed",
			lattice_interaction:
				"Inscribed using Crystal Engraver — bonds with item's mana lattice",
			restrictions: [
				"Socket type: armor",
				"Inscription DC: 21 (Crystal Engraver)",
				"Material cost: 50 Gate Credits",
			],
			special_abilities: [
				"Passive: If attack would reduce you to 0 HP, instead reduce to 1 HP and release 20ft fiery explosion (4d10 Fire damage, DEX DC 15 half)",
				"Active: When dropped to 0 HP, instead drop to 1 HP and gain temporary HP equal to your level (1/long rest)",
			],
			stat_bonuses: {},
		},
		passive_bonuses: {
			traits: ["Undying Flame: Drop to 1 HP instead of 0 (1/long rest)"],
		},
	},
	{
		id: "sigil-res-fire-2",
		name: "Sigil of the Anomaly's Scale",
		source_book: "Rift Ascendant Canon",
		description:
			"An advanced ward that completely neutralizes ambient thermal magic.",
		rarity: "rare",
		image: "/generated/effects/arcane-sigil.webp",
		effects: {
			primary:
				"Grants Resistance to Fire damage; if already have resistance, gain Immunity instead",
			secondary: "None",
		},
		lore: {
			current_owner: "Lost to the depths of a high-tier dungeon.",
			curse: "",
			history:
				"Tracked through the Bureau's restricted-inscription registry. The Sigil of the Anomaly's Scale carried the story forward.",
			origin:
				"A necessity when traversing the deeper layers of Hell-Class gates.",
			personality: "Proud and unyielding.",
			prior_owners: ["Archmage Valerius"],
		},
		flavor:
			"Corrodes the certainty of outcomes. The death of hesitation, made manifest.",
		discovery_lore:
			"A necessity when traversing the deeper layers of Hell-Class gates, recovered from a fallen Ascendant's armor.",
		tags: ["sigil", "armor", "protection"],
		can_inscribe_on: ["armor"],
		effect_description:
			"Passive: Grants Resistance to Fire damage. If you already have resistance, you gain Immunity.",
		inscription_difficulty: 16,
		limitations: {
			requires_attunement: false,
			charges: 0,
			conditions: [
				"Max sigils per item: 1 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 24 check or destroys the sigil",
			],
			consumable: false,
			cost: 500,
			recharge: "Active ability recharges per rest",
			uses: "Permanent while socketed",
		},
		mechanics: {
			type: "Sigil",
			ability: "Agility",
			action: "None (passive)",
			action_type: "Passive (socketed)",
			condition: "None",
			damage_profile: "No direct damage bonus, Fire resistance/immunity",
			duration: "While socketed/inscribed",
			lattice_interaction:
				"Inscribed using Shadow Quill — bonds with item's mana lattice",
			restrictions: [
				"Socket type: armor",
				"Inscription DC: 19 (Shadow Quill)",
				"Material cost: 500 Gate Credits",
			],
			special_abilities: [
				"Passive: Grants Resistance to Fire damage; if already have resistance, gain Immunity instead",
			],
			stat_bonuses: {},
		},
		passive_bonuses: {
			traits: ["Fire resistance (upgrades to immunity if already resistant)"],
		},
	},
	{
		id: "sigil-res-frost-2",
		name: "Sigil of the True Glacier",
		source_book: "Rift Ascendant Canon",
		description:
			"Channels body heat to perfectly repel magical and natural cold.",
		rarity: "rare",
		image: "/generated/effects/darkness-shroud.webp",
		effects: {
			primary:
				"Grants Resistance to Cold damage; if already have resistance, gain Immunity instead",
			secondary: "None",
		},
		lore: {
			current_owner: "Lost to the depths of a high-tier dungeon.",
			curse: "",
			history:
				"Documented in the Ascendant Bureau's archivist-access manual. That much survives in the Sigil of the True Glacier's field history.",
			origin:
				"Invented to survive encounters with Ice-type anomalies beyond the Northern Rifts.",
			personality: "Chaotic and unpredictable.",
			prior_owners: ["Guild Master Kael"],
		},
		flavor: "The freeze breaks against you.",
		discovery_lore:
			"Invented to survive encounters with Ice-type anomalies beyond the Northern Rifts, recovered from a Siberian outpost.",
		tags: ["sigil", "armor", "protection"],
		can_inscribe_on: ["armor"],
		effect_description:
			"Passive: Grants Resistance to Cold damage. If you already have resistance, you gain Immunity.",
		inscription_difficulty: 16,
		limitations: {
			requires_attunement: false,
			charges: 0,
			conditions: [
				"Max sigils per item: 3 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 26 check or destroys the sigil",
			],
			consumable: false,
			cost: 50,
			recharge: "Active ability recharges per rest",
			uses: "Permanent while socketed",
		},
		mechanics: {
			type: "Sigil",
			ability: "Agility",
			action: "None (passive)",
			action_type: "Passive (socketed)",
			condition: "None",
			damage_profile: "No direct damage bonus, Cold resistance/immunity",
			duration: "While socketed/inscribed",
			lattice_interaction:
				"Inscribed using Crystal Engraver — bonds with item's mana lattice",
			restrictions: [
				"Socket type: armor",
				"Inscription DC: 21 (Crystal Engraver)",
				"Material cost: 50 Gate Credits",
			],
			special_abilities: [
				"Passive: Grants Resistance to Cold damage; if already have resistance, gain Immunity instead",
			],
			stat_bonuses: {},
		},
		passive_bonuses: {
			traits: ["Cold resistance (upgrades to immunity if already resistant)"],
		},
	},
	{
		id: "sigil-res-lightning-2",
		name: "Sigil of the Storm-Wall",
		source_book: "Rift Ascendant Canon",
		description:
			"An intricately woven mana-barrier that completely nullifies electrical shock hazards.",
		rarity: "rare",
		image: "/generated/effects/darkness-shroud.webp",
		effects: {
			primary:
				"Grants Resistance to Lightning damage; if already have resistance, gain Immunity instead",
			secondary: "None",
		},
		lore: {
			current_owner: "Wielded by Holy Knights.",
			curse: "",
			history:
				"Entered into the Bureau's controlled-inscription ledger. The Sigil of the Storm-Wall's service record notes as much.",
			origin:
				"Carved into the shields of Holy Knights facing storm-elemental bosses.",
			personality: "Coldly analytical.",
			prior_owners: ["Bureau Shared-Materiel Archive"],
		},
		flavor: "The storm ignored.",
		discovery_lore:
			"Carved into the shields of Holy Knights facing storm-elemental bosses, recovered from a battlefield shrine.",
		tags: ["sigil", "armor", "protection"],
		can_inscribe_on: ["armor"],
		effect_description:
			"Passive: Grants Resistance to Lightning damage. If you already have resistance, you gain Immunity.",
		inscription_difficulty: 16,
		limitations: {
			requires_attunement: false,
			charges: 0,
			conditions: [
				"Max sigils per item: 2 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 22 check or destroys the sigil",
			],
			consumable: false,
			cost: 250,
			recharge: "Active ability recharges per rest",
			uses: "Permanent while socketed",
		},
		mechanics: {
			type: "Sigil",
			ability: "Agility",
			action: "None (passive)",
			action_type: "Passive (socketed)",
			condition: "None",
			damage_profile: "No direct damage bonus, Lightning resistance/immunity",
			duration: "While socketed/inscribed",
			lattice_interaction:
				"Inscribed using Void Stylus — bonds with item's mana lattice",
			restrictions: [
				"Socket type: armor",
				"Inscription DC: 17 (Void Stylus)",
				"Material cost: 250 Gate Credits",
			],
			special_abilities: [
				"Passive: Grants Resistance to Lightning damage; if already have resistance, gain Immunity instead",
			],
			stat_bonuses: {},
		},
		passive_bonuses: {
			traits: [
				"Lightning resistance (upgrades to immunity if already resistant)",
			],
		},
	},
	{
		id: "sigil-res-acid-2",
		name: "Sigil of the Obsidian Polish",
		source_book: "Rift Ascendant Canon",
		description:
			"A slick, magical coating that causes acid to evaporate before making contact with armor.",
		rarity: "rare",
		image: "/generated/effects/arcane-sigil.webp",
		effects: {
			primary:
				"Grants Resistance to Acid damage; if already have resistance, gain Immunity instead",
			secondary: "None",
		},
		lore: {
			current_owner: "Wielded by Holy Knights.",
			curse: "",
			history:
				"Documented in the Ascendant Bureau's archivist-access manual. The Sigil of the Obsidian Polish's service record notes as much.",
			origin:
				"Crucial for fighting the acid-spitting Arachnids of Sector D gates.",
			personality: "Resonates only with lattice-compatible host items.",
			prior_owners: ["Archmage Valerius"],
		},
		flavor: "Nothing sticks.",
		discovery_lore:
			"Crucial for fighting the acid-spitting Arachnids of Sector D gates, recovered from a contaminated zone.",
		tags: ["sigil", "armor", "protection"],
		can_inscribe_on: ["armor"],
		effect_description:
			"Passive: Grants Resistance to Acid damage. If you already have resistance, you gain Immunity.",
		inscription_difficulty: 16,
		limitations: {
			requires_attunement: false,
			charges: 0,
			conditions: [
				"Max sigils per item: 1 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 16 check or destroys the sigil",
			],
			consumable: false,
			cost: 50,
			recharge: "Active ability recharges per rest",
			uses: "Permanent while socketed",
		},
		mechanics: {
			type: "Sigil",
			ability: "Agility",
			action: "None (passive)",
			action_type: "Passive (socketed)",
			condition: "None",
			damage_profile: "No direct damage bonus, Acid resistance/immunity",
			duration: "While socketed/inscribed",
			lattice_interaction:
				"Inscribed using Arcane Chisel — bonds with item's mana lattice",
			restrictions: [
				"Socket type: armor",
				"Inscription DC: 11 (Arcane Chisel)",
				"Material cost: 50 Gate Credits",
			],
			special_abilities: [
				"Passive: Grants Resistance to Acid damage; if already have resistance, gain Immunity instead",
			],
			stat_bonuses: {},
		},
		passive_bonuses: {
			traits: ["Acid resistance (upgrades to immunity if already resistant)"],
		},
	},
	{
		id: "sigil-res-poison-2",
		name: "Sigil of the Cleansed Blood",
		source_book: "Rift Ascendant Canon",
		description:
			"A restorative runic pattern that purges magical toxins via proximity.",
		rarity: "rare",
		image: "/generated/effects/arcane-sigil.webp",
		effects: {
			primary:
				"Grants Resistance to Poison damage; if already have resistance, gain Immunity instead",
			secondary: "None",
		},
		lore: {
			current_owner: "Available through Bureau-licensed Technomancer studios.",
			curse: "",
			history:
				"Tracked through the Bureau's restricted-inscription registry. That much survives in the Sigil of the Cleansed Blood's field history.",
			origin:
				"Derived from the antidote protocols used in the Amazon Rift Zone.",
			personality: "Aggressive and volatile.",
			prior_owners: ["An unknown Assassin Awakened"],
		},
		flavor: "A pure heart.",
		discovery_lore:
			"Derived from the antidote protocols used in the Amazon Rift Zone, recovered from a Bureau medical facility.",
		tags: ["sigil", "armor", "protection"],
		can_inscribe_on: ["armor"],
		effect_description:
			"Passive: Grants Resistance to Poison damage. If you already have resistance, you gain Immunity.",
		inscription_difficulty: 16,
		limitations: {
			requires_attunement: false,
			charges: 0,
			conditions: [
				"Max sigils per item: 2 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 17 check or destroys the sigil",
			],
			consumable: false,
			cost: 1000,
			recharge: "Active ability recharges per rest",
			uses: "Permanent while socketed",
		},
		mechanics: {
			type: "Sigil",
			ability: "Vitality",
			action: "None (passive)",
			action_type: "Passive (socketed)",
			condition: "None",
			damage_profile: "No direct damage bonus, Poison resistance/immunity",
			duration: "While socketed/inscribed",
			lattice_interaction:
				"Inscribed using Rift Calligraphy Brush — bonds with item's mana lattice",
			restrictions: [
				"Socket type: armor",
				"Inscription DC: 12 (Rift Calligraphy Brush)",
				"Material cost: 1,000 Gate Credits",
			],
			special_abilities: [
				"Passive: Grants Resistance to Poison damage; if already have resistance, gain Immunity instead",
			],
			stat_bonuses: {},
		},
		passive_bonuses: {
			traits: ["Poison resistance (upgrades to immunity if already resistant)"],
		},
	},
	{
		id: "sigil-res-thunder-2",
		name: "Sigil of the Silent Guardian",
		source_book: "Rift Ascendant Canon",
		description:
			"Absorbs sonic booms and magical shockwaves, neutralizing forceful disruption.",
		rarity: "rare",
		image: "/generated/effects/arcane-sigil.webp",
		effects: {
			primary:
				"Grants Resistance to Thunder damage; if already have resistance, gain Immunity instead",
			secondary: "None",
		},
		lore: {
			current_owner: "Heavily guarded in the Bureau's Armory.",
			curse: "",
			history:
				"Documented in the Ascendant Bureau's archivist-access manual. That much survives in the Sigil of the Silent Guardian's field history.",
			origin:
				"Favored by operatives exploring pre-gate ruin-gates where sound triggers traps.",
			personality: "Aggressive and volatile.",
			prior_owners: ["Warden Thorne", "A-Rank Ascendant 'Ghost'"],
		},
		flavor: "Quiet resilience.",
		discovery_lore:
			"Favored by operatives exploring pre-gate ruin-gates where sound triggers traps, recovered from a sealed tomb.",
		tags: ["sigil", "armor", "protection"],
		can_inscribe_on: ["armor"],
		effect_description:
			"Passive: Grants Resistance to Thunder damage. If you already have resistance, you gain Immunity.",
		inscription_difficulty: 16,
		limitations: {
			requires_attunement: false,
			charges: 0,
			conditions: [
				"Max sigils per item: 1 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 18 check or destroys the sigil",
			],
			consumable: false,
			cost: 2500,
			recharge: "Active ability recharges per rest",
			uses: "Permanent while socketed",
		},
		mechanics: {
			type: "Sigil",
			ability: "Agility",
			action: "None (passive)",
			action_type: "Passive (socketed)",
			condition: "None",
			damage_profile: "No direct damage bonus, Thunder resistance/immunity",
			duration: "While socketed/inscribed",
			lattice_interaction:
				"Inscribed using Mana Etching Needle — bonds with item's mana lattice",
			restrictions: [
				"Socket type: armor",
				"Inscription DC: 13 (Mana Etching Needle)",
				"Material cost: 2,500 Gate Credits",
			],
			special_abilities: [
				"Passive: Grants Resistance to Thunder damage; if already have resistance, gain Immunity instead",
			],
			stat_bonuses: {},
		},
		passive_bonuses: {
			traits: [
				"Thunder resistance (upgrades to immunity if already resistant)",
			],
		},
	},
	{
		id: "sigil-res-force-2",
		name: "Sigil of the Unmoving Stone",
		source_book: "Rift Ascendant Canon",
		description:
			"Reinforces the localized physical space of the wearer, preventing crushing magical force.",
		rarity: "rare",
		image: "/generated/effects/arcane-sigil.webp",
		effects: {
			primary:
				"Grants Resistance to Force damage; if already have resistance, gain Immunity instead",
			secondary: "None",
		},
		lore: {
			current_owner: "Held by an Assassin guild.",
			curse: "",
			history:
				"Documented in the Ascendant Bureau's archivist-access manual. The Sigil of the Unmoving Stone's service record notes as much.",
			origin:
				"An absolute requirement to survive a high-tier Telekinetic anomaly's assault.",
			personality: "Sorrowful, weeping mana.",
			prior_owners: ["Guild Master Kael"],
		},
		flavor: "Unbreakable presence.",
		discovery_lore:
			"An absolute requirement to survive a high-tier Telekinetic anomaly's assault, recovered from a crushed containment chamber.",
		tags: ["sigil", "armor", "protection"],
		can_inscribe_on: ["armor"],
		effect_description:
			"Passive: Grants Resistance to Force damage. If you already have resistance, you gain Immunity.",
		inscription_difficulty: 16,
		limitations: {
			requires_attunement: false,
			charges: 0,
			conditions: [
				"Max sigils per item: 2 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 23 check or destroys the sigil",
			],
			consumable: false,
			cost: 500,
			recharge: "Active ability recharges per rest",
			uses: "Permanent while socketed",
		},
		mechanics: {
			type: "Sigil",
			ability: "Agility",
			action: "None (passive)",
			action_type: "Passive (socketed)",
			condition: "None",
			damage_profile: "No direct damage bonus, Force resistance/immunity",
			duration: "While socketed/inscribed",
			lattice_interaction:
				"Inscribed using Shadow Quill — bonds with item's mana lattice",
			restrictions: [
				"Socket type: armor",
				"Inscription DC: 18 (Shadow Quill)",
				"Material cost: 500 Gate Credits",
			],
			special_abilities: [
				"Passive: Grants Resistance to Force damage; if already have resistance, gain Immunity instead",
			],
			stat_bonuses: {},
		},
		passive_bonuses: {
			traits: ["Force resistance (upgrades to immunity if already resistant)"],
		},
	},
	{
		id: "sigil-res-psychic-2",
		name: "Sigil of the Iron Mind",
		source_book: "Rift Ascendant Canon",
		description:
			"A headache-inducing geometric mana pattern that scrambles telepathic intrusions.",
		rarity: "rare",
		image: "/generated/effects/darkness-shroud.webp",
		effects: {
			primary:
				"Grants Resistance to Psychic damage; if already have resistance, gain Immunity instead",
			secondary: "None",
		},
		lore: {
			current_owner: "Held by an Assassin guild.",
			curse: "",
			history:
				"Catalogued in the Technomancer Guild's closed-reference volume. The Sigil of the Iron Mind's service record notes as much.",
			origin:
				"Constructed after an Illithid-variant gate resulted in hundreds of mind-controlled casualties.",
			personality: "Chaotic and unpredictable.",
			prior_owners: ["Guild Master Kael"],
		},
		flavor: "My thoughts are my own.",
		discovery_lore:
			"Constructed after an Illithid-variant gate resulted in hundreds of mind-controlled casualties, recovered from a quarantine zone.",
		tags: ["sigil", "armor", "protection"],
		can_inscribe_on: ["armor", "helmet"],
		effect_description:
			"Passive: Grants Resistance to Psychic damage. If you already have resistance, you gain Immunity.",
		inscription_difficulty: 16,
		limitations: {
			requires_attunement: false,
			charges: 0,
			conditions: [
				"Max sigils per item: 1 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 23 check or destroys the sigil",
			],
			consumable: false,
			cost: 250,
			recharge: "Active ability recharges per rest",
			uses: "Permanent while socketed",
		},
		mechanics: {
			type: "Sigil",
			ability: "Intelligence",
			action: "None (passive)",
			action_type: "Passive (socketed)",
			condition: "None",
			damage_profile: "No direct damage bonus, Psychic resistance/immunity",
			duration: "While socketed/inscribed",
			lattice_interaction:
				"Inscribed using Mana Etching Needle — bonds with item's mana lattice",
			restrictions: [
				"Socket type: armor or helmet",
				"Inscription DC: 18 (Mana Etching Needle)",
				"Material cost: 250 Gate Credits",
			],
			special_abilities: [
				"Passive: Grants Resistance to Psychic damage; if already have resistance, gain Immunity instead",
			],
			stat_bonuses: {},
		},
		passive_bonuses: {
			traits: [
				"Psychic resistance (upgrades to immunity if already resistant)",
			],
		},
	},
	{
		id: "sigil-mastery-blade",
		name: "Sigil of the Grandmaster's Edge",
		source_book: "Rift Ascendant Canon",
		description:
			"Attunes a bladed weapon to perfectly seek the path of least resistance through anomaly hide.",
		rarity: "very_rare",
		image: "/generated/effects/arcane-sigil.webp",
		effects: {
			primary:
				"Slashing attacks ignore slashing resistance and treat immunity as resistance",
			secondary: "None",
		},
		lore: {
			current_owner: "Distributed by Bureau-certified inscription workshops.",
			curse: "",
			history:
				"Documented in the Ascendant Bureau's archivist-access manual. That much survives in the Sigil of the Grandmaster's Edge's field history.",
			origin:
				"The pinnacle of cutting augmentation, designed by an elite Guild Master who broke too many swords.",
			personality: "Hungry for ambient magic.",
			prior_owners: ["The Obsidian Vanguard"],
		},
		flavor: "Nothing stands in the way.",
		discovery_lore:
			"The pinnacle of cutting augmentation designed by an elite Guild Master, recovered from a master armorer's workshop.",
		tags: ["sigil", "weapon", "mastery"],
		can_inscribe_on: ["weapon"],
		effect_description:
			"Passive: Attacks with this slashing weapon ignore slashing resistance and treat immunity as resistance.",
		inscription_difficulty: 19,
		limitations: {
			requires_attunement: false,
			charges: 0,
			conditions: [
				"Max sigils per item: 1 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 15 check or destroys the sigil",
			],
			consumable: false,
			cost: 1000,
			recharge: "Active ability recharges per rest",
			uses: "Permanent while socketed",
		},
		mechanics: {
			type: "Sigil",
			ability: "Agility",
			action: "None (passive)",
			action_type: "Passive (socketed)",
			condition: "None",
			damage_profile: "No direct damage bonus, resistance penetration utility",
			duration: "While socketed/inscribed",
			lattice_interaction:
				"Inscribed using Void Stylus — bonds with item's mana lattice",
			restrictions: [
				"Socket type: weapon",
				"Inscription DC: 10 (Void Stylus)",
				"Material cost: 1,000 Gate Credits",
			],
			special_abilities: [
				"Passive: Slashing attacks ignore slashing resistance and treat immunity as resistance",
			],
			stat_bonuses: {},
		},
		passive_bonuses: {
			attack_bonus: 2,
			traits: ["Ignore slashing resistance, treat immunity as resistance"],
		},
	},
	{
		id: "sigil-mastery-mallet",
		name: "Sigil of the Earth-Shatterer",
		source_book: "Rift Ascendant Canon",
		description:
			"Infuses the weapon with heavy earth mana so it strikes with the mass of a boulder.",
		rarity: "very_rare",
		image: "/generated/effects/arcane-sigil.webp",
		effects: {
			primary: "Bludgeoning attacks push targets 10 feet backward on a hit",
			secondary: "None",
		},
		lore: {
			current_owner: "Held by an Assassin guild.",
			curse: "",
			history:
				"Entered into the Bureau's controlled-inscription ledger. The Sigil of the Earth-Shatterer's service record notes as much.",
			origin:
				"Built for Holy Knights dealing with heavily armored stone golems.",
			personality: "Sorrowful, weeping mana.",
			prior_owners: ["Archmage Valerius"],
		},
		flavor: "Shatter their foundations.",
		discovery_lore:
			"Built for Holy Knights dealing with heavily armored stone golems, recovered from a battlefield against golem anomalies.",
		tags: ["sigil", "weapon", "mastery"],
		can_inscribe_on: ["weapon"],
		effect_description:
			"Passive: Attacks with this bludgeoning weapon push targets 10 feet backward on a hit.",
		inscription_difficulty: 19,
		limitations: {
			requires_attunement: false,
			charges: 0,
			conditions: [
				"Max sigils per item: 3 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 24 check or destroys the sigil",
			],
			consumable: false,
			cost: 1000,
			recharge: "Active ability recharges per rest",
			uses: "Permanent while socketed",
		},
		mechanics: {
			type: "Sigil",
			ability: "Strength",
			action: "None (passive)",
			action_type: "Passive (socketed)",
			condition: "None",
			damage_profile: "No direct damage bonus, knockback utility",
			duration: "While socketed/inscribed",
			lattice_interaction:
				"Inscribed using Mana Etching Needle — bonds with item's mana lattice",
			restrictions: [
				"Socket type: weapon",
				"Inscription DC: 19 (Mana Etching Needle)",
				"Material cost: 1,000 Gate Credits",
			],
			special_abilities: [
				"Passive: Bludgeoning attacks push targets 10 feet backward on a hit",
			],
			stat_bonuses: {},
		},
		passive_bonuses: {
			attack_bonus: 2,
			traits: ["Push 10ft on hit"],
		},
	},
	{
		id: "sigil-mastery-bow",
		name: "Sigil of the Stalker's Eye",
		source_book: "Rift Ascendant Canon",
		description: "Guides projectiles with subtle bursts of wind magic.",
		rarity: "very_rare",
		image: "/generated/effects/darkness-shroud.webp",
		effects: {
			primary: "Ranged attacks ignore half and three-quarters cover entirely",
			secondary: "None",
		},
		lore: {
			current_owner: "Wielded by Holy Knights.",
			curse: "",
			history:
				"Documented in the Ascendant Bureau's archivist-access manual. That much survives in the Sigil of the Stalker's Eye's field history.",
			origin: "Ensured a 100% kill rate for the Guild's elite archer division.",
			personality: "Sorrowful, weeping mana.",
			prior_owners: ["Ascendant Academy Reference Collection"],
		},
		flavor: "There's nowhere to hide.",
		discovery_lore:
			"Ensured a 100% kill rate for the Guild's elite archer division, recovered from a Guild armory.",
		tags: ["sigil", "weapon", "mastery"],
		can_inscribe_on: ["weapon"],
		effect_description:
			"Passive: Your ranged attacks ignore half and three-quarters cover entirely.",
		inscription_difficulty: 19,
		limitations: {
			requires_attunement: false,
			charges: 0,
			conditions: [
				"Max sigils per item: 2 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 18 check or destroys the sigil",
			],
			consumable: false,
			cost: 250,
			recharge: "Active ability recharges per rest",
			uses: "Permanent while socketed",
		},
		mechanics: {
			type: "Sigil",
			ability: "Agility",
			action: "None (passive)",
			action_type: "Passive (socketed)",
			condition: "None",
			damage_profile: "No direct damage bonus, cover penetration utility",
			duration: "While socketed/inscribed",
			lattice_interaction:
				"Inscribed using Mana Etching Needle — bonds with item's mana lattice",
			restrictions: [
				"Socket type: weapon",
				"Inscription DC: 13 (Mana Etching Needle)",
				"Material cost: 250 Gate Credits",
			],
			special_abilities: [
				"Passive: Ranged attacks ignore half and three-quarters cover entirely",
			],
			stat_bonuses: {},
		},
		passive_bonuses: {
			attack_bonus: 2,
			traits: ["Ignore half/three-quarters cover"],
		},
	},
	{
		id: "sigil-mastery-spear",
		name: "Sigil of the Pierce-Through",
		source_book: "Rift Ascendant Canon",
		description:
			"Concentrates mana at the tip of a polearm into a razor-sharp point of light.",
		rarity: "very_rare",
		image: "/generated/effects/arcane-sigil.webp",
		effects: {
			primary:
				"Attacks at 10-foot reach or 20-foot range deal additional 1d6 piercing damage",
			secondary: "None",
		},
		lore: {
			current_owner: "Held by an Assassin guild.",
			curse: "",
			history:
				"Tracked through the Bureau's restricted-inscription registry. That much survives in the Sigil of the Pierce-Through's field history.",
			origin: "Keeps the deadliest horrors exactly an arm's length away.",
			personality: "Aggressive and volatile.",
			prior_owners: ["Guild Master Kael"],
		},
		flavor: "Distance is safety.",
		discovery_lore:
			"Keeps the deadliest horrors exactly an arm's length away, recovered from a Guild polearm specialist's equipment.",
		tags: ["sigil", "weapon", "mastery"],
		can_inscribe_on: ["weapon"],
		effect_description:
			"Passive: Attacks made at a 10-foot reach or 20-foot range deal an additional 1d6 piercing damage.",
		inscription_difficulty: 19,
		limitations: {
			requires_attunement: false,
			charges: 0,
			conditions: [
				"Max sigils per item: 2 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 24 check or destroys the sigil",
			],
			consumable: false,
			cost: 250,
			recharge: "Active ability recharges per rest",
			uses: "Permanent while socketed",
		},
		mechanics: {
			type: "Sigil",
			ability: "Agility",
			action: "None (passive)",
			action_type: "Passive (socketed)",
			condition: "None",
			damage_profile: "+1d6 piercing damage at 10-foot reach or 20-foot range",
			duration: "While socketed/inscribed",
			lattice_interaction:
				"Inscribed using Rift Calligraphy Brush — bonds with item's mana lattice",
			restrictions: [
				"Socket type: weapon",
				"Inscription DC: 19 (Rift Calligraphy Brush)",
				"Material cost: 250 Gate Credits",
			],
			special_abilities: [
				"Passive: Attacks at 10-foot reach or 20-foot range deal additional 1d6 piercing damage",
			],
			stat_bonuses: {},
		},
		passive_bonuses: {
			damage_bonus: "1d6 piercing",
			traits: ["Reach bonus damage"],
		},
	},
	{
		id: "sigil-mastery-axe",
		name: "Sigil of the Executioner's Swing",
		source_book: "Rift Ascendant Canon",
		description: "Accelerates downward swings by compounding mana weight.",
		rarity: "very_rare",
		image: "/generated/effects/darkness-shroud.webp",
		effects: {
			primary:
				"Once per turn, can declare reckless attack; on hit, target is stunned until their turn",
			secondary: "None",
		},
		lore: {
			current_owner: "Lost to the depths of a high-tier dungeon.",
			curse: "",
			history:
				"Tracked through the Bureau's restricted-inscription registry. The Sigil of the Executioner's Swing carried the story forward.",
			origin:
				"For when you absolutely must cleave the anomaly in two on the first swing.",
			personality: "Hungry for ambient magic.",
			prior_owners: ["Archmage Valerius"],
		},
		flavor: "A heavy toll.",
		discovery_lore:
			"For when you absolutely must cleave the anomaly in two on the first swing, recovered from a Guild executioner's axe.",
		tags: ["sigil", "weapon", "mastery"],
		can_inscribe_on: ["weapon"],
		effect_description:
			"Passive: Once per turn, you can declare a reckless attack. On hit, the target is stunned until their turn.",
		inscription_difficulty: 19,
		limitations: {
			requires_attunement: false,
			charges: 0,
			conditions: [
				"Max sigils per item: 2 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 24 check or destroys the sigil",
			],
			consumable: false,
			cost: 2500,
			recharge: "Active ability recharges per rest",
			uses: "Permanent while socketed",
		},
		mechanics: {
			type: "Sigil",
			ability: "Strength",
			action: "None (passive) / Declare reckless attack (1/turn)",
			action_type: "Passive (socketed) / Active (declare reckless) / 1/turn",
			condition: "Stunning",
			damage_profile: "No direct damage bonus, stun on reckless hit",
			duration: "While socketed/inscribed",
			lattice_interaction:
				"Inscribed using Void Stylus — bonds with item's mana lattice",
			restrictions: [
				"Socket type: weapon",
				"Inscription DC: 19 (Void Stylus)",
				"Material cost: 2,500 Gate Credits",
			],
			special_abilities: [
				"Passive: Once per turn, can declare reckless attack; on hit, target is stunned until their turn",
			],
			stat_bonuses: {},
		},
		passive_bonuses: {
			damage_bonus: 3,
			traits: ["Stun on declared reckless attack (1/turn)"],
		},
	},
	{
		id: "sigil-mastery-wand",
		name: "Sigil of the Mage's Focus",
		source_book: "Rift Ascendant Canon",
		description:
			"Functions as a perfect mana-conductor, refining raw spells into cleaner, faster casts.",
		rarity: "very_rare",
		image: "/generated/effects/darkness-shroud.webp",
		effects: {
			primary: "Spells requiring attack roll score critical hit on 19 or 20",
			secondary: "None",
		},
		lore: {
			current_owner: "Stocked at Guild-credentialed materiel counters.",
			curse: "",
			history:
				"Entered into the Bureau's controlled-inscription ledger. The Sigil of the Mage's Focus carried the story forward.",
			origin: "The mage's ultimate catalyst.",
			personality: "Hungry for ambient magic.",
			prior_owners: ["Bureau Shared-Materiel Archive"],
		},
		flavor: "Precision of the unseen.",
		discovery_lore:
			"The mage's ultimate catalyst, recovered from a Guild-credentialed materiel counter after a high-profile acquisition.",
		tags: ["sigil", "weapon", "mastery"],
		can_inscribe_on: ["weapon"],
		effect_description:
			"Passive: Spells requiring an attack roll score a critical hit on a 19 or 20.",
		inscription_difficulty: 19,
		limitations: {
			requires_attunement: false,
			charges: 0,
			conditions: [
				"Max sigils per item: 2 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 17 check or destroys the sigil",
			],
			consumable: false,
			cost: 100,
			recharge: "Active ability recharges per rest",
			uses: "Permanent while socketed",
		},
		mechanics: {
			type: "Sigil",
			ability: "Intelligence",
			action: "None (passive)",
			action_type: "Passive (socketed)",
			condition: "None",
			damage_profile: "No direct damage bonus, spell crit expansion utility",
			duration: "While socketed/inscribed",
			lattice_interaction:
				"Inscribed using Shadow Quill — bonds with item's mana lattice",
			restrictions: [
				"Socket type: weapon",
				"Inscription DC: 12 (Shadow Quill)",
				"Material cost: 100 Gate Credits",
			],
			special_abilities: [
				"Passive: Spells requiring attack roll score critical hit on 19 or 20",
			],
			stat_bonuses: {},
		},
		passive_bonuses: {
			traits: ["Spell crits on 19-20"],
		},
	},
	{
		id: "sigil-essence-vigor",
		name: "Sigil of Endless Vitality",
		source_book: "Rift Ascendant Canon",
		description:
			"Beats with the rhythm of life magic, flooding the body with restorative mana.",
		rarity: "rare",
		image: "/generated/effects/darkness-shroud.webp",
		effects: {
			primary: "Increases Maximum HP by Character Level x 2",
			secondary: "None",
		},
		lore: {
			current_owner: "Wielded by Holy Knights.",
			curse: "",
			history:
				"Entered into the Bureau's controlled-inscription ledger. The Sigil of Endless Vitality carried the story forward.",
			origin:
				"Stolen from a regenerating Troll boss inside an A-Rank labyrinth.",
			personality: "Coldly analytical.",
			prior_owners: ["Archmage Valerius"],
		},
		flavor: "Refuse to yield.",
		discovery_lore:
			"Stolen from a regenerating Troll boss inside an A-Rank labyrinth, recovered by Bureau agents.",
		tags: ["sigil", "armor", "vitality"],
		can_inscribe_on: ["armor", "accessory"],
		effect_description:
			"Passive: Increases Maximum HP by your Character Level x 2.",
		inscription_difficulty: 22,
		limitations: {
			requires_attunement: false,
			charges: 0,
			conditions: [
				"Max sigils per item: 2 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 15 check or destroys the sigil",
			],
			consumable: false,
			cost: 500,
			recharge: "Active ability recharges per rest",
			uses: "Permanent while socketed",
		},
		mechanics: {
			type: "Sigil",
			ability: "Vitality",
			action: "None (passive)",
			action_type: "Passive (socketed)",
			condition: "None",
			damage_profile: "No direct damage bonus, HP increase utility",
			duration: "While socketed/inscribed",
			lattice_interaction:
				"Inscribed using Void Stylus — bonds with item's mana lattice",
			restrictions: [
				"Socket type: armor or accessory",
				"Inscription DC: 10 (Void Stylus)",
				"Material cost: 500 Gate Credits",
			],
			special_abilities: [
				"Passive: Increases Maximum HP by Character Level x 2",
			],
			stat_bonuses: {},
		},
		passive_bonuses: { ac_bonus: 1, speed_bonus: 5 },
	},
	{
		id: "sigil-essence-haste",
		name: "Sigil of the Wind-Step",
		source_book: "Rift Ascendant Canon",
		description:
			"Constantly envelops the wearer's feet in a swirling eddy of wind magic.",
		rarity: "rare",
		image: "/generated/effects/arcane-sigil.webp",
		effects: {
			primary: "Base walking speed increases by 10 feet",
			secondary: "None",
		},
		lore: {
			current_owner: "Wielded by Holy Knights.",
			curse: "",
			history:
				"Documented in the Ascendant Bureau's archivist-access manual. The Sigil of the Wind-Step carried the story forward.",
			origin: "For when you need to outrun an angry S-Rank anomaly.",
			personality: "Dormant and silent.",
			prior_owners: ["Warden Thorne", "A-Rank Ascendant 'Ghost'"],
		},
		flavor: "Catch me if you can.",
		discovery_lore:
			"For when you need to outrun an angry S-Rank anomaly, recovered from a Holy Knight's escape kit.",
		tags: ["sigil", "armor", "agility"],
		can_inscribe_on: ["armor", "boots"],
		effect_description:
			"Passive: Your base walking speed increases by 10 feet.",
		limitations: {
			requires_attunement: false,
			charges: 0,
			conditions: [
				"Max sigils per item: 3 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 17 check or destroys the sigil",
			],
			consumable: false,
			cost: 1000,
			recharge: "Active ability recharges per rest",
			uses: "Permanent while socketed",
		},
		mechanics: {
			type: "Sigil",
			ability: "Agility",
			action: "None (passive)",
			action_type: "Passive (socketed)",
			condition: "None",
			damage_profile: "No direct damage bonus, movement speed utility",
			duration: "While socketed/inscribed",
			lattice_interaction:
				"Inscribed using Crystal Engraver — bonds with item's mana lattice",
			restrictions: [
				"Socket type: armor or boots",
				"Inscription DC: 12 (Crystal Engraver)",
				"Material cost: 1,000 Gate Credits",
			],
			special_abilities: ["Passive: Base walking speed increases by 10 feet"],
			stat_bonuses: {},
		},
		passive_bonuses: { speed_bonus: 10 },
	},
	{
		id: "sigil-essence-bravery",
		name: "Sigil of the Lionhearted",
		source_book: "Rift Ascendant Canon",
		description:
			"Channels radiant courage into the wearer's mana core, suppressing extreme fear responses.",
		rarity: "rare",
		image: "/generated/effects/arcane-sigil.webp",
		effects: {
			primary: "Entirely immune to the Frightened condition",
			secondary: "None",
		},
		lore: {
			current_owner: "Heavily guarded in the Bureau's Armory.",
			curse: "",
			history:
				"Tracked through the Bureau's restricted-inscription registry. The Sigil of the Lionhearted carried the story forward.",
			origin: "Anomalies feed on fear; this sigil starves them.",
			personality: "Coldly analytical.",
			prior_owners: ["Archmage Valerius"],
		},
		flavor: "Look terror in the eye.",
		discovery_lore:
			"Anomalies feed on fear; this sigil starves them, recovered from a Bureau Armory vault.",
		tags: ["sigil", "accessory", "presence"],
		can_inscribe_on: ["accessory"],
		effect_description:
			"Passive: You are entirely immune to the Frightened condition.",
		limitations: {
			requires_attunement: false,
			charges: 0,
			conditions: [
				"Max sigils per item: 2 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 24 check or destroys the sigil",
			],
			consumable: false,
			cost: 100,
			recharge: "Active ability recharges per rest",
			uses: "Permanent while socketed",
		},
		mechanics: {
			type: "Sigil",
			ability: "Presence",
			action: "None (passive)",
			action_type: "Passive (socketed)",
			condition: "None",
			damage_profile: "No direct damage bonus, fear immunity utility",
			duration: "While socketed/inscribed",
			lattice_interaction:
				"Inscribed using Mana Etching Needle — bonds with item's mana lattice",
			restrictions: [
				"Socket type: accessory",
				"Inscription DC: 19 (Mana Etching Needle)",
				"Material cost: 100 Gate Credits",
			],
			special_abilities: [
				"Passive: Entirely immune to the Frightened condition",
			],
			stat_bonuses: {},
		},
		passive_bonuses: {
			traits: ["Immunity: Frightened"],
		},
	},
	{
		id: "sigil-essence-iron-skin",
		name: "Sigil of the Unbreakable Mountain",
		source_book: "Rift Ascendant Canon",
		description:
			"Hardens the magical aura resting over the armor into an invisible shield.",
		rarity: "rare",
		image: "/generated/effects/arcane-sigil.webp",
		effects: {
			primary: "Grants permanent +2 to Armor Class",
			secondary: "None",
		},
		lore: {
			current_owner: "Wielded by Holy Knights.",
			curse: "",
			history:
				"Documented in the Ascendant Bureau's archivist-access manual. The Sigil of the Unbreakable Mountain carried the story forward.",
			origin:
				"Favored by solo-tank specialists holding the front line of Rift breaks.",
			personality: "Resonates only with lattice-compatible host items.",
			prior_owners: ["The Obsidian Vanguard"],
		},
		flavor: "Like hitting a mountain.",
		discovery_lore:
			"Favored by solo-tank specialists holding the front line of Rift breaks, recovered from a fallen tank's armor.",
		tags: ["sigil", "armor", "defensive"],
		can_inscribe_on: ["armor"],
		effect_description: "Passive: Grants a permanent +2 to Armor Class.",
		limitations: {
			requires_attunement: false,
			charges: 0,
			conditions: [
				"Max sigils per item: 1 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 16 check or destroys the sigil",
			],
			consumable: false,
			cost: 50,
			recharge: "Active ability recharges per rest",
			uses: "Permanent while socketed",
		},
		mechanics: {
			type: "Sigil",
			ability: "Agility",
			action: "None (passive)",
			action_type: "Passive (socketed)",
			condition: "None",
			damage_profile: "No direct damage bonus, AC increase utility",
			duration: "While socketed/inscribed",
			lattice_interaction:
				"Inscribed using Crystal Engraver — bonds with item's mana lattice",
			restrictions: [
				"Socket type: armor",
				"Inscription DC: 11 (Crystal Engraver)",
				"Material cost: 50 Gate Credits",
			],
			special_abilities: ["Passive: Grants permanent +2 to Armor Class"],
			stat_bonuses: {},
		},
		passive_bonuses: { ac_bonus: 2 },
	},
	{
		id: "sigil-essence-insight",
		name: "Sigil of the Inner Eye",
		source_book: "Rift Ascendant Canon",
		description:
			"Translates subtle environmental mana fluctuations into true sight.",
		rarity: "rare",
		image: "/generated/effects/arcane-sigil.webp",
		effects: {
			primary:
				"Can perceive invisible creatures and illusions for what they truly are within 30 feet",
			secondary: "None",
		},
		lore: {
			current_owner: "Held by an Assassin guild.",
			curse: "",
			history:
				"Catalogued in the Technomancer Guild's closed-reference volume. The Sigil of the Inner Eye carried the story forward.",
			origin: "Bypasses the cloaking mechanisms of Class-A stalker anomalies.",
			personality: "Coldly analytical.",
			prior_owners: ["Guild Historical Registry"],
		},
		flavor: "Nothing remains hidden.",
		discovery_lore:
			"Bypasses the cloaking mechanisms of Class-A stalker anomalies, recovered from a Guild scout's helmet.",
		tags: ["sigil", "accessory", "sense"],
		can_inscribe_on: ["helmet", "accessory"],
		effect_description:
			"Passive: You can perceive invisible creatures and illusions for what they truly are within 30 feet.",
		limitations: {
			requires_attunement: false,
			charges: 0,
			conditions: [
				"Max sigils per item: 3 (based on item rarity)",
				"Overlapping sigils of the same type conflict — only the strongest applies",
				"Removing a sigil requires a DC 16 check or destroys the sigil",
			],
			consumable: false,
			cost: 2500,
			recharge: "Active ability recharges per rest",
			uses: "Permanent while socketed",
		},
		mechanics: {
			type: "Sigil",
			ability: "Sense",
			action: "None (passive)",
			action_type: "Passive (socketed)",
			condition: "None",
			damage_profile: "No direct damage bonus, true sight utility",
			duration: "While socketed/inscribed",
			lattice_interaction:
				"Inscribed using Mana Etching Needle — bonds with item's mana lattice",
			restrictions: [
				"Socket type: helmet or accessory",
				"Inscription DC: 11 (Mana Etching Needle)",
				"Material cost: 2,500 Gate Credits",
			],
			special_abilities: [
				"Passive: Can perceive invisible creatures and illusions for what they truly are within 30 feet",
			],
			stat_bonuses: {},
		},
		passive_bonuses: {
			traits: ["True sight 30ft"],
		},
	},
];
