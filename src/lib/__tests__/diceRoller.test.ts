import { describe, expect, it } from "vitest";
import { rollDiceString } from "@/lib/diceRoller";

describe("rollDiceString", () => {
	it("rejects flat numeric damage payloads; rolls must use dice formulas", () => {
		expect(() => rollDiceString("4")).toThrow(/Invalid dice string/);
	});
});
