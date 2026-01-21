/**
 * Global keyboard shortcuts system
 * Provides comprehensive keyboard navigation and quick actions
 */

export interface GlobalShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  action: () => void;
  description: string;
  category: 'navigation' | 'character' | 'compendium' | 'tools' | 'general';
  global?: boolean; // If true, works everywhere; if false, context-specific
}

// Command palette state - will be set by App component
let openCommandPalette: (() => void) | null = null;

export function setCommandPaletteOpener(opener: () => void) {
  openCommandPalette = opener;
}

const findButtonByText = (text: string) => {
  const needle = text.toLowerCase();
  return Array.from(document.querySelectorAll('button')).find((button) =>
    (button.textContent || '').toLowerCase().includes(needle)
  ) as HTMLButtonElement | undefined;
};

export const GLOBAL_SHORTCUTS: GlobalShortcut[] = [
  // Navigation
  {
    key: 'k',
    ctrl: true,
    action: () => {
      // Try to open command palette first
      if (openCommandPalette) {
        openCommandPalette();
        return;
      }
      // Fallback to focusing search input
      const searchInput = document.querySelector('input[type="search"], input[placeholder*="Search"]') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    },
    description: 'Open command palette',
    category: 'navigation',
    global: true,
  },
  {
    key: 'h',
    ctrl: true,
    action: () => {
      window.location.href = '/';
    },
    description: 'Go to home',
    category: 'navigation',
    global: true,
  },
  {
    key: 'c',
    ctrl: true,
    action: () => {
      window.location.href = '/compendium';
    },
    description: 'Open compendium',
    category: 'navigation',
    global: true,
  },
  {
    key: 'p',
    ctrl: true,
    action: () => {
      window.location.href = '/characters';
    },
    description: 'Open characters',
    category: 'navigation',
    global: true,
  },
  {
    key: 'd',
    ctrl: true,
    action: () => {
      window.location.href = '/dice';
    },
    description: 'Open dice roller',
    category: 'navigation',
    global: true,
  },
  {
    key: 'm',
    ctrl: true,
    action: () => {
      window.location.href = '/dm-tools';
    },
    description: 'Open Warden tools',
    category: 'navigation',
    global: true,
  },
  
  // Character actions
  {
    key: 'n',
    ctrl: true,
    shift: true,
    action: () => {
      window.location.href = '/characters/new';
    },
    description: 'Create new character',
    category: 'character',
    global: true,
  },
  {
    key: 's',
    ctrl: true,
    action: () => {
      // Save current character if on character sheet
      const saveButton = (document.querySelector('button[aria-label*="Save"]') as HTMLButtonElement)
        || findButtonByText('Save');
      if (saveButton && !saveButton.disabled) {
        saveButton.click();
      }
    },
    description: 'Save character',
    category: 'character',
    global: false,
  },
  {
    key: 'z',
    ctrl: true,
    shift: false,
    action: () => {
      // Undo on character sheet
      const undoButton = document.querySelector('button[aria-label="Undo"]') as HTMLButtonElement;
      if (undoButton && !undoButton.disabled) {
        undoButton.click();
      }
    },
    description: 'Undo',
    category: 'character',
    global: false,
  },
  {
    key: 'y',
    ctrl: true,
    action: () => {
      // Redo on character sheet
      const redoButton = document.querySelector('button[aria-label="Redo"]') as HTMLButtonElement;
      if (redoButton && !redoButton.disabled) {
        redoButton.click();
      }
    },
    description: 'Redo',
    category: 'character',
    global: false,
  },
  {
    key: 'r',
    ctrl: true,
    action: () => {
      // Short rest
      const shortRestButton = findButtonByText('Short Rest');
      if (shortRestButton) shortRestButton.click();
    },
    description: 'Short rest',
    category: 'character',
    global: false,
  },
  {
    key: 'r',
    ctrl: true,
    shift: true,
    action: () => {
      // Long rest
      const longRestButton = findButtonByText('Long Rest');
      if (longRestButton) longRestButton.click();
    },
    description: 'Long rest',
    category: 'character',
    global: false,
  },
  
  // Compendium
  {
    key: 'f',
    action: () => {
      // Toggle favorites filter
      const favoritesToggle =
        (document.querySelector('input[type="checkbox"][aria-label*="favorite"]') as HTMLElement)
        || findButtonByText('Favorites');
      if (favoritesToggle) favoritesToggle.click();
    },
    description: 'Toggle favorites',
    category: 'compendium',
    global: false,
  },
  
  // General
  {
    key: 'Escape',
    action: () => {
      // Close modals/dialogs
      const closeButton =
        (document.querySelector('button[aria-label="Close"]') as HTMLButtonElement)
        || findButtonByText('Cancel');
      if (closeButton) closeButton.click();
    },
    description: 'Close modal/dialog',
    category: 'general',
    global: true,
  },
  {
    key: '?',
    shift: true,
    action: () => {
      // Show keyboard shortcuts help
      const helpButton = document.querySelector('button[aria-label*="help"], button[aria-label*="shortcuts"]') as HTMLButtonElement;
      if (helpButton) {
        helpButton.click();
      } else {
        // Create and show shortcuts modal
        showShortcutsHelp();
      }
    },
    description: 'Show keyboard shortcuts',
    category: 'general',
    global: true,
  },
];

function showShortcutsHelp() {
  // Show keyboard shortcuts help dialog
  const helpEvent = new CustomEvent('show-shortcuts-help');
  window.dispatchEvent(helpEvent);
}

/**
 * Get shortcuts by category
 */
export function getShortcutsByCategory(category: GlobalShortcut['category']): GlobalShortcut[] {
  return GLOBAL_SHORTCUTS.filter(s => s.category === category);
}

/**
 * Get all global shortcuts (work everywhere)
 */
export function getGlobalShortcuts(): GlobalShortcut[] {
  return GLOBAL_SHORTCUTS.filter(s => s.global === true);
}

/**
 * Format shortcut for display
 */
export function formatShortcut(shortcut: GlobalShortcut): string {
  const parts: string[] = [];
  if (shortcut.ctrl || shortcut.meta) parts.push(shortcut.meta ? '⌘' : 'Ctrl');
  if (shortcut.shift) parts.push('Shift');
  if (shortcut.alt) parts.push('Alt');
  parts.push(shortcut.key.toUpperCase());
  return parts.join(' + ');
}

