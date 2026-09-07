import { describe, expect, it } from "vitest";
import { normalizeAuthError, validateNewPassword } from "./authErrors";

describe("normalizeAuthError", () => {
	it("shows explicit safe copy for a breached password", () => {
		const result = normalizeAuthError(
			{
				code: "weak_password",
				message: "Password rejected",
				weak_password: {
					reasons: ["This password was found in a known data breach"],
				},
			},
			"password-change",
		);

		expect(result.kind).toBe("breached-password");
		expect(result.field).toBe("password");
		expect(result.message).toContain("known data breach");
		expect(result.message).not.toContain("Password rejected");
	});

	it("normalizes an ordinary weak password without backend details", () => {
		const result = normalizeAuthError(
			{ code: "weak_password", message: "internal policy detail" },
			"sign-up",
		);
		expect(result).toMatchObject({
			kind: "weak-password",
			field: "password",
			retryable: false,
		});
		expect(result.message).toBe(
			"Choose a stronger password with at least 8 characters.",
		);
		expect(result.message).not.toContain("internal policy detail");
	});

	it.each([
		[{ status: 429, message: "backend detail" }],
		[{ code: "over_email_send_rate_limit" }],
		[{ code: "over_request_rate_limit" }],
	])("normalizes rate limits", (error) => {
		const result = normalizeAuthError(error, "reset-request");
		expect(result.kind).toBe("rate-limited");
		expect(result.retryable).toBe(true);
		expect(result.message).toBe(
			"Too many attempts. Wait a few minutes before trying again.",
		);
	});

	it.each([
		["reauthentication_needed", "reauthentication-required", false],
		["reauth_nonce_missing", "reauthentication-required", false],
		["reauthentication_not_valid", "invalid-reauthentication-code", true],
		["otp_expired", "expired-code", true],
	] as const)("maps %s to %s", (code, expectedKind, retryable) => {
		const result = normalizeAuthError({ code }, "password-change");
		expect(result.kind).toBe(expectedKind);
		expect(result.field).toBe("nonce");
		expect(result.retryable).toBe(retryable);
	});

	it.each([
		{ code: "user_not_found", message: "No user for that address" },
		{ code: "user_already_exists", message: "Address is registered" },
		{ message: "That email is not registered" },
	])("does not enumerate reset-request accounts", (error) => {
		const result = normalizeAuthError(error, "reset-request");
		expect(result.kind).toBe("unknown");
		expect(result.message).toBe(
			"Unable to send a recovery email right now. Please try again later.",
		);
		expect(result.message.toLowerCase()).not.toMatch(/user|registered|address/);
	});

	it("uses operation-specific safe copy for empty and numeric errors", () => {
		for (const error of [null, { message: "" }, { message: "500" }]) {
			const result = normalizeAuthError(error, "sign-in");
			expect(result.kind).toBe("unknown");
			expect(result.message).toBe(
				"Unable to sign in. Check your credentials and try again.",
			);
		}
	});
});

describe("validateNewPassword", () => {
	it("enforces length and confirmation without retaining sensitive input", () => {
		expect(validateNewPassword("short", "short")).toEqual({
			valid: false,
			message: "Password must be at least 8 characters.",
		});
		expect(validateNewPassword("long-enough", "different")).toEqual({
			valid: false,
			message: "Passwords do not match.",
		});
		expect(validateNewPassword("long-enough", "long-enough")).toEqual({
			valid: true,
		});
	});
});
