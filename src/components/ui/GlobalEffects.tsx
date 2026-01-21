import { useEffect, useRef, useState } from 'react';
import { useAccessibility } from '@/hooks/useAccessibility';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export const GlobalEffects = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [prefersReducedData, setPrefersReducedData] = useState(false);
  const [hasFinePointer, setHasFinePointer] = useState(false);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const { reducedMotion } = useAccessibility();

  const reduceEffects = reducedMotion || prefersReducedData;
  const enablePointerGlow = hasFinePointer && !reduceEffects;

  useEffect(() => {
    if (typeof navigator === 'undefined') return;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    setPrefersReducedData(Boolean(connection?.saveData));
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const pointerQuery = window.matchMedia('(pointer: fine)');
    const updatePointer = () => setHasFinePointer(pointerQuery.matches);
    updatePointer();
    if (pointerQuery.addEventListener) {
      pointerQuery.addEventListener('change', updatePointer);
    } else {
      pointerQuery.addListener(updatePointer);
    }
    return () => {
      if (pointerQuery.removeEventListener) {
        pointerQuery.removeEventListener('change', updatePointer);
      } else {
        pointerQuery.removeListener(updatePointer);
      }
    };
  }, []);

  // Generate shadow particles
  useEffect(() => {
    if (reduceEffects) {
      setParticles([]);
      return;
    }

    const generateParticles = () => {
      const newParticles: Particle[] = [];
      for (let i = 0; i < 15; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 6 + 2,
          duration: Math.random() * 10 + 15,
          delay: Math.random() * 5,
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
    const interval = window.setInterval(generateParticles, 30000);
    return () => window.clearInterval(interval);
  }, [reduceEffects]);

  // Track pointer position for interactive effects (rAF throttled)
  useEffect(() => {
    if (!enablePointerGlow) return;

    const updateGlow = () => {
      rafRef.current = null;
      if (!glowRef.current) return;
      const { x, y } = targetRef.current;
      glowRef.current.style.transform = `translate3d(${x - 20}px, ${y - 20}px, 0)`;
    };

    const handlePointerMove = (event: PointerEvent) => {
      targetRef.current = { x: event.clientX, y: event.clientY };
      if (rafRef.current === null) {
        rafRef.current = window.requestAnimationFrame(updateGlow);
      }
    };

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    targetRef.current = { x: centerX, y: centerY };
    updateGlow();

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [enablePointerGlow]);

  return (
    <>
      {/* Shadow Particles */}
      {!reduceEffects && (
        <div className="shadow-particles">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="shadow-particle"
              style={{
                '--particle-x': `${particle.x}%`,
                '--particle-y': `${particle.y}%`,
                '--particle-size': `${particle.size}px`,
                '--particle-duration': `${particle.duration}s`,
                '--particle-delay': `${particle.delay}s`,
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}

      {/* Mouse Follow Effect */}
      {enablePointerGlow && (
        <div
          ref={glowRef}
          className="pointer-events-none fixed z-50 transition-transform duration-100 ease-out mouse-follow-glow"
        />
      )}

      {/* Ambient Glow Effects */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 ambient-glow-container">
        <div className="ambient-glow-purple ambient-glow-1" />
        <div className="ambient-glow-blue ambient-glow-2" />
        <div className="ambient-glow-violet ambient-glow-3" />
      </div>

      {/* System Scan Line */}
      {!reduceEffects && <div className="system-scan-line" />}
    </>
  );
};

export default GlobalEffects;
