import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatBlockProps {
  label: string;
  value: string | number;
  modifier?: string | number;
  icon?: LucideIcon;
  variant?: 'default' | 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StatBlock({
  label,
  value,
  modifier,
  icon: Icon,
  variant = 'default',
  size = 'md',
  className,
}: StatBlockProps) {
  const variantStyles = {
    default: 'border-border',
    primary: 'border-primary/30 bg-primary/5',
    secondary: 'border-secondary/30 bg-secondary/5',
    accent: 'border-accent/30 bg-accent/5',
  };

  const sizeStyles = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4',
  };

  const valueSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div
      className={cn(
        "glass-card border flex flex-col items-center text-center",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {Icon && (
        <Icon className={cn(
          "mb-1 text-muted-foreground",
          size === 'sm' && 'w-3 h-3',
          size === 'md' && 'w-4 h-4',
          size === 'lg' && 'w-5 h-5',
        )} />
      )}
      <span className="stat-label">{label}</span>
      <span className={cn("font-display font-bold", valueSizes[size])}>
        {value}
      </span>
      {modifier !== undefined && (
        <span className={cn(
          "text-sm font-heading",
          Number(modifier) >= 0 ? 'text-success' : 'text-destructive'
        )}>
          {Number(modifier) >= 0 ? '+' : ''}{modifier}
        </span>
      )}
    </div>
  );
}
