import { useEffect, useRef, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { usePerformanceProfile } from '@/lib/performanceProfile';
import { GateEnergyFlow } from './GateEnergyFlow';

interface RiftLayer {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  animationDelay: number;
  color: string;
}

interface FogParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  direction: number;
}

interface CosmicBackgroundProps {
  variant?: 'default' | 'gate' | 'sovereign' | 'shadow';
  intensity?: 'low' | 'medium' | 'high';
  animated?: boolean;
  className?: string;
}

export const CosmicBackground = ({
  variant = 'default',
  intensity = 'medium',
  animated = true,
  className
}: CosmicBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fogRef = useRef<HTMLDivElement>(null);
  const riftsRef = useRef<HTMLDivElement>(null);
  const { reducedMotion, fx, tier } = usePerformanceProfile();

  const reduceEffects = reducedMotion || tier === 'low';
  const finalIntensity = reduceEffects ? 'low' : intensity;
  const enableAnimation = animated && !reducedMotion;

  // Generate rift layers based on variant and intensity
  const riftLayers = useMemo(() => {
    const layers: RiftLayer[] = [];
    const layerCount = finalIntensity === 'high' ? 8 : finalIntensity === 'medium' ? 5 : 3;

    for (let i = 0; i < layerCount; i++) {
      let color = '';
      switch (variant) {
        case 'gate':
          color = `hsl(${200 + i * 20}, 70%, ${30 + i * 10}%)`; // Blue-purple spectrum
          break;
        case 'sovereign':
          color = `hsl(${280 + i * 15}, 80%, ${25 + i * 12}%)`; // Purple-gold spectrum
          break;
        case 'shadow':
          color = `hsl(${240 + i * 10}, 60%, ${20 + i * 8}%)`; // Deep blue-purple
          break;
        default:
          color = `hsl(${220 + i * 20}, 65%, ${25 + i * 10}%)`; // Default cosmic
      }

      layers.push({
        id: i,
        x: Math.random() * 120 - 10, // Allow overflow for parallax
        y: Math.random() * 120 - 10,
        width: Math.random() * 200 + 100,
        height: Math.random() * 300 + 150,
        rotation: Math.random() * 360,
        opacity: Math.random() * 0.3 + 0.1,
        animationDelay: Math.random() * 10,
        color
      });
    }
    return layers;
  }, [variant, finalIntensity]);

  // Generate fog particles
  const fogParticles = useMemo(() => {
    const particles: FogParticle[] = [];
    const particleCount = finalIntensity === 'high' ? 15 : finalIntensity === 'medium' ? 10 : 5;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 300 + 200,
        opacity: Math.random() * 0.15 + 0.05,
        speed: Math.random() * 0.5 + 0.1,
        direction: Math.random() * 360
      });
    }
    return particles;
  }, [finalIntensity]);

  // Canvas animation for cosmic energy field
  useEffect(() => {
    if (!canvasRef.current || !enableAnimation || finalIntensity === 'low') return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw cosmic energy field
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
      );

      const colors = variant === 'gate' ? ['#1e1b4b', '#312e81', '#1e1b4b'] :
                   variant === 'sovereign' ? ['#1e1b4b', '#581c87', '#1e1b4b'] :
                   variant === 'shadow' ? ['#0f0a19', '#1e1b4b', '#0f0a19'] :
                   ['#0f0a19', '#1e1b4b', '#0f0a19'];

      gradient.addColorStop(0, colors[0]);
      gradient.addColorStop(0.5, colors[1]);
      gradient.addColorStop(1, colors[2]);

      ctx.fillStyle = gradient;
      ctx.globalAlpha = 0.8;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw animated energy streams
      ctx.globalAlpha = 0.3;
      for (let i = 0; i < 5; i++) {
        const x = Math.sin(time + i) * canvas.width * 0.3 + canvas.width / 2;
        const y = Math.cos(time * 0.7 + i) * canvas.height * 0.3 + canvas.height / 2;

        ctx.beginPath();
        ctx.arc(x, y, 2 + Math.sin(time * 2 + i) * 1, 0, Math.PI * 2);
        ctx.fillStyle = variant === 'gate' ? '#3b82f6' :
                       variant === 'sovereign' ? '#a855f7' :
                       variant === 'shadow' ? '#6366f1' : '#6366f1';
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [enableAnimation, finalIntensity, variant]);

  return (
    <div className={cn("fixed inset-0 pointer-events-none z-0", className)}>
      {/* Base cosmic canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: finalIntensity === 'low' ? 0.3 : 0.6 }}
      />

      {/* Dimensional rift layers */}
      <div ref={riftsRef} className="absolute inset-0 overflow-hidden">
        {riftLayers.map((rift) => (
          <div
            key={rift.id}
            className={cn(
              "absolute rounded-full blur-xl",
              enableAnimation && "animate-pulse-glow"
            )}
            style={{
              left: `${rift.x}%`,
              top: `${rift.y}%`,
              width: `${rift.width}px`,
              height: `${rift.height}px`,
              transform: `rotate(${rift.rotation}deg)`,
              opacity: rift.opacity,
              background: `radial-gradient(circle, ${rift.color}40 0%, transparent 70%)`,
              animationDelay: enableAnimation ? `${rift.animationDelay}s` : undefined,
              animationDuration: enableAnimation ? `${8 + rift.id * 2}s` : undefined,
            }}
          />
        ))}
      </div>

      {/* Atmospheric fog particles */}
      <div ref={fogRef} className="absolute inset-0 overflow-hidden">
        {fogParticles.map((particle) => (
          <div
            key={particle.id}
            className={cn(
              "absolute rounded-full",
              enableAnimation && "animate-float"
            )}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              background: `radial-gradient(circle, ${
                variant === 'gate' ? '#1e40af' :
                variant === 'sovereign' ? '#7c3aed' :
                variant === 'shadow' ? '#1e1b4b' : '#1e1b4b'
              } 0%, transparent 100%)`,
              transform: enableAnimation ?
                `translate(${Math.cos(particle.direction) * 50}px, ${Math.sin(particle.direction) * 50}px)` :
                undefined,
              transition: enableAnimation ?
                `transform ${20 / particle.speed}s ease-in-out infinite alternate` :
                undefined,
              animationDelay: enableAnimation ? `${particle.id * 2}s` : undefined,
            }}
          />
        ))}
      </div>

      {/* Energy field overlay */}
      <div
        className={cn(
          "absolute inset-0",
          enableAnimation && "animate-shadow-pulse"
        )}
        style={{
          background: `radial-gradient(circle at 50% 50%, transparent 0%, ${
            variant === 'gate' ? 'rgba(59, 130, 246, 0.1)' :
            variant === 'sovereign' ? 'rgba(168, 85, 247, 0.1)' :
            variant === 'shadow' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.1)'
          } 100%)`,
        }}
      />

      {/* Gate energy flows for gate variant */}
      {variant === 'gate' && (
        <GateEnergyFlow tier="e" intensity={finalIntensity} animated={enableAnimation} />
      )}
    </div>
  );
};

export default CosmicBackground;
