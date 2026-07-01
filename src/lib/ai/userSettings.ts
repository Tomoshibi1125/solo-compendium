import type { AIService } from "./types";

export type AIUserProvider = "free" | "custom";

/**
 * Which free model the embedded AI should prefer. "auto" lets the server pick
 * the best-in-class free model and fall back automatically; the others pin a
 * specific provider first (still falling back if it's rate-limited or blocked).
 */
export type AIFreeModel = "auto" | "gemini" | "openrouter" | "pollinations";

export interface AIUserSettings {
	provider: AIUserProvider;
	apiKey: string;
	apiBase: string;
	model: string;
	/** Preferred free provider when provider === "free". */
	freeModel: AIFreeModel;
	/** Optional explicit model id override for the chosen free provider. */
	freeModelId: string;
}

const STORAGE_KEY = "solo-compendium-ai-settings";
const DEFAULT_CUSTOM_BASE = "https://api.openai.com/v1";
const DEFAULT_CUSTOM_MODEL = "gpt-4o-mini";

export const DEFAULT_AI_USER_SETTINGS: AIUserSettings = {
	provider: "free",
	apiKey: "",
	apiBase: DEFAULT_CUSTOM_BASE,
	model: DEFAULT_CUSTOM_MODEL,
	freeModel: "auto",
	freeModelId: "",
};

export function loadAIUserSettings(): AIUserSettings {
	if (typeof window === "undefined") {
		return { ...DEFAULT_AI_USER_SETTINGS };
	}

	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (!raw) {
			return { ...DEFAULT_AI_USER_SETTINGS };
		}
		const parsed = JSON.parse(raw) as Partial<AIUserSettings>;
		return {
			...DEFAULT_AI_USER_SETTINGS,
			...parsed,
		};
	} catch {
		return { ...DEFAULT_AI_USER_SETTINGS };
	}
}

export function saveAIUserSettings(settings: AIUserSettings): void {
	if (typeof window === "undefined") {
		return;
	}
	try {
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
	} catch {
		// Ignore storage failures (private mode, storage quota, etc.)
	}
}

export function buildCustomService(settings: AIUserSettings): AIService {
	return {
		id: "user-custom",
		name: "User API (OpenAI-Compatible)",
		type: "custom",
		capabilities: [
			"enhance-prompt",
			"analyze-image",
			"generate-tags",
			"detect-mood",
			"suggest-style",
			"filter-content",
			"create-variation",
			"generate-content",
		],
		apiKey: settings.apiKey,
		endpoint: settings.apiBase,
		model: settings.model,
		maxTokens: 2048,
		temperature: 0.7,
		enabled: true,
	};
}
