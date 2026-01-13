/**
 * Daily Quest System Types
 * Solo Leveling inspired daily training quests
 */

import { z } from 'zod';

// Quest requirement types
export const QuestRequirementSchema = z.object({
  type: z.enum(['check_count', 'distance_traveled', 'combat_encounters', 'training_minutes', 'resource_spend', 'craft_or_loot']),
  skill: z.enum(['STR', 'AGI', 'VIT', 'INT', 'SENSE', 'PRE', 'ATH', 'ACR', 'STE', 'PERF', 'INV', 'HIST', 'MED', 'NAT', 'REL', 'SURV', 'DEC', 'INS', 'INTIM', 'PERC']).optional(),
  target: z.number(),
  difficulty: z.string().optional(),
  require_hits: z.number().optional(),
  require_spells: z.number().optional(),
  item_types: z.array(z.string()).optional(),
});

export type QuestRequirement = z.infer<typeof QuestRequirementSchema>;

// Quest scaling types
export const QuestScalingSchema = z.object({
  type: z.enum(['proficiency_bonus', 'character_level', 'fixed']),
  multiplier: z.number(),
  offset: z.number().default(0),
});

export type QuestScaling = z.infer<typeof QuestScalingSchema>;

// Quest reward types
export const QuestRewardSchema = z.object({
  system_favor: z.number().optional(),
  gold: z.number().optional(),
  relic_shards: z.number().optional(),
  experience: z.number().optional(),
  description: z.string(),
  custom_rewards: z.record(z.string(), z.unknown()).optional().default({}),
});

export type QuestReward = z.infer<typeof QuestRewardSchema>;

// Quest template
export const DailyQuestTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  tags: z.array(z.string()).default([]),
  tier: z.enum(['I', 'II', 'III', 'IV']),
  category: z.enum(['Training', 'Combat', 'Exploration', 'Mana', 'Crafting']),
  requirements: QuestRequirementSchema,
  default_scaling: QuestScalingSchema,
  base_rewards: QuestRewardSchema,
  is_active: z.boolean().default(true),
  created_at: z.string(),
  updated_at: z.string(),
});

export type DailyQuestTemplate = z.infer<typeof DailyQuestTemplateSchema>;

// Quest instance
export const DailyQuestInstanceSchema = z.object({
  id: z.string(),
  character_id: z.string(),
  template_id: z.string(),
  date_key: z.string(), // YYYY-MM-DD
  assigned_at: z.string(),
  expires_at: z.string(),
  completed_at: z.string().nullable(),
  status: z.enum(['pending', 'in_progress', 'completed', 'failed', 'expired']),
  progress: z.record(z.string(), z.unknown()),
  seed: z.number(),
  scaling_applied: z.record(z.string(), z.unknown()),
  rewards_granted: z.record(z.string(), z.unknown()).nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type DailyQuestInstance = z.infer<typeof DailyQuestInstanceSchema>;

// Quest configuration
export const DailyQuestConfigSchema = z.object({
  id: z.string(),
  character_id: z.string().nullable(),
  campaign_id: z.string().nullable(),
  enabled: z.boolean(),
  difficulty_mode: z.enum(['easy', 'normal', 'hard', 'extreme']),
  reward_mode: z.enum(['minimal', 'standard', 'generous']),
  penalty_mode: z.enum(['exhaustion', 'system_fatigue', 'none']),
  reroll_allowance: z.number(),
  max_active_quests: z.number(),
  custom_scaling: z.record(z.string(), z.unknown()),
  created_at: z.string(),
  updated_at: z.string(),
});

export type DailyQuestConfig = z.infer<typeof DailyQuestConfigSchema>;

// Progress tracking
export interface QuestProgress {
  current: number;
  target: number;
  completed: boolean;
  last_updated: string;
}

// Quest assignment request
export interface QuestAssignmentRequest {
  character_id: string;
  force_new?: boolean; // Override existing quests
}

// Quest completion request
export interface QuestCompletionRequest {
  quest_id: string;
  character_id: string;
  progress_updates?: Record<string, unknown>;
}

// Quest reward result
export interface QuestRewardResult {
  granted: QuestReward;
  applied: boolean;
  message: string;
}

// Daily quest summary for UI
export interface DailyQuestSummary {
  date_key: string;
  total_quests: number;
  completed_quests: number;
  pending_quests: number;
  expired_quests: number;
  total_rewards: QuestReward;
}

// Quest types for filtering
export type QuestTier = 'I' | 'II' | 'III' | 'IV';
export type QuestCategory = 'Training' | 'Combat' | 'Exploration' | 'Mana' | 'Crafting';
export type QuestStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'expired';

// Helper functions
export function isQuestCompleted(quest: DailyQuestInstance): boolean {
  return quest.status === 'completed';
}

export function isQuestExpired(quest: DailyQuestInstance): boolean {
  return new Date(quest.expires_at) < new Date();
}

export function isQuestActive(quest: DailyQuestInstance): boolean {
  return ['pending', 'in_progress'].includes(quest.status) && !isQuestExpired(quest);
}

export function getQuestProgress(quest: DailyQuestInstance): QuestProgress {
  const progress = (quest.progress as unknown as QuestProgress) || {
    current: 0,
    target: 0,
    completed: false,
    last_updated: quest.updated_at,
  };
  return {
    current: progress.current || 0,
    target: progress.target || 0,
    completed: progress.completed || false,
    last_updated: progress.last_updated || quest.updated_at,
  };
}

export function calculateQuestReward(
  template: DailyQuestTemplate,
  scaling: QuestScaling,
  characterLevel: number,
  proficiencyBonus: number,
  rewardMode: 'minimal' | 'standard' | 'generous' = 'standard'
): QuestReward {
  let multiplier = 1;
  
  switch (scaling.type) {
    case 'proficiency_bonus':
      multiplier = proficiencyBonus * scaling.multiplier + scaling.offset;
      break;
    case 'character_level':
      multiplier = characterLevel * scaling.multiplier + scaling.offset;
      break;
    case 'fixed':
      multiplier = scaling.multiplier + scaling.offset;
      break;
  }
  
  // Apply reward mode multiplier
  switch (rewardMode) {
    case 'minimal':
      multiplier *= 0.5;
      break;
    case 'generous':
      multiplier *= 1.5;
      break;
    case 'standard':
    default:
      // No change
      break;
  }
  
  return {
    system_favor: template.base_rewards.system_favor ? Math.max(1, Math.floor(template.base_rewards.system_favor * multiplier)) : undefined,
    gold: template.base_rewards.gold ? Math.max(1, Math.floor(template.base_rewards.gold * multiplier)) : undefined,
    relic_shards: template.base_rewards.relic_shards ? Math.max(1, Math.floor(template.base_rewards.relic_shards * multiplier)) : undefined,
    experience: template.base_rewards.experience ? Math.max(1, Math.floor(template.base_rewards.experience * multiplier)) : undefined,
    description: template.base_rewards.description,
    custom_rewards: template.base_rewards.custom_rewards,
  };
}
