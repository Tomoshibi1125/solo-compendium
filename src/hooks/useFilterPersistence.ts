import { useCallback, useEffect, useState } from "react";
import { useUserLocalState } from "@/hooks/useToolState";
import { logger } from "@/lib/logger";

const STORAGE_KEY_PREFIX = "filters-";

/**
 * Hook for persisting filter state to localStorage
 */
export function useFilterPersistence<T extends Record<string, unknown>>(
	key: string,
	defaultFilters: T,
): [T, (filters: T | ((prev: T) => T)) => void] {
	const storageKey = `${STORAGE_KEY_PREFIX}${key}`;
	const { state: allFilters, setState: setAllFilters } = useUserLocalState<
		Record<string, T>
	>(storageKey, { initialState: {} });

	const [filters, setFilters] = useState<T>(() => {
		const stored = allFilters[key];
		if (!stored) return defaultFilters;
		try {
			// Merge with defaults to handle new filter options
			return { ...defaultFilters, ...stored };
		} catch (error) {
			logger.error(`Failed to load filters for ${key}:`, error);
			return defaultFilters;
		}
	});

	// Save filters whenever they change
	useEffect(() => {
		setAllFilters((prev) => ({
			...prev,
			[key]: filters,
		}));
	}, [filters, key, setAllFilters]);

	const updateFilters = useCallback((newFilters: T | ((prev: T) => T)) => {
		setFilters((prev) => {
			const updated =
				typeof newFilters === "function" ? newFilters(prev) : newFilters;
			return updated;
		});
	}, []);

	return [filters, updateFilters];
}
