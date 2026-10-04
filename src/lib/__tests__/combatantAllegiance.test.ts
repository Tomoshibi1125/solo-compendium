/**
 * Initiative Tracker allegiance badges: disposition belongs to the encounter,
 * companions belong to characters, and no row is labeled just "Anomaly".
 */
import { describe, expect, it } from "vitest";
import {
	combatantAllegianceBadges,
	toEncounterDisposition,
} from "@/lib/combatantAllegiance";
import {
	createEncounterWorkflowEntryId,
	createEncounterWorkflowSourceIdentityV1,
	prepareEncounterInitiativeHandoffV1,
} from "@/lib/planning/adapters/encounterWorkflow";

const labels = (input: Parameters<typeof combatantAllegianceBadges>[0]) =>
	combatantAllegianceBadges(input).map((badge) => badge.label);

describe("toEncounterDisposition", () => {
	it("accepts the four encounter dispositions and drops anything else", () => {
		for (const value of ["neutral", "wary", "friendly", "hostile"]) {
			expect(toEncounterDisposition(value)).toBe(value);
		}
		for (const value of ["Hostile", "enemy", "", null, undefined, 3, {}]) {
			expect(toEncounterDisposition(value)).toBeUndefined();
		}
	});
});

describe("combatantAllegianceBadges", () => {
	it("labels Ascendants and companions before any disposition", () => {
		expect(
			combatantAllegianceBadges({ isHunter: true, disposition: "hostile" }),
		).toEqual([{ label: "Ascendant", variant: "secondary" }]);
		expect(
			combatantAllegianceBadges({
				isHunter: false,
				isCompanion: true,
				disposition: "hostile",
				currentlyHostile: true,
			}),
		).toEqual([{ label: "Companion", variant: "outline" }]);
	});

	it("shows the encounter disposition and states hostility in text", () => {
		expect(
			combatantAllegianceBadges({
				isHunter: false,
				disposition: "hostile",
				currentlyHostile: true,
			}),
		).toEqual([{ label: "Hostile", variant: "destructive" }]);
		expect(
			labels({ isHunter: false, disposition: "wary", currentlyHostile: true }),
		).toEqual(["Wary", "Hostile now"]);
		expect(
			labels({
				isHunter: false,
				disposition: "hostile",
				currentlyHostile: false,
			}),
		).toEqual(["Hostile", "Not hostile now"]);
		expect(
			labels({
				isHunter: false,
				disposition: "friendly",
				currentlyHostile: false,
			}),
		).toEqual(["Friendly"]);
	});

	it("uses the Encounter Builder defaults when fields are missing", () => {
		expect(labels({ isHunter: false })).toEqual(["Neutral"]);
		// Hostility follows the disposition, as the builder ticks it with Hostile.
		expect(
			combatantAllegianceBadges({ isHunter: false, disposition: "hostile" }),
		).toEqual([{ label: "Hostile", variant: "destructive" }]);
	});

	it("never falls back to a generic Anomaly label", () => {
		const inputs = [
			{ isHunter: false },
			{ isHunter: false, isCompanion: true },
			{ isHunter: false, disposition: "neutral" as const },
			{ isHunter: false, disposition: "hostile" as const },
		];
		for (const input of inputs) {
			expect(labels(input)).not.toContain("Anomaly");
		}
	});

	it("labels every row of an Encounter Builder handoff from its disposition", () => {
		const hound = createEncounterWorkflowSourceIdentityV1(
			"canonical",
			"anomaly-mirror-hound",
		);
		const stalker = createEncounterWorkflowSourceIdentityV1(
			"canonical",
			"anomaly-ridge-stalker",
		);
		const handoff = prepareEncounterInitiativeHandoffV1(
			{
				campaignId: null,
				name: "Ridge ambush",
				hunterLevel: 5,
				hunterCount: 4,
				objectives: "",
				totalXP: 900,
				difficulty: "medium",
				roster: [
					{
						entryId: createEncounterWorkflowEntryId(hound),
						displayName: "Mirror Hound",
						quantity: 1,
						disposition: "wary",
						currentlyHostile: true,
						source: hound,
						runtimeState: {
							id: hound.sourceId,
							name: "Mirror Hound",
							hit_points_average: 22,
							armor_class: 13,
						},
					},
					{
						entryId: createEncounterWorkflowEntryId(stalker),
						displayName: "Ridge Stalker",
						quantity: 1,
						disposition: "friendly",
						currentlyHostile: false,
						source: stalker,
						runtimeState: {
							id: stalker.sourceId,
							name: "Ridge Stalker",
							hit_points_average: 30,
							armor_class: 14,
						},
					},
				],
			},
			"2026-09-29T00:00:00.000Z",
		);
		expect(handoff.status).toBe("ready");
		if (handoff.status !== "ready") return;
		expect(handoff.state.combatants.map(labels)).toEqual([
			["Wary", "Hostile now"],
			["Friendly"],
		]);
	});
});
