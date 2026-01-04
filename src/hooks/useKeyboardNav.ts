import { useEffect, useRef } from 'react';

/**
 * Hook for keyboard navigation improvements
 * Provides focus management and keyboard shortcuts
 */
export function useKeyboardNav() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if user is typing in an input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable)
      ) {
        return;
      }

      // Escape key - close modals/dialogs
      if (e.key === 'Escape') {
        // This would be handled by individual components
        return;
      }

      // Ctrl/Cmd + K - Focus search (if available)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector<HTMLInputElement>('input[aria-label*="earch" i], input[placeholder*="earch" i]');
        if (searchInput) {
          searchInput.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return containerRef;
}

