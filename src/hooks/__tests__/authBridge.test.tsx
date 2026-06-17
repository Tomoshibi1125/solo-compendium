import { act, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/integrations/supabase/client", () => ({
	isSupabaseConfigured: true,
	supabase: {
		auth: {
			getSession: vi.fn(),
			onAuthStateChange: vi.fn(),
			signOut: vi.fn(),
			updateUser: vi.fn(),
		},
		from: vi.fn(),
		functions: { invoke: vi.fn() },
	},
}));

import { supabase } from "@/integrations/supabase/client";
import { AuthProvider, useAuth } from "@/lib/auth/authContext";
import { useAuthStore } from "@/stores/authStore";

(
	globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

type Snapshot = ReturnType<typeof useAuth>;

const getSessionMock = vi.mocked(supabase.auth.getSession);
const onAuthStateChangeMock = vi.mocked(supabase.auth.onAuthStateChange);
const fromMock = vi.mocked(supabase.from);

let profileResult: { data: unknown; error: unknown } = {
	data: null,
	error: null,
};

const sessionWith = (opts?: { metadataRole?: string }) =>
	({
		access_token: "tok",
		user: {
			id: "user-1",
			email: "hero@example.com",
			user_metadata: opts?.metadataRole ? { role: opts.metadataRole } : {},
			created_at: "2026-01-01T00:00:00.000Z",
		},
	}) as never;

const tick = async () => {
	await act(async () => {
		await Promise.resolve();
	});
};

const waitUntil = async (predicate: () => boolean, timeoutMs = 1500) => {
	const start = Date.now();
	while (Date.now() - start < timeoutMs) {
		await tick();
		if (predicate()) return;
	}
	throw new Error("Timed out waiting for condition");
};

const Probe = ({ onSnapshot }: { onSnapshot: (s: Snapshot) => void }) => {
	const auth = useAuth();
	useEffect(() => {
		onSnapshot(auth);
	});
	return null;
};

const renderApp = (onSnapshot: (s: Snapshot) => void) => {
	const container = document.createElement("div");
	document.body.appendChild(container);
	const root = createRoot(container);
	act(() => {
		root.render(
			<AuthProvider>
				<Probe onSnapshot={onSnapshot} />
			</AuthProvider>,
		);
	});
	return () => {
		act(() => {
			root.unmount();
		});
		container.remove();
	};
};

describe("AuthProvider <-> authStore bridge", () => {
	beforeEach(() => {
		useAuthStore.getState().reset();
		profileResult = { data: null, error: null };
		getSessionMock.mockResolvedValue({ data: { session: null } } as never);
		onAuthStateChangeMock.mockReturnValue({
			data: { subscription: { unsubscribe: vi.fn() } },
		} as never);
		fromMock.mockImplementation(((table: string) => {
			if (table === "profiles") {
				return {
					select: () => ({
						eq: () => ({ single: async () => profileResult }),
					}),
				};
			}
			return {
				select: () => ({
					eq: () => ({ single: async () => ({ data: null, error: null }) }),
				}),
			};
		}) as never);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it("resolves loading to false when there is no session", async () => {
		let latest: Snapshot | null = null;
		const unmount = renderApp((s) => {
			latest = s;
		});
		try {
			await waitUntil(() => !!latest && latest.loading === false);
			const snap = latest as unknown as Snapshot;
			expect(snap.user).toBeNull();
			expect(snap.session).toBeNull();
			// store is the source of truth
			expect(useAuthStore.getState().loading).toBe(false);
		} finally {
			unmount();
		}
	});

	it("normalizes a privileged profile role to warden", async () => {
		getSessionMock.mockResolvedValue({
			data: { session: sessionWith() },
		} as never);
		profileResult = {
			data: {
				id: "user-1",
				role: "dm",
				created_at: "2026-01-01T00:00:00.000Z",
			},
			error: null,
		};

		let latest: Snapshot | null = null;
		const unmount = renderApp((s) => {
			latest = s;
		});
		try {
			await waitUntil(
				() => !!latest && (latest as Snapshot).user?.role === "warden",
			);
			expect((latest as unknown as Snapshot).user?.id).toBe("user-1");
		} finally {
			unmount();
		}
	});

	it("normalizes a player profile role to ascendant", async () => {
		getSessionMock.mockResolvedValue({
			data: { session: sessionWith() },
		} as never);
		profileResult = {
			data: {
				id: "user-1",
				role: "player",
				created_at: "2026-01-01T00:00:00.000Z",
			},
			error: null,
		};

		let latest: Snapshot | null = null;
		const unmount = renderApp((s) => {
			latest = s;
		});
		try {
			await waitUntil(() => !!latest && (latest as Snapshot).user !== null);
			expect((latest as unknown as Snapshot).user?.role).toBe("ascendant");
		} finally {
			unmount();
		}
	});

	it("lets user_metadata role take precedence over the profile row", async () => {
		getSessionMock.mockResolvedValue({
			data: { session: sessionWith({ metadataRole: "warden" }) },
		} as never);
		profileResult = {
			data: {
				id: "user-1",
				role: "player",
				created_at: "2026-01-01T00:00:00.000Z",
			},
			error: null,
		};

		let latest: Snapshot | null = null;
		const unmount = renderApp((s) => {
			latest = s;
		});
		try {
			await waitUntil(
				() => !!latest && (latest as Snapshot).user?.role === "warden",
			);
			expect((latest as unknown as Snapshot).user?.role).toBe("warden");
		} finally {
			unmount();
		}
	});

	it("falls back to a metadata-derived user when the profile fetch errors", async () => {
		getSessionMock.mockResolvedValue({
			data: { session: sessionWith({ metadataRole: "warden" }) },
		} as never);
		profileResult = { data: null, error: { message: "boom" } };

		let latest: Snapshot | null = null;
		const unmount = renderApp((s) => {
			latest = s;
		});
		try {
			await waitUntil(() => !!latest && (latest as Snapshot).user !== null);
			const snap = latest as unknown as Snapshot;
			expect(snap.user?.id).toBe("user-1");
			expect(snap.user?.role).toBe("warden");
			expect(snap.loading).toBe(false);
		} finally {
			unmount();
		}
	});

	it("exposes the full AuthContext shape and role helpers", async () => {
		getSessionMock.mockResolvedValue({
			data: { session: sessionWith() },
		} as never);
		profileResult = {
			data: {
				id: "user-1",
				role: "dm",
				created_at: "2026-01-01T00:00:00.000Z",
			},
			error: null,
		};

		let latest: Snapshot | null = null;
		const unmount = renderApp((s) => {
			latest = s;
		});
		try {
			await waitUntil(
				() => !!latest && (latest as Snapshot).user?.role === "warden",
			);
			const snap = latest as unknown as Snapshot;
			expect(typeof snap.signIn).toBe("function");
			expect(typeof snap.signUp).toBe("function");
			expect(typeof snap.signOut).toBe("function");
			expect(typeof snap.updateProfile).toBe("function");
			expect(snap.isWarden()).toBe(true);
			expect(snap.isPlayer()).toBe(false);
			expect(snap.hasPermission("manage:campaigns")).toBe(true);
			expect(snap.hasPermission("view:character_sheet")).toBe(false);
		} finally {
			unmount();
		}
	});
});
