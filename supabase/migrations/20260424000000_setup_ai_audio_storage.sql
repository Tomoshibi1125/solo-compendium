-- Storage bucket for AI-generated audio (Warden-only, via Stable Audio Open / HF)
-- Mirror of 20260117000000_setup_generated_art_storage.sql but for audio.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'ai-audio',
  'ai-audio',
  true,
  10485760, -- 10 MB limit (supports up to ~47s WAV at 44.1kHz 16-bit mono)
  ARRAY['audio/wav', 'audio/x-wav', 'audio/mpeg', 'audio/mp3', 'audio/ogg', 'audio/flac', 'audio/webm']
)
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Public read access (generated audio is public; privacy enforced by the
-- /api/ai-audio proxy which requires auth + Warden role before generating).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Public read access for ai-audio'
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
      EXECUTE 'CREATE POLICY "Public read access for ai-audio"' || chr(10)
        || 'ON storage.objects FOR SELECT' || chr(10)
        || 'USING (bucket_id = ''ai-audio'');';
    END IF;
  END IF;
END $$;

-- Authenticated users can upload (the /api/ai-audio proxy uses the service
-- role, so this policy is a fallback for any direct-upload use cases).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Authenticated users can upload ai-audio'
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
      EXECUTE 'CREATE POLICY "Authenticated users can upload ai-audio"' || chr(10)
        || 'ON storage.objects FOR INSERT' || chr(10)
        || 'WITH CHECK (' || chr(10)
        || '  bucket_id = ''ai-audio'' AND' || chr(10)
        || '  auth.role() = ''authenticated''' || chr(10)
        || ');';
    END IF;
  END IF;
END $$;

-- Owners can update/delete their own generated audio files
-- (storagePath convention: "{userId}/{timestamp}-{kind}-{slug}.{ext}")
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Owners can update their ai-audio'
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
      EXECUTE 'CREATE POLICY "Owners can update their ai-audio"' || chr(10)
        || 'ON storage.objects FOR UPDATE' || chr(10)
        || 'USING (' || chr(10)
        || '  bucket_id = ''ai-audio'' AND' || chr(10)
        || '  auth.uid()::text = (storage.foldername(name))[1]' || chr(10)
        || ');';
    END IF;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Owners can delete their ai-audio'
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
      EXECUTE 'CREATE POLICY "Owners can delete their ai-audio"' || chr(10)
        || 'ON storage.objects FOR DELETE' || chr(10)
        || 'USING (' || chr(10)
        || '  bucket_id = ''ai-audio'' AND' || chr(10)
        || '  auth.uid()::text = (storage.foldername(name))[1]' || chr(10)
        || ');';
    END IF;
  END IF;
END $$;
