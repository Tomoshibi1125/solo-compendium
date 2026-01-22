import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  Heart, 
  Shield, 
  Zap, 
  Swords, 
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
  Redo2,
  SlidersHorizontal,
  Trash2
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCharacter, useUpdateCharacter, useGenerateShareToken } from '@/hooks/useCharacters';
import { useUpdateCharacterAbilities } from '@/hooks/useCharacterAbilities';
import { useCharacterSheetState } from '@/hooks/useCharacterSheetState';
import { useRecordRoll } from '@/hooks/useRollHistory';
import { calculateCharacterStats, formatModifier } from '@/lib/characterCalculations';
import { getAbilityModifier } from '@/types/system-rules';
import { applyEquipmentModifiers } from '@/lib/equipmentModifiers';
import { applyRuneBonuses } from '@/lib/runeAutomation';
import { getActiveConditionEffects, getAllConditions } from '@/lib/conditions';
import { calculateEncumbrance, calculateTotalWeight, calculateCarryingCapacity } from '@/lib/encumbrance';
import { useCharacterRuneInscriptions } from '@/hooks/useRunes';
import { getAllSkills, calculateSkillModifier } from '@/lib/skills';
import { rollDiceString, formatRollResult } from '@/lib/diceRoller';
import { calculateTotalTempHP, addTemporaryHP, applyResourceRest, type CustomResource } from '@/lib/characterResources';
import { sumCustomModifiers, type CustomModifier, CUSTOM_MODIFIER_TYPES } from '@/lib/customModifiers';
import { EquipmentList } from '@/components/character/EquipmentList';
import { CurrencyManager } from '@/components/character/CurrencyManager';
import { PowersList } from '@/components/character/PowersList';
import { RunesList } from '@/components/character/RunesList';
import { SpellSlotsDisplay } from '@/components/character/SpellSlotsDisplay';
import { ActionsList } from '@/components/character/ActionsList';
import { FeaturesList } from '@/components/character/FeaturesList';
import { RollHistoryPanel } from '@/components/character/RollHistoryPanel';
import { ExportDialog } from '@/components/character/ExportDialog';
import { PortraitUpload } from '@/components/character/PortraitUpload';
import { CharacterLevelUp } from '@/components/CharacterLevelUp';
import { MonarchUnlocksPanel } from '@/components/character/MonarchUnlocksPanel';
import { MONARCH_LABEL, formatMonarchVernacular } from '@/lib/vernacular';
import { ShadowSoldiersPanel } from '@/components/character/ShadowSoldiersPanel';
import { CharacterEditDialog } from '@/components/character/CharacterEditDialog';
import { useCharacterUndoRedo } from '@/hooks/useCharacterUndoRedo';
import { ABILITY_NAMES, type AbilityScore } from '@/types/system-rules';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useEquipment } from '@/hooks/useEquipment';
import { isLocalCharacterId } from '@/lib/guestStore';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { useCampaignByCharacterId } from '@/hooks/useCampaigns';
import { getLevelingMode } from '@/lib/campaignSettings';
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
import { RichTextNotes } from '@/components/character/RichTextNotes';
import { CharacterResourcesPanel } from '@/components/character/CharacterResourcesPanel';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import './CharacterSheet.css';

const ABILITY_KEYS = Object.keys(ABILITY_NAMES) as AbilityScore[];
const ALL_CONDITIONS = getAllConditions();

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
  const isLocal = !!character && isLocalCharacterId(character.id);
  const { data: characterCampaign } = useCampaignByCharacterId(character?.id || '');
  const levelingMode = getLevelingMode(characterCampaign?.settings);

  const { data: jobDisplayRow } = useQuery({
    queryKey: ['compendium-display-job', character?.job],
    queryFn: async () => {
      if (!character?.job) return null;
      const { data } = await supabase
        .from('compendium_jobs')
        .select('name, display_name')
        .eq('name', character.job)
        .maybeSingle();
      return data as { name: string; display_name?: string | null } | null;
    },
    enabled: isSupabaseConfigured && Boolean(character?.job) && !isLocal,
  });

  const { data: pathDisplayRow } = useQuery({
    queryKey: ['compendium-display-path', character?.path],
    queryFn: async () => {
      if (!character?.path) return null;
      const { data } = await supabase
        .from('compendium_job_paths')
        .select('name, display_name')
        .eq('name', character.path)
        .maybeSingle();
      return data as { name: string; display_name?: string | null } | null;
    },
    enabled: isSupabaseConfigured && Boolean(character?.path) && !isLocal,
  });

  const { data: backgroundDisplayRow } = useQuery({
    queryKey: ['compendium-display-background', character?.background],
    queryFn: async () => {
      if (!character?.background) return null;
      const { data } = await supabase
        .from('compendium_backgrounds')
        .select('name, display_name')
        .eq('name', character.background)
        .maybeSingle();
      return data as { name: string; display_name?: string | null } | null;
    },
    enabled: isSupabaseConfigured && Boolean(character?.background) && !isLocal,
  });

  const jobDisplayNameRaw = jobDisplayRow?.display_name || character?.job;
  const pathDisplayNameRaw = pathDisplayRow?.display_name || character?.path;
  const backgroundDisplayNameRaw = backgroundDisplayRow?.display_name || character?.background;
  const jobDisplayName = jobDisplayNameRaw ? formatMonarchVernacular(jobDisplayNameRaw) : undefined;
  const pathDisplayName = pathDisplayNameRaw ? formatMonarchVernacular(pathDisplayNameRaw) : undefined;
  const backgroundDisplayName = backgroundDisplayNameRaw
    ? formatMonarchVernacular(backgroundDisplayNameRaw)
    : undefined;
  const updateCharacter = useUpdateCharacter();
  const updateAbilities = useUpdateCharacterAbilities();
  const recordRoll = useRecordRoll();
  const generateShareToken = useGenerateShareToken();
  const { equipment } = useEquipment(id || '');
  const { state: sheetState, saveSheetState } = useCharacterSheetState(character?.id || '');
  const customModifiers = sheetState.customModifiers;
  const [hpEditOpen, setHpEditOpen] = useState(false);
  const [hpEditValue, setHpEditValue] = useState('');
  const [hpDeltaValue, setHpDeltaValue] = useState('');
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [abilityDrafts, setAbilityDrafts] = useState<Record<AbilityScore, string>>(() => {
    return ABILITY_KEYS.reduce((acc, ability) => {
      acc[ability] = '10';
      return acc;
    }, {} as Record<AbilityScore, string>);
  });
  const [customModifiersDraft, setCustomModifiersDraft] = useState<CustomModifier[]>([]);
  const [proficiencyDialogOpen, setProficiencyDialogOpen] = useState(false);
  const [armorProficienciesDraft, setArmorProficienciesDraft] = useState('');
  const [weaponProficienciesDraft, setWeaponProficienciesDraft] = useState('');
  const [toolProficienciesDraft, setToolProficienciesDraft] = useState('');
  const [customConditionDraft, setCustomConditionDraft] = useState('');
  const [armorClassDraft, setArmorClassDraft] = useState('');
  const [speedDraft, setSpeedDraft] = useState('');
  const [hpMaxDraft, setHpMaxDraft] = useState('');
  const undoRedo = useCharacterUndoRedo(character ?? null);
  const { data: activeRunes = [] } = useCharacterRuneInscriptions(id);
  const hasTriggeredPrintRef = useRef(false);
  const notesSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const characterResources = sheetState.resources;

  useEffect(() => {
    if (!character) return;
    setAbilityDrafts(
      ABILITY_KEYS.reduce((acc, ability) => {
        acc[ability] = character.abilities[ability]?.toString() || '10';
        return acc;
      }, {} as Record<AbilityScore, string>),
    );
  }, [character]);

  useEffect(() => {
    if (!character) return;
    setArmorClassDraft(character.armor_class.toString());
    setSpeedDraft(character.speed.toString());
    setHpMaxDraft(character.hp_max.toString());
  }, [character]);

  useEffect(() => {
    setCustomModifiersDraft(customModifiers);
  }, [customModifiers]);

  useEffect(() => {
    if (!character || isReadOnly) return;
    if (character.hp_temp > 0 && characterResources.temp_hp_sources.length === 0) {
      const nextResources = addTemporaryHP(characterResources, character.hp_temp, 'Temp HP');
      void saveSheetState({ resources: nextResources });
    }
  }, [character, characterResources, isReadOnly, saveSheetState]);

  // Apply print mode styling
  useEffect(() => {
    if (isPrintMode) {
      document.body.classList.add('print-mode');
      return () => {
        document.body.classList.remove('print-mode');
      };
    }

    document.body.classList.remove('print-mode');
    hasTriggeredPrintRef.current = false;
    return;
  }, [isPrintMode]);

  // Trigger print only once, after data has loaded
  useEffect(() => {
    if (!isPrintMode) return;
    if (isLoading) return;
    if (!character?.id) return;
    if (hasTriggeredPrintRef.current) return;

    hasTriggeredPrintRef.current = true;
    const timer = window.setTimeout(() => {
      window.print();
    }, 500);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isPrintMode, isLoading, character?.id]);

  const shareLink = character?.share_token 
    ? `${window.location.origin}/characters/${character.id}?token=${character.share_token}`
    : null;

  const handleGenerateShareLink = async () => {
    if (!character) return;
    try {
      await generateShareToken.mutateAsync(character.id);
    } catch {
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
    } catch {
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
          <SystemWindow title="ASCENDANT NOT FOUND" className="max-w-lg mx-auto">
            <p className="text-muted-foreground mb-4">The Ascendant you're looking for doesn't exist or you don't have access to it.</p>
            <Button onClick={() => navigate('/characters')}>Back to Ascendants</Button>
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
    equipment?.map(item => ({
      ...item,
      properties: item.properties || undefined,
      is_equipped: item.is_equipped || false,
      is_attuned: item.is_attuned || false,
      requires_attunement: item.requires_attunement || false,
    })) || []
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
  const customAbilityBonuses = ABILITY_KEYS.reduce((acc, ability) => {
    acc[ability] = sumCustomModifiers(customModifiers, 'ability', ability);
    return acc;
  }, {} as Record<AbilityScore, number>);
  ABILITY_KEYS.forEach((ability) => {
    const bonus = customAbilityBonuses[ability];
    if (bonus !== 0) {
      finalAbilities[ability] = (finalAbilities[ability] || 0) + bonus;
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
  const customSaveBonuses = ABILITY_KEYS.reduce((acc, ability) => {
    acc[ability] = sumCustomModifiers(customModifiers, 'save', ability);
    return acc;
  }, {} as Record<AbilityScore, number>);
  const finalSavingThrows: Record<AbilityScore, number> = {
    STR: getAbilityModifier(finalAbilities.STR) + (character.saving_throw_proficiencies?.includes('STR') ? modifiedBaseStats.proficiencyBonus : 0) + customSaveBonuses.STR,
    AGI: getAbilityModifier(finalAbilities.AGI) + (character.saving_throw_proficiencies?.includes('AGI') ? modifiedBaseStats.proficiencyBonus : 0) + customSaveBonuses.AGI,
    VIT: getAbilityModifier(finalAbilities.VIT) + (character.saving_throw_proficiencies?.includes('VIT') ? modifiedBaseStats.proficiencyBonus : 0) + customSaveBonuses.VIT,
    INT: getAbilityModifier(finalAbilities.INT) + (character.saving_throw_proficiencies?.includes('INT') ? modifiedBaseStats.proficiencyBonus : 0) + customSaveBonuses.INT,
    SENSE: getAbilityModifier(finalAbilities.SENSE) + (character.saving_throw_proficiencies?.includes('SENSE') ? modifiedBaseStats.proficiencyBonus : 0) + customSaveBonuses.SENSE,
    PRE: getAbilityModifier(finalAbilities.PRE) + (character.saving_throw_proficiencies?.includes('PRE') ? modifiedBaseStats.proficiencyBonus : 0) + customSaveBonuses.PRE,
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

  // Apply condition-based speed modifiers (e.g., grappled/restrained → 0)
  const conditionEffects = getActiveConditionEffects(character.conditions || []);
  if (conditionEffects.speedModifier === 'zero') {
    finalSpeed = 0;
  } else if (typeof conditionEffects.speedModifier === 'number') {
    finalSpeed = Math.max(0, finalSpeed + conditionEffects.speedModifier);
  }

  const customAcBonus = sumCustomModifiers(customModifiers, 'ac');
  const customSpeedBonus = sumCustomModifiers(customModifiers, 'speed');
  const customInitiativeBonus = sumCustomModifiers(customModifiers, 'initiative');

  const calculatedStats = {
    ...modifiedBaseStats,
    initiative: modifiedBaseStats.initiative + customInitiativeBonus,
    savingThrows: finalSavingThrows,
    armorClass: runeBonuses.ac + customAcBonus,
    speed: Math.max(0, finalSpeed + customSpeedBonus),
    encumbrance,
  };

  const encumbranceMax = Math.max(calculatedStats.encumbrance.carryingCapacity, 1);
  const encumbranceValue = Math.min(calculatedStats.encumbrance.totalWeight, encumbranceMax);
  const encumbranceBarClass = {
    unencumbered: 'character-sheet-encumbrance--unencumbered',
    light: 'character-sheet-encumbrance--light',
    medium: 'character-sheet-encumbrance--medium',
    heavy: 'character-sheet-encumbrance--heavy',
    overloaded: 'character-sheet-encumbrance--overloaded',
  }[calculatedStats.encumbrance.status];

  // Calculate skills with modified abilities
  const allSkills = getAllSkills();
  const skills = allSkills.reduce((acc, skill) => {
    const baseModifier = calculateSkillModifier(
      skill.name,
      finalAbilities,
      character.skill_proficiencies || [],
      character.skill_expertise || [],
      calculatedStats.proficiencyBonus
    );
    const customSkillBonus = sumCustomModifiers(customModifiers, 'skill', skill.name);
    const modifier = baseModifier + customSkillBonus;
    acc[skill.name] = {
      modifier,
      passive: 10 + modifier,
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

  const applyRestResourceUpdates = async (restType: 'short' | 'long') => {
    if (isReadOnly) return;
    const nextResources = applyResourceRest(characterResources, restType);
    try {
      await saveSheetState({ resources: nextResources });
    } catch {
      // Resource rest updates should not block completing rests.
    }
  };

  const handleShortRest = async () => {
    try {
      const { executeShortRest } = await import('@/lib/restSystem');
      await executeShortRest(character.id);

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['character', character.id] });
      queryClient.invalidateQueries({ queryKey: ['features', character.id] });
      await applyRestResourceUpdates('short');

      toast({
        title: 'Short rest completed',
        description: 'Hit dice restored. Short-rest features recharged.',
      });
    } catch {
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
      const result = await executeLongRest(character.id);

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['character', character.id] });
      queryClient.invalidateQueries({ queryKey: ['features', character.id] });
      await applyRestResourceUpdates('long');

      toast({
        title: 'Long rest completed',
        description: 'All resources restored. Features recharged. Exhaustion reduced by 1.',
      });

      if (result?.questAssignmentError) {
        toast({
          title: 'Daily quests not assigned',
          description: result.questAssignmentError,
          variant: 'destructive',
        });
      }
    } catch {
      toast({
        title: 'Failed to rest',
        description: 'Could not complete long rest.',
        variant: 'destructive',
      });
    }
  };

  const formatRollFormula = (base: string, modifier?: number) => {
    if (!modifier) return base;
    return `${base}${modifier >= 0 ? '+' : ''}${modifier}`;
  };

  const rollAndRecord = (options: {
    title: string;
    formula: string;
    rollType: string;
    context: string;
    modifier?: number;
  }) => {
    if (!character) return;
    try {
      const roll = rollDiceString(options.formula);
      const message = `${options.title}: ${formatRollResult(roll)}`;
      toast({
        title: 'Dice Roll',
        description: message,
      });
      recordRoll.mutate({
        dice_formula: roll.dice,
        result: roll.result,
        rolls: roll.rolls,
        roll_type: options.rollType,
        context: options.context,
        modifiers: typeof options.modifier === 'number' ? { modifier: options.modifier } : null,
        campaign_id: characterCampaign?.id ?? null,
        character_id: character.id,
      });
    } catch {
      toast({
        title: 'Roll failed',
        description: 'Could not execute roll.',
        variant: 'destructive',
      });
    }
  };

  const handleResourceRoll = (resource: CustomResource) => {
    if (!resource.dieSize) return;
    rollAndRecord({
      title: resource.name,
      formula: `1d${resource.dieSize}`,
      rollType: 'resource',
      context: `${resource.name} resource roll`,
    });
  };

  const tempHpTotal = calculateTotalTempHP(characterResources);
  const effectiveTempHp = characterResources.temp_hp_sources.length > 0
    ? tempHpTotal
    : character.hp_temp || 0;
  const modifiersEditable = isEditMode && !isReadOnly;

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
          hp_current: Math.min(newHP, character.hp_max + effectiveTempHp),
        },
      });
      setHpEditOpen(false);
      setHpEditValue('');
    } catch {
      toast({
        title: 'Failed to update HP',
        description: 'Could not update hit points.',
        variant: 'destructive',
      });
    }
  };

  const applyHpDelta = async (direction: 'damage' | 'heal') => {
    if (!character || isReadOnly) return;
    const delta = parseInt(hpDeltaValue);
    if (isNaN(delta) || delta <= 0) {
      toast({
        title: 'Invalid amount',
        description: 'Enter a positive number.',
        variant: 'destructive',
      });
      return;
    }

    const maxHp = character.hp_max + effectiveTempHp;
    const nextHp = direction === 'damage'
      ? Math.max(character.hp_current - delta, 0)
      : Math.min(character.hp_current + delta, maxHp);

    try {
      await updateCharacter.mutateAsync({
        id: character.id,
        data: { hp_current: nextHp },
      });
      setHpDeltaValue('');
      toast({
        title: direction === 'damage' ? 'Damage applied' : 'Healed',
        description: `HP is now ${nextHp}/${character.hp_max}.`,
      });
    } catch {
      toast({
        title: 'Failed to update HP',
        description: 'Could not update hit points.',
        variant: 'destructive',
      });
    }
  };

  const handleAbilityCommit = async (ability: AbilityScore) => {
    if (!character || isReadOnly) return;
    const raw = abilityDrafts[ability];
    const parsed = parseInt(raw, 10);
    if (Number.isNaN(parsed) || parsed < 1 || parsed > 30) {
      toast({
        title: 'Invalid ability score',
        description: 'Ability scores must be between 1 and 30.',
        variant: 'destructive',
      });
      setAbilityDrafts((prev) => ({
        ...prev,
        [ability]: character.abilities[ability]?.toString() || '10',
      }));
      return;
    }
    if (parsed === character.abilities[ability]) return;
    try {
      await updateAbilities.mutateAsync({
        characterId: character.id,
        abilities: {
          ...character.abilities,
          [ability]: parsed,
        },
      });
    } catch {
      setAbilityDrafts((prev) => ({
        ...prev,
        [ability]: character.abilities[ability]?.toString() || '10',
      }));
    }
  };

  const handleArmorClassCommit = async () => {
    if (!character || isReadOnly) return;
    const parsed = parseInt(armorClassDraft, 10);
    if (Number.isNaN(parsed) || parsed < 0) {
      toast({
        title: 'Invalid armor class',
        description: 'Armor class must be a non-negative number.',
        variant: 'destructive',
      });
      setArmorClassDraft(character.armor_class.toString());
      return;
    }
    if (parsed === character.armor_class) return;
    try {
      await updateCharacter.mutateAsync({
        id: character.id,
        data: { armor_class: parsed },
      });
    } catch {
      setArmorClassDraft(character.armor_class.toString());
    }
  };

  const handleSpeedCommit = async () => {
    if (!character || isReadOnly) return;
    const parsed = parseInt(speedDraft, 10);
    if (Number.isNaN(parsed) || parsed < 0) {
      toast({
        title: 'Invalid speed',
        description: 'Speed must be a non-negative number.',
        variant: 'destructive',
      });
      setSpeedDraft(character.speed.toString());
      return;
    }
    if (parsed === character.speed) return;
    try {
      await updateCharacter.mutateAsync({
        id: character.id,
        data: { speed: parsed },
      });
    } catch {
      setSpeedDraft(character.speed.toString());
    }
  };

  const handleHpMaxCommit = async () => {
    if (!character || isReadOnly) return;
    const parsed = parseInt(hpMaxDraft, 10);
    if (Number.isNaN(parsed) || parsed <= 0) {
      toast({
        title: 'Invalid max HP',
        description: 'Max HP must be greater than 0.',
        variant: 'destructive',
      });
      setHpMaxDraft(character.hp_max.toString());
      return;
    }
    if (parsed === character.hp_max) return;
    const nextCurrent = Math.min(character.hp_current, parsed + effectiveTempHp);
    try {
      await updateCharacter.mutateAsync({
        id: character.id,
        data: {
          hp_max: parsed,
          hp_current: nextCurrent,
        },
      });
    } catch {
      setHpMaxDraft(character.hp_max.toString());
    }
  };

  const handleToggleSavingThrowProficiency = (ability: AbilityScore) => {
    if (!character || isReadOnly) return;
    const current = character.saving_throw_proficiencies || [];
    const next = current.includes(ability)
      ? current.filter((item) => item !== ability)
      : [...current, ability];
    updateCharacter.mutate({
      id: character.id,
      data: { saving_throw_proficiencies: next },
    });
  };

  const handleToggleSkillProficiency = (skillName: string) => {
    if (!character || isReadOnly) return;
    const currentProfs = character.skill_proficiencies || [];
    const currentExpertise = character.skill_expertise || [];
    const isProficient = currentProfs.includes(skillName);
    const nextProfs = isProficient
      ? currentProfs.filter((item) => item !== skillName)
      : [...currentProfs, skillName];
    const nextExpertise = isProficient
      ? currentExpertise.filter((item) => item !== skillName)
      : currentExpertise;
    updateCharacter.mutate({
      id: character.id,
      data: {
        skill_proficiencies: nextProfs,
        skill_expertise: nextExpertise,
      },
    });
  };

  const handleToggleSkillExpertise = (skillName: string) => {
    if (!character || isReadOnly) return;
    const currentProfs = character.skill_proficiencies || [];
    const currentExpertise = character.skill_expertise || [];
    const isExpert = currentExpertise.includes(skillName);
    const nextExpertise = isExpert
      ? currentExpertise.filter((item) => item !== skillName)
      : [...currentExpertise, skillName];
    const nextProfs = isExpert
      ? currentProfs
      : currentProfs.includes(skillName)
        ? currentProfs
        : [...currentProfs, skillName];
    updateCharacter.mutate({
      id: character.id,
      data: {
        skill_proficiencies: nextProfs,
        skill_expertise: nextExpertise,
      },
    });
  };

  const handleResourcesChange = async (nextResources: typeof characterResources) => {
    if (!character || isReadOnly) return;
    try {
      await saveSheetState({ resources: nextResources });
    } catch {
      return;
    }
    const nextTempHp = calculateTotalTempHP(nextResources);
    if (nextTempHp !== character.hp_temp) {
      updateCharacter.mutate({
        id: character.id,
        data: { hp_temp: nextTempHp },
      });
    }
  };

  const handleResourceAdjust = (
    field: 'hit_dice_current' | 'system_favor_current' | 'shadow_energy_current',
    delta: number,
  ) => {
    if (!character || isReadOnly) return;
    const maxLookup = {
      hit_dice_current: character.hit_dice_max,
      system_favor_current: character.system_favor_max,
      shadow_energy_current: character.shadow_energy_max,
    };
    const currentValue = character[field];
    const nextValue = Math.max(0, Math.min(maxLookup[field], currentValue + delta));
    const updates = {
      hit_dice_current: undefined,
      system_favor_current: undefined,
      shadow_energy_current: undefined,
    } as {
      hit_dice_current?: number;
      system_favor_current?: number;
      shadow_energy_current?: number;
    };
    if (field === 'hit_dice_current') updates.hit_dice_current = nextValue;
    if (field === 'system_favor_current') updates.system_favor_current = nextValue;
    if (field === 'shadow_energy_current') updates.shadow_energy_current = nextValue;
    updateCharacter.mutate({
      id: character.id,
      data: updates,
    });
  };

  const handleExhaustionChange = (delta: number) => {
    if (!character || isReadOnly) return;
    const nextValue = Math.max(0, Math.min(6, character.exhaustion_level + delta));
    updateCharacter.mutate({
      id: character.id,
      data: { exhaustion_level: nextValue },
    });
  };

  const handleToggleCondition = (conditionName: string) => {
    if (!character || isReadOnly) return;
    const current = character.conditions || [];
    const normalized = conditionName.toLowerCase();
    const exists = current.some((item) => item.toLowerCase() === normalized);
    const next = exists
      ? current.filter((item) => item.toLowerCase() !== normalized)
      : [...current, conditionName];
    updateCharacter.mutate({
      id: character.id,
      data: { conditions: next },
    });
  };

  const handleAddCustomCondition = () => {
    if (!character || isReadOnly) return;
    const trimmed = customConditionDraft.trim();
    if (!trimmed) return;
    const current = character.conditions || [];
    const exists = current.some((item) => item.toLowerCase() === trimmed.toLowerCase());
    if (exists) {
      setCustomConditionDraft('');
      return;
    }
    updateCharacter.mutate({
      id: character.id,
      data: { conditions: [...current, trimmed] },
    });
    setCustomConditionDraft('');
  };

  const openProficiencyDialog = () => {
    if (!character) return;
    setArmorProficienciesDraft((character.armor_proficiencies || []).join(', '));
    setWeaponProficienciesDraft((character.weapon_proficiencies || []).join(', '));
    setToolProficienciesDraft((character.tool_proficiencies || []).join(', '));
    setProficiencyDialogOpen(true);
  };

  const parseCommaList = (value: string) =>
    value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

  const handleSaveProficiencies = async () => {
    if (!character || isReadOnly) return;
    try {
      await updateCharacter.mutateAsync({
        id: character.id,
        data: {
          armor_proficiencies: parseCommaList(armorProficienciesDraft),
          weapon_proficiencies: parseCommaList(weaponProficienciesDraft),
          tool_proficiencies: parseCommaList(toolProficienciesDraft),
        },
      });
      setProficiencyDialogOpen(false);
    } catch {
      // Error handled by mutation
    }
  };

  const createModifierId = () => {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
    return `mod_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  };

  const persistCustomModifiers = async (next: CustomModifier[]) => {
    if (isReadOnly) return;
    await saveSheetState({ customModifiers: next });
  };

  const handleAddCustomModifier = async () => {
    const next = [
      ...customModifiersDraft,
      {
        id: createModifierId(),
        type: 'ability',
        target: 'STR',
        value: 1,
        source: 'Custom',
        condition: '',
        enabled: true,
      },
    ];
    setCustomModifiersDraft(next);
    await persistCustomModifiers(next);
  };

  const handleRemoveCustomModifier = async (id: string) => {
    const next = customModifiersDraft.filter((modifier) => modifier.id !== id);
    setCustomModifiersDraft(next);
    await persistCustomModifiers(next);
  };

  const handleUpdateCustomModifier = (
    id: string,
    updates: Partial<CustomModifier>,
    persist = false,
  ) => {
    const next = customModifiersDraft.map((modifier) =>
      modifier.id === id ? { ...modifier, ...updates } : modifier,
    );
    setCustomModifiersDraft(next);
    if (persist) {
      void persistCustomModifiers(next);
    }
  };

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
                variant={isEditMode ? 'default' : 'outline'}
                onClick={() => setIsEditMode((prev) => !prev)}
                className="gap-2"
                aria-label="Toggle sheet edit mode"
                aria-pressed={isEditMode}
              >
                <SlidersHorizontal className="w-4 h-4" />
                {isEditMode ? 'Editing' : 'Edit Sheet'}
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

        {isLocal && (
          <SystemWindow title="GUEST MODE" variant="alert" className="mb-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                This Ascendant is stored locally on this device. Sign in to sync across devices and unlock online features like rune inscription, portraits, and Umbral Legion persistence.
              </p>
              <div className="flex gap-2">
                <Link to="/auth">
                  <Button variant="outline" size="sm">Sign In to Sync</Button>
                </Link>
              </div>
            </div>
          </SystemWindow>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Character Info */}
            <SystemWindow title={character.name.toUpperCase()} className="border-primary/50">
              {character.portrait_url && (
                <div className="mb-4 flex justify-center">
                  <OptimizedImage
                    src={character.portrait_url}
                    alt={character.name}
                    className="w-32 h-32 rounded-lg object-cover border border-primary/30"
                    size="small"
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
                  <span className="font-heading">{jobDisplayName || 'Unassigned'}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Path</span>
                  <span className="font-heading">{pathDisplayName || 'None'}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Background</span>
                  <span className="font-heading">{backgroundDisplayName || 'None'}</span>
                </div>
              </div>
            </SystemWindow>

            {/* Character Level Up */}
            {!isReadOnly && (
              <CharacterLevelUp 
                characterId={character.id}
                levelingMode={levelingMode}
                onLevelUp={() => {
                  // Refresh character data after level up
                  queryClient.invalidateQueries({ queryKey: ['character', character.id] });
                }}
              />
            )}

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
                    {effectiveTempHp > 0 && ` + ${effectiveTempHp} temp`}
                  </div>
                </div>
                {isEditMode && !isReadOnly && (
                  <div className="mt-2">
                    <Input
                      type="number"
                      inputMode="numeric"
                      className="h-7 text-xs text-center"
                      value={hpMaxDraft}
                      onChange={(e) => setHpMaxDraft(e.target.value)}
                      onBlur={handleHpMaxCommit}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          (event.target as HTMLInputElement).blur();
                        }
                      }}
                      aria-label="Set max hit points"
                      disabled={updateCharacter.isPending}
                    />
                  </div>
                )}
                {!isReadOnly && (
                  <div className="mt-3 flex items-center gap-2">
                    <Input
                      type="number"
                      min={1}
                      placeholder="Amount"
                      value={hpDeltaValue}
                      onChange={(e) => setHpDeltaValue(e.target.value)}
                      className="h-7 text-xs"
                      disabled={updateCharacter.isPending}
                      aria-label="HP adjustment amount"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 px-2"
                      onClick={() => applyHpDelta('damage')}
                      disabled={updateCharacter.isPending}
                    >
                      Damage
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 px-2"
                      onClick={() => applyHpDelta('heal')}
                      disabled={updateCharacter.isPending}
                    >
                      Heal
                    </Button>
                  </div>
                )}
              </SystemWindow>

              <SystemWindow title="ARMOR CLASS" compact>
                <Shield className="w-6 h-6 text-blue-400 mb-2" />
                <div className="font-display text-3xl font-bold text-center">{calculatedStats.armorClass}</div>
                {isEditMode && !isReadOnly && (
                  <Input
                    type="number"
                    inputMode="numeric"
                    className="mt-2 h-7 text-xs text-center"
                    value={armorClassDraft}
                    onChange={(e) => setArmorClassDraft(e.target.value)}
                    onBlur={handleArmorClassCommit}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        (event.target as HTMLInputElement).blur();
                      }
                    }}
                    aria-label="Set armor class"
                    disabled={updateCharacter.isPending}
                  />
                )}
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
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="mx-auto mt-2 h-7 w-7 p-0"
                  onClick={() => rollAndRecord({
                    title: 'Initiative',
                    formula: formatRollFormula('1d20', calculatedStats.initiative),
                    rollType: 'initiative',
                    context: 'Initiative',
                    modifier: calculatedStats.initiative,
                  })}
                  aria-label="Roll initiative"
                >
                  <Dice6 className="w-4 h-4" />
                </Button>
              </SystemWindow>

              <SystemWindow title="SPEED" compact>
                <Swords className="w-6 h-6 text-green-400 mb-2" />
                <div className="font-display text-3xl font-bold text-center">{calculatedStats.speed} ft</div>
                {isEditMode && !isReadOnly && (
                  <Input
                    type="number"
                    inputMode="numeric"
                    className="mt-2 h-7 text-xs text-center"
                    value={speedDraft}
                    onChange={(e) => setSpeedDraft(e.target.value)}
                    onBlur={handleSpeedCommit}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        (event.target as HTMLInputElement).blur();
                      }
                    }}
                    aria-label="Set base speed"
                    disabled={updateCharacter.isPending}
                  />
                )}
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
                  <progress
                    className={cn('character-sheet-encumbrance', encumbranceBarClass)}
                    value={encumbranceValue}
                    max={encumbranceMax}
                  />
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
                {ABILITY_KEYS.map((ability) => {
                  const baseScore = character.abilities[ability];
                  const equipmentBonus = equipmentMods.abilityModifiers[ability.toLowerCase() as keyof typeof equipmentMods.abilityModifiers] || 0;
                  const customAbilityBonus = customAbilityBonuses[ability] || 0;
                  const bonusTotal = equipmentBonus + customAbilityBonus;
                  const totalScore = baseScore + bonusTotal;
                  const modifier = calculatedStats.abilityModifiers[ability];
                  const isProficient = character.saving_throw_proficiencies?.includes(ability);
                  const isEditingAbility = isEditMode && !isReadOnly;
                  
                  return (
                    <div key={ability} className="text-center group">
                      <div className="text-xs text-muted-foreground mb-1">{ABILITY_NAMES[ability]}</div>
                      <div className="font-display text-2xl font-bold mb-1">
                        {totalScore}
                        {bonusTotal !== 0 && (
                          <span className={cn(
                            "text-xs ml-1",
                            bonusTotal > 0 ? "text-green-400" : "text-red-400"
                          )}>
                            ({bonusTotal > 0 ? '+' : ''}{bonusTotal})
                          </span>
                        )}
                      </div>
                      {isEditingAbility && (
                        <Input
                          type="number"
                          inputMode="numeric"
                          className="h-7 text-center text-xs"
                          value={abilityDrafts[ability] ?? baseScore.toString()}
                          onChange={(e) => {
                            const value = e.target.value;
                            setAbilityDrafts((prev) => ({ ...prev, [ability]: value }));
                          }}
                          onBlur={() => handleAbilityCommit(ability)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                              (event.target as HTMLInputElement).blur();
                            }
                          }}
                          aria-label={`Set ${ABILITY_NAMES[ability]} score`}
                          disabled={updateAbilities.isPending}
                        />
                      )}
                      <div className={cn(
                        "text-sm font-heading",
                        modifier >= 0 ? "text-green-400" : "text-red-400"
                      )}>
                        {formatModifier(modifier)}
                      </div>
                      {isProficient && (
                        <Badge variant="secondary" className="mt-1 text-xs">Prof</Badge>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="mx-auto mt-2 h-7 w-7 p-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                        onClick={() => rollAndRecord({
                          title: `${ABILITY_NAMES[ability]} Check`,
                          formula: formatRollFormula('1d20', modifier),
                          rollType: 'ability',
                          context: `${ABILITY_NAMES[ability]} Check`,
                          modifier,
                        })}
                        aria-label={`Roll ${ABILITY_NAMES[ability]} check`}
                      >
                        <Dice6 className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </SystemWindow>

            {/* Saving Throws */}
            <SystemWindow title="SAVING THROWS">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {ABILITY_KEYS.map((ability) => {
                  const save = calculatedStats.savingThrows[ability];
                  const isProficient = character.saving_throw_proficiencies?.includes(ability);
                  const isEditingSave = isEditMode && !isReadOnly;
                  
                  return (
                    <div key={ability} className="flex items-center justify-between p-2 rounded bg-muted/30 group">
                      <span className="text-sm font-heading">{ABILITY_NAMES[ability]}</span>
                      <div className="flex items-center gap-2">
                        {isEditingSave ? (
                          <Button
                            type="button"
                            variant={isProficient ? 'default' : 'outline'}
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={() => handleToggleSavingThrowProficiency(ability)}
                            aria-pressed={isProficient}
                          >
                            P
                          </Button>
                        ) : (
                          isProficient && <Badge variant="secondary" className="text-xs">P</Badge>
                        )}
                        <span className={cn(
                          "font-display font-bold",
                          save >= 0 ? "text-green-400" : "text-red-400"
                        )}>
                          {formatModifier(save)}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => rollAndRecord({
                            title: `${ABILITY_NAMES[ability]} Save`,
                            formula: formatRollFormula('1d20', save),
                            rollType: 'save',
                            context: `${ABILITY_NAMES[ability]} Save`,
                            modifier: save,
                          })}
                          className="h-7 w-7 p-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                          aria-label={`Roll ${ABILITY_NAMES[ability]} save`}
                        >
                          <Dice6 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </SystemWindow>

            {/* Resources */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <SystemWindow title="HIT DICE" compact>
                <div className="text-center">
                  <div className="font-display text-2xl font-bold">
                    {character.hit_dice_current}/{character.hit_dice_max}
                  </div>
                  <div className="text-xs text-muted-foreground">d{character.hit_dice_size}</div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mx-auto mt-2 h-7 w-7 p-0"
                    onClick={() => rollAndRecord({
                      title: 'Hit Die',
                      formula: formatRollFormula(`1d${character.hit_dice_size}`, getAbilityModifier(finalAbilities.VIT)),
                      rollType: 'default',
                      context: `Hit Die d${character.hit_dice_size}`,
                      modifier: getAbilityModifier(finalAbilities.VIT),
                    })}
                    aria-label="Roll hit die"
                  >
                    <Dice6 className="w-4 h-4" />
                  </Button>
                  {!isReadOnly && (
                    <div className="mt-2 flex items-center justify-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleResourceAdjust('hit_dice_current', -1)}
                        disabled={character.hit_dice_current <= 0}
                        aria-label="Spend hit die"
                      >
                        -
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleResourceAdjust('hit_dice_current', 1)}
                        disabled={character.hit_dice_current >= character.hit_dice_max}
                        aria-label="Recover hit die"
                      >
                        +
                      </Button>
                    </div>
                  )}
                </div>
              </SystemWindow>

              <SystemWindow title="SYSTEM FAVOR" compact>
                <div className="text-center">
                  <div className="font-display text-2xl font-bold">
                    {character.system_favor_current}/{character.system_favor_max}
                  </div>
                  <div className="text-xs text-muted-foreground">d{character.system_favor_die}</div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mx-auto mt-2 h-7 w-7 p-0"
                    onClick={() => rollAndRecord({
                      title: 'System Favor',
                      formula: `1d${character.system_favor_die}`,
                      rollType: 'default',
                      context: `System Favor d${character.system_favor_die}`,
                    })}
                    aria-label="Roll system favor"
                  >
                    <Dice6 className="w-4 h-4" />
                  </Button>
                  {!isReadOnly && (
                    <div className="mt-2 flex items-center justify-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleResourceAdjust('system_favor_current', -1)}
                        disabled={character.system_favor_current <= 0}
                        aria-label="Spend system favor"
                      >
                        -
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleResourceAdjust('system_favor_current', 1)}
                        disabled={character.system_favor_current >= character.system_favor_max}
                        aria-label="Recover system favor"
                      >
                        +
                      </Button>
                    </div>
                  )}
                </div>
              </SystemWindow>

              <SystemWindow title="UMBRAL ENERGY" compact>
                <div className="text-center">
                  <div className="font-display text-2xl font-bold">
                    {character.shadow_energy_current}/{character.shadow_energy_max}
                  </div>
                  <div className="text-xs text-muted-foreground">Reserve</div>
                  {!isReadOnly && (
                    <div className="mt-2 flex items-center justify-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleResourceAdjust('shadow_energy_current', -1)}
                        disabled={character.shadow_energy_current <= 0}
                        aria-label="Spend umbral energy"
                      >
                        -
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleResourceAdjust('shadow_energy_current', 1)}
                        disabled={character.shadow_energy_current >= character.shadow_energy_max}
                        aria-label="Recover umbral energy"
                      >
                        +
                      </Button>
                    </div>
                  )}
                </div>
              </SystemWindow>
            </div>

            {/* Conditions */}
            {(isEditMode || (character.conditions && character.conditions.length > 0) || character.exhaustion_level > 0) && (
              <SystemWindow title="CONDITIONS" variant="alert">
                {isEditMode && !isReadOnly ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {ALL_CONDITIONS.map((condition) => {
                        const isActive = (character.conditions || []).some(
                          (item) => item.toLowerCase() === condition.name.toLowerCase(),
                        );
                        return (
                          <label key={condition.name} className="flex items-center gap-2">
                            <Checkbox
                              checked={isActive}
                              onCheckedChange={() => handleToggleCondition(condition.name)}
                              aria-label={`Toggle ${condition.name}`}
                            />
                            <span>{condition.name}</span>
                          </label>
                        );
                      })}
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        value={customConditionDraft}
                        onChange={(e) => setCustomConditionDraft(e.target.value)}
                        placeholder="Custom condition"
                        className="h-8 text-xs"
                      />
                      <Button type="button" size="sm" onClick={handleAddCustomCondition}>
                        Add
                      </Button>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Exhaustion</span>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => handleExhaustionChange(-1)}
                          disabled={character.exhaustion_level <= 0}
                        >
                          -
                        </Button>
                        <span className="font-display text-base">{character.exhaustion_level}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => handleExhaustionChange(1)}
                          disabled={character.exhaustion_level >= 6}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {(character.conditions || []).map((condition) => (
                      <Badge key={condition} variant="destructive">{condition}</Badge>
                    ))}
                    {character.exhaustion_level > 0 && (
                      <Badge variant="outline">Exhaustion {character.exhaustion_level}</Badge>
                    )}
                  </div>
                )}
              </SystemWindow>
            )}

            {/* Digital Character Sheet Resources */}
            {!isReadOnly && (
              <CharacterResourcesPanel
                resources={characterResources}
                onResourcesChange={handleResourcesChange}
                onResourceRoll={handleResourceRoll}
                hpCurrent={character.hp_current}
                hpMax={character.hp_max}
                isDead={character.hp_current <= 0 && characterResources.death_saves.death_save_failures >= 3}
              />
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
            <SystemWindow
              title="PROFICIENCIES"
              actions={
                !isReadOnly && isEditMode ? (
                  <Button variant="outline" size="sm" onClick={openProficiencyDialog}>
                    Manage
                  </Button>
                ) : null
              }
            >
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

            <RollHistoryPanel characterId={character.id} />

            {(isEditMode || customModifiersDraft.length > 0) && (
              <SystemWindow
                title="CUSTOM MODIFIERS"
                actions={
                  modifiersEditable ? (
                    <Button size="sm" className="gap-2" onClick={handleAddCustomModifier}>
                      <Plus className="w-3 h-3" />
                      Add
                    </Button>
                  ) : null
                }
              >
                <div className="space-y-4">
                  {customModifiersDraft.length === 0 ? (
                    <div className="text-xs text-muted-foreground">No custom modifiers yet.</div>
                  ) : (
                    customModifiersDraft.map((modifier) => {
                      const needsTarget = ['ability', 'save', 'skill', 'attack', 'damage'].includes(modifier.type);
                      return (
                        <div key={modifier.id} className="space-y-2 rounded border border-border bg-muted/20 p-3">
                          <div className="grid gap-2 md:grid-cols-[160px_1fr_90px_auto_auto] items-center">
                            <Select
                              value={modifier.type}
                              onValueChange={(value) => {
                                const nextType = value as CustomModifier['type'];
                                const defaultTarget = nextType === 'ability' || nextType === 'save'
                                  ? 'STR'
                                  : nextType === 'skill'
                                    ? 'Athletics'
                                    : nextType === 'attack' || nextType === 'damage'
                                      ? 'all'
                                      : '';
                                handleUpdateCustomModifier(modifier.id, { type: nextType, target: defaultTarget }, true);
                              }}
                              disabled={!modifiersEditable}
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {CUSTOM_MODIFIER_TYPES.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            {needsTarget ? (
                              modifier.type === 'skill' ? (
                                <Select
                                  value={modifier.target || ''}
                                  onValueChange={(value) => handleUpdateCustomModifier(modifier.id, { target: value }, true)}
                                  disabled={!modifiersEditable}
                                >
                                  <SelectTrigger className="h-8 text-xs">
                                    <SelectValue placeholder="Target" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {allSkills.map((skill) => (
                                      <SelectItem key={skill.name} value={skill.name}>
                                        {skill.name}
                                      </SelectItem>
                                    ))}
                                    <SelectItem value="all">all</SelectItem>
                                  </SelectContent>
                                </Select>
                              ) : modifier.type === 'attack' || modifier.type === 'damage' ? (
                                <Select
                                  value={modifier.target || 'all'}
                                  onValueChange={(value) => handleUpdateCustomModifier(modifier.id, { target: value }, true)}
                                  disabled={!modifiersEditable}
                                >
                                  <SelectTrigger className="h-8 text-xs">
                                    <SelectValue placeholder="Target" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="all">all</SelectItem>
                                    <SelectItem value="melee">melee</SelectItem>
                                    <SelectItem value="ranged">ranged</SelectItem>
                                  </SelectContent>
                                </Select>
                              ) : (
                                <Select
                                  value={modifier.target || 'STR'}
                                  onValueChange={(value) => handleUpdateCustomModifier(modifier.id, { target: value }, true)}
                                  disabled={!modifiersEditable}
                                >
                                  <SelectTrigger className="h-8 text-xs">
                                    <SelectValue placeholder="Target" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {ABILITY_KEYS.map((ability) => (
                                      <SelectItem key={ability} value={ability}>
                                        {ability}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )
                            ) : (
                              <Input
                                value="n/a"
                                readOnly
                                className="h-8 text-xs text-muted-foreground"
                              />
                            )}

                            <Input
                              type="number"
                              value={modifier.value}
                              onChange={(event) => {
                                const parsed = parseInt(event.target.value, 10);
                                handleUpdateCustomModifier(modifier.id, { value: Number.isNaN(parsed) ? 0 : parsed });
                              }}
                              onBlur={() => handleUpdateCustomModifier(modifier.id, { value: modifier.value }, true)}
                              className="h-8 text-xs text-right"
                              disabled={!modifiersEditable}
                            />

                            <Switch
                              checked={modifier.enabled}
                              onCheckedChange={(checked) => handleUpdateCustomModifier(modifier.id, { enabled: checked }, true)}
                              aria-label="Toggle modifier"
                              disabled={!modifiersEditable}
                            />

                            {modifiersEditable && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleRemoveCustomModifier(modifier.id)}
                                aria-label="Remove modifier"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>

                          <div className="grid gap-2 md:grid-cols-2">
                            <Input
                              value={modifier.source}
                              onChange={(event) => handleUpdateCustomModifier(modifier.id, { source: event.target.value })}
                              onBlur={() => handleUpdateCustomModifier(modifier.id, { source: modifier.source }, true)}
                              className="h-8 text-xs"
                              placeholder="Source"
                              disabled={!modifiersEditable}
                            />
                            <Input
                              value={modifier.condition || ''}
                              onChange={(event) => handleUpdateCustomModifier(modifier.id, { condition: event.target.value })}
                              onBlur={() => handleUpdateCustomModifier(modifier.id, { condition: modifier.condition || '' }, true)}
                              className="h-8 text-xs"
                              placeholder="Condition (optional)"
                              disabled={!modifiersEditable}
                            />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </SystemWindow>
            )}

            {/* Skills */}
            <SystemWindow title="SKILLS">
              <div className="space-y-1 max-h-[400px] overflow-y-auto">
                {Object.entries(skills).map(([skillName, skill]) => {
                  const handleSkillRoll = () => {
                    rollAndRecord({
                      title: `${skillName} Check`,
                      formula: formatRollFormula('1d20', skill.modifier),
                      rollType: 'skill',
                      context: `${skillName} Check`,
                      modifier: skill.modifier,
                    });
                  };

                  const isEditingSkill = isEditMode && !isReadOnly;

                  return (
                    <div
                      key={skillName}
                      className="flex items-center justify-between p-2 rounded bg-muted/30 text-sm hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <span className="font-heading">{skillName}</span>
                        <span className="text-xs text-muted-foreground">({ABILITY_NAMES[skill.ability]})</span>
                        {!isEditingSkill && skill.expertise && <Badge variant="default" className="text-xs">E</Badge>}
                        {!isEditingSkill && skill.proficient && !skill.expertise && <Badge variant="secondary" className="text-xs">P</Badge>}
                      </div>
                      <div className="flex items-center gap-3">
                        {isEditingSkill && (
                          <div className="flex items-center gap-1">
                            <Button
                              type="button"
                              variant={skill.proficient ? 'default' : 'outline'}
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={() => handleToggleSkillProficiency(skillName)}
                              aria-pressed={skill.proficient}
                            >
                              P
                            </Button>
                            <Button
                              type="button"
                              variant={skill.expertise ? 'default' : 'outline'}
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={() => handleToggleSkillExpertise(skillName)}
                              aria-pressed={skill.expertise}
                            >
                              E
                            </Button>
                          </div>
                        )}
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
                          className="h-7 w-7 p-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
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
            {isLocal ? (
              <SystemWindow title="RUNES" variant="alert">
                <p className="text-sm text-muted-foreground">
                  Sign in to inscribe and manage runes. Your guest Ascendant can still use equipment, powers, and core automation.
                </p>
              </SystemWindow>
            ) : (
              <RunesList characterId={character.id} />
            )}

            {/* Monarch Unlocks */}
            {isLocal ? (
              <SystemWindow title={`${MONARCH_LABEL.toUpperCase()} UNLOCKS`} variant="alert">
                <p className="text-sm text-muted-foreground">
                  Sign in to access {MONARCH_LABEL} progression and unlock tracking.
                </p>
              </SystemWindow>
            ) : (
              <MonarchUnlocksPanel characterId={character.id} />
            )}

            {/* Umbral Legion */}
            {isLocal ? (
              <SystemWindow title="Umbral Legion" variant="alert">
                <p className="text-sm text-muted-foreground">
                  Sign in to manage Umbral Legion progression and persistence.
                </p>
              </SystemWindow>
            ) : (
              <ShadowSoldiersPanel characterId={character.id} characterLevel={character.level} />
            )}

            {/* Portrait Upload */}
            <SystemWindow title="PORTRAIT" variant={isLocal ? 'alert' : 'default'}>
              {isLocal ? (
                <p className="text-sm text-muted-foreground">
                  Sign in to upload and sync portraits.
                </p>
              ) : (
                <PortraitUpload
                  characterId={character.id}
                  currentPortraitUrl={character.portrait_url}
                  onUploadComplete={() => {
                    // Refresh character data
                    window.location.reload();
                  }}
                />
              )}
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
                      } catch {
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
              Set the character's current hit points (max: {character.hp_max + effectiveTempHp})
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
                max={character.hp_max + effectiveTempHp}
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

      {/* Proficiency Dialog */}
      <Dialog open={proficiencyDialogOpen} onOpenChange={setProficiencyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Proficiencies</DialogTitle>
            <DialogDescription>Use commas to separate entries.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="armor-proficiencies">Armor Proficiencies</Label>
              <Input
                id="armor-proficiencies"
                value={armorProficienciesDraft}
                onChange={(e) => setArmorProficienciesDraft(e.target.value)}
                placeholder="Light armor, Shields"
              />
            </div>
            <div>
              <Label htmlFor="weapon-proficiencies">Weapon Proficiencies</Label>
              <Input
                id="weapon-proficiencies"
                value={weaponProficienciesDraft}
                onChange={(e) => setWeaponProficienciesDraft(e.target.value)}
                placeholder="Simple weapons, Martial weapons"
              />
            </div>
            <div>
              <Label htmlFor="tool-proficiencies">Tool Proficiencies</Label>
              <Input
                id="tool-proficiencies"
                value={toolProficienciesDraft}
                onChange={(e) => setToolProficienciesDraft(e.target.value)}
                placeholder="Thieves' tools, Smith's tools"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProficiencyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProficiencies} disabled={updateCharacter.isPending}>
              Save
            </Button>
          </DialogFooter>
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



