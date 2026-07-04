import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type React from "react";
import { act, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Character } from "@/hooks/useCharacters";
import { useCreateCharacter } from "@/hooks/useCharacters";
import { AppError } from "@/lib/appError";
import { SANDBOX_NPC_MARKER } from "@/lib/characterScope";

const mocks = vi.hoisted(() => ({
	fromSpy: vi.fn(),
	getUserSpy: vi.fn(),
}));

vi.mock("@/integrations/supabase/client", () => ({
	isSupabaseConfigured: true,
	supabase: {
		auth: {
			getUser: mocks.getUserSpy,
		},
		from: mocks.fromSpy,
	},
}));

vi.mock("@/lib/canonicalCompendium", () => ({
	resolveCharacterCanonicalIds: vi.fn(async (data: unknown) => data),
}));

vi.mock("@/lib/characterOverlayValidation", () => ({
	normalizeCharacterOverlayFields: vi.fn(async (data: unknown) => data),
}));

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

const tick = async () => {
	await act(async () => {
		await Promise.resolve();
	});
};

function CreateCharacterProbe({
	onDone,
}: {
	onDone: (error?: unknown, character?: Character) => void;
}) {
	const createCharacter = useCreateCharacter();
	const started = useRef(false);

	useEffect(() => {
		if (started.current) return;
		started.current = true;
		createCharacter
			.mutateAsync({
				name: "Guest Init Test",
				level: 1,
				job: "Mage",
			})
			.then((character) => onDone(undefined, character))
			.catch((error) => onDone(error));
	}, [createCharacter, onDone]);

	return null;
}

describe("useCreateCharacter", () => {
	beforeEach(() => {
		window.localStorage.clear();
		vi.clearAllMocks();
	});

	it("creates a local guest character without a remote auth lookup when no session is stored", async () => {
		const queryClient = new QueryClient({
			defaultOptions: {
				mutations: { retry: false },
				queries: { retry: false },
			},
		});
		let done = false;
		let failure: unknown;
		let character: Character | undefined;

		const unmount = mount(
			<QueryClientProvider client={queryClient}>
				<CreateCharacterProbe
					onDone={(error, created) => {
						failure = error;
						character = created;
						done = true;
					}}
				/>
			</QueryClientProvider>,
		);

		for (let i = 0; i < 20 && !done; i += 1) {
			await tick();
		}
		unmount();

		expect(failure).toBeUndefined();
		expect(character?.id).toMatch(/^local_/);
		expect(mocks.getUserSpy).not.toHaveBeenCalled();
	});

	// Authenticated path: wires supabase mocks so the per-user limit query returns
	// `ownRows`, then runs the create mutation and reports {failure, character,
	// insertSpy}.
	const runAuthenticatedCreate = async (
		ownRows: { name: string; notes: string | null }[],
	) => {
		window.localStorage.setItem("sb-test-auth-token", "session");
		mocks.getUserSpy.mockResolvedValue({
			data: { user: { id: "user-1", email: "warden@example.com" } },
		});

		const createdChar = { id: "char-1", name: "Guest Init Test" };
		const insertSpy = vi.fn(() => ({
			select: vi.fn(() => ({
				single: vi.fn(() =>
					Promise.resolve({ data: createdChar, error: null }),
				),
			})),
		}));
		mocks.fromSpy.mockImplementation((table: string) => {
			if (table === "characters") {
				return {
					select: vi.fn((cols?: string) => {
						if (cols === "name, notes") {
							return {
								eq: vi.fn(() =>
									Promise.resolve({ data: ownRows, error: null }),
								),
							};
						}
						return {
							single: vi.fn(() =>
								Promise.resolve({ data: createdChar, error: null }),
							),
						};
					}),
					insert: insertSpy,
				};
			}
			return { upsert: vi.fn(() => Promise.resolve({ error: null })) };
		});

		const queryClient = new QueryClient({
			defaultOptions: {
				mutations: { retry: false },
				queries: { retry: false },
			},
		});
		let done = false;
		let failure: unknown;
		let character: Character | undefined;

		const unmount = mount(
			<QueryClientProvider client={queryClient}>
				<CreateCharacterProbe
					onDone={(error, created) => {
						failure = error;
						character = created;
						done = true;
					}}
				/>
			</QueryClientProvider>,
		);
		for (let i = 0; i < 20 && !done; i += 1) {
			await tick();
		}
		unmount();

		return { failure, character, insertSpy };
	};

	it("lets a user with 6 hidden sandbox NPCs still create a personal character", async () => {
		const sandboxRows = Array.from({ length: 6 }, (_, i) => ({
			name: `NPC ${i}`,
			notes: `${SANDBOX_NPC_MARKER}\nFaction: Blackroot`,
		}));

		const { failure, character, insertSpy } =
			await runAuthenticatedCreate(sandboxRows);

		expect(failure).toBeUndefined();
		expect(character?.id).toBe("char-1");
		expect(insertSpy).toHaveBeenCalledTimes(1);
	});

	it("still rejects a 7th personal character with CHARACTER_LIMIT", async () => {
		const personalRows = Array.from({ length: 6 }, (_, i) => ({
			name: `Hero ${i}`,
			notes: null,
		}));

		const { failure, character, insertSpy } =
			await runAuthenticatedCreate(personalRows);

		expect(character).toBeUndefined();
		expect(failure).toBeInstanceOf(AppError);
		expect((failure as AppError).code).toBe("CHARACTER_LIMIT");
		expect(insertSpy).not.toHaveBeenCalled();
	});
});
