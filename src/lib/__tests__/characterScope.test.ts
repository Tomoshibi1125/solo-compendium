import { describe, expect, it } from "vitest";
import {
	filterPersonalCharacters,
	isSandboxNpcCharacter,
	SANDBOX_NPC_MARKER,
} from "../characterScope";

describe("character scope", () => {
	it("detects sandbox NPCs from the shared notes marker", () => {
		expect(
			isSandboxNpcCharacter({
				notes: `${SANDBOX_NPC_MARKER}\nFaction: Blackroot`,
			}),
		).toBe(true);
		expect(isSandboxNpcCharacter({ notes: "Faction: Blackroot" })).toBe(false);
		expect(isSandboxNpcCharacter({ notes: null })).toBe(false);
	});

	it("filters sandbox NPC rows out of personal character lists", () => {
		const rows = [
			{ id: "ascendant-1", notes: "Personal roster entry" },
			{
				id: "sandbox-npc-1",
				notes: `${SANDBOX_NPC_MARKER}\nFaction: Blackroot`,
			},
			{ id: "ascendant-2", notes: undefined },
		];

		expect(filterPersonalCharacters(rows).map((row) => row.id)).toEqual([
			"ascendant-1",
			"ascendant-2",
		]);
	});
});
