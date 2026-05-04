CREATE TABLE IF NOT EXISTS public.character_tattoos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id uuid NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  tattoo_id text,
  name text NOT NULL,
  body_part text,
  is_active boolean NOT NULL DEFAULT true,
  is_attuned boolean NOT NULL DEFAULT false,
  requires_attunement boolean NOT NULL DEFAULT false,
  source text,
  custom_effects jsonb,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_character_tattoos_character_id
  ON public.character_tattoos(character_id);

CREATE INDEX IF NOT EXISTS idx_character_tattoos_tattoo_id
  ON public.character_tattoos(tattoo_id);

ALTER TABLE public.character_tattoos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS character_tattoos_select ON public.character_tattoos;
CREATE POLICY character_tattoos_select
  ON public.character_tattoos
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.characters c
      WHERE c.id = public.character_tattoos.character_id
        AND c.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS character_tattoos_insert ON public.character_tattoos;
CREATE POLICY character_tattoos_insert
  ON public.character_tattoos
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.characters c
      WHERE c.id = public.character_tattoos.character_id
        AND c.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS character_tattoos_update ON public.character_tattoos;
CREATE POLICY character_tattoos_update
  ON public.character_tattoos
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.characters c
      WHERE c.id = public.character_tattoos.character_id
        AND c.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.characters c
      WHERE c.id = public.character_tattoos.character_id
        AND c.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS character_tattoos_delete ON public.character_tattoos;
CREATE POLICY character_tattoos_delete
  ON public.character_tattoos
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.characters c
      WHERE c.id = public.character_tattoos.character_id
        AND c.user_id = auth.uid()
    )
  );

DROP TRIGGER IF EXISTS update_character_tattoos_updated_at ON public.character_tattoos;
CREATE TRIGGER update_character_tattoos_updated_at
  BEFORE UPDATE ON public.character_tattoos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
