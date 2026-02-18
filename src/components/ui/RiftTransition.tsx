import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface RiftTransitionProps {
  isActive: boolean;
  duration?: number;
  variant?: 'gate' | 'rift' | 'sovereign';
  onComplete?: () => void;
  className?: string;
}

export const RiftTransition = ({
  isActive,
  duration = 2000,
  variant = 'gate',
  onComplete,
  className
}: RiftTransitionProps) => {
  const [phase, setPhase] = useState<'idle' | 'opening' | 'active' | 'closing'>('idle');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (isActive && phase === 'idle') {
      setPhase('opening');
    } else if (!isActive && phase !== 'idle') {
      setPhase('closing');
    }
  }, [isActive, phase]);

  useEffect(() => {
    if (!canvasRef.current) return;

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
    let animationPhase = phase;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (animationPhase === 'opening' || animationPhase === 'active') {
        // Rift opening effect
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        // Calculate rift dimensions based on progress
        const riftWidth = progress * canvas.width * 0.8;
        const riftHeight = progress * canvas.height * 0.6;

        // Create rift gradient
        let outerColor = '#ff4500';
        let innerColor = '#4169e1';
        let coreColor = '#ffffff';

        switch (variant) {
          case 'sovereign':
            outerColor = '#ffd700';
            innerColor = '#8b008b';
            coreColor = '#ffffff';
            break;
          case 'rift':
            outerColor = '#ff1493';
            innerColor = '#000000';
            coreColor = '#ffffff';
            break;
        }

        // Outer rift ring
        ctx.globalAlpha = progress * 0.8;
        ctx.strokeStyle = outerColor;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, riftWidth / 2, riftHeight / 2, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Inner rift ring
        ctx.globalAlpha = progress * 0.6;
        ctx.strokeStyle = innerColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Core energy streams
        ctx.globalAlpha = progress;
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2;
          const startRadius = 20;
          const endRadius = riftWidth / 2;

          ctx.strokeStyle = coreColor;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(
            centerX + Math.cos(angle) * startRadius,
            centerY + Math.sin(angle) * startRadius
          );
          ctx.lineTo(
            centerX + Math.cos(angle) * endRadius,
            centerY + Math.sin(angle) * endRadius
          );
          ctx.stroke();
        }

        // Energy particles
        for (let i = 0; i < 50; i++) {
          const particleProgress = (elapsed * 0.002 + i * 0.1) % 1;
          const angle = Math.random() * Math.PI * 2;
          const radius = particleProgress * Math.max(riftWidth, riftHeight) / 2;

          ctx.globalAlpha = (1 - particleProgress) * progress * 0.5;
          ctx.fillStyle = coreColor;
          ctx.beginPath();
          ctx.arc(
            centerX + Math.cos(angle) * radius,
            centerY + Math.sin(angle) * radius,
            2,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }

        if (progress >= 1 && animationPhase === 'opening') {
          animationPhase = 'active';
          startTime = Date.now();
        }

      } else if (animationPhase === 'closing') {
        // Rift closing effect (reverse of opening)
        const reverseProgress = 1 - progress;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const riftWidth = reverseProgress * canvas.width * 0.8;
        const riftHeight = reverseProgress * canvas.height * 0.6;

        let outerColor = '#ff4500';
        let innerColor = '#4169e1';
        let coreColor = '#ffffff';

        switch (variant) {
          case 'sovereign':
            outerColor = '#ffd700';
            innerColor = '#8b008b';
            coreColor = '#ffffff';
            break;
          case 'rift':
            outerColor = '#ff1493';
            innerColor = '#000000';
            coreColor = '#ffffff';
            break;
        }

        ctx.globalAlpha = reverseProgress * 0.8;
        ctx.strokeStyle = outerColor;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, riftWidth / 2, riftHeight / 2, 0, 0, Math.PI * 2);
        ctx.stroke();

        if (progress >= 1) {
          setPhase('idle');
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
  }, [phase, duration, variant, onComplete]);

  if (phase === 'idle') return null;

  return (
    <div className={cn("fixed inset-0 z-50 pointer-events-none", className)}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Screen distortion effect */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black opacity-50",
          phase === 'opening' && "animate-[rift-portal_1s_ease-out]",
          phase === 'closing' && "animate-[rift-portal_1s_ease-out_reverse]"
        )}
      />

      {/* Audio cue (visual representation) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={cn(
            "text-white font-display text-2xl tracking-widest opacity-0",
            "animate-fade-in"
          )}
          style={{
            animationDelay: '0.5s',
            '--text-shadow-color': variant === 'sovereign' ? '#ffd700' :
                                   variant === 'rift' ? '#ff1493' : '#ff4500'
          } as React.CSSProperties}
        >
          {phase === 'opening' && 'RIFT OPENING...'}
          {phase === 'active' && 'DIMENSIONAL BREACH ACTIVE'}
          {phase === 'closing' && 'RIFT CLOSING...'}
        </div>
      </div>
    </div>
  );
};

export default RiftTransition;
