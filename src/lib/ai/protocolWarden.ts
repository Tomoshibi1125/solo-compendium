interface ProtocolWardenContext {
	campaignName?: string;
	characterNames?: string[];
	recentContext?: string;
}

/**
 * Compatibility helper after A1. General provider-backed narration was removed.
 * Preserve the mechanical event verbatim so chat workflows remain usable and
 * deterministic without issuing any network request.
 */
export async function narrateCombatEvent(
	mechanicalText: string,
	_context?: ProtocolWardenContext,
): Promise<string> {
	return mechanicalText.trim();
}
