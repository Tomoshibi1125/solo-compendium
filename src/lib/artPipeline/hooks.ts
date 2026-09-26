import { useCallback, useEffect, useState } from "react";
import { artPipeline } from "./service";
import type {
	ArtAsset,
	ArtRequest,
	GenerationResult,
	QueueStatus,
} from "./types";

const RETIRED_MESSAGE =
	"Generated art was retired in A1. Existing saved art remains available.";

export function useArtPipeline() {
	const checkAvailability = useCallback(async () => false, []);
	const generateArt = useCallback(
		async (_request: ArtRequest): Promise<GenerationResult> => ({
			success: false,
			error: RETIRED_MESSAGE,
		}),
		[],
	);
	const getQueueStatus = useCallback(async (): Promise<QueueStatus> => ({
		running: [],
		pending: [],
	}), []);
	const clearQueue = useCallback(async () => {}, []);
	const interrupt = useCallback(async () => {}, []);

	return {
		isAvailable: false,
		isGenerating: false,
		queueStatus: null as QueueStatus | null,
		enabled: false,
		generateArt,
		getQueueStatus,
		clearQueue,
		interrupt,
		checkAvailability,
	};
}

export function useArtAsset(
	entityType: ArtRequest["entityType"],
	entityId: string,
	variant: ArtRequest["variant"] = "portrait",
) {
	const [asset, setAsset] = useState<ArtAsset | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const loadAsset = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const assets = await artPipeline.getAssetsForEntity(entityType, entityId);
			setAsset(assets.find((candidate) => candidate.variant === variant) ?? null);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load asset");
		} finally {
			setLoading(false);
		}
	}, [entityType, entityId, variant]);

	const createAsset = useCallback(
		async (_title: string, _options: Partial<ArtRequest> = {}) => ({
			success: false,
			error: RETIRED_MESSAGE,
		}) as GenerationResult,
		[],
	);

	useEffect(() => {
		void loadAsset();
	}, [loadAsset]);

	return { asset, loading, error, createAsset, refresh: loadAsset };
}

export function useBatchArtGeneration() {
	const generateBatch = useCallback(
		async (requests: ArtRequest[]) =>
			requests.map(() => ({ success: false, error: RETIRED_MESSAGE })),
		[],
	);
	return {
		generateBatch,
		progress: 0,
		results: [] as GenerationResult[],
		isGenerating: false,
	};
}

export function useArtQueueMonitor(_interval: number = 2000) {
	return { running: [], pending: [] } as QueueStatus;
}
