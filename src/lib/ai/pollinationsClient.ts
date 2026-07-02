/**
 * Minimal keyless Pollinations text client (OpenAI-compatible endpoint).
 *
 * Replaces the `@pollinations_ai/sdk` npm package, which was unpublished from
 * the registry (fresh installs 404'd on it). Mirrors the server proxy's
 * keyless leg in api/ai.js: POST {baseUrl}/openai with {model, messages, …}.
 */

export interface PollinationsMessage {
	role: "system" | "user" | "assistant";
	content: string;
}

/** OpenAI-compatible response; some models also return a bare `text` field. */
export interface ChatResponseExt {
	text?: string;
	choices?: Array<{ message?: { content?: string } }>;
	usage?: {
		prompt_tokens?: number;
		completion_tokens?: number;
		total_tokens?: number;
	};
}

interface PollinationsConfig {
	apiKey?: string;
	baseUrl?: string;
}

let config: PollinationsConfig = {};

export function configure(next: PollinationsConfig): void {
	config = { ...config, ...next };
}

export interface PollinationsChatOptions {
	model?: string;
	temperature?: number;
	maxTokens?: number;
	signal?: AbortSignal;
}

export async function chat(
	messages: PollinationsMessage[],
	options: PollinationsChatOptions = {},
): Promise<ChatResponseExt> {
	const baseUrl = (config.baseUrl || "https://text.pollinations.ai").replace(
		/\/+$/,
		"",
	);
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
	};
	if (config.apiKey) headers.Authorization = `Bearer ${config.apiKey}`;

	const response = await fetch(`${baseUrl}/openai`, {
		method: "POST",
		headers,
		body: JSON.stringify({
			model: options.model || "openai",
			messages,
			...(options.temperature !== undefined
				? { temperature: options.temperature }
				: {}),
			...(options.maxTokens !== undefined
				? { max_tokens: options.maxTokens }
				: {}),
		}),
		signal: options.signal,
	});

	if (!response.ok) {
		const detail = (await response.text().catch(() => "")).slice(0, 200);
		throw new Error(`Pollinations ${response.status}: ${detail}`);
	}

	return (await response.json()) as ChatResponseExt;
}
