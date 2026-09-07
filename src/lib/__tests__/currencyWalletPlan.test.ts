import { describe, expect, it } from "vitest";
import {
	buildRaCurrencyEquipmentFields,
	decodeRaCurrencyEquipmentRow,
	decodeRaCurrencyEquipmentWallet,
	findRaCurrencyEquipmentRow,
	getRaCurrencyIdFromEquipmentRow,
	planRaCurrencyWalletUpdate,
	type RaCurrencyEquipmentRow,
} from "@/lib/currency";

const row = (
	id: string,
	name: string,
	quantity: number,
	itemType = "currency",
): RaCurrencyEquipmentRow => ({
	id,
	name,
	quantity,
	item_type: itemType,
});

describe("character-equipment currency wallet planning", () => {
	it("decodes only exact, case-folded aliases and ignores non-currency rows", () => {
		expect(getRaCurrencyIdFromEquipmentRow(row("gate", "  GP  ", 2))).toBe(
			"gate",
		);
		expect(
			getRaCurrencyIdFromEquipmentRow(row("rift", "Rift Credits", 2)),
		).toBe("gate");
		expect(
			getRaCurrencyIdFromEquipmentRow(row("fuzzy", "gp reserve", 2)),
		).toBeNull();
		expect(
			getRaCurrencyIdFromEquipmentRow(
				row("not-currency", "Rift Credits", 2, "treasure"),
			),
		).toBeNull();

		expect(
			decodeRaCurrencyEquipmentRow(
				row("not-currency", "Rift Credits", 2, "treasure"),
			),
		).toMatchObject({ status: "ignored", outcome: "not-currency" });
		expect(
			decodeRaCurrencyEquipmentRow(row("fuzzy", "gp reserve", 2)),
		).toMatchObject({
			status: "manual",
			outcome: "blocked",
			issues: [{ code: "currency-denomination-unknown", blocking: true }],
		});
	});

	it("finds legacy persisted aliases without substring matching", () => {
		const rows = [
			row("not-it", "gp reserve", 9),
			row("legacy-gate", "gold", 4),
		];
		expect(findRaCurrencyEquipmentRow(rows, "gate")?.id).toBe("legacy-gate");
	});

	it("builds a deterministic canonical-order update plan with exact totals", () => {
		const rows = [
			row("mana-row", "Mana Credits", 250),
			row("gate-row", "gp", 1),
			row("sword", "Training Sword", 1, "weapon"),
		];
		const plan = planRaCurrencyWalletUpdate(rows);
		const reordered = planRaCurrencyWalletUpdate([...rows].reverse());

		expect(plan).toMatchObject({
			version: 1,
			status: "automated",
			outcome: "ready",
			canApply: true,
			requiresManualReview: false,
			applicationMode: "atomic",
			sourceWallet: { core: 0, gate: 1, crystal: 0, mana: 250 },
			targetWallet: { core: 0, gate: 3, crystal: 5, mana: 0 },
			sourceTotalBaseUnits: 350,
			targetTotalBaseUnits: 350,
		});
		expect(plan.operations).toEqual([
			{
				kind: "update",
				operationId: "currency:update:gate:gate-row",
				currencyId: "gate",
				rowId: "gate-row",
				expectedQuantity: 1,
				quantity: 3,
			},
			{
				kind: "create",
				operationId: "currency:create:crystal",
				currencyId: "crystal",
				expectedDenominationAbsent: true,
				quantity: 5,
				equipment: buildRaCurrencyEquipmentFields("crystal", 5),
			},
			{
				kind: "update",
				operationId: "currency:update:mana:mana-row",
				currencyId: "mana",
				rowId: "mana-row",
				expectedQuantity: 250,
				quantity: 0,
			},
		]);
		expect(reordered).toEqual(plan);
	});

	it("returns a no-op plan for an already normalized wallet", () => {
		expect(
			planRaCurrencyWalletUpdate([
				row("gate", "Rift Credits", 2),
				row("crystal", "Crystal Credits", 5),
			]),
		).toMatchObject({
			status: "automated",
			outcome: "noop",
			operations: [],
			sourceTotalBaseUnits: 250,
			targetTotalBaseUnits: 250,
		});
	});

	it("blocks duplicate denominations instead of choosing or summing a row", () => {
		const plan = planRaCurrencyWalletUpdate([
			row("gate-a", "Rift Credits", 2),
			row("gate-b", "gp", 3),
		]);

		expect(plan).toMatchObject({
			status: "manual",
			outcome: "blocked",
			canApply: false,
			requiresManualReview: true,
			applicationMode: "blocked",
			operations: [],
			issues: [
				{
					code: "currency-denomination-duplicate",
					currencyId: "gate",
					rowIds: ["gate-a", "gate-b"],
					blocking: true,
				},
			],
		});
	});

	it.each([
		-1,
		1.5,
		Number.NaN,
		Number.POSITIVE_INFINITY,
	])("blocks invalid quantity %s without coercion", (quantity) => {
		const decoded = decodeRaCurrencyEquipmentWallet([
			row("bad-gate", "Rift Credits", quantity),
		]);
		expect(decoded).toMatchObject({
			status: "manual",
			outcome: "blocked",
			wallet: null,
			issues: [{ code: "currency-quantity-invalid", blocking: true }],
		});
	});

	it("blocks totals outside the exact integer range", () => {
		expect(
			decodeRaCurrencyEquipmentWallet([
				row("huge-core", "Core Credits", Number.MAX_SAFE_INTEGER),
			]),
		).toMatchObject({
			status: "manual",
			outcome: "blocked",
			issues: [{ code: "currency-total-unsafe", blocking: true }],
		});
	});
});
