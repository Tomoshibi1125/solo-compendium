import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SystemWindowProps {
  children: ReactNode;
  title?: string;
  actions?: ReactNode;
  className?: string;
  contentClassName?: string;
  variant?: 'default' | 'alert' | 'quest' | 'monarch' | 'regent' | 'arise' | 'gate-e' | 'gate-d' | 'gate-c' | 'gate-b' | 'gate-a' | 'gate-s' | 'gate-ss' | 'gate-national';
  compact?: boolean;
  animated?: boolean;
  id?: string;
}

export function SystemWindow({
  children,
  title,
  actions,
  className,
  contentClassName,
  variant = 'default',
  compact = false,
  animated = false,
  id,
}: SystemWindowProps) {
  const variantStyles = {
    default: 'border-primary/30 from-primary/8 via-card to-void-black/80',
    alert: 'border-destructive/30 from-destructive/8 via-card to-void-black/80',
    quest: 'border-accent/30 from-accent/8 via-card to-void-black/80',
    monarch: 'border-shadow-purple/40 from-shadow-purple/10 via-card to-void-black/80',
    arise: 'border-arise-violet/40 from-arise-violet/10 via-shadow-purple/5 to-void-black/80',
    'gate-e': 'border-gate-e/40 from-gate-e/10 via-card to-void-black/80',
    'gate-d': 'border-gate-d/40 from-gate-d/10 via-card to-void-black/80',
    'gate-c': 'border-gate-c/40 from-gate-c/10 via-card to-void-black/80',
    'gate-b': 'border-gate-b/40 from-gate-b/10 via-card to-void-black/80',
    'gate-a': 'border-gate-a/40 from-gate-a/10 via-card to-void-black/80',
    'gate-s': 'border-gate-s/40 from-gate-s/10 via-card to-void-black/80',
    'gate-ss': 'border-gate-ss/40 from-gate-ss/10 via-card to-void-black/80',
    'gate-national': 'border-gate-national/40 from-gate-national/10 via-card to-void-black/80',
    regent: 'border-shadow-purple/40 from-shadow-purple/10 via-card to-void-black/80',
  };

  const glowColors = {
    default: 'hsl(var(--primary))',
    alert: 'hsl(var(--destructive))',
    quest: 'hsl(var(--accent))',
    monarch: 'hsl(var(--shadow-purple))',
    arise: 'hsl(var(--arise-violet))',
    'gate-e': 'hsl(var(--gate-e-glow))',
    'gate-d': 'hsl(var(--gate-d-glow))',
    'gate-c': 'hsl(var(--gate-c-glow))',
    'gate-b': 'hsl(var(--gate-b-glow))',
    'gate-a': 'hsl(var(--gate-a-glow))',
    'gate-s': 'hsl(var(--gate-s-glow))',
    'gate-ss': 'hsl(var(--gate-ss-glow))',
    'gate-national': 'hsl(var(--gate-national-glow))',
    regent: 'hsl(var(--shadow-purple))',
  };

  // Map variant → raw HSL CSS variable name (without hsl() wrapper)
  const glowVarMap = {
    default: '--primary',
    alert: '--destructive',
    quest: '--accent',
    monarch: '--shadow-purple',
    arise: '--arise-violet',
    'gate-e': '--gate-e-glow',
    'gate-d': '--gate-d-glow',
    'gate-c': '--gate-c-glow',
    'gate-b': '--gate-b-glow',
    'gate-a': '--gate-a-glow',
    'gate-s': '--gate-s-glow',
    'gate-ss': '--gate-ss-glow',
    'gate-national': '--gate-national-glow',
    regent: '--shadow-purple',
  } as const;

  const glowVar = glowVarMap[variant];

  return (
    <div
      id={id}
      className={cn(
        "relative bg-gradient-to-br border rounded-lg backdrop-blur-xl overflow-hidden transition-all duration-300 w-full max-w-full",
        "system-panel hologram-flicker sw-root",
        variantStyles[variant],
        animated && "animate-shadow-pulse",
        id && "scroll-mt-4",
        className
      )}
      // Single CSS custom property drives all child glow effects via external CSS
      {...{ style: { '--sw-glow': `var(${glowVar})` } as React.CSSProperties }}
    >
      {/* Hex grid texture overlay */}
      <div className="absolute inset-0 pointer-events-none hex-grid-overlay opacity-30" />

      {/* Holographic scan line effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden sw-scan-line" />

      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px sw-glow-top" />

      {/* Bottom glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-px sw-glow-bottom" />

      {/* Title header — isekai System style */}
      {title && (
        <div className={cn(
          "px-4 py-2 border-b flex items-center gap-2 sw-title-bar",
          "font-system text-xs tracking-[0.2em] uppercase"
        )}>
          {/* Hexagonal status indicator */}
          <span className="w-2 h-2 rotate-45 animate-pulse flex-shrink-0 sw-status-dot" />
          <span className="truncate sw-title-text">
            {title}
          </span>
          {actions && (
            <div className="ml-auto flex items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      )}
      <div className={cn(compact ? "p-3" : "p-4", "relative z-[1]", contentClassName)}>
        {children}
      </div>

      {/* Corner brackets — isekai HUD style */}
      <CornerDecoration position="top-left" variant={variant} />
      <CornerDecoration position="top-right" variant={variant} />
      <CornerDecoration position="bottom-left" variant={variant} />
      <CornerDecoration position="bottom-right" variant={variant} />
    </div>
  );
}

interface CornerDecorationProps {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  variant: 'default' | 'alert' | 'quest' | 'monarch' | 'regent' | 'arise' | 'gate-e' | 'gate-d' | 'gate-c' | 'gate-b' | 'gate-a' | 'gate-s' | 'gate-ss' | 'gate-national';
}

function CornerDecoration({ position, variant }: CornerDecorationProps) {
  const positionClasses = {
    'top-left': 'top-0 left-0 border-l-2 border-t-2 rounded-tl',
    'top-right': 'top-0 right-0 border-r-2 border-t-2 rounded-tr',
    'bottom-left': 'bottom-0 left-0 border-l-2 border-b-2 rounded-bl',
    'bottom-right': 'bottom-0 right-0 border-r-2 border-b-2 rounded-br',
  };

  const variantClasses = {
    default: 'border-primary/40 shadow-[0_0_6px_hsl(var(--primary)/0.5)]',
    alert: 'border-destructive/40 shadow-[0_0_6px_hsl(var(--destructive)/0.5)]',
    quest: 'border-accent/40 shadow-[0_0_6px_hsl(var(--accent)/0.5)]',
    monarch: 'border-shadow-purple/40 shadow-[0_0_6px_hsl(var(--shadow-purple)/0.5)]',
    arise: 'border-arise-violet/50 shadow-[0_0_8px_hsl(var(--arise-violet)/0.6)]',
    'gate-e': 'border-gate-e/40 shadow-[0_0_6px_hsl(var(--gate-e-glow)/0.5)]',
    'gate-d': 'border-gate-d/40 shadow-[0_0_6px_hsl(var(--gate-d-glow)/0.5)]',
    'gate-c': 'border-gate-c/40 shadow-[0_0_6px_hsl(var(--gate-c-glow)/0.5)]',
    'gate-b': 'border-gate-b/40 shadow-[0_0_6px_hsl(var(--gate-b-glow)/0.5)]',
    'gate-a': 'border-gate-a/40 shadow-[0_0_6px_hsl(var(--gate-a-glow)/0.5)]',
    'gate-s': 'border-gate-s/40 shadow-[0_0_6px_hsl(var(--gate-s-glow)/0.5)]',
    'gate-ss': 'border-gate-ss/40 shadow-[0_0_6px_hsl(var(--gate-ss-glow)/0.5)]',
    'gate-national': 'border-gate-national/40 shadow-[0_0_6px_hsl(var(--gate-national-glow)/0.5)]',
    regent: 'border-shadow-purple/40 shadow-[0_0_6px_hsl(var(--shadow-purple)/0.5)]',
  };

  return (
    <div className={cn(
      "absolute w-4 h-4",
      positionClasses[position],
      variantClasses[variant]
    )} />
  );
}
