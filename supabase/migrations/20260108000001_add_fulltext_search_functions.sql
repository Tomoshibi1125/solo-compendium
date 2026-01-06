-- Full-text search functions for better search performance
-- These functions use the existing GIN indexes for fast searching

-- Function to search compendium jobs
CREATE OR REPLACE FUNCTION search_compendium_jobs(search_text TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  created_at TIMESTAMPTZ,
  tags TEXT[],
  source_book TEXT,
  image_url TEXT,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    j.id,
    j.name,
    j.description,
    j.created_at,
    j.tags,
    j.source_book,
    j.image_url,
    ts_rank(
      to_tsvector('english', COALESCE(j.name, '') || ' ' || COALESCE(j.description, '')),
      to_tsquery('english', search_text)
    ) AS rank
  FROM compendium_jobs j
  WHERE to_tsvector('english', COALESCE(j.name, '') || ' ' || COALESCE(j.description, ''))
    @@ to_tsquery('english', search_text)
  ORDER BY rank DESC, j.name ASC;
END;
$$ LANGUAGE plpgsql;

-- Function to search compendium powers
CREATE OR REPLACE FUNCTION search_compendium_powers(search_text TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  power_level INTEGER,
  school TEXT,
  created_at TIMESTAMPTZ,
  tags TEXT[],
  source_book TEXT,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.description,
    p.power_level,
    p.school,
    p.created_at,
    p.tags,
    p.source_book,
    ts_rank(
      to_tsvector('english', COALESCE(p.name, '') || ' ' || COALESCE(p.description, '')),
      to_tsquery('english', search_text)
    ) AS rank
  FROM compendium_powers p
  WHERE to_tsvector('english', COALESCE(p.name, '') || ' ' || COALESCE(p.description, ''))
    @@ to_tsquery('english', search_text)
  ORDER BY rank DESC, p.name ASC;
END;
$$ LANGUAGE plpgsql;

-- Function to search compendium relics
CREATE OR REPLACE FUNCTION search_compendium_relics(search_text TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  rarity TEXT,
  created_at TIMESTAMPTZ,
  tags TEXT[],
  source_book TEXT,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.name,
    r.description,
    r.rarity,
    r.created_at,
    r.tags,
    r.source_book,
    ts_rank(
      to_tsvector('english', COALESCE(r.name, '') || ' ' || COALESCE(r.description, '')),
      to_tsquery('english', search_text)
    ) AS rank
  FROM compendium_relics r
  WHERE to_tsvector('english', COALESCE(r.name, '') || ' ' || COALESCE(r.description, ''))
    @@ to_tsquery('english', search_text)
  ORDER BY rank DESC, r.name ASC;
END;
$$ LANGUAGE plpgsql;

-- Function to search compendium monsters
CREATE OR REPLACE FUNCTION search_compendium_monsters(search_text TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  cr TEXT,
  creature_type TEXT,
  created_at TIMESTAMPTZ,
  tags TEXT[],
  source_book TEXT,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.id,
    m.name,
    m.description,
    m.cr,
    m.creature_type,
    m.created_at,
    m.tags,
    m.source_book,
    ts_rank(
      to_tsvector('english', COALESCE(m.name, '') || ' ' || COALESCE(m.description, '')),
      to_tsquery('english', search_text)
    ) AS rank
  FROM compendium_monsters m
  WHERE to_tsvector('english', COALESCE(m.name, '') || ' ' || COALESCE(m.description, ''))
    @@ to_tsquery('english', search_text)
  ORDER BY rank DESC, m.name ASC;
END;
$$ LANGUAGE plpgsql;

-- Function to search compendium job paths
CREATE OR REPLACE FUNCTION search_compendium_paths(search_text TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  created_at TIMESTAMPTZ,
  tags TEXT[],
  source_book TEXT,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.description,
    p.created_at,
    p.tags,
    p.source_book,
    ts_rank(
      to_tsvector('english', COALESCE(p.name, '') || ' ' || COALESCE(p.description, '')),
      to_tsquery('english', search_text)
    ) AS rank
  FROM compendium_job_paths p
  WHERE to_tsvector('english', COALESCE(p.name, '') || ' ' || COALESCE(p.description, ''))
    @@ to_tsquery('english', search_text)
  ORDER BY rank DESC, p.name ASC;
END;
$$ LANGUAGE plpgsql;

-- Function to search compendium monarchs
CREATE OR REPLACE FUNCTION search_compendium_monarchs(search_text TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  title TEXT,
  description TEXT,
  theme TEXT,
  created_at TIMESTAMPTZ,
  tags TEXT[],
  source_book TEXT,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.id,
    m.name,
    m.title,
    m.description,
    m.theme,
    m.created_at,
    m.tags,
    m.source_book,
    ts_rank(
      to_tsvector('english', 
        COALESCE(m.name, '') || ' ' || 
        COALESCE(m.title, '') || ' ' || 
        COALESCE(m.description, '') || ' ' ||
        COALESCE(m.theme, '')
      ),
      to_tsquery('english', search_text)
    ) AS rank
  FROM compendium_monarchs m
  WHERE to_tsvector('english', 
    COALESCE(m.name, '') || ' ' || 
    COALESCE(m.title, '') || ' ' || 
    COALESCE(m.description, '') || ' ' ||
    COALESCE(m.theme, '')
  ) @@ to_tsquery('english', search_text)
  ORDER BY rank DESC, m.name ASC;
END;
$$ LANGUAGE plpgsql;

-- Helper function to prepare search text for tsquery
-- Converts user input to safe tsquery format
CREATE OR REPLACE FUNCTION prepare_search_text(input_text TEXT)
RETURNS TEXT AS $$
DECLARE
  cleaned TEXT;
  words TEXT[];
  word TEXT;
  result TEXT := '';
BEGIN
  -- Remove special characters and normalize
  cleaned := regexp_replace(lower(input_text), '[^a-z0-9\s]', ' ', 'g');
  cleaned := regexp_replace(cleaned, '\s+', ' ', 'g');
  cleaned := trim(cleaned);
  
  -- Split into words
  words := string_to_array(cleaned, ' ');
  
  -- Build tsquery with AND operator
  FOREACH word IN ARRAY words
  LOOP
    IF length(word) > 0 THEN
      IF result != '' THEN
        result := result || ' & ';
      END IF;
      -- Use prefix matching for better results
      result := result || quote_literal(word) || ':*';
    END IF;
  END LOOP;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION search_compendium_jobs(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION search_compendium_powers(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION search_compendium_relics(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION search_compendium_monsters(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION search_compendium_paths(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION search_compendium_monarchs(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION prepare_search_text(TEXT) TO authenticated;

