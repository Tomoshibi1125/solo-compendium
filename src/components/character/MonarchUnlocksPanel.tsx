import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCharacterMonarchUnlocks, useUnlockMonarch, useSetPrimaryMonarch } from '@/hooks/useMonarchUnlocks';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Crown, Lock, Star, Scroll, CheckCircle } from 'lucide-react';

interface MonarchUnlocksPanelProps {
  characterId: string;
}

const themeColors: Record<string, string> = {
  Shadow: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  Frost: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  Plague: 'bg-green-500/20 text-green-400 border-green-500/30',
  Stone: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  Beast: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Iron: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  Destruction: 'bg-red-500/20 text-red-400 border-red-500/30',
  'White Flames': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Transfiguration: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
};

export function MonarchUnlocksPanel({ characterId }: MonarchUnlocksPanelProps) {
  const [open, setOpen] = useState(false);
  const [selectedMonarchId, setSelectedMonarchId] = useState('');
  const [questName, setQuestName] = useState('');
  const [dmNotes, setDmNotes] = useState('');

  const { data: unlocks = [] } = useCharacterMonarchUnlocks(characterId);
  const unlockMonarch = useUnlockMonarch();
  const setPrimary = useSetPrimaryMonarch();

  // Fetch all monarchs
  const { data: allMonarchs = [] } = useQuery({
    queryKey: ['all-monarchs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('compendium_monarchs')
        .select('id, name, title, theme')
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  const unlockedIds = new Set(unlocks.map(u => u.monarch_id));
  const lockedMonarchs = allMonarchs.filter(m => !unlockedIds.has(m.id));
  const canUnlockSovereign = unlocks.length >= 2;

  const handleUnlock = () => {
    if (!selectedMonarchId || !questName.trim()) return;
    
    unlockMonarch.mutate(
      {
        characterId,
        monarchId: selectedMonarchId,
        questName: questName.trim(),
        dmNotes: dmNotes.trim() || undefined,
        isPrimary: unlocks.length === 0, // First unlock becomes primary
      },
      {
        onSuccess: () => {
          setOpen(false);
          setSelectedMonarchId('');
          setQuestName('');
          setDmNotes('');
        },
      }
    );
  };

  return (
    <Card className="border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-primary" />
            Monarch Unlocks
          </span>
          <Badge variant={canUnlockSovereign ? 'default' : 'outline'}>
            {unlocks.length}/2 for Sovereign
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Unlocked Monarchs */}
        {unlocks.length > 0 ? (
          <div className="space-y-3">
            {unlocks.map((unlock) => {
              const monarch = unlock.monarch;
              if (!monarch) return null;
              
              return (
                <div
                  key={unlock.id}
                  className={`p-3 rounded-lg border ${
                    unlock.is_primary ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Crown className="h-4 w-4" />
                      <span className="font-medium">{monarch.title}</span>
                      <Badge variant="outline" className={themeColors[monarch.theme] || ''}>
                        {monarch.theme}
                      </Badge>
                      {unlock.is_primary && (
                        <Badge variant="default" className="text-xs">
                          <Star className="h-3 w-3 mr-1" />
                          Primary
                        </Badge>
                      )}
                    </div>
                    {!unlock.is_primary && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setPrimary.mutate({ characterId, unlockId: unlock.id })}
                      >
                        Set Primary
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Scroll className="h-3 w-3" />
                    <span>Quest: {unlock.quest_name}</span>
                  </div>
                  
                  {unlock.dm_notes && (
                    <p className="text-xs text-muted-foreground mt-1 italic">
                      {unlock.dm_notes}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-4">
            <Lock className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Complete quests to unlock Monarch powers.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              DM marks quest completion to grant access.
            </p>
          </div>
        )}

        {/* Sovereign Status */}
        {canUnlockSovereign && (
          <div className="p-3 rounded-lg border border-primary bg-primary/10">
            <div className="flex items-center gap-2 text-primary">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Sovereign Eligible!</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              You have unlocked 2 Monarchs. Use the Gemini Protocol to fuse them into a Sovereign.
            </p>
          </div>
        )}

        {/* Unlock New Monarch */}
        {lockedMonarchs.length > 0 && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Lock className="h-4 w-4 mr-2" />
                Mark Quest Complete (DM)
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Unlock Monarch Power</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Monarch</Label>
                  <Select value={selectedMonarchId} onValueChange={setSelectedMonarchId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a Monarch..." />
                    </SelectTrigger>
                    <SelectContent>
                      <ScrollArea className="max-h-60">
                        {lockedMonarchs.map((monarch) => (
                          <SelectItem key={monarch.id} value={monarch.id}>
                            <div className="flex items-center gap-2">
                              <span>{monarch.title}</span>
                              <Badge variant="outline" className={`text-xs ${themeColors[monarch.theme] || ''}`}>
                                {monarch.theme}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </ScrollArea>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Quest Name *</Label>
                  <Input
                    placeholder="e.g., Trial of the Shadow Throne"
                    value={questName}
                    onChange={(e) => setQuestName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>DM Notes (optional)</Label>
                  <Textarea
                    placeholder="Notes about how the quest was completed..."
                    value={dmNotes}
                    onChange={(e) => setDmNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button
                  className="w-full"
                  onClick={handleUnlock}
                  disabled={!selectedMonarchId || !questName.trim() || unlockMonarch.isPending}
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Unlock Monarch Power
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}
