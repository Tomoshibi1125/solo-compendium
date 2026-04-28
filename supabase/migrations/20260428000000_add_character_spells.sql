CREATE TABLE IF NOT EXISTS public.character_spells (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  spell_id TEXT,
  name TEXT NOT NULL,
  spell_level INTEGER NOT NULL DEFAULT 0,
  source TEXT NOT NULL DEFAULT 'Manual Spell',
  description TEXT,
  higher_levels TEXT,
  casting_time TEXT,
  range TEXT,
  duration TEXT,
  concentration BOOLEAN NOT NULL DEFAULT false,
  ritual BOOLEAN NOT NULL DEFAULT false,
  is_prepared BOOLEAN NOT NULL DEFAULT false,
  is_known BOOLEAN NOT NULL DEFAULT true,
  counts_against_limit BOOLEAN NOT NULL DEFAULT true,
  uses_max INTEGER,
  uses_current INTEGER,
  recharge TEXT,
  display_order INTEGER,
  learned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_character_spells_character_name_source
ON public.character_spells (character_id, lower(name), source);

CREATE INDEX IF NOT EXISTS idx_character_spells_character_id
ON public.character_spells (character_id);

CREATE INDEX IF NOT EXISTS idx_character_spells_spell_id
ON public.character_spells (spell_id);

ALTER TABLE public.character_spells ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can create spells for their own characters" ON public.character_spells;
CREATE POLICY "Users can create spells for their own characters" ON public.character_spells
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
  );

DROP POLICY IF EXISTS "Users can delete spells of their own characters" ON public.character_spells;
CREATE POLICY "Users can delete spells of their own characters" ON public.character_spells
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
  );

DROP POLICY IF EXISTS "Users can update spells of their own characters" ON public.character_spells;
CREATE POLICY "Users can update spells of their own characters" ON public.character_spells
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
  );

DROP POLICY IF EXISTS "Users can view spells of their own characters" ON public.character_spells;
CREATE POLICY "Users can view spells of their own characters" ON public.character_spells
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
  );
