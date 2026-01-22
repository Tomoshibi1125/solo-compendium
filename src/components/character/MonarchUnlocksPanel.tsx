import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { useCharacterMonarchUnlocks, useUnlockMonarch, useSetPrimaryMonarch } from '@/hooks/useMonarchUnlocks';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Crown, Lock, Star, Scroll, CheckCircle, Sparkles, Unlock, Skull, Zap, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatMonarchVernacular, MONARCH_LABEL, MONARCH_LABEL_PLURAL } from '@/lib/vernacular';

interface MonarchUnlocksPanelProps {
  characterId: string;
}

// Enhanced theme colors with System Ascendant aesthetic
const themeColors: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  Shadow: { bg: 'bg-shadow-purple/15', text: 'text-shadow-purple', border: 'border-shadow-purple/40', glow: 'shadow-[0_0_12px_hsl(var(--shadow-purple)/0.3)]' },
  Frost: { bg: 'bg-mana-cyan/15', text: 'text-mana-cyan', border: 'border-mana-cyan/40', glow: 'shadow-[0_0_12px_hsl(var(--mana-cyan)/0.3)]' },
  Plague: { bg: 'bg-accent/15', text: 'text-accent', border: 'border-accent/40', glow: 'shadow-[0_0_12px_hsl(var(--accent)/0.3)]' },
  Stone: { bg: 'bg-gate-d/15', text: 'text-gate-d', border: 'border-gate-d/40', glow: '' },
  Beast: { bg: 'bg-gilded-reaper/15', text: 'text-gilded-reaper', border: 'border-gilded-reaper/40', glow: 'shadow-[0_0_10px_hsl(var(--gilded-reaper)/0.3)]' },
  Beasts: { bg: 'bg-gilded-reaper/15', text: 'text-gilded-reaper', border: 'border-gilded-reaper/40', glow: 'shadow-[0_0_10px_hsl(var(--gilded-reaper)/0.3)]' },
  Iron: { bg: 'bg-silver-commander/15', text: 'text-silver-commander', border: 'border-silver-commander/40', glow: '' },
  Destruction: { bg: 'bg-gate-a/15', text: 'text-gate-a', border: 'border-gate-a/40', glow: 'shadow-[0_0_12px_hsl(var(--gate-a)/0.3)]' },
  'White Flames': { bg: 'bg-foreground/10', text: 'text-foreground', border: 'border-foreground/30', glow: 'shadow-[0_0_12px_hsl(var(--foreground)/0.2)]' },
  Transfiguration: { bg: 'bg-arise-violet/15', text: 'text-arise-violet', border: 'border-arise-violet/40', glow: 'shadow-[0_0_12px_hsl(var(--arise-violet)/0.3)]' },
  Beginning: { bg: 'bg-arise-violet/15', text: 'text-arise-violet', border: 'border-arise-violet/40', glow: 'shadow-[0_0_15px_hsl(var(--arise-violet)/0.4)]' },
};

const themeIcons: Record<string, React.ReactNode> = {
  Shadow: <Skull className="h-4 w-4" />,
  Destruction: <Flame className="h-4 w-4" />,
  Frost: <Sparkles className="h-4 w-4" />,
  Plague: <Zap className="h-4 w-4" />,
  Iron: <Crown className="h-4 w-4" />,
  Beast: <Crown className="h-4 w-4" />,
  Beasts: <Crown className="h-4 w-4" />,
  Beginning: <Star className="h-4 w-4" />,
  'White Flames': <Flame className="h-4 w-4" />,
  Transfiguration: <Sparkles className="h-4 w-4" />,
  Stone: <Crown className="h-4 w-4" />,
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
        isPrimary: unlocks.length === 0,
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
    <SystemWindow 
      title={`${MONARCH_LABEL.toUpperCase()} UNLOCKS - DIVINE AUTHORITY`} 
      variant="monarch"
      className="border-monarch-gold/30"
    >
      <div className="space-y-4">
        {/* Status Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-monarch-gold/20 flex items-center justify-center">
              <Crown className="h-5 w-5 text-monarch-gold" />
            </div>
            <div>
              <p className="font-heading text-sm text-muted-foreground">{MONARCH_LABEL_PLURAL} Unlocked</p>
              <p className="font-display text-lg text-monarch-gold">{unlocks.length} / 2 Required</p>
            </div>
          </div>
          {canUnlockSovereign && (
            <Badge className="bg-arise-violet/20 text-arise-violet border-arise-violet/40 font-display animate-pulse-2s">
              <Star className="h-3 w-3 mr-1" />
              Sovereign Ready
            </Badge>
          )}
        </div>

        {unlocks.length > 0 && (
          <>
            <Separator className="bg-monarch-gold/20" />
            
            <div className="space-y-3">
              {unlocks.map((unlock, index) => {
                const monarch = unlock.monarch;
                if (!monarch) return null;
                
                const themeStyle = themeColors[monarch.theme] || themeColors['Shadow'];
                const icon = themeIcons[monarch.theme] || <Crown className="h-4 w-4" />;
                const displayTitle = formatMonarchVernacular(monarch.title || monarch.name);
                
                return (
                  <div
                    key={unlock.id}
                    className={cn(
                      "p-4 rounded-lg border transition-all duration-300",
                      themeStyle.border,
                      themeStyle.bg,
                      unlock.is_primary && themeStyle.glow,
                      index < 2 && "animate-arise"
                    )}
                    style={{ animationDelay: `${index * 0.15}s` }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-lg bg-card", themeStyle.text)}>
                          {icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={cn("font-heading font-semibold", themeStyle.text)}>
                              {displayTitle}
                            </span>
                            {unlock.is_primary && (
                              <Badge variant="outline" className="bg-monarch-gold/20 text-monarch-gold border-monarch-gold/40 text-xs">
                                <Star className="h-3 w-3 mr-1" />
                                Primary
                              </Badge>
                            )}
                          </div>
                          <Badge variant="outline" className={cn("text-xs mt-1", themeStyle.text, themeStyle.border)}>
                            {monarch.theme} Theme
                          </Badge>
                        </div>
                      </div>
                      
                      {!unlock.is_primary && unlocks.length > 1 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setPrimary.mutate({ characterId, unlockId: unlock.id })}
                          className="text-xs hover:bg-monarch-gold/10"
                        >
                          <Star className="h-3 w-3 mr-1" />
                          Set Primary
                        </Button>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Scroll className="h-3 w-3" />
                      <span>Quest: {formatMonarchVernacular(unlock.quest_name)}</span>
                    </div>
                    
                    {unlock.dm_notes && (
                      <p className="text-xs text-muted-foreground mt-2 italic border-l-2 border-monarch-gold/30 pl-2">
                        {formatMonarchVernacular(unlock.dm_notes)}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {unlocks.length === 0 && (
          <div className="text-center py-6">
            <Lock className="h-10 w-10 text-monarch-gold/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground font-heading">
              No {MONARCH_LABEL_PLURAL} unlocked yet
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Complete {MONARCH_LABEL} quests marked by your Warden to unlock divine power
            </p>
          </div>
        )}

        {/* Sovereign Status */}
        {canUnlockSovereign && (
          <div className="p-4 rounded-lg border border-arise-violet/40 bg-arise-violet/5">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-arise-violet" />
              <span className="font-display text-sm text-arise-violet tracking-wider">SOVEREIGN FUSION AVAILABLE</span>
            </div>
            <p className="text-xs text-muted-foreground">
              With two {MONARCH_LABEL_PLURAL} unlocked, use the <span className="text-arise-violet">Gemini Protocol</span> in the Compendium 
              to generate your unique Sovereign abilities.
            </p>
          </div>
        )}

        {/* Unlock New Monarch */}
        {lockedMonarchs.length > 0 && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full border-monarch-gold/40 hover:border-monarch-gold hover:bg-monarch-gold/10 font-display tracking-wider"
              >
                <Unlock className="h-4 w-4 mr-2 text-monarch-gold" />
                UNLOCK {MONARCH_LABEL.toUpperCase()} (Warden Approved)
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-monarch-gold/40">
              <DialogHeader>
                <DialogTitle className="font-display text-xl gradient-text-monarch">
                  Unlock {MONARCH_LABEL} Power
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-heading">Select {MONARCH_LABEL}</Label>
                  <Select value={selectedMonarchId} onValueChange={setSelectedMonarchId}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder={`Choose a ${MONARCH_LABEL}...`} />
                    </SelectTrigger>
                    <SelectContent>
                      <ScrollArea className="max-h-60">
                        {lockedMonarchs.map((monarch) => {
                          const themeStyle = themeColors[monarch.theme] || themeColors['Shadow'];
                          const displayTitle = formatMonarchVernacular(monarch.title || monarch.name);
                          return (
                            <SelectItem key={monarch.id} value={monarch.id}>
                              <div className="flex items-center gap-2">
                                <span className="font-heading">{displayTitle}</span>
                                <Badge variant="outline" className={cn("text-xs", themeStyle.text, themeStyle.border)}>
                                  {monarch.theme}
                                </Badge>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </ScrollArea>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="font-heading">Quest Name *</Label>
                  <Input
                    placeholder="e.g., Trial of the Shadow Throne"
                    value={questName}
                    onChange={(e) => setQuestName(e.target.value)}
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-heading">Warden Notes (optional)</Label>
                  <Textarea
                    placeholder="Notes about how the quest was completed..."
                    value={dmNotes}
                    onChange={(e) => setDmNotes(e.target.value)}
                    rows={3}
                    className="bg-background"
                  />
                </div>

                <Button
                  className="w-full font-display tracking-wider bg-monarch-gold hover:bg-monarch-gold/80 text-background"
                  onClick={handleUnlock}
                  disabled={!selectedMonarchId || !questName.trim() || unlockMonarch.isPending}
                >
                  <Crown className="h-4 w-4 mr-2" />
                  UNLOCK {MONARCH_LABEL.toUpperCase()} POWER
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </SystemWindow>
  );
}


