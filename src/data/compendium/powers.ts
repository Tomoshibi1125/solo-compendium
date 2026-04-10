export const powers = [
	{
		id: "shadow-step",
		name: "Shadow Step",
		description:
			"You harness entropic energy to collapse the target's singularity. This manifestation of Void resonance bypasses traditional defenses.",
		type: "innate",
		rarity: "common",
		activation: {
			type: "bonus-action",
		},
		duration: {
			type: "instantaneous",
		},
		range: {
			type: "feet",
			distance: 30,
		},
		mechanics: {
			attack: {
				type: "necrotic",
				mode: "melee",
				resolution: "spell_attack",
				modifier: "Presence",
				damage: "2d10",
				damage_type: "necrotic",
			},
			action_type: "1 bonus action",
			type: "awakening",
			frequency: "1/short rest",
			action: "1 bonus action",
			damage_profile: "2d10 necrotic",
			lattice_interaction: "Ambient mana absorption",
			saving_throw: {
				ability: "Intelligence",
				dc: 20,
				success: "No effect",
				failure: "Full damage",
			},
		},
		effects: {
			primary:
				"Teleport up to 30 feet to an unoccupied space you can see that is in dim light or darkness.",
			secondary:
				"Cannot be detected by normal sight while teleporting through shadows.",
		},
		limitations: {
			uses: "At-will",
			conditions: ["Must have shadows or dim light available"],
			recharge: "Short rest",
		},
		flavor:
			"A relic of the Void Resonance event. The air hums with entropic power.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/shadow-step.webp",
		lore: {
			origin:
				"Translated from forbidden shadow-language inscriptions found in a Monarch's throne room.",
			history:
				"This technique was banned by the International Guild Association for eighteen months before being reclassified.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Found pulsing with residual mana in the aftermath of a Gate break, half-buried in shattered concrete.",
		tags: ["power", "support", "utility"],
		theme_tags: ["black-market", "hunter-bureau"],
	},
	{
		id: "demonic-aura",
		name: "Demonic Aura",
		description:
			"You harness undeniable energy to manifest the target's power. This manifestation of Absolute resonance bypasses traditional defenses.",
		type: "innate",
		rarity: "uncommon",
		activation: {
			type: "action",
		},
		duration: {
			type: "concentration",
			time: "1 minute",
		},
		range: {
			type: "feet",
			distance: 10,
		},
		mechanics: {
			attack: {
				type: "lightning",
				mode: "ranged",
				resolution: "automatic",
				modifier: "Strength",
				damage: "6d6",
				damage_type: "lightning",
			},
			action_type: "1 reaction",
			type: "innate",
			frequency: "At will",
			action: "1 reaction",
			damage_profile: "6d6 lightning",
			lattice_interaction: "Direct mana circuit injection",
			saving_throw: {
				ability: "Agility",
				dc: 10,
				success: "No effect",
				failure: "Full effect and stunned 1 round",
			},
		},
		effects: {
			primary:
				"Enemies within 10 feet must make Sense saving throws or be frightened.",
			secondary:
				"Frightened creatures have disadvantage on attack rolls against you.",
		},
		limitations: {
			uses: "3 times per day",
			recharge: "Long rest",
		},
		flavor:
			"A relic of the Absolute Resonance event. The air hums with entropic power.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/demonic-aura.webp",
		lore: {
			origin:
				"Crystallized from raw mana overflow during the catastrophic Seoul Gate Breach of Year 7.",
			history:
				"The American Hunter Bureau's Project: Starfall attempted to weaponize this before the program was defunded.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Dropped by a mini-boss that shouldn't have existed according to the Gate's difficulty rating.",
		tags: ["power", "burst", "necrotic", "mobility"],
		theme_tags: ["experimental", "survival", "shadow-domain"],
	},
	{
		id: "regeneration",
		name: "Regeneration",
		description:
			"You harness absolute energy to override the target's structure. This manifestation of Absolute resonance bypasses traditional defenses.",
		type: "innate",
		rarity: "rare",
		activation: {
			type: "passive",
		},
		mechanics: {
			attack: {
				type: "radiant",
				mode: "melee",
				resolution: "automatic",
				modifier: "Intelligence",
				damage: "3d10",
				damage_type: "radiant",
			},
			critical: true,
			action_type: "1 reaction",
			type: "awakening",
			frequency: "1/short rest",
			action: "1 reaction",
			damage_profile: "3d10 radiant",
			lattice_interaction: "Resonance amplification",
			saving_throw: {
				ability: "Vitality",
				dc: 13,
				success: "No effect",
				failure: "Full effect and stunned 1 round",
			},
		},
		effects: {
			primary:
				"Regain 1 hit point at the start of your turn if you have at least 1 hit point.",
			secondary:
				"Cannot regain hit points if you are in sunlight or radiant damage area.",
		},
		limitations: {
			conditions: ["Reduced effectiveness in light or against radiant damage"],
			uses: "3/long rest",
			recharge: "Dusk",
		},
		flavor:
			"Denies the quiet space between breaths. A brutal death of hesitation.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/regeneration.webp",
		lore: {
			origin:
				"Gifted by a dying Regent as payment for a debt that predates human civilization.",
			history:
				"A-Rank appraiser Yoo Myung-Han personally verified its authenticity before it entered general circulation.",
			curse:
				"Creates a sympathetic bond with the nearest Gate; the user feels physical pain when Gates are destroyed.",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Dropped by a mini-boss that shouldn't have existed according to the Gate's difficulty rating.",
		tags: ["power", "psychic", "mobility", "healing", "area"],
		theme_tags: ["classified", "system-glitch"],
	},
	{
		id: "true-sight",
		name: "True Sight",
		description:
			"You harness fundamental energy to transmute the target's existence. This manifestation of Absolute resonance bypasses traditional defenses.",
		type: "innate",
		rarity: "very_rare",
		activation: {
			type: "passive",
		},
		mechanics: {
			attack: {
				type: "acid",
				mode: "melee",
				resolution: "automatic",
				modifier: "Agility",
				damage: "5d6",
				damage_type: "acid",
			},
			action_type: "1 bonus action",
			type: "innate",
			frequency: "1/short rest",
			action: "1 bonus action",
			damage_profile: "5d6 acid",
			lattice_interaction: "Lattice bypass — raw power",
			saving_throw: {
				ability: "Presence",
				dc: 12,
				success: "Partial effect",
				failure: "Full damage",
			},
		},
		effects: {
			primary: "Can see in normal and magical darkness.",
			secondary: "Can see invisible creatures and objects.",
			tertiary: "Can see into the Ethereal Plane.",
		},
		flavor:
			"A relic of the Absolute Resonance event. The air hums with entropic power.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/true-sight.webp",
		lore: {
			origin:
				"Found clutched in the hand of a petrified E-Rank Hunter who had been missing for three years.",
			history:
				"Field reports indicate prolonged exposure causes minor spatial distortions in a three-meter radius.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Found washed ashore near a coastal Gate, wrapped in fabric that dissolved upon touch.",
		tags: ["power", "damage", "buff", "offensive"],
		theme_tags: ["black-market", "classified", "experimental"],
	},
	{
		id: "shadow-essence",
		name: "Shadow Essence",
		description:
			"You harness consuming energy to nullify the target's oblivion. This manifestation of Void resonance bypasses traditional defenses.",
		type: "innate",
		rarity: "very_rare",
		activation: {
			type: "action",
		},
		duration: {
			type: "concentration",
			time: "1 minute",
		},
		mechanics: {
			stat_bonuses: {
				Intelligence: 1,
			},
			resistance: ["necrotic"],
			special: "Aligned with Void resonance.",
			action_type: "1 action",
			type: "monstrous",
			frequency: "2/short rest",
			action: "1 action",
			damage_profile: "3d8 necrotic",
			lattice_interaction: "Ambient mana absorption",
			attack: {
				type: "necrotic",
				mode: "melee",
				resolution: "spell_attack",
				modifier: "Strength",
				damage: "3d8",
				damage_type: "necrotic",
			},
			saving_throw: {
				ability: "Strength",
				dc: 13,
				success: "Half damage",
				failure: "Full damage",
			},
		},
		effects: {
			primary: "Become incorporeal while in dim light or darkness.",
			secondary:
				"Can move through creatures and objects as if they were difficult terrain.",
			tertiary:
				"Resistance to non-magical bludgeoning, piercing, and slashing damage.",
		},
		limitations: {
			uses: "Once per day",
			recharge: "Long rest",
		},
		flavor:
			"A relic of the Void Resonance event. The air hums with entropic power.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/shadow-essence.webp",
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
		discovery_lore:
			"Purchased from a black-market auction in the underground district of Neo-Seoul for an undisclosed sum.",
		tags: ["power", "burst", "psychic"],
		theme_tags: ["shadow-domain", "dungeon-core", "hunter-bureau"],
	},
	{
		id: "dragon-breath",
		name: "Dragon Breath",
		description:
			"You harness pure energy to override the target's structure. This manifestation of Absolute resonance bypasses traditional defenses.",
		type: "awakening",
		rarity: "rare",
		requirements: {
			job: "Berserker",
		},
		activation: {
			type: "action",
		},
		duration: {
			type: "instantaneous",
		},
		range: {
			type: "feet",
			distance: 15,
		},
		mechanics: {
			attack: {
				type: "psychic",
				mode: "melee",
				resolution: "automatic",
				modifier: "Sense",
				damage: "2d12",
				damage_type: "psychic",
			},
			saving_throw: {
				ability: "Sense",
				dc: 17,
				success: "Partial effect",
				failure: "Full effect and prone",
			},
			action_type: "1 reaction",
			type: "monstrous",
			frequency: "3/long rest",
			action: "1 reaction",
			damage_profile: "2d12 psychic",
			lattice_interaction: "Lattice bypass — raw power",
		},
		effects: {
			primary: "Exhale destructive energy in a 15-foot cone.",
			secondary: "Damage type determined by draconic ancestry.",
		},
		limitations: {
			uses: "Once per short or long rest",
			recharge: "Short rest",
		},
		flavor:
			"Destroys the dimensional divide. A sorrowful testament to absolute power.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/dragon-breath.webp",
		lore: {
			origin:
				"Formed naturally in a mana vein so dense that reality itself began to crystallize around it.",
			history:
				"This was one of twelve artifacts recovered from the infamous Kamish Raid that changed modern Hunter warfare.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Found washed ashore near a coastal Gate, wrapped in fabric that dissolved upon touch.",
		tags: ["power", "damage", "defensive", "burst", "healing"],
		theme_tags: ["rift-energy", "gate-zone", "urban-combat"],
	},
	{
		id: "arcane-charm",
		name: "Arcane Charm",
		description:
			"You harness undeniable energy to transmute the target's structure. This manifestation of Absolute resonance bypasses traditional defenses.",
		type: "awakening",
		rarity: "uncommon",
		requirements: {
			job: "Resonant",
		},
		activation: {
			type: "action",
		},
		duration: {
			type: "timed",
			time: "24 hours",
		},
		range: {
			type: "feet",
			distance: 30,
		},
		mechanics: {
			attack: {
				type: "radiant",
				mode: "aura",
				resolution: "ability_check",
				modifier: "Presence",
				damage: "2d12",
				damage_type: "radiant",
			},
			critical: true,
			action_type: "1 reaction",
			type: "awakening",
			frequency: "3/long rest",
			action: "1 reaction",
			damage_profile: "2d12 radiant",
			lattice_interaction: "Standard channel",
			saving_throw: {
				ability: "Sense",
				dc: 15,
				success: "No effect",
				failure: "Full damage",
			},
		},
		effects: {
			primary: "Target must make Sense saving throw or be charmed.",
			secondary: "Charmed creature regards you as a trusted friend.",
		},
		limitations: {
			uses: "Once per day",
			recharge: "Long rest",
		},
		flavor:
			"Ignores the arrogant and the mighty. An absolute whisper in the shadows.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/fey-charm.webp",
		lore: {
			origin:
				"Discovered embedded in the spine of a petrified World Tree fragment found in Scandinavia.",
			history:
				"A-Rank appraiser Yoo Myung-Han personally verified its authenticity before it entered general circulation.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Found in a hidden compartment of a relic weapon that had been in Guild storage for years.",
		tags: ["power", "stealth", "healing", "area"],
		theme_tags: ["shadow-domain", "gate-zone", "classified"],
	},
	{
		id: "bulwark-resilience",
		name: "Bulwark Resilience",
		description:
			"You harness pure energy to override the target's structure. This manifestation of Absolute resonance bypasses traditional defenses.",
		type: "awakening",
		rarity: "common",
		requirements: {
			job: "Bulwark",
		},
		activation: {
			type: "passive",
		},
		mechanics: {
			attack: {
				type: "necrotic",
				mode: "aura",
				resolution: "saving_throw",
				modifier: "Presence",
				damage: "6d6",
				damage_type: "necrotic",
			},
			saving_throw: {
				ability: "Strength",
				dc: 21,
				success: "Partial effect",
				failure: "Full damage",
			},
			action_type: "1 action",
			type: "awakening",
			frequency: "At will",
			action: "1 action",
			damage_profile: "6d6 necrotic",
			lattice_interaction: "Lattice bypass — raw power",
		},
		effects: {
			primary: "Advantage on saving throws against poison.",
			secondary: "Resistance to poison damage.",
			tertiary:
				"Advantage on saving throws against spells and magical effects.",
		},
		flavor:
			"Ignores the concept of defeat. An absolute surge of lethal intent.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/dwarven-resilience.webp",
		lore: {
			origin:
				"Unearthed by a mining Guild operating in the mana-saturated quarries of the Australian Outback.",
			history:
				"The American Hunter Bureau's Project: Starfall attempted to weaponize this before the program was defunded.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Purchased from a black-market auction in the underground district of Neo-Seoul for an undisclosed sum.",
		tags: ["power", "perception", "damage", "defensive", "necrotic"],
		theme_tags: ["mana-overflow", "system-glitch"],
	},
	{
		id: "assassin-luck",
		name: "Assassin's Luck",
		description:
			"You harness fundamental energy to override the target's existence. This manifestation of Absolute resonance bypasses traditional defenses.",
		type: "awakening",
		rarity: "common",
		requirements: {
			job: "Assassin",
		},
		activation: {
			type: "reaction",
		},
		mechanics: {
			attack: {
				type: "fire",
				mode: "melee",
				resolution: "saving_throw",
				modifier: "Presence",
				damage: "4d8",
				damage_type: "fire",
			},
			critical: true,
			action_type: "1 reaction",
			type: "awakening",
			frequency: "1/short rest",
			action: "1 reaction",
			damage_profile: "4d8 fire",
			lattice_interaction: "Standard channel",
			saving_throw: {
				ability: "Presence",
				dc: 16,
				success: "No effect",
				failure: "Full effect and prone",
			},
		},
		effects: {
			primary: "Reroll a 1 on an attack roll, ability check, or saving throw.",
		},
		limitations: {
			uses: "Once per turn",
			recharge: "Short rest",
		},
		flavor:
			"Denies the darkness within. An ancient breaking point of the world.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/halfling-luck.webp",
		lore: {
			origin:
				"Decoded from ancient sigil-stones found beneath the ruins of a pre-Awakening temple in Kyoto.",
			history:
				"Originally thought to be a failed experiment, it was rediscovered when a junior researcher noticed anomalous readings.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Emerged from a Gate Boss's dissolution cloud, hovering where the creature's heart had been.",
		tags: ["power", "healing", "perception"],
		theme_tags: ["dungeon-core", "monarch-era"],
	},
	{
		id: "warrior-rage",
		name: "Warrior's Rage",
		description:
			"You harness fundamental energy to transmute the target's power. This manifestation of Absolute resonance bypasses traditional defenses.",
		type: "awakening",
		rarity: "uncommon",
		requirements: {
			job: "Destroyer",
		},
		activation: {
			type: "bonus-action",
		},
		duration: {
			type: "timed",
			time: "1 minute",
		},
		mechanics: {
			attack: {
				type: "force",
				mode: "self",
				resolution: "spell_attack",
				modifier: "Presence",
				damage: "3d6",
				damage_type: "force",
			},
			action_type: "1 bonus action",
			type: "monstrous",
			frequency: "Proficiency/long rest",
			action: "1 bonus action",
			damage_profile: "3d6 force",
			lattice_interaction: "Resonance amplification",
			saving_throw: {
				ability: "Sense",
				dc: 13,
				success: "Half damage",
				failure: "Full effect and stunned 1 round",
			},
		},
		effects: {
			primary: "Advantage on Strength checks and saving throws.",
			secondary:
				"Additional damage equal to your proficiency bonus on melee weapon hits.",
			tertiary: "Resistance to bludgeoning, piercing, and slashing damage.",
		},
		limitations: {
			uses: "3 times per day",
			recharge: "Long rest",
		},
		flavor:
			"A relic of the Absolute Resonance event. The air hums with entropic power.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/orcish-rage.webp",
		lore: {
			origin:
				"Created by an unnamed Awakened blacksmith who fed their own life force into the forge.",
			history:
				"Guild archives show at least three S-Rank Hunters have died attempting to master its full potential.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Materialized on a Hunter's workbench overnight, leaving scorch marks in the shape of unknown glyphs.",
		tags: ["power", "mobility", "void", "perception", "ice"],
		theme_tags: ["post-awakening", "hunter-bureau"],
	},
	{
		id: "ki-point",
		name: "Ki Point",
		description:
			"You harness fundamental energy to override the target's reality. This manifestation of Absolute resonance bypasses traditional defenses.",
		type: "class",
		rarity: "common",
		requirements: {
			class: "Martial Artist",
		},
		activation: {
			type: "passive",
		},
		mechanics: {
			attack: {
				type: "psychic",
				mode: "ranged",
				resolution: "saving_throw",
				modifier: "Sense",
				damage: "5d6",
				damage_type: "psychic",
			},
			critical: true,
			action_type: "1 action",
			type: "monstrous",
			frequency: "1/short rest",
			action: "1 action",
			damage_profile: "5d6 psychic",
			lattice_interaction: "Standard channel",
			saving_throw: {
				ability: "Strength",
				dc: 14,
				success: "No effect",
				failure: "Full effect and stunned 1 round",
			},
		},
		effects: {
			primary: "Gain a pool of ki points equal to your martial artist level.",
			secondary: "Can spend ki points to use various martial artist abilities.",
		},
		limitations: {
			uses: "Regain all ki points after a long rest",
			recharge: "Short rest",
		},
		flavor:
			"Reflects the dimensional divide. A chaotic testament to absolute power.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/ki-point.webp",
		lore: {
			origin:
				"Stolen from a Guild vault during the Three-Day War between rival Korean Hunter factions.",
			history:
				"Field reports indicate prolonged exposure causes minor spatial distortions in a three-meter radius.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Materialized on a Hunter's workbench overnight, leaving scorch marks in the shape of unknown glyphs.",
		tags: ["power", "damage", "single-target", "support", "void"],
		theme_tags: ["ancient-power", "post-awakening"],
	},
	{
		id: "divine-smite",
		name: "Divine Smite",
		description:
			"You harness absolute energy to manifest the target's structure. This manifestation of Absolute resonance bypasses traditional defenses.",
		type: "class",
		rarity: "rare",
		requirements: {
			class: "Herald",
			level: 2,
		},
		activation: {
			type: "reaction",
		},
		mechanics: {
			attack: {
				type: "radiant",
				mode: "aura",
				resolution: "saving_throw",
				modifier: "Strength",
				damage: "2d8",
				damage_type: "radiant",
			},
			saving_throw: {
				ability: "Intelligence",
				dc: 21,
				success: "No effect",
				failure: "Full damage",
			},
			action_type: "1 action",
			type: "monstrous",
			frequency: "1/short rest",
			action: "1 action",
			damage_profile: "2d8 radiant",
			lattice_interaction: "Standard channel",
		},
		effects: {
			primary:
				"Add radiant damage equal to 2d8 + herald level to a melee weapon hit.",
			secondary:
				"Extra damage increases to 3d8 at 11th level and 4d8 at 17th level.",
		},
		limitations: {
			uses: "Limited by spell slots",
			conditions: ["Must hit a creature"],
			recharge: "Short rest",
		},
		flavor:
			"Ignores the remnants of humanity. A devastating surge of lethal intent.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/divine-smite.webp",
		lore: {
			origin:
				"Emerged from the Hunter Association's classified Project: Lattice Break experiments.",
			history:
				"First documented during the Second Awakening Wave, when Hunters worldwide reported spontaneous power surges.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Traded by a nomadic Awakened who claimed to have no memory of acquiring it.",
		tags: ["power", "single-target", "defensive"],
		theme_tags: ["hunter-bureau", "mana-overflow"],
	},
	{
		id: "wild-shape",
		name: "Primal Shift",
		description:
			"You harness wild energy to destabilize the target's primordial mass. This manifestation of Chaos resonance bypasses traditional defenses.",
		type: "class",
		rarity: "rare",
		requirements: {
			class: "Summoner",
			level: 2,
		},
		activation: {
			type: "action",
		},
		duration: {
			type: "timed",
			time: "2 hours",
		},
		mechanics: {
			attack: {
				type: "psychic",
				mode: "ranged",
				resolution: "automatic",
				modifier: "Presence",
				damage: "2d12",
				damage_type: "psychic",
			},
			critical: true,
			action_type: "1 action",
			type: "divine",
			frequency: "At will",
			action: "1 action",
			damage_profile: "2d12 psychic",
			lattice_interaction: "Standard channel",
			saving_throw: {
				ability: "Agility",
				dc: 21,
				success: "Partial effect",
				failure: "Full effect and stunned 1 round",
			},
		},
		effects: {
			primary:
				"Transform into a beast with challenge rating no higher than your summoner level divided by 3.",
			secondary:
				"Gain the beast's statistics except for Intelligence, Sense, and Presence.",
		},
		limitations: {
			uses: "2 times per short rest, increases at higher levels",
			recharge: "Short rest",
		},
		flavor:
			"Reflects the fragile limits of flesh. An overwhelming ultimate equalizer.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/wild-shape.webp",
		lore: {
			origin:
				"Stolen from a Guild vault during the Three-Day War between rival Korean Hunter factions.",
			history:
				"A-Rank appraiser Yoo Myung-Han personally verified its authenticity before it entered general circulation.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Dropped by a mini-boss that shouldn't have existed according to the Gate's difficulty rating.",
		tags: ["power", "radiant", "necrotic"],
		theme_tags: ["experimental", "urban-combat", "dungeon-core"],
	},
	{
		id: "arcane-recovery",
		name: "Arcane Recovery",
		description:
			"You harness pure energy to transmute the target's reality. This manifestation of Absolute resonance bypasses traditional defenses.",
		type: "class",
		rarity: "uncommon",
		requirements: {
			class: "Mage",
			level: 1,
		},
		activation: {
			type: "long-rest",
		},
		mechanics: {
			attack: {
				type: "fire",
				mode: "aura",
				resolution: "saving_throw",
				modifier: "Agility",
				damage: "3d8",
				damage_type: "fire",
			},
			saving_throw: {
				ability: "Strength",
				dc: 13,
				success: "Partial effect",
				failure: "Full effect and prone",
			},
			action_type: "1 reaction",
			type: "awakening",
			frequency: "At will",
			action: "1 reaction",
			damage_profile: "3d8 fire",
			lattice_interaction: "Ambient mana absorption",
		},
		effects: {
			primary:
				"Recover expended spell slots with a total level equal to half your mage level.",
			secondary: "Cannot recover spell slots of 6th level or higher.",
		},
		limitations: {
			uses: "Once per long rest",
			recharge: "Dawn",
		},
		flavor:
			"Shatters all who stand in opposition. An overwhelming whisper in the shadows.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/arcane-recovery.webp",
		lore: {
			origin:
				"Extracted from the dimensional residue of a collapsed B-Rank Gate in downtown Seoul.",
			history:
				"Intelligence reports link this to the Shadow Monarch's army, though the connection remains unconfirmed.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Appeared in a Hunter's inventory after a System notification that no one else could see.",
		tags: ["power", "radiant", "defensive"],
		theme_tags: ["dungeon-core", "rift-energy"],
	},
	{
		id: "sneak-attack",
		name: "Precision Kill",
		description:
			"You harness absolute energy to override the target's structure. This manifestation of Absolute resonance bypasses traditional defenses.",
		type: "class",
		rarity: "common",
		requirements: {
			class: "Assassin",
		},
		activation: {
			type: "passive",
		},
		mechanics: {
			attack: {
				type: "psychic",
				mode: "aura",
				resolution: "automatic",
				modifier: "Agility",
				damage: "3d10",
				damage_type: "psychic",
			},
			critical: true,
			action_type: "1 bonus action",
			type: "awakening",
			frequency: "3/long rest",
			action: "1 bonus action",
			damage_profile: "3d10 psychic",
			lattice_interaction: "Ambient mana absorption",
			saving_throw: {
				ability: "Sense",
				dc: 14,
				success: "No effect",
				failure: "Full effect and prone",
			},
		},
		effects: {
			primary:
				"Add extra damage to attacks when you have advantage or target has an ally adjacent.",
			secondary: "Extra damage increases with assassin level.",
		},
		limitations: {
			conditions: [
				"Must use finesse or ranged weapon",
				"Target must be vulnerable",
			],
			uses: "3/long rest",
			recharge: "Dusk",
		},
		flavor: "Cleanses the architect's design. A subtle death of hesitation.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/sneak-attack.webp",
		lore: {
			origin:
				"Formed naturally in a mana vein so dense that reality itself began to crystallize around it.",
			history:
				"Combat logs from the Busan Incident show this was used to hold a Gate breach for forty-seven minutes.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Sold by a mysterious merchant who appears only during full moons near active Gate sites.",
		tags: ["power", "single-target", "healing", "perception", "psychic"],
		theme_tags: ["forbidden", "dungeon-core", "experimental"],
	},
	{
		id: "vampiric-touch",
		name: "Vampiric Touch",
		description:
			"You harness visceral energy to rupture the target's arteries. This manifestation of Blood resonance bypasses traditional defenses.",
		type: "monstrous",
		rarity: "rare",
		activation: {
			type: "action",
		},
		mechanics: {
			attack: {
				type: "thunder",
				mode: "melee",
				resolution: "ability_check",
				modifier: "Sense",
				damage: "4d6",
				damage_type: "thunder",
			},
			saving_throw: {
				ability: "Sense",
				dc: 18,
				success: "Partial effect",
				failure: "Full effect and prone",
			},
			action_type: "1 reaction",
			type: "monstrous",
			frequency: "1/short rest",
			action: "1 reaction",
			damage_profile: "4d6 thunder",
			lattice_interaction: "Direct mana circuit injection",
		},
		effects: {
			primary: "Touch deals necrotic damage and heals you for the same amount.",
			secondary: "Cannot heal more than your maximum hit points.",
		},
		limitations: {
			uses: "3 times per day",
			recharge: "Long rest",
		},
		flavor:
			"Commands the darkness within. A triumphant breaking point of the world.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/vampiric-touch.webp",
		lore: {
			origin:
				"Synthesized in the clandestine laboratories beneath the Chinese Hunter Bureau headquarters.",
			history:
				"Originally thought to be a failed experiment, it was rediscovered when a junior researcher noticed anomalous readings.",
			curse:
				"Corrupts nearby healing magic by 10%, causing heals to occasionally deal damage instead.",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Excavated from the crystallized mana deposit at the center of a depleted Gate core.",
		tags: ["power", "offensive", "damage"],
		theme_tags: ["hunter-bureau", "dimensional-bleed", "forbidden"],
	},
	{
		id: "lycanthropy",
		name: "Lycanthropy",
		description:
			"You harness pure energy to decree the target's structure. This manifestation of Absolute resonance bypasses traditional defenses.",
		type: "monstrous",
		rarity: "very_rare",
		activation: {
			type: "action",
		},
		duration: {
			type: "timed",
			time: "1 hour",
		},
		mechanics: {
			attack: {
				type: "cold",
				mode: "melee",
				resolution: "automatic",
				modifier: "Sense",
				damage: "2d12",
				damage_type: "cold",
			},
			critical: true,
			action_type: "1 action",
			type: "monstrous",
			frequency: "2/short rest",
			action: "1 action",
			damage_profile: "2d12 cold",
			lattice_interaction: "Lattice bypass — raw power",
			saving_throw: {
				ability: "Presence",
				dc: 14,
				success: "No effect",
				failure: "Full damage",
			},
		},
		effects: {
			primary: "Transform into a hybrid werewolf form.",
			secondary: "Gain multiattack and increased Strength.",
			tertiary: "Damage resistance to non-magical weapons.",
		},
		limitations: {
			uses: "Once per night",
			conditions: ["Full moon transformation is involuntary"],
			recharge: "Dawn",
		},
		flavor:
			"Ignites the fragile limits of flesh. A sorrowful breaking point of the world.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/lycanthropy.webp",
		lore: {
			origin:
				"Reverse-engineered from Architect combat data recovered by the Hunter Bureau's R&D division.",
			history:
				"This was one of twelve artifacts recovered from the infamous Kamish Raid that changed modern Hunter warfare.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Emerged from a Gate Boss's dissolution cloud, hovering where the creature's heart had been.",
		tags: ["power", "sustained", "stealth", "radiant", "utility"],
		theme_tags: ["urban-combat", "mana-overflow", "ancient-power"],
	},
	{
		id: "gaze-of-petrification",
		name: "Gaze of Petrification",
		description:
			"By aligning your lattice with the Absolute Absolute, you can mandate the local will. This manifestation bypasses standard Rift dampeners.",
		type: "monstrous",
		rarity: "legendary",
		activation: {
			type: "action",
		},
		duration: {
			type: "timed",
			time: "1 minute",
		},
		range: {
			type: "feet",
			distance: 30,
		},
		mechanics: {
			attack: {
				type: "thunder",
				mode: "melee",
				resolution: "ability_check",
				modifier: "Strength",
				damage: "2d12",
				damage_type: "thunder",
			},
			saving_throw: {
				ability: "Presence",
				dc: 18,
				success: "Partial effect",
				failure: "Full effect and prone",
			},
			action_type: "1 action",
			type: "innate",
			frequency: "2/short rest",
			action: "1 action",
			damage_profile: "2d12 thunder",
			lattice_interaction: "Standard channel",
		},
		effects: {
			primary:
				"Target must make Vitality saving throw or begin turning to stone.",
			secondary: "Petrified creature is restrained and cannot move or speak.",
		},
		limitations: {
			uses: "Once per day",
			recharge: "Long rest",
		},
		flavor:
			"Ignites the concept of defeat. A sorrowful dance performed on the edge of a blade.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/gaze-of-petrification.webp",
		lore: {
			origin:
				"Reconstructed from fragments scattered across seven different C-Rank dungeons.",
			history:
				"This was one of twelve artifacts recovered from the infamous Kamish Raid that changed modern Hunter warfare.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Found washed ashore near a coastal Gate, wrapped in fabric that dissolved upon touch.",
		tags: ["power", "single-target", "utility"],
		theme_tags: ["dimensional-bleed", "gate-zone"],
	},
	{
		id: "telepathy",
		name: "Telepathy",
		description:
			"By aligning your lattice with the Absolute Absolute, you can mandate the local will. This manifestation bypasses standard Rift dampeners.",
		type: "monstrous",
		rarity: "rare",
		activation: {
			type: "passive",
		},
		range: {
			type: "feet",
			distance: 120,
		},
		mechanics: {
			attack: {
				type: "psychic",
				mode: "self",
				resolution: "automatic",
				modifier: "Agility",
				damage: "4d8",
				damage_type: "psychic",
			},
			critical: true,
			action_type: "1 action",
			type: "monstrous",
			frequency: "1/short rest",
			action: "1 action",
			damage_profile: "4d8 psychic",
			lattice_interaction: "Direct mana circuit injection",
			saving_throw: {
				ability: "Vitality",
				dc: 11,
				success: "No effect",
				failure: "Full effect and prone",
			},
		},
		effects: {
			primary:
				"Communicate telepathically with any creature you can see within 120 feet.",
			secondary:
				"Can understand languages you don't know through telepathic communication.",
		},
		flavor:
			"Cleanses the dimensional divide. A forbidden testament to absolute power.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/telepathy.webp",
		lore: {
			origin:
				"Gifted by a dying Regent as payment for a debt that predates human civilization.",
			history:
				"Originally thought to be a failed experiment, it was rediscovered when a junior researcher noticed anomalous readings.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Sold by a mysterious merchant who appears only during full moons near active Gate sites.",
		tags: ["power", "utility", "mobility"],
		theme_tags: ["forbidden", "gate-zone", "experimental"],
	},
	{
		id: "invisibility",
		name: "Invisibility",
		description:
			"You harness fundamental energy to override the target's reality. This manifestation of Absolute resonance bypasses traditional defenses.",
		type: "monstrous",
		rarity: "uncommon",
		activation: {
			type: "action",
		},
		duration: {
			type: "concentration",
			time: "1 hour",
		},
		mechanics: {
			attack: {
				type: "acid",
				mode: "ranged",
				resolution: "ability_check",
				modifier: "Intelligence",
				damage: "3d6",
				damage_type: "acid",
			},
			saving_throw: {
				ability: "Vitality",
				dc: 10,
				success: "No effect",
				failure: "Full damage",
			},
			action_type: "1 action",
			type: "divine",
			frequency: "2/short rest",
			action: "1 action",
			damage_profile: "3d6 acid",
			lattice_interaction: "Ambient mana absorption",
		},
		effects: {
			primary: "Become invisible to all sight.",
			secondary: "Invisibility ends if you attack or cast a spell.",
		},
		limitations: {
			uses: "At-will",
			conditions: ["Ends when taking hostile action"],
			recharge: "Long rest",
		},
		flavor:
			"Shatters the flow of time itself. A brutal testament to absolute power.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/invisibility.webp",
		lore: {
			origin:
				"Synthesized in the clandestine laboratories beneath the Chinese Hunter Bureau headquarters.",
			history:
				"The Hunter Bureau classified this as a Level-4 threat vector before it was repurposed for field operations.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Dropped by a mini-boss that shouldn't have existed according to the Gate's difficulty rating.",
		tags: ["power", "fire", "control", "single-target"],
		theme_tags: ["hunter-bureau", "experimental"],
	},
	{
		id: "divine-intervention",
		name: "System Override",
		description:
			"Issue a direct petition to the architects of the Rift itself, requesting intervention that transcends the normal rules of dimensional reality.",
		type: "divine",
		rarity: "legendary",
		requirements: {
			level: 20,
		},
		activation: {
			type: "action",
		},
		mechanics: {
			attack: {
				type: "acid",
				mode: "aura",
				resolution: "ability_check",
				modifier: "Intelligence",
				damage: "2d10",
				damage_type: "acid",
			},
			action_type: "1 bonus action",
			type: "class",
			frequency: "At will",
			action: "1 bonus action",
			damage_profile: "2d10 acid",
			lattice_interaction: "Standard channel",
			saving_throw: {
				ability: "Vitality",
				dc: 16,
				success: "Half damage",
				failure: "Full effect and stunned 1 round",
			},
		},
		effects: {
			primary: "Request direct intervention from the Rift architects.",
			secondary:
				"Warden determines the form and effectiveness of the intervention.",
		},
		limitations: {
			uses: "Once per lifetime",
			recharge: "Never",
		},
		flavor:
			"A relic of the Absolute Resonance event. The air hums with entropic power.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/divine-intervention.webp",
		lore: {
			origin:
				"Found clutched in the hand of a petrified E-Rank Hunter who had been missing for three years.",
			history:
				"Originally developed as a countermeasure against Monarch-class entities during the Sovereignty Wars.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Recovered from a time-locked chest that required three different elemental keys to open.",
		tags: ["power", "area", "psychic", "burst", "necrotic"],
		theme_tags: ["gate-zone", "hunter-bureau"],
	},
	{
		id: "angelic-wings",
		name: "Essence Wings",
		description:
			"Manifest wings of crystallized essence that grant flight, a hallmark of ascendants who have transcended the Rift's physical limitations.",
		type: "divine",
		rarity: "very_rare",
		requirements: {
			level: 15,
		},
		activation: {
			type: "bonus-action",
		},
		duration: {
			type: "timed",
			time: "1 hour",
		},
		mechanics: {
			attack: {
				type: "radiant",
				mode: "ranged",
				resolution: "automatic",
				modifier: "Sense",
				damage: "3d10",
				damage_type: "radiant",
			},
			action_type: "1 bonus action",
			type: "innate",
			frequency: "1/short rest",
			action: "1 bonus action",
			damage_profile: "3d10 radiant",
			lattice_interaction: "Lattice bypass — raw power",
			saving_throw: {
				ability: "Sense",
				dc: 15,
				success: "No effect",
				failure: "Full effect and stunned 1 round",
			},
		},
		effects: {
			primary: "Manifest spectral wings that grant a fly speed of 60 feet.",
			secondary: "Wings shed bright light in a 10-foot radius.",
		},
		limitations: {
			uses: "3 times per day",
			recharge: "Long rest",
		},
		flavor:
			"A relic of the Absolute Resonance event. The air hums with entropic power.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/angelic-wings.webp",
		lore: {
			origin:
				"Born from a System glitch that briefly merged two overlapping Gate instances.",
			history:
				"A-Rank appraiser Yoo Myung-Han personally verified its authenticity before it entered general circulation.",
			curse:
				"Leaves a faint mark on the soul visible to Monarchs and entities of comparable power.",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Excavated from the crystallized mana deposit at the center of a depleted Gate core.",
		tags: ["power", "radiant", "offensive", "mobility", "single-target"],
		theme_tags: ["mana-overflow", "shadow-domain"],
	},
	{
		id: "holy-aura",
		name: "Sanctified Aura",
		description:
			"A radiant field of purified essence that shields allies from dimensional corruption and shadow influence.",
		type: "divine",
		rarity: "legendary",
		requirements: {
			level: 17,
			class: "Herald",
		},
		activation: {
			type: "action",
		},
		duration: {
			type: "concentration",
			time: "1 minute",
		},
		range: {
			type: "feet",
			distance: 30,
		},
		mechanics: {
			attack: {
				type: "lightning",
				mode: "ranged",
				resolution: "automatic",
				modifier: "Intelligence",
				damage: "3d6",
				damage_type: "lightning",
			},
			critical: true,
			action_type: "1 bonus action",
			type: "awakening",
			frequency: "At will",
			action: "1 bonus action",
			damage_profile: "3d6 lightning",
			lattice_interaction: "Direct mana circuit injection",
			saving_throw: {
				ability: "Agility",
				dc: 11,
				success: "Half damage",
				failure: "Full effect and stunned 1 round",
			},
		},
		effects: {
			primary: "Allies in aura have advantage on saving throws.",
			secondary:
				"Fiends and undead have disadvantage on attacks against allies in aura.",
			tertiary:
				"Aura deals radiant damage to fiends and undead that start their turn there.",
		},
		limitations: {
			uses: "Once per day",
			recharge: "Long rest",
		},
		flavor: "Crushes the architect's design. An intricate roar of raw mana.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/holy-aura.webp",
		lore: {
			origin:
				"Crystallized from raw mana overflow during the catastrophic Seoul Gate Breach of Year 7.",
			history:
				"Guild archives show at least three S-Rank Hunters have died attempting to master its full potential.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Excavated from the crystallized mana deposit at the center of a depleted Gate core.",
		tags: ["power", "void", "stealth"],
		theme_tags: ["dimensional-bleed", "ancient-power", "modern-warfare"],
	},
	{
		id: "avatar-of-battle",
		name: "Avatar of Battle",
		description:
			"The Rift elevates your combat potential beyond mortal limits, transforming you into a living embodiment of warfare itself.",
		type: "divine",
		rarity: "legendary",
		requirements: {
			level: 18,
			class: "Destroyer",
		},
		activation: {
			type: "action",
		},
		duration: {
			type: "timed",
			time: "1 minute",
		},
		mechanics: {
			attack: {
				type: "cold",
				mode: "aura",
				resolution: "ability_check",
				modifier: "Intelligence",
				damage: "3d10",
				damage_type: "cold",
			},
			saving_throw: {
				ability: "Presence",
				dc: 20,
				success: "No effect",
				failure: "Full damage",
			},
			action_type: "1 action",
			type: "innate",
			frequency: "1/short rest",
			action: "1 action",
			damage_profile: "3d10 cold",
			lattice_interaction: "Ambient mana absorption",
		},
		effects: {
			primary: "Gain two additional attacks per turn.",
			secondary: "Advantage on all attack rolls.",
			tertiary: "Cannot be frightened and immune to charm effects.",
		},
		limitations: {
			uses: "Once per day",
			recharge: "Long rest",
		},
		flavor:
			"Commands the fragile limits of flesh. A triumphant ultimate equalizer.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/avatar-of-battle.webp",
		lore: {
			origin:
				"Manifested spontaneously during a double-dungeon event in the American Midwest.",
			history:
				"Combat logs from the Busan Incident show this was used to hold a Gate breach for forty-seven minutes.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Appeared in a Hunter's inventory after a System notification that no one else could see.",
		tags: ["power", "defensive", "burst"],
		theme_tags: ["black-market", "post-awakening"],
	},
	{
		id: "arcane-ascension",
		name: "Arcane Ascension",
		description:
			"Transcend the Rift's imposed limitations on mortal spellcasting, briefly accessing the raw aetheric lattice that underlies all dimensional reality.",
		type: "divine",
		rarity: "legendary",
		requirements: {
			level: 20,
			class: "Mage",
		},
		activation: {
			type: "action",
		},
		duration: {
			type: "timed",
			time: "1 minute",
		},
		mechanics: {
			attack: {
				type: "cold",
				mode: "ranged",
				resolution: "automatic",
				modifier: "Agility",
				damage: "2d12",
				damage_type: "cold",
			},
			critical: true,
			action_type: "1 reaction",
			type: "monstrous",
			frequency: "3/long rest",
			action: "1 reaction",
			damage_profile: "2d12 cold",
			lattice_interaction: "Lattice bypass — raw power",
			saving_throw: {
				ability: "Intelligence",
				dc: 15,
				success: "Partial effect",
				failure: "Full damage",
			},
		},
		effects: {
			primary:
				"Can cast any spell of 8th level or lower without expending a spell slot.",
			secondary:
				"Can cast any spell of 9th level once without expending a spell slot.",
			tertiary:
				"Advantage on all Intelligence, Sense, and Presence saving throws.",
		},
		limitations: {
			uses: "Once per day",
			recharge: "Long rest",
		},
		flavor:
			"Commands the arrogant and the mighty. A desperate beautiful catastrophe.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/arcane-ascension.webp",
		lore: {
			origin:
				"Reverse-engineered from Architect combat data recovered by the Hunter Bureau's R&D division.",
			history:
				"This was one of twelve artifacts recovered from the infamous Kamish Raid that changed modern Hunter warfare.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Recovered from a time-locked chest that required three different elemental keys to open.",
		tags: ["power", "single-target", "stealth"],
		theme_tags: ["classified", "guild-ops", "shadow-domain"],
	},
	{
		id: "void-collapse",
		name: "Void Collapse",
		description:
			"By aligning your lattice with the Void Absolute, you can nullify the local mana-void. This manifestation bypasses standard Rift dampeners.",
		type: "awakening",
		rarity: "legendary",
		requirements: {
			level: 17,
			ability: "Intelligence",
			score: 17,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "feet",
			distance: 60,
		},
		mechanics: {
			stat_bonuses: {
				Intelligence: 1,
			},
			resistance: ["necrotic"],
			special: "Aligned with Void resonance.",
			action_type: "1 action",
			type: "divine",
			frequency: "Proficiency/long rest",
			action: "1 action",
			damage_profile: "4d8 psychic",
			lattice_interaction: "Ambient mana absorption",
			attack: {
				type: "psychic",
				mode: "ranged",
				resolution: "automatic",
				modifier: "Presence",
				damage: "4d8",
				damage_type: "psychic",
			},
			saving_throw: {
				ability: "Agility",
				dc: 18,
				success: "No effect",
				failure: "Full effect and prone",
			},
		},
		effects: {
			primary:
				"Create a 20-foot radius sphere of crushing gravity. Creatures inside take 8d10 force damage and are knocked prone and restrained.",
			secondary:
				"Once learned via Rune, adapts to your highest applicable attribute.",
		},
		limitations: {
			uses: "Once per day",
			recharge: "Long rest",
		},
		flavor:
			"Ignores the remnants of humanity. A devastating dance performed on the edge of a blade.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/void-collapse.webp",
		lore: {
			origin:
				"Stolen from a Guild vault during the Three-Day War between rival Korean Hunter factions.",
			history:
				"This was the subject of a bidding war between three S-Rank Guilds that nearly escalated to armed conflict.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Located by a detection-type Hunter whose radar ability triggered on an otherwise empty room.",
		tags: ["power", "area", "debuff"],
		theme_tags: ["post-awakening", "hunter-bureau", "survival"],
	},
	{
		id: "chronos-shift",
		name: "Chronos Shift",
		description:
			"You harness absolute energy to mandate the target's will. This manifestation of Absolute resonance bypasses traditional defenses.",
		type: "divine",
		rarity: "very_rare",
		requirements: {
			level: 15,
			ability: "Presence",
			score: 15,
		},
		activation: {
			type: "reaction",
		},
		range: {
			type: "feet",
			distance: 30,
		},
		mechanics: {
			attack: {
				type: "necrotic",
				mode: "ranged",
				resolution: "spell_attack",
				modifier: "Intelligence",
				damage: "4d6",
				damage_type: "necrotic",
			},
			action_type: "1 action",
			type: "divine",
			frequency: "Proficiency/long rest",
			action: "1 action",
			damage_profile: "4d6 necrotic",
			lattice_interaction: "Standard channel",
			saving_throw: {
				ability: "Sense",
				dc: 20,
				success: "Half damage",
				failure: "Full effect and prone",
			},
		},
		effects: {
			primary:
				"When a creature takes damage or fails a save, rewind time for them to completely undo the event.",
			secondary:
				"Once learned via Rune, adapts to your highest applicable attribute.",
		},
		limitations: {
			uses: "Once per week",
			recharge: "Week",
		},
		flavor:
			"A relic of the Absolute Resonance event. The air hums with entropic power.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/chronos-shift.webp",
		lore: {
			origin:
				"Born from a System glitch that briefly merged two overlapping Gate instances.",
			history:
				"Historical analysis suggests this predates the modern Gate system by several centuries.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Discovered by an E-Rank Hunter who stumbled into an unmarked side passage during a routine dungeon clear.",
		tags: ["power", "psychic", "area"],
		theme_tags: ["dungeon-core", "forbidden", "guild-ops"],
	},
	{
		id: "mana-burn",
		name: "Mana Burn",
		description:
			"You harness fundamental energy to override the target's power. This manifestation of Absolute resonance bypasses traditional defenses.",
		type: "awakening",
		rarity: "rare",
		requirements: {
			level: 7,
			ability: "Intelligence",
			score: 13,
		},
		activation: {
			type: "bonus-action",
		},
		range: {
			type: "feet",
			distance: 60,
		},
		mechanics: {
			attack: {
				type: "poison",
				mode: "aura",
				resolution: "automatic",
				modifier: "Presence",
				damage: "2d10",
				damage_type: "poison",
			},
			saving_throw: {
				ability: "Presence",
				dc: 13,
				success: "Partial effect",
				failure: "Full effect and prone",
			},
			action_type: "1 reaction",
			type: "class",
			frequency: "1/short rest",
			action: "1 reaction",
			damage_profile: "2d10 poison",
			lattice_interaction: "Ambient mana absorption",
		},
		effects: {
			primary:
				"Target loses an unexpended resource (spell slot, ki, mana) and takes 1d8 psychic damage per level of resource lost.",
			secondary:
				"Once learned via Rune, adapts to your highest applicable attribute.",
		},
		limitations: {
			uses: "3 times per day",
			recharge: "Long rest",
		},
		flavor: "Shatters the flow of time itself. A chaotic symphony of violence.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/mana-burn.webp",
		lore: {
			origin:
				"Excavated from a pocket dimension that existed for exactly one hour before collapsing.",
			history:
				"Originally developed as a countermeasure against Monarch-class entities during the Sovereignty Wars.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Dropped by a mini-boss that shouldn't have existed according to the Gate's difficulty rating.",
		tags: ["power", "stealth", "defensive", "buff"],
		theme_tags: ["ancient-power", "dimensional-bleed", "rift-energy"],
	},
	{
		id: "obsidian-carapace",
		name: "Obsidian Carapace",
		description:
			"You harness fundamental energy to decree the target's power. This manifestation of Absolute resonance bypasses traditional defenses.",
		type: "monstrous",
		rarity: "uncommon",
		requirements: {
			level: 5,
			ability: "Vitality",
			score: 13,
		},
		activation: {
			type: "action",
		},
		duration: {
			type: "concentration",
			time: "1 hour",
		},
		mechanics: {
			attack: {
				type: "necrotic",
				mode: "aura",
				resolution: "saving_throw",
				modifier: "Presence",
				damage: "3d8",
				damage_type: "necrotic",
			},
			critical: true,
			action_type: "1 bonus action",
			type: "innate",
			frequency: "1/short rest",
			action: "1 bonus action",
			damage_profile: "3d8 necrotic",
			lattice_interaction: "Standard channel",
			saving_throw: {
				ability: "Sense",
				dc: 20,
				success: "No effect",
				failure: "Full damage",
			},
		},
		effects: {
			primary:
				"Gain 30 temporary hit points. While you have these, attackers taking melee swings at you take 1d6 piercing damage.",
			secondary:
				"Once learned via Rune, adapts to your highest applicable attribute.",
		},
		limitations: {
			uses: "Twice per day",
			recharge: "Long rest",
		},
		flavor:
			"Reflects the fragile limits of flesh. An overwhelming breaking point of the world.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/obsidian-carapace.webp",
		lore: {
			origin:
				"Translated from forbidden shadow-language inscriptions found in a Monarch's throne room.",
			history:
				"Multiple Guilds have attempted to replicate this; all reproductions have proven inferior to the original.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Emerged from a Gate Boss's dissolution cloud, hovering where the creature's heart had been.",
		tags: ["power", "necrotic", "control", "mobility"],
		theme_tags: ["system-glitch", "dimensional-bleed"],
	},
	{
		id: "soul-rend",
		name: "Soul Rend",
		description:
			"You harness undeniable energy to transmute the target's power. This manifestation of Absolute resonance bypasses traditional defenses.",
		type: "innate",
		rarity: "very_rare",
		requirements: {
			level: 13,
			ability: "Presence",
			score: 15,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "feet",
			distance: 15,
		},
		mechanics: {
			attack: {
				type: "thunder",
				mode: "self",
				resolution: "ability_check",
				modifier: "Agility",
				damage: "2d12",
				damage_type: "thunder",
			},
			saving_throw: {
				ability: "Vitality",
				dc: 18,
				success: "No effect",
				failure: "Full effect and prone",
			},
			action_type: "1 action",
			type: "divine",
			frequency: "1/short rest",
			action: "1 action",
			damage_profile: "2d12 thunder",
			lattice_interaction: "Ambient mana absorption",
		},
		effects: {
			primary:
				"Deal 4d10 necrotic damage and reduce the target's maximum hit points by the same amount.",
			secondary:
				"Once learned via Rune, adapts to your highest applicable attribute.",
		},
		limitations: {
			uses: "Once per day",
			recharge: "Long rest",
		},
		flavor:
			"Commands the arrogant and the mighty. A triumphant beautiful catastrophe.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/soul-rend.webp",
		lore: {
			origin:
				"Reconstructed from fragments scattered across seven different C-Rank dungeons.",
			history:
				"This was one of twelve artifacts recovered from the infamous Kamish Raid that changed modern Hunter warfare.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Recovered from a time-locked chest that required three different elemental keys to open.",
		tags: ["power", "perception", "single-target", "support", "offensive"],
		theme_tags: ["mana-overflow", "shadow-domain", "survival"],
	},
	{
		id: "aegis-of-light",
		name: "Aegis of Light",
		description:
			"You harness solar energy to beam the target's flare. This manifestation of Solar resonance bypasses traditional defenses.",
		type: "divine",
		rarity: "rare",
		requirements: {
			level: 9,
			ability: "Presence",
			score: 13,
		},
		activation: {
			type: "reaction",
		},
		range: {
			type: "self",
		},
		mechanics: {
			attack: {
				type: "acid",
				mode: "melee",
				resolution: "spell_attack",
				modifier: "Sense",
				damage: "6d6",
				damage_type: "acid",
			},
			critical: true,
			action_type: "1 bonus action",
			type: "class",
			frequency: "Proficiency/long rest",
			action: "1 bonus action",
			damage_profile: "6d6 acid",
			lattice_interaction: "Ambient mana absorption",
			saving_throw: {
				ability: "Vitality",
				dc: 10,
				success: "Half damage",
				failure: "Full damage",
			},
		},
		effects: {
			primary:
				"Gain immunity to magical damage until the start of your next turn.",
			secondary:
				"Once learned via Rune, adapts to your highest applicable attribute.",
		},
		limitations: {
			uses: "Once per short rest",
			recharge: "Short rest",
		},
		flavor: "Bends the flow of time itself. A subtle symphony of violence.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/aegis-of-light.webp",
		lore: {
			origin:
				"Found clutched in the hand of a petrified E-Rank Hunter who had been missing for three years.",
			history:
				"The American Hunter Bureau's Project: Starfall attempted to weaponize this before the program was defunded.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Recovered from a time-locked chest that required three different elemental keys to open.",
		tags: ["power", "necrotic", "debuff", "shadow", "burst"],
		theme_tags: ["dimensional-bleed", "elite-tier"],
	},
	{
		id: "phantom-barrage",
		name: "Phantom Barrage",
		description:
			"Summon spectral versions of your weapons to strike continuously.",
		type: "awakening",
		rarity: "rare",
		requirements: {
			level: 7,
			ability: "Agility",
			score: 13,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "feet",
			distance: 120,
		},
		mechanics: {
			attack: {
				type: "psychic",
				mode: "ranged",
				resolution: "saving_throw",
				modifier: "Agility",
				damage: "2d10",
				damage_type: "psychic",
			},
			saving_throw: {
				ability: "Strength",
				dc: 15,
				success: "Half damage",
				failure: "Full damage",
			},
			action_type: "1 action",
			type: "divine",
			frequency: "1/short rest",
			action: "1 action",
			damage_profile: "2d10 psychic",
			lattice_interaction: "Direct mana circuit injection",
		},
		effects: {
			primary: "Make 5 ranged spell attacks. Each deals 1d10 force damage.",
			secondary:
				"Once learned via Rune, adapts to your highest applicable attribute.",
		},
		limitations: {
			uses: "Twice per day",
			recharge: "Long rest",
		},
		flavor:
			"Reclaims the concept of defeat. An overwhelming dance performed on the edge of a blade.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/phantom-barrage.webp",
		lore: {
			origin:
				"Gifted by a dying Regent as payment for a debt that predates human civilization.",
			history:
				"Originally developed as a countermeasure against Monarch-class entities during the Sovereignty Wars.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Gifted by the System itself as a reward for completing a hidden quest chain.",
		tags: ["power", "offensive", "defensive", "mobility"],
		theme_tags: ["classified", "ancient-power", "mana-overflow"],
	},
	{
		id: "venom-blood",
		name: "Venom Blood",
		description:
			"You harness throbbing energy to boil the target's ichor. This manifestation of Blood resonance bypasses traditional defenses.",
		type: "monstrous",
		rarity: "uncommon",
		requirements: {
			level: 3,
			ability: "Vitality",
			score: 13,
		},
		activation: {
			type: "passive",
		},
		mechanics: {
			attack: {
				type: "force",
				mode: "ranged",
				resolution: "saving_throw",
				modifier: "Presence",
				damage: "3d8",
				damage_type: "force",
			},
			critical: true,
			action_type: "1 bonus action",
			type: "monstrous",
			frequency: "1/short rest",
			action: "1 bonus action",
			damage_profile: "3d8 force",
			lattice_interaction: "Resonance amplification",
			saving_throw: {
				ability: "Strength",
				dc: 12,
				success: "Half damage",
				failure: "Full effect and stunned 1 round",
			},
		},
		effects: {
			primary:
				"Whenever you take piercing or slashing damage, the attacker takes 2d6 poison damage.",
			secondary:
				"You are immune to poison. Once learned via Rune, adapts to highest attribute.",
		},
		flavor: "Shatters the architect's design. A brutal roar of raw mana.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/venom-blood.webp",
		lore: {
			origin:
				"Created by an unnamed Awakened blacksmith who fed their own life force into the forge.",
			history:
				"Intelligence reports link this to the Shadow Monarch's army, though the connection remains unconfirmed.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Found in a hidden compartment of a relic weapon that had been in Guild storage for years.",
		tags: ["power", "fire", "perception"],
		theme_tags: ["urban-combat", "ancient-power"],
	},
	{
		id: "absolute-zero",
		name: "Absolute Zero",
		description:
			"You harness brittle energy to shatter the target's lattice. This manifestation of Glacial resonance bypasses traditional defenses.",
		type: "awakening",
		rarity: "very_rare",
		requirements: {
			level: 13,
			ability: "Intelligence",
			score: 15,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "feet",
			distance: 60,
		},
		mechanics: {
			attack: {
				type: "poison",
				mode: "self",
				resolution: "automatic",
				modifier: "Strength",
				damage: "2d8",
				damage_type: "poison",
			},
			saving_throw: {
				ability: "Agility",
				dc: 16,
				success: "Partial effect",
				failure: "Full effect and prone",
			},
			action_type: "1 bonus action",
			type: "innate",
			frequency: "2/short rest",
			action: "1 bonus action",
			damage_profile: "2d8 poison",
			lattice_interaction: "Standard channel",
		},
		effects: {
			primary:
				"All creatures in a 20-foot sphere take 6d8 cold damage and are paralyzed for 1 minute (Con save ends).",
			secondary:
				"Once learned via Rune, adapts to your highest applicable attribute.",
		},
		limitations: {
			uses: "Once per day",
			recharge: "Long rest",
		},
		flavor:
			"Destroys the flow of time itself. A sorrowful symphony of violence.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/absolute-zero.webp",
		lore: {
			origin:
				"Confiscated from a black-market dealer operating in the shadow districts of Manila.",
			history:
				"Records indicate this was used by the original Clearing Party that neutralized the first S-Rank Gate on Korean soil.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Discovered by an E-Rank Hunter who stumbled into an unmarked side passage during a routine dungeon clear.",
		tags: ["power", "psychic", "mobility"],
		theme_tags: ["ancient-power", "monarch-era", "mana-overflow"],
	},
	{
		id: "kinetic-absorption",
		name: "Kinetic Absorption",
		description:
			"By aligning your lattice with the Absolute Absolute, you can mandate the local will. This manifestation bypasses standard Rift dampeners.",
		type: "innate",
		rarity: "rare",
		requirements: {
			level: 5,
			ability: "Strength",
			score: 13,
		},
		activation: {
			type: "reaction",
		},
		mechanics: {
			attack: {
				type: "psychic",
				mode: "self",
				resolution: "ability_check",
				modifier: "Intelligence",
				damage: "3d8",
				damage_type: "psychic",
			},
			critical: true,
			action_type: "1 reaction",
			type: "divine",
			frequency: "1/short rest",
			action: "1 reaction",
			damage_profile: "3d8 psychic",
			lattice_interaction: "Ambient mana absorption",
			saving_throw: {
				ability: "Vitality",
				dc: 21,
				success: "Half damage",
				failure: "Full damage",
			},
		},
		effects: {
			primary:
				"Reduce incoming physical damage by 1d10 + attribute. Store this energy.",
			secondary:
				"Next melee attack deals additional force damage equal to the absorbed amount. Adaptive once learned.",
		},
		limitations: {
			uses: "Proficiency bonus times per rest",
			recharge: "Short rest",
		},
		flavor:
			"Denies all who stand in opposition. A chaotic beautiful catastrophe.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/kinetic-absorption.webp",
		lore: {
			origin:
				"Stolen from a Guild vault during the Three-Day War between rival Korean Hunter factions.",
			history:
				"Multiple Guilds have attempted to replicate this; all reproductions have proven inferior to the original.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Discovered by an E-Rank Hunter who stumbled into an unmarked side passage during a routine dungeon clear.",
		tags: ["power", "radiant", "shadow", "necrotic", "single-target"],
		theme_tags: ["guild-ops", "dungeon-core"],
	},
	{
		id: "infernal-forge",
		name: "Infernal Forge",
		description:
			"You harness absolute energy to override the target's power. This manifestation of Absolute resonance bypasses traditional defenses.",
		type: "awakening",
		rarity: "rare",
		requirements: {
			level: 7,
			ability: "Presence",
			score: 13,
		},
		activation: {
			type: "bonus-action",
		},
		duration: {
			type: "timed",
			time: "10 minutes",
		},
		mechanics: {
			attack: {
				type: "lightning",
				mode: "ranged",
				resolution: "spell_attack",
				modifier: "Sense",
				damage: "3d6",
				damage_type: "lightning",
			},
			action_type: "1 action",
			type: "divine",
			frequency: "1/short rest",
			action: "1 action",
			damage_profile: "3d6 lightning",
			lattice_interaction: "Standard channel",
			saving_throw: {
				ability: "Presence",
				dc: 11,
				success: "Half damage",
				failure: "Full effect and stunned 1 round",
			},
		},
		effects: {
			primary: "Manifest a weapon of pure fire in your empty hand.",
			secondary:
				"Attacks deal 2d6 fire damage instead of normal damage, and ignore fire resistance. Adapts to highest attribute once learned.",
		},
		limitations: {
			uses: "At-will",
			recharge: "Short rest",
		},
		flavor:
			"A relic of the Absolute Resonance event. The air hums with entropic power.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/infernal-forge.webp",
		lore: {
			origin:
				"Crystallized from raw mana overflow during the catastrophic Seoul Gate Breach of Year 7.",
			history:
				"Guild archives show at least three S-Rank Hunters have died attempting to master its full potential.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Purchased from a black-market auction in the underground district of Neo-Seoul for an undisclosed sum.",
		tags: ["power", "area", "void"],
		theme_tags: ["experimental", "system-glitch", "ancient-power"],
	},
	{
		id: "celestial-judgment",
		name: "Celestial Judgment",
		description:
			"You harness absolute energy to override the target's will. This manifestation of Absolute resonance bypasses traditional defenses.",
		type: "divine",
		rarity: "legendary",
		requirements: {
			level: 19,
			ability: "Sense",
			score: 17,
		},
		activation: {
			type: "bonus-action",
		},
		range: {
			type: "sight",
		},
		mechanics: {
			attack: {
				type: "fire",
				mode: "self",
				resolution: "ability_check",
				modifier: "Presence",
				damage: "4d8",
				damage_type: "fire",
			},
			critical: true,
			action_type: "1 bonus action",
			type: "divine",
			frequency: "1/short rest",
			action: "1 bonus action",
			damage_profile: "4d8 fire",
			lattice_interaction: "Standard channel",
			saving_throw: {
				ability: "Intelligence",
				dc: 11,
				success: "Partial effect",
				failure: "Full damage",
			},
		},
		effects: {
			primary:
				"Target loses all damage resistances and immunities for 1 minute.",
			secondary:
				"Any damage dealt to them is doubled. Adaptive once learned via Rune.",
		},
		limitations: {
			uses: "Once per month",
			recharge: "Month",
		},
		flavor:
			"Reclaims the fragile limits of flesh. A silent breaking point of the world.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/celestial-judgment.webp",
		lore: {
			origin:
				"Decoded from ancient sigil-stones found beneath the ruins of a pre-Awakening temple in Kyoto.",
			history:
				"Originally thought to be a failed experiment, it was rediscovered when a junior researcher noticed anomalous readings.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Appeared in a Hunter's inventory after a System notification that no one else could see.",
		tags: ["power", "shadow", "mobility"],
		theme_tags: ["modern-warfare", "dimensional-bleed"],
	},
	{
		id: "mind-control",
		name: "Dominate Will",
		description:
			"By aligning your lattice with the Absolute Absolute, you can mandate the local will. This manifestation bypasses standard Rift dampeners.",
		type: "innate",
		rarity: "very_rare",
		requirements: {
			level: 15,
			ability: "Sense",
			score: 15,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "feet",
			distance: 30,
		},
		duration: {
			type: "concentration",
			time: "1 hour",
		},
		mechanics: {
			attack: {
				type: "psychic",
				mode: "self",
				resolution: "saving_throw",
				modifier: "Sense",
				damage: "4d8",
				damage_type: "psychic",
			},
			saving_throw: {
				ability: "Agility",
				dc: 21,
				success: "No effect",
				failure: "Full damage",
			},
			action_type: "1 reaction",
			type: "class",
			frequency: "1/short rest",
			action: "1 reaction",
			damage_profile: "4d8 psychic",
			lattice_interaction: "Direct mana circuit injection",
		},
		effects: {
			primary:
				"You dictate the creature's actions completely. Adapts to your highest applicable attribute.",
			secondary: "Target gets a save each time it takes damage.",
		},
		limitations: {
			uses: "Once per day",
			recharge: "Long rest",
		},
		flavor:
			"Cleanses all who stand in opposition. An intricate whisper in the shadows.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/mind-control.webp",
		lore: {
			origin:
				"Gifted by a dying Regent as payment for a debt that predates human civilization.",
			history:
				"Originally thought to be a failed experiment, it was rediscovered when a junior researcher noticed anomalous readings.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Excavated from the crystallized mana deposit at the center of a depleted Gate core.",
		tags: ["power", "control", "healing", "ice"],
		theme_tags: ["elite-tier", "rift-energy", "forbidden"],
	},
	{
		id: "warp-strike",
		name: "Warp Strike",
		description:
			"By aligning your lattice with the Aetheric Absolute, you can distort the local aether. This manifestation bypasses standard Rift dampeners.",
		type: "awakening",
		rarity: "uncommon",
		requirements: {
			level: 3,
			ability: "Agility",
			score: 13,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "feet",
			distance: 60,
		},
		mechanics: {
			attack: {
				type: "poison",
				mode: "self",
				resolution: "automatic",
				modifier: "Agility",
				damage: "2d12",
				damage_type: "poison",
			},
			critical: true,
			action_type: "1 reaction",
			type: "class",
			frequency: "1/short rest",
			action: "1 reaction",
			damage_profile: "2d12 poison",
			lattice_interaction: "Resonance amplification",
			saving_throw: {
				ability: "Strength",
				dc: 18,
				success: "No effect",
				failure: "Full damage",
			},
		},
		effects: {
			primary:
				"Make a ranged attack with a melee weapon. Hit or miss, you teleport to an unoccupied space adjacent to the target.",
			secondary:
				"Once learned via Rune, adapts to your highest applicable attribute.",
		},
		limitations: {
			uses: "At-will",
			recharge: "Long rest",
		},
		flavor:
			"Overrides the arrogant and the mighty. A relentless beautiful catastrophe.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/warp-strike.webp",
		lore: {
			origin:
				"Confiscated from a black-market dealer operating in the shadow districts of Manila.",
			history:
				"This was one of twelve artifacts recovered from the infamous Kamish Raid that changed modern Hunter warfare.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Recovered from a time-locked chest that required three different elemental keys to open.",
		tags: ["power", "mobility", "stealth", "shadow"],
		theme_tags: ["dungeon-core", "rift-energy", "classified"],
	},
	{
		id: "life-transfer",
		name: "Life Transfer",
		description:
			"You harness pure energy to mandate the target's existence. This manifestation of Absolute resonance bypasses traditional defenses.",
		type: "innate",
		rarity: "uncommon",
		requirements: {
			level: 2,
			ability: "Vitality",
			score: 12,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "touch",
		},
		mechanics: {
			attack: {
				type: "force",
				mode: "aura",
				resolution: "saving_throw",
				modifier: "Strength",
				damage: "2d10",
				damage_type: "force",
			},
			saving_throw: {
				ability: "Vitality",
				dc: 15,
				success: "No effect",
				failure: "Full effect and prone",
			},
			action_type: "1 reaction",
			type: "awakening",
			frequency: "Proficiency/long rest",
			action: "1 reaction",
			damage_profile: "2d10 force",
			lattice_interaction: "Lattice bypass — raw power",
		},
		effects: {
			primary: "Take 4d8 necrotic damage (ignores resistance/immunity).",
			secondary:
				"One creature you touch instantly regains double the damage taken as hit points. Adaptive once learned.",
		},
		limitations: {
			uses: "Unlimited",
			recharge: "Long rest",
		},
		flavor: "Destroys the darkness within. A desperate ultimate equalizer.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/life-transfer.webp",
		lore: {
			origin:
				"Distilled from the ambient mana of a Red Gate that refused to close for seventeen days.",
			history:
				"This technique was banned by the International Guild Association for eighteen months before being reclassified.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Found washed ashore near a coastal Gate, wrapped in fabric that dissolved upon touch.",
		tags: ["power", "single-target", "necrotic", "support"],
		theme_tags: ["survival", "guild-ops"],
	},
	{
		id: "gravity-crush",
		name: "Gravity Crush",
		description:
			"You harness unyielding energy to grind the target's core. This manifestation of Titanic resonance bypasses traditional defenses.",
		type: "awakening",
		rarity: "rare",
		requirements: {
			level: 11,
			ability: "Intelligence",
			score: 15,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "feet",
			distance: 60,
		},
		mechanics: {
			attack: {
				type: "poison",
				mode: "ranged",
				resolution: "spell_attack",
				modifier: "Agility",
				damage: "2d12",
				damage_type: "poison",
			},
			critical: true,
			action_type: "1 action",
			type: "awakening",
			frequency: "2/short rest",
			action: "1 action",
			damage_profile: "2d12 poison",
			lattice_interaction: "Ambient mana absorption",
			saving_throw: {
				ability: "Vitality",
				dc: 13,
				success: "Partial effect",
				failure: "Full effect and stunned 1 round",
			},
		},
		effects: {
			primary:
				"Target takes 5d10 force damage and has its movement speed reduced to 5 feet.",
			secondary:
				"Once learned via Rune, adapts to your highest applicable attribute.",
		},
		limitations: {
			uses: "3 times per day",
			recharge: "Long rest",
		},
		flavor:
			"Destroys the remnants of humanity. A desperate surge of lethal intent.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/gravity-crush.webp",
		lore: {
			origin:
				"Woven from the screams of a Gate Boss that achieved sentience moments before death.",
			history:
				"This was one of twelve artifacts recovered from the infamous Kamish Raid that changed modern Hunter warfare.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Purchased from a black-market auction in the underground district of Neo-Seoul for an undisclosed sum.",
		tags: ["power", "stealth", "fire"],
		theme_tags: ["gate-zone", "guild-ops", "elite-tier"],
	},
	{
		id: "echo-clone",
		name: "Echo Clone",
		description:
			"Manifest a perfect solid clone of yourself made of shadow and dust.",
		type: "monstrous",
		rarity: "very_rare",
		requirements: {
			level: 14,
			ability: "Presence",
			score: 15,
		},
		activation: {
			type: "action",
		},
		duration: {
			type: "concentration",
			time: "1 hour",
		},
		mechanics: {
			attack: {
				type: "poison",
				mode: "aura",
				resolution: "ability_check",
				modifier: "Presence",
				damage: "3d10",
				damage_type: "poison",
			},
			saving_throw: {
				ability: "Strength",
				dc: 10,
				success: "Half damage",
				failure: "Full damage",
			},
			action_type: "1 reaction",
			type: "monstrous",
			frequency: "3/long rest",
			action: "1 reaction",
			damage_profile: "3d10 poison",
			lattice_interaction: "Ambient mana absorption",
		},
		effects: {
			primary:
				"Create a clone with 1 HP and your exact AC and stats. It shares your turn and can attack.",
			secondary:
				"Once learned via Rune, adapts to your highest applicable attribute.",
		},
		limitations: {
			uses: "Once per day",
			recharge: "Long rest",
		},
		flavor:
			"Denies the concept of defeat. A chaotic dance performed on the edge of a blade.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/echo-clone.webp",
		lore: {
			origin:
				"Reverse-engineered from Architect combat data recovered by the Hunter Bureau's R&D division.",
			history:
				"The American Hunter Bureau's Project: Starfall attempted to weaponize this before the program was defunded.",
			curse:
				"Each activation permanently reduces the user's maximum HP by 1, imperceptible until it's too late.",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Found pulsing with residual mana in the aftermath of a Gate break, half-buried in shattered concrete.",
		tags: ["power", "ice", "lightning", "sustained"],
		theme_tags: ["post-awakening", "experimental"],
	},
	{
		id: "storm-call",
		name: "Storm Call",
		description:
			"You harness hyper-charged energy to discharge the target's volts. This manifestation of Storm resonance bypasses traditional defenses.",
		type: "divine",
		rarity: "very_rare",
		requirements: {
			level: 13,
			ability: "Sense",
			score: 15,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "miles",
			distance: 1,
		},
		duration: {
			type: "concentration",
			time: "10 minutes",
		},
		mechanics: {
			attack: {
				type: "radiant",
				mode: "aura",
				resolution: "spell_attack",
				modifier: "Sense",
				damage: "6d6",
				damage_type: "radiant",
			},
			critical: true,
			action_type: "1 reaction",
			type: "awakening",
			frequency: "At will",
			action: "1 reaction",
			damage_profile: "6d6 radiant",
			lattice_interaction: "Standard channel",
			saving_throw: {
				ability: "Vitality",
				dc: 19,
				success: "No effect",
				failure: "Full effect and stunned 1 round",
			},
		},
		effects: {
			primary:
				"Call down lightning bolts every turn as a bonus action (6d10 damage).",
			secondary:
				"Once learned via Rune, adapts to your highest applicable attribute.",
		},
		limitations: {
			uses: "Once per day",
			recharge: "Long rest",
		},
		flavor:
			"Absorbs the concept of defeat. A sorrowful surge of lethal intent.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/storm-call.webp",
		lore: {
			origin:
				"Emerged from the Hunter Association's classified Project: Lattice Break experiments.",
			history:
				"Archaeological evidence suggests ancient civilizations may have accessed similar power through ritual sacrifice.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Purchased from a black-market auction in the underground district of Neo-Seoul for an undisclosed sum.",
		tags: ["power", "psychic", "radiant", "area", "defensive"],
		theme_tags: ["elite-tier", "modern-warfare"],
	},
	{
		id: "blight-touch",
		name: "Blight Touch",
		description:
			"Instill rapid decay and necrosis with a simple physical touch.",
		type: "innate",
		rarity: "rare",
		requirements: {
			level: 9,
			ability: "Sense",
			score: 13,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "touch",
		},
		mechanics: {
			attack: {
				type: "psychic",
				mode: "ranged",
				resolution: "saving_throw",
				modifier: "Strength",
				damage: "6d6",
				damage_type: "psychic",
			},
			saving_throw: {
				ability: "Vitality",
				dc: 21,
				success: "Half damage",
				failure: "Full effect and prone",
			},
			action_type: "1 reaction",
			type: "innate",
			frequency: "1/short rest",
			action: "1 reaction",
			damage_profile: "6d6 psychic",
			lattice_interaction: "Ambient mana absorption",
		},
		effects: {
			primary:
				"Deal 8d8 necrotic damage. Plants and non-magical structures instantly wither or degrade.",
			secondary:
				"Once learned via Rune, adapts to your highest applicable attribute.",
		},
		limitations: {
			uses: "Twice per day",
			recharge: "Long rest",
		},
		flavor:
			"Bends the quiet space between breaths. An intricate death of hesitation.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/blight-touch.webp",
		lore: {
			origin:
				"Stolen from a Guild vault during the Three-Day War between rival Korean Hunter factions.",
			history:
				"Archaeological evidence suggests ancient civilizations may have accessed similar power through ritual sacrifice.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Excavated from the crystallized mana deposit at the center of a depleted Gate core.",
		tags: ["power", "defensive", "burst", "sustained", "healing"],
		theme_tags: ["monarch-era", "dimensional-bleed", "elite-tier"],
	},
	{
		id: "starfall",
		name: "Starfall",
		description:
			"You harness pure energy to decree the target's power. This manifestation of Absolute resonance bypasses traditional defenses.",
		type: "awakening",
		rarity: "legendary",
		requirements: {
			level: 20,
			ability: "Intelligence",
			score: 20,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "feet",
			distance: 300,
		},
		mechanics: {
			attack: {
				type: "cold",
				mode: "self",
				resolution: "spell_attack",
				modifier: "Agility",
				damage: "5d6",
				damage_type: "cold",
			},
			critical: true,
			action_type: "1 action",
			type: "divine",
			frequency: "At will",
			action: "1 action",
			damage_profile: "5d6 cold",
			lattice_interaction: "Lattice bypass — raw power",
			saving_throw: {
				ability: "Agility",
				dc: 10,
				success: "No effect",
				failure: "Full effect and stunned 1 round",
			},
		},
		effects: {
			primary:
				"A blazing meteorite impacts a 40-foot radius. Deals 15d6 fire and 15d6 bludgeoning damage.",
			secondary:
				"Once learned via Rune, adapts to your highest applicable attribute.",
		},
		limitations: {
			uses: "Once per month",
			recharge: "Month",
		},
		flavor:
			"Cleanses the fragile limits of flesh. An intricate ultimate equalizer.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/starfall.webp",
		lore: {
			origin:
				"Decoded from ancient sigil-stones found beneath the ruins of a pre-Awakening temple in Kyoto.",
			history:
				"The Japanese Hunter Association attempted to classify this as a national treasure to prevent export.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Dropped by a mini-boss that shouldn't have existed according to the Gate's difficulty rating.",
		tags: ["power", "psychic", "utility", "radiant"],
		theme_tags: ["monarch-era", "guild-ops"],
	},
	{
		id: "reality-glitch",
		name: "Reality Glitch",
		description: "Briefly desynchronize a target from the dimensional lattice.",
		type: "awakening",
		rarity: "very_rare",
		requirements: {
			level: 16,
			ability: "Intelligence",
			score: 16,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "feet",
			distance: 30,
		},
		mechanics: {
			attack: {
				type: "radiant",
				mode: "melee",
				resolution: "spell_attack",
				modifier: "Agility",
				damage: "3d6",
				damage_type: "radiant",
			},
			saving_throw: {
				ability: "Sense",
				dc: 12,
				success: "Partial effect",
				failure: "Full damage",
			},
			action_type: "1 bonus action",
			type: "class",
			frequency: "1/short rest",
			action: "1 bonus action",
			damage_profile: "3d6 radiant",
			lattice_interaction: "Direct mana circuit injection",
		},
		effects: {
			primary:
				"Target is removed from reality for 1d4 rounds. When they return, they take 10d10 force damage.",
			secondary: "Adaptive once learned via Rune.",
		},
		limitations: {
			uses: "Once per day",
			recharge: "Long rest",
		},
		flavor:
			"Overrides the arrogant and the mighty. A devastating whisper in the shadows.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/reality-glitch.webp",
		lore: {
			origin:
				"Pulled from the dreams of a comatose S-Rank Hunter by a team of psychic-type Awakened.",
			history:
				"The Hunter Bureau classified this as a Level-4 threat vector before it was repurposed for field operations.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Found in a hidden compartment of a relic weapon that had been in Guild storage for years.",
		tags: ["power", "fire", "void"],
		theme_tags: ["dimensional-bleed", "ancient-power", "system-glitch"],
	},
	{
		id: "solar-flare",
		name: "Solar Flare",
		description:
			"You harness incandescent energy to illuminate the target's halo. This manifestation of Solar resonance bypasses traditional defenses.",
		type: "divine",
		rarity: "rare",
		requirements: {
			level: 9,
			ability: "Sense",
			score: 13,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "feet",
			distance: 20,
		},
		mechanics: {
			attack: {
				type: "radiant",
				mode: "melee",
				resolution: "saving_throw",
				modifier: "Presence",
				damage: "6d6",
				damage_type: "radiant",
			},
			critical: true,
			action_type: "1 reaction",
			type: "class",
			frequency: "3/long rest",
			action: "1 reaction",
			damage_profile: "6d6 radiant",
			lattice_interaction: "Resonance amplification",
			saving_throw: {
				ability: "Intelligence",
				dc: 20,
				success: "No effect",
				failure: "Full effect and stunned 1 round",
			},
		},
		effects: {
			primary:
				"All creatures in a 20ft radius take 6d8 fire damage and are blinded for 1 minute.",
			secondary: "Adaptive once learned via Rune.",
		},
		limitations: {
			uses: "Twice per day",
			recharge: "Long rest",
		},
		flavor: "Reclaims the architect's design. A devastating roar of raw mana.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/solar-flare.webp",
		lore: {
			origin:
				"Discovered embedded in the spine of a petrified World Tree fragment found in Scandinavia.",
			history:
				"Archaeological evidence suggests ancient civilizations may have accessed similar power through ritual sacrifice.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Dropped by a mini-boss that shouldn't have existed according to the Gate's difficulty rating.",
		tags: ["power", "area", "mobility", "void", "offensive"],
		theme_tags: ["dungeon-core", "modern-warfare", "urban-combat"],
	},
	{
		id: "void-singularity",
		name: "Void Singularity",
		description:
			"By aligning your lattice with the Void Absolute, you can nullify the local mana-void. This manifestation bypasses standard Rift dampeners.",
		type: "awakening",
		rarity: "legendary",
		requirements: {
			level: 20,
			ability: "Intelligence",
			score: 20,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "feet",
			distance: 100,
		},
		mechanics: {
			stat_bonuses: {
				Intelligence: 1,
			},
			resistance: ["necrotic"],
			special: "Aligned with Void resonance.",
			action_type: "1 bonus action",
			type: "awakening",
			frequency: "2/short rest",
			action: "1 bonus action",
			damage_profile: "2d12 cold",
			lattice_interaction: "Ambient mana absorption",
			attack: {
				type: "cold",
				mode: "ranged",
				resolution: "automatic",
				modifier: "Strength",
				damage: "2d12",
				damage_type: "cold",
			},
			saving_throw: {
				ability: "Agility",
				dc: 19,
				success: "Partial effect",
				failure: "Full effect and prone",
			},
		},
		effects: {
			primary:
				"Create a singularity that pulls all creatures within 50ft toward it. Deals 20d10 force damage.",
			secondary:
				"Targets with less than 100HP are instantly annihilated. Adaptive.",
		},
		limitations: {
			uses: "Once per day",
			recharge: "Dawn",
		},
		flavor:
			"Ignites the concept of defeat. A sorrowful surge of lethal intent.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/void-singularity.webp",
		lore: {
			origin:
				"Manifested spontaneously during a double-dungeon event in the American Midwest.",
			history:
				"This was one of twelve artifacts recovered from the infamous Kamish Raid that changed modern Hunter warfare.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Traded by a nomadic Awakened who claimed to have no memory of acquiring it.",
		tags: ["power", "damage", "mobility", "support"],
		theme_tags: ["dimensional-bleed", "forbidden"],
	},
	{
		id: "aeon-shield",
		name: "Aeon Shield",
		description:
			"You harness dilated energy to loop the target's stasis. This manifestation of Chrono resonance bypasses traditional defenses.",
		type: "divine",
		rarity: "very_rare",
		requirements: {
			level: 14,
			ability: "Sense",
			score: 16,
		},
		activation: {
			type: "bonus-action",
		},
		range: {
			type: "self",
		},
		mechanics: {
			attack: {
				type: "thunder",
				mode: "aura",
				resolution: "ability_check",
				modifier: "Presence",
				damage: "4d6",
				damage_type: "thunder",
			},
			critical: true,
			action_type: "1 action",
			type: "monstrous",
			frequency: "2/short rest",
			action: "1 action",
			damage_profile: "4d6 thunder",
			lattice_interaction: "Resonance amplification",
			saving_throw: {
				ability: "Vitality",
				dc: 21,
				success: "No effect",
				failure: "Full effect and prone",
			},
		},
		effects: {
			primary:
				"For 1 minute, you are immune to all damage as attacks simply stop in time before hitting you.",
			secondary: "You cannot move more than 5ft per turn while active.",
		},
		limitations: {
			uses: "Once per long rest",
			recharge: "Dusk",
		},
		flavor:
			"Reclaims the dimensional divide. A silent testament to absolute power.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/aeon-shield.webp",
		lore: {
			origin:
				"Reconstructed from fragments scattered across seven different C-Rank dungeons.",
			history:
				"The first recorded use caused a localized reality fracture that took a specialized team forty hours to repair.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Discovered by an E-Rank Hunter who stumbled into an unmarked side passage during a routine dungeon clear.",
		tags: ["power", "sustained", "stealth"],
		theme_tags: ["rift-energy", "dungeon-core"],
	},
	{
		id: "nebula-drift",
		name: "Nebula Drift",
		description:
			"You harness unstable energy to shred the target's primordial mass. This manifestation of Chaos resonance bypasses traditional defenses.",
		type: "innate",
		rarity: "rare",
		requirements: {
			level: 9,
			ability: "Agility",
			score: 14,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "self",
		},
		mechanics: {
			attack: {
				type: "fire",
				mode: "ranged",
				resolution: "automatic",
				modifier: "Presence",
				damage: "6d6",
				damage_type: "fire",
			},
			action_type: "1 reaction",
			type: "divine",
			frequency: "2/short rest",
			action: "1 reaction",
			damage_profile: "6d6 fire",
			lattice_interaction: "Lattice bypass — raw power",
			saving_throw: {
				ability: "Intelligence",
				dc: 14,
				success: "Partial effect",
				failure: "Full effect and prone",
			},
		},
		effects: {
			primary:
				"You become incorporeal and can pass through objects. You gain a fly speed of 60ft.",
			secondary: "While drifting, you are invisible in dim light or darkness.",
		},
		limitations: {
			uses: "Duration: 10 minutes",
			recharge: "Dusk",
		},
		flavor:
			"A relic of the Chaos Resonance event. The air hums with entropic power.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/nebula-drift.webp",
		lore: {
			origin:
				"Recovered from the personal vault of a National-Level Hunter who vanished during the Jeju Island Raid.",
			history:
				"The American Hunter Bureau's Project: Starfall attempted to weaponize this before the program was defunded.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Purchased from a black-market auction in the underground district of Neo-Seoul for an undisclosed sum.",
		tags: ["power", "support", "shadow", "defensive", "control"],
		theme_tags: ["system-glitch", "rift-energy", "dimensional-bleed"],
	},
	{
		id: "gravity-well",
		name: "Gravity Well",
		description:
			"You harness tectonic energy to grind the target's lithosphere. This manifestation of Titanic resonance bypasses traditional defenses.",
		type: "awakening",
		rarity: "uncommon",
		requirements: {
			level: 4,
			ability: "Strength",
			score: 13,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "feet",
			distance: 60,
		},
		mechanics: {
			attack: {
				type: "necrotic",
				mode: "melee",
				resolution: "saving_throw",
				modifier: "Intelligence",
				damage: "3d6",
				damage_type: "necrotic",
			},
			critical: true,
			action_type: "1 action",
			type: "divine",
			frequency: "2/short rest",
			action: "1 action",
			damage_profile: "3d6 necrotic",
			lattice_interaction: "Direct mana circuit injection",
			saving_throw: {
				ability: "Vitality",
				dc: 13,
				success: "Partial effect",
				failure: "Full effect and stunned 1 round",
			},
		},
		effects: {
			primary:
				"Creatures in a 20ft radius have their speed reduced to 0 and take 4d6 bludgeoning damage.",
			secondary: "Flying creatures are slammed to the ground.",
		},
		limitations: {
			uses: "3 times per day",
			recharge: "Long rest",
		},
		flavor: "Bends the remnants of humanity. A subtle surge of lethal intent.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/gravity-well.webp",
		lore: {
			origin:
				"Unearthed by a mining Guild operating in the mana-saturated quarries of the Australian Outback.",
			history:
				"The Hunter Bureau classified this as a Level-4 threat vector before it was repurposed for field operations.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Dropped by a mini-boss that shouldn't have existed according to the Gate's difficulty rating.",
		tags: ["power", "utility", "necrotic"],
		theme_tags: ["modern-warfare", "dimensional-bleed"],
	},
	{
		id: "quantum-entanglement",
		name: "Quantum Entanglement",
		description:
			"You harness fundamental energy to transmute the target's structure. This manifestation of Absolute resonance bypasses traditional defenses.",
		type: "awakening",
		rarity: "rare",
		requirements: {
			level: 11,
			ability: "Intelligence",
			score: 15,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "feet",
			distance: 60,
		},
		mechanics: {
			attack: {
				type: "lightning",
				mode: "ranged",
				resolution: "automatic",
				modifier: "Presence",
				damage: "4d6",
				damage_type: "lightning",
			},
			saving_throw: {
				ability: "Vitality",
				dc: 18,
				success: "Half damage",
				failure: "Full effect and prone",
			},
			action_type: "1 bonus action",
			type: "class",
			frequency: "Proficiency/long rest",
			action: "1 bonus action",
			damage_profile: "4d6 lightning",
			lattice_interaction: "Resonance amplification",
		},
		effects: {
			primary:
				"Choose two targets. Any damage or healing received by one is shared by the other.",
			secondary: "Duration: 1 minute. Adaptive.",
		},
		limitations: {
			uses: "Once per short rest",
			recharge: "Dusk",
		},
		flavor:
			"Absorbs the fragile limits of flesh. A sorrowful breaking point of the world.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/quantum-entanglement.webp",
		lore: {
			origin:
				"Salvaged from the corpse of an S-Rank anomaly that breached containment in the European Dead Zone.",
			history:
				"Historical analysis suggests this predates the modern Gate system by several centuries.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Sold by a mysterious merchant who appears only during full moons near active Gate sites.",
		tags: ["power", "radiant", "debuff", "stealth"],
		theme_tags: ["urban-combat", "hunter-bureau"],
	},
	{
		id: "supernova-blast",
		name: "Supernova Blast",
		description:
			"You harness fundamental energy to decree the target's reality. This manifestation of Absolute resonance bypasses traditional defenses.",
		type: "divine",
		rarity: "legendary",
		requirements: {
			level: 18,
			ability: "Presence",
			score: 18,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "feet",
			distance: 120,
		},
		mechanics: {
			attack: {
				type: "force",
				mode: "aura",
				resolution: "spell_attack",
				modifier: "Presence",
				damage: "3d6",
				damage_type: "force",
			},
			action_type: "1 action",
			type: "awakening",
			frequency: "3/long rest",
			action: "1 action",
			damage_profile: "3d6 force",
			lattice_interaction: "Direct mana circuit injection",
			saving_throw: {
				ability: "Strength",
				dc: 16,
				success: "No effect",
				failure: "Full effect and stunned 1 round",
			},
		},
		effects: {
			primary: "Deals 15d12 fire and radiant damage in a 40ft radius.",
			secondary:
				"Creatures that survive are permanently blinded unless cured by high-tier magic.",
		},
		limitations: {
			uses: "Once per day",
			recharge: "Short rest",
		},
		flavor:
			"A relic of the Absolute Resonance event. The air hums with entropic power.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/supernova-blast.webp",
		lore: {
			origin:
				"Created by an unnamed Awakened blacksmith who fed their own life force into the forge.",
			history:
				"The Hunter Bureau classified this as a Level-4 threat vector before it was repurposed for field operations.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Sold by a mysterious merchant who appears only during full moons near active Gate sites.",
		tags: ["power", "necrotic", "support", "damage"],
		theme_tags: ["shadow-domain", "mana-overflow"],
	},
	{
		id: "nanite-swarm",
		name: "Nanite Swarm",
		description:
			"You harness fundamental energy to manifest the target's will. This manifestation of Absolute resonance bypasses traditional defenses.",
		type: "class",
		rarity: "uncommon",
		requirements: {
			level: 6,
			ability: "Intelligence",
			score: 14,
		},
		activation: {
			type: "bonus-action",
		},
		range: {
			type: "feet",
			distance: 30,
		},
		mechanics: {
			attack: {
				type: "acid",
				mode: "melee",
				resolution: "saving_throw",
				modifier: "Agility",
				damage: "2d12",
				damage_type: "acid",
			},
			saving_throw: {
				ability: "Sense",
				dc: 21,
				success: "Partial effect",
				failure: "Full effect and prone",
			},
			action_type: "1 bonus action",
			type: "divine",
			frequency: "At will",
			action: "1 bonus action",
			damage_profile: "2d12 acid",
			lattice_interaction: "Direct mana circuit injection",
		},
		effects: {
			primary:
				"The swarm deals 2d8 piercing damage to a target each turn and grants you half-cover.",
			secondary: "Can be used to repair metal objects or heal constructs.",
		},
		limitations: {
			uses: "Concentration, up to 1 minute",
			recharge: "Dawn",
		},
		flavor:
			"Ignores the remnants of humanity. A devastating dance performed on the edge of a blade.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/nanite-swarm.webp",
		lore: {
			origin:
				"Formed naturally in a mana vein so dense that reality itself began to crystallize around it.",
			history:
				"Combat logs from the Busan Incident show this was used to hold a Gate breach for forty-seven minutes.",
			curse:
				"Creates a sympathetic bond with the nearest Gate; the user feels physical pain when Gates are destroyed.",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Found washed ashore near a coastal Gate, wrapped in fabric that dissolved upon touch.",
		tags: ["power", "offensive", "debuff", "single-target", "necrotic"],
		theme_tags: ["hunter-bureau", "dimensional-bleed", "urban-combat"],
	},
	{
		id: "titan-strength",
		name: "Titan's Strength",
		description:
			"By aligning your lattice with the Titanic Absolute, you can grind the local core. This manifestation bypasses standard Rift dampeners.",
		type: "innate",
		rarity: "uncommon",
		requirements: {
			level: 3,
			ability: "Strength",
			score: 17,
		},
		activation: {
			type: "bonus-action",
		},
		range: {
			type: "self",
		},
		mechanics: {
			attack: {
				type: "force",
				mode: "self",
				resolution: "saving_throw",
				modifier: "Sense",
				damage: "4d6",
				damage_type: "force",
			},
			critical: true,
			action_type: "1 bonus action",
			type: "innate",
			frequency: "At will",
			action: "1 bonus action",
			damage_profile: "4d6 force",
			lattice_interaction: "Direct mana circuit injection",
			saving_throw: {
				ability: "Sense",
				dc: 17,
				success: "Half damage",
				failure: "Full effect and stunned 1 round",
			},
		},
		effects: {
			primary:
				"Your next melee attack deals triple damage and knocks the target prone.",
			secondary:
				"You count as one size larger for lifting and carrying for 1 hour.",
		},
		limitations: {
			uses: "Once per short rest",
			recharge: "Dusk",
		},
		flavor:
			"Ignores the remnants of humanity. An absolute dance performed on the edge of a blade.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/titan-strength.webp",
		lore: {
			origin:
				"Created by an unnamed Awakened blacksmith who fed their own life force into the forge.",
			history:
				"The first recorded use caused a localized reality fracture that took a specialized team forty hours to repair.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Located by a detection-type Hunter whose radar ability triggered on an otherwise empty room.",
		tags: ["power", "damage", "control"],
		theme_tags: ["urban-combat", "black-market"],
	},
	{
		id: "echoes-of-the-past",
		name: "Echoes of the Past",
		description:
			"By aligning your lattice with the Absolute Absolute, you can mandate the local will. This manifestation bypasses standard Rift dampeners.",
		type: "awakening",
		rarity: "rare",
		requirements: {
			level: 13,
			ability: "Sense",
			score: 14,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "feet",
			distance: 30,
		},
		mechanics: {
			attack: {
				type: "force",
				mode: "self",
				resolution: "automatic",
				modifier: "Intelligence",
				damage: "5d6",
				damage_type: "force",
			},
			action_type: "1 action",
			type: "innate",
			frequency: "1/short rest",
			action: "1 action",
			damage_profile: "5d6 force",
			lattice_interaction: "Direct mana circuit injection",
			saving_throw: {
				ability: "Presence",
				dc: 20,
				success: "Partial effect",
				failure: "Full damage",
			},
		},
		effects: {
			primary:
				"Create 1d4 echoes that mimic your movements and attacks, dealing 25% damage each.",
			secondary:
				"Enemies have disadvantage on attacks against you while echoes are active.",
		},
		limitations: {
			uses: "Duration: 3 rounds",
			recharge: "Dusk",
		},
		flavor:
			"A relic of the Absolute Resonance event. The air hums with entropic power.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/echoes.webp",
		lore: {
			origin:
				"Manifested spontaneously during a double-dungeon event in the American Midwest.",
			history:
				"Intelligence reports link this to the Shadow Monarch's army, though the connection remains unconfirmed.",
			curse:
				"Each activation permanently reduces the user's maximum HP by 1, imperceptible until it's too late.",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Traded by a nomadic Awakened who claimed to have no memory of acquiring it.",
		tags: ["power", "necrotic", "perception", "sustained", "debuff"],
		theme_tags: ["post-awakening", "survival"],
	},
	{
		id: "glacier-prison",
		name: "Glacier Prison",
		description:
			"You harness fundamental energy to transmute the target's will. This manifestation of Absolute resonance bypasses traditional defenses.",
		type: "divine",
		rarity: "rare",
		requirements: {
			level: 12,
			ability: "Vitality",
			score: 16,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "feet",
			distance: 60,
		},
		mechanics: {
			attack: {
				type: "psychic",
				mode: "aura",
				resolution: "saving_throw",
				modifier: "Agility",
				damage: "6d6",
				damage_type: "psychic",
			},
			action_type: "1 reaction",
			type: "divine",
			frequency: "2/short rest",
			action: "1 reaction",
			damage_profile: "6d6 psychic",
			lattice_interaction: "Lattice bypass — raw power",
			saving_throw: {
				ability: "Intelligence",
				dc: 11,
				success: "Partial effect",
				failure: "Full effect and stunned 1 round",
			},
		},
		effects: {
			primary:
				"Target is frozen solid, becoming paralyzed and immune to all damage for 3 rounds.",
			secondary: "When it breaks, it takes 12d6 cold damage. Adaptive.",
		},
		limitations: {
			uses: "Once per day",
			recharge: "Dusk",
		},
		flavor:
			"A relic of the Absolute Resonance event. The air hums with entropic power.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/glacier-prison.webp",
		lore: {
			origin:
				"Stolen from a Guild vault during the Three-Day War between rival Korean Hunter factions.",
			history:
				"Archaeological evidence suggests ancient civilizations may have accessed similar power through ritual sacrifice.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Found in a hidden compartment of a relic weapon that had been in Guild storage for years.",
		tags: ["power", "necrotic", "defensive", "lightning"],
		theme_tags: ["monarch-era", "hunter-bureau", "guild-ops"],
	},
	{
		id: "bio-luminescence",
		name: "Bio-Luminescence",
		description:
			"You harness fundamental energy to mandate the target's power. This manifestation of Absolute resonance bypasses traditional defenses.",
		type: "innate",
		rarity: "common",
		requirements: {
			level: 1,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "self",
		},
		mechanics: {
			attack: {
				type: "lightning",
				mode: "aura",
				resolution: "saving_throw",
				modifier: "Sense",
				damage: "3d6",
				damage_type: "lightning",
			},
			saving_throw: {
				ability: "Intelligence",
				dc: 17,
				success: "Half damage",
				failure: "Full damage",
			},
			action_type: "1 bonus action",
			type: "divine",
			frequency: "At will",
			action: "1 bonus action",
			damage_profile: "3d6 lightning",
			lattice_interaction: "Standard channel",
		},
		effects: {
			primary:
				"Shed bright light in a 20ft radius and dim light for another 20ft.",
			secondary: "You can change the color at will. Adaptive.",
		},
		limitations: {
			uses: "At-will",
			recharge: "Dawn",
		},
		flavor:
			"Destroys the quiet space between breaths. A triumphant death of hesitation.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/light.webp",
		lore: {
			origin:
				"Leaked through a micro-rift that appeared inside the International Hunter Conference hall.",
			history:
				"Originally developed as a countermeasure against Monarch-class entities during the Sovereignty Wars.",
			curse:
				"Prolonged wielders report hearing a second heartbeat that doesn't match their own.",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Sold by a mysterious merchant who appears only during full moons near active Gate sites.",
		tags: ["power", "damage", "void", "healing"],
		theme_tags: ["mana-overflow", "dimensional-bleed", "hunter-bureau"],
	},
	{
		id: "neuro-spike",
		name: "Neuro Spike",
		description:
			"By aligning your lattice with the Absolute Absolute, you can mandate the local will. This manifestation bypasses standard Rift dampeners.",
		type: "class",
		rarity: "common",
		requirements: {
			level: 2,
			ability: "Intelligence",
			score: 13,
		},
		activation: {
			type: "bonus-action",
		},
		range: {
			type: "feet",
			distance: 30,
		},
		mechanics: {
			attack: {
				type: "fire",
				mode: "self",
				resolution: "ability_check",
				modifier: "Intelligence",
				damage: "3d8",
				damage_type: "fire",
			},
			critical: true,
			action_type: "1 reaction",
			type: "awakening",
			frequency: "At will",
			action: "1 reaction",
			damage_profile: "3d8 fire",
			lattice_interaction: "Standard channel",
			saving_throw: {
				ability: "Intelligence",
				dc: 12,
				success: "No effect",
				failure: "Full damage",
			},
		},
		effects: {
			primary:
				"Target takes 1d10 psychic damage and cannot take reactions until their next turn.",
			secondary: "Adaptive DC.",
		},
		limitations: {
			uses: "At-will",
			recharge: "Dusk",
		},
		flavor: "Denies the remnants of humanity. A brutal surge of lethal intent.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/neuro-spike.webp",
		lore: {
			origin:
				"Extracted from the dimensional residue of a collapsed B-Rank Gate in downtown Seoul.",
			history:
				"Multiple Guilds have attempted to replicate this; all reproductions have proven inferior to the original.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Sold by a mysterious merchant who appears only during full moons near active Gate sites.",
		tags: ["power", "area", "fire", "shadow", "ice"],
		theme_tags: ["forbidden", "rift-energy"],
	},
	{
		id: "plasma-whip",
		name: "Plasma Whip",
		description:
			"You harness hyper-charged energy to discharge the target's volts. This manifestation of Storm resonance bypasses traditional defenses.",
		type: "awakening",
		rarity: "uncommon",
		requirements: {
			level: 5,
			ability: "Agility",
			score: 15,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "feet",
			distance: 15,
		},
		mechanics: {
			attack: {
				type: "lightning",
				mode: "melee",
				resolution: "spell_attack",
				modifier: "Intelligence",
				damage: "2d10",
				damage_type: "lightning",
			},
			saving_throw: {
				ability: "Vitality",
				dc: 18,
				success: "No effect",
				failure: "Full effect and prone",
			},
			action_type: "1 bonus action",
			type: "divine",
			frequency: "3/long rest",
			action: "1 bonus action",
			damage_profile: "2d10 lightning",
			lattice_interaction: "Lattice bypass — raw power",
		},
		effects: {
			primary:
				"Melee spell attack dealing 3d8 fire damage. Target is pulled 10ft toward you.",
			secondary: "Adaptive attack modifier.",
		},
		limitations: {
			uses: "At-will",
			recharge: "Long rest",
		},
		flavor:
			"Weaves all who stand in opposition. A subtle beautiful catastrophe.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/plasma-whip.webp",
		lore: {
			origin:
				"Unearthed by a mining Guild operating in the mana-saturated quarries of the Australian Outback.",
			history:
				"This technique was banned by the International Guild Association for eighteen months before being reclassified.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Found washed ashore near a coastal Gate, wrapped in fabric that dissolved upon touch.",
		tags: ["power", "debuff", "burst"],
		theme_tags: ["system-glitch", "ancient-power"],
	},
	{
		id: "spectral-blade",
		name: "Spectral Blade",
		description:
			"You harness pure energy to mandate the target's structure. This manifestation of Absolute resonance bypasses traditional defenses.",
		type: "class",
		rarity: "uncommon",
		requirements: {
			level: 3,
			ability: "Presence",
			score: 14,
		},
		activation: {
			type: "bonus-action",
		},
		range: {
			type: "self",
		},
		mechanics: {
			attack: {
				type: "acid",
				mode: "ranged",
				resolution: "ability_check",
				modifier: "Strength",
				damage: "3d6",
				damage_type: "acid",
			},
			critical: true,
			action_type: "1 reaction",
			type: "divine",
			frequency: "1/short rest",
			action: "1 reaction",
			damage_profile: "3d6 acid",
			lattice_interaction: "Direct mana circuit injection",
			saving_throw: {
				ability: "Agility",
				dc: 16,
				success: "No effect",
				failure: "Full effect and prone",
			},
		},
		effects: {
			primary:
				"A blade appears in your hand. Attacks deal 2d10 force damage and ignore non-magical armor.",
			secondary: "Duration: 10 minutes. Adaptive.",
		},
		limitations: {
			uses: "Once per short rest",
			recharge: "Long rest",
		},
		flavor:
			"Cleanses the arrogant and the mighty. A forbidden whisper in the shadows.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/spectral-blade.webp",
		lore: {
			origin:
				"Synthesized in the clandestine laboratories beneath the Chinese Hunter Bureau headquarters.",
			history:
				"The Hunter Bureau classified this as a Level-4 threat vector before it was repurposed for field operations.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Recovered from a time-locked chest that required three different elemental keys to open.",
		tags: ["power", "mobility", "perception"],
		theme_tags: ["ancient-power", "shadow-domain", "modern-warfare"],
	},
	{
		id: "dimensional-rift",
		name: "Dimensional Rift",
		description:
			"You harness harmonic energy to project the target's dimensional fabric. This manifestation of Aetheric resonance bypasses traditional defenses.",
		type: "innate",
		rarity: "rare",
		requirements: {
			level: 7,
			ability: "Intelligence",
			score: 15,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "self",
		},
		mechanics: {
			attack: {
				type: "radiant",
				mode: "ranged",
				resolution: "automatic",
				modifier: "Agility",
				damage: "2d12",
				damage_type: "radiant",
			},
			saving_throw: {
				ability: "Strength",
				dc: 14,
				success: "Half damage",
				failure: "Full damage",
			},
			action_type: "1 action",
			type: "class",
			frequency: "Proficiency/long rest",
			action: "1 action",
			damage_profile: "2d12 radiant",
			lattice_interaction: "Ambient mana absorption",
		},
		effects: {
			primary: "Access a private storage dimension (up to 500 lbs of gear).",
			secondary: "Can be used to bypass security checkpoints easily.",
		},
		limitations: {
			uses: "At-will",
			recharge: "Long rest",
		},
		flavor:
			"Overrides the fragile limits of flesh. A silent breaking point of the world.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/rift.webp",
		lore: {
			origin:
				"Emerged from the Hunter Association's classified Project: Lattice Break experiments.",
			history:
				"This was one of twelve artifacts recovered from the infamous Kamish Raid that changed modern Hunter warfare.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Dropped by a mini-boss that shouldn't have existed according to the Gate's difficulty rating.",
		tags: ["power", "burst", "lightning"],
		theme_tags: ["gate-zone", "forbidden"],
	},
	{
		id: "soul-binding",
		name: "Soul Binding",
		description:
			"By aligning your lattice with the Absolute Absolute, you can mandate the local will. This manifestation bypasses standard Rift dampeners.",
		type: "class",
		rarity: "very_rare",
		requirements: {
			level: 15,
			ability: "Presence",
			score: 16,
		},
		activation: {
			type: "long-rest",
		},
		range: {
			type: "self",
		},
		mechanics: {
			attack: {
				type: "thunder",
				mode: "melee",
				resolution: "spell_attack",
				modifier: "Strength",
				damage: "3d6",
				damage_type: "thunder",
			},
			critical: true,
			action_type: "1 action",
			type: "class",
			frequency: "Proficiency/long rest",
			action: "1 action",
			damage_profile: "3d6 thunder",
			lattice_interaction: "Ambient mana absorption",
			saving_throw: {
				ability: "Agility",
				dc: 14,
				success: "Half damage",
				failure: "Full damage",
			},
		},
		effects: {
			primary:
				"Choose a 'Sanctuary'. You can teleport back to it from anywhere on the same plane.",
			secondary:
				"If you die, you can choose to reincarnate at the Sanctuary after 7 days.",
		},
		limitations: {
			uses: "One anchor at a time",
			recharge: "Long rest",
		},
		flavor:
			"Cleanses the flow of time itself. A forbidden symphony of violence.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/soul-bind.webp",
		lore: {
			origin:
				"Leaked through a micro-rift that appeared inside the International Hunter Conference hall.",
			history:
				"Guild archives show at least three S-Rank Hunters have died attempting to master its full potential.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Found washed ashore near a coastal Gate, wrapped in fabric that dissolved upon touch.",
		tags: ["power", "ice", "damage"],
		theme_tags: ["dungeon-core", "classified"],
	},
	{
		id: "entropy-field",
		name: "Entropy Field",
		description:
			"You harness entropic energy to extinguish the target's oblivion. This manifestation of Void resonance bypasses traditional defenses.",
		type: "awakening",
		rarity: "rare",
		requirements: {
			level: 10,
			ability: "Vitality",
			score: 14,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "feet",
			distance: 20,
		},
		mechanics: {
			attack: {
				type: "thunder",
				mode: "ranged",
				resolution: "saving_throw",
				modifier: "Presence",
				damage: "3d10",
				damage_type: "thunder",
			},
			saving_throw: {
				ability: "Agility",
				dc: 13,
				success: "Partial effect",
				failure: "Full effect and prone",
			},
			action_type: "1 action",
			type: "awakening",
			frequency: "At will",
			action: "1 action",
			damage_profile: "3d10 thunder",
			lattice_interaction: "Resonance amplification",
		},
		effects: {
			primary:
				"All non-living objects in range rot or rust instantly. Living targets take 5d8 necrotic damage.",
			secondary:
				"Metal armor has its AC reduced by 2 permanently (until repaired).",
		},
		limitations: {
			uses: "Once per short rest",
			recharge: "Long rest",
		},
		flavor:
			"Denies the concept of defeat. A brutal dance performed on the edge of a blade.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/entropy.webp",
		lore: {
			origin:
				"Reconstructed from fragments scattered across seven different C-Rank dungeons.",
			history:
				"Combat logs from the Busan Incident show this was used to hold a Gate breach for forty-seven minutes.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Discovered by an E-Rank Hunter who stumbled into an unmarked side passage during a routine dungeon clear.",
		tags: ["power", "ice", "area"],
		theme_tags: ["elite-tier", "forbidden", "mana-overflow"],
	},
	{
		id: "celestial-communion",
		name: "Celestial Communion",
		description:
			"You harness undeniable energy to mandate the target's structure. This manifestation of Absolute resonance bypasses traditional defenses.",
		type: "divine",
		rarity: "rare",
		requirements: {
			level: 11,
			ability: "Sense",
			score: 17,
		},
		activation: {
			type: "long-rest",
		},
		range: {
			type: "self",
		},
		mechanics: {
			attack: {
				type: "fire",
				mode: "aura",
				resolution: "automatic",
				modifier: "Presence",
				damage: "4d8",
				damage_type: "fire",
			},
			critical: true,
			action_type: "1 bonus action",
			type: "monstrous",
			frequency: "At will",
			action: "1 bonus action",
			damage_profile: "4d8 fire",
			lattice_interaction: "Direct mana circuit injection",
			saving_throw: {
				ability: "Strength",
				dc: 16,
				success: "No effect",
				failure: "Full effect and prone",
			},
		},
		effects: {
			primary:
				"You can ask three questions and receive cryptic but 100% accurate answers.",
			secondary:
				"You gain advantage on all Intelligence checks for the next 24 hours.",
		},
		limitations: {
			uses: "Once per week",
			recharge: "Dusk",
		},
		flavor:
			"Destroys the dimensional divide. A sorrowful symphony of violence.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/communion.webp",
		lore: {
			origin:
				"Recovered from the personal vault of a National-Level Hunter who vanished during the Jeju Island Raid.",
			history:
				"This was the subject of a bidding war between three S-Rank Guilds that nearly escalated to armed conflict.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Dropped by a mini-boss that shouldn't have existed according to the Gate's difficulty rating.",
		tags: ["power", "area", "damage", "void"],
		theme_tags: ["post-awakening", "shadow-domain"],
	},
	{
		id: "shadow-puppetry",
		name: "Shadow Puppetry",
		description:
			"By aligning your lattice with the Void Absolute, you can nullify the local mana-void. This manifestation bypasses standard Rift dampeners.",
		type: "innate",
		rarity: "very_rare",
		requirements: {
			level: 16,
			ability: "Agility",
			score: 18,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "feet",
			distance: 60,
		},
		mechanics: {
			stat_bonuses: {
				Intelligence: 1,
			},
			resistance: ["necrotic"],
			special: "Aligned with Void resonance.",
			action_type: "1 reaction",
			type: "monstrous",
			frequency: "At will",
			action: "1 reaction",
			damage_profile: "4d8 lightning",
			lattice_interaction: "Ambient mana absorption",
			attack: {
				type: "lightning",
				mode: "self",
				resolution: "automatic",
				modifier: "Presence",
				damage: "4d8",
				damage_type: "lightning",
			},
			saving_throw: {
				ability: "Strength",
				dc: 16,
				success: "Half damage",
				failure: "Full effect and prone",
			},
		},
		effects: {
			primary:
				"Target must make a Sense save or become your puppet. You control its movement and actions.",
			secondary:
				"Target can attempt to break free at the end of each turn. Adaptive DC.",
		},
		limitations: {
			uses: "Once per long rest",
			recharge: "Dawn",
		},
		flavor:
			"A relic of the Void Resonance event. The air hums with entropic power.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/puppetry.webp",
		lore: {
			origin:
				"Unearthed by a mining Guild operating in the mana-saturated quarries of the Australian Outback.",
			history:
				"Originally thought to be a failed experiment, it was rediscovered when a junior researcher noticed anomalous readings.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Purchased from a black-market auction in the underground district of Neo-Seoul for an undisclosed sum.",
		tags: ["power", "offensive", "lightning"],
		theme_tags: ["experimental", "monarch-era", "modern-warfare"],
	},
	{
		id: "thermal-vent",
		name: "Thermal Vent",
		description:
			"By aligning your lattice with the Absolute Absolute, you can mandate the local will. This manifestation bypasses standard Rift dampeners.",
		type: "innate",
		rarity: "uncommon",
		requirements: {
			level: 4,
			ability: "Vitality",
			score: 15,
		},
		activation: {
			type: "reaction",
		},
		range: {
			type: "feet",
			distance: 10,
		},
		mechanics: {
			attack: {
				type: "poison",
				mode: "melee",
				resolution: "spell_attack",
				modifier: "Strength",
				damage: "5d6",
				damage_type: "poison",
			},
			critical: true,
			action_type: "1 reaction",
			type: "awakening",
			frequency: "At will",
			action: "1 reaction",
			damage_profile: "5d6 poison",
			lattice_interaction: "Lattice bypass — raw power",
			saving_throw: {
				ability: "Strength",
				dc: 11,
				success: "No effect",
				failure: "Full effect and stunned 1 round",
			},
		},
		effects: {
			primary:
				"Triggered when you take damage. Deals 3d10 fire damage to all adjacent enemies.",
			secondary: "You gain resistance to fire damage for 1 hour.",
		},
		limitations: {
			uses: "Twice per long rest",
			recharge: "Dawn",
		},
		flavor:
			"Shatters the dimensional divide. A chaotic testament to absolute power.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/thermal.webp",
		lore: {
			origin:
				"Confiscated from a black-market dealer operating in the shadow districts of Manila.",
			history:
				"Field reports indicate prolonged exposure causes minor spatial distortions in a three-meter radius.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Located by a detection-type Hunter whose radar ability triggered on an otherwise empty room.",
		tags: ["power", "stealth", "area", "fire"],
		theme_tags: ["post-awakening", "urban-combat"],
	},
	{
		id: "gravity-leap",
		name: "Gravity Leap",
		description:
			"Invert your personal gravity to 'fall' upward or across distances.",
		type: "awakening",
		rarity: "common",
		requirements: {
			level: 2,
			ability: "Strength",
			score: 12,
		},
		activation: {
			type: "bonus-action",
		},
		range: {
			type: "self",
		},
		mechanics: {
			attack: {
				type: "necrotic",
				mode: "aura",
				resolution: "spell_attack",
				modifier: "Presence",
				damage: "2d12",
				damage_type: "necrotic",
			},
			saving_throw: {
				ability: "Presence",
				dc: 17,
				success: "No effect",
				failure: "Full effect and prone",
			},
			action_type: "1 reaction",
			type: "innate",
			frequency: "3/long rest",
			action: "1 reaction",
			damage_profile: "2d12 necrotic",
			lattice_interaction: "Lattice bypass — raw power",
		},
		effects: {
			primary:
				"You can jump up to 60ft as part of your movement. You do not take falling damage.",
			secondary: "You can stand on walls or ceilings for 1 round.",
		},
		limitations: {
			uses: "At-will",
			recharge: "Dawn",
		},
		flavor:
			"Destroys the quiet space between breaths. A triumphant roar of raw mana.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/leap.webp",
		lore: {
			origin:
				"Born from a System glitch that briefly merged two overlapping Gate instances.",
			history:
				"This was one of twelve artifacts recovered from the infamous Kamish Raid that changed modern Hunter warfare.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Materialized on a Hunter's workbench overnight, leaving scorch marks in the shape of unknown glyphs.",
		tags: ["power", "psychic", "damage", "control"],
		theme_tags: ["classified", "survival", "shadow-domain"],
	},
	{
		id: "obsidian-wall",
		name: "Obsidian Wall",
		description:
			"By aligning your lattice with the Absolute Absolute, you can mandate the local will. This manifestation bypasses standard Rift dampeners.",
		type: "awakening",
		rarity: "uncommon",
		requirements: {
			level: 6,
			ability: "Vitality",
			score: 14,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "feet",
			distance: 60,
		},
		mechanics: {
			attack: {
				type: "cold",
				mode: "aura",
				resolution: "automatic",
				modifier: "Strength",
				damage: "2d10",
				damage_type: "cold",
			},
			critical: true,
			action_type: "1 bonus action",
			type: "divine",
			frequency: "2/short rest",
			action: "1 bonus action",
			damage_profile: "2d10 cold",
			lattice_interaction: "Standard channel",
			saving_throw: {
				ability: "Presence",
				dc: 19,
				success: "Partial effect",
				failure: "Full effect and stunned 1 round",
			},
		},
		effects: {
			primary:
				"Create a wall 20ft long, 10ft high, and 1ft thick. It has 50 HP.",
			secondary:
				"Attacking it with melee deals 1d6 piercing damage back to the attacker.",
		},
		limitations: {
			uses: "Once per short rest",
			recharge: "Short rest",
		},
		flavor: "Absorbs the architect's design. A sorrowful roar of raw mana.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/wall.webp",
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
		discovery_lore:
			"Dropped by a mini-boss that shouldn't have existed according to the Gate's difficulty rating.",
		tags: ["power", "necrotic", "buff"],
		theme_tags: ["dungeon-core", "mana-overflow", "modern-warfare"],
	},
	{
		id: "star-fire-lance",
		name: "Star-Fire Lance",
		description:
			"You harness pure energy to decree the target's power. This manifestation of Absolute resonance bypasses traditional defenses.",
		type: "divine",
		rarity: "rare",
		requirements: {
			level: 10,
			ability: "Presence",
			score: 15,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "feet",
			distance: 120,
		},
		mechanics: {
			attack: {
				type: "acid",
				mode: "ranged",
				resolution: "saving_throw",
				modifier: "Intelligence",
				damage: "3d8",
				damage_type: "acid",
			},
			action_type: "1 reaction",
			type: "innate",
			frequency: "3/long rest",
			action: "1 reaction",
			damage_profile: "3d8 acid",
			lattice_interaction: "Direct mana circuit injection",
			saving_throw: {
				ability: "Vitality",
				dc: 16,
				success: "Half damage",
				failure: "Full effect and prone",
			},
		},
		effects: {
			primary: "A 5ft wide line deals 8d8 radiant damage. Penetrates targets.",
			secondary: "Undead take double damage.",
		},
		limitations: {
			uses: "2 times per long rest",
			recharge: "Dawn",
		},
		flavor:
			"A relic of the Absolute Resonance event. The air hums with entropic power.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/lance.webp",
		lore: {
			origin:
				"Found clutched in the hand of a petrified E-Rank Hunter who had been missing for three years.",
			history:
				"Multiple Guilds have attempted to replicate this; all reproductions have proven inferior to the original.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Gifted by the System itself as a reward for completing a hidden quest chain.",
		tags: ["power", "burst", "control", "sustained"],
		theme_tags: ["ancient-power", "modern-warfare", "dimensional-bleed"],
	},
	{
		id: "vortex-shield",
		name: "Vortex Shield",
		description:
			"By aligning your lattice with the Absolute Absolute, you can mandate the local will. This manifestation bypasses standard Rift dampeners.",
		type: "innate",
		rarity: "uncommon",
		requirements: {
			level: 5,
			ability: "Agility",
			score: 13,
		},
		activation: {
			type: "bonus-action",
		},
		range: {
			type: "self",
		},
		mechanics: {
			attack: {
				type: "cold",
				mode: "self",
				resolution: "saving_throw",
				modifier: "Agility",
				damage: "4d8",
				damage_type: "cold",
			},
			critical: true,
			action_type: "1 action",
			type: "monstrous",
			frequency: "1/short rest",
			action: "1 action",
			damage_profile: "4d8 cold",
			lattice_interaction: "Direct mana circuit injection",
			saving_throw: {
				ability: "Intelligence",
				dc: 15,
				success: "Partial effect",
				failure: "Full effect and stunned 1 round",
			},
		},
		effects: {
			primary:
				"Ranged attacks against you have disadvantage. Any creature that enters adjacent space is pushed 10ft away.",
			secondary: "Adaptive DC for push.",
		},
		limitations: {
			uses: "Duration: 1 minute",
			recharge: "Short rest",
		},
		flavor:
			"Crushes the concept of defeat. A desperate dance performed on the edge of a blade.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/vortex.webp",
		lore: {
			origin:
				"Manifested spontaneously during a double-dungeon event in the American Midwest.",
			history:
				"Originally thought to be a failed experiment, it was rediscovered when a junior researcher noticed anomalous readings.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Materialized on a Hunter's workbench overnight, leaving scorch marks in the shape of unknown glyphs.",
		tags: ["power", "perception", "radiant", "support", "fire"],
		theme_tags: ["classified", "guild-ops"],
	},
	{
		id: "seraph-call",
		name: "Seraph's Call",
		description:
			"By aligning your lattice with the Absolute Absolute, you can mandate the local will. This manifestation bypasses standard Rift dampeners.",
		type: "divine",
		rarity: "very_rare",
		requirements: {
			level: 14,
			ability: "Presence",
			score: 17,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "feet",
			distance: 30,
		},
		mechanics: {
			attack: {
				type: "radiant",
				mode: "melee",
				resolution: "ability_check",
				modifier: "Presence",
				damage: "3d10",
				damage_type: "radiant",
			},
			saving_throw: {
				ability: "Agility",
				dc: 15,
				success: "No effect",
				failure: "Full effect and prone",
			},
			action_type: "1 bonus action",
			type: "innate",
			frequency: "At will",
			action: "1 bonus action",
			damage_profile: "3d10 radiant",
			lattice_interaction: "Resonance amplification",
		},
		effects: {
			primary:
				"An angelic guardian appears and grants all allies +4 AC and resistance to necrotic damage.",
			secondary: "Duration: 1 minute. Adaptive.",
		},
		limitations: {
			uses: "Once per day",
			recharge: "Dusk",
		},
		flavor: "Ignores the architect's design. An absolute roar of raw mana.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/seraph.webp",
		lore: {
			origin:
				"Emerged from the Hunter Association's classified Project: Lattice Break experiments.",
			history:
				"Combat logs from the Busan Incident show this was used to hold a Gate breach for forty-seven minutes.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Materialized on a Hunter's workbench overnight, leaving scorch marks in the shape of unknown glyphs.",
		tags: ["power", "psychic", "necrotic", "sustained", "utility"],
		theme_tags: ["experimental", "elite-tier", "urban-combat"],
	},
	{
		id: "necrotic-tether",
		name: "Necrotic Tether",
		description:
			"By aligning your lattice with the Blood Absolute, you can rupture the local ichor. This manifestation bypasses standard Rift dampeners.",
		type: "class",
		rarity: "rare",
		requirements: {
			level: 9,
			ability: "Vitality",
			score: 15,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "feet",
			distance: 60,
		},
		mechanics: {
			attack: {
				type: "poison",
				mode: "aura",
				resolution: "spell_attack",
				modifier: "Agility",
				damage: "2d12",
				damage_type: "poison",
			},
			critical: true,
			action_type: "1 action",
			type: "innate",
			frequency: "At will",
			action: "1 action",
			damage_profile: "2d12 poison",
			lattice_interaction: "Standard channel",
			saving_throw: {
				ability: "Strength",
				dc: 10,
				success: "No effect",
				failure: "Full effect and prone",
			},
		},
		effects: {
			primary:
				"Target takes 4d6 necrotic damage each turn. You heal for the same amount.",
			secondary:
				"Tether breaks if the target moves more than 60ft away. Adaptive.",
		},
		limitations: {
			uses: "Concentration",
			recharge: "Long rest",
		},
		flavor:
			"Absorbs the quiet space between breaths. A sorrowful death of hesitation.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/tether.webp",
		lore: {
			origin:
				"Pulled from the dreams of a comatose S-Rank Hunter by a team of psychic-type Awakened.",
			history:
				"Archaeological evidence suggests ancient civilizations may have accessed similar power through ritual sacrifice.",
			curse:
				"The user's blood turns slightly luminescent, making stealth in darkness progressively more difficult.",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Dropped by a mini-boss that shouldn't have existed according to the Gate's difficulty rating.",
		tags: ["power", "debuff", "psychic", "perception"],
		theme_tags: ["mana-overflow", "hunter-bureau"],
	},
	{
		id: "glacial-fortress",
		name: "Glacial Fortress",
		description:
			"You harness absolute zero energy to petrify the target's molecular movement. This manifestation of Glacial resonance bypasses traditional defenses.",
		type: "awakening",
		rarity: "very_rare",
		requirements: {
			level: 16,
			ability: "Vitality",
			score: 18,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "feet",
			distance: 30,
		},
		mechanics: {
			attack: {
				type: "psychic",
				mode: "melee",
				resolution: "saving_throw",
				modifier: "Intelligence",
				damage: "4d8",
				damage_type: "psychic",
			},
			saving_throw: {
				ability: "Agility",
				dc: 19,
				success: "No effect",
				failure: "Full effect and prone",
			},
			action_type: "1 action",
			type: "class",
			frequency: "1/short rest",
			action: "1 action",
			damage_profile: "4d8 psychic",
			lattice_interaction: "Ambient mana absorption",
		},
		effects: {
			primary:
				"Create a 30ft radius dome. It has 200 HP and grants total cover to those inside.",
			secondary: "Temperature inside is perfectly regulated. Adaptive.",
		},
		limitations: {
			uses: "Once per day",
			recharge: "Dusk",
		},
		flavor:
			"Destroys the flow of time itself. A desperate symphony of violence.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/fortress.webp",
		lore: {
			origin:
				"Created by an unnamed Awakened blacksmith who fed their own life force into the forge.",
			history:
				"Field reports indicate prolonged exposure causes minor spatial distortions in a three-meter radius.",
			curse:
				"Causes mild paranoia after extended use; the user becomes convinced they are being watched through mirrors.",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Found washed ashore near a coastal Gate, wrapped in fabric that dissolved upon touch.",
		tags: ["power", "buff", "defensive", "area", "shadow"],
		theme_tags: ["classified", "elite-tier", "shadow-domain"],
	},
	{
		id: "reality-shear",
		name: "Reality Shear",
		description:
			"Cut through the very fabric of space to open a localized vacuum.",
		type: "awakening",
		rarity: "legendary",
		requirements: {
			level: 19,
			ability: "Intelligence",
			score: 19,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "feet",
			distance: 90,
		},
		mechanics: {
			attack: {
				type: "necrotic",
				mode: "melee",
				resolution: "spell_attack",
				modifier: "Strength",
				damage: "3d10",
				damage_type: "necrotic",
			},
			critical: true,
			action_type: "1 bonus action",
			type: "monstrous",
			frequency: "1/short rest",
			action: "1 bonus action",
			damage_profile: "3d10 necrotic",
			lattice_interaction: "Lattice bypass — raw power",
			saving_throw: {
				ability: "Presence",
				dc: 19,
				success: "Partial effect",
				failure: "Full damage",
			},
		},
		effects: {
			primary:
				"A 10ft tear appears. It sucks in all air and light, dealing 12d12 force damage.",
			secondary: "Creatures sucked in are sent to the Astral Plane. Adaptive.",
		},
		limitations: {
			uses: "Once per day",
			recharge: "Short rest",
		},
		flavor: "Reclaims the darkness within. A devastating ultimate equalizer.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/shear.webp",
		lore: {
			origin:
				"Translated from forbidden shadow-language inscriptions found in a Monarch's throne room.",
			history:
				"The European Hunter Council maintains a standing bounty for information regarding its original creator.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Appeared in a Hunter's inventory after a System notification that no one else could see.",
		tags: ["power", "radiant", "damage", "psychic"],
		theme_tags: ["guild-ops", "hunter-bureau", "black-market"],
	},
	{
		id: "omega-pulse",
		name: "Omega Pulse",
		description:
			"By aligning your lattice with the Aetheric Absolute, you can distort the local aether. This manifestation bypasses standard Rift dampeners.",
		type: "divine",
		rarity: "legendary",
		requirements: {
			level: 20,
			ability: "Presence",
			score: 20,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "feet",
			distance: 100,
		},
		mechanics: {
			attack: {
				type: "force",
				mode: "aura",
				resolution: "saving_throw",
				modifier: "Strength",
				damage: "2d10",
				damage_type: "force",
			},
			saving_throw: {
				ability: "Strength",
				dc: 14,
				success: "Half damage",
				failure: "Full damage",
			},
			action_type: "1 bonus action",
			type: "divine",
			frequency: "2/short rest",
			action: "1 bonus action",
			damage_profile: "2d10 force",
			lattice_interaction: "Lattice bypass — raw power",
		},
		effects: {
			primary:
				"All enemies in 100ft must make a Sense save or be reduced to 1 HP.",
			secondary:
				"All mechanical and magical traps in the area are permanently disabled. Adaptive.",
		},
		limitations: {
			uses: "Once per week",
			recharge: "Dawn",
		},
		flavor:
			"Commands the arrogant and the mighty. A triumphant beautiful catastrophe.",
		source: "Rift Ascendant Canon",
		image: "/generated/compendium/powers/omega.webp",
		lore: {
			origin:
				"Created by an unnamed Awakened blacksmith who fed their own life force into the forge.",
			history:
				"This technique was banned by the International Guild Association for eighteen months before being reclassified.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		discovery_lore:
			"Traded by a nomadic Awakened who claimed to have no memory of acquiring it.",
		tags: ["power", "psychic", "void"],
		theme_tags: ["hunter-bureau", "survival"],
	},
];
