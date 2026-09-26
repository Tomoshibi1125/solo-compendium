/**
 * Feature flags for non-AI product behavior.
 *
 * A1 removed general AI/art-generation feature flags. Provider access is no
 * longer client-toggleable; the only provider-backed feature is the dedicated
 * server-owned Sovereign creation endpoint.
 */

interface FeatureFlags {
	dailyQuestEnabled: boolean;
}

const DEFAULT_FLAGS: FeatureFlags = {
	dailyQuestEnabled: true,
};

const FLAG_ENV_KEYS: Record<keyof FeatureFlags, string> = {
	dailyQuestEnabled: "VITE_FEATURE_DAILY_QUESTS",
};

export function getFeatureFlag(flag: keyof FeatureFlags): boolean {
	const envKey = FLAG_ENV_KEYS[flag];
	const envValue = import.meta.env[envKey];
	if (envValue !== undefined) {
		return envValue === "true" || envValue === "1";
	}
	return DEFAULT_FLAGS[flag];
}

function getAllFeatureFlags(): FeatureFlags {
	return {
		dailyQuestEnabled: getFeatureFlag("dailyQuestEnabled"),
	};
}

export function useFeatureFlags(): FeatureFlags {
	return getAllFeatureFlags();
}

export function useFeatureFlag(flag: keyof FeatureFlags): boolean {
	return getFeatureFlag(flag);
}
