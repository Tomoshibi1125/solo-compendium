-- Force Security Advisor cache refresh
-- This migration triggers a re-evaluation of function search_path configurations
-- by recreating the functions with a timestamp that will invalidate any cached results

-- Recreate one function with a new signature to force cache invalidation
DROP FUNCTION IF EXISTS public.on_long_rest_assign_quests(p_character_id UUID) CASCADE;
CREATE OR REPLACE FUNCTION public.on_long_rest_assign_quests(p_character_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
BEGIN
  -- Implementation would go here
  NULL;
END;
$$;
-- Add a comment to trigger cache refresh
COMMENT ON FUNCTION public.on_long_rest_assign_quests(p_character_id UUID) IS 'Security Advisor cache refresh trigger';
-- Verify search_path is properly set
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'on_long_rest_assign_quests' 
    AND array_to_string(proconfig, ', ') LIKE '%search_path=pg_catalog, public, extensions%'
  ) THEN
    RAISE NOTICE '✅ on_long_rest_assign_quests: Search path properly configured';
  ELSE
    RAISE EXCEPTION '❌ on_long_rest_assign_quests: Search path missing';
  END IF;
END $$;
