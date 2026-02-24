-- Complete monarch to regent migration for compendium_sovereigns table
-- This fixes the remaining monarch references that should be regent

BEGIN;

-- 1. Add new regent columns to compendium_sovereigns if they don't exist
DO $$
BEGIN
    -- Add regent_a_id column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'compendium_sovereigns' 
        AND column_name = 'regent_a_id'
    ) THEN
        ALTER TABLE public.compendium_sovereigns 
        ADD COLUMN regent_a_id UUID REFERENCES public.compendium_regents(id) ON DELETE SET NULL;
    END IF;
    
    -- Add regent_b_id column  
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'compendium_sovereigns' 
        AND column_name = 'regent_b_id'
    ) THEN
        ALTER TABLE public.compendium_sovereigns 
        ADD COLUMN regent_b_id UUID REFERENCES public.compendium_regents(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 2. Migrate data from monarch columns to regent columns
UPDATE public.compendium_sovereigns 
SET 
    regent_a_id = monarch_a_id,
    regent_b_id = monarch_b_id
WHERE monarch_a_id IS NOT NULL OR monarch_b_id IS NOT NULL;

-- 3. Drop old monarch indexes
DROP INDEX IF EXISTS idx_compendium_sovereigns_monarch_a_id;
DROP INDEX IF EXISTS idx_compendium_sovereigns_monarch_b_id;

-- 4. Create new regent indexes
CREATE INDEX IF NOT EXISTS idx_compendium_sovereigns_regent_a_id 
ON public.compendium_sovereigns(regent_a_id);
CREATE INDEX IF NOT EXISTS idx_compendium_sovereigns_regent_b_id 
ON public.compendium_sovereigns(regent_b_id);

-- 5. Drop old monarch columns (optional - keeping for backwards compatibility)
-- Uncomment the following lines if you want to completely remove monarch references:
-- ALTER TABLE public.compendium_sovereigns DROP COLUMN IF EXISTS monarch_a_id;
-- ALTER TABLE public.compendium_sovereigns DROP COLUMN IF EXISTS monarch_b_id;

COMMIT;
