-- M2: each harvest yield is explicitly approved by a Warden. The server owns
-- canonical anomaly rank, fixed DCs, the die roll, inventory credit, and retry
-- receipt. One authorization permits one attempt; a failed retry needs a new
-- Warden authorization rather than an invented universal recovery rule.
BEGIN;

CREATE TABLE public.harvest_authorizations_m2 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  source_kind TEXT NOT NULL CHECK (source_kind IN ('canonical-anomaly', 'warden-source')),
  source_id TEXT NOT NULL,
  source_revision TEXT NOT NULL,
  source_rank TEXT NOT NULL CHECK (source_rank IN ('E', 'D', 'C', 'B', 'A', 'S')),
  source_note TEXT NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('core', 'bulk', 'precision')),
  material_definition_id TEXT NOT NULL REFERENCES public.material_definitions(id),
  approved_quantity NUMERIC(20,6) NOT NULL CHECK (
    approved_quantity > 0 AND approved_quantity = trunc(approved_quantity)
  ),
  approved_grade TEXT NOT NULL CHECK (
    approved_grade IN ('Basic', 'Quality', 'Rare', 'Exotic', 'Legendary', 'Regent')
  ),
  dc INTEGER NOT NULL CHECK (dc BETWEEN 1 AND 100),
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
  tool_kind TEXT NOT NULL CHECK (
    tool_kind IN ('harvesting-kit', 'field-extraction-rig', 'approved-equivalent')
  ),
  tool_evidence TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'revoked')),
  approved_by_user_id UUID NOT NULL,
  approval_operation_id TEXT NOT NULL,
  approval_fingerprint TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ,
  UNIQUE (approved_by_user_id, approval_operation_id)
);

CREATE INDEX harvest_authorizations_m2_character_idx
  ON public.harvest_authorizations_m2(character_id, status, created_at DESC);

CREATE TABLE public.harvest_attempts_m2 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  authorization_id UUID NOT NULL UNIQUE REFERENCES public.harvest_authorizations_m2(id),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  actor_user_id UUID NOT NULL,
  operation_id TEXT NOT NULL,
  fingerprint TEXT NOT NULL,
  skill TEXT NOT NULL CHECK (skill IN ('Medicine', 'Survival')),
  roll INTEGER NOT NULL CHECK (roll BETWEEN 1 AND 20),
  intelligence_modifier INTEGER NOT NULL,
  proficiency_bonus INTEGER NOT NULL,
  total INTEGER NOT NULL,
  dc INTEGER NOT NULL,
  success BOOLEAN NOT NULL,
  lot_id UUID REFERENCES public.material_lots(id) ON DELETE SET NULL,
  result JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (actor_user_id, operation_id),
  CONSTRAINT harvest_attempt_result_shape CHECK (success OR lot_id IS NULL)
);

CREATE INDEX harvest_attempts_m2_character_idx
  ON public.harvest_attempts_m2(character_id, created_at DESC);

ALTER TABLE public.harvest_authorizations_m2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.harvest_attempts_m2 ENABLE ROW LEVEL SECURITY;

CREATE POLICY harvest_authorizations_m2_read
ON public.harvest_authorizations_m2 FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.characters AS character_row
    WHERE character_row.id = harvest_authorizations_m2.character_id
      AND character_row.user_id = auth.uid()
  ) OR public.is_campaign_system(harvest_authorizations_m2.campaign_id, auth.uid())
);

CREATE POLICY harvest_attempts_m2_read
ON public.harvest_attempts_m2 FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.characters AS character_row
    WHERE character_row.id = harvest_attempts_m2.character_id
      AND character_row.user_id = auth.uid()
  ) OR public.is_campaign_system(harvest_attempts_m2.campaign_id, auth.uid())
);

REVOKE ALL ON public.harvest_authorizations_m2 FROM PUBLIC, anon, authenticated;
REVOKE ALL ON public.harvest_attempts_m2 FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.harvest_authorizations_m2 TO authenticated;
GRANT SELECT ON public.harvest_attempts_m2 TO authenticated;

CREATE OR REPLACE FUNCTION public.approve_harvest_yield_m2(
  p_campaign_id UUID,
  p_character_id UUID,
  p_source_kind TEXT,
  p_source_id TEXT,
  p_source_rank TEXT,
  p_source_note TEXT,
  p_method TEXT,
  p_material_definition_id TEXT,
  p_quantity NUMERIC,
  p_duration_minutes INTEGER,
  p_tool_kind TEXT,
  p_tool_evidence TEXT,
  p_warden_dc INTEGER,
  p_operation_id TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_source_revision TEXT;
  v_rank TEXT;
  v_grade TEXT;
  v_definition_grade TEXT;
  v_dc INTEGER;
  v_fingerprint TEXT;
  v_prior public.harvest_authorizations_m2%ROWTYPE;
  v_id UUID;
BEGIN
  IF v_actor IS NULL OR public.is_campaign_system(p_campaign_id, v_actor) IS NOT TRUE THEN
    RAISE EXCEPTION 'WARDEN_HARVEST_APPROVAL_REQUIRED' USING ERRCODE = '42501';
  END IF;
  IF NOT app_private.companion_character_in_campaign(p_campaign_id, p_character_id) THEN
    RAISE EXCEPTION 'CHARACTER_NOT_IN_CAMPAIGN' USING ERRCODE = '42501';
  END IF;
  IF length(COALESCE(p_operation_id, '')) NOT BETWEEN 8 AND 200 THEN
    RAISE EXCEPTION 'INVALID_OPERATION_ID' USING ERRCODE = '22023';
  END IF;
  IF length(btrim(COALESCE(p_source_id, ''))) NOT BETWEEN 1 AND 200
    OR length(btrim(COALESCE(p_source_note, ''))) < 8
    OR length(btrim(COALESCE(p_tool_evidence, ''))) < 8
  THEN
    RAISE EXCEPTION 'HARVEST_SOURCE_AND_TOOL_EVIDENCE_REQUIRED' USING ERRCODE = '22023';
  END IF;
  IF p_quantity IS NULL OR p_quantity <= 0 OR p_quantity > 1000000
    OR p_quantity <> trunc(p_quantity)
  THEN
    RAISE EXCEPTION 'INVALID_HARVEST_YIELD' USING ERRCODE = '22023';
  END IF;
  IF p_tool_kind NOT IN (
    'harvesting-kit', 'field-extraction-rig', 'approved-equivalent'
  ) THEN
    RAISE EXCEPTION 'HARVEST_TOOL_REQUIRED' USING ERRCODE = '22023';
  END IF;

  IF p_source_kind = 'canonical-anomaly' THEN
    SELECT source.rank, source.source_revision
    INTO v_rank, v_source_revision
    FROM app_private.canonical_companion_sources AS source
    WHERE source.source_collection = 'anomalies'
      AND source.source_id = p_source_id;
    IF NOT FOUND OR v_rank IS NULL OR v_rank NOT IN ('E','D','C','B','A','S') THEN
      RAISE EXCEPTION 'CANONICAL_HARVEST_SOURCE_REQUIRED' USING ERRCODE = '22023';
    END IF;
    IF p_source_rank IS NOT NULL AND p_source_rank IS DISTINCT FROM v_rank THEN
      RAISE EXCEPTION 'HARVEST_RANK_MISMATCH' USING ERRCODE = '22023';
    END IF;
  ELSIF p_source_kind = 'warden-source' THEN
    v_rank := p_source_rank;
    v_source_revision := 'warden-authored-m2-v1';
    IF v_rank IS NULL OR v_rank NOT IN ('E','D','C','B','A','S') THEN
      RAISE EXCEPTION 'WARDEN_HARVEST_RANK_REQUIRED' USING ERRCODE = '22023';
    END IF;
  ELSE
    RAISE EXCEPTION 'INVALID_HARVEST_SOURCE_KIND' USING ERRCODE = '22023';
  END IF;

  IF p_method = 'core' THEN
    IF p_source_kind <> 'canonical-anomaly' OR p_duration_minutes <> 1
      OR (p_warden_dc IS NOT NULL AND p_warden_dc <> 15)
    THEN
      RAISE EXCEPTION 'INVALID_CORE_EXTRACTION_PROCEDURE' USING ERRCODE = '22023';
    END IF;
    v_dc := 15;
  ELSIF p_method = 'bulk' THEN
    v_dc := CASE v_rank
      WHEN 'E' THEN 10 WHEN 'D' THEN 12 WHEN 'C' THEN 15
      WHEN 'B' THEN 18 WHEN 'A' THEN 21 ELSE NULL END;
  ELSIF p_method = 'precision' THEN
    v_dc := CASE v_rank
      WHEN 'E' THEN 12 WHEN 'D' THEN 15 WHEN 'C' THEN 18
      WHEN 'B' THEN 21 ELSE NULL END;
  ELSE
    RAISE EXCEPTION 'INVALID_HARVEST_METHOD' USING ERRCODE = '22023';
  END IF;

  IF p_duration_minutes IS NULL OR p_duration_minutes < 1 THEN
    RAISE EXCEPTION 'HARVEST_DURATION_REQUIRED' USING ERRCODE = '22023';
  END IF;
  IF v_dc IS NULL THEN
    IF p_warden_dc IS NULL OR p_warden_dc < 21 OR p_warden_dc > 100 THEN
      RAISE EXCEPTION 'WARDEN_HARVEST_DC_REQUIRED' USING ERRCODE = '22023';
    END IF;
    v_dc := p_warden_dc;
  ELSIF p_warden_dc IS NOT NULL AND p_warden_dc <> v_dc THEN
    RAISE EXCEPTION 'HARVEST_FIXED_DC_MISMATCH' USING ERRCODE = '22023';
  END IF;

  v_grade := CASE v_rank
    WHEN 'E' THEN 'Basic' WHEN 'D' THEN 'Quality'
    WHEN 'C' THEN 'Rare' WHEN 'B' THEN 'Exotic'
    WHEN 'A' THEN 'Legendary' ELSE 'Regent' END;

  SELECT definition.grade INTO v_definition_grade
  FROM public.material_definitions AS definition
  WHERE definition.id = p_material_definition_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'HARVEST_MATERIAL_NOT_FOUND' USING ERRCODE = '22023';
  END IF;
  IF v_definition_grade IS NOT NULL AND v_definition_grade <> v_grade THEN
    RAISE EXCEPTION 'HARVEST_MATERIAL_GRADE_MISMATCH' USING ERRCODE = '22023';
  END IF;

  v_fingerprint := md5(jsonb_build_object(
    'campaign', p_campaign_id, 'character', p_character_id,
    'sourceKind', p_source_kind, 'sourceId', p_source_id,
    'rank', v_rank, 'sourceNote', p_source_note,
    'method', p_method, 'material', p_material_definition_id,
    'quantity', p_quantity, 'duration', p_duration_minutes,
    'toolKind', p_tool_kind, 'toolEvidence', p_tool_evidence,
    'dc', v_dc
  )::TEXT);
  PERFORM pg_advisory_xact_lock(hashtextextended(v_actor::TEXT || ':' || p_operation_id, 0));
  SELECT * INTO v_prior
  FROM public.harvest_authorizations_m2
  WHERE approved_by_user_id = v_actor AND approval_operation_id = p_operation_id;
  IF FOUND THEN
    IF v_prior.approval_fingerprint <> v_fingerprint THEN
      RAISE EXCEPTION 'HARVEST_APPROVAL_OPERATION_CONFLICT' USING ERRCODE = '22023';
    END IF;
    RETURN v_prior.id;
  END IF;

  INSERT INTO public.harvest_authorizations_m2 (
    campaign_id, character_id, source_kind, source_id, source_revision,
    source_rank, source_note, method, material_definition_id,
    approved_quantity, approved_grade, dc, duration_minutes,
    tool_kind, tool_evidence, approved_by_user_id,
    approval_operation_id, approval_fingerprint
  ) VALUES (
    p_campaign_id, p_character_id, p_source_kind, p_source_id,
    v_source_revision, v_rank, p_source_note, p_method,
    p_material_definition_id, p_quantity, v_grade, v_dc,
    p_duration_minutes, p_tool_kind, p_tool_evidence, v_actor,
    p_operation_id, v_fingerprint
  ) RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.revoke_harvest_approval_m2(
  p_authorization_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_authorization public.harvest_authorizations_m2%ROWTYPE;
BEGIN
  SELECT * INTO v_authorization
  FROM public.harvest_authorizations_m2
  WHERE id = p_authorization_id
  FOR UPDATE;
  IF NOT FOUND OR public.is_campaign_system(
    v_authorization.campaign_id, auth.uid()
  ) IS NOT TRUE THEN
    RAISE EXCEPTION 'WARDEN_HARVEST_APPROVAL_REQUIRED' USING ERRCODE = '42501';
  END IF;
  IF v_authorization.status = 'resolved' THEN
    RAISE EXCEPTION 'HARVEST_ALREADY_RESOLVED' USING ERRCODE = '22023';
  END IF;
  UPDATE public.harvest_authorizations_m2
  SET status = 'revoked'
  WHERE id = p_authorization_id AND status = 'open';
  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.resolve_harvest_attempt_m2(
  p_authorization_id UUID,
  p_skill TEXT,
  p_operation_id TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_authorization public.harvest_authorizations_m2%ROWTYPE;
  v_character public.characters%ROWTYPE;
  v_prior public.harvest_attempts_m2%ROWTYPE;
  v_score INTEGER;
  v_modifier INTEGER;
  v_proficiency INTEGER;
  v_roll INTEGER;
  v_total INTEGER;
  v_success BOOLEAN;
  v_attempt_id UUID := gen_random_uuid();
  v_lot_id UUID;
  v_result JSONB;
  v_fingerprint TEXT;
BEGIN
  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED' USING ERRCODE = '42501';
  END IF;
  IF p_skill NOT IN ('Medicine', 'Survival') THEN
    RAISE EXCEPTION 'INVALID_HARVEST_SKILL' USING ERRCODE = '22023';
  END IF;
  IF length(COALESCE(p_operation_id, '')) NOT BETWEEN 8 AND 200 THEN
    RAISE EXCEPTION 'INVALID_OPERATION_ID' USING ERRCODE = '22023';
  END IF;
  v_fingerprint := md5(jsonb_build_object(
    'authorization', p_authorization_id, 'skill', p_skill
  )::TEXT);
  PERFORM pg_advisory_xact_lock(hashtextextended(v_actor::TEXT || ':' || p_operation_id, 0));
  SELECT * INTO v_prior
  FROM public.harvest_attempts_m2
  WHERE actor_user_id = v_actor AND operation_id = p_operation_id;
  IF FOUND THEN
    IF v_prior.fingerprint <> v_fingerprint THEN
      RAISE EXCEPTION 'HARVEST_OPERATION_CONFLICT' USING ERRCODE = '22023';
    END IF;
    RETURN v_prior.result;
  END IF;

  SELECT * INTO v_authorization
  FROM public.harvest_authorizations_m2
  WHERE id = p_authorization_id
  FOR UPDATE;
  IF NOT FOUND OR v_authorization.status <> 'open' THEN
    RAISE EXCEPTION 'HARVEST_AUTHORIZATION_UNAVAILABLE' USING ERRCODE = '22023';
  END IF;
  SELECT * INTO v_character
  FROM public.characters
  WHERE id = v_authorization.character_id
  FOR UPDATE;
  IF NOT FOUND OR v_character.user_id IS DISTINCT FROM v_actor THEN
    RAISE EXCEPTION 'HARVEST_CHARACTER_OWNER_REQUIRED' USING ERRCODE = '42501';
  END IF;
  IF NOT app_private.companion_character_in_campaign(
    v_authorization.campaign_id, v_character.id
  ) THEN
    RAISE EXCEPTION 'CHARACTER_NOT_IN_CAMPAIGN' USING ERRCODE = '42501';
  END IF;

  SELECT ability_row.score INTO v_score
  FROM public.character_abilities AS ability_row
  WHERE ability_row.character_id = v_character.id AND ability_row.ability = 'INT';
  IF v_score IS NULL THEN
    RAISE EXCEPTION 'HARVEST_INT_SCORE_REQUIRED' USING ERRCODE = '22023';
  END IF;
  v_modifier := floor((v_score - 10)::NUMERIC / 2)::INTEGER;
  v_proficiency := CASE
    WHEN EXISTS (
      SELECT 1 FROM unnest(COALESCE(v_character.skill_expertise, ARRAY[]::TEXT[])) AS skill(value)
      WHERE lower(skill.value) = lower(p_skill)
    ) THEN 2 * v_character.proficiency_bonus
    WHEN EXISTS (
      SELECT 1 FROM unnest(COALESCE(v_character.skill_proficiencies, ARRAY[]::TEXT[])) AS skill(value)
      WHERE lower(skill.value) = lower(p_skill)
    ) THEN v_character.proficiency_bonus
    ELSE 0 END;
  v_roll := floor(random() * 20)::INTEGER + 1;
  v_total := v_roll + v_modifier + v_proficiency;
  v_success := v_total >= v_authorization.dc;

  IF v_success THEN
    v_lot_id := gen_random_uuid();
    INSERT INTO public.material_lots (
      id, material_definition_id, owner_scope, owner_character_id,
      quantity, unit, grade, provenance_status, provenance_metadata
    )
    SELECT
      v_lot_id, v_authorization.material_definition_id,
      'character', v_character.id, v_authorization.approved_quantity,
      definition.unit, v_authorization.approved_grade, 'harvested',
      jsonb_build_object(
        'harvestAuthorizationId', v_authorization.id,
        'harvestAttemptId', v_attempt_id,
        'sourceKind', v_authorization.source_kind,
        'sourceId', v_authorization.source_id,
        'sourceRevision', v_authorization.source_revision,
        'sourceRank', v_authorization.source_rank,
        'method', v_authorization.method,
        'toolKind', v_authorization.tool_kind,
        'durationMinutes', v_authorization.duration_minutes
      )
    FROM public.material_definitions AS definition
    WHERE definition.id = v_authorization.material_definition_id;
  END IF;

  v_result := jsonb_build_object(
    'authorization_id', v_authorization.id,
    'attempt_id', v_attempt_id,
    'success', v_success,
    'roll', v_roll,
    'intelligence_modifier', v_modifier,
    'proficiency_bonus', v_proficiency,
    'total', v_total,
    'dc', v_authorization.dc,
    'lot_id', v_lot_id
  );
  INSERT INTO public.harvest_attempts_m2 (
    id, authorization_id, campaign_id, character_id, actor_user_id,
    operation_id, fingerprint, skill, roll, intelligence_modifier,
    proficiency_bonus, total, dc, success, lot_id, result
  ) VALUES (
    v_attempt_id, v_authorization.id, v_authorization.campaign_id,
    v_character.id, v_actor, p_operation_id, v_fingerprint,
    p_skill, v_roll, v_modifier, v_proficiency, v_total,
    v_authorization.dc, v_success, v_lot_id, v_result
  );
  UPDATE public.harvest_authorizations_m2
  SET status = 'resolved', resolved_at = now()
  WHERE id = v_authorization.id;
  RETURN v_result;
END;
$$;

REVOKE ALL ON FUNCTION public.approve_harvest_yield_m2(
  UUID, UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, NUMERIC,
  INTEGER, TEXT, TEXT, INTEGER, TEXT
) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.resolve_harvest_attempt_m2(UUID, TEXT, TEXT)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.revoke_harvest_approval_m2(UUID)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.approve_harvest_yield_m2(
  UUID, UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, NUMERIC,
  INTEGER, TEXT, TEXT, INTEGER, TEXT
) TO authenticated;
GRANT EXECUTE ON FUNCTION public.resolve_harvest_attempt_m2(UUID, TEXT, TEXT)
  TO authenticated;
GRANT EXECUTE ON FUNCTION public.revoke_harvest_approval_m2(UUID)
  TO authenticated;

COMMIT;
NOTIFY pgrst, 'reload schema';
