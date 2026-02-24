-- Add missing compendium_sovereigns foreign key indexes

-- ============================================================
-- compendium_sovereigns foreign key indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_compendium_sovereigns_job_id 
ON public.compendium_sovereigns(job_id);
CREATE INDEX IF NOT EXISTS idx_compendium_sovereigns_regent_a_id 
ON public.compendium_sovereigns(regent_a_id);
CREATE INDEX IF NOT EXISTS idx_compendium_sovereigns_regent_b_id 
ON public.compendium_sovereigns(regent_b_id);
CREATE INDEX IF NOT EXISTS idx_compendium_sovereigns_path_id 
ON public.compendium_sovereigns(path_id);
