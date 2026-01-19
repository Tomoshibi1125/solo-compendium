-- Ensure art-related buckets accept JSON metadata uploads.

UPDATE storage.buckets
SET allowed_mime_types = (
  SELECT ARRAY(
    SELECT DISTINCT unnest(
      COALESCE(allowed_mime_types, ARRAY[]::text[]) || ARRAY['application/json']
    )
  )
)
WHERE id IN ('generated-art', 'custom-tokens', 'character-portraits')
  AND (allowed_mime_types IS NULL OR NOT ('application/json' = ANY(allowed_mime_types)));
