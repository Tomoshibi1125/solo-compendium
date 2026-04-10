import type { CompendiumTattoo } from "@/types/compendium";

export const tattoos: CompendiumTattoo[] = [
	{
		id: "tattoo_1",
		name: "Volatile Ironclad Veins",
		display_name: "Volatile Ironclad Veins",
		description:
			"An intricate Void Ink tattoo inscribed on the right leg. The sigil-work pulses with contained mana, its lines shifting subtly when the bearer enters combat. Press your palm against the design to unleash its stored power. This tattoo occupies one tattoo attunement slot (separate from equipment attunement).",
		rarity: "common",
		attunement: true,
		body_part: "Left Forearm",
		ink_type: "Liquid Tungsten",
		active_veins: ["Left Forearm"],
		resonance_effect: "Skin hardens on impact",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "cyber-magic", "mana-circuit"],
		lore: {
			origin:
				"Unearthed by a mining Guild operating in the mana-saturated quarries of the Australian Outback.",
			history:
				"The European Hunter Council maintains a standing bounty for information regarding its original creator.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		flavor:
			"Commands the certainty of outcomes. The line between Hunter and monster.",
		discovery_lore:
			"Appeared in a Hunter's inventory after a System notification that no one else could see.",
		theme_tags: ["dungeon-core", "mana-overflow", "dimensional-bleed"],
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
			restrictions: [
				"Occupies shoulders tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
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
			charges: 0,
			uses_per_rest: 2,
			consumable: false,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			cost: 250,
		},
	},
	{
		id: "tattoo_2",
		name: "Awakened System Interface Node",
		display_name: "Awakened System Interface Node",
		description:
			"An intricate Titan Marrow Blend tattoo inscribed on the right leg. The sigil-work pulses with contained mana, its lines shifting subtly when the bearer enters combat. Press your palm against the design to unleash its stored power. This tattoo occupies one tattoo attunement slot (separate from equipment attunement).",
		rarity: "uncommon",
		attunement: true,
		body_part: "Neck",
		ink_type: "Dimensional Dust",
		active_veins: ["Neck"],
		resonance_effect: "Allows mental interfacing with artifacts",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "cyber-magic", "mana-circuit"],
		lore: {
			origin:
				"Decoded from ancient sigil-stones found beneath the ruins of a pre-Awakening temple in Kyoto.",
			history:
				"The first recorded use caused a localized reality fracture that took a specialized team forty hours to repair.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		flavor:
			"Devours the concept of distance. Proof that some things cannot be survived.",
		discovery_lore:
			"Appeared in a Hunter's inventory after a System notification that no one else could see.",
		theme_tags: ["guild-ops", "gate-zone"],
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
			restrictions: [
				"Occupies neck tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
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
			charges: 0,
			uses_per_rest: 1,
			consumable: false,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			cost: 500,
		},
	},
	{
		id: "tattoo_3",
		name: "Dormant Beast Monarch Fang",
		display_name: "Dormant Beast Monarch Fang",
		description:
			"An intricate Luminite Extract tattoo inscribed on the spine. The sigil-work pulses with contained mana, its lines shifting subtly when the bearer enters combat. Speak the tattoo's true name to unleash its stored power. This tattoo occupies one tattoo attunement slot (separate from equipment attunement).",
		rarity: "common",
		attunement: true,
		body_part: "Spine",
		ink_type: "S-Rank Beast Blood",
		active_veins: ["Spine"],
		resonance_effect: "Enhances physical strength under moonlight",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "cyber-magic", "mana-circuit"],
		lore: {
			origin:
				"Found clutched in the hand of a petrified E-Rank Hunter who had been missing for three years.",
			history:
				"Historical analysis suggests this predates the modern Gate system by several centuries.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		flavor:
			"Inverts the dimensional barrier. A testament to what Hunters have become.",
		discovery_lore:
			"Excavated from the crystallized mana deposit at the center of a depleted Gate core.",
		theme_tags: ["dimensional-bleed", "post-awakening"],
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
			restrictions: [
				"Occupies back tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
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
			charges: 0,
			uses_per_rest: 3,
			consumable: false,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			cost: 5000,
		},
	},
	{
		id: "tattoo_4",
		name: "Resonant Shadow Sovereign Crest",
		display_name: "Resonant Shadow Sovereign Crest",
		description:
			"An intricate Void Ink tattoo inscribed on the chest. The sigil-work pulses with contained mana, its lines shifting subtly when the bearer enters combat. Press your palm against the design to unleash its stored power. This tattoo occupies one tattoo attunement slot (separate from equipment attunement).",
		rarity: "uncommon",
		attunement: true,
		body_part: "Left Hand",
		ink_type: "Abyssal Extract",
		active_veins: ["Left Hand"],
		resonance_effect: "Grants command over shadows",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "cyber-magic", "mana-circuit"],
		lore: {
			origin:
				"Reverse-engineered from Architect combat data recovered by the Hunter Bureau's R&D division.",
			history:
				"This was the subject of a bidding war between three S-Rank Guilds that nearly escalated to armed conflict.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		flavor:
			"Ignites the last defense of the unprepared. The breaking point of all resistance.",
		discovery_lore:
			"Dropped by a mini-boss that shouldn't have existed according to the Gate's difficulty rating.",
		theme_tags: ["shadow-domain", "forbidden"],
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
			restrictions: [
				"Occupies hands tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
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
			charges: 0,
			uses_per_rest: 1,
			consumable: false,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			cost: 100,
		},
	},
	{
		id: "tattoo_5",
		name: "Harmonic Rift Walker Mark",
		display_name: "Harmonic Rift Walker Mark",
		description:
			"An intricate Starfall Residue tattoo inscribed on the neck. The sigil-work pulses with contained mana, its lines shifting subtly when the bearer enters combat. Channel mana through the ink circuits to unleash its stored power. This tattoo occupies one tattoo attunement slot (separate from equipment attunement).",
		rarity: "common",
		attunement: true,
		body_part: "Chest",
		ink_type: "Void Energy",
		active_veins: ["Chest"],
		resonance_effect: "Short-range spatial jumps",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "cyber-magic", "mana-circuit"],
		lore: {
			origin:
				"Pulled from the dreams of a comatose S-Rank Hunter by a team of psychic-type Awakened.",
			history:
				"Records indicate this was used by the original Clearing Party that neutralized the first S-Rank Gate on Korean soil.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		flavor: "Warps the laws of physics. A whisper from the edge of oblivion.",
		discovery_lore:
			"Traded by a nomadic Awakened who claimed to have no memory of acquiring it.",
		theme_tags: ["guild-ops", "forbidden", "classified"],
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
			restrictions: [
				"Occupies right leg tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
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
			charges: 0,
			uses_per_rest: 3,
			consumable: false,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			cost: 5000,
		},
	},
	{
		id: "tattoo_6",
		name: "Ethereal Necromancer's Pact",
		display_name: "Ethereal Necromancer's Pact",
		description:
			"An intricate Luminite Extract tattoo inscribed on the left leg. The sigil-work pulses with contained mana, its lines shifting subtly when the bearer enters combat. Flex the tattooed muscle group to unleash its stored power. This tattoo occupies one tattoo attunement slot (separate from equipment attunement).",
		rarity: "uncommon",
		attunement: true,
		body_part: "Left Forearm",
		ink_type: "Wraith Essence",
		active_veins: ["Left Forearm"],
		resonance_effect: "Hear the whispers of the fallen",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "cyber-magic", "mana-circuit"],
		lore: {
			origin:
				"Excavated from a pocket dimension that existed for exactly one hour before collapsing.",
			history:
				"Intelligence reports link this to the Shadow Monarch's army, though the connection remains unconfirmed.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		flavor:
			"Purges the chains of mortality. Evolution compressed into a single, violent instant.",
		discovery_lore:
			"Sold by a mysterious merchant who appears only during full moons near active Gate sites.",
		theme_tags: ["guild-ops", "urban-combat", "modern-warfare"],
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
			restrictions: [
				"Occupies left arm tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
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
			charges: 0,
			uses_per_rest: 3,
			consumable: false,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			cost: 100,
		},
	},
	{
		id: "tattoo_7",
		name: "Volatile Necromancer's Pact",
		display_name: "Volatile Necromancer's Pact",
		description:
			"An intricate Abyssal Ichor tattoo inscribed on the shoulders. The sigil-work pulses with contained mana, its lines shifting subtly when the bearer enters combat. Speak the tattoo's true name to unleash its stored power. This tattoo occupies one tattoo attunement slot (separate from equipment attunement).",
		rarity: "common",
		attunement: true,
		body_part: "Spine",
		ink_type: "Wraith Essence",
		active_veins: ["Spine"],
		resonance_effect: "Hear the whispers of the fallen",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "cyber-magic", "mana-circuit"],
		lore: {
			origin:
				"Reconstructed from fragments scattered across seven different C-Rank dungeons.",
			history:
				"Field reports indicate prolonged exposure causes minor spatial distortions in a three-meter radius.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		flavor:
			"Mirrors the threshold of human potential. A whisper from the edge of oblivion.",
		discovery_lore:
			"Discovered by an E-Rank Hunter who stumbled into an unmarked side passage during a routine dungeon clear.",
		theme_tags: ["post-awakening", "monarch-era", "gate-zone"],
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
			restrictions: [
				"Occupies hands tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
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
			charges: 0,
			uses_per_rest: 2,
			consumable: false,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			cost: 1000,
		},
	},
	{
		id: "tattoo_8",
		name: "Harmonic Rift Walker Mark (Awakened)",
		display_name: "Harmonic Rift Walker Mark",
		description:
			"An intricate Titan Marrow Blend tattoo inscribed on the spine. The sigil-work pulses with contained mana, its lines shifting subtly when the bearer enters combat. Channel mana through the ink circuits to unleash its stored power. This tattoo occupies one tattoo attunement slot (separate from equipment attunement).",
		rarity: "uncommon",
		attunement: true,
		body_part: "Right Hand",
		ink_type: "Void Energy",
		active_veins: ["Right Hand"],
		resonance_effect: "Short-range spatial jumps",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "cyber-magic", "mana-circuit"],
		lore: {
			origin:
				"Reverse-engineered from Architect combat data recovered by the Hunter Bureau's R&D division.",
			history:
				"Originally developed as a countermeasure against Monarch-class entities during the Sovereignty Wars.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		flavor:
			"Erases the boundary between life and death. The reason S-Rank Gates are feared.",
		discovery_lore:
			"Gifted by the System itself as a reward for completing a hidden quest chain.",
		theme_tags: ["dungeon-core", "shadow-domain", "hunter-bureau"],
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
			restrictions: [
				"Occupies left leg tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
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
			charges: 0,
			uses_per_rest: 2,
			consumable: false,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			cost: 1000,
		},
	},
	{
		id: "tattoo_9",
		name: "Harmonic Mana Core Circuit",
		display_name: "Harmonic Mana Core Circuit",
		description:
			"An intricate Starfall Residue tattoo inscribed on the ribs. The sigil-work pulses with contained mana, its lines shifting subtly when the bearer enters combat. Channel mana through the ink circuits to unleash its stored power. This tattoo occupies one tattoo attunement slot (separate from equipment attunement).",
		rarity: "common",
		attunement: true,
		body_part: "Spine",
		ink_type: "Liquid Mana",
		active_veins: ["Spine"],
		resonance_effect: "Increases max MP/Mana equivalent",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "cyber-magic", "mana-circuit"],
		lore: {
			origin:
				"Born from a System glitch that briefly merged two overlapping Gate instances.",
			history:
				"Field reports indicate prolonged exposure causes minor spatial distortions in a three-meter radius.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		flavor:
			"Absorbs the threshold of human potential. The breaking point of all resistance.",
		discovery_lore:
			"Emerged from a Gate Boss's dissolution cloud, hovering where the creature's heart had been.",
		theme_tags: ["elite-tier", "black-market"],
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
			restrictions: [
				"Occupies left arm tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
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
			charges: 0,
			uses_per_rest: 3,
			consumable: false,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			cost: 5000,
		},
	},
	{
		id: "tattoo_10",
		name: "Volatile Ironclad Veins (Awakened)",
		display_name: "Volatile Ironclad Veins",
		description:
			"An intricate Rift Essence Suspension tattoo inscribed on the shoulders. The sigil-work pulses with contained mana, its lines shifting subtly when the bearer enters combat. Channel mana through the ink circuits to unleash its stored power. This tattoo occupies one tattoo attunement slot (separate from equipment attunement).",
		rarity: "uncommon",
		attunement: true,
		body_part: "Left Shoulder",
		ink_type: "Liquid Tungsten",
		active_veins: ["Left Shoulder"],
		resonance_effect: "Skin hardens on impact",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "cyber-magic", "mana-circuit"],
		lore: {
			origin:
				"Unearthed by a mining Guild operating in the mana-saturated quarries of the Australian Outback.",
			history:
				"Combat logs from the Busan Incident show this was used to hold a Gate breach for forty-seven minutes.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		flavor:
			"Warps the dimensional barrier. Evolution compressed into a single, violent instant.",
		discovery_lore:
			"Materialized on a Hunter's workbench overnight, leaving scorch marks in the shape of unknown glyphs.",
		theme_tags: ["survival", "modern-warfare", "system-glitch"],
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
			restrictions: [
				"Occupies right arm tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
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
			charges: 0,
			uses_per_rest: 3,
			consumable: false,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			cost: 500,
		},
	},
	{
		id: "tattoo_11",
		name: "Cursed System Interface Node",
		display_name: "Cursed System Interface Node",
		description:
			"An intricate Starfall Residue tattoo inscribed on the back. The sigil-work pulses with contained mana, its lines shifting subtly when the bearer enters combat. Speak the tattoo's true name to unleash its stored power. This tattoo occupies one tattoo attunement slot (separate from equipment attunement).",
		rarity: "common",
		attunement: true,
		body_part: "Left Hand",
		ink_type: "Dimensional Dust",
		active_veins: ["Left Hand"],
		resonance_effect: "Allows mental interfacing with artifacts",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "cyber-magic", "mana-circuit"],
		lore: {
			origin:
				"Synthesized in the clandestine laboratories beneath the Chinese Hunter Bureau headquarters.",
			history:
				"The Japanese Hunter Association attempted to classify this as a national treasure to prevent export.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		flavor:
			"Dissolves the silence between heartbeats. A whisper from the edge of oblivion.",
		discovery_lore:
			"Sold by a mysterious merchant who appears only during full moons near active Gate sites.",
		theme_tags: ["system-glitch", "dungeon-core", "hunter-bureau"],
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
			restrictions: [
				"Occupies back tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
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
			charges: 0,
			uses_per_rest: 2,
			consumable: false,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			cost: 2500,
		},
	},
	{
		id: "tattoo_12",
		name: "Volatile Rift Walker Mark",
		display_name: "Volatile Rift Walker Mark",
		description:
			"An intricate Void Ink tattoo inscribed on the chest. The sigil-work pulses with contained mana, its lines shifting subtly when the bearer enters combat. Flex the tattooed muscle group to unleash its stored power. This tattoo occupies one tattoo attunement slot (separate from equipment attunement).",
		rarity: "common",
		attunement: true,
		body_part: "Neck",
		ink_type: "Void Energy",
		active_veins: ["Neck"],
		resonance_effect: "Short-range spatial jumps",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "cyber-magic", "mana-circuit"],
		lore: {
			origin:
				"Leaked through a micro-rift that appeared inside the International Hunter Conference hall.",
			history:
				"The European Hunter Council maintains a standing bounty for information regarding its original creator.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		flavor:
			"Rends the certainty of outcomes. A testament to what Hunters have become.",
		discovery_lore:
			"Excavated from the crystallized mana deposit at the center of a depleted Gate core.",
		theme_tags: ["ancient-power", "rift-energy", "classified"],
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
			restrictions: [
				"Occupies chest tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
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
			charges: 0,
			uses_per_rest: 1,
			consumable: false,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			cost: 500,
		},
	},
	{
		id: "tattoo_13",
		name: "Awakened Ironclad Veins",
		display_name: "Awakened Ironclad Veins",
		description:
			"An intricate Storm Essence Distillate tattoo inscribed on the right leg. The sigil-work pulses with contained mana, its lines shifting subtly when the bearer enters combat. Press your palm against the design to unleash its stored power. This tattoo occupies one tattoo attunement slot (separate from equipment attunement).",
		rarity: "common",
		attunement: true,
		body_part: "Left Hand",
		ink_type: "Liquid Tungsten",
		active_veins: ["Left Hand"],
		resonance_effect: "Skin hardens on impact",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "cyber-magic", "mana-circuit"],
		lore: {
			origin:
				"Excavated from a pocket dimension that existed for exactly one hour before collapsing.",
			history:
				"The first recorded use caused a localized reality fracture that took a specialized team forty hours to repair.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		flavor:
			"Purges the concept of distance. Proof that some things cannot be survived.",
		discovery_lore:
			"Traded by a nomadic Awakened who claimed to have no memory of acquiring it.",
		theme_tags: ["dungeon-core", "system-glitch"],
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
			restrictions: [
				"Occupies left arm tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
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
			charges: 0,
			uses_per_rest: 1,
			consumable: false,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			cost: 2500,
		},
	},
	{
		id: "tattoo_14",
		name: "Fractured Rift Walker Mark",
		display_name: "Fractured Rift Walker Mark",
		description:
			"An intricate Phoenix Ash Emulsion tattoo inscribed on the spine. The sigil-work pulses with contained mana, its lines shifting subtly when the bearer enters combat. Speak the tattoo's true name to unleash its stored power. This tattoo occupies one tattoo attunement slot (separate from equipment attunement).",
		rarity: "uncommon",
		attunement: true,
		body_part: "Spine",
		ink_type: "Void Energy",
		active_veins: ["Spine"],
		resonance_effect: "Short-range spatial jumps",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "cyber-magic", "mana-circuit"],
		lore: {
			origin:
				"Confiscated from a black-market dealer operating in the shadow districts of Manila.",
			history:
				"Intelligence reports link this to the Shadow Monarch's army, though the connection remains unconfirmed.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		flavor:
			"Erases the chains of mortality. A whisper from the edge of oblivion.",
		discovery_lore:
			"Located by a detection-type Hunter whose radar ability triggered on an otherwise empty room.",
		theme_tags: ["urban-combat", "forbidden"],
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
			restrictions: [
				"Occupies shoulders tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
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
			charges: 0,
			uses_per_rest: 1,
			consumable: false,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			cost: 250,
		},
	},
	{
		id: "tattoo_15",
		name: "Harmonic Ironclad Veins",
		display_name: "Harmonic Ironclad Veins",
		description:
			"An intricate Shadowblood Tincture tattoo inscribed on the spine. The sigil-work pulses with contained mana, its lines shifting subtly when the bearer enters combat. Press your palm against the design to unleash its stored power. This tattoo occupies one tattoo attunement slot (separate from equipment attunement).",
		rarity: "uncommon",
		attunement: true,
		body_part: "Right Forearm",
		ink_type: "Liquid Tungsten",
		active_veins: ["Right Forearm"],
		resonance_effect: "Skin hardens on impact",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "cyber-magic", "mana-circuit"],
		lore: {
			origin:
				"Unearthed by a mining Guild operating in the mana-saturated quarries of the Australian Outback.",
			history:
				"Archaeological evidence suggests ancient civilizations may have accessed similar power through ritual sacrifice.",
			curse:
				"The user becomes unable to dream, replaced by visions of the void between Gates.",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		flavor:
			"Purges the chains of mortality. A whisper from the edge of oblivion.",
		discovery_lore:
			"Appeared in a Hunter's inventory after a System notification that no one else could see.",
		theme_tags: ["dungeon-core", "post-awakening", "rift-energy"],
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
			restrictions: [
				"Occupies hands tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
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
			charges: 0,
			uses_per_rest: 2,
			consumable: false,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			cost: 500,
		},
	},
	{
		id: "tattoo_16",
		name: "Ascendant Rift Walker Mark",
		display_name: "Ascendant Rift Walker Mark",
		description:
			"An intricate Starfall Residue tattoo inscribed on the left leg. The sigil-work pulses with contained mana, its lines shifting subtly when the bearer enters combat. Focus your intent on the glyph to unleash its stored power. This tattoo occupies one tattoo attunement slot (separate from equipment attunement).",
		rarity: "common",
		attunement: true,
		body_part: "Back",
		ink_type: "Void Energy",
		active_veins: ["Back"],
		resonance_effect: "Short-range spatial jumps",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "cyber-magic", "mana-circuit"],
		lore: {
			origin:
				"Gifted by a dying Regent as payment for a debt that predates human civilization.",
			history:
				"Field reports indicate prolonged exposure causes minor spatial distortions in a three-meter radius.",
			curse:
				"Prolonged wielders report hearing a second heartbeat that doesn't match their own.",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		flavor:
			"Corrodes the threshold of human potential. A beautiful catastrophe measured in milliseconds.",
		discovery_lore:
			"Found in a hidden compartment of a relic weapon that had been in Guild storage for years.",
		theme_tags: ["forbidden", "monarch-era"],
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
			restrictions: [
				"Occupies back tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
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
			charges: 0,
			uses_per_rest: 2,
			consumable: false,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			cost: 2500,
		},
	},
	{
		id: "tattoo_17",
		name: "Ascendant Frost Elf Sigil",
		display_name: "Ascendant Frost Elf Sigil",
		description:
			"An intricate Storm Essence Distillate tattoo inscribed on the right leg. The sigil-work pulses with contained mana, its lines shifting subtly when the bearer enters combat. Press your palm against the design to unleash its stored power. This tattoo occupies one tattoo attunement slot (separate from equipment attunement).",
		rarity: "common",
		attunement: true,
		body_part: "Right Shoulder",
		ink_type: "Absolute Zero Ink",
		active_veins: ["Right Shoulder"],
		resonance_effect: "Radiates an aura of frost",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "cyber-magic", "mana-circuit"],
		lore: {
			origin:
				"Reverse-engineered from Architect combat data recovered by the Hunter Bureau's R&D division.",
			history:
				"Multiple Guilds have attempted to replicate this; all reproductions have proven inferior to the original.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		flavor:
			"Eclipses the illusion of safety. A beautiful catastrophe measured in milliseconds.",
		discovery_lore:
			"Purchased from a black-market auction in the underground district of Neo-Seoul for an undisclosed sum.",
		theme_tags: ["elite-tier", "mana-overflow", "ancient-power"],
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
			restrictions: [
				"Occupies spine tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
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
			charges: 0,
			uses_per_rest: 3,
			consumable: false,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			cost: 2500,
		},
	},
	{
		id: "tattoo_18",
		name: "Ascendant Necromancer's Pact",
		display_name: "Ascendant Necromancer's Pact",
		description:
			"An intricate Abyssal Ichor tattoo inscribed on the neck. The sigil-work pulses with contained mana, its lines shifting subtly when the bearer enters combat. Speak the tattoo's true name to unleash its stored power. This tattoo occupies one tattoo attunement slot (separate from equipment attunement).",
		rarity: "common",
		attunement: true,
		body_part: "Left Forearm",
		ink_type: "Wraith Essence",
		active_veins: ["Left Forearm"],
		resonance_effect: "Hear the whispers of the fallen",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "cyber-magic", "mana-circuit"],
		lore: {
			origin:
				"Translated from forbidden shadow-language inscriptions found in a Monarch's throne room.",
			history:
				"Intelligence reports link this to the Shadow Monarch's army, though the connection remains unconfirmed.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		flavor:
			"Reclaims the illusion of safety. A testament to what Hunters have become.",
		discovery_lore:
			"Discovered by an E-Rank Hunter who stumbled into an unmarked side passage during a routine dungeon clear.",
		theme_tags: ["system-glitch", "experimental"],
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
			restrictions: [
				"Occupies ribs tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
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
			charges: 0,
			uses_per_rest: 3,
			consumable: false,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			cost: 250,
		},
	},
	{
		id: "tattoo_19",
		name: "Dormant Rift Walker Mark",
		display_name: "Dormant Rift Walker Mark",
		description:
			"An intricate Storm Essence Distillate tattoo inscribed on the right leg. The sigil-work pulses with contained mana, its lines shifting subtly when the bearer enters combat. Speak the tattoo's true name to unleash its stored power. This tattoo occupies one tattoo attunement slot (separate from equipment attunement).",
		rarity: "rare",
		attunement: true,
		body_part: "Back",
		ink_type: "Void Energy",
		active_veins: ["Back"],
		resonance_effect: "Short-range spatial jumps",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "cyber-magic", "mana-circuit"],
		lore: {
			origin:
				"Distilled from the ambient mana of a Red Gate that refused to close for seventeen days.",
			history:
				"The Japanese Hunter Association attempted to classify this as a national treasure to prevent export.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		flavor:
			"Binds the silence between heartbeats. Evolution compressed into a single, violent instant.",
		discovery_lore:
			"Found washed ashore near a coastal Gate, wrapped in fabric that dissolved upon touch.",
		theme_tags: ["mana-overflow", "modern-warfare"],
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
			restrictions: [
				"Occupies left arm tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
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
			charges: 0,
			uses_per_rest: 2,
			consumable: false,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			cost: 100,
		},
	},
	{
		id: "tattoo_20",
		name: "Dormant Ironclad Veins",
		display_name: "Dormant Ironclad Veins",
		description:
			"An intricate Storm Essence Distillate tattoo inscribed on the hands. The sigil-work pulses with contained mana, its lines shifting subtly when the bearer enters combat. Focus your intent on the glyph to unleash its stored power. This tattoo occupies one tattoo attunement slot (separate from equipment attunement).",
		rarity: "common",
		attunement: true,
		body_part: "Left Hand",
		ink_type: "Liquid Tungsten",
		active_veins: ["Left Hand"],
		resonance_effect: "Skin hardens on impact",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "cyber-magic", "mana-circuit"],
		lore: {
			origin:
				"Pulled from the dreams of a comatose S-Rank Hunter by a team of psychic-type Awakened.",
			history:
				"This technique was banned by the International Guild Association for eighteen months before being reclassified.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		flavor:
			"Warps the architect's design. The breaking point of all resistance.",
		discovery_lore:
			"Excavated from the crystallized mana deposit at the center of a depleted Gate core.",
		theme_tags: ["post-awakening", "guild-ops", "urban-combat"],
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
			restrictions: [
				"Occupies hands tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
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
			charges: 0,
			uses_per_rest: 1,
			consumable: false,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			cost: 5000,
		},
	},
	{
		id: "tattoo_21",
		name: "Volatile Shadow Sovereign Crest",
		display_name: "Volatile Shadow Sovereign Crest",
		description:
			"An intricate Shadowblood Tincture tattoo inscribed on the hands. The sigil-work pulses with contained mana, its lines shifting subtly when the bearer enters combat. Channel mana through the ink circuits to unleash its stored power. This tattoo occupies one tattoo attunement slot (separate from equipment attunement).",
		rarity: "common",
		attunement: true,
		body_part: "Left Forearm",
		ink_type: "Abyssal Extract",
		active_veins: ["Left Forearm"],
		resonance_effect: "Grants command over shadows",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "cyber-magic", "mana-circuit"],
		lore: {
			origin:
				"Salvaged from the corpse of an S-Rank anomaly that breached containment in the European Dead Zone.",
			history:
				"Combat logs from the Busan Incident show this was used to hold a Gate breach for forty-seven minutes.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		flavor:
			"Crushes the architecture of the soul. Evolution compressed into a single, violent instant.",
		discovery_lore:
			"Dropped by a mini-boss that shouldn't have existed according to the Gate's difficulty rating.",
		theme_tags: ["guild-ops", "rift-energy", "forbidden"],
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
			restrictions: [
				"Occupies ribs tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
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
			charges: 0,
			uses_per_rest: 1,
			consumable: false,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			cost: 250,
		},
	},
	{
		id: "tattoo_22",
		name: "Awakened Mana Core Circuit",
		display_name: "Awakened Mana Core Circuit",
		description:
			"An intricate Storm Essence Distillate tattoo inscribed on the spine. The sigil-work pulses with contained mana, its lines shifting subtly when the bearer enters combat. Channel mana through the ink circuits to unleash its stored power. This tattoo occupies one tattoo attunement slot (separate from equipment attunement).",
		rarity: "rare",
		attunement: true,
		body_part: "Right Shoulder",
		ink_type: "Liquid Mana",
		active_veins: ["Right Shoulder"],
		resonance_effect: "Increases max MP/Mana equivalent",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "cyber-magic", "mana-circuit"],
		lore: {
			origin:
				"Found clutched in the hand of a petrified E-Rank Hunter who had been missing for three years.",
			history:
				"Guild archives show at least three S-Rank Hunters have died attempting to master its full potential.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		flavor:
			"Inverts the boundary between life and death. Evolution compressed into a single, violent instant.",
		discovery_lore:
			"Excavated from the crystallized mana deposit at the center of a depleted Gate core.",
		theme_tags: ["mana-overflow", "elite-tier", "monarch-era"],
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
			restrictions: [
				"Occupies shoulders tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
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
			charges: 0,
			uses_per_rest: 2,
			consumable: false,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			cost: 1000,
		},
	},
	{
		id: "tattoo_23",
		name: "Cursed Ignis Brand",
		display_name: "Cursed Ignis Brand",
		description:
			"An intricate Rift Essence Suspension tattoo inscribed on the left leg. The sigil-work pulses with contained mana, its lines shifting subtly when the bearer enters combat. Focus your intent on the glyph to unleash its stored power. This tattoo occupies one tattoo attunement slot (separate from equipment attunement).",
		rarity: "common",
		attunement: true,
		body_part: "Chest",
		ink_type: "Dragon's Breath",
		active_veins: ["Chest"],
		resonance_effect: "Fire damage absorption",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "cyber-magic", "mana-circuit"],
		lore: {
			origin:
				"Crystallized from raw mana overflow during the catastrophic Seoul Gate Breach of Year 7.",
			history:
				"Records indicate this was used by the original Clearing Party that neutralized the first S-Rank Gate on Korean soil.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		flavor:
			"Ignites the laws of physics. The death of hesitation, made manifest.",
		discovery_lore:
			"Emerged from a Gate Boss's dissolution cloud, hovering where the creature's heart had been.",
		theme_tags: ["gate-zone", "dungeon-core"],
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
			restrictions: [
				"Occupies left arm tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
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
			charges: 0,
			uses_per_rest: 2,
			consumable: false,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			cost: 250,
		},
	},
	{
		id: "tattoo_24",
		name: "Harmonic Ironclad Veins (Eclipse)",
		display_name: "Harmonic Ironclad Veins",
		description:
			"An intricate Starfall Residue tattoo inscribed on the chest. The sigil-work pulses with contained mana, its lines shifting subtly when the bearer enters combat. Channel mana through the ink circuits to unleash its stored power. This tattoo occupies one tattoo attunement slot (separate from equipment attunement).",
		rarity: "uncommon",
		attunement: true,
		body_part: "Chest",
		ink_type: "Liquid Tungsten",
		active_veins: ["Chest"],
		resonance_effect: "Skin hardens on impact",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "cyber-magic", "mana-circuit"],
		lore: {
			origin:
				"Recovered from the personal vault of a National-Level Hunter who vanished during the Jeju Island Raid.",
			history:
				"A-Rank appraiser Yoo Myung-Han personally verified its authenticity before it entered general circulation.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		flavor:
			"Reclaims the laws of physics. Proof that some things cannot be survived.",
		discovery_lore:
			"Materialized on a Hunter's workbench overnight, leaving scorch marks in the shape of unknown glyphs.",
		theme_tags: ["dungeon-core", "system-glitch", "survival"],
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
			restrictions: [
				"Occupies hands tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
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
			charges: 0,
			uses_per_rest: 1,
			consumable: false,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			cost: 1000,
		},
	},
	{
		id: "tattoo_25",
		name: "Harmonic Ignis Brand",
		display_name: "Harmonic Ignis Brand",
		description:
			"An intricate Phoenix Ash Emulsion tattoo inscribed on the left leg. The sigil-work pulses with contained mana, its lines shifting subtly when the bearer enters combat. Flex the tattooed muscle group to unleash its stored power. This tattoo occupies one tattoo attunement slot (separate from equipment attunement).",
		rarity: "rare",
		attunement: true,
		body_part: "Right Shoulder",
		ink_type: "Dragon's Breath",
		active_veins: ["Right Shoulder"],
		resonance_effect: "Fire damage absorption",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "cyber-magic", "mana-circuit"],
		lore: {
			origin:
				"Formed naturally in a mana vein so dense that reality itself began to crystallize around it.",
			history:
				"Records indicate this was used by the original Clearing Party that neutralized the first S-Rank Gate on Korean soil.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		flavor:
			"Corrodes the fabric of reality. The last thing many anomalies ever see.",
		discovery_lore:
			"Found pulsing with residual mana in the aftermath of a Gate break, half-buried in shattered concrete.",
		theme_tags: ["dungeon-core", "black-market"],
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
			restrictions: [
				"Occupies chest tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
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
			charges: 0,
			uses_per_rest: 1,
			consumable: false,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			cost: 100,
		},
	},
	{
		id: "tattoo_26",
		name: "Ethereal System Interface Node",
		display_name: "Ethereal System Interface Node",
		description:
			"An intricate Starfall Residue tattoo inscribed on the left arm. The sigil-work pulses with contained mana, its lines shifting subtly when the bearer enters combat. Channel mana through the ink circuits to unleash its stored power. This tattoo occupies one tattoo attunement slot (separate from equipment attunement).",
		rarity: "common",
		attunement: true,
		body_part: "Left Forearm",
		ink_type: "Dimensional Dust",
		active_veins: ["Left Forearm"],
		resonance_effect: "Allows mental interfacing with artifacts",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "cyber-magic", "mana-circuit"],
		lore: {
			origin:
				"Leaked through a micro-rift that appeared inside the International Hunter Conference hall.",
			history:
				"A-Rank appraiser Yoo Myung-Han personally verified its authenticity before it entered general circulation.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		flavor:
			"Rends the flow of causality. The breaking point of all resistance.",
		discovery_lore:
			"Dropped by a mini-boss that shouldn't have existed according to the Gate's difficulty rating.",
		theme_tags: ["experimental", "ancient-power", "urban-combat"],
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
			restrictions: [
				"Occupies left arm tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
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
			charges: 0,
			uses_per_rest: 2,
			consumable: false,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			cost: 100,
		},
	},
	{
		id: "tattoo_27",
		name: "Awakened Necromancer's Pact",
		display_name: "Awakened Necromancer's Pact",
		description:
			"An intricate Void Ink tattoo inscribed on the right leg. The sigil-work pulses with contained mana, its lines shifting subtly when the bearer enters combat. Channel mana through the ink circuits to unleash its stored power. This tattoo occupies one tattoo attunement slot (separate from equipment attunement).",
		rarity: "uncommon",
		attunement: true,
		body_part: "Left Forearm",
		ink_type: "Wraith Essence",
		active_veins: ["Left Forearm"],
		resonance_effect: "Hear the whispers of the fallen",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "cyber-magic", "mana-circuit"],
		lore: {
			origin:
				"Crystallized from raw mana overflow during the catastrophic Seoul Gate Breach of Year 7.",
			history:
				"Originally thought to be a failed experiment, it was rediscovered when a junior researcher noticed anomalous readings.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		flavor:
			"Silences the last defense of the unprepared. Evolution compressed into a single, violent instant.",
		discovery_lore:
			"Traded by a nomadic Awakened who claimed to have no memory of acquiring it.",
		theme_tags: ["mana-overflow", "survival"],
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
			restrictions: [
				"Occupies face tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
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
			charges: 0,
			uses_per_rest: 3,
			consumable: false,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			cost: 100,
		},
	},
	{
		id: "tattoo_28",
		name: "Volatile Frost Elf Sigil",
		display_name: "Volatile Frost Elf Sigil",
		description:
			"An intricate Titan Marrow Blend tattoo inscribed on the chest. The sigil-work pulses with contained mana, its lines shifting subtly when the bearer enters combat. Focus your intent on the glyph to unleash its stored power. This tattoo occupies one tattoo attunement slot (separate from equipment attunement).",
		rarity: "common",
		attunement: true,
		body_part: "Right Forearm",
		ink_type: "Absolute Zero Ink",
		active_veins: ["Right Forearm"],
		resonance_effect: "Radiates an aura of frost",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "cyber-magic", "mana-circuit"],
		lore: {
			origin:
				"Synthesized in the clandestine laboratories beneath the Chinese Hunter Bureau headquarters.",
			history:
				"The American Hunter Bureau's Project: Starfall attempted to weaponize this before the program was defunded.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		flavor:
			"Dissolves the remnants of a dead world. The death of hesitation, made manifest.",
		discovery_lore:
			"Found pulsing with residual mana in the aftermath of a Gate break, half-buried in shattered concrete.",
		theme_tags: ["ancient-power", "classified"],
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
			restrictions: [
				"Occupies shoulders tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
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
			charges: 0,
			uses_per_rest: 2,
			consumable: false,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			cost: 500,
		},
	},
	{
		id: "tattoo_29",
		name: "Awakened Frost Elf Sigil",
		display_name: "Awakened Frost Elf Sigil",
		description:
			"An intricate Void Ink tattoo inscribed on the right arm. The sigil-work pulses with contained mana, its lines shifting subtly when the bearer enters combat. Channel mana through the ink circuits to unleash its stored power. This tattoo occupies one tattoo attunement slot (separate from equipment attunement).",
		rarity: "uncommon",
		attunement: true,
		body_part: "Right Hand",
		ink_type: "Absolute Zero Ink",
		active_veins: ["Right Hand"],
		resonance_effect: "Radiates an aura of frost",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "cyber-magic", "mana-circuit"],
		lore: {
			origin:
				"Extracted from the dimensional residue of a collapsed B-Rank Gate in downtown Seoul.",
			history:
				"The American Hunter Bureau's Project: Starfall attempted to weaponize this before the program was defunded.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		flavor:
			"Shatters the remnants of a dead world. A testament to what Hunters have become.",
		discovery_lore:
			"Excavated from the crystallized mana deposit at the center of a depleted Gate core.",
		theme_tags: ["mana-overflow", "gate-zone"],
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
			restrictions: [
				"Occupies hands tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
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
			charges: 0,
			uses_per_rest: 3,
			consumable: false,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			cost: 1000,
		},
	},
	{
		id: "tattoo_30",
		name: "Primordial Rift Walker Mark",
		display_name: "Primordial Rift Walker Mark",
		description:
			"An intricate Abyssal Ichor tattoo inscribed on the shoulders. The sigil-work pulses with contained mana, its lines shifting subtly when the bearer enters combat. Focus your intent on the glyph to unleash its stored power. This tattoo occupies one tattoo attunement slot (separate from equipment attunement).",
		rarity: "rare",
		attunement: true,
		body_part: "Neck",
		ink_type: "Void Energy",
		active_veins: ["Neck"],
		resonance_effect: "Short-range spatial jumps",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "cyber-magic", "mana-circuit"],
		lore: {
			origin:
				"Leaked through a micro-rift that appeared inside the International Hunter Conference hall.",
			history:
				"The Hunter Bureau classified this as a Level-4 threat vector before it was repurposed for field operations.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		flavor: "Rends the laws of physics. The line between Hunter and monster.",
		discovery_lore:
			"Appeared in a Hunter's inventory after a System notification that no one else could see.",
		theme_tags: ["dungeon-core", "urban-combat"],
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
			restrictions: [
				"Occupies back tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
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
			charges: 0,
			uses_per_rest: 3,
			consumable: false,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			cost: 500,
		},
	},
	{
		id: "tattoo_31",
		name: "Harmonic Frost Elf Sigil",
		display_name: "Harmonic Frost Elf Sigil",
		description:
			"An intricate Mana-Crystal Pigment tattoo inscribed on the face. The sigil-work pulses with contained mana, its lines shifting subtly when the bearer enters combat. Speak the tattoo's true name to unleash its stored power. This tattoo occupies one tattoo attunement slot (separate from equipment attunement).",
		rarity: "common",
		attunement: true,
		body_part: "Left Forearm",
		ink_type: "Absolute Zero Ink",
		active_veins: ["Left Forearm"],
		resonance_effect: "Radiates an aura of frost",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "cyber-magic", "mana-circuit"],
		lore: {
			origin:
				"Manifested spontaneously during a double-dungeon event in the American Midwest.",
			history:
				"Archaeological evidence suggests ancient civilizations may have accessed similar power through ritual sacrifice.",
			curse:
				"Each activation permanently reduces the user's maximum HP by 1, imperceptible until it's too late.",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		flavor:
			"Purges the dimensional barrier. A whisper from the edge of oblivion.",
		discovery_lore:
			"Purchased from a black-market auction in the underground district of Neo-Seoul for an undisclosed sum.",
		theme_tags: ["shadow-domain", "ancient-power", "dungeon-core"],
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
			restrictions: [
				"Occupies left arm tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
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
			charges: 0,
			uses_per_rest: 1,
			consumable: false,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			cost: 100,
		},
	},
	{
		id: "tattoo_32",
		name: "Cursed Shadow Sovereign Crest",
		display_name: "Cursed Shadow Sovereign Crest",
		description:
			"An intricate Shadowblood Tincture tattoo inscribed on the ribs. The sigil-work pulses with contained mana, its lines shifting subtly when the bearer enters combat. Focus your intent on the glyph to unleash its stored power. This tattoo occupies one tattoo attunement slot (separate from equipment attunement).",
		rarity: "rare",
		attunement: true,
		body_part: "Left Shoulder",
		ink_type: "Abyssal Extract",
		active_veins: ["Left Shoulder"],
		resonance_effect: "Grants command over shadows",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "cyber-magic", "mana-circuit"],
		lore: {
			origin:
				"Formed naturally in a mana vein so dense that reality itself began to crystallize around it.",
			history:
				"The American Hunter Bureau's Project: Starfall attempted to weaponize this before the program was defunded.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		flavor:
			"Warps the remnants of a dead world. A testament to what Hunters have become.",
		discovery_lore:
			"Gifted by the System itself as a reward for completing a hidden quest chain.",
		theme_tags: ["mana-overflow", "black-market"],
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
			restrictions: [
				"Occupies back tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
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
			charges: 0,
			uses_per_rest: 3,
			consumable: false,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			cost: 5000,
		},
	},
	{
		id: "tattoo_33",
		name: "Fractured Mana Core Circuit",
		display_name: "Fractured Mana Core Circuit",
		description:
			"An intricate Mana-Crystal Pigment tattoo inscribed on the back. The sigil-work pulses with contained mana, its lines shifting subtly when the bearer enters combat. Focus your intent on the glyph to unleash its stored power. This tattoo occupies one tattoo attunement slot (separate from equipment attunement).",
		rarity: "common",
		attunement: true,
		body_part: "Chest",
		ink_type: "Liquid Mana",
		active_veins: ["Chest"],
		resonance_effect: "Increases max MP/Mana equivalent",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "cyber-magic", "mana-circuit"],
		lore: {
			origin:
				"Emerged from the Hunter Association's classified Project: Lattice Break experiments.",
			history:
				"Field reports indicate prolonged exposure causes minor spatial distortions in a three-meter radius.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		flavor:
			"Annihilates the threshold of human potential. The death of hesitation, made manifest.",
		discovery_lore:
			"Found in a hidden compartment of a relic weapon that had been in Guild storage for years.",
		theme_tags: ["dimensional-bleed", "elite-tier"],
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
			restrictions: [
				"Occupies right arm tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
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
			charges: 0,
			uses_per_rest: 2,
			consumable: false,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			cost: 100,
		},
	},
	{
		id: "tattoo_34",
		name: "Dormant Aegis Matrix",
		display_name: "Dormant Aegis Matrix",
		description:
			"An intricate Storm Essence Distillate tattoo inscribed on the shoulders. The sigil-work pulses with contained mana, its lines shifting subtly when the bearer enters combat. Press your palm against the design to unleash its stored power. This tattoo occupies one tattoo attunement slot (separate from equipment attunement).",
		rarity: "uncommon",
		attunement: true,
		body_part: "Right Shoulder",
		ink_type: "Arcane Gold",
		active_veins: ["Right Shoulder"],
		resonance_effect: "Generates an auto-shield when HP is low",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "cyber-magic", "mana-circuit"],
		lore: {
			origin:
				"Created by an unnamed Awakened blacksmith who fed their own life force into the forge.",
			history:
				"Combat logs from the Busan Incident show this was used to hold a Gate breach for forty-seven minutes.",
			curse:
				"Causes mild paranoia after extended use; the user becomes convinced they are being watched through mirrors.",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		flavor:
			"Inverts the last defense of the unprepared. A beautiful catastrophe measured in milliseconds.",
		discovery_lore:
			"Recovered from a time-locked chest that required three different elemental keys to open.",
		theme_tags: ["dimensional-bleed", "shadow-domain", "system-glitch"],
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
			restrictions: [
				"Occupies shoulders tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
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
			charges: 0,
			uses_per_rest: 1,
			consumable: false,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			cost: 1000,
		},
	},
	{
		id: "tattoo_35",
		name: "Ascendant System Interface Node",
		display_name: "Ascendant System Interface Node",
		description:
			"An intricate Void Ink tattoo inscribed on the chest. The sigil-work pulses with contained mana, its lines shifting subtly when the bearer enters combat. Flex the tattooed muscle group to unleash its stored power. This tattoo occupies one tattoo attunement slot (separate from equipment attunement).",
		rarity: "common",
		attunement: true,
		body_part: "Left Forearm",
		ink_type: "Dimensional Dust",
		active_veins: ["Left Forearm"],
		resonance_effect: "Allows mental interfacing with artifacts",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "cyber-magic", "mana-circuit"],
		lore: {
			origin:
				"Extracted from the dimensional residue of a collapsed B-Rank Gate in downtown Seoul.",
			history:
				"The American Hunter Bureau's Project: Starfall attempted to weaponize this before the program was defunded.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		flavor:
			"Shatters the remnants of a dead world. The breaking point of all resistance.",
		discovery_lore:
			"Located by a detection-type Hunter whose radar ability triggered on an otherwise empty room.",
		theme_tags: ["gate-zone", "modern-warfare", "rift-energy"],
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
			restrictions: [
				"Occupies ribs tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
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
			charges: 0,
			uses_per_rest: 3,
			consumable: false,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			cost: 500,
		},
	},
	{
		id: "tattoo_36",
		name: "Fractured Mana Core Circuit (Awakened)",
		display_name: "Fractured Mana Core Circuit",
		description:
			"An intricate Titan Marrow Blend tattoo inscribed on the ribs. The sigil-work pulses with contained mana, its lines shifting subtly when the bearer enters combat. Flex the tattooed muscle group to unleash its stored power. This tattoo occupies one tattoo attunement slot (separate from equipment attunement).",
		rarity: "rare",
		attunement: true,
		body_part: "Right Shoulder",
		ink_type: "Liquid Mana",
		active_veins: ["Right Shoulder"],
		resonance_effect: "Increases max MP/Mana equivalent",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "cyber-magic", "mana-circuit"],
		lore: {
			origin:
				"Distilled from the ambient mana of a Red Gate that refused to close for seventeen days.",
			history:
				"Archaeological evidence suggests ancient civilizations may have accessed similar power through ritual sacrifice.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		flavor:
			"Rends the illusion of safety. Evolution compressed into a single, violent instant.",
		discovery_lore:
			"Located by a detection-type Hunter whose radar ability triggered on an otherwise empty room.",
		theme_tags: ["rift-energy", "survival"],
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
			restrictions: [
				"Occupies back tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
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
			charges: 0,
			uses_per_rest: 2,
			consumable: false,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			cost: 1000,
		},
	},
	{
		id: "tattoo_37",
		name: "Fractured Mana Core Circuit (Eclipse)",
		display_name: "Fractured Mana Core Circuit",
		description:
			"An intricate Shadowblood Tincture tattoo inscribed on the spine. The sigil-work pulses with contained mana, its lines shifting subtly when the bearer enters combat. Flex the tattooed muscle group to unleash its stored power. This tattoo occupies one tattoo attunement slot (separate from equipment attunement).",
		rarity: "common",
		attunement: true,
		body_part: "Chest",
		ink_type: "Liquid Mana",
		active_veins: ["Chest"],
		resonance_effect: "Increases max MP/Mana equivalent",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "cyber-magic", "mana-circuit"],
		lore: {
			origin:
				"Emerged from the Hunter Association's classified Project: Lattice Break experiments.",
			history:
				"Multiple Guilds have attempted to replicate this; all reproductions have proven inferior to the original.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		flavor:
			"Mirrors the flow of causality. The breaking point of all resistance.",
		discovery_lore:
			"Found pulsing with residual mana in the aftermath of a Gate break, half-buried in shattered concrete.",
		theme_tags: ["forbidden", "system-glitch", "rift-energy"],
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
			restrictions: [
				"Occupies chest tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
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
			charges: 0,
			uses_per_rest: 2,
			consumable: false,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			cost: 250,
		},
	},
	{
		id: "tattoo_38",
		name: "Awakened Frost Elf Sigil (Apex)",
		display_name: "Awakened Frost Elf Sigil",
		description:
			"An intricate Void Ink tattoo inscribed on the spine. The sigil-work pulses with contained mana, its lines shifting subtly when the bearer enters combat. Press your palm against the design to unleash its stored power. This tattoo occupies one tattoo attunement slot (separate from equipment attunement).",
		rarity: "common",
		attunement: true,
		body_part: "Back",
		ink_type: "Absolute Zero Ink",
		active_veins: ["Back"],
		resonance_effect: "Radiates an aura of frost",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "cyber-magic", "mana-circuit"],
		lore: {
			origin:
				"Stolen from a Guild vault during the Three-Day War between rival Korean Hunter factions.",
			history:
				"First documented during the Second Awakening Wave, when Hunters worldwide reported spontaneous power surges.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		flavor:
			"Annihilates the threshold of human potential. A testament to what Hunters have become.",
		discovery_lore:
			"Found pulsing with residual mana in the aftermath of a Gate break, half-buried in shattered concrete.",
		theme_tags: ["survival", "system-glitch", "elite-tier"],
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
			restrictions: [
				"Occupies ribs tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
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
			charges: 0,
			uses_per_rest: 1,
			consumable: false,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			cost: 1000,
		},
	},
	{
		id: "tattoo_39",
		name: "Cursed Necromancer's Pact",
		display_name: "Cursed Necromancer's Pact",
		description:
			"An intricate Shadowblood Tincture tattoo inscribed on the ribs. The sigil-work pulses with contained mana, its lines shifting subtly when the bearer enters combat. Flex the tattooed muscle group to unleash its stored power. This tattoo occupies one tattoo attunement slot (separate from equipment attunement).",
		rarity: "rare",
		attunement: true,
		body_part: "Left Shoulder",
		ink_type: "Wraith Essence",
		active_veins: ["Left Shoulder"],
		resonance_effect: "Hear the whispers of the fallen",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "cyber-magic", "mana-circuit"],
		lore: {
			origin:
				"Gifted by a dying Regent as payment for a debt that predates human civilization.",
			history:
				"Multiple Guilds have attempted to replicate this; all reproductions have proven inferior to the original.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		flavor:
			"Mirrors the illusion of safety. The last thing many anomalies ever see.",
		discovery_lore:
			"Materialized on a Hunter's workbench overnight, leaving scorch marks in the shape of unknown glyphs.",
		theme_tags: ["dungeon-core", "classified", "forbidden"],
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
			restrictions: [
				"Occupies neck tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
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
			charges: 0,
			uses_per_rest: 3,
			consumable: false,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			cost: 2500,
		},
	},
	{
		id: "tattoo_40",
		name: "Harmonic Aegis Matrix",
		display_name: "Harmonic Aegis Matrix",
		description:
			"An intricate Shadowblood Tincture tattoo inscribed on the shoulders. The sigil-work pulses with contained mana, its lines shifting subtly when the bearer enters combat. Press your palm against the design to unleash its stored power. This tattoo occupies one tattoo attunement slot (separate from equipment attunement).",
		rarity: "common",
		attunement: true,
		body_part: "Left Shoulder",
		ink_type: "Arcane Gold",
		active_veins: ["Left Shoulder"],
		resonance_effect: "Generates an auto-shield when HP is low",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "cyber-magic", "mana-circuit"],
		lore: {
			origin:
				"Manifested spontaneously during a double-dungeon event in the American Midwest.",
			history:
				"This technique was banned by the International Guild Association for eighteen months before being reclassified.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		flavor:
			"Eclipses the architect's design. A testament to what Hunters have become.",
		discovery_lore:
			"Sold by a mysterious merchant who appears only during full moons near active Gate sites.",
		theme_tags: ["rift-energy", "shadow-domain"],
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
			restrictions: [
				"Occupies hands tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
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
			charges: 0,
			uses_per_rest: 1,
			consumable: false,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			cost: 500,
		},
	},
	{
		id: "tattoo_41",
		name: "Harmonic Frost Elf Sigil (Reborn)",
		display_name: "Harmonic Frost Elf Sigil",
		description:
			"An intricate Rift Essence Suspension tattoo inscribed on the neck. The sigil-work pulses with contained mana, its lines shifting subtly when the bearer enters combat. Press your palm against the design to unleash its stored power. This tattoo occupies one tattoo attunement slot (separate from equipment attunement).",
		rarity: "common",
		attunement: true,
		body_part: "Left Shoulder",
		ink_type: "Absolute Zero Ink",
		active_veins: ["Left Shoulder"],
		resonance_effect: "Radiates an aura of frost",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "cyber-magic", "mana-circuit"],
		lore: {
			origin:
				"Confiscated from a black-market dealer operating in the shadow districts of Manila.",
			history:
				"Guild archives show at least three S-Rank Hunters have died attempting to master its full potential.",
			curse:
				"Prolonged wielders report hearing a second heartbeat that doesn't match their own.",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		flavor:
			"Erases the boundary between life and death. A whisper from the edge of oblivion.",
		discovery_lore:
			"Excavated from the crystallized mana deposit at the center of a depleted Gate core.",
		theme_tags: ["classified", "monarch-era"],
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
			restrictions: [
				"Occupies spine tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
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
			charges: 0,
			uses_per_rest: 2,
			consumable: false,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			cost: 250,
		},
	},
	{
		id: "tattoo_42",
		name: "Volatile Ironclad Veins (Eclipse)",
		display_name: "Volatile Ironclad Veins",
		description:
			"An intricate Titan Marrow Blend tattoo inscribed on the back. The sigil-work pulses with contained mana, its lines shifting subtly when the bearer enters combat. Press your palm against the design to unleash its stored power. This tattoo occupies one tattoo attunement slot (separate from equipment attunement).",
		rarity: "common",
		attunement: true,
		body_part: "Neck",
		ink_type: "Liquid Tungsten",
		active_veins: ["Neck"],
		resonance_effect: "Skin hardens on impact",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "cyber-magic", "mana-circuit"],
		lore: {
			origin:
				"Found clutched in the hand of a petrified E-Rank Hunter who had been missing for three years.",
			history:
				"The Japanese Hunter Association attempted to classify this as a national treasure to prevent export.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		flavor:
			"Corrodes the architecture of the soul. The last thing many anomalies ever see.",
		discovery_lore:
			"Sold by a mysterious merchant who appears only during full moons near active Gate sites.",
		theme_tags: ["monarch-era", "rift-energy", "forbidden"],
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
			restrictions: [
				"Occupies shoulders tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
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
			charges: 0,
			uses_per_rest: 2,
			consumable: false,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			cost: 2500,
		},
	},
	{
		id: "tattoo_43",
		name: "Fractured System Interface Node",
		display_name: "Fractured System Interface Node",
		description:
			"An intricate Mana-Crystal Pigment tattoo inscribed on the shoulders. The sigil-work pulses with contained mana, its lines shifting subtly when the bearer enters combat. Press your palm against the design to unleash its stored power. This tattoo occupies one tattoo attunement slot (separate from equipment attunement).",
		rarity: "uncommon",
		attunement: true,
		body_part: "Right Hand",
		ink_type: "Dimensional Dust",
		active_veins: ["Right Hand"],
		resonance_effect: "Allows mental interfacing with artifacts",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "cyber-magic", "mana-circuit"],
		lore: {
			origin:
				"Manifested spontaneously during a double-dungeon event in the American Midwest.",
			history:
				"Field reports indicate prolonged exposure causes minor spatial distortions in a three-meter radius.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		flavor:
			"Eclipses the threshold of human potential. The breaking point of all resistance.",
		discovery_lore:
			"Sold by a mysterious merchant who appears only during full moons near active Gate sites.",
		theme_tags: ["classified", "ancient-power", "shadow-domain"],
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
			restrictions: [
				"Occupies chest tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
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
			charges: 0,
			uses_per_rest: 2,
			consumable: false,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			cost: 500,
		},
	},
	{
		id: "tattoo_44",
		name: "Primordial Necromancer's Pact",
		display_name: "Primordial Necromancer's Pact",
		description:
			"An intricate Luminite Extract tattoo inscribed on the face. The sigil-work pulses with contained mana, its lines shifting subtly when the bearer enters combat. Channel mana through the ink circuits to unleash its stored power. This tattoo occupies one tattoo attunement slot (separate from equipment attunement).",
		rarity: "uncommon",
		attunement: true,
		body_part: "Left Forearm",
		ink_type: "Wraith Essence",
		active_veins: ["Left Forearm"],
		resonance_effect: "Hear the whispers of the fallen",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "cyber-magic", "mana-circuit"],
		lore: {
			origin:
				"Decoded from ancient sigil-stones found beneath the ruins of a pre-Awakening temple in Kyoto.",
			history:
				"Historical analysis suggests this predates the modern Gate system by several centuries.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		flavor:
			"Devours the dimensional barrier. Evolution compressed into a single, violent instant.",
		discovery_lore:
			"Recovered from a time-locked chest that required three different elemental keys to open.",
		theme_tags: ["rift-energy", "system-glitch", "post-awakening"],
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
			restrictions: [
				"Occupies shoulders tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
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
			charges: 0,
			uses_per_rest: 3,
			consumable: false,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			cost: 2500,
		},
	},
	{
		id: "tattoo_45",
		name: "Awakened Shadow Sovereign Crest",
		display_name: "Awakened Shadow Sovereign Crest",
		description:
			"An intricate Starfall Residue tattoo inscribed on the left arm. The sigil-work pulses with contained mana, its lines shifting subtly when the bearer enters combat. Focus your intent on the glyph to unleash its stored power. This tattoo occupies one tattoo attunement slot (separate from equipment attunement).",
		rarity: "uncommon",
		attunement: true,
		body_part: "Left Forearm",
		ink_type: "Abyssal Extract",
		active_veins: ["Left Forearm"],
		resonance_effect: "Grants command over shadows",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "cyber-magic", "mana-circuit"],
		lore: {
			origin:
				"Woven from the screams of a Gate Boss that achieved sentience moments before death.",
			history:
				"First documented during the Second Awakening Wave, when Hunters worldwide reported spontaneous power surges.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		flavor:
			"Condemns the fabric of reality. The breaking point of all resistance.",
		discovery_lore:
			"Found pulsing with residual mana in the aftermath of a Gate break, half-buried in shattered concrete.",
		theme_tags: ["shadow-domain", "forbidden", "gate-zone"],
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
			restrictions: [
				"Occupies ribs tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
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
			charges: 0,
			uses_per_rest: 2,
			consumable: false,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			cost: 1000,
		},
	},
	{
		id: "tattoo_46",
		name: "Dormant System Interface Node",
		display_name: "Dormant System Interface Node",
		description:
			"An intricate Luminite Extract tattoo inscribed on the neck. The sigil-work pulses with contained mana, its lines shifting subtly when the bearer enters combat. Focus your intent on the glyph to unleash its stored power. This tattoo occupies one tattoo attunement slot (separate from equipment attunement).",
		rarity: "common",
		attunement: true,
		body_part: "Left Hand",
		ink_type: "Dimensional Dust",
		active_veins: ["Left Hand"],
		resonance_effect: "Allows mental interfacing with artifacts",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "cyber-magic", "mana-circuit"],
		lore: {
			origin:
				"Gifted by a dying Regent as payment for a debt that predates human civilization.",
			history:
				"Field reports indicate prolonged exposure causes minor spatial distortions in a three-meter radius.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		flavor:
			"Sanctifies the silence between heartbeats. The last thing many anomalies ever see.",
		discovery_lore:
			"Materialized on a Hunter's workbench overnight, leaving scorch marks in the shape of unknown glyphs.",
		theme_tags: ["system-glitch", "ancient-power", "forbidden"],
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
			restrictions: [
				"Occupies shoulders tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
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
			charges: 0,
			uses_per_rest: 2,
			consumable: false,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			cost: 250,
		},
	},
	{
		id: "tattoo_47",
		name: "Resonant System Interface Node",
		display_name: "Resonant System Interface Node",
		description:
			"An intricate Storm Essence Distillate tattoo inscribed on the neck. The sigil-work pulses with contained mana, its lines shifting subtly when the bearer enters combat. Speak the tattoo's true name to unleash its stored power. This tattoo occupies one tattoo attunement slot (separate from equipment attunement).",
		rarity: "common",
		attunement: true,
		body_part: "Right Forearm",
		ink_type: "Dimensional Dust",
		active_veins: ["Right Forearm"],
		resonance_effect: "Allows mental interfacing with artifacts",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "cyber-magic", "mana-circuit"],
		lore: {
			origin:
				"Synthesized in the clandestine laboratories beneath the Chinese Hunter Bureau headquarters.",
			history:
				"The Japanese Hunter Association attempted to classify this as a national treasure to prevent export.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		flavor:
			"Inverts the silence between heartbeats. The reason S-Rank Gates are feared.",
		discovery_lore:
			"Emerged from a Gate Boss's dissolution cloud, hovering where the creature's heart had been.",
		theme_tags: ["classified", "mana-overflow"],
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
			restrictions: [
				"Occupies left leg tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
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
			charges: 0,
			uses_per_rest: 2,
			consumable: false,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			cost: 1000,
		},
	},
	{
		id: "tattoo_48",
		name: "Dormant Shadow Sovereign Crest",
		display_name: "Dormant Shadow Sovereign Crest",
		description:
			"An intricate Titan Marrow Blend tattoo inscribed on the neck. The sigil-work pulses with contained mana, its lines shifting subtly when the bearer enters combat. Focus your intent on the glyph to unleash its stored power. This tattoo occupies one tattoo attunement slot (separate from equipment attunement).",
		rarity: "uncommon",
		attunement: true,
		body_part: "Back",
		ink_type: "Abyssal Extract",
		active_veins: ["Back"],
		resonance_effect: "Grants command over shadows",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "cyber-magic", "mana-circuit"],
		lore: {
			origin:
				"Extracted from the dimensional residue of a collapsed B-Rank Gate in downtown Seoul.",
			history:
				"The European Hunter Council maintains a standing bounty for information regarding its original creator.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		flavor:
			"Shatters the certainty of outcomes. The last thing many anomalies ever see.",
		discovery_lore:
			"Found pulsing with residual mana in the aftermath of a Gate break, half-buried in shattered concrete.",
		theme_tags: ["shadow-domain", "forbidden", "hunter-bureau"],
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
			restrictions: [
				"Occupies right arm tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
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
			charges: 0,
			uses_per_rest: 3,
			consumable: false,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			cost: 250,
		},
	},
	{
		id: "tattoo_49",
		name: "Harmonic Mana Core Circuit (Zenith)",
		display_name: "Harmonic Mana Core Circuit",
		description:
			"An intricate Shadowblood Tincture tattoo inscribed on the hands. The sigil-work pulses with contained mana, its lines shifting subtly when the bearer enters combat. Speak the tattoo's true name to unleash its stored power. This tattoo occupies one tattoo attunement slot (separate from equipment attunement).",
		rarity: "common",
		attunement: true,
		body_part: "Left Forearm",
		ink_type: "Liquid Mana",
		active_veins: ["Left Forearm"],
		resonance_effect: "Increases max MP/Mana equivalent",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "cyber-magic", "mana-circuit"],
		lore: {
			origin:
				"Discovered embedded in the spine of a petrified World Tree fragment found in Scandinavia.",
			history:
				"Originally developed as a countermeasure against Monarch-class entities during the Sovereignty Wars.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		flavor:
			"Rends the chains of mortality. The reason S-Rank Gates are feared.",
		discovery_lore:
			"Appeared in a Hunter's inventory after a System notification that no one else could see.",
		theme_tags: ["post-awakening", "forbidden"],
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
			restrictions: [
				"Occupies back tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
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
			charges: 0,
			uses_per_rest: 3,
			consumable: false,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			cost: 1000,
		},
	},
	{
		id: "tattoo_50",
		name: "Volatile Ignis Brand",
		display_name: "Volatile Ignis Brand",
		description:
			"An intricate Starfall Residue tattoo inscribed on the chest. The sigil-work pulses with contained mana, its lines shifting subtly when the bearer enters combat. Speak the tattoo's true name to unleash its stored power. This tattoo occupies one tattoo attunement slot (separate from equipment attunement).",
		rarity: "common",
		attunement: true,
		body_part: "Back",
		ink_type: "Dragon's Breath",
		active_veins: ["Back"],
		resonance_effect: "Fire damage absorption",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "cyber-magic", "mana-circuit"],
		lore: {
			origin:
				"Leaked through a micro-rift that appeared inside the International Hunter Conference hall.",
			history:
				"Intelligence reports link this to the Shadow Monarch's army, though the connection remains unconfirmed.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		flavor: "Rends the illusion of safety. The reason S-Rank Gates are feared.",
		discovery_lore:
			"Discovered by an E-Rank Hunter who stumbled into an unmarked side passage during a routine dungeon clear.",
		theme_tags: ["modern-warfare", "dimensional-bleed", "monarch-era"],
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
			restrictions: [
				"Occupies neck tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
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
			charges: 0,
			uses_per_rest: 1,
			consumable: false,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			cost: 250,
		},
	},
	{
		id: "tattoo_s_1",
		name: "Karmic Retribution Matrix",
		display_name: "Karmic Retribution Matrix",
		description:
			"A full-back tattoo depicting an ancient deity of vengeance. The ink was synthesized from the core of an S-Rank Calamity class anomaly.",
		rarity: "legendary",
		attunement: true,
		body_part: "Back",
		ink_type: "Calamity Core Extract",
		active_veins: ["Back", "Spine", "Shoulders"],
		resonance_effect:
			"Reflects 50% of incoming physical damage as Force damage once per short rest.",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "s-rank", "legendary"],
		lore: {
			origin:
				"Confiscated from a black-market dealer operating in the shadow districts of Manila.",
			history:
				"A-Rank appraiser Yoo Myung-Han personally verified its authenticity before it entered general circulation.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		flavor:
			"Erases the flow of causality. Proof that some things cannot be survived.",
		discovery_lore:
			"Found washed ashore near a coastal Gate, wrapped in fabric that dissolved upon touch.",
		theme_tags: ["monarch-era", "black-market"],
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
			restrictions: [
				"Occupies right arm tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
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
			charges: 0,
			uses_per_rest: 2,
			consumable: false,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			cost: 2500,
		},
	},
	{
		id: "tattoo_s_2",
		name: "Ouroboros Mana Loop",
		display_name: "Ouroboros Mana Loop",
		description:
			"A serpent devouring its own tail, etched around the dominant arm. Pulses with infinite looping mana.",
		rarity: "very_rare",
		attunement: true,
		body_part: "Right Arm",
		ink_type: "Liquid Paradox",
		active_veins: ["Right Arm"],
		resonance_effect:
			"Allows casting a 1st-level spell without consuming a spell slot once per day.",
		source_book: "Modern Urban Fantasy Core",
		tags: ["tattoo", "mana", "utility"],
		lore: {
			origin:
				"Gifted by a dying Regent as payment for a debt that predates human civilization.",
			history:
				"The Hunter Bureau classified this as a Level-4 threat vector before it was repurposed for field operations.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		flavor:
			"Mirrors the boundary between life and death. The last thing many anomalies ever see.",
		discovery_lore:
			"Recovered from a time-locked chest that required three different elemental keys to open.",
		theme_tags: ["mana-overflow", "guild-ops"],
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
			restrictions: [
				"Occupies right arm tattoo slot",
				"Tattoo attunement is separate from equipment attunement",
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
			charges: 0,
			uses_per_rest: 3,
			consumable: false,
			prerequisites: [
				"Awakened status",
				"Tattooing kit proficiency or professional tattoo artist",
			],
			cost: 100,
		},
	},
];
