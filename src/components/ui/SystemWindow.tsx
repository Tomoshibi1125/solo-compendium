import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SystemWindowProps {
  children: ReactNode;
  title?: string;
  className?: string;
  variant?: 'default' | 'alert' | 'quest' | 'monarch' | 'arise';
  compact?: boolean;
  animated?: boolean;
}

export function SystemWindow({ children, title, className, variant = 'default', compact = false, animated = false }: SystemWindowProps) {
  const variantStyles = {
    default: 'border-primary/30 from-primary/8 via-card to-void-black/80',
    alert: 'border-destructive/30 from-destructive/8 via-card to-void-black/80',
    quest: 'border-accent/30 from-accent/8 via-card to-void-black/80',
    monarch: 'border-shadow-purple/40 from-shadow-purple/10 via-card to-void-black/80',
    arise: 'border-arise-violet/40 from-arise-violet/10 via-shadow-purple/5 to-void-black/80',
  };

  const glowColors = {
    default: 'hsl(var(--primary))',
    alert: 'hsl(var(--destructive))',
    quest: 'hsl(var(--accent))',
    monarch: 'hsl(var(--shadow-purple))',
    arise: 'hsl(var(--arise-violet))',
  };

  return (
    <div
      className={cn(
        "relative bg-gradient-to-br border rounded-lg backdrop-blur-xl overflow-hidden transition-all duration-300",
        variantStyles[variant],
        animated && "animate-shadow-pulse",
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
        variant === 'arise' && "bg-gradient-to-r from-shadow-blue/40 via-arise-violet/70 to-shadow-purple/40 shadow-[0_0_12px_hsl(var(--arise-violet)/0.5)]"
      )} />
      
      {/* Title header */}
      {title && (
        <div className={cn(
          "px-4 py-2.5 border-b font-display text-sm tracking-widest flex items-center gap-2",
          variant === 'default' && "border-primary/20 text-primary",
          variant === 'alert' && "border-destructive/20 text-destructive",
          variant === 'quest' && "border-accent/20 text-accent",
          variant === 'monarch' && "border-shadow-purple/20 text-shadow-purple",
          variant === 'arise' && "border-arise-violet/20 gradient-text-arise"
        )}>
          {/* System indicator */}
          <span className={cn(
            "w-1.5 h-1.5 rounded-full animate-pulse",
            variant === 'default' && "bg-primary shadow-[0_0_6px_hsl(var(--primary))]",
            variant === 'alert' && "bg-destructive shadow-[0_0_6px_hsl(var(--destructive))]",
            variant === 'quest' && "bg-accent shadow-[0_0_6px_hsl(var(--accent))]",
            variant === 'monarch' && "bg-shadow-purple shadow-[0_0_6px_hsl(var(--shadow-purple))]",
            variant === 'arise' && "bg-arise-violet shadow-[0_0_6px_hsl(var(--arise-violet))]"
          )} />
          {title}
        </div>
      )}
      <div className={compact ? "p-3" : "p-4"}>
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
  variant: 'default' | 'alert' | 'quest' | 'monarch' | 'arise';
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
  };

  return (
    <div className={cn(
      "absolute w-4 h-4",
      positionClasses[position],
      variantClasses[variant]
    )} />
  );
}
