import type { CompendiumFeat } from "../../types/compendium";

// ─── Tier 2: General Feats (level 4+, half-feats with +1 ASI) ──────
export const generalFeats: CompendiumFeat[] = [
	{
		id: "lattice-reader",
		name: "Lattice Reader",
		display_name: "Lattice Reader",
		description:
			"Your study of gate-crystal lattice structures has sharpened your analytical mind. Increase your Intelligence or Sense by 1 (max 20). You can identify the magical properties of an item by studying it for 10 minutes, without casting Identify. You can read rune inscriptions and lattice diagrams as if you had proficiency in Arcana.",
		flavor:
			"The lattice always tells the truth. People lie about what it says.",
		tags: ["awakened", "feat", "general", "knowledge"],
		rarity: "uncommon",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "+1 Intelligence or Sense. Identify items without spell.",
			secondary: "Read rune inscriptions as if proficient in Arcana.",
		},
		prerequisites: { level: 4 },
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
			"Codified by the Academy of High Magic as elective coursework after demand from non-caster Ascendants who needed to evaluate gate loot without a Mage on hand.",
		theme_tags: ["intelligence", "identification", "lattice"],
	},
	{
		id: "resonance-hardening",
		name: "Resonance Hardening",
		display_name: "Resonance Hardening",
		description:
			"Repeated mana exposure has crystallized micro-deposits in your skin and bones. Increase your Vitality or Strength by 1 (max 20). Once per turn, when you take damage from an attack, you can reduce that damage by an amount equal to your proficiency bonus. Nonmagical critical hits against you are treated as normal hits.",
		flavor:
			"Bureau doctors stopped trying to draw blood after the third bent needle.",
		tags: ["awakened", "feat", "general", "defensive"],
		rarity: "uncommon",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "+1 Vitality or Strength. Reduce damage by PB once/turn.",
			secondary: "Nonmagical crits become normal hits.",
		},
		prerequisites: { level: 4 },
		repeatable: false,
		mechanics: {
			action_type: "Passive",
			duration: "Permanent",
			damage_profile: "N/A",
			range: "Self",
		},
		limitations: {
			uses: "Permanent (damage reduction is once/turn)",
			recharge: "N/A",
			requires_attunement: false,
			conditions: [],
		},
		discovery_lore:
			"First observed in long-service Destroyers and Berserkers who had spent years near active gate sites — their bone density exceeded medical instrumentation limits.",
		theme_tags: ["defense", "hardening", "crystalline"],
	},
	{
		id: "phase-reflexes",
		name: "Phase Reflexes",
		display_name: "Phase Reflexes",
		description:
			"Your mana-infused nervous system fires faster than natural synapses. Increase your Agility or Sense by 1 (max 20). You add your proficiency bonus to initiative rolls. When a creature you can see hits you with an opportunity attack, you can use your reaction to halve the damage.",
		flavor:
			"You see the fist. Then you see where it was going. Then it misses.",
		tags: ["awakened", "feat", "general", "reflexes"],
		rarity: "uncommon",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "+1 Agility or Sense. Add PB to initiative.",
			secondary: "Reaction: halve opportunity attack damage.",
		},
		prerequisites: { level: 4 },
		repeatable: false,
		mechanics: {
			action_type: "Passive/Reactive",
			duration: "Permanent",
			damage_profile: "N/A",
			range: "Self",
			action: "1 reaction (for OA reduction)",
		},
		limitations: {
			uses: "Permanent (initiative); reaction (OA halving)",
			recharge: "N/A",
			requires_attunement: false,
			conditions: [],
		},
		discovery_lore:
			"The Assassin training academy in Seoul measured reflex arcs in Awakened cadets and found a 40ms advantage over peak human athletes.",
		theme_tags: ["reflexes", "initiative", "agility"],
	},
	{
		id: "absolute-channeler",
		name: "Absolute Channeler",
		display_name: "Absolute Channeler",
		description:
			"Your connection to the Absolute is unusually direct, amplifying your resonance. Increase your Presence or Intelligence by 1 (max 20). Your spell or power save DC increases by 1. When you force a creature to make a saving throw against one of your spells or powers, you learn its highest saving throw ability.",
		flavor: "The Absolute doesn't whisper to you. It speaks clearly.",
		tags: ["awakened", "feat", "general", "spellcasting"],
		rarity: "uncommon",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "+1 Presence or Intelligence. +1 spell/power save DC.",
			secondary: "Learn target's highest save when forcing a save.",
		},
		prerequisites: { level: 4 },
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
			conditions: ["Must have spellcasting or power access"],
		},
		discovery_lore:
			"Heralds and Idols with this attunement pattern have been documented channeling Absolute authority at intensities that crack nearby glass.",
		theme_tags: ["absolute", "channeling", "save-dc"],
	},
	{
		id: "heavy-weapon-mastery",
		name: "Heavy Weapon Mastery",
		display_name: "Heavy Weapon Mastery",
		description:
			"Your mana-enhanced musculature lets you wield heavy weapons with devastating force. Increase your Strength by 1 (max 20). Before you make a melee attack with a heavy weapon you are proficient with, you can choose to take a -5 penalty to the attack roll. If the attack hits, you add +10 to the damage roll. On your turn, when you score a critical hit or reduce a creature to 0 HP with a melee weapon, you can make one melee weapon attack as a bonus action.",
		flavor: "The weapon weighs 40 kilos. You swing it like a baseball bat.",
		tags: ["awakened", "feat", "general", "martial", "offensive"],
		rarity: "uncommon",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "+1 Strength. -5 attack / +10 damage with heavy weapons.",
			secondary: "Bonus action attack on crit or kill.",
		},
		prerequisites: { level: 4 },
		repeatable: false,
		mechanics: {
			action_type: "Passive/Active",
			duration: "Permanent",
			damage_profile: "+10 conditional",
			range: "Melee",
		},
		limitations: {
			uses: "Unlimited (-5/+10); bonus attack on crit/kill",
			recharge: "N/A",
			requires_attunement: false,
			conditions: ["Heavy weapon proficiency"],
		},
		discovery_lore:
			"Destroyer and Berserker combat instructors at the Bureau Academy developed this doctrine after analyzing gate-boss kill footage.",
		theme_tags: ["heavy-weapon", "power-attack", "martial"],
	},
	{
		id: "precision-shooter",
		name: "Precision Shooter",
		display_name: "Precision Shooter",
		description:
			"Mana-enhanced focus lets you place ranged attacks with surgical precision. Increase your Agility by 1 (max 20). Attacking at long range does not impose disadvantage on your ranged weapon attack rolls. Your ranged weapon attacks ignore half cover and three-quarters cover. Before you make a ranged attack with a weapon you are proficient with, you can choose -5 to the attack roll to add +10 to damage.",
		flavor: "Bureau marksmanship records list you under 'statistical anomaly.'",
		tags: ["awakened", "feat", "general", "martial", "ranged"],
		rarity: "uncommon",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "+1 Agility. No disadvantage at long range; ignore cover.",
			secondary: "-5 attack / +10 damage on ranged attacks.",
		},
		prerequisites: { level: 4 },
		repeatable: false,
		mechanics: {
			action_type: "Passive/Active",
			duration: "Permanent",
			damage_profile: "+10 conditional",
			range: "Ranged",
		},
		limitations: {
			uses: "Unlimited",
			recharge: "N/A",
			requires_attunement: false,
			conditions: ["Ranged weapon proficiency"],
		},
		discovery_lore:
			"Stalkers and Technomancers refined this discipline after discovering that mana-enhanced proprioception eliminated human aim variance.",
		theme_tags: ["ranged", "precision", "sharpshooter"],
	},
	{
		id: "sentinel-stance",
		name: "Sentinel Stance",
		display_name: "Sentinel Stance",
		description:
			"Your mana-reinforced footwork lets you lock down threats that try to bypass you. Increase your Strength or Vitality by 1 (max 20). When you hit a creature with an opportunity attack, that creature's speed becomes 0 for the rest of the turn. Creatures provoke opportunity attacks from you even if they take the Disengage action. When a creature within 5 feet of you makes an attack against a target other than you, you can use your reaction to make a melee weapon attack against the attacking creature.",
		flavor: "Nothing gets past you. The gate boss tried. The gate boss failed.",
		tags: ["awakened", "feat", "general", "martial", "defensive"],
		rarity: "uncommon",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "+1 Strength or Vitality. OA reduces speed to 0.",
			secondary: "Disengage doesn't work; reaction attack when ally targeted.",
		},
		prerequisites: { level: 4 },
		repeatable: false,
		mechanics: {
			action_type: "Passive/Reactive",
			duration: "Permanent",
			damage_profile: "N/A",
			range: "5 feet",
		},
		limitations: {
			uses: "Unlimited (OA/Disengage); 1 reaction/round (ally protection)",
			recharge: "N/A",
			requires_attunement: false,
			conditions: [],
		},
		discovery_lore:
			"Destroyer frontline doctrine codified this stance after analyzing how A-Rank gate bosses consistently targeted the weakest party member.",
		theme_tags: ["sentinel", "tanking", "opportunity-attack"],
	},
	{
		id: "war-resonance",
		name: "War Resonance",
		display_name: "War Resonance",
		description:
			"Battle sharpens your mana focus rather than breaking it. Increase your Intelligence or Presence by 1 (max 20). You have advantage on Vitality saving throws to maintain concentration on a spell or power when you take damage. You can perform the somatic components of spells even when you have weapons or a shield in one or both hands. When a hostile creature's movement provokes an opportunity attack from you, you can cast a spell at the creature instead of making a weapon attack — the spell must have a casting time of 1 action and target only that creature.",
		flavor:
			"Most casters flinch when the gate boss charges. You finish the incantation.",
		tags: ["awakened", "feat", "general", "spellcasting", "combat"],
		rarity: "uncommon",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "+1 Intelligence or Presence. Concentration advantage.",
			secondary: "Cast with full hands; spell as opportunity attack.",
		},
		prerequisites: { level: 4 },
		repeatable: false,
		mechanics: {
			action_type: "Passive/Reactive",
			duration: "Permanent",
			damage_profile: "N/A",
			range: "Self",
		},
		limitations: {
			uses: "Permanent",
			recharge: "N/A",
			requires_attunement: false,
			conditions: ["Must have spellcasting access"],
		},
		discovery_lore:
			"Mages who survived S-Rank gates developed this naturally — the lattice in their nervous system adapted to stabilize under combat stress.",
		theme_tags: ["concentration", "combat-casting", "war"],
	},
	{
		id: "lucky-resonance",
		name: "Lucky Resonance",
		display_name: "Lucky Resonance",
		description:
			"Your mana field subtly bends probability in your favor. Increase any one ability score by 1 (max 20). You have 3 luck points. Whenever you make an attack roll, ability check, or saving throw, you can spend a luck point to roll an additional d20. You choose which d20 to use. You can also spend a luck point when an attack roll is made against you — roll a d20 and choose whether the attacker uses their roll or yours. You regain all luck points after a long rest.",
		flavor:
			"Bullets curve around you. Cards fall your way. The Bureau calls it 'resonance variance.' You call it luck.",
		tags: ["awakened", "feat", "general", "utility"],
		rarity: "uncommon",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "+1 to any ability score. 3 luck points per long rest.",
			secondary: "Reroll any d20; force attacker to use your d20.",
		},
		prerequisites: { level: 4 },
		repeatable: false,
		mechanics: {
			action_type: "Active",
			duration: "Permanent",
			damage_profile: "N/A",
			range: "Self",
		},
		limitations: {
			uses: "3/long rest",
			recharge: "Long rest",
			requires_attunement: false,
			conditions: [],
		},
		discovery_lore:
			"Bureau statisticians flagged several Ascendants whose combat outcomes deviated from probability models by more than six standard deviations.",
		theme_tags: ["luck", "probability", "reroll"],
	},
	{
		id: "mana-blade-resonance",
		name: "Mana Blade Resonance",
		display_name: "Mana Blade Resonance",
		description:
			"You can channel mana through melee weapons, extending their striking edge with crystallized energy. Increase your Strength or Agility by 1 (max 20). Once per turn, when you hit with a melee weapon attack, you can add 1d6 force damage to the strike. Your melee weapon attacks count as magical for the purpose of overcoming resistance and immunity.",
		flavor:
			"The blade is 30 inches of steel. The mana edge adds another six you can't see.",
		tags: ["awakened", "feat", "general", "martial", "offensive"],
		rarity: "uncommon",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "+1 Strength or Agility. +1d6 force damage once/turn.",
			secondary: "Melee attacks count as magical.",
		},
		prerequisites: { level: 4 },
		repeatable: false,
		mechanics: {
			action_type: "Passive",
			duration: "Permanent",
			damage_profile: "+1d6 force/turn",
			range: "Melee",
		},
		limitations: {
			uses: "1/turn (bonus damage)",
			recharge: "N/A",
			requires_attunement: false,
			conditions: ["Melee weapon proficiency"],
		},
		discovery_lore:
			"Holy Knights and Destroyers discovered this independently — the crystallized mana in their bones resonated with held weapons under combat stress.",
		theme_tags: ["mana-blade", "force-damage", "magical-strikes"],
	},
	{
		id: "gate-vanguard",
		name: "Gate Vanguard",
		display_name: "Gate Vanguard",
		description:
			"You specialize in being the first through the gate and the last to leave. Increase your Vitality or Presence by 1 (max 20). You have advantage on initiative rolls. You cannot be surprised while conscious. Other creatures do not gain advantage on attack rolls against you as a result of being unseen by you.",
		flavor: "When the gate opens, someone has to go first. It's always you.",
		tags: ["awakened", "feat", "general", "defensive", "initiative"],
		rarity: "uncommon",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "+1 Vitality or Presence. Advantage on initiative.",
			secondary: "Cannot be surprised; unseen attackers don't get advantage.",
		},
		prerequisites: { level: 4 },
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
			conditions: ["Must be conscious"],
		},
		discovery_lore:
			"After the third gate-break ambush in a single month, the Bureau mandated point-entry training for all field-certified Ascendants rank C and above.",
		theme_tags: ["initiative", "surprise", "vanguard"],
	},
	{
		id: "aetheric-sight-focus",
		name: "Aetheric Sight Focus",
		display_name: "Aetheric Sight Focus",
		description:
			"Your Aetheric-Sight has been trained to a surgical level of precision. Increase your Sense or Intelligence by 1 (max 20). As a bonus action, you can focus your Aetheric-Sight on a creature within 60 feet. You learn its current HP percentage, AC, highest saving throw, and lowest saving throw. You can use this a number of times equal to your proficiency bonus per long rest.",
		flavor:
			"You don't guess at the gate boss's weak point. You see it glowing.",
		tags: ["awakened", "feat", "general", "utility", "tactical"],
		rarity: "uncommon",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "+1 Sense or Intelligence. Bonus action: scan creature stats.",
			secondary: "Learn HP%, AC, best save, worst save.",
		},
		prerequisites: { level: 4 },
		repeatable: false,
		mechanics: {
			action_type: "Active",
			duration: "Instantaneous",
			damage_profile: "N/A",
			range: "60 feet",
			action: "1 bonus action",
		},
		limitations: {
			uses: "Proficiency bonus/long rest",
			recharge: "Long rest",
			requires_attunement: false,
			conditions: [],
		},
		discovery_lore:
			"Destroyer training manuals describe this as 'Mana-Signature Scan' — the formal technique behind the instinct every front-liner develops.",
		theme_tags: ["aetheric-sight", "scan", "tactical"],
	},
	{
		id: "mana-surge-catalyst",
		name: "Mana Surge Catalyst",
		display_name: "Mana Surge Catalyst",
		description:
			"Your mana circuits can briefly overclock, amplifying a single ability at the cost of strain. Increase your Intelligence or Vitality by 1 (max 20). Once per short rest, when you deal damage with a spell, power, or technique, you can surge your mana output to maximize one damage die (treat it as its maximum value instead of rolling). After surging, you take force damage equal to your character level as mana feedback.",
		flavor:
			"The circuit wasn't designed to handle this. Neither were you. But here we are.",
		tags: ["awakened", "feat", "general", "offensive", "risk"],
		rarity: "uncommon",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "+1 Intelligence or Vitality. Maximize one damage die.",
			secondary: "Self-damage equal to character level after surging.",
		},
		prerequisites: { level: 4 },
		repeatable: false,
		mechanics: {
			action_type: "Active",
			duration: "Instantaneous",
			damage_profile: "Maximize 1 die",
			range: "Self",
		},
		limitations: {
			uses: "1/short rest",
			recharge: "Short rest",
			requires_attunement: false,
			conditions: ["Must deal damage with spell/power/technique"],
		},
		discovery_lore:
			"Bureau medical staff documented the first mana surge feedback injury when an Esper deliberately overcharged a Thought Spike during the Gwangju gate break.",
		theme_tags: ["surge", "overclock", "risk-reward"],
	},
	{
		id: "adaptive-resistance",
		name: "Adaptive Resistance",
		display_name: "Adaptive Resistance",
		description:
			"Your mana field instinctively reinforces against repeated damage types. Increase your Vitality by 1 (max 20). When you take damage of a specific type (fire, cold, lightning, etc.), you gain resistance to that damage type until the start of your next turn. This adaptation can only apply to one damage type at a time — if you take damage of a different type, the resistance switches.",
		flavor: "The first hit teaches your body. The second one bounces.",
		tags: ["awakened", "feat", "general", "defensive", "adaptive"],
		rarity: "uncommon",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "+1 Vitality. Gain resistance to last damage type taken.",
			secondary:
				"Resistance lasts until start of next turn; switches on new type.",
		},
		prerequisites: { level: 4 },
		repeatable: false,
		mechanics: {
			action_type: "Passive",
			duration: "Until start of next turn",
			damage_profile: "N/A",
			range: "Self",
		},
		limitations: {
			uses: "Unlimited (one type at a time)",
			recharge: "N/A",
			requires_attunement: false,
			conditions: [],
		},
		discovery_lore:
			"Observed in Berserkers who fought extended gate-clear sessions against elemental anomalies — their mana fields visibly shifted color to match incoming damage.",
		theme_tags: ["adaptation", "resistance", "elemental"],
	},
	{
		id: "twin-fang-technique",
		name: "Twin Fang Technique",
		display_name: "Twin Fang Technique",
		description:
			"Your dual-wielding technique channels mana through both weapons simultaneously. Increase your Agility or Strength by 1 (max 20). When you engage in two-weapon fighting, you can add your ability modifier to the damage of the bonus-action attack. Additionally, when you hit a creature with both your main-hand and off-hand attacks on the same turn, that creature has disadvantage on its next attack roll before the start of your next turn.",
		flavor: "One blade for the opening. One blade for the kill.",
		tags: ["awakened", "feat", "general", "martial", "dual-wield"],
		rarity: "uncommon",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "+1 Agility or Strength. Add ability mod to off-hand damage.",
			secondary: "Double-hit imposes disadvantage on target's next attack.",
		},
		prerequisites: { level: 4 },
		repeatable: false,
		mechanics: {
			action_type: "Passive",
			duration: "Permanent",
			damage_profile: "+ability mod to off-hand",
			range: "Melee",
		},
		limitations: {
			uses: "Unlimited",
			recharge: "N/A",
			requires_attunement: false,
			conditions: ["Two-weapon fighting"],
		},
		discovery_lore:
			"Assassin Guild records attribute the formalization of this style to a B-Rank operative who cleared 47 consecutive gates using nothing but paired daggers.",
		theme_tags: ["dual-wield", "twin-weapon", "assassin"],
	},
	{
		id: "iron-vitality",
		name: "Iron Vitality",
		display_name: "Iron Vitality",
		description:
			"Your Awakened metabolism processes toxins and trauma with inhuman efficiency. Increase your Vitality by 1 (max 20). You have advantage on saving throws against poison, and you have resistance to poison damage. When you spend Hit Dice during a short rest, you can reroll any die that shows a 1 or 2 and must use the new result. You recover one additional Hit Die when you finish a long rest.",
		flavor: "The poison entered your bloodstream. Your bloodstream disagreed.",
		tags: ["awakened", "feat", "general", "defensive", "healing"],
		rarity: "uncommon",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "+1 Vitality. Advantage on poison saves; poison resistance.",
			secondary:
				"Reroll 1s and 2s on Hit Dice; recover +1 Hit Die on long rest.",
		},
		prerequisites: { level: 4 },
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
			"Bureau toxicology labs discovered that mana-saturated liver tissue filtered poisons 300% faster than baseline human tissue.",
		theme_tags: ["vitality", "poison", "endurance"],
	},
	{
		id: "party-sync",
		name: "Party Sync",
		display_name: "Party Sync",
		description:
			"Your mana field instinctively harmonizes with nearby allies, creating a combat resonance link. Increase your Presence or Sense by 1 (max 20). When an ally within 30 feet of you that you can see makes a saving throw, you can use your reaction to grant that ally a bonus to the save equal to your proficiency bonus. You can use this feature a number of times equal to your Presence modifier (minimum 1) per long rest.",
		flavor:
			"You feel them falter before they do. Your mana answers before they ask.",
		tags: ["awakened", "feat", "general", "support", "party"],
		rarity: "uncommon",
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: "+1 Presence or Sense. Reaction: add PB to ally's save.",
			secondary: "Uses equal to Presence modifier per long rest.",
		},
		prerequisites: { level: 4 },
		repeatable: false,
		mechanics: {
			action_type: "Reactive",
			duration: "Instantaneous",
			damage_profile: "N/A",
			range: "30 feet",
			action: "1 reaction",
		},
		limitations: {
			uses: "Presence modifier/long rest",
			recharge: "Long rest",
			requires_attunement: false,
			conditions: ["Ally within 30 feet, visible"],
		},
		discovery_lore:
			"Herald and Idol raid leaders first documented this resonance link during coordinated S-Rank gate clears, where synchronized mana fields measurably improved party survival.",
		theme_tags: ["party", "sync", "aura"],
	},
];
