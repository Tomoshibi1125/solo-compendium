-- Structured feature choice metadata (D&D Beyond-style “pick one” / “pick N” features)

CREATE TABLE IF NOT EXISTS public.compendium_feature_choice_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_id UUID NOT NULL REFERENCES public.compendium_job_features(id) ON DELETE CASCADE,
  choice_key TEXT NOT NULL,
  choice_count INTEGER NOT NULL DEFAULT 1 CHECK (choice_count >= 1),
  prompt TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (feature_id, choice_key)
);

CREATE TABLE IF NOT EXISTS public.compendium_feature_choice_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.compendium_feature_choice_groups(id) ON DELETE CASCADE,
  option_key TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  grants JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (group_id, option_key)
);

CREATE TABLE IF NOT EXISTS public.character_feature_choices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  feature_id UUID NOT NULL REFERENCES public.compendium_job_features(id) ON DELETE CASCADE,
  group_id UUID NOT NULL REFERENCES public.compendium_feature_choice_groups(id) ON DELETE CASCADE,
  option_id UUID NOT NULL REFERENCES public.compendium_feature_choice_options(id) ON DELETE CASCADE,
  level_chosen INTEGER NOT NULL DEFAULT 1 CHECK (level_chosen >= 1 AND level_chosen <= 20),
  chosen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (character_id, group_id)
);

CREATE INDEX IF NOT EXISTS compendium_feature_choice_groups_feature_idx
  ON public.compendium_feature_choice_groups(feature_id);

CREATE INDEX IF NOT EXISTS compendium_feature_choice_options_group_idx
  ON public.compendium_feature_choice_options(group_id);

CREATE INDEX IF NOT EXISTS character_feature_choices_character_idx
  ON public.character_feature_choices(character_id, level_chosen);

ALTER TABLE public.compendium_feature_choice_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compendium_feature_choice_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_feature_choices ENABLE ROW LEVEL SECURITY;

-- Compendium choice metadata: readable by everyone (consistent with other compendium tables being public read).
CREATE POLICY compendium_feature_choice_groups_select ON public.compendium_feature_choice_groups
  FOR SELECT USING (true);

CREATE POLICY compendium_feature_choice_options_select ON public.compendium_feature_choice_options
  FOR SELECT USING (true);

-- Character selections: same access model as other character_* tables.
CREATE POLICY character_feature_choices_select ON public.character_feature_choices
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.characters
      WHERE characters.id = character_feature_choices.character_id
        AND characters.user_id = auth.uid()
    )
  );

CREATE POLICY character_feature_choices_insert ON public.character_feature_choices
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.characters
      WHERE characters.id = character_feature_choices.character_id
        AND characters.user_id = auth.uid()
    )
  );

CREATE POLICY character_feature_choices_update ON public.character_feature_choices
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.characters
      WHERE characters.id = character_feature_choices.character_id
        AND characters.user_id = auth.uid()
    )
  );

CREATE POLICY character_feature_choices_delete ON public.character_feature_choices
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.characters
      WHERE characters.id = character_feature_choices.character_id
        AND characters.user_id = auth.uid()
    )
  );
