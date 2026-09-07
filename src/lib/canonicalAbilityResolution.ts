import type { StaticCompendiumEntry } from "@/data/compendium/providers/types";
import type {
	CanonicalAbilityResolutionV1,
	CanonicalActivationSpec,
	CanonicalDamageSpec,
	CanonicalDurationSpec,
	CanonicalHealingSpec,
	CanonicalRangeSpec,
	CanonicalResolutionKind,
	CanonicalSaveSpec,
	CanonicalTargetSpec,
	CanonicalUseSpec,
} from "@/types/compendium";

export type CanonicalAbilityType = "spell" | "power" | "technique";

export interface CanonicalAbilityReviewBlocker {
	id: string;
	message: string;
}

export interface ResolveCanonicalAbilityOptions {
	canonicalType: CanonicalAbilityType;
	reviewBlocker?: CanonicalAbilityReviewBlocker | null;
}

type UnknownRecord = Record<string, unknown>;
type LocatedValue = { path: string; value: unknown };

const isRecord = (value: unknown): value is UnknownRecord =>
	typeof value === "object" && value !== null && !Array.isArray(value);

const atPath = (record: UnknownRecord, path: string): unknown => {
	let value: unknown = record;
	for (const segment of path.split(".")) {
		if (!isRecord(value)) return undefined;
		value = value[segment];
	}
	return value;
};

const firstLocated = (
	record: UnknownRecord,
	paths: readonly string[],
): LocatedValue | null => {
	for (const path of paths) {
		const value = atPath(record, path);
		if (value !== undefined && value !== null && value !== "") {
			return { path, value };
		}
	}
	return null;
};

const text = (value: unknown): string | null => {
	if (typeof value === "string" && value.trim()) return value.trim();
	if (typeof value === "number" && Number.isFinite(value)) return String(value);
	if (!isRecord(value)) return null;
	const raw = value.raw;
	if (typeof raw === "string" && raw.trim()) return raw.trim();
	const type = typeof value.type === "string" ? value.type.trim() : "";
	const amount = value.value ?? value.distance ?? value.time;
	const unit = typeof value.unit === "string" ? value.unit.trim() : "";
	if ((typeof amount === "string" || typeof amount === "number") && type) {
		return `${amount}${unit ? ` ${unit}` : ""} ${type}`.trim();
	}
	if (typeof amount === "string" || typeof amount === "number") {
		return `${amount}${unit ? ` ${unit}` : ""}`.trim();
	}
	return type || null;
};

const formula = (value: unknown): string | null => {
	const candidate = text(value);
	if (!candidate) return null;
	const normalized = candidate.replace(/\s+/g, " ").trim();
	if (
		/\d+d\d+/i.test(normalized) ||
		/^\d+(?:\s*[+-]\s*\d+)?$/.test(normalized)
	) {
		return normalized;
	}
	if (/\b(?:level|proficiency|ability|modifier|spent)\b/i.test(normalized)) {
		return normalized;
	}
	return null;
};

const activationFrom = (raw: string | null): CanonicalActivationSpec => {
	if (!raw) return { economy: "manual", raw: "Not authored" };
	const normalized = raw.toLowerCase().replace(/[_-]+/g, " ").trim();
	if (/\bbonus action\b/.test(normalized))
		return { economy: "bonus-action", raw };
	if (/\breaction\b/.test(normalized)) return { economy: "reaction", raw };
	if (/\bfree action\b/.test(normalized))
		return { economy: "free-action", raw };
	if (/\b(?:movement|move action)\b/.test(normalized))
		return { economy: "movement", raw };
	if (/\b(?:passive|always active)\b/.test(normalized))
		return { economy: "passive", raw };
	if (
		/^(?:1\s+)?action$/.test(normalized) ||
		normalized === "standard action"
	) {
		return { economy: "action", raw };
	}
	const timed = normalized.match(/^(\d+)\s+(minute|hour)s?$/);
	if (timed) {
		return {
			economy: "special",
			value: Number(timed[1]),
			unit: timed[2] as "minute" | "hour",
			raw,
		};
	}
	return { economy: "manual", raw };
};

const rangeFrom = (raw: string | null): CanonicalRangeSpec => {
	if (!raw) return { kind: "manual", raw: "Not authored" };
	const normalized = raw.toLowerCase().trim();
	if (normalized === "self") return { kind: "self", raw };
	if (normalized === "touch") return { kind: "touch", raw };
	if (normalized === "sight") return { kind: "sight", raw };
	if (normalized === "unlimited") return { kind: "unlimited", raw };
	const distance = normalized.match(/(\d+)\s*(feet|foot|ft|miles?|mi)\b/);
	if (distance) {
		return {
			kind: "distance",
			distance: Number(distance[1]),
			unit: /mile|mi/.test(distance[2]) ? "miles" : "feet",
			raw,
		};
	}
	return { kind: "manual", raw };
};

const targetFrom = (
	raw: string | null,
	range: CanonicalRangeSpec,
	area: unknown,
): CanonicalTargetSpec => {
	const normalized = raw?.toLowerCase().trim() ?? "";
	let kind: CanonicalTargetSpec["kind"] = "manual";
	if (normalized === "self" || range.kind === "self") kind = "self";
	else if (/creature|enemy|ally|target/.test(normalized)) kind = "creature";
	else if (/object/.test(normalized)) kind = "object";
	else if (/point|space/.test(normalized)) kind = "point";
	else if (area) kind = "area";

	const result: CanonicalTargetSpec = {
		kind,
		range,
		raw: raw ?? "Not authored",
	};
	if (isRecord(area)) {
		const shapeText = text(area.shape ?? area.type)?.toLowerCase() ?? "";
		const shape = [
			"cone",
			"cube",
			"cylinder",
			"line",
			"radius",
			"sphere",
		].includes(shapeText)
			? (shapeText as NonNullable<CanonicalTargetSpec["area"]>["shape"])
			: "special";
		const sizeValue = area.size ?? area.value ?? area.radius;
		result.area = {
			shape,
			...(typeof sizeValue === "number" ? { size: sizeValue } : {}),
			unit: "feet",
		};
	}
	return result;
};

const durationFrom = (
	raw: string | null,
	concentration: boolean,
): CanonicalDurationSpec => {
	if (!raw) return { kind: "manual", concentration, raw: "Not authored" };
	const normalized = raw.toLowerCase().trim();
	if (/instant/.test(normalized))
		return { kind: "instantaneous", concentration, raw };
	if (/permanent/.test(normalized))
		return { kind: "permanent", concentration, raw };
	if (/until.*(?:short|long).*rest/.test(normalized)) {
		return { kind: "until-rest", concentration, raw };
	}
	const timed = normalized.match(/(?:up to\s+)?(\d+)\s+(round|minute|hour)s?/);
	if (timed) {
		return {
			kind: timed[2] as "round" | "minute" | "hour",
			value: Number(timed[1]),
			concentration,
			raw,
		};
	}
	return { kind: concentration ? "special" : "manual", concentration, raw };
};

const successPolicy = (
	value: string | null,
): CanonicalSaveSpec["onSuccess"] => {
	if (!value) return "manual";
	if (/half/i.test(value)) return "half-damage";
	if (/no effect|none|negates/i.test(value)) return "none";
	if (/reduced|partial/i.test(value)) return "reduced-effect";
	return "custom";
};

const usesFrom = (
	record: UnknownRecord,
	sourcePaths: Set<string>,
): CanonicalUseSpec => {
	if (record.atWill === true) {
		sourcePaths.add("atWill");
		return { tracking: "unlimited", formula: "at will" };
	}
	const located = firstLocated(record, [
		"uses_per_rest_formula",
		"uses_per_rest",
		"limitations.uses_per_rest",
		"limitations.uses",
		"limitations.usage",
	]);
	if (!located) return { tracking: "manual", raw: "Use economy not authored" };
	sourcePaths.add(located.path);
	const raw = text(located.value) ?? "Use economy not authored";
	const rechargeLocated = firstLocated(record, [
		"recharge",
		"limitations.recharge",
	]);
	if (rechargeLocated) sourcePaths.add(rechargeLocated.path);
	const rechargeRaw = text(rechargeLocated?.value)?.toLowerCase() ?? "";
	const recharge: CanonicalUseSpec["recharge"] = rechargeRaw.includes("short")
		? "short-rest"
		: rechargeRaw.includes("long")
			? "long-rest"
			: rechargeRaw.includes("encounter")
				? "encounter"
				: rechargeRaw.includes("day")
					? "day"
					: "special";
	return {
		tracking: /at.?will|unlimited/i.test(raw) ? "unlimited" : "uses",
		formula: raw,
		recharge,
		raw,
	};
};

/**
 * Convert authored ability fields into one versioned runtime contract. The
 * adapter never parses prose into missing numbers or identities. Incomplete
 * rows stay manual, while known review blockers are stripped of executable
 * effects and remain explicitly review-blocked.
 */
export function resolveCanonicalAbility(
	entry: StaticCompendiumEntry,
	options: ResolveCanonicalAbilityOptions,
): CanonicalAbilityResolutionV1 {
	if (entry.ability_resolution?.version === 1) return entry.ability_resolution;

	const record = entry as unknown as UnknownRecord;
	const sourcePaths = new Set<string>();
	const locateText = (paths: readonly string[]): string | null => {
		const located = firstLocated(record, paths);
		if (!located) return null;
		sourcePaths.add(located.path);
		return text(located.value);
	};

	const activationRaw = locateText([
		"activation_time",
		"casting_time",
		"activation_action",
		"activation_type",
		"activation",
		"mechanics.action_type",
		"mechanics.action",
	]);
	const rangeRaw = locateText(["range", "range_desc", "mechanics.range"]);
	const targetRaw = locateText(["target", "mechanics.target"]);
	const areaLocated = firstLocated(record, ["area", "area_of_effect"]);
	if (areaLocated) sourcePaths.add(areaLocated.path);
	const durationRaw = locateText([
		"duration",
		"duration_desc",
		"mechanics.duration",
	]);
	const concentration = record.concentration === true;
	if (record.concentration !== undefined) sourcePaths.add("concentration");

	const activation = activationFrom(activationRaw);
	const range = rangeFrom(rangeRaw);
	const target = targetFrom(targetRaw, range, areaLocated?.value);
	const duration = durationFrom(durationRaw, concentration);
	const uses = usesFrom(record, sourcePaths);

	const attackLocated = firstLocated(record, [
		"attack",
		"spell_attack",
		"attack_roll",
		"mechanics.attack",
	]);
	if (attackLocated) sourcePaths.add(attackLocated.path);
	const attackRecord = isRecord(attackLocated?.value)
		? attackLocated.value
		: null;
	const attackType = text(attackRecord?.type)?.toLowerCase();
	const attack =
		record.has_attack_roll === true || attackRecord
			? {
					kind: attackType?.includes("melee")
						? ("melee" as const)
						: attackType?.includes("ranged")
							? ("ranged" as const)
							: attackType?.includes("weapon")
								? ("weapon" as const)
								: ("spell" as const),
					ability: text(attackRecord?.ability) ?? undefined,
					roll: text(attackRecord?.roll) ?? undefined,
					modifierFormula: text(attackRecord?.modifier) ?? undefined,
					critical: "standard" as const,
				}
			: undefined;
	if (record.has_attack_roll !== undefined) sourcePaths.add("has_attack_roll");

	const saveLocated = firstLocated(record, [
		"saving_throw",
		"mechanics.saving_throw",
	]);
	if (saveLocated) sourcePaths.add(saveLocated.path);
	const saveRecord = isRecord(saveLocated?.value) ? saveLocated.value : null;
	const saveAbilityLocated = firstLocated(record, [
		"save_ability",
		"saving_throw_ability",
		"mechanics.save",
		"mechanics.ability",
	]);
	if (saveAbilityLocated) sourcePaths.add(saveAbilityLocated.path);
	const saveAbility =
		text(saveRecord?.ability) ?? text(saveAbilityLocated?.value);
	const saveDc =
		saveRecord?.dc ??
		atPath(record, "mechanics.save_dc") ??
		atPath(record, "mechanics.dc");
	if (saveDc !== undefined && saveDc !== null)
		sourcePaths.add(
			saveRecord?.dc !== undefined
				? `${saveLocated?.path}.dc`
				: "mechanics.save_dc",
		);
	const saveSuccess = text(saveRecord?.success);
	const save: CanonicalSaveSpec | undefined =
		saveAbility && (typeof saveDc === "number" || typeof saveDc === "string")
			? {
					ability: saveAbility,
					dc: saveDc,
					onSuccess: successPolicy(saveSuccess),
					successText: saveSuccess ?? undefined,
					failureText: text(saveRecord?.failure) ?? undefined,
				}
			: undefined;

	const damageLocated = firstLocated(record, [
		"damage_roll",
		"damage",
		"attack.damage",
		"mechanics.attack.damage",
		"mechanics.damage_profile",
	]);
	if (damageLocated) sourcePaths.add(damageLocated.path);
	const damageFormula = formula(
		isRecord(damageLocated?.value)
			? (damageLocated?.value.dice ?? damageLocated?.value.formula)
			: damageLocated?.value,
	);
	const damageType = locateText([
		"damage_type",
		"attack.damage_type",
		"mechanics.attack.damage_type",
	]);
	const damage: CanonicalDamageSpec[] | undefined = damageFormula
		? [
				{
					formula: damageFormula,
					type: damageType ?? undefined,
					when: attack ? "hit" : save ? "failed-save" : "always",
				},
			]
		: undefined;

	const healingLocated = firstLocated(record, [
		"healing",
		"mechanics.healing.dice",
	]);
	if (healingLocated) sourcePaths.add(healingLocated.path);
	const healingFormula = formula(healingLocated?.value);
	const healing: CanonicalHealingSpec[] | undefined = healingFormula
		? [{ formula: healingFormula, type: "healing" }]
		: undefined;

	const scalingRaw = locateText([
		"higher_levels",
		"at_higher_levels",
		"atHigherLevels",
		"mechanics.scaling",
	]);
	const scaling = scalingRaw
		? [{ basis: "custom" as const, raw: scalingRaw }]
		: undefined;

	const resolutionKinds: CanonicalResolutionKind[] = [];
	if (attack) resolutionKinds.push("attack");
	if (save) resolutionKinds.push("save");
	if (damage) resolutionKinds.push("damage");
	if (healing) resolutionKinds.push("healing");
	if (resolutionKinds.length === 0 && (entry.effect || entry.description))
		resolutionKinds.push("effect");

	const base = {
		version: 1 as const,
		activation,
		target,
		duration,
		attack,
		save,
		damage,
		healing,
		scaling,
		uses,
		provenance: {
			canonicalType: options.canonicalType,
			canonicalId: entry.id,
			sourceBook: entry.source_book,
			sourceFieldPaths: Array.from(sourcePaths).sort(),
		},
	};

	if (options.reviewBlocker) {
		return {
			...base,
			attack: undefined,
			save: undefined,
			damage: undefined,
			healing: undefined,
			scaling: undefined,
			status: "review-blocked",
			resolutionKinds: [],
			manual: { reason: options.reviewBlocker.message },
			reviewBlockerId: options.reviewBlocker.id,
		};
	}

	const fullyStructured =
		resolutionKinds.length > 0 &&
		activation.economy !== "manual" &&
		target.kind !== "manual" &&
		duration.kind !== "manual" &&
		uses.tracking !== "manual" &&
		save?.onSuccess !== "manual";
	if (fullyStructured) {
		return {
			...base,
			status: "automated",
			resolutionKinds: resolutionKinds as [
				CanonicalResolutionKind,
				...CanonicalResolutionKind[],
			],
		};
	}

	const missing = [
		activation.economy === "manual" ? "activation" : null,
		target.kind === "manual" ? "target" : null,
		duration.kind === "manual" ? "duration" : null,
		uses.tracking === "manual" ? "use economy" : null,
		save?.onSuccess === "manual" ? "save-success policy" : null,
		resolutionKinds.length === 0 ? "resolution effect" : null,
	].filter((value): value is string => Boolean(value));
	return {
		...base,
		status: "manual",
		resolutionKinds,
		manual: {
			reason: `Canonical automation is incomplete: ${missing.join(", ")}.`,
			instructions:
				"Resolve only from the authored text; do not infer missing values.",
		},
	};
}
