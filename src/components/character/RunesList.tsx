import { useState } from 'react';
import { BookOpen, Sparkles, AlertCircle, CheckCircle, XCircle, Zap, Shield, Scroll, Plus } from 'lucide-react';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCharacterRuneKnowledge, useCharacterRuneInscriptions, useRemoveRuneInscription, useToggleRuneActive } from '@/hooks/useRunes';
import { useCharacter } from '@/hooks/useCharacters';
import { useToast } from '@/hooks/use-toast';
import { InscribeRuneDialog } from './InscribeRuneDialog';
import { cn } from '@/lib/utils';
import type { Database } from '@/integrations/supabase/types';

type Rune = Database['public']['Tables']['compendium_runes']['Row'];
type RuneInscription = Database['public']['Tables']['character_rune_inscriptions']['Row'];

const RUNE_TYPE_COLORS: Record<string, string> = {
  martial: 'bg-red-500/20 text-red-400 border-red-500/30',
  caster: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  hybrid: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  utility: 'bg-green-500/20 text-green-400 border-green-500/30',
  defensive: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  offensive: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
};

const RUNE_TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  martial: Zap,
  caster: Scroll,
  hybrid: Sparkles,
  utility: BookOpen,
  defensive: Shield,
  offensive: Zap,
};

export function RunesList({ characterId }: { characterId: string }) {
  const { data: runeKnowledge = [] } = useCharacterRuneKnowledge(characterId);
  const { data: inscriptions = [] } = useCharacterRuneInscriptions(characterId);
  const { data: character } = useCharacter(characterId);
  const { toast } = useToast();
  const [inscribeDialogOpen, setInscribeDialogOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
  
  const removeInscription = useRemoveRuneInscription();
  const toggleActive = useToggleRuneActive();

  const handleRemoveInscription = async (inscriptionId: string, runeName: string) => {
    try {
      await removeInscription.mutateAsync({ inscriptionId });
      toast({
        title: 'Rune removed',
        description: `${runeName} has been removed from equipment.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove rune inscription.',
        variant: 'destructive',
      });
    }
  };

  const handleToggleActive = async (inscriptionId: string, isActive: boolean, runeName: string) => {
    try {
      await toggleActive.mutateAsync({ inscriptionId, isActive: !isActive });
      toast({
        title: isActive ? 'Rune deactivated' : 'Rune activated',
        description: `${runeName} has been ${isActive ? 'deactivated' : 'activated'}.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to toggle rune status.',
        variant: 'destructive',
      });
    }
  };

  const inscriptionsByEquipment = inscriptions.reduce((acc, ins) => {
    const equipName = ins.equipment?.name || 'Unknown';
    if (!acc[equipName]) acc[equipName] = [];
    acc[equipName].push(ins);
    return acc;
  }, {} as Record<string, Array<RuneInscription & { rune: Rune; equipment: Database['public']['Tables']['character_equipment']['Row'] }>>);

  return (
    <SystemWindow title="RUNES">
      <div className="space-y-4">
        {/* Rune Knowledge */}
        {runeKnowledge.length > 0 && (
          <div>
            <h3 className="text-sm font-heading text-muted-foreground mb-2">KNOWN RUNES</h3>
            <div className="flex flex-wrap gap-2">
              {runeKnowledge.map((rk) => {
                const Icon = RUNE_TYPE_ICONS[rk.rune.rune_type] || BookOpen;
                return (
                  <Badge
                    key={rk.id}
                    variant="outline"
                    className={cn(RUNE_TYPE_COLORS[rk.rune.rune_type] || '', 'gap-1')}
                  >
                    <Icon className="w-3 h-3" />
                    {rk.rune.name}
                    {rk.mastery_level && rk.mastery_level >= 3 && (
                      <CheckCircle className="w-3 h-3 text-amber-400" />
                    )}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        {/* Inscribed Runes */}
        {Object.keys(inscriptionsByEquipment).length > 0 && (
          <div>
            <h3 className="text-sm font-heading text-muted-foreground mb-2">INSCRIBED RUNES</h3>
            <div className="space-y-3">
              {Object.entries(inscriptionsByEquipment).map(([equipName, runes]) => (
                <div key={equipName} className="border border-primary/20 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-heading font-semibold text-sm">{equipName}</h4>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedEquipment(runes[0].equipment_id);
                        setInscribeDialogOpen(true);
                      }}
                      className="h-6 text-xs"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add Rune
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {runes.map((ins) => {
                      const Icon = RUNE_TYPE_ICONS[ins.rune.rune_type] || BookOpen;
                      return (
                        <Badge
                          key={ins.id}
                          variant={ins.is_active ? 'default' : 'secondary'}
                          className={cn(
                            'gap-1 cursor-pointer',
                            ins.is_active && RUNE_TYPE_COLORS[ins.rune.rune_type]
                          )}
                          onClick={() => handleToggleActive(ins.id, ins.is_active, ins.rune.name)}
                        >
                          <Icon className="w-3 h-3" />
                          {ins.rune.name}
                          {ins.is_active ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveInscription(ins.id, ins.rune.name);
                            }}
                            className="ml-1 hover:text-red-400"
                          >
                            ×
                          </button>
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No runes message */}
        {runeKnowledge.length === 0 && inscriptions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No runes learned or inscribed yet.</p>
            <p className="text-xs mt-1">Learn runes from the Compendium or inscribe them on equipment.</p>
          </div>
        )}

        {/* Inscribe Dialog */}
        {inscribeDialogOpen && selectedEquipment && (
          <InscribeRuneDialog
            characterId={characterId}
            equipmentId={selectedEquipment}
            open={inscribeDialogOpen}
            onOpenChange={setInscribeDialogOpen}
            onSuccess={() => setInscribeDialogOpen(false)}
          />
        )}
      </div>
    </SystemWindow>
  );
}

