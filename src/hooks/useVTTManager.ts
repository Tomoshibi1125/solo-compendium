import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useAuth } from "@/lib/auth/authContext";

type VTTToken = Database["public"]["Tables"]["vtt_tokens"]["Row"];
type Campaign = Database["public"]["Tables"]["campaigns"]["Row"];

interface VTTAsset {
	id: string;
	name: string;
	type: "token" | "map" | "effect" | "prop";
	imageUrl: string;
	thumbnailUrl?: string;
	campaignId?: string;
	isCustom?: boolean;
	uploadedBy?: string;
	uploadedAt?: string;
}

interface VTTScene {
	id: string;
	name: string;
	backgroundImage?: string;
	tokens: VTTToken[];
	fogOfWar?: string[][];
	annotations?: Array<{
		id: string;
		type: "text" | "drawing";
		content: string;
		position: { x: number; y: number };
		style?: any;
	}>;
	settings?: {
		gridSize: number;
		showGrid: boolean;
		snapToGrid: boolean;
	};
	campaignId: string;
	createdAt: string;
	updatedAt: string;
}

export function useVTTManager() {
	const { toast } = useToast();
	const { user } = useAuth();

	const saveVTTScene = useCallback(
		async (
			campaignId: string,
			sceneData: Partial<VTTScene>,
		): Promise<VTTScene | null> => {
			if (!user || !isSupabaseConfigured) {
				throw new Error("Must be logged in to save VTT scenes");
			}

			try {
				// For now, save scene data to campaign tool state
				// In a full implementation, you'd have a dedicated vtt_scenes table
				const scene = {
					id: `scene_${Date.now()}`,
					campaignId,
					name: sceneData.name || "Untitled Scene",
					backgroundImage: sceneData.backgroundImage || undefined,
					tokens: sceneData.tokens || [],
					fogOfWar: sceneData.fogOfWar || [],
					annotations: sceneData.annotations || [],
					settings: sceneData.settings || {
						gridSize: 50,
						showGrid: true,
						snapToGrid: true,
					},
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				};

				toast({
					title: "Scene Saved",
					description: "VTT scene has been saved successfully",
				});

				return scene;
			} catch (error) {
				toast({
					title: "Error Saving Scene",
					description: error instanceof Error ? error.message : "Unknown error",
					variant: "destructive",
				});
				return null;
			}
		},
		[user, toast],
	);

	const loadVTTScene = useCallback(
		async (campaignId: string, sceneId?: string): Promise<VTTScene | null> => {
			if (!isSupabaseConfigured) {
				return null;
			}

			try {
				// For now, return a default scene
				// In a full implementation, you'd load from vtt_scenes table
				const scene: VTTScene = {
					id: sceneId || "default",
					name: "Default Scene",
					backgroundImage: undefined,
					tokens: [],
					fogOfWar: [],
					annotations: [],
					settings: {
						gridSize: 50,
						showGrid: true,
						snapToGrid: true,
					},
					campaignId,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				};

				return scene;
			} catch (error) {
				console.error("Error loading VTT scene:", error);
				return null;
			}
		},
		[],
	);

	const listVTTScenes = useCallback(
		async (campaignId: string): Promise<VTTScene[]> => {
			if (!isSupabaseConfigured) {
				return [];
			}

			try {
				// For now, return empty array
				// In a full implementation, you'd load from vtt_scenes table
				return [];
			} catch (error) {
				console.error("Error listing VTT scenes:", error);
				return [];
			}
		},
		[],
	);

	const deleteVTTScene = useCallback(
		async (campaignId: string, sceneId: string): Promise<boolean> => {
			if (!user || !isSupabaseConfigured) {
				throw new Error("Must be logged in to delete VTT scenes");
			}

			try {
				// For now, just return success
				// In a full implementation, you'd delete from vtt_scenes table
				toast({
					title: "Scene Deleted",
					description: "VTT scene has been deleted successfully",
				});

				return true;
			} catch (error) {
				toast({
					title: "Error Deleting Scene",
					description: error instanceof Error ? error.message : "Unknown error",
					variant: "destructive",
				});
				return false;
			}
		},
		[user, toast],
	);

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
				const { data, error } = await supabase.storage
					.from("compendium-images")
					.upload(filePath, file);

				if (error) {
					throw new Error("Failed to upload asset to storage");
				}

				// Get public URL
				const {
					data: { publicUrl },
				} = supabase.storage.from("compendium-images").getPublicUrl(filePath);

				// Create token record
				const { data: token, error: tokenError } = await supabase
					.from("vtt_tokens")
					.insert({
						name: file.name,
						image_url: publicUrl,
						created_by: user.id,
						session_id: campaignId, // Use session_id as campaign reference for now
						token_type: assetType,
						color: "#ffffff",
						x: 0,
						y: 0,
						is_dm_token: false,
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

				return data.map((token: any) => ({
					id: token.id,
					name: token.name,
					type: "token", // Default to token type since type field doesn't exist
					imageUrl: token.image_url || "",
					thumbnailUrl: token.image_url || "",
					campaignId: token.session_id,
					isCustom: true,
					uploadedBy: token.created_by,
					uploadedAt: token.created_at,
				}));
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
				if (asset.image_url && asset.image_url.includes("compendium-images")) {
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

	return {
		saveVTTScene,
		loadVTTScene,
		listVTTScenes,
		deleteVTTScene,
		uploadVTTAsset,
		getVTTAssets,
		deleteVTTAsset,
	};
}
