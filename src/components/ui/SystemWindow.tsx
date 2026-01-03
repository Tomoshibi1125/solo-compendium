import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SystemWindowProps {
  children: ReactNode;
  title?: string;
  className?: string;
  variant?: 'default' | 'alert' | 'quest';
  compact?: boolean;
}

export function SystemWindow({ children, title, className, variant = 'default', compact = false }: SystemWindowProps) {
  const variantStyles = {
    default: 'border-primary/30 from-primary/10 to-primary/5',
    alert: 'border-destructive/30 from-destructive/10 to-destructive/5',
    quest: 'border-accent/30 from-accent/10 to-accent/5',
  };

  return (
    <div
      className={cn(
        "relative bg-gradient-to-br border rounded-lg backdrop-blur-md overflow-hidden",
        variantStyles[variant],
        className
      )}
    >
      {/* Top glow line */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-px",
        variant === 'default' && "bg-gradient-to-r from-transparent via-primary/50 to-transparent",
        variant === 'alert' && "bg-gradient-to-r from-transparent via-destructive/50 to-transparent",
        variant === 'quest' && "bg-gradient-to-r from-transparent via-accent/50 to-transparent"
      )} />
      
      {/* Content */}
      {title && (
        <div className={cn(
          "px-4 py-2 border-b font-display text-sm tracking-wider",
          variant === 'default' && "border-primary/20 text-primary",
          variant === 'alert' && "border-destructive/20 text-destructive",
          variant === 'quest' && "border-accent/20 text-accent"
        )}>
          {title}
        </div>
      )}
      <div className={compact ? "p-3" : "p-4"}>
        {children}
      </div>
      
      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-primary/30 rounded-tl" />
      <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-primary/30 rounded-tr" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-primary/30 rounded-bl" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-primary/30 rounded-br" />
    </div>
  );
}
