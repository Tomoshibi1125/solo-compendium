-- Fix Supabase Database Linter Security Warnings
-- 1. Set search_path on all flagged functions
-- 2. Replace overly-permissive RLS policies with service_role-only INSERT/UPDATE
-- 3. Drop orphaned join_campaign_by_code and join_campaign_by_id functions

-- ========================================================================
-- SECTION 1: Fix function_search_path_mutable warnings
-- All functions must have SET search_path to prevent search_path injection.
-- ========================================================================

-- 1a. update_modified_column - trigger function
CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public;

-- 1b. exec_sql - SECURITY DEFINER utility function
CREATE OR REPLACE FUNCTION public.exec_sql(sql_string text)
RETURNS void AS $$
BEGIN
    EXECUTE sql_string;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

-- 1c. create_campaign_with_code - campaign creation function
CREATE OR REPLACE FUNCTION public.create_campaign_with_code(
  p_name TEXT,
  p_description TEXT,
  p_warden_id UUID
)
RETURNS UUID AS $$
DECLARE
  v_campaign_id UUID;
  v_share_code TEXT;
  max_attempts INTEGER := 10;
  attempts INTEGER := 0;
BEGIN
  LOOP
    v_share_code := public.generate_share_code();

    -- Check if code already exists
    IF NOT EXISTS (SELECT 1 FROM public.campaigns WHERE share_code = v_share_code) THEN
      EXIT;
    END IF;

    attempts := attempts + 1;
    IF attempts >= max_attempts THEN
      RAISE EXCEPTION 'Failed to generate unique share code after % attempts', max_attempts;
    END IF;
  END LOOP;

  -- Create campaign
  INSERT INTO public.campaigns (name, description, warden_id, share_code)
  VALUES (p_name, p_description, p_warden_id, v_share_code)
  RETURNING id INTO v_campaign_id;

  -- Add Warden as member
  INSERT INTO public.campaign_members (campaign_id, user_id, role)
  VALUES (v_campaign_id, p_warden_id, 'warden');

  RETURN v_campaign_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

GRANT EXECUTE ON FUNCTION public.create_campaign_with_code(TEXT, TEXT, UUID) TO authenticated;

-- 1d. create_guild_with_code - guild creation function
CREATE OR REPLACE FUNCTION public.create_guild_with_code(
  p_name TEXT,
  p_description TEXT,
  p_motto TEXT,
  p_leader_user_id UUID,
  p_campaign_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_guild_id UUID;
  v_share_code TEXT;
  max_attempts INTEGER := 10;
  attempts INTEGER := 0;
BEGIN
  LOOP
    v_share_code := public.generate_share_code();
    IF NOT EXISTS (SELECT 1 FROM public.guilds WHERE share_code = v_share_code) THEN
      EXIT;
    END IF;
    attempts := attempts + 1;
    IF attempts >= max_attempts THEN
      RAISE EXCEPTION 'Failed to generate unique share code after % attempts', max_attempts;
    END IF;
  END LOOP;

  INSERT INTO public.guilds (name, description, motto, leader_user_id, campaign_id, share_code)
  VALUES (p_name, p_description, p_motto, p_leader_user_id, p_campaign_id, v_share_code)
  RETURNING id INTO v_guild_id;

  INSERT INTO public.guild_members (guild_id, user_id, role)
  VALUES (v_guild_id, p_leader_user_id, 'leader');

  RETURN v_guild_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

GRANT EXECUTE ON FUNCTION public.create_guild_with_code(TEXT, TEXT, TEXT, UUID, UUID) TO authenticated;

-- 1e. Drop orphaned functions that exist in the database but have no definition
--     in any migration or application code. These were likely created by earlier
--     migrations that have since been superseded.
DROP FUNCTION IF EXISTS public.join_campaign_by_code(TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.join_campaign_by_code(TEXT, UUID) CASCADE;
DROP FUNCTION IF EXISTS public.join_campaign_by_id(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.join_campaign_by_id(UUID, UUID) CASCADE;

-- ========================================================================
-- SECTION 2: Fix rls_policy_always_true warnings
-- These compendium tables are system-seeded reference data.
-- Authenticated users only read; writes are restricted to service_role.
-- ========================================================================

-- 2a. compendium_locations
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.compendium_locations;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.compendium_locations;

CREATE POLICY "Service role insert for compendium_locations"
  ON public.compendium_locations FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role update for compendium_locations"
  ON public.compendium_locations FOR UPDATE
  TO service_role
  USING (true);

-- 2b. compendium_spells
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.compendium_spells;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.compendium_spells;

CREATE POLICY "Service role insert for compendium_spells"
  ON public.compendium_spells FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role update for compendium_spells"
  ON public.compendium_spells FOR UPDATE
  TO service_role
  USING (true);

-- 2c. compendium_tattoos
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.compendium_tattoos;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.compendium_tattoos;

CREATE POLICY "Service role insert for compendium_tattoos"
  ON public.compendium_tattoos FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role update for compendium_tattoos"
  ON public.compendium_tattoos FOR UPDATE
  TO service_role
  USING (true);
