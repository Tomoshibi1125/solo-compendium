import { describe, expect, it } from "vitest";
import {
	getSceneMusicMood,
	resolveSceneAudioTrackIntent,
} from "@/lib/vtt/sceneAudio";

const tracks = [
	{
		id: "track-1",
		name: "Gate Lattice Pulse",
		type: "music" as const,
		url: "/audio/music/gate-lattice-pulse.mp3",
		volume: 0.7,
		loop: true,
	},
	{
		id: "track-2",
		name: "Ascendant Bureau Sweep",
		type: "ambient" as const,
		url: "/audio/ambient/bureau-sweep.mp3",
		volume: 0.5,
		loop: true,
	},
];

describe("scene audio helpers", () => {
	it("resolves procedural mood only when autoplay is enabled", () => {
		expect(
			getSceneMusicMood({ musicMood: "combat-tension", musicAutoplay: true }),
		).toBe("combat-tension");
		expect(
			getSceneMusicMood({ musicMood: "combat-tension", musicAutoplay: false }),
		).toBe(null);
	});

	it("resolves direct scene track intent", () => {
		const intent = resolveSceneAudioTrackIntent(
			{ musicTrackId: "track-1", musicAutoplay: true },
			tracks,
		);

		expect(intent).toMatchObject({
			mode: "track",
			track: { id: "track-1" },
		});
	});

	it("resolves scene playlist intent starting at the persisted track", () => {
		const intent = resolveSceneAudioTrackIntent(
			{
				musicPlaylistId: "playlist-1",
				musicTrackId: "track-2",
				musicAutoplay: true,
			},
			tracks,
		);

		expect(intent).toMatchObject({
			mode: "playlist",
			startIndex: 1,
			track: { id: "track-2" },
			playlist: {
				id: "playlist-1",
				tracks: ["track-1", "track-2"],
			},
		});
	});

	it("returns stop or none for disabled or unresolved scene audio", () => {
		expect(
			resolveSceneAudioTrackIntent(
				{ musicTrackId: "track-1", musicAutoplay: false },
				tracks,
			),
		).toEqual({ mode: "stop" });
		expect(
			resolveSceneAudioTrackIntent(
				{ musicTrackId: "missing", musicAutoplay: true },
				tracks,
			),
		).toEqual({ mode: "none" });
	});
});
