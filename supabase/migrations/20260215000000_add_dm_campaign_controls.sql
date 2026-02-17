-- DM Campaign Controls: invites, rules/events, encounters, combat, loot, relics, exports

-- Invites
CREATE TABLE IF NOT EXISTS public.campaign_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  role TEXT NOT NULL DEFAULT 'hunter' CHECK (role IN ('hunter', 'co-system')),
  expires_at TIMESTAMPTZ,
  max_uses INTEGER NOT NULL DEFAULT 1,
  used_count INTEGER NOT NULL DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS campaign_invites_campaign_idx ON public.campaign_invites(campaign_id);
CREATE INDEX IF NOT EXISTS campaign_invites_token_idx ON public.campaign_invites(token);
ALTER TABLE public.campaign_invites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "campaign_invites_select" ON public.campaign_invites
  FOR SELECT USING (public.is_campaign_system(campaign_id));
CREATE POLICY "campaign_invites_insert" ON public.campaign_invites
  FOR INSERT WITH CHECK (public.is_campaign_system(campaign_id));
CREATE POLICY "campaign_invites_update" ON public.campaign_invites
  FOR UPDATE USING (public.is_campaign_system(campaign_id));
CREATE POLICY "campaign_invites_delete" ON public.campaign_invites
  FOR DELETE USING (public.is_campaign_system(campaign_id));
CREATE TRIGGER update_campaign_invites_updated_at
  BEFORE UPDATE ON public.campaign_invites
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Campaign Rules
CREATE TABLE IF NOT EXISTS public.campaign_rules (
  campaign_id UUID PRIMARY KEY REFERENCES public.campaigns(id) ON DELETE CASCADE,
  rules JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.campaign_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "campaign_rules_select" ON public.campaign_rules
  FOR SELECT USING (public.is_campaign_member(campaign_id) OR public.is_campaign_dm(campaign_id));
CREATE POLICY "campaign_rules_insert" ON public.campaign_rules
  FOR INSERT WITH CHECK (public.is_campaign_system(campaign_id));
CREATE POLICY "campaign_rules_update" ON public.campaign_rules
  FOR UPDATE USING (public.is_campaign_system(campaign_id));
CREATE TRIGGER update_campaign_rules_updated_at
  BEFORE UPDATE ON public.campaign_rules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Rule Events
CREATE TABLE IF NOT EXISTS public.campaign_rule_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  kind TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS campaign_rule_events_campaign_idx ON public.campaign_rule_events(campaign_id, created_at DESC);
ALTER TABLE public.campaign_rule_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "campaign_rule_events_select" ON public.campaign_rule_events
  FOR SELECT USING (public.is_campaign_system(campaign_id));
CREATE POLICY "campaign_rule_events_insert" ON public.campaign_rule_events
  FOR INSERT WITH CHECK (public.is_campaign_system(campaign_id));

-- Encounters
CREATE TABLE IF NOT EXISTS public.campaign_encounters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  difficulty JSONB NOT NULL DEFAULT '{}'::jsonb,
  loot_summary JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS campaign_encounters_campaign_idx ON public.campaign_encounters(campaign_id, created_at DESC);
ALTER TABLE public.campaign_encounters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "campaign_encounters_select" ON public.campaign_encounters
  FOR SELECT USING (public.is_campaign_system(campaign_id));
CREATE POLICY "campaign_encounters_insert" ON public.campaign_encounters
  FOR INSERT WITH CHECK (public.is_campaign_system(campaign_id));
CREATE POLICY "campaign_encounters_update" ON public.campaign_encounters
  FOR UPDATE USING (public.is_campaign_system(campaign_id));
CREATE POLICY "campaign_encounters_delete" ON public.campaign_encounters
  FOR DELETE USING (public.is_campaign_system(campaign_id));
CREATE TRIGGER update_campaign_encounters_updated_at
  BEFORE UPDATE ON public.campaign_encounters
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.campaign_encounter_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  encounter_id UUID NOT NULL REFERENCES public.campaign_encounters(id) ON DELETE CASCADE,
  entry_kind TEXT NOT NULL DEFAULT 'monster',
  monster_id UUID REFERENCES public.compendium_monsters(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  stats JSONB NOT NULL DEFAULT '{}'::jsonb,
  source JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS campaign_encounter_entries_encounter_idx ON public.campaign_encounter_entries(encounter_id);
CREATE INDEX IF NOT EXISTS campaign_encounter_entries_campaign_idx ON public.campaign_encounter_entries(campaign_id);
ALTER TABLE public.campaign_encounter_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "campaign_encounter_entries_select" ON public.campaign_encounter_entries
  FOR SELECT USING (public.is_campaign_system(campaign_id));
CREATE POLICY "campaign_encounter_entries_insert" ON public.campaign_encounter_entries
  FOR INSERT WITH CHECK (public.is_campaign_system(campaign_id));
CREATE POLICY "campaign_encounter_entries_update" ON public.campaign_encounter_entries
  FOR UPDATE USING (public.is_campaign_system(campaign_id));
CREATE POLICY "campaign_encounter_entries_delete" ON public.campaign_encounter_entries
  FOR DELETE USING (public.is_campaign_system(campaign_id));

-- Combat sessions + combatants
CREATE TABLE IF NOT EXISTS public.campaign_combat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  encounter_id UUID REFERENCES public.campaign_encounters(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'ended')),
  round INTEGER NOT NULL DEFAULT 1,
  current_turn INTEGER NOT NULL DEFAULT 0,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS campaign_combat_sessions_campaign_idx ON public.campaign_combat_sessions(campaign_id, created_at DESC);
ALTER TABLE public.campaign_combat_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "campaign_combat_sessions_select" ON public.campaign_combat_sessions
  FOR SELECT USING (public.is_campaign_member(campaign_id) OR public.is_campaign_dm(campaign_id));
CREATE POLICY "campaign_combat_sessions_insert" ON public.campaign_combat_sessions
  FOR INSERT WITH CHECK (public.is_campaign_system(campaign_id));
CREATE POLICY "campaign_combat_sessions_update" ON public.campaign_combat_sessions
  FOR UPDATE USING (public.is_campaign_system(campaign_id));
CREATE POLICY "campaign_combat_sessions_delete" ON public.campaign_combat_sessions
  FOR DELETE USING (public.is_campaign_system(campaign_id));
CREATE TRIGGER update_campaign_combat_sessions_updated_at
  BEFORE UPDATE ON public.campaign_combat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.campaign_combatants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES public.campaign_combat_sessions(id) ON DELETE CASCADE,
  member_id UUID REFERENCES public.campaign_members(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  stats JSONB NOT NULL DEFAULT '{}'::jsonb,
  initiative INTEGER NOT NULL DEFAULT 0,
  conditions JSONB NOT NULL DEFAULT '[]'::jsonb,
  flags JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS campaign_combatants_session_idx ON public.campaign_combatants(session_id);
ALTER TABLE public.campaign_combatants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "campaign_combatants_select" ON public.campaign_combatants
  FOR SELECT USING (public.is_campaign_member(campaign_id) OR public.is_campaign_dm(campaign_id));
CREATE POLICY "campaign_combatants_insert" ON public.campaign_combatants
  FOR INSERT WITH CHECK (public.is_campaign_system(campaign_id));
CREATE POLICY "campaign_combatants_update" ON public.campaign_combatants
  FOR UPDATE USING (public.is_campaign_system(campaign_id));
CREATE POLICY "campaign_combatants_delete" ON public.campaign_combatants
  FOR DELETE USING (public.is_campaign_system(campaign_id));
CREATE TRIGGER update_campaign_combatants_updated_at
  BEFORE UPDATE ON public.campaign_combatants
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Loot drops + relic instances
CREATE TABLE IF NOT EXISTS public.campaign_loot_drops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  encounter_id UUID REFERENCES public.campaign_encounters(id) ON DELETE SET NULL,
  session_id UUID REFERENCES public.campaign_combat_sessions(id) ON DELETE SET NULL,
  assigned_to_member_id UUID REFERENCES public.campaign_members(id) ON DELETE SET NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_value NUMERIC NOT NULL DEFAULT 0,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS campaign_loot_drops_campaign_idx ON public.campaign_loot_drops(campaign_id, created_at DESC);
ALTER TABLE public.campaign_loot_drops ENABLE ROW LEVEL SECURITY;
CREATE POLICY "campaign_loot_drops_select" ON public.campaign_loot_drops
  FOR SELECT USING (public.is_campaign_member(campaign_id) OR public.is_campaign_dm(campaign_id));
CREATE POLICY "campaign_loot_drops_insert" ON public.campaign_loot_drops
  FOR INSERT WITH CHECK (public.is_campaign_system(campaign_id));
CREATE POLICY "campaign_loot_drops_update" ON public.campaign_loot_drops
  FOR UPDATE USING (public.is_campaign_system(campaign_id));
CREATE POLICY "campaign_loot_drops_delete" ON public.campaign_loot_drops
  FOR DELETE USING (public.is_campaign_system(campaign_id));

CREATE TABLE IF NOT EXISTS public.campaign_relic_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  relic_id UUID REFERENCES public.compendium_relics(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  rarity TEXT,
  properties JSONB NOT NULL DEFAULT '{}'::jsonb,
  value_credits NUMERIC,
  bound_to_member_id UUID REFERENCES public.campaign_members(id) ON DELETE SET NULL,
  tradeable BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  assigned_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS campaign_relic_instances_campaign_idx ON public.campaign_relic_instances(campaign_id, created_at DESC);
ALTER TABLE public.campaign_relic_instances ENABLE ROW LEVEL SECURITY;
CREATE POLICY "campaign_relic_instances_select" ON public.campaign_relic_instances
  FOR SELECT USING (public.is_campaign_member(campaign_id) OR public.is_campaign_dm(campaign_id));
CREATE POLICY "campaign_relic_instances_insert" ON public.campaign_relic_instances
  FOR INSERT WITH CHECK (public.is_campaign_system(campaign_id));
CREATE POLICY "campaign_relic_instances_update" ON public.campaign_relic_instances
  FOR UPDATE USING (public.is_campaign_system(campaign_id));
CREATE POLICY "campaign_relic_instances_delete" ON public.campaign_relic_instances
  FOR DELETE USING (public.is_campaign_system(campaign_id));

-- Helper functions
CREATE OR REPLACE FUNCTION public.create_campaign_invite(
  p_campaign_id UUID,
  p_role TEXT DEFAULT 'hunter',
  p_expires_at TIMESTAMPTZ DEFAULT (now() + interval '24 hours'),
  p_max_uses INTEGER DEFAULT 1
)
RETURNS TABLE (
  id UUID,
  token TEXT,
  role TEXT,
  expires_at TIMESTAMPTZ,
  max_uses INTEGER,
  used_count INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
SET row_security = off
AS $$
DECLARE
  v_token TEXT;
BEGIN
  IF NOT public.is_campaign_system(p_campaign_id) THEN
    RAISE EXCEPTION 'Not authorized to create invite';
  END IF;

  IF p_role NOT IN ('hunter', 'co-system') THEN
    RAISE EXCEPTION 'Invalid invite role';
  END IF;

  v_token := replace(gen_random_uuid()::text, '-', '');

  INSERT INTO public.campaign_invites (campaign_id, token, created_by, role, expires_at, max_uses)
  VALUES (p_campaign_id, v_token, auth.uid(), p_role, p_expires_at, p_max_uses)
  RETURNING campaign_invites.id, campaign_invites.token, campaign_invites.role, campaign_invites.expires_at,
            campaign_invites.max_uses, campaign_invites.used_count
  INTO id, token, role, expires_at, max_uses, used_count;

  RETURN;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_campaign_invite_by_token(p_token TEXT)
RETURNS TABLE (
  campaign_id UUID,
  campaign_name TEXT,
  campaign_description TEXT,
  role TEXT,
  expires_at TIMESTAMPTZ,
  max_uses INTEGER,
  used_count INTEGER
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
SET row_security = off
AS $$
  SELECT
    c.id,
    c.name,
    c.description,
    i.role,
    i.expires_at,
    i.max_uses,
    i.used_count
  FROM public.campaign_invites i
  JOIN public.campaigns c ON c.id = i.campaign_id
  WHERE i.token = p_token
    AND c.is_active = true
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.redeem_campaign_invite(
  p_token TEXT,
  p_character_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
SET row_security = off
AS $$
DECLARE
  v_invite RECORD;
  v_campaign_id UUID;
  v_member_id UUID;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  SELECT * INTO v_invite
  FROM public.campaign_invites
  WHERE token = p_token
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invite not found';
  END IF;

  IF v_invite.expires_at IS NOT NULL AND v_invite.expires_at < now() THEN
    RAISE EXCEPTION 'Invite expired';
  END IF;

  IF v_invite.max_uses IS NOT NULL AND v_invite.used_count >= v_invite.max_uses THEN
    RAISE EXCEPTION 'Invite already used';
  END IF;

  v_campaign_id := v_invite.campaign_id;

  IF NOT public.is_campaign_active(v_campaign_id) THEN
    RAISE EXCEPTION 'Campaign inactive';
  END IF;

  SELECT id INTO v_member_id
  FROM public.campaign_members
  WHERE campaign_id = v_campaign_id
    AND user_id = auth.uid();

  IF v_member_id IS NOT NULL THEN
    IF p_character_id IS NOT NULL THEN
      UPDATE public.campaign_members
      SET character_id = p_character_id
      WHERE id = v_member_id;
    END IF;
    RETURN v_campaign_id;
  END IF;

  INSERT INTO public.campaign_members (campaign_id, user_id, character_id, role)
  VALUES (v_campaign_id, auth.uid(), p_character_id, v_invite.role)
  ON CONFLICT (campaign_id, user_id)
  DO UPDATE SET character_id = EXCLUDED.character_id;

  UPDATE public.campaign_invites
  SET used_count = used_count + 1,
      last_used_at = now()
  WHERE id = v_invite.id;

  RETURN v_campaign_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.save_campaign_encounter(
  p_campaign_id UUID,
  p_encounter_id UUID DEFAULT NULL,
  p_name TEXT DEFAULT NULL,
  p_description TEXT DEFAULT NULL,
  p_difficulty JSONB DEFAULT '{}'::jsonb,
  p_entries JSONB DEFAULT '[]'::jsonb,
  p_loot JSONB DEFAULT '[]'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
SET row_security = off
AS $$
DECLARE
  v_encounter_id UUID;
BEGIN
  IF NOT public.is_campaign_system(p_campaign_id) THEN
    RAISE EXCEPTION 'Not authorized to save encounter';
  END IF;

  IF p_name IS NULL OR btrim(p_name) = '' THEN
    RAISE EXCEPTION 'Encounter name is required';
  END IF;

  IF p_encounter_id IS NULL THEN
    INSERT INTO public.campaign_encounters (campaign_id, name, description, difficulty, loot_summary, created_by, updated_by)
    VALUES (p_campaign_id, p_name, p_description, p_difficulty, p_loot, auth.uid(), auth.uid())
    RETURNING id INTO v_encounter_id;
  ELSE
    UPDATE public.campaign_encounters
    SET name = p_name,
        description = p_description,
        difficulty = p_difficulty,
        loot_summary = p_loot,
        updated_by = auth.uid()
    WHERE id = p_encounter_id
      AND campaign_id = p_campaign_id
    RETURNING id INTO v_encounter_id;

    DELETE FROM public.campaign_encounter_entries
    WHERE encounter_id = v_encounter_id;
  END IF;

  INSERT INTO public.campaign_encounter_entries (
    campaign_id,
    encounter_id,
    entry_kind,
    monster_id,
    name,
    quantity,
    stats,
    source
  )
  SELECT
    p_campaign_id,
    v_encounter_id,
    COALESCE(entry->>'entry_kind', 'monster'),
    NULLIF(entry->>'monster_id', '')::uuid,
    COALESCE(entry->>'name', 'Unknown'),
    COALESCE((entry->>'quantity')::int, 1),
    COALESCE(entry->'stats', '{}'::jsonb),
    COALESCE(entry->'source', '{}'::jsonb)
  FROM jsonb_array_elements(p_entries) AS entry;

  IF jsonb_array_length(p_loot) > 0 THEN
    INSERT INTO public.campaign_loot_drops (campaign_id, encounter_id, items, total_value, created_by)
    VALUES (p_campaign_id, v_encounter_id, p_loot, 0, auth.uid());
  END IF;

  RETURN v_encounter_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.deploy_campaign_encounter(
  p_encounter_id UUID
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
SET row_security = off
AS $$
DECLARE
  v_campaign_id UUID;
  v_session_id UUID;
BEGIN
  SELECT campaign_id INTO v_campaign_id
  FROM public.campaign_encounters
  WHERE id = p_encounter_id;

  IF v_campaign_id IS NULL THEN
    RAISE EXCEPTION 'Encounter not found';
  END IF;

  IF NOT public.is_campaign_system(v_campaign_id) THEN
    RAISE EXCEPTION 'Not authorized to deploy encounter';
  END IF;

  INSERT INTO public.campaign_combat_sessions (campaign_id, encounter_id, status, round, current_turn, created_by)
  VALUES (v_campaign_id, p_encounter_id, 'active', 1, 0, auth.uid())
  RETURNING id INTO v_session_id;

  INSERT INTO public.campaign_combatants (
    campaign_id,
    session_id,
    name,
    stats,
    initiative,
    conditions,
    flags
  )
  SELECT
    v_campaign_id,
    v_session_id,
    CASE
      WHEN COALESCE(entry.quantity, 1) > 1
        THEN COALESCE(entry.name, 'Combatant') || ' #' || series
      ELSE COALESCE(entry.name, 'Combatant')
    END,
    entry.stats,
    0,
    '[]'::jsonb,
    jsonb_build_object('is_npc', true, 'source_monster_id', entry.monster_id)
  FROM public.campaign_encounter_entries entry
  JOIN LATERAL generate_series(1, GREATEST(1, COALESCE(entry.quantity, 1))) AS series ON true
  WHERE entry.encounter_id = p_encounter_id;

  INSERT INTO public.campaign_rule_events (campaign_id, created_by, kind, payload)
  VALUES (v_campaign_id, auth.uid(), 'encounter_deployed', jsonb_build_object('encounter_id', p_encounter_id, 'session_id', v_session_id));

  RETURN v_session_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.assign_campaign_loot(
  p_campaign_id UUID,
  p_items JSONB,
  p_encounter_id UUID DEFAULT NULL,
  p_session_id UUID DEFAULT NULL,
  p_assigned_to_member_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
SET row_security = off
AS $$
DECLARE
  v_rules JSONB;
  v_limit NUMERIC;
  v_total NUMERIC;
  v_id UUID;
BEGIN
  IF NOT public.is_campaign_system(p_campaign_id) THEN
    RAISE EXCEPTION 'Not authorized to assign loot';
  END IF;

  SELECT rules INTO v_rules
  FROM public.campaign_rules
  WHERE campaign_id = p_campaign_id;

  SELECT COALESCE(SUM(
    COALESCE((item->>'value_credits')::numeric, (item->>'value')::numeric, 0) *
    COALESCE((item->>'quantity')::numeric, 1)
  ), 0)
  INTO v_total
  FROM jsonb_array_elements(p_items) AS item;

  IF v_rules ? 'economy_max_loot_value' THEN
    v_limit := (v_rules->>'economy_max_loot_value')::numeric;
    IF v_limit IS NOT NULL AND v_total > v_limit THEN
      RAISE EXCEPTION 'ECONOMY_RULE_VIOLATION: loot value exceeds limit';
    END IF;
  END IF;

  INSERT INTO public.campaign_loot_drops (
    campaign_id,
    encounter_id,
    session_id,
    assigned_to_member_id,
    items,
    total_value,
    created_by
  )
  VALUES (
    p_campaign_id,
    p_encounter_id,
    p_session_id,
    p_assigned_to_member_id,
    p_items,
    v_total,
    auth.uid()
  )
  RETURNING id INTO v_id;

  INSERT INTO public.campaign_rule_events (campaign_id, created_by, kind, payload)
  VALUES (p_campaign_id, auth.uid(), 'loot_assigned', jsonb_build_object('loot_id', v_id, 'total_value', v_total));

  RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.assign_campaign_relic(
  p_campaign_id UUID,
  p_relic_id UUID DEFAULT NULL,
  p_name TEXT DEFAULT NULL,
  p_rarity TEXT DEFAULT NULL,
  p_properties JSONB DEFAULT '{}'::jsonb,
  p_value_credits NUMERIC DEFAULT NULL,
  p_bound_to_member_id UUID DEFAULT NULL,
  p_tradeable BOOLEAN DEFAULT true
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
SET row_security = off
AS $$
DECLARE
  v_rules JSONB;
  v_limit NUMERIC;
  v_value NUMERIC;
  v_id UUID;
BEGIN
  IF NOT public.is_campaign_system(p_campaign_id) THEN
    RAISE EXCEPTION 'Not authorized to assign relic';
  END IF;

  IF p_name IS NULL OR btrim(p_name) = '' THEN
    RAISE EXCEPTION 'Relic name is required';
  END IF;

  IF p_value_credits IS NOT NULL THEN
    v_value := p_value_credits;
  ELSIF p_relic_id IS NOT NULL THEN
    SELECT value_credits INTO v_value
    FROM public.compendium_relics
    WHERE id = p_relic_id;
  ELSE
    v_value := NULL;
  END IF;

  SELECT rules INTO v_rules
  FROM public.campaign_rules
  WHERE campaign_id = p_campaign_id;

  IF v_rules ? 'economy_max_relic_value' THEN
    v_limit := (v_rules->>'economy_max_relic_value')::numeric;
    IF v_limit IS NOT NULL AND v_value IS NOT NULL AND v_value > v_limit THEN
      RAISE EXCEPTION 'ECONOMY_RULE_VIOLATION: relic value exceeds limit';
    END IF;
  END IF;

  INSERT INTO public.campaign_relic_instances (
    campaign_id,
    relic_id,
    name,
    rarity,
    properties,
    value_credits,
    bound_to_member_id,
    tradeable,
    created_by,
    assigned_at
  )
  VALUES (
    p_campaign_id,
    p_relic_id,
    p_name,
    p_rarity,
    p_properties,
    v_value,
    p_bound_to_member_id,
    p_tradeable,
    auth.uid(),
    CASE WHEN p_bound_to_member_id IS NOT NULL THEN now() ELSE NULL END
  )
  RETURNING id INTO v_id;

  INSERT INTO public.campaign_rule_events (campaign_id, created_by, kind, payload)
  VALUES (p_campaign_id, auth.uid(), 'relic_assigned', jsonb_build_object('relic_id', v_id, 'value_credits', v_value));

  RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.export_campaign_bundle(p_campaign_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
SET row_security = off
AS $$
DECLARE
  v_bundle JSONB;
BEGIN
  IF NOT public.is_campaign_system(p_campaign_id) THEN
    RAISE EXCEPTION 'Not authorized to export campaign';
  END IF;

  SELECT jsonb_build_object(
    'campaign', (SELECT to_jsonb(c) FROM public.campaigns c WHERE c.id = p_campaign_id),
    'rules', (SELECT rules FROM public.campaign_rules WHERE campaign_id = p_campaign_id),
    'invites', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'id', i.id,
        'role', i.role,
        'expires_at', i.expires_at,
        'max_uses', i.max_uses,
        'used_count', i.used_count,
        'created_at', i.created_at
      )), '[]'::jsonb)
      FROM public.campaign_invites i
      WHERE i.campaign_id = p_campaign_id
    ),
    'members', (
      SELECT COALESCE(jsonb_agg(to_jsonb(m)), '[]'::jsonb)
      FROM public.campaign_members m
      WHERE m.campaign_id = p_campaign_id
    ),
    'encounters', (
      SELECT COALESCE(jsonb_agg(to_jsonb(e)), '[]'::jsonb)
      FROM public.campaign_encounters e
      WHERE e.campaign_id = p_campaign_id
    ),
    'encounter_entries', (
      SELECT COALESCE(jsonb_agg(to_jsonb(ee)), '[]'::jsonb)
      FROM public.campaign_encounter_entries ee
      WHERE ee.campaign_id = p_campaign_id
    ),
    'combat_sessions', (
      SELECT COALESCE(jsonb_agg(to_jsonb(cs)), '[]'::jsonb)
      FROM public.campaign_combat_sessions cs
      WHERE cs.campaign_id = p_campaign_id
    ),
    'combatants', (
      SELECT COALESCE(jsonb_agg(to_jsonb(cc)), '[]'::jsonb)
      FROM public.campaign_combatants cc
      WHERE cc.campaign_id = p_campaign_id
    ),
    'loot_drops', (
      SELECT COALESCE(jsonb_agg(to_jsonb(ld)), '[]'::jsonb)
      FROM public.campaign_loot_drops ld
      WHERE ld.campaign_id = p_campaign_id
    ),
    'relic_instances', (
      SELECT COALESCE(jsonb_agg(to_jsonb(ri)), '[]'::jsonb)
      FROM public.campaign_relic_instances ri
      WHERE ri.campaign_id = p_campaign_id
    ),
    'notes', (
      SELECT COALESCE(jsonb_agg(to_jsonb(n)), '[]'::jsonb)
      FROM public.campaign_notes n
      WHERE n.campaign_id = p_campaign_id
    ),
    'messages', (
      SELECT COALESCE(jsonb_agg(to_jsonb(msg)), '[]'::jsonb)
      FROM public.campaign_messages msg
      WHERE msg.campaign_id = p_campaign_id
    ),
    'rule_events', (
      SELECT COALESCE(jsonb_agg(to_jsonb(ev)), '[]'::jsonb)
      FROM public.campaign_rule_events ev
      WHERE ev.campaign_id = p_campaign_id
    )
  )
  INTO v_bundle;

  RETURN v_bundle;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_campaign_invite(UUID, TEXT, TIMESTAMPTZ, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_campaign_invite_by_token(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_campaign_invite_by_token(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.redeem_campaign_invite(TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.save_campaign_encounter(UUID, UUID, TEXT, TEXT, JSONB, JSONB, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.deploy_campaign_encounter(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.assign_campaign_loot(UUID, JSONB, UUID, UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.assign_campaign_relic(UUID, UUID, TEXT, TEXT, JSONB, NUMERIC, UUID, BOOLEAN) TO authenticated;
GRANT EXECUTE ON FUNCTION public.export_campaign_bundle(UUID) TO authenticated;

-- Allow unauthenticated join page to resolve share codes
GRANT EXECUTE ON FUNCTION public.get_campaign_by_share_code(TEXT) TO anon;
