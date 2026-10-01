// Job Paths Compendium - Ascendant Compendium (84 Paths)
// 14 Jobs × 6 Paths each, unique SA identities with 5e-compatible mechanical backbone

import { PATH_LEVEL_CHOICES } from "./pathChoices";
import { getPathCaster } from "./pathSpellcasting";

export type PathRestRecharge = "short-rest" | "long-rest";
export type PathAbilityTracking = "uses" | "resource" | "manual";

export interface PathFeature {
	name: string;
	description: string;
	level: number;
	actionType?: string;
	uses?: { formula: string; recharge: PathRestRecharge };
	resource?: string;
	tracking?: PathAbilityTracking;
	/** Earlier names; Path reconciliation adopts rows stored under them. */
	formerNames?: string[];
	/**
	 * Spells the feature grants outright, each from its own character level
	 * (default: the feature's level). They are added as known spells that don't
	 * count against the character's limit.
	 */
	grants?: { spells: Array<{ name: string; level?: number }> };
}

/** A named option offered by a Path feature (RA-23). */
export interface PathChoiceOption {
	name: string;
	description: string;
}

/**
 * - `path-option`: the feature names every option and the sheet records each
 *   pick as its own feature entry (Path choices panel).
 * - The other types add to the shared choice totals that the creation and
 *   level-up pickers already handle.
 */
export type PathLevelChoiceType =
	| "path-option"
	| "fighting-style"
	| "skill"
	| "expertise"
	| "tool"
	| "language"
	| "cantrip"
	| "spell"
	| "power"
	| "technique";

/** A structured choice a Path feature grants at a level (RA-23). */
export interface PathLevelChoice {
	level: number;
	type: PathLevelChoiceType;
	count: number;
	/** Feature that grants the choice; matches a feature name on the Path. */
	source: string;
	/** Required for `path-option`; every option the feature offers. */
	options?: PathChoiceOption[];
}

/** Third-caster spellcasting a Path grants to a Job that doesn't cast. */
export interface PathSpellcasting {
	/** Feature that grants the casting; its prose is not re-parsed for picks. */
	source: string;
	/** Job spell list the Path learns from. */
	list: string;
	ability: "Intelligence";
	casterType: "third";
	/** Cantrips known by character level (index = level - 1). */
	cantripsKnown: number[];
	/** Spells known by character level (index = level - 1). */
	spellsKnown: number[];
}

export interface PathAbility {
	name: string;
	description: string;
	/** Legacy authored cadence code retained for non-reconciled paths. */
	recharge?: number;
	cost?: string;
	/** Canonical unlock is the parent path's unlock level unless stated otherwise. */
	level?: number;
	actionType?: string;
	uses?: { formula: string; recharge: PathRestRecharge };
	resource?: string;
	tracking?: PathAbilityTracking;
}

export interface Path {
	id: string;
	name: string;
	/** Stable legacy names/ids accepted by canonical resolution. */
	aliases?: string[];
	jobId: string;
	jobName: string;
	tier: 1 | 2 | 3;
	pathType: string;
	requirements: {
		level: number;
	};
	description: string;
	features: PathFeature[];
	abilities: PathAbility[];
	/** Structured choices the Path's features grant (RA-23). */
	levelChoices?: PathLevelChoice[];
	/** Spellcasting for Paths of Jobs that don't cast. */
	spellcasting?: PathSpellcasting;
	stats: {
		primaryAttribute: string;
		secondaryAttribute?: string;
	};
	source: string;
	image?: string;
}

const pathCatalog: Path[] = [
	{
		id: "destroyer--apex-predator",
		name: "Path of the Apex Predator",
		jobId: "destroyer",
		jobName: "Destroyer",
		tier: 2,
		pathType: "apex-predator",
		requirements: {
			level: 3,
		},
		description:
			"The Apex Predator is the ultimate physical mandate of the Destroyer lineage — a recursive refinement of the Awakened's biological vessel into a tool of absolute lethality. In the modern era of Absolute containment, they are the supreme front-line anchors of high-rank guilds, their every movement a masterclass in optimized destructive intent. To walk this path is to accept that your muscles are no longer purely biological, but a perfected conductor for the Absolute's force.",
		features: [
			{
				name: "Absolute Lethality",
				description:
					"The Absolute's clarity widens your kill zone. Weapon attacks crit on 19-20.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Peak Conditioning",
				description:
					"Add half prof bonus (round up) to STR/AGI/VIT checks that don't already include prof. Running long jump +STR mod feet.",
				level: 7,
				actionType: "passive",
			},
			{
				name: "Secondary Discipline",
				description:
					"You choose a second Fighting Style from the RA Fighting Style catalog; it can't be one you already have. You gain a +1 bonus to all saving throws.",
				level: 10,
				actionType: "passive",
			},
			{
				name: "Expanded Kill Zone",
				description:
					"Your Aetheric Sight highlights deeper vulnerabilities. Weapon attacks crit on 18-20.",
				level: 15,
				actionType: "passive",
			},
			{
				name: "Auto-Repair Rite",
				description: `Start of each turn, the Absolute channels restorative mana: regain 5+VIT mod HP if at ≤ half HP and at least 1 HP. You gain proficiency in one skill or tool of your choice.`,
				level: 18,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Predator's Focus",
				description: "Next attack crits on 17-20. Once per short rest.",
				recharge: 1,
				cost: "Bonus action",
			},
		],
		stats: {
			primaryAttribute: "Strength",
			secondaryAttribute: "Vitality",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "destroyer--tactician",
		name: "Path of the Tactician",
		jobId: "destroyer",
		jobName: "Destroyer",
		tier: 2,
		pathType: "tactician",
		requirements: {
			level: 3,
		},
		description:
			"The Tactician mandate is granted to those whose cognitive resonances can process battlefield echoes at speeds that defy conventional analysis. These are the Mandate architects of top-tier guilds and the strategic specialists of the Ascendant Bureau, treating every gate-boundary as a structural zone of calculated dominance. They do not just fight; they harmonize the local weave into a blueprint for victory, ensuring that no variable remains unaccounted for.",
		features: [
			{
				name: "Tactical Charge",
				description:
					"You learn three Techniques of your choice from those your Job can learn; these are your maneuvers, in addition to the Techniques your Job grants. You learn two more maneuvers at 7th, 10th, and 15th level, and whenever you gain a level in this Job you can replace one maneuver with another Technique you could learn. You also have tactical dice, which are d8s: four at 3rd level, five at 7th, and six at 15th. You regain all expended tactical dice when you finish a short or long rest. Once on each of your turns, when you use a maneuver, you can expend one tactical die and add it to that maneuver's attack roll or to one of its damage rolls. You gain proficiency in one skill or tool of your choice.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Field Analysis",
				description:
					"Gain proficiency with one artisan's tools. Your Aetheric Vista analyzes construction and materials.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Threat Assessment",
				description:
					"1 minute observing outside combat: learn if equal/superior/inferior in two characteristics. Your Aetheric Sight compiles a threat profile.",
				level: 7,
				actionType: "passive",
			},
			{
				name: "Enhanced Tactical Dice",
				description: `Tactical dice upgrade to d10. Your combat patterns grow more precise. You have advantage on initiative rolls.`,
				level: 10,
				actionType: "passive",
			},
			{
				name: "Relentless Analysis",
				description:
					"Roll initiative with 0 tactical dice → regain 1. The Absolute never stops observing.",
				level: 15,
				actionType: "passive",
			},
			{
				name: "Perfected Tactical Dice",
				description: `Tactical dice upgrade to d12. Your reads are so far ahead of the fight that opponents feel scripted. You can reroll a failed ability check once per short or long rest.`,
				level: 18,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Combat Scan",
				description:
					"Spend a tactical die to learn target AC, HP%, and highest save. Add die to next attack vs it.",
				recharge: 0,
				cost: "Bonus action",
			},
		],
		stats: {
			primaryAttribute: "Strength",
			secondaryAttribute: "Intelligence",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "destroyer--spell-breaker",
		name: "Path of the Spell Breaker",
		jobId: "destroyer",
		jobName: "Destroyer",
		tier: 2,
		pathType: "spell-breaker",
		requirements: {
			level: 3,
		},
		description:
			"The Spell Breaker mandate designates an Ascendant as the ultimate deterrent against hostile mana-manifestations. They have integrated the primordial threads of the Absolute directly into their weapon bonds, allowing them to channel anti-resonance frequencies through physical strikes. Often recruited by high-stakes containment units, they are the ones who traverse resonant storms to deliver the final, crushing blow to reality-warping entities.",
		features: [
			{
				name: "Weave-Combat Attunement",
				description:
					"You learn to cast Mage spells, using Intelligence as your spellcasting ability: your spell save DC is 8 + your proficiency bonus + your Intelligence modifier, and your spell attack modifier is your proficiency bonus + your Intelligence modifier. Cantrips: you know two Mage cantrips of your choice, and a third at 10th level. Spells: you know three Mage spells at 3rd level and learn more as you gain levels (4 at 4th, 5 at 7th, 6 at 8th, 7 at 10th, 8 at 11th, 9 at 13th, 10 at 14th, 11 at 16th, 12 at 19th, and 13 at 20th). Each must be an abjuration or evocation spell of a level for which you have spell slots. Whenever you gain a level in this Job, you can replace one Mage spell you know with another that meets these rules. Spell slots: you have third-caster spell slots, from two 1st-level slots at 3rd level to four 1st-, three 2nd-, three 3rd-, and one 4th-level slot at 19th, and you regain all expended slots when you finish a long rest.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Aetheric Weapon Bond",
				description:
					"Bond 2 weapons with your soul-signature. Can't be disarmed; summon to hand as bonus action from same plane.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Aetheric-Strike Integration",
				description:
					"Cast a cantrip → make one weapon attack as bonus action. Your Mandate syncs the two actions.",
				level: 7,
				actionType: "passive",
			},
			{
				name: "Mana Disruption",
				description:
					"On weapon hit, disrupt the target's mana pathways. Disadvantage on next save vs your spell before end of your next turn.",
				level: 10,
				actionType: "passive",
			},
			{
				name: "Burst Blink",
				description:
					"When you use Burst Rite, teleport up to 30 ft before or after the extra action.",
				level: 15,
				actionType: "passive",
			},
			{
				name: "Absolute Integration",
				description:
					"Cast a spell → make one weapon attack as bonus action. Spell and blade become one harmonic resonance.",
				level: 18,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Mana Strike",
				description:
					"Cast a cantrip and make a weapon attack, adding INT mod as bonus force damage to both.",
				recharge: 1,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Strength",
			secondaryAttribute: "Intelligence",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "destroyer--bulwark",
		name: "Path of the Bulwark",
		jobId: "destroyer",
		jobName: "Destroyer",
		tier: 2,
		pathType: "bulwark",
		requirements: {
			level: 3,
		},
		description:
			"The Bulwark is a living bastion of the Destroyer lineage, an Ascendant whose very presence generates a localized threat field anchored by Absolute-reinforced frames. In modern containment zones, they serve as the physical barriers that allow civilians to escape unstable Rift boundaries. To face a Bulwark is to engage with an immovable force of nature that punishes any attempt to bypass its defensive perimeter.",
		features: [
			{
				name: "Threat Lock",
				description:
					"Melee hit marks creature until end of your next turn. Marked creature has disadvantage on attacks not targeting you. If it damages someone else, bonus action attack with advantage + half Destroyer level damage.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Reactive Shield",
				description:
					"Reaction: you or adjacent ally hit → add 1d8 to AC. If still hit, target resists that damage. VIT mod uses/long rest.",
				level: 7,
				actionType: "passive",
			},
			{
				name: "Lockdown Zone",
				description:
					"Creatures provoke opportunity attacks when moving within your reach. Hit → speed becomes 0. Nothing escapes your zone.",
				level: 10,
				actionType: "passive",
			},
			{
				name: "Battering Ram",
				description:
					"Move 10+ ft straight then attack → STR save or knocked prone. Bonus action attack on prone.",
				level: 15,
				actionType: "passive",
			},
			{
				name: "Absolute Coverage",
				description:
					"Make opportunity attacks without using reaction (one per creature per turn, not on your turn). Your threat field is omnidirectional.",
				level: 18,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Fortress Mode",
				description:
					"Anchor yourself — become immovable until you move. Advantage on STR checks/saves, can't be moved by any force.",
				recharge: 1,
				cost: "Bonus action",
			},
		],
		stats: {
			primaryAttribute: "Vitality",
			secondaryAttribute: "Strength",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "destroyer--last-stand",
		name: "Path of the Last Stand",
		jobId: "destroyer",
		jobName: "Destroyer",
		tier: 2,
		pathType: "last-stand",
		requirements: {
			level: 3,
		},
		description:
			"The Last Stand mandate is granted to survivors of catastrophic Rift incidents who have learned to override their body's inherent mortal limiters. They fight with a transcendent, near-supernatural focus that fuels impossible last-second victories. These Destroyers do not recognize the concept of defeat; they simply channel the Absolute's emergency reserves to maintain lethality long after their physical forms should have failed.",
		features: [
			{
				name: "Limit Break",
				description:
					"Bonus action: override mortal limiters. Advantage on all weapon attacks + 5 temp HP until end of turn (10 at 10th, 15 at 15th). 3 uses/long rest.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Veteran's Composure",
				description:
					"Your control extends beyond combat. Add SENSE mod to Persuasion. Prof in SENSE saves.",
				level: 7,
				actionType: "passive",
			},
			{
				name: "Emergency Reserves",
				description:
					"Roll initiative with 0 Limit Break uses → regain 1. The Absolute always has one more in reserve.",
				level: 10,
				actionType: "passive",
			},
			{
				name: "Accelerated Strike",
				description:
					"If you have advantage and hit, forgo advantage on one attack to make an additional attack. Once/turn.",
				level: 15,
				actionType: "passive",
			},
			{
				name: "Final Override",
				description: `At 0 HP, the Absolute grants one final burst. Take an entire extra turn immediately. Once/long rest. You gain proficiency in one skill or tool of your choice.`,
				level: 18,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Piercing Blow",
				description:
					"Next melee attack ignores resistance, treats immunity as resistance. Once per short rest.",
				recharge: 1,
				cost: "Bonus action",
			},
		],
		stats: {
			primaryAttribute: "Strength",
			secondaryAttribute: "Sense",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "destroyer--phantom-blade",
		name: "Path of the Aftershock",
		jobId: "destroyer",
		jobName: "Destroyer",
		tier: 2,
		pathType: "echo",
		requirements: {
			level: 3,
		},
		description:
			"The Path of the Aftershock is held by those whose strikes resonate with such intensity that the Absolute generates residual force iterations — temporal echoes of their movements from adjacent reflections. In the field, it manifests as multiple strikes resolving simultaneously from ghostly iterations. Footage of Aftershock Destroyers highlights the sheer visual overload of doubled impacts tearing through Rift entities with absolute recursive power.",
		features: [
			{
				name: "Residual Strike",
				description:
					"Bonus action: generate a force hologram within 15 ft that mirrors your attacks. 1 HP, AC 14+prof. You can direct your weapon attacks from its position. Bonus action: reposition it (15 ft).",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Recursive Strike",
				description:
					"On Attack action, one extra melee attack resolves from the iteration's position — the Absolute repeats your movement. VIT mod uses/long rest.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Holographic Recon",
				description:
					"Action: project the hologram up to 300 ft away for 10 min. See/hear through it; deafened/blinded at your body. Scout without risk.",
				level: 7,
				actionType: "passive",
			},
			{
				name: "Holographic Interception",
				description:
					"Reaction when ally within 30 ft is attacked: reposition hologram within 5 ft of ally. The attack targets the hologram instead.",
				level: 10,
				actionType: "passive",
			},
			{
				name: "Force Feedback",
				description:
					"Hologram destroyed by damage → stored kinetic energy feeds back to you. Gain 2d6+VIT mod temp HP. VIT mod uses/long rest.",
				level: 15,
				actionType: "passive",
			},
			{
				name: "Dual Projection",
				description: `Generate two holograms. Impact Echo grants one extra attack from each hologram's position. Your movement speed increases by 5 feet.`,
				level: 18,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Kinetic Replay",
				description:
					"Teleport to an iteration's position and deliver an opportunistic strike against an adjacent entity. The Absolute manifests you at maximum resonance.",
				recharge: 1,
				cost: "Reaction",
			},
		],
		stats: {
			primaryAttribute: "Strength",
			secondaryAttribute: "Vitality",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "berserker--escalating-resonance",
		name: "Path of the Escalating Resonance",
		jobId: "berserker",
		jobName: "Berserker",
		tier: 2,
		pathType: "escalating-resonance",
		requirements: {
			level: 3,
		},
		description:
			"The Path of the Escalating Resonance is walked by those whose spirits vibrate with the most unstable aetheric frequencies. In the modern world, they are the high-octane headliners of underground fight clubs and elite gate-clearance units, where pain is not an obstacle but a catalyst. Each drop of blood spilled acts as a conductor for their internal mana, fueling a recursive cycle of violence that ends only when the enemy—or the Ascendant themselves—is thoroughly spent. They are living batteries of escalating fury, held together only by the Absolute's merciless mandate.",
		features: [
			{
				name: "Escalating Harmony",
				description:
					"While in Overload, your internal mana accelerates with each strike. Make a melee weapon attack as bonus action each turn. One exhaustion level when Overload ends as the physical vessel pays the price of the Absolute's favor.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Aetheric Static",
				description:
					"In Overload, the mana static in your body disrupts all external manipulation—psychic influences and supernatural charms can't penetrate the noise of your inner storm. Can't be charmed or frightened; existing effects suspended.",
				level: 6,
				actionType: "passive",
			},
			{
				name: "Aetheric Pressure",
				description:
					"Action: your mana field pulses outward like a gravity well—bystanders describe a weight that threatens to crush their souls. Frighten one creature within 30 ft (SENSE save 8+prof+STR). Extend each turn with action.",
				level: 10,
				actionType: "passive",
			},
			{
				name: "Recursive Feedback",
				description:
					"Reaction: when damaged by creature within 5 ft, the Absolute converts that kinetic energy into a counterstrike. Make melee attack against it.",
				level: 14,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Runaway Resonance",
				description:
					"1 min: each time you take damage, your next melee strike deals bonus damage equal to your current Overload damage bonus. Once/long rest.",
				recharge: 3,
				cost: "Free (while in Overload)",
			},
		],
		stats: {
			primaryAttribute: "Strength",
			secondaryAttribute: "Vitality",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "berserker--gate-beast",
		name: "Path of the Gate Beast",
		jobId: "berserker",
		jobName: "Berserker",
		tier: 2,
		pathType: "gate-beast",
		requirements: {
			level: 3,
		},
		description:
			"The Gate Beast represents an Awakened who has harmonized their essence with the primal aetheric fauna found within the shadows of the Rifts. They do not merely observe nature; they consume its most violent aspects to fuel their own ascendant power. In modern tactical guilds, they are the trackers and frontline skirmishers who can transition from human strategist to mindless predator in a heartbeat, channeling the echoes of ancient beasts to protect or destroy with animalistic clarity.",
		features: [
			{
				name: "Primal Aspect",
				description:
					"When you gain this feature, choose your aspect: Tank-Beast, Raptor, or Pack-Leader. Your aspect also decides what Biological Adaptation (6th level) and Apex Mandate (14th level) grant you. Whenever you gain a Berserker level, you can switch to a different aspect, and your later aspect features change with it. While you're in Overload, your aspect grants this benefit. Tank-Beast: you have resistance to all damage except psychic damage. Raptor: opportunity attacks against you have disadvantage, and you can take the Dash action as a bonus action. Pack-Leader: your allies have advantage on melee attack rolls against any hostile creature within 5 feet of you.",
				formerNames: ["Bonded Aspect"],
				level: 3,
				actionType: "passive",
			},
			{
				name: "Biological Adaptation",
				description:
					"You gain your aspect's adaptation. Tank-Beast: your carrying capacity, including your maximum load and maximum lift, doubles, and you have advantage on STR checks made to push, pull, lift, or break objects. Raptor: you can see up to 1 mile away with no difficulty, discerning fine details as though looking at something no more than 100 feet away, and dim light doesn't impose disadvantage on your SENSE (Perception) checks. Pack-Leader: you can track other creatures while traveling at a fast pace, and you can move stealthily while traveling at a normal pace.",
				level: 6,
				actionType: "passive",
			},
			{
				name: "Aetheric Commune",
				description:
					"As a ritual that takes 10 minutes, you attune to the aetheric flow of the land around you and learn up to three facts of your choice about the area within 3 miles of you (300 feet if you're underground or inside a Rift): its terrain and bodies of water; its prevalent plants, minerals, animals, or peoples; powerful Anomalies or other dangerous creatures; open or sealed Rifts; or buildings and other structures. You gain resistance to force damage.",
				level: 10,
				actionType: "passive",
			},
			{
				name: "Apex Mandate",
				description:
					"While you're in Overload, your aspect's mandate applies. Tank-Beast: each hostile creature within 5 feet of you has disadvantage on attack rolls against targets other than you, unless it can't see or hear you or can't be frightened. Raptor: you have a flying speed equal to your walking speed, but you fall if you end your turn in the air with nothing else holding you aloft. Pack-Leader: when you hit a Large or smaller creature with a melee weapon attack on your turn, you can use a bonus action to knock it prone.",
				level: 14,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Territorial Roar",
				description:
					"As an action, each hostile creature within 30 feet of you that can hear you must succeed on a SENSE saving throw against your Job save DC or be frightened of you for 1 minute. A frightened creature repeats the saving throw at the end of each of its turns, ending the effect on itself on a success. A minor manifestation of a primal Rift beast spirit erupts from your soul. Once per long rest.",
				recharge: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Strength",
			secondaryAttribute: "Sense",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "berserker--mana-scars",
		name: "Path of the Mana Scars",
		jobId: "berserker",
		jobName: "Berserker",
		tier: 2,
		pathType: "mana-scars",
		requirements: {
			level: 3,
		},
		description:
			"Those who walk the Path of the Mana Scars are living testaments to the Absolute's traumatic touch. Their bodies are maps of ancient gate-breaks and survived overloads, the luminous scar tissue acting as high-capacity conductors for defensive mana. While the modern world might see them as grizzled survivors of the first gate-age, their true purpose is to serve as the unbreakable anchors of a guild resonance, turning the pain of their history into the armor of the present.",
		features: [
			{
				name: "Erupting Scars",
				description:
					"In Overload, the first creature you strike each turn finds its hostile intent suppressed by the flare of your scars. Target has disadvantage on attacks not targeting you.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Luminous Barrier",
				description:
					"In Overload, ally within 30 ft takes damage → reaction: your scars project an aetheric barrier, reducing damage by 2d6 (3d6 at 10th, 4d6 at 14th).",
				level: 6,
				actionType: "passive",
			},
			{
				name: "Primal Recall",
				description:
					"Your scars record every aetheric disturbance you've survived. As a ritual that takes 10 minutes, you can anchor an invisible sensor in a location within 1 mile of you that you have visited before or can see. For up to 10 minutes (concentration), you can see or hear through the sensor as if you were there; choose sight or hearing when you anchor it, and switch as an action. A creature that can see invisible things sees the sensor as a faint, glowing scar in the air.",
				level: 10,
				actionType: "passive",
			},
			{
				name: "Retaliatory Discharge",
				description:
					"When your Luminous Barrier activates, the aetheric discharge feeds back: the attacker takes force damage equal to the amount prevented.",
				level: 14,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Scar Eruption",
				description:
					"All your mana scars discharge simultaneously: 20-ft radius, 3d8 force damage (VIT half). Allies in range gain temp HP equal to the damage dealt. Once/long rest.",
				recharge: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Strength",
			secondaryAttribute: "Vitality",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "berserker--rift-storm",
		name: "Path of the Rift Storm",
		jobId: "berserker",
		jobName: "Berserker",
		tier: 2,
		pathType: "rift-storm",
		requirements: {
			level: 3,
		},
		description:
			"The Rift Storm represents an Ascendant who has survived the epicenter of a catastrophic gate-collapse and emerged saturated with raw, elemental mana. When they enter Overload, their internal energy vents as pure environmental turbulence—fire, lightning, or freezing cold radiating from their very pores. They are volatile assets, often deployed by elite containment units as a 'scorched earth' deterrent against massive gate-swarms where collateral damage is a secondary concern to survival.",
		features: [
			{
				name: "Aetheric Vent",
				description:
					"While you're in Overload, you emanate a 10-foot aura that moves with you. Its type is the one you chose when you gained this feature: Inferno, Tempest, or Glacial. Whenever you gain a Berserker level, you can change the type, and your later aura features change with it. The aura activates when you enter Overload, and you can activate it again as a bonus action on each of your later turns while Overload lasts. Inferno: each other creature in the aura takes 2 fire damage (3 at 5th level, 4 at 10th, 5 at 15th, and 6 at 20th). Tempest: choose one other creature in the aura; it makes an AGI saving throw against your Job save DC, taking 1d6 lightning damage on a failure or half as much on a success (2d6 at 10th level, 3d6 at 15th, and 4d6 at 20th). Glacial: each creature of your choice in the aura, including you, gains 2 temporary hit points (3 at 5th level, 4 at 10th, 5 at 15th, and 6 at 20th). Your aura type also decides what Elemental Saturation and Volatile Discharge grant you. Car paint blisters near Inferno types, Tempest types trip circuit breakers, and Glacial types frost over nearby windows.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Elemental Saturation",
				description:
					"You gain your aura type's saturation. Inferno: you have resistance to fire damage and don't suffer the effects of extreme heat. Tempest: you have resistance to lightning damage, you can breathe underwater, and you gain a swimming speed of 30 feet. Glacial: you have resistance to cold damage, you don't suffer the effects of extreme cold, and you can move across ice without making an ability check.",
				level: 6,
				actionType: "passive",
			},
			{
				name: "Radiant Field",
				description:
					"Each creature of your choice in your aura has the damage resistance granted by your Elemental Saturation. Your storm becomes a safe harbor for your allies.",
				level: 10,
				actionType: "passive",
			},
			{
				name: "Volatile Discharge",
				description:
					"Your aura type grants a discharge. Inferno: when a creature in your aura hits you with an attack, you can use your reaction to deal fire damage to it equal to half your Berserker level (rounded down). Tempest: when you hit a creature in your aura with an attack, you can use your reaction to force it to make a STR saving throw against your Job save DC; on a failure, it is knocked prone. Glacial: whenever your aura activates, you can choose one creature you can see in it; that creature must succeed on a STR saving throw against your Job save DC or have its speed reduced to 0 until the start of your next turn.",
				level: 14,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Storm Detonation",
				description:
					"As an action, each creature of your choice within 30 feet of you must make an AGI saving throw against your Job save DC, taking 4d8 damage of your aura's type (fire for Inferno, lightning for Tempest, cold for Glacial) on a failure, or half as much on a success. The Absolute unleashed in a single, devastating burst. Once per long rest.",
				recharge: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Strength",
			secondaryAttribute: "Vitality",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "berserker--absolute-zealot",
		name: "Path of the Absolute Zealot",
		jobId: "berserker",
		jobName: "Berserker",
		tier: 2,
		pathType: "absolute-zealot",
		requirements: {
			level: 3,
		},
		description:
			"The Absolute Zealot is an Ascendant whose devotion to the primordial force transcended mere faith and became a physical anchor. They do not see their power as a 'connection' but as a divine mandate to be executed. Often seen leading extremist fellowships or streaming their gate-raids as grand aetheric sermons, they possess a terrifying resilience, as the Absolute itself seems to refuse their passing until their work is finished. To them, every strike is a prayer, and every kill is an offering.",
		features: [
			{
				name: "Absolute Wrath",
				description:
					"In Overload: your first hit each turn deals extra 1d6+half Berserker level radiant or necrotic damage. The Absolute punishes the unworthy through your vessel.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Chosen Vessel",
				description:
					"Spells restoring you to life don't require material components. The Absolute waives the cost of your return.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Unwavering Devotion",
				description:
					"Fail a save while in Overload → reroll, must use new result. Your focus on the Absolute overrides failure. Once per Overload.",
				level: 6,
				actionType: "passive",
			},
			{
				name: "Rally the Faithful",
				description:
					"Bonus action: up to 10 creatures in 60 ft gain advantage on attacks and saves until start of your next turn. Once/long rest.",
				level: 10,
				actionType: "Bonus action",
				uses: { formula: "1", recharge: "long-rest" },
				tracking: "uses",
			},
			{
				name: "Overload Beyond Death",
				description:
					"In Overload at 0 HP: don't fall unconscious. Die only on 3 failed death saves, massive damage, or Overload ending at 0 HP. The Absolute refuses to let you stop.",
				level: 14,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Radiant Overload",
				description:
					"1 min: melee deals extra 2d6 radiant, emit bright light 10 ft. Once/long rest.",
				recharge: 3,
				cost: "Bonus action",
			},
		],
		stats: {
			primaryAttribute: "Strength",
			secondaryAttribute: "Vitality",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "berserker--aetheric-anomaly",
		name: "Path of the Aetheric Anomaly",
		jobId: "berserker",
		jobName: "Berserker",
		tier: 2,
		pathType: "aetheric-anomaly",
		requirements: {
			level: 3,
		},
		description:
			"The Aetheric Anomaly is an Ascendant whose connection to the Absolute was shattered and reformed during a violent gate-collapse. They are walking anchors of instability whose every Overload triggers random, reality-warping discharges. While guilds often fear their unpredictability, they are prized for their ability to bypass conventional defensive measures and turn any battlefield into a chaotic domain where only they can truly thrive.",
		features: [
			{
				name: "Aetheric Detection",
				description:
					"Action: sense aetheric disturbances, spells, or artifacts within 60 ft, identifying the fundamental resonance. Your anomalous connection reads ambient mana like a radar. Prof uses/long rest.",
				level: 3,
				actionType: "Action",
				uses: { formula: "PB", recharge: "long-rest" },
				tracking: "uses",
			},
			{
				name: "Anomaly Surge",
				description:
					"Each time you enter Overload, roll a d8 on the Anomaly Surge chart. The surge lasts until your Overload ends unless its entry says otherwise, and a new roll replaces it. Any saving throw it calls for uses your Job save DC. 1, Void Tendrils: each creature of your choice within 30 feet of you must succeed on a VIT saving throw or take 1d12 force damage, and you gain 1d12 temporary hit points. 2, Phase Jump: you teleport up to 30 feet to an unoccupied space you can see; until the surge ends, you can repeat this as a bonus action on each of your turns. 3, Mana Mote: a mote of unstable mana appears within 5 feet of a creature of your choice within 30 feet of you and explodes at the end of the current turn; each creature within 5 feet of it must succeed on an AGI saving throw or take 1d6 force damage. Until the surge ends, you can create another mote as a bonus action on each of your turns. 4, Crystal Weapon: mana crystallizes around one weapon you're holding; until the surge ends, it deals force damage, gains the light and thrown properties (range 20/60 feet), and returns to your hand at the end of the turn if it left it. 5, Giant Surge: you grow one size larger if there's room; until the surge ends, you have advantage on STR checks and STR saving throws, and your weapon attacks deal an extra 1d4 damage. 6, Retribution Field: until the surge ends, a creature that hits you with an attack roll takes 1d6 force damage. 7, Ward Lights: until the surge ends, you and allies within 10 feet of you gain a +1 bonus to AC. 8, Flare Bolt: another creature you can see within 30 feet of you must succeed on a VIT saving throw or take 1d6 radiant damage and be blinded until the start of your next turn; until the surge ends, you can repeat this as a bonus action on each of your turns.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Mana Transfusion",
				description:
					"Action touch: +1d3 to attacks/checks for 10 min, OR restore a spell slot ≤ d3 level. Your unstable core leaks utility. Prof uses/long rest.",
				level: 6,
				actionType: "Action",
				uses: { formula: "PB", recharge: "long-rest" },
				tracking: "uses",
			},
			{
				name: "Cascade Resonance",
				description:
					"While you're in Overload, when you take damage or fail a saving throw, you can use your reaction to roll on the Anomaly Surge chart again; the new result replaces your current surge.",
				level: 10,
				actionType: "passive",
			},
			{
				name: "Controlled Distortion",
				description:
					"Whenever you roll on the Anomaly Surge chart, roll twice and choose which result to use. If both dice show the same number, you can instead choose any effect on the chart. Your spell attacks score a critical hit on a roll of 19 or 20.",
				level: 14,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Anomalous Detonation",
				description:
					"As an action, each creature of your choice within 20 feet of you must make a VIT saving throw against your Job save DC, taking 3d10 force damage on a failure or half as much on a success. If you're in Overload, you then roll on the Anomaly Surge chart, and the result replaces your current surge. Once per long rest.",
				recharge: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Strength",
			secondaryAttribute: "Vitality",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "assassin--gate-runner",
		name: "Path of the Gate Runner",
		jobId: "assassin",
		jobName: "Assassin",
		tier: 2,
		pathType: "gate-runner",
		requirements: {
			level: 3,
		},
		description:
			"A Gate Runner is an Ascendant whose essence has been tuned to the phase-spaces between the physical world and the Rifts. They possess a fluidity of movement that allows them to slip through barriers—both physical and aetheric—as if they were nothing more than mist. In the modern world, they are the specialized assets recruited for high-stakes recovery operations and urgent scouting, moving through hostile territory with a grace that defies the Absolute's own laws of permanence.",
		features: [
			{
				name: "Aetheric Phase",
				description:
					"Phase Shift bonus action can also: Sleight of Hand check, use tools, or Use an Object. Your hands phase through pockets and locks via the primordial weave.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Veil Runner",
				description:
					"Climbing costs no extra movement. Running jump distance +AGI mod feet. You maintain a harmonic grip on any surface.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Unseen Resonance",
				description:
					"Advantage on Stealth if you move no more than half speed that turn. You become a literal shadow in the Absolute's eye.",
				level: 9,
				actionType: "passive",
			},
			{
				name: "Mandate Bypass",
				description: `Ignore all class, race, and level requirements on aetheric artifacts. Your phase-shifted hands interface with the core resonance of any object. Your movement speed increases by 5 feet.`,
				level: 13,
				actionType: "passive",
			},
			{
				name: "Continuity Split",
				description: `The Absolute allows you two turns in the first round of combat: normal initiative and initiative minus 10. You exist in two moments simultaneously. You can reroll a failed ability check once per short or long rest.`,
				level: 17,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Phase Grab",
				description:
					"As a bonus action, phase your hand into a creature within 5 feet of you to take one object it is holding or wearing that weighs no more than 10 pounds, isn't a weapon it's wielding, and isn't armor it's wearing. The creature makes an AGI saving throw against your Job save DC. On a failure, the object appears in your free hand. On a success, you come away empty-handed and the creature knows you tried. You can use Phase Grab a number of times equal to your proficiency bonus, regaining all uses when you finish a long rest.",
				recharge: 1,
				cost: "Bonus action",
			},
		],
		stats: {
			primaryAttribute: "Agility",
			secondaryAttribute: "Intelligence",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "assassin--terminus",
		name: "Path of the Terminus",
		jobId: "assassin",
		jobName: "Assassin",
		tier: 2,
		pathType: "terminus",
		requirements: {
			level: 3,
		},
		description:
			"The Terminus mandate is reserved for those who embody the absolute finality of the reaper. They are the surgical edge of the Absolute, capable of delivering a clinical end to any existence with a single, unanswerable strike. In the modern world, they are the ghosts of the battlefield, their presence known only by the sudden, absolute silence they leave in their wake. When a Terminus marks a target, the Absolute itself acknowledges the inevitability of their transition.",
		features: [
			{
				name: "Mandated Tools",
				description:
					"Proficiency with disguise kits and alchemical tools. The fundamental assets of an inevitable end.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Initial Strike Rite",
				description:
					"Advantage on attacks vs creatures that haven't acted yet. Hits on surprised creatures are automatic critical hits.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Identity Weave",
				description: `Spend 7 days to create a false resonance—a fabricated identity recognized by the Absolute's weave, complete with documented history. You can reroll a failed ability check once per short or long rest.`,
				level: 9,
				actionType: "passive",
			},
			{
				name: "Deep Mimicry",
				description:
					"Mimic another person's speech, behavior, and aetheric resonance after 3 hours of study. Suspicious creatures have disadvantage on Insight to detect the facade.",
				level: 13,
				actionType: "passive",
			},
			{
				name: "The Final Rite",
				description:
					"Hit a surprised creature → VIT save (8+AGI mod+prof) or damage is doubled. The Absolute confirms the termination.",
				level: 17,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Phase Termination",
				description:
					"After a successful strike, phase into the aether—become invisible until the end of your next turn or until you attack. Once/short rest.",
				recharge: 1,
				cost: "Free",
			},
		],
		stats: {
			primaryAttribute: "Agility",
			secondaryAttribute: "Vitality",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "assassin--weave-infiltrator",
		name: "Path of the Weave Infiltrator",
		jobId: "assassin",
		jobName: "Assassin",
		tier: 2,
		pathType: "weave-infiltrator",
		requirements: {
			level: 3,
		},
		description:
			"The Weave Infiltrator mandate allows an Ascendant to harmonize their phase-shifted essence with the primordial weave of the Absolute. They do not just hide; they exist within the static of the local mana-field, capable of intercepting aetheric flows and stealing the resonances of other casters mid-manifestation. In a world of complex gate-wards and magical defenses, they are the ultimate locksmiths of reality.",
		features: [
			{
				name: "Weave Intrusion",
				description:
					"You learn to cast Mage spells and to project a Harmonic Hand. Harmonic Hand: as an action, you conjure a spectral hand at a point you can see within 30 feet of you. It lasts for 1 minute, until you dismiss it (no action), or until you conjure it again, and it vanishes if it's ever more than 30 feet from you. When you conjure it, and as an action on later turns, you can move it up to 30 feet and use it to manipulate an object, open an unlocked door or container, stow or retrieve an item from an open container, or pour out the contents of a vial. It can't attack, activate magic items, or carry more than 10 pounds, and it doesn't count against your cantrips known. Spellcasting: Intelligence is your spellcasting ability; your spell save DC is 8 + your proficiency bonus + your Intelligence modifier, and your spell attack modifier is your proficiency bonus + your Intelligence modifier. You know two Mage cantrips of your choice, and a third at 10th level. You know three Mage spells at 3rd level and learn more as you gain levels (4 at 4th, 5 at 7th, 6 at 8th, 7 at 10th, 8 at 11th, 9 at 13th, 10 at 14th, 11 at 16th, 12 at 19th, and 13 at 20th). Each must be an enchantment or illusion spell of a level for which you have spell slots. Whenever you gain a level in this Job, you can replace one Mage spell you know with another that meets these rules. You have third-caster spell slots, from two 1st-level slots at 3rd level to four 1st-, three 2nd-, three 3rd-, and one 4th-level slot at 19th, and you regain all expended slots when you finish a long rest.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Harmonic Hand Mastery",
				description:
					"Your Harmonic Hand is invisible, and you can control it as a bonus action. With it, you can stow an object in a container worn or carried by another creature, retrieve an object from such a container, or use thieves' tools to pick locks and disarm traps at range. To do one of these unnoticed, make an AGI (Sleight of Hand) check contested by the creature's SENSE (Perception) check. You gain a +1 bonus to all saving throws.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Phase Ambush",
				description:
					"Hidden when you cast → target has disadvantage on saves vs that spell. You manifest your resonance from between dimensions.",
				level: 9,
				actionType: "passive",
			},
			{
				name: "Harmonic Distraction",
				description:
					"Bonus action: Aetheric hand distracts creature within 5 ft of it → advantage on attacks vs that creature until end of turn.",
				level: 13,
				actionType: "passive",
			},
			{
				name: "Resonance Reclamation",
				description:
					"Reaction when targeted by spell: force INT save. Fail → negate effect, steal the aetheric routine for 8 hours. Once/long rest.",
				level: 17,
				actionType: "Reaction",
				uses: { formula: "1", recharge: "long-rest" },
				tracking: "uses",
			},
		],
		abilities: [
			{
				name: "Shadow Casting",
				description:
					"As an action, cast a cantrip while you're hidden; casting it doesn't reveal your position, so you stay hidden. If the cantrip requires a spell attack roll and hits a creature, you can apply your Vulnerability Analysis damage to that creature. This replaces only Vulnerability Analysis's finesse-or-ranged-weapon requirement: the once-per-turn limit and the advantage or adjacent-ally condition still apply, and attacking while hidden normally gives you advantage. Once per short rest.",
				recharge: 1,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Agility",
			secondaryAttribute: "Intelligence",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "assassin--shadow-herald",
		name: "Path of the Shadow Herald",
		jobId: "assassin",
		jobName: "Assassin",
		tier: 2,
		pathType: "shadow-herald",
		requirements: {
			level: 3,
		},
		description:
			"The Shadow Herald mandate is granted to those whose aetheric resonance allows them to perceive the 'echoes' of intent before they even manifest. They are the master strategists and information brokers of the high-tier guilds, weaving networks of intelligence from the fundamental static of the Absolute. In a world where a single secret can topple a corporation or clear a Rift, the Herald is the most valuable asset on any tactical roster.",
		features: [
			{
				name: "Mandated Network",
				description: `Prof in disguise kits, forgery kits, and gaming sets. Learn 2 languages. Your phase-shifted vocal cords can mimic any frequency. You gain proficiency in the Stealth skill. If you are already proficient, you gain expertise.`,
				level: 3,
				actionType: "passive",
			},
			{
				name: "Aetheric Coordination",
				description:
					"Help as bonus action. Help an ally attack → target can be within 30 ft. You whisper tactical echoes through the primordial weave.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Mandate Profiling",
				description:
					"Observe 1 min: learn if equal/superior/inferior in two of INT/SENSE/PRE/class levels. Your Aetheric Sight compiles an unmasking dossier.",
				level: 9,
				actionType: "passive",
			},
			{
				name: "Echo Deflection",
				description:
					"Reaction when targeted while a creature gives cover: attack targets that creature instead. You phase into their shadow.",
				level: 13,
				actionType: "passive",
			},
			{
				name: "Sealed Resonance",
				description:
					"Thoughts unreadable by telepathy. Present false echoes. Advantage on Deception vs sensory discernment.",
				level: 17,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Coordinated Exploit",
				description:
					"As a bonus action, designate a creature you can see within 60 feet of you. The next time one of your allies hits it with an attack roll before the start of your next turn, that ally adds your Vulnerability Analysis dice to the damage. The ally needs no advantage, adjacent ally, or particular weapon for this, and the designation then ends. It doesn't use your own Vulnerability Analysis for the turn. Once per short rest.",
				recharge: 1,
				cost: "Bonus action",
			},
		],
		stats: {
			primaryAttribute: "Presence",
			secondaryAttribute: "Intelligence",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "assassin--blade-dancer",
		name: "Path of the Blade Dancer",
		jobId: "assassin",
		jobName: "Assassin",
		tier: 2,
		pathType: "blade-dancer",
		requirements: {
			level: 3,
		},
		description:
			"The Blade Dancer mandate designates an Ascendant who has mastered the lethal fluidity of phase-step combat. They do not merely fight; they move with an impossible, aetheric grace that makes every encounter look like a choreographed display of violence. In modern high-society duels and televised gate-raids, only the most skilled Dancers can maintain the frequency of the Absolute while moving through a sea of blades without a single scratch.",
		features: [
			{
				name: "Aetheric Footwork",
				description:
					"Melee attack a creature → it can't make OAs against you for the rest of your turn. You phase-step past their guard effortlessly.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Mandated Audacity",
				description:
					"You add your PRE modifier to your initiative rolls. You can also apply Vulnerability Analysis to a creature you hit without having advantage, as long as it's within 5 feet of you, no other creature is within 5 feet of you, and you don't have disadvantage on the attack roll. All other Vulnerability Analysis rules still apply.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Mesmerizing Resonance",
				description:
					"Action: Persuasion vs Insight. Win: hostile target is charmed (won't attack you), or friendly target has disadvantage attacking anyone but you. 1 min.",
				level: 9,
				actionType: "passive",
			},
			{
				name: "Graceful Realignment",
				description:
					"Bonus action: advantage on next Acrobatics or Athletics check this turn. Your essence corrects your form.",
				level: 13,
				actionType: "passive",
			},
			{
				name: "Harmonic Counter",
				description:
					"Miss with attack → reroll with advantage. Your Aetheric Sight shows you the correct angle of insertion. Once/short rest.",
				level: 17,
				uses: { formula: "1", recharge: "short-rest" },
				tracking: "uses",
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Aetheric Riposte",
				description:
					"When a creature within 5 feet of you misses you with a melee attack, you can use your reaction to make one melee attack against it with a finesse weapon. If it hits and you haven't used Vulnerability Analysis this turn, you can apply your Vulnerability Analysis damage even without advantage. Once per short rest.",
				recharge: 1,
				cost: "Reaction",
			},
		],
		stats: {
			primaryAttribute: "Agility",
			secondaryAttribute: "Presence",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "assassin--vanguard-outrider",
		name: "Path of the Vanguard Outrider",
		jobId: "assassin",
		jobName: "Assassin",
		tier: 2,
		pathType: "vanguard-outrider",
		requirements: {
			level: 3,
		},
		description:
			"The Vanguard Outrider is the advance resonance of the mandate—the first to enter a Rift and the last to leave. They have mastered aetheric recon, using phase-shifted sonar to map hostile terrain and relay vital intel through the weave. In the modern world of Rift containment, they are the indispensable scouts whose ability to survive behind enemy resonances ensures the success of every mission.",
		features: [
			{
				name: "Aetheric Skirmish",
				description:
					"Enemy ends turn within 5 ft → reaction: phase-step half speed without provoking OAs.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Rift Specialist",
				description:
					"Prof in Nature and Survival with double proficiency bonus. Your Aetheric insight reads environment resonances instantly.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Mandated Mobility",
				description:
					"Walking speed +10 ft. Climbing/swimming speed +10 ft. Your phase-stepping augments all physical travel.",
				level: 9,
				actionType: "passive",
			},
			{
				name: "Aetheric Ambush",
				description:
					"Advantage on initiative. First creature you hit in round 1 has disadvantage on attacks vs you until start of your next turn.",
				level: 13,
				actionType: "passive",
			},
			{
				name: "Recursive Phase Strike",
				description:
					"If you take the Attack action on your turn, you can make one additional attack as a bonus action, striking from a phase-shifted angle. That attack can benefit from your Vulnerability Analysis even if you've already used it this turn, but not against a creature you've already dealt Vulnerability Analysis damage to this turn.",
				level: 17,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Phase Reconnaissance",
				description:
					"Phase-scout at triple speed for 10 min while hidden. Auto-succeed Stealth vs passive Perception. Once/short rest.",
				recharge: 1,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Agility",
			secondaryAttribute: "Sense",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "striker--kinetic-core",
		name: "Path of the Kinetic Core",
		jobId: "striker",
		jobName: "Striker",
		tier: 2,
		pathType: "kinetic-core",
		requirements: {
			level: 3,
		},
		description:
			"The Path of the Kinetic Core is for those who treat their own body as a high-velocity conductor for the Absolute's power. They do not just strike; they release focused bursts of kinetic resonance that can shatter reinforced Rifts and liquefy the internals of the most durable entities. In the high-stakes world of Rift suppression, they are the undisputed masters of frontline engagement, moving with a speed that leaves afterimages of aetheric fire in their wake.",
		features: [
			{
				name: "Kinetic Technique",
				description:
					"Whenever you hit a creature with one of the unarmed strikes from your Rite of Force, you can impose one of these effects on it: it must succeed on an AGI saving throw against your Job save DC or be knocked prone; it must succeed on a STR saving throw against your Job save DC or be pushed up to 15 feet away from you; or it can't take reactions until the end of your next turn.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Harmonic Repair",
				description: `Action: channel aetheric energy inward to realign your physical vessel. Regain HP = 3 × Striker level. Once/long rest. You can reroll a failed ability check once per short or long rest.`,
				level: 6,
				actionType: "Action",
				uses: { formula: "1", recharge: "long-rest" },
				tracking: "uses",
			},
			{
				name: "Aetheric Deterrence",
				description:
					"Your internal resonance passively deters aggression. When you finish a long rest, you gain a protective ward that lasts until the start of your next long rest. While it lasts, a creature that targets you with an attack or a harmful spell must first make a SENSE saving throw against DC 8 + your SENSE modifier + your proficiency bonus; on a failure, it must choose a new target or lose the attack or spell. The ward ends early if you make an attack roll, cast a spell, or deal damage to another creature.",
				level: 11,
				actionType: "passive",
			},
			{
				name: "Resonance Palm",
				description:
					"When you hit a creature with an unarmed strike, you can spend 3 Impulse points to implant a kinetic vibration in its essence. The vibration lasts for a number of days equal to your Striker level and is harmless unless you use an action to detonate it while you're both on the same plane of existence. When you do, the creature makes a VIT saving throw against your Job save DC: on a failure, it drops to 0 hit points; on a success, it takes 10d10 force damage. Only one creature can carry your vibration at a time, and you can end it harmlessly (no action).",
				level: 17,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Essence Lockdown",
				description:
					"As an action, spend 3 Impulse points and make an unarmed strike. On a hit, the target takes the strike's damage and must succeed on a VIT saving throw against your Job save DC or be stunned for 1 minute. A stunned target repeats the saving throw at the end of each of its turns, ending the effect on itself on a success.",
				recharge: 0,
				cost: "3 Impulse",
			},
		],
		stats: {
			primaryAttribute: "Agility",
			secondaryAttribute: "Sense",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "striker--phantom-step",
		name: "Path of the Phantom Step",
		jobId: "striker",
		jobName: "Striker",
		tier: 2,
		pathType: "phantom-step",
		requirements: {
			level: 3,
		},
		description:
			"The Phantom Step mandate allows an Ascendant to route their physical existence through the low-frequency shadows of the local aether. They are the spectral legends of the gate-wars—flickers in a dark alley followed by the absolute collapse of a high-tier entity. They move not with speed, but with a displacement of reality, stepping through the darkness as if it were a physical gateway.",
		features: [
			{
				name: "Shadow Resonance",
				description:
					"As an action, you can spend 2 Impulse points to create one of these effects. Shroud of Dark: magical darkness fills a 15-foot-radius sphere centered on a point you can see within 60 feet for up to 10 minutes (concentration); darkvision can't see through it, and nonmagical light can't illuminate it. Night Sight: you or a willing creature you touch gains darkvision out to 60 feet for 8 hours. Silent Passage: for up to 1 hour (concentration), you and each creature of your choice within 30 feet of you gain a +10 bonus to AGI (Stealth) checks and can't be tracked except by magical means. Hush: for up to 10 minutes (concentration), no sound can be created within or pass through a 20-foot-radius sphere centered on a point you can see within 120 feet, and creatures fully inside it are deafened and immune to thunder damage. You can also weave a minor phantasm at will: as an action, create a sound, an image of an object no larger than a 5-foot cube, or both within 30 feet of you for 1 minute; a creature that uses its action to examine it sees through it with a successful INT (Investigation) check against your Job save DC. Your walking speed increases by 10 feet, and you gain a climbing speed equal to your walking speed.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Phantom Blink",
				description:
					"Bonus action in dim light/darkness: teleport 60 ft to another dim/dark space. Advantage on first melee attack before end of turn.",
				level: 6,
				actionType: "passive",
			},
			{
				name: "Shroud of the Absolute",
				description:
					"In dim light/darkness, action: your body phases to near-invisibility. Invisible until you attack, cast, or enter bright light.",
				level: 11,
				actionType: "passive",
			},
			{
				name: "Exploit Opening",
				description:
					"Reaction when creature within 5 ft is hit by someone else: deliver a free unarmed strike against it while its guard is shattered.",
				level: 17,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Phantom Barrage",
				description:
					"As an action while you're in dim light or darkness, spend 3 Impulse points and choose up to three creatures you can see within 60 feet of you. You teleport to an unoccupied space within 5 feet of each target in turn and make one unarmed strike against it, then teleport to your starting space or to another space of dim light or darkness within 60 feet of it. This movement doesn't provoke opportunity attacks.",
				recharge: 0,
				cost: "3 Impulse",
			},
		],
		stats: {
			primaryAttribute: "Agility",
			secondaryAttribute: "Sense",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "striker--aetheric-channeler",
		name: "Path of the Aetheric Channeler",
		jobId: "striker",
		jobName: "Striker",
		tier: 2,
		pathType: "aetheric-channeler",
		requirements: {
			level: 3,
		},
		description:
			"The Aetheric Channeler mandate transforms an Ascendant into a living environmental conductor. They do not just strike; they convert ambient aetheric energy into fundamental elemental forces—concussive gravity, thermal discharges, or high-intensity lightning. In the containment of a high-tier Rift, they are the ultimate multi-role assets, capable of adapting their physical strikes to the specific weaknesses of any anomaly.",
		features: [
			{
				name: "Elemental Conversion",
				description:
					"You learn to convert Impulse points into elemental disciplines. You know Aetheric Attunement and one discipline of your choice from the Discipline Library, and you learn one more at 6th, 11th, and 17th level from the disciplines available at that level (see Advanced Conversions). Whenever you learn a new discipline, you can replace one you already know with another you could learn. To use a discipline, spend its Impulse cost; some let you spend more to increase their effect, but you can't spend more Impulse points on a single use than half your Striker level (rounded up). A discipline that calls for a saving throw uses your Job save DC. Aetheric Attunement (no cost): as an action, you briefly control the elements within 30 feet of you to create a harmless sensory effect (a puff of wind, a shower of sparks, a faint tremor, a wisp of frost); instantly light or snuff out a candle, torch, or small campfire; chill or warm up to 1 pound of nonliving material for up to 1 hour; or shape earth, fire, water, or mist that fits within a 1-foot cube into a crude form for 1 minute.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Discipline Library",
				description:
					"Disciplines you can learn from 3rd level. Thermal Fists (1 Impulse): when you take the Attack action on your turn, you can spend 1 Impulse point so that, until the end of the turn, your unarmed strikes have 10 extra feet of reach and deal fire damage; when one hits, you can spend 1 more Impulse point to deal an extra 1d10 fire damage. Concussive Blast (2 Impulse): as an action, choose a creature within 30 feet; it makes a STR saving throw, taking 3d10 force damage, being pushed up to 20 feet away from you, and being knocked prone on a failure, or taking half as much damage only on a success; +1d10 for each additional Impulse point. Gravity Whip (2 Impulse): as an action, choose a creature within 30 feet; it makes an AGI saving throw, and on a failure it takes 3d10 force damage and you either pull it up to 25 feet toward you or knock it prone; on a success it takes half as much damage only; +1d10 for each additional Impulse point. Thermal Wave (2 Impulse): as an action, each creature in a 15-foot cone makes an AGI saving throw, taking 3d6 fire damage on a failure or half as much on a success; +1d6 for each additional Impulse point. Thunder Clap (2 Impulse): as an action, each creature in a 15-foot cube originating from you makes a VIT saving throw, taking 2d8 thunder damage and being pushed 10 feet away from you on a failure, or taking half as much damage only on a success; +1d8 for each additional Impulse point.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Advanced Conversions",
				description:
					"More disciplines open as you gain levels. From 6th level: Essence Lock (3 Impulse): as an action, choose a humanoid you can see within 60 feet; it must succeed on a SENSE saving throw or be paralyzed for up to 1 minute (concentration, as if on a spell), repeating the saving throw at the end of each of its turns and ending the effect on a success. Sonic Shatter (3 Impulse): as an action, choose a point within 60 feet; each creature in a 10-foot-radius sphere there makes a VIT saving throw, taking 3d8 thunder damage on a failure or half as much on a success, and nonmagical objects there that aren't worn or carried take the same damage; +1d8 for each additional Impulse point. From 11th level: Thermal Detonation (4 Impulse): as an action, choose a point within 150 feet; each creature in a 20-foot-radius sphere there makes an AGI saving throw, taking 8d6 fire damage on a failure or half as much on a success; +1d6 for each additional Impulse point. Gravity Flight (4 Impulse): as an action, you gain a flying speed of 60 feet for up to 10 minutes (concentration). From 17th level: Cryo Blast (6 Impulse): as an action, each creature in a 60-foot cone makes a VIT saving throw, taking 8d8 cold damage on a failure or half as much on a success; +1d8 for each additional Impulse point. Force Wall (5 Impulse): as an action, you raise an invisible wall of force at a point you can see within 120 feet for up to 10 minutes (concentration), shaped as up to ten contiguous 10-foot-square panels or as a hemispherical dome or sphere with a radius of up to 10 feet. Nothing can physically pass through the wall, and it can't be damaged.",
				level: 6,
				actionType: "passive",
			},
			{
				name: "Conversion Mastery",
				description:
					"When you use a discipline that calls for a saving throw, you can spend 1 additional Impulse point to increase its save DC by 2; this point doesn't count against your per-use limit. Your elemental output has been perfected.",
				level: 17,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Omni-Burst",
				description:
					"As an action, spend 5 Impulse points to release every element at once: each creature in a 30-foot cone must make an AGI saving throw against your Job save DC, taking 2d6 fire, 2d6 cold, 2d6 lightning, and 2d6 force damage on a failure, or half as much on a success.",
				recharge: 0,
				cost: "5 Impulse",
			},
		],
		stats: {
			primaryAttribute: "Agility",
			secondaryAttribute: "Sense",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "striker--entropic-flow",
		name: "Path of the Entropic Flow",
		jobId: "striker",
		jobName: "Striker",
		tier: 2,
		pathType: "entropic-flow",
		requirements: {
			level: 3,
		},
		description:
			"The Entropic Flow is walked by those whose internal aetheric Rifts fire in seemingly chaotic, unpredictable patterns. They do not fight with discipline, but with a fluidity that disregards the Absolute's logic. To an observer, they appear to be stumbling, tripping, and swaying through combat—yet every movement somehow lands a devastating blow or evades an impossible strike. They are the living embodiment of the 'unlucky' hit that always finds its mark.",
		features: [
			{
				name: "Erratic Resonance",
				description:
					"When you use Rite of Force, you gain the benefit of the Disengage action, and your walking speed increases by 10 feet until the end of the current turn. Your chaotic movement confuses all defenses.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Entropic Realignment",
				description:
					"Standing up from prone costs you only 5 feet of movement. When a creature misses you with a melee attack roll, you can use your reaction and spend 1 Impulse point to make that attack hit another creature of your choice within 5 feet of you, other than the attacker. Your essence displaces the impact.",
				level: 6,
				actionType: "passive",
			},
			{
				name: "Harmonic Correction",
				description:
					"When you make an ability check, an attack roll, or a saving throw with disadvantage, you can spend 2 Impulse points to cancel the disadvantage for that roll. The Absolute realigns to favor your chaos.",
				level: 11,
				actionType: "passive",
			},
			{
				name: "Cascade Assault",
				description:
					"When you use Rite of Force, you can make up to three additional unarmed strikes with it, up to five in total, as long as each strike targets a different creature this turn. Your displaced body appears everywhere at once. You gain a +1 bonus to all saving throws.",
				level: 17,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Entropic Counter",
				description:
					"Reaction when missed within 5 ft: unarmed strike with advantage as your essence lunges into an unscripted counterattack. Prof uses/short rest.",
				recharge: 0,
				cost: "Reaction",
			},
		],
		stats: {
			primaryAttribute: "Agility",
			secondaryAttribute: "Presence",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "striker--blade-conductor",
		name: "Path of the Blade Conductor",
		jobId: "striker",
		jobName: "Striker",
		tier: 2,
		pathType: "blade-conductor",
		requirements: {
			level: 3,
		},
		description:
			"The Blade Conductor mandate allows an Ascendant to extend their internal aetheric Rifts into physical steel. They do not just carry weapons; they bond with them, turning a simple blade into a high-frequency conductor for the Absolute's destructive frequency. In the elite academies of the modern world, Conductors are praised for their lethal precision and the harmonic 'hum' of their steel as it carves through reality.",
		features: [
			{
				name: "Aetheric Weapon Bond",
				description:
					"Choose two weapons to bond with your aetheric network: one melee weapon and one ranged weapon, each a simple or martial weapon without the heavy or special property. You're proficient with them, and they count as Striker weapons for you. If you make an unarmed strike as part of the Attack action on your turn while holding your bonded melee weapon, you gain a +2 bonus to AC until the start of your next turn, as long as you aren't incapacitated. As a bonus action, you can spend 1 Impulse point so that, until the end of the turn, each hit with your bonded ranged weapon deals an extra 1d4 + your SENSE modifier damage.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Harmonic Edge",
				description:
					"Your bonded weapons count as magical for overcoming resistance and immunity, and they deal force damage. Keen Strike: once on each of your turns, when you hit with a bonded weapon, you can spend 1 Impulse point to deal extra damage equal to one roll of your Impulse Combat die.",
				level: 6,
				actionType: "passive",
			},
			{
				name: "Resonance Honing",
				description:
					"As a bonus action, spend 1 to 3 Impulse points to hone a nonmagical bonded weapon you're holding: it gains a bonus to attack and damage rolls equal to the points spent for 1 minute, or until you use this feature again. You vibrate the blade at a molecular level.",
				level: 11,
				actionType: "passive",
			},
			{
				name: "Aetheric Alignment",
				description:
					"Miss with a bonded weapon on your turn → your essence auto-adjusts. Reroll the attack. Once/turn.",
				level: 17,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Blade Tempest",
				description:
					"As an action, spend 4 Impulse points to make one melee attack with your bonded melee weapon against each creature of your choice within 10 feet of you; these attacks have a reach of 10 feet. Each hit deals the weapon's damage plus two rolls of your Impulse Combat die.",
				recharge: 0,
				cost: "4 Impulse",
			},
		],
		stats: {
			primaryAttribute: "Agility",
			secondaryAttribute: "Sense",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "striker--harmonic-surgeon",
		name: "Path of the Harmonic Surgeon",
		jobId: "striker",
		jobName: "Striker",
		tier: 2,
		pathType: "harmonic-surgeon",
		requirements: {
			level: 3,
		},
		description:
			"The Harmonic Surgeon mandate is granted to those whose understanding of aetheric pathways allows them to repair the physical vessel with a touch. In the modern world, they are the most critical members of any high-tier raid team, capable of shutting down enemy motor functions with clinical precision or realigning the broken essences of their allies mid-combat. They move with a cold, calculated efficiency that treats the battlefield as a triage unit.",
		features: [
			{
				name: "Mandated Insight",
				description: `Prof in Insight, Medicine, and alchemical kits. You can reroll a failed ability check once per short or long rest.`,
				level: 3,
				actionType: "passive",
			},
			{
				name: "Restorative Touch",
				description:
					"As an action, you can spend 1 Impulse point to touch a creature and restore hit points equal to one roll of your Impulse Combat die + your SENSE modifier. When you use Rite of Force, you can replace one of its unarmed strikes with a Restorative Touch without spending an Impulse point for the healing. Whenever you use Restorative Touch, you can spend 1 additional Impulse point to also end one disease or one of these conditions on the creature: blinded, deafened, paralyzed, poisoned, or stunned.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Essence Shutdown",
				description:
					"Once per turn, when you hit a creature with an unarmed strike, you can spend 1 Impulse point to deal extra necrotic damage equal to one roll of your Impulse Combat die + your SENSE modifier. The target's motor pathways seize: it must succeed on a VIT saving throw against your Job save DC or be poisoned until the end of your next turn.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Advanced Harmonic Surgery",
				description:
					"Restorative Touch can also end the charmed or frightened condition. Essence Shutdown no longer allows a saving throw: the target is poisoned until the end of your next turn.",
				level: 6,
				actionType: "passive",
			},
			{
				name: "Surgical Barrage",
				description:
					"When you use Rite of Force, you can replace each of its unarmed strikes with a Restorative Touch without spending Impulse points for the healing. You can also use Essence Shutdown with one Rite of Force strike each turn without spending an Impulse point.",
				level: 11,
				actionType: "passive",
			},
			{
				name: "Aetheric Resurrection",
				description:
					"As an action, touch a creature that died within the past 24 hours and spend 5 Impulse points to restart its internal resonance. It returns to life with hit points equal to 4d10 + your SENSE modifier, cured of the blinded, deafened, paralyzed, poisoned, and stunned conditions. Once per long rest.",
				level: 17,
				uses: { formula: "1", recharge: "long-rest" },
				resource: "5 Impulse points",
				tracking: "uses",
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Aetheric Heal",
				description:
					"As an action, spend 2 Impulse points and touch a creature: it regains hit points equal to 2d8 + your SENSE modifier, and you end one of these conditions on it: blinded, charmed, deafened, frightened, paralyzed, poisoned, or stunned.",
				recharge: 0,
				cost: "2 Impulse",
			},
		],
		stats: {
			primaryAttribute: "Sense",
			secondaryAttribute: "Agility",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "mage--detonation-specialist",
		name: "Path of the Detonation Specialist",
		jobId: "mage",
		jobName: "Mage",
		tier: 2,
		pathType: "detonation-specialist",
		requirements: {
			level: 2,
		},
		description:
			"The Detonation Specialist mandate is walked by those who treat aetheric energy as a raw, explosive substrate. They are the architects of controlled destruction, capable of weaving destructive mantras that bypass friendly resonances with surgical precision. In the high-stakes world of Rift clearance, they serve as the heavy artillery, turning the local weave into a localized supernova of calculated fury.",
		features: [
			{
				name: "Precision Targeting",
				description:
					"When you cast a damage spell affecting an area, choose up to 1+spell level creatures. They auto-succeed on saves and take no damage. Your Aetheric Sight excludes friendly resonances.",
				level: 2,
				actionType: "passive",
			},
			{
				name: "Residual Discharge",
				description:
					"When a creature succeeds on a save against your cantrip, your weave still deals half damage. The Absolute ensures partial manifestation of your intent.",
				level: 6,
				actionType: "passive",
			},
			{
				name: "Harmonic Amplification",
				description:
					"Add INT mod to the damage of any destructive spell you cast. Your mantras are optimized for maximum yield.",
				level: 10,
				actionType: "passive",
			},
			{
				name: "Overloaded Mantras",
				description:
					"When you cast a 5th-level or lower damage spell, deal maximum damage. Use again before long rest: Absolute strain deals 2d12 necrotic per spell level to you (increases each use).",
				level: 14,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Absolute Yield",
				description:
					"Next damage spell deals maximum damage. Once/long rest (additional uses cause 2d12 necrotic per level from Absolute strain).",
				recharge: 3,
				cost: "Free",
			},
		],
		stats: {
			primaryAttribute: "Intelligence",
			secondaryAttribute: "Vitality",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "mage--shield-compiler",
		name: "Path of the Shield Architect",
		jobId: "mage",
		jobName: "Mage",
		tier: 2,
		pathType: "shield-architect",
		requirements: {
			level: 2,
		},
		description:
			"The Shield Architect mandate is for those who view the weave of the Absolute as a protective barrier to be reinforced. They generate persistent aetheric shields that absorb damage and reject hostile manifestations. In a world where a single error can mean total annihilation, the Architect is the foundation of any successful suppression mission—the one whose continuous protection harmonics ensure the survival of the party.",
		features: [
			{
				name: "Aetheric Barrier",
				description:
					"When you manifest a protective spell of 1st+, generate a barrier with HP = 2×Mage level+INT mod. Damage to you hits the barrier first. Protective spells restore 2×spell level HP to the barrier.",
				level: 2,
				actionType: "passive",
			},
			{
				name: "Projected Shield",
				description:
					"Reaction: when a creature within 30 ft takes damage, your Aetheric Barrier absorbs it instead. You redirect your mandate remotely.",
				level: 6,
				actionType: "passive",
			},
			{
				name: "Optimized Wards",
				description:
					"Add prof bonus to ability checks for counter-manifestations (Counterspell, Dispel Magic). Your defensive weave is highly optimized.",
				level: 10,
				actionType: "passive",
			},
			{
				name: "Immunity Resonance",
				description:
					"Advantage on saves against spells. Resistance to spell damage. Your defensive resonance auto-filters hostile manifestations.",
				level: 14,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Barrier Restoration",
				description:
					"Restore your Aetheric Barrier to full HP by channeling ambient mana. Once/long rest.",
				recharge: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Intelligence",
			secondaryAttribute: "Vitality",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "mage--probability-mandate",
		name: "Path of the Probability Mandate",
		jobId: "mage",
		jobName: "Mage",
		tier: 2,
		pathType: "probability-mandate",
		requirements: {
			level: 2,
		},
		description:
			"The Probability Mandate designates an Ascendant who has learned to perceive the underlying variables of the Absolute. They do not see the future as a vision, but as a series of calculated outcomes that can be anchored into reality. In the modern world, they are the indispensable strategists of any high-tier guild, capable of overriding unfavorable resonance-branches and ensuring the 'unlucky' moment never comes to pass.",
		features: [
			{
				name: "Aetheric Alignment",
				description:
					"After long rest, run 2 resonance calibrations (roll 2d20). You can substitute any attack/save/check made by you or a visible creature with one of these results.",
				level: 2,
				actionType: "passive",
			},
			{
				name: "Efficient Insight",
				description:
					"When you manifest a divination spell of 2nd+, the efficient resonance refunds essence: regain one spell slot of lower level (max 5th).",
				level: 6,
				actionType: "passive",
			},
			{
				name: "Oracle's Perception",
				description:
					"Action: activate one enhanced sensor until rest: darkvision 60 ft, see ethereal 60 ft, decipher any language, or detect invisible within 10 ft.",
				level: 10,
				actionType: "passive",
			},
			{
				name: "Master Computation",
				description:
					"Calculate 3 probabilities (roll 3d20) instead of 2. Your ability to anchor favorable outcomes is unsurpassed.",
				level: 14,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Mandate Override",
				description: `Force a creature to reroll any d20 and take the lower result. You override the local probability branch. Once/short rest. Your movement speed increases by 5 feet.`,
				recharge: 1,
				cost: "Reaction",
			},
		],
		stats: {
			primaryAttribute: "Intelligence",
			secondaryAttribute: "Sense",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "mage--phantasmist",
		name: "Path of the Phantasmist",
		jobId: "mage",
		jobName: "Mage",
		tier: 2,
		pathType: "phantasmist",
		requirements: {
			level: 2,
		},
		description:
			"The Phantasmist mandate is walked by those who have mastered the art of weaving aetheric fakes so sophisticated that the Absolute itself accepts them as genuine resonance. They do not just create illusions; they inject false realities into the world, bypassing all senses to fool both sentient and anomalous threats. At their peak, their phantasms can manifest physical presence, proving that in the Absolute's eye, perception IS reality.",
		features: [
			{
				name: "Refined Projection",
				description:
					"You can weave a minor phantasm at will. As an action, create a sound, an image of an object, or both at a point within 30 feet of you. The phantasm lasts for 1 minute, until you dismiss it (no action), or until you create another. A sound can be as quiet as a whisper or as loud as a scream. An image can be no larger than a 5-foot cube; it can't create light, smell, or any other sensory effect, and physical interaction reveals it as an illusion because things pass through it. A creature that uses its action to examine the phantasm can tell it is an illusion with a successful Intelligence (Investigation) check against your spell save DC. You gain proficiency in one skill or tool of your choice.",
				level: 2,
				actionType: "passive",
			},
			{
				name: "Phantasmal Editing",
				description: `When you manifest an illusion with 1+ min duration, use an action to dynamically alter its properties in real-time. You gain proficiency in one skill or tool of your choice.`,
				level: 6,
				actionType: "passive",
			},
			{
				name: "Echo Displacement",
				description:
					"Reaction when attacked: project an aetheric duplicate that causes the attack to miss. Your body was never where it seemed. Once/short rest.",
				level: 10,
				actionType: "passive",
			},
			{
				name: "Reality Anchoring",
				description:
					"When you manifest a 1st+ illusion, choose one inanimate object within it—it becomes genuinely real for 1 minute as the Absolute accepts the aetheric reflection.",
				level: 14,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Phantasmal Terrain",
				description:
					"Weave a 30-ft cube of illusory difficult terrain that feels real to all who enter. INT save to disbelieve. 1 min.",
				cost: "Action",
				actionType: "action",
				uses: { formula: "1", recharge: "long-rest" },
				tracking: "uses",
			},
		],
		stats: {
			primaryAttribute: "Intelligence",
			secondaryAttribute: "Presence",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "mage--rift-caller",
		name: "Path of the Rift Caller",
		jobId: "mage",
		jobName: "Mage",
		tier: 2,
		pathType: "rift-caller",
		requirements: {
			level: 2,
		},
		description:
			"The Rift Caller mandate is for those who treat physical space as a mere suggestion. They specialize in tearing open micro-gates to pull matter from distant reaches or summon reinforcements from the Absolute's many reflections. In the modern world of gate-containment, they are the masters of logistics and tactical displacement, moving through reality via dimensional shortcuts that bypass all conventional defenses.",
		features: [
			{
				name: "Aetheric Rift",
				description:
					"Action: open a tiny rift and pull an inanimate object through. Lasts until you use this again or 1 hour passes.",
				level: 2,
				actionType: "passive",
			},
			{
				name: "Rift Step",
				description:
					"Action: teleport 30 ft, or swap positions with a willing Small/Medium creature within 30 ft. Once/long rest or until you manifest a conjuration spell.",
				level: 6,
				actionType: "passive",
			},
			{
				name: "Stabilized Rifts",
				description:
					"Your concentration on a rift-based spell can't be broken by physical damage. Your rifts are structurally reinforced by the Absolute.",
				level: 10,
				actionType: "passive",
			},
			{
				name: "Reinforced Summons",
				description: `Creatures pulled through your rifts arrive bolstered by 30 temp HP of raw aetheric energy. You gain proficiency in one skill or tool of your choice.`,
				level: 14,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Emergency Rift",
				description:
					"Teleport up to 60 ft as a bonus action via a micro-gate. Prof uses/long rest.",
				recharge: 0,
				cost: "Bonus action",
			},
		],
		stats: {
			primaryAttribute: "Intelligence",
			secondaryAttribute: "Vitality",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "mage--matter-weaver",
		name: "Path of the Matter Weaver",
		jobId: "mage",
		jobName: "Mage",
		tier: 2,
		pathType: "matter-weaver",
		requirements: {
			level: 2,
		},
		description:
			"The Matter Weaver mandate allows an Ascendant to rewrite the fundamental physical properties of the local substrate. They treat the world as a programmable weave, capable of turning steel to glass or concrete to water with a single aetheric command. In the modern world of advanced alchemy and essence-cultivation, the Weaver is a priceless asset for both guild construction and tactical environmental manipulation.",
		features: [
			{
				name: "Material Realignment",
				description:
					"Spend 10 min to rewrite one material into another (wood→stone, etc.). Reverts after 1 hour or if you use this again.",
				level: 2,
				actionType: "passive",
			},
			{
				name: "Aetheric Core",
				description:
					"You can spend 8 hours crystallizing ambient mana into an Aetheric Core. Whoever carries it (you, or a creature you give it to) gains the benefit you chose for it when you gained this feature: Night Lattice (darkvision out to 60 feet), Swift Lattice (+10 feet to walking speed while the carrier isn't encumbered), Enduring Lattice (proficiency in Vitality saving throws), or a ward that grants resistance to one damage type: Acid Ward, Cold Ward, Fire Ward, Lightning Ward, or Thunder Ward. Each time you cast a transmutation spell of 1st level or higher while the core is on your person, you can change its benefit; record the new benefit in place of the old one. Only one core works at a time: making a new one ends the old one.",
				level: 6,
				actionType: "passive",
			},
			{
				name: "Aetheric Bio-Transmutation",
				description: `Assume an animal form of CR 1 or lower. Once/short rest. Your body temporarily rewrites itself via the Absolute's mandate. You gain advantage on Constitution saving throws to maintain concentration on a spell.`,
				level: 10,
				actionType: "passive",
			},
			{
				name: "Master Weaver's Rite",
				description:
					"As an action, you can shatter your Aetheric Core to release one of these effects. You can't make a new core until you finish a long rest. Grand Realignment: transmute a nonmagical object you touch, no larger than a 5-foot cube, into another nonmagical object of similar size and mass and of equal or lesser value; you must handle the object for 10 minutes before you shatter the core. Purge: one creature you touch has all curses, diseases, and poisons removed and regains all its hit points. Raise the Fallen: touch a creature that died within the last 10 days and whose body is mostly intact; if its soul is willing and free, it returns to life with 1 hit point, its poisons and nonmagical diseases are neutralized, and it takes a -4 penalty to attack rolls, saving throws, and ability checks that drops by 1 each time it finishes a long rest. Reverse the Years: touch a willing creature; its apparent age drops by 3d10 years, to a minimum of 13, without extending its lifespan.",
				level: 14,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Molecular Override",
				description:
					"Touch an object and rewrite its composition for 1 hour. Once/short rest.",
				cost: "Action",
				actionType: "action",
				uses: { formula: "1", recharge: "short-rest" },
				tracking: "uses",
			},
		],
		stats: {
			primaryAttribute: "Intelligence",
			secondaryAttribute: "Sense",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "esper--draconic-lineage",
		name: "Path of the Aetheric Dragon",
		jobId: "esper",
		jobName: "Esper",
		tier: 2,
		pathType: "aetheric-dragon",
		requirements: {
			level: 1,
		},
		description:
			"The Aetheric Dragon mandate awakens in those whose anomalous resonance carries the signature of the primordial Rift dragons—ancient masters of the Absolute who predated even the current cycle of Rifts. Their spirit manifests as elemental fury, their very cells crystallizing into regent-tier mana-scales that hum with the power of a dying star. They are not merely casters; they are living manifestations of the Absolute's primal rage.",
		features: [
			{
				name: "regent-tier Resonance",
				description:
					"Choose an aetheric dragon type. Double prof bonus on PRE checks with regent-tier beings. Instinctively understand the ancient Primordial tongue.",
				level: 1,
				actionType: "passive",
			},
			{
				name: "Aetheric Scale Armor",
				description:
					"Aetheric mana reinforces your physical vessel. HP +1 per Esper level. Unarmored AC = 13+AGI mod.",
				level: 1,
				actionType: "passive",
			},
			{
				name: "Elemental Affinity",
				description:
					"When you manifest a spell matching your dragon's resonance, add PRE mod to the effect. Spend 1 Flux for resistance to that element for 1 hour.",
				level: 6,
				actionType: "passive",
			},
			{
				name: "Wings of the Absolute",
				description:
					"Bonus action: manifest wings of crystallized mana. Fly speed = walking speed. Last until dismissed.",
				level: 14,
				actionType: "passive",
			},
			{
				name: "regent-tier Mandate",
				description:
					"Action: 60-ft aura of regent-tier pressure. PRE save or charmed/frightened. 1 min, concentration. 5 Flux.",
				level: 18,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Dragon Breath",
				description:
					"30-ft cone or 60-ft line: 4d8 damage of your resonance type, AGI save for half. 3 Flux.",
				recharge: 0,
				cost: "3 Flux",
			},
		],
		stats: {
			primaryAttribute: "Presence",
			secondaryAttribute: "Vitality",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "esper--aetheric-cascade",
		name: "Path of the Aetheric Cascade",
		jobId: "esper",
		jobName: "Esper",
		tier: 2,
		pathType: "aetheric-cascade",
		requirements: {
			level: 1,
		},
		description:
			"The Aetheric Cascade mandate is granted to those whose connection to the Absolute was shattered and reformed into a volatile reactive core. They do not just cast; they trigger cascading aetheric events that baffle traditional understanding. Each manifestation is a harmonic anomaly, a reality-warping discharge that can heal an ally or incinerate a foe with the same unpredictable fervor.",
		features: [
			{
				name: "Cascade Trigger",
				description:
					"After manifesting a 1st+ spell, the local Absolute weave may trigger a Cascade (d20). On 1, roll on the Aetheric Cascade table for a random discharge.",
				level: 1,
				actionType: "passive",
			},
			{
				name: "Riding the Cascade",
				description:
					"Lean into your instability. Gain advantage on one attack or check. The Absolute will demand a Cascade in return for this favor.",
				level: 1,
				actionType: "passive",
			},
			{
				name: "Probability Realignment",
				description:
					"Reaction: when a visible creature makes an attack or save, spend 2 Flux to roll 1d4 and adjust their result. You nudge the local fate-branch.",
				level: 6,
				actionType: "passive",
			},
			{
				name: "Selective Cascade",
				description:
					"When you roll on the Cascade table, roll twice and choose which manifestation to anchor into reality.",
				level: 14,
				actionType: "passive",
			},
			{
				name: "Absolute Chain Reaction",
				description:
					"When you roll max on a damage die for a spell, reroll that die and add to the total. Your internal reactor is chain-reacting.",
				level: 18,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Cascade Bolt",
				description:
					"Hurlraw unstable mana: 2d8+1d6, damage type random. If the d8s match, the bolt cascades to another target.",
				recharge: 0,
				cost: "1st-level slot",
			},
		],
		stats: {
			primaryAttribute: "Presence",
			secondaryAttribute: "Vitality",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "esper--shadow-magic",
		name: "Path of the Void Resonance",
		jobId: "esper",
		jobName: "Esper",
		tier: 2,
		pathType: "shadow",
		requirements: {
			level: 1,
		},
		description:
			"Espers who draw power from the empty space between Rift dimensions — the void that separates realities. They tend to be quiet, withdrawn individuals whose internal resonance focuses on the silence behind the Absolute's weave. Environmental fluctuations are common when they pass, and the shadows around them often seem to detach from their physical anchors. They command absolute darkness, summon void-born entities, and can dissolve their physical form into pure shadow-resonance.",
		features: [
			{
				name: "Void Sight",
				description:
					"Darkvision 120 ft. At 3rd level, cast Darkness for 2 flux and you can see through it — your eyes resonate with the void frequency.",
				level: 1,
				actionType: "passive",
			},
			{
				name: "Void Anchor",
				description:
					"When reduced to 0 HP (not by radiant or crit), PRE save DC 5+damage taken. Success: the void pulls you back. Drop to 1 HP instead. Once/long rest.",
				level: 1,
				actionType: "passive",
			},
			{
				name: "Void Hound",
				description:
					"Bonus action, 3 flux: manifest a shadow predator from the void that relentlessly pursues one creature. Target has disadvantage on saves vs your spells while the hound is within 5 ft.",
				level: 6,
				actionType: "passive",
			},
			{
				name: "Void Step",
				description:
					"Bonus action in dim light/darkness: step through the void. Teleport up to 120 ft to another dim/dark space.",
				level: 14,
				actionType: "passive",
			},
			{
				name: "Void Form",
				description:
					"6 flux, bonus action: dissolve into void-mana for 1 min. Resistance to all except force and radiant. Phase through creatures/objects. End turn in an object = 1d10 force.",
				level: 18,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Void Lance",
				description:
					"60-ft ranged spell attack: 3d8 necrotic + target's reactions suppressed until start of your next turn. 2 flux.",
				recharge: 0,
				cost: "2 flux",
			},
		],
		stats: {
			primaryAttribute: "Presence",
			secondaryAttribute: "Vitality",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "esper--storm-sorcery",
		name: "Path of the Tempest Core",
		jobId: "esper",
		jobName: "Esper",
		tier: 2,
		pathType: "storm",
		requirements: {
			level: 1,
		},
		description:
			"The Path of the Tempest Core is for those whose anomalous resonance is synchronized with absolute atmospheric pressure. Lightning arcs from their skin during moments of high resonance-flux, wind shifts when they move, and environmental sensors fluctuate wildly in their presence. They are the living conduits of the Absolute's storms, their internal resonance-field powered by the very energy that structures a Rift's atmosphere.",
		features: [
			{
				name: "Atmospheric Sense",
				description: `Speak, read, and write Primordial (and its dialects). You instinctively read weather and atmospheric pressure. You gain proficiency in one skill or tool of your choice.`,
				level: 1,
				actionType: "passive",
			},
			{
				name: "Storm Discharge",
				description:
					"Before or after casting a 1st+ spell, your flux discharges as wind — bonus action to fly 10 ft without provoking OAs.",
				level: 1,
				actionType: "passive",
			},
			{
				name: "Tempest Core",
				description:
					"Resistance to lightning and thunder. When you cast a 1st+ spell dealing lightning/thunder, arc lightning deals damage = half Esper level to creatures of your choice within 10 ft.",
				level: 6,
				actionType: "passive",
			},
			{
				name: "Weather Control",
				description:
					"If raining, stop rain in 20-ft sphere. Bonus action: control wind direction within 100 ft for 1 round.",
				level: 6,
				actionType: "passive",
			},
			{
				name: "Storm Retaliation",
				description:
					"Reaction when hit by melee: discharge lightning = Esper level and STR save or pushed 20 ft.",
				level: 14,
				actionType: "passive",
			},
			{
				name: "Eye of the Storm",
				description:
					"Immunity to lightning and thunder. 60-ft fly speed. Action: share flight (reduce to 30 ft for 1 hour, give up to 3+PRE mod creatures 30-ft fly).",
				level: 18,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Thunder Rift",
				description:
					"Teleport 90 ft via lightning bolt. Creatures within 10 ft of origin take 3d10 thunder (VIT half). Can bring one willing creature.",
				recharge: 0,
				cost: "3rd-level slot",
			},
		],
		stats: {
			primaryAttribute: "Presence",
			secondaryAttribute: "Vitality",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "esper--absolute-spark",
		name: "Path of the Absolute Spark",
		jobId: "esper",
		jobName: "Esper",
		tier: 2,
		pathType: "absolute-spark",
		requirements: {
			level: 1,
		},
		description:
			"Espers who carry a fragment of the Absolute's core energy — not mere Rift mana, but the fundamental force itself. Often individuals whose innate empathy resonated with the restorative layers of the Absolute during their awakening, they access both destructive Esper resonance-flux and Herald restorative transmissions. They are the rarest anomaly type, serving as the ultimate stabilizers for high-tier containment missions.",
		features: [
			{
				name: "Dual Manifestation Access",
				description: `Learn one Herald transmission based on affinity (Restoration: Cure Wounds, Entropy: Inflict Wounds, Order: Bless, Chaos: Bane, Balance: Protection from Evil and Good). Access both Esper and Herald manifestation lists. You gain proficiency in one skill or tool of your choice.`,
				level: 1,
				actionType: "passive",
			},
			{
				name: "Absolute Favor",
				description:
					"When you fail a save or miss an attack, the Absolute nudges reality. Add 2d4 to the roll. Once/short rest.",
				level: 1,
				actionType: "passive",
			},
			{
				name: "Healing Amplification",
				description:
					"When you or ally within 5 ft rolls dice to heal with a spell, spend 1 flux to reroll any number of those dice. Once/turn.",
				level: 6,
				actionType: "passive",
			},
			{
				name: "Aetheric Wings",
				description:
					"Bonus action: manifest spectral wings of Absolute energy. 30-ft fly speed. Last until dismissed.",
				level: 14,
				actionType: "passive",
			},
			{
				name: "Emergency Restoration",
				description:
					"When below half HP, bonus action: the Absolute floods you with restorative energy. Regain HP = half your HP max. Once/long rest.",
				level: 18,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Absolute Healing Surge",
				description:
					"Manifest a healing rite and add PRE mod to each die of restorative resonance. The Absolute amplifies your output. 2 flux.",
				recharge: 0,
				cost: "2 flux",
			},
		],
		stats: {
			primaryAttribute: "Presence",
			secondaryAttribute: "Sense",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "esper--aberrant-mind",
		name: "Path of the Psionic Breach",
		jobId: "esper",
		jobName: "Esper",
		tier: 2,
		pathType: "aberrant",
		requirements: {
			level: 1,
		},
		description:
			"Espers touched by entities from beyond the known Rift network — alien intelligences whose psionic imprint rewired their resonance during awakening. These Ascendants often perceive the Absolute not as a network of laws, but as a collective of interconnected consciousnesses that exist outside of traditional time. They cast with thought alone, their minds becoming an impenetrably alien echo of the Absolute's deepest layers.",
		features: [
			{
				name: "Psionic Imprint Spells",
				description:
					"Learn bonus spells at 1st,3rd,5th,7th,9th (Arms of Hadar, Calm Emotions, Hunger of Hadar, Evard's Black Tentacles, Telekinesis). Swap each for divination/enchantment.",
				level: 1,
				actionType: "passive",
			},
			{
				name: "Telepathic Link",
				description:
					"Bonus action: establish psionic link with one creature within 30 ft for Esper level minutes. Communicate in any known language via thought.",
				level: 1,
				actionType: "passive",
			},
			{
				name: "Psionic Casting",
				description:
					"Cast a psionic spell by spending flux = spell level instead of a slot. No verbal or somatic components — pure thought casting.",
				level: 6,
				actionType: "passive",
			},
			{
				name: "Psionic Hardening",
				description:
					"Resistance to psychic damage. Advantage on saves vs charmed/frightened. Your alien mind rejects intrusion.",
				level: 6,
				actionType: "passive",
			},
			{
				name: "Psionic Metamorphosis",
				description:
					"1+ flux, bonus action: reshape your body for 10 min. 1 pt: see invisible 60 ft. 1 pt: hover fly speed = walk. 1 pt: swim 2× walk + breathe water. 1 pt: compress body through 1-inch gaps.",
				level: 14,
				actionType: "passive",
			},
			{
				name: "Psionic Implosion",
				description:
					"Action: teleport 120 ft. Each creature within 30 ft of origin: STR save or 3d10 force + pulled to your old space. Success: half, no pull. Once/long rest or 5 flux.",
				level: 18,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Psionic Lance",
				description:
					"60 ft: 3d8 psychic, target can't hide from you for 1 hour. 2nd-level slot or 2 flux.",
				recharge: 0,
				cost: "2 flux",
			},
		],
		stats: {
			primaryAttribute: "Presence",
			secondaryAttribute: "Intelligence",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "revenant--void-lord",
		name: "Path of the Void Eater",
		jobId: "revenant",
		jobName: "Revenant",
		tier: 2,
		pathType: "void-eater",
		requirements: {
			level: 2,
		},
		description:
			"The Void Eater answers Marthos's hunger without restraint: entropy is not a tool but an appetite. Where other Revenants harvest the dying, the Void Eater hastens the dying, treating a wounded foe as a feast half-served. Their necrosis pours through the flimsy wards of the living, and every kill only sharpens the next. The Ascendant Bureau fields them when a Rift must be emptied rather than held - the longer the fight lasts, the less of the enemy remains.",
		features: [
			{
				name: "Unresisted Decay",
				description:
					"Your necrotic damage ignores resistance, and a creature already below half its hit points has vulnerability to your necrotic damage.",
				level: 2,
				actionType: "passive",
			},
			{
				name: "Feast of the Fallen",
				description:
					"Once per turn, when a creature marked for the reaping drops to 0 hit points, you reclaim 2 Remnants instead of 1, and your next necrotic spell or power this turn deals additional necrotic damage equal to your Intelligence modifier.",
				level: 2,
				actionType: "passive",
			},
			{
				name: "Chain of Endings",
				description:
					"When you reduce a creature to 0 hit points with necrotic damage, entropy leaps to the nearest creature within 15 feet, dealing necrotic damage equal to your Revenant level and marking it for the reaping. If this reduces that creature to 0, the chain continues.",
				level: 6,
				actionType: "passive",
			},
			{
				name: "Execute the Withering",
				description:
					"As a bonus action, spend 2 Remnants to pass sentence on a creature marked for the reaping that is below one-quarter of its hit points: it must succeed on a Vitality save or drop to 0 hit points, taking 4d10 + your Intelligence modifier necrotic damage on a success instead.",
				level: 10,
				actionType: "passive",
			},
			{
				name: "Mass Annihilation",
				description:
					"Whenever you reduce a creature to 0 hit points with a necrotic spell or score a critical hit with one, every other creature marked for the reaping within 30 feet takes necrotic damage equal to half your Revenant level. Marks that survive are renewed.",
				level: 14,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Devour the Remnant",
				description:
					"Action: detonate a corpse or a creature marked for the reaping within 60 feet. Each creature in a 15-foot radius takes 4d8 + your Intelligence modifier necrotic damage (Vitality save for half) and is marked for the reaping; you reclaim 1 Remnant for each creature reduced to 0. Once per long rest.",
				recharge: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Intelligence",
			secondaryAttribute: "Intelligence",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "revenant--entropy-drinker",
		name: "Path of the Black Blood",
		jobId: "revenant",
		jobName: "Revenant",
		tier: 2,
		pathType: "black-blood",
		requirements: {
			level: 2,
		},
		description:
			"The Black Blood walks the oldest bargain of the End-Cycle: pay in your own life and entropy repays it tenfold. Their veins run with congealed Remnant-essence that they spend freely, wounding themselves to deepen the harvest and turning every blow they suffer into slow, crawling recovery. They are the Revenants who simply refuse to fall, buoyed by a tide of blood - their own and their enemies' - that never quite runs dry.",
		features: [
			{
				name: "Blood Price",
				description:
					"Once on each of your turns when you cast a spell or use a power, you may take necrotic damage equal to your Revenant level (this damage cannot be reduced or prevented) to add your Intelligence modifier to that ability's damage and mark each creature it hits for the reaping.",
				level: 2,
				actionType: "passive",
			},
			{
				name: "Crimson Leech",
				description:
					"Once per turn, when you deal necrotic damage to a creature marked for the reaping, you regain hit points equal to 1 + the number of Remnants you currently hold.",
				level: 2,
				actionType: "passive",
			},
			{
				name: "Wounds That Feed",
				description:
					"Whenever you take damage, you gain healing over time: at the start of each of your next two turns you regain hit points equal to half the damage taken, to a maximum of your Revenant level per turn.",
				level: 6,
				actionType: "passive",
			},
			{
				name: "Overflow",
				description:
					"Whenever healing would raise you above your hit point maximum, the excess becomes temporary hit points (up to your Intelligence modifier + your Revenant level) and you may immediately bank 1 Remnant.",
				level: 10,
				actionType: "passive",
			},
			{
				name: "Crimson Surge",
				description:
					"While you are below half your hit point maximum, your Crimson Leech healing doubles and your Blood Price costs no hit points. The nearer you stand to death, the more death sustains you.",
				level: 14,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Hemorrhage",
				description:
					"Action: a creature within 30 feet must make a Vitality save or take 4d8 necrotic damage and begin bleeding for 1 minute (repeating the save at the end of each of its turns to end the effect). While it bleeds, you regain hit points equal to half the bleed damage each round. Once per long rest.",
				recharge: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Intelligence",
			secondaryAttribute: "Vitality",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "revenant--wither-guard",
		name: "Path of the Hollow King",
		jobId: "revenant",
		jobName: "Revenant",
		tier: 2,
		pathType: "hollow-king",
		requirements: {
			level: 2,
		},
		description:
			"The Hollow King rules the front line from a throne of decay. They draw every eye and every blade, daring the enemy to spend itself against an entropy that cannot be outlasted. What strikes their allies, they take instead; what strikes them, they turn to dust. Marthos's mandate names them wardens of the threshold - the immovable dead who hold the breach while the living do their work behind.",
		features: [
			{
				name: "Decree of the Hollow Throne",
				description:
					"As a bonus action, exert your dread authority in a 15-foot aura until the start of your next turn: each enemy that starts its turn in the aura or enters it is marked for the reaping, and marked enemies have disadvantage on attack rolls against creatures other than you.",
				level: 2,
				actionType: "passive",
			},
			{
				name: "Throne Ward",
				description:
					"When a creature you can see within 10 feet takes damage, you can use your reaction to take that damage instead; you may then spend 1 Remnant to reduce it by 1d8 + your Vitality modifier.",
				level: 2,
				actionType: "passive",
			},
			{
				name: "Grave-Cold Presence",
				description:
					"Enemies marked by your Decree have their speed halved while inside the aura, and the first time each turn one of them hits you, it takes necrotic damage equal to your Intelligence modifier.",
				level: 6,
				actionType: "passive",
			},
			{
				name: "Unbreakable Vigil",
				description:
					"While at least one enemy is marked for the reaping, you have resistance to all damage dealt by marked creatures, and you cannot be moved, knocked prone, or banished against your will.",
				level: 10,
				actionType: "passive",
			},
			{
				name: "Crown of Cessation",
				description:
					"When you are reduced to half your hit point maximum or lower, your Decree aura expands to 30 feet and enemies marked within it must succeed on a Presence save or be unable to take reactions. The throne does not fall.",
				level: 14,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Entropy Carapace",
				description:
					"Bonus action: encase yourself in crystallized decay for 1 minute. You gain temporary hit points equal to your Revenant level + your Vitality modifier and +3 AC, and any creature that hits you with a melee attack takes 1d8 necrotic damage and is marked for the reaping. Once per long rest.",
				recharge: 3,
				cost: "Bonus action",
			},
		],
		stats: {
			primaryAttribute: "Intelligence",
			secondaryAttribute: "Vitality",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "revenant--entropy-blade",
		name: "Path of the Grave Shepherd",
		jobId: "revenant",
		jobName: "Revenant",
		tier: 2,
		pathType: "grave-shepherd",
		requirements: {
			level: 2,
		},
		description:
			"The Grave Shepherd does on a battlefield what Marthos does on a cosmic scale: it reaps the fallen and sets them to work. Rather than scatter its harvest, the Shepherd binds a single great Remnant into an elite thrall - a risen champion stitched from the strongest dead - and commands it as an extension of its own will. Few in number but terrible in strength, the Shepherd's risen turn every casualty into a reinforcement.",
		features: [
			{
				name: "Command the Risen",
				description:
					"As an action, spend 3 Remnants to raise one elite thrall from a corpse or a creature marked for the reaping that died within the last minute. The thrall obeys you, acts on your turn, shares your necrotic resistance, and has hit points equal to five times your Revenant level. You may have one thrall at a time (two at 14th level).",
				level: 2,
				actionType: "passive",
			},
			{
				name: "Shepherd's Bond",
				description:
					"Your thrall uses your spell save DC and proficiency bonus. While it is within 30 feet of you, you may use your reaction to have it move up to its speed and make one attack, or interpose itself to take an attack aimed at you.",
				level: 2,
				actionType: "passive",
			},
			{
				name: "Corpse Harvest",
				description:
					"When a creature dies within 30 feet of you or your thrall, you may bank 1 Remnant and your thrall regains hit points equal to your Intelligence modifier. As a bonus action, spend 1 Remnant to empower the thrall: its next attack deals additional necrotic damage equal to your Revenant level.",
				level: 6,
				actionType: "passive",
			},
			{
				name: "Two-Soul Tether",
				description:
					"Your thrall may take two actions on each of its turns, and when it would drop to 0 hit points you may spend 1 Remnant to keep it at 1 hit point instead.",
				level: 10,
				actionType: "passive",
			},
			{
				name: "Legion of One",
				description: `You may command two elite thralls at once, and once per turn when a creature marked for the reaping dies you may raise it as a temporary lesser risen that acts until the end of your next turn at no Remnant cost. You can reroll a failed ability check once per short or long rest.`,
				level: 14,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Reaping Decree",
				description:
					"Action: your thrall and every risen ally within 60 feet immediately move up to their speed and make one attack with advantage; each creature reduced to 0 hit points by this grants you 1 Remnant. Once per long rest.",
				recharge: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Intelligence",
			secondaryAttribute: "Intelligence",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "revenant--plague-weaver",
		name: "Path of the Dread Veil",
		jobId: "revenant",
		jobName: "Revenant",
		tier: 2,
		pathType: "dread-veil",
		requirements: {
			level: 2,
		},
		description:
			"The Dread Veil wears Marthos's terror like a shroud. Where they walk, the Void-Breath thickens until the bravest find their hands shaking and their courage rotting from within. They need not strike a foe that has already surrendered to despair - and those who flee only die tired. Bureau handlers deploy the Veil to break a Rift's defenders before a single real blow is struck.",
		features: [
			{
				name: "Shroud of the Veil",
				description:
					"As a bonus action, unfurl a 15-foot aura of dread until the start of your next turn. Each enemy that starts its turn in the aura must succeed on a Presence save or be frightened of you until the end of its next turn and marked for the reaping.",
				level: 2,
				actionType: "passive",
			},
			{
				name: "Withering Courage",
				description:
					"A creature frightened by you cannot take reactions, and the first time each turn it deals damage while frightened, that damage is reduced by your Intelligence modifier.",
				level: 2,
				actionType: "passive",
			},
			{
				name: "Paralytic Dread",
				description:
					"As a bonus action, spend 1 Remnant to lock a frightened creature you can see within 30 feet in place: its speed becomes 0 and it has disadvantage on saves to end the fear until the start of your next turn.",
				level: 6,
				actionType: "passive",
			},
			{
				name: "Contagion of Fear",
				description:
					"When a creature frightened by you fails a saving throw, the fear spreads: one other creature within 10 feet of it must succeed on a Presence save or also become frightened of you and marked for the reaping.",
				level: 10,
				actionType: "passive",
			},
			{
				name: "Terror Pulse",
				description:
					"When you reduce a frightened creature to 0 hit points, every enemy within 30 feet must succeed on a Presence save or become frightened of you until the end of their next turn. Frightened creatures have vulnerability to your necrotic damage.",
				level: 14,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Maw of the Void",
				description:
					"Action: every enemy in a 30-foot cone must make a Presence save. On a failure a creature is frightened for 1 minute (repeating the save at the end of each of its turns) and takes 3d8 necrotic damage; on a success it takes half damage and is marked for the reaping. Once per long rest.",
				recharge: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Intelligence",
			secondaryAttribute: "Presence",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "revenant--threshold-walker",
		name: "Path of the Threshold Walker",
		jobId: "revenant",
		jobName: "Revenant",
		tier: 2,
		pathType: "threshold-walker",
		requirements: {
			level: 2,
		},
		description:
			"The Threshold Walker stands where Marthos and Solara contend - on the exact line between the End-Cycle and the next dawn. Alone among Revenants, they can run the harvest backward, pouring reclaimed Remnants into failing allies and dragging the newly dead back across the threshold. To friends they are a cold mercy; to enemies, the hand that decides the moment has come.",
		features: [
			{
				name: "Reverse Entropy",
				description:
					"When you would deal necrotic damage with a spell or power, you may instead convert it to healing, restoring that many hit points divided as you choose among creatures within range.",
				level: 2,
				actionType: "passive",
			},
			{
				name: "Death-Sight",
				description:
					"You know the current hit points and any death-relevant conditions of every creature within 120 feet, and you always know which creatures are marked for the reaping.",
				level: 2,
				actionType: "passive",
			},
			{
				name: "Threshold Pull",
				description:
					"As a reaction when an ally within 30 feet drops to 0 hit points, spend 1 Remnant to bring them to 1 hit point and grant them temporary hit points equal to your Intelligence modifier + your Revenant level.",
				level: 6,
				actionType: "passive",
			},
			{
				name: "Mercy and Judgment",
				description:
					"Your Reverse Entropy healing adds your Intelligence modifier, and your necrotic damage against a creature below half its hit points increases by your Intelligence modifier. You ease allies on and enemies off the threshold with the same gesture.",
				level: 10,
				actionType: "passive",
			},
			{
				name: "Arbiter's Decree",
				description:
					"As an action, pass judgment on one creature within 30 feet: a creature dead no longer than 1 hour returns to life with hit points equal to your Revenant level + your Intelligence modifier, or a living creature must succeed on a Vitality save or take 10d8 necrotic damage as you shove it across the threshold. Once per long rest.",
				level: 14,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Threshold Pulse",
				description:
					"Action: in a 30-foot radius centered on you, allies regain 2d8 + your Intelligence modifier hit points and enemies take 2d8 + your Intelligence modifier necrotic damage (Vitality save for half). You are the fulcrum of the life-death axis. Once per long rest.",
				recharge: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Intelligence",
			secondaryAttribute: "Sense",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "summoner--biome-architect",
		name: "Path of the Biome Architect",
		jobId: "summoner",
		jobName: "Summoner",
		tier: 2,
		pathType: "biome-architect",
		requirements: {
			level: 2,
		},
		description:
			"The Biome Architect mandate is held by those who have attained a perfect resonance with a specific Rift ecosystem. They do not just survive; they recover their internal essence by absorbing ambient Rift energy with an efficiency that borders on the miraculous. In the containment protocols of the modern world, the Architect is indispensable for identifying and stabilizing the volatile environments that bleed into our reality.",
		features: [
			{
				name: "Biome Insight",
				description: `Learn one additional Summoner mantra from your bonded biome. You gain a +1 bonus to all saving throws.`,
				level: 2,
				actionType: "passive",
			},
			{
				name: "Biome Absorption",
				description: `During a moment of stillness, absorb ambient Rift energy: recover internal essence equivalent to half Summoner level. Once/long rest. You have advantage on initiative rolls.`,
				level: 2,
				actionType: "passive",
			},
			{
				name: "Biome Mantras",
				description: `Gain bonus always-prepared manifestations at 3rd, 5th, 7th, and 9th level based on your bonded Rift biome (Arctic, Coastal, Desert, Forest, Grassland, Mountain, Swamp, or Subterranean). You gain a +1 bonus to all saving throws.`,
				level: 3,
				actionType: "passive",
			},
			{
				name: "Terrain Fluidity",
				description:
					"Moving through difficult terrain within a Rift costs no extra effort. No damage from aetheric plants. Advantage on saves against magically manipulated flora.",
				level: 6,
				actionType: "passive",
			},
			{
				name: "Biome Adaptation",
				description:
					"Immune to poison and environmental disease. Your body has fully adapted to the Absolute's Rift habitats.",
				level: 10,
				actionType: "passive",
			},
			{
				name: "Biome Sanctuary",
				description: `Manifesting part of the Absolute's ecosystem around you, beasts and plant entities choice another target. Your resonance marks you as part of the environment. Your movement speed increases by 5 feet.`,
				level: 14,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Biome Surge",
				description:
					"Channel the local Rift energy: regain internal essence and gain advantage on environmental checks for 1 hour. Once/long rest.",
				recharge: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Sense",
			secondaryAttribute: "Vitality",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "summoner--apex-shifter",
		name: "Path of the Apex Shifter",
		jobId: "summoner",
		jobName: "Summoner",
		tier: 2,
		pathType: "apex-shifter",
		requirements: {
			level: 2,
		},
		description:
			"The Apex Shifter mandate is for those who seek to dominate their environment by assuming the physical vessels of the Absolute's apex predators. They do not merely shift; they undergo a total biological restructuring into powerful Rift creatures that exceed all earthly limits. In the modern world, they are the front-line tanks who lead every raid, their very existence a bridge between human consciousness and absolute fury.",
		features: [
			{
				name: "Absolute Entity Shift",
				description:
					"Entity Shift as bonus action. While in Rift creature form, spend aetheric essence to regain 1d8 HP per level.",
				level: 2,
				actionType: "passive",
			},
			{
				name: "Advanced Primordial Forms",
				description: `Entity Shift into Rift creatures of CR 1 (CR = Summoner level / 3 at higher levels). At 6th level, attacks in entity form count as aetheric. You can reroll a failed ability check once per short or long rest.`,
				level: 2,
				actionType: "passive",
			},
			{
				name: "Aetheric-Laced Strikes",
				description:
					"Attacks in shifted form count as physical aether for overcoming resistance. Your vessel channels the Absolute through every blow.",
				level: 6,
				actionType: "passive",
			},
			{
				name: "Elemental Integration",
				description: `Assume the form of an elemental entity from the Absolute's reflection (Air, Earth, Fire, or Water). You gain a +1 bonus to all saving throws.`,
				level: 10,
				actionType: "passive",
			},
			{
				name: "Adaptive Physiology",
				description:
					"Manifest minor biological shifts at will. Your body retains the ability to optimize its vessel even between full Entity Shifts.",
				level: 14,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Apex Manifestation",
				description:
					"Shift into an apex Rift entity for 1 hour. Retain all mandate access. Once/long rest.",
				recharge: 3,
				cost: "Bonus action",
			},
		],
		stats: {
			primaryAttribute: "Sense",
			secondaryAttribute: "Vitality",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "summoner--dream-weaver",
		name: "Path of the Dream Weaver",
		jobId: "summoner",
		jobName: "Summoner",
		tier: 2,
		pathType: "dream-weaver",
		requirements: {
			level: 2,
		},
		description:
			"The Dream Weaver mandate designates those who have forged a connection with the Lush-resonance—the restorative, semi-material reflections that drift along the boundaries of certain Rifts. They do not just heal; they manifest localized patches of aetheric stability that promote rapid biological repair. In the modern world, the Weaver is the emotional and physical anchor of any raid team, transforming a nightmare Rift Break into a temporary sanctuary.",
		features: [
			{
				name: "Balm of the Absolute",
				description:
					"Pool of d6s = Summoner level. Bonus action: heal a creature within 120 ft by spending dice + 1 temp HP per die spent.",
				level: 2,
				actionType: "passive",
			},
			{
				name: "Sanctuary of Light and Shadow",
				description: `During a moment of rest, create a 30-ft sphere ward. Allies inside gain +5 to Stealth and Perception. All within the Absolute's rest. When you take the Attack action, you can use your bonus action to make one melee weapon attack with a light weapon.`,
				level: 6,
				actionType: "passive",
			},
			{
				name: "Phantasmal Path",
				description:
					"Bonus action: teleport yourself or an ally within 30 ft to a visible location. SENSE mod uses/long rest.",
				level: 10,
				actionType: "passive",
			},
			{
				name: "Walker in Reflections",
				description: `After a rest, manifest Dream or Scrying without spending essence. Your connection to the Absolute allows for distant observation. You learn one cantrip of your choice from the wizard spell list. Intelligence is your spellcasting ability for it.`,
				level: 14,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Lush Blessing",
				description:
					"All allies within 30 ft regain 2d8 HP and gain advantage on saves against phantasm-effects for 1 min. Once/long rest.",
				recharge: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Sense",
			secondaryAttribute: "Presence",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "summoner--pack-commander",
		name: "Path of the Pack Commander",
		jobId: "summoner",
		jobName: "Summoner",
		tier: 2,
		pathType: "pack-commander",
		requirements: {
			level: 2,
		},
		description:
			"The Pack Commander mandate elevates a Summoner to the status of an absolute leader within the Rift's predatory hierarchy. They do not just summon entities; they command them like a unified tactical unit, reinforcing their creatures with their own internal aetheric essence. In the modern world, one Commander with a full menagerie is a one-person tactical squad, turning a solo raid into a coordinated absolute assault.",
		features: [
			{
				name: "Voice of the Absolute",
				description: `Manifest communication with all beasts of the Absolute. Your movement speed increases by 5 feet.`,
				level: 2,
				actionType: "passive",
			},
			{
				name: "Aetheric Totem",
				description:
					"Bonus action: manifest a totemic guardian (60-ft aura). Bear: allies gain temp HP and STR advantage. Hawk: allies gain Perception advantage. Unicorn: allies gain advantage on detection and enhanced restorative output.",
				level: 2,
				actionType: "passive",
			},
			{
				name: "Mighty Manifestation",
				description: `Entities you conjure gain +2 HP per hit die and their natural strikes count as aetheric. You gain proficiency in one skill or tool of your choice.`,
				level: 6,
				actionType: "passive",
			},
			{
				name: "Absolute Guardian",
				description: `Entities you summon that drop to 0 HP in your Totem aura instead regain half their HP max. The resonance refuses to let them fall. You have advantage on initiative rolls.`,
				level: 10,
				actionType: "passive",
			},
			{
				name: "Faithful Call",
				description: `When you drop to 0 HP, immediately conjure 4 Rift predators of CR 2 or lower to defend you. Once/long rest. You can reroll a failed ability check once per short or long rest.`,
				level: 14,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Absolute Alpha",
				description:
					"All summoned entities within 60 ft gain +2 to attack and deal extra 1d4 damage. Once/short rest.",
				recharge: 1,
				cost: "Bonus action",
			},
		],
		stats: {
			primaryAttribute: "Sense",
			secondaryAttribute: "Vitality",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "summoner--symbiotic-host",
		name: "Path of the Symbiotic Host",
		jobId: "summoner",
		jobName: "Summoner",
		tier: 2,
		pathType: "symbiotic-host",
		requirements: {
			level: 2,
		},
		description:
			"The Symbiotic Host mandate is given to those who have allowed their physical vessel to become a living ecosystem for mutualistic gate-organisms. They do not just host these symbiotes; they fuse with them to gain terrifying biological efficiencies and project a defensive field of aetheric spores. In the Absolute's cycle of life and death, the Host is the bridge where both processes occur simultaneously within the same body.",
		features: [
			{
				name: "Absolute Spore Cloud",
				description:
					"Reaction: creature within 10 ft must save or take necrotic damage. Your symbiotic colony reacts to perceived threats.",
				level: 2,
				actionType: "passive",
			},
			{
				name: "Host Fusion",
				description:
					"Expend Entity Shift to fuse with your colony. Gain temp HP = 4 × Summoner level. While fused, spore damage is absolute and strikes deal extra poison.",
				level: 2,
				actionType: "passive",
			},
			{
				name: "Colony Expansion",
				description:
					"Reaction when a creature falls within 10 ft: your symbiotes colonize the remnant. It rises to serve you for 1 hour. SENSE uses/long rest.",
				level: 6,
				actionType: "passive",
			},
			{
				name: "Projected Spore Zone",
				description:
					"While fused, bonus action: project your spore cloud as a mobile zone of entropic destruction.",
				level: 10,
				actionType: "passive",
			},
			{
				name: "Perfect Symbiosis",
				description:
					"Your colony protects all physical senses. Immune to blind, deaf, frighten, and poison. Crits against you are normalized by the colony's absorption.",
				level: 14,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Spore Eruption",
				description:
					"All creatures within 20 ft: VIT save or take 4d8 poison and become poisoned. Your colony erupts in a reality-warping discharge. Once/long rest.",
				recharge: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Sense",
			secondaryAttribute: "Vitality",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "summoner--cosmic-conduit",
		name: "Path of the Cosmic Conduit",
		jobId: "summoner",
		jobName: "Summoner",
		tier: 2,
		pathType: "cosmic-conduit",
		requirements: {
			level: 2,
		},
		description:
			"The Cosmic Conduit mandate is for those who draw power from the massive, distant aetheric vibrations that resonate through high-rank Rifts. They do not just see stars; they channel the fundamental cosmic energy of the Absolute into manifestations of healing, destruction, and prophetic anchoring. In the modern world, they are the supreme mystics of the gate-age, their every action informed by a variable cosmic map only they can perceive.",
		features: [
			{
				name: "Absolute Cosmic Map",
				description: `Learn one additional Summoner guidance. Cast Guiding Resonance without spending essence prof times/long rest. You gain a +1 bonus to all saving throws.`,
				level: 2,
				actionType: "passive",
			},
			{
				name: "Aetheric Starlight Form",
				description:
					"Expend Shift use to assume a starry form. Archer: bonus action ranged strike. Chalice: enhance all restorative manifestations. Dragon: stabilize internal focus for absolute precision.",
				level: 2,
				actionType: "passive",
			},
			{
				name: "Cosmic Prophecy",
				description:
					"Reaction: adjust a creature's result with a d6 (add or subtract). You nudge the local fate-variable. Prof uses/long rest.",
				level: 6,
				actionType: "passive",
			},
			{
				name: "Universal Alignment",
				description: `Starry Form effects are doubled. At the start of each turn, you can switch between forms as the Absolute realigns. You gain a +1 bonus to all saving throws.`,
				level: 10,
				actionType: "passive",
			},
			{
				name: "Star-Forged Vessel",
				description:
					"While in starry form, resistance to all physical damage from non-aetheric sources.",
				level: 14,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Starfall Manifestation",
				description:
					"30-ft radius: 4d10 radiant, blind victims in a reality-warping discharge. Once/long rest.",
				recharge: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Sense",
			secondaryAttribute: "Intelligence",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "herald--restoration-mandate",
		name: "Path of the Restoration Mandate",
		jobId: "herald",
		jobName: "Herald",
		tier: 2,
		pathType: "restoration-mandate",
		requirements: {
			level: 1,
		},
		description:
			"The Restoration Mandate designates those who channel the Absolute's most potent restorative resonance. They do not just heal; they stabilize the local reality-variable, ensuring that the physical vessel of their allies remains anchored in its most optimal state. In the modern world, the Restoration Herald is the supreme asset of any raid, their mere presence raising the survival probability of the entire collective.",
		features: [
			{
				name: "Absolute Proficiency",
				description: "Manifest proficiency with heavy armor.",
				level: 1,
				actionType: "passive",
			},
			{
				name: "Anchor of Life",
				description:
					"When you manifest a restorative mandate, the recipient regains additional HP = 2 + spell level.",
				level: 1,
				actionType: "passive",
			},
			{
				name: "Absolute Resonance: Preserve Life",
				description:
					"Action: distribute HP = 5× Herald level among creatures within 30 ft. You stabilize their local resonance.",
				level: 2,
				actionType: "passive",
			},
			{
				name: "Blessed Anchor",
				description:
					"When you manifest restorative energy on another, your own vessel regains HP = 2 + spell level.",
				level: 6,
				actionType: "passive",
			},
			{
				name: "Aetheric Strike",
				description:
					"Once per turn, weapon strikes deal extra 1d8 radiant damage.",
				level: 8,
				actionType: "passive",
			},
			{
				name: "Supreme Manifestation",
				description:
					"When you heal, usage of the Absolute's essence is normalized to its maximum efficiency for each die.",
				level: 17,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Mass Restoration",
				description:
					"All allies within 30 ft regain 3d8+SENSE mod HP and are cured of one condition. Once/long rest.",
				recharge: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Sense",
			secondaryAttribute: "Vitality",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "herald--radiance-mandate",
		name: "Path of the Radiance Mandate",
		jobId: "herald",
		jobName: "Herald",
		tier: 2,
		pathType: "radiance-mandate",
		requirements: {
			level: 1,
		},
		description:
			"The Radiance Mandate grants an Ascendant the ability to broadcast the Absolute's most destructive light resonance. Their presence is a beacon of pure aetheric energy, incinerating the void-remnants of the Rifts and shielding their allies in a protective luminance. In the modern world, a Radiance Herald is often the vanguard of any high-rank Rift suppression, their radiant overloads visible from miles around.",
		features: [
			{
				name: "Absolute Light",
				description: `Learn one additional radiant mantra. Your movement speed increases by 5 feet.`,
				level: 1,
				actionType: "passive",
			},
			{
				name: "Warding Spark",
				description:
					"Reaction when targeted: manifest an aetheric flash to impose disadvantage. SENSE uses/long rest.",
				level: 1,
				actionType: "passive",
			},
			{
				name: "Absolute Resonance: Radiance",
				description:
					"Action: 30-ft radius — cleanse magical darkness, hostile entities take 2d10+Herald level radiant damage.",
				level: 2,
				actionType: "passive",
			},
			{
				name: "Improved Spark",
				description:
					"Warding Spark can protect allies within 30 ft, not just your own vessel.",
				level: 6,
				actionType: "passive",
			},
			{
				name: "Potent Resonance",
				description:
					"Add SENSE mod to the damage of your basic radiant mantras.",
				level: 8,
				actionType: "passive",
			},
			{
				name: "Corona of the Absolute",
				description:
					"Action: 60-ft absolute light aura. Enemies have disadvantage on saves against your fire/radiant manifestations for 1 min.",
				level: 17,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Solar Burst",
				description:
					"30-ft cone: 4d8 radiant, blind failers for 1 round. Once/short rest.",
				recharge: 1,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Sense",
			secondaryAttribute: "Presence",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "herald--combat-mandate",
		name: "Path of the Combat Mandate",
		jobId: "herald",
		jobName: "Herald",
		tier: 2,
		pathType: "combat-mandate",
		requirements: {
			level: 1,
		},
		description:
			"The Combat Mandate is given to those who serve as the physical conduit for the Absolute's offensive transmissions. Armored, lethal, and broadcasting the martial directives of the Zenith lineage, they fight at the forefront of every Rift eruption. They do not just support; they lead the charge, their weapon strikes resonating with the pure destructive intent of the Absolute.",
		features: [
			{
				name: "Absolute Proficiencies",
				description: "Proficiency with martial weapons and heavy armor.",
				level: 1,
				actionType: "passive",
			},
			{
				name: "Combat Herald",
				description:
					"When you take the Attack action, make one weapon strike as a bonus action. SENSE uses/long rest.",
				level: 1,
				actionType: "passive",
			},
			{
				name: "Absolute Resonance: Guided Strike",
				description:
					"When you strike, +10 to the roll. Declare your intent after the roll.",
				level: 2,
				actionType: "passive",
			},
			{
				name: "Absolute Resonance: Allied Blessing",
				description:
					"Reaction: ally within 30 ft strikes → +10 to their roll as you realign their path.",
				level: 6,
				actionType: "passive",
			},
			{
				name: "Absolute Strike",
				description:
					"Once per turn, weapon strikes deal extra 1d8 damage of your weapon's type.",
				level: 8,
				actionType: "passive",
			},
			{
				name: "Avatar of the Absolute",
				description:
					"Resistance to all physical damage from non-aetheric sources.",
				level: 17,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Refined Weapon",
				description:
					"Touch a weapon: it deals extra 2d8 radiant for 1 hour. Once/long rest.",
				recharge: 3,
				cost: "Bonus action",
			},
		],
		stats: {
			primaryAttribute: "Sense",
			secondaryAttribute: "Strength",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "herald--knowledge-mandate",
		name: "Path of the Knowledge Mandate",
		jobId: "herald",
		jobName: "Herald",
		tier: 2,
		pathType: "knowledge-mandate",
		requirements: {
			level: 1,
		},
		description:
			"The Knowledge Mandate provides an Ascendant with a direct uplink to the Absolute's primordial records. They do not just learn; they download encrypted knowledge that bypasses all mortal limitations, allowing them to read the aetheric signatures of enemies and objects with near-perfect accuracy. In the modern world, they are the supreme archivists and analysts, their transmissions revealing everything the Rifts seek to hide.",
		features: [
			{
				name: "Blessings of the Absolute",
				description:
					"Learn two additional languages. Double proficiency in two intelligence-based fields.",
				level: 1,
				actionType: "passive",
			},
			{
				name: "Absolute Resonance: Ancient Insight",
				description:
					"Action: gain proficiency with one tool or skill for 10 minutes as the Absolute realigns your vessel.",
				level: 2,
				actionType: "passive",
			},
			{
				name: "Absolute Resonance: Aetheric Reader",
				description:
					"Action: read the surface thoughts of a creature within 60 ft. If successful, you can also implant a minor directive.",
				level: 6,
				actionType: "passive",
			},
			{
				name: "Potent Manifestation",
				description: "Add SENSE mod to basic Herald mantra damage.",
				level: 8,
				actionType: "passive",
			},
			{
				name: "Visions of the Absolute",
				description: `Meditate to receive aetheric echoes of the past within an object or area. Your movement speed increases by 5 feet.`,
				level: 17,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Aetheric Query",
				description: `Request one specific detail from the Absolute about any creature, object, or location. Receive a truthful image or phrase. Once/long rest. You gain resistance to force damage.`,
				cost: "Action (1 min)",
				actionType: "action",
				uses: { formula: "1", recharge: "long-rest" },
				tracking: "uses",
			},
		],
		stats: {
			primaryAttribute: "Sense",
			secondaryAttribute: "Intelligence",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "herald--storm-mandate",
		name: "Path of the Storm Mandate",
		jobId: "herald",
		jobName: "Herald",
		tier: 2,
		pathType: "storm-mandate",
		requirements: {
			level: 1,
		},
		description:
			"The Storm Mandate empowers an Ascendant to broadcast the Absolute's most violent atmospheric resonance. They are walking thunderheads, their every gesture capable of summoning lightning and shattering the resolve of their foes. In the modern world, a Storm Herald is the ultimate deterrent, their radiant and electrical overloads enough to power entire city blocks or level them with equal ease.",
		features: [
			{
				name: "Absolute Proficiencies",
				description: "Proficiency with martial weapons and heavy armor.",
				level: 1,
				actionType: "passive",
			},
			{
				name: "Wrath of the Absolute",
				description:
					"Reaction when targeted in melee: manifest a lightning discharge for 2d8 damage. SENSE uses/long rest.",
				level: 1,
				actionType: "passive",
			},
			{
				name: "Absolute Resonance: Destructive Wrath",
				description: `When you manifest lightning or thunder, normalize the effect to its absolute maximum intensity. Your movement speed increases by 5 feet.`,
				level: 2,
				actionType: "passive",
			},
			{
				name: "Thunderbolt Strike",
				description:
					"When you deal lightning damage, you can physically push the recipient up to 10 ft.",
				level: 6,
				actionType: "passive",
			},
			{
				name: "Absolute Strike (Storm)",
				description:
					"Once per turn, weapon strikes deal extra 1d8 thunder damage.",
				level: 8,
				actionType: "passive",
			},
			{
				name: "Stormborn",
				description:
					"When outdoors, gain a flying speed equal to your walking speed as the Absolute lifts your vessel.",
				level: 17,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Call Lightning Manifestation",
				description:
					"30-ft radius: 3d10 lightning. Maximize with Absolute Resonance. Once/short rest.",
				recharge: 1,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Sense",
			secondaryAttribute: "Strength",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "herald--triage-mandate",
		name: "Path of the Triage Mandate",
		jobId: "herald",
		jobName: "Herald",
		tier: 2,
		pathType: "triage-mandate",
		requirements: {
			level: 1,
		},
		description:
			"The Triage Mandate is for those who specialize in the Absolute's emergency field calibrations. They operate on a unique restorative resonance that maximizes output on critical vessels, marking targets for absolute elimination while canceling lethal blows through aetheric realignment. In the modern world, a Triage Herald's presence is the difference between a total wipe and an absolute victory.",
		features: [
			{
				name: "Absolute Triage",
				description: `When you manifest restorative energy on a creature at 0 HP, the Absolute normalize output to its maximum intensity. You gain proficiency in one skill or tool of your choice.`,
				level: 1,
				actionType: "passive",
			},
			{
				name: "Aetheric Scanner",
				description:
					"Identify void-entities and critically damaged vessels within 60 ft. SENSE uses/long rest.",
				level: 1,
				actionType: "passive",
			},
			{
				name: "Absolute Resonance: Essential Target",
				description:
					"Action: mark a creature for absolute elimination. The next attack against it deals double damage.",
				level: 2,
				actionType: "passive",
			},
			{
				name: "Realignment Intervention",
				description:
					"Reaction: when an ally suffers an absolute strike (crit), the Absolute intervenes — downgrade it to a normal strike. SENSE uses/long rest.",
				level: 6,
				actionType: "passive",
			},
			{
				name: "Enhanced Transmissions",
				description: "Add SENSE mod to the damage of basic Herald mantras.",
				level: 8,
				actionType: "passive",
			},
			{
				name: "Aetheric Recycling",
				description: `When an enemy falls, the Absolute recycles its residual resonance. You or an ally regain HP. Once per round. Your spell attacks score a critical hit on a roll of 19 or 20.`,
				level: 17,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Absolute Safeguard",
				description:
					"Touch: for 8 hours, the first time the recipient falls, the Absolute catches them at 1 HP instead. Once/long rest.",
				cost: "Action",
				actionType: "action",
				uses: { formula: "1", recharge: "long-rest" },
				tracking: "uses",
			},
		],
		stats: {
			primaryAttribute: "Sense",
			secondaryAttribute: "Vitality",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "contractor--glamour-weaver",
		name: "Path of the Glamour Weaver",
		jobId: "contractor",
		jobName: "Contractor",
		tier: 2,
		pathType: "glamour-weaver",
		requirements: {
			level: 1,
		},
		description:
			"The Glamour Weaver bargain is forged with the ethereal reflections that rule the Absolute's most vibrant Rift ecosystems. They do not just deceive; they rewrite the sensory reality of those around them, weaving illusions of absolute beauty or terrifying despair. In the modern world, the Glamour Weaver is a master of social and physical manipulation, their presence alone enough to ensnare the unwary.",
		features: [
			{
				name: "Absolute Presence",
				description:
					"Action: creatures in a 10-ft cube must save or become charmed or frightened. Once/short rest.",
				level: 1,
				actionType: "passive",
			},
			{
				name: "Aetheric Escape",
				description:
					"Reaction when targeted: become invisible and teleport 60 ft as you dissolve into a mist of pure aether. Once/short rest.",
				level: 6,
				actionType: "passive",
			},
			{
				name: "Beguiling Resonance",
				description:
					"Absolute immunity to charm. When a creature attempts to influence you, you can redirect the resonance back upon them.",
				level: 10,
				actionType: "passive",
			},
			{
				name: "Phantasmal Delirium",
				description:
					"As an action, choose a creature you can see within 60 feet. It must make a SENSE saving throw against your Job save DC. On a failure, it is charmed or frightened by you (your choice) for 1 minute, until your concentration breaks (as if concentrating on a spell), or until it takes any damage. Until the effect ends, it believes it is lost in a misty realm of your design and can see and hear only itself, you, and the illusion. Once per short rest. You learn one Contractor cantrip of your choice.",
				level: 14,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Absolute Glow",
				description:
					"Manifest a 20-ft cube of aetheric light: reveal all hidden entities and grant advantage on strikes against them.",
				recharge: 1,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Presence",
			secondaryAttribute: "Agility",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "contractor--infernal-conduit",
		name: "Path of the Infernal Conduit",
		jobId: "contractor",
		jobName: "Contractor",
		tier: 2,
		pathType: "infernal-conduit",
		requirements: {
			level: 1,
		},
		description:
			"The Infernal Conduit bargain is forged with the destructive entities that dwell within the deepest entropic layers of the Rifts. Their physical vessel burns with a literal internal heat, every kill feeding the insatiable hunger of their patron. In the modern world, the Infernal is a walking force of destruction, their aetheric bargain granting them the power to hurl foes through the void itself.",
		features: [
			{
				name: "Aetheric Siphon",
				description:
					"When you reduce a hostile creature to 0 hit points, you gain temporary hit points equal to your PRE modifier + your Contractor level (minimum 1). You gain resistance to force damage.",
				level: 1,
				actionType: "passive",
			},
			{
				name: "Absolute Luck",
				description:
					"Realign your local fate-variable: add 1d10 to an ability check or save. Once/short rest.",
				level: 6,
				actionType: "passive",
			},
			{
				name: "Infernal Resilience",
				description:
					"Adapt your vessel to resist one specific damage type after each rest.",
				level: 10,
				actionType: "passive",
			},
			{
				name: "Hurl Through the Void",
				description:
					"When you hit a creature with an attack, you can banish it through a temporary entropic rift. It vanishes, with no saving throw, and hurtles through a nightmare landscape. At the end of your next turn, it returns to the space it left, or the nearest unoccupied space if that one is filled, and takes 10d10 psychic damage. Once per long rest.",
				level: 14,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Entropic Blast",
				description:
					"When you hit a creature with a spell attack, you can channel void-fire through the wound: the target takes an extra 2d8 fire damage and ignites. While it burns, it takes 1d8 fire damage at the start of each of its turns. The flames go out after 1 minute, or sooner if the target or a creature within 5 feet of it uses an action to douse them. Once per short rest.",
				recharge: 1,
				cost: "Free",
			},
		],
		stats: {
			primaryAttribute: "Presence",
			secondaryAttribute: "Vitality",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "contractor--void-whisperer",
		name: "Path of the Void Whisperer",
		jobId: "contractor",
		jobName: "Contractor",
		tier: 2,
		pathType: "void-whisperer",
		requirements: {
			level: 1,
		},
		description:
			"The Void Whisperer bargain is forged with the vast, ancient intelligences that drift beyond the Absolute's primary resonance-layers. They do not just see the Rifts; they perceive the alien geometry of the multiverse, granting them psionic capabilities that shatter the fragile minds of their enemies. In the modern world, the Void Whisperer is a master of mental dominance and informational warfare.",
		features: [
			{
				name: "Absolute Resonance",
				description:
					"Telepathically communicate with any creature within 30 ft. No shared interface required.",
				level: 1,
				actionType: "passive",
			},
			{
				name: "Entropic Ward",
				description:
					"Reaction when targeted: impose disadvantage via a mental feedback loop. If they miss, your next strike gains advantage.",
				level: 6,
				actionType: "passive",
			},
			{
				name: "Aetheric Shield",
				description:
					"Your thoughts can't be read unless you allow it, and you have resistance to psychic damage. Whenever a creature deals psychic damage to you, that creature takes the same amount of psychic damage that you take.",
				level: 10,
				actionType: "passive",
			},
			{
				name: "Absolute Thrall",
				description:
					"As an action, touch an incapacitated humanoid. It is charmed by you, with no saving throw, until an effect that ends curses or charms is used on it or until you use this feature again; you can have only one thrall at a time. You can communicate telepathically with your thrall at any distance while you're both on the same plane of existence.",
				level: 14,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Void Scream",
				description:
					"Choose a creature you can see within 60 feet. It must make an INT saving throw against your Job save DC. On a failure, it takes 3d10 psychic damage and is stunned until the end of your next turn. On a success, it takes half as much damage and isn't stunned. Once per short rest.",
				cost: "Action",
				actionType: "action",
				uses: { formula: "1", recharge: "short-rest" },
				tracking: "uses",
			},
		],
		stats: {
			primaryAttribute: "Presence",
			secondaryAttribute: "Intelligence",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "contractor--radiant-vessel",
		name: "Path of the Radiant Vessel",
		jobId: "contractor",
		jobName: "Contractor",
		tier: 2,
		pathType: "radiant-vessel",
		requirements: {
			level: 1,
		},
		description:
			"The Radiant Vessel bargain is forged with the luminous entities of the Zenith lineage — beings of pure restorative and destructive light. They are the rarest of all Contractors, their physical vessel a conduit for aetheric energy that heals and incinerates with equal intensity. In the modern world, they are often seen as modern saints or supreme gate-raid anchors.",
		features: [
			{
				name: "Absolute Light",
				description:
					"You learn the Oath Flare and Corona Storm cantrips. They count as Contractor spells for you and don't count against the number of cantrips you know. You gain a +1 bonus to all saving throws.",
				grants: { spells: [{ name: "Oath Flare" }, { name: "Corona Storm" }] },
				level: 1,
				actionType: "passive",
			},
			{
				name: "Aetheric Radiance",
				description:
					"You have a pool of radiance dice, which are d6s; the pool holds a number of dice equal to 1 + your Contractor level. As a bonus action, you can heal one creature you can see within 60 feet of you by spending dice from the pool, up to a number equal to your PRE modifier (minimum 1). Roll the spent dice; the creature regains hit points equal to the total. You regain all spent dice when you finish a long rest.",
				level: 1,
				actionType: "passive",
			},
			{
				name: "Radiant Essence",
				description:
					"You have resistance to radiant damage. When you cast a spell that deals radiant or fire damage, you can add your PRE modifier to one radiant or fire damage roll of that spell against one of its targets.",
				level: 6,
				actionType: "passive",
			},
			{
				name: "Absolute Resilience",
				description:
					"Whenever you finish a short or long rest, you gain temporary hit points equal to your Contractor level + your PRE modifier, and up to five creatures of your choice that you can see gain temporary hit points equal to half your Contractor level (rounded down) + your PRE modifier. You gain a +1 bonus to all saving throws.",
				level: 10,
				actionType: "passive",
			},
			{
				name: "Searing Rebirth",
				description:
					"When you have to make a death saving throw at the start of your turn, you can instead spring back up in a burst of radiant energy. You regain hit points equal to half your hit point maximum and can stand up. Each creature of your choice within 30 feet of you takes radiant damage equal to 2d8 + your PRE modifier and is blinded until the end of the current turn. Once per long rest. You gain proficiency in one skill or tool of your choice.",
				level: 14,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Radiant Discharge",
				description:
					"Each hostile creature of your choice within 30 feet of you must make an AGI saving throw against your Job save DC, taking 3d8 radiant damage on a failure or half as much on a success. Each ally within 30 feet of you regains hit points equal to 1d8 + your PRE modifier. Once per long rest.",
				recharge: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Presence",
			secondaryAttribute: "Sense",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "contractor--cursed-blade",
		name: "Path of the Cursed Blade",
		jobId: "contractor",
		jobName: "Contractor",
		tier: 2,
		pathType: "cursed-blade",
		requirements: {
			level: 1,
		},
		description:
			"The Cursed Blade bargain is forged with the sentient, shadow-forged armaments found deep within the Absolute's highest-rank Rifts. They do not just wield a weapon; they are bonded to a physical manifestation of their patron's hunger. In the modern world, the Cursed Blade is a lethal martial specialist, their every strike fueled by an ancient aetheric curse that consumes the resonance of their victims.",
		features: [
			{
				name: "Absolute Curse",
				description:
					"As a bonus action, curse a creature you can see within 30 feet of you for 1 minute. The curse ends early if the target dies, you die, or you're incapacitated. Until it ends, you add your proficiency bonus to damage rolls you make against the cursed target, your attack rolls against it score a critical hit on a roll of 19 or 20, and if it drops to 0 hit points you regain hit points equal to your Contractor level + your PRE modifier (minimum 1). Once per short rest.",
				level: 1,
				actionType: "passive",
			},
			{
				name: "Aetheric Duelist",
				description:
					"You gain proficiency with medium armor, shields, and martial weapons. Whenever you finish a long rest, you can touch one weapon you're proficient with that lacks the two-handed property: until your next long rest, you use your PRE modifier instead of STR or AGI for its attack and damage rolls.",
				level: 1,
				actionType: "passive",
			},
			{
				name: "Aetheric Remnant",
				description:
					"When you slay a humanoid, you can raise its residual resonance as a Spectral Sentinel in an unoccupied space within 10 feet of the body. It obeys your commands and acts immediately after you on your initiative; it takes the Dodge action unless you use a bonus action to command it. It lasts until the end of your next long rest, until it drops to 0 hit points, until you dismiss it (no action), or until you raise another. Once per long rest. Spectral Sentinel (Medium): AC 12; 22 hit points, plus temporary hit points equal to half your Contractor level (rounded down) when it rises; speed 0 ft, fly 50 ft (hover). It can move through creatures and objects as if they were difficult terrain, taking 1d10 force damage if it ends its turn inside an object. It has resistance to acid, cold, fire, lightning, and thunder damage and to bludgeoning, piercing, and slashing damage from nonmagical attacks; immunity to necrotic and poison damage and to the charmed, frightened, grappled, paralyzed, petrified, poisoned, prone, and restrained conditions; and darkvision out to 60 feet. Life Drain (action): melee spell attack against a creature within 5 feet, using your spell attack bonus; on a hit, the target takes 3d6 necrotic damage and its hit point maximum drops by the same amount until it finishes a long rest. You also learn one Contractor cantrip of your choice.",
				level: 6,
				actionType: "passive",
			},
			{
				name: "Absolute Deflection",
				description:
					"When the target of your Absolute Curse hits you with an attack roll, you can use your reaction to roll a d6. On a 4 or higher, the attack misses you, regardless of its roll. You have advantage on initiative rolls.",
				level: 10,
				actionType: "passive",
			},
			{
				name: "Cycle of the Curse",
				description:
					"When the target of your Absolute Curse dies, you can apply the curse to a different creature you can see within 30 feet of you, as long as you aren't incapacitated. When you do, you don't regain hit points from the first creature's death. Your movement speed increases by 5 feet.",
				level: 14,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Shadow Manifest",
				description:
					"As a bonus action, expend a pact slot to conjure a blade of void-essence in your free hand. It lasts for 1 minute, until you let go of it, or until you conjure another. You're proficient with it; it's a melee weapon with the finesse and light properties, and it deals 1d8 psychic damage plus 1d8 for each level of the slot above 1st. You can use your PRE modifier for its attack and damage rolls. While you're in dim light or darkness, you have advantage on attack rolls with it.",
				recharge: 0,
				cost: "Aetheric slot",
			},
		],
		stats: {
			primaryAttribute: "Presence",
			secondaryAttribute: "Strength",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "contractor--deep-dweller",
		name: "Path of the Deep Dweller",
		jobId: "contractor",
		jobName: "Contractor",
		tier: 2,
		pathType: "deep-dweller",
		requirements: {
			level: 1,
		},
		description:
			"The Deep Dweller bargain is forged with the colossal, kraken-like entities that rule the Absolute's submerged Rift dimensions. They are masters of the crushing pressure and freezing cold found at the boundaries of the aetheric abyss, manifesting spectral tentacles and dimensional rifts at will. In the modern world, they are the undisputed masters of coastal and underwater Rift containment.",
		features: [
			{
				name: "Tentacle of the Absolute",
				description:
					"As a bonus action, you summon a spectral tentacle in an unoccupied space you can see within 60 feet. It lasts for 1 minute or until you summon another. When it appears, you can make a melee spell attack against one creature within 10 feet of it. On a hit, the target takes 1d8 cold damage (2d8 from 10th level) and its speed drops by 10 feet until the start of your next turn. On each of your later turns while the tentacle lasts, you can use a bonus action to move it up to 30 feet and repeat the attack. You can summon the tentacle a number of times equal to your proficiency bonus, regaining all uses when you finish a long rest.",
				level: 1,
				actionType: "passive",
			},
			{
				name: "Deep Adaptation",
				description:
					"Manifest a 40-ft swim speed and absolute breath stability.",
				level: 1,
				actionType: "passive",
			},
			{
				name: "Aetheric Soul (Deep)",
				description: "Resistance to cold and absolute clarity underwater.",
				level: 6,
				actionType: "passive",
			},
			{
				name: "Absolute Coil",
				description:
					"When you or a creature you can see takes damage while within 10 feet of your tentacle, you can use your reaction to reduce that damage by 1d8 (2d8 from 10th level).",
				level: 6,
				actionType: "passive",
			},
			{
				name: "Void Tentacles",
				description:
					"As an action, fill a 20-foot square of ground you can see within 90 feet with writhing aetheric tentacles for up to 1 minute (concentration). The area is difficult terrain. A creature that enters the area for the first time on a turn, or starts its turn there, must succeed on an AGI saving throw against your Job save DC or take 3d6 bludgeoning damage and be restrained until the effect ends. A creature that starts its turn restrained there takes 3d6 bludgeoning damage. A restrained creature can use its action to make a STR or AGI check against your Job save DC, freeing itself on a success. When you create the field, you gain temporary hit points equal to your Contractor level, and taking damage can't break your concentration on it. Once per long rest. You have advantage on initiative rolls.",
				level: 10,
				actionType: "passive",
			},
			{
				name: "Abyssal Plunge",
				description:
					"As an action, you and up to five willing creatures you can see within 30 feet of you vanish into a whirl of tentacles and reappear up to 1 mile away, in or within 30 feet of a body of water at least the size of a pond that you have seen. Each of you appears in an unoccupied space within 30 feet of the others. Once per short rest.",
				level: 14,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Crushing Resonance",
				description:
					"Each creature of your choice within 60 feet of you must make a STR saving throw against your Job save DC. On a failure, a creature takes 3d8 cold damage and is restrained until the end of your next turn. On a success, it takes half as much damage and isn't restrained. Once per long rest.",
				recharge: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Presence",
			secondaryAttribute: "Vitality",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "stalker--apex-hunter",
		name: "Path of the Apex Ascendant",
		jobId: "stalker",
		jobName: "Stalker",
		tier: 2,
		pathType: "apex-hunter",
		requirements: {
			level: 3,
		},
		description:
			"The Apex Ascendant mandate is held by those who have mastered the art of exploiting the physical vulnerabilities of the Absolute's most dangerous entities. They do not just hunt; they analyze the aetheric structure of their prey, adapting their strikes to counteract specific threat profiles. In the modern world, the Apex Ascendant is the supreme field operative, capable of neutralizing entities that ignore conventional force.",
		features: [
			{
				name: "Ascendant's Resonance",
				description:
					"Choose one specialty: Giant Slayer (extra damage vs large entities), Horde Breaker (additional strikes vs multiple targets), or Absolute Will (advantage against mental intrusion).",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Evasive Resilience",
				description:
					"Choose a defensive adaptation: Multi-target Defense (+4 AC after being hit) or Aetheric Escape (disadvantage on strikes against you).",
				level: 7,
				actionType: "passive",
			},
			{
				name: "Absolute Multi-strike",
				description:
					"Choose an offensive manifestation: Volley (ranged aether-burst) or Whirlwind (melee aether-burst).",
				level: 11,
				actionType: "passive",
			},
			{
				name: "Apex Defense",
				description:
					"Choose a supreme adaptation: Evasion (negate aetheric saves), Redirect (return missed strikes), or Uncanny Reflexes (halve incoming force).",
				level: 15,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Prey Manifest",
				description:
					"Mark an entity for absolute elimination: gain advantage on all strikes and detection for 1 hour. Once/short rest.",
				recharge: 1,
				cost: "Bonus action",
			},
		],
		stats: {
			primaryAttribute: "Agility",
			secondaryAttribute: "Sense",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "stalker--pack-leader",
		name: "Path of the Pack Leader",
		jobId: "stalker",
		jobName: "Stalker",
		tier: 2,
		pathType: "pack-leader",
		requirements: {
			level: 3,
		},
		description:
			"The Pack Leader mandate is for those who forge deep aetheric bonds with the Absolute's apex predators. They do not just hunt alongside their companion; they fuse their hunting instincts into a single, coordinated absolute strikes that dominate the battlefield. In the modern world, the Pack Leader is a one-person tactical unit, their bonded entity often as famous and lethal as the Stalker themselves.",
		features: [
			{
				name: "Absolute Companion",
				description: `Bond with a high-resonance entity (Predator of the Land, Sea, or Sky). It shares your initiative and acts as an extension of your own will. You gain proficiency in one skill or tool of your choice.`,
				level: 3,
				actionType: "passive",
			},
			{
				name: "Advanced Resonance",
				description: `Your companion's natural strikes count as aetheric. It can Dash, Disengage, or Support as part of your offensive manifestations. You gain proficiency in one skill or tool of your choice.`,
				level: 7,
				actionType: "passive",
			},
			{
				name: "Primal Fury",
				description: `When you command your companion to strike, it unleashes two absolute attacks. You can reroll a failed ability check once per short or long rest.`,
				level: 11,
				actionType: "passive",
			},
			{
				name: "Shared Resonance",
				description: `When you manifest a personal adaptation, your companion also benefits from the Absolute's blessing. You can reroll a failed ability check once per short or long rest.`,
				level: 15,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Coordinated Strike",
				description:
					"You and your companion both strike the same target with absolute precision. If both hit, the target is stunned. Once/short rest.",
				recharge: 1,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Agility",
			secondaryAttribute: "Sense",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "stalker--umbral-hunter",
		name: "Path of the Umbral Ascendant",
		jobId: "stalker",
		jobName: "Stalker",
		tier: 2,
		pathType: "umbral-hunter",
		requirements: {
			level: 3,
		},
		description:
			"The Umbral Ascendant mandate is for those who have mastered the zero-light resonance of the highest-rank Rifts. They do not just hide in shadow; they become one with the void, manifesting as an invisible predator that strikes with absolute lethality from the darkness. In the modern world, the Umbral Ascendant is the supreme assassin of the Stalker lineage, their very existence a ghost story in the halls of the Absolute.",
		features: [
			{
				name: "Absolute Ambush",
				description:
					"First round: +SENSE to initiative, walking speed +10 ft, and one additional strike for extra damage.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Umbral Sight",
				description:
					"Mastery of darkness. While in shadow, you are invisible to all creatures that rely on aetheric or physical sight.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Void-Minded",
				description:
					"Proficiency in SENSE saves. Your vessel is hardened against mental instability.",
				level: 7,
				actionType: "passive",
			},
			{
				name: "Ascendant's Flurry",
				description: `If your strike misses, the Absolute realigns your path for an immediate follow-up strike. You gain proficiency in one skill or tool of your choice.`,
				level: 11,
				actionType: "passive",
			},
			{
				name: "Umbral Reflex",
				description:
					"Reaction when targeted: impose disadvantage via a momentary lapse into the void.",
				level: 15,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Shadow Strike",
				description:
					"Become invisible for 1 round. Your next strike deals extra 2d8 damage and terrifies the recipient. Once/short rest.",
				recharge: 1,
				cost: "Bonus action",
			},
		],
		stats: {
			primaryAttribute: "Agility",
			secondaryAttribute: "Sense",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "stalker--rift-strider",
		name: "Path of the Rift Strider",
		jobId: "stalker",
		jobName: "Stalker",
		tier: 2,
		pathType: "rift-strider",
		requirements: {
			level: 3,
		},
		description:
			"The Rift Strider mandate empowers a Stalker to navigate the precarious boundaries between Rift dimensions. They do not just track prey; they step through micro-rifts in reality, manifesting across the battlefield with a frightening fluidity. In the modern world, the Rift Strider is the supreme interceptor, their ability to seal dimensional crossings and strike through space making them an indispensable asset.",
		features: [
			{
				name: "Detect Rift",
				description:
					"Sense the distance and direction to the closest aetheric rift within 1 mile.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Aetheric Striker",
				description:
					"Bonus action: your strikes deal extra force damage as you channel the Absolute's primal energy.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Ethereal Step",
				description:
					"Bonus action: step into the aetheric reflection for 1 round. Move through objects and entities. Once/short rest.",
				level: 7,
				actionType: "passive",
			},
			{
				name: "Distant Strike",
				description:
					"When you strike, teleport 10 ft before each manifestation. If you strike multiple foes, gain one additional strike.",
				level: 11,
				actionType: "passive",
			},
			{
				name: "Absolute Defense (Rift)",
				description:
					"Reaction when targeted: gain resistance to the incoming force as you partially transition between planes.",
				level: 15,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Planar Collapse",
				description:
					"Open a 20-ft radius collapse: entities are banished to another plane and take 4d10 force damage. Once/long rest.",
				recharge: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Agility",
			secondaryAttribute: "Sense",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "stalker--apex-slayer",
		name: "Path of the Apex Slayer",
		jobId: "stalker",
		jobName: "Stalker",
		tier: 2,
		pathType: "apex-slayer",
		requirements: {
			level: 3,
		},
		description:
			"The Apex Slayer mandate is given to those who obsessively study the absolute weaknesses of their prey. They do not just hunt; they deconstruct, learning to counter every aetheric ability and exploit every biological flaw of high-rank Rift entities. In the modern world, the Apex Slayer is the ultimate boss-killer, their analytical focus turning a nightmare encounter into a systematic elimination.",
		features: [
			{
				name: "Absolute Sense",
				description: `Action: learn an entity's resistances, vulnerabilities, and immunities. SENSE uses/long rest. Your movement speed increases by 5 feet.`,
				level: 3,
				actionType: "passive",
			},
			{
				name: "Slayer's Focus",
				description:
					"Bonus action: designate a target. Your first strike each turn deals additional damage until it falls.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Supernatural Adaptation",
				description:
					"When your target forces a save, add 1d6 to your result via aetheric prediction.",
				level: 7,
				actionType: "passive",
			},
			{
				name: "Entity's Nemesis",
				description:
					"Reaction when an entity manifests power or teleports: SENSE save or the effect is negated. Once/short rest.",
				level: 11,
				actionType: "passive",
			},
			{
				name: "Slayer's Counter",
				description:
					"Reaction when your target forces a save: make an immediate strike. If successful, you auto-succeed on the save.",
				level: 15,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Exploit Vulnerability",
				description:
					"After sensing a target, your strikes ignore all resistances and treat immunities as resistance for 1 min. Once/long rest.",
				cost: "Free",
				actionType: "bonus action",
				uses: { formula: "1", recharge: "long-rest" },
				tracking: "uses",
			},
		],
		stats: {
			primaryAttribute: "Agility",
			secondaryAttribute: "Sense",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "stalker--hive-synchronist",
		name: "Path of the Hive Synchronist",
		jobId: "stalker",
		jobName: "Stalker",
		tier: 2,
		pathType: "hive-synchronist",
		requirements: {
			level: 3,
		},
		description:
			"The Hive Synchronist mandate designates those who have bonded with a living swarm of gate-microorganisms. They do not just carry a hive; they are a walking ecosystem, their swarm enhancing every offensive manifestation and providing absolute mobility via aethertic levitation. In the modern world, the Synchronist is a terrifyingly efficient field operative, their presence denoted by a permanent cloud of aetheric static.",
		features: [
			{
				name: "Gathered Hive",
				description:
					"Once per turn on a strike: your hive deals extra damage, pushes the target, or realigns your own position.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Hive Manifestations",
				description: `Learn bonus absolute mandates: Aetheric Glow, Web, Gaseous Form, Aetheric Eye, and Hive Plague. Your movement speed increases by 5 feet.`,
				level: 3,
				actionType: "passive",
			},
			{
				name: "Writhing Tide",
				description:
					"Bonus action: the hive lifts you, granting an aetheric fly speed (hover) for 1 min.",
				level: 7,
				actionType: "passive",
			},
			{
				name: "Apex Hive",
				description:
					"Your gathered hive damage is normalized to its maximum efficiency. Pushed targets are knocked prone.",
				level: 11,
				actionType: "passive",
			},
			{
				name: "Hive Dispersal",
				description:
					"Reaction when targeted: dissolve into the hive, granting resistance and teleporting to a safe reflection. Once/long rest.",
				level: 15,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Hive Eruption",
				description:
					"Release the hive: all nearby entities take piercing damage and are blinded by absolute static. Once/short rest.",
				recharge: 1,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Agility",
			secondaryAttribute: "Sense",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "holy-knight--absolute-devotion",
		name: "Path of the Absolute Devotion",
		jobId: "holy-knight",
		jobName: "Holy Knight",
		tier: 2,
		pathType: "absolute-devotion",
		requirements: {
			level: 3,
		},
		description:
			"The Absolute Devotion mandate designates those who are the physical paragons of the Absolute's primary resonance. They do not just follow a code; they become a walking anchor for the restorative and protective frequencies of the Zenith lineage, their presence alone stabilizing the local reality of their allies. In the modern world, the Devotion Knight is the ultimate frontline leader, their absolute faith manifesting as physical aetheric armaments.",
		features: [
			{
				name: "Absolute Resonance: Sacred Armament",
				description:
					"Bonus action: manifest your weapon as an extension of the Absolute for 1 min. Add your presence toward its strikes.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Absolute Resonance: Purge Entropic",
				description:
					"Action: entities of the void and entropic remnants must save or be banished from your presence for 1 min.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Aura of Devotion",
				description:
					"You and allies within 10 ft are anchored against mental intrusion while your vessel is active.",
				level: 7,
				actionType: "passive",
			},
			{
				name: "Purity of the Absolute",
				description: `Your vessel is permanently anchored against all harmful planar influences. You gain proficiency in one skill or tool of your choice.`,
				level: 15,
				actionType: "passive",
			},
			{
				name: "Absolute Nimbus",
				description:
					"Action: manifest a 30-ft aura of absolute light for 1 min. Enemies take 10 radiant damage at the start of their turn. Once/long rest.",
				level: 20,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Absolute Smite",
				description:
					"Channel absolute energy into a strike: deal 3d8 extra radiant and blind the recipient. Once/short rest.",
				recharge: 1,
				cost: "Bonus action",
			},
		],
		stats: {
			primaryAttribute: "Strength",
			secondaryAttribute: "Presence",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "holy-knight--retribution-mandate",
		name: "Path of the Retribution Mandate",
		jobId: "holy-knight",
		jobName: "Holy Knight",
		tier: 2,
		pathType: "retribution-mandate",
		requirements: {
			level: 3,
		},
		description:
			"The Retribution Mandate is held by those who have sacrificed their defensive stability for the absolute destruction of their foes. They do not just strike; they exact a toll for every transgression against the Absolute, pursuing their targets with a relentless aetheric fury that cannot be outrun. In the modern world, the Retribution Knight is a lethal specialist, their covenant burning with the righteous hunger for absolute realignment.",
		features: [
			{
				name: "Absolute Resonance: Banish Foe",
				description:
					"Action: one entity within 60 ft must save or be terrified and rooted to its current reflection for 1 min.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Absolute Resonance: Directive of Enmity",
				description:
					"Bonus action: gain absolute focus (advantage) on strikes against one entity within 10 ft for 1 min.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Relentless Avenger",
				description:
					"When you land an opportunistic strike, immediately realign your position by moving up to half your speed.",
				level: 7,
				actionType: "passive",
			},
			{
				name: "Soul of Retribution",
				description: `When your focused target strikes, react with an immediate absolute counter-manifestation. You gain a +1 bonus to all saving throws.`,
				level: 15,
				actionType: "passive",
			},
			{
				name: "Avenging Absolute",
				description:
					"Action: transform into a winged manifestation of the Absolute for 1 hour. Gain a 60-ft fly speed and an aura of absolute menace.",
				level: 20,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Relentless Pursuit",
				description:
					"Designate a target: for 1 min, your movement and offensive output cannot be hindered as you move toward them. Once/long rest.",
				cost: "Bonus action",
				actionType: "bonus action",
				uses: { formula: "1", recharge: "long-rest" },
				tracking: "uses",
			},
		],
		stats: {
			primaryAttribute: "Strength",
			secondaryAttribute: "Presence",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "holy-knight--verdant-mandate",
		name: "Path of the Verdant Mandate",
		jobId: "holy-knight",
		jobName: "Holy Knight",
		tier: 2,
		pathType: "verdant-mandate",
		requirements: {
			level: 3,
		},
		description:
			"Those who walk the Path of the Verdant Mandate swear to protect the Absolute's original intent against the encroaching resonance corruption of the Rifts. Their covenant is a primal pact with the world's original life-resonance, anchoring themselves to threatened Rift biomes to serve as the ultimate custodians of aetheric diversity. In the modern world, they are the bulwark against total ecological collapse, their presence stabilizing the very fabric of reality.",
		features: [
			{
				name: "Absolute Resonance: Verdant Snare",
				description:
					"Action: spectral vines restrain a creature within 10 ft (STR or AGI save to escape, check each turn).",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Absolute Resonance: Turn the Entropic",
				description:
					"Action: entropic entities (fey/anomaly) within 30 ft make SENSE save or are turned for 1 min.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Aura of the Weave Warding",
				description:
					"You and allies within 10 ft have resistance to offensive resonance damage. 30 ft at 18th.",
				level: 7,
				actionType: "passive",
			},
			{
				name: "Absolute Sentinel",
				description:
					"When reduced to 0 HP and not killed outright, drop to 1 HP instead. Once per long rest. Also, you suffer no drawbacks of old age and can't be aged magically as the mandate preserves your vessel.",
				level: 15,
				actionType: "passive",
			},
			{
				name: "Ancient Mandate Champion",
				description:
					"Action: transform for 1 min — regain 10 HP at start of each turn, cast Holy Knight mantras as bonus action, enemies within 10 ft have disadvantage on saves vs your mantras and Resonance. Once/long rest.",
				level: 20,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Verdant Bulwark",
				description:
					"All allies within 30 ft gain resistance to all resonance damage and advantage on saves vs mantras for 1 min. Once/long rest.",
				recharge: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Strength",
			secondaryAttribute: "Presence",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "holy-knight--dominance-mandate",
		name: "Path of the Dominance Mandate",
		jobId: "holy-knight",
		jobName: "Holy Knight",
		tier: 2,
		pathType: "dominance-mandate",
		requirements: {
			level: 3,
		},
		description:
			"The Dominance Mandate designates those who wield the Absolute's authority with uncompromising force. They do not just lead; they dominate, their aetheric presence frozen with a chill authority that renders enemies immobile. In the modern world, the Dominance Knight is the supreme arbiter of the Absolute's order, their very will enough to shatter the resolve of those who oppose them.",
		features: [
			{
				name: "Absolute Resonance: Crushing Mandate",
				description:
					"As an action, each creature of your choice within 30 feet of you that can see or hear you must succeed on a SENSE saving throw against your Job save DC or be frightened of you for 1 minute. A frightened creature repeats the saving throw at the end of each of its turns, ending the effect on itself on a success. Once per short rest.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Absolute Resonance: Guided Strike",
				description:
					"When you make an attack roll, you can gain a +10 bonus to it. You decide after you see the roll, but before you know whether it hits. Once per short rest. Your movement speed increases by 5 feet.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Aura of Dominance",
				description:
					"While you're conscious, a creature that is frightened of you and within 10 feet of you has a speed of 0, and when it starts its turn there it takes psychic damage equal to half your Holy Knight level (rounded down).",
				level: 7,
				actionType: "passive",
			},
			{
				name: "Scornful Backlash",
				description:
					"When a creature hits you with an attack, it takes psychic damage equal to your PRE modifier (minimum 1) if you aren't incapacitated. You gain proficiency in one skill or tool of your choice.",
				level: 15,
				actionType: "passive",
			},
			{
				name: "Absolute Archon",
				description:
					"As an action, you become a vessel of absolute authority for 1 minute. While transformed, you have resistance to all damage, you can make one additional attack when you take the Attack action on your turn, and your weapon attacks score a critical hit on a roll of 19 or 20. Once per long rest.",
				level: 20,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Absolute Presence",
				description:
					"Each hostile creature within 30 feet of you must succeed on a STR saving throw against your Job save DC or be knocked prone, and its speed is 0 until the end of your next turn. Once per long rest.",
				recharge: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Strength",
			secondaryAttribute: "Presence",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "holy-knight--atonement-mandate",
		name: "Path of the Atonement Mandate",
		jobId: "holy-knight",
		jobName: "Holy Knight",
		tier: 2,
		pathType: "atonement-mandate",
		requirements: {
			level: 3,
		},
		description:
			"The Atonement Mandate is held by those who prioritize the absolute preservation of life. They do not just defend; they absorb the suffering of their allies, manifesting as a living shield for the Absolute's most fragile resonance-layers. In the modern world, the Atonement Knight is the supreme guardian of peace, their covenant punishing those who choose violence with a radiant backlash.",
		features: [
			{
				name: "Absolute Resonance: Peacekeeper",
				description:
					"As a bonus action, you gain a +5 bonus to PRE (Persuasion) checks for 10 minutes. Once per short rest.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Absolute Resonance: Radiant Backlash",
				description:
					"When a creature within 30 feet of you deals damage with an attack to a creature other than you, you can use your reaction to force the attacker to make a SENSE saving throw against your Job save DC. It takes radiant damage equal to the damage it just dealt on a failure, or half as much on a success. Once per short rest.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Aura of the Atonement",
				description:
					"When a creature within 10 feet of you takes damage, you can use your reaction to take that damage instead. Damage you take this way can't be reduced or prevented.",
				level: 7,
				actionType: "passive",
			},
			{
				name: "Protective Essence",
				description:
					"At the end of each of your turns, if you have fewer than half your hit points but at least 1, and you aren't incapacitated, you regain hit points equal to 1d6 + half your Holy Knight level (rounded down). Your movement speed increases by 5 feet.",
				level: 15,
				actionType: "passive",
			},
			{
				name: "Emissary of the Absolute",
				description:
					"You have resistance to all damage dealt by other creatures, and whenever a creature damages you, it takes radiant damage equal to half the damage you take (rounded down). If you attack a creature, cast a spell at it, or damage it by any other means, both benefits stop working against that creature until you finish a long rest.",
				level: 20,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Harmonic Shield",
				description:
					"For 1 minute, whenever an ally within 30 feet of you takes damage, you can split it: the ally takes half (rounded down) and you take the rest. Damage you take this way can't be reduced. The effect ends early if you're incapacitated. Once per long rest.",
				recharge: 3,
				cost: "Bonus action",
			},
		],
		stats: {
			primaryAttribute: "Presence",
			secondaryAttribute: "Vitality",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "holy-knight--exaltation-mandate",
		name: "Path of the Exaltation Mandate",
		jobId: "holy-knight",
		jobName: "Holy Knight",
		tier: 2,
		pathType: "exaltation-mandate",
		requirements: {
			level: 3,
		},
		description:
			"The Exaltation Mandate is for those who strive for absolute physical and aetheric perfection. They do not just fight; they perform, their every strike a legendary feat that inspires those around them to reach their own absolute potential. In the modern world, the Exaltation Knight is the supreme hero, their covenant fueling superhuman manifestations that turn every struggle into an epic victory.",
		features: [
			{
				name: "Absolute Resonance: Peerless Form",
				description:
					"As a bonus action, for 10 minutes you have advantage on STR (Athletics) and AGI (Acrobatics) checks, your carrying capacity and the weight you can push, drag, or lift double, and your long and high jumps each go 10 feet farther. Once per short rest.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Absolute Resonance: Inspiring Smite",
				description:
					"Immediately after you deal damage with Covenant Strike, you can use a bonus action to distribute temporary hit points equal to 2d8 + your Holy Knight level among any creatures of your choice within 30 feet of you, including yourself. Once per short rest. You gain a +1 bonus to all saving throws.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Aura of Alacrity",
				description:
					"Your walking speed increases by 10 feet. While you're conscious, an ally who starts its turn within 5 feet of you, or moves there for the first time on a turn, gains a 10-foot bonus to its walking speed until the end of its next turn.",
				level: 7,
				actionType: "passive",
			},
			{
				name: "Exalted Defense",
				description:
					"When you or another creature you can see within 10 feet of you is hit by an attack roll, you can use your reaction to add your PRE modifier (minimum +1) to the target's AC against that attack, possibly causing it to miss. If it misses, you can make one weapon attack against the attacker as part of this reaction, if it's within your weapon's range. You can use this a number of times equal to your PRE modifier, regaining all uses when you finish a long rest.",
				level: 15,
				actionType: "passive",
			},
			{
				name: "Living Legend",
				description:
					"As a bonus action, you become a living legend for 1 minute. While it lasts, you have advantage on PRE checks; once on each of your turns when you miss with a weapon attack, you can make it hit instead; and when you fail a saving throw, you can use your reaction to reroll it, using the new roll. Once per long rest.",
				level: 20,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Heroic Manifestation",
				description:
					"You move up to twice your speed in a straight line without provoking opportunity attacks. Each creature you move within 5 feet of during this movement must make an AGI saving throw against your Job save DC, taking 3d8 radiant damage on a failure or half as much on a success. Once per short rest.",
				cost: "Action",
				actionType: "action",
				uses: { formula: "1", recharge: "short-rest" },
				tracking: "uses",
			},
		],
		stats: {
			primaryAttribute: "Strength",
			secondaryAttribute: "Presence",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "technomancer--aether-chemist-design",
		name: "Design: The Aether Chemist",
		jobId: "technomancer",
		jobName: "Technomancer",
		tier: 2,
		pathType: "aether-chemist-design",
		requirements: {
			level: 3,
		},
		description:
			"The Aether Chemist designs are for those who synthesize aetheric reagents harvested directly from the Rifts. They do not just brew potions; they architecture complex somatic sequences that heal, transform, and incinerate with absolute precision. In the modern world, the Aether Chemist is the supreme specialist in restorative and entropic resonance dynamics, their presence stabilizing the party's biological integrity.",
		features: [
			{
				name: "Aetheric Tool Mastery",
				description: "Absolute proficiency with chemical supplies.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Architect's Mandates",
				description: `A list of always-available absolute mandates for restoration and entropy. You gain advantage on Constitution saving throws to maintain concentration on a spell.`,
				level: 3,
				actionType: "passive",
			},
			{
				name: "Aetheric Infusion",
				description:
					"Synthesize one free aetheric infusion after each rest. Choose from: Restoration, Speed, Resilience, Boldness, Flight, or Transformation.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Alchemical Savant",
				description: `When you use your supplies as an absolute focus, enhance the efficiency of all restorative and destructive manifestations. You gain resistance to force damage.`,
				level: 5,
				actionType: "passive",
			},
			{
				name: "Restorative Synthesis",
				description:
					"All infusions now grant temporary resonance. Manifest restorative mandates at will.",
				level: 9,
				actionType: "passive",
			},
			{
				name: "Absolute Synthesis Mastery",
				description:
					"Absolute immunity to entropic chemicals. Manifest supreme restoration and greater stabilization once per long rest.",
				level: 15,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Volatile Burst",
				description:
					"Synthesize a massive entropic burst: 20-ft radius, dealing acid and fire damage. Once/long rest.",
				recharge: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Intelligence",
			secondaryAttribute: "Sense",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "technomancer--aether-vessel-design",
		name: "Design: The Aether Vessel",
		jobId: "technomancer",
		jobName: "Technomancer",
		tier: 2,
		pathType: "aether-vessel-design",
		requirements: {
			level: 3,
		},
		description:
			"The Aether Vessel designs are for those who infuse physical armaments with the Absolute's blueprints. They do not just wear armor; they manifest localized power-frames that grant superhuman strength and impenetrable defensive auras, turning the Technomancer into a walking force of aetheric might. In the modern world, the Aether Vessel is the supreme martial-architect, their designs representing the peak of ascendant warfare.",
		features: [
			{
				name: "Vessel Architect Mastery",
				description:
					"Absolute proficiency with heavy armaments and smith's tools.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Vessel Mandates",
				description: `A list of always-available absolute mandates for offensive and defensive power. You learn one cantrip of your choice from the wizard spell list. Intelligence is your spellcasting ability for it.`,
				level: 3,
				actionType: "passive",
			},
			{
				name: "Aether-Frame Integration",
				description:
					"Transform a suit of armor into an Absolute Aether-Frame. Choose model: Arbiter (thunder-resonant melee) or Outrider (lightning-resonant ranged).",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Absolute Multi-strike",
				description: `Manifest strikes twice when you take the offensive action. You gain advantage on Constitution saving throws to maintain concentration on a spell.`,
				level: 5,
				actionType: "passive",
			},
			{
				name: "Aetheric Conduits",
				description: `Your vessel counts as four separate aetheric conduits, each capable of holding its own mandate manifestation. When you cast a spell of 1st level or higher, you can teleport up to 10 feet to an unoccupied space you can see.`,
				level: 9,
				actionType: "passive",
			},
			{
				name: "Perfected Aether-Frame",
				description:
					"Arbiter: reaction to pull entities toward you and strike. Outrider: strikes deal extra lightning damage and reveal all nearby aetheric hidden entities.",
				level: 15,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Pulse Overdrive",
				description:
					"Bonus action: overcharge your aether-frame for 1 min, dealing massive thunder or lightning resonance. Once/long rest.",
				recharge: 3,
				cost: "Bonus action",
			},
		],
		stats: {
			primaryAttribute: "Intelligence",
			secondaryAttribute: "Vitality",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "technomancer--resonance-siege-design",
		name: "Design: Resonance Siege",
		jobId: "technomancer",
		jobName: "Technomancer",
		tier: 2,
		pathType: "resonance-siege-design",
		requirements: {
			level: 3,
		},
		description:
			"The Resonance Siege designs represent the peak of offensive aetheric manifestations. They do not just build platforms; they architecture localized resonators that project destructive harmonics or protective fields across the battlefield. In the modern world, the Resonance Siege architect is the supreme heavy resonance specialist, their constructs capable of breaking any gate-defense with absolute power.",
		features: [
			{
				name: "Siege Architect Mastery",
				description:
					"Absolute proficiency with woodcarving tools and aetheric resonance.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Siege Mandates",
				description: `A list of always-available absolute mandates for destructive and protective resonances. Your movement speed increases by 5 feet.`,
				level: 3,
				actionType: "passive",
			},
			{
				name: "Aetheric Resonator",
				description: `Action: manifest a Tiny aetheric resonator. Choose type: Incinerator (fire cone), Ballista (force strike), or Bulwark (restorative field). You gain advantage on Constitution saving throws to maintain concentration on a spell.`,
				level: 3,
				actionType: "passive",
			},
			{
				name: "Absolute Resonance Alignment",
				description: `Enhance the efficiency of all manifestations through an absolute aetheric focus. You gain proficiency in one skill or tool of your choice.`,
				level: 5,
				actionType: "passive",
			},
			{
				name: "Aetheric Detonation",
				description: `Increase resonator efficiency and trigger a self-destructive burst for massive force resonance output. When you cast a spell of 1st level or higher, you can teleport up to 10 feet to an unoccupied space you can see.`,
				level: 9,
				actionType: "passive",
			},
			{
				name: "Siege Specialist",
				description: `Manifest two resonators simultaneously and grant protection to all nearby allies. You can reroll a failed ability check once per short or long rest.`,
				level: 15,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Absolute Salvo",
				description: `All resonators manifest their power simultaneously at maximum efficiency. Once/short rest. Your movement speed increases by 5 feet.`,
				recharge: 1,
				cost: "Bonus action",
			},
		],
		stats: {
			primaryAttribute: "Intelligence",
			secondaryAttribute: "Vitality",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "technomancer--synchronist-binary-design",
		name: "Design: Synchronist Binary",
		jobId: "technomancer",
		jobName: "Technomancer",
		tier: 2,
		pathType: "synchronist-binary-design",
		requirements: {
			level: 3,
		},
		description:
			"The Synchronist Binary designs are for those who bond with a primary aetheric defender. They do not just build a companion; they fuse their own neural resonance with a physical construct, creating a perfect binary fighting unit. In the modern world, the Synchronist is a formidable frontline combatant, their attacks fueled by aetheric compilations that outpace physical reflex.",
		features: [
			{
				name: "Binary Architect Mastery",
				description:
					"Absolute proficiency with smith's tools and neural resonance.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Synchronist Mandates",
				description: `A list of always-available absolute mandates for partnership and coordination. You gain proficiency in one skill or tool of your choice.`,
				level: 3,
				actionType: "passive",
			},
			{
				name: "Absolute Defender",
				description:
					"Manifest a primary construct defender that obeys your every directive. Gain absolute resonance-combat proficiency using your intelligence mod.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Absolute Multi-strike",
				description: `Manifest strikes twice when you take the offensive action. Your movement speed increases by 5 feet.`,
				level: 5,
				actionType: "passive",
			},
			{
				name: "Aetheric Feedback",
				description: `Channel extra force or restorative output through your strikes or your defender's manifestations. Once/short rest. You gain resistance to force damage.`,
				level: 9,
				actionType: "passive",
			},
			{
				name: "Supreme Binary Command",
				description: `Your defender's feedback deals extra force to aggressors, and your synchronization output is doubled. You have advantage on initiative rolls.`,
				level: 15,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Absolute Overdrive",
				description:
					"Your defender gains absolute speed and power for 1 min. Once/long rest.",
				cost: "Bonus action",
				actionType: "bonus action",
				uses: { formula: "1", recharge: "long-rest" },
				tracking: "uses",
			},
		],
		stats: {
			primaryAttribute: "Intelligence",
			secondaryAttribute: "Vitality",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "technomancer--swarm-conduit-design",
		name: "Design: Swarm Conduit",
		jobId: "technomancer",
		jobName: "Technomancer",
		tier: 2,
		pathType: "swarm-conduit-design",
		requirements: {
			level: 3,
		},
		description:
			"The Swarm Conduit designs are for those who deploy aetheric micro-conspicuous to blanket the battlefield. They do not just control drones; they weave a living surveillance and offensive weave that provides absolute oversight and precision strikes. In the modern world, the Swarm Conduit is the supreme tactical specialist, their micro-conduits capable of relaying information and force across any distance.",
		features: [
			{
				name: "Swarm Architect Mastery",
				description:
					"Absolute proficiency with artisan's tools and micro-conduits.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Absolute Swarm",
				description: `Manifest a network of micro-conduits that share your sight and hearing. Command the swarm as an extension of your own absolute will. You gain a +1 bonus to all saving throws.`,
				level: 3,
				actionType: "passive",
			},
			{
				name: "Tactical Manifestation",
				description: `Channel mandates through your swarm conduits and use them to support allies with absolute precision. You have advantage on initiative rolls.`,
				level: 5,
				actionType: "passive",
			},
			{
				name: "Aetheric Surveillance Web",
				description:
					"Your swarm forms a permanent surveillance web, granting advantage on all analytical manifestations and preventing surprise.",
				level: 9,
				actionType: "passive",
			},
			{
				name: "Supreme Swarm Command",
				description: `Your conduits are hardened against destruction and can manifest complex physical interactions. Command multiple swarms simultaneously. Your movement speed increases by 5 feet.`,
				level: 15,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Absolute Convergence",
				description: `All swarm conduits converge for a massive force discharge. Once/short rest. You gain proficiency in one skill or tool of your choice.`,
				cost: "Action",
				actionType: "action",
				uses: { formula: "1", recharge: "short-rest" },
				tracking: "uses",
			},
		],
		stats: {
			primaryAttribute: "Intelligence",
			secondaryAttribute: "Agility",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "technomancer--aether-breacher-design",
		name: "Design: Aether Breacher",
		jobId: "technomancer",
		jobName: "Technomancer",
		tier: 2,
		pathType: "aether-breacher-design",
		requirements: {
			level: 3,
		},
		description:
			"The Aetheric Breacher designs are for those who interface directly with the Absolute's core resonance. They treat reality like a malleable sequence — finding vulnerabilities, suppressing enemy manifestations, and realigning the laws of local aetheric flow. In the modern world, the Breacher is the supreme infiltration specialist, their ability to bypass any defensive mandate making them the ultimate asset for high-rank Rift raids.",
		features: [
			{
				name: "Breacher Architect Mastery",
				description:
					"Absolute proficiency with infiltration supplies and resonance analysis.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Absolute Suppression",
				description: `Action: target an entity's internal resonance to suppress its resistances or immunities for 1 min. You gain resistance to force damage.`,
				level: 3,
				actionType: "passive",
			},
			{
				name: "Mandate Realignment",
				description:
					"Reaction: when an ally fails to resist a manifestation, force a total realignment of the local fate-variable. Once/short rest.",
				level: 5,
				actionType: "passive",
			},
			{
				name: "Exploit Resonance Instability",
				description:
					"When you suppress an entity, choose an additional effect: disadvantage, halved speed, or total aetheric vulnerability.",
				level: 9,
				actionType: "passive",
			},
			{
				name: "Resonance Collapse",
				description:
					"Completely suppress a target's ability to manifest for 1 round. Once/long rest.",
				level: 15,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Absolute Lockdown",
				description:
					"Target entity's internal resonance is completely frozen for 1 round. Once/long rest.",
				cost: "Action",
				actionType: "action",
				uses: { formula: "1", recharge: "long-rest" },
				tracking: "uses",
			},
		],
		stats: {
			primaryAttribute: "Intelligence",
			secondaryAttribute: "Sense",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "idol--lore-resonance",
		name: "Path of the Lore Resonance",
		jobId: "idol",
		jobName: "Idol",
		tier: 2,
		pathType: "lore-resonance",
		requirements: {
			level: 3,
		},
		description:
			"Those who walk the Path of the Lore Resonance are collectors of the Absolute's recursive data-manifolds. They do not just record; they weaponize information itself, disrupting enemy manifestations by echoing their own psychological vulnerabilities back at them in a tidal wave of dissonant data. In the modern world, the Lore Idol is the supreme analytical strategist, their mastery of the Absolute's secrets making them feared by any entity with a hidden variable.",
		features: [
			{
				name: "Mandated Proficiencies",
				description: `Mastery of 3 fields (skills) of your choice. You have advantage on initiative rolls.`,
				level: 3,
				actionType: "passive",
			},
			{
				name: "Cutting Remarks",
				description:
					"Reaction when an entity within 60 ft makes a check or damage roll: expend a Hype die and subtract it from the result. Act before the Absolute declares the outcome.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Arcane Secrets",
				description: `Learn 2 mantras from any lineage's list. They count as Idol resonance mantras. You gain a +1 bonus to all saving throws.`,
				level: 6,
				actionType: "passive",
			},
			{
				name: "Peerless Insight",
				description:
					"When you make an ability check, expend one Hype die and add it to the roll. Act before the Absolute declares the outcome.",
				level: 14,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Words of Absolute Truth",
				description:
					"Speak a devastating truth to a creature within 60 ft: SENSE save or 3d8 psychic + disadvantage on next manifestation. Once/short rest.",
				recharge: 1,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Presence",
			secondaryAttribute: "Intelligence",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "idol--dance-resonance",
		name: "Path of the Dance Resonance",
		jobId: "idol",
		jobName: "Idol",
		tier: 2,
		pathType: "dance-resonance",
		requirements: {
			level: 3,
		},
		description:
			"Those who walk the Path of the Dance Resonance channel the Absolute's combat-frequency through movement itself — their fighting styles derived from modern dance forms weaponized by the Ascendant Bureau's martial arts division. K-pop precision choreography becomes blade-work timing, contemporary flow becomes evasion doctrine, ballet extension becomes strike reach, and hip-hop impact becomes devastating kinetic force. In the modern world, the Dance Idol is the supreme mobile combatant, their battlefield presence a lethal performance that inspires allies and annihilates anomalies with equal grace.",
		features: [
			{
				name: "Combat Choreography",
				description:
					"Prof with medium armor and martial weapons. Choose a primary dance discipline: K-Pop (bonus action feint: advantage on next attack), Contemporary (when hit, use reaction to move 10 ft without provoking), Ballet (melee reach increases by 5 ft), or Hip-Hop (unarmed strikes deal 1d8 + PRS force damage).",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Dance Combat",
				description:
					"When you take the Attack action, your speed increases by 10 ft. On hit, expend one Hype die: Spin Strike (add die to damage, gain +2 AC until start of next turn), Breakfall Combo (add die to damage, knock target prone if Medium or smaller), or Rhythm Rush (add die to damage, move up to 15 ft without provoking opportunity attacks).",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Dual Tempo",
				description: `Attack twice when you take the Attack action. Your movement speed increases by 5 feet.`,
				level: 6,
				actionType: "passive",
			},
			{
				name: "Master Choreographer",
				description:
					"You can use a d6 instead of expending a Hype die for Dance Combat. Additionally, when you hit with a Dance Combat flourish, one ally within 30 ft who can see you can use their reaction to move up to half their speed.",
				level: 14,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Showstopper Finale",
				description:
					"Perform a devastating combat dance sequence: make a melee attack against every creature within 10 ft. Each hit uses a free Dance Combat flourish (d6, no Hype die expended). Allies within 30 ft who can see you gain 2d8 temporary HP. Once/short rest.",
				recharge: 1,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Presence",
			secondaryAttribute: "Agility",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "idol--hypnotic-resonance",
		name: "Path of the Hypnotic Resonance",
		jobId: "idol",
		jobName: "Idol",
		tier: 2,
		pathType: "hypnotic-resonance",
		requirements: {
			level: 3,
		},
		description:
			"The Path of the Hypnotic Resonance designates an Idol who broadcasts on the fey-resonance bands of the Absolute. They do not just perform; they project irresistible harmonic patterns that override the common consensus of those who witness them. In the high-stakes world of social and political containment, they are the supreme influencers, their absolute charm capable of turning an entire city-block into a unified collective of their choosing.",
		features: [
			{
				name: "Mantle of Awe",
				description:
					"Bonus action: expend one Hype die. Up to PRE mod creatures within 60 ft gain temp HP = 2× Hype die roll + Idol level and can use reaction to move up to their speed without provoking OAs.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Absolute Enthrallment",
				description:
					"After 1+ min performance, PRE mod creatures that watched make SENSE save or are charmed for 1 hour. Charmed entities idolize you, hinder those who oppose you, and don't know they were charmed when it ends.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Mantle of the Absolute",
				description:
					"Bonus action: take on an appearance of unearthly beauty for 1 min (concentration). Each turn, bonus action use a Command mantra (no slot) against a creature charmed by you. Once/long rest.",
				level: 6,
				actionType: "passive",
			},
			{
				name: "Unbreakable Presence",
				description:
					"Bonus action: for 1 min, any creature that attacks you for the first time on a turn must make a PRE save. Fail: attack is wasted (can't attack you this turn). Success: disadvantage on saves vs your mantras until end of your next turn. Once per short rest.",
				level: 14,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Absolute Charm",
				description:
					"All creatures within 30 ft: SENSE save or charmed by you for 1 min. Charmed creatures will follow one reasonable suggestion. Once/long rest.",
				recharge: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Presence",
			secondaryAttribute: "Agility",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "idol--blade-resonance",
		name: "Path of the Blade Resonance",
		jobId: "idol",
		jobName: "Idol",
		tier: 2,
		pathType: "blade-resonance",
		requirements: {
			level: 3,
		},
		description:
			"Those who walk the Path of the Blade Resonance channel their harmonic frequencies through physical armaments. They treat the battlefield as a lethal performance, their every strike a precision-weighted aetheric flourish that maximizes destruction while ensuring their own physical integrity. In the elite academies, they are the supreme martial specialists, their combat style a perfect bridge between physical perfection and aetheric art.",
		features: [
			{
				name: "Mandated Martial Mastery",
				description:
					"Prof with medium armor and the scimitar. Use a weapon as a focus for your resonance.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Combat Discipline",
				description:
					"Choose Dueling (+2 damage with one-handed melee) or Two-Weapon Fighting (add ability mod to off-hand damage).",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Blade Flourish",
				description:
					"When you take the Attack action, your speed increases by 10 ft. On hit, expend one Hype die: Defensive Flourish (add die to damage and AC until start of next turn), Slashing Flourish (add die to damage, and damage equal to the die roll to another creature within 5 ft), or Mobile Flourish (add die to damage, push target 5+die roll feet, use reaction to move to within 5 ft of them).",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Echo Attack",
				description: `Attack twice when you take the Attack action. You have advantage on initiative rolls.`,
				level: 6,
				actionType: "passive",
			},
			{
				name: "Master's Flourish",
				description: `You can use a d6 instead of expending a Hype die for Blade Flourish. You can reroll a failed ability check once per short or long rest.`,
				level: 14,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Dance of a Thousand Blades",
				description:
					"Make a melee attack against every creature within 10 ft. Each hit uses a free Blade Flourish (d6, no Hype die expended). Once/short rest.",
				recharge: 1,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Presence",
			secondaryAttribute: "Agility",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "idol--shadow-resonance",
		name: "Path of the Shadow Resonance",
		jobId: "idol",
		jobName: "Idol",
		tier: 2,
		pathType: "shadow-resonance",
		requirements: {
			level: 3,
		},
		description:
			"The Shadow Resonance mandate is walked by those who broadcast on the hidden, subsonic layers of the Absolute's dark architecture. They are the supreme ghosts of the Idol lineage, gathered intel from the very static of the world around them. They do not just hide; they weave fear into the aetheric signatures of their enemies, planting suggestions and extracting secrets with a surgical, undetectable precision.",
		features: [
			{
				name: "Psychic Blades",
				description:
					"When you hit with a weapon attack, expend one Hype die to deal extra psychic damage = 2d6 (3d6 at 5th, 5d6 at 10th, 8d6 at 15th). Once per turn.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Words of Terror",
				description:
					"After 1+ min speaking privately to a creature, SENSE save or it is frightened of a creature of your choice for 1 hour. Doesn't know it was magically frightened. Once per short rest.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Mantle of Whispers",
				description:
					"Reaction when a living vessel's cycle ends within 30 ft: capture its shadow. As an action, take on its appearance for 1 hour (or until dismissed). You gain access to its general knowledge and memories. Deception checks to pass as it have +5. Once per short rest.",
				level: 6,
				actionType: "passive",
			},
			{
				name: "Absolute Shadow Lore",
				description:
					"Action: creature within 30 ft, SENSE save or it is charmed for 8 hours. It believes you know its deepest secret (even if you don't) and obeys your commands to avoid the secret being revealed. Once per long rest.",
				level: 14,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Psychic Overload",
				description:
					"60 ft: creature makes SENSE save or takes 4d8 psychic and is frightened of you for 1 min. Once/long rest.",
				recharge: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Presence",
			secondaryAttribute: "Agility",
		},
		source: "Rift Ascendant Canon",
	},
	{
		id: "idol--genesis-resonance",
		name: "Path of the Genesis Resonance",
		jobId: "idol",
		jobName: "Idol",
		tier: 2,
		pathType: "genesis-resonance",
		requirements: {
			level: 3,
		},
		description:
			"The Path of the Genesis Resonance designates an Idol who taps into the Absolute's foundational harmonic—the vibration that structures matter itself. They do not just imagine; they manifest, fabricating physical items and animating objects from raw mana as a physical manifestation of their art. In the modern world, they are the supreme architects of the material weave, their presence turning any location into a factory of absolute creation.",
		features: [
			{
				name: "Mote of Potential",
				description:
					"When you give a Hype die, the creature also gains a mote. Strike roll: mote explodes in 5-ft radius thunder (VIT save = Hype die roll). Ability check: roll Hype die twice, use either. Save: gains temp HP = Hype die roll + PRE mod.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Resonance of Creation",
				description:
					"Action: create one nonmagical item (Medium or smaller, worth ≤ 20× Idol level gp). Lasts for hours = prof bonus. One at a time. Once per long rest.",
				level: 3,
				actionType: "passive",
			},
			{
				name: "Animating Rite",
				description:
					"Action: animate a Large or smaller nonmagical item within 30 ft. It becomes a construct (HP = 10+5× Idol level, AC = 16, +prof to attack, 1d10+PRE force slam, 30 ft speed). Bonus action to command. Lasts 1 hour. Once per long rest.",
				level: 6,
				actionType: "passive",
			},
			{
				name: "Absolute Resonance Crescendo",
				description: `Resonance of Creation: create a number of items = PRE mod simultaneously. One can be Large, and any can be worth more (up to 200× Idol level gp). None require concentration or have the duration limit. Your movement speed increases by 5 feet.`,
				level: 14,
				actionType: "passive",
			},
		],
		abilities: [
			{
				name: "Absolute Magnum Opus",
				description:
					"Create a Large animated construct (HP = 50, AC 18, +8 attack, 2d10+5 force slam). It lasts 1 hour and obeys your commands. Once/long rest.",
				recharge: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Presence",
			secondaryAttribute: "Intelligence",
		},
		source: "Rift Ascendant Canon",
	},
];

type ReconciledPathAbility = Pick<
	PathAbility,
	"actionType" | "level" | "resource" | "tracking" | "uses"
> & { abilityName: string };

const RECONCILED_PATH_ALIASES: Readonly<Record<string, readonly string[]>> = {
	"destroyer--phantom-blade": [
		"destroyer--aftershock",
		"Path of the Phantom Blade",
	],
	"mage--shield-compiler": [
		"mage--shield-architect",
		"Path of the Shield Compiler",
	],
	// The legacy roster named this Berserker Path the Feedback Loop.
	"berserker--escalating-resonance": ["Path of the Feedback Loop"],
	"assassin--gate-runner": ["assassin--shadow-thief"],
	"assassin--terminus": [
		"assassin--silent-knife",
		"Path of the Terminus-Scythe",
		"Path of the Silent Knife",
	],
	"assassin--weave-infiltrator": [
		"assassin--spell-thief",
		"Path of the Lattice-Breaker",
	],
	"assassin--shadow-herald": [
		"assassin--shadow-broker",
		"Path of the Telemetry-Architect",
	],
	"assassin--blade-dancer": [
		"assassin--duellist",
		"Path of the Resonance-Dancer",
	],
	"assassin--vanguard-outrider": [
		"assassin--outrider",
		"Path of the Threshold-Surveyor",
	],
	"striker--kinetic-core": ["Path of the Kinetic Fist"],
	"striker--aetheric-channeler": ["Path of the Force Channeler"],
	"striker--entropic-flow": ["Path of the Glitch Step"],
	"striker--harmonic-surgeon": ["Path of the Nerve Surgeon"],
	"revenant--void-lord": ["Path of the Void Lord"],
	"revenant--entropy-drinker": ["Path of the Entropy Drinker"],
	"revenant--wither-guard": ["Path of the Wither Guard"],
	"revenant--entropy-blade": ["Path of the Entropy Blade"],
	"revenant--plague-weaver": ["Path of the Plague Weaver"],
	"stalker--apex-hunter": ["Path of the Apex Hunter"],
	"stalker--umbral-hunter": ["Path of the Umbral Hunter"],
};

/**
 * Structured cadence for canon-reconciled path abilities. Numeric `recharge`
 * values were legacy display codes, not d6 recharge mechanics. Claims without
 * an authored cadence remain explicitly manual.
 */
const RECONCILED_PATH_ABILITY_MECHANICS: Readonly<
	Record<string, ReconciledPathAbility>
> = {
	"destroyer--apex-predator": {
		abilityName: "Predator's Focus",
		level: 3,
		actionType: "Bonus action",
		uses: { formula: "1", recharge: "short-rest" },
		tracking: "uses",
	},
	"destroyer--tactician": {
		abilityName: "Combat Scan",
		level: 3,
		actionType: "Bonus action",
		resource: "Tactical die",
		tracking: "resource",
	},
	"destroyer--spell-breaker": {
		abilityName: "Mana Strike",
		level: 3,
		actionType: "Action",
		tracking: "manual",
	},
	"destroyer--bulwark": {
		abilityName: "Fortress Mode",
		level: 3,
		actionType: "Bonus action",
		tracking: "manual",
	},
	"destroyer--last-stand": {
		abilityName: "Piercing Blow",
		level: 3,
		actionType: "Bonus action",
		uses: { formula: "1", recharge: "short-rest" },
		tracking: "uses",
	},
	"destroyer--phantom-blade": {
		abilityName: "Kinetic Replay",
		level: 3,
		actionType: "Reaction",
		tracking: "manual",
	},
	"mage--detonation-specialist": {
		abilityName: "Absolute Yield",
		level: 2,
		actionType: "Free",
		tracking: "manual",
	},
	"mage--shield-compiler": {
		abilityName: "Barrier Restoration",
		level: 2,
		actionType: "Action",
		uses: { formula: "1", recharge: "long-rest" },
		tracking: "uses",
	},
	"mage--probability-mandate": {
		abilityName: "Mandate Override",
		level: 2,
		actionType: "Reaction",
		uses: { formula: "1", recharge: "short-rest" },
		tracking: "uses",
	},
	"mage--phantasmist": {
		abilityName: "Phantasmal Terrain",
		level: 2,
		actionType: "Action",
		tracking: "manual",
	},
	"mage--rift-caller": {
		abilityName: "Emergency Rift",
		level: 2,
		actionType: "Bonus action",
		uses: { formula: "PB", recharge: "long-rest" },
		tracking: "uses",
	},
	"mage--matter-weaver": {
		abilityName: "Molecular Override",
		level: 2,
		actionType: "Action",
		uses: { formula: "1", recharge: "short-rest" },
		tracking: "uses",
	},
	"contractor--glamour-weaver": {
		abilityName: "Absolute Glow",
		level: 1,
		actionType: "Action",
		tracking: "manual",
	},
	"contractor--infernal-conduit": {
		abilityName: "Entropic Blast",
		level: 1,
		actionType: "Free",
		uses: { formula: "1", recharge: "short-rest" },
		tracking: "uses",
	},
	"contractor--void-whisperer": {
		abilityName: "Void Scream",
		level: 1,
		actionType: "Action",
		uses: { formula: "1", recharge: "short-rest" },
		tracking: "uses",
	},
	"contractor--radiant-vessel": {
		abilityName: "Radiant Discharge",
		level: 1,
		actionType: "Action",
		uses: { formula: "1", recharge: "long-rest" },
		tracking: "uses",
	},
	"contractor--cursed-blade": {
		abilityName: "Shadow Manifest",
		level: 1,
		actionType: "Bonus action",
		resource: "Pact slot",
		tracking: "resource",
	},
	"contractor--deep-dweller": {
		abilityName: "Crushing Resonance",
		level: 1,
		actionType: "Action",
		uses: { formula: "1", recharge: "long-rest" },
		tracking: "uses",
	},
	"holy-knight--absolute-devotion": {
		abilityName: "Absolute Smite",
		level: 3,
		actionType: "Bonus action",
		uses: { formula: "1", recharge: "short-rest" },
		tracking: "uses",
	},
	"holy-knight--retribution-mandate": {
		abilityName: "Relentless Pursuit",
		level: 3,
		actionType: "Bonus action",
		uses: { formula: "1", recharge: "long-rest" },
		tracking: "uses",
	},
	"holy-knight--verdant-mandate": {
		abilityName: "Verdant Bulwark",
		level: 3,
		actionType: "Action",
		uses: { formula: "1", recharge: "long-rest" },
		tracking: "uses",
	},
	"holy-knight--dominance-mandate": {
		abilityName: "Absolute Presence",
		level: 3,
		actionType: "Action",
		uses: { formula: "1", recharge: "long-rest" },
		tracking: "uses",
	},
	"holy-knight--atonement-mandate": {
		abilityName: "Harmonic Shield",
		level: 3,
		actionType: "Bonus action",
		uses: { formula: "1", recharge: "long-rest" },
		tracking: "uses",
	},
	"holy-knight--exaltation-mandate": {
		abilityName: "Heroic Manifestation",
		level: 3,
		actionType: "Action",
		uses: { formula: "1", recharge: "short-rest" },
		tracking: "uses",
	},
	"berserker--escalating-resonance": {
		abilityName: "Runaway Resonance",
		level: 3,
		actionType: "Free (while in Overload)",
		uses: { formula: "1", recharge: "long-rest" },
		tracking: "uses",
	},
	"berserker--gate-beast": {
		abilityName: "Territorial Roar",
		level: 3,
		actionType: "Action",
		uses: { formula: "1", recharge: "long-rest" },
		tracking: "uses",
	},
	"berserker--mana-scars": {
		abilityName: "Scar Eruption",
		level: 3,
		actionType: "Action",
		uses: { formula: "1", recharge: "long-rest" },
		tracking: "uses",
	},
	"berserker--rift-storm": {
		abilityName: "Storm Detonation",
		level: 3,
		actionType: "Action",
		uses: { formula: "1", recharge: "long-rest" },
		tracking: "uses",
	},
	"berserker--absolute-zealot": {
		abilityName: "Radiant Overload",
		level: 3,
		actionType: "Bonus action",
		uses: { formula: "1", recharge: "long-rest" },
		tracking: "uses",
	},
	"berserker--aetheric-anomaly": {
		abilityName: "Anomalous Detonation",
		level: 3,
		actionType: "Action",
		uses: { formula: "1", recharge: "long-rest" },
		tracking: "uses",
	},
	"assassin--gate-runner": {
		abilityName: "Phase Grab",
		level: 3,
		actionType: "Bonus action",
		uses: { formula: "PB", recharge: "long-rest" },
		tracking: "uses",
	},
	"assassin--terminus": {
		abilityName: "Phase Termination",
		level: 3,
		actionType: "Free",
		uses: { formula: "1", recharge: "short-rest" },
		tracking: "uses",
	},
	"assassin--weave-infiltrator": {
		abilityName: "Shadow Casting",
		level: 3,
		actionType: "Action",
		uses: { formula: "1", recharge: "short-rest" },
		tracking: "uses",
	},
	"assassin--shadow-herald": {
		abilityName: "Coordinated Exploit",
		level: 3,
		actionType: "Bonus action",
		uses: { formula: "1", recharge: "short-rest" },
		tracking: "uses",
	},
	"assassin--blade-dancer": {
		abilityName: "Aetheric Riposte",
		level: 3,
		actionType: "Reaction",
		uses: { formula: "1", recharge: "short-rest" },
		tracking: "uses",
	},
	"assassin--vanguard-outrider": {
		abilityName: "Phase Reconnaissance",
		level: 3,
		actionType: "Action",
		uses: { formula: "1", recharge: "short-rest" },
		tracking: "uses",
	},
	"striker--kinetic-core": {
		abilityName: "Essence Lockdown",
		level: 3,
		actionType: "Action",
		resource: "3 Impulse points",
		tracking: "resource",
	},
	"striker--phantom-step": {
		abilityName: "Phantom Barrage",
		level: 3,
		actionType: "Action",
		resource: "3 Impulse points",
		tracking: "resource",
	},
	"striker--aetheric-channeler": {
		abilityName: "Omni-Burst",
		level: 3,
		actionType: "Action",
		resource: "5 Impulse points",
		tracking: "resource",
	},
	"striker--entropic-flow": {
		abilityName: "Entropic Counter",
		level: 3,
		actionType: "Reaction",
		uses: { formula: "PB", recharge: "short-rest" },
		tracking: "uses",
	},
	"striker--blade-conductor": {
		abilityName: "Blade Tempest",
		level: 3,
		actionType: "Action",
		resource: "4 Impulse points",
		tracking: "resource",
	},
	"striker--harmonic-surgeon": {
		abilityName: "Aetheric Heal",
		level: 3,
		actionType: "Action",
		resource: "2 Impulse points",
		tracking: "resource",
	},
	"esper--draconic-lineage": {
		abilityName: "Dragon Breath",
		level: 1,
		resource: "3 Flux",
		tracking: "resource",
	},
	"esper--aetheric-cascade": {
		abilityName: "Cascade Bolt",
		level: 1,
		resource: "1st-level spell slot",
		tracking: "resource",
	},
	"esper--shadow-magic": {
		abilityName: "Void Lance",
		level: 1,
		resource: "2 Flux",
		tracking: "resource",
	},
	"esper--storm-sorcery": {
		abilityName: "Thunder Rift",
		level: 1,
		resource: "3rd-level spell slot",
		tracking: "resource",
	},
	"esper--absolute-spark": {
		abilityName: "Absolute Healing Surge",
		level: 1,
		resource: "2 Flux",
		tracking: "resource",
	},
	"esper--aberrant-mind": {
		abilityName: "Psionic Lance",
		level: 1,
		resource: "2nd-level spell slot or 2 Flux",
		tracking: "resource",
	},
	"summoner--biome-architect": {
		abilityName: "Biome Surge",
		level: 2,
		actionType: "Action",
		uses: { formula: "1", recharge: "long-rest" },
		tracking: "uses",
	},
	"summoner--apex-shifter": {
		abilityName: "Apex Manifestation",
		level: 2,
		actionType: "Bonus action",
		uses: { formula: "1", recharge: "long-rest" },
		tracking: "uses",
	},
	"summoner--dream-weaver": {
		abilityName: "Lush Blessing",
		level: 2,
		actionType: "Action",
		uses: { formula: "1", recharge: "long-rest" },
		tracking: "uses",
	},
	"summoner--pack-commander": {
		abilityName: "Absolute Alpha",
		level: 2,
		actionType: "Bonus action",
		uses: { formula: "1", recharge: "short-rest" },
		tracking: "uses",
	},
	"summoner--symbiotic-host": {
		abilityName: "Spore Eruption",
		level: 2,
		actionType: "Action",
		uses: { formula: "1", recharge: "long-rest" },
		tracking: "uses",
	},
	"summoner--cosmic-conduit": {
		abilityName: "Starfall Manifestation",
		level: 2,
		actionType: "Action",
		uses: { formula: "1", recharge: "long-rest" },
		tracking: "uses",
	},
	"herald--restoration-mandate": {
		abilityName: "Mass Restoration",
		level: 1,
		actionType: "Action",
		uses: { formula: "1", recharge: "long-rest" },
		tracking: "uses",
	},
	"herald--radiance-mandate": {
		abilityName: "Solar Burst",
		level: 1,
		actionType: "Action",
		uses: { formula: "1", recharge: "short-rest" },
		tracking: "uses",
	},
	"herald--combat-mandate": {
		abilityName: "Refined Weapon",
		level: 1,
		actionType: "Bonus action",
		uses: { formula: "1", recharge: "long-rest" },
		tracking: "uses",
	},
	"herald--knowledge-mandate": {
		abilityName: "Aetheric Query",
		level: 1,
		actionType: "Action (1 minute)",
		uses: { formula: "1", recharge: "long-rest" },
		tracking: "uses",
	},
	"herald--storm-mandate": {
		abilityName: "Call Lightning Manifestation",
		level: 1,
		actionType: "Action",
		uses: { formula: "1", recharge: "short-rest" },
		tracking: "uses",
	},
	"herald--triage-mandate": {
		abilityName: "Absolute Safeguard",
		level: 1,
		actionType: "Action",
		uses: { formula: "1", recharge: "long-rest" },
		tracking: "uses",
	},
	"idol--lore-resonance": {
		abilityName: "Words of Absolute Truth",
		level: 3,
		actionType: "Action",
		uses: { formula: "1", recharge: "short-rest" },
		tracking: "uses",
	},
	"idol--dance-resonance": {
		abilityName: "Showstopper Finale",
		level: 3,
		actionType: "Action",
		uses: { formula: "1", recharge: "short-rest" },
		tracking: "uses",
	},
	"idol--hypnotic-resonance": {
		abilityName: "Absolute Charm",
		level: 3,
		actionType: "Action",
		uses: { formula: "1", recharge: "long-rest" },
		tracking: "uses",
	},
	"idol--blade-resonance": {
		abilityName: "Dance of a Thousand Blades",
		level: 3,
		actionType: "Action",
		uses: { formula: "1", recharge: "short-rest" },
		tracking: "uses",
	},
	"idol--shadow-resonance": {
		abilityName: "Psychic Overload",
		level: 3,
		actionType: "Action",
		uses: { formula: "1", recharge: "long-rest" },
		tracking: "uses",
	},
	"idol--genesis-resonance": {
		abilityName: "Absolute Magnum Opus",
		level: 3,
		actionType: "Action",
		uses: { formula: "1", recharge: "long-rest" },
		tracking: "uses",
	},
	"revenant--void-lord": {
		abilityName: "Devour the Remnant",
		level: 2,
		actionType: "Action",
		uses: { formula: "1", recharge: "long-rest" },
		tracking: "uses",
	},
	"revenant--entropy-drinker": {
		abilityName: "Hemorrhage",
		level: 2,
		actionType: "Action",
		uses: { formula: "1", recharge: "long-rest" },
		tracking: "uses",
	},
	"revenant--wither-guard": {
		abilityName: "Entropy Carapace",
		level: 2,
		actionType: "Bonus action",
		uses: { formula: "1", recharge: "long-rest" },
		tracking: "uses",
	},
	"revenant--entropy-blade": {
		abilityName: "Reaping Decree",
		level: 2,
		actionType: "Action",
		uses: { formula: "1", recharge: "long-rest" },
		tracking: "uses",
	},
	"revenant--plague-weaver": {
		abilityName: "Maw of the Void",
		level: 2,
		actionType: "Action",
		uses: { formula: "1", recharge: "long-rest" },
		tracking: "uses",
	},
	"revenant--threshold-walker": {
		abilityName: "Threshold Pulse",
		level: 2,
		actionType: "Action",
		uses: { formula: "1", recharge: "long-rest" },
		tracking: "uses",
	},
	"stalker--apex-hunter": {
		abilityName: "Prey Manifest",
		level: 3,
		actionType: "Bonus action",
		uses: { formula: "1", recharge: "short-rest" },
		tracking: "uses",
	},
	"stalker--pack-leader": {
		abilityName: "Coordinated Strike",
		level: 3,
		actionType: "Action",
		uses: { formula: "1", recharge: "short-rest" },
		tracking: "uses",
	},
	"stalker--umbral-hunter": {
		abilityName: "Shadow Strike",
		level: 3,
		actionType: "Bonus action",
		uses: { formula: "1", recharge: "short-rest" },
		tracking: "uses",
	},
	"stalker--rift-strider": {
		abilityName: "Planar Collapse",
		level: 3,
		actionType: "Action",
		uses: { formula: "1", recharge: "long-rest" },
		tracking: "uses",
	},
	"stalker--apex-slayer": {
		abilityName: "Exploit Vulnerability",
		level: 3,
		actionType: "Free",
		uses: { formula: "1", recharge: "long-rest" },
		tracking: "uses",
	},
	"stalker--hive-synchronist": {
		abilityName: "Hive Eruption",
		level: 3,
		actionType: "Action",
		uses: { formula: "1", recharge: "short-rest" },
		tracking: "uses",
	},
	"technomancer--aether-chemist-design": {
		abilityName: "Volatile Burst",
		level: 3,
		actionType: "Action",
		uses: { formula: "1", recharge: "long-rest" },
		tracking: "uses",
	},
	"technomancer--aether-vessel-design": {
		abilityName: "Pulse Overdrive",
		level: 3,
		actionType: "Bonus action",
		uses: { formula: "1", recharge: "long-rest" },
		tracking: "uses",
	},
	"technomancer--resonance-siege-design": {
		abilityName: "Absolute Salvo",
		level: 3,
		actionType: "Bonus action",
		uses: { formula: "1", recharge: "short-rest" },
		tracking: "uses",
	},
	"technomancer--synchronist-binary-design": {
		abilityName: "Absolute Overdrive",
		level: 3,
		actionType: "Bonus action",
		uses: { formula: "1", recharge: "long-rest" },
		tracking: "uses",
	},
	"technomancer--swarm-conduit-design": {
		abilityName: "Absolute Convergence",
		level: 3,
		actionType: "Action",
		uses: { formula: "1", recharge: "short-rest" },
		tracking: "uses",
	},
	"technomancer--aether-breacher-design": {
		abilityName: "Absolute Lockdown",
		level: 3,
		actionType: "Action",
		uses: { formula: "1", recharge: "long-rest" },
		tracking: "uses",
	},
};

type ReconciledPathFeature = Pick<
	PathFeature,
	"actionType" | "resource" | "tracking" | "uses"
> & { featureName: string };

/** Source-explicit activation, cadence, and resource metadata for reconciled paths. */
const RECONCILED_PATH_FEATURE_MECHANICS: Readonly<
	Record<string, readonly ReconciledPathFeature[]>
> = {
	"destroyer--tactician": [
		{
			featureName: "Tactical Charge",
			// Tactical dice: four at 3rd level, five at 7th, six at 15th.
			uses: { formula: "4 + (level + 1) / 8", recharge: "short-rest" },
			tracking: "uses",
		},
	],
	"mage--matter-weaver": [
		{
			featureName: "Master Weaver's Rite",
			actionType: "Action",
			tracking: "manual",
		},
	],
	"contractor--infernal-conduit": [
		{
			featureName: "Hurl Through the Void",
			uses: { formula: "1", recharge: "long-rest" },
			tracking: "uses",
		},
	],
	"contractor--void-whisperer": [
		{ featureName: "Absolute Thrall", actionType: "Action" },
	],
	"contractor--radiant-vessel": [
		{
			featureName: "Aetheric Radiance",
			actionType: "Bonus action",
			uses: { formula: "1 + level", recharge: "long-rest" },
			tracking: "uses",
		},
		{
			featureName: "Searing Rebirth",
			uses: { formula: "1", recharge: "long-rest" },
			tracking: "uses",
		},
	],
	"contractor--cursed-blade": [
		{
			featureName: "Absolute Curse",
			actionType: "Bonus action",
			uses: { formula: "1", recharge: "short-rest" },
			tracking: "uses",
		},
		{
			featureName: "Aetheric Remnant",
			uses: { formula: "1", recharge: "long-rest" },
			tracking: "uses",
		},
		{ featureName: "Absolute Deflection", actionType: "Reaction" },
	],
	"contractor--deep-dweller": [
		{
			featureName: "Tentacle of the Absolute",
			actionType: "Bonus action",
			uses: { formula: "PB", recharge: "long-rest" },
			tracking: "uses",
		},
		{ featureName: "Absolute Coil", actionType: "Reaction" },
		{
			featureName: "Void Tentacles",
			actionType: "Action",
			uses: { formula: "1", recharge: "long-rest" },
			tracking: "uses",
		},
		{
			featureName: "Abyssal Plunge",
			actionType: "Action",
			uses: { formula: "1", recharge: "short-rest" },
			tracking: "uses",
		},
	],
	"holy-knight--dominance-mandate": [
		{
			featureName: "Absolute Resonance: Crushing Mandate",
			actionType: "Action",
			uses: { formula: "1", recharge: "short-rest" },
			tracking: "uses",
		},
		{
			featureName: "Absolute Resonance: Guided Strike",
			uses: { formula: "1", recharge: "short-rest" },
			tracking: "uses",
		},
		{
			featureName: "Absolute Archon",
			actionType: "Action",
			uses: { formula: "1", recharge: "long-rest" },
			tracking: "uses",
		},
	],
	"holy-knight--atonement-mandate": [
		{
			featureName: "Absolute Resonance: Peacekeeper",
			actionType: "Bonus action",
			uses: { formula: "1", recharge: "short-rest" },
			tracking: "uses",
		},
		{
			featureName: "Absolute Resonance: Radiant Backlash",
			actionType: "Reaction",
			uses: { formula: "1", recharge: "short-rest" },
			tracking: "uses",
		},
		{ featureName: "Aura of the Atonement", actionType: "Reaction" },
	],
	"berserker--aetheric-anomaly": [
		{ featureName: "Cascade Resonance", actionType: "Reaction" },
	],
	"striker--kinetic-core": [
		{
			featureName: "Resonance Palm",
			resource: "3 Impulse points",
			tracking: "resource",
		},
	],
	"striker--entropic-flow": [
		{
			featureName: "Entropic Realignment",
			actionType: "Reaction",
			resource: "1 Impulse point",
			tracking: "resource",
		},
		{
			featureName: "Harmonic Correction",
			resource: "2 Impulse points",
			tracking: "resource",
		},
	],
	"striker--blade-conductor": [
		{
			featureName: "Resonance Honing",
			actionType: "Bonus action",
			resource: "1-3 Impulse points",
			tracking: "resource",
		},
	],
	"striker--harmonic-surgeon": [
		{
			featureName: "Restorative Touch",
			actionType: "Action",
			resource: "1 Impulse point",
			tracking: "resource",
		},
		{
			featureName: "Essence Shutdown",
			resource: "1 Impulse point",
			tracking: "resource",
		},
	],
	"striker--phantom-step": [
		{
			featureName: "Shadow Resonance",
			actionType: "Action",
			resource: "2 Impulse points",
			tracking: "resource",
		},
	],
	"holy-knight--exaltation-mandate": [
		{
			featureName: "Absolute Resonance: Peerless Form",
			actionType: "Bonus action",
			uses: { formula: "1", recharge: "short-rest" },
			tracking: "uses",
		},
		{
			featureName: "Absolute Resonance: Inspiring Smite",
			actionType: "Bonus action",
			uses: { formula: "1", recharge: "short-rest" },
			tracking: "uses",
		},
		{
			featureName: "Exalted Defense",
			actionType: "Reaction",
			uses: { formula: "PRE mod", recharge: "long-rest" },
			tracking: "uses",
		},
		{
			featureName: "Living Legend",
			actionType: "Bonus action",
			uses: { formula: "1", recharge: "long-rest" },
			tracking: "uses",
		},
	],
	"esper--draconic-lineage": [
		{
			featureName: "Elemental Affinity",
			resource: "1 Flux",
			tracking: "resource",
		},
		{ featureName: "Wings of the Absolute", actionType: "Bonus action" },
		{
			featureName: "regent-tier Mandate",
			actionType: "Action",
			resource: "5 Flux",
			tracking: "resource",
		},
	],
	"esper--aetheric-cascade": [
		{
			featureName: "Probability Realignment",
			actionType: "Reaction",
			resource: "2 Flux",
			tracking: "resource",
		},
	],
	"esper--shadow-magic": [
		{
			featureName: "Void Anchor",
			uses: { formula: "1", recharge: "long-rest" },
			tracking: "uses",
		},
		{
			featureName: "Void Hound",
			actionType: "Bonus action",
			resource: "3 Flux",
			tracking: "resource",
		},
		{ featureName: "Void Step", actionType: "Bonus action" },
		{
			featureName: "Void Form",
			actionType: "Bonus action",
			resource: "6 Flux",
			tracking: "resource",
		},
	],
	"esper--storm-sorcery": [
		{ featureName: "Storm Discharge", actionType: "Bonus action" },
		{ featureName: "Weather Control", actionType: "Bonus action" },
		{ featureName: "Storm Retaliation", actionType: "Reaction" },
		{ featureName: "Eye of the Storm", actionType: "Action" },
	],
	"esper--absolute-spark": [
		{
			featureName: "Absolute Favor",
			uses: { formula: "1", recharge: "short-rest" },
			tracking: "uses",
		},
		{
			featureName: "Healing Amplification",
			resource: "1 Flux",
			tracking: "resource",
		},
		{ featureName: "Aetheric Wings", actionType: "Bonus action" },
		{
			featureName: "Emergency Restoration",
			actionType: "Bonus action",
			uses: { formula: "1", recharge: "long-rest" },
			tracking: "uses",
		},
	],
	"esper--aberrant-mind": [
		{ featureName: "Telepathic Link", actionType: "Bonus action" },
		{
			featureName: "Psionic Casting",
			resource: "Flux equal to spell level",
			tracking: "resource",
		},
		{
			featureName: "Psionic Metamorphosis",
			actionType: "Bonus action",
			resource: "1+ Flux",
			tracking: "resource",
		},
		{
			featureName: "Psionic Implosion",
			actionType: "Action",
			tracking: "manual",
		},
	],
	"summoner--biome-architect": [
		{
			featureName: "Biome Absorption",
			uses: { formula: "1", recharge: "long-rest" },
			tracking: "uses",
		},
	],
	"summoner--apex-shifter": [
		{ featureName: "Absolute Entity Shift", actionType: "Bonus action" },
	],
	"summoner--dream-weaver": [
		{ featureName: "Balm of the Absolute", actionType: "Bonus action" },
		{
			featureName: "Phantasmal Path",
			actionType: "Bonus action",
			uses: { formula: "SENSE mod", recharge: "long-rest" },
			tracking: "uses",
		},
	],
	"summoner--pack-commander": [
		{ featureName: "Aetheric Totem", actionType: "Bonus action" },
		{
			featureName: "Faithful Call",
			uses: { formula: "1", recharge: "long-rest" },
			tracking: "uses",
		},
	],
	"summoner--symbiotic-host": [
		{
			featureName: "Absolute Spore Cloud",
			actionType: "Reaction",
			tracking: "manual",
		},
		{
			featureName: "Host Fusion",
			resource: "Entity Shift use",
			tracking: "resource",
		},
		{
			featureName: "Colony Expansion",
			actionType: "Reaction",
			uses: { formula: "SENSE mod", recharge: "long-rest" },
			tracking: "uses",
		},
		{
			featureName: "Projected Spore Zone",
			actionType: "Bonus action",
		},
	],
	"summoner--cosmic-conduit": [
		{
			featureName: "Absolute Cosmic Map",
			uses: { formula: "PB", recharge: "long-rest" },
			tracking: "uses",
		},
		{
			featureName: "Aetheric Starlight Form",
			resource: "Entity Shift use",
			tracking: "resource",
		},
		{
			featureName: "Cosmic Prophecy",
			actionType: "Reaction",
			uses: { formula: "PB", recharge: "long-rest" },
			tracking: "uses",
		},
	],
	"herald--restoration-mandate": [
		{
			featureName: "Absolute Resonance: Preserve Life",
			actionType: "Action",
		},
	],
	"herald--radiance-mandate": [
		{
			featureName: "Warding Spark",
			actionType: "Reaction",
			uses: { formula: "SENSE mod", recharge: "long-rest" },
			tracking: "uses",
		},
		{
			featureName: "Absolute Resonance: Radiance",
			actionType: "Action",
		},
		{ featureName: "Corona of the Absolute", actionType: "Action" },
	],
	"herald--combat-mandate": [
		{
			featureName: "Combat Herald",
			actionType: "Bonus action",
			uses: { formula: "SENSE mod", recharge: "long-rest" },
			tracking: "uses",
		},
		{
			featureName: "Absolute Resonance: Allied Blessing",
			actionType: "Reaction",
		},
	],
	"herald--knowledge-mandate": [
		{
			featureName: "Absolute Resonance: Ancient Insight",
			actionType: "Action",
		},
		{
			featureName: "Absolute Resonance: Aetheric Reader",
			actionType: "Action",
		},
	],
	"herald--storm-mandate": [
		{
			featureName: "Wrath of the Absolute",
			actionType: "Reaction",
			uses: { formula: "SENSE mod", recharge: "long-rest" },
			tracking: "uses",
		},
	],
	"herald--triage-mandate": [
		{
			featureName: "Aetheric Scanner",
			uses: { formula: "SENSE mod", recharge: "long-rest" },
			tracking: "uses",
		},
		{
			featureName: "Absolute Resonance: Essential Target",
			actionType: "Action",
		},
		{
			featureName: "Realignment Intervention",
			actionType: "Reaction",
			uses: { formula: "SENSE mod", recharge: "long-rest" },
			tracking: "uses",
		},
	],
	"idol--lore-resonance": [
		{
			featureName: "Cutting Remarks",
			actionType: "Reaction",
			resource: "1 Hype die",
			tracking: "resource",
		},
		{
			featureName: "Peerless Insight",
			resource: "1 Hype die",
			tracking: "resource",
		},
	],
	"idol--dance-resonance": [
		{
			featureName: "Dance Combat",
			resource: "1 Hype die",
			tracking: "resource",
		},
	],
	"idol--hypnotic-resonance": [
		{
			featureName: "Mantle of Awe",
			actionType: "Bonus action",
			resource: "1 Hype die",
			tracking: "resource",
		},
		{
			featureName: "Mantle of the Absolute",
			actionType: "Bonus action",
			uses: { formula: "1", recharge: "long-rest" },
			tracking: "uses",
		},
		{
			featureName: "Unbreakable Presence",
			actionType: "Bonus action",
			uses: { formula: "1", recharge: "short-rest" },
			tracking: "uses",
		},
	],
	"idol--blade-resonance": [
		{
			featureName: "Blade Flourish",
			resource: "1 Hype die",
			tracking: "resource",
		},
	],
	"idol--shadow-resonance": [
		{
			featureName: "Psychic Blades",
			resource: "1 Hype die",
			tracking: "resource",
		},
		{
			featureName: "Words of Terror",
			uses: { formula: "1", recharge: "short-rest" },
			tracking: "uses",
		},
		{
			featureName: "Mantle of Whispers",
			actionType: "Reaction / action",
			uses: { formula: "1", recharge: "short-rest" },
			tracking: "uses",
		},
		{
			featureName: "Absolute Shadow Lore",
			actionType: "Action",
			uses: { formula: "1", recharge: "long-rest" },
			tracking: "uses",
		},
	],
	"idol--genesis-resonance": [
		{
			featureName: "Resonance of Creation",
			actionType: "Action",
			uses: { formula: "1", recharge: "long-rest" },
			tracking: "uses",
		},
		{
			featureName: "Animating Rite",
			actionType: "Action",
			uses: { formula: "1", recharge: "long-rest" },
			tracking: "uses",
		},
	],
	"revenant--void-lord": [
		{
			featureName: "Execute the Withering",
			actionType: "Bonus action",
			resource: "2 Remnants",
			tracking: "resource",
		},
	],
	"revenant--wither-guard": [
		{ featureName: "Decree of the Hollow Throne", actionType: "Bonus action" },
		{ featureName: "Throne Ward", actionType: "Reaction" },
	],
	"revenant--entropy-blade": [
		{
			featureName: "Command the Risen",
			actionType: "Action",
			resource: "3 Remnants",
			tracking: "resource",
		},
		{ featureName: "Shepherd's Bond", actionType: "Reaction" },
		{
			featureName: "Corpse Harvest",
			actionType: "Bonus action",
			resource: "1 Remnant",
			tracking: "resource",
		},
	],
	"revenant--plague-weaver": [
		{ featureName: "Shroud of the Veil", actionType: "Bonus action" },
		{
			featureName: "Paralytic Dread",
			actionType: "Bonus action",
			resource: "1 Remnant",
			tracking: "resource",
		},
	],
	"revenant--threshold-walker": [
		{
			featureName: "Threshold Pull",
			actionType: "Reaction",
			resource: "1 Remnant",
			tracking: "resource",
		},
		{
			featureName: "Arbiter's Decree",
			actionType: "Action",
			uses: { formula: "1", recharge: "long-rest" },
			tracking: "uses",
		},
	],
	"stalker--umbral-hunter": [
		{ featureName: "Umbral Reflex", actionType: "Reaction" },
	],
	"stalker--rift-strider": [
		{ featureName: "Aetheric Striker", actionType: "Bonus action" },
		{
			featureName: "Ethereal Step",
			actionType: "Bonus action",
			uses: { formula: "1", recharge: "short-rest" },
			tracking: "uses",
		},
		{ featureName: "Absolute Defense (Rift)", actionType: "Reaction" },
	],
	"stalker--apex-slayer": [
		{
			featureName: "Absolute Sense",
			actionType: "Action",
			uses: { formula: "SENSE mod", recharge: "long-rest" },
			tracking: "uses",
		},
		{ featureName: "Slayer's Focus", actionType: "Bonus action" },
		{
			featureName: "Entity's Nemesis",
			actionType: "Reaction",
			uses: { formula: "1", recharge: "short-rest" },
			tracking: "uses",
		},
		{ featureName: "Slayer's Counter", actionType: "Reaction" },
	],
	"stalker--hive-synchronist": [
		{ featureName: "Writhing Tide", actionType: "Bonus action" },
		{
			featureName: "Hive Dispersal",
			actionType: "Reaction",
			uses: { formula: "1", recharge: "long-rest" },
			tracking: "uses",
		},
	],
	"technomancer--resonance-siege-design": [
		{ featureName: "Aetheric Resonator", actionType: "Action" },
	],
	"technomancer--synchronist-binary-design": [
		{
			featureName: "Aetheric Feedback",
			uses: { formula: "1", recharge: "short-rest" },
			tracking: "uses",
		},
	],
	"technomancer--aether-breacher-design": [
		{ featureName: "Absolute Suppression", actionType: "Action" },
		{
			featureName: "Mandate Realignment",
			actionType: "Reaction",
			uses: { formula: "1", recharge: "short-rest" },
			tracking: "uses",
		},
		{
			featureName: "Resonance Collapse",
			uses: { formula: "1", recharge: "long-rest" },
			tracking: "uses",
		},
	],
};

export const paths: Path[] = pathCatalog.map((path) => {
	const aliases = RECONCILED_PATH_ALIASES[path.id];
	const abilityMechanics = RECONCILED_PATH_ABILITY_MECHANICS[path.id];
	const featureMechanics = RECONCILED_PATH_FEATURE_MECHANICS[path.id];
	const caster = getPathCaster(path.id);
	const levelChoices = PATH_LEVEL_CHOICES[path.id];
	if (
		!aliases &&
		!abilityMechanics &&
		!featureMechanics &&
		!caster &&
		!levelChoices
	)
		return path;

	return {
		...path,
		...(aliases ? { aliases: [...aliases] } : {}),
		...(caster ? { spellcasting: caster.spellcasting } : {}),
		...(levelChoices ? { levelChoices: [...levelChoices] } : {}),
		features: path.features.map((feature) => {
			const mechanics = featureMechanics?.find(
				(candidate) => candidate.featureName === feature.name,
			);
			if (!mechanics) return feature;
			return {
				...feature,
				actionType: mechanics.actionType,
				uses: mechanics.uses,
				resource: mechanics.resource,
				tracking: mechanics.tracking,
			};
		}),
		abilities: path.abilities.map((ability) =>
			abilityMechanics && ability.name === abilityMechanics.abilityName
				? {
						...ability,
						recharge: undefined,
						level: abilityMechanics.level,
						actionType: abilityMechanics.actionType,
						uses: abilityMechanics.uses,
						resource: abilityMechanics.resource,
						tracking: abilityMechanics.tracking,
					}
				: ability,
		),
	};
});
