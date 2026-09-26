import { describe, expect, it } from "vitest";
import migrationSource from "../../../supabase/migrations/20260925010000_sovereign_s2_storage.sql?raw";

const migration = migrationSource.replace(/\r\n/g, "\n");

const between = (source: string, start: string, end: string): string => {
	const startIndex = source.indexOf(start);
	const endIndex = source.indexOf(end, startIndex + start.length);
	if (startIndex < 0 || endIndex < 0) {
		throw new Error(`Missing migration block: ${start} -> ${end}`);
	}
	return source.slice(startIndex, endIndex);
};

const attachRpc = between(
	migration,
	"CREATE OR REPLACE FUNCTION public.attach_saved_sovereign(",
	"CREATE OR REPLACE FUNCTION app_private.guard_character_sovereign_attachment()",
);
const v2Validator = between(
	migration,
	"CREATE OR REPLACE FUNCTION app_private.assert_sovereign_v2_definition(",
	"CREATE OR REPLACE FUNCTION app_private.sync_saved_sovereign_definition()",
);

describe("S2 Sovereign storage migration contract", () => {
	it("establishes versioned definition authority without fabricating legacy v2 IDs", () => {
		expect(migration).toContain(
			"ADD COLUMN IF NOT EXISTS schema_version SMALLINT",
		);
		expect(migration).toContain("ADD COLUMN IF NOT EXISTS definition JSONB");
		expect(migration).toContain("ADD COLUMN IF NOT EXISTS definition_id TEXT");
		expect(migration).toContain("'status', 'legacy-visible'");
		expect(migration).toContain("definition_id = NULL");
		expect(migration).not.toMatch(
			/UPDATE public\.saved_sovereigns[\s\S]*definition_id\s*=\s*(gen_random_uuid|id::text)/i,
		);
	});

	it("uses actor-bound idempotent save and attachment operations", () => {
		for (const signature of [
			"public.save_legacy_sovereign_definition(JSONB, TEXT, BOOLEAN)",
			"public.save_sovereign_v2_definition(JSONB, TEXT, BOOLEAN)",
			"public.attach_saved_sovereign(UUID, UUID, TEXT)",
		]) {
			expect(migration).toContain(`GRANT EXECUTE ON FUNCTION ${signature}`);
			expect(migration).toContain("TO authenticated;");
		}
		expect(migration).toContain("UNIQUE (actor_id, operation_id)");
		expect(attachRpc).toContain("pg_advisory_xact_lock");
		expect(attachRpc).toContain("FOR UPDATE;");
		expect(attachRpc).toContain("RETURN v_receipt.result;");
		expect(attachRpc).toContain("SOVEREIGN_OPERATION_CONFLICT");
	});

	it("performs attachment, runtime update, projection rebuild and receipt in one RPC", () => {
		expect(attachRpc).toContain("DELETE FROM public.character_features");
		expect(attachRpc).toContain("INSERT INTO public.character_features");
		expect(attachRpc).toContain("UPDATE public.characters");
		expect(attachRpc).toContain("active_sovereign_id = v_sovereign.id");
		expect(attachRpc).toContain(
			"INSERT INTO public.sovereign_attachment_operations",
		);
		expect(attachRpc).toContain(
			"PERFORM set_config('app.sovereign_attachment', 'on', true)",
		);
	});

	it("revalidates ownership, canonical sources and both Regent unlocks server-side", () => {
		expect(attachRpc).toContain("CHARACTER_OWNERSHIP_REQUIRED");
		expect(attachRpc).toContain("SOVEREIGN_OWNERSHIP_REQUIRED");
		expect(attachRpc).toContain(
			"SOVEREIGN_CHARACTER_CANONICAL_SOURCE_REQUIRED",
		);
		expect(attachRpc).toContain("SOVEREIGN_CHARACTER_SOURCE_MISMATCH");
		expect(attachRpc).toContain("count(DISTINCT unlock_row.regent_id)");
		expect(attachRpc).toContain("SOVEREIGN_REGENT_UNLOCKS_REQUIRED");
	});

	it("enforces the v2 milestone, ancestry, ID, modifier and resource boundaries", () => {
		expect(v2Validator).toContain("ARRAY[1,3,5,7,10,14,17,20]");
		expect(v2Validator).toContain("SOVEREIGN_V2_CAPSTONE_ANCESTRY_REQUIRED");
		expect(v2Validator).toContain("SOVEREIGN_V2_PACKAGE_ANCESTRY_INCOMPLETE");
		expect(v2Validator).toContain("SOVEREIGN_V2_DUPLICATE_ENTITY_ID");
		expect(v2Validator).toContain("SOVEREIGN_V2_UNKNOWN_MODIFIER_OWNER");
		expect(v2Validator).toContain("SOVEREIGN_V2_UNKNOWN_RESOURCE_REFERENCE");
		expect(migration).toContain("SOVEREIGN_V2_NESTED_SUM_NOT_ALLOWED");
	});

	it("makes character and feature projections RPC-only while preserving ordinary runtime updates", () => {
		expect(migration).toContain("SOVEREIGN_ATTACHMENT_RPC_REQUIRED");
		expect(migration).toContain("SOVEREIGN_RUNTIME_IDENTITY_RPC_REQUIRED");
		expect(migration).toContain("SOVEREIGN_PROJECTION_RPC_REQUIRED");
		expect(migration).toContain(
			"BEFORE INSERT OR UPDATE OF active_sovereign_id, gemini_state",
		);
		expect(migration).not.toContain(
			"BEFORE UPDATE OF gemini_state ON public.characters",
		);
	});

	it("carries an authoritative definition snapshot through the existing character export envelope", () => {
		expect(attachRpc).toContain(
			"'sovereignDefinition', v_sovereign.definition",
		);
		expect(migration).toContain("'sovereignImportDetached', true");
		expect(migration).toContain("NEW.active_sovereign_id := NULL");
		expect(migration).toContain(
			"'legacySovereignCompatibility', 'unmapped-compendium-reference'",
		);
	});
});
