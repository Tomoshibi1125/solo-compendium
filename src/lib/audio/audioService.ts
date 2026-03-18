/**
 * Audio Player Service
 * Legal-safe sounds and music management for Wardens
 */

import { Howl, Howler } from "howler";
import { logger } from "@/lib/logger";
import { loadAudioFile } from "./storage";
import type {
	AudioPlayerState,
	AudioSettings,
	AudioTrack,
	Playlist,
} from "./types";
import { DEFAULT_AUDIO_SETTINGS } from "./types";

class AudioService {
	private audio: Howl | null = null;
	private state: AudioPlayerState = {
		currentTrack: null,
		isPlaying: false,
		volume: DEFAULT_AUDIO_SETTINGS.masterVolume,
		currentTime: 0,
		duration: 0,
		isLoading: false,
		error: null,
		playlist: null,
		currentTrackIndex: 0,
		repeat: "none",
		shuffle: false,
	};
	private settings: AudioSettings = DEFAULT_AUDIO_SETTINGS;
	private listeners: Set<(state: AudioPlayerState) => void> = new Set();
	private fadeTimeout: ReturnType<typeof setTimeout> | null = null;
	private activeObjectUrl: string | null = null;
	private playlistTracks: AudioTrack[] = [];

	constructor() {
		// Load settings from localStorage
		this.loadSettings();

		// Initialize audio context
		if (typeof window !== "undefined") {
			this.setupAudioElement();
		}
	}

	private setupAudioElement() {
		// Howler manages global audio context internally
		Howler.autoSuspend = false;
	}

	private updateState(updates: Partial<AudioPlayerState>) {
		this.state = { ...this.state, ...updates };
		this.notifyListeners();
	}

	private notifyListeners() {
		this.listeners.forEach((listener) => {
			listener(this.state);
		});
	}

	private handleTrackEnd() {
		const { repeat, playlist, currentTrackIndex } = this.state;

		if (repeat === "one") {
			this.play();
		} else if (
			repeat === "all" ||
			(repeat === "none" &&
				playlist &&
				currentTrackIndex < playlist.tracks.length - 1)
		) {
			this.next();
		} else {
			this.updateState({ isPlaying: false });
		}
	}

	// Public API
	async loadTrack(track: AudioTrack) {
		try {
			this.updateState({ isLoading: true, error: null });

			if (this.audio) {
				this.audio.unload();
			}

			let srcUrl = track.url;

			// Load the audio source
			if (track.isLocal && track.localPath) {
				if (track.localPath.startsWith("audio-db:")) {
					const blob = await loadAudioFile(track.id);
					if (!blob) {
						throw new Error("Local audio file not found");
					}
					const objectUrl = URL.createObjectURL(blob);
					this.setActiveObjectUrl(objectUrl);
					srcUrl = objectUrl;
				} else {
					this.clearActiveObjectUrl();
					srcUrl = track.localPath;
				}
			} else {
				this.clearActiveObjectUrl();
			}

			this.audio = new Howl({
				src: [srcUrl],
				volume: track.volume * this.settings.masterVolume,
				loop: track.loop,
				html5: true, // Use streaming for large files
				onload: () => {
					this.updateState({
						isLoading: false,
						duration: this.audio?.duration() || 0,
					});
				},
				onplay: () => {
					this.updateState({ isPlaying: true });
					this.startProgressTimer();
				},
				onpause: () => {
					this.updateState({ isPlaying: false });
					this.stopProgressTimer();
				},
				onstop: () => {
					this.updateState({ isPlaying: false, currentTime: 0 });
					this.stopProgressTimer();
				},
				onend: () => {
					this.handleTrackEnd();
				},
				onloaderror: (_id, error) => {
					this.updateState({
						isLoading: false,
						error: `Failed to load audio: ${error}`,
					});
				},
				onvolume: () => {
					this.updateState({
						volume: (this.audio?.volume() as number) || 0,
					});
				},
			});

			// Update state
			this.updateState({
				currentTrack: track,
				error: null,
			});
		} catch (error) {
			this.updateState({
				isLoading: false,
				error: error instanceof Error ? error.message : "Failed to load track",
			});
		}
	}
	async play() {
		if (!this.audio || !this.state.currentTrack) return;

		try {
			this.audio.play();
		} catch (error) {
			this.updateState({
				error: error instanceof Error ? error.message : "Failed to play",
			});
		}
	}

	pause() {
		if (!this.audio) return;
		this.audio.pause();
	}

	stop() {
		if (!this.audio) return;
		this.audio.stop();
	}

	private progressTimer: ReturnType<typeof setInterval> | null = null;

	private startProgressTimer() {
		this.stopProgressTimer();
		this.progressTimer = setInterval(() => {
			if (this.audio && this.state.isPlaying) {
				this.updateState({ currentTime: (this.audio.seek() as number) || 0 });
			}
		}, 1000);
	}

	private stopProgressTimer() {
		if (this.progressTimer) {
			clearInterval(this.progressTimer);
			this.progressTimer = null;
		}
	}
	async next() {
		const { playlist, currentTrackIndex, shuffle } = this.state;

		if (!playlist || playlist.tracks.length === 0) return;

		let nextIndex = currentTrackIndex;

		if (shuffle) {
			// Get random index that's not the current one
			do {
				nextIndex = Math.floor(Math.random() * playlist.tracks.length);
			} while (nextIndex === currentTrackIndex && playlist.tracks.length > 1);
		} else {
			nextIndex = (currentTrackIndex + 1) % playlist.tracks.length;
		}

		this.updateState({ currentTrackIndex: nextIndex });
		const nextTrack = this.playlistTracks[nextIndex];
		if (nextTrack) {
			await this.loadTrack(nextTrack);
			if (this.state.isPlaying) {
				await this.play();
			}
		}
	}

	async previous() {
		const { playlist, currentTrackIndex, shuffle } = this.state;

		if (!playlist || playlist.tracks.length === 0) return;

		let prevIndex = currentTrackIndex;

		if (shuffle) {
			// Get random index that's not the current one
			do {
				prevIndex = Math.floor(Math.random() * playlist.tracks.length);
			} while (prevIndex === currentTrackIndex && playlist.tracks.length > 1);
		} else {
			prevIndex =
				currentTrackIndex === 0
					? playlist.tracks.length - 1
					: currentTrackIndex - 1;
		}

		this.updateState({ currentTrackIndex: prevIndex });
		const prevTrack = this.playlistTracks[prevIndex];
		if (prevTrack) {
			await this.loadTrack(prevTrack);
			if (this.state.isPlaying) {
				await this.play();
			}
		}
	}

	setVolume(volume: number) {
		if (!this.audio) return;

		const clampedVolume = Math.max(0, Math.min(1, volume));
		this.audio.volume(clampedVolume);
		this.updateState({ volume: clampedVolume });
	}

	setMasterVolume(volume: number) {
		const clampedVolume = Math.max(0, Math.min(1, volume));
		this.settings.masterVolume = clampedVolume;
		this.saveSettings();

		if (this.audio && this.state.currentTrack) {
			this.audio.volume(this.state.currentTrack.volume * clampedVolume);
		}
	}

	setCurrentTime(time: number) {
		if (!this.audio) return;

		this.audio.seek(time);
		this.updateState({ currentTime: time });
	}

	setRepeat(repeat: "none" | "one" | "all") {
		this.updateState({ repeat });
	}

	setShuffle(shuffle: boolean) {
		this.updateState({ shuffle });
	}

	// Playlist management
	loadPlaylist(playlist: Playlist, tracks: AudioTrack[] = [], startIndex = 0) {
		this.playlistTracks = tracks;
		this.updateState({
			playlist,
			currentTrackIndex: startIndex,
		});

		const track = this.playlistTracks[startIndex];
		if (track) {
			void this.loadTrack(track);
		}
	}

	// Volume fading
	fadeIn(duration = 2000, targetVolume?: number) {
		if (!this.audio || !this.state.currentTrack) return;

		const startVolume = this.audio.volume() as number;
		const target =
			targetVolume ??
			this.state.currentTrack.volume * this.settings.masterVolume;

		this.audio.fade(startVolume, target, duration);
	}

	fadeOut(duration = 2000) {
		if (!this.audio) return;

		const startVolume = this.audio.volume() as number;
		this.audio.fade(startVolume, 0, duration);

		// Stop playback after fading out
		const id = this.audio.play(); // Assuming Howler 2.x returns the ID
		this.audio.once(
			"fade",
			() => {
				if (this.audio) this.audio.stop(id);
			},
			id,
		);
	}

	private clearFadeTimeout() {
		if (this.fadeTimeout) {
			clearTimeout(this.fadeTimeout);
			this.fadeTimeout = null;
		}
	}

	private setActiveObjectUrl(url: string) {
		this.clearActiveObjectUrl();
		this.activeObjectUrl = url;
	}

	private clearActiveObjectUrl() {
		if (this.activeObjectUrl) {
			URL.revokeObjectURL(this.activeObjectUrl);
			this.activeObjectUrl = null;
		}
	}

	// Settings management
	private loadSettings() {
		if (typeof window === "undefined") return;

		try {
			const saved = localStorage.getItem("audio-settings");
			if (saved) {
				this.settings = { ...DEFAULT_AUDIO_SETTINGS, ...JSON.parse(saved) };
			}
		} catch (error) {
			logger.error("Failed to load audio settings:", error);
		}
	}

	private saveSettings() {
		if (typeof window === "undefined") return;

		try {
			localStorage.setItem("audio-settings", JSON.stringify(this.settings));
		} catch (error) {
			logger.error("Failed to save audio settings:", error);
		}
	}

	updateSettings(updates: Partial<AudioSettings>) {
		this.settings = { ...this.settings, ...updates };
		this.saveSettings();

		// Apply master volume change immediately
		if (
			updates.masterVolume !== undefined &&
			this.audio &&
			this.state.currentTrack
		) {
			this.audio.volume(this.state.currentTrack.volume * updates.masterVolume);
		}
	}

	getSettings(): AudioSettings {
		return { ...this.settings };
	}

	getState(): AudioPlayerState {
		return { ...this.state };
	}

	// Event listeners
	subscribe(listener: (state: AudioPlayerState) => void) {
		this.listeners.add(listener);
		return () => this.listeners.delete(listener);
	}

	// Cleanup
	destroy() {
		this.clearFadeTimeout();
		this.clearActiveObjectUrl();
		this.stopProgressTimer();
		this.listeners.clear();

		if (this.audio) {
			this.audio.stop();
			this.audio.unload();
			this.audio = null;
		}
	}
}

// Singleton instance
export const audioService = new AudioService();
