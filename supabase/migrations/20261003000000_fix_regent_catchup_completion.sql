-- Fix: Remove regent_catch_up_options validation from complete_regent_catch_up
-- The frontend persists abilities directly to character tables with correct source,
-- but never populates regent_catch_up_options. The count validation is sufficient.

BEGIN;

CREATE OR REPLACE FUNCTION public.complete_regent_catch_up(p_unlock_id UUID)
RETURNS INTEGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_character_id UUID;
  v_owner UUID;
  v_level INTEGER;
  v_unlock public.character_regent_unlocks%ROWTYPE;
  v_req public.regent_catch_up_requirements%ROWTYPE;
  v_source TEXT;
BEGIN
  IF v_actor IS NULL THEN RAISE EXCEPTION 'AUTH_REQUIRED' USING ERRCODE = '42501'; END IF;
  
  SELECT u.character_id INTO v_character_id FROM public.character_regent_unlocks AS u WHERE u.id = p_unlock_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'REGENT_UNLOCK_NOT_FOUND' USING ERRCODE = 'P0002'; END IF;
  
  SELECT c.user_id, c.level INTO v_owner, v_level FROM public.characters AS c
  WHERE c.id = v_character_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'REGENT_CHARACTER_NOT_FOUND' USING ERRCODE = 'P0002'; END IF;
  IF v_owner IS DISTINCT FROM v_actor THEN RAISE EXCEPTION 'CHARACTER_OWNERSHIP_REQUIRED' USING ERRCODE = '42501'; END IF;
  
  SELECT u.* INTO v_unlock FROM public.character_regent_unlocks AS u
  WHERE u.id = p_unlock_id AND u.character_id = v_character_id FOR UPDATE;
  IF v_unlock.regent_id IS NULL THEN RAISE EXCEPTION 'LEGACY_REGENT_UNLOCK_NOT_ACTIONABLE' USING ERRCODE = '22023'; END IF;
  IF v_level NOT BETWEEN 1 AND 20 THEN RAISE EXCEPTION 'INVALID_CHARACTER_LEVEL' USING ERRCODE = '22023'; END IF;
  IF v_unlock.caught_up_at_level IS NOT NULL THEN RETURN v_unlock.caught_up_at_level; END IF;
  
  SELECT * INTO v_req FROM public.regent_catch_up_requirements
  WHERE regent_id = v_unlock.regent_id AND character_level = v_level;
  IF NOT FOUND THEN RAISE EXCEPTION 'REGENT_REQUIREMENTS_NOT_FOUND' USING ERRCODE = '22023'; END IF;
  v_source := v_req.regent_name || ' Attunement (Catch-Up)';

  -- Validate that the correct number of abilities have been persisted with the catch-up source
  -- REMOVED: regent_catch_up_options validation (not populated by frontend)
  IF (SELECT count(*) FROM public.character_powers AS p WHERE p.character_id = v_character_id AND p.source = v_source) <> v_req.powers
     OR (SELECT count(*) FROM public.character_techniques AS t WHERE t.character_id = v_character_id AND t.source = v_source) <> v_req.techniques
     OR (SELECT count(*) FROM public.character_spells AS s WHERE s.character_id = v_character_id AND s.source = v_source AND s.spell_level = 0) <> v_req.cantrips
     OR (SELECT count(*) FROM public.character_spells AS s WHERE s.character_id = v_character_id AND s.source = v_source AND s.spell_level > 0) <> v_req.spells
  THEN RAISE EXCEPTION 'REGENT_CATCH_UP_PICKS_INCOMPLETE' USING ERRCODE = '22023'; END IF;

  -- Mark the catch-up as complete
  UPDATE public.character_regent_unlocks SET caught_up_at_level = v_level WHERE id = p_unlock_id;
  RETURN v_level;
END;
$$;

COMMIT;
NOTIFY pgrst, 'reload schema';
