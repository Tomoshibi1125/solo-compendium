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
CREATE POLICY "Public read access for compendium images"
ON storage.objects FOR SELECT
USING (bucket_id = 'compendium-images');

-- Allow authenticated users to upload (for admin/image generation)
CREATE POLICY "Authenticated users can upload compendium images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'compendium-images' AND
  auth.role() = 'authenticated'
);

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update compendium images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'compendium-images' AND
  auth.role() = 'authenticated'
);

-- Allow authenticated users to delete (for admin/image regeneration)
CREATE POLICY "Authenticated users can delete compendium images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'compendium-images' AND
  auth.role() = 'authenticated'
);

