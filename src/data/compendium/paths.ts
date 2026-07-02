// Job Paths Compendium - Ascendant Compendium (84 Paths)
// 14 Jobs × 6 Paths each, unique SA identities with 5e-compatible mechanical backbone

interface Path {
	id: string;
	name: string;
	jobId: string;
	jobName: string;
	tier: 1 | 2 | 3;
	pathType: string;
	requirements: {
		level: number;
		abilities?: string[];
		skills?: string[];
		prerequisites?: string[];
	};
	description: string;
	features: { name: string; description: string; level: number }[];
	abilities: {
		name: string;
		description: string;
		recharge?: number;
		cost?: string;
	}[];
	stats: {
		primaryAttribute: string;
		secondaryAttribute?: string;
		bonusStats: {
			strength?: number;
			dexterity?: number;
			constitution?: number;
			intelligence?: number;
			wisdom?: number;
			charisma?: number;
		};
	};
	source: string;
	image?: string;
}

export const paths: Path[] = [
	{
		id: "destroyer--apex-predator",
		name: "Path of the Apex Predator",
		jobId: "destroyer",
		jobName: "Destroyer",
		tier: 2,
		pathType: "apex-predator",
		requirements: {
			level: 3,
			skills: ["Athletics"],
		},
		description:
			"The Apex Predator is the ultimate physical mandate of the Destroyer lineage — a recursive refinement of the Awakened's biological vessel into a tool of absolute lethality. In the modern era of Absolute containment, they are the supreme front-line anchors of high-rank guilds, their every movement a masterclass in optimized destructive intent. To walk this path is to accept that your muscles are no longer purely biological, but a perfected conductor for the Absolute's force.",
		features: [
			{
				name: "Absolute Lethality",
				description:
					"The Absolute's clarity widens your kill zone. Weapon attacks crit on 19-20.",
				level: 3,
			},
			{
				name: "Peak Conditioning",
				description:
					"Add half prof bonus (round up) to STR/AGI/VIT checks that don't already include prof. Running long jump +STR mod feet.",
				level: 7,
			},
			{
				name: "Secondary Discipline",
				description:
					"The Mandate unlocks a second combat discipline slot. Choose another Combat Discipline.",
				level: 10,
			},
			{
				name: "Expanded Kill Zone",
				description:
					"Your Aetheric Sight highlights deeper vulnerabilities. Weapon attacks crit on 18-20.",
				level: 15,
			},
			{
				name: "Auto-Repair Rite",
				description:
					"Start of each turn, the Absolute channels restorative mana: regain 5+VIT mod HP if at â‰¤ half HP and at least 1 HP.",
				level: 18,
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
			bonusStats: {
				strength: 2,
				constitution: 1,
			},
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
			skills: ["Athletics", "Insight"],
		},
		description:
			"The Tactician mandate is granted to those whose cognitive resonances can process battlefield echoes at speeds that defy conventional analysis. These are the Mandate architects of top-tier guilds and the strategic specialists of the Ascendant Bureau, treating every gate-boundary as a structural zone of calculated dominance. They do not just fight; they harmonize the local weave into a blueprint for victory, ensuring that no variable remains unaccounted for.",
		features: [
			{
				name: "Tactical Charge",
				description:
					"Learn 3 maneuvers, gain 4 tactical dice (d8). Regain on short/long rest. More maneuvers at 7,10,15. Dice: d10 at 10th, d12 at 18th.",
				level: 3,
			},
			{
				name: "Field Analysis",
				description:
					"Gain proficiency with one artisan's tools. Your Aetheric Vista analyzes construction and materials.",
				level: 3,
			},
			{
				name: "Threat Assessment",
				description:
					"1 minute observing outside combat: learn if equal/superior/inferior in two characteristics. Your Aetheric Sight compiles a threat profile.",
				level: 7,
			},
			{
				name: "Enhanced Tactical Dice",
				description:
					"Tactical dice upgrade to d10. Your combat patterns grow more precise.",
				level: 10,
			},
			{
				name: "Relentless Analysis",
				description:
					"Roll initiative with 0 tactical dice â†’ regain 1. The Absolute never stops observing.",
				level: 15,
			},
			{
				name: "Perfected Tactical Dice",
				description:
					"Tactical dice upgrade to d12. Your reads are so far ahead of the fight that opponents feel scripted.",
				level: 18,
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
			bonusStats: {
				strength: 2,
				intelligence: 1,
			},
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
			skills: ["Mana Flow"],
		},
		description:
			"The Spell Breaker mandate designates an Ascendant as the ultimate deterrent against hostile mana-manifestations. They have integrated the primordial threads of the Absolute directly into their weapon bonds, allowing them to channel anti-resonance frequencies through physical strikes. Often recruited by high-stakes containment units, they are the ones who traverse resonant storms to deliver the final, crushing blow to reality-warping entities.",
		features: [
			{
				name: "Weave-Combat Attunement",
				description:
					"Learn 2 Mage cantrips and 3 Mage spells (abjuration/evocation). INT casting, third-caster slots.",
				level: 3,
			},
			{
				name: "Aetheric Weapon Bond",
				description:
					"Bond 2 weapons with your soul-signature. Can't be disarmed; summon to hand as bonus action from same plane.",
				level: 3,
			},
			{
				name: "Aetheric-Strike Integration",
				description:
					"Cast a cantrip â†’ make one weapon attack as bonus action. Your Mandate syncs the two actions.",
				level: 7,
			},
			{
				name: "Mana Disruption",
				description:
					"On weapon hit, disrupt the target's mana pathways. Disadvantage on next save vs your spell before end of your next turn.",
				level: 10,
			},
			{
				name: "Burst Blink",
				description:
					"When you use Burst Rite, teleport up to 30 ft before or after the extra action.",
				level: 15,
			},
			{
				name: "Absolute Integration",
				description:
					"Cast a spell â†’ make one weapon attack as bonus action. Spell and blade become one harmonic resonance.",
				level: 18,
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
			bonusStats: {
				strength: 1,
				intelligence: 2,
			},
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
			skills: ["Athletics", "Intimidation"],
		},
		description:
			"The Bulwark is a living bastion of the Destroyer lineage, an Ascendant whose very presence generates a localized threat field anchored by Absolute-reinforced frames. In modern containment zones, they serve as the physical barriers that allow civilians to escape unstable gate boundaries. To face a Bulwark is to engage with an immovable force of nature that punishes any attempt to bypass its defensive perimeter.",
		features: [
			{
				name: "Threat Lock",
				description:
					"Melee hit marks creature until end of your next turn. Marked creature has disadvantage on attacks not targeting you. If it damages someone else, bonus action attack with advantage + half Destroyer level damage.",
				level: 3,
			},
			{
				name: "Reactive Shield",
				description:
					"Reaction: you or adjacent ally hit â†’ add 1d8 to AC. If still hit, target resists that damage. VIT mod uses/long rest.",
				level: 7,
			},
			{
				name: "Lockdown Zone",
				description:
					"Creatures provoke opportunity attacks when moving within your reach. Hit â†’ speed becomes 0. Nothing escapes your zone.",
				level: 10,
			},
			{
				name: "Battering Ram",
				description:
					"Move 10+ ft straight then attack â†’ STR save or knocked prone. Bonus action attack on prone.",
				level: 15,
			},
			{
				name: "Absolute Coverage",
				description:
					"Make opportunity attacks without using reaction (one per creature per turn, not on your turn). Your threat field is omnidirectional.",
				level: 18,
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
			bonusStats: {
				constitution: 2,
				strength: 1,
			},
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
			skills: ["Athletics", "Perception"],
		},
		description:
			"The Last Stand mandate is granted to survivors of catastrophic gate incidents who have learned to override their body's inherent mortal limiters. They fight with a transcendent, near-supernatural focus that fuels impossible last-second victories. These Destroyers do not recognize the concept of defeat; they simply channel the Absolute's emergency reserves to maintain lethality long after their physical forms should have failed.",
		features: [
			{
				name: "Limit Break",
				description:
					"Bonus action: override mortal limiters. Advantage on all weapon attacks + 5 temp HP until end of turn (10 at 10th, 15 at 15th). 3 uses/long rest.",
				level: 3,
			},
			{
				name: "Veteran's Composure",
				description:
					"Your control extends beyond combat. Add SENSE mod to Persuasion. Prof in SENSE saves.",
				level: 7,
			},
			{
				name: "Emergency Reserves",
				description:
					"Roll initiative with 0 Limit Break uses â†’ regain 1. The Absolute always has one more in reserve.",
				level: 10,
			},
			{
				name: "Accelerated Strike",
				description:
					"If you have advantage and hit, forgo advantage on one attack to make an additional attack. Once/turn.",
				level: 15,
			},
			{
				name: "Final Override",
				description:
					"At 0 HP, the Absolute grants one final burst. Take an entire extra turn immediately. Once/long rest.",
				level: 18,
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
			bonusStats: {
				strength: 2,
				wisdom: 1,
			},
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
			skills: ["Athletics", "Mana Flow"],
		},
		description:
			"The Path of the Aftershock is held by those whose strikes resonate with such intensity that the Absolute generates residual force iterations — temporal echoes of their movements from adjacent reflections. In the field, it manifests as multiple strikes resolving simultaneously from ghostly iterations. Footage of Aftershock Destroyers highlights the sheer visual overload of doubled impacts tearing through gate entities with absolute recursive power.",
		features: [
			{
				name: "Residual Strike",
				description:
					"Bonus action: generate a force hologram within 15 ft that mirrors your attacks. 1 HP, AC 14+prof. You can direct your weapon attacks from its position. Bonus action: reposition it (15 ft).",
				level: 3,
			},
			{
				name: "Recursive Strike",
				description:
					"On Attack action, one extra melee attack resolves from the iteration's position — the Absolute repeats your movement. VIT mod uses/long rest.",
				level: 3,
			},
			{
				name: "Holographic Recon",
				description:
					"Action: project the hologram up to 300 ft away for 10 min. See/hear through it; deafened/blinded at your body. Scout without risk.",
				level: 7,
			},
			{
				name: "Holographic Interception",
				description:
					"Reaction when ally within 30 ft is attacked: reposition hologram within 5 ft of ally. The attack targets the hologram instead.",
				level: 10,
			},
			{
				name: "Force Feedback",
				description:
					"Hologram destroyed by damage â†’ stored kinetic energy feeds back to you. Gain 2d6+VIT mod temp HP. VIT mod uses/long rest.",
				level: 15,
			},
			{
				name: "Dual Projection",
				description:
					"Generate two holograms. Impact Echo grants one extra attack from each hologram's position.",
				level: 18,
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
			bonusStats: {
				strength: 2,
				constitution: 1,
			},
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
			skills: ["Athletics", "Intimidation"],
		},
		description:
			"The Path of the Escalating Resonance is walked by those whose spirits vibrate with the most unstable aetheric frequencies. In the modern world, they are the high-octane headliners of underground fight clubs and elite gate-clearance units, where pain is not an obstacle but a catalyst. Each drop of blood spilled acts as a conductor for their internal mana, fueling a recursive cycle of violence that ends only when the enemy—or the Ascendant themselves—is thoroughly spent. They are living batteries of escalating fury, held together only by the Absolute's merciless mandate.",
		features: [
			{
				name: "Escalating Harmony",
				description:
					"While in Overload, your internal mana accelerates with each strike. Make a melee weapon attack as bonus action each turn. One exhaustion level when Overload ends as the physical vessel pays the price of the Absolute's favor.",
				level: 3,
			},
			{
				name: "Aetheric Static",
				description:
					"In Overload, the mana static in your body disruptions all external manipulation—psychic influences and supernatural charms can't penetrate the noise of your inner storm. Can't be charmed or frightened; existing effects suspended.",
				level: 6,
			},
			{
				name: "Aetheric Pressure",
				description:
					"Action: your mana field pulses outward like a gravity well—bystanders describe a weight that threatens to crush their souls. Frighten one creature within 30 ft (SENSE save 8+prof+STR). Extend each turn with action.",
				level: 10,
			},
			{
				name: "Recursive Feedback",
				description:
					"Reaction: when damaged by creature within 5 ft, the Absolute converts that kinetic energy into a counterstrike. Make melee attack against it.",
				level: 14,
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
			bonusStats: {
				strength: 2,
				constitution: 1,
			},
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
			skills: ["Gate Topology", "Survival"],
		},
		description:
			"The Gate Beast represents an Awakened who has harmonized their essence with the primal aetheric fauna found within the shadows of the Gates. They do not merely observe nature; they consume its most violent aspects to fuel their own ascendant power. In modern tactical guilds, they are the trackers and frontline skirmishers who can transition from human strategist to mindless predator in a heartbeat, channeling the echoes of ancient beasts to protect or destroy with animalistic clarity.",
		features: [
			{
				name: "Primal Aspect",
				description:
					"Tank-beast: resist all damage except psychic in Overload. Raptor: OAs have disadvantage vs you, Dash as bonus in Overload. Pack-leader: allies have advantage on melee vs creatures within 5 ft of you in Overload.",
				level: 3,
			},
			{
				name: "Biological Adaptation",
				description:
					"Tank-beast: double carry, advantage on STR push/pull. Raptor: see 1 mile, dim light no Perception penalty. Pack-leader: track at fast pace, stealth at normal.",
				level: 6,
			},
			{
				name: "Aetheric Commune",
				description:
					"Cast Commune with Nature as ritual; your resonance with the aetheric environment allows you to sense the absolute flow of the local area.",
				level: 10,
			},
			{
				name: "Apex Mandate",
				description:
					"Tank-beast: in Overload, enemies within 5 ft have disadvantage on attacks vs allies. Raptor: in Overload, fly speed = walk speed. Pack-leader: in Overload, bonus action knock Large-or-smaller prone on hit.",
				level: 14,
			},
		],
		abilities: [
			{
				name: "Territorial Roar",
				description:
					"All enemies in 30 ft: SENSE save or frightened 1 min. A minor manifestation of a primal gate beast spirit erupts from your soul. Once/long rest.",
				recharge: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Strength",
			secondaryAttribute: "Sense",
			bonusStats: {
				strength: 2,
				wisdom: 1,
			},
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
			skills: ["Athletics", "Dimensional Lore"],
		},
		description:
			"Those who walk the Path of the Mana Scars are living testaments to the Absolute's traumatic touch. Their bodies are maps of ancient gate-breaks and survived overloads, the luminous scar tissue acting as high-capacity conductors for defensive mana. While the modern world might see them as grizzled survivors of the first gate-age, their true purpose is to serve as the unbreakable anchors of a guild resonance, turning the pain of their history into the armor of the present.",
		features: [
			{
				name: "Erupting Scars",
				description:
					"In Overload, the first creature you strike each turn finds its hostile intent suppressed by the flare of your scars. Target has disadvantage on attacks not targeting you.",
				level: 3,
			},
			{
				name: "Luminous Barrier",
				description:
					"In Overload, ally within 30 ft takes damage â†’ reaction: your scars project an aetheric barrier, reducing damage by 2d6 (3d6 at 10th, 4d6 at 14th).",
				level: 6,
			},
			{
				name: "Primal Recall",
				description:
					"Your scars record every aetheric disturbance you've survived. Cast Clairvoyance as ritual—your scars resonate with the local weave to anchor environmental echoes from prior engagements.",
				level: 10,
			},
			{
				name: "Retaliatory Discharge",
				description:
					"When your Luminous Barrier activates, the aetheric discharge feeds back: the attacker takes force damage equal to the amount prevented.",
				level: 14,
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
			bonusStats: {
				strength: 2,
				constitution: 1,
			},
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
			skills: ["Athletics", "Gate Topology"],
		},
		description:
			"The Rift Storm represents an Ascendant who has survived the epicenter of a catastrophic gate-collapse and emerged saturated with raw, elemental mana. When they enter Overload, their internal energy vents as pure environmental turbulence—fire, lightning, or freezing cold radiating from their very pores. They are volatile assets, often deployed by elite containment units as a 'scorched earth' deterrent against massive gate-swarms where collateral damage is a secondary concern to survival.",
		features: [
			{
				name: "Aetheric Vent",
				description:
					"In Overload, your body vents primordial energy—car paint blisters near Inferno types, Tempest types trip circuit breakers, and Glacial types frost over nearby windows. 10-ft aura. Inferno: 2 fire/turn (scales). Tempest: bonus action 1d6 lightning, AGI half. Glacial: 2 temp HP/turn (scales).",
				level: 3,
			},
			{
				name: "Elemental Saturation",
				description:
					"Inferno: fire resist, immune extreme heat. Tempest: lightning resist, breathe underwater, 30 ft swim. Glacial: cold resist, immune extreme cold, move on ice freely.",
				level: 6,
			},
			{
				name: "Radiant Field",
				description:
					"Chosen creatures in aura gain your Elemental Saturation resistance. Your storm becomes a safe harbor for your allies.",
				level: 10,
			},
			{
				name: "Volatile Discharge",
				description:
					"Inferno: reaction when hit, fire = half level. Tempest: reaction, AGI save or prone. Glacial: bonus action, STR save or speed 0.",
				level: 14,
			},
		],
		abilities: [
			{
				name: "Storm Detonation",
				description:
					"30-ft radius, 4d8 damage (aura type), AGI half. The Absolute unleashed in a single, devastating burst. Once/long rest.",
				recharge: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Strength",
			secondaryAttribute: "Vitality",
			bonusStats: {
				strength: 2,
				constitution: 1,
			},
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
			skills: ["Athletics", "Cosmic Lore"],
		},
		description:
			"The Absolute Zealot is an Ascendant whose devotion to the primordial force transcended mere faith and became a physical anchor. They do not see their power as a 'connection' but as a divine mandate to be executed. Often seen leading extremist fellowships or streaming their gate-raids as grand aetheric sermons, they possess a terrifying resilience, as the Absolute itself seems to refuse their passing until their work is finished. To them, every strike is a prayer, and every kill is an offering.",
		features: [
			{
				name: "Absolute Wrath",
				description:
					"In Overload: your first hit each turn deals extra 1d6+half Berserker level radiant or necrotic damage. The Absolute punishes the unworthy through your vessel.",
				level: 3,
			},
			{
				name: "Chosen Vessel",
				description:
					"Spells restoring you to life don't require material components. The Absolute waives the cost of your return.",
				level: 3,
			},
			{
				name: "Unwavering Devotion",
				description:
					"Fail a save while in Overload â†’ reroll, must use new result. Your focus on the Absolute overrides failure. Once per Overload.",
				level: 6,
			},
			{
				name: "Rally the Faithful",
				description:
					"Bonus action: up to 10 creatures in 60 ft gain advantage on attacks and saves until start of your next turn. Once/long rest.",
				level: 10,
			},
			{
				name: "Overload Beyond Death",
				description:
					"In Overload at 0 HP: don't fall unconscious. Die only on 3 failed death saves, massive damage, or Overload ending at 0 HP. The Absolute refuses to let you stop.",
				level: 14,
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
			bonusStats: {
				strength: 2,
				constitution: 1,
			},
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
			skills: ["Athletics", "Mana Flow"],
		},
		description:
			"The Aetheric Anomaly is an Ascendant whose connection to the Absolute was shattered and reformed during a violent gate-collapse. They are walking anchors of instability whose every Overload triggers random, reality-warping discharges. While guilds often fear their unpredictability, they are prized for their ability to bypass conventional defensive measures and turn any battlefield into a chaotic domain where only they can truly thrive.",
		features: [
			{
				name: "Aetheric Detection",
				description:
					"Action: sense aetheric disturbancs, spells, or artifacts within 60 ft, identifying the fundamental resonance. Your anomalous connection reads ambient mana like a radar. Prof uses/long rest.",
				level: 3,
			},
			{
				name: "Anomaly Surge",
				description:
					"Enter Overload â†’ consult the Anomaly Surge Chart. Manifestations: shadow tendrils (1d12 force), teleport 30 ft, mana explosion, crystallized force weapon, or size increase.",
				level: 3,
			},
			{
				name: "Mana Transfusion",
				description:
					"Action touch: +1d3 to attacks/checks for 10 min, OR restore a spell slot â‰¤ d3 level. Your unstable core leaks utility. Prof uses/long rest.",
				level: 6,
			},
			{
				name: "Cascade Resonance",
				description:
					"Take damage or fail save while in Overload â†’ reaction to reroll the Anomaly Surge, replacing the current distortion with a new one.",
				level: 10,
			},
			{
				name: "Controlled Distortion",
				description:
					"Identify local Anomaly Surge variables twice, choose which manifestation to anchor. On a harmonic match, choose any effect from the chart.",
				level: 14,
			},
		],
		abilities: [
			{
				name: "Anomalous Detonation",
				description:
					"20-ft radius: 3d10 force, VIT half, random Anomaly Surge on each failure. Once/long rest.",
				recharge: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Strength",
			secondaryAttribute: "Vitality",
			bonusStats: {
				strength: 2,
				constitution: 1,
			},
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
			skills: ["Stealth", "Sleight of Hand"],
		},
		description:
			"A Gate Runner is an Ascendant whose essence has been tuned to the phase-spaces between the physical world and the Gates. They possess a fluidity of movement that allows them to slip through barriers—both physical and aetheric—as if they were nothing more than mist. In the modern world, they are the specialized assets recruited for high-stakes recovery operations and urgent scouting, moving through hostile territory with a grace that defies the Absolute's own laws of permanence.",
		features: [
			{
				name: "Aetheric Phase",
				description:
					"Phase Shift bonus action can also: Sleight of Hand check, use tools, or Use an Object. Your hands phase through pockets and locks via the primordial weave.",
				level: 3,
			},
			{
				name: "Veil Runner",
				description:
					"Climbing costs no extra movement. Running jump distance +AGI mod feet. You maintain a harmonic grip on any surface.",
				level: 3,
			},
			{
				name: "Unseen Resonance",
				description:
					"Advantage on Stealth if you move no more than half speed that turn. You become a literal shadow in the Absolute's eye.",
				level: 9,
			},
			{
				name: "Mandate Bypass",
				description:
					"Ignore all class, race, and level requirements on aetheric artifacts. Your phase-shifted hands interface with the core resonance of any object.",
				level: 13,
			},
			{
				name: "Continuity Split",
				description:
					"The Absolute allows you two turns in the first round of combat: normal initiative and initiative minus 10. You exist in two moments simultaneously.",
				level: 17,
			},
		],
		abilities: [
			{
				name: "Phase Grab",
				description:
					"Bonus action: phase your hand through a creature within 5 ft and steal a held/worn item (AGI save).",
				recharge: 1,
				cost: "Bonus action",
			},
		],
		stats: {
			primaryAttribute: "Agility",
			secondaryAttribute: "Intelligence",
			bonusStats: {
				dexterity: 2,
				intelligence: 1,
			},
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
			skills: ["Stealth", "Deception"],
		},
		description:
			"The Terminus mandate is reserved for those who embody the absolute finality of the reaper. They are the surgical edge of the Absolute, capable of delivering a clinical end to any existence with a single, unanswerable strike. In the modern world, they are the ghosts of the battlefield, their presence known only by the sudden, absolute silence they leave in their wake. When a Terminus marks a target, the Absolute itself acknowledges the inevitability of their transition.",
		features: [
			{
				name: "Mandated Tools",
				description:
					"Proficiency with disguise kits and alchemical tools. The fundamental assets of an inevitable end.",
				level: 3,
			},
			{
				name: "Initial Strike Rite",
				description:
					"Advantage on attacks vs creatures that haven't acted yet. Hits on surprised creatures are automatic critical hits.",
				level: 3,
			},
			{
				name: "Identity Weave",
				description:
					"Spend 7 days to create a false resonance—a fabricated identity recognized by the Absolute's weave, complete with documented history.",
				level: 9,
			},
			{
				name: "Deep Mimicry",
				description:
					"Mimic another person's speech, behavior, and aetheric resonance after 3 hours of study. Suspicious creatures have disadvantage on Insight to detect the facade.",
				level: 13,
			},
			{
				name: "The Final Rite",
				description:
					"Hit a surprised creature â†’ VIT save (8+AGI mod+prof) or damage is doubled. The Absolute confirms the termination.",
				level: 17,
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
			bonusStats: {
				dexterity: 2,
				constitution: 1,
			},
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
			skills: ["Stealth", "Mana Flow"],
		},
		description:
			"The Weave Infiltrator mandate allows an Ascendant to harmonize their phase-shifted essence with the primordial weave of the Absolute. They do not just hide; they exist within the static of the local mana-field, capable of intercepting aetheric flows and stealing the resonances of other casters mid-manifestation. In a world of complex gate-wards and magical defenses, they are the ultimate locksmiths of reality.",
		features: [
			{
				name: "Weave Intrusion",
				description:
					"Harmonic Hand + 2 Mage cantrips + 3 spells (enchantment/illusion). INT casting, third-caster slots.",
				level: 3,
			},
			{
				name: "Harmonic Hand Mastery",
				description:
					"Your aetheric hand can stow/retrieve objects, pick locks, and disarm traps at range via Sleight of Hand.",
				level: 3,
			},
			{
				name: "Phase Ambush",
				description:
					"Hidden when you cast â†’ target has disadvantage on saves vs that spell. You manifest your resonance from between dimensions.",
				level: 9,
			},
			{
				name: "Harmonic Distraction",
				description:
					"Bonus action: Aetheric hand distracts creature within 5 ft of it â†’ advantage on attacks vs that creature until end of turn.",
				level: 13,
			},
			{
				name: "Resonance Reclamation",
				description:
					"Reaction when targeted by spell: force INT save. Fail â†’ negate effect, steal the aetheric routine for 8 hours. Once/long rest.",
				level: 17,
			},
		],
		abilities: [
			{
				name: "Shadow Casting",
				description:
					"Cast a cantrip while hidden without revealing position. Add Exploit Weakness if it deals damage. Once/short rest.",
				recharge: 1,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Agility",
			secondaryAttribute: "Intelligence",
			bonusStats: {
				dexterity: 1,
				intelligence: 2,
			},
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
			skills: ["Insight", "Deception"],
		},
		description:
			"The Shadow Herald mandate is granted to those whose aetheric resonance allows them to perceive the 'echoes' of intent before they even manifest. They are the master strategists and information brokers of the high-tier guilds, weaving networks of intelligence from the fundamental static of the Absolute. In a world where a single secret can topple a corporation or clear a Gate, the Herald is the most valuable asset on any tactical roster.",
		features: [
			{
				name: "Mandated Network",
				description:
					"Prof in disguise kits, forgery kits, and gaming sets. Learn 2 languages. Your phase-shifted vocal cords can mimic any frequency.",
				level: 3,
			},
			{
				name: "Aetheric Coordination",
				description:
					"Help as bonus action. Help an ally attack â†’ target can be within 30 ft. You whisper tactical echoes through the primordial weave.",
				level: 3,
			},
			{
				name: "Mandate Profiling",
				description:
					"Observe 1 min: learn if equal/superior/inferior in two of INT/SENSE/PRE/class levels. Your Aetheric Sight compiles an unmasking dossier.",
				level: 9,
			},
			{
				name: "Echo Deflection",
				description:
					"Reaction when targeted while a creature gives cover: attack targets that creature instead. You phase into their shadow.",
				level: 13,
			},
			{
				name: "Sealed Resonance",
				description:
					"Thoughts unreadable by telepathy. Present false echoes. Advantage on Deception vs sensory discernment.",
				level: 17,
			},
		],
		abilities: [
			{
				name: "Coordinated Exploit",
				description:
					"Bonus action: designate target in 60 ft. Next ally to hit it adds your Exploit Weakness damage. Once/short rest.",
				recharge: 1,
				cost: "Bonus action",
			},
		],
		stats: {
			primaryAttribute: "Presence",
			secondaryAttribute: "Intelligence",
			bonusStats: {
				charisma: 2,
				intelligence: 1,
			},
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
			skills: ["Acrobatics", "Persuasion"],
		},
		description:
			"The Blade Dancer mandate designates an Ascendant who has mastered the lethal fluidity of phase-step combat. They do not merely fight; they move with an impossible, aetheric grace that makes every encounter look like a choreographed display of violence. In modern high-society duels and televised gate-raids, only the most skilled Dancers can maintain the frequency of the Absolute while moving through a sea of blades without a single scratch.",
		features: [
			{
				name: "Aetheric Footwork",
				description:
					"Melee attack a creature â†’ it can't make OAs against you for the rest of your turn. You phase-step past their guard effortlessly.",
				level: 3,
			},
			{
				name: "Mandated Audacity",
				description:
					"Add PRE mod to initiative. Exploit Weakness without advantage if no other creature within 5 ft of you (no disadvantage required).",
				level: 3,
			},
			{
				name: "Mesmerizing Resonance",
				description:
					"Action: Persuasion vs Insight. Win: hostile target is charmed (won't attack you), or friendly target has disadvantage attacking anyone but you. 1 min.",
				level: 9,
			},
			{
				name: "Graceful Realignment",
				description:
					"Bonus action: advantage on next Acrobatics or Athletics check this turn. Your essence corrects your form.",
				level: 13,
			},
			{
				name: "Harmonic Counter",
				description:
					"Miss with attack â†’ reroll with advantage. Your Aetheric Sight shows you the correct angle of insertion. Once/short rest.",
				level: 17,
			},
		],
		abilities: [
			{
				name: "Aetheric Riposte",
				description:
					"Reaction when creature misses you: phase-strike with Exploit Weakness damage. Once/short rest.",
				recharge: 1,
				cost: "Reaction",
			},
		],
		stats: {
			primaryAttribute: "Agility",
			secondaryAttribute: "Presence",
			bonusStats: {
				dexterity: 2,
				charisma: 1,
			},
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
			skills: ["Stealth", "Survival"],
		},
		description:
			"The Vanguard Outrider is the advance resonance of the mandate—the first to enter a Gate and the last to leave. They have mastered aetheric recon, using phase-shifted sonar to map hostile terrain and relay vital intel through the weave. In the modern world of gate containment, they are the indispensable scouts whose ability to survive behind enemy resonances ensures the success of every mission.",
		features: [
			{
				name: "Aetheric Skirmish",
				description:
					"Enemy ends turn within 5 ft â†’ reaction: phase-step half speed without provoking OAs.",
				level: 3,
			},
			{
				name: "Gate Specialist",
				description:
					"Prof in Nature and Survival with double proficiency bonus. Your Aetheric insight reads environment resonances instantly.",
				level: 3,
			},
			{
				name: "Mandated Mobility",
				description:
					"Walking speed +10 ft. Climbing/swimming speed +10 ft. Your phase-stepping augments all physical travel.",
				level: 9,
			},
			{
				name: "Aetheric Ambush",
				description:
					"Advantage on initiative. First creature you hit in round 1 has disadvantage on attacks vs you until start of your next turn.",
				level: 13,
			},
			{
				name: "Recursive Phase Strike",
				description:
					"Bonus action: deliver one additional attack from a phase-shifted angle. Can apply Exploit Weakness to a different target even if already used this turn.",
				level: 17,
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
			bonusStats: {
				dexterity: 2,
				wisdom: 1,
			},
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
			skills: ["Athletics", "Acrobatics"],
		},
		description:
			"The Path of the Kinetic Core is for those who treat their own body as a high-velocity conductor for the Absolute's power. They do not just strike; they release focused bursts of kinetic resonance that can shatter reinforced gates and liquefy the internals of the most durable entities. In the high-stakes world of gate suppression, they are the undisputed masters of frontline engagement, moving with a speed that leaves afterimages of aetheric fire in their wake.",
		features: [
			{
				name: "Kinetic Technique",
				description:
					"When you use Aetheric Pulse (Rapid Barrage), each strike can impose one: AGI save or prone; STR save or pushed 15 ft; or target can't take reactions until end of your next turn.",
				level: 3,
			},
			{
				name: "Harmonic Repair",
				description:
					"Action: channel aetheric energy inward to realign your physical vessel. Regain HP = 3 × Striker level. Once/long rest.",
				level: 6,
			},
			{
				name: "Aetheric Deterrence",
				description:
					"Your internal resonance passively deters aggression. End of long rest: gain Sanctuary effect until next long rest (save DC 8+SENSE mod+prof).",
				level: 11,
			},
			{
				name: "Resonance Palm",
				description:
					"Unarmed hit implants a kinetic vibration in the target's essence. Action to detonate: VIT save or reduced to 0 HP, success = 10d10 force damage.",
				level: 17,
			},
		],
		abilities: [
			{
				name: "Essence Lockdown",
				description:
					"VIT save or stunned until end of your next turn. 3 Impulse.",
				recharge: 0,
				cost: "3 Impulse",
			},
		],
		stats: {
			primaryAttribute: "Agility",
			secondaryAttribute: "Sense",
			bonusStats: {
				dexterity: 2,
				wisdom: 1,
			},
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
			skills: ["Stealth", "Acrobatics"],
		},
		description:
			"The Phantom Step mandate allows an Ascendant to route their physical existence through the low-frequency shadows of the local aether. They are the spectral legends of the gate-wars—flickers in a dark alley followed by the absolute collapse of a high-tier entity. They move not with speed, but with a displacement of reality, stepping through the darkness as if it were a physical gateway.",
		features: [
			{
				name: "Shadow Resonance",
				description:
					"2 Impulse: cast Darkness, Darkvision, Pass without Trace, or Silence through your aetheric network. Learn Minor Illusion cantrip.",
				level: 3,
			},
			{
				name: "Phantom Blink",
				description:
					"Bonus action in dim light/darkness: teleport 60 ft to another dim/dark space. Advantage on first melee attack before end of turn.",
				level: 6,
			},
			{
				name: "Shroud of the Absolute",
				description:
					"In dim light/darkness, action: your body phases to near-invisibility. Invisible until you attack, cast, or enter bright light.",
				level: 11,
			},
			{
				name: "Exploit Opening",
				description:
					"Reaction when creature within 5 ft is hit by someone else: deliver a free unarmed strike against it while its guard is shattered.",
				level: 17,
			},
		],
		abilities: [
			{
				name: "Phantom Barrage",
				description:
					"Teleport between up to 3 creatures within 60 ft, unarmed strike each. Start/end in dim light/darkness. 3 Impulse.",
				recharge: 0,
				cost: "3 Impulse",
			},
		],
		stats: {
			primaryAttribute: "Agility",
			secondaryAttribute: "Sense",
			bonusStats: {
				dexterity: 2,
				wisdom: 1,
			},
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
			skills: ["Acrobatics", "Gate Topology"],
		},
		description:
			"The Aetheric Channeler mandate transforms an Ascendant into a living environmental conductor. They do not just strike; they convert ambient aetheric energy into fundamental elemental forces—concussive gravity, thermal discharges, or high-intensity lightning. In the containment of a high-tier gate, they are the ultimate multi-role assets, capable of adapting their physical strikes to the specific weaknesses of any anomaly.",
		features: [
			{
				name: "Elemental Conversion",
				description:
					"Learn Aetheric Attunement + 1 elemental discipline. More at 6,11,17. Max spirit per discipline = half Striker level (round up).",
				level: 3,
			},
			{
				name: "Discipline Library",
				description:
					"Options: Thermal Fists (fire reach +10 ft), Concussive Blast (30 ft 3d10 force), Gravity Whip (30 ft pull 3d10), Thermal Wave (15-ft cone 3d6 fire, 2 spirit), etc.",
				level: 3,
			},
			{
				name: "Advanced Conversions",
				description:
					"6th: Essence Lock 3 spirit, Sonic Shatter 3 spirit. 11th: Thermal Detonation 4 spirit, Gravity Flight 4 spirit. 17th: Cryo Blast 6 spirit, Force Wall 5 spirit.",
				level: 6,
			},
			{
				name: "Conversion Mastery",
				description:
					"Spend 1 extra spirit point on a discipline to increase its save DC by 2. Your elemental output has been perfected.",
				level: 17,
			},
		],
		abilities: [
			{
				name: "Omni-Burst",
				description:
					"30-ft cone: 2d6 fire+2d6 cold+2d6 lightning+2d6 force. 5 Impulse.",
				recharge: 0,
				cost: "5 Impulse",
			},
		],
		stats: {
			primaryAttribute: "Agility",
			secondaryAttribute: "Sense",
			bonusStats: {
				dexterity: 1,
				wisdom: 2,
			},
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
			skills: ["Acrobatics", "Performance"],
		},
		description:
			"The Entropic Flow is walked by those whose internal aetheric gates fire in seemingly chaotic, unpredictable patterns. They do not fight with discipline, but with a fluidity that disregards the Absolute's logic. To an observer, they appear to be stumbling, tripping, and swaying through combat—yet every movement somehow lands a devastating blow or evades an impossible strike. They are the living embodiment of the 'unlucky' hit that always finds its mark.",
		features: [
			{
				name: "Erratic Resonance",
				description:
					"When you use Aetheric Pulse (Rapid Barrage): gain Disengage and +10 ft speed until end of turn. Your chaotic movement confuses all defenses.",
				level: 3,
			},
			{
				name: "Entropic Realignment",
				description:
					"Stand from prone = 5 ft. When missed with melee, spend 1 spirit point to redirect the attack to another creature within 5 ft. Your essence displaces the impact.",
				level: 6,
			},
			{
				name: "Harmonic Correction",
				description:
					"When you have disadvantage on check/attack/save, spend 2 Impulse to cancel it. The Absolute realigns to favor your chaos.",
				level: 11,
			},
			{
				name: "Cascade Assault",
				description:
					"Aetheric Pulse (Rapid Barrage): up to 3 additional attacks (5 total), each must target a different creature. Your displace body appears everywhere at once.",
				level: 17,
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
			bonusStats: {
				dexterity: 2,
				charisma: 1,
			},
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
			skills: ["Athletics", "Acrobatics"],
		},
		description:
			"The Blade Conductor mandate allows an Ascendant to extend their internal aetheric gates into physical steel. They do not just carry weapons; they bond with them, turning a simple blade into a high-frequency conductor for the Absolute's destructive frequency. In the elite academies of the modern world, Conductors are praised for their lethal precision and the harmonic 'hum' of their steel as it carves through reality.",
		features: [
			{
				name: "Aetheric Weapon Bond",
				description:
					"Choose 2 weapons (1 melee, 1 ranged, no heavy/special). They connect to your aetheric network and count as Striker weapons. Melee bonded weapon + unarmed in same turn = +2 AC. Ranged: 1 spirit point for +1d4+SENSE mod damage.",
				level: 3,
			},
			{
				name: "Harmonic Edge",
				description:
					"Bonded weapons count as magical and deal force damage. Keen Strike: 1 spirit point on bonded weapon hit = extra Spirit Combat die damage.",
				level: 6,
			},
			{
				name: "Resonance Honing",
				description:
					"Bonus action: spend 1-3 Impulse, granting your nonmagical bonded weapon an equal bonus to attack/damage for 1 min. You vibrate the blade at a molecular level.",
				level: 11,
			},
			{
				name: "Aetheric Alignment",
				description:
					"Miss with a bonded weapon on your turn â†’ your essence auto-adjusts. Reroll the attack. Once/turn.",
				level: 17,
			},
		],
		abilities: [
			{
				name: "Blade Tempest",
				description:
					"Attack every creature within 10 ft with bonded weapon. Each hit: weapon + 2 Spirit Combat dice. 4 Impulse.",
				recharge: 0,
				cost: "4 Impulse",
			},
		],
		stats: {
			primaryAttribute: "Agility",
			secondaryAttribute: "Sense",
			bonusStats: {
				dexterity: 2,
				wisdom: 1,
			},
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
			skills: ["Medicine", "Insight"],
		},
		description:
			"The Harmonic Surgeon mandate is granted to those whose understanding of aetheric pathways allows them to repair the physical vessel with a touch. In the modern world, they are the most critical members of any high-tier raid team, capable of shutting down enemy motor functions with clinical precision or realigning the broken essences of their allies mid-combat. They move with a cold, calculated efficiency that treats the battlefield as a triage unit.",
		features: [
			{
				name: "Mandated Insight",
				description: "Prof in Insight, Medicine, and alchemical kits.",
				level: 3,
			},
			{
				name: "Restorative Touch",
				description:
					"During Rapid Barrage: replace one strike with a restorative touch = 1 Spirit Combat die + SENSE mod HP restored. 1 spirit point to also end disease or debilitating conditions (blinded/deafened/paralyzed/poisoned/stunned).",
				level: 3,
			},
			{
				name: "Essence Shutdown",
				description:
					"During Rapid Barrage hit: spend 1 spirit point to deal extra necrotic damage = 1 Spirit Combat die + SENSE mod. Target's motor pathways seize—poisoned until the end of your next turn.",
				level: 3,
			},
			{
				name: "Advanced Harmonic Surgery",
				description:
					"Restorative Touch also ends frightened or charmed. Essence Shutdown: the motor seizure requires no save from the victim.",
				level: 6,
			},
			{
				name: "Surgical Barrage",
				description:
					"Replace each Rapid Barrage strike with Restorative Touch (no spirit cost for heal). Essence Shutdown once per turn without spending spirit.",
				level: 11,
			},
			{
				name: "Aetheric Resurrection",
				description:
					"Touch a creature that died within 24 hours: spend 5 Impulse to restart its internal resonance. Returns to life with 4d10+SENSE mod HP, cured of all physical conditions. Once/long rest.",
				level: 17,
			},
		],
		abilities: [
			{
				name: "Aetheric Heal",
				description:
					"Touch an ally: restore 2d8+SENSE mod HP and purge one condition by realigning their aetheric pathways. 2 Impulse.",
				recharge: 0,
				cost: "2 Impulse",
			},
		],
		stats: {
			primaryAttribute: "Sense",
			secondaryAttribute: "Agility",
			bonusStats: {
				wisdom: 2,
				dexterity: 1,
			},
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
			skills: ["Mana Flow"],
		},
		description:
			"The Detonation Specialist mandate is walked by those who treat aetheric energy as a raw, explosive substrate. They are the architects of controlled destruction, capable of weaving destructive mantras that bypass friendly resonances with surgical precision. In the high-stakes world of gate clearance, they serve as the heavy artillery, turning the local weave into a localized supernova of calculated fury.",
		features: [
			{
				name: "Precision Targeting",
				description:
					"When you cast a damage spell affecting an area, choose up to 1+spell level creatures. They auto-succeed on saves and take no damage. Your Aetheric Sight excludes friendly resonances.",
				level: 2,
			},
			{
				name: "Residual Discharge",
				description:
					"When a creature succeeds on a save against your cantrip, your weave still deals half damage. The Absolute ensures partial manifestation of your intent.",
				level: 6,
			},
			{
				name: "Harmonic Amplification",
				description:
					"Add INT mod to the damage of any destructive spell you cast. Your mantras are optimized for maximum yield.",
				level: 10,
			},
			{
				name: "Overloaded Mantras",
				description:
					"When you cast a 5th-level or lower damage spell, deal maximum damage. Use again before long rest: Absolute strain deals 2d12 necrotic per spell level to you (increases each use).",
				level: 14,
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
			bonusStats: {
				intelligence: 2,
				constitution: 1,
			},
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
			skills: ["Mana Flow"],
		},
		description:
			"The Shield Architect mandate is for those who view the weave of the Absolute as a protective barrier to be reinforced. They generate persistent aetheric shields that absorb damage and reject hostile manifestations. In a world where a single error can mean total annihilation, the Architect is the foundation of any successful suppression mission—the one whose continuous protection harmonics ensure the survival of the party.",
		features: [
			{
				name: "Aetheric Barrier",
				description:
					"When you manifest a protective spell of 1st+, generate a barrier with HP = 2×Mage level+INT mod. Damage to you hits the barrier first. Protective spells restore 2×spell level HP to the barrier.",
				level: 2,
			},
			{
				name: "Projected Shield",
				description:
					"Reaction: when a creature within 30 ft takes damage, your Aetheric Barrier absorbs it instead. You redirect your mandate remotely.",
				level: 6,
			},
			{
				name: "Optimized Wards",
				description:
					"Add prof bonus to ability checks for counter-manifestations (Counterspell, Dispel Magic). Your defensive weave is highly optimized.",
				level: 10,
			},
			{
				name: "Immunity Resonance",
				description:
					"Advantage on saves against spells. Resistance to spell damage. Your defensive resonance auto-filters hostile manifestations.",
				level: 14,
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
			bonusStats: {
				intelligence: 2,
				constitution: 1,
			},
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
			skills: ["Mana Flow", "Insight"],
		},
		description:
			"The Probability Mandate designates an Ascendant who has learned to perceive the underlying variables of the Absolute. They do not see the future as a vision, but as a series of calculated outcomes that can be anchored into reality. In the modern world, they are the indispensable strategists of any high-tier guild, capable of overriding unfavorable resonance-branches and ensuring the 'unlucky' moment never comes to pass.",
		features: [
			{
				name: "Aetheric Alignment",
				description:
					"After long rest, run 2 resonance calibrations (roll 2d20). You can substitute any attack/save/check made by you or a visible creature with one of these results.",
				level: 2,
			},
			{
				name: "Efficient Insight",
				description:
					"When you manifest a divination spell of 2nd+, the efficient resonance refunds essence: regain one spell slot of lower level (max 5th).",
				level: 6,
			},
			{
				name: "Oracle's Perception",
				description:
					"Action: activate one enhanced sensor until rest: darkvision 60 ft, see ethereal 60 ft, decipher any language, or detect invisible within 10 ft.",
				level: 10,
			},
			{
				name: "Master Computation",
				description:
					"Calculate 3 probabilities (roll 3d20) instead of 2. Your ability to anchor favorable outcomes is unsurpassed.",
				level: 14,
			},
		],
		abilities: [
			{
				name: "Mandate Override",
				description:
					"Force a creature to reroll any d20 and take the lower result. You override the local probability branch. Once/short rest.",
				recharge: 1,
				cost: "Reaction",
			},
		],
		stats: {
			primaryAttribute: "Intelligence",
			secondaryAttribute: "Sense",
			bonusStats: {
				intelligence: 2,
				wisdom: 1,
			},
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
			skills: ["Mana Flow", "Deception"],
		},
		description:
			"The Phantasmist mandate is walked by those who have mastered the art of weaving aetheric fakes so sophisticated that the Absolute itself accepts them as genuine resonance. They do not just create illusions; they inject false realities into the world, bypassing all senses to fool both sentient and anomalous threats. At their peak, their phantasms can manifest physical presence, proving that in the Absolute's eye, perception IS reality.",
		features: [
			{
				name: "Refined Projection",
				description:
					"Learn Minor Illusion cantrip. Can project both sound and image simultaneously in a single phantasm.",
				level: 2,
			},
			{
				name: "Phantasmal Editing",
				description:
					"When you manifest an illusion with 1+ min duration, use an action to dynamically alter its properties in real-time.",
				level: 6,
			},
			{
				name: "Echo Displacement",
				description:
					"Reaction when attacked: project an aetheric duplicate that causes the attack to miss. Your body was never where it seemed. Once/short rest.",
				level: 10,
			},
			{
				name: "Reality Anchoring",
				description:
					"When you manifest a 1st+ illusion, choose one inanimate object within it—it becomes genuinely real for 1 minute as the Absolute accepts the aetheric reflection.",
				level: 14,
			},
		],
		abilities: [
			{
				name: "Phantasmal Terrain",
				description:
					"Weave a 30-ft cube of illusory difficult terrain that feels real to all who enter. INT save to disbelieve. 1 min.",
				recharge: 2,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Intelligence",
			secondaryAttribute: "Presence",
			bonusStats: {
				intelligence: 2,
				charisma: 1,
			},
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
			skills: ["Mana Flow"],
		},
		description:
			"The Rift Caller mandate is for those who treat physical space as a mere suggestion. They specialize in tearing open micro-gates to pull matter from distant reaches or summon reinforcements from the Absolute's many reflections. In the modern world of gate-containment, they are the masters of logistics and tactical displacement, moving through reality via dimensional shortcuts that bypass all conventional defenses.",
		features: [
			{
				name: "Aetheric Rift",
				description:
					"Action: open a tiny rift and pull an inanimate object through. Lasts until you use this again or 1 hour passes.",
				level: 2,
			},
			{
				name: "Rift Step",
				description:
					"Action: teleport 30 ft, or swap positions with a willing Small/Medium creature within 30 ft. Once/long rest or until you manifest a conjuration spell.",
				level: 6,
			},
			{
				name: "Stabilized Rifts",
				description:
					"Your concentration on a rift-based spell can't be broken by physical damage. Your rifts are structurally reinforced by the Absolute.",
				level: 10,
			},
			{
				name: "Reinforced Summons",
				description:
					"Creatures pulled through your rifts arrive bolstered by 30 temp HP of raw aetheric energy.",
				level: 14,
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
			bonusStats: {
				intelligence: 2,
				constitution: 1,
			},
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
			skills: ["Mana Flow", "Investigation"],
		},
		description:
			"The Matter Weaver mandate allows an Ascendant to rewrite the fundamental physical properties of the local substrate. They treat the world as a programmable weave, capable of turning steel to glass or concrete to water with a single aetheric command. In the modern world of advanced alchemy and essence-cultivation, the Weaver is a priceless asset for both guild construction and tactical environmental manipulation.",
		features: [
			{
				name: "Material Realignment",
				description:
					"Spend 10 min to rewrite one material into another (woodâ†’stone, etc.). Reverts after 1 hour or if you use this again.",
				level: 2,
			},
			{
				name: "Aetheric Core",
				description:
					"Spend 8 hours to crystallize ambient mana into a core granting various buffs. Realignment of the core occurs when you manifest a transmutation spell.",
				level: 6,
			},
			{
				name: "Aetheric Bio-Transmutation",
				description:
					"Assume an animal form of CR 1 or lower. Once/short rest. Your body temporarily rewrites itself via the Absolute's mandate.",
				level: 10,
			},
			{
				name: "Master Weaver's Rite",
				description:
					"Destroy your Aetheric Core to trigger a grand realignment: purge conditions, raise the fallen, or reverse the aging of a vessel.",
				level: 14,
			},
		],
		abilities: [
			{
				name: "Molecular Override",
				description:
					"Touch an object and rewrite its composition for 1 hour. Once/short rest.",
				recharge: 1,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Intelligence",
			secondaryAttribute: "Sense",
			bonusStats: {
				intelligence: 2,
				wisdom: 1,
			},
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
			skills: ["Mana Flow"],
		},
		description:
			"The Aetheric Dragon mandate awakens in those whose anomalous resonance carries the signature of the primordial gate dragons—ancient masters of the Absolute who predated even the current cycle of Gates. Their spirit manifests as elemental fury, their very cells crystallizing into regent-tier mana-scales that hum with the power of a dying star. They are not merely casters; they are living manifestations of the Absolute's primal rage.",
		features: [
			{
				name: "regent-tier Resonance",
				description:
					"Choose an aetheric dragon type. Double prof bonus on PRE checks with regent-tier beings. Instinctively understand the ancient Primordial tongue.",
				level: 1,
			},
			{
				name: "Aetheric Scale Armor",
				description:
					"Aetheric mana reinforces your physical vessel. HP +1 per Esper level. Unarmored AC = 13+AGI mod.",
				level: 1,
			},
			{
				name: "Elemental Affinity",
				description:
					"When you manifest a spell matching your dragon's resonance, add PRE mod to the effect. Spend 1 Flux for resistance to that element for 1 hour.",
				level: 6,
			},
			{
				name: "Wings of the Absolute",
				description:
					"Bonus action: manifest wings of crystallized mana. Fly speed = walking speed. Last until dismissed.",
				level: 14,
			},
			{
				name: "regent-tier Mandate",
				description:
					"Action: 60-ft aura of regent-tier pressure. PRE save or charmed/frightened. 1 min, concentration. 5 Flux.",
				level: 18,
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
			bonusStats: {
				charisma: 2,
				constitution: 1,
			},
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
			skills: ["Mana Flow"],
		},
		description:
			"The Aetheric Cascade mandate is granted to those whose connection to the Absolute was shattered and reformed into a volatile reactive core. They do not just cast; they trigger cascading aetheric events that baffle traditional understanding. Each manifestation is a harmonic anomaly, a reality-warping discharge that can heal an ally or incinerate a foe with the same unpredictable fervor.",
		features: [
			{
				name: "Cascade Trigger",
				description:
					"After manifesting a 1st+ spell, the local Absolute weave may trigger a Cascade (d20). On 1, roll on the Aetheric Cascade table for a random discharge.",
				level: 1,
			},
			{
				name: "Riding the Cascade",
				description:
					"Lean into your instability. Gain advantage on one attack or check. The Absolute will demand a Cascade in return for this favor.",
				level: 1,
			},
			{
				name: "Probability Realignment",
				description:
					"Reaction: when a visible creature makes an attack or save, spend 2 Flux to roll 1d4 and adjust their result. You nudge the local fate-branch.",
				level: 6,
			},
			{
				name: "Selective Cascade",
				description:
					"When you roll on the Cascade table, roll twice and choose which manifestation to anchor into reality.",
				level: 14,
			},
			{
				name: "Absolute Chain Reaction",
				description:
					"When you roll max on a damage die for a spell, reroll that die and add to the total. Your internal reactor is chain-reacting.",
				level: 18,
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
			bonusStats: {
				charisma: 2,
				constitution: 1,
			},
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
			skills: ["Stealth", "Mana Flow"],
		},
		description:
			"Espers who draw power from the empty space between gate dimensions — the void that separates realities. They tend to be quiet, withdrawn individuals whose internal resonance focuses on the silence behind the Absolute's weave. Environmental fluctuations are common when they pass, and the shadows around them often seem to detach from their physical anchors. They command absolute darkness, summon void-born entities, and can dissolve their physical form into pure shadow-resonance.",
		features: [
			{
				name: "Void Sight",
				description:
					"Darkvision 120 ft. At 3rd level, cast Darkness for 2 flux and you can see through it — your eyes resonate with the void frequency.",
				level: 1,
			},
			{
				name: "Void Anchor",
				description:
					"When reduced to 0 HP (not by radiant or crit), PRE save DC 5+damage taken. Success: the void pulls you back. Drop to 1 HP instead. Once/long rest.",
				level: 1,
			},
			{
				name: "Void Hound",
				description:
					"Bonus action, 3 flux: manifest a shadow predator from the void that relentlessly pursues one creature. Target has disadvantage on saves vs your spells while the hound is within 5 ft.",
				level: 6,
			},
			{
				name: "Void Step",
				description:
					"Bonus action in dim light/darkness: step through the void. Teleport up to 120 ft to another dim/dark space.",
				level: 14,
			},
			{
				name: "Void Form",
				description:
					"6 flux, bonus action: dissolve into void-mana for 1 min. Resistance to all except force and radiant. Phase through creatures/objects. End turn in an object = 1d10 force.",
				level: 18,
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
			bonusStats: {
				charisma: 2,
				constitution: 1,
			},
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
			skills: ["Mana Flow", "Gate Topology"],
		},
		description:
			"The Path of the Tempest Core is for those whose anomalous resonance is synchronized with absolute atmospheric pressure. Lightning arcs from their skin during moments of high resonance-flux, wind shifts when they move, and environmental sensors fluctuate wildly in their presence. They are the living conduits of the Absolute's storms, their internal resonance-field powered by the very energy that structures a gate's atmosphere.",
		features: [
			{
				name: "Atmospheric Sense",
				description:
					"Speak, read, and write Primordial (and its dialects). You instinctively read weather and atmospheric pressure.",
				level: 1,
			},
			{
				name: "Storm Discharge",
				description:
					"Before or after casting a 1st+ spell, your flux discharges as wind — bonus action to fly 10 ft without provoking OAs.",
				level: 1,
			},
			{
				name: "Tempest Core",
				description:
					"Resistance to lightning and thunder. When you cast a 1st+ spell dealing lightning/thunder, arc lightning deals damage = half Esper level to creatures of your choice within 10 ft.",
				level: 6,
			},
			{
				name: "Weather Control",
				description:
					"If raining, stop rain in 20-ft sphere. Bonus action: control wind direction within 100 ft for 1 round.",
				level: 6,
			},
			{
				name: "Storm Retaliation",
				description:
					"Reaction when hit by melee: discharge lightning = Esper level and STR save or pushed 20 ft.",
				level: 14,
			},
			{
				name: "Eye of the Storm",
				description:
					"Immunity to lightning and thunder. 60-ft fly speed. Action: share flight (reduce to 30 ft for 1 hour, give up to 3+PRE mod creatures 30-ft fly).",
				level: 18,
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
			bonusStats: {
				charisma: 2,
				constitution: 1,
			},
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
			skills: ["Mana Flow", "Cosmic Lore"],
		},
		description:
			"Espers who carry a fragment of the Absolute's core energy — not mere gate mana, but the fundamental force itself. Often individuals whose innate empathy resonated with the restorative layers of the Absolute during their awakening, they access both destructive Esper resonance-flux and Herald restorative transmissions. They are the rarest anomaly type, serving as the ultimate stabilizers for high-tier containment missions.",
		features: [
			{
				name: "Dual Manifestation Access",
				description:
					"Learn one Herald transmission based on affinity (Restoration: Cure Wounds, Entropy: Inflict Wounds, Order: Bless, Chaos: Bane, Balance: Protection from Evil and Good). Access both Esper and Herald manifestation lists.",
				level: 1,
			},
			{
				name: "Absolute Favor",
				description:
					"When you fail a save or miss an attack, the Absolute nudges reality. Add 2d4 to the roll. Once/short rest.",
				level: 1,
			},
			{
				name: "Healing Amplification",
				description:
					"When you or ally within 5 ft rolls dice to heal with a spell, spend 1 flux to reroll any number of those dice. Once/turn.",
				level: 6,
			},
			{
				name: "Aetheric Wings",
				description:
					"Bonus action: manifest spectral wings of Absolute energy. 30-ft fly speed. Last until dismissed.",
				level: 14,
			},
			{
				name: "Emergency Restoration",
				description:
					"When below half HP, bonus action: the Absolute floods you with restorative energy. Regain HP = half your HP max. Once/long rest.",
				level: 18,
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
			bonusStats: {
				charisma: 2,
				wisdom: 1,
			},
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
			skills: ["Mana Flow", "Insight"],
		},
		description:
			"Espers touched by entities from beyond the known gate network — alien intelligences whose psionic imprint rewired their resonance during awakening. These Ascendants often perceive the Absolute not as a network of laws, but as a collective of interconnected consciousnesses that exist outside of traditional time. They cast with thought alone, their minds becoming an impenetrably alien echo of the Absolute's deepest layers.",
		features: [
			{
				name: "Psionic Imprint Spells",
				description:
					"Learn bonus spells at 1st,3rd,5th,7th,9th (Arms of Hadar, Calm Emotions, Hunger of Hadar, Evard's Black Tentacles, Telekinesis). Swap each for divination/enchantment.",
				level: 1,
			},
			{
				name: "Telepathic Link",
				description:
					"Bonus action: establish psionic link with one creature within 30 ft for Esper level minutes. Communicate in any known language via thought.",
				level: 1,
			},
			{
				name: "Psionic Casting",
				description:
					"Cast a psionic spell by spending flux = spell level instead of a slot. No verbal or somatic components — pure thought casting.",
				level: 6,
			},
			{
				name: "Psionic Hardening",
				description:
					"Resistance to psychic damage. Advantage on saves vs charmed/frightened. Your alien mind rejects intrusion.",
				level: 6,
			},
			{
				name: "Psionic Metamorphosis",
				description:
					"1+ flux, bonus action: reshape your body for 10 min. 1 pt: see invisible 60 ft. 1 pt: hover fly speed = walk. 1 pt: swim 2× walk + breathe water. 1 pt: compress body through 1-inch gaps.",
				level: 14,
			},
			{
				name: "Psionic Implosion",
				description:
					"Action: teleport 120 ft. Each creature within 30 ft of origin: STR save or 3d10 force + pulled to your old space. Success: half, no pull. Once/long rest or 5 flux.",
				level: 18,
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
			bonusStats: {
				charisma: 2,
				intelligence: 1,
			},
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
			skills: ["Mana Flow", "Medicine"],
		},
		description:
			"The Void Eater answers Marthos's hunger without restraint: entropy is not a tool but an appetite. Where other Revenants harvest the dying, the Void Eater hastens the dying, treating a wounded foe as a feast half-served. Their necrosis pours through the flimsy wards of the living, and every kill only sharpens the next. The Ascendant Bureau fields them when a gate must be emptied rather than held - the longer the fight lasts, the less of the enemy remains.",
		features: [
			{
				name: "Unresisted Decay",
				description:
					"Your necrotic damage ignores resistance, and a creature already below half its hit points has vulnerability to your necrotic damage.",
				level: 2,
			},
			{
				name: "Feast of the Fallen",
				description:
					"Once per turn, when a creature marked for the reaping drops to 0 hit points, you reclaim 2 Remnants instead of 1, and your next necrotic spell or power this turn deals additional necrotic damage equal to your Intelligence modifier.",
				level: 2,
			},
			{
				name: "Chain of Endings",
				description:
					"When you reduce a creature to 0 hit points with necrotic damage, entropy leaps to the nearest creature within 15 feet, dealing necrotic damage equal to your Revenant level and marking it for the reaping. If this reduces that creature to 0, the chain continues.",
				level: 6,
			},
			{
				name: "Execute the Withering",
				description:
					"As a bonus action, spend 2 Remnants to pass sentence on a creature marked for the reaping that is below one-quarter of its hit points: it must succeed on a Vitality save or drop to 0 hit points, taking 4d10 + your Intelligence modifier necrotic damage on a success instead.",
				level: 10,
			},
			{
				name: "Mass Annihilation",
				description:
					"Whenever you reduce a creature to 0 hit points with a necrotic spell or score a critical hit with one, every other creature marked for the reaping within 30 feet takes necrotic damage equal to half your Revenant level. Marks that survive are renewed.",
				level: 14,
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
			bonusStats: {
				intelligence: 3,
			},
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
			skills: ["Mana Flow", "Persuasion"],
		},
		description:
			"The Black Blood walks the oldest bargain of the End-Cycle: pay in your own life and entropy repays it tenfold. Their veins run with congealed Remnant-essence that they spend freely, wounding themselves to deepen the harvest and turning every blow they suffer into slow, crawling recovery. They are the Revenants who simply refuse to fall, buoyed by a tide of blood - their own and their enemies' - that never quite runs dry.",
		features: [
			{
				name: "Blood Price",
				description:
					"Once on each of your turns when you cast a spell or use a power, you may take necrotic damage equal to your Revenant level (this damage cannot be reduced or prevented) to add your Intelligence modifier to that ability's damage and mark each creature it hits for the reaping.",
				level: 2,
			},
			{
				name: "Crimson Leech",
				description:
					"Once per turn, when you deal necrotic damage to a creature marked for the reaping, you regain hit points equal to 1 + the number of Remnants you currently hold.",
				level: 2,
			},
			{
				name: "Wounds That Feed",
				description:
					"Whenever you take damage, you gain healing over time: at the start of each of your next two turns you regain hit points equal to half the damage taken, to a maximum of your Revenant level per turn.",
				level: 6,
			},
			{
				name: "Overflow",
				description:
					"Whenever healing would raise you above your hit point maximum, the excess becomes temporary hit points (up to your Intelligence modifier + your Revenant level) and you may immediately bank 1 Remnant.",
				level: 10,
			},
			{
				name: "Crimson Surge",
				description:
					"While you are below half your hit point maximum, your Crimson Leech healing doubles and your Blood Price costs no hit points. The nearer you stand to death, the more death sustains you.",
				level: 14,
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
			bonusStats: {
				intelligence: 2,
				constitution: 1,
			},
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
			skills: ["Mana Flow", "Athletics"],
		},
		description:
			"The Hollow King rules the front line from a throne of decay. They draw every eye and every blade, daring the enemy to spend itself against an entropy that cannot be outlasted. What strikes their allies, they take instead; what strikes them, they turn to dust. Marthos's mandate names them wardens of the threshold - the immovable dead who hold the breach while the living do their work behind.",
		features: [
			{
				name: "Decree of the Hollow Throne",
				description:
					"As a bonus action, exert your dread authority in a 15-foot aura until the start of your next turn: each enemy that starts its turn in the aura or enters it is marked for the reaping, and marked enemies have disadvantage on attack rolls against creatures other than you.",
				level: 2,
			},
			{
				name: "Throne Ward",
				description:
					"When a creature you can see within 10 feet takes damage, you can use your reaction to take that damage instead; you may then spend 1 Remnant to reduce it by 1d8 + your Vitality modifier.",
				level: 2,
			},
			{
				name: "Grave-Cold Presence",
				description:
					"Enemies marked by your Decree have their speed halved while inside the aura, and the first time each turn one of them hits you, it takes necrotic damage equal to your Intelligence modifier.",
				level: 6,
			},
			{
				name: "Unbreakable Vigil",
				description:
					"While at least one enemy is marked for the reaping, you have resistance to all damage dealt by marked creatures, and you cannot be moved, knocked prone, or banished against your will.",
				level: 10,
			},
			{
				name: "Crown of Cessation",
				description:
					"When you are reduced to half your hit point maximum or lower, your Decree aura expands to 30 feet and enemies marked within it must succeed on a Presence save or be unable to take reactions. The throne does not fall.",
				level: 14,
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
			bonusStats: {
				intelligence: 2,
				constitution: 1,
			},
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
			skills: ["Mana Flow", "Cosmic Lore"],
		},
		description:
			"The Grave Shepherd does on a battlefield what Marthos does on a cosmic scale: it reaps the fallen and sets them to work. Rather than scatter its harvest, the Shepherd binds a single great Remnant into an elite thrall - a risen champion stitched from the strongest dead - and commands it as an extension of its own will. Few in number but terrible in strength, the Shepherd's risen turn every casualty into a reinforcement.",
		features: [
			{
				name: "Command the Risen",
				description:
					"As an action, spend 3 Remnants to raise one elite thrall from a corpse or a creature marked for the reaping that died within the last minute. The thrall obeys you, acts on your turn, shares your necrotic resistance, and has hit points equal to five times your Revenant level. You may have one thrall at a time (two at 14th level).",
				level: 2,
			},
			{
				name: "Shepherd's Bond",
				description:
					"Your thrall uses your spell save DC and proficiency bonus. While it is within 30 feet of you, you may use your reaction to have it move up to its speed and make one attack, or interpose itself to take an attack aimed at you.",
				level: 2,
			},
			{
				name: "Corpse Harvest",
				description:
					"When a creature dies within 30 feet of you or your thrall, you may bank 1 Remnant and your thrall regains hit points equal to your Intelligence modifier. As a bonus action, spend 1 Remnant to empower the thrall: its next attack deals additional necrotic damage equal to your Revenant level.",
				level: 6,
			},
			{
				name: "Two-Soul Tether",
				description:
					"Your thrall may take two actions on each of its turns, and when it would drop to 0 hit points you may spend 1 Remnant to keep it at 1 hit point instead.",
				level: 10,
			},
			{
				name: "Legion of One",
				description:
					"You may command two elite thralls at once, and once per turn when a creature marked for the reaping dies you may raise it as a temporary lesser risen that acts until the end of your next turn at no Remnant cost.",
				level: 14,
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
			bonusStats: {
				intelligence: 3,
			},
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
			skills: ["Mana Flow", "Intimidation"],
		},
		description:
			"The Dread Veil wears Marthos's terror like a shroud. Where they walk, the Void-Breath thickens until the bravest find their hands shaking and their courage rotting from within. They need not strike a foe that has already surrendered to despair - and those who flee only die tired. Bureau handlers deploy the Veil to break a gate's defenders before a single real blow is struck.",
		features: [
			{
				name: "Shroud of the Veil",
				description:
					"As a bonus action, unfurl a 15-foot aura of dread until the start of your next turn. Each enemy that starts its turn in the aura must succeed on a Presence save or be frightened of you until the end of its next turn and marked for the reaping.",
				level: 2,
			},
			{
				name: "Withering Courage",
				description:
					"A creature frightened by you cannot take reactions, and the first time each turn it deals damage while frightened, that damage is reduced by your Intelligence modifier.",
				level: 2,
			},
			{
				name: "Paralytic Dread",
				description:
					"As a bonus action, spend 1 Remnant to lock a frightened creature you can see within 30 feet in place: its speed becomes 0 and it has disadvantage on saves to end the fear until the start of your next turn.",
				level: 6,
			},
			{
				name: "Contagion of Fear",
				description:
					"When a creature frightened by you fails a saving throw, the fear spreads: one other creature within 10 feet of it must succeed on a Presence save or also become frightened of you and marked for the reaping.",
				level: 10,
			},
			{
				name: "Terror Pulse",
				description:
					"When you reduce a frightened creature to 0 hit points, every enemy within 30 feet must succeed on a Presence save or become frightened of you until the end of their next turn. Frightened creatures have vulnerability to your necrotic damage.",
				level: 14,
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
			bonusStats: {
				intelligence: 2,
				charisma: 1,
			},
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
			skills: ["Mana Flow", "Insight"],
		},
		description:
			"The Threshold Walker stands where Marthos and Solara contend - on the exact line between the End-Cycle and the next dawn. Alone among Revenants, they can run the harvest backward, pouring reclaimed Remnants into failing allies and dragging the newly dead back across the threshold. To friends they are a cold mercy; to enemies, the hand that decides the moment has come.",
		features: [
			{
				name: "Reverse Entropy",
				description:
					"When you would deal necrotic damage with a spell or power, you may instead convert it to healing, restoring that many hit points divided as you choose among creatures within range.",
				level: 2,
			},
			{
				name: "Death-Sight",
				description:
					"You know the current hit points and any death-relevant conditions of every creature within 120 feet, and you always know which creatures are marked for the reaping.",
				level: 2,
			},
			{
				name: "Threshold Pull",
				description:
					"As a reaction when an ally within 30 feet drops to 0 hit points, spend 1 Remnant to bring them to 1 hit point and grant them temporary hit points equal to your Intelligence modifier + your Revenant level.",
				level: 6,
			},
			{
				name: "Mercy and Judgment",
				description:
					"Your Reverse Entropy healing adds your Intelligence modifier, and your necrotic damage against a creature below half its hit points increases by your Intelligence modifier. You ease allies on and enemies off the threshold with the same gesture.",
				level: 10,
			},
			{
				name: "Arbiter's Decree",
				description:
					"As an action, pass judgment on one creature within 30 feet: a creature dead no longer than 1 hour returns to life with hit points equal to your Revenant level + your Intelligence modifier, or a living creature must succeed on a Vitality save or take 10d8 necrotic damage as you shove it across the threshold. Once per long rest.",
				level: 14,
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
			bonusStats: {
				intelligence: 2,
				wisdom: 1,
			},
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
			skills: ["Gate Topology"],
		},
		description:
			"The Biome Architect mandate is held by those who have attained a perfect resonance with a specific gate ecosystem. They do not just survive; they recover their internal essence by absorbing ambient gate energy with an efficiency that borders on the miraculous. In the containment protocols of the modern world, the Architect is indispensable for identifying and stabilizing the volatile environments that bleed into our reality.",
		features: [
			{
				name: "Biome Insight",
				description:
					"Learn one additional Summoner mantra from your bonded biome.",
				level: 2,
			},
			{
				name: "Biome Absorption",
				description:
					"During a moment of stillness, absorb ambient gate energy: recover internal essence equivalent to half Summoner level. Once/long rest.",
				level: 2,
			},
			{
				name: "Biome Mantras",
				description:
					"Gain bonus always-prepared manifestations at 3rd, 5th, 7th, and 9th level based on your bonded gate biome (Arctic, Coastal, Desert, Forest, Grassland, Mountain, Swamp, or Subterranean).",
				level: 3,
			},
			{
				name: "Terrain Fluidity",
				description:
					"Moving through difficult terrain within a gate costs no extra effort. No damage from aetheric plants. Advantage on saves against magically manipulated flora.",
				level: 6,
			},
			{
				name: "Biome Adaptation",
				description:
					"Immune to poison and environmental disease. Your body has fully adapted to the Absolute's gate habitats.",
				level: 10,
			},
			{
				name: "Biome Sanctuary",
				description:
					"Manifesting part of the Absolute's ecosystem around you, beasts and plant entities choice another target. Your resonance marks you as part of the environment.",
				level: 14,
			},
		],
		abilities: [
			{
				name: "Biome Surge",
				description:
					"Channel the local gate energy: regain internal essence and gain advantage on environmental checks for 1 hour. Once/long rest.",
				recharge: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Sense",
			secondaryAttribute: "Vitality",
			bonusStats: {
				wisdom: 2,
				constitution: 1,
			},
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
			skills: ["Gate Topology", "Survival"],
		},
		description:
			"The Apex Shifter mandate is for those who seek to dominate their environment by assuming the physical vessels of the Absolute's apex predators. They do not merely shift; they undergo a total biological restructuring into powerful gate creatures that exceed all earthly limits. In the modern world, they are the front-line tanks who lead every raid, their very existence a bridge between human consciousness and absolute fury.",
		features: [
			{
				name: "Absolute Entity Shift",
				description:
					"Entity Shift as bonus action. While in gate creature form, spend aetheric essence to regain 1d8 HP per level.",
				level: 2,
			},
			{
				name: "Advanced Primordial Forms",
				description:
					"Entity Shift into gate creatures of CR 1 (CR = Summoner level / 3 at higher levels). At 6th level, attacks in entity form count as aetheric.",
				level: 2,
			},
			{
				name: "Aetheric-Laced Strikes",
				description:
					"Attacks in shifted form count as physical aether for overcoming resistance. Your vessel channels the Absolute through every blow.",
				level: 6,
			},
			{
				name: "Elemental Integration",
				description:
					"Assume the form of an elemental entity from the Absolute's reflection (Air, Earth, Fire, or Water).",
				level: 10,
			},
			{
				name: "Adaptive Physiology",
				description:
					"Manifest minor biological shifts at will. Your body retains the ability to optimize its vessel even between full Entity Shifts.",
				level: 14,
			},
		],
		abilities: [
			{
				name: "Apex Manifestation",
				description:
					"Shift into an apex gate entity for 1 hour. Retain all mandate access. Once/long rest.",
				recharge: 3,
				cost: "Bonus action",
			},
		],
		stats: {
			primaryAttribute: "Sense",
			secondaryAttribute: "Vitality",
			bonusStats: {
				wisdom: 2,
				constitution: 1,
			},
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
			skills: ["Gate Topology", "Insight"],
		},
		description:
			"The Dream Weaver mandate designates those who have forged a connection with the Lush-resonance—the restorative, semi-material reflections that drift along the boundaries of certain gates. They do not just heal; they manifest localized patches of aetheric stability that promote rapid biological repair. In the modern world, the Weaver is the emotional and physical anchor of any raid team, transforming a nightmare gate-break into a temporary sanctuary.",
		features: [
			{
				name: "Balm of the Absolute",
				description:
					"Pool of d6s = Summoner level. Bonus action: heal a creature within 120 ft by spending dice + 1 temp HP per die spent.",
				level: 2,
			},
			{
				name: "Sanctuary of Light and Shadow",
				description:
					"During a moment of rest, create a 30-ft sphere ward. Allies inside gain +5 to Stealth and Perception. All within the Absolute's rest.",
				level: 6,
			},
			{
				name: "Phantasmal Path",
				description:
					"Bonus action: teleport yourself or an ally within 30 ft to a visible location. SENSE mod uses/long rest.",
				level: 10,
			},
			{
				name: "Walker in Reflections",
				description:
					"After a rest, manifest Dream or Scrying without spending essence. Your connection to the Absolute allows for distant observation.",
				level: 14,
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
			bonusStats: {
				wisdom: 2,
				charisma: 1,
			},
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
			skills: ["Gate Topology", "Beast Taming"],
		},
		description:
			"The Pack Commander mandate elevates a Summoner to the status of an absolute leader within the gate's predatory hierarchy. They do not just summon entities; they command them like a unified tactical unit, reinforcing their creatures with their own internal aetheric essence. In the modern world, one Commander with a full menagerie is a one-person tactical squad, turning a solo raid into a coordinated absolute assault.",
		features: [
			{
				name: "Voice of the Absolute",
				description: "Manifest communication with all beasts of the Absolute.",
				level: 2,
			},
			{
				name: "Aetheric Totem",
				description:
					"Bonus action: manifest a totemic guardian (60-ft aura). Bear: allies gain temp HP and STR advantage. Hawk: allies gain Perception advantage. Unicorn: allies gain advantage on detection and enhanced restorative output.",
				level: 2,
			},
			{
				name: "Mighty Manifestation",
				description:
					"Entities you conjure gain +2 HP per hit die and their natural strikes count as aetheric.",
				level: 6,
			},
			{
				name: "Absolute Guardian",
				description:
					"Entities you summon that drop to 0 HP in your Totem aura instead regain half their HP max. The resonance refuses to let them fall.",
				level: 10,
			},
			{
				name: "Faithful Call",
				description:
					"When you drop to 0 HP, immediately conjure 4 gate predators of CR 2 or lower to defend you. Once/long rest.",
				level: 14,
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
			bonusStats: {
				wisdom: 2,
				constitution: 1,
			},
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
			skills: ["Gate Topology", "Medicine"],
		},
		description:
			"The Symbiotic Host mandate is given to those who have allowed their physical vessel to become a living ecosystem for mutualistic gate-organisms. They do not just host these symbiotes; they fuse with them to gain terrifying biological efficiencies and project a defensive field of aetheric spores. In the Absolute's cycle of life and death, the Host is the bridge where both processes occur simultaneously within the same body.",
		features: [
			{
				name: "Absolute Spore Cloud",
				description:
					"Reaction: creature within 10 ft must save or take necrotic damage. Your symbiotic colony reacts to perceived threats.",
				level: 2,
			},
			{
				name: "Host Fusion",
				description:
					"Expend Entity Shift to fuse with your colony. Gain temp HP = 4 × Summoner level. While fused, spore damage is absolute and strikes deal extra poison.",
				level: 2,
			},
			{
				name: "Colony Expansion",
				description:
					"Reaction when a creature falls within 10 ft: your symbiotes colonize the remnant. It rises to serve you for 1 hour. SENSE uses/long rest.",
				level: 6,
			},
			{
				name: "Projected Spore Zone",
				description:
					"While fused, bonus action: project your spore cloud as a mobile zone of entropic destruction.",
				level: 10,
			},
			{
				name: "Perfect Symbiosis",
				description:
					"Your colony protects all physical senses. Immune to blind, deaf, frighten, and poison. Crits against you are normalized by the colony's absorption.",
				level: 14,
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
			bonusStats: {
				wisdom: 2,
				constitution: 1,
			},
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
			skills: ["Mana Flow", "Gate Topology"],
		},
		description:
			"The Cosmic Conduit mandate is for those who draw power from the massive, distant aetheric vibrations that resonate through high-rank gates. They do not just see stars; they channel the fundamental cosmic energy of the Absolute into manifestations of healing, destruction, and prophetic anchoring. In the modern world, they are the supreme mystics of the gate-age, their every action informed by a variable cosmic map only they can perceive.",
		features: [
			{
				name: "Absolute Cosmic Map",
				description:
					"Learn one additional Summoner guidance. Cast Guiding Resonance without spending essence prof times/long rest.",
				level: 2,
			},
			{
				name: "Aetheric Starlight Form",
				description:
					"Expend Shift use to assume a starry form. Archer: bonus action ranged strike. Chalice: enhance all restorative manifestations. Dragon: stabilize internal focus for absolute precision.",
				level: 2,
			},
			{
				name: "Cosmic Prophecy",
				description:
					"Reaction: adjust a creature's result with a d6 (add or subtract). You nudge the local fate-variable. Prof uses/long rest.",
				level: 6,
			},
			{
				name: "Universal Alignment",
				description:
					"Starry Form effects are doubled. At the start of each turn, you can switch between forms as the Absolute realigns.",
				level: 10,
			},
			{
				name: "Star-Forged Vessel",
				description:
					"While in starry form, resistance to all physical damage from non-aetheric sources.",
				level: 14,
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
			bonusStats: {
				wisdom: 2,
				intelligence: 1,
			},
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
			skills: ["Medicine"],
		},
		description:
			"The Restoration Mandate designates those who channel the Absolute's most potent restorative resonance. They do not just heal; they stabilize the local reality-variable, ensuring that the physical vessel of their allies remains anchored in its most optimal state. In the modern world, the Restoration Herald is the supreme asset of any raid, their mere presence raising the survival probability of the entire collective.",
		features: [
			{
				name: "Absolute Proficiency",
				description: "Manifest proficiency with heavy armor.",
				level: 1,
			},
			{
				name: "Anchor of Life",
				description:
					"When you manifest a restorative mandate, the recipient regains additional HP = 2 + spell level.",
				level: 1,
			},
			{
				name: "Absolute Resonance: Preserve Life",
				description:
					"Action: distribute HP = 5× Herald level among creatures within 30 ft. You stabilize their local resonance.",
				level: 2,
			},
			{
				name: "Blessed Anchor",
				description:
					"When you manifest restorative energy on another, your own vessel regains HP = 2 + spell level.",
				level: 6,
			},
			{
				name: "Aetheric Strike",
				description:
					"Once per turn, weapon strikes deal extra 1d8 radiant damage.",
				level: 8,
			},
			{
				name: "Supreme Manifestation",
				description:
					"When you heal, usage of the Absolute's essence is normalized to its maximum efficiency for each die.",
				level: 17,
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
			bonusStats: {
				wisdom: 2,
				constitution: 1,
			},
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
			skills: ["Cosmic Lore"],
		},
		description:
			"The Radiance Mandate grants an Ascendant the ability to broadcast the Absolute's most destructive light resonance. Their presence is a beacon of pure aetheric energy, incinerating the void-remnants of the gates and shielding their allies in a protective luminance. In the modern world, a Radiance Herald is often the vanguard of any high-rank gate suppression, their radiant overloads visible from miles around.",
		features: [
			{
				name: "Absolute Light",
				description: "Learn one additional radiant mantra.",
				level: 1,
			},
			{
				name: "Warding Spark",
				description:
					"Reaction when targeted: manifest an aetheric flash to impose disadvantage. SENSE uses/long rest.",
				level: 1,
			},
			{
				name: "Absolute Resonance: Radiance",
				description:
					"Action: 30-ft radius — cleanse magical darkness, hostile entities take 2d10+Herald level radiant damage.",
				level: 2,
			},
			{
				name: "Improved Spark",
				description:
					"Warding Spark can protect allies within 30 ft, not just your own vessel.",
				level: 6,
			},
			{
				name: "Potent Resonance",
				description:
					"Add SENSE mod to the damage of your basic radiant mantras.",
				level: 8,
			},
			{
				name: "Corona of the Absolute",
				description:
					"Action: 60-ft absolute light aura. Enemies have disadvantage on saves against your fire/radiant manifestations for 1 min.",
				level: 17,
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
			bonusStats: {
				wisdom: 2,
				charisma: 1,
			},
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
			skills: ["Athletics", "Cosmic Lore"],
		},
		description:
			"The Combat Mandate is given to those who serve as the physical conduit for the Absolute's offensive transmissions. Armored, lethal, and broadcasting the martial directives of the Zenith lineage, they fight at the forefront of every gate eruption. They do not just support; they lead the charge, their weapon strikes resonating with the pure destructive intent of the Absolute.",
		features: [
			{
				name: "Absolute Proficiencies",
				description: "Proficiency with martial weapons and heavy armor.",
				level: 1,
			},
			{
				name: "Combat Herald",
				description:
					"When you take the Attack action, make one weapon strike as a bonus action. SENSE uses/long rest.",
				level: 1,
			},
			{
				name: "Absolute Resonance: Guided Strike",
				description:
					"When you strike, +10 to the roll. Declare your intent after the roll.",
				level: 2,
			},
			{
				name: "Absolute Resonance: Allied Blessing",
				description:
					"Reaction: ally within 30 ft strikes â†’ +10 to their roll as you realign their path.",
				level: 6,
			},
			{
				name: "Absolute Strike",
				description:
					"Once per turn, weapon strikes deal extra 1d8 damage of your weapon's type.",
				level: 8,
			},
			{
				name: "Avatar of the Absolute",
				description:
					"Resistance to all physical damage from non-aetheric sources.",
				level: 17,
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
			bonusStats: {
				wisdom: 2,
				strength: 1,
			},
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
			skills: ["Dimensional Lore", "Cosmic Lore"],
		},
		description:
			"The Knowledge Mandate provides an Ascendant with a direct uplink to the Absolute's primordial records. They do not just learn; they download encrypted knowledge that bypasses all mortal limitations, allowing them to read the aetheric signatures of enemies and objects with near-perfect accuracy. In the modern world, they are the supreme archivists and analysts, their transmissions revealing everything the gates seek to hide.",
		features: [
			{
				name: "Blessings of the Absolute",
				description:
					"Learn two additional languages. Double proficiency in two intelligence-based fields.",
				level: 1,
			},
			{
				name: "Absolute Resonance: Ancient Insight",
				description:
					"Action: gain proficiency with one tool or skill for 10 minutes as the Absolute realigns your vessel.",
				level: 2,
			},
			{
				name: "Absolute Resonance: Aetheric Reader",
				description:
					"Action: read the surface thoughts of a creature within 60 ft. If successful, you can also implant a minor directive.",
				level: 6,
			},
			{
				name: "Potent Manifestation",
				description: "Add SENSE mod to basic Herald mantra damage.",
				level: 8,
			},
			{
				name: "Visions of the Absolute",
				description:
					"Meditate to receive aetheric echoes of the past within an object or area.",
				level: 17,
			},
		],
		abilities: [
			{
				name: "Aetheric Query",
				description:
					"Request one specific detail from the Absolute about any creature, object, or location. Receive a truthful image or phrase. Once/long rest.",
				recharge: 3,
				cost: "Action (1 min)",
			},
		],
		stats: {
			primaryAttribute: "Sense",
			secondaryAttribute: "Intelligence",
			bonusStats: {
				wisdom: 2,
				intelligence: 1,
			},
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
			skills: ["Gate Topology", "Cosmic Lore"],
		},
		description:
			"The Storm Mandate empowers an Ascendant to broadcast the Absolute's most violent atmospheric resonance. They are walking thunderheads, their every gesture capable of summoning lightning and shattering the resolve of their foes. In the modern world, a Storm Herald is the ultimate deterrent, their radiant and electrical overloads enough to power entire city blocks or level them with equal ease.",
		features: [
			{
				name: "Absolute Proficiencies",
				description: "Proficiency with martial weapons and heavy armor.",
				level: 1,
			},
			{
				name: "Wrath of the Absolute",
				description:
					"Reaction when targeted in melee: manifest a lightning discharge for 2d8 damage. SENSE uses/long rest.",
				level: 1,
			},
			{
				name: "Absolute Resonance: Destructive Wrath",
				description:
					"When you manifest lightning or thunder, normalize the effect to its absolute maximum intensity.",
				level: 2,
			},
			{
				name: "Thunderbolt Strike",
				description:
					"When you deal lightning damage, you can physically push the recipient up to 10 ft.",
				level: 6,
			},
			{
				name: "Absolute Strike (Storm)",
				description:
					"Once per turn, weapon strikes deal extra 1d8 thunder damage.",
				level: 8,
			},
			{
				name: "Stormborn",
				description:
					"When outdoors, gain a flying speed equal to your walking speed as the Absolute lifts your vessel.",
				level: 17,
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
			bonusStats: {
				wisdom: 2,
				strength: 1,
			},
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
			skills: ["Medicine", "Cosmic Lore"],
		},
		description:
			"The Triage Mandate is for those who specialize in the Absolute's emergency field calibrations. They operate on a unique restorative resonance that maximizes output on critical vessels, marking targets for absolute elimination while canceling lethal blows through aetheric realignment. In the modern world, a Triage Herald's presence is the difference between a total wipe and an absolute victory.",
		features: [
			{
				name: "Absolute Triage",
				description:
					"When you manifest restorative energy on a creature at 0 HP, the Absolute normalize output to its maximum intensity.",
				level: 1,
			},
			{
				name: "Aetheric Scanner",
				description:
					"Identify void-entities and critically damaged vessels within 60 ft. SENSE uses/long rest.",
				level: 1,
			},
			{
				name: "Absolute Resonance: Essential Target",
				description:
					"Action: mark a creature for absolute elimination. The next attack against it deals double damage.",
				level: 2,
			},
			{
				name: "Realignment Intervention",
				description:
					"Reaction: when an ally suffers an absolute strike (crit), the Absolute intervenes — downgrade it to a normal strike. SENSE uses/long rest.",
				level: 6,
			},
			{
				name: "Enhanced Transmissions",
				description: "Add SENSE mod to the damage of basic Herald mantras.",
				level: 8,
			},
			{
				name: "Aetheric Recycling",
				description:
					"When an enemy falls, the Absolute recycles its residual resonance. You or an ally regain HP. Once per round.",
				level: 17,
			},
		],
		abilities: [
			{
				name: "Absolute Safeguard",
				description:
					"Touch: for 8 hours, the first time the recipient falls, the Absolute catches them at 1 HP instead. Once/long rest.",
				recharge: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Sense",
			secondaryAttribute: "Vitality",
			bonusStats: {
				wisdom: 2,
				constitution: 1,
			},
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
			skills: ["Mana Flow", "Deception"],
		},
		description:
			"The Glamour Weaver bargain is forged with the ethereal reflections that rule the Absolute's most vibrant gate ecosystems. They do not just deceive; they rewrite the sensory reality of those around them, weaving illusions of absolute beauty or terrifying despair. In the modern world, the Glamour Weaver is a master of social and physical manipulation, their presence alone enough to ensnare the unwary.",
		features: [
			{
				name: "Absolute Presence",
				description:
					"Action: creatures in a 10-ft cube must save or become charmed or frightened. Once/short rest.",
				level: 1,
			},
			{
				name: "Aetheric Escape",
				description:
					"Reaction when targeted: become invisible and teleport 60 ft as you dissolve into a mist of pure aether. Once/short rest.",
				level: 6,
			},
			{
				name: "Beguiling Resonance",
				description:
					"Absolute immunity to charm. When a creature attempts to influence you, you can redirect the resonance back upon them.",
				level: 10,
			},
			{
				name: "Phantasmal Delirium",
				description:
					"Action: trap a creature's consciousness in a misty reflection for 1 min. It perceives a reality of your choosing. Once/short rest.",
				level: 14,
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
			bonusStats: {
				charisma: 2,
				dexterity: 1,
			},
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
			skills: ["Mana Flow", "Intimidation"],
		},
		description:
			"The Infernal Conduit bargain is forged with the destructive entities that dwell within the deepest entropic layers of the gates. Their physical vessel burns with a literal internal heat, every kill feeding the insatiable hunger of their patron. In the modern world, the Infernal is a walking force of destruction, their aetheric bargain granting them the power to hurl foes through the void itself.",
		features: [
			{
				name: "Aetheric Siphon",
				description:
					"When you reduce an entity to 0 HP, siphon their residual resonance into temp HP.",
				level: 1,
			},
			{
				name: "Absolute Luck",
				description:
					"Realign your local fate-variable: add 1d10 to an ability check or save. Once/short rest.",
				level: 6,
			},
			{
				name: "Infernal Resilience",
				description:
					"Adapt your vessel to resist one specific damage type after each rest.",
				level: 10,
			},
			{
				name: "Hurl Through the Void",
				description:
					"On a successful strike, banish the recipient through a temporary entropic rift for 10d10 damage. Once/long rest.",
				level: 14,
			},
		],
		abilities: [
			{
				name: "Entropic Blast",
				description:
					"Channel a concentrated beam of void-energy: deal fire damage and ignite the recipient with aetheric flames. Once/short rest.",
				recharge: 1,
				cost: "Free",
			},
		],
		stats: {
			primaryAttribute: "Presence",
			secondaryAttribute: "Vitality",
			bonusStats: {
				charisma: 2,
				constitution: 1,
			},
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
			skills: ["Mana Flow", "Investigation"],
		},
		description:
			"The Void Whisperer bargain is forged with the vast, ancient intelligences that drift beyond the Absolute's primary resonance-layers. They do not just see the gates; they perceive the alien geometry of the multiverse, granting them psionic capabilities that shatter the fragile minds of their enemies. In the modern world, the Void Whisperer is a master of mental dominance and informational warfare.",
		features: [
			{
				name: "Absolute Resonance",
				description:
					"Telepathically communicate with any creature within 30 ft. No shared interface required.",
				level: 1,
			},
			{
				name: "Entropic Ward",
				description:
					"Reaction when targeted: impose disadvantage via a mental feedback loop. If they miss, your next strike gains advantage.",
				level: 6,
			},
			{
				name: "Aetheric Shield",
				description:
					"Immunity to mental intrusion and resistance to psychic damage. Any attempt to read your resonance results in a harmful backlash.",
				level: 10,
			},
			{
				name: "Absolute Thrall",
				description:
					"Subjugated an incapacitated entity to your will indefinitely. You maintain a permanent telepathic link regardless of distance.",
				level: 14,
			},
		],
		abilities: [
			{
				name: "Void Scream",
				description:
					"60-ft range: crush the target's consciousness with a burst of void-energy: 3d10 psychic + stun. Once/short rest.",
				recharge: 1,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Presence",
			secondaryAttribute: "Intelligence",
			bonusStats: {
				charisma: 2,
				intelligence: 1,
			},
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
			skills: ["Mana Flow", "Cosmic Lore"],
		},
		description:
			"The Radiant Vessel bargain is forged with the luminous entities of the Zenith lineage — beings of pure restorative and destructive light. They are the rarest of all Contractors, their physical vessel a conduit for aetheric energy that heals and incinerates with equal intensity. In the modern world, they are often seen as modern saints or supreme gate-raid anchors.",
		features: [
			{
				name: "Absolute Light",
				description: "Learn two additional radiant mantras.",
				level: 1,
			},
			{
				name: "Aetheric Radiance",
				description:
					"Pool of restorative energy = 1 + Contractor level. Bonus action: heal an ally within 60 ft.",
				level: 1,
			},
			{
				name: "Radiant Essence",
				description:
					"Resistance to radiant damage. Add your presence toward fire and radiant manifestations.",
				level: 6,
			},
			{
				name: "Absolute Resilience",
				description:
					"Grant temporary resonance/HP to yourself and up to 5 allies after every rest.",
				level: 10,
			},
			{
				name: "Searing Rebirth",
				description:
					"When your vessel is compromised (0 HP), immediately realign at half HP and blind all nearby foes with a radiant discharge. Once/long rest.",
				level: 14,
			},
		],
		abilities: [
			{
				name: "Radiant Discharge",
				description:
					"30-ft radius: 3d8 radiant damage + restorative output for all allies in range. Once/long rest.",
				recharge: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Presence",
			secondaryAttribute: "Sense",
			bonusStats: {
				charisma: 2,
				wisdom: 1,
			},
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
			skills: ["Mana Flow", "Athletics"],
		},
		description:
			"The Cursed Blade bargain is forged with the sentient, shadow-forged armaments found deep within the Absolute's highest-rank gates. They do not just wield a weapon; they are bonded to a physical manifestation of their patron's hunger. In the modern world, the Cursed Blade is a lethal martial specialist, their every strike fueled by an ancient aetheric curse that consumes the resonance of their victims.",
		features: [
			{
				name: "Absolute Curse",
				description:
					"Bonus action: curse a creature for 1 min. You gain extra damage and critical focus against them.",
				level: 1,
			},
			{
				name: "Aetheric Duelist",
				description:
					"Proficiency with all martial armaments. Your offensive output is governed by your sheer presence alone.",
				level: 1,
			},
			{
				name: "Aetheric Remnant",
				description:
					"When you slay an entity, manifest its residual resonance as a spectral sentinel under your command. Once/long rest.",
				level: 6,
			},
			{
				name: "Absolute Deflection",
				description:
					"If your cursed target strikes you, the Absolute realigns the blow to miss. 50% probability.",
				level: 10,
			},
			{
				name: "Cycle of the Curse",
				description:
					"When your cursed target falls, the Absolute immediately transfers the curse to another nearby entity.",
				level: 14,
			},
		],
		abilities: [
			{
				name: "Shadow Manifest",
				description:
					"Conjure a physical blade of pure void-essence for 1 min. It deals psychic damage and grants advantage in shadow.",
				recharge: 0,
				cost: "Aetheric slot",
			},
		],
		stats: {
			primaryAttribute: "Presence",
			secondaryAttribute: "Strength",
			bonusStats: {
				charisma: 2,
				strength: 1,
			},
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
			skills: ["Mana Flow", "Gate Topology"],
		},
		description:
			"The Deep Dweller bargain is forged with the colossal, kraken-like entities that rule the Absolute's submerged gate dimensions. They are masters of the crushing pressure and freezing cold found at the boundaries of the aetheric abyss, manifesting spectral tentacles and dimensional rifts at will. In the modern world, they are the undisputed masters of coastal and underwater gate containment.",
		features: [
			{
				name: "Tentacle of the Absolute",
				description:
					"Bonus action: summon a spectral tentacle to strike foes and reduce their movement. Once/short rest.",
				level: 1,
			},
			{
				name: "Deep Adaptation",
				description:
					"Manifest a 40-ft swim speed and absolute breath stability.",
				level: 1,
			},
			{
				name: "Aetheric Soul (Deep)",
				description: "Resistance to cold and absolute clarity underwater.",
				level: 6,
			},
			{
				name: "Absolute Coil",
				description:
					"Reaction: your tentacles reduce the impact of incoming strikes for yourself and nearby allies.",
				level: 6,
			},
			{
				name: "Void Tentacles",
				description:
					"Manifest a massive field of aetheric tentacles to restrain and consume all entities in the area. Once/long rest.",
				level: 10,
			},
			{
				name: "Abyssal Plunge",
				description:
					"Teleport several entities through a body of water within 1 mile.",
				level: 14,
			},
		],
		abilities: [
			{
				name: "Crushing Resonance",
				description:
					"60-ft radius: creatures are restrained by absolute pressure and take 3d8 cold damage. Once/long rest.",
				recharge: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Presence",
			secondaryAttribute: "Vitality",
			bonusStats: {
				charisma: 2,
				constitution: 1,
			},
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
			skills: ["Survival", "Perception"],
		},
		description:
			"The Apex Ascendant mandate is held by those who have mastered the art of exploiting the physical vulnerabilities of the Absolute's most dangerous entities. They do not just hunt; they analyze the aetheric structure of their prey, adapting their strikes to counteract specific threat profiles. In the modern world, the Apex Ascendant is the supreme field operative, capable of neutralizing entities that ignore conventional force.",
		features: [
			{
				name: "Ascendant's Resonance",
				description:
					"Choose one specialty: Giant Slayer (extra damage vs large entities), Horde Breaker (additional strikes vs multiple targets), or Absolute Will (advantage against mental intrusion).",
				level: 3,
			},
			{
				name: "Evasive Resilience",
				description:
					"Choose a defensive adaptation: Multi-target Defense (+4 AC after being hit) or Aetheric Escape (disadvantage on strikes against you).",
				level: 7,
			},
			{
				name: "Absolute Multi-strike",
				description:
					"Choose an offensive manifestation: Volley (ranged aether-burst) or Whirlwind (melee aether-burst).",
				level: 11,
			},
			{
				name: "Apex Defense",
				description:
					"Choose a supreme adaptation: Evasion (negate aetheric saves), Redirect (return missed strikes), or Uncanny Reflexes (halve incoming force).",
				level: 15,
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
			bonusStats: {
				dexterity: 2,
				wisdom: 1,
			},
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
			skills: ["Beast Taming", "Gate Topology"],
		},
		description:
			"The Pack Leader mandate is for those who forge deep aetheric bonds with the Absolute's apex predators. They do not just hunt alongside their companion; they fuse their hunting instincts into a single, coordinated absolute strikes that dominate the battlefield. In the modern world, the Pack Leader is a one-person tactical unit, their bonded entity often as famous and lethal as the Stalker themselves.",
		features: [
			{
				name: "Absolute Companion",
				description:
					"Bond with a high-resonance entity (Predator of the Land, Sea, or Sky). It shares your initiative and acts as an extension of your own will.",
				level: 3,
			},
			{
				name: "Advanced Resonance",
				description:
					"Your companion's natural strikes count as aetheric. It can Dash, Disengage, or Support as part of your offensive manifestations.",
				level: 7,
			},
			{
				name: "Primal Fury",
				description:
					"When you command your companion to strike, it unleashes two absolute attacks.",
				level: 11,
			},
			{
				name: "Shared Resonance",
				description:
					"When you manifest a personal adaptation, your companion also benefits from the Absolute's blessing.",
				level: 15,
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
			bonusStats: {
				dexterity: 2,
				wisdom: 1,
			},
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
			skills: ["Stealth", "Perception"],
		},
		description:
			"The Umbral Ascendant mandate is for those who have mastered the zero-light resonance of the highest-rank gates. They do not just hide in shadow; they become one with the void, manifesting as an invisible predator that strikes with absolute lethality from the darkness. In the modern world, the Umbral Ascendant is the supreme assassin of the Stalker lineage, their very existence a ghost story in the halls of the Absolute.",
		features: [
			{
				name: "Absolute Ambush",
				description:
					"First round: +SENSE to initiative, walking speed +10 ft, and one additional strike for extra damage.",
				level: 3,
			},
			{
				name: "Umbral Sight",
				description:
					"Mastery of darkness. While in shadow, you are invisible to all creatures that rely on aetheric or physical sight.",
				level: 3,
			},
			{
				name: "Void-Minded",
				description:
					"Proficiency in SENSE saves. Your vessel is hardened against mental instability.",
				level: 7,
			},
			{
				name: "Ascendant's Flurry",
				description:
					"If your strike misses, the Absolute realigns your path for an immediate follow-up strike.",
				level: 11,
			},
			{
				name: "Umbral Reflex",
				description:
					"Reaction when targeted: impose disadvantage via a momentary lapse into the void.",
				level: 15,
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
			bonusStats: {
				dexterity: 2,
				wisdom: 1,
			},
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
			skills: ["Mana Flow", "Survival"],
		},
		description:
			"The Rift Strider mandate empowers a Stalker to navigate the precarious boundaries between gate dimensions. They do not just track prey; they step through micro-rifts in reality, manifesting across the battlefield with a frightening fluidity. In the modern world, the Rift Strider is the supreme interceptor, their ability to seal dimensional crossings and strike through space making them an indispensable asset.",
		features: [
			{
				name: "Detect Rift",
				description:
					"Sense the distance and direction to the closest aetheric rift within 1 mile.",
				level: 3,
			},
			{
				name: "Aetheric Striker",
				description:
					"Bonus action: your strikes deal extra force damage as you channel the Absolute's primal energy.",
				level: 3,
			},
			{
				name: "Ethereal Step",
				description:
					"Bonus action: step into the aetheric reflection for 1 round. Move through objects and entities. Once/short rest.",
				level: 7,
			},
			{
				name: "Distant Strike",
				description:
					"When you strike, teleport 10 ft before each manifestation. If you strike multiple foes, gain one additional strike.",
				level: 11,
			},
			{
				name: "Absolute Defense (Rift)",
				description:
					"Reaction when targeted: gain resistance to the incoming force as you partially transition between planes.",
				level: 15,
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
			bonusStats: {
				dexterity: 2,
				wisdom: 1,
			},
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
			skills: ["Investigation", "Survival"],
		},
		description:
			"The Apex Slayer mandate is given to those who obsessively study the absolute weaknesses of their prey. They do not just hunt; they deconstruct, learning to counter every aetheric ability and exploit every biological flaw of high-rank gate entities. In the modern world, the Apex Slayer is the ultimate boss-killer, their analytical focus turning a nightmare encounter into a systematic elimination.",
		features: [
			{
				name: "Absolute Sense",
				description:
					"Action: learn an entity's resistances, vulnerabilities, and immunities. SENSE uses/long rest.",
				level: 3,
			},
			{
				name: "Slayer's Focus",
				description:
					"Bonus action: designate a target. Your first strike each turn deals additional damage until it falls.",
				level: 3,
			},
			{
				name: "Supernatural Adaptation",
				description:
					"When your target forces a save, add 1d6 to your result via aetheric prediction.",
				level: 7,
			},
			{
				name: "Entity's Nemesis",
				description:
					"Reaction when an entity manifests power or teleports: SENSE save or the effect is negated. Once/short rest.",
				level: 11,
			},
			{
				name: "Slayer's Counter",
				description:
					"Reaction when your target forces a save: make an immediate strike. If successful, you auto-succeed on the save.",
				level: 15,
			},
		],
		abilities: [
			{
				name: "Exploit Vulnerability",
				description:
					"After sensing a target, your strikes ignore all resistances and treat immunities as resistance for 1 min. Once/long rest.",
				recharge: 3,
				cost: "Free",
			},
		],
		stats: {
			primaryAttribute: "Agility",
			secondaryAttribute: "Sense",
			bonusStats: {
				dexterity: 2,
				wisdom: 1,
			},
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
			skills: ["Gate Topology", "Survival"],
		},
		description:
			"The Hive Synchronist mandate designates those who have bonded with a living swarm of gate-microorganisms. They do not just carry a hive; they are a walking ecosystem, their swarm enhancing every offensive manifestation and providing absolute mobility via aethertic levitation. In the modern world, the Synchronist is a terrifyingly efficient field operative, their presence denoted by a permanent cloud of aetheric static.",
		features: [
			{
				name: "Gathered Hive",
				description:
					"Once per turn on a strike: your hive deals extra damage, pushes the target, or realigns your own position.",
				level: 3,
			},
			{
				name: "Hive Manifestations",
				description:
					"Learn bonus absolute mandates: Aetheric Glow, Web, Gaseous Form, Aetheric Eye, and Hive Plague.",
				level: 3,
			},
			{
				name: "Writhing Tide",
				description:
					"Bonus action: the hive lifts you, granting an aetheric fly speed (hover) for 1 min.",
				level: 7,
			},
			{
				name: "Apex Hive",
				description:
					"Your gathered hive damage is normalized to its maximum efficiency. Pushed targets are knocked prone.",
				level: 11,
			},
			{
				name: "Hive Dispersal",
				description:
					"Reaction when targeted: dissolve into the hive, granting resistance and teleporting to a safe reflection. Once/long rest.",
				level: 15,
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
			bonusStats: {
				dexterity: 2,
				wisdom: 1,
			},
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
			skills: ["Cosmic Lore"],
		},
		description:
			"The Absolute Devotion mandate designates those who are the physical paragons of the Absolute's primary resonance. They do not just follow a code; they become a walking anchor for the restorative and protective frequencies of the Zenith lineage, their presence alone stabilizing the local reality of their allies. In the modern world, the Devotion Knight is the ultimate frontline leader, their absolute faith manifesting as physical aetheric armaments.",
		features: [
			{
				name: "Absolute Resonance: Sacred Armament",
				description:
					"Bonus action: manifest your weapon as an extension of the Absolute for 1 min. Add your presence toward its strikes.",
				level: 3,
			},
			{
				name: "Absolute Resonance: Purge Entropic",
				description:
					"Action: entities of the void and entropic remnants must save or be banished from your presence for 1 min.",
				level: 3,
			},
			{
				name: "Aura of Devotion",
				description:
					"You and allies within 10 ft are anchored against mental intrusion while your vessel is active.",
				level: 7,
			},
			{
				name: "Purity of the Absolute",
				description:
					"Your vessel is permanently anchored against all harmful planar influences.",
				level: 15,
			},
			{
				name: "Absolute Nimbus",
				description:
					"Action: manifest a 30-ft aura of absolute light for 1 min. Enemies take 10 radiant damage at the start of their turn. Once/long rest.",
				level: 20,
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
			bonusStats: {
				strength: 2,
				charisma: 1,
			},
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
			skills: ["Intimidation"],
		},
		description:
			"The Retribution Mandate is held by those who have sacrificed their defensive stability for the absolute destruction of their foes. They do not just strike; they exact a toll for every transgression against the Absolute, pursuing their targets with a relentless aetheric fury that cannot be outrun. In the modern world, the Retribution Knight is a lethal specialist, their covenant burning with the righteous hunger for absolute realignment.",
		features: [
			{
				name: "Absolute Resonance: Banish Foe",
				description:
					"Action: one entity within 60 ft must save or be terrified and rooted to its current reflection for 1 min.",
				level: 3,
			},
			{
				name: "Absolute Resonance: Directive of Enmity",
				description:
					"Bonus action: gain absolute focus (advantage) on strikes against one entity within 10 ft for 1 min.",
				level: 3,
			},
			{
				name: "Relentless Avenger",
				description:
					"When you land an opportunistic strike, immediately realign your position by moving up to half your speed.",
				level: 7,
			},
			{
				name: "Soul of Retribution",
				description:
					"When your focused target strikes, react with an immediate absolute counter-manifestation.",
				level: 15,
			},
			{
				name: "Avenging Absolute",
				description:
					"Action: transform into a winged manifestation of the Absolute for 1 hour. Gain a 60-ft fly speed and an aura of absolute menace.",
				level: 20,
			},
		],
		abilities: [
			{
				name: "Relentless Pursuit",
				description:
					"Designate a target: for 1 min, your movement and offensive output cannot be hindered as you move toward them. Once/long rest.",
				recharge: 3,
				cost: "Bonus action",
			},
		],
		stats: {
			primaryAttribute: "Strength",
			secondaryAttribute: "Presence",
			bonusStats: {
				strength: 2,
				charisma: 1,
			},
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
			skills: ["Gate Topology", "Cosmic Lore"],
		},
		description:
			"Those who walk the Path of the Verdant Mandate swear to protect the Absolute's original intent against the encroaching resonance corruption of the gates. Their covenant is a primal pact with the world's original life-resonance, anchoring themselves to threatened gate biomes to serve as the ultimate custodians of aetheric diversity. In the modern world, they are the bulwark against total ecological collapse, their presence stabilizing the very fabric of reality.",
		features: [
			{
				name: "Absolute Resonance: Verdant Snare",
				description:
					"Action: spectral vines restrain a creature within 10 ft (STR or AGI save to escape, check each turn).",
				level: 3,
			},
			{
				name: "Absolute Resonance: Turn the Entropic",
				description:
					"Action: entropic entities (fey/anomaly) within 30 ft make SENSE save or are turned for 1 min.",
				level: 3,
			},
			{
				name: "Aura of the Weave Warding",
				description:
					"You and allies within 10 ft have resistance to offensive resonance damage. 30 ft at 18th.",
				level: 7,
			},
			{
				name: "Absolute Sentinel",
				description:
					"When reduced to 0 HP and not killed outright, drop to 1 HP instead. Once per long rest. Also, you suffer no drawbacks of old age and can't be aged magically as the mandate preserves your vessel.",
				level: 15,
			},
			{
				name: "Ancient Mandate Champion",
				description:
					"Action: transform for 1 min — regain 10 HP at start of each turn, cast Holy Knight mantras as bonus action, enemies within 10 ft have disadvantage on saves vs your mantras and Resonance. Once/long rest.",
				level: 20,
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
			bonusStats: {
				strength: 2,
				charisma: 1,
			},
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
			skills: ["Intimidation", "Athletics"],
		},
		description:
			"The Dominance Mandate designates those who wield the Absolute's authority with uncompromising force. They do not just lead; they dominate, their aetheric presence frozen with a chill authority that renders enemies immobile. In the modern world, the Dominance Knight is the supreme arbiter of the Absolute's order, their very will enough to shatter the resolve of those who oppose them.",
		features: [
			{
				name: "Absolute Resonance: Crushing Mandate",
				description:
					"Action: manifest an aura of absolute terror that renders nearby entities frightened for 1 min.",
				level: 3,
			},
			{
				name: "Absolute Resonance: Guided Strike",
				description:
					"Gain an absolute bonus to a strike's precision after the manifestation has begun.",
				level: 3,
			},
			{
				name: "Aura of Dominance",
				description:
					"Terrified entities within 10 ft have their movement completely suppressed and suffer mental backlash.",
				level: 7,
			},
			{
				name: "Scornful Backlash",
				description:
					"Whenever your vessel is struck, the Absolute redirects a portion of the psychic force back at the aggressor.",
				level: 15,
			},
			{
				name: "Absolute Archon",
				description:
					"Action: transform into a supreme vessel of authority for 1 min. Resistance to all force and triple offensive output. Once/long rest.",
				level: 20,
			},
		],
		abilities: [
			{
				name: "Absolute Presence",
				description:
					"All enemies within 30 ft must save or be knocked prone and rooted by sheer pressure. Once/long rest.",
				recharge: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Strength",
			secondaryAttribute: "Presence",
			bonusStats: {
				strength: 2,
				charisma: 1,
			},
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
			skills: ["Persuasion", "Cosmic Lore"],
		},
		description:
			"The Atonement Mandate is held by those who prioritize the absolute preservation of life. They do not just defend; they absorb the suffering of their allies, manifesting as a living shield for the Absolute's most fragile resonance-layers. In the modern world, the Atonement Knight is the supreme guardian of peace, their covenant punishing those who choose violence with a radiant backlash.",
		features: [
			{
				name: "Absolute Resonance: Peacekeeper",
				description:
					"Grant yourself an absolute advantage in all diplomatic manifestations.",
				level: 3,
			},
			{
				name: "Absolute Resonance: Radiant Backlash",
				description:
					"Reaction: when an entity deals damage, return the absolute equivalent in radiant output.",
				level: 3,
			},
			{
				name: "Aura of the Atonement",
				description:
					"Reaction: absorb the offensive manifestations directed at your allies within 10 ft.",
				level: 7,
			},
			{
				name: "Protective Essence",
				description:
					"Automatically stabilize your vessel's HP when below half maximum.",
				level: 15,
			},
			{
				name: "Emissary of the Absolute",
				description:
					"Gain absolute resistance to all manifestations and redirect a portion of all incoming strikes back at their origin.",
				level: 20,
			},
		],
		abilities: [
			{
				name: "Harmonic Shield",
				description:
					"For 1 min, all damage directed at nearby allies is shared by your vessel. Once/long rest.",
				recharge: 3,
				cost: "Bonus action",
			},
		],
		stats: {
			primaryAttribute: "Presence",
			secondaryAttribute: "Vitality",
			bonusStats: {
				charisma: 2,
				constitution: 1,
			},
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
			skills: ["Athletics", "Performance"],
		},
		description:
			"The Exaltation Mandate is for those who strive for absolute physical and aetheric perfection. They do not just fight; they perform, their every strike a legendary feat that inspires those around them to reach their own absolute potential. In the modern world, the Exaltation Knight is the supreme hero, their covenant fueling superhuman manifestations that turn every struggle into an epic victory.",
		features: [
			{
				name: "Absolute Resonance: Peerless Form",
				description:
					"Grant yourself absolute advantage in all physical manifestations for 10 min.",
				level: 3,
			},
			{
				name: "Absolute Resonance: Inspiring Smite",
				description:
					"After an absolute strike, distribute restorative resonance to all nearby allies.",
				level: 3,
			},
			{
				name: "Aura of Alacrity",
				description:
					"Your physical speed is permanently enhanced, and allies who stand within your presence are granted similar acceleration.",
				level: 7,
			},
			{
				name: "Exalted Defense",
				description:
					"Reaction: when an ally is targeted, realign the Absolute to grant them protection and return the strike.",
				level: 15,
			},
			{
				name: "Living Legend",
				description:
					"Bonus action: become a legend incarnate for 1 min. Once per turn, turn any failure into an absolute success. Once/long rest.",
				level: 20,
			},
		],
		abilities: [
			{
				name: "Heroic Manifestation",
				description:
					"Move at double speed in a direct line, rending all entities in your path with absolute radiance. Once/short rest.",
				recharge: 1,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Strength",
			secondaryAttribute: "Presence",
			bonusStats: {
				strength: 2,
				charisma: 1,
			},
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
			skills: ["Mana Flow", "Medicine"],
		},
		description:
			"The Aether Chemist designs are for those who synthesize aetheric reagents harvested directly from the gates. They do not just brew potions; they architecture complex somatic sequences that heal, transform, and incinerate with absolute precision. In the modern world, the Aether Chemist is the supreme specialist in restorative and entropic resonance dynamics, their presence stabilizing the party's biological integrity.",
		features: [
			{
				name: "Aetheric Tool Mastery",
				description: "Absolute proficiency with chemical supplies.",
				level: 3,
			},
			{
				name: "Architect's Mandates",
				description:
					"A list of always-available absolute mandates for restoration and entropy.",
				level: 3,
			},
			{
				name: "Aetheric Infusion",
				description:
					"Synthesize one free aetheric infusion after each rest. Choose from: Restoration, Speed, Resilience, Boldness, Flight, or Transformation.",
				level: 3,
			},
			{
				name: "Alchemical Savant",
				description:
					"When you use your supplies as an absolute focus, enhance the efficiency of all restorative and destructive manifestations.",
				level: 5,
			},
			{
				name: "Restorative Synthesis",
				description:
					"All infusions now grant temporary resonance. Manifest restorative mandates at will.",
				level: 9,
			},
			{
				name: "Absolute Synthesis Mastery",
				description:
					"Absolute immunity to entropic chemicals. Manifest supreme restoration and greater stabilization once per long rest.",
				level: 15,
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
			bonusStats: {
				intelligence: 2,
				wisdom: 1,
			},
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
			skills: ["Mana Flow", "Athletics"],
		},
		description:
			"The Aether Vessel designs are for those who infuse physical armaments with the Absolute's blueprints. They do not just wear armor; they manifest localized power-frames that grant superhuman strength and impenetrable defensive auras, turning the Technomancer into a walking force of aetheric might. In the modern world, the Aether Vessel is the supreme martial-architect, their designs representing the peak of ascendant warfare.",
		features: [
			{
				name: "Vessel Architect Mastery",
				description:
					"Absolute proficiency with heavy armaments and smith's tools.",
				level: 3,
			},
			{
				name: "Vessel Mandates",
				description:
					"A list of always-available absolute mandates for offensive and defensive power.",
				level: 3,
			},
			{
				name: "Aether-Frame Integration",
				description:
					"Transform a suit of armor into an Absolute Aether-Frame. Choose model: Arbiter (thunder-resonant melee) or Outrider (lightning-resonant ranged).",
				level: 3,
			},
			{
				name: "Absolute Multi-strike",
				description:
					"Manifest strikes twice when you take the offensive action.",
				level: 5,
			},
			{
				name: "Aetheric Conduits",
				description:
					"Your vessel counts as four separate aetheric conduits, each capable of holding its own mandate manifestation.",
				level: 9,
			},
			{
				name: "Perfected Aether-Frame",
				description:
					"Arbiter: reaction to pull entities toward you and strike. Outrider: strikes deal extra lightning damage and reveal all nearby aetheric hidden entities.",
				level: 15,
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
			bonusStats: {
				intelligence: 2,
				constitution: 1,
			},
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
			skills: ["Mana Flow"],
		},
		description:
			"The Resonance Siege designs represent the peak of offensive aetheric manifestations. They do not just build platforms; they architecture localized resonators that project destructive harmonics or protective fields across the battlefield. In the modern world, the Resonance Siege architect is the supreme heavy resonance specialist, their constructs capable of breaking any gate-defense with absolute power.",
		features: [
			{
				name: "Siege Architect Mastery",
				description:
					"Absolute proficiency with woodcarving tools and aetheric resonance.",
				level: 3,
			},
			{
				name: "Siege Mandates",
				description:
					"A list of always-available absolute mandates for destructive and protective resonances.",
				level: 3,
			},
			{
				name: "Aetheric Resonator",
				description:
					"Action: manifest a Tiny aetheric resonator. Choose type: Incinerator (fire cone), Ballista (force strike), or Bulwark (restorative field).",
				level: 3,
			},
			{
				name: "Absolute Resonance Alignment",
				description:
					"Enhance the efficiency of all manifestations through an absolute aetheric focus.",
				level: 5,
			},
			{
				name: "Aetheric Detonation",
				description:
					"Increase resonator efficiency and trigger a self-destructive burst for massive force resonance output.",
				level: 9,
			},
			{
				name: "Siege Specialist",
				description:
					"Manifest two resonators simultaneously and grant protection to all nearby allies.",
				level: 15,
			},
		],
		abilities: [
			{
				name: "Absolute Salvo",
				description:
					"All resonators manifest their power simultaneously at maximum efficiency. Once/short rest.",
				recharge: 1,
				cost: "Bonus action",
			},
		],
		stats: {
			primaryAttribute: "Intelligence",
			secondaryAttribute: "Vitality",
			bonusStats: {
				intelligence: 2,
				constitution: 1,
			},
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
			skills: ["Mana Flow", "Athletics"],
		},
		description:
			"The Synchronist Binary designs are for those who bond with a primary aetheric defender. They do not just build a companion; they fuse their own neural resonance with a physical construct, creating a perfect binary fighting unit. In the modern world, the Synchronist is a formidable frontline combatant, their attacks fueled by aetheric compilations that outpace physical reflex.",
		features: [
			{
				name: "Binary Architect Mastery",
				description:
					"Absolute proficiency with smith's tools and neural resonance.",
				level: 3,
			},
			{
				name: "Synchronist Mandates",
				description:
					"A list of always-available absolute mandates for partnership and coordination.",
				level: 3,
			},
			{
				name: "Absolute Defender",
				description:
					"Manifest a primary construct defender that obeys your every directive. Gain absolute resonance-combat proficiency using your intelligence mod.",
				level: 3,
			},
			{
				name: "Absolute Multi-strike",
				description:
					"Manifest strikes twice when you take the offensive action.",
				level: 5,
			},
			{
				name: "Aetheric Feedback",
				description:
					"Channel extra force or restorative output through your strikes or your defender's manifestations. Once/short rest.",
				level: 9,
			},
			{
				name: "Supreme Binary Command",
				description:
					"Your defender's feedback deals extra force to aggressors, and your synchronization output is doubled.",
				level: 15,
			},
		],
		abilities: [
			{
				name: "Absolute Overdrive",
				description:
					"Your defender gains absolute speed and power for 1 min. Once/long rest.",
				recharge: 3,
				cost: "Bonus action",
			},
		],
		stats: {
			primaryAttribute: "Intelligence",
			secondaryAttribute: "Vitality",
			bonusStats: {
				intelligence: 2,
				constitution: 1,
			},
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
			skills: ["Mana Flow", "Investigation"],
		},
		description:
			"The Swarm Conduit designs are for those who deploy aetheric micro-conspicuous to blanket the battlefield. They do not just control drones; they weave a living surveillance and offensive weave that provides absolute oversight and precision strikes. In the modern world, the Swarm Conduit is the supreme tactical specialist, their micro-conduits capable of relaying information and force across any distance.",
		features: [
			{
				name: "Swarm Architect Mastery",
				description:
					"Absolute proficiency with artisan's tools and micro-conduits.",
				level: 3,
			},
			{
				name: "Absolute Swarm",
				description:
					"Manifest a network of micro-conduits that share your sight and hearing. Command the swarm as an extension of your own absolute will.",
				level: 3,
			},
			{
				name: "Tactical Manifestation",
				description:
					"Channel mandates through your swarm conduits and use them to support allies with absolute precision.",
				level: 5,
			},
			{
				name: "Aetheric Surveillance Web",
				description:
					"Your swarm forms a permanent surveillance web, granting advantage on all analytical manifestations and preventing surprise.",
				level: 9,
			},
			{
				name: "Supreme Swarm Command",
				description:
					"Your conduits are hardened against destruction and can manifest complex physical interactions. Command multiple swarms simultaneously.",
				level: 15,
			},
		],
		abilities: [
			{
				name: "Absolute Convergence",
				description:
					"All swarm conduits converge for a massive force discharge. Once/short rest.",
				recharge: 1,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Intelligence",
			secondaryAttribute: "Agility",
			bonusStats: {
				intelligence: 2,
				dexterity: 1,
			},
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
			skills: ["Mana Flow", "Investigation"],
		},
		description:
			"The Aetheric Breacher designs are for those who interface directly with the Absolute's core resonance. They treat reality like a malleable sequence — finding vulnerabilities, suppressing enemy manifestations, and realigning the laws of local aetheric flow. In the modern world, the Breacher is the supreme infiltration specialist, their ability to bypass any defensive mandate making them the ultimate asset for high-rank gate raids.",
		features: [
			{
				name: "Breacher Architect Mastery",
				description:
					"Absolute proficiency with infiltration supplies and resonance analysis.",
				level: 3,
			},
			{
				name: "Absolute Suppression",
				description:
					"Action: target an entity's internal resonance to suppress its resistances or immunities for 1 min.",
				level: 3,
			},
			{
				name: "Mandate Realignment",
				description:
					"Reaction: when an ally fails to resist a manifestation, force a total realignment of the local fate-variable. Once/short rest.",
				level: 5,
			},
			{
				name: "Exploit Resonance Instability",
				description:
					"When you suppress an entity, choose an additional effect: disadvantage, halved speed, or total aetheric vulnerability.",
				level: 9,
			},
			{
				name: "Resonance Collapse",
				description:
					"Completely suppress a target's ability to manifest for 1 round. Once/long rest.",
				level: 15,
			},
		],
		abilities: [
			{
				name: "Absolute Lockdown",
				description:
					"Target entity's internal resonance is completely frozen for 1 round. Once/long rest.",
				recharge: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Intelligence",
			secondaryAttribute: "Sense",
			bonusStats: {
				intelligence: 2,
				wisdom: 1,
			},
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
			skills: ["Dimensional Lore", "Performance"],
		},
		description:
			"Those who walk the Path of the Lore Resonance are collectors of the Absolute's recursive data-manifolds. They do not just record; they weaponize information itself, disrupting enemy manifestations by echoing their own psychological vulnerabilities back at them in a tidal wave of dissonant data. In the modern world, the Lore Idol is the supreme analytical strategist, their mastery of the Absolute's secrets making them feared by any entity with a hidden variable.",
		features: [
			{
				name: "Mandated Proficiencies",
				description: "Mastery of 3 fields (skills) of your choice.",
				level: 3,
			},
			{
				name: "Cutting Remarks",
				description:
					"Reaction when an entity within 60 ft makes a check or damage roll: expend a Hype die and subtract it from the result. Act before the Absolute declares the outcome.",
				level: 3,
			},
			{
				name: "Arcane Secrets",
				description:
					"Learn 2 mantras from any lineage's list. They count as Idol resonance mantras.",
				level: 6,
			},
			{
				name: "Peerless Insight",
				description:
					"When you make an ability check, expend one Hype die and add it to the roll. Act before the Absolute declares the outcome.",
				level: 14,
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
			bonusStats: {
				charisma: 2,
				intelligence: 1,
			},
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
			skills: ["Acrobatics", "Performance"],
		},
		description:
			"Those who walk the Path of the Dance Resonance channel the Absolute's combat-frequency through movement itself — their fighting styles derived from modern dance forms weaponized by the Ascendant Bureau's martial arts division. K-pop precision choreography becomes blade-work timing, contemporary flow becomes evasion doctrine, ballet extension becomes strike reach, and hip-hop impact becomes devastating kinetic force. In the modern world, the Dance Idol is the supreme mobile combatant, their battlefield presence a lethal performance that inspires allies and annihilates anomalies with equal grace.",
		features: [
			{
				name: "Combat Choreography",
				description:
					"Prof with medium armor and martial weapons. Choose a primary dance discipline: K-Pop (bonus action feint: advantage on next attack), Contemporary (when hit, use reaction to move 10 ft without provoking), Ballet (melee reach increases by 5 ft), or Hip-Hop (unarmed strikes deal 1d8 + PRS force damage).",
				level: 3,
			},
			{
				name: "Dance Combat",
				description:
					"When you take the Attack action, your speed increases by 10 ft. On hit, expend one Hype die: Spin Strike (add die to damage, gain +2 AC until start of next turn), Breakfall Combo (add die to damage, knock target prone if Medium or smaller), or Rhythm Rush (add die to damage, move up to 15 ft without provoking opportunity attacks).",
				level: 3,
			},
			{
				name: "Dual Tempo",
				description: "Attack twice when you take the Attack action.",
				level: 6,
			},
			{
				name: "Master Choreographer",
				description:
					"You can use a d6 instead of expending a Hype die for Dance Combat. Additionally, when you hit with a Dance Combat flourish, one ally within 30 ft who can see you can use their reaction to move up to half their speed.",
				level: 14,
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
			bonusStats: {
				charisma: 2,
				dexterity: 1,
			},
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
			skills: ["Performance", "Persuasion"],
		},
		description:
			"The Path of the Hypnotic Resonance designates an Idol who broadcasts on the fey-resonance bands of the Absolute. They do not just perform; they project irresistible harmonic patterns that override the common consensus of those who witness them. In the high-stakes world of social and political containment, they are the supreme influencers, their absolute charm capable of turning an entire city-block into a unified collective of their choosing.",
		features: [
			{
				name: "Mantle of Awe",
				description:
					"Bonus action: expend one Hype die. Up to PRE mod creatures within 60 ft gain temp HP = 2× Hype die roll + Idol level and can use reaction to move up to their speed without provoking OAs.",
				level: 3,
			},
			{
				name: "Absolute Enthrallment",
				description:
					"After 1+ min performance, PRE mod creatures that watched make SENSE save or are charmed for 1 hour. Charmed entities idolize you, hinder those who oppose you, and don't know they were charmed when it ends.",
				level: 3,
			},
			{
				name: "Mantle of the Absolute",
				description:
					"Bonus action: take on an appearance of unearthly beauty for 1 min (concentration). Each turn, bonus action use a Command mantra (no slot) against a creature charmed by you. Once/long rest.",
				level: 6,
			},
			{
				name: "Unbreakable Presence",
				description:
					"Bonus action: for 1 min, any creature that attacks you for the first time on a turn must make a PRE save. Fail: attack is wasted (can't attack you this turn). Success: disadvantage on saves vs your mantras until end of your next turn. Once per short rest.",
				level: 14,
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
			bonusStats: {
				charisma: 2,
				dexterity: 1,
			},
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
			skills: ["Acrobatics", "Performance"],
		},
		description:
			"Those who walk the Path of the Blade Resonance channel their harmonic frequencies through physical armaments. They treat the battlefield as a lethal performance, their every strike a precision-weighted aetheric flourish that maximizes destruction while ensuring their own physical integrity. In the elite academies, they are the supreme martial specialists, their combat style a perfect bridge between physical perfection and aetheric art.",
		features: [
			{
				name: "Mandated Martial Mastery",
				description:
					"Prof with medium armor and the scimitar. Use a weapon as a focus for your resonance.",
				level: 3,
			},
			{
				name: "Combat Discipline",
				description:
					"Choose Dueling (+2 damage with one-handed melee) or Two-Weapon Fighting (add ability mod to off-hand damage).",
				level: 3,
			},
			{
				name: "Blade Flourish",
				description:
					"When you take the Attack action, your speed increases by 10 ft. On hit, expend one Hype die: Defensive Flourish (add die to damage and AC until start of next turn), Slashing Flourish (add die to damage, and damage equal to the die roll to another creature within 5 ft), or Mobile Flourish (add die to damage, push target 5+die roll feet, use reaction to move to within 5 ft of them).",
				level: 3,
			},
			{
				name: "Echo Attack",
				description: "Attack twice when you take the Attack action.",
				level: 6,
			},
			{
				name: "Master's Flourish",
				description:
					"You can use a d6 instead of expending a Hype die for Blade Flourish.",
				level: 14,
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
			bonusStats: {
				charisma: 2,
				dexterity: 1,
			},
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
			skills: ["Deception", "Performance"],
		},
		description:
			"The Shadow Resonance mandate is walked by those who broadcast on the hidden, subsonic layers of the Absolute's dark architecture. They are the supreme ghosts of the Idol lineage, gathered intel from the very static of the world around them. They do not just hide; they weave fear into the aetheric signatures of their enemies, planting suggestions and extracting secrets with a surgical, undetectable precision.",
		features: [
			{
				name: "Psychic Blades",
				description:
					"When you hit with a weapon attack, expend one Hype die to deal extra psychic damage = 2d6 (3d6 at 5th, 5d6 at 10th, 8d6 at 15th). Once per turn.",
				level: 3,
			},
			{
				name: "Words of Terror",
				description:
					"After 1+ min speaking privately to a creature, SENSE save or it is frightened of a creature of your choice for 1 hour. Doesn't know it was magically frightened. Once per short rest.",
				level: 3,
			},
			{
				name: "Mantle of Whispers",
				description:
					"Reaction when a living vessel's cycle ends within 30 ft: capture its shadow. As an action, take on its appearance for 1 hour (or until dismissed). You gain access to its general knowledge and memories. Deception checks to pass as it have +5. Once per short rest.",
				level: 6,
			},
			{
				name: "Absolute Shadow Lore",
				description:
					"Action: creature within 30 ft, SENSE save or it is charmed for 8 hours. It believes you know its deepest secret (even if you don't) and obeys your commands to avoid the secret being revealed. Once per long rest.",
				level: 14,
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
			bonusStats: {
				charisma: 2,
				dexterity: 1,
			},
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
			skills: ["Mana Flow", "Performance"],
		},
		description:
			"The Path of the Genesis Resonance designates an Idol who taps into the Absolute's foundational harmonic—the vibration that structures matter itself. They do not just imagine; they manifest, fabricating physical items and animating objects from raw mana as a physical manifestation of their art. In the modern world, they are the supreme architects of the material weave, their presence turning any location into a factory of absolute creation.",
		features: [
			{
				name: "Mote of Potential",
				description:
					"When you give a Hype die, the creature also gains a mote. Strike roll: mote explodes in 5-ft radius thunder (VIT save = Hype die roll). Ability check: roll Hype die twice, use either. Save: gains temp HP = Hype die roll + PRE mod.",
				level: 3,
			},
			{
				name: "Resonance of Creation",
				description:
					"Action: create one nonmagical item (Medium or smaller, worth â‰¤ 20× Idol level gp). Lasts for hours = prof bonus. One at a time. Once per long rest.",
				level: 3,
			},
			{
				name: "Animating Rite",
				description:
					"Action: animate a Large or smaller nonmagical item within 30 ft. It becomes a construct (HP = 10+5× Idol level, AC = 16, +prof to attack, 1d10+PRE force slam, 30 ft speed). Bonus action to command. Lasts 1 hour. Once per long rest.",
				level: 6,
			},
			{
				name: "Absolute Resonance Crescendo",
				description:
					"Resonance of Creation: create a number of items = PRE mod simultaneously. One can be Large, and any can be worth more (up to 200× Idol level gp). None require concentration or have the duration limit.",
				level: 14,
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
			bonusStats: {
				charisma: 2,
				intelligence: 1,
			},
		},
		source: "Rift Ascendant Canon",
	},
];
