import { useQuery } from "@tanstack/react-query";
import type { Path } from "@/data/compendium/paths";
import { loadStaticPathCatalog } from "@/lib/pathLedger";

/** The static Path catalog, loaded on demand and cached for the session. */
export function useStaticPathCatalog(enabled = true) {
	return useQuery<Path[]>({
		queryKey: ["static-path-catalog"],
		queryFn: loadStaticPathCatalog,
		staleTime: Number.POSITIVE_INFINITY,
		enabled,
	});
}
