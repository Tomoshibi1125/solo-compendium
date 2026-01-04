import { useState } from 'react';
import { Plus, Edit, Trash2, FileText, Share2, Lock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCampaignNotes, useCreateCampaignNote, useUpdateCampaignNote, useDeleteCampaignNote } from '@/hooks/useCampaignNotes';
import { useHasDMAccess } from '@/hooks/useCampaigns';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface CampaignNotesProps {
  campaignId: string;
}

export function CampaignNotes({ campaignId }: CampaignNotesProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const [isShared, setIsShared] = useState(false);

  const { data: notes = [], isLoading } = useCampaignNotes(campaignId);
  const { data: hasDMAccess = false } = useHasDMAccess(campaignId);
  const createNote = useCreateCampaignNote();
  const updateNote = useUpdateCampaignNote();
  const deleteNote = useDeleteCampaignNote();

  const handleOpenDialog = (noteId?: string) => {
    if (noteId) {
      const note = notes.find(n => n.id === noteId);
      if (note) {
        setEditingNote(noteId);
        setTitle(note.title);
        setContent(note.content || '');
        setCategory(note.category || 'general');
        setIsShared(note.is_shared);
      }
    } else {
      setEditingNote(null);
      setTitle('');
      setContent('');
      setCategory('general');
      setIsShared(false);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingNote(null);
    setTitle('');
    setContent('');
    setCategory('general');
    setIsShared(false);
  };

  const handleSave = async () => {
    if (!title.trim()) return;

    if (editingNote) {
      await updateNote.mutateAsync({
        noteId: editingNote,
        campaignId,
        title,
        content,
        category,
        isShared,
      });
    } else {
      await createNote.mutateAsync({
        campaignId,
        title,
        content,
        category,
        isShared,
      });
    }
    handleCloseDialog();
  };

  const handleDelete = async (noteId: string) => {
    if (confirm('Delete this note?')) {
      await deleteNote.mutateAsync({ noteId, campaignId });
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'session':
        return 'bg-primary/20 text-primary';
      case 'npc':
        return 'bg-arise/20 text-arise';
      case 'location':
        return 'bg-green-500/20 text-green-400';
      case 'quest':
        return 'bg-yellow-500/20 text-yellow-400';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <>
      <SystemWindow title="CAMPAIGN NOTES" className="h-[500px] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-muted-foreground">
            Session logs, notes, and information for this campaign
          </p>
          <Button size="sm" onClick={() => handleOpenDialog()}>
            <Plus className="w-4 h-4 mr-2" />
            New Note
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : notes.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No notes yet. Create your first note!
            </p>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="p-4 bg-muted/50 rounded-lg border border-border hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    <h4 className="font-heading font-semibold">{note.title}</h4>
                    <Badge variant="secondary" className={getCategoryColor(note.category)}>
                      {note.category}
                    </Badge>
                    {note.is_shared ? (
                      <Share2 className="w-3 h-3 text-muted-foreground" />
                    ) : (
                      <Lock className="w-3 h-3 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleOpenDialog(note.id)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleDelete(note.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                {note.content && (
                  <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  {format(new Date(note.updated_at), 'PPp')}
                </p>
              </div>
            ))
          )}
        </div>
      </SystemWindow>

      <Dialog open={dialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingNote ? 'Edit Note' : 'Create Note'}</DialogTitle>
            <DialogDescription>
              Add a note for this campaign. Shared notes are visible to all members.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="note-title">Title</Label>
              <Input
                id="note-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Session 1: The First Gate"
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="note-category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="session">Session Log</SelectItem>
                    <SelectItem value="npc">NPC</SelectItem>
                    <SelectItem value="location">Location</SelectItem>
                    <SelectItem value="quest">Quest</SelectItem>
                    <SelectItem value="lore">Lore</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-3 pt-6">
                <Switch
                  id="note-shared"
                  checked={isShared}
                  onCheckedChange={setIsShared}
                />
                <Label htmlFor="note-shared" className="cursor-pointer">
                  Share with campaign members
                </Label>
              </div>
            </div>
            <div>
              <Label htmlFor="note-content">Content</Label>
              <Textarea
                id="note-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your notes here..."
                className="mt-1 min-h-[200px]"
                rows={8}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!title.trim() || createNote.isPending || updateNote.isPending}
            >
              {createNote.isPending || updateNote.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Note'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
