/**
 * Feats catalog normalization locks. Two feats with the same prerequisites
 * and benefits would be functionally interchangeable; this test catches that.
 */
import { describe, expect, it } from "vitest";
import { comprehensiveFeats } from "@/data/compendium/feats-comprehensive";

const stableStringify = (value: unknown): string => {
	if (value == null) return "";
	if (typeof value !== "object") return String(value).toLowerCase().trim();
	if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
	const entries = Object.entries(value as Record<string, unknown>).sort(
		([a], [b]) => a.localeCompare(b),
	);
	return `{${entries.map(([key, entry]) => `${key}:${stableStringify(entry)}`).join(",")}}`;
};

const fingerprint = (f: (typeof comprehensiveFeats)[number]): string => {
	const anyF = f as unknown as Record<string, unknown>;
	return stableStringify({
		prerequisites: anyF.prerequisites,
		benefits: anyF.benefits,
		effects: anyF.effects,
		mechanics: anyF.mechanics,
	});
};

describe("feats data normalization", () => {
	it("does not duplicate feat ids", () => {
		const ids = new Set<string>();
		for (const f of comprehensiveFeats) {
			expect(ids.has(f.id), `Duplicate feat id ${f.id}`).toBe(false);
			ids.add(f.id);
		}
	});

	it("does not duplicate feat names (case-insensitive)", () => {
		const names = new Set<string>();
		for (const f of comprehensiveFeats) {
			const key = f.name.toLowerCase();
			expect(names.has(key), `Duplicate feat name ${f.name}`).toBe(false);
			names.add(key);
		}
	});

	it("does not contain functionally identical feat clones", () => {
		const fingerprints = new Map<string, string[]>();
		for (const f of comprehensiveFeats) {
			const key = fingerprint(f);
			fingerprints.set(key, [...(fingerprints.get(key) ?? []), f.name]);
		}
		const duplicates = [...fingerprints.values()]
			.filter((names) => names.length > 1)
			.map((names) => names.join(" | "));
		expect(duplicates).toEqual([]);
	});
});
