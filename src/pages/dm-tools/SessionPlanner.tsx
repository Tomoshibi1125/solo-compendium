import { useState, useEffect, useRef } from 'react';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, Calendar, Clock, FileText, Users } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SessionNote {
  id: string;
  title: string;
  content: string;
  type: 'encounter' | 'npc' | 'location' | 'plot' | 'other';
}

interface SessionPlan {
  id: string;
  title: string;
  date?: string;
  notes: SessionNote[];
  prepNotes: string;
  postSessionNotes: string;
}

const SessionPlanner = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<SessionPlan[]>([]);
  
  const initialSessionId = useRef(Date.now().toString()).current;
  
  const [currentSession, setCurrentSession] = useState<SessionPlan>({
    id: initialSessionId,
    title: 'New Session',
    notes: [],
    prepNotes: '',
    postSessionNotes: '',
  });
  const [newNote, setNewNote] = useState<{ title: string; content: string; type: SessionNote['type'] }>({ title: '', content: '', type: 'other' });

  const saveSession = () => {
    const updated = sessions.filter(s => s.id !== currentSession.id);
    updated.push(currentSession);
    setSessions(updated);
    
    // Save to localStorage
    localStorage.setItem('dm-sessions', JSON.stringify(updated));
    
    toast({
      title: 'Saved!',
      description: 'Session plan saved successfully.',
    });
  };

  const loadSessions = () => {
    const saved = localStorage.getItem('dm-sessions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSessions(parsed);
      } catch (e) {
        // Invalid data
      }
    }
  };

  const addNote = () => {
    if (!newNote.title) return;
    
    const note: SessionNote = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      type: newNote.type,
    };
    
    setCurrentSession({
      ...currentSession,
      notes: [...currentSession.notes, note],
    });
    
    setNewNote({ title: '', content: '', type: 'other' });
    
    toast({
      title: 'Note Added',
      description: 'Session note added successfully.',
    });
  };

  const deleteNote = (noteId: string) => {
    setCurrentSession({
      ...currentSession,
      notes: currentSession.notes.filter(n => n.id !== noteId),
    });
  };

  const getNoteIcon = (type: string) => {
    switch (type) {
      case 'encounter': return '⚔️';
      case 'npc': return '👤';
      case 'location': return '📍';
      case 'plot': return '📖';
      default: return '📝';
    }
  };

  const getNoteColor = (type: string) => {
    switch (type) {
      case 'encounter': return 'border-red-400/30 bg-red-400/10';
      case 'npc': return 'border-blue-400/30 bg-blue-400/10';
      case 'location': return 'border-green-400/30 bg-green-400/10';
      case 'plot': return 'border-purple-400/30 bg-purple-400/10';
      default: return 'border-muted';
    }
  };

  // Load sessions on mount
  useEffect(() => {
    loadSessions();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dm-tools')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to DM Tools
          </Button>
          <h1 className="font-arise text-4xl font-bold mb-2 gradient-text-shadow">
            SESSION PLANNER
          </h1>
          <p className="text-muted-foreground font-heading">
            Plan and organize your sessions. Track encounters, NPCs, locations, and plot points.
          </p>
        </div>

        <Tabs defaultValue="plan" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="plan">Session Plan</TabsTrigger>
            <TabsTrigger value="prep">Prep Notes</TabsTrigger>
            <TabsTrigger value="post">Post-Session</TabsTrigger>
          </TabsList>

          <TabsContent value="plan" className="space-y-6">
            <SystemWindow title="SESSION INFO">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Session Title</Label>
                  <Input
                    id="title"
                    value={currentSession.title}
                    onChange={(e) => setCurrentSession({ ...currentSession, title: e.target.value })}
                    placeholder="e.g., The Shadow Monarch's Return"
                  />
                </div>
                <div>
                  <Label htmlFor="date">Date (Optional)</Label>
                  <Input
                    id="date"
                    type="date"
                    value={currentSession.date || ''}
                    onChange={(e) => setCurrentSession({ ...currentSession, date: e.target.value })}
                  />
                </div>
              </div>
            </SystemWindow>

            <SystemWindow title="ADD NOTE">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="note-title">Note Title</Label>
                    <Input
                      id="note-title"
                      value={newNote.title}
                      onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                      placeholder="e.g., Boss Battle - Igris the Blood Red"
                    />
                  </div>
                  <div>
                    <Label htmlFor="note-type">Type</Label>
                    <select
                      id="note-type"
                      value={newNote.type}
                      onChange={(e) => setNewNote({ ...newNote, type: e.target.value as SessionNote['type'] })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="encounter">Encounter</option>
                      <option value="npc">NPC</option>
                      <option value="location">Location</option>
                      <option value="plot">Plot</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="note-content">Content</Label>
                  <Textarea
                    id="note-content"
                    value={newNote.content}
                    onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                    placeholder="Describe the encounter, NPC details, location description, or plot points..."
                    rows={4}
                  />
                </div>
                <Button onClick={addNote} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Note
                </Button>
              </div>
            </SystemWindow>

            <SystemWindow title="SESSION NOTES">
              {currentSession.notes.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No notes yet. Add notes to organize your session.
                </p>
              ) : (
                <div className="space-y-3">
                  {currentSession.notes.map((note) => (
                    <div
                      key={note.id}
                      className={`p-4 rounded-lg border ${getNoteColor(note.type)}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{getNoteIcon(note.type)}</span>
                          <h3 className="font-heading font-semibold">{note.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {note.type}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNote(note.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {note.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </SystemWindow>
          </TabsContent>

          <TabsContent value="prep">
            <SystemWindow title="PREPARATION NOTES">
              <Textarea
                value={currentSession.prepNotes}
                onChange={(e) => setCurrentSession({ ...currentSession, prepNotes: e.target.value })}
                placeholder="Preparation notes, ideas, reminders..."
                rows={15}
                className="font-mono text-sm"
              />
            </SystemWindow>
          </TabsContent>

          <TabsContent value="post">
            <SystemWindow title="POST-SESSION NOTES">
              <Textarea
                value={currentSession.postSessionNotes}
                onChange={(e) => setCurrentSession({ ...currentSession, postSessionNotes: e.target.value })}
                placeholder="What happened? What needs to be followed up? Player actions and reactions..."
                rows={15}
                className="font-mono text-sm"
              />
            </SystemWindow>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <Button onClick={saveSession} className="w-full btn-shadow-monarch" size="lg">
            <Save className="w-4 h-4 mr-2" />
            Save Session Plan
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default SessionPlanner;

