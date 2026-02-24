-- Consolidate multiple permissive RLS policies on compendium_powers table
-- This improves performance by having a single policy instead of multiple permissive policies

-- First, drop the existing multiple permissive policies
DROP POLICY IF EXISTS "Compendium powers public read" ON public.compendium_powers;
DROP POLICY IF EXISTS compendium_powers_select ON public.compendium_powers;

-- Create a single consolidated permissive policy for all roles
CREATE POLICY compendium_powers_unified_select ON public.compendium_powers
    FOR SELECT USING (true);

-- Add comments for documentation
COMMENT ON POLICY compendium_powers_unified_select ON public.compendium_powers IS 'Unified permissive policy for all SELECT operations on compendium_powers table';
