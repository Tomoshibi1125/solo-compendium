import { describe, expect, it } from "vitest";

import {
	buildRaSystemPrompt,
	RA_CANON_CONTEXT,
	type RaPromptRole,
} from "@/lib/ai/raCanonPrompt";

const ROLES: RaPromptRole[] = [
	"gm-content",
	"warden-chat",
	"narrator",
	"json-tool",
];

describe("RA canon prompt module", () => {
	it("carries the load-bearing canon terms", () => {
		for (const term of [
			"Gemini Protocol",
			"Rift Favor",
			"gate",
			"core",
			"a Clear collapses the Threshold",
			"AGI (Agility)",
			"SENSE (Sense)",
			"Idol instruments are electric guitar, synth, or DJ controller",
			"E, D, C, B, A, S",
		]) {
			expect(RA_CANON_CONTEXT).toContain(term);
		}
	});

	it("bans off-canon and mangled phrasing", () => {
		// "monarch" is Solo Leveling terminology, not RA — allowed only inside
		// the explicit prohibition sentence itself.
		const prohibition = RA_CANON_CONTEXT.toLowerCase().split("monarch");
		expect(prohibition.length).toBe(2); // exactly one mention: the ban itself
		expect(RA_CANON_CONTEXT).toContain("Never use the word");

		for (const banned of [
			"Agility/Agility",
			"Vitality/Vitality",
			"formerly Regents",
		]) {
			expect(RA_CANON_CONTEXT).not.toContain(banned);
		}

		// Medieval-fantasy defaults are explicitly prohibited, not recommended:
		// "lutes" may appear only inside the "no lutes" prohibition.
		expect(RA_CANON_CONTEXT).toContain("no lutes");
		expect(RA_CANON_CONTEXT.split("lute").length).toBe(2);
	});

	it("every role prompt embeds the shared canon block", () => {
		for (const role of ROLES) {
			const prompt = buildRaSystemPrompt(role);
			expect(prompt).toContain(RA_CANON_CONTEXT);
		}
	});

	it("appends surface-specific instructions after the canon", () => {
		const prompt = buildRaSystemPrompt("json-tool", 'Respond with {"x": 1}');
		expect(prompt.indexOf(RA_CANON_CONTEXT)).toBeLessThan(
			prompt.indexOf('Respond with {"x": 1}'),
		);
	});

	it("json-tool role demands bare JSON output", () => {
		expect(buildRaSystemPrompt("json-tool")).toContain(
			"Return ONLY valid JSON",
		);
	});
});
