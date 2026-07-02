import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Phase-4 legibility sweep regression guard: these pages had their genuine
 * content text bumped to >=11px (deliberate compact HUD/caption micro-labels
 * elsewhere are exempt and keep their design-language sizes). The swept files
 * below ended the sweep with ZERO sub-11px text — keep them that way.
 */
const SWEPT_CLEAN_PAGES = [
	"src/pages/Campaigns.tsx",
	"src/pages/CampaignSessionPlay.tsx",
	"src/pages/admin/FeatureChoicesAdmin.tsx",
];

const SUB_11PX_PATTERN = /text-\[(?:[1-9]|10)px\]/;

describe("legibility sweep — no sub-11px content text regression", () => {
	for (const relPath of SWEPT_CLEAN_PAGES) {
		it(`${relPath} contains no sub-11px text classes`, () => {
			const source = readFileSync(
				path.resolve(__dirname, "../../..", relPath),
				"utf-8",
			);
			expect(source).not.toMatch(SUB_11PX_PATTERN);
		});
	}
});
