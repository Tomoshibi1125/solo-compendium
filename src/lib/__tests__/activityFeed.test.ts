import { describe, expect, it } from "vitest";
import {
	ACTIVITY_CAP,
	appendActivity,
	clearActivity,
	emptyActivityFeed,
	removeActivity,
} from "@/lib/activityFeed";

describe("activityFeed", () => {
	it("prepends new events (most recent first)", () => {
		let state = emptyActivityFeed();
		state = appendActivity(state, { kind: "generated", label: "First" });
		state = appendActivity(state, { kind: "exported", label: "Second" });
		expect(state.events.map((e) => e.label)).toEqual(["Second", "First"]);
	});

	it("attaches category and meta only when provided", () => {
		const state = appendActivity(emptyActivityFeed(), {
			kind: "joined",
			label: "Joined campaign",
			category: "campaign",
			meta: { id: "abc" },
		});
		const [event] = state.events;
		expect(event.category).toBe("campaign");
		expect(event.meta).toEqual({ id: "abc" });

		const bare = appendActivity(emptyActivityFeed(), {
			kind: "x",
			label: "y",
		});
		expect(bare.events[0].category).toBeUndefined();
		expect(bare.events[0].meta).toBeUndefined();
	});

	it(`caps the feed at ${ACTIVITY_CAP} events, evicting the oldest`, () => {
		let state = emptyActivityFeed();
		for (let i = 0; i < ACTIVITY_CAP + 10; i++) {
			state = appendActivity(state, { kind: "x", label: `e${i}` });
		}
		expect(state.events).toHaveLength(ACTIVITY_CAP);
		expect(state.events[0].label).toBe(`e${ACTIVITY_CAP + 9}`);
		expect(state.events.at(-1)?.label).toBe("e10");
	});

	it("removes a single event by id and clears all", () => {
		let state = appendActivity(emptyActivityFeed(), { kind: "x", label: "a" });
		const id = state.events[0].id;
		state = appendActivity(state, { kind: "x", label: "b" });
		state = removeActivity(state, id);
		expect(state.events.map((e) => e.label)).toEqual(["b"]);
		expect(clearActivity().events).toHaveLength(0);
	});
});
