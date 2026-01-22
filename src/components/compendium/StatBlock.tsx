import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface StatBlockProps {
  title?: string;
  children: ReactNode;
  className?: string;
  copyable?: boolean;
  copyContent?: string;
  id?: string;
}

export function StatBlock({ 
  title, 
  children, 
  className,
  copyable = false,
  copyContent,
  id
}: StatBlockProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    if (!copyContent) return;
    
    try {
      await navigator.clipboard.writeText(copyContent);
      setCopied(true);
      toast({
        title: 'Copied to clipboard',
        description: 'Stat block copied successfully.',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: 'Copy failed',
        description: 'Could not copy to clipboard.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div 
      id={id}
      className={cn(
        "glass-card border border-border/50 rounded-lg p-4 print:border-2 print:border-gray-800 scroll-mt-4",
        className
      )}
    >
      {title && (
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-border/50">
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">
            {title}
          </h3>
          {copyable && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 print:hidden"
              onClick={handleCopy}
              aria-label="Copy stat block"
            >
              {copied ? (
                <Check className="w-3 h-3 text-green-500" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </Button>
          )}
        </div>
      )}
      <div className="space-y-2 text-sm print:text-xs">
        {children}
      </div>
    </div>
  );
}

interface StatRowProps {
  label: string;
  value: string | number | ReactNode;
  className?: string;
}

export function StatRow({ label, value, className }: StatRowProps) {
  return (
    <div className={cn("flex justify-between items-start gap-4 py-1", className)}>
      <span className="font-heading font-semibold text-muted-foreground uppercase text-xs tracking-wide flex-shrink-0">
        {label}:
      </span>
      <span className="text-foreground text-right font-medium">
        {value}
      </span>
    </div>
  );
}

interface StatSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function StatSection({ title, children, className }: StatSectionProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <h4 className="font-display text-xs font-bold uppercase tracking-wider text-primary border-b border-border/30 pb-1">
        {title}
      </h4>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
}

