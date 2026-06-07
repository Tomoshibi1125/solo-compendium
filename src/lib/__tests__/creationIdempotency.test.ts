/**
 * Regression tests for creation-setup idempotency.
 *
 * The level-1 setup helpers (addLevel1Features, addBackgroundFeatures,
 * addStartingEquipment) must be safe to re-run — e.g. when a creation attempt
 * is retried or a character is reconciled/repaired — without duplicating the
 * rows they grant. This is the stable, re-runnable foundation that replaces
 * "best-effort and hope it worked" creation. The awakening helpers
 * (applyJobAwakeningTraitsToCharacter / addJobAwakeningBenefitsForLevel) are
 * already covered by racialAsiRegression / jobAwakeningFeatures.
 */

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
	addBackgroundFeatures,
	addLevel1Features,
	addStartingEquipment,
} from "@/lib/characterCreation";
import {
	createLocalCharacter,
	listLocalEquipment,
	listLocalFeatures,
} from "@/lib/guestStore";
import type { StaticBackground, StaticJob } from "@/types/character";

function ensureLocalStorage() {
	if (typeof globalThis.localStorage === "undefined") {
		const store: Record<string, string> = {};
		(globalThis as unknown as { localStorage: Storage }).localStorage = {
			getItem: (k) => (k in store ? store[k] : null),
			setItem: (k, v) => {
				store[k] = String(v);
			},
			removeItem: (k) => {
				delete store[k];
			},
			clear: () => {
				for (const k of Object.keys(store)) delete store[k];
			},
			key: (i) => Object.keys(store)[i] ?? null,
			get length() {
				return Object.keys(store).length;
			},
		} as Storage;
	}
}

// Minimal static job recognised by isStaticJob (requires `awakeningFeatures`).
function fixtureJob(): StaticJob {
	return {
		id: "idem-job",
		name: "Idempotency Job",
		awakeningFeatures: [],
		classFeatures: [
			{ name: "Feature Alpha", level: 1, description: "alpha" },
			{ name: "Feature Beta", level: 1, description: "beta" },
			{ name: "Feature Gamma", level: 2, description: "gamma (later)" },
		],
		startingEquipment: [["Test Blade"], ["Test Buckler"]],
	} as unknown as StaticJob;
}

function fixtureBackground(): StaticBackground {
	return {
		name: "Idempotency Background",
		feature_name: "Background Perk",
		feature_description: "perk desc",
	} as unknown as StaticBackground;
}

describe("creation setup idempotency", () => {
	beforeEach(() => {
		ensureLocalStorage();
		globalThis.localStorage.clear();
	});
	afterEach(() => {
		globalThis.localStorage.clear();
	});

	it("addLevel1Features only grants level-1 class features once across re-runs", async () => {
		const row = createLocalCharacter({ name: "Idem A", job: "Idempotency Job" });
		const job = fixtureJob();

		await addLevel1Features(row.id, job);
		await addLevel1Features(row.id, job); // re-run (e.g. retry/reconcile)

		const names = listLocalFeatures(row.id).map((f) => f.name);
		expect(names.filter((n) => n === "Feature Alpha")).toHaveLength(1);
		expect(names.filter((n) => n === "Feature Beta")).toHaveLength(1);
		// Level-2 feature must not be granted at creation.
		expect(names).not.toContain("Feature Gamma");
	});

	it("addBackgroundFeatures only grants the background feature once across re-runs", async () => {
		const row = createLocalCharacter({ name: "Idem B" });
		const background = fixtureBackground();

		await addBackgroundFeatures(row.id, background);
		await addBackgroundFeatures(row.id, background); // re-run

		const perkCount = listLocalFeatures(row.id).filter(
			(f) => f.name === "Background Perk",
		).length;
		expect(perkCount).toBe(1);
	});

	it("addStartingEquipment does not duplicate job gear across re-runs", async () => {
		const row = createLocalCharacter({ name: "Idem C", job: "Idempotency Job" });
		const job = fixtureJob();
		const background = fixtureBackground(); // no starting_equipment → bg branch skipped

		await addStartingEquipment(row.id, job, background, [], {}, null);
		await addStartingEquipment(row.id, job, background, [], {}, null); // re-run

		const equipment = listLocalEquipment(row.id).map((e) => e.name);
		expect(equipment.filter((n) => n === "Test Blade")).toHaveLength(1);
		expect(equipment.filter((n) => n === "Test Buckler")).toHaveLength(1);
	});

	it("preserves legitimate duplicate items granted within a single first-run pass", async () => {
		const row = createLocalCharacter({ name: "Idem D", job: "Dual Wield Job" });
		const job = {
			id: "dual-job",
			name: "Dual Wield Job",
			awakeningFeatures: [],
			// Two groups that both default to the same item.
			startingEquipment: [["Twin Dagger"], ["Twin Dagger"]],
		} as unknown as StaticJob;
		const background = fixtureBackground();

		await addStartingEquipment(row.id, job, background, [], {}, null);

		const daggers = listLocalEquipment(row.id).filter(
			(e) => e.name === "Twin Dagger",
		);
		expect(daggers).toHaveLength(2);
	});
});
