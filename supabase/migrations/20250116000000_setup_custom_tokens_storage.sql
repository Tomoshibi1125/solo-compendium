-- Create storage bucket for custom tokens/assets
-- This migration sets up the storage bucket and policies for custom DM tokens and character portraits

-- Create the bucket for custom tokens/assets (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'custom-tokens',
  'custom-tokens',
  true,
  5242880, -- 5MB limit
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Ensure character-portraits bucket exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'character-portraits',
  'character-portraits',
  true,
  5242880, -- 5MB limit
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for custom-tokens bucket
-- Allow public read access to all custom tokens
CREATE POLICY "Public read access for custom tokens"
ON storage.objects FOR SELECT
USING (bucket_id = 'custom-tokens')
ON CONFLICT DO NOTHING;

-- Allow authenticated users to upload custom tokens
CREATE POLICY "Authenticated users can upload custom tokens"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'custom-tokens' AND
  auth.role() = 'authenticated'
)
ON CONFLICT DO NOTHING;

-- Allow authenticated users to update their custom tokens
CREATE POLICY "Authenticated users can update custom tokens"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'custom-tokens' AND
  auth.role() = 'authenticated'
)
ON CONFLICT DO NOTHING;

-- Allow authenticated users to delete their custom tokens
CREATE POLICY "Authenticated users can delete custom tokens"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'custom-tokens' AND
  auth.role() = 'authenticated'
)
ON CONFLICT DO NOTHING;

-- Storage Policies for character-portraits bucket
-- Allow public read access to character portraits
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Public read access for character portraits'
  ) THEN
    CREATE POLICY "Public read access for character portraits"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'character-portraits');
  END IF;
END $$;

-- Allow authenticated users to upload character portraits
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can upload character portraits'
  ) THEN
    CREATE POLICY "Authenticated users can upload character portraits"
    ON storage.objects FOR INSERT
    WITH CHECK (
      bucket_id = 'character-portraits' AND
      auth.role() = 'authenticated'
    );
  END IF;
END $$;

-- Allow authenticated users to update their character portraits
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can update character portraits'
  ) THEN
    CREATE POLICY "Authenticated users can update character portraits"
    ON storage.objects FOR UPDATE
    USING (
      bucket_id = 'character-portraits' AND
      auth.role() = 'authenticated'
    );
  END IF;
END $$;

-- Allow authenticated users to delete their character portraits
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can delete character portraits'
  ) THEN
    CREATE POLICY "Authenticated users can delete character portraits"
    ON storage.objects FOR DELETE
    USING (
      bucket_id = 'character-portraits' AND
      auth.role() = 'authenticated'
    );
  END IF;
END $$;

