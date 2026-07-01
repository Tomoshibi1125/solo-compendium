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
		source_book: "Rift Ascendant Canon",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin: "Applied under the Guild Association's dermal-weave protocol.",
			history:
				"Covered by the standard Guild Association compliance agreement.",
			curse: "",
			personality: "Disciplined in its at-rest state.",
			current_owner:
				"Available through the Bureau's open augmentation catalog.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Pins the cast's result to one deterministic branch. The line between Ascendant and anomaly.",
		discovery_lore:
			"Recorded in the Ascendant's inventory during their last resupply.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Initiated via the bearer's conditioned trigger state.",
			type: "Tattoo",
			frequency: "1/long rest",
			duration: "Permanent (passive)",
			action: "Initiated via the bearer's conditioned trigger state.",
			ability: "Vitality",
			damage_profile: "N/A (utility/defensive)",
			lattice_interaction:
				"Crimson Boss Ichor resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies neck tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Lethargy",
			attack: {
				type: "acid",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Crimson Boss Ichor, DC 16 tattooing check, 4 hours of uninterrupted work",
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
						"Initiated via the bearer's conditioned trigger state. to activate for 1 minute.",
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
				"Requires tattoo attunement slot (neck)",
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
		ink_type: "anomaly Bone Dust",
		active_veins: ["Spine"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Rift Ascendant Canon",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin: "Formulated within the Guild's authorized dermal-mod program.",
			history: "Tracked through the Guild Association's compliance schedule.",
			curse: "",
			personality: "Quiet between activations.",
			current_owner: "Common at Guild-authorized dermal-mod clinics.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Devours the concept of distance. Proof that some things cannot be survived.",
		discovery_lore:
			"Entered into the Ascendant's inventory via standard requisition.",
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
				"anomaly Bone Dust resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies spine tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Fear",
			attack: {
				type: "necrotic",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: anomaly Bone Dust, DC 11 tattooing check, 4 hours of uninterrupted work",
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
				"Requires tattoo attunement slot (spine)",
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
		name: "Ascendant's Acuity",
		display_name: "Ascendant's Acuity",
		description:
			"Quickens the mind and reflexes using raw magical energy. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "uncommon",
		attunement: true,
		body_part: "Temple",
		ink_type: "Silvered Mercury",
		active_veins: ["Temple"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Rift Ascendant Canon",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin: "Inked by Bureau-credentialed studio practitioners.",
			history: "Logged in the Bureau's ongoing dermal-mod registry.",
			curse: "",
			personality: "Unobtrusive while not being used.",
			current_owner: "Applied routinely to qualifying field operatives.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Inverts the dimensional barrier. A testament to what Ascendants have become.",
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
				"Silvered Mercury resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies temple tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Fear",
			attack: {
				type: "lightning",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Silvered Mercury, DC 16 tattooing check, 4 hours of uninterrupted work",
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
				"Requires tattoo attunement slot (temple)",
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
		source_book: "Rift Ascendant Canon",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin: "Applied under the Guild Association's dermal-weave protocol.",
			history:
				"Covered by the standard Guild Association compliance agreement.",
			curse: "",
			personality: "Disciplined in its at-rest state.",
			current_owner:
				"Available through the Bureau's open augmentation catalog.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
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
				"Earth Golem Core resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies chest tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Blindness",
			attack: {
				type: "force",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Earth Golem Core, DC 14 tattooing check, 4 hours of uninterrupted work",
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
		source_book: "Rift Ascendant Canon",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Developed by Bureau-licensed alchemical tattooists for field Ascendants.",
			history: "Subject to Bureau augmentation oversight and annual review.",
			curse: "",
			personality: "Neutral in personality profile.",
			current_owner:
				"Widely issued to qualifying Ascendants through Bureau studios.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
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
			damage_profile: "utility",
			lattice_interaction:
				"Crushed Garnet resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies left forearm tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Lethargy",
			attack: {
				type: "fire",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Crushed Garnet, DC 10 tattooing check, 4 hours of uninterrupted work",
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
				"Requires tattoo attunement slot (left forearm)",
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
		ink_type: "Anomaly Eye Fluid",
		active_veins: ["Around Eyes"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Rift Ascendant Canon",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin: "Inked by Bureau-credentialed studio practitioners.",
			history: "Logged in the Bureau's ongoing dermal-mod registry.",
			curse: "",
			personality: "Unobtrusive while not being used.",
			current_owner: "Applied routinely to qualifying field operatives.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
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
			damage_profile: "utility",
			lattice_interaction:
				"Anomaly Eye Fluid resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies around eyes tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Stunning",
			attack: {
				type: "force",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Anomaly Eye Fluid, DC 18 tattooing check, 4 hours of uninterrupted work",
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
				"Requires tattoo attunement slot (around eyes)",
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
		source_book: "Rift Ascendant Canon",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Produced in compliance with Ascendant Bureau augmentation standards.",
			history:
				"Reviewed periodically under the Ascendant augmentation license.",
			curse: "",
			personality: "Inert until intentionally engaged.",
			current_owner: "A standard augmentation offering at licensed studios.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Mirrors the threshold of human potential. A whisper from the edge of oblivion.",
		discovery_lore:
			"Discovered by an E-Rank Ascendant who stumbled into an unmarked side passage during a routine dungeon clear.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Called up through a practiced activation pose.",
			type: "Tattoo",
			frequency: "2/short rest",
			duration: "1 hour",
			action: "Called up through a practiced activation pose.",
			ability: "Intelligence",
			damage_profile: "N/A (utility/defensive)",
			lattice_interaction:
				"Salamander Extract resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies ribs tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Blindness",
			attack: {
				type: "self",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Salamander Extract, DC 17 tattooing check, 4 hours of uninterrupted work",
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
						"Called up through a practiced activation pose. to activate for 1 minute.",
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
		id: "tattoo_8",
		name: "Wind-Shear Cloak",
		display_name: "Wind-Shear Cloak",
		description:
			"A wind-magic weave that helps the Ascendant cut through the air. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "uncommon",
		attunement: true,
		body_part: "Legs",
		ink_type: "Griffon Feather Ink",
		active_veins: ["Legs"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Rift Ascendant Canon",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin: "Formulated within the Guild's authorized dermal-mod program.",
			history: "Tracked through the Guild Association's compliance schedule.",
			curse: "",
			personality: "Quiet between activations.",
			current_owner: "Common at Guild-authorized dermal-mod clinics.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
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
			damage_profile: "utility",
			lattice_interaction:
				"Griffon Feather Ink resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies legs tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Lethargy",
			attack: {
				type: "psychic",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Griffon Feather Ink, DC 13 tattooing check, 4 hours of uninterrupted work",
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
				"Requires tattoo attunement slot (legs)",
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
		source_book: "Rift Ascendant Canon",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin: "Inked by Bureau-credentialed studio practitioners.",
			history: "Logged in the Bureau's ongoing dermal-mod registry.",
			curse: "",
			personality: "Unobtrusive while not being used.",
			current_owner: "Applied routinely to qualifying field operatives.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
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
				"Vampire Lord Dust resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies heart tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Stunning",
			attack: {
				type: "self",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Vampire Lord Dust, DC 18 tattooing check, 4 hours of uninterrupted work",
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
				"Requires tattoo attunement slot (heart)",
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
		source_book: "Rift Ascendant Canon",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin: "Inked by Bureau-credentialed studio practitioners.",
			history: "Logged in the Bureau's ongoing dermal-mod registry.",
			curse: "",
			personality: "Unobtrusive while not being used.",
			current_owner: "Applied routinely to qualifying field operatives.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Warps the dimensional barrier. Evolution compressed into a single, violent instant.",
		discovery_lore:
			"Materialized on a Ascendant's workbench overnight, leaving scorch marks in the shape of unknown glyphs.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Speak the tattoo's true name",
			type: "Tattoo",
			frequency: "1/short rest",
			duration: "10 minutes",
			action: "Speak the tattoo's true name",
			ability: "Vitality",
			damage_profile: "utility",
			lattice_interaction:
				"Ghoul Extract resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies forehead tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Lethargy",
			attack: {
				type: "poison",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Ghoul Extract, DC 21 tattooing check, 4 hours of uninterrupted work",
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
				"Requires tattoo attunement slot (forehead)",
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
		source_book: "Rift Ascendant Canon",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin: "Formulated within the Guild's authorized dermal-mod program.",
			history: "Tracked through the Guild Association's compliance schedule.",
			curse: "",
			personality: "Quiet between activations.",
			current_owner: "Common at Guild-authorized dermal-mod clinics.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
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
			damage_profile: "utility",
			lattice_interaction:
				"Blind Cave Crawler Core resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies throat tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Blindness",
			attack: {
				type: "acid",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Blind Cave Crawler Core, DC 20 tattooing check, 4 hours of uninterrupted work",
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
				"Requires tattoo attunement slot (throat)",
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
		source_book: "Rift Ascendant Canon",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Developed by Bureau-licensed alchemical tattooists for field Ascendants.",
			history: "Subject to Bureau augmentation oversight and annual review.",
			curse: "",
			personality: "Neutral in personality profile.",
			current_owner:
				"Widely issued to qualifying Ascendants through Bureau studios.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Rends the certainty of outcomes. A testament to what Ascendants have become.",
		discovery_lore:
			"Excavated from the crystallized mana deposit at the center of a depleted Gate core.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Activated by directing attention to the glyph.",
			type: "Tattoo",
			frequency: "Passive",
			duration: "10 minutes",
			action: "Activated by directing attention to the glyph.",
			ability: "Presence",
			damage_profile: "utility",
			lattice_interaction:
				"Ooze Core resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies palms tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Fear",
			attack: {
				type: "cold",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Ooze Core, DC 21 tattooing check, 4 hours of uninterrupted work",
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
						"Activated by directing attention to the glyph. to activate for 1 minute.",
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
				"Requires tattoo attunement slot (palms)",
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
		source_book: "Rift Ascendant Canon",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin: "Applied under the Guild Association's dermal-weave protocol.",
			history:
				"Covered by the standard Guild Association compliance agreement.",
			curse: "",
			personality: "Disciplined in its at-rest state.",
			current_owner:
				"Available through the Bureau's open augmentation catalog.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
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
				"Hellhound Ash resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies stomach tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Paralysis",
			attack: {
				type: "radiant",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Hellhound Ash, DC 20 tattooing check, 4 hours of uninterrupted work",
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
				"Requires tattoo attunement slot (stomach)",
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
		source_book: "Rift Ascendant Canon",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Produced in compliance with Ascendant Bureau augmentation standards.",
			history:
				"Reviewed periodically under the Ascendant augmentation license.",
			curse: "",
			personality: "Inert until intentionally engaged.",
			current_owner: "A standard augmentation offering at licensed studios.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Erases the chains of mortality. A whisper from the edge of oblivion.",
		discovery_lore:
			"Located by a detection-type Ascendant whose radar ability triggered on an otherwise empty room.",
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
				"Wind Elemental Core resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies feet tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Blindness",
			attack: {
				type: "acid",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Wind Elemental Core, DC 11 tattooing check, 4 hours of uninterrupted work",
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
				"Requires tattoo attunement slot (feet)",
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
		source_book: "Rift Ascendant Canon",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin: "Inked by Bureau-credentialed studio practitioners.",
			history: "Logged in the Bureau's ongoing dermal-mod registry.",
			curse:
				"The user becomes unable to dream, replaced by visions of the void between Gates.",
			personality: "Unobtrusive while not being used.",
			current_owner: "Applied routinely to qualifying field operatives.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Purges the chains of mortality. A whisper from the edge of oblivion.",
		discovery_lore:
			"Checked out through the Guild's credentialed loaner program.",
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
				"Doppelganger Tissue resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies throat tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Blindness",
			attack: {
				type: "acid",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Doppelganger Tissue, DC 19 tattooing check, 4 hours of uninterrupted work",
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
				"Requires tattoo attunement slot (throat)",
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
		source_book: "Rift Ascendant Canon",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin: "Formulated within the Guild's authorized dermal-mod program.",
			history: "Tracked through the Guild Association's compliance schedule.",
			curse:
				"Prolonged wielders report hearing a second heartbeat that doesn't match their own.",
			personality: "Quiet between activations.",
			current_owner: "Common at Guild-authorized dermal-mod clinics.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
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
			damage_profile: "utility",
			lattice_interaction:
				"Ogre Boss Blood resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies biceps tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Stunning",
			attack: {
				type: "fire",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Ogre Boss Blood, DC 18 tattooing check, 4 hours of uninterrupted work",
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
				"Requires tattoo attunement slot (biceps)",
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
		source_book: "Rift Ascendant Canon",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Developed by Bureau-licensed alchemical tattooists for field Ascendants.",
			history: "Subject to Bureau augmentation oversight and annual review.",
			curse: "",
			personality: "Neutral in personality profile.",
			current_owner:
				"Widely issued to qualifying Ascendants through Bureau studios.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
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
			damage_profile: "utility",
			lattice_interaction:
				"Wraith Ectoplasm resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies shoulders tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Lethargy",
			attack: {
				type: "necrotic",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Wraith Ectoplasm, DC 12 tattooing check, 4 hours of uninterrupted work",
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
		source_book: "Rift Ascendant Canon",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Developed by Bureau-licensed alchemical tattooists for field Ascendants.",
			history: "Subject to Bureau augmentation oversight and annual review.",
			curse: "",
			personality: "Neutral in personality profile.",
			current_owner:
				"Widely issued to qualifying Ascendants through Bureau studios.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Reclaims the illusion of safety. A testament to what Ascendants have become.",
		discovery_lore:
			"Discovered by an E-Rank Ascendant who stumbled into an unmarked side passage during a routine dungeon clear.",
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
				"Mimic Ichor resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies full back tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Lethargy",
			attack: {
				type: "thunder",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Mimic Ichor, DC 14 tattooing check, 4 hours of uninterrupted work",
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
				"Requires tattoo attunement slot (full back)",
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
		source_book: "Rift Ascendant Canon",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin: "Applied under the Guild Association's dermal-weave protocol.",
			history:
				"Covered by the standard Guild Association compliance agreement.",
			curse: "",
			personality: "Disciplined in its at-rest state.",
			current_owner:
				"Available through the Bureau's open augmentation catalog.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
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
				"Kraken Ink resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies neck tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Paralysis",
			attack: {
				type: "cold",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Kraken Ink, DC 20 tattooing check, 4 hours of uninterrupted work",
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
				"Requires tattoo attunement slot (neck)",
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
		source_book: "Rift Ascendant Canon",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Produced in compliance with Ascendant Bureau augmentation standards.",
			history:
				"Reviewed periodically under the Ascendant augmentation license.",
			curse: "",
			personality: "Inert until intentionally engaged.",
			current_owner: "A standard augmentation offering at licensed studios.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
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
				"Thunderbird Spark resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies chest tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Stunning",
			attack: {
				type: "self",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Thunderbird Spark, DC 21 tattooing check, 4 hours of uninterrupted work",
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
				"Requires tattoo attunement slot (chest)",
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
		source_book: "Rift Ascendant Canon",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin: "Applied under the Guild Association's dermal-weave protocol.",
			history:
				"Covered by the standard Guild Association compliance agreement.",
			curse: "",
			personality: "Disciplined in its at-rest state.",
			current_owner:
				"Available through the Bureau's open augmentation catalog.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Crushes the architecture of the soul. Evolution compressed into a single, violent instant.",
		discovery_lore:
			"Dropped by a mini-boss that shouldn't have existed according to the Gate's difficulty rating.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Initiated via the bearer's conditioned trigger state.",
			type: "Tattoo",
			frequency: "2/short rest",
			duration: "1 hour",
			action: "Initiated via the bearer's conditioned trigger state.",
			ability: "Intelligence",
			damage_profile: "utility",
			lattice_interaction:
				"Void Gate Dust resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies feet tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Blindness",
			attack: {
				type: "thunder",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Void Gate Dust, DC 18 tattooing check, 4 hours of uninterrupted work",
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
						"Initiated via the bearer's conditioned trigger state. to activate for 1 minute.",
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
				"Requires tattoo attunement slot (feet)",
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
		source_book: "Rift Ascendant Canon",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin: "Formulated within the Guild's authorized dermal-mod program.",
			history: "Tracked through the Guild Association's compliance schedule.",
			curse: "",
			personality: "Quiet between activations.",
			current_owner: "Common at Guild-authorized dermal-mod clinics.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Inverts the boundary between life and death. Evolution compressed into a single, violent instant.",
		discovery_lore:
			"Excavated from the crystallized mana deposit at the center of a depleted Gate core.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Engaged by a deliberate focal gesture on the tattoo.",
			type: "Tattoo",
			frequency: "Passive",
			duration: "10 minutes",
			action: "Engaged by a deliberate focal gesture on the tattoo.",
			ability: "Presence",
			damage_profile: "N/A (utility/defensive)",
			lattice_interaction:
				"Harpy Queen Marrow resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies collarbone tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Paralysis",
			attack: {
				type: "radiant",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Harpy Queen Marrow, DC 15 tattooing check, 4 hours of uninterrupted work",
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
						"Engaged by a deliberate focal gesture on the tattoo. to activate for 1 minute.",
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
				"Requires tattoo attunement slot (collarbone)",
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
		source_book: "Rift Ascendant Canon",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin: "Inked by Bureau-credentialed studio practitioners.",
			history: "Logged in the Bureau's ongoing dermal-mod registry.",
			curse: "",
			personality: "Unobtrusive while not being used.",
			current_owner: "Applied routinely to qualifying field operatives.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
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
				"Blast-Jelly resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies shoulders tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Paralysis",
			attack: {
				type: "acid",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Blast-Jelly, DC 16 tattooing check, 4 hours of uninterrupted work",
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
		image: "/generated/effects/darkness-shroud.webp",
	},
	{
		id: "tattoo_24",
		name: "Anomaly's Breath",
		display_name: "Anomaly's Breath",
		description:
			"Breathe out a cloud of choking, magical exhaust. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "rare",
		attunement: true,
		body_part: "Lungs",
		ink_type: "Green anomaly Bile",
		active_veins: ["Lungs"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Rift Ascendant Canon",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin: "Applied under the Guild Association's dermal-weave protocol.",
			history:
				"Covered by the standard Guild Association compliance agreement.",
			curse: "",
			personality: "Disciplined in its at-rest state.",
			current_owner:
				"Available through the Bureau's open augmentation catalog.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Reclaims the laws of physics. Proof that some things cannot be survived.",
		discovery_lore:
			"Materialized on a Ascendant's workbench overnight, leaving scorch marks in the shape of unknown glyphs.",
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
				"Green anomaly Bile resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies lungs tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Stunning",
			attack: {
				type: "psychic",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Green anomaly Bile, DC 12 tattooing check, 4 hours of uninterrupted work",
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
				"Requires tattoo attunement slot (lungs)",
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
		source_book: "Rift Ascendant Canon",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Developed by Bureau-licensed alchemical tattooists for field Ascendants.",
			history: "Subject to Bureau augmentation oversight and annual review.",
			curse: "",
			personality: "Neutral in personality profile.",
			current_owner:
				"Widely issued to qualifying Ascendants through Bureau studios.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
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
			damage_profile: "utility",
			lattice_interaction:
				"Time-Weaver Sand resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies temple tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Paralysis",
			attack: {
				type: "acid",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Time-Weaver Sand, DC 14 tattooing check, 4 hours of uninterrupted work",
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
				"Requires tattoo attunement slot (temple)",
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
		ink_type: "Umbral Anomaly Essence",
		active_veins: ["Heart"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Rift Ascendant Canon",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin: "Formulated within the Guild's authorized dermal-mod program.",
			history: "Tracked through the Guild Association's compliance schedule.",
			curse: "",
			personality: "Quiet between activations.",
			current_owner: "Common at Guild-authorized dermal-mod clinics.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
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
			damage_profile: "utility",
			lattice_interaction:
				"Umbral Anomaly Essence resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies heart tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Blindness",
			attack: {
				type: "poison",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Umbral Anomaly Essence, DC 12 tattooing check, 4 hours of uninterrupted work",
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
				"Requires tattoo attunement slot (heart)",
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
		source_book: "Rift Ascendant Canon",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Produced in compliance with Ascendant Bureau augmentation standards.",
			history:
				"Reviewed periodically under the Ascendant augmentation license.",
			curse: "",
			personality: "Inert until intentionally engaged.",
			current_owner: "A standard augmentation offering at licensed studios.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
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
			damage_profile: "utility",
			lattice_interaction:
				"Mind-Eater Fluid resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies forehead tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Fear",
			attack: {
				type: "self",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Mind-Eater Fluid, DC 21 tattooing check, 4 hours of uninterrupted work",
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
				"Requires tattoo attunement slot (forehead)",
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
		source_book: "Rift Ascendant Canon",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin: "Applied under the Guild Association's dermal-weave protocol.",
			history:
				"Covered by the standard Guild Association compliance agreement.",
			curse: "",
			personality: "Disciplined in its at-rest state.",
			current_owner:
				"Available through the Bureau's open augmentation catalog.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
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
			damage_profile: "utility",
			lattice_interaction:
				"Manticore Venom resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies wrists tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Stunning",
			attack: {
				type: "necrotic",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Manticore Venom, DC 14 tattooing check, 4 hours of uninterrupted work",
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
				"Requires tattoo attunement slot (wrists)",
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
		source_book: "Rift Ascendant Canon",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Developed by Bureau-licensed alchemical tattooists for field Ascendants.",
			history: "Subject to Bureau augmentation oversight and annual review.",
			curse: "",
			personality: "Neutral in personality profile.",
			current_owner:
				"Widely issued to qualifying Ascendants through Bureau studios.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Shatters the remnants of a dead world. A testament to what Ascendants have become.",
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
				"Beholder-Class Eye Dust resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies palms tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Fear",
			attack: {
				type: "force",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Beholder-Class Eye Dust, DC 11 tattooing check, 4 hours of uninterrupted work",
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
				"Requires tattoo attunement slot (palms)",
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
		source_book: "Rift Ascendant Canon",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin: "Formulated within the Guild's authorized dermal-mod program.",
			history: "Tracked through the Guild Association's compliance schedule.",
			curse: "",
			personality: "Quiet between activations.",
			current_owner: "Common at Guild-authorized dermal-mod clinics.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Rends the laws of physics. The line between Ascendant and anomaly.",
		discovery_lore:
			"Entered into the Ascendant's inventory via standard requisition.",
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
				"Troll Boss Blood resonates with the bearer's mana lattice through dermal contact",
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
				damage_type: "",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Troll Boss Blood, DC 19 tattooing check, 4 hours of uninterrupted work",
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
				"Requires tattoo attunement slot (chest)",
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
		source_book: "Rift Ascendant Canon",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Developed by Bureau-licensed alchemical tattooists for field Ascendants.",
			history: "Subject to Bureau augmentation oversight and annual review.",
			curse:
				"Each activation permanently reduces the user's maximum HP by 1, imperceptible until it's too late.",
			personality: "Neutral in personality profile.",
			current_owner:
				"Widely issued to qualifying Ascendants through Bureau studios.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
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
			damage_profile: "utility",
			lattice_interaction:
				"Frost-Giant Bone Marrow resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies spine tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Lethargy",
			attack: {
				type: "poison",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Frost-Giant Bone Marrow, DC 20 tattooing check, 4 hours of uninterrupted work",
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
				"Requires tattoo attunement slot (spine)",
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
		source_book: "Rift Ascendant Canon",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Produced in compliance with Ascendant Bureau augmentation standards.",
			history:
				"Reviewed periodically under the Ascendant augmentation license.",
			curse: "",
			personality: "Inert until intentionally engaged.",
			current_owner: "A standard augmentation offering at licensed studios.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Warps the remnants of a dead world. A testament to what Ascendants have become.",
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
				"Phoenix Ash resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies full torso tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Blindness",
			attack: {
				type: "fire",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Phoenix Ash, DC 19 tattooing check, 4 hours of uninterrupted work",
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
				"Requires tattoo attunement slot (full torso)",
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
		source_book: "Rift Ascendant Canon",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin: "Inked by Bureau-credentialed studio practitioners.",
			history: "Logged in the Bureau's ongoing dermal-mod registry.",
			curse: "",
			personality: "Unobtrusive while not being used.",
			current_owner: "Applied routinely to qualifying field operatives.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
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
			damage_profile: "utility",
			lattice_interaction:
				"Vampire Lord Ash resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies forearms tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Lethargy",
			attack: {
				type: "self",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Vampire Lord Ash, DC 19 tattooing check, 4 hours of uninterrupted work",
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
				"Requires tattoo attunement slot (forearms)",
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
		source_book: "Rift Ascendant Canon",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Developed by Bureau-licensed alchemical tattooists for field Ascendants.",
			history: "Subject to Bureau augmentation oversight and annual review.",
			curse:
				"Causes mild paranoia after extended use; the user becomes convinced they are being watched through mirrors.",
			personality: "Neutral in personality profile.",
			current_owner:
				"Widely issued to qualifying Ascendants through Bureau studios.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
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
				"Poltergeist Essence resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies knuckles tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Paralysis",
			attack: {
				type: "force",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Poltergeist Essence, DC 20 tattooing check, 4 hours of uninterrupted work",
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
				"Requires tattoo attunement slot (knuckles)",
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
		source_book: "Rift Ascendant Canon",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin: "Applied under the Guild Association's dermal-weave protocol.",
			history:
				"Covered by the standard Guild Association compliance agreement.",
			curse: "",
			personality: "Disciplined in its at-rest state.",
			current_owner:
				"Available through the Bureau's open augmentation catalog.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Shatters the remnants of a dead world. The breaking point of all resistance.",
		discovery_lore:
			"Located by a detection-type Ascendant whose radar ability triggered on an otherwise empty room.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Initiated via the bearer's conditioned trigger state.",
			type: "Tattoo",
			frequency: "1/long rest",
			duration: "Permanent (passive)",
			action: "Initiated via the bearer's conditioned trigger state.",
			ability: "Presence",
			damage_profile: "utility",
			lattice_interaction:
				"Shadow Lord Dust resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies back tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Lethargy",
			attack: {
				type: "self",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Shadow Lord Dust, DC 17 tattooing check, 4 hours of uninterrupted work",
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
						"Initiated via the bearer's conditioned trigger state. to activate for 1 minute.",
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
		source_book: "Rift Ascendant Canon",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin: "Inked by Bureau-credentialed studio practitioners.",
			history: "Logged in the Bureau's ongoing dermal-mod registry.",
			curse: "",
			personality: "Unobtrusive while not being used.",
			current_owner: "Applied routinely to qualifying field operatives.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Rends the illusion of safety. Evolution compressed into a single, violent instant.",
		discovery_lore:
			"Located by a detection-type Ascendant whose radar ability triggered on an otherwise empty room.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Speak the tattoo's true name",
			type: "Tattoo",
			frequency: "Proficiency/long rest",
			duration: "10 minutes",
			action: "Speak the tattoo's true name",
			ability: "Presence",
			damage_profile: "utility",
			lattice_interaction:
				"Gate-Weaver Thread resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies thigh tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Fear",
			attack: {
				type: "force",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Gate-Weaver Thread, DC 12 tattooing check, 4 hours of uninterrupted work",
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
				"Requires tattoo attunement slot (thigh)",
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
		source_book: "Rift Ascendant Canon",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin: "Formulated within the Guild's authorized dermal-mod program.",
			history: "Tracked through the Guild Association's compliance schedule.",
			curse: "",
			personality: "Quiet between activations.",
			current_owner: "Common at Guild-authorized dermal-mod clinics.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
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
				"Beholder-Class Central Eye resonates with the bearer's mana lattice through dermal contact",
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
				damage_type: "",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Beholder-Class Central Eye, DC 14 tattooing check, 4 hours of uninterrupted work",
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
		source_book: "Rift Ascendant Canon",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin: "Applied under the Guild Association's dermal-weave protocol.",
			history:
				"Covered by the standard Guild Association compliance agreement.",
			curse: "",
			personality: "Disciplined in its at-rest state.",
			current_owner:
				"Available through the Bureau's open augmentation catalog.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Annihilates the threshold of human potential. A testament to what Ascendants have become.",
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
			damage_profile: "utility",
			lattice_interaction:
				"Displacer Beast Blood resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies calves tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Fear",
			attack: {
				type: "poison",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Displacer Beast Blood, DC 10 tattooing check, 4 hours of uninterrupted work",
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
				"Requires tattoo attunement slot (calves)",
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
		source_book: "Rift Ascendant Canon",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Produced in compliance with Ascendant Bureau augmentation standards.",
			history:
				"Reviewed periodically under the Ascendant augmentation license.",
			curse: "",
			personality: "Inert until intentionally engaged.",
			current_owner: "A standard augmentation offering at licensed studios.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Mirrors the illusion of safety. The last thing many anomalies ever see.",
		discovery_lore:
			"Materialized on a Ascendant's workbench overnight, leaving scorch marks in the shape of unknown glyphs.",
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
				"Dungeon Iron resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies full body tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Fear",
			attack: {
				type: "thunder",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Dungeon Iron, DC 10 tattooing check, 4 hours of uninterrupted work",
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
				"Requires tattoo attunement slot (full body)",
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
		source_book: "Rift Ascendant Canon",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin: "Inked by Bureau-credentialed studio practitioners.",
			history: "Logged in the Bureau's ongoing dermal-mod registry.",
			curse: "",
			personality: "Unobtrusive while not being used.",
			current_owner: "Applied routinely to qualifying field operatives.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Eclipses the architect's design. A testament to what Ascendants have become.",
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
			damage_profile: "utility",
			lattice_interaction:
				"Astral Dreadnought Scale resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies palms tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Stunning",
			attack: {
				type: "psychic",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Astral Dreadnought Scale, DC 19 tattooing check, 4 hours of uninterrupted work",
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
				"Requires tattoo attunement slot (palms)",
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
		source_book: "Rift Ascendant Canon",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Produced in compliance with Ascendant Bureau augmentation standards.",
			history:
				"Reviewed periodically under the Ascendant augmentation license.",
			curse:
				"Prolonged wielders report hearing a second heartbeat that doesn't match their own.",
			personality: "Inert until intentionally engaged.",
			current_owner: "A standard augmentation offering at licensed studios.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
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
			damage_profile: "utility",
			lattice_interaction:
				"Reaper Scythe Dust resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies right arm tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Fear",
			attack: {
				type: "force",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Reaper Scythe Dust, DC 16 tattooing check, 4 hours of uninterrupted work",
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
				"Requires tattoo attunement slot (right arm)",
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
		name: "Anomaly's Ascendancy",
		display_name: "Anomaly's Ascendancy",
		description:
			"Sprout ethereal anomaly wings of pure mana. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "legendary",
		attunement: true,
		body_part: "Shoulder Blades",
		ink_type: "Ancient anomaly Blood",
		active_veins: ["Shoulder Blades"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Rift Ascendant Canon",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin: "Applied under the Guild Association's dermal-weave protocol.",
			history:
				"Covered by the standard Guild Association compliance agreement.",
			curse: "",
			personality: "Disciplined in its at-rest state.",
			current_owner:
				"Available through the Bureau's open augmentation catalog.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
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
			damage_profile: "utility",
			lattice_interaction:
				"Ancient anomaly Blood resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies shoulder blades tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Fear",
			attack: {
				type: "radiant",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Ancient anomaly Blood, DC 18 tattooing check, 4 hours of uninterrupted work",
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
				"Requires tattoo attunement slot (shoulder blades)",
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
		source_book: "Rift Ascendant Canon",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Developed by Bureau-licensed alchemical tattooists for field Ascendants.",
			history: "Subject to Bureau augmentation oversight and annual review.",
			curse: "",
			personality: "Neutral in personality profile.",
			current_owner:
				"Widely issued to qualifying Ascendants through Bureau studios.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
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
			damage_profile: "utility",
			lattice_interaction:
				"Leviathan Scale resonates with the bearer's mana lattice through dermal contact",
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
				damage_type: "",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Leviathan Scale, DC 12 tattooing check, 4 hours of uninterrupted work",
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
		source_book: "Rift Ascendant Canon",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin: "Formulated within the Guild's authorized dermal-mod program.",
			history: "Tracked through the Guild Association's compliance schedule.",
			curse: "",
			personality: "Quiet between activations.",
			current_owner: "Common at Guild-authorized dermal-mod clinics.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Devours the dimensional barrier. Evolution compressed into a single, violent instant.",
		discovery_lore:
			"Recovered from a time-locked chest that required three different elemental keys to open.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Engaged by a deliberate focal gesture on the tattoo.",
			type: "Tattoo",
			frequency: "1/long rest",
			duration: "1 hour",
			action: "Engaged by a deliberate focal gesture on the tattoo.",
			ability: "Presence",
			damage_profile: "utility",
			lattice_interaction:
				"Tarrasque-Class Bone Dust resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies legs tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Fear",
			attack: {
				type: "necrotic",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Tarrasque-Class Bone Dust, DC 18 tattooing check, 4 hours of uninterrupted work",
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
						"Engaged by a deliberate focal gesture on the tattoo. to activate for 1 minute.",
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
				"Requires tattoo attunement slot (legs)",
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
			"Resurrect a fallen Ascendant, permanently sacrificing the ink. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "legendary",
		attunement: true,
		body_part: "Heart",
		ink_type: "Angel-Class Anomaly Essence",
		active_veins: ["Heart"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Rift Ascendant Canon",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin: "Inked by Bureau-credentialed studio practitioners.",
			history: "Logged in the Bureau's ongoing dermal-mod registry.",
			curse: "",
			personality: "Unobtrusive while not being used.",
			current_owner: "Applied routinely to qualifying field operatives.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
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
			damage_profile: "utility",
			lattice_interaction:
				"Angel-Class Anomaly Essence resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies heart tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Blindness",
			attack: {
				type: "thunder",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Angel-Class Anomaly Essence, DC 20 tattooing check, 4 hours of uninterrupted work",
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
				"Requires tattoo attunement slot (heart)",
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
		name: "Regent of Dread's Fury",
		display_name: "Regent of Dread's Fury",
		description:
			"Enter an uncontrollable rage offering immense strength. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "legendary",
		attunement: true,
		body_part: "Face",
		ink_type: "Balor Blood",
		active_veins: ["Face"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Rift Ascendant Canon",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Produced in compliance with Ascendant Bureau augmentation standards.",
			history:
				"Reviewed periodically under the Ascendant augmentation license.",
			curse: "",
			personality: "Inert until intentionally engaged.",
			current_owner: "A standard augmentation offering at licensed studios.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Sanctifies the silence between heartbeats. The last thing many anomalies ever see.",
		discovery_lore:
			"Materialized on a Ascendant's workbench overnight, leaving scorch marks in the shape of unknown glyphs.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Called up through a practiced activation pose.",
			type: "Tattoo",
			frequency: "1/long rest",
			duration: "1 hour",
			action: "Called up through a practiced activation pose.",
			ability: "Presence",
			damage_profile: "N/A (utility/defensive)",
			lattice_interaction:
				"Balor Blood resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies face tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Stunning",
			attack: {
				type: "necrotic",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Balor Blood, DC 14 tattooing check, 4 hours of uninterrupted work",
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
						"Called up through a practiced activation pose. to activate for 1 minute.",
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
				"Requires tattoo attunement slot (face)",
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
		source_book: "Rift Ascendant Canon",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin: "Applied under the Guild Association's dermal-weave protocol.",
			history:
				"Covered by the standard Guild Association compliance agreement.",
			curse: "",
			personality: "Disciplined in its at-rest state.",
			current_owner:
				"Available through the Bureau's open augmentation catalog.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
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
			damage_profile: "utility",
			lattice_interaction:
				"Lich King Dust resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies forehead tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Paralysis",
			attack: {
				type: "radiant",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Lich King Dust, DC 19 tattooing check, 4 hours of uninterrupted work",
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
				"Requires tattoo attunement slot (forehead)",
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
		source_book: "Rift Ascendant Canon",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin: "Applied under the Guild Association's dermal-weave protocol.",
			history:
				"Covered by the standard Guild Association compliance agreement.",
			curse: "",
			personality: "Disciplined in its at-rest state.",
			current_owner:
				"Available through the Bureau's open augmentation catalog.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
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
				"Yggdrasil-Class Sap resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies spine tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Stunning",
			attack: {
				type: "radiant",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Yggdrasil-Class Sap, DC 21 tattooing check, 4 hours of uninterrupted work",
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
				"Requires tattoo attunement slot (spine)",
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
		source_book: "Rift Ascendant Canon",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin:
				"Developed by Bureau-licensed alchemical tattooists for field Ascendants.",
			history: "Subject to Bureau augmentation oversight and annual review.",
			curse: "",
			personality: "Neutral in personality profile.",
			current_owner:
				"Widely issued to qualifying Ascendants through Bureau studios.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Rends the chains of mortality. The reason S-Rank Gates are feared.",
		discovery_lore:
			"Logged by the Bureau's issue-desk after a scheduled handover.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Activated by directing attention to the glyph.",
			type: "Tattoo",
			frequency: "Proficiency/long rest",
			duration: "1 minute",
			action: "Activated by directing attention to the glyph.",
			ability: "Presence",
			damage_profile: "utility",
			lattice_interaction:
				"Astral Diamond Dust resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies third eye tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Fear",
			attack: {
				type: "cold",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Astral Diamond Dust, DC 12 tattooing check, 4 hours of uninterrupted work",
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
						"Activated by directing attention to the glyph. to activate for 1 minute.",
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
				"Requires tattoo attunement slot (third eye)",
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
		source_book: "Rift Ascendant Canon",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin: "Formulated within the Guild's authorized dermal-mod program.",
			history: "Tracked through the Guild Association's compliance schedule.",
			curse: "",
			personality: "Quiet between activations.",
			current_owner: "Common at Guild-authorized dermal-mod clinics.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor: "Rends the illusion of safety. The reason S-Rank Gates are feared.",
		discovery_lore:
			"Discovered by an E-Rank Ascendant who stumbled into an unmarked side passage during a routine dungeon clear.",
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		mechanics: {
			action_type: "Press your palm against the design",
			type: "Tattoo",
			frequency: "Passive",
			duration: "Permanent (passive)",
			action: "Press your palm against the design",
			ability: "Vitality",
			damage_profile: "utility",
			lattice_interaction:
				"Primordial Chrono-dust resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies chest tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Paralysis",
			attack: {
				type: "thunder",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Primordial Chrono-dust, DC 17 tattooing check, 4 hours of uninterrupted work",
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
				"Requires tattoo attunement slot (chest)",
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
			"Force any being of lower Ascendant rank to kneel. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain dungeon beasts.",
		rarity: "legendary",
		attunement: true,
		body_part: "Neck",
		ink_type: "Regent Essence",
		active_veins: ["Neck"],
		resonance_effect: "Synergizes with other physical bodily enchantments.",
		source_book: "Rift Ascendant Canon",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin: "Formulated within the Guild's authorized dermal-mod program.",
			history: "Tracked through the Guild Association's compliance schedule.",
			curse: "",
			personality: "Quiet between activations.",
			current_owner: "Common at Guild-authorized dermal-mod clinics.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
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
			damage_profile: "utility",
			lattice_interaction:
				"Regent Essence resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies neck tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			condition: "Paralysis",
			attack: {
				type: "cold",
				mode: "self",
				resolution: "automatic",
				modifier: "",
				damage: "0",
				damage_type: "",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Regent Essence, DC 16 tattooing check, 4 hours of uninterrupted work",
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
				"Requires tattoo attunement slot (neck)",
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
		source_book: "Rift Ascendant Canon",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		lore: {
			origin: "Inked by Bureau-credentialed studio practitioners.",
			history: "Logged in the Bureau's ongoing dermal-mod registry.",
			curse: "",
			personality: "Unobtrusive while not being used.",
			current_owner: "Applied routinely to qualifying field operatives.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
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
			damage_profile: "utility",
			lattice_interaction:
				"Oracle Thread resonates with the bearer's mana lattice through dermal contact",
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
				damage_type: "",
			},
			saving_throw: {
				ability: "",
				dc: 0,
				success: "",
				failure: "",
			},
			stat_bonuses: {},
			special_abilities: [
				"Inscription requires: Oracle Thread, DC 21 tattooing check, 4 hours of uninterrupted work",
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
