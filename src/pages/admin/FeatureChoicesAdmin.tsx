import { useMemo, useState } from 'react';
import { Search, Loader2, Plus, Settings2, Layers } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { formatRegentVernacular, normalizeRegentSearch } from '@/lib/vernacular';

const supabaseAny = supabase as unknown as {
  from: (table: string) => any;
  rpc: (fn: string, args?: Record<string, unknown>) => Promise<{ data: unknown; error: { message?: string } | null }>;
};

type JobRow = { id: string; name: string };

type FeatureRow = {
  id: string;
  name: string;
  description: string;
  prerequisites: string | null;
  level: number;
  job_id: string;
  is_path_feature: boolean;
  path_id: string | null;
};

type ChoiceGroupRow = {
  id: string;
  feature_id: string;
  choice_key: string;
  choice_count: number;
  prompt: string | null;
};

type ChoiceOptionRow = {
  id: string;
  group_id: string;
  option_key: string;
  name: string;
  description: string | null;
  grants: unknown;
};

function isChoicePointFeature(feature: FeatureRow): boolean {
  const blob = `${feature.name}\n${feature.description || ''}\n${feature.prerequisites || ''}`;
  return /\b(choose|select|pick)\b/i.test(blob);
}

export default function FeatureChoicesAdmin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [selectedFeatureId, setSelectedFeatureId] = useState<string>('');
  const [autoSeeding, setAutoSeeding] = useState(false);

  const [newGroupChoiceKey, setNewGroupChoiceKey] = useState('');
  const [newGroupPrompt, setNewGroupPrompt] = useState('');
  const [newGroupCount, setNewGroupCount] = useState('1');

  const [newOptionKey, setNewOptionKey] = useState('');
  const [newOptionName, setNewOptionName] = useState('');
  const [newOptionDescription, setNewOptionDescription] = useState('');
  const [newOptionGrants, setNewOptionGrants] = useState('[{"type":"feature","name":"","description":""}]');

  const canonicalQuery = useMemo(() => normalizeRegentSearch(search.trim()), [search]);

  const { data: jobs = [] } = useQuery({
    queryKey: ['admin-choice-jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('compendium_jobs')
        .select('id, name')
        .order('name');
      if (error) throw error;
      return (data || []) as JobRow[];
    },
  });

  const { data: features = [], isLoading: featuresLoading } = useQuery({
    queryKey: ['admin-choice-features', canonicalQuery],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('compendium_job_features')
        .select('id, name, description, prerequisites, level, job_id, is_path_feature, path_id')
        .order('level', { ascending: true })
        .order('name', { ascending: true });
      if (error) throw error;

      const rows = (data || []) as FeatureRow[];
      const choicePoint = rows.filter(isChoicePointFeature);

      if (!canonicalQuery) return choicePoint;

      return choicePoint.filter((row) => {
        const hay = `${row.name}\n${row.description || ''}\n${row.prerequisites || ''}`;
        return normalizeRegentSearch(hay).includes(canonicalQuery);
      });
    },
  });

  const { data: groups = [], isLoading: groupsLoading } = useQuery({
    queryKey: ['admin-choice-groups', selectedFeatureId],
    queryFn: async () => {
      if (!selectedFeatureId) return [];
      const { data } = await supabase
        .from('compendium_feature_choice_groups' as never)
        .select('*')
        .eq('feature_id', selectedFeatureId)
        .order('choice_key');
      return (data || []) as ChoiceGroupRow[];
    },
    enabled: Boolean(selectedFeatureId),
  });

  const selectedGroupId = groups[0]?.id || '';

  const { data: options = [], isLoading: optionsLoading } = useQuery({
    queryKey: ['admin-choice-options', selectedGroupId],
    queryFn: async () => {
      if (!selectedGroupId) return [];
      const { data } = await supabase
        .from('compendium_feature_choice_options' as never)
        .select('*')
        .eq('group_id', selectedGroupId)
        .order('name');
      return (data || []) as ChoiceOptionRow[];
    },
    enabled: Boolean(selectedGroupId),
  });

  const jobNameById = useMemo(() => {
    const map = new Map<string, string>();
    jobs.forEach((j) => map.set(j.id, j.name));
    return map;
  }, [jobs]);

  const selectedFeature = useMemo(
    () => features.find((f) => f.id === selectedFeatureId) || null,
    [features, selectedFeatureId]
  );

  const hasMetadata = groups.length > 0;

  const handleAutoSeedASI = async () => {
    setAutoSeeding(true);
    try {
      const { data: featureRows, error: featureError } = await supabase
        .from('compendium_job_features')
        .select('id, name, description, prerequisites, level, job_id, is_path_feature, path_id')
        .order('level', { ascending: true })
        .order('name', { ascending: true });
      if (featureError) throw featureError;

      const features = (featureRows || []) as FeatureRow[];
      const asiFeatures = features.filter((feature) => {
        const blob = `${feature.name}\n${feature.description || ''}\n${feature.prerequisites || ''}`;
        return /\b(ability score improvement|asi)\b/i.test(blob);
      });

      const { data: featRows, error: featError } = await supabase
        .from('compendium_feats')
        .select('name')
        .order('name');
      if (featError) throw featError;

      const feats = (featRows || []) as Array<{ name: string }>;

      const abilities = ['STR', 'AGI', 'VIT', 'INT', 'SENSE', 'PRE'] as const;
      const buildKey = (raw: string) => {
        const key = normalizeRegentSearch(raw).replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
        return key || 'option';
      };

      let seededFeatureCount = 0;
      let seededOptionCount = 0;

      for (const feature of asiFeatures) {
        const choiceKey = 'asi_or_feat';

        await (supabase as any).from('compendium_feature_choice_groups')
          .upsert(
            {
              feature_id: feature.id,
              choice_key: choiceKey,
              choice_count: 1,
              prompt: 'Choose an enhancement protocol.',
            },
            { onConflict: 'feature_id,choice_key' }
          );

        const { data: groupRow, error: groupError } = await (supabase as any).from('compendium_feature_choice_groups')
          .select('id')
          .eq('feature_id', feature.id)
          .eq('choice_key', choiceKey)
          .maybeSingle();
        if (groupError) throw groupError;
        if (!groupRow?.id) continue;
        const groupId = groupRow.id as string;

        const { data: existingOptions } = await (supabase as any).from('compendium_feature_choice_options')
          .select('option_key')
          .eq('group_id', groupId);
        const existingKeys = new Set((existingOptions || []).map((o: any) => o.option_key));

        const pending: Array<{
          group_id: string;
          option_key: string;
          name: string;
          description: string | null;
          grants: unknown;
        }> = [];

        for (const a of abilities) {
          const optionKey = `asi_${a.toLowerCase()}_2`;
          if (!existingKeys.has(optionKey)) {
            pending.push({
              group_id: groupId,
              option_key: optionKey,
              name: `+2 ${a}`,
              description: null,
              grants: [{ type: 'ability_increase', ability: a, amount: 2 }],
            });
          }
        }

        for (let i = 0; i < abilities.length; i++) {
          for (let j = i + 1; j < abilities.length; j++) {
            const a = abilities[i];
            const b = abilities[j];
            const optionKey = `asi_${a.toLowerCase()}_${b.toLowerCase()}_1_1`;
            if (!existingKeys.has(optionKey)) {
              pending.push({
                group_id: groupId,
                option_key: optionKey,
                name: `+1 ${a} / +1 ${b}`,
                description: null,
                grants: [
                  { type: 'ability_increase', ability: a, amount: 1 },
                  { type: 'ability_increase', ability: b, amount: 1 },
                ],
              });
            }
          }
        }

        for (const feat of feats) {
          const optionKey = `feat_${buildKey(feat.name)}`;
          if (!existingKeys.has(optionKey)) {
            pending.push({
              group_id: groupId,
              option_key: optionKey,
              name: `Feat: ${feat.name}`,
              description: null,
              grants: [{ type: 'feat', name: feat.name }],
            });
          }
        }

        if (pending.length > 0) {
          const chunkSize = 100;
          for (let i = 0; i < pending.length; i += chunkSize) {
            const chunk = pending.slice(i, i + chunkSize);
            await (supabase as any).from('compendium_feature_choice_options' as never).insert(chunk);
            seededOptionCount += chunk.length;
          }
        }

        seededFeatureCount += 1;
      }

      queryClient.invalidateQueries({ queryKey: ['admin-choice-features'] });
      if (selectedFeatureId) {
        queryClient.invalidateQueries({ queryKey: ['admin-choice-groups', selectedFeatureId] });
      }

      toast({
        title: 'Auto-seed complete',
        description: `Seeded ${seededFeatureCount} ASI feature${seededFeatureCount === 1 ? '' : 's'} and ${seededOptionCount} option${seededOptionCount === 1 ? '' : 's'}.`,
      });
    } catch (error) {
      toast({
        title: 'Auto-seed failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setAutoSeeding(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!selectedFeatureId) return;
    const choiceKey = newGroupChoiceKey.trim();
    if (!choiceKey) {
      toast({ title: 'Choice key required', variant: 'destructive' });
      return;
    }

    const count = Number(newGroupCount);
    if (!Number.isFinite(count) || count < 1) {
      toast({ title: 'Choice count must be >= 1', variant: 'destructive' });
      return;
    }

    try {
      await (supabase as any).from('compendium_feature_choice_groups' as never).insert({
        feature_id: selectedFeatureId,
        choice_key: choiceKey,
        choice_count: count,
        prompt: newGroupPrompt.trim() || null,
      });

      setNewGroupChoiceKey('');
      setNewGroupPrompt('');
      setNewGroupCount('1');

      queryClient.invalidateQueries({ queryKey: ['admin-choice-groups', selectedFeatureId] });

      toast({
        title: 'Choice group created',
        description: 'The System has registered a new selection protocol.',
      });
    } catch (error) {
      toast({
        title: 'Failed to create group',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  const handleCreateOption = async () => {
    if (!selectedGroupId) return;

    const optionKey = newOptionKey.trim();
    const name = newOptionName.trim();

    if (!optionKey || !name) {
      toast({ title: 'Option key and name are required', variant: 'destructive' });
      return;
    }

    let grants: unknown;
    try {
      grants = JSON.parse(newOptionGrants);
    } catch {
      toast({ title: 'Invalid grants JSON', variant: 'destructive' });
      return;
    }

    try {
      await (supabase as any).from('compendium_feature_choice_options' as never).insert({
        group_id: selectedGroupId,
        option_key: optionKey,
        name,
        description: newOptionDescription.trim() || null,
        grants,
      });

      setNewOptionKey('');
      setNewOptionName('');
      setNewOptionDescription('');
      setNewOptionGrants('[{"type":"feature","name":"","description":""}]');

      queryClient.invalidateQueries({ queryKey: ['admin-choice-options', selectedGroupId] });

      toast({
        title: 'Option created',
        description: 'The System has bound a new option to this protocol.',
      });
    } catch (error) {
      toast({
        title: 'Failed to create option',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-arise/20 to-shadow-purple/20 border border-arise/30 flex items-center justify-center">
              <Layers className="w-6 h-6 text-arise" />
            </div>
            <div className="flex-1">
              <h1 className="font-arise text-3xl font-bold gradient-text-system tracking-wider">
                SELECTION PROTOCOLS
              </h1>
              <p className="text-muted-foreground font-heading">
                Configure D&D Beyond-style class feature choice points
              </p>
            </div>

            <Button
              variant="outline"
              className="gap-2 border-arise/30 hover:bg-arise/10 hover:border-arise"
              onClick={handleAutoSeedASI}
              disabled={autoSeeding}
            >
              {autoSeeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Settings2 className="w-4 h-4" />}
              Auto-Seed ASI/Feats
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SystemWindow title="CHOICE-POINT FEATURES" className="border-arise/30">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search choose/select/pick features..."
                  className="pl-10"
                />
              </div>

              {featuresLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Scanning compendium...
                </div>
              ) : features.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  No choice-point features detected.
                </div>
              ) : (
                <div className="max-h-[520px] overflow-y-auto space-y-2 pr-1">
                  {features.map((feature) => {
                    const jobName = jobNameById.get(feature.job_id) || 'Unknown Job';
                    const isSelected = feature.id === selectedFeatureId;
                    return (
                      <button
                        key={feature.id}
                        type="button"
                        onClick={() => setSelectedFeatureId(feature.id)}
                        className={cn(
                          'w-full text-left p-3 rounded-lg border transition-colors',
                          isSelected
                            ? 'border-arise/50 bg-arise/10'
                            : 'border-border bg-muted/30 hover:bg-muted/50'
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="font-heading font-semibold">
                              {formatRegentVernacular(feature.name)}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {formatRegentVernacular(jobName)} • Level {feature.level}
                              {feature.is_path_feature ? ' • Path' : ''}
                            </div>
                          </div>
                          <Badge variant={isSelected ? 'default' : 'outline'} className="text-xs">
                            {feature.id.slice(0, 6)}
                          </Badge>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </SystemWindow>

          <SystemWindow title="PROTOCOL CONFIG" className="border-arise/30">
            {!selectedFeature ? (
              <div className="text-sm text-muted-foreground">
                Select a feature on the left to configure its choice protocol.
              </div>
            ) : (
              <div className="space-y-5">
                <div className="p-3 rounded-lg border bg-muted/30">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-heading font-semibold">
                        {formatRegentVernacular(selectedFeature.name)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Level {selectedFeature.level} • {formatRegentVernacular(jobNameById.get(selectedFeature.job_id) || 'Unknown Job')}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Settings2 className="w-4 h-4 text-muted-foreground" />
                      <Badge variant={hasMetadata ? 'default' : 'outline'} className="text-xs">
                        {hasMetadata ? 'Configured' : 'Missing'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="font-heading">Create Choice Group</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <Input
                      value={newGroupChoiceKey}
                      onChange={(e) => setNewGroupChoiceKey(e.target.value)}
                      placeholder="choice_key (e.g. fighting_style)"
                    />
                    <Input
                      value={newGroupCount}
                      onChange={(e) => setNewGroupCount(e.target.value)}
                      placeholder="count"
                      inputMode="numeric"
                    />
                    <Button onClick={handleCreateGroup} className="gap-2">
                      <Plus className="w-4 h-4" />
                      Create
                    </Button>
                  </div>
                  <Textarea
                    value={newGroupPrompt}
                    onChange={(e) => setNewGroupPrompt(e.target.value)}
                    placeholder="Prompt shown to players (optional)"
                    className="min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-heading">Existing Groups</Label>
                  {groupsLoading ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading groups...
                    </div>
                  ) : groups.length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                      No choice groups configured for this feature yet.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {groups.map((g) => (
                        <div key={g.id} className="p-3 rounded-lg border bg-muted/30">
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <div className="font-heading font-semibold">
                                {formatRegentVernacular(g.choice_key)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Pick {g.choice_count}{g.prompt ? ` • ${formatRegentVernacular(g.prompt)}` : ''}
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {g.id.slice(0, 6)}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Label className="font-heading">Add Option (first group only)</Label>
                  {!selectedGroupId ? (
                    <div className="text-sm text-muted-foreground">
                      Create a group first.
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <Input
                          value={newOptionKey}
                          onChange={(e) => setNewOptionKey(e.target.value)}
                          placeholder="option_key (e.g. defense)"
                        />
                        <Input
                          value={newOptionName}
                          onChange={(e) => setNewOptionName(e.target.value)}
                          placeholder="Option name"
                        />
                      </div>
                      <Textarea
                        value={newOptionDescription}
                        onChange={(e) => setNewOptionDescription(e.target.value)}
                        placeholder="Option description (optional)"
                        className="min-h-[80px]"
                      />
                      <Textarea
                        value={newOptionGrants}
                        onChange={(e) => setNewOptionGrants(e.target.value)}
                        placeholder='Grants JSON (e.g. [{"type":"feature","name":"..."}])'
                        className="min-h-[120px] font-mono text-xs"
                      />
                      <div className="flex justify-end">
                        <Button onClick={handleCreateOption} className="gap-2">
                          <Plus className="w-4 h-4" />
                          Add Option
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <Label className="font-heading">Options</Label>
                        {optionsLoading ? (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Loading options...
                          </div>
                        ) : options.length === 0 ? (
                          <div className="text-sm text-muted-foreground">
                            No options configured yet.
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {options.map((o) => (
                              <div key={o.id} className="p-3 rounded-lg border bg-muted/30">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1">
                                    <div className="font-heading font-semibold">
                                      {formatRegentVernacular(o.name)}
                                    </div>
                                    {o.description && (
                                      <div className="text-xs text-muted-foreground mt-1">
                                        {formatRegentVernacular(o.description)}
                                      </div>
                                    )}
                                    <div className="text-[10px] text-muted-foreground mt-2 font-mono break-all">
                                      {JSON.stringify(o.grants)}
                                    </div>
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {o.option_key}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </SystemWindow>
        </div>
      </div>
    </Layout>
  );
}
