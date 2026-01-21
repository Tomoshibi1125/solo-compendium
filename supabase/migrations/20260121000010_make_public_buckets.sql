-- Ensure free-use asset buckets are public (audio + art + tokens).
UPDATE storage.buckets
SET public = true
WHERE id IN (
  'audio-tracks',
  'custom-tokens',
  'character-portraits',
  'compendium-images',
  'generated-art'
);

-- Allow public read access to audio tracks.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Public read access for audio tracks'
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
      EXECUTE 'CREATE POLICY "Public read access for audio tracks"\n'
        || 'ON storage.objects FOR SELECT\n'
        || 'USING (bucket_id = ''audio-tracks'');';
    END IF;
  END IF;
END $$;
