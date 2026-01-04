import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { generateSovereign, type GeneratedSovereign, calculateTotalCombinations } from '@/lib/geminiProtocol';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Crown, Swords, Shield, Zap, Sparkles, RefreshCw, Dna } from 'lucide-react';

export function GeminiProtocolGenerator() {
  const [selectedJob, setSelectedJob] = useState<string>('');
  const [selectedPath, setSelectedPath] = useState<string>('');
  const [selectedMonarchA, setSelectedMonarchA] = useState<string>('');
  const [selectedMonarchB, setSelectedMonarchB] = useState<string>('');
  const [generatedSovereign, setGeneratedSovereign] = useState<GeneratedSovereign | null>(null);

  // Fetch all jobs
  const { data: jobs = [] } = useQuery({
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
  const { data: paths = [] } = useQuery({
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

  // Fetch all monarchs
  const { data: monarchs = [] } = useQuery({
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
    // Approximate: each job has ~4-5 paths on average
    const avgPathsPerJob = 4;
    return calculateTotalCombinations(jobs.length, jobs.length * avgPathsPerJob, monarchs.length);
  }, [jobs.length, monarchs.length]);

  const canGenerate = selectedJob && selectedPath && selectedMonarchA && selectedMonarchB && selectedMonarchA !== selectedMonarchB;

  const handleGenerate = () => {
    const job = jobs.find(j => j.id === selectedJob);
    const path = paths.find(p => p.id === selectedPath);
    const monarchA = monarchs.find(m => m.id === selectedMonarchA);
    const monarchB = monarchs.find(m => m.id === selectedMonarchB);

    if (job && path && monarchA && monarchB) {
      const sovereign = generateSovereign(job, path, monarchA, monarchB);
      setGeneratedSovereign(sovereign);
    }
  };

  const handleRandomize = () => {
    if (jobs.length === 0 || monarchs.length === 0) return;

    // Random job
    const randomJob = jobs[Math.floor(Math.random() * jobs.length)];
    setSelectedJob(randomJob.id);

    // We need to fetch paths for the job first, so set a timeout
    setTimeout(async () => {
      const { data: jobPaths } = await supabase
        .from('compendium_job_paths')
        .select('*')
        .eq('job_id', randomJob.id);
      
      if (jobPaths && jobPaths.length > 0) {
        const randomPath = jobPaths[Math.floor(Math.random() * jobPaths.length)];
        setSelectedPath(randomPath.id);
      }
    }, 100);

    // Random monarchs (different)
    const shuffledMonarchs = [...monarchs].sort(() => Math.random() - 0.5);
    setSelectedMonarchA(shuffledMonarchs[0].id);
    setSelectedMonarchB(shuffledMonarchs[1].id);
  };

  const getActionIcon = (actionType: string | null) => {
    if (!actionType) return <Zap className="h-4 w-4" />;
    if (actionType.toLowerCase().includes('bonus')) return <Sparkles className="h-4 w-4" />;
    if (actionType.toLowerCase().includes('reaction')) return <Shield className="h-4 w-4" />;
    if (actionType.toLowerCase().includes('passive')) return <Crown className="h-4 w-4" />;
    return <Swords className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Dna className="h-8 w-8 text-primary" />
          <h2 className="text-2xl font-bold">Gemini Protocol</h2>
        </div>
        <p className="text-muted-foreground">
          Permanent Fusion System • {totalCombinations.toLocaleString()}+ Possible Combinations
        </p>
        <p className="text-sm text-muted-foreground italic">
          By the blessing of Supreme Deity Jinwoo, fuse Job, Path, and two Monarchs into a unique Sovereign
        </p>
      </div>

      {/* Selection Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Fusion Components</span>
            <Button variant="outline" size="sm" onClick={handleRandomize}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Randomize
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
              <label className="text-sm font-medium">Primary Monarch</label>
              <Select value={selectedMonarchA} onValueChange={setSelectedMonarchA}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Primary Monarch..." />
                </SelectTrigger>
                <SelectContent>
                  {monarchs.map((monarch) => (
                    <SelectItem key={monarch.id} value={monarch.id} disabled={monarch.id === selectedMonarchB}>
                      {monarch.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Monarch B Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Secondary Monarch</label>
              <Select value={selectedMonarchB} onValueChange={setSelectedMonarchB}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Secondary Monarch..." />
                </SelectTrigger>
                <SelectContent>
                  {monarchs.map((monarch) => (
                    <SelectItem key={monarch.id} value={monarch.id} disabled={monarch.id === selectedMonarchA}>
                      {monarch.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleGenerate} disabled={!canGenerate} className="w-full">
            <Dna className="h-4 w-4 mr-2" />
            Initiate Gemini Protocol
          </Button>
        </CardContent>
      </Card>

      {/* Generated Sovereign Display */}
      {generatedSovereign && (
        <Card className="border-primary/50">
          <CardHeader className="bg-primary/5">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Crown className="h-6 w-6 text-primary" />
                <CardTitle className="text-xl">{generatedSovereign.name}</CardTitle>
              </div>
              <p className="text-lg text-muted-foreground italic">{generatedSovereign.title}</p>
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
            <div>
              <h4 className="font-semibold mb-2">Fusion Description</h4>
              <p className="text-muted-foreground">{generatedSovereign.description}</p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Combat Doctrine</h4>
              <p className="text-muted-foreground">{generatedSovereign.fusion_description}</p>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-3">Fusion Abilities</h4>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {generatedSovereign.abilities.map((ability, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${ability.is_capstone ? 'border-primary bg-primary/5' : 'border-border'}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {getActionIcon(ability.action_type)}
                          <span className="font-medium">{ability.name}</span>
                          {ability.is_capstone && (
                            <Badge variant="default" className="text-xs">Capstone</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Badge variant="outline">Level {ability.level}</Badge>
                          {ability.recharge && (
                            <Badge variant="secondary" className="text-xs">{ability.recharge}</Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{ability.description}</p>
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
