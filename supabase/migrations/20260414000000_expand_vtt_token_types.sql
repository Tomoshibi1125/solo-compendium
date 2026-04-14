-- Expand VTT token types and add first-class positional columns for performance
BEGIN;

-- 1. Correct the token_type check constraint
ALTER TABLE public.vtt_tokens 
  DROP CONSTRAINT IF EXISTS vtt_tokens_token_type_check;

ALTER TABLE public.vtt_tokens
  ADD CONSTRAINT vtt_tokens_token_type_check 
  CHECK (token_type IN (
    'player', 'monster', 'npc', 'object', 
    'actor', 'prop', 'effect', 'handout', 
    'custom', 'character', 'Anomaly'
  ));

-- 2. Add additional first-class columns to avoid JSONB overhead in high-frequency realtime updates
ALTER TABLE public.vtt_tokens 
  ADD COLUMN IF NOT EXISTS rotation INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS layer INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS locked BOOLEAN NOT NULL DEFAULT false;

-- 3. Ensure RLS allows the expanded classifications (existing policies use session_id/dm_id checks, so they should remain valid)

COMMENT ON COLUMN public.vtt_tokens.token_type IS 'Expanded classifications including actor, effect, and specialized Compendium types.';

COMMIT;
