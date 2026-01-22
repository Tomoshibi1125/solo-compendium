import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  BookOpen, 
  Users, 
  Dice1, 
  Crown, 
  Search,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { GLOBAL_SHORTCUTS, formatShortcut } from '@/lib/globalShortcuts';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  onClick?: () => void;
  shortcut?: string;
  badge?: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'new-character',
    label: 'New Character',
    icon: Plus,
    href: '/characters/new',
    shortcut: 'Ctrl+Shift+N',
  },
  {
    id: 'compendium',
    label: 'Compendium',
    icon: BookOpen,
    href: '/compendium',
    shortcut: 'Ctrl+C',
  },
  {
    id: 'characters',
    label: 'Characters',
    icon: Users,
    href: '/characters',
    shortcut: 'Ctrl+P',
  },
  {
    id: 'dice',
    label: 'Dice Roller',
    icon: Dice1,
    href: '/dice',
    shortcut: 'Ctrl+D',
  },
  {
    id: 'dm-tools',
    label: 'Warden Tools',
    icon: Crown,
    href: '/dm-tools',
    shortcut: 'Ctrl+M',
  },
  {
    id: 'search',
    label: 'Search',
    icon: Search,
    onClick: () => {
      const searchInput = document.querySelector('input[type="search"], input[placeholder*="Search"]') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    },
    shortcut: 'Ctrl+K',
  },
];

interface QuickActionsPanelProps {
  className?: string;
  variant?: 'floating' | 'inline';
}

export function QuickActionsPanel({ className, variant = 'floating' }: QuickActionsPanelProps) {
  const navigate = useNavigate();
  const [showShortcuts, setShowShortcuts] = useState(false);

  const handleAction = (action: QuickAction) => {
    if (action.onClick) {
      action.onClick();
    } else if (action.href) {
      navigate(action.href);
    }
  };

  if (variant === 'floating') {
    return (
      <>
        <div className={cn("fixed bottom-4 right-4 z-50", className)}>
          <div className="flex flex-col gap-2 items-end">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.id}
                  size="lg"
                  className="rounded-full w-14 h-14 shadow-lg hover:scale-110 transition-transform"
                  onClick={() => handleAction(action)}
                  title={action.label}
                  aria-label={action.label}
                >
                  <Icon className="w-6 h-6" />
                </Button>
              );
            })}
            <Button
              size="lg"
              variant="outline"
              className="rounded-full w-14 h-14 shadow-lg hover:scale-110 transition-transform"
              onClick={() => setShowShortcuts(true)}
              title="Keyboard Shortcuts"
              aria-label="Show keyboard shortcuts"
            >
              <HelpCircle className="w-6 h-6" />
            </Button>
          </div>
        </div>

        <Dialog open={showShortcuts} onOpenChange={setShowShortcuts}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Keyboard Shortcuts</DialogTitle>
              <DialogDescription>
                Quick actions available throughout the application
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {['navigation', 'character', 'compendium', 'tools', 'general'].map((category) => {
                const shortcuts = GLOBAL_SHORTCUTS.filter(s => s.category === category);
                if (shortcuts.length === 0) return null;
                
                return (
                  <div key={category}>
                    <h3 className="font-heading text-sm text-muted-foreground mb-2 uppercase">
                      {category}
                    </h3>
                    <div className="space-y-2">
                      {shortcuts.map((shortcut) => (
                        <div
                          key={`${shortcut.key}-${shortcut.ctrl}-${shortcut.shift}`}
                          className="flex items-center justify-between p-2 rounded hover:bg-muted/50"
                        >
                          <span className="text-sm">{shortcut.description}</span>
                          <Badge variant="outline" className="font-mono text-xs">
                            {formatShortcut(shortcut)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <SystemWindow title="QUICK ACTIONS" className={className}>
      <div className="grid grid-cols-2 gap-2">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.id}
              variant="outline"
              className="justify-start gap-2 h-auto py-3"
              onClick={() => handleAction(action)}
            >
              <Icon className="w-4 h-4" />
              <div className="flex-1 text-left">
                <div className="font-heading text-sm">{action.label}</div>
                {action.shortcut && (
                  <div className="text-xs text-muted-foreground font-mono">
                    {action.shortcut}
                  </div>
                )}
              </div>
            </Button>
          );
        })}
      </div>
    </SystemWindow>
  );
}


