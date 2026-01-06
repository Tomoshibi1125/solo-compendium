import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  Heart, 
  Shield, 
  Zap, 
  Swords, 
  Wand2, 
  Package, 
  AlertCircle,
  Moon,
  Sun,
  Loader2,
  Edit,
  Plus,
  Download,
  Dice6,
  Share2,
  Copy,
  Check,
  Undo2,
  Redo2
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCharacter, useUpdateCharacter, useGenerateShareToken } from '@/hooks/useCharacters';
import { calculateCharacterStats, formatModifier } from '@/lib/characterCalculations';
import { applyEquipmentModifiers } from '@/lib/equipmentModifiers';
import { applyRuneBonuses } from '@/lib/runeAutomation';
import { calculateEncumbrance, calculateTotalWeight, calculateCarryingCapacity } from '@/lib/encumbrance';
import { useCharacterRuneInscriptions } from '@/hooks/useRunes';
import { getAllSkills, calculateSkillModifier, calculatePassiveSkill } from '@/lib/skills';
import { rollDiceString, formatRollResult } from '@/lib/diceRoller';
import { EquipmentList } from '@/components/character/EquipmentList';
import { CurrencyManager } from '@/components/character/CurrencyManager';
import { PowersList } from '@/components/character/PowersList';
import { RunesList } from '@/components/character/RunesList';
import { SpellSlotsDisplay } from '@/components/character/SpellSlotsDisplay';
import { ActionsList } from '@/components/character/ActionsList';
import { FeaturesList } from '@/components/character/FeaturesList';
import { ExportDialog } from '@/components/character/ExportDialog';
import { PortraitUpload } from '@/components/character/PortraitUpload';
import { MonarchUnlocksPanel } from '@/components/character/MonarchUnlocksPanel';
import { ShadowSoldiersPanel } from '@/components/character/ShadowSoldiersPanel';
import { JournalPanel } from '@/components/character/JournalPanel';
import { CharacterEditDialog } from '@/components/character/CharacterEditDialog';
import { useCharacterUndoRedo } from '@/hooks/useCharacterUndoRedo';
import { ABILITY_NAMES, type AbilityScore } from '@/types/solo-leveling';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useEquipment } from '@/hooks/useEquipment';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RichTextNotes } from '@/components/character/RichTextNotes';

const CharacterSheet = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const isPrintMode = searchParams.get('print') === 'true';
  const shareToken = searchParams.get('token') || undefined;
  const isReadOnly = !!shareToken;
  const { data: character, isLoading } = useCharacter(id || '', shareToken);
  const updateCharacter = useUpdateCharacter();
  const generateShareToken = useGenerateShareToken();
  const { equipment } = useEquipment(id || '');
  const [hpEditOpen, setHpEditOpen] = useState(false);
  const [hpEditValue, setHpEditValue] = useState('');
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const undoRedo = useCharacterUndoRedo(character);

  const shareLink = character?.share_token 
    ? `${window.location.origin}/characters/${character.id}?token=${character.share_token}`
    : null;

  const handleGenerateShareLink = async () => {
    if (!character) return;
    try {
      await generateShareToken.mutateAsync(character.id);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleCopyShareLink = async () => {
    if (!shareLink) return;
    try {
      await navigator.clipboard.writeText(shareLink);
      setShareLinkCopied(true);
      toast({
        title: 'Link copied',
        description: 'Share link copied to clipboard.',
      });
      setTimeout(() => setShareLinkCopied(false), 2000);
    } catch (error) {
      toast({
        title: 'Failed to copy',
        description: 'Could not copy link to clipboard.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-48" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-32 w-full" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
                <Skeleton className="h-64 w-full" />
              </div>
              <div className="space-y-6">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!character) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <SystemWindow title="HUNTER NOT FOUND" className="max-w-lg mx-auto">
            <p className="text-muted-foreground mb-4">The Hunter you're looking for doesn't exist or you don't have access to it.</p>
            <Button onClick={() => navigate('/characters')}>Back to Hunters</Button>
          </SystemWindow>
        </div>
      </Layout>
    );
  }

  const baseStats = calculateCharacterStats({
    level: character.level,
    abilities: character.abilities,
    savingThrowProficiencies: character.saving_throw_proficiencies || [],
    skillProficiencies: character.skill_proficiencies || [],
    skillExpertise: character.skill_expertise || [],
    armorClass: character.armor_class,
    speed: character.speed,
  });

  // Apply equipment modifiers
  const equipmentMods = applyEquipmentModifiers(
    baseStats.armorClass,
    character.speed,
    character.abilities,
    equipment
  );

  // Combine ability modifiers from equipment
  const equipmentModifiedAbilities = { ...character.abilities };
  Object.entries(equipmentMods.abilityModifiers || {}).forEach(([key, value]) => {
    if (value !== 0) {
      const ability = key.toUpperCase() as keyof typeof equipmentModifiedAbilities;
      if (ability in equipmentModifiedAbilities) {
        equipmentModifiedAbilities[ability] = (equipmentModifiedAbilities[ability] || 0) + value;
      }
    }
  });

  // Apply rune bonuses from equipped items
  const { data: activeRunes = [] } = useCharacterRuneInscriptions(character.id);
  const equippedActiveRunes = activeRunes.filter(ri => 
    ri.equipment?.is_equipped && 
    (!ri.equipment.requires_attunement || ri.equipment.is_attuned) &&
    ri.is_active
  );
  
  const runeBonuses = applyRuneBonuses(
    {
      ac: equipmentMods.armorClass,
      speed: equipmentMods.speed,
      abilities: equipmentModifiedAbilities,
      attackBonus: equipmentMods.attackBonus,
      damageBonus: typeof equipmentMods.damageBonus === 'number' 
        ? (equipmentMods.damageBonus > 0 ? `+${equipmentMods.damageBonus}` : '') 
        : (equipmentMods.damageBonus || ''),
    },
    equippedActiveRunes.map(ri => ({ rune: ri.rune, is_active: ri.is_active }))
  );

  // Final abilities with all modifiers
  const finalAbilities = { ...equipmentModifiedAbilities };
  Object.entries(runeBonuses.abilities).forEach(([ability, value]) => {
    if (ability in finalAbilities && value > (equipmentModifiedAbilities[ability as keyof typeof equipmentModifiedAbilities] || 0)) {
      finalAbilities[ability as keyof typeof finalAbilities] = value;
    }
  });

  // Recalculate base stats with modified abilities
  const modifiedBaseStats = calculateCharacterStats({
    level: character.level,
    abilities: finalAbilities,
    savingThrowProficiencies: character.saving_throw_proficiencies || [],
    skillProficiencies: character.skill_proficiencies || [],
    skillExpertise: character.skill_expertise || [],
    armorClass: character.armor_class,
    speed: character.speed,
  });

  // Recalculate saving throws with modified abilities
  const finalSavingThrows: Record<AbilityScore, number> = {
    STR: getAbilityModifier(finalAbilities.STR) + (character.saving_throw_proficiencies?.includes('STR') ? modifiedBaseStats.proficiencyBonus : 0),
    AGI: getAbilityModifier(finalAbilities.AGI) + (character.saving_throw_proficiencies?.includes('AGI') ? modifiedBaseStats.proficiencyBonus : 0),
    VIT: getAbilityModifier(finalAbilities.VIT) + (character.saving_throw_proficiencies?.includes('VIT') ? modifiedBaseStats.proficiencyBonus : 0),
    INT: getAbilityModifier(finalAbilities.INT) + (character.saving_throw_proficiencies?.includes('INT') ? modifiedBaseStats.proficiencyBonus : 0),
    SENSE: getAbilityModifier(finalAbilities.SENSE) + (character.saving_throw_proficiencies?.includes('SENSE') ? modifiedBaseStats.proficiencyBonus : 0),
    PRE: getAbilityModifier(finalAbilities.PRE) + (character.saving_throw_proficiencies?.includes('PRE') ? modifiedBaseStats.proficiencyBonus : 0),
  };

  // Calculate encumbrance
  const totalWeight = calculateTotalWeight(equipment);
  const carryingCapacity = calculateCarryingCapacity(finalAbilities.STR);
  const encumbrance = calculateEncumbrance(totalWeight, carryingCapacity);
  
  // Apply speed penalty from encumbrance
  let finalSpeed = runeBonuses.speed;
  if (encumbrance.status === 'heavy') {
    finalSpeed = Math.max(0, finalSpeed - 10);
  } else if (encumbrance.status === 'overloaded') {
    finalSpeed = Math.max(0, finalSpeed - 20);
  }

  const calculatedStats = {
    ...modifiedBaseStats,
    savingThrows: finalSavingThrows,
    armorClass: runeBonuses.ac,
    speed: finalSpeed,
    encumbrance,
  };

  // Calculate skills with modified abilities
  const allSkills = getAllSkills();
  const skills = allSkills.reduce((acc, skill) => {
    acc[skill.name] = {
      modifier: calculateSkillModifier(
        skill.name,
        finalAbilities,
        character.skill_proficiencies || [],
        character.skill_expertise || [],
        calculatedStats.proficiencyBonus
      ),
      passive: calculatePassiveSkill(
        skill.name,
        finalAbilities,
        character.skill_proficiencies || [],
        character.skill_expertise || [],
        calculatedStats.proficiencyBonus
      ),
      ability: skill.ability,
      proficient: (character.skill_proficiencies || []).includes(skill.name),
      expertise: (character.skill_expertise || []).includes(skill.name),
    };
    return acc;
  }, {} as Record<string, {
    modifier: number;
    passive: number;
    ability: AbilityScore;
    proficient: boolean;
    expertise: boolean;
  }>);

  const handleShortRest = async () => {
    try {
      const { executeShortRest } = await import('@/lib/restSystem');
      await executeShortRest(character.id);

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['character', character.id] });
      queryClient.invalidateQueries({ queryKey: ['features', character.id] });

      toast({
        title: 'Short rest completed',
        description: 'Hit dice restored. Short-rest features recharged.',
      });
    } catch (error) {
      toast({
        title: 'Failed to rest',
        description: 'Could not complete short rest.',
        variant: 'destructive',
      });
    }
  };

  const handleLongRest = async () => {
    try {
      const { executeLongRest } = await import('@/lib/restSystem');
      await executeLongRest(character.id);

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['character', character.id] });
      queryClient.invalidateQueries({ queryKey: ['features', character.id] });

      toast({
        title: 'Long rest completed',
        description: 'All resources restored. Features recharged. Exhaustion reduced by 1.',
      });
    } catch (error) {
      toast({
        title: 'Failed to rest',
        description: 'Could not complete long rest.',
        variant: 'destructive',
      });
    }
  };

  const handleHPChange = async () => {
    const newHP = parseInt(hpEditValue);
    if (isNaN(newHP) || newHP < 0) {
      toast({
        title: 'Invalid HP',
        description: 'Please enter a valid number.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await updateCharacter.mutateAsync({
        id: character.id,
        data: {
          hp_current: Math.min(newHP, character.hp_max + (character.hp_temp || 0)),
        },
      });
      setHpEditOpen(false);
      setHpEditValue('');
    } catch (error) {
      toast({
        title: 'Failed to update HP',
        description: 'Could not update hit points.',
        variant: 'destructive',
      });
    }
  };

  // Apply print mode styling
  useEffect(() => {
    if (isPrintMode) {
      document.body.classList.add('print-mode');
      // Trigger print dialog after a short delay
      setTimeout(() => {
        window.print();
      }, 500);
    } else {
      document.body.classList.remove('print-mode');
    }
    return () => {
      document.body.classList.remove('print-mode');
    };
  }, [isPrintMode]);

  return (
    <Layout className={isPrintMode ? 'print-mode' : ''}>
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/characters')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Characters
          </Button>
          {!isReadOnly && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  const previousState = undoRedo.undo();
                  if (previousState && character) {
                    updateCharacter.mutate({
                      id: character.id,
                      data: {
                        name: previousState.name,
                        appearance: previousState.appearance,
                        backstory: previousState.backstory,
                        notes: previousState.notes,
                      },
                    });
                    toast({
                      title: 'Undone',
                      description: 'Previous change restored.',
                    });
                  }
                }}
                disabled={!undoRedo.canUndo()}
                className="gap-2"
                aria-label="Undo"
                title="Undo (Ctrl+Z)"
              >
                <Undo2 className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  const nextState = undoRedo.redo();
                  if (nextState && character) {
                    updateCharacter.mutate({
                      id: character.id,
                      data: {
                        name: nextState.name,
                        appearance: nextState.appearance,
                        backstory: nextState.backstory,
                        notes: nextState.notes,
                      },
                    });
                    toast({
                      title: 'Redone',
                      description: 'Change restored.',
                    });
                  }
                }}
                disabled={!undoRedo.canRedo()}
                className="gap-2"
                aria-label="Redo"
                title="Redo (Ctrl+Y)"
              >
                <Redo2 className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => setShareDialogOpen(true)}
                className="gap-2"
                aria-label="Share character"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button
                variant="outline"
                onClick={() => setExportDialogOpen(true)}
                className="gap-2"
                aria-label="Export character"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditDialogOpen(true)}
                className="gap-2"
                aria-label="Edit character"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Button>
            </div>
          )}
          {isReadOnly && (
            <Badge variant="secondary" className="gap-2">
              <Share2 className="w-3 h-3" />
              Read-Only View
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Character Info */}
            <SystemWindow title={character.name.toUpperCase()} className="border-primary/50">
              {character.portrait_url && (
                <div className="mb-4 flex justify-center">
                  <img
                    src={character.portrait_url}
                    alt={character.name}
                    className="w-32 h-32 rounded-lg object-cover border border-primary/30"
                  />
                </div>
              )}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <span className="text-xs text-muted-foreground block">Level</span>
                  <span className="font-display text-2xl font-bold">{character.level}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Job</span>
                  <span className="font-heading">{character.job || 'Unassigned'}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Path</span>
                  <span className="font-heading">{character.path || 'None'}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Background</span>
                  <span className="font-heading">{character.background || 'None'}</span>
                </div>
              </div>
            </SystemWindow>

            {/* Core Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <SystemWindow title="HIT POINTS" compact>
                <div className="flex items-center justify-between mb-2">
                  <Heart className={cn(
                    "w-6 h-6",
                    character.hp_current < character.hp_max * 0.25 ? "text-destructive" :
                    character.hp_current < character.hp_max * 0.5 ? "text-orange-400" :
                    "text-red-400"
                  )} />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => {
                      setHpEditValue(character.hp_current.toString());
                      setHpEditOpen(true);
                    }}
                    aria-label="Edit hit points"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                </div>
                <div className="text-center">
                  <div className={cn(
                    "font-display text-3xl font-bold mb-1",
                    character.hp_current < character.hp_max * 0.5 && "text-destructive"
                  )}>
                    {character.hp_current}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    / {character.hp_max}
                    {character.hp_temp > 0 && ` + ${character.hp_temp} temp`}
                  </div>
                </div>
              </SystemWindow>

              <SystemWindow title="ARMOR CLASS" compact>
                <Shield className="w-6 h-6 text-blue-400 mb-2" />
                <div className="font-display text-3xl font-bold text-center">{calculatedStats.armorClass}</div>
                {equipmentMods.armorClass !== baseStats.armorClass && (
                  <div className="text-xs text-muted-foreground">
                    Base: {baseStats.armorClass} + {equipmentMods.armorClass - baseStats.armorClass}
                  </div>
                )}
              </SystemWindow>

              <SystemWindow title="INITIATIVE" compact>
                <Zap className="w-6 h-6 text-yellow-400 mb-2" />
                <div className="font-display text-3xl font-bold text-center">
                  {formatModifier(calculatedStats.initiative)}
                </div>
              </SystemWindow>

              <SystemWindow title="SPEED" compact>
                <Swords className="w-6 h-6 text-green-400 mb-2" />
                <div className="font-display text-3xl font-bold text-center">{calculatedStats.speed} ft</div>
                {calculatedStats.encumbrance && calculatedStats.encumbrance.status !== 'unencumbered' && (
                  <div className={cn(
                    "text-xs",
                    calculatedStats.encumbrance.status === 'overloaded' ? "text-destructive" :
                    calculatedStats.encumbrance.status === 'heavy' ? "text-orange-400" :
                    "text-muted-foreground"
                  )}>
                    {calculatedStats.encumbrance.status === 'heavy' && '-10 ft (Heavy Load)'}
                    {calculatedStats.encumbrance.status === 'overloaded' && '-20 ft (Overloaded)'}
                  </div>
                )}
                {equipmentMods.speed !== character.speed && !calculatedStats.encumbrance && (
                  <div className="text-xs text-muted-foreground">
                    Base: {character.speed} + {equipmentMods.speed - character.speed}
                  </div>
                )}
              </SystemWindow>
            </div>

            {/* Encumbrance Status */}
            {calculatedStats.encumbrance && (
              <SystemWindow title="CARRYING CAPACITY">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge 
                      variant={
                        calculatedStats.encumbrance.status === 'overloaded' ? 'destructive' :
                        calculatedStats.encumbrance.status === 'heavy' ? 'destructive' :
                        calculatedStats.encumbrance.status === 'medium' ? 'secondary' :
                        'default'
                      }
                    >
                      {calculatedStats.encumbrance.statusMessage}
                    </Badge>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full transition-all",
                        calculatedStats.encumbrance.status === 'unencumbered' && "bg-green-500",
                        calculatedStats.encumbrance.status === 'light' && "bg-blue-500",
                        calculatedStats.encumbrance.status === 'medium' && "bg-yellow-500",
                        calculatedStats.encumbrance.status === 'heavy' && "bg-orange-500",
                        calculatedStats.encumbrance.status === 'overloaded' && "bg-red-500"
                      )}
                      style={{
                        width: `${Math.min((calculatedStats.encumbrance.totalWeight / calculatedStats.encumbrance.carryingCapacity) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {calculatedStats.encumbrance.totalWeight.toFixed(1)} / {calculatedStats.encumbrance.carryingCapacity} lbs
                    </span>
                    {calculatedStats.encumbrance.status === 'heavy' && (
                      <span className="text-orange-400">Speed -10 ft</span>
                    )}
                    {calculatedStats.encumbrance.status === 'overloaded' && (
                      <span className="text-destructive">Speed -20 ft</span>
                    )}
                  </div>
                </div>
              </SystemWindow>
            )}

            {/* Ability Scores */}
            <SystemWindow title="ABILITY SCORES">
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {(Object.keys(ABILITY_NAMES) as AbilityScore[]).map((ability) => {
                  const baseScore = character.abilities[ability];
                  const equipmentBonus = equipmentMods.abilityModifiers[ability.toLowerCase() as keyof typeof equipmentMods.abilityModifiers] || 0;
                  const totalScore = baseScore + equipmentBonus;
                  const modifier = calculatedStats.abilityModifiers[ability];
                  const isProficient = character.saving_throw_proficiencies?.includes(ability);
                  
                  return (
                    <div key={ability} className="text-center">
                      <div className="text-xs text-muted-foreground mb-1">{ABILITY_NAMES[ability]}</div>
                      <div className="font-display text-2xl font-bold mb-1">
                        {totalScore}
                        {equipmentBonus !== 0 && (
                          <span className={cn(
                            "text-xs ml-1",
                            equipmentBonus > 0 ? "text-green-400" : "text-red-400"
                          )}>
                            ({equipmentBonus > 0 ? '+' : ''}{equipmentBonus})
                          </span>
                        )}
                      </div>
                      <div className={cn(
                        "text-sm font-heading",
                        modifier >= 0 ? "text-green-400" : "text-red-400"
                      )}>
                        {formatModifier(modifier)}
                      </div>
                      {isProficient && (
                        <Badge variant="secondary" className="mt-1 text-xs">Prof</Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </SystemWindow>

            {/* Saving Throws */}
            <SystemWindow title="SAVING THROWS">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {(Object.keys(ABILITY_NAMES) as AbilityScore[]).map((ability) => {
                  const save = calculatedStats.savingThrows[ability];
                  const isProficient = character.saving_throw_proficiencies?.includes(ability);
                  
                  return (
                    <div key={ability} className="flex items-center justify-between p-2 rounded bg-muted/30">
                      <span className="text-sm font-heading">{ABILITY_NAMES[ability]}</span>
                      <div className="flex items-center gap-2">
                        {isProficient && <Badge variant="secondary" className="text-xs">P</Badge>}
                        <span className={cn(
                          "font-display font-bold",
                          save >= 0 ? "text-green-400" : "text-red-400"
                        )}>
                          {formatModifier(save)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </SystemWindow>

            {/* Resources */}
            <div className="grid grid-cols-2 gap-4">
              <SystemWindow title="HIT DICE" compact>
                <div className="text-center">
                  <div className="font-display text-2xl font-bold">
                    {character.hit_dice_current}/{character.hit_dice_max}
                  </div>
                  <div className="text-xs text-muted-foreground">d{character.hit_dice_size}</div>
                </div>
              </SystemWindow>

              <SystemWindow title="SYSTEM FAVOR" compact>
                <div className="text-center">
                  <div className="font-display text-2xl font-bold">
                    {character.system_favor_current}/{character.system_favor_max}
                  </div>
                  <div className="text-xs text-muted-foreground">d{character.system_favor_die}</div>
                </div>
              </SystemWindow>
            </div>

            {/* Conditions */}
            {character.conditions && character.conditions.length > 0 && (
              <SystemWindow title="CONDITIONS" variant="alert">
                <div className="flex flex-wrap gap-2">
                  {character.conditions.map((condition) => (
                    <Badge key={condition} variant="destructive">{condition}</Badge>
                  ))}
                </div>
              </SystemWindow>
            )}

            {/* Actions */}
            <div className="grid grid-cols-3 gap-4">
              <Button
                variant="outline"
                onClick={handleShortRest}
                className="gap-2"
                disabled={updateCharacter.isPending}
              >
                <Moon className="w-4 h-4" />
                Short Rest
              </Button>
              <Button
                variant="outline"
                onClick={handleLongRest}
                className="gap-2"
                disabled={updateCharacter.isPending}
              >
                <Sun className="w-4 h-4" />
                Long Rest
              </Button>
              {character.level < 20 && (
                <Button
                  variant="default"
                  onClick={() => navigate(`/characters/${character.id}/level-up`)}
                  className="gap-2"
                >
                  <Zap className="w-4 h-4" />
                  Level Up
                </Button>
              )}
            </div>
          </div>

          {/* Right Column - Secondary Info */}
          <div className="space-y-6">
            {/* Proficiencies */}
            <SystemWindow title="PROFICIENCIES">
              <div className="space-y-3">
                {character.armor_proficiencies && character.armor_proficiencies.length > 0 && (
                  <div>
                    <span className="text-xs text-muted-foreground block mb-1">Armor</span>
                    <div className="flex flex-wrap gap-1">
                      {character.armor_proficiencies.map((prof) => (
                        <Badge key={prof} variant="secondary" className="text-xs">{prof}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {character.weapon_proficiencies && character.weapon_proficiencies.length > 0 && (
                  <div>
                    <span className="text-xs text-muted-foreground block mb-1">Weapons</span>
                    <div className="flex flex-wrap gap-1">
                      {character.weapon_proficiencies.map((prof) => (
                        <Badge key={prof} variant="secondary" className="text-xs">{prof}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {character.tool_proficiencies && character.tool_proficiencies.length > 0 && (
                  <div>
                    <span className="text-xs text-muted-foreground block mb-1">Tools</span>
                    <div className="flex flex-wrap gap-1">
                      {character.tool_proficiencies.map((prof) => (
                        <Badge key={prof} variant="secondary" className="text-xs">{prof}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {character.skill_proficiencies && character.skill_proficiencies.length > 0 && (
                  <div>
                    <span className="text-xs text-muted-foreground block mb-1">Skills</span>
                    <div className="flex flex-wrap gap-1">
                      {character.skill_proficiencies.map((prof) => (
                        <Badge key={prof} variant="secondary" className="text-xs">{prof}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </SystemWindow>

            {/* Skills */}
            <SystemWindow title="SKILLS">
              <div className="space-y-1 max-h-[400px] overflow-y-auto">
                {Object.entries(skills).map(([skillName, skill]) => {
                  const handleSkillRoll = () => {
                    const roll = rollDiceString(`1d20${skill.modifier >= 0 ? '+' : ''}${skill.modifier}`);
                    const message = `${skillName} Check: ${formatRollResult(roll)}`;
                    toast({
                      title: 'Skill Check',
                      description: message,
                    });
                  };

                  return (
                    <div
                      key={skillName}
                      className="flex items-center justify-between p-2 rounded bg-muted/30 text-sm hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <span className="font-heading">{skillName}</span>
                        <span className="text-xs text-muted-foreground">({ABILITY_NAMES[skill.ability]})</span>
                        {skill.expertise && <Badge variant="default" className="text-xs">E</Badge>}
                        {skill.proficient && !skill.expertise && <Badge variant="secondary" className="text-xs">P</Badge>}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">Passive: {skill.passive}</span>
                        <span className={cn(
                          "font-display font-bold min-w-[3rem] text-right",
                          skill.modifier >= 0 ? "text-green-400" : "text-red-400"
                        )}>
                          {formatModifier(skill.modifier)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleSkillRoll}
                          className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          title={`Roll ${skillName} check`}
                        >
                          <Dice6 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </SystemWindow>

            {/* Actions */}
            <ActionsList characterId={character.id} />

            {/* Features */}
            <FeaturesList characterId={character.id} />

            {/* Equipment */}
            <EquipmentList characterId={character.id} />

            {/* Currency */}
            <CurrencyManager characterId={character.id} />

            {/* Spell Slots */}
            <SpellSlotsDisplay 
              characterId={character.id} 
              job={character.job}
              level={character.level}
            />

            {/* Powers */}
            <PowersList characterId={character.id} />

            {/* Runes */}
            <RunesList characterId={character.id} />

            {/* Monarch Unlocks */}
            <MonarchUnlocksPanel characterId={character.id} />

            {/* Shadow Soldiers */}
            <ShadowSoldiersPanel characterId={character.id} characterLevel={character.level} />

            {/* Portrait Upload */}
            <SystemWindow title="PORTRAIT">
              <PortraitUpload
                characterId={character.id}
                currentPortraitUrl={character.portrait_url}
                onUploadComplete={() => {
                  // Refresh character data
                  window.location.reload();
                }}
              />
            </SystemWindow>

            {/* Notes */}
            <SystemWindow title="NOTES">
              <div className="space-y-2">
                <RichTextNotes
                  value={character.notes || ''}
                  onChange={async (newValue) => {
                    // Auto-save with debounce
                    if (notesSaveTimeoutRef.current) {
                      clearTimeout(notesSaveTimeoutRef.current);
                    }
                    notesSaveTimeoutRef.current = setTimeout(async () => {
                      try {
                        await updateCharacter.mutateAsync({
                          id: character.id,
                          data: { notes: newValue },
                        });
                      } catch (error) {
                        toast({
                          title: 'Failed to save',
                          description: 'Could not update notes.',
                          variant: 'destructive',
                        });
                      }
                    }, 1000);
                  }}
                  disabled={isReadOnly}
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Auto-saves after 1 second of inactivity</span>
                  <span>{(character.notes || '').length} characters</span>
                </div>
              </div>
            </SystemWindow>
          </div>
        </div>
      </div>

      {/* HP Edit Dialog */}
      <Dialog open={hpEditOpen} onOpenChange={setHpEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Hit Points</DialogTitle>
            <DialogDescription>
              Set the character's current hit points (max: {character.hp_max + (character.hp_temp || 0)})
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="hp">Current HP</Label>
              <Input
                id="hp"
                type="number"
                value={hpEditValue}
                onChange={(e) => setHpEditValue(e.target.value)}
                min={0}
                max={character.hp_max + (character.hp_temp || 0)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setHpEditOpen(false)}>Cancel</Button>
            <Button onClick={handleHPChange}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <ExportDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        character={character}
      />

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Character</DialogTitle>
            <DialogDescription>
              Generate a shareable link to let others view your character (read-only).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {!shareLink ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  No share link generated yet. Click the button below to create one.
                </p>
                <Button
                  onClick={handleGenerateShareLink}
                  disabled={generateShareToken.isPending}
                  className="w-full"
                >
                  {generateShareToken.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 mr-2" />
                      Generate Share Link
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Share Link</Label>
                <div className="flex gap-2">
                  <Input
                    value={shareLink}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopyShareLink}
                    aria-label="Copy share link"
                  >
                    {shareLinkCopied ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Anyone with this link can view your character in read-only mode.
                </p>
                <Button
                  variant="outline"
                  onClick={handleGenerateShareLink}
                  disabled={generateShareToken.isPending}
                  className="w-full"
                >
                  {generateShareToken.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Regenerating...
                    </>
                  ) : (
                    'Regenerate Link'
                  )}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Character Edit Dialog */}
      <CharacterEditDialog
        character={character}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onStateChange={(updatedState) => {
          if (character) {
            undoRedo.pushState(updatedState, 'Character edited');
          }
        }}
      />
    </Layout>
  );
};

export default CharacterSheet;

