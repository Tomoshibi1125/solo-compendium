import { afterEach, describe, expect, test, vi } from "vitest";
import {
	type ActionResolutionPayload,
	resolveAttack,
	resolveSave,
} from "@/lib/actionResolution";

const basePayload = (): Omit<ActionResolutionPayload, "kind"> => ({
	version: 1,
	id: "t1",
	name: "Test",
	source: { type: "spell", entryId: "e1" },
});

describe("actionResolution (adv/dis + d20 selection)", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	test("resolveAttack: advantage chooses the higher d20 and reports both rolls", () => {
		const seq = [0.05, 0.85];
		vi.spyOn(Math, "random").mockImplementation(() => {
			const v = seq.shift();
			if (v === undefined) throw new Error("Math.random sequence exhausted");
			return v;
		});

		const payload: ActionResolutionPayload = {
			...basePayload(),
			kind: "attack",
			attack: { roll: "1d20+0", rollMode: "advantage" },
		};

		const out = resolveAttack(payload, 10);
		expect(out.kind).toBe("attack");
		if (out.kind !== "attack") return;

		expect(out.attackMode).toBe("advantage");
		expect(out.attackD20).toEqual([2, 18]);
		expect(out.attackTotal).toBe(18);
		expect(out.hit).toBe(true);
	});

	test("resolveAttack: disadvantage chooses the lower d20", () => {
		const seq = [0.95, 0.1];
		vi.spyOn(Math, "random").mockImplementation(() => {
			const v = seq.shift();
			if (v === undefined) throw new Error("Math.random sequence exhausted");
			return v;
		});

		const payload: ActionResolutionPayload = {
			...basePayload(),
			kind: "attack",
			attack: { roll: "1d20", rollMode: "disadvantage" },
		};

		const out = resolveAttack(payload, 1);
		expect(out.kind).toBe("attack");
		if (out.kind !== "attack") return;

		expect(out.attackMode).toBe("disadvantage");
		expect(out.attackD20).toEqual([20, 3]);
		expect(out.attackTotal).toBe(3);
	});

	test("resolveSave: disadvantage chooses the lower d20 and reports both rolls", () => {
		const seq = [0.6, 0.15];
		vi.spyOn(Math, "random").mockImplementation(() => {
			const v = seq.shift();
			if (v === undefined) throw new Error("Math.random sequence exhausted");
			return v;
		});

		const payload: ActionResolutionPayload = {
			...basePayload(),
			kind: "save",
			save: { dc: 12, roll: "1d20+0", rollMode: "disadvantage" },
		};

		const out = resolveSave(payload);
		expect(out.kind).toBe("save");
		if (out.kind !== "save") return;

		expect(out.saveMode).toBe("disadvantage");
		expect(out.saveD20).toEqual([13, 4]);
		expect(out.saveTotal).toBe(4);
	});

	test("resolveSave: normal uses a single d20", () => {
		const seq = [0.0];
		vi.spyOn(Math, "random").mockImplementation(() => {
			const v = seq.shift();
			if (v === undefined) throw new Error("Math.random sequence exhausted");
			return v;
		});

		const payload: ActionResolutionPayload = {
			...basePayload(),
			kind: "save",
			save: { dc: 5, roll: "1d20+0", rollMode: "normal" },
		};

		const out = resolveSave(payload);
		expect(out.kind).toBe("save");
		if (out.kind !== "save") return;

		expect(out.saveMode).toBe("normal");
		expect(out.saveD20).toEqual([1]);
		expect(out.saveTotal).toBe(1);
	});
});
