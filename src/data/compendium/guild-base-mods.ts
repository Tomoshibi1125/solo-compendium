/**
 * GUILD BASE FACILITIES — the upgradeable wings of a guild's hall, built in full.
 *
 * Each facility has three tiers; each tier is BOUGHT with guild funds (ungated —
 * no prerequisites) or Warden-granted. Benefits are HONEST (see `GuildBenefitSource`
 * in `lib/guildBase.ts`): a real `capability` (member cap / extra Forge recipes), a
 * real 5e `effects` array that applies to members' character sheets, or — where no
 * mechanic fits the fiction — a narrative `benefit` string. No invented stat keys.
 *
 * source_book: "Rift Ascendant Canon".
 */

import type { GuildFacility } from "@/lib/guildBase";

export const GUILD_FACILITIES: GuildFacility[] = [
	{
		id: "barracks",
		name: "Barracks",
		summary:
			"Bunks, drill floors, and a muster hall — the more room a guild keeps, the more hands it can field.",
		source_book: "Rift Ascendant Canon",
		tiers: [
			{
				tier: 1,
				name: "Cot Rows",
				cost: { currency: "gate", amount: 150 },
				capability: { memberCap: 2 },
				description:
					"Cleared bunkhouse with cot rows and a shared mess. Room enough to keep a working roster fed and rested.",
			},
			{
				tier: 2,
				name: "Drill Hall",
				cost: { currency: "gate", amount: 400 },
				capability: { memberCap: 3 },
				description:
					"A proper drill hall with armatures and sparring cages. Recruits sharpen between contracts instead of idling.",
			},
			{
				tier: 3,
				name: "Garrison Wing",
				cost: { currency: "gate", amount: 900 },
				capability: { memberCap: 5 },
				benefit:
					"A standing garrison the Bureau takes seriously — private quarters, an armory, and a roster other guilds court.",
				description:
					"A full garrison wing — private quarters, an armory, and a standing roster the Bureau actually takes seriously.",
			},
		],
	},
	{
		id: "forge",
		name: "Forge & Workshop",
		summary:
			"A guild bench for working salvaged essence into gear — adds in-house crafting options without gating anything.",
		source_book: "Rift Ascendant Canon",
		tiers: [
			{
				tier: 1,
				name: "Field Bench",
				cost: { currency: "gate", amount: 200 },
				capability: { craftingOptions: ["recipe-field-repair-minor"] },
				description:
					"A covered bench with a salvage anvil and a regulated essence tap. Members can run field repairs in-house.",
			},
			{
				tier: 2,
				name: "Essence Forge",
				cost: { currency: "gate", amount: 500 },
				capability: {
					craftingOptions: [
						"recipe-afa-sensor-splice",
						"recipe-grounding-tack",
					],
				},
				description:
					"A tuned essence forge with a containment lattice. Mid-tier refits and AFA work become practical at the bench.",
			},
			{
				tier: 3,
				name: "Master Workshop",
				cost: { currency: "gate", amount: 1100 },
				capability: {
					craftingOptions: [
						"recipe-relic-anchor-bracket",
						"recipe-major-vehicle-rebuild",
					],
				},
				benefit:
					"Paired master forges — the guild can take on relic-anchor and full vehicle work other crews send away.",
				description:
					"A master workshop with paired forges and a containment lattice — the guild can craft the heaviest refits its members carry materials for.",
			},
		],
	},
	{
		id: "war_room",
		name: "War Room",
		summary:
			"Map tables and pre-mission briefings — a briefed squad moves first. Grants members an Initiative bonus.",
		source_book: "Rift Ascendant Canon",
		tiers: [
			{
				tier: 1,
				name: "Briefing Table",
				cost: { currency: "gate", amount: 180 },
				effects: [{ kind: "initiative_bonus", value: 1 }],
				description:
					"A briefing table and a pin-board of open gate contracts. Squads walk into the threshold already knowing the plan.",
			},
			{
				tier: 2,
				name: "Operations Room",
				cost: { currency: "gate", amount: 450 },
				effects: [{ kind: "initiative_bonus", value: 1 }],
				description:
					"A live operations room tracking multiple gates at once. Standing drills shave the seconds that decide a breach.",
			},
			{
				tier: 3,
				name: "Command Center",
				cost: { currency: "gate", amount: 1000 },
				effects: [{ kind: "initiative_bonus", value: 1 }],
				description:
					"A Bureau-grade command center with relay links and a standing dispatch — members enter every gate fully briefed.",
			},
		],
	},
	{
		id: "vault",
		name: "Vault",
		summary:
			"Warded strongroom for credits, crystals, and contract spoils — the guild's treasury writ in stone.",
		source_book: "Rift Ascendant Canon",
		tiers: [
			{
				tier: 1,
				name: "Strongbox",
				cost: { currency: "gate", amount: 120 },
				benefit:
					"A warded strongbox keeps the guild's spoils from walking off between contracts.",
				description:
					"A warded strongbox bolted into the foundation. Keeps the guild's spoils from walking off between contracts.",
			},
			{
				tier: 2,
				name: "Warded Vault",
				cost: { currency: "gate", amount: 380 },
				benefit:
					"A glyph-sealed vault with a registered ledger — reserves and contract spoils stay secure and audited.",
				description:
					"A glyph-sealed vault with a registered ledger. Spoils and reserves stay secure between contracts.",
			},
			{
				tier: 3,
				name: "Essence Reserve",
				cost: { currency: "gate", amount: 850 },
				benefit:
					"A layered-ward essence reserve — the guild stockpiles high-grade essence without risk of loss.",
				description:
					"A full essence reserve with layered wards — the guild stockpiles high-grade essence without risk of loss.",
			},
		],
	},
	{
		id: "infirmary",
		name: "Infirmary",
		summary:
			"Recovery cots and essence-stabilizers that get a strike squad back on its feet between gates.",
		source_book: "Rift Ascendant Canon",
		tiers: [
			{
				tier: 1,
				name: "Aid Station",
				cost: { currency: "gate", amount: 160 },
				benefit:
					"A clean aid station with salves and a stabilizer cot — wounded members recover before the next contract.",
				description:
					"A clean aid station with salves and a stabilizer cot. Wounded members recover before the next contract.",
			},
			{
				tier: 2,
				name: "Recovery Ward",
				cost: { currency: "gate", amount: 420 },
				benefit:
					"A field-medic-staffed ward with essence-purge baths — even mana-burn cases are back on roster quickly.",
				description:
					"A recovery ward staffed by a field medic, with essence-purge baths for mana-burn cases.",
			},
			{
				tier: 3,
				name: "Restoration Suite",
				cost: { currency: "gate", amount: 950 },
				benefit:
					"A bonded healer and a containment tank — even a mauled squad is fit to deploy within the day.",
				description:
					"A restoration suite with a bonded healer and a containment tank. Even a mauled squad is fit within the day.",
			},
		],
	},
	{
		id: "archive",
		name: "Archive",
		summary:
			"Dossiers, gate surveys, and rank-eval records — the guild's institutional memory and Bureau standing.",
		source_book: "Rift Ascendant Canon",
		tiers: [
			{
				tier: 1,
				name: "Records Nook",
				cost: { currency: "gate", amount: 140 },
				benefit:
					"A locked cabinet of contract dossiers and survey notes — a guild that keeps its paperwork is one the Bureau trusts.",
				description:
					"A locked cabinet of contract dossiers and survey notes. The Bureau evaluates a guild that keeps its paperwork.",
			},
			{
				tier: 2,
				name: "Survey Archive",
				cost: { currency: "gate", amount: 410 },
				benefit:
					"A cross-referenced survey archive — squads walk into a gate already knowing where the veins and choke-points run.",
				description:
					"A cross-referenced survey archive — the guild walks into a gate already knowing where the veins run.",
			},
			{
				tier: 3,
				name: "Hall of Records",
				cost: { currency: "gate", amount: 880 },
				benefit:
					"A hall of records the Bureau itself consults — a guild this organized carries real institutional weight.",
				description:
					"A proper hall of records the Bureau consults. A guild this organized promotes a rank faster than it raids.",
			},
		],
	},
	{
		id: "training_hall",
		name: "Training Hall",
		summary:
			"Sparring floors and conditioning drills that harden a roster — members who train here carry more punishment through a gate.",
		source_book: "Rift Ascendant Canon",
		tiers: [
			{
				tier: 1,
				name: "Sparring Floor",
				cost: { currency: "gate", amount: 170 },
				effects: [{ kind: "hp_flat", value: 3 }],
				description:
					"A padded sparring floor with weighted dummies. Regular drilling toughens every member who calls the hall home.",
			},
			{
				tier: 2,
				name: "Conditioning Gym",
				cost: { currency: "gate", amount: 430 },
				effects: [{ kind: "hp_flat", value: 3 }],
				description:
					"Racks, ropes, and endurance circuits. A conditioned squad simply lasts longer once a clear turns ugly.",
			},
			{
				tier: 3,
				name: "War Academy",
				cost: { currency: "gate", amount: 940 },
				effects: [{ kind: "hp_flat", value: 4 }],
				benefit:
					"A standing war academy — recruits arrive soft and leave able to shrug off hits that would drop a rival crew.",
				description:
					"A full war academy with instructors and graded courses. Members leave hardened against the punishment a gate deals out.",
			},
		],
	},
	{
		id: "armory",
		name: "Armory",
		summary:
			"Racked, maintained, standard-issue gear — a guild that arms its members well sends them into a gate better protected.",
		source_book: "Rift Ascendant Canon",
		tiers: [
			{
				tier: 1,
				name: "Weapon Racks",
				cost: { currency: "gate", amount: 190 },
				effects: [{ kind: "ac_bonus", value: 1 }],
				description:
					"Racked arms and a maintenance bench. Members deploy in fitted, cared-for kit instead of whatever they scrounged.",
			},
			{
				tier: 2,
				name: "Quartermaster's Store",
				cost: { currency: "gate", amount: 480 },
				capability: { craftingOptions: ["recipe-standard-issue-kit"] },
				description:
					"A quartermaster who issues and refits kit to a standard — the bench can assemble a guild-pattern loadout on demand.",
			},
			{
				tier: 3,
				name: "Master Armory",
				cost: { currency: "gate", amount: 1020 },
				effects: [{ kind: "ac_bonus", value: 1 }],
				benefit:
					"A master armory the Bureau inspects and approves — the guild fields a uniformly well-armored roster.",
				description:
					"A master armory with fitted plate and warded weapon lockers. Every member deploys in guild-pattern protection.",
			},
		],
	},
	{
		id: "sanctum",
		name: "Ward Sanctum",
		summary:
			"Layered wards against rift corruption — members who rest under them carry that protection out into the gate.",
		source_book: "Rift Ascendant Canon",
		tiers: [
			{
				tier: 1,
				name: "Warding Circle",
				cost: { currency: "gate", amount: 210 },
				benefit:
					"A consecrated warding circle bleeds the rift's residue out of a returning squad before it festers.",
				description:
					"A consecrated warding circle inlaid in the floor. Returning members shed accumulated rift-residue before it takes root.",
			},
			{
				tier: 2,
				name: "Sealed Reliquary",
				cost: { currency: "gate", amount: 520 },
				effects: [{ kind: "resistance", damageType: "necrotic" }],
				description:
					"A sealed reliquary of grounding relics. Attunement to its wards leaves members inured to the gate's rot.",
			},
			{
				tier: 3,
				name: "Great Ward",
				cost: { currency: "gate", amount: 1080 },
				effects: [{ kind: "resistance", damageType: "psychic" }],
				benefit:
					"A Great Ward that quiets the rift's whisper — members steeped in it resist the minds a deep gate turns against them.",
				description:
					"A full Great Ward, tuned by a bonded warden. Members steeped in it withstand both the gate's rot and its whisper.",
			},
		],
	},
	{
		id: "observatory",
		name: "Gate Observatory",
		summary:
			"Watch spires and survey instruments that read a gate before it opens — a guild that studies the threshold is harder to surprise.",
		source_book: "Rift Ascendant Canon",
		tiers: [
			{
				tier: 1,
				name: "Watch Spire",
				cost: { currency: "gate", amount: 200 },
				effects: [{ kind: "passive_bonus", passive: "perception", value: 1 }],
				description:
					"A watch spire with logged gate-flux readings. Members drilled on its feeds walk in already reading the threshold.",
			},
			{
				tier: 2,
				name: "Survey Deck",
				cost: { currency: "gate", amount: 500 },
				effects: [{ kind: "passive_bonus", passive: "perception", value: 1 }],
				description:
					"A survey deck cross-referencing flux against known gate types — the guild spots an anomaly's tells sooner.",
			},
			{
				tier: 3,
				name: "Astral Observatory",
				cost: { currency: "gate", amount: 1050 },
				effects: [{ kind: "passive_bonus", passive: "perception", value: 1 }],
				benefit:
					"A Bureau-grade observatory — the guild reads a gate so thoroughly its squads are almost never caught blind.",
				description:
					"A full astral observatory with a bonded surveyor. Members enter every gate having already studied what waits inside.",
			},
		],
	},
	{
		id: "essence_garden",
		name: "Essence Garden",
		summary:
			"Cultivated essence-blooms and reagent beds — a living stock of alchemical materials the bench turns into consumables.",
		source_book: "Rift Ascendant Canon",
		tiers: [
			{
				tier: 1,
				name: "Spore Beds",
				cost: { currency: "gate", amount: 180 },
				capability: { craftingOptions: ["recipe-essence-tonic"] },
				description:
					"Warded spore beds coaxing essence-blooms from stabilized gate soil. The first steady reagent supply reaches the bench.",
			},
			{
				tier: 2,
				name: "Bloom Terrace",
				cost: { currency: "gate", amount: 460 },
				capability: {
					craftingOptions: ["recipe-warding-incense", "recipe-stamina-draught"],
				},
				description:
					"A tiered bloom terrace under regulated light. Richer harvests open a wider shelf of guild-made consumables.",
			},
			{
				tier: 3,
				name: "Verdant Sanctum",
				cost: { currency: "gate", amount: 990 },
				capability: { craftingOptions: ["recipe-greater-essence-elixir"] },
				benefit:
					"A verdant sanctum of cultivated rift-flora — the guild brews high-grade elixirs other crews pay dearly for.",
				description:
					"A verdant sanctum of cultivated rift-flora, tended full-time. The bench can distill the guild's finest elixirs.",
			},
		],
	},
	{
		id: "great_hall",
		name: "Great Hall",
		summary:
			"A banner hall and hearth where a guild gathers — reputation and belonging that a growing roster is drawn to.",
		source_book: "Rift Ascendant Canon",
		tiers: [
			{
				tier: 1,
				name: "Common Hall",
				cost: { currency: "gate", amount: 160 },
				benefit:
					"A warm common hall with a hearth and long tables — the guild eats together, and a fed roster holds together.",
				description:
					"A warm common hall with a hearth and long tables. Shared meals and downtime keep a working roster from fraying.",
			},
			{
				tier: 2,
				name: "Feast Hall",
				cost: { currency: "gate", amount: 420 },
				benefit:
					"A feast hall that hosts other crews and Bureau guests — the guild's name travels further than its contracts do.",
				description:
					"A proper feast hall for celebrations and parleys. A guild that hosts well is a guild others want to be seen with.",
			},
			{
				tier: 3,
				name: "Hall of Banners",
				cost: { currency: "gate", amount: 900 },
				capability: { memberCap: 2 },
				benefit:
					"A Hall of Banners hung with the guild's earned honors — awakened seeking a banner worth flying come to it.",
				description:
					"A grand Hall of Banners displaying the guild's honors and fallen. Its standing draws recruits that lesser halls never see.",
			},
		],
	},
];
