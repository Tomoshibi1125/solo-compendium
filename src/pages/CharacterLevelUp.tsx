import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Loader2, Zap, Heart } from 'lucide-react';
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
import { calculateHPMax } from '@/lib/characterCalculations';
import type { Database } from '@/integrations/supabase/types';

type JobFeature = Database['public']['Tables']['compendium_job_features']['Row'];

const CharacterLevelUp = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: character, isLoading } = useCharacter(id || '');
  const updateCharacter = useUpdateCharacter();
  const [newLevel, setNewLevel] = useState(1);
  const [hpIncrease, setHpIncrease] = useState<number | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

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
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
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
            Back to Character
          </Button>
          <SystemWindow title="MAX LEVEL" className="text-center py-12">
            <p className="text-muted-foreground">
              {character.name} is already at maximum level (20).
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

    setLoading(true);
    try {
      // Calculate new stats
      const newProficiencyBonus = Math.ceil(newLevel / 4) + 1;
      const newSystemFavorDie = newLevel <= 4 ? 4 : newLevel <= 10 ? 6 : newLevel <= 16 ? 8 : 10;
      const newSystemFavorMax = newLevel <= 4 ? 3 : newLevel <= 10 ? 4 : newLevel <= 16 ? 5 : 6;
      const newHP = character.hp_max + hpIncrease;
      const newHitDiceMax = newLevel;

      // Update character
      await updateCharacter.mutateAsync({
        id: character.id,
        data: {
          level: newLevel,
          proficiency_bonus: newProficiencyBonus,
          hp_max: newHP,
          hp_current: character.hp_current + hpIncrease, // Add HP increase to current
          hit_dice_max: newHitDiceMax,
          hit_dice_current: newHitDiceMax, // Restore on level up
          system_favor_die: newSystemFavorDie,
          system_favor_max: newSystemFavorMax,
          system_favor_current: newSystemFavorMax, // Restore on level up
        },
      });

      // Add new features
      for (const featureId of selectedFeatures) {
        const feature = newFeatures.find(f => f.id === featureId);
        if (feature) {
          // Calculate uses if formula exists
          let usesMax: number | null = null;
          if (feature.uses_formula) {
            // Parse formula like "proficiency bonus" or "level"
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

      // Check for new powers available at this level
      if (character.job) {
        const { data: job } = await supabase
          .from('compendium_jobs')
          .select('id, name')
          .eq('name', character.job)
          .maybeSingle();

        if (job) {
          // Get powers available to this job at or below new level
          const { data: availablePowers } = await supabase
            .from('compendium_powers')
            .select('*')
            .contains('job_names', [character.job])
            .lte('power_level', Math.floor(newLevel / 2)); // Powers scale with level

          // Check which powers character already has
          const { data: existingPowers } = await supabase
            .from('character_powers')
            .select('name')
            .eq('character_id', character.id);

          const existingPowerNames = new Set(existingPowers?.map(p => p.name) || []);

          // Add new powers that character doesn't have yet
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
                  is_prepared: false, // Don't auto-prepare
                  is_known: true,
                });
              }
            }
          }
        }
      }

      toast({
        title: 'Level up complete!',
        description: `${character.name} is now level ${newLevel}!`,
      });

      navigate(`/characters/${character.id}`);
    } catch (error) {
      // Error is handled by React Query's error state
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
    const roll = Math.floor(Math.random() * hitDieSize) + 1;
    setHpIncrease(roll + vitModifier);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate(`/characters/${character.id}`)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Character
        </Button>

        <SystemWindow title={`LEVEL UP: ${character.name.toUpperCase()}`} className="border-primary/50">
          <div className="space-y-6">
            {/* Level Selection */}
            <div>
              <Label>New Level</Label>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm text-muted-foreground">Current: {character.level}</span>
                <span className="text-lg font-display">→</span>
                <Input
                  type="number"
                  min={character.level + 1}
                  max={20}
                  value={newLevel}
                  onChange={(e) => setNewLevel(Math.min(20, Math.max(character.level + 1, parseInt(e.target.value) || character.level + 1)))}
                  className="w-20"
                />
              </div>
            </div>

            {/* HP Increase */}
            <div>
              <Label>Hit Point Increase</Label>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex-1">
                  <Input
                    type="number"
                    min={1}
                    max={maxHP}
                    value={hpIncrease || ''}
                    onChange={(e) => setHpIncrease(parseInt(e.target.value) || null)}
                    placeholder={`Average: ${averageHP}`}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Roll d{hitDieSize} + {vitModifier >= 0 ? '+' : ''}{vitModifier} (VIT modifier)
                    {' '}|
                    {' '}Range: {1 + vitModifier} - {maxHP} | Average: {averageHP}
                  </p>
                </div>
                <Button variant="outline" onClick={rollHP} className="gap-2">
                  <Zap className="w-4 h-4" />
                  Roll
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setHpIncrease(averageHP)}
                  className="gap-2"
                >
                  <Heart className="w-4 h-4" />
                  Average
                </Button>
              </div>
            </div>

            {/* New Features */}
            {newFeatures.length > 0 && (
              <div>
                <Label>New Features at Level {newLevel}</Label>
                <div className="space-y-3 mt-2">
                  {newFeatures.map((feature) => (
                    <div
                      key={feature.id}
                      className={cn(
                        "p-4 rounded-lg border transition-colors",
                        selectedFeatures.includes(feature.id)
                          ? "border-primary bg-primary/10"
                          : "border-border bg-muted/30"
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
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Label
                              htmlFor={`feature-${feature.id}`}
                              className="font-heading font-semibold cursor-pointer"
                            >
                              {feature.name}
                            </Label>
                            {feature.action_type && (
                              <Badge variant="secondary" className="text-xs">
                                {feature.action_type}
                              </Badge>
                            )}
                            {feature.uses_formula && (
                              <Badge variant="outline" className="text-xs">
                                {feature.uses_formula}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                          {feature.prerequisites && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Prerequisites: {feature.prerequisites}
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
            <div className="p-4 rounded-lg bg-muted/30">
              <h4 className="font-heading font-semibold mb-3">Stat Changes</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Proficiency Bonus:</span>
                  <span className="ml-2 font-display">
                    +{Math.ceil(character.level / 4) + 1} → +{Math.ceil(newLevel / 4) + 1}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">System Favor Die:</span>
                  <span className="ml-2 font-display">
                    d{character.system_favor_die} → d{newLevel <= 4 ? 4 : newLevel <= 10 ? 6 : newLevel <= 16 ? 8 : 10}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Max HP:</span>
                  <span className="ml-2 font-display">
                    {character.hp_max} → {character.hp_max + (hpIncrease || 0)}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Hit Dice:</span>
                  <span className="ml-2 font-display">
                    {character.hit_dice_max} → {newLevel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </SystemWindow>

        <div className="flex justify-end gap-4 mt-6">
          <Button
            variant="outline"
            onClick={() => navigate(`/characters/${character.id}`)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleLevelUp}
            disabled={loading || hpIncrease === null || newLevel <= character.level}
            className="gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Leveling Up...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
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

