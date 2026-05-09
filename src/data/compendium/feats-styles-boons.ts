import type { CompendiumFeat } from "../../types/compendium";

// ─── Tier 3: Fighting Style Feats (granted via class feature) ──────
export const fightingStyleFeats: CompendiumFeat[] = [
	{
		id: "fs-defense",
		name: "Defense",
		display_name: "Defense",
		description:
			"While you are wearing armor, you gain a +1 bonus to AC. Your mana field reinforces the structural integrity of any armor you wear, sealing micro-gaps in plate and hardening leather fibers.",
		flavor: "The armor doesn't protect you. Your mana protects the armor.",
		tags: ["awakened", "feat", "fighting-style", "defensive"],
		rarity: "uncommon",
		source_book: "Rift Ascendant Canon",
		effects: { primary: "+1 AC while wearing armor." },
		repeatable: false,
		mechanics: {
			action_type: "Passive",
			duration: "Permanent",
			damage_profile: "N/A",
			range: "Self",
		},
		limitations: {
			uses: "Permanent",
			recharge: "N/A",
			requires_attunement: false,
			conditions: ["Must be wearing armor"],
		},
		discovery_lore:
			"Standard Bureau combat doctrine, taught in the first week of field training.",
		theme_tags: ["defense", "armor", "ac"],
	},
	{
		id: "fs-dueling",
		name: "Dueling",
		display_name: "Dueling",
		description:
			"When you are wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon. The focused mana channel through a single weapon maximizes kinetic transfer on impact.",
		flavor: "One weapon. One hand. More than enough.",
		tags: ["awakened", "feat", "fighting-style", "offensive"],
		rarity: "uncommon",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "+2 damage with one-handed melee weapon (no off-hand weapon).",
		},
		repeatable: false,
		mechanics: {
			action_type: "Passive",
			duration: "Permanent",
			damage_profile: "+2",
			range: "Melee",
		},
		limitations: {
			uses: "Permanent",
			recharge: "N/A",
			requires_attunement: false,
			conditions: ["One melee weapon, no off-hand weapon"],
		},
		discovery_lore:
			"Preferred by Holy Knights who need a free hand for shield use while maintaining offensive pressure.",
		theme_tags: ["dueling", "one-handed", "damage"],
	},
	{
		id: "fs-great-weapon-fighting",
		name: "Great Weapon Fighting",
		display_name: "Great Weapon Fighting",
		description:
			"When you roll a 1 or 2 on a damage die for an attack you make with a melee weapon you are wielding with two hands, you can reroll the die and must use the new roll. The weapon must have the two-handed or versatile property. Your mana flow corrects weak swings mid-arc.",
		flavor: "You don't swing light. Your mana doesn't let you.",
		tags: ["awakened", "feat", "fighting-style", "offensive"],
		rarity: "uncommon",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary:
				"Reroll 1s and 2s on damage dice with two-handed/versatile melee weapons.",
		},
		repeatable: false,
		mechanics: {
			action_type: "Passive",
			duration: "Permanent",
			damage_profile: "Reroll low dice",
			range: "Melee",
		},
		limitations: {
			uses: "Permanent",
			recharge: "N/A",
			requires_attunement: false,
			conditions: ["Two-handed or versatile melee weapon"],
		},
		discovery_lore:
			"Destroyer heavy-weapons doctrine emphasizes that every swing must count — gate bosses don't give you second chances.",
		theme_tags: ["great-weapon", "two-handed", "reroll"],
	},
	{
		id: "fs-protection",
		name: "Protection",
		display_name: "Protection",
		description:
			"When a creature you can see attacks a target other than you that is within 5 feet of you, you can use your reaction to impose disadvantage on the attack roll. You must be wielding a shield. Your mana field extends through the shield to deflect incoming threats aimed at allies.",
		flavor: "They aim at your healer. Your shield says no.",
		tags: ["awakened", "feat", "fighting-style", "defensive", "support"],
		rarity: "uncommon",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary:
				"Reaction: impose disadvantage on attack targeting adjacent ally (requires shield).",
		},
		repeatable: false,
		mechanics: {
			action_type: "Reactive",
			duration: "Instantaneous",
			damage_profile: "N/A",
			range: "5 feet",
			action: "1 reaction",
		},
		limitations: {
			uses: "1/round (reaction)",
			recharge: "N/A",
			requires_attunement: false,
			conditions: ["Shield equipped", "Ally within 5 feet"],
		},
		discovery_lore:
			"Holy Knight raid doctrine: 'The shield is not for you. The shield is for everyone behind you.'",
		theme_tags: ["protection", "shield", "ally-defense"],
	},
	{
		id: "fs-two-weapon-fighting",
		name: "Two-Weapon Fighting",
		display_name: "Two-Weapon Fighting",
		description:
			"When you engage in two-weapon fighting, you can add your ability modifier to the damage of the second attack. Dual mana channels feed both weapons simultaneously, eliminating the power loss normally associated with off-hand strikes.",
		flavor: "Left hand, right hand. Same killing power.",
		tags: ["awakened", "feat", "fighting-style", "offensive"],
		rarity: "uncommon",
		source_book: "Rift Ascendant Canon",
		effects: { primary: "Add ability modifier to bonus-action attack damage." },
		repeatable: false,
		mechanics: {
			action_type: "Passive",
			duration: "Permanent",
			damage_profile: "+ability mod to off-hand",
			range: "Melee",
		},
		limitations: {
			uses: "Permanent",
			recharge: "N/A",
			requires_attunement: false,
			conditions: ["Two-weapon fighting"],
		},
		discovery_lore:
			"Assassin training standard — the off-hand strike must be as lethal as the primary or the target survives long enough to call for reinforcements.",
		theme_tags: ["dual-wield", "two-weapon", "off-hand"],
	},
	{
		id: "fs-archery",
		name: "Archery",
		display_name: "Archery",
		description:
			"You gain a +2 bonus to attack rolls you make with ranged weapons. Mana-enhanced proprioception eliminates natural aim variance, letting your projectiles track the micro-corrections your enhanced nervous system calculates.",
		flavor: "You don't aim. Your mana does.",
		tags: ["awakened", "feat", "fighting-style", "ranged"],
		rarity: "uncommon",
		source_book: "Rift Ascendant Canon",
		effects: { primary: "+2 to attack rolls with ranged weapons." },
		repeatable: false,
		mechanics: {
			action_type: "Passive",
			duration: "Permanent",
			damage_profile: "N/A",
			range: "Ranged",
		},
		limitations: {
			uses: "Permanent",
			recharge: "N/A",
			requires_attunement: false,
			conditions: ["Ranged weapon"],
		},
		discovery_lore:
			"Stalker sharpshooter doctrine: 'A missed shot is a wasted mana cycle. Waste nothing.'",
		theme_tags: ["archery", "ranged", "accuracy"],
	},
	{
		id: "fs-gunslinger",
		name: "Gunslinger",
		display_name: "Gunslinger",
		description:
			"You are proficient with firearms. When you make an attack with a firearm, you can use your Agility modifier instead of Strength for the attack and damage rolls. You can reload a firearm as a free action once per turn. Mana-enhanced reflexes let you handle modern weapons with preternatural speed.",
		flavor: "Swords are traditional. Bullets are faster.",
		tags: ["awakened", "feat", "fighting-style", "ranged", "firearms"],
		rarity: "uncommon",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "Firearm proficiency; use Agility for attack/damage.",
			secondary: "Free action reload once per turn.",
		},
		repeatable: false,
		mechanics: {
			action_type: "Passive",
			duration: "Permanent",
			damage_profile: "N/A",
			range: "Ranged",
		},
		limitations: {
			uses: "Permanent",
			recharge: "N/A",
			requires_attunement: false,
			conditions: ["Firearm"],
		},
		discovery_lore:
			"Modern Bureau doctrine adopted firearms after A-Rank Stalkers proved that mana-enhanced marksmanship exceeded melee damage at range against airborne anomalies.",
		theme_tags: ["gunslinger", "firearms", "modern"],
	},
	{
		id: "fs-anomaly-hunter",
		name: "Anomaly Hunter",
		display_name: "Anomaly Hunter",
		description:
			"You deal an extra 1d4 damage against aberrations, monstrosities, and creatures with the gate-born tag. You have advantage on Intelligence checks to recall information about gate-born anomalies. Your Aetheric-Sight highlights anatomical vulnerabilities specific to non-humanoid physiology.",
		flavor: "You've killed enough gate monsters to know where they break.",
		tags: ["awakened", "feat", "fighting-style", "offensive"],
		rarity: "uncommon",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "+1d4 damage vs. aberrations/monstrosities/gate-born.",
			secondary: "Advantage on recall checks about anomalies.",
		},
		repeatable: false,
		mechanics: {
			action_type: "Passive",
			duration: "Permanent",
			damage_profile: "+1d4 vs. gate-born",
			range: "Self",
		},
		limitations: {
			uses: "Permanent",
			recharge: "N/A",
			requires_attunement: false,
			conditions: [],
		},
		discovery_lore:
			"Stalker combat doctrine: every anomaly species has documented kill points. Memorize them or die learning.",
		theme_tags: ["anomaly", "favored-enemy", "hunter"],
	},
	{
		id: "fs-lattice-infused-striking",
		name: "Lattice-Infused Striking",
		display_name: "Lattice-Infused Striking",
		description:
			"Your unarmed strikes deal 1d6 + Strength modifier bludgeoning damage. When you hit a creature with an unarmed strike, you can choose to infuse the blow with mana: the damage type becomes force, and the target is pushed 5 feet away from you. You can infuse strikes a number of times equal to your proficiency bonus per short rest.",
		flavor: "Your fist hits like steel. Your mana hits like a truck.",
		tags: ["awakened", "feat", "fighting-style", "martial", "unarmed"],
		rarity: "uncommon",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "Unarmed = 1d6 + STR bludgeoning.",
			secondary: "PB/short rest: unarmed becomes force damage + 5ft push.",
		},
		repeatable: false,
		mechanics: {
			action_type: "Passive/Active",
			duration: "Permanent",
			damage_profile: "1d6 + STR",
			range: "Melee",
		},
		limitations: {
			uses: "Infusion: PB/short rest",
			recharge: "Short rest",
			requires_attunement: false,
			conditions: [],
		},
		discovery_lore:
			"Striker nerve-gate technique: channel mana through the metacarpal lattice for a concussive mana discharge on impact.",
		theme_tags: ["unarmed", "lattice", "force"],
	},
	{
		id: "fs-suppressive-fire",
		name: "Suppressive Fire",
		display_name: "Suppressive Fire",
		description:
			"When you make a ranged weapon attack and miss, the target still takes damage equal to your Agility modifier (minimum 1) from the near-miss concussive pressure. Additionally, a creature you hit with a ranged attack has its speed reduced by 10 feet until the start of your next turn.",
		flavor: "Missing still hurts. Hitting hurts more.",
		tags: ["awakened", "feat", "fighting-style", "ranged", "control"],
		rarity: "uncommon",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "Missed ranged attacks deal Agility mod damage.",
			secondary: "Hit target speed reduced by 10 feet.",
		},
		repeatable: false,
		mechanics: {
			action_type: "Passive",
			duration: "Permanent",
			damage_profile: "AGI mod on miss",
			range: "Ranged",
		},
		limitations: {
			uses: "Permanent",
			recharge: "N/A",
			requires_attunement: false,
			conditions: ["Ranged weapon"],
		},
		discovery_lore:
			"Technomancer fire-support doctrine: 'If the target is moving, slow it. If it's not moving, it should be.'",
		theme_tags: ["suppressive", "ranged", "slow"],
	},
	{
		id: "fs-burst-discipline",
		name: "Burst Discipline",
		display_name: "Burst Discipline",
		description:
			"Once per turn, when you deal damage with a weapon attack, you can add your proficiency bonus to the damage roll. This represents a precise mana-burst channeled through the weapon at the moment of impact — a controlled detonation rather than sustained output.",
		flavor: "One hit. Maximum damage. Move to the next target.",
		tags: ["awakened", "feat", "fighting-style", "offensive"],
		rarity: "uncommon",
		source_book: "Rift Ascendant Canon",
		effects: { primary: "Add proficiency bonus to damage once per turn." },
		repeatable: false,
		mechanics: {
			action_type: "Passive",
			duration: "Permanent",
			damage_profile: "+PB once/turn",
			range: "Self",
		},
		limitations: {
			uses: "1/turn",
			recharge: "N/A",
			requires_attunement: false,
			conditions: ["Weapon attack"],
		},
		discovery_lore:
			"Cross-discipline technique adapted from Striker nerve-gate training and applied to all weapon types by Bureau combat instructors.",
		theme_tags: ["burst", "damage", "efficiency"],
	},
];

// ─── Tier 4: Zenith Boons (level 19+, capstone feats) ─────────────
export const zenithBoons: CompendiumFeat[] = [
	{
		id: "boon-absolute-authority",
		name: "Boon of Absolute Authority",
		display_name: "Boon of Absolute Authority",
		description:
			"Your resonance with the Absolute has reached a level that warps reality around your attacks. Increase your Strength or Presence by 4 (max 30). Your damage ignores resistance. If a creature is immune to a damage type you deal, it instead has resistance to that damage type (taking half instead of zero).",
		flavor: "The Absolute recognizes your authority. Reality complies.",
		tags: ["awakened", "feat", "zenith-boon", "offensive"],
		rarity: "legendary",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "+4 Strength or Presence (max 30). Ignore resistance.",
			secondary: "Immunity treated as resistance.",
		},
		prerequisites: { level: 19 },
		repeatable: false,
		mechanics: {
			action_type: "Passive",
			duration: "Permanent",
			damage_profile: "Ignore resistance",
			range: "Self",
		},
		limitations: {
			uses: "Permanent",
			recharge: "N/A",
			requires_attunement: false,
			conditions: [],
		},
		discovery_lore:
			"Documented in exactly four Hunters in Bureau history — each classified as an extinction-level strategic asset.",
		theme_tags: ["zenith", "absolute", "authority"],
	},
	{
		id: "boon-gate-sovereignty",
		name: "Boon of Gate Sovereignty",
		display_name: "Boon of Gate Sovereignty",
		description:
			"Your mana density is sufficient to manipulate gate membranes directly. Increase your Intelligence or Sense by 4 (max 30). Once per long rest, you can open or close a gate portal within 60 feet. You can also stabilize a collapsing gate for 1 hour, preventing a dungeon break. You are immune to forced teleportation and banishment effects.",
		flavor: "Gates open and close at your command. The membrane obeys.",
		tags: ["awakened", "feat", "zenith-boon", "utility"],
		rarity: "legendary",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "+4 Intelligence or Sense (max 30). Open/close gate portals.",
			secondary:
				"Stabilize collapsing gates; immune to banishment/teleportation.",
		},
		prerequisites: { level: 19 },
		repeatable: false,
		mechanics: {
			action_type: "Active",
			duration: "Instantaneous / 1 hour (stabilize)",
			damage_profile: "N/A",
			range: "60 feet",
			action: "1 action",
		},
		limitations: {
			uses: "1/long rest (open/close); unlimited (stabilize)",
			recharge: "Long rest",
			requires_attunement: false,
			conditions: [],
		},
		discovery_lore:
			"The first recorded instance was an S-Rank Mage who sealed the Seoul Mega-Gate by pressing her palm against the membrane and willing it shut.",
		theme_tags: ["zenith", "gate", "sovereignty"],
	},
	{
		id: "boon-dimensional-anchor",
		name: "Boon of Dimensional Anchor",
		display_name: "Boon of Dimensional Anchor",
		description:
			"Your soul is anchored so deeply in reality that dimensional effects cannot displace you. Increase your Vitality or Presence by 4 (max 30). You cannot be teleported, banished, or plane-shifted against your will. You have advantage on all saving throws against spells and effects from the Conjuration school. Once per long rest, you can anchor a 30-foot radius area for 1 minute — no creature within the area can teleport, phase-shift, or use dimensional movement.",
		flavor: "You are here. Nothing in any dimension can change that.",
		tags: ["awakened", "feat", "zenith-boon", "defensive"],
		rarity: "legendary",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary:
				"+4 Vitality or Presence (max 30). Immune to forced teleportation.",
			secondary: "1/long rest: 30-foot anti-teleport zone for 1 minute.",
		},
		prerequisites: { level: 19 },
		repeatable: false,
		mechanics: {
			action_type: "Passive/Active",
			duration: "Permanent / 1 minute (anchor zone)",
			damage_profile: "N/A",
			range: "30-foot radius",
		},
		limitations: {
			uses: "Anti-teleport zone: 1/long rest",
			recharge: "Long rest",
			requires_attunement: false,
			conditions: [],
		},
		discovery_lore:
			"Developed after the Busan Incident where an S-Rank gate boss used mass teleportation to scatter an entire raid party into separate dungeon chambers.",
		theme_tags: ["zenith", "dimensional", "anchor"],
	},
	{
		id: "boon-undying-resonance",
		name: "Boon of Undying Resonance",
		display_name: "Boon of Undying Resonance",
		description:
			"Your mana field sustains your body beyond mortal limits. Increase your Vitality by 4 (max 30). When you are reduced to 0 HP, you can drop to 1 HP instead. Once you use this, you can't use it again until you finish a long rest. Additionally, you age at one-tenth the normal rate, you don't need food or water, and you are immune to disease and the poisoned condition.",
		flavor: "Death has tried. Death will keep trying. You're not worried.",
		tags: ["awakened", "feat", "zenith-boon", "defensive", "survival"],
		rarity: "legendary",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "+4 Vitality (max 30). Drop to 1 HP instead of 0, 1/long rest.",
			secondary:
				"Age 1/10 rate; no food/water needed; immune to disease/poison.",
		},
		prerequisites: { level: 19 },
		repeatable: false,
		mechanics: {
			action_type: "Passive/Reactive",
			duration: "Permanent",
			damage_profile: "N/A",
			range: "Self",
		},
		limitations: {
			uses: "Death-save: 1/long rest",
			recharge: "Long rest",
			requires_attunement: false,
			conditions: [],
		},
		discovery_lore:
			"Bureau longevity studies revealed that S-Rank Hunters over the age of 80 showed biological markers identical to 25-year-olds.",
		theme_tags: ["zenith", "immortality", "endurance"],
	},
	{
		id: "boon-annihilation-mandate",
		name: "Boon of Annihilation Mandate",
		display_name: "Boon of Annihilation Mandate",
		description:
			"Your damage output exceeds the theoretical maximum for your rank classification. Increase your Strength or Agility by 4 (max 30). Once per turn, when you hit with a weapon attack, you deal an extra 2d10 force damage. When you score a critical hit, you deal an extra 4d10 force damage instead. The target must succeed on a Strength saving throw (DC 8 + your proficiency bonus + your Strength or Agility modifier) or be knocked prone.",
		flavor:
			"Bureau classification: ANNIHILATION MANDATE AUTHORIZED. Collateral damage is expected.",
		tags: ["awakened", "feat", "zenith-boon", "offensive"],
		rarity: "legendary",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "+4 Strength or Agility (max 30). +2d10 force damage per turn.",
			secondary: "Crits deal +4d10 force; STR save or prone.",
		},
		prerequisites: { level: 19 },
		repeatable: false,
		mechanics: {
			action_type: "Passive",
			duration: "Permanent",
			damage_profile: "+2d10 force/turn (+4d10 on crit)",
			range: "Melee/Ranged",
		},
		limitations: {
			uses: "1/turn (damage); unlimited (crit bonus)",
			recharge: "N/A",
			requires_attunement: false,
			conditions: [],
		},
		discovery_lore:
			"The term 'Annihilation Mandate' entered Bureau vocabulary after a Destroyer solo-cleared an A-Rank gate in under four minutes.",
		theme_tags: ["zenith", "annihilation", "force"],
	},
	{
		id: "boon-omniscient-sight",
		name: "Boon of Omniscient Sight",
		display_name: "Boon of Omniscient Sight",
		description:
			"Your Aetheric-Sight has evolved beyond physical limitation. Increase your Sense or Intelligence by 4 (max 30). You have truesight out to 120 feet. You cannot be blinded. You can see through illusions, shapechanging, and magical darkness automatically. Once per long rest, you can see the exact location and condition of every creature within 1 mile for 1 minute.",
		flavor:
			"You see everything. The gate boss sees you seeing it. It starts running.",
		tags: ["awakened", "feat", "zenith-boon", "perception"],
		rarity: "legendary",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "+4 Sense or Intelligence (max 30). Truesight 120 feet.",
			secondary: "1/long rest: see all creatures within 1 mile for 1 minute.",
		},
		prerequisites: { level: 19 },
		repeatable: false,
		mechanics: {
			action_type: "Passive/Active",
			duration: "Permanent / 1 minute (mile sight)",
			damage_profile: "N/A",
			range: "120 feet / 1 mile",
		},
		limitations: {
			uses: "Mile-sight: 1/long rest",
			recharge: "Long rest",
			requires_attunement: false,
			conditions: [],
		},
		discovery_lore:
			"An S-Rank Esper reported seeing the gate boss through 200 meters of solid rock. Bureau sensors confirmed the creature was exactly where she said it was.",
		theme_tags: ["zenith", "truesight", "omniscience"],
	},
	{
		id: "boon-double-awakening",
		name: "Boon of Double Awakening",
		display_name: "Boon of Double Awakening",
		description:
			"You undergo a second Awakening, an event recorded fewer than ten times in Bureau history. Increase two ability scores of your choice by 2 (max 30). You gain proficiency in one saving throw of your choice. You gain one additional use of every feature that recharges on a short rest. When you roll initiative and have no uses remaining of any short-rest feature, you regain one use of each.",
		flavor: "The world measured you once. It was wrong.",
		tags: ["awakened", "feat", "zenith-boon", "versatile"],
		rarity: "legendary",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary:
				"+2 to two ability scores (max 30). New saving throw proficiency.",
			secondary:
				"+1 use of all short-rest features; regain uses on initiative if empty.",
		},
		prerequisites: { level: 19 },
		repeatable: false,
		mechanics: {
			action_type: "Passive",
			duration: "Permanent",
			damage_profile: "N/A",
			range: "Self",
		},
		limitations: {
			uses: "Permanent",
			recharge: "N/A",
			requires_attunement: false,
			conditions: [],
		},
		discovery_lore:
			"The Bureau reclassified the phenomenon from 'anomalous re-measurement' to 'Double Awakening' after a D-Rank Hunter's second measurement registered as S-Rank.",
		theme_tags: ["zenith", "double-awakening", "transcendence"],
	},
];
