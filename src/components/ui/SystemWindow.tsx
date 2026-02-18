import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SystemWindowProps {
  children: ReactNode;
  title?: string;
  actions?: ReactNode;
  className?: string;
  contentClassName?: string;
  variant?: 'default' | 'alert' | 'quest' | 'monarch' | 'arise' | 'gate-e' | 'gate-d' | 'gate-c' | 'gate-b' | 'gate-a' | 'gate-s' | 'gate-ss' | 'gate-national';
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
  };

  return (
    <div
      id={id}
      className={cn(
        "relative bg-gradient-to-br border rounded-lg backdrop-blur-xl overflow-hidden transition-all duration-300 w-full max-w-full",
        variantStyles[variant],
        animated && "animate-shadow-pulse",
        id && "scroll-mt-4",
        className
      )}
    >
      {/* System scan line effect */}
      {animated && (
        <div 
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{
            background: `linear-gradient(180deg, transparent 0%, ${glowColors[variant]}10 50%, transparent 100%)`,
            animation: 'system-scan-line 3s ease-in-out infinite',
          }}
        />
      )}

      {/* Top glow line - Enhanced */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-px",
        variant === 'default' && "bg-gradient-to-r from-transparent via-primary/60 to-transparent shadow-[0_0_8px_hsl(var(--primary)/0.4)]",
        variant === 'alert' && "bg-gradient-to-r from-transparent via-destructive/60 to-transparent shadow-[0_0_8px_hsl(var(--destructive)/0.4)]",
        variant === 'quest' && "bg-gradient-to-r from-transparent via-accent/60 to-transparent shadow-[0_0_8px_hsl(var(--accent)/0.4)]",
        variant === 'monarch' && "bg-gradient-to-r from-transparent via-shadow-purple/60 to-transparent shadow-[0_0_8px_hsl(var(--shadow-purple)/0.4)]",
        variant === 'arise' && "bg-gradient-to-r from-shadow-blue/40 via-arise-violet/70 to-shadow-purple/40 shadow-[0_0_12px_hsl(var(--arise-violet)/0.5)]",
        variant === 'gate-e' && "bg-gradient-to-r from-transparent via-gate-e/60 to-transparent shadow-[0_0_8px_hsl(var(--gate-e-glow)/0.4)]",
        variant === 'gate-d' && "bg-gradient-to-r from-transparent via-gate-d/60 to-transparent shadow-[0_0_8px_hsl(var(--gate-d-glow)/0.4)]",
        variant === 'gate-c' && "bg-gradient-to-r from-transparent via-gate-c/60 to-transparent shadow-[0_0_8px_hsl(var(--gate-c-glow)/0.4)]",
        variant === 'gate-b' && "bg-gradient-to-r from-transparent via-gate-b/60 to-transparent shadow-[0_0_8px_hsl(var(--gate-b-glow)/0.4)]",
        variant === 'gate-a' && "bg-gradient-to-r from-transparent via-gate-a/60 to-transparent shadow-[0_0_8px_hsl(var(--gate-a-glow)/0.4)]",
        variant === 'gate-s' && "bg-gradient-to-r from-transparent via-gate-s/60 to-transparent shadow-[0_0_8px_hsl(var(--gate-s-glow)/0.4)]",
        variant === 'gate-ss' && "bg-gradient-to-r from-transparent via-gate-ss/60 to-transparent shadow-[0_0_8px_hsl(var(--gate-ss-glow)/0.4)]",
        variant === 'gate-national' && "bg-gradient-to-r from-transparent via-gate-national/60 to-transparent shadow-[0_0_8px_hsl(var(--gate-national-glow)/0.4)]"
      )} />
      
      {/* Title header */}
      {title && (
        <div className={cn(
          "px-4 py-2.5 border-b font-display text-sm tracking-widest flex items-center gap-2",
          variant === 'default' && "border-primary/20 text-primary",
          variant === 'alert' && "border-destructive/20 text-destructive",
          variant === 'quest' && "border-accent/20 text-accent",
          variant === 'monarch' && "border-shadow-purple/20 text-shadow-purple",
          variant === 'arise' && "border-arise-violet/20 gradient-text-arise",
          variant === 'gate-e' && "border-gate-e/20 text-gate-e",
          variant === 'gate-d' && "border-gate-d/20 text-gate-d",
          variant === 'gate-c' && "border-gate-c/20 text-gate-c",
          variant === 'gate-b' && "border-gate-b/20 text-gate-b",
          variant === 'gate-a' && "border-gate-a/20 text-gate-a",
          variant === 'gate-s' && "border-gate-s/20 text-gate-s",
          variant === 'gate-ss' && "border-gate-ss/20 text-gate-ss",
          variant === 'gate-national' && "border-gate-national/20 text-gate-national"
        )}>
          {/* System indicator */}
          <span className={cn(
            "w-1.5 h-1.5 rounded-full animate-pulse",
            variant === 'default' && "bg-primary shadow-[0_0_6px_hsl(var(--primary))]",
            variant === 'alert' && "bg-destructive shadow-[0_0_6px_hsl(var(--destructive))]",
            variant === 'quest' && "bg-accent shadow-[0_0_6px_hsl(var(--accent))]",
            variant === 'monarch' && "bg-shadow-purple shadow-[0_0_6px_hsl(var(--shadow-purple))]",
            variant === 'arise' && "bg-arise-violet shadow-[0_0_6px_hsl(var(--arise-violet))]",
            variant === 'gate-e' && "bg-gate-e shadow-[0_0_6px_hsl(var(--gate-e-glow))]",
            variant === 'gate-d' && "bg-gate-d shadow-[0_0_6px_hsl(var(--gate-d-glow))]",
            variant === 'gate-c' && "bg-gate-c shadow-[0_0_6px_hsl(var(--gate-c-glow))]",
            variant === 'gate-b' && "bg-gate-b shadow-[0_0_6px_hsl(var(--gate-b-glow))]",
            variant === 'gate-a' && "bg-gate-a shadow-[0_0_6px_hsl(var(--gate-a-glow))]",
            variant === 'gate-s' && "bg-gate-s shadow-[0_0_6px_hsl(var(--gate-s-glow))]",
            variant === 'gate-ss' && "bg-gate-ss shadow-[0_0_6px_hsl(var(--gate-ss-glow))]",
            variant === 'gate-national' && "bg-gate-national shadow-[0_0_6px_hsl(var(--gate-national-glow))]"
          )} />
          <span className="truncate">{title}</span>
          {actions && (
            <div className="ml-auto flex items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      )}
      <div className={cn(compact ? "p-3" : "p-4", contentClassName)}>
        {children}
      </div>
      
      {/* Corner decorations with enhanced glow */}
      <CornerDecoration position="top-left" variant={variant} />
      <CornerDecoration position="top-right" variant={variant} />
      <CornerDecoration position="bottom-left" variant={variant} />
      <CornerDecoration position="bottom-right" variant={variant} />
      
      {/* Bottom glow line for arise variant */}
      {variant === 'arise' && (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-shadow-purple/40 via-arise-violet/50 to-shadow-blue/40 shadow-[0_0_8px_hsl(var(--arise-violet)/0.3)]" />
      )}
    </div>
  );
}

interface CornerDecorationProps {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  variant: 'default' | 'alert' | 'quest' | 'monarch' | 'arise' | 'gate-e' | 'gate-d' | 'gate-c' | 'gate-b' | 'gate-a' | 'gate-s' | 'gate-ss' | 'gate-national';
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
  };

  return (
    <div className={cn(
      "absolute w-4 h-4",
      positionClasses[position],
      variantClasses[variant]
    )} />
  );
}
