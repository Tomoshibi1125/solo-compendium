-- Create test accounts for DM and Player
-- These will be used for E2E testing

-- DM Account
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data
) VALUES (
  gen_random_uuid(),
  'dm@test.com',
  crypt('testpassword123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"display_name": "Test DM", "role": "dm"}'
);

-- Player Account
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data
) VALUES (
  gen_random_uuid(),
  'player@test.com',
  crypt('testpassword123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"display_name": "Test Player", "role": "player"}'
);

-- Create user_profiles for the test accounts
-- DM Profile
INSERT INTO public.user_profiles (id, email, display_name, role)
SELECT 
  id,
  email,
  'Test DM',
  'dm'
FROM auth.users 
WHERE email = 'dm@test.com';

-- Player Profile  
INSERT INTO public.user_profiles (id, email, display_name, role)
SELECT 
  id,
  email,
  'Test Player',
  'player'
FROM auth.users 
WHERE email = 'player@test.com';
