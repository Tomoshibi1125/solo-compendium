// Powers Compendium - Authoritative System Ascendant Content
// Supernatural abilities and extraordinary powers
// Based on System Ascendant mechanics
// 5e-style power mechanics
// INNATE POWERS
// AWAKENING POWERS (Job-linked)
// CLASS POWERS
// MONSTROUS POWERS
// DIVINE POWERS

export const powers = [
	{
		id: "shadow-step",
		name: "Shadow Step",
		description: "The ability to teleport through shadows.",
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
		effects: {
			primary:
				"Teleport up to 30 feet to an unoccupied space you can see that is in dim light or darkness.",
			secondary:
				"Cannot be detected by normal sight while teleporting through shadows.",
		},
		limitations: {
			uses: "At-will",
			conditions: ["Must have shadows or dim light available"],
		},
		flavor:
			"Ignites the quiet space between breaths. A triumphant death of hesitation.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/shadow-step.webp",
	},
	{
		id: "demonic-aura",
		name: "Demonic Aura",
		description: "An intimidating aura that strikes fear into enemies.",
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
		effects: {
			primary:
				"Enemies within 10 feet must make Wisdom saving throws or be frightened.",
			secondary:
				"Frightened creatures have disadvantage on attack rolls against you.",
		},
		limitations: {
			uses: "3 times per day",
			cooldown: "Long rest",
		},
		flavor:
			"Weaves the quiet space between breaths. A relentless roar of raw mana.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/demonic-aura.webp",
	},
	{
		id: "regeneration",
		name: "Regeneration",
		description: "Accelerated natural healing ability.",
		type: "innate",
		rarity: "rare",
		activation: {
			type: "passive",
		},
		effects: {
			primary:
				"Regain 1 hit point at the start of your turn if you have at least 1 hit point.",
			secondary:
				"Cannot regain hit points if you are in sunlight or radiant damage area.",
		},
		limitations: {
			conditions: ["Reduced effectiveness in light or against radiant damage"],
		},
		flavor:
			"Denies the quiet space between breaths. A brutal death of hesitation.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/regeneration.webp",
	},
	{
		id: "true-sight",
		name: "True Sight",
		description:
			"The ability to see through illusions and into the Ethereal Plane.",
		type: "innate",
		rarity: "very_rare",
		activation: {
			type: "passive",
		},
		effects: {
			primary: "Can see in normal and magical darkness.",
			secondary: "Can see invisible creatures and objects.",
			tertiary: "Can see into the Ethereal Plane.",
		},
		flavor:
			"Destroys the arrogant and the mighty. A sorrowful beautiful catastrophe.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/true-sight.webp",
	},
	{
		id: "shadow-essence",
		name: "Shadow Essence",
		description: "The ability to become one with shadows.",
		type: "innate",
		rarity: "very_rare",
		activation: {
			type: "action",
		},
		duration: {
			type: "concentration",
			time: "1 minute",
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
			cooldown: "Long rest",
		},
		flavor:
			"Absorbs the remnants of humanity. An ancient surge of lethal intent.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/shadow-essence.webp",
	},
	{
		id: "dragon-breath",
		name: "Dragon Breath",
		description:
			"The ability to exhale destructive energy, channeled through combat training.",
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
		effects: {
			primary: "Exhale destructive energy in a 15-foot cone.",
			secondary: "Damage type determined by draconic ancestry.",
		},
		limitations: {
			uses: "Once per short or long rest",
			cooldown: "Short rest",
		},
		flavor:
			"Destroys the dimensional divide. A sorrowful testament to absolute power.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/dragon-breath.webp",
	},
	{
		id: "arcane-charm",
		name: "Arcane Charm",
		description:
			"Magical influence woven through words and gestures, honed by arcane study.",
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
		effects: {
			primary: "Target must make Wisdom saving throw or be charmed.",
			secondary: "Charmed creature regards you as a trusted friend.",
		},
		limitations: {
			uses: "Once per day",
			cooldown: "Long rest",
		},
		flavor:
			"Ignores the arrogant and the mighty. An absolute whisper in the shadows.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/fey-charm.webp",
	},
	{
		id: "bulwark-resilience",
		name: "Bulwark Resilience",
		description:
			"Innate resistance to poison and magic, forged by crystallized mana conditioning.",
		type: "awakening",
		rarity: "common",
		requirements: {
			job: "Bulwark",
		},
		activation: {
			type: "passive",
		},
		effects: {
			primary: "Advantage on saving throws against poison.",
			secondary: "Resistance to poison damage.",
			tertiary:
				"Advantage on saving throws against spells and magical effects.",
		},
		flavor:
			"Ignores the concept of defeat. An absolute surge of lethal intent.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/dwarven-resilience.webp",
	},
	{
		id: "assassin-luck",
		name: "Assassin's Luck",
		description:
			"Supernatural luck honed by split-second reflexes and shadow instinct.",
		type: "awakening",
		rarity: "common",
		requirements: {
			job: "Assassin",
		},
		activation: {
			type: "reaction",
		},
		effects: {
			primary: "Reroll a 1 on an attack roll, ability check, or saving throw.",
		},
		limitations: {
			uses: "Once per turn",
		},
		flavor:
			"Denies the darkness within. An ancient breaking point of the world.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/halfling-luck.webp",
	},
	{
		id: "warrior-rage",
		name: "Warrior's Rage",
		description:
			"Primal fury that enhances combat abilities, unlocked through martial awakening.",
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
		effects: {
			primary: "Advantage on Strength checks and saving throws.",
			secondary:
				"Additional damage equal to your proficiency bonus on melee weapon hits.",
			tertiary: "Resistance to bludgeoning, piercing, and slashing damage.",
		},
		limitations: {
			uses: "3 times per day",
			cooldown: "Long rest",
		},
		flavor:
			"Overrides the remnants of humanity. A devastating surge of lethal intent.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/orcish-rage.webp",
	},
	{
		id: "ki-point",
		name: "Ki Point",
		description:
			"Essence-channeled martial energy that fuels transcendent combat abilities, refined through the System's awakening of your inner potential.",
		type: "class",
		rarity: "common",
		requirements: {
			class: "Martial Artist",
		},
		activation: {
			type: "passive",
		},
		effects: {
			primary: "Gain a pool of ki points equal to your martial artist level.",
			secondary: "Can spend ki points to use various martial artist abilities.",
		},
		limitations: {
			uses: "Regain all ki points after a long rest",
		},
		flavor:
			"Reflects the dimensional divide. A chaotic testament to absolute power.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/ki-point.webp",
	},
	{
		id: "divine-smite",
		name: "Divine Smite",
		description:
			"Channel radiant essence through your weapon, unleashing concentrated holy energy that burns through dimensional corruption.",
		type: "class",
		rarity: "rare",
		requirements: {
			class: "Herald",
			level: 2,
		},
		activation: {
			type: "reaction",
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
		},
		flavor:
			"Ignores the remnants of humanity. A devastating surge of lethal intent.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/divine-smite.webp",
	},
	{
		id: "wild-shape",
		name: "Primal Shift",
		description:
			"Channel essence from rift-born ecosystems to reshape your body into the form of creatures encountered within dimensional gates.",
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
		effects: {
			primary:
				"Transform into a beast with challenge rating no higher than your summoner level divided by 3.",
			secondary:
				"Gain the beast's statistics except for Intelligence, Wisdom, and Charisma.",
		},
		limitations: {
			uses: "2 times per short rest, increases at higher levels",
			cooldown: "Short rest",
		},
		flavor:
			"Reflects the fragile limits of flesh. An overwhelming ultimate equalizer.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/wild-shape.webp",
	},
	{
		id: "arcane-recovery",
		name: "Arcane Recovery",
		description:
			"Draw residual essence from the dimensional lattice to restore depleted spell matrices, a technique taught only in the Ascendant Academy's advanced programs.",
		type: "class",
		rarity: "uncommon",
		requirements: {
			class: "Mage",
			level: 1,
		},
		activation: {
			type: "long-rest",
		},
		effects: {
			primary:
				"Recover expended spell slots with a total level equal to half your mage level.",
			secondary: "Cannot recover spell slots of 6th level or higher.",
		},
		limitations: {
			uses: "Once per long rest",
		},
		flavor:
			"Shatters all who stand in opposition. An overwhelming whisper in the shadows.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/arcane-recovery.webp",
	},
	{
		id: "sneak-attack",
		name: "Precision Kill",
		description:
			"The System-enhanced ability to identify and exploit critical weak points in any target's defenses, turning a single strike into a devastating wound.",
		type: "class",
		rarity: "common",
		requirements: {
			class: "Assassin",
		},
		activation: {
			type: "passive",
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
		},
		flavor: "Cleanses the architect's design. A subtle death of hesitation.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/sneak-attack.webp",
	},
	{
		id: "vampiric-touch",
		name: "Vampiric Touch",
		description: "The ability to drain life force through touch.",
		type: "monstrous",
		rarity: "rare",
		activation: {
			type: "action",
		},
		effects: {
			primary: "Touch deals necrotic damage and heals you for the same amount.",
			secondary: "Cannot heal more than your maximum hit points.",
		},
		limitations: {
			uses: "3 times per day",
			cooldown: "Long rest",
		},
		flavor:
			"Commands the darkness within. A triumphant breaking point of the world.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/vampiric-touch.webp",
	},
	{
		id: "lycanthropy",
		name: "Lycanthropy",
		description: "The curse of the werewolf transformation.",
		type: "monstrous",
		rarity: "very_rare",
		activation: {
			type: "action",
		},
		duration: {
			type: "timed",
			time: "1 hour",
		},
		effects: {
			primary: "Transform into a hybrid werewolf form.",
			secondary: "Gain multiattack and increased Strength.",
			tertiary: "Damage resistance to non-magical weapons.",
		},
		limitations: {
			uses: "Once per night",
			conditions: ["Full moon transformation is involuntary"],
		},
		flavor:
			"Ignites the fragile limits of flesh. A sorrowful breaking point of the world.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/lycanthropy.webp",
	},
	{
		id: "gaze-of-petrification",
		name: "Gaze of Petrification",
		description: "The ability to turn creatures to stone with your gaze.",
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
		effects: {
			primary:
				"Target must make Constitution saving throw or begin turning to stone.",
			secondary: "Petrified creature is restrained and cannot move or speak.",
		},
		limitations: {
			uses: "Once per day",
			cooldown: "Long rest",
		},
		flavor:
			"Ignites the concept of defeat. A sorrowful dance performed on the edge of a blade.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/gaze-of-petrification.webp",
	},
	{
		id: "telepathy",
		name: "Telepathy",
		description: "The ability to communicate mentally with others.",
		type: "monstrous",
		rarity: "rare",
		activation: {
			type: "passive",
		},
		range: {
			type: "feet",
			distance: 120,
		},
		effects: {
			primary:
				"Communicate telepathically with any creature you can see within 120 feet.",
			secondary:
				"Can understand languages you don't know through telepathic communication.",
		},
		flavor:
			"Cleanses the dimensional divide. A forbidden testament to absolute power.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/telepathy.webp",
	},
	{
		id: "invisibility",
		name: "Invisibility",
		description: "The ability to become unseen.",
		type: "monstrous",
		rarity: "uncommon",
		activation: {
			type: "action",
		},
		duration: {
			type: "concentration",
			time: "1 hour",
		},
		effects: {
			primary: "Become invisible to all sight.",
			secondary: "Invisibility ends if you attack or cast a spell.",
		},
		limitations: {
			uses: "At-will",
			conditions: ["Ends when taking hostile action"],
		},
		flavor:
			"Shatters the flow of time itself. A brutal testament to absolute power.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/invisibility.webp",
	},
	{
		id: "divine-intervention",
		name: "System Override",
		description:
			"Issue a direct petition to the architects of the System itself, requesting intervention that transcends the normal rules of dimensional reality.",
		type: "divine",
		rarity: "legendary",
		requirements: {
			level: 20,
		},
		activation: {
			type: "action",
		},
		effects: {
			primary: "Request direct intervention from the System architects.",
			secondary:
				"Warden determines the form and effectiveness of the intervention.",
		},
		limitations: {
			uses: "Once per lifetime",
			cooldown: "Never",
		},
		flavor:
			"Bends the arrogant and the mighty. An intricate whisper in the shadows.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/divine-intervention.webp",
	},
	{
		id: "angelic-wings",
		name: "Essence Wings",
		description:
			"Manifest wings of crystallized essence that grant flight, a hallmark of ascendants who have transcended the System's physical limitations.",
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
		effects: {
			primary: "Manifest spectral wings that grant a fly speed of 60 feet.",
			secondary: "Wings shed bright light in a 10-foot radius.",
		},
		limitations: {
			uses: "3 times per day",
			cooldown: "Long rest",
		},
		flavor:
			"Cleanses the remnants of humanity. A forbidden surge of lethal intent.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/angelic-wings.webp",
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
		effects: {
			primary: "Allies in aura have advantage on saving throws.",
			secondary:
				"Fiends and undead have disadvantage on attacks against allies in aura.",
			tertiary:
				"Aura deals radiant damage to fiends and undead that start their turn there.",
		},
		limitations: {
			uses: "Once per day",
			cooldown: "Long rest",
		},
		flavor: "Crushes the architect's design. An intricate roar of raw mana.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/holy-aura.webp",
	},
	{
		id: "avatar-of-battle",
		name: "Avatar of Battle",
		description:
			"The System elevates your combat potential beyond mortal limits, transforming you into a living embodiment of warfare itself.",
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
		effects: {
			primary: "Gain two additional attacks per turn.",
			secondary: "Advantage on all attack rolls.",
			tertiary: "Cannot be frightened and immune to charm effects.",
		},
		limitations: {
			uses: "Once per day",
			cooldown: "Long rest",
		},
		flavor:
			"Commands the fragile limits of flesh. A triumphant ultimate equalizer.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/avatar-of-battle.webp",
	},
	{
		id: "arcane-ascension",
		name: "Arcane Ascension",
		description:
			"Transcend the System's imposed limitations on mortal spellcasting, briefly accessing the raw arcane matrix that underlies all dimensional reality.",
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
		effects: {
			primary:
				"Can cast any spell of 8th level or lower without expending a spell slot.",
			secondary:
				"Can cast any spell of 9th level once without expending a spell slot.",
			tertiary:
				"Advantage on all Intelligence, Wisdom, and Charisma saving throws.",
		},
		limitations: {
			uses: "Once per day",
			cooldown: "Long rest",
		},
		flavor:
			"Commands the arrogant and the mighty. A desperate beautiful catastrophe.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/arcane-ascension.webp",
	},
	{
		id: "void-collapse",
		name: "Void Collapse",
		description: "Crush targets with localized gravitational singularities.",
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
		effects: {
			primary:
				"Create a 20-foot radius sphere of crushing gravity. Creatures inside take 8d10 force damage and are knocked prone and restrained.",
			secondary:
				"Once learned via Rune, adapts to your highest applicable attribute.",
		},
		limitations: {
			uses: "Once per day",
			cooldown: "Long rest",
		},
		flavor:
			"Ignores the remnants of humanity. A devastating dance performed on the edge of a blade.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/void-collapse.webp",
	},
	{
		id: "chronos-shift",
		name: "Chronos Shift",
		description: "Rewind time for a single entity.",
		type: "divine",
		rarity: "very_rare",
		requirements: {
			level: 15,
			ability: "Charisma",
			score: 15,
		},
		activation: {
			type: "reaction",
		},
		range: {
			type: "feet",
			distance: 30,
		},
		effects: {
			primary:
				"When a creature takes damage or fails a save, rewind time for them to completely undo the event.",
			secondary:
				"Once learned via Rune, adapts to your highest applicable attribute.",
		},
		limitations: {
			uses: "Once per week",
			cooldown: "Week",
		},
		flavor:
			"Reflects the arrogant and the mighty. A silent beautiful catastrophe.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/chronos-shift.webp",
	},
	{
		id: "mana-burn",
		name: "Mana Burn",
		description: "Ignite the essence within a target's body.",
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
		effects: {
			primary:
				"Target loses an unexpended resource (spell slot, ki, mana) and takes 1d8 psychic damage per level of resource lost.",
			secondary:
				"Once learned via Rune, adapts to your highest applicable attribute.",
		},
		limitations: {
			uses: "3 times per day",
			cooldown: "Long rest",
		},
		flavor: "Shatters the flow of time itself. A chaotic symphony of violence.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/mana-burn.webp",
	},
	{
		id: "obsidian-carapace",
		name: "Obsidian Carapace",
		description: "Encase yourself in impenetrable jagged armor.",
		type: "monstrous",
		rarity: "uncommon",
		requirements: {
			level: 5,
			ability: "Constitution",
			score: 13,
		},
		activation: {
			type: "action",
		},
		duration: {
			type: "concentration",
			time: "1 hour",
		},
		effects: {
			primary:
				"Gain 30 temporary hit points. While you have these, attackers taking melee swings at you take 1d6 piercing damage.",
			secondary:
				"Once learned via Rune, adapts to your highest applicable attribute.",
		},
		limitations: {
			uses: "Twice per day",
			cooldown: "Long rest",
		},
		flavor:
			"Reflects the fragile limits of flesh. An overwhelming breaking point of the world.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/obsidian-carapace.webp",
	},
	{
		id: "soul-rend",
		name: "Soul Rend",
		description: "Tear a fragment of spirit from the target.",
		type: "innate",
		rarity: "very_rare",
		requirements: {
			level: 13,
			ability: "Charisma",
			score: 15,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "feet",
			distance: 15,
		},
		effects: {
			primary:
				"Deal 4d10 necrotic damage and reduce the target's maximum hit points by the same amount.",
			secondary:
				"Once learned via Rune, adapts to your highest applicable attribute.",
		},
		limitations: {
			uses: "Once per day",
			cooldown: "Long rest",
		},
		flavor:
			"Commands the arrogant and the mighty. A triumphant beautiful catastrophe.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/soul-rend.webp",
	},
	{
		id: "aegis-of-light",
		name: "Aegis of Light",
		description: "Project an impenetrable shield of holy energy.",
		type: "divine",
		rarity: "rare",
		requirements: {
			level: 9,
			ability: "Charisma",
			score: 13,
		},
		activation: {
			type: "reaction",
		},
		range: {
			type: "self",
		},
		effects: {
			primary:
				"Gain immunity to magical damage until the start of your next turn.",
			secondary:
				"Once learned via Rune, adapts to your highest applicable attribute.",
		},
		limitations: {
			uses: "Once per short rest",
			cooldown: "Short rest",
		},
		flavor: "Bends the flow of time itself. A subtle symphony of violence.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/aegis-of-light.webp",
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
			ability: "Dexterity",
			score: 13,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "feet",
			distance: 120,
		},
		effects: {
			primary: "Make 5 ranged spell attacks. Each deals 1d10 force damage.",
			secondary:
				"Once learned via Rune, adapts to your highest applicable attribute.",
		},
		limitations: {
			uses: "Twice per day",
			cooldown: "Long rest",
		},
		flavor:
			"Reclaims the concept of defeat. An overwhelming dance performed on the edge of a blade.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/phantom-barrage.webp",
	},
	{
		id: "venom-blood",
		name: "Venom Blood",
		description: "Your essence turns toxic to enemies.",
		type: "monstrous",
		rarity: "uncommon",
		requirements: {
			level: 3,
			ability: "Constitution",
			score: 13,
		},
		activation: {
			type: "passive",
		},
		effects: {
			primary:
				"Whenever you take piercing or slashing damage, the attacker takes 2d6 poison damage.",
			secondary:
				"You are immune to poison. Once learned via Rune, adapts to highest attribute.",
		},
		flavor: "Shatters the architect's design. A brutal roar of raw mana.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/venom-blood.webp",
	},
	{
		id: "absolute-zero",
		name: "Absolute Zero",
		description: "Freeze the kinetic energy in an area.",
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
		effects: {
			primary:
				"All creatures in a 20-foot sphere take 6d8 cold damage and are paralyzed for 1 minute (Con save ends).",
			secondary:
				"Once learned via Rune, adapts to your highest applicable attribute.",
		},
		limitations: {
			uses: "Once per day",
			cooldown: "Long rest",
		},
		flavor:
			"Destroys the flow of time itself. A sorrowful symphony of violence.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/absolute-zero.webp",
	},
	{
		id: "kinetic-absorption",
		name: "Kinetic Absorption",
		description: "Absorb physical impacts and convert them to strength.",
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
		effects: {
			primary:
				"Reduce incoming physical damage by 1d10 + attribute. Store this energy.",
			secondary:
				"Next melee attack deals additional force damage equal to the absorbed amount. Adaptive once learned.",
		},
		limitations: {
			uses: "Proficiency bonus times per rest",
			cooldown: "Short rest",
		},
		flavor:
			"Denies all who stand in opposition. A chaotic beautiful catastrophe.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/kinetic-absorption.webp",
	},
	{
		id: "infernal-forge",
		name: "Infernal Forge",
		description: "Summon weapons woven from hellfire.",
		type: "awakening",
		rarity: "rare",
		requirements: {
			level: 7,
			ability: "Charisma",
			score: 13,
		},
		activation: {
			type: "bonus-action",
		},
		duration: {
			type: "timed",
			time: "10 minutes",
		},
		effects: {
			primary: "Manifest a weapon of pure fire in your empty hand.",
			secondary:
				"Attacks deal 2d6 fire damage instead of normal damage, and ignore fire resistance. Adapts to highest attribute once learned.",
		},
		limitations: {
			uses: "At-will",
		},
		flavor:
			"Cleanses the remnants of humanity. A subtle dance performed on the edge of a blade.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/infernal-forge.webp",
	},
	{
		id: "celestial-judgment",
		name: "Celestial Judgment",
		description: "Mark a target for absolute destruction.",
		type: "divine",
		rarity: "legendary",
		requirements: {
			level: 19,
			ability: "Wisdom",
			score: 17,
		},
		activation: {
			type: "bonus-action",
		},
		range: {
			type: "sight",
		},
		effects: {
			primary:
				"Target loses all damage resistances and immunities for 1 minute.",
			secondary:
				"Any damage dealt to them is doubled. Adaptive once learned via Rune.",
		},
		limitations: {
			uses: "Once per month",
			cooldown: "Month",
		},
		flavor:
			"Reclaims the fragile limits of flesh. A silent breaking point of the world.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/celestial-judgment.webp",
	},
	{
		id: "mind-control",
		name: "Dominate Will",
		description: "Take absolute control over a lesser creature's mind.",
		type: "innate",
		rarity: "very_rare",
		requirements: {
			level: 15,
			ability: "Wisdom",
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
		effects: {
			primary:
				"You dictate the creature's actions completely. Adapts to your highest applicable attribute.",
			secondary: "Target gets a save each time it takes damage.",
		},
		limitations: {
			uses: "Once per day",
			cooldown: "Long rest",
		},
		flavor:
			"Cleanses all who stand in opposition. An intricate whisper in the shadows.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/mind-control.webp",
	},
	{
		id: "warp-strike",
		name: "Warp Strike",
		description: "Throw your weapon and instantly teleport to its location.",
		type: "awakening",
		rarity: "uncommon",
		requirements: {
			level: 3,
			ability: "Dexterity",
			score: 13,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "feet",
			distance: 60,
		},
		effects: {
			primary:
				"Make a ranged attack with a melee weapon. Hit or miss, you teleport to an unoccupied space adjacent to the target.",
			secondary:
				"Once learned via Rune, adapts to your highest applicable attribute.",
		},
		limitations: {
			uses: "At-will",
		},
		flavor:
			"Overrides the arrogant and the mighty. A relentless beautiful catastrophe.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/warp-strike.webp",
	},
	{
		id: "life-transfer",
		name: "Life Transfer",
		description: "Trade your own vitality to heal another.",
		type: "innate",
		rarity: "uncommon",
		requirements: {
			level: 2,
			ability: "Constitution",
			score: 12,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "touch",
		},
		effects: {
			primary: "Take 4d8 necrotic damage (ignores resistance/immunity).",
			secondary:
				"One creature you touch instantly regains double the damage taken as hit points. Adaptive once learned.",
		},
		limitations: {
			uses: "Unlimited",
		},
		flavor: "Destroys the darkness within. A desperate ultimate equalizer.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/life-transfer.webp",
	},
	{
		id: "gravity-crush",
		name: "Gravity Crush",
		description: "Intensify gravity on a single target.",
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
		effects: {
			primary:
				"Target takes 5d10 force damage and has its movement speed reduced to 5 feet.",
			secondary:
				"Once learned via Rune, adapts to your highest applicable attribute.",
		},
		limitations: {
			uses: "3 times per day",
			cooldown: "Long rest",
		},
		flavor:
			"Destroys the remnants of humanity. A desperate surge of lethal intent.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/gravity-crush.webp",
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
			ability: "Charisma",
			score: 15,
		},
		activation: {
			type: "action",
		},
		duration: {
			type: "concentration",
			time: "1 hour",
		},
		effects: {
			primary:
				"Create a clone with 1 HP and your exact AC and stats. It shares your turn and can attack.",
			secondary:
				"Once learned via Rune, adapts to your highest applicable attribute.",
		},
		limitations: {
			uses: "Once per day",
			cooldown: "Long rest",
		},
		flavor:
			"Denies the concept of defeat. A chaotic dance performed on the edge of a blade.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/echo-clone.webp",
	},
	{
		id: "storm-call",
		name: "Storm Call",
		description: "Summon an apocalyptic thunderstorm.",
		type: "divine",
		rarity: "very_rare",
		requirements: {
			level: 13,
			ability: "Wisdom",
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
		effects: {
			primary:
				"Call down lightning bolts every turn as a bonus action (6d10 damage).",
			secondary:
				"Once learned via Rune, adapts to your highest applicable attribute.",
		},
		limitations: {
			uses: "Once per day",
			cooldown: "Long rest",
		},
		flavor:
			"Absorbs the concept of defeat. A sorrowful surge of lethal intent.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/storm-call.webp",
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
			ability: "Wisdom",
			score: 13,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "touch",
		},
		effects: {
			primary:
				"Deal 8d8 necrotic damage. Plants and non-magical structures instantly wither or degrade.",
			secondary:
				"Once learned via Rune, adapts to your highest applicable attribute.",
		},
		limitations: {
			uses: "Twice per day",
			cooldown: "Long rest",
		},
		flavor:
			"Bends the quiet space between breaths. An intricate death of hesitation.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/blight-touch.webp",
	},
	{
		id: "starfall",
		name: "Starfall",
		description: "Pull a meteorite from the upper atmosphere.",
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
		effects: {
			primary:
				"A blazing meteorite impacts a 40-foot radius. Deals 15d6 fire and 15d6 bludgeoning damage.",
			secondary:
				"Once learned via Rune, adapts to your highest applicable attribute.",
		},
		limitations: {
			uses: "Once per month",
			cooldown: "Month",
		},
		flavor:
			"Cleanses the fragile limits of flesh. An intricate ultimate equalizer.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/starfall.webp",
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
		effects: {
			primary:
				"Target is removed from reality for 1d4 rounds. When they return, they take 10d10 force damage.",
			secondary: "Adaptive once learned via Rune.",
		},
		limitations: {
			uses: "Once per day",
			cooldown: "Long rest",
		},
		flavor:
			"Overrides the arrogant and the mighty. A devastating whisper in the shadows.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/reality-glitch.webp",
	},
	{
		id: "solar-flare",
		name: "Solar Flare",
		description: "Release a blinding burst of celestial heat.",
		type: "divine",
		rarity: "rare",
		requirements: {
			level: 9,
			ability: "Wisdom",
			score: 13,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "feet",
			distance: 20,
		},
		effects: {
			primary:
				"All creatures in a 20ft radius take 6d8 fire damage and are blinded for 1 minute.",
			secondary: "Adaptive once learned via Rune.",
		},
		limitations: {
			uses: "Twice per day",
			cooldown: "Long rest",
		},
		flavor: "Reclaims the architect's design. A devastating roar of raw mana.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/solar-flare.webp",
	},
	{
		id: "void-singularity",
		name: "Void Singularity",
		description: "Collapse space into a point of infinite density.",
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
		effects: {
			primary:
				"Create a singularity that pulls all creatures within 50ft toward it. Deals 20d10 force damage.",
			secondary:
				"Targets with less than 100HP are instantly annihilated. Adaptive.",
		},
		limitations: {
			uses: "Once per day",
		},
		flavor:
			"Ignites the concept of defeat. A sorrowful surge of lethal intent.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/void-singularity.webp",
	},
	{
		id: "aeon-shield",
		name: "Aeon Shield",
		description: "Surround yourself with a layer of frozen time.",
		type: "divine",
		rarity: "very_rare",
		requirements: {
			level: 14,
			ability: "Wisdom",
			score: 16,
		},
		activation: {
			type: "bonus-action",
		},
		range: {
			type: "self",
		},
		effects: {
			primary:
				"For 1 minute, you are immune to all damage as attacks simply stop in time before hitting you.",
			secondary: "You cannot move more than 5ft per turn while active.",
		},
		limitations: {
			uses: "Once per long rest",
		},
		flavor:
			"Reclaims the dimensional divide. A silent testament to absolute power.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/aeon-shield.webp",
	},
	{
		id: "nebula-drift",
		name: "Nebula Drift",
		description: "Dissolve into a cloud of stardust.",
		type: "innate",
		rarity: "rare",
		requirements: {
			level: 9,
			ability: "Dexterity",
			score: 14,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "self",
		},
		effects: {
			primary:
				"You become incorporeal and can pass through objects. You gain a fly speed of 60ft.",
			secondary: "While drifting, you are invisible in dim light or darkness.",
		},
		limitations: {
			uses: "Duration: 10 minutes",
		},
		flavor:
			"Overrides the remnants of humanity. A silent surge of lethal intent.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/nebula-drift.webp",
	},
	{
		id: "gravity-well",
		name: "Gravity Well",
		description: "Heavily increase gravity in a localized area.",
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
		effects: {
			primary:
				"Creatures in a 20ft radius have their speed reduced to 0 and take 4d6 bludgeoning damage.",
			secondary: "Flying creatures are slammed to the ground.",
		},
		limitations: {
			uses: "3 times per day",
		},
		flavor: "Bends the remnants of humanity. A subtle surge of lethal intent.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/gravity-well.webp",
	},
	{
		id: "quantum-entanglement",
		name: "Quantum Entanglement",
		description: "Link the fates of two creatures.",
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
		effects: {
			primary:
				"Choose two targets. Any damage or healing received by one is shared by the other.",
			secondary: "Duration: 1 minute. Adaptive.",
		},
		limitations: {
			uses: "Once per short rest",
		},
		flavor:
			"Absorbs the fragile limits of flesh. A sorrowful breaking point of the world.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/quantum-entanglement.webp",
	},
	{
		id: "supernova-blast",
		name: "Supernova Blast",
		description: "Release the energy of a dying star.",
		type: "divine",
		rarity: "legendary",
		requirements: {
			level: 18,
			ability: "Charisma",
			score: 18,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "feet",
			distance: 120,
		},
		effects: {
			primary: "Deals 15d12 fire and radiant damage in a 40ft radius.",
			secondary:
				"Creatures that survive are permanently blinded unless cured by high-tier magic.",
		},
		limitations: {
			uses: "Once per day",
		},
		flavor:
			"Absorbs the remnants of humanity. A sorrowful surge of lethal intent.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/supernova-blast.webp",
	},
	{
		id: "nanite-swarm",
		name: "Nanite Swarm",
		description: "Deploy a cloud of metallic micro-constructs.",
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
		effects: {
			primary:
				"The swarm deals 2d8 piercing damage to a target each turn and grants you half-cover.",
			secondary: "Can be used to repair metal objects or heal constructs.",
		},
		limitations: {
			uses: "Concentration, up to 1 minute",
		},
		flavor:
			"Ignores the remnants of humanity. A devastating dance performed on the edge of a blade.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/nanite-swarm.webp",
	},
	{
		id: "titan-strength",
		name: "Titan's Strength",
		description: "Momentarily channel the power of the ancient behemoths.",
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
		effects: {
			primary:
				"Your next melee attack deals triple damage and knocks the target prone.",
			secondary:
				"You count as one size larger for lifting and carrying for 1 hour.",
		},
		limitations: {
			uses: "Once per short rest",
		},
		flavor:
			"Ignores the remnants of humanity. An absolute dance performed on the edge of a blade.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/titan-strength.webp",
	},
	{
		id: "echoes-of-the-past",
		name: "Echoes of the Past",
		description: "Summon spectral copies of yourself from previous timelines.",
		type: "awakening",
		rarity: "rare",
		requirements: {
			level: 13,
			ability: "Wisdom",
			score: 14,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "feet",
			distance: 30,
		},
		effects: {
			primary:
				"Create 1d4 echoes that mimic your movements and attacks, dealing 25% damage each.",
			secondary:
				"Enemies have disadvantage on attacks against you while echoes are active.",
		},
		limitations: {
			uses: "Duration: 3 rounds",
		},
		flavor:
			"Destroys the arrogant and the mighty. A desperate whisper in the shadows.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/echoes.webp",
	},
	{
		id: "glacier-prison",
		name: "Glacier Prison",
		description: "Entomb a creature in absolute ice.",
		type: "divine",
		rarity: "rare",
		requirements: {
			level: 12,
			ability: "Constitution",
			score: 16,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "feet",
			distance: 60,
		},
		effects: {
			primary:
				"Target is frozen solid, becoming paralyzed and immune to all damage for 3 rounds.",
			secondary: "When it breaks, it takes 12d6 cold damage. Adaptive.",
		},
		limitations: {
			uses: "Once per day",
		},
		flavor:
			"Cleanses the quiet space between breaths. A forbidden death of hesitation.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/glacier-prison.webp",
	},
	{
		id: "bio-luminescence",
		name: "Bio-Luminescence",
		description: "Emissions of radiant energy from your cells.",
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
		effects: {
			primary:
				"Shed bright light in a 20ft radius and dim light for another 20ft.",
			secondary: "You can change the color at will. Adaptive.",
		},
		limitations: {
			uses: "At-will",
		},
		flavor:
			"Destroys the quiet space between breaths. A triumphant death of hesitation.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/light.webp",
	},
	{
		id: "neuro-spike",
		name: "Neuro Spike",
		description: "Send a jolt of psychic static into a target's brain.",
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
		effects: {
			primary:
				"Target takes 1d10 psychic damage and cannot take reactions until their next turn.",
			secondary: "Adaptive DC.",
		},
		limitations: {
			uses: "At-will",
		},
		flavor: "Denies the remnants of humanity. A brutal surge of lethal intent.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/neuro-spike.webp",
	},
	{
		id: "plasma-whip",
		name: "Plasma Whip",
		description: "Generate a lash of superheated ionized gas.",
		type: "awakening",
		rarity: "uncommon",
		requirements: {
			level: 5,
			ability: "Dexterity",
			score: 15,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "feet",
			distance: 15,
		},
		effects: {
			primary:
				"Melee spell attack dealing 3d8 fire damage. Target is pulled 10ft toward you.",
			secondary: "Adaptive attack modifier.",
		},
		limitations: {
			uses: "At-will",
		},
		flavor:
			"Weaves all who stand in opposition. A subtle beautiful catastrophe.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/plasma-whip.webp",
	},
	{
		id: "spectral-blade",
		name: "Spectral Blade",
		description: "Manifest a sword of pure willpower.",
		type: "class",
		rarity: "uncommon",
		requirements: {
			level: 3,
			ability: "Charisma",
			score: 14,
		},
		activation: {
			type: "bonus-action",
		},
		range: {
			type: "self",
		},
		effects: {
			primary:
				"A blade appears in your hand. Attacks deal 2d10 force damage and ignore non-magical armor.",
			secondary: "Duration: 10 minutes. Adaptive.",
		},
		limitations: {
			uses: "Once per short rest",
		},
		flavor:
			"Cleanses the arrogant and the mighty. A forbidden whisper in the shadows.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/spectral-blade.webp",
	},
	{
		id: "dimensional-rift",
		name: "Dimensional Rift",
		description: "Tear a small hole in reality to store objects.",
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
		effects: {
			primary: "Access a private storage dimension (up to 500 lbs of gear).",
			secondary: "Can be used to bypass security checkpoints easily.",
		},
		limitations: {
			uses: "At-will",
		},
		flavor:
			"Overrides the fragile limits of flesh. A silent breaking point of the world.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/rift.webp",
	},
	{
		id: "soul-binding",
		name: "Soul Binding",
		description: "Bind a piece of your soul to a location or object.",
		type: "class",
		rarity: "very_rare",
		requirements: {
			level: 15,
			ability: "Charisma",
			score: 16,
		},
		activation: {
			type: "long-rest",
		},
		range: {
			type: "self",
		},
		effects: {
			primary:
				"Choose a 'Sanctuary'. You can teleport back to it from anywhere on the same plane.",
			secondary:
				"If you die, you can choose to reincarnate at the Sanctuary after 7 days.",
		},
		limitations: {
			uses: "One anchor at a time",
		},
		flavor:
			"Cleanses the flow of time itself. A forbidden symphony of violence.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/soul-bind.webp",
	},
	{
		id: "entropy-field",
		name: "Entropy Field",
		description: "Accelerate decay in a nearby area.",
		type: "awakening",
		rarity: "rare",
		requirements: {
			level: 10,
			ability: "Constitution",
			score: 14,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "feet",
			distance: 20,
		},
		effects: {
			primary:
				"All non-living objects in range rot or rust instantly. Living targets take 5d8 necrotic damage.",
			secondary:
				"Metal armor has its AC reduced by 2 permanently (until repaired).",
		},
		limitations: {
			uses: "Once per short rest",
		},
		flavor:
			"Denies the concept of defeat. A brutal dance performed on the edge of a blade.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/entropy.webp",
	},
	{
		id: "celestial-communion",
		name: "Celestial Communion",
		description: "Receive direct guidance from the System Core.",
		type: "divine",
		rarity: "rare",
		requirements: {
			level: 11,
			ability: "Wisdom",
			score: 17,
		},
		activation: {
			type: "long-rest",
		},
		range: {
			type: "self",
		},
		effects: {
			primary:
				"You can ask three questions and receive cryptic but 100% accurate answers.",
			secondary:
				"You gain advantage on all Intelligence checks for the next 24 hours.",
		},
		limitations: {
			uses: "Once per week",
		},
		flavor:
			"Destroys the dimensional divide. A sorrowful symphony of violence.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/communion.webp",
	},
	{
		id: "shadow-puppetry",
		name: "Shadow Puppetry",
		description: "Manipulate the shadow of a creature to control its body.",
		type: "innate",
		rarity: "very_rare",
		requirements: {
			level: 16,
			ability: "Dexterity",
			score: 18,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "feet",
			distance: 60,
		},
		effects: {
			primary:
				"Target must make a Wisdom save or become your puppet. You control its movement and actions.",
			secondary:
				"Target can attempt to break free at the end of each turn. Adaptive DC.",
		},
		limitations: {
			uses: "Once per long rest",
		},
		flavor:
			"Cleanses the quiet space between breaths. An intricate death of hesitation.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/puppetry.webp",
	},
	{
		id: "thermal-vent",
		name: "Thermal Vent",
		description: "Release excess heat from your body in a sudden burst.",
		type: "innate",
		rarity: "uncommon",
		requirements: {
			level: 4,
			ability: "Constitution",
			score: 15,
		},
		activation: {
			type: "reaction",
		},
		range: {
			type: "feet",
			distance: 10,
		},
		effects: {
			primary:
				"Triggered when you take damage. Deals 3d10 fire damage to all adjacent enemies.",
			secondary: "You gain resistance to fire damage for 1 hour.",
		},
		limitations: {
			uses: "Twice per long rest",
		},
		flavor:
			"Shatters the dimensional divide. A chaotic testament to absolute power.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/thermal.webp",
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
		effects: {
			primary:
				"You can jump up to 60ft as part of your movement. You do not take falling damage.",
			secondary: "You can stand on walls or ceilings for 1 round.",
		},
		limitations: {
			uses: "At-will",
		},
		flavor:
			"Destroys the quiet space between breaths. A triumphant roar of raw mana.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/leap.webp",
	},
	{
		id: "obsidian-wall",
		name: "Obsidian Wall",
		description: "Raise a barrier of volcanic glass from the ground.",
		type: "awakening",
		rarity: "uncommon",
		requirements: {
			level: 6,
			ability: "Constitution",
			score: 14,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "feet",
			distance: 60,
		},
		effects: {
			primary:
				"Create a wall 20ft long, 10ft high, and 1ft thick. It has 50 HP.",
			secondary:
				"Attacking it with melee deals 1d6 piercing damage back to the attacker.",
		},
		limitations: {
			uses: "Once per short rest",
		},
		flavor: "Absorbs the architect's design. A sorrowful roar of raw mana.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/wall.webp",
	},
	{
		id: "star-fire-lance",
		name: "Star-Fire Lance",
		description: "Focus radiant energy into a piercing beam.",
		type: "divine",
		rarity: "rare",
		requirements: {
			level: 10,
			ability: "Charisma",
			score: 15,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "feet",
			distance: 120,
		},
		effects: {
			primary: "A 5ft wide line deals 8d8 radiant damage. Penetrates targets.",
			secondary: "Undead take double damage.",
		},
		limitations: {
			uses: "2 times per long rest",
		},
		flavor:
			"Cleanses the quiet space between breaths. A forbidden death of hesitation.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/lance.webp",
	},
	{
		id: "vortex-shield",
		name: "Vortex Shield",
		description: "Create a swirling miniature hurricane around yourself.",
		type: "innate",
		rarity: "uncommon",
		requirements: {
			level: 5,
			ability: "Dexterity",
			score: 13,
		},
		activation: {
			type: "bonus-action",
		},
		range: {
			type: "self",
		},
		effects: {
			primary:
				"Ranged attacks against you have disadvantage. Any creature that enters adjacent space is pushed 10ft away.",
			secondary: "Adaptive DC for push.",
		},
		limitations: {
			uses: "Duration: 1 minute",
		},
		flavor:
			"Crushes the concept of defeat. A desperate dance performed on the edge of a blade.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/vortex.webp",
	},
	{
		id: "seraph-call",
		name: "Seraph's Call",
		description: "Summon a celestial sentinel to protect your allies.",
		type: "divine",
		rarity: "very_rare",
		requirements: {
			level: 14,
			ability: "Charisma",
			score: 17,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "feet",
			distance: 30,
		},
		effects: {
			primary:
				"An angelic guardian appears and grants all allies +4 AC and resistance to necrotic damage.",
			secondary: "Duration: 1 minute. Adaptive.",
		},
		limitations: {
			uses: "Once per day",
		},
		flavor: "Ignores the architect's design. An absolute roar of raw mana.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/seraph.webp",
	},
	{
		id: "necrotic-tether",
		name: "Necrotic Tether",
		description: "Link your life force to an enemy to drain their vitality.",
		type: "class",
		rarity: "rare",
		requirements: {
			level: 9,
			ability: "Constitution",
			score: 15,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "feet",
			distance: 60,
		},
		effects: {
			primary:
				"Target takes 4d6 necrotic damage each turn. You heal for the same amount.",
			secondary:
				"Tether breaks if the target moves more than 60ft away. Adaptive.",
		},
		limitations: {
			uses: "Concentration",
		},
		flavor:
			"Absorbs the quiet space between breaths. A sorrowful death of hesitation.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/tether.webp",
	},
	{
		id: "glacial-fortress",
		name: "Glacial Fortress",
		description: "Create an expansive dome of impenetrable ice.",
		type: "awakening",
		rarity: "very_rare",
		requirements: {
			level: 16,
			ability: "Constitution",
			score: 18,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "feet",
			distance: 30,
		},
		effects: {
			primary:
				"Create a 30ft radius dome. It has 200 HP and grants total cover to those inside.",
			secondary: "Temperature inside is perfectly regulated. Adaptive.",
		},
		limitations: {
			uses: "Once per day",
		},
		flavor:
			"Destroys the flow of time itself. A desperate symphony of violence.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/fortress.webp",
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
		effects: {
			primary:
				"A 10ft tear appears. It sucks in all air and light, dealing 12d12 force damage.",
			secondary: "Creatures sucked in are sent to the Astral Plane. Adaptive.",
		},
		limitations: {
			uses: "Once per day",
		},
		flavor: "Reclaims the darkness within. A devastating ultimate equalizer.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/shear.webp",
	},
	{
		id: "omega-pulse",
		name: "Omega Pulse",
		description: "Release a wave of pure system administrative power.",
		type: "divine",
		rarity: "legendary",
		requirements: {
			level: 20,
			ability: "Charisma",
			score: 20,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "feet",
			distance: 100,
		},
		effects: {
			primary:
				"All enemies in 100ft must make a Wisdom save or be reduced to 1 HP.",
			secondary:
				"All mechanical and magical traps in the area are permanently disabled. Adaptive.",
		},
		limitations: {
			uses: "Once per week",
		},
		flavor:
			"Commands the arrogant and the mighty. A triumphant beautiful catastrophe.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/omega.webp",
	},
];
