-- A clean replay leaves legacy character-sheet tables with RLS policies but no
-- browser read grants. Restore only the scoped sheet surface reviewed below.
BEGIN;

DROP POLICY IF EXISTS characters_select ON public.characters;
CREATE POLICY characters_select
ON public.characters FOR SELECT TO authenticated
USING (user_id = auth.uid());

GRANT SELECT, INSERT, UPDATE, DELETE ON public.characters TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_sovereigns TO authenticated;
GRANT SELECT ON public.saved_sovereigns TO anon;

-- These exact 28 tables have owner/linked-Warden read policies from the
-- campaign roster security migration. No mutation grant is implied by this.
DO $$
DECLARE
  v_table TEXT;
BEGIN
  FOREACH v_table IN ARRAY ARRAY[
    'character_abilities','character_active_spells',
    'character_crafting_projects','character_equipment',
    'character_extras','character_feature_choices','character_features',
    'character_journal','character_materials','character_monarch_unlocks',
    'character_powers','character_recipes','character_regent_unlock_grants',
    'character_regent_unlocks','character_regents',
    'character_requisition_profiles','character_rune_inscriptions',
    'character_rune_knowledge','character_shadow_army',
    'character_sheet_state','character_sigil_inscriptions',
    'character_spell_slots','character_spells','character_tamed_anomalies',
    'character_tattoos','character_techniques',
    'character_umbral_legionnaires','character_vehicles'
  ] LOOP
    EXECUTE format('GRANT SELECT ON public.%I TO authenticated', v_table);
  END LOOP;
END;
$$;

-- These three pre-C1 stores still use owner-scoped direct writes. The C1
-- BEFORE INSERT triggers supply stable registry IDs for new rows.
GRANT INSERT, UPDATE, DELETE ON public.character_extras TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.character_tamed_anomalies TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.character_vehicles TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.character_recipes TO authenticated;

DROP POLICY IF EXISTS cta_select ON public.campaign_tamed_anomalies;
CREATE POLICY cta_select
ON public.campaign_tamed_anomalies FOR SELECT TO authenticated
USING (app_private.actor_in_campaign(campaign_id));
GRANT SELECT ON public.campaign_tamed_anomalies TO authenticated;

-- Campaign tames are campaign-owned. Warden manual HP changes and removal are
-- explicit RPCs; direct browser UPDATE/DELETE still have no table grant.
CREATE OR REPLACE FUNCTION public.set_campaign_tamed_hp(
  p_tamed_id UUID,
  p_current_hp INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_campaign_id UUID;
BEGIN
  IF p_current_hp IS NULL OR p_current_hp NOT BETWEEN 0 AND 1000000 THEN
    RAISE EXCEPTION 'INVALID_TAMED_HP' USING ERRCODE = '22023';
  END IF;
  SELECT campaign_id INTO v_campaign_id
  FROM public.campaign_tamed_anomalies WHERE id = p_tamed_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'TAMED_ANOMALY_NOT_FOUND' USING ERRCODE = '22023';
  END IF;
  IF public.is_campaign_system(v_campaign_id, auth.uid()) IS NOT TRUE THEN
    RAISE EXCEPTION 'WARDEN_TAMED_HP_REQUIRED' USING ERRCODE = '42501';
  END IF;
  UPDATE public.campaign_tamed_anomalies
  SET current_hp = p_current_hp WHERE id = p_tamed_id;
  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.remove_campaign_tamed_anomaly(
  p_tamed_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_campaign_id UUID;
BEGIN
  SELECT campaign_id INTO v_campaign_id
  FROM public.campaign_tamed_anomalies WHERE id = p_tamed_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'TAMED_ANOMALY_NOT_FOUND' USING ERRCODE = '22023';
  END IF;
  IF public.is_campaign_system(v_campaign_id, auth.uid()) IS NOT TRUE THEN
    RAISE EXCEPTION 'WARDEN_TAMED_REMOVAL_REQUIRED' USING ERRCODE = '42501';
  END IF;
  DELETE FROM public.campaign_tamed_anomalies WHERE id = p_tamed_id;
  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.set_campaign_tamed_hp(UUID, INTEGER)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.remove_campaign_tamed_anomaly(UUID)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.set_campaign_tamed_hp(UUID, INTEGER)
  TO authenticated;
GRANT EXECUTE ON FUNCTION public.remove_campaign_tamed_anomaly(UUID)
  TO authenticated;

COMMIT;
