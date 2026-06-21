import { describe, expect, it } from "vitest";
import type { Job, Path, Regent } from "@/lib/geminiProtocol";
import {
	buildSovereignExport,
	extractJsonObject,
	parseImportedSovereign,
	SOVEREIGN_ABILITY_LEVELS,
	type SovereignInputs,
} from "@/lib/sovereign/sovereignContract";

// Minimal canonical fixtures (only the fields the contract reads).
const job = {
	id: "job-destroyer",
	name: "Destroyer",
	hit_die: "d12",
	primary_abilities: ["STR"],
} as unknown as Job;

const path = {
	id: "path-frost",
	name: "Path of the Frostwarden",
} as unknown as Path;

const regentA = {
	id: "regent-shadow",
	name: "Shadow Regent",
	theme: "Shadow",
	damage_type: "Necrotic",
} as unknown as Regent;

const regentB = {
	id: "regent-frost",
	name: "Frost Regent",
	theme: "Frost",
	damage_type: "Cold",
} as unknown as Regent;

const inputs: SovereignInputs = { job, path, regentA, regentB };

const validPayload = {
	name: "Frostvoid Sovereign",
	title: "Sovereign of the Frozen Shadow",
	description: "A long origin describing the Ascendant Event in full.",
	fusion_theme: "Singularity Frost",
	fusion_description:
		"A fused martial style neither component could reach alone.",
	power_multiplier: "Zenith-Tier",
	fusion_stability: "Stable (Unified, Sovereign-Grade)",
	abilities: SOVEREIGN_ABILITY_LEVELS.map((level) => ({
		name: `Ability ${level}`,
		description: `Merged effect at level ${level} dealing 2d6 cold damage, DC 15.`,
		level,
		action_type: level === 1 ? "Passive" : "1 action",
		recharge: level >= 14 ? "Long Rest" : null,
		is_capstone: level === 17 || level === 20,
		origin_sources: ["Job+Path+RegentA"],
		fusion_type: "fusion",
	})),
};

describe("buildSovereignExport", () => {
	it("embeds the fusion inputs and JSON contract in the prompt", () => {
		const { prompt, bundle } = buildSovereignExport(inputs);
		expect(prompt).toContain("Destroyer");
		expect(prompt).toContain("Frostwarden");
		expect(prompt).toContain("Shadow Regent");
		expect(prompt).toContain("Frost Regent");
		expect(prompt).toContain("EXACTLY 8");
		// Strips the "Path of the" prefix in the prompt body.
		expect(prompt).not.toContain("Path of the Frostwarden");
		expect(bundle.kind).toBe("rift-sovereign-request");
		expect(bundle.inputs.jobId).toBe("job-destroyer");
		expect(bundle.inputs.regentBId).toBe("regent-frost");
	});
});

describe("extractJsonObject", () => {
	it("returns the object from a code-fenced reply", () => {
		const raw = 'Sure!\n```json\n{"a":1}\n```\nHope that helps';
		expect(extractJsonObject(raw)).toBe('{"a":1}');
	});

	it("returns a balanced object surrounded by prose and nested braces", () => {
		const raw = 'Here you go: {"a":{"b":2},"c":"}"} cheers';
		expect(extractJsonObject(raw)).toBe('{"a":{"b":2},"c":"}"}');
	});

	it("returns null when there is no object", () => {
		expect(extractJsonObject("no json here")).toBeNull();
	});
});

describe("parseImportedSovereign", () => {
	it("round-trips a valid payload and re-attaches canonical inputs", () => {
		const res = parseImportedSovereign(JSON.stringify(validPayload), inputs);
		expect(res.ok).toBe(true);
		if (!res.ok) return;
		expect(res.sovereign.name).toBe("Frostvoid Sovereign");
		expect(res.sovereign.abilities).toHaveLength(8);
		expect(res.sovereign.fusion_method).toBe(
			"Gemini Protocol (External Fusion)",
		);
		// Canonical objects come from inputs, not the imported text.
		expect(res.sovereign.job).toBe(job);
		expect(res.sovereign.regentA).toBe(regentA);
		expect(res.sovereign.regentB).toBe(regentB);
	});

	it("tolerates a code-fenced reply with surrounding prose", () => {
		const raw = `Absolutely — here is the fusion:\n\`\`\`json\n${JSON.stringify(validPayload)}\n\`\`\`\nEnjoy!`;
		const res = parseImportedSovereign(raw, inputs);
		expect(res.ok).toBe(true);
	});

	it("coerces loose types (string level/boolean, single origin string)", () => {
		const loose = {
			...validPayload,
			abilities: [
				{
					name: "Solo",
					description: "Does a thing for 1d8 force.",
					level: "5",
					action_type: "1 bonus action",
					recharge: "",
					is_capstone: "false",
					origin_sources: "RegentA+RegentB",
					fusion_type: "",
				},
			],
		};
		const res = parseImportedSovereign(JSON.stringify(loose), inputs);
		expect(res.ok).toBe(true);
		if (!res.ok) return;
		const a = res.sovereign.abilities[0];
		expect(a.level).toBe(5);
		expect(a.is_capstone).toBe(false);
		expect(a.recharge).toBeNull();
		expect(a.origin_sources).toEqual(["RegentA+RegentB"]);
		expect(a.fusion_type).toBe("fusion");
	});

	it("ignores attacker-supplied job/path bodies (re-attaches canonical)", () => {
		const tampered = {
			...validPayload,
			job: { id: "evil", name: "Backdoor", hit_die: "d20" },
			path: { id: "evil-path", name: "Exploit" },
		};
		const res = parseImportedSovereign(JSON.stringify(tampered), inputs);
		expect(res.ok).toBe(true);
		if (!res.ok) return;
		expect(res.sovereign.job).toBe(job);
		expect(res.sovereign.path).toBe(path);
	});

	it("rejects malformed JSON", () => {
		const res = parseImportedSovereign("{ not valid json ", inputs);
		expect(res.ok).toBe(false);
		if (res.ok) return;
		expect(res.errors[0]).toMatch(/no json object|invalid json/i);
	});

	it("rejects a missing required field with a field-pathed error", () => {
		const { name: _omit, ...noName } = validPayload;
		const res = parseImportedSovereign(JSON.stringify(noName), inputs);
		expect(res.ok).toBe(false);
		if (res.ok) return;
		expect(res.errors.join(" ")).toMatch(/name/i);
	});

	it("rejects an empty abilities array", () => {
		const res = parseImportedSovereign(
			JSON.stringify({ ...validPayload, abilities: [] }),
			inputs,
		);
		expect(res.ok).toBe(false);
	});

	it("detects an accidentally-uploaded request bundle", () => {
		const { bundle } = buildSovereignExport(inputs);
		const res = parseImportedSovereign(JSON.stringify(bundle), inputs);
		expect(res.ok).toBe(false);
		if (res.ok) return;
		expect(res.errors[0]).toMatch(/request file/i);
	});

	it("accepts a pre-parsed object (file-upload transport)", () => {
		const res = parseImportedSovereign(validPayload, inputs);
		expect(res.ok).toBe(true);
	});
});
