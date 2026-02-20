import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

// Extend Window interface for screen reader announcements
declare global {
  interface Window {
    announceToScreenReader?: (message: string, priority?: 'polite' | 'assertive', context?: string) => void;
  }
}

// Accessibility enhancement component for WCAG 2.1 AA compliance
interface AccessibilityEnhancementsProps {
  children: React.ReactNode;
  highContrast?: boolean;
  reducedMotion?: boolean;
  screenReader?: boolean;
  keyboardNavigation?: boolean;
  announcements?: boolean;
}

const AccessibilityEnhancements: React.FC<AccessibilityEnhancementsProps> = ({
  children,
  highContrast = false,
  reducedMotion = false,
  screenReader = false,
  keyboardNavigation = false,
  announcements = false
}) => {
  const [announcementsEnabled, setAnnouncementsEnabled] = useState(announcements);
  const [liveRegion, setLiveRegion] = useState('polite');

  useEffect(() => {
    // High contrast mode
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    // Reduced motion
    if (reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }

    // Screen reader optimizations
    if (screenReader) {
      // Add comprehensive ARIA live regions
      const main = document.querySelector('main');
      if (main) {
        main.setAttribute('aria-live', 'polite');
        main.setAttribute('aria-atomic', 'true');
        main.setAttribute('role', 'main');
      }
      
      // Ensure all interactive elements have proper labels
      document.querySelectorAll('button:not([aria-label])').forEach(button => {
        if (!button.textContent?.trim()) {
          button.setAttribute('aria-label', 'Interactive button');
        }
      });
      
      // Add landmarks for better navigation
      const header = document.querySelector('header') || document.querySelector('[role="banner"]');
      const nav = document.querySelector('nav') || document.querySelector('[role="navigation"]');
      const footer = document.querySelector('footer') || document.querySelector('[role="contentinfo"]');
      
      if (header && !header.getAttribute('role')) header.setAttribute('role', 'banner');
      if (nav && !nav.getAttribute('role')) nav.setAttribute('role', 'navigation');
      if (footer && !footer.getAttribute('role')) footer.setAttribute('role', 'contentinfo');
    }

    // Keyboard navigation enhancements
    if (keyboardNavigation) {
      // Add comprehensive skip links
      const skipLinks = document.createElement('div');
      skipLinks.innerHTML = `
        <a href="#main-content" class="sr-only focus:not-sr-only focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 absolute top-4 left-4 bg-background px-4 py-2 rounded-md z-50">Skip to main content</a>
        <a href="#navigation" class="sr-only focus:not-sr-only focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 absolute top-4 left-48 bg-background px-4 py-2 rounded-md z-50">Skip to navigation</a>
        <a href="#search" class="sr-only focus:not-sr-only focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 absolute top-4 left-80 bg-background px-4 py-2 rounded-md z-50">Skip to search</a>
      `;
      document.body.insertBefore(skipLinks, document.body.firstChild);
      
      // Add focus indicators for better visual feedback
      const style = document.createElement('style');
      style.textContent = `
        *:focus-visible {
          outline: 2px solid hsl(var(--primary));
          outline-offset: 2px;
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        .focus\:not-sr-only:focus {
          position: static;
          width: auto;
          height: auto;
          padding: revert;
          margin: revert;
          overflow: visible;
          clip: auto;
          white-space: revert;
        }
      `;
      document.head.appendChild(style);
    }

    // Live regions for dynamic content with enhanced announcements
    if (announcements) {
      const announcer = document.createElement('div');
      announcer.setAttribute('aria-live', 'assertive');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.setAttribute('class', 'sr-only');
      announcer.setAttribute('id', 'screen-reader-announcer');
      document.body.appendChild(announcer);
      
      // Enhanced announcement system with context
      window.announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite', context?: string) => {
        const announcerElement = document.getElementById('screen-reader-announcer');
        if (announcerElement) {
          announcerElement.setAttribute('aria-live', priority);
          const fullMessage = context ? `${context}: ${message}` : message;
          announcerElement.textContent = fullMessage;
          
          // Clear after announcement
          setTimeout(() => {
            announcerElement.textContent = '';
          }, 1000);
        }
      };
      
      // Add status region for ongoing operations
      const statusRegion = document.createElement('div');
      statusRegion.setAttribute('aria-live', 'polite');
      statusRegion.setAttribute('aria-atomic', 'true');
      statusRegion.setAttribute('class', 'sr-only');
      statusRegion.setAttribute('id', 'status-region');
      document.body.appendChild(statusRegion);
    }
  }, [highContrast, reducedMotion, screenReader, keyboardNavigation, announcements]);

  return <>{children}</>;
};

// Focus management hook
export const useFocusManagement = () => {
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(null);

  const trapFocus = (element: HTMLElement) => {
    element.focus();
    setFocusedElement(element);
    
    // Add focus trap for modal dialogs
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        const focusableElements = element.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
        
        if (e.shiftKey) {
          lastElement.focus();
        } else {
          firstElement.focus();
        }
        e.preventDefault();
      }
    };

    element.addEventListener('keydown', handleKeyDown);
    
    return () => {
      element.removeEventListener('keydown', handleKeyDown);
      setFocusedElement(null);
    };
  };

  return {
    focusedElement,
    trapFocus,
  };
};

// Color contrast utilities
export const getContrastColor = (hexColor: string): string => {
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  
  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black or white based on luminance
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

// Screen reader announcement system
export const useScreenReaderAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<Array<{message: string; priority: string; timestamp: string}>>([]);

  const announce = (message: string, priority: 'polite' | 'assertive' | 'off' = 'polite') => {
    const announcer = document.querySelector('[aria-live="polite"], [aria-live="assertive"]') as HTMLElement;
    if (announcer) {
      announcer.textContent = message;
      announcer.setAttribute('aria-live', priority);
      
      // Add to history for debugging
      setAnnouncements(prev => [...prev, { message, priority, timestamp: new Date().toISOString() }]);
    }
  };

  const clearAnnouncements = () => {
    setAnnouncements([]);
  };

  return {
    announce,
    clearAnnouncements,
    announcements
  };
};

// Keyboard navigation patterns
export const KeyboardPatterns = {
  // Arrow key navigation for grids and lists
  arrowNavigation: (e: KeyboardEvent, direction: 'up' | 'down' | 'left' | 'right') => {
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const currentIndex = Array.from(focusableElements).findIndex(el => el === document.activeElement);
    
    let nextIndex: number;
    switch (direction) {
      case 'up':
        nextIndex = Math.max(0, currentIndex - 1);
        break;
      case 'down':
        nextIndex = Math.min(focusableElements.length - 1, currentIndex + 1);
        break;
      case 'left':
        nextIndex = Math.max(0, currentIndex - 1);
        break;
      case 'right':
        nextIndex = Math.min(focusableElements.length - 1, currentIndex + 1);
        break;
    }
    
    if (nextIndex >= 0 && nextIndex < focusableElements.length) {
      (focusableElements[nextIndex] as HTMLElement).focus();
      e.preventDefault();
    }
  },

  // Tab navigation for forms and sections
  tabNavigation: (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      const focusableElements = document.querySelectorAll(
        'input, select, textarea, button, [href], [tabindex]:not([tabindex="-1"])'
      ) as NodeListOf<HTMLElement>;
      
      const currentIndex = Array.from(focusableElements).findIndex(el => el === document.activeElement);
      const nextIndex = e.shiftKey 
        ? (currentIndex - 1 + focusableElements.length) % focusableElements.length
        : (currentIndex + 1) % focusableElements.length;
      
      if (focusableElements[nextIndex]) {
        (focusableElements[nextIndex] as HTMLElement).focus();
        e.preventDefault();
      }
    }
  },

  // Escape key handling
  escapeKey: (e: KeyboardEvent, callback?: () => void) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      if (callback) callback();
    }
  }
};

export default AccessibilityEnhancements;
