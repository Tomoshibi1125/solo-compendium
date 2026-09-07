import { describe, expect, it } from "vitest";
import migrationSource from "../../../supabase/migrations/20260906010000_task8_regent_workflow.sql?raw";
import generatedTypesSource from "../../integrations/supabase/types.ts?raw";

const normalize = (source: string) => source.replace(/\r\n/g, "\n");
const migration = normalize(migrationSource);
const generatedTypes = normalize(generatedTypesSource);

const between = (source: string, start: string, end: string): string => {
	const startIndex = source.indexOf(start);
	const endIndex = source.indexOf(end, startIndex + start.length);
	if (startIndex < 0 || endIndex < 0) {
		throw new Error(`Could not find source block: ${start} -> ${end}`);
	}
	return source.slice(startIndex, endIndex);
};

const consumeRpc = between(
	migration,
	"CREATE OR REPLACE FUNCTION public.consume_regent_unlock_grant(",
	"CREATE OR REPLACE FUNCTION public.complete_regent_catch_up(",
);
const catchUpRpc = between(
	migration,
	"CREATE OR REPLACE FUNCTION public.complete_regent_catch_up(",
	"CREATE OR REPLACE FUNCTION public.set_primary_regent_unlock(",
);
const primaryRpc = between(
	migration,
	"CREATE OR REPLACE FUNCTION public.set_primary_regent_unlock(",
	"-- CampaignRegentOversight contains a real Warden removal workflow.",
);
const removalRpc = between(
	migration,
	"CREATE OR REPLACE FUNCTION public.remove_regent_unlock(",
	"-- The post-hardening function surface is opt-in.",
);
const identityCase = between(
	consumeRpc,
	"v_canonical_regent_id := CASE v_candidate",
	"  END;",
);
const rlsCutover = between(
	migration,
	"-- 5. RLS cutover: reads and Warden credits remain direct; mutations use RPCs",
	"-- 6. Actor-bound transactional workflow RPCs",
);

const canonicalIds = [
	"umbral_regent",
	"radiant_regent",
	"steel_regent",
	"destruction_regent",
	"war_regent",
	"frost_regent",
	"beast_regent",
	"plague_regent",
	"spatial_regent",
	"mimic_regent",
	"blood_regent",
	"gravity_regent",
] as const;

const legacyAliases = {
	shadow_regent: "umbral_regent",
	dragon_regent: "destruction_regent",
	titan_regent: "steel_regent",
	architect_regent: "spatial_regent",
} as const;

describe("Task 8 Regent workflow migration source contract", () => {
	it("preserves legacy UUIDs verbatim and adds a nullable canonical text ID", () => {
		expect(migration).toContain(
			"RENAME COLUMN regent_id TO legacy_regent_uuid;",
		);
		expect(migration).toContain(
			"ALTER COLUMN legacy_regent_uuid DROP NOT NULL;",
		);
		expect(migration).toContain("ADD COLUMN IF NOT EXISTS regent_id TEXT;");
		expect(migration).toContain(
			"CHECK (num_nonnulls(legacy_regent_uuid, regent_id) = 1)",
		);
		expect(migration).not.toMatch(
			/UPDATE\s+public\.character_regent_unlocks[\s\S]*?SET\s+regent_id\s*=/i,
		);
	});

	it("locks the exact canonical roster and only the four explicit ID aliases", () => {
		for (const id of canonicalIds) {
			expect(identityCase).toContain(`WHEN '${id}' THEN '${id}'`);
		}
		for (const [legacyId, canonicalId] of Object.entries(legacyAliases)) {
			expect(identityCase).toContain(
				`WHEN '${legacyId}' THEN '${canonicalId}'`,
			);
		}
		expect(identityCase.match(/\bWHEN '/g)).toHaveLength(16);
		expect(identityCase).not.toMatch(
			/lower\s*\(|compendium_regents|display_name/,
		);
		expect(consumeRpc).toContain("v_candidate TEXT := p_regent_id;");
		expect(consumeRpc).not.toMatch(/\bbtrim\s*\(/);
		expect(consumeRpc).toContain("RAISE EXCEPTION 'INVALID_REGENT_ID'");
	});

	it("preflights conflicts instead of deleting, deduplicating, or guessing", () => {
		expect(migration).toContain("TASK8_DATA_CONFLICT");
		expect(migration).toContain("TASK8_PROJECTION_CONFLICT");
		expect(migration).toContain("HAVING count(*) > 2");
		expect(migration).toContain("HAVING count(*) > 1");
		expect(migration).toContain(
			"HAVING count(*) FILTER (WHERE unlock_row.is_primary) <> 1",
		);
		expect(migration).toContain(
			"backlink %s is missing or belongs to another character",
		);
		expect(migration).toContain(
			"Regent overlays do not match canonical unlock authority",
		);
		expect(migration).not.toMatch(/compendium_regents[\s\S]*?\.name\s*=/);
	});

	it("enforces uniqueness, two-unlock concurrency, primary, catch-up, and backlinks", () => {
		expect(migration).toContain(
			"CREATE UNIQUE INDEX IF NOT EXISTS character_regent_unlocks_character_regent_key",
		);
		expect(migration).toContain(
			"CREATE UNIQUE INDEX IF NOT EXISTS character_regent_unlocks_one_primary_key",
		);
		expect(migration).toContain("WHERE is_primary;");
		expect(migration).toContain(
			"caught_up_at_level IS NULL OR caught_up_at_level BETWEEN 1 AND 20",
		);
		expect(migration).toContain(
			"CHECK ((consumed_at IS NULL) = (consumed_unlock_id IS NULL))",
		);
		expect(migration).toContain(
			"FOREIGN KEY (consumed_unlock_id, character_id)",
		);
		expect(migration).toContain(
			"REFERENCES public.character_regent_unlocks(id, character_id)",
		);
		expect(migration).toContain(
			"CREATE OR REPLACE FUNCTION app_private.enforce_character_regent_unlock_limit()",
		);
		expect(migration).toContain(
			"CREATE OR REPLACE FUNCTION app_private.enforce_character_regent_primary()",
		);
		expect(migration).toContain(
			"CREATE CONSTRAINT TRIGGER enforce_character_regent_primary",
		);
		expect(migration).toContain("DEFERRABLE INITIALLY DEFERRED");
		expect(migration).toContain(
			"IF v_unlock_count > 0 AND v_primary_count <> 1 THEN",
		);
		expect(migration).toContain(
			"REVOKE ALL ON FUNCTION app_private.enforce_character_regent_primary()",
		);
		expect(migration).toMatch(
			/FROM public\.characters AS character_row[\s\S]*?FOR UPDATE;[\s\S]*?v_existing_count >= 2/,
		);
	});

	it("makes unlocks authoritative for both text projections", () => {
		expect(migration).toContain(
			"TASK8_SCHEMA_CONFLICT: characters.regent_overlays must be text[]",
		);
		expect(migration).toContain("FOREIGN KEY (character_id, regent_id)");
		expect(migration).toContain(
			"REFERENCES public.character_regent_unlocks(character_id, regent_id)",
		);
		expect(migration).toContain(
			"CREATE OR REPLACE FUNCTION app_private.sync_character_regent_projection(",
		);
		expect(migration).toContain("SET regent_overlays = v_expected");
		expect(migration).toContain(
			"INSERT INTO public.character_regents (character_id, regent_id)",
		);
		expect(migration).toContain("REGENT_OVERLAY_IS_DERIVED");
	});

	it("removes direct player mutations while retaining Warden grant insert/delete", () => {
		expect(rlsCutover).toContain("CREATE POLICY regent_unlocks_select");
		expect(rlsCutover).not.toMatch(
			/CREATE POLICY regent_unlocks_(insert|update|delete)/,
		);
		expect(rlsCutover).toContain("CREATE POLICY regent_unlock_grants_insert");
		expect(rlsCutover).toContain("CREATE POLICY regent_unlock_grants_delete");
		expect(rlsCutover).not.toContain(
			"CREATE POLICY regent_unlock_grants_update",
		);
		expect(rlsCutover).toContain("public.is_campaign_system(");
	});

	it("uses actor-bound, locked, derived, and idempotent RPC workflows", () => {
		for (const rpc of [consumeRpc, catchUpRpc, primaryRpc, removalRpc]) {
			expect(rpc).toContain("SECURITY DEFINER");
			expect(rpc).toContain("SET search_path = pg_catalog, public");
			expect(rpc).toContain("SET row_security = off");
			expect(rpc).toContain("v_actor UUID := auth.uid()");
		}

		const migrationGrantLock = migration.indexOf(
			"LOCK TABLE public.character_regent_unlock_grants",
		);
		const migrationCharacterLock = migration.indexOf(
			"LOCK TABLE public.characters",
		);
		const migrationUnlockLock = migration.indexOf(
			"LOCK TABLE public.character_regent_unlocks",
		);
		expect(migrationGrantLock).toBeGreaterThanOrEqual(0);
		expect(migrationCharacterLock).toBeGreaterThan(migrationGrantLock);
		expect(migrationUnlockLock).toBeGreaterThan(migrationCharacterLock);

		const consumeGrantLock = consumeRpc.indexOf(
			"FROM public.character_regent_unlock_grants AS grant_row",
		);
		const consumeCharacterLock = consumeRpc.indexOf(
			"FROM public.characters AS character_row",
		);
		expect(consumeGrantLock).toBeGreaterThanOrEqual(0);
		expect(consumeCharacterLock).toBeGreaterThan(consumeGrantLock);
		expect(consumeRpc.slice(consumeGrantLock, consumeCharacterLock)).toContain(
			"FOR UPDATE;",
		);
		expect(consumeRpc).toContain("v_grant.quest_title");
		expect(consumeRpc).toContain("v_is_primary := NOT EXISTS");
		expect(consumeRpc).toContain("RETURN v_existing_unlock.id;");
		expect(consumeRpc).toContain("REGENT_ALREADY_UNLOCKED");
		expect(consumeRpc).toContain("REGENT_UNLOCK_LIMIT_REACHED");

		const catchUpCharacterLock = catchUpRpc.indexOf(
			"FROM public.characters AS character_row",
		);
		const catchUpUnlockLock = catchUpRpc.indexOf(
			"SELECT unlock_row.*",
			catchUpCharacterLock,
		);
		expect(catchUpCharacterLock).toBeGreaterThanOrEqual(0);
		expect(catchUpUnlockLock).toBeGreaterThan(catchUpCharacterLock);
		expect(catchUpRpc.slice(catchUpCharacterLock, catchUpUnlockLock)).toContain(
			"FOR UPDATE;",
		);
		expect(catchUpRpc.slice(catchUpUnlockLock)).toContain("FOR UPDATE;");
		expect(catchUpRpc).toContain("character_row.level");
		expect(catchUpRpc).toContain("SET caught_up_at_level = v_character_level");

		const stableUnlockLock = "ORDER BY unlock_row.id\n  FOR UPDATE;";
		const primaryCharacterLock = primaryRpc.indexOf(
			"FROM public.characters AS character_row",
		);
		const primaryUnlockLock = primaryRpc.indexOf(
			stableUnlockLock,
			primaryCharacterLock,
		);
		expect(primaryCharacterLock).toBeGreaterThanOrEqual(0);
		expect(primaryUnlockLock).toBeGreaterThan(primaryCharacterLock);
		expect(primaryRpc.slice(primaryCharacterLock, primaryUnlockLock)).toContain(
			"FOR UPDATE;",
		);
		expect(primaryRpc).toContain("SET is_primary = false");
		expect(primaryRpc).toContain("SET is_primary = true");

		expect(removalRpc).toContain("CAMPAIGN_WARDEN_REQUIRED");
		const removalGrantLock = removalRpc.indexOf(
			"FROM public.character_regent_unlock_grants AS grant_row",
		);
		const removalCharacterLock = removalRpc.indexOf(
			"FROM public.characters AS character_row",
		);
		const removalUnlockLock = removalRpc.indexOf(
			stableUnlockLock,
			removalCharacterLock,
		);
		expect(removalGrantLock).toBeGreaterThanOrEqual(0);
		expect(removalCharacterLock).toBeGreaterThan(removalGrantLock);
		expect(removalUnlockLock).toBeGreaterThan(removalCharacterLock);
		expect(removalRpc.slice(removalGrantLock, removalCharacterLock)).toContain(
			"FOR UPDATE;",
		);
		expect(removalRpc.slice(removalCharacterLock, removalUnlockLock)).toContain(
			"FOR UPDATE;",
		);
		expect(removalRpc).toContain(
			"DELETE FROM public.character_regent_unlock_grants",
		);
		expect(removalRpc).toContain("DELETE FROM public.character_regent_unlocks");
	});

	it("keeps the post-hardening execution surface authenticated-only", () => {
		for (const signature of [
			"public.consume_regent_unlock_grant(UUID, TEXT)",
			"public.complete_regent_catch_up(UUID)",
			"public.set_primary_regent_unlock(UUID)",
			"public.remove_regent_unlock(UUID)",
		]) {
			expect(migration).toContain(
				`REVOKE EXECUTE ON FUNCTION ${signature}\n  FROM PUBLIC, anon, authenticated;`,
			);
			expect(migration).toContain(
				`GRANT EXECUTE ON FUNCTION ${signature}\n  TO authenticated;`,
			);
		}
	});

	it("adds canonical saved Sovereign pairs without rewriting legacy UUIDs", () => {
		expect(migration).toContain("ADD COLUMN IF NOT EXISTS regent_a_id TEXT");
		expect(migration).toContain("ADD COLUMN IF NOT EXISTS regent_b_id TEXT");
		expect(migration).toContain("ALTER COLUMN monarch_a_id DROP NOT NULL");
		expect(migration).toContain("ALTER COLUMN monarch_b_id DROP NOT NULL");
		expect(migration).toContain(
			"AND (regent_a_id IS NULL OR regent_a_id <> regent_b_id)",
		);
		expect(migration).not.toMatch(
			/UPDATE\s+public\.saved_sovereigns[\s\S]*?SET\s+regent_[ab]_id/i,
		);
	});

	it("updates only the generated table/relationship/RPC boundary", () => {
		const unlockTypes = between(
			generatedTypes,
			"character_regent_unlocks: {",
			"character_regents: {",
		);
		expect(unlockTypes).toContain("legacy_regent_uuid: string | null;");
		expect(unlockTypes).toContain("regent_id: string | null;");
		expect(unlockTypes).toContain(
			'foreignKeyName: "character_regent_unlocks_legacy_regent_uuid_fkey";',
		);

		const sovereignTypes = between(
			generatedTypes,
			"saved_sovereigns: {",
			"session_participants: {",
		);
		expect(sovereignTypes).toContain("monarch_a_id: string | null;");
		expect(sovereignTypes).toContain("monarch_b_id: string | null;");
		expect(sovereignTypes).toContain("regent_a_id: string | null;");
		expect(sovereignTypes).toContain("regent_b_id: string | null;");

		for (const rpcName of [
			"consume_regent_unlock_grant",
			"complete_regent_catch_up",
			"set_primary_regent_unlock",
			"remove_regent_unlock",
		]) {
			expect(generatedTypes).toContain(`${rpcName}: {`);
		}
	});
});
