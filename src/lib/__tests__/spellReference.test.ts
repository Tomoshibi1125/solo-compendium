import { describe, expect, it } from "vitest";
import { normalizeSpellReference } from "@/lib/spellReference";

describe("normalizeSpellReference", () => {
	it("preserves canonical spell IDs", async () => {
		await expect(
			normalizeSpellReference({ id: "spell-d-1", name: "Stale Name" }),
		).resolves.toEqual({ spell_id: "spell-d-1", matchedBy: "id" });
	});

	it("resolves legacy name-only spell rows to canonical IDs", async () => {
		await expect(
			normalizeSpellReference({ name: "Chill Lance" }),
		).resolves.toEqual({ spell_id: "spell-d-1", matchedBy: "name" });
	});

	it("repairs stale spell IDs when the name still resolves canonically", async () => {
		await expect(
			normalizeSpellReference({
				id: "stale-imported-spell-id",
				name: "Chill Lance",
			}),
		).resolves.toEqual({ spell_id: "spell-d-1", matchedBy: "name" });
	});

	it("nulls unknown spell IDs for custom or unresolved spell rows", async () => {
		await expect(
			normalizeSpellReference({
				id: "custom-spell-id-from-another-system",
				name: "Homebrew Eclipse Burst",
			}),
		).resolves.toEqual({ spell_id: null, matchedBy: "none" });
	});
});
