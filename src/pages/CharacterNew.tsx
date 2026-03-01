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
import { useCharacterTemplates, type CharacterTemplate } from '@/hooks/useCharacterTemplates';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { calculateHPMax } from '@/lib/characterCalculations';
import { ABILITY_NAMES, type AbilityScore } from '@/types/system-rules';
import { RegentSelection } from '@/components/character/RegentSelection';
import { monarchs } from '@/data/compendium/monarchs';
import { useGlobalDDBeyondIntegration } from '@/hooks/useGlobalDDBeyondIntegration';

// Map standard D&D ability names to System Ascendant names
const mapAbilityToSA = (ability: string): AbilityScore => {
  const mapping: Record<string, AbilityScore> = {
    'Strength': 'STR',
    'Dexterity': 'AGI',
    'Constitution': 'VIT',
    'Intelligence': 'INT',
    'Wisdom': 'SENSE',
    'Charisma': 'PRE',
  };
  return mapping[ability] || 'STR';
};
import type { Database } from '@/integrations/supabase/types';
import { isLocalCharacterId, setLocalAbilities } from '@/lib/guestStore';
import { formatMonarchVernacular } from '@/lib/vernacular';
import { isSafeNextPath } from '@/lib/campaignInviteUtils';
import { filterRowsBySourcebookAccess } from '@/lib/sourcebookAccess';
import { usePublishedHomebrew } from '@/hooks/useHomebrewContent';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { calculateTotalChoices, getChoiceGrantDetails, type TotalChoices } from '@/lib/choiceCalculations';
import { jobs as staticJobs } from '@/data/compendium/jobs';
import { getJobASI } from '@/lib/characterCreation';

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

type Step = 'concept' | 'abilities' | 'job' | 'path' | 'background' | 'equipment' | 'review';

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
  const { data: templates } = useCharacterTemplates();
  const { usePlayerToolsEnhancements } = useGlobalDDBeyondIntegration();
  const ddbEnhancements = usePlayerToolsEnhancements();
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
  const [showJobFeatures, setShowJobFeatures] = useState(false);
  // Equipment choices: index = choice group index, value = chosen item name
  const [equipmentChoices, setEquipmentChoices] = useState<Record<number, string>>({});

  const pointBuySpent =
    abilityMethod === 'point-buy'
      ? Object.values(abilities).reduce((sum, score) => sum + getPointBuyCost(score), 0)
      : 0;
  const pointBuyRemaining = POINT_BUY_TOTAL - pointBuySpent;
  const isPointBuyValid = abilityMethod !== 'point-buy' || pointBuyRemaining >= 0;

  // Reset skills and equipment choices when job changes
  const handleJobChange = (jobId: string) => {
    setSelectedJob(jobId);
    setSelectedPath('');
    setSelectedSkills([]);
    setEquipmentChoices({});
  };

  // Fetch jobs - use static data as primary source with database fallback
  const { data: jobs = [] } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      // Use static jobs as primary source
      const staticJobsData = staticJobs.map(job => ({
        id: job.id,
        name: job.name,
        display_name: job.name,
        description: job.description,
        hit_die: parseInt(job.hitDie?.replace('1d', '') || '8'),
        primary_abilities: (job.primaryAbility ? [mapAbilityToSA(job.primaryAbility)] :
          (job.primary_abilities || []).map(mapAbilityToSA)) as Array<"STR" | "AGI" | "VIT" | "INT" | "SENSE" | "PRE">,
        saving_throw_proficiencies: (job.savingThrows || []).map(mapAbilityToSA) as Array<"STR" | "AGI" | "VIT" | "INT" | "SENSE" | "PRE">,
        armor_proficiencies: job.armorProficiencies || [],
        weapon_proficiencies: job.weaponProficiencies || [],
        tool_proficiencies: job.toolProficiencies || [],
        skill_choices: job.skillChoices || [],
        skill_choice_count: 2,
        source_book: job.source || 'System Ascendant Canon',
        class_features: job.classFeatures || null,
        spellcasting: job.spellcasting || null,
        starting_equipment: job.startingEquipment || null,
        hit_points_at_first_level: job.hitPointsAtFirstLevel || null,
        hit_points_at_higher_levels: job.hitPointsAtHigherLevels || null,
        regent_prerequisites: null,
        // Add missing database fields
        aliases: null,
        flavor_text: null,
        generated_reason: null,
        image_url: job.image || null,
        tags: null,
        license_note: null,
        secondary_abilities: null,
        source_kind: null,
        source_name: null,
        theme_tags: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));

      // Try to get database jobs as fallback/enrichment
      try {
        const { data: dbJobs, error } = await supabase
          .from('compendium_jobs')
          .select('*')
          .order('name');

        if (!error && dbJobs && dbJobs.length > 0) {
          // Use database jobs if they exist and have proper names
          const validDbJobs = dbJobs.filter(job =>
            staticJobs.some(staticJob => staticJob.name === job.name)
          );
          if (validDbJobs.length === staticJobs.length) {
            return await filterRowsBySourcebookAccess(
              validDbJobs as Job[],
              (job) => job.source_book
            );
          }
        }
      } catch (err) {
        console.warn('Database jobs unavailable, using static data:', err);
      }

      // Fall back to static data
      return staticJobsData;
    },
  });

  const jobASI = useMemo(() => {
    if (!selectedJob) return {} as Record<AbilityScore, number>;
    const jobName = jobs.find((j) => j.id === selectedJob)?.name;
    if (!jobName) return {} as Record<AbilityScore, number>;
    return getJobASI(jobName) as Record<AbilityScore, number>;
  }, [jobs, selectedJob]);

  const effectiveAbilities = useMemo(() => {
    const next = { ...abilities };
    for (const [abilityKey, bonus] of Object.entries(jobASI)) {
      const key = abilityKey as AbilityScore;
      if (key in next) next[key] += bonus;
    }
    return next;
  }, [abilities, jobASI]);

  // Get static job data (including startingEquipment) for the selected job
  const staticJobData = useMemo(() => {
    if (!selectedJob) return null;
    const jobName = jobs.find(j => j.id === selectedJob)?.name;
    if (!jobName) return null;
    return staticJobs.find(j => j.name === jobName) ?? null;
  }, [selectedJob, jobs]);

  const jobAwakeningAtCreation = useMemo(() => {
    if (!staticJobData?.awakeningFeatures) return [];
    return staticJobData.awakeningFeatures.filter((f) => f.level === 1);
  }, [staticJobData]);

  const jobTraitsAtCreation = useMemo(() => {
    if (!staticJobData?.jobTraits) return [];
    return staticJobData.jobTraits;
  }, [staticJobData]);

  // Fetch paths for selected job (with static fallback)
  const { data: paths = [] } = useQuery({
    queryKey: ['paths', selectedJob],
    queryFn: async () => {
      if (!selectedJob) return [];

      // Try Supabase first
      try {
        const { data, error } = await supabase
          .from('compendium_job_paths')
          .select('*')
          .eq('job_id', selectedJob)
          .order('name');

        if (!error && data && data.length > 0) {
          return filterRowsBySourcebookAccess((data || []) as Path[], (path) => path.source_book);
        }
      } catch {
        // Fall through to static
      }

      // Static fallback: load paths from compendium data
      const { staticDataProvider } = await import('@/data/compendium/staticDataProvider');
      const staticPaths = await staticDataProvider.getPaths('');
      const jobName = jobs.find(j => j.id === selectedJob)?.name;
      const filtered = jobName
        ? staticPaths.filter(p => p.job_name === jobName || p.job_id === selectedJob)
        : staticPaths;
      return filtered.map(p => ({
        id: p.id,
        name: p.name,
        display_name: p.display_name || p.name,
        description: p.description,
        job_id: selectedJob,
        path_level: p.path_level ?? 3,
        source_book: p.source_book ?? 'System Ascendant Canon',
        created_at: p.created_at,
        updated_at: p.created_at,
        aliases: null,
        license_note: null,
        source_kind: null,
        source_name: null,
        theme_tags: null,
        image_url: p.image_url ?? null,
        tags: p.tags ?? null,
        flavor_text: null,
        generated_reason: null,
      })) as unknown as Path[];
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

  // Fetch backgrounds (with static fallback)
  const { data: backgrounds = [] } = useQuery({
    queryKey: ['backgrounds'],
    queryFn: async () => {
      // Try Supabase first
      try {
        const { data, error } = await supabase
          .from('compendium_backgrounds')
          .select('*')
          .order('name');

        if (!error && data && data.length > 0) {
          return filterRowsBySourcebookAccess(
            (data || []) as Background[],
            (background) => background.source_book
          );
        }
      } catch {
        // Fall through to static
      }

      // Static fallback: load backgrounds from compendium data
      const { staticDataProvider } = await import('@/data/compendium/staticDataProvider');
      const staticBgs = await staticDataProvider.getBackgrounds('');
      return staticBgs.map(bg => ({
        id: bg.id,
        name: bg.name,
        display_name: bg.display_name || bg.name,
        description: bg.description,
        source_book: bg.source_book ?? 'System Ascendant Canon',
        created_at: bg.created_at,
        updated_at: bg.created_at,
        aliases: null,
        license_note: null,
        source_kind: null,
        source_name: null,
        theme_tags: null,
        image_url: bg.image_url ?? null,
        tags: bg.tags ?? null,
        flavor_text: null,
        generated_reason: null,
        skill_proficiencies: bg.skill_proficiencies ?? null,
        tool_proficiencies: bg.tool_proficiencies ?? null,
        language_count: bg.language_count ?? null,
        starting_equipment: bg.starting_equipment ?? null,
        feature_name: bg.feature_name ?? null,
        feature_description: bg.feature_description ?? null,
      })) as unknown as Background[];
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

  // Fetch static classFeatures for the selected job
  const { data: staticJobFeatures } = useQuery({
    queryKey: ['static-job-features', jobData?.name],
    queryFn: async () => {
      if (!jobData?.name) return null;
      const { jobs: staticJobs } = await import('@/data/compendium/jobs');
      const match = staticJobs.find(j => j.name === jobData.name);
      return match?.classFeatures || null;
    },
    enabled: !!jobData?.name,
  });

  const handleApplyTemplate = (template: CharacterTemplate) => {
    // Find matching job and background
    const job = allJobs.find(j => j.name === template.job);
    const bg = allBackgrounds.find(b => b.name === template.background);

    if (job) {
      setSelectedJob(job.id);
      setSelectedPath('');
    }
    if (bg) {
      setSelectedBackground(bg.id);
    }

    setAbilities(template.abilities);
    setAbilityMethod('manual');
    setSelectedSkills(template.skills);
    setEquipmentChoices(template.equipment as Record<number, string>);

    toast({
      title: "Template Applied",
      description: `Applied ${template.name}. Review the steps and click Next.`
    });
  };

  const steps: { id: Step; name: string }[] = [
    { id: 'concept', name: 'Concept' },
    { id: 'job', name: 'Job' },
    { id: 'abilities', name: 'Abilities' },
    ...(isPathStepEnabled ? ([{ id: 'path', name: 'Path' }] as const) : []),
    { id: 'background', name: 'Background' },
    { id: 'equipment', name: 'Equipment' },
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
      const vitModifier = Math.floor((effectiveAbilities.VIT - 10) / 2);
      const hpMax = calculateHPMax(level, job.hit_die, vitModifier);
      const agiModifier = Math.floor((effectiveAbilities.AGI - 10) / 2);
      const baseAC = 10 + agiModifier;
      const initiative = agiModifier;
      const systemFavorDie = 4; // Level 1-4

      const jobSenses: string[] = [];
      if (staticJobData?.darkvision) {
        jobSenses.push(`Darkvision ${staticJobData.darkvision} ft`);
      }
      if (staticJobData?.specialSenses && staticJobData.specialSenses.length > 0) {
        jobSenses.push(...staticJobData.specialSenses);
      }

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
        speed: staticJobData?.speed ?? 30,
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
        senses: jobSenses.length > 0 ? (jobSenses as any) : null,
        damage_resistances: (staticJobData?.damageResistances as any) ?? null,
        damage_immunities: (staticJobData?.damageImmunities as any) ?? null,
        condition_immunities: (staticJobData?.conditionImmunities as any) ?? null,
        conditions: [],
        exhaustion_level: 0,
      } as any);

      // Add level 1 features from compendium
      const {
        addLevel1Features,
        addBackgroundFeatures,
        addStartingEquipment,
        addStartingPowers,
        addJobAwakeningBenefitsForLevel,
      } = await import('@/lib/characterCreation');

      // Apply job awakening ASI bonuses to ability scores
      const finalAbilities = { ...abilities };
      for (const [abilityKey, bonus] of Object.entries(getJobASI(job.name))) {
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

      // Add starting equipment (background is required), passing player choices
      if (selectedBackgroundData) {
        await addStartingEquipment(character.id, job, selectedBackgroundData, equipmentChoices);
      }

      // Add starting powers/cantrips for caster jobs
      await addStartingPowers(character.id, job);

      // D&D Beyond parity: auto-calculate derived stats after all creation data is saved
      if (!isLocalCharacterId(character.id)) {
        // Handled dynamically by characterEngine
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

      ddbEnhancements.trackCustomFeatureUsage(
        character.id,
        'Character Created',
        `Started at Level 1`,
        '5e',
        { skipBroadcast: true }
      ).catch(console.error);

      navigate(safeNext ?? `/characters/${character.id}`);
    } catch (error) {
      // Error is handled by React Query's error state
      console.error('Character creation failed:', error);
      toast({
        title: 'Awakening Failed',
        description: `The System could not awaken your Ascendant. Error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate comprehensive total choices including awakening features and traits
  const totalChoices = useMemo(() => {
    const selectedPathRow = selectedPath && selectedPath !== 'none'
      ? pathsAvailableAtCreation.find((p: any) => p.id === selectedPath)
      : null;
    const combinedJobData = jobData || staticJobData ? { ...jobData, ...staticJobData } : null;
    return calculateTotalChoices(combinedJobData, selectedPathRow, [], 1);
  }, [jobData, staticJobData, selectedPath, pathsAvailableAtCreation]);

  // Get choice grant details for UI display
  const choiceGrantDetails = useMemo(() => {
    const selectedPathRow = selectedPath && selectedPath !== 'none'
      ? pathsAvailableAtCreation.find((p: any) => p.id === selectedPath)
      : null;
    const combinedJobData = jobData || staticJobData ? { ...jobData, ...staticJobData } : null;
    return getChoiceGrantDetails(combinedJobData, selectedPathRow, [], 1);
  }, [jobData, staticJobData, selectedPath, pathsAvailableAtCreation]);

  const canProceed = () => {
    switch (currentStep) {
      case 'concept':
        return name.trim().length > 0;
      case 'job':
        if (!selectedJob.length) return false;
        // Check if skill selection is required and complete
        if (jobData?.skill_choices && jobData.skill_choices.length > 0) {
          return selectedSkills.length === totalChoices.skills;
        }
        return true;
      case 'abilities':
        return !!selectedJob && isPointBuyValid;
      case 'path':
        if (!isPathStepEnabled) return true;
        if (!isPathRequiredAtCreation) return true;
        return !!selectedPath && selectedPath !== 'none';
      case 'background':
        return selectedBackground.length > 0; // Required
      case 'equipment':
        return true; // All groups have defaults
      case 'review':
        return true;
      default:
        return false;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate(safeNext ?? '/characters')}
          className="mb-4 sm:mb-6 min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Back to Characters</span>
          <span className="sm:hidden">Back</span>
        </Button>

        {/* Enhanced Progress Steps - D&D Beyond Style */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4 overflow-x-auto">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1 min-w-0">
                  <div className="flex flex-col items-center flex-1 relative">
                    {/* Step Circle */}
                    <div
                      className={cn(
                        "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-display text-sm sm:text-base mb-2 transition-all duration-300 border-2",
                        index < currentStepIndex
                          ? "bg-primary text-primary-foreground border-primary shadow-lg"
                          : index === currentStepIndex
                            ? "bg-primary text-primary-foreground border-primary shadow-lg ring-4 ring-primary/20"
                            : "bg-muted text-muted-foreground border-border"
                      )}
                    >
                      {index < currentStepIndex ? (
                        <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        index + 1
                      )}
                    </div>

                    {/* Step Name */}
                    <span className={cn(
                      "text-xs sm:text-sm font-heading text-center transition-colors",
                      index <= currentStepIndex ? "text-foreground font-semibold" : "text-muted-foreground"
                    )}>
                      {step.name}
                    </span>

                    {/* Current Step Indicator */}
                    {index === currentStepIndex && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary rounded-full animate-pulse" />
                    )}
                  </div>

                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className={cn(
                      "h-0.5 flex-1 mx-2 sm:mx-4 mb-6 transition-all duration-300",
                      index < currentStepIndex
                        ? "bg-primary shadow-sm"
                        : "bg-muted"
                    )} />
                  )}
                </div>
              ))}
            </div>

            {/* Step Progress Bar */}
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-500 ease-out character-creation-progress-bar"
                data-progress={((currentStepIndex + 1) / steps.length) * 100}
              />
            </div>

            {/* Step Description */}
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                {currentStep === 'concept' && 'Create your character\'s identity and appearance'}
                {currentStep === 'job' && 'Select your character\'s primary class'}
                {currentStep === 'abilities' && 'Choose your character\'s ability scores'}
                {currentStep === 'path' && 'Choose a specialization within your job'}
                {currentStep === 'background' && 'Define your character\'s history and origins'}
                {currentStep === 'equipment' && 'Choose your starting equipment'}
                {currentStep === 'review' && 'Review and finalize your character'}
              </p>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <SystemWindow title={steps[currentStepIndex].name.toUpperCase()}>
          {currentStep === 'concept' && (
            <div className="space-y-4">
              {templates && templates.length > 0 && (
                <div className="mb-6 p-4 border border-primary/20 rounded-lg bg-primary/5">
                  <Label className="text-base mb-2 block font-heading text-primary">Quick Start Templates</Label>
                  <p className="text-sm text-muted-foreground mb-4">Choose a preset to instantly configure your job, abilities, and equipment.</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {templates.map(t => (
                      <Button
                        key={t.id}
                        variant="outline"
                        className="h-auto py-3 px-4 justify-start text-left flex-col items-start bg-background hover:border-primary transition-all"
                        onClick={() => handleApplyTemplate(t)}
                      >
                        <div className="font-heading font-semibold text-foreground">{t.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">{t.job} • {t.background}</div>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
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
              {selectedJob && Object.keys(jobASI).length > 0 && (
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 text-sm">
                  <div className="font-heading font-semibold mb-1">Job ASI Bonuses</div>
                  <div className="text-muted-foreground">
                    {Object.entries(jobASI)
                      .filter(([, v]) => typeof v === 'number' && v !== 0)
                      .map(([k, v]) => `${ABILITY_NAMES[k as AbilityScore]} ${v > 0 ? `+${v}` : v}`)
                      .join(', ')}
                  </div>
                </div>
              )}
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
                      Modifier: {Math.floor((effectiveAbilities[ability] - 10) / 2) >= 0 ? '+' : ''}
                      {Math.floor((effectiveAbilities[ability] - 10) / 2)}
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
                <div className="mt-4 p-4 rounded-lg bg-muted/30 space-y-3">
                  <h4 className="font-heading font-semibold mb-2">{formatMonarchVernacular(jobData.display_name || jobData.name)}</h4>
                  <p className="text-sm text-muted-foreground">{formatMonarchVernacular(jobData.description)}</p>
                  <div className="text-xs text-muted-foreground">
                    Hit Die: d{jobData.hit_die} | Primary: {jobData.primary_abilities.map(formatMonarchVernacular).join(', ')}
                  </div>

                  {staticJobData && (
                    <div className="border-t border-border/50 pt-3 space-y-3">
                      <div className="text-xs font-heading font-semibold text-primary uppercase tracking-wider">
                        Awakening Package (Race-Equivalent)
                      </div>

                      {selectedJob && Object.keys(jobASI).length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          <span className="font-heading font-semibold text-foreground">ASI:</span>{' '}
                          {Object.entries(jobASI)
                            .filter(([, v]) => typeof v === 'number' && v !== 0)
                            .map(([k, v]) => `${ABILITY_NAMES[k as AbilityScore]} ${v > 0 ? `+${v}` : v}`)
                            .join(', ') || '—'}
                        </div>
                      )}

                      {(staticJobData.languages?.length || 0) > 0 && (
                        <div className="text-xs text-muted-foreground">
                          <span className="font-heading font-semibold text-foreground">Languages:</span>{' '}
                          {staticJobData.languages.join(', ')}
                        </div>
                      )}

                      {typeof staticJobData.speed === 'number' && (
                        <div className="text-xs text-muted-foreground">
                          <span className="font-heading font-semibold text-foreground">Speed:</span>{' '}
                          {staticJobData.speed} ft
                        </div>
                      )}

                      {typeof staticJobData.darkvision === 'number' && (
                        <div className="text-xs text-muted-foreground">
                          <span className="font-heading font-semibold text-foreground">Darkvision:</span>{' '}
                          {staticJobData.darkvision} ft
                        </div>
                      )}

                      {(staticJobData.specialSenses?.length || 0) > 0 && (
                        <div className="text-xs text-muted-foreground">
                          <span className="font-heading font-semibold text-foreground">Special Senses:</span>{' '}
                          {staticJobData.specialSenses?.join(', ')}
                        </div>
                      )}

                      {(staticJobData.damageResistances?.length || 0) > 0 && (
                        <div className="text-xs text-muted-foreground">
                          <span className="font-heading font-semibold text-foreground">Resistances:</span>{' '}
                          {staticJobData.damageResistances?.join(', ')}
                        </div>
                      )}

                      {(staticJobData.damageImmunities?.length || 0) > 0 && (
                        <div className="text-xs text-muted-foreground">
                          <span className="font-heading font-semibold text-foreground">Immunities:</span>{' '}
                          {staticJobData.damageImmunities?.join(', ')}
                        </div>
                      )}

                      {(staticJobData.conditionImmunities?.length || 0) > 0 && (
                        <div className="text-xs text-muted-foreground">
                          <span className="font-heading font-semibold text-foreground">Condition Immunities:</span>{' '}
                          {staticJobData.conditionImmunities?.join(', ')}
                        </div>
                      )}

                      {jobAwakeningAtCreation.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-xs font-heading font-semibold text-foreground">Awakening Features (Level 1)</div>
                          <div className="space-y-2">
                            {jobAwakeningAtCreation.map((f) => (
                              <div key={f.name} className="text-xs">
                                <div className="font-heading font-semibold">{formatMonarchVernacular(f.name)}</div>
                                <div className="text-muted-foreground">{formatMonarchVernacular(f.description)}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {jobTraitsAtCreation.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-xs font-heading font-semibold text-foreground">Innate Traits</div>
                          <div className="space-y-2">
                            {jobTraitsAtCreation.map((t) => (
                              <div key={t.name} className="text-xs">
                                <div className="font-heading font-semibold">{formatMonarchVernacular(t.name)}</div>
                                <div className="text-muted-foreground">{formatMonarchVernacular(t.description)}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {staticJobFeatures && staticJobFeatures.length > 0 && (
                    <div className="border-t border-border/50 pt-3">
                      <button
                        type="button"
                        onClick={() => setShowJobFeatures(!showJobFeatures)}
                        className="flex items-center gap-1.5 text-xs font-heading text-primary hover:text-primary/80 transition-colors"
                      >
                        {showJobFeatures ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        {showJobFeatures ? 'Hide' : 'Show'} Level Progression ({staticJobFeatures.length} features)
                      </button>
                      {showJobFeatures && (
                        <div className="mt-2 space-y-1.5 max-h-64 overflow-y-auto pr-1">
                          {staticJobFeatures.map((cf, idx) => (
                            <div key={idx} className="flex gap-2 text-xs">
                              <span className="font-heading font-semibold text-primary min-w-[2rem]">L{cf.level}</span>
                              <span className="font-heading font-semibold min-w-[8rem]">{formatMonarchVernacular(cf.name)}</span>
                              <span className="text-muted-foreground">{formatMonarchVernacular(cf.description).slice(0, 100)}{cf.description.length > 100 ? '…' : ''}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              {jobData && jobData.skill_choices && jobData.skill_choices.length > 0 && (
                <div className="mt-4 space-y-2">
                  <Label>
                    Select {totalChoices.skills} Skill{totalChoices.skills > 1 ? 's' : ''} *
                  </Label>
                  {totalChoices.skills > (jobData?.skill_choice_count || 0) && (
                    <p className="text-xs text-primary mb-2">
                      +{totalChoices.skills - (jobData?.skill_choice_count || 0)} additional skills from awakening features
                    </p>
                  )}
                  {/* Show other choice types if available */}
                  {(totalChoices.feats > 0 || totalChoices.spells > 0 || totalChoices.powers > 0 || totalChoices.techniques > 0 || totalChoices.runes > 0 || totalChoices.items > 0 || totalChoices.tools > 0 || totalChoices.languages > 0) && (
                    <div className="text-xs text-amber-600 dark:text-amber-400 mb-2">
                      Additional choices available:
                      {totalChoices.feats > 0 && `${totalChoices.feats} feats`}
                      {totalChoices.spells > 0 && `${totalChoices.spells} spells`}
                      {totalChoices.powers > 0 && `${totalChoices.powers} powers`}
                      {totalChoices.techniques > 0 && `${totalChoices.techniques} techniques`}
                      {totalChoices.runes > 0 && `${totalChoices.runes} runes`}
                      {totalChoices.items > 0 && `${totalChoices.items} items`}
                      {totalChoices.tools > 0 && `${totalChoices.tools} tools`}
                      {totalChoices.languages > 0 && `${totalChoices.languages} languages`}
                    </div>
                  )}
                  {/* Show expertise information if applicable */}
                  {totalChoices.expertise > 0 && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 mb-2">
                      ⚠️ {totalChoices.expertise} expertise selections available - will be handled after character creation
                    </p>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    {jobData.skill_choices.map((skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox
                          id={`skill-${skill}`}
                          checked={selectedSkills.includes(skill)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              if (selectedSkills.length < totalChoices.skills) {
                                setSelectedSkills([...selectedSkills, skill]);
                              }
                            } else {
                              setSelectedSkills(selectedSkills.filter(s => s !== skill));
                            }
                          }}
                          disabled={!selectedSkills.includes(skill) && selectedSkills.length >= totalChoices.skills}
                        />
                        <label htmlFor={`skill-${skill}`} className="text-sm font-heading cursor-pointer">
                          {formatMonarchVernacular(skill)}
                        </label>
                      </div>
                    ))}
                  </div>
                  {selectedSkills.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Selected: {selectedSkills.map(formatMonarchVernacular).join(', ')} ({selectedSkills.length}/{totalChoices.skills})
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
              {selectedBackground ? (() => {
                const bg = backgrounds.find((b: Background) => b.id === selectedBackground);
                if (!bg) return null;
                const hasSuggestedChars = (bg.personality_traits && bg.personality_traits.length > 0)
                  || (bg.ideals && bg.ideals.length > 0)
                  || (bg.bonds && bg.bonds.length > 0)
                  || (bg.flaws && bg.flaws.length > 0);
                return (
                  <div className="mt-4 p-5 rounded-lg bg-muted/30 space-y-4">
                    {/* Title + Description */}
                    <div className="space-y-2">
                      <h4 className="font-heading text-lg font-semibold text-foreground">
                        {formatMonarchVernacular((bg as { name?: string; display_name?: string | null }).display_name || bg.name || '')}
                      </h4>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {formatMonarchVernacular(bg.description || '')}
                      </p>
                    </div>

                    {/* Proficiencies Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {bg.skill_proficiencies && bg.skill_proficiencies.length > 0 && (
                        <div className="p-3 rounded-md bg-background/50 border border-border/50">
                          <div className="text-xs font-heading font-semibold text-primary uppercase tracking-wider mb-1.5">Skill Proficiencies</div>
                          <div className="text-sm text-foreground">{bg.skill_proficiencies.map(formatMonarchVernacular).join(', ')}</div>
                        </div>
                      )}
                      {bg.tool_proficiencies && bg.tool_proficiencies.length > 0 && (
                        <div className="p-3 rounded-md bg-background/50 border border-border/50">
                          <div className="text-xs font-heading font-semibold text-primary uppercase tracking-wider mb-1.5">Tool Proficiencies</div>
                          <div className="text-sm text-foreground">{bg.tool_proficiencies.map(formatMonarchVernacular).join(', ')}</div>
                        </div>
                      )}
                    </div>

                    {/* Starting Equipment */}
                    {bg.starting_equipment && (
                      <div className="p-3 rounded-md bg-primary/5 border border-primary/20">
                        <div className="text-xs font-heading font-semibold text-primary uppercase tracking-wider mb-1.5">Starting Equipment</div>
                        <div className="text-sm text-foreground leading-relaxed">{formatMonarchVernacular(bg.starting_equipment)}</div>
                      </div>
                    )}
                  </div>
                );
              })() : null}
            </div>
          )}

          {currentStep === 'equipment' && (
            <div className="space-y-6">
              {!staticJobData?.startingEquipment || staticJobData.startingEquipment.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No starting equipment choices for this job.</p>
                  <p className="text-xs mt-1">Equipment will be assigned automatically.</p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    Choose your starting equipment. The first option in each group is selected by default.
                  </p>
                  <div className="space-y-4">
                    {staticJobData.startingEquipment.map((group, groupIndex) => {
                      const chosen = equipmentChoices[groupIndex] ?? group[0];
                      return (
                        <div key={groupIndex} className="p-4 rounded-lg border bg-muted/20">
                          {group.length === 1 ? (
                            <div className="flex items-center gap-3">
                              <div className="w-4 h-4 rounded-full bg-primary flex-shrink-0" />
                              <span className="font-heading font-semibold text-sm">{group[0]}</span>
                              <Badge variant="secondary" className="text-xs ml-auto">Included</Badge>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <p className="text-xs font-heading text-muted-foreground uppercase tracking-wider mb-3">
                                Choose one:
                              </p>
                              {group.map((option) => (
                                <button
                                  key={option}
                                  type="button"
                                  onClick={() => setEquipmentChoices(prev => ({ ...prev, [groupIndex]: option }))}
                                  className={cn(
                                    "w-full text-left p-3 rounded-md border transition-all",
                                    chosen === option
                                      ? "border-primary bg-primary/10 text-foreground"
                                      : "border-border bg-background/40 text-muted-foreground hover:bg-muted/50"
                                  )}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={cn(
                                      "w-4 h-4 rounded-full border-2 flex-shrink-0 transition-colors",
                                      chosen === option ? "border-primary bg-primary" : "border-muted-foreground"
                                    )} />
                                    <span className="font-heading font-semibold text-sm">{option}</span>
                                    {chosen === option && (
                                      <Badge variant="default" className="text-xs ml-auto">Selected</Badge>
                                    )}
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Summary of chosen equipment */}
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-xs font-heading font-semibold text-primary uppercase tracking-wider mb-2">
                      Your Starting Equipment
                    </p>
                    <ul className="space-y-1">
                      {staticJobData.startingEquipment.map((group, i) => {
                        const chosen = equipmentChoices[i] ?? group[0];
                        return (
                          <li key={i} className="text-sm flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                            {chosen}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </>
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
                        {effectiveAbilities[ability]} ({Math.floor((effectiveAbilities[ability] - 10) / 2) >= 0 ? '+' : ''}
                        {Math.floor((effectiveAbilities[ability] - 10) / 2)})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {jobData && (
                <div>
                  <h3 className="font-heading font-semibold mb-2">Starting Stats (Level 1)</h3>
                  <div className="text-sm space-y-1">
                    <div><strong>HP:</strong> {calculateHPMax(1, jobData.hit_die, Math.floor((effectiveAbilities.VIT - 10) / 2))}</div>
                    <div><strong>AC:</strong> {10 + Math.floor((effectiveAbilities.AGI - 10) / 2)}</div>
                    <div><strong>Proficiency Bonus:</strong> +2</div>
                  </div>
                </div>
              )}

              {staticJobData && (
                <div>
                  <h3 className="font-heading font-semibold mb-2">Awakening Package</h3>
                  <div className="space-y-2 text-sm">
                    {selectedJob && Object.keys(jobASI).length > 0 && (
                      <div>
                        <strong>ASI:</strong>{' '}
                        {Object.entries(jobASI)
                          .filter(([, v]) => typeof v === 'number' && v !== 0)
                          .map(([k, v]) => `${ABILITY_NAMES[k as AbilityScore]} ${v > 0 ? `+${v}` : v}`)
                          .join(', ') || '—'}
                      </div>
                    )}

                    {(staticJobData.languages?.length || 0) > 0 && (
                      <div><strong>Languages:</strong> {staticJobData.languages.join(', ')}</div>
                    )}

                    {typeof staticJobData.darkvision === 'number' && (
                      <div><strong>Darkvision:</strong> {staticJobData.darkvision} ft</div>
                    )}

                    {(staticJobData.damageResistances?.length || 0) > 0 && (
                      <div><strong>Resistances:</strong> {staticJobData.damageResistances?.join(', ')}</div>
                    )}

                    {(staticJobData.conditionImmunities?.length || 0) > 0 && (
                      <div><strong>Condition Immunities:</strong> {staticJobData.conditionImmunities?.join(', ')}</div>
                    )}

                    {jobAwakeningAtCreation.length > 0 && (
                      <div>
                        <strong>Awakening Features:</strong>
                        <div className="mt-1 space-y-1">
                          {jobAwakeningAtCreation.map((f) => (
                            <div key={f.name} className="text-muted-foreground">
                              {formatMonarchVernacular(f.name)}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {jobTraitsAtCreation.length > 0 && (
                      <div>
                        <strong>Innate Traits:</strong>
                        <div className="mt-1 space-y-1">
                          {jobTraitsAtCreation.map((t) => (
                            <div key={t.name} className="text-muted-foreground">
                              {formatMonarchVernacular(t.name)}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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

