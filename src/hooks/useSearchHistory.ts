import { useCallback } from "react";
import { useUserLocalState } from "@/hooks/useToolState";

const STORAGE_KEY = "search-history";
const MAX_HISTORY_ITEMS = 20;

export interface SearchHistoryItem {
	query: string;
	timestamp: number;
	filters?: Record<string, unknown>;
	resultCount?: number;
}

/**
 * Hook for managing search history
 */
export function useSearchHistory() {
	const { state: history, setState: setHistory } = useUserLocalState<
		SearchHistoryItem[]
	>(STORAGE_KEY, { initialState: [] });

	const addToHistory = useCallback(
		(
			query: string,
			filters?: Record<string, unknown>,
			resultCount?: number,
		) => {
			if (!query.trim()) return;

			setHistory((prev) => {
				// Remove duplicate (if exists)
				const filtered = prev.filter(
					(item) => item.query.toLowerCase() !== query.toLowerCase(),
				);

				// Add new item at the beginning
				return [
					{
						query: query.trim(),
						timestamp: Date.now(),
						filters,
						resultCount,
					},
					...filtered,
				].slice(0, MAX_HISTORY_ITEMS);
			});
		},
		[setHistory],
	);

	const removeFromHistory = useCallback(
		(query: string) => {
			setHistory((prev) => prev.filter((item) => item.query !== query));
		},
		[setHistory],
	);

	const clearHistory = useCallback(() => {
		setHistory([]);
	}, [setHistory]);

	const getRecentSearches = useCallback(
		(limit: number = 10) => {
			return history.sort((a, b) => b.timestamp - a.timestamp).slice(0, limit);
		},
		[history],
	);

	return {
		history,
		addToHistory,
		removeFromHistory,
		clearHistory,
		getRecentSearches,
	};
}
