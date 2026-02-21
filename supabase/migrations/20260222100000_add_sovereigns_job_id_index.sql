-- Add covering index for compendium_sovereigns_job_id_fkey foreign key
CREATE INDEX IF NOT EXISTS idx_compendium_sovereigns_job_id
  ON public.compendium_sovereigns(job_id);
