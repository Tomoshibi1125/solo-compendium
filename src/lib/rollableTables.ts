export interface RollableTableRollInput {
	id?: string | null;
	name?: string | null;
	dice_formula?: string | null;
	rollable_entries?: readonly string[] | null;
}

export interface RollableTableRollResult {
	tableId: string | null;
	tableName: string | null;
	diceFormula: string;
	index: number;
	result: string;
}

export const createUniformDiceFormula = (entryCount: number): string | null =>
	Number.isInteger(entryCount) && entryCount > 0 ? `1d${entryCount}` : null;

const normalizeRandom = (value: number): number => {
	if (!Number.isFinite(value)) return 0;
	if (value < 0) return 0;
	if (value >= 1) return 1 - Number.EPSILON;
	return value;
};

export const rollCanonicalTable = (
	table: RollableTableRollInput,
	random: () => number = Math.random,
): RollableTableRollResult | null => {
	const entries = table.rollable_entries ?? [];
	if (entries.length === 0) return null;
	const index = Math.min(
		entries.length - 1,
		Math.floor(normalizeRandom(random()) * entries.length),
	);
	const diceFormula =
		table.dice_formula ?? createUniformDiceFormula(entries.length) ?? "1d0";
	return {
		tableId: table.id ?? null,
		tableName: table.name ?? null,
		diceFormula,
		index,
		result: entries[index],
	};
};
