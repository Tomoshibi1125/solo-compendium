import type { StaticJob as AuthoritativeStaticJob } from "@/types/character";

export interface Job extends AuthoritativeStaticJob {
	type: string;
	rank: string;
	image: string;
	description: string;
	hitDie: string;
	primaryAbility: string;
	saving_throws: string[];
	savingThrows?: string[];
	skillChoices: string[];
	armorProficiencies: string[];
	weaponProficiencies: string[];
	tool_proficiencies: string[];
	toolProficiencies?: string[];
	awakeningFeatures: { name: string; description: string; level: number }[];
	jobTraits: {
		name: string;
		description: string;
		type: "passive" | "active" | "resistance" | "immunity" | "bonus";
		frequency?: "at-will" | "short-rest" | "long-rest" | "once-per-day";
		dc?: number;
	}[];
	abilityScoreImprovements: {
		strength?: number;
		agility?: number;
		vitality?: number;
		intelligence?: number;
		sense?: number;
		presence?: number;
	};
	size: "tiny" | "small" | "medium" | "large" | "huge" | "gargantuan";
	speed: number;
	languages: string[];
	darkvision?: number;
	specialSenses?: string[];
	damageResistances?: string[];
	damage_resistances?: string[];
	damageImmunities?: string[];
	damage_immunities?: string[];
	conditionImmunities?: string[];
	condition_immunities?: string[];
	startingEquipment?: string[][];
	hitPointsAtFirstLevel?: string;
	hitPointsAtHigherLevels?: string;
	spellcasting?: {
		ability: string;
		focus?: string;
		cantripsKnown?: number[];
		spellsKnown?: number[];
		spellSlots?: Record<string, number[]>;
	};
	classFeatures?: { level: number; name: string; description: string }[];
	abilities: string[];
	stats: {
		strength: number;
		agility: number;
		vitality: number;
		intelligence: number;
		sense: number;
		presence: number;
	};
	hit_dice?: string;
}

const FULL_CASTER_SLOTS: Record<string, number[]> = {
	"1st": [2, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
	"2nd": [0, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
	"3rd": [0, 0, 0, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
	"4th": [0, 0, 0, 0, 0, 0, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
	"5th": [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
	"6th": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2],
	"7th": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 2],
	"8th": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
	"9th": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
};
const HALF_CASTER_SLOTS: Record<string, number[]> = {
	"1st": [0, 2, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
	"2nd": [0, 0, 0, 0, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
	"3rd": [0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
	"4th": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 3, 3],
	"5th": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2],
};
const PACT_CASTER_SLOTS: Record<string, number[]> = {
	"1st": [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	"2nd": [0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	"3rd": [0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	"4th": [0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	"5th": [0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4],
};

export const jobs: Job[] = [
	// 1. DESTROYER — Gate Breach Specialist / Living Siege Engine
	{
		id: "destroyer",
		name: "Destroyer",
		type: "Job",
		rank: "C",
		description:
			"The Destroyer is an Awakened identity that specializes in the Living Siege Engine mandate. As an Ascendant of this lineage, their physiology is fundamentally restructured with crystallized mana, granting them bone density and combat instincts that surpass the human limit. They possess an innate Aetheric-Sight that perceives the structural weaknesses of enemies and gates alike. In the modern world, the Destroyer is the premier frontline asset of the Ascendant Bureau, their presence stabilizing the absolute order during gate eruptions.",
		hitDie: "1d10",
		primaryAbility: "Strength",
		saving_throws: ["Strength", "Vitality"],
		skillChoices: [
			"Acrobatics",
			"Animal Handling",
			"Athletics",
			"History",
			"Insight",
			"Intimidation",
			"Perception",
			"Survival",
		],
		armorProficiencies: ["All armor", "Shields"],
		weaponProficiencies: ["Simple weapons", "Martial weapons"],
		tool_proficiencies: [],
		awakeningFeatures: [
			{
				name: "Reinforced Frame",
				description:
					"Your Awakening hardened your skeleton with crystallized mana — X-rays show bones denser than titanium. When reduced to 0 HP but not killed outright, drop to 1 HP instead. Once per long rest.",
				level: 1,
			},
			{
				name: "Aetheric-Sight Resonance",
				description:
					"Your vision resonates with the mana-signatures of the world, perceiving combat flow as an innate sense. You sense hostile intent within 30 ft — even through walls and around corners — and cannot be surprised while conscious. On a crit, roll one additional weapon damage die.",
				level: 1,
			},
			{
				name: "Adrenal Flux",
				description:
					"Your Awakening manifested a mana-fueled adrenal core near your kidneys. During the heat of battle, your essence overclocks: below half HP, attacks deal extra 1d4 force damage for 1 minute (1d6 at 11th). Once per short rest.",
				level: 5,
			},
			{
				name: "Weapon Essence Bond",
				description:
					"Your preferred weapons register to your soul-signature like a spiritual lock — only you can wield them at full potential. +1 to attack and damage with all proficient weapons; you cannot be disarmed. (+2 at 17th level).",
				level: 11,
			},
		],
		jobTraits: [
			{
				name: "Gate Breaker",
				description:
					"You can punch through reinforced concrete and tear apart gate-crystal formations. Deal double damage to objects and structures. Advantage on saves against fear from gate-born anomalies—your resonance is hardened against absolute chaos.",
				type: "resistance",
			},
			{
				name: "Mana-Signature Scan",
				description:
					"Bonus action: your Aetheric-Sight scans a target's essence in milliseconds. Learn its AC, HP percentage, highest save, and lowest save. Prof bonus uses per long rest.",
				type: "active",
				frequency: "long-rest",
			},
			{
				name: "Damage Absorber",
				description:
					"Your crystallized mana skeleton absorbs impact like built-in spirit armor. When you use Adrenaline Burst, also gain temp HP equal to your Destroyer level.",
				type: "passive",
			},
		],
		abilityScoreImprovements: { strength: 2, vitality: 1 },
		size: "medium",
		speed: 30,
		languages: ["English"],
		darkvision: 60,
		damage_resistances: [
			"bludgeoning from nonmagical attacks (while conscious)",
		],
		startingEquipment: [
			["Chain Mail", "Leather Armor"],
			["Longsword", "Battleaxe"],
			["Shield"],
			["Light Crossbow"],
			["Crossbow Bolts (20)"],
			["Dungeoneer's Pack", "Explorer's Pack"],
		],
		hitPointsAtFirstLevel: "10 + your Vitality modifier",
		hitPointsAtHigherLevels:
			"1d10 (or 6) + your Vitality modifier per level after 1st",
		classFeatures: [
			{
				level: 1,
				name: "Aetheric Mark",
				description:
					"Bonus action: your Aetheric-Sight locks onto a target's soul-signature. Gain +1d4 to attack rolls against it (only one mark active). When the marked target drops to 0 HP, your resonance auto-locks the next threat as a free action.",
			},
			{
				level: 1,
				name: "Essence Harvest",
				description:
					"When you reduce a creature to 0 HP, you harvest the residual mana of the fallen. As an Ascendant of the modern era, your smartphone interface registers this influx as a [MANA ABSORBED] alert. Regain HP equal to your Destroyer level + VIT mod. Once per short rest.",
			},
			{
				level: 2,
				name: "Unfettered Release",
				description:
					"Once per short rest, override your essence's safety limiters. For 1 round, your weapon attacks deal maximum damage dice (no rolling). At 17th level, twice per short rest.",
			},
			{
				level: 3,
				name: "Destruction Path",
				description:
					"Choose a specialization path. Grants features at 3rd, 7th, 10th, 15th, and 18th level.",
			},
			{
				level: 4,
				name: "Ability Score Improvement",
				description:
					"You gain this at 4th, 6th, 8th, 12th, 14th, 16th, and 19th level.",
			},
			{
				level: 5,
				name: "Vulnerability Resonance",
				description:
					"Your Aetheric-Sight tracks the deterioration of your target, highlighting weakening structural points in their mana-flow in real-time. When you hit a creature you've already hit this combat, deal +1d6 bonus damage. At 11th level +1d8 and one additional attack. At 20th level, +1d10 and two additional attacks.",
			},
			{
				level: 7,
				name: "Path Feature",
				description: "Feature from your Destruction Path.",
			},
			{
				level: 9,
				name: "Aetheric Realignment",
				description:
					"Force the Aetheric-Weave to realign around you. When you fail a save, use your reaction to reroll with +prof bonus added. Once per long rest (twice at 13th, three at 17th).",
			},
			{
				level: 10,
				name: "Path Feature",
				description: "Feature from your Destruction Path.",
			},
			{
				level: 15,
				name: "Path Feature",
				description: "Feature from your Destruction Path.",
			},
			{
				level: 18,
				name: "Path Feature",
				description: "Feature from your Destruction Path.",
			},
			{
				level: 20,
				name: "Zenith Mandate",
				description:
					"Your status as an Ascendant is recognized globally at the Zenith Rank: [RANK: S — APEX ABSOLUTE POTENTIAL]. Your Aetheric Mark bonus becomes +1d8. Essence Harvest triggers on every kill (no rest limit). Unfettered Release lasts 2 rounds. Ascendant Bureau databases flag you as a national strategic asset.",
			},
		],
		abilities: [
			"Aetheric Mark",
			"Essence Harvest",
			"Unfettered Release",
			"Vulnerability Resonance",
			"Aetheric Realignment",
			"Destruction Path",
		],
		image: "/generated/compendium/jobs/warrior.webp",
		stats: {
			strength: 15,
			agility: 13,
			vitality: 14,
			intelligence: 10,
			sense: 12,
			presence: 8,
		},
		primary_abilities: ["Strength", "Vitality"],
		source: "Ascendant Compendium",
	},

	// 2. BERSERKER — Mana Overload Tank / Unstable Resonance
	{
		id: "berserker",
		name: "Berserker",
		type: "Job",
		rank: "C",
		description:
			"The Berserker is an Awakened identity that specializes in the Overload Tank and Unstable Resonance mandate. As an Ascendant of this lineage, their core is defined by an unstable connection to the Absolute, flooding their physiology with raw energy under stress. In the modern world, Berserkers are walking spectacles of power—visible mana veins flare across their skin as their muscles swell with crystallized essence. The Ascendant Bureau classifies them as high-risk but indispensable assets who specialized in the controlled demolition of high-rank gates.",
		hitDie: "1d12",
		primaryAbility: "Strength",
		saving_throws: ["Strength", "Vitality"],
		skillChoices: [
			"Animal Handling",
			"Athletics",
			"Intimidation",
			"Nature",
			"Perception",
			"Survival",
		],
		armorProficiencies: ["Light armor", "Medium armor", "Shields"],
		weaponProficiencies: ["Simple weapons", "Martial weapons"],
		tool_proficiencies: [],
		awakeningFeatures: [
			{
				name: "Mana-Dense Physiology",
				description:
					"Your cells are saturated with raw mana — hospital scales read 50% heavier than your frame should weigh. HP maximum increases by 1 per Berserker level. Normal chairs break under you.",
				level: 1,
			},
			{
				name: "Toxin Purge",
				description:
					"Your overcharged metabolism burns through foreign substances in minutes — anesthesia barely works, alcohol has no effect, and you metabolize medications before they kick in. Advantage on saves against poison; resistance to poison damage.",
				level: 1,
			},
			{
				name: "Feedback Frenzy",
				description:
					"In Overload, the mana feedback loop doubles your damage bonus but your higher brain functions shut down — you can't read, operate electronics, or have coherent conversations. Disadvantage on ability checks.",
				level: 3,
			},
			{
				name: "Mana Saturation",
				description:
					"In Overload, mana crystallizes under your skin like subdermal kevlar — bullets flatten on impact, blades bounce off. Resistance to all damage except psychic. You cannot be knocked unconscious while in Overload with 1+ HP.",
				level: 7,
			},
			{
				name: "Unstable Discharge",
				description:
					"In Overload, your weapon strikes arc with visible mana discharge — nearby electronics short out, phones reboot, and street lights flicker. Weapon attacks count as magical and deal extra 1d6 force damage.",
				level: 14,
			},
		],
		jobTraits: [
			{
				name: "Threat Reflex",
				description:
					"Your unstable Absolute resonance gives you split-second precognition — you flinch before a gun fires and dodge before a car crashes. Advantage on Agility saves against effects you can see while not blinded/deafened/incapacitated.",
				type: "passive",
			},
			{
				name: "Predator Instinct",
				description:
					"You react before conscious thought — security footage shows you moving before the threat appears on camera. Advantage on initiative. If surprised, your Overload triggers automatically and you act normally on the first turn.",
				type: "passive",
			},
			{
				name: "Mana Intimidation",
				description:
					"Your visible mana veins flare with threat — bystanders back away, animals flee, and smartphone cameras auto-focus on you. Frighten a creature within 30 ft (Sense save). Prof bonus uses per long rest.",
				type: "active",
				frequency: "long-rest",
			},
		],
		abilityScoreImprovements: { strength: 2, vitality: 1 },
		size: "medium",
		speed: 30,
		languages: ["English"],
		darkvision: 60,
		damage_resistances: ["poison"],
		startingEquipment: [
			["Greataxe", "Battleaxe"],
			["Handaxe"],
			["Handaxe"],
			["Explorer's Pack"],
			["Javelin"],
			["Javelin"],
			["Javelin"],
			["Javelin"],
		],
		hitPointsAtFirstLevel: "12 + your Vitality modifier",
		hitPointsAtHigherLevels:
			"1d12 (or 7) + your Vitality modifier per level after 1st",
		classFeatures: [
			{
				level: 1,
				name: "Overload State",
				description:
					"Bonus action: trigger an Absolute Surge — your veins glow, your muscles visibly swell, and nearby electronics emit static. Melee damage bonus = STR mod, resistance to bludgeoning/piercing/slashing, and HP temporarily increases by Berserker level (lost when Overload ends). 2/long rest, scaling to unlimited at 20th.",
			},
			{
				level: 1,
				name: "Mana-Hardened Body",
				description:
					"Crystallized mana reinforces your skin like built-in body armor — doctors describe your dermis as 'closer to carbon fiber than human tissue.' Without armor: AC = 10 + Agility mod + Vitality mod. Can use a shield.",
			},
			{
				level: 2,
				name: "Damage Conversion",
				description:
					"When you take damage in Overload, your mana loop converts pain into stored kinetic energy — your body visibly vibrates with accumulated force. Store it as Feedback (max = your level). On your next melee hit, release all stored Feedback as bonus force damage, then reset to 0.",
			},
			{
				level: 3,
				name: "Overload Path",
				description:
					"Choose how your instability manifests. Grants features at 3rd, 6th, 10th, and 14th level.",
			},
			{
				level: 4,
				name: "Ability Score Improvement",
				description: "You gain this at 4th, 8th, 12th, 16th, and 19th level.",
			},
			{
				level: 5,
				name: "Cascading Strikes",
				description:
					"Your mana-dense muscles generate chain reactions on impact — one devastating hit flows into the next. When you score a critical hit, immediately make one additional weapon attack against the same or a different target within reach.",
			},
			{
				level: 5,
				name: "Surge Momentum",
				description:
					"+10 ft speed while not in heavy armor. Your mana-dense legs crack pavement with each stride — CCTV footage shows you outrunning motorcycles in short bursts.",
			},
			{
				level: 6,
				name: "Path Feature",
				description: "Feature from your Overload Path.",
			},
			{
				level: 7,
				name: "Predator Instinct",
				description:
					"Advantage on initiative. If surprised while in Overload, act normally on the first turn.",
			},
			{
				level: 9,
				name: "Mana Shockwave",
				description:
					"Your hits generate concussive shockwaves — windows shatter, car alarms trigger, and bystanders feel the impact in their chest. Once per turn on melee hit, all creatures within 5 ft of target (other than you) take force damage = STR mod.",
			},
			{
				level: 10,
				name: "Path Feature",
				description: "Feature from your Overload Path.",
			},
			{
				level: 11,
				name: "Death Defiance",
				description:
					"At 0 HP in Overload, your mana loop fires one last emergency pulse — paramedics have documented Berserkers' hearts restarting mid-flatline. VIT save DC 10 (+5 each use) to drop to 1 HP instead.",
			},
			{
				level: 14,
				name: "Path Feature",
				description: "Feature from your Overload Path.",
			},
			{
				level: 15,
				name: "Sustained Overload",
				description:
					"Overload only ends when you fall unconscious or choose to end it. The mana feedback loop is self-sustaining — some Berserkers have maintained it for days, never sleeping, never eating, just fighting.",
			},
			{
				level: 18,
				name: "Absolute Strength",
				description:
					"You can flip armored vehicles and bend I-beams bare-handed. Any STR check below your STR score uses the score instead. Damage Conversion max stored increases to twice your level.",
			},
			{
				level: 20,
				name: "Zenith Singularity",
				description:
					"Your status as an Ascendant is recognized globally at the Zenith Rank: [RANK: S — ABSOLUTE SINGULARITY]. STR and VIT increase by 4 (max 24). Overload grants resistance to ALL damage. Mana Shockwave extends to 10 ft. The Ascendant Bureau classifies you as an extinction-level asset.",
			},
		],
		abilities: [
			"Overload State",
			"Mana-Hardened Body",
			"Damage Conversion",
			"Cascading Strikes",
			"Mana Shockwave",
			"Overload Path",
		],
		image: "/generated/compendium/jobs/berserker.webp",
		stats: {
			strength: 15,
			agility: 13,
			vitality: 14,
			intelligence: 8,
			sense: 12,
			presence: 10,
		},
		primary_abilities: ["Strength", "Vitality"],
		source: "Ascendant Compendium",
	},

	// 3. ASSASSIN — Dimensional Phase Operative / Umbral Walker
	{
		id: "assassin",
		name: "Assassin",
		type: "Job",
		rank: "B",
		description:
			"The Assassin is an Awakened identity that specializes in the Dimensional Phase Operative and Umbral Walker mandate. As an Ascendant of this lineage, their consciousness partially exists between realities, granting them the ability to phase through the physical world and strike from impossible angles. In the modern era, the Assassin is the supreme specialist in surgical rift-clearing and high-value target extraction within high-rank gates.",
		hitDie: "1d8",
		primaryAbility: "Agility",
		saving_throws: ["Agility", "Intelligence"],
		skillChoices: [
			"Acrobatics",
			"Athletics",
			"Deception",
			"Insight",
			"Intimidation",
			"Investigation",
			"Perception",
			"Performance",
			"Persuasion",
			"Sleight of Hand",
			"Stealth",
		],
		armorProficiencies: ["Light armor"],
		weaponProficiencies: [
			"Simple weapons",
			"Hand crossbows",
			"Longswords",
			"Rapiers",
			"Shortswords",
		],
		tool_proficiencies: ["Thieves' tools"],
		awakeningFeatures: [
			{
				name: "Phase-Shifted Mind",
				description:
					"Your consciousness partially exists between dimensions — brain scans show activity in regions that shouldn't exist. Lie detectors, interrogation drugs, and telepathy all fail. Advantage on saves against being charmed. Magic cannot put you to sleep.",
				level: 1,
			},
			{
				name: "Umbral Phase",
				description:
					"Step sideways through the dimensional membrane — security cameras capture you vanishing from one spot and appearing 30 ft away in a single frame. Teleport to dim light/darkness. Advantage on next melee attack after phasing. Prof bonus uses per long rest.",
				level: 3,
			},
			{
				name: "Lethal Geometry",
				description:
					"You see kill-angles that don't exist in normal three-dimensional space — your strikes arrive from directions that are physically impossible. When you Exploit Weakness with advantage, deal extra 1d6 damage (2d6 at 13th).",
				level: 7,
			},
			{
				name: "Kill Designation",
				description:
					"Bonus action: your Aetheric-Sight identifies your quarry: [RANK: S — LETHAL MANDATE AUTHORIZED]. Crits on 19-20 against it for 1 minute. Once per long rest.",
				level: 14,
			},
		],
		jobTraits: [
			{
				name: "Dimensional Sight",
				description:
					"Your phase-shifted eyes see through walls, around corners, and into dark rooms — optometrists can't explain the extra pupil layer. See in dim light as bright within 60 ft. Advantage on hearing-based Perception. Superior darkvision 120 ft.",
				type: "passive",
			},
			{
				name: "Phase Dodge",
				description:
					"Reaction: your body flickers out of sync with reality for a split second — bullets pass through where you were. Halve attack damage from an attacker you can see. Agility mod uses per long rest.",
				type: "active",
				frequency: "long-rest",
			},
			{
				name: "Ghost Walk",
				description:
					"You leave no footprints, trigger no motion sensors, and make no sound — even on gravel or broken glass. Security systems and guard dogs can't detect you. Advantage on Stealth in all conditions.",
				type: "passive",
			},
		],
		abilityScoreImprovements: { agility: 2, intelligence: 1 },
		size: "medium",
		speed: 30,
		languages: ["English", "Umbral Cant"],
		darkvision: 120,
		condition_immunities: ["magical sleep"],
		startingEquipment: [
			["Rapier", "Shortsword"],
			["Shortbow"],
			["Arrows (20)"],
			["Burglar's Pack", "Dungeoneer's Pack", "Explorer's Pack"],
			["Leather Armor"],
			["Dagger"],
			["Dagger"],
			["Thieves' Tools"],
		],
		hitPointsAtFirstLevel: "8 + your Vitality modifier",
		hitPointsAtHigherLevels:
			"1d8 (or 5) + your Vitality modifier per level after 1st",
		classFeatures: [
			{
				level: 1,
				name: "Specialist Training",
				description:
					"Your Awakening accelerates your learning in chosen fields — you master lockpicking, hacking, forgery, or surveillance in weeks instead of years. Double proficiency on two skill/tool proficiencies. Two more at 6th level.",
			},
			{
				level: 1,
				name: "Vulnerability Analysis",
				description:
					"Your Aetheric-Sight highlights the anatomical and structural weaknesses of any target you've observed, perceiving joints and arteries through a mana-resonant overlay. Deal bonus damage: 1d6 at 1st, scaling +1d6 every 2 Assassin levels (10d6 at 19th). Requires finesse or ranged weapon.",
			},
			{
				level: 1,
				name: "Umbral Cant",
				description:
					"A coded language used by ascendants in the umbral trade — encrypted dead drops, dark web forums, burner phone rites, and anonymous gate intelligence networks. You recognize the signs in any city.",
			},
			{
				level: 2,
				name: "Phase Shift",
				description:
					"Bonus action: slip between dimensions like stepping through a door that only you can see. Teleport up to 10 ft, or become Hidden if you end in dim light/darkness. Security cameras show a single frame of static.",
			},
			{
				level: 3,
				name: "Umbral Discipline",
				description:
					"Choose a specialization. Grants features at 3rd, 9th, 13th, and 17th level.",
			},
			{
				level: 4,
				name: "Ability Score Improvement",
				description:
					"You gain this at 4th, 8th, 10th, 12th, 16th, and 19th level.",
			},
			{
				level: 5,
				name: "Reflex Burst",
				description:
					"Reaction when hit: your body partially phases out of this dimension — the bullet/blade passes through what looks like a hologram. Halve the damage. If the attacker can't see you, negate it entirely.",
			},
			{
				level: 7,
				name: "Dimensional Slip",
				description:
					"When caught in an explosion or area effect, you step sideways through the membrane — the blast passes through empty space where you stood. No damage on successful AGI save, half on failure.",
			},
			{
				level: 9,
				name: "Discipline Feature",
				description: "Feature from your Umbral Discipline.",
			},
			{
				level: 11,
				name: "Absolute Precision",
				description:
					"Your internal resonance auto-corrects every micro-movement — you never fumble a lock pick, miss a keystroke, or misjudge a jump. Any proficient ability check: treat d20 rolls of 9 or lower as 10.",
			},
			{
				level: 13,
				name: "Discipline Feature",
				description: "Feature from your Umbral Discipline.",
			},
			{
				level: 14,
				name: "Dimensional Tremorsense",
				description:
					"You feel disturbances in the dimensional membrane like a spider feels its web vibrate — cloaked enemies, hidden snipers, and invisible gate creatures within 10 ft cannot hide from you.",
			},
			{
				level: 15,
				name: "Warded Mind",
				description:
					"Your consciousness exists partially outside normal reality — psychic attacks, interrogation magic, and mind-reading all bounce off. Gain proficiency in Sense saving throws.",
			},
			{
				level: 17,
				name: "Discipline Feature",
				description: "Feature from your Umbral Discipline.",
			},
			{
				level: 18,
				name: "Phantom Presence",
				description:
					"Your body constantly flickers between dimensions — even standing still, you appear slightly transparent, like bad reception on a TV. No attack has advantage against you while you aren't incapacitated.",
			},
			{
				level: 20,
				name: "Zenith Strike",
				description:
					"Once per short rest: the Aetheric-Weave bends probability around your strikes — your Aetheric-Sight displays [OUTCOME: GUARANTEED]. Turn any missed attack into a hit, or treat any failed check as a natural 20. Classified ascendants have used this to bypass bank vaults, dodge point-blank gunfire, and land impossible shots.",
			},
		],
		abilities: [
			"Specialist Training",
			"Vulnerability Analysis",
			"Phase Shift",
			"Reflex Burst",
			"Dimensional Slip",
			"Umbral Discipline",
		],
		image: "/generated/compendium/jobs/assassin.webp",
		stats: {
			strength: 10,
			agility: 15,
			vitality: 12,
			intelligence: 14,
			sense: 13,
			presence: 8,
		},
		primary_abilities: ["Agility", "Intelligence"],
		source: "Ascendant Compendium",
	},

	// 4. STRIKER — Neural Overdrive Combatant / Impulse Channeler
	{
		id: "striker",
		name: "Striker",
		type: "Job",
		rank: "A",
		description:
			"The Striker is an Awakened identity that specializes in the Neural Overdrive and Impulse Channeling mandate. As an Ascendant of this lineage, their entire nervous system was rewired into a mana-conductive network, allowing them to channel kinetic force through their limbs like living railguns. In modern society, Strikers are the premier rapid-response assets for urban gate eruptions, utilizing their impossible speed to neutralize threats with absolute precision.",
		hitDie: "1d8",
		primaryAbility: "Agility",
		saving_throws: ["Strength", "Agility"],
		skillChoices: [
			"Acrobatics",
			"Athletics",
			"History",
			"Insight",
			"Religion",
			"Stealth",
		],
		armorProficiencies: [],
		weaponProficiencies: ["Simple weapons", "Shortswords"],
		tool_proficiencies: [],
		awakeningFeatures: [
			{
				name: "Aetheric Overclock",
				description:
					"Your restructured nervous system auto-corrects physical errors faster than conscious thought — lab tests show your reaction time at 3 milliseconds, faster than any recorded human. When you roll a 1, you can reroll and must use the new result.",
				level: 1,
			},
			{
				name: "Fluid Physiology",
				description:
					"Your joints and muscles restructured for impossible flexibility — you can fold through car windows, slide under closing garage doors, and bend in ways that make physical therapists cry. Move through the space of any creature one size larger. Cannot be knocked prone.",
				level: 1,
			},
			{
				name: "Impulse Sense",
				description:
					"You detect the bioelectric fields of living things like a walking EKG machine — sense creatures within 120 ft through walls, behind cars, and underground. See invisible creatures by their nerve-impulse trail.",
				level: 1,
			},
			{
				name: "Autonomic Mastery",
				description:
					"Total control over your body's involuntary functions — you can stop your own heart to fool medical scanners, regulate your temperature in a blizzard, and suppress pain entirely. Walk on any surface including liquids while moving.",
				level: 3,
			},
			{
				name: "Force Channeling",
				description:
					"Convert raw mana into elemental force through your nerve gates — your fists can heat to 500°C, discharge like a taser, generate concussive blasts, or emit healing vibrations. Smartphone thermal cameras show your hands glowing.",
				level: 7,
			},
		],
		jobTraits: [
			{
				name: "Impulse Sense",
				description:
					"Perceive bioelectric auras like a living MRI — read emotional states, detect injuries, and sense other awakened ascendants within 120 ft. Detect invisible creatures by their nerve-impulse trail.",
				type: "passive",
			},
			{
				name: "Gyroscopic Core",
				description:
					"Your rewired vestibular system grants perfect balance — you can fight on a moving train, run across telephone wires, and stand still in a hurricane. Cannot be knocked prone. Walk on any surface including liquids while moving.",
				type: "resistance",
			},
			{
				name: "Kinetic Deflection",
				description:
					"Reaction: intercept incoming projectiles — bullets, arrows, thrown objects — with your bare hands. Reduce damage by 1d10+AGI mod+level. If reduced to 0, catch it and throw it back. Viral videos of Strikers catching bullets have billions of views.",
				type: "active",
				frequency: "at-will",
			},
		],
		abilityScoreImprovements: { agility: 2, sense: 1 },
		size: "medium",
		speed: 30,
		languages: ["English"],
		darkvision: 60,
		startingEquipment: [
			["Shortsword", "Handaxe"],
			["Dungeoneer's Pack", "Explorer's Pack"],
			["Darts (10)"],
		],
		hitPointsAtFirstLevel: "8 + your Vitality modifier",
		hitPointsAtHigherLevels:
			"1d8 (or 5) + your Vitality modifier per level after 1st",
		classFeatures: [
			{
				level: 1,
				name: "Kinetic Barrier",
				description:
					"Your nerve network generates a passive mana field visible as a faint shimmer in bright light — airport metal detectors go haywire when you walk through. Without armor or shield: AC = 10 + Agility mod + Sense mod.",
			},
			{
				level: 1,
				name: "Impulse Combat",
				description:
					"Your body is a weapon that passes through any security checkpoint. Use Agility for unarmed/Striker weapons. Unarmed damage: d4 (d6 at 5th, d8 at 11th, d10 at 17th). After taking the Attack action, make one unarmed strike as a bonus action.",
			},
			{
				level: 2,
				name: "Impulse Rites",
				description:
					"Impulse points = Striker level, short rest recharge. Activate specific nerve clusters through precise internal Rites — your eyes flash briefly when a gate opens. Rite of Speed (Dash/Disengage), Rite of Force (2 bonus strikes), Rite of Iron (Dodge). 1 impulse point each.",
			},
			{
				level: 2,
				name: "Impulse Acceleration",
				description:
					"+10 ft speed without armor (+15 at 6th, +20 at 10th, +25 at 14th, +30 at 18th). Speed-camera footage shows you as a blur. At 9th: run on walls and across water — your internal resonance generates micro-adhesion fields.",
			},
			{
				level: 3,
				name: "Combat Doctrine",
				description:
					"Choose a fighting doctrine. Grants features at 3rd, 6th, 11th, and 17th level.",
			},
			{
				level: 3,
				name: "Kinetic Deflection",
				description:
					"Reaction: snatch an incoming projectile from the air — even bullets at point-blank range. Reduce damage by 1d10+AGI mod+level. If reduced to 0, catch and hurl it back (1 impulse point, your attack bonus).",
			},
			{
				level: 4,
				name: "Ability Score Improvement",
				description: "You gain this at 4th, 8th, 12th, 16th, and 19th level.",
			},
			{
				level: 4,
				name: "Impact Dampening",
				description:
					"Your nerve network absorbs kinetic shock — you can jump off buildings and land in a crouch. Reaction: reduce fall damage by 5 × Striker level.",
			},
			{
				level: 5,
				name: "Velocity Chain",
				description:
					"Attack twice per Attack action. When both hits connect, your accumulated velocity converts to force — deal bonus force damage = movement speed ÷ 10. The faster you move, the harder you hit. Fight analysts call it 'the Bullet Train combo.'",
			},
			{
				level: 5,
				name: "Nerve Strike",
				description:
					"On melee hit, spend 1 impulse point to discharge aetheric energy directly into the target's mana-channels — like a biological overload. VIT save or stunned until end of your next turn.",
			},
			{
				level: 6,
				name: "Force-Laced Strikes",
				description:
					"Your fists crackle with visible mana discharge — sparking like arc welders on impact. Unarmed strikes count as magical and deal force damage instead of bludgeoning.",
			},
			{
				level: 7,
				name: "Accelerated Dodge",
				description:
					"Your processing speed lets you dodge explosions — high-speed cameras show you clearing the blast radius between frames. AGI save for half: no damage on success, half on failure.",
			},
			{
				level: 7,
				name: "Soul-Sanctum Ward",
				description:
					"Action: isolate and purge a mental intrusion through an Autonomic Rite — your internal resonance re-aligns your mana-flow circuits. End one charmed or frightened effect on yourself.",
			},
			{
				level: 10,
				name: "Aetheric-Purified Body",
				description:
					"Your mana network has purged all biological weakness — bloodwork comes back perfectly clean, no pathogens can survive in your system. Immune to disease and poison.",
			},
			{
				level: 13,
				name: "Universal Resonance",
				description:
					"Your aetheric network decodes all language patterns in real-time — you walk into any country and speak like a native within seconds. Understand all spoken languages; any creature that knows a language understands you.",
			},
			{
				level: 14,
				name: "Impulse Perfection",
				description:
					"Your aetheric network compensates for any failure — your body dodges poison, resists psychic intrusion, and shrugs off magic as automatically as breathing. Proficiency in all saves. Spend 1 impulse to reroll a failed save.",
			},
			{
				level: 15,
				name: "Suspended Aging",
				description:
					"Your mana network sustains your cells indefinitely — dermatologists and gerontologists can't explain why you haven't aged in years. No aging, can't be magically aged, no need for food or water.",
			},
			{
				level: 18,
				name: "Void State",
				description:
					"Open all impulse gates simultaneously — your body vibrates at a frequency that renders you invisible to the naked eye and most detection equipment. 4 points: invisible 1 min + resistance to all except force. 8 points: project consciousness to the Astral Plane.",
			},
			{
				level: 20,
				name: "Zenith Ascension",
				description:
					"Your status as an Ascendant is recognized globally at the Zenith Rank: [RANK: S — PERFECTED ABSOLUTE BIOLOGY]. Roll initiative with 0 impulse → regain 4. Velocity Chain adds full speed ÷ 5. The Ascendant Bureau ensures your secrets stay guarded from the reach of pharmaceutical giants.",
			},
		],
		abilities: [
			"Kinetic Barrier",
			"Impulse Combat",
			"Impulse Gates",
			"Velocity Chain",
			"Combat Doctrine",
			"Nerve Strike",
		],
		image: "/generated/compendium/jobs/monk.webp",
		stats: {
			strength: 13,
			agility: 15,
			vitality: 14,
			intelligence: 10,
			sense: 14,
			presence: 8,
		},
		primary_abilities: ["Agility", "Sense"],
		source: "Ascendant Compendium",
	},

	// 5. MAGE — Arcane Custodian / Aetheric Scholar
	{
		id: "mage",
		name: "Mage",
		type: "Job",
		rank: "C",
		description:
			"The Mage is an Awakened identity that specializes in the Arcane Custodian and Aetheric Scholar mandate. As an Ascendant of this lineage, their Awakening provides a direct attunement to the Aetheric-Weave—the fundamental tapestry of absolute magical phenomena. In the modern world, Mages treat magic with the analytical rigor of higher mathematics, optimizing their rites with a precision that defines the modern era of aetheric research.",
		hitDie: "1d6",
		primaryAbility: "Intelligence",
		saving_throws: ["Intelligence", "Sense"],
		skillChoices: [
			"Arcana",
			"History",
			"Insight",
			"Investigation",
			"Medicine",
			"Religion",
		],
		armorProficiencies: [],
		weaponProficiencies: [
			"Daggers",
			"Darts",
			"Slings",
			"Quarterstaffs",
			"Light crossbows",
		],
		tool_proficiencies: [],
		awakeningFeatures: [
			{
				name: "Mana-Shielded Cortex",
				description:
					"Your brain restructured to process the raw flow of the Aetheric-Weave — EEGs show neural activity patterns that don't match any known brain architecture. Advantage on INT, Sense, and Presence saves against spells and magical effects.",
				level: 1,
			},
			{
				name: "Aetheric-Sight Resonance",
				description:
					"Your vision perceives the flows of the Aetheric-Weave as visible streams of light. Sense magical energy, and automatically identify the school of any spell. Other Mages describe it as 'perceiving the architecture of creation.'",
				level: 1,
			},
			{
				name: "Parallel Processing",
				description:
					"Your mind runs multiple spell compilations simultaneously like a multi-core processor — Global Aetheric research divisions have clocked your cognitive throughput at 47x baseline human. Weave spell effects together and amplify power through sustained focus.",
				level: 3,
			},
			{
				name: "Aetheric-Parsing",
				description:
					"Analyze enemy spells as they're cast — your vision identifies structural flaws in an enemy's spellcraft as it manifests. Create counter-rites on the fly: instant-cast defenses and live resonance analysis.",
				level: 11,
			},
		],
		jobTraits: [
			{
				name: "Arcane Sight",
				description:
					"Perceive magical auras as shifting spectra of light, tuned to the resonance of the Aetheric-Weave. Auto-identify spell power levels. You can spot enchanted items in a pawn shop from across the room.",
				type: "passive",
			},
			{
				name: "Aetheric-Sanctum Mind",
				description:
					"Your mind is shielded by an innate resonance that flags and neutralizes hostile magic before it can take root. Resistance to psychic damage.",
				type: "resistance",
			},
			{
				name: "Optimized Rites",
				description:
					"Optimize a prepared rite through precise mental compilation — amplify damage, extend duration, or fork to additional targets. Your colleagues at the Bureau probably argue about whose resonance theories are superior. INT mod uses per long rest.",
				type: "active",
				frequency: "long-rest",
			},
		],
		abilityScoreImprovements: { intelligence: 2, sense: 1 },
		size: "medium",
		speed: 30,
		languages: ["English"],
		darkvision: 60,
		damage_resistances: ["psychic"],
		startingEquipment: [
			["Quarterstaff", "Dagger"],
			["Component Pouch", "Arcane Focus"],
			["Scholar's Pack", "Explorer's Pack"],
			["Grimoire"],
		],
		hitPointsAtFirstLevel: "6 + your Vitality modifier",
		hitPointsAtHigherLevels:
			"1d6 (or 4) + your Vitality modifier per level after 1st",
		spellcasting: {
			ability: "Intelligence",
			focus: "Arcane focus or grimoire",
			cantripsKnown: [
				3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
			],
			spellSlots: { ...FULL_CASTER_SLOTS },
		},
		classFeatures: [
			{
				level: 1,
				name: "Resonance Alignment",
				description:
					"Prepare Mage spells using Intelligence — you align spell rites from your digital grimoire each morning like a specialist loading a configuration. You can modify one prepared spell per long rest: swap its damage type to any other you've catalogued.",
			},
			{
				level: 1,
				name: "Resonance Deconstruction",
				description:
					"When you observe a spell cast — even by a gate boss — you can attempt to deconstruct its resonance. Intelligence check DC 10 + spell level: success lets you add it to your grimoire during your next rest (normal copying cost). Short rest: recover one spell slot ≤ half Mage level. Once per day.",
			},
			{
				level: 2,
				name: "Arcane Specialization",
				description:
					"Choose a school of magic to specialize in. Features at 2nd, 6th, 10th, and 14th level.",
			},
			{
				level: 4,
				name: "Ability Score Improvement",
				description: "You gain this at 4th, 8th, 12th, 16th, and 19th level.",
			},
			{
				level: 6,
				name: "Specialization Feature",
				description: "Feature from your Arcane Specialization.",
			},
			{
				level: 8,
				name: "Spell Layering",
				description:
					"Your multi-threaded mind can run two concentration spells simultaneously — like dual-screening but with reality-altering magic. Maintain a second concentration spell of 3rd level or lower. If you take damage, make a separate concentration check for each.",
			},
			{
				level: 10,
				name: "Specialization Feature",
				description: "Feature from your Arcane Specialization.",
			},
			{
				level: 14,
				name: "Specialization Feature",
				description: "Feature from your Arcane Specialization.",
			},
			{
				level: 18,
				name: "Permanent Tuning",
				description:
					"Choose one 1st-level and one 2nd-level spell. These are permanently attuned to your soul resonance — cast them without a slot, at will. They exist as ambient flows within your consciousness.",
			},
			{
				level: 20,
				name: "Zenith Ascension",
				description:
					"Your status as an Ascendant is recognized globally at the Zenith Rank: [RANK: S — ABSOLUTE AUTHORITY]. Two 3rd-level spells are always prepared; cast each once without a slot per short rest. Once per long rest, cast any spell in your grimoire without expending a slot (max 7th level). Universities and academies globally seek your patronage.",
			},
		],
		abilities: [
			"Lattice Compilation",
			"Spell Deconstruction",
			"Spell Layering",
			"Permanent Cache",
			"Specialization Rite",
		],
		image: "/generated/compendium/jobs/mage.webp",
		stats: {
			strength: 8,
			agility: 14,
			vitality: 13,
			intelligence: 15,
			sense: 12,
			presence: 10,
		},
		primary_abilities: ["Intelligence", "Sense"],
		source: "Ascendant Compendium",
	},

	// 6. ESPER — Reality Distorter / Unfiltered Vessel
	{
		id: "esper",
		name: "Esper",
		type: "Job",
		rank: "B",
		description:
			"The Esper is an Awakened identity that specializes in the Reality Distorter and Unfiltered Vessel mandate. As the SA version of a Sorcerer, their connection to the Aetheric-Weave is raw and volatile—mana bleeds from their body like radiation, reshaping reality through sheer willpower. In modern society, Espers are celebrities and pariahs in equal measure; their aetheric flares reshape the tapestry of existence with absolute authority.",
		hitDie: "1d6",
		primaryAbility: "Presence",
		saving_throws: ["Vitality", "Presence"],
		skillChoices: [
			"Arcana",
			"Deception",
			"Insight",
			"Intimidation",
			"Persuasion",
			"Religion",
		],
		armorProficiencies: [],
		weaponProficiencies: [
			"Daggers",
			"Darts",
			"Slings",
			"Quarterstaffs",
			"Light crossbows",
		],
		tool_proficiencies: [],
		awakeningFeatures: [
			{
				name: "Mana-Saturated Body",
				description:
					"Your cells leak ambient magic — Geiger counters spike near you, compasses spin, and your skin faintly glows in dark rooms. HP maximum increases by 1 per Esper level.",
				level: 1,
			},
			{
				name: "Unstable Reactor",
				description:
					"Your mana output is volatile — you've accidentally set off car alarms, shattered windows, and crashed Wi-Fi networks just by sneezing. After casting a 1st+ spell, roll d20; on a 1, a random mana surge erupts from your body.",
				level: 1,
			},
			{
				name: "Willpower Amplifier",
				description:
					"When you spend flux to reshape a spell, the excess mana bleeds through as raw force — bystanders feel a pressure wave and phones display static. Add Presence mod as bonus damage to one target.",
				level: 6,
			},
			{
				name: "Reality Distortion",
				description:
					"Your mana field warps probability in a 10-ft radius — coins land on edge, dice roll sixes, and weather changes when you're emotional. Reroll all damage dice for a spell and take the higher result per die. Once per long rest.",
				level: 14,
			},
		],
		jobTraits: [
			{
				name: "Mana Sensitivity",
				description:
					"Your open mana pathways work like a passive radar — enchanted objects hum when you walk by, hidden gates tingle at the back of your skull, and you can tell if someone's an awakened ascendant from across a crowded subway car. Sense magical effects within 30 ft. Identify any observed spell's school.",
				type: "passive",
			},
			{
				name: "Anomalous Resistance",
				description:
					"Your mind is so saturated with raw mana that external influence slides off like water on oil — hypnotists, marketing algorithms, and charm spells all fail. Advantage on saves vs charm; magic cannot put you to sleep.",
				type: "resistance",
			},
			{
				name: "Focused Discharge",
				description:
					"Spend 1 flux when casting to spike your mana output — the air crackles, hair stands on end, and the target's defenses overload. Force disadvantage on the first save against your spell.",
				type: "active",
				frequency: "at-will",
			},
		],
		abilityScoreImprovements: { presence: 2, vitality: 1 },
		size: "medium",
		speed: 30,
		languages: ["English"],
		darkvision: 60,
		damage_resistances: ["force"],
		startingEquipment: [
			["Light Crossbow", "Dagger"],
			["Crossbow Bolts (20)"],
			["Component Pouch", "Arcane Focus"],
			["Dungeoneer's Pack", "Explorer's Pack"],
			["Dagger"],
			["Dagger"],
		],
		hitPointsAtFirstLevel: "6 + your Vitality modifier",
		hitPointsAtHigherLevels:
			"1d6 (or 4) + your Vitality modifier per level after 1st",
		spellcasting: {
			ability: "Presence",
			focus: "Arcane focus",
			cantripsKnown: [
				4, 4, 4, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
			],
			spellsKnown: [
				2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 13, 13, 14, 14, 15, 15, 15, 15,
			],
			spellSlots: { ...FULL_CASTER_SLOTS },
		},
		classFeatures: [
			{
				level: 1,
				name: "Innate Channeling",
				description:
					"Cast Esper spells using Presence — you never studied magic; it just happens when you want it to, like flexing a muscle you didn't know you had. When you cast a damage spell, you may change its type to force — your raw mana overwrites the spell's elemental code.",
			},
			{
				level: 1,
				name: "Anomaly Source",
				description:
					"Choose the origin of your anomalous awakening. Features at 1st, 6th, 14th, and 18th level.",
			},
			{
				level: 2,
				name: "Flux Pool",
				description:
					"Flux points = Esper level — your internal mana reactor cycles between states like a nuclear power plant. Overcharge (add 1d6 per flux to spell damage, max 3), Absorb (convert a slot into flux = slot level), or Manifest (create a slot by spending flux = slot level +1).",
			},
			{
				level: 3,
				name: "Reality Sculpting",
				description:
					"Choose 2 sculpting techniques — you reshape spells mid-cast like a potter shaping clay, except the clay is reality. Warp: reshape area (cone→sphere→line). Bend: cast around corners, ignoring cover. Fork: split a single-target spell to hit two targets at half damage. More at 10th and 17th.",
			},
			{
				level: 4,
				name: "Ability Score Improvement",
				description: "You gain this at 4th, 8th, 12th, 16th, and 19th level.",
			},
			{
				level: 6,
				name: "Anomaly Feature",
				description: "Feature from your Anomaly Source.",
			},
			{
				level: 10,
				name: "Mana Feedback Loop",
				description:
					"When a creature resists your spell, the rejected mana bounces back into your reactor — like regenerative braking on an electric car. Regain 1 flux point on each successful enemy save.",
			},
			{
				level: 14,
				name: "Anomaly Feature",
				description: "Feature from your Anomaly Source.",
			},
			{
				level: 18,
				name: "Anomaly Feature",
				description: "Feature from your Anomaly Source.",
			},
			{
				level: 20,
				name: "Zenith Awakening",
				description:
					"Your status as an Ascendant is recognized globally at the Zenith Rank: [RANK: S — ABSOLUTE SINGULARITY]. Regain 4 flux on short rest. Once per long rest, Overcharge with no flux limit — spend any amount, adding 1d6 per point. Satellite imagery of the Ascendant Bureau captures the visible mana-flare when you go all-out. Government agencies maintain deep files on your potential.",
			},
		],
		abilities: [
			"Innate Channeling",
			"Anomaly Source",
			"Flux Pool",
			"Reality Sculpting",
			"Mana Feedback Loop",
		],
		image: "/generated/compendium/jobs/tank.webp",
		stats: {
			strength: 8,
			agility: 13,
			vitality: 14,
			intelligence: 10,
			sense: 12,
			presence: 15,
		},
		primary_abilities: ["Presence", "Vitality"],
		source: "Ascendant Compendium",
	},

	// 7. REVENANT — Mandated of Marthos / Void-Breath Reaper
	{
		id: "revenant",
		name: "Revenant",
		type: "Job",
		rank: "A",
		description:
			"The Revenant is an Awakened identity granted the mandate of the Marthos Reaper. As an Ascendant of this lineage, they are the living vessels of the Void-Breath, authorized by the Dragon-King Marthos to unmake the corrupted and the fallen. They do not merely kill; they dissolve the very essence of their enemies into the entropy layer. In modern society, Revenants are figures of cold awe—where they walk, the air grows still and the weak-hearted feel the weight of their mortal end. They are the ultimate cleanup crew for the Ascendant Bureau, tasked with erasing gate breaks that threaten to consume reality.",
		hitDie: "1d6",
		primaryAbility: "Intelligence",
		saving_throws: ["Intelligence", "Sense"],
		skillChoices: [
			"Arcana",
			"History",
			"Insight",
			"Investigation",
			"Medicine",
			"Religion",
		],
		armorProficiencies: [],
		weaponProficiencies: [
			"Daggers",
			"Darts",
			"Slings",
			"Quarterstaffs",
			"Light crossbows",
		],
		tool_proficiencies: [],
		awakeningFeatures: [
			{
				name: "Mandate of the End-Cycle",
				description:
					"Your Awakening occurred at the threshold of the Void. Your physiology is saturated with entropy-mana, granting you resistance to necrotic and force damage. You do not need to breathe, eat, or drink, and you have advantage on saves against being unmade.",
				level: 1,
			},
			{
				name: "Reaper's Resilience",
				description:
					"You have already touched the Void—you have the hospital records to prove it from your moment of Awakening. Advantage on death saves. When stabilized, regain 1 HP instead of 0. Immune to the frightened condition.",
				level: 1,
			},
			{
				name: "Void-Dissension Aura",
				description:
					"The Aetheric-Weave surrounding you is destabilized by your presence. Nonmagical objects and lifeforms within 10 ft suffer accelerated decay. Non-Awakened individuals feel a primal urge to keep their distance; milk spoils and batteries drain in your wake.",
				level: 1,
			},
			{
				name: "Soul Reaping",
				description:
					"When you deal necrotic damage, the target's life force is reaped into your vessel as raw mana. Regain HP = half the necrotic dealt. Once per turn.",
				level: 14,
			},
		],
		jobTraits: [
			{
				name: "Aetheric-Sight: Entropy-Tuned",
				description:
					"You perceive the fading life-force and structural decay of all things. Sense dying creatures and undead within 120 ft, even through walls. Know the exact health of any creature below half their maximum.",
				type: "passive",
			},
			{
				name: "Necrotic Shell",
				description:
					"Your reconstructed body is saturated with entropy — bioweapons, radiation, and necrotic attacks treat you like a wall. Resistance to necrotic damage. Immune to HP max reduction effects.",
				type: "resistance",
			},
			{
				name: "Voice of the Void",
				description:
					"Speak with the lingering echoes of the deceased at will. The dead recognize you as a Mandated Reaper and answer truthfully. Cold case detectives and Bureau investigators often seek your insight.",
				type: "active",
				frequency: "at-will",
			},
		],
		abilityScoreImprovements: { intelligence: 2, vitality: 1 },
		size: "medium",
		speed: 30,
		languages: ["English"],
		darkvision: 120,
		damage_resistances: ["necrotic"],
		condition_immunities: ["frightened"],
		startingEquipment: [
			["Quarterstaff", "Dagger"],
			["Component Pouch", "Arcane Focus"],
			["Scholar's Pack", "Explorer's Pack"],
			["Grimoire"],
		],
		hitPointsAtFirstLevel: "6 + your Vitality modifier",
		hitPointsAtHigherLevels:
			"1d6 (or 4) + your Vitality modifier per level after 1st",
		spellcasting: {
			ability: "Intelligence",
			focus: "Arcane focus or grimoire",
			cantripsKnown: [
				3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
			],
			spellSlots: { ...FULL_CASTER_SLOTS },
		},
		classFeatures: [
			{
				level: 1,
				name: "Rite of Dissolution",
				description:
					"Perform specialized entropy rites using Intelligence — your grimoire is a record of everything reaped. Your necrotic rites ignore resistance. Below half HP, your power surges: your spell save DC increases by 1.",
			},
			{
				level: 1,
				name: "Final Harvest",
				description:
					"When a creature falls within 60 ft, you passively absorb its fading resonance. Gain temp HP = creature's Rank (level equivalent) + Intelligence mod. Once per round.",
			},
			{
				level: 2,
				name: "Reaping Specialization",
				description:
					"Choose a Reaping discipline — each manifests differently in the field. Half cost/time to copy necromancy rites. When you unmake a target with a necromancy rite, decay chain-reacts: one creature within 10 ft takes necrotic damage equal to your INT mod. Features at 2nd, 6th, 10th, and 14th.",
			},
			{
				level: 4,
				name: "Ability Score Improvement",
				description: "You gain this at 4th, 8th, 12th, 16th, and 19th level.",
			},
			{
				level: 6,
				name: "Entropy Discipline Feature",
				description: "Feature from your Entropy Specialization.",
			},
			{
				level: 8,
				name: "Breath of Dissolution",
				description:
					"Once per long rest, emit a 20-ft radius field of accelerated entropy—the signature of Marthos's Void-Breath. For 1 min: enemies starting their turn in it take necrotic damage equal to your proficiency bonus + INT mod. Enemy healing in the field is halved.",
			},
			{
				level: 10,
				name: "Entropy Discipline Feature",
				description: "Feature from your Entropy Specialization.",
			},
			{
				level: 14,
				name: "Entropy Discipline Feature",
				description: "Feature from your Entropy Specialization.",
			},
			{
				level: 16,
				name: "Death's Door",
				description:
					"When you drop to 0 HP, you don't fall unconscious until the end of your next turn — you've been dead before and it holds no power over you. Act normally during this time. Regain any HP before then to stabilize. Once per long rest.",
			},
			{
				level: 18,
				name: "Permanent Reaping",
				description:
					"Choose one 1st and one 2nd-level spell. These are permanently attuned to your internal resonance — cast them without a slot, at will. They exist as ambient flows within your consciousness.",
			},
			{
				level: 20,
				name: "Zenith Avatar of Marthos",
				description:
					"Your status as an Ascendant is recognized globally at the Zenith Rank: [RANK: S — AVATAR OF THE VOID-BREATH]. Breath of Dissolution becomes at-will. Below half HP, your necrotic rites deal bonus damage equal to your INT mod. The Ascendant Bureau lists you as a localized end-cycle occurrence. You are the final harvest.",
			},
		],
		abilities: [
			"Entropy Mandate",
			"Death Harvest",
			"Entropy Specialization",
			"Decay Field",
			"Death's Door",
		],
		image: "/generated/compendium/jobs/necromancer.webp",
		stats: {
			strength: 8,
			agility: 14,
			vitality: 13,
			intelligence: 15,
			sense: 12,
			presence: 10,
		},
		primary_abilities: ["Intelligence", "Vitality"],
		source: "Ascendant Compendium",
	},

	// 8. SUMMONER — Scion of the Hive / Gate Ecologist
	{
		id: "summoner",
		name: "Summoner",
		type: "Job",
		rank: "B",
		description:
			"The Summoner is an Awakened identity granted the mandate of the Hive-Mother. As an Ascendant of this lineage, their mana is harmonized with the extraterrestrial ecosystems that bleed through the gates. They do not merely fight; they command the very flora and fauna of the dungeon dimensions. In modern society, Summoners are the premier ecologists of the Ascendant Bureau, serving as the bridge between human civilization and the rapidly evolving lifeforms of the Gate-Era. They shapeshift into gate creatures, command gate environments, and are the only ascendants who can predict boss spawns by reading resonance markers.",
		hitDie: "1d8",
		primaryAbility: "Sense",
		saving_throws: ["Intelligence", "Sense"],
		skillChoices: [
			"Arcana",
			"Animal Handling",
			"Insight",
			"Medicine",
			"Nature",
			"Perception",
			"Religion",
			"Survival",
		],
		armorProficiencies: ["Light armor", "Medium armor", "Shields (non-metal)"],
		weaponProficiencies: [
			"Clubs",
			"Daggers",
			"Darts",
			"Javelins",
			"Maces",
			"Quarterstaffs",
			"Scimitars",
			"Sickles",
			"Slings",
			"Spears",
		],
		tool_proficiencies: ["Herbalism kit"],
		awakeningFeatures: [
			{
				name: "Biome Attunement",
				description:
					"Your body adapted to gate ecosystems — you can breathe gate atmosphere that would kill normal humans, and your immune system shrugs off alien pathogens. Advantage on saves vs poison/disease. Resistance to poison damage.",
				level: 1,
			},
			{
				name: "Gate Ecology Sense",
				description:
					"Communicate with beasts and plant creatures — stray dogs follow you, pigeons land on your shoulder, and houseplants lean toward you. Sense gate openings within 1 mile by reading ecosystem stress patterns the way a meteorologist reads weather radar.",
				level: 1,
			},
			{
				name: "Stabilized Entity Shift",
				description:
					"When you assume entity form, your body retains more coherence. Entity forms gain temp HP = Summoner level. Maintain concentration while shifted.",
				level: 6,
			},
			{
				name: "Reinforced Summons",
				description:
					"Creatures you conjure from gate spaces are reinforced with your mana. They gain extra HP = prof bonus and deal extra 1d4 force damage.",
				level: 10,
			},
		],
		jobTraits: [
			{
				name: "Biome Link",
				description:
					"You speak the primal language of gate ecosystems — zoo animals calm when you enter, feral gate creatures hesitate, and plants in your apartment thrive suspiciously well. Communicate with beasts and plants at all times.",
				type: "passive",
			},
			{
				name: "Toxin Resistance",
				description:
					"Your biome-attuned metabolism neutralizes poisons. Advantage on saves vs poison. Resistance to poison damage.",
				type: "resistance",
			},
			{
				name: "Familiar Summon",
				description:
					"Expend an Entity Shift use to summon a gate-native familiar (fey form) without material components.",
				type: "active",
				frequency: "short-rest",
			},
		],
		abilityScoreImprovements: { sense: 2, vitality: 1 },
		size: "medium",
		speed: 30,
		languages: ["English", "Gate Speak"],
		darkvision: 60,
		damage_resistances: ["poison"],
		startingEquipment: [
			["Shield", "Spear"],
			["Scimitar", "Mace"],
			["Leather Armor"],
			["Explorer's Pack"],
			["Primal Focus"],
		],
		hitPointsAtFirstLevel: "8 + your Vitality modifier",
		hitPointsAtHigherLevels:
			"1d8 (or 5) + your Vitality modifier per level after 1st",
		spellcasting: {
			ability: "Sense",
			focus: "Primal focus",
			cantripsKnown: [
				2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
			],
			spellSlots: { ...FULL_CASTER_SLOTS },
		},
		classFeatures: [
			{
				level: 1,
				name: "Gate Speak",
				description:
					"Know the primal language shared across gate ecosystems — you read gate biome markers the way a tracker reads footprints. Leave and spot hidden biological signals. Sense the rank and type of any gate within 1 mile — the Ascendant Bureau's Ecology Division relies on Summoners for gate classification.",
			},
			{
				level: 1,
				name: "Primal Channeling",
				description:
					"Cast Summoner spells using Sense. Prepare from the full Summoner list each day.",
			},
			{
				level: 2,
				name: "Entity Shift",
				description:
					"Absorb biome data from gate creatures you've studied — field researchers document each form in your growing catalogue. Assume their form 2/short rest. Max CR 1/4 at 2nd (1/2 swim at 4th, CR 1 fly at 8th). You permanently retain one sensory ability from each form (e.g., wolf scent enhances your nose even in human form). Biologists are fascinated.",
			},
			{
				level: 2,
				name: "Affinity Circle",
				description:
					"Choose a primal affinity — your connection to a specific gate biome type. Features at 2nd, 6th, 10th, and 14th level.",
			},
			{
				level: 4,
				name: "Ability Score Improvement",
				description: "You gain this at 4th, 8th, 12th, 16th, and 19th level.",
			},
			{
				level: 6,
				name: "Affinity Feature",
				description: "Feature from your Affinity Circle.",
			},
			{
				level: 8,
				name: "Biome Command",
				description:
					"Once per long rest, reshape the local environment in a 60-ft radius — concrete cracks as roots erupt, temperature shifts 40 degrees in seconds, fog rolls in from nowhere. Create difficult terrain, change temperature (1d6 cold/fire per turn), create concealment, or purify the area. At 14th level, use twice per long rest.",
			},
			{
				level: 10,
				name: "Affinity Feature",
				description: "Feature from your Affinity Circle.",
			},
			{
				level: 14,
				name: "Affinity Feature",
				description: "Feature from your Affinity Circle.",
			},
			{
				level: 18,
				name: "Hybrid Casting",
				description:
					"Cast spells while in Entity Shift form. Your shifted body integrates spell components into its biology — no V/S/M components needed (except costly materials).",
			},
			{
				level: 18,
				name: "Suspended Biology",
				description:
					"Your biome-bonded body ages at 1/10th rate. Cannot be magically aged. You adapt to any environment automatically (temperature, pressure, atmosphere).",
			},
			{
				level: 20,
				name: "Zenith Archon of the Swarm",
				description:
					"Your status as an Ascendant is recognized globally at the Zenith Rank: [RANK: S — RADIANT NEXUS OF THE HIVE]. Unlimited Entity Shift uses. Forms can be any creature you've encountered (max CR = half level). Biome Command becomes at-will. Global environmental agencies and the UN consult you on gate ecosystem policy. Your bond with the gate biomes is absolute.",
			},
		],
		abilities: [
			"Gate Speak",
			"Primal Channeling",
			"Entity Shift",
			"Biome Command",
			"Affinity Circle",
		],
		image: "/generated/compendium/jobs/summoner.webp",
		stats: {
			strength: 10,
			agility: 12,
			vitality: 14,
			intelligence: 13,
			sense: 15,
			presence: 8,
		},
		primary_abilities: ["Sense", "Vitality"],
		source: "Ascendant Compendium",
	},

	// 9. HERALD — Divine Radiance / System Decree Conduit
	{
		id: "herald",
		name: "Herald",
		type: "Job",
		rank: "B",
		description:
			"The Herald is an Awakened identity that specializes in the Divine Radiance mandate. As an Ascendant of this lineage, they serve as the direct conduits for the Absolute's restorative and protective mandates. In modern society, Heralds are the most celebrated healers, their presence a beacon of hope at gate-break sites and busy multi-specialty hospitals. They channel pure Aetheric light, guided by an intuitive resonance that identifies wounds and fractures before the eye can see them. They are the living bridge between the mortal realm and the Absolute authority.",
		hitDie: "1d8",
		primaryAbility: "Sense",
		saving_throws: ["Sense", "Presence"],
		skillChoices: ["History", "Insight", "Medicine", "Persuasion", "Religion"],
		armorProficiencies: ["Light armor", "Medium armor", "Shields"],
		weaponProficiencies: ["Simple weapons"],
		tool_proficiencies: [],
		awakeningFeatures: [
			{
				name: "Restoration Mandate",
				description:
					"Your hands channel the Absolute's restorative resonance — visible as a warm golden glow that hospital patients and trauma victims find deeply comforting. As an action, touch a creature and restore HP = Herald level. Once per long rest.",
				level: 1,
			},
			{
				name: "Aetheric-Sight Connection",
				description:
					"Direct attunement to the Absolute's governing mandate — you receive resonance bursts that feel like intuition, guiding your hands to wounds and your rites to where they're needed most. Action touch: heal 1d8 + Sense mod HP. Prof bonus uses per long rest.",
				level: 1,
			},
			{
				name: "Absolute Connection",
				description:
					"Your resonance radiates outward. Allies within 10 ft gain +1 to saves (+2 at 11th). Range 30 ft at 18th.",
				level: 6,
			},
			{
				name: "Direct Petition",
				description:
					"Petition the Absolute directly for intervention. At 20th level, the Absolute always responds.",
				level: 10,
			},
		],
		jobTraits: [
			{
				name: "Entity Detection",
				description:
					"Your Absolute attunement flags hostile entities through an intuitive resonance—you get an internal ping when fiends, celestials, or undead are within 60 ft. Know type but not identity.",
				type: "passive",
			},
			{
				name: "Resonance Hardening",
				description:
					"Your Absolute connection reinforces your life force like a spiritual sanctum — death energy and radiant surges are harmonized before reaching your core. Resistance to necrotic and radiant. Advantage on saves vs HP max reduction.",
				type: "resistance",
			},
			{
				name: "Purge Mandate",
				description:
					"Action: broadcast an Absolute purge resonance — visible as a pulse of golden light that makes undead recoil like cockroaches from a flashlight. Undead within 30 ft: Sense save or turned 1 min. Destroy low-CR undead at 5th+.",
				type: "active",
				frequency: "short-rest",
			},
		],
		abilityScoreImprovements: { sense: 2, presence: 1 },
		size: "medium",
		speed: 30,
		languages: ["English"],
		darkvision: 60,
		damage_resistances: ["necrotic", "radiant"],
		startingEquipment: [
			["Mace", "Warhammer"],
			["Scale Mail", "Leather Armor", "Chain Mail"],
			["Light Crossbow", "Mace"],
			["Crossbow Bolts (20)"],
			["Priest's Pack", "Explorer's Pack"],
			["Shield"],
			["Absolute Focus"],
		],
		hitPointsAtFirstLevel: "8 + your Vitality modifier",
		hitPointsAtHigherLevels:
			"1d8 (or 5) + your Vitality modifier per level after 1st",
		spellcasting: {
			ability: "Sense",
			focus: "Absolute focus",
			cantripsKnown: [
				3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
			],
			spellSlots: { ...FULL_CASTER_SLOTS },
		},
		classFeatures: [
			{
				level: 1,
				name: "Aetheric Transmission",
				description:
					"Receive and cast Herald spells using Sense. Prepare from the full list each day. When you heal a creature with a rite, they also gain temp HP equal to your Sense mod — the Absolute reinforces what you restore.",
			},
			{
				level: 1,
				name: "Divine Mandate",
				description:
					"Choose a Divine Mandate — the specific frequency of Aetheric energy you channel. Bonus spells and features at 1st, 2nd, 6th, 8th, and 17th level.",
			},
			{
				level: 2,
				name: "Mandate Activation",
				description:
					"Channel raw Absolute energy for powerful effects: Purge Mandate (undead/fiends in 30 ft make Sense save or are turned 1 min) + one mandate-specific ability. 1/short rest (2 at 6th, 3 at 18th).",
			},
			{
				level: 4,
				name: "Ability Score Improvement",
				description: "You gain this at 4th, 8th, 12th, 16th, and 19th level.",
			},
			{
				level: 5,
				name: "Frequency Amplification",
				description:
					"Purge resonance now destroys weak undead outright (CR ≤ 1/2 at 5th, 1 at 8th, 2 at 11th, 3 at 14th, 4 at 17th). Your Absolute connection broadcasts at higher power.",
			},
			{
				level: 6,
				name: "Mandate Feature",
				description: "Feature from your Divine Mandate.",
			},
			{
				level: 8,
				name: "Mandate Feature",
				description: "Feature from your Divine Mandate.",
			},
			{
				level: 10,
				name: "Direct Petition",
				description:
					"Once per long rest, petition the Absolute directly. Roll d100 ≤ Herald level for the Absolute to intervene with an effect of the Warden's choosing. Your connection reaches the Absolute core.",
			},
			{
				level: 14,
				name: "Mana Redistribution",
				description:
					"When you cast a healing spell of 1st+, you can simultaneously purge one spell effect or condition on the target — the Absolute overwrites the affliction like realigning corrupted frequencies. Emergency rooms with Herald staff have the highest survival rates in the world.",
			},
			{
				level: 17,
				name: "Mandate Feature",
				description: "Final feature from your Divine Mandate.",
			},
			{
				level: 20,
				name: "Zenith Herald of the Absolute",
				description:
					"Your status as an Ascendant is recognized globally at the Zenith Rank: [RANK: S — ABSOLUTE MANDATE]. Direct Petition succeeds automatically. Once per long rest, cast any Herald rite without a slot (max 7th). Your resonance with the Absolute core is total; hospital networks and global agencies seek your intervention.",
			},
		],
		abilities: [
			"Absolute Transmission",
			"Absolute Mandate",
			"Mandate Activation",
			"Direct Petition",
			"Mana Redistribution",
		],
		image: "/generated/compendium/jobs/healer.webp",
		stats: {
			strength: 12,
			agility: 10,
			vitality: 14,
			intelligence: 13,
			sense: 15,
			presence: 8,
		},
		primary_abilities: ["Sense", "Presence"],
		source: "Ascendant Compendium",
	},

	// 10. CONTRACTOR — Entity Broker / Gate Pact Negotiator
	{
		id: "contractor",
		name: "Contractor",
		type: "Job",
		rank: "B",
		description:
			"The Contractor is an Awakened identity that specializes in the Entity Broker and Gate Pact Negotiator mandate. As an Ascendant of this lineage, their power is forged through supernatural NDAs and legal-magical bargains regulated by modern contract law. The entity grants power; the Contractor provides service (often gate-clearance kills that feed the entity). Many Contractors work as lobbyists, fixers, or high-end consultants, leveraging their patron's influence in both the gate world and boardrooms.",
		hitDie: "1d8",
		primaryAbility: "Presence",
		saving_throws: ["Sense", "Presence"],
		skillChoices: [
			"Arcana",
			"Deception",
			"History",
			"Intimidation",
			"Investigation",
			"Nature",
			"Religion",
		],
		armorProficiencies: ["Light armor"],
		weaponProficiencies: ["Simple weapons"],
		tool_proficiencies: [],
		awakeningFeatures: [
			{
				name: "Pact-Warded Mind",
				description:
					"Your patron's mark shields your consciousness like a supernatural restraining order — other entities can't touch you, and even real-world manipulation (sales pitches, propaganda, interrogation) slides off. Advantage on saves vs charm. Lesser entities cannot override your patron's claim.",
				level: 1,
			},
			{
				name: "Entity Awareness",
				description:
					"You can sense when someone else has a pact — at business meetings, in courtrooms, even on the subway. Detect otherworldly entities, active contracts, and gate-bound creatures within 100 ft. Concentrate 1 min to determine pact type and entity rank.",
				level: 1,
			},
			{
				name: "Empowered Conduit",
				description:
					"Your patron reinforces your attacks. When you hit with your signature blast, push the target 10 ft and add Presence mod as bonus force damage.",
				level: 5,
			},
			{
				name: "Patron's Boon",
				description:
					"Your entity grants a permanent gift: resistance to one damage type of your choice, changeable on long rest as you renegotiate terms.",
				level: 14,
			},
		],
		jobTraits: [
			{
				name: "Umbral-Sight Resonance",
				description:
					"Your patron's influence rewired your vision—you see perfectly in total darkness, including inside absolute voids where other ascendants stumble. Superior darkvision 120 ft.",
				type: "passive",
			},
			{
				name: "Contract Protection",
				description:
					"Your pact shields you from competing influence. Advantage on saves against being charmed by fiends, fey, or aberrations.",
				type: "resistance",
			},
			{
				name: "Invoke Patron",
				description:
					"Call upon your entity for a burst of power — your eyes flash with your patron's color and your voice briefly harmonizes with theirs. Bonus action: advantage on one attack, check, or save. Once per short rest.",
				type: "active",
				frequency: "short-rest",
			},
		],
		abilityScoreImprovements: { presence: 2, vitality: 1 },
		size: "medium",
		speed: 30,
		languages: ["English"],
		darkvision: 120,
		damage_resistances: ["fire"],
		startingEquipment: [
			["Light Crossbow", "Quarterstaff"],
			["Crossbow Bolts (20)"],
			["Component Pouch", "Arcane Focus"],
			["Scholar's Pack", "Dungeoneer's Pack"],
			["Leather Armor"],
			["Dagger"],
			["Dagger"],
		],
		hitPointsAtFirstLevel: "8 + your Vitality modifier",
		hitPointsAtHigherLevels:
			"1d8 (or 5) + your Vitality modifier per level after 1st",
		spellcasting: {
			ability: "Presence",
			focus: "Arcane focus",
			cantripsKnown: [
				2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
			],
			spellsKnown: [
				2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15,
			],
			spellSlots: { ...PACT_CASTER_SLOTS },
		},
		classFeatures: [
			{
				level: 1,
				name: "Contract Magic",
				description:
					"Cast Contractor spells using Presence — your power comes in controlled doses, like a subscription service from an extradimensional being. All contract slots are the same level and recharge on short rest. When you kill a creature, your patron feeds — regain one contract slot. Once per short rest.",
			},
			{
				level: 1,
				name: "Gate Entity",
				description:
					"Choose the entity you've contracted with. Features at 1st, 6th, 10th, and 14th level.",
			},
			{
				level: 2,
				name: "Pact Clauses",
				description:
					"Negotiate 2 permanent contract modifications — like addendums to a modern employment agreement. Options: extended spell range, see in magical darkness, disguise self at will, detect magic at will, or entity-specific clauses. More clauses at higher levels. Renegotiate one on level up (your patron's lawyer handles the paperwork).",
			},
			{
				level: 3,
				name: "Binding Gift",
				description:
					"Your entity manifests a physical anchor of the pact. Choose: Familiar Bond (entity-touched familiar with enhanced abilities), Weapon Bond (summonable pact weapon that uses Presence for attacks), or Knowledge Bond (three additional cantrips from any spell list + ritual casting from a grimoire your patron fills).",
			},
			{
				level: 4,
				name: "Ability Score Improvement",
				description: "You gain this at 4th, 8th, 12th, 16th, and 19th level.",
			},
			{
				level: 5,
				name: "Entity Manifestation",
				description:
					"Once per long rest, briefly manifest your patron's power — your appearance shifts, your voice deepens/echoes, and bystanders' smartphones glitch. For 1 min: 30 ft fly speed, spells deal +PRE mod bonus damage, and you emit a 10-ft aura (fear, charm, or damage). Gate-clearance footage of manifestations gets millions of views on social media.",
			},
			{
				level: 6,
				name: "Entity Feature",
				description: "Feature from your Gate Entity.",
			},
			{
				level: 10,
				name: "Entity Feature",
				description: "Feature from your Gate Entity.",
			},
			{
				level: 11,
				name: "Greater Contract",
				description:
					"Renegotiate for higher-tier access. Gain a 6th-level spell cast once per long rest without a slot. Additional: 7th at 13th, 8th at 15th, 9th at 17th.",
			},
			{
				level: 14,
				name: "Entity Feature",
				description: "Feature from your Gate Entity.",
			},
			{
				level: 20,
				name: "Zenith Arch-Contractor",
				description:
					"Your status as an Ascendant is recognized globally at the Zenith Rank: [RANK: S — ABSOLUTE MANIFESTATION GRANTED]. Entity Manifestation lasts 10 min, grants resistance to all damage, and your aura extends to 30 ft. You transcend the limits of a mere broker, becoming a peer to your patron. International legal systems have been rewritten to accommodate your mandated authority.",
			},
		],
		abilities: [
			"Contract Magic",
			"Gate Entity",
			"Pact Clauses",
			"Binding Gift",
			"Entity Manifestation",
		],
		image: "/generated/compendium/jobs/warlock.webp",
		stats: {
			strength: 8,
			agility: 14,
			vitality: 13,
			intelligence: 12,
			sense: 10,
			presence: 15,
		},
		primary_abilities: ["Presence", "Vitality"],
		source: "Ascendant Compendium",
	},

	// 11. STALKER — Rift Tracker / Dimensional Predator
	{
		id: "stalker",
		name: "Stalker",
		type: "Job",
		rank: "B",
		description:
			"The Stalker is an Awakened identity that specializes in the Rift Tracker and Dimensional Predator mandate. As an Ascendant of this lineage, they possess a refined aetheric sense that perceives mana-trails and gate-born energy signatures even through dense urban environments. They adapt to any terrain in seconds, tracking prey across dimensional boundaries. Many work as freelance bounty ascendants tracking escaped gate creatures through subway systems, forests, and abandoned buildings. Half martial, half primal caster, all predator.",
		hitDie: "1d10",
		primaryAbility: "Agility",
		saving_throws: ["Strength", "Agility"],
		skillChoices: [
			"Animal Handling",
			"Athletics",
			"Insight",
			"Investigation",
			"Nature",
			"Perception",
			"Stealth",
			"Survival",
		],
		armorProficiencies: ["Light armor", "Medium armor", "Shields"],
		weaponProficiencies: ["Simple weapons", "Martial weapons"],
		tool_proficiencies: [],
		awakeningFeatures: [
			{
				name: "Predator Physiology",
				description:
					"Your senses sharpened beyond human limits — you can hear a phone vibrating three rooms away and smell gate residue on someone's clothes from across a parking lot. Advantage on Perception (hearing/smell). Hide when only lightly obscured by foliage, rain, mist, or urban cover.",
				level: 1,
			},
			{
				name: "Enhanced Locomotion",
				description:
					"Your awakening optimized your legs for pursuit — you've outrun police cruisers in foot chases and vaulted highway barriers without breaking stride. Base walking speed 35 ft. Maintain a dead sprint for hours without tiring.",
				level: 1,
			},
			{
				name: "Prey Lock",
				description:
					"Choose a designated prey type — the Ascendant Bureau assigns Stalkers to specific anomaly classifications like detectives get case specialties. Sense creatures of that type within 120 ft by mana signature, even through concrete walls. Advantage on Survival to track them across any terrain.",
				level: 1,
			},
			{
				name: "Terrain Adaptation",
				description:
					"In your chosen hunting ground — whether it's an urban cityscape, dense forest, or subterranean gate — you can't be surprised, leave no tracks, and move at full speed through difficult terrain. Your body auto-adapts: temperature regulation, grip adjustment, even skin camouflage.",
				level: 3,
			},
			{
				name: "Apex Instinct",
				description:
					"Your first attack each turn against designated prey deals extra damage equal to your proficiency bonus. Your Aetheric-Sight identifies their primal weaknesses.",
				level: 11,
			},
		],
		jobTraits: [
			{
				name: "Gate Navigator",
				description:
					"You instinctively find safe paths through gates the way a native navigates their hometown — dimensional distortions, toxic zones, and hidden traps register as gut feelings. Advantage on saves vs gate environmental hazards.",
				type: "passive",
			},
			{
				name: "Rift Sense",
				description:
					"Spend a spell slot to scan for designated prey within 1 mile (6 miles in favored terrain) for 1 minute per slot level. You read dimensional residue.",
				type: "active",
				frequency: "at-will",
			},
			{
				name: "Adaptive Camouflage",
				description:
					"Spend 1 minute to blend with any surface. Invisible while motionless against it. Lasts until you move. Your skin pigmentation shifts.",
				type: "active",
				frequency: "at-will",
			},
		],
		abilityScoreImprovements: { agility: 2, sense: 1 },
		size: "medium",
		speed: 35,
		languages: ["English"],
		darkvision: 60,
		specialSenses: ["Keen Hearing and Smell"],
		startingEquipment: [
			["Scale Mail", "Leather Armor"],
			["Shortsword"],
			["Shortsword"],
			["Dungeoneer's Pack", "Explorer's Pack"],
			["Longbow"],
			["Arrows (20)"],
		],
		hitPointsAtFirstLevel: "10 + your Vitality modifier",
		hitPointsAtHigherLevels:
			"1d10 (or 6) + your Vitality modifier per level after 1st",
		spellcasting: {
			ability: "Sense",
			focus: "None (no focus needed)",
			spellsKnown: [
				0, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11,
			],
			spellSlots: { ...HALF_CASTER_SLOTS },
		},
		classFeatures: [
			{
				level: 1,
				name: "Prey Lock",
				description:
					"Bonus action: lock onto a creature's mana signature like a GPS tracker — you always know its direction and distance, even through buildings and underground. Attacks deal +1d4 damage. Lock persists until target dies or you switch. Additional lock slots at 6th and 14th (track multiple bounties simultaneously).",
			},
			{
				level: 1,
				name: "Gate Navigator",
				description:
					"Choose a gate terrain type you've trained in. In that terrain: you can't be lost, you move at full speed through difficult terrain, and you detect traps/ambushes automatically (passive Perception +5). Additional terrains at 6th and 10th.",
			},
			{
				level: 2,
				name: "Primal Tracking",
				description:
					"Cast Stalker spells using Sense. Known caster with half-caster progression. Your spells manifest as environmental instincts — tracking pulses, scent markers, and terrain manipulation.",
			},
			{
				level: 2,
				name: "Ambush Tactics",
				description:
					"When you attack from hiding or before the target acts — dropping from rooftops, emerging from alleyways, or striking from a parked car — deal +1d8 bonus damage. Stacks with Prey Lock.",
			},
			{
				level: 3,
				name: "Pursuit Path",
				description:
					"Choose a hunting specialization. Features at 3rd, 7th, 11th, and 15th level.",
			},
			{
				level: 3,
				name: "Rift Sense",
				description:
					"Spend a spell slot to scan for locked prey or gate creatures within 1 mile (6 in favored terrain). Duration: 1 min per slot level. Also detect gate openings and their rank.",
			},
			{
				level: 4,
				name: "Ability Score Improvement",
				description: "You gain this at 4th, 8th, 12th, 16th, and 19th level.",
			},
			{
				level: 5,
				name: "Pursuit Strike",
				description:
					"Attack twice per Attack action. When both attacks hit the same Prey Locked target, it must make a STR save or be knocked prone as your combined force overwhelms its footing.",
			},
			{
				level: 7,
				name: "Pursuit Feature",
				description: "Feature from your Pursuit Path.",
			},
			{
				level: 8,
				name: "Terrain Fluidity",
				description:
					"Your body auto-adapts to any environment. Move through nonmagical difficult terrain without extra cost. Advantage on saves vs environmental hazards.",
			},
			{
				level: 11,
				name: "Pursuit Feature",
				description: "Feature from your Pursuit Path.",
			},
			{
				level: 14,
				name: "Ghost Mandate",
				description:
					"Hide as a bonus action. Cannot be tracked by nonmagical means, including drones and surveillance cameras. Your Prey Lock range extends to 10 miles, allowing you to track targets across entire cities.",
			},
			{
				level: 15,
				name: "Pursuit Feature",
				description: "Feature from your Pursuit Path.",
			},
			{
				level: 18,
				name: "Apex Senses",
				description:
					"No disadvantage attacking invisible creatures. Aware of all creatures within 30 ft via mana signature, even through walls (up to 1 ft thick), and in crowded areas like shopping malls or public transportation.",
			},
			{
				level: 20,
				name: "Zenith Apex Predator",
				description:
					"Your status as an Ascendant is recognized globally at the Zenith Rank: [RANK: S — APEX PREDATOR]. No prey has ever escaped your scent once the Aetheric-Weave has marked them. The global bounty networks fall silent when you take a contract. Your Prey Lock bonus → +1d8. Ambush Tactics → +2d8. Add Sense mod to attack/damage vs locked targets once per turn.",
			},
		],
		abilities: [
			"Prey Lock",
			"Gate Navigator",
			"Primal Tracking",
			"Ambush Tactics",
			"Pursuit Strike",
			"Pursuit Path",
		],
		image: "/generated/compendium/jobs/ranger.webp",
		stats: {
			strength: 12,
			agility: 15,
			vitality: 13,
			intelligence: 10,
			sense: 14,
			presence: 8,
		},
		primary_abilities: ["Agility", "Sense"],
		source: "Ascendant Compendium",
	},

	// 12. HOLY KNIGHT — Oath-Bound Enforcer / System Covenant Warrior
	{
		id: "holy-knight",
		name: "Holy Knight",
		type: "Job",
		rank: "A",
		description:
			"The Holy Knight is an Awakened identity that specializes in the Oath-Bound Enforcer and Absolute Covenant mandate. As an Ascendant of this lineage, they serve as the ultimate guardians of modern society, their power fueled by a binding oath to the Absolute itself—a literal covenant inscribed into their mana pathways. They work as guild leaders, Ascendant Bureau enforcement officers, and public defenders against gate threats. The oath grants devastating combat power, but break its tenets and the power is revoked painfully. They channel radiant Absolute energy through weapons, heal allies, and project protective auras.",
		hitDie: "1d10",
		primaryAbility: "Strength",
		saving_throws: ["Sense", "Presence"],
		skillChoices: [
			"Athletics",
			"Insight",
			"Intimidation",
			"Medicine",
			"Persuasion",
			"Religion",
		],
		armorProficiencies: ["All armor", "Shields"],
		weaponProficiencies: ["Simple weapons", "Martial weapons"],
		tool_proficiencies: [],
		awakeningFeatures: [
			{
				name: "Covenant Bond",
				description:
					"Your oath links you to nearby allies like a supernatural resonant bond — paramedics have documented Holy Knight teammates' vitals stabilizing in sync. When you or an ally within 10 ft succeeds on a death save, they regain 1 HP.",
				level: 1,
			},
			{
				name: "Oath Sense",
				description:
					"Your covenant pings threats to the Absolute's order like a sensory alert — your phone buzzes with [HOSTILE ENTITY DETECTED] when fiends, celestials, or undead are within 60 ft. Know type and location. 1 + Presence mod uses per long rest.",
				level: 1,
			},
			{
				name: "Aura of Resolve",
				description:
					"Your covenant radiates courage — panicking civilians calm down near you, and teammates report feeling 'invincible' in your presence. You and allies within 10 ft can't be frightened while you're conscious. 30 ft at 18th.",
				level: 10,
			},
			{
				name: "Purification Touch",
				description:
					"Channel the Absolute to purge hostile magic as the divine decree overwrites the resonance of the affliction—curses, hexes, and magical diseases dissolve under your hands. End one spell on a willing creature you touch. Presence mod uses per long rest.",
				level: 14,
			},
		],
		jobTraits: [
			{
				name: "Covenant's Mercy",
				description:
					"You carry a reservoir of Absolute healing energy = 5 × Holy Knight level — your touch glows golden and field hospitals prioritize your patients. Restore HP by touch or purge disease/poison (5 HP per purge).",
				type: "active",
				frequency: "long-rest",
			},
			{
				name: "Oath Ward",
				description:
					"Your oath radiates protective energy. You and allies within 10 ft add your Presence mod to saves. Range 30 ft at 18th level.",
				type: "passive",
			},
			{
				name: "Covenant Immunity",
				description:
					"Your oath purifies your biology — you haven't been sick since your awakening, and pandemic-era contact tracers flagged you as a statistical anomaly. Immune to disease.",
				type: "immunity",
			},
		],
		abilityScoreImprovements: { strength: 2, presence: 1 },
		size: "medium",
		speed: 30,
		languages: ["English", "Ancient Hebrew Strings"],
		darkvision: 60,
		damage_resistances: ["radiant"],
		startingEquipment: [
			["Longsword", "Battleaxe"],
			["Shield"],
			["Javelin"],
			["Javelin"],
			["Javelin"],
			["Javelin"],
			["Javelin"],
			["Priest's Pack", "Explorer's Pack"],
			["Chain Mail"],
			["Absolute Focus"],
		],
		hitPointsAtFirstLevel: "10 + your Vitality modifier",
		hitPointsAtHigherLevels:
			"1d10 (or 6) + your Vitality modifier per level after 1st",
		spellcasting: {
			ability: "Presence",
			focus: "Absolute focus",
			spellSlots: { ...HALF_CASTER_SLOTS },
		},
		classFeatures: [
			{
				level: 1,
				name: "Oath Sense",
				description:
					"Your covenant pings hostile entities. Detect celestials, fiends, and undead within 60 ft and know their type. 1 + Presence mod uses per long rest.",
			},
			{
				level: 1,
				name: "Covenant's Mercy",
				description:
					"You carry a reservoir of Absolute healing energy = 5 × Holy Knight level. Touch a creature to transfer HP from the pool. Spend 5 HP from the pool to cure one disease or neutralize one poison.",
			},
			{
				level: 2,
				name: "Covenant Casting",
				description:
					"Cast Holy Knight spells using Presence. Prepare from the full list each day.",
			},
			{
				level: 2,
				name: "Covenant Strike",
				description:
					"On melee hit, channel your oath's power through the weapon — it flares with golden light visible from blocks away. Expend a slot: 2d8 radiant + 1d8 per slot above 1st (max 5d8). +1d8 vs undead/fiends. Target's speed reduced by 10 ft until your next turn. Gate-raid streamers' audiences go wild for Covenant Strike clips.",
			},
			{
				level: 3,
				name: "Covenant Immunity",
				description:
					"Your oath purifies your biology. Immune to disease. Additionally, you can sense when a creature within 30 ft is lying (you feel a dissonance in your covenant bond).",
			},
			{
				level: 3,
				name: "Sworn Oath",
				description:
					"Choose the specific terms of your Absolute covenant. Oath spells and features at 3rd, 7th, 15th, and 20th level.",
			},
			{
				level: 4,
				name: "Ability Score Improvement",
				description: "You gain this at 4th, 8th, 12th, 16th, and 19th level.",
			},
			{
				level: 5,
				name: "Covenant Assault",
				description:
					"Attack twice per Attack action. When you hit a creature with both attacks in the same turn, the second Covenant Strike costs one slot level lower (minimum 1st).",
			},
			{
				level: 6,
				name: "Oath Ward",
				description:
					"Your covenant radiates protective energy. You and allies within 10 ft add your Presence mod to all saving throws (30 ft at 18th).",
			},
			{
				level: 7,
				name: "Oath Feature",
				description: "Feature from your Sworn Oath.",
			},
			{
				level: 10,
				name: "Aura of Resolve",
				description:
					"You and allies within 10 ft cannot be frightened while you are conscious (30 ft at 18th). Frightened allies who enter the aura have the condition suppressed.",
			},
			{
				level: 11,
				name: "Radiant Conduit",
				description:
					"The Absolute's energy flows through every strike. All melee weapon hits deal +1d8 radiant. When you reduce a creature to 0 HP, allies within 30 ft regain HP = your Presence mod.",
			},
			{
				level: 14,
				name: "Purification Touch",
				description:
					"End one spell or magical effect on a willing creature you touch. Presence mod uses per long rest. Can also remove one level of exhaustion.",
			},
			{
				level: 15,
				name: "Oath Feature",
				description: "Feature from your Sworn Oath.",
			},
			{
				level: 20,
				name: "Zenith Sacred Avatar",
				description:
					"Your status as an Ascendant is recognized globally at the Zenith Rank: [RANK: S — SACRED AVATAR]. Transform into a radiant avatar of your oath for 1 min: 30 ft fly speed, resistance to all damage, Oath Ward extends to 60 ft. Once per long rest. You are a living monument to the Absolute's authority; your manifestations are global events broadcast across every screen on Earth.",
			},
		],
		abilities: [
			"Oath Sense",
			"Covenant's Mercy",
			"Covenant Strike",
			"Sworn Oath",
			"Oath Ward",
			"Covenant Assault",
		],
		image: "/generated/compendium/jobs/paladin.webp",
		stats: {
			strength: 15,
			agility: 10,
			vitality: 13,
			intelligence: 8,
			sense: 12,
			presence: 14,
		},
		primary_abilities: ["Strength", "Presence"],
		source: "Ascendant Compendium",
	},

	// 13. TECHNOMANCER — Absolute Architect / Aetheric Design Engineer
	{
		id: "technomancer",
		name: "Technomancer",
		type: "Job",
		rank: "B",
		description:
			"The Technomancer is an Awakened identity that specializes in the Absolute Architect and Aetheric Design mandate. As an Ascendant of this lineage, their Awakening provides architectural access to the Weave-Resonance layer—the fundamental interface between magic and physical matter. In the modern world, Technomancers are the most commercially valuable ascendants, turning Silicon Valley and Shenzhen into hubs of Aetheric innovation. They build devices that redefine reality: mana-powered drones, self-repairing gear, and resonance-enabled technologies.",
		hitDie: "1d8",
		primaryAbility: "Intelligence",
		saving_throws: ["Vitality", "Intelligence"],
		skillChoices: [
			"Arcana",
			"History",
			"Investigation",
			"Medicine",
			"Nature",
			"Perception",
			"Sleight of Hand",
		],
		armorProficiencies: ["Light armor", "Medium armor", "Shields"],
		weaponProficiencies: ["Simple weapons"],
		tool_proficiencies: [
			"Thieves' tools",
			"Tinker's tools",
			"One artisan's tool",
		],
		awakeningFeatures: [
			{
				name: "Mandate Vision",
				description:
					"You see the Absolute's construction resonance overlaid on objects like a permanent AR schematic display — pick up any gadget and you instantly see its internal wiring, stress points, and upgrade paths. Double proficiency on INT checks related to magic items, tech, or Absolute constructs.",
				level: 1,
			},
			{
				name: "Neural Synchronization",
				description:
					"Your brain is hardwired for Mandate-tech interface. You gain one additional attunement slot, and you can attune to magic items as a bonus action instead of during a short rest.",
				level: 1,
			},
			{
				name: "Aetheric-Mandate Access",
				description:
					"Interface with any Absolute construct or divine device like touching an intuitive schematic — read functions, bypass security, and rewrite resonance behavior. You've unraveled gate artifacts that global research labs couldn't crack. Advantage on checks to analyze magical technology.",
				level: 1,
			},
			{
				name: "Infusion Optimization",
				description:
					"Your infused items exceed standard parameters. They grant an additional +3 bonus (stacking with base infusion). +6 at 14th level.",
				level: 6,
			},
			{
				name: "Construct Reinforcement",
				description:
					"Constructs you build are fortified with extra Absolute data. They gain extra HP = 2 × Technomancer level and advantage on saves vs being banished or dispelled.",
				level: 10,
			},
		],
		jobTraits: [
			{
				name: "Mandate Tinkering",
				description:
					"Imbue tiny objects with Absolute-powered effects — turn a pen into a flashlight, a coin into a voice recorder, or a business card into a GPS tracker. Up to INT mod objects at once. Your apartment is full of enchanted household items.",
				type: "active",
				frequency: "at-will",
			},
			{
				name: "Tool Mastery",
				description:
					"Your neural interface optimizes every tool interaction — you use a soldering iron like a surgeon uses a scalpel, and your 3D prints come out flawless every time. Double proficiency with all tools you're proficient with.",
				type: "passive",
			},
			{
				name: "Absolute Assist",
				description:
					"Reaction: feed real-time Absolute telemetry to a nearby ally through their earpiece, HUD, or phone — like having a mission control in your head. Add INT mod to a creature's check or save within 30 ft. INT mod uses per long rest.",
				type: "active",
				frequency: "long-rest",
			},
		],
		abilityScoreImprovements: { intelligence: 2, vitality: 1 },
		size: "medium",
		speed: 30,
		languages: ["English"],
		darkvision: 60,
		damage_resistances: ["lightning"],
		specialSenses: ["Mandate Vision (identify magic items by touch, 1 minute)"],
		startingEquipment: [
			["Handaxe", "Dagger"],
			["Handaxe", "Dagger"],
			["Light Crossbow"],
			["Crossbow Bolts (20)"],
			["Studded Leather Armor"],
			["Thieves' Tools"],
			["Dungeoneer's Pack"],
		],
		hitPointsAtFirstLevel: "8 + your Vitality modifier",
		hitPointsAtHigherLevels:
			"1d8 (or 5) + your Vitality modifier per level after 1st",
		spellcasting: {
			ability: "Intelligence",
			focus: "Thieves' tools or artisan's tools",
			cantripsKnown: [
				2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4,
			],
			spellSlots: { ...HALF_CASTER_SLOTS },
		},
		classFeatures: [
			{
				level: 1,
				name: "Neural Synchronization",
				description:
					"Your brain is hardwired for Mandate-tech interface. You gain one additional attunement slot, and you can attune to magic items as a bonus action instead of during a short rest.",
			},
			{
				level: 1,
				name: "Mandate Tinkering",
				description:
					"Imbue tiny objects with Absolute-powered properties — enchant your keys to glow, your wallet to play a sound when lost, or a sticky note to display a holographic message. Up to INT mod objects simultaneously.",
			},
			{
				level: 1,
				name: "Technical Casting",
				description:
					"Cast Technomancer spells using Intelligence. Prepare spells using tools as focus — you physically build the spell effect into a device, then trigger it.",
			},
			{
				level: 2,
				name: "Absolute Infusion",
				description:
					"Write Absolute data into nonmagical items, granting them magical properties. Choose from a list of infusion designs. Active infusions scale with level. Unique: you can infuse an item with a cantrip you know — the item can cast it INT mod times per day (anyone holding it).",
			},
			{
				level: 3,
				name: "Architectural Path",
				description:
					"Choose a specialization. Features at 3rd, 5th, 9th, and 15th.",
			},
			{
				level: 3,
				name: "Adaptive Fabrication",
				description:
					"Spend 1 hour to fabricate any toolset or simple weapon from raw materials — you've built functional equipment from junkyard scraps and hardware store supplies. At 10th level, fabricate uncommon magic items during a long rest (materials required).",
			},
			{
				level: 4,
				name: "Ability Score Improvement",
				description: "You gain this at 4th, 8th, 12th, 16th, and 19th level.",
			},
			{
				level: 5,
				name: "Architectural Feature",
				description: "Feature from your Architectural Path.",
			},
			{
				level: 6,
				name: "Tool Mastery",
				description: "Double proficiency bonus on all tool checks.",
			},
			{
				level: 7,
				name: "Absolute Assist",
				description:
					"Reaction: feed Absolute telemetry to an ally. Add INT mod to a creature's check or save within 30 ft. INT mod uses per long rest. If the check/save succeeds, regain one use.",
			},
			{
				level: 9,
				name: "Architectural Feature",
				description: "Feature from your Architectural Path.",
			},
			{
				level: 10,
				name: "Overclocked Crafting",
				description:
					"Craft magic items in 1/4 time and half cost. Attune to 10 items (Total). Disassemble a magic item during a long rest to recover its mana core (half value in crafting materials).",
			},
			{
				level: 11,
				name: "Spell Capacitor",
				description:
					"Store a 1st or 2nd-level spell in a constructed device. Any creature holding it can discharge the spell using your save DC and spell attack bonus. 2 × INT mod charges, recharges on long rest.",
			},
			{
				level: 14,
				name: "Universal Compatibility",
				description:
					"Your Absolute write-access overrides item restrictions. Ignore class/race/spell/level requirements for magic items. Attune to 11 items (Total).",
			},
			{
				level: 15,
				name: "Architectural Feature",
				description: "Feature from your Architectural Path.",
			},
			{
				level: 18,
				name: "Maximum Attunement",
				description:
					"Attune to 12 magic items simultaneously (Double the standard limit of 6). When you finish a long rest, you can swap one infusion on an already-infused item.",
			},
			{
				level: 20,
				name: "Zenith Architect of the Weave",
				description:
					"Your status as an Ascendant is recognized globally at the Zenith Rank: [RANK: S — ARCHITECT OF THE ABSOLUTE]. +1 to all saves per attuned item. When reduced to 0 HP, sacrifice one attunement to drop to 1 HP and release a 20-ft mana EMP dealing 3d10 force. Global defense contractors and tech titans compete for your divine designs.",
			},
		],
		abilities: [
			"Mandate Tinkering",
			"Technical Casting",
			"Absolute Infusion",
			"Architectural Path",
			"Absolute Assist",
			"Spell Capacitor",
		],
		image: "/generated/compendium/jobs/artificer.webp",
		stats: {
			strength: 10,
			agility: 12,
			vitality: 14,
			intelligence: 15,
			sense: 13,
			presence: 8,
		},
		primary_abilities: ["Intelligence", "Vitality"],
		source: "Ascendant Compendium",
	},

	// 14. IDOL — Frequency Manipulator / Resonance Caster
	{
		id: "idol",
		name: "Idol",
		type: "Job",
		rank: "B",
		description:
			"The Idol is an Awakened identity that specializes in the Frequency Manipulator and Resonance Caster mandate. As an Ascendant of this lineage, their power is attuned to the Absolute's harmonic frequencies, allowing them to broadcast buffs and hype with absolute presence. In modern society, Idols are the most publicly visible ascendants — they have millions of followers, record albums infused with mana, headline gate-clearance livestreams, and their Hype abilities make them the ultimate party buffers.",
		hitDie: "1d8",
		primaryAbility: "Presence",
		saving_throws: ["Agility", "Presence"],
		skillChoices: [
			"Acrobatics",
			"Animal Handling",
			"Arcana",
			"Athletics",
			"Deception",
			"History",
			"Insight",
			"Intimidation",
			"Investigation",
			"Medicine",
			"Nature",
			"Perception",
			"Performance",
			"Persuasion",
			"Religion",
			"Sleight of Hand",
			"Stealth",
			"Survival",
		],
		armorProficiencies: ["Light armor"],
		weaponProficiencies: [
			"Simple weapons",
			"Hand crossbows",
			"Longswords",
			"Rapiers",
			"Shortswords",
		],
		tool_proficiencies: ["Three musical instruments"],
		awakeningFeatures: [
			{
				name: "Broad-Spectrum Awakening",
				description:
					"Your frequency attunement grants intuitive understanding of many disciplines — you pick up new skills the way most people pick up slang, absorbing competence from the Absolute's resonance flows. Gain proficiency in two additional skills of your choice.",
				level: 1,
			},
			{
				name: "Resonance Shield",
				description:
					"Your personal frequency repels external manipulation — advertisers, con artists, cult recruiters, and charm spells all bounce off your natural broadcast interference. Advantage on saves vs charm. Magic cannot put you to sleep.",
				level: 1,
			},
			{
				name: "Amplified Hype",
				description:
					"When you grant a Hype die, the recipient also gains temp HP = Presence mod — they literally feel stronger, more confident, like their favorite song just came on during a workout. Your resonance reinforces their resolve.",
				level: 1,
			},
			{
				name: "Dissonance Burst",
				description:
					"As a reaction when a creature within 60 ft makes an attack or check, expend a Hype die and subtract the roll from their total. You disrupt their internal frequency.",
				level: 5,
			},
			{
				name: "Resonance Lock",
				description:
					"When an ally uses your Hype die and rolls the maximum value, the die is not expended. Your frequencies synchronize perfectly.",
				level: 14,
			},
		],
		jobTraits: [
			{
				name: "Absolute Versatility",
				description:
					"The Absolute's ambient frequencies feed you data about everything — you're the person who's weirdly good at trivia, can fix a flat tire, knows first aid, and speaks conversational Japanese despite never studying it. Add half prof bonus to unproficient checks.",
				type: "passive",
			},
			{
				name: "Frequency Restoration",
				description:
					"During short rest, emit restorative harmonics — it sounds like ambient music that makes everyone feel better. Teammates' wounds close faster, stress melts away. Presence mod creatures each regain extra 1d6 HP.",
				type: "active",
				frequency: "short-rest",
			},
			{
				name: "Specialist Training",
				description:
					"Double proficiency on two chosen skill proficiencies. Two more at 10th level.",
				type: "passive",
			},
		],
		abilityScoreImprovements: { presence: 2, agility: 1 },
		size: "medium",
		speed: 30,
		languages: ["English", "One additional Earth language"],
		darkvision: 60,
		startingEquipment: [
			["Rapier", "Longsword", "Dagger"],
			["Diplomat's Pack", "Entertainer's Pack"],
			["Musical Instrument"],
			["Leather Armor"],
			["Dagger"],
		],
		hitPointsAtFirstLevel: "8 + your Vitality modifier",
		hitPointsAtHigherLevels:
			"1d8 (or 5) + your Vitality modifier per level after 1st",
		spellcasting: {
			ability: "Presence",
			focus: "Musical instrument",
			cantripsKnown: [
				2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
			],
			spellsKnown: [
				4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 15, 16, 18, 19, 19, 20, 22, 22,
				22,
			],
			spellSlots: { ...FULL_CASTER_SLOTS },
		},
		classFeatures: [
			{
				level: 1,
				name: "Frequency Casting",
				description:
					"Cast Idol spells using Presence. Known caster — spells manifest as harmonic frequency manipulation. When you cast a spell that targets only one creature, you can emit a secondary harmonic: one other creature within 10 ft of the target has disadvantage on its next save before the end of your next turn.",
			},
			{
				level: 1,
				name: "Hype",
				description:
					"Bonus action: broadcast an amplifying frequency — a shout, a riff, a motivational one-liner that literally makes your teammate better at what they're doing. Grant a Hype die (d6→d8→d10→d12 at 5th/10th/15th). Add to one attack/check/save within 10 min. On success, you gain temp HP = die roll (the crowd's energy feeds you back). PRE mod uses per long rest (short rest at 5th).",
			},
			{
				level: 2,
				name: "Absolute Versatility",
				description:
					"The Absolute's ambient frequencies feed you fragments of every skill. Add half proficiency bonus to any ability check that doesn't already include your proficiency bonus.",
			},
			{
				level: 2,
				name: "Frequency Restoration",
				description:
					"During short rest, emit restorative harmonics that mend tissue and calm minds. Allies regain extra 1d6 HP (d8 at 9th, d10 at 13th, d12 at 17th). Additionally, one ally can end a frightened or charmed condition.",
			},
			{
				level: 3,
				name: "Specialist Training",
				description:
					"Double proficiency on two skill proficiencies. Two more at 10th level.",
			},
			{
				level: 3,
				name: "Resonance Path",
				description:
					"Choose a resonance specialization. Features at 3rd, 6th, and 14th level.",
			},
			{
				level: 4,
				name: "Ability Score Improvement",
				description: "You gain this at 4th, 8th, 12th, 16th, and 19th level.",
			},
			{
				level: 5,
				name: "Sustained Resonance",
				description:
					"Hype dice recharge on short rest — your energy is self-sustaining, like a hit song stuck in everyone's head. When you grant a Hype die, optionally emit a Dissonance pulse: one hostile creature within 30 ft subtracts 1d4 from its next attack. Fans call it 'the anti-vibe.'",
			},
			{
				level: 6,
				name: "Dissonance Shield",
				description:
					"Action: emit a counter-frequency that scrambles hostile psychic influence — it sounds like feedback from a blown speaker to enemies but feels like noise-canceling headphones to allies. Advantage on saves vs frightened/charmed. Hostile casters: PRE save or lose concentration.",
			},
			{
				level: 6,
				name: "Resonance Feature",
				description: "Feature from your Resonance Path.",
			},
			{
				level: 10,
				name: "Cross-Frequency Access",
				description:
					"Tap into other jobs' frequency bands like changing radio stations — learn healing spells from Heralds, attack spells from Mages, whatever fits your setlist. Learn 2 spells from any list (count as Idol spells). Swap one each level up. More at 14th and 18th.",
			},
			{
				level: 14,
				name: "Resonance Feature",
				description: "Feature from your Resonance Path.",
			},
			{
				level: 20,
				name: "Zenith Idol of the Decree",
				description:
					"Your status as an Ascendant is recognized globally at the Zenith Rank: [RANK: S — SUPREME RESONANCE CONDUCTOR]. Roll initiative with 0 Hype dice → regain 1. Once per long rest, you can broadcast an Anthem of Ascendance: for 1 minute, all allies within 60 ft add your Presence mod to their attack rolls and saving throws. Your performances are global mandates.",
			},
		],
		abilities: [
			"Frequency Casting",
			"Hype",
			"Absolute Versatility",
			"Frequency Restoration",
			"Resonance Path",
			"Cross-Frequency Access",
		],
		image: "/generated/compendium/jobs/bard.webp",
		stats: {
			strength: 8,
			agility: 14,
			vitality: 12,
			intelligence: 13,
			sense: 10,
			presence: 15,
		},
		primary_abilities: ["Presence", "Agility"],
		source: "Ascendant Compendium",
	},
];
