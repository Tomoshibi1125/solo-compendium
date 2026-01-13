import { useState, useEffect } from 'react';

export function useAccessibility() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [prefersDark, setPrefersDark] = useState(false);

  useEffect(() => {
    const checkPreferences = () => {
      const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      const contrastQuery = window.matchMedia('(prefers-contrast: high)');
      const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

      setReducedMotion(motionQuery.matches);
      setHighContrast(contrastQuery.matches);
      setPrefersDark(darkQuery.matches);

      const handleMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      const handleContrastChange = (e: MediaQueryListEvent) => setHighContrast(e.matches);
      const handleDarkChange = (e: MediaQueryListEvent) => setPrefersDark(e.matches);

      motionQuery.addEventListener('change', handleMotionChange);
      contrastQuery.addEventListener('change', handleContrastChange);
      darkQuery.addEventListener('change', handleDarkChange);

      return () => {
        motionQuery.removeEventListener('change', handleMotionChange);
        contrastQuery.removeEventListener('change', handleContrastChange);
        darkQuery.removeEventListener('change', handleDarkChange);
      };
    };

    const cleanup = checkPreferences();
    return cleanup;
  }, []);

  return {
    reducedMotion,
    highContrast,
    prefersDark,
  };
}
