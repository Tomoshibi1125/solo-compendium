import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GLOBAL_SHORTCUTS, type GlobalShortcut } from '@/lib/globalShortcuts';

/**
 * Hook to enable global keyboard shortcuts
 */
export function useGlobalShortcuts(enabled: boolean = true) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable ||
        (target.tagName === 'BUTTON' && target.type === 'submit')
      ) {
        return;
      }

      // Find matching shortcut
      const matchingShortcut = GLOBAL_SHORTCUTS.find(shortcut => {
        const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase() ||
          (shortcut.key === 'Escape' && event.key === 'Escape') ||
          (shortcut.key === '?' && event.key === '?');
        
        const ctrlMatches = shortcut.ctrl 
          ? (event.ctrlKey || event.metaKey)
          : (!event.ctrlKey && !event.metaKey);
        
        const shiftMatches = shortcut.shift 
          ? event.shiftKey
          : !event.shiftKey;
        
        const altMatches = shortcut.alt 
          ? event.altKey
          : !event.altKey;

        return keyMatches && ctrlMatches && shiftMatches && altMatches;
      });

      if (matchingShortcut) {
        event.preventDefault();
        event.stopPropagation();
        
        // Wrap navigation actions
        if (matchingShortcut.description.includes('Go to') || 
            matchingShortcut.description.includes('Open') ||
            matchingShortcut.description.includes('Create')) {
          try {
            matchingShortcut.action();
          } catch (error) {
            console.error('Shortcut action error:', error);
          }
        } else {
          matchingShortcut.action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, navigate]);
}

