import { useCallback } from "react";

/**
 * A1 compatibility hook. Legacy enhancement buttons remain harmless while their
 * surrounding screens are migrated to manual/deterministic editing: no request
 * is issued and no generated text is returned.
 */
export function useAIEnhance() {
	const enhance = useCallback(
		async (
			_contentType: string,
			_seedData: string,
			_customSystemPrompt?: string,
		): Promise<string | null> => null,
		[],
	);
	const clearEnhanced = useCallback(() => {}, []);
	return {
		isEnhancing: false,
		enhancedText: null as string | null,
		enhance,
		clearEnhanced,
	};
}
