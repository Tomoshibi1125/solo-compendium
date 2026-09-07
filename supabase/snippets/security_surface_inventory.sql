-- Read-only inventory for the Supabase API security boundary.
-- Run against staging before applying the hardening migration and again after it.
-- Do not commit query output: function definitions and ACLs may disclose internal details.

-- Functions, exact signatures, ownership, configuration, extension membership, and
-- effective API-role execution. Identity arguments are used so overloads cannot hide.
SELECT
  n.nspname AS schema_name,
  p.proname AS function_name,
  pg_get_function_identity_arguments(p.oid) AS identity_arguments,
  pg_get_function_result(p.oid) AS result_type,
  l.lanname AS language_name,
  owner_role.rolname AS owner_name,
  p.prosecdef AS security_definer,
  p.proconfig AS function_configuration,
  p.proacl AS access_control_list,
  extension_name.extname AS extension_name,
  has_function_privilege('anon', p.oid, 'EXECUTE') AS anon_can_execute,
  has_function_privilege('authenticated', p.oid, 'EXECUTE') AS authenticated_can_execute,
  has_function_privilege('service_role', p.oid, 'EXECUTE') AS service_role_can_execute,
  pg_get_functiondef(p.oid) AS function_definition
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
JOIN pg_language l ON l.oid = p.prolang
JOIN pg_roles owner_role ON owner_role.oid = p.proowner
LEFT JOIN pg_depend extension_dependency
  ON extension_dependency.classid = 'pg_proc'::regclass
 AND extension_dependency.objid = p.oid
 AND extension_dependency.deptype = 'e'
LEFT JOIN pg_extension extension_name
  ON extension_name.oid = extension_dependency.refobjid
WHERE n.nspname NOT IN ('pg_catalog', 'information_schema')
  AND p.prokind = 'f'
ORDER BY n.nspname, p.proname, pg_get_function_identity_arguments(p.oid);

-- Event-trigger functions, including database-only helpers such as rls_auto_enable.
SELECT
  event_trigger.evtname AS event_trigger_name,
  event_trigger.evtevent AS event_name,
  event_trigger.evtenabled AS enabled_mode,
  function_namespace.nspname AS function_schema,
  function_row.proname AS function_name,
  pg_get_function_identity_arguments(function_row.oid) AS identity_arguments,
  owner_role.rolname AS owner_name,
  function_row.prosecdef AS security_definer,
  function_row.proconfig AS function_configuration
FROM pg_event_trigger event_trigger
JOIN pg_proc function_row ON function_row.oid = event_trigger.evtfoid
JOIN pg_namespace function_namespace ON function_namespace.oid = function_row.pronamespace
JOIN pg_roles owner_role ON owner_role.oid = function_row.proowner
ORDER BY event_trigger.evtname;

-- Table triggers and their function dependencies.
SELECT
  table_namespace.nspname AS table_schema,
  table_row.relname AS table_name,
  trigger_row.tgname AS trigger_name,
  function_namespace.nspname AS function_schema,
  function_row.proname AS function_name,
  pg_get_function_identity_arguments(function_row.oid) AS identity_arguments,
  trigger_row.tgenabled AS enabled_mode
FROM pg_trigger trigger_row
JOIN pg_class table_row ON table_row.oid = trigger_row.tgrelid
JOIN pg_namespace table_namespace ON table_namespace.oid = table_row.relnamespace
JOIN pg_proc function_row ON function_row.oid = trigger_row.tgfoid
JOIN pg_namespace function_namespace ON function_namespace.oid = function_row.pronamespace
WHERE NOT trigger_row.tgisinternal
ORDER BY table_namespace.nspname, table_row.relname, trigger_row.tgname;

-- RLS policies and their expressions. Review every function referenced by these
-- expressions before revoking authenticated helper execution or moving a helper.
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
ORDER BY schemaname, tablename, policyname;

-- Storage access model and all policies touching storage.objects.
SELECT
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets
ORDER BY id;

SELECT
  policyname,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
ORDER BY policyname;

-- Default function ACLs are owner-specific. Every role that creates public
-- functions needs an explicit opt-in default rather than PostgreSQL's PUBLIC default.
SELECT
  owner_role.rolname AS owner_name,
  namespace_row.nspname AS schema_name,
  default_acl.defaclobjtype AS object_type,
  default_acl.defaclacl AS access_control_list
FROM pg_default_acl default_acl
JOIN pg_roles owner_role ON owner_role.oid = default_acl.defaclrole
LEFT JOIN pg_namespace namespace_row ON namespace_row.oid = default_acl.defaclnamespace
WHERE default_acl.defaclobjtype = 'f'
ORDER BY owner_role.rolname, namespace_row.nspname;
