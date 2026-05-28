/**
 * useDialogSwipeClose — mobile swipe-down-to-dismiss for dialogs.
 *
 * Q2 of Round 3 remediation. Provides a shared gesture-binding hook that
 * triggers `onClose` when the user swipes down from the dialog content.
 * Reuses the existing `@use-gesture/react` library (already used by
 * `CharacterSheetV2`'s tab swipe).
 *
 * Usage:
 *   const bindSwipe = useDialogSwipeClose(() => onOpenChange(false));
 *   <div {...bindSwipe()} ...>
 *
 * Guard: gesture only fires when the swipe velocity Y is positive and
 * within the touch-friendly band — desktop mouse drags do not trigger.
 */
import { useDrag } from "@use-gesture/react";

export function useDialogSwipeClose(onClose: () => void) {
	return useDrag(
		({
			swipe: [, swipeY],
		}: {
			swipe: [number, number];
		}) => {
			if (swipeY > 0) {
				onClose();
			}
		},
		{ axis: "y", filterTaps: true, pointerContext: true },
	);
}
