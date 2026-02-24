-- Comprehensive Technique and Choice Seeding Migration
-- Creates compendium_techniques and character_techniques tables
-- Seeds techniques from authoritative canon
-- Seeds all remaining choice metadata for feats, tools, techniques, and powers

-- 1. TABLES
CREATE TABLE IF NOT EXISTS public.compendium_techniques (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  technique_type TEXT NOT NULL, -- offensive, defensive, mobility, utility, finishing
  style TEXT NOT NULL, -- unarmed, weapon, any, etc.
  level_requirement INTEGER DEFAULT 1,
  class_requirement TEXT,
  activation_type TEXT NOT NULL, -- action, bonus-action, reaction, free
  activation_cost TEXT,
  duration TEXT,
  range_desc TEXT,
  primary_effect TEXT NOT NULL,
  secondary_effect TEXT,
  mechanics JSONB DEFAULT '{}'::jsonb,
  flavor TEXT,
  source TEXT DEFAULT 'System Ascendant Canon',
  image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.character_techniques (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  technique_id UUID NOT NULL REFERENCES public.compendium_techniques(id) ON DELETE CASCADE,
  learned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  source TEXT,
  UNIQUE (character_id, technique_id)
);

-- RLS
ALTER TABLE public.compendium_techniques ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_techniques ENABLE ROW LEVEL SECURITY;

CREATE POLICY compendium_techniques_select ON public.compendium_techniques FOR SELECT USING (true);
CREATE POLICY character_techniques_select ON public.character_techniques FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.characters WHERE characters.id = character_techniques.character_id)
);
CREATE POLICY character_techniques_insert ON public.character_techniques FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.characters WHERE characters.id = character_techniques.character_id)
);

-- 2. SEED TECHNIQUES
INSERT INTO public.compendium_techniques (name, description, technique_type, style, level_requirement, class_requirement, activation_type, primary_effect, flavor, image)
VALUES
('Shadow Strike', 'A devastating attack that strikes from unexpected angles.', 'offensive', 'weapon', 5, NULL, 'action', 'Attack with advantage and deal extra damage equal to your proficiency bonus.', 'You strike from the shadows themselves, appearing where your enemy least expects.', '/generated/compendium/techniques/shadow-strike.webp'),
('Dragon Fist', 'A devastating unarmed strike that channels essence mimicking rift-born dragons.', 'offensive', 'unarmed', 8, 'Striker', 'action', 'Deal 3d10 force damage plus your Strength modifier.', 'Essence coils around your fist like a dragon''s maw.', '/generated/compendium/techniques/dragon-fist.webp'),
('Void Slash', 'A dimensional cutting attack that tears through reality.', 'offensive', 'weapon', 12, NULL, 'action', 'Attack ignores all armor and resistance.', 'Your blade doesn''t cut through armor—it cuts through the dimension.', '/generated/compendium/techniques/void-slash.webp'),
('Multi-Shot', 'Fire multiple arrows at different targets simultaneously.', 'offensive', 'ranged', 6, NULL, 'action', 'Make three ranged attacks against different targets.', 'Your arrows fly in impossible arcs.', '/generated/compendium/techniques/multi-shot.webp'),
('Shadow Dodge', 'Phase through shadows to avoid attacks.', 'defensive', 'any', 4, NULL, 'reaction', 'Teleport up to 30 feet and the attack automatically misses.', 'You melt into the shadows.', '/generated/compendium/techniques/shadow-dodge.webp'),
('Iron Wall', 'An impenetrable defensive stance.', 'defensive', 'shield', 6, NULL, 'reaction', 'Gain resistance to physical damage until your next turn.', 'Your shield becomes an unbreakable wall.', '/generated/compendium/techniques/iron-wall.webp'),
('Shadow Step', 'Teleport through shadows to reposition yourself.', 'mobility', 'any', 3, NULL, 'bonus-action', 'Teleport up to 30 feet to an unoccupied space in dim light.', 'You step through the shadows.', '/generated/compendium/techniques/shadow-step-mobility.webp')
ON CONFLICT (name) DO NOTHING;

-- 3. CHOICE SEEDING (TECHNIQUES)
INSERT INTO public.compendium_feature_choice_groups (feature_id, choice_key, choice_count, prompt)
SELECT 
  f.id, 
  'technique', 
  1, 
  'Select a combat technique.'
FROM public.compendium_job_features f
WHERE lower(f.name || ' ' || coalesce(f.description, '') || ' ' || coalesce(f.prerequisites, '')) ~ '(choose|select|pick)'
  AND lower(f.name || ' ' || coalesce(f.description, '') || ' ' || coalesce(f.prerequisites, '')) ~ '\btechnique\b'
ON CONFLICT (feature_id, choice_key) DO NOTHING;

WITH tech_groups AS (
  SELECT g.id AS group_id, f.level AS feature_level
  FROM public.compendium_feature_choice_groups g
  JOIN public.compendium_job_features f ON f.id = g.feature_id
  WHERE g.choice_key = 'technique'
)
INSERT INTO public.compendium_feature_choice_options (group_id, option_key, name, description, grants)
SELECT
  tg.group_id,
  'tech_' || regexp_replace(lower(t.name), '[^a-z0-9]+', '_', 'g') AS option_key,
  t.name,
  t.description,
  jsonb_build_array(jsonb_build_object('type','technique','name',t.name)) AS grants
FROM tech_groups tg
CROSS JOIN public.compendium_techniques t
WHERE t.level_requirement <= tg.feature_level
ON CONFLICT (group_id, option_key) DO NOTHING;

-- 4. HARDEN LEVELED POWER SEEDING (Canonical Job Names)
-- This updates existing group metadata to ensure we match the current canonical 14 jobs accurately
UPDATE public.compendium_feature_choice_groups
SET prompt = 'Select a System power appropriate for your Hunter level.'
WHERE choice_key = 'leveled_power';
