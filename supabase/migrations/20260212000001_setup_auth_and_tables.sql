-- Create user profiles table with role-based access
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  role TEXT NOT NULL DEFAULT 'player' CHECK (role IN ('player', 'dm', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can view their own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- DMs can view all profiles
CREATE POLICY "DMs can view all profiles" ON public.user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role IN ('dm', 'admin')
    )
  );

-- Function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, display_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'player')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create characters table
CREATE TABLE IF NOT EXISTS public.characters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  race TEXT NOT NULL,
  class TEXT NOT NULL,
  level INTEGER DEFAULT 1 CHECK (level >= 1 AND level <= 20),
  abilities JSONB NOT NULL DEFAULT '{}',
  hp INTEGER NOT NULL,
  max_hp INTEGER NOT NULL,
  ac INTEGER NOT NULL,
  proficiency_bonus INTEGER NOT NULL DEFAULT 2,
  equipment JSONB DEFAULT '[]',
  spells JSONB DEFAULT '[]',
  features JSONB DEFAULT '[]',
  background TEXT,
  alignment TEXT,
  experience INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for characters
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;

-- Character policies
CREATE POLICY "Users can view own characters" ON public.characters
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage own characters" ON public.characters
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "DMs can view all characters" ON public.characters
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role IN ('dm', 'admin')
    )
  );

-- Create campaigns table
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dm_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  setting TEXT,
  is_active BOOLEAN DEFAULT true,
  player_characters JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for campaigns
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- Campaign policies
CREATE POLICY "DMs can manage own campaigns" ON public.campaigns
  FOR ALL USING (dm_id = auth.uid());

CREATE POLICY "Players can view campaigns they're in" ON public.campaigns
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM public.campaign_members
      WHERE campaign_id = campaigns.id
    )
  );

-- Create compendium tables
CREATE TABLE IF NOT EXISTS public.compendium_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  features JSONB DEFAULT '[]',
  prerequisites JSONB DEFAULT '[]',
  levels JSONB DEFAULT '[]',
  is_homebrew BOOLEAN DEFAULT false,
  created_by UUID REFERENCES public.user_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.compendium_paths (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  features JSONB DEFAULT '[]',
  prerequisites JSONB DEFAULT '[]',
  levels JSONB DEFAULT '[]',
  is_homebrew BOOLEAN DEFAULT false,
  created_by UUID REFERENCES public.user_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.compendium_relics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'uncommon', 'rare', 'very-rare', 'legendary')),
  properties JSONB DEFAULT '[]',
  cost INTEGER DEFAULT 0,
  is_homebrew BOOLEAN DEFAULT false,
  created_by UUID REFERENCES public.user_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for compendium tables
ALTER TABLE public.compendium_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compendium_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compendium_relics ENABLE ROW LEVEL SECURITY;

-- Compendium policies - everyone can read, only DMs can create/edit
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'compendium_jobs' AND policyname = 'Anyone can view jobs'
  ) THEN
    CREATE POLICY "Anyone can view jobs" ON public.compendium_jobs FOR SELECT USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'compendium_jobs' AND policyname = 'DMs can manage jobs'
  ) THEN
    CREATE POLICY "DMs can manage jobs" ON public.compendium_jobs
      FOR ALL USING (
        EXISTS (
          SELECT 1 FROM public.user_profiles 
          WHERE id = auth.uid() AND role IN ('dm', 'admin')
        )
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'compendium_paths' AND policyname = 'Anyone can view paths'
  ) THEN
    CREATE POLICY "Anyone can view paths" ON public.compendium_paths FOR SELECT USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'compendium_paths' AND policyname = 'DMs can manage paths'
  ) THEN
    CREATE POLICY "DMs can manage paths" ON public.compendium_paths
      FOR ALL USING (
        EXISTS (
          SELECT 1 FROM public.user_profiles 
          WHERE id = auth.uid() AND role IN ('dm', 'admin')
        )
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'compendium_relics' AND policyname = 'Anyone can view relics'
  ) THEN
    CREATE POLICY "Anyone can view relics" ON public.compendium_relics FOR SELECT USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'compendium_relics' AND policyname = 'DMs can manage relics'
  ) THEN
    CREATE POLICY "DMs can manage relics" ON public.compendium_relics
      FOR ALL USING (
        EXISTS (
          SELECT 1 FROM public.user_profiles 
          WHERE id = auth.uid() AND role IN ('dm', 'admin')
        )
      );
  END IF;
END $$;
