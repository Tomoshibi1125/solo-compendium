import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, Edit, FileText, Eye, EyeOff, Lock, Unlock } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useCampaignRole } from '@/hooks/useCampaigns';
import { cn } from '@/lib/utils';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth/authContext';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  visibleToPlayers: boolean;
  category: 'session' | 'note' | 'lore' | 'handout';
  createdAt: string;
  updatedAt: string;
}

const VTTJournal = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: role } = useCampaignRole(campaignId || '');
  const isGM = role === 'system' || role === 'co-system';
  const { user, loading } = useAuth();
  const isAuthed = isSupabaseConfigured && !!user?.id;
  
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newEntry, setNewEntry] = useState<{
    title: string;
    content: string;
    visibleToPlayers: boolean;
    category: JournalEntry['category'];
  }>({
    title: '',
    content: '',
    visibleToPlayers: false,
    category: 'note',
  });

  // Load entries when campaignId changes
  useEffect(() => {
    if (!campaignId) {
      setIsLoading(false);
      return;
    }
    if (loading) return;
    let active = true;

    const loadLocal = () => {
      const saved = localStorage.getItem(`vtt-journal-${campaignId}`);
      if (!saved) return [];
      try {
        return JSON.parse(saved) as JournalEntry[];
      } catch (e) {
        return [];
      }
    };

    const loadRemote = async () => {
      const { data, error } = await supabase
        .from('vtt_journal_entries' as any)
        .select('id, title, content, category, visible_to_players, created_at, updated_at')
        .eq('campaign_id', campaignId)
        .order('created_at', { ascending: false });
      if (error) {
        return [];
      }
      return (data || []).map((row: any) => ({
        id: row.id,
        title: row.title,
        content: row.content ?? '',
        category: row.category,
        visibleToPlayers: !!row.visible_to_players,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      })) as JournalEntry[];
    };

    const hydrate = async () => {
      setIsLoading(true);
      const localEntries = loadLocal();
      if (!isAuthed) {
        if (active) setEntries(localEntries);
        setIsLoading(false);
        return;
      }
      const remoteEntries = await loadRemote();
      if (!active) return;
      setEntries(remoteEntries.length > 0 ? remoteEntries : localEntries);
      setIsLoading(false);
    };

    void hydrate();
    return () => {
      active = false;
    };
  }, [campaignId, isAuthed, loading]);

  const handleCreateEntry = async () => {
    if (!newEntry.title.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a title.',
        variant: 'destructive',
      });
      return;
    }

    if (!isAuthed || !user?.id || !campaignId) {
      const entry: JournalEntry = {
        id: `entry-${Date.now()}`,
        title: newEntry.title,
        content: newEntry.content,
        visibleToPlayers: newEntry.visibleToPlayers,
        category: newEntry.category,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updated = [entry, ...entries];
      setEntries(updated);
      localStorage.setItem(`vtt-journal-${campaignId}`, JSON.stringify(updated));
      setNewEntry({ title: '', content: '', visibleToPlayers: false, category: 'note' });
      setIsEditing(false);
      toast({
        title: 'Created!',
        description: 'Journal entry created.',
      });
      return;
    }

    const { data, error } = await supabase
      .from('vtt_journal_entries' as any)
      .insert({
        campaign_id: campaignId,
        user_id: user.id,
        title: newEntry.title,
        content: newEntry.content,
        visible_to_players: newEntry.visibleToPlayers,
        category: newEntry.category,
      })
      .select('id, title, content, category, visible_to_players, created_at, updated_at')
      .single();
    if (error || !data) {
      toast({
        title: 'Error',
        description: 'Failed to create journal entry.',
        variant: 'destructive',
      });
      return;
    }
    const entry: JournalEntry = {
      id: data.id,
      title: data.title,
      content: data.content ?? '',
      visibleToPlayers: !!data.visible_to_players,
      category: data.category,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
    setEntries([entry, ...entries]);
    setNewEntry({ title: '', content: '', visibleToPlayers: false, category: 'note' });
    setIsEditing(false);
    toast({
      title: 'Created!',
      description: 'Journal entry created.',
    });
  };

  const handleUpdateEntry = async () => {
    if (!selectedEntry) return;

    if (!isAuthed || !user?.id || !campaignId) {
      const updatedEntry = { ...selectedEntry, updatedAt: new Date().toISOString() };
      const updated = entries.map(e =>
        e.id === selectedEntry.id ? updatedEntry : e
      );
      setEntries(updated);
      setSelectedEntry(updatedEntry);
      localStorage.setItem(`vtt-journal-${campaignId}`, JSON.stringify(updated));
      setIsEditing(false);
      toast({
        title: 'Updated!',
        description: 'Journal entry updated.',
      });
      return;
    }

    const { data, error } = await supabase
      .from('vtt_journal_entries' as any)
      .update({
        title: selectedEntry.title,
        content: selectedEntry.content,
        visible_to_players: selectedEntry.visibleToPlayers,
        category: selectedEntry.category,
      })
      .eq('id', selectedEntry.id)
      .select('id, title, content, category, visible_to_players, created_at, updated_at')
      .single();
    if (error || !data) {
      toast({
        title: 'Error',
        description: 'Failed to update journal entry.',
        variant: 'destructive',
      });
      return;
    }
    const updatedEntry: JournalEntry = {
      id: data.id,
      title: data.title,
      content: data.content ?? '',
      category: data.category,
      visibleToPlayers: !!data.visible_to_players,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
    const updated = entries.map((entry) =>
      entry.id === selectedEntry.id ? updatedEntry : entry
    );
    setEntries(updated);
    setSelectedEntry(updatedEntry);
    setIsEditing(false);
    toast({
      title: 'Updated!',
      description: 'Journal entry updated.',
    });
  };

  const handleDeleteEntry = async (id: string) => {
    if (!campaignId) return;
    if (!isAuthed || !user?.id) {
      const updated = entries.filter(e => e.id !== id);
      setEntries(updated);
      if (selectedEntry?.id === id) {
        setSelectedEntry(null);
      }
      localStorage.setItem(`vtt-journal-${campaignId}`, JSON.stringify(updated));
      toast({
        title: 'Deleted!',
        description: 'Journal entry deleted.',
      });
      return;
    }

    const { error } = await supabase
      .from('vtt_journal_entries' as any)
      .delete()
      .eq('id', id);
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete journal entry.',
        variant: 'destructive',
      });
      return;
    }
    setEntries(entries.filter(e => e.id !== id));
    if (selectedEntry?.id === id) {
      setSelectedEntry(null);
    }
    toast({
      title: 'Deleted!',
      description: 'Journal entry deleted.',
    });
  };

  const visibleEntries = entries.filter(e => isGM || e.visibleToPlayers);
  const categories = {
    session: 'Session Log',
    note: 'Warden Note',
    lore: 'Lore',
    handout: 'Handout',
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(`/campaigns/${campaignId}`)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Campaign
          </Button>
          <h1 className="font-arise text-4xl font-bold mb-2 gradient-text-shadow">
            JOURNAL & NOTES
          </h1>
          <p className="text-muted-foreground font-heading">
            Keep session logs, notes, lore, and handouts organized. Share entries with players or keep them private.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            {isGM && (
              <SystemWindow title="CREATE ENTRY">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    New Entry
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="entry-title">Title</Label>
                      <Input
                        id="entry-title"
                        value={newEntry.title}
                        onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                        placeholder="Entry title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="entry-category">Category</Label>
                      <select
                        id="entry-category"
                        aria-label="Entry category"
                        value={newEntry.category}
                        onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value as JournalEntry['category'] })}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="session">Session Log</option>
                        <option value="note">Warden Note</option>
                        <option value="lore">Lore</option>
                        <option value="handout">Handout</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="visible"
                        aria-label="Visible to players"
                        checked={newEntry.visibleToPlayers}
                        onChange={(e) => setNewEntry({ ...newEntry, visibleToPlayers: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <Label htmlFor="visible" className="cursor-pointer text-sm">
                        Visible to Players
                      </Label>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleCreateEntry} className="flex-1">
                        Create
                      </Button>
                      <Button
                        onClick={() => {
                          setIsEditing(false);
                          setNewEntry({ title: '', content: '', visibleToPlayers: false, category: 'note' });
                        }}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </SystemWindow>
            )}

            <SystemWindow title="ENTRIES">
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {isLoading ? (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    Loading entries...
                  </p>
                ) : visibleEntries.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    No entries yet. {isGM && 'Create your first entry!'}
                  </p>
                ) : (
                  visibleEntries.map((entry) => (
                    <button
                      key={entry.id}
                      onClick={() => setSelectedEntry(entry)}
                      className={cn(
                        'w-full p-3 rounded border text-left transition-all',
                        selectedEntry?.id === entry.id
                          ? 'bg-primary/20 border-primary'
                          : 'border-border hover:bg-muted/50'
                      )}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex-1 min-w-0">
                          <div className="font-heading font-semibold text-sm truncate">
                            {entry.title}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {categories[entry.category]}
                            </Badge>
                            {entry.visibleToPlayers && (
                              <Badge variant="outline" className="text-xs text-green-400">
                                Public
                              </Badge>
                            )}
                          </div>
                        </div>
                        {isGM && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteEntry(entry.id);
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(entry.updatedAt).toLocaleDateString()}
                      </div>
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
                  <div className="flex items-center justify-between pb-4 border-b border-border">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{categories[selectedEntry.category]}</Badge>
                      {selectedEntry.visibleToPlayers && (
                        <Badge variant="outline" className="text-green-400">
                          Visible to Players
                        </Badge>
                      )}
                    </div>
                    {isGM && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditing(!isEditing)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    )}
                  </div>

                  {isEditing && isGM ? (
                    <div className="space-y-4">
                      <div>
                        <Label>Content</Label>
                        <Textarea
                          value={selectedEntry.content}
                          onChange={(e) => setSelectedEntry({ ...selectedEntry, content: e.target.value })}
                          rows={20}
                          className="font-mono text-sm"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleUpdateEntry}>Save Changes</Button>
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="prose prose-invert max-w-none">
                      <div className="whitespace-pre-wrap font-mono text-sm text-muted-foreground">
                        {selectedEntry.content || <em className="text-muted-foreground">No content yet.</em>}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-border text-xs text-muted-foreground">
                    Created: {new Date(selectedEntry.createdAt).toLocaleString()}
                    {selectedEntry.updatedAt !== selectedEntry.createdAt && (
                      <> • Updated: {new Date(selectedEntry.updatedAt).toLocaleString()}</>
                    )}
                  </div>
                </div>
              </SystemWindow>
            ) : (
              <SystemWindow title="SELECT AN ENTRY">
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground font-heading">
                    Select an entry from the list to view its contents.
                  </p>
                </div>
              </SystemWindow>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VTTJournal;


