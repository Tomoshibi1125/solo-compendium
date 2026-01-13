import { useEffect, useState } from 'react';

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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Generate shadow particles
  useEffect(() => {
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
    const interval = setInterval(generateParticles, 30000);
    return () => clearInterval(interval);
  }, []);

  // Track mouse position for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {/* Shadow Particles */}
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

      {/* Mouse Follow Effect */}
      <div
        className="pointer-events-none fixed z-50 transition-transform duration-100 ease-out mouse-follow-glow"
        style={{
          transform: `translate(${mousePosition.x - 20}px, ${mousePosition.y - 20}px)`,
        }}
      />

      {/* Ambient Glow Effects */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 ambient-glow-container">
        <div className="ambient-glow-purple ambient-glow-1" />
        <div className="ambient-glow-blue ambient-glow-2" />
        <div className="ambient-glow-violet ambient-glow-3" />
      </div>

      {/* System Scan Line */}
      <div className="system-scan-line" />
    </>
  );
};

export default GlobalEffects;
