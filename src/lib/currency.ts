import type { Database } from "@/integrations/supabase/types";

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
		colorClass: "text-shadow-blue",
		borderClass: "border-shadow-blue",
		description: "High-value Bureau notes backed by S-Rank essence reserves.",
	},
	{
		// id stays "gate" — persisted in structured prices and DB rows.
		id: "gate",
		legacyId: "gp",
		name: "Rift Credits",
		singularName: "Rift Credit",
		symbol: "RC",
		shortLabel: "Rift",
		baseUnitValue: 100,
		colorClass: "text-gate-s",
		borderClass: "border-gate-s",
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
		colorClass: "text-resurge-violet",
		borderClass: "border-resurge-violet",
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
	rift: "gate",
	"rift credit": "gate",
	"rift credits": "gate",
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

// ─────────────────────────────────────────────────────────────────────────
// Structured catalog prices (Part 2 re-pricing)
// ─────────────────────────────────────────────────────────────────────────
// Catalog items carry an explicit { currency, amount } price so the credit
// TYPE varies by tier (cheap goods in mana/crystal, gear in gate, legendary/
// artifacts in core) instead of everything reading as Gate Credits. A bare
// number is still accepted for back-compat and treated as Gate Credits.

export interface RaCurrencyValue {
	currency: RaCurrencyId;
	amount: number;
}

/** Narrow an unknown price field to a structured value (number → Gate). */
export function toRaCurrencyValue(
	value: RaCurrencyValue | number | null | undefined,
): RaCurrencyValue | null {
	if (value == null) return null;
	if (typeof value === "number") {
		return Number.isFinite(value)
			? { currency: RA_STANDARD_CURRENCY_ID, amount: value }
			: null;
	}
	return value;
}

/** The price expressed in Gate Credits (the standard unit) for legacy math. */
export function valueToGate(
	value: RaCurrencyValue | number | null | undefined,
): number {
	const v = toRaCurrencyValue(value);
	if (!v) return 0;
	return convertCurrencyAmount(v.amount, v.currency, RA_STANDARD_CURRENCY_ID);
}

/** Format a structured-or-numeric catalog price (e.g. "50 Crystal Credits"). */
export function formatRaCurrencyValue(
	value: RaCurrencyValue | number | null | undefined,
): string {
	const v = toRaCurrencyValue(value);
	if (!v) return "—";
	return formatRaCurrencyAmount(v.amount, v.currency);
}

export function buildRaCurrencyItemDescription(currencyId: RaCurrencyId) {
	const currency = getRaCurrencyDefinition(currencyId);
	return currency
		? `Bureau-issued ${currency.name}; ${currency.description}`
		: "Bureau-issued Credits backed by essence reserves.";
}

// Representative catalog price by rarity tier, using the same tier→currency
// ladder as the Part-2 item re-pricing (cheap goods in crystal, mid gear in
// gate, top-tier in core). Gives categories that lack an explicit `value`
// (tattoos, vehicles/mounts) a sensible gold cost for the sheet add-menus.
// Keep aligned with catalogPricing.test.ts: common never core, legendary/
// artifact settle in core.
const RARITY_PRICE_LADDER: Record<string, RaCurrencyValue> = {
	common: { currency: "crystal", amount: 50 },
	uncommon: { currency: "gate", amount: 5 },
	rare: { currency: "gate", amount: 50 },
	epic: { currency: "core", amount: 5 },
	very_rare: { currency: "core", amount: 5 },
	legendary: { currency: "core", amount: 25 },
	artifact: { currency: "core", amount: 100 },
};

/** Derive a structured price from a rarity tier (defaults to uncommon). */
export function priceForRarityTier(
	tier: string | null | undefined,
): RaCurrencyValue {
	const key = (tier ?? "").trim().toLowerCase().replace(/[\s-]/g, "_");
	return RARITY_PRICE_LADDER[key] ?? RARITY_PRICE_LADDER.uncommon;
}

// Vehicle/mount rank (D/C/B/A/S) → rarity tier for pricing.
const VEHICLE_RANK_TO_TIER: Record<string, string> = {
	d: "common",
	c: "uncommon",
	b: "rare",
	a: "epic",
	s: "legendary",
};

/** Derive a structured price from a vehicle/mount rank (defaults to uncommon). */
export function priceForVehicleRank(
	rank: string | null | undefined,
): RaCurrencyValue {
	const tier =
		VEHICLE_RANK_TO_TIER[(rank ?? "").trim().toLowerCase()] ?? "uncommon";
	return priceForRarityTier(tier);
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

// ─────────────────────────────────────────────────────────────────────────
// Safe character-equipment wallet decoding and update planning (Task 11)
// ─────────────────────────────────────────────────────────────────────────

export const RA_CURRENCY_WALLET_PLAN_VERSION = 1 as const;

/** The persisted fields needed to identify and safely update a wallet row. */
export type RaCurrencyEquipmentRow = Pick<
	Database["public"]["Tables"]["character_equipment"]["Row"],
	"id" | "item_type" | "name" | "quantity"
>;

type RaCurrencyEquipmentIdentity = Pick<
	RaCurrencyEquipmentRow,
	"item_type" | "name"
>;

export type RaCurrencyWalletIssueCode =
	| "currency-row-id-invalid"
	| "currency-denomination-unknown"
	| "currency-quantity-invalid"
	| "currency-denomination-duplicate"
	| "currency-total-unsafe"
	| "currency-total-mismatch";

export interface RaCurrencyWalletIssue {
	code: RaCurrencyWalletIssueCode;
	message: string;
	blocking: true;
	currencyId: RaCurrencyId | null;
	rowIds: string[];
}

export type RaCurrencyEquipmentRowDecodeResult =
	| {
			version: typeof RA_CURRENCY_WALLET_PLAN_VERSION;
			status: "automated";
			outcome: "decoded";
			rowId: string;
			currencyId: RaCurrencyId;
			quantity: number;
			matchedAlias: string;
			issues: [];
	  }
	| {
			version: typeof RA_CURRENCY_WALLET_PLAN_VERSION;
			status: "ignored";
			outcome: "not-currency";
			rowId: string;
			issues: [];
	  }
	| {
			version: typeof RA_CURRENCY_WALLET_PLAN_VERSION;
			status: "manual";
			outcome: "blocked";
			rowId: string;
			issues: [RaCurrencyWalletIssue];
	  };

export interface DecodedRaCurrencyEquipmentRow {
	rowId: string;
	currencyId: RaCurrencyId;
	quantity: number;
	matchedAlias: string;
}

interface RaCurrencyWalletDecodeBase {
	version: typeof RA_CURRENCY_WALLET_PLAN_VERSION;
	entries: DecodedRaCurrencyEquipmentRow[];
	ignoredRowIds: string[];
}

export type RaCurrencyEquipmentWalletDecodeResult =
	| (RaCurrencyWalletDecodeBase & {
			status: "automated";
			outcome: "decoded";
			canApply: true;
			requiresManualReview: false;
			wallet: RaWallet;
			totalBaseUnits: number;
			issues: [];
	  })
	| (RaCurrencyWalletDecodeBase & {
			status: "manual";
			outcome: "blocked";
			canApply: false;
			requiresManualReview: true;
			wallet: null;
			totalBaseUnits: null;
			issues: RaCurrencyWalletIssue[];
	  });

export interface RaCurrencyEquipmentFields {
	name: string;
	item_type: "currency";
	quantity: number;
	weight: number;
	description: string;
}

export type RaCurrencyWalletUpdateOperation =
	| {
			kind: "update";
			operationId: string;
			currencyId: RaCurrencyId;
			rowId: string;
			expectedQuantity: number;
			quantity: number;
	  }
	| {
			kind: "create";
			operationId: string;
			currencyId: RaCurrencyId;
			/** The denomination must still have no row when this is applied. */
			expectedDenominationAbsent: true;
			quantity: number;
			equipment: RaCurrencyEquipmentFields;
	  };

export type RaCurrencyWalletUpdatePlan =
	| {
			version: typeof RA_CURRENCY_WALLET_PLAN_VERSION;
			status: "automated";
			outcome: "ready" | "noop";
			canApply: true;
			requiresManualReview: false;
			/** All operations and expectations must be committed atomically. */
			applicationMode: "atomic";
			sourceWallet: RaWallet;
			targetWallet: RaWallet;
			sourceTotalBaseUnits: number;
			targetTotalBaseUnits: number;
			operations: RaCurrencyWalletUpdateOperation[];
			issues: [];
	  }
	| {
			version: typeof RA_CURRENCY_WALLET_PLAN_VERSION;
			status: "manual";
			outcome: "blocked";
			canApply: false;
			requiresManualReview: true;
			applicationMode: "blocked";
			sourceWallet: null;
			targetWallet: null;
			sourceTotalBaseUnits: null;
			targetTotalBaseUnits: null;
			operations: [];
			issues: RaCurrencyWalletIssue[];
	  };

function compareText(left: string, right: string): number {
	if (left < right) return -1;
	if (left > right) return 1;
	return 0;
}

function currencyWalletIssue(
	code: RaCurrencyWalletIssueCode,
	message: string,
	rowIds: readonly string[],
	currencyId: RaCurrencyId | null = null,
): RaCurrencyWalletIssue {
	return {
		code,
		message,
		blocking: true,
		currencyId,
		rowIds: [...rowIds].sort(compareText),
	};
}

/**
 * Resolve only an exact persisted alias after trimming and case-folding.
 * Substrings are deliberately rejected (for example, `"gp pouch"` is not
 * `"gp"`). Non-currency equipment is ignored.
 */
export function getRaCurrencyIdFromEquipmentRow(
	row: RaCurrencyEquipmentIdentity,
): RaCurrencyId | null {
	if (row.item_type !== "currency") return null;
	return normalizeCurrencyId(row.name);
}

/** Find the first exact-alias row. This preserves the legacy lookup API shape. */
export function findRaCurrencyEquipmentRow<
	TRow extends RaCurrencyEquipmentIdentity,
>(rows: readonly TRow[], currencyId: RaCurrencyId): TRow | null {
	return (
		rows.find((row) => getRaCurrencyIdFromEquipmentRow(row) === currencyId) ??
		null
	);
}

/** Decode and validate one equipment row without coercing its quantity. */
export function decodeRaCurrencyEquipmentRow(
	row: RaCurrencyEquipmentRow,
): RaCurrencyEquipmentRowDecodeResult {
	const rowId = row.id.trim();
	if (row.item_type !== "currency") {
		return {
			version: RA_CURRENCY_WALLET_PLAN_VERSION,
			status: "ignored",
			outcome: "not-currency",
			rowId,
			issues: [],
		};
	}
	if (!rowId) {
		return {
			version: RA_CURRENCY_WALLET_PLAN_VERSION,
			status: "manual",
			outcome: "blocked",
			rowId,
			issues: [
				currencyWalletIssue(
					"currency-row-id-invalid",
					"Currency equipment rows require a stable persisted ID before they can be updated.",
					[rowId],
				),
			],
		};
	}

	const currencyId = normalizeCurrencyId(row.name);
	if (!currencyId) {
		return {
			version: RA_CURRENCY_WALLET_PLAN_VERSION,
			status: "manual",
			outcome: "blocked",
			rowId,
			issues: [
				currencyWalletIssue(
					"currency-denomination-unknown",
					`Currency row ${rowId} uses unknown denomination alias "${row.name}".`,
					[rowId],
				),
			],
		};
	}
	if (!Number.isSafeInteger(row.quantity) || row.quantity < 0) {
		return {
			version: RA_CURRENCY_WALLET_PLAN_VERSION,
			status: "manual",
			outcome: "blocked",
			rowId,
			issues: [
				currencyWalletIssue(
					"currency-quantity-invalid",
					`Currency row ${rowId} must have a nonnegative safe-integer quantity.`,
					[rowId],
					currencyId,
				),
			],
		};
	}

	return {
		version: RA_CURRENCY_WALLET_PLAN_VERSION,
		status: "automated",
		outcome: "decoded",
		rowId,
		currencyId,
		quantity: row.quantity,
		matchedAlias: row.name.trim().toLowerCase(),
		issues: [],
	};
}

function exactWalletTotalBaseUnits(wallet: RaWallet): bigint {
	return (
		BigInt(wallet.core) * 1000n +
		BigInt(wallet.gate) * 100n +
		BigInt(wallet.crystal) * 10n +
		BigInt(wallet.mana)
	);
}

/**
 * Decode character-equipment rows into one wallet. Unknown aliases, invalid
 * quantities, and duplicate denominations are blocking rather than guessed or
 * silently aggregated.
 */
export function decodeRaCurrencyEquipmentWallet(
	rows: readonly RaCurrencyEquipmentRow[],
): RaCurrencyEquipmentWalletDecodeResult {
	const sortedRows = [...rows].sort(
		(left, right) =>
			compareText(left.id, right.id) ||
			compareText(left.name, right.name) ||
			compareText(left.item_type, right.item_type) ||
			compareText(String(left.quantity), String(right.quantity)),
	);
	const entries: DecodedRaCurrencyEquipmentRow[] = [];
	const ignoredRowIds: string[] = [];
	const issues: RaCurrencyWalletIssue[] = [];

	for (const row of sortedRows) {
		const decoded = decodeRaCurrencyEquipmentRow(row);
		if (decoded.status === "ignored") {
			ignoredRowIds.push(decoded.rowId);
		} else if (decoded.status === "manual") {
			issues.push(...decoded.issues);
		} else {
			entries.push({
				rowId: decoded.rowId,
				currencyId: decoded.currencyId,
				quantity: decoded.quantity,
				matchedAlias: decoded.matchedAlias,
			});
		}
	}

	for (const currency of RA_CURRENCY_TYPES) {
		const duplicates = entries.filter(
			(entry) => entry.currencyId === currency.id,
		);
		if (duplicates.length > 1) {
			issues.push(
				currencyWalletIssue(
					"currency-denomination-duplicate",
					`${currency.name} has multiple equipment rows and must be reconciled manually.`,
					duplicates.map((entry) => entry.rowId),
					currency.id,
				),
			);
		}
	}

	if (issues.length > 0) {
		return {
			version: RA_CURRENCY_WALLET_PLAN_VERSION,
			status: "manual",
			outcome: "blocked",
			canApply: false,
			requiresManualReview: true,
			wallet: null,
			totalBaseUnits: null,
			entries,
			ignoredRowIds,
			issues,
		};
	}

	const wallet: RaWallet = { core: 0, gate: 0, crystal: 0, mana: 0 };
	for (const entry of entries) wallet[entry.currencyId] = entry.quantity;
	const exactTotal = exactWalletTotalBaseUnits(wallet);
	if (exactTotal > BigInt(Number.MAX_SAFE_INTEGER)) {
		return {
			version: RA_CURRENCY_WALLET_PLAN_VERSION,
			status: "manual",
			outcome: "blocked",
			canApply: false,
			requiresManualReview: true,
			wallet: null,
			totalBaseUnits: null,
			entries,
			ignoredRowIds,
			issues: [
				currencyWalletIssue(
					"currency-total-unsafe",
					"Wallet total exceeds JavaScript's exact integer range and cannot be safely normalized.",
					entries.map((entry) => entry.rowId),
				),
			],
		};
	}

	return {
		version: RA_CURRENCY_WALLET_PLAN_VERSION,
		status: "automated",
		outcome: "decoded",
		canApply: true,
		requiresManualReview: false,
		wallet,
		totalBaseUnits: Number(exactTotal),
		entries,
		ignoredRowIds,
		issues: [],
	};
}

/** Canonical equipment fields for a newly persisted denomination row. */
export function buildRaCurrencyEquipmentFields(
	currencyId: RaCurrencyId,
	quantity: number,
): RaCurrencyEquipmentFields {
	const currency = getRaCurrencyDefinition(currencyId);
	if (!currency) {
		throw new TypeError(`Unknown RA currency denomination: ${currencyId}`);
	}
	return {
		name: currency.name,
		item_type: "currency",
		quantity,
		weight: 0.02,
		description: buildRaCurrencyItemDescription(currency.id),
	};
}

/**
 * Build a deterministic, optimistic wallet-normalization plan. Operations are
 * always ordered core → gate → crystal → mana and never delete or merge rows.
 * An applier must verify every expectation and commit the complete operation
 * list atomically; sequential row writes cannot guarantee total preservation.
 */
export function planRaCurrencyWalletUpdate(
	rows: readonly RaCurrencyEquipmentRow[],
): RaCurrencyWalletUpdatePlan {
	const decoded = decodeRaCurrencyEquipmentWallet(rows);
	if (decoded.status === "manual") {
		return {
			version: RA_CURRENCY_WALLET_PLAN_VERSION,
			status: "manual",
			outcome: "blocked",
			canApply: false,
			requiresManualReview: true,
			applicationMode: "blocked",
			sourceWallet: null,
			targetWallet: null,
			sourceTotalBaseUnits: null,
			targetTotalBaseUnits: null,
			operations: [],
			issues: decoded.issues,
		};
	}

	const targetWallet = normalizeWallet(decoded.wallet);
	const targetExactTotal = exactWalletTotalBaseUnits(targetWallet);
	if (targetExactTotal !== BigInt(decoded.totalBaseUnits)) {
		return {
			version: RA_CURRENCY_WALLET_PLAN_VERSION,
			status: "manual",
			outcome: "blocked",
			canApply: false,
			requiresManualReview: true,
			applicationMode: "blocked",
			sourceWallet: null,
			targetWallet: null,
			sourceTotalBaseUnits: null,
			targetTotalBaseUnits: null,
			operations: [],
			issues: [
				currencyWalletIssue(
					"currency-total-mismatch",
					"Wallet normalization did not preserve the exact base-unit total.",
					decoded.entries.map((entry) => entry.rowId),
				),
			],
		};
	}

	const entriesByCurrency = new Map(
		decoded.entries.map((entry) => [entry.currencyId, entry] as const),
	);
	const operations: RaCurrencyWalletUpdateOperation[] = [];
	for (const currency of RA_CURRENCY_TYPES) {
		const entry = entriesByCurrency.get(currency.id);
		const quantity = targetWallet[currency.id];
		if (entry && entry.quantity !== quantity) {
			operations.push({
				kind: "update",
				operationId: `currency:update:${currency.id}:${entry.rowId}`,
				currencyId: currency.id,
				rowId: entry.rowId,
				expectedQuantity: entry.quantity,
				quantity,
			});
		} else if (!entry && quantity > 0) {
			operations.push({
				kind: "create",
				operationId: `currency:create:${currency.id}`,
				currencyId: currency.id,
				expectedDenominationAbsent: true,
				quantity,
				equipment: buildRaCurrencyEquipmentFields(currency.id, quantity),
			});
		}
	}

	return {
		version: RA_CURRENCY_WALLET_PLAN_VERSION,
		status: "automated",
		outcome: operations.length > 0 ? "ready" : "noop",
		canApply: true,
		requiresManualReview: false,
		applicationMode: "atomic",
		sourceWallet: decoded.wallet,
		targetWallet,
		sourceTotalBaseUnits: decoded.totalBaseUnits,
		targetTotalBaseUnits: Number(targetExactTotal),
		operations,
		issues: [],
	};
}
