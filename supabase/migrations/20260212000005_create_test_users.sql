-- Create test user accounts in Supabase
-- This script creates the DM and Player test accounts as real users

-- Insert DM user
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  phone,
  phone_confirmed_at,
  created_at,
  updated_at,
  last_sign_in_at,
  app_metadata,
  user_metadata,
  is_sso_user,
  banned_until,
  confirmation_token,
  recovery_token,
  email_change,
  email_change_token_new,
  email_change_token_current,
  invited_at,
  reauthentication_token,
  reauthentication_sent_at,
  providers,
  name
) VALUES (
  gen_random_uuid(),
  'dm@test.com',
  crypt('testpassword123', gen_salt('bf')),
  NOW(),
  NULL,
  NULL,
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"role": "dm", "display_name": "Test DM"}',
  false,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '{"email": "dm@test.com"}',
  'Test DM'
);

-- Insert Player user
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  phone,
  phone_confirmed_at,
  created_at,
  updated_at,
  last_sign_in_at,
  app_metadata,
  user_metadata,
  is_sso_user,
  banned_until,
  confirmation_token,
  recovery_token,
  email_change,
  email_change_token_new,
  email_change_token_current,
  invited_at,
  reauthentication_token,
  reauthentication_sent_at,
  providers,
  name
) VALUES (
  gen_random_uuid(),
  'player@test.com',
  crypt('testpassword123', gen_salt('bf')),
  NOW(),
  NULL,
  NULL,
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"role": "player", "display_name": "Test Player"}',
  false,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '{"email": "player@test.com"}',
  'Test Player'
);

-- Create corresponding user profiles
INSERT INTO public.user_profiles (
  id,
  user_id,
  email,
  display_name,
  role,
  avatar_url,
  created_at,
  updated_at
)
SELECT 
  gen_random_uuid(),
  auth.users.id,
  auth.users.email,
  auth.users.user_metadata->>'display_name',
  auth.users.user_metadata->>'role',
  NULL,
  NOW(),
  NOW()
FROM auth.users 
WHERE auth.users.email IN ('dm@test.com', 'player@test.com');
