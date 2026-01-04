import { cn } from '@/lib/utils';

interface ShadowMonarchLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ShadowMonarchLogo({ className, size = 'md' }: ShadowMonarchLogoProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  return (
    <div className={cn('relative', sizeClasses[size], className)}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer glow ring */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="url(#monarchGradient)"
          strokeWidth="2"
          opacity="0.6"
          className="animate-spin-slow"
        />
        
        {/* Shadow energy core */}
        <circle
          cx="50"
          cy="50"
          r="20"
          fill="url(#shadowCore)"
          className="animate-pulse"
        />
        
        {/* Monarch seal pattern */}
        <path
          d="M 50 20 L 60 40 L 80 40 L 65 55 L 70 75 L 50 65 L 30 75 L 35 55 L 20 40 L 40 40 Z"
          fill="url(#monarchGradient)"
          opacity="0.8"
          className="animate-pulse-3s"
        />
        
        {/* Inner shadow energy */}
        <circle
          cx="50"
          cy="50"
          r="8"
          fill="#60a5fa"
          className="animate-pulse-1-5s"
        />
        
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="monarchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="50%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#f472b6" />
          </linearGradient>
          <radialGradient id="shadowCore" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.4" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}

