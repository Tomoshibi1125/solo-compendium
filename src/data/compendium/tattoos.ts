import type { CompendiumTattoo } from "../../types/compendium";

export const tattoos: CompendiumTattoo[] = [
	{
		id: "tattoo_1",
		name: "Regent's Heartbeat",
		display_name: "Regent's Heartbeat",
		description:
			"Ritually inscribed marks that violently push the heart's endurance. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "common",
		attunement: true,
		body_part: "Neck",
		ink_type: "Crimson Boss Ichor",
		active_veins: ["Neck"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Inked by rogue alchemists looking to push Hunter flesh beyond its natural limits.",
			history: "Highly regulated by the International Guild Association.",
			curse: "",
			personality: "Silent, hungry.",
			current_owner: "Widespread among underground syndicates.",
			prior_owners: ["Guild Outcasts", "Rogue Hunters"],
		},
		flavor:
			"Commands the certainty of outcomes. The line between Hunter and monster.",
		discovery_lore:
			"Appeared in a Hunter's inventory after a System notification that no one else could see.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Focus your intent on the glyph",
			type: "Tattoo",
			frequency: "1/long rest",
			duration: "Permanent (passive)",
			action: "Focus your intent on the glyph",
			ability: "Vitality",
			damage_profile: "N/A (utility/defensive)",
			lattice_interaction:
				"Starfall Residue resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies shoulders tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Lethargy",
			attack: {
				type: "acid",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "none",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Starfall Residue, DC 16 tattooing check, 4 hours of uninterrupted work",
			],
		},
		effects: {
			primary:
				"Deal 1d8 acid damage to creatures that hit you with melee attacks.",
			secondary:
				"You ignore the first instance of this damage type each combat.",
			tertiary:
				"Resonance: When multiple tattoos are active, gain +1 AC per active tattoo.",
			passive: [
				"Deal 1d8 acid damage to creatures that hit you with melee attacks.",
			],
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Focus your intent on the glyph to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			primaryEffect:
				"Deal 1d8 acid damage to creatures that hit you with melee attacks.",
			secondaryEffect: "",
			passiveBonuses: [
				{
					stat: "acid aura",
					value: 1,
				},
			],
		},
		limitations: {
			uses: "Passive + 1 active/short rest",
			recharge: "Short rest",
			requires_attunement: true,
			conditions: [
				"Requires tattoo attunement slot (shoulders)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 250,
			charges: 0,
			uses_per_rest: 2,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
		},
		image: "/generated/effects/arcane-sigil.webp",
	},
	{
		id: "tattoo_2",
		name: "Bone-Weave Tapestry",
		display_name: "Bone-Weave Tapestry",
		description:
			"Hardens the skeleton by absorbing ambient mana. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "common",
		attunement: true,
		body_part: "Spine",
		ink_type: "Wyvern Bone Dust",
		active_veins: ["Spine"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Inked by rogue alchemists looking to push Hunter flesh beyond its natural limits.",
			history: "Highly regulated by the International Guild Association.",
			curse: "",
			personality: "Silent, hungry.",
			current_owner: "Widespread among underground syndicates.",
			prior_owners: ["Guild Outcasts", "Rogue Hunters"],
		},
		flavor:
			"Devours the concept of distance. Proof that some things cannot be survived.",
		discovery_lore:
			"Appeared in a Hunter's inventory after a System notification that no one else could see.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Channel mana through the ink circuits",
			type: "Tattoo",
			frequency: "Proficiency/long rest",
			duration: "Permanent (passive)",
			action: "Channel mana through the ink circuits",
			ability: "Presence",
			damage_profile: "N/A (utility/defensive)",
			lattice_interaction:
				"Phoenix Ash Emulsion resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies neck tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Fear",
			attack: {
				type: "necrotic",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "none",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Phoenix Ash Emulsion, DC 11 tattooing check, 4 hours of uninterrupted work",
			],
		},
		effects: {
			primary: "You can see in magical darkness out to 60 feet.",
			secondary: "Allies within 5 feet gain +1 to saving throws.",
			tertiary:
				"Resonance: When multiple tattoos are active, gain +1 AC per active tattoo.",
			passive: ["You can see in magical darkness out to 60 feet."],
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Channel mana through the ink circuits to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			primaryEffect: "You can see in magical darkness out to 60 feet.",
			secondaryEffect: "",
			passiveBonuses: [
				{
					stat: "necrotic aura",
					value: 1,
				},
			],
		},
		limitations: {
			uses: "Passive + 1 active/short rest",
			recharge: "Short rest",
			requires_attunement: true,
			conditions: [
				"Requires tattoo attunement slot (neck)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 500,
			charges: 0,
			uses_per_rest: 1,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
		},
		image: "/generated/effects/arcane-sigil.webp",
	},
	{
		id: "tattoo_3",
		name: "Hunter's Acuity",
		display_name: "Hunter's Acuity",
		description:
			"Quickens the mind and reflexes using raw magical energy. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "uncommon",
		attunement: true,
		body_part: "Temple",
		ink_type: "Silvered Mercury",
		active_veins: ["Temple"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Inked by rogue alchemists looking to push Hunter flesh beyond its natural limits.",
			history: "Highly regulated by the International Guild Association.",
			curse: "",
			personality: "Silent, hungry.",
			current_owner: "Widespread among underground syndicates.",
			prior_owners: ["Guild Outcasts", "Rogue Hunters"],
		},
		flavor:
			"Inverts the dimensional barrier. A testament to what Hunters have become.",
		discovery_lore:
			"Excavated from the crystallized mana deposit at the center of a depleted Gate core.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Flex the tattooed muscle group",
			type: "Tattoo",
			frequency: "2/short rest",
			duration: "Permanent (passive)",
			action: "Flex the tattooed muscle group",
			ability: "Presence",
			damage_profile: "N/A (utility/defensive)",
			lattice_interaction:
				"Mana-Crystal Pigment resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies back tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Fear",
			attack: {
				type: "lightning",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "none",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Mana-Crystal Pigment, DC 16 tattooing check, 4 hours of uninterrupted work",
			],
		},
		effects: {
			primary: "Your movement speed increases by 10 feet.",
			secondary:
				"Your unarmed strikes deal an additional 1d4 of the tattoo's element.",
			tertiary:
				"Resonance: When multiple tattoos are active, gain +1 AC per active tattoo.",
			passive: ["Your movement speed increases by 10 feet."],
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Flex the tattooed muscle group to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			primaryEffect: "Your movement speed increases by 10 feet.",
			secondaryEffect: "",
			passiveBonuses: [
				{
					stat: "lightning aura",
					value: 1,
				},
			],
		},
		limitations: {
			uses: "Passive only",
			recharge: "Short rest",
			requires_attunement: true,
			conditions: [
				"Requires tattoo attunement slot (back)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 5000,
			charges: 0,
			uses_per_rest: 3,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
		},
		image: "/generated/effects/darkness-shroud.webp",
	},
	{
		id: "tattoo_4",
		name: "Earth-Mantle Plating",
		display_name: "Earth-Mantle Plating",
		description:
			"Flesh hardens into magical stone plates on command. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "uncommon",
		attunement: true,
		body_part: "Chest",
		ink_type: "Earth Golem Core",
		active_veins: ["Chest"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Inked by rogue alchemists looking to push Hunter flesh beyond its natural limits.",
			history: "Highly regulated by the International Guild Association.",
			curse: "",
			personality: "Silent, hungry.",
			current_owner: "Widespread among underground syndicates.",
			prior_owners: ["Guild Outcasts", "Rogue Hunters"],
		},
		flavor:
			"Ignites the last defense of the unprepared. The breaking point of all resistance.",
		discovery_lore:
			"Dropped by a mini-boss that shouldn't have existed according to the Gate's difficulty rating.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Channel mana through the ink circuits",
			type: "Tattoo",
			frequency: "1/long rest",
			duration: "1 minute",
			action: "Channel mana through the ink circuits",
			ability: "Vitality",
			damage_profile: "N/A (utility/defensive)",
			lattice_interaction:
				"Void Ink resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies hands tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Blindness",
			attack: {
				type: "force",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "none",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Void Ink, DC 14 tattooing check, 4 hours of uninterrupted work",
			],
		},
		effects: {
			primary: "You can see in magical darkness out to 60 feet.",
			secondary:
				"You ignore the first instance of this damage type each combat.",
			tertiary:
				"Resonance: When multiple tattoos are active, gain +1 AC per active tattoo.",
			passive: ["You can see in magical darkness out to 60 feet."],
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Channel mana through the ink circuits to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			primaryEffect: "You can see in magical darkness out to 60 feet.",
			secondaryEffect: "",
			passiveBonuses: [
				{
					stat: "force aura",
					value: 1,
				},
			],
		},
		limitations: {
			uses: "Passive + 1 active/short rest",
			recharge: "Long rest",
			requires_attunement: true,
			conditions: [
				"Requires tattoo attunement slot (hands)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 100,
			charges: 0,
			uses_per_rest: 1,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
		},
		image: "/generated/effects/arcane-sigil.webp",
	},
	{
		id: "tattoo_5",
		name: "Impact Reservoir",
		display_name: "Impact Reservoir",
		description:
			"Stores the forceful blows from enemy strikes into the skin's magical weave. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "uncommon",
		attunement: true,
		body_part: "Left Forearm",
		ink_type: "Crushed Garnet",
		active_veins: ["Left Forearm"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Inked by rogue alchemists looking to push Hunter flesh beyond its natural limits.",
			history: "Highly regulated by the International Guild Association.",
			curse: "",
			personality: "Silent, hungry.",
			current_owner: "Widespread among underground syndicates.",
			prior_owners: ["Guild Outcasts", "Rogue Hunters"],
		},
		flavor: "Warps the laws of physics. A whisper from the edge of oblivion.",
		discovery_lore:
			"Traded by a nomadic Awakened who claimed to have no memory of acquiring it.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Press your palm against the design",
			type: "Tattoo",
			frequency: "2/short rest",
			duration: "10 minutes",
			action: "Press your palm against the design",
			ability: "Vitality",
			damage_profile: "2d4 fire",
			lattice_interaction:
				"Phoenix Ash Emulsion resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies right leg tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Lethargy",
			attack: {
				type: "fire",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "none",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Phoenix Ash Emulsion, DC 10 tattooing check, 4 hours of uninterrupted work",
			],
		},
		effects: {
			primary: "Gain +2 to Vitality while the tattoo is active.",
			secondary:
				"You ignore the first instance of this damage type each combat.",
			tertiary:
				"Emergency Pulse: When reduced to 0 HP, the tattoo activates automatically (1/long rest).",
			passive: ["Gain +2 to Vitality while the tattoo is active."],
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Press your palm against the design to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			primaryEffect: "Gain +2 to Vitality while the tattoo is active.",
			secondaryEffect: "",
			passiveBonuses: [
				{
					stat: "fire aura",
					value: 1,
				},
			],
		},
		limitations: {
			uses: "Proficiency/long rest",
			recharge: "Dawn",
			requires_attunement: true,
			conditions: [
				"Requires tattoo attunement slot (right leg)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 5000,
			charges: 0,
			uses_per_rest: 3,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
		},
		image: "/generated/effects/darkness-shroud.webp",
	},
	{
		id: "tattoo_6",
		name: "Predator's Gaze",
		display_name: "Predator's Gaze",
		description:
			"Allows sensing magical auras through solid walls. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "uncommon",
		attunement: true,
		body_part: "Around Eyes",
		ink_type: "Drake Eye Fluid",
		active_veins: ["Around Eyes"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Inked by rogue alchemists looking to push Hunter flesh beyond its natural limits.",
			history: "Highly regulated by the International Guild Association.",
			curse: "",
			personality: "Silent, hungry.",
			current_owner: "Widespread among underground syndicates.",
			prior_owners: ["Guild Outcasts", "Rogue Hunters"],
		},
		flavor:
			"Purges the chains of mortality. Evolution compressed into a single, violent instant.",
		discovery_lore:
			"Sold by a mysterious merchant who appears only during full moons near active Gate sites.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Speak the tattoo's true name",
			type: "Tattoo",
			frequency: "Passive",
			duration: "1 minute",
			action: "Speak the tattoo's true name",
			ability: "Presence",
			damage_profile: "1d10 force",
			lattice_interaction:
				"Storm Essence Distillate resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies left arm tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Stunning",
			attack: {
				type: "force",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "none",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Storm Essence Distillate, DC 18 tattooing check, 4 hours of uninterrupted work",
			],
		},
		effects: {
			primary: "Your movement speed increases by 10 feet.",
			secondary:
				"You ignore the first instance of this damage type each combat.",
			tertiary:
				"Emergency Pulse: When reduced to 0 HP, the tattoo activates automatically (1/long rest).",
			passive: ["Your movement speed increases by 10 feet."],
			active: [
				{
					name: "Tattoo Activation",
					description: "Speak the tattoo's true name to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			primaryEffect: "Your movement speed increases by 10 feet.",
			secondaryEffect: "",
			passiveBonuses: [
				{
					stat: "force aura",
					value: 1,
				},
			],
		},
		limitations: {
			uses: "Proficiency/long rest",
			recharge: "Short rest",
			requires_attunement: true,
			conditions: [
				"Requires tattoo attunement slot (left arm)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 100,
			charges: 0,
			uses_per_rest: 3,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
		},
		image: "/generated/effects/darkness-shroud.webp",
	},
	{
		id: "tattoo_7",
		name: "Flame Exhaust",
		display_name: "Flame Exhaust",
		description:
			"Safely expels excess heat from fire magic. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "uncommon",
		attunement: true,
		body_part: "Ribs",
		ink_type: "Salamander Extract",
		active_veins: ["Ribs"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Inked by rogue alchemists looking to push Hunter flesh beyond its natural limits.",
			history: "Highly regulated by the International Guild Association.",
			curse: "",
			personality: "Silent, hungry.",
			current_owner: "Widespread among underground syndicates.",
			prior_owners: ["Guild Outcasts", "Rogue Hunters"],
		},
		flavor:
			"Mirrors the threshold of human potential. A whisper from the edge of oblivion.",
		discovery_lore:
			"Discovered by an E-Rank Hunter who stumbled into an unmarked side passage during a routine dungeon clear.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Focus your intent on the glyph",
			type: "Tattoo",
			frequency: "2/short rest",
			duration: "1 hour",
			action: "Focus your intent on the glyph",
			ability: "Intelligence",
			damage_profile: "N/A (utility/defensive)",
			lattice_interaction:
				"Abyssal Ichor resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies hands tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Blindness",
			attack: {
				type: "force",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "none",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Abyssal Ichor, DC 17 tattooing check, 4 hours of uninterrupted work",
			],
		},
		effects: {
			primary:
				"Deal 1d6 force damage to creatures that hit you with melee attacks.",
			secondary:
				"You ignore the first instance of this damage type each combat.",
			tertiary:
				"Emergency Pulse: When reduced to 0 HP, the tattoo activates automatically (1/long rest).",
			passive: [
				"Deal 1d6 force damage to creatures that hit you with melee attacks.",
			],
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Focus your intent on the glyph to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			primaryEffect:
				"Deal 1d6 force damage to creatures that hit you with melee attacks.",
			secondaryEffect: "",
			passiveBonuses: [
				{
					stat: "force aura",
					value: 1,
				},
			],
		},
		limitations: {
			uses: "2/short rest",
			recharge: "Short rest",
			requires_attunement: true,
			conditions: [
				"Requires tattoo attunement slot (hands)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 1000,
			charges: 0,
			uses_per_rest: 2,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
		},
		image: "/generated/effects/arcane-sigil.webp",
	},
	{
		id: "tattoo_8",
		name: "Wind-Shear Cloak",
		display_name: "Wind-Shear Cloak",
		description:
			"A wind-magic weave that helps the Hunter cut through the air. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "uncommon",
		attunement: true,
		body_part: "Legs",
		ink_type: "Griffon Feather Ink",
		active_veins: ["Legs"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Inked by rogue alchemists looking to push Hunter flesh beyond its natural limits.",
			history: "Highly regulated by the International Guild Association.",
			curse: "",
			personality: "Silent, hungry.",
			current_owner: "Widespread among underground syndicates.",
			prior_owners: ["Guild Outcasts", "Rogue Hunters"],
		},
		flavor:
			"Erases the boundary between life and death. The reason S-Rank Gates are feared.",
		discovery_lore:
			"Gifted by the System itself as a reward for completing a hidden quest chain.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Speak the tattoo's true name",
			type: "Tattoo",
			frequency: "Proficiency/long rest",
			duration: "10 minutes",
			action: "Speak the tattoo's true name",
			ability: "Intelligence",
			damage_profile: "1d10 psychic",
			lattice_interaction:
				"Storm Essence Distillate resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies left leg tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Lethargy",
			attack: {
				type: "psychic",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "none",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Storm Essence Distillate, DC 13 tattooing check, 4 hours of uninterrupted work",
			],
		},
		effects: {
			primary:
				"Deal 2d4 psychic damage to creatures that hit you with melee attacks.",
			secondary:
				"The ink glows faintly, granting advantage on Intimidation checks.",
			tertiary:
				"Resonance: When multiple tattoos are active, gain +1 AC per active tattoo.",
			passive: [
				"Deal 2d4 psychic damage to creatures that hit you with melee attacks.",
			],
			active: [
				{
					name: "Tattoo Activation",
					description: "Speak the tattoo's true name to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			primaryEffect:
				"Deal 2d4 psychic damage to creatures that hit you with melee attacks.",
			secondaryEffect: "",
			passiveBonuses: [
				{
					stat: "psychic aura",
					value: 1,
				},
			],
		},
		limitations: {
			uses: "Passive + 1 active/short rest",
			recharge: "Short rest",
			requires_attunement: true,
			conditions: [
				"Requires tattoo attunement slot (left leg)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 1000,
			charges: 0,
			uses_per_rest: 2,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
		},
		image: "/generated/effects/darkness-shroud.webp",
	},
	{
		id: "tattoo_9",
		name: "Blood-Iron Seal",
		display_name: "Blood-Iron Seal",
		description:
			"Seals wounds instantly using blood-magic manipulation. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "uncommon",
		attunement: true,
		body_part: "Heart",
		ink_type: "Vampire Lord Dust",
		active_veins: ["Heart"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Inked by rogue alchemists looking to push Hunter flesh beyond its natural limits.",
			history: "Highly regulated by the International Guild Association.",
			curse: "",
			personality: "Silent, hungry.",
			current_owner: "Widespread among underground syndicates.",
			prior_owners: ["Guild Outcasts", "Rogue Hunters"],
		},
		flavor:
			"Absorbs the threshold of human potential. The breaking point of all resistance.",
		discovery_lore:
			"Emerged from a Gate Boss's dissolution cloud, hovering where the creature's heart had been.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Channel mana through the ink circuits",
			type: "Tattoo",
			frequency: "2/short rest",
			duration: "1 hour",
			action: "Channel mana through the ink circuits",
			ability: "Vitality",
			damage_profile: "N/A (utility/defensive)",
			lattice_interaction:
				"Titan Marrow Blend resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies left arm tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Stunning",
			attack: {
				type: "cold",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "none",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Titan Marrow Blend, DC 18 tattooing check, 4 hours of uninterrupted work",
			],
		},
		effects: {
			primary: "Gain +2 to Sense while the tattoo is active.",
			secondary:
				"The ink glows faintly, granting advantage on Intimidation checks.",
			tertiary:
				"Resonance: When multiple tattoos are active, gain +1 AC per active tattoo.",
			passive: ["Gain +2 to Sense while the tattoo is active."],
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Channel mana through the ink circuits to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			primaryEffect: "Gain +2 to Sense while the tattoo is active.",
			secondaryEffect: "",
			passiveBonuses: [
				{
					stat: "cold aura",
					value: 1,
				},
			],
		},
		limitations: {
			uses: "Passive + 1 active/short rest",
			recharge: "Short rest",
			requires_attunement: true,
			conditions: [
				"Requires tattoo attunement slot (left arm)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 5000,
			charges: 0,
			uses_per_rest: 3,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
		},
		image: "/generated/effects/darkness-shroud.webp",
	},
	{
		id: "tattoo_10",
		name: "Pain-Ward Glyphs",
		display_name: "Pain-Ward Glyphs",
		description:
			"Temporarily dulls agony via localized illusion magic. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "uncommon",
		attunement: true,
		body_part: "Forehead",
		ink_type: "Ghoul Extract",
		active_veins: ["Forehead"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Inked by rogue alchemists looking to push Hunter flesh beyond its natural limits.",
			history: "Highly regulated by the International Guild Association.",
			curse: "",
			personality: "Silent, hungry.",
			current_owner: "Widespread among underground syndicates.",
			prior_owners: ["Guild Outcasts", "Rogue Hunters"],
		},
		flavor:
			"Warps the dimensional barrier. Evolution compressed into a single, violent instant.",
		discovery_lore:
			"Materialized on a Hunter's workbench overnight, leaving scorch marks in the shape of unknown glyphs.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Speak the tattoo's true name",
			type: "Tattoo",
			frequency: "1/short rest",
			duration: "10 minutes",
			action: "Speak the tattoo's true name",
			ability: "Vitality",
			damage_profile: "2d6 poison",
			lattice_interaction:
				"Phoenix Ash Emulsion resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies right arm tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Lethargy",
			attack: {
				type: "poison",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "none",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Phoenix Ash Emulsion, DC 21 tattooing check, 4 hours of uninterrupted work",
			],
		},
		effects: {
			primary: "You can see in magical darkness out to 60 feet.",
			secondary:
				"The ink glows faintly, granting advantage on Intimidation checks.",
			tertiary:
				"Resonance: When multiple tattoos are active, gain +1 AC per active tattoo.",
			passive: ["You can see in magical darkness out to 60 feet."],
			active: [
				{
					name: "Tattoo Activation",
					description: "Speak the tattoo's true name to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			primaryEffect: "You can see in magical darkness out to 60 feet.",
			secondaryEffect: "",
			passiveBonuses: [
				{
					stat: "poison aura",
					value: 1,
				},
			],
		},
		limitations: {
			uses: "2/short rest",
			recharge: "Long rest",
			requires_attunement: true,
			conditions: [
				"Requires tattoo attunement slot (right arm)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 500,
			charges: 0,
			uses_per_rest: 3,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
		},
		image: "/generated/effects/darkness-shroud.webp",
	},
	{
		id: "tattoo_11",
		name: "Blind-Sight Resonance",
		display_name: "Blind-Sight Resonance",
		description:
			"Uses magical pulses to track threats in total darkness. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "uncommon",
		attunement: true,
		body_part: "Throat",
		ink_type: "Blind Cave Crawler Core",
		active_veins: ["Throat"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Inked by rogue alchemists looking to push Hunter flesh beyond its natural limits.",
			history: "Highly regulated by the International Guild Association.",
			curse: "",
			personality: "Silent, hungry.",
			current_owner: "Widespread among underground syndicates.",
			prior_owners: ["Guild Outcasts", "Rogue Hunters"],
		},
		flavor:
			"Dissolves the silence between heartbeats. A whisper from the edge of oblivion.",
		discovery_lore:
			"Sold by a mysterious merchant who appears only during full moons near active Gate sites.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Speak the tattoo's true name",
			type: "Tattoo",
			frequency: "Proficiency/long rest",
			duration: "10 minutes",
			action: "Speak the tattoo's true name",
			ability: "Presence",
			damage_profile: "2d6 acid",
			lattice_interaction:
				"Shadowblood Tincture resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies back tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Blindness",
			attack: {
				type: "acid",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "none",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Shadowblood Tincture, DC 20 tattooing check, 4 hours of uninterrupted work",
			],
		},
		effects: {
			primary: "Your movement speed increases by 10 feet.",
			secondary:
				"The ink glows faintly, granting advantage on Intimidation checks.",
			tertiary:
				"Resonance: When multiple tattoos are active, gain +1 AC per active tattoo.",
			passive: ["Your movement speed increases by 10 feet."],
			active: [
				{
					name: "Tattoo Activation",
					description: "Speak the tattoo's true name to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			primaryEffect: "Your movement speed increases by 10 feet.",
			secondaryEffect: "",
			passiveBonuses: [
				{
					stat: "acid aura",
					value: 1,
				},
			],
		},
		limitations: {
			uses: "Passive only",
			recharge: "Short rest",
			requires_attunement: true,
			conditions: [
				"Requires tattoo attunement slot (back)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 2500,
			charges: 0,
			uses_per_rest: 2,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
		},
		image: "/generated/effects/darkness-shroud.webp",
	},
	{
		id: "tattoo_12",
		name: "Acidic Excretion",
		display_name: "Acidic Excretion",
		description:
			"Secretes a thin layer of dungeon-grade corrosive fluid. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "uncommon",
		attunement: true,
		body_part: "Palms",
		ink_type: "Ooze Core",
		active_veins: ["Palms"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Inked by rogue alchemists looking to push Hunter flesh beyond its natural limits.",
			history: "Highly regulated by the International Guild Association.",
			curse: "",
			personality: "Silent, hungry.",
			current_owner: "Widespread among underground syndicates.",
			prior_owners: ["Guild Outcasts", "Rogue Hunters"],
		},
		flavor:
			"Rends the certainty of outcomes. A testament to what Hunters have become.",
		discovery_lore:
			"Excavated from the crystallized mana deposit at the center of a depleted Gate core.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Focus your intent on the glyph",
			type: "Tattoo",
			frequency: "Passive",
			duration: "10 minutes",
			action: "Focus your intent on the glyph",
			ability: "Presence",
			damage_profile: "2d4 cold",
			lattice_interaction:
				"Starfall Residue resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies chest tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Fear",
			attack: {
				type: "cold",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "none",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Starfall Residue, DC 21 tattooing check, 4 hours of uninterrupted work",
			],
		},
		effects: {
			primary: "Your movement speed increases by 10 feet.",
			secondary:
				"Your unarmed strikes deal an additional 1d4 of the tattoo's element.",
			tertiary:
				"Overcharge: Once per long rest, double the primary effect for 1 round.",
			passive: ["Your movement speed increases by 10 feet."],
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Focus your intent on the glyph to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			primaryEffect: "Your movement speed increases by 10 feet.",
			secondaryEffect: "",
			passiveBonuses: [
				{
					stat: "cold aura",
					value: 1,
				},
			],
		},
		limitations: {
			uses: "2/short rest",
			recharge: "Long rest",
			requires_attunement: true,
			conditions: [
				"Requires tattoo attunement slot (chest)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 500,
			charges: 0,
			uses_per_rest: 1,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
		},
		image: "/generated/effects/darkness-shroud.webp",
	},
	{
		id: "tattoo_13",
		name: "Purifying Furnace",
		display_name: "Purifying Furnace",
		description:
			"Burns toxins and venoms out of the bloodstream. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "uncommon",
		attunement: true,
		body_part: "Stomach",
		ink_type: "Hellhound Ash",
		active_veins: ["Stomach"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Inked by rogue alchemists looking to push Hunter flesh beyond its natural limits.",
			history: "Highly regulated by the International Guild Association.",
			curse: "",
			personality: "Silent, hungry.",
			current_owner: "Widespread among underground syndicates.",
			prior_owners: ["Guild Outcasts", "Rogue Hunters"],
		},
		flavor:
			"Purges the concept of distance. Proof that some things cannot be survived.",
		discovery_lore:
			"Traded by a nomadic Awakened who claimed to have no memory of acquiring it.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Channel mana through the ink circuits",
			type: "Tattoo",
			frequency: "Passive",
			duration: "Permanent (passive)",
			action: "Channel mana through the ink circuits",
			ability: "Intelligence",
			damage_profile: "N/A (utility/defensive)",
			lattice_interaction:
				"Rift Essence Suspension resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies left arm tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Paralysis",
			attack: {
				type: "radiant",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "none",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Rift Essence Suspension, DC 20 tattooing check, 4 hours of uninterrupted work",
			],
		},
		effects: {
			primary: "Your movement speed increases by 10 feet.",
			secondary:
				"You ignore the first instance of this damage type each combat.",
			tertiary:
				"Overcharge: Once per long rest, double the primary effect for 1 round.",
			passive: ["Your movement speed increases by 10 feet."],
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Channel mana through the ink circuits to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			primaryEffect: "Your movement speed increases by 10 feet.",
			secondaryEffect: "",
			passiveBonuses: [
				{
					stat: "radiant aura",
					value: 1,
				},
			],
		},
		limitations: {
			uses: "Passive + 1 active/short rest",
			recharge: "Long rest",
			requires_attunement: true,
			conditions: [
				"Requires tattoo attunement slot (left arm)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 2500,
			charges: 0,
			uses_per_rest: 1,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
		},
		image: "/generated/effects/darkness-shroud.webp",
	},
	{
		id: "tattoo_14",
		name: "Sky-Walker's Tread",
		display_name: "Sky-Walker's Tread",
		description:
			"Grants the ability to walk on walls via wind magic. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "uncommon",
		attunement: true,
		body_part: "Feet",
		ink_type: "Wind Elemental Core",
		active_veins: ["Feet"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Inked by rogue alchemists looking to push Hunter flesh beyond its natural limits.",
			history: "Highly regulated by the International Guild Association.",
			curse: "",
			personality: "Silent, hungry.",
			current_owner: "Widespread among underground syndicates.",
			prior_owners: ["Guild Outcasts", "Rogue Hunters"],
		},
		flavor:
			"Erases the chains of mortality. A whisper from the edge of oblivion.",
		discovery_lore:
			"Located by a detection-type Hunter whose radar ability triggered on an otherwise empty room.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Channel mana through the ink circuits",
			type: "Tattoo",
			frequency: "1/long rest",
			duration: "1 hour",
			action: "Channel mana through the ink circuits",
			ability: "Presence",
			damage_profile: "N/A (utility/defensive)",
			lattice_interaction:
				"Storm Essence Distillate resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies shoulders tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Blindness",
			attack: {
				type: "acid",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "none",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Storm Essence Distillate, DC 11 tattooing check, 4 hours of uninterrupted work",
			],
		},
		effects: {
			primary: "You can see in magical darkness out to 60 feet.",
			secondary:
				"You ignore the first instance of this damage type each combat.",
			tertiary:
				"Overcharge: Once per long rest, double the primary effect for 1 round.",
			passive: ["You can see in magical darkness out to 60 feet."],
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Channel mana through the ink circuits to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			primaryEffect: "You can see in magical darkness out to 60 feet.",
			secondaryEffect: "",
			passiveBonuses: [
				{
					stat: "acid aura",
					value: 1,
				},
			],
		},
		limitations: {
			uses: "2/short rest",
			recharge: "Short rest",
			requires_attunement: true,
			conditions: [
				"Requires tattoo attunement slot (shoulders)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 250,
			charges: 0,
			uses_per_rest: 1,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
		},
		image: "/generated/effects/arcane-sigil.webp",
	},
	{
		id: "tattoo_15",
		name: "Mimic's Voice",
		display_name: "Mimic's Voice",
		description:
			"Perfectly replicate any voice heard. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "rare",
		attunement: true,
		body_part: "Throat",
		ink_type: "Doppelganger Tissue",
		active_veins: ["Throat"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Inked by rogue alchemists looking to push Hunter flesh beyond its natural limits.",
			history: "Highly regulated by the International Guild Association.",
			curse:
				"The user becomes unable to dream, replaced by visions of the void between Gates.",
			personality: "Silent, hungry.",
			current_owner: "Widespread among underground syndicates.",
			prior_owners: ["Guild Outcasts", "Rogue Hunters"],
		},
		flavor:
			"Purges the chains of mortality. A whisper from the edge of oblivion.",
		discovery_lore:
			"Appeared in a Hunter's inventory after a System notification that no one else could see.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Press your palm against the design",
			type: "Tattoo",
			frequency: "1/long rest",
			duration: "Permanent (passive)",
			action: "Press your palm against the design",
			ability: "Intelligence",
			damage_profile: "N/A (utility/defensive)",
			lattice_interaction:
				"Starfall Residue resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies hands tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Blindness",
			attack: {
				type: "acid",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "none",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Starfall Residue, DC 19 tattooing check, 4 hours of uninterrupted work",
			],
		},
		effects: {
			primary:
				"Deal 2d4 acid damage to creatures that hit you with melee attacks.",
			secondary:
				"You ignore the first instance of this damage type each combat.",
			tertiary:
				"Resonance: When multiple tattoos are active, gain +1 AC per active tattoo.",
			passive: [
				"Deal 2d4 acid damage to creatures that hit you with melee attacks.",
			],
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Press your palm against the design to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			primaryEffect:
				"Deal 2d4 acid damage to creatures that hit you with melee attacks.",
			secondaryEffect: "",
			passiveBonuses: [
				{
					stat: "acid aura",
					value: 1,
				},
			],
		},
		limitations: {
			uses: "Passive only",
			recharge: "Long rest",
			requires_attunement: true,
			conditions: [
				"Requires tattoo attunement slot (hands)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 500,
			charges: 0,
			uses_per_rest: 2,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
		},
		image: "/generated/effects/arcane-sigil.webp",
	},
	{
		id: "tattoo_16",
		name: "Ogre's Vigor",
		display_name: "Ogre's Vigor",
		description:
			"Instantly doubles muscle density for a short time. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "rare",
		attunement: true,
		body_part: "Biceps",
		ink_type: "Ogre Boss Blood",
		active_veins: ["Biceps"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Inked by rogue alchemists looking to push Hunter flesh beyond its natural limits.",
			history: "Highly regulated by the International Guild Association.",
			curse:
				"Prolonged wielders report hearing a second heartbeat that doesn't match their own.",
			personality: "Silent, hungry.",
			current_owner: "Widespread among underground syndicates.",
			prior_owners: ["Guild Outcasts", "Rogue Hunters"],
		},
		flavor:
			"Corrodes the threshold of human potential. A beautiful catastrophe measured in milliseconds.",
		discovery_lore:
			"Found in a hidden compartment of a relic weapon that had been in Guild storage for years.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Channel mana through the ink circuits",
			type: "Tattoo",
			frequency: "1/long rest",
			duration: "1 minute",
			action: "Channel mana through the ink circuits",
			ability: "Intelligence",
			damage_profile: "1d8 fire",
			lattice_interaction:
				"Starfall Residue resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies back tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Stunning",
			attack: {
				type: "fire",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "none",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Starfall Residue, DC 18 tattooing check, 4 hours of uninterrupted work",
			],
		},
		effects: {
			primary: "Gain resistance to fire damage.",
			secondary:
				"You ignore the first instance of this damage type each combat.",
			tertiary:
				"Overcharge: Once per long rest, double the primary effect for 1 round.",
			passive: ["Gain resistance to fire damage."],
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Channel mana through the ink circuits to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			primaryEffect: "Gain resistance to fire damage.",
			secondaryEffect: "",
			passiveBonuses: [
				{
					stat: "fire aura",
					value: 1,
				},
			],
		},
		limitations: {
			uses: "Passive + 1 active/short rest",
			recharge: "Short rest",
			requires_attunement: true,
			conditions: [
				"Requires tattoo attunement slot (back)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 2500,
			charges: 0,
			uses_per_rest: 2,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
		},
		image: "/generated/effects/darkness-shroud.webp",
	},
	{
		id: "tattoo_17",
		name: "Shadow-Shift Sigils",
		display_name: "Shadow-Shift Sigils",
		description:
			"Temporarily turn flesh into incorporeal shadows. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "rare",
		attunement: true,
		body_part: "Shoulders",
		ink_type: "Wraith Ectoplasm",
		active_veins: ["Shoulders"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Inked by rogue alchemists looking to push Hunter flesh beyond its natural limits.",
			history: "Highly regulated by the International Guild Association.",
			curse: "",
			personality: "Silent, hungry.",
			current_owner: "Widespread among underground syndicates.",
			prior_owners: ["Guild Outcasts", "Rogue Hunters"],
		},
		flavor:
			"Eclipses the illusion of safety. A beautiful catastrophe measured in milliseconds.",
		discovery_lore:
			"Purchased from a black-market auction in the underground district of Neo-Seoul for an undisclosed sum.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Speak the tattoo's true name",
			type: "Tattoo",
			frequency: "2/short rest",
			duration: "Permanent (passive)",
			action: "Speak the tattoo's true name",
			ability: "Presence",
			damage_profile: "2d4 necrotic",
			lattice_interaction:
				"Mana-Crystal Pigment resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies spine tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Lethargy",
			attack: {
				type: "necrotic",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "none",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Mana-Crystal Pigment, DC 12 tattooing check, 4 hours of uninterrupted work",
			],
		},
		effects: {
			primary:
				"Deal 1d6 necrotic damage to creatures that hit you with melee attacks.",
			secondary: "Allies within 5 feet gain +1 to saving throws.",
			tertiary:
				"Resonance: When multiple tattoos are active, gain +1 AC per active tattoo.",
			passive: [
				"Deal 1d6 necrotic damage to creatures that hit you with melee attacks.",
			],
			active: [
				{
					name: "Tattoo Activation",
					description: "Speak the tattoo's true name to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			primaryEffect:
				"Deal 1d6 necrotic damage to creatures that hit you with melee attacks.",
			secondaryEffect: "",
			passiveBonuses: [
				{
					stat: "necrotic aura",
					value: 1,
				},
			],
		},
		limitations: {
			uses: "Proficiency/long rest",
			recharge: "Short rest",
			requires_attunement: true,
			conditions: [
				"Requires tattoo attunement slot (spine)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 2500,
			charges: 0,
			uses_per_rest: 3,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
		},
		image: "/generated/effects/arcane-sigil.webp",
	},
	{
		id: "tattoo_18",
		name: "Chameleon Epidermis",
		display_name: "Chameleon Epidermis",
		description:
			"Blends perfectly into the environment using light-bending magic. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "rare",
		attunement: true,
		body_part: "Full Back",
		ink_type: "Mimic Ichor",
		active_veins: ["Full Back"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Inked by rogue alchemists looking to push Hunter flesh beyond its natural limits.",
			history: "Highly regulated by the International Guild Association.",
			curse: "",
			personality: "Silent, hungry.",
			current_owner: "Widespread among underground syndicates.",
			prior_owners: ["Guild Outcasts", "Rogue Hunters"],
		},
		flavor:
			"Reclaims the illusion of safety. A testament to what Hunters have become.",
		discovery_lore:
			"Discovered by an E-Rank Hunter who stumbled into an unmarked side passage during a routine dungeon clear.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Flex the tattooed muscle group",
			type: "Tattoo",
			frequency: "Passive",
			duration: "1 minute",
			action: "Flex the tattooed muscle group",
			ability: "Intelligence",
			damage_profile: "N/A (utility/defensive)",
			lattice_interaction:
				"Rift Essence Suspension resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies ribs tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Lethargy",
			attack: {
				type: "thunder",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "none",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Rift Essence Suspension, DC 14 tattooing check, 4 hours of uninterrupted work",
			],
		},
		effects: {
			primary: "Your movement speed increases by 10 feet.",
			secondary:
				"Your unarmed strikes deal an additional 1d4 of the tattoo's element.",
			tertiary:
				"Resonance: When multiple tattoos are active, gain +1 AC per active tattoo.",
			passive: ["Your movement speed increases by 10 feet."],
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Flex the tattooed muscle group to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			primaryEffect: "Your movement speed increases by 10 feet.",
			secondaryEffect: "",
			passiveBonuses: [
				{
					stat: "thunder aura",
					value: 1,
				},
			],
		},
		limitations: {
			uses: "Proficiency/long rest",
			recharge: "Short rest",
			requires_attunement: true,
			conditions: [
				"Requires tattoo attunement slot (ribs)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 250,
			charges: 0,
			uses_per_rest: 3,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
		},
		image: "/generated/effects/arcane-sigil.webp",
	},
	{
		id: "tattoo_19",
		name: "Abyssal Lungs",
		display_name: "Abyssal Lungs",
		description:
			"Extracts oxygen from water and poison gas. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "rare",
		attunement: true,
		body_part: "Neck",
		ink_type: "Kraken Ink",
		active_veins: ["Neck"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Inked by rogue alchemists looking to push Hunter flesh beyond its natural limits.",
			history: "Highly regulated by the International Guild Association.",
			curse: "",
			personality: "Silent, hungry.",
			current_owner: "Widespread among underground syndicates.",
			prior_owners: ["Guild Outcasts", "Rogue Hunters"],
		},
		flavor:
			"Binds the silence between heartbeats. Evolution compressed into a single, violent instant.",
		discovery_lore:
			"Found washed ashore near a coastal Gate, wrapped in fabric that dissolved upon touch.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Flex the tattooed muscle group",
			type: "Tattoo",
			frequency: "2/short rest",
			duration: "1 minute",
			action: "Flex the tattooed muscle group",
			ability: "Intelligence",
			damage_profile: "N/A (utility/defensive)",
			lattice_interaction:
				"Abyssal Ichor resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies left arm tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Paralysis",
			attack: {
				type: "cold",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "none",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Abyssal Ichor, DC 20 tattooing check, 4 hours of uninterrupted work",
			],
		},
		effects: {
			primary: "You can see in magical darkness out to 60 feet.",
			secondary: "Allies within 5 feet gain +1 to saving throws.",
			tertiary:
				"Overcharge: Once per long rest, double the primary effect for 1 round.",
			passive: ["You can see in magical darkness out to 60 feet."],
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Flex the tattooed muscle group to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			primaryEffect: "You can see in magical darkness out to 60 feet.",
			secondaryEffect: "",
			passiveBonuses: [
				{
					stat: "cold aura",
					value: 1,
				},
			],
		},
		limitations: {
			uses: "Proficiency/long rest",
			recharge: "Short rest",
			requires_attunement: true,
			conditions: [
				"Requires tattoo attunement slot (left arm)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 100,
			charges: 0,
			uses_per_rest: 2,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
		},
		image: "/generated/effects/darkness-shroud.webp",
	},
	{
		id: "tattoo_20",
		name: "Mana-Sever Pulse",
		display_name: "Mana-Sever Pulse",
		description:
			"Shut down unshielded magic circles in the immediate vicinity. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "rare",
		attunement: true,
		body_part: "Chest",
		ink_type: "Thunderbird Spark",
		active_veins: ["Chest"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Inked by rogue alchemists looking to push Hunter flesh beyond its natural limits.",
			history: "Highly regulated by the International Guild Association.",
			curse: "",
			personality: "Silent, hungry.",
			current_owner: "Widespread among underground syndicates.",
			prior_owners: ["Guild Outcasts", "Rogue Hunters"],
		},
		flavor:
			"Warps the architect's design. The breaking point of all resistance.",
		discovery_lore:
			"Excavated from the crystallized mana deposit at the center of a depleted Gate core.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Press your palm against the design",
			type: "Tattoo",
			frequency: "1/long rest",
			duration: "1 minute",
			action: "Press your palm against the design",
			ability: "Intelligence",
			damage_profile: "N/A (utility/defensive)",
			lattice_interaction:
				"Luminite Extract resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies hands tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Stunning",
			attack: {
				type: "necrotic",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "none",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Luminite Extract, DC 21 tattooing check, 4 hours of uninterrupted work",
			],
		},
		effects: {
			primary: "Gain +2 to Sense while the tattoo is active.",
			secondary:
				"The ink glows faintly, granting advantage on Intimidation checks.",
			tertiary:
				"Emergency Pulse: When reduced to 0 HP, the tattoo activates automatically (1/long rest).",
			passive: ["Gain +2 to Sense while the tattoo is active."],
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Press your palm against the design to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			primaryEffect: "Gain +2 to Sense while the tattoo is active.",
			secondaryEffect: "",
			passiveBonuses: [
				{
					stat: "necrotic aura",
					value: 1,
				},
			],
		},
		limitations: {
			uses: "Passive + 1 active/short rest",
			recharge: "Dawn",
			requires_attunement: true,
			conditions: [
				"Requires tattoo attunement slot (hands)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 5000,
			charges: 0,
			uses_per_rest: 1,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
		},
		image: "/generated/effects/arcane-sigil.webp",
	},
	{
		id: "tattoo_21",
		name: "Spatial Anchor",
		display_name: "Spatial Anchor",
		description:
			"Prevents being forcibly teleported or banished. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "rare",
		attunement: true,
		body_part: "Feet",
		ink_type: "Void Gate Dust",
		active_veins: ["Feet"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Inked by rogue alchemists looking to push Hunter flesh beyond its natural limits.",
			history: "Highly regulated by the International Guild Association.",
			curse: "",
			personality: "Silent, hungry.",
			current_owner: "Widespread among underground syndicates.",
			prior_owners: ["Guild Outcasts", "Rogue Hunters"],
		},
		flavor:
			"Crushes the architecture of the soul. Evolution compressed into a single, violent instant.",
		discovery_lore:
			"Dropped by a mini-boss that shouldn't have existed according to the Gate's difficulty rating.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Focus your intent on the glyph",
			type: "Tattoo",
			frequency: "2/short rest",
			duration: "1 hour",
			action: "Focus your intent on the glyph",
			ability: "Intelligence",
			damage_profile: "1d10 thunder",
			lattice_interaction:
				"Abyssal Ichor resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies ribs tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Blindness",
			attack: {
				type: "thunder",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "none",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Abyssal Ichor, DC 18 tattooing check, 4 hours of uninterrupted work",
			],
		},
		effects: {
			primary: "You can see in magical darkness out to 60 feet.",
			secondary:
				"You ignore the first instance of this damage type each combat.",
			tertiary:
				"Emergency Pulse: When reduced to 0 HP, the tattoo activates automatically (1/long rest).",
			passive: ["You can see in magical darkness out to 60 feet."],
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Focus your intent on the glyph to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			primaryEffect: "You can see in magical darkness out to 60 feet.",
			secondaryEffect: "",
			passiveBonuses: [
				{
					stat: "thunder aura",
					value: 1,
				},
			],
		},
		limitations: {
			uses: "Passive only",
			recharge: "Long rest",
			requires_attunement: true,
			conditions: [
				"Requires tattoo attunement slot (ribs)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 250,
			charges: 0,
			uses_per_rest: 1,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
		},
		image: "/generated/effects/arcane-sigil.webp",
	},
	{
		id: "tattoo_22",
		name: "Harpy's Grace",
		display_name: "Harpy's Grace",
		description:
			"Reduces bodily weight to allow slow falling and massive jumps. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "rare",
		attunement: true,
		body_part: "Collarbone",
		ink_type: "Harpy Queen Marrow",
		active_veins: ["Collarbone"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Inked by rogue alchemists looking to push Hunter flesh beyond its natural limits.",
			history: "Highly regulated by the International Guild Association.",
			curse: "",
			personality: "Silent, hungry.",
			current_owner: "Widespread among underground syndicates.",
			prior_owners: ["Guild Outcasts", "Rogue Hunters"],
		},
		flavor:
			"Inverts the boundary between life and death. Evolution compressed into a single, violent instant.",
		discovery_lore:
			"Excavated from the crystallized mana deposit at the center of a depleted Gate core.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Focus your intent on the glyph",
			type: "Tattoo",
			frequency: "Passive",
			duration: "10 minutes",
			action: "Focus your intent on the glyph",
			ability: "Presence",
			damage_profile: "N/A (utility/defensive)",
			lattice_interaction:
				"Storm Essence Distillate resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies shoulders tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Paralysis",
			attack: {
				type: "radiant",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "none",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Storm Essence Distillate, DC 15 tattooing check, 4 hours of uninterrupted work",
			],
		},
		effects: {
			primary: "Gain resistance to radiant damage.",
			secondary:
				"The ink glows faintly, granting advantage on Intimidation checks.",
			tertiary:
				"Resonance: When multiple tattoos are active, gain +1 AC per active tattoo.",
			passive: ["Gain resistance to radiant damage."],
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Focus your intent on the glyph to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			primaryEffect: "Gain resistance to radiant damage.",
			secondaryEffect: "",
			passiveBonuses: [
				{
					stat: "radiant aura",
					value: 1,
				},
			],
		},
		limitations: {
			uses: "Passive + 1 active/short rest",
			recharge: "Short rest",
			requires_attunement: true,
			conditions: [
				"Requires tattoo attunement slot (shoulders)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 1000,
			charges: 0,
			uses_per_rest: 2,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
		},
		image: "/generated/effects/arcane-sigil.webp",
	},
	{
		id: "tattoo_23",
		name: "Rebound Ward",
		display_name: "Rebound Ward",
		description:
			"Explodes outward with force magic when hit by melee attacks. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "rare",
		attunement: true,
		body_part: "Shoulders",
		ink_type: "Blast-Jelly",
		active_veins: ["Shoulders"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Inked by rogue alchemists looking to push Hunter flesh beyond its natural limits.",
			history: "Highly regulated by the International Guild Association.",
			curse: "",
			personality: "Silent, hungry.",
			current_owner: "Widespread among underground syndicates.",
			prior_owners: ["Guild Outcasts", "Rogue Hunters"],
		},
		flavor:
			"Ignites the laws of physics. The death of hesitation, made manifest.",
		discovery_lore:
			"Emerged from a Gate Boss's dissolution cloud, hovering where the creature's heart had been.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Speak the tattoo's true name",
			type: "Tattoo",
			frequency: "Proficiency/long rest",
			duration: "1 hour",
			action: "Speak the tattoo's true name",
			ability: "Vitality",
			damage_profile: "N/A (utility/defensive)",
			lattice_interaction:
				"Shadowblood Tincture resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies left arm tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Paralysis",
			attack: {
				type: "acid",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "none",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Shadowblood Tincture, DC 16 tattooing check, 4 hours of uninterrupted work",
			],
		},
		effects: {
			primary:
				"Deal 1d6 acid damage to creatures that hit you with melee attacks.",
			secondary:
				"The ink glows faintly, granting advantage on Intimidation checks.",
			tertiary:
				"Overcharge: Once per long rest, double the primary effect for 1 round.",
			passive: [
				"Deal 1d6 acid damage to creatures that hit you with melee attacks.",
			],
			active: [
				{
					name: "Tattoo Activation",
					description: "Speak the tattoo's true name to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			primaryEffect:
				"Deal 1d6 acid damage to creatures that hit you with melee attacks.",
			secondaryEffect: "",
			passiveBonuses: [
				{
					stat: "acid aura",
					value: 1,
				},
			],
		},
		limitations: {
			uses: "2/short rest",
			recharge: "Dawn",
			requires_attunement: true,
			conditions: [
				"Requires tattoo attunement slot (left arm)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 250,
			charges: 0,
			uses_per_rest: 2,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
		},
		image: "/generated/effects/darkness-shroud.webp",
	},
	{
		id: "tattoo_24",
		name: "Dragon's Breath",
		display_name: "Dragon's Breath",
		description:
			"Breathe out a cloud of choking, magical exhaust. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "rare",
		attunement: true,
		body_part: "Lungs",
		ink_type: "Green Dragon Bile",
		active_veins: ["Lungs"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Inked by rogue alchemists looking to push Hunter flesh beyond its natural limits.",
			history: "Highly regulated by the International Guild Association.",
			curse: "",
			personality: "Silent, hungry.",
			current_owner: "Widespread among underground syndicates.",
			prior_owners: ["Guild Outcasts", "Rogue Hunters"],
		},
		flavor:
			"Reclaims the laws of physics. Proof that some things cannot be survived.",
		discovery_lore:
			"Materialized on a Hunter's workbench overnight, leaving scorch marks in the shape of unknown glyphs.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Channel mana through the ink circuits",
			type: "Tattoo",
			frequency: "2/short rest",
			duration: "10 minutes",
			action: "Channel mana through the ink circuits",
			ability: "Intelligence",
			damage_profile: "N/A (utility/defensive)",
			lattice_interaction:
				"Storm Essence Distillate resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies hands tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Stunning",
			attack: {
				type: "psychic",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "none",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Storm Essence Distillate, DC 12 tattooing check, 4 hours of uninterrupted work",
			],
		},
		effects: {
			primary:
				"Deal 1d6 psychic damage to creatures that hit you with melee attacks.",
			secondary:
				"The ink glows faintly, granting advantage on Intimidation checks.",
			tertiary:
				"Emergency Pulse: When reduced to 0 HP, the tattoo activates automatically (1/long rest).",
			passive: [
				"Deal 1d6 psychic damage to creatures that hit you with melee attacks.",
			],
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Channel mana through the ink circuits to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			primaryEffect:
				"Deal 1d6 psychic damage to creatures that hit you with melee attacks.",
			secondaryEffect: "",
			passiveBonuses: [
				{
					stat: "psychic aura",
					value: 1,
				},
			],
		},
		limitations: {
			uses: "Proficiency/long rest",
			recharge: "Long rest",
			requires_attunement: true,
			conditions: [
				"Requires tattoo attunement slot (hands)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 1000,
			charges: 0,
			uses_per_rest: 1,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
		},
		image: "/generated/effects/arcane-sigil.webp",
	},
	{
		id: "tattoo_25",
		name: "Chrono-Stutter",
		display_name: "Chrono-Stutter",
		description:
			"Allows a brief rewind in time. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "rare",
		attunement: true,
		body_part: "Temple",
		ink_type: "Time-Weaver Sand",
		active_veins: ["Temple"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Inked by rogue alchemists looking to push Hunter flesh beyond its natural limits.",
			history: "Highly regulated by the International Guild Association.",
			curse: "",
			personality: "Silent, hungry.",
			current_owner: "Widespread among underground syndicates.",
			prior_owners: ["Guild Outcasts", "Rogue Hunters"],
		},
		flavor:
			"Corrodes the fabric of reality. The last thing many anomalies ever see.",
		discovery_lore:
			"Found pulsing with residual mana in the aftermath of a Gate break, half-buried in shattered concrete.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Flex the tattooed muscle group",
			type: "Tattoo",
			frequency: "Passive",
			duration: "1 minute",
			action: "Flex the tattooed muscle group",
			ability: "Intelligence",
			damage_profile: "1d8 acid",
			lattice_interaction:
				"Rift Essence Suspension resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies chest tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Paralysis",
			attack: {
				type: "acid",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "none",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Rift Essence Suspension, DC 14 tattooing check, 4 hours of uninterrupted work",
			],
		},
		effects: {
			primary: "Gain resistance to acid damage.",
			secondary:
				"The ink glows faintly, granting advantage on Intimidation checks.",
			tertiary:
				"Emergency Pulse: When reduced to 0 HP, the tattoo activates automatically (1/long rest).",
			passive: ["Gain resistance to acid damage."],
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Flex the tattooed muscle group to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			primaryEffect: "Gain resistance to acid damage.",
			secondaryEffect: "",
			passiveBonuses: [
				{
					stat: "acid aura",
					value: 1,
				},
			],
		},
		limitations: {
			uses: "Passive + 1 active/short rest",
			recharge: "Dawn",
			requires_attunement: true,
			conditions: [
				"Requires tattoo attunement slot (chest)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 100,
			charges: 0,
			uses_per_rest: 1,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
		},
		image: "/generated/effects/darkness-shroud.webp",
	},
	{
		id: "tattoo_26",
		name: "Presence Concealment",
		display_name: "Presence Concealment",
		description:
			"Hides your Awakened aura completely. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "rare",
		attunement: true,
		body_part: "Heart",
		ink_type: "Shadow Fiend Essence",
		active_veins: ["Heart"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Inked by rogue alchemists looking to push Hunter flesh beyond its natural limits.",
			history: "Highly regulated by the International Guild Association.",
			curse: "",
			personality: "Silent, hungry.",
			current_owner: "Widespread among underground syndicates.",
			prior_owners: ["Guild Outcasts", "Rogue Hunters"],
		},
		flavor:
			"Rends the flow of causality. The breaking point of all resistance.",
		discovery_lore:
			"Dropped by a mini-boss that shouldn't have existed according to the Gate's difficulty rating.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Press your palm against the design",
			type: "Tattoo",
			frequency: "1/short rest",
			duration: "10 minutes",
			action: "Press your palm against the design",
			ability: "Presence",
			damage_profile: "1d8 poison",
			lattice_interaction:
				"Phoenix Ash Emulsion resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies left arm tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Blindness",
			attack: {
				type: "poison",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "none",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Phoenix Ash Emulsion, DC 12 tattooing check, 4 hours of uninterrupted work",
			],
		},
		effects: {
			primary: "Gain +2 to Strength while the tattoo is active.",
			secondary:
				"The ink glows faintly, granting advantage on Intimidation checks.",
			tertiary:
				"Emergency Pulse: When reduced to 0 HP, the tattoo activates automatically (1/long rest).",
			passive: ["Gain +2 to Strength while the tattoo is active."],
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Press your palm against the design to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			primaryEffect: "Gain +2 to Strength while the tattoo is active.",
			secondaryEffect: "",
			passiveBonuses: [
				{
					stat: "poison aura",
					value: 1,
				},
			],
		},
		limitations: {
			uses: "Proficiency/long rest",
			recharge: "Long rest",
			requires_attunement: true,
			conditions: [
				"Requires tattoo attunement slot (left arm)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 100,
			charges: 0,
			uses_per_rest: 2,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
		},
		image: "/generated/effects/darkness-shroud.webp",
	},
	{
		id: "tattoo_27",
		name: "Mind-Fortress",
		display_name: "Mind-Fortress",
		description:
			"Reflects mental intrusions and charm magic. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "rare",
		attunement: true,
		body_part: "Forehead",
		ink_type: "Mind-Eater Fluid",
		active_veins: ["Forehead"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Inked by rogue alchemists looking to push Hunter flesh beyond its natural limits.",
			history: "Highly regulated by the International Guild Association.",
			curse: "",
			personality: "Silent, hungry.",
			current_owner: "Widespread among underground syndicates.",
			prior_owners: ["Guild Outcasts", "Rogue Hunters"],
		},
		flavor:
			"Silences the last defense of the unprepared. Evolution compressed into a single, violent instant.",
		discovery_lore:
			"Traded by a nomadic Awakened who claimed to have no memory of acquiring it.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Speak the tattoo's true name",
			type: "Tattoo",
			frequency: "1/short rest",
			duration: "Permanent (passive)",
			action: "Speak the tattoo's true name",
			ability: "Presence",
			damage_profile: "1d8 force",
			lattice_interaction:
				"Luminite Extract resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies face tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Fear",
			attack: {
				type: "force",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "none",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Luminite Extract, DC 21 tattooing check, 4 hours of uninterrupted work",
			],
		},
		effects: {
			primary: "Gain +2 to Vitality while the tattoo is active.",
			secondary:
				"Your unarmed strikes deal an additional 1d4 of the tattoo's element.",
			tertiary:
				"Overcharge: Once per long rest, double the primary effect for 1 round.",
			passive: ["Gain +2 to Vitality while the tattoo is active."],
			active: [
				{
					name: "Tattoo Activation",
					description: "Speak the tattoo's true name to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			primaryEffect: "Gain +2 to Vitality while the tattoo is active.",
			secondaryEffect: "",
			passiveBonuses: [
				{
					stat: "force aura",
					value: 1,
				},
			],
		},
		limitations: {
			uses: "Passive only",
			recharge: "Dawn",
			requires_attunement: true,
			conditions: [
				"Requires tattoo attunement slot (face)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 100,
			charges: 0,
			uses_per_rest: 3,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
		},
		image: "/generated/effects/arcane-sigil.webp",
	},
	{
		id: "tattoo_28",
		name: "Manticore Spurs",
		display_name: "Manticore Spurs",
		description:
			"Extrudes poisoned bone spurs from the wrists. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "very_rare",
		attunement: true,
		body_part: "Wrists",
		ink_type: "Manticore Venom",
		active_veins: ["Wrists"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Inked by rogue alchemists looking to push Hunter flesh beyond its natural limits.",
			history: "Highly regulated by the International Guild Association.",
			curse: "",
			personality: "Silent, hungry.",
			current_owner: "Widespread among underground syndicates.",
			prior_owners: ["Guild Outcasts", "Rogue Hunters"],
		},
		flavor:
			"Dissolves the remnants of a dead world. The death of hesitation, made manifest.",
		discovery_lore:
			"Found pulsing with residual mana in the aftermath of a Gate break, half-buried in shattered concrete.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Flex the tattooed muscle group",
			type: "Tattoo",
			frequency: "1/short rest",
			duration: "Permanent (passive)",
			action: "Flex the tattooed muscle group",
			ability: "Presence",
			damage_profile: "1d8 necrotic",
			lattice_interaction:
				"Shadowblood Tincture resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies shoulders tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Stunning",
			attack: {
				type: "necrotic",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "none",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Shadowblood Tincture, DC 14 tattooing check, 4 hours of uninterrupted work",
			],
		},
		effects: {
			primary: "You can see in magical darkness out to 60 feet.",
			secondary: "Allies within 5 feet gain +1 to saving throws.",
			tertiary:
				"Overcharge: Once per long rest, double the primary effect for 1 round.",
			passive: ["You can see in magical darkness out to 60 feet."],
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Flex the tattooed muscle group to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			primaryEffect: "You can see in magical darkness out to 60 feet.",
			secondaryEffect: "",
			passiveBonuses: [
				{
					stat: "necrotic aura",
					value: 1,
				},
			],
		},
		limitations: {
			uses: "Passive + 1 active/short rest",
			recharge: "Dawn",
			requires_attunement: true,
			conditions: [
				"Requires tattoo attunement slot (shoulders)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 500,
			charges: 0,
			uses_per_rest: 2,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
		},
		image: "/generated/effects/arcane-sigil.webp",
	},
	{
		id: "tattoo_29",
		name: "Levitation Repulse",
		display_name: "Levitation Repulse",
		description:
			"Creates an area where targets are pushed away and float slightly. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "very_rare",
		attunement: true,
		body_part: "Palms",
		ink_type: "Beholder-Class Eye Dust",
		active_veins: ["Palms"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Inked by rogue alchemists looking to push Hunter flesh beyond its natural limits.",
			history: "Highly regulated by the International Guild Association.",
			curse: "",
			personality: "Silent, hungry.",
			current_owner: "Widespread among underground syndicates.",
			prior_owners: ["Guild Outcasts", "Rogue Hunters"],
		},
		flavor:
			"Shatters the remnants of a dead world. A testament to what Hunters have become.",
		discovery_lore:
			"Excavated from the crystallized mana deposit at the center of a depleted Gate core.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Flex the tattooed muscle group",
			type: "Tattoo",
			frequency: "1/long rest",
			duration: "1 hour",
			action: "Flex the tattooed muscle group",
			ability: "Intelligence",
			damage_profile: "N/A (utility/defensive)",
			lattice_interaction:
				"Mana-Crystal Pigment resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies hands tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Fear",
			attack: {
				type: "force",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "none",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Mana-Crystal Pigment, DC 11 tattooing check, 4 hours of uninterrupted work",
			],
		},
		effects: {
			primary: "Gain +2 to Intelligence while the tattoo is active.",
			secondary:
				"You ignore the first instance of this damage type each combat.",
			tertiary:
				"Overcharge: Once per long rest, double the primary effect for 1 round.",
			passive: ["Gain +2 to Intelligence while the tattoo is active."],
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Flex the tattooed muscle group to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			primaryEffect: "Gain +2 to Intelligence while the tattoo is active.",
			secondaryEffect: "",
			passiveBonuses: [
				{
					stat: "force aura",
					value: 1,
				},
			],
		},
		limitations: {
			uses: "2/short rest",
			recharge: "Dawn",
			requires_attunement: true,
			conditions: [
				"Requires tattoo attunement slot (hands)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 1000,
			charges: 0,
			uses_per_rest: 3,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
		},
		image: "/generated/effects/arcane-sigil.webp",
	},
	{
		id: "tattoo_30",
		name: "Troll's Regeneration",
		display_name: "Troll's Regeneration",
		description:
			"Accelerates healing to close grievous wounds mid-combat. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "very_rare",
		attunement: true,
		body_part: "Chest",
		ink_type: "Troll Boss Blood",
		active_veins: ["Chest"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Inked by rogue alchemists looking to push Hunter flesh beyond its natural limits.",
			history: "Highly regulated by the International Guild Association.",
			curse: "",
			personality: "Silent, hungry.",
			current_owner: "Widespread among underground syndicates.",
			prior_owners: ["Guild Outcasts", "Rogue Hunters"],
		},
		flavor: "Rends the laws of physics. The line between Hunter and monster.",
		discovery_lore:
			"Appeared in a Hunter's inventory after a System notification that no one else could see.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Flex the tattooed muscle group",
			type: "Tattoo",
			frequency: "1/short rest",
			duration: "Permanent (passive)",
			action: "Flex the tattooed muscle group",
			ability: "Vitality",
			damage_profile: "N/A (utility/defensive)",
			lattice_interaction:
				"Mana-Crystal Pigment resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies back tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Paralysis",
			attack: {
				type: "acid",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "none",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Mana-Crystal Pigment, DC 19 tattooing check, 4 hours of uninterrupted work",
			],
		},
		effects: {
			primary: "Gain +2 to Sense while the tattoo is active.",
			secondary:
				"You ignore the first instance of this damage type each combat.",
			tertiary:
				"Emergency Pulse: When reduced to 0 HP, the tattoo activates automatically (1/long rest).",
			passive: ["Gain +2 to Sense while the tattoo is active."],
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Flex the tattooed muscle group to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			primaryEffect: "Gain +2 to Sense while the tattoo is active.",
			secondaryEffect: "",
			passiveBonuses: [
				{
					stat: "acid aura",
					value: 1,
				},
			],
		},
		limitations: {
			uses: "2/short rest",
			recharge: "Dawn",
			requires_attunement: true,
			conditions: [
				"Requires tattoo attunement slot (back)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 500,
			charges: 0,
			uses_per_rest: 3,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
		},
		image: "/generated/effects/darkness-shroud.webp",
	},
	{
		id: "tattoo_31",
		name: "Winter Core",
		display_name: "Winter Core",
		description:
			"Freezes anything touching the bearer. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "very_rare",
		attunement: true,
		body_part: "Spine",
		ink_type: "Frost-Giant Bone Marrow",
		active_veins: ["Spine"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Inked by rogue alchemists looking to push Hunter flesh beyond its natural limits.",
			history: "Highly regulated by the International Guild Association.",
			curse:
				"Each activation permanently reduces the user's maximum HP by 1, imperceptible until it's too late.",
			personality: "Silent, hungry.",
			current_owner: "Widespread among underground syndicates.",
			prior_owners: ["Guild Outcasts", "Rogue Hunters"],
		},
		flavor:
			"Purges the dimensional barrier. A whisper from the edge of oblivion.",
		discovery_lore:
			"Purchased from a black-market auction in the underground district of Neo-Seoul for an undisclosed sum.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Speak the tattoo's true name",
			type: "Tattoo",
			frequency: "1/short rest",
			duration: "1 hour",
			action: "Speak the tattoo's true name",
			ability: "Intelligence",
			damage_profile: "1d10 poison",
			lattice_interaction:
				"Rift Essence Suspension resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies left arm tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Lethargy",
			attack: {
				type: "poison",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "none",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Rift Essence Suspension, DC 20 tattooing check, 4 hours of uninterrupted work",
			],
		},
		effects: {
			primary: "Gain resistance to poison damage.",
			secondary:
				"Your unarmed strikes deal an additional 1d4 of the tattoo's element.",
			tertiary:
				"Resonance: When multiple tattoos are active, gain +1 AC per active tattoo.",
			passive: ["Gain resistance to poison damage."],
			active: [
				{
					name: "Tattoo Activation",
					description: "Speak the tattoo's true name to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			primaryEffect: "Gain resistance to poison damage.",
			secondaryEffect: "",
			passiveBonuses: [
				{
					stat: "poison aura",
					value: 1,
				},
			],
		},
		limitations: {
			uses: "2/short rest",
			recharge: "Short rest",
			requires_attunement: true,
			conditions: [
				"Requires tattoo attunement slot (left arm)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 100,
			charges: 0,
			uses_per_rest: 1,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
		},
		image: "/generated/effects/darkness-shroud.webp",
	},
	{
		id: "tattoo_32",
		name: "Phoenix Flare",
		display_name: "Phoenix Flare",
		description:
			"Emit blinding, burning light from the skin. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "very_rare",
		attunement: true,
		body_part: "Full Torso",
		ink_type: "Phoenix Ash",
		active_veins: ["Full Torso"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Inked by rogue alchemists looking to push Hunter flesh beyond its natural limits.",
			history: "Highly regulated by the International Guild Association.",
			curse: "",
			personality: "Silent, hungry.",
			current_owner: "Widespread among underground syndicates.",
			prior_owners: ["Guild Outcasts", "Rogue Hunters"],
		},
		flavor:
			"Warps the remnants of a dead world. A testament to what Hunters have become.",
		discovery_lore:
			"Gifted by the System itself as a reward for completing a hidden quest chain.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Channel mana through the ink circuits",
			type: "Tattoo",
			frequency: "1/short rest",
			duration: "10 minutes",
			action: "Channel mana through the ink circuits",
			ability: "Vitality",
			damage_profile: "N/A (utility/defensive)",
			lattice_interaction:
				"Void Ink resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies back tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Blindness",
			attack: {
				type: "fire",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "none",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Void Ink, DC 19 tattooing check, 4 hours of uninterrupted work",
			],
		},
		effects: {
			primary: "Your movement speed increases by 10 feet.",
			secondary:
				"Your unarmed strikes deal an additional 1d4 of the tattoo's element.",
			tertiary:
				"Emergency Pulse: When reduced to 0 HP, the tattoo activates automatically (1/long rest).",
			passive: ["Your movement speed increases by 10 feet."],
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Channel mana through the ink circuits to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			primaryEffect: "Your movement speed increases by 10 feet.",
			secondaryEffect: "",
			passiveBonuses: [
				{
					stat: "fire aura",
					value: 1,
				},
			],
		},
		limitations: {
			uses: "2/short rest",
			recharge: "Dawn",
			requires_attunement: true,
			conditions: [
				"Requires tattoo attunement slot (back)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 5000,
			charges: 0,
			uses_per_rest: 3,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
		},
		image: "/generated/effects/darkness-shroud.webp",
	},
	{
		id: "tattoo_33",
		name: "Vampiric Siphon",
		display_name: "Vampiric Siphon",
		description:
			"Drain health from enemies in melee range to replenish your own. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "very_rare",
		attunement: true,
		body_part: "Forearms",
		ink_type: "Vampire Lord Ash",
		active_veins: ["Forearms"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Inked by rogue alchemists looking to push Hunter flesh beyond its natural limits.",
			history: "Highly regulated by the International Guild Association.",
			curse: "",
			personality: "Silent, hungry.",
			current_owner: "Widespread among underground syndicates.",
			prior_owners: ["Guild Outcasts", "Rogue Hunters"],
		},
		flavor:
			"Annihilates the threshold of human potential. The death of hesitation, made manifest.",
		discovery_lore:
			"Found in a hidden compartment of a relic weapon that had been in Guild storage for years.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Speak the tattoo's true name",
			type: "Tattoo",
			frequency: "1/long rest",
			duration: "1 minute",
			action: "Speak the tattoo's true name",
			ability: "Vitality",
			damage_profile: "1d6 lightning",
			lattice_interaction:
				"Storm Essence Distillate resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies right arm tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Lethargy",
			attack: {
				type: "lightning",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "none",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Storm Essence Distillate, DC 19 tattooing check, 4 hours of uninterrupted work",
			],
		},
		effects: {
			primary: "Gain +2 to Intelligence while the tattoo is active.",
			secondary:
				"The ink glows faintly, granting advantage on Intimidation checks.",
			tertiary:
				"Emergency Pulse: When reduced to 0 HP, the tattoo activates automatically (1/long rest).",
			passive: ["Gain +2 to Intelligence while the tattoo is active."],
			active: [
				{
					name: "Tattoo Activation",
					description: "Speak the tattoo's true name to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			primaryEffect: "Gain +2 to Intelligence while the tattoo is active.",
			secondaryEffect: "",
			passiveBonuses: [
				{
					stat: "lightning aura",
					value: 1,
				},
			],
		},
		limitations: {
			uses: "Passive + 1 active/short rest",
			recharge: "Dawn",
			requires_attunement: true,
			conditions: [
				"Requires tattoo attunement slot (right arm)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 100,
			charges: 0,
			uses_per_rest: 2,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
		},
		image: "/generated/effects/darkness-shroud.webp",
	},
	{
		id: "tattoo_34",
		name: "Poltergeist Fists",
		display_name: "Poltergeist Fists",
		description:
			"Throw punches that land far away via force magic. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "very_rare",
		attunement: true,
		body_part: "Knuckles",
		ink_type: "Poltergeist Essence",
		active_veins: ["Knuckles"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Inked by rogue alchemists looking to push Hunter flesh beyond its natural limits.",
			history: "Highly regulated by the International Guild Association.",
			curse:
				"Causes mild paranoia after extended use; the user becomes convinced they are being watched through mirrors.",
			personality: "Silent, hungry.",
			current_owner: "Widespread among underground syndicates.",
			prior_owners: ["Guild Outcasts", "Rogue Hunters"],
		},
		flavor:
			"Inverts the last defense of the unprepared. A beautiful catastrophe measured in milliseconds.",
		discovery_lore:
			"Recovered from a time-locked chest that required three different elemental keys to open.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Press your palm against the design",
			type: "Tattoo",
			frequency: "1/short rest",
			duration: "1 hour",
			action: "Press your palm against the design",
			ability: "Intelligence",
			damage_profile: "N/A (utility/defensive)",
			lattice_interaction:
				"Mana-Crystal Pigment resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies shoulders tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Paralysis",
			attack: {
				type: "force",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "none",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Mana-Crystal Pigment, DC 20 tattooing check, 4 hours of uninterrupted work",
			],
		},
		effects: {
			primary: "Gain +2 to Presence while the tattoo is active.",
			secondary: "Allies within 5 feet gain +1 to saving throws.",
			tertiary:
				"Emergency Pulse: When reduced to 0 HP, the tattoo activates automatically (1/long rest).",
			passive: ["Gain +2 to Presence while the tattoo is active."],
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Press your palm against the design to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			primaryEffect: "Gain +2 to Presence while the tattoo is active.",
			secondaryEffect: "",
			passiveBonuses: [
				{
					stat: "force aura",
					value: 1,
				},
			],
		},
		limitations: {
			uses: "Passive + 1 active/short rest",
			recharge: "Long rest",
			requires_attunement: true,
			conditions: [
				"Requires tattoo attunement slot (shoulders)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 1000,
			charges: 0,
			uses_per_rest: 1,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
		},
		image: "/generated/effects/arcane-sigil.webp",
	},
	{
		id: "tattoo_35",
		name: "Shadow Clone",
		display_name: "Shadow Clone",
		description:
			"Creates an exact physical double from shadow magic. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "very_rare",
		attunement: true,
		body_part: "Back",
		ink_type: "Shadow Lord Dust",
		active_veins: ["Back"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Inked by rogue alchemists looking to push Hunter flesh beyond its natural limits.",
			history: "Highly regulated by the International Guild Association.",
			curse: "",
			personality: "Silent, hungry.",
			current_owner: "Widespread among underground syndicates.",
			prior_owners: ["Guild Outcasts", "Rogue Hunters"],
		},
		flavor:
			"Shatters the remnants of a dead world. The breaking point of all resistance.",
		discovery_lore:
			"Located by a detection-type Hunter whose radar ability triggered on an otherwise empty room.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Focus your intent on the glyph",
			type: "Tattoo",
			frequency: "1/long rest",
			duration: "Permanent (passive)",
			action: "Focus your intent on the glyph",
			ability: "Presence",
			damage_profile: "2d4 poison",
			lattice_interaction:
				"Rift Essence Suspension resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies ribs tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Lethargy",
			attack: {
				type: "poison",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "none",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Rift Essence Suspension, DC 17 tattooing check, 4 hours of uninterrupted work",
			],
		},
		effects: {
			primary:
				"Deal 1d8 poison damage to creatures that hit you with melee attacks.",
			secondary:
				"You ignore the first instance of this damage type each combat.",
			tertiary:
				"Emergency Pulse: When reduced to 0 HP, the tattoo activates automatically (1/long rest).",
			passive: [
				"Deal 1d8 poison damage to creatures that hit you with melee attacks.",
			],
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Focus your intent on the glyph to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			primaryEffect:
				"Deal 1d8 poison damage to creatures that hit you with melee attacks.",
			secondaryEffect: "",
			passiveBonuses: [
				{
					stat: "poison aura",
					value: 1,
				},
			],
		},
		limitations: {
			uses: "Passive + 1 active/short rest",
			recharge: "Long rest",
			requires_attunement: true,
			conditions: [
				"Requires tattoo attunement slot (ribs)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 500,
			charges: 0,
			uses_per_rest: 3,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
		},
		image: "/generated/effects/arcane-sigil.webp",
	},
	{
		id: "tattoo_36",
		name: "Rift Pocket",
		display_name: "Rift Pocket",
		description:
			"Store items inside a magical tattoo on your skin. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "very_rare",
		attunement: true,
		body_part: "Thigh",
		ink_type: "Gate-Weaver Thread",
		active_veins: ["Thigh"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Inked by rogue alchemists looking to push Hunter flesh beyond its natural limits.",
			history: "Highly regulated by the International Guild Association.",
			curse: "",
			personality: "Silent, hungry.",
			current_owner: "Widespread among underground syndicates.",
			prior_owners: ["Guild Outcasts", "Rogue Hunters"],
		},
		flavor:
			"Rends the illusion of safety. Evolution compressed into a single, violent instant.",
		discovery_lore:
			"Located by a detection-type Hunter whose radar ability triggered on an otherwise empty room.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Speak the tattoo's true name",
			type: "Tattoo",
			frequency: "Proficiency/long rest",
			duration: "10 minutes",
			action: "Speak the tattoo's true name",
			ability: "Presence",
			damage_profile: "2d4 force",
			lattice_interaction:
				"Starfall Residue resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies back tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Fear",
			attack: {
				type: "force",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "none",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Starfall Residue, DC 12 tattooing check, 4 hours of uninterrupted work",
			],
		},
		effects: {
			primary: "You can see in magical darkness out to 60 feet.",
			secondary: "Allies within 5 feet gain +1 to saving throws.",
			tertiary:
				"Overcharge: Once per long rest, double the primary effect for 1 round.",
			passive: ["You can see in magical darkness out to 60 feet."],
			active: [
				{
					name: "Tattoo Activation",
					description: "Speak the tattoo's true name to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			primaryEffect: "You can see in magical darkness out to 60 feet.",
			secondaryEffect: "",
			passiveBonuses: [
				{
					stat: "force aura",
					value: 1,
				},
			],
		},
		limitations: {
			uses: "Proficiency/long rest",
			recharge: "Dawn",
			requires_attunement: true,
			conditions: [
				"Requires tattoo attunement slot (back)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 1000,
			charges: 0,
			uses_per_rest: 2,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
		},
		image: "/generated/effects/darkness-shroud.webp",
	},
	{
		id: "tattoo_37",
		name: "Magic-Bane Aura",
		display_name: "Magic-Bane Aura",
		description:
			"Delete all magic in a small radius. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "very_rare",
		attunement: true,
		body_part: "Chest",
		ink_type: "Beholder-Class Central Eye",
		active_veins: ["Chest"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Inked by rogue alchemists looking to push Hunter flesh beyond its natural limits.",
			history: "Highly regulated by the International Guild Association.",
			curse: "",
			personality: "Silent, hungry.",
			current_owner: "Widespread among underground syndicates.",
			prior_owners: ["Guild Outcasts", "Rogue Hunters"],
		},
		flavor:
			"Mirrors the flow of causality. The breaking point of all resistance.",
		discovery_lore:
			"Found pulsing with residual mana in the aftermath of a Gate break, half-buried in shattered concrete.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Channel mana through the ink circuits",
			type: "Tattoo",
			frequency: "Proficiency/long rest",
			duration: "1 minute",
			action: "Channel mana through the ink circuits",
			ability: "Presence",
			damage_profile: "N/A (utility/defensive)",
			lattice_interaction:
				"Shadowblood Tincture resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies chest tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Blindness",
			attack: {
				type: "thunder",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "none",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Shadowblood Tincture, DC 14 tattooing check, 4 hours of uninterrupted work",
			],
		},
		effects: {
			primary: "Gain +2 to Intelligence while the tattoo is active.",
			secondary:
				"The ink glows faintly, granting advantage on Intimidation checks.",
			tertiary:
				"Resonance: When multiple tattoos are active, gain +1 AC per active tattoo.",
			passive: ["Gain +2 to Intelligence while the tattoo is active."],
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Channel mana through the ink circuits to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			primaryEffect: "Gain +2 to Intelligence while the tattoo is active.",
			secondaryEffect: "",
			passiveBonuses: [
				{
					stat: "thunder aura",
					value: 1,
				},
			],
		},
		limitations: {
			uses: "Passive only",
			recharge: "Long rest",
			requires_attunement: true,
			conditions: [
				"Requires tattoo attunement slot (chest)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 250,
			charges: 0,
			uses_per_rest: 2,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
		},
		image: "/generated/effects/darkness-shroud.webp",
	},
	{
		id: "tattoo_38",
		name: "Blink Strike",
		display_name: "Blink Strike",
		description:
			"Teleport to an enemy and automatically attack. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "very_rare",
		attunement: true,
		body_part: "Calves",
		ink_type: "Displacer Beast Blood",
		active_veins: ["Calves"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Inked by rogue alchemists looking to push Hunter flesh beyond its natural limits.",
			history: "Highly regulated by the International Guild Association.",
			curse: "",
			personality: "Silent, hungry.",
			current_owner: "Widespread among underground syndicates.",
			prior_owners: ["Guild Outcasts", "Rogue Hunters"],
		},
		flavor:
			"Annihilates the threshold of human potential. A testament to what Hunters have become.",
		discovery_lore:
			"Found pulsing with residual mana in the aftermath of a Gate break, half-buried in shattered concrete.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Channel mana through the ink circuits",
			type: "Tattoo",
			frequency: "1/short rest",
			duration: "1 minute",
			action: "Channel mana through the ink circuits",
			ability: "Intelligence",
			damage_profile: "2d4 poison",
			lattice_interaction:
				"Shadowblood Tincture resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies ribs tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Fear",
			attack: {
				type: "poison",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "none",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Shadowblood Tincture, DC 10 tattooing check, 4 hours of uninterrupted work",
			],
		},
		effects: {
			primary: "Your movement speed increases by 10 feet.",
			secondary:
				"You ignore the first instance of this damage type each combat.",
			tertiary:
				"Resonance: When multiple tattoos are active, gain +1 AC per active tattoo.",
			passive: ["Your movement speed increases by 10 feet."],
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Channel mana through the ink circuits to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			primaryEffect: "Your movement speed increases by 10 feet.",
			secondaryEffect: "",
			passiveBonuses: [
				{
					stat: "poison aura",
					value: 1,
				},
			],
		},
		limitations: {
			uses: "2/short rest",
			recharge: "Short rest",
			requires_attunement: true,
			conditions: [
				"Requires tattoo attunement slot (ribs)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 1000,
			charges: 0,
			uses_per_rest: 1,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
		},
		image: "/generated/effects/arcane-sigil.webp",
	},
	{
		id: "tattoo_39",
		name: "Iron Maiden's Embrace",
		display_name: "Iron Maiden's Embrace",
		description:
			"Skin grows magical iron spikes that impale grapplers. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "very_rare",
		attunement: true,
		body_part: "Full Body",
		ink_type: "Dungeon Iron",
		active_veins: ["Full Body"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Inked by rogue alchemists looking to push Hunter flesh beyond its natural limits.",
			history: "Highly regulated by the International Guild Association.",
			curse: "",
			personality: "Silent, hungry.",
			current_owner: "Widespread among underground syndicates.",
			prior_owners: ["Guild Outcasts", "Rogue Hunters"],
		},
		flavor:
			"Mirrors the illusion of safety. The last thing many anomalies ever see.",
		discovery_lore:
			"Materialized on a Hunter's workbench overnight, leaving scorch marks in the shape of unknown glyphs.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Press your palm against the design",
			type: "Tattoo",
			frequency: "1/short rest",
			duration: "1 hour",
			action: "Press your palm against the design",
			ability: "Presence",
			damage_profile: "N/A (utility/defensive)",
			lattice_interaction:
				"Titan Marrow Blend resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies neck tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Fear",
			attack: {
				type: "thunder",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "none",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Titan Marrow Blend, DC 10 tattooing check, 4 hours of uninterrupted work",
			],
		},
		effects: {
			primary:
				"Deal 1d6 thunder damage to creatures that hit you with melee attacks.",
			secondary:
				"You ignore the first instance of this damage type each combat.",
			tertiary:
				"Overcharge: Once per long rest, double the primary effect for 1 round.",
			passive: [
				"Deal 1d6 thunder damage to creatures that hit you with melee attacks.",
			],
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Press your palm against the design to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			primaryEffect:
				"Deal 1d6 thunder damage to creatures that hit you with melee attacks.",
			secondaryEffect: "",
			passiveBonuses: [
				{
					stat: "thunder aura",
					value: 1,
				},
			],
		},
		limitations: {
			uses: "Passive only",
			recharge: "Long rest",
			requires_attunement: true,
			conditions: [
				"Requires tattoo attunement slot (neck)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 2500,
			charges: 0,
			uses_per_rest: 3,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
		},
		image: "/generated/effects/arcane-sigil.webp",
	},
	{
		id: "tattoo_40",
		name: "Dreadnought's Grasp",
		display_name: "Dreadnought's Grasp",
		description:
			"Stun enemies with a touch of overwhelming mana. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "very_rare",
		attunement: true,
		body_part: "Palms",
		ink_type: "Astral Dreadnought Scale",
		active_veins: ["Palms"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Inked by rogue alchemists looking to push Hunter flesh beyond its natural limits.",
			history: "Highly regulated by the International Guild Association.",
			curse: "",
			personality: "Silent, hungry.",
			current_owner: "Widespread among underground syndicates.",
			prior_owners: ["Guild Outcasts", "Rogue Hunters"],
		},
		flavor:
			"Eclipses the architect's design. A testament to what Hunters have become.",
		discovery_lore:
			"Sold by a mysterious merchant who appears only during full moons near active Gate sites.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Channel mana through the ink circuits",
			type: "Tattoo",
			frequency: "2/short rest",
			duration: "10 minutes",
			action: "Channel mana through the ink circuits",
			ability: "Intelligence",
			damage_profile: "1d10 psychic",
			lattice_interaction:
				"Rift Essence Suspension resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies hands tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Stunning",
			attack: {
				type: "psychic",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "none",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Rift Essence Suspension, DC 19 tattooing check, 4 hours of uninterrupted work",
			],
		},
		effects: {
			primary: "Gain resistance to psychic damage.",
			secondary:
				"Your unarmed strikes deal an additional 1d4 of the tattoo's element.",
			tertiary:
				"Overcharge: Once per long rest, double the primary effect for 1 round.",
			passive: ["Gain resistance to psychic damage."],
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Channel mana through the ink circuits to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			primaryEffect: "Gain resistance to psychic damage.",
			secondaryEffect: "",
			passiveBonuses: [
				{
					stat: "psychic aura",
					value: 1,
				},
			],
		},
		limitations: {
			uses: "2/short rest",
			recharge: "Short rest",
			requires_attunement: true,
			conditions: [
				"Requires tattoo attunement slot (hands)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 500,
			charges: 0,
			uses_per_rest: 1,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
		},
		image: "/generated/effects/arcane-sigil.webp",
	},
	{
		id: "tattoo_41",
		name: "Soul Severing Edge",
		display_name: "Soul Severing Edge",
		description:
			"Attacks bypass physical armor and directly damage the target's spirit. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "legendary",
		attunement: true,
		body_part: "Right Arm",
		ink_type: "Reaper Scythe Dust",
		active_veins: ["Right Arm"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Inked by rogue alchemists looking to push Hunter flesh beyond its natural limits.",
			history: "Highly regulated by the International Guild Association.",
			curse:
				"Prolonged wielders report hearing a second heartbeat that doesn't match their own.",
			personality: "Silent, hungry.",
			current_owner: "Widespread among underground syndicates.",
			prior_owners: ["Guild Outcasts", "Rogue Hunters"],
		},
		flavor:
			"Erases the boundary between life and death. A whisper from the edge of oblivion.",
		discovery_lore:
			"Excavated from the crystallized mana deposit at the center of a depleted Gate core.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Speak the tattoo's true name",
			type: "Tattoo",
			frequency: "Passive",
			duration: "1 hour",
			action: "Speak the tattoo's true name",
			ability: "Presence",
			damage_profile: "2d6 force",
			lattice_interaction:
				"Phoenix Ash Emulsion resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies spine tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Fear",
			attack: {
				type: "force",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "none",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Phoenix Ash Emulsion, DC 16 tattooing check, 4 hours of uninterrupted work",
			],
		},
		effects: {
			primary: "You can see in magical darkness out to 60 feet.",
			secondary:
				"You ignore the first instance of this damage type each combat.",
			tertiary:
				"Overcharge: Once per long rest, double the primary effect for 1 round.",
			passive: ["You can see in magical darkness out to 60 feet."],
			active: [
				{
					name: "Tattoo Activation",
					description: "Speak the tattoo's true name to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			primaryEffect: "You can see in magical darkness out to 60 feet.",
			secondaryEffect: "",
			passiveBonuses: [
				{
					stat: "force aura",
					value: 1,
				},
			],
		},
		limitations: {
			uses: "Passive only",
			recharge: "Long rest",
			requires_attunement: true,
			conditions: [
				"Requires tattoo attunement slot (spine)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 250,
			charges: 0,
			uses_per_rest: 2,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
		},
		image: "/generated/effects/arcane-sigil.webp",
	},
	{
		id: "tattoo_42",
		name: "Dragon's Ascendancy",
		display_name: "Dragon's Ascendancy",
		description:
			"Sprout ethereal dragon wings of pure mana. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "legendary",
		attunement: true,
		body_part: "Shoulder Blades",
		ink_type: "Ancient Dragon Blood",
		active_veins: ["Shoulder Blades"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Inked by rogue alchemists looking to push Hunter flesh beyond its natural limits.",
			history: "Highly regulated by the International Guild Association.",
			curse: "",
			personality: "Silent, hungry.",
			current_owner: "Widespread among underground syndicates.",
			prior_owners: ["Guild Outcasts", "Rogue Hunters"],
		},
		flavor:
			"Corrodes the architecture of the soul. The last thing many anomalies ever see.",
		discovery_lore:
			"Sold by a mysterious merchant who appears only during full moons near active Gate sites.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Flex the tattooed muscle group",
			type: "Tattoo",
			frequency: "2/short rest",
			duration: "1 minute",
			action: "Flex the tattooed muscle group",
			ability: "Intelligence",
			damage_profile: "2d6 radiant",
			lattice_interaction:
				"Starfall Residue resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies shoulders tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Fear",
			attack: {
				type: "radiant",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "none",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Starfall Residue, DC 18 tattooing check, 4 hours of uninterrupted work",
			],
		},
		effects: {
			primary:
				"Deal 1d6 radiant damage to creatures that hit you with melee attacks.",
			secondary: "Allies within 5 feet gain +1 to saving throws.",
			tertiary:
				"Emergency Pulse: When reduced to 0 HP, the tattoo activates automatically (1/long rest).",
			passive: [
				"Deal 1d6 radiant damage to creatures that hit you with melee attacks.",
			],
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Flex the tattooed muscle group to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			primaryEffect:
				"Deal 1d6 radiant damage to creatures that hit you with melee attacks.",
			secondaryEffect: "",
			passiveBonuses: [
				{
					stat: "radiant aura",
					value: 1,
				},
			],
		},
		limitations: {
			uses: "Passive + 1 active/short rest",
			recharge: "Short rest",
			requires_attunement: true,
			conditions: [
				"Requires tattoo attunement slot (shoulders)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 2500,
			charges: 0,
			uses_per_rest: 2,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
		},
		image: "/generated/effects/arcane-sigil.webp",
	},
	{
		id: "tattoo_43",
		name: "Tsunami's Wrath",
		display_name: "Tsunami's Wrath",
		description:
			"Command massive amounts of water. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "legendary",
		attunement: true,
		body_part: "Chest",
		ink_type: "Leviathan Scale",
		active_veins: ["Chest"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Inked by rogue alchemists looking to push Hunter flesh beyond its natural limits.",
			history: "Highly regulated by the International Guild Association.",
			curse: "",
			personality: "Silent, hungry.",
			current_owner: "Widespread among underground syndicates.",
			prior_owners: ["Guild Outcasts", "Rogue Hunters"],
		},
		flavor:
			"Eclipses the threshold of human potential. The breaking point of all resistance.",
		discovery_lore:
			"Sold by a mysterious merchant who appears only during full moons near active Gate sites.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Press your palm against the design",
			type: "Tattoo",
			frequency: "1/short rest",
			duration: "1 hour",
			action: "Press your palm against the design",
			ability: "Vitality",
			damage_profile: "1d8 fire",
			lattice_interaction:
				"Shadowblood Tincture resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies chest tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Paralysis",
			attack: {
				type: "fire",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "none",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Shadowblood Tincture, DC 12 tattooing check, 4 hours of uninterrupted work",
			],
		},
		effects: {
			primary: "You can see in magical darkness out to 60 feet.",
			secondary: "Allies within 5 feet gain +1 to saving throws.",
			tertiary:
				"Resonance: When multiple tattoos are active, gain +1 AC per active tattoo.",
			passive: ["You can see in magical darkness out to 60 feet."],
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Press your palm against the design to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			primaryEffect: "You can see in magical darkness out to 60 feet.",
			secondaryEffect: "",
			passiveBonuses: [
				{
					stat: "fire aura",
					value: 1,
				},
			],
		},
		limitations: {
			uses: "2/short rest",
			recharge: "Dawn",
			requires_attunement: true,
			conditions: [
				"Requires tattoo attunement slot (chest)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 500,
			charges: 0,
			uses_per_rest: 2,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
		},
		image: "/generated/effects/darkness-shroud.webp",
	},
	{
		id: "tattoo_44",
		name: "Earthshaker's Stride",
		display_name: "Earthshaker's Stride",
		description:
			"Cause localized earthquakes with every step. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "legendary",
		attunement: true,
		body_part: "Legs",
		ink_type: "Tarrasque-Class Bone Dust",
		active_veins: ["Legs"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Inked by rogue alchemists looking to push Hunter flesh beyond its natural limits.",
			history: "Highly regulated by the International Guild Association.",
			curse: "",
			personality: "Silent, hungry.",
			current_owner: "Widespread among underground syndicates.",
			prior_owners: ["Guild Outcasts", "Rogue Hunters"],
		},
		flavor:
			"Devours the dimensional barrier. Evolution compressed into a single, violent instant.",
		discovery_lore:
			"Recovered from a time-locked chest that required three different elemental keys to open.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Focus your intent on the glyph",
			type: "Tattoo",
			frequency: "1/long rest",
			duration: "1 hour",
			action: "Focus your intent on the glyph",
			ability: "Presence",
			damage_profile: "1d8 necrotic",
			lattice_interaction:
				"Abyssal Ichor resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies shoulders tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Fear",
			attack: {
				type: "necrotic",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "none",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Abyssal Ichor, DC 18 tattooing check, 4 hours of uninterrupted work",
			],
		},
		effects: {
			primary: "Your movement speed increases by 10 feet.",
			secondary:
				"You ignore the first instance of this damage type each combat.",
			tertiary:
				"Overcharge: Once per long rest, double the primary effect for 1 round.",
			passive: ["Your movement speed increases by 10 feet."],
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Focus your intent on the glyph to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			primaryEffect: "Your movement speed increases by 10 feet.",
			secondaryEffect: "",
			passiveBonuses: [
				{
					stat: "necrotic aura",
					value: 1,
				},
			],
		},
		limitations: {
			uses: "2/short rest",
			recharge: "Long rest",
			requires_attunement: true,
			conditions: [
				"Requires tattoo attunement slot (shoulders)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 2500,
			charges: 0,
			uses_per_rest: 3,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
		},
		image: "/generated/effects/arcane-sigil.webp",
	},
	{
		id: "tattoo_45",
		name: "Resurrection Grace",
		display_name: "Resurrection Grace",
		description:
			"Resurrect a fallen Hunter, permanently sacrificing the ink. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "legendary",
		attunement: true,
		body_part: "Heart",
		ink_type: "Angel-Class Fiend Essence",
		active_veins: ["Heart"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Inked by rogue alchemists looking to push Hunter flesh beyond its natural limits.",
			history: "Highly regulated by the International Guild Association.",
			curse: "",
			personality: "Silent, hungry.",
			current_owner: "Widespread among underground syndicates.",
			prior_owners: ["Guild Outcasts", "Rogue Hunters"],
		},
		flavor:
			"Condemns the fabric of reality. The breaking point of all resistance.",
		discovery_lore:
			"Found pulsing with residual mana in the aftermath of a Gate break, half-buried in shattered concrete.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Press your palm against the design",
			type: "Tattoo",
			frequency: "1/short rest",
			duration: "1 hour",
			action: "Press your palm against the design",
			ability: "Intelligence",
			damage_profile: "1d8 thunder",
			lattice_interaction:
				"Mana-Crystal Pigment resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies ribs tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Blindness",
			attack: {
				type: "thunder",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "none",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Mana-Crystal Pigment, DC 20 tattooing check, 4 hours of uninterrupted work",
			],
		},
		effects: {
			primary: "You can see in magical darkness out to 60 feet.",
			secondary:
				"You ignore the first instance of this damage type each combat.",
			tertiary:
				"Overcharge: Once per long rest, double the primary effect for 1 round.",
			passive: ["You can see in magical darkness out to 60 feet."],
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Press your palm against the design to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			primaryEffect: "You can see in magical darkness out to 60 feet.",
			secondaryEffect: "",
			passiveBonuses: [
				{
					stat: "thunder aura",
					value: 1,
				},
			],
		},
		limitations: {
			uses: "2/short rest",
			recharge: "Dawn",
			requires_attunement: true,
			conditions: [
				"Requires tattoo attunement slot (ribs)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 1000,
			charges: 0,
			uses_per_rest: 2,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
		},
		image: "/generated/effects/arcane-sigil.webp",
	},
	{
		id: "tattoo_46",
		name: "Demon Lord's Fury",
		display_name: "Demon Lord's Fury",
		description:
			"Enter an uncontrollable rage offering immense strength. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "legendary",
		attunement: true,
		body_part: "Face",
		ink_type: "Balor Blood",
		active_veins: ["Face"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Inked by rogue alchemists looking to push Hunter flesh beyond its natural limits.",
			history: "Highly regulated by the International Guild Association.",
			curse: "",
			personality: "Silent, hungry.",
			current_owner: "Widespread among underground syndicates.",
			prior_owners: ["Guild Outcasts", "Rogue Hunters"],
		},
		flavor:
			"Sanctifies the silence between heartbeats. The last thing many anomalies ever see.",
		discovery_lore:
			"Materialized on a Hunter's workbench overnight, leaving scorch marks in the shape of unknown glyphs.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Focus your intent on the glyph",
			type: "Tattoo",
			frequency: "1/long rest",
			duration: "1 hour",
			action: "Focus your intent on the glyph",
			ability: "Presence",
			damage_profile: "N/A (utility/defensive)",
			lattice_interaction:
				"Titan Marrow Blend resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies shoulders tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Stunning",
			attack: {
				type: "necrotic",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "none",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Titan Marrow Blend, DC 14 tattooing check, 4 hours of uninterrupted work",
			],
		},
		effects: {
			primary: "Gain resistance to necrotic damage.",
			secondary: "Allies within 5 feet gain +1 to saving throws.",
			tertiary:
				"Overcharge: Once per long rest, double the primary effect for 1 round.",
			passive: ["Gain resistance to necrotic damage."],
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Focus your intent on the glyph to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			primaryEffect: "Gain resistance to necrotic damage.",
			secondaryEffect: "",
			passiveBonuses: [
				{
					stat: "necrotic aura",
					value: 1,
				},
			],
		},
		limitations: {
			uses: "Proficiency/long rest",
			recharge: "Short rest",
			requires_attunement: true,
			conditions: [
				"Requires tattoo attunement slot (shoulders)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 250,
			charges: 0,
			uses_per_rest: 2,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
		},
		image: "/generated/effects/arcane-sigil.webp",
	},
	{
		id: "tattoo_47",
		name: "Undying Phylactery",
		display_name: "Undying Phylactery",
		description:
			"Store your soul's essence in the tattoo. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "legendary",
		attunement: true,
		body_part: "Forehead",
		ink_type: "Lich King Dust",
		active_veins: ["Forehead"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Inked by rogue alchemists looking to push Hunter flesh beyond its natural limits.",
			history: "Highly regulated by the International Guild Association.",
			curse: "",
			personality: "Silent, hungry.",
			current_owner: "Widespread among underground syndicates.",
			prior_owners: ["Guild Outcasts", "Rogue Hunters"],
		},
		flavor:
			"Inverts the silence between heartbeats. The reason S-Rank Gates are feared.",
		discovery_lore:
			"Emerged from a Gate Boss's dissolution cloud, hovering where the creature's heart had been.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Channel mana through the ink circuits",
			type: "Tattoo",
			frequency: "1/short rest",
			duration: "Permanent (passive)",
			action: "Channel mana through the ink circuits",
			ability: "Vitality",
			damage_profile: "1d10 radiant",
			lattice_interaction:
				"Rift Essence Suspension resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies left leg tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Paralysis",
			attack: {
				type: "radiant",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "none",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Rift Essence Suspension, DC 19 tattooing check, 4 hours of uninterrupted work",
			],
		},
		effects: {
			primary: "Gain resistance to radiant damage.",
			secondary:
				"The ink glows faintly, granting advantage on Intimidation checks.",
			tertiary:
				"Resonance: When multiple tattoos are active, gain +1 AC per active tattoo.",
			passive: ["Gain resistance to radiant damage."],
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Channel mana through the ink circuits to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			primaryEffect: "Gain resistance to radiant damage.",
			secondaryEffect: "",
			passiveBonuses: [
				{
					stat: "radiant aura",
					value: 1,
				},
			],
		},
		limitations: {
			uses: "Proficiency/long rest",
			recharge: "Long rest",
			requires_attunement: true,
			conditions: [
				"Requires tattoo attunement slot (left leg)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 1000,
			charges: 0,
			uses_per_rest: 2,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
		},
		image: "/generated/effects/darkness-shroud.webp",
	},
	{
		id: "tattoo_48",
		name: "World Tree Sap",
		display_name: "World Tree Sap",
		description:
			"Immune to all poison, disease, and magical decay. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "legendary",
		attunement: true,
		body_part: "Spine",
		ink_type: "Yggdrasil-Class Sap",
		active_veins: ["Spine"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Inked by rogue alchemists looking to push Hunter flesh beyond its natural limits.",
			history: "Highly regulated by the International Guild Association.",
			curse: "",
			personality: "Silent, hungry.",
			current_owner: "Widespread among underground syndicates.",
			prior_owners: ["Guild Outcasts", "Rogue Hunters"],
		},
		flavor:
			"Shatters the certainty of outcomes. The last thing many anomalies ever see.",
		discovery_lore:
			"Found pulsing with residual mana in the aftermath of a Gate break, half-buried in shattered concrete.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Press your palm against the design",
			type: "Tattoo",
			frequency: "1/short rest",
			duration: "1 hour",
			action: "Press your palm against the design",
			ability: "Presence",
			damage_profile: "N/A (utility/defensive)",
			lattice_interaction:
				"Phoenix Ash Emulsion resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies right arm tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Stunning",
			attack: {
				type: "radiant",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "none",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Phoenix Ash Emulsion, DC 21 tattooing check, 4 hours of uninterrupted work",
			],
		},
		effects: {
			primary: "You can see in magical darkness out to 60 feet.",
			secondary:
				"The ink glows faintly, granting advantage on Intimidation checks.",
			tertiary:
				"Resonance: When multiple tattoos are active, gain +1 AC per active tattoo.",
			passive: ["You can see in magical darkness out to 60 feet."],
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Press your palm against the design to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			primaryEffect: "You can see in magical darkness out to 60 feet.",
			secondaryEffect: "",
			passiveBonuses: [
				{
					stat: "radiant aura",
					value: 1,
				},
			],
		},
		limitations: {
			uses: "Proficiency/long rest",
			recharge: "Long rest",
			requires_attunement: true,
			conditions: [
				"Requires tattoo attunement slot (right arm)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 250,
			charges: 0,
			uses_per_rest: 3,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
		},
		image: "/generated/effects/darkness-shroud.webp",
	},
	{
		id: "tattoo_49",
		name: "Astral Projection",
		display_name: "Astral Projection",
		description:
			"Leave your physical body behind safely. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "legendary",
		attunement: true,
		body_part: "Third Eye",
		ink_type: "Astral Diamond Dust",
		active_veins: ["Third Eye"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Inked by rogue alchemists looking to push Hunter flesh beyond its natural limits.",
			history: "Highly regulated by the International Guild Association.",
			curse: "",
			personality: "Silent, hungry.",
			current_owner: "Widespread among underground syndicates.",
			prior_owners: ["Guild Outcasts", "Rogue Hunters"],
		},
		flavor:
			"Rends the chains of mortality. The reason S-Rank Gates are feared.",
		discovery_lore:
			"Appeared in a Hunter's inventory after a System notification that no one else could see.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Focus your intent on the glyph",
			type: "Tattoo",
			frequency: "Proficiency/long rest",
			duration: "1 minute",
			action: "Focus your intent on the glyph",
			ability: "Presence",
			damage_profile: "1d8 cold",
			lattice_interaction:
				"Mana-Crystal Pigment resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies back tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Fear",
			attack: {
				type: "cold",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "none",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Mana-Crystal Pigment, DC 12 tattooing check, 4 hours of uninterrupted work",
			],
		},
		effects: {
			primary: "Your movement speed increases by 10 feet.",
			secondary:
				"Your unarmed strikes deal an additional 1d4 of the tattoo's element.",
			tertiary:
				"Resonance: When multiple tattoos are active, gain +1 AC per active tattoo.",
			passive: ["Your movement speed increases by 10 feet."],
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Focus your intent on the glyph to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			primaryEffect: "Your movement speed increases by 10 feet.",
			secondaryEffect: "",
			passiveBonuses: [
				{
					stat: "cold aura",
					value: 1,
				},
			],
		},
		limitations: {
			uses: "Passive only",
			recharge: "Short rest",
			requires_attunement: true,
			conditions: [
				"Requires tattoo attunement slot (back)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 1000,
			charges: 0,
			uses_per_rest: 3,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
		},
		image: "/generated/effects/darkness-shroud.webp",
	},
	{
		id: "tattoo_50",
		name: "Time Stop",
		display_name: "Time Stop",
		description:
			"Freeze time for a few seconds. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "legendary",
		attunement: true,
		body_part: "Chest",
		ink_type: "Primordial Chrono-dust",
		active_veins: ["Chest"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Inked by rogue alchemists looking to push Hunter flesh beyond its natural limits.",
			history: "Highly regulated by the International Guild Association.",
			curse: "",
			personality: "Silent, hungry.",
			current_owner: "Widespread among underground syndicates.",
			prior_owners: ["Guild Outcasts", "Rogue Hunters"],
		},
		flavor: "Rends the illusion of safety. The reason S-Rank Gates are feared.",
		discovery_lore:
			"Discovered by an E-Rank Hunter who stumbled into an unmarked side passage during a routine dungeon clear.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Press your palm against the design",
			type: "Tattoo",
			frequency: "Passive",
			duration: "Permanent (passive)",
			action: "Press your palm against the design",
			ability: "Vitality",
			damage_profile: "1d10 thunder",
			lattice_interaction:
				"Starfall Residue resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies neck tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Paralysis",
			attack: {
				type: "thunder",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "none",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Starfall Residue, DC 17 tattooing check, 4 hours of uninterrupted work",
			],
		},
		effects: {
			primary: "Gain +2 to Strength while the tattoo is active.",
			secondary:
				"You ignore the first instance of this damage type each combat.",
			tertiary:
				"Emergency Pulse: When reduced to 0 HP, the tattoo activates automatically (1/long rest).",
			passive: ["Gain +2 to Strength while the tattoo is active."],
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Press your palm against the design to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			primaryEffect: "Gain +2 to Strength while the tattoo is active.",
			secondaryEffect: "",
			passiveBonuses: [
				{
					stat: "thunder aura",
					value: 1,
				},
			],
		},
		limitations: {
			uses: "Proficiency/long rest",
			recharge: "Long rest",
			requires_attunement: true,
			conditions: [
				"Requires tattoo attunement slot (neck)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 250,
			charges: 0,
			uses_per_rest: 1,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
		},
		image: "/generated/effects/arcane-sigil.webp",
	},
	{
		id: "tattoo_s_1",
		name: "Regent's Authority",
		display_name: "Regent's Authority",
		description:
			"Force any being of lower Hunter rank to kneel. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "legendary",
		attunement: true,
		body_part: "Neck",
		ink_type: "Regent Essence",
		active_veins: ["Neck"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Inked by rogue alchemists looking to push Hunter flesh beyond its natural limits.",
			history: "Highly regulated by the International Guild Association.",
			curse: "",
			personality: "Silent, hungry.",
			current_owner: "Widespread among underground syndicates.",
			prior_owners: ["Guild Outcasts", "Rogue Hunters"],
		},
		flavor:
			"Erases the flow of causality. Proof that some things cannot be survived.",
		discovery_lore:
			"Found washed ashore near a coastal Gate, wrapped in fabric that dissolved upon touch.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Flex the tattooed muscle group",
			type: "Tattoo",
			frequency: "Proficiency/long rest",
			duration: "10 minutes",
			action: "Flex the tattooed muscle group",
			ability: "Presence",
			damage_profile: "2d6 cold",
			lattice_interaction:
				"Rift Essence Suspension resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies right arm tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Paralysis",
			attack: {
				type: "cold",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "none",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Rift Essence Suspension, DC 16 tattooing check, 4 hours of uninterrupted work",
			],
		},
		effects: {
			primary: "You can see in magical darkness out to 60 feet.",
			secondary:
				"The ink glows faintly, granting advantage on Intimidation checks.",
			tertiary:
				"Resonance: When multiple tattoos are active, gain +1 AC per active tattoo.",
			passive: ["You can see in magical darkness out to 60 feet."],
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Flex the tattooed muscle group to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			primaryEffect: "You can see in magical darkness out to 60 feet.",
			secondaryEffect: "",
			passiveBonuses: [
				{
					stat: "cold aura",
					value: 1,
				},
			],
		},
		limitations: {
			uses: "Proficiency/long rest",
			recharge: "Short rest",
			requires_attunement: true,
			conditions: [
				"Requires tattoo attunement slot (right arm)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 2500,
			charges: 0,
			uses_per_rest: 2,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
		},
		image: "/generated/effects/darkness-shroud.webp",
	},
	{
		id: "tattoo_s_2",
		name: "Fate Weaver's Thread",
		display_name: "Fate Weaver's Thread",
		description:
			"Temporarily warp destiny to grant luck and avert death. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "legendary",
		attunement: true,
		body_part: "Right Arm",
		ink_type: "Oracle Thread",
		active_veins: ["Right Arm"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Inked by rogue alchemists looking to push Hunter flesh beyond its natural limits.",
			history: "Highly regulated by the International Guild Association.",
			curse: "",
			personality: "Silent, hungry.",
			current_owner: "Widespread among underground syndicates.",
			prior_owners: ["Guild Outcasts", "Rogue Hunters"],
		},
		flavor:
			"Mirrors the boundary between life and death. The last thing many anomalies ever see.",
		discovery_lore:
			"Recovered from a time-locked chest that required three different elemental keys to open.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Channel mana through the ink circuits",
			type: "Tattoo",
			frequency: "Proficiency/long rest",
			duration: "10 minutes",
			action: "Channel mana through the ink circuits",
			ability: "Intelligence",
			damage_profile: "1d10 psychic",
			lattice_interaction:
				"Rift Essence Suspension resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies right arm tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Paralysis",
			attack: {
				type: "psychic",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "none",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Rift Essence Suspension, DC 21 tattooing check, 4 hours of uninterrupted work",
			],
		},
		effects: {
			primary: "Gain +2 to Strength while the tattoo is active.",
			secondary: "Allies within 5 feet gain +1 to saving throws.",
			tertiary:
				"Resonance: When multiple tattoos are active, gain +1 AC per active tattoo.",
			passive: ["Gain +2 to Strength while the tattoo is active."],
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Channel mana through the ink circuits to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			primaryEffect: "Gain +2 to Strength while the tattoo is active.",
			secondaryEffect: "",
			passiveBonuses: [
				{
					stat: "psychic aura",
					value: 1,
				},
			],
		},
		limitations: {
			uses: "Passive only",
			recharge: "Short rest",
			requires_attunement: true,
			conditions: [
				"Requires tattoo attunement slot (right arm)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 100,
			charges: 0,
			uses_per_rest: 3,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
		},
		image: "/generated/effects/darkness-shroud.webp",
	},
];
