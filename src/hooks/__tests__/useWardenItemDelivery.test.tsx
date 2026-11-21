/**
 * Party Stash delivery from the Warden item dialog: guest/local workflows ask
 * for sign-in, while cloud Warden deliveries use the guarded atomic RPC.
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
		rpcError: null as Error | null,
		authUser: { id: "warden-1" } as { id: string } | null,
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
	const rpc = vi.fn(async () => ({
		data: "stash-row-1",
		error: cloud.rpcError,
	}));
	return {
		cloud,
		from,
		rpc,
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
		rpc: mocks.rpc,
		auth: {
			getUser: async () => ({ data: { user: mocks.cloud.authUser } }),
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
	mocks.cloud.rpcError = null;
	mocks.cloud.authUser = { id: "warden-1" };
	mocks.rpc.mockClear();
});

afterEach(() => {
	while (activeCleanups.length > 0) activeCleanups.pop()?.();
});

describe("useWardenItemDelivery Party Stash mode", () => {
	it("requires sign-in before guest Warden delivery can write to a local stash", async () => {
		mocks.cloud.authUser = null;
		const delivery = mountDelivery();

		let failure: unknown = null;
		await act(async () => {
			try {
				await delivery().deliverItem({
					campaignId: "camp-1",
					mode: "stash",
					item: ampoule,
					quantity: 2,
				});
			} catch (error) {
				failure = error;
			}
		});

		expect(failure).toBeInstanceOf(Error);
		expect(readLocalStashItems("camp-1")).toEqual([]);
		expect(mocks.from).not.toHaveBeenCalled();
		expect(mocks.toast).toHaveBeenCalledWith(
			expect.objectContaining({
				title: "Sign in required",
				description: expect.stringContaining(
					"Guest campaigns stay in this browser",
				),
			}),
		);
	});

	it("routes signed-in Party Stash delivery through the atomic Warden RPC", async () => {
		mocks.useLocalStash.value = false;
		const delivery = mountDelivery();

		await act(async () => {
			await delivery().deliverItem({
				campaignId: "camp-1",
				mode: "stash",
				item: ampoule,
				quantity: 3,
			});
		});

		expect(mocks.from).not.toHaveBeenCalled();
		expect(mocks.rpc).toHaveBeenCalledWith(
			"warden_deliver_campaign_inventory",
			{
				p_campaign_id: "camp-1",
				p_name: "Healing Ampoule",
				p_item_type: "items",
				p_description: "Restores a little HP.",
				p_quantity: 3,
				p_weight: 0.5,
				p_is_identified: true,
			},
		);
		expect(mocks.cloud.inserts).toEqual([]);
		expect(readLocalStashItems("camp-1")).toEqual([]);
	});

	it("reports a server-side Warden authorization failure", async () => {
		mocks.useLocalStash.value = false;
		mocks.cloud.rpcError = new Error("CAMPAIGN_WARDEN_REQUIRED");
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
				description: "CAMPAIGN_WARDEN_REQUIRED",
				variant: "destructive",
			}),
		);
	});
});
