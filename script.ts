import * as fs from "fs";
import { powers_core } from "./src/data/compendium/powers-core";
import { powers_supplemental } from "./src/data/compendium/powers-supplemental";
import { spells_d } from "./src/data/compendium/spells/rank-d";
import { spells_supplemental } from "./src/data/compendium/spells/supplemental";
import { techniques_core } from "./src/data/compendium/techniques-core";
import { techniques_supplemental } from "./src/data/compendium/techniques-supplemental";
import {
	getDerivedPowerTags,
	getDerivedSpellTags,
	getDerivedTechniqueTags,
} from "./src/lib/jobAbilityAccess";

try {
	const spellTags: Record<string, string[]> = {};
	for (const s of spells_d) {
		spellTags[s.id || ""] = getDerivedSpellTags(s);
	}
	for (const s of spells_supplemental) {
		spellTags[s.id || ""] = getDerivedSpellTags(s);
	}

	const powerTags: Record<string, string[]> = {};
	for (const p of powers_core) {
		powerTags[p.id || ""] = getDerivedPowerTags(p);
	}
	for (const p of powers_supplemental) {
		powerTags[p.id || ""] = getDerivedPowerTags(p);
	}

	const techTags: Record<string, string[]> = {};
	for (const t of techniques_core) {
		techTags[t.id || ""] = getDerivedTechniqueTags(t);
	}
	for (const t of techniques_supplemental) {
		techTags[t.id || ""] = getDerivedTechniqueTags(t);
	}

	fs.writeFileSync(
		"src/lib/abilityMappings.ts",
		"export const SPELL_TAGS_BY_ID: Record<string, string[]> = " +
			JSON.stringify(spellTags, null, 2) +
			";\n\n" +
			"export const POWER_TAGS_BY_ID: Record<string, string[]> = " +
			JSON.stringify(powerTags, null, 2) +
			";\n\n" +
			"export const TECHNIQUE_TAGS_BY_ID: Record<string, string[]> = " +
			JSON.stringify(techTags, null, 2) +
			";\n",
	);
	console.log("Successfully wrote abilityMappings.ts!");
} catch (e) {
	console.error("Error generating maps:", e);
}
