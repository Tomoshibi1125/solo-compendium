import { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateCharacter } from '@/hooks/useCharacters';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';
import type { CharacterWithAbilities } from '@/hooks/useCharacters';

interface CharacterEditDialogProps {
  character: CharacterWithAbilities | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStateChange?: (state: CharacterWithAbilities) => void;
}

export function CharacterEditDialog({ character, open, onOpenChange, onStateChange }: CharacterEditDialogProps) {
  const { toast } = useToast();
  const updateCharacter = useUpdateCharacter();
  const [name, setName] = useState('');
  const [appearance, setAppearance] = useState('');
  const [backstory, setBackstory] = useState('');
  const [notes, setNotes] = useState('');

  // Update form when character changes
  useEffect(() => {
    if (character) {
      setName(character.name || '');
      setAppearance(character.appearance || '');
      setBackstory(character.backstory || '');
      setNotes(character.notes || '');
    }
  }, [character]);

  const handleSave = async () => {
    if (!character) return;

    if (!name.trim()) {
      toast({
        title: 'Name required',
        description: 'Character name cannot be empty.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const updatedCharacter = await updateCharacter.mutateAsync({
        id: character.id,
        data: {
          name: name.trim(),
          appearance: appearance.trim() || null,
          backstory: backstory.trim() || null,
          notes: notes.trim() || null,
        },
      });

      // Notify parent of state change for undo/redo
      if (onStateChange && updatedCharacter) {
        onStateChange({
          ...character,
          ...updatedCharacter,
        } as CharacterWithAbilities);
      }

      toast({
        title: 'Character updated',
        description: 'Your changes have been saved.',
      });

      onOpenChange(false);
    } catch (error) {
      logger.error('Failed to update character:', error);
      toast({
        title: 'Failed to update character',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    }
  };

  if (!character) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Character</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="character-name">Name</Label>
            <Input
              id="character-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1"
              placeholder="Enter character name"
            />
          </div>

          <div>
            <Label htmlFor="character-appearance">Appearance</Label>
            <Textarea
              id="character-appearance"
              value={appearance}
              onChange={(e) => setAppearance(e.target.value)}
              className="mt-1"
              rows={3}
              placeholder="Physical description, notable features, etc."
            />
          </div>

          <div>
            <Label htmlFor="character-backstory">Backstory</Label>
            <Textarea
              id="character-backstory"
              value={backstory}
              onChange={(e) => setBackstory(e.target.value)}
              className="mt-1"
              rows={5}
              placeholder="Character background, history, motivations, etc."
            />
          </div>

          <div>
            <Label htmlFor="character-notes">Notes</Label>
            <Textarea
              id="character-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1"
              rows={4}
              placeholder="Session notes, reminders, character development, etc."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={updateCharacter.isPending}>
            {updateCharacter.isPending ? (
              <>
                <Save className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

