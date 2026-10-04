/**
 * Type surface for the Sovereign creation provider chain.
 */
export interface AiImage {
	mimeType: string;
	data: string;
}

export interface NormalizeImagesResult {
	images?: AiImage[];
	error?: string;
}

export function normalizeImages(raw: unknown): NormalizeImagesResult;

export interface RunProviderChainArgs {
	prompt: string;
	systemPrompt?: string;
	maxTokens?: number;
	provider?: string;
	model?: string;
	images?: AiImage[];
}

export type RunProviderChainResult =
	| {
			ok: true;
			text: string;
			model: string;
			usage: Record<string, unknown>;
			provider: string;
	  }
	| { ok: false; error: string };

export function runProviderChain(
	args: RunProviderChainArgs,
): Promise<RunProviderChainResult>;

export const MAX_IMAGES: number;
export const DEFAULT_GEMINI_MODELS: string[];
export const DEFAULT_OPENROUTER_MODELS: string[];
export const DEFAULT_OPENROUTER_VISION_MODELS: string[];
