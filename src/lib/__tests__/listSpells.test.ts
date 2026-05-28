import { expect, test } from "vitest";
import {
	listLearnablePowers,
	listLearnableSpells,
	listLearnableTechniques,
} from "@/lib/canonicalCompendium";

test("listLearnableSpells for Idol", async () => {
	const spells = await listLearnableSpells({
		jobName: "Idol",
		characterLevel: 1,
	});
	console.log(`Idol level 1 learnable spells: ${spells.length}`);
	expect(spells.length).toBeGreaterThan(0);
});

test("listLearnablePowers for Destroyer", async () => {
	const powers = await listLearnablePowers({
		jobName: "Destroyer",
		characterLevel: 1,
	});
	console.log(`Destroyer level 1 learnable powers: ${powers.length}`);
	expect(powers.length).toBeGreaterThan(0);
});

test("listLearnableTechniques for Destroyer", async () => {
	const techniques = await listLearnableTechniques({
		jobName: "Destroyer",
		characterLevel: 1,
	});
	console.log(`Destroyer level 1 learnable techniques: ${techniques.length}`);
	expect(techniques.length).toBeGreaterThan(0);
});
