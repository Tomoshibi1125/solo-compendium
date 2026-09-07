import { describe, expect, it } from "vitest";
import {
	createPlanIssue,
	createStableOperationId,
	isBlockingPlanIssue,
	type MechanicalReference,
} from "@/lib/planning/contracts";
import { resolveMechanicalReferenceV1 } from "@/lib/planning/references";

const campaignCandidate: MechanicalReference = {
	version: 1,
	kind: "campaign",
	id: "campaign-explicit-17",
	label: "Glassline",
	evidence: [],
};

describe("planning contracts", () => {
	it("encodes strict, warning, manual, and review-blocked behavior", () => {
		const issues = [
			createPlanIssue({ severity: "strict", code: "strict", message: "bad" }),
			createPlanIssue({ severity: "warning", code: "warn", message: "note" }),
			createPlanIssue({
				severity: "manual",
				code: "manual",
				message: "choose",
			}),
			createPlanIssue({
				severity: "review-blocked",
				code: "review",
				message: "review",
				reviewBlockerId: "blocker-1",
			}),
		];

		expect(issues.map(isBlockingPlanIssue)).toEqual([true, false, true, true]);
		expect(issues.map((issue) => issue.blocksApply)).toEqual([
			true,
			false,
			true,
			true,
		]);
	});

	it("creates stable operation IDs independent of object key order", () => {
		expect(createStableOperationId({ path: "hp.max", source: "job" })).toBe(
			createStableOperationId({ source: "job", path: "hp.max" }),
		);
	});
});

describe("resolveMechanicalReferenceV1", () => {
	it("does not invent an ID from a name", () => {
		const result = resolveMechanicalReferenceV1({
			kind: "campaign",
			requestedName: "Glassline",
		});

		expect(result.status).toBe("unresolved");
		expect(result.reference).toBeNull();
		expect(result.request.explicitCandidate).toBeNull();
		expect(result.issues[0]).toMatchObject({
			severity: "manual",
			blocksApply: true,
		});
	});

	it("resolves only the exact explicit candidate", () => {
		const result = resolveMechanicalReferenceV1({
			kind: "campaign",
			requestedName: "A renamed campaign",
			explicitCandidate: campaignCandidate,
		});

		expect(result.status).toBe("resolved");
		expect(result.reference).toEqual(campaignCandidate);
	});

	it("keeps forbidden references distinct from unresolved ones", () => {
		const result = resolveMechanicalReferenceV1({
			kind: "campaign",
			explicitCandidate: campaignCandidate,
			forbidden: {
				code: "campaign-access-forbidden",
				reason: "The campaign is outside the allowed scope",
				reviewBlockerId: "access-review-1",
			},
		});

		expect(result.status).toBe("forbidden");
		expect(result.reference).toBeNull();
		expect(result.issues[0]).toMatchObject({
			severity: "review-blocked",
			reviewBlockerId: "access-review-1",
		});
	});
});
