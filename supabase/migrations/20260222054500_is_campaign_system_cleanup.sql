-- Resolve duplicate is_campaign_system overload and standardize implementation
-- Removes single-arg overload and recreates canonical two-arg version with co-system support

DROP FUNCTION IF EXISTS public.is_campaign_system(p_campaign_id uuid);

CREATE OR REPLACE FUNCTION public.is_campaign_system(
  p_campaign_id UUID,
  p_user_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
SET row_security = off
AS $$
  SELECT p_user_id IS NOT NULL AND (
    EXISTS (
      SELECT 1 FROM public.campaigns WHERE id = p_campaign_id AND dm_id = p_user_id
    )
    OR EXISTS (
      SELECT 1 FROM public.campaign_members
      WHERE campaign_id = p_campaign_id
        AND user_id = p_user_id
        AND role = 'co-system'
    )
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_campaign_system(UUID, UUID) TO authenticated;
