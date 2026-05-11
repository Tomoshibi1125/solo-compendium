import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type React from "react";
import { act, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { beforeEach, describe, expect, it } from "vitest";
import { useInitializeSpellSlots } from "@/hooks/useSpellSlots";
import {
	createLocalCharacter,
	listLocalSpellSlots,
	updateLocalCharacter,
	upsertLocalSpellSlot,
} from "@/lib/guestStore";

(
	globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

function clearGuestState() {
	window.localStorage.clear();
}

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

const InitializeProbe = ({
	characterId,
	job,
	level,
	onDone,
}: {
	characterId: string;
	job: string;
	level: number;
	onDone: (error?: unknown) => void;
}) => {
	const initialize = useInitializeSpellSlots();
	const started = useRef(false);

	useEffect(() => {
		if (started.current) return;
		started.current = true;
		initialize
			.mutateAsync({ characterId, job, level })
			.then(() => onDone())
			.catch((error) => onDone(error));
	}, [characterId, initialize, job, level, onDone]);

	return null;
};

describe("useInitializeSpellSlots", () => {
	beforeEach(() => {
		clearGuestState();
	});

	it("downgrades local spell slot maxima and removes inaccessible slots", async () => {
		const character = createLocalCharacter({
			name: "Slot Downgrade",
			job: "Mage",
			level: 10,
		});
		updateLocalCharacter(character.id, { level: 3 });
		upsertLocalSpellSlot(character.id, {
			spell_level: 1,
			slots_max: 4,
			slots_current: 4,
			slots_recovered_on_short_rest: 0,
			slots_recovered_on_long_rest: 1,
		});
		upsertLocalSpellSlot(character.id, {
			spell_level: 2,
			slots_max: 3,
			slots_current: 3,
			slots_recovered_on_short_rest: 0,
			slots_recovered_on_long_rest: 1,
		});
		upsertLocalSpellSlot(character.id, {
			spell_level: 5,
			slots_max: 2,
			slots_current: 2,
			slots_recovered_on_short_rest: 0,
			slots_recovered_on_long_rest: 1,
		});

		const queryClient = new QueryClient();
		let done = false;
		let failure: unknown;
		const unmount = mount(
			<QueryClientProvider client={queryClient}>
				<InitializeProbe
					characterId={character.id}
					job="Mage"
					level={3}
					onDone={(error) => {
						failure = error;
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
		expect(done).toBe(true);
		expect(
			listLocalSpellSlots(character.id).map((slot) => slot.spell_level),
		).toEqual([1, 2]);
		expect(
			listLocalSpellSlots(character.id).find((slot) => slot.spell_level === 1),
		).toMatchObject({
			slots_max: 4,
			slots_current: 4,
		});
		expect(
			listLocalSpellSlots(character.id).find((slot) => slot.spell_level === 2),
		).toMatchObject({
			slots_max: 2,
			slots_current: 2,
		});
	});
});
