// Job Paths Compendium - System Ascendant Canonical 84 Paths
// 14 Jobs × 6 Paths each, unique SA identities with 5e-compatible mechanical backbone

export interface Path {
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
		cooldown?: number;
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
	// ── DESTROYER PATHS ── features at 3,7,10,15,18 ──
	{
		id: "destroyer--champion",
		name: "Path of the Apex Predator",
		jobId: "destroyer",
		jobName: "Destroyer",
		tier: 2,
		pathType: "champion",
		requirements: { level: 3, skills: ["Athletics"] },
		description:
			"Former Olympic athletes, pro fighters, and CrossFit champions who pushed their System-enhanced bodies toward physical perfection. In the hunter world, they dominate competitive gate-clearance rankings and sponsor deals. Every muscle fiber is optimized, every strike calibrated for maximum lethality — they are the poster children of the Hunter Bureau's recruitment campaigns.",
		features: [
			{
				name: "Optimized Lethality",
				description:
					"Your System targeting widens the kill zone. Weapon attacks crit on 19-20.",
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
					"The System unlocks a second combat discipline slot. Choose another Combat Discipline.",
				level: 10,
			},
			{
				name: "Expanded Kill Zone",
				description:
					"Your targeting HUD highlights deeper vulnerabilities. Weapon attacks crit on 18-20.",
				level: 15,
			},
			{
				name: "Auto-Repair Protocol",
				description:
					"Start of each turn, the System channels restorative mana: regain 5+VIT mod HP if at ≤ half HP and at least 1 HP.",
				level: 18,
			},
		],
		abilities: [
			{
				name: "Predator's Focus",
				description: "Next attack crits on 17-20. Once per short rest.",
				cooldown: 1,
				cost: "Bonus action",
			},
		],
		stats: {
			primaryAttribute: "Strength",
			secondaryAttribute: "Constitution",
			bonusStats: { strength: 2, constitution: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "destroyer--battle-master",
		name: "Path of the Tactician",
		jobId: "destroyer",
		jobName: "Destroyer",
		tier: 2,
		pathType: "tactician",
		requirements: { level: 3, skills: ["Athletics", "Insight"] },
		description:
			"Ex-military strategists, chess grandmasters, and esports coaches who process combat data at superhuman speed. Many work as raid commanders for top guilds or consult for the Hunter Bureau's tactical division. The System grants them tactical charge dice — bursts of calculated energy that fuel devastating maneuvers. They treat every gate like a real-time strategy game, and they never lose.",
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
					"Gain proficiency with one artisan's tools. Your System HUD analyzes construction and materials.",
				level: 3,
			},
			{
				name: "Threat Assessment",
				description:
					"1 minute observing outside combat: learn if equal/superior/inferior in two characteristics. Your HUD compiles a threat profile.",
				level: 7,
			},
			{
				name: "Enhanced Tactical Dice",
				description:
					"Tactical dice upgrade to d10. Your combat algorithms grow more precise.",
				level: 10,
			},
			{
				name: "Relentless Analysis",
				description:
					"Roll initiative with 0 tactical dice → regain 1. Your System never stops calculating.",
				level: 15,
			},
		],
		abilities: [
			{
				name: "Combat Scan",
				description:
					"Spend a tactical die to learn target AC, HP%, and highest save. Add die to next attack vs it.",
				cooldown: 0,
				cost: "Bonus action",
			},
		],
		stats: {
			primaryAttribute: "Strength",
			secondaryAttribute: "Intelligence",
			bonusStats: { strength: 2, intelligence: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "destroyer--eldritch-knight",
		name: "Path of the Spell Breaker",
		jobId: "destroyer",
		jobName: "Destroyer",
		tier: 2,
		pathType: "arcane-warrior",
		requirements: { level: 3, skills: ["Arcana"] },
		description:
			"SWAT officers, bomb disposal techs, and anti-mage specialists who discovered they can channel the System's spell matrix through their weapons. In a world where gate bosses cast devastating magic, Spell Breakers are the ones who walk through the fire and hit back. They're recruited by counter-terrorism units and guilds that specialize in magic-heavy gates. The nightmare of every enemy caster.",
		features: [
			{
				name: "Matrix Combat Casting",
				description:
					"Learn 2 Mage cantrips and 3 Mage spells (abjuration/evocation). INT casting, third-caster slots.",
				level: 3,
			},
			{
				name: "Mana Weapon Bond",
				description:
					"Bond 2 weapons with your System signature. Can't be disarmed; summon to hand as bonus action from same plane.",
				level: 3,
			},
			{
				name: "Spell-Strike Integration",
				description:
					"Cast a cantrip → make one weapon attack as bonus action. Your System syncs the two actions.",
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
					"When you use Burst Protocol, teleport up to 30 ft before or after the extra action.",
				level: 15,
			},
			{
				name: "Full Integration",
				description:
					"Cast a spell → make one weapon attack as bonus action. Spell and blade become one system.",
				level: 18,
			},
		],
		abilities: [
			{
				name: "Mana Strike",
				description:
					"Cast a cantrip and make a weapon attack, adding INT mod as bonus force damage to both.",
				cooldown: 1,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Strength",
			secondaryAttribute: "Intelligence",
			bonusStats: { strength: 1, intelligence: 2 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "destroyer--vanguard",
		name: "Path of the Bulwark",
		jobId: "destroyer",
		jobName: "Destroyer",
		tier: 2,
		pathType: "defender",
		requirements: { level: 3, skills: ["Athletics", "Intimidation"] },
		description:
			"Bodyguards, Secret Service agents, riot police, and bouncers whose System-reinforced frames generate localized threat fields. In modern society, Bulwarks protect VIPs, hold choke points during gate breaks in populated areas, and serve as the human shields that let evacuation happen. Every guild wants one on the frontline — ignoring a Bulwark is physically impossible when they have you marked.",
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
					"Reaction: you or adjacent ally hit → add 1d8 to AC. If still hit, target resists that damage. VIT mod uses/long rest.",
				level: 7,
			},
			{
				name: "Lockdown Zone",
				description:
					"Creatures provoke opportunity attacks when moving within your reach. Hit → speed becomes 0. Nothing escapes your zone.",
				level: 10,
			},
			{
				name: "Battering Ram",
				description:
					"Move 10+ ft straight then attack → STR save or knocked prone. Bonus action attack on prone.",
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
				cooldown: 1,
				cost: "Bonus action",
			},
		],
		stats: {
			primaryAttribute: "Constitution",
			secondaryAttribute: "Strength",
			bonusStats: { constitution: 2, strength: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "destroyer--ronin",
		name: "Path of the Last Stand",
		jobId: "destroyer",
		jobName: "Destroyer",
		tier: 2,
		pathType: "precision",
		requirements: { level: 3, skills: ["Athletics", "Perception"] },
		description:
			"Combat veterans, extreme sports athletes, and survivors of near-fatal gate incidents whose iron will lets them override the System's safety limiters. They're the hunters you send into gates that have already killed the first team. Many are famous for viral clips of impossible last-second victories. They fight with perfect focus even when their bodies should have failed — the System's emergency reserves fuel moments of transcendent precision.",
		features: [
			{
				name: "Limit Break",
				description:
					"Bonus action: override System limiters. Advantage on all weapon attacks + 5 temp HP until end of turn (10 at 10th, 15 at 15th). 3 uses/long rest.",
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
					"Roll initiative with 0 Limit Break uses → regain 1. The System always has one more in reserve.",
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
					"At 0 HP, the System grants one final burst. Take an entire extra turn immediately. Once/long rest.",
				level: 18,
			},
		],
		abilities: [
			{
				name: "Piercing Blow",
				description:
					"Next melee attack ignores resistance, treats immunity as resistance. Once per short rest.",
				cooldown: 1,
				cost: "Bonus action",
			},
		],
		stats: {
			primaryAttribute: "Strength",
			secondaryAttribute: "Wisdom",
			bonusStats: { strength: 2, wisdom: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "destroyer--phantom-blade",
		name: "Path of the Aftershock",
		jobId: "destroyer",
		jobName: "Destroyer",
		tier: 2,
		pathType: "echo",
		requirements: { level: 3, skills: ["Athletics", "Arcana"] },
		description:
			"Demolition experts, power lifters, and heavy weapons specialists who hit so hard the System generates residual force projections — holographic replays of their strikes from different angles. In the field, it looks like two of them attacking at once. Gate-clearance footage of Aftershock Destroyers consistently goes viral for the sheer visual spectacle of doubled impacts tearing through boss monsters.",
		features: [
			{
				name: "Residual Strike",
				description:
					"Bonus action: generate a force hologram within 15 ft that mirrors your attacks. 1 HP, AC 14+prof. You can direct your weapon attacks from its position. Bonus action: reposition it (15 ft).",
				level: 3,
			},
			{
				name: "Impact Echo",
				description:
					"On Attack action, one extra melee attack resolves from the hologram's position — the System replays your strike. VIT mod uses/long rest.",
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
					"Hologram destroyed by damage → stored kinetic energy feeds back to you. Gain 2d6+VIT mod temp HP. VIT mod uses/long rest.",
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
					"Teleport to hologram's position and deliver an opportunity attack against an adjacent creature. The System replays you at maximum velocity.",
				cooldown: 1,
				cost: "Reaction",
			},
		],
		stats: {
			primaryAttribute: "Strength",
			secondaryAttribute: "Constitution",
			bonusStats: { strength: 2, constitution: 1 },
		},
		source: "System Ascendant Canon",
	},

	// ── BERSERKER PATHS ── features at 3,6,10,14 ──
	{
		id: "berserker--primal-fury",
		name: "Path of the Feedback Loop",
		jobId: "berserker",
		jobName: "Berserker",
		tier: 2,
		pathType: "frenzy",
		requirements: { level: 3, skills: ["Athletics", "Intimidation"] },
		description:
			"Underground fighters, adrenaline addicts, and rage-prone individuals with the most unstable mana connections. In underground hunter fight clubs and viral gate-clearance challenges, Feedback Loopers are the headliners — pain feeds back as damage, each hit amplifies the next. The loop burns out eventually, leaving them collapsed in a crater of their own making while chat spams emotes.",
		features: [
			{
				name: "Escalating Loop",
				description:
					"While in Overload, your mana loop accelerates with each heartbeat — cardiac monitors show your BPM doubling. Make a melee weapon attack as bonus action each turn. One exhaustion level when Overload ends — field medics keep adrenaline shots ready.",
				level: 3,
			},
			{
				name: "Signal Noise",
				description:
					"In Overload, the mana static in your body jams all external signals — phones nearby lose reception, Bluetooth disconnects, and psychic influence can't penetrate the noise. Can't be charmed or frightened. Existing effects suspended.",
				level: 6,
			},
			{
				name: "Mana Pressure",
				description:
					"Action: your mana field pulses outward like a pressure wave — bystanders describe feeling like they're underwater. Frighten one creature within 30 ft (SENSE save 8+prof+STR). Extend each turn with action. Viral clips of this effect get labeled 'the Pressure.'",
				level: 10,
			},
			{
				name: "Damage Feedback",
				description:
					"Reaction: when damaged by creature within 5 ft, the System converts pain into a counterstrike. Make melee attack against it.",
				level: 14,
			},
		],
		abilities: [
			{
				name: "Runaway Loop",
				description:
					"1 min: each time you take damage, next melee deals bonus = Overload damage. Once/long rest.",
				cooldown: 3,
				cost: "Free (while in Overload)",
			},
		],
		stats: {
			primaryAttribute: "Strength",
			secondaryAttribute: "Constitution",
			bonusStats: { strength: 2, constitution: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "berserker--gate-beast",
		name: "Path of the Gate Beast",
		jobId: "berserker",
		jobName: "Berserker",
		tier: 2,
		pathType: "totem",
		requirements: { level: 3, skills: ["Nature", "Survival"] },
		description:
			"Animal trainers, wildlife researchers, and zoo workers who formed mana bonds with apex predators inside gates. In a world where gate fauna is a growing field of study, Gate Beasts blur the line between hunter and animal. Many work with the Hunter Bureau's Wildlife Division or star in nature documentaries about gate ecosystems. In Overload, they channel bonded creatures — tank-beast endurance, raptor evasion, or pack-leader coordination.",
		features: [
			{
				name: "Bonded Aspect",
				description:
					"Tank-beast: resist all damage except psychic in Overload. Raptor: OAs have disadvantage vs you, Dash as bonus in Overload. Pack-leader: allies have advantage on melee vs creatures within 5 ft of you in Overload.",
				level: 3,
			},
			{
				name: "Physical Adaptation",
				description:
					"Tank-beast: double carry, advantage on STR push/pull. Raptor: see 1 mile, dim light no Perception penalty. Pack-leader: track at fast pace, stealth at normal.",
				level: 6,
			},
			{
				name: "Spirit Commune",
				description:
					"Cast Commune with Nature as ritual; your bonded gate beast's spirit conveys environmental information.",
				level: 10,
			},
			{
				name: "Apex Bond",
				description:
					"Tank-beast: in Overload, enemies within 5 ft have disadvantage on attacks vs allies. Raptor: in Overload, fly speed = walk speed. Pack-leader: in Overload, bonus action knock Large-or-smaller prone on hit.",
				level: 14,
			},
		],
		abilities: [
			{
				name: "Territorial Roar",
				description:
					"All enemies in 30 ft: SENSE save or frightened 1 min. Your bonded beast spirit manifests. Once/long rest.",
				cooldown: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Strength",
			secondaryAttribute: "Wisdom",
			bonusStats: { strength: 2, wisdom: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "berserker--shadow-lineage",
		name: "Path of the Mana Scars",
		jobId: "berserker",
		jobName: "Berserker",
		tier: 2,
		pathType: "ancestral",
		requirements: { level: 3, skills: ["Athletics", "History"] },
		description:
			"Veteran hunters, retired soldiers, and survivors of multiple gate disasters whose bodies are covered in luminous scar tissue from repeated Overloads. In modern guilds, they're the grizzled veterans — the ones who've been through it all and whose scars literally glow in the dark. Instagram influencers have tried to replicate the look; it doesn't work without nearly dying a dozen times first.",
		features: [
			{
				name: "Scar Aggro",
				description:
					"In Overload, first creature you hit each turn: your mana scars flare aggressively. Target has disadvantage on attacks not targeting you, and others resist its damage until start of your next turn.",
				level: 3,
			},
			{
				name: "Scar Shield",
				description:
					"In Overload, ally within 30 ft takes damage → reaction: your scars project a mana barrier, reducing damage by 2d6 (3d6 at 10th, 4d6 at 14th).",
				level: 6,
			},
			{
				name: "Scar Memory",
				description:
					"Your scars record everything you've survived like biological dashcam footage. Cast Clairvoyance as ritual without components — your scars replay environmental data from locations you've been injured. The Hunter Bureau's forensics division sometimes asks Mana Scar veterans to 'read' old battlefields.",
				level: 10,
			},
			{
				name: "Retaliatory Scars",
				description:
					"When your Scar Shield activates, the mana barrier discharges back: attacker takes force damage equal to the amount prevented.",
				level: 14,
			},
		],
		abilities: [
			{
				name: "Scar Eruption",
				description:
					"All your mana scars discharge simultaneously: 20-ft radius, 3d8 force damage (VIT half). Allies in range gain temp HP = damage dealt to nearest enemy. Once/long rest.",
				cooldown: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Strength",
			secondaryAttribute: "Constitution",
			bonusStats: { strength: 2, constitution: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "berserker--rift-storm",
		name: "Path of the Rift Storm",
		jobId: "berserker",
		jobName: "Berserker",
		tier: 2,
		pathType: "elemental",
		requirements: { level: 3, skills: ["Athletics", "Nature"] },
		description:
			"Survivors of catastrophic gate breaches — power plant workers, storm chasers, and disaster survivors who absorbed raw elemental energy during the event. When they enter Overload, their mana vents as environmental destruction — fire, lightning, or freezing cold radiating from their body. The Hunter Bureau deploys them carefully; Rift Storms are as dangerous to city infrastructure as they are to gate monsters.",
		features: [
			{
				name: "Elemental Vent",
				description:
					"In Overload, your body vents elemental energy — car paint blisters near Inferno types, Tempest types trip circuit breakers, and Glacial types frost over nearby windows. 10-ft aura. Inferno: 2 fire/turn (scales). Tempest: bonus action 1d6 lightning, AGI half. Glacial: 2 temp HP/turn (scales).",
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
					"Chosen creatures in aura gain your Elemental Saturation resistance.",
				level: 10,
			},
			{
				name: "Volatile Vent",
				description:
					"Inferno: reaction when hit, fire = half level. Tempest: reaction, AGI save or prone. Glacial: bonus action, STR save or speed 0.",
				level: 14,
			},
		],
		abilities: [
			{
				name: "Elemental Detonation",
				description:
					"30-ft radius, 4d8 damage (aura type), AGI half. Once/long rest.",
				cooldown: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Strength",
			secondaryAttribute: "Constitution",
			bonusStats: { strength: 2, constitution: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "berserker--system-fanatic",
		name: "Path of the System Zealot",
		jobId: "berserker",
		jobName: "Berserker",
		tier: 2,
		pathType: "zealot",
		requirements: { level: 3, skills: ["Athletics", "Religion"] },
		description:
			"Religious extremists, true believers, and fanatical System worshippers who believe their unstable awakening is divine providence. In modern society, System Zealots form cult-like guilds, broadcast gate raids as religious ceremonies on streaming platforms, and have disturbing resurrection rates — hospital morgues have documented Zealots sitting up on the table hours after being declared dead.",
		features: [
			{
				name: "System's Wrath",
				description:
					"In Overload: first hit each turn deals extra 1d6+half Berserker level radiant or necrotic. The System punishes through you.",
				level: 3,
			},
			{
				name: "System's Chosen",
				description:
					"Spells restoring you to life don't require material components. The System waives the cost.",
				level: 3,
			},
			{
				name: "Unwavering Devotion",
				description:
					"Fail a save while in Overload → reroll, must use new result. Your faith overrides failure. Once per Overload.",
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
					"In Overload at 0 HP: don't fall unconscious. Die only on 3 failed death saves, massive damage, or Overload ending at 0 HP. The System refuses to let you stop.",
				level: 14,
			},
		],
		abilities: [
			{
				name: "Radiant Overload",
				description:
					"1 min: melee deals extra 2d6 radiant, emit bright light 10 ft. Once/long rest.",
				cooldown: 3,
				cost: "Bonus action",
			},
		],
		stats: {
			primaryAttribute: "Strength",
			secondaryAttribute: "Constitution",
			bonusStats: { strength: 2, constitution: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "berserker--rift-touched",
		name: "Path of the Mana Glitch",
		jobId: "berserker",
		jobName: "Berserker",
		tier: 2,
		pathType: "wild-magic",
		requirements: { level: 3, skills: ["Athletics", "Arcana"] },
		description:
			"People who were standing too close to a gate breach when it detonated — their System connection is permanently corrupted. In modern society, Mana Glitches are walking chaos engines. Their Overload triggers random mana discharges that have variously destroyed a parking garage, turned a bus stop invisible, and accidentally cured a bystander's cancer. The Hunter Bureau classifies them as anomalous threats, but their unpredictability makes them terrifyingly effective.",
		features: [
			{
				name: "Mana Detection",
				description:
					"Action: sense spells/magic items within 60 ft, identify school. Your glitched connection reads ambient mana. Prof uses/long rest.",
				level: 3,
			},
			{
				name: "Glitch Surge",
				description:
					"Enter Overload → roll Mana Glitch table. Effects: shadow tendrils (1d12 force), teleport 30 ft, mana explosion, force weapon, or size increase.",
				level: 3,
			},
			{
				name: "Mana Transfusion",
				description:
					"Action touch: +1d3 to attacks/checks for 10 min, OR restore a spell slot ≤ d3 level. Prof uses/long rest.",
				level: 6,
			},
			{
				name: "Cascade Reroll",
				description:
					"Take damage or fail save while in Overload → reaction to reroll Glitch Surge, replacing current effect with new one.",
				level: 10,
			},
			{
				name: "Controlled Glitch",
				description:
					"Roll Glitch Surge twice, choose which. Same number = choose any effect from the table.",
				level: 14,
			},
		],
		abilities: [
			{
				name: "Mana Detonation",
				description:
					"20-ft radius: 3d10 force, VIT half, random Glitch Surge on each failure. Once/long rest.",
				cooldown: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Strength",
			secondaryAttribute: "Constitution",
			bonusStats: { strength: 2, constitution: 1 },
		},
		source: "System Ascendant Canon",
	},

	// ── ASSASSIN PATHS ── features at 3,9,13,17 ──
	{
		id: "assassin--shadow-thief",
		name: "Path of the Gate Runner",
		jobId: "assassin",
		jobName: "Assassin",
		tier: 2,
		pathType: "thief",
		requirements: { level: 3, skills: ["Stealth", "Sleight of Hand"] },
		description:
			'Ex-shoplifters, parkour YouTubers, and escape room champions whose phase-shifted hands can reach through locked doors and security cases. In the hunter economy, Gate Runners are the fastest looters alive — they strip a cleared gate of valuables before the raid party finishes their post-combat selfies. Many fence gate artifacts on the dark web or run "speed-clear" streams.',
		features: [
			{
				name: "Phase Hands",
				description:
					"Phase Shift bonus action can also: Sleight of Hand check, use thieves' tools, or Use an Object. Your hands phase through pockets and locks.",
				level: 3,
			},
			{
				name: "Wall Runner",
				description:
					"Climbing costs no extra movement. Running jump distance +AGI mod feet. You phase-grip surfaces.",
				level: 3,
			},
			{
				name: "Perfect Stealth",
				description:
					"Advantage on Stealth if you move no more than half speed that turn. You become nearly invisible.",
				level: 9,
			},
			{
				name: "System Bypass",
				description:
					"Ignore all class, race, and level requirements on magic items. Your phase-shifted hands interface with any System construct.",
				level: 13,
			},
			{
				name: "Temporal Split",
				description:
					"Two turns in the first round of combat: normal initiative and initiative minus 10. You phase through time itself.",
				level: 17,
			},
		],
		abilities: [
			{
				name: "Phase Grab",
				description:
					"Bonus action: phase your hand through a creature within 5 ft and steal a held/worn item (AGI save).",
				cooldown: 1,
				cost: "Bonus action",
			},
		],
		stats: {
			primaryAttribute: "Dexterity",
			secondaryAttribute: "Intelligence",
			bonusStats: { dexterity: 2, intelligence: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "assassin--silent-knife",
		name: "Path of the Terminus",
		jobId: "assassin",
		jobName: "Assassin",
		tier: 2,
		pathType: "assassin",
		requirements: { level: 3, skills: ["Stealth", "Deception"] },
		description:
			"Former hitmen, special forces snipers, and surgical professionals whose kills are clinically perfect. They phase into striking range, deliver one impossible blow, and phase out before security footage captures a single frame. Intelligence agencies worldwide maintain classified dossiers on known Terminus operatives. The System designates their kills as [TERMINATED] — clean, final, inevitable.",
		features: [
			{
				name: "Covert Proficiencies",
				description:
					"Proficiency with disguise kit and poisoner's kit. Tools of the trade.",
				level: 3,
			},
			{
				name: "First Strike Protocol",
				description:
					"Advantage on attacks vs creatures that haven't acted yet. Hits on surprised creatures are automatic critical hits.",
				level: 3,
			},
			{
				name: "Identity Fabrication",
				description:
					"Spend 7 days to create a false System-registered identity with documentation and disguises.",
				level: 9,
			},
			{
				name: "Perfect Mimicry",
				description:
					"Mimic another person's speech, writing, and behavior after 3 hours of study. Suspicious creatures have disadvantage on Insight to detect.",
				level: 13,
			},
			{
				name: "Execution Protocol",
				description:
					"Hit a surprised creature → VIT save (8+AGI mod+prof) or damage is doubled. The System confirms the kill.",
				level: 17,
			},
		],
		abilities: [
			{
				name: "Phase Kill",
				description:
					"After melee hit, phase between dimensions — become invisible until end of next turn or until you attack/cast. Once/short rest.",
				cooldown: 1,
				cost: "Free",
			},
		],
		stats: {
			primaryAttribute: "Dexterity",
			secondaryAttribute: "Constitution",
			bonusStats: { dexterity: 2, constitution: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "assassin--spell-thief",
		name: "Path of the Matrix Thief",
		jobId: "assassin",
		jobName: "Assassin",
		tier: 2,
		pathType: "arcane-trickster",
		requirements: { level: 3, skills: ["Stealth", "Arcana"] },
		description:
			"Hackers, identity thieves, and corporate spies who discovered they can phase into the System's spell matrix and steal spell routines mid-cast — the magical equivalent of intercepting encrypted network traffic. They project invisible force-hands for impossible larceny. Cybersecurity firms hire them to test defenses; intelligence agencies hire them for everything else.",
		features: [
			{
				name: "Matrix Intrusion",
				description:
					"Invisible Force Hand + 2 Mage cantrips + 3 spells (enchantment/illusion). INT casting, third-caster slots.",
				level: 3,
			},
			{
				name: "Force Hand Legerdemain",
				description:
					"Invisible Force Hand can stow/retrieve objects, pick locks, disarm traps at range via Sleight of Hand.",
				level: 3,
			},
			{
				name: "Phase Ambush",
				description:
					"Hidden when you cast → target has disadvantage on saves vs that spell. You cast from between dimensions.",
				level: 9,
			},
			{
				name: "Force Distraction",
				description:
					"Bonus action: Force Hand distracts creature within 5 ft of it → advantage on attacks vs that creature until end of turn.",
				level: 13,
			},
			{
				name: "Spell Extraction",
				description:
					"Reaction when targeted by spell: force INT save. Fail → negate effect on you, steal spell routine for 8 hours. Once/long rest.",
				level: 17,
			},
		],
		abilities: [
			{
				name: "Shadow Cast",
				description:
					"Cast cantrip while hidden without revealing position. Add Exploit Weakness if it deals damage. Once/short rest.",
				cooldown: 1,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Dexterity",
			secondaryAttribute: "Intelligence",
			bonusStats: { dexterity: 1, intelligence: 2 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "assassin--shadow-broker",
		name: "Path of the Shadow Broker",
		jobId: "assassin",
		jobName: "Assassin",
		tier: 2,
		pathType: "mastermind",
		requirements: { level: 3, skills: ["Insight", "Deception"] },
		description:
			"Former intelligence analysts, political fixers, investigative journalists, and corporate lobbyists who operate from the spaces between dimensions. They gather intelligence through dimensional eavesdropping — listening through walls, reading screens from another plane, attending meetings as invisible observers. In the hunter world, Shadow Brokers ARE the information economy.",
		features: [
			{
				name: "Intelligence Network",
				description:
					"Prof in disguise kit, forgery kit, one gaming set. Learn 2 languages. Mimic accents unerringly through phase-shifted vocal cords.",
				level: 3,
			},
			{
				name: "Remote Coordination",
				description:
					"Help as bonus action. Help an ally attack → target can be within 30 ft. You whisper tactical data through dimensional cracks.",
				level: 3,
			},
			{
				name: "System Profiling",
				description:
					"Observe 1 min outside combat: learn if equal/superior/inferior in two of INT/SENSE/PRE/class levels. Your HUD compiles a dossier.",
				level: 9,
			},
			{
				name: "Deflection Protocol",
				description:
					"Reaction when targeted while a creature gives you cover: attack targets that creature instead. You phase behind them.",
				level: 13,
			},
			{
				name: "Phase-Locked Mind",
				description:
					"Thoughts unreadable by telepathy. Present false thoughts. Can't be compelled to truth. Advantage on Deception vs magical discernment.",
				level: 17,
			},
		],
		abilities: [
			{
				name: "Coordinated Exploit",
				description:
					"Bonus action: designate target in 60 ft. Next ally to hit it adds your Exploit Weakness damage. Once/short rest.",
				cooldown: 1,
				cost: "Bonus action",
			},
		],
		stats: {
			primaryAttribute: "Charisma",
			secondaryAttribute: "Intelligence",
			bonusStats: { charisma: 2, intelligence: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "assassin--duellist",
		name: "Path of the Blade Dancer",
		jobId: "assassin",
		jobName: "Assassin",
		tier: 2,
		pathType: "swashbuckler",
		requirements: { level: 3, skills: ["Acrobatics", "Persuasion"] },
		description:
			"Fencers, ballet dancers, stunt performers, and competitive martial artists who fight with one foot in the shadow dimension. Their gate-raid highlight reels look like choreographed action movies — phase-stepping through combat with impossible grace. Many have modeling contracts, sponsorship deals, and fan clubs. Never where you expect, always where it hurts.",
		features: [
			{
				name: "Phase Footwork",
				description:
					"Melee attack a creature → it can't make OAs against you for the rest of your turn. You phase-step past their guard.",
				level: 3,
			},
			{
				name: "Dimensional Audacity",
				description:
					"Add PRE mod to initiative. Exploit Weakness without advantage if no other creature within 5 ft of you (no disadvantage required).",
				level: 3,
			},
			{
				name: "Mesmerizing Presence",
				description:
					"Action: Persuasion vs Insight. Win: hostile = charmed (won't attack you), or friendly target has disadvantage attacking anyone but you. 1 min.",
				level: 9,
			},
			{
				name: "Graceful Recovery",
				description:
					"Bonus action: advantage on next Acrobatics or Athletics check this turn.",
				level: 13,
			},
			{
				name: "Perfect Counter",
				description:
					"Miss with attack → reroll with advantage. Your phase-sight shows you the correct angle. Once/short rest.",
				level: 17,
			},
		],
		abilities: [
			{
				name: "Riposte",
				description:
					"Reaction when creature misses you: phase-strike with Exploit Weakness damage. Once/short rest.",
				cooldown: 1,
				cost: "Reaction",
			},
		],
		stats: {
			primaryAttribute: "Dexterity",
			secondaryAttribute: "Charisma",
			bonusStats: { dexterity: 2, charisma: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "assassin--outrider",
		name: "Path of the Vanguard Scout",
		jobId: "assassin",
		jobName: "Assassin",
		tier: 2,
		pathType: "scout",
		requirements: { level: 3, skills: ["Stealth", "Survival"] },
		description:
			"Ex-military recon specialists, urban explorers, and search-and-rescue volunteers who serve as the advance force in gate operations. They phase-step past monsters, map corridors using dimensional sight that works like built-in sonar, and relay intel via encrypted comms before the main raid party arrives. The Hunter Bureau's Gate Mapping Division is staffed almost entirely by Vanguard Scouts.",
		features: [
			{
				name: "Phase Skirmish",
				description:
					"Enemy ends turn within 5 ft → reaction: phase-step half speed without provoking OAs.",
				level: 3,
			},
			{
				name: "Gate Survivalist",
				description:
					"Prof in Nature and Survival with double proficiency bonus. Your dimensional sight reads environments instantly.",
				level: 3,
			},
			{
				name: "Enhanced Mobility",
				description:
					"Walking speed +10 ft. Climbing/swimming speed +10 ft if you have them. Phase-stepping augments all movement.",
				level: 9,
			},
			{
				name: "Dimensional Ambush",
				description:
					"Advantage on initiative. First creature you hit round 1 has disadvantage on attacks vs you until start of your next turn.",
				level: 13,
			},
			{
				name: "Dual Phase Strike",
				description:
					"Bonus action: one additional attack from a phase-shifted angle. Can apply Exploit Weakness to a different target even if already used this turn.",
				level: 17,
			},
		],
		abilities: [
			{
				name: "Phase Recon",
				description:
					"Phase-scout at triple speed for 10 min while hidden. Auto-succeed Stealth vs passive Perception. Once/short rest.",
				cooldown: 1,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Dexterity",
			secondaryAttribute: "Wisdom",
			bonusStats: { dexterity: 2, wisdom: 1 },
		},
		source: "System Ascendant Canon",
	},

	// ── STRIKER PATHS ── features at 3,6,11,17 ──
	{
		id: "striker--iron-fist",
		name: "Path of the Kinetic Fist",
		jobId: "striker",
		jobName: "Striker",
		tier: 2,
		pathType: "open-hand",
		requirements: { level: 3, skills: ["Athletics", "Acrobatics"] },
		description:
			"Boxing champions, MMA title holders, and bare-knuckle fighters who optimized their impulse gates for pure unarmed devastation. They headline hunter fight leagues broadcast on pay-per-view and their highlight reels crash servers. Every strike carries focused kinetic force that can shatter concrete, hurl enemies through walls, or lock a nervous system with a touch.",
		features: [
			{
				name: "Impact Technique",
				description:
					"When you use Gate of Force (Rapid Barrage), each hit can impose one: AGI save or prone; STR save or pushed 15 ft; or target can't take reactions until end of your next turn.",
				level: 3,
			},
			{
				name: "Neural Repair",
				description:
					"Action: channel impulse energy inward to repair tissue. Regain HP = 3 × Striker level. Once/long rest.",
				level: 6,
			},
			{
				name: "Passive Deterrence",
				description:
					"Your impulse field passively deters attacks. End of long rest: gain Sanctuary effect until next long rest (save DC 8+SENSE mod+prof).",
				level: 11,
			},
			{
				name: "Resonance Palm",
				description:
					"Unarmed hit implants a kinetic vibration in the target lasting Striker level days. Action to detonate: VIT save or reduced to 0 HP, success = 10d10 force damage.",
				level: 17,
			},
		],
		abilities: [
			{
				name: "Nerve Lockdown",
				description:
					"VIT save or stunned until end of your next turn. 3 impulse points.",
				cooldown: 0,
				cost: "3 impulse points",
			},
		],
		stats: {
			primaryAttribute: "Dexterity",
			secondaryAttribute: "Wisdom",
			bonusStats: { dexterity: 2, wisdom: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "striker--phantom-step",
		name: "Path of the Phantom Step",
		jobId: "striker",
		jobName: "Striker",
		tier: 2,
		pathType: "shadow",
		requirements: { level: 3, skills: ["Stealth", "Acrobatics"] },
		description:
			"Parkour athletes, nightclub bouncers, and covert operatives who route impulse energy through shadow-frequency nerve clusters. In the modern hunter world, Phantom Steps are urban legends — security cameras capture a flicker in a dark alley, then a gate monster collapses with shattered ribs and no visible attacker. Many work night shifts for private security firms or as off-the-books assets for intelligence agencies.",
		features: [
			{
				name: "Shadow Impulse",
				description:
					"2 impulse points: cast Darkness, Darkvision, Pass without Trace, or Silence through your nerve network. Learn Minor Illusion cantrip.",
				level: 3,
			},
			{
				name: "Phantom Blink",
				description:
					"Bonus action in dim light/darkness: teleport 60 ft to another dim/dark space. Advantage on first melee attack before end of turn.",
				level: 6,
			},
			{
				name: "Shadow Cloak",
				description:
					"In dim light/darkness, action: your body phases to near-invisibility. Invisible until you attack, cast, or enter bright light.",
				level: 11,
			},
			{
				name: "Exploit Opening",
				description:
					"Reaction when creature within 5 ft is hit by someone else: deliver a free unarmed strike against it while its guard is broken.",
				level: 17,
			},
		],
		abilities: [
			{
				name: "Phantom Barrage",
				description:
					"Teleport between up to 3 creatures within 60 ft, unarmed strike each. Start/end in dim light/darkness. 3 impulse points.",
				cooldown: 0,
				cost: "3 impulse points",
			},
		],
		stats: {
			primaryAttribute: "Dexterity",
			secondaryAttribute: "Wisdom",
			bonusStats: { dexterity: 2, wisdom: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "striker--essence-channeler",
		name: "Path of the Force Channeler",
		jobId: "striker",
		jobName: "Striker",
		tier: 2,
		pathType: "four-elements",
		requirements: { level: 3, skills: ["Acrobatics", "Nature"] },
		description:
			"Electrical engineers, firefighters, and demolition workers who discovered their impulse gates convert ambient energy into elemental force. In the field, they are living weapons platforms — punching with fists that burn at 500°C, discharge like industrial tasers, or hit with gravitational force that cracks pavement. The military classifies them as tactical assets; insurance companies classify them as natural disasters.",
		features: [
			{
				name: "Elemental Conversion",
				description:
					"Learn Force Attunement + 1 elemental discipline. More at 6,11,17. Max impulse per discipline = half Striker level (round up).",
				level: 3,
			},
			{
				name: "Discipline Library",
				description:
					"Options: Thermal Fists (fire reach +10 ft), Concussive Blast (30 ft 3d10 force), Gravity Whip (30 ft pull 3d10), Thermal Wave (15-ft cone 3d6 fire, 2 impulse), etc.",
				level: 3,
			},
			{
				name: "Advanced Conversions",
				description:
					"6th: Nerve Lock 3 impulse, Sonic Shatter 3 impulse. 11th: Thermal Detonation 4 impulse, Gravity Flight 4 impulse. 17th: Cryo Blast 6 impulse, Force Wall 5 impulse.",
				level: 6,
			},
			{
				name: "Conversion Mastery",
				description:
					"Spend 1 extra impulse point on a discipline to increase its save DC by 2. Your elemental output has been perfected.",
				level: 17,
			},
		],
		abilities: [
			{
				name: "Omni-Burst",
				description:
					"30-ft cone: 2d6 fire+2d6 cold+2d6 lightning+2d6 force. 5 impulse points.",
				cooldown: 0,
				cost: "5 impulse points",
			},
		],
		stats: {
			primaryAttribute: "Dexterity",
			secondaryAttribute: "Wisdom",
			bonusStats: { dexterity: 1, wisdom: 2 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "striker--chaos-style",
		name: "Path of the Glitch Step",
		jobId: "striker",
		jobName: "Striker",
		tier: 2,
		pathType: "drunken-master",
		requirements: { level: 3, skills: ["Acrobatics", "Performance"] },
		description:
			"Street performers, skateboarders, and people with unusual neurological conditions whose impulse networks fire in seemingly random patterns. CCTV footage of Glitch Steps in combat looks like a video buffering — they stumble into perfect dodges, trip into devastating counters, and sway out of gunfire. Fight analysts can't predict their movements because the movements aren't consciously planned.",
		features: [
			{
				name: "Erratic Movement",
				description:
					"When you use Gate of Force (Rapid Barrage): gain Disengage and +10 ft speed until end of turn. Your chaotic movement confuses defenders.",
				level: 3,
			},
			{
				name: "Glitch Redirect",
				description:
					"Stand from prone = 5 ft. When missed with melee, spend 1 impulse to redirect the attack to another creature within 5 ft. Your body glitches out of the way.",
				level: 6,
			},
			{
				name: "Error Correction",
				description:
					"When you have disadvantage on check/attack/save, spend 2 impulse to cancel disadvantage. Your system auto-corrects the glitch.",
				level: 11,
			},
			{
				name: "Cascade Assault",
				description:
					"Gate of Force (Rapid Barrage): up to 3 additional attacks (5 total), each must target a different creature. Your glitching body appears everywhere at once.",
				level: 17,
			},
		],
		abilities: [
			{
				name: "Glitch Counter",
				description:
					"Reaction when missed within 5 ft: unarmed strike with advantage as your body glitches into a counterattack. Prof uses/short rest.",
				cooldown: 0,
				cost: "Reaction",
			},
		],
		stats: {
			primaryAttribute: "Dexterity",
			secondaryAttribute: "Charisma",
			bonusStats: { dexterity: 2, charisma: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "striker--weapon-saint",
		name: "Path of the Blade Conductor",
		jobId: "striker",
		jobName: "Striker",
		tier: 2,
		pathType: "kensei",
		requirements: { level: 3, skills: ["Athletics", "Acrobatics"] },
		description:
			"Fencers, kendo champions, knife makers, and weapons collectors who discovered their impulse gates extend through held weapons. Their bonded weapons move faster than the eye can track, vibrating at frequencies that cut through gate-monster armor like butter. Many teach at prestigious hunter academies or appear in luxury weapon brand commercials.",
		features: [
			{
				name: "Neural Weapon Bond",
				description:
					"Choose 2 weapons (1 melee, 1 ranged, no heavy/special). They connect to your impulse network and count as Striker weapons. Melee bonded weapon + unarmed in same turn = +2 AC. Ranged: 1 impulse for +1d4+SENSE mod damage.",
				level: 3,
			},
			{
				name: "Mana-Laced Edge",
				description:
					"Bonded weapons count as magical and deal force damage. Keen Strike: 1 impulse on bonded weapon hit = extra Impulse Combat die damage.",
				level: 6,
			},
			{
				name: "Force Honing",
				description:
					"Bonus action: spend 1-3 impulse, grant nonmagical bonded weapon equal bonus to attack/damage for 1 min. Your nerve network vibrates the blade at a molecular level.",
				level: 11,
			},
			{
				name: "Auto-Correction",
				description:
					"Miss with a bonded weapon on your turn → your impulse network auto-adjusts. Reroll the attack. Once/turn.",
				level: 17,
			},
		],
		abilities: [
			{
				name: "Blade Tempest",
				description:
					"Attack every creature within 10 ft with bonded weapon. Each hit: weapon + 2 Impulse Combat dice. 4 impulse points.",
				cooldown: 0,
				cost: "4 impulse points",
			},
		],
		stats: {
			primaryAttribute: "Dexterity",
			secondaryAttribute: "Wisdom",
			bonusStats: { dexterity: 2, wisdom: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "striker--vital-strike",
		name: "Path of the Nerve Surgeon",
		jobId: "striker",
		jobName: "Striker",
		tier: 2,
		pathType: "mercy",
		requirements: { level: 3, skills: ["Medicine", "Insight"] },
		description:
			"Surgeons, physical therapists, acupuncturists, and combat medics who understand impulse pathways intimately. In the modern hunter world, Nerve Surgeons are the most sought-after raid members — they heal teammates mid-combat with a touch and shut down enemy motor functions with precisely placed strikes. Many run rehabilitation clinics for gate-injured hunters by day and clear gates by night.",
		features: [
			{
				name: "Medical Training",
				description: "Prof in Insight, Medicine, herbalism kit.",
				level: 3,
			},
			{
				name: "Restorative Touch",
				description:
					"During Rapid Barrage: replace one attack with a healing touch = 1 Impulse Combat die + SENSE mod HP restored. 1 impulse to also end disease or blinded/deafened/paralyzed/poisoned/stunned.",
				level: 3,
			},
			{
				name: "Nerve Shutdown",
				description:
					"During Rapid Barrage hit: spend 1 impulse to deal extra necrotic = 1 Impulse Combat die + SENSE mod. Target's motor functions seize — poisoned until end of your next turn.",
				level: 3,
			},
			{
				name: "Advanced Nerve Surgery",
				description:
					"Restorative Touch also ends frightened or charmed. Nerve Shutdown: the motor seizure requires no save.",
				level: 6,
			},
			{
				name: "Surgical Barrage",
				description:
					"Replace each Rapid Barrage attack with Restorative Touch (no impulse cost for heal). Nerve Shutdown once per turn without spending impulse.",
				level: 11,
			},
			{
				name: "Neural Resurrection",
				description:
					"Touch a creature that died within 24 hours: spend 5 impulse points to restart its nervous system. Returns to life with 4d10+SENSE mod HP, cured of all conditions. Once/long rest.",
				level: 17,
			},
		],
		abilities: [
			{
				name: "Impulse Heal",
				description:
					"Touch an ally: restore 2d8+SENSE mod HP and purge one condition by resetting their nerve pathways. 2 impulse points.",
				cooldown: 0,
				cost: "2 impulse points",
			},
		],
		stats: {
			primaryAttribute: "Wisdom",
			secondaryAttribute: "Dexterity",
			bonusStats: { wisdom: 2, dexterity: 1 },
		},
		source: "System Ascendant Canon",
	},

	// ── MAGE PATHS ── features at 2,6,10,14 ──
	{
		id: "mage--evocation",
		name: "Path of the Detonation Specialist",
		jobId: "mage",
		jobName: "Mage",
		tier: 2,
		pathType: "evocation",
		requirements: { level: 2, skills: ["Arcana"] },
		description:
			"Military demolitions experts, pyrotechnicians, and controlled-detonation engineers who compile the System's most destructive spell routines with surgical precision. Defense contractors pay them obscene consulting fees. They shape blast radii around allies like a surgeon shapes an incision and overload spells to deal maximum theoretical damage — the heavy artillery of any gate raid.",
		features: [
			{
				name: "Precision Targeting",
				description:
					"When you cast a damage spell affecting an area, choose up to 1+spell level creatures. They auto-succeed on saves and take no damage. Your System HUD excludes friendly targets.",
				level: 2,
			},
			{
				name: "Residual Damage",
				description:
					"When a creature succeeds on a save against your cantrip, your compiled routine still deals half damage. The System ensures partial detonation.",
				level: 6,
			},
			{
				name: "Output Amplification",
				description:
					"Add INT mod to the damage of any evocation spell you cast. Your compilations are optimized for maximum yield.",
				level: 10,
			},
			{
				name: "Overclock Compilation",
				description:
					"When you cast a 5th-level or lower damage spell, deal maximum damage (no rolling). Use again before long rest: System strain deals 2d12 necrotic per spell level to you (increases each use).",
				level: 14,
			},
		],
		abilities: [
			{
				name: "Maximum Yield",
				description:
					"Next damage spell deals maximum damage. Once/long rest (additional uses cause 2d12 necrotic per level from System strain).",
				cooldown: 3,
				cost: "Free",
			},
		],
		stats: {
			primaryAttribute: "Intelligence",
			secondaryAttribute: "Constitution",
			bonusStats: { intelligence: 2, constitution: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "mage--abjuration",
		name: "Path of the Shield Compiler",
		jobId: "mage",
		jobName: "Mage",
		tier: 2,
		pathType: "abjuration",
		requirements: { level: 2, skills: ["Arcana"] },
		description:
			"Cybersecurity analysts, network architects, and IT security consultants who specialize in defensive spell routines. They generate persistent mana barriers like firewalls — absorbing damage and rejecting hostile magic. Every serious guild runs a Shield Compiler the way every corporation runs a security team. Their protection subroutines run continuously in the background, keeping raid parties alive.",
		features: [
			{
				name: "Mana Barrier",
				description:
					"When you compile an abjuration spell of 1st+, generate a barrier with HP = 2×Mage level+INT mod. Damage to you hits the barrier first. Compiling abjuration spells restores 2×spell level HP to the barrier.",
				level: 2,
			},
			{
				name: "Projected Barrier",
				description:
					"Reaction: when a creature within 30 ft takes damage, your Mana Barrier absorbs it instead. You redirect your shield remotely.",
				level: 6,
			},
			{
				name: "Optimized Countermeasures",
				description:
					"Add prof bonus to ability checks for counter-spell routines (Counterspell, Dispel Magic). Your counter-compilation is highly optimized.",
				level: 10,
			},
			{
				name: "Spell Immunity Matrix",
				description:
					"Advantage on saves against spells. Resistance to spell damage. Your defensive matrix auto-filters hostile magic.",
				level: 14,
			},
		],
		abilities: [
			{
				name: "Barrier Restoration",
				description:
					"Restore your Mana Barrier to full HP by channeling ambient System energy. Once/long rest.",
				cooldown: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Intelligence",
			secondaryAttribute: "Constitution",
			bonusStats: { intelligence: 2, constitution: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "mage--divination",
		name: "Path of the Probability Engine",
		jobId: "mage",
		jobName: "Mage",
		tier: 2,
		pathType: "divination",
		requirements: { level: 2, skills: ["Arcana", "Insight"] },
		description:
			"Statisticians, quant traders, actuaries, and data scientists who tap into the System's predictive algorithms. Wall Street firms and government intelligence agencies fight to recruit them. They pre-compute future outcomes and overwrite them with preferred results — they don't see the future, they calculate it, then choose which branch of reality to actualize.",
		features: [
			{
				name: "Pre-Computation",
				description:
					"After long rest, run 2 probability simulations (roll 2d20, record results). You can substitute any attack/save/check made by you or a visible creature with a pre-computed result. Results refresh on long rest.",
				level: 2,
			},
			{
				name: "Efficient Scanning",
				description:
					"When you compile a divination spell of 2nd+, the efficient routine refunds energy: regain one spell slot of lower level (max 5th).",
				level: 6,
			},
			{
				name: "Expanded Perception",
				description:
					"Action: activate one enhanced sensor until rest: darkvision 60 ft, see ethereal 60 ft, decode any language, or detect invisible within 10 ft.",
				level: 10,
			},
			{
				name: "Enhanced Pre-Computation",
				description:
					"Run 3 probability simulations (roll 3d20) instead of 2. Your predictive algorithms are more powerful.",
				level: 14,
			},
		],
		abilities: [
			{
				name: "Probability Override",
				description:
					"Force a creature to reroll any d20 and take the lower result. You override the probability branch. Once/short rest.",
				cooldown: 1,
				cost: "Reaction",
			},
		],
		stats: {
			primaryAttribute: "Intelligence",
			secondaryAttribute: "Wisdom",
			bonusStats: { intelligence: 2, wisdom: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "mage--illusion",
		name: "Path of the Reality Faker",
		jobId: "mage",
		jobName: "Mage",
		tier: 2,
		pathType: "illusion",
		requirements: { level: 2, skills: ["Arcana", "Deception"] },
		description:
			"Special effects artists, deepfake specialists, VFX engineers, and con artists who compile illusion routines so sophisticated the System itself can't tell them from real data. Hollywood studios and intelligence agencies both recruit them. Their constructs fool all senses simultaneously, and at peak power, their fakes become genuinely real — they hack reality by making the System believe the illusion IS reality.",
		features: [
			{
				name: "Enhanced Projection",
				description:
					"Learn Minor Illusion cantrip (free). Can project both sound and image simultaneously in a single compilation.",
				level: 2,
			},
			{
				name: "Live Editing",
				description:
					"When you cast an illusion with 1+ min duration, use an action to dynamically alter the illusion's properties in real-time.",
				level: 6,
			},
			{
				name: "Decoy Protocol",
				description:
					"Reaction when attacked: project a decoy that causes the attack to miss. Your body was never where they thought. Once/short rest.",
				level: 10,
			},
			{
				name: "Reality Injection",
				description:
					"When you cast a 1st+ illusion spell, choose one inanimate object in the illusion — it becomes genuinely real for 1 minute as the System accepts the fake data. Cannot deal damage directly.",
				level: 14,
			},
		],
		abilities: [
			{
				name: "Fake Terrain",
				description:
					"Compile a 30-ft cube of illusory difficult terrain that feels real. INT save to disbelieve. 1 min.",
				cooldown: 2,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Intelligence",
			secondaryAttribute: "Charisma",
			bonusStats: { intelligence: 2, charisma: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "mage--conjuration",
		name: "Path of the Rift Caller",
		jobId: "mage",
		jobName: "Mage",
		tier: 2,
		pathType: "conjuration",
		requirements: { level: 2, skills: ["Arcana"] },
		description:
			"Logistics managers, shipping engineers, and quantum physics researchers who specialize in tearing open micro-gates. They pull matter from other dimensions, teleport through dimensional shortcuts, and summon reinforcements from the spaces between gates. Amazon's R&D division tried to recruit one for 'instant delivery' — she declined. They treat space as a suggestion.",
		features: [
			{
				name: "Micro-Gate Fabrication",
				description:
					"Action: open a tiny rift and pull an inanimate object through (3 ft per side, 10 lbs max). Lasts until you use this again, take damage, or 1 hour passes.",
				level: 2,
			},
			{
				name: "Rift Step",
				description:
					"Action: teleport 30 ft, or swap positions with a willing Small/Medium creature within 30 ft. Once/long rest or until you cast a conjuration spell.",
				level: 6,
			},
			{
				name: "Stabilized Rifts",
				description:
					"Your concentration on a conjuration spell can't be broken by damage. Your rifts are structurally reinforced.",
				level: 10,
			},
			{
				name: "Reinforced Summons",
				description:
					"Creatures pulled through your rifts arrive bolstered: conjuration summons gain 30 temp HP from rift energy.",
				level: 14,
			},
		],
		abilities: [
			{
				name: "Emergency Rift",
				description:
					"Teleport up to 60 ft as a bonus action via micro-gate. Prof uses/long rest.",
				cooldown: 0,
				cost: "Bonus action",
			},
		],
		stats: {
			primaryAttribute: "Intelligence",
			secondaryAttribute: "Constitution",
			bonusStats: { intelligence: 2, constitution: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "mage--transmutation",
		name: "Path of the Matter Hacker",
		jobId: "mage",
		jobName: "Mage",
		tier: 2,
		pathType: "transmutation",
		requirements: { level: 2, skills: ["Arcana", "Investigation"] },
		description:
			"Materials scientists, chemists, 3D-printing engineers, and nanotechnology researchers who exploit the System's material data layer. They rewrite physical properties at the molecular level — turning steel to glass, lead to gold, concrete to water. Pharmaceutical companies and mining corporations pay fortunes for their consulting. At peak power, they create Mana Cores — crystallized sources of permanent transmutation energy.",
		features: [
			{
				name: "Material Rewrite",
				description:
					"Spend 10 min to rewrite one material into another (wood→stone, metal→crystal, etc.). Reverts after 1 hour or if you use this again.",
				level: 2,
			},
			{
				name: "Mana Core",
				description:
					"Spend 8 hours to crystallize ambient mana into a core granting one of: darkvision 60 ft, +10 ft speed, proficiency in VIT saves, or resistance to acid/cold/fire/lightning/thunder. Rewrite the core's effect when you cast a transmutation spell.",
				level: 6,
			},
			{
				name: "Bio-Transmutation",
				description:
					"Add Polymorph to your grimoire (free). Cast it without a slot to assume a beast form of CR 1 or lower. Once/short rest. Your body temporarily rewrites itself.",
				level: 10,
			},
			{
				name: "Master Rewrite",
				description:
					"Destroy your Mana Core for one: transmute any nonmagical object into another of similar size/mass, purge all curses/diseases/poisons from a creature, compile Raise Dead without a slot, or reverse a creature's aging by 3d10 years.",
				level: 14,
			},
		],
		abilities: [
			{
				name: "Molecular Override",
				description:
					"Touch an object and rewrite its material composition for 1 hour. Once/short rest.",
				cooldown: 1,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Intelligence",
			secondaryAttribute: "Wisdom",
			bonusStats: { intelligence: 2, wisdom: 1 },
		},
		source: "System Ascendant Canon",
	},

	// ── ESPER PATHS ── features at 1,6,14,18 ──
	{
		id: "esper--draconic-bloodline",
		name: "Path of the Gate Dragon Lineage",
		jobId: "esper",
		jobName: "Esper",
		tier: 2,
		pathType: "draconic",
		requirements: { level: 1, skills: ["Arcana"] },
		description:
			"Espers whose anomalous mana carries the essence of ancient gate dragons — creatures that existed before the System itself. Their awakening was explosive; many destroyed their apartment, office, or school gym during the event. Their flux manifests as elemental fury, their bodies toughening with crystallized draconic scales visible under their skin. Dermatologists are baffled.",
		features: [
			{
				name: "Draconic Imprint",
				description:
					"Choose a gate dragon type. Double prof bonus on PRE checks with draconic creatures. Instinctively understand Draconic language.",
				level: 1,
			},
			{
				name: "Mana Scale Armor",
				description:
					"Draconic mana reinforces your body. HP +1 per Esper level. Unarmored AC = 13+AGI mod.",
				level: 1,
			},
			{
				name: "Elemental Resonance",
				description:
					"When you cast a spell matching your dragon's element, add PRE mod to one damage roll. Spend 1 flux for resistance to that element for 1 hour.",
				level: 6,
			},
			{
				name: "Mana Wings",
				description:
					"Bonus action: manifest wings of crystallized mana. Fly speed = walking speed. Last until dismissed.",
				level: 14,
			},
			{
				name: "Draconic Authority",
				description:
					"Action: 60-ft aura of draconic pressure. PRE save or charmed/frightened. 1 min, concentration. 5 flux.",
				level: 18,
			},
		],
		abilities: [
			{
				name: "Dragon Breath",
				description:
					"30-ft cone or 60-ft line: 4d8 damage of your lineage type, AGI save for half. 3 flux.",
				cooldown: 0,
				cost: "3 flux",
			},
		],
		stats: {
			primaryAttribute: "Charisma",
			secondaryAttribute: "Constitution",
			bonusStats: { charisma: 2, constitution: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "esper--wild-magic",
		name: "Path of the Mana Cascade",
		jobId: "esper",
		jobName: "Esper",
		tier: 2,
		pathType: "wild-magic",
		requirements: { level: 1, skills: ["Arcana"] },
		description:
			"Espers with the most volatile anomalous connections — the ones whose awakening caused a blackout, a freak hailstorm, or turned their dorm room ceiling into glass. Their flux reactor occasionally overflows, triggering random cascading effects that have variously healed bystanders, set fire to dumpsters, and turned a traffic light into a bird. The Hunter Bureau flags them as unstable assets.",
		features: [
			{
				name: "Cascade Trigger",
				description:
					"After casting 1st+ spell, DM can have you roll d20. On 1, roll on Mana Cascade table for a random magical discharge.",
				level: 1,
			},
			{
				name: "Riding the Cascade",
				description:
					"Lean into your instability. Gain advantage on one attack/check/save. Before regaining, DM can trigger a Cascade after your next spell (no d20 roll).",
				level: 1,
			},
			{
				name: "Probability Nudge",
				description:
					"Reaction: when a visible creature makes attack/check/save, spend 2 flux to roll 1d4 and add or subtract from their roll. You nudge the probability.",
				level: 6,
			},
			{
				name: "Selective Cascade",
				description:
					"When you roll on Cascade table, roll twice and choose which result manifests.",
				level: 14,
			},
			{
				name: "Chain Reaction",
				description:
					"When you roll max on a damage die for a spell, reroll that die and add to total. Your flux chain-reacts. Once per turn.",
				level: 18,
			},
		],
		abilities: [
			{
				name: "Cascade Bolt",
				description:
					"Hurl raw unstable mana: 2d8+1d6, damage type random. If both d8s match, the bolt cascades to another target.",
				cooldown: 0,
				cost: "1st-level slot",
			},
		],
		stats: {
			primaryAttribute: "Charisma",
			secondaryAttribute: "Constitution",
			bonusStats: { charisma: 2, constitution: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "esper--shadow-magic",
		name: "Path of the Void Resonance",
		jobId: "esper",
		jobName: "Esper",
		tier: 2,
		pathType: "shadow",
		requirements: { level: 1, skills: ["Stealth", "Arcana"] },
		description:
			"Espers who draw power from the empty space between gate dimensions — the void that separates realities. They tend to be quiet, withdrawn people who were already comfortable in the dark before awakening. Streetlights flicker when they pass, shadows move wrong around them, and pets avoid them. They command absolute darkness, summon void hounds, and can dissolve their physical form into pure shadow-mana.",
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
				cooldown: 0,
				cost: "2 flux",
			},
		],
		stats: {
			primaryAttribute: "Charisma",
			secondaryAttribute: "Constitution",
			bonusStats: { charisma: 2, constitution: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "esper--storm-sorcery",
		name: "Path of the Tempest Core",
		jobId: "esper",
		jobName: "Esper",
		tier: 2,
		pathType: "storm",
		requirements: { level: 1, skills: ["Arcana", "Nature"] },
		description:
			"Storm chasers, electrical linesmen, and surfers whose anomalous connection manifests as electromagnetic fury. Lightning arcs from their skin during emotional moments, wind shifts when they gesture, and weather apps glitch within a block of them. Power companies hate them; the military loves them. Their flux reactor runs on storm energy.",
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
				cooldown: 0,
				cost: "3rd-level slot",
			},
		],
		stats: {
			primaryAttribute: "Charisma",
			secondaryAttribute: "Constitution",
			bonusStats: { charisma: 2, constitution: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "esper--divine-soul",
		name: "Path of the System Spark",
		jobId: "esper",
		jobName: "Esper",
		tier: 2,
		pathType: "divine-soul",
		requirements: { level: 1, skills: ["Arcana", "Religion"] },
		description:
			"Espers who carry a fragment of the System's core energy — not gate mana, but the System itself. Often former caregivers, teachers, or medical students whose empathy somehow resonated with the System's restorative layer during awakening. They access both destructive Esper frequencies and Herald healing transmissions, making them the rarest anomaly type. Hospitals and guilds fight over their contracts.",
		features: [
			{
				name: "Dual Frequency Access",
				description:
					"Learn one Herald transmission based on affinity (Restoration: Cure Wounds, Entropy: Inflict Wounds, Order: Bless, Chaos: Bane, Balance: Protection from Evil and Good). Access both Esper and Herald spell lists.",
				level: 1,
			},
			{
				name: "System Favor",
				description:
					"When you fail a save or miss an attack, the System nudges reality. Add 2d4 to the roll. Once/short rest.",
				level: 1,
			},
			{
				name: "Healing Amplification",
				description:
					"When you or ally within 5 ft rolls dice to heal with a spell, spend 1 flux to reroll any number of those dice. Once/turn.",
				level: 6,
			},
			{
				name: "Mana Wings",
				description:
					"Bonus action: manifest spectral wings of System energy. 30-ft fly speed. Last until dismissed.",
				level: 14,
			},
			{
				name: "Emergency Restoration",
				description:
					"When below half HP, bonus action: the System floods you with restorative energy. Regain HP = half your HP max. Once/long rest.",
				level: 18,
			},
		],
		abilities: [
			{
				name: "System Healing Surge",
				description:
					"Cast a healing spell and add PRE mod to each die of healing. The System amplifies your output. 2 flux.",
				cooldown: 0,
				cost: "2 flux",
			},
		],
		stats: {
			primaryAttribute: "Charisma",
			secondaryAttribute: "Wisdom",
			bonusStats: { charisma: 2, wisdom: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "esper--aberrant-mind",
		name: "Path of the Psionic Breach",
		jobId: "esper",
		jobName: "Esper",
		tier: 2,
		pathType: "aberrant",
		requirements: { level: 1, skills: ["Arcana", "Insight"] },
		description:
			"Espers touched by entities from beyond the known gate network — alien intelligences whose psionic imprint rewired their brains during awakening. Many report hearing whispers in languages that don't exist, seeing geometric patterns in their peripheral vision, and dreaming of places no human has visited. They cast with thought alone, their minds alien and impenetrable. Psychiatrists can't help them; neurologists can't explain them.",
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
				cooldown: 0,
				cost: "2 flux",
			},
		],
		stats: {
			primaryAttribute: "Charisma",
			secondaryAttribute: "Intelligence",
			bonusStats: { charisma: 2, intelligence: 1 },
		},
		source: "System Ascendant Canon",
	},

	// ── REVENANT PATHS ── features at 2,6,10,14 ──
	{
		id: "revenant--grave-lord",
		name: "Path of the Decay Master",
		jobId: "revenant",
		jobName: "Revenant",
		tier: 2,
		pathType: "necromancy",
		requirements: { level: 2, skills: ["Arcana", "Medicine"] },
		description:
			"Former morticians, forensic pathologists, and biohazard cleanup workers who push offensive entropy to its most destructive extreme. In gate raids, every kill accelerates the chain reaction — necrotic energy cascades outward from corpses, withering nearby enemies. The Hunter Bureau deploys them against high-density gate infestations. The longer a fight goes, the more bodies fuel their power.",
		features: [
			{
				name: "Efficient Entropy",
				description:
					"Half gold and time to copy necromancy spells. Your Death Harvest restores additional HP = 2× spell level when you kill with a 1st+ spell (3× for necromancy). Not on constructs or undead.",
				level: 2,
			},
			{
				name: "Cascading Decay",
				description:
					"When you kill a creature with a spell, entropy chain-reacts: all creatures within 10 ft of the corpse take necrotic damage = spell level + INT mod. If this kills another creature, it chains again.",
				level: 2,
			},
			{
				name: "Accelerated Rot",
				description:
					"Your necrotic spells eat through defenses. When you deal necrotic damage to a creature, its AC is reduced by 1 until end of your next turn (doesn't stack).",
				level: 6,
			},
			{
				name: "Corpse Detonation",
				description:
					"Action: target a corpse within 60 ft. It detonates in a 15-ft radius as stored entropy explodes outward. Creatures take necrotic damage = 2d8 + your Revenant level (VIT half). Prof bonus uses/long rest.",
				level: 10,
			},
			{
				name: "Entropy Cascade",
				description:
					"When your Cascading Decay chains to a third or subsequent creature, the damage increases by 1d8 per chain link. Your decay is exponential.",
				level: 14,
			},
		],
		abilities: [
			{
				name: "Mass Detonation",
				description:
					"Detonate up to 3 corpses simultaneously within 120 ft. Each explodes for 3d8+INT mod necrotic in 15 ft (VIT half). Overlapping areas stack. Once/long rest.",
				cooldown: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Intelligence",
			secondaryAttribute: "Constitution",
			bonusStats: { intelligence: 2, constitution: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "revenant--soul-reaper",
		name: "Path of the Entropy Drinker",
		jobId: "revenant",
		jobName: "Revenant",
		tier: 2,
		pathType: "enchantment",
		requirements: { level: 2, skills: ["Arcana", "Persuasion"] },
		description:
			"Former energy healers, yoga instructors, and wellness gurus whose death-gate experience inverted their connection to vitality. Now they feed on the living — siphoning life force through their decay field. Teammates describe feeling slightly tired around them; enemies describe feeling like they're aging decades in seconds. Many work night shifts to avoid public spaces where their passive drain unsettles people.",
		features: [
			{
				name: "Vitality Siphon",
				description:
					"When you deal necrotic damage with a spell, gain temp HP = half the damage dealt (once per turn). Your entropy field passively converts enemy life force into sustenance.",
				level: 2,
			},
			{
				name: "Weakening Aura",
				description:
					"Creatures that start their turn within 10 ft of you have disadvantage on their next STR or VIT check/save until the start of their next turn. Your presence saps physical vitality.",
				level: 2,
			},
			{
				name: "Entropic Leech",
				description:
					"When a creature within 30 ft regains HP (from any source), you can use your reaction to steal half the healing — they gain half, you gain the other half as temp HP. Prof bonus uses/long rest.",
				level: 6,
			},
			{
				name: "Drain Resistance",
				description:
					"When you have temp HP from any Revenant feature, you have resistance to the damage type of the last spell you cast. Your stolen vitality adapts.",
				level: 10,
			},
			{
				name: "Total Consumption",
				description:
					"Action: target one creature within 30 ft. For 1 minute (concentration), at the start of each of its turns it takes 3d6 necrotic and you regain HP equal to the damage dealt. VIT save ends. Once/long rest.",
				level: 14,
			},
		],
		abilities: [
			{
				name: "Life Drain Burst",
				description:
					"All creatures within 15 ft: VIT save or take 3d8 necrotic. You regain HP = total damage dealt across all targets. Once/short rest.",
				cooldown: 1,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Intelligence",
			secondaryAttribute: "Charisma",
			bonusStats: { intelligence: 2, charisma: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "revenant--war-necromancer",
		name: "Path of the Wither Guard",
		jobId: "revenant",
		jobName: "Revenant",
		tier: 2,
		pathType: "war-magic",
		requirements: { level: 2, skills: ["Arcana", "Athletics"] },
		description:
			"Former riot police, bodyguards, and defensive driving instructors who weaponize entropy defensively. Their armor corrodes incoming attacks, enemy weapons rust mid-swing, and zones around them become no-man's-lands of accelerated decay. The Hunter Bureau assigns them as VIP protection — nothing hostile survives long near a Wither Guard.",
		features: [
			{
				name: "Entropic Deflection",
				description:
					"Reaction when hit or fail save: entropy corrodes the attack. +2 AC vs that attack or +4 to that save. Until end of next turn, can only cast cantrips. No uses limit.",
				level: 2,
			},
			{
				name: "Decay Reflexes",
				description:
					"Your reconstructed body processes entropy data rapidly. Add INT mod to initiative rolls.",
				level: 2,
			},
			{
				name: "Corrode Magic",
				description:
					"When you successfully counter or dispel a spell, the entropy absorbs it as a charge (max stored = INT mod). Spend a charge on any Revenant spell to add +half Revenant level necrotic damage.",
				level: 6,
			},
			{
				name: "Entropy Concentration",
				description:
					"While concentrating on a spell, your Decay Field reinforces your focus: +2 AC and +2 to all saves.",
				level: 10,
			},
			{
				name: "Withering Retaliation",
				description:
					"When you use Entropic Deflection, entropy lashes back: up to 3 creatures of your choice within 60 ft take half Revenant level necrotic damage and have their speed reduced by 10 ft until end of their next turn.",
				level: 14,
			},
		],
		abilities: [
			{
				name: "Entropy Carapace",
				description:
					"Encase yourself in crystallized decay: +3 AC for 1 min. Melee attackers take 1d8 necrotic and have disadvantage on their next attack (their weapon corrodes). Once/long rest.",
				cooldown: 3,
				cost: "Bonus action",
			},
		],
		stats: {
			primaryAttribute: "Intelligence",
			secondaryAttribute: "Constitution",
			bonusStats: { intelligence: 2, constitution: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "revenant--blade-wraith",
		name: "Path of the Entropy Blade",
		jobId: "revenant",
		jobName: "Revenant",
		tier: 2,
		pathType: "bladesinging",
		requirements: { level: 2, skills: ["Arcana", "Acrobatics"] },
		description:
			"Former fencers, dancers, and martial artists who channel decay through their weapons in a lethal close-range dance. Every strike ages matter on contact — steel rusts, flesh withers, stone crumbles. Their sparring videos go viral because the training dummies visibly decompose mid-fight. The most mobile Revenant path, phasing through their own decay field to strike from impossible angles.",
		features: [
			{
				name: "Decay Dance",
				description:
					"Bonus action: activate Decay Dance (1 min, ends if 2-handing weapon, medium/heavy armor, or incapacitated). Effects: +INT mod AC, +10 ft speed, advantage on Acrobatics, +INT mod to VIT concentration saves. 2 uses/short rest.",
				level: 2,
			},
			{
				name: "Corroding Strike",
				description:
					"Attack twice per Attack action. One attack can be replaced with casting a cantrip. On hit, the target's nonmagical armor/shield loses 1 AC permanently (cumulative, repaired during long rest).",
				level: 6,
			},
			{
				name: "Entropy Guard",
				description:
					"While Decay Dance active, reaction when you take damage: expend a spell slot, reduce damage by 5× slot level as entropy absorbs the kinetic energy and converts it to decay.",
				level: 10,
			},
			{
				name: "Lethal Entropy",
				description:
					"While Decay Dance active, add INT mod to melee weapon damage as necrotic. Creatures you hit cannot regain HP until the start of your next turn — your blade prevents cellular repair.",
				level: 14,
			},
		],
		abilities: [
			{
				name: "Withering Dance",
				description:
					"While Decay Dance active: teleport 15 ft before each melee attack through your own decay field. Each hit deals 1d6 extra necrotic and ages nonmagical equipment. 1 min, once/long rest.",
				cooldown: 3,
				cost: "Bonus action",
			},
		],
		stats: {
			primaryAttribute: "Intelligence",
			secondaryAttribute: "Dexterity",
			bonusStats: { intelligence: 2, dexterity: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "revenant--chronurgist",
		name: "Path of the Plague Weaver",
		jobId: "revenant",
		jobName: "Revenant",
		tier: 2,
		pathType: "chronurgy",
		requirements: { level: 2, skills: ["Arcana", "Medicine"] },
		description:
			"Former epidemiologists, CDC researchers, and bioweapons analysts who weaponize entropy as contagion. Their spells carry decaying conditions that spread between creatures like a virus — the WHO has classified their abilities as a potential pandemic vector. They don't just damage one target; they infect it, and the infection jumps to the next. Entire gate encounters unravel as their entropic plague cascades through enemy ranks.",
		features: [
			{
				name: "Entropic Contagion",
				description:
					"When you deal necrotic damage to a creature with a spell, you can mark it as a carrier (INT mod marks active at once). At the start of a carrier's turn, one creature within 5 ft of it takes necrotic damage = your INT mod. Mark lasts 1 minute.",
				level: 2,
			},
			{
				name: "Accelerated Infection",
				description:
					"Your entropic conditions spread faster. Add INT mod to initiative. When you inflict a condition with a spell (poisoned, frightened, etc.), the save DC increases by 1.",
				level: 2,
			},
			{
				name: "Plague Burst",
				description:
					"Action: detonate all active Entropic Contagion marks simultaneously. Each carrier and all creatures within 10 ft of a carrier take 2d6 necrotic (VIT half). Marks are consumed. INT mod uses/long rest.",
				level: 6,
			},
			{
				name: "Viral Entropy",
				description:
					"When a creature fails a save against your spell while marked by Entropic Contagion, the mark jumps to one additional creature within 30 ft (no save). Your plague is self-replicating.",
				level: 10,
			},
			{
				name: "Pandemic Protocol",
				description:
					"Once/long rest, your next necrotic spell automatically marks every creature it damages as a carrier. Additionally, carriers have disadvantage on saves against your spells.",
				level: 14,
			},
		],
		abilities: [
			{
				name: "Patient Zero",
				description:
					"Touch a creature: it becomes a super-carrier for 1 min. All creatures within 15 ft of it at the start of its turn take 2d8 necrotic (VIT half) and are marked as carriers. Once/long rest.",
				cooldown: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Intelligence",
			secondaryAttribute: "Wisdom",
			bonusStats: { intelligence: 2, wisdom: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "revenant--graviturgist",
		name: "Path of the Threshold Walker",
		jobId: "revenant",
		jobName: "Revenant",
		tier: 2,
		pathType: "graviturgy",
		requirements: { level: 2, skills: ["Arcana", "Insight"] },
		description:
			"Former hospice workers, trauma counselors, and near-death experience researchers who stand on the exact boundary between life and death. They pull allies back from the brink and shove enemies over it — the only Revenants who can heal. Emergency rooms request them by name. Entropy flows both ways for them: reverse decay to heal, or accelerate it to kill. The ultimate life-death arbiter.",
		features: [
			{
				name: "Reverse Entropy",
				description:
					"When you cast a necromancy spell, you can choose to reverse its entropy: the spell heals for the same amount it would have damaged (necrotic becomes healing). This costs the spell slot as normal. You are the only Revenant who can heal.",
				level: 2,
			},
			{
				name: "Death Sense",
				description:
					"You can see a creature's exact HP total (not just percentage). You know when any creature within 120 ft drops below half HP, reaches 0 HP, or dies. Your connection to the threshold is absolute.",
				level: 2,
			},
			{
				name: "Pull from the Threshold",
				description:
					"When an ally within 30 ft drops to 0 HP, reaction: they drop to 1 HP instead and gain temp HP = your INT mod + Revenant level. You pull them back from the death-gate. Prof bonus uses/long rest.",
				level: 6,
			},
			{
				name: "Push Past the Threshold",
				description:
					"When you deal necrotic damage to a creature that is below half HP, deal extra necrotic = your Revenant level. You accelerate their journey toward death.",
				level: 10,
			},
			{
				name: "Arbiter of Entropy",
				description:
					"Once/long rest, touch a creature that has died within the last minute. It returns to life with HP = your Revenant level + INT mod, cured of all conditions. OR touch a living creature: VIT save or it takes 10d6 necrotic as you drag it toward the threshold. You choose life or death.",
				level: 14,
			},
		],
		abilities: [
			{
				name: "Threshold Pulse",
				description:
					"30-ft radius: all allies regain 2d8 HP, all enemies take 2d8 necrotic (VIT half). You stand at the center of life and death. Once/long rest.",
				cooldown: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Intelligence",
			secondaryAttribute: "Wisdom",
			bonusStats: { intelligence: 2, wisdom: 1 },
		},
		source: "System Ascendant Canon",
	},

	// ── SUMMONER PATHS ── features at 2,6,10,14 ──
	{
		id: "summoner--circle-of-the-land",
		name: "Path of the Biome Specialist",
		jobId: "summoner",
		jobName: "Summoner",
		tier: 2,
		pathType: "land",
		requirements: { level: 2, skills: ["Nature"] },
		description:
			"Park rangers, botanists, and environmental scientists who attune to a specific gate ecosystem type. They recover mana by absorbing ambient gate energy more efficiently than any other Summoner — literally photosynthesizing in gate biomes. The Hunter Bureau's Ecology Division relies on them for biome-specific gate assessments.",
		features: [
			{
				name: "Biome Cantrip",
				description:
					"Learn one additional Summoner cantrip from your bonded biome.",
				level: 2,
			},
			{
				name: "Biome Absorption",
				description:
					"During short rest, absorb ambient gate energy: recover spell slots with combined level ≤ half Summoner level (round up). No 6th+. Once/long rest.",
				level: 2,
			},
			{
				name: "Biome Spells",
				description:
					"Gain bonus always-prepared spells at 3rd, 5th, 7th, and 9th level based on your bonded gate biome (Arctic Gate, Coastal Gate, Desert Gate, Forest Gate, Grassland Gate, Mountain Gate, Swamp Gate, or Subterranean Gate).",
				level: 3,
			},
			{
				name: "Terrain Fluidity",
				description:
					"Moving through nonmagical difficult terrain costs no extra movement. No damage from nonmagical plants. Advantage on saves vs magically created/manipulated flora.",
				level: 6,
			},
			{
				name: "Biome Immunity",
				description:
					"Immune to poison and disease. Can't be charmed or frightened by elementals or fey. Your body has fully adapted to gate environments.",
				level: 10,
			},
			{
				name: "Biome Sanctuary",
				description:
					"When a beast or plant creature attacks you, it must make a SENSE save or choose a different target/miss. Your biome attunement marks you as part of the ecosystem.",
				level: 14,
			},
		],
		abilities: [
			{
				name: "Biome Surge",
				description:
					"Channel the gate biome's energy: regain one spell slot up to 5th level and gain advantage on all Nature/Survival checks for 1 hour. Once/long rest.",
				cooldown: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Wisdom",
			secondaryAttribute: "Constitution",
			bonusStats: { wisdom: 2, constitution: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "summoner--circle-of-the-moon",
		name: "Path of the Apex Shifter",
		jobId: "summoner",
		jobName: "Summoner",
		tier: 2,
		pathType: "moon",
		requirements: { level: 2, skills: ["Nature", "Survival"] },
		description:
			"Zoo keepers, wildlife rehabilitators, and extreme sports athletes who are combat-focused Entity Shift specialists. They assume powerful gate creature forms far beyond what other Summoners can manage — becoming the front-line tank by literally transforming into the apex predators of gate ecosystems. Nature documentaries film them; children's toy lines are based on their forms.",
		features: [
			{
				name: "Combat Entity Shift",
				description:
					"Entity Shift as bonus action. While in gate creature form, spend a spell slot to regain 1d8 per slot level HP.",
				level: 2,
			},
			{
				name: "Advanced Forms",
				description:
					"Entity Shift into gate creatures of CR 1 (CR = Summoner level / 3 at higher levels). At 6th level, attacks in entity form count as magical.",
				level: 2,
			},
			{
				name: "Mana-Laced Attacks",
				description:
					"Attacks in entity form count as magical for overcoming resistance and immunity. Your shifted body channels mana through every strike.",
				level: 6,
			},
			{
				name: "Elemental Entity Shift",
				description:
					"Expend 2 Entity Shift uses to assume the form of an air, earth, fire, or water elemental from gate ecosystems.",
				level: 10,
			},
			{
				name: "Adaptive Physiology",
				description:
					"Cast Alter Self at will. Your body retains the ability to make minor biological shifts between full Entity Shifts.",
				level: 14,
			},
		],
		abilities: [
			{
				name: "Apex Entity Form",
				description:
					"Entity Shift into a CR = Summoner level gate creature or elemental for 1 hour. Retain all spellcasting. Once/long rest.",
				cooldown: 3,
				cost: "Bonus action",
			},
		],
		stats: {
			primaryAttribute: "Wisdom",
			secondaryAttribute: "Constitution",
			bonusStats: { wisdom: 2, constitution: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "summoner--circle-of-dreams",
		name: "Path of the Dream Gate",
		jobId: "summoner",
		jobName: "Summoner",
		tier: 2,
		pathType: "dreams",
		requirements: { level: 2, skills: ["Nature", "Insight"] },
		description:
			"Sleep researchers, lucid dreamers, and therapists who connect to the fey-frequency energies that bleed through certain gate boundaries. They heal with restorative biome magic, create hidden rest shelters in the middle of hostile gates, and teleport through dreamlike dimensional paths. Raid parties with a Dream Gate Summoner report significantly lower PTSD rates.",
		features: [
			{
				name: "Balm of the Summer Court",
				description:
					"Pool of d6s = Summoner level. Bonus action: heal a creature within 120 ft by spending dice (up to half Summoner level dice at once) + 1 temp HP per die spent.",
				level: 2,
			},
			{
				name: "Hearth of Moonlight and Shadow",
				description:
					"During a short/long rest, create a 30-ft sphere ward. Allies inside gain +5 to Stealth and Perception. Light becomes dim light inside.",
				level: 6,
			},
			{
				name: "Hidden Paths",
				description:
					"Bonus action: teleport yourself or a willing creature within 30 ft up to 60 ft to a visible unoccupied space. SENSE mod uses/long rest.",
				level: 10,
			},
			{
				name: "Walker in Dreams",
				description:
					"After a short rest, cast Dream, Scrying, or Teleportation Circle (to last rest location) without a slot. Once per long rest.",
				level: 14,
			},
		],
		abilities: [
			{
				name: "Fey Blessing",
				description:
					"All allies within 30 ft regain 2d8 HP and gain advantage on saves against charmed/frightened for 1 min. Once/long rest.",
				cooldown: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Wisdom",
			secondaryAttribute: "Charisma",
			bonusStats: { wisdom: 2, charisma: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "summoner--circle-of-the-shepherd",
		name: "Path of the Pack Leader",
		jobId: "summoner",
		jobName: "Summoner",
		tier: 2,
		pathType: "shepherd",
		requirements: { level: 2, skills: ["Nature", "Animal Handling"] },
		description:
			"Dog trainers, animal rescue coordinators, and pack-animal handlers who command gate creatures and primal spirits. They call totemic guardians from gate biomes and reinforce summoned entities with their mana. In raid parties, they are masters of action economy — one Pack Leader with a full menagerie is a one-person army. Animal shelters staffed by Pack Leaders have zero adoption returns.",
		features: [
			{
				name: "Speech of the Woods",
				description: "Speak with beasts. Learn Sylvan language.",
				level: 2,
			},
			{
				name: "Spirit Totem",
				description:
					"Bonus action: summon an incorporeal spirit to a point within 60 ft (60-ft aura, 1 min, concentration). Bear Spirit: allies gain temp HP = 5 + Summoner level, advantage on STR checks/saves. Hawk Spirit: allies have advantage on Perception and you give advantage on attack rolls as reaction. Unicorn Spirit: allies have advantage on detecting creatures in aura, healing spells in aura heal each creature in it for your Summoner level HP.",
				level: 2,
			},
			{
				name: "Mighty Summoner",
				description:
					"Beasts/fey you conjure gain +2 HP per hit die and their natural weapons count as magical.",
				level: 6,
			},
			{
				name: "Guardian Spirit",
				description:
					"Beasts/fey you summon that drop to 0 HP in Spirit Totem aura instead regain half their HP max.",
				level: 10,
			},
			{
				name: "Faithful Summons",
				description:
					"When you drop to 0 HP or are incapacitated, immediately conjure 4 beasts of CR 2 or lower within 20 ft. They last 1 hour and defend you. Once/long rest.",
				level: 14,
			},
		],
		abilities: [
			{
				name: "Pack Alpha",
				description:
					"All summoned/conjured creatures within 60 ft gain +2 to attack rolls and deal extra 1d4 damage for 1 min. Once/short rest.",
				cooldown: 1,
				cost: "Bonus action",
			},
		],
		stats: {
			primaryAttribute: "Wisdom",
			secondaryAttribute: "Constitution",
			bonusStats: { wisdom: 2, constitution: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "summoner--circle-of-spores",
		name: "Path of the Symbiote Network",
		jobId: "summoner",
		jobName: "Summoner",
		tier: 2,
		pathType: "spores",
		requirements: { level: 2, skills: ["Nature", "Medicine"] },
		description:
			"Mycologists, microbiologists, and fermentation specialists who bonded with microscopic organisms from deep gate ecosystems. Their bodies host mutualistic colonies that enhance their biology and form a living cloud of protective spores. Pharmaceutical companies study their symbiotes for drug development. They are a walking ecosystem — everything within their spore radius becomes part of it.",
		features: [
			{
				name: "Spore Cloud",
				description:
					"Reaction: creature you see within 10 ft takes VIT save or poison damage = 1d4 (scales: 1d6 at 6th, 1d8 at 10th, 1d10 at 14th). Your symbiotic organisms attack intruders.",
				level: 2,
			},
			{
				name: "Symbiotic Fusion",
				description:
					"Expend Entity Shift use: fuse with your symbiote colony. Gain 4 × Summoner level temp HP. While temp HP remains, Spore Cloud damage doubles and melee attacks deal extra 1d6 poison. Lasts 10 min.",
				level: 2,
			},
			{
				name: "Colony Expansion",
				description:
					"Reaction when a Small/Medium creature drops to 0 HP within 10 ft: your symbiotes colonize the body. It rises as a symbiote drone with 1 HP at start of your next turn, obeying you for 1 hour. SENSE mod uses/long rest.",
				level: 6,
			},
			{
				name: "Mobile Spore Zone",
				description:
					"While Symbiotic Fusion active, bonus action: project your Spore Cloud to a point within 30 ft as a 10-ft cube. Creatures entering/starting turn there take Spore Cloud damage (VIT save).",
				level: 10,
			},
			{
				name: "Fully Symbiotic",
				description:
					"Your symbiote colony protects all your senses. Can't be blinded, deafened, frightened, or poisoned. Crits against you become normal hits (unless incapacitated) — your colony absorbs the extra impact.",
				level: 14,
			},
		],
		abilities: [
			{
				name: "Spore Burst",
				description:
					"All creatures within 20 ft: VIT save or 4d8 poison + poisoned 1 min. Your symbiote colony erupts outward in a living cloud. Once/long rest.",
				cooldown: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Wisdom",
			secondaryAttribute: "Constitution",
			bonusStats: { wisdom: 2, constitution: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "summoner--circle-of-stars",
		name: "Path of the Star Map",
		jobId: "summoner",
		jobName: "Summoner",
		tier: 2,
		pathType: "stars",
		requirements: { level: 2, skills: ["Arcana", "Nature"] },
		description:
			"Astronomers, astrophysicists, and astrologers who draw power from the cosmic frequencies that permeate high-rank gates. They channel celestial energy into healing, destruction, or prophetic guidance. NASA consults them about anomalous deep-space signals that correlate with gate activity. The most mystical of all Summoner paths.",
		features: [
			{
				name: "Star Map",
				description:
					"Learn Guidance cantrip (free). Cast Guiding Bolt without a slot prof bonus times/long rest. Free focus for Summoner spells.",
				level: 2,
			},
			{
				name: "Starry Form",
				description:
					"Expend Wild Shape use, bonus action: take a starry form (10 min). Archer: ranged spell attack 60 ft, 1d8+SENSE radiant (bonus action each turn). Chalice: when you cast healing spell, one creature within 30 ft regains 1d8+SENSE HP. Dragon: treat any d20 roll below 10 as 10 on concentration checks and INT/SENSE checks.",
				level: 2,
			},
			{
				name: "Cosmic Omen",
				description:
					"After long rest, roll a die. Even (Weal): reaction to add 1d6 to a creature's d20 roll. Odd (Woe): reaction to subtract 1d6. Prof bonus uses/long rest.",
				level: 6,
			},
			{
				name: "Twinkling Constellations",
				description:
					"Starry Form: Archer becomes 2d8. Chalice becomes 2d8. Dragon also grants 20 ft fly speed (hover). At start of each turn, switch between forms.",
				level: 10,
			},
			{
				name: "Full of Stars",
				description:
					"While in Starry Form, resistance to bludgeoning, piercing, and slashing damage.",
				level: 14,
			},
		],
		abilities: [
			{
				name: "Starfall",
				description:
					"30-ft radius within 120 ft: 4d10 radiant, SENSE save for half, blinded until end of your next turn on fail. Once/long rest.",
				cooldown: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Wisdom",
			secondaryAttribute: "Intelligence",
			bonusStats: { wisdom: 2, intelligence: 1 },
		},
		source: "System Ascendant Canon",
	},

	// ── HERALD PATHS ── features at 1,2,6,8,17 ──
	{
		id: "herald--life-domain",
		name: "Path of the Restoration Protocol",
		jobId: "herald",
		jobName: "Herald",
		tier: 2,
		pathType: "life",
		requirements: { level: 1, skills: ["Medicine"] },
		description:
			"Emergency room doctors, trauma surgeons, and battlefield medics who channel the System's most potent healing frequencies. Hospitals with Restoration Protocol Heralds on staff have the lowest mortality rates in the world. Their restorative transmissions are unmatched, keeping entire raid parties alive through the worst gate encounters.",
		features: [
			{
				name: "Bonus Proficiency",
				description: "Gain proficiency with heavy armor.",
				level: 1,
			},
			{
				name: "Disciple of Life",
				description:
					"When you cast a healing spell of 1st+, the target regains additional HP = 2 + spell level.",
				level: 1,
			},
			{
				name: "Channel Divinity: Preserve Life",
				description:
					"Action: distribute HP = 5× Herald level among creatures within 30 ft (can't exceed half their max). No effect on undead or constructs.",
				level: 2,
			},
			{
				name: "Blessed Healer",
				description:
					"When you cast a healing spell of 1st+ on another creature, you regain HP = 2 + spell level.",
				level: 6,
			},
			{
				name: "Divine Strike",
				description:
					"Once per turn, weapon attacks deal extra 1d8 radiant (2d8 at 14th).",
				level: 8,
			},
			{
				name: "Supreme Healing",
				description:
					"When you roll dice to restore HP with a healing spell, use the maximum value for each die.",
				level: 17,
			},
		],
		abilities: [
			{
				name: "Mass Restoration",
				description:
					"All allies within 30 ft regain 3d8+SENSE mod HP and are cured of one condition each. Once/long rest.",
				cooldown: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Wisdom",
			secondaryAttribute: "Constitution",
			bonusStats: { wisdom: 2, constitution: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "herald--light-domain",
		name: "Path of the Radiance Protocol",
		jobId: "herald",
		jobName: "Herald",
		tier: 2,
		pathType: "light",
		requirements: { level: 1, skills: ["Religion"] },
		description:
			"Former lighthouse keepers, solar engineers, and stage lighting technicians who broadcast the System's most destructive light frequencies. Their radiant overloads have been captured on news footage — blinding flares visible from miles away during gate raids. They incinerate undead and shield allies in protective luminance.",
		features: [
			{
				name: "Bonus Cantrip",
				description:
					"Learn the Light cantrip (doesn't count against cantrips known).",
				level: 1,
			},
			{
				name: "Warding Flare",
				description:
					"Reaction when attacked by creature within 30 ft: impose disadvantage on the attack. SENSE mod uses/long rest.",
				level: 1,
			},
			{
				name: "Channel Divinity: Radiance of the Dawn",
				description:
					"Action: 30-ft radius — dispel magical darkness, hostile creatures take 2d10+Herald level radiant (VIT half). No damage to allies.",
				level: 2,
			},
			{
				name: "Improved Flare",
				description:
					"Warding Flare can protect others within 30 ft, not just yourself.",
				level: 6,
			},
			{
				name: "Potent Spellcasting",
				description: "Add SENSE mod to the damage of Herald cantrips.",
				level: 8,
			},
			{
				name: "Corona of Light",
				description:
					"Action: 60-ft bright light aura. Enemies in aura have disadvantage on saves vs fire/radiant spells. Lasts 1 min.",
				level: 17,
			},
		],
		abilities: [
			{
				name: "Solar Flare",
				description:
					"30-ft cone: 4d8 radiant, VIT save for half, blinded 1 round on fail. Once/short rest.",
				cooldown: 1,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Wisdom",
			secondaryAttribute: "Charisma",
			bonusStats: { wisdom: 2, charisma: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "herald--war-domain",
		name: "Path of the Combat Protocol",
		jobId: "herald",
		jobName: "Herald",
		tier: 2,
		pathType: "war",
		requirements: { level: 1, skills: ["Athletics", "Religion"] },
		description:
			"Former military chaplains, police officers, and firefighter-paramedics who serve as frontline conduits of hunter guilds — armored, armed, and broadcasting System combat transmissions alongside Destroyers and Berserkers. They stream their gate raids in full plate armor while healing teammates mid-swing.",
		features: [
			{
				name: "Bonus Proficiencies",
				description: "Proficiency with martial weapons and heavy armor.",
				level: 1,
			},
			{
				name: "War Priest",
				description:
					"When you take the Attack action, make one weapon attack as a bonus action. SENSE mod uses/long rest.",
				level: 1,
			},
			{
				name: "Channel Divinity: Guided Strike",
				description:
					"When you make an attack roll, +10 to the roll. Declare after roll but before result.",
				level: 2,
			},
			{
				name: "Channel Divinity: War God's Blessing",
				description:
					"Reaction: creature within 30 ft makes an attack → +10 to their roll.",
				level: 6,
			},
			{
				name: "Divine Strike",
				description:
					"Once per turn, weapon attacks deal extra 1d8 damage of your weapon type (2d8 at 14th).",
				level: 8,
			},
			{
				name: "Avatar of Battle",
				description:
					"Resistance to bludgeoning, piercing, and slashing damage from nonmagical weapons.",
				level: 17,
			},
		],
		abilities: [
			{
				name: "Holy Weapon",
				description:
					"Touch a weapon: it deals extra 2d8 radiant for 1 hour. When effect ends, 30-ft burst: 4d8 radiant, VIT save for half + blinded. Once/long rest.",
				cooldown: 3,
				cost: "Bonus action",
			},
		],
		stats: {
			primaryAttribute: "Wisdom",
			secondaryAttribute: "Strength",
			bonusStats: { wisdom: 2, strength: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "herald--knowledge-domain",
		name: "Path of the Data Protocol",
		jobId: "herald",
		jobName: "Herald",
		tier: 2,
		pathType: "knowledge",
		requirements: { level: 1, skills: ["History", "Religion"] },
		description:
			"Librarians, professors, intelligence analysts, and archivists who have the deepest System uplink access. They download encrypted knowledge directly — like having Google hardwired into their brain, but for classified System data. Universities and think tanks compete for their expertise. They read minds through data streams and their transmissions reveal all hidden information.",
		features: [
			{
				name: "Blessings of Knowledge",
				description:
					"Learn two languages. Prof in two of: Arcana, History, Nature, Religion (double prof bonus).",
				level: 1,
			},
			{
				name: "Channel Divinity: Knowledge of the Ages",
				description:
					"Action: gain proficiency with one tool or skill for 10 minutes.",
				level: 2,
			},
			{
				name: "Channel Divinity: Read Thoughts",
				description:
					"Action: one creature within 60 ft, SENSE save or you read its surface thoughts for 1 min. Fail by 5+: you can also cast Suggestion on it without a slot.",
				level: 6,
			},
			{
				name: "Potent Spellcasting",
				description: "Add SENSE mod to Herald cantrip damage.",
				level: 8,
			},
			{
				name: "Visions of the Past",
				description:
					"Meditate 1 min on an object or area to receive visions of recent events (up to a number of days = SENSE mod).",
				level: 17,
			},
		],
		abilities: [
			{
				name: "System Query",
				description:
					"Ask the System one question about any creature, object, or location. Receive a truthful answer (short phrase or image). Once/long rest.",
				cooldown: 3,
				cost: "Action (1 min)",
			},
		],
		stats: {
			primaryAttribute: "Wisdom",
			secondaryAttribute: "Intelligence",
			bonusStats: { wisdom: 2, intelligence: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "herald--tempest-domain",
		name: "Path of the Storm Protocol",
		jobId: "herald",
		jobName: "Herald",
		tier: 2,
		pathType: "tempest",
		requirements: { level: 1, skills: ["Nature", "Religion"] },
		description:
			"Storm chasers, meteorologists, and naval officers who broadcast the System's most violent atmospheric frequencies. Their gate-raid footage looks like natural disaster footage — lightning strikes on demand, thunder that shatters windows. The most offensively powerful Herald path; power grids in their neighborhood need surge protectors.",
		features: [
			{
				name: "Bonus Proficiencies",
				description: "Proficiency with martial weapons and heavy armor.",
				level: 1,
			},
			{
				name: "Wrath of the Storm",
				description:
					"Reaction when hit by melee: attacker takes 2d8 lightning or thunder (AGI half). SENSE mod uses/long rest.",
				level: 1,
			},
			{
				name: "Channel Divinity: Destructive Wrath",
				description:
					"When you deal lightning or thunder damage, maximize the damage dice instead of rolling.",
				level: 2,
			},
			{
				name: "Thunderbolt Strike",
				description:
					"When you deal lightning damage to a Large or smaller creature, push it up to 10 ft.",
				level: 6,
			},
			{
				name: "Divine Strike",
				description:
					"Once per turn, weapon deals extra 1d8 thunder (2d8 at 14th).",
				level: 8,
			},
			{
				name: "Stormborn",
				description:
					"When outdoors, gain a flying speed equal to your walking speed.",
				level: 17,
			},
		],
		abilities: [
			{
				name: "Call Lightning",
				description:
					"30-ft radius within 120 ft: 3d10 lightning, AGI save for half. Maximize with Channel Divinity. Once/short rest.",
				cooldown: 1,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Wisdom",
			secondaryAttribute: "Strength",
			bonusStats: { wisdom: 2, strength: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "herald--grave-domain",
		name: "Path of the Triage Protocol",
		jobId: "herald",
		jobName: "Herald",
		tier: 2,
		pathType: "grave",
		requirements: { level: 1, skills: ["Medicine", "Religion"] },
		description:
			"Emergency dispatchers, triage nurses, and disaster response coordinators who specialize in battlefield crisis management. They operate on the System's emergency medical frequency — maximizing healing on critical patients, marking targets for elimination, and canceling lethal blows through System intervention. Every field hospital and frontline guild wants a Triage Protocol Herald on speed dial.",
		features: [
			{
				name: "Emergency Triage",
				description:
					"When you cast a healing spell on a creature at 0 HP, the System prioritizes maximum output: treat all healing dice as maximum value. Spare the Dying cantrip has 30-ft range and is a bonus action.",
				level: 1,
			},
			{
				name: "Threat Scanner",
				description:
					"Action: scan for undead and critically wounded creatures within 60 ft (not behind total cover). SENSE mod uses/long rest.",
				level: 1,
			},
			{
				name: "Protocol Activation: Priority Target",
				description:
					"Action: mark a creature within 30 ft as priority elimination. The next attack against it deals double damage (all types). Mark ends after one attack.",
				level: 2,
			},
			{
				name: "Critical Intervention",
				description:
					"Reaction: when you or ally within 30 ft suffers a critical hit, the System intervenes — downgrade it to a normal hit. SENSE mod uses/long rest.",
				level: 6,
			},
			{
				name: "Enhanced Transmissions",
				description:
					"Add SENSE mod to Herald cantrip damage. Your transmissions carry more power.",
				level: 8,
			},
			{
				name: "Mana Recycling",
				description:
					"When an enemy you can see dies within 60 ft, the System recycles its residual mana: you or an ally within 60 ft regains HP = the creature's CR (minimum 1). Once per round.",
				level: 17,
			},
		],
		abilities: [
			{
				name: "System Safeguard",
				description:
					"Touch: for 8 hours, first time target drops to 0 HP, the System catches them at 1 HP instead. Once/long rest without slot.",
				cooldown: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Wisdom",
			secondaryAttribute: "Constitution",
			bonusStats: { wisdom: 2, constitution: 1 },
		},
		source: "System Ascendant Canon",
	},

	// ── CONTRACTOR PATHS ── features at 1,6,10,14 ──
	{
		id: "contractor--archfey",
		name: "Path of the Fey Lord",
		jobId: "contractor",
		jobName: "Contractor",
		tier: 2,
		pathType: "archfey",
		requirements: { level: 1, skills: ["Arcana", "Deception"] },
		description:
			"Fashion designers, social media managers, and PR consultants who bargained with ancient fey entities ruling enchanted gate ecosystems. Their glamour magic makes them terrifyingly effective manipulators — in boardrooms and on battlefields alike. Several high-profile political scandals have involved Fey Lord Contractors. Their contracts grant charms, terrors, and illusions that ensnare the unwary.",
		features: [
			{
				name: "Fey Presence",
				description:
					"Action: each creature in 10-ft cube originating from you makes SENSE save or is charmed or frightened until end of your next turn. Once per short rest.",
				level: 1,
			},
			{
				name: "Misty Escape",
				description:
					"Reaction when you take damage: become invisible and teleport up to 60 ft. Invisible until start of next turn or until you attack/cast. Once per short rest.",
				level: 6,
			},
			{
				name: "Beguiling Defenses",
				description:
					"Immune to being charmed. When a creature tries to charm you, use reaction to turn the charm back on it (SENSE save).",
				level: 10,
			},
			{
				name: "Dark Delirium",
				description:
					"Action: one creature within 60 ft, SENSE save or charmed/frightened for 1 min (you choose). Target perceives itself lost in a misty realm. Concentration. Once per short rest.",
				level: 14,
			},
		],
		abilities: [
			{
				name: "Faerie Fire",
				description:
					"20-ft cube: creatures AGI save or outlined in light (advantage on attacks against them, can't be invisible). 1 min concentration.",
				cooldown: 0,
				cost: "Spell slot",
			},
		],
		stats: {
			primaryAttribute: "Charisma",
			secondaryAttribute: "Dexterity",
			bonusStats: { charisma: 2, dexterity: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "contractor--fiend",
		name: "Path of the Infernal",
		jobId: "contractor",
		jobName: "Contractor",
		tier: 2,
		pathType: "fiend",
		requirements: { level: 1, skills: ["Arcana", "Intimidation"] },
		description:
			"Desperate gamblers, disgraced executives, and power-hungry individuals who negotiated pacts with demonic entities dwelling in the deepest gate layers. Their contract burns with hellfire — literally; their body temperature runs 3 degrees hot. Every kill feeds their patron, and the bond strengthens. Several true-crime podcasts have covered Infernal Contractors who went too far.",
		features: [
			{
				name: "Dark One's Blessing",
				description:
					"When you reduce a hostile creature to 0 HP, gain temp HP = PRE mod + Contractor level.",
				level: 1,
			},
			{
				name: "Dark One's Own Luck",
				description:
					"When you make an ability check or save, add 1d10 to the roll. Once per short rest.",
				level: 6,
			},
			{
				name: "Fiendish Resilience",
				description:
					"At the end of a short/long rest, choose one damage type (not force, radiant, or magical bludgeoning/piercing/slashing). You have resistance to that type until you choose another.",
				level: 10,
			},
			{
				name: "Hurl Through Hell",
				description:
					"When you hit with an attack, banish the creature through hell. It takes 10d10 psychic damage when it returns at end of your next turn. Once per long rest.",
				level: 14,
			},
		],
		abilities: [
			{
				name: "Hellfire Blast",
				description:
					"Eldritch Blast deals fire instead of force and ignites the target: 1d6 fire at start of each of its turns for 1 min (VIT save ends). Once/short rest.",
				cooldown: 1,
				cost: "Free",
			},
		],
		stats: {
			primaryAttribute: "Charisma",
			secondaryAttribute: "Constitution",
			bonusStats: { charisma: 2, constitution: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "contractor--great-old-one",
		name: "Path of the Void Entity",
		jobId: "contractor",
		jobName: "Contractor",
		tier: 2,
		pathType: "great-old-one",
		requirements: { level: 1, skills: ["Arcana", "Investigation"] },
		description:
			"Conspiracy theorists, deep-web researchers, and amateur astronomers who stumbled into contact with alien intelligences from beyond the known gate network. Their patrons are so vast and ancient that fragments of their consciousness shatter mortal minds. Intelligence agencies monitor them closely. Their contracts grant psionic abilities no other hunter can access.",
		features: [
			{
				name: "Awakened Mind",
				description:
					"Telepathically communicate with any creature within 30 ft. No shared language needed. The creature can respond telepathically.",
				level: 1,
			},
			{
				name: "Entropic Ward",
				description:
					"Reaction when attacked: impose disadvantage. If the attack misses, gain advantage on your next attack vs that creature before end of your next turn. Once per short rest.",
				level: 6,
			},
			{
				name: "Thought Shield",
				description:
					"Resistance to psychic damage. Your thoughts can't be read unless you allow it. Creatures that deal psychic damage to you take the same amount.",
				level: 10,
			},
			{
				name: "Create Thrall",
				description:
					"Touch an incapacitated humanoid: it is charmed by you indefinitely. You can communicate telepathically across any distance (same plane). It follows your commands.",
				level: 14,
			},
		],
		abilities: [
			{
				name: "Psychic Scream",
				description:
					"60-ft range: creature makes INT save or takes 3d10 psychic and is stunned until end of your next turn. Once/short rest.",
				cooldown: 1,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Charisma",
			secondaryAttribute: "Intelligence",
			bonusStats: { charisma: 2, intelligence: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "contractor--celestial",
		name: "Path of the Radiant Entity",
		jobId: "contractor",
		jobName: "Contractor",
		tier: 2,
		pathType: "celestial",
		requirements: { level: 1, skills: ["Arcana", "Religion"] },
		description:
			"Chaplains, hospice volunteers, and humanitarian workers who forged pacts with benevolent gate entities — luminous beings who grant restorative light alongside destructive power. The rarest contract type; churches debate whether these entities are angels. A rare contract that heals as much as it destroys.",
		features: [
			{
				name: "Bonus Cantrips",
				description:
					"Learn Light and Sacred Flame cantrips (don't count against cantrips known).",
				level: 1,
			},
			{
				name: "Healing Light",
				description:
					"Pool of d6s = 1 + Contractor level. Bonus action: heal a creature within 60 ft by spending dice (up to PRE mod at once).",
				level: 1,
			},
			{
				name: "Radiant Soul",
				description:
					"Resistance to radiant damage. When you deal fire or radiant damage with a spell, add PRE mod to one roll.",
				level: 6,
			},
			{
				name: "Celestial Resilience",
				description:
					"You gain temp HP = Contractor level + PRE mod at end of short/long rest. Choose up to 5 creatures: they gain temp HP = half Contractor level + PRE mod.",
				level: 10,
			},
			{
				name: "Searing Vengeance",
				description:
					"When you make a death save at start of your turn, you can instead spring up (no HP cost) with half HP max, and each creature within 30 ft takes 2d8+PRE mod radiant and is blinded until end of turn. Once per long rest.",
				level: 14,
			},
		],
		abilities: [
			{
				name: "Radiant Burst",
				description:
					"30-ft radius: 3d8 radiant, VIT save for half. You and allies in range heal for half damage dealt. Once/long rest.",
				cooldown: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Charisma",
			secondaryAttribute: "Wisdom",
			bonusStats: { charisma: 2, wisdom: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "contractor--hexblade",
		name: "Path of the Cursed Blade",
		jobId: "contractor",
		jobName: "Contractor",
		tier: 2,
		pathType: "hexblade",
		requirements: { level: 1, skills: ["Arcana", "Athletics"] },
		description:
			"Antique weapons dealers, museum curators, and collectors who forged pacts with sentient weapons bound inside gates — shadow-forged armaments that hunger for blood. The most martial Contractor path; they literally wield their patron as a weapon. Auction houses have flagged several gate-recovered blades as 'anomalous items requiring Contractor clearance.'",
		features: [
			{
				name: "Hexblade's Curse",
				description:
					"Bonus action: curse a creature within 30 ft for 1 min. You gain: +prof bonus to damage vs it, crit on 19-20 vs it, regain HP = Contractor level + PRE mod if it dies. Once per short rest.",
				level: 1,
			},
			{
				name: "Hex Warrior",
				description:
					"Prof with medium armor, shields, and martial weapons. Use PRE for attack/damage with one weapon you touch (changes on long rest). Pact weapons always use PRE.",
				level: 1,
			},
			{
				name: "Accursed Specter",
				description:
					"When you slay a humanoid, raise it as a specter under your control. It gains temp HP = half Contractor level and adds your PRE mod to attack rolls. One at a time, once per long rest.",
				level: 6,
			},
			{
				name: "Armor of Hexes",
				description:
					"If the creature cursed by your Hexblade's Curse hits you, roll d6. On 4+, the attack misses regardless of roll.",
				level: 10,
			},
			{
				name: "Master of Hexes",
				description:
					"When a creature cursed by your Hexblade's Curse dies, apply the curse to a different creature within 30 ft (no bonus action needed).",
				level: 14,
			},
		],
		abilities: [
			{
				name: "Shadow Blade",
				description:
					"Conjure a blade of shadow: 2d8 psychic, finesse, light, thrown (20/60). Advantage on attacks in dim light/darkness. 1 min concentration.",
				cooldown: 0,
				cost: "Spell slot",
			},
		],
		stats: {
			primaryAttribute: "Charisma",
			secondaryAttribute: "Strength",
			bonusStats: { charisma: 2, strength: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "contractor--fathomless",
		name: "Path of the Deep Gate",
		jobId: "contractor",
		jobName: "Contractor",
		tier: 2,
		pathType: "fathomless",
		requirements: { level: 1, skills: ["Arcana", "Nature"] },
		description:
			"Marine biologists, deep-sea divers, and offshore oil workers who bargained with kraken-like horrors from submerged gates. Coastal cities with underwater gate activity are their territory. Spectral tentacles manifest from the deep-gate dimension, and the crushing pressure of their patron's domain empowers their magic. Surfers give them a wide berth.",
		features: [
			{
				name: "Tentacle of the Deeps",
				description:
					"Bonus action: summon a 10-ft spectral tentacle within 60 ft. On creation and as bonus action each turn: melee spell attack, 1d8 cold, -10 ft speed until start of your next turn. Lasts 1 min. PRE mod uses/long rest.",
				level: 1,
			},
			{
				name: "Gift of the Sea",
				description: "40-ft swim speed. Breathe underwater.",
				level: 1,
			},
			{
				name: "Oceanic Soul",
				description:
					"Resistance to cold. Breathe underwater. You and creatures you choose within 30 ft can be understood when speaking underwater.",
				level: 6,
			},
			{
				name: "Guardian Coil",
				description:
					"Reaction when you or creature within 10 ft of your tentacle takes damage: reduce damage by 1d8.",
				level: 6,
			},
			{
				name: "Grasping Tentacles",
				description:
					"Cast Evard's Black Tentacles once/long rest without a slot or components. When you cast it, your Tentacle of the Deeps can't be damaged while in the spell's area.",
				level: 10,
			},
			{
				name: "Fathomless Plunge",
				description:
					"Action: teleport yourself and up to 5 willing creatures within 30 ft up to 1 mile to a body of water you've seen. Once per short rest.",
				level: 14,
			},
		],
		abilities: [
			{
				name: "Crushing Depths",
				description:
					"60-ft radius: creatures make STR save or take 3d8 cold + restrained 1 round. Success: half, not restrained. Once/long rest.",
				cooldown: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Charisma",
			secondaryAttribute: "Constitution",
			bonusStats: { charisma: 2, constitution: 1 },
		},
		source: "System Ascendant Canon",
	},

	// ── STALKER PATHS ── features at 3,7,11,15 ──
	{
		id: "stalker--hunter",
		name: "Path of the Specialist Hunter",
		jobId: "stalker",
		jobName: "Stalker",
		tier: 2,
		pathType: "hunter",
		requirements: { level: 3, skills: ["Survival", "Perception"] },
		description:
			"Former pest control professionals, game wardens, and police tactical officers who adapt their tactics to exploit specific prey types. The Hunter Bureau assigns them to gate-specific threat categories. They choose specialized kill techniques at each tier — anti-large, anti-horde, or anti-boss — making them the most versatile Stalker path.",
		features: [
			{
				name: "Hunter's Prey",
				description:
					"Choose one: Colossus Slayer (1d8 extra on hit vs creature below max HP, once/turn), Giant Killer (reaction attack when Large+ creature within 5 ft attacks you), or Horde Breaker (additional attack on a different creature within 5 ft of original target).",
				level: 3,
			},
			{
				name: "Defensive Tactics",
				description:
					"Choose one: Escape the Horde (OAs vs you have disadvantage), Multiattack Defense (+4 AC after being hit, until end of turn), or Steel Will (advantage on saves vs frightened).",
				level: 7,
			},
			{
				name: "Multiattack",
				description:
					"Choose one: Volley (ranged attack every creature within 10 ft of a point in range), or Whirlwind Attack (melee attack every creature within 5 ft).",
				level: 11,
			},
			{
				name: "Superior Hunter's Defense",
				description:
					"Choose one: Evasion (AGI saves: success = no damage, fail = half), Stand Against the Tide (reaction: redirect missed melee to another creature), or Uncanny Dodge (reaction: halve damage from attack you can see).",
				level: 15,
			},
		],
		abilities: [
			{
				name: "Prey Designation",
				description:
					"Mark a creature: advantage on all attacks and Survival checks against it for 1 hour. Once/short rest.",
				cooldown: 1,
				cost: "Bonus action",
			},
		],
		stats: {
			primaryAttribute: "Dexterity",
			secondaryAttribute: "Wisdom",
			bonusStats: { dexterity: 2, wisdom: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "stalker--beast-master",
		name: "Path of the Bonded Predator",
		jobId: "stalker",
		jobName: "Stalker",
		tier: 2,
		pathType: "beast-master",
		requirements: { level: 3, skills: ["Animal Handling", "Nature"] },
		description:
			"Dog handlers, falconers, and exotic animal trainers who form deep mana-bonds with gate-spawned creatures. Their bonded companions are registered with the Hunter Bureau's Wildlife Division and have their own social media followings. Two predators sharing one hunting instinct — coordinated well enough to clear gates that would require a full party.",
		features: [
			{
				name: "Primal Companion",
				description:
					"Gain a beast companion (Beast of the Land, Sea, or Sky). It obeys your commands, acts on your initiative, and you can command it to attack as a bonus action. It uses your prof bonus for AC, attacks, saves, and skills.",
				level: 3,
			},
			{
				name: "Exceptional Training",
				description:
					"Your companion's attacks count as magical. When you command it to take an action, it can also Dash, Disengage, or Help.",
				level: 7,
			},
			{
				name: "Bestial Fury",
				description:
					"When you command your companion to Attack, it makes two attacks.",
				level: 11,
			},
			{
				name: "Share Spells",
				description:
					"When you cast a spell targeting yourself, your companion also benefits if it's within 30 ft.",
				level: 15,
			},
		],
		abilities: [
			{
				name: "Coordinated Assault",
				description:
					"You and your companion both attack the same target with advantage. If both hit, the target must VIT save or be stunned until end of your next turn. Once/short rest.",
				cooldown: 1,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Dexterity",
			secondaryAttribute: "Wisdom",
			bonusStats: { dexterity: 2, wisdom: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "stalker--gloom-stalker",
		name: "Path of the Shadow Hunter",
		jobId: "stalker",
		jobName: "Stalker",
		tier: 2,
		pathType: "gloom-stalker",
		requirements: { level: 3, skills: ["Stealth", "Perception"] },
		description:
			"Night-shift security guards, cave divers, and blackout rescue specialists who thrive in absolute darkness. They become invisible in shadow and strike with devastating ambush tactics. The Hunter Bureau sends them into unknown zero-light gate zones where other hunters can't operate — their helmet cams capture footage that looks like found-footage horror films.",
		features: [
			{
				name: "Dread Ambusher",
				description:
					"First turn of combat: +SENSE mod to initiative, walking speed +10 ft, and one extra attack (deals additional 1d8 damage).",
				level: 3,
			},
			{
				name: "Umbral Sight",
				description:
					"Darkvision 60 ft (or +30 ft if you already have it). While in darkness, you are invisible to creatures that rely on darkvision to see you.",
				level: 3,
			},
			{
				name: "Iron Mind",
				description:
					"Prof in SENSE saves. If already proficient, choose INT or PRE saves instead.",
				level: 7,
			},
			{
				name: "Stalker's Flurry",
				description:
					"When you miss with a weapon attack, make another weapon attack as part of the same action. Once per turn.",
				level: 11,
			},
			{
				name: "Shadowy Dodge",
				description:
					"Reaction when attacked (no advantage): impose disadvantage on the attack.",
				level: 15,
			},
		],
		abilities: [
			{
				name: "Shadow Ambush",
				description:
					"Become invisible for 1 round. Your first attack from invisibility deals extra 2d8 damage and the target must SENSE save or be frightened. Once/short rest.",
				cooldown: 1,
				cost: "Bonus action",
			},
		],
		stats: {
			primaryAttribute: "Dexterity",
			secondaryAttribute: "Wisdom",
			bonusStats: { dexterity: 2, wisdom: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "stalker--horizon-walker",
		name: "Path of the Rift Walker",
		jobId: "stalker",
		jobName: "Stalker",
		tier: 2,
		pathType: "horizon-walker",
		requirements: { level: 3, skills: ["Arcana", "Survival"] },
		description:
			"Border patrol agents, customs officers, and immigration lawyers (ironically) who patrol the boundaries between gate dimensions. They sense dimensional portals the way dogs sense earthquakes and teleport through combat via micro-rifts. The Hunter Bureau's Containment Division employs them to seal unauthorized gate crossings.",
		features: [
			{
				name: "Detect Portal",
				description:
					"Action: sense the distance and direction to the closest planar portal within 1 mile. Once per short rest.",
				level: 3,
			},
			{
				name: "Planar Warrior",
				description:
					"Bonus action: choose one creature within 30 ft. Next hit this turn deals extra 1d8 force (2d8 at 11th) and all damage becomes force.",
				level: 3,
			},
			{
				name: "Ethereal Step",
				description:
					"Bonus action: step into the Ethereal Plane until end of turn. You can see/be seen as ghostly. Move through creatures/objects. Once per short rest.",
				level: 7,
			},
			{
				name: "Distant Strike",
				description:
					"When you take the Attack action, teleport 10 ft before each attack. If you attack at least two different creatures, make one additional attack against a third.",
				level: 11,
			},
			{
				name: "Spectral Defense",
				description:
					"Reaction when you take damage: gain resistance to all of that attack's damage.",
				level: 15,
			},
		],
		abilities: [
			{
				name: "Planar Rift",
				description:
					"Open a 20-ft radius rift at a point within 120 ft: creatures make AGI save or 4d10 force + banished to another plane until end of your next turn. Once/long rest.",
				cooldown: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Dexterity",
			secondaryAttribute: "Wisdom",
			bonusStats: { dexterity: 2, wisdom: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "stalker--monster-slayer",
		name: "Path of the Boss Killer",
		jobId: "stalker",
		jobName: "Stalker",
		tier: 2,
		pathType: "monster-slayer",
		requirements: { level: 3, skills: ["Investigation", "Survival"] },
		description:
			"Former detectives, forensic analysts, and competitive gamers who study their prey obsessively — learning to counter every ability and exploit every vulnerability. The Hunter Bureau calls them for S-Rank gate boss encounters where standard tactics have failed. They watch boss-fight footage the way football coaches watch game tape.",
		features: [
			{
				name: "Hunter's Sense",
				description:
					"Action: learn one creature's immunities, resistances, and vulnerabilities. SENSE mod uses/long rest.",
				level: 3,
			},
			{
				name: "Slayer's Prey",
				description:
					"Bonus action: designate a creature within 60 ft. First hit each turn deals extra 1d6 damage. Until the creature dies, you choose a new target, or you short/long rest.",
				level: 3,
			},
			{
				name: "Supernatural Defense",
				description:
					"When your Slayer's Prey target forces you to make a save, add 1d6 to your save.",
				level: 7,
			},
			{
				name: "Magic-User's Nemesis",
				description:
					"Reaction when a creature within 60 ft casts a spell or teleports: SENSE save or the spell/teleport fails and is wasted. Once per short rest.",
				level: 11,
			},
			{
				name: "Slayer's Counter",
				description:
					"Reaction when your Slayer's Prey target forces you to make a save: make a weapon attack. If it hits, your save auto-succeeds.",
				level: 15,
			},
		],
		abilities: [
			{
				name: "Exploit Weakness",
				description:
					"After using Hunter's Sense, your attacks against that creature ignore resistances and treat immunities as resistance for 1 min. Once/long rest.",
				cooldown: 3,
				cost: "Free",
			},
		],
		stats: {
			primaryAttribute: "Dexterity",
			secondaryAttribute: "Wisdom",
			bonusStats: { dexterity: 2, wisdom: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "stalker--swarm-keeper",
		name: "Path of the Hive Controller",
		jobId: "stalker",
		jobName: "Stalker",
		tier: 2,
		pathType: "swarmkeeper",
		requirements: { level: 3, skills: ["Nature", "Survival"] },
		description:
			"Beekeepers, entomologists, and drone operators who bonded with living swarms of gate organisms — parasitic insects, micro-spirits, or nano-constructs that inhabit their body. Pest control companies won't service their homes (the swarm eats conventional pesticides). The swarm enhances every attack and provides mobility; bystanders describe it as 'being near a cloud of angry static.'",
		features: [
			{
				name: "Gathered Swarm",
				description:
					"Once per turn on hit: swarm deals extra 1d6 piercing, or pushes target 15 ft horizontally (STR save), or moves you 5 ft (no OA). Damage becomes 1d8 at 11th.",
				level: 3,
			},
			{
				name: "Swarmkeeper Magic",
				description:
					"Learn bonus spells: Faerie Fire (3rd), Web (5th), Gaseous Form (9th), Arcane Eye (13th), Insect Plague (17th).",
				level: 3,
			},
			{
				name: "Writhing Tide",
				description:
					"Bonus action: swarm lifts you, giving 10-ft fly speed (hover) for 1 min. Prof bonus uses/long rest.",
				level: 7,
			},
			{
				name: "Mighty Swarm",
				description:
					"Gathered Swarm: damage becomes 1d8 piercing. Push: target also knocked prone on failed STR save. Move: you also gain half cover until start of next turn.",
				level: 11,
			},
			{
				name: "Swarming Dispersal",
				description:
					"Reaction when you take damage: gain resistance and teleport up to 30 ft as your body dissolves into the swarm. Prof bonus uses/long rest.",
				level: 15,
			},
		],
		abilities: [
			{
				name: "Swarm Eruption",
				description:
					"Release the swarm: all creatures within 15 ft take 3d8 piercing (AGI half) and are blinded until end of your next turn. Once/short rest.",
				cooldown: 1,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Dexterity",
			secondaryAttribute: "Wisdom",
			bonusStats: { dexterity: 2, wisdom: 1 },
		},
		source: "System Ascendant Canon",
	},

	// ── HOLY KNIGHT PATHS ── features at 3,7,15,20 ──
	{
		id: "holy-knight--devotion",
		name: "Path of the Sacred Oath",
		jobId: "holy-knight",
		jobName: "Holy Knight",
		tier: 2,
		pathType: "devotion",
		requirements: { level: 3, skills: ["Religion"] },
		description:
			"Police captains, firefighter chiefs, and military officers who are paragons of System virtue. They appear at press conferences in gleaming covenant armor and their community approval ratings are astronomical. Their absolute faith grants unparalleled defensive auras and the ability to manifest weapons of pure radiant System energy.",
		features: [
			{
				name: "Channel Divinity: Sacred Weapon",
				description:
					"Action: for 1 min, add PRE mod to attack rolls with one weapon (min +1). Weapon emits bright light 20 ft. Counts as magical.",
				level: 3,
			},
			{
				name: "Channel Divinity: Turn the Unholy",
				description:
					"Action: fiends and undead within 30 ft make SENSE save or are turned for 1 min.",
				level: 3,
			},
			{
				name: "Aura of Devotion",
				description:
					"You and allies within 10 ft can't be charmed while conscious. 30 ft at 18th.",
				level: 7,
			},
			{
				name: "Purity of Spirit",
				description:
					"You are always under the effect of Protection from Evil and Good.",
				level: 15,
			},
			{
				name: "Holy Nimbus",
				description:
					"Action: 30-ft bright light aura for 1 min. Enemies starting turn in aura take 10 radiant. Advantage on saves vs fiend/undead spells. Once/long rest.",
				level: 20,
			},
		],
		abilities: [
			{
				name: "Sacred Smite",
				description:
					"Channel divine energy: next melee hit deals extra 3d8 radiant and target must SENSE save or be blinded for 1 round. Once/short rest.",
				cooldown: 1,
				cost: "Bonus action",
			},
		],
		stats: {
			primaryAttribute: "Strength",
			secondaryAttribute: "Charisma",
			bonusStats: { strength: 2, charisma: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "holy-knight--vengeance",
		name: "Path of the Retribution Oath",
		jobId: "holy-knight",
		jobName: "Holy Knight",
		tier: 2,
		pathType: "vengeance",
		requirements: { level: 3, skills: ["Intimidation"] },
		description:
			"Victims of gate disasters, bereaved family members, and wrongfully discharged soldiers who pursue the System's enemies with relentless fury. They are strike-team specialists recruited by the Hunter Bureau for assassination missions — less defensive than Sacred Oath, but devastating against single high-value targets. Their covenant burns with righteous anger.",
		features: [
			{
				name: "Channel Divinity: Abjure Enemy",
				description:
					"Action: one creature within 60 ft makes SENSE save or is frightened and speed is 0 for 1 min (half speed on success). Fiends/undead have disadvantage.",
				level: 3,
			},
			{
				name: "Channel Divinity: Vow of Enmity",
				description:
					"Bonus action: gain advantage on attacks against one creature within 10 ft for 1 min.",
				level: 3,
			},
			{
				name: "Relentless Avenger",
				description:
					"When you hit with OA, move up to half speed immediately after (no OA against you).",
				level: 7,
			},
			{
				name: "Soul of Vengeance",
				description:
					"When creature under your Vow of Enmity attacks, reaction: make a melee weapon attack against it.",
				level: 15,
			},
			{
				name: "Avenging Angel",
				description:
					"Action: transform for 1 hour — 60-ft fly speed, 30-ft aura of menace (SENSE save or frightened 1 min on first seeing you). Once/long rest.",
				level: 20,
			},
		],
		abilities: [
			{
				name: "Relentless Pursuit",
				description:
					"Designate a creature: for 1 min, you can't be slowed, restrained, or have your speed reduced while moving toward it. Advantage on saves vs its spells. Once/long rest.",
				cooldown: 3,
				cost: "Bonus action",
			},
		],
		stats: {
			primaryAttribute: "Strength",
			secondaryAttribute: "Charisma",
			bonusStats: { strength: 2, charisma: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "holy-knight--ancients",
		name: "Path of the Primal Oath",
		jobId: "holy-knight",
		jobName: "Holy Knight",
		tier: 2,
		pathType: "ancients",
		requirements: { level: 3, skills: ["Nature", "Religion"] },
		description:
			"Environmental activists, conservation officers, and indigenous community leaders who swear to protect life against the encroaching corruption of the gates. Their covenant predates the hunter guilds — a primal pact with the System's original purpose. They chain themselves to threatened gate biomes the way others chain themselves to old-growth trees.",
		features: [
			{
				name: "Channel Divinity: Nature's Wrath",
				description:
					"Action: spectral vines restrain a creature within 10 ft (STR or AGI save to escape, check each turn).",
				level: 3,
			},
			{
				name: "Channel Divinity: Turn the Faithless",
				description:
					"Action: fey and fiends within 30 ft make SENSE save or are turned for 1 min.",
				level: 3,
			},
			{
				name: "Aura of Warding",
				description:
					"You and allies within 10 ft have resistance to spell damage. 30 ft at 18th.",
				level: 7,
			},
			{
				name: "Undying Sentinel",
				description:
					"When reduced to 0 HP and not killed outright, drop to 1 HP instead. Once per long rest. Also, you suffer no drawbacks of old age and can't be aged magically.",
				level: 15,
			},
			{
				name: "Elder Champion",
				description:
					"Action: transform for 1 min — regain 10 HP at start of each turn, cast Holy Knight spells as bonus action, enemies within 10 ft have disadvantage on saves vs your spells/Channel Divinity. Once/long rest.",
				level: 20,
			},
		],
		abilities: [
			{
				name: "Nature's Bulwark",
				description:
					"All allies within 30 ft gain resistance to all spell damage and advantage on saves vs spells for 1 min. Once/long rest.",
				cooldown: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Strength",
			secondaryAttribute: "Charisma",
			bonusStats: { strength: 2, charisma: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "holy-knight--conquest",
		name: "Path of the Dominion Oath",
		jobId: "holy-knight",
		jobName: "Holy Knight",
		tier: 2,
		pathType: "conquest",
		requirements: { level: 3, skills: ["Intimidation", "Athletics"] },
		description:
			"Corporate CEOs, drill sergeants, and authoritarian politicians who rule through overwhelming System authority. Their covenant radiates domination — boardrooms fall silent when they enter, and enemies freeze in place through sheer force of will. The Hunter Bureau uses them to maintain order in lawless gate-adjacent zones.",
		features: [
			{
				name: "Channel Divinity: Conquering Presence",
				description:
					"Action: each creature of your choice within 30 ft makes SENSE save or is frightened for 1 min (save end of each turn).",
				level: 3,
			},
			{
				name: "Channel Divinity: Guided Strike",
				description:
					"+10 to an attack roll. Declare after roll but before result.",
				level: 3,
			},
			{
				name: "Aura of Conquest",
				description:
					"Frightened creatures within 10 ft have speed 0 and take psychic damage = half Holy Knight level at start of their turn. 30 ft at 18th.",
				level: 7,
			},
			{
				name: "Scornful Rebuke",
				description:
					"Whenever a creature hits you with an attack, it takes psychic damage = PRE mod.",
				level: 15,
			},
			{
				name: "Invincible Conqueror",
				description:
					"Action: transform for 1 min — resistance to all damage, Extra Attack becomes three attacks, crits on 19-20. Once/long rest.",
				level: 20,
			},
		],
		abilities: [
			{
				name: "Crushing Presence",
				description:
					"All enemies within 30 ft: SENSE save or prone + frightened + speed 0 for 1 round. Once/long rest.",
				cooldown: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Strength",
			secondaryAttribute: "Charisma",
			bonusStats: { strength: 2, charisma: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "holy-knight--redemption",
		name: "Path of the Guardian Oath",
		jobId: "holy-knight",
		jobName: "Holy Knight",
		tier: 2,
		pathType: "redemption",
		requirements: { level: 3, skills: ["Persuasion", "Religion"] },
		description:
			"Social workers, public defenders, and pacifist activists who believe in protection above destruction. They absorb damage meant for allies and punish aggressors — the ultimate defensive covenant. Hostage negotiators with Guardian Oath training have a 100% survival rate. They try to end fights without killing, which makes them controversial in a world that rewards body counts.",
		features: [
			{
				name: "Channel Divinity: Emissary of Peace",
				description: "+5 to Persuasion checks for 10 min.",
				level: 3,
			},
			{
				name: "Channel Divinity: Rebuke the Violent",
				description:
					"Reaction: when a creature within 30 ft deals damage, it takes radiant damage equal to the damage dealt (SENSE save for half).",
				level: 3,
			},
			{
				name: "Aura of the Guardian",
				description:
					"Reaction: when a creature within 10 ft takes damage, magically take the damage instead (no reduction). 30 ft at 18th.",
				level: 7,
			},
			{
				name: "Protective Spirit",
				description:
					"At end of each turn, if you have less than half HP max, regain 1d6+half Holy Knight level HP.",
				level: 15,
			},
			{
				name: "Emissary of Redemption",
				description:
					"Resistance to all damage from other creatures (not you). When a creature damages you, it takes radiant damage = half what it dealt. Both benefits lost vs a creature you attack/force a save against (until long rest).",
				level: 20,
			},
		],
		abilities: [
			{
				name: "Shield of the Faithful",
				description:
					"For 1 min, all damage dealt to allies within 30 ft is halved and you take the other half. Once/long rest.",
				cooldown: 3,
				cost: "Bonus action",
			},
		],
		stats: {
			primaryAttribute: "Charisma",
			secondaryAttribute: "Constitution",
			bonusStats: { charisma: 2, constitution: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "holy-knight--glory",
		name: "Path of the Ascendant Oath",
		jobId: "holy-knight",
		jobName: "Holy Knight",
		tier: 2,
		pathType: "glory",
		requirements: { level: 3, skills: ["Athletics", "Performance"] },
		description:
			"Olympic athletes, CrossFit champions, and stunt performers who strive for physical perfection and legendary deeds. Their covenant fuels superhuman athleticism — they break world records as a warm-up and their gate-raid highlight reels have more views than the Super Bowl. They inspire allies through feats of heroism and turn every battle into an epic display of System power.",
		features: [
			{
				name: "Channel Divinity: Peerless Athlete",
				description:
					"10 min: advantage on Athletics and Acrobatics. Carry/push/pull/lift capacity doubled. +10 ft to running long and high jumps.",
				level: 3,
			},
			{
				name: "Channel Divinity: Inspiring Smite",
				description:
					"After Divine Smite, distribute temp HP = 2d8+Holy Knight level among creatures within 30 ft (including yourself).",
				level: 3,
			},
			{
				name: "Aura of Alacrity",
				description:
					"Your speed +10 ft. Allies starting turn within 5 ft gain +10 ft speed until end of their turn. 10 ft at 18th.",
				level: 7,
			},
			{
				name: "Glorious Defense",
				description:
					"Reaction: when a creature you can see within 10 ft is hit, add PRE mod to its AC. If the attack misses, make one weapon attack against the attacker. PRE mod uses/long rest.",
				level: 15,
			},
			{
				name: "Living Legend",
				description:
					"Bonus action for 1 min: advantage on PRE checks, once per turn turn a miss into a hit, reroll a failed save (once). Once/long rest.",
				level: 20,
			},
		],
		abilities: [
			{
				name: "Heroic Charge",
				description:
					"Move up to double speed in a straight line. Each creature you pass within 5 ft: STR save or prone + 2d8 radiant. Once/short rest.",
				cooldown: 1,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Strength",
			secondaryAttribute: "Charisma",
			bonusStats: { strength: 2, charisma: 1 },
		},
		source: "System Ascendant Canon",
	},

	// ── TECHNOMANCER PATHS ── features at 3,5,9,15 ──
	{
		id: "technomancer--alchemist",
		name: "Path of the Mana Chemist",
		jobId: "technomancer",
		jobName: "Technomancer",
		tier: 2,
		pathType: "alchemist",
		requirements: { level: 3, skills: ["Arcana", "Medicine"] },
		description:
			"Pharmacists, biochemists, and craft brewers who brew potent elixirs from gate-harvested reagents. Their home labs look like Breaking Bad sets crossed with medieval apothecaries. They synthesize healing draughts, explosive compounds, and transformative potions that enhance their raid party's capabilities. The FDA has an entire department dedicated to regulating their output.",
		features: [
			{
				name: "Tool Proficiency",
				description: "Prof with alchemist's supplies.",
				level: 3,
			},
			{
				name: "Alchemist Spells",
				description:
					"Always prepared: Healing Word, Ray of Sickness (3rd), Flaming Sphere, Melf's Acid Arrow (5th), Gaseous Form, Mass Healing Word (9th), Blight, Death Ward (13th), Cloudkill, Raise Dead (17th).",
				level: 3,
			},
			{
				name: "Experimental Elixir",
				description:
					"After long rest, create one free elixir (more by spending spell slots). Roll d6 for type: healing (2d4+INT), swiftness (+10 ft speed), resilience (+1 AC), boldness (1d4 to attacks/saves), flight (10 ft fly), or transformation (alter self). Lasts until next long rest or drunk.",
				level: 3,
			},
			{
				name: "Alchemical Savant",
				description:
					"When you use alchemist's supplies as focus for a spell that restores HP or deals acid/fire/necrotic/poison damage, add INT mod to one roll.",
				level: 5,
			},
			{
				name: "Restorative Reagents",
				description:
					"Experimental Elixirs also grant 2d6+INT mod temp HP. Cast Lesser Restoration INT mod times/long rest without a slot.",
				level: 9,
			},
			{
				name: "Chemical Mastery",
				description:
					"Resistance to acid and poison damage, immune to poisoned condition. Cast Greater Restoration and Heal once each/long rest without a slot (using alchemist's supplies).",
				level: 15,
			},
		],
		abilities: [
			{
				name: "Volatile Concoction",
				description:
					"Throw an alchemical bomb: 20-ft radius, 4d6 acid + 4d6 fire, AGI save for half. Once/long rest.",
				cooldown: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Intelligence",
			secondaryAttribute: "Wisdom",
			bonusStats: { intelligence: 2, wisdom: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "technomancer--armorer",
		name: "Path of the Exo-Frame",
		jobId: "technomancer",
		jobName: "Technomancer",
		tier: 2,
		pathType: "armorer",
		requirements: { level: 3, skills: ["Arcana", "Athletics"] },
		description:
			"Mechanical engineers, prosthetics designers, and power-armor hobbyists who infuse armor with System blueprints. Their exoskeletons look like Iron Man suits built in a garage — because that's literally what they are. Defense contractors bid billions for their designs. The powered frames grant superhuman strength, integrated weapons, and impenetrable mana-reinforced defenses.",
		features: [
			{
				name: "Tools of the Trade",
				description: "Prof with heavy armor and smith's tools.",
				level: 3,
			},
			{
				name: "Armorer Spells",
				description:
					"Always prepared: Magic Missile, Thunderwave (3rd), Mirror Image, Shatter (5th), Hypnotic Pattern, Lightning Bolt (9th), Fire Shield, Greater Invisibility (13th), Passwall, Wall of Force (17th).",
				level: 3,
			},
			{
				name: "Arcane Armor",
				description:
					"Action: turn a suit of armor into Arcane Armor. It replaces missing limbs, can't be removed against your will, covers/replaces your fists. Choose model: Guardian (thunder gauntlets: 1d8 thunder melee, target has disadvantage on attacks vs others; defensive field: temp HP = Technomancer level as bonus action) or Infiltrator (lightning launcher: 1d6 lightning ranged 90 ft + 1d6 once/turn, +5 ft speed, advantage on Stealth).",
				level: 3,
			},
			{
				name: "Extra Attack",
				description: "Attack twice when you take the Attack action.",
				level: 5,
			},
			{
				name: "Armor Modifications",
				description:
					"Your Arcane Armor now counts as separate items for infusion purposes: armor (chest), boots, helmet, and weapon (each can hold one infusion). Max infusions increases by 2.",
				level: 9,
			},
			{
				name: "Perfected Armor",
				description:
					"Guardian: reaction when a creature you can see within 30 ft is hit — pull it up to 30 ft toward you, and if it ends within 5 ft, make a melee attack with thunder gauntlets. Infiltrator: any creature that takes lightning damage from you glows with light, and next attack against it has advantage; if that attack hits, it deals extra 1d6 lightning.",
				level: 15,
			},
		],
		abilities: [
			{
				name: "Overdrive",
				description:
					"Bonus action: Arcane Armor overcharges for 1 min. Guardian: thunder gauntlets deal 2d8. Infiltrator: lightning launcher deals 2d6+1d6 bonus. Once/long rest.",
				cooldown: 3,
				cost: "Bonus action",
			},
		],
		stats: {
			primaryAttribute: "Intelligence",
			secondaryAttribute: "Constitution",
			bonusStats: { intelligence: 2, constitution: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "technomancer--artillerist",
		name: "Path of the Siege Engineer",
		jobId: "technomancer",
		jobName: "Technomancer",
		tier: 2,
		pathType: "artillerist",
		requirements: { level: 3, skills: ["Arcana"] },
		description:
			"Artillery officers, weapons engineers, and competitive paintball champions who specialize in destructive magic channeled through mana turrets. Their construct weapons platforms lay suppressive fire, project shield barriers, or burn enemies from maximum range. Military bases license their turret designs; they're the reason gate-adjacent cities have 'no unauthorized turret deployment' ordinances.",
		features: [
			{
				name: "Tool Proficiency",
				description: "Prof with woodcarver's tools.",
				level: 3,
			},
			{
				name: "Artillerist Spells",
				description:
					"Always prepared: Shield, Thunderwave (3rd), Scorching Ray, Shatter (5th), Fireball, Wind Wall (9th), Ice Storm, Wall of Fire (13th), Cone of Cold, Wall of Force (17th).",
				level: 3,
			},
			{
				name: "Eldritch Cannon",
				description:
					"Action: create a Small or Tiny eldritch cannon in an unoccupied space within 5 ft. HP = 5× Technomancer level, AC 18. Choose type: Flamethrower (15-ft cone, 2d8 fire, AGI half), Force Ballista (ranged 120 ft, 2d8 force, push 5 ft), or Protector (10-ft radius, 1d8+INT mod temp HP to each creature you choose). Bonus action to fire. One at a time (two at 15th).",
				level: 3,
			},
			{
				name: "Arcane Firearm",
				description:
					"Use a wand, staff, or rod as spellcasting focus. +1d8 to one damage roll of Technomancer spell damage through it.",
				level: 5,
			},
			{
				name: "Explosive Cannon",
				description:
					"Eldritch Cannon damage increases by 1d8. As an action, command cannon to self-destruct: creatures within 20 ft take 3d8 force (AGI half).",
				level: 9,
			},
			{
				name: "Fortified Position",
				description:
					"You can create two cannons. You and allies within 10 ft of a cannon have half cover.",
				level: 15,
			},
		],
		abilities: [
			{
				name: "Barrage",
				description:
					"All your cannons fire simultaneously at full damage. Each cannon can target a different creature. Once/short rest.",
				cooldown: 1,
				cost: "Bonus action",
			},
		],
		stats: {
			primaryAttribute: "Intelligence",
			secondaryAttribute: "Constitution",
			bonusStats: { intelligence: 2, constitution: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "technomancer--battle-smith",
		name: "Path of the Construct Partner",
		jobId: "technomancer",
		jobName: "Technomancer",
		tier: 2,
		pathType: "battle-smith",
		requirements: { level: 3, skills: ["Arcana", "Athletics"] },
		description:
			"Roboticists, AI researchers, and veterinary prosthetics engineers who build System Defenders — loyal mana-construct companions that fight alongside them. Their workshops are full of half-finished robot dogs and prototype combat drones. They calibrate their own weapons via neural interface, using INT for attacks, making them formidable melee combatants who think faster than they swing.",
		features: [
			{
				name: "Tool Proficiency",
				description: "Prof with smith's tools.",
				level: 3,
			},
			{
				name: "Battle Smith Spells",
				description:
					"Always prepared: Heroism, Shield (3rd), Branding Smite, Warding Bond (5th), Aura of Vitality, Conjure Barrage (9th), Aura of Purity, Fire Shield (13th), Banishing Smite, Mass Cure Wounds (17th).",
				level: 3,
			},
			{
				name: "Battle Ready",
				description:
					"Prof with martial weapons. Use INT instead of STR or AGI for magic weapon attack/damage rolls.",
				level: 3,
			},
			{
				name: "Steel Defender",
				description:
					"Create a construct companion. HP = 2 + INT mod + 5× Technomancer level. AC = 15, uses your prof bonus. Takes its turn after yours; you command it (Dodge default). Reaction: impose disadvantage on attack vs creature within 5 ft of it. If destroyed, spend a spell slot during short/long rest to rebuild.",
				level: 3,
			},
			{
				name: "Extra Attack",
				description: "Attack twice when you take the Attack action.",
				level: 5,
			},
			{
				name: "Arcane Jolt",
				description:
					"When you or your Steel Defender hit with a magic weapon attack, deal extra 2d6 force damage OR heal a creature within 30 ft for 2d6 HP. INT mod uses/long rest.",
				level: 9,
			},
			{
				name: "Improved Defender",
				description:
					"Steel Defender's Deflect Attack now deals 1d4+INT mod force to the attacker. Arcane Jolt damage/healing increases to 4d6.",
				level: 15,
			},
		],
		abilities: [
			{
				name: "Construct Overdrive",
				description:
					"Steel Defender gains +2 AC, double speed, and its attacks deal extra 2d6 force for 1 min. Once/long rest.",
				cooldown: 3,
				cost: "Bonus action",
			},
		],
		stats: {
			primaryAttribute: "Intelligence",
			secondaryAttribute: "Constitution",
			bonusStats: { intelligence: 2, constitution: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "technomancer--drone-master",
		name: "Path of the Drone Swarm",
		jobId: "technomancer",
		jobName: "Technomancer",
		tier: 2,
		pathType: "drone-master",
		requirements: { level: 3, skills: ["Arcana", "Investigation"] },
		description:
			"Drone hobbyists, surveillance technicians, and Amazon delivery engineers who deploy System-enhanced micro-constructs. Their apartments sound like server farms — constant buzzing from dozens of tiny drones charging on every surface. They scout gate corridors, relay tactical intel via swarm networks, and converge their drones for devastating kamikaze strike runs.",
		features: [
			{
				name: "Tool Proficiency",
				description: "Prof with tinker's tools.",
				level: 3,
			},
			{
				name: "Drone Swarm",
				description:
					"Create up to INT mod Tiny drones (AC 13, 1 HP, 30 ft fly). They share your senses (you can see/hear through any drone within 1 mile). Bonus action: command all drones. Rebuild destroyed drones during short rest.",
				level: 3,
			},
			{
				name: "Combat Protocols",
				description:
					"Bonus action: command a drone within 60 ft to deliver a spell with range of touch. Drones can also take the Help action to give advantage on attacks.",
				level: 5,
			},
			{
				name: "Surveillance Network",
				description:
					"Drones within 120 ft of each other form a network. You have advantage on Perception and Investigation in the network area. Creatures can't surprise you or allies while in the network.",
				level: 9,
			},
			{
				name: "Advanced Drone Systems",
				description:
					"Drones gain: 30 HP, AC 15, 60 ft fly speed. They can carry and use items. You can see through all drones simultaneously. Command up to 3 drones with a single bonus action.",
				level: 15,
			},
		],
		abilities: [
			{
				name: "Drone Strike",
				description:
					"All drones within 60 ft converge on a point: 20-ft radius, 1d6 force per drone (max 6d6), AGI save for half. Drones are destroyed. Once/short rest.",
				cooldown: 1,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Intelligence",
			secondaryAttribute: "Dexterity",
			bonusStats: { intelligence: 2, dexterity: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "technomancer--system-hacker",
		name: "Path of the System Exploit",
		jobId: "technomancer",
		jobName: "Technomancer",
		tier: 2,
		pathType: "system-hacker",
		requirements: { level: 3, skills: ["Arcana", "Investigation"] },
		description:
			"Ethical hackers, penetration testers, and jailbreak enthusiasts who interface directly with the System's core architecture. They treat reality like software — finding exploits, suppressing enemy abilities, and rewriting the laws of magic in a localized area. The Hunter Bureau officially condemns their methods while quietly hiring them for classified operations.",
		features: [
			{
				name: "Tool Proficiency",
				description: "Prof with hacker's tools (thieves' tools variant).",
				level: 3,
			},
			{
				name: "System Override",
				description:
					"As an action, target one creature within 60 ft. INT save or one of its resistances, immunities, or condition immunities is suppressed for 1 min (concentration). INT mod uses/long rest.",
				level: 3,
			},
			{
				name: "Debug Protocol",
				description:
					"When you or an ally within 30 ft fails a save against a spell or magical effect, reaction: force a reroll with advantage. Prof bonus uses/long rest.",
				level: 5,
			},
			{
				name: "Exploit Vulnerability",
				description:
					"When a creature fails your System Override save, choose an additional effect: disadvantage on attacks for 1 round, speed halved, or vulnerability to one damage type you choose.",
				level: 9,
			},
			{
				name: "Root Access",
				description:
					"As an action, create a 30-ft radius zone for 1 min (concentration). In the zone: your allies have advantage on saves vs spells, and enemies have disadvantage on concentration checks and their spell save DCs are reduced by your prof bonus. Once/long rest.",
				level: 15,
			},
		],
		abilities: [
			{
				name: "System Crash",
				description:
					"Target creature within 60 ft: INT save or all its magical effects are suppressed and it can't cast spells for 1 round. Once/long rest.",
				cooldown: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Intelligence",
			secondaryAttribute: "Wisdom",
			bonusStats: { intelligence: 2, wisdom: 1 },
		},
		source: "System Ascendant Canon",
	},

	// ── IDOL PATHS ── features at 3,6,14 ──
	{
		id: "idol--college-of-lore",
		name: "Path of the Knowledge Resonance",
		jobId: "idol",
		jobName: "Idol",
		tier: 2,
		pathType: "lore",
		requirements: { level: 3, skills: ["History", "Performance"] },
		description:
			"Trivia champions, podcast hosts, and investigative journalists who absorb data from every System frequency, knowing fragments of everything. They weaponize information itself — disrupting enemies at critical moments with Dissonant Words that exploit psychological vulnerabilities. Quiz show producers have banned them from competing.",
		features: [
			{
				name: "Bonus Proficiencies",
				description: "Prof in 3 skills of your choice.",
				level: 3,
			},
			{
				name: "Cutting Words",
				description:
					"Reaction when a creature within 60 ft makes an attack, ability check, or damage roll: expend a Hype die and subtract it from the roll. After the creature rolls but before the DM declares success/failure.",
				level: 3,
			},
			{
				name: "Additional Magical Secrets",
				description:
					"Learn 2 spells from any class's spell list. They count as Idol spells.",
				level: 6,
			},
			{
				name: "Peerless Skill",
				description:
					"When you make an ability check, expend one Hype die and add it to the roll. After you roll but before the DM declares success/failure.",
				level: 14,
			},
		],
		abilities: [
			{
				name: "Words of Power",
				description:
					"Speak a devastating truth to a creature within 60 ft: SENSE save or 3d8 psychic + disadvantage on next attack. Once/short rest.",
				cooldown: 1,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Charisma",
			secondaryAttribute: "Intelligence",
			bonusStats: { charisma: 2, intelligence: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "idol--college-of-valor",
		name: "Path of the War Anthem",
		jobId: "idol",
		jobName: "Idol",
		tier: 2,
		pathType: "valor",
		requirements: { level: 3, skills: ["Athletics", "Performance"] },
		description:
			"Military drummers, sports hype-men, and heavy metal vocalists who are frontline frequency fighters. They broadcast combat-amplifying harmonics while wielding weapons and wearing armor — imagine a guitarist soloing while swinging a longsword. Their raid-party livestreams get the highest viewership because the combat footage has a built-in soundtrack.",
		features: [
			{
				name: "Bonus Proficiencies",
				description: "Prof with medium armor, shields, and martial weapons.",
				level: 3,
			},
			{
				name: "Combat Inspiration",
				description:
					"When a creature uses your Hype die on an attack roll, it can also add the die to a damage roll. Or it can add the die to AC against one attack (reaction, after seeing roll but before knowing if hit).",
				level: 3,
			},
			{
				name: "Extra Attack",
				description: "Attack twice when you take the Attack action.",
				level: 6,
			},
			{
				name: "Battle Magic",
				description:
					"When you use your action to cast an Idol spell, make one weapon attack as a bonus action.",
				level: 14,
			},
		],
		abilities: [
			{
				name: "War Anthem",
				description:
					"All allies within 30 ft gain +2 to attack rolls and saving throws for 1 min. Concentration. Once/long rest.",
				cooldown: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Charisma",
			secondaryAttribute: "Strength",
			bonusStats: { charisma: 2, strength: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "idol--college-of-glamour",
		name: "Path of the Hypnotic Frequency",
		jobId: "idol",
		jobName: "Idol",
		tier: 2,
		pathType: "glamour",
		requirements: { level: 3, skills: ["Performance", "Persuasion"] },
		description:
			"K-pop choreographers, hypnotherapists, and cult deprogrammers (turned re-programmers) who broadcast on the fey-resonance band. Their TikTok videos have been flagged for 'anomalous engagement metrics' — viewers can't stop watching. They charm entire crowds with irresistible harmonic patterns, and their presence is supernaturally amplified. Nightclub owners pay them not to perform near competing venues.",
		features: [
			{
				name: "Mantle of Inspiration",
				description:
					"Bonus action: expend one Hype die. Up to PRE mod creatures within 60 ft gain temp HP = 2× Hype die roll + Idol level and can use reaction to move up to their speed without provoking OAs.",
				level: 3,
			},
			{
				name: "Enthralling Performance",
				description:
					"After 1+ min performance, PRE mod creatures that watched make SENSE save or are charmed for 1 hour. Charmed creatures idolize you, hinder those who oppose you, and don't know they were charmed when it ends.",
				level: 3,
			},
			{
				name: "Mantle of Majesty",
				description:
					"Bonus action: take on an appearance of unearthly beauty for 1 min (concentration). Each turn, bonus action Command spell (no slot) against a creature charmed by you. Once/long rest.",
				level: 6,
			},
			{
				name: "Unbreakable Majesty",
				description:
					"Bonus action: for 1 min, any creature that attacks you for the first time on a turn must make a PRE save. Fail: attack is wasted (can't attack you this turn). Success: disadvantage on saves vs your spells until end of your next turn. Once per short rest.",
				level: 14,
			},
		],
		abilities: [
			{
				name: "Fey Charm",
				description:
					"All creatures within 30 ft: SENSE save or charmed by you for 1 min. Charmed creatures will follow one reasonable suggestion. Once/long rest.",
				cooldown: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Charisma",
			secondaryAttribute: "Dexterity",
			bonusStats: { charisma: 2, dexterity: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "idol--college-of-swords",
		name: "Path of the Blade Resonance",
		jobId: "idol",
		jobName: "Idol",
		tier: 2,
		pathType: "swords",
		requirements: { level: 3, skills: ["Acrobatics", "Performance"] },
		description:
			"Competitive fencers, circus sword-swallowers, and stunt coordinators who channel harmonic frequencies through their weapons. Their combat footage looks like choreographed action movies — because to them, fighting IS a performance. They use Hype dice to fuel devastating blade flourishes that deal extra damage, boost defense, or cut through multiple foes. Weapons manufacturers sponsor them.",
		features: [
			{
				name: "Bonus Proficiencies",
				description:
					"Prof with medium armor and the scimitar. Use a weapon as spellcasting focus.",
				level: 3,
			},
			{
				name: "Fighting Style",
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
				name: "Extra Attack",
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
				name: "Dance of Blades",
				description:
					"Make a melee attack against every creature within 10 ft. Each hit uses a free Blade Flourish (d6, no Hype die expended). Once/short rest.",
				cooldown: 1,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Charisma",
			secondaryAttribute: "Dexterity",
			bonusStats: { charisma: 2, dexterity: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "idol--college-of-whispers",
		name: "Path of the Shadow Frequency",
		jobId: "idol",
		jobName: "Idol",
		tier: 2,
		pathType: "whispers",
		requirements: { level: 3, skills: ["Deception", "Performance"] },
		description:
			"Former intelligence operatives, true-crime podcasters, and corporate espionage specialists who broadcast on hidden subsonic channels. They appear as normal performers but are actually gathering intel — planting fear, extracting secrets, and assuming stolen identities. Several high-profile identity theft rings have turned out to be Shadow Frequency Idols running side hustles.",
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
					"Reaction when a humanoid dies within 30 ft: capture its shadow. As an action, take on its appearance for 1 hour (or until dismissed). You gain access to its general knowledge and memories. Deception checks to pass as it have +5. Once per short rest.",
				level: 6,
			},
			{
				name: "Shadow Lore",
				description:
					"Action: creature within 30 ft, SENSE save or it is charmed for 8 hours. It believes you know its deepest secret (even if you don't) and obeys your commands to avoid the secret being revealed. Once per long rest.",
				level: 14,
			},
		],
		abilities: [
			{
				name: "Psychic Assault",
				description:
					"60 ft: creature makes SENSE save or takes 4d8 psychic and is frightened of you for 1 min. Once/long rest.",
				cooldown: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Charisma",
			secondaryAttribute: "Dexterity",
			bonusStats: { charisma: 2, dexterity: 1 },
		},
		source: "System Ascendant Canon",
	},

	{
		id: "idol--college-of-creation",
		name: "Path of the Genesis Frequency",
		jobId: "idol",
		jobName: "Idol",
		tier: 2,
		pathType: "creation",
		requirements: { level: 3, skills: ["Arcana", "Performance"] },
		description:
			"3D printing enthusiasts, sculptors, and special effects artists who tap into the System's foundational harmonic — the frequency that structures matter itself. They animate objects, fabricate items from raw mana, and bring performances to physical life. Manufacturing companies have tried to patent their abilities; the courts ruled you can't patent a person. Their workshops look like Willy Wonka factories.",
		features: [
			{
				name: "Mote of Potential",
				description:
					"When you give a Hype die, the creature also gains a mote. Attack roll: mote explodes in 5-ft radius thunder (VIT save = Hype die roll). Ability check: roll Hype die twice, use either. Save: gains temp HP = Hype die roll + PRE mod.",
				level: 3,
			},
			{
				name: "Performance of Creation",
				description:
					"Action: create one nonmagical item (Medium or smaller, worth ≤ 20× Idol level gp). Lasts for hours = prof bonus. One at a time. Once per long rest (or 2nd+ level slot).",
				level: 3,
			},
			{
				name: "Animating Performance",
				description:
					"Action: animate a Large or smaller nonmagical item within 30 ft. It becomes a construct (HP = 10+5× Idol level, AC = 16, +prof to attack, 1d10+PRE force slam, 30 ft speed). Bonus action to command. Lasts 1 hour. Once per long rest (or 3rd+ level slot).",
				level: 6,
			},
			{
				name: "Creative Crescendo",
				description:
					"Performance of Creation: create a number of items = PRE mod simultaneously. One can be Large, and any can be worth more (up to 200× Idol level gp). None require concentration or have the duration limit.",
				level: 14,
			},
		],
		abilities: [
			{
				name: "Magnum Opus",
				description:
					"Create a Large animated construct (HP = 50, AC 18, +8 attack, 2d10+5 force slam). It lasts 1 hour and obeys your commands. Once/long rest.",
				cooldown: 3,
				cost: "Action",
			},
		],
		stats: {
			primaryAttribute: "Charisma",
			secondaryAttribute: "Intelligence",
			bonusStats: { charisma: 2, intelligence: 1 },
		},
		source: "System Ascendant Canon",
	},
];
