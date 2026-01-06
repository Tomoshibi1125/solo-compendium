import { useState, useEffect, useCallback } from 'react';
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
  
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isEditing, setIsEditing] = useState(false);
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

  const loadEntries = useCallback(() => {
    if (!campaignId) return;
    const saved = localStorage.getItem(`vtt-journal-${campaignId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setEntries(parsed);
      } catch (e) {
        setEntries([]);
      }
    }
  }, [campaignId]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const saveEntries = () => {
    if (!campaignId) return;
    localStorage.setItem(`vtt-journal-${campaignId}`, JSON.stringify(entries));
    toast({
      title: 'Saved!',
      description: 'Journal entries saved.',
    });
  };

  const handleCreateEntry = () => {
    if (!newEntry.title.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a title.',
        variant: 'destructive',
      });
      return;
    }

    const entry: JournalEntry = {
      id: `entry-${Date.now()}`,
      title: newEntry.title,
      content: newEntry.content,
      visibleToPlayers: newEntry.visibleToPlayers,
      category: newEntry.category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setEntries([entry, ...entries]);
    saveEntries();
    setNewEntry({ title: '', content: '', visibleToPlayers: false, category: 'note' });
    setIsEditing(false);

    toast({
      title: 'Created!',
      description: 'Journal entry created.',
    });
  };

  const handleUpdateEntry = () => {
    if (!selectedEntry) return;

    const updated = entries.map(e =>
      e.id === selectedEntry.id
        ? { ...selectedEntry, updatedAt: new Date().toISOString() }
        : e
    );
    setEntries(updated);
    saveEntries();
    setIsEditing(false);

    toast({
      title: 'Updated!',
      description: 'Journal entry updated.',
    });
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
    if (selectedEntry?.id === id) {
      setSelectedEntry(null);
    }
    saveEntries();
    toast({
      title: 'Deleted!',
      description: 'Journal entry deleted.',
    });
  };

  const visibleEntries = entries.filter(e => isGM || e.visibleToPlayers);
  const categories = {
    session: 'Session Log',
    note: 'DM Note',
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
                        <option value="note">DM Note</option>
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
                {visibleEntries.length === 0 ? (
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

