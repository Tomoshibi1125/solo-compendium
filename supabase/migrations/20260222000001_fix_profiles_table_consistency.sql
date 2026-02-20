-- Fix user profile table name inconsistency and authentication
-- This migration ensures the profiles table exists and works correctly

BEGIN;

-- Check if user_profiles table exists and profiles doesn't, then rename it
DO $$
BEGIN
  IF to_regclass('public.user_profiles') IS NOT NULL AND to_regclass('public.profiles') IS NULL THEN
    ALTER TABLE public.user_profiles RENAME TO profiles;
    RAISE NOTICE 'Renamed user_profiles to profiles';
  END IF;
END $$;

-- Ensure profiles table exists with correct structure
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  username TEXT,
  role TEXT NOT NULL DEFAULT 'player' CHECK (role IN ('player', 'dm', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies for profiles table
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "DMs can view all profiles" ON public.profiles;
CREATE POLICY "DMs can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('dm', 'admin')
    )
  );

-- Fix the handle_new_user function to work with profiles table
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, username, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'username', NEW.email),
    NEW.raw_user_meta_data->>'username',
    COALESCE(NEW.raw_user_meta_data->>'role', 'player')
  );
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- Profile already exists, just return
    RETURN NEW;
END;
$$;

-- Drop and recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Update foreign key references if needed
DO $$
BEGIN
  -- Check if characters table still references user_profiles
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
    WHERE tc.table_name = 'characters' 
      AND tc.constraint_type = 'FOREIGN KEY'
      AND kcu.column_name = 'user_id'
      AND tc.constraint_name LIKE '%user_profiles%'
  ) THEN
    ALTER TABLE public.characters DROP CONSTRAINT characters_user_id_fkey;
    ALTER TABLE public.characters ADD CONSTRAINT characters_user_id_fkey 
      FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;

  -- Check if campaigns table still references user_profiles
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
    WHERE tc.table_name = 'campaigns' 
      AND tc.constraint_type = 'FOREIGN KEY'
      AND kcu.column_name = 'dm_id'
      AND tc.constraint_name LIKE '%user_profiles%'
  ) THEN
    ALTER TABLE public.campaigns DROP CONSTRAINT campaigns_dm_id_fkey;
    ALTER TABLE public.campaigns ADD CONSTRAINT campaigns_dm_id_fkey 
      FOREIGN KEY (dm_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

COMMIT;
