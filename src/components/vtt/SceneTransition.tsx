import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Misty Pearl B3 — Scene Transitions overlay.
 *
 * Foundry v14 parity. When the active scene id changes and transitions
 * are enabled, this component mounts above the canvas and runs:
 *
 *   fade in to black (1/3 of duration) →
 *   hold with title card (1/3) →
 *   fade out to scene (1/3)
 *
 * Side-effect-free: the parent owns scene loading. We just paint the
 * overlay. Respects `prefers-reduced-motion`: when reduced motion is
 * preferred, the overlay short-circuits to a 200 ms hard cut so the
 * scene swap still feels intentional but doesn't violate the OS
 * preference.
 *
 * RA theming: title card uses the existing dark gradient + the
 * Ascendant gold accent. No new design tokens.
 */

export interface SceneTransitionProps {
	/** Active scene id. Changing this triggers a transition. */
	sceneId: string | null;
	/** Master enable toggle from `useVTTSettings.sceneTransitionEnabled`. */
	enabled: boolean;
	/** Title card label. Falls back to `sceneName` when omitted. */
	title?: string;
	/** Scene name fallback for the title card. */
	sceneName?: string;
	/** Total envelope duration in ms. Clamped 600–6000. */
	durationMs: number;
	/** Test hook so the overlay can be probed without faking timers. */
	"data-testid"?: string;
}

const clampDuration = (n: number) =>
	Math.max(600, Math.min(6000, Math.round(n) || 2200));

const prefersReducedMotion = () => {
	if (typeof window === "undefined") return false;
	return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
};

export function SceneTransition({
	sceneId,
	enabled,
	title,
	sceneName,
	durationMs,
	"data-testid": testId,
}: SceneTransitionProps) {
	const [active, setActive] = useState<{ id: string; label: string } | null>(
		null,
	);
	const [lastSceneId, setLastSceneId] = useState<string | null>(sceneId);

	useEffect(() => {
		// Only react to genuine id changes; first mount must not flash.
		if (sceneId === lastSceneId) return;
		setLastSceneId(sceneId);
		if (!enabled || !sceneId) return;
		if (prefersReducedMotion()) {
			// Hard cut, but mount briefly so screen-reader announcements
			// fire and downstream tests can observe the transition state.
			setActive({ id: sceneId, label: title?.trim() || sceneName || "" });
			const timer = window.setTimeout(() => setActive(null), 200);
			return () => window.clearTimeout(timer);
		}
		setActive({ id: sceneId, label: title?.trim() || sceneName || "" });
		const total = clampDuration(durationMs);
		const timer = window.setTimeout(() => setActive(null), total);
		return () => window.clearTimeout(timer);
	}, [sceneId, enabled, title, sceneName, durationMs, lastSceneId]);

	const total = clampDuration(durationMs);
	const fadeSec = total / 3 / 1000;
	const holdSec = total / 3 / 1000;

	return (
		<AnimatePresence>
			{active && (
				<motion.div
					key={active.id}
					data-testid={testId ?? "vtt-scene-transition"}
					data-scene-id={active.id}
					role="presentation"
					aria-hidden="true"
					initial={{ opacity: 0 }}
					animate={{ opacity: [0, 1, 1, 0] }}
					exit={{ opacity: 0 }}
					transition={{
						duration: total / 1000,
						times: [0, fadeSec / (total / 1000), 1 - fadeSec / (total / 1000), 1],
						ease: "easeInOut",
					}}
					className="pointer-events-none absolute inset-0 z-[60] flex items-center justify-center bg-gradient-to-b from-black via-black/95 to-black"
				>
					<motion.div
						initial={{ opacity: 0, scale: 0.96 }}
						animate={{ opacity: [0, 1, 1, 0], scale: [0.96, 1, 1, 0.98] }}
						transition={{
							duration: total / 1000,
							times: [0, 0.33, 0.66, 1],
							ease: "easeInOut",
						}}
						className="px-8 py-6 text-center"
					>
						<p className="font-resurge text-[10px] uppercase tracking-[0.4em] text-primary/80">
							Bureau Field Brief
						</p>
						<p
							className="mt-2 max-w-[80vw] font-heading text-2xl font-semibold text-foreground sm:text-3xl md:text-4xl"
							data-testid="vtt-scene-transition-title"
						>
							{active.label || "Transitioning…"}
						</p>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export default SceneTransition;
