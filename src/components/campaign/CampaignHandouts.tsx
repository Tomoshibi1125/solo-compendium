import { useEffect, useMemo, useState } from 'react';
import { FileText } from 'lucide-react';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth/authContext';
import type { Database } from '@/integrations/supabase/types';

interface HandoutEntry {
  id: string;
  title: string;
  content: string;
  visibleToPlayers: boolean;
  category: 'session' | 'note' | 'lore' | 'handout';
  createdAt: string;
  updatedAt: string;
}

type VttJournalRow = Database['public']['Tables']['vtt_journal_entries']['Row'];

type RemoteJournalRow = Pick<
  VttJournalRow,
  'id' | 'title' | 'content' | 'category' | 'visible_to_players' | 'created_at' | 'updated_at'
>;

const JOURNAL_CATEGORIES = ['session', 'note', 'lore', 'handout'] as const;
const toJournalCategory = (value: unknown): HandoutEntry['category'] => {
  return (JOURNAL_CATEGORIES as readonly string[]).includes(String(value))
    ? (value as HandoutEntry['category'])
    : 'note';
};

const readLocal = (campaignId: string): HandoutEntry[] => {
  const saved = localStorage.getItem(`vtt-journal-${campaignId}`);
  if (!saved) return [];
  try {
    return JSON.parse(saved) as HandoutEntry[];
  } catch {
    return [];
  }
};

const writeLocal = (campaignId: string, entries: HandoutEntry[]) => {
  localStorage.setItem(`vtt-journal-${campaignId}`, JSON.stringify(entries));
};

export function CampaignHandouts({ campaignId }: { campaignId: string }) {
  const { user, loading } = useAuth();
  const isAuthed = isSupabaseConfigured && !!user?.id;

  const [entries, setEntries] = useState<HandoutEntry[]>([]);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!campaignId) {
      setIsLoading(false);
      return;
    }
    if (loading) return;

    let active = true;

    const loadRemote = async () => {
      const { data, error } = await supabase
        .from('vtt_journal_entries')
        .select('id, title, content, category, visible_to_players, created_at, updated_at')
        .eq('campaign_id', campaignId)
        .order('created_at', { ascending: false });

      if (error) {
        return null;
      }

      return (data || []).map((row: RemoteJournalRow) => ({
        id: row.id,
        title: row.title,
        content: row.content ?? '',
        category: toJournalCategory(row.category),
        visibleToPlayers: !!row.visible_to_players,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      })) as HandoutEntry[];
    };

    const hydrate = async () => {
      setIsLoading(true);
      const localEntries = readLocal(campaignId);

      if (!isAuthed) {
        if (active) {
          setEntries(localEntries);
          setSelectedEntryId(localEntries[0]?.id ?? null);
        }
        setIsLoading(false);
        return;
      }

      const remoteEntries = await loadRemote();
      if (!active) return;

      const nextEntries = remoteEntries === null ? localEntries : remoteEntries;
      setEntries(nextEntries);
      writeLocal(campaignId, nextEntries);
      setSelectedEntryId(nextEntries[0]?.id ?? null);
      setIsLoading(false);
    };

    void hydrate();
    return () => {
      active = false;
    };
  }, [campaignId, isAuthed, loading]);

  const visibleEntries = useMemo(
    () => entries.filter((entry) => entry.visibleToPlayers),
    [entries]
  );

  const selectedEntry = useMemo(
    () => (selectedEntryId ? visibleEntries.find((entry) => entry.id === selectedEntryId) ?? null : null),
    [selectedEntryId, visibleEntries]
  );

  const categories = {
    session: 'Session Log',
    note: 'Warden Note',
    lore: 'Lore',
    handout: 'Handout',
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <SystemWindow title="HANDOUTS & LORE">
          <div className="space-y-2 max-h-[520px] overflow-y-auto">
            {isLoading ? (
              <p className="text-xs text-muted-foreground text-center py-4">Loading handouts...</p>
            ) : visibleEntries.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">No handouts shared yet.</p>
            ) : (
              visibleEntries.map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => setSelectedEntryId(entry.id)}
                  className={cn(
                    'w-full p-3 rounded border text-left transition-all',
                    selectedEntryId === entry.id ? 'bg-primary/20 border-primary' : 'border-border hover:bg-muted/50'
                  )}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex-1 min-w-0">
                      <div className="font-heading font-semibold text-sm truncate">{entry.title}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {categories[entry.category]}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">{new Date(entry.updatedAt).toLocaleDateString()}</div>
                </button>
              ))
            )}
          </div>
        </SystemWindow>
      </div>

      <div className="lg:col-span-2">
        {selectedEntry ? (
          <SystemWindow title={selectedEntry.title}>
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-4 border-b border-border">
                <Badge variant="outline">{categories[selectedEntry.category]}</Badge>
                <Badge variant="outline" className="text-green-400">
                  Shared
                </Badge>
              </div>

              <div className="prose prose-invert max-w-none">
                <div className="whitespace-pre-wrap font-mono text-sm text-muted-foreground">
                  {selectedEntry.content || <em className="text-muted-foreground">No content yet.</em>}
                </div>
              </div>

              <div className="pt-4 border-t border-border text-xs text-muted-foreground">
                Published: {new Date(selectedEntry.createdAt).toLocaleString()}
                {selectedEntry.updatedAt !== selectedEntry.createdAt && (
                  <> • Updated: {new Date(selectedEntry.updatedAt).toLocaleString()}</>
                )}
              </div>
            </div>
          </SystemWindow>
        ) : (
          <SystemWindow title="SELECT A HANDOUT">
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground font-heading">Select a handout to view it.</p>
            </div>
          </SystemWindow>
        )}
      </div>
    </div>
  );
}
