import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCreateCharacter } from '@/hooks/useCharacters';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { calculateHPMax } from '@/lib/characterCalculations';
import { ABILITY_NAMES, type AbilityScore } from '@/types/system-rules';
import type { Database } from '@/integrations/supabase/types';
import { isLocalCharacterId, setLocalAbilities } from '@/lib/guestStore';
import { formatMonarchVernacular } from '@/lib/vernacular';
import { isSafeNextPath } from '@/lib/campaignInviteUtils';
import { filterRowsBySourcebookAccess } from '@/lib/sourcebookAccess';
import { usePublishedHomebrew } from '@/hooks/useHomebrewContent';
import { Badge } from '@/components/ui/badge';

type Job = Database['public']['Tables']['compendium_jobs']['Row'] & {
  display_name?: string | null;
};
type Path = Database['public']['Tables']['compendium_job_paths']['Row'] & {
  display_name?: string | null;
};
type Background = Database['public']['Tables']['compendium_backgrounds']['Row'] & {
  display_name?: string | null;
};
type DbAbilityScore = Database['public']['Enums']['ability_score'];

type Step = 'concept' | 'abilities' | 'job' | 'path' | 'background' | 'review';

const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];
const POINT_BUY_COST: Record<number, number> = {
  8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9,
};
const POINT_BUY_TOTAL = 27;

const getPointBuyCost = (score: number) => POINT_BUY_COST[score] ?? 0;

const CharacterNew = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedNext = searchParams.get('next');
  const safeNext = isSafeNextPath(requestedNext) ? requestedNext : null;
  const { toast } = useToast();
  const createCharacter = useCreateCharacter();
  const [currentStep, setCurrentStep] = useState<Step>('concept');
  const [loading, setLoading] = useState(false);

  // Character data state
  const [name, setName] = useState('');
  const [appearance, setAppearance] = useState('');
  const [backstory, setBackstory] = useState('');
  const [abilityMethod, setAbilityMethod] = useState<'standard' | 'point-buy' | 'manual'>('standard');
  const [rolledStats, setRolledStats] = useState<number[]>([]);
  const [abilities, setAbilities] = useState<Record<AbilityScore, number>>({
    STR: 10,
    AGI: 10,
    VIT: 10,
    INT: 10,
    SENSE: 10,
    PRE: 10,
  });
  const [selectedJob, setSelectedJob] = useState<string>('');
  const [selectedPath, setSelectedPath] = useState<string>('');
  const [selectedBackground, setSelectedBackground] = useState<string>('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const pointBuySpent =
    abilityMethod === 'point-buy'
      ? Object.values(abilities).reduce((sum, score) => sum + getPointBuyCost(score), 0)
      : 0;
  const pointBuyRemaining = POINT_BUY_TOTAL - pointBuySpent;
  const isPointBuyValid = abilityMethod !== 'point-buy' || pointBuyRemaining >= 0;

  // Reset skills when job changes
  const handleJobChange = (jobId: string) => {
    setSelectedJob(jobId);
    setSelectedPath('');
    setSelectedSkills([]); // Reset skills when job changes
  };

  // Fetch jobs
  const { data: jobs = [] } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('compendium_jobs')
        .select('*')
        .order('name');
      if (error) throw error;

      const filteredJobs = await filterRowsBySourcebookAccess(
        (data || []) as Job[],
        (job) => job.source_book
      );

      return filteredJobs;
    },
  });

  // Fetch paths for selected job
  const { data: paths = [] } = useQuery({
    queryKey: ['paths', selectedJob],
    queryFn: async () => {
      if (!selectedJob) return [];
      const { data, error } = await supabase
        .from('compendium_job_paths')
        .select('*')
        .eq('job_id', selectedJob)
        .order('name');
      if (error) throw error;

      return filterRowsBySourcebookAccess((data || []) as Path[], (path) => path.source_book);
    },
    enabled: !!selectedJob,
  });

  const pathUnlockLevel = useMemo(() => {
    const levels = paths
      .map((p) => (typeof (p as { path_level?: number }).path_level === 'number' ? (p as { path_level?: number }).path_level : null))
      .filter((l): l is number => l !== null);
    if (levels.length === 0) return null;
    return Math.min(...levels);
  }, [paths]);

  const pathsAvailableAtCreation = useMemo(() => {
    if (pathUnlockLevel !== 1) return [];
    return paths;
  }, [paths, pathUnlockLevel]);

  const isPathStepEnabled = pathUnlockLevel === 1 && pathsAvailableAtCreation.length > 0;
  const isPathRequiredAtCreation = isPathStepEnabled;

  // Fetch backgrounds
  const { data: backgrounds = [] } = useQuery({
    queryKey: ['backgrounds'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('compendium_backgrounds')
        .select('*')
        .order('name');
      if (error) throw error;

      const filteredBackgrounds = await filterRowsBySourcebookAccess(
        (data || []) as Background[],
        (background) => background.source_book
      );

      return filteredBackgrounds;
    },
  });

  // Merge published homebrew jobs and backgrounds into picker arrays
  const { data: homebrewJobs = [] } = usePublishedHomebrew('job');
  const { data: homebrewBackgrounds = [] } = usePublishedHomebrew('item');

  const allJobs = [
    ...jobs,
    ...homebrewJobs.map((hb) => ({
      id: `homebrew:${hb.id}`,
      name: hb.name,
      display_name: hb.name,
      description: hb.description,
      hit_die: (hb.data.hit_die as number) || 8,
      primary_abilities: (hb.data.primary_abilities as string[]) || [],
      skill_choices: (hb.data.skill_choices as string[]) || [],
      skill_choice_count: (hb.data.skill_choice_count as number) || 2,
      source_book: hb.source_book,
      _homebrew: true,
    } as Job & { _homebrew?: boolean })),
  ];

  const allBackgrounds = [
    ...backgrounds,
    ...homebrewBackgrounds
      .filter((hb) => hb.content_type === 'item' && (hb.data.sub_type === 'background' || hb.tags?.includes('background')))
      .map((hb) => ({
        id: `homebrew:${hb.id}`,
        name: hb.name,
        display_name: hb.name,
        description: hb.description,
        source_book: hb.source_book,
        _homebrew: true,
      } as Background & { _homebrew?: boolean })),
  ];

  // Get selected job data
  const jobData = allJobs.find(j => j.id === selectedJob) as (Job & { _homebrew?: boolean }) | undefined;

  const steps: { id: Step; name: string }[] = [
    { id: 'concept', name: 'Concept' },
    { id: 'abilities', name: 'Abilities' },
    { id: 'job', name: 'Job' },
    ...(isPathStepEnabled ? ([{ id: 'path', name: 'Path' }] as const) : []),
    { id: 'background', name: 'Background' },
    { id: 'review', name: 'Review' },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  const handleStandardArray = () => {
    const scores = [...STANDARD_ARRAY].sort((a, b) => b - a);
    const newAbilities: Record<AbilityScore, number> = {
      STR: scores[0] || 10,
      AGI: scores[1] || 10,
      VIT: scores[2] || 10,
      INT: scores[3] || 10,
      SENSE: scores[4] || 10,
      PRE: scores[5] || 10,
    };
    setAbilities(newAbilities);
  };

  const handleRollStats = () => {
    // Roll 4d6, drop lowest, repeat 6 times
    const roll4d6 = () => {
      const rolls = [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1];
      rolls.sort((a, b) => b - a);
      return rolls[0] + rolls[1] + rolls[2]; // Sum of top 3
    };
    const newRolledStats = Array.from({ length: 6 }, () => roll4d6()).sort((a, b) => b - a);
    setRolledStats(newRolledStats);
    const newAbilities: Record<AbilityScore, number> = {
      STR: newRolledStats[0] || 10,
      AGI: newRolledStats[1] || 10,
      VIT: newRolledStats[2] || 10,
      INT: newRolledStats[3] || 10,
      SENSE: newRolledStats[4] || 10,
      PRE: newRolledStats[5] || 10,
    };
    setAbilities(newAbilities);
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].id);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].id);
    }
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      toast({
        title: 'Name required',
        description: 'Please enter your Ascendant\'s name.',
        variant: 'destructive',
      });
      return;
    }

    if (!selectedJob) {
      toast({
        title: 'Job required',
        description: 'Please select a job.',
        variant: 'destructive',
      });
      return;
    }

    if (!selectedBackground) {
      toast({
        title: 'Background required',
        description: 'Please select a background.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const job = jobs.find(j => j.id === selectedJob);
      if (!job) {
        toast({
          title: 'Job not found',
          description: 'Please re-select your job before continuing.',
          variant: 'destructive',
        });
        return;
      }

      const selectedBackgroundData = backgrounds.find((background) => background.id === selectedBackground);
      if (!selectedBackgroundData) {
        toast({
          title: 'Background not found',
          description: 'Please re-select your background before continuing.',
          variant: 'destructive',
        });
        return;
      }

      // Calculate initial stats
      const level = 1;
      const proficiencyBonus = Math.ceil(level / 4) + 1;
      const vitModifier = Math.floor((abilities.VIT - 10) / 2);
      const hpMax = calculateHPMax(level, job.hit_die, vitModifier);
      const agiModifier = Math.floor((abilities.AGI - 10) / 2);
      const baseAC = 10 + agiModifier;
      const initiative = agiModifier;
      const systemFavorDie = 4; // Level 1-4

      // Create character
      const selectedPathRow = selectedPath && selectedPath !== 'none'
        ? pathsAvailableAtCreation.find((p: Path) => p.id === selectedPath)
        : null;

      const character = await createCharacter.mutateAsync({
        name: name.trim(),
        level: 1,
        job: job.name,
        path: selectedPathRow?.name || null,
        background: selectedBackgroundData.name,
        appearance: appearance.trim() || null,
        backstory: backstory.trim() || null,
        proficiency_bonus: proficiencyBonus,
        armor_class: baseAC,
        speed: 30,
        initiative: initiative,
        hp_current: hpMax,
        hp_max: hpMax,
        hp_temp: 0,
        hit_dice_current: 1,
        hit_dice_max: 1,
        hit_dice_size: job.hit_die,
        system_favor_current: 3,
        system_favor_max: 3,
        system_favor_die: systemFavorDie,
        saving_throw_proficiencies: job.saving_throw_proficiencies || [],
        skill_proficiencies: [
          ...selectedSkills,
          ...(selectedBackgroundData.skill_proficiencies || []),
        ],
        skill_expertise: [],
        armor_proficiencies: job.armor_proficiencies || [],
        weapon_proficiencies: job.weapon_proficiencies || [],
        tool_proficiencies: [
          ...(job.tool_proficiencies || []),
          ...(selectedBackgroundData.tool_proficiencies || []),
        ],
        conditions: [],
        exhaustion_level: 0,
      });

      // Add level 1 features from compendium
      const {
        addLevel1Features,
        addBackgroundFeatures,
        addStartingEquipment,
        addStartingPowers,
        addJobAwakeningBenefitsForLevel,
        getJobASI,
      } = await import('@/lib/characterCreation');

      // Apply job awakening ASI bonuses to ability scores
      const jobASI = getJobASI(job.name);
      const finalAbilities = { ...abilities };
      for (const [abilityKey, bonus] of Object.entries(jobASI)) {
        const key = abilityKey as AbilityScore;
        if (key in finalAbilities) {
          finalAbilities[key] += bonus;
        }
      }

      // Update abilities (with job ASI applied)
      if (isLocalCharacterId(character.id)) {
        setLocalAbilities(character.id, finalAbilities as unknown as Record<DbAbilityScore, number>);
      } else {
        const abilityUpdates = Object.entries(finalAbilities).map(([ability, score]) => ({
          character_id: character.id,
          ability: ability as AbilityScore,
          score: score,
        }));
        await supabase
          .from('character_abilities')
          .upsert(abilityUpdates, { onConflict: 'character_id,ability' });
      }
      await addLevel1Features(character.id, job.id, selectedPathRow?.id);
      await addJobAwakeningBenefitsForLevel(character.id, job.name, 1);

      // Add background features and equipment (background is required)
      await addBackgroundFeatures(character.id, selectedBackgroundData);
      await addStartingEquipment(character.id, job, selectedBackgroundData);

      // Add starting powers/cantrips for caster jobs
      await addStartingPowers(character.id, job);

      // D&D Beyond parity: auto-calculate derived stats after all creation data is saved
      if (!isLocalCharacterId(character.id)) {
        try {
          const { autoRecalcDerivedStats, autoApplyEquipmentModifiers } = await import('@/lib/automation');
          await Promise.all([
            autoRecalcDerivedStats(character.id),
            autoApplyEquipmentModifiers(character.id),
          ]);
        } catch {
          // Best-effort — don't block creation
        }
      }

      // If any level-1 features require selections, prompt the player to complete them.
      try {
        const { data: level1Features } = await supabase
          .from('compendium_job_features')
          .select('id')
          .eq('job_id', job.id)
          .eq('level', 1);

        const featureIds = (level1Features || []).map((row) => row.id).filter(Boolean);
        if (featureIds.length > 0) {
          const { data: groups } = await (supabase as any)
            .from('compendium_feature_choice_groups')
            .select('id')
            .in('feature_id', featureIds);

          const groupIds = ((groups || []) as Array<{ id: string }>).map((g) => g.id);
          if (groupIds.length > 0) {
            toast({
              title: 'Selection Protocol Required',
              description: 'The System detected pending selections. Open your Ascendant sheet to bind them.',
            });
          }
        }
      } catch {
        // Best-effort only; do not block creation if metadata is missing.
      }

      toast({
        title: 'Ascendant Awakened!',
        description: `${name} has awakened successfully. The System has granted features and equipment.`,
      });

      navigate(safeNext ?? `/characters/${character.id}`);
    } catch {
      // Error is handled by React Query's error state
      toast({
        title: 'Awakening Failed',
        description: 'The System could not awaken your Ascendant. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'concept':
        return name.trim().length > 0;
      case 'abilities':
        return isPointBuyValid;
      case 'job':
        if (!selectedJob.length) return false;
        // Check if skill selection is required and complete
        if (jobData?.skill_choices && jobData.skill_choices.length > 0) {
          return selectedSkills.length === jobData.skill_choice_count;
        }
        return true;
      case 'path':
        if (!isPathStepEnabled) return true;
        if (!isPathRequiredAtCreation) return true;
        return !!selectedPath && selectedPath !== 'none';
      case 'background':
        return selectedBackground.length > 0; // Required
      case 'review':
        return true;
      default:
        return false;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate(safeNext ?? '/characters')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Characters
        </Button>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-display text-sm mb-2 transition-colors",
                      index <= currentStepIndex
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {index < currentStepIndex ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className={cn(
                    "text-xs font-heading text-center",
                    index <= currentStepIndex ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "h-0.5 flex-1 mx-2 mb-6",
                    index < currentStepIndex ? "bg-primary" : "bg-muted"
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <SystemWindow title={steps[currentStepIndex].name.toUpperCase()}>
          {currentStep === 'concept' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Character Name *</Label>
                <Input
                  id="name"
                  data-testid="character-name"
                  value={name || ''}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter Ascendant name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="appearance">Appearance</Label>
                <Input
                  id="appearance"
                  value={appearance || ''}
                  onChange={(e) => setAppearance(e.target.value)}
                  placeholder="Brief physical description"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="backstory">Backstory</Label>
                <Textarea
                  id="backstory"
                  value={backstory || ''}
                  onChange={(e) => setBackstory(e.target.value)}
                  placeholder="Ascendant background and history in the post-reset world"
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {currentStep === 'abilities' && (
            <div className="space-y-6">
              <div className="flex gap-4 flex-wrap">
                <Button
                  variant={abilityMethod === 'standard' ? 'default' : 'outline'}
                  onClick={() => {
                    setAbilityMethod('standard');
                    handleStandardArray();
                  }}
                >
                  Standard Array
                </Button>
                <Button
                  variant={abilityMethod === 'point-buy' ? 'default' : 'outline'}
                  onClick={() => setAbilityMethod('point-buy')}
                >
                  Point Buy (27 points)
                </Button>
                <Button
                  variant={abilityMethod === 'manual' ? 'default' : 'outline'}
                  onClick={() => {
                    setAbilityMethod('manual');
                    setRolledStats([]);
                  }}
                >
                  Manual/Rolled
                </Button>
              </div>
              {abilityMethod === 'point-buy' && (
                <div
                  className={cn(
                    'text-sm font-heading',
                    pointBuyRemaining < 0 ? 'text-destructive' : 'text-muted-foreground'
                  )}
                >
                  Points remaining: {pointBuyRemaining} / {POINT_BUY_TOTAL}
                </div>
              )}

              {abilityMethod === 'manual' && (
                <div className="space-y-4">
                  <div className="flex gap-4 items-center">
                    <Button
                      variant="outline"
                      onClick={handleRollStats}
                    >
                      Roll 4d6 (Drop Lowest)
                    </Button>
                    {rolledStats.length > 0 && (
                      <div className="text-sm font-heading">
                        Rolled: {rolledStats.join(', ')} - Assign these to abilities below
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <div key={`stat-input-${index}`}>
                        <Label>Stat {index + 1}</Label>
                        <Input
                          type="number"
                          min={3}
                          max={18}
                          value={rolledStats[index] || 0}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 0;
                            const newStats = [...rolledStats];
                            newStats[index] = value;
                            setRolledStats(newStats);
                          }}
                          className="mt-1"
                          placeholder="Enter or roll"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter 6 ability scores manually, or roll 4d6 (drop lowest) for each stat. Then assign them to abilities below.
                  </p>
                </div>
              )}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {(Object.keys(ABILITY_NAMES) as AbilityScore[]).map((ability) => (
                  <div key={ability}>
                    <Label>{ABILITY_NAMES[ability]}</Label>
                    {abilityMethod === 'manual' && rolledStats.length > 0 && (
                      <div className="flex gap-1 mb-1">
                        {rolledStats.map((stat, index) => (
                          <Button
                            key={`stat-option-${stat}-${index}`}
                            variant="outline"
                            size="sm"
                            className="text-xs h-6 px-2"
                            onClick={() => {
                              const newAbilities = { ...abilities, [ability]: stat };
                              setAbilities(newAbilities);
                              // Remove used stat
                              const newStats = rolledStats.filter((_, i) => i !== index);
                              setRolledStats(newStats);
                            }}
                            disabled={Object.values(abilities).includes(stat)}
                          >
                            {stat}
                          </Button>
                        ))}
                      </div>
                    )}
                    <Input
                      type="number"
                      min={abilityMethod === 'point-buy' ? 8 : abilityMethod === 'manual' ? 3 : undefined}
                      max={abilityMethod === 'point-buy' ? 15 : abilityMethod === 'manual' ? 18 : undefined}
                      value={abilities[ability] || 8}
                      onChange={(e) => {
                        const raw = parseInt(e.target.value, 10);
                        const fallback = abilityMethod === 'manual' ? 3 : 8;
                        let value = Number.isNaN(raw) ? fallback : raw;

                        if (abilityMethod === 'point-buy') {
                          value = Math.max(8, Math.min(15, value));
                          const nextSpent =
                            pointBuySpent - getPointBuyCost(abilities[ability]) + getPointBuyCost(value);
                          if (nextSpent > POINT_BUY_TOTAL) {
                            toast({
                              title: 'Point-buy limit reached',
                              description: 'You only have 27 points to spend.',
                              variant: 'destructive',
                            });
                            return;
                          }
                        }

                        setAbilities({ ...abilities, [ability]: value });
                      }}
                      className="mt-1"
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      Modifier: {Math.floor((abilities[ability] - 10) / 2) >= 0 ? '+' : ''}
                      {Math.floor((abilities[ability] - 10) / 2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 'job' && (
            <div className="space-y-4">
              <Label>Select Job *</Label>
              <Select value={selectedJob} onValueChange={handleJobChange} data-testid="character-job">
                <SelectTrigger>
                  <SelectValue placeholder="Choose a job..." />
                </SelectTrigger>
                <SelectContent>
                  {allJobs.map((job) => (
                    <SelectItem key={job.id} value={job.id}>
                      {formatMonarchVernacular(job.display_name || job.name)}
                      {(job as Job & { _homebrew?: boolean })._homebrew && (
                        <Badge variant="outline" className="ml-2 text-xs">Homebrew</Badge>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {jobData && (
                <div className="mt-4 p-4 rounded-lg bg-muted/30">
                  <h4 className="font-heading font-semibold mb-2">{formatMonarchVernacular(jobData.display_name || jobData.name)}</h4>
                  <p className="text-sm text-muted-foreground">{formatMonarchVernacular(jobData.description)}</p>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Hit Die: d{jobData.hit_die} | Primary: {jobData.primary_abilities.map(formatMonarchVernacular).join(', ')}
                  </div>
                </div>
              )}
              {jobData && jobData.skill_choices && jobData.skill_choices.length > 0 && (
                <div className="mt-4 space-y-2">
                  <Label>
                    Select {jobData.skill_choice_count} Skill{jobData.skill_choice_count > 1 ? 's' : ''} *
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {jobData.skill_choices.map((skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox
                          id={`skill-${skill}`}
                          checked={selectedSkills.includes(skill)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              if (selectedSkills.length < jobData.skill_choice_count) {
                                setSelectedSkills([...selectedSkills, skill]);
                              }
                            } else {
                              setSelectedSkills(selectedSkills.filter(s => s !== skill));
                            }
                          }}
                          disabled={!selectedSkills.includes(skill) && selectedSkills.length >= jobData.skill_choice_count}
                        />
                        <label htmlFor={`skill-${skill}`} className="text-sm font-heading cursor-pointer">
                          {formatMonarchVernacular(skill)}
                        </label>
                      </div>
                    ))}
                  </div>
                  {selectedSkills.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Selected: {selectedSkills.map(formatMonarchVernacular).join(', ')} ({selectedSkills.length}/{jobData.skill_choice_count})
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {currentStep === 'path' && (
            <div className="space-y-4">
              {!selectedJob ? (
                <p className="text-sm text-muted-foreground">
                  Please select a job first to see available paths.
                </p>
              ) : !isPathStepEnabled ? (
                <>
                  <Label>Select Path</Label>
                  <p className="text-sm text-muted-foreground">
                    This job unlocks its path later (level {pathUnlockLevel ?? 3}). You will choose it when you reach that level.
                  </p>
                </>
              ) : pathsAvailableAtCreation.length === 0 ? (
                <>
                  <Label>Select Path (Optional - No paths available for this job)</Label>
                  <p className="text-sm text-muted-foreground">
                    This job doesn't have any paths available yet. You can select a path later when leveling up.
                  </p>
                </>
              ) : (
                <>
                  <Label>Select Path *</Label>
                  <Select value={selectedPath} onValueChange={setSelectedPath} data-testid="character-path">
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a path..." />
                    </SelectTrigger>
                    <SelectContent>
                      {pathsAvailableAtCreation.map((path: Path) => (
                        <SelectItem key={path.id} value={path.id}>
                          {formatMonarchVernacular((path as { display_name?: string | null }).display_name || path.name)}
                          {(path as any)._marketplace && (
                            <Badge variant="outline" className="ml-2 text-xs">Marketplace</Badge>
                          )}
                          {(path as any)._homebrew && (
                            <Badge variant="outline" className="ml-2 text-xs">Homebrew</Badge>
                          )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedPath && selectedPath !== 'none' && (
                    <div className="mt-4 p-4 rounded-lg bg-muted/30">
                      <h4 className="font-heading font-semibold mb-2">
                        {formatMonarchVernacular((pathsAvailableAtCreation.find((p: Path) => p.id === selectedPath) as { name?: string; display_name?: string | null } | undefined)?.display_name || pathsAvailableAtCreation.find((p: Path) => p.id === selectedPath)?.name || '')}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {formatMonarchVernacular(pathsAvailableAtCreation.find((p: Path) => p.id === selectedPath)?.description || '')}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {currentStep === 'background' && (
            <div className="space-y-4">
              <Label>Select Background *</Label>
              <Select value={selectedBackground} onValueChange={setSelectedBackground} data-testid="character-background">
                <SelectTrigger>
                  <SelectValue placeholder="Choose a background..." />
                </SelectTrigger>
                <SelectContent>
                  {allBackgrounds.map((bg) => (
                    <SelectItem key={bg.id} value={bg.id}>
                      {formatMonarchVernacular((bg as Background & { display_name?: string | null }).display_name || bg.name)}
                      {(bg as Background & { _marketplace?: boolean })._marketplace && (
                        <Badge variant="outline" className="ml-2 text-xs">Marketplace</Badge>
                      )}
                      {(bg as Background & { _homebrew?: boolean })._homebrew && (
                        <Badge variant="outline" className="ml-2 text-xs">Homebrew</Badge>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedBackground && (
                <div className="mt-4 p-4 rounded-lg bg-muted/30 space-y-3">
                  <div>
                    <h4 className="font-heading font-semibold mb-2">
                      {formatMonarchVernacular((backgrounds.find(b => b.id === selectedBackground) as { name?: string; display_name?: string | null } | undefined)?.display_name || backgrounds.find(b => b.id === selectedBackground)?.name || '')}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {formatMonarchVernacular(backgrounds.find(b => b.id === selectedBackground)?.description || '')}
                    </p>
                  </div>
                  {(() => {
                    const bg = backgrounds.find(b => b.id === selectedBackground);
                    return bg?.skill_proficiencies && bg.skill_proficiencies.length > 0;
                  })() && (() => {
                    const bg = backgrounds.find(b => b.id === selectedBackground);
                    return (
                      <div className="text-xs text-muted-foreground">
                        <strong>Skill Proficiencies:</strong> {bg?.skill_proficiencies?.map(formatMonarchVernacular).join(', ') || ''}
                      </div>
                    );
                  })()}
                  {(() => {
                    const bg = backgrounds.find(b => b.id === selectedBackground);
                    return bg?.tool_proficiencies && bg.tool_proficiencies.length > 0;
                  })() && (() => {
                    const bg = backgrounds.find(b => b.id === selectedBackground);
                    return (
                      <div className="text-xs text-muted-foreground">
                        <strong>Tool Proficiencies:</strong> {bg?.tool_proficiencies?.map(formatMonarchVernacular).join(', ') || ''}
                      </div>
                    );
                  })()}
                  {backgrounds.find(b => b.id === selectedBackground)?.language_count && (backgrounds.find(b => b.id === selectedBackground)?.language_count ?? 0) > 0 && (
                    <div className="text-xs text-muted-foreground">
                      <strong>Languages:</strong> {(backgrounds.find(b => b.id === selectedBackground)?.language_count ?? 0)} additional language{(backgrounds.find(b => b.id === selectedBackground)?.language_count ?? 0) > 1 ? 's' : ''}
                    </div>
                  )}
                  {backgrounds.find(b => b.id === selectedBackground)?.starting_equipment && (
                    <div className="text-xs text-muted-foreground">
                      <strong>Starting Equipment:</strong> {formatMonarchVernacular(backgrounds.find(b => b.id === selectedBackground)!.starting_equipment || '')}
                    </div>
                  )}
                  {backgrounds.find(b => b.id === selectedBackground)?.starting_credits && (
                    <div className="text-xs text-muted-foreground">
                      <strong>Starting Credits:</strong> {backgrounds.find(b => b.id === selectedBackground)!.starting_credits}
                    </div>
                  )}
                  {backgrounds.find(b => b.id === selectedBackground)?.feature_name && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="text-xs font-heading font-semibold mb-1">
                        {formatMonarchVernacular(backgrounds.find(b => b.id === selectedBackground)!.feature_name || '')}
                      </div>
                      {backgrounds.find(b => b.id === selectedBackground)?.feature_description && (
                        <div className="text-xs text-muted-foreground">
                          {formatMonarchVernacular(backgrounds.find(b => b.id === selectedBackground)!.feature_description || '')}
                        </div>
                      )}
                    </div>
                  )}
                  {(() => {
                    const bg = backgrounds.find(b => b.id === selectedBackground);
                    const hasSuggestedChars = (bg?.personality_traits && bg.personality_traits.length > 0)
                      || (bg?.ideals && bg.ideals.length > 0)
                      || (bg?.bonds && bg.bonds.length > 0)
                      || (bg?.flaws && bg.flaws.length > 0);
                    if (!hasSuggestedChars) return null;
                    return (
                      <div className="mt-3 pt-3 border-t border-border space-y-2">
                        <div className="text-xs font-heading font-semibold">Suggested Characteristics</div>
                        {bg?.personality_traits && bg.personality_traits.length > 0 && (
                          <div className="text-xs text-muted-foreground">
                            <strong>Personality Traits:</strong>
                            <ul className="mt-1 ml-4 list-disc space-y-0.5">
                              {bg.personality_traits.map((t, i) => <li key={i}>{formatMonarchVernacular(t)}</li>)}
                            </ul>
                          </div>
                        )}
                        {bg?.ideals && bg.ideals.length > 0 && (
                          <div className="text-xs text-muted-foreground">
                            <strong>Ideals:</strong>
                            <ul className="mt-1 ml-4 list-disc space-y-0.5">
                              {bg.ideals.map((t, i) => <li key={i}>{formatMonarchVernacular(t)}</li>)}
                            </ul>
                          </div>
                        )}
                        {bg?.bonds && bg.bonds.length > 0 && (
                          <div className="text-xs text-muted-foreground">
                            <strong>Bonds:</strong>
                            <ul className="mt-1 ml-4 list-disc space-y-0.5">
                              {bg.bonds.map((t, i) => <li key={i}>{formatMonarchVernacular(t)}</li>)}
                            </ul>
                          </div>
                        )}
                        {bg?.flaws && bg.flaws.length > 0 && (
                          <div className="text-xs text-muted-foreground">
                            <strong>Flaws:</strong>
                            <ul className="mt-1 ml-4 list-disc space-y-0.5">
                              {bg.flaws.map((t, i) => <li key={i}>{formatMonarchVernacular(t)}</li>)}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

          {currentStep === 'review' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-heading font-semibold mb-2">Character Summary</h3>
                <div className="space-y-2 text-sm">
                  <div><strong>Name:</strong> {name || 'Unnamed'}</div>
                  <div><strong>Job:</strong> {jobData ? formatMonarchVernacular(jobData.display_name || jobData.name) : 'None'}</div>
                  <div><strong>Path:</strong> {formatMonarchVernacular((pathsAvailableAtCreation.find((p: Path) => p.id === selectedPath) as { name?: string; display_name?: string | null } | undefined)?.display_name || pathsAvailableAtCreation.find((p: Path) => p.id === selectedPath)?.name || 'None')}</div>
                  <div><strong>Background:</strong> {formatMonarchVernacular((backgrounds.find(b => b.id === selectedBackground) as { name?: string; display_name?: string | null } | undefined)?.display_name || backgrounds.find(b => b.id === selectedBackground)?.name || 'None')}</div>
                </div>
              </div>
              <div>
                <h3 className="font-heading font-semibold mb-2">Ability Scores</h3>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  {(Object.keys(ABILITY_NAMES) as AbilityScore[]).map((ability) => (
                    <div key={ability} className="flex justify-between">
                      <span>{ABILITY_NAMES[ability]}:</span>
                      <span className="font-display">
                        {abilities[ability]} ({Math.floor((abilities[ability] - 10) / 2) >= 0 ? '+' : ''}
                        {Math.floor((abilities[ability] - 10) / 2)})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {jobData && (
                <div>
                  <h3 className="font-heading font-semibold mb-2">Starting Stats (Level 1)</h3>
                  <div className="text-sm space-y-1">
                    <div><strong>HP:</strong> {calculateHPMax(1, jobData.hit_die, Math.floor((abilities.VIT - 10) / 2))}</div>
                    <div><strong>AC:</strong> {10 + Math.floor((abilities.AGI - 10) / 2)}</div>
                    <div><strong>Proficiency Bonus:</strong> +2</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </SystemWindow>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStepIndex === 0}
          >
            Back
          </Button>
          {currentStepIndex < steps.length - 1 ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleCreate}
              disabled={!canProceed() || loading}
              className="gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Character'
              )}
            </Button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CharacterNew;

