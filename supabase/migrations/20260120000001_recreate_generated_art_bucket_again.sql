-- Recreate storage bucket for generated art assets (repeat-safe)

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'generated-art',
  'generated-art',
  true,
  10485760, -- 10MB
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif', 'application/json', 'text/plain']
)
ON CONFLICT (id) DO NOTHING;

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
      EXECUTE 'CREATE POLICY "Public read access for generated art"'
        || ' ON storage.objects FOR SELECT'
        || ' USING (bucket_id = ''generated-art'');';
    END IF;
  END IF;
END $$;

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
      EXECUTE 'CREATE POLICY "Authenticated users can upload generated art"'
        || ' ON storage.objects FOR INSERT'
        || ' WITH CHECK (bucket_id = ''generated-art'' AND auth.role() = ''authenticated'');';
    END IF;
  END IF;
END $$;

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
      EXECUTE 'CREATE POLICY "Authenticated users can update generated art"'
        || ' ON storage.objects FOR UPDATE'
        || ' USING (bucket_id = ''generated-art'' AND auth.role() = ''authenticated'');';
    END IF;
  END IF;
END $$;

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
      EXECUTE 'CREATE POLICY "Authenticated users can delete generated art"'
        || ' ON storage.objects FOR DELETE'
        || ' USING (bucket_id = ''generated-art'' AND auth.role() = ''authenticated'');';
    END IF;
  END IF;
END $$;
