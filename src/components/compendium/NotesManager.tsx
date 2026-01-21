import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth/authContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  FileText, 
  Calendar,
  Tag
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { logger } from '@/lib/logger';

interface Note {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

interface NotesManagerProps {
  entryId: string;
  entryType: string;
  entryName: string;
  className?: string;
}

export function NotesManager({ 
  entryId, 
  entryType, 
  entryName, 
  className 
}: NotesManagerProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const [noteTags, setNoteTags] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const isAuthed = isSupabaseConfigured && !!user?.id;

  // Load notes from localStorage
  React.useEffect(() => {
    if (loading) return;
    let active = true;

    const loadLocal = () => {
      const storageKey = `notes_${entryType}_${entryId}`;
      const savedNotes = localStorage.getItem(storageKey);
      if (!savedNotes) return [];
      try {
        return JSON.parse(savedNotes).map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt),
        })) as Note[];
      } catch (error) {
        logger.error('Failed to load notes:', error);
        return [];
      }
    };

    const loadRemote = async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('compendium_notes' as any)
        .select('id, content, tags, created_at, updated_at')
        .eq('entry_type', entryType)
        .eq('entry_id', entryId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });
      if (error) {
        logger.error('Failed to load notes:', error);
        return [];
      }
      return (data || []).map((row: any) => ({
        id: row.id,
        content: row.content,
        tags: Array.isArray(row.tags) ? row.tags : [],
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
      })) as Note[];
    };

    const hydrate = async () => {
      setIsLoading(true);
      const localNotes = loadLocal();
      if (!isAuthed) {
        if (active) setNotes(localNotes);
        setIsLoading(false);
        return;
      }
      const remoteNotes = await loadRemote();
      if (!active) return;
      setNotes(remoteNotes.length > 0 ? remoteNotes : localNotes);
      setIsLoading(false);
    };

    void hydrate();
    return () => {
      active = false;
    };
  }, [entryType, entryId, isAuthed, loading, user?.id]);

  // Save notes to localStorage
  const saveNotes = (updatedNotes: Note[]) => {
    if (typeof window === 'undefined') return;
    const storageKey = `notes_${entryType}_${entryId}`;
    localStorage.setItem(storageKey, JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
  };

  const handleAddNote = async () => {
    if (!noteContent.trim()) {
      toast({
        title: 'Error',
        description: 'Note content cannot be empty',
        variant: 'destructive',
      });
      return;
    }

    const tags = noteTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

    if (!isAuthed || !user?.id) {
      const newNote: Note = {
        id: Date.now().toString(),
        content: noteContent.trim(),
        createdAt: new Date(),
        updatedAt: new Date(),
        tags,
      };

      const updatedNotes = editingNote
        ? notes.map(note => note.id === editingNote.id ? { ...newNote, id: editingNote.id } : note)
        : [...notes, newNote];

      saveNotes(updatedNotes);
      toast({
        title: editingNote ? 'Note updated' : 'Note added',
        description: editingNote ? 'Your note has been updated' : 'Your note has been saved',
      });
      resetForm();
      return;
    }

    if (editingNote) {
      const { data, error } = await supabase
        .from('compendium_notes' as any)
        .update({
          content: noteContent.trim(),
          tags,
        })
        .eq('id', editingNote.id)
        .eq('user_id', user.id)
        .select('id, content, tags, created_at, updated_at')
        .single();
      if (error || !data) {
        toast({
          title: 'Error',
          description: 'Failed to update note',
          variant: 'destructive',
        });
        return;
      }
      const updated = notes.map((note) =>
        note.id === editingNote.id
          ? {
              id: data.id,
              content: data.content,
              tags: Array.isArray(data.tags) ? data.tags : [],
              createdAt: new Date(data.created_at),
              updatedAt: new Date(data.updated_at),
            }
          : note
      );
      setNotes(updated);
      toast({
        title: 'Note updated',
        description: 'Your note has been updated',
      });
      resetForm();
      return;
    }

    const { data, error } = await supabase
      .from('compendium_notes' as any)
      .insert({
        user_id: user.id,
        entry_type: entryType,
        entry_id: entryId,
        content: noteContent.trim(),
        tags,
      })
      .select('id, content, tags, created_at, updated_at')
      .single();
    if (error || !data) {
      toast({
        title: 'Error',
        description: 'Failed to add note',
        variant: 'destructive',
      });
      return;
    }
    const newNote: Note = {
      id: data.id,
      content: data.content,
      tags: Array.isArray(data.tags) ? data.tags : [],
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
    setNotes([...notes, newNote]);
    toast({
      title: 'Note added',
      description: 'Your note has been saved',
    });
    resetForm();
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setNoteContent(note.content);
    setNoteTags(note.tags.join(', '));
    setIsDialogOpen(true);
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!isAuthed || !user?.id) {
      const updatedNotes = notes.filter(note => note.id !== noteId);
      saveNotes(updatedNotes);
      toast({
        title: 'Note deleted',
        description: 'Your note has been removed',
      });
      return;
    }

    const { error } = await supabase
      .from('compendium_notes' as any)
      .delete()
      .eq('id', noteId)
      .eq('user_id', user.id);
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete note',
        variant: 'destructive',
      });
      return;
    }
    setNotes((prev) => prev.filter((note) => note.id !== noteId));
    toast({
      title: 'Note deleted',
      description: 'Your note has been removed',
    });
  };

  const resetForm = () => {
    setEditingNote(null);
    setNoteContent('');
    setNoteTags('');
    setIsDialogOpen(false);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Add Note Button */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Plus className="w-4 h-4 mr-2" />
            Add Note
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingNote ? 'Edit Note' : 'Add Note'} - {entryName}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="note-content">Note Content</Label>
              <Textarea
                id="note-content"
                placeholder="Enter your notes here..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                rows={6}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="note-tags">Tags (comma-separated)</Label>
              <Input
                id="note-tags"
                placeholder="research, important, rules"
                value={noteTags}
                onChange={(e) => setNoteTags(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={resetForm}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleAddNote}>
                <Save className="w-4 h-4 mr-2" />
                {editingNote ? 'Update' : 'Save'} Note
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notes List */}
      {isLoading && (
        <Card>
          <CardContent className="py-6 text-center text-sm text-muted-foreground">
            Loading notes...
          </CardContent>
        </Card>
      )}
      {!isLoading && notes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4" />
              Notes ({notes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {notes.map((note) => (
                  <div key={note.id} className="p-3 border rounded-lg space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm">{note.content}</p>
                        {note.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {note.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1 ml-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditNote(note)}
                          title="Edit note"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteNote(note.id)}
                          title="Delete note"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {note.updatedAt.toLocaleDateString()}
                      {note.updatedAt.getTime() !== note.createdAt.getTime() && (
                        <span>(edited)</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default NotesManager;
