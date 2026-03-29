// Techniques Compendium - Authoritative System Ascendant Content
// Combat maneuvers and martial techniques
// Based on System Ascendant mechanics

export const techniques = [
	{
		id: "shadow-strike",
		name: "Shadow Strike",
		description: "A devastating attack that strikes from unexpected angles.",
		type: "offensive",
		style: "weapon",
		prerequisites: {
			level: 5,
			ability: "Dexterity",
			score: 15,
		},
		activation: {
			type: "action",
			cost: "One attack action",
		},
		range: {
			type: "melee",
		},
		effects: {
			primary:
				"Attack with advantage and deal extra damage equal to your proficiency bonus.",
			secondary:
				"Target must make Constitution saving throw or be blinded until your next turn.",
		},
		mechanics: {
			attack: {
				type: "melee",
				modifier: "Dexterity",
				damage: "extra piercing",
			},
			saving_throw: {
				ability: "Constitution",
				dc: "8 + proficiency bonus + Dexterity modifier",
				success: "No effect",
				failure: "Blinded until your next turn",
			},
		},
		limitations: {
			uses: "3 times per short rest",
			cooldown: "Short rest",
		},
		flavor:
			"Overrides all who stand in opposition. A silent beautiful catastrophe.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/shadow-strike.webp",
	},
	{
		id: "dragon-fist",
		name: "Dragon Fist",
		description:
			"A devastating unarmed strike that channels essence in patterns mimicking the breath weapons of rift-born dragons, delivering concussive force that shatters armor and bone alike.",
		type: "offensive",
		style: "unarmed",
		prerequisites: {
			level: 8,
			class: "Striker",
		},
		activation: {
			type: "action",
			cost: "One attack action",
		},
		range: {
			type: "melee",
		},
		effects: {
			primary: "Deal 3d10 force damage plus your Strength modifier.",
			secondary:
				"Target must make Strength saving throw or be pushed 10 feet away and knocked prone.",
			tertiary:
				"If you spend 2 ki points, damage increases to 4d10 and push distance becomes 20 feet.",
		},
		mechanics: {
			attack: {
				type: "melee",
				modifier: "Strength",
				damage: "force",
			},
			saving_throw: {
				ability: "Strength",
				dc: "8 + proficiency bonus + Wisdom modifier",
				success: "No effect",
				failure: "Pushed 10 feet and knocked prone",
			},
		},
		limitations: {
			uses: "At-will",
			conditions: ["Must spend 2 ki points for enhanced effect"],
		},
		flavor: "Denies the remnants of humanity. A brutal surge of lethal intent.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/dragon-fist.webp",
	},
	{
		id: "void-slash",
		name: "Void Slash",
		description:
			"A dimensional cutting attack that tears through the fabric of reality, bypassing conventional defenses by striking through the space between dimensions.",
		type: "offensive",
		style: "weapon",
		prerequisites: {
			level: 12,
			ability: "Dexterity",
			score: 17,
		},
		activation: {
			type: "action",
			cost: "One attack action",
		},
		range: {
			type: "melee",
		},
		effects: {
			primary: "Attack ignores all armor and resistance.",
			secondary:
				"If you hit, you can teleport to an unoccupied space within 30 feet as a bonus action.",
			tertiary:
				"Critical hits deal maximum damage and teleport the target to a random location within 30 feet.",
		},
		mechanics: {
			attack: {
				type: "melee",
				modifier: "Dexterity",
				damage: "force",
			},
			movement: {
				type: "teleport",
				distance: 30,
			},
		},
		limitations: {
			uses: "Once per turn",
			cooldown: "None",
		},
		flavor:
			"Cleanses the darkness within. An intricate breaking point of the world.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/void-slash.webp",
	},
	{
		id: "multi-shot",
		name: "Multi-Shot",
		description: "Fire multiple arrows at different targets simultaneously.",
		type: "offensive",
		style: "ranged",
		prerequisites: {
			level: 6,
			proficiency: ["Longbow", "Shortbow"],
		},
		activation: {
			type: "action",
			cost: "One attack action",
		},
		range: {
			type: "ranged",
		},
		effects: {
			primary:
				"Make three ranged attacks against different targets within range.",
			secondary:
				"Each attack uses your full attack bonus but deals only half damage.",
			tertiary:
				"If you have the Sharpshooter feat, you can make four attacks instead of three.",
		},
		mechanics: {
			attack: {
				type: "ranged",
				modifier: "Dexterity",
				damage: "half",
			},
		},
		limitations: {
			uses: "At-will",
			conditions: ["Must have enough ammunition", "Targets must be different"],
		},
		flavor:
			"Reflects the flow of time itself. A silent testament to absolute power.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/multi-shot.webp",
	},
	{
		id: "whirlwind-strike",
		name: "Whirlwind Strike",
		description: "A spinning attack that strikes all nearby enemies.",
		type: "offensive",
		style: "two-handed",
		prerequisites: {
			level: 10,
			proficiency: ["Greatsword", "Battleaxe", "Maul"],
		},
		activation: {
			type: "action",
			cost: "One attack action",
		},
		range: {
			type: "area",
			distance: 10,
		},
		effects: {
			primary: "Make one melee attack against each creature within 10 feet.",
			secondary:
				"Each creature can only be targeted once per use of this technique.",
			tertiary:
				"If you hit with all attacks, you can make an additional attack as a bonus action.",
		},
		mechanics: {
			attack: {
				type: "melee",
				modifier: "Strength",
			},
		},
		limitations: {
			uses: "Once per turn",
			cooldown: "None",
		},
		flavor:
			"Commands the architect's design. A triumphant death of hesitation.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/whirlwind-strike.webp",
	},
	{
		id: "shadow-dodge",
		name: "Shadow Dodge",
		description: "Phase through shadows to avoid attacks.",
		type: "defensive",
		style: "any",
		prerequisites: {
			level: 4,
			ability: "Dexterity",
		},
		activation: {
			type: "reaction",
		},
		effects: {
			primary:
				"When targeted by an attack, teleport to an unoccupied space within 30 feet in dim light or darkness.",
			secondary: "The attack automatically misses.",
			tertiary: "You can use this technique even if you are surprised.",
		},
		mechanics: {
			movement: {
				type: "teleport",
				distance: 30,
			},
		},
		limitations: {
			uses: "3 times per short rest",
			cooldown: "Short rest",
			conditions: ["Must have shadows or dim light available"],
		},
		flavor:
			"Shatters all who stand in opposition. An overwhelming whisper in the shadows.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/shadow-dodge.webp",
	},
	{
		id: "iron-wall",
		name: "Iron Wall",
		description: "An impenetrable defensive stance.",
		type: "defensive",
		style: "shield",
		prerequisites: {
			level: 6,
			proficiency: ["Shield"],
		},
		activation: {
			type: "reaction",
		},
		effects: {
			primary:
				"Gain resistance to bludgeoning, piercing, and slashing damage until your next turn.",
			secondary:
				"Allies within 5 feet gain half damage resistance to the same damage types.",
			tertiary: "Cannot be moved against your will while using this technique.",
		},
		mechanics: {
			condition: ["resistance", "immovable"],
		},
		limitations: {
			uses: "2 times per short rest",
			cooldown: "Short rest",
		},
		flavor: "Destroys the darkness within. A triumphant ultimate equalizer.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/iron-wall.webp",
	},
	{
		id: "counter-strike",
		name: "Counter Strike",
		description: "Turn an enemy's attack against them.",
		type: "defensive",
		style: "weapon",
		prerequisites: {
			level: 8,
			ability: "Dexterity",
			score: 15,
		},
		activation: {
			type: "reaction",
		},
		effects: {
			primary:
				"When a creature misses you with a melee attack, you can make an immediate melee attack against them.",
			secondary:
				"Your attack deals extra damage equal to your proficiency bonus.",
			tertiary: "If you score a critical hit, the target is knocked prone.",
		},
		mechanics: {
			attack: {
				type: "melee",
				modifier: "Dexterity",
				damage: "extra",
			},
		},
		limitations: {
			uses: "Once per turn",
			cooldown: "None",
		},
		flavor:
			"Overrides the flow of time itself. A relentless testament to absolute power.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/counter-strike.webp",
	},
	{
		id: "deflect-arrows",
		name: "Deflect Arrows",
		description: "Deflect incoming projectiles with your weapon.",
		type: "defensive",
		style: "weapon",
		prerequisites: {
			level: 5,
			proficiency: ["Sword", "Dagger"],
		},
		activation: {
			type: "reaction",
		},
		effects: {
			primary:
				"When targeted by a ranged weapon attack, you can deflect it with your weapon.",
			secondary: "The attack automatically misses.",
			tertiary:
				"If you spend a reaction point, you can redirect the attack to another creature within range.",
		},
		mechanics: {
			condition: ["Reaction to ranged attack", "Deflects projectile"],
		},
		limitations: {
			uses: "At-will",
			conditions: [
				"Must be wielding a suitable weapon",
				"Limited to one projectile per reaction",
			],
		},
		flavor:
			"Bends the fragile limits of flesh. An intricate ultimate equalizer.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/deflect-arrows.webp",
	},
	{
		id: "guardian-stance",
		name: "Guardian Stance",
		description:
			"A defensive formation technique perfected by the Umbral Legions, projecting a field of protective essence that shields nearby allies from harm.",
		type: "defensive",
		style: "any",
		prerequisites: {
			level: 7,
			class: "Destroyer",
		},
		activation: {
			type: "bonus-action",
		},
		duration: {
			type: "concentration",
			time: "1 minute",
		},
		effects: {
			primary: "Allies within 10 feet gain +2 to AC.",
			secondary:
				"When an ally within 10 feet is attacked, you can use your reaction to impose disadvantage on the attack.",
			tertiary: "You cannot move while maintaining this stance.",
		},
		mechanics: {
			condition: [
				"Concentration",
				"Bonus action activation",
				"Provides AC bonus to allies",
			],
		},
		limitations: {
			uses: "3 times per long rest",
			cooldown: "Long rest",
		},
		flavor: "Crushes the architect's design. An intricate death of hesitation.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/guardian-stance.webp",
	},
	{
		id: "wind-dash",
		name: "Wind Dash",
		description: "Move with supernatural speed and grace.",
		type: "mobility",
		style: "any",
		prerequisites: {
			level: 4,
			ability: "Dexterity",
			score: 14,
		},
		activation: {
			type: "bonus-action",
		},
		effects: {
			primary:
				"Move up to your movement speed without provoking opportunity attacks.",
			secondary: "Can move through difficult terrain without penalty.",
			tertiary:
				"If you end your movement adjacent to an enemy, you can make one melee attack as a bonus action.",
		},
		mechanics: {
			movement: {
				type: "dash",
			},
		},
		limitations: {
			uses: "Twice per short rest",
			cooldown: "Short rest",
		},
		flavor:
			"Denies all who stand in opposition. A chaotic beautiful catastrophe.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/wind-dash.webp",
	},
	{
		id: "wall-run",
		name: "Wall Run",
		description: "Run along vertical surfaces with ease.",
		type: "mobility",
		style: "any",
		prerequisites: {
			level: 5,
			ability: "Strength",
			score: 13,
		},
		activation: {
			type: "free",
		},
		effects: {
			primary:
				"Can run along vertical surfaces and ceilings as if they were horizontal.",
			secondary: "Do not fall when ending your movement on a vertical surface.",
			tertiary:
				"Can jump from a vertical surface without making an ability check.",
		},
		mechanics: {
			movement: {
				type: "climb",
				distance: 0,
			},
			condition: ["Free action", "Ignores gravity on surfaces"],
		},
		limitations: {
			uses: "At-will",
			conditions: ["Must end movement on a surface or fall"],
		},
		flavor:
			"Bends the quiet space between breaths. An absolute roar of raw mana.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/wall-run.webp",
	},
	{
		id: "phase-walk",
		name: "Phase Walk",
		description: "Move through solid objects and creatures.",
		type: "mobility",
		style: "any",
		prerequisites: {
			level: 12,
			ability: "Constitution",
			score: 15,
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
				"Can move through solid objects and creatures as if they were difficult terrain.",
			secondary:
				"Take 1d10 force damage for every 5 feet moved through an object or creature.",
			tertiary: "Cannot attack while phasing through objects.",
		},
		mechanics: {
			movement: {
				type: "teleport",
				distance: 0,
			},
			condition: [
				"Action activation",
				"Timed duration",
				"Takes damage when phasing",
			],
		},
		limitations: {
			uses: "Once per long rest",
			cooldown: "Long rest",
		},
		flavor:
			"Denies the quiet space between breaths. An ancient roar of raw mana.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/phase-walk.webp",
	},
	{
		id: "leap-strike",
		name: "Leap Strike",
		description: "Jump incredible distances to strike distant foes.",
		type: "mobility",
		style: "weapon",
		prerequisites: {
			level: 6,
			ability: "Strength",
			score: 15,
		},
		activation: {
			type: "action",
		},
		effects: {
			primary: "Jump up to 60 feet horizontally or 30 feet vertically.",
			secondary: "Make one melee attack against a creature you land near.",
			tertiary:
				"If the attack hits, the target must make Strength saving throw or be knocked prone.",
		},
		mechanics: {
			movement: {
				type: "jump",
				distance: 60,
			},
			attack: {
				type: "melee",
				modifier: "Strength",
			},
			saving_throw: {
				ability: "Strength",
				dc: "8 + proficiency bonus + Strength modifier",
				success: "No effect",
				failure: "Knocked prone",
			},
		},
		limitations: {
			uses: "Twice per short rest",
			cooldown: "Short rest",
		},
		flavor:
			"Weaves the remnants of humanity. A relentless dance performed on the edge of a blade.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/leap-strike.webp",
	},
	{
		id: "shadow-bind",
		name: "Shadow Bind",
		description: "Use shadows to restrain and control enemies.",
		type: "utility",
		style: "any",
		prerequisites: {
			level: 8,
			ability: "Charisma",
			score: 15,
		},
		activation: {
			type: "action",
		},
		duration: {
			type: "concentration",
			time: "1 minute",
		},
		range: {
			type: "ranged",
			distance: 60,
		},
		effects: {
			primary:
				"Target must make Charisma saving throw or be restrained by shadow tendrils.",
			secondary:
				"While restrained, target cannot speak or cast spells with verbal components.",
			tertiary:
				"You can move the restrained target up to 10 feet as a bonus action.",
		},
		mechanics: {
			condition: ["restrained"],
			saving_throw: {
				ability: "Charisma",
				dc: "8 + proficiency bonus + Charisma modifier",
				success: "No effect",
				failure: "Restrained by shadow tendrils",
			},
		},
		limitations: {
			uses: "Once per short rest",
			cooldown: "Short rest",
			conditions: ["Requires shadows or dim light"],
		},
		flavor:
			"Absorbs the dimensional divide. A brutal testament to absolute power.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/shadow-bind.webp",
	},
	{
		id: "disarming-strike",
		name: "Disarming Strike",
		description: "A precise attack that disarms opponents.",
		type: "utility",
		style: "weapon",
		prerequisites: {
			level: 5,
			proficiency: ["Sword", "Dagger", "Rapier"],
		},
		activation: {
			type: "action",
		},
		effects: {
			primary: "Make a melee attack against a creature holding a weapon.",
			secondary:
				"If you hit, the creature must make Strength saving throw or drop its weapon.",
			tertiary: "You can catch the dropped weapon if you have a free hand.",
		},
		mechanics: {
			attack: {
				type: "melee",
				modifier: "Dexterity",
			},
			saving_throw: {
				ability: "Strength",
				dc: "8 + proficiency bonus + Dexterity modifier",
				success: "Keeps weapon",
				failure: "Drops weapon",
			},
		},
		limitations: {
			uses: "At-will",
			conditions: ["Target must be holding a weapon"],
		},
		flavor:
			"Weaves the quiet space between breaths. A relentless roar of raw mana.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/disarming-strike.webp",
	},
	{
		id: "trip-attack",
		name: "Trip Attack",
		description: "A sweeping attack that knocks enemies prone.",
		type: "utility",
		style: "weapon",
		prerequisites: {
			level: 4,
			proficiency: ["Spear", "Quarterstaff", "Whip"],
		},
		activation: {
			type: "action",
		},
		effects: {
			primary: "Make a melee attack against a creature.",
			secondary:
				"If you hit, the creature must make Dexterity saving throw or be knocked prone.",
			tertiary: "Prone creatures have disadvantage on their next attack roll.",
		},
		mechanics: {
			attack: {
				type: "melee",
				modifier: "Strength",
			},
			saving_throw: {
				ability: "Dexterity",
				dc: "8 + proficiency bonus + Strength modifier",
				success: "No effect",
				failure: "Knocked prone",
			},
		},
		limitations: {
			uses: "At-will",
			conditions: ["Target must be your size or smaller"],
		},
		flavor:
			"Absorbs the concept of defeat. A sorrowful dance performed on the edge of a blade.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/trip-attack.webp",
	},
	{
		id: "grappling-strike",
		name: "Grappling Strike",
		description: "A powerful attack that grabs and restrains enemies.",
		type: "utility",
		style: "unarmed",
		prerequisites: {
			level: 3,
			ability: "Strength",
			score: 13,
		},
		activation: {
			type: "action",
		},
		effects: {
			primary: "Make an unarmed strike against a creature.",
			secondary:
				"If you hit, the creature is grappilled and you can move it 10 feet.",
			tertiary:
				"Grappled creatures have disadvantage on attacks against creatures other than you.",
		},
		mechanics: {
			attack: {
				type: "melee",
				modifier: "Strength",
			},
			condition: ["grappled"],
		},
		limitations: {
			uses: "At-will",
			conditions: ["Target must be your size or smaller"],
		},
		flavor: "Commands the darkness within. A triumphant ultimate equalizer.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/grappling-strike.webp",
	},
	{
		id: "intimidating-presence",
		name: "Intimidating Presence",
		description: "Channel your inner power to frighten enemies.",
		type: "utility",
		style: "any",
		prerequisites: {
			level: 6,
			ability: "Charisma",
			score: 15,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "area",
			distance: 30,
		},
		effects: {
			primary:
				"Each creature of your choice within 30 feet must make Wisdom saving throw.",
			secondary: "On a failure, creatures are frightened of you for 1 minute.",
			tertiary: "Frightened creatures cannot willingly move closer to you.",
		},
		mechanics: {
			saving_throw: {
				ability: "Wisdom",
				dc: "8 + proficiency bonus + Charisma modifier",
				success: "No effect",
				failure: "Frightened for 1 minute",
			},
		},
		limitations: {
			uses: "3 times per long rest",
			cooldown: "Long rest",
		},
		flavor: "Reclaims the darkness within. A silent ultimate equalizer.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/intimidating-presence.webp",
	},
	{
		id: "shadow-termination",
		name: "Shadow Termination",
		description: "A devastating finishing move that strikes from the shadows.",
		type: "finishing",
		style: "weapon",
		prerequisites: {
			level: 15,
			ability: "Dexterity",
			score: 18,
			technique: ["Shadow Strike"],
		},
		activation: {
			type: "action",
			cost: "One attack action",
		},
		range: {
			type: "melee",
		},
		effects: {
			primary: "Attack with advantage and automatically score a critical hit.",
			secondary:
				"Critical hit deals maximum damage and the target must make Constitution saving throw or die.",
			tertiary:
				"If the target dies, you regain hit points equal to your level and can immediately use Shadow Step as a bonus action.",
		},
		mechanics: {
			attack: {
				type: "melee",
				modifier: "Dexterity",
			},
			saving_throw: {
				ability: "Constitution",
				dc: "8 + proficiency bonus + Dexterity modifier + 10",
				success: "Takes maximum damage",
				failure: "Dies",
			},
		},
		limitations: {
			uses: "Once per long rest",
			cooldown: "Long rest",
			conditions: [
				"Target must be below 50% hit points",
				"Requires dim light or darkness",
			],
		},
		flavor: "Reclaims the dimensional divide. A silent symphony of violence.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/shadow-termination.webp",
	},
	{
		id: "dragon-slaying-blow",
		name: "Dragon-Slaying Blow",
		description: "A legendary attack that can fell even the mightiest beasts.",
		type: "finishing",
		style: "two-handed",
		prerequisites: {
			level: 18,
			ability: "Strength",
			score: 20,
			technique: ["Whirlwind Strike"],
		},
		activation: {
			type: "action",
			cost: "One attack action",
		},
		range: {
			type: "melee",
		},
		effects: {
			primary: "Attack with advantage and deal triple damage.",
			secondary:
				"If the target is a dragon or similar creature, it must make Constitution saving throw or die.",
			tertiary:
				"If the target dies, you gain temporary hit points equal to its challenge rating times 10.",
		},
		mechanics: {
			attack: {
				type: "melee",
				modifier: "Strength",
				damage: "triple",
			},
			saving_throw: {
				ability: "Constitution",
				dc: "8 + proficiency bonus + Strength modifier + 15",
				success: "Takes triple damage",
				failure: "Dies",
			},
		},
		limitations: {
			uses: "Once per long rest",
			cooldown: "Long rest",
			conditions: ["Target must be a dragon or similar powerful creature"],
		},
		flavor: "Denies the dimensional divide. A brutal symphony of violence.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/dragon-slaying-blow.webp",
	},
	{
		id: "void-annihilation",
		name: "Void Annihilation",
		description: "An attack that tears through dimensions and reality itself.",
		type: "finishing",
		style: "weapon",
		prerequisites: {
			level: 20,
			ability: "Dexterity",
			score: 20,
			technique: ["Void Slash"],
		},
		activation: {
			type: "action",
			cost: "One attack action",
		},
		range: {
			type: "melee",
		},
		effects: {
			primary: "Attack ignores all defenses and deals maximum damage.",
			secondary:
				"Target must make Constitution saving throw with disadvantage or be annihilated.",
			tertiary:
				"If the target is annihilated, it cannot be revived by any means short of divine intervention.",
		},
		mechanics: {
			attack: {
				type: "melee",
				modifier: "Dexterity",
				damage: "maximum",
			},
			saving_throw: {
				ability: "Constitution",
				dc: "8 + proficiency bonus + Dexterity modifier + 20",
				success: "Takes maximum damage",
				failure: "Annihilated",
			},
		},
		limitations: {
			uses: "Once per lifetime",
			cooldown: "Never",
			conditions: ["Requires legendary weapon", "Must be at full health"],
		},
		flavor:
			"Reflects the fragile limits of flesh. A silent ultimate equalizer.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/void-annihilation.webp",
	},
	{
		id: "divine-execution",
		name: "Divine Execution",
		description:
			"The ultimate expression of radiant judgment—a strike imbued with so much purified essence that it can sever a corrupted soul from its body entirely.",
		type: "finishing",
		style: "weapon",
		prerequisites: {
			level: 17,
			class: "Herald",
			technique: ["Divine Smite"],
		},
		activation: {
			type: "action",
			cost: "One attack action",
		},
		range: {
			type: "melee",
		},
		effects: {
			primary: "Attack with advantage and add 8d8 radiant damage.",
			secondary:
				"If the target is an evil creature, it must make Constitution saving throw or die.",
			tertiary:
				"If the target dies, you and all allies within 30 feet gain temporary hit points equal to your herald level.",
		},
		mechanics: {
			attack: {
				type: "melee",
				modifier: "Strength",
				damage: "radiant",
			},
			saving_throw: {
				ability: "Constitution",
				dc: "8 + proficiency bonus + Charisma modifier + 10",
				success: "Takes extra radiant damage",
				failure: "Dies",
			},
		},
		limitations: {
			uses: "Once per long rest",
			cooldown: "Long rest",
			conditions: ["Target must be evil", "Requires holy weapon"],
		},
		flavor:
			"Reflects the remnants of humanity. An overwhelming dance performed on the edge of a blade.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/divine-execution.webp",
	},
	{
		id: "arcane-overload",
		name: "Arcane Overload",
		description:
			"Overload your spell matrices beyond their designed capacity, channeling catastrophic amounts of raw essence through a single devastating attack.",
		type: "finishing",
		style: "any",
		prerequisites: {
			level: 19,
			class: "Mage",
			technique: ["Arcane Recovery"],
		},
		activation: {
			type: "action",
			cost: "One attack action + spell slot",
		},
		effects: {
			primary:
				"Attack with advantage and add damage equal to 3d8 per spell slot level.",
			secondary:
				"Target must make Intelligence saving throw or be stunned until your next turn.",
			tertiary:
				"If the target is stunned, you can cast one spell as a bonus action without expending a spell slot.",
		},
		mechanics: {
			attack: {
				type: "melee",
				modifier: "Intelligence",
				damage: "magical",
			},
			saving_throw: {
				ability: "Intelligence",
				dc: "8 + proficiency bonus + Intelligence modifier + spell level",
				success: "Takes extra magical damage",
				failure: "Stunned until your next turn",
			},
		},
		limitations: {
			uses: "Once per long rest",
			cooldown: "Long rest",
			conditions: ["Must expend a spell slot", "Cannot be used with cantrips"],
		},
		flavor:
			"Weaves the concept of defeat. A relentless surge of lethal intent.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/arcane-overload.webp",
	},
	{
		id: "meteor-strike",
		name: "Meteor Strike",
		description:
			"A high-altitude lunging strike that impacts like a falling star.",
		type: "offensive",
		style: "any",
		prerequisites: {
			level: 11,
			ability: "Strength",
			score: 15,
		},
		activation: {
			type: "action",
			cost: "One attack action",
		},
		range: {
			type: "melee",
		},
		effects: {
			primary:
				"Leap up to 30 feet into the air and strike a target. Deals an additional 6d6 fire damage.",
			secondary:
				"All creatures within 10 feet of the target take 3d6 bludgeoning damage. Adaptive once learned.",
		},
		mechanics: {
			attack: {
				type: "melee",
				modifier: "Strength",
				damage: "fire/bludgeoning",
			},
		},
		limitations: {
			uses: "Once per short rest",
			cooldown: "Short rest",
		},
		flavor:
			"Overrides the fragile limits of flesh. A relentless ultimate equalizer.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/meteor-strike.webp",
	},
	{
		id: "phantom-step",
		name: "Phantom Step",
		description: "Briefly turn intangible while moving to avoid all obstacles.",
		type: "mobility",
		style: "any",
		prerequisites: {
			level: 9,
			ability: "Dexterity",
			score: 15,
		},
		activation: {
			type: "bonus-action",
		},
		effects: {
			primary:
				"Until the end of your turn, you can move through creatures and objects as if they were difficult terrain.",
			secondary:
				"You do not provoke opportunity attacks. Adaptive once learned.",
		},
		mechanics: {
			movement: {
				type: "step",
				distance: 0,
			},
		},
		limitations: {
			uses: "3 times per day",
			cooldown: "Long rest",
		},
		flavor:
			"Bends the flow of time itself. An absolute testament to absolute power.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/phantom-step.webp",
	},
	{
		id: "thousand-cuts",
		name: "Thousand Cuts",
		description: "A blur of strikes that targets every weak point in a second.",
		type: "finishing",
		style: "dual-wielding",
		prerequisites: {
			level: 17,
			ability: "Dexterity",
			score: 17,
			technique: ["Shadow Strike"],
		},
		activation: {
			type: "action",
			cost: "Full attack action",
		},
		range: {
			type: "melee",
		},
		effects: {
			primary:
				"Make 10 melee attacks against one target. Each hit deals 1d4 + Dex damage.",
			secondary:
				"Target is bleeding, taking 2d6 damage at start of turns. Adaptive once learned.",
		},
		mechanics: {
			attack: {
				type: "melee",
				modifier: "Dexterity",
				damage: "slashing",
			},
		},
		limitations: {
			uses: "Once per long rest",
			cooldown: "Long rest",
		},
		flavor:
			"Crushes the fragile limits of flesh. An intricate ultimate equalizer.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/thousand-cuts.webp",
	},
	{
		id: "absolute-defense",
		name: "Absolute Defense",
		description:
			"A perfect parry stance that deflects even magical projectiles.",
		type: "defensive",
		style: "shield",
		prerequisites: {
			level: 13,
			ability: "Strength",
			score: 15,
		},
		activation: {
			type: "reaction",
		},
		effects: {
			primary:
				"When hit by an attack (including spells), reduce the damage to 0.",
			secondary:
				"Reflect half the damage back at the attacker. Adaptive once learned.",
		},
		mechanics: {
			condition: ["Invulnerable for 1 trigger"],
		},
		limitations: {
			uses: "Twice per long rest",
			cooldown: "Long rest",
		},
		flavor:
			"Reclaims the flow of time itself. An overwhelming testament to absolute power.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/absolute-defense.webp",
	},
	{
		id: "gravity-bind",
		name: "Gravity Bind",
		description:
			"Increase the gravity around a target to pin them to the ground.",
		type: "utility",
		style: "any",
		prerequisites: {
			level: 7,
			ability: "Constitution",
			score: 13,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "area",
			distance: 30,
		},
		effects: {
			primary:
				"One creature must make a Strength save or be restrained and knocked prone.",
			secondary: "Fly speed is reduced to 0. Adaptive once learned via Rune.",
		},
		mechanics: {
			saving_throw: {
				ability: "Strength",
				dc: "10 + level",
				success: "Half speed",
				failure: "Restrained",
			},
		},
		limitations: {
			uses: "3 times per day",
			cooldown: "Long rest",
		},
		flavor: "Crushes the darkness within. An intricate ultimate equalizer.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/gravity-bind.webp",
	},
	{
		id: "sonic-boom",
		name: "Sonic Boom",
		description:
			"A strike so fast it breaks the sound barrier, creating a concussive wave.",
		type: "offensive",
		style: "unarmed",
		prerequisites: {
			level: 5,
			ability: "Strength",
			score: 13,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "area",
			distance: 15,
		},
		effects: {
			primary: "Creatures in a 15ft cone take 3d8 thunder damage.",
			secondary:
				"Targets must make a Con save or be deafened and pushed 10ft. Adaptive once learned.",
		},
		mechanics: {
			attack: {
				type: "melee",
				modifier: "Strength",
				damage: "thunder",
			},
		},
		limitations: {
			uses: "At-will",
		},
		flavor: "Absorbs the flow of time itself. A brutal symphony of violence.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/sonic-boom.webp",
	},
	{
		id: "infinite-riposte",
		name: "Infinite Riposte",
		description:
			"Enter a trance where every incoming attack is met with a counter.",
		type: "defensive",
		style: "weapon",
		prerequisites: {
			level: 15,
			ability: "Dexterity",
			score: 15,
		},
		activation: {
			type: "bonus-action",
		},
		duration: {
			type: "timed",
			time: "1 round",
		},
		effects: {
			primary:
				"Gain unlimited reactions for the purpose of making opportunity attacks or parries until your next turn.",
			secondary: "Adaptive once learned via Rune.",
		},
		mechanics: {
			condition: ["unlimited reactions"],
		},
		limitations: {
			uses: "Once per long rest",
			cooldown: "Long rest",
		},
		flavor:
			"Cleanses the fragile limits of flesh. A subtle ultimate equalizer.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/infinite-riposte.webp",
	},
	{
		id: "dragon-ascent",
		name: "Dragon Ascent",
		description:
			"A vertical spiraling jump that slices everything in its path.",
		type: "mobility",
		style: "weapon",
		prerequisites: {
			level: 11,
			ability: "Strength",
			score: 15,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "self",
		},
		effects: {
			primary:
				"Jump 30ft vertically. All creatures within 5ft of your path take weapon damage.",
			secondary:
				"Safe landing: you take no falling damage this turn. Adaptive once learned.",
		},
		mechanics: {
			movement: {
				type: "jump",
				distance: 30,
			},
		},
		limitations: {
			uses: "Twice per short rest",
			cooldown: "Short rest",
		},
		flavor:
			"Cleanses the flow of time itself. An intricate symphony of violence.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/dragon-ascent.webp",
	},
	{
		id: "nerve-strike",
		name: "Nerve Strike",
		description: "A precision strike to the target's central nervous system.",
		type: "utility",
		style: "unarmed",
		prerequisites: {
			level: 7,
			ability: "Dexterity",
			score: 13,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "melee",
		},
		effects: {
			primary:
				"Target must make a Constitution save or be paralyzed until the end of your next turn.",
			secondary: "Adaptive once learned via Rune.",
		},
		mechanics: {
			saving_throw: {
				ability: "Constitution",
				dc: "8 + prof + Dex",
				success: "No effect",
				failure: "Paralyzed",
			},
		},
		limitations: {
			uses: "Once per short rest",
			cooldown: "Short rest",
		},
		flavor:
			"Commands all who stand in opposition. A triumphant whisper in the shadows.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/nerve-strike.webp",
	},
	{
		id: "bladeshim-storm",
		name: "Bladeshim Storm",
		description: "Release a flurry of essence-blades from your weapon.",
		type: "offensive",
		style: "weapon",
		prerequisites: {
			level: 9,
			ability: "Dexterity",
			score: 15,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "area",
			distance: 30,
		},
		effects: {
			primary:
				"Creatures in a 30ft radius must make a Dex save or take 5d10 force damage.",
			secondary: "Adaptive once learned via Rune.",
		},
		mechanics: {
			attack: {
				type: "ranged",
				modifier: "Dexterity",
				damage: "force",
			},
		},
		limitations: {
			uses: "Once per short rest",
			cooldown: "Short rest",
		},
		flavor:
			"Absorbs the concept of defeat. An ancient dance performed on the edge of a blade.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/bladeshim-storm.webp",
	},
	{
		id: "immovable-object",
		name: "Immovable Object",
		description:
			"Root yourself in reality, becoming impossible to move or knock down.",
		type: "defensive",
		style: "any",
		prerequisites: {
			level: 5,
			ability: "Constitution",
			score: 13,
		},
		activation: {
			type: "bonus-action",
		},
		duration: {
			type: "concentration",
			time: "1 minute",
		},
		effects: {
			primary: "Gain advantage on all Strength and Constitution saves.",
			secondary: "Cannot be moved or knocked prone. Adaptive once learned.",
		},
		mechanics: {
			condition: ["advantage on Str/Con saves", "immovable"],
		},
		limitations: {
			uses: "3 times per day",
			cooldown: "Long rest",
		},
		flavor:
			"Shatters the fragile limits of flesh. A brutal ultimate equalizer.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/immovable-object.webp",
	},
	{
		id: "echo-step",
		name: "Echo Step",
		description: "Move so quickly you leave afterimages that distract foes.",
		type: "mobility",
		style: "any",
		prerequisites: {
			level: 3,
			ability: "Dexterity",
			score: 13,
		},
		activation: {
			type: "bonus-action",
		},
		effects: {
			primary:
				"Until the start of your next turn, attacks against you have disadvantage.",
			secondary: "You can move an extra 10ft this turn. Adaptive once learned.",
		},
		mechanics: {
			movement: {
				type: "step",
				distance: 10,
			},
			condition: ["disadvantage on incoming attacks"],
		},
		limitations: {
			uses: "At-will",
		},
		flavor: "Denies the flow of time itself. A brutal symphony of violence.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/echo-step.webp",
	},
	{
		id: "vortex-pull",
		name: "Vortex Pull",
		description:
			"Spin your weapon to create a vacuum that pulls enemies closer.",
		type: "utility",
		style: "two-handed",
		prerequisites: {
			level: 7,
			ability: "Strength",
			score: 13,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "area",
			distance: 20,
		},
		effects: {
			primary:
				"Creatures within 20ft must make a Strength save or be pulled adjacent to you.",
			secondary: "Adaptive once learned via Rune.",
		},
		mechanics: {
			saving_throw: {
				ability: "Strength",
				dc: "8 + prof + Str",
				success: "No effect",
				failure: "Pulled",
			},
		},
		limitations: {
			uses: "At-will",
		},
		flavor:
			"Bends all who stand in opposition. An absolute beautiful catastrophe.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/vortex-pull.webp",
	},
	{
		id: "blood-tithe",
		name: "Blood Tithe",
		description: "Empower your strike by sacrificing your own life force.",
		type: "offensive",
		style: "any",
		prerequisites: {
			level: 5,
			ability: "Constitution",
			score: 13,
		},
		activation: {
			type: "free",
		},
		effects: {
			primary:
				"Expend any number of Hit Dice. Add double the total to your next damage roll.",
			secondary: "Adaptive once learned via Rune.",
		},
		mechanics: {
			attack: {
				type: "melee",
				damage: "variable",
			},
		},
		limitations: {
			uses: "Once per turn",
		},
		flavor:
			"Absorbs the flow of time itself. An ancient testament to absolute power.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/blood-tithe.webp",
	},
	{
		id: "quaking-stomp",
		name: "Quaking Stomp",
		description: "Strike the ground to create a localized earthquake.",
		type: "utility",
		style: "any",
		prerequisites: {
			level: 9,
			ability: "Strength",
			score: 15,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "area",
			distance: 20,
		},
		effects: {
			primary:
				"Creatures in a 20ft radius must make a Dex save or take 4d8 bludgeoning and be knocked prone.",
			secondary: "Area becomes difficult terrain. Adaptive once learned.",
		},
		mechanics: {
			attack: {
				type: "melee",
				modifier: "Strength",
				damage: "bludgeoning",
			},
		},
		limitations: {
			uses: "3 times per day",
			cooldown: "Long rest",
		},
		flavor:
			"Commands the arrogant and the mighty. A desperate beautiful catastrophe.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/quaking-stomp.webp",
	},
	{
		id: "blade-dance",
		name: "Blade Dance",
		description:
			"Enter a shifting flow of motion that enhances both offense and defense.",
		type: "defensive",
		style: "any",
		prerequisites: {
			level: 13,
			ability: "Dexterity",
			score: 15,
		},
		activation: {
			type: "bonus-action",
		},
		duration: {
			type: "concentration",
			time: "1 minute",
		},
		effects: {
			primary: "Gain +2 AC and your movement speed increases by 20ft.",
			secondary:
				"You can make one additional melee attack as a bonus action. Adaptive once learned.",
		},
		mechanics: {
			condition: ["+2 AC"],
			movement: {
				type: "step",
				distance: 20,
			},
		},
		limitations: {
			uses: "Once per short rest",
			cooldown: "Short rest",
		},
		flavor:
			"Destroys the concept of defeat. A sorrowful surge of lethal intent.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/blade-dance.webp",
	},
	{
		id: "grand-slam",
		name: "Grand Slam",
		description: "A horizontal swing that sends enemies flying.",
		type: "offensive",
		style: "two-handed",
		prerequisites: {
			level: 11,
			ability: "Strength",
			score: 15,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "melee",
		},
		effects: {
			primary: "Strike one target. If hit, they are pushed 30ft away.",
			secondary:
				"If they strike a wall, they take an additional 3d6 bludgeoning damage. Adaptive once learned.",
		},
		mechanics: {
			attack: {
				type: "melee",
				modifier: "Strength",
				damage: "bludgeoning",
			},
		},
		limitations: {
			uses: "At-will",
		},
		flavor:
			"Crushes the remnants of humanity. A desperate surge of lethal intent.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/grand-slam.webp",
	},
	{
		id: "sky-piercer",
		name: "Sky Piercer",
		description:
			"A precision thrust that targets the soul as much as the body.",
		type: "offensive",
		style: "weapon",
		prerequisites: {
			level: 15,
			ability: "Dexterity",
			score: 15,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "melee",
		},
		effects: {
			primary: "Strike a target. Attack ignores all damage resistance.",
			secondary:
				"Target loses one unexpended Action or Bonus Action from their next turn. Adaptive once learned.",
		},
		mechanics: {
			attack: {
				type: "melee",
				modifier: "Dexterity",
				damage: "piercing",
			},
		},
		limitations: {
			uses: "Once per short rest",
			cooldown: "Short rest",
		},
		flavor:
			"Shatters the dimensional divide. A brutal testament to absolute power.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/sky-piercer.webp",
	},
	{
		id: "unbreakable-will",
		name: "Unbreakable Will",
		description:
			"Instantly shake off mental control and debuffs through sheer grit.",
		type: "utility",
		style: "any",
		prerequisites: {
			level: 5,
			ability: "Constitution",
			score: 13,
		},
		activation: {
			type: "reaction",
		},
		effects: {
			primary:
				"End one condition currently affecting you: Charmed, Frightened, or Stunned.",
			secondary: "Adaptive once learned via Rune.",
		},
		mechanics: {
			condition: ["remove mental debuff"],
		},
		limitations: {
			uses: "Once per short rest",
			cooldown: "Short rest",
		},
		flavor:
			"Overrides the concept of defeat. A relentless dance performed on the edge of a blade.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/unbreakable-will.webp",
	},
	{
		id: "finishing-blast",
		name: "Final Reckoning",
		description:
			"Channel every remaining bit of energy into one final catastrophic blow.",
		type: "finishing",
		style: "any",
		prerequisites: {
			level: 20,
			ability: "Strength",
			score: 17,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "melee",
		},
		effects: {
			primary: "Deal 10d10 + Str + Dex + Int damage.",
			secondary:
				"You take 2 levels of exhaustion. Adaptive once learned via Rune.",
		},
		mechanics: {
			attack: {
				type: "melee",
				modifier: "Str/Dex/Int",
				damage: "untyped",
			},
		},
		limitations: {
			uses: "Once per day",
			cooldown: "Long rest",
		},
		flavor: "Reclaims the architect's design. A silent roar of raw mana.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/final-reckoning.webp",
	},
	{
		id: "dimensional-step",
		name: "Dimensional Step",
		description:
			"A series of micro-teleports that make your movement unpredictable.",
		type: "mobility",
		style: "any",
		prerequisites: {
			level: 5,
			ability: "Dexterity",
			score: 13,
		},
		activation: {
			type: "free",
		},
		effects: {
			primary:
				"When you move, you can teleport between any 5ft squares of your movement path.",
			secondary:
				"You are immune to opportunity attacks during this movement. Adaptive once learned.",
		},
		mechanics: {
			movement: {
				type: "teleport",
				distance: 0,
			},
		},
		limitations: {
			uses: "At-will",
		},
		flavor:
			"Commands the concept of defeat. A desperate surge of lethal intent.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/dimensional-step.webp",
	},
	{
		id: "execute",
		name: "Execution Strike",
		description: "A cold, calculated strike that finishes off a weakened foe.",
		type: "finishing",
		style: "weapon",
		prerequisites: {
			level: 9,
			ability: "Strength",
			score: 13,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "melee",
		},
		effects: {
			primary:
				"If the target is below 25% health, they must make a Constitution save or be reduced to 0 HP.",
			secondary:
				"On success, they take 10d10 additional weapon damage. Adaptive once learned.",
		},
		mechanics: {
			attack: {
				type: "melee",
				modifier: "Strength",
				damage: "lethal",
			},
			saving_throw: {
				ability: "Constitution",
				dc: "15 + prof",
				success: "takes damage",
				failure: "death",
			},
		},
		limitations: {
			uses: "Once per turn",
		},
		flavor:
			"Ignites the concept of defeat. A triumphant dance performed on the edge of a blade.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/execute.webp",
	},
	{
		id: "iron-wall-stance",
		name: "Iron Wall Stance",
		description:
			"An absolute defensive posture that negates all frontal attacks.",
		type: "defensive",
		style: "shield",
		prerequisites: {
			level: 7,
			ability: "Strength",
			score: 15,
		},
		activation: {
			type: "bonus-action",
		},
		range: {
			type: "self",
		},
		effects: {
			primary:
				"You gain total cover from the front. Any melee attacker that hits you takes 2d6 bludgeoning damage from the impact.",
			secondary: "Your movement is reduced to 5ft.",
		},
		mechanics: {
			condition: ["Total Cover", "Slowed"],
		},
		limitations: {
			uses: "Concentration",
		},
		flavor:
			"Cleanses the concept of defeat. A subtle dance performed on the edge of a blade.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/iron-wall.webp",
	},
	{
		id: "whirlwind-slash",
		name: "Whirlwind Slash",
		description: "Spin with your weapon to strike all nearby enemies.",
		type: "offensive",
		style: "any",
		prerequisites: {
			level: 5,
			ability: "Strength",
			score: 13,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "area",
			distance: 10,
		},
		effects: {
			primary:
				"All creatures within 10ft must make a Dex save or take weapon damage + 2d8.",
			secondary: "Adaptive DC.",
		},
		mechanics: {
			attack: {
				type: "melee",
				modifier: "Strength",
				damage: "weapon+2d8",
			},
		},
		limitations: {
			uses: "At-will",
		},
		flavor: "Absorbs the architect's design. A brutal death of hesitation.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/whirlwind.webp",
	},
	{
		id: "zen-archery",
		name: "Zen Archery",
		description: "Close your eyes and let your intuition guide the arrow.",
		type: "offensive",
		style: "ranged",
		prerequisites: {
			level: 9,
			ability: "Wisdom",
			score: 15,
		},
		activation: {
			type: "bonus-action",
		},
		range: {
			type: "ranged",
		},
		effects: {
			primary: "Your next ranged attack ignores cover and has advantage.",
			secondary:
				"You can use Wisdom instead of Dexterity for the attack and damage.",
		},
		mechanics: {
			attack: {
				type: "ranged",
				modifier: "Wisdom",
				damage: "weapon",
			},
		},
		limitations: {
			uses: "Once per short rest",
		},
		flavor: "Ignores the architect's design. An absolute death of hesitation.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/zen-archery.webp",
	},
	{
		id: "disarming-flourish",
		name: "Disarming Flourish",
		description:
			"A flashy maneuver designed to strip an enemy of their weapon.",
		type: "utility",
		style: "any",
		prerequisites: {
			level: 3,
			ability: "Dexterity",
			score: 14,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "melee",
		},
		effects: {
			primary:
				"On a hit, the target must make a Strength save or drop one item they are holding.",
			secondary: "You can use a reaction to catch the item.",
		},
		mechanics: {
			saving_throw: {
				ability: "Strength",
				dc: "13 + prof",
				success: "holds item",
				failure: "drops item",
			},
		},
		limitations: {
			uses: "At-will",
		},
		flavor:
			"Overrides the quiet space between breaths. A relentless death of hesitation.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/disarm.webp",
	},
	{
		id: "fist-of-the-north-star",
		name: "Seven Star Strike",
		description: "Strike seven vital pressure points in rapid succession.",
		type: "offensive",
		style: "unarmed",
		prerequisites: {
			level: 15,
			ability: "Wisdom",
			score: 18,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "melee",
		},
		effects: {
			primary: "Target takes 10d6 internal damage and is stunned for 1 minute.",
			secondary: "If the target dies, they explode in a 10ft radius.",
		},
		mechanics: {
			attack: {
				type: "melee",
				modifier: "Wisdom",
				damage: "10d6",
			},
			condition: ["Stunned"],
		},
		limitations: {
			uses: "Once per long rest",
		},
		flavor:
			"Reflects the quiet space between breaths. An overwhelming death of hesitation.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/seven-star.webp",
	},
	{
		id: "dragons-tail-sweep",
		name: "Dragon's Tail Sweep",
		description: "A low, powerful kick that clears the area.",
		type: "offensive",
		style: "unarmed",
		prerequisites: {
			level: 4,
			ability: "Strength",
			score: 14,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "area",
			distance: 5,
		},
		effects: {
			primary:
				"All adjacent creatures must make a Dex save or take 3d8 bludgeoning and be knocked prone.",
			secondary: "Adaptive DC.",
		},
		mechanics: {
			attack: {
				type: "melee",
				modifier: "Dex/Str",
				damage: "3d8",
			},
		},
		limitations: {
			uses: "At-will",
		},
		flavor:
			"Overrides the fragile limits of flesh. A devastating ultimate equalizer.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/sweep.webp",
	},
	{
		id: "heavenly-piercing-arrow",
		name: "Heaven-Piercer",
		description: "A shot that travels through multiple enemies and structures.",
		type: "offensive",
		style: "ranged",
		prerequisites: {
			level: 12,
			ability: "Dexterity",
			score: 18,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "ranged",
			distance: 600,
		},
		effects: {
			primary:
				"A 5ft wide line 600ft long. All targets take weapon damage + 5d10 piercing.",
			secondary:
				"Ignores all cover and can penetrate up to 10ft of solid stone.",
		},
		mechanics: {
			attack: {
				type: "ranged",
				modifier: "Dexterity",
				damage: "weapon+5d10",
			},
		},
		limitations: {
			uses: "Once per short rest",
		},
		flavor: "Shatters the flow of time itself. A chaotic symphony of violence.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/piercer.webp",
	},
	{
		id: "mirror-shield-parry",
		name: "Mirror Parry",
		description: "Reflect a magical or physical projectile back at the sender.",
		type: "defensive",
		style: "shield",
		prerequisites: {
			level: 8,
			ability: "Dexterity",
			score: 15,
		},
		activation: {
			type: "reaction",
		},
		range: {
			type: "self",
		},
		effects: {
			primary:
				"Reduce damage from a ranged attack to 0. You can then make a ranged attack with the same project back at the attacker.",
			secondary: "Works against spells like Magic Missile or Firebolt.",
		},
		mechanics: {
			condition: ["Damage Negation"],
		},
		limitations: {
			uses: "3 times per short rest",
		},
		flavor:
			"Commands the flow of time itself. A desperate symphony of violence.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/mirror-parry.webp",
	},
	{
		id: "vipers-kiss",
		name: "Viper's Kiss",
		description: "A quick, poisoned strike that numbs the target.",
		type: "offensive",
		style: "any",
		prerequisites: {
			level: 2,
			ability: "Dexterity",
			score: 13,
		},
		activation: {
			type: "bonus-action",
		},
		range: {
			type: "melee",
		},
		effects: {
			primary:
				"Target takes 1d6 poison damage and has disadvantage on their next attack.",
			secondary: "If hidden, the damage increases to 3d6.",
		},
		mechanics: {
			attack: {
				type: "melee",
				modifier: "Dexterity",
				damage: "1d6 poison",
			},
		},
		limitations: {
			uses: "Once per turn",
		},
		flavor:
			"Overrides the remnants of humanity. A silent surge of lethal intent.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/viper.webp",
	},
	{
		id: "mountain-breaker",
		name: "Mountain Breaker",
		description: "Concentrate all your mass into a single, devastating punch.",
		type: "offensive",
		style: "unarmed",
		prerequisites: {
			level: 10,
			ability: "Strength",
			score: 16,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "melee",
		},
		effects: {
			primary: "Deal 6d12 bludgeoning damage. Target is knocked back 30ft.",
			secondary: "Destroys non-magical objects and structures instantly.",
		},
		mechanics: {
			attack: {
				type: "melee",
				modifier: "Strength",
				damage: "6d12",
			},
		},
		limitations: {
			uses: "Once per short rest",
		},
		flavor:
			"Commands the darkness within. A desperate breaking point of the world.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/breaker.webp",
	},
	{
		id: "blade-storm",
		name: "Blade Storm",
		description: "Throw a dozen knives at once in a lethal arc.",
		type: "offensive",
		style: "ranged",
		prerequisites: {
			level: 11,
			ability: "Dexterity",
			score: 17,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "area",
			distance: 30,
		},
		effects: {
			primary:
				"All targets in a 30ft cone take 6d4 piercing damage. Dex save for half.",
			secondary: "Adaptive DC.",
		},
		mechanics: {
			attack: {
				type: "ranged",
				modifier: "Dexterity",
				damage: "6d4",
			},
		},
		limitations: {
			uses: "Once per short rest",
		},
		flavor: "Destroys the architect's design. A desperate roar of raw mana.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/blade-storm.webp",
	},
	{
		id: "guardians-rebuke",
		name: "Guardian's Rebuke",
		description: "When an ally is hit, you make a sudden retaliatory strike.",
		type: "defensive",
		style: "any",
		prerequisites: {
			level: 4,
			ability: "Strength",
			score: 14,
		},
		activation: {
			type: "reaction",
		},
		range: {
			type: "melee",
		},
		effects: {
			primary:
				"If an ally within 5ft is hit, you make a melee attack against the attacker with advantage.",
			secondary:
				"The damage from the attack is reduced by your proficiency bonus.",
		},
		mechanics: {
			attack: {
				type: "melee",
				modifier: "Str/Dex",
				damage: "weapon",
			},
		},
		limitations: {
			uses: "Once per turn",
		},
		flavor:
			"Overrides the fragile limits of flesh. A devastating breaking point of the world.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/rebuke.webp",
	},
	{
		id: "gravity-stomp",
		name: "Gravity Stomp",
		description: "Stomp the ground to create a localized heavy gravity zone.",
		type: "utility",
		style: "any",
		prerequisites: {
			level: 9,
			ability: "Strength",
			score: 16,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "area",
			distance: 15,
		},
		effects: {
			primary:
				"15ft radius becomes difficult terrain. Moving through it costs 4x movement.",
			secondary: "Duration: 1 minute.",
		},
		mechanics: {
			condition: ["Difficult Terrain"],
		},
		limitations: {
			uses: "Once per short rest",
		},
		flavor:
			"Ignites the flow of time itself. A sorrowful testament to absolute power.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/stomp.webp",
	},
	{
		id: "eagles-eye",
		name: "Eagle's Eye",
		description: "A heightened state of awareness for sniper shots.",
		type: "utility",
		style: "ranged",
		prerequisites: {
			level: 5,
			ability: "Wisdom",
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
				"You can see clearly up to 2 miles and ignore disadvantage from long range.",
			secondary: "You gain a +5 bonus to your next ranged attack roll.",
		},
		mechanics: {
			condition: ["Enhanced Sight"],
		},
		limitations: {
			uses: "Short rest",
		},
		flavor:
			"Crushes all who stand in opposition. A desperate beautiful catastrophe.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/eagle-eye.webp",
	},
	{
		id: "dragon-claw-rend",
		name: "Dragon Claw Rend",
		description: "Tear through the toughest defenses with overwhelming force.",
		type: "offensive",
		style: "unarmed",
		prerequisites: {
			level: 14,
			ability: "Strength",
			score: 20,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "melee",
		},
		effects: {
			primary:
				"Deal 8d8 slashing damage. This attack ignores all resistances and treats immunity as resistance.",
			secondary:
				"The target must make a Con save or have their AC reduced by 4 permanently.",
		},
		mechanics: {
			attack: {
				type: "melee",
				modifier: "Strength",
				damage: "8d8",
			},
		},
		limitations: {
			uses: "Once per long rest",
		},
		flavor:
			"Destroys the arrogant and the mighty. A desperate whisper in the shadows.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/rend.webp",
	},
	{
		id: "temporal-feint",
		name: "Temporal Feint",
		description: "Start an attack in one timeline, finish it in another.",
		type: "offensive",
		style: "any",
		prerequisites: {
			level: 16,
			ability: "Intelligence",
			score: 15,
		},
		activation: {
			type: "free",
		},
		range: {
			type: "melee",
		},
		effects: {
			primary:
				"If your attack misses, you can instantly retry it with advantage as a 'temporal correction'.",
			secondary: "Target must make a Wisdom save or be 'Confused' for 1 turn.",
		},
		mechanics: {
			condition: ["Advantage", "Confused"],
		},
		limitations: {
			uses: "Once per turn",
		},
		flavor:
			"Destroys the remnants of humanity. A triumphant dance performed on the edge of a blade.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/feint.webp",
	},
	{
		id: "titan-slam",
		name: "Titan Slam",
		description: "Drop from a height to crush everyone below.",
		type: "offensive",
		style: "any",
		prerequisites: {
			level: 8,
			ability: "Strength",
			score: 16,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "area",
			distance: 15,
		},
		effects: {
			primary:
				"Requires falling at least 20ft. Deal 1d6 per 10ft fallen to all creatures in 15ft radius.",
			secondary: "You take no falling damage yourself. Adaptive.",
		},
		mechanics: {
			attack: {
				type: "melee",
				modifier: "Strength",
				damage: "1d6/10ft",
			},
		},
		limitations: {
			uses: "At-will",
		},
		flavor: "Absorbs the flow of time itself. A brutal symphony of violence.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/slam.webp",
	},
	{
		id: "ice-path-skate",
		name: "Frost Runner",
		description:
			"Create a path of ice under your feet to glide across terrain.",
		type: "mobility",
		style: "any",
		prerequisites: {
			level: 3,
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
				"You gain +20ft movement and can move across water or thin air (max 10ft high).",
			secondary: "Path melts after 1 round.",
		},
		mechanics: {
			movement: {
				type: "step",
				distance: 20,
			},
		},
		limitations: {
			uses: "At-will",
		},
		flavor: "Bends the dimensional divide. A subtle symphony of violence.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/skate.webp",
	},
	{
		id: "venom-spray-technique",
		name: "Venom Spray",
		description: "A specialized delivery of poison in a fine mist.",
		type: "offensive",
		style: "any",
		prerequisites: {
			level: 4,
			ability: "Dexterity",
			score: 14,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "area",
			distance: 15,
		},
		effects: {
			primary:
				"15ft cone of toxic gas. Targets must make a Con save or be 'Poisoned' for 1 minute.",
			secondary: "Deals 2d8 poison damage immediately. Adaptive DC.",
		},
		mechanics: {
			attack: {
				type: "ranged",
				modifier: "Dexterity",
				damage: "2d8",
			},
		},
		limitations: {
			uses: "3 times per day",
		},
		flavor:
			"Weaves the dimensional divide. A subtle testament to absolute power.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/spray.webp",
	},
	{
		id: "blood-boil-strike",
		name: "Blood-Boil Strike",
		description:
			"Deliver a hit that causes the target's internal temperature to skyrocket.",
		type: "offensive",
		style: "any",
		prerequisites: {
			level: 12,
			ability: "Constitution",
			score: 17,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "melee",
		},
		effects: {
			primary:
				"Target takes 6d10 fire damage and has disadvantage on all checks due to intense pain.",
			secondary:
				"Target must make a Con save or take 2d10 fire damage at the start of each turn for 1 minute.",
		},
		mechanics: {
			attack: {
				type: "melee",
				modifier: "Constitution",
				damage: "6d10",
			},
		},
		limitations: {
			uses: "Once per day",
		},
		flavor: "Shatters the darkness within. An overwhelming ultimate equalizer.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/blood-boil.webp",
	},
	{
		id: "celestial-step-technique",
		name: "Celestial Step",
		description: "Move between the gaps in the system's code.",
		type: "mobility",
		style: "any",
		prerequisites: {
			level: 18,
			ability: "Wisdom",
			score: 18,
		},
		activation: {
			type: "bonus-action",
		},
		range: {
			type: "self",
		},
		effects: {
			primary:
				"You can teleport anywhere within 120ft that you have seen before.",
			secondary: "You can take one other creature with you. Adaptive.",
		},
		mechanics: {
			movement: {
				type: "teleport",
				distance: 120,
			},
		},
		limitations: {
			uses: "3 times per long rest",
		},
		flavor:
			"Shatters the arrogant and the mighty. A chaotic whisper in the shadows.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/celestial-step.webp",
	},
	{
		id: "infinity-slash",
		name: "Infinity Slash",
		description: "A strike that exists in infinite variations simultaneously.",
		type: "finishing",
		style: "weapon",
		prerequisites: {
			level: 20,
			ability: "Strength",
			score: 20,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "melee",
		},
		effects: {
			primary:
				"Deal 100 untyped damage. This damage cannot be reduced, reflected, or avoided.",
			secondary:
				"Target is deleted from the current instance (cannot be revived for 24 hours).",
		},
		mechanics: {
			attack: {
				type: "melee",
				modifier: "System",
				damage: "100",
			},
		},
		limitations: {
			uses: "Once per week",
		},
		flavor:
			"Absorbs the concept of defeat. A sorrowful dance performed on the edge of a blade.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/infinity-slash.webp",
	},
	{
		id: "bone-breaker-lock",
		name: "Bone Breaker",
		description: "A grappling technique that snaps limbs.",
		type: "utility",
		style: "unarmed",
		prerequisites: {
			level: 5,
			ability: "Strength",
			score: 16,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "melee",
		},
		effects: {
			primary:
				"If target is grappled, you deal 4d10 damage and reduce their movement by 15ft permanently (until magically healed).",
			secondary: "Adaptive DC.",
		},
		mechanics: {
			attack: {
				type: "melee",
				modifier: "Strength",
				damage: "4d10",
			},
		},
		limitations: {
			uses: "At-will",
		},
		flavor: "Reflects the architect's design. A chaotic death of hesitation.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/bone-breaker.webp",
	},
	{
		id: "gale-force-kick",
		name: "Gale-Force Kick",
		description: "A fast kick that creates a blast of wind.",
		type: "offensive",
		style: "unarmed",
		prerequisites: {
			level: 4,
			ability: "Dexterity",
			score: 14,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "melee",
		},
		effects: {
			primary: "Deal 2d8 bludgeoning damage and push the target 15ft away.",
			secondary: "Adaptive push distance.",
		},
		mechanics: {
			attack: {
				type: "melee",
				modifier: "Dexterity",
				damage: "2d8",
			},
		},
		limitations: {
			uses: "At-will",
		},
		flavor:
			"Ignites the quiet space between breaths. A sorrowful death of hesitation.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/gale-kick.webp",
	},
	{
		id: "void-touch-manual",
		name: "Void Touch",
		description: "A technique that leaves a mark of the void on an enemy.",
		type: "offensive",
		style: "any",
		prerequisites: {
			level: 10,
			ability: "Intelligence",
			score: 15,
		},
		activation: {
			type: "action",
		},
		range: {
			type: "melee",
		},
		effects: {
			primary: "Target takes 5d6 void damage and is 'Silenced' for 2 rounds.",
			secondary: "Target cannot be healed while silenced. Adaptive.",
		},
		mechanics: {
			attack: {
				type: "melee",
				modifier: "Int/Dex",
				damage: "5d6",
			},
			condition: ["Silenced"],
		},
		limitations: {
			uses: "Once per short rest",
		},
		flavor:
			"Bends the fragile limits of flesh. An intricate ultimate equalizer.",
		source: "System Ascendant Canon",
		image: "/generated/compendium/techniques/void-touch.webp",
	},
];
