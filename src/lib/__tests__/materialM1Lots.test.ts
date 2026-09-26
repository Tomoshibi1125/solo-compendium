import { describe, expect, it } from "vitest";
import migrationSource from "../../../supabase/migrations/20260926060000_material_m1_lots.sql?raw";
import hardeningSource from "../../../supabase/migrations/20260926060100_material_m1_hardening.sql?raw";
import panelSource from "../../components/character/CraftingPanel.tsx?raw";
import hookSource from "../../hooks/useMaterialLots.ts?raw";
import { parseMaterialLotBundle } from "@/hooks/useMaterialLots";

const migration = migrationSource.replace(/\r\n/g, "\n");
const hardening = hardeningSource.replace(/\r\n/g, "\n");

describe("M1 material lot authority", () => {
	it("defines the six planned material families without forcing legacy salvage into one", () => {
		for (const family of [
			"Anomaly Biological",
			"Essence",
			"Rift Botanical",
			"Rift Mineral",
			"Relic Material",
			"Technical",
		]) {
			expect(migration).toContain(`'${family}'`);
		}
		expect(migration).toContain("('material-rift-salvage', 'Rift Salvage', NULL");
	});

	it("backfills each legacy aggregate row as its own provenance-preserving lot", () => {
		expect(migration).toContain("legacy_character_material_id UUID UNIQUE");
		expect(migration).toContain("'legacy-unknown'");
		expect(migration).toContain("'legacyRowId', legacy.id");
		expect(migration).toContain("lot.legacy_character_material_id = legacy.id");
		expect(migration).not.toMatch(/GROUP BY[\s\S]{0,200}legacy\.material_id/i);
	});

	it("keeps regulation descriptive and separates discovered knowledge from provenance", () => {
		expect(migration).toContain("regulation_metadata JSONB NOT NULL");
		expect(migration).toContain("CREATE TABLE IF NOT EXISTS public.material_lot_discoveries");
		expect(migration).toContain("discovered_metadata JSONB NOT NULL");
		expect(migration).toContain("M1 inventory mechanics never gate on this field");
	});

	it("makes lot mutations RPC-only, idempotent and stale-write protected", () => {
		expect(migration).toContain("REVOKE INSERT, UPDATE, DELETE ON public.material_lots");
		expect(migration).toContain("CREATE OR REPLACE FUNCTION public.create_material_lot_m1");
		expect(migration).toContain("CREATE OR REPLACE FUNCTION public.adjust_material_lot_m1");
		expect(migration).toContain("MATERIAL_OPERATION_ID_CONFLICT");
		expect(migration).toContain("STALE_MATERIAL_LOT");
		expect(migration).toContain("row_version = row_version + 1");
	});

	it("does not invent fractional unit semantics", () => {
		expect(hardening).toContain("MATERIAL_FRACTION_RULE_UNRESOLVED");
		expect(hardening).toContain("CHECK (quantity = trunc(quantity))");
		expect(hardening).toContain("material_m1_validate_whole_quantity");
	});

	it("keeps the old aggregate as a compatibility projection, not write authority", () => {
		expect(migration).toContain("material_lots_sync_legacy_aggregate");
		expect(migration).toContain("REVOKE INSERT, UPDATE, DELETE ON public.character_materials FROM authenticated");
		expect(hookSource).toContain('["character-materials", characterId]');
	});

	it("uses lots in the crafting inventory UI instead of the aggregate mutation", () => {
		expect(panelSource).toContain('useMaterialLots(characterId)');
		expect(panelSource).toContain('title="CRAFTING"');
		expect(panelSource).toContain("Material Lots");
		expect(panelSource).toContain("createLot.mutate");
		expect(panelSource).toContain("adjustLot.mutate");
		expect(panelSource).not.toContain("adjustMaterial.mutate");
	});

	it("provides a versioned portable bundle and authoritative import RPC", () => {
		expect(hookSource).toContain('kind: "rift-ascendant-material-lots"');
		expect(hookSource).toContain('callRpc("import_material_lots_m1"');
		expect(migration).toContain("CREATE OR REPLACE FUNCTION public.import_material_lots_m1");
		expect(migration).toContain("lot_id_map");

		const bundle = parseMaterialLotBundle({
			kind: "rift-ascendant-material-lots",
			version: 1,
			exported_at: "2026-09-26T00:00:00.000Z",
			definitions: [],
			lots: [],
			discoveries: [],
		});
		expect(bundle.version).toBe(1);
		expect(() =>
			parseMaterialLotBundle({
				kind: "rift-ascendant-material-lots",
				version: 2,
				definitions: [],
				lots: [],
				discoveries: [],
			}),
		).toThrow(/Unsupported material lot bundle/);
	});
});
