import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Zap, Heart, TrendingUp, Crown, Sparkles, Star } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
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


function getExperienceForNextLevel(currentLevel: number): number {
  return currentLevel * 1000; // Simple progression formula
}

const CharacterLevelUp = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: character, isLoading } = useCharacter(id || '');
  const { data: characterCampaign } = useCampaignByCharacterId(id || '');
  const levelingMode = getLevelingMode(characterCampaign?.settings);
  const isMilestone = levelingMode === 'milestone';
  const updateCharacter = useUpdateCharacter();
  const initializeSpellSlots = useInitializeSpellSlots();
  const [newLevel, setNewLevel] = useState(1);
  const [hpIncrease, setHpIncrease] = useState<number | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isRolling, setIsRolling] = useState(false);

  // Level progression logic
  const currentExperience = character?.experience ?? 0;
  const experienceNeeded = character && !isMilestone ? getExperienceForNextLevel(character.level) : 0;
  const canLevelUp = !!character && (isMilestone || currentExperience >= experienceNeeded);

  // Fetch features for the new level
  const { data: newFeatures = [] } = useQuery({
    queryKey: ['job-features', character?.job, newLevel],
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
            return [...(features || []), ...pathFeatures];
          }
        }
      }

      return features || [];
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

      // Add new features
      for (const featureId of selectedFeatures) {
        const feature = newFeatures.find(f => f.id === featureId);
        if (feature) {
          let usesMax: number | null = null;
          if (feature.uses_formula) {
            if (feature.uses_formula.includes('proficiency')) {
              usesMax = newProficiencyBonus;
            } else if (feature.uses_formula.includes('level')) {
              usesMax = newLevel;
            }
          }

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
      }

      // Check for new powers
      if (character.job) {
        const { data: job } = await supabase
          .from('compendium_jobs')
          .select('id, name')
          .eq('name', character.job)
          .maybeSingle();

        if (job) {
          const { data: availablePowers } = await supabase
            .from('compendium_powers')
            .select('*')
            .contains('job_names', [character.job])
            .lte('power_level', Math.floor(newLevel / 2));

          const { data: existingPowers } = await supabase
            .from('character_powers')
            .select('name')
            .eq('character_id', character.id);

          const existingPowerNames = new Set(existingPowers?.map(p => p.name) || []);

          if (availablePowers) {
            for (const power of availablePowers) {
              if (!existingPowerNames.has(power.name)) {
                await supabase.from('character_powers').insert({
                  character_id: character.id,
                  name: power.name,
                  power_level: power.power_level,
                  source: `Job: ${character.job}`,
                  casting_time: power.casting_time || null,
                  range: power.range || null,
                  duration: power.duration || null,
                  concentration: power.concentration || false,
                  description: power.description || null,
                  higher_levels: power.higher_levels || null,
                  is_prepared: false,
                  is_known: true,
                });
              }
            }
          }
        }
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
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate(`/characters/${character.id}`)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Ascendant
        </Button>

        {/* Level Up Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-arise/10 rounded-full border border-arise/30 mb-4">
            <TrendingUp className="w-5 h-5 text-arise" />
            <span className="font-arise text-arise tracking-wide">LEVEL UP PROTOCOL</span>
          </div>
          <h1 className="font-arise text-3xl font-bold gradient-text-shadow tracking-wider mb-2">
            {character.name.toUpperCase()}
          </h1>
          <div className="flex items-center justify-center gap-4 text-2xl font-arise">
            <span className="text-muted-foreground">LV. {character.level}</span>
            <span className="text-arise animate-pulse">{'->'}</span>
            <span className={cn("font-bold", rankInfo.color)}>LV. {newLevel}</span>
            <Badge className={cn("ml-2 font-arise", rankInfo.color, "bg-transparent border-current")}>
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
                        selectedFeatures.includes(feature.id)
                          ? "border-amber-500/50 bg-amber-500/10 shadow-lg shadow-amber-500/10"
                          : "border-border bg-muted/30 hover:border-amber-500/30"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id={`feature-${feature.id}`}
                          checked={selectedFeatures.includes(feature.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedFeatures([...selectedFeatures, feature.id]);
                            } else {
                              setSelectedFeatures(selectedFeatures.filter(id => id !== feature.id));
                            }
                          }}
                          className="mt-1 border-amber-500/50 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                        />
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
