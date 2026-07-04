/**
 * Regression guard for the protocol-data init race.
 *
 * main.tsx fires initializeProtocolData() without awaiting, so app modules
 * routinely evaluate BEFORE the registry is populated. characterEngine once
 * snapshotted getStaticJobs() at module scope; because initialization
 * REASSIGNS registry.jobs, that snapshot stayed [] for the whole session and
 * awakening features / job traits silently vanished from the effects
 * pipeline.
 *
 * This file reproduces the failure order: characterEngine is imported at the
 * top (pre-init module eval), data is initialized afterwards, and only then
 * are the aggregators called. With a module-scope snapshot these assertions
 * go RED; with call-time lookups they stay GREEN.
 */
import { beforeAll, describe, expect, it } from "vitest";
import {
	aggregateAwakeningFeatures,
	aggregateJobTraits,
} from "../characterEngine";
import { initializeProtocolData } from "../ProtocolDataManager";

describe("characterEngine sees protocol data loaded after module import", () => {
	beforeAll(async () => {
		await initializeProtocolData();
	});

	it("aggregateAwakeningFeatures returns unlocked features for a known job", () => {
		const features = aggregateAwakeningFeatures(
			[{ job: "berserker", level: 20, hitDie: 12 }],
			20,
		);
		expect(features.length).toBeGreaterThan(0);
		for (const feature of features) {
			expect(feature.sourceType).toBe("awakening");
			expect(feature.sourceId).toBe("berserker");
		}
	});

	it("aggregateJobTraits returns traits for a known job", () => {
		const traits = aggregateJobTraits(
			[{ job: "berserker", level: 20, hitDie: 12 }],
			20,
		);
		expect(traits.length).toBeGreaterThan(0);
		for (const trait of traits) {
			expect(trait.sourceType).toBe("trait");
			expect(trait.sourceId).toBe("berserker");
		}
	});
});
