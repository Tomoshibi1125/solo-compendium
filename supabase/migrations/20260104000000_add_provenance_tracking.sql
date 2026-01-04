-- Add provenance tracking to compendium tables
-- This migration adds sourceKind, sourceName, licenseNote, and related fields
-- to track the origin of all content for legal compliance

-- Add provenance columns to compendium_jobs
ALTER TABLE public.compendium_jobs
ADD COLUMN IF NOT EXISTS source_kind TEXT CHECK (source_kind IN ('homebrew', 'srd', 'generated')) DEFAULT 'homebrew',
ADD COLUMN IF NOT EXISTS source_name TEXT DEFAULT 'Solo Compendium Homebrew',
ADD COLUMN IF NOT EXISTS license_note TEXT,
ADD COLUMN IF NOT EXISTS generated_reason TEXT,
ADD COLUMN IF NOT EXISTS theme_tags TEXT[];

-- Add provenance columns to compendium_job_paths
ALTER TABLE public.compendium_job_paths
ADD COLUMN IF NOT EXISTS source_kind TEXT CHECK (source_kind IN ('homebrew', 'srd', 'generated')) DEFAULT 'homebrew',
ADD COLUMN IF NOT EXISTS source_name TEXT DEFAULT 'Solo Compendium Homebrew',
ADD COLUMN IF NOT EXISTS license_note TEXT,
ADD COLUMN IF NOT EXISTS generated_reason TEXT,
ADD COLUMN IF NOT EXISTS theme_tags TEXT[];

-- Add provenance columns to compendium_job_features
ALTER TABLE public.compendium_job_features
ADD COLUMN IF NOT EXISTS source_kind TEXT CHECK (source_kind IN ('homebrew', 'srd', 'generated')) DEFAULT 'homebrew',
ADD COLUMN IF NOT EXISTS source_name TEXT DEFAULT 'Solo Compendium Homebrew',
ADD COLUMN IF NOT EXISTS license_note TEXT,
ADD COLUMN IF NOT EXISTS generated_reason TEXT,
ADD COLUMN IF NOT EXISTS theme_tags TEXT[];

-- Add provenance columns to compendium_monarchs
ALTER TABLE public.compendium_monarchs
ADD COLUMN IF NOT EXISTS source_kind TEXT CHECK (source_kind IN ('homebrew', 'srd', 'generated')) DEFAULT 'homebrew',
ADD COLUMN IF NOT EXISTS source_name TEXT DEFAULT 'Solo Compendium Homebrew',
ADD COLUMN IF NOT EXISTS license_note TEXT,
ADD COLUMN IF NOT EXISTS generated_reason TEXT,
ADD COLUMN IF NOT EXISTS theme_tags TEXT[];

-- Add provenance columns to compendium_monarch_features
ALTER TABLE public.compendium_monarch_features
ADD COLUMN IF NOT EXISTS source_kind TEXT CHECK (source_kind IN ('homebrew', 'srd', 'generated')) DEFAULT 'homebrew',
ADD COLUMN IF NOT EXISTS source_name TEXT DEFAULT 'Solo Compendium Homebrew',
ADD COLUMN IF NOT EXISTS license_note TEXT,
ADD COLUMN IF NOT EXISTS generated_reason TEXT,
ADD COLUMN IF NOT EXISTS theme_tags TEXT[];

-- Add provenance columns to compendium_sovereigns
ALTER TABLE public.compendium_sovereigns
ADD COLUMN IF NOT EXISTS source_kind TEXT CHECK (source_kind IN ('homebrew', 'srd', 'generated')) DEFAULT 'homebrew',
ADD COLUMN IF NOT EXISTS source_name TEXT DEFAULT 'Solo Compendium Homebrew',
ADD COLUMN IF NOT EXISTS license_note TEXT,
ADD COLUMN IF NOT EXISTS generated_reason TEXT,
ADD COLUMN IF NOT EXISTS theme_tags TEXT[];

-- Add provenance columns to compendium_sovereign_features
ALTER TABLE public.compendium_sovereign_features
ADD COLUMN IF NOT EXISTS source_kind TEXT CHECK (source_kind IN ('homebrew', 'srd', 'generated')) DEFAULT 'homebrew',
ADD COLUMN IF NOT EXISTS source_name TEXT DEFAULT 'Solo Compendium Homebrew',
ADD COLUMN IF NOT EXISTS license_note TEXT,
ADD COLUMN IF NOT EXISTS generated_reason TEXT,
ADD COLUMN IF NOT EXISTS theme_tags TEXT[];

-- Add provenance columns to compendium_powers
ALTER TABLE public.compendium_powers
ADD COLUMN IF NOT EXISTS source_kind TEXT CHECK (source_kind IN ('homebrew', 'srd', 'generated')) DEFAULT 'homebrew',
ADD COLUMN IF NOT EXISTS source_name TEXT DEFAULT 'Solo Compendium Homebrew',
ADD COLUMN IF NOT EXISTS license_note TEXT,
ADD COLUMN IF NOT EXISTS generated_reason TEXT,
ADD COLUMN IF NOT EXISTS theme_tags TEXT[];

-- Add provenance columns to compendium_relics
ALTER TABLE public.compendium_relics
ADD COLUMN IF NOT EXISTS source_kind TEXT CHECK (source_kind IN ('homebrew', 'srd', 'generated')) DEFAULT 'homebrew',
ADD COLUMN IF NOT EXISTS source_name TEXT DEFAULT 'Solo Compendium Homebrew',
ADD COLUMN IF NOT EXISTS license_note TEXT,
ADD COLUMN IF NOT EXISTS generated_reason TEXT,
ADD COLUMN IF NOT EXISTS theme_tags TEXT[];

-- Add provenance columns to compendium_equipment
ALTER TABLE public.compendium_equipment
ADD COLUMN IF NOT EXISTS source_kind TEXT CHECK (source_kind IN ('homebrew', 'srd', 'generated')) DEFAULT 'homebrew',
ADD COLUMN IF NOT EXISTS source_name TEXT DEFAULT 'Solo Compendium Homebrew',
ADD COLUMN IF NOT EXISTS license_note TEXT,
ADD COLUMN IF NOT EXISTS generated_reason TEXT,
ADD COLUMN IF NOT EXISTS theme_tags TEXT[];

-- Add provenance columns to compendium_monsters
ALTER TABLE public.compendium_monsters
ADD COLUMN IF NOT EXISTS source_kind TEXT CHECK (source_kind IN ('homebrew', 'srd', 'generated')) DEFAULT 'homebrew',
ADD COLUMN IF NOT EXISTS source_name TEXT DEFAULT 'Solo Compendium Homebrew',
ADD COLUMN IF NOT EXISTS license_note TEXT,
ADD COLUMN IF NOT EXISTS generated_reason TEXT,
ADD COLUMN IF NOT EXISTS theme_tags TEXT[];

-- Add provenance columns to compendium_backgrounds
ALTER TABLE public.compendium_backgrounds
ADD COLUMN IF NOT EXISTS source_kind TEXT CHECK (source_kind IN ('homebrew', 'srd', 'generated')) DEFAULT 'homebrew',
ADD COLUMN IF NOT EXISTS source_name TEXT DEFAULT 'Solo Compendium Homebrew',
ADD COLUMN IF NOT EXISTS license_note TEXT,
ADD COLUMN IF NOT EXISTS generated_reason TEXT,
ADD COLUMN IF NOT EXISTS theme_tags TEXT[];

-- Add provenance columns to compendium_conditions
ALTER TABLE public.compendium_conditions
ADD COLUMN IF NOT EXISTS source_kind TEXT CHECK (source_kind IN ('homebrew', 'srd', 'generated')) DEFAULT 'homebrew',
ADD COLUMN IF NOT EXISTS source_name TEXT DEFAULT 'Solo Compendium Homebrew',
ADD COLUMN IF NOT EXISTS license_note TEXT,
ADD COLUMN IF NOT EXISTS generated_reason TEXT,
ADD COLUMN IF NOT EXISTS theme_tags TEXT[];

-- Add provenance columns to compendium_feats
ALTER TABLE public.compendium_feats
ADD COLUMN IF NOT EXISTS source_kind TEXT CHECK (source_kind IN ('homebrew', 'srd', 'generated')) DEFAULT 'homebrew',
ADD COLUMN IF NOT EXISTS source_name TEXT DEFAULT 'Solo Compendium Homebrew',
ADD COLUMN IF NOT EXISTS license_note TEXT,
ADD COLUMN IF NOT EXISTS generated_reason TEXT,
ADD COLUMN IF NOT EXISTS theme_tags TEXT[];

-- Add provenance columns to compendium_skills
ALTER TABLE public.compendium_skills
ADD COLUMN IF NOT EXISTS source_kind TEXT CHECK (source_kind IN ('homebrew', 'srd', 'generated')) DEFAULT 'homebrew',
ADD COLUMN IF NOT EXISTS source_name TEXT DEFAULT 'Solo Compendium Homebrew',
ADD COLUMN IF NOT EXISTS license_note TEXT,
ADD COLUMN IF NOT EXISTS generated_reason TEXT,
ADD COLUMN IF NOT EXISTS theme_tags TEXT[];

-- Add comments to document the fields
COMMENT ON COLUMN public.compendium_jobs.source_kind IS 'Origin of content: homebrew (existing), srd (5e SRD adapted), or generated (AI/script created)';
COMMENT ON COLUMN public.compendium_jobs.source_name IS 'Name of the source (e.g., "Solo Compendium Homebrew", "5e SRD", "Generated Gap-Fill")';
COMMENT ON COLUMN public.compendium_jobs.license_note IS 'License or attribution note for SRD/generated content';
COMMENT ON COLUMN public.compendium_jobs.generated_reason IS 'Reason for generation (what gap it filled) - only for generated content';
COMMENT ON COLUMN public.compendium_jobs.theme_tags IS 'Theme tags for generated content (e.g., ["Solo", "Gravesong"])';

