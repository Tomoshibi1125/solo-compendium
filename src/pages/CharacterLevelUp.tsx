import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Zap, Heart, TrendingUp, Crown, Sparkles, Star, Shield, Swords } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCharacter, useUpdateCharacter } from '@/hooks/useCharacters';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useInitializeSpellSlots } from '@/hooks/useSpellSlots';
import { logger } from '@/lib/logger';
import { formatMonarchVernacular } from '@/lib/vernacular';
import type { Database } from '@/integrations/supabase/types';
import { useCampaignByCharacterId } from '@/hooks/useCampaigns';
import { getLevelingMode } from '@/lib/campaignSettings';
import { filterRowsBySourcebookAccess } from '@/lib/sourcebookAccess';
import { isASILevel, isPathUnlockLevel, type PathUnlockMeta } from '@/lib/levelGating';
import { DomainEventBus, buildCorePayload, type CharacterLevelUpEvent } from '@/lib/domainEvents';
import { calculateFeatureUses, autoUpdateFeatureUses } from '@/lib/automation';
import { useRegentUnlocks } from '@/hooks/useRegentUnlocks';
import { monarchs as regents } from '@/data/compendium/monarchs';
import { formatRegentVernacular } from '@/lib/vernacular';

// SRD 5e XP Thresholds (cumulative XP needed to reach each level)
const XP_THRESHOLDS = [
  0, 0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000,
  85000, 100000, 120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000,
];

function getExperienceForNextLevel(currentLevel: number): number {
  return XP_THRESHOLDS[Math.min(currentLevel + 1, 20)] ?? Infinity;
}

const CharacterLevelUp = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: character, isLoading } = useCharacter(id || '');
  const { data: characterCampaign } = useCampaignByCharacterId(id || '');
  const campaignId = characterCampaign?.id ?? null;
  const levelingMode = getLevelingMode(characterCampaign?.settings);
  const isMilestone = levelingMode === 'milestone';
  const updateCharacter = useUpdateCharacter();
  const initializeSpellSlots = useInitializeSpellSlots();
  const [newLevel, setNewLevel] = useState(1);
  const [hpIncrease, setHpIncrease] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const [selectedPath, setSelectedPath] = useState<string>('');
  const [asiChoices, setAsiChoices] = useState<Record<string, number>>({});

  // Level progression logic
  const currentExperience = character?.experience ?? 0;
  const experienceNeeded = character && !isMilestone ? getExperienceForNextLevel(character.level) : 0;
  const canLevelUp = !!character && (isMilestone || currentExperience >= experienceNeeded);

  // Path selection: fetch available paths if character has no path and this is a path unlock level
  const needsPathSelection = !!character && !character.path;
  const { data: availablePaths = [] } = useQuery({
    queryKey: ['level-up-paths', character?.job, newLevel, campaignId],
    queryFn: async () => {
      if (!character?.job) return [];
      const { data: job } = await supabase
        .from('compendium_jobs')
        .select('id')
        .eq('name', character.job)
        .maybeSingle();
      if (!job) return [];
      const { data, error } = await supabase
        .from('compendium_job_paths')
        .select('*')
        .eq('job_id', job.id)
        .order('name');
      if (error) throw error;
      const accessible = await filterRowsBySourcebookAccess(
        data || [],
        (path) => path.source_book,
        { campaignId }
      );
      // Only return paths whose path_level <= newLevel
      return accessible.filter((p) => {
        const pathLevel = (p as { path_level?: number | null }).path_level;
        return typeof pathLevel === 'number' && pathLevel <= newLevel;
      });
    },
    enabled: needsPathSelection && !!newLevel,
  });

  const showPathSelection = needsPathSelection && availablePaths.length > 0;
  const showASISection = !!character && isASILevel(newLevel, character?.job);

  // Regent progression: show new regent features unlocked at this level
  const { unlocks: regentUnlocks } = useRegentUnlocks(id || '');
  const primaryRegentUnlock = regentUnlocks.find((u: any) => u.is_primary) ?? regentUnlocks[0];
  const regentData = primaryRegentUnlock
    ? regents.find((m: any) => m.id === primaryRegentUnlock.regent_id)
    : null;
  const newRegentFeatures = regentData?.class_features?.filter(
    (f: any) => f.level === newLevel
  ) ?? [];

  // Fetch features for the new level (DB first, static fallback)
  const { data: newFeatures = [] } = useQuery({
    queryKey: ['job-features', character?.job, newLevel, campaignId],
    queryFn: async () => {
      if (!character?.job) return [];

      // Get job ID
      const { data: job } = await supabase
        .from('compendium_jobs')
        .select('id')
        .eq('name', character.job)
        .maybeSingle();

      if (!job) return [];

      // Get features for this level
      const { data: features, error } = await supabase
        .from('compendium_job_features')
        .select('*')
        .eq('job_id', job.id)
        .eq('level', newLevel)
        .eq('is_path_feature', false);

      if (error) throw error;

      const accessibleJobFeatures = await filterRowsBySourcebookAccess(
        features || [],
        (feature) => feature.source_name,
        { campaignId }
      );

      // If character has a path, get path features too
      if (character.path) {
        const { data: path } = await supabase
          .from('compendium_job_paths')
          .select('id')
          .eq('name', character.path)
          .maybeSingle();

        if (path) {
          const { data: pathFeatures, error: pathError } = await supabase
            .from('compendium_job_features')
            .select('*')
            .eq('path_id', path.id)
            .eq('level', newLevel)
            .eq('is_path_feature', true);

          if (!pathError && pathFeatures) {
            const accessiblePathFeatures = await filterRowsBySourcebookAccess(
              pathFeatures,
              (feature) => feature.source_name,
              { campaignId }
            );

            return [...accessibleJobFeatures, ...accessiblePathFeatures];
          }
        }
      }

      // Static fallback: if DB returned nothing, use static classFeatures
      if (accessibleJobFeatures.length === 0) {
        try {
          const { jobs: staticJobs } = await import('@/data/compendium/jobs');
          const staticJob = staticJobs.find(j => j.name === character.job);
          if (staticJob?.classFeatures) {
            const levelFeatures = staticJob.classFeatures.filter(cf => cf.level === newLevel);
            return levelFeatures.map((cf, idx) => ({
              id: `static-${cf.name.toLowerCase().replace(/\s+/g, '-')}-${idx}`,
              name: cf.name,
              description: cf.description,
              level: cf.level,
              is_path_feature: false,
              action_type: null,
              uses_formula: null,
              prerequisites: null,
              recharge: null,
              source_name: null,
            }));
          }
        } catch {
          // Best-effort static fallback
        }
      }

      return accessibleJobFeatures;
    },
    enabled: !!character && !!newLevel,
  });

  useEffect(() => {
    if (character) {
      setNewLevel(character.level + 1);
    }
  }, [character]);

  if (isLoading || !character) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-arise/20 rounded-full" />
              <div className="absolute inset-0 w-16 h-16 border-4 border-t-arise rounded-full animate-spin" />
            </div>
            <p className="text-muted-foreground font-heading animate-pulse">Accessing Ascendant Data...</p>
          </div>
          <div className="text-xs text-muted-foreground font-heading mt-2">
            Advancement Mode: {isMilestone ? 'Milestone' : 'XP'}
          </div>
        </div>
      </Layout>
    );
  }

  if (character.level >= 20) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Button
            variant="ghost"
            onClick={() => navigate(`/characters/${character.id}`)}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Ascendant
          </Button>
          <SystemWindow title="MAXIMUM LEVEL REACHED" variant="alert" className="text-center py-12">
            <Crown className="w-16 h-16 mx-auto text-amber-400 mb-4" />
            <p className="text-lg font-arise text-amber-400 mb-2">
              {character.name} has reached the pinnacle of power.
            </p>
            <p className="text-muted-foreground">
              Level 20 - The System has no further tests for this Ascendant.
            </p>
          </SystemWindow>
        </div>
      </Layout>
    );
  }

  // Calculate HP increase
  const vitModifier = Math.floor((character.abilities.VIT - 10) / 2);
  const hitDieSize = character.hit_dice_size;
  const averageHP = Math.floor(hitDieSize / 2) + 1 + vitModifier;
  const maxHP = hitDieSize + vitModifier;

  const handleLevelUp = async () => {
    if (newLevel <= character.level) {
      toast({
        title: 'Invalid level',
        description: 'New level must be higher than current level.',
        variant: 'destructive',
      });
      return;
    }

    if (hpIncrease === null) {
      toast({
        title: 'HP increase required',
        description: 'Please enter or roll for HP increase.',
        variant: 'destructive',
      });
      return;
    }

    if (!isMilestone && !canLevelUp) {
      toast({
        title: 'Not enough experience',
        description: 'You need more XP before leveling up.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // Calculate new stats
      const newProficiencyBonus = Math.ceil(newLevel / 4) + 1;
      const newSystemFavorDie = newLevel <= 4 ? 4 : newLevel <= 10 ? 6 : newLevel <= 16 ? 8 : 10;
      const newSystemFavorMax = newLevel <= 4 ? 3 : newLevel <= 10 ? 4 : newLevel <= 16 ? 5 : 6;
      const newHP = character.hp_max + hpIncrease;
      const newHitDiceMax = newLevel;

      const characterUpdates: Database['public']['Tables']['characters']['Update'] = {
        level: newLevel,
        proficiency_bonus: newProficiencyBonus,
        hp_max: newHP,
        hp_current: character.hp_current + hpIncrease,
        hit_dice_max: newHitDiceMax,
        hit_dice_current: newHitDiceMax,
        system_favor_die: newSystemFavorDie,
        system_favor_max: newSystemFavorMax,
        system_favor_current: newSystemFavorMax,
      };

      // Apply path selection if chosen during this level-up
      if (showPathSelection && selectedPath) {
        const chosenPath = availablePaths.find((p) => p.id === selectedPath);
        if (chosenPath) {
          characterUpdates.path = chosenPath.name;
        }
      }

      // Apply ASI ability score changes if this is an ASI level
      if (showASISection && Object.keys(asiChoices).length > 0) {
        const totalPoints = Object.values(asiChoices).reduce((sum, v) => sum + v, 0);
        if (totalPoints <= 2) {
          type AbilityKey = 'STR' | 'AGI' | 'VIT' | 'INT' | 'SENSE' | 'PRE';
          const abilityUpdates: Array<{ character_id: string; ability: AbilityKey; score: number }> = [];
          for (const [ability, bonus] of Object.entries(asiChoices)) {
            if (bonus > 0) {
              const currentScore = (character.abilities as Record<string, number>)[ability] ?? 10;
              abilityUpdates.push({
                character_id: character.id,
                ability: ability as AbilityKey,
                score: Math.min(20, currentScore + bonus),
              });
            }
          }
          if (abilityUpdates.length > 0) {
            await supabase
              .from('character_abilities')
              .upsert(abilityUpdates, { onConflict: 'character_id,ability' });
          }
        }
      }

      if (!isMilestone) {
        characterUpdates.experience = Math.max(0, currentExperience - experienceNeeded);
      }

      // Update character
      await updateCharacter.mutateAsync({
        id: character.id,
        data: characterUpdates,
      });

      // Initialize/update spell slots for new level
      try {
        await initializeSpellSlots.mutateAsync({
          characterId: character.id,
          job: character.job,
          level: newLevel,
        });
      } catch (error) {
        // Log but don't fail level up if spell slots fail
        logger.error('Failed to initialize spell slots:', error);
      }

      // Add new features (5e/D&D Beyond-style: features are granted automatically at the level)
      for (const feature of newFeatures) {
        const usesMax = calculateFeatureUses(feature.uses_formula, newLevel, newProficiencyBonus);

        await supabase
          .from('character_features')
          .insert({
            character_id: character.id,
            name: feature.name,
            source: feature.is_path_feature
              ? `Path: ${character.path || 'Unknown'}`
              : `Job: ${character.job}`,
            level_acquired: newLevel,
            description: feature.description,
            action_type: feature.action_type || null,
            uses_max: usesMax,
            uses_current: usesMax,
            recharge: feature.recharge || null,
            is_active: true,
          });
      }

      // If any newly-unlocked features require selections, prompt the player to complete them.
      try {
        const featureIds = newFeatures.map((f) => f.id).filter(Boolean);
        if (featureIds.length > 0) {
          const { data: groups } = await (supabase as any)
            .from('compendium_feature_choice_groups')
            .select('id')
            .in('feature_id', featureIds);

          const groupIds = ((groups || []) as Array<{ id: string }>).map((g) => g.id);
          if (groupIds.length > 0) {
            const { data: chosen } = await (supabase as any)
              .from('character_feature_choices')
              .select('group_id')
              .eq('character_id', character.id)
              .in('group_id', groupIds);

            const chosenSet = new Set(((chosen || []) as Array<{ group_id: string }>).map((c) => c.group_id));
            const pendingCount = groupIds.filter((id) => !chosenSet.has(id)).length;
            if (pendingCount > 0) {
              toast({
                title: 'Selection Protocol Required',
                description: `The System detected ${pendingCount} pending selection${pendingCount === 1 ? '' : 's'}. Open your Ascendant sheet to bind them.`,
              });
            }
          }
        }
      } catch {
        // Best-effort only; do not block level up if metadata is missing.
      }

      // Grant job awakening benefits (awakening features + job traits) at this level
      try {
        const { addJobAwakeningBenefitsForLevel } = await import('@/lib/characterCreation');
        await addJobAwakeningBenefitsForLevel(character.id, character.job, newLevel);
      } catch (error) {
        logger.error('Failed to grant job awakening benefits:', error);
      }

      // Auto-update existing feature uses (proficiency-based features scale with level)
      try {
        await autoUpdateFeatureUses(character.id);
      } catch (error) {
        logger.error('Failed to auto-update feature uses:', error);
      }

      // D&D Beyond parity: auto-recalculate all derived stats (spell save DC, passive perception, etc.)
      try {
        const { autoRecalcDerivedStats, autoApplyEquipmentModifiers } = await import('@/lib/automation');
        await Promise.all([
          autoRecalcDerivedStats(character.id),
          autoApplyEquipmentModifiers(character.id),
        ]);
      } catch (error) {
        logger.error('Failed to auto-recalculate derived stats:', error);
      }

      // Emit domain event
      try {
        const levelUpEvent: CharacterLevelUpEvent = {
          ...buildCorePayload({
            characterId: character.id,
            characterName: character.name,
            className: character.job,
            pathName: character.path,
            level: newLevel,
            campaignId,
          }),
          type: 'character:levelup',
          previousLevel: character.level,
          newLevel,
          hpIncrease: hpIncrease!,
          newFeatures: newFeatures.map((f) => f.name),
          isPathUnlockLevel: showPathSelection,
          isASILevel: isASILevel(newLevel, character.job),
        };
        DomainEventBus.emit(levelUpEvent);
      } catch {
        // Best-effort event emission
      }

      toast({
        title: 'Level Up Complete!',
        description: `${character.name} has grown stronger! Now Level ${newLevel}!`,
      });

      navigate(`/characters/${character.id}`);
    } catch {
      toast({
        title: 'Failed to level up',
        description: 'Could not complete level up. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const rollHP = () => {
    setIsRolling(true);
    // Animate through random numbers
    let count = 0;
    const interval = setInterval(() => {
      const randomRoll = Math.floor(Math.random() * hitDieSize) + 1;
      setHpIncrease(randomRoll + vitModifier);
      count++;
      if (count >= 10) {
        clearInterval(interval);
        const finalRoll = Math.floor(Math.random() * hitDieSize) + 1;
        setHpIncrease(finalRoll + vitModifier);
        setIsRolling(false);
      }
    }, 80);
  };

  // Get rank for display
  const getNewRank = () => {
    if (newLevel >= 17) return { rank: 'S', color: 'text-amber-400' };
    if (newLevel >= 13) return { rank: 'A', color: 'text-red-400' };
    if (newLevel >= 9) return { rank: 'B', color: 'text-orange-400' };
    if (newLevel >= 5) return { rank: 'C', color: 'text-blue-400' };
    return { rank: 'D', color: 'text-green-400' };
  };

  const rankInfo = getNewRank();

  return (
    <Layout>
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate(`/characters/${character.id}`)}
          className="mb-4 sm:mb-6 min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Back to Ascendant</span>
          <span className="sm:hidden">Back</span>
        </Button>

        {/* Level Up Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-arise/10 rounded-full border border-arise/30 mb-4">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-arise" />
            <span className="font-arise text-arise tracking-wide text-sm sm:text-base">LEVEL UP PROTOCOL</span>
          </div>
          <h1 className="font-arise text-2xl sm:text-3xl font-bold gradient-text-shadow tracking-wider mb-2 leading-tight">
            {character.name.toUpperCase()}
          </h1>
          <div className="flex items-center justify-center gap-2 sm:gap-4 text-lg sm:text-2xl font-arise flex-wrap">
            <span className="text-muted-foreground">LV. {character.level}</span>
            <span className="text-arise animate-pulse">{'->'}</span>
            <span className={cn("font-bold", rankInfo.color)}>LV. {newLevel}</span>
            <Badge className={cn("ml-2 font-arise", rankInfo.color, "bg-transparent border-current text-xs sm:text-sm")}>
              {rankInfo.rank}-RANK
            </Badge>
          </div>
        </div>

        <SystemWindow title="SYSTEM ENHANCEMENT" className="border-arise/50 mb-6">
          <div className="space-y-6">
            {/* Level Selection */}
            <div className="p-4 rounded-lg bg-gradient-to-r from-arise/10 to-transparent border border-arise/20">
              <Label className="font-arise text-arise tracking-wide flex items-center gap-2">
                <Star className="w-4 h-4" />
                TARGET LEVEL
              </Label>
              <div className="flex items-center gap-4 mt-3">
                <span className="text-lg text-muted-foreground font-heading">Current: {character.level}</span>
                <span className="text-2xl font-arise text-arise">{'->'}</span>
                <Input
                  type="number"
                  min={character.level + 1}
                  max={20}
                  value={newLevel}
                  onChange={(e) => setNewLevel(Math.min(20, Math.max(character.level + 1, parseInt(e.target.value) || character.level + 1)))}
                  className="w-24 text-center font-arise text-xl border-arise/30 focus:border-arise"
                />
              </div>
            </div>

            {!isMilestone && (
              <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/20">
                <Label className="font-arise text-blue-400 tracking-wide flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  EXPERIENCE REQUIREMENT
                </Label>
                <div className="flex items-center justify-between mt-3 text-sm font-heading">
                  <span className="text-muted-foreground">Current XP</span>
                  <span className="font-arise text-blue-400">{currentExperience}</span>
                </div>
                <div className="flex items-center justify-between mt-2 text-sm font-heading">
                  <span className="text-muted-foreground">Needed for Next Level</span>
                  <span className="font-arise text-blue-400">{experienceNeeded}</span>
                </div>
              </div>
            )}

            {/* HP Increase */}
            <div className="p-4 rounded-lg bg-gradient-to-r from-red-500/10 to-transparent border border-red-500/20">
              <Label className="font-arise text-red-400 tracking-wide flex items-center gap-2">
                <Heart className="w-4 h-4" />
                VITALITY INCREASE
              </Label>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex-1">
                  <div className="relative">
                    <Input
                      type="number"
                      min={1}
                      max={maxHP}
                      value={hpIncrease || ''}
                      onChange={(e) => setHpIncrease(parseInt(e.target.value) || null)}
                      placeholder={`Average: ${averageHP}`}
                      className={cn(
                        "text-center font-arise text-xl border-red-500/30 focus:border-red-500",
                        isRolling && "animate-pulse text-red-400"
                      )}
                    />
                    {hpIncrease && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-red-400 font-heading">
                        HP
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 font-heading">
                    Roll d{hitDieSize} {vitModifier >= 0 ? '+' : ''}{vitModifier} (VIT) | Range: {Math.max(1, 1 + vitModifier)} - {maxHP}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={rollHP} 
                  disabled={isRolling}
                  className={cn(
                    "gap-2 border-arise/30 hover:bg-arise/10 hover:border-arise",
                    isRolling && "animate-pulse"
                  )}
                >
                  <Zap className={cn("w-4 h-4", isRolling && "animate-spin")} />
                  {isRolling ? 'Rolling...' : 'Roll'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setHpIncrease(averageHP)}
                  className="gap-2 border-red-500/30 hover:bg-red-500/10 hover:border-red-500"
                >
                  <Heart className="w-4 h-4" />
                  Average ({averageHP})
                </Button>
              </div>
            </div>

            {/* Path Selection (shown when character has no path and paths are available at this level) */}
            {showPathSelection && (
              <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-transparent border border-purple-500/20">
                <Label className="font-arise text-purple-400 tracking-wide flex items-center gap-2 mb-4">
                  <Swords className="w-4 h-4" />
                  PATH SPECIALIZATION UNLOCKED
                </Label>
                <p className="text-sm text-muted-foreground mb-3 font-heading">
                  Choose your specialization path. This permanently defines your combat doctrine.
                </p>
                <Select value={selectedPath} onValueChange={setSelectedPath}>
                  <SelectTrigger className="border-purple-500/30 focus:border-purple-500">
                    <SelectValue placeholder="Choose a path..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePaths.map((path) => (
                      <SelectItem key={path.id} value={path.id}>
                        {formatMonarchVernacular((path as { display_name?: string | null }).display_name || path.name)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedPath && (
                  <div className="mt-3 p-3 rounded-lg bg-muted/30 border border-purple-500/10">
                    <h4 className="font-heading font-semibold text-purple-400 mb-1">
                      {formatMonarchVernacular((availablePaths.find((p) => p.id === selectedPath) as { display_name?: string | null } | undefined)?.display_name || availablePaths.find((p) => p.id === selectedPath)?.name || '')}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {formatMonarchVernacular(availablePaths.find((p) => p.id === selectedPath)?.description || '')}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ASI / Feat Selection (shown at ASI levels: 4, 8, 12, 16, 19) */}
            {showASISection && (
              <div className="p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-transparent border border-green-500/20">
                <Label className="font-arise text-green-400 tracking-wide flex items-center gap-2 mb-4">
                  <Shield className="w-4 h-4" />
                  ABILITY SCORE IMPROVEMENT
                </Label>
                <p className="text-sm text-muted-foreground mb-3 font-heading">
                  Distribute 2 points among your ability scores (max +2 to one, or +1 to two).
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {(['STR', 'AGI', 'VIT', 'INT', 'SENSE', 'PRE'] as const).map((ability) => {
                    const currentScore = (character.abilities as Record<string, number>)[ability] ?? 10;
                    const bonus = asiChoices[ability] || 0;
                    const totalSpent = Object.values(asiChoices).reduce((s, v) => s + v, 0);
                    const canIncrease = totalSpent < 2 && bonus < 2 && (currentScore + bonus) < 20;
                    const canDecrease = bonus > 0;
                    return (
                      <div key={ability} className="flex items-center justify-between p-2 rounded-lg bg-background/50 border border-green-500/10">
                        <div>
                          <span className="font-arise text-sm text-green-400">{ability}</span>
                          <span className="text-xs text-muted-foreground ml-2 font-heading">{currentScore}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-red-400"
                            disabled={!canDecrease}
                            onClick={() => setAsiChoices((prev) => ({ ...prev, [ability]: Math.max(0, (prev[ability] || 0) - 1) }))}
                          >
                            -
                          </Button>
                          <span className={cn("font-arise text-sm w-6 text-center", bonus > 0 ? "text-green-400" : "text-muted-foreground")}>
                            {bonus > 0 ? `+${bonus}` : '0'}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-green-400"
                            disabled={!canIncrease}
                            onClick={() => setAsiChoices((prev) => ({ ...prev, [ability]: Math.min(2, (prev[ability] || 0) + 1) }))}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground mt-2 font-heading">
                  Points remaining: {2 - Object.values(asiChoices).reduce((s, v) => s + v, 0)}
                </p>
              </div>
            )}

            {/* New Features */}
            {newFeatures.length > 0 && (
              <div className="p-4 rounded-lg bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20">
                <Label className="font-arise text-amber-400 tracking-wide flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4" />
                  NEW ABILITIES UNLOCKED
                </Label>
                <div className="space-y-3">
                  {newFeatures.map((feature) => (
                    <div
                      key={feature.id}
                      className={cn(
                        "p-4 rounded-lg border transition-all duration-300",
                        "border-border bg-muted/30"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <Label
                              htmlFor={`feature-${feature.id}`}
                              className="font-arise font-semibold cursor-pointer text-amber-400 tracking-wide"
                            >
                              {formatMonarchVernacular(feature.name)}
                            </Label>
                            {feature.action_type && (
                              <Badge variant="secondary" className="text-xs font-heading">
                                {formatMonarchVernacular(feature.action_type)}
                              </Badge>
                            )}
                            {feature.uses_formula && (
                              <Badge variant="outline" className="text-xs font-heading border-amber-500/30 text-amber-400">
                                {formatMonarchVernacular(feature.uses_formula)}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground font-heading">
                            {formatMonarchVernacular(feature.description || '')}
                          </p>
                          {feature.prerequisites && (
                            <p className="text-xs text-muted-foreground mt-1 italic">
                              Prerequisites: {formatMonarchVernacular(feature.prerequisites)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Regent Features Unlocked at This Level */}
            {primaryRegentUnlock && newRegentFeatures.length > 0 && (
              <div className="p-4 rounded-lg bg-gradient-to-r from-monarch-gold/10 to-shadow-purple/10 border border-monarch-gold/20">
                <Label className="font-arise text-monarch-gold tracking-wide flex items-center gap-2 mb-4">
                  <Crown className="w-4 h-4" />
                  {formatRegentVernacular(regentData?.name ?? '')} — NEW ABILITIES
                </Label>
                <div className="space-y-3">
                  {newRegentFeatures.map((feature: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-4 rounded-lg border border-monarch-gold/10 bg-muted/30"
                    >
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-arise font-semibold text-monarch-gold tracking-wide">
                          {formatRegentVernacular(feature.name)}
                        </span>
                        <Badge variant="secondary" className="text-xs font-heading">
                          {feature.type}
                        </Badge>
                        {feature.frequency && (
                          <Badge variant="outline" className="text-xs font-heading border-monarch-gold/30 text-monarch-gold">
                            {feature.frequency}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground font-heading">
                        {formatRegentVernacular(feature.description)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stat Changes Preview */}
            <div className="p-4 rounded-lg bg-gradient-to-r from-arise/5 to-shadow-purple/5 border border-arise/20">
              <h4 className="font-arise font-semibold mb-4 text-arise tracking-wide flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                STAT MODIFICATIONS
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                  <span className="text-muted-foreground font-heading">Proficiency Bonus</span>
                  <span className="font-arise text-lg">
                    +{Math.ceil(character.level / 4) + 1} {'->'} <span className="text-arise">+{Math.ceil(newLevel / 4) + 1}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                  <span className="text-muted-foreground font-heading">System Favor Die</span>
                  <span className="font-arise text-lg">
                    d{character.system_favor_die} {'->'} <span className="text-arise">d{newLevel <= 4 ? 4 : newLevel <= 10 ? 6 : newLevel <= 16 ? 8 : 10}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                  <span className="text-muted-foreground font-heading">Max HP</span>
                  <span className="font-arise text-lg">
                    {character.hp_max} {'->'} <span className="text-red-400">{character.hp_max + (hpIncrease || 0)}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                  <span className="text-muted-foreground font-heading">Hit Dice</span>
                  <span className="font-arise text-lg">
                    {character.hit_dice_max} {'->'} <span className="text-arise">{newLevel}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </SystemWindow>

        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => navigate(`/characters/${character.id}`)}
            className="font-heading"
          >
            Cancel
          </Button>
          <Button
            onClick={handleLevelUp}
            disabled={loading || hpIncrease === null || newLevel <= character.level || (!isMilestone && !canLevelUp)}
            className="gap-2 font-heading bg-gradient-to-r from-arise to-shadow-purple hover:shadow-arise/30 hover:shadow-lg transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4" />
                Complete Level Up
              </>
            )}
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default CharacterLevelUp;
