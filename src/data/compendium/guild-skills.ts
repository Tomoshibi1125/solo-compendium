/**
 * GUILD SKILLS — guild-wide doctrines a guild adopts (built in full).
 *
 * Each skill is a flat-cost, UNGATED purchase (buy with guild funds if affordable)
 * or Warden-granted. No prerequisite trees. Benefits are HONEST (see
 * `GuildBenefitSource` in `lib/guildBase.ts`): a real `capability` (member cap /
 * extra Forge recipes), a real 5e `effects` array that applies to members' sheets,
 * or a narrative `benefit` string where no mechanic fits. No invented stat keys.
 *
 * source_book: "Rift Ascendant Canon".
 */

import type { GuildSkill } from "@/lib/guildBase";

export const GUILD_SKILLS: GuildSkill[] = [
	{
		id: "gs-mining-doctrine",
		name: "Mining Doctrine",
		cost: { currency: "gate", amount: 300 },
		capability: { craftingOptions: ["recipe-emergency-bridge-kit"] },
		description:
			"Standing orders to strip a Rift of every crystal before the seal. The guild's salvage stores support heavier field-engineering work.",
		source_book: "Rift Ascendant Canon",
	},
	{
		id: "gs-salvage-rights",
		name: "Salvage Rights",
		cost: { currency: "gate", amount: 350 },
		capability: {
			craftingOptions: [
				"recipe-cabin-seal-refit",
				"recipe-residue-safe-rations",
			],
		},
		description:
			"Registered salvage claims and a sorting protocol — more usable stock reaches the bench, opening extra refit recipes.",
		source_book: "Rift Ascendant Canon",
	},
	{
		id: "gs-veteran-cadre",
		name: "Veteran Cadre",
		cost: { currency: "gate", amount: 400 },
		capability: { memberCap: 3 },
		description:
			"A core of seasoned hands who mentor newcomers, letting the guild carry a larger roster without it fraying.",
		source_book: "Rift Ascendant Canon",
	},
	{
		id: "gs-rapid-deployment",
		name: "Rapid Deployment",
		cost: { currency: "gate", amount: 450 },
		effects: [{ kind: "initiative_bonus", value: 1 }],
		description:
			"Pre-packed kit and a rotating ready-squad. Members drilled in fast deployment act sooner when a Rift opens.",
		source_book: "Rift Ascendant Canon",
	},
	{
		id: "gs-vanguard-tactics",
		name: "Vanguard Tactics",
		cost: { currency: "gate", amount: 500 },
		effects: [{ kind: "attack_bonus", value: 1 }],
		description:
			"Drilled breach-and-clear doctrine — members fight with the confidence of a formation that has its back, landing cleaner hits.",
		source_book: "Rift Ascendant Canon",
	},
	{
		id: "gs-field-medicine",
		name: "Field Medicine",
		cost: { currency: "gate", amount: 350 },
		benefit:
			"Every squad carries a trained field medic and a stabilizer pack — fewer members sidelined after a hard clear.",
		description:
			"Every squad carries a trained field medic and a stabilizer pack — fewer members sidelined after a hard clear.",
		source_book: "Rift Ascendant Canon",
	},
	{
		id: "gs-bureau-liaison",
		name: "Bureau Liaison",
		cost: { currency: "gate", amount: 400 },
		benefit:
			"A dedicated liaison files clean after-action reports — the guild's Bureau standing opens doors others wait in line for.",
		description:
			"A dedicated liaison who files clean after-action reports. The Bureau treats a well-documented guild as a known quantity.",
		source_book: "Rift Ascendant Canon",
	},
	{
		id: "gs-rank-discipline",
		name: "Rank Discipline",
		cost: { currency: "gate", amount: 550 },
		benefit:
			"Internal evaluations modeled on the Bureau's own — members enter their rank exams already proven.",
		description:
			"Internal evaluations modeled on the Bureau's own. Members enter their rank exams already proven.",
		source_book: "Rift Ascendant Canon",
	},
	{
		id: "gs-open-recruitment",
		name: "Open Recruitment",
		cost: { currency: "gate", amount: 300 },
		capability: { memberCap: 2 },
		description:
			"A standing recruitment drive and a vetting officer — the guild keeps room for more awakened looking for a banner.",
		source_book: "Rift Ascendant Canon",
	},
	{
		id: "gs-essence-banking",
		name: "Essence Banking",
		cost: { currency: "gate", amount: 600 },
		benefit:
			"A registered essence-banking arrangement with the Bureau — the guild's reserves are secured and expanded.",
		description:
			"A registered essence-banking arrangement with the Bureau. The guild's reserves are secured and expanded.",
		source_book: "Rift Ascendant Canon",
	},
];
