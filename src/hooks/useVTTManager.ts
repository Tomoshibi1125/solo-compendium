import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useAuth } from "@/lib/auth/authContext";

import type { VTTAsset, VTTScene } from "@/types/vtt";

export function useVTTManager() {
	const { toast } = useToast();
	const { user } = useAuth();

	const uploadVTTAsset = useCallback(
		async (
			campaignId: string,
			file: File,
			assetType: "map" | "token",
		): Promise<VTTAsset | null> => {
			if (!user || !isSupabaseConfigured) {
				throw new Error("Must be logged in to upload VTT assets");
			}

			try {
				// Generate unique filename
				const fileExt = file.name.split(".").pop();
				const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
				const filePath = `vtt/${assetType}s/${campaignId}/${fileName}`;

				// Upload to Supabase Storage
				const { error } = await supabase.storage
					.from("compendium-images")
					.upload(filePath, file);

				if (error) {
					throw new Error("Failed to upload asset to storage");
				}

				// Get public URL
				const {
					data: { publicUrl },
				} = supabase.storage.from("compendium-images").getPublicUrl(filePath);

				// Create token record.
				// D2: campaign_id is the canonical campaign reference
				// (migration 20260528000600). session_id is retained for
				// backward compatibility / NOT NULL until RLS prefers
				// campaign_id (migration 20260528000700).
				const { data: token, error: tokenError } = await supabase
					.from("vtt_tokens")
					.insert({
						name: file.name,
						image_url: publicUrl,
						created_by: user.id,
						session_id: campaignId,
						campaign_id: campaignId,
						token_type: assetType,
						color: "#ffffff",
						x: 0,
						y: 0,
						is_warden_token: false,
					})
					.select()
					.single();

				if (tokenError) {
					throw new Error("Failed to create asset record");
				}

				toast({
					title: "Asset Uploaded",
					description: `${file.name} has been uploaded successfully`,
				});

				return {
					id: token.id,
					name: file.name,
					type: assetType,
					imageUrl: publicUrl,
					campaignId,
					isCustom: true,
					uploadedBy: user.id,
					uploadedAt: new Date().toISOString(),
				};
			} catch (error) {
				toast({
					title: "Error Uploading Asset",
					description: error instanceof Error ? error.message : "Unknown error",
					variant: "destructive",
				});
				return null;
			}
		},
		[user, toast],
	);

	const getVTTAssets = useCallback(
		async (campaignId?: string): Promise<VTTAsset[]> => {
			if (!isSupabaseConfigured) {
				return [];
			}

			try {
				let query = supabase
					.from("vtt_tokens")
					.select("*")
					.order("created_at", { ascending: false });

				if (campaignId) {
					query = query.eq("session_id", campaignId);
				}

				const { data, error } = await query;

				if (error) {
					console.error("Error loading VTT assets:", error);
					return [];
				}

				return data.map(
					(token: Database["public"]["Tables"]["vtt_tokens"]["Row"]) => ({
						id: token.id,
						name: token.name,
						type: "token" as const, // Default to token type since type field doesn't exist
						imageUrl: token.image_url || "",
						thumbnailUrl: token.image_url || "",
						campaignId: token.session_id,
						isCustom: true,
						uploadedBy: token.created_by,
						uploadedAt: token.created_at ?? undefined,
					}),
				);
			} catch (error) {
				console.error("Error loading VTT assets:", error);
				return [];
			}
		},
		[],
	);

	const deleteVTTAsset = useCallback(
		async (assetId: string): Promise<boolean> => {
			if (!user || !isSupabaseConfigured) {
				throw new Error("Must be logged in to delete VTT assets");
			}

			try {
				// Get asset info for storage cleanup
				const { data: asset, error: fetchError } = await supabase
					.from("vtt_tokens")
					.select("*")
					.eq("id", assetId)
					.single();

				if (fetchError || !asset) {
					throw new Error("Asset not found");
				}

				// Delete asset record
				const { error } = await supabase
					.from("vtt_tokens")
					.delete()
					.eq("id", assetId);

				if (error) {
					throw new Error("Failed to delete asset record");
				}

				// Delete from storage if it's a custom asset
				if (asset.image_url?.includes("compendium-images")) {
					const urlParts = asset.image_url.split("/");
					const fileName = urlParts[urlParts.length - 1];
					if (fileName) {
						await supabase.storage.from("compendium-images").remove([fileName]);
					}
				}

				toast({
					title: "Asset Deleted",
					description: "VTT asset has been deleted successfully",
				});

				return true;
			} catch (error) {
				toast({
					title: "Error Deleting Asset",
					description: error instanceof Error ? error.message : "Unknown error",
					variant: "destructive",
				});
				return false;
			}
		},
		[user, toast],
	);

	const appendToken = useCallback(
		(
			scene: VTTScene,
			token: import("@/types/vtt").VTTTokenInstance,
		): VTTScene => {
			return {
				...scene,
				tokens: [...scene.tokens, token],
			};
		},
		[],
	);

	const updateToken = useCallback(
		(
			scene: VTTScene,
			tokenId: string,
			updates: Partial<import("@/types/vtt").VTTTokenInstance>,
		): VTTScene => {
			return {
				...scene,
				tokens: scene.tokens.map((t) =>
					t.id === tokenId ? { ...t, ...updates } : t,
				),
			};
		},
		[],
	);

	const removeToken = useCallback(
		(scene: VTTScene, tokenId: string): VTTScene => {
			return {
				...scene,
				tokens: scene.tokens.filter((t) => t.id !== tokenId),
			};
		},
		[],
	);

	return {
		uploadVTTAsset,
		getVTTAssets,
		deleteVTTAsset,
		appendToken,
		updateToken,
		removeToken,
	};
}
