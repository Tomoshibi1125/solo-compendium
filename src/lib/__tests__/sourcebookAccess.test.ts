import { describe, expect, it, vi } from "vitest";

const supabaseMocks = vi.hoisted(() => ({
	rpc: vi.fn(),
	getSession: vi.fn(),
}));

vi.mock("@/integrations/supabase/client", () => ({
	isSupabaseConfigured: true,
	supabase: {
		auth: { getSession: supabaseMocks.getSession },
		rpc: supabaseMocks.rpc,
	},
}));

import {
	filterRowsBySourcebookAccess,
	isSourcebookAccessible,
} from "@/lib/sourcebookAccess";

type Row = {
	id: string;
	source_book?: string | null;
};

// The entitlement layer is retired: every sourcebook is accessible and no
// entitlement lookup reaches the network.
describe("sourcebookAccess", () => {
	it("keeps every row, including non-core sourcebooks", async () => {
		const rows: Row[] = [
			{ id: "free", source_book: null },
			{ id: "canon", source_book: "Rift Ascendant Canon" },
			{ id: "other", source_book: "Locked Deluxe Tome" },
		];

		const filtered = await filterRowsBySourcebookAccess(
			rows,
			(row) => row.source_book,
			{ campaignId: "a1b2c3d4-0000-4000-8000-000000000000" },
		);

		expect(filtered).toBe(rows);
	});

	it("treats every sourcebook as accessible", async () => {
		await expect(isSourcebookAccessible("Locked Deluxe Tome")).resolves.toBe(
			true,
		);
		await expect(isSourcebookAccessible(null)).resolves.toBe(true);
	});

	it("makes no entitlement request", async () => {
		await filterRowsBySourcebookAccess([{ id: "x" }], () => "Any Book");
		await isSourcebookAccessible("Any Book");
		expect(supabaseMocks.rpc).not.toHaveBeenCalled();
		expect(supabaseMocks.getSession).not.toHaveBeenCalled();
	});
});
