import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
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
import { getAvailableFavorOptions } from '@/lib/5eRulesEngine';
import { getAbilityModifier } from '@/types/system-rules';
import { applyEquipmentModifiers } from '@/lib/equipmentModifiers';
import { applyRuneBonuses } from '@/lib/runeAutomation';
import { getActiveConditionEffects, getAllConditions } from '@/lib/conditions';
import { calculateEncumbrance, calculateTotalWeight, calculateCarryingCapacity } from '@/lib/encumbrance';
import { useCharacterRuneInscriptions } from '@/hooks/useRunes';
import { getAllSkills, calculateSkillModifier, type SkillDefinition } from '@/lib/skills';
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
import { FeatureChoicesPanel } from '@/components/character/FeatureChoicesPanel';
import { HomebrewFeatureApplicator } from '@/components/character/HomebrewFeatureApplicator';
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
import { filterRowsBySourcebookAccess } from '@/lib/sourcebookAccess';
import { useRealtimeCollaboration } from '@/hooks/useRealtimeCollaboration';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { BookOpen, Backpack, Scroll, User, Sparkles } from 'lucide-react';
import './CharacterSheet.css';

const ABILITY_KEYS = Object.keys(ABILITY_NAMES) as AbilityScore[];
const ALL_CONDITIONS = getAllConditions();

type SheetSkill = {
  modifier: number;
  passive: number;
  ability: AbilityScore;
  proficient: boolean;
  expertise: boolean;
};

type SheetSkillMap = Record<string, SheetSkill>;

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
  const campaignId = characterCampaign?.id ?? null;

  const { broadcastDiceRoll, isConnected: isCampaignConnected } = useRealtimeCollaboration(campaignId || '');

  const { data: jobDisplayRow } = useQuery({
    queryKey: ['compendium-display-job', character?.job, campaignId],
    queryFn: async () => {
      if (!character?.job) return null;
      const { data } = await supabase
        .from('compendium_jobs')
        .select('name, display_name, source_book')
        .eq('name', character.job)
        .maybeSingle();

      const accessibleRows = await filterRowsBySourcebookAccess(
        data ? [data] : [],
        (row) => row.source_book,
        { campaignId }
      );
      const accessible = accessibleRows[0];
      if (!accessible) return null;

      return {
        name: accessible.name,
        display_name: accessible.display_name ?? null,
      };
    },
    enabled: isSupabaseConfigured && Boolean(character?.job) && !isLocal,
  });

  const { data: pathDisplayRow } = useQuery({
    queryKey: ['compendium-display-path', character?.path, campaignId],
    queryFn: async () => {
      if (!character?.path) return null;
      const { data } = await supabase
        .from('compendium_job_paths')
        .select('name, display_name, source_book')
        .eq('name', character.path)
        .maybeSingle();

      const accessibleRows = await filterRowsBySourcebookAccess(
        data ? [data] : [],
        (row) => row.source_book,
        { campaignId }
      );
      const accessible = accessibleRows[0];
      if (!accessible) return null;

      return {
        name: accessible.name,
        display_name: accessible.display_name ?? null,
      };
    },
    enabled: isSupabaseConfigured && Boolean(character?.path) && !isLocal,
  });

  const { data: backgroundDisplayRow } = useQuery({
    queryKey: ['compendium-display-background', character?.background, campaignId],
    queryFn: async () => {
      if (!character?.background) return null;
      const { data } = await supabase
        .from('compendium_backgrounds')
        .select('name, display_name, source_book')
        .eq('name', character.background)
        .maybeSingle();

      const accessibleRows = await filterRowsBySourcebookAccess(
        data ? [data] : [],
        (row) => row.source_book,
        { campaignId }
      );
      const accessible = accessibleRows[0];
      if (!accessible) return null;

      return {
        name: accessible.name,
        display_name: accessible.display_name ?? null,
      };
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
  const notesSaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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

  const memoizedStats = useMemo(() => {
    if (!character) return null;
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

    // Apply condition-based speed modifiers (e.g., grappled/restrained â†’ 0)
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
    const allSkills: SkillDefinition[] = getAllSkills();
    const skills = allSkills.reduce<SheetSkillMap>((acc, skill) => {
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
    }, {});

    return {
      calculatedStats,
      skills,
      encumbranceBarClass,
      encumbranceValue,
      encumbranceMax,
      finalAbilities,
      customAbilityBonuses,
      allSkills,
      equipmentMods,
      runeBonuses,
      finalSpeed,
      baseStats,
    };
  }, [character, equipment, activeRunes, customModifiers]);

  const applyRestResourceUpdates = useCallback(async (restType: 'short' | 'long') => {
    if (isReadOnly) return;
    const nextResources = applyResourceRest(characterResources, restType);
    try {
      await saveSheetState({ resources: nextResources });
    } catch {
      // Resource rest updates should not block completing rests.
    }
  }, [isReadOnly, characterResources, saveSheetState]);

  const handleShortRest = useCallback(async () => {
    if (!character) return;
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
  }, [character?.id, queryClient, applyRestResourceUpdates, toast]);

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

  if (!memoizedStats) {
    return null;
  }

  const memoizedStatsValue = memoizedStats;

  const {
    calculatedStats,
    skills,
    encumbranceBarClass,
    encumbranceValue,
    encumbranceMax,
    finalAbilities,
    customAbilityBonuses,
    allSkills,
    equipmentMods,
    runeBonuses,
    finalSpeed,
    baseStats,
  } = memoizedStatsValue;

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
      const scope = campaignId && isCampaignConnected ? 'campaign' : 'local';
      const message = `${options.title}: ${formatRollResult(roll)}${scope === 'campaign' ? ' (shared)' : ''}`;
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

      // Broadcast to campaign channel if connected
      if (scope === 'campaign') {
        broadcastDiceRoll(options.formula, roll.result, {
          characterName: character.name,
          rollType: options.rollType,
          context: options.context,
          rolls: roll.rolls,
        });
      }
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
    field: 'hit_dice_current' | 'system_favor_current',
    delta: number,
  ) => {
    if (!character || isReadOnly) return;
    const maxLookup = {
      hit_dice_current: character.hit_dice_max,
      system_favor_current: character.system_favor_max,
    };
    const currentValue = character[field];
    const nextValue = Math.max(0, Math.min(maxLookup[field], currentValue + delta));
    const updates: { hit_dice_current?: number; system_favor_current?: number } = {};
    if (field === 'hit_dice_current') updates.hit_dice_current = nextValue;
    if (field === 'system_favor_current') updates.system_favor_current = nextValue;
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
    const next: CustomModifier[] = [
      ...customModifiersDraft,
      {
        id: createModifierId(),
        type: 'ability' as const,
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

        {/* â”€â”€ DDB-Style Character Header (always visible) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div className="flex flex-col sm:flex-row items-start gap-4 mb-6 p-4 rounded-xl bg-card border border-border">
          {character.portrait_url && (
            <OptimizedImage
              src={character.portrait_url}
              alt={character.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover border border-primary/30 flex-shrink-0"
              size="small"
            />
          )}
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-2xl sm:text-3xl font-bold truncate">{character.name}</h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-muted-foreground">
              <span className="font-heading">Level <span className="text-foreground font-bold">{character.level}</span></span>
              <span className="text-border">â€¢</span>
              <span className="font-heading text-foreground">{jobDisplayName || 'Unassigned'}</span>
              {pathDisplayName && (
                <>
                  <span className="text-border">â€¢</span>
                  <span className="font-heading">{pathDisplayName}</span>
                </>
              )}
              {backgroundDisplayName && (
                <>
                  <span className="text-border">â€¢</span>
                  <span className="font-heading">{backgroundDisplayName}</span>
                </>
              )}
            </div>
            {/* Quick Actions Row */}
            <div className="flex flex-wrap gap-2 mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShortRest}
                className="gap-1.5 h-8"
                disabled={updateCharacter.isPending}
              >
                <Moon className="w-3.5 h-3.5" />
                Short Rest
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLongRest}
                className="gap-1.5 h-8"
                disabled={updateCharacter.isPending}
              >
                <Sun className="w-3.5 h-3.5" />
                Long Rest
              </Button>
              {character.level < 20 && !isReadOnly && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => navigate(`/characters/${character.id}/level-up`)}
                  className="gap-1.5 h-8"
                >
                  <Zap className="w-3.5 h-3.5" />
                  Level Up
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* â”€â”€ DDB-Style Tabbed Content â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-card border border-border rounded-lg">
            <TabsTrigger value="overview" className="gap-1.5 text-xs sm:text-sm py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Overview</span>
              <span className="xs:hidden">O</span>
            </TabsTrigger>
            <TabsTrigger value="actions" className="gap-1.5 text-xs sm:text-sm py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Swords className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Actions</span>
              <span className="xs:hidden">A</span>
            </TabsTrigger>
            <TabsTrigger value="inventory" className="gap-1.5 text-xs sm:text-sm py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Backpack className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Inv</span>
              <span className="xs:hidden">I</span>
            </TabsTrigger>
            <TabsTrigger value="features" className="gap-1.5 text-xs sm:text-sm py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Features</span>
              <span className="xs:hidden">F</span>
            </TabsTrigger>
            <TabsTrigger value="bio" className="gap-1.5 text-xs sm:text-sm py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Bio</span>
              <span className="xs:hidden">B</span>
            </TabsTrigger>
          </TabsList>

          {/* â”€â”€ TAB: Overview â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <TabsContent value="overview" className="space-y-6 mt-0">

            {/* Character Level Up */}
            {!isReadOnly && (
              <CharacterLevelUp 
                characterId={character.id}
                levelingMode={levelingMode}
                onLevelUp={() => {
                  queryClient.invalidateQueries({ queryKey: ['character', character.id] });
                }}
              />
            )}

            {/* Core Stats - D&D Beyond Style */}
            <div className="character-sheet-stats-grid grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <SystemWindow title="HIT POINTS" compact data-testid="hp-section" className="relative overflow-hidden">
                <div className="absolute top-2 right-2">
                  <Heart className={cn(
                    "w-5 h-5 sm:w-6 sm:h-6",
                    character.hp_current < character.hp_max * 0.25 ? "text-destructive" :
                    character.hp_current < character.hp_max * 0.5 ? "text-orange-400" :
                    "text-red-400"
                  )} />
                </div>
                <div className="pt-6 sm:pt-8">
                  <div className="text-center">
                    <div className={cn(
                      "font-display text-2xl sm:text-3xl font-bold mb-1",
                      character.hp_current < character.hp_max * 0.5 && "text-destructive"
                    )} data-testid="hp-current-display">
                      {character.hp_current}
                    </div>
                    <div className="text-xs text-muted-foreground" data-testid="hp-max-display">
                      / {character.hp_max}
                      {effectiveTempHp > 0 && ` + ${effectiveTempHp} temp`}
                    </div>
                  </div>
                  {!isReadOnly && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full mt-2 h-7 text-xs"
                      onClick={() => {
                        setHpEditValue(character.hp_current.toString());
                        setHpEditOpen(true);
                      }}
                      aria-label="Edit hit points"
                      data-testid="hp-edit-button"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                  )}
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
                      data-testid="hp-max-input"
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
                      data-testid="hp-delta-input"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 px-2"
                      onClick={() => applyHpDelta('damage')}
                      disabled={updateCharacter.isPending}
                      data-testid="hp-damage-button"
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
                      data-testid="hp-heal-button"
                    >
                      Heal
                    </Button>
                  </div>
                )}
              </SystemWindow>

              <SystemWindow title="ARMOR CLASS" compact className="relative overflow-hidden">
                <div className="absolute top-2 right-2">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                </div>
                <div className="pt-6 sm:pt-8">
                  <div className="font-display text-2xl sm:text-3xl font-bold text-center">{calculatedStats.armorClass}</div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mx-auto mt-2 h-7 w-7 p-0"
                    onClick={() => rollAndRecord({
                      title: 'Armor Class Check',
                      formula: '1d20',
                      rollType: 'ac',
                      context: 'Armor Class',
                    })}
                    aria-label="Roll armor class check"
                  >
                    <Dice6 className="w-4 h-4" />
                  </Button>
                </div>
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

              <SystemWindow title="INITIATIVE" compact className="relative overflow-hidden">
                <div className="absolute top-2 right-2">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                </div>
                <div className="pt-6 sm:pt-8">
                  <div className="font-display text-2xl sm:text-3xl font-bold text-center">
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
                </div>
              </SystemWindow>

              <SystemWindow title="SPEED" compact className="relative overflow-hidden">
                <div className="absolute top-2 right-2">
                  <Swords className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                </div>
                <div className="pt-6 sm:pt-8">
                  <div className="font-display text-2xl sm:text-3xl font-bold text-center">{calculatedStats.speed} ft</div>
                  {calculatedStats.encumbrance && calculatedStats.encumbrance.status !== 'unencumbered' && (
                    <div className={cn(
                      "text-xs text-center mt-1",
                      calculatedStats.encumbrance.status === 'overloaded' ? "text-destructive" :
                      calculatedStats.encumbrance.status === 'heavy' ? "text-orange-400" :
                      "text-muted-foreground"
                    )}>
                      {calculatedStats.encumbrance.status === 'heavy' && '-10 ft'}
                      {calculatedStats.encumbrance.status === 'overloaded' && '-20 ft'}
                    </div>
                  )}
                </div>
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

            {/* Ability Scores - D&D Beyond Style */}
            <SystemWindow title="ABILITY SCORES">
              <div className="character-sheet-ability-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
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
                    <div key={ability} className="text-center group bg-card border border-border rounded-lg p-3 sm:p-4 relative">
                      <div className="text-xs text-muted-foreground mb-1 font-heading">{ABILITY_NAMES[ability]}</div>
                      <div className="font-display text-xl sm:text-2xl font-bold mb-1">
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
                          className="h-6 text-center text-xs mt-1"
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
                      <button
                        type="button"
                        className={cn(
                          "w-full mt-2 text-sm font-heading cursor-pointer hover:bg-primary/10 rounded py-1 transition-colors flex items-center justify-center gap-1",
                          modifier >= 0 ? "text-green-400" : "text-red-400"
                        )}
                        onClick={() => rollAndRecord({
                          title: `${ABILITY_NAMES[ability]} Check`,
                          formula: formatRollFormula('1d20', modifier),
                          rollType: 'ability',
                          context: `${ABILITY_NAMES[ability]} Check`,
                          modifier,
                        })}
                        aria-label={`Roll ${ABILITY_NAMES[ability]} check`}
                      >
                        {formatModifier(modifier)}
                        <Dice6 className="w-3 h-3 opacity-50" />
                      </button>
                      {isProficient && (
                        <Badge variant="secondary" className="mt-1 text-xs absolute top-1 right-1">P</Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </SystemWindow>

            {/* Saving Throws - D&D Beyond Style */}
            <SystemWindow title="SAVING THROWS">
              <div className="character-sheet-saving-throws-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {ABILITY_KEYS.map((ability) => {
                  const save = calculatedStats.savingThrows[ability];
                  const isProficient = character.saving_throw_proficiencies?.includes(ability);
                  const isEditingSave = isEditMode && !isReadOnly;
                  
                  return (
                    <div key={ability} className="flex items-center justify-between p-3 sm:p-2 rounded-lg bg-card border border-border group hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-heading">{ABILITY_NAMES[ability]}</span>
                        {isProficient && (
                          <Badge variant="secondary" className="text-xs px-1.5 py-0.5">Prof</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {isEditingSave ? (
                          <Button
                            type="button"
                            variant={isProficient ? 'default' : 'outline'}
                            size="sm"
                            className="h-6 px-2 text-xs character-sheet-touch-small"
                            onClick={() => handleToggleSavingThrowProficiency(ability)}
                            aria-pressed={isProficient}
                          >
                            P
                          </Button>
                        ) : (
                          isProficient && <Badge variant="secondary" className="text-xs px-1.5 py-0.5">P</Badge>
                        )}
                        <span className={cn(
                          "font-display font-bold text-sm sm:text-base",
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
                          className="h-7 w-7 p-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity character-sheet-touch-small"
                          aria-label={`Roll ${ABILITY_NAMES[ability]} save`}
                        >
                          <Dice6 className="w-3.5 h-3.5" />
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
                  <div className="mt-2 flex items-center justify-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => rollAndRecord({
                        title: 'System Favor',
                        formula: `1d${character.system_favor_die}`,
                        rollType: 'default',
                        context: `System Favor d${character.system_favor_die}`,
                      })}
                      aria-label="Roll system favor die"
                    >
                      <Dice6 className="w-4 h-4" />
                    </Button>
                    {!isReadOnly && (
                      <>
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
                      </>
                    )}
                  </div>
                  {/* System Favor Usage Options */}
                  <div className="mt-3 space-y-1 text-left">
                    {getAvailableFavorOptions(character.level).map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        className={cn(
                          "w-full text-left rounded px-2 py-1 text-xs transition-colors",
                          character.system_favor_current >= opt.cost && !isReadOnly
                            ? "hover:bg-primary/10 cursor-pointer text-foreground"
                            : "opacity-40 cursor-not-allowed text-muted-foreground"
                        )}
                        disabled={character.system_favor_current < opt.cost || isReadOnly}
                        onClick={() => {
                          if (character.system_favor_current < opt.cost) return;
                          handleResourceAdjust('system_favor_current', -opt.cost);
                          if (opt.id === 'favor-inspiration') {
                            rollAndRecord({
                              title: opt.name,
                              formula: `1d${character.system_favor_die}`,
                              rollType: 'default',
                              context: opt.description,
                            });
                          }
                          toast({
                            title: opt.name,
                            description: opt.rulesText,
                          });
                        }}
                        title={opt.rulesText}
                      >
                        <span className="font-heading font-semibold">{opt.name}</span>
                        {opt.cost > 1 && <span className="text-muted-foreground ml-1">({opt.cost})</span>}
                        <span className="block text-muted-foreground leading-tight">{opt.description}</span>
                      </button>
                    ))}
                  </div>
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

            {/* Proficiencies */}
            </TabsContent>

          {/* â”€â”€ TAB: Actions & Spells â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <TabsContent value="actions" className="space-y-6 mt-0">
            {/* Actions */}
            <ActionsList characterId={character.id} />

            {/* Spell Slots */}
            <SpellSlotsDisplay 
              characterId={character.id} 
              job={character.job}
              level={character.level}
              abilities={character.abilities as Record<string, number>}
            />

            {/* Powers */}
            <PowersList characterId={character.id} />
          </TabsContent>

          {/* â”€â”€ TAB: Inventory â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <TabsContent value="inventory" className="space-y-6 mt-0">
            {/* Equipment */}
            <EquipmentList characterId={character.id} />

            {/* Currency */}
            <CurrencyManager characterId={character.id} />
          </TabsContent>

          {/* â”€â”€ TAB: Features â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <TabsContent value="features" className="space-y-6 mt-0">
            {/* Feature Choices */}
            <FeatureChoicesPanel characterId={character.id} />
            <FeaturesList characterId={character.id} />

            {/* Homebrew Features */}
            <HomebrewFeatureApplicator characterId={character.id} />

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
          </TabsContent>

          {/* â”€â”€ TAB: Bio & Notes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <TabsContent value="bio" className="space-y-6 mt-0">
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

            {/* Roll History */}
            <RollHistoryPanel characterId={character.id} />
          </TabsContent>
        </Tabs>

      </div>

      {/* â”€â”€ Dialogs (rendered outside scroll content) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}

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
              <Button
                onClick={handleGenerateShareLink}
                disabled={generateShareToken.isPending}
                className="w-full"
              >
                {generateShareToken.isPending ? 'Generating...' : 'Generate Share Link'}
              </Button>
            ) : (
              <div className="space-y-2">
                <Label>Share Link</Label>
                <div className="flex gap-2">
                  <Input value={shareLink} readOnly className="font-mono text-sm" />
                  <Button variant="outline" size="icon" onClick={handleCopyShareLink}>
                    {shareLinkCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Anyone with this link can view your character in read-only mode.</p>
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
              <Input id="armor-proficiencies" value={armorProficienciesDraft} onChange={(e) => setArmorProficienciesDraft(e.target.value)} placeholder="Light armor, Shields" />
            </div>
            <div>
              <Label htmlFor="weapon-proficiencies">Weapon Proficiencies</Label>
              <Input id="weapon-proficiencies" value={weaponProficienciesDraft} onChange={(e) => setWeaponProficienciesDraft(e.target.value)} placeholder="Simple weapons, Martial weapons" />
            </div>
            <div>
              <Label htmlFor="tool-proficiencies">Tool Proficiencies</Label>
              <Input id="tool-proficiencies" value={toolProficienciesDraft} onChange={(e) => setToolProficienciesDraft(e.target.value)} placeholder="Thieves' tools, Smith's tools" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProficiencyDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveProficiencies} disabled={updateCharacter.isPending}>Save</Button>
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

// Dead code reference removed â€” old right-column content (custom modifiers, skills,
// actions, features, equipment, currency, spells, powers, runes, monarch unlocks,
// shadow soldiers, portrait, notes) is now in the tabbed layout above.
// The following was a no-op block that has been cleaned up.
/* eslint-disable @typescript-eslint/no-unused-vars */
const _DEAD_CODE_REMOVED = true;
