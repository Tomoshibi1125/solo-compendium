import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  Backpack,
  BookOpen,
  Check,
  CheckCircle2,
  Copy,
  Crown,
  Dice6,
  Download,
  Edit,
  Heart,
  Loader2,
  Moon,
  Move,
  Plus,
  Redo2,
  ScrollText,
  Share2,
  Shield,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Swords,
  Trash2,
  Undo2,
  User,
  Zap
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
import { useGlobalDDBeyondIntegration } from '@/hooks/useGlobalDDBeyondIntegration';
import { calculateCharacterStats, formatModifier, calculateHPMax } from '@/lib/characterCalculations';
import { getAvailableFavorOptions } from '@/lib/systemFavor';
import { getAbilityModifier } from '@/types/system-rules';
import { applyEquipmentModifiers } from '@/lib/equipmentModifiers';
import { getUnarmoredDefenseBaseAC } from '@/lib/unarmoredDefense';
import { applyRuneBonuses } from '@/lib/runeAutomation';
import { getActiveConditionEffects, getAllConditions } from '@/lib/conditions';
import { calculateEncumbrance, calculateTotalWeight, calculateCarryingCapacity } from '@/lib/encumbrance';
import { useCharacterRuneInscriptions } from '@/hooks/useRunes';
import { getAllSkills, calculateSkillModifier, type SkillDefinition } from '@/lib/skills';
import { rollDiceString, formatRollResult } from '@/lib/diceRoller';
import { calculateTotalTempHP, addTemporaryHP, applyResourceRest, type CustomResource } from '@/lib/characterResources';
import { resolveAdvantageFromCustomModifiers, sumCustomModifiers, type CustomModifier, CUSTOM_MODIFIER_TYPES, normalizeCustomModifiers } from '@/lib/customModifiers';
import { EquipmentList } from '@/components/character/EquipmentList';
import { CurrencyManager } from '@/components/character/CurrencyManager';
import { PowersList } from '@/components/character/PowersList';
import { RunesList } from '@/components/character/RunesList';
import { SpellSlotsDisplay } from '@/components/character/SpellSlotsDisplay';
import { ActionsList } from '@/components/character/ActionsList';
import { FeaturesList } from '@/components/character/FeaturesList';
import { FeatureChoicesPanel } from '@/components/character/FeatureChoicesPanel';
import { HomebrewFeatureApplicator } from '@/components/character/HomebrewFeatureApplicator';
import { RegentFeaturesDisplay } from '@/components/character/RegentFeaturesDisplay';
import { CharacterRollsPanel } from '@/components/character/CharacterRollsPanel';
import { RollHistoryPanel } from '@/components/character/RollHistoryPanel';
import { ExportDialog } from '@/components/character/ExportDialog';
import { PortraitUpload } from '@/components/character/PortraitUpload';
import { useCharacterFeatures, featureModifiersToCustomModifiers } from '@/hooks/useCharacterFeatures';
import { CharacterLevelUp } from '@/components/CharacterLevelUp';
import { MonarchUnlocksPanel } from '@/components/character/MonarchUnlocksPanel';
import { MONARCH_LABEL, formatMonarchVernacular } from '@/lib/vernacular';
import { ShadowSoldiersPanel } from '@/components/character/ShadowSoldiersPanel';
import { CharacterEditDialog } from '@/components/character/CharacterEditDialog';
import { CharacterFAB } from '@/components/character/CharacterFAB';
import { SovereignOverlayPanel } from '@/components/character/SovereignOverlayPanel';
import { CharacterExtrasPanel } from '@/components/character/CharacterExtrasPanel';
import { EncumbranceWidget } from '@/components/character/EncumbranceWidget';
import { QuestLog } from '@/pages/player-tools/QuestLog';
import { CharacterBackupPanel } from '@/components/character/CharacterBackupPanel';
import { useCharacterUndoRedo } from '@/hooks/useCharacterUndoRedo';
import { ABILITY_NAMES, type AbilityScore } from '@/types/system-rules';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useEquipment } from '@/hooks/useEquipment';
import { useRegentUnlocks } from '@/hooks/useRegentUnlocks';
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
import { JournalPanel } from '@/components/character/JournalPanel';
import { CharacterResourcesPanel } from '@/components/character/CharacterResourcesPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { DeathSaveTracker } from '@/components/CharacterSheet/DeathSaveTracker';
import { ShortRestDialog } from '@/components/CharacterSheet/ShortRestDialog';
import { LongRestDialog } from '@/components/CharacterSheet/LongRestDialog';
import { ConcentrationBanner } from '@/components/CharacterSheet/ConcentrationBanner';
import { AttunementSlots } from '@/components/CharacterSheet/AttunementSlots';
import { ProficienciesLanguages } from '@/components/CharacterSheet/ProficienciesLanguages';
import { SpellPanel, type SpellEntry, type SpellSlotDisplay } from '@/components/CharacterSheet/SpellPanel';
import { ConditionBadgeBar } from '@/components/CharacterSheet/ConditionBadgeBar';
import { SensesDisplay } from '@/components/CharacterSheet/SensesDisplay';
import { DefensesModal } from '@/components/CharacterSheet/DefensesModal';
import { LimitedUseTracker } from '@/components/character/LimitedUseTracker';
import { useDeathSaves } from '@/hooks/useDeathSaves';
import { useConcentration } from '@/hooks/useConcentration';
import { useAttunement } from '@/hooks/useAttunement';
import { useSpellSlots } from '@/hooks/useSpellSlots';
import { useSpellCasting } from '@/hooks/useSpellCasting';
import { usePowers } from '@/hooks/usePowers';
import { getSpellcastingAbility } from '@/lib/characterCalculations';
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
  const { useCharacterSheetEnhancements, usePlayerToolsEnhancements } = useGlobalDDBeyondIntegration();
  const ddbEnhancements = useCharacterSheetEnhancements(character?.id || '');
  const playerTools = usePlayerToolsEnhancements();

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
  const { state: sheetState, saveSheetState } = useCharacterSheetState(character?.id || '');
  const { data: charFeatures = [] } = useCharacterFeatures(character?.id || '');
  const baseCustomModifiers = normalizeCustomModifiers(sheetState.customModifiers);
  const featureCustomModifiers = featureModifiersToCustomModifiers(charFeatures);
  const customModifiers = [...baseCustomModifiers, ...featureCustomModifiers];
  const [hpEditOpen, setHpEditOpen] = useState(false);
  const [hpEditValue, setHpEditValue] = useState('');
  const [hpDeltaValue, setHpDeltaValue] = useState('');
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [shortRestOpen, setShortRestOpen] = useState(false);
  const [longRestOpen, setLongRestOpen] = useState(false);
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
  const { unlocks: regentUnlocks } = useRegentUnlocks(character?.id || '');
  const deathSaves = useDeathSaves(0, 0);
  const [lastDeathSaveResult, setLastDeathSaveResult] = useState<{ roll: number; message: string } | null>(null);
  const concentration = useConcentration(
    character?.abilities?.VIT ?? 10,
    character?.level ?? 1,
    character?.saving_throw_proficiencies ?? []
  );
  const { equipment, updateEquipment } = useEquipment(character?.id || '');
  const attunedItems = useMemo(() => {
    return equipment.filter(e => e.is_attuned).map(e => ({
      id: e.id,
      name: e.name,
      requiresAttunement: e.requires_attunement,
      isAttuned: !!e.is_attuned
    }));
  }, [equipment]);
  const slotsRemaining = 3 - attunedItems.length;

  // Spell system hooks
  const { data: spellSlotData = [] } = useSpellSlots(character?.id || '', character?.job || null, character?.level || 1);
  const { powers: characterPowers = [] } = usePowers(character?.id || '');
  const spellCasting = useSpellCasting(
    spellSlotData,
    (spellName, duration) => {
      concentration.concentrate({ id: spellName, name: spellName, description: `Concentrating on ${spellName}`, duration });
      const scope = campaignId && isCampaignConnected ? 'campaign' : 'local';
      if (scope === 'campaign') {
        playerTools.trackConditionChange(
          character?.id || '',
          `Concentrating on ${spellName}`,
          'add'
        ).catch(console.error);
      }
    },
    () => {
      const activeSpell = concentration.state.currentEffect?.name;
      concentration.drop();
      const scope = campaignId && isCampaignConnected ? 'campaign' : 'local';
      if (scope === 'campaign' && activeSpell) {
        playerTools.trackConditionChange(
          character?.id || '',
          `Concentrating on ${activeSpell}`,
          'remove'
        ).catch(console.error);
      }
    }
  );

  const primaryRegentUnlock = regentUnlocks.find(u => u.is_primary) ?? regentUnlocks[0];
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

    const equippedArmor = (equipment || []).some((item) => {
      const props = (item.properties || []).map((p) => p.toLowerCase());
      if (!item.is_equipped) return false;
      if (item.requires_attunement && !item.is_attuned) return false;
      return props.includes('light') || props.includes('medium') || props.includes('heavy');
    });

    const unarmoredDefenseBase = equippedArmor
      ? null
      : getUnarmoredDefenseBaseAC(character.job, character.abilities);

    const baseACForEquipment = unarmoredDefenseBase ?? baseStats.armorClass;

    // Apply equipment modifiers
    const equipmentMods = applyEquipmentModifiers(
      baseACForEquipment,
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
      // Sum bonuses from custom modifiers and character features
      const bonus = sumCustomModifiers(customModifiers, 'ability', ability);
      const featureBonus = sumCustomModifiers(customModifiers, 'ability_bonus', ability);
      return acc + bonus + featureBonus;
    }, 0);

    ABILITY_KEYS.forEach((ability) => {
      const bonus = sumCustomModifiers(customModifiers, 'ability', ability) +
        sumCustomModifiers(customModifiers, 'ability_bonus', ability);
      if (bonus !== 0) {
        finalAbilities[ability] = (finalAbilities[ability] || 0) + bonus;
      }
    });

    // Calculate initiative (AGI modifier + initiative bonuses)
    const initiativeAdvantage = resolveAdvantageFromCustomModifiers(customModifiers, ['initiative', 'initiative_advantage']);
    const initiativeBonus = sumCustomModifiers(customModifiers, 'initiative_bonus') +
      sumCustomModifiers(customModifiers, 'initiative');
    const finalInitiative = getAbilityModifier(finalAbilities.AGI) + initiativeBonus;

    // HP calculation (with feature bonuses like Mana-Dense Physiology)
    const hpMaxBonus = sumCustomModifiers(customModifiers, 'hp-max') +
      sumCustomModifiers(customModifiers, 'hp_max');
    const finalHPMax = calculateHPMax(character.level, character.hit_dice_size || 8, getAbilityModifier(finalAbilities.VIT)) + hpMaxBonus;

    // Speed (with feature bonuses)
    const speedBonus = sumCustomModifiers(customModifiers, 'speed') +
      sumCustomModifiers(customModifiers, 'speed_bonus');
    let finalSpeed = (character.speed || 30) + speedBonus;

    // AC calculation
    const featureACBonus = sumCustomModifiers(customModifiers, 'ac_bonus');
    const baseACValue = sumCustomModifiers(customModifiers, 'ac_base');
    let finalAC = baseStats.armorClass + featureACBonus;
    if (baseACValue > 0) {
      finalAC = Math.max(finalAC, baseACValue + getAbilityModifier(finalAbilities.AGI) + featureACBonus);
    }

    // Recalculate saving throws with modified abilities
    const customSaveBonuses = ABILITY_KEYS.reduce((acc, ability) => {
      acc[ability] = sumCustomModifiers(customModifiers, 'save', ability);
      return acc;
    }, {} as Record<AbilityScore, number>);
    const finalSavingThrows: Record<AbilityScore, number> = {
      STR: getAbilityModifier(finalAbilities.STR) + (character.saving_throw_proficiencies?.includes('STR') ? baseStats.proficiencyBonus : 0) + customSaveBonuses.STR,
      AGI: getAbilityModifier(finalAbilities.AGI) + (character.saving_throw_proficiencies?.includes('AGI') ? baseStats.proficiencyBonus : 0) + customSaveBonuses.AGI,
      VIT: getAbilityModifier(finalAbilities.VIT) + (character.saving_throw_proficiencies?.includes('VIT') ? baseStats.proficiencyBonus : 0) + customSaveBonuses.VIT,
      INT: getAbilityModifier(finalAbilities.INT) + (character.saving_throw_proficiencies?.includes('INT') ? baseStats.proficiencyBonus : 0) + customSaveBonuses.INT,
      SENSE: getAbilityModifier(finalAbilities.SENSE) + (character.saving_throw_proficiencies?.includes('SENSE') ? baseStats.proficiencyBonus : 0) + customSaveBonuses.SENSE,
      PRE: getAbilityModifier(finalAbilities.PRE) + (character.saving_throw_proficiencies?.includes('PRE') ? baseStats.proficiencyBonus : 0) + customSaveBonuses.PRE,
    };

    // Calculate encumbrance
    const totalWeight = calculateTotalWeight(equipment);
    const carryingCapacity = calculateCarryingCapacity(finalAbilities.STR);
    const encumbrance = calculateEncumbrance(totalWeight, carryingCapacity);

    // Apply speed penalty from encumbrance
    finalSpeed = runeBonuses.speed;
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
    const customHpMaxBonus = sumCustomModifiers(customModifiers, 'hp-max');

    const calculatedStats = {
      ...baseStats,
      initiative: baseStats.initiative + customInitiativeBonus,
      savingThrows: finalSavingThrows,
      armorClass: runeBonuses.ac + customAcBonus,
      speed: Math.max(0, finalSpeed + customSpeedBonus),
      hpMax: Math.max(1, (character.hp_max ?? 1) + customHpMaxBonus),
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
      const equipmentSkillBonus =
        (equipmentMods.skillBonuses?.[skill.name] || 0) + (equipmentMods.skillBonuses?.['*'] || 0);
      const customSkillBonus = sumCustomModifiers(customModifiers, 'skill', skill.name);
      const modifier = baseModifier + equipmentSkillBonus + customSkillBonus;
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
      finalInitiative,
      initiativeAdvantage,
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

      const scope = campaignId && isCampaignConnected ? 'campaign' : 'local';
      recordRoll.mutate({
        dice_formula: 'Rest',
        result: 0,
        rolls: [],
        roll_type: 'rest',
        context: 'Short Rest completed',
        modifiers: null,
        campaign_id: campaignId ?? null,
        character_id: character.id,
      });

      if (scope === 'campaign') {
        broadcastDiceRoll('Rest', 0, {
          characterName: character.name,
          rollType: 'rest',
          context: 'Short Rest completed',
          rolls: [],
        });
      }
    } catch {
      toast({
        title: 'Failed to rest',
        description: 'Could not complete short rest.',
        variant: 'destructive',
      });
    }
  }, [character?.id, queryClient, applyRestResourceUpdates, toast, campaignId, isCampaignConnected, broadcastDiceRoll, recordRoll, character?.name]);

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
    finalInitiative,
    initiativeAdvantage,
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

      const hpHealed = character.hp_max - character.hp_current;
      if (hpHealed > 0) {
        playerTools.trackHealthChange(character.id, hpHealed, 'healing').catch(console.error);
      }

      if (character.exhaustion_level > 0) {
        playerTools.trackConditionChange(character.id, 'Exhaustion', 'remove').catch(console.error);
      }

      toast({
        title: 'Long rest completed',
        description: 'All resources restored. Features recharged. Exhaustion reduced by 1.',
      });

      const scope = campaignId && isCampaignConnected ? 'campaign' : 'local';
      recordRoll.mutate({
        dice_formula: 'Rest',
        result: 0,
        rolls: [],
        roll_type: 'rest',
        context: 'Long Rest completed',
        modifiers: null,
        campaign_id: campaignId ?? null,
        character_id: character.id,
      });

      if (scope === 'campaign') {
        broadcastDiceRoll('Rest', 0, {
          characterName: character.name,
          rollType: 'rest',
          context: 'Long Rest completed',
          rolls: [],
        });
      }

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
      const clampedHP = Math.min(newHP, character.hp_max + effectiveTempHp);
      await updateCharacter.mutateAsync({
        id: character.id,
        data: {
          hp_current: clampedHP,
        },
      });

      const diff = clampedHP - character.hp_current;
      if (diff !== 0) {
        playerTools.trackHealthChange(
          character.id,
          Math.abs(diff),
          diff > 0 ? 'healing' : 'damage'
        ).catch(console.error);
      }

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

      playerTools.trackHealthChange(character.id, delta, direction === 'damage' ? 'damage' : 'healing').catch(console.error);

      if (direction === 'damage' && concentration.state.isConcentrating) {
        const result = concentration.takeDamage(delta);
        if (result) {
          const scope = campaignId && isCampaignConnected ? 'campaign' : 'local';
          if (scope === 'campaign') {
            const context = `Concentration Save (DC ${result.dc}) - ${result.success ? 'Success' : 'Failed!'}`;

            recordRoll.mutate({
              dice_formula: '1d20',
              result: result.total,
              rolls: [result.roll],
              roll_type: 'save',
              context,
              modifiers: { modifier: result.modifier },
              campaign_id: campaignId ?? null,
              character_id: character.id,
            });

            broadcastDiceRoll('1d20', result.total, {
              characterName: character.name,
              rollType: 'save',
              context,
              rolls: [result.roll],
            });

            if (result.concentrationLost && result.spellName) {
              playerTools.trackConditionChange(
                character.id,
                `Concentrating on ${result.spellName}`,
                'remove'
              ).catch(console.error);
              toast({ title: 'Concentration Lost!', description: `Failed save for ${result.spellName}`, variant: 'destructive' });
            } else {
              toast({ title: 'Concentration Maintained', description: `Passed save for ${result.spellName}` });
            }
          }
        }
      }

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

      playerTools.trackHealthChange(character.id, nextTempHp, 'temp').catch(console.error);
    }

    const currentInspiration = characterResources.inspiration;
    const nextInspiration = nextResources.inspiration;

    if (nextInspiration.inspiration_points > currentInspiration.inspiration_points) {
      playerTools.trackConditionChange(character.id, 'Inspiration', 'add').catch(console.error);
    } else if (nextInspiration.inspiration_points < currentInspiration.inspiration_points) {
      playerTools.trackConditionChange(character.id, 'Inspiration', 'remove').catch(console.error);
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

    // DDB Parity Integration
    if (field === 'hit_dice_current' && delta !== 0) {
      playerTools.trackCustomFeatureUsage(
        character.id,
        'Hit Dice',
        delta < 0 ? 'spend' : 'regain',
        '5e'
      ).catch(console.error);
    }
    if (field === 'system_favor_current' && delta !== 0) {
      playerTools.trackCustomFeatureUsage(
        character.id,
        'System Favor',
        delta < 0 ? 'spend' : 'regain',
        'SA'
      ).catch(console.error);
    }
  };

  const handleExhaustionChange = (delta: number) => {
    if (!character || isReadOnly) return;
    const nextValue = Math.max(0, Math.min(6, character.exhaustion_level + delta));
    updateCharacter.mutate({
      id: character.id,
      data: { exhaustion_level: nextValue },
    });

    // DDB Parity Integration
    if (delta !== 0) {
      playerTools.trackConditionChange(
        character.id,
        `Exhaustion Level ${nextValue}`,
        delta > 0 ? 'add' : 'remove'
      ).catch(console.error);
    }
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

    // DDB Parity Integration
    playerTools.trackConditionChange(
      character.id,
      conditionName,
      !exists ? 'add' : 'remove'
    ).catch(console.error);
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

    // DDB Parity Integration
    playerTools.trackConditionChange(
      character.id,
      trimmed,
      'add'
    ).catch(console.error);
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

        {/* SA Hunter Profile Header */}
        <div className="mb-6 rounded-[2px] border border-primary/40 bg-black/80 shadow-[0_0_20px_rgba(0,0,0,0.8),inset_0_0_15px_hsl(var(--primary)/0.15)] relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-primary/40 shadow-[0_0_10px_hsl(var(--primary)/0.5)]" />
          <div className="flex flex-col md:flex-row items-stretch">
            {/* PORTRAIT CELL */}
            <div className="p-4 border-b md:border-b-0 md:border-r border-primary/20 bg-primary/5 flex items-center justify-center shrink-0">
              {character.portrait_url ? (
                <OptimizedImage
                  src={character.portrait_url}
                  alt={character.name}
                  className="w-20 h-20 sm:w-28 sm:h-28 rounded-[2px] object-cover border border-primary/40 shadow-[0_0_15px_hsl(var(--primary)/0.2)]"
                  size="small"
                />
              ) : (
                <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-[2px] border border-primary/30 flex-shrink-0 bg-black/60 flex items-center justify-center shadow-[inset_0_0_15px_hsl(var(--primary)/0.1)]">
                  <User className="w-8 h-8 sm:w-10 sm:h-10 text-primary/40" />
                </div>
              )}
            </div>

            {/* STATUS GRID CELLS */}
            <div className="flex-1 flex flex-col min-w-0">
              <div className="p-4 border-b border-primary/20 flex flex-wrap gap-4 items-center justify-between bg-black/40">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-primary/50 uppercase tracking-widest hidden sm:inline">NAMED_ENTITY:</span>
                  <h1 className="font-system tracking-widest uppercase text-2xl sm:text-3xl font-bold truncate text-white drop-shadow-[0_0_8px_currentColor]">{character.name}</h1>
                </div>

                {/* Hunter Rank Badge */}
                <div className={cn(
                  'font-system tracking-widest font-bold uppercase px-3 py-1 rounded-[2px] border flex items-center gap-2 bg-background/80 backdrop-blur-sm',
                  character.level >= 17 ? 'border-gate-s/50 text-gate-s shadow-[0_0_10px_hsl(var(--gate-s)/0.4)]' :
                    character.level >= 13 ? 'border-gate-a/50 text-gate-a shadow-[0_0_10px_hsl(var(--gate-a)/0.4)]' :
                      character.level >= 9 ? 'border-gate-b/50 text-gate-b shadow-[0_0_8px_hsl(var(--gate-b)/0.3)]' :
                        character.level >= 5 ? 'border-gate-c/50 text-gate-c shadow-[0_0_8px_hsl(var(--gate-c)/0.3)]' :
                          character.level >= 2 ? 'border-gate-d/50 text-gate-d shadow-[0_0_8px_hsl(var(--gate-d)/0.3)]' :
                            'border-gate-e/50 text-gate-e shadow-[0_0_8px_hsl(var(--gate-e)/0.3)]'
                )}>
                  <span className="text-[10px] text-muted-foreground">RANK</span>
                  <span>
                    {character.level >= 17 ? 'S' :
                      character.level >= 13 ? 'A' :
                        character.level >= 9 ? 'B' :
                          character.level >= 5 ? 'C' :
                            character.level >= 2 ? 'D' : 'E'}
                  </span>
                </div>
              </div>

              {/* Data Rows */}
              <div className="flex flex-col sm:flex-row flex-1">
                <div className="p-4 border-b sm:border-b-0 sm:border-r border-primary/20 flex-1 flex flex-col justify-center gap-2 bg-black/20">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-primary/50 uppercase tracking-widest w-12">CLASS:</span>
                    <span className="font-system text-primary font-bold uppercase tracking-wider text-sm drop-shadow-[0_0_5px_currentColor]">{jobDisplayName || 'Unawakened'}</span>
                  </div>
                  {(pathDisplayName || backgroundDisplayName) && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-primary/50 uppercase tracking-widest w-12">PATH:</span>
                      <span className="font-system text-primary/80 uppercase tracking-wider text-xs">{pathDisplayName || 'None'}</span>
                      {backgroundDisplayName && <><span className="text-primary/30 mx-1">|</span> <span className="font-system text-primary/60 uppercase tracking-wider text-xs">{backgroundDisplayName}</span></>}
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-mono text-primary/50 uppercase tracking-widest w-12">LEVEL:</span>
                    <span className="font-system text-white font-bold text-xl drop-shadow-[0_0_5px_currentColor]">{character.level}</span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-center bg-black/20">
                  {/* XP Progress Bar */}
                  {character.experience !== undefined && character.experience !== null && (
                    <div className="w-full">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-mono text-primary/60 uppercase tracking-widest">EXPERIENCE DATA</span>
                        <span className="text-[10px] font-mono text-primary font-bold tracking-widest">{character.experience || 0} XP</span>
                      </div>
                      <div className="h-2 rounded-[2px] bg-black border border-primary/30 overflow-hidden relative shadow-[inset_0_0_8px_rgba(0,0,0,0.8)]">
                        <div
                          className="h-full bg-primary relative"
                          style={{ width: `${Math.min(100, ((character.experience || 0) % 1000) / 10)}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-white/10 animate-[shimmer_2s_infinite]" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Row */}
        <div className="flex flex-wrap gap-2 mb-6">
          <ShortRestDialog
            hitDiceAvailable={character.hit_dice_current}
            hitDiceMax={character.hit_dice_max}
            hitDieSize={character.hit_dice_size}
            vitScore={finalAbilities?.VIT ?? character.abilities.VIT}
            hpCurrent={character.hp_current}
            hpMax={character.hp_max}
            onFinishRest={async (totalRecovered, hitDiceSpent) => {
              if (totalRecovered > 0) {
                const newHP = Math.min(character.hp_current + totalRecovered, character.hp_max);
                await updateCharacter.mutateAsync({ id: character.id, data: { hp_current: newHP } });
              }
              if (hitDiceSpent > 0) {
                await handleResourceAdjust('hit_dice_current', -hitDiceSpent);
              }

              // Broadcast Short Rest completion
              playerTools.trackConditionChange(character.id, 'Short Rest', 'add').catch(console.error);

              await handleShortRest();
            }}
            onHitDieSpent={(result) => {
              const scope = campaignId && isCampaignConnected ? 'campaign' : 'local';
              const totalRoll = result.roll + result.vitModifier;
              recordRoll.mutate({
                dice_formula: `1d${result.hitDieSize}`,
                result: totalRoll,
                rolls: [result.roll],
                roll_type: 'healing',
                context: `Hit Die Spent (+${result.hpRecovered} HP)`,
                modifiers: { modifier: result.vitModifier },
                campaign_id: campaignId ?? null,
                character_id: character.id,
              });

              if (scope === 'campaign') {
                broadcastDiceRoll(`1d${result.hitDieSize}`, totalRoll, {
                  characterName: character.name,
                  rollType: 'healing',
                  context: `Hit Die Spent (+${result.hpRecovered} HP)`,
                  rolls: [result.roll],
                });
              }
            }}
          />
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
        {/* Concentration Banner */}
        <ConcentrationBanner
          isConcentrating={concentration.state.isConcentrating}
          effectName={concentration.state.currentEffect?.name}
          remainingRounds={concentration.state.currentEffect?.remainingRounds}
          onDrop={() => {
            if (concentration.state.currentEffect) {
              playerTools.trackConditionChange(
                character.id,
                `Concentrating: ${concentration.state.currentEffect.name}`,
                'remove'
              ).catch(console.error);
            }
            concentration.drop();
          }}
        />

        {/* Persistent Condition Badge Bar (always visible above tabs) */}
        {
          ((character.conditions && character.conditions.length > 0) || character.exhaustion_level > 0) && !isReadOnly && (
            <ConditionBadgeBar
              conditions={character.conditions || []}
              exhaustionLevel={character.exhaustion_level}
              onClearExhaustion={() => handleExhaustionChange(-character.exhaustion_level)}
              onAddCondition={(condition) => {
                const current = character.conditions || [];
                if (!current.some(c => c.toLowerCase() === condition.toLowerCase())) {
                  updateCharacter.mutate({
                    id: character.id,
                    data: { conditions: [...current, condition] },
                  });
                  playerTools.trackConditionChange(character.id, condition, 'add').catch(console.error);
                }
              }}
              onRemoveCondition={(condition) => {
                const current = character.conditions || [];
                updateCharacter.mutate({
                  id: character.id,
                  data: { conditions: current.filter(c => c.toLowerCase() !== condition.toLowerCase()) },
                });
                playerTools.trackConditionChange(character.id, condition, 'remove').catch(console.error);
              }}
            />
          )
        }

        {/* D&D Beyond Style Tabbed Content */}
        <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-8 h-auto p-1 bg-obsidian-charcoal/40 border border-amethyst-purple/20 backdrop-blur-md hud-brackets relative overflow-hidden rounded-lg shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-b from-amethyst-purple/5 to-transparent pointer-events-none" />
            <TabsTrigger value="overview" className="gap-1.5 text-[10px] xs:text-xs sm:text-sm py-2.5 font-mono tracking-wider uppercase relative group data-[state=active]:bg-amethyst-purple/20 data-[state=active]:text-amethyst-purple">
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 relative z-10" />
              <span className="hidden xs:inline relative z-10">Overview</span>
              <span className="xs:hidden relative z-10">O</span>
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-amethyst-purple scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-500 origin-center shadow-[0_0_10px_rgba(155,109,255,0.8)]" />
            </TabsTrigger>
            <TabsTrigger value="actions" className="gap-1.5 text-[10px] xs:text-xs sm:text-sm py-2.5 font-mono tracking-wider uppercase relative group data-[state=active]:bg-amethyst-purple/20 data-[state=active]:text-amethyst-purple">
              <Swords className="w-3.5 h-3.5 sm:w-4 sm:h-4 relative z-10" />
              <span className="hidden xs:inline relative z-10">Actions</span>
              <span className="xs:hidden relative z-10">A</span>
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-amethyst-purple scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-500 origin-center shadow-[0_0_10px_rgba(155,109,255,0.8)]" />
            </TabsTrigger>
            <TabsTrigger value="inventory" className="gap-1.5 text-[10px] xs:text-xs sm:text-sm py-2.5 font-mono tracking-wider uppercase relative group data-[state=active]:bg-amethyst-purple/20 data-[state=active]:text-amethyst-purple">
              <Backpack className="w-3.5 h-3.5 sm:w-4 sm:h-4 relative z-10" />
              <span className="hidden xs:inline relative z-10">Inventory</span>
              <span className="xs:hidden relative z-10">I</span>
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-amethyst-purple scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-500 origin-center shadow-[0_0_10px_rgba(155,109,255,0.8)]" />
            </TabsTrigger>
            <TabsTrigger value="spells" className="gap-1.5 text-[10px] xs:text-xs sm:text-sm py-2.5 font-mono tracking-wider uppercase relative group data-[state=active]:bg-amethyst-purple/20 data-[state=active]:text-amethyst-purple">
              <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 relative z-10" />
              <span className="hidden xs:inline relative z-10">Spells</span>
              <span className="xs:hidden relative z-10">S</span>
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-amethyst-purple scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-500 origin-center shadow-[0_0_10px_rgba(155,109,255,0.8)]" />
            </TabsTrigger>
            <TabsTrigger value="features" className="gap-1.5 text-[10px] xs:text-xs sm:text-sm py-2.5 font-mono tracking-wider uppercase relative group data-[state=active]:bg-amethyst-purple/20 data-[state=active]:text-amethyst-purple">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 relative z-10" />
              <span className="hidden xs:inline relative z-10">Features</span>
              <span className="xs:hidden relative z-10">F</span>
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-amethyst-purple scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-500 origin-center shadow-[0_0_10px_rgba(155,109,255,0.8)]" />
            </TabsTrigger>
            <TabsTrigger value="bio" className="gap-1.5 text-[10px] xs:text-xs sm:text-sm py-2.5 font-mono tracking-wider uppercase relative group data-[state=active]:bg-amethyst-purple/20 data-[state=active]:text-amethyst-purple">
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 relative z-10" />
              <span className="hidden xs:inline relative z-10">Bio</span>
              <span className="xs:hidden relative z-10">B</span>
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-amethyst-purple scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-500 origin-center shadow-[0_0_10px_rgba(155,109,255,0.8)]" />
            </TabsTrigger>
            <TabsTrigger value="extras" className="gap-1.5 text-[10px] xs:text-xs sm:text-sm py-2.5 font-mono tracking-wider uppercase relative group data-[state=active]:bg-amethyst-purple/20 data-[state=active]:text-amethyst-purple">
              <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4 relative z-10" />
              <span className="hidden xs:inline relative z-10">Extras</span>
              <span className="xs:hidden relative z-10">X</span>
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-amethyst-purple scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-500 origin-center shadow-[0_0_10px_rgba(155,109,255,0.8)]" />
            </TabsTrigger>
            <TabsTrigger value="quests" className="gap-1.5 text-[10px] xs:text-xs sm:text-sm py-2.5 font-mono tracking-wider uppercase relative group data-[state=active]:bg-amethyst-purple/20 data-[state=active]:text-amethyst-purple">
              <ScrollText className="w-3.5 h-3.5 sm:w-4 sm:h-4 relative z-10" />
              <span className="hidden xs:inline relative z-10">Quests</span>
              <span className="xs:hidden relative z-10">Q</span>
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-amethyst-purple scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-500 origin-center shadow-[0_0_10px_rgba(155,109,255,0.8)]" />
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

            {/* Sovereign Overlay */}
            <SovereignOverlayPanel characterId={character.id} />

            {/* Core Stats - D&D Beyond Style */}
            <div className="character-sheet-stats-grid grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <SystemWindow title="HIT POINTS" compact data-testid="hp-section" className="relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-red-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-2 right-2">
                  <Heart className={cn(
                    "w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110",
                    character.hp_current < character.hp_max * 0.25 ? "text-destructive animate-pulse" :
                      character.hp_current < character.hp_max * 0.5 ? "text-orange-400" :
                        "text-red-400"
                  )} />
                </div>
                <div className="pt-6 sm:pt-8">
                  <div className="text-center">
                    <div className={cn(
                      "font-display text-3xl sm:text-4xl font-bold mb-1 tracking-tighter",
                      character.hp_current < character.hp_max * 0.5 ? "text-destructive" : "text-white"
                    )} data-testid="hp-current-display">
                      {character.hp_current}
                    </div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground" data-testid="hp-max-display">
                      MAX {character.hp_max}
                      {effectiveTempHp > 0 && (
                        <span className="text-cyan-400 ml-1">
                          (+{effectiveTempHp})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status Bar Visualization */}
                  <div className="mt-4 px-2">
                    <div className="h-1.5 w-full bg-obsidian-charcoal rounded-full overflow-hidden border border-white/5">
                      <div
                        className={cn(
                          "h-full transition-all duration-500 ease-out",
                          character.hp_current < character.hp_max * 0.25 ? "bg-destructive shadow-[0_0_8px_rgba(239,68,68,0.5)]" :
                            character.hp_current < character.hp_max * 0.5 ? "bg-orange-500" :
                              "bg-red-500"
                        )}
                        // eslint-disable-next-line react/no-inline-styles
                        style={{ width: `${Math.min(100, (character.hp_current / character.hp_max) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {!isReadOnly && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full mt-4 h-7 text-[10px] font-mono uppercase tracking-tighter hover:bg-red-500/10 hover:text-red-400"
                      onClick={() => {
                        setHpEditValue(character.hp_current.toString());
                        setHpEditOpen(true);
                      }}
                      aria-label="Edit hit points"
                      data-testid="hp-edit-button"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Protocol: Adj
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

              <SystemWindow title="ARMOR CLASS" compact data-testid="ac-section" className="relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-2 right-2">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 transition-transform group-hover:rotate-12" />
                </div>
                <div className="pt-6 sm:pt-8 text-center">
                  <DefensesModal
                    acBreakdown={{
                      base: baseStats.armorClass,
                      agiModifier: getAbilityModifier(finalAbilities.AGI),
                      agiApplied: getAbilityModifier(finalAbilities.AGI),
                      armorAC: baseStats.armorClass,
                      shieldBonus: equipmentMods.armorClass - baseStats.armorClass > 0 ? equipmentMods.armorClass - baseStats.armorClass : 0,
                      magicalBonus: runeBonuses.ac - equipmentMods.armorClass > 0 ? runeBonuses.ac - equipmentMods.armorClass : 0,
                      otherBonuses: calculatedStats.armorClass - runeBonuses.ac,
                      total: calculatedStats.armorClass,
                      formula: `${baseStats.armorClass} base${equipmentMods.armorClass !== baseStats.armorClass ? ` + ${equipmentMods.armorClass - baseStats.armorClass} equip` : ''}${runeBonuses.ac !== equipmentMods.armorClass ? ` + ${runeBonuses.ac - equipmentMods.armorClass} runes` : ''}`,
                      warnings: [],
                    }}
                    resistances={(character as unknown as Record<string, unknown>).damage_resistances as string[] | undefined}
                    immunities={(character as unknown as Record<string, unknown>).damage_immunities as string[] | undefined}
                    vulnerabilities={(character as unknown as Record<string, unknown>).damage_vulnerabilities as string[] | undefined}
                    conditionImmunities={(character as unknown as Record<string, unknown>).condition_immunities as string[] | undefined}
                    characterId={character.id}
                  />
                  <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-2">
                    DEFENSE RATING
                  </div>
                  {isEditMode && !isReadOnly && (
                    <div className="mt-4 px-2">
                      <Input
                        type="number"
                        inputMode="numeric"
                        className="h-7 text-xs text-center font-mono border-cyan-500/30 focus:border-cyan-500"
                        value={armorClassDraft}
                        onChange={(e) => setArmorClassDraft(e.target.value)}
                        onBlur={handleArmorClassCommit}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') {
                            (event.target as HTMLInputElement).blur();
                          }
                        }}
                        aria-label="Set armor class"
                        data-testid="ac-input"
                        disabled={updateCharacter.isPending}
                      />
                    </div>
                  )}
                </div>
              </SystemWindow>

              <SystemWindow title="INITIATIVE" compact data-testid="initiative-section" className="relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-2 right-2">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 transition-transform group-hover:scale-110" />
                </div>
                <div className="pt-6 sm:pt-8 text-center relative">
                  <button
                    type="button"
                    onClick={() => ddbEnhancements.roll('initiative', finalInitiative, 'ability', 'Initiative', campaignId || undefined, initiativeAdvantage as 'advantage' | 'disadvantage' | 'normal')}
                    className="w-full hover:bg-white/5 rounded-lg py-1 transition-colors group/btn cursor-pointer"
                    aria-label="Roll Initiative"
                  >
                    <div className="font-display text-3xl sm:text-4xl font-bold mb-1 tracking-tighter text-white inline-flex items-center gap-2" data-testid="initiative-display">
                      {formatModifier(finalInitiative)}
                      <Dice6 className="w-4 h-4 opacity-0 group-hover/btn:opacity-100 transition-opacity text-amber-400" />
                    </div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                      REACTION SPEED
                    </div>
                  </button>
                  {initiativeAdvantage !== 'normal' && (
                    <Badge variant="outline" className="mt-2 text-[10px] border-amber-500/50 text-amber-400 px-1 py-0 h-4">
                      {initiativeAdvantage.toUpperCase()}
                    </Badge>
                  )}
                </div>
              </SystemWindow>

              <SystemWindow title="SPEED" compact data-testid="speed-section" className="relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-2 right-2">
                  <Move className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 transition-transform group-hover:translate-x-1" />
                </div>
                <div className="pt-6 sm:pt-8 text-center">
                  <div className="font-display text-3xl sm:text-4xl font-bold mb-1 tracking-tighter text-white" data-testid="speed-display">
                    {finalSpeed}<span className="text-lg ml-1 font-mono text-muted-foreground">FT</span>
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    LOCOMOTION
                  </div>
                  {calculatedStats.encumbrance && (
                    <div className="text-[10px] text-orange-400 font-mono mt-1">
                      {calculatedStats.encumbrance.status === 'heavy' && '-10 ft (Heavy Load)'}
                      {calculatedStats.encumbrance.status === 'overloaded' && '-20 ft (Overloaded)'}
                    </div>
                  )}
                  {isEditMode && !isReadOnly && (
                    <div className="mt-4 px-2">
                      <Input
                        type="number"
                        inputMode="numeric"
                        className="h-7 text-xs text-center font-mono border-emerald-500/30 focus:border-cyan-500"
                        value={speedDraft}
                        onChange={(e) => setSpeedDraft(e.target.value)}
                        onBlur={handleSpeedCommit}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') {
                            (event.target as HTMLInputElement).blur();
                          }
                        }}
                        aria-label="Set speed"
                        data-testid="speed-input"
                        disabled={updateCharacter.isPending}
                      />
                    </div>
                  )}
                </div>
              </SystemWindow>

              {/* Encumbrance — compact weight bar */}
              <EncumbranceWidget characterId={character.id} compact />
            </div>

            {/* Ability Scores - D&D Beyond Style */}
            <SystemWindow title="ABILITY SCORES">
              <div className="character-sheet-ability-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                {ABILITY_KEYS.map((ability) => {
                  const baseScore = character.abilities[ability];
                  const equipmentBonus = equipmentMods.abilityModifiers[ability.toLowerCase() as keyof typeof equipmentMods.abilityModifiers] || 0;
                  const customAbilityBonus = sumCustomModifiers(customModifiers, 'ability', ability) + sumCustomModifiers(customModifiers, 'ability_bonus', ability);
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
                        onClick={() => ddbEnhancements.rollAbilityCheck(ability)}
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
                          onClick={() => ddbEnhancements.rollSavingThrow(ability)}
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

            {/* Skills - D&D Beyond Style */}
            <SystemWindow title="SKILLS">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {allSkills.map((skill) => {
                  const s = skills[skill.name];
                  if (!s) return null;
                  const isEditingSkill = isEditMode && !isReadOnly;
                  return (
                    <div key={skill.name} className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-card border border-border group hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-2 min-w-0">
                        {isEditingSkill ? (
                          <div className="flex gap-0.5">
                            <Button
                              type="button"
                              variant={s.proficient ? (s.expertise ? 'default' : 'secondary') : 'outline'}
                              size="sm"
                              className="h-5 w-5 p-0 text-[10px]"
                              onClick={() => {
                                if (s.expertise) {
                                  handleToggleSkillExpertise(skill.name);
                                } else if (s.proficient) {
                                  handleToggleSkillExpertise(skill.name);
                                } else {
                                  handleToggleSkillProficiency(skill.name);
                                }
                              }}
                              title={s.expertise ? 'Expertise' : s.proficient ? 'Proficient (click for expertise)' : 'Not proficient'}
                            >
                              {s.expertise ? 'E' : s.proficient ? 'P' : '○'}
                            </Button>
                          </div>
                        ) : (
                          <>
                            {s.expertise && <Badge variant="default" className="text-[9px] px-1 py-0 h-4">E</Badge>}
                            {s.proficient && !s.expertise && <Badge variant="secondary" className="text-[9px] px-1 py-0 h-4">P</Badge>}
                          </>
                        )}
                        <span className="text-xs font-heading truncate">{skill.name}</span>
                        <span className="text-[10px] text-muted-foreground">({skill.ability})</span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className={cn(
                          "font-display font-bold text-sm",
                          s.modifier >= 0 ? "text-green-400" : "text-red-400"
                        )}>
                          {formatModifier(s.modifier)}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => ddbEnhancements.rollSkillCheck(skill.name)}
                          className="h-6 w-6 p-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                          aria-label={`Roll ${skill.name} check`}
                        >
                          <Dice6 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Passive Scores */}
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="text-center p-2 rounded-lg bg-muted/50 border border-border">
                  <div className="text-[10px] text-muted-foreground font-heading">Passive Perception</div>
                  <div className="font-display font-bold text-lg">{skills['Perception']?.passive ?? 10}</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-muted/50 border border-border">
                  <div className="text-[10px] text-muted-foreground font-heading">Passive Investigation</div>
                  <div className="font-display font-bold text-lg">{skills['Investigation']?.passive ?? 10}</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-muted/50 border border-border">
                  <div className="text-[10px] text-muted-foreground font-heading">Passive Insight</div>
                  <div className="font-display font-bold text-lg">{skills['Insight']?.passive ?? 10}</div>
                </div>
              </div>
            </SystemWindow>

            {/* Proficiencies & Languages */}
            <ProficienciesLanguages
              armorProficiencies={character.armor_proficiencies || []}
              weaponProficiencies={character.weapon_proficiencies || []}
              toolProficiencies={character.tool_proficiencies || []}
            />

            {/* Senses (passive scores + special senses from job/regent) */}
            <SensesDisplay
              senses={(character as unknown as Record<string, unknown>).senses as string[] | undefined}
              passivePerception={skills['Perception']?.passive ?? 10}
              passiveInvestigation={skills['Investigation']?.passive ?? 10}
              passiveInsight={skills['Insight']?.passive ?? 10}
            />

            <DeathSaveTracker
              successes={deathSaves.state.successes}
              failures={deathSaves.state.failures}
              isStable={deathSaves.state.isStable}
              isDead={deathSaves.state.isDead}
              hpCurrent={character.hp_current}
              characterId={character.id}
              onRollDeathSave={() => {
                const result = deathSaves.rollDeathSave();
                setLastDeathSaveResult({ roll: result.roll, message: result.message });
                deathSaves.persist(character.id);

                if (result.isNat20) {
                  updateCharacter.mutate({ id: character.id, data: { hp_current: 1 } });
                  playerTools.trackHealthChange(character.id, 1, 'healing').catch(console.error);
                }

                toast({ title: 'Death Save', description: result.message });

                const scope = campaignId && isCampaignConnected ? 'campaign' : 'local';
                recordRoll.mutate({
                  dice_formula: '1d20',
                  result: result.roll,
                  rolls: [result.roll],
                  roll_type: 'save',
                  context: 'Death Save',
                  modifiers: null,
                  campaign_id: campaignId ?? null,
                  character_id: character.id,
                });

                if (scope === 'campaign') {
                  broadcastDiceRoll('1d20', result.roll, {
                    characterName: character.name,
                    rollType: 'save',
                    context: 'Death Save',
                    rolls: [result.roll],
                  });
                  // Broadcast state change explicitly if they die or stabilize from this roll
                  if (result.message.includes('died') || result.message.includes('stable')) {
                    playerTools.trackConditionChange(
                      character.id,
                      result.message.includes('died') ? 'Dead' : 'Stable',
                      'add'
                    ).catch(console.error);
                  }
                }
              }}
              onStabilize={() => {
                deathSaves.stabilize();
                deathSaves.persist(character.id);
                toast({ title: 'Stabilized', description: 'Character is stable.' });

                playerTools.trackConditionChange(
                  character.id,
                  'Stable',
                  'add'
                ).catch(console.error);
              }}
              lastRollResult={lastDeathSaveResult}
            />

            <LimitedUseTracker characterId={character.id} />

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

            {/* Quick Rolls */}
            <CharacterRollsPanel
              characterId={character.id}
              characterName={character.name}
              abilities={character.abilities as Record<string, number>}
              proficiencyBonus={calculatedStats.proficiencyBonus}
              savingThrowProficiencies={character.saving_throw_proficiencies || []}
              skills={allSkills.map(skill => ({
                name: skill.name,
                ability: skill.ability,
                proficiency: (character.skill_expertise || []).includes(skill.name)
                  ? 'expertise'
                  : (character.skill_proficiencies || []).includes(skill.name)
                    ? 'proficient'
                    : 'none',
              }))}
              campaignId={campaignId ?? undefined}
              conditions={character.conditions || []}
              exhaustionLevel={character.exhaustion_level ?? 0}
              customModifiers={customModifiers}
            />

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
            {/* Attunement Slots */}
            <AttunementSlots
              attunedItems={attunedItems}
              slotsRemaining={slotsRemaining}
              characterId={character.id}
              onUnattune={async (itemId) => {
                await updateEquipment({ id: itemId, updates: { is_attuned: false } });
                const item = equipment.find(e => e.id === itemId);
                if (item) {
                  const scope = campaignId && isCampaignConnected ? 'campaign' : 'local';
                  if (scope === 'campaign') {
                    playerTools.trackConditionChange(
                      character.id,
                      `Attuned: ${item.name}`,
                      'remove'
                    ).catch(console.error);
                  }
                }
              }}
            />

            {/* Equipment */}
            <EquipmentList characterId={character.id} />

            {/* Currency */}
            <CurrencyManager characterId={character.id} />
          </TabsContent>

          {/* â”€â”€ TAB: Spells â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <TabsContent value="spells" className="space-y-6 mt-0">
            {/* Full Spell Panel: slots, cantrips, preparation, upcasting, ritual casting */}
            {(() => {
              const castingAbility = getSpellcastingAbility(character.job);
              const castingMod = castingAbility ? getAbilityModifier(finalAbilities[castingAbility] ?? 10) : 0;
              const profBonus = calculatedStats.proficiencyBonus;
              const spellSaveDC = 8 + profBonus + castingMod;
              const spellAttackBonus = profBonus + castingMod;

              const spellSlots: SpellSlotDisplay[] = spellSlotData.map(s => ({
                level: s.level,
                current: s.current,
                max: s.max,
              }));

              const spellEntries: SpellEntry[] = characterPowers.map(p => ({
                id: p.id,
                name: p.name,
                level: p.power_level ?? 0,
                isRitual: false,
                isConcentration: p.concentration ?? false,
                isPrepared: p.is_prepared ?? true,
                castingTime: p.casting_time ?? null,
                range: p.range ?? null,
                duration: p.duration ?? null,
                description: p.description ?? null,
                higherLevels: p.higher_levels ?? null,
                school: null,
                damage: null,
              }));

              const maxPrepared = castingAbility
                ? Math.max(1, castingMod + character.level)
                : null;
              const canPrepare = !!castingAbility;

              return (
                <SpellPanel
                  characterLevel={character.level}
                  spellSlots={spellSlots}
                  spells={spellEntries}
                  spellSaveDC={spellSaveDC}
                  spellAttackBonus={spellAttackBonus}
                  maxPrepared={maxPrepared}
                  canPrepare={canPrepare}
                  characterId={character.id}
                  campaignId={campaignId || undefined}
                  onCastSpell={async (spellId, atLevel, asRitual) => {
                    const power = characterPowers.find(p => p.id === spellId);
                    if (!power) return;
                    const result = await spellCasting.castSpell({
                      spell: {
                        id: power.id,
                        name: power.name,
                        level: power.power_level ?? 0,
                        isRitual: false,
                        isConcentration: power.concentration ?? false,
                        castingTime: power.casting_time ?? null,
                        range: power.range ?? null,
                        duration: power.duration ?? null,
                        description: power.description ?? null,
                        higherLevels: power.higher_levels ?? null,
                      },
                      castAtLevel: atLevel,
                      asRitual,
                      characterId: character.id,
                      characterName: character.name,
                      jobName: character.job,
                      pathName: character.path,
                      level: character.level,
                      campaignId: campaignId,
                    });
                    const title = asRitual ? `${power.name} (Ritual)` : `${power.name} Cast`;
                    toast({
                      title,
                      description: result.message,
                    });

                    const scope = campaignId && isCampaignConnected ? 'campaign' : 'local';
                    if (scope === 'campaign') {
                      // Broadcast the spell casting event to the campaign
                      playerTools.trackCustomFeatureUsage(
                        character.id,
                        title,
                        `spend (Level ${atLevel})`,
                        '5e'
                      ).catch(console.error);
                    }

                    queryClient.invalidateQueries({ queryKey: ['spell-slots', character.id] });
                  }}
                  onTogglePrepared={async (spellId, prepared) => {
                    const power = characterPowers.find(p => p.id === spellId);
                    if (!power) return;
                    if (isLocalCharacterId(character.id)) {
                      const { updateLocalPower } = await import('@/lib/guestStore');
                      updateLocalPower(spellId, { is_prepared: prepared });
                    } else {
                      await supabase.from('character_powers').update({ is_prepared: prepared }).eq('id', spellId);
                    }
                    queryClient.invalidateQueries({ queryKey: ['powers', character.id] });
                    toast({
                      title: prepared ? 'Spell Prepared' : 'Spell Unprepared',
                      description: `${power.name} is now ${prepared ? 'prepared' : 'unprepared'}.`,
                    });
                  }}
                  onRestoreSlot={async (level) => {
                    const slot = spellSlotData.find(s => s.level === level);
                    if (!slot || slot.current >= slot.max) return;
                    if (isLocalCharacterId(character.id)) {
                      const { updateLocalSpellSlotRow } = await import('@/lib/guestStore');
                      const slotRow = spellSlotData.find(s => s.level === level);
                      if (slotRow) updateLocalSpellSlotRow(`${character.id}-slot-${level}`, { slots_current: slot.current + 1 });
                    } else {
                      await supabase
                        .from('character_spell_slots')
                        .update({ slots_current: slot.current + 1 })
                        .eq('character_id', character.id)
                        .eq('spell_level', level);
                    }
                    queryClient.invalidateQueries({ queryKey: ['spell-slots', character.id] });
                    toast({ title: 'Slot Restored', description: `Level ${level} spell slot restored.` });
                  }}
                />
              );
            })()}

            {/* Powers List (for non-spell powers like techniques) */}
            <PowersList characterId={character.id} />
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

            {/* Regent Features Display — shows features for DM-unlocked regent */}
            {!isLocal && primaryRegentUnlock && (
              <RegentFeaturesDisplay
                characterId={character.id}
                characterLevel={character.level}
                regentId={primaryRegentUnlock.regent_id}
                regentLevel={character.level}
              />
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

            {/* Backup Snapshots */}
            <SystemWindow title="CHARACTER SNAPSHOTS">
              <CharacterBackupPanel characterId={character.id} />
            </SystemWindow>

            {/* Adventure Journal */}
            {!isLocal && (
              <JournalPanel characterId={character.id} />
            )}

            {/* Roll History */}
            <RollHistoryPanel characterId={character.id} />
          </TabsContent>

          {/* ── TAB: Extras ──────────────────────────────────────────── */}
          <TabsContent value="extras" className="space-y-6 mt-0">
            <SovereignOverlayPanel characterId={character.id} />
            <CharacterExtrasPanel characterId={character.id} isReadOnly={isReadOnly} />
          </TabsContent>

          {/* ── TAB: Quests ──────────────────────────────────────────── */}
          <TabsContent value="quests" className="space-y-6 mt-0">
            {isLocal ? (
              <SystemWindow title="QUESTS">
                <p className="text-sm text-muted-foreground">Sign in to access Daily Quests.</p>
              </SystemWindow>
            ) : (
              <QuestLog characterId={character.id} />
            )}
          </TabsContent>
        </Tabs>

      </div >

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

      {
        character && (
          <>
            <ShortRestDialog
              open={shortRestOpen}
              onOpenChange={setShortRestOpen}
              characterId={character.id}
              hitDiceMax={character.hit_dice_max}
              hitDiceAvailable={character.hit_dice_current}
              hitDieSize={character.hit_dice_size || 8}
              vitScore={character.abilities.VIT}
              hpCurrent={character.hp_current}
              hpMax={character.hp_max}
              onHitDieSpent={(result) => {
                handleResourceAdjust('hit_dice_current', -1);
              }}
              onFinishRest={(totalRecovered, hitDiceSpent) => {
                updateCharacter.mutate({
                  id: character.id,
                  data: {
                    hp_current: Math.min(character.hp_max, character.hp_current + totalRecovered),
                    hit_dice_current: Math.max(0, character.hit_dice_current - hitDiceSpent),
                  }
                });
                setShortRestOpen(false);
              }}
            />
            <LongRestDialog
              open={longRestOpen}
              onOpenChange={setLongRestOpen}
              characterId={character.id}
              onConfirmRest={() => {
                const nextHitDice = Math.min(character.hit_dice_max, character.hit_dice_current + Math.max(1, Math.floor(character.hit_dice_max / 2)));
                updateCharacter.mutate({
                  id: character.id,
                  data: { hp_current: character.hp_max, hit_dice_current: nextHitDice, exhaustion_level: Math.max(0, character.exhaustion_level - 1) }
                });

                // Broadcast Long Rest completion
                playerTools.trackConditionChange(character.id, 'Long Rest', 'add').catch(console.error);
                playerTools.trackHealthChange(character.id, character.hp_max, 'healing').catch(console.error);

                setLongRestOpen(false);
              }}
            />
          </>
        )
      }

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

      {/* Mobile FAB */}
      {
        !isReadOnly && (
          <CharacterFAB
            characterId={character.id}
            campaignId={campaignId ?? undefined}
            onShortRest={() => setShortRestOpen(true)}
            onLongRest={() => setLongRestOpen(true)}
          />
        )
      }
    </Layout >
  );
};

export default CharacterSheet;
