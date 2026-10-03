-- M3 reserves exact M1 lots. Manual M1 adjustments must not spend a quantity
-- already held by a project, even if the visible quantity is still positive.
BEGIN;

CREATE OR REPLACE FUNCTION app_private.guard_material_lot_reserved_quantity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_reserved NUMERIC;
BEGIN
  SELECT COALESCE(sum(reservation.quantity), 0) INTO v_reserved
  FROM public.material_lot_reservations AS reservation
  WHERE reservation.lot_id = NEW.id
    AND reservation.status = 'active';

  IF NEW.quantity < v_reserved THEN
    RAISE EXCEPTION 'MATERIAL_LOT_QUANTITY_RESERVED' USING ERRCODE = '22023';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS guard_material_lot_reserved_quantity
  ON public.material_lots;
CREATE TRIGGER guard_material_lot_reserved_quantity
BEFORE UPDATE OF quantity ON public.material_lots
FOR EACH ROW EXECUTE FUNCTION app_private.guard_material_lot_reserved_quantity();

REVOKE ALL ON FUNCTION app_private.guard_material_lot_reserved_quantity()
  FROM PUBLIC, anon, authenticated;

COMMIT;
