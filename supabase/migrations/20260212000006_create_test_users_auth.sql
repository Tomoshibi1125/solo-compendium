-- Create test user accounts using Supabase auth functions
-- This script creates the DM and Player test accounts as real users

-- Create DM user account
SELECT auth.signup(
  email := 'dm@test.com',
  password := 'testpassword123',
  data := '{"role": "dm", "display_name": "Test DM"}'
);

-- Create Player user account  
SELECT auth.signup(
  email := 'player@test.com',
  password := 'testpassword123',
  data := '{"role": "player", "display_name": "Test Player"}'
);

-- The above will create users in auth.users table
-- We need to manually create the user_profiles since the trigger might not fire properly

-- Get the user IDs and create profiles
DO $$
DECLARE
  dm_user_id UUID;
  player_user_id UUID;
BEGIN
  -- Get DM user ID
  SELECT id INTO dm_user_id FROM auth.users WHERE email = 'dm@test.com';
  
  -- Get Player user ID  
  SELECT id INTO player_user_id FROM auth.users WHERE email = 'player@test.com';
  
  -- Create DM profile
  INSERT INTO public.user_profiles (
    id,
    user_id,
    email,
    display_name,
    role,
    avatar_url,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    dm_user_id,
    'dm@test.com',
    'Test DM',
    'dm',
    NULL,
    NOW(),
    NOW()
  );
  
  -- Create Player profile
  INSERT INTO public.user_profiles (
    id,
    user_id,
    email,
    display_name,
    role,
    avatar_url,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    player_user_id,
    'player@test.com',
    'Test Player',
    'player',
    NULL,
    NOW(),
    NOW()
  );
END $$;
