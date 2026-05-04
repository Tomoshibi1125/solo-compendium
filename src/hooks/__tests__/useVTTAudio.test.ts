import { describe, expect, it } from "vitest";
import {
	calculateCrossfadeGain,
	type VTTAudioSettings,
	type VTTPlaylistState,
} from "@/hooks/useVTTAudio";

describe("calculateCrossfadeGain", () => {
	it("keeps exported audio settings and playlist state shapes explicit", () => {
		const settings: VTTAudioSettings = {
			id: "settings-1",
			session_id: "session-1",
			master_volume: 0.8,
			music_volume: 0.7,
			ambient_volume: 0.6,
			sfx_volume: 0.5,
			voice_chat_enabled: false,
			voice_chat_volume: 0.4,
			updated_at: "2026-05-04T00:00:00.000Z",
		};
		const playlistState: VTTPlaylistState = {
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

		expect(settings.master_volume).toBe(0.8);
		expect(playlistState.queue).toHaveLength(0);
	});

	it("clamps progress outside the 0..1 range", () => {
		expect(calculateCrossfadeGain(-1, "in")).toBe(0);
		expect(calculateCrossfadeGain(-1, "out")).toBe(1);
		expect(calculateCrossfadeGain(2, "in")).toBe(1);
		expect(calculateCrossfadeGain(2, "out")).toBe(0);
	});

	it("mirrors fade-in and fade-out gain at the same progress", () => {
		for (const progress of [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1]) {
			const fadeIn = calculateCrossfadeGain(progress, "in");
			const fadeOut = calculateCrossfadeGain(progress, "out");
			expect(fadeIn + fadeOut).toBeCloseTo(1, 6);
		}
	});

	it("uses an eased monotonic fade curve", () => {
		const samples = [0, 0.25, 0.5, 0.75, 1].map((progress) =>
			calculateCrossfadeGain(progress, "in"),
		);
		expect(samples).toEqual([...samples].sort((a, b) => a - b));
		expect(samples[1]).toBeCloseTo(0.15625, 6);
		expect(samples[2]).toBeCloseTo(0.5, 6);
		expect(samples[3]).toBeCloseTo(0.84375, 6);
	});
});
