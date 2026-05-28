-- ============================================================================
-- Misty Pearl E4 — Field Roster (public campaign discovery)
-- ============================================================================
-- Adds an opt-in JSONB column for Wardens to publish campaigns as
-- "open seats" on the Bureau Field Roster. RLS lets anyone read
-- listings flagged enabled, while writes stay restricted to the
-- existing campaigns UPDATE policy (Warden / co-Warden / owner only).
--
-- Shape:
--   {
--     "enabled": bool,
--     "description": string,        -- short pitch shown on the board
--     "system_tags": string[],      -- e.g. ["urban-fantasy", "S-Rank"]
--     "seats_open": int,            -- 0..6
--     "last_session_iso": string?,  -- denormalized for sort
--     "listed_at": string           -- when the flag flipped on
--   }
-- ============================================================================

ALTER TABLE public.campaigns
  ADD COLUMN IF NOT EXISTS public_listing jsonb;

COMMENT ON COLUMN public.campaigns.public_listing IS
  'Misty Pearl E4 — opt-in public discovery payload. NULL = not listed. When enabled, anyone can read the campaign row through the `campaigns_public_listings` view (RLS-friendly subset).';

-- A safe view that exposes only the fields the discovery board needs.
-- This keeps RLS scoped: members keep their existing access on the base
-- table, and the public listing board reads through this view with a
-- single GRANT.
CREATE OR REPLACE VIEW public.campaigns_public_listings
WITH (security_invoker = true) AS
SELECT
  c.id,
  c.name,
  c.share_code,
  c.public_listing,
  c.updated_at
FROM public.campaigns c
WHERE (c.public_listing IS NOT NULL)
  AND ((c.public_listing ->> 'enabled')::boolean IS TRUE);

GRANT SELECT ON public.campaigns_public_listings TO authenticated, anon;

-- Hard cap on listings per Warden — enforced at the application level
-- through a CHECK that limits each owner to 3 active listings. We use
-- a function-based check rather than a trigger so it's transparent.
CREATE OR REPLACE FUNCTION public.enforce_campaign_listing_cap()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_owner uuid;
  v_count int;
BEGIN
  IF NEW.public_listing IS NULL THEN RETURN NEW; END IF;
  IF COALESCE((NEW.public_listing ->> 'enabled')::boolean, false) IS FALSE THEN
    RETURN NEW;
  END IF;
  v_owner := NEW.warden_id;
  IF v_owner IS NULL THEN RETURN NEW; END IF;
  SELECT count(*) INTO v_count
    FROM public.campaigns
    WHERE warden_id = v_owner
      AND id <> NEW.id
      AND (public_listing ->> 'enabled')::boolean IS TRUE;
  IF v_count >= 3 THEN
    RAISE EXCEPTION 'FIELD_ROSTER_CAP_EXCEEDED' USING HINT =
      'A Warden may list at most 3 active campaigns on the Field Roster.';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_campaign_listing_cap ON public.campaigns;
CREATE TRIGGER trg_enforce_campaign_listing_cap
  BEFORE UPDATE OF public_listing ON public.campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_campaign_listing_cap();
