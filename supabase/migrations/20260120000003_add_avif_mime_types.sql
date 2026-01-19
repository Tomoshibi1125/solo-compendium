-- Add AVIF support for art storage buckets.

UPDATE storage.buckets
SET allowed_mime_types = (
  SELECT ARRAY(
    SELECT DISTINCT unnest(
      COALESCE(allowed_mime_types, ARRAY[]::text[]) || ARRAY['image/avif']
    )
  )
)
WHERE id IN ('generated-art', 'custom-tokens', 'character-portraits')
  AND (allowed_mime_types IS NULL OR NOT ('image/avif' = ANY(allowed_mime_types)));
