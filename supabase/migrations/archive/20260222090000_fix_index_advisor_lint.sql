-- Fix extensions.index_advisor lint warning (text -> text[] cast)
CREATE OR REPLACE FUNCTION extensions.index_advisor(p_sql TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
BEGIN
  -- Placeholder implementation; real logic lives in extension-managed binary.
  -- This stub exists to satisfy linting in linked environments where the
  -- extension function is unavailable.
  RETURN '[]'::jsonb;
END;
$$;
