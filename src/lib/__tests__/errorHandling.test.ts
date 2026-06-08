import { describe, expect, it } from "vitest";
import { getErrorInfo, getErrorMessage } from "@/lib/errorHandling";

/**
 * Regression guard for the character-creation "An unknown error occurred"
 * masking bug. A Supabase `PostgrestError` is a plain object (NOT an
 * `instanceof Error`), so the old `error instanceof Error ? error.message :
 * "unknown"` toast pattern swallowed the real Postgres reason. CharacterNew /
 * QuickAscendantWizard now route through `getErrorMessage` / `getErrorInfo`,
 * which must always surface the underlying message + code.
 */
describe("error surfacing for Supabase PostgrestError (character creation)", () => {
	// Mirrors a real @supabase/supabase-js PostgrestError shape (plain object).
	const fkViolation = {
		message:
			'insert or update on table "characters" violates foreign key constraint "characters_user_id_fkey"',
		code: "23503",
		details: 'Key (user_id)=(abc) is not present in table "profiles".',
		hint: "",
	};

	it("does not mask a PostgrestError as an unknown/unexpected error", () => {
		const message = getErrorMessage(fkViolation);
		expect(message).toBe(fkViolation.message);
		expect(message).not.toMatch(/unknown|unexpected/i);
	});

	it("surfaces the Postgres code/details via getErrorInfo", () => {
		const info = getErrorInfo(fkViolation);
		expect(info.code).toBe("23503");
		expect(info.message).toBe(fkViolation.message);
		expect(info.details).toContain("profiles");
	});

	it("returns the raw message for missing-column (42703) migration drift", () => {
		const missingColumn = {
			message: 'column "job_id" of relation "characters" does not exist',
			code: "42703",
		};
		expect(getErrorMessage(missingColumn)).toBe(missingColumn.message);
		expect(getErrorInfo(missingColumn).code).toBe("42703");
	});

	it("still surfaces a code-mapped message when the error carries no message", () => {
		expect(getErrorMessage({ code: "42501" })).toMatch(/permission/i);
		expect(getErrorInfo({ code: "42501" }).code).toBe("42501");
	});

	it("reproduces the unmasked create-flow toast contract (message + code)", () => {
		// Mirrors describeError() in CharacterNew / QuickAscendantWizard.
		const info = getErrorInfo(fkViolation);
		const base = getErrorMessage(fkViolation) || "fallback";
		const toast = info.code ? `${base} (code ${info.code})` : base;
		expect(toast).toContain("foreign key");
		expect(toast).toContain("(code 23503)");
	});
});
