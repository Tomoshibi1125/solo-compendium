import { useEffect, useState } from "react";
import {
	getStaticJobs,
	initializeProtocolData,
	isProtocolDataInitialized,
} from "@/lib/ProtocolDataManager";
import type { CompendiumJob } from "@/types/compendium";

/**
 * Normalized protocol jobs for render-time use. Returns the loaded list
 * immediately when the protocol registry is ready; otherwise kicks off
 * initialization and re-renders once the data lands. A bare getStaticJobs()
 * call at render time returns [] forever for components mounted before
 * initialization finishes.
 */
export function useProtocolJobs(): CompendiumJob[] {
	const [jobs, setJobs] = useState<CompendiumJob[]>(() =>
		isProtocolDataInitialized() ? getStaticJobs() : [],
	);

	useEffect(() => {
		if (isProtocolDataInitialized()) {
			setJobs((prev) => (prev.length > 0 ? prev : getStaticJobs()));
			return;
		}
		let cancelled = false;
		initializeProtocolData().then(() => {
			if (!cancelled) setJobs(getStaticJobs());
		});
		return () => {
			cancelled = true;
		};
	}, []);

	return jobs;
}
