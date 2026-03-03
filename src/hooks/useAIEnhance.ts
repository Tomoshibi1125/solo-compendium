/**
 * Shared hook for AI-enhanced content generation across all DM tools.
 * Uses Google Gemini 2.0 Flash via the server proxy as primary provider.
 */

import { useCallback, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { aiService } from "@/lib/ai/aiService";

export interface AIEnhanceResult {
	text: string;
	model?: string;
}

export function useAIEnhance() {
	const [isEnhancing, setIsEnhancing] = useState(false);
	const [enhancedText, setEnhancedText] = useState<string | null>(null);
	const { toast } = useToast();

	const enhance = useCallback(
		async (
			contentType: string,
			seedData: string,
			customSystemPrompt?: string,
		): Promise<string | null> => {
			setIsEnhancing(true);
			setEnhancedText(null);

			try {
				const response = await aiService.processRequest({
					service: aiService.getConfiguration().defaultService,
					type: "generate-content",
					input: seedData,
					context: {
						contentType,
						universe: "System Ascendant",
						style:
							"detailed TTRPG content with full lore, mechanics, rules, and flavor",
						...(customSystemPrompt ? { customSystemPrompt } : {}),
					},
				});

				if (!response.success) {
					toast({
						title: "AI Enhancement Failed",
						description:
							response.error ||
							"Could not reach AI service. Using base output.",
						variant: "destructive",
					});
					return null;
				}

				const text =
					typeof response.data === "string"
						? response.data
						: response.data?.content ||
							response.data?.text ||
							JSON.stringify(response.data);

				setEnhancedText(text);
				return text;
			} catch (error) {
				toast({
					title: "AI Enhancement Failed",
					description: error instanceof Error ? error.message : "Unknown error",
					variant: "destructive",
				});
				return null;
			} finally {
				setIsEnhancing(false);
			}
		},
		[toast],
	);

	const clearEnhanced = useCallback(() => {
		setEnhancedText(null);
	}, []);

	return {
		isEnhancing,
		enhancedText,
		enhance,
		clearEnhanced,
	};
}
