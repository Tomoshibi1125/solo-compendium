/**
 * Mobile optimization utilities
 */

/**
 * Check if device is mobile
 */
export function isMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Check if device is touch-enabled
 */
export function isTouchDevice(): boolean {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Get viewport dimensions
 */
export function getViewportSize(): { width: number; height: number } {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

/**
 * Check if viewport is small (mobile)
 */
export function isSmallViewport(): boolean {
  return window.innerWidth < 768;
}

/**
 * Prevent zoom on double tap (iOS)
 */
export function preventDoubleTapZoom() {
  let lastTouchEnd = 0;
  document.addEventListener('touchend', (event) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, false);
}

/**
 * Add touch-friendly class to body
 */
export function enableTouchOptimizations() {
  // Ensure DOM is ready
  if (typeof document === 'undefined' || !document.body) {
    // If DOM not ready, wait for it
    if (typeof window !== 'undefined') {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          applyTouchOptimizations();
        });
      } else {
        applyTouchOptimizations();
      }
    }
    return;
  }
  
  applyTouchOptimizations();
}

function applyTouchOptimizations() {
  if (typeof document === 'undefined' || !document.body) return;
  
  if (isTouchDevice()) {
    document.body.classList.add('touch-device');
  }
  if (isMobile()) {
    document.body.classList.add('mobile-device');
  }
}

