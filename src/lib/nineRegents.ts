/**
 * THE NINE REGENTS
 * S-Rank powers unlocked through gate trials
 *
 * NAMING CONVENTION:
 * - Regent = Individual cosmic power (e.g., "Shadow Regent")
 * - Sovereign = Gemini fusion result (e.g., "Destroyer + Shadow Regent + Dragon Regent = Abyssal Tyrant Sovereign")
 *
 * DESIGN PRINCIPLE: Regents are DISTINCT from Jobs
 * Jobs focus on combat roles/tactics. Regents grant cosmic/reality-warping powers.
 *
 * JOB THEMES TO AVOID:
 * - Destroyer: Physical combat, strength, durability (DO NOT MAKE: strength-buff regent)
 * - Berserker: Rage, overload, raw power (DO NOT MAKE: berserk regent)
 * - Assassin: Stealth, precision, phase (DO NOT MAKE: stealth regent - Shadow Regent is necromancy)
 * - Mage: Elemental spells, arcane knowledge (DO NOT MAKE: generic mage regent)
 * - Technomancer: Tech + magic fusion (DO NOT MAKE: tech regent)
 * - Summoner: Creature summoning, pacts (Regents can summon but DIFFERENT theme)
 * - Holy Knight: Paladin abilities, smites (DO NOT MAKE: paladin regent - Radiant is purification fire)
 * - Stalker: Tracking, survival, ranger (DO NOT MAKE: ranger regent)
 * - Herald: Divine magic, healing, support (DO NOT MAKE: cleric regent)
 * - Esper: Psionics, mental powers, illusions (DO NOT MAKE: mind control regent)
 * - Revenant: Death magic, life drain (Shadow Regent is army of dead, NOT life drain)
 * - Contractor: Pacts, demons, deals (DO NOT MAKE: warlock regent)
 * - Striker: Speed, martial arts, combos (DO NOT MAKE: speed regent)
 * - Idol: Performance, inspiration, charm (Radiant is holy fire, NOT charm)
 *
 * Quest-gated, NOT level-gated (DM/Protocol Warden approval required)
 */

import { type RegentPath, RegentType } from "./regentTypes";

export const NINE_REGENTS: RegentPath[] = [
	// 1. SHADOW REGENT (Shadow Regent - Ashborn)
	// COSMIC THEME: Death, necromancy, shadow army, dimensional shadow storage
	// DISTINCT FROM: Assassin (stealth/precision), Revenant (life drain), Summoner (creature summoning)
	// UNIQUE POWER: Extract souls as permanent shadow soldiers, shadow dimension with infinite storage
	{
		id: "shadow_regent",
		name: "Shadow Regent",
		type: RegentType.INTELLIGENCE_REGENT,
		compendiumId: "umbral-monarch-overlay",
		description:
			"Ruler of death and the abyssal realm. Command an eternal army extracted from fallen foes. Your System displays [SHADOW REGENT PROTOCOL]. Ascendant Bureau: S-Rank necromancy threat.",
		abilities: [
			"Shadow Extraction",
			"Shadow Storage Dimension",
			"Shadow Exchange",
			"Eternal Army Command",
		],
		features: [
			{
				name: "Shadow Extraction",
				description:
					"Extract shadow from defeated enemy (CR ≤ level) as bonus action. Shadow soldier retains original abilities at 50% power. Max army = 2x level. Permanent until destroyed. System HUD shows army roster with 3D models.",
				type: "necromancy",
			},
			{
				name: "Shadow Dimension",
				description:
					"Access pocket dimension for storage (infinite capacity, no weight limit). Store living beings in stasis. Retrieve as bonus action. Security scanners/x-rays cannot detect stored items. Shows as [INVENTORY: DIMENSIONAL] on System.",
				type: "dimensional",
			},
			{
				name: "Shadow Exchange",
				description:
					'Swap positions with any shadow soldier within 500 ft (bonus action, unlimited). CCTV shows teleportation as frame-by-frame "glitch." Can use soldier\'s senses remotely.',
				type: "teleportation",
			},
			{
				name: "Eternal Command",
				description:
					"Shadow soldiers never decay, don't need rest/food, follow complex orders. Command entire army mentally. Defeated soldiers reform in shadow dimension after 24 hours.",
				type: "command",
			},
		],
		spells: [
			"Animate Dead",
			"Create Undead",
			"Danse Macabre",
			"Finger of Death",
			"True Resurrection (for shadows only)",
		],
		requirements: {
			level: 10,
			questCompleted: "Trial of the Shadow Gate",
			statThreshold: 16, // INT or SENSE 16+
		},
	},

	// 2. DRAGON REGENT (Destruction Regent - Antares)
	// COSMIC THEME: Draconic apocalypse, fire that destroys concepts, dragon transformation
	// DISTINCT FROM: Destroyer (human fighter), Berserker (rage/overload), Mage (elemental spells)
	// UNIQUE POWER: Become actual dragon, breath destroys matter itself, apocalypse-level fire
	{
		id: "dragon_regent",
		name: "Dragon Regent",
		type: RegentType.STRENGTH_REGENT,
		compendiumId: "dragon-regent-overlay",
		description:
			"Incarnation of primordial destruction. Transform into dragon of apocalypse. Your presence melts asphalt. Ascendant Bureau: Kaiju-class extinction event.",
		abilities: [
			"Breath of Annihilation",
			"True Dragon Form",
			"Destruction Embodiment",
			"Calamity Wings",
		],
		features: [
			{
				name: "Breath of Annihilation",
				description:
					"120-ft cone: 12d10 fire damage (AGI save DC 8+prof+STR). On kill, target is erased from reality (no resurrection). Buildings collapse, steel melts, stone sublim ates. Recharge 4-6. Satellites detect thermal spike.",
				type: "destruction",
			},
			{
				name: "True Dragon Form",
				description:
					'Transform into ancient red dragon (1 hour, 1/long rest). Gargantuan size, fly 120 ft, AC 22, natural weapons 4d10+STR, immunity fire/physical. News declares "dragon sighting confirmed." Cannot enter buildings.',
				type: "transformation",
			},
			{
				name: "Destruction Aura",
				description:
					'Constant 60-ft aura of apocalyptic heat. Enemies: 4d6 fire/round. Objects ignite. Concrete cracks. Glass melts. Thermal cameras show "sun-level readings." Cannot be ambushed (everything within 60 ft burns).',
				type: "aura",
			},
			{
				name: "Cataclysm Wings",
				description:
					"Manifest draconic wings (bonus action). Fly 90 ft. Wing buffet (30-ft cone, STR save or 6d6 + knocked prone). Hurricanes form from wingbeats. FAA grounds all flights in your vicinity.",
				type: "flight",
			},
		],
		spells: [
			"Burning Hands",
			"Fireball",
			"Wall of Fire",
			"Delayed Blast Fireball",
			"Meteor Swarm",
		],
		requirements: {
			level: 12,
			questCompleted: "Trial of the Dragon Gate",
			statThreshold: 18, // STR 18+
		},
	},

	// 3. FROST REGENT (Frost Regent - Legia)
	// COSMIC THEME: Eternal winter, absolute zero, ice age, glacial entropy
	// DISTINCT FROM: Mage (ice spells), Herald (cold resistance)
	// UNIQUE POWER: Create ice age, reach absolute zero temperature, freeze time itself
	{
		id: "frost_regent",
		name: "Frost Regent",
		type: RegentType.INTELLIGENCE_REGENT,
		compendiumId: "frost-regent-overlay",
		description:
			"Herald of the eternal winter. Bring ice age to modern cities. Thermometers break showing impossible temperatures. Ascendant Bureau: Climate catastrophe event.",
		abilities: [
			"Ice Age Protocol",
			"Absolute Zero Touch",
			"Glacial Eternity",
			"Winter's End",
		],
		features: [
			{
				name: "Ice Age Advent",
				description:
					"Create 5-mile radius ice storm (1/long rest, 8 hours). Temperature drops to -100°C. All water freezes instantly. Buildings covered in ice. Fire damage impossible. City declares state of emergency. Blizzard conditions, visibility 10 ft.",
				type: "weather",
			},
			{
				name: "Absolute Zero",
				description:
					'Touch attack: 10d10 cold + paralyzed (VIT save DC 8+prof+INT). On kill, target becomes diamond-hard ice statue at -273.15°C. Statue cannot be thawed (only Wish works). Forensics find "physics-defying temperature."',
				type: "touch",
			},
			{
				name: "Glacial Time",
				description:
					'Slow time in 60-ft radius (1 min, prof/long rest). Enemies move at half speed, disadvantage on AGI, cannot take reactions. You act normally. Scientists detect "localized temporal distortion."',
				type: "time",
			},
			{
				name: "Winter's Immortality",
				description:
					'Immune to cold, fire, aging. Regenerate 20 HP/round when below freezing temperature. At 0 HP, freeze into ice (stabilized automatically). Medical scans show "cellular suspension in cryostasis."',
				type: "immortality",
			},
		],
		spells: [
			"Ice Knife",
			"Sleet Storm",
			"Cone of Cold",
			"Freezing Sphere",
			"Time Stop",
		],
		requirements: {
			level: 10,
			questCompleted: "Trial of the Frost Gate",
			statThreshold: 16, // INT 16+
		},
	},

	// 4. BEAST REGENT (Beast Regent - Rakan)
	// COSMIC THEME: Primal chaos, primordial beast, evolutionary apex predator
	// DISTINCT FROM: Berserker (rage transformation), Stalker (tracking), Summoner (pets)
	// UNIQUE POWER: Evolve into primordial apex predator, command all beasts worldwide
	{
		id: "beast_regent",
		name: "Beast Regent",
		type: RegentType.STRENGTH_REGENT,
		compendiumId: "beast-regent-overlay",
		description:
			"Avatar of primordial evolution. All beasts recognize you as alpha. Transform into apex predator from before human history. Ascendant Bureau: Alpha-class biodiversity threat.",
		abilities: [
			"Apex Evolution",
			"Worldwide Beast Command",
			"Primordial Instinct",
			"Alpha Dominance",
		],
		features: [
			{
				name: "Apex Form",
				description:
					"Transform into primordial beast (10 min, prof/long rest). Huge size, +6 STR/AGI/VIT (max 26), natural weapons 3d10+STR, regeneration 15 HP/turn, tremorsense 120 ft, climb/swim speed = walk. Form based on environment (urban: dire tiger, forest: primal bear, etc.).",
				type: "evolution",
			},
			{
				name: "Beast King's Call",
				description:
					"Mental command to ALL beasts within 10 miles (CR ≤ level). They obey absolutely. Animals in zoos break out. Police K-9 units turn on handlers. Pigeons coordinate like hive mind. Lasts 1 hour. 1/week.",
				type: "domination",
			},
			{
				name: "Primordial Regeneration",
				description:
					'Regrow lost limbs in 1 minute. Regain 25 HP at start of turn if below half max. Cannot die from old age or disease. Toxins/poisons metabolize instantly. Medical reports: "unprecedented healing factor, cellular age regression."',
				type: "regeneration",
			},
			{
				name: "Alpha's Presence",
				description:
					'Constant aura (120 ft). Beasts automatically friendly. Enemies must save (SENSE DC 8+prof+STR) or become frightened + cannot attack you (only flee/defend). Zoologists: "apex predator response triggers in all mammals."',
				type: "dominance",
			},
		],
		spells: [
			"Animal Friendship (affects all beasts, no save)",
			"Conjure Animals (CR no limit)",
			"Awaken",
			"Dominate Beast (affects all beasts)",
			"Shapechange (beast forms only)",
		],
		requirements: {
			level: 11,
			questCompleted: "Trial of the Beast Gate",
			statThreshold: 17, // STR or VIT 17+
		},
	},

	// 5. TITAN REGENT (Iron Body Regent - Tarnak)
	// COSMIC THEME: Conceptual invulnerability, immovable object, physics-breaking defense
	// DISTINCT FROM: Destroyer (tank), Berserker (damage reduction), Holy Knight (defense)
	// UNIQUE POWER: Become literally invulnerable, immune to physics, cannot be killed
	{
		id: "titan_regent",
		name: "Titan Regent",
		type: RegentType.VITALITY_REGENT,
		compendiumId: "steel-flesh-monarch-overlay",
		description:
			"Embodiment of absolute defense. Invulnerable to all harm. Laws of physics bend around you. Ascendant Bureau: Unkillable entity - containment impossible.",
		abilities: [
			"Conceptual Invulnerability",
			"Immovable",
			"Infinite Endurance",
			"Titan's Law",
		],
		features: [
			{
				name: "True Invulnerability",
				description:
					'Immune to ALL damage (magical, physical, psychic, force, etc.). Cannot be moved, grappled, knocked prone, or affected by forced movement. Time Stop/Banishment/Maze fail automatically. Only Wish can bypass (DM discretion). Attacks bounce off with "IMMUNE" System message.',
				type: "absolute",
			},
			{
				name: "Immovable Anchor",
				description:
					"While touching ground, gravity cannot affect you (fly/levitate fail). Teleportation/plane shift targeting you fails. Ground within 30 ft becomes difficult terrain for enemies (tremors from your mass). Buildings crack if you stand too long.",
				type: "physics",
			},
			{
				name: "Infinite Stamina",
				description:
					'No exhaustion, no need for sleep/food/air/water. Can fight forever. Short rest = full HP restore. Death saves always succeed (auto-stabilize). Medical instruments: "patient shows no vital signs but remains conscious and mobile."',
				type: "endurance",
			},
			{
				name: "Titan's Retaliation",
				description:
					"Attackers in melee automatically take full reflected damage (as force, ignores resistance/immunity). Ranged attackers: projectiles orbit you then launch back at attacker. Mages casting at you: spell reflects back at caster.",
				type: "retribution",
			},
		],
		spells: [
			"Shield",
			"Invulnerability",
			"Globe of Invulnerability",
			"Wish (defensive only)",
		],
		requirements: {
			level: 12,
			questCompleted: "Trial of the Titan Gate",
			statThreshold: 18, // VIT 18+
		},
	},

	// 6. PLAGUE REGENT (Plague Regent - Querehsha)
	// COSMIC THEME: Primordial disease, pandemic incarnate, biological apocalypse
	// DISTINCT FROM: Revenant (death magic/life drain), Mage (poison spells)
	// UNIQUE POWER: Create supernatural pandemic, become living biological weapon, insect god
	{
		id: "plague_regent",
		name: "Plague Regent",
		type: RegentType.INTELLIGENCE_REGENT,
		compendiumId: "plague-regent-overlay",
		description:
			"Incarnation of plague and pestilence. Walking biological apocalypse. CDC tracks 47 unknown pathogens in your wake. Ascendant Bureau: Pandemic-class bioweapon.",
		abilities: [
			"Pandemic Protocol",
			"Swarm Incarnation",
			"Plague Vector",
			"Disease God",
		],
		features: [
			{
				name: "Apocalypse Plague",
				description:
					"Create supernatural pandemic (1/month, permanent until cured by Wish). Choose disease properties (airborne/touch/water, symptoms, lethality). Spreads exponentially (R0 = 10). Only you can cure it. Cities quarantine, WHO declares emergency.",
				type: "pandemic",
			},
			{
				name: "Billion Swarm",
				description:
					"Body disintegrates into insect swarm (1 hour, 1/long rest). Swarm acts as single entity: fly 60 ft, squeeze through 1-inch gaps, split into 10 sub-swarms, immunity to all damage except fire/AoE (half damage). Pest control evacuates entire city blocks.",
				type: "swarm",
			},
			{
				name: "Typhoid Incarnate",
				description:
					"Anyone within 60 ft: VIT save DC 8+prof+INT or contract supernatural disease (4d12 necrotic/day, spreads to creatures within 10 ft, cannot be cured except by you or Wish). You see infected via System HUD [INFECTED: filename with countdown].",
				type: "contagion",
			},
			{
				name: "Insect God",
				description:
					"Command all insects within 5 miles. Insect swarms attack on your mental command (treats as Insect Plague centered on any point). Food supply collapses. Crops fail. Cities experience biblical-level locust swarms.",
				type: "control",
			},
		],
		spells: [
			"Ray of Sickness",
			"Contagion",
			"Insect Plague",
			"Harm",
			"Wish (disease-themed)",
		],
		requirements: {
			level: 10,
			questCompleted: "Trial of the Plague Gate",
			statThreshold: 16, // INT or SENSE 16+
		},
	},

	// 7. ARCHITECT REGENT (Architect Monarch)
	// COSMIC THEME: Reality architecture, dimensional construction, space/time manipulation
	// DISTINCT FROM: Mage (construction spells), Technomancer (tech buildings)
	// UNIQUE POWER: Architect reality itself, create permanent demiplanes, reshape space/time
	{
		id: "architect_regent",
		name: "Architect Regent",
		type: RegentType.INTELLIGENCE_REGENT,
		compendiumId: "architect-regent-overlay",
		description:
			"Reality's architect. Reshape space, time, and dimensions. Create permanent worlds. Your System HUD shows universe blueprint. Ascendant Bureau: Dimensional sovereignty threat.",
		abilities: [
			"Reality Blueprint",
			"Dimensional Genesis",
			"Spatial Sovereignty",
			"Time Architecture",
		],
		features: [
			{
				name: "World Creation",
				description:
					'Create permanent demiplane (1 mile cube, 1/month). Full control: gravity, time flow (1:1 to 1000:1), atmosphere, geography, structures. Portals only you can open. Use as base/prison/laboratory. Physicists: "stable pocket universe detected."',
				type: "creation",
			},
			{
				name: "Instant Architecture",
				description:
					'Create any structure (up to 300 ft cube) as action (AC 25, 500 HP, permanent). Can include rooms, traps, elevators, ventilation. Building inspectors: "structure appeared overnight, materials unknown, no foundation, physics-defying."',
				type: "construction",
			},
			{
				name: "Spatial Anchors",
				description:
					'Place 12 invisible anchors anywhere on planet. Teleport between anchors (action, unlimited). Anchors permanent until dismissed. Can teleport others (willing or VIT save). GPS shows you "quantum tunneling."',
				type: "teleportation",
			},
			{
				name: "Living Lair",
				description:
					'In structures you created: reshape layout as bonus action, create/remove doors/walls/floors, teleport creatures (VIT save), control gravity per room. On initiative 20: create 20-ft cube wall or pit. Opponents: "fighting inside sentient building."',
				type: "control",
			},
		],
		spells: [
			"Wall of Force",
			"Fabricate",
			"Demiplane",
			"Maze",
			"Gate",
			"Wish (construction-themed)",
		],
		requirements: {
			level: 13,
			questCompleted: "Trial of the Architect Gate",
			statThreshold: 18, // INT 18+
		},
	},

	// 8. RADIANT REGENT (White Flames Regent - Baran)
	// COSMIC THEME: Purifying apocalypse, holy annihilation, divine fire that erases evil
	// DISTINCT FROM: Herald (healing/support), Holy Knight (smites), Idol (inspiration)
	// UNIQUE POWER: White flames that erase evil from existence, purify on cosmic scale
	{
		id: "radiant_regent",
		name: "Radiant Regent",
		type: RegentType.PRESENCE_REGENT,
		compendiumId: "flame-monarch-overlay",
		description:
			"Purifying flame incarnate. White fire that erases evil. Visible from space. Every religion claims you as prophet/devil. Ascendant Bureau: Apocalypse-class sanctification event.",
		abilities: [
			"White Flame Apocalypse",
			"Purification Protocol",
			"Radiant Judgment",
			"Holy Extinction",
		],
		features: [
			{
				name: "White Fire",
				description:
					'Ranged attack (300 ft): 12d12 radiant damage. Undead/fiends/evil: triple damage + disintegrate (no save, no resurrection). Impact crater glows for year. Religions debate if you\'re angel/demon. Satellites detect "unexplained light source."',
				type: "annihilation",
			},
			{
				name: "Seraphim Form",
				description:
					"6 wings of white flame (1 hour, 1/long rest). Fly 120 ft, emit light (bright 300 ft), immune to all damage. Halo visible to satellites. Creatures within 60 ft: save or blinded + take 6d8 radiant/round. Global religious upheaval.",
				type: "transformation",
			},
			{
				name: "Divine Purge",
				description:
					'1-mile radius: choose to purge all "evil" (your definition). Undead disintegrate. Fiends banished. Curses broken. Diseases cured. Corruption erased. Plants regrow. Takes 1 minute. Visible from space. Theologians: "miracle or weapon?"',
				type: "purification",
			},
			{
				name: "Judgment Day",
				description:
					"Point at creature (no range limit if you can see). PRE save DC 8+prof+PRE or: 20d10 radiant + stunned 10 minutes. On kill: soul judged (DM decides: paradise/oblivion/hell). UN debates if you have judicial authority.",
				type: "judgment",
			},
		],
		spells: [
			"Sacred Flame",
			"Daylight",
			"Flame Strike",
			"Holy Aura",
			"Divine Word",
			"Wish (holy-themed)",
		],
		requirements: {
			level: 12,
			questCompleted: "Trial of the Radiant Gate",
			statThreshold: 17, // PRE 17+
		},
	},

	// 9. MIMIC REGENT (Transfiguration Regent - Yogumunt)
	// COSMIC THEME: Perfect transformation, reality mimicry, adaptation incarnate
	// DISTINCT FROM: Assassin (disguise), Esper (illusion), Contractor (shapeshifting limits)
	// UNIQUE POWER: Become ANYTHING perfectly, copy reality itself, adaptive evolution
	{
		id: "mimic_regent",
		name: "Mimic Regent",
		type: RegentType.AGILITY_REGENT,
		compendiumId: "mimic-regent-overlay",
		description:
			"Embodiment of infinite forms. Copy anything - creatures, objects, concepts. No detection possible. Ascendant Bureau: Identity unknown - all records contradictory.",
		abilities: [
			"Perfect Mimicry",
			"Reality Copy",
			"Adaptive Genesis",
			"Thousand True Forms",
		],
		features: [
			{
				name: "Perfect Imitation",
				description:
					"Transform into ANYTHING you've seen (creature, object, building). Size: Tiny to Gargantuan. Gain all abilities (CR limit = level). Duration: unlimited. NO detection (True Seeing, Divine Sense, all fail). DNA matches target. Memories accessible. Completely perfect.",
				type: "transformation",
			},
			{
				name: "Power Theft",
				description:
					"Observe any feature/spell/ability. Copy it permanently (no save). Store up to level/2 stolen powers. Can use stolen power prof/long rest. Includes legendary actions, lair actions, regional effects. System: [ABILITY ARCHIVED: filename].",
				type: "mimicry",
			},
			{
				name: "Reactive Evolution",
				description:
					'Instantly adapt to any threat. Damaged by element: gain immunity. Failed save: auto-succeed that save type. Attacked by weapon: gain resistance. Affected by spell: gain spell as stolen power. Biologists: "real-time evolution, impossible speed."',
				type: "adaptation",
			},
			{
				name: "Quantum Existence",
				description:
					"Exist in superposition: each observer sees different form (1 hour, 1/long rest). You appear as most trusted person/most feared enemy/irrelevant stranger (your choice per observer). Security footage shows different entity each frame. Witnesses give impossible descriptions.",
				type: "quantum",
			},
		],
		spells: [
			"Disguise Self (perfect)",
			"Alter Self (no limit)",
			"Polymorph (no CR limit)",
			"True Polymorph",
			"Shapechange",
			"Wish (transformation-themed)",
		],
		requirements: {
			level: 11,
			questCompleted: "Trial of the Mimic Gate",
			statThreshold: 17, // AGI or PRE 17+
		},
	},
];
