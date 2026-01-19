-- Add RLS policies for compendium tables (read-only for all users)
-- Compendium content is public read-only, but we still want RLS enabled for consistency

-- Jobs (public read)
ALTER TABLE public.compendium_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view jobs"
  ON public.compendium_jobs
  FOR SELECT
  USING (true);
-- Job Paths (public read)
ALTER TABLE public.compendium_job_paths ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view job paths"
  ON public.compendium_job_paths
  FOR SELECT
  USING (true);
-- Job Features (public read)
ALTER TABLE public.compendium_job_features ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view job features"
  ON public.compendium_job_features
  FOR SELECT
  USING (true);
-- Powers (public read)
ALTER TABLE public.compendium_powers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view powers"
  ON public.compendium_powers
  FOR SELECT
  USING (true);
-- Relics (public read)
ALTER TABLE public.compendium_relics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view relics"
  ON public.compendium_relics
  FOR SELECT
  USING (true);
-- Equipment (public read)
ALTER TABLE public.compendium_equipment ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view equipment"
  ON public.compendium_equipment
  FOR SELECT
  USING (true);
-- Monsters (public read)
ALTER TABLE public.compendium_monsters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view monsters"
  ON public.compendium_monsters
  FOR SELECT
  USING (true);
-- Backgrounds (public read)
ALTER TABLE public.compendium_backgrounds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view backgrounds"
  ON public.compendium_backgrounds
  FOR SELECT
  USING (true);
-- Conditions (public read)
ALTER TABLE public.compendium_conditions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view conditions"
  ON public.compendium_conditions
  FOR SELECT
  USING (true);
-- Feats (public read)
ALTER TABLE public.compendium_feats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view feats"
  ON public.compendium_feats
  FOR SELECT
  USING (true);
-- Skills (public read)
ALTER TABLE public.compendium_skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view skills"
  ON public.compendium_skills
  FOR SELECT
  USING (true);
-- Monarchs (public read)
ALTER TABLE public.compendium_monarchs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view monarchs"
  ON public.compendium_monarchs
  FOR SELECT
  USING (true);
-- Sovereigns (public read)
ALTER TABLE public.compendium_sovereigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view sovereigns"
  ON public.compendium_sovereigns
  FOR SELECT
  USING (true);
-- Note: Admin/import operations would require service role key or admin role
-- For now, compendium tables are read-only via RLS;
