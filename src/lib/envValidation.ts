/**
 * Environment Variable Validation
 *
 * Validates required environment variables on app startup
 */

import { getRuntimeEnvValue } from "./runtimeEnv";

const REQUIRED_ENV_VARS = ["VITE_SUPABASE_URL"] as const;

const OPTIONAL_ENV_VARS = [
	"VITE_SENTRY_DSN",
	"VITE_APP_VERSION",
	"VITE_ANALYTICS_ENABLED",
	"VITE_PLAUSIBLE_DOMAIN",
	"VITE_POSTHOG_KEY",
	"VITE_POSTHOG_HOST",
] as const;

interface ValidationResult {
	valid: boolean;
	missing: string[];
	warnings: string[];
}

/**
 * Validate environment variables
 */
export function validateEnv(): ValidationResult {
	const missing: string[] = [];
	const warnings: string[] = [];

	// Check required vars
	for (const varName of REQUIRED_ENV_VARS) {
		const value = getRuntimeEnvValue(varName);
		if (!value || value.trim() === "") {
			missing.push(varName);
		}
	}
	const hasSupabaseKey = Boolean(
		getRuntimeEnvValue("VITE_SUPABASE_PUBLISHABLE_KEY") ||
			getRuntimeEnvValue("VITE_SUPABASE_ANON_KEY"),
	);
	if (!hasSupabaseKey) {
		missing.push("VITE_SUPABASE_PUBLISHABLE_KEY (or VITE_SUPABASE_ANON_KEY)");
	}

	// Check optional vars (warn if partially configured)
	const sentryVars = OPTIONAL_ENV_VARS.filter((v) =>
		v.startsWith("VITE_SENTRY_"),
	);
	const hasSomeSentryVars = sentryVars.some((v) => import.meta.env[v]);
	const hasAllSentryVars = sentryVars.every((v) => import.meta.env[v]);

	if (hasSomeSentryVars && !hasAllSentryVars) {
		warnings.push(
			"Sentry is partially configured. Some Sentry features may not work.",
		);
	}

	return {
		valid: missing.length === 0,
		missing,
		warnings,
	};
}
