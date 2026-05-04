import type { Playlist } from "@/lib/audio/types";
import type { MusicMood, VttMusicEngine } from "@/lib/vtt";

export interface SceneMusicState {
	musicMood?: MusicMood | null;
	musicAutoplay?: boolean | null;
	musicPlaylistId?: string | null;
	musicTrackId?: string | null;
}

export interface SceneAudioTrack {
	id: string;
	name: string;
	type: "music" | "ambient" | "sfx";
	url: string;
	volume: number;
	loop: boolean;
}

export type SceneAudioTrackIntent<
	TTrack extends SceneAudioTrack = SceneAudioTrack,
> =
	| { mode: "none" }
	| { mode: "stop" }
	| { mode: "track"; track: TTrack }
	| {
			mode: "playlist";
			playlist: Playlist;
			tracks: TTrack[];
			startIndex: number;
			track: TTrack;
	  };

export const getSceneMusicMood = (
	scene: SceneMusicState | null | undefined,
): MusicMood | null => {
	if (!scene?.musicMood) return null;
	if (scene.musicAutoplay === false) return null;
	return scene.musicMood;
};

export const syncSceneMusicEngine = (
	engine: VttMusicEngine | null | undefined,
	scene: SceneMusicState | null | undefined,
) => {
	if (!engine) {
		return { action: "none" as const, mood: getSceneMusicMood(scene) };
	}

	const nextMood = getSceneMusicMood(scene);
	const currentMood = engine.getCurrentMood();

	if (!nextMood) {
		if (!currentMood) {
			return { action: "none" as const, mood: null };
		}
		engine.stop();
		return { action: "stop" as const, mood: null };
	}

	if (currentMood === nextMood) {
		return { action: "none" as const, mood: nextMood };
	}

	engine.play(nextMood);
	return { action: "play" as const, mood: nextMood };
};

export const resolveSceneAudioTrackIntent = <TTrack extends SceneAudioTrack>(
	scene: SceneMusicState | null | undefined,
	tracks: TTrack[],
): SceneAudioTrackIntent<TTrack> => {
	if (!scene) return { mode: "stop" };
	if (scene.musicAutoplay === false) return { mode: "stop" };
	if (!scene.musicTrackId) return { mode: "none" };

	const playableTracks = tracks.filter((track) => !!track.url);
	const track = playableTracks.find((item) => item.id === scene.musicTrackId);
	if (!track) return { mode: "none" };

	if (!scene.musicPlaylistId) {
		return { mode: "track", track };
	}

	const startIndex = playableTracks.findIndex((item) => item.id === track.id);
	if (startIndex < 0) return { mode: "none" };

	const now = new Date().toISOString();
	return {
		mode: "playlist",
		playlist: {
			id: scene.musicPlaylistId,
			name: "Scene Audio Queue",
			description: "Scene-linked VTT audio queue",
			tracks: playableTracks.map((item) => item.id),
			category: "custom",
			autoPlay: true,
			shuffle: false,
			repeat: "all",
			crossfade: 2,
			volume: 0.7,
			createdAt: now,
			updatedAt: now,
		},
		tracks: playableTracks,
		startIndex,
		track,
	};
};
