import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DetailLayoutProps {
  main: ReactNode;
  sidebar?: ReactNode;
  className?: string;
}

export function DetailLayout({ main, sidebar, className }: DetailLayoutProps) {
  return (
    <div className={cn("flex flex-col lg:flex-row gap-6", className)}>
      {/* Main Content */}
      <div className={cn(
        "flex-1 min-w-0",
        sidebar && "lg:max-w-[calc(100%-320px)]"
      )}>
        {main}
      </div>
      
      {/* Sidebar */}
      {sidebar && (
        <aside className={cn(
          "lg:w-80 lg:flex-shrink-0",
          "lg:sticky lg:top-4 lg:self-start",
          "print:hidden"
        )}>
          <div className="space-y-4">
            {sidebar}
          </div>
        </aside>
      )}
    </div>
  );
}

