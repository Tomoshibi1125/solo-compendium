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

// ─────────────────────────────────────────────────────────────────────────
// P1.10: Currency overflow normalization (RA EXCEEDS DDB)
// ─────────────────────────────────────────────────────────────────────────
// DDB users have repeatedly requested automatic currency cascading
// (250 cp → 2 sp 50 cp, etc.). RA shipping this puts us ahead of DDB.
//
// RA cascade ratios (decimal):
//   1 Core   = 1000 Mana
//   1 Gate   = 100  Mana
//   1 Crystal = 10  Mana
//   1 Mana   = 1    Mana (base unit)
//
// `normalizeWallet({core, gate, crystal, mana})` cascades upward so each
// lower denomination holds the residue (mana < 10, crystal < 10, gate <
// 10). Set `direction: "preserve"` to return values unchanged.
//
// Legacy alias accessors accept pp/gp/sp/cp for migration paths and emit
// the same canonical fields back.

export interface RaWallet {
	core: number;
	gate: number;
	crystal: number;
	mana: number;
}

export interface LegacyWallet {
	pp?: number; // platinum   → core
	gp?: number; // gold       → gate
	sp?: number; // silver     → crystal
	cp?: number; // copper     → mana
	ep?: number; // electrum   → 5 silver = 50 mana (rolled into crystal)
}

const DEFAULT_WALLET: RaWallet = { core: 0, gate: 0, crystal: 0, mana: 0 };

/**
 * Convert a wallet object using legacy keys into the canonical RA shape.
 * Tolerates partial input; missing keys default to 0. Electrum (5 sp =
 * 50 cp) is folded into crystal+mana before cascading.
 */
export function walletFromLegacy(legacy: LegacyWallet): RaWallet {
	const ep = legacy.ep ?? 0;
	return {
		core: legacy.pp ?? 0,
		gate: legacy.gp ?? 0,
		// Electrum: 1 ep = 5 sp (RA: 5 crystal = 50 mana base units).
		// Roll the electrum value into crystal via base-unit conversion
		// before cascading so the final wallet remains well-formed.
		crystal: (legacy.sp ?? 0) + Math.floor((ep * 5) / 1),
		mana: legacy.cp ?? 0,
	};
}

/**
 * Cascade a wallet so each lower denomination is below its rollover
 * threshold. The total value in mana base units is preserved exactly.
 *
 * Example:
 *   normalizeWallet({ core: 0, gate: 0, crystal: 0, mana: 250 })
 *     → { core: 0, gate: 2, crystal: 5, mana: 0 }
 *
 * @param direction
 *   "up" (default) — push residue upward; lowest denomination is the
 *     remainder. Matches DDB's requested behavior.
 *   "preserve" — return the input unchanged (escape hatch).
 */
export function normalizeWallet(
	wallet: Partial<RaWallet> & Partial<LegacyWallet>,
	direction: "up" | "preserve" = "up",
): RaWallet {
	const merged: RaWallet = {
		core: wallet.core ?? 0,
		gate: wallet.gate ?? 0,
		crystal: wallet.crystal ?? 0,
		mana: wallet.mana ?? 0,
	};
	// Fold legacy keys (when both are present, canonical wins).
	if (wallet.pp != null && wallet.core == null) merged.core = wallet.pp;
	if (wallet.gp != null && wallet.gate == null) merged.gate = wallet.gp;
	if (wallet.sp != null && wallet.crystal == null) merged.crystal = wallet.sp;
	if (wallet.cp != null && wallet.mana == null) merged.mana = wallet.cp;
	if (wallet.ep != null) {
		// 1 ep = 5 sp = 50 mana
		merged.mana += (wallet.ep ?? 0) * 50;
	}

	if (direction === "preserve") return merged;

	// Convert everything to mana base units for an exact-value cascade.
	const totalMana =
		merged.core * 1000 + merged.gate * 100 + merged.crystal * 10 + merged.mana;

	const core = Math.floor(totalMana / 1000);
	let remainder = totalMana - core * 1000;
	const gate = Math.floor(remainder / 100);
	remainder -= gate * 100;
	const crystal = Math.floor(remainder / 10);
	const mana = remainder - crystal * 10;

	return { core, gate, crystal, mana };
}

/** Sum of a wallet expressed in mana (base) units. */
export function walletTotalBaseUnits(wallet: Partial<RaWallet>): number {
	return (
		(wallet.core ?? 0) * 1000 +
		(wallet.gate ?? 0) * 100 +
		(wallet.crystal ?? 0) * 10 +
		(wallet.mana ?? 0)
	);
}

/** Pretty-print a wallet, hiding zero denominations. */
export function formatWallet(wallet: Partial<RaWallet>): string {
	const parts: string[] = [];
	if (wallet.core) parts.push(`${wallet.core} CC`);
	if (wallet.gate) parts.push(`${wallet.gate} GC`);
	if (wallet.crystal) parts.push(`${wallet.crystal} CrC`);
	if (wallet.mana) parts.push(`${wallet.mana} MC`);
	return parts.length > 0 ? parts.join(" ") : "0 MC";
}
export { DEFAULT_WALLET };
