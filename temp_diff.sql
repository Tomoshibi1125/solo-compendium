node.exe : Creating shadow database...
At line:1 char:1
+ & "C:\Program Files\nodejs/node.exe" "C:\Program Files\nodejs/node_mo ...
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : NotSpecified: (Creating shadow database...:String) [], RemoteException
    + FullyQualifiedErrorId : NativeCommandError
 
Initialising schema...
Seeding globals from roles.sql...
Applying migration 20250109000001_setup_compendium_images_storage.sql...
Applying migration 20250116000000_setup_custom_tokens_storage.sql...
Applying migration 20260103121515_fb3216dd-1c7c-4408-8f9b-93791cdc96e5.sql...
Applying migration 20260103121521_3e3950db-c482-471d-8e2e-5f68041779a6.sql...
Applying migration 20260103121736_4560d3c6-08ab-41d6-8866-e87c543214b7.sql...
Applying migration 20260103124619_eebf11d0-f9e1-4850-b276-73c4935af3c3.sql...
Applying migration 20260103125922_04dde6c0-393c-4643-a766-8c9b271ba2cc.sql...
Applying migration 20260103132109_4307bfd3-5981-4ff0-a9e9-36a9f77ecf6e.sql...
Applying migration 20260103132613_994baacb-5348-49e9-9534-32a20a1b5b10.sql...
Applying migration 20260103132832_c5aaf263-5a02-4ef9-bd4f-2c4c3b4c18ad.sql...
Applying migration 20260103133027_15e077bb-12fe-4663-ac8e-48532d6fad8f.sql...
Applying migration 20260103133159_adb3d2b7-72ee-48b1-9e8b-dd2e5362112a.sql...
Applying migration 20260103133352_873327dd-8469-4872-9d84-e75a81817b70.sql...
Applying migration 20260103134050_54bc0718-5e0b-42a3-9a1a-18707f0bdb41.sql...
Applying migration 20260103134722_4878a3a9-c577-4ce9-ae24-57751c46ada5.sql...
Applying migration 20260103134846_f536bf0b-8aa0-4c0b-8215-5e60d18224df.sql...
Applying migration 20260103135159_be95f25f-c41c-4430-a968-d6d8215ebbbb.sql...
Applying migration 20260104000000_add_provenance_tracking.sql...
Applying migration 20260104000001_add_favorites.sql...
Applying migration 20260104000002_add_compendium_rls.sql...
Applying migration 20260104121419_15f9cd76-b54b-4594-be9f-bc63619a431b.sql...
Applying migration 20260104125806_bd02e25d-6866-4891-9e46-395931d3ed31.sql...
NOTICE (42P07): relation "user_favorites" already exists, skipping
Applying migration 20260104125814_7fa20e25-2562-4e42-9452-e3fc08cd7432.sql...
Applying migration 20260105000000_fill_srd_gaps.sql...
Applying migration 20260106000000_add_campaigns.sql...
NOTICE (42P07): relation "campaigns" already exists, skipping
NOTICE (42P07): relation "campaign_members" already exists, skipping
Applying migration 20260106000001_add_campaign_features.sql...
NOTICE (42P07): relation "campaign_messages" already exists, skipping
NOTICE (42P07): relation "campaign_notes" already exists, skipping
NOTICE (42P07): relation "campaign_character_shares" already exists, skipping
Applying migration 20260106000002_add_boss_miniboss_monsters.sql...
Applying migration 20260106000003_add_named_npcs_bosses.sql...
Applying migration 20260106000004_complete_job_path_monarch_features.sql...
Applying migration 20260106000005_complete_all_jobs_paths_monarchs.sql...
Applying migration 20260106000006_complete_paths_monarchs.sql...
Applying migration 20260106000007_fill_all_gaps_solo_leveling.sql...
NOTICE (42P07): relation "compendium_skills" already exists, skipping
Applying migration 20260106000008_complete_all_paths_monarchs_solo_leveling.sql...
Applying migration 20260106000009_finalize_remaining_paths_monarchs.sql...
Applying migration 20260106000010_complete_monarch_full_progressions.sql...
Applying migration 20260106000011_complete_remaining_monarchs_full_progressions.sql...
Applying migration 20260107000000_add_job_racial_features.sql...
Applying migration 20260107000001_create_runes_system.sql...
Applying migration 20260107000002_add_rune_use_tracking.sql...
Applying migration 20260107000003_comprehensive_5e_and_solo_leveling_alignment.sql...
Applying migration 20260107000004_fix_5e_mechanics_dc_calculations.sql...
Applying migration 20260108000000_add_shadow_soldiers.sql...
NOTICE (42P07): relation "compendium_shadow_soldiers" already exists, skipping
Applying migration 20260108000001_add_fulltext_search_functions.sql...
Applying migration 20260108000002_add_display_order_to_character_items.sql...
Applying migration 20260108000003_add_character_templates.sql...
Applying migration 20260108000004_add_shadow_army_tracking.sql...
Applying migration 20260108000005_add_sovereigns_and_monster_actions.sql...
Applying migration 20260109000000_add_user_profiles.sql...
NOTICE (00000): trigger "on_auth_user_created" for relation "auth.users" does not exist, skipping
Applying migration 20260110000000_add_character_share_tokens.sql...
Applying migration 20260111000000_add_spell_slot_tracking.sql...
Applying migration 20260112000000_add_compendium_display_names.sql...
Applying migration 20260113000000_daily_quests.sql...
Applying migration 20260113000001_art_assets.sql...
Applying migration 20260113000002_fix_search_path_security.sql...
NOTICE (00000): drop cascades to 12 other objects
NOTICE (00000): function public.on_long_rest_assign_quests(uuid) does not exist, skipping
NOTICE (00000): function public.get_asset_paths(text) does not exist, skipping
NOTICE (00000): function public.asset_exists(text) does not exist, skipping
NOTICE (00000): function public.search_compendium_jobs(text,pg_catalog.int4,pg_catalog.int4) does not exist, skipping
NOTICE (00000): function public.get_entity_assets(uuid,text) does not exist, skipping
NOTICE (00000): drop cascades to trigger update_character_templates_updated_at on table character_templates
NOTICE (00000): function public.calculate_shadow_energy_max(uuid) does not exist, skipping
NOTICE (00000): drop cascades to trigger on_auth_user_created on table auth.users
NOTICE (00000): function public.get_character_by_share_token(text) does not exist, skipping
NOTICE (00000): drop cascades to trigger update_character_spell_slots_updated_at on table character_spell_slots
NOTICE (00000): function public.search_compendium_relics(text,pg_catalog.int4,pg_catalog.int4) does not exist, skipping
NOTICE (00000): function public.search_compendium_powers(text,pg_catalog.int4,pg_catalog.int4) does not exist, skipping
NOTICE (00000): function public.search_compendium_monsters(text,pg_catalog.int4,pg_catalog.int4) does not exist, skipping
NOTICE (00000): function public.search_compendium_paths(text,pg_catalog.int4,pg_catalog.int4) does not exist, skipping
NOTICE (00000): function public.search_compendium_monarchs(text,pg_catalog.int4,pg_catalog.int4) does not exist, skipping
Applying migration 20260113000004_fix_search_path_security_corrected.sql...
Applying migration 20260113000005_verify_search_path_success.sql...
NOTICE (00000): Functions with proper search_path: 12
NOTICE (00000): Functions missing search_path: calculate_shadow_energy_max, get_character_by_share_token, search_compendium_jobs, search_compendium_powers, 
search_compendium_relics, search_compendium_monsters, search_compendium_paths, search_compendium_monarchs, on_long_rest_assign_quests, get_asset_paths, 
asset_exists, get_entity_assets
Applying migration 20260113000008_working_search_path_fix.sql...
Applying migration 20260113000009_final_verification.sql...
NOTICE (00000): === SEARCH_PATH VERIFICATION RESULTS ===
NOTICE (00000): Total functions checked: 12
NOTICE (00000): Functions with proper search_path: 12
NOTICE (00000): Γ¥î asset_exists: MISSING - Config: <NULL>
NOTICE (00000): Γ£à asset_exists: CONFIGURED
NOTICE (00000): Γ£à calculate_shadow_energy_max: CONFIGURED
NOTICE (00000): Γ¥î calculate_shadow_energy_max: MISSING - Config: <NULL>
NOTICE (00000): Γ£à get_asset_paths: CONFIGURED
NOTICE (00000): Γ¥î get_asset_paths: MISSING - Config: <NULL>
NOTICE (00000): Γ£à get_character_by_share_token: CONFIGURED
NOTICE (00000): Γ¥î get_character_by_share_token: MISSING - Config: <NULL>
NOTICE (00000): Γ¥î get_entity_assets: MISSING - Config: <NULL>
NOTICE (00000): Γ£à get_entity_assets: CONFIGURED
NOTICE (00000): Γ£à on_long_rest_assign_quests: CONFIGURED
NOTICE (00000): Γ¥î on_long_rest_assign_quests: MISSING - Config: <NULL>
NOTICE (00000): Γ£à search_compendium_jobs: CONFIGURED
NOTICE (00000): Γ¥î search_compendium_jobs: MISSING - Config: <NULL>
NOTICE (00000): Γ£à search_compendium_monarchs: CONFIGURED
NOTICE (00000): Γ¥î search_compendium_monarchs: MISSING - Config: <NULL>
NOTICE (00000): Γ£à search_compendium_monsters: CONFIGURED
NOTICE (00000): Γ¥î search_compendium_monsters: MISSING - Config: <NULL>
NOTICE (00000): Γ£à search_compendium_paths: CONFIGURED
NOTICE (00000): Γ¥î search_compendium_paths: MISSING - Config: <NULL>
NOTICE (00000): Γ£à search_compendium_powers: CONFIGURED
NOTICE (00000): Γ¥î search_compendium_powers: MISSING - Config: <NULL>
NOTICE (00000): Γ¥î search_compendium_relics: MISSING - Config: <NULL>
NOTICE (00000): Γ£à search_compendium_relics: CONFIGURED
NOTICE (00000): 
NOTICE (00000): ≡ƒÄë SUCCESS: All 12 functions have proper search_path configuration!
NOTICE (00000): ≡ƒöÆ Security: Function Search Path Mutable warnings should be RESOLVED!
NOTICE (00000): ≡ƒÜÇ Ready: Supabase Security Advisor should show clean results!
NOTICE (00000): 
NOTICE (00000): === END VERIFICATION ===
Applying migration 20260113000010_force_cache_refresh.sql...
NOTICE (00000): Γ£à on_long_rest_assign_quests: Search path properly configured
Applying migration 20260113000012_fix_function_search_path.sql...
Applying migration 20260113000013_simple_cache_refresh.sql...
NOTICE (00000): 
NOTICE (00000): ≡ƒÄë FINAL VERIFICATION SUCCESSFUL
NOTICE (00000): Γ£à All 12 functions have proper search_path configuration
NOTICE (00000): ≡ƒöÆ Security: Function Search Path Mutable warnings RESOLVED
NOTICE (00000): ΓÅ░ Dashboard refresh: May take up to 10 minutes for Security Advisor to update
NOTICE (00000): 
Applying migration 20260113000014_ai_integration_functions.sql...
Applying migration 20260113000015_fix_function_search_path.sql...
Applying migration 20260116000000_fix_campaign_rls_daily_quests_ai.sql...
Applying migration 20260116000001_add_character_experience.sql...
Applying migration 20260117000000_setup_generated_art_storage.sql...
Applying migration 20260118000000_fix_storage_policies.sql...
Applying migration 20260119000000_update_storage_allowed_mime_types.sql...
Applying migration 20260120000000_recreate_generated_art_bucket.sql...
Applying migration 20260120000001_recreate_generated_art_bucket_again.sql...
Applying migration 20260120000002_update_generated_art_mime_types.sql...
Applying migration 20260120000003_add_avif_mime_types.sql...
Applying migration 20260120000004_add_character_sheet_state.sql...
Applying migration 20260121000000_add_profiles_insert_policy.sql...
NOTICE (00000): policy "Users can insert their own profile" for relation "public.profiles" does not exist, skipping
Applying migration 20260121000001_restore_handle_new_user.sql...
NOTICE (00000): trigger "on_auth_user_created" for relation "auth.users" does not exist, skipping
Applying migration 20260121000002_fix_campaign_rls_recursion.sql...
NOTICE (00000): policy "Users can view campaigns they DM or are members of" for relation "public.campaigns" does not exist, skipping
NOTICE (00000): policy "DMs can create campaigns" for relation "public.campaigns" does not exist, skipping
NOTICE (00000): policy "DMs can update their own campaigns" for relation "public.campaigns" does not exist, skipping
NOTICE (00000): policy "DMs can delete their own campaigns" for relation "public.campaigns" does not exist, skipping
NOTICE (00000): policy "campaign_members_update" for relation "public.campaign_members" does not exist, skipping
NOTICE (00000): policy "Users can view members of their campaigns" for relation "public.campaign_members" does not exist, skipping
NOTICE (00000): policy "DMs can add members to their campaigns" for relation "public.campaign_members" does not exist, skipping
NOTICE (00000): policy "Users can join campaigns via share code" for relation "public.campaign_members" does not exist, skipping
NOTICE (00000): policy "DMs can remove members, users can leave" for relation "public.campaign_members" does not exist, skipping
NOTICE (00000): policy "Users can view messages in their campaigns" for relation "public.campaign_messages" does not exist, skipping
NOTICE (00000): policy "Users can send messages in their campaigns" for relation "public.campaign_messages" does not exist, skipping
NOTICE (00000): policy "Users can edit their own messages" for relation "public.campaign_messages" does not exist, skipping
NOTICE (00000): policy "Users can delete their own messages, DMs can delete any" for relation "public.campaign_messages" does not exist, skipping
NOTICE (00000): policy "Users can view notes in their campaigns" for relation "public.campaign_notes" does not exist, skipping
NOTICE (00000): policy "Users can create notes in their campaigns" for relation "public.campaign_notes" does not exist, skipping
NOTICE (00000): policy "Users can edit their own notes, DMs can edit any" for relation "public.campaign_notes" does not exist, skipping
NOTICE (00000): policy "Users can delete their own notes, DMs can delete any" for relation "public.campaign_notes" does not exist, skipping
NOTICE (00000): policy "Users can view shared characters in their campaigns" for relation "public.campaign_character_shares" does not exist, skipping
NOTICE (00000): policy "Users can share their own characters" for relation "public.campaign_character_shares" does not exist, skipping
NOTICE (00000): policy "Users can update their own shares" for relation "public.campaign_character_shares" does not exist, skipping
NOTICE (00000): policy "Users can delete their own shares" for relation "public.campaign_character_shares" does not exist, skipping
Applying migration 20260121000003_fix_create_campaign_with_code.sql...
Applying migration 20260121000004_lock_campaign_creation_to_dm.sql...
Applying migration 20260121000005_backfill_profile_roles.sql...
Applying migration 20260121000006_fix_character_share_tokens.sql...
NOTICE (42701): column "share_token" of relation "characters" already exists, skipping
NOTICE (42P07): relation "idx_characters_share_token" already exists, skipping
Applying migration 20260121000007_fix_search_compendium_relics_return_types.sql...
Applying migration 20260121000008_expand_user_favorites_entry_types.sql...
Applying migration 20260121000009_add_tool_state_and_audio.sql...
Applying migration 20260121000010_make_public_buckets.sql...
Applying migration 20260121000011_update_user_favorites_entry_id_to_text.sql...
Applying migration 20260212000001_setup_auth_and_tables.sql...
NOTICE (42P07): relation "characters" already exists, skipping
NOTICE (42P07): relation "campaigns" already exists, skipping
NOTICE (42P07): relation "compendium_jobs" already exists, skipping
NOTICE (42P07): relation "compendium_relics" already exists, skipping
Applying migration 20260212000004_configure_supabase_integration.sql...
NOTICE (42P07): relation "idx_characters_user_id" already exists, skipping
Applying migration 20260215000000_add_dm_campaign_controls.sql...
Applying migration 20260215010000_harden_campaign_invites.sql...
NOTICE (00000): policy "campaign_invite_audit_logs_select" for relation "public.campaign_invite_audit_logs" does not exist, skipping
NOTICE (00000): policy "campaign_invite_audit_logs_insert" for relation "public.campaign_invite_audit_logs" does not exist, skipping
NOTICE (00000): trigger "ensure_campaign_member_characters_consistency" for relation "public.campaign_member_characters" does not exist, skipping
NOTICE (00000): policy "campaign_member_characters_select" for relation "public.campaign_member_characters" does not exist, skipping
NOTICE (00000): policy "campaign_member_characters_insert" for relation "public.campaign_member_characters" does not exist, skipping
NOTICE (00000): policy "campaign_member_characters_update" for relation "public.campaign_member_characters" does not exist, skipping
NOTICE (00000): policy "campaign_member_characters_delete" for relation "public.campaign_member_characters" does not exist, skipping
NOTICE (00000): function public.create_campaign_invite(uuid,text,timestamptz,pg_catalog.int4,text) does not exist, skipping
Applying migration 20260216000000_parity_foundation_phase1.sql...
NOTICE (00000): policy "sourcebook_catalog_select" for relation "public.sourcebook_catalog" does not exist, skipping
NOTICE (00000): policy "sourcebook_catalog_manage" for relation "public.sourcebook_catalog" does not exist, skipping
NOTICE (00000): policy "user_sourcebook_entitlements_select" for relation "public.user_sourcebook_entitlements" does not exist, skipping
NOTICE (00000): policy "user_sourcebook_entitlements_manage" for relation "public.user_sourcebook_entitlements" does not exist, skipping
NOTICE (00000): policy "campaign_sourcebook_shares_select" for relation "public.campaign_sourcebook_shares" does not exist, skipping
NOTICE (00000): policy "campaign_sourcebook_shares_manage" for relation "public.campaign_sourcebook_shares" does not exist, skipping
NOTICE (00000): trigger "update_sourcebook_catalog_updated_at" for relation "public.sourcebook_catalog" does not exist, skipping
NOTICE (00000): trigger "update_user_sourcebook_entitlements_updated_at" for relation "public.user_sourcebook_entitlements" does not exist, skipping
NOTICE (00000): trigger "update_campaign_sourcebook_shares_updated_at" for relation "public.campaign_sourcebook_shares" does not exist, skipping
NOTICE (42P07): relation "homebrew_content" already exists, skipping
NOTICE (00000): policy "homebrew_content_select" for relation "public.homebrew_content" does not exist, skipping
NOTICE (00000): policy "homebrew_content_insert" for relation "public.homebrew_content" does not exist, skipping
NOTICE (00000): policy "homebrew_content_update" for relation "public.homebrew_content" does not exist, skipping
NOTICE (00000): policy "homebrew_content_delete" for relation "public.homebrew_content" does not exist, skipping
NOTICE (00000): policy "homebrew_content_versions_select" for relation "public.homebrew_content_versions" does not exist, skipping
NOTICE (00000): policy "homebrew_content_versions_insert" for relation "public.homebrew_content_versions" does not exist, skipping
NOTICE (00000): trigger "capture_homebrew_version_snapshot" for relation "public.homebrew_content" does not exist, skipping
NOTICE (00000): policy "marketplace_items_select" for relation "public.marketplace_items" does not exist, skipping
NOTICE (00000): policy "marketplace_items_insert" for relation "public.marketplace_items" does not exist, skipping
NOTICE (00000): policy "marketplace_items_update" for relation "public.marketplace_items" does not exist, skipping
NOTICE (00000): policy "marketplace_items_delete" for relation "public.marketplace_items" does not exist, skipping
NOTICE (00000): policy "marketplace_reviews_select" for relation "public.marketplace_reviews" does not exist, skipping
NOTICE (00000): policy "marketplace_reviews_insert" for relation "public.marketplace_reviews" does not exist, skipping
NOTICE (00000): policy "marketplace_reviews_update" for relation "public.marketplace_reviews" does not exist, skipping
NOTICE (00000): policy "marketplace_reviews_delete" for relation "public.marketplace_reviews" does not exist, skipping
NOTICE (00000): policy "marketplace_downloads_select" for relation "public.marketplace_downloads" does not exist, skipping
NOTICE (00000): policy "marketplace_downloads_insert" for relation "public.marketplace_downloads" does not exist, skipping
NOTICE (00000): policy "user_marketplace_entitlements_select" for relation "public.user_marketplace_entitlements" does not exist, skipping
NOTICE (00000): policy "user_marketplace_entitlements_manage" for relation "public.user_marketplace_entitlements" does not exist, skipping
NOTICE (00000): trigger "update_marketplace_items_updated_at" for relation "public.marketplace_items" does not exist, skipping
NOTICE (00000): trigger "update_marketplace_reviews_updated_at" for relation "public.marketplace_reviews" does not exist, skipping
NOTICE (00000): trigger "update_user_marketplace_entitlements_updated_at" for relation "public.user_marketplace_entitlements" does not exist, skipping
NOTICE (00000): policy "campaign_sessions_select" for relation "public.campaign_sessions" does not exist, skipping
NOTICE (00000): policy "campaign_sessions_manage" for relation "public.campaign_sessions" does not exist, skipping
NOTICE (00000): policy "campaign_session_logs_select" for relation "public.campaign_session_logs" does not exist, skipping
NOTICE (00000): policy "campaign_session_logs_insert" for relation "public.campaign_session_logs" does not exist, skipping
NOTICE (00000): policy "campaign_session_logs_update" for relation "public.campaign_session_logs" does not exist, skipping
NOTICE (00000): policy "campaign_session_logs_delete" for relation "public.campaign_session_logs" does not exist, skipping
NOTICE (00000): trigger "update_campaign_sessions_updated_at" for relation "public.campaign_sessions" does not exist, skipping
NOTICE (00000): trigger "update_campaign_session_logs_updated_at" for relation "public.campaign_session_logs" does not exist, skipping
Applying migration 20260217000000_e2e_homebrew_features.sql...
Applying migration 20260218000002_vtt_fog_state_session.sql...
Applying migration 20260219000000_feature_choice_metadata.sql...
Applying migration 20260219001000_seed_feature_choice_metadata.sql...
Applying migration 20260220000000_active_sessions.sql...
Applying migration 20260220000001_combat_system.sql...
Applying migration 20260220000002_session_quests.sql...
Applying migration 20260220000003_vtt_system.sql...
Applying migration 20260220000004_vtt_audio_system.sql...
Applying migration 20260220000005_seed_asi_feat_choice_metadata.sql...
Applying migration 20260220000006_seed_more_feature_choice_metadata.sql...
Applying migration 20260220000007_seed_compendium_backed_choice_metadata.sql...
Applying migration 20260220000008_seed_leveled_power_choice_metadata.sql...
Applying migration 20260220000009_vtt_chat_messages.sql...
Applying migration 20260220000010_add_power_eligibility_arrays.sql...
NOTICE (42701): column "path_names" of relation "compendium_powers" already exists, skipping
NOTICE (42701): column "regent_names" of relation "compendium_powers" already exists, skipping
Applying migration 20260220000011_monarch_to_regent_compat.sql...
NOTICE (42701): column "regent_names" of relation "compendium_powers" already exists, skipping
Applying migration 20260220093000_hardening.sql...
NOTICE (00000): policy "Compendium jobs public read" for relation "public.compendium_jobs" does not exist, skipping
ERROR: column "owner_id" does not exist (SQLSTATE 42703)                                                                
At statement: 1                                                                                                         
-- Initplan + multiple-permissive policy hardening                                                                      
DO $$                                                                                                                   
BEGIN                                                                                                                   
  -- character_abilities (initplan: wrap auth calls)                                                                    
  DROP POLICY IF EXISTS "Users can create abilities for their own characters" ON public.character_abilities;            
  CREATE POLICY "Users can create abilities for their own characters" ON public.character_abilities                     
    FOR INSERT WITH CHECK (                                                                                             
      (SELECT auth.uid()) IS NOT NULL AND EXISTS (                                                                      
        SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid())                 
      )                                                                                                                 
    );                                                                                                                  
  DROP POLICY IF EXISTS "Users can delete abilities of their own characters" ON public.character_abilities;             
  CREATE POLICY "Users can delete abilities of their own characters" ON public.character_abilities                      
    FOR DELETE USING (                                                                                                  
      (SELECT auth.uid()) IS NOT NULL AND EXISTS (                                                                      
        SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid())                 
      )                                                                                                                 
    );                                                                                                                  
  DROP POLICY IF EXISTS "Users can update abilities of their own characters" ON public.character_abilities;             
  CREATE POLICY "Users can update abilities of their own characters" ON public.character_abilities                      
    FOR UPDATE USING (                                                                                                  
      (SELECT auth.uid()) IS NOT NULL AND EXISTS (                                                                      
        SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid())                 
      )                                                                                                                 
    );                                                                                                                  
  DROP POLICY IF EXISTS "Users can view abilities of their own characters" ON public.character_abilities;               
  CREATE POLICY "Users can view abilities of their own characters" ON public.character_abilities                        
    FOR SELECT USING (                                                                                                  
      (SELECT auth.uid()) IS NOT NULL AND EXISTS (                                                                      
        SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid())                 
      )                                                                                                                 
    );                                                                                                                  
                                                                                                                        
  -- character_equipment (initplan)                                                                                     
  DROP POLICY IF EXISTS "Users can create equipment for their own characters" ON public.character_equipment;            
  CREATE POLICY "Users can create equipment for their own characters" ON public.character_equipment                     
    FOR INSERT WITH CHECK (                                                                                             
      (SELECT auth.uid()) IS NOT NULL AND EXISTS (                                                                      
        SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid())                 
      )                                                                                                                 
    );                                                                                                                  
  DROP POLICY IF EXISTS "Users can delete equipment of their own characters" ON public.character_equipment;             
  CREATE POLICY "Users can delete equipment of their own characters" ON public.character_equipment                      
    FOR DELETE USING (                                                                                                  
      (SELECT auth.uid()) IS NOT NULL AND EXISTS (                                                                      
        SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid())                 
      )                                                                                                                 
    );                                                                                                                  
  DROP POLICY IF EXISTS "Users can update equipment of their own characters" ON public.character_equipment;             
  CREATE POLICY "Users can update equipment of their own characters" ON public.character_equipment                      
    FOR UPDATE USING (                                                                                                  
      (SELECT auth.uid()) IS NOT NULL AND EXISTS (                                                                      
        SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid())                 
      )                                                                                                                 
    );                                                                                                                  
  DROP POLICY IF EXISTS "Users can view equipment of their own characters" ON public.character_equipment;               
  CREATE POLICY "Users can view equipment of their own characters" ON public.character_equipment                        
    FOR SELECT USING (                                                                                                  
      (SELECT auth.uid()) IS NOT NULL AND EXISTS (                                                                      
        SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid())                 
      )                                                                                                                 
    );                                                                                                                  
                                                                                                                        
  -- character_powers (initplan)                                                                                        
  DROP POLICY IF EXISTS "Users can create powers for their own characters" ON public.character_powers;                  
  CREATE POLICY "Users can create powers for their own characters" ON public.character_powers                           
    FOR INSERT WITH CHECK (                                                                                             
      (SELECT auth.uid()) IS NOT NULL AND EXISTS (                                                                      
        SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid())                 
      )                                                                                                                 
    );                                                                                                                  
  DROP POLICY IF EXISTS "Users can delete powers of their own characters" ON public.character_powers;                   
  CREATE POLICY "Users can delete powers of their own characters" ON public.character_powers                            
    FOR DELETE USING (                                                                                                  
      (SELECT auth.uid()) IS NOT NULL AND EXISTS (                                                                      
        SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid())                 
      )                                                                                                                 
    );                                                                                                                  
  DROP POLICY IF EXISTS "Users can update powers of their own characters" ON public.character_powers;                   
  CREATE POLICY "Users can update powers of their own characters" ON public.character_powers                            
    FOR UPDATE USING (                                                                                                  
      (SELECT auth.uid()) IS NOT NULL AND EXISTS (                                                                      
        SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid())                 
      )                                                                                                                 
    );                                                                                                                  
  DROP POLICY IF EXISTS "Users can view powers of their own characters" ON public.character_powers;                     
  CREATE POLICY "Users can view powers of their own characters" ON public.character_powers                              
    FOR SELECT USING (                                                                                                  
      (SELECT auth.uid()) IS NOT NULL AND EXISTS (                                                                      
        SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid())                 
      )                                                                                                                 
    );                                                                                                                  
                                                                                                                        
  -- character_features (initplan)                                                                                      
  DROP POLICY IF EXISTS "Users can create features for their own characters" ON public.character_features;              
  CREATE POLICY "Users can create features for their own characters" ON public.character_features                       
    FOR INSERT WITH CHECK (                                                                                             
      (SELECT auth.uid()) IS NOT NULL AND EXISTS (                                                                      
        SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid())                 
      )                                                                                                                 
    );                                                                                                                  
  DROP POLICY IF EXISTS "Users can delete features of their own characters" ON public.character_features;               
  CREATE POLICY "Users can delete features of their own characters" ON public.character_features                        
    FOR DELETE USING (                                                                                                  
      (SELECT auth.uid()) IS NOT NULL AND EXISTS (                                                                      
        SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid())                 
      )                                                                                                                 
    );                                                                                                                  
  DROP POLICY IF EXISTS "Users can update features of their own characters" ON public.character_features;               
  CREATE POLICY "Users can update features of their own characters" ON public.character_features                        
    FOR UPDATE USING (                                                                                                  
      (SELECT auth.uid()) IS NOT NULL AND EXISTS (                                                                      
        SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid())                 
      )                                                                                                                 
    );                                                                                                                  
  DROP POLICY IF EXISTS "Users can view features of their own characters" ON public.character_features;                 
  CREATE POLICY "Users can view features of their own characters" ON public.character_features                          
    FOR SELECT USING (                                                                                                  
      (SELECT auth.uid()) IS NOT NULL AND EXISTS (                                                                      
        SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid())                 
      )                                                                                                                 
    );                                                                                                                  
                                                                                                                        
  -- characters (initplan)                                                                                              
  DROP POLICY IF EXISTS "DMs can view all characters" ON public.characters;                                             
  CREATE POLICY "DMs can view all characters" ON public.characters                                                      
    FOR SELECT USING (                                                                                                  
      (SELECT auth.uid()) IS NOT NULL AND EXISTS (                                                                      
        SELECT 1 FROM public.profiles p WHERE p.id = (SELECT auth.uid()) AND p.role IN ('dm','admin')                   
      )                                                                                                                 
    );                                                                                                                  
  DROP POLICY IF EXISTS "Users can create their own characters" ON public.characters;                                   
  CREATE POLICY "Users can create their own characters" ON public.characters                                            
    FOR INSERT WITH CHECK ((SELECT auth.uid()) IS NOT NULL AND user_id = (SELECT auth.uid()));                          
  DROP POLICY IF EXISTS "Users can delete their own characters" ON public.characters;                                   
  CREATE POLICY "Users can delete their own characters" ON public.characters                                            
    FOR DELETE USING ((SELECT auth.uid()) IS NOT NULL AND user_id = (SELECT auth.uid()));                               
  DROP POLICY IF EXISTS "Users can manage own characters" ON public.characters;                                         
  CREATE POLICY "Users can manage own characters" ON public.characters                                                  
    FOR ALL USING ((SELECT auth.uid()) IS NOT NULL AND user_id = (SELECT auth.uid()));                                  
  DROP POLICY IF EXISTS "Users can update their own characters" ON public.characters;                                   
  CREATE POLICY "Users can update their own characters" ON public.characters                                            
    FOR UPDATE USING ((SELECT auth.uid()) IS NOT NULL AND user_id = (SELECT auth.uid()));                               
  DROP POLICY IF EXISTS "Users can view own characters" ON public.characters;                                           
  CREATE POLICY "Users can view own characters" ON public.characters                                                    
    FOR SELECT USING ((SELECT auth.uid()) IS NOT NULL AND user_id = (SELECT auth.uid()));                               
  DROP POLICY IF EXISTS "Users can view their own characters" ON public.characters;                                     
  CREATE POLICY "Users can view their own characters" ON public.characters                                              
    FOR SELECT USING ((SELECT auth.uid()) IS NOT NULL AND user_id = (SELECT auth.uid()));                               
                                                                                                                        
  -- compendium_jobs (initplan + multiple perms)                                                                        
  DROP POLICY IF EXISTS "DMs can manage jobs" ON public.compendium_jobs;                                                
  CREATE POLICY "DMs can manage jobs" ON public.compendium_jobs                                                         
    FOR ALL USING (                                                                                                     
      EXISTS (                                                                                                          
        SELECT 1 FROM public.profiles p WHERE p.id = (SELECT auth.uid()) AND p.role IN ('dm','admin')                   
      )                                                                                                                 
    );                                                                                                                  
  DROP POLICY IF EXISTS "Compendium jobs public read" ON public.compendium_jobs;                                        
  CREATE POLICY "Compendium jobs public read" ON public.compendium_jobs                                                 
    FOR SELECT USING (true);                                                                                            
                                                                                                                        
  -- saved_sovereigns (initplan)                                                                                        
  DROP POLICY IF EXISTS "Anyone can view public sovereigns" ON public.saved_sovereigns;                                 
  CREATE POLICY "Anyone can view public sovereigns" ON public.saved_sovereigns                                          
    FOR SELECT USING (is_public = TRUE);                                                                                
  DROP POLICY IF EXISTS "Users can create their own sovereigns" ON public.saved_sovereigns;                             
  CREATE POLICY "Users can create their own sovereigns" ON public.saved_sovereigns                                      
    FOR INSERT WITH CHECK ((SELECT auth.uid()) IS NOT NULL AND owner_id = (SELECT auth.uid()));                         
  DROP POLICY IF EXISTS "Users can delete their own sovereigns" ON public.saved_sovereigns;                             
  CREATE POLICY "Users can delete their own sovereigns" ON public.saved_sovereigns                                      
    FOR DELETE USING ((SELECT auth.uid()) IS NOT NULL AND owner_id = (SELECT auth.uid()));                              
  DROP POLICY IF EXISTS "Users can update their own sovereigns" ON public.saved_sovereigns;                             
  CREATE POLICY "Users can update their own sovereigns" ON public.saved_sovereigns                                      
    FOR UPDATE USING ((SELECT auth.uid()) IS NOT NULL AND owner_id = (SELECT auth.uid()));                              
                                                                                                                        
  -- character_monarch_unlocks (initplan)                                                                               
  DROP POLICY IF EXISTS "Users can create monarch unlocks for their own characters" ON public.character_monarch_unlocks;
  CREATE POLICY "Users can create monarch unlocks for their own characters" ON public.character_monarch_unlocks         
    FOR INSERT WITH CHECK (                                                                                             
      (SELECT auth.uid()) IS NOT NULL AND EXISTS (                                                                      
        SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid())                 
      )                                                                                                                 
    );                                                                                                                  
  DROP POLICY IF EXISTS "Users can delete their own monarch unlocks" ON public.character_monarch_unlocks;               
  CREATE POLICY "Users can delete their own monarch unlocks" ON public.character_monarch_unlocks                        
    FOR DELETE USING (                                                                                                  
      (SELECT auth.uid()) IS NOT NULL AND EXISTS (                                                                      
        SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid())                 
      )                                                                                                                 
    );                                                                                                                  
  DROP POLICY IF EXISTS "Users can update their own monarch unlocks" ON public.character_monarch_unlocks;               
  CREATE POLICY "Users can update their own monarch unlocks" ON public.character_monarch_unlocks                        
    FOR UPDATE USING (                                                                                                  
      (SELECT auth.uid()) IS NOT NULL AND EXISTS (                                                                      
        SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid())                 
      )                                                                                                                 
    );                                                                                                                  
  DROP POLICY IF EXISTS "Users can view their own monarch unlocks" ON public.character_monarch_unlocks;                 
  CREATE POLICY "Users can view their own monarch unlocks" ON public.character_monarch_unlocks                          
    FOR SELECT USING (                                                                                                  
      (SELECT auth.uid()) IS NOT NULL AND EXISTS (                                                                      
        SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid())                 
      )                                                                                                                 
    );                                                                                                                  
                                                                                                                        
  -- user_favorites (initplan)                                                                                          
  DROP POLICY IF EXISTS "Users can delete their own favorites" ON public.user_favorites;                                
  CREATE POLICY "Users can delete their own favorites" ON public.user_favorites                                         
    FOR DELETE USING ((SELECT auth.uid()) IS NOT NULL AND user_id = (SELECT auth.uid()));                               
  DROP POLICY IF EXISTS "Users can insert their own favorites" ON public.user_favorites;                                
  CREATE POLICY "Users can insert their own favorites" ON public.user_favorites                                         
    FOR INSERT WITH CHECK ((SELECT auth.uid()) IS NOT NULL AND user_id = (SELECT auth.uid()));                          
  DROP POLICY IF EXISTS "Users can view their own favorites" ON public.user_favorites;                                  
  CREATE POLICY "Users can view their own favorites" ON public.user_favorites                                           
    FOR SELECT USING ((SELECT auth.uid()) IS NOT NULL AND user_id = (SELECT auth.uid()));                               
  DROP POLICY IF EXISTS "user_favorites_all" ON public.user_favorites;                                                  
  CREATE POLICY "user_favorites_all" ON public.user_favorites                                                           
    FOR SELECT USING ((SELECT auth.uid()) IS NOT NULL AND user_id = (SELECT auth.uid()));                               
                                                                                                                        
  -- character_shadow_soldiers (initplan)                                                                               
  DROP POLICY IF EXISTS "Users can release their own Umbral Legion" ON public.character_shadow_soldiers;                
  CREATE POLICY "Users can release their own Umbral Legion" ON public.character_shadow_soldiers                         
    FOR DELETE USING (                                                                                                  
      (SELECT auth.uid()) IS NOT NULL AND EXISTS (                                                                      
        SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid())                 
      )                                                                                                                 
    );                                                                                                                  
  DROP POLICY IF EXISTS "Users can summon soldiers for their own characters" ON public.character_shadow_soldiers;       
  CREATE POLICY "Users can summon soldiers for their own characters" ON public.character_shadow_soldiers                
    FOR INSERT WITH CHECK (                                                                                             
      (SELECT auth.uid()) IS NOT NULL AND EXISTS (                                                                      
        SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid())                 
      )                                                                                                                 
    );                                                                                                                  
                                                                                                                        
  -- Consolidate public read-only compendium policies (multiple permissive)                                             
  DROP POLICY IF EXISTS "Anyone can view equipment" ON public.compendium_equipment;                                     
  DROP POLICY IF EXISTS "Compendium equipment is publicly readable" ON public.compendium_equipment;                     
  CREATE POLICY "Compendium equipment public read" ON public.compendium_equipment                                       
    FOR SELECT USING (true);                                                                                            
                                                                                                                        
  DROP POLICY IF EXISTS "Anyone can view feats" ON public.compendium_feats;                                             
  DROP POLICY IF EXISTS "Compendium feats are publicly readable" ON public.compendium_feats;                            
  CREATE POLICY "Compendium feats public read" ON public.compendium_feats                                               
    FOR SELECT USING (true);                                                                                            
                                                                                                                        
  DROP POLICY IF EXISTS "Anyone can view job features" ON public.compendium_job_features;                               
  DROP POLICY IF EXISTS "Compendium job features are publicly readable" ON public.compendium_job_features;              
  CREATE POLICY "Compendium job features public read" ON public.compendium_job_features                                 
    FOR SELECT USING (true);                                                                                            
                                                                                                                        
  DROP POLICY IF EXISTS "Anyone can view job paths" ON public.compendium_job_paths;                                     
  DROP POLICY IF EXISTS "Compendium job paths are publicly readable" ON public.compendium_job_paths;                    
  CREATE POLICY "Compendium job paths public read" ON public.compendium_job_paths                                       
    FOR SELECT USING (true);                                                                                            
                                                                                                                        
  DROP POLICY IF EXISTS "Anyone can view monarchs" ON public.compendium_monarchs;                                       
  DROP POLICY IF EXISTS "Compendium monarchs are publicly readable" ON public.compendium_monarchs;                      
  CREATE POLICY "Compendium monarchs public read" ON public.compendium_monarchs                                         
    FOR SELECT USING (true);                                                                                            
                                                                                                                        
  DROP POLICY IF EXISTS "Anyone can view monsters" ON public.compendium_monsters;                                       
  DROP POLICY IF EXISTS "Compendium monsters are publicly readable" ON public.compendium_monsters;                      
  CREATE POLICY "Compendium monsters public read" ON public.compendium_monsters                                         
    FOR SELECT USING (true);                                                                                            
                                                                                                                        
  DROP POLICY IF EXISTS "Anyone can view paths" ON public.compendium_paths;                                             
  CREATE POLICY "Compendium paths public read" ON public.compendium_paths                                               
    FOR SELECT USING (true);                                                                                            
  DROP POLICY IF EXISTS "DMs can manage paths" ON public.compendium_paths;                                              
  CREATE POLICY "DMs can manage paths" ON public.compendium_paths                                                       
    FOR ALL USING (                                                                                                     
      EXISTS (                                                                                                          
        SELECT 1 FROM public.profiles p WHERE p.id = (SELECT auth.uid()) AND p.role IN ('dm','admin')                   
      )                                                                                                                 
    );                                                                                                                  
END $$                                                                                                                  
Try rerunning the command with --debug to troubleshoot the error.
