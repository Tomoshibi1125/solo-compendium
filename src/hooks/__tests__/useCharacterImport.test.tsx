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
});
