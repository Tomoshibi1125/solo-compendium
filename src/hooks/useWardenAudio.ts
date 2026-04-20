/**
 * useWardenAudio
 *
 * Provides concrete implementations of onPlaySound and onMusicChange for
 * WardenToolsPanel and any other Warden UI that needs audio control.
 *
 * Routing logic:
 *   onPlaySound(id)  — looks up id in SFX_ASSET_MAP:
 *     • type "file"  → loads the local file via audioService (Howler.js),
 *                      plays it once (non-looping)
 *     • type "mood"  → fires a short VttMusicEngine burst (2 s) then stops,
 *                      leaving music unchanged
 *     • unknown id   → no-op (logged to console.warn)
 *
 *   onMusicChange(id) — resolves id from:
 *     1. MOOD_TAGS list  → plays matching VttMusicEngine mood (fades in)
 *     2. MUSIC_ASSETS    → loads the local file via audioService (looping)
 *     3. AUDIO_ASSETS    → vtt-engine:// → VttMusicEngine,
 *                          local path    → audioService
 *     4. "stop"          → stops both engines
 *     5. unknown         → console.warn, no-op
 *
 * The hook owns a single VttMusicEngine singleton and exposes volume control.
 */

import { useCallback, useEffect, useRef } from "react";
import { audioService } from "@/lib/audio/audioService";
import type { AudioTrack } from "@/lib/audio/types";
import {
	AUDIO_ASSETS,
	MUSIC_ASSETS,
	SFX_ASSET_MAP,
} from "@/lib/vtt/vttAssetManifest";
import { type MusicMood, VttMusicEngine } from "@/lib/vtt/vttMusicEngine";

// ---------------------------------------------------------------------------
// Mood tag → MusicMood mapping
// Covers every string in MOOD_TAGS from @/lib/audio/types and the quickMusic
// ids used in WardenToolsPanel ("epic", "tense", "mysterious", etc.)
// ---------------------------------------------------------------------------
const MOOD_TO_ENGINE: Record<string, MusicMood> = {
	// MOOD_TAGS
	epic:          "boss-epic",
	tense:         "combat-tension",
	mysterious:    "mystical-wonder",
	peaceful:      "forest-peaceful",
	dramatic:      "combat-tension",
	dark:          "horror-dread",
	heroic:        "victory-triumph",
	magical:       "mystical-wonder",
	ancient:       "dungeon-exploration",
	industrial:    "city-bustle",
	nature:        "forest-peaceful",
	urban:         "city-bustle",
	battle:        "combat-tension",
	stealth:       "stealth-suspense",
	investigation: "stealth-suspense",
	celebration:   "victory-triumph",
	somber:        "sadness-loss",
	// WardenToolsPanel quickMusic ids (come from MOOD_TAGS at runtime)
	"dungeon-exploration": "dungeon-exploration",
	"tavern-calm":         "tavern-calm",
	"combat-tension":      "combat-tension",
	"boss-epic":           "boss-epic",
	"forest-peaceful":     "forest-peaceful",
	"ocean-ambient":       "ocean-ambient",
	"city-bustle":         "city-bustle",
	"cave-drip":           "cave-drip",
	"mystical-wonder":     "mystical-wonder",
	"horror-dread":        "horror-dread",
	"victory-triumph":     "victory-triumph",
	"sadness-loss":        "sadness-loss",
	"stealth-suspense":    "stealth-suspense",
	"desert-heat":         "desert-heat",
	"arctic-cold":         "arctic-cold",
	rainfall:              "rainfall",
	"gate-resonance":      "gate-resonance",
	"regent-presence":     "regent-presence",
	"shadow-realm":        "shadow-realm",
	"system-awakening":    "system-awakening",
	// calm maps to tavern (most neutral)
	calm:                  "tavern-calm",
};

// ---------------------------------------------------------------------------
// Helper: build a minimal AudioTrack from a local path for audioService
// ---------------------------------------------------------------------------
function makeLocalTrack(
	id: string,
	name: string,
	path: string,
	loop = false,
): AudioTrack {
	const mimeType = path.endsWith(".ogg")
		? "audio/ogg"
		: path.endsWith(".mp3")
			? "audio/mpeg"
			: "audio/mpeg";
	return {
		id,
		title: name,
		artist: "System",
		category: "music",
		duration: 0,
		url: path,
		volume: 0.7,
		loop,
		tags: [],
		license: "CC0",
		source: "System",
		isLocal: true,
		mimeType,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	};
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export interface WardenAudioControls {
	/** Called by WardenToolsPanel quick-sound buttons and weather buttons */
	onPlaySound: (id: string) => void;
	/** Called by WardenToolsPanel quick-music buttons and mood selectors */
	onMusicChange: (id: string) => void;
	/** Adjust VttMusicEngine volume (0-1) */
	setMusicVolume: (v: number) => void;
	/** Stop all audio (both engines) */
	stopAll: () => void;
}

export function useWardenAudio(initialVolume = 0.35): WardenAudioControls {
	const engineRef = useRef<VttMusicEngine | null>(null);

	// Initialise engine once
	useEffect(() => {
		engineRef.current = new VttMusicEngine();
		engineRef.current.setVolume(initialVolume);
		return () => {
			engineRef.current?.dispose();
			engineRef.current = null;
		};
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	// -------------------------------------------------------------------------
	// onPlaySound — one-shot SFX routing
	// -------------------------------------------------------------------------
	const onPlaySound = useCallback((id: string) => {
		const entry = SFX_ASSET_MAP[id];

		if (!entry) {
			console.warn(`[useWardenAudio] Unknown SFX id: "${id}"`);
			return;
		}

		if (entry.type === "file") {
			// Play via audioService (Howler), non-looping
			const track = makeLocalTrack(
				`sfx-${id}`,
				id,
				entry.path,
				false,
			);
			audioService.loadTrack(track).then(() => {
				audioService.play();
			});
			return;
		}

		// type === "mood" — short procedural burst via VttMusicEngine
		const engine = engineRef.current;
		if (!engine) return;

		const mood = entry.mood as MusicMood;
		engine.play(mood);
		// Auto-stop after 3 s so it doesn't interfere with background music
		setTimeout(() => {
			engine.stop();
		}, 3000);
	}, []);

	// -------------------------------------------------------------------------
	// onMusicChange — background music routing
	// -------------------------------------------------------------------------
	const onMusicChange = useCallback((id: string) => {
		const engine = engineRef.current;

		// "stop" — silence everything
		if (id === "stop") {
			engine?.stop();
			audioService.stop();
			return;
		}

		// 1. Direct MusicMood key or MOOD_TAG → VttMusicEngine
		if (MOOD_TO_ENGINE[id]) {
			audioService.stop();
			engine?.play(MOOD_TO_ENGINE[id]);
			return;
		}

		// 2. MUSIC_ASSETS — local file via audioService
		const musicAsset = MUSIC_ASSETS.find((a) => a.id === id || a.path.includes(id));
		if (musicAsset) {
			engine?.stop();
			const track = makeLocalTrack(musicAsset.id, musicAsset.name, musicAsset.path, true);
			audioService.loadTrack(track).then(() => {
				audioService.play();
			});
			return;
		}

		// 3. AUDIO_ASSETS — vtt-engine:// or local file
		const audioAsset = AUDIO_ASSETS.find((a) => a.id === id);
		if (audioAsset) {
			if (audioAsset.path.startsWith("vtt-engine://")) {
				const mood = audioAsset.path.replace("vtt-engine://", "") as MusicMood;
				audioService.stop();
				engine?.play(mood);
			} else {
				engine?.stop();
				const track = makeLocalTrack(audioAsset.id, audioAsset.name, audioAsset.path, true);
				audioService.loadTrack(track).then(() => {
					audioService.play();
				});
			}
			return;
		}

		console.warn(`[useWardenAudio] Unknown music id: "${id}"`);
	}, []);

	// -------------------------------------------------------------------------
	// Volume / stop helpers
	// -------------------------------------------------------------------------
	const setMusicVolume = useCallback((v: number) => {
		engineRef.current?.setVolume(v);
		audioService.setMasterVolume(v);
	}, []);

	const stopAll = useCallback(() => {
		engineRef.current?.stop();
		audioService.stop();
	}, []);

	return { onPlaySound, onMusicChange, setMusicVolume, stopAll };
}
