import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCampaignCombatSession } from '@/hooks/useCampaignCombat';
import { useCampaignCombatRealtime } from '@/hooks/useCampaignCombatRealtime';

const CampaignSessionPlay = () => {
  const { campaignId, sessionId } = useParams<{ campaignId: string; sessionId: string }>();

  const resolvedCampaignId = campaignId ?? '';
  const resolvedSessionId = sessionId ?? '';

  useCampaignCombatRealtime(resolvedCampaignId || null, resolvedSessionId || null);

  const { data, isLoading, error } = useCampaignCombatSession(resolvedCampaignId, resolvedSessionId);
  const session = data?.session ?? null;
  const combatants = data?.combatants ?? [];

  const sorted = useMemo(() => {
    return [...combatants].sort((a, b) => (b.initiative ?? 0) - (a.initiative ?? 0));
  }, [combatants]);

  const currentTurnIndex = session?.current_turn ?? 0;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-5xl space-y-6" data-testid="campaign-session-play">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="font-arise text-3xl font-bold gradient-text-shadow">SESSION PLAY</h1>
            <p className="text-sm text-muted-foreground">
              Live session view: initiative, round, and Virtual Tabletop.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to={`/campaigns/${resolvedCampaignId}`}>Back to Campaign</Link>
            </Button>
            <Button className="btn-umbral" asChild>
              <Link to={`/campaigns/${resolvedCampaignId}/vtt?sessionId=${encodeURIComponent(resolvedSessionId)}`}>
                Open VTT
              </Link>
            </Button>
          </div>
        </div>

        <SystemWindow title="LIVE COMBAT SESSION">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading session...</p>
          ) : error ? (
            <p className="text-sm text-destructive">Failed to load session.</p>
          ) : !session ? (
            <p className="text-sm text-muted-foreground">No active session found.</p>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="outline">Round {session.round ?? 1}</Badge>
                <Badge variant="outline">Turn {currentTurnIndex + 1}</Badge>
                <Badge variant={session.status === 'active' ? 'default' : 'outline'}>
                  {String(session.status ?? 'unknown').toUpperCase()}
                </Badge>
              </div>

              <div className="space-y-2" data-testid="session-initiative-list">
                {sorted.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No combatants yet.</p>
                ) : (
                  sorted.map((c, idx) => {
                    const isActive = idx === currentTurnIndex;
                    return (
                      <div
                        key={c.id}
                        className={
                          `flex items-center justify-between rounded border px-3 py-2 ` +
                          (isActive ? 'border-primary bg-primary/10' : 'border-border bg-muted/20')
                        }
                        data-testid={isActive ? 'initiative-active-combatant' : undefined}
                      >
                        <div className="min-w-0">
                          <div className="font-heading font-semibold truncate">{c.name}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            HP {(c.stats as any)?.hp ?? '-'} / {(c.stats as any)?.max_hp ?? '-'}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">Init {c.initiative ?? 0}</Badge>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  This view updates live while the DM advances turns in Initiative Tracker.
                </p>
              </div>
            </div>
          )}
        </SystemWindow>
      </div>
    </Layout>
  );
};

export default CampaignSessionPlay;
