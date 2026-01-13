-- Final verification of search_path configuration
DO $$
DECLARE
  function_count INTEGER := 0;
  missing_functions TEXT := '';
  function_details RECORD;
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
  AND array_to_string(proconfig, ', ') LIKE '%search_path=pg_catalog, public, extensions%';
  
  -- Get details of functions with search_path
  RAISE NOTICE '=== SEARCH_PATH VERIFICATION RESULTS ===';
  RAISE NOTICE 'Total functions checked: 12';
  RAISE NOTICE 'Functions with proper search_path: %', function_count;
  
  -- Check each specific function
  FOR function_details IN 
    SELECT proname, array_to_string(proconfig, ', ') as config
    FROM pg_proc 
    WHERE proname IN (
      'on_long_rest_assign_quests', 'get_asset_paths', 'asset_exists',
      'search_compendium_jobs', 'get_entity_assets', 'calculate_shadow_energy_max',
      'get_character_by_share_token', 'search_compendium_relics', 'search_compendium_powers',
      'search_compendium_monsters', 'search_compendium_paths', 'search_compendium_monarchs'
    )
    ORDER BY proname
  LOOP
    IF function_details.config LIKE '%search_path=pg_catalog, public, extensions%' THEN
      RAISE NOTICE '✅ %: CONFIGURED', function_details.proname;
    ELSE
      RAISE NOTICE '❌ %: MISSING - Config: %', function_details.proname, function_details.config;
    END IF;
  END LOOP;
  
  -- Final summary
  IF function_count = 12 THEN
    RAISE NOTICE '';
    RAISE NOTICE '🎉 SUCCESS: All 12 functions have proper search_path configuration!';
    RAISE NOTICE '🔒 Security: Function Search Path Mutable warnings should be RESOLVED!';
    RAISE NOTICE '🚀 Ready: Supabase Security Advisor should show clean results!';
  ELSE
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  INCOMPLETE: Only % of 12 functions are properly configured', function_count;
    RAISE NOTICE '🔧 Action: Some functions still need search_path configuration';
  END IF;
  
  RAISE NOTICE '';
  RAISE NOTICE '=== END VERIFICATION ===';
END $$;
