-- Quick reference SQL to apply image generation migrations
-- Run this in Supabase Dashboard → SQL Editor

-- 1. Add image columns to compendium tables
-- (This is the same as 20250109000000_add_compendium_images.sql)

-- Monsters
ALTER TABLE public.compendium_monsters
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS image_generated_at TIMESTAMP WITH TIME ZONE;

-- Equipment
ALTER TABLE public.compendium_equipment
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS image_generated_at TIMESTAMP WITH TIME ZONE;

-- Relics
ALTER TABLE public.compendium_relics
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS image_generated_at TIMESTAMP WITH TIME ZONE;

-- Jobs
ALTER TABLE public.compendium_jobs
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS image_generated_at TIMESTAMP WITH TIME ZONE;

-- Job Paths (optional)
ALTER TABLE public.compendium_job_paths
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS image_generated_at TIMESTAMP WITH TIME ZONE;

-- 2. Create storage bucket (if it doesn't exist)
-- (This is the same as 20250109000001_setup_compendium_images_storage.sql)

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'compendium-images',
  'compendium-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- 3. Storage Policies

-- Allow public read access
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Public read access for compendium images'
  ) THEN
    CREATE POLICY "Public read access for compendium images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'compendium-images');
  END IF;
END $$;

-- Allow authenticated users to upload
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can upload compendium images'
  ) THEN
    CREATE POLICY "Authenticated users can upload compendium images"
    ON storage.objects FOR INSERT
    WITH CHECK (
      bucket_id = 'compendium-images' AND
      auth.role() = 'authenticated'
    );
  END IF;
END $$;

-- Allow authenticated users to update
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can update compendium images'
  ) THEN
    CREATE POLICY "Authenticated users can update compendium images"
    ON storage.objects FOR UPDATE
    USING (
      bucket_id = 'compendium-images' AND
      auth.role() = 'authenticated'
    );
  END IF;
END $$;

-- Success message
SELECT 'Migrations applied successfully! Image columns and storage bucket are ready.' as status;

