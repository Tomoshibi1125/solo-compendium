import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Clock, RefreshCw, Shield, Target, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { useToast } from '@/hooks/use-toast';
import { useDailyQuests } from '@/hooks/useDailyQuests';
import { useCharacter, useUpdateCharacter } from '@/hooks/useCharacters';
import { useEquipment } from '@/hooks/useEquipment';
import { useCampaignByCharacterId } from '@/hooks/useCampaigns';
import { isQuestActive, isQuestCompleted, isQuestExpired, getQuestProgress } from '@/lib/dailyQuests/types';
import { getLevelingMode } from '@/lib/campaignSettings';
import type { DailyQuestInstance, DailyQuestTemplate, QuestReward } from '@/lib/dailyQuests/types';

type QuestConfigForm = {
  enabled: boolean;
  difficulty_mode: 'easy' | 'normal' | 'hard' | 'extreme';
  reward_mode: 'minimal' | 'standard' | 'generous';
  penalty_mode: 'exhaustion' | 'system_fatigue' | 'none';
  reroll_allowance: number;
  max_active_quests: number;
  custom_scaling: Record<string, unknown>;
};

const buildConfigForm = (config?: QuestConfigForm): QuestConfigForm => ({
  enabled: config?.enabled ?? false,
  difficulty_mode: config?.difficulty_mode ?? 'normal',
  reward_mode: config?.reward_mode ?? 'standard',
  penalty_mode: config?.penalty_mode ?? 'exhaustion',
  reroll_allowance: config?.reroll_allowance ?? 0,
  max_active_quests: config?.max_active_quests ?? 3,
  custom_scaling: config?.custom_scaling ?? {},
});

const formatRequirement = (template?: DailyQuestTemplate) => {
  if (!template) return 'Requirement details unavailable.';
  const { requirements } = template;
  switch (requirements.type) {
    case 'check_count':
      return `Complete ${requirements.target} skill checks${requirements.skill ? ` (${requirements.skill})` : ''}.`;
    case 'distance_traveled':
      return `Travel ${requirements.target} units of distance.`;
    case 'combat_encounters':
      return `Finish ${requirements.target} combat encounter${requirements.target > 1 ? 's' : ''}.`;
    case 'training_minutes':
      return `Train for ${requirements.target} minutes.`;
    case 'resource_spend':
      return `Spend ${requirements.target} resource points.`;
    case 'craft_or_loot':
      return `Craft or loot ${requirements.target} item${requirements.target > 1 ? 's' : ''}.`;
    default:
      return 'Complete the daily objective.';
  }
};

const formatReward = (reward: QuestReward, showExperience: boolean) => {
  const parts: string[] = [];
  if (reward.system_favor) parts.push(`System Favor +${reward.system_favor}`);
  if (reward.gold) parts.push(`Gold +${reward.gold}`);
  if (reward.relic_shards) parts.push(`Relic Shards +${reward.relic_shards}`);
  if (showExperience && reward.experience) parts.push(`XP +${reward.experience}`);
  return parts.length > 0 ? parts.join(' | ') : reward.description;
};

export function QuestLog({ characterId }: { characterId: string }) {
  const { toast } = useToast();
  const { data: character } = useCharacter(characterId);
  const { data: characterCampaign } = useCampaignByCharacterId(characterId);
  const levelingMode = getLevelingMode(characterCampaign?.settings);
  const allowExperienceRewards = levelingMode === 'xp';
  const updateCharacter = useUpdateCharacter();
  const { equipment, addEquipment, updateEquipment } = useEquipment(characterId);
  const {
    templates,
    config,
    instances,
    upsertConfig,
    assignQuests,
    updateQuest,
    normalizeQuestReward,
  } = useDailyQuests(characterId, character?.level);

  const [configForm, setConfigForm] = useState<QuestConfigForm>(buildConfigForm());
  const [progressInputs, setProgressInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    if (config) {
      setConfigForm(buildConfigForm({
        enabled: config.enabled,
        difficulty_mode: config.difficulty_mode,
        reward_mode: config.reward_mode,
        penalty_mode: config.penalty_mode,
        reroll_allowance: config.reroll_allowance,
        max_active_quests: config.max_active_quests,
        custom_scaling: config.custom_scaling,
      }));
    }
  }, [config]);

  const templateById = useMemo(() => new Map(templates.map((template) => [template.id, template])), [templates]);

  const activeQuests = instances.filter((quest) => isQuestActive(quest));
  const completedQuests = instances.filter((quest) => isQuestCompleted(quest));
  const expiredQuests = instances.filter((quest) => isQuestExpired(quest) && !isQuestCompleted(quest));

  const handleSaveConfig = async () => {
    try {
      await upsertConfig(configForm);
      toast({
        title: 'Daily quest settings updated',
        description: 'Your daily quest preferences have been saved.',
      });
    } catch (error) {
      toast({
        title: 'Failed to update settings',
        description: error instanceof Error ? error.message : 'Unable to save daily quest settings.',
        variant: 'destructive',
      });
    }
  };

  const handleAssignQuests = async (forceNew = false) => {
    try {
      await assignQuests({ forceNew });
      toast({
        title: forceNew ? 'Daily quests rerolled' : 'Daily quests assigned',
        description: 'Check your objectives below.',
      });
    } catch (error) {
      toast({
        title: 'Quest assignment failed',
        description: error instanceof Error ? error.message : 'Unable to assign daily quests.',
        variant: 'destructive',
      });
    }
  };

  const updateCurrency = async (label: string, amount: number) => {
    if (amount === 0) return;
    const match = equipment.find((item) => item.item_type === 'currency' && item.name.toLowerCase().includes(label));
    if (match) {
      await updateEquipment({
        id: match.id,
        updates: { quantity: Math.max(0, (match.quantity || 0) + amount) },
      });
    } else {
      await addEquipment({
        character_id: characterId,
        name: label === 'gold' ? 'Gold' : label,
        item_type: 'currency',
        quantity: Math.max(0, amount),
        weight: 0.02,
        description: 'Daily quest reward',
      });
    }
  };

  const updateResource = async (label: string, amount: number) => {
    if (amount === 0) return;
    const match = equipment.find((item) => item.item_type === 'resource' && item.name.toLowerCase().includes(label));
    if (match) {
      await updateEquipment({
        id: match.id,
        updates: { quantity: Math.max(0, (match.quantity || 0) + amount) },
      });
    } else {
      await addEquipment({
        character_id: characterId,
        name: label === 'relic_shards' ? 'Relic Shards' : label,
        item_type: 'resource',
        quantity: Math.max(0, amount),
        weight: 0,
        description: 'Daily quest reward',
      });
    }
  };

  const applyRewards = async (quest: DailyQuestInstance, reward: QuestReward) => {
    if (!character) return;
    const existing = quest.rewards_granted as Record<string, unknown> | null;
    if (existing?.applied) return;

    const updates: Record<string, number> = {};
    if (reward.system_favor) {
      updates.system_favor_current = Math.min(
        character.system_favor_max,
        character.system_favor_current + reward.system_favor
      );
    }
    if (allowExperienceRewards && reward.experience) {
      updates.experience = (character.experience || 0) + reward.experience;
    }

    try {
      if (Object.keys(updates).length > 0) {
        await updateCharacter.mutateAsync({
          id: characterId,
          data: updates,
        });
      }

      if (reward.gold) {
        await updateCurrency('gold', reward.gold);
      }
      if (reward.relic_shards) {
        await updateResource('relic_shards', reward.relic_shards);
      }

      const grantedPayload: Record<string, unknown> = {
        ...reward,
        applied: true,
        applied_at: new Date().toISOString(),
      };
      await updateQuest({
        questId: quest.id,
        updates: {
          rewards_granted: grantedPayload,
        },
      });
    } catch (error) {
      toast({
        title: 'Reward delivery failed',
        description: error instanceof Error ? error.message : 'Unable to apply quest rewards.',
        variant: 'destructive',
      });
    }
  };

  const completeQuest = async (quest: DailyQuestInstance) => {
    const template = templateById.get(quest.template_id);
    const reward = normalizeQuestReward(quest, template);
    const progress = getQuestProgress(quest);
    const completedAt = new Date().toISOString();

    try {
      const rewardPayload: Record<string, unknown> = {
        ...reward,
        applied: false,
      };
      await updateQuest({
        questId: quest.id,
        updates: {
          status: 'completed',
          completed_at: completedAt,
          progress: {
            ...progress,
            current: progress.target,
            completed: true,
            last_updated: completedAt,
          },
          rewards_granted: rewardPayload,
        },
      });
      await applyRewards(quest, reward);
      toast({
        title: 'Quest completed',
        description: reward.description || 'Daily quest rewards granted.',
      });
    } catch (error) {
      toast({
        title: 'Failed to complete quest',
        description: error instanceof Error ? error.message : 'Unable to update quest.',
        variant: 'destructive',
      });
    }
  };

  const updateProgress = async (quest: DailyQuestInstance, nextValue: number) => {
    const progress = getQuestProgress(quest);
    const updatedAt = new Date().toISOString();
    const clamped = Math.max(0, Math.min(progress.target, nextValue));
    const status = clamped >= progress.target ? 'completed' : clamped > 0 ? 'in_progress' : quest.status;

    if (status === 'completed') {
      await completeQuest({
        ...quest,
        progress: { ...progress, current: clamped, last_updated: updatedAt },
      });
      return;
    }

    try {
      await updateQuest({
        questId: quest.id,
        updates: {
          status,
          progress: {
            ...progress,
            current: clamped,
            completed: false,
            last_updated: updatedAt,
          },
        },
      });
    } catch (error) {
      toast({
        title: 'Progress update failed',
        description: error instanceof Error ? error.message : 'Unable to update quest progress.',
        variant: 'destructive',
      });
    }
  };

  const renderQuestCard = (quest: DailyQuestInstance) => {
    const template = templateById.get(quest.template_id);
    const progress = getQuestProgress(quest);
    const reward = normalizeQuestReward(quest, template);
    const rewardsApplied = Boolean((quest.rewards_granted as Record<string, unknown> | null)?.applied);

    return (
      <Card key={quest.id} className="border border-muted">
        <CardHeader>
          <CardTitle className="flex items-start justify-between gap-3 text-base">
            <div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-accent" />
                <span>{template?.name || 'Daily Quest'}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {template?.description || 'Complete the daily objective.'}
              </p>
            </div>
            <Badge variant={quest.status === 'completed' ? 'default' : quest.status === 'expired' ? 'destructive' : 'outline'}>
              {quest.status.replace('_', ' ')}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {template?.tier && <Badge variant="secondary">Tier {template.tier}</Badge>}
            {template?.category && <Badge variant="outline">{template.category}</Badge>}
            {quest.expires_at && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(quest.expires_at).toLocaleString()}
              </Badge>
            )}
          </div>

          <p className="text-xs text-muted-foreground">{formatRequirement(template)}</p>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>
                {progress.current}/{progress.target}
              </span>
            </div>
            <Progress value={(progress.current / Math.max(1, progress.target)) * 100} />
          </div>

          <div className="text-sm text-muted-foreground">
            <strong className="text-foreground">Reward:</strong> {formatReward(reward, allowExperienceRewards)}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateProgress(quest, progress.current + 1)}
              disabled={quest.status === 'completed' || quest.status === 'expired'}
            >
              +1 Progress
            </Button>
            <Input
              value={progressInputs[quest.id] ?? ''}
              onChange={(event) => setProgressInputs((prev) => ({ ...prev, [quest.id]: event.target.value }))}
              placeholder="Set progress"
              className="w-28 h-8"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const value = parseInt(progressInputs[quest.id] || '0', 10);
                if (Number.isNaN(value)) return;
                updateProgress(quest, value);
              }}
            >
              Update
            </Button>
            <Button
              size="sm"
              onClick={() => completeQuest(quest)}
              disabled={quest.status === 'completed' || quest.status === 'expired'}
            >
              Complete
            </Button>
            {quest.status === 'completed' && !rewardsApplied && (
              <Button size="sm" variant="secondary" onClick={() => applyRewards(quest, reward)}>
                Claim Rewards
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <SystemWindow title="DAILY QUEST SETTINGS" className="border-accent/30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Enable Daily Quests</h3>
                <p className="text-xs text-muted-foreground">Assign new quests after long rest.</p>
              </div>
              <Switch
                checked={configForm.enabled}
                onCheckedChange={(value) => setConfigForm((prev) => ({ ...prev, enabled: value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="quest-difficulty" className="text-xs text-muted-foreground">Difficulty</label>
                <Select
                  value={configForm.difficulty_mode}
                  onValueChange={(value: QuestConfigForm['difficulty_mode']) =>
                    setConfigForm((prev) => ({ ...prev, difficulty_mode: value }))
                  }
                >
                  <SelectTrigger id="quest-difficulty" className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                    <SelectItem value="extreme">Extreme</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="quest-reward" className="text-xs text-muted-foreground">Reward Mode</label>
                <Select
                  value={configForm.reward_mode}
                  onValueChange={(value: QuestConfigForm['reward_mode']) =>
                    setConfigForm((prev) => ({ ...prev, reward_mode: value }))
                  }
                >
                  <SelectTrigger id="quest-reward" className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="generous">Generous</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="quest-penalty" className="text-xs text-muted-foreground">Penalty</label>
                <Select
                  value={configForm.penalty_mode}
                  onValueChange={(value: QuestConfigForm['penalty_mode']) =>
                    setConfigForm((prev) => ({ ...prev, penalty_mode: value }))
                  }
                >
                  <SelectTrigger id="quest-penalty" className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exhaustion">Exhaustion</SelectItem>
                    <SelectItem value="system_fatigue">System Fatigue</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="quest-max-active" className="text-xs text-muted-foreground">Max Active</label>
                <Input
                  id="quest-max-active"
                  type="number"
                  min={1}
                  max={5}
                  value={configForm.max_active_quests}
                  onChange={(event) =>
                    setConfigForm((prev) => ({
                      ...prev,
                      max_active_quests: Math.max(1, Number(event.target.value || 1)),
                    }))
                  }
                  className="h-9"
                />
              </div>
            </div>

            <div>
              <label htmlFor="quest-reroll" className="text-xs text-muted-foreground">Reroll Allowance</label>
              <Input
                id="quest-reroll"
                type="number"
                min={0}
                max={3}
                value={configForm.reroll_allowance}
                onChange={(event) =>
                  setConfigForm((prev) => ({
                    ...prev,
                    reroll_allowance: Math.max(0, Number(event.target.value || 0)),
                  }))
                }
                className="h-9"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button onClick={handleSaveConfig} className="gap-2">
              <Shield className="w-4 h-4" />
              Save Settings
            </Button>
            <Button
              variant="outline"
              onClick={() => handleAssignQuests(false)}
              disabled={!configForm.enabled}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Assign Daily Quests
            </Button>
            <Button
              variant="outline"
              onClick={() => handleAssignQuests(true)}
              disabled={!configForm.enabled}
              className="gap-2"
            >
              <Zap className="w-4 h-4" />
              Reroll Today
            </Button>
          </div>
        </div>
      </SystemWindow>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Active</div>
            <div className="text-2xl font-bold">{activeQuests.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Completed</div>
            <div className="text-2xl font-bold">{completedQuests.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Expired</div>
            <div className="text-2xl font-bold">{expiredQuests.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Rewards Claimed</div>
            <div className="text-2xl font-bold">
              {completedQuests.filter((quest) => (quest.rewards_granted as Record<string, unknown> | null)?.applied).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="expired">Expired</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeQuests.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No active quests yet.</p>
            </div>
          ) : (
            activeQuests.map(renderQuestCard)
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedQuests.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No completed quests yet.</p>
            </div>
          ) : (
            completedQuests.map(renderQuestCard)
          )}
        </TabsContent>

        <TabsContent value="expired" className="space-y-4">
          {expiredQuests.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No expired quests.</p>
            </div>
          ) : (
            expiredQuests.map(renderQuestCard)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
