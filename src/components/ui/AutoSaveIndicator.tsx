import { useState, useEffect } from 'react';
import { Check, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AutoSaveIndicatorProps {
  isSaving?: boolean;
  lastSaved?: Date | null;
  error?: string | null;
  className?: string;
}

export function AutoSaveIndicator({
  isSaving = false,
  lastSaved = null,
  error = null,
  className,
}: AutoSaveIndicatorProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isSaving || error) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 3000);
      return () => clearTimeout(timer);
    } else if (lastSaved) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isSaving, lastSaved, error]);

  if (!show) return null;

  return (
    <div
      className={cn(
        "fixed bottom-4 left-4 z-50 flex items-center gap-2 px-3 py-2 rounded-lg border bg-background shadow-lg transition-all",
        error ? "border-destructive" : "border-primary/30",
        className
      )}
    >
      {isSaving ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          <span className="text-sm">Saving...</span>
        </>
      ) : error ? (
        <>
          <AlertCircle className="w-4 h-4 text-destructive" />
          <span className="text-sm text-destructive">Save failed</span>
        </>
      ) : (
        <>
          <Check className="w-4 h-4 text-green-500" />
          <span className="text-sm text-muted-foreground">
            Saved {lastSaved ? formatTime(lastSaved) : 'just now'}
          </span>
        </>
      )}
    </div>
  );
}

function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);

  if (seconds < 10) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  
  return date.toLocaleDateString();
}

