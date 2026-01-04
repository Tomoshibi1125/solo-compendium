import { useState } from 'react';
import { BookOpen, Plus, Edit2, Trash2, Calendar, Tag, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCharacterJournal, useCreateJournalEntry, useUpdateJournalEntry, useDeleteJournalEntry, JournalEntry } from '@/hooks/useCharacterJournal';
import { format } from 'date-fns';

interface JournalPanelProps {
  characterId: string;
}

export function JournalPanel({ characterId }: JournalPanelProps) {
  const { data: entries = [], isLoading } = useCharacterJournal(characterId);
  const createEntry = useCreateJournalEntry();
  const updateEntry = useUpdateJournalEntry();
  const deleteEntry = useDeleteJournalEntry();

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('');

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    
    await createEntry.mutateAsync({
      character_id: characterId,
      title: newTitle,
      content: newContent || null,
      session_date: new Date().toISOString().split('T')[0],
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
    });
    
    setIsCreating(false);
    setNewTitle('');
    setNewContent('');
    setNewTags('');
  };

  const handleDelete = async (id: string) => {
    await deleteEntry.mutateAsync({ id, characterId });
  };

  if (isLoading) {
    return (
      <Card className="border-primary/20 bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <BookOpen className="h-5 w-5" />
            Hunter's Journal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-16 bg-muted rounded" />
            <div className="h-16 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 bg-card/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-primary">
          <BookOpen className="h-5 w-5" />
          Hunter's Journal
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsCreating(true)}
          className="border-primary/30 hover:border-primary hover:bg-primary/10"
        >
          <Plus className="h-4 w-4 mr-1" />
          New Entry
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {isCreating && (
              <Card className="border-arise/30 bg-arise/5">
                <CardContent className="p-4 space-y-3">
                  <Input
                    placeholder="Entry Title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="bg-background/50"
                  />
                  <Textarea
                    placeholder="What happened during this session..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    rows={4}
                    className="bg-background/50"
                  />
                  <Input
                    placeholder="Tags (comma separated)"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    className="bg-background/50"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleCreate}
                      disabled={!newTitle.trim() || createEntry.isPending}
                      className="bg-arise hover:bg-arise/80"
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsCreating(false)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {entries.length === 0 && !isCreating ? (
              <p className="text-muted-foreground text-center py-8">
                No journal entries yet. Chronicle your adventures!
              </p>
            ) : (
              entries.map((entry) => (
                <Card key={entry.id} className="border-muted/30 bg-background/30 hover:border-primary/30 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{entry.title}</h4>
                        {entry.session_date && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(entry.session_date), 'MMM d, yyyy')}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDelete(entry.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    
                    {entry.content && (
                      <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">
                        {entry.content}
                      </p>
                    )}
                    
                    {entry.tags && entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {entry.tags.map((tag, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs bg-primary/10 text-primary">
                            <Tag className="h-2.5 w-2.5 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
