import type { DiceTheme } from "@/components/dice/diceThemes";

export type DiceDisplayMode =
	| "standard"
	| "percentile-tens"
	| "percentile-ones";

export type DiceTraySource = "manual" | "character" | "action" | "campaign";
export type DiceTrayDisplayMode = "animated" | "instant";

export type DiceTrayDie = Readonly<{
	id: string;
	sides: number;
	value: number;
	displayValue?: number;
	displayMode?: DiceDisplayMode;
	kept?: boolean;
	dropped?: boolean;
}>;

export type DiceRollSession = Readonly<{
	id: string;
	source: DiceTraySource;
	theme: DiceTheme;
	displayMode: DiceTrayDisplayMode;
	formula: string;
	context: string;
	modifier: number;
	total: number;
	rolls: readonly number[];
	droppedRolls: readonly number[];
	dice: readonly DiceTrayDie[];
	isCritical: boolean;
	isFumble: boolean;
	createdAt: number;
}>;

export type ManualDiceEntry = Readonly<{ sides: number; count: number }>;

export type ManualRollResult = Readonly<{
	formula: string;
	rolls: readonly number[];
	droppedRolls: readonly number[];
	modifier: number;
	total: number;
	dice: readonly DiceTrayDie[];
	isCritical: boolean;
	isFumble: boolean;
}>;

export type DiceTraySessionInput = Readonly<{
	id?: string;
	source?: DiceTraySource;
	formula: string;
	context?: string;
	modifier?: number;
	total: number;
	rolls: readonly number[];
	droppedRolls?: readonly number[];
	dice?: readonly DiceTrayDie[];
	theme?: DiceTheme;
	displayMode?: DiceTrayDisplayMode;
	isCritical?: boolean;
	isFumble?: boolean;
}>;

const createId = () =>
	typeof crypto !== "undefined" && "randomUUID" in crypto
		? crypto.randomUUID()
		: `dice-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const freezeArray = <T>(items: readonly T[]) => Object.freeze([...items]);
const freezeDice = (dice: readonly DiceTrayDie[]) =>
	Object.freeze(dice.map((die) => Object.freeze({ ...die })));

const rollDie = (sides: number) => {
	if (!Number.isInteger(sides) || sides < 2) {
		throw new Error(`Unsupported die: d${sides}`);
	}

	// Use the browser's cryptographic source when it is available. A dice
	// animation is decorative; the session result is generated here once.
	if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
		const limit = Math.floor(0x1_0000_0000 / sides) * sides;
		const sample = new Uint32Array(1);
		do {
			crypto.getRandomValues(sample);
		} while (sample[0] >= limit);
		return (sample[0] % sides) + 1;
	}
	return Math.floor(Math.random() * sides) + 1;
};

const buildFormula = (
	entries: readonly ManualDiceEntry[],
	modifier: number,
) => {
	const diceTerms = entries
		.filter((entry) => entry.count > 0)
		.map((entry) => `${entry.count}d${entry.sides}`);
	const base = diceTerms.join(" + ") || "0";
	return modifier === 0
		? base
		: `${base} ${modifier > 0 ? "+" : "-"} ${Math.abs(modifier)}`;
};

const percentileDice = (value: number, id: string): DiceTrayDie[] => {
	const normalized = Math.max(1, Math.min(100, value));
	const rawTens = Math.floor((normalized % 100) / 10);
	const rawOnes = normalized % 10;
	return [
		{
			id: `${id}-tens`,
			sides: 10,
			value: rawTens === 0 ? 10 : rawTens,
			displayValue: rawTens,
			displayMode: "percentile-tens",
		},
		{
			id: `${id}-ones`,
			sides: 10,
			value: rawOnes === 0 ? 10 : rawOnes,
			displayValue: rawOnes,
			displayMode: "percentile-ones",
		},
	];
};

const dieTerms = (formula: string) =>
	Array.from(formula.replace(/\s+/g, "").matchAll(/[+-]?(\d*)d(\d+)/gi)).map(
		(match) => ({
			count: Number(match[1] || 1),
			sides: Number(match[2]),
		}),
	);

export function diceFromResolvedRoll(
	formula: string,
	rolls: readonly number[],
	droppedRolls: readonly number[] = [],
): readonly DiceTrayDie[] {
	const dice: DiceTrayDie[] = [];
	let rollIndex = 0;
	for (const term of dieTerms(formula)) {
		for (let index = 0; index < term.count; index += 1) {
			const value = Math.abs(rolls[rollIndex] ?? 1);
			rollIndex += 1;
			if (term.sides === 100) {
				dice.push(...percentileDice(value, `die-${dice.length}`));
			} else {
				dice.push({
					id: `die-${dice.length}`,
					sides: term.sides,
					value: Math.max(1, Math.min(term.sides, value)),
					kept: droppedRolls.length > 0 && term.sides === 20 ? true : undefined,
				});
			}
		}
	}

	// `rollEngine` keeps the selected d20 in `rolls` and exposes the other
	// outcome separately. Present both dice without allowing presentation to
	// affect the already-resolved result.
	if (droppedRolls.length > 0) {
		droppedRolls.forEach((value) => {
			dice.push({
				id: `dropped-${dice.length}`,
				sides: 20,
				value: Math.max(1, Math.min(20, Math.abs(value))),
				dropped: true,
			});
		});
	}

	return freezeDice(dice);
}

export function createDiceRollSession(
	input: DiceTraySessionInput,
): DiceRollSession {
	const droppedRolls = freezeArray(input.droppedRolls ?? []);
	const rolls = freezeArray(input.rolls);
	const dice = freezeDice(
		input.dice ?? diceFromResolvedRoll(input.formula, rolls, droppedRolls),
	);
	const primaryD20 = dice.find((die) => die.sides === 20 && !die.dropped);
	return Object.freeze({
		id: input.id ?? createId(),
		source: input.source ?? "action",
		theme: input.theme ?? "umbral-ascendant",
		displayMode: input.displayMode ?? "animated",
		formula: input.formula,
		context: input.context ?? "Roll",
		modifier: input.modifier ?? 0,
		total: input.total,
		rolls,
		droppedRolls,
		dice,
		isCritical: input.isCritical ?? primaryD20?.value === 20,
		isFumble: input.isFumble ?? primaryD20?.value === 1,
		createdAt: Date.now(),
	});
}

/** Resolve a manual dice pool once, including the standard single-d20 rule. */
export function rollManualDicePool(
	entries: readonly ManualDiceEntry[],
	modifier = 0,
	advantage: "normal" | "advantage" | "disadvantage" = "normal",
): ManualRollResult {
	const normalized = entries.filter(
		(entry) =>
			Number.isInteger(entry.sides) && entry.sides >= 2 && entry.count > 0,
	);
	const isSingleD20 =
		normalized.length === 1 &&
		normalized[0].sides === 20 &&
		normalized[0].count === 1;
	const rolls: number[] = [];
	const droppedRolls: number[] = [];
	let dice: DiceTrayDie[] = [];

	for (const entry of normalized) {
		for (let index = 0; index < entry.count; index += 1) {
			if (isSingleD20 && advantage !== "normal") {
				const first = rollDie(20);
				const second = rollDie(20);
				const kept =
					advantage === "advantage"
						? Math.max(first, second)
						: Math.min(first, second);
				const dropped =
					advantage === "advantage"
						? Math.min(first, second)
						: Math.max(first, second);
				rolls.push(kept);
				droppedRolls.push(dropped);
				dice = [
					{ id: "die-0", sides: 20, value: kept, kept: true },
					{ id: "dropped-0", sides: 20, value: dropped, dropped: true },
				];
				continue;
			}

			const value = rollDie(entry.sides);
			rolls.push(value);
			if (entry.sides === 100) {
				dice.push(...percentileDice(value, `die-${dice.length}`));
			} else {
				dice.push({ id: `die-${dice.length}`, sides: entry.sides, value });
			}
		}
	}

	const formula = buildFormula(normalized, modifier);
	const total = rolls.reduce((sum, value) => sum + value, 0) + modifier;
	const keptD20 = dice.find((die) => die.sides === 20 && !die.dropped);
	return Object.freeze({
		formula,
		rolls: freezeArray(rolls),
		droppedRolls: freezeArray(droppedRolls),
		modifier,
		total,
		dice: freezeDice(dice),
		isCritical: keptD20?.value === 20,
		isFumble: keptD20?.value === 1,
	});
}
