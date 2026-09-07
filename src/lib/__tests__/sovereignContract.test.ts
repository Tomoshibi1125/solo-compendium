import { describe, expect, it } from "vitest";
import type { Job, Path, Regent } from "@/lib/geminiProtocol";
import {
	buildSovereignExport,
	extractJsonObject,
	parseImportedSovereign,
	SOVEREIGN_ABILITY_LEVELS,
	type SovereignInputs,
} from "@/lib/sovereign/sovereignContract";

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
	id: "umbral_regent",
	name: "Umbral Regent",
	theme: "Umbral and Death",
	damage_type: "Necrotic",
} as unknown as Regent;
const regentB = {
	id: "frost_regent",
	name: "Frost Regent",
	theme: "Eternal Winter & absolute Zero",
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
	it("embeds canonical ordered inputs and the exact JSON contract", () => {
		const { prompt, bundle } = buildSovereignExport(inputs);
		expect(prompt).toContain("Destroyer");
		expect(prompt).toContain("Frostwarden");
		expect(prompt).toContain("Umbral Regent");
		expect(prompt).toContain("Frost Regent");
		expect(prompt).toContain("EXACTLY 8");
		expect(prompt).not.toContain("Path of the Frostwarden");
		expect(bundle.kind).toBe("rift-sovereign-request");
		expect(bundle.inputs.regentAId).toBe("umbral_regent");
		expect(bundle.inputs.regentBId).toBe("frost_regent");
		expect(bundle.responseShape.abilities).toHaveLength(8);
	});

	it("normalizes an explicit alias without swapping A/B", () => {
		const aliasInputs = {
			...inputs,
			regentA: { ...regentA, id: "shadow_regent" } as Regent,
		};
		const { bundle } = buildSovereignExport(aliasInputs);
		expect([bundle.inputs.regentAId, bundle.inputs.regentBId]).toEqual([
			"umbral_regent",
			"frost_regent",
		]);
	});

	it("rejects normalized self-fusion", () => {
		expect(() =>
			buildSovereignExport({
				...inputs,
				regentA: { ...regentA, id: "shadow_regent" } as Regent,
				regentB: regentA,
			}),
		).toThrow(/distinct canonical Regents/i);
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
	it("round-trips exactly one ordered ability per milestone", () => {
		const result = parseImportedSovereign(JSON.stringify(validPayload), inputs);
		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.sovereign.abilities.map((ability) => ability.level)).toEqual(
			SOVEREIGN_ABILITY_LEVELS,
		);
		expect(result.sovereign.fusion_method).toBe(
			"Gemini Protocol (External Fusion)",
		);
		expect(result.sovereign.job).toBe(job);
		expect(result.sovereign.regentA).toBe(regentA);
		expect(result.sovereign.regentB).toBe(regentB);
	});

	it("tolerates a code-fenced reply with surrounding prose", () => {
		const raw = `Absolutely:\n\`\`\`json\n${JSON.stringify(validPayload)}\n\`\`\`\nEnjoy!`;
		expect(parseImportedSovereign(raw, inputs).ok).toBe(true);
	});

	it("coerces loose fields without weakening the complete ladder", () => {
		const loose = {
			...validPayload,
			abilities: validPayload.abilities.map((ability) =>
				ability.level === 5
					? {
							...ability,
							level: "5",
							is_capstone: "false",
							origin_sources: "RegentA+RegentB",
							recharge: "",
							fusion_type: "",
						}
					: ability,
			),
		};
		const result = parseImportedSovereign(JSON.stringify(loose), inputs);
		expect(result.ok).toBe(true);
		if (!result.ok) return;
		const ability = result.sovereign.abilities[2];
		expect(ability.level).toBe(5);
		expect(ability.is_capstone).toBe(false);
		expect(ability.recharge).toBeNull();
		expect(ability.origin_sources).toEqual(["RegentA+RegentB"]);
		expect(ability.fusion_type).toBe("fusion");
	});

	it.each([
		[
			"missing milestone",
			{ ...validPayload, abilities: validPayload.abilities.slice(0, -1) },
		],
		[
			"extra milestone",
			{
				...validPayload,
				abilities: [
					...validPayload.abilities,
					{ ...validPayload.abilities[0], level: 2 },
				],
			},
		],
		[
			"duplicate milestone",
			{
				...validPayload,
				abilities: validPayload.abilities.map((ability, index) =>
					index === 1 ? { ...ability, level: 1 } : ability,
				),
			},
		],
		[
			"out-of-order milestones",
			{
				...validPayload,
				abilities: [
					validPayload.abilities[1],
					validPayload.abilities[0],
					...validPayload.abilities.slice(2),
				],
			},
		],
		[
			"non-capstone marked capstone",
			{
				...validPayload,
				abilities: validPayload.abilities.map((ability) =>
					ability.level === 14 ? { ...ability, is_capstone: true } : ability,
				),
			},
		],
		[
			"required capstone cleared",
			{
				...validPayload,
				abilities: validPayload.abilities.map((ability) =>
					ability.level === 17 ? { ...ability, is_capstone: false } : ability,
				),
			},
		],
	])("rejects a malformed ladder: %s", (_label, payload) => {
		const result = parseImportedSovereign(JSON.stringify(payload), inputs);
		expect(result.ok).toBe(false);
	});

	it("rejects normalized self-fusion inputs", () => {
		const result = parseImportedSovereign(validPayload, {
			...inputs,
			regentA: { ...regentA, id: "shadow_regent" } as Regent,
			regentB: regentA,
		});
		expect(result.ok).toBe(false);
		if (result.ok) return;
		expect(result.errors.join(" ")).toMatch(/distinct canonical Regents/i);
	});

	it("ignores attacker-supplied job/path bodies", () => {
		const result = parseImportedSovereign(
			JSON.stringify({
				...validPayload,
				job: { id: "evil", name: "Backdoor", hit_die: "d20" },
				path: { id: "evil-path", name: "Exploit" },
			}),
			inputs,
		);
		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.sovereign.job).toBe(job);
		expect(result.sovereign.path).toBe(path);
	});

	it("rejects malformed JSON and missing required fields", () => {
		expect(parseImportedSovereign("{ not valid json ", inputs).ok).toBe(false);
		const { name: _omit, ...withoutName } = validPayload;
		expect(parseImportedSovereign(JSON.stringify(withoutName), inputs).ok).toBe(
			false,
		);
	});

	it("detects an accidentally uploaded request bundle", () => {
		const { bundle } = buildSovereignExport(inputs);
		const result = parseImportedSovereign(JSON.stringify(bundle), inputs);
		expect(result.ok).toBe(false);
		if (result.ok) return;
		expect(result.errors[0]).toMatch(/request file/i);
	});

	it("accepts a pre-parsed object transport", () => {
		expect(parseImportedSovereign(validPayload, inputs).ok).toBe(true);
	});
});
