import { Crown, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoleBadgeProps {
  role: 'system' | 'co-system' | 'hunter' | null;
  variant?: 'default' | 'compact' | 'inline';
  className?: string;
}

export function RoleBadge({ role, variant = 'default', className }: RoleBadgeProps) {
  if (!role) return null;

  const variants = {
    default: {
      system: "px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30 gap-2",
      'co-system': "px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/30 gap-2",
      hunter: "px-3 py-1.5 rounded-lg bg-muted border border-border gap-2",
    },
    compact: {
      system: "px-2 py-0.5 rounded-md bg-primary/10 border border-primary/30 gap-1.5",
      'co-system': "px-2 py-0.5 rounded-md bg-accent/10 border border-accent/30 gap-1.5",
      hunter: "px-2 py-0.5 rounded-md bg-muted border border-border gap-1.5",
    },
    inline: {
      system: "px-2 py-0.5 rounded text-xs bg-primary/10 border border-primary/20 gap-1",
      'co-system': "px-2 py-0.5 rounded text-xs bg-accent/10 border border-accent/20 gap-1",
      hunter: "px-2 py-0.5 rounded text-xs bg-muted/50 border border-border/50 gap-1",
    },
  };

  const textSizes = {
    default: "text-xs font-display font-semibold",
    compact: "text-xs font-display font-semibold",
    inline: "text-[10px] font-display font-medium",
  };

  const iconSizes = {
    default: "w-4 h-4",
    compact: "w-3.5 h-3.5",
    inline: "w-3 h-3",
  };

  const roleConfig = {
    system: {
      icon: Crown,
      text: variant === 'inline' ? 'SYSTEM' : 'PROTOCOL WARDEN (SYSTEM)',
      color: 'text-primary',
    },
    'co-system': {
      icon: Crown,
      text: 'CO-SYSTEM',
      color: 'text-accent',
    },
    hunter: {
      icon: Shield,
      text: 'ASCENDANT',
      color: 'text-muted-foreground',
    },
  };

  const config = roleConfig[role];
  const Icon = config.icon;

  return (
    <div className={cn("flex items-center", variants[variant][role], className)}>
      <Icon className={cn(iconSizes[variant], config.color)} />
      <span className={cn(textSizes[variant], config.color)}>
        {config.text}
      </span>
    </div>
  );
}

