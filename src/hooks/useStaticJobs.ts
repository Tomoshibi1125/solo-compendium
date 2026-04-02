import { useQuery } from "@tanstack/react-query";

/**
 * useStaticJobs
 *
 * Asynchronously loads the large jobs data pack to optimize bundle size.
 * This ensures the compendium data is only fetched when needed (e.g. during level-up).
 */
export function useStaticJobs() {
	return useQuery({
		queryKey: ["static-jobs"],
		queryFn: async () => {
			const module = await import("@/data/compendium/jobs");
			return module.jobs;
		},
		staleTime: Number.POSITIVE_INFINITY, // Compendium data never changes during a session
	});
}
