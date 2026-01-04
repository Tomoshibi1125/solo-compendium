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

export const GLOBAL_SHORTCUTS: GlobalShortcut[] = [
  // Navigation
  {
    key: 'k',
    ctrl: true,
    action: () => {
      const searchInput = document.querySelector('input[type="search"], input[placeholder*="Search"]') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    },
    description: 'Focus search',
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
    description: 'Open DM tools',
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
      const saveButton = document.querySelector('button[aria-label*="Save"], button:has-text("Save")') as HTMLButtonElement;
      if (saveButton && !saveButton.disabled) {
        saveButton.click();
      }
    },
    description: 'Save character',
    category: 'character',
    global: false,
  },
  {
    key: 'r',
    ctrl: true,
    action: () => {
      // Short rest
      const shortRestButton = document.querySelector('button:has-text("Short Rest")') as HTMLButtonElement;
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
      const longRestButton = document.querySelector('button:has-text("Long Rest")') as HTMLButtonElement;
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
      const favoritesToggle = document.querySelector('input[type="checkbox"][aria-label*="favorite"], button:has-text("Favorites")') as HTMLElement;
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
      const closeButton = document.querySelector('button[aria-label="Close"], button:has-text("Cancel")') as HTMLButtonElement;
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
  // This would be implemented in a component
  // For now, do nothing - the help is shown via the QuickActionsPanel dialog
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

