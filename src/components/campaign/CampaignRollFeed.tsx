import { Dice6, Wifi, WifiOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { useCampaignRollFeed } from '@/hooks/useCampaignRollFeed';
import { cn } from '@/lib/utils';

interface CampaignRollFeedProps {
  campaignId: string;
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(dateStr).toLocaleDateString();
}

function rollTypeLabel(rollType: string | null): string {
  switch (rollType) {
    case 'attack': return 'ATK';
    case 'damage': return 'DMG';
    case 'check': return 'CHK';
    case 'save': return 'SAV';
    default: return 'ROLL';
  }
}

function rollTypeColor(rollType: string | null): string {
  switch (rollType) {
    case 'attack': return 'text-red-400';
    case 'damage': return 'text-orange-400';
    case 'check': return 'text-blue-400';
    case 'save': return 'text-green-400';
    default: return 'text-primary';
  }
}

export function CampaignRollFeed({ campaignId }: CampaignRollFeedProps) {
  const { events, isConnected } = useCampaignRollFeed(campaignId);

  return (
    <div data-testid="campaign-roll-feed">
    <SystemWindow
      title="LIVE ROLL FEED"
    >
      <div className="space-y-1">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {isConnected ? (
              <>
                <Wifi className="w-3 h-3 text-green-500" />
                <span>Live</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 text-muted-foreground" />
                <span>Offline</span>
              </>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            {events.length} roll{events.length !== 1 ? 's' : ''}
          </span>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Dice6 className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No rolls yet</p>
            <p className="text-xs mt-1">Player rolls will appear here in real-time</p>
          </div>
        ) : (
          <div className="space-y-1 max-h-[400px] overflow-y-auto">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-2 px-2 py-1.5 rounded bg-muted/20 hover:bg-muted/40 transition-colors text-sm"
                data-testid="roll-feed-entry"
              >
                <Badge
                  variant="outline"
                  className={cn('text-[10px] px-1.5 py-0 font-mono shrink-0', rollTypeColor(event.roll_type))}
                >
                  {rollTypeLabel(event.roll_type)}
                </Badge>

                <span className="font-display text-lg font-bold min-w-[2rem] text-center">
                  {event.result}
                </span>

                <div className="flex-1 min-w-0 truncate">
                  <span className="font-heading text-xs">
                    {event.character_name || 'Unknown'}
                  </span>
                  {event.context && (
                    <span className="text-xs text-muted-foreground ml-1">
                      — {event.context}
                    </span>
                  )}
                </div>

                <span className="text-[10px] text-muted-foreground font-mono shrink-0">
                  {event.dice_formula}
                </span>

                <span className="text-[10px] text-muted-foreground shrink-0">
                  {formatTimeAgo(event.created_at)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </SystemWindow>
    </div>
  );
}
