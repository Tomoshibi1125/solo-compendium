export type AuthOperation =
	| "sign-in"
	| "sign-up"
	| "reset-request"
	| "reset-complete"
	| "resend-confirmation"
	| "reauthenticate"
	| "password-change"
	| "profile-update"
	| "callback";

export type AuthErrorKind =
	| "invalid-credentials"
	| "email-unconfirmed"
	| "weak-password"
	| "breached-password"
	| "same-password"
	| "reauthentication-required"
	| "invalid-reauthentication-code"
	| "expired-code"
	| "rate-limited"
	| "session-missing"
	| "account-unavailable"
	| "configuration"
	| "unknown";

export interface NormalizedAuthError {
	kind: AuthErrorKind;
	message: string;
	code?: string;
	status?: number;
	retryable: boolean;
	field: "email" | "password" | "nonce" | "form";
}

export type PasswordValidationResult =
	| { valid: true }
	| { valid: false; message: string };

const FALLBACK_MESSAGES: Record<AuthOperation, string> = {
	"sign-in": "Unable to sign in. Check your credentials and try again.",
	"sign-up": "Unable to create the account right now. Please try again.",
	"reset-request":
		"Unable to send a recovery email right now. Please try again later.",
	"reset-complete":
		"Unable to update your password. Request a new recovery link and try again.",
	"resend-confirmation":
		"Unable to resend the confirmation email right now. Please try again later.",
	reauthenticate:
		"Unable to send a verification code. Use password recovery if this continues.",
	"password-change":
		"Unable to update your password. Request a new verification code and try again.",
	"profile-update": "Unable to update your profile. Please try again.",
	callback: "Authentication could not be completed. Please sign in again.",
};

const getRecord = (value: unknown): Record<string, unknown> | null =>
	typeof value === "object" && value !== null
		? (value as Record<string, unknown>)
		: null;

const getString = (
	record: Record<string, unknown> | null,
	key: string,
): string | undefined => {
	const value = record?.[key];
	return typeof value === "string" && value.trim() ? value.trim() : undefined;
};

const getStatus = (
	record: Record<string, unknown> | null,
): number | undefined => {
	const value = record?.status ?? record?.statusCode;
	if (typeof value === "number" && Number.isFinite(value)) return value;
	if (typeof value === "string" && /^\d{3}$/.test(value)) return Number(value);
	return undefined;
};

const normalized = (
	kind: AuthErrorKind,
	message: string,
	options: {
		code?: string;
		status?: number;
		retryable?: boolean;
		field?: NormalizedAuthError["field"];
	} = {},
): NormalizedAuthError => ({
	kind,
	message,
	code: options.code,
	status: options.status,
	retryable: options.retryable ?? false,
	field: options.field ?? "form",
});

const collectWeakPasswordDetails = (
	record: Record<string, unknown> | null,
): string => {
	const weakPassword =
		getRecord(record?.weak_password) ?? getRecord(record?.weakPassword);
	const reasons = weakPassword?.reasons;
	const reasonText = Array.isArray(reasons)
		? reasons
				.filter((reason): reason is string => typeof reason === "string")
				.join(" ")
		: "";
	return `${getString(record, "message") ?? ""} ${reasonText}`.toLowerCase();
};

/**
 * Convert Supabase Auth failures into stable, user-safe UI messages. Backend
 * messages are used only for classification and are never returned verbatim.
 */
export const normalizeAuthError = (
	error: unknown,
	operation: AuthOperation,
): NormalizedAuthError => {
	const record = getRecord(error);
	const code = getString(record, "code")?.toLowerCase();
	const status = getStatus(record);
	const rawMessage =
		getString(record, "message") ??
		(typeof error === "string"
			? error
			: error instanceof Error
				? error.message
				: "");
	const message = rawMessage.toLowerCase();
	const details = collectWeakPasswordDetails(record);
	const metadata = { code, status };

	// Password-reset requests must not disclose whether an address is registered.
	if (
		operation === "reset-request" &&
		(code === "user_not_found" ||
			code === "user_already_exists" ||
			message.includes("user not found") ||
			message.includes("not registered"))
	) {
		return normalized("unknown", FALLBACK_MESSAGES[operation], {
			...metadata,
			retryable: true,
			field: "email",
		});
	}

	if (
		code === "invalid_credentials" ||
		message.includes("invalid login credentials")
	) {
		return normalized(
			"invalid-credentials",
			"Email or password is incorrect.",
			{ ...metadata, field: "form" },
		);
	}
	if (
		code === "email_not_confirmed" ||
		message.includes("email not confirmed")
	) {
		return normalized(
			"email-unconfirmed",
			"Confirm your email before signing in.",
			{ ...metadata, field: "email" },
		);
	}
	if (
		code === "weak_password" ||
		message.includes("weak password") ||
		message.includes("password should be")
	) {
		const isBreached = /breach|compromis|pwn|leak|known password/.test(details);
		return normalized(
			isBreached ? "breached-password" : "weak-password",
			isBreached
				? "This password has appeared in a known data breach. Choose a different password."
				: "Choose a stronger password with at least 8 characters.",
			{ ...metadata, field: "password" },
		);
	}
	if (code === "same_password" || message.includes("same password")) {
		return normalized(
			"same-password",
			"Your new password must be different from your current password.",
			{ ...metadata, field: "password" },
		);
	}
	if (code === "reauthentication_needed" || code === "reauth_nonce_missing") {
		return normalized(
			"reauthentication-required",
			"Request a verification code before changing your password.",
			{ ...metadata, field: "nonce" },
		);
	}
	if (
		code === "reauthentication_not_valid" ||
		message.includes("reauthentication code") ||
		message.includes("reauthentication nonce")
	) {
		return normalized(
			"invalid-reauthentication-code",
			"That verification code is invalid. Request a new code and try again.",
			{ ...metadata, field: "nonce", retryable: true },
		);
	}
	if (code === "otp_expired" || message.includes("otp expired")) {
		return normalized(
			"expired-code",
			"That verification code has expired. Request a new code.",
			{ ...metadata, field: "nonce", retryable: true },
		);
	}
	if (
		status === 429 ||
		code === "over_request_rate_limit" ||
		code === "over_email_send_rate_limit" ||
		code === "request_timeout" ||
		message.includes("rate limit") ||
		message.includes("too many requests")
	) {
		return normalized(
			"rate-limited",
			"Too many attempts. Wait a few minutes before trying again.",
			{ ...metadata, retryable: true },
		);
	}
	if (
		code === "session_not_found" ||
		code === "session_expired" ||
		message.includes("auth session missing") ||
		message.includes("session expired")
	) {
		return normalized(
			"session-missing",
			"Your session has expired. Sign in again to continue.",
			{ ...metadata },
		);
	}
	if (
		code === "user_banned" ||
		code === "user_not_found" ||
		message.includes("user is banned") ||
		message.includes("account has been suspended")
	) {
		return normalized(
			"account-unavailable",
			"This account is unavailable. Contact an account administrator.",
			{ ...metadata },
		);
	}
	if (
		code === "signup_disabled" ||
		code === "email_provider_disabled" ||
		code === "config" ||
		message.includes("backend is not configured")
	) {
		return normalized(
			"configuration",
			"Authentication is not available in this environment.",
			{ ...metadata },
		);
	}
	if (
		code === "user_already_exists" ||
		message.includes("already registered")
	) {
		return normalized(
			"account-unavailable",
			"An account with this email already exists. Try signing in instead.",
			{ ...metadata, field: "email" },
		);
	}

	return normalized("unknown", FALLBACK_MESSAGES[operation], {
		...metadata,
		retryable: true,
	});
};

export const validateNewPassword = (
	password: string,
	confirmation?: string,
): PasswordValidationResult => {
	if (password.length < 8) {
		return {
			valid: false,
			message: "Password must be at least 8 characters.",
		};
	}
	if (password.length > 128) {
		return {
			valid: false,
			message: "Password must be 128 characters or fewer.",
		};
	}
	if (confirmation !== undefined && password !== confirmation) {
		return { valid: false, message: "Passwords do not match." };
	}
	return { valid: true };
};
