import { cn } from '@/lib/utils';

interface GatePortalProps {
  className?: string;
  rank?: 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
  animated?: boolean;
}

const rankColors = {
  E: { outer: '#9ca3af', inner: '#6b7280' },
  D: { outer: '#60a5fa', inner: '#3b82f6' },
  C: { outer: '#34d399', inner: '#10b981' },
  B: { outer: '#a78bfa', inner: '#8b5cf6' },
  A: { outer: '#f472b6', inner: '#ec4899' },
  S: { outer: '#fbbf24', inner: '#f59e0b' },
};

export function GatePortal({ className, rank = 'C', animated = true }: GatePortalProps) {
  const colors = rankColors[rank];

  return (
    <div className={cn('relative', className)}>
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer ring */}
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke={colors.outer}
          strokeWidth="4"
          opacity="0.6"
          className={animated ? 'animate-spin-slow-15s' : ''}
        />
        
        {/* Middle ring */}
        <circle
          cx="100"
          cy="100"
          r="70"
          fill="none"
          stroke={colors.inner}
          strokeWidth="3"
          opacity="0.7"
          className={animated ? 'animate-spin-slow-reverse-10s' : ''}
        />
        
        {/* Inner portal core */}
        <circle
          cx="100"
          cy="100"
          r="50"
          fill={colors.inner}
          opacity="0.3"
          className={animated ? 'animate-pulse' : ''}
        />
        
        {/* Portal energy waves */}
        {animated && (
          <>
            <circle
              cx="100"
              cy="100"
              r="50"
              fill="none"
              stroke={colors.outer}
              strokeWidth="2"
              opacity="0.5"
              className="animate-pulse-2s"
            />
            <circle
              cx="100"
              cy="100"
              r="50"
              fill="none"
              stroke={colors.outer}
              strokeWidth="1"
              opacity="0.3"
              className="animate-pulse-delay-1s"
            />
          </>
        )}
        
        {/* Gate rank symbol */}
        <text
          x="100"
          y="110"
          textAnchor="middle"
          fontSize="48"
          fontWeight="bold"
          fill={colors.outer}
          className="font-display"
          opacity="0.9"
        >
          {rank}
        </text>
      </svg>
    </div>
  );
}

