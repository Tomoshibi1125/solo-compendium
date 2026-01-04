import { cn } from '@/lib/utils';

interface HunterBadgeProps {
  className?: string;
  rank?: 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
  size?: 'sm' | 'md' | 'lg';
}

const rankColors = {
  E: '#9ca3af',
  D: '#60a5fa',
  C: '#34d399',
  B: '#a78bfa',
  A: '#f472b6',
  S: '#fbbf24',
};

export function HunterBadge({ className, rank = 'C', size = 'md' }: HunterBadgeProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  const color = rankColors[rank];

  return (
    <div className={cn('relative', sizeClasses[size], className)}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Badge background */}
        <path
          d="M 50 10 L 85 25 L 85 65 L 50 90 L 15 65 L 15 25 Z"
          fill={color}
          opacity="0.2"
          stroke={color}
          strokeWidth="2"
        />
        
        {/* Inner hexagon */}
        <path
          d="M 50 20 L 75 30 L 75 60 L 50 75 L 25 60 L 25 30 Z"
          fill="none"
          stroke={color}
          strokeWidth="2"
          opacity="0.6"
        />
        
        {/* Rank letter */}
        <text
          x="50"
          y="55"
          textAnchor="middle"
          fontSize="32"
          fontWeight="bold"
          fill={color}
          className="font-display"
        >
          {rank}
        </text>
        
        {/* Glow effect */}
        <circle
          cx="50"
          cy="50"
          r="35"
          fill="none"
          stroke={color}
          strokeWidth="1"
          opacity="0.3"
          className="animate-pulse"
        />
      </svg>
    </div>
  );
}

