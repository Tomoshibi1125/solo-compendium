-- Backfill profile roles from auth user metadata.

UPDATE public.profiles AS p
SET role = COALESCE(u.raw_user_meta_data->>'role', p.role)
FROM auth.users AS u
WHERE u.id = p.id
  AND u.raw_user_meta_data ? 'role'
  AND p.role IS DISTINCT FROM u.raw_user_meta_data->>'role';
