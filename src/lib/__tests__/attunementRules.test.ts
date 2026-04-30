import { describe, expect, it } from "vitest";
import {
	type AttunableItemRef,
	canAttuneItem,
	canUnattuneItem,
	MAX_ATTUNEMENT_SLOTS,
} from "@/lib/attunementRules";

const makeItem = (
	overrides: Partial<AttunableItemRef> = {},
): AttunableItemRef => ({
	id: overrides.id ?? "item-1",
	name: overrides.name ?? "Cloak of Protection",
	requiresAttunement: overrides.requiresAttunement ?? true,
	isAttuned: overrides.isAttuned ?? false,
});

describe("attunementRules", () => {
	describe("canAttuneItem", () => {
		it("rejects items that don't require attunement", () => {
			const item = makeItem({
				requiresAttunement: false,
				name: "Mundane Sword",
			});
			const result = canAttuneItem(item, 0);
			expect(result.allowed).toBe(false);
			expect(result.reason).toContain("does not require attunement");
		});

		it("rejects items already attuned", () => {
			const item = makeItem({ isAttuned: true, name: "Ring of Protection" });
			const result = canAttuneItem(item, 1);
			expect(result.allowed).toBe(false);
			expect(result.reason).toContain("already attuned");
		});

		it(`rejects when slot limit is reached (${MAX_ATTUNEMENT_SLOTS}/${MAX_ATTUNEMENT_SLOTS})`, () => {
			const item = makeItem();
			const result = canAttuneItem(item, MAX_ATTUNEMENT_SLOTS);
			expect(result.allowed).toBe(false);
			expect(result.reason).toContain(
				`${MAX_ATTUNEMENT_SLOTS}/${MAX_ATTUNEMENT_SLOTS}`,
			);
		});

		it("allows attunement when below the slot limit", () => {
			const item = makeItem();
			const result = canAttuneItem(item, MAX_ATTUNEMENT_SLOTS - 1);
			expect(result.allowed).toBe(true);
			expect(result.reason).toContain("Can attune");
		});

		it("allows attunement at slot 0 (first item)", () => {
			const item = makeItem();
			const result = canAttuneItem(item, 0);
			expect(result.allowed).toBe(true);
		});

		it("rejects beyond limit even by 1", () => {
			const item = makeItem();
			const result = canAttuneItem(item, MAX_ATTUNEMENT_SLOTS + 1);
			expect(result.allowed).toBe(false);
		});
	});

	describe("canUnattuneItem", () => {
		it("rejects items that aren't attuned", () => {
			const item = makeItem({ isAttuned: false });
			const result = canUnattuneItem(item);
			expect(result.allowed).toBe(false);
			expect(result.reason).toContain("not attuned");
		});

		it("allows unattunement when attuned", () => {
			const item = makeItem({ isAttuned: true });
			const result = canUnattuneItem(item);
			expect(result.allowed).toBe(true);
		});
	});

	describe("MAX_ATTUNEMENT_SLOTS constant", () => {
		it("defaults to the RA homebrew baseline of 6", () => {
			// Locked-in expectation — bumping this is a deliberate design change.
			expect(MAX_ATTUNEMENT_SLOTS).toBe(6);
		});
	});
});
