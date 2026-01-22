import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { cn } from '@/lib/utils';

interface QuickFilter {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
  active?: boolean;
  onClick: () => void;
}

interface QuickFiltersProps {
  filters: QuickFilter[];
  className?: string;
}

export function QuickFilters({ filters, className }: QuickFiltersProps) {
  if (filters.length === 0) return null;

  return (
    <SystemWindow title="QUICK FILTERS" className={cn("p-4", className)}>
      <div className="space-y-2">
        {filters.map((filter) => {
          const Icon = filter.icon;
          return (
            <Button
              key={filter.id}
              variant={filter.active ? 'default' : 'outline'}
              size="sm"
              className="w-full justify-start gap-2"
              onClick={filter.onClick}
            >
              <Icon className="w-4 h-4" />
              {filter.label}
              {filter.count !== undefined && filter.count > 0 && (
                <Badge variant="secondary" className="ml-auto">
                  {filter.count}
                </Badge>
              )}
            </Button>
          );
        })}
      </div>
    </SystemWindow>
  );
}

