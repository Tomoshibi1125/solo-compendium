import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCreateCharacter } from '@/hooks/useCharacters';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { calculateHPMax } from '@/lib/characterCalculations';
import { ABILITY_NAMES, type AbilityScore } from '@/types/solo-leveling';
import type { Database } from '@/integrations/supabase/types';

type Job = Database['public']['Tables']['compendium_jobs']['Row'];
type Background = Database['public']['Tables']['compendium_backgrounds']['Row'];

type Step = 'concept' | 'abilities' | 'job' | 'path' | 'background' | 'review';

const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];
const POINT_BUY_COST: Record<number, number> = {
  8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9,
};

const CharacterNew = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const createCharacter = useCreateCharacter();
  const [currentStep, setCurrentStep] = useState<Step>('concept');
  const [loading, setLoading] = useState(false);

  // Character data state
  const [name, setName] = useState('');
  const [appearance, setAppearance] = useState('');
  const [backstory, setBackstory] = useState('');
  const [abilityMethod, setAbilityMethod] = useState<'standard' | 'point-buy'>('standard');
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

  // Fetch jobs
  const { data: jobs = [] } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('compendium_jobs')
        .select('*')
        .order('name');
      if (error) throw error;
      return data as Job[];
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
      return data;
    },
    enabled: !!selectedJob,
  });

  // Fetch backgrounds
  const { data: backgrounds = [] } = useQuery({
    queryKey: ['backgrounds'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('compendium_backgrounds')
        .select('*')
        .order('name');
      if (error) throw error;
      return data as Background[];
    },
  });

  // Get selected job data
  const jobData = jobs.find(j => j.id === selectedJob);

  const steps: { id: Step; name: string }[] = [
    { id: 'concept', name: 'Concept' },
    { id: 'abilities', name: 'Abilities' },
    { id: 'job', name: 'Job' },
    { id: 'path', name: 'Path' },
    { id: 'background', name: 'Background' },
    { id: 'review', name: 'Review' },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  const handleStandardArray = () => {
    const scores = [...STANDARD_ARRAY].sort((a, b) => b - a);
    const abilityKeys: AbilityScore[] = ['STR', 'AGI', 'VIT', 'INT', 'SENSE', 'PRE'];
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
        description: 'Please enter your Hunter\'s name.',
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

    setLoading(true);
    try {
      const job = jobs.find(j => j.id === selectedJob);
      if (!job) throw new Error('Job not found');

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
      const character = await createCharacter.mutateAsync({
        name: name.trim(),
        level: 1,
        job: job.name,
        path: paths.find(p => p.id === selectedPath)?.name || null,
        background: backgrounds.find(b => b.id === selectedBackground)?.name || null,
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
          ...(selectedBackground ? (backgrounds.find(b => b.id === selectedBackground)?.skill_proficiencies || []) : []),
        ],
        skill_expertise: [],
        armor_proficiencies: job.armor_proficiencies || [],
        weapon_proficiencies: job.weapon_proficiencies || [],
        tool_proficiencies: job.tool_proficiencies || [],
        conditions: [],
        exhaustion_level: 0,
      });

      // Update abilities
      for (const [ability, score] of Object.entries(abilities)) {
        await supabase
          .from('character_abilities')
          .upsert({
            character_id: character.id,
            ability: ability as AbilityScore,
            score: score,
          });
      }

      // Add level 1 features from compendium
      const { addLevel1Features, addBackgroundFeatures, addStartingEquipment, addStartingPowers } = await import('@/lib/characterCreation');
      await addLevel1Features(character.id, job.id, selectedPath ? paths.find(p => p.id === selectedPath)?.id : undefined);
      
      // Add background features and equipment
      if (selectedBackground) {
        const background = backgrounds.find(b => b.id === selectedBackground);
        if (background) {
          await addBackgroundFeatures(character.id, background);
          await addStartingEquipment(character.id, job, background);
        }
      } else {
        await addStartingEquipment(character.id, job);
      }

      // Add starting powers from job
      await addStartingPowers(character.id, job);

      toast({
        title: 'Hunter Awakened!',
        description: `${name} has awakened successfully. The System has granted features and equipment.`,
      });

      navigate(`/characters/${character.id}`);
    } catch (error) {
      console.error('Error creating character:', error);
      toast({
        title: 'Awakening Failed',
        description: 'The System could not awaken your Hunter. Please try again.',
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
        return true; // Always valid
      case 'job':
        if (!selectedJob.length) return false;
        // Check if skill selection is required and complete
        if (jobData?.skill_choices && jobData.skill_choices.length > 0) {
          return selectedSkills.length === jobData.skill_choice_count;
        }
        return true;
      case 'path':
        return paths.length === 0 || selectedPath.length > 0; // Optional if no paths
      case 'background':
        return true; // Optional
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
          onClick={() => navigate('/characters')}
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter character name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="appearance">Appearance</Label>
                <Input
                  id="appearance"
                  value={appearance}
                  onChange={(e) => setAppearance(e.target.value)}
                  placeholder="Brief physical description"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="backstory">Backstory</Label>
                <Textarea
                  id="backstory"
                  value={backstory}
                  onChange={(e) => setBackstory(e.target.value)}
                  placeholder="Character background and history"
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {currentStep === 'abilities' && (
            <div className="space-y-6">
              <div className="flex gap-4">
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
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {(Object.keys(ABILITY_NAMES) as AbilityScore[]).map((ability) => (
                  <div key={ability}>
                    <Label>{ABILITY_NAMES[ability]}</Label>
                    <Input
                      type="number"
                      min={abilityMethod === 'point-buy' ? 8 : undefined}
                      max={abilityMethod === 'point-buy' ? 15 : undefined}
                      value={abilities[ability]}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 8;
                        const newAbilities = { ...abilities, [ability]: value };
                        setAbilities(newAbilities);
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
              <Select value={selectedJob} onValueChange={setSelectedJob}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a job..." />
                </SelectTrigger>
                <SelectContent>
                  {jobs.map((job) => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {jobData && (
                <div className="mt-4 p-4 rounded-lg bg-muted/30">
                  <h4 className="font-heading font-semibold mb-2">{jobData.name}</h4>
                  <p className="text-sm text-muted-foreground">{jobData.description}</p>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Hit Die: d{jobData.hit_die} | Primary: {jobData.primary_abilities.join(', ')}
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 'path' && (
            <div className="space-y-4">
              <Label>Select Path {paths.length === 0 && '(Optional - No paths available for this job)'}</Label>
              {paths.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  This job doesn't have any paths available yet. You can select a path later when leveling up.
                </p>
              ) : (
                <Select value={selectedPath} onValueChange={setSelectedPath}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a path..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None (Select later)</SelectItem>
                    {paths.map((path) => (
                      <SelectItem key={path.id} value={path.id}>
                        {path.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {selectedPath && (
                <div className="mt-4 p-4 rounded-lg bg-muted/30">
                  <h4 className="font-heading font-semibold mb-2">
                    {paths.find(p => p.id === selectedPath)?.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {paths.find(p => p.id === selectedPath)?.description}
                  </p>
                </div>
              )}
            </div>
          )}

          {currentStep === 'background' && (
            <div className="space-y-4">
              <Label>Select Background (Optional)</Label>
              <Select value={selectedBackground} onValueChange={setSelectedBackground}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a background..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {backgrounds.map((bg) => (
                    <SelectItem key={bg.id} value={bg.id}>
                      {bg.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedBackground && (
                <div className="mt-4 p-4 rounded-lg bg-muted/30">
                  <h4 className="font-heading font-semibold mb-2">
                    {backgrounds.find(b => b.id === selectedBackground)?.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {backgrounds.find(b => b.id === selectedBackground)?.description}
                  </p>
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
                  <div><strong>Job:</strong> {jobData?.name || 'None'}</div>
                  <div><strong>Path:</strong> {paths.find(p => p.id === selectedPath)?.name || 'None'}</div>
                  <div><strong>Background:</strong> {backgrounds.find(b => b.id === selectedBackground)?.name || 'None'}</div>
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
