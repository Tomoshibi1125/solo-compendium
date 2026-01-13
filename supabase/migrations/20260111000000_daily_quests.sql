-- Daily Quest System Migration
-- Implements Solo Leveling inspired daily training quests

-- Daily Quest Templates (definitions)
CREATE TABLE IF NOT EXISTS daily_quest_templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  tier TEXT NOT NULL CHECK (tier IN ('I', 'II', 'III', 'IV')),
  category TEXT NOT NULL CHECK (category IN ('Training', 'Combat', 'Exploration', 'Mana', 'Crafting')),
  requirements JSONB NOT NULL, -- Structured, machine-readable requirements
  default_scaling JSONB NOT NULL, -- Scaling rules by level/proficiency
  base_rewards JSONB NOT NULL, -- Structured reward definition
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily Quest Instances (per character per day)
CREATE TABLE IF NOT EXISTS daily_quest_instances (
  id TEXT PRIMARY KEY,
  character_id TEXT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  template_id TEXT NOT NULL REFERENCES daily_quest_templates(id) ON DELETE CASCADE,
  date_key TEXT NOT NULL, -- YYYY-MM-DD format for easy querying
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL, -- When quest expires (next long rest)
  completed_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed', 'expired')),
  progress JSONB NOT NULL DEFAULT '{}', -- Current progress tracking
  seed INTEGER NOT NULL, -- For deterministic assignment
  scaling_applied JSONB NOT NULL DEFAULT '{}', -- Applied scaling values
  rewards_granted JSONB DEFAULT '{}', -- Track granted rewards
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(character_id, date_key, template_id)
);

-- Daily Quest Configuration (per campaign/character)
CREATE TABLE IF NOT EXISTS daily_quest_configs (
  id TEXT PRIMARY KEY,
  character_id TEXT REFERENCES characters(id) ON DELETE CASCADE,
  campaign_id TEXT REFERENCES campaigns(id) ON DELETE CASCADE,
  enabled BOOLEAN DEFAULT false,
  difficulty_mode TEXT DEFAULT 'normal' CHECK (difficulty_mode IN ('easy', 'normal', 'hard', 'extreme')),
  reward_mode TEXT DEFAULT 'standard' CHECK (reward_mode IN ('minimal', 'standard', 'generous')),
  penalty_mode TEXT DEFAULT 'exhaustion' CHECK (penalty_mode IN ('exhaustion', 'system_fatigue', 'none')),
  reroll_allowance INTEGER DEFAULT 0, -- Max rerolls per rest period
  max_active_quests INTEGER DEFAULT 3, -- Max quests assigned simultaneously
  custom_scaling JSONB DEFAULT '{}', -- Override default scaling
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT single_config_per_character CHECK (
    (character_id IS NOT NULL AND campaign_id IS NULL) OR 
    (character_id IS NULL AND campaign_id IS NOT NULL)
  )
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_daily_quest_instances_character_date ON daily_quest_instances(character_id, date_key);
CREATE INDEX IF NOT EXISTS idx_daily_quest_instances_status ON daily_quest_instances(status);
CREATE INDEX IF NOT EXISTS idx_daily_quest_instances_expires_at ON daily_quest_instances(expires_at);
CREATE INDEX IF NOT EXISTS idx_daily_quest_templates_tier ON daily_quest_templates(tier);
CREATE INDEX IF NOT EXISTS idx_daily_quest_templates_category ON daily_quest_templates(category);
CREATE INDEX IF NOT EXISTS idx_daily_quest_templates_active ON daily_quest_templates(is_active);

-- RLS Policies
ALTER TABLE daily_quest_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_quest_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_quest_configs ENABLE ROW LEVEL SECURITY;

-- Quest templates are publicly readable (system content)
CREATE POLICY "Quest templates are publicly readable" ON daily_quest_templates
  FOR SELECT USING (true);

-- Quest instances are readable by owners and campaign members
CREATE POLICY "Quest instances readable by owner" ON daily_quest_instances
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM characters 
      WHERE characters.id = daily_quest_instances.character_id 
      AND characters.user_id = auth.uid()
    )
  );

CREATE POLICY "Quest instances readable by campaign members" ON daily_quest_instances
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM characters 
      JOIN campaign_members ON characters.id = campaign_members.character_id
      WHERE characters.id = daily_quest_instances.character_id 
      AND campaign_members.user_id = auth.uid()
    )
  );

-- Quest instances are manageable by owners
CREATE POLICY "Quest instances manageable by owner" ON daily_quest_instances
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM characters 
      WHERE characters.id = daily_quest_instances.character_id 
      AND characters.user_id = auth.uid()
    )
  );

-- Quest configs are readable/manageable by owners
CREATE POLICY "Quest configs manageable by character owner" ON daily_quest_configs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM characters 
      WHERE characters.id = daily_quest_configs.character_id 
      AND characters.user_id = auth.uid()
    )
  );

CREATE POLICY "Quest configs manageable by campaign owner" ON daily_quest_configs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM campaigns 
      WHERE campaigns.id = daily_quest_configs.campaign_id 
      AND campaigns.user_id = auth.uid()
    )
  );

-- Insert default quest templates
INSERT INTO daily_quest_templates (id, name, description, tags, tier, category, requirements, default_scaling, base_rewards) VALUES
-- Training Quests
('training_pushups', 'Physical Conditioning: Push-ups', 'Complete a set of push-ups to build upper body strength.', ARRAY['physical', 'strength'], 'I', 'Training', 
 '{"type": "check_count", "skill": "ATH", "target": 3, "difficulty": "DC 10"}',
 '{"type": "proficiency_bonus", "multiplier": 1}',
 '{"system_favor": 2, "description": "Basic conditioning reward"}'),

('training_squats', 'Physical Conditioning: Squats', 'Complete a set of squats to build lower body strength.', ARRAY['physical', 'strength'], 'I', 'Training',
 '{"type": "check_count", "skill": "ATH", "target": 3, "difficulty": "DC 10"}',
 '{"type": "proficiency_bonus", "multiplier": 1}',
 '{"system_favor": 2, "description": "Basic conditioning reward"}'),

('training_running', 'Endurance Training', 'Maintain a steady pace for extended distance.', ARRAY['physical', 'endurance'], 'I', 'Training',
 '{"type": "check_count", "skill": "ATH", "target": 2, "difficulty": "DC 12"}',
 '{"type": "proficiency_bonus", "multiplier": 1}',
 '{"system_favor": 3, "description": "Endurance building reward"}'),

-- Combat Quests
('combat_precision', 'Combat Precision', 'Land successful attacks in combat scenarios.', ARRAY['combat', 'precision'], 'II', 'Combat',
 '{"type": "combat_encounters", "target": 1, "require_hits": 3}',
 '{"type": "character_level", "multiplier": 0.5}',
 '{"system_favor": 5, "description": "Combat training reward"}'),

('combat_spellcasting', 'Spell Combat Practice', 'Cast spells successfully in combat.', ARRAY['combat', 'magic'], 'II', 'Combat',
 '{"type": "combat_encounters", "target": 1, "require_spells": 2}',
 '{"type": "character_level", "multiplier": 0.5}',
 '{"system_favor": 5, "description": "Spell combat practice reward"}'),

-- Exploration Quests
('exploration_mapping', 'Area Mapping', 'Explore and map new territory.', ARRAY['exploration', 'mapping'], 'I', 'Exploration',
 '{"type": "check_count", "skill": "SURVIVAL", "target": 2, "difficulty": "DC 13"}',
 '{"type": "proficiency_bonus", "multiplier": 1}',
 '{"system_favor": 3, "description": "Exploration reward"}'),

-- Mana/Energy Quests
('mana_meditation', 'Mana Meditation', 'Focus and restore magical energy through meditation.', ARRAY['magic', 'meditation'], 'I', 'Mana',
 '{"type": "training_minutes", "target": 30}',
 '{"type": "proficiency_bonus", "multiplier": 1}',
 '{"system_favor": 2, "description": "Mana restoration reward"}'),

-- Crafting Quests
('crafting_basic', 'Basic Crafting', 'Create or repair basic equipment.', ARRAY['crafting', 'repair'], 'I', 'Crafting',
 '{"type": "craft_or_loot", "target": 1, "item_types": ["equipment", "consumable"]}',
 '{"type": "proficiency_bonus", "multiplier": 1}',
 '{"system_favor": 3, "description": "Crafting practice reward"}')

ON CONFLICT (id) DO NOTHING;

-- Functions for quest management
CREATE OR REPLACE FUNCTION assign_daily_quests(character_uuid TEXT)
RETURNS TABLE(id TEXT, template_id TEXT, status TEXT)
LANGUAGE plpgsql
AS $$
DECLARE
  quest_config RECORD;
  available_templates TEXT[];
  selected_templates TEXT[];
  quest_seed INTEGER;
  date_key TEXT;
BEGIN
  -- Get character's quest config or campaign default
  SELECT * INTO quest_config 
  FROM daily_quest_configs 
  WHERE character_id = character_uuid 
  LIMIT 1;
  
  -- If no config or disabled, return empty
  IF quest_config IS NULL OR NOT quest_config.enabled THEN
    RETURN;
  END IF;
  
  -- Get today's date key
  date_key := TO_CHAR(NOW(), 'YYYY-MM-DD');
  
  -- Generate seed for deterministic selection
  quest_seed := MOD(hashtext(character_uuid || date_key), 2147483647);
  
  -- Get available templates for this character's level
  SELECT ARRAY_AGG(id) INTO available_templates
  FROM daily_quest_templates
  WHERE is_active = true
  AND tier IN (
    CASE 
      WHEN (SELECT level FROM characters WHERE id = character_uuid) <= 4 THEN 'I'
      WHEN (SELECT level FROM characters WHERE id = character_uuid) <= 10 THEN 'I','II'
      WHEN (SELECT level FROM characters WHERE id = character_uuid) <= 16 THEN 'I','II','III'
      ELSE 'I','II','III','IV'
    END
  );
  
  -- Select templates using seed
  IF array_length(available_templates, 1) > 0 THEN
    SELECT ARRAY_AGG(available_templates[i])
    INTO selected_templates
    FROM generate_series(1, LEAST(quest_config.max_active_quests, array_length(available_templates, 1))) i
    WHERE available_templates[i] IS NOT NULL
    ORDER BY (quest_seed + i) % array_length(available_templates, 1)
    LIMIT quest_config.max_active_quests;
  END IF;
  
  -- Create quest instances
  IF selected_templates IS NOT NULL THEN
    INSERT INTO daily_quest_instances (id, character_id, template_id, date_key, seed, expires_at)
    SELECT 
      gen_random_uuid()::text,
      character_uuid,
      template_id,
      date_key,
      quest_seed + row_number,
      NOW() + INTERVAL '24 hours'
    FROM unnest(selected_templates) WITH ORDINALITY AS t(template_id, row_number)
    ON CONFLICT (character_id, date_key, template_id) DO NOTHING
    RETURNING id, template_id, 'pending'::text;
  END IF;
END;
$$;

-- Trigger to automatically assign quests after long rest
CREATE OR REPLACE FUNCTION on_long_rest_assign_quests()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only proceed if daily quests are enabled for this character
  IF EXISTS (
    SELECT 1 FROM daily_quest_configs 
    WHERE character_id = NEW.id 
    AND enabled = true
  ) THEN
    -- Mark any existing pending quests as expired
    UPDATE daily_quest_instances 
    SET status = 'expired', completed_at = NOW()
    WHERE character_id = NEW.id 
    AND status IN ('pending', 'in_progress')
    AND expires_at <= NOW();
    
    -- Assign new quests
    PERFORM * FROM assign_daily_quests(NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on character updates (long rest completion)
-- Note: This would be triggered by application logic after executeLongRest
-- The trigger function exists but should be called explicitly from the app

-- Update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Apply timestamp triggers
CREATE TRIGGER update_daily_quest_templates_updated_at
  BEFORE UPDATE ON daily_quest_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_quest_instances_updated_at
  BEFORE UPDATE ON daily_quest_instances
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_quest_configs_updated_at
  BEFORE UPDATE ON daily_quest_configs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
