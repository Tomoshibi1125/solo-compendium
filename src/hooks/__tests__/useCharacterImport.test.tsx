import type React from "react";
import { act, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
	toast: vi.fn(),
	from: vi.fn(),
	resolveCanonicalReference: vi.fn(),
	resolveCanonicalCastableReference: vi.fn(),
	insertCalls: [] as Array<{ table: string; payload: Record<string, unknown> }>,
	upsertCalls: [] as Array<{
		table: string;
		payload: Record<string, unknown>;
		options?: Record<string, unknown>;
	}>,
}));

vi.mock("@/hooks/use-toast", () => ({
	useToast: () => ({ toast: mocks.toast }),
}));

vi.mock("@/lib/auth/authContext", () => ({
	useAuth: () => ({ user: { id: "import-user" }, loading: false }),
}));

vi.mock("@/integrations/supabase/client", () => ({
	isSupabaseConfigured: true,
	supabase: {
		from: mocks.from,
	},
}));

vi.mock("@/lib/canonicalCompendium", () => ({
	resolveCanonicalReference: mocks.resolveCanonicalReference,
	resolveCanonicalCastableReference: mocks.resolveCanonicalCastableReference,
}));

import { useCharacterImport } from "@/hooks/useCharacterExportImport";

(
	globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const mount = (element: React.ReactElement) => {
	const container = document.createElement("div");
	document.body.appendChild(container);
	const root = createRoot(container);

	act(() => {
		root.render(element);
	});

	return () => {
		act(() => {
			root.unmount();
		});
		container.remove();
	};
};

const ImportProbe = ({
	onReady,
}: {
	onReady: (importCharacterJson: (file: File) => Promise<unknown>) => void;
}) => {
	const { importCharacterJson } = useCharacterImport();

	useEffect(() => {
		onReady(importCharacterJson);
	}, [importCharacterJson, onReady]);

	return null;
};

describe("useCharacterImport", () => {
	beforeEach(() => {
		mocks.toast.mockClear();
		mocks.from.mockReset();
		mocks.resolveCanonicalReference.mockReset();
		mocks.resolveCanonicalCastableReference.mockReset();
		mocks.insertCalls.length = 0;
		mocks.upsertCalls.length = 0;
		mocks.resolveCanonicalReference.mockResolvedValue({ entry: null });
		mocks.resolveCanonicalCastableReference.mockResolvedValue({ entry: null });
		mocks.from.mockImplementation((table: string) => ({
			insert: (payload: Record<string, unknown>) => {
				mocks.insertCalls.push({ table, payload });
				return {
					select: () => ({
						single: async () => ({
							data: { id: "imported-character", ...payload },
							error: null,
						}),
					}),
					throwOnError: async () => ({ data: null, error: null }),
				};
			},
			upsert: (
				payload: Record<string, unknown>,
				options?: Record<string, unknown>,
			) => {
				mocks.upsertCalls.push({ table, payload, options });
				return {
					throwOnError: async () => ({ data: null, error: null }),
				};
			},
		}));
	});

	it("delegates to the version-aware canonical import flow", async () => {
		let importCharacterJson: (file: File) => Promise<unknown> = async () => {
			throw new Error("Import hook did not initialize");
		};
		const unmount = mount(
			<ImportProbe
				onReady={(nextImportCharacterJson) => {
					importCharacterJson = nextImportCharacterJson;
				}}
			/>,
		);
		const runImport = importCharacterJson;

		const fileContents = JSON.stringify({
			version: "2.3",
			character: {
				id: "original-character",
				name: "Round Trip Ascendant",
				level: 5,
				job: "Mage",
				path: "Archivist",
				background: "Scholar",
				str: 8,
				agi: 12,
				vit: 14,
				int: 16,
				sense: 13,
				pre: 10,
				hp_max: 32,
				hp_current: 27,
			},
		});
		const file = new File([fileContents], "round-trip-ascendant.json", {
			type: "application/json",
		});
		Object.defineProperty(file, "text", {
			value: async () => fileContents,
		});

		let imported: unknown;
		await act(async () => {
			imported = await runImport(file);
		});
		unmount();

		expect(imported).toMatchObject({ id: "imported-character" });
		expect(mocks.insertCalls).toHaveLength(1);
		expect(mocks.insertCalls[0]).toMatchObject({ table: "characters" });
		expect(mocks.insertCalls[0]?.payload).toMatchObject({
			user_id: "import-user",
			name: "Round Trip Ascendant (Imported)",
			level: 5,
			job: "Mage",
			path: "Archivist",
			background: "Scholar",
			int: 16,
			hp_max: 32,
			hp_current: 27,
		});
		expect(mocks.toast).toHaveBeenCalledWith(
			expect.objectContaining({
				title: "Importing legacy v2.3 character",
			}),
		);
		expect(mocks.toast).toHaveBeenCalledWith(
			expect.objectContaining({
				title: "Import Successful",
			}),
		);
	});

	it("round-trips v2.5 RA-exclusive tables (vehicles, tamed anomalies, tattoos, sheet state, spell slots)", async () => {
		let importCharacterJson: (file: File) => Promise<unknown> = async () => {
			throw new Error("Import hook did not initialize");
		};
		const unmount = mount(
			<ImportProbe
				onReady={(nextImportCharacterJson) => {
					importCharacterJson = nextImportCharacterJson;
				}}
			/>,
		);
		const runImport = importCharacterJson;

		const fileContents = JSON.stringify({
			version: "2.5",
			character: {
				id: "original-character",
				name: "Tamer Ascendant",
				level: 6,
				job: "Beastbinder",
				str: 12,
				agi: 14,
				vit: 13,
				int: 10,
				sense: 15,
				pre: 11,
				hp_max: 44,
				hp_current: 40,
			},
			vehicles: [
				{
					id: "v-1",
					character_id: "original-character",
					vehicle_id: "rift-skiff",
					current_hp: 30,
					condition_state: "operational",
					conditions: [],
					installed_mod_ids: ["mod-a"],
					is_active: true,
					vrp_cost_paid: 5,
				},
			],
			tamed_anomalies: [
				{
					id: "t-1",
					character_id: "original-character",
					anomaly_id: "gloam-hound",
					bond_level: 3,
					current_hp: 18,
					conditions: [],
					is_summoned: false,
				},
			],
			tattoos: [
				{
					id: "tt-1",
					character_id: "original-character",
					tattoo_id: "sigil-of-vigor",
					name: "Sigil of Vigor",
					is_active: true,
					is_attuned: true,
					requires_attunement: true,
				},
			],
			sheet_state: {
				id: "ss-1",
				character_id: "original-character",
				user_id: "original-owner",
				custom_modifiers: [{ id: "cm-1", label: "Blessing", value: 1 }],
				resources: { ui: {} },
			},
			spell_slots: [
				{
					id: "sl-1",
					character_id: "original-character",
					spell_level: 1,
					slots_max: 4,
					slots_current: 2,
					slots_recovered_on_long_rest: 4,
					slots_recovered_on_short_rest: 0,
				},
			],
		});
		const file = new File([fileContents], "tamer-ascendant.json", {
			type: "application/json",
		});
		Object.defineProperty(file, "text", {
			value: async () => fileContents,
		});

		await act(async () => {
			await runImport(file);
		});
		unmount();

		// List tables land via insert with the freshly created character_id.
		const vehicleInsert = mocks.insertCalls.find(
			(c) => c.table === "character_vehicles",
		);
		expect(vehicleInsert).toBeDefined();
		expect(
			(vehicleInsert?.payload as Record<string, unknown>[])[0],
		).toMatchObject({
			character_id: "imported-character",
			vehicle_id: "rift-skiff",
		});
		expect(
			mocks.insertCalls.find((c) => c.table === "character_tamed_anomalies"),
		).toBeDefined();
		expect(
			mocks.insertCalls.find((c) => c.table === "character_tattoos"),
		).toBeDefined();

		// Singleton/keyed tables land via upsert on their unique constraints,
		// re-keyed to the new character and re-stamped with the importing user.
		const sheetUpsert = mocks.upsertCalls.find(
			(c) => c.table === "character_sheet_state",
		);
		expect(sheetUpsert?.options).toMatchObject({ onConflict: "character_id" });
		expect(sheetUpsert?.payload).toMatchObject({
			character_id: "imported-character",
			user_id: "import-user",
		});
		const slotUpsert = mocks.upsertCalls.find(
			(c) => c.table === "character_spell_slots",
		);
		expect(slotUpsert?.options).toMatchObject({
			onConflict: "character_id,spell_level",
		});
		expect((slotUpsert?.payload as Record<string, unknown>[])[0]).toMatchObject(
			{
				character_id: "imported-character",
				spell_level: 1,
				slots_current: 2,
			},
		);
	});
});
