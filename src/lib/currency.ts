export type RaCurrencyId = "core" | "gate" | "crystal" | "mana";

type LegacyCurrencyId = "pp" | "gp" | "ep" | "sp" | "cp";

type CurrencyId = RaCurrencyId | LegacyCurrencyId;

interface RaCurrencyDefinition {
	id: RaCurrencyId;
	legacyId: LegacyCurrencyId;
	name: string;
	singularName: string;
	symbol: string;
	shortLabel: string;
	baseUnitValue: number;
	colorClass: string;
	borderClass: string;
	description: string;
}

export const RA_CURRENCY_TYPES = [
	{
		id: "core",
		legacyId: "pp",
		name: "Core Credits",
		singularName: "Core Credit",
		symbol: "CC",
		shortLabel: "Core",
		baseUnitValue: 1000,
		colorClass: "text-indigo-300",
		borderClass: "border-indigo-500",
		description: "High-value Bureau notes backed by S-Rank essence reserves.",
	},
	{
		id: "gate",
		legacyId: "gp",
		name: "Gate Credits",
		singularName: "Gate Credit",
		symbol: "GC",
		shortLabel: "Gate",
		baseUnitValue: 100,
		colorClass: "text-bond-gold",
		borderClass: "border-yellow-600",
		description:
			"Standard Bureau currency backed by A/B-Rank essence reserves.",
	},
	{
		id: "crystal",
		legacyId: "sp",
		name: "Crystal Credits",
		singularName: "Crystal Credit",
		symbol: "CrC",
		shortLabel: "Crystal",
		baseUnitValue: 10,
		colorClass: "text-cyan-300",
		borderClass: "border-cyan-500",
		description: "Common Bureau currency backed by C/D-Rank essence reserves.",
	},
	{
		id: "mana",
		legacyId: "cp",
		name: "Mana Credits",
		singularName: "Mana Credit",
		symbol: "MC",
		shortLabel: "Mana",
		baseUnitValue: 1,
		colorClass: "text-violet-300",
		borderClass: "border-violet-500",
		description:
			"Low-denomination Bureau currency backed by E-Rank essence reserves.",
	},
] as const satisfies readonly RaCurrencyDefinition[];

const NAME_ALIASES: Record<string, RaCurrencyId> = {
	core: "core",
	"core credit": "core",
	"core credits": "core",
	platinum: "core",
	pp: "core",
	gate: "gate",
	"gate credit": "gate",
	"gate credits": "gate",
	gold: "gate",
	gp: "gate",
	crystal: "crystal",
	"crystal credit": "crystal",
	"crystal credits": "crystal",
	silver: "crystal",
	sp: "crystal",
	mana: "mana",
	"mana credit": "mana",
	"mana credits": "mana",
	copper: "mana",
	cp: "mana",
};

const RA_BASE_CURRENCY_ID: RaCurrencyId = "mana";
export const RA_STANDARD_CURRENCY_ID: RaCurrencyId = "gate";

function normalizeCurrencyId(
	id: string | null | undefined,
): RaCurrencyId | null {
	if (!id) return null;
	const normalized = id.trim().toLowerCase();
	return NAME_ALIASES[normalized] ?? null;
}

export function getRaCurrencyDefinition(id: string | null | undefined) {
	const normalized = normalizeCurrencyId(id);
	if (!normalized) return null;
	return (
		RA_CURRENCY_TYPES.find((currency) => currency.id === normalized) ?? null
	);
}

export function convertCurrencyAmount(
	amount: number,
	from: CurrencyId,
	to: CurrencyId,
): number {
	const fromCurrency = getRaCurrencyDefinition(from);
	const toCurrency = getRaCurrencyDefinition(to);
	if (!fromCurrency || !toCurrency) return amount;
	return (amount * fromCurrency.baseUnitValue) / toCurrency.baseUnitValue;
}

function formatRaCurrencyUnit(amount: number, currencyId: RaCurrencyId) {
	const currency = getRaCurrencyDefinition(currencyId);
	if (!currency) return "Credits";
	return Math.abs(amount) === 1 ? currency.singularName : currency.name;
}

export function formatRaCurrencyAmount(
	amount: number | null | undefined,
	currencyId: RaCurrencyId = RA_STANDARD_CURRENCY_ID,
) {
	if (amount == null || Number.isNaN(amount)) return "—";
	const currency = getRaCurrencyDefinition(currencyId);
	const value = Number.isInteger(amount)
		? amount.toLocaleString()
		: amount.toLocaleString(undefined, { maximumFractionDigits: 2 });
	return currency
		? `${value} ${formatRaCurrencyUnit(amount, currency.id)}`
		: `${value} Credits`;
}

export function formatRaCurrencyFromBaseUnits(
	baseUnits: number | null | undefined,
) {
	if (baseUnits == null || Number.isNaN(baseUnits)) return "—";
	const absoluteValue = Math.abs(baseUnits);
	const selected = RA_CURRENCY_TYPES.find(
		(currency) =>
			absoluteValue >= currency.baseUnitValue &&
			baseUnits % currency.baseUnitValue === 0,
	);
	const currency = selected ?? getRaCurrencyDefinition(RA_BASE_CURRENCY_ID);
	if (!currency) return `${baseUnits.toLocaleString()} Credits`;
	return formatRaCurrencyAmount(
		baseUnits / currency.baseUnitValue,
		currency.id,
	);
}

export function parseRaCurrencyString(value: string) {
	const match = value.trim().match(/^(-?\d+(?:\.\d+)?)\s*([a-zA-Z ]+)?$/);
	if (!match) return null;
	const amount = Number(match[1]);
	if (Number.isNaN(amount)) return null;
	const currency = getRaCurrencyDefinition(match[2] || RA_STANDARD_CURRENCY_ID);
	if (!currency) return null;
	return {
		amount,
		currencyId: currency.id,
		baseUnits: amount * currency.baseUnitValue,
	};
}

export function buildRaCurrencyItemDescription(currencyId: RaCurrencyId) {
	const currency = getRaCurrencyDefinition(currencyId);
	return currency
		? `Bureau-issued ${currency.name}; ${currency.description}`
		: "Bureau-issued Credits backed by essence reserves.";
}
