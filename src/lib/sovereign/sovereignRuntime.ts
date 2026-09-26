import type { CustomResource } from "@/lib/characterResources";
import { getProficiencyBonus } from "@/lib/characterCalculations";
import type { CustomModifier } from "@/lib/customModifiers";
import type { ActionResolutionPayload } from "@/lib/actionResolution";
import {
	readSovereignDefinition,
	type SovereignV2Definition,
	type SovereignV2Expression,
} from "@/lib/sovereign/sovereignV2Contract";
import {
	type AbilityScore,
	getAbilityModifier,
} from "@/types/core-rules";

const SOVEREIGN_RESOURCE_PREFIX = "sovereign:";
const ABILITY_COLUMNS: Record<AbilityScore, keyof SovereignRuntimeCharacter> = {
	STR: "str",
	AGI: "agi",
	VIT: "vit",
	INT: "int",
	SENSE: "sense",
	PRE: "pre",
};

export interface SovereignRuntimeCharacter {
	level: number;
	abilities?: Partial<Record<AbilityScore, number>> | null;
	str?: number | null;
	agi?: number | null;
	vit?: number | null;
	int?: number | null;
	sense?: number | null;
	pre?: number | null;
	gemini_state?: unknown;
	saving_throw_proficiencies?: string[] | null;
	skill_proficiencies?: string[] | null;
	skill_expertise?: string[] | null;
}

export interface SovereignResourceCost {
	resourceId: string;
	sourceKey: string;
	name: string;
	amount: number;
}

export interface SovereignRuntimeAction {
	id: string;
	name: string;
	type: "power";
	description: string;
	activation: string;
	range: string;
	target: string;
	resourceCost?: string;
	resourceCurrent?: number;
	resourceMax?: number;
	recharge?: string;
	resourceCosts?: SovereignResourceCost[];
	payload: ActionResolutionPayload;
	sourceId: string;
}

export interface SovereignRuntimeModifiers {
	customModifiers: CustomModifier[];
	resistances: string[];
	otherProficiencies: Array<{
		type: "tool" | "weapon" | "armor" | "language";
		target: string;
		source: string;
	}>;
	conditionalAdvantages: Array<{
		rollType: "attack" | "check" | "save";
		condition: string;
		source: string;
	}>;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
	!!value && typeof value === "object" && !Array.isArray(value);

const normalizedName = (value: string) => value.trim().toLowerCase();

function getAbilityScore(
	character: SovereignRuntimeCharacter,
	ability: AbilityScore,
): number {
	const fromAbilities = character.abilities?.[ability];
	if (typeof fromAbilities === "number" && Number.isFinite(fromAbilities)) {
		return fromAbilities;
	}
	const fromColumn = character[ABILITY_COLUMNS[ability]];
	return typeof fromColumn === "number" && Number.isFinite(fromColumn)
		? fromColumn
		: 10;
}

/** Read the authoritative attached v2 definition from character runtime state. */
export function readAttachedSovereignV2(
	geminiState: unknown,
): SovereignV2Definition | null {
	if (!isRecord(geminiState) || geminiState.isActive === false) return null;
	const raw = geminiState.sovereignDefinition;
	const result = readSovereignDefinition(raw);
	return result.ok && result.kind === "v2" ? result.definition : null;
}

/** Deterministically evaluate the bounded Sovereign expression grammar. */
export function evaluateSovereignExpression(
	expression: SovereignV2Expression,
	character: SovereignRuntimeCharacter,
): number {
	switch (expression.kind) {
		case "constant":
			return expression.value;
		case "proficiency-bonus":
			return getProficiencyBonus(character.level);
		case "ability-modifier":
			return getAbilityModifier(getAbilityScore(character, expression.ability));
		case "dice":
			// Resource capacities must not reroll on render. Use the declared
			// maximum result so the tracker is deterministic and portable.
			return expression.count * expression.sides + (expression.bonus ?? 0);
		case "sum":
			return expression.terms.reduce(
				(total, term) =>
					total + evaluateSovereignExpression(term, character),
				0,
			);
	}
}

export function sovereignResourceSourceKey(
	definitionId: string,
	resourceId: string,
): string {
	return `${SOVEREIGN_RESOURCE_PREFIX}${definitionId}:${resourceId}`;
}

function isSovereignResourceRow(row: CustomResource): boolean {
	return row.sourceKey?.startsWith(SOVEREIGN_RESOURCE_PREFIX) ?? false;
}

function resourceUnlockLevel(
	definition: SovereignV2Definition,
	resourceId: string,
): number {
	const levels = definition.abilities
		.filter((ability) =>
			ability.resource_costs.some((cost) => cost.resource_id === resourceId),
		)
		.map((ability) => ability.level);
	return levels.length > 0 ? Math.min(...levels) : 1;
}

/**
 * Reconcile typed v2 Sovereign pools into the character sheet's existing
 * custom-resource store. Stable source keys make retries/level-ups idempotent,
 * and detaching/replacing a Sovereign removes stale pools without touching
 * manual or Job resources.
 */
export function reconcileSovereignResourceRows(
	existing: CustomResource[],
	definition: SovereignV2Definition | null,
	character: SovereignRuntimeCharacter,
): { rows: CustomResource[]; changed: boolean } {
	const nonSovereign = existing.filter((row) => !isSovereignResourceRow(row));
	if (!definition) {
		return {
			rows: nonSovereign,
			changed: nonSovereign.length !== existing.length,
		};
	}

	const existingByKey = new Map(
		existing
			.filter(isSovereignResourceRow)
			.filter((row) => row.sourceKey)
			.map((row) => [row.sourceKey as string, row]),
	);
	const sovereignRows = definition.resources
		.filter(
			(resource) => character.level >= resourceUnlockLevel(definition, resource.id),
		)
		.map((resource): CustomResource => {
			const sourceKey = sovereignResourceSourceKey(definition.id, resource.id);
			const previous = existingByKey.get(sourceKey);
			const max = Math.max(
				0,
				Math.floor(evaluateSovereignExpression(resource.maximum, character)),
			);
			const current = previous
				? previous.current >= previous.max
					? max
					: Math.min(previous.current, max)
				: max;
			return {
				id: previous?.id ?? sourceKey,
				name: resource.name,
				current,
				max,
				recharge: resource.recharge,
				origin: "manual",
				sourceKey,
				notes: `Sovereign: ${definition.identity.name} — ${resource.description}`,
			};
		});

	const rows = [...nonSovereign, ...sovereignRows];
	const comparable = (items: CustomResource[]) =>
		items.map((row) => ({
			id: row.id,
			name: row.name,
			current: row.current,
			max: row.max,
			recharge: row.recharge ?? "none",
			origin: row.origin ?? null,
			sourceKey: row.sourceKey ?? null,
			notes: row.notes ?? null,
		}));
	return {
		rows,
		changed: JSON.stringify(comparable(rows)) !== JSON.stringify(comparable(existing)),
	};
}

function activeEntityIds(
	definition: SovereignV2Definition,
	level: number,
): Set<string> {
	return new Set([
		...definition.traits.map((entry) => entry.id),
		...definition.features.map((entry) => entry.id),
		...definition.abilities
			.filter((entry) => entry.level <= level)
			.map((entry) => entry.id),
	]);
}

function baseHas(values: string[] | null | undefined, target: string): boolean {
	const key = normalizedName(target);
	return (values ?? []).some((value) => normalizedName(value) === key);
}

/** Convert supported v2 persistent modifiers into existing sheet consumers. */
export function buildSovereignRuntimeModifiers(
	definition: SovereignV2Definition | null,
	character: SovereignRuntimeCharacter,
): SovereignRuntimeModifiers {
	const empty: SovereignRuntimeModifiers = {
		customModifiers: [],
		resistances: [],
		otherProficiencies: [],
		conditionalAdvantages: [],
	};
	if (!definition) return empty;

	const activeIds = activeEntityIds(definition, character.level);
	const profBonus = getProficiencyBonus(character.level);
	const saveGrants = new Set<string>();
	const skillGrants = new Set<string>();
	const expertiseGrants = new Set<string>();
	const resistances = new Set<string>();
	const advantages = new Set<string>();
	const customModifiers: CustomModifier[] = [];
	const otherProficiencies: SovereignRuntimeModifiers["otherProficiencies"] = [];
	const conditionalAdvantages: SovereignRuntimeModifiers["conditionalAdvantages"] = [];

	for (const modifier of definition.modifiers) {
		if (!activeIds.has(modifier.source_id)) continue;
		const source = `${definition.identity.name}: ${modifier.source_id}`;
		switch (modifier.kind) {
			case "resistance":
				resistances.add(modifier.damage_type);
				break;
			case "advantage":
				if (modifier.condition) {
					conditionalAdvantages.push({
						rollType: modifier.roll_type,
						condition: modifier.condition,
						source,
					});
					break;
				}
				if (!advantages.has(modifier.roll_type)) {
					advantages.add(modifier.roll_type);
					customModifiers.push({
						id: `sovereign:${definition.id}:${modifier.id}`,
						type: "advantage",
						target: modifier.roll_type,
						value: 1,
						source,
						condition: null,
						enabled: true,
					});
				}
				break;
			case "save-proficiency":
				saveGrants.add(modifier.ability);
				break;
			case "expertise":
				expertiseGrants.add(modifier.skill);
				break;
			case "proficiency":
				if (modifier.proficiency_type === "save") {
					saveGrants.add(modifier.target.toUpperCase());
				} else if (modifier.proficiency_type === "skill") {
					skillGrants.add(modifier.target);
				} else {
					otherProficiencies.push({
						type: modifier.proficiency_type,
						target: modifier.target,
						source,
					});
				}
				break;
		}
	}

	for (const save of saveGrants) {
		if (baseHas(character.saving_throw_proficiencies, save)) continue;
		customModifiers.push({
			id: `sovereign:${definition.id}:save:${save}`,
			type: "save",
			target: save,
			value: profBonus,
			source: definition.identity.name,
			condition: null,
			enabled: true,
		});
	}

	for (const skill of new Set([...skillGrants, ...expertiseGrants])) {
		const hasExpertise = baseHas(character.skill_expertise, skill);
		const hasProficiency = hasExpertise || baseHas(character.skill_proficiencies, skill);
		const wantsExpertise = expertiseGrants.has(skill);
		const currentMultiplier = hasExpertise ? 2 : hasProficiency ? 1 : 0;
		const desiredMultiplier = wantsExpertise ? 2 : 1;
		const delta = Math.max(0, desiredMultiplier - currentMultiplier) * profBonus;
		if (delta === 0) continue;
		customModifiers.push({
			id: `sovereign:${definition.id}:skill:${normalizedName(skill)}`,
			type: "skill",
			target: skill,
			value: delta,
			source: definition.identity.name,
			condition: null,
			enabled: true,
		});
	}

	return {
		customModifiers,
		resistances: Array.from(resistances),
		otherProficiencies,
		conditionalAdvantages,
	};
}

function actionActivation(actionType: SovereignV2Definition["abilities"][number]["action_type"]): string {
	switch (actionType) {
		case "bonus-action":
			return "1 bonus action";
		case "reaction":
			return "1 reaction";
		case "action":
			return "1 action";
		default:
			return "Passive";
	}
}

/** Build stable v2 combat actions directly from the authoritative definition. */
export function buildSovereignRuntimeActions(
	definition: SovereignV2Definition | null,
	character: SovereignRuntimeCharacter,
	resources: CustomResource[],
): SovereignRuntimeAction[] {
	if (!definition) return [];
	const resourcesById = new Map(
		definition.resources.map((resource) => [resource.id, resource]),
	);
	const rowsBySourceKey = new Map(
		resources
			.filter((row) => row.sourceKey)
			.map((row) => [row.sourceKey as string, row]),
	);

	return definition.abilities
		.filter(
			(ability) =>
				ability.level <= character.level && ability.action_type !== "passive",
		)
		.map((ability) => {
			const costs: SovereignResourceCost[] = ability.resource_costs.flatMap(
				(cost) => {
					const resource = resourcesById.get(cost.resource_id);
					if (!resource) return [];
					return [
						{
							resourceId: resource.id,
							sourceKey: sovereignResourceSourceKey(definition.id, resource.id),
							name: resource.name,
							amount: cost.amount,
						},
					];
			},
			);
			const costLabel = costs.map((cost) => `${cost.amount} ${cost.name}`).join(" + ");
			const currentUses =
				costs.length > 0
					? Math.min(
							...costs.map((cost) =>
								Math.floor(
									(rowsBySourceKey.get(cost.sourceKey)?.current ?? 0) / cost.amount,
								),
							),
						)
					: undefined;
			const maxUses =
				costs.length > 0
					? Math.min(
							...costs.map((cost) =>
								Math.floor((rowsBySourceKey.get(cost.sourceKey)?.max ?? 0) / cost.amount),
							),
						)
					: undefined;
			const description = costLabel
				? `Resource cost: ${costLabel}. ${ability.description}`
				: ability.description;
			return {
				id: `sovereign-v2-${definition.id}-${ability.id}`,
				name: ability.name,
				type: "power" as const,
				description,
				activation: actionActivation(ability.action_type),
				range: "Self",
				target: "",
				resourceCost: costLabel || undefined,
				resourceCurrent: currentUses,
				resourceMax: maxUses,
				recharge: ability.recharge ?? undefined,
				resourceCosts: costs.length > 0 ? costs : undefined,
				payload: {
					version: 1,
					id: `sovereign-v2-${definition.id}-${ability.id}`,
					name: ability.name,
					source: { type: "power", entryId: ability.id },
					kind: "effect",
					description,
				},
				sourceId: ability.id,
			};
		});
}
