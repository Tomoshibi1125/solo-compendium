-- PL/pgSQL resolves tables, columns, and functions only when a statement runs,
-- so a migration that drops or renames something can leave function bodies
-- that fail later at run time. plpgsql_check validates every body against the
-- current schema; trigger functions are checked once per table they fire on.
-- The extension is created inside this rolled-back transaction only.
BEGIN;
SET LOCAL search_path = extensions, public, pg_catalog;
CREATE EXTENSION IF NOT EXISTS plpgsql_check;

CREATE TEMP TABLE function_body_findings ON COMMIT DROP AS
WITH targets AS (
  SELECT p.oid AS fn, 0::oid AS rel
  FROM pg_proc AS p
  JOIN pg_namespace AS n ON n.oid = p.pronamespace
  JOIN pg_language AS l ON l.oid = p.prolang
  WHERE l.lanname = 'plpgsql'
    AND n.nspname IN ('public', 'app_private')
    AND p.prorettype <> 'trigger'::regtype
  UNION
  SELECT t.tgfoid, t.tgrelid
  FROM pg_trigger AS t
  JOIN pg_proc AS p ON p.oid = t.tgfoid
  JOIN pg_namespace AS n ON n.oid = p.pronamespace
  JOIN pg_language AS l ON l.oid = p.prolang
  WHERE NOT t.tgisinternal
    AND l.lanname = 'plpgsql'
    AND n.nspname IN ('public', 'app_private')
)
SELECT
  finding.level,
  targets.fn::regprocedure::text
    || CASE WHEN targets.rel <> 0 THEN ' on ' || targets.rel::regclass::text ELSE '' END
    || ' line ' || COALESCE(finding.lineno::text, '?') || ': ' || finding.message AS detail
FROM targets
CROSS JOIN LATERAL plpgsql_check_function_tb(
  targets.fn,
  targets.rel,
  fatal_errors => false,
  extra_warnings => true
) AS finding
WHERE finding.level IN ('error', 'warning', 'warning extra');

SELECT plan(2);

SELECT is_empty(
  $$SELECT detail FROM function_body_findings WHERE level = 'error' ORDER BY detail$$,
  'every PL/pgSQL body in public and app_private resolves against the current schema'
);

SELECT is_empty(
  $$SELECT detail FROM function_body_findings WHERE level <> 'error' ORDER BY detail$$,
  'no PL/pgSQL body keeps unused, shadowed, or never-read variables'
);

SELECT * FROM finish();
ROLLBACK;
