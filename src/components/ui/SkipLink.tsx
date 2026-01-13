import { useEffect, useState } from 'react';

export function SkipLink() {
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsFocused(true);
      }
    };

    const handleMouseDown = () => {
      setIsFocused(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  if (!isFocused) return null;

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-ring"
      onClick={(e) => {
        e.preventDefault();
        const target = document.getElementById('main-content');
        target?.focus();
        target?.scrollIntoView({ behavior: 'smooth' });
      }}
    >
      Skip to main content
    </a>
  );
}
