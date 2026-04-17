/**
 * Unified Audio Protocol Hook
 *
 * Provides a single audio playback interface used by both
 * the Warden AudioManager and VTT session audio systems.
 * Handles browser autoplay policies, preloading, and graceful
 * error recovery with user-facing feedback.
 */

import { useCallback, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { log, error as logError } from "@/lib/logger";

/** Supported audio track types across both audio systems */
type AudioTrackType =
	| "music"
	| "ambient"
	| "sfx"
	| "effect"
	| "combat"
	| "exploration"
	| "social";

/** Options for playing a single audio URL */
interface PlayAudioOptions {
	/** Volume from 0–1 (default 0.7) */
	volume?: number;
	/** Whether to loop playback (default false) */
	loop?: boolean;
	/** Category for volume mixing */
	type?: AudioTrackType;
	/** If true, wait for `canplaythrough` before calling play (default true) */
	preload?: boolean;
}

/** Result from a play attempt */
interface PlayAudioResult {
	/** The HTMLAudioElement created (for external control) */
	audio: HTMLAudioElement;
	/** Whether playback started successfully */
	success: boolean;
	/** If playback failed, the reason */
	error?: "autoplay_blocked" | "aborted" | "network" | "unknown";
}

/** Master volume settings for mixing */
interface AudioMixSettings {
	masterVolume: number;
	musicVolume: number;
	ambientVolume: number;
	sfxVolume: number;
}

const DEFAULT_MIX: AudioMixSettings = {
	masterVolume: 1,
	musicVolume: 1,
	ambientVolume: 1,
	sfxVolume: 1,
};

/**
 * Computes effective volume for a track type given mix settings
 */
function computeEffectiveVolume(
	baseVolume: number,
	type: AudioTrackType | undefined,
	mix: AudioMixSettings,
): number {
	let categoryMultiplier = 1;
	switch (type) {
		case "music":
		case "combat":
		case "exploration":
		case "social":
			categoryMultiplier = mix.musicVolume;
			break;
		case "ambient":
			categoryMultiplier = mix.ambientVolume;
			break;
		case "sfx":
		case "effect":
			categoryMultiplier = mix.sfxVolume;
			break;
	}
	return Math.max(
		0,
		Math.min(1, baseVolume * categoryMultiplier * mix.masterVolume),
	);
}

/**
 * Core audio playback function that handles browser autoplay policies.
 * Must be called from a direct user interaction (onClick) call stack
 * to comply with browser autoplay requirements.
 */
async function playAudioElement(
	audio: HTMLAudioElement,
	options: { preload?: boolean },
): Promise<{ success: boolean; error?: PlayAudioResult["error"] }> {
	// Optionally wait for audio to be ready
	if (options.preload !== false && audio.readyState < 3) {
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
		return { success: true };
	} catch (err: unknown) {
		if (err instanceof DOMException) {
			if (err.name === "NotAllowedError") {
				log(
					"Audio playback blocked by browser autoplay policy. User interaction required.",
				);
				return { success: false, error: "autoplay_blocked" };
			}
			if (err.name === "AbortError") {
				log("Audio playback aborted (rapid play/pause).");
				return { success: false, error: "aborted" };
			}
		}
		logError("Audio playback failed:", err);
		return { success: false, error: "unknown" };
	}
}

/**
 * Unified audio protocol hook for Rift Ascendant.
 *
 * Provides `playAudio`, `stopAudio`, and `setMixSettings` methods
 * that work correctly with browser autoplay policies and provide
 * user-facing toast feedback on failures.
 *
 * @example
 * ```tsx
 * const { playAudio, stopAudio } = useAudioProtocol();
 *
 * const handleClick = async () => {
 *   const result = await playAudio("/audio/combat.mp3", {
 *     volume: 0.8,
 *     type: "combat",
 *     loop: true,
 *   });
 *   if (!result.success) console.log("Failed:", result.error);
 * };
 * ```
 */
export function useAudioProtocol() {
	const { toast } = useToast();
	const activeAudioRef = useRef<Map<string, HTMLAudioElement>>(new Map());
	const mixRef = useRef<AudioMixSettings>(DEFAULT_MIX);

	/** Play audio from a URL. Should be called from a user interaction handler. */
	const playAudio = useCallback(
		async (
			url: string,
			options: PlayAudioOptions = {},
		): Promise<PlayAudioResult> => {
			const { volume = 0.7, loop = false, type, preload = true } = options;

			const audio = new Audio(url);
			audio.preload = preload ? "auto" : "none";
			audio.loop = loop;
			audio.volume = computeEffectiveVolume(volume, type, mixRef.current);

			// Store type/volume metadata for later mix adjustments
			audio.dataset.type = type ?? "";
			audio.dataset.baseVolume = volume.toString();

			const result = await playAudioElement(audio, { preload });

			if (result.success) {
				// Track active audio by URL for stop/cleanup
				const existing = activeAudioRef.current.get(url);
				if (existing) {
					existing.pause();
					existing.currentTime = 0;
				}
				activeAudioRef.current.set(url, audio);

				// Auto-cleanup when track ends naturally
				audio.addEventListener(
					"ended",
					() => {
						if (!audio.loop) {
							activeAudioRef.current.delete(url);
						}
					},
					{ once: true },
				);
			} else if (result.error === "autoplay_blocked") {
				toast({
					title: "Audio Blocked",
					description:
						"Click anywhere on the page first, then try again. Browsers require a user interaction before audio can play.",
					variant: "destructive",
				});
			} else if (result.error === "unknown") {
				toast({
					title: "Audio Error",
					description:
						"Failed to play audio. The file may be missing or in an unsupported format.",
					variant: "destructive",
				});
			}

			return { audio, ...result };
		},
		[toast],
	);

	/** Stop audio playing from a specific URL */
	const stopAudio = useCallback((url: string) => {
		const audio = activeAudioRef.current.get(url);
		if (audio) {
			audio.pause();
			audio.currentTime = 0;
			activeAudioRef.current.delete(url);
		}
	}, []);

	/** Stop all currently active audio */
	const stopAll = useCallback(() => {
		for (const audio of activeAudioRef.current.values()) {
			audio.pause();
			audio.currentTime = 0;
		}
		activeAudioRef.current.clear();
	}, []);

	/** Pause audio from a specific URL (retains position) */
	const pauseAudio = useCallback((url: string) => {
		const audio = activeAudioRef.current.get(url);
		if (audio) {
			audio.pause();
		}
	}, []);

	/** Resume paused audio from a specific URL */
	const resumeAudio = useCallback(
		async (url: string): Promise<boolean> => {
			const audio = activeAudioRef.current.get(url);
			if (!audio) return false;

			const result = await playAudioElement(audio, { preload: false });
			if (!result.success && result.error === "autoplay_blocked") {
				toast({
					title: "Audio Blocked",
					description: "Click anywhere on the page first, then try again.",
					variant: "destructive",
				});
			}
			return result.success;
		},
		[toast],
	);

	/** Set the volume of an active audio track */
	const setVolume = useCallback((url: string, volume: number) => {
		const audio = activeAudioRef.current.get(url);
		if (audio) {
			const type = (audio.dataset.type || undefined) as
				| AudioTrackType
				| undefined;
			audio.dataset.baseVolume = volume.toString();
			audio.volume = computeEffectiveVolume(volume, type, mixRef.current);
		}
	}, []);

	/** Update master mix settings and recalculate all active volumes */
	const setMixSettings = useCallback((settings: Partial<AudioMixSettings>) => {
		mixRef.current = { ...mixRef.current, ...settings };

		// Recalculate volume for all active audio
		for (const audio of activeAudioRef.current.values()) {
			const type = (audio.dataset.type || undefined) as
				| AudioTrackType
				| undefined;
			const baseVolume = Number.parseFloat(audio.dataset.baseVolume ?? "0.7");
			audio.volume = computeEffectiveVolume(baseVolume, type, mixRef.current);
		}
	}, []);

	/** Get current mix settings */
	const getMixSettings = useCallback((): AudioMixSettings => {
		return { ...mixRef.current };
	}, []);

	/** Check if a specific URL is currently playing */
	const isPlaying = useCallback((url: string): boolean => {
		const audio = activeAudioRef.current.get(url);
		return !!audio && !audio.paused;
	}, []);

	return {
		playAudio,
		stopAudio,
		stopAll,
		pauseAudio,
		resumeAudio,
		setVolume,
		setMixSettings,
		getMixSettings,
		isPlaying,
	};
}

export type {
	PlayAudioOptions,
	PlayAudioResult,
	AudioMixSettings,
	AudioTrackType,
};
