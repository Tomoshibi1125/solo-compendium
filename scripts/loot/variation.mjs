// Variation engine: each item gets a unique mechanical fingerprint based on
// (archetype × name × rarity × theme prefix) instead of a fixed template.
//
// Three layers stack:
//   1. Archetype variant      — one of N sub-mechanical templates per archetype
//   2. Theme overlay          — damage type + on-hit rider keyed off the name prefix
//   3. Rarity enhancement     — unique passive(s) and (rare+) active ability
//
// All choices are deterministic (FNV-1a on name+id) so rerunning is idempotent.

import { fnv1a } from "./lib.mjs";

// =============================================================
// 1. Theme overlays
// =============================================================
//
// A theme is detected from the item name's leading adjective and applies a damage
// type override and an on-hit / on-crit rider passive.

export const THEMES = [
	{
		match: /\b(Void|Abyssal|Phantom|Eclipse|Nullus|Hollow|Banished)\b/i,
		key: "void",
		damageType: "necrotic",
		consumableSubtype: "berserker",
		ridersWeapon: [
			"On a hit, target makes a DC 12 Vitality save or has disadvantage on its next attack.",
			"On a critical hit, target is Frightened until the end of its next turn.",
			"On a hit, target's space becomes lattice-bled difficult terrain until the end of its next turn.",
		],
		ridersArmor: [
			"Resistance to necrotic damage.",
			"Once per long rest, when reduced to 0 HP, drop to 1 HP instead.",
		],
		ridersConsumable: ["Grants resistance to necrotic damage for 1 minute."],
	},
	{
		match: /\b(Frost|Chill|Cryo|Ice|Glacial|Rime|Tundra|Polar|Hailstone)\b/i,
		key: "frost",
		damageType: "cold",
		consumableSubtype: "fortifying",
		ridersWeapon: [
			"On a hit, target's speed is reduced by 10 ft. until the end of its next turn.",
			"On a critical hit, target is Restrained until it uses an action to break free (Strength DC 12).",
			"On a hit, the target loses any reaction it has remaining this round.",
		],
		ridersArmor: ["Resistance to cold damage.", "Immunity to environmental cold below 0°C."],
		ridersConsumable: ["Restores 1d4 cold damage. Grants resistance to fire damage for 1 minute."],
	},
	{
		match: /\b(Crimson|Bleeding|Sanguine|Bloody|Bloodborne|Bloodied|Hemo|Crimsonback)\b/i,
		key: "crimson",
		damageType: "slashing",
		consumableSubtype: "healing",
		ridersWeapon: [
			"On a hit, target takes 1d4 ongoing slashing damage at the start of its next two turns (Bleeding).",
			"On a critical hit, the bleed damage doubles and lasts 4 turns instead of 2.",
			"While target is below half HP, attacks with this weapon deal +1d4 damage.",
		],
		ridersArmor: ["When you take damage, regain 1d4 HP at the start of your next turn (1/short rest)."],
		ridersConsumable: ["Restores HP and grants advantage on Vitality saves for 1 minute."],
	},
	{
		match: /\b(Aetheric|Aether|Arcane|Lattice|Manaforged|Manabound|Mana|Aetherbound)\b/i,
		key: "aetheric",
		damageType: "force",
		consumableSubtype: "mana",
		ridersWeapon: [
			"On a hit, target loses 1 mana point (if any).",
			"On a critical hit, target's next spellcast within 1 minute requires a DC 13 concentration save.",
			"While attuned, gain +1 to spell-attack rolls.",
		],
		ridersArmor: ["Resistance to force damage.", "+1 to spell-save DCs while worn."],
		ridersConsumable: ["Restores mana instead of HP."],
	},
	{
		match: /\b(Starlight|Celestial|Dawn|Solar|Radiant|Sunblessed|Aurora|Lumen)\b/i,
		key: "starlight",
		damageType: "radiant",
		consumableSubtype: "healing",
		ridersWeapon: [
			"On a hit, target sheds dim light in a 5-ft. radius until the start of your next turn.",
			"On a critical hit, target is Blinded until the end of its next turn.",
			"+1d4 radiant damage on the first hit each round against an Anomaly.",
		],
		ridersArmor: [
			"Resistance to radiant damage.",
			"Sheds bright light in a 10-ft. radius and dim light for an additional 10 ft. when commanded (no action).",
		],
		ridersConsumable: ["Cures one of: blinded, charmed, frightened. Grants 1d6 temporary HP."],
	},
	{
		match: /\b(Shadow|Umbral|Dark|Obsidian|Nightfall|Eclipsed|Twilight|Penumbra)\b/i,
		key: "shadow",
		damageType: "necrotic",
		consumableSubtype: "stamina",
		ridersWeapon: [
			"While in dim light or darkness, attacks with this weapon have advantage.",
			"On a critical hit, you become invisible until the end of your next turn or until you attack again.",
			"+1d4 damage when attacking from an unseen position.",
		],
		ridersArmor: [
			"Advantage on Stealth checks made in dim light or darkness.",
			"Disadvantage on attacks against you while you are obscured.",
		],
		ridersConsumable: ["Grants 1 minute of stealth advantage in dim light or darkness."],
	},
	{
		match: /\b(Storm|Lightning|Thunder|Tempest|Voltage|Galvanic|Stormcaller)\b/i,
		key: "storm",
		damageType: "lightning",
		ridersWeapon: [
			"On a hit, target makes a DC 12 Strength save or is pushed 5 ft. away.",
			"On a critical hit, all enemies within 5 ft. of the target take 1d6 lightning damage.",
			"In rain or storm conditions, attacks have advantage.",
		],
		ridersArmor: ["Resistance to lightning damage.", "Once per long rest, when struck by lightning, regain HP equal to half the damage taken instead."],
		ridersConsumable: ["Grants resistance to lightning damage and advantage on Agility saves for 1 minute."],
	},
	{
		match: /\b(Flame|Fire|Inferno|Burning|Pyre|Ember|Cinder|Wildfire|Searing)\b/i,
		key: "flame",
		damageType: "fire",
		ridersWeapon: [
			"On a hit, target ignites and takes 1d4 fire damage at the end of its next turn (water or DC 10 Agility ends).",
			"On a critical hit, target's flammable equipment makes a DC 12 save or burns away.",
			"+1d4 fire damage against creatures with cold resistance or vulnerability.",
		],
		ridersArmor: ["Resistance to fire damage.", "Cannot be set on fire by mundane sources."],
		ridersConsumable: ["Cures the burning condition. Grants resistance to fire damage for 1 minute."],
	},
	{
		match: /\b(Toxic|Venomous|Venom|Acid|Corrosive|Caustic|Vitriol|Necrotoxic)\b/i,
		key: "toxic",
		damageType: "acid",
		consumableSubtype: "healing",
		ridersWeapon: [
			"On a hit, target makes a DC 12 Vitality save or is Poisoned until the end of its next turn.",
			"On a critical hit, target's armor takes a -1 cumulative penalty until the end of combat.",
			"+1d4 acid damage to objects and constructs.",
		],
		ridersArmor: ["Resistance to acid damage.", "Once per long rest, neutralize an active poison effect on you."],
		ridersConsumable: ["Cures the poisoned condition and removes 1d4 ongoing damage."],
	},
	{
		match: /\b(Rift|Dimensional|Gateforged|Gatebound|Tear|Riftborn|Riftbound|Riftforged)\b/i,
		key: "rift",
		damageType: "force",
		ridersWeapon: [
			"On a critical hit, you may shift up to 5 ft. as a free movement immediately after the strike.",
			"On a hit, the target makes a DC 12 Sense save or sees its allies as enemies until the end of its next turn.",
			"Ignores cover provided by mundane materials within 5 ft. of the target.",
		],
		ridersArmor: ["Once per long rest, when an attack would hit you, you may rift-shift 5 ft.; the attack is rerolled against the new position."],
		ridersConsumable: ["Grants the ability to teleport up to 30 ft. as a bonus action (1 use)."],
	},
	{
		match: /\b(Holy|Sacred|Blessed|Sanctified|Hallowed|Divine|Pious|Consecrated)\b/i,
		key: "holy",
		damageType: "radiant",
		consumableSubtype: "healing",
		ridersWeapon: [
			"+1d6 radiant damage on the first hit each round against creatures with the Anomaly tag.",
			"On a critical hit against an Anomaly, the target makes a DC 13 Vitality save or is Turned for 1 minute.",
			"While attuned, you have advantage on saves against being Charmed.",
		],
		ridersArmor: [
			"Advantage on saves vs. Frightened.",
			"+1 AC against attacks made by Anomaly-tagged creatures.",
		],
		ridersConsumable: ["Cures Frightened, Charmed, or Lattice-Bled conditions. Grants 1d6 temporary HP."],
	},
	{
		match: /\b(Cursed|Hexed|Wraith|Banshee|Doom|Wretch|Pall|Doombound)\b/i,
		key: "cursed",
		damageType: "necrotic",
		ridersWeapon: [
			"On a hit, target makes a DC 12 Sense save or has disadvantage on saves until the end of its next turn.",
			"On a critical hit, target's next attack roll is at disadvantage.",
			"While attuned, you take 1d4 necrotic damage when reduced below half HP (curse).",
		],
		ridersArmor: ["Cursed: cannot be voluntarily removed once attuned. While attuned, +1 AC."],
		ridersConsumable: ["Inflicts a chosen 1-minute curse on a touched creature on a failed DC 13 Vitality save."],
		cursed: true,
	},
];

export function detectTheme(name) {
	for (const t of THEMES) {
		if (t.match.test(String(name || ""))) return t;
	}
	return null;
}

// =============================================================
// 2. Archetype variant pools
// =============================================================
//
// Each archetype defines 3-5 mechanical variants. Variant choice is deterministic
// by FNV-1a hash of the item id+name. Variants differ in damage die, damage type
// fallback (when no theme), simple_properties, and a unique flavor passive.

function pickVariant(variants, key) {
	if (!variants || variants.length === 0) return null;
	const idx = fnv1a(key) % variants.length;
	return variants[idx];
}

const VARIANT_POOLS = {
	// --- Firearms ---
	firearm_pistol: [
		{ damage: "1d8", damageType: "piercing", props: ["ammunition", "light"], range: "Ranged (40/120)", note: "Sidearm. Reload (1) on a bonus action." },
		{ damage: "1d6", damageType: "piercing", props: ["ammunition", "light", "finesse"], range: "Ranged (50/150)", note: "Snub-frame. Counts as a finesse weapon." },
		{ damage: "1d10", damageType: "piercing", props: ["ammunition"], range: "Ranged (40/120)", note: "Magnum-frame. -1 to attack within 5 ft." },
		{ damage: "1d8", damageType: "piercing", props: ["ammunition", "light", "silent"], range: "Ranged (30/90)", note: "Suppressed. Doesn't reveal your position when fired." },
	],
	firearm_rifle: [
		{ damage: "1d10", damageType: "piercing", props: ["ammunition", "two-handed"], range: "Ranged (80/240)", note: "Long-arm. Disadvantage on attacks within 5 ft." },
		{ damage: "1d12", damageType: "piercing", props: ["ammunition", "two-handed", "loading"], range: "Ranged (100/400)", note: "Bolt-action. One attack per turn; +1 to attack rolls." },
		{ damage: "2d6", damageType: "piercing", props: ["ammunition", "two-handed", "heavy"], range: "Ranged (80/240)", note: "Marksman variant. Crit on 19-20." },
		{ damage: "1d8", damageType: "piercing", props: ["ammunition", "two-handed", "burst-fire"], range: "Ranged (60/180)", note: "Auto-rifle. Burst-fire (3 rd, +1d6) on a single attack." },
	],
	firearm_shotgun: [
		{ damage: "2d6", damageType: "piercing", props: ["ammunition", "two-handed", "loading"], range: "Ranged (15/60)", note: "Spread shot. Loading: one attack per turn." },
		{ damage: "1d10", damageType: "piercing", props: ["ammunition", "two-handed", "burst-fire"], range: "Ranged (15/45)", note: "Auto-shotgun. Burst-fire (3 rd, +1d6)." },
		{ damage: "3d4", damageType: "piercing", props: ["ammunition", "two-handed"], range: "Ranged (10/30)", note: "Sawed-off. Each attack hits up to 2 adjacent targets." },
	],
	firearm_smg: [
		{ damage: "1d6", damageType: "piercing", props: ["ammunition", "light", "burst-fire"], range: "Ranged (40/120)", note: "Burst fire (3 rd, +1d6 damage on hit)." },
		{ damage: "1d4", damageType: "piercing", props: ["ammunition", "light", "automatic"], range: "Ranged (30/90)", note: "Automatic. Suppressing fire imposes -2 to enemy attacks in a 15-ft. cone." },
	],
	firearm_launcher: [
		{ damage: "3d6", damageType: "force", props: ["ammunition", "two-handed", "heavy", "loading"], range: "Ranged (60/180)", note: "AoE: 10 ft. radius. DC 13 Agility save halves damage." },
		{ damage: "2d8", damageType: "fire", props: ["ammunition", "two-handed", "heavy", "loading"], range: "Ranged (40/120)", note: "Incendiary. AoE 10 ft.: ignites flammable objects on a fail." },
	],

	// --- Melee bladed ---
	melee_blade_finesse: [
		{ damage: "1d4", damageType: "piercing", props: ["light", "finesse", "thrown"], note: "Off-hand attack on a hit deals +1 damage if you are wielding two weapons." },
		{ damage: "1d6", damageType: "piercing", props: ["light", "finesse"], note: "Crit on 19-20." },
		{ damage: "1d6", damageType: "slashing", props: ["light", "finesse"], note: "+1 to attack rolls when you have advantage." },
	],
	melee_blade_versatile: [
		{ damage: "1d8", damageType: "slashing", props: ["versatile (1d10)"], note: "" },
		{ damage: "1d8", damageType: "piercing", props: ["versatile (1d10)"], note: "Counts as both slashing and piercing for resistance bypass." },
		{ damage: "1d10", damageType: "slashing", props: ["versatile (1d12)", "two-handed-bonus"], note: "When wielded two-handed, +1 to damage rolls." },
	],
	melee_blade_heavy: [
		{ damage: "2d6", damageType: "slashing", props: ["heavy", "two-handed"], note: "" },
		{ damage: "1d12", damageType: "slashing", props: ["heavy", "two-handed"], note: "On a critical hit, deal an additional 2d6 damage." },
		{ damage: "2d8", damageType: "slashing", props: ["heavy", "two-handed", "loading"], note: "Slow swing: this weapon attacks last in initiative; deals double damage on a critical hit." },
	],
	melee_polearm: [
		{ damage: "1d10", damageType: "piercing", props: ["heavy", "reach", "two-handed"], note: "Reach: melee attacks have 10 ft. range." },
		{ damage: "1d8", damageType: "slashing", props: ["heavy", "reach", "two-handed"], note: "Reach. On a hit, you may use a reaction to make an opportunity attack against a creature within 10 ft." },
		{ damage: "2d4", damageType: "piercing", props: ["reach", "two-handed", "thrown"], note: "Thrown reach (range 20/60). Returns to your hand at the start of your next turn." },
	],

	// --- Bludgeon ---
	melee_bludgeon: [
		{ damage: "1d6", damageType: "bludgeoning", props: ["versatile (1d8)"], note: "" },
		{ damage: "1d8", damageType: "bludgeoning", props: ["versatile (1d10)"], note: "On a hit, target makes a DC 11 Strength save or has disadvantage on its next attack." },
		{ damage: "1d6", damageType: "bludgeoning", props: ["light", "thrown"], note: "Thrown 20/60. Returns to your hand on a hit." },
	],
	melee_bludgeon_heavy: [
		{ damage: "1d10", damageType: "bludgeoning", props: ["heavy", "two-handed"], note: "On a hit, target makes a DC 13 Strength save or is knocked prone." },
		{ damage: "2d6", damageType: "bludgeoning", props: ["heavy", "two-handed", "loading"], note: "Slow swing. On hit, deal +1 damage per 2 levels of the wielder." },
		{ damage: "1d12", damageType: "bludgeoning", props: ["heavy", "two-handed"], note: "Crit on 19-20. Critical hits push target 5 ft." },
	],
	melee_staff: [
		{ damage: "1d6", damageType: "bludgeoning", props: ["versatile (1d8)"], note: "Doubles as an arcane focus." },
		{ damage: "1d4", damageType: "bludgeoning", props: ["versatile (1d6)", "light"], note: "Doubles as an arcane focus. +1 to spell-save DCs while wielded." },
		{ damage: "1d8", damageType: "bludgeoning", props: ["versatile (1d10)", "two-handed-bonus"], note: "Quarterstaff variant. Counts as a martial Striker weapon." },
	],

	// --- Specialty melee ---
	melee_gauntlet: [
		{ damage: "1d4", damageType: "bludgeoning", props: ["light", "striker"], note: "Counts as an unarmed strike for Striker class features." },
		{ damage: "1d6", damageType: "bludgeoning", props: ["light", "striker"], note: "Counts as an unarmed strike. On a hit, target makes a DC 11 Strength save or is grappled." },
		{ damage: "1d6", damageType: "slashing", props: ["light", "finesse", "striker"], note: "Bladed knuckles. Finesse." },
		{ damage: "1d4", damageType: "force", props: ["light", "striker", "arcane focus"], note: "Aether-knuckles. Counts as an arcane focus and a Striker weapon." },
	],
	melee_whip: [
		{ damage: "1d4", damageType: "slashing", props: ["finesse", "reach"], note: "Reach: melee attacks have 10 ft. range." },
		{ damage: "1d6", damageType: "slashing", props: ["finesse", "reach"], note: "Reach. On a hit, target makes a DC 11 Agility save or is pulled 5 ft. toward you." },
		{ damage: "1d4", damageType: "bludgeoning", props: ["finesse", "reach"], note: "Reach. On a hit, target makes a DC 11 Strength save or is disarmed." },
	],
	melee_axe: [
		{ damage: "1d8", damageType: "slashing", props: ["versatile (1d10)"], note: "" },
		{ damage: "1d6", damageType: "slashing", props: ["light", "thrown"], note: "Thrown 20/60." },
		{ damage: "1d12", damageType: "slashing", props: ["heavy", "two-handed"], note: "Crit on 19-20." },
	],
	melee_sickle: [
		{ damage: "1d4", damageType: "slashing", props: ["light"], note: "" },
		{ damage: "1d6", damageType: "slashing", props: ["light", "finesse"], note: "Finesse. +1 damage when target is below half HP." },
	],

	// --- Ranged non-firearm ---
	ranged_bow: [
		{ damage: "1d8", damageType: "piercing", props: ["ammunition", "two-handed"], range: "Ranged (150/600)", note: "" },
		{ damage: "1d6", damageType: "piercing", props: ["ammunition", "two-handed", "silent"], range: "Ranged (80/320)", note: "Silent. Doesn't reveal your position when fired." },
		{ damage: "1d10", damageType: "piercing", props: ["ammunition", "two-handed", "loading"], range: "Ranged (200/800)", note: "Bolt-action longbow variant. One attack per turn; +1 to attack rolls." },
	],
	ranged_crossbow: [
		{ damage: "1d8", damageType: "piercing", props: ["ammunition", "loading"], range: "Ranged (80/320)", note: "" },
		{ damage: "1d10", damageType: "piercing", props: ["ammunition", "loading", "two-handed"], range: "Ranged (100/400)", note: "Heavy variant." },
		{ damage: "2d4", damageType: "piercing", props: ["ammunition", "two-handed"], range: "Ranged (60/180)", note: "Repeater. No loading; can attack twice per turn at -2 to attack rolls." },
	],
	ranged_thrown: [
		{ damage: "1d4", damageType: "piercing", props: ["finesse", "thrown"], range: "Ranged (20/60)", note: "" },
		{ damage: "1d6", damageType: "slashing", props: ["finesse", "thrown"], range: "Ranged (30/90)", note: "Crit on 19-20." },
	],

	// --- Foci ---
	focus_caster: [
		{ note: "Acts as an arcane focus. +1 to spell attack rolls.", item_type: "tool", type: "focus" },
		{ note: "Acts as an arcane focus. Once per long rest, regain 1 spell slot of 3rd level or lower.", item_type: "tool", type: "focus" },
		{ note: "Acts as an arcane focus. Spells cast through this focus add +1 to damage or healing rolls.", item_type: "tool", type: "focus" },
	],
	focus_wand: [
		{ damage: "1d6", damageType: "force", props: ["arcane focus"], range: "Ranged (60/180)", note: "Acts as an arcane focus." },
		{ damage: "1d4", damageType: "force", props: ["arcane focus", "light"], range: "Ranged (30/90)", note: "Acts as an arcane focus. Once per short rest, cast a known cantrip without expending an action." },
		{ damage: "1d8", damageType: "force", props: ["arcane focus", "loading"], range: "Ranged (60/180)", note: "Acts as an arcane focus. Loading: one attack per turn; deals +1 force damage on a hit." },
	],
	focus_tome: [
		{ note: "Acts as a written arcane focus.", item_type: "tool", type: "scroll" },
		{ note: "Acts as a written arcane focus. While attuned, gain a +1 bonus to one spell-attack or spell-save DC of your choice.", item_type: "tool", type: "scroll" },
		{ note: "Acts as a written arcane focus. Records 3 cast spells; the wielder may recall and cast one without spending mana once per long rest.", item_type: "tool", type: "scroll" },
	],

	// --- Armor ---
	armor_light: [
		{ ac: 11, type: "Light", note: "Light, flexible armor weave. Standard kit for fast movers." },
		{ ac: 12, type: "Light", note: "Reinforced light armor. AC 12 + AGI." },
		{ ac: 11, type: "Light", note: "Stealth-treated armor. Advantage on Stealth checks while worn." },
		{ ac: 12, type: "Light", note: "Mana-stable weave. Resistance to a chosen damage type while attuned." },
	],
	armor_medium: [
		{ ac: 13, type: "Medium", note: "Layered scale-and-cloth composite." },
		{ ac: 14, type: "Medium", note: "Reinforced medium armor with Bureau-stamped joints." },
		{ ac: 13, type: "Medium", note: "Mana-treated scale armor. Resistance to one chosen damage type." },
	],
	armor_heavy: [
		{ ac: 15, type: "Heavy", stealthDisadv: true, strReq: 13, note: "Standard heavy plate. Stealth disadvantage." },
		{ ac: 16, type: "Heavy", stealthDisadv: true, strReq: 13, note: "Reinforced carapace. AC 16. Stealth disadvantage." },
		{ ac: 17, type: "Heavy", stealthDisadv: true, strReq: 15, note: "Heavy carapace plating. AC 17. Stealth disadvantage. Requires STR 15." },
		{ ac: 16, type: "Heavy", stealthDisadv: true, strReq: 13, note: "Mana-stable plate. Resistance to force damage." },
	],
	armor_shield: [
		{ acBonus: 2, note: "Standard shield. +2 AC." },
		{ acBonus: 2, note: "Tower shield. +2 AC. Provides three-quarter cover when set as an action." },
		{ acBonus: 2, note: "Buckler. +2 AC. Counts as a free hand for casting somatic components." },
	],
	armor_headgear: [
		{ note: "Reinforced headgear. Advantage on saves vs. concussive impacts." },
		{ note: "Combat helm with Bureau comms insert. +1 to Insight checks involving radio chatter." },
		{ note: "Mask-style headgear. Advantage on saves vs. inhaled poisons and gases." },
	],

	// --- Consumables ---
	consumable_potion: [
		{ subtype: "healing", note: "Restores HP on consumption.", action: "Drink" },
		{ subtype: "mana", note: "Restores mana on consumption.", action: "Drink" },
		{ subtype: "stamina", note: "Grants 1d4 temporary HP and advantage on the next Vitality save within 1 minute.", action: "Drink" },
		{ subtype: "fortifying", note: "Grants 5 + Vitality temporary HP for 10 minutes.", action: "Drink" },
		{ subtype: "berserker", note: "Advantage on attack rolls for 1 minute. After, gain one level of exhaustion.", action: "Drink" },
	],
	consumable_stim: [
		{ subtype: "healing", note: "Restores HP on injection.", action: "Inject" },
		{ subtype: "combat", note: "Grants advantage on the next attack roll within 1 minute. After, take 1 fatigue.", action: "Inject" },
		{ subtype: "endurance", note: "Grants resistance to non-magical bludgeoning, piercing, and slashing for 1 minute.", action: "Inject" },
		{ subtype: "focus", note: "Grants advantage on Investigation, Insight, and Sense saves for 10 minutes.", action: "Inject" },
	],
	consumable_grenade: [
		{ subtype: "force", damage: { c: "2d6", u: "3d6", r: "4d6", e: "5d6", l: "6d6" }, damageType: "force", radius: 10, note: "Detonates in a 10-ft. radius. DC 13 Agility save halves damage." },
		{ subtype: "fire", damage: { c: "2d6", u: "3d6", r: "4d6", e: "5d6", l: "6d6" }, damageType: "fire", radius: 10, note: "Incendiary. Targets that fail a DC 13 Agility save are also Burning (1d4/turn)." },
		{ subtype: "shock", damage: { c: "2d4", u: "3d4", r: "4d4", e: "5d4", l: "6d4" }, damageType: "lightning", radius: 5, note: "EMP variant. Disables electronics and stuns mechanical anomalies for 1 round on a fail." },
		{ subtype: "smoke", damage: null, damageType: null, radius: 20, note: "Heavy obscurement in 20-ft. radius for 1 minute. No damage." },
	],
	consumable_scroll: [
		{ subtype: "attack", note: "Single-use scroll. Casts an inscribed offensive spell at rank-appropriate potency. Consumes the scroll." },
		{ subtype: "utility", note: "Single-use scroll. Casts an inscribed utility spell. Consumes the scroll." },
		{ subtype: "buff", note: "Single-use scroll. Casts an inscribed buff spell. Consumes the scroll." },
	],
	consumable_purifier: [
		{ subtype: "antidote", note: "Cures the poisoned condition.", action: "Apply" },
		{ subtype: "panacea", note: "Cures one of: charmed, frightened, poisoned, weakened.", action: "Apply" },
		{ subtype: "mana cleanser", note: "Cures one mana-class condition (mana-burn, lattice-bleed, channel-lock).", action: "Apply" },
	],
	consumable_signal: [
		{ note: "Burns for 1 minute. Bright light in 60 ft.; visible to Bureau receivers within the operating area." },
		{ note: "Drops a Bureau-coded signal beacon. Burns for 1 hour and broadcasts a locator pulse over 3 km." },
		{ note: "Smoke variant. Heavy obscurement in 20-ft. radius for 1 minute. Safe for civilian areas." },
	],
	consumable_ration: [{ note: "A day's nutrition for one Hunter on a cleared sweep." }],

	// --- Gear / wondrous ---
	gear_amulet: [
		{ note: "+1 to a chosen ability score check while attuned." },
		{ note: "While attuned, you have advantage on saves against being Charmed." },
		{ note: "While attuned, you may use a reaction once per long rest to gain resistance to one damage type until your next turn." },
	],
	gear_ring: [
		{ note: "+1 to a chosen saving throw while attuned." },
		{ note: "While attuned, you may once per long rest reroll a failed attack roll." },
		{ note: "While attuned, you have advantage on Stealth checks made in dim light." },
	],
	gear_bracer: [
		{ note: "+1 to attack rolls with light or finesse weapons while worn." },
		{ note: "While worn, your unarmed strikes deal 1d4 bludgeoning damage." },
		{ note: "Once per long rest, you may impose disadvantage on an attack made against you within 5 ft." },
	],
	gear_belt: [
		{ note: "+1 to Strength checks while worn." },
		{ note: "Increases your carrying capacity by 50 lbs. while worn." },
		{ note: "Once per long rest, regain 1d6 HP as a bonus action." },
	],
	gear_boots: [
		{ note: "+5 ft. to walking speed while worn." },
		{ note: "+10 ft. to walking speed and ignore difficult terrain caused by lattice-bleed while worn." },
		{ note: "Once per long rest, you may misty-step up to 30 ft. as a bonus action." },
	],
	gear_credential: [
		{ note: "Bureau-recognized ID. Grants access to controlled facilities and Hunter-only districts." },
		{ note: "Bureau-recognized ID + lattice-coded encryption. Grants access to restricted Bureau labs." },
		{ note: "Bureau-recognized ID. +1 to social checks made with Bureau personnel." },
	],
	gear_restraint: [
		{ note: "A bound creature has disadvantage on spellcasting checks. DC 20 Strength or DC 25 Sleight of Hand to escape." },
		{ note: "Bound creatures with mana lattice augmentation are treated as having no augmentation. DC 22 Strength to break." },
	],
	gear_utility: [
		{ note: "Standard utility kit. Used in extraction, repelling, and lattice-bleed cleanup. +2 to relevant tool checks." },
		{ note: "Tactical climbing rig. +2 to Athletics checks involving climbing or rappelling." },
		{ note: "Field repair kit. +2 to tool checks involving on-the-fly repairs." },
	],
	gear_kit: [
		{ note: "Bureau standard toolkit. +2 to relevant tool checks." },
		{ note: "Medical kit. +2 to Medicine checks; can be used to stabilize a creature without expending a Hit Die." },
		{ note: "Forensic kit. +2 to Investigation checks involving evidence analysis." },
	],
	gear_light: [
		{ note: "Bright light in a 30-ft. radius and dim light for an additional 30 ft." },
		{ note: "Bright light in a 60-ft. radius. Battery lasts 8 hours. Mana-stable in lattice-bleed conditions." },
		{ note: "Adjustable. Bright light in a 15-ft. cone or dim light in a 30-ft. radius. Activated as a bonus action." },
	],
	gear_navigation: [
		{ note: "+1 to Investigation checks involving terrain, gates, and lattice-bleed mapping." },
		{ note: "+2 to Survival checks made for navigation in known operating zones." },
		{ note: "Bureau-coded schematic. Grants advantage on the first Investigation check made in a marked location." },
	],
	gear_electronics: [
		{ note: "+1 to Investigation checks involving data analysis and surveillance." },
		{ note: "+2 to Insight checks when reviewing recorded audio or video." },
		{ note: "Mana-trace scanner. Can detect spellcasting within 30 ft. as an action." },
	],
	gear_attire: [
		{ note: "+1 to social checks in formal or guild-administrative settings." },
		{ note: "+1 to Persuasion checks made in Bureau or guild-administrative settings; +1 to Deception in those same settings." },
		{ note: "Tailored uniform. Conveys formal Bureau status; +2 to Intimidation checks against civilians." },
	],
	gear_misc: [
		{ note: "A piece of Bureau-quartermastered field gear." },
		{ note: "A miscellaneous piece of standard Hunter kit." },
		{ note: "A field accessory. Cataloged in the Bureau quartermaster registry." },
	],
};

export function getVariant(archetype, key) {
	const pool = VARIANT_POOLS[archetype];
	if (!pool) return null;
	return pickVariant(pool, key);
}

// =============================================================
// 3. Rarity unique enhancements
// =============================================================
//
// Each rarity tier defines a pool of unique passive enhancements; rare+ tiers
// also contribute an active ability template. Choices are deterministic per item.

const UNIQUE_PASSIVES = {
	uncommon: [
		"Once per short rest, reroll a missed attack roll.",
		"On a critical hit, regain 1 HP per Hit Die spent today.",
		"Add +1d4 damage when target is below half HP.",
		"Crit on 19-20 against gate-spawned creatures.",
		"+1 to attack rolls when at full HP.",
		"On a hit, the next ally's attack against the same target has advantage until the start of your next turn.",
		"+1 to initiative rolls while attuned.",
		"Once per long rest, when you take damage, you may halve it as a reaction.",
		"+1 to one save of your choice while attuned.",
		"On a kill with this item, gain 1d4 temporary HP.",
		"Once per short rest, treat a single failed Vitality save as a success.",
		"+5 ft. to your speed while wielding this item.",
		"Once per long rest, you may make one weapon attack as a bonus action.",
		"+1 to attack rolls against creatures within 5 ft. of an ally.",
		"On a hit against a Frightened creature, deal +1d4 damage.",
		"Once per short rest, end one condition affecting you (charmed, frightened, poisoned).",
		"+1 to Investigation and Insight checks while attuned.",
		"On a hit against a target you have not attacked this turn, deal +1d4 damage.",
	],
	rare: [
		"Once per short rest, treat a roll of 1-9 on an attack as a 10.",
		"On a critical hit, deal an additional 2d6 damage of this weapon's damage type.",
		"+1d4 damage against creatures of the Anomaly tag.",
		"Once per long rest, regain HP equal to half the damage dealt by a single hit.",
		"While attuned, gain +1 to one ability score (max 20).",
		"On a hit, target makes a DC 13 Vitality save or is disarmed of one held item.",
		"Once per short rest, cast Misty Step (no spell slot required) while wielding this item.",
		"Critical hits with this item ignore resistance to its damage type.",
		"Once per long rest, gain advantage on all attacks for 1 round as a bonus action.",
		"+2 to attack rolls against creatures with more HP than you.",
		"On a kill, your next attack within 1 minute deals an extra 2d6 damage.",
		"+1 AC against the first attack made against you each round.",
		"Once per short rest, when you make an attack, you may choose to land a critical hit instead of rolling damage normally.",
		"While attuned, you have advantage on saves against the Stunned condition.",
		"On a hit, target's speed is reduced by 5 ft. until the start of your next turn.",
		"Once per long rest, cast a 2nd-level spell (player choice) without expending a spell slot.",
		"+1d4 damage against creatures with the Construct or Anomaly tag.",
		"Crit on 19-20 against creatures with damage vulnerability to this weapon's damage type.",
	],
	epic: [
		"Once per long rest, cast Haste (self only) without spending a spell slot.",
		"Crit on 19-20. On a critical hit, target's next attack roll is at disadvantage.",
		"Once per short rest, automatically succeed on one Vitality save.",
		"Critical hits with this item bypass damage resistance.",
		"While attuned, gain advantage on saves against being Charmed and Frightened.",
		"Once per long rest, regain 2d6 HP as a bonus action.",
		"Once per short rest, gain temporary HP equal to your level.",
		"Once per long rest, treat a single rolled 1 as a 20.",
		"+2 to attack and damage rolls against creatures of the Anomaly tag.",
		"On a critical hit, you may make one additional weapon attack as part of the same action.",
		"Once per long rest, cast a 3rd-level spell (player choice) without expending a spell slot.",
		"+1 AC and +1 to all saves while attuned.",
		"On a kill with this item, regain 1d6 HP and gain 1d4 temporary HP.",
		"Once per short rest, change the damage type of an attack to one this item is theme-linked to.",
		"While attuned, your weapon attacks count as magical for resistance bypass.",
		"Once per long rest, when you would be reduced to 0 HP, you may instead drop to 5 HP.",
		"+5 ft. to your speed and immunity to difficult terrain caused by lattice-bleed.",
		"Once per short rest, you may impose disadvantage on one attack made against you within 5 ft.",
	],
	legendary: [
		"Crit on 18-20. Critical hits deal +3d6 damage of this weapon's damage type.",
		"Once per long rest, when reduced to 0 HP, you instead drop to 1 HP and gain immunity to damage until the end of your next turn.",
		"While attuned, gain +2 to two ability scores (max 22).",
		"Critical hits cannot be canceled by any means.",
		"Once per long rest, cast Time Stop (1 turn) without spending a spell slot.",
		"Once per long rest, regain all expended Hit Dice as a bonus action.",
		"While attuned, you have truesight to a range of 60 ft.",
		"Critical hits ignore all resistance and immunity to this weapon's damage type.",
		"While attuned, +2 AC and resistance to one chosen damage type.",
		"Once per long rest, cast a 5th-level spell (player choice) without expending a spell slot.",
		"While attuned, you have advantage on all saving throws.",
		"Once per long rest, gain immunity to a single damage type until the end of your next turn.",
		"Critical hits with this item also restore HP equal to the damage dealt.",
		"While attuned, your weapon attacks ignore one point of armor or AC bonus on the target.",
		"Once per long rest, you may take an additional turn immediately after your current turn.",
		"While attuned, you regenerate 2 HP at the start of each of your turns while you are below half HP.",
		"On a critical hit, target makes a DC 16 Vitality save or is reduced to 1 HP.",
		"Once per long rest, when you make an attack, you may declare it a critical hit before rolling.",
	],
};

const UNIQUE_ACTIVES = {
	rare: [
		{ name: "Surge Strike", description: "As a bonus action, your next attack with this weapon before the end of your turn deals an additional 2d6 damage.", action: "bonus-action", frequency: "short-rest" },
		{ name: "Lattice Pulse", description: "As an action, emit a 15-ft. cone pulse. Each creature in the cone makes a DC 13 Vitality save, taking 3d6 force damage on a fail (half on success).", action: "action", frequency: "short-rest", dc: 13 },
		{ name: "Phase Step", description: "As a bonus action, teleport up to 30 ft. to an unoccupied space you can see.", action: "bonus-action", frequency: "short-rest" },
		{ name: "Mana Surge", description: "As a bonus action, regain 1 spell slot of 2nd level or lower.", action: "bonus-action", frequency: "long-rest" },
		{ name: "Steady Aim", description: "As a bonus action, your next ranged attack before the end of your turn ignores cover and gains advantage.", action: "bonus-action", frequency: "short-rest" },
		{ name: "Disengaging Strike", description: "As an action, make a weapon attack and immediately move up to your speed without provoking opportunity attacks.", action: "action", frequency: "short-rest" },
		{ name: "Suppressive Volley", description: "As an action, force all creatures within a 15-ft. cone to make a DC 13 Agility save or take 2d6 damage of this weapon's type.", action: "action", frequency: "short-rest", dc: 13 },
		{ name: "Lattice Tag", description: "As an action, mark a creature within 60 ft. for 1 minute. Attacks against the marked creature deal +1d6 damage of this item's theme.", action: "action", frequency: "short-rest" },
	],
	epic: [
		{ name: "Aetheric Burst", description: "As an action, all creatures within 10 ft. make a DC 14 Agility save, taking 4d6 force damage on a fail (half on success).", action: "action", frequency: "short-rest", dc: 14 },
		{ name: "Reflective Aegis", description: "As a reaction to being hit by an attack, halve the damage taken; the attacker takes the halved amount as force damage.", action: "reaction", frequency: "short-rest" },
		{ name: "Shadow Step", description: "As a bonus action, teleport up to 60 ft. and gain advantage on the next attack roll you make before the end of this turn.", action: "bonus-action", frequency: "short-rest" },
		{ name: "Bind Anomaly", description: "As an action, target one Anomaly within 30 ft. It must make a DC 14 Sense save or be Restrained for 1 minute (saves at end of each of its turns).", action: "action", frequency: "long-rest", dc: 14 },
		{ name: "Echo Strike", description: "As a bonus action, when you hit with a weapon attack, repeat the attack against the same target with no additional roll. Apply only the damage die.", action: "bonus-action", frequency: "short-rest" },
		{ name: "Mana Cascade", description: "As an action, regain 2 spell slots of 3rd level or lower.", action: "action", frequency: "long-rest" },
	],
	legendary: [
		{ name: "Anomaly Disruption", description: "As an action, all creatures within 30 ft. make a DC 16 Vitality save, taking 6d6 force damage on a fail (half on success).", action: "action", frequency: "long-rest", dc: 16 },
		{ name: "Time Slip", description: "As a bonus action, take an extra action on this turn.", action: "bonus-action", frequency: "long-rest" },
		{ name: "Resurrection Echo", description: "As a reaction when you would drop to 0 HP, drop to 1 HP and become invulnerable until the end of your next turn.", action: "reaction", frequency: "long-rest" },
		{ name: "Reality Cut", description: "As an action, make one weapon attack against any creature within 60 ft.; the attack ignores cover and damage resistance.", action: "action", frequency: "long-rest" },
		{ name: "Apex Surge", description: "As a bonus action for 1 minute, your weapon attacks gain advantage and crit on 18-20.", action: "bonus-action", frequency: "long-rest" },
		{ name: "Domain Collapse", description: "As an action, all hostile creatures within 60 ft. make a DC 17 Vitality save or take 8d6 damage of this item's theme type and are Stunned until the end of their next turn.", action: "action", frequency: "long-rest", dc: 17 },
	],
};

export function pickUniquePassive(rarity, key) {
	const pool = UNIQUE_PASSIVES[rarity];
	if (!pool) return null;
	return pool[fnv1a(`${key}::passive`) % pool.length];
}

export function pickUniqueActive(rarity, key) {
	const pool = UNIQUE_ACTIVES[rarity];
	if (!pool) return null;
	return pool[fnv1a(`${key}::active`) % pool.length];
}

// =============================================================
// Rarity-specific consumable scaling
// =============================================================

export function consumableHpRange(rarity, subtype) {
	if (subtype === "stamina") return null; // already specified in note
	const ranges = {
		common: "2d4 + 2",
		uncommon: "4d4 + 4",
		rare: "6d4 + 6",
		epic: "8d4 + 8",
		legendary: "10d4 + 20",
	};
	return ranges[rarity] || ranges.common;
}

export function consumableManaRange(rarity) {
	const ranges = {
		common: "2d4",
		uncommon: "4d4",
		rare: "6d4",
		epic: "8d4",
		legendary: "10d4",
	};
	return ranges[rarity] || ranges.common;
}
