import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface SovereignPowerSequenceProps {
  isActive: boolean;
  tier?: 'ascendant' | 'sovereign' | 'regent' | 'monarch';
  duration?: number;
  onComplete?: () => void;
  className?: string;
}

export const SovereignPowerSequence = ({
  isActive,
  tier = 'sovereign',
  duration = 3000,
  onComplete,
  className
}: SovereignPowerSequenceProps) => {
  const [phase, setPhase] = useState<'idle' | 'charging' | 'ascension' | 'complete'>('idle');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (isActive && phase === 'idle') {
      setPhase('charging');
    }
  }, [isActive, phase]);

  useEffect(() => {
    if (!canvasRef.current || phase === 'idle') return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let startTime = Date.now();
    let currentPhase = phase;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      if (currentPhase === 'charging') {
        // Power charging effect
        const chargeRadius = progress * Math.max(canvas.width, canvas.height) * 0.3;

        // Outer charging ring
        ctx.globalAlpha = progress * 0.8;
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(centerX, centerY, chargeRadius, 0, Math.PI * 2 * progress);
        ctx.stroke();

        // Inner charging ring
        ctx.globalAlpha = progress * 0.6;
        ctx.strokeStyle = '#8b008b';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Energy bolts
        for (let i = 0; i < 12; i++) {
          const angle = (i / 12) * Math.PI * 2;
          const boltProgress = (progress + i * 0.1) % 1;
          const boltLength = boltProgress * chargeRadius * 0.8;

          ctx.globalAlpha = boltProgress * progress * 0.7;
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(
            centerX + Math.cos(angle) * chargeRadius * 0.1,
            centerY + Math.sin(angle) * chargeRadius * 0.1
          );
          ctx.lineTo(
            centerX + Math.cos(angle) * boltLength,
            centerY + Math.sin(angle) * boltLength
          );
          ctx.stroke();
        }

        // Charging particles
        for (let i = 0; i < 30; i++) {
          const particleAngle = Math.random() * Math.PI * 2;
          const particleRadius = Math.random() * chargeRadius;
          const particleSize = Math.random() * 3 + 1;

          ctx.globalAlpha = Math.random() * progress * 0.5;
          ctx.fillStyle = '#ffd700';
          ctx.beginPath();
          ctx.arc(
            centerX + Math.cos(particleAngle) * particleRadius,
            centerY + Math.sin(particleAngle) * particleRadius,
            particleSize,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }

        if (progress >= 1) {
          currentPhase = 'ascension';
          startTime = Date.now();
        }

      } else if (currentPhase === 'ascension') {
        // Ascension effect
        const ascensionScale = progress;

        // Sovereign seal formation
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.scale(ascensionScale, ascensionScale);

        // Outer seal ring
        ctx.globalAlpha = progress * 0.9;
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(0, 0, 100, 0, Math.PI * 2);
        ctx.stroke();

        // Seal runes
        ctx.fillStyle = '#ffd700';
        ctx.font = '24px Orbitron, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const runes = ['S', 'O', 'V', 'E', 'R', 'E', 'I', 'G', 'N'];
        for (let i = 0; i < runes.length; i++) {
          const angle = (i / runes.length) * Math.PI * 2 - Math.PI / 2;
          const x = Math.cos(angle) * 80;
          const y = Math.sin(angle) * 80;

          ctx.globalAlpha = progress;
          ctx.fillText(runes[i], x, y);
        }

        ctx.restore();

        // Ascension beams
        for (let i = 0; i < 8; i++) {
          const beamAngle = (i / 8) * Math.PI * 2 + progress * Math.PI * 2;
          const beamLength = canvas.height * 0.5 * progress;

          ctx.globalAlpha = progress * 0.6;
          ctx.strokeStyle = '#ffd700';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(
            centerX + Math.cos(beamAngle) * beamLength,
            centerY + Math.sin(beamAngle) * beamLength
          );
          ctx.stroke();
        }

        // Crown formation (for monarch tier)
        if (tier === 'monarch' && progress > 0.7) {
          const crownProgress = (progress - 0.7) / 0.3;
          ctx.globalAlpha = crownProgress;

          ctx.strokeStyle = '#ffd700';
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.moveTo(centerX - 50, centerY - 50);
          ctx.lineTo(centerX - 25, centerY - 80);
          ctx.lineTo(centerX, centerY - 50);
          ctx.lineTo(centerX + 25, centerY - 80);
          ctx.lineTo(centerX + 50, centerY - 50);
          ctx.stroke();

          // Crown jewels
          ctx.fillStyle = '#ff1493';
          ctx.beginPath();
          ctx.arc(centerX - 25, centerY - 80, 4, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#4169e1';
          ctx.beginPath();
          ctx.arc(centerX, centerY - 50, 4, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#32cd32';
          ctx.beginPath();
          ctx.arc(centerX + 25, centerY - 80, 4, 0, Math.PI * 2);
          ctx.fill();
        }

        if (progress >= 1) {
          currentPhase = 'complete';
          setPhase('complete');
          onComplete?.();
          return;
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [phase, duration, tier, onComplete]);

  if (phase === 'idle' || phase === 'complete') return null;

  const getPhaseText = () => {
    switch (phase) {
      case 'charging':
        return tier === 'monarch' ? 'MONARCH ASCENSION CHARGING...' :
               tier === 'regent' ? 'REGENT POWER CHARGING...' :
               'SOVEREIGN POWER CHARGING...';
      case 'ascension':
        return tier === 'monarch' ? 'MONARCH CROWN FORGING...' :
               tier === 'regent' ? 'REGENT AUTHORITY ASCENDING...' :
               'SOVEREIGN ASCENSION COMPLETE';
      default:
        return '';
    }
  };

  return (
    <div className={cn("fixed inset-0 z-50 pointer-events-none", className)}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Sovereign energy field */}
      <div className="absolute inset-0 bg-gradient-radial from-monarch-gold/20 via-transparent to-void-black/80" />

      {/* Status text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="text-monarch-gold font-display text-xl tracking-widest animate-pulse"
          style={{
            textShadow: '0 0 20px #ffd700, 0 0 40px #ffd700, 0 0 60px #ffd700'
          }}
        >
          {getPhaseText()}
        </div>
      </div>

      {/* Power level indicator */}
      {phase === 'charging' && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="bg-void-black/80 border border-monarch-gold/50 rounded-full px-6 py-2">
            <div className="flex items-center space-x-4">
              <span className="text-monarch-gold font-display text-sm tracking-widest">
                POWER LEVEL
              </span>
              <div className="w-32 h-2 bg-void-black rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-monarch-gold to-monarch-silver animate-pulse"
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SovereignPowerSequence;
