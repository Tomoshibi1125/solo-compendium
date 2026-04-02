import { Howl } from "howler";
import { useCallback, useRef } from "react";
import { useAppStore } from "@/hooks/useAppStore";

/**
 * Custom hook for 'Premium' Solo Leveling / System Ascendant auditory feedback.
 * Uses a tiny base64-encoded WAV for the 'System Blip' to avoid external dependencies.
 */
export function useSystemSound() {
	const soundEnabled = useAppStore((state) => state.soundEnabled);

	const blipSound = useRef<Howl | null>(null);

	// Tiny high-pitched digital blip (base64 wav)
	const SYSTEM_BLIP_B64 =
		"data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YTdvT18YGRgYGRgYGRgYGRgYGRgYGRgYGRgYGRgYGRgYGRgYGRgYGRgYGRgYGRgYGRgYGRgYGRgYGRgYGRgYGRgYGRgYGRgYGRgYGRgYGRgYGRgYGRgYGRgYGRgYGRgYGRgYGRgYGRgYGRgYGRgYGRgYGRgYGRgYGRgYGRgYGQ==";

	const playBlip = useCallback(() => {
		if (!soundEnabled) return;

		if (!blipSound.current) {
			blipSound.current = new Howl({
				src: [SYSTEM_BLIP_B64],
				format: ["wav"],
				volume: 0.1,
			});
		}

		blipSound.current.play();
	}, [soundEnabled]);

	return { playBlip };
}
