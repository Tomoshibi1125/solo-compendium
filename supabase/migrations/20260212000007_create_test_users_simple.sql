-- Simple test user creation script
-- This creates the test accounts using direct SQL

-- First, let's check if users already exist
DO $$
DECLARE
  dm_exists BOOLEAN;
  player_exists BOOLEAN;
BEGIN
  -- Check if DM user exists
  SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'dm@test.com') INTO dm_exists;
  
  -- Check if Player user exists
  SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'player@test.com') INTO player_exists;
  
  -- Create DM user if doesn't exist
  IF NOT dm_exists THEN
    INSERT INTO auth.users (
      id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      last_sign_in_at,
      app_metadata,
      user_metadata,
      providers,
      name
    ) VALUES (
      gen_random_uuid(),
      'dm@test.com',
      crypt('testpassword123', gen_salt('bf')),
      NOW(),
      NOW(),
      NOW(),
      NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"role": "dm", "display_name": "Test DM"}',
      '{"email": "dm@test.com"}',
      'Test DM'
    );
    
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
    WHERE auth.users.email = 'dm@test.com';
  END IF;
  
  -- Create Player user if doesn't exist
  IF NOT player_exists THEN
    INSERT INTO auth.users (
      id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      last_sign_in_at,
      app_metadata,
      user_metadata,
      providers,
      name
    ) VALUES (
      gen_random_uuid(),
      'player@test.com',
      crypt('testpassword123', gen_salt('bf')),
      NOW(),
      NOW(),
      NOW(),
      NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"role": "player", "display_name": "Test Player"}',
      '{"email": "player@test.com"}',
      'Test Player'
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
    WHERE auth.users.email = 'player@test.com';
  END IF;
END $$;

-- Verify users were created
SELECT 
  u.email,
  u.name,
  u.user_metadata->>'role' as role,
  u.user_metadata->>'display_name' as display_name,
  p.role as profile_role,
  p.display_name as profile_display_name
FROM auth.users u
LEFT JOIN public.user_profiles p ON u.id = p.user_id
WHERE u.email IN ('dm@test.com', 'player@test.com');
