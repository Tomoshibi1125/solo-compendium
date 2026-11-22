/**
 * Initiative hand-off queue tests — localStorage-backed enqueue/drain/peek.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	COMPANION_COMBAT_HANDOFF_EVENT,
	type CompanionCombatHandoffDetail,
	drainInitiativeAdditions,
	enqueueInitiativeAdditions,
	peekInitiativeAdditions,
} from "@/lib/initiativeQueue";

beforeEach(() => {
	localStorage.clear();
	window.history.replaceState({}, "", "/");
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

	it("captures the stable C1 origin when queued from an existing companion sheet", () => {
		window.history.replaceState(
			{},
			"",
			"/characters/char-1/companions/extra/extra-9",
		);
		enqueueInitiativeAdditions({ name: "Rift Hound", initiative: 11 });
		expect(peekInitiativeAdditions()[0]).toMatchObject({
			companionOriginTable: "character_extras",
			companionOriginRowId: "extra-9",
			companionOwnerCharacterId: "char-1",
		});
	});

	it("diverts living companions to the persistent C3 bridge in a campaign session", () => {
		window.history.replaceState(
			{},
			"",
			"/warden/initiative?campaignId=campaign-1&sessionId=session-1",
		);
		enqueueInitiativeAdditions({
			name: "Rift Hound",
			initiative: 14,
			companionInstanceId: "instance-1",
		});
		enqueueInitiativeAdditions({ name: "Ordinary Enemy", initiative: 7 });

		let detail: CompanionCombatHandoffDetail | null = null;
		const listener = vi.fn((event: Event) => {
			detail = (event as CustomEvent<CompanionCombatHandoffDetail>).detail;
		});
		window.addEventListener(COMPANION_COMBAT_HANDOFF_EVENT, listener);

		const drained = drainInitiativeAdditions();
		window.removeEventListener(COMPANION_COMBAT_HANDOFF_EVENT, listener);

		expect(drained).toEqual([{ name: "Ordinary Enemy", initiative: 7 }]);
		expect(listener).toHaveBeenCalledTimes(1);
		expect(detail).toEqual({
			campaignId: "campaign-1",
			sessionId: "session-1",
			items: [
				{
					name: "Rift Hound",
					initiative: 14,
					companionInstanceId: "instance-1",
				},
			],
		});
	});
});
