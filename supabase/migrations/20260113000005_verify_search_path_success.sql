-- Verify that all functions now have proper search_path configuration
DO $$
DECLARE
  function_count INTEGER := 0;
  missing_functions TEXT := '';
BEGIN
  -- Count functions with proper search_path
  SELECT COUNT(*) INTO function_count
  FROM pg_proc 
  WHERE proname IN (
    'on_long_rest_assign_quests', 'get_asset_paths', 'asset_exists',
    'search_compendium_jobs', 'get_entity_assets', 'calculate_shadow_energy_max',
    'get_character_by_share_token', 'search_compendium_relics', 'search_compendium_powers',
    'search_compendium_monsters', 'search_compendium_paths', 'search_compendium_monarchs'
  )
  AND proconfig = array['search_path=pg_catalog, public, extensions'];
  
  -- Check for any missing functions
  SELECT string_agg(proname, ', ') INTO missing_functions
  FROM pg_proc 
  WHERE proname IN (
    'on_long_rest_assign_quests', 'get_asset_paths', 'asset_exists',
    'search_compendium_jobs', 'get_entity_assets', 'calculate_shadow_energy_max',
    'get_character_by_share_token', 'search_compendium_relics', 'search_compendium_powers',
    'search_compendium_monsters', 'search_compendium_paths', 'search_compendium_monarchs'
  )
  AND proconfig IS NULL;
  
  RAISE NOTICE 'Functions with proper search_path: %', function_count;
  
  IF missing_functions IS NOT NULL THEN
    RAISE NOTICE 'Functions missing search_path: %', missing_functions;
  ELSE
    RAISE NOTICE '✅ All critical functions have proper search_path configuration!';
    RAISE NOTICE '✅ Security Advisor warnings should now be resolved!';
  END IF;
END $$;
