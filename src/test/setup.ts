// Test setup for Vitest
import { beforeEach, vi } from "vitest";

// Provide a compliant localStorage stub for Supabase auth in jsdom/node environments
const localStorageStub: Storage = (() => {
	const store = new Map<string, string>();
	return {
		getItem: (key: string) => store.get(key) ?? null,
		setItem: (key: string, value: string) => {
			store.set(key, value);
		},
		removeItem: (key: string) => {
			store.delete(key);
		},
		clear: () => {
			store.clear();
		},
		get length() {
			return store.size;
		},
		key: (index: number) => [...store.keys()][index] ?? null,
	};
})();

// Ensure localStorage is always available (jsdom may provide a broken stub)
if (
	typeof globalThis.localStorage === "undefined" ||
	!globalThis.localStorage?.getItem
) {
	Object.defineProperty(globalThis, "localStorage", {
		value: localStorageStub,
		writable: true,
	});
}

// Setup test environment
beforeEach(() => {
	// Reset mocks before each test
	vi.clearAllMocks();
});
