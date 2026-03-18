/**
 * AI Service
 * Handles AI integrations for audio and art enhancement
 */

import { AppError } from "@/lib/appError";
import type {
	AIConfiguration,
	AIRequest,
	AIResponse,
	AIService,
	AudioAnalysis,
	ImageAnalysis,
	PromptEnhancement,
} from "./types";
import {
	DEFAULT_AI_CONFIG,
	DEFAULT_AI_SERVICES,
	getAIServiceById,
} from "./types";
import { buildCustomService, loadAIUserSettings } from "./userSettings";

const FREE_AI_FALLBACK_ENDPOINT = "https://text.pollinations.ai";
const OLLAMA_FALLBACK_ENDPOINT = "http://localhost:11434/api/generate";
const CUSTOM_AI_FALLBACK_ENDPOINT = "https://api.openai.com/v1";
const CUSTOM_AI_FALLBACK_MODEL = "gpt-4o-mini";
const REQUEST_TIMEOUT_MS = 15000;
const OLLAMA_TAGS_TIMEOUT_MS = 2500;
const OLLAMA_MODEL_PRIORITY = [
	"qwen2.5:14b-instruct",
	"qwen2.5:7b-instruct",
	"llama3.1:8b-instruct",
	"llama3.1:8b",
	"mistral:7b-instruct",
	"mixtral:8x7b",
];

export class AIServiceManager {
	private config: AIConfiguration;
	private cache: Map<string, AIResponse> = new Map();
	private requestCount: number = 0;
	private lastResetTime: number = Date.now();

	constructor(config: Partial<AIConfiguration> = {}) {
		this.config = {
			...DEFAULT_AI_CONFIG,
			...config,
			services: config.services || DEFAULT_AI_SERVICES,
		};
	}

	/**
	 * Process an AI request
	 */
	async processRequest(request: AIRequest): Promise<AIResponse> {
		// Validate request
		const errors = this.validateRequest(request);
		if (errors.length > 0) {
			return {
				success: false,
				error: errors.join("; "),
			};
		}

		// Check rate limiting
		if (this.isRateLimited()) {
			return {
				success: false,
				error: "Rate limit exceeded",
			};
		}

		// Check cache
		const cacheKey = this.getCacheKey(request);
		if (this.config.cacheResults && this.cache.has(cacheKey)) {
			const cached = this.cache.get(cacheKey);
			if (cached) {
				return cached;
			}
		}

		// Get service
		const service = getAIServiceById(request.service, this.config.services);
		if (!service) {
			return {
				success: false,
				error: `AI service not found: ${request.service}`,
			};
		}

		try {
			let response = await this.callService(service, request);

			if (!response.success) {
				const fallbacks = this.getFallbackServices(service.id, request.type);
				const fallbackErrors: string[] = [];

				if (response.error) {
					fallbackErrors.push(`${service.name}: ${response.error}`);
				}

				for (const fallbackService of fallbacks) {
					const fallbackResponse = await this.callService(
						fallbackService,
						request,
					);
					if (fallbackResponse.success) {
						response = fallbackResponse;
						break;
					}

					if (fallbackResponse.error) {
						fallbackErrors.push(
							`${fallbackService.name}: ${fallbackResponse.error}`,
						);
					}
				}

				if (!response.success && fallbackErrors.length > 0) {
					response = {
						success: false,
						error: fallbackErrors.join(" | "),
					};
				}
			}

			const normalized = this.normalizeResponse(request, response);

			// Cache result
			if (this.config.cacheResults && normalized.success) {
				this.cache.set(cacheKey, normalized);
			}

			return normalized;
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "AI service error",
			};
		}
	}

	/**
	 * Enhance a prompt for better art generation
	 */
	async enhancePrompt(
		originalPrompt: string,
		context?: Record<string, unknown>,
	): Promise<PromptEnhancement> {
		const request: AIRequest = {
			service: this.config.defaultService,
			type: "enhance-prompt",
			input: originalPrompt,
			context: {
				...context,
				style: "dark manhwa anime cinematic fantasy, System Ascendant style",
				mood: "dramatic, high contrast, detailed",
			},
		};

		const response = await this.processRequest(request);

		if (!response.success) {
			throw new AppError(
				"Failed to enhance prompt",
				"AI_ERROR",
				response.error,
			);
		}

		return response.data as PromptEnhancement;
	}

	/**
	 * Analyze an image for content and style
	 */
	async analyzeImage(imageUrl: string): Promise<ImageAnalysis> {
		const request: AIRequest = {
			service: this.config.defaultService,
			type: "analyze-image",
			input: imageUrl,
			options: {
				max_size: 1024,
				detail: "high",
			},
		};

		const response = await this.processRequest(request);

		if (!response.success) {
			throw new AppError("Failed to analyze image", "AI_ERROR", response.error);
		}

		return response.data as ImageAnalysis;
	}

	/**
	 * Analyze audio for mood and characteristics
	 */
	async analyzeAudio(audioFile: File): Promise<AudioAnalysis> {
		const audioFeatures = await this.extractAudioFeatures(audioFile);
		const moodHint = this.moodFromEnergy(audioFeatures.energy);
		const request: AIRequest = {
			service: this.config.defaultService,
			type: "analyze-audio",
			input: `Audio file "${audioFile.name}" (${audioFile.type || "unknown type"}, ${audioFile.size} bytes). Duration: ${audioFeatures.duration.toFixed(1)}s. RMS: ${audioFeatures.rms?.toFixed(4) ?? "n/a"}.`,
			context: {
				filename: audioFile.name,
				mimeType: audioFile.type,
				sizeBytes: audioFile.size,
				mood: moodHint,
				audioFeatures,
			},
			options: {
				analysis_type: "mood_and_characteristics",
			},
		};

		const response = await this.processRequest(request);

		if (!response.success) {
			throw new AppError("Failed to analyze audio", "AI_ERROR", response.error);
		}

		const analysis = response.data as AudioAnalysis;
		return {
			...analysis,
			mood: analysis.mood || moodHint,
			energy:
				typeof analysis.energy === "number"
					? analysis.energy
					: audioFeatures.energy,
			duration: analysis.duration || audioFeatures.duration,
			loudness: analysis.loudness ?? audioFeatures.loudness ?? undefined,
			instruments: analysis.instruments || [],
			tags: analysis.tags || [],
			description:
				analysis.description ||
				`Audio analysis completed for ${audioFile.name}.`,
		};
	}

	/**
	 * Generate tags for content
	 */
	async generateTags(
		content: string,
		type: "audio" | "image" | "text",
	): Promise<string[]> {
		const request: AIRequest = {
			service: this.config.defaultService,
			type: "generate-tags",
			input: content,
			context: {
				content_type: type,
				style: "dark manhwa anime cinematic fantasy, System Ascendant",
			},
		};

		const response = await this.processRequest(request);

		if (!response.success) {
			throw new AppError("Failed to generate tags", "AI_ERROR", response.error);
		}

		return response.data.tags || [];
	}

	/**
	 * Detect mood from content
	 */
	async detectMood(
		content: string,
		type: "audio" | "image" | "text",
	): Promise<string> {
		const request: AIRequest = {
			service: this.config.defaultService,
			type: "detect-mood",
			input: content,
			context: {
				content_type: type,
				style: "dark manhwa anime cinematic fantasy",
			},
		};

		const response = await this.processRequest(request);

		if (!response.success) {
			throw new AppError("Failed to detect mood", "AI_ERROR", response.error);
		}

		return response.data.mood || "neutral";
	}

	/**
	 * Suggest style variations
	 */
	async suggestStyleVariations(baseStyle: string): Promise<string[]> {
		const request: AIRequest = {
			service: this.config.defaultService,
			type: "suggest-style",
			input: baseStyle,
			context: {
				base_style: baseStyle,
				variations: [
					"darker",
					"lighter",
					"more_dramatic",
					"more_mysterious",
					"more_heroic",
				],
				universe: "System Ascendant",
			},
		};

		const response = await this.processRequest(request);

		if (!response.success) {
			throw new AppError(
				"Failed to suggest style variations",
				"AI_ERROR",
				response.error,
			);
		}

		return response.data.variations || [];
	}

	/**
	 * Filter content for appropriateness
	 */
	async filterContent(content: string): Promise<{
		isAppropriate: boolean;
		issues: string[];
		suggestions: string[];
	}> {
		const request: AIRequest = {
			service: this.config.defaultService,
			type: "filter-content",
			input: content,
			context: {
				audience: "general_audience",
				platform: "tabletop_rpg",
				style: "dark_fantasy",
			},
		};

		const response = await this.processRequest(request);

		if (!response.success) {
			throw new AppError(
				"Failed to filter content",
				"AI_ERROR",
				response.error,
			);
		}

		return response.data;
	}

	/**
	 * Create variations of existing content
	 */
	async createVariation(
		originalContent: string,
		variationType: string,
	): Promise<string> {
		const request: AIRequest = {
			service: this.config.defaultService,
			type: "create-variation",
			input: originalContent,
			context: {
				variation_type: variationType,
				style: "dark manhwa anime cinematic fantasy, System Ascendant",
				preserve_core_elements: true,
			},
		};

		const response = await this.processRequest(request);

		if (!response.success) {
			throw new AppError(
				"Failed to create variation",
				"AI_ERROR",
				response.error,
			);
		}

		return response.data.variation || originalContent;
	}

	// Private methods
	private normalizeResponse(
		request: AIRequest,
		response: AIResponse,
	): AIResponse {
		if (!response.success) {
			return response;
		}

		if (
			request.type === "generate-content" &&
			typeof response.data === "string"
		) {
			return response;
		}

		let normalizedData = response.data;
		if (typeof normalizedData === "string") {
			const parsed = this.parseJsonResponse(normalizedData);
			if (parsed) {
				normalizedData = parsed;
			}
		}

		if (
			typeof normalizedData === "string" ||
			normalizedData === null ||
			normalizedData === undefined
		) {
			normalizedData = this.buildFallbackData(
				request,
				typeof response.data === "string" ? response.data : "",
			);
		}

		return {
			...response,
			data: normalizedData,
		};
	}

	private parseJsonResponse(text: string): unknown | null {
		const trimmed = text.trim();
		const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
		const candidate = fenced ? fenced[1].trim() : trimmed;

		const objectStart = candidate.indexOf("{");
		const objectEnd = candidate.lastIndexOf("}");
		if (objectStart !== -1 && objectEnd !== -1 && objectEnd > objectStart) {
			const slice = candidate.slice(objectStart, objectEnd + 1);
			try {
				return JSON.parse(slice);
			} catch {
				return null;
			}
		}

		const arrayStart = candidate.indexOf("[");
		const arrayEnd = candidate.lastIndexOf("]");
		if (arrayStart !== -1 && arrayEnd !== -1 && arrayEnd > arrayStart) {
			const slice = candidate.slice(arrayStart, arrayEnd + 1);
			try {
				return JSON.parse(slice);
			} catch {
				return null;
			}
		}

		return null;
	}

	private buildFallbackData(request: AIRequest, rawText: string) {
		const inputText =
			typeof request.input === "string"
				? request.input
				: JSON.stringify(request.input ?? "");
		const safeText = rawText?.trim() || inputText.trim();
		const styleHint = request.context?.style || "System Ascendant";
		const moodHint = request.context?.mood || "dramatic";

		switch (request.type) {
			case "enhance-prompt":
				return {
					original: inputText,
					enhanced:
						safeText || `${inputText}\nStyle: ${styleHint}. Mood: ${moodHint}.`,
					additions: [],
					improvements: [],
					style: styleHint,
					mood: moodHint,
					technical: {
						weight: "1.0",
						steps: 30,
						cfg: 7,
						sampler: "euler",
						scheduler: "normal",
					},
				};
			case "analyze-image":
				return {
					description: safeText || "Image analysis completed.",
					tags: this.extractKeywords(safeText),
					style: styleHint,
					mood: moodHint,
					colors: [],
					composition: "unknown",
					subjects: [],
					quality: 7,
					technical: {
						resolution: "unknown",
						aspectRatio: "unknown",
						sharpness: 5,
						brightness: 0.5,
						contrast: 0.5,
					},
					suggestions: [],
				};
			case "analyze-audio": {
				const features = request.context?.audioFeatures || {};
				const energy =
					typeof features.energy === "number" ? features.energy : 0.5;
				const mood =
					typeof features.mood === "string"
						? features.mood
						: this.moodFromEnergy(energy);
				return {
					mood,
					energy,
					tempo: features.tempo ?? null,
					key: features.key ?? null,
					instruments: features.instruments ?? [],
					genre: features.genre ?? "unknown",
					tags: this.extractKeywords(safeText),
					description:
						safeText ||
						`Audio analysis completed for ${request.context?.filename || "uploaded audio"}.`,
					duration: features.duration ?? 0,
					loudness: features.loudness ?? null,
					spectralCentroid: features.spectralCentroid ?? null,
				};
			}
			case "generate-tags":
				return { tags: this.extractKeywords(safeText) };
			case "detect-mood":
				return { mood: this.detectMoodFromText(safeText) };
			case "suggest-style":
				return { variations: this.suggestStyleFallback(safeText || styleHint) };
			case "filter-content":
				return { isAppropriate: true, issues: [], suggestions: [] };
			case "create-variation":
				return { variation: safeText || inputText };
			case "generate-content":
				return { content: safeText || inputText };
			default:
				return { output: safeText };
		}
	}

	private extractKeywords(text: string): string[] {
		if (!text) return [];
		const tokens = text
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, " ")
			.split(/\s+/)
			.filter(Boolean);
		const stopwords = new Set([
			"the",
			"and",
			"for",
			"with",
			"that",
			"this",
			"from",
			"into",
			"your",
			"you",
			"are",
			"was",
			"were",
			"has",
			"have",
			"a",
			"an",
			"of",
			"to",
			"in",
			"on",
			"at",
			"by",
			"as",
			"is",
			"it",
			"its",
			"or",
			"be",
			"we",
			"they",
			"their",
		]);
		const counts = new Map<string, number>();
		for (const token of tokens) {
			if (stopwords.has(token) || token.length < 3) continue;
			counts.set(token, (counts.get(token) || 0) + 1);
		}
		return Array.from(counts.entries())
			.sort((a, b) => b[1] - a[1])
			.slice(0, 8)
			.map(([word]) => word);
	}

	private moodFromEnergy(energy: number): string {
		if (energy >= 0.75) return "energetic";
		if (energy >= 0.55) return "dramatic";
		if (energy >= 0.35) return "focused";
		return "calm";
	}

	private detectMoodFromText(text: string): string {
		const lower = text.toLowerCase();
		if (/(battle|combat|fight|war|clash|attack)/.test(lower)) return "intense";
		if (/(mystery|shadow|fog|whisper|secret)/.test(lower)) return "mysterious";
		if (/(calm|peace|serene|gentle)/.test(lower)) return "calm";
		if (/(epic|heroic|legend)/.test(lower)) return "heroic";
		if (/(dark|grim|dread|horror)/.test(lower)) return "dark";
		return "neutral";
	}

	private suggestStyleFallback(baseStyle: string): string[] {
		return [
			`${baseStyle} with higher contrast`,
			`${baseStyle} with softer lighting`,
			`${baseStyle} with cinematic framing`,
			`${baseStyle} with atmospheric haze`,
			`${baseStyle} with sharper linework`,
		];
	}

	private async extractAudioFeatures(file: File): Promise<{
		duration: number;
		energy: number;
		loudness?: number;
		rms?: number;
	}> {
		if (typeof window === "undefined" || typeof AudioContext === "undefined") {
			return { duration: 0, energy: 0.5 };
		}

		try {
			const buffer = await file.arrayBuffer();
			const audioContext = new AudioContext();
			const audioBuffer = await audioContext.decodeAudioData(buffer.slice(0));
			const channelData = audioBuffer.getChannelData(0);
			const step = Math.max(1, Math.floor(channelData.length / 50000));
			let sumSquares = 0;
			let count = 0;

			for (let i = 0; i < channelData.length; i += step) {
				const sample = channelData[i];
				sumSquares += sample * sample;
				count += 1;
			}

			const rms = Math.sqrt(sumSquares / Math.max(1, count));
			const energy = Math.min(1, rms * 1.5);
			const loudness = rms > 0 ? 20 * Math.log10(rms) : -60;

			audioContext.close();

			return {
				duration: audioBuffer.duration,
				energy,
				loudness,
				rms,
			};
		} catch {
			return { duration: 0, energy: 0.5 };
		}
	}

	private validateRequest(request: AIRequest): string[] {
		const errors: string[] = [];

		if (!request.service) {
			errors.push("Service is required");
		}

		if (!request.type) {
			errors.push("Type is required");
		}

		if (!request.input) {
			errors.push("Input is required");
		}

		const service = getAIServiceById(request.service, this.config.services);
		if (!service) {
			errors.push(`Unknown AI service: ${request.service}`);
		}

		if (service && !service.enabled) {
			errors.push(`AI service is disabled: ${service.name}`);
		}

		if (service && !service.capabilities.includes(request.type)) {
			errors.push(`Service ${service.name} doesn't support ${request.type}`);
		}

		return errors;
	}

	private isRateLimited(): boolean {
		const now = Date.now();
		const hourInMs = 60 * 60 * 1000;

		// Reset counter if it's been more than an hour
		if (now - this.lastResetTime > hourInMs) {
			this.requestCount = 0;
			this.lastResetTime = now;
		}

		return this.requestCount >= this.config.maxRequestsPerHour;
	}

	private getCacheKey(request: AIRequest): string {
		return `${request.service}:${request.type}:${JSON.stringify(request.input)}`;
	}

	private getFallbackServices(
		primaryServiceId: string,
		capability: AIRequest["type"],
	): AIService[] {
		const scoreService = (service: AIService): number => {
			if (service.id === "pollinations") return 0;
			if (service.type === "pollinations") return 1;
			if (service.type === "ollama") return 2;
			if (service.type === "custom") return 3;
			return 4;
		};

		return this.config.services
			.filter((service) => service.id !== primaryServiceId)
			.filter((service) => service.enabled)
			.filter((service) => service.capabilities.includes(capability))
			.sort((a, b) => scoreService(a) - scoreService(b));
	}

	private async fetchWithTimeout(
		input: RequestInfo | URL,
		init?: RequestInit,
		timeoutMs = REQUEST_TIMEOUT_MS,
	): Promise<Response> {
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), timeoutMs);
		try {
			return await fetch(input, {
				...init,
				signal: controller.signal,
			});
		} finally {
			clearTimeout(timer);
		}
	}

	private dedupeStrings(values: Array<string | undefined | null>): string[] {
		const seen = new Set<string>();
		const output: string[] = [];
		for (const value of values) {
			if (!value) continue;
			const trimmed = value.trim();
			if (!trimmed) continue;
			const key = trimmed.toLowerCase();
			if (seen.has(key)) continue;
			seen.add(key);
			output.push(trimmed);
		}
		return output;
	}

	private async callService(
		service: AIService,
		request: AIRequest,
	): Promise<AIResponse> {
		this.requestCount++;

		// Route to appropriate service handler
		switch (service.type) {
			case "gemini-proxy":
				return this.callGeminiProxy(service, request);
			case "pollinations":
				return this.callPollinations(service, request);
			case "ollama":
				return this.callOllama(service, request);
			case "custom":
				return this.callOpenAICompatible(service, request);
			default:
				return this.callGeminiProxy(service, request);
		}
	}

	private async callGeminiProxy(
		service: AIService,
		request: AIRequest,
	): Promise<AIResponse> {
		try {
			const endpoint = service.endpoint || "/api/ai";
			const systemPrompt = this.getSystemPrompt(request.type);
			const prompt = this.formatInput(request);

			const response = await this.fetchWithTimeout(
				endpoint,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						prompt,
						systemPrompt,
						maxTokens: service.maxTokens,
					}),
				},
				REQUEST_TIMEOUT_MS,
			);

			const data = await response.json();

			if (!response.ok) {
				// If the proxy reports service not configured, mark as unavailable
				if (data?.available === false) {
					return {
						success: false,
						error: data?.error || "Gemini proxy not configured",
					};
				}
				return {
					success: false,
					error: data?.error || `Gemini proxy error: ${response.status}`,
				};
			}

			const text = data?.text || "";
			if (!text.trim()) {
				return {
					success: false,
					error: "Gemini proxy returned empty response",
				};
			}

			return {
				success: true,
				data: text,
				metadata: { model: data?.model || "gemini-2.0-flash" },
				usage: data?.usage
					? {
							promptTokens: data.usage.promptTokens,
							completionTokens: data.usage.completionTokens,
							totalTokens: data.usage.totalTokens,
						}
					: undefined,
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Gemini proxy error",
			};
		}
	}

	private async callPollinations(
		service: AIService,
		request: AIRequest,
	): Promise<AIResponse> {
		try {
			const baseUrl = (
				service.endpoint ||
				import.meta.env.VITE_FREE_AI_API ||
				FREE_AI_FALLBACK_ENDPOINT
			).replace(/\/+$/, "");
			const prompt = `${this.getSystemPrompt(request.type)}\n\n${this.formatInput(request)}`;
			const modelAttempts = this.dedupeStrings([
				service.model,
				...(service.fallbackModels || []),
			]);
			const attempts: Array<{ model?: string; label: string }> = [
				...modelAttempts.map((model) => ({ model, label: model })),
				{ label: "default" },
			];
			const errors: string[] = [];

			for (const attempt of attempts) {
				const query = attempt.model
					? `?model=${encodeURIComponent(attempt.model)}`
					: "";
				const url = `${baseUrl}/${encodeURIComponent(prompt)}${query}`;
				let response: Response;
				try {
					response = await this.fetchWithTimeout(url);
				} catch (error) {
					errors.push(
						`${attempt.label}:${error instanceof Error ? error.message : "request error"}`,
					);
					continue;
				}

				if (!response.ok) {
					errors.push(`${attempt.label}:${response.status}`);
					continue;
				}

				const text = await response.text();
				if (!text?.trim()) {
					errors.push(`${attempt.label}:empty response`);
					continue;
				}

				return {
					success: true,
					data: text,
					metadata: attempt.model
						? { model: attempt.model }
						: { model: "default" },
				};
			}

			return {
				success: false,
				error:
					errors.length > 0
						? `Free AI request failed (${errors.join(", ")})`
						: "Free AI request failed",
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Free AI error",
			};
		}
	}

	private async callOllama(
		service: AIService,
		request: AIRequest,
	): Promise<AIResponse> {
		try {
			const prompt = `${this.getSystemPrompt(request.type)}\n\n${this.formatInput(request)}`;
			const endpoint = (service.endpoint || OLLAMA_FALLBACK_ENDPOINT).replace(
				/\/+$/,
				"",
			);
			const resolvedModel = await this.resolveOllamaModel(service);
			const modelAttempts = this.dedupeStrings([
				resolvedModel,
				service.model,
				...(service.fallbackModels || []),
				...OLLAMA_MODEL_PRIORITY,
			]);
			const errors: string[] = [];

			for (const model of modelAttempts) {
				try {
					const response = await this.fetchWithTimeout(
						endpoint,
						{
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								model,
								prompt,
								stream: false,
								options: {
									temperature: service.temperature,
									num_predict: service.maxTokens,
								},
							}),
						},
						REQUEST_TIMEOUT_MS,
					);

					const payload = await response.json();
					if (!response.ok) {
						errors.push(`${model}:${payload?.error || response.status}`);
						continue;
					}

					const content = payload?.response || payload?.message?.content || "";
					if (!content || !String(content).trim()) {
						errors.push(`${model}:empty response`);
						continue;
					}

					return {
						success: true,
						data: String(content),
						metadata: { model },
					};
				} catch (error) {
					errors.push(
						`${model}:${error instanceof Error ? error.message : "request error"}`,
					);
				}
			}

			return {
				success: false,
				error:
					errors.length > 0
						? `Ollama request failed (${errors.join(", ")})`
						: "Ollama request failed",
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Ollama AI error",
			};
		}
	}

	private async resolveOllamaModel(service: AIService): Promise<string> {
		const configuredModels = this.dedupeStrings([
			service.model,
			...(service.fallbackModels || []),
			...OLLAMA_MODEL_PRIORITY,
		]);

		const endpoint = (service.endpoint || OLLAMA_FALLBACK_ENDPOINT).replace(
			/\/+$/,
			"",
		);
		const tagsUrl = endpoint.replace(/\/api\/generate$/i, "/api/tags");

		try {
			const response = await this.fetchWithTimeout(
				tagsUrl,
				undefined,
				OLLAMA_TAGS_TIMEOUT_MS,
			);
			if (!response.ok) {
				return configuredModels[0] || OLLAMA_MODEL_PRIORITY[0];
			}

			const data = await response.json();
			const availableModels = Array.isArray(data?.models)
				? data.models
						.map((entry: { name?: string } | string) =>
							typeof entry === "string" ? entry : entry?.name,
						)
						.filter(
							(name: unknown): name is string =>
								typeof name === "string" && name.trim().length > 0,
						)
				: [];

			if (availableModels.length === 0) {
				return configuredModels[0] || OLLAMA_MODEL_PRIORITY[0];
			}

			const byExactMatch = configuredModels.find((candidate) =>
				availableModels.some(
					(available: string) =>
						available.toLowerCase() === candidate.toLowerCase(),
				),
			);
			if (byExactMatch) return byExactMatch;

			const byLooseMatch = configuredModels.find((candidate) =>
				availableModels.some((available: string) =>
					available.toLowerCase().includes(candidate.toLowerCase()),
				),
			);
			if (byLooseMatch) return byLooseMatch;

			return availableModels[0];
		} catch {
			return configuredModels[0] || OLLAMA_MODEL_PRIORITY[0];
		}
	}

	private async callOpenAICompatible(
		service: AIService,
		request: AIRequest,
	): Promise<AIResponse> {
		try {
			const apiKey = service.apiKey;
			if (!apiKey) {
				throw new Error("Custom AI API key is missing");
			}

			const baseUrl = (service.endpoint || CUSTOM_AI_FALLBACK_ENDPOINT).replace(
				/\/+$/,
				"",
			);
			const model = service.model || CUSTOM_AI_FALLBACK_MODEL;

			const response = await this.fetchWithTimeout(
				`${baseUrl}/chat/completions`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${apiKey}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						model,
						messages: [
							{ role: "system", content: this.getSystemPrompt(request.type) },
							{ role: "user", content: this.formatInput(request) },
						],
						temperature: service.temperature,
						max_tokens: service.maxTokens,
					}),
				},
				REQUEST_TIMEOUT_MS,
			);

			const data = await response.json();
			if (!response.ok) {
				throw new Error(
					data?.error?.message ||
						`Custom AI request failed: ${response.status}`,
				);
			}

			const content = data?.choices?.[0]?.message?.content ?? "";
			return {
				success: true,
				data: content,
				usage: {
					promptTokens: data?.usage?.prompt_tokens,
					completionTokens: data?.usage?.completion_tokens,
					totalTokens: data?.usage?.total_tokens,
				},
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Custom AI error",
			};
		}
	}

	private getSystemPrompt(type: string): string {
		const jsonInstruction =
			"Return ONLY valid JSON. Do not wrap in Markdown or code fences. Use double quotes for all keys and strings.";
		const prompts: Record<string, string> = {
			"enhance-prompt": `${jsonInstruction}\nYou are an expert tabletop RPG and AI art prompt engineer. Enhance the given prompt for high-quality image generation in the style of System Ascendant manhwa-inspired fantasy. Respond with JSON: {"original":"","enhanced":"","additions":[],"improvements":[],"style":"","mood":"","technical":{"weight":"","steps":0,"cfg":0,"sampler":"","scheduler":""}}`,
			"analyze-image": `${jsonInstruction}\nYou are an expert art analyst specializing in anime/manga style artwork, particularly System Ascendant. Respond with JSON: {"description":"","tags":[],"style":"","mood":"","colors":[],"composition":"","subjects":[],"quality":1,"technical":{"resolution":"","aspectRatio":"","sharpness":1,"brightness":0.5,"contrast":0.5},"suggestions":[]}`,
			"analyze-audio": `${jsonInstruction}\nYou are an audio expert specializing in tabletop campaign music and sound effects. Respond with JSON: {"mood":"","energy":0.5,"tempo":null,"key":null,"instruments":[],"genre":"","tags":[],"description":"","duration":0,"loudness":null,"spectralCentroid":null}`,
			"generate-tags": `${jsonInstruction}\nGenerate relevant tags for the given content in the context of a System Ascendant themed campaign. Respond with JSON: {"tags":[]}`,
			"detect-mood": `${jsonInstruction}\nDetect the primary mood of the given content. Respond with JSON: {"mood":""}`,
			"suggest-style": `${jsonInstruction}\nSuggest variations of the given style that would work for different scenarios while maintaining the core aesthetic. Respond with JSON: {"variations":[]}`,
			"filter-content": `${jsonInstruction}\nAnalyze the given content for appropriateness. Respond with JSON: {"isAppropriate":true,"issues":[],"suggestions":[]}`,
			"create-variation": `${jsonInstruction}\nCreate a variation of the given content that maintains core elements but adds a different twist. Respond with JSON: {"variation":""}`,
			"generate-content": `You are an expert tabletop RPG game master and narrative designer for System Ascendant, a d20-based TTRPG with dark manhwa-inspired flavor.

CORE RULES CONTEXT:
- Uses System Ascendant mechanics: proficiency bonus (ceil(level/4)+1), ability modifiers (floor((score-10)/2)), unique martial and caster powers, hit dice, armor class, saving throws, skill checks.
- Ability scores use System Ascendant names: STR (Strength), AGI (Agility/Dexterity), VIT (Vitality/Constitution), INT (Intelligence), SENSE (Sense/Wisdom), PRE (Presence/Charisma).
- Classes are called "Jobs". The 14 canonical jobs are: Destroyer (Fighter), Berserker (Barbarian), Assassin (Rogue), Striker (Monk), Mage (Wizard), Esper (Sorcerer), Revenant (Necromancer), Summoner (Druid), Herald (Cleric), Contractor (Warlock), Stalker (Ranger), Holy Knight (Paladin), Technomancer (Artificer), Idol (Bard).
- Subclasses are called "Paths". The DM is called "Protocol Warden".
- Regents (formerly Monarchs) are quest/DM-gated power overlays unlocked through quests, not level gates. Two regents unlock the Gemini Protocol (sovereign fusion).
- Runes follow the System Ascendant model: one-time-use consumable skill books that permanently teach abilities when absorbed. Cross-type absorption adapts the ability (martial absorbs spell → physical technique; caster absorbs martial → magical construct) with proficiency bonus uses per long rest.
- Shadow Soldiers require the Umbral Regent unlock. System Favor replaces Inspiration.
- Equipment uses 5e armor rules: light (base + AGI), medium (base + min(AGI,2)), heavy (fixed AC, no AGI). Max 3 attuned items.

Generate polished, player-ready content with clear sections and labels. Use System Ascendant terminology. Return plain text only. Avoid JSON, Markdown fences, or code blocks.`,
		};

		return prompts[type] || prompts["enhance-prompt"];
	}

	private formatInput(request: AIRequest): string {
		let formatted = `Request: ${request.type}\n`;
		formatted += `Input: ${typeof request.input === "string" ? request.input : "Non-text input"}\n`;

		if (request.context) {
			formatted += `Context: ${JSON.stringify(request.context, null, 2)}\n`;
		}

		if (request.options) {
			formatted += `Options: ${JSON.stringify(request.options, null, 2)}\n`;
		}

		return formatted;
	}

	// Public methods for configuration
	updateConfiguration(updates: Partial<AIConfiguration>): void {
		this.config = { ...this.config, ...updates };
	}

	getConfiguration(): AIConfiguration {
		return { ...this.config };
	}

	addService(service: AIService): void {
		this.config.services.push(service);
	}

	removeService(serviceId: string): void {
		this.config.services = this.config.services.filter(
			(s) => s.id !== serviceId,
		);
	}

	enableService(serviceId: string): void {
		const service = getAIServiceById(serviceId, this.config.services);
		if (service) {
			service.enabled = true;
		}
	}

	disableService(serviceId: string): void {
		const service = getAIServiceById(serviceId, this.config.services);
		if (service) {
			service.enabled = false;
		}
	}

	// Cache management
	clearCache(): void {
		this.cache.clear();
	}

	getCacheStats(): { size: number; keys: string[] } {
		return {
			size: this.cache.size,
			keys: Array.from(this.cache.keys()),
		};
	}

	applyUserSettings(settings: ReturnType<typeof loadAIUserSettings>): void {
		const baseServices = DEFAULT_AI_SERVICES.map((service) => ({
			...service,
			fallbackModels: service.fallbackModels
				? [...service.fallbackModels]
				: undefined,
		}));
		if (settings.provider === "custom" && settings.apiKey.trim()) {
			const customService = buildCustomService(settings);
			this.config = {
				...this.config,
				services: [...baseServices, customService],
				defaultService: customService.id,
			};
			return;
		}

		this.config = {
			...this.config,
			services: baseServices,
			defaultService: baseServices[0]?.id ?? this.config.defaultService,
		};
	}
}

// Singleton instance
export const aiService = new AIServiceManager();
if (typeof window !== "undefined") {
	aiService.applyUserSettings(loadAIUserSettings());
}
