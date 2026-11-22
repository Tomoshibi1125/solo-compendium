/**
 * RA-21 parity (docs/canon/rift-ascendant-canon-locks.md).
 *
 * The canon locks, the mechanics doc, the in-app sourcebook, the server
 * migrations, and the runtime rules must state the same Regent and companion
 * numbers, and active code must not carry retired rules wording. The numbers
 * are parsed from the documents, so editing one copy fails this suite until
 * every copy agrees.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { anomalies } from "@/data/compendium/anomalies";
import { regents } from "@/data/compendium/regents";
import { allMounts } from "@/data/compendium/vehicles";
import {
	type CompanionHitDie,
	companionDamageDiceCount,
	companionDamageExpression,
	companionProficiencyBonus,
	companionRankTier,
	naturalAttackDie,
	parseStatBlockHitDie,
	rewriteCompanionText,
	scaleCompanionAtLevel,
	sizeHitDie,
} from "@/lib/companionProgression";
import {
	companionHitDicePool,
	resolveCompanionScalingSource,
	scaleCompanionInstance,
} from "@/lib/companionScaling";
import {
	clearConditionsOnLongRest,
	getActiveConditionNames,
	migrateLegacyConditions,
} from "@/lib/conditionSystem";
import { getRegentHpContribution } from "@/lib/regentGestalt";
import {
	getRegentAbilityKnownCount,
	getRegentResonanceCost,
	getRegentResonanceMax,
	REGENT_ABILITY_KNOWN_BY_LEVEL,
	REGENT_RESONANCE_MAX,
} from "@/lib/regentResonanceRules";

const ROOT = resolve(__dirname, "../../..");
const read = (path: string): string => readFileSync(join(ROOT, path), "utf8");

/** Collapse Markdown/JSX wrapping so a sentence can be matched whole. */
const prose = (text: string): string =>
	text
		.replace(/\{"\s*"\}/g, " ")
		.replace(/\*\*/g, "")
		.replace(/\s+/g, " ");

const CANON_PATH = "docs/canon/rift-ascendant-canon-locks.md";
const MECHANICS_PATH = "docs/system-ascendant-mechanics.md";
const SOURCEBOOK_PATH =
	"src/components/compendium/wardens-directive/GameRulesChapter.tsx";
const CANON = prose(read(CANON_PATH));
const MECHANICS = prose(read(MECHANICS_PATH));
const SOURCEBOOK = prose(read(SOURCEBOOK_PATH));

const LEVELS = Array.from({ length: 20 }, (_, index) => index + 1);
const RANKS = ["E", "D", "C", "B", "A", "S"] as const;

function mustMatch(text: string, pattern: RegExp, label: string) {
	const match = pattern.exec(text);
	if (!match) throw new Error(`${label}: no match for ${pattern}`);
	return match;
}

/** The first backtick number list after `marker`, e.g. `1,1,2,…`. */
function listAfter(text: string, marker: string): number[] {
	const start = text.indexOf(marker);
	if (start < 0) throw new Error(`Missing "${marker}"`);
	const match = mustMatch(text.slice(start), /`(\d+(?:,\d+)+)`/, marker);
	return match[1].split(",").map(Number);
}

/** `1 at levels 1–2, 2 at 3–5, …, and 8 at 20`, the documents' phrasing. */
function describeByLevel(values: readonly number[], unit?: string): string {
	const runs: Array<{ value: number; from: number; to: number }> = [];
	values.forEach((value, index) => {
		const last = runs.at(-1);
		if (last?.value === value) last.to = index + 1;
		else runs.push({ value, from: index + 1, to: index + 1 });
	});
	const parts = runs.map(({ value, from, to }, index) => {
		const levels = from === to ? `${from}` : `${from}–${to}`;
		return index === 0
			? `${value}${unit ? ` ${unit}` : ""} at levels ${levels}`
			: `${value} at ${levels}`;
	});
	return `${parts.slice(0, -1).join(", ")}, and ${parts.at(-1)}`;
}

/** The body of the newest migration that (re)defines `fn`, whitespace-collapsed. */
function latestDefinition(fn: string): string {
	const directory = join(ROOT, "supabase/migrations");
	const header = new RegExp(
		`CREATE (?:OR REPLACE )?FUNCTION ${fn.replace(".", "\\.")}\\(`,
	);
	const files = readdirSync(directory)
		.filter((file) => file.endsWith(".sql"))
		.sort()
		.reverse();
	for (const file of files) {
		const sql = readFileSync(join(directory, file), "utf8");
		const start = sql.search(header);
		if (start < 0) continue;
		const rest = sql.slice(start);
		const tag = mustMatch(rest, /\bAS\s+(\$\w*\$)/, fn)[1];
		const bodyStart = rest.indexOf(tag) + tag.length;
		return prose(rest.slice(bodyStart, rest.indexOf(tag, bodyStart)));
	}
	throw new Error(`No migration defines ${fn}`);
}

/** `E 0, D 1, …` pairs from a "Rank tiers are …; a missing rank counts as D" sentence. */
function rankTiersIn(text: string): Record<string, number> {
	const sentence = mustMatch(
		text,
		/Rank tiers are ([^;]+); a missing rank counts as D/,
		"rank tiers",
	)[1];
	return Object.fromEntries(
		[...sentence.matchAll(/\b([EDCBAS]) (\d)\b/g)].map(([, rank, tier]) => [
			rank,
			Number(tier),
		]),
	);
}

const mountNamed = (name: string) => {
	const mount = allMounts.find((entry) => entry.name === name);
	if (!mount) throw new Error(`No mount named ${name}`);
	return mount;
};

const scalingSource = (collection: "anomalies" | "vehicles", id: string) =>
	resolveCompanionScalingSource({
		source_collection: collection,
		source_id: id,
	});

describe("RA-1 Regent Resonance", () => {
	it("uses one maximum table in the documents, the client, and the server", () => {
		const canon = listAfter(CANON, "RA-1 — Regent Resonance");
		expect(canon).toHaveLength(20);
		expect([...REGENT_RESONANCE_MAX]).toEqual(canon);
		expect(LEVELS.map(getRegentResonanceMax)).toEqual(canon);
		expect(listAfter(MECHANICS, "Regent Resonance:")).toEqual(canon);
		expect(SOURCEBOOK).toContain(
			`Maximum points are ${describeByLevel(canon)}.`,
		);
		const server = mustMatch(
			latestDefinition("app_private.regent_resonance_max"),
			/ARRAY\[([\d,\s]+)\]/,
			"server table",
		)[1];
		expect(server.split(",").map((value) => Number(value.trim()))).toEqual(
			canon,
		);
	});

	it("charges 1, 2, 2, 3, 3 Resonance for tiers 5–9", () => {
		expect([5, 6, 7, 8, 9].map(getRegentResonanceCost)).toEqual([
			1, 2, 2, 3, 3,
		]);
		expect([4, 10, 5.5].map(getRegentResonanceCost)).toEqual([
			null,
			null,
			null,
		]);
		const costs =
			/tier 5 (?:Powers and Techniques )?costs? 1[;,] tiers 6–7 cost 2[;,] (?:and )?tiers 8–9 cost 3/i;
		for (const text of [CANON, MECHANICS, SOURCEBOOK]) {
			expect(text).toMatch(costs);
		}
	});
});

describe("RA-3 Regent HP", () => {
	it("adds one maximum Regent Hit Die per level, as the worked examples state", () => {
		const [, die, perLevel, total, level] = mustMatch(
			CANON,
			/A d(\d+) Regent therefore adds \+(\d+) at each level: \+(\d+) total by level (\d+)/,
			"canon d10 example",
		).map(Number);
		expect(getRegentHpContribution(die, level)).toBe(total);
		expect(
			getRegentHpContribution(die, level + 1) -
				getRegentHpContribution(die, level),
		).toBe(perLevel);

		const [, bigDie, bigTotal, bigLevel] = mustMatch(
			CANON,
			/A d(\d+) Regent adds \+(\d+) total by level (\d+)/,
			"canon d12 example",
		).map(Number);
		expect(getRegentHpContribution(bigDie, bigLevel)).toBe(bigTotal);

		const [, docDie, docTotal, docLevel, docNext] = mustMatch(
			MECHANICS,
			/For a d(\d+) Regent, the added total is \+(\d+) at level (\d+),.*?the next level adds only \+(\d+)/,
			"mechanics example",
		).map(Number);
		expect(getRegentHpContribution(docDie, docLevel)).toBe(docTotal);
		expect(getRegentHpContribution(docDie, docLevel + 1) - docTotal).toBe(
			docNext,
		);
	});
});

describe("RA-6 Regent known abilities", () => {
	it("uses one known-count table in the documents, the runtime, and the Regent data", () => {
		const canon = listAfter(CANON, "RA-6 — Known abilities");
		expect(canon).toHaveLength(20);
		expect([...REGENT_ABILITY_KNOWN_BY_LEVEL]).toEqual(canon);
		expect(LEVELS.map(getRegentAbilityKnownCount)).toEqual(canon);
		expect(listAfter(MECHANICS, "Known abilities:")).toEqual(canon);
		expect(SOURCEBOOK).toContain(
			`known Techniques, are ${describeByLevel(canon)}.`,
		);

		const progressions = regents
			.flatMap((regent) => [regent.powersKnown, regent.techniquesKnown])
			.filter((progression) => progression !== undefined);
		expect(progressions.length).toBeGreaterThan(0);
		for (const progression of progressions) {
			expect(progression).toEqual(canon);
		}
	});
});

describe("RA-10 companion scaling", () => {
	it("states the PB formula and the dice-count pace the runtime uses", () => {
		for (const text of [CANON, MECHANICS]) {
			expect(text).toContain("PB = 2 + floor((L − 1) / 4)");
		}
		expect(LEVELS.map(companionProficiencyBonus)).toEqual(
			LEVELS.map((level) => 2 + Math.floor((level - 1) / 4)),
		);
		const pace = LEVELS.map(companionDamageDiceCount);
		for (const text of [CANON, MECHANICS]) {
			expect(text).toContain(`The dice count is ${describeByLevel(pace)}.`);
		}
		expect(SOURCEBOOK).toContain(`roll ${describeByLevel(pace, "die")}.`);
	});

	it("uses the canon rank tiers on the client and the server", () => {
		const tiers = rankTiersIn(CANON);
		expect(Object.keys(tiers)).toEqual([...RANKS]);
		expect(rankTiersIn(MECHANICS)).toEqual(tiers);
		expect(SOURCEBOOK).toContain("rank tiers E 0 through S 5");
		for (const rank of RANKS) expect(companionRankTier(rank)).toBe(tiers[rank]);
		expect(companionRankTier(null)).toBe(tiers.D);

		const server = latestDefinition("app_private.companion_rank_tier");
		expect(
			Object.fromEntries(
				[...server.matchAll(/WHEN '([EDCBAS])' THEN (\d)/g)].map(
					([, rank, tier]) => [rank, Number(tier)],
				),
			),
		).toEqual(tiers);
		expect(mustMatch(server, /ELSE (\d) END/, "server default")[1]).toBe(
			String(tiers.D),
		);
	});

	it("computes HP, AC, attack, and DC by the documented formulas on both sides", () => {
		for (const text of [CANON, MECHANICS]) {
			expect(text).toContain(
				"AC = 10 + rank tier + floor((L − 1) / 4). Attack bonus = 2 + rank tier + PB. Save DC = 8 + rank tier + PB.",
			);
		}
		for (const level of LEVELS) {
			for (const rank of RANKS) {
				const tier = companionRankTier(rank);
				const pb = companionProficiencyBonus(level);
				expect(
					scaleCompanionAtLevel(level, { rank, hitDie: 10 }),
				).toMatchObject({
					hpMax: level * 10,
					baseAc: 10 + tier + Math.floor((level - 1) / 4),
					attackBonus: 2 + tier + pb,
					saveDc: 8 + tier + pb,
				});
			}
		}

		const level = "app_private.companion_level_for_scaling(p_instance)";
		const tier = "app_private.companion_rank_tier(p_instance)";
		const pb = "app_private.companion_proficiency_bonus(p_instance)";
		expect(
			latestDefinition("app_private.companion_proficiency_bonus"),
		).toContain(`SELECT 2 + (${level} - 1) / 4;`);
		expect(latestDefinition("app_private.companion_c3_max_hp")).toContain(
			`(${level} * app_private.companion_scaling_hit_die(p_instance))`,
		);
		expect(latestDefinition("app_private.companion_c3_ac")).toContain(
			`(10 + ${tier} + (${level} - 1) / 4)`,
		);
		expect(
			latestDefinition("app_private.companion_scaled_attack_bonus"),
		).toContain(`SELECT 2 + ${tier} + ${pb};`);
		expect(latestDefinition("app_private.companion_scaled_save_dc")).toContain(
			`SELECT 8 + ${tier} + ${pb};`,
		);
	});

	it("uses the canon size Hit Dice and stat-block Hit Die parsing", () => {
		for (const text of [CANON, MECHANICS, SOURCEBOOK]) {
			const pairs = [
				...text.matchAll(
					/\b(Tiny|Small|Medium|Large|Huge|Gargantuan) d(\d+)\b/g,
				),
			];
			expect(new Set(pairs.map(([, size]) => size)).size).toBe(6);
			for (const [, size, die] of pairs) {
				expect(sizeHitDie(size)).toBe(Number(die));
			}
		}
		const [, statBlock, die] = mustMatch(
			CANON,
			/`(\d+ \(\d+d\d+ \+ \d+\))` → d(\d+)/,
			"stat-block example",
		);
		expect(parseStatBlockHitDie(statBlock)).toBe(Number(die));
	});

	it("scales exactly the mounts the documents name", () => {
		const listed = mustMatch(
			CANON,
			/catalog mounts flagged combat capable: ([^.]+)\./,
			"combat-capable mounts",
		)[1]
			.split(/, (?:and )?/)
			.sort();
		const sizeScaled = allMounts
			.filter((mount) => scalingSource("vehicles", mount.id)?.kind === "size")
			.map((mount) => mount.name)
			.sort();
		expect(sizeScaled).toEqual(listed);
		for (const name of listed) {
			const baseName = name.replace(/\s*\(.*\)$/, "");
			expect(MECHANICS).toContain(baseName);
			expect(SOURCEBOOK).toContain(baseName);
		}
		expect(
			allMounts.find((mount) => mount.id === "mount-sovereign-steed"),
		).toMatchObject({ name: "Pantheon Steed" });

		// A linked mount scales from its Anomaly's Hit Die.
		const linked = allMounts.filter((mount) => mount.anomaly_id);
		expect(linked.length).toBeGreaterThan(0);
		for (const mount of linked) {
			const anomaly = anomalies.find((entry) => entry.id === mount.anomaly_id);
			expect(anomaly, mount.id).toBeDefined();
			expect(scalingSource("vehicles", mount.id)).toMatchObject({
				kind: "stat-block",
				hitDie: parseStatBlockHitDie(anomaly?.hit_dice),
			});
		}
	});

	it("rests companions by the character's rules in every document and on the server", () => {
		const shortRest =
			/On a Short Rest its owner may spend its Hit Dice[^;]*; each die heals one roll of its Hit Die, with no VIT added\./;
		const longRest =
			"On a Long Rest it regains all HP and half its Hit Dice (minimum 1), and its conditions end as the character's do.";
		for (const text of [CANON, MECHANICS, SOURCEBOOK]) {
			expect(text).toMatch(shortRest);
			expect(text).toContain(longRest);
		}

		// L Hit Dice at the owner's level, on both sides.
		const wolf = {
			source_collection: "vehicles",
			source_id: "mount-mana-touched-wolf",
			source_snapshot: null,
			combat_state: {},
		};
		for (const level of [1, 5, 20]) {
			expect(
				companionHitDicePool(wolf, scaleCompanionInstance(wolf, level))?.max,
			).toBe(level);
		}
		expect(latestDefinition("app_private.companion_hit_dice_max")).toContain(
			"app_private.companion_level_for_scaling(p_instance)",
		);

		// Half the Hit Dice back (minimum 1), the character's own formula.
		expect(prose(read("src/lib/restSystem.ts"))).toContain(
			"Math.max(1, Math.floor(character.hit_dice_max / 2))",
		);
		expect(latestDefinition("public.rest_companions_for_character")).toContain(
			"GREATEST(1, v_dice / 2)",
		);
		// A spent die heals its roll alone: no VIT bound on the server.
		expect(latestDefinition("public.spend_companion_hit_dice")).toContain(
			"p_hp_recovered > p_dice * v_die",
		);

		// Conditions end on a Long Rest exactly as the character's do.
		const conditionsSql = latestDefinition(
			"app_private.companion_conditions_after_long_rest",
		);
		const serverEnds = new Set(
			[...conditionsSql.matchAll(/'(remove-on-[a-z-]+)'/g)].map(
				([, policy]) => policy,
			),
		);
		const [base] = migrateLegacyConditions(["poisoned"]);
		for (const restPolicy of [
			"persist",
			"manual",
			"remove-on-rest",
			"remove-on-long-rest",
			"remove-on-short-rest",
		] as const) {
			const ended =
				getActiveConditionNames(
					clearConditionsOnLongRest([{ ...base, restPolicy }]),
				).length === 0;
			expect(serverEnds.has(restPolicy), restPolicy).toBe(ended);
		}
		expect(
			getActiveConditionNames(clearConditionsOnLongRest([base])),
			"a plain condition name ends on a Long Rest",
		).toEqual([]);
		expect(conditionsSql).toContain("'remove-on-long-rest')");
	});

	it("reproduces the worked examples in every document", () => {
		const [hpSentence, hpDie, hpTotal, hpLevel] = mustMatch(
			CANON,
			/A d(\d+) Anomaly has (\d+) HP at level (\d+)/,
			"Anomaly HP example",
		);
		expect(
			scaleCompanionAtLevel(Number(hpLevel), {
				hitDie: Number(hpDie) as CompanionHitDie,
			}).hpMax,
		).toBe(Number(hpTotal));
		expect(MECHANICS).toContain(hpSentence);
		expect(SOURCEBOOK).toContain(hpSentence);

		const [wolfSentence, wolfHp, wolfBite, wolfLevel] = mustMatch(
			CANON,
			/A Mana-Touched Wolf has (\d+) HP and a (\d+d\d+ \+ \d+) bite at level (\d+)/,
			"wolf example",
		);
		const wolf = mountNamed("Mana-Touched Wolf");
		const wolfSource = scalingSource("vehicles", wolf.id);
		if (!wolfSource) throw new Error("The wolf does not scale");
		const wolfScaled = scaleCompanionAtLevel(Number(wolfLevel), {
			rank: wolf.rank,
			hitDie: wolfSource.hitDie,
			kind: wolfSource.kind,
		});
		const bite = wolf.natural_attacks?.find((attack) => attack.name === "Bite");
		if (!bite) throw new Error("The wolf has no Bite");
		expect(wolfScaled.hpMax).toBe(Number(wolfHp));
		expect(
			companionDamageExpression(
				wolfScaled.damageDiceCount,
				naturalAttackDie(bite, wolf.size),
				wolfScaled.proficiencyBonus,
			),
		).toBe(wolfBite);
		expect(MECHANICS).toContain(wolfSentence);
		expect(SOURCEBOOK).toContain(`Mana-Touched Wolf bites for ${wolfBite}`);

		// The K9's authored 1d6 Bite runs through the same text scaler as any
		// stat-block attack, so it stands in for the canon's 1d6 claw.
		const claw = mustMatch(CANON, /A 1d6 claw deals ([^.]+)\./, "claw")[1];
		const steps = [...claw.matchAll(/(\d+d6 \+ \d+) at level (\d+)/g)];
		expect(steps).toHaveLength(4);
		const k9 = mountNamed("Bureau K9 (Mastiff-class)");
		const k9Source = scalingSource("vehicles", k9.id);
		const k9Bite = k9.abilities?.find((ability) => ability.name === "Bite");
		if (!k9Source || !k9Bite) throw new Error("The K9 Bite does not scale");
		for (const [, expected, level] of steps) {
			const scaled = scaleCompanionAtLevel(Number(level), {
				rank: k9.rank,
				hitDie: k9Source.hitDie,
			});
			expect(
				rewriteCompanionText(k9Bite.description, scaled, "attack").firstDamage,
			).toBe(expected);
		}
		expect(MECHANICS).toContain(`A 1d6 claw deals ${claw}.`);
	});
});

// ── Retired wording ─────────────────────────────────────────────────────

const SCAN_ROOTS = ["src", "api", "scripts"];
const SCANNED_FILE = /\.(?:[cm]?[jt]sx?|json|md|html|css|sql)$/;
const SKIPPED_PATH =
	/(?:^|\/)(?:__tests__|node_modules)\/|\.(?:test|spec)\.[cm]?[jt]sx?$/;

const RETIRED_WORDING: ReadonlyArray<{ lock: string; pattern: RegExp }> = [
	{
		lock: "RA-10/RA-15: dice counts scale; damage dice are never doubled",
		pattern:
			/\bdoubl(?:e|es|ed|ing)\s+(?:the\s+)?damage\s+dice\b|\bdice\s+(?:are\s+)?doubled\b/i,
	},
	{
		lock: "RA-5: no highest-stat Regent",
		pattern: /\bhighest[-\s]stat\b/i,
	},
	{
		lock: "RA-4: a Regent is a class overlay, not a subclass",
		pattern: /\bRegents?[-\s]+(?:as[-\s]+(?:an?[-\s]+)?)?sub-?class(?:es)?\b/i,
	},
	{ lock: "RA-17: the Pantheon Steed", pattern: /\bSovereign\s+Steed\b/i },
	{
		lock: "RA-9: no per-creature companion profiles",
		pattern: /\bcompanion\s+(?:scaling\s+)?profiles?\b/i,
	},
	{
		lock: "RA-9: no combat-ready companion gate",
		pattern: /\bcombat[-\s]?ready\b/i,
	},
];

/** Negated or archival statements that name a retired rule on purpose. */
const ALLOWED_WORDING: Readonly<Record<string, readonly string[]>> = {
	[CANON_PATH]: [
		"The Holy Knight mount formerly called Sovereign Steed is the Pantheon Steed.",
		"There are no per-creature companion profiles",
		"Retire active Monarch, Regent-as-subclass, highest-stat Regent, and monster-as-universal-Anomaly usage.",
	],
	[MECHANICS_PATH]: [
		"has no character-level or highest-stat requirement",
		"There are no per-creature companion profiles.",
	],
	"src/lib/guestStore.ts": [
		"Companion profiles are retired (RA-9); drop any saved copy.",
	],
};

function scannedFiles(directory: string): string[] {
	if (!existsSync(join(ROOT, directory))) return [];
	return readdirSync(join(ROOT, directory), { withFileTypes: true }).flatMap(
		(entry) => {
			const path = `${directory}/${entry.name}`;
			if (entry.isDirectory()) {
				return entry.name === "node_modules" ? [] : scannedFiles(path);
			}
			return SCANNED_FILE.test(entry.name) && !SKIPPED_PATH.test(path)
				? [path]
				: [];
		},
	);
}

describe("RA-20 retired wording", () => {
	it("keeps retired rules out of app source and the rules documents", () => {
		const files = [
			...SCAN_ROOTS.flatMap(scannedFiles),
			CANON_PATH,
			MECHANICS_PATH,
		];
		expect(files).toContain(SOURCEBOOK_PATH);

		const violations: string[] = [];
		for (const file of files) {
			let text = prose(read(file));
			for (const allowed of ALLOWED_WORDING[file] ?? []) {
				expect(text, `${file} no longer says "${allowed}"`).toContain(allowed);
				text = text.replaceAll(allowed, " ");
			}
			for (const { lock, pattern } of RETIRED_WORDING) {
				const global = new RegExp(pattern.source, `${pattern.flags}g`);
				for (const match of text.matchAll(global)) {
					const at = match.index ?? 0;
					violations.push(
						`${file}: "…${text.slice(Math.max(0, at - 40), at + match[0].length + 40)}…" (${lock})`,
					);
				}
			}
		}
		expect(violations).toEqual([]);
	});
});
