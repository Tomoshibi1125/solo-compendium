import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { AppError } from "@/lib/appError";
import type {
	ArtAsset,
	ArtMetadata,
	ArtRequest,
	GenerationResult,
	QueueStatus,
} from "./types";

type ArtAssetRow = Database["public"]["Tables"]["art_assets"]["Row"];

const RETIRED_MESSAGE =
	"Generated art was retired in A1. Existing authored and previously saved art remains available.";

/**
 * Read-only A1 art repository.
 *
 * Provider-backed image generation was removed. The repository still exposes
 * saved art so existing characters, compendium entries, and authored assets do
 * not break or disappear.
 */
class ArtPipelineService {
	private readonly operationTimeoutMs = 20_000;

	async isAvailable(): Promise<boolean> {
		return false;
	}

	async generateArt(_request: ArtRequest): Promise<GenerationResult> {
		return { success: false, error: RETIRED_MESSAGE };
	}

	private async withTimeout<T>(
		promise: PromiseLike<T>,
		message: string,
	): Promise<T> {
		let timeoutId: ReturnType<typeof setTimeout> | undefined;
		const timeoutPromise = new Promise<T>((_, reject) => {
			timeoutId = setTimeout(
				() => reject(new AppError(message, "UNKNOWN")),
				this.operationTimeoutMs,
			);
		});
		try {
			return await Promise.race([Promise.resolve(promise), timeoutPromise]);
		} finally {
			if (timeoutId) clearTimeout(timeoutId);
		}
	}

	private toArtAsset(row: ArtAssetRow): ArtAsset {
		const paths = row.paths as ArtAsset["paths"];
		const dimensions = row.dimensions as ArtAsset["dimensions"];
		const metadata = row.metadata as ArtMetadata;
		const createdAt = row.created_at ?? new Date().toISOString();
		const updatedAt = row.updated_at ?? createdAt;
		return {
			id: row.id,
			entityType: row.entity_type,
			entityId: row.entity_id,
			variant: row.variant,
			paths,
			dimensions,
			fileSize: row.file_size,
			mimeType: row.mime_type,
			metadataPath: row.metadata_path,
			metadata,
			hash: row.hash,
			createdAt,
			updatedAt,
		};
	}

	async getAsset(assetId: string): Promise<ArtAsset | null> {
		const { data, error } = await this.withTimeout(
			supabase.from("art_assets").select("*").eq("id", assetId).maybeSingle(),
			"Art asset lookup timed out",
		);
		if (error || !data) return null;
		return this.toArtAsset(data);
	}

	async getAssetsForEntity(
		entityType: string,
		entityId: string,
	): Promise<ArtAsset[]> {
		const { data, error } = await this.withTimeout(
			supabase
				.from("art_assets")
				.select("*")
				.eq("entity_type", entityType)
				.eq("entity_id", entityId)
				.order("created_at", { ascending: false }),
			"Art asset lookup timed out",
		);
		if (error || !data) return [];
		return data.map((row) => this.toArtAsset(row));
	}

	async batchGenerate(requests: ArtRequest[]): Promise<GenerationResult[]> {
		return requests.map(() => ({ success: false, error: RETIRED_MESSAGE }));
	}

	async getQueueStatus(): Promise<QueueStatus> {
		return { running: [], pending: [] };
	}

	async clearQueue(): Promise<void> {}

	async interrupt(): Promise<void> {}
}

export const artPipeline = new ArtPipelineService();
