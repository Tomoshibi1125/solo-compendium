-- Configure Supabase to work with existing static compendium data
-- This migration sets up the database structure to support the app's existing data flow

-- Create functions to sync static data with Supabase (optional for future use)
CREATE OR REPLACE FUNCTION public.sync_compendium_data()
RETURNS void AS $$
BEGIN
  -- This function can be used to periodically sync static TS data to Supabase
  -- For now, we'll keep the existing static data flow and use Supabase for:
  -- - User management
  -- - Character storage
  -- - Campaign management
  -- - Homebrew content
  
  RAISE NOTICE 'Compendium data sync function created. Static data remains in TypeScript files.';
END;
$$ LANGUAGE plpgsql;

-- Create views for easier access to user-related data
CREATE OR REPLACE VIEW public.user_characters AS
SELECT 
  c.*,
  up.email as user_email,
  up.display_name as user_name,
  up.role as user_role
FROM public.characters c
JOIN public.user_profiles up ON c.user_id = up.id;

CREATE OR REPLACE VIEW public.campaign_details AS
SELECT 
  cam.*,
  up.email as dm_email,
  up.display_name as dm_name
FROM public.campaigns cam
JOIN public.user_profiles up ON cam.dm_id = up.id;

-- Create helper functions for character calculations
CREATE OR REPLACE FUNCTION public.calculate_character_hp(
  level INTEGER,
  constitution_score INTEGER,
  hit_dice TEXT DEFAULT 'd8'
)
RETURNS INTEGER AS $$
DECLARE
  con_mod INTEGER;
  base_hp INTEGER;
BEGIN
  con_mod := FLOOR((constitution_score - 10) / 2);
  base_hp := CASE 
    WHEN hit_dice = 'd6' THEN 6
    WHEN hit_dice = 'd8' THEN 8
    WHEN hit_dice = 'd10' THEN 10
    WHEN hit_dice = 'd12' THEN 12
    ELSE 8
  END;
  
  RETURN base_hp + con_mod + ((level - 1) * (FLOOR((base_hp + 1) / 2) + con_mod));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION public.calculate_proficiency_bonus(level INTEGER)
RETURNS INTEGER AS $$
BEGIN
  RETURN GREATEST(2, FLOOR((level - 1) / 4) + 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_characters_user_id ON public.characters(user_id);
CREATE INDEX IF NOT EXISTS idx_characters_name ON public.characters(name);
CREATE INDEX IF NOT EXISTS idx_campaigns_dm_id ON public.campaigns(dm_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);

-- Create storage buckets for user-generated content
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('character-avatars', 'character-avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('homebrew-content', 'homebrew-content', false, 10485760, ARRAY['application/json', 'text/plain'])
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies
CREATE POLICY "Users can upload their own avatars" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'character-avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Anyone can view avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'character-avatars');

CREATE POLICY "DMs can upload homebrew content" ON storage.objects
  FOR ALL WITH CHECK (
    bucket_id = 'homebrew-content' AND
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role IN ('dm', 'admin')
    )
  );

-- Create a table for user-generated homebrew content that references static data
CREATE TABLE IF NOT EXISTS public.homebrew_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('job', 'path', 'relic', 'spell', 'item')),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  data JSONB NOT NULL,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for homebrew_content
ALTER TABLE public.homebrew_content ENABLE ROW LEVEL SECURITY;

-- Homebrew content policies
CREATE POLICY "Users can view their own homebrew" ON public.homebrew_content
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view public homebrew" ON public.homebrew_content
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can manage their own homebrew" ON public.homebrew_content
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "DMs can manage any homebrew" ON public.homebrew_content
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role IN ('dm', 'admin')
    )
  );

-- Create a table for campaign-specific content
CREATE TABLE IF NOT EXISTS public.campaign_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  data JSONB NOT NULL,
  created_by UUID REFERENCES public.user_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for campaign_content
ALTER TABLE public.campaign_content ENABLE ROW LEVEL SECURITY;

-- Campaign content policies
CREATE POLICY "Campaign members can view content" ON public.campaign_content
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.campaigns cam
      WHERE cam.id = campaign_id AND (
        cam.dm_id = auth.uid() OR
        auth.uid() IN (
          SELECT user_id FROM public.campaign_members 
          WHERE campaign_id = cam.id
        )
      )
    )
  );

CREATE POLICY "DMs can manage campaign content" ON public.campaign_content
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.campaigns cam
      WHERE cam.id = campaign_id AND cam.dm_id = auth.uid()
    )
  );
