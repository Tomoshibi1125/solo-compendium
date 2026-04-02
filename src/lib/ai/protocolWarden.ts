import { aiService } from "@/lib/ai/aiService";
import { AppError } from "@/lib/appError";

interface ProtocolWardenContext {
	campaignName?: string;
	characterNames?: string[];
	recentContext?: string;
}

/**
 * Transforms mechanical logs (e.g., "Rolled 18 to hit, 12 fire damage")
 * into thematic, flavorful narrative descriptions acting as the Protocol Warden (PW).
 */
export async function narrateCombatEvent(
	mechanicalText: string,
	context?: ProtocolWardenContext,
): Promise<string> {
	const config = aiService.getConfiguration();

	const prompt = `You are the AI Protocol Warden (Dungeon Master) of a System Ascendant campaign. 
Your role is to translate mechanical game actions into evocative, concise narrative descriptions.

MECHANICAL EVENT:
"${mechanicalText}"

${context?.characterNames?.length ? `CHARACTERS PRESENT: ${context.characterNames.join(", ")}` : ""}
${context?.recentContext ? `RECENT CONTEXT: ${context.recentContext}` : ""}

INSTRUCTIONS:
1. Briefly narrate the outcome of this action in 1 to 2 short sentences.
2. Keep the tone dramatic, slightly sci-fantasy / litRPG ('System Ascendant' thematic).
3. Do not include mechanics (numbers, dice, stats) in your response — only the purely narrative translation.
4. If the player misses, describe how the enemy deflected or dodged. If a hit, describe the impact.

Output ONLY the flavor text.`;

	try {
		const response = await aiService.processRequest({
			service: config.defaultService,
			type: "generate-content",
			input: prompt,
			context: {
				contentType: "narration",
				universe: "System Ascendant",
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
		console.error("Protocol Warden Narration Failed:", error);
		throw error;
	}
}
