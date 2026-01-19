-- Final cache refresh for Security Advisor
-- This migration updates all 12 functions to force Security Advisor to re-evaluate

-- Update all functions with a timestamp comment to invalidate cache
COMMENT ON FUNCTION public.on_long_rest_assign_quests(p_character_id UUID) IS 'Security Advisor validated - cache refresh';
COMMENT ON FUNCTION public.get_asset_paths(p_type TEXT) IS 'Security Advisor validated - cache refresh';
COMMENT ON FUNCTION public.asset_exists(p_path TEXT) IS 'Security Advisor validated - cache refresh';
COMMENT ON FUNCTION public.search_compendium_jobs(TEXT, INTEGER, INTEGER) IS 'Security Advisor validated - cache refresh';
COMMENT ON FUNCTION public.get_entity_assets(UUID, TEXT) IS 'Security Advisor validated - cache refresh';
COMMENT ON FUNCTION public.calculate_shadow_energy_max(p_character_id UUID) IS 'Security Advisor validated - cache refresh';
COMMENT ON FUNCTION public.get_character_by_share_token(p_token TEXT) IS 'Security Advisor validated - cache refresh';
COMMENT ON FUNCTION public.search_compendium_relics(TEXT, INTEGER, INTEGER) IS 'Security Advisor validated - cache refresh';
COMMENT ON FUNCTION public.search_compendium_powers(TEXT, INTEGER, INTEGER) IS 'Security Advisor validated - cache refresh';
COMMENT ON FUNCTION public.search_compendium_monsters(TEXT, INTEGER, INTEGER) IS 'Security Advisor validated - cache refresh';
COMMENT ON FUNCTION public.search_compendium_paths(TEXT, INTEGER, INTEGER) IS 'Security Advisor validated - cache refresh';
COMMENT ON FUNCTION public.search_compendium_monarchs(TEXT, INTEGER, INTEGER) IS 'Security Advisor validated - cache refresh';
-- Final verification
DO $$
DECLARE
  properly_configured INTEGER := 0;
BEGIN
  SELECT COUNT(*) INTO properly_configured
  FROM pg_proc 
  WHERE proname IN (
    'on_long_rest_assign_quests', 'get_asset_paths', 'asset_exists',
    'search_compendium_jobs', 'get_entity_assets', 'calculate_shadow_energy_max',
    'get_character_by_share_token', 'search_compendium_relics', 'search_compendium_powers',
    'search_compendium_monsters', 'search_compendium_paths', 'search_compendium_monarchs'
  )
  AND array_to_string(proconfig, ', ') LIKE '%search_path=pg_catalog, public, extensions%';
  
  IF properly_configured = 12 THEN
    RAISE NOTICE '';
    RAISE NOTICE '🎉 FINAL VERIFICATION SUCCESSFUL';
    RAISE NOTICE '✅ All 12 functions have proper search_path configuration';
    RAISE NOTICE '🔒 Security: Function Search Path Mutable warnings RESOLVED';
    RAISE NOTICE '⏰ Dashboard refresh: May take up to 10 minutes for Security Advisor to update';
    RAISE NOTICE '';
  ELSE
    RAISE EXCEPTION '❌ Configuration issue: Only % of 12 functions properly configured', properly_configured;
  END IF;
END $$;
