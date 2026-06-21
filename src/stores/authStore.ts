/**
 * Auth source of truth.
 *
 * The Supabase auth lifecycle (getSession / onAuthStateChange) is driven by
 * `AuthProvider`, which writes the reactive {user, session, loading} cells into
 * this store. `useAuth()` reads them back, so consumers are unchanged while the
 * state also becomes readable outside React render (e.g. in plain utilities).
 *
 * Not persisted: Supabase already persists the session; mirroring it here would
 * risk staleness.
 */
import type { Session } from "@supabase/supabase-js";
import { create } from "zustand";
import type { AuthUser } from "@/lib/auth/authContext";

interface AuthStoreState {
	user: AuthUser | null;
	session: Session | null;
	loading: boolean;
	setUser: (user: AuthUser | null) => void;
	setSession: (session: Session | null) => void;
	setLoading: (loading: boolean) => void;
	/** Merge updates into the current user (no-op when signed out). */
	patchUser: (updates: Partial<AuthUser>) => void;
	reset: () => void;
}

const initialState: Pick<AuthStoreState, "user" | "session" | "loading"> = {
	user: null,
	session: null,
	loading: true,
};

export const useAuthStore = create<AuthStoreState>((set) => ({
	...initialState,
	setUser: (user) => set({ user }),
	setSession: (session) => set({ session }),
	setLoading: (loading) => set({ loading }),
	patchUser: (updates) =>
		set((state) => ({
			user: state.user ? { ...state.user, ...updates } : null,
		})),
	reset: () => set({ ...initialState }),
}));
