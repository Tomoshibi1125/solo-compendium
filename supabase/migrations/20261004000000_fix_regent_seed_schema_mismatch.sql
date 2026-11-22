-- Emergency fix for regent seed data schema mismatch
-- The seed migration (20260926100100) was regenerated to insert into public schema,
-- but it runs BEFORE the table move migration (20261003010000).
-- This caused the seed data to fail or go to the wrong place.

BEGIN;

-- Ensure app_private tables still exist (they should, but defensive check)
-- If move migration dropped them, this will fail gracefully and we'll work with public
DO $$
BEGIN
  -- Check if we need to populate public tables from app_private
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'app_private' 
    AND table_name = 'regent_catch_up_requirements'
  ) AND EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'regent_catch_up_requirements'
  ) THEN
    -- Copy from app_private to public if public is empty or incomplete
    DECLARE
      v_public_count INTEGER;
      v_private_count INTEGER;
    BEGIN
      SELECT COUNT(*) INTO v_public_count FROM public.regent_catch_up_requirements;
      SELECT COUNT(*) INTO v_private_count FROM app_private.regent_catch_up_requirements;
      
      IF v_public_count < 240 AND v_private_count >= 240 THEN
        -- We have good data in app_private, copy it
        RAISE NOTICE 'Copying % rows from app_private to public (current public: %)', v_private_count, v_public_count;
        
        INSERT INTO public.regent_canonical_pick_options (kind, canonical_id, name, tier)
        SELECT kind, canonical_id, name, tier
        FROM app_private.regent_canonical_pick_options
        ON CONFLICT (kind, canonical_id) DO UPDATE SET
          name = EXCLUDED.name,
          tier = EXCLUDED.tier;

        INSERT INTO public.regent_catch_up_requirements (regent_id, regent_name, character_level, powers, techniques, cantrips, spells, max_spell_tier)
        SELECT regent_id, regent_name, character_level, powers, techniques, cantrips, spells, max_spell_tier
        FROM app_private.regent_catch_up_requirements
        ON CONFLICT (regent_id, character_level) DO UPDATE SET
          regent_name = EXCLUDED.regent_name,
          powers = EXCLUDED.powers,
          techniques = EXCLUDED.techniques,
          cantrips = EXCLUDED.cantrips,
          spells = EXCLUDED.spells,
          max_spell_tier = EXCLUDED.max_spell_tier;
      END IF;
    END;
  END IF;
  
  -- If both tables are empty or app_private doesn't exist, we need to populate from scratch
  -- This handles the case where migrations ran in the wrong order
  DECLARE
    v_count INTEGER;
  BEGIN
    SELECT COUNT(*) INTO v_count FROM public.regent_catch_up_requirements;
    
    IF v_count < 240 THEN
      RAISE WARNING 'Public schema only has % rows, expected 240. Manual data load may be required.', v_count;
      -- Note: The full seed data should be in migration 20260926100100
      -- If that migration failed, it needs to be manually applied
    ELSE
      RAISE NOTICE 'Public schema properly populated with % rows', v_count;
    END IF;
  END;
END $$;

COMMIT;

NOTIFY pgrst, 'reload schema';
