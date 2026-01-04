import { useState } from 'react';
import { Plus, Edit, Trash2, Calendar, FileText, BookOpen, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { cn } from '@/lib/utils';

interface CampaignNotesProps {
  campaignId: string;
}

export function CampaignNotes({ campaignId }: CampaignNotesProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [noteType, setNoteType] = useState<'session' | 'note' | 'recap'>('session');
  const [sessionDate, setSessionDate] = useState('');

  const { data: notes = [], isLoading } = useCampaignNotes(campaignId);
  const { data: hasDMAccess = false } = useHasDMAccess(campaignId);
  const createNote = useCreateCampaignNote();
  const updateNote = useUpdateCampaignNote();
  const deleteNote = useDeleteCampaignNote();

  const editingNoteData = editingNote ? notes.find(n => n.id === editingNote) : null;

  const handleOpenDialog = (noteId?: string) => {
    if (noteId) {
      const note = notes.find(n => n.id === noteId);
      if (note) {
        setEditingNote(noteId);
        setTitle(note.title);
        setContent(note.content);
        setNoteType(note.note_type);
        setSessionDate(note.session_date || '');
      }
    } else {
      setEditingNote(null);
      setTitle('');
      setContent('');
      setNoteType('session');
      setSessionDate('');
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingNote(null);
    setTitle('');
    setContent('');
    setNoteType('session');
    setSessionDate('');
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return;

    if (editingNote) {
      await updateNote.mutateAsync({
        noteId: editingNote,
        campaignId,
        title,
        content,
        noteType,
        sessionDate: sessionDate || undefined,
      });
    } else {
      await createNote.mutateAsync({
        campaignId,
        title,
        content,
        noteType,
        sessionDate: sessionDate || undefined,
      });
    }
    handleCloseDialog();
  };

  const handleDelete = async (noteId: string) => {
    if (confirm('Delete this note?')) {
      await deleteNote.mutateAsync({ noteId, campaignId });
    }
  };

  const getNoteIcon = (type: string) => {
    switch (type) {
      case 'session':
        return <Calendar className="w-4 h-4" />;
      case 'recap':
        return <BookOpen className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <>
      <SystemWindow title="CAMPAIGN NOTES" className="h-[500px] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-muted-foreground">
            Session logs, notes, and recaps for this campaign
          </p>
          {hasDMAccess && (
            <Button size="sm" onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              New Note
            </Button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : notes.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No notes yet. Create your first session log!
            </p>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="p-4 bg-muted/50 rounded-lg border border-border hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getNoteIcon(note.note_type)}
                    <h4 className="font-heading font-semibold">{note.title}</h4>
                    <span className="text-xs text-muted-foreground px-2 py-0.5 bg-background rounded">
                      {note.note_type}
                    </span>
                  </div>
                  {hasDMAccess && (
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
                  )}
                </div>
                {note.session_date && (
                  <p className="text-xs text-muted-foreground mb-2">
                    Session Date: {format(new Date(note.session_date), 'PPP')}
                  </p>
                )}
                <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {format(new Date(note.created_at), 'PPp')}
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
              Add a session log, note, or recap for this campaign.
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
                <Label htmlFor="note-type">Type</Label>
                <Select value={noteType} onValueChange={(v: 'session' | 'note' | 'recap') => setNoteType(v)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="session">Session Log</SelectItem>
                    <SelectItem value="note">Note</SelectItem>
                    <SelectItem value="recap">Recap</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="session-date">Session Date (Optional)</Label>
                <Input
                  id="session-date"
                  type="date"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="note-content">Content</Label>
              <Textarea
                id="note-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What happened in this session?"
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
              disabled={!title.trim() || !content.trim() || createNote.isPending || updateNote.isPending}
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

