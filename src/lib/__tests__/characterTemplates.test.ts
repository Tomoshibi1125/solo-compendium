/**
 * Quick Ascendant template drift gate.
 *
 * The creation wizard applies templates by exact-name lookup: job and
 * background against the canonical compendium, skills against the job's
 * skillChoices, and equipment choices against the option strings of the
 * job's startingEquipment groups. A dangling reference silently no-ops
 * (the original presets referenced a "Warrior" job and "Mercenary"
 * background that never existed), so every value is asserted here.
 */

import { describe, expect, it } from "vitest";
import { backgrounds } from "@/data/compendium/backgrounds";
import { jobs } from "@/data/compendium/jobs";
import { DEFAULT_TEMPLATES } from "@/hooks/useCharacterTemplates";

describe("quick ascendant templates", () => {
	for (const template of DEFAULT_TEMPLATES) {
		const job = jobs.find((j) => j.name === template.job);
		const background = backgrounds.find((b) => b.name === template.background);

		it(`${template.name}: job "${template.job}" exists`, () => {
			expect(job).toBeDefined();
		});

		it(`${template.name}: background "${template.background}" exists`, () => {
			expect(background).toBeDefined();
		});

		it(`${template.name}: every skill is a valid job skill choice`, () => {
			const choices = job?.skillChoices ?? [];
			const invalid = template.skills.filter((s) => !choices.includes(s));
			expect(invalid).toEqual([]);
		});

		it(`${template.name}: every equipment choice matches its startingEquipment group`, () => {
			const groups = job?.startingEquipment ?? [];
			const invalid = Object.entries(template.equipment).filter(
				([index, option]) => !groups[Number(index)]?.includes(option),
			);
			expect(invalid).toEqual([]);
		});
	}
});
