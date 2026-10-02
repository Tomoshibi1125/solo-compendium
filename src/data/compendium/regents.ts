import { getRegentPortraitUrl } from "@/data/compendium/regentPortraits";
import { materializeCanonicalRegentLedger } from "@/lib/regentProgression";
import type { Regent } from "@/lib/regentTypes";

// --- Shared rank-S regent progressions (full independent overlay, à la Umbral) ---
// Regents grant their own full caster / martial progression ON TOP of the base
// job. Known counts are tuned to stay within the resolvable, regent-tagged
// compendium pools (verified: every caster resolves >= its spells_known at each
// level via regentAbilityAccess grants), so a regent overlay never demands more
// picks than are available.
const REGENT_FULL_CASTER_SLOTS: Record<string, number[]> = {
	"1st": [4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4],
	"2nd": [2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4],
	"3rd": [0, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4],
	"4th": [0, 0, 0, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4],
	"5th": [0, 0, 0, 0, 1, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4],
	"6th": [0, 0, 0, 0, 0, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4],
	"7th": [0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4],
	"8th": [0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 4],
	"9th": [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 4],
};
const REGENT_CANTRIPS_KNOWN = [
	4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
];
const REGENT_SPELLS_KNOWN = [
	6, 7, 9, 10, 12, 14, 15, 15, 15, 18, 19, 19, 20, 22, 22, 24, 24, 25, 26, 27,
];
const REGENT_POWERS_KNOWN = [
	2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8,
];
const REGENT_TECHNIQUES_KNOWN = [
	2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8,
];

export const regents: Regent[] = [
	{
		id: "umbral_regent",
		name: "Umbral Regent",
		title: "Umbral (Regent of Shadows)",
		theme: "Umbral and Death",
		description:
			"The ultimate umbral manifestation Ascendant class overlay, sharing the ascendant power of Kael Voss, the Weaver of the Absolute. You embody mastery over the veil and the ability to 'Resurge' an infinite legion of Umbral Echoes. This is the highest tier veil-based Ascendant class, granting true Eternal-tier authority over the shadow realm to protect the timeline in the name of the Prime Eternal.",
		rank: "S",
		image: getRegentPortraitUrl("umbral_regent"),
		type: "ascendant-class-overlay",
		tags: [
			"regent",
			"umbral",
			"death",
			"ascendant-class-overlay",
			"shadow-soldier-command",
		],
		created_at: "2026-01-13T22:03:39.601Z",
		source_book: "Rift Ascendant Canon",
		flavor:
			"A specialized manifestation of Regent Resonance. This form allows the caster to weave the Umbral Regent into an Absolute Decree.",
		lore: "The Umbral Regent is an Ascendant class overlay that represents the pinnacle of its respective domain. Its historical records are sealed by the Wardens.",
		hit_dice: "1d12",
		primary_ability: ["Presence", "Sense"],
		saving_throws: ["Sense", "Presence"],
		skill_proficiencies: [
			"Stealth",
			"Intimidation",
			"Mana Flow",
			"Cosmic Lore",
		],
		armor_proficiencies: [
			"Light Mana-Weave Armor",
			"Medium Aether Armor",
			"Mana Shields",
		],
		weapon_proficiencies: ["Awakened Weapons", "Rift-Forged Weapons"],
		tool_proficiencies: [],
		class_features: [
			{
				level: 1,
				name: "Umbral Command",
				description:
					"Command up to 20 umbral creatures as if they were your loyal followers. They obey your telepathic commands.",
				type: "action",
				frequency: "at-will",
			},
			{
				level: 1,
				name: "Veilstep Supreme",
				description:
					"As a bonus action, teleport up to 120 feet to any unoccupied space in dim light or darkness.",
				type: "bonus-action",
				frequency: "at-will",
			},
			{
				level: 1,
				name: "Umbral Dominion",
				description:
					"You gain immunity to necrotic damage and advantage on all saving throws against umbral effects.",
				type: "passive",
			},
			{
				level: 2,
				name: "Essence Harvest",
				description:
					"When a creature dies within 30 feet, you can harvest its essence to regain 2d10 hit points.",
				type: "reaction",
				frequency: "short-rest",
			},
			{
				level: 2,
				name: "Regent's Presence",
				description:
					"Frightening presence: enemies within 30 feet must make a Sense saving throw (DC 18) or be frightened of you.",
				type: "passive",
			},
			{
				level: 3,
				name: "Legion of the Veil",
				description:
					"As an action, once per long rest, you summon a number of Umbral Legionnaires from the compendium up to your umbral energy maximum at your current level. Each summoned soldier obeys your telepathic commands and persists until you dismiss it (no action), it drops to 0 hit points, or you finish a long rest. Track each as a row in your Umbral Legion panel (character_umbral_legionnaires). You can have at most one copy of any individual soldier extracted at a time.",
				type: "action",
				frequency: "long-rest",
			},
			{
				level: 3,
				name: "Umbral Mastery",
				description:
					"You can cast umbral spells at will without expending spell slots.",
				type: "passive",
			},
			{
				level: 4,
				name: "Army of the Damned",
				description:
					"Your umbral energy maximum increases by 50, letting you sustain a larger legion. Additionally, once per long rest as an action, every Umbral Legionnaire you have summoned immediately takes the Attack action against the nearest hostile creature it can reach.",
				type: "action",
				frequency: "long-rest",
			},
			{
				level: 5,
				name: "Dimensional Regent",
				description:
					"You can cast Rift and plane shift without expending spell slots. You have advantage on saving throws against teleportation effects.",
				type: "passive",
			},
			{
				level: 5,
				name: "Dimensional Authority",
				description:
					"You can travel between planes at will and control dimensional Rifts.",
				type: "passive",
			},
			{
				level: 6,
				name: "Essence Lord",
				description:
					"You can harvest the essence of any creature, gaining their memories and abilities temporarily.",
				type: "action",
				frequency: "short-rest",
			},
			{
				level: 7,
				name: "Umbral Dominion Field",
				description:
					"As an action, once per long rest, you extend your umbral authority over a 60-foot radius centered on you for 1 minute. While active, all Umbral Legionnaires you have summoned within the radius gain advantage on attack rolls. Enemies in the area that start their turn there must succeed on a Sense saving throw against your Regent save DC (8 + proficiency bonus + your primary ability modifier) or be frightened of you until the end of their next turn.",
				type: "action",
				frequency: "long-rest",
			},
			{
				level: 7,
				name: "Umbral God",
				description:
					"You become a living embodiment of the veil, able to shape umbral essence at will.",
				type: "passive",
			},
			{
				level: 8,
				name: "Death's Command",
				description:
					"You can command any anomaly creature, regardless of its origin or power.",
				type: "action",
				frequency: "at-will",
			},
			{
				level: 9,
				name: "Death's Authority",
				description:
					"As an action, force all anomaly within 300 feet to make a Sense save (DC 20) or become your loyal servants.",
				type: "action",
				frequency: "once-per-day",
			},
			{
				level: 9,
				name: "Umbral Emperor",
				description:
					"Your umbral powers extend across multiple planes, allowing you to affect the veil anywhere.",
				type: "passive",
			},
			{
				level: 10,
				name: "Absolute Umbral",
				description:
					"You achieve the ultimate umbral power, becoming immune to all effects and able to reshape reality through the veil.",
				type: "passive",
			},
			{
				level: 11,
				name: "Umbral Ascendant",
				description:
					"You transcend mortal limitations, gaining the ability to exist in multiple planes simultaneously and command shadows across dimensions.",
				type: "passive",
			},
			{
				level: 11,
				name: "Dimensional Lord",
				description:
					"You gain complete control over dimensional travel, able to create permanent portals and reshape dimensional boundaries.",
				type: "passive",
			},
			{
				level: 11,
				name: "Death God",
				description:
					"You become a living embodiment of death, able to command all anomaly and determine the fate of souls.",
				type: "passive",
			},
			{
				level: 12,
				name: "Regent Attribute Enhancement",
				description:
					"Your primary and secondary attributes increase by +2, reflecting your growing Regent power.",
				type: "passive",
				mechanics: {
					stat_bonuses: { presence: 2, sense: 2 },
				},
			},
			{
				level: 13,
				name: "Umbral Apocalypse",
				description:
					"Once per day, you can unleash a shadow apocalypse that covers a 10-mile radius in absolute darkness, where only you and your umbral creatures can see.",
				type: "action",
				frequency: "once-per-day",
			},
			{
				level: 13,
				name: "Void Dominion",
				description:
					"You gain control over the void itself, able to create pockets of nothingness that erase matter and energy.",
				type: "action",
				frequency: "at-will",
			},
			{
				level: 13,
				name: "Essence God",
				description:
					"You can harvest and manipulate the essence of any being, gaining their memories, abilities, and power permanently.",
				type: "action",
				frequency: "long-rest",
			},
			{
				level: 14,
				name: "Regent Power Resonance",
				description:
					"Your Regent abilities reach a new peak. Your Umbral Legion panel gains an additional extraction slot, allowing you to extract one more Legionnaire of any rank. Additionally, once per long rest, when a Legionnaire you control would drop to 0 hit points, you can spend your reaction to instead bring them to 1 hit point.",
				type: "passive",
			},
			{
				level: 15,
				name: "Umbral Reality",
				description:
					"You can reshape reality itself through shadows, creating alternate dimensions and rewriting physical laws.",
				type: "action",
				frequency: "long-rest",
			},
			{
				level: 15,
				name: "Dimensional God",
				description:
					"You become a master of all dimensions, able to create, destroy, and reshape entire planes of existence.",
				type: "passive",
			},
			{
				level: 15,
				name: "Death Emperor",
				description:
					"Your command over death extends across all realities, allowing you to resurrect or destroy any being at will.",
				type: "action",
				frequency: "once-per-day",
			},
			{
				level: 16,
				name: "Regent Attribute Enhancement",
				description:
					"Your primary and secondary attributes increase by another +2.",
				type: "passive",
				mechanics: {
					stat_bonuses: { presence: 2, sense: 2 },
				},
			},
			{
				level: 17,
				name: "Umbral Transcendence",
				description:
					"You transcend the concept of shadows, becoming a fundamental force of the universe that cannot be contained or destroyed.",
				type: "passive",
			},
			{
				level: 17,
				name: "Void God",
				description:
					"You gain mastery over nothingness itself, able to erase concepts, memories, and even existence from reality.",
				type: "action",
				frequency: "once-per-day",
			},
			{
				level: 17,
				name: "Essence Emperor",
				description:
					"You can absorb and control the essence of entire worlds, gaining the collective power of civilizations.",
				type: "passive",
			},
			{
				level: 18,
				name: "Regent Power Resonance",
				description:
					"Your Regent powers reach their peak resonance. Your umbral energy maximum increases by a further 50 (total +100 from level 4 and this). Legion members you command within 60 feet of you deal an additional 1d8 necrotic damage on each successful attack.",
				type: "passive",
			},
			{
				level: 19,
				name: "Umbral Omnipotence",
				description:
					"You achieve true omnipotence within the umbral domain, able to control all umbral creatures across all timelines and realities simultaneously.",
				type: "passive",
			},
			{
				level: 19,
				name: "Dimensional Emperor",
				description:
					"Your dimensional power extends across the multiverse, allowing you to create and destroy entire universes.",
				type: "passive",
			},
			{
				level: 19,
				name: "Death Regent",
				description:
					"You become the ultimate authority over death and life, able to determine the fate of all existence.",
				type: "passive",
			},
			{
				level: 20,
				name: "Umbral Supremacy",
				description:
					"You achieve absolute supremacy over all shadows, becoming the source and master of all shadow power in existence.",
				type: "passive",
			},
			{
				level: 20,
				name: "Absolute Umbral Apotheosis",
				description:
					"You become the embodiment of absolute shadow, a force beyond comprehension that exists outside all laws of reality. All Umbral Legionnaires you command gain maximum hit points equal to twice their listed value and deal double damage. Your Veilstep Supreme now has a range of 300 feet and can be used to swap positions with any summoned Legionnaire.",
				type: "passive",
			},
			{
				level: 20,
				name: "Ultimate Umbral Power",
				description:
					"You achieve the full power of the Umbral Regent at peak performance - the ability to command infinite shadow armies and master death itself.",
				type: "passive",
			},
		],
		spellcasting: {
			ability: "Presence",
			spell_slots: {
				"1st": [4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4],
				"2nd": [2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4],
				"3rd": [0, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4],
				"4th": [0, 0, 0, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4],
				"5th": [0, 0, 0, 0, 1, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4],
				"6th": [0, 0, 0, 0, 0, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4],
				"7th": [0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4],
				"8th": [0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 4],
				"9th": [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 4],
			},
			cantrips_known: [
				4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
			],
			spells_known: [
				6, 7, 9, 10, 12, 14, 15, 15, 15, 18, 19, 19, 20, 22, 22, 24, 24, 25, 26,
				27,
			],
			spell_preparation: false,
			additional_spells: [
				"spell-sup-0-3-grave-chill",
				"spell-sup-1-21-psychic-lance",
				"spell-sup-1-33-necrotic-shroud",
				"spell-sup-4-74-dimensional-anchor",
				"spell-sup-5-136-rift-walk",
			],
		},
		progression_table: {
			"1": {
				features_gained: [
					"Umbral Command",
					"Veilstep Supreme",
					"Umbral Dominion",
				],
				abilities_improved: [],
			},
			"2": {
				features_gained: ["Essence Harvest", "Regent's Presence"],
				abilities_improved: [],
			},
			"3": {
				features_gained: ["Legion of the Veil", "Umbral Mastery"],
				abilities_improved: [],
			},
			"4": {
				features_gained: ["Army of the Damned"],
				abilities_improved: ["Primary Ability +2"],
			},
			"5": {
				features_gained: ["Dimensional Regent", "Dimensional Authority"],
				abilities_improved: [],
			},
			"6": {
				features_gained: ["Essence Lord"],
				abilities_improved: [],
			},
			"7": {
				features_gained: ["Umbral Dominion Field", "Umbral God"],
				abilities_improved: [],
			},
			"8": {
				features_gained: ["Death's Command"],
				abilities_improved: ["Primary Ability +2"],
			},
			"9": {
				features_gained: ["Death's Authority", "Umbral Emperor"],
				abilities_improved: [],
			},
			"10": {
				features_gained: ["Absolute Umbral"],
				abilities_improved: [],
			},
			"11": {
				features_gained: ["Umbral Ascendant", "Dimensional Lord", "Death God"],
				abilities_improved: [],
			},
			"12": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"13": {
				features_gained: ["Umbral Apocalypse", "Void Dominion", "Essence God"],
				abilities_improved: [],
			},
			"14": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"15": {
				features_gained: ["Umbral Reality", "Dimensional God", "Death Emperor"],
				abilities_improved: [],
			},
			"16": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"17": {
				features_gained: [
					"Umbral Transcendence",
					"Void God",
					"Essence Emperor",
				],
				abilities_improved: [],
			},
			"18": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"19": {
				features_gained: [
					"Umbral Omnipotence",
					"Dimensional Emperor",
					"Death Regent",
				],
				abilities_improved: [],
			},
			"20": {
				features_gained: [
					"Umbral Supremacy",
					"Absolute Umbral Apotheosis",
					"Ultimate Umbral Power",
				],
				abilities_improved: ["Primary Ability +2"],
			},
		},
		regent_requirements: {
			level: 5,
			abilities: {
				presence: 13,
				sense: 13,
			},
			quest_completion: "Complete the Umbral Regent Ascension quest series",
			warden_approval: true,
		},
		requirements: {
			quest_completion: "Complete the Umbral Regent Ascension quest series",
			warden_verification: true,
			prerequisite_job: "Any base job",
		},
		mechanics: {
			stat_bonuses: {
				strength: 4,
				agility: 4,
				vitality: 4,
				intelligence: 4,
				sense: 4,
				presence: 4,
			},
			special_abilities: [
				"Immune to fear and charm effects",
				"Can see perfectly in magical and non-magical darkness",
				"Shadow creatures are automatically friendly toward you",
				"Can communicate with shadows and umbral creatures",
			],
			restrictions: [
				"Requires Warden verification of quest completion",
				"Once chosen, cannot be changed without Warden approval",
			],
		},
	},
	{
		id: "radiant_regent",
		spellcasting: {
			ability: "Presence",
			spell_slots: REGENT_FULL_CASTER_SLOTS,
			cantrips_known: REGENT_CANTRIPS_KNOWN,
			spells_known: REGENT_SPELLS_KNOWN,
			spell_preparation: false,
			additional_spells: [
				"spell-sup-0-10-oath-flare",
				"spell-sup-1-16-mana-bolt",
				"spell-sup-2-42-triple-ignition",
				"spell-sup-6-97-disintegration-beam",
				"spell-sup-8-110-absolute-sunburst",
			],
		},
		name: "Radiant Regent",
		title: "Radiant Regent (Regent of White Flames)",
		theme: "White Flames and Purification",
		description:
			"The ultimate manifestation of purification fire, sharing a fragment of Solara, the Brightest Fragment. You command the sacred 'Exarch's Authority' that incinerates corruption and illuminates the darkest depths of the realms. As a vessel of the Radiant Warden, you are tasked with stabilizing the Rifts and purging the void-noise from reality.",
		rank: "S",
		image: getRegentPortraitUrl("radiant_regent"),
		type: "ascendant-class-overlay",
		tags: ["regent", "radiant", "white-flames", "purification", "fire"],
		created_at: "2026-01-13T22:03:39.601Z",
		source_book: "Rift Ascendant Canon",
		flavor:
			"A specialized manifestation of Regent Resonance. This form allows the caster to weave the Radiant Regent into an Absolute Decree.",
		lore: "The Radiant Regent is an Ascendant class overlay that represents the pinnacle of its respective domain. Its historical records are sealed by the Wardens.",
		hit_dice: "1d10",
		primary_ability: ["Presence", "Strength"],
		saving_throws: ["Presence", "Agility"],
		skill_proficiencies: ["Perception", "Insight", "Cosmic Lore", "Athletics"],
		armor_proficiencies: [
			"Light Mana-Weave Armor",
			"Medium Aether Armor",
			"Mana Shields",
		],
		weapon_proficiencies: ["Awakened Weapons", "Rift-Forged Weapons"],
		tool_proficiencies: [],
		requirements: {
			quest_completion: "Complete the Radiant Regent Trials quest series",
			warden_verification: true,
			prerequisite_job: "Any base job",
		},
		class_features: [
			{
				level: 1,
				name: "White Flame Mastery",
				description:
					"Immunity to fire and radiant damage. Your presence purifies any magical or mundane pollution within 60 ft.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 1,
				name: "Immolation Aura",
				description:
					"Enemies within 30 feet take 2d12 radiant damage at the start of their turn and are unable to benefit from regeneration or healing. This reflects your passive purifying presence.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 1,
				name: "Flame Dominion",
				description:
					"As an action, create a 1-mile radius area of absolute holy protection for 1 hour. All allies within gain immunity to fire and radiant damage. Once per day.",
				type: "action",
				frequency: "once-per-day",
				uses: 1,
				recovery: "long-rest",
			},
			{
				level: 2,
				name: "Regent Power Resonance",
				description:
					"Your Regent abilities resonate with cosmic power. Gain +1 to the Regent Resonance pool maximum.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 3,
				name: "White Flame Burst",
				description:
					"As an action, create a 30-foot radius of white flames. Creatures take 10d10 fire damage and must make a Vitality saving throw (DC 8 + PB + PRE) or be blinded for 1 minute. Purification fire that erases corruption.",
				type: "action",
				frequency: "once-per-day",
				uses: 1,
				recovery: "long-rest",
			},
			{
				level: 3,
				name: "Purification Flame",
				description:
					"As an action, target a creature or 20-foot radius area to purge all diseases, curses, and fiendish influence. Anomalies in the area take 10d10 radiant damage (Vitality save DC 8 + PB + PRE for half).",
				type: "action",
				frequency: "short-rest",
				uses: 1,
				recovery: "short-rest",
			},
			{
				level: 3,
				name: "Purifying Presence",
				description:
					"You project an aura of absolute purity within 60 feet. All allies within the aura have advantage on saving throws against charmed, frightened, and mind-altering effects. Anomalies that start their turn within the aura take 2d10 radiant damage.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 4,
				name: "Regent Attribute Enhancement",
				description: "Increase one primary ability score (Presence or Strength) by +2.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 5,
				name: "Seraphim Wings",
				description:
					"As a bonus action, manifest 6 wings of white flame for 1 hour. Gain flying speed of 120 ft. You shed bright light in a 300-ft radius. Evil, anomalous, or undead creatures within 60 ft must make a Vitality save (DC 8 + PB + PRE) at the start of their turn or be blinded and take 6d8 radiant damage.",
				type: "bonus-action",
				frequency: "long-rest",
				uses: 1,
				recovery: "long-rest",
			},
			{
				level: 5,
				name: "Flame Authority",
				description:
					"As an action, command all elemental fire and light creatures within 300 feet. They must make a Presence saving throw (DC 8 + PB + PRE) or be charmed by you for 24 hours. Charmed creatures obey your verbal commands.",
				type: "action",
				frequency: "long-rest",
				uses: 1,
				recovery: "long-rest",
			},
			{
				level: 5,
				name: "Phoenix Rebirth",
				description:
					"When you are reduced to 0 hit points, you explode in white fire (all creatures within 30 feet take 10d10 fire damage, Agility save DC 8 + PB + PRE for half) and are instantly restored to full hit points at the start of your next turn. Your body reforms from the flames at the location where you fell. Once used, you cannot use this feature again until you complete a long rest.",
				type: "passive",
				frequency: "long-rest",
				uses: 1,
				recovery: "long-rest",
				mechanics: {
					death_save_override: true,
					restoration: "full HP on next turn",
					area_damage: "10d10 fire, 30-ft radius",
				},
			},
			{
				level: 6,
				name: "Regent Power Resonance",
				description:
					"Your Regent abilities resonate with cosmic power. Gain +1 to the Regent Resonance pool maximum.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 7,
				name: "Flame God",
				description:
					"You incarnate as the fundamental force of holy fire. As a bonus action, you can transform into pure white flame for 1 minute. While in this form, you are immune to all damage except necrotic, can move through any gap, and your attacks deal an additional 4d10 radiant damage.",
				type: "bonus-action",
				frequency: "long-rest",
				uses: 1,
				recovery: "long-rest",
			},
			{
				level: 7,
				name: "Purification Lord",
				description:
					"You have absolute control over spiritual corruption. As an action, target a creature, object, or 60-foot radius area. All diseases, curses, possession effects, and anomalous taint are instantly removed. Anomalies in the area must make a Sense save (DC 8 + PB + PRE) or be banished to their home plane.",
				type: "action",
				frequency: "once-per-day",
				uses: 1,
				recovery: "long-rest",
			},
			{
				level: 8,
				name: "Regent Attribute Enhancement",
				description: "Increase one primary ability score (Presence or Strength) by +2.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 9,
				name: "Purification Authority",
				description:
					"As an action, force all anomalies within 300 feet to make a Sense save (DC 8 + PB + PRE + 2) or be instantly banished or destroyed (your choice). Banished creatures return to their home plane and cannot return for 1 year.",
				type: "action",
				frequency: "once-per-day",
				uses: 1,
				recovery: "long-rest",
			},
			{
				level: 9,
				name: "Flame Emperor",
				description:
					"You command the ultimate manifestation of purification fire. All of your fire and radiant damage increases by 50% (rounded up). Additionally, you can spend 1 minute in concentration to sanctify a 1-mile radius area permanently. The area becomes consecrated ground: undead and fiends have disadvantage on all rolls, and living creatures regain maximum hit points from rest.",
				type: "passive",
				frequency: "at-will",
				mechanics: {
					damage_bonus: "+50% to fire and radiant",
					sanctification: "1-mile radius, permanent, 1 minute casting",
				},
			},
			{
				level: 10,
				name: "Absolute Flame",
				description:
					"You achieve the ultimate mastery of purification fire. You are permanently immune to all damage except necrotic. As a bonus action, you can erase the concept of sin or corruption from a creature, object, or location, permanently removing any curse, taint, or evil alignment (no save). This is conceptual purification.",
				type: "passive",
				frequency: "at-will",
				mechanics: {
					immunity: "all damage except necrotic",
					conceptual_purification: "bonus action, no save, permanent",
				},
			},
			{
				level: 11,
				name: "Flame Ascendant",
				description:
					"You transcend mortal limitations, gaining the ability to exist as pure white flame. You can move through any space and are immune to being grappled, restrained, or petrified. You command purification across all dimensions.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 11,
				name: "Purification Lord",
				description:
					"You gain complete control over spiritual purity, able to cleanse entire worlds of corruption at will. As an action once per week, you can purify a continent-sized area, removing all diseases, curses, and anomalous effects.",
				type: "action",
				frequency: "once-per-long-rest",
				uses: 1,
				recovery: "weekly",
			},
			{
				level: 11,
				name: "Fire God",
				description:
					"You become a living embodiment of holy fire, able to manifest as the sun itself to illuminate and purify reality. Your Immolation Aura expands to 300 feet and deals 6d12 radiant damage.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 12,
				name: "Regent Attribute Enhancement",
				description: "Increase one primary ability score (Presence or Strength) by +2.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 13,
				name: "Flame Apocalypse",
				description:
					"Once per day, you can unleash a white flame apocalypse that covers a 10-mile radius in purifying light for 1 minute. All evil-aligned beings in the area must make a Vitality save (DC 8 + PB + PRE + 4) each round or be obliterated (reduced to 0 HP and disintegrated). Neutral and good creatures are unaffected.",
				type: "action",
				frequency: "once-per-day",
				uses: 1,
				recovery: "long-rest",
			},
			{
				level: 13,
				name: "Purification Dominion",
				description:
					"You gain control over the concept of purity itself, able to overwrite any curse or corruption across a planetary scale. You can rewrite the fundamental nature of tainted magic.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 13,
				name: "Essence God",
				description:
					"You can harvest and manipulate the divine essence of any being through purification, gaining their sanctified power. When you destroy an anomaly, you can choose to extract its essence, gaining one of its abilities for 24 hours.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 14,
				name: "Regent Power Resonance",
				description:
					"Your Regent abilities resonate with cosmic power. Gain +1 to the Regent Resonance pool maximum.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 15,
				name: "Flame Reality",
				description:
					"You can reshape reality itself through holy fire, creating sanctified dimensions and rewriting spiritual laws. You can create permanent demiplanes of pure radiance.",
				type: "action",
				frequency: "once-per-long-rest",
				uses: 1,
				recovery: "weekly",
			},
			{
				level: 15,
				name: "Purification God",
				description:
					"You become a master of all spiritual cleansing, able to create and destroy through the concept of purity. Your purification effects ignore all immunities and resistances.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 15,
				name: "Fire Emperor",
				description:
					"Your purifying fire extends across all realities, allowing you to sanctify entire universes. You can sense and cleanse corruption across dimensional boundaries.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 16,
				name: "Regent Attribute Enhancement",
				description: "Increase one primary ability score (Presence or Strength) by +2.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 17,
				name: "Flame Transcendence",
				description:
					"You transcend the concept of fire, becoming a fundamental force of holy illumination that cannot be contained or darkened. You cannot be suppressed, dispelled, or counterspelled.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 17,
				name: "Purification Emperor",
				description:
					"You gain mastery over purity itself, able to create concepts of holiness from nothing. You can spontaneously generate holy relics and sanctified items.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 17,
				name: "Essence Emperor",
				description:
					"You can absorb and control the sanctified essence of entire worlds, gaining their collective power. When you purify a location, you gain permanent knowledge of its history and magic.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 18,
				name: "Regent Power Resonance",
				description:
					"Your Regent abilities resonate with cosmic power. Gain +1 to the Regent Resonance pool maximum.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 19,
				name: "Flame Omnipotence",
				description:
					"You achieve true omnipotence within the radiant domain, able to control all light and purity across all timelines. Your radiant magic affects all versions of a target across parallel realities.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 19,
				name: "Purification Regent",
				description:
					"Your purifying power extends across the multiverse, allowing you to reshape entire universes into beacons of light. You can rewrite the fundamental laws of reality to favor holiness.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 19,
				name: "Fire Regent",
				description:
					"You become the ultimate authority over light and heat, able to determine the heat-death or enlightenment of existence. You control the thermal destiny of the cosmos.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 20,
				name: "Flame Supremacy",
				description:
					"You achieve absolute supremacy over all radiant forces, becoming the source and master of all holy illumination. All radiant and fire effects originate from your will.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 20,
				name: "Absolute Flame",
				description:
					"You become the embodiment of absolute holiness, a force beyond comprehension that exists outside the reach of shadow. You are the eternal flame that cannot be extinguished.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 20,
				name: "Regent Power",
				description:
					"You achieve the full power of a Regent at their peak - the ability to command infinite energies of your element, reshape reality, control all dimensions, master your domain completely, and transcend to become a fundamental force of the multiverse.",
				type: "passive",
				frequency: "at-will",
			},
		],
	},
	{
		id: "steel_regent",
		powersKnown: REGENT_POWERS_KNOWN,
		techniquesKnown: REGENT_TECHNIQUES_KNOWN,
		name: "Steel Regent",
		title: "Steel Regent (Regent of Iron Body)",
		theme: "Conceptual Invulnerability & Absolutist Defense",
		description:
			"Embodiment of absolute structural integrity, wielding the shared power of Golem, the Eternal of Giants. You are a foundational pillar of the Ascendant, a conceptually invulnerable entity that anchors the realms against the pull of the Void. Your iron will mirrors the Unyielding Wall, making containment of your presence fundamentally impossible.",
		rank: "S",
		image: getRegentPortraitUrl("steel_regent"),
		type: "ascendant-class-overlay",
		tags: ["regent", "iron_body", "tarnak", "invulnerable", "titan", "defense"],
		created_at: "2026-01-13T22:03:39.601Z",
		source_book: "Rift Ascendant Canon",
		flavor:
			"A specialized manifestation of Regent Resonance. This form allows the caster to weave the Steel Regent into an Absolute Decree.",
		lore: "The Steel Regent is an Ascendant class overlay that represents the pinnacle of its respective domain. Its historical records are sealed by the Wardens.",
		hit_dice: "1d12",
		primary_ability: ["Vitality", "Strength"],
		saving_throws: ["Vitality", "Vitality"],
		skill_proficiencies: ["Athletics", "Intimidation", "Survival"],
		armor_proficiencies: ["All armor", "Mana Shields"],
		weapon_proficiencies: ["Awakened Weapons", "Rift-Forged Weapons"],
		tool_proficiencies: [],
		requirements: {
			quest_completion: "Complete the Steel Regent Ascension trials",
			warden_verification: true,
			prerequisite_job: "Any base job",
		},
		class_features: [
			{
				level: 1,
				name: "Iron Body",
				description:
					"Your skin becomes hard as dragon scales. You gain immunity to poison and disease. You cannot be aged or polymorphed against your will.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 1,
				name: "Immovable Anchor",
				description:
					"As a bonus action, root yourself in space for up to 1 hour. While rooted, you cannot be moved, grappled, shoved, or teleported against your will. Gravity ceases to affect you. You can end this effect as a bonus action.",
				type: "bonus-action",
				frequency: "at-will",
			},
			{
				level: 1,
				name: "Infinite Stamina",
				description:
					"You no longer require sleep, food, or air. You are immune to exhaustion levels and all vital-sign based targeting (such as poison, suffocation, or starvation).",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 2,
				name: "Regent Power Resonance",
				description:
					"Your Regent abilities resonate with cosmic power. Gain +1 to the Regent Resonance pool maximum.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 3,
				name: "Steel Weaving",
				description:
					"As a bonus action, reinforce your structure for 1 minute to gain +3 AC and resistance to all physical damage (bludgeoning, piercing, slashing).",
				type: "bonus-action",
				frequency: "short-rest",
				uses: 1,
				recovery: "short-rest",
			},
			{
				level: 3,
				name: "Titan's Law",
				description:
					"As a reaction when you take damage from an attack, reflect that damage back at the attacker as force damage. The attacker takes the same amount of damage you took (before resistances).",
				type: "reaction",
				frequency: "at-will",
			},
			{
				level: 3,
				name: "Conceptual Invulnerability",
				description:
					"As an action, enter a state of absolute defense for 1 minute. While in this state, you are immune to ALL damage, your AC becomes 30, and you cannot be affected by any condition. You can toggle this state on or off as an action. Once activated, you cannot use this feature again until you complete a long rest.",
				type: "action",
				frequency: "long-rest",
				uses: 1,
				recovery: "long-rest",
				mechanics: {
					toggle: "action to activate or deactivate",
					duration: "1 minute maximum",
					immunity: "all damage and conditions",
				},
			},
			{
				level: 4,
				name: "Regent Attribute Enhancement",
				description: "Increase one primary ability score (Vitality or Strength) by +2.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 5,
				name: "Iron Dominion",
				description:
					"As an action, create a 1-mile radius area of absolute defensive control for 1 hour. All allies within the area gain your damage resistances. Once per day.",
				type: "action",
				frequency: "once-per-day",
				uses: 1,
				recovery: "long-rest",
			},
			{
				level: 5,
				name: "Titan Authority",
				description:
					"As an action, command any construct within 300 feet to serve you. The construct must make a Wisdom saving throw (DC 8 + PB + VIT). On a failed save, it becomes permanently loyal to you and follows your commands. You can control a number of constructs equal to your proficiency bonus. Commanded constructs persist until destroyed, dismissed (bonus action), or you die.",
				type: "action",
				frequency: "once-per-day",
				uses: 1,
				recovery: "long-rest",
				mechanics: {
					control_limit: "PB constructs maximum",
					persistence: "until destroyed, dismissed, or caster death",
					dismissal: "bonus action",
					stat_block: "use original construct stats",
				},
			},
			{
				level: 5,
				name: "Regeneration Lord",
				description:
					"You can regrow any lost limb, organ, or body part in 1 minute. You have mastery over biological repair and structure.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 6,
				name: "Regent Power Resonance",
				description:
					"Your Regent abilities resonate with cosmic power. Gain +1 to the Regent Resonance pool maximum.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 7,
				name: "Organic Manipulation",
				description:
					"You can rewrite the fundamental structure of living beings. As an action once per day, target a creature within 60 feet. You can reshape its body, cure diseases, remove curses, restore lost limbs, or impose physical mutations (Constitution save DC 8 + PB + VIT to resist unwanted changes).",
				type: "action",
				frequency: "once-per-day",
				uses: 1,
				recovery: "long-rest",
			},
			{
				level: 7,
				name: "Flesh God",
				description:
					"You become a living embodiment of biological perfection. You gain immunity to critical hits and can reroll any failed Constitution saving throw once per long rest.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 7,
				name: "Regeneration Lord",
				description:
					"Your regeneration becomes instantaneous. At the start of your turn, you regain hit points equal to your proficiency bonus + Vitality modifier.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 8,
				name: "Regent Attribute Enhancement",
				description: "Increase one primary ability score (Vitality or Strength) by +2.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 9,
				name: "Flesh Dominion",
				description:
					"You have total control over the physiological limits of flesh and blood. You can alter your own physical form at will (change appearance, grow natural weapons, gain aquatic or climbing adaptations). These changes are permanent until you choose to revert them.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 9,
				name: "Steel Command",
				description:
					"You command the absolute loyalty of all inorganic constructs. As an action, all constructs within 1 mile that can see or hear you must make a Wisdom save (DC 8 + PB + VIT) or become charmed by you for 24 hours. Summoned constructs persist until destroyed or dismissed (bonus action).",
				type: "action",
				frequency: "at-will",
				mechanics: {
					persistence: "until destroyed or dismissed",
					dismissal: "bonus action",
				},
			},
			{
				level: 9,
				name: "Flesh Emperor",
				description:
					"You achieve ultimate biological sovereignty. You can survive any physical trauma short of total disintegration. If you are reduced to 0 hit points but your body remains intact, you stabilize automatically and regain consciousness in 1 minute with 1 HP.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 10,
				name: "Steel Authority",
				description:
					"You have absolute command over the concept of rigidity and structure. All of your AC bonuses increase by +2, and you can extend your Iron Body immunity to allies you touch (bonus action, lasts 1 hour).",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 10,
				name: "Absolute Flesh",
				description:
					"You achieve the pinnacle of organic existence. You are immune to necrotic damage and cannot be transformed, petrified, or polymorphed. Your biological form is absolute and immutable.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 11,
				name: "Titan Ascendant",
				description:
					"You transcend mortal limitations, gaining the ability to exist as pure indestructible force and command absolute defense across all dimensions. You can phase through solid matter at will.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 11,
				name: "Steel Lord",
				description:
					"You gain complete control over steel and metal, able to reshape metal objects within 300 feet at will. You can create simple metal objects (weapons, armor, tools) from raw metal as an action.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 11,
				name: "Invulnerability God",
				description:
					"You become a living embodiment of invulnerability, able to resist any force in existence. You gain resistance to all damage types. If you already have resistance, you gain immunity instead.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 12,
				name: "Regent Attribute Enhancement",
				description: "Increase one primary ability score (Vitality or Strength) by +2.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 13,
				name: "Steel Apocalypse",
				description:
					"Once per day, you can unleash a steel apocalypse that reshapes a 10-mile radius for 1 minute. All matter in the area transforms into indestructible divine metal. Structures, terrain, and objects become permanent metallic versions. Living creatures must make a Constitution save (DC 8 + PB + VIT) each round or take 10d10 force damage.",
				type: "action",
				frequency: "once-per-day",
				uses: 1,
				recovery: "long-rest",
			},
			{
				level: 13,
				name: "Steel Dominion",
				description:
					"You gain control over metal itself, able to create and destroy any metallic substance at will. You can transmute non-metal into metal and vice versa within a 300-foot radius.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 13,
				name: "Essence God",
				description:
					"You can harvest and manipulate the essence of any being through the concept of the immovable anchor. When you reduce a creature to 0 hit points, you can extract its essence, gaining one of its abilities permanently (DM approval required).",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 14,
				name: "Regent Power Resonance",
				description:
					"Your Regent abilities resonate with cosmic power. Gain +1 to the Regent Resonance pool maximum.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 15,
				name: "Titan Reality",
				description:
					"You can reshape reality itself through the concept of the immovable object, creating indestructible worlds. You can create permanent structures and terrain features that cannot be destroyed by any means short of divine intervention.",
				type: "action",
				frequency: "once-per-long-rest",
				uses: 1,
				recovery: "weekly",
			},
			{
				level: 15,
				name: "Steel God",
				description:
					"You become a master of all metals, able to create and destroy entire metallic worlds. Your metal manipulation extends across dimensions.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 15,
				name: "Invulnerability Emperor",
				description:
					"Your invulnerability extends across all realities, allowing you to shield entire worlds from destruction. As an action, you can extend your invulnerability to all allies within 1 mile for 1 minute (once per long rest).",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 16,
				name: "Regent Attribute Enhancement",
				description: "Increase one primary ability score (Vitality or Strength) by +2.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 17,
				name: "Titan Transcendence",
				description:
					"You transcend the concept of matter, becoming a fundamental force of permanence that cannot be moved or destroyed. You are immune to all forced movement and cannot be banished, dismissed, or exiled.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 17,
				name: "Steel Emperor",
				description:
					"You gain mastery over metal itself, able to create concepts of metallurgy from nothing. You can spontaneously generate any metal, alloy, or metallic compound.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 17,
				name: "Essence Emperor",
				description:
					"You can absorb and control the structural essence of entire worlds, gaining their collective power. You permanently gain the ability to reshape any location you have visited.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 18,
				name: "Regent Power Resonance",
				description:
					"Your Regent abilities resonate with cosmic power. Gain +1 to the Regent Resonance pool maximum.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 19,
				name: "Titan Omnipotence",
				description:
					"You achieve true omnipotence within the domain of structural integrity, able to lock all reality across all timelines. Your defensive abilities affect all versions of yourself across parallel worlds.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 19,
				name: "Steel Regent",
				description:
					"Your metallic power extends across the multiverse, allowing you to reshape entire universes into perfect iron order. You become the concept of structure itself.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 19,
				name: "Invulnerability Regent",
				description:
					"You become the ultimate authority over permanence and protection, able to determine the eternal state of all existence. You can make any object, creature, or effect permanent or temporary at will.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 20,
				name: "Regent Attribute Enhancement",
				description: "Increase one primary ability score (Vitality or Strength) by +2.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 20,
				name: "Titan Supremacy",
				description:
					"You achieve absolute supremacy over all structural forces, becoming the source and master of all permanence. You are the foundation upon which all reality rests.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 20,
				name: "Absolute Invulnerability",
				description:
					"You become the embodiment of absolute permanence, a force beyond comprehension that exists outside all laws of entropy. You can toggle full invulnerability on or off as a bonus action with no limit on duration or uses. When invulnerable, you are immune to all damage, conditions, and effects.",
				type: "passive",
				frequency: "at-will",
				mechanics: {
					toggle: "bonus action, unlimited uses",
					immunity: "all damage, conditions, and effects when active",
				},
			},
			{
				level: 20,
				name: "Regent Power",
				description:
					"You achieve the full power of a Regent at their peak - the ability to command infinite forces of your element, reshape reality, control all dimensions, master your domain completely, and transcend to become a fundamental force of the multiverse.",
				type: "passive",
				frequency: "at-will",
			},
		],
	},
	{
		id: "destruction_regent",
		spellcasting: {
			ability: "Strength",
			spell_slots: REGENT_FULL_CASTER_SLOTS,
			cantrips_known: REGENT_CANTRIPS_KNOWN,
			spells_known: REGENT_SPELLS_KNOWN,
			spell_preparation: false,
			additional_spells: [
				"Fire Bolt",
				"Shatter",
				"Fireball",
				"Disintegrate",
				"Meteor Swarm",
			],
		},
		name: "Destruction Regent",
		title: "Destruction Regent (Regent of Destruction)",
		theme: "Primordial Destruction and Draconic Apocalypse",
		description:
			"Incarnation of primordial destruction, sharing the catastrophic power of Marthos, the Dragon-King of Void. You are the Ascendant's necessary delete-command, capable of transforming into the dragon of apocalypse whose breath erases corrupted reality. As the mortal anchor for the Void Weaver, you represent the inevitable end and the Next Beginning.",
		rank: "S",
		image: getRegentPortraitUrl("destruction_regent"),
		type: "ascendant-class-overlay",
		tags: [
			"regent",
			"destruction",
			"annihilation",
			"dragon",
			"solar-regent-tier",
			"apocalypse",
		],
		created_at: "2026-01-13T22:03:39.601Z",
		source_book: "Rift Ascendant Canon",
		flavor:
			"A specialized manifestation of Regent Resonance. This form allows the caster to weave the Destruction Regent into an Absolute Decree.",
		lore: "The Destruction Regent is an Ascendant class overlay that represents the pinnacle of its respective domain. Its historical records are sealed by the Wardens.",
		hit_dice: "1d12",
		primary_ability: ["Strength", "Vitality"],
		saving_throws: ["Strength", "Agility"],
		skill_proficiencies: ["Athletics", "Intimidation", "Perception"],
		armor_proficiencies: [
			"Light Mana-Weave Armor",
			"Medium Aether Armor",
			"Mana Shields",
		],
		weapon_proficiencies: ["Awakened Weapons", "Rift-Forged Weapons"],
		tool_proficiencies: [],
		requirements: {
			quest_completion: "Complete the Path of Destruction quest series",
			warden_verification: true,
			prerequisite_job: "Any base job",
		},
		class_features: [
			{
				level: 1,
				name: "Breath of Annihilation",
				description:
					"As an action, unleash a 120-foot cone of apocalyptic fire. Creatures in the area must make an Agility saving throw (DC 8 + PB + STR) or take 12d10 fire damage (half on success). Creatures reduced to 0 hit points are erased from reality and cannot be resurrected by any means short of divine intervention. Buildings collapse, steel melts, and stone sublimates.",
				type: "action",
				frequency: "once-per-day",
				uses: 1,
				recovery: "long-rest",
			},
			{
				level: 1,
				name: "Destruction Step",
				description:
					"As a bonus action, teleport up to 60 feet by destroying the space between your current location and your destination. Creatures you pass through take 3d6 force damage (no save). This destructive teleportation leaves a trail of shattered reality.",
				type: "bonus-action",
				frequency: "at-will",
			},
			{
				level: 1,
				name: "Destruction Dominion",
				description:
					"As an action, create a 1-mile radius area of absolute destruction control for 1 hour. All destructive effects (fire, force, necrotic damage) within the area are maximized (no rolling - treat all dice as maximum). Once per day.",
				type: "action",
				frequency: "once-per-day",
				uses: 1,
				recovery: "long-rest",
			},
			{
				level: 2,
				name: "Regent Power Resonance",
				description:
					"Your Regent abilities resonate with cosmic power. Gain +1 to the Regent Resonance pool maximum.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 3,
				name: "Annihilation Presence",
				description:
					"Your mere presence causes structures to weaken and enemies to falter. Non-magical structures within 60 feet take 1d10 damage per round. Creatures that start their turn within 30 feet must make a Vitality save (DC 8 + PB + STR) or have disadvantage on attack rolls until the start of their next turn.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 3,
				name: "Destruction Mastery",
				description:
					"You have perfect control over destructive force and energy. You are immune to fire damage and have resistance to force damage. Additionally, you can suppress or enhance any destructive effect within 60 feet as a reaction.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 3,
				name: "Aura of Ruin",
				description:
					"Non-magical objects within 20 feet crumble to dust over 1 minute. Structures and fortifications take 2d10 damage per round while you remain within 20 feet. This passive aura can be suppressed or activated as a bonus action.",
				type: "passive",
				frequency: "at-will",
				mechanics: {
					toggle: "bonus action",
					area_damage: "2d10 per round to structures",
				},
			},
			{
				level: 4,
				name: "Regent Attribute Enhancement",
				description: "Increase one primary ability score (Strength or Vitality) by +2.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 5,
				name: "Decimation Field",
				description:
					"As an action, you exude an aura of sheer destructive energy in a 60-foot radius for 1 minute. At the start of each of your turns, all creatures in the area take 6d10 force damage (Vitality save DC 8 + PB + STR for half). Structures automatically take maximum damage. The field moves with you.",
				type: "action",
				frequency: "long-rest",
				uses: 1,
				recovery: "long-rest",
			},
			{
				level: 5,
				name: "True Dragon Form",
				description:
					"As an action, transform into an ancient red dragon for 1 hour. You become Gargantuan size, gain fly speed 120 ft, AC 22, and immunity to fire and physical damage (bludgeoning, piercing, slashing). You retain your mental stats but use the dragon's physical stats (STR 30, VIT 29, AGI 10). News agencies declare 'dragon sighting confirmed.' This is the living embodiment of the apocalypse.",
				type: "action",
				frequency: "long-rest",
				uses: 1,
				recovery: "long-rest",
				mechanics: {
					form_stats: "Gargantuan, AC 22, fly 120 ft",
					immunity: "fire and physical damage",
					duration: "1 hour",
				},
			},
			{
				level: 5,
				name: "Cataclysmic Rebirth",
				description:
					"When you are reduced to 0 hit points, you explode in a 60-foot radius of destructive energy (all creatures take 15d10 force damage, Agility save DC 8 + PB + STR for half). You are then restored to half your maximum hit points at the start of your next turn, reappearing in an unoccupied space within the explosion radius. Once used, you cannot use this feature again until you complete a long rest.",
				type: "passive",
				frequency: "long-rest",
				uses: 1,
				recovery: "long-rest",
				mechanics: {
					death_save_override: true,
					restoration: "half max HP next turn",
					area_damage: "15d10 force, 60-ft radius",
				},
			},
			{
				level: 6,
				name: "Regent Power Resonance",
				description:
					"Your Regent abilities resonate with cosmic power. Gain +1 to the Regent Resonance pool maximum.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 7,
				name: "Vortex Shield",
				description:
					"As a reaction when targeted by an attack or spell, create a destructive vortex that redirects the attack back at the attacker. The attacker must make an Agility save (DC 8 + PB + STR) or take the attack's damage themselves.",
				type: "reaction",
				frequency: "short-rest",
				uses: 1,
				recovery: "short-rest",
			},
			{
				level: 7,
				name: "Destruction God",
				description:
					"You incarnate as the fundamental force of destruction. All of your destructive damage (fire, force, necrotic) increases by 50% (rounded up). Additionally, once per long rest, you can declare a structure or object 'condemned' - it collapses or disintegrates instantly (no save).",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 7,
				name: "Ruin Lord",
				description:
					"You have absolute control over decay and destruction. As an action, you can age any object or structure by 1000 years instantly, causing it to crumble. Living creatures within 60 feet age 10 years (Vitality save DC 8 + PB + STR negates). You can use this once per long rest.",
				type: "action",
				frequency: "long-rest",
				uses: 1,
				recovery: "long-rest",
			},
			{
				level: 8,
				name: "Regent Attribute Enhancement",
				description: "Increase one primary ability score (Strength or Vitality) by +2.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 9,
				name: "Calamity Wings",
				description:
					"You manifest draconic wings of destruction. You gain fly speed 90 ft. As an action, you can create a wing buffet in a 30-foot cone (Strength save DC 8 + PB + STR or creatures take 6d6 force damage and are knocked prone). Your wingbeats create hurricane-force winds.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 9,
				name: "Dragon Ascendant",
				description:
					"You transcend mortal limitations, gaining the ability to exist as pure destructive force. You gain immunity to necrotic damage and can breathe underwater, in vacuum, and in any hostile environment. Your Breath of Annihilation damage increases to 15d10.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 9,
				name: "Apocalypse Herald",
				description:
					"When you use Breath of Annihilation or Decimation Field, the area becomes cursed ground for 24 hours. Creatures that enter the area for the first time or start their turn there take 4d10 necrotic damage.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 10,
				name: "Annihilation Authority",
				description:
					"As an action, force all constructs and undead within 300 feet to make a Sense save (DC 8 + PB + STR + 2) or be destroyed instantly and become your servants for 24 hours. You can have a number of servants equal to your proficiency bonus at once.",
				type: "action",
				frequency: "once-per-day",
				uses: 1,
				recovery: "long-rest",
			},
			{
				level: 10,
				name: "Absolute Destruction",
				description:
					"You become the ultimate master of destruction. You are immune to all damage except radiant. As a bonus action, you can erase any non-magical object or structure from existence (no save). Once per day, you can erase a magical effect, spell, or enchantment of 9th level or lower.",
				type: "passive",
				frequency: "at-will",
				mechanics: {
					immunity: "all damage except radiant",
					object_erasure: "bonus action, non-magical only",
					magic_erasure: "once per day, up to 9th level",
				},
			},
			{
				level: 11,
				name: "Dragon Lord",
				description:
					"Your draconic power reaches its apex. Your True Dragon Form duration increases to 8 hours, and you can use Breath of Annihilation while in dragon form without expending your daily use.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 11,
				name: "Destruction Reality",
				description:
					"You can reshape reality through destruction. As an action, you can create permanent voids in space (10-foot cubes) that nothing can pass through. You can create one void per long rest.",
				type: "action",
				frequency: "long-rest",
				uses: 1,
				recovery: "long-rest",
			},
			{
				level: 11,
				name: "Ruin Emperor",
				description:
					"Your destructive aura extends to 300 feet. All enemies within the aura have disadvantage on saving throws against your destructive effects.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 12,
				name: "Regent Attribute Enhancement",
				description: "Increase one primary ability score (Strength or Vitality) by +2.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 13,
				name: "Cataclysm Unleashed",
				description:
					"Once per day, you can unleash a devastating cataclysm in a 1-mile radius. All creatures and structures in the area take 20d10 force damage (Agility save DC 8 + PB + STR + 4 for half). The area becomes a wasteland for 1 year.",
				type: "action",
				frequency: "once-per-day",
				uses: 1,
				recovery: "long-rest",
			},
			{
				level: 13,
				name: "Dragon Emperor",
				description:
					"You command all draconic entities. Dragons within 1 mile must make a Presence save (DC 8 + PB + STR) or become charmed by you for 24 hours.",
				type: "action",
				frequency: "once-per-day",
				uses: 1,
				recovery: "long-rest",
			},
			{
				level: 13,
				name: "Annihilation Essence",
				description:
					"You can extract the essence of destroyed enemies. When you reduce a creature to 0 HP with a destructive attack, you gain temporary hit points equal to half its maximum HP.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 14,
				name: "Regent Power Resonance",
				description:
					"Your Regent abilities resonate with cosmic power. Gain +1 to the Regent Resonance pool maximum.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 15,
				name: "Primordial Destruction",
				description:
					"You embody primordial destruction itself. Your destructive attacks ignore all resistances and immunities. Additionally, you can use Breath of Annihilation as a bonus action.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 15,
				name: "Void Weaver",
				description:
					"You can weave the void into reality. As an action, you create a 60-foot sphere of void that erases everything inside (Vitality save DC 8 + PB + STR + 4 to survive with 1 HP). Once per week.",
				type: "action",
				frequency: "once-per-long-rest",
				uses: 1,
				recovery: "long-rest",
			},
			{
				level: 15,
				name: "Dragon Transcendence",
				description:
					"You transcend the concept of the dragon, becoming the apocalypse itself. You can remain in True Dragon Form indefinitely and take no penalties.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 16,
				name: "Regent Attribute Enhancement",
				description: "Increase one primary ability score (Strength or Vitality) by +2.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 17,
				name: "Entropy Mastery",
				description:
					"You gain mastery over entropy itself. You can accelerate or reverse decay within 300 feet. You can restore destroyed objects or age living creatures to dust.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 17,
				name: "Annihilation Omnipotence",
				description:
					"You achieve true omnipotence within the domain of destruction. Your destructive effects affect all versions of a target across parallel realities.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 17,
				name: "Apocalypse Incarnate",
				description:
					"You become the living apocalypse. When you use True Dragon Form, you become a world-ending threat. Your size becomes Colossal, and your breath weapon covers a 300-foot cone.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 18,
				name: "Regent Power Resonance",
				description:
					"Your Regent abilities resonate with cosmic power. Gain +1 to the Regent Resonance pool maximum.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 19,
				name: "Reality Annihilation",
				description:
					"You can annihilate reality itself. Once per long rest, you can erase a 1-mile sphere from existence, creating a permanent void. Nothing short of divine intervention can restore it.",
				type: "action",
				frequency: "once-per-long-rest",
				uses: 1,
				recovery: "long-rest",
			},
			{
				level: 19,
				name: "Dragon Regent",
				description:
					"Your draconic power extends across the multiverse. You can sense and communicate with all dragons across all dimensions.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 19,
				name: "Destruction Supremacy",
				description:
					"You achieve absolute supremacy over all destructive forces. You become the source and master of all destruction in the multiverse.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 20,
				name: "Regent Attribute Enhancement",
				description: "Increase one primary ability score (Strength or Vitality) by +2.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 20,
				name: "Void King",
				description:
					"You become the embodiment of the void, a force beyond comprehension that exists to unmake reality. You are the necessary delete-command of existence.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 20,
				name: "Regent Power",
				description:
					"You achieve the full power of a Regent at their peak - the ability to command infinite energies of your element, reshape reality, control all dimensions, master your domain completely, and transcend to become a fundamental force of the multiverse.",
				type: "passive",
				frequency: "at-will",
			},
		],
	},
	{
		id: "war_regent",
		powersKnown: REGENT_POWERS_KNOWN,
		techniquesKnown: REGENT_TECHNIQUES_KNOWN,
		name: "War Regent",
		title: "War Regent (Regent of Command)",
		theme: "Tactical Battlefield Supremacy & Absolute Command",
		description:
			"Embodiment of tactical genius and absolute battlefield authority, wielding the power of the Regent of Command. You command the vanguard legions with unmatched supremacy, turning every conflict into a masterpiece of war. Your presence governs the flow of battle across dimensions, as you lead the charge of the eternal vanguard.",
		rank: "S",
		image: getRegentPortraitUrl("war_regent"),
		type: "ascendant-class-overlay",
		tags: [
			"regent",
			"war",
			"command",
			"leadership",
			"tactics",
			"vanguard",
			"class-overlay",
		],
		created_at: "2026-01-13T22:03:39.601Z",
		source_book: "Rift Ascendant Canon",
		flavor:
			"A specialized manifestation of Regent Resonance. This form allows the caster to weave the War Regent into an Absolute Decree.",
		lore: "The War Regent is an Ascendant class overlay that represents the pinnacle of its respective domain. Its historical records are sealed by the Wardens.",
		hit_dice: "1d10",
		primary_ability: ["Presence", "Intelligence"],
		saving_throws: ["Presence", "Intelligence"],
		skill_proficiencies: [
			"Dimensional Lore",
			"Insight",
			"Persuasion",
			"Intimidation",
		],
		armor_proficiencies: ["All armor", "Mana Shields"],
		weapon_proficiencies: ["Awakened Weapons", "Rift-Forged Weapons"],
		tool_proficiencies: [],
		requirements: {
			quest_completion: "Complete the Command Regent Ascension trials",
			warden_verification: true,
			prerequisite_job: "Any base job",
		},
		class_features: [
			{
				level: 1,
				name: "Warlord's Command",
				description:
					"As a bonus action, grant an ally within 60 feet an immediate action. They can make one weapon attack, cast a cantrip, or take the Dash/Disengage/Dodge action. You can use this a number of times equal to your proficiency bonus per long rest.",
				type: "bonus-action",
				frequency: "long-rest",
				uses: "PB",
				recovery: "long-rest",
			},
			{
				level: 1,
				name: "Leadership Aura",
				description:
					"Allies within 60 feet of you gain advantage on saving throws against being frightened and charmed. Additionally, when an ally within the aura makes an attack roll, you can use your reaction to grant them advantage on that roll (PB times per long rest).",
				type: "passive",
				frequency: "at-will",
				mechanics: {
					aura_range: "60 feet",
					reaction_uses: "PB per long rest",
				},
			},
			{
				level: 1,
				name: "War Dominion",
				description:
					"As an action, create a 1-mile radius area of absolute war control for 1 hour. All allies within the area cannot be frightened, gain +2 to attack rolls, and can make one additional weapon attack when they take the Attack action. Once per day.",
				type: "action",
				frequency: "once-per-day",
				uses: 1,
				recovery: "long-rest",
			},
			{
				level: 2,
				name: "Vanguard Step",
				description:
					"As a bonus action, teleport up to 60 feet to an unoccupied space you can see. You can bring up to 5 willing allies within 10 feet of you along with the teleport. This represents your tactical positioning mastery.",
				type: "bonus-action",
				frequency: "short-rest",
				uses: 1,
				recovery: "short-rest",
			},
			{
				level: 2,
				name: "Regent Power Resonance",
				description:
					"Your Regent abilities resonate with cosmic power. Gain +1 to the Regent Resonance pool maximum.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 3,
				name: "Conquest",
				description:
					"As an action, unleash a 100-foot wave of tactical suppression. All enemies in the area must make a Presence saving throw (DC 8 + PB + PRE) or be stunned until the end of your next turn. This represents your absolute authority on the battlefield.",
				type: "action",
				frequency: "long-rest",
				uses: 1,
				recovery: "long-rest",
			},
			{
				level: 3,
				name: "Command Mastery",
				description:
					"You have perfect control over tactical situations. You can use Warlord's Command as a free action (once per turn). Additionally, allies affected by your commands add your Presence modifier to their damage rolls.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 3,
				name: "Leadership Presence",
				description:
					"Your very existence bolsters the courage and combat capability of your army. All allies within 120 feet of you gain temporary hit points equal to your Presence modifier at the start of their turn (if they have none). Additionally, when an ally within range drops to 0 hit points, you can use your reaction to allow them to make one final attack or spell before falling unconscious.",
				type: "passive",
				frequency: "at-will",
				mechanics: {
					temp_hp: "PRE modifier at turn start",
					last_stand_reaction: "allow final action before 0 HP",
					aura_range: "120 feet",
				},
			},
			{
				level: 4,
				name: "Regent Attribute Enhancement",
				description: "Increase one primary ability score (Presence or Intelligence) by +2.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 5,
				name: "Tactical Step",
				description:
					"Your Vanguard Step is enhanced. You can now teleport up to 120 feet and bring up to 10 willing allies. Additionally, when you use this ability, all teleported allies can immediately make one weapon attack as a free action against a target within range.",
				type: "passive",
				frequency: "at-will",
				mechanics: {
					enhances: "Vanguard Step",
					range: "120 feet",
					allies: "up to 10",
					bonus_attack: "free action for all teleported allies",
				},
			},
			{
				level: 5,
				name: "Command Authority",
				description:
					"As an action, you can command any humanoid within 300 feet to follow a single command (attack a target, move to a location, drop their weapon, etc.). The target must make a Wisdom saving throw (DC 8 + PB + PRE) or obey the command for 1 round. You can use this PB times per long rest.",
				type: "action",
				frequency: "long-rest",
				uses: "PB",
				recovery: "long-rest",
			},
			{
				level: 5,
				name: "Army Rebirth",
				description:
					"When an ally within 60 feet drops to 0 hit points, you can use your reaction to restore them to 1 hit point and grant them temporary hit points equal to your level. You can use this feature a number of times equal to your proficiency bonus per long rest.",
				type: "reaction",
				frequency: "long-rest",
				uses: "PB",
				recovery: "long-rest",
			},
			{
				level: 6,
				name: "Regent Power Resonance",
				description:
					"Your Regent abilities resonate with cosmic power. Gain +1 to the Regent Resonance pool maximum.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 7,
				name: "Command Shield",
				description:
					"As a reaction when an ally within 60 feet is hit by an attack, you can redirect the attack to yourself and gain resistance to all damage from that attack. This reflects your role as the unbreakable center of the vanguard.",
				type: "reaction",
				frequency: "short-rest",
				uses: 1,
				recovery: "short-rest",
			},
			{
				level: 7,
				name: "War God",
				description:
					"You incarnate as the fundamental force of war. All allies within 120 feet add your proficiency bonus to their attack and damage rolls. Additionally, you gain an extra action on each of your turns that can only be used for the Attack action, Dash action, or Warlord's Command.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 7,
				name: "Tactical Lord",
				description:
					"You have absolute mastery over battlefield tactics. You can use your bonus action to grant all allies within 60 feet advantage on their next attack roll or saving throw. Additionally, you can see and hear through any ally within 1 mile.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 8,
				name: "Regent Attribute Enhancement",
				description: "Increase one primary ability score (Presence or Intelligence) by +2.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 9,
				name: "Vanguard Legion",
				description:
					"As an action, you summon a legion of spectral warriors (PB creatures) that fight alongside you for 1 hour. They use the stats of Veterans, act on your initiative, and obey your commands. Once per long rest.",
				type: "action",
				frequency: "long-rest",
				uses: 1,
				recovery: "long-rest",
				mechanics: {
					summoned_creatures: "PB Veterans",
					duration: "1 hour",
					persistence: "until destroyed, dismissed (bonus action), or duration ends",
				},
			},
			{
				level: 9,
				name: "Command Emperor",
				description:
					"Your commands become irresistible. When you use Command Authority, targets have disadvantage on the saving throw. Additionally, you can command up to 3 targets with a single use.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 9,
				name: "War Incarnate",
				description:
					"You become the living embodiment of war. You are immune to being frightened, charmed, or stunned. Additionally, when you take damage, you can use your reaction to make one weapon attack against an enemy within reach.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 10,
				name: "Vanguard Authority",
				description:
					"As an action, force all enemy leaders and commanders within 300 feet to make a Wisdom saving throw (DC 8 + PB + PRE + 2). On a failure, they surrender and their forces cease hostilities. Surrendered forces will not attack you or your allies for 24 hours. Once per day.",
				type: "action",
				frequency: "once-per-day",
				uses: 1,
				recovery: "long-rest",
				mechanics: {
					targets: "enemy leaders and commanders",
					effect: "surrender, 24-hour ceasefire",
				},
			},
			{
				level: 10,
				name: "Absolute War",
				description:
					"You become the ultimate master of war. While you are leading an army (at least 5 allies within 120 feet), you are immune to all damage. Additionally, you can command any creature in existence to take a tactical action (make an attack, move, etc.) as a bonus action, and they must make a Wisdom save (DC 8 + PB + PRE + 4) or obey.",
				type: "passive",
				frequency: "at-will",
				mechanics: {
					conditional_immunity: "immune to all damage while leading (5+ allies within 120 ft)",
					universal_command: "command any creature, bonus action, Wis save",
				},
			},
			{
				level: 11,
				name: "War Ascendant",
				description:
					"You transcend mortal limitations of command. Your War Dominion area expands to 10 miles, and all allies within gain an extra attack on their turn.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 11,
				name: "Legion Master",
				description:
					"Your Vanguard Legion now summons twice as many warriors (2×PB), and they gain +4 to all rolls while within 60 feet of you.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 11,
				name: "Command Reality",
				description:
					"Once per long rest, you can command reality itself. You can declare a single event to happen (within reason), and it occurs. This could be commanding a bridge to appear, ordering a wall to collapse, or willing reinforcements to arrive.",
				type: "action",
				frequency: "long-rest",
				uses: 1,
				recovery: "long-rest",
			},
			{
				level: 12,
				name: "Regent Attribute Enhancement",
				description: "Increase one primary ability score (Presence or Intelligence) by +2.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 13,
				name: "Absolute Command",
				description:
					"Once per day, you can issue an absolute command to all creatures within 1 mile. Choose one of the following: Attack (all creatures attack the nearest enemy), Kneel (all creatures are prone and incapacitated for 1 round), or Flee (all creatures use their turn to Dash away). No save.",
				type: "action",
				frequency: "once-per-day",
				uses: 1,
				recovery: "long-rest",
			},
			{
				level: 13,
				name: "War Emperor",
				description:
					"You command armies across dimensions. You can sense the location and status of all allied forces within 100 miles, and you can communicate telepathically with any ally you've met.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 13,
				name: "Tactical Omniscience",
				description:
					"You see all possible tactical outcomes. You have advantage on all Initiative rolls, and you can reroll any attack roll, saving throw, or ability check you make (once per short rest).",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 14,
				name: "Regent Power Resonance",
				description:
					"Your Regent abilities resonate with cosmic power. Gain +1 to the Regent Resonance pool maximum.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 15,
				name: "Eternal Vanguard",
				description:
					"Your summoned legions become permanent. Vanguard Legion warriors persist until destroyed, and you can have up to 3×PB warriors active at once. They reform automatically 24 hours after being destroyed.",
				type: "passive",
				frequency: "at-will",
				mechanics: {
					persistence: "permanent, reform 24 hours after death",
					maximum: "3×PB warriors",
				},
			},
			{
				level: 15,
				name: "War Reality",
				description:
					"You can reshape battlefields. As an action, you can terraform a 1-mile radius area into ideal tactical terrain (trenches, fortifications, high ground, etc.). This is permanent.",
				type: "action",
				frequency: "once-per-long-rest",
				uses: 1,
				recovery: "long-rest",
			},
			{
				level: 15,
				name: "Supreme Commander",
				description:
					"All allies within 1 mile of you gain immunity to being frightened, charmed, or stunned, and they add +5 to all attack and damage rolls.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 16,
				name: "Regent Attribute Enhancement",
				description: "Increase one primary ability score (Presence or Intelligence) by +2.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 17,
				name: "Multiversal Command",
				description:
					"Your commands extend across dimensions. You can command creatures on other planes of existence, and your War Dominion affects all parallel realities within the area.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 17,
				name: "War Omnipotence",
				description:
					"You achieve true omnipotence within the domain of war. You can see and influence all conflicts across all timelines simultaneously.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 17,
				name: "Tactical Infinity",
				description:
					"You have infinite tactical options. On your turn, you can take two full turns (two actions, two bonus actions, two reactions) instead of one.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 18,
				name: "Regent Power Resonance",
				description:
					"Your Regent abilities resonate with cosmic power. Gain +1 to the Regent Resonance pool maximum.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 19,
				name: "Absolute Authority",
				description:
					"Your authority becomes absolute. Any creature that can see or hear you must obey your commands (Wisdom save DC 8 + PB + PRE + 6 to resist). This extends to gods, cosmic entities, and abstract concepts.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 19,
				name: "War Regent",
				description:
					"Your command extends across the multiverse. You can reshape entire universes into perfect war machines, commanding the forces of infinite realities.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 19,
				name: "Eternal Commander",
				description:
					"You become the eternal commander of all forces. You command the loyalty of every warrior, soldier, and fighter across all realities.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 20,
				name: "Regent Attribute Enhancement",
				description: "Increase one primary ability score (Presence or Intelligence) by +2.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 20,
				name: "Vanguard Eternal",
				description:
					"You become the embodiment of the eternal vanguard, an unstoppable force that leads the charge across all dimensions. You are the first and the last, the beginning and end of every conflict.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 20,
				name: "Regent Power",
				description:
					"You achieve the full power of a Regent at their peak - the ability to command infinite energies of your element, reshape reality, control all dimensions, master your domain completely, and transcend to become a fundamental force of the multiverse.",
				type: "passive",
				frequency: "at-will",
			},
		],
		abilities: [
			{
				name: "Warlord's Command",
				description:
					"As a bonus action, grant an ally within 60 feet an immediate action. This reflects the War Regent's ability to dictate the tempo of battle.",
				type: "bonus-action",
				
			},
			{
				name: "Tactical Step",
				description:
					"Teleport up to 120 feet, bringing up to 10 allies with you. This mirrors the War Regent's absolute control over position and deployment.",
				type: "bonus-action",
				frequency: "at-will",
				
			},
			{
				name: "Conquest",
				description:
					"Unleash a 100-ft wave of tactical suppression that stuns all enemies (Presence save DC 20). This represents your absolute authority on the field.",
				type: "action",
				frequency: "long-rest",
				
			},
			{
				name: "Command Shield",
				description:
					"Redirect an attack from an ally to yourself and gain resistance. This reflects your role as the unbreakable center of the vanguard.",
				type: "reaction",
				frequency: "short-rest",
				
			},
			{
				name: "Leadership Aura",
				description:
					"Allies within 60 feet gain advantage on all rolls. Enemies have disadvantage against them. This represents your passive tactical dominance.",
				type: "passive",
				frequency: "at-will",
				
			},
			{
				name: "War Dominion",
				description:
					"Create a 1-mile radius area of absolute war control. Allies cannot be frightened and gain extra attacks. This mirrors your domain over the battlefield.",
				type: "action",
				frequency: "once-per-day",
				
			},
			{
				name: "Vanguard Authority",
				description:
					"Force all enemy leaders within 300 feet to surrender (Wis save DC 20). Surrendered forces join your legion for 24 hours.",
				type: "action",
				frequency: "once-per-day",
				
			},
			{
				name: "Absolute Command",
				description:
					"You become the ultimate master of war. You are immune to all damage while leading an army, and can command any soul in existence to take a tactical action.",
				type: "passive",
				frequency: "at-will",
				
			},
		],
		features: [
			{
				name: "Leadership Presence",
				description: "Your very existence bolsters the courage and combat capability of your army.",
				type: "passive",
				
				mechanics: { special_abilities: ["Summoned troops persist until destroyed or dismissed"] }
			},
			{
				name: "Tactical Step",
				description: "Strategic repositioning for you and your forces.",
				type: "bonus-action",
				frequency: "at-will",
				
			},
			{
				name: "Absolute War",
				description: "The conceptual embodiment of eternal conflict.",
				type: "passive",
				
			},
			{
				name: "Regent Power Resonance",
				description: "Your abilities resonate with the power of the Regents, increasing their effectiveness and reducing cooldowns.",
				type: "passive",
				level: 1
			},
			{
				name: "War Dominion",
				description:
					"Immunity to fear and charm. Your tactical mind cannot be breached or influenced.",
				
			},
			{
				name: "Vanguard Step",
				description: "Tactical teleportation for you and your soldiers.",
				
			},
			{
				name: "Command Mastery",
				description: "Perfect control over military magic and strategy.",
				
			},
			{
				name: "Army Rebirth",
				description: "Rally fallen troops and cheat death through sheer will.",
				
			},
			{
				name: "Command Authority",
				description: "Telepathic command over any being within 1 mile.",
				
			},
			{
				name: "Tactical Lord",
				description: "Subjugate enemy armies through strategic brilliance.",
				
			},
			{
				name: "War God",
				description: "Incarnate as the fundamental force of conflict.",
				
			},
			{
				name: "Tactical Command",
				description: "Absolute control over enemy leadership and intent.",
				
			},
			{
				name: "War Emperor",
				description: "Command entire planets and dimensions as one unit.",
				
			},
			{
				name: "Absolute War",
				description: "Total immunity while commanding; reshape reality by war.",
				
			},
			{
				name: "Command Ascendant",
				description:
					"You transcend mortal limitations, gaining the ability to exist as pure command and control armies across all dimensions.",
				
			},
			{
				name: "Tactical Lord",
				description:
					"You gain complete control over tactics and command, able to reshape entire worlds through strategy.",
				
			},
			{
				name: "Leadership God",
				description:
					"You become a living embodiment of leadership, able to command any army.",
				
			},
			{
				name: "Command Apocalypse",
				description:
					"Once per day, you can unleash a command apocalypse that transforms a 10-mile radius into absolute tactical control.",
				
			},
			{
				name: "Tactical Dominion",
				description:
					"You gain control over command itself, able to create or destroy any strategy.",
				
			},
			{
				name: "Essence God",
				description:
					"You can harvest and manipulate the essence of any being through command, gaining their tactical power.",
				
			},
			{
				name: "Command Reality",
				description:
					"You can reshape reality itself through command, creating worlds of pure tactical supremacy.",
				
			},
			{
				name: "Tactical God",
				description:
					"You become a master of all command, able to create and destroy through strategy.",
				
			},
			{
				name: "Leadership Emperor",
				description:
					"Your command extends across all realities, allowing you to control entire universes.",
				
			},
			{
				name: "Command Transcendence",
				description:
					"You transcend the concept of command, becoming a fundamental force of tactical power that cannot be contained.",
				
			},
			{
				name: "Tactical Emperor",
				description:
					"You gain mastery over command itself, able to create concepts of strategy from nothing.",
				
			},
			{
				name: "Essence Emperor",
				description:
					"You can absorb and control the command essence of entire worlds, gaining their collective power.",
				
			},
			{
				name: "Command Omnipotence",
				description:
					"You achieve true omnipotence within the command domain, able to control all armies across all timelines.",
				
			},
			{
				name: "Tactical Regent",
				description:
					"Your command power extends across the multiverse, allowing you to reshape entire universes.",
				
			},
			{
				name: "Leadership Regent",
				description:
					"You become the ultimate authority over command and leadership, able to determine the fate of all existence.",
				
			},
			{
				name: "Command Supremacy",
				description:
					"You achieve absolute supremacy over all command, becoming the source and master of all tactical power.",
				
			},
			{
				name: "Absolute Command",
				description:
					"You become the embodiment of absolute tactical power, a force beyond comprehension that exists outside all laws of reality.",
				
			},
			{
				name: "Regent Power",
				description:
					"You achieve the full power of a Regent at their peak - the ability to command infinite armies of your element, reshape reality, control all dimensions, master your domain completely, and transcend to become a fundamental force of the multiverse. This is the ultimate power of a Regent, equal to all other Regents at their maximum potential.",
				
			},
		],
		mechanics: {
			stat_bonuses: {
				strength: 2,
				agility: 2,
				vitality: 4,
				intelligence: 4,
				sense: 4,
				presence: 6,
			},
			special_abilities: [
				"Immune to fear and charm effects",
				"Can communicate telepathically with any creature",
				"Can command any army or group",
				"Commanders are automatically respectful toward you",
			],
			restrictions: [
				"Requires Warden verification of quest completion",
				"Once chosen, cannot be changed without Warden approval",
			],
		},
		progression_table: {
			"1": {
				features_gained: [
					"Warlord's Command",
					"Leadership Aura",
					"War Dominion",
				],
				abilities_improved: [],
			},
			"2": {
				features_gained: ["Vanguard Step", "Regent Power Resonance"],
				abilities_improved: [],
			},
			"3": {
				features_gained: ["Conquest", "Command Mastery", "Leadership Presence"],
				abilities_improved: [],
			},
			"4": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"5": {
				features_gained: ["Tactical Step", "Command Authority", "Army Rebirth"],
				abilities_improved: [],
			},
			"6": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"7": {
				features_gained: ["Command Shield", "War God", "Tactical Lord"],
				abilities_improved: [],
			},
			"8": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"9": {
				features_gained: ["War Dominion", "Tactical Command", "War Emperor"],
				abilities_improved: [],
			},
			"10": {
				features_gained: ["Vanguard Authority", "Absolute War"],
				abilities_improved: [],
			},
			"11": {
				features_gained: [
					"Command Ascendant",
					"Tactical Lord",
					"Leadership God",
				],
				abilities_improved: [],
			},
			"12": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"13": {
				features_gained: [
					"Command Apocalypse",
					"Tactical Dominion",
					"Essence God",
				],
				abilities_improved: [],
			},
			"14": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"15": {
				features_gained: [
					"Command Reality",
					"Tactical God",
					"Leadership Emperor",
				],
				abilities_improved: [],
			},
			"16": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"17": {
				features_gained: [
					"Command Transcendence",
					"Tactical Emperor",
					"Essence Emperor",
				],
				abilities_improved: [],
			},
			"18": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"19": {
				features_gained: [
					"Command Omnipotence",
					"Tactical Regent",
					"Leadership Regent",
				],
				abilities_improved: [],
			},
			"20": {
				features_gained: [
					"Command Supremacy",
					"Absolute Command",
					"Regent Power",
				],
				abilities_improved: ["Primary Ability +2"],
			},
		},
	},
	{
		id: "frost_regent",
		name: "Frost Regent",
		title: "Frost Regent (Regent of Frost)",
		theme: "Eternal Winter & absolute Zero",
		description:
			"Herald of eternal winter and absolute zero, wielding the power of the Regent of Frost. You command the biting winds, glacial shards, and the crystalline silence of the void. Your presence freezes the very soul of the world, turning landscapes into frozen wastes of pure order. The Ascendant Bureau classifies you as a Climate Catastrophe event, capable of bringing a global ice age.",
		rank: "S",
		image: getRegentPortraitUrl("frost_regent"),
		type: "ascendant-class-overlay",
		tags: [
			"regent",
			"frost",
			"cold",
			"winter",
			"eternal_of_frost",
			"ice",
			"glacio-regency",
		],
		created_at: "2026-02-26T00:00:00.000Z",
		source_book: "Rift Ascendant Canon",
		flavor:
			"A specialized manifestation of Regent Resonance. This form allows the caster to weave the Frost Regent into an Absolute Decree.",
		lore: "The Frost Regent is an Ascendant class overlay that represents the pinnacle of its respective domain. Its historical records are sealed by the Wardens.",
		hit_dice: "1d10",
		primary_ability: ["Intelligence", "Sense"],
		saving_throws: ["Intelligence", "Sense"],
		skill_proficiencies: [
			"Mana Flow",
			"Investigation",
			"Rift Topology",
			"Perception",
		],
		armor_proficiencies: ["Light Mana-Weave Armor", "Medium Aether Armor"],
		weapon_proficiencies: ["Awakened Weapons", "Rift-Forged Weapons"],
		tool_proficiencies: [],
		class_features: [
			{
				level: 1,
				name: "Ice Age Decree",
				description:
					"As an action, create a 5-mile radius supernatural ice storm for 8 hours. The temperature drops to -100°C instantly, freezing all water sources and making fire damage impossible. Non-magical fires are instantly extinguished, and fire spells deal half damage. This mirrors the Regent of Frost's climate-shattering power. You can use this once per long rest.",
				type: "action",
				frequency: "long-rest",
				uses: 1,
				recovery: "long-rest",
			},
			{
				level: 1,
				name: "Frost Dominion",
				description:
					"You are immune to cold damage and have resistance to fire damage. You cannot slip on ice and move at full speed on frozen surfaces. Additionally, you can see clearly through snow, ice, and freezing fog.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 2,
				name: "Regent Power Resonance",
				description:
					"Your Regent abilities resonate with cosmic power. Gain +1 to the Regent Resonance pool maximum.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 3,
				name: "Absolute Zero Touch",
				description:
					"As a melee spell attack, channel the boundary of absolute zero through your touch. The target takes 10d10 cold damage and must make a Vitality saving throw (DC 8 + PB + INT) or be paralyzed for 1 minute. If this damage reduces a creature to 0 hit points, they become a permanent ice statue at -273.15°C and cannot be resurrected by any means short of Wish. You can use this once per short rest.",
				type: "action",
				frequency: "short-rest",
				uses: 1,
				recovery: "short-rest",
			},
			{
				level: 3,
				name: "Glacial Eternity",
				description:
					"As an action, create a 60-foot radius zone of temporal slowdown for 1 minute (concentration). Enemies within the area have their speed halved, have disadvantage on Agility saving throws, and cannot take reactions. Time appears to slow as heat is drained from the area. You can use this a number of times equal to your proficiency bonus per long rest.",
				type: "action",
				frequency: "long-rest",
				uses: "PB",
				recovery: "long-rest",
			},
			{
				level: 4,
				name: "Regent Attribute Enhancement",
				description: "Increase one primary ability score (Intelligence or Sense) by +2.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 5,
				name: "Winter's Immortality",
				description:
					"You are immune to cold damage, fire damage, and aging effects. While in freezing temperatures (below 0°C), you regenerate 20 hit points at the start of each of your turns. If you are reduced to 0 hit points in freezing conditions, you automatically stabilize and do not make death saving throws.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 6,
				name: "Regent Power Resonance",
				description:
					"Your Regent abilities resonate with cosmic power. Gain +1 to the Regent Resonance pool maximum.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 7,
				name: "Cryogenic Prison",
				description:
					"As an action, encase a target you can see within 60 feet in a sphere of absolute-zero ice. The target must make a Vitality saving throw (DC 8 + PB + INT + 2). On a failure, they are imprisoned indefinitely in suspended animation and cannot be freed except by Wish, divine intervention, or your will. Once per long rest.",
				type: "action",
				frequency: "long-rest",
				uses: 1,
				recovery: "long-rest",
			},
			{
				level: 8,
				name: "Regent Attribute Enhancement",
				description: "Increase one primary ability score (Intelligence or Sense) by +2.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 9,
				name: "Temporal Frost",
				description:
					"As an action, freeze time itself in a 120-foot radius centered on you for 1 round. Only you can act during this frozen moment. This reflects your absolute thermodynamic authority. Creatures and objects are frozen mid-motion. Once per long rest.",
				type: "action",
				frequency: "long-rest",
				uses: 1,
				recovery: "long-rest",
			},
			{
				level: 10,
				name: "Absolute Frost",
				description:
					"All cold damage you deal is maximized (treat all damage dice as if they rolled their maximum value). Additionally, ice structures and objects you create are permanent and indestructible by non-magical means.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 11,
				name: "Frost Ascendant",
				description:
					"You transcend mortal thermodynamic limitations, gaining the ability to exist as pure absolute zero. You can become incorporeal as a bonus action (immune to physical damage, can pass through solid matter). While incorporeal, you can command cold across all dimensions.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 11,
				name: "Temporal Lord",
				description:
					"As an action, you gain complete control over the entropy of time within a city block-sized area (up to 500 feet radius). You can freeze specific moments in space-time, creating temporal stasis fields that prevent all change and motion.",
				type: "action",
				frequency: "at-will",
			},
			{
				level: 11,
				name: "Ice God",
				description:
					"You become a living embodiment of eternal winter. You can manifest glacial continents and reshape the climate of entire worlds at will. Your Ice Age Decree now affects a 50-mile radius and lasts 7 days.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 12,
				name: "Regent Attribute Enhancement",
				description: "Increase one primary ability score (Intelligence or Sense) by +2.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 13,
				name: "Frost Apocalypse",
				description:
					"As an action, unleash a frost apocalypse that covers a 10-mile radius in absolute zero, instantly stopping all molecular motion. All creatures in the area take 20d10 cold damage (Vitality save DC 8 + PB + INT + 4 for half) and are paralyzed for 1 minute. Structures take maximum damage. Once per day.",
				type: "action",
				frequency: "once-per-day",
				uses: 1,
				recovery: "long-rest",
			},
			{
				level: 13,
				name: "Time Dominion",
				description:
					"As an action, you gain control over the flow of time within your frozen zones. You can reverse events up to 1 minute in the past or accelerate time up to 1 hour in the future within a 120-foot radius. Living creatures must make an Intelligence save (DC 8 + PB + INT) or be affected.",
				type: "action",
				frequency: "at-will",
			},
			{
				level: 13,
				name: "Cryo God",
				description:
					"As an action, you can harvest and manipulate the thermal essence of any being through freezing. Target one creature within 60 feet and make a melee spell attack. On hit, you gain one of their abilities, memories, or traits permanently through cryo-archiving. Once per long rest.",
				type: "action",
				frequency: "long-rest",
				uses: 1,
				recovery: "long-rest",
			},
			{
				level: 14,
				name: "Regent Power Resonance",
				description:
					"Your Regent abilities resonate with cosmic power. Gain +1 to the Regent Resonance pool maximum.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 15,
				name: "Frost Reality",
				description:
					"As an action, you can reshape reality itself through the concept of entropy. Create worlds of perfect crystalline order and rewrite physical laws within a 1-mile radius. This transformation is permanent until you choose to reverse it. Once per long rest.",
				type: "action",
				frequency: "long-rest",
				uses: 1,
				recovery: "long-rest",
			},
			{
				level: 15,
				name: "Temporal God",
				description:
					"You become a master of chronological stasis, able to create and destroy through the suspension of time. You can age or de-age objects and creatures at will, and your Temporal Frost now affects a 500-foot radius.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 15,
				name: "Ice Emperor",
				description:
					"Your freezing power extends across all realities, allowing you to bring heat-death to entire universes. You can create permanent portals to frozen dimensions and command all ice-based entities.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 16,
				name: "Regent Attribute Enhancement",
				description: "Increase one primary ability score (Intelligence or Sense) by +2.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 17,
				name: "Frost Transcendence",
				description:
					"You transcend the concept of temperature, becoming a fundamental force of stasis that cannot be influenced by energy or heat. You are immune to all damage except psychic and radiant.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 17,
				name: "Time Emperor",
				description:
					"You gain mastery over time itself, able to create concepts of history and future from the frozen present. You can rewind time up to 1 hour for yourself or a single creature once per day.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 17,
				name: "Cryo Emperor",
				description:
					"You can absorb and control the thermal essence of entire worlds, gaining their collective power by halting their entropy. Your cold damage ignores all resistances and immunities.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 18,
				name: "Regent Power Resonance",
				description:
					"Your Regent abilities resonate with cosmic power. Gain +1 to the Regent Resonance pool maximum.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 19,
				name: "Frost Omnipotence",
				description:
					"You achieve true omnipotence within the domain of stasis, able to control all thermodynamic states across all timelines. You can freeze entire planets instantly.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 19,
				name: "Temporal Regent",
				description:
					"Your temporal power extends across the multiverse, allowing you to freeze or restart entire universes at will. You exist outside of time and cannot be aged or affected by temporal magic.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 19,
				name: "Ice Regent",
				description:
					"You become the ultimate authority over order and entropy, able to determine the final frozen state of all existence. Your presence lowers ambient temperature by 100°C in a 1-mile radius.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 20,
				name: "Frost Supremacy",
				description:
					"You achieve absolute supremacy over all thermal forces, becoming the source and master of all universal stasis. Once per day, you can invoke a global ice age affecting an entire planet.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 20,
				name: "Absolute Frost",
				description:
					"You become the embodiment of absolute zero, a force beyond comprehension that exists outside the reach of thermodynamics. You are immune to all damage, and all creatures within 1000 feet take 10d10 cold damage at the start of their turn (no save).",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 20,
				name: "Regent Power",
				description:
					"You achieve the full power of a Regent at their peak - the ability to command infinite energies of your element, reshape reality, control all dimensions, master your domain completely, and transcend to become a fundamental force of the multiverse.",
				type: "passive",
				frequency: "at-will",
			},
		],
		spellcasting: {
			ability: "Intelligence",
			spell_slots: {
				"1st": [4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4],
				"2nd": [2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4],
				"3rd": [0, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4],
				"4th": [0, 0, 0, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4],
				"5th": [0, 0, 0, 0, 1, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4],
				"6th": [0, 0, 0, 0, 0, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4],
				"7th": [0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4],
				"8th": [0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 4],
				"9th": [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 4],
			},
			cantrips_known: REGENT_CANTRIPS_KNOWN,
			spells_known: REGENT_SPELLS_KNOWN,
			spell_preparation: false,
			additional_spells: [
				"spell-sup-0-4-lattice-ping",
				"spell-sup-1-23-frost-lattice",
				"spell-sup-3-61-mana-barrage",
				"spell-sup-5-83-mana-storm",
				"spell-sup-7-102-temporal-fracture",
			],
		},
		progression_table: {
			"1": {
				features_gained: ["Ice Age Decree", "Frost Dominion"],
				abilities_improved: [],
			},
			"2": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"3": {
				features_gained: ["Absolute Zero Touch", "Glacial Eternity"],
				abilities_improved: [],
			},
			"4": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"5": {
				features_gained: ["Winter's Immortality"],
				abilities_improved: [],
			},
			"6": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"7": {
				features_gained: ["Cryogenic Prison"],
				abilities_improved: [],
			},
			"8": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"9": {
				features_gained: ["Temporal Frost"],
				abilities_improved: [],
			},
			"10": {
				features_gained: ["Absolute Frost"],
				abilities_improved: [],
			},
			"11": {
				features_gained: ["Frost Ascendant", "Temporal Lord", "Ice God"],
				abilities_improved: [],
			},
			"12": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"13": {
				features_gained: ["Frost Apocalypse", "Time Dominion", "Cryo God"],
				abilities_improved: [],
			},
			"14": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"15": {
				features_gained: ["Frost Reality", "Temporal God", "Ice Emperor"],
				abilities_improved: [],
			},
			"16": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"17": {
				features_gained: [
					"Frost Transcendence",
					"Time Emperor",
					"Cryo Emperor",
				],
				abilities_improved: [],
			},
			"18": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"19": {
				features_gained: ["Frost Omnipotence", "Temporal Regent", "Ice Regent"],
				abilities_improved: [],
			},
			"20": {
				features_gained: ["Frost Supremacy", "Absolute Frost", "Regent Power"],
				abilities_improved: ["Primary Ability +2"],
			},
		},
		mechanics: {
			stat_bonuses: {
				strength: 2,
				agility: 2,
				vitality: 6,
				intelligence: 8,
				sense: 4,
				presence: 2,
			},
			special_abilities: [
				"Immune to cold damage",
				"Resistance to fire damage",
				"Cannot slip on ice",
				"Slow time within 60-ft radius",
			],
			restrictions: [
				"Requires Warden verification of quest completion",
				"Once chosen, cannot be changed without Warden approval",
			],
		},
		requirements: {
			quest_completion: "Complete the Trial of the Frost Gate",
			warden_verification: true,
			prerequisite_job: "Any base job",
		},
		},
	{
		id: "beast_regent",
		levelChoices: [
			{
				level: 1,
				type: "power",
				count: 2,
				source: "regent-powers",
				options: ["power-sup-example-1", "power-sup-example-2"]
			},
			{
				level: 1,
				type: "technique",
				count: 2,
				source: "regent-techniques",
				options: ["tech-sup-example-1", "tech-sup-example-2"]
			}
		],
		powersKnown: REGENT_POWERS_KNOWN,
		techniquesKnown: REGENT_TECHNIQUES_KNOWN,
		name: "Beast Regent",
		title: "Beast Regent (Regent of Beasts)",
		theme: "Primal Evolution & Apex Regentty",
		description:
			"Avatar of primordial evolution and regent of the wild, wielding the power of the Regent of Beasts. All creatures recognize you as the ultimate alpha, and your roar can shatter the instincts of any living being. You embody the perfect predatory form, adaptive and unstoppable. The Ascendant Bureau classifies you as an Alpha-class biodiversity threat.",
		rank: "S",
		image: getRegentPortraitUrl("beast_regent"),
		type: "ascendant-class-overlay",
		tags: [
			"regent",
			"beast",
			"primal",
			"evolution",
			"eternal_of_beasts",
			"nature",
		],
		created_at: "2026-02-26T00:00:00.000Z",
		source_book: "Rift Ascendant Canon",
		flavor:
			"A specialized manifestation of Regent Resonance. This form allows the caster to weave the Beast Regent into an Absolute Decree.",
		lore: "The Beast Regent is an Ascendant class overlay that represents the pinnacle of its respective domain. Its historical records are sealed by the Wardens.",
		hit_dice: "1d12",
		primary_ability: ["Strength", "Vitality"],
		saving_throws: ["Strength", "Vitality"],
		skill_proficiencies: [
			"Athletics",
			"Beast Taming",
			"Rift Topology",
			"Survival",
		],
		armor_proficiencies: [
			"Light Mana-Weave Armor",
			"Medium Aether Armor",
			"Mana Shields",
		],
		weapon_proficiencies: ["Awakened Weapons", "Rift-Forged Weapons"],
		tool_proficiencies: [],
		requirements: {
			quest_completion: "Complete the Trial of the Beast Gate",
			warden_verification: true,
			prerequisite_job: "Any base job",
		},
		powersKnown: REGENT_POWERS_KNOWN,
		techniquesKnown: REGENT_TECHNIQUES_KNOWN,
		class_features: [
			{
				level: 1,
				name: "Apex Form",
				description:
					"As an action, transform into a gargantuan primordial beast for 10 minutes. You gain +6 to Strength, Agility, and Vitality (maximum 26 in each), natural weapons that deal 3d10 + STR damage, and regenerate 15 hit points at the start of your turn. Your size becomes Gargantuan, and you gain tremorsense 120 feet as you become the ultimate evolutionary apex predator. You can use this a number of times equal to your proficiency bonus per long rest.",
				type: "action",
				frequency: "long-rest",
				uses: "PB",
				recovery: "long-rest",
			},
			{
				level: 1,
				name: "Alpha's Presence",
				description:
					"You emit a constant 120-foot aura of primal dominance. All beasts within this range automatically recognize you as the alpha and become friendly to you (even if hostile). Hostile non-beast creatures must make a Sense saving throw (DC 8 + PB + STR) when they start their turn in the aura or be frightened of you until the start of their next turn.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 2,
				name: "Regent Power Resonance",
				description:
					"Your Regent abilities resonate with cosmic power. Gain +1 to the Regent Resonance pool maximum.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 2,
				name: "Beast King's Call",
				description:
					"As an action, exert mental command over all beasts within a 10-mile radius with a CR equal to or less than your level. They obey your orders absolutely for 1 hour. During this time, zoo animals may break containment, police K-9 units refuse to engage you, and wild animals treat you as their pack leader. Once per day.",
				type: "action",
				frequency: "once-per-day",
				uses: 1,
				recovery: "long-rest",
				mechanics: {
					summoned_creatures: "All beasts within 10 miles, CR ≤ level",
					duration: "1 hour",
					persistence: "commanded beasts persist until duration ends or you dismiss them (bonus action)",
				},
			},
			{
				level: 3,
				name: "Primordial Regeneration",
				description:
					"Your cellular structure adapts with impossible speed. You can regrow lost limbs in 1 minute. At the start of your turn, if you are below half your maximum hit points, you regain 25 hit points. You are immune to aging effects and all diseases.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 4,
				name: "Regent Attribute Enhancement",
				description: "Increase one primary ability score (Strength or Vitality) by +2.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 5,
				name: "Evolutionary Leap",
				description:
					"As a bonus action, adapt your physical form to any environment or situation. You can grow gills (breathe underwater), wings (fly speed 60 ft), thermal insulation (immunity to extreme heat or cold), claws (natural weapons), or other biological adaptations as needed. The adaptation lasts until you dismiss it or choose a new one.",
				type: "bonus-action",
				frequency: "at-will",
			},
			{
				level: 6,
				name: "Regent Power Resonance",
				description:
					"Your Regent abilities resonate with cosmic power. Gain +1 to the Regent Resonance pool maximum.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 7,
				name: "Pack Tactics",
				description:
					"All allies within 30 feet of you gain advantage on attack rolls against any creature you've damaged since the start of your last turn. This bonus represents your alpha coordination.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 8,
				name: "Regent Attribute Enhancement",
				description: "Increase one primary ability score (Strength or Vitality) by +2.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 9,
				name: "Extinction Event",
				description:
					"As an action, unleash a primal roar that creates a 1-mile radius of absolute predatory dominance. All hostile creatures in the area take 6d10 force damage and must make a Sense saving throw (DC 8 + PB + STR + 2) or be frightened for 1 minute. Frightened creatures can repeat the save at the end of each of their turns. Once per long rest.",
				type: "action",
				frequency: "long-rest",
				uses: 1,
				recovery: "long-rest",
			},
			{
				level: 10,
				name: "Absolute Beast",
				description:
					"Your Apex Form becomes permanent - you can maintain it indefinitely without concentration or time limits. You can command any beast anywhere in the world telepathically. You are immune to all physical damage (bludgeoning, piercing, slashing) from non-magical sources.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 11,
				name: "Beast Ascendant",
				description:
					"You transcend mortal biological limitations, gaining the ability to exist as the concept of the primal apex. You can become incorporeal as a bonus action (immune to physical damage, can pass through solid matter). While corporeal, you command nature across all dimensions.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 11,
				name: "Primal Lord",
				description:
					"As an action, you gain complete control over the instincts of all living things within a 500-foot radius. You can command entire ecosystems as a single hive mind, directing their behavior perfectly.",
				type: "action",
				frequency: "at-will",
			},
			{
				level: 11,
				name: "Evolution God",
				description:
					"You become a living embodiment of the evolutionary process. You can mutate and adapt your form instantly and permanently. Additionally, you can grant evolutionary adaptations to allies within 60 feet as a bonus action.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 12,
				name: "Regent Attribute Enhancement",
				description: "Increase one primary ability score (Strength or Vitality) by +2.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 13,
				name: "Beast Apocalypse",
				description:
					"As an action, unleash a beast apocalypse that causes all animals within a 10-mile radius to swarm and destroy everything in their path. All non-ally creatures take 15d10 damage from the stampede (Agility save DC 8 + PB + STR + 4 for half). The stampede lasts for 1 hour. Once per day.",
				type: "action",
				frequency: "once-per-day",
				uses: 1,
				recovery: "long-rest",
			},
			{
				level: 13,
				name: "Primal Dominion",
				description:
					"As an action, you gain control over the wild itself. You can transform urban landscapes into primordial jungles instantly within a 1-mile radius. The transformation is permanent until you reverse it.",
				type: "action",
				frequency: "at-will",
			},
			{
				level: 13,
				name: "Essence God",
				description:
					"As an action, you can harvest and manipulate the biological essence of any being through the hunt. Target one creature within 60 feet. Make a melee attack. On hit, you gain one of their predatory powers, abilities, or traits permanently. Once per long rest.",
				type: "action",
				frequency: "long-rest",
				uses: 1,
				recovery: "long-rest",
			},
			{
				level: 14,
				name: "Regent Power Resonance",
				description:
					"Your Regent abilities resonate with cosmic power. Gain +1 to the Regent Resonance pool maximum.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 15,
				name: "Beast Reality",
				description:
					"As an action, you can reshape reality itself through the law of the jungle. Create untamed worlds and rewrite the food chain within a 5-mile radius. The changes are permanent until you reverse them. Once per long rest.",
				type: "action",
				frequency: "long-rest",
				uses: 1,
				recovery: "long-rest",
			},
			{
				level: 15,
				name: "Primal God",
				description:
					"You become a master of all biological life, able to create and destroy through the concept of the absolute predator. Your natural weapons now deal an additional 6d10 damage.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 15,
				name: "Evolution Emperor",
				description:
					"Your evolutionary power extends across all realities, allowing you to rewrite the genetic code of creatures in entire universes. You can grant or remove evolutionary traits at will.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 16,
				name: "Regent Attribute Enhancement",
				description: "Increase one primary ability score (Strength or Vitality) by +2.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 17,
				name: "Beast Transcendence",
				description:
					"You transcend the concept of the individual, becoming a fundamental force of the wild that exists in every predator simultaneously. You cannot be permanently killed unless all predators in existence are destroyed.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 17,
				name: "Primal Emperor",
				description:
					"You gain mastery over the life force of planets, able to create concepts of biodiversity from the void. You can spontaneously generate ecosystems.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 17,
				name: "Essence Emperor",
				description:
					"You can absorb and control the biological essence of entire worlds, gaining their collective genetic power. Your physical abilities have no maximum.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 18,
				name: "Regent Power Resonance",
				description:
					"Your Regent abilities resonate with cosmic power. Gain +1 to the Regent Resonance pool maximum.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 19,
				name: "Beast Omnipotence",
				description:
					"You achieve true omnipotence within the biological domain, able to control all evolution across all timelines. You can instantly evolve or devolve any creature.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 19,
				name: "Primal Regent",
				description:
					"Your primal power extends across the multiverse, allowing you to reshape entire universes into savage paradises. Your Beast King's Call now affects all dimensions simultaneously.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 19,
				name: "Evolution Regent",
				description:
					"You become the ultimate authority over life and change, able to determine the final evolutionary state of all existence. You can create new species at will.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 20,
				name: "Beast Supremacy",
				description:
					"You achieve absolute supremacy over all biological forces, becoming the source and master of all natural selection. You can cause instant evolution on a planetary scale.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 20,
				name: "Absolute Beast",
				description:
					"You become the embodiment of the apex predator, a force beyond comprehension that exists as the pinnacle of all life. You are immune to all damage, and all creatures instinctively fear and respect you.",
				type: "passive",
				frequency: "at-will",
			},
			{
				level: 20,
				name: "Regent Power",
				description:
					"You achieve the full power of a Regent at their peak - the ability to command infinite biological forces, reshape reality, control all dimensions, master your domain completely, and transcend to become a fundamental force of the multiverse.",
				type: "passive",
				frequency: "at-will",
			},
		],
	},
	{
		id: "plague_regent",
		spellcasting: {
			ability: "Intelligence",
			spell_slots: REGENT_FULL_CASTER_SLOTS,
			cantrips_known: REGENT_CANTRIPS_KNOWN,
			spells_known: REGENT_SPELLS_KNOWN,
			spell_preparation: false,
			additional_spells: [
				"Poison Spray",
				"spell-sup-2-56-corrosive-aura",
				"Stinking Cloud",
				"Contagion",
				"spell-sup-4-77-phantom-swarm",
			],
		},
		name: "Plague Regent",
		title: "Plague Regent Ascendant Class",
		theme: "Pandemic Incarnate",
		description:
			"Incarnation of plague and pestilence. Walking miasma apocalypse. the Ascendant Bureau tracks 47 unknown pathogens in your wake. The Ascendant Bureau classifies you as a Cataclysm-class entity. Insects obey your will, diseases are your art form, and quarantine zones form wherever you walk. Healing sanctuaries refuse your admittance, biohazard teams follow your movements, and the Grand Healer Guilds have a dedicated task force assigned to you.",
		rank: "S",
		image: getRegentPortraitUrl("plague_regent"),
		type: "ascendant-class-overlay",
		tags: ["regent", "plague", "disease", "swarm", "class-overlay"],
		created_at: "2026-02-26T00:00:00.000Z",
		source_book: "Rift Ascendant Canon",
		flavor:
			"A specialized manifestation of Regent Resonance. This form allows the caster to weave the Plague Regent into an Absolute Decree.",
		lore: "The Plague Regent is an Ascendant class overlay that represents the pinnacle of its respective domain. Its historical records are sealed by the Wardens.",
		hit_dice: "1d10",
		primary_ability: ["Intelligence", "Sense"],
		saving_throws: ["Intelligence", "Vitality"],
		skill_proficiencies: ["Mana Flow", "Medicine", "Rift Topology", "Survival"],
		armor_proficiencies: ["Light Mana-Weave Armor"],
		weapon_proficiencies: ["Awakened Weapons"],
		tool_proficiencies: ["Poisoner's kit", "Herbalism kit"],
		class_features: [
			{
				name: "Pandemic Decree",
				description: "You unleash a global plague that consumes all resistance.",
				type: "action",
				frequency: "once-per-day",
				
				mechanics: { special_abilities: ["Diseases share common duration and cure lifecycle", "Split swarms persist indefinitely"] }
			},
			{
				name: "Regent Power Resonance",
				description: "Your abilities resonate with the power of the Regents, increasing their effectiveness and reducing cooldowns.",
				type: "passive",
				level: 1
			},
			{
				level: 1,
				name: "Typhoid Incarnate",
				description:
					"You emit a 60-foot aura of supernatural pestilence. Any creature entering the aura must make a VIT save (DC 8+prof+INT) or contract a disease that causes 4d12 necrotic damage per day and spreads to others. You see the infected via the Aether-sight as blighted souls. Only you or a Wish can cure it.",
				type: "passive",
			},
			{
				level: 1,
				name: "Insect God",
				description:
					"Command all insects within a 5-mile radius with a mental link. You can direct insect swarms to attack specific targets or create an Insect Plague effect at will. Food supplies collapse and biblical-level locust swarms follow in your wake.",
				type: "action",
				frequency: "at-will",
			},
			{
				level: 2,
				name: "Pandemic Decree",
				description:
					"You can design and release a supernatural pandemic once per month. You determine its transmission method (airborne, touch, or water), symptoms, and lethality. The disease spreads with an R0 of 10 and cannot be cured by conventional medicine or magic. The Ascendant displays [PANDEMIC STATUS: ACTIVE] and tracks the infection rate globally.",
				type: "action",
				frequency: "once-per-day",
			},
			{
				level: 3,
				name: "Billion Swarm",
				description:
					"Your physical form disintegrates into a massive swarm of billions of insects for up to 1 hour (1/long rest). In this form, you gain a fly speed of 60 feet, can squeeze through gaps as small as 1 inch, and are immune to all non-area-of-effect damage. You can split into multiple sub-swarms to overwhelm city blocks simultaneously.",
				type: "action",
				frequency: "long-rest",
			},
			{
				level: 5,
				name: "Pathogen Mastery",
				description:
					"Immune to all disease/poison. Detect diseases within 1 mile.",
				type: "passive",
			},
			{
				level: 7,
				name: "Plague Vector",
				description:
					"Touch: transfer any disease to target (no save). Cure any disease by touch.",
				type: "action",
				frequency: "at-will",
			},
			{
				level: 9,
				name: "miasma apocalypse",
				description:
					"1-mile radius: all organic matter begins rapid decay. 8d10 necrotic/round. 1/long rest.",
				type: "action",
				frequency: "long-rest",
			},
			{
				level: 10,
				name: "Absolute Plague",
				description:
					"Diseases you create are permanent, resist all curing. Swarm form is permanent toggle.",
				type: "passive",
			},
		],
		progression_table: {
			"1": {
				features_gained: ["Typhoid Incarnate", "Insect God"],
				abilities_improved: [],
			},
			"2": {
				features_gained: ["Pandemic Decree"],
				abilities_improved: [],
			},
			"3": {
				features_gained: ["Billion Swarm"],
				abilities_improved: [],
			},
			"4": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"5": {
				features_gained: ["Pathogen Mastery"],
				abilities_improved: [],
			},
			"6": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"7": {
				features_gained: ["Plague Vector"],
				abilities_improved: [],
			},
			"8": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"9": {
				features_gained: ["miasma apocalypse"],
				abilities_improved: [],
			},
			"10": {
				features_gained: ["Absolute Plague"],
				abilities_improved: [],
			},
			"11": {
				features_gained: ["Plague Ascendant", "Swarm Lord", "Disease God"],
				abilities_improved: [],
			},
			"12": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"13": {
				features_gained: [
					"Plague Apocalypse",
					"Swarm Dominion",
					"Pathogen God",
				],
				abilities_improved: [],
			},
			"14": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"15": {
				features_gained: ["Plague Reality", "Swarm God", "Disease Emperor"],
				abilities_improved: [],
			},
			"16": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"17": {
				features_gained: [
					"Plague Transcendence",
					"Swarm Emperor",
					"Pathogen Emperor",
				],
				abilities_improved: [],
			},
			"18": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"19": {
				features_gained: [
					"Plague Omnipotence",
					"Swarm Regent",
					"Disease Regent",
				],
				abilities_improved: [],
			},
			"20": {
				features_gained: [
					"Plague Supremacy",
					"Absolute Plague",
					"Regent Power",
				],
				abilities_improved: ["Primary Ability +2"],
			},
		},
		regent_requirements: {
			level: 10,
			abilities: {
				intelligence: 16,
		
			},
			quest_completion: "Complete the Trial of the Plague Gate",
			warden_approval: true,
		},
		requirements: {
			quest_completion: "Complete the Trial of the Plague Gate",
			warden_verification: true,
			prerequisite_job: "Any base job",
		},
		abilities: [
			{
				name: "Typhoid Incarnate",
				description: "60-ft disease aura. Incurable except by you.",
				type: "passive",
				frequency: "at-will",
				
			},
			{
				name: "Billion Swarm",
				description: "Dissolve into insect swarm. Immune to non-AoE.",
				type: "action",
				frequency: "long-rest",
				
			},
			{
				name: "miasma apocalypse",
				description: "1-mile decay zone. 8d10 necrotic/round.",
				type: "action",
				frequency: "long-rest",
				
			},
			{
				name: "Absolute Plague",
				description: "Permanent incurable diseases. Permanent swarm.",
				type: "passive",
				frequency: "at-will",
				
			},
		],
		features: [
			{
				name: "Typhoid Incarnate",
				description: "Permanent disease aura.",
				
			},
			{
				name: "Insect God",
				description: "Command insects within 5 miles.",
				
			},
			{
				name: "Pandemic Decree",
				description: "Create supernatural pandemics.",
				
			},
			{
				name: "Billion Swarm",
				description: "Insect swarm form.",
				
			},
			{
				name: "Pathogen Mastery",
				description: "Immune to disease/poison, detect diseases.",
				
			},
			{
				name: "Plague Vector",
				description: "Transfer or cure any disease.",
				
			},
			{
				name: "miasma apocalypse",
				description: "1-mile decay zone.",
				
			},
			{
				name: "Absolute Plague",
				description: "Permanent diseases, permanent swarm.",
				
			},
			{
				name: "Plague Ascendant",
				description:
					"You transcend biological limitations, gaining the ability to exist as pure pathogen and command decay across all dimensions.",
				
			},
			{
				name: "Swarm Lord",
				description:
					"You gain complete control over the hive mind of billions, able to command every insect and microorganism on a planetary scale.",
				
			},
			{
				name: "Disease God",
				description:
					"You become a living embodiment of pestilence, able to manifest any known or unknown sickness through pure will.",
				
			},
			{
				name: "Plague Apocalypse",
				description:
					"Once per day, you can unleash a continental pandemic that can sweep across entire landmasses in hours, ignoring all quarantines.",
				
			},
			{
				name: "Swarm Dominion",
				description:
					"You gain control over the space between cells, able to disassemble or reassemble matter through microscopic swarms.",
				
			},
			{
				name: "Pathogen God",
				description:
					"You can harvest and manipulate the biological essence of any being through infection, gaining their power as you rot their strength.",
				
			},
			{
				name: "Plague Reality",
				description:
					"You can reshape reality itself through the concept of decay, creating worlds of terminal beauty and rewriting biological laws.",
				
			},
			{
				name: "Swarm God",
				description:
					"You become a master of all collective consciousness, able to create and destroy through the billion-fold swarm.",
				
			},
			{
				name: "Disease Emperor",
				description:
					"Your pestilent power extends across all realities, allowing you to bring biological ruin to entire universes.",
				
			},
			{
				name: "Plague Transcendence",
				description:
					"You transcend the concept of life, becoming a fundamental force of decay that is the final stage of all existence.",
				
			},
			{
				name: "Swarm Emperor",
				description:
					"You gain mastery over the collective, able to create concepts of unity and division from nothing.",
				
			},
			{
				name: "Pathogen Emperor",
				description:
					"You can absorb and control the plague essence of entire worlds, gaining their collective power through their mass infection.",
				
			},
			{
				name: "Plague Omnipotence",
				description:
					"You achieve true omnipotence within the domain of decay, able to control all pathogens across all timelines.",
				
			},
			{
				name: "Swarm Regent",
				description:
					"Your swarm power extends across the multiverse, allowing you to reshape entire universes into one living hive.",
				
			},
			{
				name: "Disease Regent",
				description:
					"You become the ultimate authority over sickness and health, able to determine the final biological fate of all existence.",
				
			},
			{
				name: "Plague Supremacy",
				description:
					"You achieve absolute supremacy over all necrotic forces, becoming the source and master of all universal decay.",
				
			},
			{
				name: "Absolute Plague",
				description:
					"You become the embodiment of absolute decay, a force beyond comprehension that exists beyond the concept of life.",
				
			},
			{
				name: "Regent Power",
				description:
					"You achieve the full power of a Regent at their peak - the ability to command infinite energies of your element, reshape reality, control all dimensions, master your domain completely, and transcend to become a fundamental force of the multiverse.",
				
			},
		],
		mechanics: {
			stat_bonuses: {
				strength: 2,
				agility: 2,
				vitality: 4,
				intelligence: 4,
				sense: 2,
				presence: 2,
			},
			special_abilities: [
				"Immune to disease and poison",
				"Command insects within 5 miles",
				"Disease aura 60 ft",
				"Detect diseases within 1 mile",
			],
			restrictions: [
				"Requires Warden verification",
				"INT or SENSE 16+ required",
			],
		},
	},
	{
		id: "spatial_regent",
		spellcasting: {
			ability: "Intelligence",
			spell_slots: REGENT_FULL_CASTER_SLOTS,
			cantrips_known: REGENT_CANTRIPS_KNOWN,
			spells_known: REGENT_SPELLS_KNOWN,
			spell_preparation: false,
			additional_spells: [
				"Mage Hand",
				"spell-sup-1-28-phantom-step",
				"Dimension Door",
				"spell-sup-4-81-pact-gate",
				"Rift",
			],
		},
		name: "Spatial Regent",
		title: "Spatial Regent (Regent of Space)",
		theme: "Cosmic Weaving & Dimensional Void",
		description:
			"Regent of the void and master of the dimensional weave. You reshape space, time, and distance with absolute authority. Your Cosmic Senses allow you to perceive the very fabric of the multiverse. The Ascendant Bureau classifies you as a Dimensional Regentty Threat. You collapse distances, create pocket dimensions, and place anchors that bypass the laws of physics.",
		rank: "S",
		image: getRegentPortraitUrl("spatial_regent"),
		type: "ascendant-class-overlay",
		tags: ["regent", "spatial", "dimensional", "void", "class-overlay"],
		created_at: "2026-02-26T00:00:00.000Z",
		source_book: "Rift Ascendant Canon",
		flavor:
			"A specialized manifestation of Regent Resonance. This form allows the caster to weave the Spatial Regent into an Absolute Decree.",
		lore: "The Spatial Regent is an Ascendant class overlay that represents the pinnacle of its respective domain. Its historical records are sealed by the Wardens.",
		hit_dice: "1d8",
		primary_ability: ["Intelligence"],
		saving_throws: ["Intelligence", "Sense"],
		skill_proficiencies: [
			"Mana Flow",
			"Investigation",
			"Dimensional Lore",
			"Perception",
		],
		armor_proficiencies: ["Light Mana-Weave Armor"],
		weapon_proficiencies: ["Awakened Weapons"],
		tool_proficiencies: ["Cartographer's tools", "Navigator's tools"],
		class_features: [
			{
				name: "Reality Rewrite",
				description: "You rewrite the topology of space itself.",
				type: "action",
				frequency: "long-rest",
				
				mechanics: { special_abilities: ["Unwilling teleports require a save", "Permanent topology changes follow complete lifecycle"] }
			},
			{
				name: "Regent Power Resonance",
				description: "Your abilities resonate with the power of the Regents, increasing their effectiveness and reducing cooldowns.",
				type: "passive",
				level: 1
			},
			{
				level: 1,
				name: "Void Singularity",
				description:
					"You create a localized gravity well of pure void essence at a point within 120 feet. All creatures within a 20-foot radius are pulled toward the center and take 6d10 force damage. You perceive the blueprints of reality and can tear them apart to crush your enemies.",
				type: "action",
				frequency: "at-will",
			},
			{
				level: 1,
				name: "Planar Blink",
				description:
					"You achieve the ability to step through the dimensional lattice of the universe. As a bonus action, you can teleport up to 30 feet to any unoccupied space you can see. This 'blink' is instantaneous and creates a minor spatial ripple that only specialized sensors can detect.",
				type: "bonus-action",
				frequency: "at-will",
			},
			{
				level: 2,
				name: "Spatial Anchors",
				description:
					"You can place up to 12 invisible dimensional anchors anywhere in the multiverse. As an action, you can teleport between these anchors regardless of distance. These anchors are permanent and undetectable by normal means, appearing on your Ascendant Aether-Sight as [QUANTUM TUNNEL POINTS].",
				type: "action",
				frequency: "at-will",
			},
			{
				level: 3,
				name: "Dimensional Sanctum",
				description:
					"In your pocket dimensions or anchored zones: reshape the physical layout as a bonus action, control gravity per room, and decide who can enter.",
				type: "passive",
			},
			{
				level: 5,
				name: "Dimensional Lock",
				description:
					"Prevent all teleportation/plane shifting in 1-mile radius. 1 hour, 1/long rest.",
				type: "action",
				frequency: "long-rest",
			},
			{
				level: 7,
				name: "Lattice Vision",
				description:
					"See spatial weaknesses, hidden dimensions, and dimensional instabilities. Detect all portals/Rifts within 5 miles.",
				type: "passive",
			},
			{
				level: 9,
				name: "Reality Rewrite",
				description:
					"Reshape 1-mile area: change terrain, gravity direction, physics rules. Permanent. 1/week.",
				type: "action",
				frequency: "long-rest",
			},
			{
				level: 10,
				name: "Absolute Spatial",
				description:
					"Create demiplanes at will. All spatial folds are indestructible. Reality Rewrite becomes daily.",
				type: "passive",
			},
			{
				level: 11,
				name: "Spatial Ascendant",
				description:
					"You transcend mortal spatial limitations, gaining the ability to exist as the dimensional lattice itself and command space across all dimensions.",
				type: "passive",
			},
			{
				level: 11,
				name: "Void Lord",
				description:
					"You gain complete control over the vacuum of space, able to create localized absolute voids that erase matter and energy instantly.",
				type: "action",
				frequency: "at-will",
			},
			{
				level: 11,
				name: "Dimensional God",
				description:
					"You become a living gateway, able to manifest permanent stable wormholes between any two points in the multiverse.",
				type: "passive",
			},
			{
				level: 13,
				name: "Spatial Apocalypse",
				description:
					"Once per day, you can unleash a spatial apocalypse that causes all space within a 10-mile radius to collapse into a singularity, then expand into a new configuration.",
				type: "action",
				frequency: "once-per-day",
			},
			{
				level: 13,
				name: "Space Dominion",
				description:
					"You gain control over the metrics of distance, able to make miles feel like inches for allies and inches feel like miles for enemies.",
				type: "action",
				frequency: "at-will",
			},
			{
				level: 13,
				name: "Reality God",
				description:
					"You can harvest and manipulate the spatial essence of any being through dimensional folding, gaining their power by compressing their existence into yours.",
				type: "action",
				frequency: "long-rest",
			},
			{
				level: 15,
				name: "Spatial Reality",
				description:
					"You can reshape reality itself through the concept of the void, creating stable pocket universes with their own unique physical laws.",
				type: "action",
				frequency: "long-rest",
			},
			{
				level: 15,
				name: "Void God",
				description:
					"You become a master of all nothingness, able to create and destroy through the concept of absolute absence.",
				type: "passive",
			},
			{
				level: 15,
				name: "Dimensional Emperor",
				description:
					"Your dimensional power extends across all realities, allowing you to bridge or sever entire universes at will.",
				type: "passive",
			},
			{
				level: 17,
				name: "Spatial Transcendence",
				description:
					"You transcend the concept of location, becoming a fundamental force of connectivity that exists in the space between all things.",
				type: "passive",
			},
			{
				level: 17,
				name: "Space Emperor",
				description:
					"You gain mastery over the topology of planets, able to create concepts of distance and volume from the void.",
				type: "passive",
			},
			{
				level: 17,
				name: "Reality Emperor",
				description:
					"You can absorb and control the spatial essence of entire worlds, gaining their collective power by folding their history into the present.",
				type: "passive",
			},
			{
				level: 19,
				name: "Spatial Omnipotence",
				description:
					"You achieve true omnipotence within the domain of distance, able to control all spatial coordinates across all timelines.",
				type: "passive",
			},
			{
				level: 19,
				name: "Void Regent",
				description:
					"Your void power extends across the multiverse, allowing you to reshape entire universes into perfect vacuum or infinite expansion.",
				type: "passive",
			},
			{
				level: 19,
				name: "Dimensional Regent",
				description:
					"You become the ultimate authority over travel and boundaries, able to determine the final connectivity of all existence.",
				type: "passive",
			},
			{
				level: 20,
				name: "Spatial Supremacy",
				description:
					"You achieve absolute supremacy over all dimensional forces, becoming the source and master of all universal space.",
				type: "passive",
			},
			{
				level: 20,
				name: "Absolute Spatial",
				description:
					"You become the embodiment of Absolute Space, a force beyond comprehension that exists outside the reach of distance.",
				type: "passive",
			},
			{
				level: 20,
				name: "Regent Power",
				description:
					"You achieve the full power of a Regent at their peak - the ability to command infinite energies of your element, reshape reality, control all dimensions, master your domain completely, and transcend to become a fundamental force of the multiverse.",
				type: "passive",
			},
		],
		progression_table: {
			"1": {
				features_gained: ["Void Singularity", "Planar Blink"],
				abilities_improved: [],
			},
			"2": {
				features_gained: ["Spatial Anchors"],
				abilities_improved: [],
			},
			"3": {
				features_gained: ["Dimensional Sanctum"],
				abilities_improved: [],
			},
			"4": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"5": {
				features_gained: ["Dimensional Lock"],
				abilities_improved: [],
			},
			"6": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"7": {
				features_gained: ["Lattice Vision"],
				abilities_improved: [],
			},
			"8": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"9": {
				features_gained: ["Reality Rewrite"],
				abilities_improved: [],
			},
			"10": {
				features_gained: ["Absolute Spatial"],
				abilities_improved: [],
			},
			"11": {
				features_gained: ["Spatial Ascendant", "Void Lord", "Dimensional God"],
				abilities_improved: [],
			},
			"12": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"13": {
				features_gained: [
					"Spatial Apocalypse",
					"Space Dominion",
					"Reality God",
				],
				abilities_improved: [],
			},
			"14": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"15": {
				features_gained: ["Spatial Reality", "Void God", "Dimensional Emperor"],
				abilities_improved: [],
			},
			"16": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"17": {
				features_gained: [
					"Spatial Transcendence",
					"Space Emperor",
					"Reality Emperor",
				],
				abilities_improved: [],
			},
			"18": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"19": {
				features_gained: [
					"Spatial Omnipotence",
					"Void Regent",
					"Dimensional Regent",
				],
				abilities_improved: [],
			},
			"20": {
				features_gained: [
					"Spatial Supremacy",
					"Absolute Spatial",
					"Regent Power",
				],
				abilities_improved: ["Primary Ability +2"],
			},
		},
		mechanics: {
			stat_bonuses: {
				strength: 2,
				agility: 2,
				vitality: 2,
				intelligence: 8,
				sense: 4,
				presence: 2,
			},
			special_abilities: [
				"Create permanent demiplanes",
				"Instant spatial folding",
				"Teleport via spatial anchors",
				"Detect portals within 5 miles",
			],
			restrictions: [
				"Requires Warden verification of quest completion",
				"Once chosen, cannot be changed without Warden approval",
			],
		},
		requirements: {
			quest_completion: "Complete the Trial of the Spatial Rift",
			warden_verification: true,
			prerequisite_job: "Any base job",
		},
		},
	{
		id: "mimic_regent",
		powersKnown: REGENT_POWERS_KNOWN,
		techniquesKnown: REGENT_TECHNIQUES_KNOWN,
		name: "Mimic Regent",
		title: "Mimic Regent Ascendant Class",
		theme: "Infinite Forms",
		description:
			"Embodiment of infinite forms. Copy anything — creatures, objects, concepts. No detection possible. The Ascendant Bureau has contradictory records on you because you appear as a different person in every database. DNA tests return different results each time. Your awakening unlocked the ability to become ANYTHING you observe, perfectly and undetectably, making you the ultimate infiltrator, spy, and adaptive combatant.",
		rank: "S",
		image: getRegentPortraitUrl("mimic_regent"),
		type: "ascendant-class-overlay",
		tags: ["regent", "mimic", "shapeshifting", "adaptation", "class-overlay"],
		created_at: "2026-02-26T00:00:00.000Z",
		source_book: "Rift Ascendant Canon",
		flavor:
			"A specialized manifestation of Regent Resonance. This form allows the caster to weave the Mimic Regent into an Absolute Decree.",
		lore: "The Mimic Regent is an Ascendant class overlay that represents the pinnacle of its respective domain. Its historical records are sealed by the Wardens.",
		hit_dice: "1d10",
		primary_ability: ["Agility", "Presence"],
		saving_throws: ["Agility", "Presence"],
		skill_proficiencies: ["Deception", "Stealth", "Perception", "Performance"],
		armor_proficiencies: ["Light Mana-Weave Armor", "Medium Aether Armor"],
		weapon_proficiencies: ["Awakened Weapons", "Rift-Forged Weapons"],
		tool_proficiencies: ["Disguise kit", "Forgery kit"],
		class_features: [
			{
				level: 1,
				name: "Perfect Imitation",
				description:
					"You can transform yourself into any creature or object you have seen, from Tiny to Gargantuan, with a CR no higher than your character level. The transformation is instantaneous, lasts indefinitely, and is undetectable by magical or technological means. Your statistics are those of your chosen form, though you retain your mental ability scores and your hit points. You can revert as a bonus action.",
				type: "action",
				frequency: "at-will",
			},
			{
				level: 1,
				name: "Power Theft",
				description:
					"When you observe a creature using a feature, spell, or ability within 60 feet of you, you can use your reaction to archive a perfect copy of it. You can store a number of copied abilities equal to half your character level (rounded up). Each stored ability can be used a number of times equal to your proficiency bonus per long rest, after which it fades unless you observe it again. Abilities that exceed your character's tier in power can be archived but not activated until you reach the required level.",
				type: "reaction",
				frequency: "long-rest",
				uses: { formula: "PB", recharge: "long-rest" },
				tracking: "uses",
			},
			{
				level: 2,
				name: "Reactive Evolution",
				description:
					"When you take damage from an attack, you gain resistance to that damage type until the end of your next turn. When you fail a saving throw, you have advantage on the next saving throw of the same type you make within the next minute. These adaptations can occur once each per turn.",
				type: "reaction",
				frequency: "at-will",
			},
			{
				level: 3,
				name: "Quantum Existence",
				description:
					"As an action, once per long rest, you project a different apparent form to each observer within 60 feet of you for 1 hour. Creatures see you as whoever they trust, fear, or dismiss most — chosen by you. While this effect lasts, you have advantage on Deception and Persuasion checks against affected creatures.",
				type: "action",
				frequency: "long-rest",
			},
			{
				level: 4,
				name: "Regent Attribute Enhancement",
				description:
					"Your primary and secondary attributes increase by +2, reflecting your growing Regent power.",
				type: "passive",
				mechanics: { stat_bonuses: { agility: 2, presence: 2 } },
			},
			{
				level: 5,
				name: "Memory Access",
				description:
					"While using Perfect Imitation to mimic a specific creature you have personally observed, you can access a general echo of that creature's surface knowledge: its native language, a broad sense of its habits, and any skills it possesses. This does not reveal secret information or passwords.",
				type: "passive",
			},
			{
				level: 6,
				name: "Regent Power Resonance",
				description:
					"Your Regent powers resonate. The number of abilities you can store with Power Theft increases by 2, and each stored ability's uses per long rest increases by 1.",
				type: "passive",
			},
			{
				level: 7,
				name: "Form Archive",
				description:
					"You can store up to your character level in indexed forms in your Ascendant Archive. Switching to a stored form is a bonus action instead of an action.",
				type: "passive",
			},
			{
				level: 8,
				name: "Regent Attribute Enhancement",
				description:
					"Your primary and secondary attributes increase by another +2.",
				type: "passive",
				mechanics: { stat_bonuses: { agility: 2, presence: 2 } },
			},
			{
				level: 9,
				name: "Perfect Copy",
				description:
					"When you observe a creature using a legendary action, lair action, or regional effect, you can archive it with Power Theft. You also gain a passive ability: you can use the legendary actions of your current Imitation form once per long rest each.",
				type: "passive",
			},
			{
				level: 10,
				name: "Absolute Mimic",
				description:
					"Perfect Imitation no longer has a CR ceiling. You can mimic constructs, undead, and even a specific named individual with a permanent +5 bonus to checks made to maintain the disguise. Additionally, you can copy an abstract property (such as a creature's damage immunity or its fly speed) as a bonus action, retaining it for 1 hour.",
				type: "passive",
			},
			{
				level: 11,
				name: "Mimic Ascendant",
				description:
					"You transcend the limitations of a single form. You can now maintain two different Imitation forms simultaneously, occupying both at once across your body.",
				type: "passive",
			},
			{
				level: 11,
				name: "Form Lord",
				description:
					"As an action, once per long rest, you impose a physical transformation on one willing or incapacitated creature you touch, changing it into any form you specify (as per the Polymorph spell, except the duration is 8 hours). The target retains its mental scores.",
				type: "action",
				frequency: "long-rest",
			},
			{
				level: 11,
				name: "Copy God",
				description:
					"Your Power Theft now extends to abilities used by creatures you observe in recorded footage or within 120 feet. Additionally, Power Theft copies now persist until you choose to discard them, not merely until used.",
				type: "passive",
			},
			{
				level: 12,
				name: "Regent Attribute Enhancement",
				description:
					"Your primary and secondary attributes increase by another +2.",
				type: "passive",
				mechanics: { stat_bonuses: { agility: 2, presence: 2 } },
			},
			{
				level: 13,
				name: "Mimic Apocalypse",
				description:
					"Once per long rest as an action, every creature within 30 feet must succeed on a Presence saving throw against your Regent save DC or believe you are the person they most trust for 1 minute. Affected creatures treat you as an ally and will not willingly attack you while the effect lasts.",
				type: "action",
				frequency: "long-rest",
			},
			{
				level: 13,
				name: "Form Dominion",
				description:
					"Reactive Evolution now additionally grants immunity (rather than resistance) to the triggering damage type until the end of your next turn, and the immunity can stack with resistance from other sources.",
				type: "passive",
			},
			{
				level: 13,
				name: "Copy Dominion",
				description:
					"When you use a Power Theft ability, you add your Presence modifier to any attack rolls or saving throw DCs it uses, regardless of the original creature's statistics.",
				type: "passive",
			},
			{
				level: 14,
				name: "Regent Power Resonance",
				description:
					"Your Power Theft archive doubles in size (now equal to your character level), and abilities you archive gain an additional use per long rest.",
				type: "passive",
			},
			{
				level: 15,
				name: "Mimic Reality",
				description:
					"You can reshape your environment as well as yourself. Once per long rest, you can alter up to a 30-foot radius of terrain around you for 24 hours: changing surface types, adding or removing cover, or altering the light level.",
				type: "action",
				frequency: "long-rest",
			},
			{
				level: 15,
				name: "Form God",
				description:
					"Perfect Imitation can now mimic objects as well as creatures, including vehicles and installations up to Gargantuan size. You gain full use of any systems, weapons, or structural features of the form.",
				type: "passive",
			},
			{
				level: 15,
				name: "Copy Emperor",
				description:
					"Archived abilities you use via Power Theft deal maximum damage if they deal damage, once per long rest per ability.",
				type: "passive",
			},
			{
				level: 16,
				name: "Regent Attribute Enhancement",
				description:
					"Your primary and secondary attributes increase by another +2.",
				type: "passive",
				mechanics: { stat_bonuses: { agility: 2, presence: 2 } },
			},
			{
				level: 17,
				name: "Mimic Transcendence",
				description:
					"You no longer need to have observed a creature to mimic it — you can construct a plausible imitation of any described form. The resulting form has no special abilities derived from canon stat blocks, but it is visually perfect.",
				type: "passive",
			},
			{
				level: 17,
				name: "Form Emperor",
				description:
					"Form Archive now holds a number of indexed forms equal to twice your character level. Switching forms costs no action (part of any action).",
				type: "passive",
			},
			{
				level: 17,
				name: "Copy Transcendence",
				description:
					"Power Theft can now archive abilities that are entirely passive (auras, immunities, aura-based damage) for up to 1 hour each, refreshable each long rest.",
				type: "passive",
			},
			{
				level: 18,
				name: "Regent Power Resonance",
				description:
					"Your Regent powers reach their apex. Once per long rest as a reaction, when a Power Theft ability you use would fail (missed attack, creature succeeded on a save), you may immediately reuse that archived ability at no cost.",
				type: "passive",
			},
			{
				level: 19,
				name: "Mimic Omnipotence",
				description:
					"Your Perfect Imitation and all Power Theft effects become permanent until you choose to end them. You no longer need to concentrate on maintaining multiple forms.",
				type: "passive",
			},
			{
				level: 19,
				name: "Form Regent",
				description:
					"You can project up to three simultaneous separate illusory duplicates of yourself, each capable of independently acting and using stored Power Theft abilities on your behalf (each duplicate shares your initiative).",
				type: "passive",
			},
			{
				level: 19,
				name: "Copy Regent",
				description:
					"Power Theft archives now have unlimited uses per long rest.",
				type: "passive",
			},
			{
				level: 20,
				name: "Mimic Supremacy",
				description:
					"You achieve absolute supremacy over all transformational forces, becoming the source and master of all universal forms.",
				type: "passive",
			},
			{
				level: 20,
				name: "Absolute Mimic",
				description:
					"You become the embodiment of Absolute Form. You are permanently undetectable by any divination magic, technology, or ability. Your Power Theft archive is now unlimited.",
				type: "passive",
			},
			{
				level: 20,
				name: "Regent Power",
				description:
					"You achieve the full power of the Mimic Regent. Perfect Imitation can now mimic concepts rather than only physical forms — you can take on the identity of an abstract idea (invisibility, invulnerability) for 1 minute per long rest.",
				type: "action",
				frequency: "long-rest",
			},
		],
		progression_table: {
			"1": {
				features_gained: ["Perfect Imitation", "Power Theft"],
				abilities_improved: [],
			},
			"2": {
				features_gained: ["Reactive Evolution"],
				abilities_improved: [],
			},
			"3": {
				features_gained: ["Quantum Existence"],
				abilities_improved: [],
			},
			"4": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"5": {
				features_gained: ["Memory Access"],
				abilities_improved: [],
			},
			"6": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"7": {
				features_gained: ["Form Archive"],
				abilities_improved: [],
			},
			"8": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"9": {
				features_gained: ["Perfect Copy"],
				abilities_improved: [],
			},
			"10": {
				features_gained: ["Absolute Mimic"],
				abilities_improved: [],
			},
			"11": {
				features_gained: ["Mimic Ascendant", "Form Lord", "Copy God"],
				abilities_improved: [],
			},
			"12": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"13": {
				features_gained: ["Mimic Apocalypse", "Form Dominion", "Copy Dominion"],
				abilities_improved: [],
			},
			"14": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"15": {
				features_gained: ["Mimic Reality", "Form God", "Copy Emperor"],
				abilities_improved: [],
			},
			"16": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"17": {
				features_gained: [
					"Mimic Transcendence",
					"Form Emperor",
					"Copy Transcendence",
				],
				abilities_improved: [],
			},
			"18": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"19": {
				features_gained: ["Mimic Omnipotence", "Form Regent", "Copy Regent"],
				abilities_improved: [],
			},
			"20": {
				features_gained: ["Mimic Supremacy", "Absolute Mimic", "Regent Power"],
				abilities_improved: ["Primary Ability +2"],
			},
		},
		regent_requirements: {
			level: 11,
			abilities: {
				agility: 17,
			},
			quest_completion: "Complete the Trial of the Mimic Gate",
			warden_approval: true,
		},
		requirements: {
			quest_completion: "Complete the Trial of the Mimic Gate",
			warden_verification: true,
			prerequisite_job: "Any base job",
		},
		mechanics: {
			stat_bonuses: {
				strength: 2,
				agility: 4,
				vitality: 2,
				intelligence: 2,
				sense: 2,
				presence: 4,
			},
			special_abilities: [
				"Undetectable shapeshifting",
				"Copy any ability permanently",
				"Auto-adapt to threats",
				"Access mimicked memories",
			],
			restrictions: ["Requires Warden verification", "AGI or PRE 17+ required"],
		},
	},
	{
		id: "blood_regent",
		spellcasting: {
			ability: "Vitality",
			spell_slots: REGENT_FULL_CASTER_SLOTS,
			cantrips_known: REGENT_CANTRIPS_KNOWN,
			spells_known: REGENT_SPELLS_KNOWN,
			spell_preparation: false,
			additional_spells: [
				"Chill Touch",
				"False Life",
				"spell-sup-3-63-pact-hunger",
				"spell-sup-0-8-verdant-touch",
				"Circle of Death",
			],
		},
		name: "Blood Regent",
		title: "Blood Regent (Regent of Blood)",
		theme: "Hemomancy & Sanguine Regentty",
		description:
			"The ultimate authority of biological evolution and living mana-ichor, sharing the adaptive power of Lyra, the Queen of the Swarm. You control the fluid of life, turning it into a regent weapon that ignores the limitations of mortal biology. As a node of the Swarm-Heart, your presence accelerates the evolution of reality and cleanses the bloodlines of the world.",
		rank: "S",
		image: getRegentPortraitUrl("blood_regent"),
		type: "ascendant-class-overlay",
		tags: ["regent", "blood", "hemomancy", "life", "eternal_of_blood"],
		created_at: "2026-02-26T00:00:00.000Z",
		source_book: "Rift Ascendant Canon",
		flavor:
			"A specialized manifestation of Regent Resonance. This form allows the caster to weave the Blood Regent into an Absolute Decree.",
		lore: "The Blood Regent is an Ascendant class overlay that represents the pinnacle of its respective domain. Its historical records are sealed by the Wardens.",
		hit_dice: "1d10",
		primary_ability: ["Vitality", "Presence"],
		saving_throws: ["Vitality", "Presence"],
		skill_proficiencies: [
			"Medicine",
			"Persuasion",
			"Intimidation",
			"Mana Flow",
		],
		armor_proficiencies: ["Light Mana-Weave Armor", "Medium Aether Armor"],
		weapon_proficiencies: ["Awakened Weapons", "Rift-Forged Weapons"],
		tool_proficiencies: [],
		class_features: [
			{
				name: "Sanguine Rebirth",
				description: "When killed, you are reborn from the blood of your enemies.",
				type: "passive",
				
				mechanics: { special_abilities: ["Includes complete death-state lifecycle"] }
			},
			{
				name: "Blood Apocalypse",
				description: "You drain the blood of all enemies in a vast area.",
				type: "action",
				frequency: "long-rest",
				
			},
			{
				name: "Regent Power Resonance",
				description: "Your abilities resonate with the power of the Regents, increasing their effectiveness and reducing cooldowns.",
				type: "passive",
				level: 1
			},
			{
				level: 1,
				name: "Sanguine Command",
				description:
					"Control the blood of any creature you've damaged. They must make a VIT save or be forced to move or attack a target of your choice.",
				type: "action",
				frequency: "at-will",
			},
			{
				level: 1,
				name: "Blood Shield",
				description:
					"As a reaction to taking damage, create a shield of blood that reduces the damage by 2d10 + class level. You regain HP equal to half the damage reduced.",
				type: "reaction",
				frequency: "short-rest",
			},
			{
				level: 2,
				name: "Crimson Lance",
				description:
					"Form a spear of pressurized blood. Range 120 ft, 6d8 piercing + 4d8 necrotic. On hit, you regain 10 HP.",
				type: "action",
				frequency: "at-will",
			},
			{
				level: 3,
				name: "Life Drain Aura",
				description:
					"30-ft aura: enemies take 2d6 necrotic damage at start of turn, you gain total damage dealt as temporary HP.",
				type: "passive",
			},
			{
				level: 5,
				name: "Sanguine Rebirth",
				description:
					"When you drop to 0 HP, explode in a burst of blood (10d10 necrotic to all within 30 ft) and reappear at full HP. 1/long rest.",
				type: "passive",
			},
			{
				level: 7,
				name: "Hemocentric Control",
				description:
					"Stop the blood flow in a target. VIT save or paralyzed and 5d10 necrotic per turn until they succeed.",
				type: "action",
				frequency: "long-rest",
			},
			{
				level: 9,
				name: "Blood Apocalypse",
				description:
					"1-mile radius: drain the blood of all living things. All take 20d10 necrotic, you gain 1000 temporary HP. 1/week.",
				type: "action",
				frequency: "long-rest",
			},
			{
				level: 10,
				name: "Absolute Blood",
				description:
					"Immune to necrotic and poison. Any creature with blood is automatically detected by you within 1 mile.",
				type: "passive",
			},
			{
				level: 11,
				name: "Blood Ascendant",
				description:
					"You transcend mortal biological limitations, gaining the ability to exist as pure living ichor and command hemomancy across all dimensions.",
				type: "passive",
			},
			{
				level: 11,
				name: "Sanguine Lord",
				description:
					"You gain complete control over the bloodstream of any living entity, able to boil, freeze, or extract blood with a thought at any distance.",
				type: "action",
				frequency: "at-will",
			},
			{
				level: 11,
				name: "Life God",
				description:
					"You become a living reservoir of vitality, able to resurrect the dead or grant immortality to the living through the infusion of your divine blood.",
				type: "passive",
			},
			{
				level: 13,
				name: "Sanguine Cataclysm",
				description:
					"Once per day, you can unleash a blood cataclysm that causes all blood within a 10-mile radius to erupt from its hosts, forming a massive ocean under your command.",
				type: "action",
				frequency: "once-per-day",
			},
			{
				level: 13,
				name: "Life Dominion",
				description:
					"You gain control over the spark of life itself, able to animate non-living matter by infusing it with blood-essence.",
				type: "action",
				frequency: "at-will",
			},
			{
				level: 13,
				name: "Essence God",
				description:
					"You can harvest and manipulate the biological essence of any being through their blood, gaining their power and vitality permanently.",
				type: "action",
				frequency: "long-rest",
			},
			{
				level: 15,
				name: "Blood Reality",
				description:
					"You can reshape reality itself through the medium of life fluid, creating worlds of organic perfection and rewriting the laws of biology.",
				type: "action",
				frequency: "long-rest",
			},
			{
				level: 15,
				name: "Sanguine God",
				description:
					"You become a master of all hemomancy, able to create and destroy through the concept of the absolute life-force.",
				type: "passive",
			},
			{
				level: 15,
				name: "Life Emperor",
				description:
					"Your vital power extends across all realities, allowing you to sustain or extinguish the life-force of entire universes.",
				type: "passive",
			},
			{
				level: 17,
				name: "Blood Transcendence",
				description:
					"You transcend the concept of the body, becoming a fundamental force of life that exists in the pulse of every living thing.",
				type: "passive",
			},
			{
				level: 17,
				name: "Life Architect",
				description:
					"You gain mastery over the design of existence, able to create concepts of soul and metabolism from the void.",
				type: "passive",
			},
			{
				level: 17,
				name: "Essence Emperor",
				description:
					"You can absorb and control the vital essence of entire worlds, gaining their collective power by harvesting their history through their bloodline.",
				type: "passive",
			},
			{
				level: 19,
				name: "Blood Omnipotence",
				description:
					"You achieve true omnipotence within the sanguine domain, able to control all life and blood across all timelines.",
				type: "passive",
			},
			{
				level: 19,
				name: "Sanguine Regent",
				description:
					"Your hemomantic power extends across the multiverse, allowing you to reshape entire universes into one living blood-system.",
				type: "passive",
			},
			{
				level: 19,
				name: "Life Regent",
				description:
					"You become the ultimate authority over life and death, able to determine the final biological state of all existence.",
				type: "passive",
			},
			{
				level: 20,
				name: "Blood Supremacy",
				description:
					"You achieve absolute supremacy over all biological forces, becoming the source and master of all universal life.",
				type: "passive",
			},
			{
				level: 20,
				name: "Absolute Sanguinity",
				description:
					"You become the embodiment of Absolute Life, a force beyond comprehension that exists beyond the reach of death.",
				type: "passive",
			},
			{
				level: 20,
				name: "Regent Power",
				description:
					"You achieve the full power of a Regent at their peak - the ability to command infinite energies of your element, reshape reality, control all dimensions, master your domain completely, and transcend to become a fundamental force of the multiverse.",
				type: "passive",
			},
		],
		progression_table: {
			"1": {
				features_gained: ["Sanguine Command", "Blood Shield"],
				abilities_improved: [],
			},
			"2": {
				features_gained: ["Crimson Lance"],
				abilities_improved: [],
			},
			"3": {
				features_gained: ["Life Drain Aura"],
				abilities_improved: [],
			},
			"4": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"5": {
				features_gained: ["Sanguine Rebirth"],
				abilities_improved: [],
			},
			"6": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"7": {
				features_gained: ["Hemocentric Control"],
				abilities_improved: [],
			},
			"8": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"9": {
				features_gained: ["Blood Apocalypse"],
				abilities_improved: [],
			},
			"10": {
				features_gained: ["Absolute Blood"],
				abilities_improved: [],
			},
			"11": {
				features_gained: ["Blood Ascendant", "Sanguine Lord", "Life God"],
				abilities_improved: [],
			},
			"12": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"13": {
				features_gained: ["Sanguine Cataclysm", "Life Dominion", "Essence God"],
				abilities_improved: [],
			},
			"14": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"15": {
				features_gained: ["Blood Reality", "Sanguine God", "Life Emperor"],
				abilities_improved: [],
			},
			"16": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"17": {
				features_gained: [
					"Blood Transcendence",
					"Life Architect",
					"Essence Emperor",
				],
				abilities_improved: [],
			},
			"18": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"19": {
				features_gained: [
					"Blood Omnipotence",
					"Sanguine Regent",
					"Life Regent",
				],
				abilities_improved: [],
			},
			"20": {
				features_gained: [
					"Blood Supremacy",
					"Absolute Sanguinity",
					"Regent Power",
				],
				abilities_improved: ["Primary Ability +2"],
			},
		},
		mechanics: {
			stat_bonuses: {
				strength: 2,
				agility: 2,
				vitality: 8,
				intelligence: 2,
				sense: 2,
				presence: 6,
			},
			special_abilities: [
				"Sense all living beings within 1 mile",
				"Regen HP when dealing damage",
				"Immune to bloodborne diseases",
				"Control blood of enemies",
			],
			restrictions: [
				"Requires Warden verification of quest completion",
				"Once chosen, cannot be changed without Warden approval",
			],
		},
		requirements: {
			quest_completion: "Complete the Sanguine Ritual of the Regent",
			warden_verification: true,
			prerequisite_job: "Any base job",
		},
		},
	{
		id: "gravity_regent",
		spellcasting: {
			ability: "Intelligence",
			spell_slots: REGENT_FULL_CASTER_SLOTS,
			cantrips_known: REGENT_CANTRIPS_KNOWN,
			spells_known: REGENT_SPELLS_KNOWN,
			spell_preparation: false,
			additional_spells: [
				"Magic Stone",
				"Levitate",
				"Fly",
				"Reverse Gravity",
				"Meteor Swarm",
			],
		},
		name: "Gravity Regent",
		title: "Gravity Regent (Regent of Weight)",
		theme: "Gravitational Mastery & Fundamental Force",
		description:
			"Vessel of fundamental attraction and universal authority, wielding the incalculable force of Kronos, the Fragment of the Absolute. You command the weight that binds the worlds and collapses the Void into stable geometry. Your will is the anchor of the Ascendant's physics, a universal singularity that dictates the path of all existence in the name of the Absolute Origin.",
		rank: "S",
		image: getRegentPortraitUrl("gravity_regent"),
		type: "ascendant-class-overlay",
		tags: [
			"regent",
			"gravity",
			"weight",
			"force",
			"eternal_of_weight",
			"physics",
		],
		created_at: "2026-02-26T00:00:00.000Z",
		source_book: "Rift Ascendant Canon",
		flavor:
			"A specialized manifestation of Regent Resonance. This form allows the caster to weave the Gravity Regent into an Absolute Decree.",
		lore: "The Gravity Regent is an Ascendant class overlay that represents the pinnacle of its respective domain. Its historical records are sealed by the Wardens.",
		hit_dice: "1d12",
		primary_ability: ["Strength", "Intelligence"],
		saving_throws: ["Strength", "Intelligence"],
		skill_proficiencies: ["Athletics", "Mana Flow", "Science", "Perception"],
		armor_proficiencies: [
			"Light Mana-Weave Armor",
			"Medium Aether Armor",
			"Heavy Carapace Armor",
		],
		weapon_proficiencies: ["Awakened Weapons", "Rift-Forged Weapons"],
		tool_proficiencies: [],
		class_features: [
			{
				name: "Regent Power Resonance",
				level: 2,
				description: "Your abilities resonate with the power of the Regents, increasing their effectiveness and reducing cooldowns.",
				type: "passive",
				
			},
			{
				level: 1,
				name: "Gravity Well",
				description:
					"Create a 30-ft radius zone where gravity is 10x normal. Enemies must make a STR save or be restrained. Ranged attacks automatically fail through the zone.",
				type: "action",
				frequency: "at-will",
			},
			{
				level: 1,
				name: "Weightless Step",
				description:
					"You can fly at your walking speed by negating your own gravity. You also have advantage on AGI checks.",
				type: "passive",
			},
			{
				level: 2,
				name: "Crushing Blows",
				description:
					"Increase the weight of your weapon at the moment of impact. Add 4d10 force damage to all melee attacks.",
				type: "passive",
			},
			{
				level: 3,
				name: "Planetary Field",
				description:
					"60-ft aura: you decide the direction of gravity for each creature within. You can cause enemies to fall upward or toward each other.",
				type: "action",
				frequency: "long-rest",
			},
			{
				level: 5,
				name: "Event Horizon",
				description:
					"As a reaction, collapse space around you. Any attack made against you is sucked into a micro-singularity and negated.",
				type: "reaction",
				frequency: "short-rest",
			},
			{
				level: 7,
				name: "Orbital Striker",
				description:
					"Launch yourself into orbit and come down like a meteor. 1-mile impact: 20d10 force/fire damage. 1/long rest.",
				type: "action",
				frequency: "long-rest",
			},
			{
				level: 9,
				name: "Singularity Genesis",
				description:
					"Create a black hole that pulls all matter within 500 ft into its center. Targets take 40d10 force damage and are erased from existence on kill.",
				type: "action",
				frequency: "long-rest",
			},
			{
				level: 10,
				name: "Absolute Weight",
				description:
					"You are immune to forced movement. You can anchor yourself to the fabric of reality, becoming immovable and indestructible.",
				type: "passive",
			},
			{
				level: 11,
				name: "Gravity Ascendant",
				description:
					"You transcend the physical limitations of mass, gaining the ability to exist as a gravitational singularity and command force across all dimensions.",
				type: "passive",
			},
			{
				level: 11,
				name: "Weight Lord",
				description:
					"You gain complete control over the mass of all objects in your vicinity, able to make mountains as light as feathers or pebbles as heavy as stars.",
				type: "action",
				frequency: "at-will",
			},
			{
				level: 11,
				name: "Force God",
				description:
					"You become a living conduit for the fundamental force of attraction, able to collapse any structure or energy field by inward pressure.",
				type: "passive",
			},
			{
				level: 13,
				name: "Gravity Apocalypse",
				description:
					"Once per day, you can unleash a gravity apocalypse that creates a planetary-scale field of 1000x gravity, crushing all matter into a perfect sphere.",
				type: "action",
				frequency: "once-per-day",
			},
			{
				level: 13,
				name: "Force Dominion",
				description:
					"You gain control over the vectors of all forces, able to redirect any kinetic or potential energy with a simple gesture.",
				type: "action",
				frequency: "at-will",
			},
			{
				level: 13,
				name: "Essence God",
				description:
					"You can harvest and manipulate the mass-essence of any being through gravitational collapse, gaining their power by absorbing their physical presence.",
				type: "action",
				frequency: "long-rest",
			},
			{
				level: 15,
				name: "Gravity Reality",
				description:
					"You can reshape reality itself through the concept of weight, creating worlds of extreme densities and rewriting the laws of physics.",
				type: "action",
				frequency: "long-rest",
			},
			{
				level: 15,
				name: "Weight God",
				description:
					"You become a master of all densities, able to create and destroy through the concept of absolute mass.",
				type: "passive",
			},
			{
				level: 15,
				name: "Force Emperor",
				description:
					"Your gravitational power extends across all realities, allowing you to pull or push entire universes at will.",
				type: "passive",
			},
			{
				level: 17,
				name: "Gravity Transcendence",
				description:
					"You transcend the concept of matter, becoming a fundamental force of attraction that exists in the core of every star.",
				type: "passive",
			},
			{
				level: 17,
				name: "Fundamental Emperor",
				description:
					"You gain mastery over the basic forces of existence, able to create concepts of friction and inertia from the void.",
				type: "passive",
			},
			{
				level: 17,
				name: "Essence Emperor",
				description:
					"You can absorb and control the gravitational essence of entire worlds, gaining their collective power by pinning their history to the present.",
				type: "passive",
			},
			{
				level: 19,
				name: "Gravity Omnipotence",
				description:
					"You achieve true omnipotence within the domain of force, able to control all mass and attraction across all timelines.",
				type: "passive",
			},
			{
				level: 19,
				name: "Weight Regent",
				description:
					"Your mass-control power extends across the multiverse, allowing you to reshape entire universes into perfect singularities or infinite expansions.",
				type: "passive",
			},
			{
				level: 19,
				name: "Force Regent",
				description:
					"You become the ultimate authority over attraction and repulsion, able to determine the final state of all existence.",
				type: "passive",
			},
			{
				level: 20,
				name: "Gravity Supremacy",
				description:
					"You achieve absolute supremacy over all physical forces, becoming the source and master of all universal attraction.",
				type: "passive",
			},
			{
				level: 20,
				name: "Absolute Weightlessness",
				description:
					"You become the embodiment of Absolute Mass, a force beyond comprehension that exists outside the reach of physics.",
				type: "passive",
			},
			{
				level: 20,
				name: "Regent Power",
				description:
					"You achieve the full power of a Regent at their peak - the ability to command infinite energies of your element, reshape reality, control all dimensions, master your domain completely, and transcend to become a fundamental force of the multiverse.",
				type: "passive",
			},
		],
		progression_table: {
			"1": {
				features_gained: ["Gravity Well", "Weightless Step"],
				abilities_improved: [],
			},
			"2": {
				features_gained: ["Crushing Blows"],
				abilities_improved: [],
			},
			"3": {
				features_gained: ["Planetary Field"],
				abilities_improved: [],
			},
			"4": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"5": {
				features_gained: ["Event Horizon"],
				abilities_improved: [],
			},
			"6": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"7": {
				features_gained: ["Orbital Striker"],
				abilities_improved: [],
			},
			"8": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"9": {
				features_gained: ["Singularity Genesis"],
				abilities_improved: [],
			},
			"10": {
				features_gained: ["Absolute Weight"],
				abilities_improved: [],
			},
			"11": {
				features_gained: ["Gravity Ascendant", "Weight Lord", "Force God"],
				abilities_improved: [],
			},
			"12": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"13": {
				features_gained: [
					"Gravity Apocalypse",
					"Force Dominion",
					"Essence God",
				],
				abilities_improved: [],
			},
			"14": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"15": {
				features_gained: ["Gravity Reality", "Weight God", "Force Emperor"],
				abilities_improved: [],
			},
			"16": {
				features_gained: ["Regent Attribute Enhancement"],
				abilities_improved: ["Primary Ability +2"],
			},
			"17": {
				features_gained: [
					"Gravity Transcendence",
					"Fundamental Emperor",
					"Essence Emperor",
				],
				abilities_improved: [],
			},
			"18": {
				features_gained: ["Regent Power Resonance"],
				abilities_improved: [],
			},
			"19": {
				features_gained: [
					"Gravity Omnipotence",
					"Weight Regent",
					"Force Regent",
				],
				abilities_improved: [],
			},
			"20": {
				features_gained: [
					"Gravity Supremacy",
					"Absolute Weightlessness",
					"Regent Power",
				],
				abilities_improved: ["Primary Ability +2"],
			},
		},
		mechanics: {
			stat_bonuses: {
				strength: 8,
				agility: 2,
				vitality: 6,
				intelligence: 6,
				sense: 2,
				presence: 2,
			},
			special_abilities: [
				"Immune to forced movement",
				"Fly at walk speed",
				"Crush armor with focus",
				"Control gravitational vectors",
			],
			restrictions: [
				"Requires Warden verification of quest completion",
				"Once chosen, cannot be changed without Warden approval",
			],
		},
		requirements: {
			quest_completion: "Complete the Trial of the Star-Crusher",
			warden_verification: true,
			prerequisite_job: "Any base job",
		},
		},
];

// Materialize the single runtime ledger at the data boundary. Every consumer
// receives exact progression-table levels with authored mechanics or an
// explicit review-blocked row; no downstream adapter may invent replacements.
for (const regent of regents) {
	regent.class_features = materializeCanonicalRegentLedger(regent);
}
