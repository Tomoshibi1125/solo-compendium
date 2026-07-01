import { describe, expect, it } from "vitest";
import { AppError } from "@/lib/appError";
import {
	assertCharacterCreatable,
	MAX_CHARACTERS_PER_USER,
} from "@/lib/characterLimits";

const named = (...names: string[]) => names.map((name) => ({ name }));

describe("assertCharacterCreatable", () => {
	it("allows creation under the per-user limit with a unique name", () => {
		expect(() =>
			assertCharacterCreatable(named("Aria"), "Borin"),
		).not.toThrow();
	});

	it("allows creation when the user has no characters yet", () => {
		expect(() => assertCharacterCreatable([], "First Hero")).not.toThrow();
	});

	it("rejects a 7th character (at the limit) with CHARACTER_LIMIT", () => {
		const six = named("A", "B", "C", "D", "E", "F");
		expect(six).toHaveLength(MAX_CHARACTERS_PER_USER);
		try {
			assertCharacterCreatable(six, "G");
			throw new Error("expected assertCharacterCreatable to throw");
		} catch (err) {
			expect(err).toBeInstanceOf(AppError);
			expect((err as AppError).code).toBe("CHARACTER_LIMIT");
		}
	});

	it("rejects a duplicate name case-insensitively with DUPLICATE_CHARACTER_NAME", () => {
		try {
			assertCharacterCreatable(named("Shadow"), "  shadow ");
			throw new Error("expected assertCharacterCreatable to throw");
		} catch (err) {
			expect(err).toBeInstanceOf(AppError);
			expect((err as AppError).code).toBe("DUPLICATE_CHARACTER_NAME");
		}
	});

	it("allows a distinct name even when others exist", () => {
		expect(() =>
			assertCharacterCreatable(named("Shadow", "Ember"), "Frost"),
		).not.toThrow();
	});

	it("treats null existing names as non-colliding", () => {
		expect(() =>
			assertCharacterCreatable([{ name: null }], "Named One"),
		).not.toThrow();
	});
});
