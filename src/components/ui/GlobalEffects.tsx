import { useEffect, useMemo, useRef, useState, type ComponentType } from 'react';
import type { IParticlesProps } from '@tsparticles/react';
import type { ISourceOptions } from '@tsparticles/engine';
import { usePerformanceProfile } from '@/lib/performanceProfile';

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
  const [hasFinePointer, setHasFinePointer] = useState(false);
  const [ParticlesComponent, setParticlesComponent] = useState<ComponentType<IParticlesProps> | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const { reducedMotion, fx, tier } = usePerformanceProfile();

  const reduceEffects = reducedMotion || tier === 'low';
  const enablePointerGlow = hasFinePointer && fx.enablePointerGlow;
  const enableAdvancedParticles = fx.enableTsparticles;
  const showCssParticles = !reduceEffects && !enableAdvancedParticles;

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
    if (!showCssParticles) {
      setParticles([]);
      return;
    }

    const generateParticles = () => {
      const newParticles: Particle[] = [];
      for (let i = 0; i < fx.particleCount; i++) {
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
  }, [fx.particleCount, showCssParticles]);

  useEffect(() => {
    let active = true;
    if (!enableAdvancedParticles) {
      setParticlesComponent(null);
      return undefined;
    }

    const initParticles = async () => {
      try {
        const [{ initParticlesEngine, Particles }, { loadSlim }] = await Promise.all([
          import('@tsparticles/react'),
          import('@tsparticles/slim'),
        ]);
        await initParticlesEngine(async (engine) => {
          await loadSlim(engine);
        });
        if (active) {
          setParticlesComponent(() => Particles);
        }
      } catch {
        if (active) {
          setParticlesComponent(null);
        }
      }
    };

    void initParticles();
    return () => {
      active = false;
    };
  }, [enableAdvancedParticles]);

  const particlesOptions = useMemo<ISourceOptions>(
    () => ({
      fullScreen: { enable: false },
      fpsLimit: 60,
      detectRetina: true,
      background: { color: { value: 'transparent' } },
      interactivity: {
        events: {
          onHover: { enable: enablePointerGlow, mode: 'repulse' },
          resize: true,
        },
        modes: {
          repulse: { distance: 120, duration: 0.4 },
        },
      },
      particles: {
        number: {
          value: Math.round(fx.particleCount * 3.2),
          density: { enable: true, area: 900 },
        },
        color: { value: ['#60a5fa', '#a855f7', '#f472b6'] },
        opacity: { value: { min: 0.15, max: 0.5 } },
        size: { value: { min: 1, max: 3 } },
        move: {
          enable: true,
          speed: 0.6,
          outModes: { default: 'out' },
        },
        links: {
          enable: true,
          distance: 140,
          opacity: 0.2,
          color: '#7c3aed',
        },
      },
    }),
    [enablePointerGlow, fx.particleCount]
  );

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
      {showCssParticles && (
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

      {enableAdvancedParticles && ParticlesComponent && (
        <ParticlesComponent
          id="global-fx-particles"
          options={particlesOptions}
          className="pointer-events-none fixed inset-0 z-0"
          style={{ opacity: fx.ambientOpacity }}
        />
      )}

      {/* Mouse Follow Effect */}
      {enablePointerGlow && (
        <div
          ref={glowRef}
          className="pointer-events-none fixed z-50 transition-transform duration-100 ease-out mouse-follow-glow"
        />
      )}

      {/* Ambient Glow Effects */}
      <div
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 ambient-glow-container"
        style={{ opacity: fx.ambientOpacity }}
      >
        <div className="ambient-glow-purple ambient-glow-1" />
        <div className="ambient-glow-blue ambient-glow-2" />
        <div className="ambient-glow-violet ambient-glow-3" />
      </div>

      {/* System Scan Line */}
      {fx.enableScanline && <div className="system-scan-line" />}
    </>
  );
};

export default GlobalEffects;
