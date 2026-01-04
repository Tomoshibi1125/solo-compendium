import { cn } from '@/lib/utils';

interface SystemInterfaceProps {
  className?: string;
  variant?: 'default' | 'glow' | 'scan';
}

export function SystemInterface({ className, variant = 'default' }: SystemInterfaceProps) {
  return (
    <div className={cn('relative', className)}>
      <svg
        viewBox="0 0 300 200"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background grid */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="#60a5fa"
              strokeWidth="0.5"
              opacity="0.2"
            />
          </pattern>
          <linearGradient id="systemGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        
        <rect width="300" height="200" fill="url(#grid)" />
        
        {/* System lines */}
        <line
          x1="0"
          y1="100"
          x2="300"
          y2="100"
          stroke="url(#systemGradient)"
          strokeWidth="2"
          className={variant === 'scan' ? 'animate-pulse' : ''}
        />
        <line
          x1="150"
          y1="0"
          x2="150"
          y2="200"
          stroke="url(#systemGradient)"
          strokeWidth="2"
          className={variant === 'scan' ? 'animate-pulse' : ''}
        />
        
        {/* Corner brackets */}
        <path
          d="M 20 20 L 20 40 L 40 40"
          fill="none"
          stroke="#60a5fa"
          strokeWidth="2"
          className={variant === 'glow' ? 'animate-pulse' : ''}
        />
        <path
          d="M 280 20 L 280 40 L 260 40"
          fill="none"
          stroke="#60a5fa"
          strokeWidth="2"
          className={variant === 'glow' ? 'animate-pulse' : ''}
        />
        <path
          d="M 20 180 L 20 160 L 40 160"
          fill="none"
          stroke="#60a5fa"
          strokeWidth="2"
          className={variant === 'glow' ? 'animate-pulse' : ''}
        />
        <path
          d="M 280 180 L 280 160 L 260 160"
          fill="none"
          stroke="#60a5fa"
          strokeWidth="2"
          className={variant === 'glow' ? 'animate-pulse' : ''}
        />
        
        {/* System text */}
        <text
          x="150"
          y="110"
          textAnchor="middle"
          fontSize="24"
          fontWeight="bold"
          fill="url(#systemGradient)"
          className="font-display"
          opacity="0.9"
        >
          SYSTEM
        </text>
      </svg>
    </div>
  );
}

