import { normalizeRegentSearch } from "@/lib/vernacular";

// Helper function to filter by search query
export function filterBySearch<T>(
	items: T[],
	search?: string,
	searchFields: (keyof T)[] = ["name" as keyof T, "description" as keyof T],
): T[] {
	if (!search?.trim()) return items;

	const searchLower = normalizeRegentSearch(search.toLowerCase());
	return items.filter((item) =>
		searchFields.some((field) => {
			const value = item[field];
			return (
				value &&
				typeof value === "string" &&
				value.toLowerCase().includes(searchLower)
			);
		}),
	);
}
