-- Art Assets Migration
-- Stores metadata for generated art assets

-- Art Assets table
CREATE TABLE IF NOT EXISTS art_assets (
  id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('monster', 'item', 'spell', 'location', 'job', 'background')),
  entity_id TEXT NOT NULL,
  variant TEXT NOT NULL CHECK (variant IN ('portrait', 'token', 'icon', 'illustration', 'banner')),
  
  -- File paths
  paths JSONB NOT NULL, -- {original, thumb, md, lg, token?}
  
  -- Image metadata
  dimensions JSONB NOT NULL, -- {width, height}
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL DEFAULT 'image/jpeg',
  
  -- Generation metadata
  metadata_path TEXT NOT NULL,
  metadata JSONB NOT NULL, -- prompt, seed, model, etc.
  hash TEXT NOT NULL, -- Cache key
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT unique_entity_variant UNIQUE(entity_type, entity_id, variant)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_art_assets_entity ON art_assets(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_art_assets_variant ON art_assets(variant);
CREATE INDEX IF NOT EXISTS idx_art_assets_hash ON art_assets(hash);
CREATE INDEX IF NOT EXISTS idx_art_assets_created_at ON art_assets(created_at);

-- RLS Policies
ALTER TABLE art_assets ENABLE ROW LEVEL SECURITY;

-- Public read access for generated assets
CREATE POLICY "Art assets are publicly readable" ON art_assets
  FOR SELECT USING (true);

-- Only authenticated users can create/update assets
CREATE POLICY "Art assets manageable by authenticated users" ON art_assets
  FOR ALL USING (auth.role() = 'authenticated');

-- Function to get asset paths
CREATE OR REPLACE FUNCTION public.get_asset_paths(entity_uuid TEXT, entity_variant TEXT DEFAULT 'portrait')
RETURNS TABLE(
  original TEXT,
  thumb TEXT,
  md TEXT,
  lg TEXT,
  token TEXT
)
LANGUAGE plpgsql
SET search_path = pg_catalog, public, extensions
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (paths->>'original')::TEXT,
    (paths->>'thumb')::TEXT,
    (paths->>'md')::TEXT,
    (paths->>'lg')::TEXT,
    (paths->>'token')::TEXT
  FROM art_assets
  WHERE entity_id = entity_uuid
  AND variant = entity_variant
  LIMIT 1;
END;
$$;

-- Function to check if asset exists
CREATE OR REPLACE FUNCTION public.asset_exists(entity_uuid TEXT, entity_variant TEXT DEFAULT 'portrait')
RETURNS BOOLEAN
LANGUAGE plpgsql
SET search_path = pg_catalog, public, extensions
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM art_assets
    WHERE entity_id = entity_uuid
    AND variant = entity_variant
  );
END;
$$;

-- Function to get entity assets
CREATE OR REPLACE FUNCTION public.get_entity_assets(entity_uuid TEXT)
RETURNS TABLE(
  variant TEXT,
  paths JSONB,
  dimensions JSONB,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SET search_path = pg_catalog, public, extensions
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    variant,
    paths,
    dimensions,
    created_at
  FROM art_assets
  WHERE entity_id = entity_uuid
  ORDER BY variant;
END;
$$;

-- Update timestamp trigger
CREATE TRIGGER update_art_assets_updated_at
  BEFORE UPDATE ON art_assets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
