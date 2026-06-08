-- Backfill missing public.profiles rows for existing auth.users.
--
-- Root cause (character-creation "Initialization Failed" / FK 23503):
--   public.characters.user_id -> public.profiles(id) (see
--   20260222000001_fix_profiles_table_consistency.sql). The
--   handle_new_user() trigger only creates a profiles row when a NEW
--   auth.users row is inserted, so accounts created before that trigger
--   existed (or whose trigger insert failed) have no profiles row. Any
--   insert into characters (or campaigns.warden_id, etc.) for such an
--   account fails with foreign_key_violation (23503).
--
-- This migration is idempotent: it only inserts profiles for auth.users
-- that currently lack one, and ON CONFLICT DO NOTHING guards re-runs.
-- It runs after 20260427000000 (canonical ascendant/warden/admin roles),
-- so the normalized role values below satisfy the live CHECK constraint.

BEGIN;

WITH missing_profiles AS (
  SELECT
    u.id,
    u.email,
    COALESCE(
      u.raw_user_meta_data->>'display_name',
      u.raw_user_meta_data->>'username',
      u.email
    ) AS display_name,
    lower(COALESCE(u.raw_user_meta_data->>'role', 'ascendant')) AS raw_role
  FROM auth.users u
  LEFT JOIN public.profiles p ON p.id = u.id
  WHERE p.id IS NULL
    AND u.email IS NOT NULL
)
INSERT INTO public.profiles (id, email, display_name, role)
SELECT
  id,
  email,
  display_name,
  CASE
    WHEN raw_role = 'dm' THEN 'warden'
    WHEN raw_role = 'player' THEN 'ascendant'
    WHEN raw_role IN ('ascendant', 'warden', 'admin') THEN raw_role
    ELSE 'ascendant'
  END
FROM missing_profiles
ON CONFLICT (id) DO NOTHING;

COMMIT;

-- Refresh PostgREST schema cache (consistent with sibling migrations).
NOTIFY pgrst, 'reload schema';
