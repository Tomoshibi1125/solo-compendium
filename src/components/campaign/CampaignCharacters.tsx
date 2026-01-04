import { useState } from 'react';
import { Share2, Eye, EyeOff, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCampaignSharedCharacters, useShareCharacter, useUnshareCharacter } from '@/hooks/useCampaignCharacters';
import { useCharacters } from '@/hooks/useCharacters';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface CampaignCharactersProps {
  campaignId: string;
}

export function CampaignCharacters({ campaignId }: CampaignCharactersProps) {
  const navigate = useNavigate();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState('');

  const { data: sharedCharacters = [], isLoading: loadingShared } = useCampaignSharedCharacters(campaignId);
  const { data: myCharacters = [] } = useCharacters();
  const shareCharacter = useShareCharacter();
  const unshareCharacter = useUnshareCharacter();

  const sharedCharacterIds = new Set(sharedCharacters.map(sc => sc.character_id));
  const availableCharacters = myCharacters.filter(c => !sharedCharacterIds.has(c.id));

  const handleShare = async () => {
    if (!selectedCharacter) return;
    await shareCharacter.mutateAsync({ campaignId, characterId: selectedCharacter });
    setShareDialogOpen(false);
    setSelectedCharacter('');
  };

  const handleUnshare = async (characterId: string) => {
    if (confirm('Stop sharing this character with the campaign?')) {
      await unshareCharacter.mutateAsync({ campaignId, characterId });
    }
  };

  return (
    <>
      <SystemWindow title="SHARED CHARACTERS" className="h-[400px] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-muted-foreground">
            Characters visible to all campaign members
          </p>
          <Button size="sm" onClick={() => setShareDialogOpen(true)} disabled={availableCharacters.length === 0}>
            <Share2 className="w-4 h-4 mr-2" />
            Share Character
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-2">
          {loadingShared ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : sharedCharacters.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No characters shared yet. Share one to get started!
            </p>
          ) : (
            sharedCharacters.map((share) => (
              <div
                key={share.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-heading font-semibold">
                      {share.characters?.name || 'Unknown Character'}
                    </p>
                    {share.characters && (
                      <p className="text-xs text-muted-foreground">
                        Level {share.characters.level} {share.characters.job}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {share.characters && (
                    <Link to={`/characters/${share.characters.id}`}>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        View
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleUnshare(share.character_id)}
                  >
                    <EyeOff className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </SystemWindow>

      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Character</DialogTitle>
            <DialogDescription>
              Select a character to share with all campaign members. They'll be able to view the character sheet.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedCharacter} onValueChange={setSelectedCharacter}>
              <SelectTrigger>
                <SelectValue placeholder="Select a character" />
              </SelectTrigger>
              <SelectContent>
                {availableCharacters.map((char) => (
                  <SelectItem key={char.id} value={char.id}>
                    {char.name} - Level {char.level} {char.job}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShareDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleShare}
              disabled={!selectedCharacter || shareCharacter.isPending}
            >
              {shareCharacter.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sharing...
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

