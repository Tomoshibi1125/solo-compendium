-- Create storage bucket for generated art assets
-- This migration sets up the storage bucket and policies for AI-generated art

-- Create the bucket (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'generated-art',
  'generated-art',
  true,
  10485760, -- 10MB limit
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif', 'application/json']
)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for generated-art bucket
-- Allow public read access to generated art
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Public read access for generated art'
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
      EXECUTE 'CREATE POLICY "Public read access for generated art"\n'
        || 'ON storage.objects FOR SELECT\n'
        || 'USING (bucket_id = ''generated-art'');';
    END IF;
  END IF;
END $$;

-- Allow authenticated users to upload generated art
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Authenticated users can upload generated art'
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
      EXECUTE 'CREATE POLICY "Authenticated users can upload generated art"\n'
        || 'ON storage.objects FOR INSERT\n'
        || 'WITH CHECK (\n'
        || '  bucket_id = ''generated-art'' AND\n'
        || '  auth.role() = ''authenticated''\n'
        || ');';
    END IF;
  END IF;
END $$;

-- Allow authenticated users to update generated art
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Authenticated users can update generated art'
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
      EXECUTE 'CREATE POLICY "Authenticated users can update generated art"\n'
        || 'ON storage.objects FOR UPDATE\n'
        || 'USING (\n'
        || '  bucket_id = ''generated-art'' AND\n'
        || '  auth.role() = ''authenticated''\n'
        || ');';
    END IF;
  END IF;
END $$;

-- Allow authenticated users to delete generated art
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Authenticated users can delete generated art'
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
      EXECUTE 'CREATE POLICY "Authenticated users can delete generated art"\n'
        || 'ON storage.objects FOR DELETE\n'
        || 'USING (\n'
        || '  bucket_id = ''generated-art'' AND\n'
        || '  auth.role() = ''authenticated''\n'
        || ');';
    END IF;
  END IF;
END $$;
