import { describe, expect, it } from "vitest";
import { staticDataProvider } from "@/data/compendium/providers";

const isRecord = (value: unknown): value is Record<string, unknown> =>
	!!value && typeof value === "object" && !Array.isArray(value);

describe("compendium completeness (static packs)", () => {
	it("spells have structured mechanics fields", async () => {
		const spells = await staticDataProvider.getSpells("");

		for (const spell of spells) {
			expect(typeof spell.id).toBe("string");
			expect(typeof spell.name).toBe("string");
			expect(typeof spell.description).toBe("string");

			expect(isRecord(spell.activation)).toBe(true);
			expect(isRecord(spell.duration)).toBe(true);
			const hasRangeRecord = isRecord(spell.range);
			const hasRangeNumber = typeof spell.range === "number";
			expect(hasRangeRecord || hasRangeNumber).toBe(true);
			if (hasRangeRecord) {
				const range = spell.range as Record<string, unknown>;
				expect(typeof range.type).toBe("string");
			}
			expect(isRecord(spell.components)).toBe(true);
			expect(isRecord(spell.effects)).toBe(true);
			expect(isRecord(spell.mechanics)).toBe(true);
			expect(isRecord(spell.limitations)).toBe(true);

			const mechanics = spell.mechanics as Record<string, unknown>;
			const hasAttack = isRecord(mechanics.attack);
			const hasSave = isRecord(mechanics.saving_throw);
			const hasHealing = isRecord(mechanics.healing);
			expect(hasAttack || hasSave || hasHealing).toBe(true);

			expect(typeof spell.flavor).toBe("string");
		}
	});

	it("anomalies have complete statblock and embedded actions/traits", async () => {
		const anomalies = await staticDataProvider.getAnomalies("");

		for (const anomaly of anomalies) {
			expect(typeof anomaly.id).toBe("string");
			expect(typeof anomaly.name).toBe("string");
			expect(typeof anomaly.description).toBe("string");

			expect(typeof anomaly.armor_class).toBe("number");
			expect(typeof anomaly.hit_points_average).toBe("number");

			expect(typeof anomaly.str).toBe("number");
			expect(typeof anomaly.agi).toBe("number");
			expect(typeof anomaly.vit).toBe("number");
			expect(typeof anomaly.int).toBe("number");
			expect(typeof anomaly.sense).toBe("number");
			expect(typeof anomaly.pre).toBe("number");

			expect(Array.isArray(anomaly.Anomaly_actions)).toBe(true);
			expect((anomaly.Anomaly_actions || []).length).toBeGreaterThan(0);

			expect(Array.isArray(anomaly.Anomaly_traits)).toBe(true);
			expect((anomaly.Anomaly_traits || []).length).toBeGreaterThan(0);
		}
	});

	it("no duplicate IDs within any compendium category", async () => {
		const categories = [
			{ name: "anomalies", loader: () => staticDataProvider.getAnomalies("") },
			{ name: "spells", loader: () => staticDataProvider.getSpells("") },
			{ name: "jobs", loader: () => staticDataProvider.getJobs("") },
			{ name: "paths", loader: () => staticDataProvider.getPaths("") },
			{ name: "powers", loader: () => staticDataProvider.getPowers("") },
			{
				name: "techniques",
				loader: () => staticDataProvider.getTechniques(""),
			},
			{ name: "runes", loader: () => staticDataProvider.getRunes("") },
			{ name: "sigils", loader: () => staticDataProvider.getSigils("") },
			{
				name: "backgrounds",
				loader: () => staticDataProvider.getBackgrounds(""),
			},
			{ name: "regents", loader: () => staticDataProvider.getRegents("") },
			{ name: "feats", loader: () => staticDataProvider.getFeats("") },
			{ name: "skills", loader: () => staticDataProvider.getSkills("") },
			{ name: "relics", loader: () => staticDataProvider.getRelics("") },
			{ name: "items", loader: () => staticDataProvider.getItems("") },
			{ name: "artifacts", loader: () => staticDataProvider.getArtifacts("") },
			{ name: "locations", loader: () => staticDataProvider.getLocations("") },
			{
				name: "conditions",
				loader: () => staticDataProvider.getConditions(""),
			},
		];

		for (const { name, loader } of categories) {
			const entries = await loader();
			const ids = entries.map((e) => e.id);
			const uniqueIds = new Set(ids);
			expect(
				uniqueIds.size,
				`${name}: found ${ids.length - uniqueIds.size} duplicate IDs`,
			).toBe(ids.length);
		}
	});
});
