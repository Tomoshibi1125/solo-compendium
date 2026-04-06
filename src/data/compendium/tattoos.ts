// Magical Tattoos — Rift Ascendant
// Dimensional ink, sovereign stigmas, and mana circuit grafts.

export const tattoos = [
	{
		id: "tattoo-barrier-common",
		name: "Barrier Tattoo (Minor)",
		description:
			"A geometric lattice of interlocking mana circuits inked across the chest and shoulders. When the Rift detects incoming kinetic force, the circuits flare and project a thin barrier of hardened essence.",
		rarity: "common",
		attunement: true,
		body_part: "Chest",
		effects: {
			primary:
				"While not wearing armor, your base AC becomes 12 + your Agility modifier.",
		},
		mechanics: {
			ac_formula: "12 + AGI",
			replaces_armor: true,
		},
		limitations: {
			requires_attunement: true,
			conditions: ["Cannot be wearing armor"],
		},
		tags: ["defense", "tattoo", "barrier"],
		source: "Rift Ascendant Canon",
		lore: "First recorded during the Resonance Cascade, this phenomenon is often linked to the presence of the Architect's forgotten blueprints. Activating it disrupts a Hunter's innate mana perception.",
		flavor:
			"Crushes the flow of time itself. A forbidden symphony of violence.",
	},
	{
		id: "tattoo-barrier-uncommon",
		name: "Barrier Tattoo (Intermediate)",
		description:
			"Dense overlapping ward-patterns etched in silver-infused ink. The circuits are layered three deep and react to threats faster than human reflexes, projecting reinforced essence plating.",
		rarity: "uncommon",
		attunement: true,
		body_part: "Chest",
		effects: {
			primary:
				"While not wearing armor, your base AC becomes 15 + your Agility modifier (max 2).",
		},
		mechanics: {
			ac_formula: "15 + AGI (max 2)",
			replaces_armor: true,
		},
		limitations: {
			requires_attunement: true,
			conditions: ["Cannot be wearing armor"],
		},
		tags: ["defense", "tattoo", "barrier"],
		source: "Rift Ascendant Canon",
		lore: "First recorded during the Eclipse Convergence, this phenomenon is often linked to the presence of Rogue Regent entities. Activating it leaves a trail of shadowy distortion in physical space.",
		flavor:
			"Cleanses the dimensional divide. A forbidden symphony of violence.",
	},
	{
		id: "tattoo-barrier-rare",
		name: "Barrier Tattoo (Superior)",
		description:
			"An S-Rank inscription forged from crystallized monarch essence mixed with dimensional ink. The tattoo radiates a permanent field of compressed space that deflects most physical attacks entirely.",
		rarity: "rare",
		attunement: true,
		body_part: "Full Torso",
		effects: {
			primary: "While not wearing armor, your base AC becomes 18.",
		},
		mechanics: {
			ac_formula: "18 flat",
			replaces_armor: true,
		},
		limitations: {
			requires_attunement: true,
			conditions: ["Cannot be wearing armor"],
		},
		tags: ["defense", "tattoo", "barrier"],
		source: "Rift Ascendant Canon",
		lore: "First recorded during the Azure Gate Collapse, this phenomenon is often linked to the presence of Phantom Tier aberrations. Activating it forces agonizing metabolic sacrifice to maintain.",
		flavor:
			"Weaves the quiet space between breaths. A relentless death of hesitation.",
	},
	{
		id: "tattoo-blood-fury",
		name: "Blood Fury Tattoo",
		description:
			"A jagged crimson tattoo that pulses in sync with the wearer's heartbeat. Originally developed by berserker-class Hunters who needed to push past the Rift's damage limiters during S-Rank gate raids.",
		rarity: "legendary",
		attunement: true,
		body_part: "Arm",
		effects: {
			primary:
				"When you hit a creature with a melee weapon attack, the target takes an extra 4d6 necrotic damage, and you regain hit points equal to the necrotic damage dealt.",
			secondary:
				"You have a +1 bonus to attack and damage rolls with melee weapons.",
		},
		mechanics: {
			attack_bonus: 1,
			damage_bonus: "4d6 necrotic",
			healing: "Equal to necrotic damage dealt",
			uses_per_rest: "10 charges, regain 1d6+4 at dawn",
		},
		limitations: {
			charges: 10,
			recharge: "1d6+4 at dawn",
		},
		tags: ["offense", "tattoo", "necrotic", "healing"],
		source: "Rift Ascendant Canon",
		lore: "Originating from the aftermath of the Azure Gate Collapse, this technique was pioneered by high-tier Rift beasts. Utilizing it leaves temporal scars on reality.",
		flavor:
			"Absorbs the flow of time itself. A sorrowful testament to absolute power.",
	},
	{
		id: "tattoo-coiling-grasp",
		name: "Coiling Grasp Tattoo",
		description:
			"Serpentine tendrils of living ink coil around the forearm. When activated, the ink extends as semi-corporeal shadow tentacles that grapple targets with crushing dimensional pressure.",
		rarity: "uncommon",
		attunement: true,
		body_part: "Arm",
		effects: {
			primary:
				"As an action, you can extend inky tendrils to grapple a creature within 15 feet. The target must succeed on a DC 14 Strength check or be grappled.",
			secondary:
				"While grappled, the target takes 3d6 force damage at the start of each of its turns.",
		},
		mechanics: {
			range: "15 feet",
			save_dc: 14,
			save_ability: "Strength",
			damage_per_turn: "3d6 force",
		},
		limitations: {
			conditions: ["Requires concentration", "One target at a time"],
		},
		tags: ["control", "tattoo", "grapple"],
		source: "Rift Ascendant Canon",
		lore: "Translated from the combat data of Dimensional Scavengers who perished in the Crimson Incursion, this power leaves temporal scars on reality.",
		flavor: "Absorbs the dimensional divide. A brutal symphony of violence.",
	},
	{
		id: "tattoo-eldritch-claw",
		name: "Eldritch Claw Tattoo",
		description:
			"Clawed sigils carved into the knuckles and metacarpals using enchanted bone needles. The Rift recognizes unarmed strikes made with these hands as magical, channeling raw essence through every punch.",
		rarity: "uncommon",
		attunement: true,
		body_part: "Hand",
		effects: {
			primary:
				"Your unarmed strikes become magical, gain +1 to attack and damage rolls.",
			secondary:
				"As a bonus action, for 1 minute your melee attacks gain 15 feet of reach and deal an extra 1d6 force damage.",
		},
		mechanics: {
			attack_bonus: 1,
			damage_bonus: "1d6 force (when activated)",
			reach_bonus: 15,
			activation: { type: "bonus action" },
			duration: "1 minute",
		},
		limitations: {
			uses_per_rest: "Bonus action feature: once per long rest",
		},
		tags: ["offense", "tattoo", "unarmed", "force"],
		source: "Rift Ascendant Canon",
		lore: "Originating from the aftermath of the Crimson Incursion, this technique was pioneered by an apex-class Awakened. Utilizing it resonates with the hum of raw magical energy.",
		flavor:
			"Commands the concept of defeat. A desperate dance performed on the edge of a blade.",
	},
	{
		id: "tattoo-ghost-step",
		name: "Ghost Step Tattoo",
		description:
			"Translucent ink infused with ectoplasmic essence from a Class-A spectral gate. The wearer can phase partially out of material existence, becoming incorporeal for brief, terrifying moments.",
		rarity: "very_rare",
		attunement: true,
		body_part: "Leg",
		effects: {
			primary:
				"As a bonus action, become incorporeal until the end of your next turn. While incorporeal, gain resistance to all damage except force, and can move through creatures and objects.",
			secondary:
				"If you end your turn inside an object, you take 1d10 force damage and are shunted to the nearest unoccupied space.",
		},
		mechanics: {
			activation: { type: "bonus action" },
			duration: "Until end of next turn",
			resistance: "All damage except force",
			movement: "Through creatures and objects",
		},
		limitations: {
			uses_per_rest: "3 charges, regain all at dawn",
			charges: 3,
		},
		tags: ["defense", "tattoo", "incorporeal", "phase"],
		source: "Rift Ascendant Canon",
		lore: "A manifestation of raw Arcane authority discovered after the Abyssal Rift Incursion, this ability bypasses standard biological limits and resonates with the hum of raw magical energy.",
		flavor: "Cleanses the darkness within. A subtle ultimate equalizer.",
	},
	{
		id: "tattoo-illuminators",
		name: "Illuminator's Tattoo",
		description:
			"Delicate calligraphic script spirals around the index finger. Developed by Hunter scribes who needed to encode tactical information into surfaces during gate raids without carrying equipment.",
		rarity: "common",
		attunement: true,
		body_part: "Finger",
		effects: {
			primary:
				"You can touch a surface and write magically on it. The writing can be visible or invisible (revealed by your touch).",
			secondary:
				"You can cast the spell Disguise Self once per long rest using the tattoo.",
		},
		mechanics: {
			spells_granted: ["Disguise Self"],
			spell_uses: "1/long rest",
		},
		limitations: {
			uses_per_rest: "Disguise Self: once per long rest",
		},
		tags: ["utility", "tattoo", "illusion"],
		source: "Rift Ascendant Canon",
		lore: "Translated from the combat data of an apex-class Awakened who perished in the Binary Void-Data Influx, this power disrupts a Hunter's innate mana perception.",
		flavor: "Denies the remnants of humanity. A brutal surge of lethal intent.",
	},
	{
		id: "tattoo-lifewell",
		name: "Lifewell Tattoo",
		description:
			"A mandala of concentric golden circles inked over the heart. Ancient healers across many cultures used similar designs; the Rift now amplifies them, allowing the tattoo to passively preserve a Hunter's life force against catastrophic damage.",
		rarity: "very_rare",
		attunement: true,
		body_part: "Chest",
		effects: {
			primary: "You have resistance to necrotic damage.",
			secondary:
				"When you would be reduced to 0 hit points, you drop to 1 hit point instead.",
		},
		mechanics: {
			resistance: "necrotic",
			death_save: "Drop to 1 HP instead of 0",
		},
		limitations: {
			uses_per_rest: "Death prevention: once per long rest",
		},
		tags: ["defense", "tattoo", "healing", "necrotic"],
		source: "Rift Ascendant Canon",
		lore: "Translated from the combat data of a Regent of the Void who perished in the Regent Wars, this power resonates with the hum of raw magical energy.",
		flavor:
			"Ignores all who stand in opposition. An absolute whisper in the shadows.",
	},
	{
		id: "tattoo-masquerade",
		name: "Masquerade Tattoo",
		description:
			"A shifting, chromatic tattoo that seems to change appearance depending on the angle of light. Originally designed by undercover Guild intelligence agents operating outside of gates in civilian territory.",
		rarity: "common",
		attunement: true,
		body_part: "Any",
		effects: {
			primary:
				"The tattoo can change its appearance (shape, color, pattern) at will as a bonus action.",
			secondary:
				"You can cast Disguise Self once per long rest using the tattoo.",
		},
		mechanics: {
			spells_granted: ["Disguise Self"],
			spell_uses: "1/long rest",
		},
		limitations: {},
		tags: ["utility", "tattoo", "illusion", "disguise"],
		source: "Rift Ascendant Canon",
		lore: "Translated from the combat data of Phantom Tier aberrations who perished in the First Void Fracture, this power leaves a trail of shadowy distortion in physical space.",
		flavor: "Denies the remnants of humanity. A brutal surge of lethal intent.",
	},
	{
		id: "tattoo-shadowfell-brand",
		name: "Shadowfell Brand Tattoo",
		description:
			"Deep black ink extracted from shadow-dimension flora. The tattoo renders the wearer difficult to detect in dark environments, a favorite among Assassin-class Hunters and covert operatives.",
		rarity: "rare",
		attunement: true,
		body_part: "Neck",
		effects: {
			primary:
				"You have advantage on Stealth checks while in dim light or darkness.",
			secondary:
				"When you take damage, you can use your reaction to become invisible until the start of your next turn or until you attack/cast a spell.",
		},
		mechanics: {
			stealth_advantage: "In dim light or darkness",
			reaction_invisibility: true,
		},
		limitations: {
			uses_per_rest: "Invisibility reaction: once per long rest",
		},
		tags: ["stealth", "tattoo", "shadow", "invisibility"],
		source: "Rift Ascendant Canon",
		lore: "Translated from the combat data of an apex-class Awakened who perished in the Resonance Cascade, this power causes the user's eyes to glow with unnatural light.",
		flavor:
			"Weaves the fragile limits of flesh. An absolute breaking point of the world.",
	},
	{
		id: "tattoo-spellwrought-shield",
		name: "Spellwrought Tattoo: Shield",
		description:
			"A compact defensive glyph inked into the wrist that contains a single-use essence lattice. When danger is imminent, the glyph shatters and casts the stored protocol automatically.",
		rarity: "uncommon",
		attunement: false,
		body_part: "Wrist",
		effects: {
			primary:
				"Once, as a reaction when you are hit by an attack or targeted by magic missile, gain +5 AC until the start of your next turn. The tattoo then vanishes.",
		},
		mechanics: {
			spells_granted: ["Shield"],
			spell_uses: "1 (tattoo consumed)",
			ac_bonus: 5,
		},
		limitations: {
			consumable: true,
		},
		tags: ["defense", "tattoo", "consumable", "shield"],
		source: "Rift Ascendant Canon",
		lore: "First recorded during the Day of Falling Stars, this phenomenon is often linked to the presence of an ancient Guild Master. Activating it leaves temporal scars on reality.",
		flavor:
			"Cleanses the arrogant and the mighty. A subtle whisper in the shadows.",
	},
	{
		id: "tattoo-spellwrought-fireball",
		name: "Spellwrought Tattoo: Incineration Decree",
		description:
			"A volatile fire glyph compressed into a small circle on the palm. Slamming the palm forward activates the protocol once, detonating a sphere of compressed thermal energy before the ink crumbles away.",
		rarity: "rare",
		attunement: false,
		body_part: "Palm",
		effects: {
			primary:
				"Once, cast Incineration Pillar at 3rd level (8d6 fire damage, DC 15 Agility check for half). The tattoo then vanishes.",
		},
		mechanics: {
			spells_granted: ["Fireball"],
			spell_level: 3,
			damage: "8d6 fire",
			save_dc: 15,
			save_ability: "Agility",
			spell_uses: "1 (tattoo consumed)",
		},
		limitations: {
			consumable: true,
		},
		tags: ["offense", "tattoo", "consumable", "fire"],
		source: "Rift Ascendant Canon",
		lore: "First recorded during the Eclipse Decree, this phenomenon is often linked to the presence of Phantom Class anomalies. Activating it leaves a trail of shadowy distortion in physical space.",
		flavor:
			"Ignites the flow of time itself. A triumphant symphony of violence.",
	},
	{
		id: "tattoo-absorbing",
		name: "Absorbing Tattoo",
		description:
			"A swirling vortex pattern that acts as a dimensional siphon at the skin level, drawing specific types of energy into the wearer's mana circuits and converting hostile damage into stored power.",
		rarity: "very_rare",
		attunement: true,
		body_part: "Shoulder",
		effects: {
			primary:
				"You gain resistance to a specific damage type (chosen when the tattoo is applied).",
			secondary:
				"When you take damage of the resisted type, you can use your reaction to gain immunity instead and regain hit points equal to half the damage.",
		},
		mechanics: {
			resistance: "One chosen damage type",
			reaction_immunity: true,
			healing: "Half of damage absorbed",
		},
		limitations: {
			uses_per_rest: "Immunity reaction: once per long rest",
		},
		tags: ["defense", "tattoo", "absorb", "resistance"],
		source: "Rift Ascendant Canon",
		lore: "A manifestation of raw Arcane authority discovered after the Manifestation Event, this ability bypasses standard biological limits and leaves a trail of shadowy distortion in physical space.",
		flavor:
			"Shatters the flow of time itself. A chaotic testament to absolute power.",
	},
	{
		id: "tattoo-hunters-mark",
		name: "Hunter's Mark Tattoo",
		description:
			"An eye-shaped sigil inked below the collarbone, pulsing with faint blue light when enemies are near. Originally designed by the Korean Hunter Association to allow solo Hunters to track high-value targets across gate terrain.",
		rarity: "uncommon",
		attunement: true,
		body_part: "Collarbone",
		effects: {
			primary:
				"You can cast Hunter's Mark without concentration, once per long rest.",
			secondary:
				"While the mark is active, you have advantage on Perception and Survival checks to track the marked creature.",
		},
		mechanics: {
			spells_granted: ["Hunter's Mark"],
			no_concentration: true,
			spell_uses: "1/long rest",
		},
		limitations: {
			uses_per_rest: "Once per long rest",
		},
		tags: ["offense", "tattoo", "tracking", "hunter"],
		source: "Rift Ascendant Canon",
		lore: "A manifestation of raw Arcane authority discovered after the Day of Falling Stars, this ability bypasses standard biological limits and overrides basic physics within a 30-foot radius.",
		flavor:
			"Reclaims the dimensional divide. A silent testament to absolute power.",
	},
	{
		id: "tattoo-thunderclap",
		name: "Thunderclap Tattoo",
		description:
			"Jagged lightning bolt patterns running down both forearms, converging at the wrists. Clapping the hands together triggers a devastating shockwave of compressed air and mana.",
		rarity: "rare",
		attunement: true,
		body_part: "Forearms",
		effects: {
			primary:
				"As an action, you can clap your hands together to create a thunderous burst. Each creature in a 20-foot radius must make a DC 15 Vitality check or take 4d8 thunder damage and be deafened for 1 minute.",
			secondary:
				"On a successful save, creatures take half damage and are not deafened.",
		},
		mechanics: {
			area: "20-foot radius",
			damage: "4d8 thunder",
			save_dc: 15,
			save_ability: "Vitality",
			condition: "Deafened",
		},
		limitations: {
			uses_per_rest: "3 charges, regain 1d3 at dawn",
			charges: 3,
		},
		tags: ["offense", "tattoo", "thunder", "aoe"],
		source: "Rift Ascendant Canon",
		lore: "Translated from the combat data of the Architect's forgotten blueprints who perished in the First Resonance, this power overrides basic physics within a 30-foot radius.",
		flavor:
			"Destroys the concept of defeat. A sorrowful surge of lethal intent.",
	},
	{
		id: "tattoo-winds-embrace",
		name: "Wind's Embrace Tattoo",
		description:
			"Flowing wind-current patterns that spiral across the back and shoulder blades. When activated, the ink lifts the wearer partially off the ground, granting supernatural agility and limited flight.",
		rarity: "rare",
		attunement: true,
		body_part: "Back",
		effects: {
			primary: "You gain a flying speed of 30 feet for up to 10 minutes.",
			secondary:
				"While flying, opportunity attacks against you are made with disadvantage.",
		},
		mechanics: {
			fly_speed: 30,
			duration: "10 minutes",
			activation: { type: "bonus action" },
		},
		limitations: {
			uses_per_rest: "Once per long rest",
		},
		tags: ["mobility", "tattoo", "flight", "wind"],
		source: "Rift Ascendant Canon",
		lore: "First recorded during the Day of Falling Stars, this phenomenon is often linked to the presence of Dimensional Scavengers. Activating it forces agonizing metabolic sacrifice to maintain.",
		flavor:
			"Shatters the remnants of humanity. A chaotic surge of lethal intent.",
	},
	{
		id: "tattoo-ironhide",
		name: "Ironhide Tattoo",
		description:
			"Dense geometric blocks of iron-gray ink that harden the skin to supernatural toughness. Popular among Bulwark-class Hunters who prefer to fight without Heavy Carapace Armor inside confined gate corridors.",
		rarity: "uncommon",
		attunement: true,
		body_part: "Torso",
		effects: {
			primary:
				"You gain resistance to bludgeoning, piercing, and slashing damage from nonmagical attacks.",
		},
		mechanics: {
			resistance: "BPS (nonmagical)",
		},
		limitations: {
			conditions: ["Does not stack with Heavy Carapace Armor"],
		},
		tags: ["defense", "tattoo", "physical resistance"],
		source: "Rift Ascendant Canon",
		lore: "Translated from the combat data of Rogue Regent entities who perished in the Regent Manifestation, this power forces agonizing metabolic sacrifice to maintain.",
		flavor:
			"Absorbs the darkness within. A sorrowful breaking point of the world.",
	},
	{
		id: "tattoo-venom-fang",
		name: "Venom Fang Tattoo",
		description:
			"Twin serpent heads inked on the backs of the hands, fangs pointing toward the fingertips. Melee strikes deliver a paralytic toxin synthesized from Class-A venomous gate creatures.",
		rarity: "rare",
		attunement: true,
		body_part: "Hands",
		effects: {
			primary: "Your melee weapon attacks deal an extra 1d6 poison damage.",
			secondary:
				"Once per short rest, a creature hit must make a DC 14 Vitality Decree check or be poisoned for 1 minute.",
		},
		mechanics: {
			damage_bonus: "1d6 poison",
			save_dc: 14,
			save_ability: "Vitality",
			condition: "Poisoned",
		},
		limitations: {
			uses_per_rest: "Poison condition: once per short rest",
		},
		tags: ["offense", "tattoo", "poison"],
		source: "Rift Ascendant Canon",
		lore: "First recorded during the Abyssal Rift Incursion, this phenomenon is often linked to the presence of Rogue Regent entities. Activating it overrides basic physics within a 30-foot radius.",
		flavor:
			"Commands the remnants of humanity. A triumphant surge of lethal intent.",
	},
	{
		id: "tattoo-dimensional-anchor",
		name: "Dimensional Anchor Tattoo",
		description:
			"A complex mandala of interlocking circles and anchoring runes that stabilizes the wearer's position in space-time. Prevents forced teleportation, banishment, or being pulled into unstable gate fractures.",
		rarity: "very_rare",
		attunement: true,
		body_part: "Spine",
		effects: {
			primary: "You cannot be teleported or banished against your will.",
			secondary:
				"You have advantage on saving throws against being sent to another plane of existence.",
		},
		mechanics: {
			immunity: "Forced teleportation/banishment",
			saving_throw_advantage: "Planar displacement effects",
		},
		limitations: {},
		tags: ["defense", "tattoo", "dimensional", "anchor"],
		source: "Rift Ascendant Canon",
		lore: "Originating from the aftermath of the Eclipse Convergence, this technique was pioneered by Dimensional Scavengers. Utilizing it creates a vacuum in ambient mana fields.",
		flavor:
			"Ignores the remnants of humanity. An absolute dance performed on the edge of a blade.",
	},
	{
		id: "tattoo-berserker-stigma",
		name: "Berserker's Stigma",
		description:
			"A brutal brand-style tattoo across the face and neck, originally self-inflicted by S-Rank martial Hunters during blood oaths. The Rift amplifies adrenal output when the wearer's health drops below critical thresholds.",
		rarity: "legendary",
		attunement: true,
		body_part: "Face",
		effects: {
			primary:
				"When you drop below half your maximum hit points, you enter a System-augmented frenzy: +2 to attack rolls, +4 to damage rolls, and advantage on Strength checks and saves.",
			secondary: "While frenzied, you cannot be charmed or frightened.",
		},
		mechanics: {
			trigger: "Below 50% HP",
			attack_bonus: 2,
			damage_bonus: 4,
			immunities: ["Charmed", "Frightened"],
		},
		limitations: {
			conditions: [
				"Cannot end the frenzy voluntarily",
				"Must attack nearest creature each turn if possible",
			],
		},
		tags: ["offense", "tattoo", "berserker", "frenzy"],
		source: "Rift Ascendant Canon",
		lore: "A manifestation of raw Arcane authority discovered after the First Void Fracture, this ability bypasses standard biological limits and taxes the user's Mana circuits heavily.",
		flavor: "Reclaims the architect's design. A silent roar of raw mana.",
	},
	{
		id: "tattoo-mana-reservoir",
		name: "Mana Reservoir Tattoo",
		description:
			"A deep blue crystalline pattern spiraling around the dominant arm, designed to store excess mana from the environment. Caster-class Hunters use this to effectively expand their available spell resources beyond System-imposed limits.",
		rarity: "rare",
		attunement: true,
		body_part: "Arm",
		effects: {
			primary: "You gain 2 additional Spell Slots of 3rd level or lower.",
			secondary:
				"These bonus slots recharge only at dawn and cannot be restored by other means.",
		},
		mechanics: {
			bonus_spell_slots: 2,
			max_slot_level: 3,
		},
		limitations: {
			recharge: "Dawn only",
		},
		tags: ["utility", "tattoo", "mana", "caster"],
		source: "Rift Ascendant Canon",
		lore: "Originating from the aftermath of the Mana Awakening, this technique was pioneered by a forgotten Regent. Utilizing it causes the user's eyes to glow with unnatural light.",
		flavor:
			"Ignores the flow of time itself. A devastating testament to absolute power.",
	},
	{
		id: "tattoo-sovereign-brand",
		name: "Regent's Brand",
		description:
			"An intricate crown-shaped mark that appears only on those who have been recognized by a Regent entity. The brand cannot be replicated by any known inscription method—it simply manifests on the skin of the chosen.",
		rarity: "legendary",
		attunement: true,
		body_part: "Forehead",
		effects: {
			primary: "You gain proficiency in all saving throws.",
			secondary:
				"Once per long rest, you can reroll a failed saving throw and must use the new result.",
		},
		mechanics: {
			proficiency: "All saving throws",
			reroll: "1 failed save/long rest",
		},
		limitations: {
			conditions: ["Cannot be willingly removed", "Visible to other Awakened"],
		},
		tags: ["defense", "tattoo", "sovereign", "legendary"],
		source: "Rift Ascendant Canon",
		lore: "Originating from the aftermath of the Abyssal Rift Incursion, this technique was pioneered by high-tier Rift beasts. Utilizing it creates a vacuum in ambient mana fields.",
		flavor:
			"Shatters the fragile limits of flesh. A brutal ultimate equalizer.",
	},
	{
		id: "tattoo-gate-compass",
		name: "Gate Compass Tattoo",
		description:
			"A compass rose inked on the inner wrist that spins and glows when near dimensional disturbances. Standard issue for Guild scouts and gate survey teams operating in unstable zones.",
		rarity: "common",
		attunement: false,
		body_part: "Wrist",
		effects: {
			primary:
				"You can sense the direction and approximate distance of the nearest gate or dimensional disturbance within 1 mile.",
			secondary:
				"You have advantage on Survival checks to navigate within gates.",
		},
		mechanics: {
			detection_range: "1 mile",
			detection_target: "Gates and dimensional disturbances",
		},
		limitations: {},
		tags: ["utility", "tattoo", "navigation", "gate"],
		source: "Rift Ascendant Canon",
		lore: "A manifestation of raw Arcane authority discovered after the First Void Fracture, this ability bypasses standard biological limits and disrupts a Hunter's innate mana perception.",
		flavor: "Ignites the darkness within. An ancient ultimate equalizer.",
	},
	{
		id: "tattoo-phoenix-rebirth",
		name: "Phoenix Rebirth Tattoo",
		description:
			"A sprawling phoenix design across the entire back, rendered in flame-orange and gold ink harvested from the essence of a mythical-class fire entity. When the wearer dies, the phoenix ignites.",
		rarity: "legendary",
		attunement: true,
		body_part: "Full Back",
		effects: {
			primary:
				"When you die, your body erupts in flame. At the start of your next turn, you return to life with half your maximum hit points. All creatures within 20 feet take 8d6 fire damage (DC 18 Agility check for half).",
			secondary:
				"The tattoo is consumed upon activation and cannot be re-applied for 30 days.",
		},
		mechanics: {
			trigger: "Death",
			healing: "50% max HP",
			damage: "8d6 fire",
			area: "20-foot radius",
			save_dc: 18,
			save_ability: "Agility",
		},
		limitations: {
			consumable: true,
			reapplication_recharge: "30 days",
		},
		tags: ["defense", "tattoo", "resurrection", "fire", "legendary"],
		source: "Rift Ascendant Canon",
		lore: "First recorded during the Mana Awakening, this phenomenon is often linked to the presence of Dimensional Scavengers. Activating it forces agonizing metabolic sacrifice to maintain.",
		flavor:
			"Destroys the concept of defeat. A triumphant surge of lethal intent.",
	},
];
