BEGIN;

-- ---------------------------------------------------------------------------
-- Exact campaign-character relationship used by Warden-side grant workflows.
-- Legacy ownership-by-campaign-member checks allowed a Warden to target any
-- character owned by a campaign member. A grant must target a character that
-- is actually in this campaign's roster (including secondary links and shares).
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION app_private.campaign_character_is_linked(
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
  SELECT COALESCE(public.is_campaign_system(p_campaign_id, auth.uid()), false)
    AND (EXISTS (
    SELECT 1
    FROM public.campaign_members AS member_row
    WHERE member_row.campaign_id = p_campaign_id
      AND member_row.character_id = p_character_id
  ) OR EXISTS (
    SELECT 1
    FROM public.campaign_member_characters AS link_row
    JOIN public.campaign_members AS member_row
      ON member_row.id = link_row.campaign_member_id
     AND member_row.campaign_id = link_row.campaign_id
    WHERE link_row.campaign_id = p_campaign_id
      AND link_row.character_id = p_character_id
  ) OR EXISTS (
    SELECT 1
    FROM public.campaign_character_shares AS share_row
    WHERE share_row.campaign_id = p_campaign_id
      AND share_row.character_id = p_character_id
  ));
$$;

REVOKE ALL ON FUNCTION app_private.campaign_character_is_linked(UUID, UUID)
  FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA app_private TO authenticated;
GRANT EXECUTE ON FUNCTION app_private.campaign_character_is_linked(UUID, UUID)
  TO authenticated;

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
  -- Companion actions may be initiated by an Ascendant for their own
  -- character. Keep this helper's established membership semantics separate
  -- from the stricter Warden-only roster check used for item and Regent grants.
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

REVOKE ALL ON FUNCTION app_private.companion_character_in_campaign(UUID, UUID)
  FROM PUBLIC, anon, authenticated;

-- A Warden may approve an imported ability grant only for a character that is
-- actually attached to this campaign. The older membership-owner predicate
-- also accepted other characters owned by a campaign member.
CREATE OR REPLACE FUNCTION public.approve_pending_regent_grant(
  p_pending_id UUID,
  p_unlock_id UUID,
  p_campaign_id UUID
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_pending public.character_pending_regent_grants%ROWTYPE;
  v_unlock public.character_regent_unlocks%ROWTYPE;
  v_tier INTEGER;
  v_grant_id UUID;
  v_level INTEGER;
BEGIN
  IF v_actor IS NULL OR NOT public.is_campaign_system(p_campaign_id, v_actor) THEN
    RAISE EXCEPTION 'CAMPAIGN_WARDEN_REQUIRED' USING ERRCODE = '42501';
  END IF;
  SELECT * INTO v_pending FROM public.character_pending_regent_grants
  WHERE id = p_pending_id FOR UPDATE;
  IF NOT FOUND OR v_pending.status <> 'pending' THEN
    RAISE EXCEPTION 'PENDING_REGENT_GRANT_REQUIRED' USING ERRCODE = '22023';
  END IF;
  IF NOT app_private.campaign_character_is_linked(p_campaign_id, v_pending.character_id) THEN
    RAISE EXCEPTION 'CHARACTER_NOT_IN_CAMPAIGN_ROSTER' USING ERRCODE = '42501';
  END IF;
  SELECT * INTO v_unlock FROM public.character_regent_unlocks
  WHERE id = p_unlock_id AND character_id = v_pending.character_id FOR UPDATE;
  IF NOT FOUND OR v_unlock.regent_id IS DISTINCT FROM v_pending.regent_id THEN
    RAISE EXCEPTION 'REGENT_UNLOCK_REQUIRED' USING ERRCODE = '42501';
  END IF;
  SELECT tier INTO v_tier FROM public.regent_canonical_pick_options
  WHERE kind = CASE WHEN v_pending.grant_kind = 'power' THEN 'powers' ELSE 'techniques' END
    AND canonical_id = v_pending.canonical_id;
  IF NOT FOUND OR v_tier NOT BETWEEN 5 AND 9 THEN
    RAISE EXCEPTION 'INVALID_REGENT_ABILITY_TIER' USING ERRCODE = '22023';
  END IF;
  IF v_unlock.caught_up_at_level IS NULL THEN
    INSERT INTO public.regent_catch_up_options(unlock_id, kind, canonical_id, approved_by)
    VALUES (v_unlock.id,
      CASE WHEN v_pending.grant_kind = 'power' THEN 'powers' ELSE 'techniques' END,
      v_pending.canonical_id, v_actor)
    ON CONFLICT (unlock_id, kind, canonical_id) DO NOTHING;
  END IF;
  SELECT level INTO v_level FROM public.characters WHERE id = v_pending.character_id;
  IF v_pending.grant_kind = 'power' THEN
    INSERT INTO public.character_powers (
      character_id, name, power_id, power_level, source, description,
      acquisition_kind, canonical_source_id, regent_id, regent_unlock_id, acquired_level)
    VALUES (
      v_pending.character_id, COALESCE(NULLIF(v_pending.payload->>'name',''), v_pending.canonical_id),
      v_pending.canonical_id, v_tier, 'Regent Attunement (Warden Approved)',
      v_pending.payload->>'description', 'regent', v_pending.regent_id,
      v_pending.regent_id, v_unlock.id, v_level)
    RETURNING id INTO v_grant_id;
  ELSE
    INSERT INTO public.character_techniques (
      character_id, technique_id, source,
      acquisition_kind, canonical_source_id, regent_id, regent_unlock_id, acquired_level)
    VALUES (
      v_pending.character_id, v_pending.canonical_id, 'Regent Attunement (Warden Approved)',
      'regent', v_pending.regent_id, v_pending.regent_id, v_unlock.id, v_level)
    RETURNING id INTO v_grant_id;
  END IF;
  UPDATE public.character_pending_regent_grants
  SET status = 'approved', approved_unlock_id = v_unlock.id, approved_at = now()
  WHERE id = v_pending.id;
  RETURN v_grant_id;
END;
$$;

REVOKE ALL ON FUNCTION public.approve_pending_regent_grant(UUID, UUID, UUID)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.approve_pending_regent_grant(UUID, UUID, UUID)
  TO authenticated;

-- Warden/co-Warden direct inventory grants now accept every linked character,
-- serialize item stacking, persist all equipment fields, and write the session
-- log in the same transaction as the equipment change.
CREATE OR REPLACE FUNCTION public.warden_grant_character_equipment(
  p_campaign_id UUID,
  p_items JSONB
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_item JSONB;
  v_count INTEGER := 0;
  v_character_id UUID;
  v_name TEXT;
  v_item_type TEXT;
  v_quantity INTEGER;
  v_existing_id UUID;
  v_existing_quantity INTEGER;
  v_target_count INTEGER := 0;
BEGIN
  IF v_actor IS NULL OR NOT public.is_campaign_system(p_campaign_id, v_actor) THEN
    RAISE EXCEPTION 'CAMPAIGN_WARDEN_REQUIRED' USING ERRCODE = '42501';
  END IF;
  IF jsonb_typeof(p_items) IS DISTINCT FROM 'array' THEN
    RAISE EXCEPTION 'ITEMS_REQUIRED' USING ERRCODE = '22023';
  END IF;
  IF jsonb_array_length(p_items) < 1 OR jsonb_array_length(p_items) > 100 THEN
    RAISE EXCEPTION 'INVALID_WARDEN_ITEM_GRANT' USING ERRCODE = '22023';
  END IF;

  -- Serialize grants within a campaign so same-name stacks cannot lose updates.
  PERFORM 1 FROM public.campaigns
  WHERE id = p_campaign_id
  FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'CAMPAIGN_NOT_FOUND' USING ERRCODE = 'P0002';
  END IF;

  FOR v_item IN SELECT value FROM jsonb_array_elements(p_items)
  LOOP
    v_character_id := NULLIF(v_item->>'character_id', '')::UUID;
    v_name := NULLIF(btrim(v_item->>'name'), '');
    v_item_type := COALESCE(NULLIF(v_item->>'item_type', ''), 'item');
    v_quantity := COALESCE(NULLIF(v_item->>'quantity', '')::INTEGER, 1);

    IF v_character_id IS NULL OR v_name IS NULL OR length(v_name) > 200
      OR length(v_item_type) > 50 OR v_quantity < 1 OR v_quantity > 1000
      OR COALESCE(NULLIF(v_item->>'weight', '')::NUMERIC, 0) < 0 THEN
      RAISE EXCEPTION 'INVALID_WARDEN_ITEM_GRANT' USING ERRCODE = '22023';
    END IF;
    IF NOT app_private.campaign_character_is_linked(p_campaign_id, v_character_id) THEN
      RAISE EXCEPTION 'CHARACTER_NOT_IN_CAMPAIGN_ROSTER' USING ERRCODE = '42501';
    END IF;

    SELECT equipment_row.id, equipment_row.quantity
    INTO v_existing_id, v_existing_quantity
    FROM public.character_equipment AS equipment_row
    WHERE equipment_row.character_id = v_character_id
      AND equipment_row.name = v_name
      AND equipment_row.item_type = v_item_type
      AND equipment_row.item_id IS NOT DISTINCT FROM NULLIF(v_item->>'item_id', '')
      AND equipment_row.custom_modifiers IS NOT DISTINCT FROM
        NULLIF(v_item->'custom_modifiers', 'null'::JSONB)
    ORDER BY equipment_row.created_at ASC
    LIMIT 1
    FOR UPDATE;

    IF v_existing_id IS NOT NULL THEN
      UPDATE public.character_equipment
      SET quantity = COALESCE(v_existing_quantity, 0) + v_quantity,
          description = COALESCE(NULLIF(v_item->>'description', ''), description),
          properties = CASE
            WHEN jsonb_typeof(v_item->'properties') = 'array'
              THEN ARRAY(SELECT jsonb_array_elements_text(v_item->'properties'))
            ELSE properties
          END,
          charges_max = COALESCE(NULLIF(v_item->>'charges_max', '')::INTEGER, charges_max),
          charges_current = COALESCE(NULLIF(v_item->>'charges_current', '')::INTEGER, charges_current),
          is_container = COALESCE((v_item->>'is_container')::BOOLEAN, is_container),
          capacity_weight = COALESCE(NULLIF(v_item->>'capacity_weight', '')::NUMERIC, capacity_weight),
          capacity_volume = COALESCE(NULLIF(v_item->>'capacity_volume', '')::NUMERIC, capacity_volume)
      WHERE id = v_existing_id;
    ELSE
      INSERT INTO public.character_equipment (
        character_id, item_id, name, item_type, description, properties, weight,
        value_credits, quantity, is_equipped, is_attuned, requires_attunement,
        rarity, relic_tier, charges_current, charges_max, sigil_slots_base,
        custom_modifiers, is_container, capacity_weight, capacity_volume, is_active
      ) VALUES (
        v_character_id,
        NULLIF(v_item->>'item_id', ''),
        v_name,
        v_item_type,
        NULLIF(v_item->>'description', ''),
        CASE WHEN jsonb_typeof(v_item->'properties') = 'array'
          THEN ARRAY(SELECT jsonb_array_elements_text(v_item->'properties'))
          ELSE NULL END,
        NULLIF(v_item->>'weight', '')::NUMERIC,
        NULLIF(v_item->>'value_credits', '')::INTEGER,
        v_quantity,
        COALESCE((v_item->>'is_equipped')::BOOLEAN, false),
        COALESCE((v_item->>'is_attuned')::BOOLEAN, false),
        COALESCE((v_item->>'requires_attunement')::BOOLEAN, false),
        CASE WHEN v_item->>'rarity' IN ('common', 'uncommon', 'rare', 'very_rare', 'epic', 'legendary', 'mythic', 'artifact')
          THEN (v_item->>'rarity')::public.rarity ELSE NULL END,
        CASE WHEN v_item->>'relic_tier' IN ('dormant', 'awakened', 'resonant')
          THEN (v_item->>'relic_tier')::public.relic_tier ELSE NULL END,
        NULLIF(v_item->>'charges_current', '')::INTEGER,
        NULLIF(v_item->>'charges_max', '')::INTEGER,
        COALESCE(NULLIF(v_item->>'sigil_slots_base', '')::INTEGER, 0),
        NULLIF(v_item->'custom_modifiers', 'null'::JSONB),
        COALESCE((v_item->>'is_container')::BOOLEAN, false),
        NULLIF(v_item->>'capacity_weight', '')::NUMERIC,
        NULLIF(v_item->>'capacity_volume', '')::NUMERIC,
        COALESCE((v_item->>'is_active')::BOOLEAN, true)
      );
    END IF;
    v_count := v_count + 1;
    v_target_count := v_target_count + 1;
  END LOOP;

  INSERT INTO public.campaign_session_logs (
    campaign_id, author_id, title, content, log_type, metadata, is_player_visible
  ) VALUES (
    p_campaign_id,
    v_actor,
    'Warden Item Grant',
    format('Granted %s equipment row(s) to campaign Ascendants.', v_target_count),
    'loot',
    jsonb_build_object('items', p_items, 'mode', 'direct'),
    true
  );

  RETURN v_count;
END;
$$;

REVOKE ALL ON FUNCTION public.warden_grant_character_equipment(UUID, JSONB)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.warden_grant_character_equipment(UUID, JSONB)
  TO authenticated;

CREATE OR REPLACE FUNCTION public.warden_deliver_campaign_inventory(
  p_campaign_id UUID,
  p_name TEXT,
  p_item_type TEXT DEFAULT 'item',
  p_description TEXT DEFAULT NULL,
  p_quantity INTEGER DEFAULT 1,
  p_weight NUMERIC DEFAULT NULL,
  p_is_identified BOOLEAN DEFAULT true
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_existing public.campaign_inventory%ROWTYPE;
  v_id UUID;
BEGIN
  IF v_actor IS NULL OR NOT public.is_campaign_system(p_campaign_id, v_actor) THEN
    RAISE EXCEPTION 'CAMPAIGN_WARDEN_REQUIRED' USING ERRCODE = '42501';
  END IF;
  IF NULLIF(btrim(p_name), '') IS NULL OR length(btrim(p_name)) > 200
    OR p_quantity IS NULL OR p_quantity < 1 OR p_quantity > 1000
    OR COALESCE(p_weight, 0) < 0
    OR length(COALESCE(p_item_type, 'item')) > 50
    OR length(COALESCE(p_description, '')) > 2000 THEN
    RAISE EXCEPTION 'INVALID_PARTY_STASH_DELIVERY' USING ERRCODE = '22023';
  END IF;
  PERFORM 1 FROM public.campaigns WHERE id = p_campaign_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'CAMPAIGN_NOT_FOUND' USING ERRCODE = 'P0002';
  END IF;

  SELECT * INTO v_existing
  FROM public.campaign_inventory
  WHERE campaign_id = p_campaign_id AND lower(name) = lower(btrim(p_name))
  ORDER BY created_at ASC
  LIMIT 1
  FOR UPDATE;

  IF FOUND THEN
    UPDATE public.campaign_inventory
    SET quantity = quantity + p_quantity,
        updated_at = now()
    WHERE id = v_existing.id
    RETURNING id INTO v_id;
  ELSE
    INSERT INTO public.campaign_inventory (
      campaign_id, added_by, name, description, item_type, quantity, weight, is_identified
    ) VALUES (
      p_campaign_id, v_actor, btrim(p_name), p_description,
      COALESCE(NULLIF(p_item_type, ''), 'item'), p_quantity, p_weight,
      COALESCE(p_is_identified, true)
    ) RETURNING id INTO v_id;
  END IF;
  RETURN v_id;
END;
$$;

REVOKE ALL ON FUNCTION public.warden_deliver_campaign_inventory(UUID, TEXT, TEXT, TEXT, INTEGER, NUMERIC, BOOLEAN)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.warden_deliver_campaign_inventory(UUID, TEXT, TEXT, TEXT, INTEGER, NUMERIC, BOOLEAN)
  TO authenticated;

-- ---------------------------------------------------------------------------
-- Guild authority. All authenticated guild mutations now go through one
-- SECURITY DEFINER RPC with operation-specific capability and target checks.
-- Direct table DML is denied so browser-side controls cannot be bypassed.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.guild_member_role(p_guild_id UUID, p_uid UUID)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
  SELECT member_row.role
  FROM public.guild_members AS member_row
  WHERE p_uid = auth.uid()
    AND member_row.guild_id = p_guild_id
    AND member_row.user_id = auth.uid()
  ORDER BY CASE member_row.role
    WHEN 'leader' THEN 4 WHEN 'vice_master' THEN 3 WHEN 'officer' THEN 2
    WHEN 'member' THEN 1 ELSE 0 END DESC
  LIMIT 1;
$$;
REVOKE ALL ON FUNCTION public.guild_member_role(UUID, UUID)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.guild_member_role(UUID, UUID)
  TO authenticated;

CREATE OR REPLACE FUNCTION public.guild_admin_action(
  p_guild_id UUID,
  p_action TEXT,
  p_payload JSONB DEFAULT '{}'::JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_actor_role TEXT;
  v_actor_rank INTEGER;
  v_target public.guild_members%ROWTYPE;
  v_role TEXT;
  v_role_rank INTEGER;
  v_new_leader UUID;
  v_funds JSONB;
  v_delta INTEGER;
  v_current INTEGER;
  v_next INTEGER;
  v_currency TEXT;
  v_quest public.guild_quests%ROWTYPE;
  v_quest_id UUID;
  v_rank TEXT;
  v_factor INTEGER;
  v_member_ids JSONB;
  v_npc_data JSONB;
  v_max_level INTEGER;
  v_current_level INTEGER;
BEGIN
  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED' USING ERRCODE = '42501';
  END IF;
  IF jsonb_typeof(COALESCE(p_payload, '{}'::JSONB)) <> 'object' THEN
    RAISE EXCEPTION 'INVALID_GUILD_ACTION_PAYLOAD' USING ERRCODE = '22023';
  END IF;

  SELECT leader_user_id INTO v_new_leader
  FROM public.guilds
  WHERE id = p_guild_id
  FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'GUILD_NOT_FOUND' USING ERRCODE = 'P0002';
  END IF;

  IF v_new_leader = v_actor THEN
    v_actor_role := 'leader';
  ELSE
    SELECT member_row.role INTO v_actor_role
    FROM public.guild_members AS member_row
    WHERE member_row.guild_id = p_guild_id
      AND member_row.user_id = v_actor
    ORDER BY CASE member_row.role
      WHEN 'leader' THEN 4 WHEN 'vice_master' THEN 3 WHEN 'officer' THEN 2
      WHEN 'member' THEN 1 ELSE 0 END DESC
    LIMIT 1;
  END IF;
  v_actor_rank := CASE v_actor_role
    WHEN 'leader' THEN 4 WHEN 'vice_master' THEN 3 WHEN 'officer' THEN 2
    WHEN 'member' THEN 1 WHEN 'recruit' THEN 0 ELSE -1 END;
  IF v_actor_rank < 0 THEN
    RAISE EXCEPTION 'GUILD_MEMBERSHIP_REQUIRED' USING ERRCODE = '42501';
  END IF;

  CASE p_action
    WHEN 'change_member_role' THEN
      IF v_actor_rank < 3 THEN RAISE EXCEPTION 'GUILD_ROLE_CHANGE_FORBIDDEN' USING ERRCODE = '42501'; END IF;
      SELECT * INTO v_target FROM public.guild_members
      WHERE id = NULLIF(p_payload->>'member_id', '')::UUID AND guild_id = p_guild_id
      FOR UPDATE;
      IF NOT FOUND THEN RAISE EXCEPTION 'GUILD_MEMBER_NOT_FOUND' USING ERRCODE = 'P0002'; END IF;
      v_role := p_payload->>'role';
      v_role_rank := CASE v_role
        WHEN 'vice_master' THEN 3 WHEN 'officer' THEN 2 WHEN 'member' THEN 1
        WHEN 'recruit' THEN 0 ELSE -1 END;
      IF v_target.role = 'leader' OR v_actor_rank <= CASE v_target.role
        WHEN 'leader' THEN 4 WHEN 'vice_master' THEN 3 WHEN 'officer' THEN 2
        WHEN 'member' THEN 1 WHEN 'recruit' THEN 0 ELSE -1 END
        OR v_role_rank < 0 OR v_role_rank >= v_actor_rank THEN
        RAISE EXCEPTION 'GUILD_ROLE_HIERARCHY_VIOLATION' USING ERRCODE = '42501';
      END IF;
      UPDATE public.guild_members SET role = v_role WHERE id = v_target.id;
      RETURN jsonb_build_object('role', v_role);

    WHEN 'remove_member' THEN
      IF v_actor_rank < 3 THEN RAISE EXCEPTION 'GUILD_REMOVE_FORBIDDEN' USING ERRCODE = '42501'; END IF;
      SELECT * INTO v_target FROM public.guild_members
      WHERE id = NULLIF(p_payload->>'member_id', '')::UUID AND guild_id = p_guild_id
      FOR UPDATE;
      IF NOT FOUND THEN RAISE EXCEPTION 'GUILD_MEMBER_NOT_FOUND' USING ERRCODE = 'P0002'; END IF;
      IF v_target.role = 'leader' OR v_actor_rank <= CASE v_target.role
        WHEN 'leader' THEN 4 WHEN 'vice_master' THEN 3 WHEN 'officer' THEN 2
        WHEN 'member' THEN 1 WHEN 'recruit' THEN 0 ELSE -1 END THEN
        RAISE EXCEPTION 'GUILD_ROLE_HIERARCHY_VIOLATION' USING ERRCODE = '42501';
      END IF;
      DELETE FROM public.guild_members WHERE id = v_target.id;
      RETURN jsonb_build_object('removed', true);

    WHEN 'transfer_leadership' THEN
      IF v_actor_role <> 'leader' THEN RAISE EXCEPTION 'GUILD_LEADER_REQUIRED' USING ERRCODE = '42501'; END IF;
      v_role := NULLIF(p_payload->>'new_leader_user_id', '');
      IF v_role IS NULL OR v_role::UUID = v_actor THEN
        RAISE EXCEPTION 'INVALID_NEW_GUILD_LEADER' USING ERRCODE = '22023';
      END IF;
      SELECT * INTO v_target FROM public.guild_members
      WHERE guild_id = p_guild_id AND user_id = v_role::UUID
      ORDER BY joined_at ASC LIMIT 1 FOR UPDATE;
      IF NOT FOUND THEN RAISE EXCEPTION 'NEW_GUILD_LEADER_NOT_MEMBER' USING ERRCODE = '22023'; END IF;
      UPDATE public.guild_members SET role = 'vice_master'
      WHERE guild_id = p_guild_id AND user_id = v_actor;
      UPDATE public.guild_members SET role = 'leader' WHERE id = v_target.id;
      UPDATE public.guilds SET leader_user_id = v_role::UUID WHERE id = p_guild_id;
      RETURN jsonb_build_object('leader_user_id', v_role::UUID);

    WHEN 'leave_guild' THEN
      IF v_actor_role = 'leader' THEN RAISE EXCEPTION 'TRANSFER_LEADERSHIP_BEFORE_LEAVING' USING ERRCODE = '42501'; END IF;
      DELETE FROM public.guild_members WHERE guild_id = p_guild_id AND user_id = v_actor;
      RETURN jsonb_build_object('left', true);

    WHEN 'disband_guild' THEN
      IF v_actor_role <> 'leader' THEN RAISE EXCEPTION 'GUILD_LEADER_REQUIRED' USING ERRCODE = '42501'; END IF;
      DELETE FROM public.guilds WHERE id = p_guild_id;
      RETURN jsonb_build_object('disbanded', true);

    WHEN 'adjust_funds' THEN
      IF v_actor_rank < 3 THEN RAISE EXCEPTION 'GUILD_TREASURY_FORBIDDEN' USING ERRCODE = '42501'; END IF;
      v_currency := p_payload->>'currency';
      v_delta := (p_payload->>'delta')::INTEGER;
      IF v_currency IS NULL OR v_currency NOT IN ('core', 'gate', 'crystal', 'mana')
        OR v_delta IS NULL OR v_delta = 0 THEN
        RAISE EXCEPTION 'INVALID_TREASURY_ADJUSTMENT' USING ERRCODE = '22023';
      END IF;
      SELECT COALESCE(funds, '{}'::JSONB) INTO v_funds
      FROM public.guilds WHERE id = p_guild_id FOR UPDATE;
      v_current := COALESCE((v_funds->>v_currency)::INTEGER, 0);
      v_next := v_current + v_delta;
      IF v_next < 0 THEN RAISE EXCEPTION 'INSUFFICIENT_GUILD_FUNDS' USING ERRCODE = '22023'; END IF;
      v_funds := jsonb_set(v_funds, ARRAY[v_currency], to_jsonb(v_next), true);
      UPDATE public.guilds SET funds = v_funds WHERE id = p_guild_id;
      RETURN v_funds;

    WHEN 'update_info' THEN
      IF v_actor_rank < 3 THEN RAISE EXCEPTION 'GUILD_INFO_EDIT_FORBIDDEN' USING ERRCODE = '42501'; END IF;
      IF p_payload ? 'name' AND NULLIF(btrim(p_payload->>'name'), '') IS NULL THEN
        RAISE EXCEPTION 'GUILD_NAME_REQUIRED' USING ERRCODE = '22023';
      END IF;
      IF length(COALESCE(p_payload->>'name', '')) > 80
        OR length(COALESCE(p_payload->>'motto', '')) > 160
        OR length(COALESCE(p_payload->>'description', '')) > 2000 THEN
        RAISE EXCEPTION 'GUILD_INFO_TOO_LONG' USING ERRCODE = '22023';
      END IF;
      UPDATE public.guilds SET
        name = CASE WHEN p_payload ? 'name' THEN btrim(p_payload->>'name') ELSE name END,
        description = CASE WHEN p_payload ? 'description' THEN NULLIF(p_payload->>'description', '') ELSE description END,
        motto = CASE WHEN p_payload ? 'motto' THEN NULLIF(p_payload->>'motto', '') ELSE motto END
      WHERE id = p_guild_id;
      RETURN jsonb_build_object('updated', true);

    WHEN 'update_base_state' THEN
      IF v_actor_role <> 'leader' THEN RAISE EXCEPTION 'GUILD_BASE_MANAGEMENT_FORBIDDEN' USING ERRCODE = '42501'; END IF;
      IF (p_payload - ARRAY['base_facilities', 'guild_skills', 'base_property', 'funds']::TEXT[]) <> '{}'::JSONB
        OR (p_payload ? 'base_facilities' AND jsonb_typeof(p_payload->'base_facilities') <> 'object')
        OR (p_payload ? 'guild_skills' AND jsonb_typeof(p_payload->'guild_skills') <> 'array')
        OR (p_payload ? 'funds' AND jsonb_typeof(p_payload->'funds') <> 'object') THEN
        RAISE EXCEPTION 'INVALID_GUILD_BASE_STATE' USING ERRCODE = '22023';
      END IF;
      UPDATE public.guilds SET
        base_facilities = CASE WHEN p_payload ? 'base_facilities' THEN p_payload->'base_facilities' ELSE base_facilities END,
        guild_skills = CASE WHEN p_payload ? 'guild_skills' THEN p_payload->'guild_skills' ELSE guild_skills END,
        base_property = CASE WHEN p_payload ? 'base_property' THEN NULLIF(p_payload->>'base_property', '') ELSE base_property END,
        funds = CASE WHEN p_payload ? 'funds' THEN p_payload->'funds' ELSE funds END
      WHERE id = p_guild_id;
      RETURN jsonb_build_object('updated', true);

    WHEN 'recruit_npc' THEN
      IF v_actor_rank < 2 THEN RAISE EXCEPTION 'GUILD_RECRUIT_FORBIDDEN' USING ERRCODE = '42501'; END IF;
      v_npc_data := p_payload->'npc_data';
      IF jsonb_typeof(v_npc_data) <> 'object'
        OR NULLIF(p_payload->>'npc_id', '') IS NULL
        OR NULLIF(btrim(p_payload->>'npc_name'), '') IS NULL
        OR length(p_payload->>'npc_id') > 100
        OR length(p_payload->>'npc_name') > 160
        OR COALESCE(NULLIF(p_payload->>'npc_level', '')::INTEGER, 1) < 1
        OR COALESCE(NULLIF(p_payload->>'npc_level', '')::INTEGER, 1) > 100 THEN
        RAISE EXCEPTION 'INVALID_GUILD_NPC' USING ERRCODE = '22023';
      END IF;
      INSERT INTO public.guild_members (
        guild_id, npc_id, npc_name, npc_data, role, npc_level, npc_xp, npc_leveling_mode
      ) VALUES (
        p_guild_id, p_payload->>'npc_id', btrim(p_payload->>'npc_name'), v_npc_data,
        'recruit', COALESCE(NULLIF(p_payload->>'npc_level', '')::INTEGER, 1), 0,
        CASE WHEN p_payload->>'npc_leveling_mode' = 'manual' THEN 'manual' ELSE 'auto' END
      ) RETURNING id INTO v_quest_id;
      RETURN jsonb_build_object('member_id', v_quest_id);

    WHEN 'level_npc' THEN
      IF v_actor_rank < 2 THEN RAISE EXCEPTION 'GUILD_NPC_MANAGEMENT_FORBIDDEN' USING ERRCODE = '42501'; END IF;
      SELECT * INTO v_target FROM public.guild_members
      WHERE id = NULLIF(p_payload->>'member_id', '')::UUID
        AND guild_id = p_guild_id AND npc_id IS NOT NULL
      FOR UPDATE;
      IF NOT FOUND THEN RAISE EXCEPTION 'GUILD_NPC_NOT_FOUND' USING ERRCODE = 'P0002'; END IF;
      v_current_level := COALESCE(v_target.npc_level, 1);
      v_max_level := COALESCE(NULLIF(v_target.npc_data #>> '{leveling,maxLevel}', '')::INTEGER, 20);
      IF v_current_level >= v_max_level THEN RAISE EXCEPTION 'NPC_ALREADY_AT_MAX_LEVEL' USING ERRCODE = '22023'; END IF;
      UPDATE public.guild_members SET npc_level = v_current_level + 1, npc_xp = 0 WHERE id = v_target.id;
      RETURN jsonb_build_object('npc_level', v_current_level + 1);

    WHEN 'set_npc_leveling_mode' THEN
      IF v_actor_rank < 2 THEN RAISE EXCEPTION 'GUILD_NPC_MANAGEMENT_FORBIDDEN' USING ERRCODE = '42501'; END IF;
      v_role := p_payload->>'mode';
      IF v_role NOT IN ('auto', 'manual') THEN RAISE EXCEPTION 'INVALID_NPC_LEVELING_MODE' USING ERRCODE = '22023'; END IF;
      UPDATE public.guild_members SET npc_leveling_mode = v_role
      WHERE id = NULLIF(p_payload->>'member_id', '')::UUID
        AND guild_id = p_guild_id AND npc_id IS NOT NULL;
      IF NOT FOUND THEN RAISE EXCEPTION 'GUILD_NPC_NOT_FOUND' USING ERRCODE = 'P0002'; END IF;
      RETURN jsonb_build_object('mode', v_role);

    WHEN 'accept_quest' THEN
      IF v_actor_rank < 2 THEN RAISE EXCEPTION 'GUILD_QUEST_MANAGEMENT_FORBIDDEN' USING ERRCODE = '42501'; END IF;
      v_rank := p_payload->>'rank';
      v_factor := CASE v_rank WHEN 'E' THEN 1 WHEN 'D' THEN 2 WHEN 'C' THEN 3
        WHEN 'B' THEN 4 WHEN 'A' THEN 5 WHEN 'S' THEN 6 WHEN 'SS' THEN 6 ELSE 0 END;
      IF v_factor = 0 OR NULLIF(btrim(p_payload->>'title'), '') IS NULL
        OR length(p_payload->>'title') > 160 THEN
        RAISE EXCEPTION 'INVALID_GUILD_QUEST' USING ERRCODE = '22023';
      END IF;
      INSERT INTO public.guild_quests (
        guild_id, source_quest_id, title, rank, rewards
      ) VALUES (
        p_guild_id, NULLIF(p_payload->>'source_quest_id', ''), btrim(p_payload->>'title'), v_rank,
        jsonb_build_object('currency', 'gate', 'funds', 50 * v_factor, 'contribution', 20 * v_factor)
      ) RETURNING id INTO v_quest_id;
      RETURN jsonb_build_object('quest_id', v_quest_id);

    WHEN 'assign_quest_squad' THEN
      IF v_actor_rank < 2 THEN RAISE EXCEPTION 'GUILD_QUEST_MANAGEMENT_FORBIDDEN' USING ERRCODE = '42501'; END IF;
      v_member_ids := p_payload->'member_ids';
      IF jsonb_typeof(v_member_ids) IS DISTINCT FROM 'array' THEN
        RAISE EXCEPTION 'INVALID_GUILD_SQUAD' USING ERRCODE = '22023';
      END IF;
      IF jsonb_array_length(v_member_ids) > 50 THEN
        RAISE EXCEPTION 'INVALID_GUILD_SQUAD' USING ERRCODE = '22023';
      END IF;
      IF EXISTS (
        SELECT 1 FROM jsonb_array_elements_text(v_member_ids) AS selected(member_id)
        WHERE NOT EXISTS (
          SELECT 1 FROM public.guild_members AS member_row
          WHERE member_row.id = selected.member_id::UUID AND member_row.guild_id = p_guild_id
        )
      ) THEN RAISE EXCEPTION 'GUILD_SQUAD_MEMBER_NOT_FOUND' USING ERRCODE = '22023'; END IF;
      UPDATE public.guild_quests SET assigned_member_ids = v_member_ids
      WHERE id = NULLIF(p_payload->>'quest_id', '')::UUID
        AND guild_id = p_guild_id AND status = 'active';
      IF NOT FOUND THEN RAISE EXCEPTION 'ACTIVE_GUILD_QUEST_NOT_FOUND' USING ERRCODE = 'P0002'; END IF;
      RETURN jsonb_build_object('assigned', true);

    WHEN 'reject_join_request' THEN
      IF v_actor_rank < 3 THEN RAISE EXCEPTION 'GUILD_JOIN_REVIEW_FORBIDDEN' USING ERRCODE = '42501'; END IF;
      UPDATE public.guild_join_requests SET
        status = 'rejected', resolved_at = now(), resolved_by = v_actor
      WHERE id = NULLIF(p_payload->>'request_id', '')::UUID
        AND guild_id = p_guild_id AND status = 'pending';
      IF NOT FOUND THEN RAISE EXCEPTION 'PENDING_GUILD_REQUEST_NOT_FOUND' USING ERRCODE = 'P0002'; END IF;
      RETURN jsonb_build_object('rejected', true);

    ELSE
      RAISE EXCEPTION 'UNKNOWN_GUILD_ACTION' USING ERRCODE = '22023';
  END CASE;
END;
$$;

REVOKE ALL ON FUNCTION public.guild_admin_action(UUID, TEXT, JSONB)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.guild_admin_action(UUID, TEXT, JSONB)
  TO authenticated;

-- Creation is bound to the authenticated actor; client-supplied leader IDs can
-- no longer create a guild for another account.
CREATE OR REPLACE FUNCTION public.create_guild_with_code(
  p_name TEXT,
  p_description TEXT,
  p_motto TEXT,
  p_leader_user_id UUID,
  p_campaign_id UUID DEFAULT NULL,
  p_character_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_guild_id UUID;
  v_share_code TEXT;
BEGIN
  IF v_actor IS NULL OR p_leader_user_id IS DISTINCT FROM v_actor THEN
    RAISE EXCEPTION 'GUILD_CREATOR_MUST_BE_ACTOR' USING ERRCODE = '42501';
  END IF;
  IF NULLIF(btrim(p_name), '') IS NULL THEN
    RAISE EXCEPTION 'GUILD_NAME_REQUIRED' USING ERRCODE = '22023';
  END IF;
  IF p_character_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM public.characters AS character_row
    WHERE character_row.id = p_character_id AND character_row.user_id = v_actor
  ) THEN
    RAISE EXCEPTION 'GUILD_FOUNDING_CHARACTER_NOT_OWNED' USING ERRCODE = '42501';
  END IF;
  IF p_campaign_id IS NOT NULL AND NOT (
    EXISTS (SELECT 1 FROM public.campaigns WHERE id = p_campaign_id AND warden_id = v_actor)
    OR EXISTS (SELECT 1 FROM public.campaign_members WHERE campaign_id = p_campaign_id AND user_id = v_actor)
  ) THEN
    RAISE EXCEPTION 'GUILD_CAMPAIGN_MEMBERSHIP_REQUIRED' USING ERRCODE = '42501';
  END IF;

  LOOP
    v_share_code := public.generate_share_code();
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.guilds WHERE share_code = v_share_code);
  END LOOP;

  INSERT INTO public.guilds (name, description, motto, leader_user_id, campaign_id, share_code)
  VALUES (btrim(p_name), NULLIF(btrim(COALESCE(p_description, '')), ''),
    NULLIF(btrim(COALESCE(p_motto, '')), ''), v_actor, p_campaign_id, v_share_code)
  RETURNING id INTO v_guild_id;

  INSERT INTO public.guild_members (guild_id, user_id, character_id, role)
  VALUES (v_guild_id, v_actor, p_character_id, 'leader');
  RETURN v_guild_id;
END;
$$;

REVOKE ALL ON FUNCTION public.create_guild_with_code(TEXT, TEXT, TEXT, UUID, UUID, UUID)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_guild_with_code(TEXT, TEXT, TEXT, UUID, UUID, UUID)
  TO authenticated;

CREATE OR REPLACE FUNCTION public.approve_guild_join_request(
  p_request_id UUID,
  p_role TEXT DEFAULT 'member'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_req public.guild_join_requests%ROWTYPE;
  v_actor_role TEXT;
  v_guild_leader UUID;
  v_guild_id UUID;
  v_member_id UUID;
BEGIN
  IF v_actor IS NULL THEN RAISE EXCEPTION 'AUTH_REQUIRED' USING ERRCODE = '42501'; END IF;
  SELECT guild_id INTO v_guild_id FROM public.guild_join_requests
  WHERE id = p_request_id AND status = 'pending';
  IF NOT FOUND THEN RAISE EXCEPTION 'JOIN_REQUEST_NOT_PENDING' USING ERRCODE = 'P0002'; END IF;
  SELECT leader_user_id INTO v_guild_leader
  FROM public.guilds WHERE id = v_guild_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'GUILD_NOT_FOUND' USING ERRCODE = 'P0002'; END IF;
  SELECT * INTO v_req FROM public.guild_join_requests
  WHERE id = p_request_id AND guild_id = v_guild_id AND status = 'pending' FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'JOIN_REQUEST_NOT_PENDING' USING ERRCODE = 'P0002'; END IF;
  IF v_guild_leader = v_actor THEN
    v_actor_role := 'leader';
  ELSE
    v_actor_role := public.guild_member_role(v_req.guild_id, v_actor);
  END IF;
  IF v_actor_role NOT IN ('leader', 'vice_master') THEN
    RAISE EXCEPTION 'GUILD_JOIN_REVIEW_FORBIDDEN' USING ERRCODE = '42501';
  END IF;
  IF (v_req.character_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM public.characters
    WHERE id = v_req.character_id AND user_id = v_req.user_id
  )) THEN
    RAISE EXCEPTION 'JOIN_REQUEST_CHARACTER_INVALID' USING ERRCODE = '42501';
  END IF;
  IF p_role IS NULL OR p_role NOT IN ('officer', 'member', 'recruit') THEN
    RAISE EXCEPTION 'INVALID_ROLE_FOR_APPROVER' USING ERRCODE = '42501';
  END IF;

  INSERT INTO public.guild_members (guild_id, user_id, character_id, role)
  VALUES (v_req.guild_id, v_req.user_id, v_req.character_id, p_role)
  RETURNING id INTO v_member_id;
  UPDATE public.guild_join_requests SET
    status = 'approved', resolved_at = now(), resolved_by = v_actor
  WHERE id = p_request_id;
  RETURN v_member_id;
END;
$$;

REVOKE ALL ON FUNCTION public.approve_guild_join_request(UUID, TEXT)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.approve_guild_join_request(UUID, TEXT)
  TO authenticated;

-- Remove every direct write policy, including historical permissive policies.
DO $$
DECLARE
  policy_row RECORD;
BEGIN
  FOR policy_row IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('guilds', 'guild_members', 'guild_quests', 'guild_join_requests')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I',
      policy_row.policyname, policy_row.schemaname, policy_row.tablename);
  END LOOP;
END;
$$;

CREATE POLICY guilds_select ON public.guilds
  FOR SELECT TO authenticated
  USING (
    leader_user_id = (SELECT auth.uid())
    OR public.guild_member_role(guilds.id, (SELECT auth.uid())) IS NOT NULL
  );

CREATE POLICY guild_members_select ON public.guild_members
  FOR SELECT TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    OR character_id IN (SELECT id FROM public.characters WHERE user_id = (SELECT auth.uid()))
    OR public.guild_member_role(guild_members.guild_id, (SELECT auth.uid())) IS NOT NULL
  );

CREATE POLICY guild_quests_select ON public.guild_quests
  FOR SELECT TO authenticated
  USING (
    public.guild_member_role(guild_quests.guild_id, (SELECT auth.uid())) IS NOT NULL
  );

CREATE POLICY guild_join_requests_select ON public.guild_join_requests
  FOR SELECT TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    OR EXISTS (SELECT 1 FROM public.guilds AS guild_row
      WHERE guild_row.id = guild_join_requests.guild_id AND guild_row.leader_user_id = (SELECT auth.uid()))
    OR public.guild_member_role(guild_id, (SELECT auth.uid())) IN ('leader', 'vice_master')
  );

REVOKE INSERT, UPDATE, DELETE ON public.guilds, public.guild_members,
  public.guild_quests, public.guild_join_requests FROM authenticated;

-- Regent unlock reads for Warden-side screens include explicitly linked
-- secondary characters and campaign shares. Mutations stay on the actor-checked
-- import, grant-consumption, catch-up, and removal RPCs.
DO $$
DECLARE policy_row RECORD;
BEGIN
  FOR policy_row IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'character_regent_unlocks'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.character_regent_unlocks', policy_row.policyname);
  END LOOP;
  FOR policy_row IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'character_regent_unlock_grants'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.character_regent_unlock_grants', policy_row.policyname);
  END LOOP;
END;
$$;

CREATE POLICY regent_unlocks_select ON public.character_regent_unlocks
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.characters AS character_row
      WHERE character_row.id = character_regent_unlocks.character_id
        AND character_row.user_id = (SELECT auth.uid()))
    OR EXISTS (SELECT 1 FROM public.campaigns AS campaign_row
      WHERE public.is_campaign_system(campaign_row.id, (SELECT auth.uid()))
        AND app_private.campaign_character_is_linked(campaign_row.id, character_regent_unlocks.character_id))
  );
REVOKE INSERT, UPDATE, DELETE ON public.character_regent_unlocks FROM authenticated;

-- Offer/grant mutation already uses actor-checked RPCs; remove the permissive
-- direct UPDATE path so owners cannot rewrite a Warden-authored offer payload.
CREATE POLICY regent_unlock_grants_select ON public.character_regent_unlock_grants
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.characters AS character_row
      WHERE character_row.id = character_regent_unlock_grants.character_id
        AND character_row.user_id = (SELECT auth.uid()))
    OR EXISTS (SELECT 1 FROM public.campaigns AS campaign_row
      WHERE public.is_campaign_system(campaign_row.id, (SELECT auth.uid()))
        AND app_private.campaign_character_is_linked(
          campaign_row.id, character_regent_unlock_grants.character_id))
  );
REVOKE INSERT, UPDATE, DELETE ON public.character_regent_unlock_grants FROM authenticated;

-- Pending imported grants are visible to their owner and the Warden of the
-- campaign only when the character is explicitly linked to that roster.
DROP POLICY IF EXISTS pending_regent_grants_owner_select
  ON public.character_pending_regent_grants;
CREATE POLICY pending_regent_grants_owner_select
  ON public.character_pending_regent_grants FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.characters AS character_row
      WHERE character_row.id = character_pending_regent_grants.character_id
        AND character_row.user_id = (SELECT auth.uid()))
    OR EXISTS (SELECT 1 FROM public.campaigns AS campaign_row
      WHERE public.is_campaign_system(campaign_row.id, (SELECT auth.uid()))
        AND app_private.campaign_character_is_linked(
          campaign_row.id, character_pending_regent_grants.character_id))
  );
NOTIFY pgrst, 'reload schema';
COMMIT;
