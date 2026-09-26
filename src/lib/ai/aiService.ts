import type {
	AIConfiguration,
	AIRequest,
	AIResponse,
	ImageAnalysis,
	PromptEnhancement,
} from "./types";

const RETIRED_MESSAGE =
	"General AI features were retired. AI provider access is reserved for dedicated Sovereign creation.";

const RETIRED_CONFIG: AIConfiguration = {
	services: [],
	defaultService: "",
	autoEnhancePrompts: false,
	autoAnalyzeImages: false,
	contentFiltering: false,
	maxRequestsPerHour: 0,
	cacheResults: false,
};

/**
 * A1 compatibility shell for legacy callers.
 *
 * This class intentionally contains no fetch/provider code. Existing screens may
 * continue to import it while their manual/deterministic UI is migrated, but a
 * legacy request can never leave the browser. The only live provider path is
 * the authenticated dedicated Sovereign endpoint.
 */
export class AIServiceManager {
	private configuration: AIConfiguration;

	constructor(configuration: AIConfiguration = RETIRED_CONFIG) {
		this.configuration = {
			...configuration,
			services: [],
			defaultService: "",
			autoEnhancePrompts: false,
			autoAnalyzeImages: false,
			contentFiltering: false,
			maxRequestsPerHour: 0,
			cacheResults: false,
		};
	}

	getConfiguration(): AIConfiguration {
		return {
			...this.configuration,
			services: [],
		};
	}

	applyUserSettings(_settings: unknown): void {
		// General provider selection was removed in A1.
	}

	async processRequest(_request: AIRequest): Promise<AIResponse> {
		return {
			success: false,
			error: RETIRED_MESSAGE,
		};
	}

	async enhancePrompt(
		original: string,
		_context?: Record<string, unknown>,
	): Promise<PromptEnhancement> {
		return {
			original,
			enhanced: original,
			additions: [],
			improvements: [],
			style: "manual",
			mood: "neutral",
			technical: {
				weight: "1",
				steps: 0,
				cfg: 0,
				sampler: "manual",
				scheduler: "manual",
			},
		};
	}

	async generateTags(
		_content: string,
		_type: "audio" | "image" | "text" = "text",
	): Promise<string[]> {
		return [];
	}

	async detectMood(
		_content: string,
		_type: "audio" | "image" | "text" = "text",
	): Promise<string> {
		return "neutral";
	}

	async analyzeImage(_imageUrl: string): Promise<ImageAnalysis> {
		throw new Error(RETIRED_MESSAGE);
	}

	async suggestStyleVariations(_baseStyle: string): Promise<string[]> {
		return [];
	}
}

export const aiService = new AIServiceManager();
