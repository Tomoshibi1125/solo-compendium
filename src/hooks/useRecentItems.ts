import { useUserLocalState } from "@/hooks/useToolState";

interface RecentItem {
	id: string;
	type: string;
	name: string;
	href: string;
	timestamp: number;
}

const STORAGE_KEY = "recent-items";
const MAX_RECENT_ITEMS = 20;

/**
 * Hook for managing recently viewed items
 */
export function useRecentItems() {
	const { state: recentItems, setState: setRecentItems } = useUserLocalState<
		RecentItem[]
	>(STORAGE_KEY, { initialState: [] });

	const addRecentItem = (item: Omit<RecentItem, "timestamp">) => {
		setRecentItems((prev) => {
			// Remove existing item if present
			const filtered = prev.filter(
				(i) => !(i.id === item.id && i.type === item.type),
			);

			// Add new item at the beginning
			const updated = [{ ...item, timestamp: Date.now() }, ...filtered].slice(
				0,
				MAX_RECENT_ITEMS,
			);

			return updated;
		});
	};

	const clearRecentItems = () => {
		setRecentItems([]);
	};

	const removeRecentItem = (id: string, type: string) => {
		setRecentItems((prev) =>
			prev.filter((i) => !(i.id === id && i.type === type)),
		);
	};

	return {
		recentItems,
		addRecentItem,
		clearRecentItems,
		removeRecentItem,
	};
}
