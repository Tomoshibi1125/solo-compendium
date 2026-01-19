-- Create storage bucket for compendium images
-- This migration sets up the storage bucket and policies for compendium images

-- Create the bucket (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'compendium-images',
  'compendium-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;
-- Storage Policies
-- Allow public read access to all images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Public read access for compendium images'
  ) THEN
    IF EXISTS (
      SELECT 1
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      JOIN pg_roles r ON r.oid = c.relowner
      WHERE n.nspname = 'storage'
        AND c.relname = 'objects'
        AND r.rolname = current_user
    ) THEN
      EXECUTE 'CREATE POLICY "Public read access for compendium images"\n'
        || 'ON storage.objects FOR SELECT\n'
        || 'USING (bucket_id = ''compendium-images'');';
    END IF;
  END IF;
END $$;
-- Allow authenticated users to upload (for admin/image generation)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Authenticated users can upload compendium images'
  ) THEN
    IF EXISTS (
      SELECT 1
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      JOIN pg_roles r ON r.oid = c.relowner
      WHERE n.nspname = 'storage'
        AND c.relname = 'objects'
        AND r.rolname = current_user
    ) THEN
      EXECUTE 'CREATE POLICY "Authenticated users can upload compendium images"\n'
        || 'ON storage.objects FOR INSERT\n'
        || 'WITH CHECK (\n'
        || '  bucket_id = ''compendium-images'' AND\n'
        || '  auth.role() = ''authenticated''\n'
        || ');';
    END IF;
  END IF;
END $$;
-- Allow authenticated users to update their uploads
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Authenticated users can update compendium images'
  ) THEN
    IF EXISTS (
      SELECT 1
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      JOIN pg_roles r ON r.oid = c.relowner
      WHERE n.nspname = 'storage'
        AND c.relname = 'objects'
        AND r.rolname = current_user
    ) THEN
      EXECUTE 'CREATE POLICY "Authenticated users can update compendium images"\n'
        || 'ON storage.objects FOR UPDATE\n'
        || 'USING (\n'
        || '  bucket_id = ''compendium-images'' AND\n'
        || '  auth.role() = ''authenticated''\n'
        || ');';
    END IF;
  END IF;
END $$;
-- Allow authenticated users to delete (for admin/image regeneration)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Authenticated users can delete compendium images'
  ) THEN
    IF EXISTS (
      SELECT 1
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      JOIN pg_roles r ON r.oid = c.relowner
      WHERE n.nspname = 'storage'
        AND c.relname = 'objects'
        AND r.rolname = current_user
    ) THEN
      EXECUTE 'CREATE POLICY "Authenticated users can delete compendium images"\n'
        || 'ON storage.objects FOR DELETE\n'
        || 'USING (\n'
        || '  bucket_id = ''compendium-images'' AND\n'
        || '  auth.role() = ''authenticated''\n'
        || ');';
    END IF;
  END IF;
END $$;
