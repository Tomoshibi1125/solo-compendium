// Umbral Legion — Shadow Soldier Compendium
// Full stat blocks for Umbral Regent's raised army.
export interface ShadowSoldier {
	id: string;
	name: string;
	display_name: string;
	rank: "A" | "B" | "C";
	role: string;
	description: string;
	flavor: string;
	lore: {
		origin: string;
		history: string;
		curse: string;
		personality: string;
		current_owner: string;
		prior_owners: string[];
	};
	tags: string[];
	source_book: string;
	rarity: "very_rare" | "rare" | "uncommon";
	hp: number;
	ac: number;
	speed: number;
	stats: {
		strength: number;
		agility: number;
		vitality: number;
		intelligence: number;
		sense: number;
		presence: number;
	};
	saving_throws: Partial<
		Record<
			| "strength"
			| "agility"
			| "vitality"
			| "intelligence"
			| "sense"
			| "presence",
			number
		>
	>;
	skills: Record<string, number>;
	damage_resistances: string[];
	damage_immunities: string[];
	condition_immunities: string[];
	senses: string;
	languages: string;
	challenge_rating: number;
	proficiency_bonus: number;
	traits: { name: string; description: string }[];
	actions: {
		name: string;
		description: string;
		action_type: "action" | "bonus" | "reaction" | "legendary";
		attack_bonus?: number;
		damage?: string;
		damage_type?: string;
		recharge?: string;
		dc?: number;
		save?: string;
	}[];
	mechanics: {
		action_type: string;
		frequency: string;
		lattice_interaction: string;
	};
	limitations: { requires_attunement: boolean; conditions: string[] };
}

export const shadowSoldiers: ShadowSoldier[] = [
	{
		id: "umbral-bulwark",
		name: "Umbral Bulwark",
		display_name: "Umbral Bulwark",
		rank: "A",
		role: "Tank",
		description:
			"A towering construct of compressed shadow-matter and necrotic bone, encased in carapace armour forged from A-Rank gate remnants. The Umbral Bulwark anchors the Regent's front line, absorbing punishment that would annihilate lesser soldiers.",
		flavor:
			"It does not bleed. It does not tire. It simply holds the line until you break first.",
		lore: {
			origin:
				"Assembled from the remnants of an A-Rank stone-giant anomaly slain in the Frozen Gate.",
			history:
				"The Bulwark form was the first perfected Umbral Legion pattern, designed after the third failed Gate clearing at the Citadel Rift.",
			curse:
				"Exudes a faint aura of despair; non-Umbral allies within 10 ft. suffer -1 to morale checks.",
			personality:
				"Implacable. Does not speak. Communicates intent through the weight of its silence.",
			current_owner: "The Umbral Regent",
			prior_owners: ["The slain Stonewarden of the Frozen Gate"],
		},
		tags: ["umbral-legion", "umbral", "tank", "a-rank", "undead-construct"],
		source_book: "Rift Ascendant Canon",
		rarity: "very_rare",
		hp: 120,
		ac: 19,
		speed: 25,
		stats: {
			strength: 22,
			agility: 10,
			vitality: 24,
			intelligence: 8,
			sense: 10,
			presence: 12,
		},
		saving_throws: { strength: 9, vitality: 10, presence: 5 },
		skills: { Athletics: 9, Perception: 3 },
		damage_resistances: ["bludgeoning", "piercing", "slashing (non-magical)"],
		damage_immunities: ["necrotic", "poison"],
		condition_immunities: ["exhaustion", "frightened", "paralyzed", "poisoned"],
		senses: "Darkvision 120 ft., tremorsense 30 ft., passive Perception 13",
		languages: "Understands Umbral Command; does not speak",
		challenge_rating: 13,
		proficiency_bonus: 5,
		traits: [
			{
				name: "Obsidian Aegis",
				description:
					"While above half HP, resistance to all damage and immune to forced movement ≤20 ft.",
			},
			{
				name: "Undead Fortitude",
				description:
					"When reduced to 0 HP by non-radiant damage, DC 14 Vitality save. Success: drop to 1 HP instead.",
			},
			{
				name: "Aura of Dread (10 ft.)",
				description:
					"Enemies starting their turn within 10 ft. must succeed DC 15 Presence save or be Frightened until start of their next turn.",
			},
		],
		actions: [
			{
				name: "Necrotic Slam",
				description:
					"Melee attack, one target within 5 ft. Hit: 2d10+6 bludgeoning + 2d8 necrotic.",
				action_type: "action",
				attack_bonus: 9,
				damage: "2d10+6 bludgeoning + 2d8 necrotic",
				damage_type: "bludgeoning/necrotic",
			},
			{
				name: "Fortify",
				description:
					"One Umbral ally within 30 ft. gains +3 AC and resistance to the next damage instance until start of Bulwark's next turn.",
				action_type: "bonus",
			},
			{
				name: "Void Intercept",
				description:
					"When an ally within 15 ft. would be hit, impose disadvantage on that attack roll.",
				action_type: "reaction",
			},
			{
				name: "Rupture Carapace",
				description:
					"Recharge 5-6. 15-ft. radius, DC 17 Vitality save. Fail: 6d8 necrotic + Restrained until end of Bulwark's next turn. Success: half, no restrain.",
				action_type: "action",
				recharge: "5-6",
				damage: "6d8 necrotic",
				damage_type: "necrotic",
				dc: 17,
				save: "Vitality",
			},
		],
		mechanics: {
			action_type: "Action",
			frequency: "Per encounter",
			lattice_interaction:
				"Necrotic mana anchor — suppresses healing within aura radius",
		},
		limitations: {
			requires_attunement: false,
			conditions: [
				"Controlled by Umbral Regent only",
				"Dissolves in sustained radiant light (10+ radiant damage in one turn)",
			],
		},
	},
	{
		id: "umbral-assassin",
		name: "Umbral Assassin",
		display_name: "Umbral Assassin",
		rank: "A",
		role: "Assassin",
		description:
			"A razor-thin shadow construct that moves without sound and strikes before its presence registers. The Umbral Assassin eliminates high-value targets with a single decisive action, then vanishes back into darkness.",
		flavor:
			"You never hear the Umbral Assassin. The last thing you know is silence—and then nothing.",
		lore: {
			origin:
				"Reconstructed from the shade of an S-Rank Stalker anomaly personally destroyed by the Umbral Regent.",
			history:
				"Deployed exclusively for high-risk eliminations. Guild intelligence has catalogued exactly three confirmed sightings—none of whom survived to report twice.",
			curse:
				"Leaves trace shadow-residue on kills detectable by sense-type Hunters (DC 20 Perception).",
			personality: "Purposeful and absolute. Executes without hesitation.",
			current_owner: "The Umbral Regent",
			prior_owners: ["The Shade of Gate Zero"],
		},
		tags: ["umbral-legion", "umbral", "assassin", "a-rank", "undead-construct"],
		source_book: "Rift Ascendant Canon",
		rarity: "very_rare",
		hp: 98,
		ac: 17,
		speed: 50,
		stats: {
			strength: 16,
			agility: 24,
			vitality: 16,
			intelligence: 14,
			sense: 18,
			presence: 12,
		},
		saving_throws: { agility: 11, sense: 8, intelligence: 6 },
		skills: { Stealth: 15, Perception: 8, Acrobatics: 11 },
		damage_resistances: ["piercing", "slashing (non-magical)"],
		damage_immunities: ["necrotic", "poison"],
		condition_immunities: ["exhaustion", "paralyzed", "poisoned"],
		senses: "Darkvision 120 ft., blindsense 30 ft., passive Perception 18",
		languages: "Understands Umbral Command; does not speak",
		challenge_rating: 13,
		proficiency_bonus: 5,
		traits: [
			{
				name: "Shadow Step",
				description:
					"Bonus action: teleport up to 60 ft. to an unoccupied space in dim light or darkness.",
			},
			{
				name: "Lethal Precision",
				description:
					"Deals +8d6 necrotic damage on hits when it has advantage or an ally is adjacent to the target.",
			},
			{
				name: "Evasion",
				description:
					"Agility save for half damage: takes none on success, half on failure.",
			},
		],
		actions: [
			{
				name: "Shadow Blade ×2",
				description:
					"Two melee attacks. Each hit: 1d8+7 piercing + 3d6 necrotic.",
				action_type: "action",
				attack_bonus: 11,
				damage: "1d8+7 piercing + 3d6 necrotic",
				damage_type: "piercing/necrotic",
			},
			{
				name: "Vanishing Strike",
				description:
					"Recharge 5-6. One attack with advantage, then Shadow Step as part of the same bonus action.",
				action_type: "action",
				recharge: "5-6",
				attack_bonus: 11,
				damage: "1d8+7 piercing + 3d6 necrotic",
				damage_type: "piercing/necrotic",
			},
			{
				name: "Veil of Darkness",
				description:
					"Becomes Invisible until start of next turn or until it makes an attack roll.",
				action_type: "bonus",
			},
			{
				name: "Void Counter",
				description:
					"When a creature misses with a melee attack, make one Shadow Blade attack against it.",
				action_type: "reaction",
			},
		],
		mechanics: {
			action_type: "Action",
			frequency: "Per encounter",
			lattice_interaction:
				"Mana resonance cloaking — disrupts detection-type Hunter abilities within 30 ft.",
		},
		limitations: {
			requires_attunement: false,
			conditions: [
				"Controlled by Umbral Regent only",
				"Revealed by sustained radiant exposure (Holy Aura, Sunbeam, etc.)",
			],
		},
	},
	{
		id: "umbral-mage",
		name: "Umbral Mage",
		display_name: "Umbral Mage",
		rank: "B",
		role: "Mage",
		description:
			"A gaunt construct of condensed shadow lattice that channels void-aligned mana into destructive spells. Provides long-range magical suppression and arcane disruption for the Regent's forces.",
		flavor:
			"It casts with the memory of a mind that no longer exists. The spells are perfectly executed—and entirely hollow.",
		lore: {
			origin:
				"Shaped from the echo-mana of a slain B-Rank Sorcerer anomaly from the Resonance Gate.",
			history:
				"Developed after the Regent identified the tactical gap of lacking ranged magical firepower in early Legion deployments.",
			curse:
				"Occasionally produces unstabilised mana pockets; creatures within 5 ft. when it casts take 1d4 force damage.",
			personality:
				"Cold and mechanical. Selects targets using pure threat-assessment logic.",
			current_owner: "The Umbral Regent",
			prior_owners: ["The Echo-Sorcerer of the Resonance Gate"],
		},
		tags: ["umbral-legion", "umbral", "mage", "b-rank", "undead-construct"],
		source_book: "Rift Ascendant Canon",
		rarity: "rare",
		hp: 66,
		ac: 14,
		speed: 30,
		stats: {
			strength: 8,
			agility: 14,
			vitality: 14,
			intelligence: 20,
			sense: 16,
			presence: 10,
		},
		saving_throws: { intelligence: 8, sense: 6 },
		skills: { Arcana: 8, Perception: 6, History: 8 },
		damage_resistances: ["cold", "lightning"],
		damage_immunities: ["necrotic", "poison"],
		condition_immunities: ["exhaustion", "paralyzed", "poisoned"],
		senses: "Darkvision 60 ft., passive Perception 16",
		languages: "Understands Umbral Command; does not speak",
		challenge_rating: 9,
		proficiency_bonus: 4,
		traits: [
			{
				name: "Arcane Lattice",
				description:
					"Advantage on concentration checks. Can concentrate on one additional effect simultaneously.",
			},
			{
				name: "Void Conduit",
				description:
					"Once per turn when dealing necrotic or force damage, push target up to 10 ft. away.",
			},
		],
		actions: [
			{
				name: "Void Bolt",
				description:
					"Ranged spell attack, one target within 90 ft. Hit: 3d10+5 necrotic.",
				action_type: "action",
				attack_bonus: 8,
				damage: "3d10+5 necrotic",
				damage_type: "necrotic",
			},
			{
				name: "Shadow Burst",
				description:
					"Recharge 5-6. 20-ft. radius centred on a point within 60 ft. DC 16 Intelligence save. Fail: 4d8 necrotic + Blinded until end of next turn. Success: half, no blind.",
				action_type: "action",
				recharge: "5-6",
				damage: "4d8 necrotic",
				damage_type: "necrotic",
				dc: 16,
				save: "Intelligence",
			},
			{
				name: "Arcane Shield",
				description:
					"When hit by an attack, gain +4 AC against that attack and until end of next turn.",
				action_type: "reaction",
			},
		],
		mechanics: {
			action_type: "Action",
			frequency: "Per encounter",
			lattice_interaction:
				"Void-lattice conduit — suppresses enemy mana recovery within area",
		},
		limitations: {
			requires_attunement: false,
			conditions: [
				"Controlled by Umbral Regent only",
				"Disrupted by anti-magic fields",
			],
		},
	},
	{
		id: "umbral-archer",
		name: "Umbral Archer",
		display_name: "Umbral Archer",
		rank: "B",
		role: "Archer",
		description:
			"A lithe construct built for sustained ranged engagement. Fires volleys of shadow-infused projectiles with mechanical precision, pinning down enemies from distance while the Legion advances.",
		flavor:
			"Each arrow carries a sliver of the Regent's will. It is not aimed—it is sent.",
		lore: {
			origin:
				"Reconstructed from remains of a B-Rank Phantom Archer anomaly from the Siege of Outer Gate Seven.",
			history:
				"Deployed in open terrain; Bureau tactical reports flag Umbral Archers as priority targets.",
			curse:
				"Shadow projectiles leave void-marks on wounds; healing the affected creature costs 1 additional spell slot level.",
			personality:
				"Relentlessly patient. Will hold position indefinitely unless commanded otherwise.",
			current_owner: "The Umbral Regent",
			prior_owners: ["The Phantom Archer of Gate Seven"],
		},
		tags: [
			"umbral-legion",
			"umbral",
			"archer",
			"ranged",
			"b-rank",
			"undead-construct",
		],
		source_book: "Rift Ascendant Canon",
		rarity: "rare",
		hp: 60,
		ac: 15,
		speed: 35,
		stats: {
			strength: 12,
			agility: 20,
			vitality: 14,
			intelligence: 12,
			sense: 18,
			presence: 10,
		},
		saving_throws: { agility: 8, sense: 7 },
		skills: { Perception: 7, Stealth: 8, Acrobatics: 8 },
		damage_resistances: ["piercing (non-magical)"],
		damage_immunities: ["necrotic", "poison"],
		condition_immunities: ["exhaustion", "paralyzed", "poisoned"],
		senses: "Darkvision 120 ft., passive Perception 17",
		languages: "Understands Umbral Command; does not speak",
		challenge_rating: 8,
		proficiency_bonus: 3,
		traits: [
			{
				name: "Sniper's Lattice",
				description:
					"Ignores half and three-quarters cover. No disadvantage on long-range attacks.",
			},
			{
				name: "Mark Target",
				description:
					"Free action once per turn: designate one visible creature as Marked. Archer deals +1d8 necrotic against Marked targets; they cannot benefit from Unseen Attacker rule against the Archer.",
			},
		],
		actions: [
			{
				name: "Shadow Arrow ×3",
				description:
					"Three ranged attacks, one or multiple targets within 150/600 ft. Each hit: 1d8+5 piercing + 2d6 necrotic.",
				action_type: "action",
				attack_bonus: 8,
				damage: "1d8+5 piercing + 2d6 necrotic",
				damage_type: "piercing/necrotic",
			},
			{
				name: "Pinning Shot",
				description:
					"One ranged attack. Hit: normal damage + DC 15 Strength save or Restrained until start of Archer's next turn.",
				action_type: "bonus",
				attack_bonus: 8,
				damage: "1d8+5 piercing",
				damage_type: "piercing",
				dc: 15,
				save: "Strength",
			},
			{
				name: "Intercept Volley",
				description:
					"When an ally within 60 ft. is targeted by a ranged attack, impose disadvantage on that attack.",
				action_type: "reaction",
			},
		],
		mechanics: {
			action_type: "Action",
			frequency: "Per encounter",
			lattice_interaction:
				"Shadow-thread arrows — track residual mana signatures on targets",
		},
		limitations: {
			requires_attunement: false,
			conditions: [
				"Controlled by Umbral Regent only",
				"Disadvantage on attacks when in melee range (within 5 ft.)",
			],
		},
	},
	{
		id: "umbral-warrior",
		name: "Umbral Warrior",
		display_name: "Umbral Warrior",
		rank: "C",
		role: "Destroyer",
		description:
			"The backbone of the Umbral Legion. Umbral Warriors are general-purpose melee constructs that fill line gaps and overwhelm through coordinated assault. Individually modest; collectively devastating.",
		flavor:
			"One Umbral Warrior is a nuisance. Ten are a problem. Fifty are the last thing you see.",
		lore: {
			origin:
				"Mass-produced from C-Rank wolf and bear anomaly remains from mid-tier Gate clearings.",
			history:
				"The first Umbral Warriors were raised experimentally during the Regent's early awakening. The pattern has been refined over dozens of deployments.",
			curse: "None notable at this tier.",
			personality:
				"Aggressive and single-minded. Moves toward the nearest designated threat.",
			current_owner: "The Umbral Regent",
			prior_owners: ["Various C-Rank anomalies"],
		},
		tags: ["umbral-legion", "umbral", "warrior", "c-rank", "undead-construct"],
		source_book: "Rift Ascendant Canon",
		rarity: "uncommon",
		hp: 45,
		ac: 14,
		speed: 35,
		stats: {
			strength: 18,
			agility: 14,
			vitality: 18,
			intelligence: 6,
			sense: 10,
			presence: 8,
		},
		saving_throws: { strength: 6, vitality: 6 },
		skills: { Athletics: 6, Perception: 2 },
		damage_resistances: ["bludgeoning (non-magical)"],
		damage_immunities: ["necrotic", "poison"],
		condition_immunities: ["exhaustion", "frightened", "poisoned"],
		senses: "Darkvision 60 ft., passive Perception 12",
		languages: "Understands Umbral Command; does not speak",
		challenge_rating: 4,
		proficiency_bonus: 2,
		traits: [
			{
				name: "Pack Tactics",
				description:
					"Advantage on attack rolls when at least one other Umbral soldier is within 5 ft. of the target and not incapacitated.",
			},
			{
				name: "Undying Advance",
				description:
					"When reduced to 0 HP, can continue acting until the end of its current turn before collapsing.",
			},
		],
		actions: [
			{
				name: "Shadow Cleave",
				description:
					"Melee attack, one target within 5 ft. Hit: 1d10+4 slashing + 1d6 necrotic. If target is Marked by an Umbral Archer, +1d6 necrotic.",
				action_type: "action",
				attack_bonus: 6,
				damage: "1d10+4 slashing + 1d6 necrotic",
				damage_type: "slashing/necrotic",
			},
			{
				name: "Crushing Lunge",
				description:
					"Move up to 20 ft. in a straight line and make a melee attack. Hit: normal damage + DC 14 Strength save or knocked Prone.",
				action_type: "bonus",
				attack_bonus: 6,
				damage: "1d10+4 slashing",
				damage_type: "slashing",
				dc: 14,
				save: "Strength",
			},
		],
		mechanics: {
			action_type: "Action",
			frequency: "Per encounter",
			lattice_interaction:
				"Minimal lattice interaction — brute necrotic binding only",
		},
		limitations: {
			requires_attunement: false,
			conditions: ["Controlled by Umbral Regent only"],
		},
	},
	{
		id: "umbral-scout",
		name: "Umbral Scout",
		display_name: "Umbral Scout",
		rank: "C",
		role: "Scout",
		description:
			"The fastest unit in the Umbral Legion. Umbral Scouts are lightweight constructs that push into enemy territory, relay target positions to the Regent, and harass isolated targets before the main force arrives.",
		flavor:
			"It was behind you before you turned around. It was already reporting back before you drew your weapon.",
		lore: {
			origin:
				"Assembled from C-Rank Shade Hound anomaly remains—fast, low-mass entities from scouting-type gates.",
			history:
				"Deployed in advance of all major Legion offensives. Three Scouts identified Bureau HQ's blind spots before the Restricted Zone assault.",
			curse: "None notable at this tier.",
			personality:
				"Skittish and evasive. Avoids direct confrontation unless cornered.",
			current_owner: "The Umbral Regent",
			prior_owners: ["Shade Hound packs from Gate Tier 3-C"],
		},
		tags: [
			"umbral-legion",
			"umbral",
			"scout",
			"recon",
			"c-rank",
			"undead-construct",
		],
		source_book: "Rift Ascendant Canon",
		rarity: "uncommon",
		hp: 35,
		ac: 13,
		speed: 50,
		stats: {
			strength: 10,
			agility: 20,
			vitality: 12,
			intelligence: 8,
			sense: 16,
			presence: 8,
		},
		saving_throws: { agility: 7, sense: 5 },
		skills: { Stealth: 9, Perception: 5, Acrobatics: 7 },
		damage_resistances: [],
		damage_immunities: ["necrotic", "poison"],
		condition_immunities: ["exhaustion", "poisoned"],
		senses: "Darkvision 120 ft., tremorsense 10 ft., passive Perception 15",
		languages: "Understands Umbral Command; does not speak",
		challenge_rating: 2,
		proficiency_bonus: 2,
		traits: [
			{
				name: "Mana Trace",
				description:
					"Detects the presence and direction of all conscious creatures within 60 ft. regardless of concealment, relaying to the Umbral Regent as a free action.",
			},
			{
				name: "Disengage Instinct",
				description:
					"Disengage as a bonus action. If it disengages and moves 20+ ft., becomes Invisible until start of its next turn.",
			},
		],
		actions: [
			{
				name: "Void Slash",
				description:
					"Melee attack, one target within 5 ft. Hit: 1d6+5 slashing + 1d4 necrotic.",
				action_type: "action",
				attack_bonus: 7,
				damage: "1d6+5 slashing + 1d4 necrotic",
				damage_type: "slashing/necrotic",
			},
			{
				name: "Shadowmeld",
				description:
					"Hide using Stealth with advantage, even if observed, provided not in bright light.",
				action_type: "bonus",
			},
		],
		mechanics: {
			action_type: "Action",
			frequency: "Per encounter",
			lattice_interaction:
				"Resonance trace — actively pings Regent with target mana signatures",
		},
		limitations: {
			requires_attunement: false,
			conditions: [
				"Controlled by Umbral Regent only",
				"Disadvantage on all rolls in bright light",
			],
		},
	},
];
