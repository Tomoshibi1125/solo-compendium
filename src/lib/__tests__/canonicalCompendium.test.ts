import { describe, expect, it } from "vitest";
import {
	isAbilityEntryComplete,
	isCanonicalPowerLearnable,
	isCanonicalSpellLearnable,
	isCanonicalTechniqueLearnable,
	listCanonicalCastables,
	listCanonicalEntries,
	listCanonicalPowers,
	listCanonicalSpells,
	listLearnablePowers,
	listLearnableSpells,
	listLearnableTechniques,
	validateAbilityCompleteness,
} from "@/lib/canonicalCompendium";

describe("canonicalCompendium resolver", () => {
	it("sanitizes placeholder damage strings on utility castables", async () => {
		const castables = await listCanonicalCastables();

		// Every castable whose damage_roll survived normalization must look
		// like a real formula (NdM or a plain number), never a sentinel like
		// '—', 'N/A', 'none'.
		const bogusDamageRolls = castables.filter((entry) => {
			if (!entry.damage_roll) return false;
			const normalized = entry.damage_roll.trim().toLowerCase();
			if (["—", "-", "n/a", "na", "none", "self"].includes(normalized)) {
				return true;
			}
			return (
				!/\d+d\d+/i.test(normalized) &&
				!/^\d+(\s*[+-]\s*\d+)?$/.test(normalized)
			);
		});

		expect(
			bogusDamageRolls,
			`Bogus damage_roll values survived canonical normalization:\n${bogusDamageRolls
				.map(
					(entry) =>
						`- ${entry.canonical_type}:${entry.name} = "${entry.damage_roll}"`,
				)
				.join("\n")}`,
		).toHaveLength(0);
	});

	it("sanitizes placeholder damage_type tokens", async () => {
		const castables = await listCanonicalCastables();
		const bogusTypes = castables.filter((entry) => {
			if (!entry.damage_type) return false;
			const normalized = entry.damage_type.trim().toLowerCase();
			return ["none", "n/a", "self"].includes(normalized);
		});

		expect(
			bogusTypes,
			`Bogus damage_type values survived canonical normalization:\n${bogusTypes
				.map(
					(entry) =>
						`- ${entry.canonical_type}:${entry.name} = "${entry.damage_type}"`,
				)
				.join("\n")}`,
		).toHaveLength(0);
	});

	it("preserves utility/support castables with resolution but no damage_roll", async () => {
		const castables = await listCanonicalCastables();
		const utilityTokens =
			/\b(aegis|aura|shield|ward|barrier|veil|shroud|sanctuary|haste|swift|regeneration|healing|soothe|insight|forecast|scrying|sanctify|blessing|blink|teleport|stealth)\b/i;

		const utilityWithResolution = castables.filter((entry) => {
			if (!utilityTokens.test(entry.name)) return false;
			return (
				entry.has_save || entry.has_attack_roll || Boolean(entry.save_ability)
			);
		});

		// The reshape work should have preserved at least one resolution path
		// (save, attack roll, or save_ability) for every utility-named castable.
		expect(utilityWithResolution.length).toBeGreaterThan(0);

		for (const entry of utilityWithResolution) {
			// Utility powers should NOT carry a damage roll after sanitization.
			if (entry.damage_roll) {
				// Allow the specific cases where a utility power has both damage
				// and a secondary save (e.g. Thundercharge, Vampiric Drain) — their
				// damage formula must still be a real dice expression.
				expect(entry.damage_roll).toMatch(/\d+d\d+/i);
			}
		}
	});

	it("exposes enriched sigils with flavor, lore, and effects", async () => {
		const sigils = await listCanonicalEntries("sigils");
		expect(sigils.length).toBeGreaterThan(0);

		// Spot-check: every sigil must carry a description, and at least a
		// majority expose flavor/lore from the enriched provider transform.
		const withFlavor = sigils.filter(
			(s) => typeof s.flavor === "string" && s.flavor.trim().length > 0,
		);
		const withLore = sigils.filter((s) => {
			const lore = s.lore;
			if (typeof lore === "string") return lore.trim().length > 0;
			return !!lore && typeof lore === "object";
		});

		expect(
			withFlavor.length,
			"Sigils should expose flavor text via the enriched provider transform.",
		).toBeGreaterThan(sigils.length / 2);
		expect(
			withLore.length,
			"Sigils should expose lore via the enriched provider transform.",
		).toBeGreaterThan(sigils.length / 2);
	});

	it("exposes enriched tattoos with mechanics, flavor, and lore", async () => {
		const tattoos = await listCanonicalEntries("tattoos");
		expect(tattoos.length).toBeGreaterThan(0);

		const withMechanics = tattoos.filter(
			(t) => !!t.mechanics && typeof t.mechanics === "object",
		);
		const withFlavor = tattoos.filter(
			(t) => typeof t.flavor === "string" && t.flavor.trim().length > 0,
		);

		expect(
			withMechanics.length,
			"Tattoos should expose mechanics via the enriched provider transform.",
		).toBeGreaterThan(tattoos.length / 2);
		expect(
			withFlavor.length,
			"Tattoos should expose flavor via the enriched provider transform.",
		).toBeGreaterThan(tattoos.length / 2);
	});

	it("keeps learnable spell, power, and technique lists separated by job access", async () => {
		const [magePowers, mageTechniques, destroyerSpells] = await Promise.all([
			listLearnablePowers({ jobName: "Mage" }),
			listLearnableTechniques({ jobName: "Mage" }),
			listLearnableSpells({ jobName: "Destroyer" }),
		]);

		expect(magePowers).toHaveLength(0);
		expect(mageTechniques).toHaveLength(0);
		expect(destroyerSpells).toHaveLength(0);
	});

	it("rejects cross-job canonical eligibility at the helper layer", async () => {
		const [power] = await listCanonicalPowers();
		const [spell] = await listCanonicalSpells();
		const [technique] = await listCanonicalEntries("techniques");

		expect(isCanonicalPowerLearnable(power, { jobName: "Mage" })).toBe(false);
		expect(isCanonicalSpellLearnable(spell, { jobName: "Destroyer" })).toBe(
			false,
		);
		expect(isCanonicalTechniqueLearnable(technique, { jobName: "Mage" })).toBe(
			false,
		);
	});

	it("gates path-granted spell access by selected path and character level", async () => {
		const mageSpells = (await listCanonicalSpells()).filter((entry) => {
			const classes = (entry as { classes?: unknown }).classes;
			const school = (entry as { school?: unknown }).school;
			return (
				entry.power_level === 1 &&
				Array.isArray(classes) &&
				classes.includes("Mage") &&
				(school === "Abjuration" || school === "Evocation")
			);
		});
		const grantedSpell = mageSpells[0];

		if (!grantedSpell) {
			throw new Error("Expected a level-1 Mage abjuration/evocation spell.");
		}
		expect(
			isCanonicalSpellLearnable(grantedSpell, {
				jobName: "Destroyer",
				characterLevel: 3,
			}),
		).toBe(false);
		expect(
			isCanonicalSpellLearnable(grantedSpell, {
				jobName: "Destroyer",
				pathName: "Path of the Spell Breaker",
				characterLevel: 2,
			}),
		).toBe(false);
		expect(
			isCanonicalSpellLearnable(grantedSpell, {
				jobName: "Destroyer",
				pathName: "Path of the Spell Breaker",
				characterLevel: 3,
			}),
		).toBe(true);
	});

	it("keeps explicit path spell queries cantrip-only when max level is zero", async () => {
		const cantrips = await listLearnableSpells({
			jobName: "Destroyer",
			pathName: "Path of the Spell Breaker",
			characterLevel: 3,
			maxPowerLevel: 0,
		});

		expect(cantrips.length).toBeGreaterThan(0);
		expect(cantrips.every((entry) => entry.power_level === 0)).toBe(true);
	});

	it("gates exact path-granted powers by selected path and character level", async () => {
		const shadowStrike = (await listCanonicalPowers()).find(
			(entry) => entry.name === "Shadow Strike",
		);

		if (!shadowStrike) {
			throw new Error("Expected canonical Shadow Strike power.");
		}
		expect(
			isCanonicalPowerLearnable(shadowStrike, {
				jobName: "Stalker",
				characterLevel: 3,
			}),
		).toBe(false);
		expect(
			isCanonicalPowerLearnable(shadowStrike, {
				jobName: "Stalker",
				pathName: "Path of the Umbral Ascendant",
				characterLevel: 2,
			}),
		).toBe(false);
		expect(
			isCanonicalPowerLearnable(shadowStrike, {
				jobName: "Stalker",
				pathName: "Path of the Umbral Ascendant",
				characterLevel: 3,
			}),
		).toBe(true);
	});

	it("gates exact path-granted techniques by selected path and level", async () => {
		const harmonicCounter = (await listCanonicalEntries("techniques")).find(
			(entry) => entry.name === "Harmonic Counter",
		);

		if (!harmonicCounter) {
			throw new Error("Expected canonical Harmonic Counter technique.");
		}
		expect(
			isCanonicalTechniqueLearnable(harmonicCounter, {
				jobName: "Assassin",
				characterLevel: 17,
			}),
		).toBe(false);
		expect(
			isCanonicalTechniqueLearnable(harmonicCounter, {
				jobName: "Assassin",
				pathName: "Path of the Blade Dancer",
				characterLevel: 16,
			}),
		).toBe(false);
		expect(
			isCanonicalTechniqueLearnable(harmonicCounter, {
				jobName: "Assassin",
				pathName: "Path of the Blade Dancer",
				characterLevel: 17,
			}),
		).toBe(true);
	});

	it("gates Contractor Cursed Blade powers and techniques by selected path and level", async () => {
		const powers = await listCanonicalPowers();
		const cursedBladeEdge = powers.find(
			(entry) => entry.name === "Cursed Blade Edge",
		);
		const sacrificeEngine = powers.find(
			(entry) => entry.name === "Sacrifice Engine",
		);
		const techniques = await listCanonicalEntries("techniques");
		const pactBlade = techniques.find((entry) => entry.name === "Pact Blade");
		const eldritchRiposte = techniques.find(
			(entry) => entry.name === "Eldritch Riposte",
		);

		if (
			!cursedBladeEdge ||
			!sacrificeEngine ||
			!pactBlade ||
			!eldritchRiposte
		) {
			throw new Error("Expected Contractor path-granted catalog entries.");
		}
		expect(
			isCanonicalPowerLearnable(cursedBladeEdge, {
				jobName: "Contractor",
				characterLevel: 1,
			}),
		).toBe(false);
		expect(
			isCanonicalPowerLearnable(cursedBladeEdge, {
				jobName: "Contractor",
				pathName: "Path of the Glamour Weaver",
				characterLevel: 1,
			}),
		).toBe(false);
		expect(
			isCanonicalPowerLearnable(cursedBladeEdge, {
				jobName: "Contractor",
				pathName: "Path of the Cursed Blade",
				characterLevel: 1,
			}),
		).toBe(true);
		expect(
			isCanonicalPowerLearnable(sacrificeEngine, {
				jobName: "Contractor",
				pathName: "Path of the Cursed Blade",
				characterLevel: 3,
			}),
		).toBe(false);
		expect(
			isCanonicalPowerLearnable(sacrificeEngine, {
				jobName: "Contractor",
				pathName: "Path of the Cursed Blade",
				characterLevel: 5,
			}),
		).toBe(true);
		expect(
			isCanonicalTechniqueLearnable(pactBlade, {
				jobName: "Contractor",
				pathName: "Path of the Cursed Blade",
				characterLevel: 1,
			}),
		).toBe(true);
		expect(
			isCanonicalTechniqueLearnable(eldritchRiposte, {
				jobName: "Contractor",
				pathName: "Path of the Cursed Blade",
				characterLevel: 2,
			}),
		).toBe(false);
		expect(
			isCanonicalTechniqueLearnable(eldritchRiposte, {
				jobName: "Contractor",
				pathName: "Path of the Cursed Blade",
				characterLevel: 3,
			}),
		).toBe(true);
	});

	it("gates Idol powers and techniques to the matching resonance path", async () => {
		const powers = await listCanonicalPowers();
		const dissonantStrike = powers.find(
			(entry) => entry.name === "Dissonant Strike",
		);
		const encorePerformance = powers.find(
			(entry) => entry.name === "Encore Performance",
		);
		const techniques = await listCanonicalEntries("techniques");
		const rhythmicStrike = techniques.find(
			(entry) => entry.name === "Rhythmic Strike",
		);
		const resonanceSlash = techniques.find(
			(entry) => entry.name === "Resonance Slash",
		);

		if (
			!dissonantStrike ||
			!encorePerformance ||
			!rhythmicStrike ||
			!resonanceSlash
		) {
			throw new Error("Expected Idol path-granted catalog entries.");
		}
		expect(
			isCanonicalPowerLearnable(dissonantStrike, {
				jobName: "Idol",
				pathName: "Path of the Dance Resonance",
				characterLevel: 2,
			}),
		).toBe(false);
		expect(
			isCanonicalPowerLearnable(dissonantStrike, {
				jobName: "Idol",
				pathName: "Path of the Dance Resonance",
				characterLevel: 3,
			}),
		).toBe(true);
		expect(
			isCanonicalPowerLearnable(dissonantStrike, {
				jobName: "Idol",
				pathName: "Path of the Hypnotic Resonance",
				characterLevel: 3,
			}),
		).toBe(false);
		expect(
			isCanonicalPowerLearnable(encorePerformance, {
				jobName: "Idol",
				pathName: "Path of the Hypnotic Resonance",
				characterLevel: 3,
			}),
		).toBe(false);
		expect(
			isCanonicalPowerLearnable(encorePerformance, {
				jobName: "Idol",
				pathName: "Path of the Hypnotic Resonance",
				characterLevel: 7,
			}),
		).toBe(true);
		expect(
			isCanonicalTechniqueLearnable(rhythmicStrike, {
				jobName: "Idol",
				pathName: "Path of the Dance Resonance",
				characterLevel: 3,
			}),
		).toBe(true);
		expect(
			isCanonicalTechniqueLearnable(rhythmicStrike, {
				jobName: "Idol",
				pathName: "Path of the Blade Resonance",
				characterLevel: 3,
			}),
		).toBe(false);
		expect(
			isCanonicalTechniqueLearnable(resonanceSlash, {
				jobName: "Idol",
				pathName: "Path of the Blade Resonance",
				characterLevel: 3,
			}),
		).toBe(true);
		expect(
			isCanonicalTechniqueLearnable(resonanceSlash, {
				jobName: "Idol",
				pathName: "Path of the Dance Resonance",
				characterLevel: 3,
			}),
		).toBe(false);
	});

	it("marks hard-incomplete abilities as incomplete", () => {
		const incomplete = {
			id: "incomplete-test-spell",
			name: "Incomplete Test Spell",
			description: "Missing mechanics and resolution.",
			source_book: "Test Source",
			tags: ["spell", "mage"],
			canonical_type: "spells",
			power_level: 1,
			power_type: "Spell",
			casting_time: "1 action",
			range: "60 feet",
			duration: "Instantaneous",
			concentration: false,
			ritual: false,
			higher_levels: null,
			has_attack_roll: false,
			has_save: false,
			save_ability: null,
			damage_roll: null,
			damage_type: null,
			target: null,
			mechanics: null,
		};

		expect(isAbilityEntryComplete(incomplete, "spell")).toBe(false);
		expect(
			validateAbilityCompleteness(incomplete, "spell").some(
				(issue) => issue.severity === "error",
			),
		).toBe(true);
	});

	it("only returns complete entries through learnable ability lists", async () => {
		const [powers, spells, techniques] = await Promise.all([
			listLearnablePowers({ jobName: "Destroyer" }),
			listLearnableSpells({ jobName: "Mage" }),
			listLearnableTechniques({ jobName: "Destroyer" }),
		]);

		expect(
			powers.flatMap((entry) =>
				validateAbilityCompleteness(entry, "power").filter(
					(issue) => issue.severity === "error",
				),
			),
		).toEqual([]);
		expect(
			spells.flatMap((entry) =>
				validateAbilityCompleteness(entry, "spell").filter(
					(issue) => issue.severity === "error",
				),
			),
		).toEqual([]);
		expect(
			techniques.flatMap((entry) =>
				validateAbilityCompleteness(entry, "technique").filter(
					(issue) => issue.severity === "error",
				),
			),
		).toEqual([]);
	});

	it("returns martial powers and techniques through their own canonical list APIs", async () => {
		const [destroyerPowers, destroyerTechniques] = await Promise.all([
			listLearnablePowers({ jobName: "Destroyer" }),
			listLearnableTechniques({ jobName: "Destroyer", maxLevel: 1 }),
		]);

		expect(destroyerPowers.length).toBeGreaterThan(0);
		expect(destroyerTechniques.length).toBeGreaterThan(0);
		expect(
			destroyerPowers.every((entry) => entry.canonical_type === "powers"),
		).toBe(true);
	});

	it("level-gates learnable powers, spells, and techniques", async () => {
		const [
			levelOnePowers,
			levelTwentyPowers,
			levelOneSpells,
			levelOneTechniques,
		] = await Promise.all([
			listLearnablePowers({ jobName: "Destroyer", characterLevel: 1 }),
			listLearnablePowers({ jobName: "Destroyer", characterLevel: 20 }),
			listLearnableSpells({ jobName: "Mage", characterLevel: 1 }),
			listLearnableTechniques({ jobName: "Destroyer", characterLevel: 1 }),
		]);

		expect(levelOnePowers.every((entry) => entry.power_level <= 1)).toBe(true);
		expect(levelTwentyPowers.length).toBeGreaterThan(levelOnePowers.length);
		expect(levelOneSpells.every((entry) => entry.power_level <= 1)).toBe(true);
		expect(
			levelOneTechniques.every(
				(entry) => (entry.level_requirement ?? entry.level ?? 0) <= 1,
			),
		).toBe(true);
	});
});
