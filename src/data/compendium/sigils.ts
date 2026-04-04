interface SigilEntry {
	id: string;
	name: string;
	description: string;
	effect_description: string;
	rune_type: string;
	rune_category: string;
	rune_level: number;
	rarity: "common" | "uncommon" | "rare" | "very_rare" | "legendary";
	effect_type: "active" | "passive" | "both";
	requires_level?: number;
	passive_bonuses?: Record<string, unknown>;
	active_feature?: Record<string, unknown>;
	can_inscribe_on?: string[];
	inscription_difficulty?: number;
	tags?: string[];
	image?: string;
	source_book?: string;
}

export const sigils: SigilEntry[] = [
	{
		id: "sigil-fire-weapon-1",
		name: "Sigil of Fire Strikes",
		description:
			"A pulse of solar energy trapped in lead-tin alloy. When inscribed on a weapon, it bleeds white-hot mana into every strike.",
		effect_description:
			"Your weapon attacks deal an extra 1d6 fire damage. Once per short rest, you can unleash a 'Searing Burst' on hit, dealing an extra 1d6 fire damage and forcing the target to make a DC 13 Strength check or be knocked prone by the thermal shock.",
		rune_type: "offensive",
		rune_category: "Combat",
		rune_level: 2,
		rarity: "uncommon",
		effect_type: "both",
		requires_level: 2,
		can_inscribe_on: ["weapon"],
		inscription_difficulty: 12,
		passive_bonuses: {
			damage_bonus: "1d6 fire",
		},
		active_feature: {
			name: "Searing Burst",
			description:
				"When you hit with this weapon, add 1d6 fire damage and knock the target prone (DC 13 Str check).",
			action_type: "bonus-action",
			damage: "1d6 fire",
			resolution: "DC 13 Str check",
		},
		tags: ["fire", "sigil", "weapon"],
		image: "/generated/sigils/fire-sigil.webp",
	},
	{
		id: "sigil-fire-armor-2",
		name: "Sigil of Fire Bulwark",
		description:
			"Layers of interlocking flame-wards etched into a crystalline lattice. When inscribed on armor, it projects a shimmering heat-shroud.",
		effect_description:
			"Grants resistance to fire damage. Once per long rest, you can activate 'Inferno Aura' as a bonus action. For 1 minute, any creature that starts its turn within 5 feet of you takes 2d6 fire damage.",
		rune_type: "defensive",
		rune_category: "Defense",
		rune_level: 4,
		rarity: "rare",
		effect_type: "both",
		requires_level: 4,
		can_inscribe_on: ["armor"],
		inscription_difficulty: 14,
		passive_bonuses: {
			traits: ["Resistance to Fire damage"],
		},
		active_feature: {
			name: "Inferno Aura",
			description:
				"For 1 minute, enemies within 5ft take 2d6 fire damage at the start of their turn.",
			action_type: "bonus-action",
			duration: "1 minute",
			damage: "2d6 fire",
		},
		tags: ["fire", "sigil", "armor"],
		image: "/generated/sigils/fire-sigil.webp",
	},
	{
		id: "sigil-fire-shield-3",
		name: "Sigil of Fire Deflection",
		description:
			"A heavy basalt plate inscribed with the geometry of a dying star. When inscribed on a shield, it absorbs kinetic force and vents it as a solar flare.",
		effect_description:
			"When you block an attack, you can use your reaction to emit a burst of flame. Attackers within 5 feet must make a DC 30 Agility check or take 3d8 fire damage.",
		rune_type: "defensive",
		rune_category: "Defense",
		rune_level: 8,
		rarity: "legendary",
		effect_type: "passive",
		requires_level: 8,
		can_inscribe_on: ["shield"],
		inscription_difficulty: 23,
		active_feature: {
			name: "Nova Deflection",
			description:
				"As a reaction when you block an attack, emit a blinding solar flare. All creatures in a 15ft cone must make a DC 20 Agility check or take 4d8 fire damage and be blinded until the end of your next turn.",
			action_type: "reaction",
			range: "15 ft cone",
			target: "All in cone",
			resolution: "DC 20 Agility check",
			damage: "4d8 fire",
			condition: "Blinded",
		},
		tags: ["fire", "sigil", "shield"],
		image: "/generated/sigils/fire-sigil.webp",
	},
	{
		id: "sigil-fire-accessory-4",
		name: "Sigil of Fire Channeling",
		description:
			"A delicate amber loop etched with combustion-loops. When inscribed on an accessory, it acts as a thermal conduit for spellcasting.",
		effect_description:
			"Your fire spells deal an additional 10 damage, and ignore fire resistance.",
		rune_type: "caster",
		rune_category: "Control",
		rune_level: 2,
		rarity: "uncommon",
		effect_type: "passive",
		requires_level: 2,
		can_inscribe_on: ["accessory"],
		inscription_difficulty: 12,
		tags: ["fire", "sigil", "accessory"],
		image: "/generated/sigils/fire-sigil.webp",
	},
	{
		id: "sigil-fire-boots-5",
		name: "Sigil of Fire Stride",
		description:
			"Jagged obsidian shards etched with the runes of a volcanic flow. When inscribed on boots, they ignite the air behind the wearer.",
		effect_description:
			"You leave a trail of fire behind you. Once per turn, you can dash as a bonus action, causing spaces you leave to deal 1d8 fire damage to enemies entering them.",
		rune_type: "martial",
		rune_category: "Mobility",
		rune_level: 4,
		rarity: "rare",
		effect_type: "passive",
		requires_level: 4,
		can_inscribe_on: ["boots"],
		inscription_difficulty: 14,
		tags: ["fire", "sigil", "boots"],
		image: "/generated/sigils/fire-sigil.webp",
	},
	{
		id: "sigil-ice-weapon-6",
		name: "Sigil of Ice Strikes",
		description:
			"A series of jagged, aggressive runes etched into void-glass. When bound to a weapon, it leeches spectral resonance from the wielder's surroundings, manifesting as crackling arcs.",
		effect_description:
			"Your weapon attacks deal an extra 1d6 cold damage. Once per short rest, you can use 'Frost Binding' to force a target hit by your weapon to make a DC 13 Strength check or have its speed reduced to 0 until the end of its next turn.",
		rune_type: "offensive",
		rune_category: "Combat",
		rune_level: 2,
		rarity: "uncommon",
		effect_type: "both",
		requires_level: 2,
		can_inscribe_on: ["weapon"],
		inscription_difficulty: 12,
		passive_bonuses: {
			damage_bonus: "1d6 cold",
		},
		active_feature: {
			name: "Frost Binding",
			description:
				"A protective mandate from the System, etched into void-glass. It generates a shimmering flickering shadows shroud that dampens incoming kinetic force.",
			action_type: "bonus-action",
			resolution: "DC 13 Str check",
		},
		tags: ["ice", "sigil", "weapon"],
		image: "/generated/sigils/ice-sigil.webp",
	},
	{
		id: "sigil-ice-armor-7",
		name: "Sigil of Ice Bulwark",
		description:
			"A mastercrafted sigil. When inscribed on a armor, it channels pure ice energy to grant unique abilities.",
		effect_description:
			"Grants resistance to cold damage. You are immune to being frozen or restrained by ice.",
		rune_type: "defensive",
		rune_category: "Defense",
		rune_level: 2,
		rarity: "uncommon",
		effect_type: "passive",
		requires_level: 2,
		can_inscribe_on: ["armor"],
		inscription_difficulty: 12,
		tags: ["ice", "sigil", "armor"],
		image: "/generated/sigils/ice-sigil.webp",
	},
	{
		id: "sigil-ice-shield-8",
		name: "Sigil of Ice Deflection",
		description:
			"A protective mandate from the System, etched into void-glass. It generates a shimmering distorted space shroud that dampens incoming kinetic force.",
		effect_description:
			"When you block an attack, you can use your reaction to flash-freeze the attacker's weapon, imposing a -2 penalty to their next attack roll.",
		rune_type: "defensive",
		rune_category: "Defense",
		rune_level: 2,
		rarity: "uncommon",
		effect_type: "passive",
		requires_level: 2,
		can_inscribe_on: ["shield"],
		inscription_difficulty: 12,
		tags: ["ice", "sigil", "shield"],
		image: "/generated/sigils/ice-sigil.webp",
	},
	{
		id: "sigil-ice-accessory-9",
		name: "Sigil of Ice Channeling",
		description:
			"A multi-layered void-glass sigil that acts as a focal point for kinetic force manipulation. It grants the wielder shimmering frost capabilities.",
		effect_description:
			"Your cold spells can target one additional creature within 10 feet of the original target.",
		rune_type: "caster",
		rune_category: "Control",
		rune_level: 2,
		rarity: "uncommon",
		effect_type: "passive",
		requires_level: 2,
		can_inscribe_on: ["accessory"],
		inscription_difficulty: 12,
		tags: ["ice", "sigil", "accessory"],
		image: "/generated/sigils/ice-sigil.webp",
	},
	{
		id: "sigil-ice-boots-10",
		name: "Sigil of Ice Stride",
		description:
			"A multi-layered frozen moonlight sigil that acts as a focal point for kinetic force manipulation. It grants the wielder flickering shadows capabilities.",
		effect_description:
			"You can move across icy and slippery surfaces without penalty. As a bonus action, move up to your speed; every space you leave becomes slippery ice (Difficult Terrain). Enemies entering or starting their turn in this ice must make a DC 20 Agility check or take 4d8 cold damage and fall prone.",
		rune_type: "martial",
		rune_category: "Mobility",
		rune_level: 8,
		rarity: "legendary",
		effect_type: "both",
		requires_level: 8,
		can_inscribe_on: ["boots"],
		inscription_difficulty: 23,
		passive_bonuses: {
			traits: ["Immunity to difficult terrain (Ice/Snow)"],
		},
		active_feature: {
			name: "Glacier Path",
			description:
				"The System's offensive directive is transcribed here in soul-bonded alloy. It hums with a spectral resonance frequency, causing the weapon's edge to shimmer with luminous ripples.",
			action_type: "bonus-action",
			damage: "4d8 cold",
			resolution: "DC 20 Agility check",
		},
		tags: ["ice", "sigil", "boots"],
		image: "/generated/sigils/ice-sigil.webp",
	},
	{
		id: "sigil-lightning-weapon-11",
		name: "Sigil of Lightning Strikes",
		description:
			"A mastercrafted sigil. When inscribed on a weapon, it channels pure lightning energy to grant unique abilities.",
		effect_description:
			"Your weapon attacks deal an extra 1d6 lightning damage. Once per short rest, you can use 'Chain Induction' to make your next hit arc lightning to up to 3 secondary targets within 15 feet, dealing 1d6 lightning damage (DC 13 Dex for half).",
		rune_type: "offensive",
		rune_category: "Combat",
		rune_level: 2,
		rarity: "uncommon",
		effect_type: "both",
		requires_level: 2,
		can_inscribe_on: ["weapon"],
		inscription_difficulty: 12,
		passive_bonuses: {
			damage_bonus: "1d6 lightning",
		},
		active_feature: {
			name: "Chain Induction",
			description:
				"Interlocking geometric patterns of crystallized mana form a localized kinetic force field. It acts as a primary buffer against shimmering frost incursions.",
			action_type: "bonus-action",
			damage: "1d6 lightning",
			resolution: "DC 13 Agility check",
		},
		tags: ["lightning", "sigil", "weapon"],
		image: "/generated/sigils/lightning-sigil.webp",
	},
	{
		id: "sigil-lightning-armor-12",
		name: "Sigil of Lightning Bulwark",
		description:
			"A mastercrafted sigil. When inscribed on a armor, it channels pure lightning energy to grant unique abilities.",
		effect_description:
			"Grants resistance to lightning damage. Once per long rest, you can activate 'Static Overload' for 1 minute. While active, any creature that hits you with a melee attack takes 2d6 lightning damage and cannot take reactions until the start of its next turn.",
		rune_type: "defensive",
		rune_category: "Defense",
		rune_level: 4,
		rarity: "rare",
		effect_type: "both",
		requires_level: 4,
		can_inscribe_on: ["armor"],
		inscription_difficulty: 14,
		passive_bonuses: {
			traits: ["Resistance to Lightning damage"],
		},
		active_feature: {
			name: "Static Overload",
			description:
				"A protective mandate from the System, etched into void-glass. It generates a shimmering shimmering frost shroud that dampens incoming kinetic force.",
			action_type: "bonus-action",
			duration: "1 minute",
			damage: "2d6 lightning",
		},
		tags: ["lightning", "sigil", "armor"],
		image: "/generated/sigils/lightning-sigil.webp",
	},
	{
		id: "sigil-lightning-shield-13",
		name: "Sigil of Lightning Deflection",
		description:
			"A mastercrafted sigil. When inscribed on a shield, it channels pure lightning energy to grant unique abilities.",
		effect_description:
			"When you block an attack, you can use your reaction to trigger 'Thunderous Reprisal', pushing the attacker 15 feet away and dealing 2d6 thunder damage (DC 15 Strength check to avoid push).",
		rune_type: "defensive",
		rune_category: "Defense",
		rune_level: 4,
		rarity: "rare",
		effect_type: "both",
		requires_level: 4,
		can_inscribe_on: ["shield"],
		inscription_difficulty: 14,
		passive_bonuses: {
			ac_bonus: 2,
		},
		active_feature: {
			name: "Thunderous Reprisal",
			description:
				"An intricate web of frozen moonlight designed for aetheric flow stabilization. It provides the wielder with flickering shadows during complex System interactions.",
			action_type: "reaction",
			damage: "2d6 thunder",
			resolution: "DC 15 Str check",
		},
		tags: ["lightning", "sigil", "shield"],
		image: "/generated/sigils/lightning-sigil.webp",
	},
	{
		id: "sigil-lightning-accessory-14",
		name: "Sigil of Lightning Channeling",
		description:
			"A mastercrafted sigil. When inscribed on a accessory, it channels pure lightning energy to grant unique abilities.",
		effect_description:
			"Your lightning spells gain a +1 bonus to their spell save DC.",
		rune_type: "caster",
		rune_category: "Control",
		rune_level: 2,
		rarity: "uncommon",
		effect_type: "passive",
		requires_level: 2,
		can_inscribe_on: ["accessory"],
		inscription_difficulty: 12,
		tags: ["lightning", "sigil", "accessory"],
		image: "/generated/sigils/lightning-sigil.webp",
	},
	{
		id: "sigil-lightning-boots-15",
		name: "Sigil of Lightning Stride",
		description:
			"An intricate web of liquid aether designed for elemental potential stabilization. It provides the wielder with shimmering frost during complex System interactions.",
		effect_description:
			"Your movement speed increases by 40 ft. Moving out of an enemy's reach does not provoke opportunity attacks.",
		rune_type: "martial",
		rune_category: "Mobility",
		rune_level: 8,
		rarity: "legendary",
		effect_type: "passive",
		requires_level: 8,
		can_inscribe_on: ["boots"],
		inscription_difficulty: 23,
		passive_bonuses: {
			speed_bonus: 40,
			traits: ["No opportunity attacks when moving"],
		},
		tags: ["lightning", "sigil", "boots"],
		image: "/generated/sigils/lightning-sigil.webp",
	},
	{
		id: "sigil-shadow-weapon-16",
		name: "Sigil of Shadow Strikes",
		description:
			"A series of jagged, aggressive runes etched into frozen moonlight. When bound to a weapon, it leeches umbral essence from the wielder's surroundings, manifesting as shimmering frost.",
		effect_description:
			"Your weapon attacks deal an extra 1d8 necrotic damage. You gain advantage on attacks against targets in dim light or darkness.",
		rune_type: "offensive",
		rune_category: "Combat",
		rune_level: 4,
		rarity: "rare",
		effect_type: "passive",
		requires_level: 4,
		passive_bonuses: {
			damage_bonus: "1d8 necrotic",
			traits: ["Advantage on attacks in dim light/darkness"],
		},
		tags: ["shadow", "sigil", "weapon"],
		image: "/generated/sigils/shadow-sigil.webp",
	},
	{
		id: "sigil-shadow-armor-17",
		name: "Sigil of Shadow Bulwark",
		description:
			"Derived from the shell of a gate-born behemoth, this sigil's tempered gate-steel surface absorbs elemental potential and vents it as shimmering frost.",
		effect_description:
			"Grants resistance to necrotic damage. While in dim light, attacks against you have disadvantage.",
		rune_type: "defensive",
		rune_category: "Defense",
		rune_level: 8,
		rarity: "legendary",
		effect_type: "passive",
		requires_level: 8,
		passive_bonuses: {
			traits: [
				"Resistance to Necrotic damage",
				"Disadvantage on attacks against you in dim light",
			],
		},
		tags: ["shadow", "sigil", "armor"],
		image: "/generated/sigils/shadow-sigil.webp",
	},
	{
		id: "sigil-shadow-shield-18",
		name: "Sigil of Shadow Deflection",
		description:
			"A protective mandate from the System, etched into liquid aether. It generates a shimmering white-hot sparks shroud that dampens incoming kinetic force.",
		effect_description:
			"When you block an attack, you can use your reaction to fade into shadows, becoming invisible until the start of your next turn.",
		rune_type: "defensive",
		rune_category: "Defense",
		rune_level: 8,
		rarity: "legendary",
		effect_type: "passive",
		requires_level: 8,
		active_feature: {
			name: "Shadow Fade",
			description:
				"As reaction to block, become invisible until start of your next turn.",
			action_type: "reaction",
			duration: "1 round",
			condition: "Invisible",
		},
		tags: ["shadow", "sigil", "shield"],
		image: "/generated/sigils/shadow-sigil.webp",
	},
	{
		id: "sigil-shadow-accessory-19",
		name: "Sigil of Shadow Channeling",
		description:
			"An intricate web of obsidian shards designed for aetheric flow stabilization. It provides the wielder with crackling arcs during complex System interactions.",
		effect_description:
			"Your illusion and necrotic spells have their range doubled.",
		rune_type: "caster",
		rune_category: "Control",
		rune_level: 6,
		rarity: "very_rare",
		effect_type: "passive",
		requires_level: 6,
		passive_bonuses: {
			traits: ["Double range for Illusion/Necrotic spells"],
		},
		tags: ["shadow", "sigil", "accessory"],
		image: "/generated/sigils/shadow-sigil.webp",
	},
	{
		id: "sigil-shadow-boots-20",
		name: "Sigil of Shadow Stride",
		description:
			"A multi-layered tempered gate-steel sigil that acts as a focal point for spectral resonance manipulation. It grants the wielder luminous ripples capabilities.",
		effect_description:
			"You can use a bonus action to teleport up to 80 feet to an unoccupied space you can see that is also in dim light or darkness.",
		rune_type: "martial",
		rune_category: "Mobility",
		rune_level: 8,
		rarity: "legendary",
		effect_type: "both",
		requires_level: 8,
		can_inscribe_on: ["boots"],
		inscription_difficulty: 23,
		active_feature: {
			name: "Shadow Stride Teleport",
			description: "Teleport 80ft to a space in dim light or darkness.",
			action_type: "bonus action",
		},
		passive_bonuses: {
			traits: ["Teleportation specialist"],
		},
		tags: ["shadow", "sigil", "boots"],
		image: "/generated/sigils/shadow-sigil.webp",
	},
	{
		id: "sigil-light-weapon-21",
		name: "Sigil of Light Strikes",
		description:
			"The System's offensive directive is transcribed here in liquid aether. It hums with a umbral essence frequency, causing the weapon's edge to shimmer with shimmering frost.",
		effect_description:
			"Your weapon attacks deal an extra 3d8 radiant damage. The target sheds bright light for 10 feet and cannot benefit from invisibility.",
		rune_type: "offensive",
		rune_category: "Combat",
		rune_level: 8,
		rarity: "legendary",
		effect_type: "passive",
		requires_level: 8,
		passive_bonuses: {
			damage_bonus: "3d8 radiant",
			traits: ["Target sheds 10ft light, cannot be invisible"],
		},
		tags: ["light", "sigil", "weapon"],
		image: "/generated/sigils/light-sigil.webp",
	},
	{
		id: "sigil-light-armor-22",
		name: "Sigil of Light Bulwark",
		description:
			"Derived from the shell of a gate-born behemoth, this sigil's liquid aether surface absorbs elemental potential and vents it as luminous ripples.",
		effect_description:
			"Grants resistance to radiant damage. You emit bright light in a 15-foot radius; allies within this light gain +1 to saving throws.",
		rune_type: "defensive",
		rune_category: "Defense",
		rune_level: 2,
		rarity: "uncommon",
		effect_type: "passive",
		requires_level: 2,
		passive_bonuses: {
			traits: [
				"Resistance to Radiant damage",
				"15ft Aura: allies gain +1 saving throws",
			],
		},
		tags: ["light", "sigil", "armor"],
		image: "/generated/sigils/light-sigil.webp",
	},
	{
		id: "sigil-light-shield-23",
		name: "Sigil of Light Deflection",
		description:
			"Derived from the shell of a gate-born behemoth, this sigil's crystallized mana surface absorbs spectral resonance and vents it as luminous ripples.",
		effect_description:
			"When you block an attack, you can use your reaction to trigger 'Solar Flare', forcing the attacker to make a DC 17 Vitality check or take 3d6 radiant damage and be blinded until the end of their turn.",
		rune_type: "defensive",
		rune_category: "Defense",
		rune_level: 6,
		rarity: "very_rare",
		effect_type: "both",
		requires_level: 6,
		can_inscribe_on: ["shield"],
		inscription_difficulty: 16,
		passive_bonuses: {
			ac_bonus: 3,
		},
		active_feature: {
			name: "Solar Flare",
			description:
				"The System's discernment mandate, etched into soul-bonded alloy. It allows the wielder to perceive the umbral essence of the world through distorted space overlays.",
			action_type: "reaction",
			damage: "3d6 radiant",
			resolution: "DC 17 Vitality check",
			condition: "Blinded",
		},
		tags: ["light", "sigil", "shield"],
		image: "/generated/sigils/light-sigil.webp",
	},
	{
		id: "sigil-light-accessory-24",
		name: "Sigil of Light Channeling",
		description:
			"A mastercrafted sigil. When inscribed on a accessory, it channels pure light energy to grant unique abilities.",
		effect_description:
			"Healing spells you cast restore an additional 3d8 hit points.",
		rune_type: "caster",
		rune_category: "Control",
		rune_level: 8,
		rarity: "legendary",
		effect_type: "passive",
		requires_level: 8,
		passive_bonuses: {
			traits: ["Healing spells restore extra 3d8 HP"],
		},
		tags: ["light", "sigil", "accessory"],
		image: "/generated/sigils/light-sigil.webp",
	},
	{
		id: "sigil-light-boots-25",
		name: "Sigil of Light Stride",
		description:
			"A multi-layered obsidian shards sigil that acts as a focal point for kinetic force manipulation. It grants the wielder luminous ripples capabilities.",
		effect_description:
			"As a bonus action, you can activate 'Solar Dash' to move up to your speed. You leave a trail of floating starlight that illuminates a 10ft radius for 1 minute.",
		rune_type: "martial",
		rune_category: "Mobility",
		rune_level: 2,
		rarity: "uncommon",
		effect_type: "both",
		requires_level: 2,
		can_inscribe_on: ["boots"],
		inscription_difficulty: 12,
		passive_bonuses: {
			speed_bonus: 5,
		},
		active_feature: {
			name: "Solar Dash",
			description:
				"Forged from the residue of a Rank-S gate, this sigil pulses with spectral resonance. It rewrites the weapon's soul-signature to favor shimmering frost strikes.",
			action_type: "bonus-action",
		},
		tags: ["light", "sigil", "boots"],
		image: "/generated/sigils/light-sigil.webp",
	},
	{
		id: "sigil-earth-weapon-26",
		name: "Sigil of Earth Strikes",
		description:
			"A mastercrafted sigil. When inscribed on a weapon, it channels pure earth energy to grant unique abilities.",
		effect_description:
			"Your weapon attacks deal an extra 3d6 bludgeoning damage. Once per short rest, you can unleash a 'Quake Strike', forcing the target to make a DC 17 Strength check or be knocked prone and restrained until the end of its next turn.",
		rune_type: "offensive",
		rune_category: "Combat",
		rune_level: 6,
		rarity: "very_rare",
		effect_type: "both",
		requires_level: 6,
		can_inscribe_on: ["weapon"],
		inscription_difficulty: 16,
		passive_bonuses: {
			damage_bonus: "3d6 bludgeoning",
			attack_bonus: 3,
		},
		active_feature: {
			name: "Quake Strike",
			description:
				"A protective mandate from the System, etched into liquid aether. It generates a shimmering crackling arcs shroud that dampens incoming kinetic force.",
			action_type: "bonus-action",
			damage: "3d6 bludgeoning",
			resolution: "DC 17 Strength check",
			condition: "Restrained",
		},
		tags: ["earth", "sigil", "weapon"],
		image: "/generated/sigils/earth-sigil.webp",
	},
	{
		id: "sigil-earth-armor-27",
		name: "Sigil of Earth Bulwark",
		description:
			"A mastercrafted sigil. When inscribed on a armor, it channels pure earth energy to grant unique abilities.",
		effect_description:
			"Grants resistance to slashing damage. You cannot be moved against your will while standing on solid ground.",
		rune_type: "defensive",
		rune_category: "Defense",
		rune_level: 2,
		rarity: "uncommon",
		effect_type: "passive",
		requires_level: 2,
		passive_bonuses: {
			traits: [
				"Resistance to Slashing damage",
				"Immunity to forced movement on solid ground",
			],
		},
		tags: ["earth", "sigil", "armor"],
		image: "/generated/sigils/earth-sigil.webp",
	},
	{
		id: "sigil-earth-shield-28",
		name: "Sigil of Earth Deflection",
		description:
			"A protective mandate from the System, etched into tempered gate-steel. It generates a shimmering white-hot sparks shroud that dampens incoming kinetic force.",
		effect_description:
			"When you block an attack, you gain temporary hit points equal to the damage blocked, up to 40.",
		rune_type: "defensive",
		rune_category: "Defense",
		rune_level: 4,
		rarity: "rare",
		effect_type: "passive",
		requires_level: 4,
		active_feature: {
			name: "Earthen Absorption",
			description:
				"When you block an attack, gain temp HP equal to damage blocked (max 40).",
			action_type: "reaction",
		},
		tags: ["earth", "sigil", "shield"],
		image: "/generated/sigils/earth-sigil.webp",
	},
	{
		id: "sigil-earth-accessory-29",
		name: "Sigil of Earth Channeling",
		description:
			"The System's discernment mandate, etched into crystallized mana. It allows the wielder to perceive the spectral resonance of the world through flickering shadows overlays.",
		effect_description:
			"Earth and transmutation spells you cast count as one level higher.",
		rune_type: "caster",
		rune_category: "Control",
		rune_level: 2,
		rarity: "uncommon",
		effect_type: "passive",
		requires_level: 2,
		passive_bonuses: {
			traits: ["Earth/Transmutation spells cast at +1 level"],
		},
		tags: ["earth", "sigil", "accessory"],
		image: "/generated/sigils/earth-sigil.webp",
	},
	{
		id: "sigil-earth-boots-30",
		name: "Sigil of Earth Stride",
		description:
			"The System's discernment mandate, etched into soul-bonded alloy. It allows the wielder to perceive the elemental potential of the world through crackling arcs overlays.",
		effect_description:
			"You gain tremorsense out to 40 feet and ignore difficult terrain made of earth or stone.",
		rune_type: "martial",
		rune_category: "Mobility",
		rune_level: 4,
		rarity: "rare",
		effect_type: "passive",
		requires_level: 4,
		passive_bonuses: {
			traits: ["Tremorsense 40ft", "Ignore difficult terrain (earth/stone)"],
		},
		tags: ["earth", "sigil", "boots"],
		image: "/generated/sigils/earth-sigil.webp",
	},
	{
		id: "sigil-wind-weapon-31",
		name: "Sigil of Wind Strikes",
		description:
			"Forged from the residue of a Rank-A gate, this sigil pulses with thermal energy. It rewrites the weapon's soul-signature to favor white-hot sparks strikes.",
		effect_description:
			"Your weapon attacks gain reach (an extra 5 feet) and deal an extra 1d8 slashing damage from razor winds.",
		rune_type: "offensive",
		rune_category: "Combat",
		rune_level: 4,
		rarity: "rare",
		effect_type: "passive",
		requires_level: 4,
		passive_bonuses: {
			damage_bonus: "1d8 slashing",
			traits: ["Weapon attacks gain +5ft reach"],
		},
		tags: ["wind", "sigil", "weapon"],
		image: "/generated/sigils/wind-sigil.webp",
	},
	{
		id: "sigil-wind-armor-32",
		name: "Sigil of Wind Bulwark",
		description:
			"Interlocking geometric patterns of crystallized mana form a localized thermal energy field. It acts as a primary buffer against white-hot sparks incursions.",
		effect_description:
			"Grants advantage on Agility saving throws against area of effect spells. Missiles have a 50% chance to be deflected away from you.",
		rune_type: "defensive",
		rune_category: "Defense",
		rune_level: 2,
		rarity: "uncommon",
		effect_type: "passive",
		requires_level: 2,
		passive_bonuses: {
			traits: [
				"Advantage on Agility checks vs AoE",
				"50% chance to deflect missiles",
			],
		},
		tags: ["wind", "sigil", "armor"],
		image: "/generated/sigils/wind-sigil.webp",
	},
	{
		id: "sigil-wind-shield-33",
		name: "Sigil of Wind Deflection",
		description:
			"Derived from the shell of a gate-born behemoth, this sigil's tempered gate-steel surface absorbs umbral essence and vents it as white-hot sparks.",
		effect_description:
			"When you block a ranged attack, you can use your reaction to redirect the projectile at another target within 30 feet.",
		rune_type: "defensive",
		rune_category: "Defense",
		rune_level: 4,
		rarity: "rare",
		effect_type: "passive",
		requires_level: 4,
		active_feature: {
			name: "Zephyr Redirect",
			description:
				"As reaction to block ranged attack, redirect projectile at target within 30ft.",
			action_type: "reaction",
		},
		tags: ["wind", "sigil", "shield"],
		image: "/generated/sigils/wind-sigil.webp",
	},
	{
		id: "sigil-wind-accessory-34",
		name: "Sigil of Wind Channeling",
		description:
			"An intricate web of tempered gate-steel designed for aetheric flow stabilization. It provides the wielder with crackling arcs during complex System interactions.",
		effect_description:
			"Your spells that deal thunder or slashing damage push targets 10 feet away on a failed saving throw.",
		rune_type: "caster",
		rune_category: "Control",
		rune_level: 6,
		rarity: "very_rare",
		effect_type: "passive",
		requires_level: 6,
		passive_bonuses: {
			traits: ["Thunder/Slashing spells push targets 10ft on failed save"],
		},
		tags: ["wind", "sigil", "accessory"],
		image: "/generated/sigils/wind-sigil.webp",
	},
	{
		id: "sigil-wind-boots-35",
		name: "Sigil of Wind Stride",
		description:
			"A multi-layered tempered gate-steel sigil that acts as a focal point for thermal energy manipulation. It grants the wielder shimmering frost capabilities.",
		effect_description:
			"You can cast Levitate on yourself at will, and you have advantage on Acrobatics checks.",
		rune_type: "martial",
		rune_category: "Mobility",
		rune_level: 2,
		rarity: "uncommon",
		effect_type: "passive",
		requires_level: 2,
		active_feature: {
			name: "Levitation Stride",
			description: "Cast Levitate on yourself at will.",
			action_type: "bonus-action",
		},
		passive_bonuses: {
			traits: ["Advantage on Acrobatics checks"],
		},
		tags: ["wind", "sigil", "boots"],
		image: "/generated/sigils/wind-sigil.webp",
	},
	{
		id: "sigil-blood-weapon-36",
		name: "Sigil of Blood Strikes",
		description:
			"A series of jagged, aggressive runes etched into obsidian shards. When bound to a weapon, it leeches spectral resonance from the wielder's surroundings, manifesting as crackling arcs.",
		effect_description:
			"Your weapon attacks deal an extra 3d8 necrotic damage. You heal for half of the necrotic damage dealt.",
		rune_type: "offensive",
		rune_category: "Combat",
		rune_level: 8,
		rarity: "legendary",
		effect_type: "passive",
		requires_level: 8,
		passive_bonuses: {
			damage_bonus: "3d8 necrotic",
			traits: ["Heal for half necrotic damage dealt"],
		},
		tags: ["blood", "sigil", "weapon"],
		image: "/generated/sigils/blood-sigil.webp",
	},
	{
		id: "sigil-blood-armor-37",
		name: "Sigil of Blood Bulwark",
		description:
			"Interlocking geometric patterns of soul-bonded alloy form a localized aetheric flow field. It acts as a primary buffer against shimmering frost incursions.",
		effect_description:
			"When you fall below half your maximum hit points, you gain temporary HP equal to 90.",
		rune_type: "defensive",
		rune_category: "Defense",
		rune_level: 6,
		rarity: "very_rare",
		effect_type: "both",
		requires_level: 6,
		can_inscribe_on: ["armor"],
		inscription_difficulty: 16,
		active_feature: {
			name: "Sanguine Surge",
			description: "If below 50% HP, gain 90 temp HP.",
			action_type: "reaction",
		},
		passive_bonuses: {
			traits: ["Resistance to Slashing damage (implicit in effect)"],
		},
		tags: ["blood", "sigil", "armor"],
		image: "/generated/sigils/blood-sigil.webp",
	},
	{
		id: "sigil-blood-shield-38",
		name: "Sigil of Blood Deflection",
		description:
			"A protective mandate from the System, etched into obsidian shards. It generates a shimmering crackling arcs shroud that dampens incoming kinetic force.",
		effect_description:
			"When you block an attack, you can expend a Hit Die to immediately heal yourself.",
		rune_type: "defensive",
		rune_category: "Defense",
		rune_level: 2,
		rarity: "uncommon",
		effect_type: "passive",
		requires_level: 2,
		can_inscribe_on: ["shield"],
		inscription_difficulty: 12,
		tags: ["blood", "sigil", "shield"],
		image: "/generated/sigils/blood-sigil.webp",
	},
	{
		id: "sigil-blood-accessory-39",
		name: "Sigil of Blood Channeling",
		description:
			"The System's discernment mandate, etched into obsidian shards. It allows the wielder to perceive the aetheric flow of the world through luminous ripples overlays.",
		effect_description:
			"When you cast a spell that deals damage, you can expend 5 HP to max out one of the damage dice.",
		rune_type: "caster",
		rune_category: "Control",
		rune_level: 8,
		rarity: "legendary",
		effect_type: "passive",
		requires_level: 8,
		can_inscribe_on: ["accessory"],
		inscription_difficulty: 23,
		tags: ["blood", "sigil", "accessory"],
		image: "/generated/sigils/blood-sigil.webp",
	},
	{
		id: "sigil-blood-boots-40",
		name: "Sigil of Blood Stride",
		description:
			"A multi-layered crystallized mana sigil that acts as a focal point for spectral resonance manipulation. It grants the wielder shimmering frost capabilities.",
		effect_description:
			"You can flawlessly track bleeding targets up to 1 mile away, and you gain +10 movement speed when moving toward a wounded enemy.",
		rune_type: "martial",
		rune_category: "Mobility",
		rune_level: 2,
		rarity: "uncommon",
		effect_type: "passive",
		requires_level: 2,
		can_inscribe_on: ["boots"],
		inscription_difficulty: 12,
		tags: ["blood", "sigil", "boots"],
		image: "/generated/sigils/blood-sigil.webp",
	},
	{
		id: "sigil-void-weapon-41",
		name: "Sigil of Void Strikes",
		description:
			"The System's offensive directive is transcribed here in crystallized mana. It hums with a thermal energy frequency, causing the weapon's edge to shimmer with luminous ripples.",
		effect_description:
			"Your weapon attacks deal an extra 1d6 force damage. Targets hit lose their resistance to force damage for 1 minute.",
		rune_type: "offensive",
		rune_category: "Combat",
		rune_level: 2,
		rarity: "uncommon",
		effect_type: "passive",
		requires_level: 2,
		passive_bonuses: {
			damage_bonus: "1d6 force",
			traits: ["Force resistance bypass for 1 minute on hit"],
		},
		tags: ["void", "sigil", "weapon"],
		image: "/generated/sigils/void-sigil.webp",
	},
	{
		id: "sigil-void-armor-42",
		name: "Sigil of Void Bulwark",
		description:
			"A protective mandate from the System, etched into soul-bonded alloy. It generates a shimmering flickering shadows shroud that dampens incoming kinetic force.",
		effect_description:
			"Grants resistance to force damage. Spells targeting you have a 20% chance to be absorbed harmlessly into the void.",
		rune_type: "defensive",
		rune_category: "Defense",
		rune_level: 4,
		rarity: "rare",
		effect_type: "passive",
		requires_level: 4,
		passive_bonuses: {
			traits: [
				"Resistance to Force damage",
				"20% chance to absorb spells harmlessly",
			],
		},
		tags: ["void", "sigil", "armor"],
		image: "/generated/sigils/void-sigil.webp",
	},
	{
		id: "sigil-void-shield-43",
		name: "Sigil of Void Deflection",
		description:
			"A protective mandate from the System, etched into obsidian shards. It generates a shimmering distorted space shroud that dampens incoming kinetic force.",
		effect_description:
			"When you block an attack, you can use your reaction to create a gravity well, pulling enemies within 15 feet exactly 5 feet closer to you.",
		rune_type: "defensive",
		rune_category: "Defense",
		rune_level: 2,
		rarity: "uncommon",
		effect_type: "passive",
		requires_level: 2,
		active_feature: {
			name: "Gravity Well",
			description:
				"As reaction to block, pull enemies within 15ft exactly 5ft closer.",
			action_type: "reaction",
			range: "15 ft",
		},
		tags: ["void", "sigil", "shield"],
		image: "/generated/sigils/void-sigil.webp",
	},
	{
		id: "sigil-void-accessory-44",
		name: "Sigil of Void Channeling",
		description:
			"A multi-layered frozen moonlight sigil that acts as a focal point for spectral resonance manipulation. It grants the wielder shimmering frost capabilities.",
		effect_description:
			"Your spells ignore half cover and three-quarters cover.",
		rune_type: "caster",
		rune_category: "Control",
		rune_level: 4,
		rarity: "rare",
		effect_type: "passive",
		requires_level: 4,
		passive_bonuses: {
			traits: ["Spells ignore half and three-quarters cover"],
		},
		tags: ["void", "sigil", "accessory"],
		image: "/generated/sigils/void-sigil.webp",
	},
	{
		id: "sigil-void-boots-45",
		name: "Sigil of Void Stride",
		description:
			"A multi-layered tempered gate-steel sigil that acts as a focal point for thermal energy manipulation. It grants the wielder shimmering frost capabilities.",
		effect_description:
			"You hover slightly off the ground, leaving no tracks and ignoring ground-based traps. You are immune to the Prone condition.",
		rune_type: "martial",
		rune_category: "Mobility",
		rune_level: 6,
		rarity: "very_rare",
		effect_type: "passive",
		requires_level: 6,
		passive_bonuses: {
			traits: ["Immunity to Prone condition", "Hover/Ignore ground traps"],
		},
		tags: ["void", "sigil", "boots"],
		image: "/generated/sigils/void-sigil.webp",
	},
	{
		id: "sigil-time-weapon-46",
		name: "Sigil of Time Strikes",
		description:
			"A series of jagged, aggressive runes etched into frozen moonlight. When bound to a weapon, it leeches aetheric flow from the wielder's surroundings, manifesting as white-hot sparks.",
		effect_description:
			"When you take the Attack action, you can make one additional weapon attack as a bonus action, dealing 3d8 force damage.",
		rune_type: "offensive",
		rune_category: "Combat",
		rune_level: 8,
		rarity: "legendary",
		effect_type: "passive",
		requires_level: 8,
		active_feature: {
			name: "Temporal Surge",
			description:
				"As bonus action when attacking, make one additional attack for 3d8 force.",
			action_type: "bonus-action",
			damage: "3d8 force",
		},
		tags: ["time", "sigil", "weapon"],
		image: "/generated/sigils/time-sigil.webp",
	},
	{
		id: "sigil-time-armor-47",
		name: "Sigil of Time Bulwark",
		description:
			"Derived from the shell of a gate-born behemoth, this sigil's crystallized mana surface absorbs kinetic force and vents it as luminous ripples.",
		effect_description:
			"Once per long rest, when you would be reduced to 0 hit points, time rewinds, restoring you to the hit points you had at the start of your prior turn.",
		rune_type: "defensive",
		rune_category: "Defense",
		rune_level: 2,
		rarity: "uncommon",
		effect_type: "passive",
		requires_level: 2,
		active_feature: {
			name: "Time Rewind",
			description:
				"Once per long rest, if reduced to 0 HP, restore HP to start of prior turn.",
			action_type: "reaction", // automatic trigger
			uses_max: 1,
			recharge: "Long Rest",
		},
		tags: ["time", "sigil", "armor"],
		image: "/generated/sigils/time-sigil.webp",
	},
	{
		id: "sigil-time-shield-48",
		name: "Sigil of Time Deflection",
		description:
			"Interlocking geometric patterns of soul-bonded alloy form a localized spectral resonance field. It acts as a primary buffer against shimmering frost incursions.",
		effect_description:
			"When you are hit by an attack, you can use your reaction to force the attacker to reroll the attack (taking the lower result).",
		rune_type: "defensive",
		rune_category: "Defense",
		rune_level: 4,
		rarity: "rare",
		effect_type: "passive",
		requires_level: 4,
		active_feature: {
			name: "Chronal Deflection",
			description:
				"As reaction to being hit, force attacker to reroll (lower result).",
			action_type: "reaction",
		},
		tags: ["time", "sigil", "shield"],
		image: "/generated/sigils/time-sigil.webp",
	},
	{
		id: "sigil-time-accessory-49",
		name: "Sigil of Time Channeling",
		description:
			"An intricate web of tempered gate-steel designed for kinetic force stabilization. It provides the wielder with shimmering frost during complex System interactions.",
		effect_description:
			"You have advantage on Initiative rolls, and you can cast 'Haste' once per long rest without expending a slot.",
		rune_type: "caster",
		rune_category: "Control",
		rune_level: 6,
		rarity: "very_rare",
		effect_type: "passive",
		requires_level: 6,
		active_feature: {
			name: "Chronos Channeling (Haste)",
			description: "Cast Haste once per long rest without a slot.",
			action_type: "action",
			uses_max: 1,
			recharge: "Long Rest",
		},
		passive_bonuses: {
			traits: ["Advantage on Initiative rolls"],
		},
		tags: ["time", "sigil", "accessory"],
		image: "/generated/sigils/time-sigil.webp",
	},
	{
		id: "sigil-time-boots-50",
		name: "Sigil of Time Stride",
		description:
			"A multi-layered tempered gate-steel sigil that acts as a focal point for elemental potential manipulation. It grants the wielder luminous ripples capabilities.",
		effect_description:
			"You can use a bonus action to mark your current location in time. At the end of your next turn, you teleport back to that space.",
		rune_type: "martial",
		rune_category: "Mobility",
		rune_level: 4,
		rarity: "rare",
		effect_type: "passive",
		requires_level: 4,
		active_feature: {
			name: "Time Mark",
			description:
				"As bonus action, mark location. At end of next turn, teleport back.",
			action_type: "bonus-action",
		},
		tags: ["time", "sigil", "boots"],
		image: "/generated/sigils/time-sigil.webp",
	},
	{
		id: "sigil-space-weapon-51",
		name: "Sigil of Space Strikes",
		description:
			"A series of jagged, aggressive runes etched into crystallized mana. When bound to a weapon, it leeches elemental potential from the wielder's surroundings, manifesting as luminous ripples.",
		effect_description:
			"Your melee attacks can hit targets up to 15 feet away through micro-portals, dealing an extra 1d8 force damage.",
		rune_type: "offensive",
		rune_category: "Combat",
		rune_level: 4,
		rarity: "rare",
		effect_type: "passive",
		requires_level: 4,
		passive_bonuses: {
			damage_bonus: "1d8 force",
			traits: ["Melee attacks gain +15ft range via portals"],
		},
		tags: ["space", "sigil", "weapon"],
		image: "/generated/sigils/space-sigil.webp",
	},
	{
		id: "sigil-space-armor-52",
		name: "Sigil of Space Bulwark",
		description:
			"Derived from the shell of a gate-born behemoth, this sigil's frozen moonlight surface absorbs spectral resonance and vents it as shimmering frost.",
		effect_description:
			"Ranged attacks against you are made with disadvantage as reality distort around you.",
		rune_type: "defensive",
		rune_category: "Defense",
		rune_level: 4,
		rarity: "rare",
		effect_type: "passive",
		requires_level: 4,
		passive_bonuses: {
			traits: ["Ranged attacks against you have disadvantage"],
		},
		tags: ["space", "sigil", "armor"],
		image: "/generated/sigils/space-sigil.webp",
	},
	{
		id: "sigil-space-shield-53",
		name: "Sigil of Space Deflection",
		description:
			"A protective mandate from the System, etched into tempered gate-steel. It generates a shimmering distorted space shroud that dampens incoming kinetic force.",
		effect_description:
			"When you block an attack, you can use your reaction to swap places with a willing creature within 30 feet.",
		rune_type: "defensive",
		rune_category: "Defense",
		rune_level: 4,
		rarity: "rare",
		effect_type: "passive",
		requires_level: 4,
		active_feature: {
			name: "Spatial Swap",
			description:
				"As reaction to block, swap places with willing creature within 30ft.",
			action_type: "reaction",
			range: "30 ft",
		},
		tags: ["space", "sigil", "shield"],
		image: "/generated/sigils/space-sigil.webp",
	},
	{
		id: "sigil-space-accessory-54",
		name: "Sigil of Space Channeling",
		description:
			"The System's discernment mandate, etched into soul-bonded alloy. It allows the wielder to perceive the thermal energy of the world through distorted space overlays.",
		effect_description:
			"Your spells double in range, and touch spells can be cast at a distance of 30 feet.",
		rune_type: "caster",
		rune_category: "Control",
		rune_level: 4,
		rarity: "rare",
		effect_type: "passive",
		requires_level: 4,
		passive_bonuses: {
			traits: ["Spell range doubled", "Touch spells castable at 30ft"],
		},
		tags: ["space", "sigil", "accessory"],
		image: "/generated/sigils/space-sigil.webp",
	},
	{
		id: "sigil-space-boots-55",
		name: "Sigil of Space Stride",
		description:
			"The System's discernment mandate, etched into crystallized mana. It allows the wielder to perceive the thermal energy of the world through crackling arcs overlays.",
		effect_description:
			"You can teleport up to your movement speed instead of walking.",
		rune_type: "martial",
		rune_category: "Mobility",
		rune_level: 6,
		rarity: "very_rare",
		effect_type: "passive",
		requires_level: 6,
		passive_bonuses: {
			traits: ["Teleport instead of walking (speed remains same)"],
		},
		tags: ["space", "sigil", "boots"],
		image: "/generated/sigils/space-sigil.webp",
	},
	{
		id: "sigil-mind-weapon-56",
		name: "Sigil of Mind Strikes",
		description:
			"Forged from the residue of a Rank-C gate, this sigil pulses with thermal energy. It rewrites the weapon's soul-signature to favor distorted space strikes.",
		effect_description:
			"Your weapon attacks deal an extra 1d6 psychic damage. On a critical hit, the target is confused until their next turn.",
		rune_type: "offensive",
		rune_category: "Combat",
		rune_level: 2,
		rarity: "uncommon",
		effect_type: "passive",
		requires_level: 2,
		passive_bonuses: {
			damage_bonus: "1d6 psychic",
			traits: ["Critical hits cause Confusion until target's next turn"],
		},
		tags: ["mind", "sigil", "weapon"],
		image: "/generated/sigils/mind-sigil.webp",
	},
	{
		id: "sigil-mind-armor-57",
		name: "Sigil of Mind Bulwark",
		description:
			"Interlocking geometric patterns of tempered gate-steel form a localized elemental potential field. It acts as a primary buffer against white-hot sparks incursions.",
		effect_description:
			"Grants resistance to psychic damage. You are immune to being charmed or frightened.",
		rune_type: "defensive",
		rune_category: "Defense",
		rune_level: 6,
		rarity: "very_rare",
		effect_type: "passive",
		requires_level: 6,
		passive_bonuses: {
			traits: ["Resistance to Psychic damage", "Immunity to Charm/Frightened"],
		},
		tags: ["mind", "sigil", "armor"],
		image: "/generated/sigils/mind-sigil.webp",
	},
	{
		id: "sigil-mind-shield-58",
		name: "Sigil of Mind Deflection",
		description:
			"A protective mandate from the System, etched into void-glass. It generates a shimmering luminous ripples shroud that dampens incoming kinetic force.",
		effect_description:
			"When you block a melee attack, the attacker takes 2d8 psychic damage from a mental backlash.",
		rune_type: "defensive",
		rune_category: "Defense",
		rune_level: 6,
		rarity: "very_rare",
		effect_type: "passive",
		requires_level: 6,
		active_feature: {
			name: "Mental Backlash",
			description:
				"When you block a melee attack, attacker takes 2d8 psychic damage.",
			action_type: "passive", // automatic trigger
			damage: "2d8 psychic",
		},
		tags: ["mind", "sigil", "shield"],
		image: "/generated/sigils/mind-sigil.webp",
	},
	{
		id: "sigil-mind-accessory-59",
		name: "Sigil of Mind Channeling",
		description:
			"A multi-layered tempered gate-steel sigil that acts as a focal point for thermal energy manipulation. It grants the wielder luminous ripples capabilities.",
		effect_description:
			"You gain telepathy out to 60 feet, and illusion spells you cast require an Intelligence saving throw instead of Sense.",
		rune_type: "caster",
		rune_category: "Control",
		rune_level: 8,
		rarity: "legendary",
		effect_type: "passive",
		requires_level: 8,
		passive_bonuses: {
			traits: [
				"Telepathy 60ft",
				"Illusion spells use INT save instead of SENSE",
			],
		},
		tags: ["mind", "sigil", "accessory"],
		image: "/generated/sigils/mind-sigil.webp",
	},
	{
		id: "sigil-mind-boots-60",
		name: "Sigil of Mind Stride",
		description:
			"An intricate web of crystallized mana designed for thermal energy stabilization. It provides the wielder with flickering shadows during complex System interactions.",
		effect_description:
			"You can use a bonus action to become invisible to one specific creature you can see for 1 minute.",
		rune_type: "martial",
		rune_category: "Mobility",
		rune_level: 4,
		rarity: "rare",
		effect_type: "passive",
		requires_level: 4,
		active_feature: {
			name: "Mind Veil",
			description:
				"As bonus action, become invisible to one creature you see for 1 minute.",
			action_type: "bonus-action",
			duration: "1 minute",
		},
		tags: ["mind", "sigil", "boots"],
		image: "/generated/sigils/mind-sigil.webp",
	},
	{
		id: "sigil-soul-weapon-61",
		name: "Sigil of Soul Strikes",
		description:
			"The System's offensive directive is transcribed here in tempered gate-steel. It hums with a spectral resonance frequency, causing the weapon's edge to shimmer with shimmering frost.",
		effect_description:
			"Your attacks deal an extra 1d6 radiant or necrotic damage (your choice). Slain enemies can't be raised as undead.",
		rune_type: "offensive",
		rune_category: "Combat",
		rune_level: 2,
		rarity: "uncommon",
		effect_type: "passive",
		requires_level: 2,
		passive_bonuses: {
			damage_bonus: "1d6 radiant", // chosen by user conceptually
			traits: ["Radiant/Necrotic choice", "Slain enemies cannot be raised"],
		},
		tags: ["soul", "sigil", "weapon"],
		image: "/generated/sigils/soul-sigil.webp",
	},
	{
		id: "sigil-soul-armor-62",
		name: "Sigil of Soul Bulwark",
		description:
			"Derived from the shell of a gate-born behemoth, this sigil's soul-bonded alloy surface absorbs spectral resonance and vents it as white-hot sparks.",
		effect_description:
			"You gain advantage on death saving throws. When you heal a creature, you both gain 40 temporary hit points.",
		rune_type: "defensive",
		rune_category: "Defense",
		rune_level: 8,
		rarity: "legendary",
		effect_type: "passive",
		requires_level: 8,
		passive_bonuses: {
			traits: [
				"Advantage on Death saves",
				"Heals grant 40 temp HP to you and target",
			],
		},
		tags: ["soul", "sigil", "armor"],
		image: "/generated/sigils/soul-sigil.webp",
	},
	{
		id: "sigil-soul-shield-63",
		name: "Sigil of Soul Deflection",
		description:
			"Derived from the shell of a gate-born behemoth, this sigil's frozen moonlight surface absorbs umbral essence and vents it as shimmering frost.",
		effect_description:
			"When you block an attack, you can use your reaction to grant an ally within 30 feet a bonus to their next saving throw equal to your proficiency modifier.",
		rune_type: "defensive",
		rune_category: "Defense",
		rune_level: 4,
		rarity: "rare",
		effect_type: "passive",
		requires_level: 4,
		active_feature: {
			name: "Soul Guard",
			description:
				"As reaction to block, grant ally +PB to their next saving throw.",
			action_type: "reaction",
			range: "30 ft",
		},
		tags: ["soul", "sigil", "shield"],
		image: "/generated/sigils/soul-sigil.webp",
	},
	{
		id: "sigil-soul-accessory-64",
		name: "Sigil of Soul Channeling",
		description:
			"An intricate web of obsidian shards designed for thermal energy stabilization. It provides the wielder with distorted space during complex System interactions.",
		effect_description:
			"Your soul fuels your magic. You can cast spells without material components up to a value of 300 gold.",
		rune_type: "caster",
		rune_category: "Control",
		rune_level: 6,
		rarity: "very_rare",
		effect_type: "passive",
		requires_level: 6,
		passive_bonuses: {
			traits: ["Ignore material components up to 300gp"],
		},
		tags: ["soul", "sigil", "accessory"],
		image: "/generated/sigils/soul-sigil.webp",
	},
	{
		id: "sigil-soul-boots-65",
		name: "Sigil of Soul Stride",
		description:
			"The System's discernment mandate, etched into obsidian shards. It allows the wielder to perceive the umbral essence of the world through flickering shadows overlays.",
		effect_description:
			"You can walk through solid objects up to 5 feet thick as difficult terrain once per turn.",
		rune_type: "martial",
		rune_category: "Mobility",
		rune_level: 4,
		rarity: "rare",
		effect_type: "passive",
		requires_level: 4,
		passive_bonuses: {
			traits: [
				"Walk through 5ft solid objects as difficult terrain once per turn",
			],
		},
		tags: ["soul", "sigil", "boots"],
		image: "/generated/sigils/soul-sigil.webp",
	},
	{
		id: "sigil-nature-weapon-66",
		name: "Sigil of Nature Strikes",
		description:
			"A series of jagged, aggressive runes etched into crystallized mana. When bound to a weapon, it leeches spectral resonance from the wielder's surroundings, manifesting as flickering shadows.",
		effect_description:
			"Your weapons deal an extra 2d8 poison damage. On a hit, thorns sprout from the wound causing 1d4 damage if the target moves.",
		rune_type: "offensive",
		rune_category: "Combat",
		rune_level: 6,
		rarity: "very_rare",
		effect_type: "passive",
		requires_level: 6,
		passive_bonuses: {
			damage_bonus: "2d8 poison",
			traits: ["Target takes 1d4 damage on move (Thorns)"],
		},
		tags: ["nature", "sigil", "weapon"],
		image: "/generated/sigils/nature-sigil.webp",
	},
	{
		id: "sigil-nature-armor-67",
		name: "Sigil of Nature Bulwark",
		description:
			"Interlocking geometric patterns of tempered gate-steel form a localized spectral resonance field. It acts as a primary buffer against shimmering frost incursions.",
		effect_description:
			"Grants resistance to poison damage. You blend into natural terrain, gaining advantage on Stealth checks in wilderness.",
		rune_type: "defensive",
		rune_category: "Defense",
		rune_level: 2,
		rarity: "uncommon",
		effect_type: "passive",
		requires_level: 2,
		passive_bonuses: {
			traits: [
				"Resistance to Poison damage",
				"Advantage on Stealth in wilderness",
			],
		},
		tags: ["nature", "sigil", "armor"],
		image: "/generated/sigils/nature-sigil.webp",
	},
	{
		id: "sigil-nature-shield-68",
		name: "Sigil of Nature Deflection",
		description:
			"Derived from the shell of a gate-born behemoth, this sigil's soul-bonded alloy surface absorbs umbral essence and vents it as white-hot sparks.",
		effect_description:
			"When you block an attack, grasping vines erupt, reducing the attacker's speed to 0 until the start of their next turn.",
		rune_type: "defensive",
		rune_category: "Defense",
		rune_level: 2,
		rarity: "uncommon",
		effect_type: "passive",
		requires_level: 2,
		active_feature: {
			name: "Grasping Vines",
			description: "As reaction to block, reduce attacker's speed to 0.",
			action_type: "reaction",
		},
		tags: ["nature", "sigil", "shield"],
		image: "/generated/sigils/nature-sigil.webp",
	},
	{
		id: "sigil-nature-accessory-69",
		name: "Sigil of Nature Channeling",
		description:
			"An intricate web of void-glass designed for elemental potential stabilization. It provides the wielder with shimmering frost during complex System interactions.",
		effect_description:
			"Beasts and plants will not attack you unless provoked. Your healing spells also cure the poisoned condition.",
		rune_type: "caster",
		rune_category: "Control",
		rune_level: 8,
		rarity: "legendary",
		effect_type: "passive",
		requires_level: 8,
		passive_bonuses: {
			traits: [
				"Beasts/Plants non-hostile unless provoked",
				"Healing spells also cure Poisoned",
			],
		},
		tags: ["nature", "sigil", "accessory"],
		image: "/generated/sigils/nature-sigil.webp",
	},
	{
		id: "sigil-nature-boots-70",
		name: "Sigil of Nature Stride",
		description:
			"The System's discernment mandate, etched into frozen moonlight. It allows the wielder to perceive the elemental potential of the world through flickering shadows overlays.",
		effect_description:
			"You ignore difficult terrain caused by plants or natural overgrowth, and you leave no trace of your passage.",
		rune_type: "martial",
		rune_category: "Mobility",
		rune_level: 6,
		rarity: "very_rare",
		effect_type: "passive",
		requires_level: 6,
		passive_bonuses: {
			traits: ["Ignore difficult terrain (plants/natural)", "Leave no trace"],
		},
		tags: ["nature", "sigil", "boots"],
		image: "/generated/sigils/nature-sigil.webp",
	},
	{
		id: "sigil-metal-weapon-71",
		name: "Sigil of Metal Strikes",
		description:
			"A series of jagged, aggressive runes etched into soul-bonded alloy. When bound to a weapon, it leeches kinetic force from the wielder's surroundings, manifesting as luminous ripples.",
		effect_description:
			"Your attacks are considered adamantine, dealing max damage to objects and ignoring resistances of constructs. They deal an extra 2d8 slashing damage.",
		rune_type: "offensive",
		rune_category: "Combat",
		rune_level: 6,
		rarity: "very_rare",
		effect_type: "passive",
		requires_level: 6,
		passive_bonuses: {
			damage_bonus: "2d8 slashing",
			traits: [
				"Attacks are Adamantine (Max damage to objects, ignore construct resistance)",
			],
		},
		tags: ["metal", "sigil", "weapon"],
		image: "/generated/sigils/metal-sigil.webp",
	},
	{
		id: "sigil-metal-armor-72",
		name: "Sigil of Metal Bulwark",
		description:
			"A protective mandate from the System, etched into liquid aether. It generates a shimmering shimmering frost shroud that dampens incoming kinetic force.",
		effect_description:
			"Your AC increases by +2, and critical hits against you become normal hits.",
		rune_type: "defensive",
		rune_category: "Defense",
		rune_level: 4,
		rarity: "rare",
		effect_type: "passive",
		requires_level: 4,
		passive_bonuses: {
			ac_bonus: 2,
			traits: ["Critical hits are normal hits"],
		},
		tags: ["metal", "sigil", "armor"],
		image: "/generated/sigils/metal-sigil.webp",
	},
	{
		id: "sigil-metal-shield-73",
		name: "Sigil of Metal Deflection",
		description:
			"Interlocking geometric patterns of tempered gate-steel form a localized thermal energy field. It acts as a primary buffer against flickering shadows incursions.",
		effect_description:
			"When you block an attack, you can use your reaction to disarm the attacker if they are wielding a metal weapon (DC 30 Strength check).",
		rune_type: "defensive",
		rune_category: "Defense",
		rune_level: 8,
		rarity: "legendary",
		effect_type: "passive",
		requires_level: 8,
		active_feature: {
			name: "Iron Grip Disarm",
			description:
				"As reaction to block metal weapon, force DC 30 Str check or disarm.",
			action_type: "reaction",
			resolution: "DC 30 Strength check",
		},
		tags: ["metal", "sigil", "shield"],
		image: "/generated/sigils/metal-sigil.webp",
	},
	{
		id: "sigil-metal-accessory-74",
		name: "Sigil of Metal Channeling",
		description:
			"The System's discernment mandate, etched into soul-bonded alloy. It allows the wielder to perceive the spectral resonance of the world through crackling arcs overlays.",
		effect_description:
			"You have advantage on saving throws to maintain concentration, and you gain resistance to nonmagical bludgeoning damage.",
		rune_type: "caster",
		rune_category: "Control",
		rune_level: 4,
		rarity: "rare",
		effect_type: "passive",
		requires_level: 4,
		passive_bonuses: {
			traits: [
				"Advantage on Concentration saves",
				"Resistance to nonmagical bludgeoning",
			],
		},
		tags: ["metal", "sigil", "accessory"],
		image: "/generated/sigils/metal-sigil.webp",
	},
	{
		id: "sigil-metal-boots-75",
		name: "Sigil of Metal Stride",
		description:
			"A multi-layered crystallized mana sigil that acts as a focal point for aetheric flow manipulation. It grants the wielder shimmering frost capabilities.",
		effect_description:
			"You cannot be forcibly moved by wind or magic, and your kicks deal 1d8 bludgeoning damage.",
		rune_type: "martial",
		rune_category: "Mobility",
		rune_level: 6,
		rarity: "very_rare",
		effect_type: "passive",
		requires_level: 6,
		passive_bonuses: {
			damage_bonus: "1d8 bludgeoning",
			traits: ["Immunity to forced movement (wind/magic)"],
		},
		tags: ["metal", "sigil", "boots"],
		image: "/generated/sigils/metal-sigil.webp",
	},
	{
		id: "sigil-ring-protection-1",
		name: "Warding Diamond",
		description:
			"A flawless diamond. When socketed into a ring, it channels protective energy.",
		effect_description:
			"You gain a +1 bonus to saving throws against spells and magical effects.",
		rune_type: "defensive",
		rune_category: "Defense",
		rune_level: 2,
		rarity: "uncommon",
		effect_type: "passive",
		requires_level: 2,
		passive_bonuses: {
			traits: ["+1 bonus to saving throws against spells/magical effects"],
		},
		tags: ["ward", "sigil", "ring", "gem"],
		image: "/generated/sigils/ward-sigil.webp",
	},
	{
		id: "sigil-ring-precision-2",
		name: "Amethyst of Precision",
		description:
			"A perfectly cut amethyst. When socketed into a ring, it sharpens your focus.",
		effect_description:
			"You gain a +1 bonus to attack rolls with ranged weapons.",
		rune_type: "offensive",
		rune_category: "Combat",
		rune_level: 4,
		rarity: "rare",
		effect_type: "passive",
		requires_level: 4,
		passive_bonuses: {
			attack_bonus: 1,
			traits: ["+1 bonus to attack rolls with ranged weapons"],
		},
		tags: ["precision", "sigil", "ring", "gem"],
		image: "/generated/sigils/precision-sigil.webp",
	},
	{
		id: "sigil-amulet-resistance-1",
		name: "Elemental Pearl",
		description:
			"An iridescent pearl. When socketed into an amulet, it grants elemental protection.",
		effect_description: "You gain resistance to poison and necrotic damage.",
		rune_type: "defensive",
		rune_category: "Defense",
		rune_level: 3,
		rarity: "rare",
		effect_type: "passive",
		requires_level: 3,
		passive_bonuses: {
			traits: ["Resistance to Poison and Necrotic damage"],
		},
		tags: ["elemental", "sigil", "amulet", "gem"],
		image: "/generated/sigils/elemental-sigil.webp",
	},
	{
		id: "sigil-amulet-insight-2",
		name: "Sapphire of Insight",
		description:
			"A deep blue sapphire. When socketed into an amulet, it grants mental clarity.",
		effect_description:
			"You gain a +1 bonus to Intelligence and Sense saving throws.",
		rune_type: "caster",
		rune_category: "Control",
		rune_level: 5,
		rarity: "very_rare",
		effect_type: "passive",
		requires_level: 5,
		passive_bonuses: {
			traits: ["+1 bonus to Intelligence and Sense saving throws"],
		},
		tags: ["insight", "sigil", "amulet", "gem"],
		image: "/generated/sigils/insight-sigil.webp",
	},
	{
		id: "sigil-cloak-stealth-1",
		name: "Umbral Obsidian",
		description:
			"A shard of pure black obsidian. When socketed into a cloak, it bends light around you.",
		effect_description: "You gain advantage on Agility (Stealth) checks.",
		rune_type: "utility",
		rune_category: "Stealth",
		rune_level: 2,
		rarity: "uncommon",
		effect_type: "passive",
		requires_level: 2,
		passive_bonuses: {
			traits: ["Advantage on Agility (Stealth) checks"],
		},
		tags: ["stealth", "sigil", "cloak", "gem"],
		image: "/generated/sigils/shadow-sigil.webp",
	},
	{
		id: "sigil-cloak-flight-2",
		name: "Zephyr Opal",
		description:
			"A cloudy, swirling opal. When socketed into a cloak, it grants limited flight.",
		effect_description:
			"You gain a fly speed of 20 feet. This speed cannot be used while wearing medium or Heavy Carapace Armor.",
		rune_type: "mobility",
		rune_category: "Mobility",
		rune_level: 6,
		rarity: "legendary",
		effect_type: "passive",
		requires_level: 6,
		passive_bonuses: {
			speed_bonus: 20,
			traits: ["Fly speed 20ft (No medium/Heavy Carapace Armor)"],
		},
		tags: ["flight", "sigil", "cloak", "gem"],
		image: "/generated/sigils/wind-sigil.webp",
	},
	{
		id: "sigil-belt-strength-1",
		name: "Ruby of Might",
		description:
			"A blood-red ruby. When socketed into a belt, it enhances physical power.",
		effect_description:
			"Your Strength score increases by 2, to a maximum of 20.",
		rune_type: "martial",
		rune_category: "Enhancement",
		rune_level: 4,
		rarity: "rare",
		effect_type: "passive",
		requires_level: 4,
		can_inscribe_on: ["belt"],
		inscription_difficulty: 14,
		tags: ["strength", "sigil", "belt", "gem"],
		image: "/generated/sigils/earth-sigil.webp",
	},
	{
		id: "sigil-belt-resilience-2",
		name: "Topaz of Resilience",
		description:
			"A glowing yellow topaz. When socketed into a belt, it grants damage resistance.",
		effect_description:
			"You gain resistance to bludgeoning, piercing, and slashing damage from nonmagical attacks.",
		rune_type: "defensive",
		rune_category: "Defense",
		rune_level: 5,
		rarity: "very_rare",
		effect_type: "passive",
		requires_level: 5,
		can_inscribe_on: ["belt"],
		inscription_difficulty: 16,
		tags: ["resilience", "sigil", "belt", "gem"],
		image: "/generated/sigils/ward-sigil.webp",
	},
	{
		id: "sigil-gloves-agility-1",
		name: "Tourmaline of Agility",
		description:
			"A multi-faceted tourmaline. When socketed into gloves, it enhances hand coordination.",
		effect_description:
			"You gain a +1 bonus to Agility (Sleight of Hand) checks.",
		rune_type: "utility",
		rune_category: "Enhancement",
		rune_level: 2,
		rarity: "uncommon",
		effect_type: "passive",
		requires_level: 2,
		can_inscribe_on: ["gloves"],
		inscription_difficulty: 12,
		tags: ["agility", "sigil", "gloves", "gem"],
		image: "/generated/sigils/wind-sigil.webp",
	},
	{
		id: "sigil-gloves-casting-2",
		name: "Arcane Quartz",
		description:
			"A resonant quartz crystal. When socketed into gloves, it stabilizes spellcasting.",
		effect_description:
			"You have advantage on Vitality saving throws to maintain concentration on a spell.",
		rune_type: "caster",
		rune_category: "Control",
		rune_level: 4,
		rarity: "rare",
		effect_type: "passive",
		requires_level: 4,
		can_inscribe_on: ["gloves"],
		inscription_difficulty: 14,
		tags: ["arcane", "sigil", "gloves", "gem"],
		image: "/generated/sigils/light-sigil.webp",
	},
	{
		id: "sigil-bracers-protection-1",
		name: "Aegis Jade",
		description:
			"A smooth piece of jade. When socketed into bracers, it deflects incoming attacks.",
		effect_description: "You gain a +1 bonus to AC while not wearing armor.",
		rune_type: "defensive",
		rune_category: "Defense",
		rune_level: 3,
		rarity: "uncommon",
		effect_type: "passive",
		requires_level: 3,
		can_inscribe_on: ["bracers"],
		inscription_difficulty: 12,
		tags: ["deflection", "sigil", "bracers", "gem"],
		image: "/generated/sigils/ward-sigil.webp",
	},
	{
		id: "sigil-bracers-archery-2",
		name: "Agate of Marksmanship",
		description:
			"A banded agate. When socketed into bracers, it steadies your aim.",
		effect_description:
			"You ignore the long range property of ranged weapons you are proficient with.",
		rune_type: "offensive",
		rune_category: "Combat",
		rune_level: 5,
		rarity: "rare",
		effect_type: "passive",
		requires_level: 5,
		can_inscribe_on: ["bracers"],
		inscription_difficulty: 14,
		tags: ["archery", "sigil", "bracers", "gem"],
		image: "/generated/sigils/precision-sigil.webp",
	},
	{
		id: "sigil-headwear-perception-1",
		name: "Emerald of Awareness",
		description:
			"A brilliant green emerald. When socketed into headwear, it sharpens perception.",
		effect_description: "You gain a +1 bonus to Sense (Perception) checks.",
		rune_type: "utility",
		rune_category: "Enhancement",
		rune_level: 2,
		rarity: "uncommon",
		effect_type: "passive",
		requires_level: 2,
		can_inscribe_on: ["headwear"],
		inscription_difficulty: 12,
		tags: ["perception", "sigil", "headwear", "gem"],
		image: "/generated/sigils/light-sigil.webp",
	},
	{
		id: "sigil-headwear-presence-2",
		name: "Sunstone of Presence",
		description:
			"A warm, golden sunstone. When socketed into headwear, it projects authority.",
		effect_description:
			"You gain advantage on Presence (Persuasion) and Presence (Intimidation) checks.",
		rune_type: "utility",
		rune_category: "Social",
		rune_level: 6,
		rarity: "very_rare",
		effect_type: "passive",
		requires_level: 6,
		can_inscribe_on: ["headwear"],
		inscription_difficulty: 16,
		tags: ["presence", "sigil", "headwear", "gem"],
		image: "/generated/sigils/light-sigil.webp",
	},
	{
		id: "sigil-gem-adamantine-core",
		name: "Adamantine Core Sigil",
		description:
			"A dense, unyielding synthetic adamantine gem. When socketed, it hardens your defense.",
		effect_description: "Any critical hit against you becomes a normal hit.",
		rune_type: "defensive",
		rune_category: "Defense",
		rune_level: 6,
		rarity: "very_rare",
		effect_type: "passive",
		requires_level: 6,
		can_inscribe_on: ["armor", "shield"],
		inscription_difficulty: 16,
		tags: ["defense", "adamantine", "gem"],
		image: "/generated/sigils/metal-sigil.webp",
	},
	{
		id: "sigil-gem-lifeblood-ruby",
		name: "Lifeblood Ruby",
		description:
			"Derived from the shell of a gate-born behemoth, this sigil's obsidian shards surface absorbs elemental potential and vents it as shimmering frost.",
		effect_description:
			"Your hit point maximum increases by 10, and whenever you expend a Hit Die to heal, you regain an additional 1d4 hit points.",
		rune_type: "defensive",
		rune_category: "Enhancement",
		rune_level: 5,
		rarity: "rare",
		effect_type: "passive",
		requires_level: 5,
		can_inscribe_on: ["armor", "accessory"],
		inscription_difficulty: 14,
		tags: ["health", "vitality", "ruby", "gem"],
		image: "/generated/sigils/blood-sigil.webp",
	},
	{
		id: "sigil-gem-shatterstone-quartz",
		name: "Shatterstone Quartz",
		description: "A jagged quartz that destabilizes molecular bonds on impact.",
		effect_description:
			"Your weapon attacks deal double damage to objects and structures. Once per turn, you can ignore empirical resistances when dealing bludgeoning damage.",
		rune_type: "offensive",
		rune_category: "Combat",
		rune_level: 4,
		rarity: "rare",
		effect_type: "passive",
		requires_level: 4,
		can_inscribe_on: ["weapon"],
		inscription_difficulty: 14,
		tags: ["siege", "strike", "quartz", "gem"],
		image: "/generated/sigils/earth-sigil.webp",
	},
	{
		id: "sigil-gem-venom-fang-emerald",
		name: "Venom Fang Emerald",
		description:
			"A sinister emerald that constantly secretes a mild neurotoxin.",
		effect_description:
			"Your attacks deal an extra 1d6 poison damage. On a critical hit, the target is poisoned until the end of its next turn.",
		rune_type: "offensive",
		rune_category: "Combat",
		rune_level: 3,
		rarity: "uncommon",
		effect_type: "passive",
		requires_level: 3,
		can_inscribe_on: ["weapon"],
		inscription_difficulty: 13,
		tags: ["poison", "venom", "emerald", "gem"],
		image: "/generated/sigils/nature-sigil.webp",
	},
	{
		id: "sigil-gem-thunderstrike-sapphire",
		name: "Thunderstrike Sapphire",
		description:
			"An intricate web of crystallized mana designed for aetheric flow stabilization. It provides the wielder with flickering shadows during complex System interactions.",
		effect_description:
			"When you hit with an attack, you can trigger a thunderclap. The target and creatures within 5 feet take 2d6 thunder damage (recharges on a short rest).",
		rune_type: "hybrid",
		rune_category: "Combat",
		rune_level: 7,
		rarity: "very_rare",
		effect_type: "both",
		requires_level: 7,
		can_inscribe_on: ["weapon", "shield"],
		inscription_difficulty: 17,
		tags: ["thunder", "storm", "sapphire", "gem"],
		image: "/generated/sigils/lightning-sigil.webp",
	},
	{
		id: "sigil-gem-minds-eye-pearl",
		name: "Mind's Eye Pearl",
		description:
			"An intricate web of obsidian shards designed for elemental potential stabilization. It provides the wielder with white-hot sparks during complex System interactions.",
		effect_description:
			"You can cast Detect Magic and Identify at will without expending a spell slot or material components.",
		rune_type: "utility",
		rune_category: "Knowledge",
		rune_level: 2,
		rarity: "uncommon",
		effect_type: "passive",
		requires_level: 2,
		can_inscribe_on: ["headwear", "accessory"],
		inscription_difficulty: 12,
		tags: ["magic", "utility", "pearl", "gem"],
		image: "/generated/sigils/insight-sigil.webp",
	},
	{
		id: "sigil-gem-echoing-amethyst",
		name: "Echoing Amethyst",
		description: "A faceted amethyst that mirrors spellcasting harmonics.",
		effect_description:
			"When you cast a spell that targets only one creature and doesn't have a range of self, you can choose a second target within range for the same spell. (Once per long rest).",
		rune_type: "caster",
		rune_category: "Control",
		rune_level: 8,
		rarity: "legendary",
		effect_type: "active",
		requires_level: 8,
		can_inscribe_on: ["accessory", "gloves"],
		inscription_difficulty: 20,
		tags: ["twin", "caster", "amethyst", "gem"],
		image: "/generated/sigils/arcane-sigil.webp",
	},
	{
		id: "sigil-gem-manathirst-onyx",
		name: "Manathirst Onyx",
		description:
			"The System's discernment mandate, etched into soul-bonded alloy. It allows the wielder to perceive the spectral resonance of the world through distorted space overlays.",
		effect_description:
			"When you counter or dispel a spell, you regain hit points equal to 1d8 + your spellcasting modifier.",
		rune_type: "hybrid",
		rune_category: "Defense",
		rune_level: 5,
		rarity: "rare",
		effect_type: "passive",
		requires_level: 5,
		can_inscribe_on: ["accessory", "shield"],
		inscription_difficulty: 15,
		tags: ["antimagic", "drain", "onyx", "gem"],
		image: "/generated/sigils/void-sigil.webp",
	},
	{
		id: "sigil-gem-heartwood-jade",
		name: "Heartwood Jade",
		description: "A warm jade bead carved from Finnish-reified boreal wood.",
		effect_description:
			"Any healing spell you cast restores an additional 1d6 hit points to the target.",
		rune_type: "caster",
		rune_category: "Recovery",
		rune_level: 4,
		rarity: "rare",
		effect_type: "passive",
		requires_level: 4,
		can_inscribe_on: ["accessory"],
		inscription_difficulty: 14,
		tags: ["healing", "nature", "jade", "gem"],
		image: "/generated/sigils/nature-sigil.webp",
	},
	{
		id: "sigil-gem-martyrs-tear",
		name: "Martyr's Tear",
		description:
			"A multi-layered tempered gate-steel sigil that acts as a focal point for aetheric flow manipulation. It grants the wielder distorted space capabilities.",
		effect_description:
			"When an ally within 30 feet drops to 0 hit points, you can use your reaction to instantly stabilize them and heal them for 1 HP instead. In exchange, you suffer 3d8 radiant damage. (Once per short rest).",
		rune_type: "hybrid",
		rune_category: "Recovery",
		rune_level: 6,
		rarity: "very_rare",
		effect_type: "active",
		requires_level: 6,
		can_inscribe_on: ["accessory"],
		inscription_difficulty: 18,
		tags: ["martyr", "healing", "gem"],
		image: "/generated/sigils/light-sigil.webp",
	},
	{
		id: "sigil-gem-windwalker-turquoise",
		name: "Windwalker Turquoise",
		description: "A smooth turquoise gem infused with a perpetual breeze.",
		effect_description:
			"Your walking speed increases by 10 feet. Difficult terrain doesn't cost you extra movement.",
		rune_type: "mobility",
		rune_category: "Mobility",
		rune_level: 4,
		rarity: "rare",
		effect_type: "passive",
		requires_level: 4,
		can_inscribe_on: ["boots", "accessory"],
		inscription_difficulty: 14,
		tags: ["speed", "movement", "turquoise", "gem"],
		image: "/generated/sigils/wind-sigil.webp",
	},
	{
		id: "sigil-gem-shadowstep-obsidian",
		name: "Shadowstep Obsidian",
		description:
			"A multi-layered soul-bonded alloy sigil that acts as a focal point for aetheric flow manipulation. It grants the wielder shimmering frost capabilities.",
		effect_description:
			"As a bonus action, you can teleport up to 30 feet to an unoccupied space you can see that is in dim light or darkness. (Proficiency Bonus times per long rest).",
		rune_type: "utility",
		rune_category: "Mobility",
		rune_level: 5,
		rarity: "very_rare",
		effect_type: "active",
		requires_level: 5,
		can_inscribe_on: ["boots", "cloak"],
		inscription_difficulty: 16,
		tags: ["teleport", "shadow", "obsidian", "gem"],
		image: "/generated/sigils/shadow-sigil.webp",
	},
	{
		id: "sigil-gem-executioners-bloodstone",
		name: "Executioner's Bloodstone",
		description:
			"A hematite gem that grows warm in the presence of the bleeding.",
		effect_description:
			"Weapon attacks against creatures below half their maximum hit points score a critical hit on a roll of 19 or 20.",
		rune_type: "offensive",
		rune_category: "Combat",
		rune_level: 7,
		rarity: "legendary",
		effect_type: "passive",
		requires_level: 7,
		can_inscribe_on: ["weapon"],
		inscription_difficulty: 20,
		tags: ["execution", "crit", "bloodstone", "gem"],
		image: "/generated/sigils/blood-sigil.webp",
	},
	{
		id: "sigil-gem-vampiric-garnet",
		name: "Vampiric Garnet",
		description:
			"The System's discernment mandate, etched into crystallized mana. It allows the wielder to perceive the kinetic force of the world through luminous ripples overlays.",
		effect_description:
			"When you deal a critical hit with this weapon, you regain hit points equal to half the necrotic or slashing damage dealt.",
		rune_type: "hybrid",
		rune_category: "Combat",
		rune_level: 6,
		rarity: "very_rare",
		effect_type: "passive",
		requires_level: 6,
		can_inscribe_on: ["weapon"],
		inscription_difficulty: 16,
		tags: ["lifesteal", "vampire", "garnet", "gem"],
		image: "/generated/sigils/blood-sigil.webp",
	},
	{
		id: "sigil-gem-titans-marrow",
		name: "Titan's Marrow Specimen",
		description:
			"Not a gem, but a petrified drop of marrow from an Old Norse legacy remnant.",
		effect_description:
			"You count as one size larger when determining your carrying capacity and the weight you can push, drag, or lift.",
		rune_type: "utility",
		rune_category: "Enhancement",
		rune_level: 3,
		rarity: "uncommon",
		effect_type: "passive",
		requires_level: 3,
		can_inscribe_on: ["belt", "armor"],
		inscription_difficulty: 12,
		tags: ["titan", "strength", "marrow", "gem"],
		image: "/generated/sigils/earth-sigil.webp",
	},
	{
		id: "sigil-gem-binary-void-data-pearl",
		name: "Binary Void-Data Pearl",
		description:
			"The System's discernment mandate, etched into obsidian shards. It allows the wielder to perceive the elemental potential of the world through crackling arcs overlays.",
		effect_description:
			"You gain a swimming speed of 40 feet and can breathe underwater. You also gain resistance to cold damage.",
		rune_type: "utility",
		rune_category: "Exploration",
		rune_level: 3,
		rarity: "rare",
		effect_type: "passive",
		requires_level: 3,
		can_inscribe_on: ["accessory", "headwear"],
		inscription_difficulty: 14,
		tags: ["water", "binary_void_data", "pearl", "gem"],
		image: "/generated/sigils/ice-sigil.webp",
	},
	{
		id: "sigil-gem-dragonseye-amber",
		name: "Dragonseye Amber",
		description:
			"Fossilized amber with what looks like a reptilian pupil suspended inside.",
		effect_description:
			"You gain blindsight out to 15 feet. Within that radius, you can see invisible creatures and illusions fail against you.",
		rune_type: "utility",
		rune_category: "Perception",
		rune_level: 8,
		rarity: "legendary",
		effect_type: "passive",
		requires_level: 8,
		can_inscribe_on: ["headwear", "accessory"],
		inscription_difficulty: 20,
		tags: ["dragon", "vision", "amber", "gem"],
		image: "/generated/sigils/insight-sigil.webp",
	},
	{
		id: "sigil-gem-basilisk-scale",
		name: "Petrified Basilisk Scale",
		description:
			"Derived from the shell of a gate-born behemoth, this sigil's crystallized mana surface absorbs aetheric flow and vents it as white-hot sparks.",
		effect_description:
			"When a creature within 10 feet of you hits you with a melee attack, it must succeed on a DC 15 Vitality saving throw or have its speed reduced by 10 feet until the start of its next turn.",
		rune_type: "defensive",
		rune_category: "Defense",
		rune_level: 4,
		rarity: "rare",
		effect_type: "passive",
		requires_level: 4,
		can_inscribe_on: ["armor", "shield"],
		inscription_difficulty: 14,
		tags: ["petrify", "basilisk", "scale", "gem"],
		image: "/generated/sigils/metal-sigil.webp",
	},
	{
		id: "sigil-gem-chronos-crystal",
		name: "Chronos Crystal",
		description:
			"A crystal that seems to vibrate out of sync with normal time.",
		effect_description:
			"You gain a +2 bonus to initiative rolls. Once per long rest, you can use a reaction to reroll a failed Agility saving throw.",
		rune_type: "hybrid",
		rune_category: "Control",
		rune_level: 7,
		rarity: "very_rare",
		effect_type: "both",
		requires_level: 7,
		can_inscribe_on: ["accessory", "boots"],
		inscription_difficulty: 18,
		tags: ["time", "chronos", "crystal", "gem"],
		image: "/generated/sigils/arcane-sigil.webp",
	},
	{
		id: "sigil-gem-phoenix-feather",
		name: "Crystallized Phoenix Feather",
		description:
			"A protective mandate from the System, etched into obsidian shards. It generates a shimmering luminous ripples shroud that dampens incoming kinetic force.",
		effect_description:
			"If you drop to 0 hit points and don't die outright, you can drop to 1 hit point instead and release a burst of fire dealing 2d6 fire damage to creatures in a 10-ft radius. (Once per long rest).",
		rune_type: "defensive",
		rune_category: "Recovery",
		rune_level: 9,
		rarity: "legendary",
		effect_type: "passive",
		requires_level: 9,
		can_inscribe_on: ["armor", "accessory"],
		inscription_difficulty: 23,
		tags: ["phoenix", "revive", "fire", "gem"],
		image: "/generated/sigils/light-sigil.webp",
	},
	{
		id: "sigil-void-anchor",
		name: "Sigil of the Void Anchor",
		description:
			"A pulsating black crystal that seems to pull in nearby light. It hums with the frequency of the dimensional membrane.",
		effect_description:
			"Once per long rest, as a bonus action, you can step into the void, becoming invisible and teleporting up to 60 feet. While invisible this way, your next attack deals an extra 3d8 force damage.",
		rune_type: "utility",
		rune_category: "Mobility",
		rune_level: 10,
		rarity: "very_rare",
		effect_type: "both",
		requires_level: 10,
		can_inscribe_on: ["boots", "accessory"],
		passive_bonuses: {
			traits: ["Advantage on Agility (Stealth) checks"],
		},
		active_feature: {
			name: "Void Blink",
			description:
				"Teleport 60ft, become invisible, next attack +3d8 force damage.",
			action_type: "bonus-action",
			range: "60 feet",
			damage: "3d8 force",
			condition: "Invisibility",
		},
		tags: ["void", "teleport", "stealth"],
		image: "/generated/sigils/void-sigil.webp",
	},
	{
		id: "sigil-chronos-clock",
		name: "Sigil of the Chronos Clock",
		description:
			"An intricate clockwork sigil that seems to move slightly out of sync with the current second. It represents the System's control over temporal sequences.",
		effect_description:
			"Once per day, when you take an action, you can trigger 'Temporal Overclock' to immediately take another action. After doing so, you are stunned until the start of your next turn.",
		rune_type: "utility",
		rune_category: "Tactical",
		rune_level: 15,
		rarity: "legendary",
		effect_type: "active",
		requires_level: 15,
		can_inscribe_on: ["accessory", "headwear"],
		active_feature: {
			name: "Temporal Overclock",
			description:
				"Take an extra action immediately, then become stunned until next turn.",
			action_type: "special",
			duration: "Instant",
			condition: "Stunned (after use)",
		},
		tags: ["time", "tactical", "overclock"],
		image: "/generated/sigils/arcane-sigil.webp",
	},
];
