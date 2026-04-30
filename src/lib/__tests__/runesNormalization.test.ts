import { describe, expect, it } from "vitest";
import { allRunes } from "@/data/compendium/runes";
import { RUNE_CROSS_CLASS_DESCRIPTION } from "@/lib/runeAutomation";

describe("runes data normalization", () => {
	it("does not expose top-level uses_per_rest or recharge fields", () => {
		for (const rune of allRunes) {
			expect(rune).not.toHaveProperty("uses_per_rest");
			expect(rune).not.toHaveProperty("recharge");
		}
	});

	it("does not expose mechanics.action_type — that field belongs to the taught ability", () => {
		for (const rune of allRunes) {
			const mechanics = (
				rune as unknown as { mechanics?: Record<string, unknown> }
			).mechanics;
			if (mechanics) {
				expect(mechanics).not.toHaveProperty("action_type");
			}
		}
	});

	it("teaches metadata is present, well-formed, and references a slug ref", () => {
		for (const rune of allRunes) {
			const teaches = (
				rune as unknown as {
					teaches?: { kind: string; ref: string };
				}
			).teaches;
			expect(teaches, `rune ${rune.id} is missing teaches`).toBeDefined();
			if (!teaches) continue;
			expect(["spell", "power", "technique"]).toContain(teaches.kind);
			expect(teaches.ref).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
		}
	});

	it("every Cross-Class Adaptation reference uses the canonical locked-formula sentence", () => {
		for (const rune of allRunes) {
			const description = rune.description ?? "";
			if (description.includes("Cross-Class Adaptation")) {
				expect(description).toContain(RUNE_CROSS_CLASS_DESCRIPTION);
			}
		}
	});
});
