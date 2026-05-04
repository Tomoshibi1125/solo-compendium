import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SyncQueueItem } from "@/lib/offlineStorage";

const mocks = vi.hoisted(() => {
	const processors = new Map<string, (item: SyncQueueItem) => Promise<void>>();
	const getUser = vi.fn();
	const eqCalls: Array<[string, string]> = [];
	let updatePayload: Record<string, unknown> | null = null;

	const updateChain = {
		error: null,
		eq: vi.fn((column: string, value: string) => {
			eqCalls.push([column, value]);
			return updateChain;
		}),
	};

	const update = vi.fn((payload: Record<string, unknown>) => {
		updatePayload = payload;
		return updateChain;
	});

	const from = vi.fn(() => ({
		delete: vi.fn(() => updateChain),
		insert: vi.fn(() => updateChain),
		update,
	}));

	return {
		eqCalls,
		from,
		getUser,
		processors,
		update,
		updateChain,
		get updatePayload() {
			return updatePayload;
		},
		resetPayload: () => {
			updatePayload = null;
		},
	};
});

vi.mock("@/integrations/supabase/client", () => ({
	isSupabaseConfigured: true,
	supabase: {
		auth: {
			getUser: mocks.getUser,
		},
		from: mocks.from,
		rpc: vi.fn(),
	},
}));

vi.mock("@/lib/offlineSync", () => ({
	registerOfflineSyncProcessor: vi.fn(
		(
			type: string,
			action: string,
			processor: (item: SyncQueueItem) => Promise<void>,
		) => {
			mocks.processors.set(`${type}:${action}`, processor);
		},
	),
}));

vi.mock("@/lib/canonicalCompendium", () => ({
	resolveCharacterCanonicalIds: vi.fn(
		async (data: Record<string, unknown>) => ({
			...data,
			job_id: data.job ? "job-destroyer" : data.job_id,
		}),
	),
}));

vi.mock("@/lib/characterOverlayValidation", () => ({
	normalizeCharacterOverlayFields: vi.fn(
		async (data: Record<string, unknown>) => data,
	),
}));

vi.mock("@/lib/logger", () => ({
	logger: {
		warn: vi.fn(),
	},
}));

import { ensureOfflineSyncProcessors } from "@/lib/offlineSyncProcessors";

describe("offline sync processors", () => {
	beforeEach(() => {
		mocks.processors.clear();
		mocks.eqCalls.length = 0;
		mocks.resetPayload();
		mocks.updateChain.eq.mockClear();
		mocks.update.mockClear();
		mocks.from.mockClear();
		mocks.getUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
	});

	it("syncs queued authenticated character updates with user ownership filtering", async () => {
		ensureOfflineSyncProcessors();

		const processor = mocks.processors.get("character:update");
		expect(processor).toBeDefined();

		await processor?.({
			id: "queue-1",
			type: "character",
			action: "update",
			data: {
				id: "character-1",
				user_id: "other-user",
				created_at: "2025-01-01T00:00:00.000Z",
				name: "Updated Ascendant",
				job: "Destroyer",
			},
			timestamp: Date.now(),
			retryCount: 0,
		});

		expect(mocks.from).toHaveBeenCalledWith("characters");
		expect(mocks.updatePayload).toEqual(
			expect.objectContaining({
				name: "Updated Ascendant",
				job: "Destroyer",
				job_id: "job-destroyer",
				updated_at: expect.any(String),
			}),
		);
		expect(mocks.updatePayload).not.toHaveProperty("id");
		expect(mocks.updatePayload).not.toHaveProperty("user_id");
		expect(mocks.updatePayload).not.toHaveProperty("created_at");
		expect(mocks.eqCalls).toEqual([
			["id", "character-1"],
			["user_id", "user-1"],
		]);
	});
});
