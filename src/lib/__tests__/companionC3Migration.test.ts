import { describe, expect, it } from "vitest";
import c3Source from "../../../supabase/migrations/20260926050000_companion_c3_combat.sql?raw";
import c3Hardening from "../../../supabase/migrations/20260926051000_companion_c3_hardening.sql?raw";
import restMigration from "../../../supabase/migrations/20260929100000_companion_rests_follow_character.sql?raw";

const migration = `${c3Source}\n${c3Hardening}`.replace(/\r\n/g, "\n");

describe("C3 companion persistence contract", () => {
	it("links one stable living instance to at most one actor per combat session", () => {
		expect(migration).toContain(
			"campaign_combatants_companion_once_per_session",
		);
		expect(migration).toContain(
			"ON public.campaign_combatants(session_id, companion_instance_id)",
		);
		expect(migration).toContain(
			"ON CONFLICT (session_id, companion_instance_id)",
		);
		expect(migration).toContain("RETURN v_existing");
	});

	it("persists and reconciles HP, conditions, resources and downed state", () => {
		expect(migration).toContain(
			"combat_state_version BIGINT NOT NULL DEFAULT 0",
		);
		expect(migration).toContain(
			"combat_state JSONB NOT NULL DEFAULT '{}'::jsonb",
		);
		expect(migration).toContain(
			"'conditions', app_private.companion_c3_array(NEW.conditions)",
		);
		expect(migration).toContain(
			"'resources', app_private.companion_c3_record(NEW.stats->'resources')",
		);
		expect(migration).toContain(
			"'downed', COALESCE((NEW.stats->>'downed')::BOOLEAN, v_hp <= 0)",
		);
		expect(migration).toContain("'STALE_COMPANION_COMBAT_STATE'");
	});

	it("supports linked and independent initiative with one persisted resolver path", () => {
		expect(migration).toContain("initiative_mode IN ('independent', 'linked')");
		expect(migration).toContain("'LINKED_INITIATIVE_ANCHOR_REQUIRED'");
		expect(migration).toContain("'LINKED_INITIATIVE_ANCHOR_NOT_IN_COMBAT'");
		expect(migration).toContain("campaign_combatants_c3_linked_follow");
	});

	it("keeps reactions separate unless the authored profile explicitly shares them", () => {
		expect(migration).toContain(
			"COALESCE(NULLIF(v_combat->>'reactionPool', ''), 'separate')",
		);
		expect(migration).toContain("('separate', 'shared-rider')");
		expect(migration).toContain("'reactionAvailable'");
	});

	it("exposes only validated authored action-economy and progression metadata", () => {
		expect(migration).toContain("'INVALID_COMPANION_ACTION_ECONOMY_PROFILE'");
		expect(migration).toContain("('fixed', 'milestone', 'xp', 'manual')");
		expect(migration).toContain("'actionEconomy', v_action_economy");
		expect(migration).toContain("'progressionMode', v_progression_mode");
	});

	it("rests companions by their character's rules, not per-creature profile rules", () => {
		const rests = restMigration.replace(/\r\n/g, "\n");
		// The profile-driven body this file created is replaced (RA-10).
		expect(rests).toContain(
			"CREATE OR REPLACE FUNCTION public.rest_companions_for_character(",
		);
		expect(rests).not.toContain("progression_profile");
		expect(rests).toContain("IF p_rest_kind = 'short' THEN RETURN 0; END IF;");
		expect(rests).toContain("GREATEST(1, v_dice / 2)");
		expect(rests).toContain(
			"app_private.companion_conditions_after_long_rest(v_state->'conditions')",
		);
		expect(rests).toContain("'COMPANION_HAS_NO_HIT_DICE'");
	});

	it("guards mount ownership, campaign scope, rider size/terrain, tack and training", () => {
		expect(migration).toContain("'PERSONAL_MOUNT_RIDER_OWNER_REQUIRED'");
		expect(migration).toContain("'RIDER_NOT_IN_CAMPAIGN'");
		expect(migration).toContain("'MULTI_RIDER_PROFILE_UNSUPPORTED'");
		expect(migration).toContain("'MOUNT_RIDER_SIZE_REJECTED'");
		expect(migration).toContain("'MOUNT_TERRAIN_REJECTED'");
		expect(migration).toContain("'MOUNT_TACK_REQUIRED'");
		expect(migration).toContain("'MOUNT_TRAINING_REQUIRED'");
	});
});
