import { useEffect, useState } from "react";
import type { TrackedResource } from "@/lib/resourceTracking";

export function useTrackedResources(characterId: string) {
	const storageKey = `sa-tracked-resources-${characterId}`;
	const [resources, setResources] = useState<TrackedResource[]>([]);

	// Load on mount
	useEffect(() => {
		const saved = localStorage.getItem(storageKey);
		if (saved) {
			try {
				setResources(JSON.parse(saved));
			} catch (e) {
				console.error("Failed to parse tracked resources", e);
			}
		}
	}, [storageKey]);

	const saveResources = (newResources: TrackedResource[]) => {
		setResources(newResources);
		localStorage.setItem(storageKey, JSON.stringify(newResources));
	};

	return {
		resources,
		setResources: saveResources,
	};
}
