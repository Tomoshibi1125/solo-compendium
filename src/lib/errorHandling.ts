/**
 * Error handling utilities
 * Provides consistent error handling patterns across the application
 */

import type { PostgrestError } from "@supabase/supabase-js";
import { logger } from "./logger";
import { captureException, captureMessage } from "./sentry";

interface ErrorInfo {
	message: string;
	code?: string;
	details?: string;
	hint?: string;
}

/**
 * Extract user-friendly error message from various error types
 */
export function getErrorMessage(error: unknown): string {
	if (error instanceof Error) {
		return error.message;
	}

	if (typeof error === "string") {
		return error;
	}

	// Handle Supabase PostgrestError
	const pgError = error as PostgrestError;
	if (pgError?.message) {
		return pgError.message;
	}

	if (pgError?.code) {
		// Map common Supabase error codes to user-friendly messages
		const errorMessages: Record<string, string> = {
			PGRST116: "Item not found",
			"23505": "This item already exists",
			"23503": "Cannot delete: item is in use",
			"42501": "You do not have permission to perform this action",
			PGRST301: "Multiple rows returned when single row expected",
		};

		return (
			errorMessages[pgError.code] || pgError.message || "An error occurred"
		);
	}

	return "An unexpected error occurred";
}

/**
 * Extract detailed error information
 */
export function getErrorInfo(error: unknown): ErrorInfo {
	const pgError = error as PostgrestError;

	return {
		message: getErrorMessage(error),
		code: pgError?.code,
		details: pgError?.details,
		hint: pgError?.hint,
	};
}

/**
 * Check if error is a not found error
 */
export function isNotFoundError(error: unknown): boolean {
	const pgError = error as PostgrestError;
	return pgError?.code === "PGRST116";
}

/**
 * Log error with context
 */
export function logErrorWithContext(
	error: unknown,
	context: string,
	additionalInfo?: Record<string, unknown>,
): void {
	const errorInfo = getErrorInfo(error);

	logger.error(`[${context}]`, {
		error: errorInfo.message,
		code: errorInfo.code,
		details: errorInfo.details,
		hint: errorInfo.hint,
		...additionalInfo,
	});

	// Send to Sentry if it's an Error instance
	if (error instanceof Error) {
		captureException(error, {
			context,
			...errorInfo,
			...additionalInfo,
		});
	} else {
		// For non-Error types, send as message
		captureMessage(`[${context}] ${errorInfo.message}`, "error", {
			...errorInfo,
			...additionalInfo,
		});
	}
}
