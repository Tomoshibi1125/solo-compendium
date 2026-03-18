// Powers Compendium - Authoritative System Ascendant Content
// Supernatural abilities and extraordinary powers
// Based on System Ascendant mechanics

export interface Power {
	id: string;
	name: string;
	description: string;
	type: "innate" | "awakening" | "class" | "monstrous" | "divine";
	rarity: "common" | "uncommon" | "rare" | "very_rare" | "legendary";
	requirements?: {
		level?: number;
		class?: string;
		job?: string;
		ability?: string;
		score?: number;
	};
	activation: {
		type: "action" | "bonus-action" | "reaction" | "passive" | "long-rest";
		time?: string;
	};
	duration?: {
		type: "instantaneous" | "concentration" | "until-dispel" | "timed";
		time?: string;
	};
	range?: {
		type: "self" | "touch" | "sight" | "feet" | "miles";
		distance?: number;
	};
	components?: {
		verbal?: boolean;
		somatic?: boolean;
		material?: boolean;
		material_desc?: string;
	};
	effects: {
		primary: string;
		secondary?: string;
		tertiary?: string;
	};
	limitations?: {
		uses?: string;
		cooldown?: string;
		conditions?: string[];
	};
	flavor: string;
	source: string;
	image?: string;

	// 5e-style power mechanics
	spell_level_equivalent?: number; // If power acts like a spell
	concentration_required?: boolean;
	ritual?: boolean;
	saving_throw?: {
		ability: string;
		dc: string | number;
		success: string;
		failure: string;
	};
	attack_roll?: {
		type: "melee" | "ranged";
		ability: string;
		damage: string;
	};
}

export const powers: Power[] = [
	// INNATE POWERS
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
			"The shadows become your personal highway, allowing you to move unseen and unheard.",
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
			"Your presence alone is enough to make lesser beings tremble in fear.",
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
			"Your body naturally repairs itself, knitting flesh and bone back together.",
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
			"Your eyes perceive the true nature of reality, seeing through all deceptions.",
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
		flavor: "You are not just in the shadows - you are the shadows.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/shadow-essence.webp",
	},

	// AWAKENING POWERS (Job-linked)
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
			"Primal fury builds within you until it erupts as raw destructive energy.",
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
			"Your harmonic attunement lets you weave enchantment into every word.",
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
			"Your crystallized mana body shrugs off toxins and hostile magic alike.",
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
		flavor: "The shadows favour you, turning disaster into opportunity.",
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
			"Battle fury surges through your veins, unleashing your full martial potential.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/orcish-rage.webp",
	},

	// CLASS POWERS
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
			"The System channeled raw essence into your meridians, awakening a reservoir of power that most ascendants can only dream of.",
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
			"Radiant essence erupts from your blade like a rift-born sunrise, searing through shadow corruption and leaving only purified light in its wake.",
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
			"Your body warps and reshapes, drawing on primal essence patterns cataloged from rift creatures to become something far more dangerous than human.",
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
			"You siphon ambient essence from the dimensional lattice itself, replenishing your depleted reserves through sheer force of intellect.",
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
		flavor:
			"Your System-enhanced perception highlights critical points in your target's anatomy—joints, arteries, nerve clusters—turning every strike into a potential kill shot.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/sneak-attack.webp",
	},

	// MONSTROUS POWERS
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
			"Your touch drains the very life force from your victims, sustaining yourself with their vitality.",
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
			"The beast within you awakens under the moon's gaze, transforming you into a predator.",
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
			"Your gaze carries the curse of stone, freezing flesh in eternal stillness.",
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
			"Your mind reaches out to touch the thoughts of others, bypassing the need for words.",
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
			"You bend light around yourself, becoming as unseen as the air itself.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/invisibility.webp",
	},

	// DIVINE POWERS
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
			"You speak directly to whatever intelligence built the System—and for one terrible, beautiful moment, it answers.",
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
			"Wings of pure essence unfurl from your back—not feathered, but fractal, geometric, blazing with the light of a thousand collapsed rifts. The sky is no longer a boundary.",
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
		flavor:
			"Purified essence radiates from your body like a beacon, burning away shadow corruption and shielding your allies within a dome of sanctified light.",
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
			"The System strips away every limiter, every hesitation, every flaw—and what remains is perfection. For one transcendent minute, you fight like a god of war.",
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
			"For one impossible minute, you see the System's source code—the raw arcane lattice beneath reality. You speak in equations that reshape dimensions, and the world bends to your will.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/powers/arcane-ascension.webp",
	},
];
