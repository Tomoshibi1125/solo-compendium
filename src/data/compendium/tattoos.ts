import type { CompendiumTattoo } from "../../types/compendium";

export const tattoos: CompendiumTattoo[] = [
	{
		id: "tattoo_1",
		name: "Regent's Heartbeat",
		display_name: "Regent's Heartbeat",
		source_book: "Rift Ascendant Canon",
		description:
			"Ritually inscribed marks that violently push the heart's endurance. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain Rift beasts.",
		rarity: "common",
		image: "/generated/effects/arcane-sigil.webp",
		effects: {
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Initiated via the bearer's conditioned trigger state. to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			passive: [
				"Deal 1d8 acid damage to creatures that hit you with melee attacks.",
			],
			passiveBonuses: [{ value: 1, stat: "acid aura" }],
			primary:
				"Deal 1d8 acid damage to creatures that hit you with melee attacks.",
			primaryEffect:
				"Deal 1d8 acid damage to creatures that hit you with melee attacks.",
			secondary:
				"You ignore the first instance of this damage type each combat.",
			secondaryEffect: "",
			tertiary:
				"Resonance: When multiple tattoos are active, gain +1 AC per active tattoo.",
		},
		attunement: true,
		lore: {
			current_owner:
				"Available through the Bureau's open augmentation catalog.",
			curse: "",
			history:
				"Covered by the standard Guild Bureau compliance agreement. The Regent's Heartbeat carried the story forward.",
			origin:
				"Applied under the Guild Bureau's dermal-weave protocol. Bureau provenance files log it as the Regent's Heartbeat.",
			personality: "Disciplined in its at-rest state.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Pins the cast's result to one deterministic branch. The line between Ascendant and anomaly.",
		discovery_lore:
			"Recorded in the Ascendant's inventory during their last resupply.",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		active_veins: ["Neck"],
		body_part: "Neck",
		ink_type: "Crimson Boss Ichor",
		limitations: {
			requires_attunement: true,
			charges: 0,
			conditions: [
				"Requires tattoo attunement slot (neck)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 250,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			recharge: "Short rest",
			uses: "Passive + 1 active/short rest",
			uses_per_rest: 2,
		},
		mechanics: {
			type: "Tattoo",
			ability: "Vitality",
			action: "Initiated via the bearer's conditioned trigger state.",
			action_type: "Initiated via the bearer's conditioned trigger state.",
			attack: {
				type: "acid",
				damage: "0",
				damage_type: "",
				mode: "self",
				modifier: "",
				resolution: "automatic",
			},
			condition: "Lethargy",
			damage_profile: "N/A (utility/defensive)",
			duration: "Permanent (passive)",
			frequency: "1/long rest",
			lattice_interaction:
				"Crimson Boss Ichor resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies neck tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			saving_throw: { ability: "", dc: 0, failure: "", success: "" },
			special_abilities: [
				"Inscription requires: Crimson Boss Ichor, DC 16 tattooing check, 4 hours of uninterrupted work",
			],
			stat_bonuses: {},
		},
		resonance_effect: "Synergizes with other physical bodily enchantments.",
	},
	{
		id: "tattoo_2",
		name: "Bone-Weave Tapestry",
		display_name: "Bone-Weave Tapestry",
		source_book: "Rift Ascendant Canon",
		description:
			"Hardens the skeleton by absorbing ambient mana. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain Rift beasts.",
		rarity: "common",
		image: "/generated/effects/arcane-sigil.webp",
		effects: {
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Channel mana through the ink circuits to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			passive: ["You can see in magical darkness out to 60 feet."],
			passiveBonuses: [{ value: 1, stat: "necrotic aura" }],
			primary: "You can see in magical darkness out to 60 feet.",
			primaryEffect: "You can see in magical darkness out to 60 feet.",
			secondary: "Allies within 5 feet gain +1 to saving throws.",
			secondaryEffect: "",
			tertiary:
				"Resonance: When multiple tattoos are active, gain +1 AC per active tattoo.",
		},
		attunement: true,
		lore: {
			current_owner: "Common at Guild-authorized dermal-mod clinics.",
			curse: "",
			history:
				"Tracked through the Guild Bureau's compliance schedule. The Bone-Weave Tapestry carried the story forward.",
			origin:
				"Formulated within the Guild's authorized dermal-mod program. Archived under the Bone-Weave Tapestry designation.",
			personality: "Quiet between activations.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Devours the concept of distance. Proof that some things cannot be survived.",
		discovery_lore:
			"Entered into the Ascendant's inventory via standard requisition.",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		active_veins: ["Spine"],
		body_part: "Spine",
		ink_type: "anomaly Bone Dust",
		limitations: {
			requires_attunement: true,
			charges: 0,
			conditions: [
				"Requires tattoo attunement slot (spine)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 500,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			recharge: "Short rest",
			uses: "Passive + 1 active/short rest",
			uses_per_rest: 1,
		},
		mechanics: {
			type: "Tattoo",
			ability: "Presence",
			action: "Channel mana through the ink circuits",
			action_type: "Channel mana through the ink circuits",
			attack: {
				type: "necrotic",
				damage: "0",
				damage_type: "",
				mode: "self",
				modifier: "",
				resolution: "automatic",
			},
			condition: "Fear",
			damage_profile: "N/A (utility/defensive)",
			duration: "Permanent (passive)",
			frequency: "Proficiency/long rest",
			lattice_interaction:
				"anomaly Bone Dust resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies spine tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			saving_throw: { ability: "", dc: 0, failure: "", success: "" },
			special_abilities: [
				"Inscription requires: anomaly Bone Dust, DC 11 tattooing check, 4 hours of uninterrupted work",
			],
			stat_bonuses: {},
		},
		resonance_effect: "Synergizes with other physical bodily enchantments.",
	},
	{
		id: "tattoo_3",
		name: "Ascendant's Acuity",
		display_name: "Ascendant's Acuity",
		source_book: "Rift Ascendant Canon",
		description:
			"Quickens the mind and reflexes using raw magical energy. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain Rift beasts.",
		rarity: "uncommon",
		image: "/generated/effects/darkness-shroud.webp",
		effects: {
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Flex the tattooed muscle group to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			passive: ["Your movement speed increases by 10 feet."],
			passiveBonuses: [{ value: 1, stat: "lightning aura" }],
			primary: "Your movement speed increases by 10 feet.",
			primaryEffect: "Your movement speed increases by 10 feet.",
			secondary:
				"Your unarmed strikes deal an additional 1d4 of the tattoo's element.",
			secondaryEffect: "",
			tertiary:
				"Resonance: When multiple tattoos are active, gain +1 AC per active tattoo.",
		},
		attunement: true,
		lore: {
			current_owner: "Applied routinely to qualifying field operatives.",
			curse: "",
			history:
				"Logged in the Bureau's ongoing dermal-mod registry. That much survives in the Ascendant's Acuity's field history.",
			origin:
				"Inked by Bureau-credentialed studio practitioners. Bureau provenance files log it as the Ascendant's Acuity.",
			personality: "Unobtrusive while not being used.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Inverts the dimensional barrier. A testament to what Ascendants have become.",
		discovery_lore:
			"Excavated from the crystallized mana deposit at the center of a depleted Rift core. Logged on arrival as the Ascendant's Acuity.",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		active_veins: ["Temple"],
		body_part: "Temple",
		ink_type: "Silvered Mercury",
		limitations: {
			requires_attunement: true,
			charges: 0,
			conditions: [
				"Requires tattoo attunement slot (temple)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 5000,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			recharge: "Short rest",
			uses: "Passive only",
			uses_per_rest: 3,
		},
		mechanics: {
			type: "Tattoo",
			ability: "Presence",
			action: "Flex the tattooed muscle group",
			action_type: "Flex the tattooed muscle group",
			attack: {
				type: "lightning",
				damage: "0",
				damage_type: "",
				mode: "self",
				modifier: "",
				resolution: "automatic",
			},
			condition: "Fear",
			damage_profile: "N/A (utility/defensive)",
			duration: "Permanent (passive)",
			frequency: "2/short rest",
			lattice_interaction:
				"Silvered Mercury resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies temple tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			saving_throw: { ability: "", dc: 0, failure: "", success: "" },
			special_abilities: [
				"Inscription requires: Silvered Mercury, DC 16 tattooing check, 4 hours of uninterrupted work",
			],
			stat_bonuses: {},
		},
		resonance_effect: "Synergizes with other physical bodily enchantments.",
	},
	{
		id: "tattoo_4",
		name: "Earth-Mantle Plating",
		display_name: "Earth-Mantle Plating",
		source_book: "Rift Ascendant Canon",
		description:
			"Flesh hardens into magical stone plates on command. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain Rift beasts.",
		rarity: "uncommon",
		image: "/generated/effects/arcane-sigil.webp",
		effects: {
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Channel mana through the ink circuits to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			passive: ["You can see in magical darkness out to 60 feet."],
			passiveBonuses: [{ value: 1, stat: "force aura" }],
			primary: "You can see in magical darkness out to 60 feet.",
			primaryEffect: "You can see in magical darkness out to 60 feet.",
			secondary:
				"You ignore the first instance of this damage type each combat.",
			secondaryEffect: "",
			tertiary:
				"Resonance: When multiple tattoos are active, gain +1 AC per active tattoo.",
		},
		attunement: true,
		lore: {
			current_owner:
				"Available through the Bureau's open augmentation catalog.",
			curse: "",
			history:
				"Covered by the standard Guild Bureau compliance agreement. The Earth-Mantle Plating carried the story forward.",
			origin:
				"Applied under the Guild Bureau's dermal-weave protocol. Bureau provenance files log it as the Earth-Mantle Plating.",
			personality: "Disciplined in its at-rest state.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Ignites the last defense of the unprepared. The breaking point of all resistance.",
		discovery_lore:
			"Dropped by a mini-boss that shouldn't have existed according to the Rift's difficulty rating. Intake tagged it the Earth-Mantle Plating.",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		active_veins: ["Chest"],
		body_part: "Chest",
		ink_type: "Earth Golem Core",
		limitations: {
			requires_attunement: true,
			charges: 0,
			conditions: [
				"Requires tattoo attunement slot (chest)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 100,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			recharge: "Long rest",
			uses: "Passive + 1 active/short rest",
			uses_per_rest: 1,
		},
		mechanics: {
			type: "Tattoo",
			ability: "Vitality",
			action: "Channel mana through the ink circuits",
			action_type: "Channel mana through the ink circuits",
			attack: {
				type: "force",
				damage: "0",
				damage_type: "",
				mode: "self",
				modifier: "",
				resolution: "automatic",
			},
			condition: "Blindness",
			damage_profile: "N/A (utility/defensive)",
			duration: "1 minute",
			frequency: "1/long rest",
			lattice_interaction:
				"Earth Golem Core resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies chest tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			saving_throw: { ability: "", dc: 0, failure: "", success: "" },
			special_abilities: [
				"Inscription requires: Earth Golem Core, DC 14 tattooing check, 4 hours of uninterrupted work",
			],
			stat_bonuses: {},
		},
		resonance_effect: "Synergizes with other physical bodily enchantments.",
	},
	{
		id: "tattoo_5",
		name: "Impact Reservoir",
		display_name: "Impact Reservoir",
		source_book: "Rift Ascendant Canon",
		description:
			"Stores the forceful blows from enemy strikes into the skin's magical weave. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain Rift beasts.",
		rarity: "uncommon",
		image: "/generated/effects/darkness-shroud.webp",
		effects: {
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Press your palm against the design to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			passive: ["Gain +2 to Vitality while the tattoo is active."],
			passiveBonuses: [{ value: 1, stat: "fire aura" }],
			primary: "Gain +2 to Vitality while the tattoo is active.",
			primaryEffect: "Gain +2 to Vitality while the tattoo is active.",
			secondary:
				"You ignore the first instance of this damage type each combat.",
			secondaryEffect: "",
			tertiary:
				"Emergency Pulse: When reduced to 0 HP, the tattoo activates automatically (1/long rest).",
		},
		attunement: true,
		lore: {
			current_owner:
				"Widely issued to qualifying Ascendants through Bureau studios.",
			curse: "",
			history:
				"Subject to Bureau augmentation oversight and annual review. That much survives in the Impact Reservoir's field history.",
			origin:
				"Developed by Bureau-licensed alchemical tattooists for field Ascendants. Archived under the Impact Reservoir designation.",
			personality: "Neutral in personality profile.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor: "Warps the laws of physics. A whisper from the edge of oblivion.",
		discovery_lore:
			"Traded by a nomadic Awakened who claimed to have no memory of acquiring it. Logged on arrival as the Impact Reservoir.",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		active_veins: ["Left Forearm"],
		body_part: "Left Forearm",
		ink_type: "Crushed Garnet",
		limitations: {
			requires_attunement: true,
			charges: 0,
			conditions: [
				"Requires tattoo attunement slot (left forearm)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 5000,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			recharge: "Dawn",
			uses: "Proficiency/long rest",
			uses_per_rest: 3,
		},
		mechanics: {
			type: "Tattoo",
			ability: "Vitality",
			action: "Press your palm against the design",
			action_type: "Press your palm against the design",
			attack: {
				type: "fire",
				damage: "0",
				damage_type: "",
				mode: "self",
				modifier: "",
				resolution: "automatic",
			},
			condition: "Lethargy",
			damage_profile: "utility",
			duration: "10 minutes",
			frequency: "2/short rest",
			lattice_interaction:
				"Crushed Garnet resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies left forearm tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			saving_throw: { ability: "", dc: 0, failure: "", success: "" },
			special_abilities: [
				"Inscription requires: Crushed Garnet, DC 10 tattooing check, 4 hours of uninterrupted work",
			],
			stat_bonuses: {},
		},
		resonance_effect: "Synergizes with other physical bodily enchantments.",
	},
	{
		id: "tattoo_6",
		name: "Predator's Gaze",
		display_name: "Predator's Gaze",
		source_book: "Rift Ascendant Canon",
		description:
			"Allows sensing magical auras through solid walls. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain Rift beasts.",
		rarity: "uncommon",
		image: "/generated/effects/darkness-shroud.webp",
		effects: {
			active: [
				{
					name: "Tattoo Activation",
					description: "Speak the tattoo's true name to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			passive: ["Your movement speed increases by 10 feet."],
			passiveBonuses: [{ value: 1, stat: "force aura" }],
			primary: "Your movement speed increases by 10 feet.",
			primaryEffect: "Your movement speed increases by 10 feet.",
			secondary:
				"You ignore the first instance of this damage type each combat.",
			secondaryEffect: "",
			tertiary:
				"Emergency Pulse: When reduced to 0 HP, the tattoo activates automatically (1/long rest).",
		},
		attunement: true,
		lore: {
			current_owner: "Applied routinely to qualifying field operatives.",
			curse: "",
			history:
				"Logged in the Bureau's ongoing dermal-mod registry. The Predator's Gaze carried the story forward.",
			origin:
				"Inked by Bureau-credentialed studio practitioners. The Predator's Gaze entered service from there.",
			personality: "Unobtrusive while not being used.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Purges the chains of mortality. Evolution compressed into a single, violent instant.",
		discovery_lore:
			"Sold by a mysterious merchant who appears only during full moons near active Rift sites. Intake tagged it the Predator's Gaze.",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		active_veins: ["Around Eyes"],
		body_part: "Around Eyes",
		ink_type: "Anomaly Eye Fluid",
		limitations: {
			requires_attunement: true,
			charges: 0,
			conditions: [
				"Requires tattoo attunement slot (around eyes)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 100,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			recharge: "Short rest",
			uses: "Proficiency/long rest",
			uses_per_rest: 3,
		},
		mechanics: {
			type: "Tattoo",
			ability: "Presence",
			action: "Speak the tattoo's true name",
			action_type: "Speak the tattoo's true name",
			attack: {
				type: "force",
				damage: "0",
				damage_type: "",
				mode: "self",
				modifier: "",
				resolution: "automatic",
			},
			condition: "Stunning",
			damage_profile: "utility",
			duration: "1 minute",
			frequency: "Passive",
			lattice_interaction:
				"Anomaly Eye Fluid resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies around eyes tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			saving_throw: { ability: "", dc: 0, failure: "", success: "" },
			special_abilities: [
				"Inscription requires: Anomaly Eye Fluid, DC 18 tattooing check, 4 hours of uninterrupted work",
			],
			stat_bonuses: {},
		},
		resonance_effect: "Synergizes with other physical bodily enchantments.",
	},
	{
		id: "tattoo_7",
		name: "Flame Exhaust",
		display_name: "Flame Exhaust",
		source_book: "Rift Ascendant Canon",
		description:
			"Safely expels excess heat from fire magic. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain Rift beasts.",
		rarity: "uncommon",
		image: "/generated/effects/arcane-sigil.webp",
		effects: {
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Called up through a practiced activation pose. to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			passive: [
				"Deal 1d6 force damage to creatures that hit you with melee attacks.",
			],
			passiveBonuses: [{ value: 1, stat: "force aura" }],
			primary:
				"Deal 1d6 force damage to creatures that hit you with melee attacks.",
			primaryEffect:
				"Deal 1d6 force damage to creatures that hit you with melee attacks.",
			secondary:
				"You ignore the first instance of this damage type each combat.",
			secondaryEffect: "",
			tertiary:
				"Emergency Pulse: When reduced to 0 HP, the tattoo activates automatically (1/long rest).",
		},
		attunement: true,
		lore: {
			current_owner: "A standard augmentation offering at licensed studios.",
			curse: "",
			history:
				"Reviewed periodically under the Ascendant augmentation license. The Flame Exhaust carried the story forward.",
			origin:
				"Produced in compliance with Ascendant Bureau augmentation standards. Archived under the Flame Exhaust designation.",
			personality: "Inert until intentionally engaged.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Mirrors the threshold of human potential. A whisper from the edge of oblivion.",
		discovery_lore:
			"Discovered by an E-Rank Ascendant who stumbled into an unmarked side passage during a routine Rift clear. Intake tagged it the Flame Exhaust.",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		active_veins: ["Ribs"],
		body_part: "Ribs",
		ink_type: "Salamander Extract",
		limitations: {
			requires_attunement: true,
			charges: 0,
			conditions: [
				"Requires tattoo attunement slot (ribs)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 1000,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			recharge: "Short rest",
			uses: "2/short rest",
			uses_per_rest: 2,
		},
		mechanics: {
			type: "Tattoo",
			ability: "Intelligence",
			action: "Called up through a practiced activation pose.",
			action_type: "Called up through a practiced activation pose.",
			attack: {
				type: "self",
				damage: "0",
				damage_type: "",
				mode: "self",
				modifier: "",
				resolution: "automatic",
			},
			condition: "Blindness",
			damage_profile: "N/A (utility/defensive)",
			duration: "1 hour",
			frequency: "2/short rest",
			lattice_interaction:
				"Salamander Extract resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies ribs tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			saving_throw: { ability: "", dc: 0, failure: "", success: "" },
			special_abilities: [
				"Inscription requires: Salamander Extract, DC 17 tattooing check, 4 hours of uninterrupted work",
			],
			stat_bonuses: {},
		},
		resonance_effect: "Synergizes with other physical bodily enchantments.",
	},
	{
		id: "tattoo_8",
		name: "Wind-Shear Cloak",
		display_name: "Wind-Shear Cloak",
		source_book: "Rift Ascendant Canon",
		description:
			"A wind-magic weave that helps the Ascendant cut through the air. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain Rift beasts.",
		rarity: "uncommon",
		image: "/generated/effects/darkness-shroud.webp",
		effects: {
			active: [
				{
					name: "Tattoo Activation",
					description: "Speak the tattoo's true name to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			passive: [
				"Deal 2d4 psychic damage to creatures that hit you with melee attacks.",
			],
			passiveBonuses: [{ value: 1, stat: "psychic aura" }],
			primary:
				"Deal 2d4 psychic damage to creatures that hit you with melee attacks.",
			primaryEffect:
				"Deal 2d4 psychic damage to creatures that hit you with melee attacks.",
			secondary:
				"The ink glows faintly, granting advantage on Intimidation checks.",
			secondaryEffect: "",
			tertiary:
				"Resonance: When multiple tattoos are active, gain +1 AC per active tattoo.",
		},
		attunement: true,
		lore: {
			current_owner: "Common at Guild-authorized dermal-mod clinics.",
			curse: "",
			history:
				"Tracked through the Guild Bureau's compliance schedule. The Wind-Shear Cloak carried the story forward.",
			origin:
				"Formulated within the Guild's authorized dermal-mod program. The Wind-Shear Cloak entered service from there.",
			personality: "Quiet between activations.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Erases the boundary between life and death. The reason S-Rank Rifts are feared.",
		discovery_lore:
			"Gifted by the System itself as a reward for completing a hidden quest chain.",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		active_veins: ["Legs"],
		body_part: "Legs",
		ink_type: "Griffon Feather Ink",
		limitations: {
			requires_attunement: true,
			charges: 0,
			conditions: [
				"Requires tattoo attunement slot (legs)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 1000,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			recharge: "Short rest",
			uses: "Passive + 1 active/short rest",
			uses_per_rest: 2,
		},
		mechanics: {
			type: "Tattoo",
			ability: "Intelligence",
			action: "Speak the tattoo's true name",
			action_type: "Speak the tattoo's true name",
			attack: {
				type: "psychic",
				damage: "0",
				damage_type: "",
				mode: "self",
				modifier: "",
				resolution: "automatic",
			},
			condition: "Lethargy",
			damage_profile: "utility",
			duration: "10 minutes",
			frequency: "Proficiency/long rest",
			lattice_interaction:
				"Griffon Feather Ink resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies legs tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			saving_throw: { ability: "", dc: 0, failure: "", success: "" },
			special_abilities: [
				"Inscription requires: Griffon Feather Ink, DC 13 tattooing check, 4 hours of uninterrupted work",
			],
			stat_bonuses: {},
		},
		resonance_effect: "Synergizes with other physical bodily enchantments.",
	},
	{
		id: "tattoo_9",
		name: "Blood-Iron Seal",
		display_name: "Blood-Iron Seal",
		source_book: "Rift Ascendant Canon",
		description:
			"Seals wounds instantly using blood-magic manipulation. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain Rift beasts.",
		rarity: "uncommon",
		image: "/generated/effects/darkness-shroud.webp",
		effects: {
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Channel mana through the ink circuits to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			passive: ["Gain +2 to Sense while the tattoo is active."],
			passiveBonuses: [{ value: 1, stat: "cold aura" }],
			primary: "Gain +2 to Sense while the tattoo is active.",
			primaryEffect: "Gain +2 to Sense while the tattoo is active.",
			secondary:
				"The ink glows faintly, granting advantage on Intimidation checks.",
			secondaryEffect: "",
			tertiary:
				"Resonance: When multiple tattoos are active, gain +1 AC per active tattoo.",
		},
		attunement: true,
		lore: {
			current_owner: "Applied routinely to qualifying field operatives.",
			curse: "",
			history:
				"Logged in the Bureau's ongoing dermal-mod registry. The Blood-Iron Seal's service record notes as much.",
			origin:
				"Inked by Bureau-credentialed studio practitioners. Bureau provenance files log it as the Blood-Iron Seal.",
			personality: "Unobtrusive while not being used.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Absorbs the threshold of human potential. The breaking point of all resistance.",
		discovery_lore:
			"Emerged from a Rift Boss's dissolution cloud, hovering where the creature's heart had been. The recovery slip named it the Blood-Iron Seal.",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		active_veins: ["Heart"],
		body_part: "Heart",
		ink_type: "Vampire Lord Dust",
		limitations: {
			requires_attunement: true,
			charges: 0,
			conditions: [
				"Requires tattoo attunement slot (heart)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 5000,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			recharge: "Short rest",
			uses: "Passive + 1 active/short rest",
			uses_per_rest: 3,
		},
		mechanics: {
			type: "Tattoo",
			ability: "Vitality",
			action: "Channel mana through the ink circuits",
			action_type: "Channel mana through the ink circuits",
			attack: {
				type: "self",
				damage: "0",
				damage_type: "",
				mode: "self",
				modifier: "",
				resolution: "automatic",
			},
			condition: "Stunning",
			damage_profile: "N/A (utility/defensive)",
			duration: "1 hour",
			frequency: "2/short rest",
			lattice_interaction:
				"Vampire Lord Dust resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies heart tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			saving_throw: { ability: "", dc: 0, failure: "", success: "" },
			special_abilities: [
				"Inscription requires: Vampire Lord Dust, DC 18 tattooing check, 4 hours of uninterrupted work",
			],
			stat_bonuses: {},
		},
		resonance_effect: "Synergizes with other physical bodily enchantments.",
	},
	{
		id: "tattoo_10",
		name: "Pain-Ward Glyphs",
		display_name: "Pain-Ward Glyphs",
		source_book: "Rift Ascendant Canon",
		description:
			"Temporarily dulls agony via localized illusion magic. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain Rift beasts.",
		rarity: "uncommon",
		image: "/generated/effects/darkness-shroud.webp",
		effects: {
			active: [
				{
					name: "Tattoo Activation",
					description: "Speak the tattoo's true name to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			passive: ["You can see in magical darkness out to 60 feet."],
			passiveBonuses: [{ value: 1, stat: "poison aura" }],
			primary: "You can see in magical darkness out to 60 feet.",
			primaryEffect: "You can see in magical darkness out to 60 feet.",
			secondary:
				"The ink glows faintly, granting advantage on Intimidation checks.",
			secondaryEffect: "",
			tertiary:
				"Resonance: When multiple tattoos are active, gain +1 AC per active tattoo.",
		},
		attunement: true,
		lore: {
			current_owner: "Applied routinely to qualifying field operatives.",
			curse: "",
			history:
				"Logged in the Bureau's ongoing dermal-mod registry. The Pain-Ward Glyphs carried the story forward.",
			origin:
				"Inked by Bureau-credentialed studio practitioners. The Pain-Ward Glyphs entered service from there.",
			personality: "Unobtrusive while not being used.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Warps the dimensional barrier. Evolution compressed into a single, violent instant.",
		discovery_lore:
			"Materialized on an Ascendant's workbench overnight, leaving scorch marks in the shape of unknown glyphs. The recovery slip named it the Pain-Ward Glyphs.",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		active_veins: ["Forehead"],
		body_part: "Forehead",
		ink_type: "Ghoul Extract",
		limitations: {
			requires_attunement: true,
			charges: 0,
			conditions: [
				"Requires tattoo attunement slot (forehead)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 500,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			recharge: "Long rest",
			uses: "2/short rest",
			uses_per_rest: 3,
		},
		mechanics: {
			type: "Tattoo",
			ability: "Vitality",
			action: "Speak the tattoo's true name",
			action_type: "Speak the tattoo's true name",
			attack: {
				type: "poison",
				damage: "0",
				damage_type: "",
				mode: "self",
				modifier: "",
				resolution: "automatic",
			},
			condition: "Lethargy",
			damage_profile: "utility",
			duration: "10 minutes",
			frequency: "1/short rest",
			lattice_interaction:
				"Ghoul Extract resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies forehead tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			saving_throw: { ability: "", dc: 0, failure: "", success: "" },
			special_abilities: [
				"Inscription requires: Ghoul Extract, DC 21 tattooing check, 4 hours of uninterrupted work",
			],
			stat_bonuses: {},
		},
		resonance_effect: "Synergizes with other physical bodily enchantments.",
	},
	{
		id: "tattoo_11",
		name: "Blind-Sight Resonance",
		display_name: "Blind-Sight Resonance",
		source_book: "Rift Ascendant Canon",
		description:
			"Uses magical pulses to track threats in total darkness. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain Rift beasts.",
		rarity: "uncommon",
		image: "/generated/effects/darkness-shroud.webp",
		effects: {
			active: [
				{
					name: "Tattoo Activation",
					description: "Speak the tattoo's true name to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			passive: ["Your movement speed increases by 10 feet."],
			passiveBonuses: [{ value: 1, stat: "acid aura" }],
			primary: "Your movement speed increases by 10 feet.",
			primaryEffect: "Your movement speed increases by 10 feet.",
			secondary:
				"The ink glows faintly, granting advantage on Intimidation checks.",
			secondaryEffect: "",
			tertiary:
				"Resonance: When multiple tattoos are active, gain +1 AC per active tattoo.",
		},
		attunement: true,
		lore: {
			current_owner: "Common at Guild-authorized dermal-mod clinics.",
			curse: "",
			history:
				"Tracked through the Guild Bureau's compliance schedule. That much survives in the Blind-Sight Resonance's field history.",
			origin:
				"Formulated within the Guild's authorized dermal-mod program. Archived under the Blind-Sight Resonance designation.",
			personality: "Quiet between activations.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Dissolves the silence between heartbeats. A whisper from the edge of oblivion.",
		discovery_lore:
			"Sold by a mysterious merchant who appears only during full moons near active Rift sites. The recovery slip named it the Blind-Sight Resonance.",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		active_veins: ["Throat"],
		body_part: "Throat",
		ink_type: "Blind Cave Crawler Core",
		limitations: {
			requires_attunement: true,
			charges: 0,
			conditions: [
				"Requires tattoo attunement slot (throat)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 2500,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			recharge: "Short rest",
			uses: "Passive only",
			uses_per_rest: 2,
		},
		mechanics: {
			type: "Tattoo",
			ability: "Presence",
			action: "Speak the tattoo's true name",
			action_type: "Speak the tattoo's true name",
			attack: {
				type: "acid",
				damage: "0",
				damage_type: "",
				mode: "self",
				modifier: "",
				resolution: "automatic",
			},
			condition: "Blindness",
			damage_profile: "utility",
			duration: "10 minutes",
			frequency: "Proficiency/long rest",
			lattice_interaction:
				"Blind Cave Crawler Core resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies throat tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			saving_throw: { ability: "", dc: 0, failure: "", success: "" },
			special_abilities: [
				"Inscription requires: Blind Cave Crawler Core, DC 20 tattooing check, 4 hours of uninterrupted work",
			],
			stat_bonuses: {},
		},
		resonance_effect: "Synergizes with other physical bodily enchantments.",
	},
	{
		id: "tattoo_12",
		name: "Acidic Excretion",
		display_name: "Acidic Excretion",
		source_book: "Rift Ascendant Canon",
		description:
			"Secretes a thin layer of dungeon-grade corrosive fluid. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain Rift beasts.",
		rarity: "uncommon",
		image: "/generated/effects/darkness-shroud.webp",
		effects: {
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Activated by directing attention to the glyph. to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			passive: ["Your movement speed increases by 10 feet."],
			passiveBonuses: [{ value: 1, stat: "cold aura" }],
			primary: "Your movement speed increases by 10 feet.",
			primaryEffect: "Your movement speed increases by 10 feet.",
			secondary:
				"Your unarmed strikes deal an additional 1d4 of the tattoo's element.",
			secondaryEffect: "",
			tertiary:
				"Overcharge: Once per long rest, double the primary effect for 1 round.",
		},
		attunement: true,
		lore: {
			current_owner:
				"Widely issued to qualifying Ascendants through Bureau studios.",
			curse: "",
			history:
				"Subject to Bureau augmentation oversight and annual review. The Acidic Excretion's service record notes as much.",
			origin:
				"Developed by Bureau-licensed alchemical tattooists for field Ascendants. The Acidic Excretion entered service from there.",
			personality: "Neutral in personality profile.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Rends the certainty of outcomes. A testament to what Ascendants have become.",
		discovery_lore:
			"Excavated from the crystallized mana deposit at the center of a depleted Rift core. Logged on arrival as the Acidic Excretion.",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		active_veins: ["Palms"],
		body_part: "Palms",
		ink_type: "Ooze Core",
		limitations: {
			requires_attunement: true,
			charges: 0,
			conditions: [
				"Requires tattoo attunement slot (palms)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 500,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			recharge: "Long rest",
			uses: "2/short rest",
			uses_per_rest: 1,
		},
		mechanics: {
			type: "Tattoo",
			ability: "Presence",
			action: "Activated by directing attention to the glyph.",
			action_type: "Activated by directing attention to the glyph.",
			attack: {
				type: "cold",
				damage: "0",
				damage_type: "",
				mode: "self",
				modifier: "",
				resolution: "automatic",
			},
			condition: "Fear",
			damage_profile: "utility",
			duration: "10 minutes",
			frequency: "Passive",
			lattice_interaction:
				"Ooze Core resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies palms tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			saving_throw: { ability: "", dc: 0, failure: "", success: "" },
			special_abilities: [
				"Inscription requires: Ooze Core, DC 21 tattooing check, 4 hours of uninterrupted work",
			],
			stat_bonuses: {},
		},
		resonance_effect: "Synergizes with other physical bodily enchantments.",
	},
	{
		id: "tattoo_13",
		name: "Purifying Furnace",
		display_name: "Purifying Furnace",
		source_book: "Rift Ascendant Canon",
		description:
			"Burns toxins and venoms out of the bloodstream. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain Rift beasts.",
		rarity: "uncommon",
		image: "/generated/effects/darkness-shroud.webp",
		effects: {
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Channel mana through the ink circuits to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			passive: ["Your movement speed increases by 10 feet."],
			passiveBonuses: [{ value: 1, stat: "radiant aura" }],
			primary: "Your movement speed increases by 10 feet.",
			primaryEffect: "Your movement speed increases by 10 feet.",
			secondary:
				"You ignore the first instance of this damage type each combat.",
			secondaryEffect: "",
			tertiary:
				"Overcharge: Once per long rest, double the primary effect for 1 round.",
		},
		attunement: true,
		lore: {
			current_owner:
				"Available through the Bureau's open augmentation catalog.",
			curse: "",
			history:
				"Covered by the standard Guild Bureau compliance agreement. That much survives in the Purifying Furnace's field history.",
			origin:
				"Applied under the Guild Bureau's dermal-weave protocol. The Purifying Furnace entered service from there.",
			personality: "Disciplined in its at-rest state.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Purges the concept of distance. Proof that some things cannot be survived.",
		discovery_lore:
			"Traded by a nomadic Awakened who claimed to have no memory of acquiring it. The recovery slip named it the Purifying Furnace.",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		active_veins: ["Stomach"],
		body_part: "Stomach",
		ink_type: "Hellhound Ash",
		limitations: {
			requires_attunement: true,
			charges: 0,
			conditions: [
				"Requires tattoo attunement slot (stomach)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 2500,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			recharge: "Long rest",
			uses: "Passive + 1 active/short rest",
			uses_per_rest: 1,
		},
		mechanics: {
			type: "Tattoo",
			ability: "Intelligence",
			action: "Channel mana through the ink circuits",
			action_type: "Channel mana through the ink circuits",
			attack: {
				type: "radiant",
				damage: "0",
				damage_type: "",
				mode: "self",
				modifier: "",
				resolution: "automatic",
			},
			condition: "Paralysis",
			damage_profile: "N/A (utility/defensive)",
			duration: "Permanent (passive)",
			frequency: "Passive",
			lattice_interaction:
				"Hellhound Ash resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies stomach tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			saving_throw: { ability: "", dc: 0, failure: "", success: "" },
			special_abilities: [
				"Inscription requires: Hellhound Ash, DC 20 tattooing check, 4 hours of uninterrupted work",
			],
			stat_bonuses: {},
		},
		resonance_effect: "Synergizes with other physical bodily enchantments.",
	},
	{
		id: "tattoo_14",
		name: "Sky-Walker's Tread",
		display_name: "Sky-Walker's Tread",
		source_book: "Rift Ascendant Canon",
		description:
			"Grants the ability to walk on walls via wind magic. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain Rift beasts.",
		rarity: "uncommon",
		image: "/generated/effects/arcane-sigil.webp",
		effects: {
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Channel mana through the ink circuits to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			passive: ["You can see in magical darkness out to 60 feet."],
			passiveBonuses: [{ value: 1, stat: "acid aura" }],
			primary: "You can see in magical darkness out to 60 feet.",
			primaryEffect: "You can see in magical darkness out to 60 feet.",
			secondary:
				"You ignore the first instance of this damage type each combat.",
			secondaryEffect: "",
			tertiary:
				"Overcharge: Once per long rest, double the primary effect for 1 round.",
		},
		attunement: true,
		lore: {
			current_owner: "A standard augmentation offering at licensed studios.",
			curse: "",
			history:
				"Reviewed periodically under the Ascendant augmentation license. The Sky-Walker's Tread carried the story forward.",
			origin:
				"Produced in compliance with Ascendant Bureau augmentation standards. Bureau provenance files log it as the Sky-Walker's Tread.",
			personality: "Inert until intentionally engaged.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Erases the chains of mortality. A whisper from the edge of oblivion.",
		discovery_lore:
			"Located by a detection-type Ascendant whose radar ability triggered on an otherwise empty room. Intake tagged it the Sky-Walker's Tread.",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		active_veins: ["Feet"],
		body_part: "Feet",
		ink_type: "Wind Elemental Core",
		limitations: {
			requires_attunement: true,
			charges: 0,
			conditions: [
				"Requires tattoo attunement slot (feet)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 250,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			recharge: "Short rest",
			uses: "2/short rest",
			uses_per_rest: 1,
		},
		mechanics: {
			type: "Tattoo",
			ability: "Presence",
			action: "Channel mana through the ink circuits",
			action_type: "Channel mana through the ink circuits",
			attack: {
				type: "acid",
				damage: "0",
				damage_type: "",
				mode: "self",
				modifier: "",
				resolution: "automatic",
			},
			condition: "Blindness",
			damage_profile: "N/A (utility/defensive)",
			duration: "1 hour",
			frequency: "1/long rest",
			lattice_interaction:
				"Wind Elemental Core resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies feet tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			saving_throw: { ability: "", dc: 0, failure: "", success: "" },
			special_abilities: [
				"Inscription requires: Wind Elemental Core, DC 11 tattooing check, 4 hours of uninterrupted work",
			],
			stat_bonuses: {},
		},
		resonance_effect: "Synergizes with other physical bodily enchantments.",
	},
	{
		id: "tattoo_15",
		name: "Mimic's Voice",
		display_name: "Mimic's Voice",
		source_book: "Rift Ascendant Canon",
		description:
			"Perfectly replicate any voice heard. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain Rift beasts.",
		rarity: "rare",
		image: "/generated/effects/arcane-sigil.webp",
		effects: {
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Press your palm against the design to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			passive: [
				"Deal 2d4 acid damage to creatures that hit you with melee attacks.",
			],
			passiveBonuses: [{ value: 1, stat: "acid aura" }],
			primary:
				"Deal 2d4 acid damage to creatures that hit you with melee attacks.",
			primaryEffect:
				"Deal 2d4 acid damage to creatures that hit you with melee attacks.",
			secondary:
				"You ignore the first instance of this damage type each combat.",
			secondaryEffect: "",
			tertiary:
				"Resonance: When multiple tattoos are active, gain +1 AC per active tattoo.",
		},
		attunement: true,
		lore: {
			current_owner: "Applied routinely to qualifying field operatives.",
			curse:
				"The user becomes unable to dream, replaced by visions of the void between Rifts.",
			history:
				"Logged in the Bureau's ongoing dermal-mod registry. That much survives in the Mimic's Voice's field history.",
			origin:
				"Inked by Bureau-credentialed studio practitioners. Bureau provenance files log it as the Mimic's Voice.",
			personality: "Unobtrusive while not being used.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Purges the chains of mortality. A whisper from the edge of oblivion.",
		discovery_lore:
			"Checked out through the Guild's credentialed loaner program.",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		active_veins: ["Throat"],
		body_part: "Throat",
		ink_type: "Doppelganger Tissue",
		limitations: {
			requires_attunement: true,
			charges: 0,
			conditions: [
				"Requires tattoo attunement slot (throat)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 500,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			recharge: "Long rest",
			uses: "Passive only",
			uses_per_rest: 2,
		},
		mechanics: {
			type: "Tattoo",
			ability: "Intelligence",
			action: "Press your palm against the design",
			action_type: "Press your palm against the design",
			attack: {
				type: "acid",
				damage: "0",
				damage_type: "",
				mode: "self",
				modifier: "",
				resolution: "automatic",
			},
			condition: "Blindness",
			damage_profile: "N/A (utility/defensive)",
			duration: "Permanent (passive)",
			frequency: "1/long rest",
			lattice_interaction:
				"Doppelganger Tissue resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies throat tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			saving_throw: { ability: "", dc: 0, failure: "", success: "" },
			special_abilities: [
				"Inscription requires: Doppelganger Tissue, DC 19 tattooing check, 4 hours of uninterrupted work",
			],
			stat_bonuses: {},
		},
		resonance_effect: "Synergizes with other physical bodily enchantments.",
	},
	{
		id: "tattoo_16",
		name: "Ogre's Vigor",
		display_name: "Ogre's Vigor",
		source_book: "Rift Ascendant Canon",
		description:
			"Instantly doubles muscle density for a short time. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain Rift beasts.",
		rarity: "rare",
		image: "/generated/effects/darkness-shroud.webp",
		effects: {
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Channel mana through the ink circuits to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			passive: ["Gain resistance to fire damage."],
			passiveBonuses: [{ value: 1, stat: "fire aura" }],
			primary: "Gain resistance to fire damage.",
			primaryEffect: "Gain resistance to fire damage.",
			secondary:
				"You ignore the first instance of this damage type each combat.",
			secondaryEffect: "",
			tertiary:
				"Overcharge: Once per long rest, double the primary effect for 1 round.",
		},
		attunement: true,
		lore: {
			current_owner: "Common at Guild-authorized dermal-mod clinics.",
			curse:
				"Prolonged wielders report hearing a second heartbeat that doesn't match their own.",
			history:
				"Tracked through the Guild Bureau's compliance schedule. The Ogre's Vigor carried the story forward.",
			origin:
				"Formulated within the Guild's authorized dermal-mod program. Bureau provenance files log it as the Ogre's Vigor.",
			personality: "Quiet between activations.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Corrodes the threshold of human potential. A beautiful catastrophe measured in milliseconds.",
		discovery_lore:
			"Found in a hidden compartment of a relic weapon that had been in Guild storage for years.",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		active_veins: ["Biceps"],
		body_part: "Biceps",
		ink_type: "Ogre Boss Blood",
		limitations: {
			requires_attunement: true,
			charges: 0,
			conditions: [
				"Requires tattoo attunement slot (biceps)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 2500,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			recharge: "Short rest",
			uses: "Passive + 1 active/short rest",
			uses_per_rest: 2,
		},
		mechanics: {
			type: "Tattoo",
			ability: "Intelligence",
			action: "Channel mana through the ink circuits",
			action_type: "Channel mana through the ink circuits",
			attack: {
				type: "fire",
				damage: "0",
				damage_type: "",
				mode: "self",
				modifier: "",
				resolution: "automatic",
			},
			condition: "Stunning",
			damage_profile: "utility",
			duration: "1 minute",
			frequency: "1/long rest",
			lattice_interaction:
				"Ogre Boss Blood resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies biceps tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			saving_throw: { ability: "", dc: 0, failure: "", success: "" },
			special_abilities: [
				"Inscription requires: Ogre Boss Blood, DC 18 tattooing check, 4 hours of uninterrupted work",
			],
			stat_bonuses: {},
		},
		resonance_effect: "Synergizes with other physical bodily enchantments.",
	},
	{
		id: "tattoo_17",
		name: "Shadow-Shift Sigils",
		display_name: "Shadow-Shift Sigils",
		source_book: "Rift Ascendant Canon",
		description:
			"Temporarily turn flesh into incorporeal shadows. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain Rift beasts.",
		rarity: "rare",
		image: "/generated/effects/arcane-sigil.webp",
		effects: {
			active: [
				{
					name: "Tattoo Activation",
					description: "Speak the tattoo's true name to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			passive: [
				"Deal 1d6 necrotic damage to creatures that hit you with melee attacks.",
			],
			passiveBonuses: [{ value: 1, stat: "necrotic aura" }],
			primary:
				"Deal 1d6 necrotic damage to creatures that hit you with melee attacks.",
			primaryEffect:
				"Deal 1d6 necrotic damage to creatures that hit you with melee attacks.",
			secondary: "Allies within 5 feet gain +1 to saving throws.",
			secondaryEffect: "",
			tertiary:
				"Resonance: When multiple tattoos are active, gain +1 AC per active tattoo.",
		},
		attunement: true,
		lore: {
			current_owner:
				"Widely issued to qualifying Ascendants through Bureau studios.",
			curse: "",
			history:
				"Subject to Bureau augmentation oversight and annual review. The Shadow-Shift Sigils's service record notes as much.",
			origin:
				"Developed by Bureau-licensed alchemical tattooists for field Ascendants. The Shadow-Shift Sigils entered service from there.",
			personality: "Neutral in personality profile.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Eclipses the illusion of safety. A beautiful catastrophe measured in milliseconds.",
		discovery_lore:
			"Purchased from a black-market auction in the underground district of Meridian City for an undisclosed sum.",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		active_veins: ["Shoulders"],
		body_part: "Shoulders",
		ink_type: "Wraith Ectoplasm",
		limitations: {
			requires_attunement: true,
			charges: 0,
			conditions: [
				"Requires tattoo attunement slot (shoulders)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 2500,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			recharge: "Short rest",
			uses: "Proficiency/long rest",
			uses_per_rest: 3,
		},
		mechanics: {
			type: "Tattoo",
			ability: "Presence",
			action: "Speak the tattoo's true name",
			action_type: "Speak the tattoo's true name",
			attack: {
				type: "necrotic",
				damage: "0",
				damage_type: "",
				mode: "self",
				modifier: "",
				resolution: "automatic",
			},
			condition: "Lethargy",
			damage_profile: "utility",
			duration: "Permanent (passive)",
			frequency: "2/short rest",
			lattice_interaction:
				"Wraith Ectoplasm resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies shoulders tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			saving_throw: { ability: "", dc: 0, failure: "", success: "" },
			special_abilities: [
				"Inscription requires: Wraith Ectoplasm, DC 12 tattooing check, 4 hours of uninterrupted work",
			],
			stat_bonuses: {},
		},
		resonance_effect: "Synergizes with other physical bodily enchantments.",
	},
	{
		id: "tattoo_18",
		name: "Chameleon Epidermis",
		display_name: "Chameleon Epidermis",
		source_book: "Rift Ascendant Canon",
		description:
			"Blends perfectly into the environment using light-bending magic. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain Rift beasts.",
		rarity: "rare",
		image: "/generated/effects/arcane-sigil.webp",
		effects: {
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Flex the tattooed muscle group to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			passive: ["Your movement speed increases by 10 feet."],
			passiveBonuses: [{ value: 1, stat: "thunder aura" }],
			primary: "Your movement speed increases by 10 feet.",
			primaryEffect: "Your movement speed increases by 10 feet.",
			secondary:
				"Your unarmed strikes deal an additional 1d4 of the tattoo's element.",
			secondaryEffect: "",
			tertiary:
				"Resonance: When multiple tattoos are active, gain +1 AC per active tattoo.",
		},
		attunement: true,
		lore: {
			current_owner:
				"Widely issued to qualifying Ascendants through Bureau studios.",
			curse: "",
			history:
				"Subject to Bureau augmentation oversight and annual review. That much survives in the Chameleon Epidermis's field history.",
			origin:
				"Developed by Bureau-licensed alchemical tattooists for field Ascendants. Archived under the Chameleon Epidermis designation.",
			personality: "Neutral in personality profile.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Reclaims the illusion of safety. A testament to what Ascendants have become.",
		discovery_lore:
			"Discovered by an E-Rank Ascendant who stumbled into an unmarked side passage during a routine Rift clear. The recovery slip named it the Chameleon Epidermis.",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		active_veins: ["Full Back"],
		body_part: "Full Back",
		ink_type: "Mimic Ichor",
		limitations: {
			requires_attunement: true,
			charges: 0,
			conditions: [
				"Requires tattoo attunement slot (full back)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 250,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			recharge: "Short rest",
			uses: "Proficiency/long rest",
			uses_per_rest: 3,
		},
		mechanics: {
			type: "Tattoo",
			ability: "Intelligence",
			action: "Flex the tattooed muscle group",
			action_type: "Flex the tattooed muscle group",
			attack: {
				type: "thunder",
				damage: "0",
				damage_type: "",
				mode: "self",
				modifier: "",
				resolution: "automatic",
			},
			condition: "Lethargy",
			damage_profile: "N/A (utility/defensive)",
			duration: "1 minute",
			frequency: "Passive",
			lattice_interaction:
				"Mimic Ichor resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies full back tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			saving_throw: { ability: "", dc: 0, failure: "", success: "" },
			special_abilities: [
				"Inscription requires: Mimic Ichor, DC 14 tattooing check, 4 hours of uninterrupted work",
			],
			stat_bonuses: {},
		},
		resonance_effect: "Synergizes with other physical bodily enchantments.",
	},
	{
		id: "tattoo_19",
		name: "Abyssal Lungs",
		display_name: "Abyssal Lungs",
		source_book: "Rift Ascendant Canon",
		description:
			"Extracts oxygen from water and poison gas. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain Rift beasts.",
		rarity: "rare",
		image: "/generated/effects/darkness-shroud.webp",
		effects: {
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Flex the tattooed muscle group to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			passive: ["You can see in magical darkness out to 60 feet."],
			passiveBonuses: [{ value: 1, stat: "cold aura" }],
			primary: "You can see in magical darkness out to 60 feet.",
			primaryEffect: "You can see in magical darkness out to 60 feet.",
			secondary: "Allies within 5 feet gain +1 to saving throws.",
			secondaryEffect: "",
			tertiary:
				"Overcharge: Once per long rest, double the primary effect for 1 round.",
		},
		attunement: true,
		lore: {
			current_owner:
				"Available through the Bureau's open augmentation catalog.",
			curse: "",
			history:
				"Covered by the standard Guild Bureau compliance agreement. The Abyssal Lungs's service record notes as much.",
			origin:
				"Applied under the Guild Bureau's dermal-weave protocol. The Abyssal Lungs entered service from there.",
			personality: "Disciplined in its at-rest state.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Binds the silence between heartbeats. Evolution compressed into a single, violent instant.",
		discovery_lore:
			"Found washed ashore near a coastal Rift, wrapped in fabric that dissolved upon touch.",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		active_veins: ["Neck"],
		body_part: "Neck",
		ink_type: "Kraken Ink",
		limitations: {
			requires_attunement: true,
			charges: 0,
			conditions: [
				"Requires tattoo attunement slot (neck)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 100,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			recharge: "Short rest",
			uses: "Proficiency/long rest",
			uses_per_rest: 2,
		},
		mechanics: {
			type: "Tattoo",
			ability: "Intelligence",
			action: "Flex the tattooed muscle group",
			action_type: "Flex the tattooed muscle group",
			attack: {
				type: "cold",
				damage: "0",
				damage_type: "",
				mode: "self",
				modifier: "",
				resolution: "automatic",
			},
			condition: "Paralysis",
			damage_profile: "N/A (utility/defensive)",
			duration: "1 minute",
			frequency: "2/short rest",
			lattice_interaction:
				"Kraken Ink resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies neck tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			saving_throw: { ability: "", dc: 0, failure: "", success: "" },
			special_abilities: [
				"Inscription requires: Kraken Ink, DC 20 tattooing check, 4 hours of uninterrupted work",
			],
			stat_bonuses: {},
		},
		resonance_effect: "Synergizes with other physical bodily enchantments.",
	},
	{
		id: "tattoo_20",
		name: "Mana-Sever Pulse",
		display_name: "Mana-Sever Pulse",
		source_book: "Rift Ascendant Canon",
		description:
			"Shut down unshielded magic circles in the immediate vicinity. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain Rift beasts.",
		rarity: "rare",
		image: "/generated/effects/arcane-sigil.webp",
		effects: {
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Press your palm against the design to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			passive: ["Gain +2 to Sense while the tattoo is active."],
			passiveBonuses: [{ value: 1, stat: "necrotic aura" }],
			primary: "Gain +2 to Sense while the tattoo is active.",
			primaryEffect: "Gain +2 to Sense while the tattoo is active.",
			secondary:
				"The ink glows faintly, granting advantage on Intimidation checks.",
			secondaryEffect: "",
			tertiary:
				"Emergency Pulse: When reduced to 0 HP, the tattoo activates automatically (1/long rest).",
		},
		attunement: true,
		lore: {
			current_owner: "A standard augmentation offering at licensed studios.",
			curse: "",
			history:
				"Reviewed periodically under the Ascendant augmentation license. The Mana-Sever Pulse carried the story forward.",
			origin:
				"Produced in compliance with Ascendant Bureau augmentation standards. Archived under the Mana-Sever Pulse designation.",
			personality: "Inert until intentionally engaged.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Warps the architect's design. The breaking point of all resistance.",
		discovery_lore:
			"Excavated from the crystallized mana deposit at the center of a depleted Rift core. Intake tagged it the Mana-Sever Pulse.",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		active_veins: ["Chest"],
		body_part: "Chest",
		ink_type: "Thunderbird Spark",
		limitations: {
			requires_attunement: true,
			charges: 0,
			conditions: [
				"Requires tattoo attunement slot (chest)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 5000,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			recharge: "Dawn",
			uses: "Passive + 1 active/short rest",
			uses_per_rest: 1,
		},
		mechanics: {
			type: "Tattoo",
			ability: "Intelligence",
			action: "Press your palm against the design",
			action_type: "Press your palm against the design",
			attack: {
				type: "self",
				damage: "0",
				damage_type: "",
				mode: "self",
				modifier: "",
				resolution: "automatic",
			},
			condition: "Stunning",
			damage_profile: "N/A (utility/defensive)",
			duration: "1 minute",
			frequency: "1/long rest",
			lattice_interaction:
				"Thunderbird Spark resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies chest tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			saving_throw: { ability: "", dc: 0, failure: "", success: "" },
			special_abilities: [
				"Inscription requires: Thunderbird Spark, DC 21 tattooing check, 4 hours of uninterrupted work",
			],
			stat_bonuses: {},
		},
		resonance_effect: "Synergizes with other physical bodily enchantments.",
	},
	{
		id: "tattoo_21",
		name: "Spatial Anchor",
		display_name: "Spatial Anchor",
		source_book: "Rift Ascendant Canon",
		description:
			"Prevents being forcibly teleported or banished. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain Rift beasts.",
		rarity: "rare",
		image: "/generated/effects/arcane-sigil.webp",
		effects: {
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Initiated via the bearer's conditioned trigger state. to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			passive: ["You can see in magical darkness out to 60 feet."],
			passiveBonuses: [{ value: 1, stat: "thunder aura" }],
			primary: "You can see in magical darkness out to 60 feet.",
			primaryEffect: "You can see in magical darkness out to 60 feet.",
			secondary:
				"You ignore the first instance of this damage type each combat.",
			secondaryEffect: "",
			tertiary:
				"Emergency Pulse: When reduced to 0 HP, the tattoo activates automatically (1/long rest).",
		},
		attunement: true,
		lore: {
			current_owner:
				"Available through the Bureau's open augmentation catalog.",
			curse: "",
			history:
				"Covered by the standard Guild Bureau compliance agreement. The Spatial Anchor's service record notes as much.",
			origin:
				"Applied under the Guild Bureau's dermal-weave protocol. The Spatial Anchor entered service from there.",
			personality: "Disciplined in its at-rest state.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Crushes the architecture of the soul. Evolution compressed into a single, violent instant.",
		discovery_lore:
			"Dropped by a mini-boss that shouldn't have existed according to the Rift's difficulty rating. Intake tagged it the Spatial Anchor.",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		active_veins: ["Feet"],
		body_part: "Feet",
		ink_type: "Void Rift Dust",
		limitations: {
			requires_attunement: true,
			charges: 0,
			conditions: [
				"Requires tattoo attunement slot (feet)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 250,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			recharge: "Long rest",
			uses: "Passive only",
			uses_per_rest: 1,
		},
		mechanics: {
			type: "Tattoo",
			ability: "Intelligence",
			action: "Initiated via the bearer's conditioned trigger state.",
			action_type: "Initiated via the bearer's conditioned trigger state.",
			attack: {
				type: "thunder",
				damage: "0",
				damage_type: "",
				mode: "self",
				modifier: "",
				resolution: "automatic",
			},
			condition: "Blindness",
			damage_profile: "utility",
			duration: "1 hour",
			frequency: "2/short rest",
			lattice_interaction:
				"Void Rift Dust resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies feet tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			saving_throw: { ability: "", dc: 0, failure: "", success: "" },
			special_abilities: [
				"Inscription requires: Void Rift Dust, DC 18 tattooing check, 4 hours of uninterrupted work",
			],
			stat_bonuses: {},
		},
		resonance_effect: "Synergizes with other physical bodily enchantments.",
	},
	{
		id: "tattoo_22",
		name: "Harpy's Grace",
		display_name: "Harpy's Grace",
		source_book: "Rift Ascendant Canon",
		description:
			"Reduces bodily weight to allow slow falling and massive jumps. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain Rift beasts.",
		rarity: "rare",
		image: "/generated/effects/arcane-sigil.webp",
		effects: {
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Engaged by a deliberate focal gesture on the tattoo. to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			passive: ["Gain resistance to radiant damage."],
			passiveBonuses: [{ value: 1, stat: "radiant aura" }],
			primary: "Gain resistance to radiant damage.",
			primaryEffect: "Gain resistance to radiant damage.",
			secondary:
				"The ink glows faintly, granting advantage on Intimidation checks.",
			secondaryEffect: "",
			tertiary:
				"Resonance: When multiple tattoos are active, gain +1 AC per active tattoo.",
		},
		attunement: true,
		lore: {
			current_owner: "Common at Guild-authorized dermal-mod clinics.",
			curse: "",
			history:
				"Tracked through the Guild Bureau's compliance schedule. The Harpy's Grace's service record notes as much.",
			origin:
				"Formulated within the Guild's authorized dermal-mod program. The Harpy's Grace entered service from there.",
			personality: "Quiet between activations.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Inverts the boundary between life and death. Evolution compressed into a single, violent instant.",
		discovery_lore:
			"Excavated from the crystallized mana deposit at the center of a depleted Rift core. The recovery slip named it the Harpy's Grace.",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		active_veins: ["Collarbone"],
		body_part: "Collarbone",
		ink_type: "Harpy Queen Marrow",
		limitations: {
			requires_attunement: true,
			charges: 0,
			conditions: [
				"Requires tattoo attunement slot (collarbone)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 1000,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			recharge: "Short rest",
			uses: "Passive + 1 active/short rest",
			uses_per_rest: 2,
		},
		mechanics: {
			type: "Tattoo",
			ability: "Presence",
			action: "Engaged by a deliberate focal gesture on the tattoo.",
			action_type: "Engaged by a deliberate focal gesture on the tattoo.",
			attack: {
				type: "radiant",
				damage: "0",
				damage_type: "",
				mode: "self",
				modifier: "",
				resolution: "automatic",
			},
			condition: "Paralysis",
			damage_profile: "N/A (utility/defensive)",
			duration: "10 minutes",
			frequency: "Passive",
			lattice_interaction:
				"Harpy Queen Marrow resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies collarbone tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			saving_throw: { ability: "", dc: 0, failure: "", success: "" },
			special_abilities: [
				"Inscription requires: Harpy Queen Marrow, DC 15 tattooing check, 4 hours of uninterrupted work",
			],
			stat_bonuses: {},
		},
		resonance_effect: "Synergizes with other physical bodily enchantments.",
	},
	{
		id: "tattoo_23",
		name: "Rebound Ward",
		display_name: "Rebound Ward",
		source_book: "Rift Ascendant Canon",
		description:
			"Explodes outward with force magic when hit by melee attacks. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain Rift beasts.",
		rarity: "rare",
		image: "/generated/effects/darkness-shroud.webp",
		effects: {
			active: [
				{
					name: "Tattoo Activation",
					description: "Speak the tattoo's true name to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			passive: [
				"Deal 1d6 acid damage to creatures that hit you with melee attacks.",
			],
			passiveBonuses: [{ value: 1, stat: "acid aura" }],
			primary:
				"Deal 1d6 acid damage to creatures that hit you with melee attacks.",
			primaryEffect:
				"Deal 1d6 acid damage to creatures that hit you with melee attacks.",
			secondary:
				"The ink glows faintly, granting advantage on Intimidation checks.",
			secondaryEffect: "",
			tertiary:
				"Overcharge: Once per long rest, double the primary effect for 1 round.",
		},
		attunement: true,
		lore: {
			current_owner: "Applied routinely to qualifying field operatives.",
			curse: "",
			history:
				"Logged in the Bureau's ongoing dermal-mod registry. That much survives in the Rebound Ward's field history.",
			origin:
				"Inked by Bureau-credentialed studio practitioners. Bureau provenance files log it as the Rebound Ward.",
			personality: "Unobtrusive while not being used.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Ignites the laws of physics. The death of hesitation, made manifest.",
		discovery_lore:
			"Emerged from a Rift Boss's dissolution cloud, hovering where the creature's heart had been. The recovery slip named it the Rebound Ward.",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		active_veins: ["Shoulders"],
		body_part: "Shoulders",
		ink_type: "Blast-Jelly",
		limitations: {
			requires_attunement: true,
			charges: 0,
			conditions: [
				"Requires tattoo attunement slot (shoulders)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 250,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			recharge: "Dawn",
			uses: "2/short rest",
			uses_per_rest: 2,
		},
		mechanics: {
			type: "Tattoo",
			ability: "Vitality",
			action: "Speak the tattoo's true name",
			action_type: "Speak the tattoo's true name",
			attack: {
				type: "acid",
				damage: "0",
				damage_type: "",
				mode: "self",
				modifier: "",
				resolution: "automatic",
			},
			condition: "Paralysis",
			damage_profile: "N/A (utility/defensive)",
			duration: "1 hour",
			frequency: "Proficiency/long rest",
			lattice_interaction:
				"Blast-Jelly resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies shoulders tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			saving_throw: { ability: "", dc: 0, failure: "", success: "" },
			special_abilities: [
				"Inscription requires: Blast-Jelly, DC 16 tattooing check, 4 hours of uninterrupted work",
			],
			stat_bonuses: {},
		},
		resonance_effect: "Synergizes with other physical bodily enchantments.",
	},
	{
		id: "tattoo_24",
		name: "Anomaly's Breath",
		display_name: "Anomaly's Breath",
		source_book: "Rift Ascendant Canon",
		description:
			"Breathe out a cloud of choking, magical exhaust. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain Rift beasts.",
		rarity: "rare",
		image: "/generated/effects/arcane-sigil.webp",
		effects: {
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Channel mana through the ink circuits to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			passive: [
				"Deal 1d6 psychic damage to creatures that hit you with melee attacks.",
			],
			passiveBonuses: [{ value: 1, stat: "psychic aura" }],
			primary:
				"Deal 1d6 psychic damage to creatures that hit you with melee attacks.",
			primaryEffect:
				"Deal 1d6 psychic damage to creatures that hit you with melee attacks.",
			secondary:
				"The ink glows faintly, granting advantage on Intimidation checks.",
			secondaryEffect: "",
			tertiary:
				"Emergency Pulse: When reduced to 0 HP, the tattoo activates automatically (1/long rest).",
		},
		attunement: true,
		lore: {
			current_owner:
				"Available through the Bureau's open augmentation catalog.",
			curse: "",
			history:
				"Covered by the standard Guild Bureau compliance agreement. The Anomaly's Breath's service record notes as much.",
			origin:
				"Applied under the Guild Bureau's dermal-weave protocol. The Anomaly's Breath entered service from there.",
			personality: "Disciplined in its at-rest state.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Reclaims the laws of physics. Proof that some things cannot be survived.",
		discovery_lore:
			"Materialized on an Ascendant's workbench overnight, leaving scorch marks in the shape of unknown glyphs. The recovery slip named it the Anomaly's Breath.",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		active_veins: ["Lungs"],
		body_part: "Lungs",
		ink_type: "Green anomaly Bile",
		limitations: {
			requires_attunement: true,
			charges: 0,
			conditions: [
				"Requires tattoo attunement slot (lungs)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 1000,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			recharge: "Long rest",
			uses: "Proficiency/long rest",
			uses_per_rest: 1,
		},
		mechanics: {
			type: "Tattoo",
			ability: "Intelligence",
			action: "Channel mana through the ink circuits",
			action_type: "Channel mana through the ink circuits",
			attack: {
				type: "psychic",
				damage: "0",
				damage_type: "",
				mode: "self",
				modifier: "",
				resolution: "automatic",
			},
			condition: "Stunning",
			damage_profile: "N/A (utility/defensive)",
			duration: "10 minutes",
			frequency: "2/short rest",
			lattice_interaction:
				"Green anomaly Bile resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies lungs tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			saving_throw: { ability: "", dc: 0, failure: "", success: "" },
			special_abilities: [
				"Inscription requires: Green anomaly Bile, DC 12 tattooing check, 4 hours of uninterrupted work",
			],
			stat_bonuses: {},
		},
		resonance_effect: "Synergizes with other physical bodily enchantments.",
	},
	{
		id: "tattoo_25",
		name: "Chrono-Stutter",
		display_name: "Chrono-Stutter",
		source_book: "Rift Ascendant Canon",
		description:
			"Allows a brief rewind in time. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain Rift beasts.",
		rarity: "rare",
		image: "/generated/effects/darkness-shroud.webp",
		effects: {
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Flex the tattooed muscle group to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			passive: ["Gain resistance to acid damage."],
			passiveBonuses: [{ value: 1, stat: "acid aura" }],
			primary: "Gain resistance to acid damage.",
			primaryEffect: "Gain resistance to acid damage.",
			secondary:
				"The ink glows faintly, granting advantage on Intimidation checks.",
			secondaryEffect: "",
			tertiary:
				"Emergency Pulse: When reduced to 0 HP, the tattoo activates automatically (1/long rest).",
		},
		attunement: true,
		lore: {
			current_owner:
				"Widely issued to qualifying Ascendants through Bureau studios.",
			curse: "",
			history:
				"Subject to Bureau augmentation oversight and annual review. The Chrono-Stutter's service record notes as much.",
			origin:
				"Developed by Bureau-licensed alchemical tattooists for field Ascendants. Archived under the Chrono-Stutter designation.",
			personality: "Neutral in personality profile.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Corrodes the fabric of reality. The last thing many anomalies ever see.",
		discovery_lore:
			"Found pulsing with residual mana in the aftermath of a Rift Break, half-buried in shattered concrete. Intake tagged it the Chrono-Stutter.",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		active_veins: ["Temple"],
		body_part: "Temple",
		ink_type: "Time-Weaver Sand",
		limitations: {
			requires_attunement: true,
			charges: 0,
			conditions: [
				"Requires tattoo attunement slot (temple)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 100,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			recharge: "Dawn",
			uses: "Passive + 1 active/short rest",
			uses_per_rest: 1,
		},
		mechanics: {
			type: "Tattoo",
			ability: "Intelligence",
			action: "Flex the tattooed muscle group",
			action_type: "Flex the tattooed muscle group",
			attack: {
				type: "acid",
				damage: "0",
				damage_type: "",
				mode: "self",
				modifier: "",
				resolution: "automatic",
			},
			condition: "Paralysis",
			damage_profile: "utility",
			duration: "1 minute",
			frequency: "Passive",
			lattice_interaction:
				"Time-Weaver Sand resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies temple tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			saving_throw: { ability: "", dc: 0, failure: "", success: "" },
			special_abilities: [
				"Inscription requires: Time-Weaver Sand, DC 14 tattooing check, 4 hours of uninterrupted work",
			],
			stat_bonuses: {},
		},
		resonance_effect: "Synergizes with other physical bodily enchantments.",
	},
	{
		id: "tattoo_26",
		name: "Presence Concealment",
		display_name: "Presence Concealment",
		source_book: "Rift Ascendant Canon",
		description:
			"Hides your Awakened aura completely. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain Rift beasts.",
		rarity: "rare",
		image: "/generated/effects/darkness-shroud.webp",
		effects: {
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Press your palm against the design to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			passive: ["Gain +2 to Strength while the tattoo is active."],
			passiveBonuses: [{ value: 1, stat: "poison aura" }],
			primary: "Gain +2 to Strength while the tattoo is active.",
			primaryEffect: "Gain +2 to Strength while the tattoo is active.",
			secondary:
				"The ink glows faintly, granting advantage on Intimidation checks.",
			secondaryEffect: "",
			tertiary:
				"Emergency Pulse: When reduced to 0 HP, the tattoo activates automatically (1/long rest).",
		},
		attunement: true,
		lore: {
			current_owner: "Common at Guild-authorized dermal-mod clinics.",
			curse: "",
			history:
				"Tracked through the Guild Bureau's compliance schedule. The Presence Concealment carried the story forward.",
			origin:
				"Formulated within the Guild's authorized dermal-mod program. Bureau provenance files log it as the Presence Concealment.",
			personality: "Quiet between activations.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Rends the flow of causality. The breaking point of all resistance.",
		discovery_lore:
			"Dropped by a mini-boss that shouldn't have existed according to the Rift's difficulty rating. The recovery slip named it the Presence Concealment.",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		active_veins: ["Heart"],
		body_part: "Heart",
		ink_type: "Umbral Anomaly Essence",
		limitations: {
			requires_attunement: true,
			charges: 0,
			conditions: [
				"Requires tattoo attunement slot (heart)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 100,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			recharge: "Long rest",
			uses: "Proficiency/long rest",
			uses_per_rest: 2,
		},
		mechanics: {
			type: "Tattoo",
			ability: "Presence",
			action: "Press your palm against the design",
			action_type: "Press your palm against the design",
			attack: {
				type: "poison",
				damage: "0",
				damage_type: "",
				mode: "self",
				modifier: "",
				resolution: "automatic",
			},
			condition: "Blindness",
			damage_profile: "utility",
			duration: "10 minutes",
			frequency: "1/short rest",
			lattice_interaction:
				"Umbral Anomaly Essence resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies heart tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			saving_throw: { ability: "", dc: 0, failure: "", success: "" },
			special_abilities: [
				"Inscription requires: Umbral Anomaly Essence, DC 12 tattooing check, 4 hours of uninterrupted work",
			],
			stat_bonuses: {},
		},
		resonance_effect: "Synergizes with other physical bodily enchantments.",
	},
	{
		id: "tattoo_27",
		name: "Mind-Fortress",
		display_name: "Mind-Fortress",
		source_book: "Rift Ascendant Canon",
		description:
			"Reflects mental intrusions and charm magic. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain Rift beasts.",
		rarity: "rare",
		image: "/generated/effects/arcane-sigil.webp",
		effects: {
			active: [
				{
					name: "Tattoo Activation",
					description: "Speak the tattoo's true name to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			passive: ["Gain +2 to Vitality while the tattoo is active."],
			passiveBonuses: [{ value: 1, stat: "force aura" }],
			primary: "Gain +2 to Vitality while the tattoo is active.",
			primaryEffect: "Gain +2 to Vitality while the tattoo is active.",
			secondary:
				"Your unarmed strikes deal an additional 1d4 of the tattoo's element.",
			secondaryEffect: "",
			tertiary:
				"Overcharge: Once per long rest, double the primary effect for 1 round.",
		},
		attunement: true,
		lore: {
			current_owner: "A standard augmentation offering at licensed studios.",
			curse: "",
			history:
				"Reviewed periodically under the Ascendant augmentation license. The Mind-Fortress carried the story forward.",
			origin:
				"Produced in compliance with Ascendant Bureau augmentation standards. The Mind-Fortress entered service from there.",
			personality: "Inert until intentionally engaged.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Silences the last defense of the unprepared. Evolution compressed into a single, violent instant.",
		discovery_lore:
			"Traded by a nomadic Awakened who claimed to have no memory of acquiring it. Logged on arrival as the Mind-Fortress.",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		active_veins: ["Forehead"],
		body_part: "Forehead",
		ink_type: "Mind-Eater Fluid",
		limitations: {
			requires_attunement: true,
			charges: 0,
			conditions: [
				"Requires tattoo attunement slot (forehead)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 100,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			recharge: "Dawn",
			uses: "Passive only",
			uses_per_rest: 3,
		},
		mechanics: {
			type: "Tattoo",
			ability: "Presence",
			action: "Speak the tattoo's true name",
			action_type: "Speak the tattoo's true name",
			attack: {
				type: "self",
				damage: "0",
				damage_type: "",
				mode: "self",
				modifier: "",
				resolution: "automatic",
			},
			condition: "Fear",
			damage_profile: "utility",
			duration: "Permanent (passive)",
			frequency: "1/short rest",
			lattice_interaction:
				"Mind-Eater Fluid resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies forehead tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			saving_throw: { ability: "", dc: 0, failure: "", success: "" },
			special_abilities: [
				"Inscription requires: Mind-Eater Fluid, DC 21 tattooing check, 4 hours of uninterrupted work",
			],
			stat_bonuses: {},
		},
		resonance_effect: "Synergizes with other physical bodily enchantments.",
	},
	{
		id: "tattoo_28",
		name: "Manticore Spurs",
		display_name: "Manticore Spurs",
		source_book: "Rift Ascendant Canon",
		description:
			"Extrudes poisoned bone spurs from the wrists. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain Rift beasts.",
		rarity: "very_rare",
		image: "/generated/effects/arcane-sigil.webp",
		effects: {
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Flex the tattooed muscle group to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			passive: ["You can see in magical darkness out to 60 feet."],
			passiveBonuses: [{ value: 1, stat: "necrotic aura" }],
			primary: "You can see in magical darkness out to 60 feet.",
			primaryEffect: "You can see in magical darkness out to 60 feet.",
			secondary: "Allies within 5 feet gain +1 to saving throws.",
			secondaryEffect: "",
			tertiary:
				"Overcharge: Once per long rest, double the primary effect for 1 round.",
		},
		attunement: true,
		lore: {
			current_owner:
				"Available through the Bureau's open augmentation catalog.",
			curse: "",
			history:
				"Covered by the standard Guild Bureau compliance agreement. The Manticore Spurs's service record notes as much.",
			origin:
				"Applied under the Guild Bureau's dermal-weave protocol. The Manticore Spurs entered service from there.",
			personality: "Disciplined in its at-rest state.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Dissolves the remnants of a dead world. The death of hesitation, made manifest.",
		discovery_lore:
			"Found pulsing with residual mana in the aftermath of a Rift Break, half-buried in shattered concrete. Intake tagged it the Manticore Spurs.",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		active_veins: ["Wrists"],
		body_part: "Wrists",
		ink_type: "Manticore Venom",
		limitations: {
			requires_attunement: true,
			charges: 0,
			conditions: [
				"Requires tattoo attunement slot (wrists)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 500,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			recharge: "Dawn",
			uses: "Passive + 1 active/short rest",
			uses_per_rest: 2,
		},
		mechanics: {
			type: "Tattoo",
			ability: "Presence",
			action: "Flex the tattooed muscle group",
			action_type: "Flex the tattooed muscle group",
			attack: {
				type: "necrotic",
				damage: "0",
				damage_type: "",
				mode: "self",
				modifier: "",
				resolution: "automatic",
			},
			condition: "Stunning",
			damage_profile: "utility",
			duration: "Permanent (passive)",
			frequency: "1/short rest",
			lattice_interaction:
				"Manticore Venom resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies wrists tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			saving_throw: { ability: "", dc: 0, failure: "", success: "" },
			special_abilities: [
				"Inscription requires: Manticore Venom, DC 14 tattooing check, 4 hours of uninterrupted work",
			],
			stat_bonuses: {},
		},
		resonance_effect: "Synergizes with other physical bodily enchantments.",
	},
	{
		id: "tattoo_29",
		name: "Levitation Repulse",
		display_name: "Levitation Repulse",
		source_book: "Rift Ascendant Canon",
		description:
			"Creates an area where targets are pushed away and float slightly. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain Rift beasts.",
		rarity: "very_rare",
		image: "/generated/effects/arcane-sigil.webp",
		effects: {
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Flex the tattooed muscle group to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			passive: ["Gain +2 to Intelligence while the tattoo is active."],
			passiveBonuses: [{ value: 1, stat: "force aura" }],
			primary: "Gain +2 to Intelligence while the tattoo is active.",
			primaryEffect: "Gain +2 to Intelligence while the tattoo is active.",
			secondary:
				"You ignore the first instance of this damage type each combat.",
			secondaryEffect: "",
			tertiary:
				"Overcharge: Once per long rest, double the primary effect for 1 round.",
		},
		attunement: true,
		lore: {
			current_owner:
				"Widely issued to qualifying Ascendants through Bureau studios.",
			curse: "",
			history:
				"Subject to Bureau augmentation oversight and annual review. The Levitation Repulse carried the story forward.",
			origin:
				"Developed by Bureau-licensed alchemical tattooists for field Ascendants. Archived under the Levitation Repulse designation.",
			personality: "Neutral in personality profile.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Shatters the remnants of a dead world. A testament to what Ascendants have become.",
		discovery_lore:
			"Excavated from the crystallized mana deposit at the center of a depleted Rift core. Logged on arrival as the Levitation Repulse.",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		active_veins: ["Palms"],
		body_part: "Palms",
		ink_type: "Beholder-Class Eye Dust",
		limitations: {
			requires_attunement: true,
			charges: 0,
			conditions: [
				"Requires tattoo attunement slot (palms)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 1000,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			recharge: "Dawn",
			uses: "2/short rest",
			uses_per_rest: 3,
		},
		mechanics: {
			type: "Tattoo",
			ability: "Intelligence",
			action: "Flex the tattooed muscle group",
			action_type: "Flex the tattooed muscle group",
			attack: {
				type: "force",
				damage: "0",
				damage_type: "",
				mode: "self",
				modifier: "",
				resolution: "automatic",
			},
			condition: "Fear",
			damage_profile: "N/A (utility/defensive)",
			duration: "1 hour",
			frequency: "1/long rest",
			lattice_interaction:
				"Beholder-Class Eye Dust resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies palms tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			saving_throw: { ability: "", dc: 0, failure: "", success: "" },
			special_abilities: [
				"Inscription requires: Beholder-Class Eye Dust, DC 11 tattooing check, 4 hours of uninterrupted work",
			],
			stat_bonuses: {},
		},
		resonance_effect: "Synergizes with other physical bodily enchantments.",
	},
	{
		id: "tattoo_30",
		name: "Troll's Regeneration",
		display_name: "Troll's Regeneration",
		source_book: "Rift Ascendant Canon",
		description:
			"Accelerates healing to close grievous wounds mid-combat. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain Rift beasts.",
		rarity: "very_rare",
		image: "/generated/effects/darkness-shroud.webp",
		effects: {
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Flex the tattooed muscle group to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			passive: ["Gain +2 to Sense while the tattoo is active."],
			passiveBonuses: [{ value: 1, stat: "acid aura" }],
			primary: "Gain +2 to Sense while the tattoo is active.",
			primaryEffect: "Gain +2 to Sense while the tattoo is active.",
			secondary:
				"You ignore the first instance of this damage type each combat.",
			secondaryEffect: "",
			tertiary:
				"Emergency Pulse: When reduced to 0 HP, the tattoo activates automatically (1/long rest).",
		},
		attunement: true,
		lore: {
			current_owner: "Common at Guild-authorized dermal-mod clinics.",
			curse: "",
			history:
				"Tracked through the Guild Bureau's compliance schedule. The Troll's Regeneration carried the story forward.",
			origin:
				"Formulated within the Guild's authorized dermal-mod program. Bureau provenance files log it as the Troll's Regeneration.",
			personality: "Quiet between activations.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Rends the laws of physics. The line between Ascendant and anomaly.",
		discovery_lore:
			"Entered into the Ascendant's inventory via standard requisition.",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		active_veins: ["Chest"],
		body_part: "Chest",
		ink_type: "Troll Boss Blood",
		limitations: {
			requires_attunement: true,
			charges: 0,
			conditions: [
				"Requires tattoo attunement slot (chest)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 500,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			recharge: "Dawn",
			uses: "2/short rest",
			uses_per_rest: 3,
		},
		mechanics: {
			type: "Tattoo",
			ability: "Vitality",
			action: "Flex the tattooed muscle group",
			action_type: "Flex the tattooed muscle group",
			attack: {
				type: "acid",
				damage: "0",
				damage_type: "",
				mode: "self",
				modifier: "",
				resolution: "automatic",
			},
			condition: "Paralysis",
			damage_profile: "N/A (utility/defensive)",
			duration: "Permanent (passive)",
			frequency: "1/short rest",
			lattice_interaction:
				"Troll Boss Blood resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies chest tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			saving_throw: { ability: "", dc: 0, failure: "", success: "" },
			special_abilities: [
				"Inscription requires: Troll Boss Blood, DC 19 tattooing check, 4 hours of uninterrupted work",
			],
			stat_bonuses: {},
		},
		resonance_effect: "Synergizes with other physical bodily enchantments.",
	},
	{
		id: "tattoo_31",
		name: "Winter Core",
		display_name: "Winter Core",
		source_book: "Rift Ascendant Canon",
		description:
			"Freezes anything touching the bearer. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain Rift beasts.",
		rarity: "very_rare",
		image: "/generated/effects/darkness-shroud.webp",
		effects: {
			active: [
				{
					name: "Tattoo Activation",
					description: "Speak the tattoo's true name to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			passive: ["Gain resistance to poison damage."],
			passiveBonuses: [{ value: 1, stat: "poison aura" }],
			primary: "Gain resistance to poison damage.",
			primaryEffect: "Gain resistance to poison damage.",
			secondary:
				"Your unarmed strikes deal an additional 1d4 of the tattoo's element.",
			secondaryEffect: "",
			tertiary:
				"Resonance: When multiple tattoos are active, gain +1 AC per active tattoo.",
		},
		attunement: true,
		lore: {
			current_owner:
				"Widely issued to qualifying Ascendants through Bureau studios.",
			curse:
				"Each activation permanently reduces the user's maximum HP by 1, imperceptible until it's too late.",
			history:
				"Subject to Bureau augmentation oversight and annual review. That much survives in the Winter Core's field history.",
			origin:
				"Developed by Bureau-licensed alchemical tattooists for field Ascendants. The Winter Core entered service from there.",
			personality: "Neutral in personality profile.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Purges the dimensional barrier. A whisper from the edge of oblivion.",
		discovery_lore:
			"Purchased from a black-market auction in the underground district of Meridian City for an undisclosed sum.",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		active_veins: ["Spine"],
		body_part: "Spine",
		ink_type: "Frost-Giant Bone Marrow",
		limitations: {
			requires_attunement: true,
			charges: 0,
			conditions: [
				"Requires tattoo attunement slot (spine)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 100,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			recharge: "Short rest",
			uses: "2/short rest",
			uses_per_rest: 1,
		},
		mechanics: {
			type: "Tattoo",
			ability: "Intelligence",
			action: "Speak the tattoo's true name",
			action_type: "Speak the tattoo's true name",
			attack: {
				type: "poison",
				damage: "0",
				damage_type: "",
				mode: "self",
				modifier: "",
				resolution: "automatic",
			},
			condition: "Lethargy",
			damage_profile: "utility",
			duration: "1 hour",
			frequency: "1/short rest",
			lattice_interaction:
				"Frost-Giant Bone Marrow resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies spine tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			saving_throw: { ability: "", dc: 0, failure: "", success: "" },
			special_abilities: [
				"Inscription requires: Frost-Giant Bone Marrow, DC 20 tattooing check, 4 hours of uninterrupted work",
			],
			stat_bonuses: {},
		},
		resonance_effect: "Synergizes with other physical bodily enchantments.",
	},
	{
		id: "tattoo_32",
		name: "Phoenix Flare",
		display_name: "Phoenix Flare",
		source_book: "Rift Ascendant Canon",
		description:
			"Emit blinding, burning light from the skin. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain Rift beasts.",
		rarity: "very_rare",
		image: "/generated/effects/darkness-shroud.webp",
		effects: {
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Channel mana through the ink circuits to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			passive: ["Your movement speed increases by 10 feet."],
			passiveBonuses: [{ value: 1, stat: "fire aura" }],
			primary: "Your movement speed increases by 10 feet.",
			primaryEffect: "Your movement speed increases by 10 feet.",
			secondary:
				"Your unarmed strikes deal an additional 1d4 of the tattoo's element.",
			secondaryEffect: "",
			tertiary:
				"Emergency Pulse: When reduced to 0 HP, the tattoo activates automatically (1/long rest).",
		},
		attunement: true,
		lore: {
			current_owner: "A standard augmentation offering at licensed studios.",
			curse: "",
			history:
				"Reviewed periodically under the Ascendant augmentation license. The Phoenix Flare carried the story forward.",
			origin:
				"Produced in compliance with Ascendant Bureau augmentation standards. Bureau provenance files log it as the Phoenix Flare.",
			personality: "Inert until intentionally engaged.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Warps the remnants of a dead world. A testament to what Ascendants have become.",
		discovery_lore:
			"Gifted by the System itself as a reward for completing a hidden quest chain.",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		active_veins: ["Full Torso"],
		body_part: "Full Torso",
		ink_type: "Phoenix Ash",
		limitations: {
			requires_attunement: true,
			charges: 0,
			conditions: [
				"Requires tattoo attunement slot (full torso)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 5000,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			recharge: "Dawn",
			uses: "2/short rest",
			uses_per_rest: 3,
		},
		mechanics: {
			type: "Tattoo",
			ability: "Vitality",
			action: "Channel mana through the ink circuits",
			action_type: "Channel mana through the ink circuits",
			attack: {
				type: "fire",
				damage: "0",
				damage_type: "",
				mode: "self",
				modifier: "",
				resolution: "automatic",
			},
			condition: "Blindness",
			damage_profile: "N/A (utility/defensive)",
			duration: "10 minutes",
			frequency: "1/short rest",
			lattice_interaction:
				"Phoenix Ash resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies full torso tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			saving_throw: { ability: "", dc: 0, failure: "", success: "" },
			special_abilities: [
				"Inscription requires: Phoenix Ash, DC 19 tattooing check, 4 hours of uninterrupted work",
			],
			stat_bonuses: {},
		},
		resonance_effect: "Synergizes with other physical bodily enchantments.",
	},
	{
		id: "tattoo_33",
		name: "Vampiric Siphon",
		display_name: "Vampiric Siphon",
		source_book: "Rift Ascendant Canon",
		description:
			"Drain health from enemies in melee range to replenish your own. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain Rift beasts.",
		rarity: "very_rare",
		image: "/generated/effects/darkness-shroud.webp",
		effects: {
			active: [
				{
					name: "Tattoo Activation",
					description: "Speak the tattoo's true name to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			passive: ["Gain +2 to Intelligence while the tattoo is active."],
			passiveBonuses: [{ value: 1, stat: "lightning aura" }],
			primary: "Gain +2 to Intelligence while the tattoo is active.",
			primaryEffect: "Gain +2 to Intelligence while the tattoo is active.",
			secondary:
				"The ink glows faintly, granting advantage on Intimidation checks.",
			secondaryEffect: "",
			tertiary:
				"Emergency Pulse: When reduced to 0 HP, the tattoo activates automatically (1/long rest).",
		},
		attunement: true,
		lore: {
			current_owner: "Applied routinely to qualifying field operatives.",
			curse: "",
			history:
				"Logged in the Bureau's ongoing dermal-mod registry. The Vampiric Siphon carried the story forward.",
			origin:
				"Inked by Bureau-credentialed studio practitioners. Bureau provenance files log it as the Vampiric Siphon.",
			personality: "Unobtrusive while not being used.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Annihilates the threshold of human potential. The death of hesitation, made manifest.",
		discovery_lore:
			"Found in a hidden compartment of a relic weapon that had been in Guild storage for years.",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		active_veins: ["Forearms"],
		body_part: "Forearms",
		ink_type: "Vampire Lord Ash",
		limitations: {
			requires_attunement: true,
			charges: 0,
			conditions: [
				"Requires tattoo attunement slot (forearms)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 100,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			recharge: "Dawn",
			uses: "Passive + 1 active/short rest",
			uses_per_rest: 2,
		},
		mechanics: {
			type: "Tattoo",
			ability: "Vitality",
			action: "Speak the tattoo's true name",
			action_type: "Speak the tattoo's true name",
			attack: {
				type: "self",
				damage: "0",
				damage_type: "",
				mode: "self",
				modifier: "",
				resolution: "automatic",
			},
			condition: "Lethargy",
			damage_profile: "utility",
			duration: "1 minute",
			frequency: "1/long rest",
			lattice_interaction:
				"Vampire Lord Ash resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies forearms tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			saving_throw: { ability: "", dc: 0, failure: "", success: "" },
			special_abilities: [
				"Inscription requires: Vampire Lord Ash, DC 19 tattooing check, 4 hours of uninterrupted work",
			],
			stat_bonuses: {},
		},
		resonance_effect: "Synergizes with other physical bodily enchantments.",
	},
	{
		id: "tattoo_34",
		name: "Poltergeist Fists",
		display_name: "Poltergeist Fists",
		source_book: "Rift Ascendant Canon",
		description:
			"Throw punches that land far away via force magic. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain Rift beasts.",
		rarity: "very_rare",
		image: "/generated/effects/arcane-sigil.webp",
		effects: {
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Press your palm against the design to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			passive: ["Gain +2 to Presence while the tattoo is active."],
			passiveBonuses: [{ value: 1, stat: "force aura" }],
			primary: "Gain +2 to Presence while the tattoo is active.",
			primaryEffect: "Gain +2 to Presence while the tattoo is active.",
			secondary: "Allies within 5 feet gain +1 to saving throws.",
			secondaryEffect: "",
			tertiary:
				"Emergency Pulse: When reduced to 0 HP, the tattoo activates automatically (1/long rest).",
		},
		attunement: true,
		lore: {
			current_owner:
				"Widely issued to qualifying Ascendants through Bureau studios.",
			curse:
				"Causes mild paranoia after extended use; the user becomes convinced they are being watched through mirrors.",
			history:
				"Subject to Bureau augmentation oversight and annual review. The Poltergeist Fists carried the story forward.",
			origin:
				"Developed by Bureau-licensed alchemical tattooists for field Ascendants. Bureau provenance files log it as the Poltergeist Fists.",
			personality: "Neutral in personality profile.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Inverts the last defense of the unprepared. A beautiful catastrophe measured in milliseconds.",
		discovery_lore:
			"Recovered from a time-locked chest that required three different elemental keys to open. Intake tagged it the Poltergeist Fists.",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		active_veins: ["Knuckles"],
		body_part: "Knuckles",
		ink_type: "Poltergeist Essence",
		limitations: {
			requires_attunement: true,
			charges: 0,
			conditions: [
				"Requires tattoo attunement slot (knuckles)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 1000,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			recharge: "Long rest",
			uses: "Passive + 1 active/short rest",
			uses_per_rest: 1,
		},
		mechanics: {
			type: "Tattoo",
			ability: "Intelligence",
			action: "Press your palm against the design",
			action_type: "Press your palm against the design",
			attack: {
				type: "force",
				damage: "0",
				damage_type: "",
				mode: "self",
				modifier: "",
				resolution: "automatic",
			},
			condition: "Paralysis",
			damage_profile: "N/A (utility/defensive)",
			duration: "1 hour",
			frequency: "1/short rest",
			lattice_interaction:
				"Poltergeist Essence resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies knuckles tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			saving_throw: { ability: "", dc: 0, failure: "", success: "" },
			special_abilities: [
				"Inscription requires: Poltergeist Essence, DC 20 tattooing check, 4 hours of uninterrupted work",
			],
			stat_bonuses: {},
		},
		resonance_effect: "Synergizes with other physical bodily enchantments.",
	},
	{
		id: "tattoo_35",
		name: "Shadow Clone",
		display_name: "Shadow Clone",
		source_book: "Rift Ascendant Canon",
		description:
			"Creates an exact physical double from shadow magic. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain Rift beasts.",
		rarity: "very_rare",
		image: "/generated/effects/arcane-sigil.webp",
		effects: {
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Initiated via the bearer's conditioned trigger state. to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			passive: [
				"Deal 1d8 poison damage to creatures that hit you with melee attacks.",
			],
			passiveBonuses: [{ value: 1, stat: "poison aura" }],
			primary:
				"Deal 1d8 poison damage to creatures that hit you with melee attacks.",
			primaryEffect:
				"Deal 1d8 poison damage to creatures that hit you with melee attacks.",
			secondary:
				"You ignore the first instance of this damage type each combat.",
			secondaryEffect: "",
			tertiary:
				"Emergency Pulse: When reduced to 0 HP, the tattoo activates automatically (1/long rest).",
		},
		attunement: true,
		lore: {
			current_owner:
				"Available through the Bureau's open augmentation catalog.",
			curse: "",
			history:
				"Covered by the standard Guild Bureau compliance agreement. The Shadow Clone carried the story forward.",
			origin:
				"Applied under the Guild Bureau's dermal-weave protocol. Bureau provenance files log it as the Shadow Clone.",
			personality: "Disciplined in its at-rest state.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Shatters the remnants of a dead world. The breaking point of all resistance.",
		discovery_lore:
			"Located by a detection-type Ascendant whose radar ability triggered on an otherwise empty room. The recovery slip named it the Shadow Clone.",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		active_veins: ["Back"],
		body_part: "Back",
		ink_type: "Shadow Lord Dust",
		limitations: {
			requires_attunement: true,
			charges: 0,
			conditions: [
				"Requires tattoo attunement slot (back)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 500,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			recharge: "Long rest",
			uses: "Passive + 1 active/short rest",
			uses_per_rest: 3,
		},
		mechanics: {
			type: "Tattoo",
			ability: "Presence",
			action: "Initiated via the bearer's conditioned trigger state.",
			action_type: "Initiated via the bearer's conditioned trigger state.",
			attack: {
				type: "self",
				damage: "0",
				damage_type: "",
				mode: "self",
				modifier: "",
				resolution: "automatic",
			},
			condition: "Lethargy",
			damage_profile: "utility",
			duration: "Permanent (passive)",
			frequency: "1/long rest",
			lattice_interaction:
				"Shadow Lord Dust resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies back tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			saving_throw: { ability: "", dc: 0, failure: "", success: "" },
			special_abilities: [
				"Inscription requires: Shadow Lord Dust, DC 17 tattooing check, 4 hours of uninterrupted work",
			],
			stat_bonuses: {},
		},
		resonance_effect: "Synergizes with other physical bodily enchantments.",
	},
	{
		id: "tattoo_36",
		name: "Rift Pocket",
		display_name: "Rift Pocket",
		source_book: "Rift Ascendant Canon",
		description:
			"Store items inside a magical tattoo on your skin. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain Rift beasts.",
		rarity: "very_rare",
		image: "/generated/effects/darkness-shroud.webp",
		effects: {
			active: [
				{
					name: "Tattoo Activation",
					description: "Speak the tattoo's true name to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			passive: ["You can see in magical darkness out to 60 feet."],
			passiveBonuses: [{ value: 1, stat: "force aura" }],
			primary: "You can see in magical darkness out to 60 feet.",
			primaryEffect: "You can see in magical darkness out to 60 feet.",
			secondary: "Allies within 5 feet gain +1 to saving throws.",
			secondaryEffect: "",
			tertiary:
				"Overcharge: Once per long rest, double the primary effect for 1 round.",
		},
		attunement: true,
		lore: {
			current_owner: "Applied routinely to qualifying field operatives.",
			curse: "",
			history:
				"Logged in the Bureau's ongoing dermal-mod registry. The Rift Pocket's service record notes as much.",
			origin:
				"Inked by Bureau-credentialed studio practitioners. The Rift Pocket entered service from there.",
			personality: "Unobtrusive while not being used.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Rends the illusion of safety. Evolution compressed into a single, violent instant.",
		discovery_lore:
			"Located by a detection-type Ascendant whose radar ability triggered on an otherwise empty room. Logged on arrival as the Rift Pocket.",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		active_veins: ["Thigh"],
		body_part: "Thigh",
		ink_type: "Rift-Weaver Thread",
		limitations: {
			requires_attunement: true,
			charges: 0,
			conditions: [
				"Requires tattoo attunement slot (thigh)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 1000,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			recharge: "Dawn",
			uses: "Proficiency/long rest",
			uses_per_rest: 2,
		},
		mechanics: {
			type: "Tattoo",
			ability: "Presence",
			action: "Speak the tattoo's true name",
			action_type: "Speak the tattoo's true name",
			attack: {
				type: "force",
				damage: "0",
				damage_type: "",
				mode: "self",
				modifier: "",
				resolution: "automatic",
			},
			condition: "Fear",
			damage_profile: "utility",
			duration: "10 minutes",
			frequency: "Proficiency/long rest",
			lattice_interaction:
				"Rift-Weaver Thread resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies thigh tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			saving_throw: { ability: "", dc: 0, failure: "", success: "" },
			special_abilities: [
				"Inscription requires: Rift-Weaver Thread, DC 12 tattooing check, 4 hours of uninterrupted work",
			],
			stat_bonuses: {},
		},
		resonance_effect: "Synergizes with other physical bodily enchantments.",
	},
	{
		id: "tattoo_37",
		name: "Magic-Bane Aura",
		display_name: "Magic-Bane Aura",
		source_book: "Rift Ascendant Canon",
		description:
			"Delete all magic in a small radius. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain Rift beasts.",
		rarity: "very_rare",
		image: "/generated/effects/darkness-shroud.webp",
		effects: {
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Channel mana through the ink circuits to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			passive: ["Gain +2 to Intelligence while the tattoo is active."],
			passiveBonuses: [{ value: 1, stat: "thunder aura" }],
			primary: "Gain +2 to Intelligence while the tattoo is active.",
			primaryEffect: "Gain +2 to Intelligence while the tattoo is active.",
			secondary:
				"The ink glows faintly, granting advantage on Intimidation checks.",
			secondaryEffect: "",
			tertiary:
				"Resonance: When multiple tattoos are active, gain +1 AC per active tattoo.",
		},
		attunement: true,
		lore: {
			current_owner: "Common at Guild-authorized dermal-mod clinics.",
			curse: "",
			history:
				"Tracked through the Guild Bureau's compliance schedule. The Magic-Bane Aura carried the story forward.",
			origin:
				"Formulated within the Guild's authorized dermal-mod program. Archived under the Magic-Bane Aura designation.",
			personality: "Quiet between activations.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Mirrors the flow of causality. The breaking point of all resistance.",
		discovery_lore:
			"Found pulsing with residual mana in the aftermath of a Rift Break, half-buried in shattered concrete. Logged on arrival as the Magic-Bane Aura.",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		active_veins: ["Chest"],
		body_part: "Chest",
		ink_type: "Beholder-Class Central Eye",
		limitations: {
			requires_attunement: true,
			charges: 0,
			conditions: [
				"Requires tattoo attunement slot (chest)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 250,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			recharge: "Long rest",
			uses: "Passive only",
			uses_per_rest: 2,
		},
		mechanics: {
			type: "Tattoo",
			ability: "Presence",
			action: "Channel mana through the ink circuits",
			action_type: "Channel mana through the ink circuits",
			attack: {
				type: "thunder",
				damage: "0",
				damage_type: "",
				mode: "self",
				modifier: "",
				resolution: "automatic",
			},
			condition: "Blindness",
			damage_profile: "N/A (utility/defensive)",
			duration: "1 minute",
			frequency: "Proficiency/long rest",
			lattice_interaction:
				"Beholder-Class Central Eye resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies chest tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			saving_throw: { ability: "", dc: 0, failure: "", success: "" },
			special_abilities: [
				"Inscription requires: Beholder-Class Central Eye, DC 14 tattooing check, 4 hours of uninterrupted work",
			],
			stat_bonuses: {},
		},
		resonance_effect: "Synergizes with other physical bodily enchantments.",
	},
	{
		id: "tattoo_38",
		name: "Blink Strike",
		display_name: "Blink Strike",
		source_book: "Rift Ascendant Canon",
		description:
			"Teleport to an enemy and automatically attack. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain Rift beasts.",
		rarity: "very_rare",
		image: "/generated/effects/arcane-sigil.webp",
		effects: {
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Channel mana through the ink circuits to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			passive: ["Your movement speed increases by 10 feet."],
			passiveBonuses: [{ value: 1, stat: "poison aura" }],
			primary: "Your movement speed increases by 10 feet.",
			primaryEffect: "Your movement speed increases by 10 feet.",
			secondary:
				"You ignore the first instance of this damage type each combat.",
			secondaryEffect: "",
			tertiary:
				"Resonance: When multiple tattoos are active, gain +1 AC per active tattoo.",
		},
		attunement: true,
		lore: {
			current_owner:
				"Available through the Bureau's open augmentation catalog.",
			curse: "",
			history:
				"Covered by the standard Guild Bureau compliance agreement. The Blink Strike carried the story forward.",
			origin:
				"Applied under the Guild Bureau's dermal-weave protocol. Bureau provenance files log it as the Blink Strike.",
			personality: "Disciplined in its at-rest state.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Annihilates the threshold of human potential. A testament to what Ascendants have become.",
		discovery_lore:
			"Found pulsing with residual mana in the aftermath of a Rift Break, half-buried in shattered concrete. The recovery slip named it the Blink Strike.",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		active_veins: ["Calves"],
		body_part: "Calves",
		ink_type: "Displacer Beast Blood",
		limitations: {
			requires_attunement: true,
			charges: 0,
			conditions: [
				"Requires tattoo attunement slot (calves)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 1000,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			recharge: "Short rest",
			uses: "2/short rest",
			uses_per_rest: 1,
		},
		mechanics: {
			type: "Tattoo",
			ability: "Intelligence",
			action: "Channel mana through the ink circuits",
			action_type: "Channel mana through the ink circuits",
			attack: {
				type: "poison",
				damage: "0",
				damage_type: "",
				mode: "self",
				modifier: "",
				resolution: "automatic",
			},
			condition: "Fear",
			damage_profile: "utility",
			duration: "1 minute",
			frequency: "1/short rest",
			lattice_interaction:
				"Displacer Beast Blood resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies calves tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			saving_throw: { ability: "", dc: 0, failure: "", success: "" },
			special_abilities: [
				"Inscription requires: Displacer Beast Blood, DC 10 tattooing check, 4 hours of uninterrupted work",
			],
			stat_bonuses: {},
		},
		resonance_effect: "Synergizes with other physical bodily enchantments.",
	},
	{
		id: "tattoo_39",
		name: "Iron Maiden's Embrace",
		display_name: "Iron Maiden's Embrace",
		source_book: "Rift Ascendant Canon",
		description:
			"Skin grows magical iron spikes that impale grapplers. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain Rift beasts.",
		rarity: "very_rare",
		image: "/generated/effects/arcane-sigil.webp",
		effects: {
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Press your palm against the design to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			passive: [
				"Deal 1d6 thunder damage to creatures that hit you with melee attacks.",
			],
			passiveBonuses: [{ value: 1, stat: "thunder aura" }],
			primary:
				"Deal 1d6 thunder damage to creatures that hit you with melee attacks.",
			primaryEffect:
				"Deal 1d6 thunder damage to creatures that hit you with melee attacks.",
			secondary:
				"You ignore the first instance of this damage type each combat.",
			secondaryEffect: "",
			tertiary:
				"Overcharge: Once per long rest, double the primary effect for 1 round.",
		},
		attunement: true,
		lore: {
			current_owner: "A standard augmentation offering at licensed studios.",
			curse: "",
			history:
				"Reviewed periodically under the Ascendant augmentation license. That much survives in the Iron Maiden's Embrace's field history.",
			origin:
				"Produced in compliance with Ascendant Bureau augmentation standards. Bureau provenance files log it as the Iron Maiden's Embrace.",
			personality: "Inert until intentionally engaged.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Mirrors the illusion of safety. The last thing many anomalies ever see.",
		discovery_lore:
			"Materialized on an Ascendant's workbench overnight, leaving scorch marks in the shape of unknown glyphs. The recovery slip named it the Iron Maiden's Embrace.",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		active_veins: ["Full Body"],
		body_part: "Full Body",
		ink_type: "Rift Iron",
		limitations: {
			requires_attunement: true,
			charges: 0,
			conditions: [
				"Requires tattoo attunement slot (full body)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 2500,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			recharge: "Long rest",
			uses: "Passive only",
			uses_per_rest: 3,
		},
		mechanics: {
			type: "Tattoo",
			ability: "Presence",
			action: "Press your palm against the design",
			action_type: "Press your palm against the design",
			attack: {
				type: "thunder",
				damage: "0",
				damage_type: "",
				mode: "self",
				modifier: "",
				resolution: "automatic",
			},
			condition: "Fear",
			damage_profile: "N/A (utility/defensive)",
			duration: "1 hour",
			frequency: "1/short rest",
			lattice_interaction:
				"Rift Iron resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies full body tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			saving_throw: { ability: "", dc: 0, failure: "", success: "" },
			special_abilities: [
				"Inscription requires: Rift Iron, DC 10 tattooing check, 4 hours of uninterrupted work",
			],
			stat_bonuses: {},
		},
		resonance_effect: "Synergizes with other physical bodily enchantments.",
	},
	{
		id: "tattoo_40",
		name: "Dreadnought's Grasp",
		display_name: "Dreadnought's Grasp",
		source_book: "Rift Ascendant Canon",
		description:
			"Stun enemies with a touch of overwhelming mana. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain Rift beasts.",
		rarity: "very_rare",
		image: "/generated/effects/arcane-sigil.webp",
		effects: {
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Channel mana through the ink circuits to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			passive: ["Gain resistance to psychic damage."],
			passiveBonuses: [{ value: 1, stat: "psychic aura" }],
			primary: "Gain resistance to psychic damage.",
			primaryEffect: "Gain resistance to psychic damage.",
			secondary:
				"Your unarmed strikes deal an additional 1d4 of the tattoo's element.",
			secondaryEffect: "",
			tertiary:
				"Overcharge: Once per long rest, double the primary effect for 1 round.",
		},
		attunement: true,
		lore: {
			current_owner: "Applied routinely to qualifying field operatives.",
			curse: "",
			history:
				"Logged in the Bureau's ongoing dermal-mod registry. The Dreadnought's Grasp carried the story forward.",
			origin:
				"Inked by Bureau-credentialed studio practitioners. The Dreadnought's Grasp entered service from there.",
			personality: "Unobtrusive while not being used.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Eclipses the architect's design. A testament to what Ascendants have become.",
		discovery_lore:
			"Sold by a mysterious merchant who appears only during full moons near active Rift sites. The recovery slip named it the Dreadnought's Grasp.",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		active_veins: ["Palms"],
		body_part: "Palms",
		ink_type: "Astral Dreadnought Scale",
		limitations: {
			requires_attunement: true,
			charges: 0,
			conditions: [
				"Requires tattoo attunement slot (palms)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 500,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			recharge: "Short rest",
			uses: "2/short rest",
			uses_per_rest: 1,
		},
		mechanics: {
			type: "Tattoo",
			ability: "Intelligence",
			action: "Channel mana through the ink circuits",
			action_type: "Channel mana through the ink circuits",
			attack: {
				type: "psychic",
				damage: "0",
				damage_type: "",
				mode: "self",
				modifier: "",
				resolution: "automatic",
			},
			condition: "Stunning",
			damage_profile: "utility",
			duration: "10 minutes",
			frequency: "2/short rest",
			lattice_interaction:
				"Astral Dreadnought Scale resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies palms tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			saving_throw: { ability: "", dc: 0, failure: "", success: "" },
			special_abilities: [
				"Inscription requires: Astral Dreadnought Scale, DC 19 tattooing check, 4 hours of uninterrupted work",
			],
			stat_bonuses: {},
		},
		resonance_effect: "Synergizes with other physical bodily enchantments.",
	},
	{
		id: "tattoo_41",
		name: "Soul Severing Edge",
		display_name: "Soul Severing Edge",
		source_book: "Rift Ascendant Canon",
		description:
			"Attacks bypass physical armor and directly damage the target's spirit. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain Rift beasts.",
		rarity: "legendary",
		image: "/generated/effects/arcane-sigil.webp",
		effects: {
			active: [
				{
					name: "Tattoo Activation",
					description: "Speak the tattoo's true name to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			passive: ["You can see in magical darkness out to 60 feet."],
			passiveBonuses: [{ value: 1, stat: "force aura" }],
			primary: "You can see in magical darkness out to 60 feet.",
			primaryEffect: "You can see in magical darkness out to 60 feet.",
			secondary:
				"You ignore the first instance of this damage type each combat.",
			secondaryEffect: "",
			tertiary:
				"Overcharge: Once per long rest, double the primary effect for 1 round.",
		},
		attunement: true,
		lore: {
			current_owner: "A standard augmentation offering at licensed studios.",
			curse:
				"Prolonged wielders report hearing a second heartbeat that doesn't match their own.",
			history:
				"Reviewed periodically under the Ascendant augmentation license. That much survives in the Soul Severing Edge's field history.",
			origin:
				"Produced in compliance with Ascendant Bureau augmentation standards. Bureau provenance files log it as the Soul Severing Edge.",
			personality: "Inert until intentionally engaged.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Erases the boundary between life and death. A whisper from the edge of oblivion.",
		discovery_lore:
			"Excavated from the crystallized mana deposit at the center of a depleted Rift core. The recovery slip named it the Soul Severing Edge.",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		active_veins: ["Right Arm"],
		body_part: "Right Arm",
		ink_type: "Reaper Scythe Dust",
		limitations: {
			requires_attunement: true,
			charges: 0,
			conditions: [
				"Requires tattoo attunement slot (right arm)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 250,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			recharge: "Long rest",
			uses: "Passive only",
			uses_per_rest: 2,
		},
		mechanics: {
			type: "Tattoo",
			ability: "Presence",
			action: "Speak the tattoo's true name",
			action_type: "Speak the tattoo's true name",
			attack: {
				type: "force",
				damage: "0",
				damage_type: "",
				mode: "self",
				modifier: "",
				resolution: "automatic",
			},
			condition: "Fear",
			damage_profile: "utility",
			duration: "1 hour",
			frequency: "Passive",
			lattice_interaction:
				"Reaper Scythe Dust resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies right arm tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			saving_throw: { ability: "", dc: 0, failure: "", success: "" },
			special_abilities: [
				"Inscription requires: Reaper Scythe Dust, DC 16 tattooing check, 4 hours of uninterrupted work",
			],
			stat_bonuses: {},
		},
		resonance_effect: "Synergizes with other physical bodily enchantments.",
	},
	{
		id: "tattoo_42",
		name: "Anomaly's Ascendancy",
		display_name: "Anomaly's Ascendancy",
		source_book: "Rift Ascendant Canon",
		description:
			"Sprout ethereal anomaly wings of pure mana. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain Rift beasts.",
		rarity: "legendary",
		image: "/generated/effects/arcane-sigil.webp",
		effects: {
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Flex the tattooed muscle group to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			passive: [
				"Deal 1d6 radiant damage to creatures that hit you with melee attacks.",
			],
			passiveBonuses: [{ value: 1, stat: "radiant aura" }],
			primary:
				"Deal 1d6 radiant damage to creatures that hit you with melee attacks.",
			primaryEffect:
				"Deal 1d6 radiant damage to creatures that hit you with melee attacks.",
			secondary: "Allies within 5 feet gain +1 to saving throws.",
			secondaryEffect: "",
			tertiary:
				"Emergency Pulse: When reduced to 0 HP, the tattoo activates automatically (1/long rest).",
		},
		attunement: true,
		lore: {
			current_owner:
				"Available through the Bureau's open augmentation catalog.",
			curse: "",
			history:
				"Covered by the standard Guild Bureau compliance agreement. That much survives in the Anomaly's Ascendancy's field history.",
			origin:
				"Applied under the Guild Bureau's dermal-weave protocol. Archived under the Anomaly's Ascendancy designation.",
			personality: "Disciplined in its at-rest state.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Corrodes the architecture of the soul. The last thing many anomalies ever see.",
		discovery_lore:
			"Sold by a mysterious merchant who appears only during full moons near active Rift sites. The recovery slip named it the Anomaly's Ascendancy.",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		active_veins: ["Shoulder Blades"],
		body_part: "Shoulder Blades",
		ink_type: "Ancient anomaly Blood",
		limitations: {
			requires_attunement: true,
			charges: 0,
			conditions: [
				"Requires tattoo attunement slot (shoulder blades)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 2500,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			recharge: "Short rest",
			uses: "Passive + 1 active/short rest",
			uses_per_rest: 2,
		},
		mechanics: {
			type: "Tattoo",
			ability: "Intelligence",
			action: "Flex the tattooed muscle group",
			action_type: "Flex the tattooed muscle group",
			attack: {
				type: "radiant",
				damage: "0",
				damage_type: "",
				mode: "self",
				modifier: "",
				resolution: "automatic",
			},
			condition: "Fear",
			damage_profile: "utility",
			duration: "1 minute",
			frequency: "2/short rest",
			lattice_interaction:
				"Ancient anomaly Blood resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies shoulder blades tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			saving_throw: { ability: "", dc: 0, failure: "", success: "" },
			special_abilities: [
				"Inscription requires: Ancient anomaly Blood, DC 18 tattooing check, 4 hours of uninterrupted work",
			],
			stat_bonuses: {},
		},
		resonance_effect: "Synergizes with other physical bodily enchantments.",
	},
	{
		id: "tattoo_43",
		name: "Tsunami's Wrath",
		display_name: "Tsunami's Wrath",
		source_book: "Rift Ascendant Canon",
		description:
			"Command massive amounts of water. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain Rift beasts.",
		rarity: "legendary",
		image: "/generated/effects/darkness-shroud.webp",
		effects: {
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Press your palm against the design to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			passive: ["You can see in magical darkness out to 60 feet."],
			passiveBonuses: [{ value: 1, stat: "fire aura" }],
			primary: "You can see in magical darkness out to 60 feet.",
			primaryEffect: "You can see in magical darkness out to 60 feet.",
			secondary: "Allies within 5 feet gain +1 to saving throws.",
			secondaryEffect: "",
			tertiary:
				"Resonance: When multiple tattoos are active, gain +1 AC per active tattoo.",
		},
		attunement: true,
		lore: {
			current_owner:
				"Widely issued to qualifying Ascendants through Bureau studios.",
			curse: "",
			history:
				"Subject to Bureau augmentation oversight and annual review. The Tsunami's Wrath's service record notes as much.",
			origin:
				"Developed by Bureau-licensed alchemical tattooists for field Ascendants. The Tsunami's Wrath entered service from there.",
			personality: "Neutral in personality profile.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Eclipses the threshold of human potential. The breaking point of all resistance.",
		discovery_lore:
			"Sold by a mysterious merchant who appears only during full moons near active Rift sites. The recovery slip named it the Tsunami's Wrath.",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		active_veins: ["Chest"],
		body_part: "Chest",
		ink_type: "Leviathan Scale",
		limitations: {
			requires_attunement: true,
			charges: 0,
			conditions: [
				"Requires tattoo attunement slot (chest)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 500,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			recharge: "Dawn",
			uses: "2/short rest",
			uses_per_rest: 2,
		},
		mechanics: {
			type: "Tattoo",
			ability: "Vitality",
			action: "Press your palm against the design",
			action_type: "Press your palm against the design",
			attack: {
				type: "fire",
				damage: "0",
				damage_type: "",
				mode: "self",
				modifier: "",
				resolution: "automatic",
			},
			condition: "Paralysis",
			damage_profile: "utility",
			duration: "1 hour",
			frequency: "1/short rest",
			lattice_interaction:
				"Leviathan Scale resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies chest tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			saving_throw: { ability: "", dc: 0, failure: "", success: "" },
			special_abilities: [
				"Inscription requires: Leviathan Scale, DC 12 tattooing check, 4 hours of uninterrupted work",
			],
			stat_bonuses: {},
		},
		resonance_effect: "Synergizes with other physical bodily enchantments.",
	},
	{
		id: "tattoo_44",
		name: "Earthshaker's Stride",
		display_name: "Earthshaker's Stride",
		source_book: "Rift Ascendant Canon",
		description:
			"Cause localized earthquakes with every step. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain Rift beasts.",
		rarity: "legendary",
		image: "/generated/effects/arcane-sigil.webp",
		effects: {
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Engaged by a deliberate focal gesture on the tattoo. to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			passive: ["Your movement speed increases by 10 feet."],
			passiveBonuses: [{ value: 1, stat: "necrotic aura" }],
			primary: "Your movement speed increases by 10 feet.",
			primaryEffect: "Your movement speed increases by 10 feet.",
			secondary:
				"You ignore the first instance of this damage type each combat.",
			secondaryEffect: "",
			tertiary:
				"Overcharge: Once per long rest, double the primary effect for 1 round.",
		},
		attunement: true,
		lore: {
			current_owner: "Common at Guild-authorized dermal-mod clinics.",
			curse: "",
			history:
				"Tracked through the Guild Bureau's compliance schedule. The Earthshaker's Stride's service record notes as much.",
			origin:
				"Formulated within the Guild's authorized dermal-mod program. The Earthshaker's Stride entered service from there.",
			personality: "Quiet between activations.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Devours the dimensional barrier. Evolution compressed into a single, violent instant.",
		discovery_lore:
			"Recovered from a time-locked chest that required three different elemental keys to open. The recovery slip named it the Earthshaker's Stride.",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		active_veins: ["Legs"],
		body_part: "Legs",
		ink_type: "Tarrasque-Class Bone Dust",
		limitations: {
			requires_attunement: true,
			charges: 0,
			conditions: [
				"Requires tattoo attunement slot (legs)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 2500,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			recharge: "Long rest",
			uses: "2/short rest",
			uses_per_rest: 3,
		},
		mechanics: {
			type: "Tattoo",
			ability: "Presence",
			action: "Engaged by a deliberate focal gesture on the tattoo.",
			action_type: "Engaged by a deliberate focal gesture on the tattoo.",
			attack: {
				type: "necrotic",
				damage: "0",
				damage_type: "",
				mode: "self",
				modifier: "",
				resolution: "automatic",
			},
			condition: "Fear",
			damage_profile: "utility",
			duration: "1 hour",
			frequency: "1/long rest",
			lattice_interaction:
				"Tarrasque-Class Bone Dust resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies legs tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			saving_throw: { ability: "", dc: 0, failure: "", success: "" },
			special_abilities: [
				"Inscription requires: Tarrasque-Class Bone Dust, DC 18 tattooing check, 4 hours of uninterrupted work",
			],
			stat_bonuses: {},
		},
		resonance_effect: "Synergizes with other physical bodily enchantments.",
	},
	{
		id: "tattoo_45",
		name: "Resurrection Grace",
		display_name: "Resurrection Grace",
		source_book: "Rift Ascendant Canon",
		description:
			"Resurrect a fallen Ascendant, permanently sacrificing the ink. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain Rift beasts.",
		rarity: "legendary",
		image: "/generated/effects/arcane-sigil.webp",
		effects: {
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Press your palm against the design to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			passive: ["You can see in magical darkness out to 60 feet."],
			passiveBonuses: [{ value: 1, stat: "thunder aura" }],
			primary: "You can see in magical darkness out to 60 feet.",
			primaryEffect: "You can see in magical darkness out to 60 feet.",
			secondary:
				"You ignore the first instance of this damage type each combat.",
			secondaryEffect: "",
			tertiary:
				"Overcharge: Once per long rest, double the primary effect for 1 round.",
		},
		attunement: true,
		lore: {
			current_owner: "Applied routinely to qualifying field operatives.",
			curse: "",
			history:
				"Logged in the Bureau's ongoing dermal-mod registry. The Resurrection Grace carried the story forward.",
			origin:
				"Inked by Bureau-credentialed studio practitioners. The Resurrection Grace entered service from there.",
			personality: "Unobtrusive while not being used.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Condemns the fabric of reality. The breaking point of all resistance.",
		discovery_lore:
			"Found pulsing with residual mana in the aftermath of a Rift Break, half-buried in shattered concrete. The recovery slip named it the Resurrection Grace.",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		active_veins: ["Heart"],
		body_part: "Heart",
		ink_type: "Angel-Class Anomaly Essence",
		limitations: {
			requires_attunement: true,
			charges: 0,
			conditions: [
				"Requires tattoo attunement slot (heart)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 1000,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			recharge: "Dawn",
			uses: "2/short rest",
			uses_per_rest: 2,
		},
		mechanics: {
			type: "Tattoo",
			ability: "Intelligence",
			action: "Press your palm against the design",
			action_type: "Press your palm against the design",
			attack: {
				type: "thunder",
				damage: "0",
				damage_type: "",
				mode: "self",
				modifier: "",
				resolution: "automatic",
			},
			condition: "Blindness",
			damage_profile: "utility",
			duration: "1 hour",
			frequency: "1/short rest",
			lattice_interaction:
				"Angel-Class Anomaly Essence resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies heart tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			saving_throw: { ability: "", dc: 0, failure: "", success: "" },
			special_abilities: [
				"Inscription requires: Angel-Class Anomaly Essence, DC 20 tattooing check, 4 hours of uninterrupted work",
			],
			stat_bonuses: {},
		},
		resonance_effect: "Synergizes with other physical bodily enchantments.",
	},
	{
		id: "tattoo_46",
		name: "Regent of Dread's Fury",
		display_name: "Regent of Dread's Fury",
		source_book: "Rift Ascendant Canon",
		description:
			"Enter an uncontrollable rage offering immense strength. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain Rift beasts.",
		rarity: "legendary",
		image: "/generated/effects/arcane-sigil.webp",
		effects: {
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Called up through a practiced activation pose. to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			passive: ["Gain resistance to necrotic damage."],
			passiveBonuses: [{ value: 1, stat: "necrotic aura" }],
			primary: "Gain resistance to necrotic damage.",
			primaryEffect: "Gain resistance to necrotic damage.",
			secondary: "Allies within 5 feet gain +1 to saving throws.",
			secondaryEffect: "",
			tertiary:
				"Overcharge: Once per long rest, double the primary effect for 1 round.",
		},
		attunement: true,
		lore: {
			current_owner: "A standard augmentation offering at licensed studios.",
			curse: "",
			history:
				"Reviewed periodically under the Ascendant augmentation license. That much survives in the Regent of Dread's Fury's field history.",
			origin:
				"Produced in compliance with Ascendant Bureau augmentation standards. Archived under the Regent of Dread's Fury designation.",
			personality: "Inert until intentionally engaged.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Sanctifies the silence between heartbeats. The last thing many anomalies ever see.",
		discovery_lore:
			"Materialized on an Ascendant's workbench overnight, leaving scorch marks in the shape of unknown glyphs. The recovery slip named it the Regent of Dread's Fury.",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		active_veins: ["Face"],
		body_part: "Face",
		ink_type: "Balor Blood",
		limitations: {
			requires_attunement: true,
			charges: 0,
			conditions: [
				"Requires tattoo attunement slot (face)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 250,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			recharge: "Short rest",
			uses: "Proficiency/long rest",
			uses_per_rest: 2,
		},
		mechanics: {
			type: "Tattoo",
			ability: "Presence",
			action: "Called up through a practiced activation pose.",
			action_type: "Called up through a practiced activation pose.",
			attack: {
				type: "necrotic",
				damage: "0",
				damage_type: "",
				mode: "self",
				modifier: "",
				resolution: "automatic",
			},
			condition: "Stunning",
			damage_profile: "N/A (utility/defensive)",
			duration: "1 hour",
			frequency: "1/long rest",
			lattice_interaction:
				"Balor Blood resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies face tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			saving_throw: { ability: "", dc: 0, failure: "", success: "" },
			special_abilities: [
				"Inscription requires: Balor Blood, DC 14 tattooing check, 4 hours of uninterrupted work",
			],
			stat_bonuses: {},
		},
		resonance_effect: "Synergizes with other physical bodily enchantments.",
	},
	{
		id: "tattoo_47",
		name: "Undying Phylactery",
		display_name: "Undying Phylactery",
		source_book: "Rift Ascendant Canon",
		description:
			"Store your soul's essence in the tattoo. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain Rift beasts.",
		rarity: "legendary",
		image: "/generated/effects/darkness-shroud.webp",
		effects: {
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Channel mana through the ink circuits to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			passive: ["Gain resistance to radiant damage."],
			passiveBonuses: [{ value: 1, stat: "radiant aura" }],
			primary: "Gain resistance to radiant damage.",
			primaryEffect: "Gain resistance to radiant damage.",
			secondary:
				"The ink glows faintly, granting advantage on Intimidation checks.",
			secondaryEffect: "",
			tertiary:
				"Resonance: When multiple tattoos are active, gain +1 AC per active tattoo.",
		},
		attunement: true,
		lore: {
			current_owner:
				"Available through the Bureau's open augmentation catalog.",
			curse: "",
			history:
				"Covered by the standard Guild Bureau compliance agreement. The Undying Phylactery's service record notes as much.",
			origin:
				"Applied under the Guild Bureau's dermal-weave protocol. The Undying Phylactery entered service from there.",
			personality: "Disciplined in its at-rest state.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Inverts the silence between heartbeats. The reason S-Rank Rifts are feared.",
		discovery_lore:
			"Emerged from a Rift Boss's dissolution cloud, hovering where the creature's heart had been. Intake tagged it the Undying Phylactery.",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		active_veins: ["Forehead"],
		body_part: "Forehead",
		ink_type: "Lich King Dust",
		limitations: {
			requires_attunement: true,
			charges: 0,
			conditions: [
				"Requires tattoo attunement slot (forehead)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 1000,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			recharge: "Long rest",
			uses: "Proficiency/long rest",
			uses_per_rest: 2,
		},
		mechanics: {
			type: "Tattoo",
			ability: "Vitality",
			action: "Channel mana through the ink circuits",
			action_type: "Channel mana through the ink circuits",
			attack: {
				type: "radiant",
				damage: "0",
				damage_type: "",
				mode: "self",
				modifier: "",
				resolution: "automatic",
			},
			condition: "Paralysis",
			damage_profile: "utility",
			duration: "Permanent (passive)",
			frequency: "1/short rest",
			lattice_interaction:
				"Lich King Dust resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies forehead tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			saving_throw: { ability: "", dc: 0, failure: "", success: "" },
			special_abilities: [
				"Inscription requires: Lich King Dust, DC 19 tattooing check, 4 hours of uninterrupted work",
			],
			stat_bonuses: {},
		},
		resonance_effect: "Synergizes with other physical bodily enchantments.",
	},
	{
		id: "tattoo_48",
		name: "World Tree Sap",
		display_name: "World Tree Sap",
		source_book: "Rift Ascendant Canon",
		description:
			"Immune to all poison, disease, and magical decay. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain Rift beasts.",
		rarity: "legendary",
		image: "/generated/effects/darkness-shroud.webp",
		effects: {
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Press your palm against the design to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			passive: ["You can see in magical darkness out to 60 feet."],
			passiveBonuses: [{ value: 1, stat: "radiant aura" }],
			primary: "You can see in magical darkness out to 60 feet.",
			primaryEffect: "You can see in magical darkness out to 60 feet.",
			secondary:
				"The ink glows faintly, granting advantage on Intimidation checks.",
			secondaryEffect: "",
			tertiary:
				"Resonance: When multiple tattoos are active, gain +1 AC per active tattoo.",
		},
		attunement: true,
		lore: {
			current_owner:
				"Available through the Bureau's open augmentation catalog.",
			curse: "",
			history:
				"Covered by the standard Guild Bureau compliance agreement. That much survives in the World Tree Sap's field history.",
			origin:
				"Applied under the Guild Bureau's dermal-weave protocol. Bureau provenance files log it as the World Tree Sap.",
			personality: "Disciplined in its at-rest state.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Shatters the certainty of outcomes. The last thing many anomalies ever see.",
		discovery_lore:
			"Found pulsing with residual mana in the aftermath of a Rift Break, half-buried in shattered concrete. Logged on arrival as the World Tree Sap.",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		active_veins: ["Spine"],
		body_part: "Spine",
		ink_type: "Yggdrasil-Class Sap",
		limitations: {
			requires_attunement: true,
			charges: 0,
			conditions: [
				"Requires tattoo attunement slot (spine)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 250,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			recharge: "Long rest",
			uses: "Proficiency/long rest",
			uses_per_rest: 3,
		},
		mechanics: {
			type: "Tattoo",
			ability: "Presence",
			action: "Press your palm against the design",
			action_type: "Press your palm against the design",
			attack: {
				type: "radiant",
				damage: "0",
				damage_type: "",
				mode: "self",
				modifier: "",
				resolution: "automatic",
			},
			condition: "Stunning",
			damage_profile: "N/A (utility/defensive)",
			duration: "1 hour",
			frequency: "1/short rest",
			lattice_interaction:
				"Yggdrasil-Class Sap resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies spine tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			saving_throw: { ability: "", dc: 0, failure: "", success: "" },
			special_abilities: [
				"Inscription requires: Yggdrasil-Class Sap, DC 21 tattooing check, 4 hours of uninterrupted work",
			],
			stat_bonuses: {},
		},
		resonance_effect: "Synergizes with other physical bodily enchantments.",
	},
	{
		id: "tattoo_49",
		name: "Astral Projection",
		display_name: "Astral Projection",
		source_book: "Rift Ascendant Canon",
		description:
			"Leave your physical body behind safely. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain Rift beasts.",
		rarity: "legendary",
		image: "/generated/effects/darkness-shroud.webp",
		effects: {
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Activated by directing attention to the glyph. to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			passive: ["Your movement speed increases by 10 feet."],
			passiveBonuses: [{ value: 1, stat: "cold aura" }],
			primary: "Your movement speed increases by 10 feet.",
			primaryEffect: "Your movement speed increases by 10 feet.",
			secondary:
				"Your unarmed strikes deal an additional 1d4 of the tattoo's element.",
			secondaryEffect: "",
			tertiary:
				"Resonance: When multiple tattoos are active, gain +1 AC per active tattoo.",
		},
		attunement: true,
		lore: {
			current_owner:
				"Widely issued to qualifying Ascendants through Bureau studios.",
			curse: "",
			history:
				"Subject to Bureau augmentation oversight and annual review. The Astral Projection carried the story forward.",
			origin:
				"Developed by Bureau-licensed alchemical tattooists for field Ascendants. The Astral Projection entered service from there.",
			personality: "Neutral in personality profile.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Rends the chains of mortality. The reason S-Rank Rifts are feared.",
		discovery_lore:
			"Logged by the Bureau's issue-desk after a scheduled handover.",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		active_veins: ["Third Eye"],
		body_part: "Third Eye",
		ink_type: "Astral Diamond Dust",
		limitations: {
			requires_attunement: true,
			charges: 0,
			conditions: [
				"Requires tattoo attunement slot (third eye)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 1000,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			recharge: "Short rest",
			uses: "Passive only",
			uses_per_rest: 3,
		},
		mechanics: {
			type: "Tattoo",
			ability: "Presence",
			action: "Activated by directing attention to the glyph.",
			action_type: "Activated by directing attention to the glyph.",
			attack: {
				type: "cold",
				damage: "0",
				damage_type: "",
				mode: "self",
				modifier: "",
				resolution: "automatic",
			},
			condition: "Fear",
			damage_profile: "utility",
			duration: "1 minute",
			frequency: "Proficiency/long rest",
			lattice_interaction:
				"Astral Diamond Dust resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies third eye tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			saving_throw: { ability: "", dc: 0, failure: "", success: "" },
			special_abilities: [
				"Inscription requires: Astral Diamond Dust, DC 12 tattooing check, 4 hours of uninterrupted work",
			],
			stat_bonuses: {},
		},
		resonance_effect: "Synergizes with other physical bodily enchantments.",
	},
	{
		id: "tattoo_50",
		name: "Time Stop",
		display_name: "Time Stop",
		source_book: "Rift Ascendant Canon",
		description:
			"Freeze time for a few seconds. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain Rift beasts.",
		rarity: "legendary",
		image: "/generated/effects/arcane-sigil.webp",
		effects: {
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Press your palm against the design to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			passive: ["Gain +2 to Strength while the tattoo is active."],
			passiveBonuses: [{ value: 1, stat: "thunder aura" }],
			primary: "Gain +2 to Strength while the tattoo is active.",
			primaryEffect: "Gain +2 to Strength while the tattoo is active.",
			secondary:
				"You ignore the first instance of this damage type each combat.",
			secondaryEffect: "",
			tertiary:
				"Emergency Pulse: When reduced to 0 HP, the tattoo activates automatically (1/long rest).",
		},
		attunement: true,
		lore: {
			current_owner: "Common at Guild-authorized dermal-mod clinics.",
			curse: "",
			history:
				"Tracked through the Guild Bureau's compliance schedule. The Time Stop's service record notes as much.",
			origin:
				"Formulated within the Guild's authorized dermal-mod program. Archived under the Time Stop designation.",
			personality: "Quiet between activations.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor: "Rends the illusion of safety. The reason S-Rank Rifts are feared.",
		discovery_lore:
			"Discovered by an E-Rank Ascendant who stumbled into an unmarked side passage during a routine Rift clear. Logged on arrival as the Time Stop.",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		active_veins: ["Chest"],
		body_part: "Chest",
		ink_type: "Primordial Chrono-dust",
		limitations: {
			requires_attunement: true,
			charges: 0,
			conditions: [
				"Requires tattoo attunement slot (chest)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 250,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			recharge: "Long rest",
			uses: "Proficiency/long rest",
			uses_per_rest: 1,
		},
		mechanics: {
			type: "Tattoo",
			ability: "Vitality",
			action: "Press your palm against the design",
			action_type: "Press your palm against the design",
			attack: {
				type: "thunder",
				damage: "0",
				damage_type: "",
				mode: "self",
				modifier: "",
				resolution: "automatic",
			},
			condition: "Paralysis",
			damage_profile: "utility",
			duration: "Permanent (passive)",
			frequency: "Passive",
			lattice_interaction:
				"Primordial Chrono-dust resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies chest tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			saving_throw: { ability: "", dc: 0, failure: "", success: "" },
			special_abilities: [
				"Inscription requires: Primordial Chrono-dust, DC 17 tattooing check, 4 hours of uninterrupted work",
			],
			stat_bonuses: {},
		},
		resonance_effect: "Synergizes with other physical bodily enchantments.",
	},
	{
		id: "tattoo_s_1",
		name: "Regent's Authority",
		display_name: "Regent's Authority",
		source_book: "Rift Ascendant Canon",
		description:
			"Force any being of lower Ascendant rank to kneel. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain Rift beasts.",
		rarity: "legendary",
		image: "/generated/effects/darkness-shroud.webp",
		effects: {
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Flex the tattooed muscle group to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			passive: ["You can see in magical darkness out to 60 feet."],
			passiveBonuses: [{ value: 1, stat: "cold aura" }],
			primary: "You can see in magical darkness out to 60 feet.",
			primaryEffect: "You can see in magical darkness out to 60 feet.",
			secondary:
				"The ink glows faintly, granting advantage on Intimidation checks.",
			secondaryEffect: "",
			tertiary:
				"Resonance: When multiple tattoos are active, gain +1 AC per active tattoo.",
		},
		attunement: true,
		lore: {
			current_owner: "Common at Guild-authorized dermal-mod clinics.",
			curse: "",
			history:
				"Tracked through the Guild Bureau's compliance schedule. The Regent's Authority's service record notes as much.",
			origin:
				"Formulated within the Guild's authorized dermal-mod program. The Regent's Authority entered service from there.",
			personality: "Quiet between activations.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Erases the flow of causality. Proof that some things cannot be survived.",
		discovery_lore:
			"Found washed ashore near a coastal Rift, wrapped in fabric that dissolved upon touch.",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		active_veins: ["Neck"],
		body_part: "Neck",
		ink_type: "Regent Essence",
		limitations: {
			requires_attunement: true,
			charges: 0,
			conditions: [
				"Requires tattoo attunement slot (neck)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 2500,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			recharge: "Short rest",
			uses: "Proficiency/long rest",
			uses_per_rest: 2,
		},
		mechanics: {
			type: "Tattoo",
			ability: "Presence",
			action: "Flex the tattooed muscle group",
			action_type: "Flex the tattooed muscle group",
			attack: {
				type: "cold",
				damage: "0",
				damage_type: "",
				mode: "self",
				modifier: "",
				resolution: "automatic",
			},
			condition: "Paralysis",
			damage_profile: "utility",
			duration: "10 minutes",
			frequency: "Proficiency/long rest",
			lattice_interaction:
				"Regent Essence resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies neck tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			saving_throw: { ability: "", dc: 0, failure: "", success: "" },
			special_abilities: [
				"Inscription requires: Regent Essence, DC 16 tattooing check, 4 hours of uninterrupted work",
			],
			stat_bonuses: {},
		},
		resonance_effect: "Synergizes with other physical bodily enchantments.",
	},
	{
		id: "tattoo_s_2",
		name: "Fate Weaver's Thread",
		display_name: "Fate Weaver's Thread",
		source_book: "Rift Ascendant Canon",
		description:
			"Temporarily warp destiny to grant luck and avert death. This ink weaves directly into the subject's soul, imbuing their physical form with the essence of slain Rift beasts.",
		rarity: "legendary",
		image: "/generated/effects/darkness-shroud.webp",
		effects: {
			active: [
				{
					name: "Tattoo Activation",
					description:
						"Channel mana through the ink circuits to activate for 1 minute.",
					action: "Bonus Action",
					frequency: "1/short rest",
				},
			],
			passive: ["Gain +2 to Strength while the tattoo is active."],
			passiveBonuses: [{ value: 1, stat: "psychic aura" }],
			primary: "Gain +2 to Strength while the tattoo is active.",
			primaryEffect: "Gain +2 to Strength while the tattoo is active.",
			secondary: "Allies within 5 feet gain +1 to saving throws.",
			secondaryEffect: "",
			tertiary:
				"Resonance: When multiple tattoos are active, gain +1 AC per active tattoo.",
		},
		attunement: true,
		lore: {
			current_owner: "Applied routinely to qualifying field operatives.",
			curse: "",
			history:
				"Logged in the Bureau's ongoing dermal-mod registry. The Fate Weaver's Thread's service record notes as much.",
			origin:
				"Inked by Bureau-credentialed studio practitioners. Bureau provenance files log it as the Fate Weaver's Thread.",
			personality: "Unobtrusive while not being used.",
			prior_owners: ["Guild Outcasts", "Assassin Ascendants"],
		},
		flavor:
			"Mirrors the boundary between life and death. The last thing many anomalies ever see.",
		discovery_lore:
			"Recovered from a time-locked chest that required three different elemental keys to open. The recovery slip named it the Fate Weaver's Thread.",
		tags: ["tattoo", "magic-weave", "hunter-augmentation"],
		theme_tags: ["hunter-mod", "mana-blood", "boss-essence"],
		active_veins: ["Right Arm"],
		body_part: "Right Arm",
		ink_type: "Oracle Thread",
		limitations: {
			requires_attunement: true,
			charges: 0,
			conditions: [
				"Requires tattoo attunement slot (right arm)",
				"Tattoo attunement is independent from equipment attunement",
				"Max tattoos = Proficiency Bonus",
			],
			consumable: false,
			cost: 100,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			recharge: "Short rest",
			uses: "Passive only",
			uses_per_rest: 3,
		},
		mechanics: {
			type: "Tattoo",
			ability: "Intelligence",
			action: "Channel mana through the ink circuits",
			action_type: "Channel mana through the ink circuits",
			attack: {
				type: "psychic",
				damage: "0",
				damage_type: "",
				mode: "self",
				modifier: "",
				resolution: "automatic",
			},
			condition: "Paralysis",
			damage_profile: "utility",
			duration: "10 minutes",
			frequency: "Proficiency/long rest",
			lattice_interaction:
				"Oracle Thread resonates with the bearer's mana lattice through dermal contact",
			restrictions: [
				"Occupies right arm tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
			],
			saving_throw: { ability: "", dc: 0, failure: "", success: "" },
			special_abilities: [
				"Inscription requires: Oracle Thread, DC 21 tattooing check, 4 hours of uninterrupted work",
			],
			stat_bonuses: {},
		},
		resonance_effect: "Synergizes with other physical bodily enchantments.",
	},
];
