import { useEffect, useRef } from 'react';

type ShortcutCallback = (e: KeyboardEvent) => void;

interface Shortcut {
    key: string;
    ctrl?: boolean;
    alt?: boolean;
    shift?: boolean;
    meta?: boolean;
    handler: ShortcutCallback;
    preventDefault?: boolean;
}

export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
    const shortcutsRef = useRef(shortcuts);

    useEffect(() => {
        shortcutsRef.current = shortcuts;
    }, [shortcuts]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Don't trigger shortcuts if user is typing in an input, textarea, or contenteditable
            if (
                e.target instanceof HTMLInputElement ||
                e.target instanceof HTMLTextAreaElement ||
                (e.target as HTMLElement).isContentEditable
            ) {
                // Exception: allow Ctrl/Cmd+S for saving even when in inputs
                if (e.key.toLowerCase() !== 's' || (!e.ctrlKey && !e.metaKey)) {
                    return;
                }
            }

            for (const shortcut of shortcutsRef.current) {
                const matchesKey = e.key.toLowerCase() === shortcut.key.toLowerCase();
                const matchesCtrl = !!shortcut.ctrl === e.ctrlKey;
                const matchesAlt = !!shortcut.alt === e.altKey;
                const matchesShift = !!shortcut.shift === e.shiftKey;
                const matchesMeta = !!shortcut.meta === e.metaKey;

                if (matchesKey && matchesCtrl && matchesAlt && matchesShift && matchesMeta) {
                    if (shortcut.preventDefault !== false) {
                        e.preventDefault();
                    }
                    shortcut.handler(e);
                    return; // Stop after first matching shortcut
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);
}
