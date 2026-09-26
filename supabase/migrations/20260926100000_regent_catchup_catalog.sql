-- A Regent's owed counts are canonical, but its option identities require Warden
-- approval. These tables keep those two authorities separate and durable.
BEGIN;

CREATE TABLE app_private.regent_canonical_pick_options (
  kind TEXT NOT NULL CHECK (kind IN ('powers', 'techniques', 'cantrips', 'spells')),
  canonical_id TEXT NOT NULL,
  name TEXT NOT NULL,
  tier INTEGER NOT NULL CHECK (tier BETWEEN 0 AND 9),
  PRIMARY KEY (kind, canonical_id),
  CHECK ((kind = 'cantrips') = (tier = 0))
);

CREATE TABLE app_private.regent_catch_up_requirements (
  regent_id TEXT NOT NULL,
  regent_name TEXT NOT NULL,
  character_level INTEGER NOT NULL CHECK (character_level BETWEEN 1 AND 20),
  powers INTEGER NOT NULL CHECK (powers >= 0),
  techniques INTEGER NOT NULL CHECK (techniques >= 0),
  cantrips INTEGER NOT NULL CHECK (cantrips >= 0),
  spells INTEGER NOT NULL CHECK (spells >= 0),
  max_spell_tier INTEGER NOT NULL CHECK (max_spell_tier BETWEEN 0 AND 9),
  PRIMARY KEY (regent_id, character_level)
);

CREATE TABLE public.regent_catch_up_options (
  unlock_id UUID NOT NULL REFERENCES public.character_regent_unlocks(id) ON DELETE CASCADE,
  kind TEXT NOT NULL,
  canonical_id TEXT NOT NULL,
  approved_by UUID NOT NULL REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (unlock_id, kind, canonical_id),
  FOREIGN KEY (kind, canonical_id)
    REFERENCES app_private.regent_canonical_pick_options(kind, canonical_id)
);

CREATE INDEX regent_catch_up_options_unlock_idx
  ON public.regent_catch_up_options(unlock_id);

ALTER TABLE public.regent_catch_up_options ENABLE ROW LEVEL SECURITY;
CREATE POLICY regent_catch_up_options_select ON public.regent_catch_up_options
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.character_regent_unlocks AS unlock_row
      JOIN public.characters AS character_row ON character_row.id = unlock_row.character_id
      WHERE unlock_row.id = regent_catch_up_options.unlock_id
        AND (
          character_row.user_id = (SELECT auth.uid())
          OR EXISTS (
            SELECT 1 FROM public.campaign_character_shares AS share_row
            WHERE share_row.character_id = unlock_row.character_id
              AND public.is_campaign_system(share_row.campaign_id, (SELECT auth.uid()))
          )
        )
    )
  );

REVOKE ALL ON app_private.regent_canonical_pick_options,
  app_private.regent_catch_up_requirements FROM PUBLIC, anon, authenticated;
REVOKE ALL ON public.regent_catch_up_options FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.regent_catch_up_options TO authenticated;

COMMIT;
