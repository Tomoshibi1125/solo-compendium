import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { AppError } from "@/lib/appError";
import { log, error as logError } from "@/lib/logger";

interface VTTAudioTrack {
	id: string;
	session_id: string;
	name: string;
	type: "music" | "ambient" | "sfx";
	url: string;
	volume: number;
	loop: boolean;
	is_playing: boolean;
	created_by: string;
	created_at: string;
	updated_at: string;
}

interface VTTAudioSettings {
	id: string;
	session_id: string;
	master_volume: number;
	music_volume: number;
	ambient_volume: number;
	sfx_volume: number;
	voice_chat_enabled: boolean;
	voice_chat_volume: number;
	updated_at: string;
}

const supabaseAny = supabase as unknown as {
	auth: { getUser: () => Promise<{ data: { user: { id: string } | null } }> };
	from: (table: string) => {
		select: (columns: string) => {
			eq: (
				col: string,
				val: string,
			) => {
				order: (
					col: string,
					opts?: { ascending: boolean },
				) => Promise<{ data: unknown; error: { message?: string } | null }>;
				maybeSingle: () => Promise<{
					data: unknown;
					error: { message?: string } | null;
				}>;
			};
		};
	};
	rpc: (
		fn: string,
		args?: unknown,
	) => Promise<{ data: unknown; error: { message?: string } | null }>;
};

export const useVTTAudioTracks = (sessionId: string) => {
	return useQuery({
		queryKey: ["vtt", "audio", "tracks", sessionId],
		queryFn: async (): Promise<VTTAudioTrack[]> => {
			if (!isSupabaseConfigured || !sessionId) return [];

			const { data, error } = await supabaseAny
				.from("vtt_audio_tracks")
				.select("*")
				.eq("session_id", sessionId)
				.order("created_at", { ascending: false });

			if (error) throw error;
			return (data || []) as VTTAudioTrack[];
		},
		enabled: !!sessionId,
	});
};

export const useVTTAudioSettings = (sessionId: string) => {
	return useQuery({
		queryKey: ["vtt", "audio", "settings", sessionId],
		queryFn: async (): Promise<VTTAudioSettings | null> => {
			if (!isSupabaseConfigured || !sessionId) return null;

			const { data, error } = await supabaseAny
				.from("vtt_audio_settings")
				.select("*")
				.eq("session_id", sessionId)
				.maybeSingle();

			if (error) throw error;
			return data as VTTAudioSettings | null;
		},
		enabled: !!sessionId,
	});
};

export const useCreateVTTAudioTrack = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (
			track: Omit<VTTAudioTrack, "id" | "created_at" | "updated_at">,
		): Promise<{ trackId: string }> => {
			if (!isSupabaseConfigured) {
				throw new AppError("Supabase not configured", "CONFIG");
			}

			const { data, error } = await supabaseAny.rpc(
				"create_vtt_audio_track",
				track,
			);
			if (error) throw error;

			return { trackId: data as string };
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["vtt", "audio", "tracks", variables.session_id],
			});
			toast({
				title: "Audio track added",
				description: "New audio track has been added to the VTT.",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to add audio track",
				description: error.message,
				variant: "destructive",
			});
		},
	});
};

export const useUpdateVTTAudioTrack = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (
			updates: {
				track_id: string;
				session_id: string;
			} & Partial<VTTAudioTrack>,
		): Promise<void> => {
			if (!isSupabaseConfigured) {
				throw new AppError("Supabase not configured", "CONFIG");
			}

			const { error } = await supabaseAny.rpc(
				"update_vtt_audio_track",
				updates,
			);
			if (error) throw error;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["vtt", "audio", "tracks", variables.session_id],
			});
		},
	});
};

export const useDeleteVTTAudioTrack = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async ({
			trackId,
			sessionId: _sessionId,
		}: {
			trackId: string;
			sessionId: string;
		}): Promise<void> => {
			if (!isSupabaseConfigured) {
				throw new AppError("Supabase not configured", "CONFIG");
			}

			const { error } = await supabaseAny.rpc("delete_vtt_audio_track", {
				track_id: trackId,
			});
			if (error) throw error;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["vtt", "audio", "tracks", variables.sessionId],
			});
			toast({
				title: "Audio track deleted",
				description: "Audio track has been removed from the VTT.",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to delete audio track",
				description: error.message,
				variant: "destructive",
			});
		},
	});
};

export const useUpdateVTTAudioSettings = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (
			settings: Partial<VTTAudioSettings> & { session_id: string },
		): Promise<void> => {
			if (!isSupabaseConfigured) {
				throw new AppError("Supabase not configured", "CONFIG");
			}

			const { error } = await supabaseAny.rpc(
				"update_vtt_audio_settings",
				settings,
			);
			if (error) throw error;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["vtt", "audio", "settings", variables.session_id],
			});
			toast({
				title: "Audio settings updated",
				description: "VTT audio settings have been saved.",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to update audio settings",
				description: error.message,
				variant: "destructive",
			});
		},
	});
};

// Audio playback utilities
class VTTAudioManager {
	private audioElements: Map<string, HTMLAudioElement> = new Map();
	private settings: VTTAudioSettings | null = null;

	setSettings(settings: VTTAudioSettings) {
		this.settings = settings;
		this.updateAllVolumes();
	}

	private updateAllVolumes() {
		if (!this.settings) return;

		for (const [_trackId, audio] of this.audioElements) {
			let volumeMultiplier = 1;
			// Apply category-specific volume
			const trackType = audio.dataset.type as "music" | "ambient" | "sfx";
			switch (trackType) {
				case "music":
					volumeMultiplier = this.settings.music_volume;
					break;
				case "ambient":
					volumeMultiplier = this.settings.ambient_volume;
					break;
				case "sfx":
					volumeMultiplier = this.settings.sfx_volume;
					break;
			}

			audio.volume =
				parseFloat(audio.dataset.volume || "1") *
				volumeMultiplier *
				this.settings.master_volume;
		}
	}

	async playTrack(track: VTTAudioTrack): Promise<void> {
		const audio = new Audio(track.url);
		audio.loop = track.loop;
		audio.volume = track.volume * (this.settings?.master_volume || 1);
		audio.dataset.type = track.type;
		audio.dataset.volume = track.volume.toString();

		this.audioElements.set(track.id, audio);

		try {
			await audio.play();
			// Update track status
			await this.updateTrackStatus(track.id, true);
		} catch (error: unknown) {
			logError("Failed to play audio track:", error);
			throw error;
		}
	}

	async stopTrack(trackId: string): Promise<void> {
		const audio = this.audioElements.get(trackId);
		if (audio) {
			audio.pause();
			audio.currentTime = 0;
			this.audioElements.delete(trackId);
			await this.updateTrackStatus(trackId, false);
		}
	}

	async pauseTrack(trackId: string): Promise<void> {
		const audio = this.audioElements.get(trackId);
		if (audio) {
			audio.pause();
			await this.updateTrackStatus(trackId, false);
		}
	}

	async resumeTrack(trackId: string): Promise<void> {
		const audio = this.audioElements.get(trackId);
		if (audio) {
			await audio.play();
			await this.updateTrackStatus(trackId, true);
		}
	}

	setTrackVolume(trackId: string, volume: number): void {
		const audio = this.audioElements.get(trackId);
		if (audio) {
			audio.dataset.volume = volume.toString();
			this.updateAllVolumes();
		}
	}

	private async updateTrackStatus(
		trackId: string,
		isPlaying: boolean,
	): Promise<void> {
		// This would typically update the database
		// For now, we'll just update the local state
		log(`Track ${trackId} ${isPlaying ? "playing" : "stopped"}`);
	}

	cleanup(): void {
		for (const audio of this.audioElements.values()) {
			audio.pause();
			audio.currentTime = 0;
		}
		this.audioElements.clear();
	}
}

// Singleton instance
export const vttAudioManager = new VTTAudioManager();
