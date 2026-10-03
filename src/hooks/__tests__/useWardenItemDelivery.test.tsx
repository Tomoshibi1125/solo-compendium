/**
 * Party Stash delivery from the Warden item dialog: it writes to the same
 * store the Party Stash page reads (guest-local stash without a session,
 * campaign_inventory otherwise), stacks same-name entries, and reports
 * failures instead of failing silently.
 */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type React from "react";
import { act, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
	const cloud = {
		existing: null as { id: string; quantity: number } | null,
		selectError: null as Error | null,
		updates: [] as Array<{ values: unknown; id: unknown }>,
		inserts: [] as unknown[],
	};
	const from = vi.fn(() => ({
		select: () => {
			const chain = {
				eq: () => chain,
				maybeSingle: async () => ({
					data: cloud.existing,
					error: cloud.selectError,
				}),
			};
			return chain;
		},
		update: (values: unknown) => ({
			eq: async (_column: string, id: unknown) => {
				cloud.updates.push({ values, id });
				return { error: null };
			},
		}),
		insert: async (values: unknown) => {
			cloud.inserts.push(values);
			return { error: null };
		},
	}));
	return {
		cloud,
		from,
		toast: vi.fn(),
		useLocalStash: { value: true },
	};
});

vi.mock("@/hooks/use-toast", () => ({
	useToast: () => ({ toast: mocks.toast }),
}));

vi.mock("@/integrations/supabase/client", () => ({
	isSupabaseConfigured: true,
	supabase: {
		from: mocks.from,
		rpc: vi.fn(),
		auth: {
			getUser: async () => ({ data: { user: { id: "warden-1" } } }),
			getSession: async () => ({ data: { session: null } }),
		},
	},
}));

vi.mock("@/lib/guestCampaignStash", async (importOriginal) => {
	const actual =
		await importOriginal<typeof import("@/lib/guestCampaignStash")>();
	return {
		...actual,
		shouldUseLocalStash: async () => mocks.useLocalStash.value,
	};
});

import { useWardenItemDelivery } from "@/hooks/useWardenItemDelivery";
import { readLocalStashItems } from "@/lib/guestCampaignStash";

(
	globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

type DeliveryApi = ReturnType<typeof useWardenItemDelivery>;

const activeCleanups: Array<() => void> = [];

const Probe = ({ onReady }: { onReady: (api: DeliveryApi) => void }) => {
	const api = useWardenItemDelivery();
	useEffect(() => {
		onReady(api);
	});
	return null;
};

const mountDelivery = (): (() => DeliveryApi) => {
	let latest: DeliveryApi | null = null;
	const container = document.createElement("div");
	document.body.appendChild(container);
	const root = createRoot(container);
	const client = new QueryClient({
		defaultOptions: { mutations: { retry: false } },
	});
	const element: React.ReactElement = (
		<QueryClientProvider client={client}>
			<Probe
				onReady={(api) => {
					latest = api;
				}}
			/>
		</QueryClientProvider>
	);
	act(() => {
		root.render(element);
	});
	activeCleanups.push(() => {
		act(() => {
			root.unmount();
		});
		container.remove();
	});
	return () => {
		if (!latest) throw new Error("delivery hook not mounted");
		return latest;
	};
};

const ampoule = {
	name: "Healing Ampoule",
	type: "items",
	description: "Restores a little HP.",
	weight: 0.5,
};

beforeEach(() => {
	window.localStorage.clear();
	mocks.useLocalStash.value = true;
	mocks.cloud.existing = null;
	mocks.cloud.selectError = null;
	mocks.cloud.updates.length = 0;
	mocks.cloud.inserts.length = 0;
});

afterEach(() => {
	while (activeCleanups.length > 0) activeCleanups.pop()?.();
});

describe("useWardenItemDelivery Party Stash mode", () => {
	it("adds to the guest-local stash the Party Stash page reads and stacks same-name items", async () => {
		const delivery = mountDelivery();

		await act(async () => {
			await delivery().deliverItem({
				campaignId: "camp-1",
				mode: "stash",
				item: ampoule,
				quantity: 2,
			});
		});
		await act(async () => {
			await delivery().deliverItem({
				campaignId: "camp-1",
				mode: "stash",
				item: ampoule,
				quantity: 1,
			});
		});

		const stash = readLocalStashItems("camp-1");
		expect(stash).toHaveLength(1);
		expect(stash[0]).toMatchObject({
			name: "Healing Ampoule",
			item_type: "items",
			quantity: 3,
		});
		expect(mocks.from).not.toHaveBeenCalled();
		expect(mocks.toast).toHaveBeenCalledWith(
			expect.objectContaining({ title: "Item sent to Party Stash" }),
		);
	});

	it("stacks onto an existing campaign_inventory row for signed-in Wardens", async () => {
		mocks.useLocalStash.value = false;
		mocks.cloud.existing = { id: "row-1", quantity: 2 };
		const delivery = mountDelivery();

		await act(async () => {
			await delivery().deliverItem({
				campaignId: "camp-1",
				mode: "stash",
				item: ampoule,
				quantity: 3,
			});
		});

		expect(mocks.from).toHaveBeenCalledWith("campaign_inventory");
		expect(mocks.cloud.updates).toEqual([
			{ values: { quantity: 5 }, id: "row-1" },
		]);
		expect(mocks.cloud.inserts).toEqual([]);
		expect(readLocalStashItems("camp-1")).toEqual([]);
	});

	it("toasts and rejects when the stash write fails", async () => {
		mocks.useLocalStash.value = false;
		mocks.cloud.selectError = new Error("permission denied");
		const delivery = mountDelivery();

		let failure: unknown = null;
		await act(async () => {
			try {
				await delivery().deliverItem({
					campaignId: "camp-1",
					mode: "stash",
					item: ampoule,
				});
			} catch (error) {
				failure = error;
			}
		});

		expect(failure).toBeInstanceOf(Error);
		expect(mocks.toast).toHaveBeenCalledWith(
			expect.objectContaining({
				title: "Party Stash delivery failed",
				description: "permission denied",
				variant: "destructive",
			}),
		);
	});
});
