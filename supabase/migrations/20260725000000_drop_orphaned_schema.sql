-- ============================================================================
-- Drop orphaned / never-wired schema  (Phase 1 of the DB remediation program)
-- ============================================================================
-- Every object below was verified: (1) referenced NOWHERE — not in the app
-- (`src/**`, incl. .from()/.rpc()/relationship-embeds), not in edge functions,
-- not in any RLS policy / trigger body; and (2) EMPTY on prod (0 live rows).
--
-- Categories dropped here (independent dead clusters only):
--   * Audio tables — the audio/VTT layer was scraped (aiAudio deleted).
--   * Paywall / sourcebook-entitlement layer — the app is 100% free forever;
--     never wired, contradicts the model (incl. campaign_sourcebook_shares).
--   * VTT / Discord — voice/Discord integration is out of scope (VTT-related).
--   * AI telemetry/cache — designed but never wired (owner chose not to wire).
--   * Misc verified-unused: character_templates, saved_searches, entity_assets,
--     campaign_content, validate_level_gate, entity-asset RPCs.
--
-- DEFERRED to Phase 3 (NOT dropped here): the active_sessions / session_participants
-- / combat_actions / combat_participants cluster + its session/combat functions —
-- the quest system (session_quests, being WIRED in Phase 3) has an FK to
-- active_sessions, so this cluster is redesigned + dropped together with the quest
-- work, not half-removed now.
--
-- NOT dropped (verified still in use): character_shadow_army (export/import bulk
-- summons), user_profiles (campaign-analytics join), character_shares (character
-- sharing via generate_character_share_token). calculate_shadow_energy_max is kept
-- for Phase 4 (umbral-energy economy).
--
-- Reversibility: the original CREATE statements live in this migrations/ history,
-- so any object can be recreated. The dropped tables hold no live app data.
-- ============================================================================

-- ── Tables (CASCADE clears dependent FKs / policies / indexes / views) ──────
-- Scraped audio layer
DROP TABLE IF EXISTS public.audio_tracks CASCADE;
DROP TABLE IF EXISTS public.audio_playlists CASCADE;

-- Paywall / sourcebook-entitlement layer (free-forever app)
DROP TABLE IF EXISTS public.marketplace_downloads CASCADE;
DROP TABLE IF EXISTS public.campaign_sourcebook_shares CASCADE;
DROP TABLE IF EXISTS public.user_sourcebook_entitlements CASCADE;
DROP TABLE IF EXISTS public.sourcebook_catalog CASCADE;

-- VTT / Discord integration (out of scope)
DROP TABLE IF EXISTS public.discord_command_audit CASCADE;
DROP TABLE IF EXISTS public.discord_account_links CASCADE;

-- AI telemetry / cache (never wired)
DROP TABLE IF EXISTS public.ai_usage_logs CASCADE;
DROP TABLE IF EXISTS public.ai_generated_content CASCADE;

-- Misc verified-unused
DROP TABLE IF EXISTS public.campaign_content CASCADE;
DROP TABLE IF EXISTS public.character_templates CASCADE;
DROP TABLE IF EXISTS public.saved_searches CASCADE;
DROP TABLE IF EXISTS public.entity_assets CASCADE;

-- ── Functions (drop every overload of each name in public) ──────────────────
DO $$
DECLARE
  fn text;
  fnames text[] := ARRAY[
    -- paywall / sourcebook entitlement
    'upsert_user_sourcebook_entitlement','user_has_sourcebook_access','user_has_marketplace_access','share_campaign_sourcebook',
    -- AI telemetry / cache
    'log_ai_usage','store_ai_generated_content','get_ai_generated_content','get_ai_usage_stats','enhance_art_prompt',
    -- misc verified-unused
    'validate_level_gate','get_entity_assets','get_asset_paths'
  ];
  r record;
BEGIN
  FOREACH fn IN ARRAY fnames LOOP
    FOR r IN
      SELECT p.oid::regprocedure AS sig
      FROM pg_proc p
      JOIN pg_namespace n ON n.oid = p.pronamespace
      WHERE n.nspname = 'public' AND p.proname = fn
    LOOP
      EXECUTE format('DROP FUNCTION IF EXISTS %s CASCADE', r.sig);
    END LOOP;
  END LOOP;
END $$;
