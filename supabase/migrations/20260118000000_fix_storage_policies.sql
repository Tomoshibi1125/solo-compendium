-- Ensure storage bucket visibility and object policies are present for art + tokens.

-- Allow reading bucket metadata so storage APIs can verify bucket existence.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'buckets'
      AND policyname = 'Public read access for buckets'
  ) THEN
    CREATE POLICY "Public read access for buckets"
    ON storage.buckets FOR SELECT
    USING (true);
  END IF;
END $$;

-- Generated art policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Public read access for generated art'
  ) THEN
    CREATE POLICY "Public read access for generated art"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'generated-art');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Authenticated users can upload generated art'
  ) THEN
    CREATE POLICY "Authenticated users can upload generated art"
    ON storage.objects FOR INSERT
    WITH CHECK (
      bucket_id = 'generated-art'
      AND auth.role() = 'authenticated'
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Authenticated users can update generated art'
  ) THEN
    CREATE POLICY "Authenticated users can update generated art"
    ON storage.objects FOR UPDATE
    USING (
      bucket_id = 'generated-art'
      AND auth.role() = 'authenticated'
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Authenticated users can delete generated art'
  ) THEN
    CREATE POLICY "Authenticated users can delete generated art"
    ON storage.objects FOR DELETE
    USING (
      bucket_id = 'generated-art'
      AND auth.role() = 'authenticated'
    );
  END IF;
END $$;

-- Custom tokens policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Public read access for custom tokens'
  ) THEN
    CREATE POLICY "Public read access for custom tokens"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'custom-tokens');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Authenticated users can upload custom tokens'
  ) THEN
    CREATE POLICY "Authenticated users can upload custom tokens"
    ON storage.objects FOR INSERT
    WITH CHECK (
      bucket_id = 'custom-tokens'
      AND auth.role() = 'authenticated'
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Authenticated users can update custom tokens'
  ) THEN
    CREATE POLICY "Authenticated users can update custom tokens"
    ON storage.objects FOR UPDATE
    USING (
      bucket_id = 'custom-tokens'
      AND auth.role() = 'authenticated'
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Authenticated users can delete custom tokens'
  ) THEN
    CREATE POLICY "Authenticated users can delete custom tokens"
    ON storage.objects FOR DELETE
    USING (
      bucket_id = 'custom-tokens'
      AND auth.role() = 'authenticated'
    );
  END IF;
END $$;

-- Character portraits policies
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

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Authenticated users can upload character portraits'
  ) THEN
    CREATE POLICY "Authenticated users can upload character portraits"
    ON storage.objects FOR INSERT
    WITH CHECK (
      bucket_id = 'character-portraits'
      AND auth.role() = 'authenticated'
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Authenticated users can update character portraits'
  ) THEN
    CREATE POLICY "Authenticated users can update character portraits"
    ON storage.objects FOR UPDATE
    USING (
      bucket_id = 'character-portraits'
      AND auth.role() = 'authenticated'
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Authenticated users can delete character portraits'
  ) THEN
    CREATE POLICY "Authenticated users can delete character portraits"
    ON storage.objects FOR DELETE
    USING (
      bucket_id = 'character-portraits'
      AND auth.role() = 'authenticated'
    );
  END IF;
END $$;
