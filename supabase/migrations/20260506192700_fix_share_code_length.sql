-- ============================================================================
-- Fix generate_share_code() to produce 6-character codes
--
-- The function was inadvertently changed to generate 8-character codes in
-- migration 20260222073000_lint_cleanup_followup.sql, but the entire frontend
-- (regex validation, React Query enabled guard, client-side generator) expects
-- exactly 6 characters. This migration:
--   1. Redefines generate_share_code() to produce 6-character codes
--   2. Truncates any existing 8-character share_codes to 6 characters
--      (safe because the first 6 chars are already unique with high probability,
--       and a uniqueness check is included)
-- ============================================================================

-- 1. Redefine generate_share_code() to produce 6-character codes
CREATE OR REPLACE FUNCTION public.generate_share_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
  v_chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  v_code TEXT := '';
BEGIN
  FOR i IN 1..6 LOOP
    v_code := v_code || substr(v_chars, floor(random() * length(v_chars) + 1)::int, 1);
  END LOOP;
  RETURN v_code;
END;
$$;

-- 2. Fix any existing campaigns that received 8-character codes.
--    Truncate to 6 characters; if that causes a collision, regenerate.
DO $$
DECLARE
  r RECORD;
  v_new_code TEXT;
  v_attempts INT;
BEGIN
  FOR r IN
    SELECT id, share_code
    FROM public.campaigns
    WHERE length(share_code) > 6
  LOOP
    -- Try truncating first
    v_new_code := left(r.share_code, 6);

    IF EXISTS (
      SELECT 1 FROM public.campaigns
      WHERE share_code = v_new_code AND id <> r.id
    ) THEN
      -- Collision: generate a fresh 6-char code
      v_attempts := 0;
      LOOP
        v_new_code := public.generate_share_code();
        EXIT WHEN NOT EXISTS (
          SELECT 1 FROM public.campaigns WHERE share_code = v_new_code
        );
        v_attempts := v_attempts + 1;
        IF v_attempts >= 20 THEN
          RAISE EXCEPTION 'Cannot generate unique 6-char share code for campaign %', r.id;
        END IF;
      END LOOP;
    END IF;

    UPDATE public.campaigns
    SET share_code = v_new_code
    WHERE id = r.id;
  END LOOP;
END;
$$;

-- Refresh PostgREST schema cache
NOTIFY pgrst, 'reload schema';
