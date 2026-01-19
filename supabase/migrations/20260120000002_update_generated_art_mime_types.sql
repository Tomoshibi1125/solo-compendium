-- Expand generated-art bucket MIME types for SVG assets

UPDATE storage.buckets
SET allowed_mime_types = ARRAY[
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'application/json'
]
WHERE id = 'generated-art';
