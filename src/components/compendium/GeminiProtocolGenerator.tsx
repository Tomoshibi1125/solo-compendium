import { useState, useMemo, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { generateSovereign, type GeneratedSovereign, calculateTotalCombinations } from '@/lib/geminiProtocol';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Crown, Swords, Shield, Zap, Sparkles, RefreshCw, Dna, Save, Loader2 } from 'lucide-react';
import { useSaveSovereign } from '@/hooks/useSavedSovereigns';
import { useAuth } from '@/lib/auth/authContext';
import { useActiveCharacter } from '@/hooks/useActiveCharacter';
import { useCharacterMonarchUnlocks } from '@/hooks/useMonarchUnlocks';

export function GeminiProtocolGenerator() {
  const { isPlayer } = useAuth();
  const { activeCharacter } = useActiveCharacter();
  const { data: monarchUnlocks = [], isLoading: monarchUnlocksLoading } = useCharacterMonarchUnlocks(activeCharacter?.id);
  const [selectedJob, setSelectedJob] = useState<string>('');
  const [selectedPath, setSelectedPath] = useState<string>('');
  const [selectedMonarchA, setSelectedMonarchA] = useState<string>('');
  const [selectedMonarchB, setSelectedMonarchB] = useState<string>('');
  const [generatedSovereign, setGeneratedSovereign] = useState<GeneratedSovereign | null>(null);
  
  const saveSovereign = useSaveSovereign();

  // Fetch all jobs
  const { data: jobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ['gemini-jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('compendium_jobs')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  // Fetch paths for selected job
  const { data: paths = [], isLoading: pathsLoading } = useQuery({
    queryKey: ['gemini-paths', selectedJob],
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

  const { data: allPaths = [], isLoading: allPathsLoading } = useQuery({
    queryKey: ['gemini-paths-all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('compendium_job_paths')
        .select('*')
        .order('name');
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch all monarchs
  const { data: monarchs = [], isLoading: monarchsLoading } = useQuery({
    queryKey: ['gemini-monarchs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('compendium_monarchs')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  const totalCombinations = useMemo(() => {
    if (!jobs.length || !monarchs.length) return 0;
    const avgPathsPerJob = 4;
    return calculateTotalCombinations(jobs.length, jobs.length * avgPathsPerJob, monarchs.length);
  }, [jobs.length, monarchs.length]);

  const autoMode = isPlayer() && !!activeCharacter;

  const canRandomize =
    !jobsLoading &&
    !monarchsLoading &&
    !allPathsLoading &&
    jobs.length > 0 &&
    monarchs.length > 1 &&
    (allPaths.length > 0 || paths.length > 0) &&
    !autoMode;
  const canGenerate = selectedJob && selectedPath && selectedMonarchA && selectedMonarchB && selectedMonarchA !== selectedMonarchB;

  useEffect(() => {
    if (autoMode) {
      if (!activeCharacter) return;
      if (!selectedJob && jobs.length > 0 && activeCharacter.job) {
        const target = activeCharacter.job.trim().toLowerCase();
        const match = jobs.find((job) => job.name.trim().toLowerCase() === target);
        if (match) {
          setSelectedJob(match.id);
        }
      }
      return;
    }

    if (!selectedJob && jobs.length > 0) {
      setSelectedJob(jobs[0].id);
    }
  }, [activeCharacter, autoMode, jobs, selectedJob]);

  useEffect(() => {
    if (autoMode) {
      if (!activeCharacter?.path) return;
      const normalize = (value: string) => value.trim().toLowerCase();
      const normalizePath = (value: string) => normalize(value.replace(/^path of the\s+/i, ''));
      const desired = normalizePath(activeCharacter.path);
      const match = allPaths.find((path) => normalizePath(path.name) === desired);
      if (match) {
        if (selectedJob !== match.job_id) {
          setSelectedJob(match.job_id);
        }
        if (selectedPath !== match.id) {
          setSelectedPath(match.id);
        }
      }
      return;
    }

    if (selectedJob && !selectedPath && paths.length > 0) {
      setSelectedPath(paths[0].id);
    }
  }, [activeCharacter, allPaths, autoMode, paths, selectedJob, selectedPath]);

  useEffect(() => {
    if (autoMode) {
      if (monarchUnlocksLoading) return;
      const primary = monarchUnlocks.find((unlock) => unlock.is_primary) || monarchUnlocks[0];
      const secondary = monarchUnlocks.find((unlock) => unlock.id !== primary?.id);
      if (primary && selectedMonarchA !== primary.monarch_id) {
        setSelectedMonarchA(primary.monarch_id);
      }
      if (secondary && selectedMonarchB !== secondary.monarch_id) {
        setSelectedMonarchB(secondary.monarch_id);
      }
      return;
    }

    if (!selectedMonarchA && monarchs.length > 0) {
      setSelectedMonarchA(monarchs[0].id);
    }
    if ((!selectedMonarchB || selectedMonarchB === selectedMonarchA) && monarchs.length > 1) {
      const fallback = monarchs.find((monarch) => monarch.id !== selectedMonarchA) || monarchs[1];
      if (fallback) {
        setSelectedMonarchB(fallback.id);
      }
    }
  }, [autoMode, monarchs, monarchUnlocks, monarchUnlocksLoading, selectedMonarchA, selectedMonarchB]);

  const handleGenerate = () => {
    const job = jobs.find(j => j.id === selectedJob);
    const path = paths.find(p => p.id === selectedPath) || allPaths.find((p) => p.id === selectedPath);
    const monarchA = monarchs.find(m => m.id === selectedMonarchA);
    const monarchB = monarchs.find(m => m.id === selectedMonarchB);

    if (job && path && monarchA && monarchB) {
      const sovereign = generateSovereign(job, path, monarchA, monarchB);
      setGeneratedSovereign(sovereign);
    }
  };

  const handleRandomize = async () => {
    if (jobs.length === 0 || monarchs.length < 2) return;

    const pathPool = allPaths.length > 0 ? allPaths : paths;
    if (pathPool.length === 0) return;

    const randomPath = pathPool[Math.floor(Math.random() * pathPool.length)];
    if (!randomPath) return;

    const jobId = (randomPath as { job_id?: string }).job_id || jobs[Math.floor(Math.random() * jobs.length)].id;
    setSelectedJob(jobId);
    setSelectedPath(randomPath.id);

    const shuffledMonarchs = [...monarchs].sort(() => Math.random() - 0.5);
    const primaryMonarch = shuffledMonarchs[0];
    const secondaryMonarch = shuffledMonarchs.find((monarch) => monarch.id !== primaryMonarch?.id);
    if (!primaryMonarch || !secondaryMonarch) return;
    setSelectedMonarchA(primaryMonarch.id);
    setSelectedMonarchB(secondaryMonarch.id);
  };

  const getActionIcon = (actionType: string | null) => {
    if (!actionType) return <Zap className="h-4 w-4" />;
    if (actionType.toLowerCase().includes('bonus')) return <Sparkles className="h-4 w-4" />;
    if (actionType.toLowerCase().includes('reaction')) return <Shield className="h-4 w-4" />;
    if (actionType.toLowerCase().includes('passive')) return <Crown className="h-4 w-4" />;
    return <Swords className="h-4 w-4" />;
  };

  const selectedJobEntry = jobs.find((job) => job.id === selectedJob) || null;
  const selectedPathEntry = paths.find((path) => path.id === selectedPath)
    || allPaths.find((path) => path.id === selectedPath)
    || null;
  const selectedMonarchAEntry = monarchs.find((monarch) => monarch.id === selectedMonarchA) || null;
  const selectedMonarchBEntry = monarchs.find((monarch) => monarch.id === selectedMonarchB) || null;
  const dataReady = !jobsLoading && !monarchsLoading && !allPathsLoading;
  const templateReady = Boolean(
    selectedJobEntry &&
      selectedPathEntry &&
      selectedMonarchAEntry &&
      selectedMonarchBEntry &&
      selectedMonarchA !== selectedMonarchB
  );
  const autoKey = `${selectedJobEntry?.id || ''}:${selectedPathEntry?.id || ''}:${selectedMonarchAEntry?.id || ''}:${selectedMonarchBEntry?.id || ''}`;
  const lastAutoKey = useRef<string>('');

  const autoIssues: string[] = [];
  if (autoMode) {
    if (!activeCharacter?.job) autoIssues.push('Active character is missing a Job.');
    if (!activeCharacter?.path) autoIssues.push('Active character is missing a Path.');
    if (monarchUnlocks.length < 2) autoIssues.push('Unlock two Monarchs to auto-generate a Sovereign.');
    if (activeCharacter?.job && !selectedJobEntry) autoIssues.push('No matching Job found in the compendium.');
    if (activeCharacter?.path && !selectedPathEntry) autoIssues.push('No matching Path found in the compendium.');
  }

  useEffect(() => {
    if (!autoMode || !dataReady || !templateReady) return;
    if (autoKey === lastAutoKey.current) return;
    handleGenerate();
    lastAutoKey.current = autoKey;
  }, [autoKey, autoMode, dataReady, templateReady]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Dna className="h-8 w-8 text-primary" />
          <h3 className="text-2xl font-bold">Fusion Console</h3>
        </div>
        <p className="text-muted-foreground">
          Permanent subclass overlays - {totalCombinations.toLocaleString()}+ combinations available
        </p>
        <p className="text-sm text-muted-foreground italic">
          Any Job + Path + Monarch A + Monarch B template qualifies for a Sovereign overlay.
        </p>
        <p className="text-xs text-muted-foreground">
          Fusion cues are thematic guides, not literal procedures.
        </p>
      </div>

      {/* Selection Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Fusion Components</span>
            {!autoMode && (
              <Button variant="outline" size="sm" onClick={handleRandomize} disabled={!canRandomize}>
                <RefreshCw className="h-4 w-4 mr-2" />
                {jobsLoading || monarchsLoading || pathsLoading ? 'Loading...' : 'Randomize'}
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {autoMode ? (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Sovereign fusion auto-syncs from your active character. The protocol triggers automatically once your Job,
                Path, and Monarch pair are complete.
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">Job</div>
                  <div className="font-medium">{selectedJobEntry?.name || 'Not set'}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">Path</div>
                  <div className="font-medium">{selectedPathEntry?.name?.replace('Path of the ', '') || 'Not set'}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">Primary Monarch</div>
                  <div className="font-medium">{selectedMonarchAEntry ? `${selectedMonarchAEntry.title} (${selectedMonarchAEntry.theme})` : 'Not set'}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">Secondary Monarch</div>
                  <div className="font-medium">{selectedMonarchBEntry ? `${selectedMonarchBEntry.title} (${selectedMonarchBEntry.theme})` : 'Not set'}</div>
                </div>
              </div>
              {autoIssues.length > 0 && (
                <Alert>
                  <AlertDescription>
                    {autoIssues.join(' ')}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Job Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Job Class</label>
                <Select value={selectedJob} onValueChange={(v) => { setSelectedJob(v); setSelectedPath(''); }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Job..." />
                  </SelectTrigger>
                  <SelectContent>
                    {jobs.map((job) => (
                      <SelectItem key={job.id} value={job.id}>
                        {job.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Path Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Path Specialization</label>
                <Select value={selectedPath} onValueChange={setSelectedPath} disabled={!selectedJob}>
                  <SelectTrigger>
                    <SelectValue placeholder={selectedJob ? "Select a Path..." : "Select Job first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {paths.map((path) => (
                      <SelectItem key={path.id} value={path.id}>
                        {path.name.replace('Path of the ', '')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Monarch A Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Primary Monarch (Dominant)</label>
                <Select value={selectedMonarchA} onValueChange={setSelectedMonarchA}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Primary Monarch..." />
                  </SelectTrigger>
                  <SelectContent>
                    {monarchs.map((monarch) => (
                      <SelectItem key={monarch.id} value={monarch.id} disabled={monarch.id === selectedMonarchB}>
                        {monarch.title} ({monarch.theme})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Monarch B Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Secondary Monarch (Merged)</label>
                <Select value={selectedMonarchB} onValueChange={setSelectedMonarchB}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Secondary Monarch..." />
                  </SelectTrigger>
                  <SelectContent>
                    {monarchs.map((monarch) => (
                      <SelectItem key={monarch.id} value={monarch.id} disabled={monarch.id === selectedMonarchA}>
                        {monarch.title} ({monarch.theme})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <Button
            onClick={handleGenerate}
            disabled={!canGenerate || (autoMode && !templateReady)}
            className="w-full"
          >
            <Dna className="h-4 w-4 mr-2" />
            {autoMode ? 'Generate Sovereign Overlay' : 'Initiate Gemini Protocol Fusion'}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Sovereign Display */}
      {generatedSovereign && (
        <Card className="border-primary/50">
          <CardHeader className="bg-primary/5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown className="h-6 w-6 text-primary" />
                  <CardTitle className="text-xl">{generatedSovereign.name}</CardTitle>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => saveSovereign.mutate(generatedSovereign)}
                  disabled={saveSovereign.isPending}
                >
                  {saveSovereign.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save to Archive
                </Button>
              </div>
              <p className="text-lg text-muted-foreground italic">{generatedSovereign.title}</p>
              
              {/* Component Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{generatedSovereign.job.name}</Badge>
                <Badge variant="outline">{generatedSovereign.path.name.replace('Path of the ', '')}</Badge>
                <Badge variant="secondary">{generatedSovereign.monarchA.theme}</Badge>
                <Badge variant="secondary">{generatedSovereign.monarchB.theme}</Badge>
                <Badge className="bg-primary/20 text-primary">{generatedSovereign.fusion_theme}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            {/* Power Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-muted/50">
                <h4 className="font-semibold text-sm mb-1">Power Multiplier</h4>
                <p className="text-xs text-muted-foreground">{generatedSovereign.power_multiplier}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <h4 className="font-semibold text-sm mb-1">Fusion Stability</h4>
                <p className="text-xs text-muted-foreground">{generatedSovereign.fusion_stability}</p>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-2">Fusion Origin</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{generatedSovereign.description}</p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Combat Doctrine</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{generatedSovereign.fusion_description}</p>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-3">Fusion Abilities (8 Total)</h4>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-3">
                  {generatedSovereign.abilities.map((ability, index) => (
                    <div
                      key={ability.name || `ability-${index}`}
                      className={`p-3 rounded-lg border ${
                        ability.is_capstone 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap">
                          {getActionIcon(ability.action_type)}
                          <span className="font-medium">{ability.name}</span>
                          {ability.is_capstone && (
                            <Badge variant="default" className="text-xs">CAPSTONE</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Badge variant="outline">Level {ability.level}</Badge>
                          {ability.action_type && (
                            <Badge variant="secondary" className="text-xs">{ability.action_type}</Badge>
                          )}
                          {ability.recharge && (
                            <Badge variant="secondary" className="text-xs">{ability.recharge}</Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 whitespace-pre-line">{ability.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {ability.origin_sources.map((source, i) => (
                          <span key={i} className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                            {source}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
