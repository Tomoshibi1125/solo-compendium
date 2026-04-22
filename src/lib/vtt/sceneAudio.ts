import type { MusicMood } from "@/lib/vtt";
import { VttMusicEngine } from "@/lib/vtt";

export interface SceneMusicState {
	musicMood?: MusicMood | null;
	musicAutoplay?: boolean | null;
}

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
