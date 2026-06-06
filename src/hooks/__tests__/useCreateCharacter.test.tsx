import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type React from "react";
import { act, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useCreateCharacter } from "@/hooks/useCharacters";
import type { Character } from "@/hooks/useCharacters";

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
});
