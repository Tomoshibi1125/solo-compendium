import { cn } from '@/lib/utils';

interface ShadowMonarchLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'supreme' | 'arise';
}

export function ShadowMonarchLogo({ className, size = 'md', variant = 'default' }: ShadowMonarchLogoProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48',
  };

  const variantStyles = {
    default: {
      outerGlow: 'animate-spin-slow',
      innerPulse: 'animate-pulse-3s',
      corePulse: 'animate-pulse-1-5s',
    },
    supreme: {
      outerGlow: 'animate-spin-slow',
      innerPulse: 'animate-pulse-2s',
      corePulse: 'animate-pulse',
    },
    arise: {
      outerGlow: 'animate-spin-slow-15s',
      innerPulse: 'animate-pulse-3s',
      corePulse: 'animate-pulse-1-5s',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className={cn('relative', sizeClasses[size], className)}>
      {/* Outer Shadow Aura */}
      <div className="absolute inset-0 rounded-full bg-gradient-radial from-shadow-purple/30 via-shadow-blue/20 to-transparent blur-xl animate-pulse-glow" />
      
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full relative z-10"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Gradient Definitions - Supreme Deity Palette */}
        <defs>
          <linearGradient id="monarchGradientSupreme" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(220 100% 60%)" />
            <stop offset="30%" stopColor="hsl(265 75% 55%)" />
            <stop offset="60%" stopColor="hsl(280 85% 65%)" />
            <stop offset="100%" stopColor="hsl(42 100% 50%)" />
          </linearGradient>
          <radialGradient id="shadowCoreDeep" cx="50%" cy="50%">
            <stop offset="0%" stopColor="hsl(265 50% 25%)" stopOpacity="0.9" />
            <stop offset="50%" stopColor="hsl(228 40% 10%)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="hsl(228 40% 2%)" stopOpacity="0.5" />
          </radialGradient>
          <linearGradient id="ariseGlow" x1="50%" y1="100%" x2="50%" y2="0%">
            <stop offset="0%" stopColor="hsl(280 85% 65%)" stopOpacity="0.8" />
            <stop offset="50%" stopColor="hsl(265 75% 55%)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(220 100% 60%)" stopOpacity="0.4" />
          </linearGradient>
          <filter id="shadowGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Outer Ring - Monarch's Domain */}
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke="url(#monarchGradientSupreme)"
          strokeWidth="1.5"
          opacity="0.5"
          className={styles.outerGlow}
          strokeDasharray="8 4"
        />
        
        {/* Second Ring - Shadow Authority */}
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="url(#monarchGradientSupreme)"
          strokeWidth="2"
          opacity="0.7"
          className={styles.outerGlow}
        />
        
        {/* Shadow Energy Core */}
        <circle
          cx="50"
          cy="50"
          r="22"
          fill="url(#shadowCoreDeep)"
          className={styles.innerPulse}
        />
        
        {/* Monarch's Seal - The Crown */}
        <path
          d="M 50 15 L 62 35 L 85 35 L 68 52 L 75 75 L 50 62 L 25 75 L 32 52 L 15 35 L 38 35 Z"
          fill="url(#monarchGradientSupreme)"
          opacity="0.85"
          filter="url(#shadowGlow)"
          className={styles.innerPulse}
        />
        
        {/* Inner Shadow Star */}
        <path
          d="M 50 28 L 55 42 L 70 42 L 58 52 L 62 66 L 50 58 L 38 66 L 42 52 L 30 42 L 45 42 Z"
          fill="url(#ariseGlow)"
          opacity="0.9"
          className={styles.corePulse}
        />
        
        {/* Central Core - Supreme Deity's Eye */}
        <circle
          cx="50"
          cy="50"
          r="8"
          fill="hsl(220 100% 60%)"
          className={styles.corePulse}
          filter="url(#shadowGlow)"
        />
        
        {/* Inner Eye */}
        <circle
          cx="50"
          cy="50"
          r="4"
          fill="hsl(280 85% 75%)"
          className="animate-pulse"
        />
        
        {/* Central Point - Divine Spark */}
        <circle
          cx="50"
          cy="50"
          r="1.5"
          fill="white"
          opacity="0.9"
        />
      </svg>
    </div>
  );
}
