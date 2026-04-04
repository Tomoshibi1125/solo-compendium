// Comprehensive Relics Compendium - Authoritative System Ascendant Content
// ALL relics needed for the complete compendium system
// Based on System Ascendant mechanics

export interface Relic {
	id: string;
	name: string;
	description: string;
	type:
		| "weapon"
		| "armor"
		| "accessory"
		| "consumable"
		| "artifact"
		| "tool"
		| "material";
	rarity: "uncommon" | "rare" | "very_rare" | "epic" | "legendary" | "mythic";
	attunement?: boolean;
	requirements?: {
		level?: number;
		alignment?: string;
		class?: string;
		ability?: string;
		score?: number;
		job?: string;
		background?: string;
	};
	properties: {
		protocol_enhanced?: boolean;
		sentient?: boolean;
		cursed?: boolean;
		unique?: boolean;
		legendary?: boolean;
		legendary_actions?: boolean;
	};
	abilities: {
		name: string;
		description: string;
		type:
			| "passive"
			| "active"
			| "command"
			| "consumable"
			| "triggered"
			| "reaction";
		frequency?:
			| "at-will"
			| "short-rest"
			| "long-rest"
			| "once-per-day"
			| "once-per-week"
			| "once-per-turn"
			| "when-critical-hit"
			| "when-creature-dies"
			| "reaction"
			| "action";
		action?: "action" | "bonus-action" | "reaction" | "free";
		dc?: number;
		charges?: number;
	}[];
	lore: {
		origin: string;
		history: string;
		currentOwner?: string;
		priorOwners?: string[];
	};
	mechanics: {
		bonus?: {
			type:
				| "attack"
				| "damage"
				| "AC"
				| "saving-throws"
				| "ability-checks"
				| "skill-checks";
			value: number;
			ability?: string;
			skills?: string[];
		};
		resistance?: string[];
		immunity?: string[];
		vulnerabilities?: string[];
	};
	source: string;
	image?: string;
}

export const comprehensiveRelics: Relic[] = [
	// LEGENDARY WEAPONS
	{
		id: "regents-shadow-dagger",
		name: "Regent's Shadow Dagger",
		description:
			"A jagged shard of the First Singularity, wreathed in flickering black mana. It does not cut flesh; it deletes the spatial coordinates of whatever it touches.",
		type: "weapon",
		rarity: "legendary",
		attunement: true,
		requirements: {
			ability: "Agility",
			score: 17,
		},
		properties: {
			protocol_enhanced: true,
			sentient: true,
			unique: true,
			legendary_actions: true,
		},
		abilities: [
			{
				name: "Shadow Pierce",
				description:
					"The dagger ignores all armor and resistance, dealing damage directly to the target's HP.",
				type: "passive",
			},
			{
				name: "Dimensional Strike",
				description:
					"As a bonus action, teleport up to 60 feet and make a dagger attack against one creature.",
				type: "active",
				frequency: "short-rest",
				action: "bonus-action",
			},
			{
				name: "Essence Drain",
				description:
					"On a critical hit, drain the target's life essence, gaining temporary HP equal to the damage dealt.",
				type: "triggered",
				frequency: "when-critical-hit",
			},
			{
				name: "Shadow Portal",
				description:
					"Once per day, create a portal between two points you can see within 120 feet.",
				type: "command",
				frequency: "once-per-day",
				action: "action",
			},
		],
		lore: {
			origin:
				"Forged by the first Umbral Regent from the essence of a defeated god",
			history:
				"This dagger has served as the symbol of power for countless Umbral Regents throughout history. It is said to contain the collective will and power of all who have wielded it.",
			priorOwners: [
				"First Umbral Regent",
				"First Regent",
				"Various Umbral Regents",
			],
		},
		mechanics: {
			bonus: {
				type: "attack",
				value: 3,
				ability: "Agility",
			},
			resistance: ["necrotic", "force"],
			immunity: ["poison"],
		},
		source: "System Ascendant Canon",
	},
	{
		id: "bloodthirsty-greatsword",
		name: "Bloodthirsty Greatsword",
		description:
			"A jagged black slab of iron that hums with the rhythm of a heartbeat. It does not just cut; it drinks.",
		type: "weapon",
		rarity: "very_rare",
		attunement: true,
		requirements: {
			ability: "Strength",
			score: 15,
		},
		properties: {
			protocol_enhanced: true,
			cursed: true,
		},
		abilities: [
			{
				name: "Blood Frenzy",
				description:
					"After reducing a creature to 0 HP, gain advantage on attack rolls and +2 damage for 1 minute.",
				type: "triggered",
				frequency: "when-creature-dies",
			},
			{
				name: "Life Drain",
				description:
					"Once per turn when you hit a creature, you can deal extra necrotic damage equal to your Strength modifier.",
				type: "active",
				frequency: "once-per-turn",
			},
			{
				name: "Blood Healing",
				description:
					"When you kill a creature, regain HP equal to half the damage you dealt.",
				type: "triggered",
				frequency: "when-creature-dies",
			},
		],
		lore: {
			origin: "Created by a fiend lord from the blood of thousands of victims",
			history:
				"This cursed weapon grants immense power but slowly corrupts its wielder, driving them to seek ever greater carnage.",
			priorOwners: [
				"Fiend Lord Malgorath",
				"Warlord Kael",
				"Countless fallen warriors",
			],
		},
		mechanics: {
			bonus: {
				type: "damage",
				value: 2,
			},
			vulnerabilities: ["radiant"],
		},
		source: "System Ascendant Canon",
	},
	{
		id: "lightning-blade",
		name: "Lightning Blade",
		description:
			"A rapier forged from a solidified lightning strike, vibrating with ultra-high frequency mana.",
		type: "weapon",
		rarity: "legendary",
		attunement: true,
		requirements: {
			ability: "Agility",
			score: 16,
		},
		properties: {
			protocol_enhanced: true,
			unique: true,
		},
		abilities: [
			{
				name: "Lightning Strike",
				description:
					"The sword deals extra lightning damage and can chain to nearby enemies.",
				type: "passive",
			},
			{
				name: "Thunder Clap",
				description:
					"Once per turn, can create a thunderous boom that deafens enemies within 10 feet.",
				type: "active",
				frequency: "once-per-turn",
				action: "bonus-action",
			},
			{
				name: "Storm Fury",
				description:
					"Once per day, call down a lightning storm that strikes all enemies in 30-foot radius.",
				type: "command",
				frequency: "once-per-day",
				action: "action",
			},
		],
		lore: {
			origin: "Forged in the heart of a storm by a legendary weaponsmith",
			history:
				"This blade was wielded by the Storm King, who could command the very weather with its power.",
			priorOwners: ["Storm King", "Lightning Warrior", "Tempest Knight"],
		},
		mechanics: {
			bonus: {
				type: "damage",
				value: 3,
			},
			resistance: ["lightning", "thunder"],
		},
		source: "System Ascendant Canon",
	},
	{
		id: "frost-axe",
		name: "Frost Axe",
		description:
			"An axe carved from permafrost that radiates a field of absolute zero.",
		type: "weapon",
		rarity: "very_rare",
		attunement: true,
		requirements: {
			ability: "Strength",
			score: 14,
		},
		properties: {
			protocol_enhanced: true,
			unique: true,
		},
		abilities: [
			{
				name: "Ice Touch",
				description:
					"The axe deals extra cold damage and can freeze enemies solid.",
				type: "passive",
			},
			{
				name: "Winter's Grasp",
				description:
					"Once per day, can create a blizzard in 60-foot radius for 1 minute.",
				type: "command",
				frequency: "once-per-day",
				action: "action",
			},
			{
				name: "Frost Shield",
				description:
					"Can create a wall of ice that blocks attacks and movement.",
				type: "active",
				frequency: "short-rest",
				action: "action",
			},
		],
		lore: {
			origin: "Carved from the heart of an ancient glacier by frost giants",
			history:
				"This axe has been passed down through generations of winter warriors, each adding to its icy power.",
			priorOwners: ["Frost Giant King", "Winter Warrior", "Ice Berserker"],
		},
		mechanics: {
			bonus: {
				type: "damage",
				value: 2,
			},
			resistance: ["cold"],
			vulnerabilities: ["fire"],
		},
		source: "System Ascendant Canon",
	},

	// LEGENDARY ARMOR
	{
		id: "skywyrms-gauntlet",
		name: "Skywyrm's Gauntlet",
		description:
			"The legendary gauntlet of the Umbral Regent, containing the power to command shadows and bend reality.",
		type: "armor",
		rarity: "mythic",
		attunement: true,
		requirements: {
			class: "Umbral Regent",
		},
		properties: {
			protocol_enhanced: true,
			sentient: true,
			unique: true,
			legendary_actions: true,
		},
		abilities: [
			{
				name: "Shadow Command",
				description:
					"As an action, take control of all shadow creatures within 120 feet for 1 minute.",
				type: "command",
				frequency: "once-per-day",
				action: "action",
			},
			{
				name: "Reality Bend",
				description:
					"Once per week, alter reality in a 30-foot radius for 1 minute.",
				type: "command",
				frequency: "once-per-week",
				action: "action",
			},
			{
				name: "Regent's Protection",
				description:
					"You have resistance to all damage types and advantage on all Decree checks.",
				type: "passive",
			},
			{
				name: "Umbral Legion",
				description:
					"Summon an army of 100 Umbral Legion that serve you for 24 hours.",
				type: "command",
				frequency: "once-per-week",
				action: "action",
			},
		],
		lore: {
			origin:
				"Created by the original Umbral Regent from the essence of conquered dimensions",
			history:
				"This gauntlet represents the pinnacle of shadow power, containing the authority to command all shadows and reshape reality itself.",
			currentOwner: "Current Umbral Regent",
		},
		mechanics: {
			resistance: [
				"bludgeoning",
				"piercing",
				"slashing",
				"fire",
				"cold",
				"lightning",
				"thunder",
				"acid",
				"poison",
				"necrotic",
				"radiant",
				"force",
			],
			immunity: ["protocol-enhanced"],
		},
		source: "System Ascendant Canon",
	},
	{
		id: "abyssal-plate",
		name: "Abyssal Plate Armor",
		description:
			"Armor forged in the deepest shadows, offering protection while enhancing shadow abilities.",
		type: "armor",
		rarity: "legendary",
		attunement: true,
		requirements: {
			ability: "Vitality",
			score: 16,
		},
		properties: {
			protocol_enhanced: true,
			unique: true,
		},
		abilities: [
			{
				name: "Shadow Meld",
				description:
					"As a bonus action, become incorporeal for 1 minute, moving through walls and creatures.",
				type: "active",
				frequency: "short-rest",
				action: "bonus-action",
			},
			{
				name: "Darkness Aura",
				description:
					"Magical darkness surrounds you in a 15-foot radius. You can see through this darkness.",
				type: "passive",
			},
			{
				name: "Shadow Fortification",
				description:
					"When you would take damage, you can use your reaction to reduce it by half.",
				type: "reaction",
				frequency: "short-rest",
			},
		],
		lore: {
			origin:
				"Forged in the Abyss by shadow smiths using materials from defeated shadow lords",
			history:
				"This armor has protected many powerful shadow warriors throughout the ages, each adding their own essence to its power.",
			priorOwners: [
				"Shadow Knight Commander",
				"Dark Herald Vorlag",
				"Shadow Warlord Zara",
			],
		},
		mechanics: {
			bonus: {
				type: "AC",
				value: 3,
			},
			resistance: ["necrotic", "cold"],
			immunity: ["poison"],
		},
		source: "System Ascendant Canon",
	},
	{
		id: "dragon-scale-mail",
		name: "Dragon Scale Mail",
		description:
			"Armor crafted from the scales of an ancient dragon, offering exceptional protection and dragon-like abilities.",
		type: "armor",
		rarity: "legendary",
		attunement: true,
		requirements: {
			ability: "Vitality",
			score: 17,
		},
		properties: {
			protocol_enhanced: true,
			unique: true,
		},
		abilities: [
			{
				name: "Dragon Resistance",
				description:
					"Resistance to the damage type of the dragon whose scales were used.",
				type: "passive",
			},
			{
				name: "Dragon Breath",
				description: "Once per day, breathe a cone of dragon energy.",
				type: "command",
				frequency: "once-per-day",
				action: "action",
			},
			{
				name: "Dragon Frightful Presence",
				description:
					"Creatures within 30 feet must make Sense check or be frightened.",
				type: "passive",
			},
		],
		lore: {
			origin:
				"Crafted from the scales of the ancient dragon Ignis by master dwarven smiths",
			history:
				"This armor was worn by the Dragon Knight who defeated Ignis, inheriting its power.",
			priorOwners: ["Dragon Knight", "Dragon Slayer", "Scale Lord"],
		},
		mechanics: {
			bonus: {
				type: "AC",
				value: 4,
			},
			resistance: ["fire"],
		},
		source: "System Ascendant Canon",
	},

	// LEGENDARY ACCESSORIES
	{
		id: "rulers-authority",
		name: "Architect's Authority",
		description:
			"An artifact that grants the bearer command over lesser shadows and the respect of all beings.",
		type: "accessory",
		rarity: "legendary",
		attunement: true,
		requirements: {
			ability: "Presence",
			score: 15,
		},
		properties: {
			protocol_enhanced: true,
			sentient: true,
		},
		abilities: [
			{
				name: "Command Shadows",
				description:
					"As an action, issue a command to all shadow creatures within 60 feet. They must obey if they fail a Sense check.",
				type: "command",
				frequency: "long-rest",
				action: "action",
				dc: 18,
			},
			{
				name: "Royal Presence",
				description:
					"All creatures except those with higher CR have disadvantage on attack rolls against you.",
				type: "passive",
			},
			{
				name: "Inspire Loyalty",
				description:
					"Your allies within 30 feet gain +2 to Decree checks and cannot be frightened.",
				type: "passive",
			},
			{
				name: "Decree",
				description:
					"Once per week, issue a decree that affects all creatures in a 1-mile radius.",
				type: "command",
				frequency: "once-per-week",
				action: "action",
			},
		],
		lore: {
			origin:
				"Created by the first Regent to establish authority over their growing shadow empire",
			history:
				"This artifact represents the right to rule, containing the essence of leadership and command that all Regents must possess.",
			priorOwners: [
				"First Umbral Regent",
				"Queen of Shadows",
				"Emperor of Night",
			],
		},
		mechanics: {
			bonus: {
				type: "saving-throws",
				value: 2,
				ability: "Presence",
			},
		},
		source: "System Ascendant Canon",
	},
	{
		id: "bloodstone-amulet",
		name: "Bloodstone Amulet",
		description:
			"An amulet that enhances shadow manipulation abilities and protects against shadow corruption.",
		type: "accessory",
		rarity: "epic",
		attunement: true,
		requirements: {
			ability: "Sense",
			score: 14,
		},
		properties: {
			protocol_enhanced: true,
		},
		abilities: [
			{
				name: "Shadow Enhancement",
				description:
					"Your shadow abilities deal +1d6 extra damage and have advantage on attack rolls.",
				type: "passive",
			},
			{
				name: "Blood Protection",
				description:
					"Immunity to shadow corruption and advantage on saves against shadow spells.",
				type: "passive",
			},
			{
				name: "Essence Storage",
				description:
					"Can store up to 10 essence points that can be used to power shadow abilities.",
				type: "passive",
			},
			{
				name: "Shadow Sight",
				description:
					"Can see in protocol-enhanced darkness and perceive invisible creatures.",
				type: "passive",
			},
		],
		lore: {
			origin:
				"Created by ancient shadow mages to protect against the corrupting influence of raw shadow energy",
			history:
				"This amulet has saved countless shadow users from falling to shadow madness, allowing them to harness shadow power safely.",
			priorOwners: [
				"Shadow Archmage Theron",
				"Dark Sage Marina",
				"Shadow Cultist Kael",
			],
		},
		mechanics: {
			resistance: ["necrotic"],
			immunity: ["shadow corruption"],
		},
		source: "System Ascendant Canon",
	},
	{
		id: "dimensional-compass",
		name: "Dimensional Compass",
		description:
			"A compass that points toward dimensional disturbances and can guide through abyssal realms.",
		type: "accessory",
		rarity: "very_rare",
		attunement: false,
		properties: {
			protocol_enhanced: true,
			unique: true,
		},
		abilities: [
			{
				name: "Dimension Sense",
				description:
					"Always points toward the nearest dimensional disturbance within 100 miles.",
				type: "passive",
			},
			{
				name: "Shadow Navigation",
				description: "Cannot get lost in abyssal realms or dimensional spaces.",
				type: "passive",
			},
			{
				name: "Portal Detection",
				description:
					"Vibrates when within 100 feet of a portal or dimensional rift.",
				type: "passive",
			},
			{
				name: "Wayfinding",
				description:
					"Once per day, can show the safest path through dangerous dimensional areas.",
				type: "active",
				frequency: "once-per-day",
				action: "action",
			},
		],
		lore: {
			origin:
				"Forged by dimensional travelers who learned to navigate the spaces between worlds",
			history:
				"This compass has guided countless adventurers through dangerous dimensional journeys, its needle always pointing toward safety or adventure.",
			priorOwners: [
				"Dimensional Explorer Alara",
				"Rift Tracker Marcus",
				"Shadow Walker Lena",
			],
		},
		mechanics: {
			immunity: ["getting lost"],
		},
		source: "System Ascendant Canon",
	},
	{
		id: "crown-of-sense",
		name: "Crown of Sense",
		description:
			"A crown that grants the wearer immense knowledge and insight.",
		type: "accessory",
		rarity: "legendary",
		attunement: true,
		requirements: {
			ability: "Intelligence",
			score: 18,
		},
		properties: {
			protocol_enhanced: true,
			sentient: true,
			unique: true,
		},
		abilities: [
			{
				name: "All-Knowledge",
				description:
					"You have proficiency in all skills and can add double proficiency bonus to Intelligence checks.",
				type: "passive",
			},
			{
				name: "True Sight",
				description:
					"Can see through illusions and perceive the true nature of things.",
				type: "passive",
			},
			{
				name: "Sense of Ages",
				description:
					"Once per day, can gain insight into any question by consulting the crown.",
				type: "command",
				frequency: "once-per-day",
				action: "action",
			},
			{
				name: "Mental Fortress",
				description:
					"Immunity to psychic damage and advantage on all mental Decree checks.",
				type: "passive",
			},
		],
		lore: {
			origin:
				"Created by the first sage king who collected all knowledge in the realm",
			history:
				"This crown contains the accumulated sense of countless rulers and scholars who have worn it.",
			priorOwners: [
				"Sage King Solomon",
				"Wise Emperor Marcus",
				"Oracle Queen Elena",
			],
		},
		mechanics: {
			bonus: {
				type: "saving-throws",
				value: 2,
				ability: "Intelligence",
			},
			immunity: ["psychic"],
		},
		source: "System Ascendant Canon",
	},

	// EPIC ITEMS
	{
		id: "shadow-orb",
		name: "Shadow Orb",
		description:
			"A sphere of pure shadow energy that can be used to power shadow abilities.",
		type: "accessory",
		rarity: "epic",
		attunement: true,
		requirements: {
			ability: "Sense",
			score: 15,
		},
		properties: {
			protocol_enhanced: true,
			unique: true,
		},
		abilities: [
			{
				name: "Shadow Power",
				description:
					"The orb contains 10 shadow charges that can be used to power shadow abilities.",
				type: "passive",
			},
			{
				name: "Shadow Shield",
				description:
					"As a reaction, expend a charge to create a shield that blocks one attack.",
				type: "reaction",
				frequency: "reaction",
			},
			{
				name: "Shadow Bolt",
				description:
					"As an action, expend a charge to fire a bolt of shadow energy.",
				type: "active",
				frequency: "action",
			},
			{
				name: "Shadow Renewal",
				description: "The orb regains 1d4 charges at dawn.",
				type: "passive",
			},
		],
		lore: {
			origin: "Created by shadow mages as a portable source of shadow energy",
			history:
				"This orb has been used by countless shadow users who needed portable power.",
			priorOwners: ["Shadow Archmage", "Dark Esper", "Shadow Warlock"],
		},
		mechanics: {
			resistance: ["necrotic"],
		},
		source: "System Ascendant Canon",
	},
	{
		id: "time-turner",
		name: "Time Turner",
		description: "A device that can manipulate time in limited ways.",
		type: "accessory",
		rarity: "mythic",
		attunement: true,
		requirements: {
			ability: "Intelligence",
			score: 20,
		},
		properties: {
			protocol_enhanced: true,
			unique: true,
			legendary_actions: true,
		},
		abilities: [
			{
				name: "Time Rewind",
				description:
					"Once per week, can rewind time by 6 seconds, undoing recent events.",
				type: "command",
				frequency: "once-per-week",
				action: "action",
			},
			{
				name: "Precognition",
				description: "Advantage on all attack rolls and Decree checks.",
				type: "passive",
			},
			{
				name: "Haste",
				description: "Once per day, can take an extra turn.",
				type: "command",
				frequency: "once-per-day",
				action: "bonus-action",
			},
			{
				name: "Slow Time",
				description:
					"Once per day, can force all enemies in 30-foot radius to act in slow motion.",
				type: "command",
				frequency: "once-per-day",
				action: "action",
			},
		],
		lore: {
			origin:
				"Created by a time mage who discovered the secrets of temporal manipulation",
			history:
				"This device is one of the few objects that can truly affect the flow of time.",
			priorOwners: ["Time Master Chronos", "Temporal Mage", "Hourglass Keeper"],
		},
		mechanics: {
			immunity: ["time-based effects"],
		},
		source: "System Ascendant Canon",
	},

	// CONSUMABLES
	{
		id: "essence-potion",
		name: "Essence Potion",
		description:
			"A potion containing concentrated life essence that can heal wounds and enhance abilities.",
		type: "consumable",
		rarity: "rare",
		properties: {
			protocol_enhanced: true,
		},
		abilities: [
			{
				name: "Essence Restoration",
				description:
					"Drink to restore 4d4+4 HP and gain +1 to all ability checks for 1 hour.",
				type: "consumable",
				action: "action",
			},
		],
		lore: {
			origin: "Brewed by shadow alchemists using extracted life essence",
			history:
				"These potions are highly valued by shadow users for their healing and enhancing properties.",
		},
		mechanics: {
			bonus: {
				type: "ability-checks",
				value: 1,
			},
		},
		source: "System Ascendant Canon",
	},
	{
		id: "shadow-elixir",
		name: "Shadow Elixir",
		description: "A dark elixir that grants temporary shadow abilities.",
		type: "consumable",
		rarity: "very_rare",
		properties: {
			protocol_enhanced: true,
		},
		abilities: [
			{
				name: "Shadow Empowerment",
				description: "Drink to gain shadow step and shadow stealth for 1 hour.",
				type: "consumable",
				action: "action",
			},
		],
		lore: {
			origin: "Created by shadow alchemists from pure shadow essence",
			history:
				"These elixirs are used by those who wish to temporarily gain shadow powers.",
		},
		mechanics: {
			bonus: {
				type: "skill-checks",
				value: 2,
				skills: ["Stealth", "Acrobatics"],
			},
		},
		source: "System Ascendant Canon",
	},
	{
		id: "dragon-blood-potion",
		name: "Dragon Blood Potion",
		description:
			"A potion made from dragon blood that grants draconic abilities.",
		type: "consumable",
		rarity: "legendary",
		properties: {
			protocol_enhanced: true,
		},
		abilities: [
			{
				name: "Draconic Power",
				description:
					"Drink to gain dragon breath weapon and resistance for 1 hour.",
				type: "consumable",
				action: "action",
			},
		],
		lore: {
			origin: "Brewed from the blood of an ancient dragon",
			history:
				"These potions are extremely rare and grant the drinker temporary draconic powers.",
		},
		mechanics: {
			resistance: ["fire", "cold", "lightning", "acid", "poison"],
		},
		source: "System Ascendant Canon",
	},

	// TOOLS
	{
		id: "shadow-lens",
		name: "Shadow Lens",
		description:
			"A protocol-enhanced lens that can see through shadows and reveal hidden things.",
		type: "tool",
		rarity: "rare",
		attunement: false,
		properties: {
			protocol_enhanced: true,
			unique: true,
		},
		abilities: [
			{
				name: "Shadow Vision",
				description: "Can see through shadows and protocol-enhanced darkness.",
				type: "passive",
			},
			{
				name: "True Sight",
				description:
					"Can see through illusions and detect invisible creatures.",
				type: "passive",
			},
			{
				name: "Shadow Detection",
				description: "Can detect shadow creatures and shadow protocol.",
				type: "passive",
			},
		],
		lore: {
			origin:
				"Created by a shadow mage who wanted to see what others could not",
			history:
				"This lens has helped many adventurers discover hidden dangers and secrets.",
		},
		mechanics: {
			bonus: {
				type: "skill-checks",
				value: 2,
				skills: ["Perception", "Investigation"],
			},
		},
		source: "System Ascendant Canon",
	},
	{
		id: "essence-collector",
		name: "Essence Collector",
		description:
			"A device that can collect and store life essence from defeated enemies.",
		type: "tool",
		rarity: "very_rare",
		attunement: true,
		properties: {
			protocol_enhanced: true,
			unique: true,
		},
		abilities: [
			{
				name: "Essence Collection",
				description:
					"Automatically collects essence from defeated enemies within 30 feet.",
				type: "passive",
			},
			{
				name: "Essence Storage",
				description: "Can store up to 20 essence points.",
				type: "passive",
			},
			{
				name: "Essence Release",
				description: "Can release stored essence to heal or power abilities.",
				type: "active",
				frequency: "at-will",
				action: "action",
			},
		],
		lore: {
			origin:
				"Invented by a shadow scientist who wanted to harness the power of life essence",
			history:
				"This device has revolutionized the way shadow users collect and use essence.",
		},
		mechanics: {
			bonus: {
				type: "ability-checks",
				value: 2,
				ability: "Sense",
			},
		},
		source: "System Ascendant Canon",
	},
];
