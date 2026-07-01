/**
 * Initiative hand-off queue tests — localStorage-backed enqueue/drain/peek.
 */
import { beforeEach, describe, expect, it } from "vitest";
import {
	drainInitiativeAdditions,
	enqueueInitiativeAdditions,
	peekInitiativeAdditions,
} from "@/lib/initiativeQueue";

beforeEach(() => {
	localStorage.clear();
});

describe("initiative queue", () => {
	it("enqueues a single item that peek can read", () => {
		enqueueInitiativeAdditions({ name: "Wolf" });
		const pending = peekInitiativeAdditions();
		expect(pending).toHaveLength(1);
		expect(pending[0]?.name).toBe("Wolf");
	});

	it("merges an array onto anything already queued", () => {
		enqueueInitiativeAdditions({ name: "Wolf" });
		enqueueInitiativeAdditions([{ name: "Hawk" }, { name: "Bear" }]);
		expect(peekInitiativeAdditions().map((p) => p.name)).toEqual([
			"Wolf",
			"Hawk",
			"Bear",
		]);
	});

	it("drains all items and clears the queue", () => {
		enqueueInitiativeAdditions([{ name: "Wolf" }, { name: "Hawk" }]);
		const drained = drainInitiativeAdditions();
		expect(drained.map((p) => p.name)).toEqual(["Wolf", "Hawk"]);
		expect(peekInitiativeAdditions()).toEqual([]);
		expect(drainInitiativeAdditions()).toEqual([]);
	});

	it("treats an empty array enqueue as a no-op", () => {
		enqueueInitiativeAdditions([]);
		expect(peekInitiativeAdditions()).toEqual([]);
	});
});
