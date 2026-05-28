-- F6 of May 2026 remediation plan: marketplace gifting + bundles.
-- Closes the marketplace gap from the May audit (no gifting, no bundle
-- composite items). Adds schema for both plus a `gift_marketplace_item`
-- RPC that mirrors the existing entitlement model.

-- Schema additions ----------------------------------------------------

ALTER TABLE public.marketplace_items
	ADD COLUMN IF NOT EXISTS is_bundle BOOLEAN NOT NULL DEFAULT false,
	ADD COLUMN IF NOT EXISTS bundled_item_ids UUID[] DEFAULT NULL;

ALTER TABLE public.user_marketplace_entitlements
	ADD COLUMN IF NOT EXISTS gifted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
	ADD COLUMN IF NOT EXISTS gift_message TEXT;

COMMENT ON COLUMN public.marketplace_items.is_bundle IS
	'When true, this item is a composite — granting entitlement to it also grants entitlement to every item in bundled_item_ids.';
COMMENT ON COLUMN public.marketplace_items.bundled_item_ids IS
	'Child item IDs for a bundle. Only meaningful when is_bundle = true.';
COMMENT ON COLUMN public.user_marketplace_entitlements.gifted_by IS
	'When non-null, this entitlement was granted as a gift from another user. Null on purchases / author grants.';
COMMENT ON COLUMN public.user_marketplace_entitlements.gift_message IS
	'Optional short note attached to a gifted entitlement (e.g. "Welcome to the campaign!").';

CREATE INDEX IF NOT EXISTS marketplace_items_bundle_idx
	ON public.marketplace_items(is_bundle)
	WHERE is_bundle = true;

-- RPC: gift_marketplace_item ----------------------------------------
-- Grants the recipient entitlement to the item (and every bundle child
-- if applicable). The caller must already be entitled to the item.

CREATE OR REPLACE FUNCTION public.gift_marketplace_item(
	p_item_id UUID,
	p_recipient_user_id UUID,
	p_message TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
	v_giver UUID := auth.uid();
	v_is_bundle BOOLEAN;
	v_bundled UUID[];
	v_caller_entitled BOOLEAN;
	v_new_entitlement UUID;
	v_child UUID;
BEGIN
	IF v_giver IS NULL THEN
		RAISE EXCEPTION 'AUTH_REQUIRED';
	END IF;

	IF p_recipient_user_id IS NULL OR p_recipient_user_id = v_giver THEN
		RAISE EXCEPTION 'INVALID_RECIPIENT';
	END IF;

	-- Caller must be entitled to gift (own purchase / author / free).
	SELECT public.user_has_marketplace_access(p_item_id, v_giver)
		INTO v_caller_entitled;
	IF NOT v_caller_entitled THEN
		RAISE EXCEPTION 'GIFT_NOT_ENTITLED';
	END IF;

	SELECT is_bundle, bundled_item_ids
		INTO v_is_bundle, v_bundled
		FROM public.marketplace_items
		WHERE id = p_item_id;

	IF NOT FOUND THEN
		RAISE EXCEPTION 'ITEM_NOT_FOUND';
	END IF;

	-- Insert the primary entitlement (no-op if already entitled).
	INSERT INTO public.user_marketplace_entitlements (
		user_id, item_id, gifted_by, gift_message
	)
	VALUES (
		p_recipient_user_id, p_item_id, v_giver, NULLIF(TRIM(p_message), '')
	)
	ON CONFLICT (user_id, item_id) DO NOTHING
	RETURNING id INTO v_new_entitlement;

	-- Bundle: insert child entitlements too.
	IF v_is_bundle AND v_bundled IS NOT NULL THEN
		FOREACH v_child IN ARRAY v_bundled LOOP
			INSERT INTO public.user_marketplace_entitlements (
				user_id, item_id, gifted_by, gift_message
			)
			VALUES (
				p_recipient_user_id, v_child, v_giver, NULLIF(TRIM(p_message), '')
			)
			ON CONFLICT (user_id, item_id) DO NOTHING;
		END LOOP;
	END IF;

	RETURN COALESCE(v_new_entitlement, p_item_id);
END;
$$;

GRANT EXECUTE ON FUNCTION public.gift_marketplace_item(UUID, UUID, TEXT)
	TO authenticated;

COMMENT ON FUNCTION public.gift_marketplace_item IS
	'Gift a marketplace item to another user. Caller must be entitled; bundles fan out to child entitlements. Errors: AUTH_REQUIRED, INVALID_RECIPIENT, GIFT_NOT_ENTITLED, ITEM_NOT_FOUND.';
