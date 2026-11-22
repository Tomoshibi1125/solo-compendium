import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

const { rpcCalls, supabaseMock } = vi.hoisted(() => {
	const rpcCalls: Array<{ name: string; args: Record<string, unknown> }> = [];
	const supabaseMock = {
		marker: "supabase-client",
		rpc(this: { marker: string }, name: string, args: Record<string, unknown>) {
			if (this?.marker !== "supabase-client") {
				throw new Error("Supabase RPC lost its client context");
			}
			rpcCalls.push({ name, args });
			return Promise.resolve({
				data: name === "create_regent_unlock_offer" ? "offer-id" : 2,
				error: null,
			});
		},
	};
	return { rpcCalls, supabaseMock };
});

vi.mock("@/integrations/supabase/client", () => ({ supabase: supabaseMock }));
vi.mock("@/hooks/useRegentUnlocks", () => ({
	useRegentUnlockGrants: () => ({ grants: [], isLoading: false, error: null }),
}));
vi.mock("@/hooks/use-toast", () => ({
	useToast: () => ({ toast: vi.fn() }),
}));

import { useRegentOffers } from "@/hooks/useRegentOffers";

(
	globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

describe("useRegentOffers", () => {
	afterEach(() => {
		rpcCalls.length = 0;
	});

	it("keeps the Supabase client bound for create and configure requests", async () => {
		const holder: { current: ReturnType<typeof useRegentOffers> | null } = {
			current: null,
		};
		const queryClient = new QueryClient({
			defaultOptions: { queries: { retry: false } },
		});
		const Probe = () => {
			holder.current = useRegentOffers("character-id");
			return null;
		};
		const container = document.createElement("div");
		document.body.appendChild(container);
		const root = createRoot(container);
		try {
			await act(async () => {
				root.render(
					<QueryClientProvider client={queryClient}>
						<Probe />
					</QueryClientProvider>,
				);
			});
			const offers = holder.current;
			if (!offers) throw new Error("Offer hook did not mount");
			await act(async () => {
				await offers.createOfferAsync({
					questId: "regent-quest",
					questTitle: "Regent Quest",
					candidateRegentIds: [
						"umbral_regent",
						"radiant_regent",
						"steel_regent",
					],
					requestId: "request-id",
				});
				await offers.configureOfferAsync({
					grantId: "offer-id",
					candidateRegentIds: ["war_regent", "frost_regent", "beast_regent"],
				});
			});
			expect(rpcCalls.map((call) => call.name)).toEqual([
				"create_regent_unlock_offer",
				"configure_regent_unlock_offer",
			]);
			expect(rpcCalls[0].args.p_character_id).toBe("character-id");
			expect(rpcCalls[1].args.p_grant_id).toBe("offer-id");
		} finally {
			act(() => root.unmount());
			container.remove();
			queryClient.clear();
		}
	});
});
