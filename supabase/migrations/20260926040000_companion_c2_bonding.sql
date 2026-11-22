-- C2: authoritative contextual tame/bond attempts, durable adjudication/history,
-- and serialized controller claim/release.
--
-- C2 intentionally does NOT define E/unknown-rank bonding, automatic rest
-- retries, combat turns, companion progression, mounting, healing, or downed
-- behavior. Those remain either Warden adjudication (C2) or C3 profile rules.

BEGIN;

-- ---------------------------------------------------------------------------
-- Durable campaign-state history. These rows are intentionally campaign-owned
-- and are not part of personal character export/import.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.companion_bond_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  companion_instance_id UUID REFERENCES public.companion_instances(id) ON DELETE CASCADE,
  target_source_id TEXT NOT NULL,
  target_rank TEXT,
  attempt_kind TEXT NOT NULL,
  attempt_chain_id UUID NOT NULL DEFAULT gen_random_uuid(),
  retry_of_attempt_id UUID REFERENCES public.companion_bond_attempts(id) ON DELETE SET NULL,
  adjudication_id UUID,
  roll_mode TEXT NOT NULL,
  roll_primary INTEGER,
  roll_secondary INTEGER,
  selected_roll INTEGER,
  ability TEXT NOT NULL DEFAULT 'PRE',
  ability_modifier INTEGER NOT NULL DEFAULT 0,
  proficiency_source_id TEXT,
  proficiency_bonus INTEGER NOT NULL DEFAULT 0,
  specialization_source_id TEXT,
  specialization_bonus INTEGER NOT NULL DEFAULT 0,
  dc INTEGER,
  total INTEGER,
  outcome TEXT NOT NULL,
  invalid_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT companion_bond_attempt_kind_check
    CHECK (attempt_kind IN ('tame', 'bond')),
  CONSTRAINT companion_bond_attempt_roll_mode_check
    CHECK (roll_mode IN ('normal', 'advantage', 'disadvantage')),
  CONSTRAINT companion_bond_attempt_ability_check CHECK (ability = 'PRE'),
  CONSTRAINT companion_bond_attempt_specialization_check
    CHECK (specialization_bonus IN (0, 2)),
  CONSTRAINT companion_bond_attempt_outcome_check
    CHECK (outcome IN ('success', 'failure', 'invalid')),
  CONSTRAINT companion_bond_attempt_roll_primary_check
    CHECK (roll_primary IS NULL OR roll_primary BETWEEN 1 AND 20),
  CONSTRAINT companion_bond_attempt_roll_secondary_check
    CHECK (roll_secondary IS NULL OR roll_secondary BETWEEN 1 AND 20),
  CONSTRAINT companion_bond_attempt_selected_roll_check
    CHECK (selected_roll IS NULL OR selected_roll BETWEEN 1 AND 20)
);

CREATE INDEX IF NOT EXISTS companion_bond_attempts_campaign_idx
  ON public.companion_bond_attempts(campaign_id, created_at DESC);
CREATE INDEX IF NOT EXISTS companion_bond_attempts_instance_idx
  ON public.companion_bond_attempts(companion_instance_id, created_at DESC)
  WHERE companion_instance_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS companion_bond_attempts_character_idx
  ON public.companion_bond_attempts(character_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.companion_attempt_adjudications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  companion_instance_id UUID REFERENCES public.companion_instances(id) ON DELETE CASCADE,
  target_source_id TEXT NOT NULL,
  attempt_kind TEXT NOT NULL,
  roll_mode TEXT NOT NULL DEFAULT 'normal',
  proficiency_mode TEXT NOT NULL DEFAULT 'default',
  specialization_mode TEXT NOT NULL DEFAULT 'default',
  retry_of_attempt_id UUID REFERENCES public.companion_bond_attempts(id) ON DELETE SET NULL,
  reason TEXT,
  created_by_user_id UUID NOT NULL,
  consumed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT companion_attempt_adjudication_kind_check
    CHECK (attempt_kind IN ('tame', 'bond')),
  CONSTRAINT companion_attempt_adjudication_roll_mode_check
    CHECK (roll_mode IN ('normal', 'advantage', 'disadvantage')),
  CONSTRAINT companion_attempt_adjudication_prof_check
    CHECK (proficiency_mode IN ('default', 'apply', 'suppress')),
  CONSTRAINT companion_attempt_adjudication_specialization_check
    CHECK (specialization_mode IN ('default', 'apply', 'suppress'))
);

ALTER TABLE public.companion_bond_attempts
  DROP CONSTRAINT IF EXISTS companion_bond_attempts_adjudication_id_fkey,
  ADD CONSTRAINT companion_bond_attempts_adjudication_id_fkey
    FOREIGN KEY (adjudication_id)
    REFERENCES public.companion_attempt_adjudications(id)
    ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS companion_attempt_adjudications_campaign_idx
  ON public.companion_attempt_adjudications(campaign_id, created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS companion_attempt_adjudications_retry_once_idx
  ON public.companion_attempt_adjudications(retry_of_attempt_id)
  WHERE retry_of_attempt_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.companion_bonds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  companion_instance_id UUID NOT NULL REFERENCES public.companion_instances(id) ON DELETE CASCADE,
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  created_by_attempt_id UUID REFERENCES public.companion_bond_attempts(id) ON DELETE SET NULL,
  bonded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  released_at TIMESTAMPTZ,
  release_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS companion_bonds_active_pair_idx
  ON public.companion_bonds(companion_instance_id, character_id)
  WHERE released_at IS NULL;
CREATE INDEX IF NOT EXISTS companion_bonds_campaign_idx
  ON public.companion_bonds(campaign_id, bonded_at DESC);

CREATE TABLE IF NOT EXISTS public.companion_control_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  tamed_anomaly_id UUID NOT NULL REFERENCES public.campaign_tamed_anomalies(id) ON DELETE CASCADE,
  companion_instance_id UUID NOT NULL REFERENCES public.companion_instances(id) ON DELETE CASCADE,
  actor_user_id UUID NOT NULL,
  actor_character_id UUID REFERENCES public.characters(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  previous_controller_character_id UUID REFERENCES public.characters(id) ON DELETE SET NULL,
  next_controller_character_id UUID REFERENCES public.characters(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT companion_control_event_type_check
    CHECK (event_type IN ('claim', 'release'))
);

CREATE INDEX IF NOT EXISTS companion_control_events_campaign_idx
  ON public.companion_control_events(campaign_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- Read visibility mirrors campaign membership. Mutations are RPC-only.
-- ---------------------------------------------------------------------------

ALTER TABLE public.companion_bond_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companion_attempt_adjudications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companion_bonds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companion_control_events ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
  v_table TEXT;
  v_policy TEXT;
BEGIN
  FOREACH v_table IN ARRAY ARRAY[
    'companion_bond_attempts',
    'companion_attempt_adjudications',
    'companion_bonds',
    'companion_control_events'
  ]
  LOOP
    v_policy := v_table || '_select';
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', v_policy, v_table);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR SELECT TO authenticated USING (' ||
      'EXISTS (SELECT 1 FROM public.campaign_members AS member_row ' ||
      'WHERE member_row.campaign_id = %I.campaign_id AND member_row.user_id = (SELECT auth.uid())) ' ||
      'OR EXISTS (SELECT 1 FROM public.campaigns AS campaign_row ' ||
      'WHERE campaign_row.id = %I.campaign_id AND campaign_row.warden_id = (SELECT auth.uid()))' ||
      ')',
      v_policy, v_table, v_table, v_table
    );
  END LOOP;
END;
$$;

REVOKE INSERT, UPDATE, DELETE ON public.companion_bond_attempts
  FROM PUBLIC, anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.companion_attempt_adjudications
  FROM PUBLIC, anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.companion_bonds
  FROM PUBLIC, anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.companion_control_events
  FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.companion_bond_attempts TO authenticated;
GRANT SELECT ON public.companion_attempt_adjudications TO authenticated;
GRANT SELECT ON public.companion_bonds TO authenticated;
GRANT SELECT ON public.companion_control_events TO authenticated;

-- Controller mapping becomes RPC-owned while existing HP/condition/note writes
-- remain available under the table's existing RLS policy.
REVOKE UPDATE ON public.campaign_tamed_anomalies FROM authenticated;
GRANT UPDATE (
  nickname, current_hp, max_hp_override, bond_level, conditions,
  notes, initiative, is_summoned, updated_at
) ON public.campaign_tamed_anomalies TO authenticated;

-- ---------------------------------------------------------------------------
-- Authoritative source-backed rule helpers.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION app_private.companion_bonding_dc(p_rank TEXT)
RETURNS INTEGER
LANGUAGE sql
IMMUTABLE
SET search_path = pg_catalog
AS $$
  SELECT CASE upper(btrim(COALESCE(p_rank, '')))
    WHEN 'D' THEN 12
    WHEN 'C' THEN 14
    WHEN 'B' THEN 16
    WHEN 'A' THEN 18
    WHEN 'S' THEN 20
    ELSE NULL
  END;
$$;

CREATE OR REPLACE FUNCTION app_private.companion_normalize_skill(p_value TEXT)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
SET search_path = pg_catalog
AS $$
  SELECT regexp_replace(
    replace(replace(lower(btrim(COALESCE(p_value, ''))), '_', ' '), '-', ' '),
    '\s+', ' ', 'g'
  );
$$;

CREATE OR REPLACE FUNCTION app_private.companion_has_beast_taming(
  p_character_id UUID
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.characters AS character_row,
    LATERAL unnest(
      COALESCE(character_row.skill_proficiencies, ARRAY[]::TEXT[])
      || COALESCE(character_row.skill_expertise, ARRAY[]::TEXT[])
    ) AS skill_name
    WHERE character_row.id = p_character_id
      AND app_private.companion_normalize_skill(skill_name) IN (
        'animal handling', 'animal handling', 'beast taming'
      )
  );
$$;

CREATE OR REPLACE FUNCTION app_private.companion_specialization_source(
  p_character_id UUID
)
RETURNS TEXT
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_job TEXT;
  v_job_id TEXT;
  v_path TEXT;
  v_path_id TEXT;
BEGIN
  SELECT
    character_row.job,
    character_row.job_id::TEXT,
    character_row.path,
    character_row.path_id::TEXT
  INTO v_job, v_job_id, v_path, v_path_id
  FROM public.characters AS character_row
  WHERE character_row.id = p_character_id;

  IF v_path_id IS NOT NULL AND COALESCE(v_path, '') ~* (
    'pack[ -]?leader|biome[ -]?bond|pact[ -]?of[ -]?the[ -]?chain|' ||
    'entity[ -]?shift|synchronist[ -]?binary|hive[ -]?synchronist'
  ) THEN
    RETURN v_path_id;
  END IF;

  IF v_job_id IS NOT NULL
     AND lower(btrim(COALESCE(v_job, ''))) IN ('summoner', 'contractor', 'esper') THEN
    RETURN v_job_id;
  END IF;

  RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION app_private.companion_character_in_campaign(
  p_campaign_id UUID,
  p_character_id UUID
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.characters AS character_row
    WHERE character_row.id = p_character_id
      AND (
        EXISTS (
          SELECT 1 FROM public.campaign_members AS member_row
          WHERE member_row.campaign_id = p_campaign_id
            AND member_row.user_id = character_row.user_id
        )
        OR EXISTS (
          SELECT 1 FROM public.campaigns AS campaign_row
          WHERE campaign_row.id = p_campaign_id
            AND campaign_row.warden_id = character_row.user_id
        )
      )
  );
$$;

CREATE OR REPLACE FUNCTION app_private.companion_resolve_check(
  p_character_id UUID,
  p_rank TEXT,
  p_roll_mode TEXT,
  p_roll_primary INTEGER,
  p_roll_secondary INTEGER,
  p_proficiency_mode TEXT,
  p_specialization_mode TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_dc INTEGER := app_private.companion_bonding_dc(p_rank);
  v_level INTEGER;
  v_pre INTEGER;
  v_pre_mod INTEGER;
  v_has_prof BOOLEAN := app_private.companion_has_beast_taming(p_character_id);
  v_spec_source TEXT := app_private.companion_specialization_source(p_character_id);
  v_prof_applies BOOLEAN;
  v_spec_applies BOOLEAN;
  v_pb INTEGER := 0;
  v_spec_bonus INTEGER := 0;
  v_selected INTEGER;
  v_total INTEGER;
BEGIN
  SELECT COALESCE(character_row.level, 1), COALESCE(character_row.pre, 10)
  INTO v_level, v_pre
  FROM public.characters AS character_row
  WHERE character_row.id = p_character_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('valid', false, 'reason', 'CHARACTER_NOT_FOUND');
  END IF;

  IF v_dc IS NULL THEN
    RETURN jsonb_build_object(
      'valid', false,
      'reason', 'UNSUPPORTED_TARGET_RANK',
      'rank', NULLIF(upper(btrim(COALESCE(p_rank, ''))), '')
    );
  END IF;

  IF p_roll_mode NOT IN ('normal', 'advantage', 'disadvantage') THEN
    RETURN jsonb_build_object('valid', false, 'reason', 'INVALID_ROLL_MODE', 'dc', v_dc);
  END IF;
  IF p_proficiency_mode NOT IN ('default', 'apply', 'suppress')
     OR p_specialization_mode NOT IN ('default', 'apply', 'suppress') THEN
    RETURN jsonb_build_object('valid', false, 'reason', 'INVALID_ADJUDICATION_MODE', 'dc', v_dc);
  END IF;
  IF p_roll_primary IS NULL OR p_roll_primary < 1 OR p_roll_primary > 20 THEN
    RETURN jsonb_build_object('valid', false, 'reason', 'ROLL_OUT_OF_RANGE', 'dc', v_dc);
  END IF;
  IF p_roll_mode <> 'normal'
     AND (p_roll_secondary IS NULL OR p_roll_secondary < 1 OR p_roll_secondary > 20) THEN
    RETURN jsonb_build_object('valid', false, 'reason', 'SECOND_ROLL_REQUIRED', 'dc', v_dc);
  END IF;

  IF p_proficiency_mode = 'apply' AND NOT v_has_prof THEN
    RETURN jsonb_build_object('valid', false, 'reason', 'PROFICIENCY_SOURCE_REQUIRED', 'dc', v_dc);
  END IF;
  IF p_specialization_mode = 'apply' AND v_spec_source IS NULL THEN
    RETURN jsonb_build_object('valid', false, 'reason', 'SPECIALIZATION_SOURCE_REQUIRED', 'dc', v_dc);
  END IF;

  v_prof_applies := CASE p_proficiency_mode
    WHEN 'suppress' THEN false
    WHEN 'apply' THEN true
    ELSE v_has_prof
  END;
  v_spec_applies := CASE p_specialization_mode
    WHEN 'suppress' THEN false
    WHEN 'apply' THEN true
    ELSE v_spec_source IS NOT NULL
  END;

  v_pre_mod := floor((v_pre - 10)::NUMERIC / 2)::INTEGER;
  IF v_prof_applies THEN
    -- PB applies exactly once for C2. Expertise establishes applicability but
    -- does not double PB because this procedure does not define expertise.
    v_pb := ceil(GREATEST(v_level, 1)::NUMERIC / 4)::INTEGER + 1;
  END IF;
  IF v_spec_applies THEN
    v_spec_bonus := 2;
  END IF;

  v_selected := CASE p_roll_mode
    WHEN 'advantage' THEN GREATEST(p_roll_primary, p_roll_secondary)
    WHEN 'disadvantage' THEN LEAST(p_roll_primary, p_roll_secondary)
    ELSE p_roll_primary
  END;
  v_total := v_selected + v_pre_mod + v_pb + v_spec_bonus;

  RETURN jsonb_build_object(
    'valid', true,
    'rank', upper(btrim(p_rank)),
    'dc', v_dc,
    'selected_roll', v_selected,
    'ability', 'PRE',
    'ability_modifier', v_pre_mod,
    'proficiency_source_id', CASE WHEN v_prof_applies THEN 'animal-handling' ELSE NULL END,
    'proficiency_bonus', v_pb,
    'specialization_source_id', CASE WHEN v_spec_applies THEN v_spec_source ELSE NULL END,
    'specialization_bonus', v_spec_bonus,
    'total', v_total,
    'success', v_total >= v_dc
  );
END;
$$;

REVOKE ALL ON FUNCTION app_private.companion_bonding_dc(TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.companion_normalize_skill(TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.companion_has_beast_taming(UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.companion_specialization_source(UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.companion_character_in_campaign(UUID, UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.companion_resolve_check(UUID, TEXT, TEXT, INTEGER, INTEGER, TEXT, TEXT)
  FROM PUBLIC, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Warden/co-Warden one-shot adjudication. This is the only way C2 grants
-- advantage/disadvantage, forces/suppresses PB/specialization, or authorizes a
-- retry in the same attempt chain. Rest events never create adjudications.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.prepare_companion_attempt_adjudication(
  p_campaign_id UUID,
  p_character_id UUID,
  p_target_source_id TEXT,
  p_attempt_kind TEXT,
  p_companion_instance_id UUID DEFAULT NULL,
  p_roll_mode TEXT DEFAULT 'normal',
  p_proficiency_mode TEXT DEFAULT 'default',
  p_specialization_mode TEXT DEFAULT 'default',
  p_retry_of_attempt_id UUID DEFAULT NULL,
  p_reason TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_id UUID;
  v_prior public.companion_bond_attempts%ROWTYPE;
BEGIN
  IF v_actor IS NULL OR NOT public.is_campaign_system(p_campaign_id, v_actor) THEN
    RAISE EXCEPTION 'WARDEN_ADJUDICATION_REQUIRED' USING ERRCODE = '42501';
  END IF;
  IF NOT app_private.companion_character_in_campaign(p_campaign_id, p_character_id) THEN
    RAISE EXCEPTION 'CHARACTER_NOT_IN_CAMPAIGN' USING ERRCODE = '42501';
  END IF;
  IF NULLIF(btrim(p_target_source_id), '') IS NULL
     OR p_attempt_kind NOT IN ('tame', 'bond')
     OR p_roll_mode NOT IN ('normal', 'advantage', 'disadvantage')
     OR p_proficiency_mode NOT IN ('default', 'apply', 'suppress')
     OR p_specialization_mode NOT IN ('default', 'apply', 'suppress') THEN
    RAISE EXCEPTION 'INVALID_ADJUDICATION' USING ERRCODE = '22023';
  END IF;

  IF p_attempt_kind = 'bond' THEN
    IF p_companion_instance_id IS NULL OR NOT EXISTS (
      SELECT 1 FROM public.companion_instances AS instance
      WHERE instance.id = p_companion_instance_id
        AND instance.owner_scope = 'campaign'
        AND instance.owner_campaign_id = p_campaign_id
        AND instance.source_id IS NOT DISTINCT FROM p_target_source_id
    ) THEN
      RAISE EXCEPTION 'COMPANION_SOURCE_MISMATCH' USING ERRCODE = '22023';
    END IF;
  ELSIF p_companion_instance_id IS NOT NULL THEN
    RAISE EXCEPTION 'TAME_ATTEMPT_HAS_NO_INSTANCE_YET' USING ERRCODE = '22023';
  END IF;

  IF p_proficiency_mode = 'apply'
     AND NOT app_private.companion_has_beast_taming(p_character_id) THEN
    RAISE EXCEPTION 'PROFICIENCY_SOURCE_REQUIRED' USING ERRCODE = '22023';
  END IF;
  IF p_specialization_mode = 'apply'
     AND app_private.companion_specialization_source(p_character_id) IS NULL THEN
    RAISE EXCEPTION 'SPECIALIZATION_SOURCE_REQUIRED' USING ERRCODE = '22023';
  END IF;

  IF p_retry_of_attempt_id IS NOT NULL THEN
    SELECT * INTO v_prior
    FROM public.companion_bond_attempts AS attempt
    WHERE attempt.id = p_retry_of_attempt_id
    FOR UPDATE;
    IF NOT FOUND
       OR v_prior.campaign_id IS DISTINCT FROM p_campaign_id
       OR v_prior.character_id IS DISTINCT FROM p_character_id
       OR v_prior.target_source_id IS DISTINCT FROM p_target_source_id
       OR v_prior.attempt_kind IS DISTINCT FROM p_attempt_kind
       OR v_prior.companion_instance_id IS DISTINCT FROM p_companion_instance_id
       OR v_prior.outcome NOT IN ('failure', 'invalid') THEN
      RAISE EXCEPTION 'INVALID_RETRY_REFERENCE' USING ERRCODE = '22023';
    END IF;
  END IF;

  INSERT INTO public.companion_attempt_adjudications (
    campaign_id, character_id, companion_instance_id, target_source_id,
    attempt_kind, roll_mode, proficiency_mode, specialization_mode,
    retry_of_attempt_id, reason, created_by_user_id
  ) VALUES (
    p_campaign_id, p_character_id, p_companion_instance_id, btrim(p_target_source_id),
    p_attempt_kind, p_roll_mode, p_proficiency_mode, p_specialization_mode,
    p_retry_of_attempt_id, NULLIF(btrim(COALESCE(p_reason, '')), ''), v_actor
  ) RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

-- ---------------------------------------------------------------------------
-- Server-authoritative tame resolution. The frozen canonical source envelope
-- is required and its canonical id must agree with the requested source id.
-- The server derives DC, PRE modifier, PB, +2 source, roll selection and result.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.resolve_companion_tame_attempt_c2(
  p_campaign_id UUID,
  p_character_id UUID,
  p_anomaly_id TEXT,
  p_source_snapshot JSONB,
  p_roll_primary INTEGER,
  p_roll_secondary INTEGER DEFAULT NULL,
  p_adjudication_id UUID DEFAULT NULL,
  p_nickname TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_rank TEXT;
  v_hp INTEGER;
  v_roll_mode TEXT := 'normal';
  v_prof_mode TEXT := 'default';
  v_spec_mode TEXT := 'default';
  v_retry_id UUID;
  v_chain_id UUID := gen_random_uuid();
  v_adjudication public.companion_attempt_adjudications%ROWTYPE;
  v_prior public.companion_bond_attempts%ROWTYPE;
  v_check JSONB;
  v_attempt_id UUID;
  v_outcome TEXT;
  v_tamed_id UUID;
  v_instance_id UUID;
BEGIN
  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED' USING ERRCODE = '42501';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.characters AS character_row
    WHERE character_row.id = p_character_id AND character_row.user_id = v_actor
  ) THEN
    RAISE EXCEPTION 'NOT_OWNER' USING ERRCODE = '42501';
  END IF;
  IF NOT app_private.companion_character_in_campaign(p_campaign_id, p_character_id) THEN
    RAISE EXCEPTION 'CHARACTER_NOT_IN_CAMPAIGN' USING ERRCODE = '42501';
  END IF;

  IF p_source_snapshot IS NULL
     OR p_source_snapshot->>'kind' IS DISTINCT FROM 'canonical-compendium'
     OR p_source_snapshot#>>'{provenance,canonicalType}' IS DISTINCT FROM 'anomaly'
     OR p_source_snapshot#>>'{provenance,canonicalCollection}' IS DISTINCT FROM 'anomalies'
     OR p_source_snapshot#>>'{provenance,canonicalId}' IS DISTINCT FROM p_anomaly_id THEN
    v_rank := NULL;
    v_check := jsonb_build_object('valid', false, 'reason', 'CANONICAL_SOURCE_ID_MISMATCH');
  ELSE
    v_rank := p_source_snapshot#>>'{sourceFields,rank}';
    BEGIN
      v_hp := (p_source_snapshot#>>'{sourceFields,hpMax}')::INTEGER;
    EXCEPTION WHEN invalid_text_representation OR numeric_value_out_of_range THEN
      v_hp := NULL;
    END;
  END IF;

  IF p_adjudication_id IS NOT NULL THEN
    SELECT * INTO v_adjudication
    FROM public.companion_attempt_adjudications AS adjudication
    WHERE adjudication.id = p_adjudication_id
    FOR UPDATE;
    IF NOT FOUND
       OR v_adjudication.consumed_at IS NOT NULL
       OR v_adjudication.campaign_id IS DISTINCT FROM p_campaign_id
       OR v_adjudication.character_id IS DISTINCT FROM p_character_id
       OR v_adjudication.target_source_id IS DISTINCT FROM p_anomaly_id
       OR v_adjudication.attempt_kind <> 'tame'
       OR v_adjudication.companion_instance_id IS NOT NULL THEN
      RAISE EXCEPTION 'INVALID_OR_CONSUMED_ADJUDICATION' USING ERRCODE = '22023';
    END IF;
    v_roll_mode := v_adjudication.roll_mode;
    v_prof_mode := v_adjudication.proficiency_mode;
    v_spec_mode := v_adjudication.specialization_mode;
    v_retry_id := v_adjudication.retry_of_attempt_id;
    UPDATE public.companion_attempt_adjudications
    SET consumed_at = now()
    WHERE id = p_adjudication_id;
  END IF;

  IF v_retry_id IS NOT NULL THEN
    SELECT * INTO v_prior
    FROM public.companion_bond_attempts AS attempt
    WHERE attempt.id = v_retry_id;
    IF NOT FOUND OR v_prior.outcome NOT IN ('failure', 'invalid') THEN
      RAISE EXCEPTION 'INVALID_RETRY_REFERENCE' USING ERRCODE = '22023';
    END IF;
    v_chain_id := v_prior.attempt_chain_id;
  END IF;

  IF v_check IS NULL THEN
    IF v_hp IS NULL OR v_hp <= 0 THEN
      v_check := jsonb_build_object('valid', false, 'reason', 'INVALID_CANONICAL_SOURCE_STATS');
    ELSE
      v_check := app_private.companion_resolve_check(
        p_character_id, v_rank, v_roll_mode, p_roll_primary, p_roll_secondary,
        v_prof_mode, v_spec_mode
      );
    END IF;
  END IF;

  v_outcome := CASE
    WHEN COALESCE((v_check->>'valid')::BOOLEAN, false) = false THEN 'invalid'
    WHEN COALESCE((v_check->>'success')::BOOLEAN, false) THEN 'success'
    ELSE 'failure'
  END;

  INSERT INTO public.companion_bond_attempts (
    campaign_id, character_id, companion_instance_id, target_source_id,
    target_rank, attempt_kind, attempt_chain_id, retry_of_attempt_id,
    adjudication_id, roll_mode, roll_primary, roll_secondary, selected_roll,
    ability_modifier, proficiency_source_id, proficiency_bonus,
    specialization_source_id, specialization_bonus, dc, total,
    outcome, invalid_reason
  ) VALUES (
    p_campaign_id, p_character_id, NULL, p_anomaly_id,
    NULLIF(upper(btrim(COALESCE(v_rank, ''))), ''), 'tame', v_chain_id, v_retry_id,
    p_adjudication_id, v_roll_mode,
    CASE WHEN p_roll_primary BETWEEN 1 AND 20 THEN p_roll_primary ELSE NULL END,
    CASE WHEN p_roll_secondary BETWEEN 1 AND 20 THEN p_roll_secondary ELSE NULL END,
    NULLIF(v_check->>'selected_roll', '')::INTEGER,
    COALESCE(NULLIF(v_check->>'ability_modifier', '')::INTEGER, 0),
    NULLIF(v_check->>'proficiency_source_id', ''),
    COALESCE(NULLIF(v_check->>'proficiency_bonus', '')::INTEGER, 0),
    NULLIF(v_check->>'specialization_source_id', ''),
    COALESCE(NULLIF(v_check->>'specialization_bonus', '')::INTEGER, 0),
    NULLIF(v_check->>'dc', '')::INTEGER,
    NULLIF(v_check->>'total', '')::INTEGER,
    v_outcome,
    CASE WHEN v_outcome = 'invalid' THEN v_check->>'reason' ELSE NULL END
  ) RETURNING id INTO v_attempt_id;

  IF v_outcome = 'success' THEN
    INSERT INTO public.campaign_tamed_anomalies (
      campaign_id, anomaly_id, nickname, current_hp, bond_level,
      primary_handler_character_id, current_controller_character_id,
      tamed_by_character_id, companion_source_snapshot, tamed_at
    ) VALUES (
      p_campaign_id, p_anomaly_id, NULLIF(btrim(COALESCE(p_nickname, '')), ''),
      v_hp, 1, p_character_id, p_character_id,
      p_character_id, p_source_snapshot, now()
    ) RETURNING id, companion_instance_id INTO v_tamed_id, v_instance_id;

    IF v_instance_id IS NULL THEN
      RAISE EXCEPTION 'TAMING_COMPANION_IDENTITY_MISSING' USING ERRCODE = 'P0001';
    END IF;

    UPDATE public.companion_instances AS instance
    SET source_kind = 'canonical-anomaly',
        source_collection = 'anomalies',
        source_id = p_anomaly_id,
        source_policy = 'snapshot',
        source_revision = 'canonical-snapshot-v1',
        source_snapshot_version = 1,
        source_snapshot = p_source_snapshot,
        primary_handler_character_id = p_character_id,
        combat_controller_character_id = p_character_id,
        updated_at = now()
    WHERE instance.id = v_instance_id
      AND instance.owner_scope = 'campaign'
      AND instance.owner_campaign_id = p_campaign_id;

    UPDATE public.companion_bond_attempts
    SET companion_instance_id = v_instance_id
    WHERE id = v_attempt_id;
  END IF;

  RETURN v_check || jsonb_build_object(
    'attempt_id', v_attempt_id,
    'attempt_chain_id', v_chain_id,
    'retry_of_attempt_id', v_retry_id,
    'outcome', v_outcome,
    'tamed_id', v_tamed_id,
    'companion_instance_id', v_instance_id,
    'roll_mode', v_roll_mode
  );
END;
$$;

-- ---------------------------------------------------------------------------
-- Bond resolution for an existing campaign-owned living instance. Bond is a
-- distinct relationship: success never changes ownership, handler, controller,
-- rider, initiative, action economy, or progression.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.resolve_companion_bond_attempt_c2(
  p_campaign_id UUID,
  p_character_id UUID,
  p_companion_instance_id UUID,
  p_expected_source_id TEXT,
  p_roll_primary INTEGER,
  p_roll_secondary INTEGER DEFAULT NULL,
  p_adjudication_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_instance public.companion_instances%ROWTYPE;
  v_rank TEXT;
  v_roll_mode TEXT := 'normal';
  v_prof_mode TEXT := 'default';
  v_spec_mode TEXT := 'default';
  v_retry_id UUID;
  v_chain_id UUID := gen_random_uuid();
  v_adjudication public.companion_attempt_adjudications%ROWTYPE;
  v_prior public.companion_bond_attempts%ROWTYPE;
  v_latest_failure public.companion_bond_attempts%ROWTYPE;
  v_check JSONB;
  v_attempt_id UUID;
  v_outcome TEXT;
  v_bond_id UUID;
BEGIN
  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED' USING ERRCODE = '42501';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.characters AS character_row
    WHERE character_row.id = p_character_id AND character_row.user_id = v_actor
  ) THEN
    RAISE EXCEPTION 'NOT_OWNER' USING ERRCODE = '42501';
  END IF;
  IF NOT app_private.companion_character_in_campaign(p_campaign_id, p_character_id) THEN
    RAISE EXCEPTION 'CHARACTER_NOT_IN_CAMPAIGN' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO v_instance
  FROM public.companion_instances AS instance
  WHERE instance.id = p_companion_instance_id
  FOR UPDATE;
  IF NOT FOUND
     OR v_instance.owner_scope <> 'campaign'
     OR v_instance.owner_campaign_id IS DISTINCT FROM p_campaign_id
     OR v_instance.source_id IS DISTINCT FROM p_expected_source_id THEN
    RAISE EXCEPTION 'COMPANION_SOURCE_MISMATCH' USING ERRCODE = '22023';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.companion_bonds AS bond
    WHERE bond.companion_instance_id = p_companion_instance_id
      AND bond.character_id = p_character_id
      AND bond.released_at IS NULL
  ) THEN
    SELECT bond.id INTO v_bond_id
    FROM public.companion_bonds AS bond
    WHERE bond.companion_instance_id = p_companion_instance_id
      AND bond.character_id = p_character_id
      AND bond.released_at IS NULL;
    RETURN jsonb_build_object(
      'valid', true, 'success', true, 'outcome', 'already-bonded',
      'bond_id', v_bond_id, 'companion_instance_id', p_companion_instance_id
    );
  END IF;

  v_rank := v_instance.source_snapshot#>>'{sourceFields,rank}';

  IF p_adjudication_id IS NOT NULL THEN
    SELECT * INTO v_adjudication
    FROM public.companion_attempt_adjudications AS adjudication
    WHERE adjudication.id = p_adjudication_id
    FOR UPDATE;
    IF NOT FOUND
       OR v_adjudication.consumed_at IS NOT NULL
       OR v_adjudication.campaign_id IS DISTINCT FROM p_campaign_id
       OR v_adjudication.character_id IS DISTINCT FROM p_character_id
       OR v_adjudication.target_source_id IS DISTINCT FROM p_expected_source_id
       OR v_adjudication.attempt_kind <> 'bond'
       OR v_adjudication.companion_instance_id IS DISTINCT FROM p_companion_instance_id THEN
      RAISE EXCEPTION 'INVALID_OR_CONSUMED_ADJUDICATION' USING ERRCODE = '22023';
    END IF;
    v_roll_mode := v_adjudication.roll_mode;
    v_prof_mode := v_adjudication.proficiency_mode;
    v_spec_mode := v_adjudication.specialization_mode;
    v_retry_id := v_adjudication.retry_of_attempt_id;
    UPDATE public.companion_attempt_adjudications
    SET consumed_at = now()
    WHERE id = p_adjudication_id;
  END IF;

  SELECT * INTO v_latest_failure
  FROM public.companion_bond_attempts AS attempt
  WHERE attempt.campaign_id = p_campaign_id
    AND attempt.character_id = p_character_id
    AND attempt.companion_instance_id = p_companion_instance_id
    AND attempt.attempt_kind = 'bond'
    AND attempt.outcome IN ('failure', 'invalid')
  ORDER BY attempt.created_at DESC
  LIMIT 1;

  IF FOUND AND v_retry_id IS NULL THEN
    v_check := jsonb_build_object(
      'valid', false,
      'reason', 'RETRY_ADJUDICATION_REQUIRED',
      'retry_of_attempt_id', v_latest_failure.id
    );
  ELSE
    IF v_retry_id IS NOT NULL THEN
      SELECT * INTO v_prior
      FROM public.companion_bond_attempts AS attempt
      WHERE attempt.id = v_retry_id;
      IF NOT FOUND
         OR v_prior.campaign_id IS DISTINCT FROM p_campaign_id
         OR v_prior.character_id IS DISTINCT FROM p_character_id
         OR v_prior.companion_instance_id IS DISTINCT FROM p_companion_instance_id
         OR v_prior.target_source_id IS DISTINCT FROM p_expected_source_id
         OR v_prior.attempt_kind <> 'bond'
         OR v_prior.outcome NOT IN ('failure', 'invalid') THEN
        RAISE EXCEPTION 'INVALID_RETRY_REFERENCE' USING ERRCODE = '22023';
      END IF;
      v_chain_id := v_prior.attempt_chain_id;
    END IF;

    v_check := app_private.companion_resolve_check(
      p_character_id, v_rank, v_roll_mode, p_roll_primary, p_roll_secondary,
      v_prof_mode, v_spec_mode
    );
  END IF;

  v_outcome := CASE
    WHEN COALESCE((v_check->>'valid')::BOOLEAN, false) = false THEN 'invalid'
    WHEN COALESCE((v_check->>'success')::BOOLEAN, false) THEN 'success'
    ELSE 'failure'
  END;

  INSERT INTO public.companion_bond_attempts (
    campaign_id, character_id, companion_instance_id, target_source_id,
    target_rank, attempt_kind, attempt_chain_id, retry_of_attempt_id,
    adjudication_id, roll_mode, roll_primary, roll_secondary, selected_roll,
    ability_modifier, proficiency_source_id, proficiency_bonus,
    specialization_source_id, specialization_bonus, dc, total,
    outcome, invalid_reason
  ) VALUES (
    p_campaign_id, p_character_id, p_companion_instance_id, p_expected_source_id,
    NULLIF(upper(btrim(COALESCE(v_rank, ''))), ''), 'bond', v_chain_id, v_retry_id,
    p_adjudication_id, v_roll_mode,
    CASE WHEN p_roll_primary BETWEEN 1 AND 20 THEN p_roll_primary ELSE NULL END,
    CASE WHEN p_roll_secondary BETWEEN 1 AND 20 THEN p_roll_secondary ELSE NULL END,
    NULLIF(v_check->>'selected_roll', '')::INTEGER,
    COALESCE(NULLIF(v_check->>'ability_modifier', '')::INTEGER, 0),
    NULLIF(v_check->>'proficiency_source_id', ''),
    COALESCE(NULLIF(v_check->>'proficiency_bonus', '')::INTEGER, 0),
    NULLIF(v_check->>'specialization_source_id', ''),
    COALESCE(NULLIF(v_check->>'specialization_bonus', '')::INTEGER, 0),
    NULLIF(v_check->>'dc', '')::INTEGER,
    NULLIF(v_check->>'total', '')::INTEGER,
    v_outcome,
    CASE WHEN v_outcome = 'invalid' THEN v_check->>'reason' ELSE NULL END
  ) RETURNING id INTO v_attempt_id;

  IF v_outcome = 'success' THEN
    INSERT INTO public.companion_bonds (
      campaign_id, companion_instance_id, character_id, created_by_attempt_id
    ) VALUES (
      p_campaign_id, p_companion_instance_id, p_character_id, v_attempt_id
    )
    ON CONFLICT (companion_instance_id, character_id) WHERE released_at IS NULL
    DO UPDATE SET created_by_attempt_id = EXCLUDED.created_by_attempt_id
    RETURNING id INTO v_bond_id;
  END IF;

  RETURN v_check || jsonb_build_object(
    'attempt_id', v_attempt_id,
    'attempt_chain_id', v_chain_id,
    'retry_of_attempt_id', v_retry_id,
    'outcome', v_outcome,
    'bond_id', v_bond_id,
    'companion_instance_id', p_companion_instance_id,
    'roll_mode', v_roll_mode
  );
END;
$$;

-- ---------------------------------------------------------------------------
-- Serialized claim/release with durable control history. Existing controller
-- ownership stays distinct from companion ownership, handler, rider and bond.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.claim_anomaly_controller(
  p_tamed_id UUID,
  p_character_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_row public.campaign_tamed_anomalies%ROWTYPE;
  v_previous UUID;
BEGIN
  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED' USING ERRCODE = '42501';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.characters AS character_row
    WHERE character_row.id = p_character_id AND character_row.user_id = v_actor
  ) THEN
    RAISE EXCEPTION 'NOT_OWNER' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO v_row
  FROM public.campaign_tamed_anomalies AS tamed
  WHERE tamed.id = p_tamed_id
  FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'TAMED_NOT_FOUND' USING ERRCODE = 'P0002';
  END IF;
  IF NOT app_private.companion_character_in_campaign(v_row.campaign_id, p_character_id) THEN
    RAISE EXCEPTION 'CHARACTER_NOT_IN_CAMPAIGN' USING ERRCODE = '42501';
  END IF;

  v_previous := v_row.current_controller_character_id;
  IF v_previous IS NOT NULL AND v_previous <> p_character_id
     AND app_private.companion_character_in_campaign(v_row.campaign_id, v_previous) THEN
    RAISE EXCEPTION 'CONTROL_ALREADY_CLAIMED' USING ERRCODE = '55000';
  END IF;

  UPDATE public.campaign_tamed_anomalies AS tamed
  SET current_controller_character_id = p_character_id,
      updated_at = now()
  WHERE tamed.id = p_tamed_id;

  UPDATE public.companion_instances AS instance
  SET combat_controller_character_id = p_character_id,
      updated_at = now()
  WHERE instance.id = v_row.companion_instance_id;

  IF v_previous IS DISTINCT FROM p_character_id THEN
    INSERT INTO public.companion_control_events (
      campaign_id, tamed_anomaly_id, companion_instance_id,
      actor_user_id, actor_character_id, event_type,
      previous_controller_character_id, next_controller_character_id
    ) VALUES (
      v_row.campaign_id, p_tamed_id, v_row.companion_instance_id,
      v_actor, p_character_id, 'claim', v_previous, p_character_id
    );
  END IF;

  RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION public.release_anomaly_controller(
  p_tamed_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_row public.campaign_tamed_anomalies%ROWTYPE;
  v_controller_owner UUID;
BEGIN
  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO v_row
  FROM public.campaign_tamed_anomalies AS tamed
  WHERE tamed.id = p_tamed_id
  FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'TAMED_NOT_FOUND' USING ERRCODE = 'P0002';
  END IF;

  IF v_row.current_controller_character_id IS NULL THEN
    RETURN;
  END IF;

  SELECT character_row.user_id INTO v_controller_owner
  FROM public.characters AS character_row
  WHERE character_row.id = v_row.current_controller_character_id;

  IF v_controller_owner IS DISTINCT FROM v_actor
     AND NOT public.is_campaign_system(v_row.campaign_id, v_actor) THEN
    RAISE EXCEPTION 'NOT_CONTROLLER_OR_WARDEN' USING ERRCODE = '42501';
  END IF;

  UPDATE public.campaign_tamed_anomalies AS tamed
  SET current_controller_character_id = NULL,
      updated_at = now()
  WHERE tamed.id = p_tamed_id;

  UPDATE public.companion_instances AS instance
  SET combat_controller_character_id = NULL,
      updated_at = now()
  WHERE instance.id = v_row.companion_instance_id;

  INSERT INTO public.companion_control_events (
    campaign_id, tamed_anomaly_id, companion_instance_id,
    actor_user_id, actor_character_id, event_type,
    previous_controller_character_id, next_controller_character_id
  ) VALUES (
    v_row.campaign_id, p_tamed_id, v_row.companion_instance_id,
    v_actor,
    CASE WHEN v_controller_owner = v_actor THEN v_row.current_controller_character_id ELSE NULL END,
    'release', v_row.current_controller_character_id, NULL
  );
END;
$$;

-- C2 is now the supported application boundary. C1's client-total wrapper stays
-- callable by its owner for migration compatibility but cannot bypass C2.
REVOKE EXECUTE ON FUNCTION public.attempt_taming_with_source(
  UUID, UUID, TEXT, INT, INT, INT, JSONB, INT, TEXT
) FROM PUBLIC, anon, authenticated;

REVOKE ALL ON FUNCTION public.prepare_companion_attempt_adjudication(
  UUID, UUID, TEXT, TEXT, UUID, TEXT, TEXT, TEXT, UUID, TEXT
) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.resolve_companion_tame_attempt_c2(
  UUID, UUID, TEXT, JSONB, INTEGER, INTEGER, UUID, TEXT
) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.resolve_companion_bond_attempt_c2(
  UUID, UUID, UUID, TEXT, INTEGER, INTEGER, UUID
) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.claim_anomaly_controller(UUID, UUID)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.release_anomaly_controller(UUID)
  FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.prepare_companion_attempt_adjudication(
  UUID, UUID, TEXT, TEXT, UUID, TEXT, TEXT, TEXT, UUID, TEXT
) TO authenticated;
GRANT EXECUTE ON FUNCTION public.resolve_companion_tame_attempt_c2(
  UUID, UUID, TEXT, JSONB, INTEGER, INTEGER, UUID, TEXT
) TO authenticated;
GRANT EXECUTE ON FUNCTION public.resolve_companion_bond_attempt_c2(
  UUID, UUID, UUID, TEXT, INTEGER, INTEGER, UUID
) TO authenticated;
GRANT EXECUTE ON FUNCTION public.claim_anomaly_controller(UUID, UUID)
  TO authenticated;
GRANT EXECUTE ON FUNCTION public.release_anomaly_controller(UUID)
  TO authenticated;

COMMENT ON TABLE public.companion_bond_attempts IS
  'C2 durable tame/bond attempt history. Campaign-scoped; no automatic rest retry.';
COMMENT ON TABLE public.companion_attempt_adjudications IS
  'C2 one-shot Warden/co-Warden context for advantage/disadvantage, source-backed PB/+2 overrides, and explicit retries.';
COMMENT ON TABLE public.companion_bonds IS
  'C2 bond relationship. Distinct from ownership, handler, combat controller and rider.';

COMMIT;

NOTIFY pgrst, 'reload schema';
