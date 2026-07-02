import { aiService } from "@/lib/ai/aiService";
import { buildRaSystemPrompt } from "@/lib/ai/raCanonPrompt";
import { AppError } from "@/lib/appError";

interface ProtocolWardenContext {
	campaignName?: string;
	characterNames?: string[];
	recentContext?: string;
}

/**
 * Transforms mechanical logs (e.g., "Rolled 18 to hit, 12 fire damage")
 * into thematic, flavorful narrative descriptions acting as the Warden.
 */
export async function narrateCombatEvent(
	mechanicalText: string,
	context?: ProtocolWardenContext,
): Promise<string> {
	const config = aiService.getConfiguration();

	const prompt = `MECHANICAL EVENT:
"${mechanicalText}"

${context?.campaignName ? `CAMPAIGN: ${context.campaignName}` : ""}
${context?.characterNames?.length ? `CHARACTERS PRESENT: ${context.characterNames.join(", ")}` : ""}
${context?.recentContext ? `RECENT CONTEXT: ${context.recentContext}` : ""}

Output ONLY the flavor text.`;

	try {
		const response = await aiService.processRequest({
			service: config.defaultService,
			type: "generate-content",
			input: prompt,
			context: {
				contentType: "narration",
				universe: "Rift Ascendant",
				customSystemPrompt: buildRaSystemPrompt("narrator"),
			},
		});

		if (response.success && response.data) {
			return (
				typeof response.data === "string"
					? response.data
					: String(response.data)
			).trim();
		}

		throw new AppError(
			"AI processing failed or returned empty data",
			"AI_ERROR",
		);
	} catch (error) {
		console.error("Warden Narration Failed:", error);
		throw error;
	}
}
