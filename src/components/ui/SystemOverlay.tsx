import { useMemo } from "react";

/**
 * SystemOverlay component providing 'Premium' Solo Leveling / System Ascendant
 * visual effects including digital scanlines, holographic grain, and chromatic aberration.
 */
export function SystemOverlay() {
	// Prevents re-renders of the static overlay parts
	const ScanLines = useMemo(
		() => <div className="system-overlay-scanlines" aria-hidden="true" />,
		[],
	);
	const Grain = useMemo(
		() => <div className="system-overlay-grain" aria-hidden="true" />,
		[],
	);
	const Chromatic = useMemo(
		() => <div className="system-overlay-chromatic" aria-hidden="true" />,
		[],
	);

	return (
		<>
			{ScanLines}
			{Grain}
			{Chromatic}
			{/* Subtle corner vignettes or other system decorations can be added here */}
			<div className="fixed inset-0 pointer-events-none z-[99] bg-radial-gradient from-transparent via-transparent to-primary/5 opacity-20" />
		</>
	);
}
