SELECT
  (
    SELECT jsonb_agg(jsonb_build_object(
      'sig', p.oid::regprocedure::text,
      'secdef', p.prosecdef,
      'search_path', (SELECT setting FROM unnest(COALESCE(p.proconfig, ARRAY[]::text[])) AS setting WHERE setting LIKE 'search_path=%'),
      'auth_exec', has_function_privilege('authenticated', p.oid, 'EXECUTE'),
      'anon_exec', has_function_privilege('anon', p.oid, 'EXECUTE'),
      'public_exec', EXISTS (
        SELECT 1 FROM aclexplode(COALESCE(p.proacl, acldefault('f', p.proowner))) a
        WHERE a.grantee = 0 AND a.privilege_type = 'EXECUTE')
    ) ORDER BY p.oid::regprocedure::text)
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE (n.nspname = 'public' AND p.proname IN ('get_campaign_roster','set_campaign_member_role','remove_campaign_member','detach_campaign_member_character'))
       OR (n.nspname = 'app_private' AND p.proname = 'can_read_campaign_character')
  ) AS functions,
  (
    SELECT jsonb_object_agg(cmd, names) FROM (
      SELECT cmd, jsonb_agg(policyname ORDER BY policyname) AS names
      FROM pg_policies
      WHERE schemaname = 'public' AND tablename = 'campaign_members'
      GROUP BY cmd
    ) t
  ) AS campaign_members_policies,
  (
    SELECT count(*)
    FROM pg_policies
    WHERE schemaname = 'public'
      AND cmd = 'SELECT'
      AND (policyname LIKE 'campaign_managers_read_character\_%' ESCAPE '\'
           OR policyname = 'campaign_managers_read_linked_characters')
  ) AS manager_read_policy_count;
