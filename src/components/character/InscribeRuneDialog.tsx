import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCompendiumRunes, useCharacterRuneKnowledge, useInscribeRune, checkRuneRequirements } from '@/hooks/useRunes';
import { useCharacter } from '@/hooks/useCharacters';
import { useEquipment } from '@/hooks/useEquipment';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, AlertCircle, CheckCircle, Sparkles, Zap, Shield, Scroll } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatMonarchVernacular, normalizeMonarchSearch } from '@/lib/vernacular';

const RUNE_TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  martial: Zap,
  caster: Scroll,
  hybrid: Sparkles,
  utility: BookOpen,
  defensive: Shield,
  offensive: Zap,
};

interface InscribeRuneDialogProps {
  characterId: string;
  equipmentId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function InscribeRuneDialog({
  characterId,
  equipmentId,
  open,
  onOpenChange,
  onSuccess,
}: InscribeRuneDialogProps) {
  const { data: allRunes = [] } = useCompendiumRunes();
  const { data: knownRunes = [] } = useCharacterRuneKnowledge(characterId);
  const { data: character } = useCharacter(characterId);
  const { equipment } = useEquipment(characterId);
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRune, setSelectedRune] = useState<string | null>(null);
  const [inscribedBy, setInscribedBy] = useState('');

  const inscribeRune = useInscribeRune();

  // Get equipment details
  const targetEquipment = equipment.find(eq => eq.id === equipmentId);

  // Filter runes that can be inscribed on this equipment type
  const availableRunes = useMemo(() => {
    if (!targetEquipment) return [];

    const equipmentTypeMap: Record<string, string> = {
      weapon: 'weapon',
      armor: 'armor',
      relic: 'accessory',
      gear: 'accessory',
      consumable: 'accessory',
    };

    const equipType = equipmentTypeMap[targetEquipment.item_type || 'gear'] || 'universal';

    return allRunes.filter(rune => {
      // Check if can be inscribed on this equipment type
      if (!rune.can_inscribe_on?.includes(equipType) && !rune.can_inscribe_on?.includes('universal')) {
        return false;
      }

      // Filter by search
      const trimmedQuery = searchQuery.trim();
      if (trimmedQuery) {
        const canonicalQuery = normalizeMonarchSearch(trimmedQuery.toLowerCase());
        const runeName = normalizeMonarchSearch(rune.name.toLowerCase());
        if (!runeName.includes(canonicalQuery)) {
          return false;
        }
      }

      return true;
    });
  }, [allRunes, targetEquipment, searchQuery]);

  // Check requirements for selected rune
  const requirementCheck = useMemo(() => {
    if (!selectedRune || !character) return null;

    const rune = allRunes.find(r => r.id === selectedRune);
    if (!rune) return null;

    const abilities = character.abilities || {};
    return checkRuneRequirements(
      rune,
      abilities,
      character.job,
      character.level
    );
  }, [selectedRune, character, allRunes]);

  const handleInscribe = async () => {
    if (!selectedRune) return;

    try {
      await inscribeRune.mutateAsync({
        characterId,
        equipmentId,
        runeId: selectedRune,
        inscribedBy: inscribedBy.trim() || undefined,
        characterLevel: character?.level || 1,
      });

      toast({
        title: 'Rune inscribed',
        description: 'The rune has been successfully inscribed on the equipment.',
      });

      onSuccess();
      setSelectedRune(null);
      setSearchQuery('');
      setInscribedBy('');
    } catch (error) {
      toast({
        title: 'Inscription failed',
        description: error instanceof Error ? error.message : 'Failed to inscribe rune.',
        variant: 'destructive',
      });
    }
  };

  const selectedRuneData = allRunes.find(r => r.id === selectedRune);
  const displayTargetEquipment = targetEquipment
    ? formatMonarchVernacular(targetEquipment.name)
    : 'equipment';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Inscribe Rune</DialogTitle>
          <DialogDescription>
            Select a rune to inscribe on {displayTargetEquipment}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div>
            <Label>Search Runes</Label>
            <Input
              placeholder="Search by name, type, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Rune List */}
          <ScrollArea className="h-[300px] border rounded-lg p-4">
            <div className="space-y-2">
              {availableRunes.map((rune) => {
                const Icon = RUNE_TYPE_ICONS[rune.rune_type] || BookOpen;
                const isKnown = knownRunes.some(kr => kr.rune_id === rune.id);
                const isSelected = selectedRune === rune.id;
                const displayName = formatMonarchVernacular(rune.name);
                const displayDescription = rune.description ? formatMonarchVernacular(rune.description) : '';
                const displayRarity = rune.rarity ? formatMonarchVernacular(rune.rarity) : '';
                const displayType = formatMonarchVernacular(rune.rune_type);
                const displayCategory = rune.rune_category ? formatMonarchVernacular(rune.rune_category) : '';

                return (
                  <button
                    key={rune.id}
                    type="button"
                    className={cn(
                      'border rounded-lg p-3 cursor-pointer transition-colors text-left w-full',
                      isSelected ? 'border-primary bg-primary/10' : 'border-primary/20 hover:border-primary/50',
                      !isKnown && 'opacity-75'
                    )}
                    onClick={() => setSelectedRune(rune.id)}
                    aria-pressed={isSelected}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2 flex-1">
                        <Icon className="w-5 h-5 mt-0.5 text-primary" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-heading font-semibold">{displayName}</h4>
                            {isKnown && <Badge variant="outline" className="text-xs">Known</Badge>}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              Level {rune.rune_level} {displayRarity}
                            </Badge>
                            <Badge variant="outline" className="text-xs">{displayType}</Badge>
                            {displayCategory && (
                              <Badge variant="outline" className="text-xs">{displayCategory}</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {displayDescription}
                          </p>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}

              {availableRunes.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No runes available for this equipment type.</p>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Selected Rune Details */}
          {selectedRuneData && requirementCheck && (
            <div className="border rounded-lg p-4 space-y-3">
              <h4 className="font-heading font-semibold">
                {formatMonarchVernacular(selectedRuneData.name)}
              </h4>
              
              {/* Requirements Check */}
              {requirementCheck.canUse ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    You meet all requirements to use this rune.
                    {requirementCheck.penalties.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-semibold">Cross-Learning Penalties:</p>
                        <ul className="text-xs list-disc list-inside mt-1">
                          {requirementCheck.penalties.map((penalty, i) => (
                            <li key={i}>{formatMonarchVernacular(penalty)}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {requirementCheck.penalties.map(formatMonarchVernacular).join(', ')}
                  </AlertDescription>
                </Alert>
              )}

              {/* Rune Details */}
              <div className="text-sm space-y-2">
                <div>
                  <span className="font-semibold">Effect: </span>
                  <span className="text-muted-foreground">
                    {formatMonarchVernacular(selectedRuneData.effect_description || '')}
                  </span>
                </div>
                {selectedRuneData.activation_action && (
                  <div>
                    <span className="font-semibold">Activation: </span>
                    <span className="text-muted-foreground">
                      {formatMonarchVernacular(selectedRuneData.activation_action)} 
                      {selectedRuneData.activation_cost &&
                        ` (${formatMonarchVernacular(selectedRuneData.activation_cost)})`}
                    </span>
                  </div>
                )}
              </div>

              {/* Inscribed By (optional) */}
              <div>
                <Label htmlFor="inscribed-by">Inscribed By (optional)</Label>
                <Input
                  id="inscribed-by"
                  placeholder="Your name, NPC name, or leave blank"
                  value={inscribedBy}
                  onChange={(e) => setInscribedBy(e.target.value)}
                />
              </div>

              {/* Inscribe Button */}
              <Button
                onClick={handleInscribe}
                disabled={!requirementCheck.canUse || inscribeRune.isPending}
                className="w-full"
              >
                {inscribeRune.isPending ? 'Inscribing...' : 'Inscribe Rune'}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

