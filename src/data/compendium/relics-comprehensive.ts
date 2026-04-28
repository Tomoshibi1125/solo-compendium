export interface Relic {
	id: string;
	name: string;
	description: string;
	type: "weapon" | "armor" | "accessory" | "wondrous" | "consumable" | "tool";
	tier?: string;
	rarity: string;
	cost?: number;
	attunement?: boolean | { required: boolean; requirements: string };
	mechanics: Record<string, unknown>;
	quirks?: string[];
	corruption_risk?: string;
	properties: Record<string, boolean> | string[];
	abilities: Array<{
		name: string;
		description: string;
		usage?: string;
		type?: string;
		frequency?: string;
		action?: string;
		dc?: number;
		charges?: number;
	}>;
	lore: Record<string, string | string[]>;
	flavor: string;
	damage?: string;
	damage_type?: string;
	armor_class?: number;
	armor_type?: string;
	requirements?: Record<string, string | number>;
	source?: string;
	effects?: Record<string, string>;
}

export const comprehensiveRelics: Relic[] = [
	{
		id: "regents-shadow-dagger",
		name: "Regent's Shadow Dagger",
		description:
			"A jagged shard of the First Singularity, wreathed in flickering black mana. It does not cut flesh; it deletes the spatial coordinates of whatever it touches.",
		type: "weapon",
		damage: "2d8",
		damage_type: "necrotic",
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
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		mechanics: {
			stat_bonuses: {
				Intelligence: 1,
			},
			resistance: ["necrotic"],
			special: "Aligned with Void resonance.",
			damage_profile: "1d8",
			condition: "Fear",
		},
		source: "Rift Ascendant Canon",
		flavor: "Tread carefully; magic like this has a cost.",
		effects: {
			primary: "Deals 1d8 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Fear for 1 round.",
		},
	},
	{
		id: "bloodthirsty-greatsword",
		name: "Bloodthirsty Greatsword",
		description:
			"A jagged black slab of iron that hums with the rhythm of a heartbeat. It does not just cut; it drinks.",
		type: "weapon",
		damage: "2d8",
		damage_type: "necrotic",
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
			origin:
				"Created by a regent of dread from the blood of thousands of victims",
			history:
				"This cursed weapon grants immense power but slowly corrupts its wielder, driving them to seek ever greater carnage.",
			priorOwners: [
				"Regent of Dread Malgorath",
				"Warlord Kael",
				"Countless fallen warriors",
			],
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		mechanics: {
			stat_bonuses: {
				Strength: 1,
			},
			resistance: ["necrotic"],
			special: "Aligned with Blood resonance.",
			damage_profile: "4d10",
			condition: "Lethargy",
		},
		source: "Rift Ascendant Canon",
		flavor: "Some items tell stories. This one ends them.",
		effects: {
			primary: "Deals 4d10 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Lethargy for 1 round.",
		},
	},
	{
		id: "lightning-blade",
		name: "Lightning Blade",
		description:
			"A rapier forged from a solidified lightning strike, vibrating with ultra-high frequency mana.",
		type: "weapon",
		damage: "2d8",
		damage_type: "radiant",
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
				"This blade was wielded by the Storm-Class Regent, who could command the very weather with its power.",
			priorOwners: [
				"Storm-Class Regent",
				"Storm-Class Hunter",
				"Tempest-Class Hunter",
			],
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		mechanics: {
			stat_bonuses: {
				Presence: 1,
			},
			resistance: ["radiant"],
			special: "Aligned with Solar resonance.",
			damage_profile: "1d6",
			condition: "Lethargy",
		},
		source: "Rift Ascendant Canon",
		flavor: "Tread carefully; magic like this has a cost.",
		effects: {
			primary: "Deals 1d6 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Lethargy for 1 round.",
		},
	},
	{
		id: "frost-axe",
		name: "Frost Axe",
		description:
			"This Legendary-Rank artifact vibrates with the power to freeze reality. It allows the wielder to manifest a cryogenic field that can shatter any proximity-based dimensional distortion.",
		type: "weapon",
		damage: "2d8",
		damage_type: "cold",
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
			priorOwners: [
				"Frost-Class Regent",
				"Frost-Class Hunter",
				"Frost-Class Hunter",
			],
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		mechanics: {
			stat_bonuses: {
				Vitality: 1,
			},
			resistance: ["cold"],
			special: "Aligned with Glacial resonance.",
			damage_profile: "2d4",
			condition: "Blindness",
		},
		source: "Rift Ascendant Canon",
		flavor: "Tread carefully; magic like this has a cost.",
		effects: {
			primary: "Deals 2d4 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Blindness for 1 round.",
		},
	},
	{
		id: "skywyrms-gauntlet",
		name: "Skywyrm's Gauntlet",
		description:
			"The legendary gauntlet of the Umbral Regent, containing the power to command shadows and bend reality.",
		type: "armor",
		armor_class: 16,
		armor_type: "heavy",
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
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		mechanics: {
			stat_bonuses: {
				Presence: 1,
			},
			resistance: ["force"],
			special: "Aligned with Absolute resonance.",
			damage_profile: "3d6",
			condition: "Fear",
		},
		source: "Rift Ascendant Canon",
		flavor: "Power lies not in the object, but the will of its master.",
		effects: {
			primary: "Deals 3d6 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Fear for 1 round.",
		},
	},
	{
		id: "abyssal-plate",
		name: "Abyssal Plate Armor",
		description:
			"Armor forged in the deepest shadows, offering protection while enhancing shadow abilities.",
		type: "armor",
		armor_class: 16,
		armor_type: "heavy",
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
				"Shadow-Class Vanguard",
				"Umbral Herald Vorlag",
				"Shadow-Class Warlord Zara",
			],
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		mechanics: {
			stat_bonuses: {
				Intelligence: 1,
			},
			resistance: ["necrotic"],
			special: "Aligned with Void resonance.",
			damage_profile: "2d8",
			condition: "Fear",
		},
		source: "Rift Ascendant Canon",
		flavor: "A masterpiece of destructive intent.",
		effects: {
			primary: "Deals 2d8 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Fear for 1 round.",
		},
	},
	{
		id: "lattice-scale-mail",
		name: "Lattice-Scale Mail",
		description:
			"Armor crafted from the scales of an ancient anomaly, offering exceptional protection and anomaly-like abilities.",
		type: "armor",
		armor_class: 16,
		armor_type: "heavy",
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
				name: "anomaly Resistance",
				description:
					"Resistance to the damage type of the anomaly whose scales were used.",
				type: "passive",
			},
			{
				name: "anomaly Breath",
				description: "Once per day, breathe a cone of anomaly energy.",
				type: "command",
				frequency: "once-per-day",
				action: "action",
			},
			{
				name: "anomaly Frightful Presence",
				description:
					"Creatures within 30 feet must make Sense check or be frightened.",
				type: "passive",
			},
		],
		lore: {
			origin:
				"Crafted from the scales of the ancient Ignis-Class Anomaly by master pre-gate smiths",
			history:
				"This armor was worn by the Anomaly Slayer who defeated Ignis, inheriting its power.",
			priorOwners: ["Anomaly Slayer", "Anomaly Slayer", "Scale-Forged Regent"],
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		mechanics: {
			stat_bonuses: {
				Presence: 1,
			},
			resistance: ["force"],
			special: "Aligned with Absolute resonance.",
			damage_profile: "1d6",
			condition: "Stunning",
		},
		source: "Rift Ascendant Canon",
		flavor: "Reforged from the ashes of a fallen Regent.",
		effects: {
			primary: "Deals 1d6 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Stunning for 1 round.",
		},
	},
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
				"Regent of Shadows",
				"Regent of Night",
			],
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		mechanics: {
			stat_bonuses: {
				Presence: 1,
			},
			resistance: ["force"],
			special: "Aligned with Absolute resonance.",
			damage_profile: "3d12 + 6",
			condition: "Blindness",
		},
		source: "Rift Ascendant Canon",
		flavor: "Tread carefully; magic like this has a cost.",
		effects: {
			primary: "Deals 3d12 + 6 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Blindness for 1 round.",
		},
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
				"Shadow-Class Esper Theron",
				"Umbral Sage Marina",
				"Umbral Cultist Kael",
			],
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		mechanics: {
			stat_bonuses: {
				Strength: 1,
			},
			resistance: ["necrotic"],
			special: "Aligned with Blood resonance.",
			damage_profile: "1d8",
			condition: "Stunning",
		},
		source: "Rift Ascendant Canon",
		flavor: "A masterpiece of destructive intent.",
		effects: {
			primary: "Deals 1d8 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Stunning for 1 round.",
		},
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
				"Gate-Tracker Marcus",
				"Umbral Walker Lena",
			],
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		mechanics: {
			stat_bonuses: {
				Sense: 1,
			},
			resistance: ["force"],
			special: "Aligned with Aetheric resonance.",
			damage_profile: "1d12",
			condition: "Stunning",
		},
		source: "Rift Ascendant Canon",
		flavor: "Reforged from the ashes of a fallen Regent.",
		effects: {
			primary: "Deals 1d12 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Stunning for 1 round.",
		},
	},
	{
		id: "crown-of-sense",
		name: "Crown of Sense",
		description:
			"This Legendary-Rank artifact vibrates with the power to mandate reality. It allows the wielder to manifest a fundamental field that can decree any proximity-based dimensional distortion.",
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
				"Regent of Wisdom Marcus",
				"Regent-Oracle Elena",
			],
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		mechanics: {
			stat_bonuses: {
				Presence: 1,
			},
			resistance: ["force"],
			special: "Aligned with Absolute resonance.",
			damage_profile: "2d6",
			condition: "Paralysis",
		},
		source: "Rift Ascendant Canon",
		flavor: "Power lies not in the object, but the will of its master.",
		effects: {
			primary: "Deals 2d6 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Paralysis for 1 round.",
		},
	},
	{
		id: "shadow-orb",
		name: "Shadow Orb",
		description:
			"This Legendary-Rank artifact vibrates with the power to nullify reality. It allows the wielder to manifest a umbral field that can devour any proximity-based dimensional distortion.",
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
			priorOwners: [
				"Shadow-Class Esper",
				"Umbral Esper",
				"Shadow-Class Caster",
			],
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		mechanics: {
			stat_bonuses: {
				Intelligence: 1,
			},
			resistance: ["necrotic"],
			special: "Aligned with Void resonance.",
			damage_profile: "2d4",
			condition: "Fear",
		},
		source: "Rift Ascendant Canon",
		flavor: "Tread carefully; magic like this has a cost.",
		effects: {
			primary: "Deals 2d4 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Fear for 1 round.",
		},
	},
	{
		id: "time-turner",
		name: "Time Turner",
		description:
			"This Legendary-Rank artifact vibrates with the power to suspend reality. It allows the wielder to manifest a recursive field that can accelerate any proximity-based dimensional distortion.",
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
			priorOwners: [
				"Lattice Chronomancer Chronos",
				"Lattice Chronomancer",
				"Lattice Keeper",
			],
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		mechanics: {
			stat_bonuses: {
				Sense: 1,
			},
			resistance: ["force"],
			special: "Aligned with Chrono resonance.",
			damage_profile: "2d6",
			condition: "Stunning",
		},
		source: "Rift Ascendant Canon",
		flavor: "Reforged from the ashes of a fallen Regent.",
		effects: {
			primary: "Deals 2d6 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Stunning for 1 round.",
		},
	},
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
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		mechanics: {
			stat_bonuses: {
				Presence: 1,
			},
			resistance: ["force"],
			special: "Aligned with Absolute resonance.",
			damage_profile: "3d6",
			condition: "Lethargy",
		},
		source: "Rift Ascendant Canon",
		flavor: "Tread carefully; magic like this has a cost.",
		effects: {
			primary: "Deals 3d6 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Lethargy for 1 round.",
		},
	},
	{
		id: "shadow-elixir",
		name: "Shadow Elixir",
		description:
			"This Legendary-Rank artifact vibrates with the power to nullify reality. It allows the wielder to manifest a umbral field that can devour any proximity-based dimensional distortion.",
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
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		mechanics: {
			stat_bonuses: {
				Intelligence: 1,
			},
			resistance: ["necrotic"],
			special: "Aligned with Void resonance.",
			damage_profile: "4d10",
			condition: "Stunning",
		},
		source: "Rift Ascendant Canon",
		flavor: "Reforged from the ashes of a fallen Regent.",
		effects: {
			primary: "Deals 4d10 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Stunning for 1 round.",
		},
	},
	{
		id: "anomaly-blood-potion",
		name: "anomaly Blood Potion",
		description:
			"This Legendary-Rank artifact vibrates with the power to siphon reality. It allows the wielder to manifest a sanguine field that can clot any proximity-based dimensional distortion.",
		type: "consumable",
		rarity: "legendary",
		properties: {
			protocol_enhanced: true,
		},
		abilities: [
			{
				name: "regent-tier Power",
				description:
					"Drink to gain anomaly breath weapon and resistance for 1 hour.",
				type: "consumable",
				action: "action",
			},
		],
		lore: {
			origin: "Brewed from the blood of an ancient anomaly",
			history:
				"These potions are extremely rare and grant the drinker temporary regent-tier powers.",
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		mechanics: {
			stat_bonuses: {
				Strength: 1,
			},
			resistance: ["necrotic"],
			special: "Aligned with Blood resonance.",
			damage_profile: "1d6",
			condition: "Stunning",
		},
		source: "Rift Ascendant Canon",
		flavor: "Reforged from the ashes of a fallen Regent.",
		effects: {
			primary: "Deals 1d6 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Stunning for 1 round.",
		},
	},
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
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		mechanics: {
			stat_bonuses: {
				Intelligence: 1,
			},
			resistance: ["necrotic"],
			special: "Aligned with Void resonance.",
			damage_profile: "2d8",
			condition: "Lethargy",
		},
		source: "Rift Ascendant Canon",
		flavor: "Power lies not in the object, but the will of its master.",
		effects: {
			primary: "Deals 2d8 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Lethargy for 1 round.",
		},
	},
	{
		id: "essence-collector",
		name: "Essence Collector",
		description:
			"This Legendary-Rank artifact vibrates with the power to mandate reality. It allows the wielder to manifest a fundamental field that can decree any proximity-based dimensional distortion.",
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
			curse: "",
			personality: "",
			current_owner: "",
			prior_owners: [],
		},
		mechanics: {
			stat_bonuses: {
				Presence: 1,
			},
			resistance: ["force"],
			special: "Aligned with Absolute resonance.",
			damage_profile: "2d8",
			condition: "Stunning",
		},
		source: "Rift Ascendant Canon",
		flavor: "A masterpiece of destructive intent.",
		effects: {
			primary: "Deals 2d8 physical or magical damage on hit.",
			secondary:
				"Target must make a standard DC saving throw or suffer Stunning for 1 round.",
		},
	},
];
