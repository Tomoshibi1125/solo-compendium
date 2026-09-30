import { beforeEach, describe, expect, it } from "vitest";
import type { AuthUser } from "@/lib/auth/authContext";
import { useAuthStore } from "@/stores/authStore";

const sampleUser: AuthUser = {
	id: "u1",
	email: "ascendant@example.com",
	role: "ascendant",
	createdAt: "2026-01-01T00:00:00.000Z",
};

describe("authStore", () => {
	beforeEach(() => {
		useAuthStore.getState().reset();
	});

	it("starts unauthenticated and loading", () => {
		const state = useAuthStore.getState();
		expect(state.user).toBeNull();
		expect(state.session).toBeNull();
		expect(state.loading).toBe(true);
	});

	it("sets user, session, and loading", () => {
		const store = useAuthStore.getState();
		store.setUser(sampleUser);
		store.setLoading(false);
		store.setSession({ access_token: "tok" } as never);

		const next = useAuthStore.getState();
		expect(next.user).toEqual(sampleUser);
		expect(next.loading).toBe(false);
		expect(next.session).toMatchObject({ access_token: "tok" });
	});

	it("patchUser merges into the existing user", () => {
		useAuthStore.getState().setUser(sampleUser);
		useAuthStore.getState().patchUser({ displayName: "Hero", role: "warden" });

		expect(useAuthStore.getState().user).toMatchObject({
			id: "u1",
			email: "ascendant@example.com",
			displayName: "Hero",
			role: "warden",
		});
	});

	it("patchUser is a no-op when signed out", () => {
		useAuthStore.getState().patchUser({ displayName: "Nobody" });
		expect(useAuthStore.getState().user).toBeNull();
	});

	it("reset restores the initial state", () => {
		const store = useAuthStore.getState();
		store.setUser(sampleUser);
		store.setLoading(false);
		store.reset();

		const next = useAuthStore.getState();
		expect(next.user).toBeNull();
		expect(next.session).toBeNull();
		expect(next.loading).toBe(true);
	});
});
