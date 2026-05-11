import { beforeEach, describe, expect, it } from "vitest";
import {
	addLocalFeature,
	addLocalPower,
	addLocalSpell,
	addLocalTechnique,
	createLocalCharacter,
	listLocalFeatures,
	listLocalPowers,
	listLocalSpells,
	listLocalTechniques,
} from "@/lib/guestStore";
import {
	parseLevelGrantSource,
	removeProgressionGrantsAboveLevel,
	wasGrantedAboveLevel,
} from "@/lib/levelDownCleanup";

function clearGuestState() {
	window.localStorage.clear();
}

describe("levelDownCleanup", () => {
	beforeEach(() => {
		clearGuestState();
	});

	it("parses level-scoped grant source labels", () => {
		expect(parseLevelGrantSource("Level 7 Power Choice")).toBe(7);
		expect(parseLevelGrantSource("level 12 Spellbook Inscription")).toBe(12);
		expect(parseLevelGrantSource("Creation Power Imprint")).toBeNull();
		expect(wasGrantedAboveLevel("Level 6 Technique Choice", 5)).toBe(true);
		expect(wasGrantedAboveLevel("Level 5 Technique Choice", 5)).toBe(false);
	});

	it("removes local features and abilities granted above the target level", async () => {
		const character = createLocalCharacter({
			name: "Level Down Local",
			job: "Mage",
			level: 8,
		});
		addLocalFeature(character.id, {
			name: "Kept Feature",
			source: "Job: Mage",
			level_acquired: 4,
		});
		addLocalFeature(character.id, {
			name: "Removed Feature",
			source: "Job: Mage",
			level_acquired: 7,
		});
		addLocalPower(character.id, {
			name: "Kept Power",
			power_level: 2,
			source: "Level 4 Power Choice",
		});
		addLocalPower(character.id, {
			name: "Removed Power",
			power_level: 4,
			source: "Level 7 Power Choice",
		});
		addLocalSpell(character.id, {
			name: "Kept Spell",
			spell_level: 2,
			source: "Level 4 Power Inscription",
		});
		addLocalSpell(character.id, {
			name: "Removed Spell",
			spell_level: 4,
			source: "Level 7 Power Inscription",
		});
		addLocalTechnique(character.id, {
			technique_id: "kept-technique",
			source: "Level 4 Technique Choice",
		});
		addLocalTechnique(character.id, {
			technique_id: "removed-technique",
			source: "Level 7 Technique Choice",
		});

		await removeProgressionGrantsAboveLevel(character.id, 8, 5);

		expect(
			listLocalFeatures(character.id).map((feature) => feature.name),
		).toEqual(["Kept Feature"]);
		expect(listLocalPowers(character.id).map((power) => power.name)).toEqual([
			"Kept Power",
		]);
		expect(listLocalSpells(character.id).map((spell) => spell.name)).toEqual([
			"Kept Spell",
		]);
		expect(
			listLocalTechniques(character.id).map(
				(technique) => technique.technique_id,
			),
		).toEqual(["kept-technique"]);
	});
});
