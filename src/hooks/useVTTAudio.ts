import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { AppError } from "@/lib/appError";
import type { Playlist } from "@/lib/audio/types";
import { log, error as logError } from "@/lib/logger";

export interface VTTAudioTrack {
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

export interface VTTAudioSettings {
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

export interface VTTPlaylistState {
	playlist: Playlist | null;
	queue: VTTAudioTrack[];
	currentIndex: number;
	currentTrackId: string | null;
	isPlaying: boolean;
	crossfadeSeconds: number;
	repeat: "none" | "one" | "all";
	shuffle: boolean;
	error: string | null;
}

const DEFAULT_PLAYLIST_STATE: VTTPlaylistState = {
	playlist: null,
	queue: [],
	currentIndex: -1,
	currentTrackId: null,
	isPlaying: false,
	crossfadeSeconds: 2,
	repeat: "none",
	shuffle: false,
	error: null,
};

const clampUnit = (value: number) => Math.max(0, Math.min(1, value));

export const calculateCrossfadeGain = (
	progress: number,
	direction: "in" | "out",
) => {
	const clamped = clampUnit(progress);
	const eased = clamped * clamped * (3 - 2 * clamped);
	return direction === "in" ? eased : 1 - eased;
};

export const useVTTAudioTracks = (sessionId: string) => {
	return useQuery({
		queryKey: ["vtt", "audio", "tracks", sessionId],
		queryFn: async (): Promise<VTTAudioTrack[]> => {
			if (!isSupabaseConfigured || !sessionId) return [];

			const { data, error } = await supabase
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

			const { data, error } = await supabase
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

			const { data, error } = await supabase
				.from("vtt_audio_tracks")
				.insert({
					...track,
					type: track.type as "music" | "ambient" | "sfx",
				})
				.select("id")
				.single();

			if (error) throw error;

			return { trackId: data.id };
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

			const { track_id, ...rest } = updates;
			const { error } = await supabase
				.from("vtt_audio_tracks")
				.update({
					...rest,
					type: rest.type as "music" | "ambient" | "sfx" | undefined,
				})
				.eq("id", track_id);
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

			const { error } = await supabase
				.from("vtt_audio_tracks")
				.delete()
				.eq("id", trackId);
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

			const { session_id, ...rest } = settings;
			const { error } = await supabase
				.from("vtt_audio_settings")
				.update(rest)
				.eq("session_id", session_id);
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
	private playlistState: VTTPlaylistState = DEFAULT_PLAYLIST_STATE;
	private playlistListeners = new Set<(state: VTTPlaylistState) => void>();
	private playlistCrossfadeTimer: ReturnType<typeof setInterval> | null = null;

	setSettings(settings: VTTAudioSettings) {
		this.settings = settings;
		this.updateAllVolumes();
	}

	subscribePlaylist(listener: (state: VTTPlaylistState) => void) {
		this.playlistListeners.add(listener);
		listener(this.getPlaylistState());
		return () => {
			this.playlistListeners.delete(listener);
		};
	}

	getPlaylistState(): VTTPlaylistState {
		return {
			...this.playlistState,
			queue: [...this.playlistState.queue],
		};
	}

	private emitPlaylistState() {
		const state = this.getPlaylistState();
		for (const listener of this.playlistListeners) {
			listener(state);
		}
	}

	private updatePlaylistState(patch: Partial<VTTPlaylistState>) {
		this.playlistState = {
			...this.playlistState,
			...patch,
		};
		this.emitPlaylistState();
	}

	private getTypeVolumeMultiplier(type: VTTAudioTrack["type"]) {
		if (!this.settings) return 1;
		switch (type) {
			case "music":
				return this.settings.music_volume * this.settings.master_volume;
			case "ambient":
				return this.settings.ambient_volume * this.settings.master_volume;
			case "sfx":
				return this.settings.sfx_volume * this.settings.master_volume;
			default:
				return this.settings.master_volume;
		}
	}

	private setAudioVolume(
		audio: HTMLAudioElement,
		type: VTTAudioTrack["type"],
		volume: number,
	) {
		const baseVolume = clampUnit(volume);
		audio.dataset.volume = baseVolume.toString();
		audio.volume = clampUnit(baseVolume * this.getTypeVolumeMultiplier(type));
	}

	private createAudioElement(
		track: VTTAudioTrack,
		volume = track.volume,
		loop = track.loop,
	) {
		const audio = new Audio(track.url);
		audio.preload = "auto";
		audio.loop = loop;
		audio.dataset.type = track.type;
		this.setAudioVolume(audio, track.type, volume);
		return audio;
	}

	private async waitForReady(audio: HTMLAudioElement) {
		if (audio.readyState >= 3) return;
		await new Promise<void>((resolve, reject) => {
			const onReady = () => {
				audio.removeEventListener("canplaythrough", onReady);
				audio.removeEventListener("error", onError);
				resolve();
			};
			const onError = () => {
				audio.removeEventListener("canplaythrough", onReady);
				audio.removeEventListener("error", onError);
				reject(new Error("Audio failed to load"));
			};
			audio.addEventListener("canplaythrough", onReady, { once: true });
			audio.addEventListener("error", onError, { once: true });
			if (audio.readyState >= 3) {
				audio.removeEventListener("canplaythrough", onReady);
				audio.removeEventListener("error", onError);
				resolve();
			}
		});
	}

	private clearCrossfadeTimer() {
		if (this.playlistCrossfadeTimer) {
			clearInterval(this.playlistCrossfadeTimer);
			this.playlistCrossfadeTimer = null;
		}
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
		audio.preload = "auto";
		audio.loop = track.loop;
		audio.volume = track.volume * (this.settings?.master_volume || 1);
		audio.dataset.type = track.type;
		audio.dataset.volume = track.volume.toString();

		this.audioElements.set(track.id, audio);

		// Wait for audio to buffer enough data before attempting playback
		if (audio.readyState < 3) {
			await new Promise<void>((resolve, reject) => {
				const onReady = () => {
					audio.removeEventListener("canplaythrough", onReady);
					audio.removeEventListener("error", onError);
					resolve();
				};
				const onError = () => {
					audio.removeEventListener("canplaythrough", onReady);
					audio.removeEventListener("error", onError);
					reject(new Error("Audio failed to load"));
				};
				audio.addEventListener("canplaythrough", onReady, { once: true });
				audio.addEventListener("error", onError, { once: true });
				// If already buffered, resolve immediately
				if (audio.readyState >= 3) {
					audio.removeEventListener("canplaythrough", onReady);
					audio.removeEventListener("error", onError);
					resolve();
				}
			});
		}

		try {
			await audio.play();
			await this.updateTrackStatus(track.id, true);
		} catch (error: unknown) {
			// Handle browser autoplay policy gracefully — don't crash the caller
			if (error instanceof DOMException && error.name === "NotAllowedError") {
				log(
					`Audio playback blocked by browser autoplay policy for track ${track.id}. User interaction required.`,
				);
			} else if (error instanceof DOMException && error.name === "AbortError") {
				log(`Audio playback aborted for track ${track.id} (rapid play/pause).`);
			} else {
				logError("Failed to play audio track:", error);
			}
		}
	}

	loadPlaylist(
		playlist: Playlist,
		tracks: VTTAudioTrack[],
		startIndex = 0,
	): VTTPlaylistState {
		const trackById = new Map(tracks.map((track) => [track.id, track]));
		const queue = playlist.tracks
			.map((trackId) => trackById.get(trackId))
			.filter((track): track is VTTAudioTrack => !!track);
		const orderedQueue = playlist.shuffle
			? [...queue].sort(() => Math.random() - 0.5)
			: queue;
		const currentIndex =
			orderedQueue.length > 0
				? Math.max(0, Math.min(startIndex, orderedQueue.length - 1))
				: -1;
		this.updatePlaylistState({
			playlist,
			queue: orderedQueue,
			currentIndex,
			currentTrackId: null,
			isPlaying: false,
			crossfadeSeconds: playlist.crossfade,
			repeat: playlist.repeat,
			shuffle: playlist.shuffle,
			error: null,
		});
		return this.getPlaylistState();
	}

	async playPlaylist(
		playlist: Playlist,
		tracks: VTTAudioTrack[],
		startIndex = 0,
	): Promise<void> {
		const state = this.loadPlaylist(playlist, tracks, startIndex);
		if (state.currentIndex >= 0) {
			await this.playPlaylistIndex(state.currentIndex, false);
		}
	}

	async playNext(crossfade = true): Promise<void> {
		const { currentIndex, queue, repeat } = this.playlistState;
		if (queue.length === 0) return;
		if (repeat === "one") {
			await this.playPlaylistIndex(Math.max(currentIndex, 0), crossfade);
			return;
		}
		const nextIndex = currentIndex + 1;
		if (nextIndex < queue.length) {
			await this.playPlaylistIndex(nextIndex, crossfade);
			return;
		}
		if (repeat === "all") {
			await this.playPlaylistIndex(0, crossfade);
			return;
		}
		await this.finishPlaylist();
	}

	async playPrevious(crossfade = true): Promise<void> {
		const { currentIndex, queue, repeat } = this.playlistState;
		if (queue.length === 0) return;
		const previousIndex = currentIndex - 1;
		if (previousIndex >= 0) {
			await this.playPlaylistIndex(previousIndex, crossfade);
			return;
		}
		if (repeat === "all") {
			await this.playPlaylistIndex(queue.length - 1, crossfade);
			return;
		}
		await this.playPlaylistIndex(0, crossfade);
	}

	async pausePlaylist(): Promise<void> {
		const currentTrackId = this.playlistState.currentTrackId;
		if (!currentTrackId) return;
		await this.pauseTrack(currentTrackId);
		this.updatePlaylistState({ isPlaying: false });
	}

	async resumePlaylist(): Promise<void> {
		const { currentIndex, currentTrackId, queue } = this.playlistState;
		if (queue.length === 0) return;
		const audio = currentTrackId
			? this.audioElements.get(currentTrackId)
			: null;
		if (audio && currentTrackId) {
			try {
				await audio.play();
				await this.updateTrackStatus(currentTrackId, true);
				this.updatePlaylistState({ isPlaying: true, error: null });
			} catch (error: unknown) {
				this.handlePlaybackError(currentTrackId, error);
			}
			return;
		}
		await this.playPlaylistIndex(Math.max(currentIndex, 0), false);
	}

	async stopPlaylist(): Promise<void> {
		this.clearCrossfadeTimer();
		const queueIds = new Set(this.playlistState.queue.map((track) => track.id));
		for (const trackId of queueIds) {
			const audio = this.audioElements.get(trackId);
			if (audio) {
				audio.pause();
				audio.currentTime = 0;
				audio.onended = null;
				this.audioElements.delete(trackId);
				await this.updateTrackStatus(trackId, false);
			}
		}
		this.updatePlaylistState(DEFAULT_PLAYLIST_STATE);
	}

	private async playPlaylistIndex(
		index: number,
		crossfade: boolean,
	): Promise<void> {
		const track = this.playlistState.queue[index];
		if (!track) return;
		const previousTrackId = this.playlistState.currentTrackId;
		const previousAudio = previousTrackId
			? this.audioElements.get(previousTrackId)
			: null;
		const previousTrack = previousTrackId
			? this.playlistState.queue.find((item) => item.id === previousTrackId)
			: null;
		if (previousTrackId === track.id && previousAudio) {
			previousAudio.pause();
			previousAudio.currentTime = 0;
			previousAudio.onended = null;
			this.audioElements.delete(previousTrackId);
		}

		const targetVolume = clampUnit(
			track.volume * (this.playlistState.playlist?.volume ?? 1),
		);
		const shouldCrossfade =
			crossfade &&
			!!previousAudio &&
			!!previousTrack &&
			previousTrackId !== track.id &&
			this.playlistState.crossfadeSeconds > 0;
		const audio = this.createAudioElement(
			track,
			shouldCrossfade ? 0 : targetVolume,
			this.playlistState.repeat === "one",
		);
		audio.onended = () => {
			if (this.playlistState.currentTrackId === track.id) {
				void this.playNext(true);
			}
		};
		this.audioElements.set(track.id, audio);

		try {
			await this.waitForReady(audio);
			await audio.play();
			await this.updateTrackStatus(track.id, true);
			this.updatePlaylistState({
				currentIndex: index,
				currentTrackId: track.id,
				isPlaying: true,
				error: null,
			});
			if (shouldCrossfade && previousTrackId && previousTrack) {
				this.crossfadeAudio(
					previousTrackId,
					previousAudio,
					previousTrack,
					audio,
					track,
					targetVolume,
					this.playlistState.crossfadeSeconds * 1000,
				);
			} else if (
				previousTrackId &&
				previousAudio &&
				previousTrackId !== track.id
			) {
				previousAudio.pause();
				previousAudio.currentTime = 0;
				previousAudio.onended = null;
				this.audioElements.delete(previousTrackId);
				void this.updateTrackStatus(previousTrackId, false);
			}
		} catch (error: unknown) {
			this.handlePlaybackError(track.id, error);
		}
	}

	private crossfadeAudio(
		previousTrackId: string,
		previousAudio: HTMLAudioElement,
		previousTrack: VTTAudioTrack,
		nextAudio: HTMLAudioElement,
		nextTrack: VTTAudioTrack,
		nextTargetVolume: number,
		durationMs: number,
	) {
		this.clearCrossfadeTimer();
		const previousBaseVolume = parseFloat(
			previousAudio.dataset.volume || previousTrack.volume.toString(),
		);
		const startedAt = Date.now();
		const finish = () => {
			this.clearCrossfadeTimer();
			previousAudio.pause();
			previousAudio.currentTime = 0;
			previousAudio.onended = null;
			this.audioElements.delete(previousTrackId);
			this.setAudioVolume(nextAudio, nextTrack.type, nextTargetVolume);
			void this.updateTrackStatus(previousTrackId, false);
		};
		this.playlistCrossfadeTimer = setInterval(() => {
			const progress = (Date.now() - startedAt) / durationMs;
			if (progress >= 1) {
				finish();
				return;
			}
			this.setAudioVolume(
				previousAudio,
				previousTrack.type,
				previousBaseVolume * calculateCrossfadeGain(progress, "out"),
			);
			this.setAudioVolume(
				nextAudio,
				nextTrack.type,
				nextTargetVolume * calculateCrossfadeGain(progress, "in"),
			);
		}, 50);
	}

	private async finishPlaylist() {
		const currentTrackId = this.playlistState.currentTrackId;
		if (currentTrackId) {
			const audio = this.audioElements.get(currentTrackId);
			if (audio) {
				audio.pause();
				audio.currentTime = 0;
				audio.onended = null;
				this.audioElements.delete(currentTrackId);
			}
			await this.updateTrackStatus(currentTrackId, false);
		}
		this.updatePlaylistState({
			currentTrackId: null,
			isPlaying: false,
		});
	}

	private handlePlaybackError(trackId: string, error: unknown) {
		if (error instanceof DOMException && error.name === "NotAllowedError") {
			log(
				`Audio playback blocked by browser autoplay policy for track ${trackId}. User interaction required.`,
			);
		} else if (error instanceof DOMException && error.name === "AbortError") {
			log(`Audio playback aborted for track ${trackId} (rapid play/pause).`);
		} else {
			logError("Failed to play audio track:", error);
		}
		this.updatePlaylistState({
			isPlaying: false,
			error: error instanceof Error ? error.message : "Audio playback failed",
		});
	}

	async stopTrack(trackId: string): Promise<void> {
		const audio = this.audioElements.get(trackId);
		if (audio) {
			audio.pause();
			audio.currentTime = 0;
			audio.onended = null;
			this.audioElements.delete(trackId);
			await this.updateTrackStatus(trackId, false);
		}
		if (this.playlistState.currentTrackId === trackId) {
			this.clearCrossfadeTimer();
			this.updatePlaylistState({
				currentTrackId: null,
				isPlaying: false,
			});
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
			try {
				await audio.play();
				await this.updateTrackStatus(trackId, true);
			} catch (error: unknown) {
				if (
					error instanceof DOMException &&
					(error.name === "NotAllowedError" || error.name === "AbortError")
				) {
					log(`Audio resume blocked for track ${trackId}: ${error.name}`);
				} else {
					logError("Failed to resume audio track:", error);
				}
			}
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
		this.clearCrossfadeTimer();
		for (const audio of this.audioElements.values()) {
			audio.pause();
			audio.currentTime = 0;
			audio.onended = null;
		}
		this.audioElements.clear();
		this.updatePlaylistState(DEFAULT_PLAYLIST_STATE);
	}
}

// Singleton instance
export const vttAudioManager = new VTTAudioManager();

export const useVTTPlaylistState = () => {
	const [state, setState] = useState<VTTPlaylistState>(() =>
		vttAudioManager.getPlaylistState(),
	);
	useEffect(() => vttAudioManager.subscribePlaylist(setState), []);
	return state;
};
