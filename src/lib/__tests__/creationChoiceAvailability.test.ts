/**
 * Creation-availability parity guard.
 *
 * The character-creation "Awakening Imprints" step blocks Advance Protocol
 * whenever a required choice bucket has fewer learnable options than it demands
 * (isRequiredChoiceBucketReady in CharacterNew.tsx: `available >= required`).
 *
 * This is exactly how the Revenant (and every half-caster) got soft-bricked:
 * `powersKnown[0] = 2` demanded 2 powers, but power access wrongly followed the
 * half-caster SPELL curve (cap 0 at level 1), so `listLearnablePowers` returned
 * none. No existing test caught it because the coverage suite calls
 * `listLearnablePowers` WITHOUT `characterLevel`, so no level cap is applied.
 *
 * This test reproduces the real creation queries (characterLevel: 1) for every
 * job and asserts required <= available for each compendium-list-driven bucket.
 * It fails on any job whose creation demand exceeds what is learnable at L1.
 */

import { describe, expect, it } from "vitest";
import { jobs } from "@/data/compendium/jobs";
import {
	listLearnablePowers,
	listLearnableSpells,
	listLearnableTechniques,
} from "@/lib/canonicalCompendium";
import {
	type ChoiceSourceData,
	calculateTotalChoices,
} from "@/lib/choiceCalculations";

// Build the creation choice source the same way CharacterNew.tsx does: ledger +
// progression arrays + spellbook, plus the prose-parsed awakening/trait layer.
function toCreationSource(job: (typeof jobs)[number]): ChoiceSourceData {
	return {
		name: job.name,
		awakening_features: job.awakeningFeatures,
		job_traits: job.jobTraits,
		level_choices: job.levelChoices,
		powers_known: job.powersKnown,
		techniques_known: job.techniquesKnown,
		cantrips_known: job.spellcasting?.cantripsKnown,
		spells_known: job.spellcasting?.spellsKnown,
		spellbook: job.spellbook,
	} as ChoiceSourceData;
}

describe("creation choice availability parity (level 1)", () => {
	for (const job of jobs) {
		it(`${job.name}: every required L1 imprint bucket has enough learnable options`, async () => {
			const required = calculateTotalChoices(
				toCreationSource(job),
				null,
				[],
				1,
			);
			const jobName = job.name;

			// Powers — listLearnablePowers({ jobName, characterLevel: 1 }).
			if (required.powers > 0) {
				const powers = await listLearnablePowers({
					jobName,
					characterLevel: 1,
				});
				expect(
					powers.length,
					`${jobName}: needs ${required.powers} power(s) at L1 but only ${powers.length} learnable`,
				).toBeGreaterThanOrEqual(required.powers);
			}

			// Techniques — listLearnableTechniques({ characterLevel: 1, maxLevel: 1 }).
			if (required.techniques > 0) {
				const techniques = await listLearnableTechniques({
					jobName,
					characterLevel: 1,
					maxLevel: 1,
				});
				expect(
					techniques.length,
					`${jobName}: needs ${required.techniques} technique(s) at L1 but only ${techniques.length} learnable`,
				).toBeGreaterThanOrEqual(required.techniques);
			}

			// Cantrips — listLearnableSpells({ maxPowerLevel: 0 }) filtered to power_level 0.
			if (required.cantrips > 0) {
				const spells = await listLearnableSpells({
					jobName,
					characterLevel: 1,
					maxPowerLevel: 0,
				});
				const cantrips = spells.filter((s) => s.power_level === 0);
				expect(
					cantrips.length,
					`${jobName}: needs ${required.cantrips} cantrip(s) at L1 but only ${cantrips.length} learnable`,
				).toBeGreaterThanOrEqual(required.cantrips);
			}

			// Leveled spells + spellbook inscriptions both draw from the L1 leveled
			// spell list — listLearnableSpells({ characterLevel: 1 }), power_level > 0.
			const leveledNeed = Math.max(
				required.spells,
				required.spellbookInscriptions,
			);
			if (leveledNeed > 0) {
				const spells = await listLearnableSpells({
					jobName,
					characterLevel: 1,
				});
				const leveled = spells.filter((s) => s.power_level > 0);
				expect(
					leveled.length,
					`${jobName}: needs ${leveledNeed} leveled spell(s)/inscription(s) at L1 but only ${leveled.length} learnable`,
				).toBeGreaterThanOrEqual(leveledNeed);
			}
		});
	}
});
