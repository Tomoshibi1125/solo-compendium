import { cn } from '@/lib/utils';

interface HunterBadgeProps {
  className?: string;
  rank?: 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'NATIONAL';
  size?: 'sm' | 'md' | 'lg';
  showGlow?: boolean;
}

const rankColors = {
  E: { primary: 'hsl(0 0% 55%)', secondary: 'hsl(0 0% 45%)', glow: '0 0% 50%' },
  D: { primary: 'hsl(35 85% 50%)', secondary: 'hsl(35 85% 40%)', glow: '35 85% 50%' },
  C: { primary: 'hsl(195 85% 50%)', secondary: 'hsl(195 85% 40%)', glow: '195 85% 50%' },
  B: { primary: 'hsl(275 75% 55%)', secondary: 'hsl(275 75% 45%)', glow: '275 75% 55%' },
  A: { primary: 'hsl(0 90% 55%)', secondary: 'hsl(0 90% 45%)', glow: '0 90% 55%' },
  S: { primary: 'hsl(42 100% 55%)', secondary: 'hsl(42 100% 45%)', glow: '42 100% 55%' },
  SS: { primary: 'hsl(265 100% 70%)', secondary: 'hsl(280 85% 60%)', glow: '265 100% 70%' },
  NATIONAL: { primary: 'hsl(220 100% 65%)', secondary: 'hsl(220 100% 55%)', glow: '220 100% 65%' },
};

const rankDisplayNames: Record<string, string> = {
  E: 'E',
  D: 'D',
  C: 'C',
  B: 'B',
  A: 'A',
  S: 'S',
  SS: 'SS',
  NATIONAL: 'N',
};

export function HunterBadge({ className, rank = 'C', size = 'md', showGlow = true }: HunterBadgeProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
  };

  const colors = rankColors[rank];
  const isHighRank = ['S', 'SS', 'NATIONAL'].includes(rank);
  const displayRank = rankDisplayNames[rank];

  return (
    <div className={cn('relative', sizeClasses[size], className)}>
      {/* Outer glow for high ranks */}
      {showGlow && isHighRank && (
        <div 
          className="absolute inset-0 rounded-full blur-xl animate-pulse-glow"
          style={{ background: `radial-gradient(circle, hsl(${colors.glow} / 0.4) 0%, transparent 70%)` }}
        />
      )}
      
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full relative z-10"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`badgeGrad-${rank}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.primary} />
            <stop offset="100%" stopColor={colors.secondary} />
          </linearGradient>
          <filter id={`badgeGlow-${rank}`}>
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Badge background - Hexagon shield */}
        <path
          d="M 50 8 L 88 25 L 88 68 L 50 92 L 12 68 L 12 25 Z"
          fill={colors.secondary}
          opacity="0.15"
          stroke={`url(#badgeGrad-${rank})`}
          strokeWidth="2"
        />
        
        {/* Inner hexagon pattern */}
        <path
          d="M 50 18 L 78 30 L 78 62 L 50 80 L 22 62 L 22 30 Z"
          fill="none"
          stroke={colors.primary}
          strokeWidth="1.5"
          opacity="0.5"
        />
        
        {/* Inner core hexagon */}
        <path
          d="M 50 28 L 68 36 L 68 56 L 50 68 L 32 56 L 32 36 Z"
          fill={colors.secondary}
          opacity="0.2"
        />
        
        {/* Rank letter */}
        <text
          x="50"
          y={rank === 'SS' ? '54' : rank === 'NATIONAL' ? '58' : '56'}
          textAnchor="middle"
          fontSize={rank === 'SS' ? '24' : rank === 'NATIONAL' ? '36' : '30'}
          fontWeight="bold"
          fill={colors.primary}
          className="font-display"
          filter={isHighRank ? `url(#badgeGlow-${rank})` : undefined}
        >
          {displayRank}
        </text>
        
        {/* Decorative corner marks */}
        <line x1="50" y1="10" x2="50" y2="16" stroke={colors.primary} strokeWidth="1.5" opacity="0.6" />
        <line x1="50" y1="84" x2="50" y2="90" stroke={colors.primary} strokeWidth="1.5" opacity="0.6" />
        
        {/* Pulsing glow ring */}
        {showGlow && (
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={colors.primary}
            strokeWidth="1"
            opacity="0.25"
            className={isHighRank ? "animate-pulse-2s" : "animate-pulse-3s"}
          />
        )}
        
        {/* Extra ring for SS and National */}
        {isHighRank && showGlow && (
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke={colors.primary}
            strokeWidth="0.5"
            opacity="0.15"
            className="animate-pulse-delay-1s"
          />
        )}
      </svg>
    </div>
  );
}
