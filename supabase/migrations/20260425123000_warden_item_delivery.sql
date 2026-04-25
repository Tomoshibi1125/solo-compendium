CREATE OR REPLACE FUNCTION public.warden_grant_character_equipment(
  p_campaign_id uuid,
  p_items jsonb
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor uuid := auth.uid();
  v_item jsonb;
  v_count integer := 0;
  v_character_id uuid;
  v_existing_id uuid;
  v_existing_quantity integer;
BEGIN
  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.campaigns c
    WHERE c.id = p_campaign_id
      AND c.warden_id = v_actor
  ) AND NOT EXISTS (
    SELECT 1
    FROM public.campaign_members cm
    WHERE cm.campaign_id = p_campaign_id
      AND cm.user_id = v_actor
      AND cm.role = 'co-warden'
  ) THEN
    RAISE EXCEPTION 'Only Wardens can grant equipment for this campaign';
  END IF;

  FOR v_item IN SELECT * FROM jsonb_array_elements(COALESCE(p_items, '[]'::jsonb))
  LOOP
    v_character_id := NULLIF(v_item->>'character_id', '')::uuid;

    IF v_character_id IS NULL THEN
      CONTINUE;
    END IF;

    IF NOT EXISTS (
      SELECT 1
      FROM public.campaign_members cm
      WHERE cm.campaign_id = p_campaign_id
        AND cm.character_id = v_character_id
    ) THEN
      RAISE EXCEPTION 'Target character is not linked to this campaign';
    END IF;

    SELECT ce.id, ce.quantity
    INTO v_existing_id, v_existing_quantity
    FROM public.character_equipment ce
    WHERE ce.character_id = v_character_id
      AND ce.name = COALESCE(v_item->>'name', '')
      AND ce.item_type = COALESCE(v_item->>'item_type', 'item')
    ORDER BY ce.created_at ASC
    LIMIT 1;

    IF v_existing_id IS NOT NULL THEN
      UPDATE public.character_equipment
      SET quantity = COALESCE(v_existing_quantity, 0) + COALESCE((v_item->>'quantity')::integer, 1)
      WHERE id = v_existing_id;
    ELSE
      INSERT INTO public.character_equipment (
        character_id,
        name,
        item_type,
        description,
        properties,
        weight,
        value_credits,
        quantity,
        is_equipped,
        is_attuned,
        requires_attunement,
        rarity,
        relic_tier,
        charges_current,
        charges_max,
        sigil_slots_base
      ) VALUES (
        v_character_id,
        COALESCE(v_item->>'name', 'Unknown Item'),
        COALESCE(v_item->>'item_type', 'item'),
        NULLIF(v_item->>'description', ''),
        CASE
          WHEN jsonb_typeof(v_item->'properties') = 'array'
          THEN ARRAY(SELECT jsonb_array_elements_text(v_item->'properties'))
          ELSE NULL
        END,
        NULLIF(v_item->>'weight', '')::numeric,
        NULLIF(v_item->>'value_credits', '')::integer,
        COALESCE((v_item->>'quantity')::integer, 1),
        COALESCE((v_item->>'is_equipped')::boolean, false),
        COALESCE((v_item->>'is_attuned')::boolean, false),
        COALESCE((v_item->>'requires_attunement')::boolean, false),
        CASE
          WHEN v_item->>'rarity' IN ('common', 'uncommon', 'rare', 'very_rare', 'legendary')
          THEN (v_item->>'rarity')::public.rarity
          ELSE NULL
        END,
        CASE
          WHEN v_item->>'relic_tier' IN ('dormant', 'awakened', 'resonant')
          THEN (v_item->>'relic_tier')::public.relic_tier
          ELSE NULL
        END,
        NULLIF(v_item->>'charges_current', '')::integer,
        NULLIF(v_item->>'charges_max', '')::integer,
        COALESCE((v_item->>'sigil_slots_base')::integer, 0)
      );
    END IF;

    v_count := v_count + 1;
  END LOOP;

  RETURN v_count;
END;
$$;

GRANT EXECUTE ON FUNCTION public.warden_grant_character_equipment(uuid, jsonb) TO authenticated;
