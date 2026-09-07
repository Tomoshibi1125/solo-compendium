import { describe, expect, it } from "vitest";
import {
	applyReconciliationPlanV1,
	buildReconciliationPlanV1,
	createReconciliationRecordV1,
	type ReconciliationRecordV1,
} from "@/lib/planning/reconciliationPlan";

function sourceRecord(
	recordKey: string,
	value: number,
	sourceKey = "job:warden",
	overlays: {
		customState?: Record<string, string>;
		manualState?: Record<string, string>;
	} = {},
): ReconciliationRecordV1 {
	return createReconciliationRecordV1({
		recordKey,
		value,
		ownership: { kind: "source", sourceKey, evidence: [] },
		customState: overlays.customState ?? null,
		manualState: overlays.manualState ?? null,
	});
}

function currentRecords(): ReconciliationRecordV1[] {
	return [
		sourceRecord("additive-update", 1, "job:warden", {
			customState: { note: "keep me" },
		}),
		sourceRecord("source-remove", 1),
		sourceRecord("source-unchanged", 3),
		sourceRecord("overlay-remove", 4, "job:warden", {
			manualState: { ruling: "retain" },
		}),
		createReconciliationRecordV1({
			recordKey: "custom-row",
			value: { bonus: 9 },
			ownership: { kind: "custom", label: "Player note" },
		}),
		createReconciliationRecordV1({
			recordKey: "manual-row",
			value: { enabled: true },
			ownership: { kind: "manual", reason: "Warden ruling" },
		}),
		sourceRecord("other-source-row", 7, "path:sentinel"),
	];
}

function buildBlocked(current = currentRecords()) {
	return buildReconciliationPlanV1({
		scopeKey: "character-mechanics",
		targetId: "character-1",
		sourceKey: "job:warden",
		current,
		desired: [
			{ recordKey: "new-row", value: 5 },
			{ recordKey: "additive-update", value: 2 },
			{ recordKey: "source-unchanged", value: 3 },
			{ recordKey: "custom-row", value: { bonus: 1 } },
			{
				recordKey: "manual-new",
				value: true,
				disposition: "manual",
			},
			{
				recordKey: "review-new",
				value: true,
				disposition: "review-blocked",
				reviewBlockerId: "review-17",
			},
		],
	});
}

function buildActionable(current = currentRecords()) {
	return buildReconciliationPlanV1({
		scopeKey: "character-mechanics",
		targetId: "character-1",
		sourceKey: "job:warden",
		current,
		desired: [
			{ recordKey: "new-row", value: 5 },
			{ recordKey: "additive-update", value: 2 },
			{ recordKey: "source-unchanged", value: 3 },
			{ recordKey: "overlay-remove", value: 4 },
		],
	});
}

describe("buildReconciliationPlanV1", () => {
	it("is deterministic when set-like current records are reordered", () => {
		expect(buildActionable([...currentRecords()].reverse())).toEqual(
			buildActionable(currentRecords()),
		);
	});

	it("dry-runs all statuses and only removes source-owned state", () => {
		const plan = buildBlocked();
		const statuses = Object.fromEntries(
			plan.operations.map((entry) => [entry.recordKey, entry.status]),
		);

		expect(statuses).toMatchObject({
			"new-row": "add",
			"additive-update": "update",
			"source-remove": "remove",
			"source-unchanged": "unchanged",
			"custom-row": "conflict",
			"manual-row": "unchanged",
			"other-source-row": "unchanged",
			"overlay-remove": "manual",
			"manual-new": "manual",
			"review-new": "review-blocked",
		});
		expect(
			plan.operations.find((entry) => entry.recordKey === "manual-row")
				?.preserves,
		).toContain("manual-owned");
		expect(plan.canApply).toBe(false);
	});

	it("fails closed when any plan blocker is present", () => {
		const current = currentRecords();
		const result = applyReconciliationPlanV1(current, buildBlocked(current));

		expect(result.blocked).toBe(true);
		expect(result.records).toEqual(current);
		expect(
			result.receipts.every((receipt) => receipt.outcome !== "applied"),
		).toBe(true);
	});

	it("applies expected-before operations idempotently and preserves overlays", () => {
		const plan = buildActionable();
		expect(plan.canApply).toBe(true);
		const first = applyReconciliationPlanV1(currentRecords(), plan);
		const updated = first.records.find(
			(entry) => entry.recordKey === "additive-update",
		);

		expect(first.blocked).toBe(false);
		expect(updated).toMatchObject({
			value: 2,
			customState: { note: "keep me" },
		});
		expect(
			first.records.some((entry) => entry.recordKey === "source-remove"),
		).toBe(false);
		expect(
			first.records.find((entry) => entry.recordKey === "custom-row")?.value,
		).toEqual({ bonus: 9 });
		expect(
			first.records.find((entry) => entry.recordKey === "manual-row")?.value,
		).toEqual({ enabled: true });

		const second = applyReconciliationPlanV1(first.records, plan);
		expect(second.records).toEqual(first.records);
		for (const receipt of second.receipts.filter((_, index) =>
			["add", "update", "remove"].includes(plan.operations[index].status),
		)) {
			expect(receipt.outcome).toBe("already-applied");
		}
	});

	it("atomically rejects updated, unchanged, and duplicate drift", () => {
		const plan = buildActionable();
		const changedUpdate = currentRecords().map((record) =>
			record.recordKey === "additive-update"
				? sourceRecord("additive-update", 99)
				: record,
		);
		const updateResult = applyReconciliationPlanV1(changedUpdate, plan);
		expect(updateResult.blocked).toBe(true);
		expect(updateResult.records).toEqual(changedUpdate);

		const changedUnchanged = currentRecords().map((record) =>
			record.recordKey === "source-unchanged"
				? sourceRecord("source-unchanged", 99)
				: record,
		);
		const unchangedResult = applyReconciliationPlanV1(changedUnchanged, plan);
		const unchangedOperation = plan.operations.find(
			(operation) => operation.recordKey === "source-unchanged",
		);
		expect(
			unchangedResult.receipts.find(
				(receipt) => receipt.operationId === unchangedOperation?.operationId,
			)?.outcome,
		).toBe("conflict");
		expect(unchangedResult.records).toEqual(changedUnchanged);

		const duplicateDrift = [
			...currentRecords(),
			sourceRecord("new-row", 8),
			sourceRecord("new-row", 9),
		];
		const duplicateResult = applyReconciliationPlanV1(duplicateDrift, plan);
		const addOperation = plan.operations.find(
			(operation) => operation.recordKey === "new-row",
		);
		const duplicateReceipt = duplicateResult.receipts.find(
			(receipt) => receipt.operationId === addOperation?.operationId,
		);
		expect(duplicateReceipt).toMatchObject({
			outcome: "conflict",
			observedBefore: { state: "conflict" },
		});
		expect(duplicateResult.records).toEqual(duplicateDrift);
	});
});
