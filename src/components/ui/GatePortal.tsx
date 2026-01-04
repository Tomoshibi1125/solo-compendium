import { cn } from '@/lib/utils';

interface GatePortalProps {
  className?: string;
  rank?: 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'NATIONAL';
  animated?: boolean;
  showRunes?: boolean;
}

const rankColors = {
  E: { outer: 'hsl(0 0% 55%)', inner: 'hsl(0 0% 45%)', glow: 'hsl(0 0% 50% / 0.3)' },
  D: { outer: 'hsl(35 85% 50%)', inner: 'hsl(35 85% 40%)', glow: 'hsl(35 85% 50% / 0.4)' },
  C: { outer: 'hsl(195 85% 50%)', inner: 'hsl(195 85% 40%)', glow: 'hsl(195 85% 50% / 0.4)' },
  B: { outer: 'hsl(275 75% 55%)', inner: 'hsl(275 75% 45%)', glow: 'hsl(275 75% 55% / 0.5)' },
  A: { outer: 'hsl(0 90% 55%)', inner: 'hsl(0 90% 45%)', glow: 'hsl(0 90% 55% / 0.5)' },
  S: { outer: 'hsl(42 100% 55%)', inner: 'hsl(42 100% 45%)', glow: 'hsl(42 100% 55% / 0.6)' },
  SS: { outer: 'hsl(265 100% 70%)', inner: 'hsl(280 85% 60%)', glow: 'hsl(265 100% 70% / 0.7)' },
  NATIONAL: { outer: 'hsl(220 100% 65%)', inner: 'hsl(220 100% 55%)', glow: 'hsl(220 100% 65% / 0.7)' },
};

const rankDisplayNames: Record<string, string> = {
  E: 'E',
  D: 'D',
  C: 'C',
  B: 'B',
  A: 'A',
  S: 'S',
  SS: 'SS',
  NATIONAL: '★',
};

export function GatePortal({ className, rank = 'C', animated = true, showRunes = true }: GatePortalProps) {
  const colors = rankColors[rank];
  const isHighRank = ['S', 'SS', 'NATIONAL'].includes(rank);

  return (
    <div className={cn('relative', className)}>
      {/* Outer glow effect for high ranks */}
      {isHighRank && (
        <div 
          className="absolute inset-0 rounded-full blur-2xl animate-pulse-glow"
          style={{ background: colors.glow }}
        />
      )}
      
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full relative z-10"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Definitions */}
        <defs>
          <radialGradient id={`portalCore-${rank}`} cx="50%" cy="50%">
            <stop offset="0%" stopColor={colors.inner} stopOpacity="0.8" />
            <stop offset="50%" stopColor={colors.outer} stopOpacity="0.4" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          <filter id={`gateGlow-${rank}`}>
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Outer decorative ring with runes */}
        {showRunes && (
          <circle
            cx="100"
            cy="100"
            r="95"
            fill="none"
            stroke={colors.outer}
            strokeWidth="1"
            opacity="0.3"
            strokeDasharray="3 8"
            className={animated ? 'animate-spin-slow-reverse-10s' : ''}
          />
        )}

        {/* Outer ring */}
        <circle
          cx="100"
          cy="100"
          r="88"
          fill="none"
          stroke={colors.outer}
          strokeWidth="3"
          opacity="0.7"
          className={animated ? 'animate-spin-slow-15s' : ''}
          filter={`url(#gateGlow-${rank})`}
        />
        
        {/* Middle ring */}
        <circle
          cx="100"
          cy="100"
          r="72"
          fill="none"
          stroke={colors.inner}
          strokeWidth="2"
          opacity="0.8"
          className={animated ? 'animate-spin-slow-reverse-10s' : ''}
        />
        
        {/* Inner decorative ring */}
        <circle
          cx="100"
          cy="100"
          r="58"
          fill="none"
          stroke={colors.outer}
          strokeWidth="1"
          opacity="0.5"
          strokeDasharray="12 6"
          className={animated ? 'animate-spin-slow' : ''}
        />
        
        {/* Inner portal core */}
        <circle
          cx="100"
          cy="100"
          r="48"
          fill={`url(#portalCore-${rank})`}
          className={animated ? 'animate-pulse-3s' : ''}
        />
        
        {/* Portal energy waves */}
        {animated && (
          <>
            <circle
              cx="100"
              cy="100"
              r="48"
              fill="none"
              stroke={colors.outer}
              strokeWidth="2"
              opacity="0.6"
              className="animate-pulse-2s"
            />
            <circle
              cx="100"
              cy="100"
              r="38"
              fill="none"
              stroke={colors.inner}
              strokeWidth="1"
              opacity="0.4"
              className="animate-pulse-delay-1s"
            />
            {isHighRank && (
              <circle
                cx="100"
                cy="100"
                r="28"
                fill="none"
                stroke={colors.outer}
                strokeWidth="1"
                opacity="0.5"
                className="animate-pulse-3s"
              />
            )}
          </>
        )}
        
        {/* Gate rank symbol */}
        <text
          x="100"
          y={rank === 'NATIONAL' ? '115' : '112'}
          textAnchor="middle"
          fontSize={rank === 'SS' ? '38' : rank === 'NATIONAL' ? '52' : '48'}
          fontWeight="bold"
          fill={colors.outer}
          className="font-display"
          opacity="0.95"
          filter={`url(#gateGlow-${rank})`}
        >
          {rankDisplayNames[rank]}
        </text>
        
        {/* Rank label for special ranks */}
        {rank === 'NATIONAL' && (
          <text
            x="100"
            y="140"
            textAnchor="middle"
            fontSize="12"
            fontWeight="bold"
            fill={colors.outer}
            className="font-display"
            opacity="0.8"
          >
            NATIONAL
          </text>
        )}
      </svg>
    </div>
  );
}
