import type {
	StaticCompendiumEntry,
	StaticDataProvider,
} from "@/data/compendium/providers/types";
import type { Json } from "@/integrations/supabase/types";
import { getMaxAbilityLevelForJobAtLevel } from "@/lib/abilityProgression";
import {
	entryHasAccessToken,
	getDerivedPowerTags,
	getDerivedSpellTags,
	getDerivedTechniqueTags,
	getPowerAccessTokens,
	getSpellAccessTokens,
	getTechniqueAccessTokens,
	jobCanLearnPowers,
	jobCanLearnSpells,
	jobCanLearnTechniques,
	normalizeJobAccessToken,
} from "@/lib/jobAbilityAccess";
import {
	getActivePathAbilityGrants,
	getEffectiveMaxAbilityLevel,
	getPathGrantMaxAbilityLevel,
	normalizePathAbilityValue,
	type PathAbilityGrant,
} from "@/lib/pathAbilityAccess";
import {
	filterRowsBySourcebookAccess,
	isSourcebookAccessible,
} from "@/lib/sourcebookAccess";

export const staticCanonicalEntryTypes = [
	"jobs",
	"paths",
	"powers",
	"runes",
	"relics",
	"anomalies",
	"backgrounds",
	"conditions",
	"regents",
	"feats",
	"skills",
	"equipment",
	"shadow-soldiers",
	"items",
	"spells",
	"techniques",
	"artifacts",
	"locations",
	"sigils",
	"tattoos",
	"rollable-tables",
	"deities",
	"pantheon",
] as const;

export type StaticCanonicalEntryType =
	(typeof staticCanonicalEntryTypes)[number];

const equipmentItemTypes = new Set([
	"weapon",
	"armor",
	"shield",
	"gear",
	"tools",
]);

const providerMethodByType: Record<
	StaticCanonicalEntryType,
	keyof StaticDataProvider
> = {
	jobs: "getJobs",
	paths: "getPaths",
	powers: "getPowers",
	runes: "getRunes",
	relics: "getRelics",
	anomalies: "getAnomalies",
	backgrounds: "getBackgrounds",
	conditions: "getConditions",
	regents: "getRegents",
	feats: "getFeats",
	skills: "getSkills",
	equipment: "getItems",
	"shadow-soldiers": "getShadowSoldiers",
	items: "getItems",
	spells: "getSpells",
	techniques: "getTechniques",
	artifacts: "getArtifacts",
	locations: "getLocations",
	sigils: "getSigils",
	tattoos: "getTattoos",
	"rollable-tables": "getRollableTables",
	deities: "getPantheon",
	pantheon: "getPantheon",
};

let staticProviderPromise: Promise<StaticDataProvider> | null = null;

async function loadStaticProvider(): Promise<StaticDataProvider> {
	if (!staticProviderPromise) {
		staticProviderPromise = import("@/data/compendium/providers").then(
			(module) => module.staticDataProvider as StaticDataProvider,
		);
	}

	return staticProviderPromise;
}

export function isStaticCanonicalEntryType(
	value: string,
): value is StaticCanonicalEntryType {
	return staticCanonicalEntryTypes.includes(value as StaticCanonicalEntryType);
}

export function isEquipmentLikeEntry(entry: StaticCompendiumEntry): boolean {
	const itemType = (entry.item_type || entry.equipment_type || "")
		.toLowerCase()
		.trim();
	return equipmentItemTypes.has(itemType);
}

export function classifyCanonicalItemType(
	entry: StaticCompendiumEntry,
): "equipment" | "items" {
	return isEquipmentLikeEntry(entry) ? "equipment" : "items";
}

export async function listCanonicalEntries(
	type: StaticCanonicalEntryType,
	search?: string,
	accessContext?: { campaignId?: string | null },
): Promise<StaticCompendiumEntry[]> {
	const provider = await loadStaticProvider();
	const methodName = providerMethodByType[type];
	let entries = await provider[methodName](search);

	if (type === "equipment") {
		entries = entries.filter(isEquipmentLikeEntry);
	} else if (type === "items") {
		entries = entries.filter((entry) => !isEquipmentLikeEntry(entry));
	}

	return filterRowsBySourcebookAccess(
		entries,
		(entry) => entry.source_book,
		accessContext,
	);
}

export async function findCanonicalEntryByName(
	type: StaticCanonicalEntryType,
	name: string,
): Promise<StaticCompendiumEntry | null> {
	if (!name) return null;
	const provider = await loadStaticProvider();
	const methodName = providerMethodByType[type];
	const entries = await provider[methodName]();
	const lookup = name.trim().toLowerCase();
	const match = entries.find((entry) => entry.name.toLowerCase() === lookup);
	if (match && type === "equipment" && !isEquipmentLikeEntry(match))
		return null;
	if (match && type === "items" && isEquipmentLikeEntry(match)) return null;
	return match ?? null;
}

export async function findCanonicalEntryById(
	type: StaticCanonicalEntryType,
	id: string | null | undefined,
	accessContext?: { campaignId?: string | null },
): Promise<StaticCompendiumEntry | null> {
	if (!id) return null;
	const entries = await listCanonicalEntries(type, undefined, accessContext);
	return entries.find((entry) => entry.id === id) ?? null;
}

export interface CanonicalCharacterRefInput {
	job?: string | null;
	path?: string | null;
	background?: string | null;
	job_id?: string | null;
	path_id?: string | null;
	background_id?: string | null;
}

export async function resolveCharacterCanonicalIds<
	T extends CanonicalCharacterRefInput,
>(data: T): Promise<T> {
	const hasJob = Object.hasOwn(data, "job");
	const hasPath = Object.hasOwn(data, "path");
	const hasBackground = Object.hasOwn(data, "background");
	const [jobEntry, pathEntry, backgroundEntry] = await Promise.all([
		data.job && !data.job_id
			? findCanonicalEntryByName("jobs", data.job)
			: Promise.resolve(null),
		data.path && !data.path_id
			? findCanonicalEntryByName("paths", data.path)
			: Promise.resolve(null),
		data.background && !data.background_id
			? findCanonicalEntryByName("backgrounds", data.background)
			: Promise.resolve(null),
	]);

	return {
		...data,
		...(hasJob ? { job_id: data.job_id ?? jobEntry?.id ?? null } : {}),
		...(hasPath ? { path_id: data.path_id ?? pathEntry?.id ?? null } : {}),
		...(hasBackground
			? { background_id: data.background_id ?? backgroundEntry?.id ?? null }
			: {}),
	} as T;
}

export async function listCanonicalEntriesBatch(
	types: readonly StaticCanonicalEntryType[],
	search?: string,
	accessContext?: { campaignId?: string | null },
): Promise<Map<StaticCanonicalEntryType, StaticCompendiumEntry[]>> {
	const results = await Promise.all(
		types.map(
			async (type) =>
				[
					type,
					await listCanonicalEntries(type, search, accessContext),
				] as const,
		),
	);

	return new Map(results);
}

export type CanonicalCastableType = Extract<
	StaticCanonicalEntryType,
	"powers" | "spells"
>;

export interface CanonicalCastableEntry extends StaticCompendiumEntry {
	canonical_type: CanonicalCastableType;
	power_level: number;
	power_type: string | null;
	activation_time: string | null;
	casting_time: string | null;
	range: string | null;
	duration: string | null;
	concentration: boolean;
	ritual: boolean;
	higher_levels: string | null;
	has_attack_roll: boolean;
	has_save: boolean;
	save_ability: string | null;
	damage_roll: string | null;
	damage_type: string | null;
	target: string | null;
	mechanics: Record<string, Json> | null;
	tags: string[];
}

export type LearnableCastableOptions = {
	search?: string;
	accessContext?: { campaignId?: string | null };
	maxPowerLevel?: number | null;
	maxSpellLevel?: number | null;
	characterLevel?: number | null;
	castableKind?: "spell" | "power";
	jobName?: string | null;
	pathName?: string | null;
	regentNames?: string[] | null;
};

const canonicalCastableTypes = ["powers", "spells"] as const;
const canonicalPowerTypes = ["powers"] as const;
const canonicalSpellTypes = ["spells"] as const;

function isJsonRecord(value: unknown): value is Record<string, Json> {
	return !!value && typeof value === "object" && !Array.isArray(value);
}

function getNonEmptyString(value: unknown): string | null {
	return typeof value === "string" && value.trim().length > 0 ? value : null;
}

export type AbilityCatalogKind = "power" | "spell" | "technique";
export type AbilityCompletenessSeverity = "error" | "warning";

export interface AbilityCompletenessIssue {
	kind: AbilityCatalogKind;
	id: string;
	name: string;
	field: string;
	reason: string;
	severity: AbilityCompletenessSeverity;
}

// Strings used as non-damage placeholders in the castable data (e.g. utility
// powers whose damage has been intentionally cleared). Treated as "no damage"
// by the canonical resolver so downstream consumers see a null damage_roll
// and skip damage payload construction.
const PLACEHOLDER_DAMAGE_TOKENS = new Set([
	"—",
	"-",
	"n/a",
	"na",
	"none",
	"utility",
	"self-heal",
	"self",
]);

function isPlaceholderDamage(value: unknown): boolean {
	if (typeof value !== "string") return false;
	const trimmed = value.trim().toLowerCase();
	if (!trimmed) return true;
	if (PLACEHOLDER_DAMAGE_TOKENS.has(trimmed)) return true;
	// Reject strings that don't contain a dice formula or a plain number.
	return !/\d+d\d+/i.test(trimmed) && !/^\d+(?:\s*[+-]\s*\d+)?$/.test(trimmed);
}

function getNonPlaceholderDamage(value: unknown): string | null {
	if (isPlaceholderDamage(value)) return null;
	return getNonEmptyString(value);
}

function getStringLikeValue(value: unknown): string | null {
	if (typeof value === "string" && value.trim().length > 0) return value;
	if (typeof value === "number") return String(value);
	return null;
}

function humanizeToken(value: string): string {
	return value.replace(/_/g, " ").trim();
}

export function formatActivationText(value: unknown): string | null {
	if (typeof value === "string" && value.trim().length > 0) return value;
	if (!isJsonRecord(value)) return null;

	const type = getNonEmptyString(value.type);
	const cost = getStringLikeValue(value.cost);
	if (!type) return cost;

	const normalizedType = humanizeToken(type);
	if (cost) return `${cost} ${normalizedType}`;
	if (normalizedType === "bonus action") return "1 bonus action";
	if (normalizedType === "reaction") return "1 reaction";
	if (normalizedType === "action") return "1 action";
	return normalizedType;
}

export function formatRangeText(value: unknown): string | null {
	if (typeof value === "string" && value.trim().length > 0) return value;
	if (typeof value === "number") return `${value} feet`;
	if (!isJsonRecord(value)) return null;

	const type = getNonEmptyString(value.type);
	const distance = getStringLikeValue(value.distance ?? value.value);
	const unit = getNonEmptyString(value.unit);

	if (type && /^(self|touch|sight|unlimited)$/i.test(type)) return type;
	if (distance && unit) return `${distance} ${unit}`;
	if (distance && type && distance !== type) {
		return `${distance} ${humanizeToken(type)}`.trim();
	}

	return type ?? distance ?? null;
}

export function formatDurationText(value: unknown): string | null {
	if (typeof value === "string" && value.trim().length > 0) return value;
	if (!isJsonRecord(value)) return getStringLikeValue(value);

	const type = getNonEmptyString(value.type);
	const time = getStringLikeValue(value.time ?? value.value);
	const unit = getNonEmptyString(value.unit);

	if (type && /concentrat/i.test(type) && time) {
		return `Concentration, up to ${time}`;
	}
	if (time && unit) return `${time} ${unit}`;
	if (time && type && time !== type)
		return `${time} ${humanizeToken(type)}`.trim();
	return type ?? time ?? null;
}

function getAttackRecord(
	entry: StaticCompendiumEntry,
	mechanics: Record<string, Json> | null,
): Record<string, Json> | null {
	const topLevelAttack = (entry as { attack?: unknown }).attack;
	if (isJsonRecord(topLevelAttack)) return topLevelAttack;

	const spellAttack = (entry as { spell_attack?: unknown }).spell_attack;
	if (isJsonRecord(spellAttack)) return spellAttack;

	const mechanicsAttack = mechanics?.attack;
	return isJsonRecord(mechanicsAttack) ? mechanicsAttack : null;
}

function getSavingThrowRecord(
	entry: StaticCompendiumEntry,
	mechanics: Record<string, Json> | null,
): Record<string, Json> | null {
	const topLevelSave = (entry as { saving_throw?: unknown }).saving_throw;
	if (isJsonRecord(topLevelSave)) return topLevelSave;

	const mechanicsSave = mechanics?.saving_throw;
	return isJsonRecord(mechanicsSave) ? mechanicsSave : null;
}

function extractDamageRoll(
	entry: StaticCompendiumEntry,
	attack: Record<string, Json> | null,
	mechanics: Record<string, Json> | null,
): string | null {
	const directDamageRoll = getNonPlaceholderDamage(
		(entry as { damage_roll?: unknown }).damage_roll,
	);
	if (directDamageRoll) return directDamageRoll;

	const attackDamage = attack?.damage;
	if (typeof attackDamage === "string") {
		const sanitized = getNonPlaceholderDamage(attackDamage);
		if (sanitized) return sanitized;
	} else if (isJsonRecord(attackDamage)) {
		const roll = getNonPlaceholderDamage(
			attackDamage.dice ?? attackDamage.roll,
		);
		if (roll) return roll;
	}

	const damageProfile = getNonPlaceholderDamage(mechanics?.damage_profile);
	if (damageProfile) return damageProfile;

	return getNonPlaceholderDamage(mechanics?.damage);
}

// Damage-type placeholder tokens that should resolve to null (no damage type).
const PLACEHOLDER_DAMAGE_TYPE_TOKENS = new Set(["none", "", "n/a", "self"]);

function getNonPlaceholderDamageType(value: unknown): string | null {
	const str = getNonEmptyString(value);
	if (!str) return null;
	if (PLACEHOLDER_DAMAGE_TYPE_TOKENS.has(str.trim().toLowerCase())) return null;
	return str;
}

function extractDamageType(
	entry: StaticCompendiumEntry,
	attack: Record<string, Json> | null,
	mechanics?: Record<string, Json> | null,
): string | null {
	const directDamageType = getNonPlaceholderDamageType(
		(entry as { damage_type?: unknown }).damage_type,
	);
	if (directDamageType) return directDamageType;

	const attackDamageType = getNonPlaceholderDamageType(attack?.damage_type);
	if (attackDamageType) return attackDamageType;

	const attackDamage = attack?.damage;
	if (isJsonRecord(attackDamage)) {
		return getNonPlaceholderDamageType(attackDamage.type);
	}

	const mechanicsAttack = isJsonRecord(mechanics?.attack)
		? (mechanics?.attack as Record<string, Json>)
		: null;
	const mechanicsAttackDamageType = getNonPlaceholderDamageType(
		mechanicsAttack?.damage_type,
	);
	if (mechanicsAttackDamageType) return mechanicsAttackDamageType;

	const mechanicsDamageProfile = getNonPlaceholderDamage(
		mechanics?.damage_profile,
	);
	if (mechanicsDamageProfile) {
		const match = mechanicsDamageProfile.match(/\b([a-z]+)\s*$/i);
		if (match) return getNonPlaceholderDamageType(match[1]);
	}

	return null;
}

function getEntryId(entry: StaticCompendiumEntry): string {
	return getNonEmptyString(entry.id) ?? "(missing id)";
}

function getEntryName(entry: StaticCompendiumEntry): string {
	return getNonEmptyString(entry.name) ?? "(missing name)";
}

function pushCompletenessIssue(
	issues: AbilityCompletenessIssue[],
	kind: AbilityCatalogKind,
	entry: StaticCompendiumEntry,
	field: string,
	reason: string,
	severity: AbilityCompletenessSeverity = "error",
): void {
	issues.push({
		kind,
		id: getEntryId(entry),
		name: getEntryName(entry),
		field,
		reason,
		severity,
	});
}

function hasFormulaText(value: unknown): boolean {
	const text = getStringLikeValue(value)?.trim() ?? "";
	if (!text) return false;
	if (PLACEHOLDER_DAMAGE_TOKENS.has(text.toLowerCase())) return false;
	return (
		/\d+d\d+/i.test(text) ||
		/^\d+(?:\s*[+-]\s*\d+)?$/.test(text) ||
		/\b(level|rank|slot|modifier|proficiency|ability)\b/i.test(text)
	);
}

function hasNonEmptyArray(value: unknown): boolean {
	return (
		Array.isArray(value) && value.some((entry) => getNonEmptyString(entry))
	);
}

function isNonDamageProfile(value: unknown): boolean {
	const text = getStringLikeValue(value)?.trim().toLowerCase() ?? "";
	return [
		"utility",
		"self-heal",
		"healing",
		"support",
		"buff",
		"debuff",
	].includes(text);
}

function describesNonDamageResolution(value: unknown): boolean {
	return /\b(non-damage|utility|restore|restores|heals|healing|temporary hp|condition|charmed|frightened|invisible|paralyzed|telepath|reaction|opportunity)\b/i.test(
		getStringLikeValue(value) ?? "",
	);
}

function hasSavingThrowDetails(
	savingThrow: Record<string, Json> | null,
	saveAbility: string | null,
): boolean {
	return Boolean(
		saveAbility ||
			getNonEmptyString(savingThrow?.ability) ||
			getNonEmptyString(savingThrow?.success) ||
			getNonEmptyString(savingThrow?.failure) ||
			(typeof savingThrow?.dc === "number" && savingThrow.dc > 0) ||
			getNonEmptyString(savingThrow?.dc),
	);
}

function validateCommonAbilityFields(
	entry: StaticCompendiumEntry,
	kind: AbilityCatalogKind,
	issues: AbilityCompletenessIssue[],
): void {
	for (const field of ["id", "name", "description", "source_book"] as const) {
		if (!getNonEmptyString(entry[field])) {
			pushCompletenessIssue(
				issues,
				kind,
				entry,
				field,
				"Missing required text.",
			);
		}
	}
	if (!hasNonEmptyArray(entry.tags) && !hasNonEmptyArray(entry.classes)) {
		pushCompletenessIssue(
			issues,
			kind,
			entry,
			"tags/classes",
			"Missing ability access tags or class eligibility.",
		);
	}
}

function validateCastableCompleteness(
	entry: CanonicalCastableEntry,
	kind: Extract<AbilityCatalogKind, "power" | "spell">,
): AbilityCompletenessIssue[] {
	const issues: AbilityCompletenessIssue[] = [];
	validateCommonAbilityFields(entry, kind, issues);
	for (const field of ["casting_time", "range", "duration"] as const) {
		if (!getNonEmptyString(entry[field])) {
			pushCompletenessIssue(
				issues,
				kind,
				entry,
				field,
				"Missing table-use timing or targeting data.",
			);
		}
	}
	if (!isJsonRecord(entry.mechanics)) {
		pushCompletenessIssue(
			issues,
			kind,
			entry,
			"mechanics",
			"Missing structured mechanics.",
		);
	}
	const mechanics = isJsonRecord(entry.mechanics) ? entry.mechanics : {};
	const attack = getAttackRecord(entry, mechanics);
	const savingThrow = getSavingThrowRecord(entry, mechanics);
	const healing = isJsonRecord(mechanics.healing) ? mechanics.healing : null;
	const damageProfile = getNonPlaceholderDamage(mechanics.damage_profile);
	const damageRoll =
		extractDamageRoll(entry, attack, mechanics) ??
		(hasFormulaText(damageProfile) ? damageProfile : null);
	const damageType = extractDamageType(entry, attack, mechanics);
	const nonDamageResolution =
		isNonDamageProfile(damageProfile) ||
		Boolean(healing) ||
		describesNonDamageResolution(entry.effects?.primary) ||
		describesNonDamageResolution(entry.description);
	const hasSaveDetails = hasSavingThrowDetails(savingThrow, entry.save_ability);
	if (attack) {
		if (!getNonEmptyString(attack.mode) && !getNonEmptyString(attack.type)) {
			pushCompletenessIssue(
				issues,
				kind,
				entry,
				"mechanics.attack.mode",
				"Missing attack mode or type.",
			);
		}
		if (
			!getNonEmptyString(attack.modifier) &&
			!getNonEmptyString(attack.ability)
		) {
			pushCompletenessIssue(
				issues,
				kind,
				entry,
				"mechanics.attack.modifier",
				"Missing attack ability or modifier.",
			);
		}
		if (!hasFormulaText(attack.damage) && !hasFormulaText(damageRoll)) {
			pushCompletenessIssue(
				issues,
				kind,
				entry,
				"mechanics.attack.damage",
				nonDamageResolution
					? "Attack block carries placeholder damage for a utility/healing resolution and should be enriched."
					: "Missing attack damage formula.",
				nonDamageResolution ? "warning" : "error",
			);
		}
		if (!getNonPlaceholderDamageType(attack.damage_type) && !damageType) {
			pushCompletenessIssue(
				issues,
				kind,
				entry,
				"mechanics.attack.damage_type",
				nonDamageResolution
					? "Attack block carries no damage type for a utility/healing resolution and should be enriched."
					: "Missing attack damage type.",
				nonDamageResolution ? "warning" : "error",
			);
		}
	}
	if ((entry.has_save || savingThrow) && hasSaveDetails) {
		if (!entry.save_ability && !getNonEmptyString(savingThrow?.ability)) {
			pushCompletenessIssue(
				issues,
				kind,
				entry,
				"saving_throw.ability",
				"Missing saving throw ability.",
			);
		}
		const dc = savingThrow?.dc ?? mechanics.dc ?? mechanics.save_dc;
		if (dc === undefined || dc === null || dc === "") {
			pushCompletenessIssue(
				issues,
				kind,
				entry,
				"saving_throw.dc",
				"Missing saving throw DC or dynamic formula sentinel.",
			);
		}
		if (!getNonEmptyString(savingThrow?.success)) {
			pushCompletenessIssue(
				issues,
				kind,
				entry,
				"saving_throw.success",
				"Missing save success text.",
			);
		}
		if (!getNonEmptyString(savingThrow?.failure)) {
			pushCompletenessIssue(
				issues,
				kind,
				entry,
				"saving_throw.failure",
				"Missing save failure text.",
			);
		}
	} else if ((entry.has_save || savingThrow) && attack) {
		pushCompletenessIssue(
			issues,
			kind,
			entry,
			"saving_throw",
			"Contains an empty legacy save placeholder beside an actionable attack block.",
			"warning",
		);
	}
	if (damageRoll && !damageType) {
		pushCompletenessIssue(
			issues,
			kind,
			entry,
			"damage_type",
			"Missing damage type for damaging ability.",
		);
	}
	if (healing && !hasFormulaText(healing.dice ?? healing.amount)) {
		pushCompletenessIssue(
			issues,
			kind,
			entry,
			"mechanics.healing",
			"Missing healing formula.",
		);
	}
	if (
		!damageRoll &&
		!attack &&
		!hasSaveDetails &&
		!healing &&
		!getNonEmptyString(entry.effects?.primary)
	) {
		pushCompletenessIssue(
			issues,
			kind,
			entry,
			"resolution",
			"Missing attack, save, healing, or explicit effect resolution.",
		);
	}
	if (
		kind === "spell" &&
		entry.power_level === 0 &&
		!getNonEmptyString(entry.higher_levels)
	) {
		pushCompletenessIssue(
			issues,
			kind,
			entry,
			"higher_levels",
			"Missing cantrip scaling rules.",
		);
	}
	return issues;
}

function validateTechniqueCompleteness(
	entry: StaticCompendiumEntry,
): AbilityCompletenessIssue[] {
	const kind: AbilityCatalogKind = "technique";
	const issues: AbilityCompletenessIssue[] = [];
	validateCommonAbilityFields(entry, kind, issues);
	const activation = formatActivationText(
		(entry as { activation?: unknown }).activation,
	);
	const range = formatRangeText((entry as { range?: unknown }).range);
	const duration = formatDurationText(
		(entry as { duration?: unknown }).duration,
	);
	if (!activation) {
		pushCompletenessIssue(
			issues,
			kind,
			entry,
			"activation",
			"Missing action economy.",
		);
	}
	if (!range) {
		pushCompletenessIssue(
			issues,
			kind,
			entry,
			"range",
			"Missing range or target.",
		);
	}
	if (!duration) {
		pushCompletenessIssue(issues, kind, entry, "duration", "Missing duration.");
	}
	const mechanics = isJsonRecord(entry.mechanics)
		? (entry.mechanics as Record<string, Json>)
		: null;
	if (!mechanics) {
		pushCompletenessIssue(
			issues,
			kind,
			entry,
			"mechanics",
			"Missing structured mechanics.",
		);
	}
	const limitations = isJsonRecord(entry.limitations)
		? (entry.limitations as Record<string, Json>)
		: null;
	if (kind !== "spell") {
		if (!getNonEmptyString(limitations?.uses)) {
			pushCompletenessIssue(
				issues,
				kind,
				entry,
				"limitations.uses",
				"Missing usage limit.",
			);
		}
		if (!getNonEmptyString(limitations?.recharge)) {
			pushCompletenessIssue(
				issues,
				kind,
				entry,
				"limitations.recharge",
				"Missing recharge rule.",
			);
		}
	}
	const attack = isJsonRecord(mechanics?.attack)
		? (mechanics?.attack as Record<string, Json>)
		: null;
	const savingThrow = isJsonRecord(mechanics?.saving_throw)
		? (mechanics?.saving_throw as Record<string, Json>)
		: null;
	const damageProfile = getNonPlaceholderDamage(mechanics?.damage_profile);
	const nonDamageResolution =
		isNonDamageProfile(mechanics?.damage_profile) ||
		describesNonDamageResolution(entry.effects?.primary) ||
		describesNonDamageResolution(entry.description);
	if (attack) {
		if (!getNonEmptyString(attack.mode) && !getNonEmptyString(attack.type)) {
			pushCompletenessIssue(
				issues,
				kind,
				entry,
				"mechanics.attack.mode",
				"Missing attack mode or type.",
			);
		}
		if (!getNonEmptyString(attack.modifier)) {
			pushCompletenessIssue(
				issues,
				kind,
				entry,
				"mechanics.attack.modifier",
				"Missing attack modifier.",
			);
		}
		if (!hasFormulaText(attack.damage) && !hasFormulaText(damageProfile)) {
			pushCompletenessIssue(
				issues,
				kind,
				entry,
				"mechanics.attack.damage",
				nonDamageResolution
					? "Attack block carries placeholder damage for a utility/control resolution and should be enriched."
					: "Missing attack damage formula.",
				nonDamageResolution ? "warning" : "error",
			);
		}
		if (!getNonPlaceholderDamageType(attack.damage_type)) {
			pushCompletenessIssue(
				issues,
				kind,
				entry,
				"mechanics.attack.damage_type",
				nonDamageResolution
					? "Attack block carries no damage type for a utility/control resolution and should be enriched."
					: "Missing attack damage type.",
				nonDamageResolution ? "warning" : "error",
			);
		}
	}
	if (savingThrow) {
		if (!getNonEmptyString(savingThrow.ability)) {
			pushCompletenessIssue(
				issues,
				kind,
				entry,
				"mechanics.saving_throw.ability",
				"Missing saving throw ability.",
			);
		}
		if (
			savingThrow.dc === undefined ||
			savingThrow.dc === null ||
			savingThrow.dc === ""
		) {
			pushCompletenessIssue(
				issues,
				kind,
				entry,
				"mechanics.saving_throw.dc",
				"Missing saving throw DC.",
			);
		}
		if (!getNonEmptyString(savingThrow.success)) {
			pushCompletenessIssue(
				issues,
				kind,
				entry,
				"mechanics.saving_throw.success",
				"Missing save success text.",
			);
		}
		if (!getNonEmptyString(savingThrow.failure)) {
			pushCompletenessIssue(
				issues,
				kind,
				entry,
				"mechanics.saving_throw.failure",
				"Missing save failure text.",
			);
		}
	}
	if (
		!attack &&
		!savingThrow &&
		!damageProfile &&
		!getNonEmptyString(entry.effects?.primary)
	) {
		pushCompletenessIssue(
			issues,
			kind,
			entry,
			"resolution",
			"Missing attack, save, damage, or explicit effect resolution.",
		);
	}
	if (
		getNonEmptyString(mechanics?.frequency) ||
		getNonEmptyString(mechanics?.action_type)
	) {
		pushCompletenessIssue(
			issues,
			kind,
			entry,
			"mechanics",
			"Contains legacy mechanics aliases that should be resolved during enrichment.",
			"warning",
		);
	}
	return issues;
}

export function validateAbilityCompleteness(
	entry: CanonicalCastableEntry | StaticCompendiumEntry,
	kind: AbilityCatalogKind,
): AbilityCompletenessIssue[] {
	if (kind === "technique") return validateTechniqueCompleteness(entry);
	return validateCastableCompleteness(entry as CanonicalCastableEntry, kind);
}

export function isAbilityEntryComplete(
	entry: CanonicalCastableEntry | StaticCompendiumEntry,
	kind: AbilityCatalogKind,
): boolean {
	return !validateAbilityCompleteness(entry, kind).some(
		(issue) => issue.severity === "error",
	);
}

function normalizeCastableEntry(
	entry: StaticCompendiumEntry,
	canonicalType: CanonicalCastableType,
): CanonicalCastableEntry {
	const mechanics = isJsonRecord(entry.mechanics)
		? (entry.mechanics as Record<string, Json>)
		: null;
	const attack = getAttackRecord(entry, mechanics);
	const savingThrow = getSavingThrowRecord(entry, mechanics);
	const rawTags = Array.isArray(entry.tags)
		? entry.tags.filter(
				(tag): tag is string =>
					typeof tag === "string" && tag.trim().length > 0,
			)
		: [];
	const derivedTags =
		canonicalType === "powers"
			? getDerivedPowerTags(entry)
			: getDerivedSpellTags(entry);
	const saveAbility =
		getNonEmptyString((entry as { save_ability?: unknown }).save_ability) ??
		getNonEmptyString(
			(entry as { saving_throw_ability?: unknown }).saving_throw_ability,
		) ??
		getNonEmptyString(savingThrow?.ability);
	const activationTime =
		getNonEmptyString((entry as { casting_time?: unknown }).casting_time) ??
		getNonEmptyString(
			(entry as { activation_action?: unknown }).activation_action,
		) ??
		formatActivationText((entry as { activation?: unknown }).activation);

	return {
		...entry,
		canonical_type: canonicalType,
		power_level: entry.power_level ?? entry.spell_level ?? entry.level ?? 0,
		power_type:
			getNonEmptyString((entry as { power_type?: unknown }).power_type) ??
			(canonicalType === "spells"
				? "Spell"
				: getNonEmptyString(entry.spell_type)),
		activation_time: activationTime,
		casting_time: activationTime,
		range: formatRangeText((entry as { range?: unknown }).range),
		duration: formatDurationText((entry as { duration?: unknown }).duration),
		concentration:
			entry.concentration ??
			/concentrat/i.test(
				formatDurationText((entry as { duration?: unknown }).duration) ?? "",
			),
		ritual: Boolean(entry.ritual),
		higher_levels:
			getNonEmptyString((entry as { higher_levels?: unknown }).higher_levels) ??
			getNonEmptyString(
				(entry as { atHigherLevels?: unknown }).atHigherLevels,
			) ??
			getNonEmptyString(
				(entry as { at_higher_levels?: unknown }).at_higher_levels,
			),
		has_attack_roll: entry.has_attack_roll ?? Boolean(attack),
		has_save: Boolean(
			(entry as { has_save?: boolean | null }).has_save ??
				saveAbility ??
				savingThrow,
		),
		save_ability: saveAbility,
		damage_roll: extractDamageRoll(entry, attack, mechanics),
		damage_type: extractDamageType(entry, attack, mechanics),
		target:
			getNonEmptyString((entry as { target?: unknown }).target) ??
			getNonEmptyString(mechanics?.target),
		mechanics,
		tags: Array.from(new Set([...rawTags, ...derivedTags])),
	};
}

function normalizeEligibilityToken(value: string | null | undefined): string {
	return normalizeJobAccessToken(value);
}

function matchesCastableEligibility(
	entry: CanonicalCastableEntry,
	filters: Pick<
		LearnableCastableOptions,
		"jobName" | "pathName" | "regentNames"
	>,
): boolean {
	const requestedTokens = [
		normalizeEligibilityToken(filters.jobName),
		normalizeEligibilityToken(filters.pathName),
		...(filters.regentNames ?? []).map(normalizeEligibilityToken),
	].filter(Boolean);

	if (requestedTokens.length === 0) return true;

	const entryTokens = new Set(
		entry.tags
			.map(normalizeEligibilityToken)
			.filter((token) => token.length > 0),
	);

	if (entryTokens.size === 0) {
		return entry.canonical_type === "spells";
	}

	return requestedTokens.some((token) => entryTokens.has(token));
}

function matchesTokenEligibility(
	entry: StaticCompendiumEntry,
	tokens: readonly string[],
): boolean {
	if (tokens.length === 0) return false;
	const explicitClasses = Array.isArray(entry.classes)
		? entry.classes.filter(
				(value): value is string => typeof value === "string",
			)
		: [];
	if (explicitClasses.length > 0)
		return entryHasAccessToken(explicitClasses, tokens);
	return entryHasAccessToken(getDerivedPowerTags(entry), tokens);
}

function matchesTechniqueTokenEligibility(
	entry: StaticCompendiumEntry,
	tokens: readonly string[],
): boolean {
	if (tokens.length === 0) return false;
	const explicitClasses = Array.isArray(entry.classes)
		? entry.classes.filter(
				(value): value is string => typeof value === "string",
			)
		: [];
	if (explicitClasses.length > 0)
		return entryHasAccessToken(explicitClasses, tokens);
	const rawTags = Array.isArray(entry.tags) ? entry.tags : [];
	return entryHasAccessToken(
		[...rawTags, ...getDerivedTechniqueTags(entry)],
		tokens,
	);
}

function matchesSpellTokenEligibility(
	entry: CanonicalCastableEntry,
	tokens: readonly string[],
): boolean {
	if (tokens.length === 0) return false;
	const explicitClasses = Array.isArray(entry.classes)
		? entry.classes.filter(
				(value): value is string => typeof value === "string",
			)
		: [];
	if (explicitClasses.length > 0)
		return entryHasAccessToken(explicitClasses, tokens);
	return entryHasAccessToken(getDerivedSpellTags(entry), tokens);
}

function getEntrySchoolToken(entry: CanonicalCastableEntry): string | null {
	const school = getNonEmptyString((entry as { school?: unknown }).school);
	return school ? normalizePathAbilityValue(school) : null;
}

function pathGrantMatchesSpellEntry(
	entry: CanonicalCastableEntry,
	grant: PathAbilityGrant,
	characterLevel?: number | null,
): boolean {
	if (grant.kind !== "spell") return false;
	if (
		typeof characterLevel === "number" &&
		entry.power_level > getPathGrantMaxAbilityLevel(grant, characterLevel)
	) {
		return false;
	}
	if (grant.entryNames?.length) {
		const entryName = normalizePathAbilityValue(entry.name);
		if (
			!grant.entryNames.some(
				(name) => normalizePathAbilityValue(name) === entryName,
			)
		) {
			return false;
		}
	}
	if (
		grant.sourceTokens.length > 0 &&
		!matchesSpellTokenEligibility(entry, grant.sourceTokens)
	) {
		return false;
	}
	if (
		grant.schools?.length &&
		(!grant.leveledSchoolsOnly || entry.power_level > 0)
	) {
		const entrySchool = getEntrySchoolToken(entry);
		const allowedSchools = grant.schools.map(normalizePathAbilityValue);
		if (!entrySchool || !allowedSchools.includes(entrySchool)) return false;
	}
	return true;
}

function pathGrantMatchesPowerEntry(
	entry: CanonicalCastableEntry,
	grant: PathAbilityGrant,
	characterLevel?: number | null,
): boolean {
	if (grant.kind !== "power") return false;
	if (
		typeof characterLevel === "number" &&
		entry.power_level > getPathGrantMaxAbilityLevel(grant, characterLevel)
	) {
		return false;
	}
	if (grant.entryNames?.length) {
		const entryName = normalizePathAbilityValue(entry.name);
		if (
			!grant.entryNames.some(
				(name) => normalizePathAbilityValue(name) === entryName,
			)
		) {
			return false;
		}
	}
	return (
		grant.sourceTokens.length === 0 ||
		matchesTokenEligibility(entry, grant.sourceTokens)
	);
}

function pathGrantMatchesTechniqueEntry(
	entry: StaticCompendiumEntry,
	grant: PathAbilityGrant,
	characterLevel?: number | null,
): boolean {
	if (grant.kind !== "technique") return false;
	if (
		typeof characterLevel === "number" &&
		getTechniqueLevelRequirement(entry) > characterLevel
	) {
		return false;
	}
	if (
		typeof grant.maxLevel === "number" &&
		getTechniqueLevelRequirement(entry) > grant.maxLevel
	) {
		return false;
	}
	if (grant.entryNames?.length) {
		const entryName = normalizePathAbilityValue(entry.name);
		if (
			!grant.entryNames.some(
				(name) => normalizePathAbilityValue(name) === entryName,
			)
		) {
			return false;
		}
	}
	return (
		grant.sourceTokens.length === 0 ||
		matchesTechniqueTokenEligibility(entry, grant.sourceTokens)
	);
}

function getCastableLevelCap(
	options: LearnableCastableOptions,
	defaultKind: "spell" | "power",
): number | null {
	const explicit =
		defaultKind === "spell"
			? (options.maxSpellLevel ?? options.maxPowerLevel)
			: options.maxPowerLevel;
	if (typeof explicit === "number") return explicit;
	if (
		typeof options.characterLevel === "number" &&
		options.jobName &&
		options.pathName
	) {
		return getEffectiveMaxAbilityLevel({
			jobName: options.jobName,
			pathName: options.pathName,
			characterLevel: options.characterLevel,
			kind: options.castableKind ?? defaultKind,
		});
	}
	if (typeof options.characterLevel !== "number" || !options.jobName)
		return null;
	return getMaxAbilityLevelForJobAtLevel(
		options.jobName,
		options.characterLevel,
		options.castableKind ?? defaultKind,
	);
}

function getExplicitCastableLevelCap(
	options: LearnableCastableOptions,
	defaultKind: "spell" | "power",
): number | null {
	const explicit =
		defaultKind === "spell"
			? (options.maxSpellLevel ?? options.maxPowerLevel)
			: options.maxPowerLevel;
	return typeof explicit === "number" ? explicit : null;
}

function getBaseCastableLevelCap(
	options: LearnableCastableOptions,
	defaultKind: "spell" | "power",
): number | null {
	const explicit = getExplicitCastableLevelCap(options, defaultKind);
	if (typeof options.characterLevel !== "number" || !options.jobName)
		return typeof explicit === "number" ? explicit : null;
	const baseCap = getMaxAbilityLevelForJobAtLevel(
		options.jobName,
		options.characterLevel,
		options.castableKind ?? defaultKind,
	);
	return typeof explicit === "number" ? Math.min(explicit, baseCap) : baseCap;
}

function isWithinBaseCastableLevelCap(
	entry: CanonicalCastableEntry,
	options: LearnableCastableOptions,
	defaultKind: "spell" | "power",
): boolean {
	const maxLevel = getBaseCastableLevelCap(options, defaultKind);
	return maxLevel === null || entry.power_level <= maxLevel;
}

function preferSpellForLearnableList(
	existing: CanonicalCastableEntry,
	next: CanonicalCastableEntry,
): CanonicalCastableEntry {
	if (
		existing.canonical_type === "powers" &&
		next.canonical_type === "spells"
	) {
		return next;
	}

	return existing;
}

export async function listCanonicalCastables(
	search?: string,
	accessContext?: { campaignId?: string | null },
): Promise<CanonicalCastableEntry[]> {
	return listCanonicalCastablesByType(
		canonicalCastableTypes,
		search,
		accessContext,
	);
}

async function listCanonicalCastablesByType(
	types: readonly CanonicalCastableType[],
	search?: string,
	accessContext?: { campaignId?: string | null },
): Promise<CanonicalCastableEntry[]> {
	const results = await listCanonicalEntriesBatch(types, search, accessContext);

	return types.flatMap((type) =>
		(results.get(type) ?? [])
			.map((entry) => normalizeCastableEntry(entry, type))
			.filter((entry) =>
				isAbilityEntryComplete(entry, type === "powers" ? "power" : "spell"),
			),
	);
}

export async function listCanonicalPowers(
	search?: string,
	accessContext?: { campaignId?: string | null },
): Promise<CanonicalCastableEntry[]> {
	return listCanonicalCastablesByType(
		canonicalPowerTypes,
		search,
		accessContext,
	);
}

export async function listCanonicalSpells(
	search?: string,
	accessContext?: { campaignId?: string | null },
): Promise<CanonicalCastableEntry[]> {
	return listCanonicalCastablesByType(
		canonicalSpellTypes,
		search,
		accessContext,
	);
}

export async function auditCanonicalAbilityCompleteness(accessContext?: {
	campaignId?: string | null;
}): Promise<AbilityCompletenessIssue[]> {
	const results = await listCanonicalEntriesBatch(
		["powers", "spells", "techniques"],
		undefined,
		accessContext,
	);
	return [
		...(results.get("powers") ?? []).flatMap((entry) =>
			validateAbilityCompleteness(
				normalizeCastableEntry(entry, "powers"),
				"power",
			),
		),
		...(results.get("spells") ?? []).flatMap((entry) =>
			validateAbilityCompleteness(
				normalizeCastableEntry(entry, "spells"),
				"spell",
			),
		),
		...(results.get("techniques") ?? []).flatMap((entry) =>
			validateAbilityCompleteness(entry, "technique"),
		),
	];
}

export function isCanonicalSpellLearnable(
	entry: CanonicalCastableEntry,
	options: LearnableCastableOptions = {},
): boolean {
	if (!isAbilityEntryComplete(entry, "spell")) return false;
	const pathGrants = getActivePathAbilityGrants({
		jobName: options.jobName,
		pathName: options.pathName,
		characterLevel: options.characterLevel,
		kind: "spell",
	});
	if (
		options.jobName &&
		!jobCanLearnSpells(options.jobName) &&
		pathGrants.length === 0
	) {
		return false;
	}
	const explicitCap = getExplicitCastableLevelCap(options, "spell");
	const pathGrantAllowed = pathGrants.some(
		(grant) =>
			(explicitCap === null || entry.power_level <= explicitCap) &&
			pathGrantMatchesSpellEntry(entry, grant, options.characterLevel),
	);
	if (pathGrantAllowed) return true;
	if (!isWithinBaseCastableLevelCap(entry, options, "spell")) return false;
	const accessTokens = getSpellAccessTokens(
		options.jobName,
		options.pathName,
		options.regentNames,
	);
	const baseAllowed =
		accessTokens.length === 0
			? !options.jobName
			: jobCanLearnSpells(options.jobName)
				? matchesSpellTokenEligibility(entry, accessTokens)
				: false;
	return baseAllowed;
}

export function isCanonicalPowerLearnable(
	entry: CanonicalCastableEntry,
	options: LearnableCastableOptions = {},
): boolean {
	if (!isAbilityEntryComplete(entry, "power")) return false;
	const pathGrants = getActivePathAbilityGrants({
		jobName: options.jobName,
		pathName: options.pathName,
		characterLevel: options.characterLevel,
		kind: "power",
	});
	if (
		options.jobName &&
		!jobCanLearnPowers(options.jobName) &&
		pathGrants.length === 0
	) {
		return false;
	}
	const explicitCap = getExplicitCastableLevelCap(options, "power");
	const pathGrantAllowed = pathGrants.some(
		(grant) =>
			(explicitCap === null || entry.power_level <= explicitCap) &&
			pathGrantMatchesPowerEntry(entry, grant, options.characterLevel),
	);
	if (pathGrantAllowed) return true;
	if (!isWithinBaseCastableLevelCap(entry, options, "power")) return false;
	const accessTokens = getPowerAccessTokens(
		options.jobName,
		options.pathName,
		options.regentNames,
	);
	const baseAllowed = jobCanLearnPowers(options.jobName)
		? matchesTokenEligibility(entry, accessTokens)
		: false;
	return baseAllowed;
}

export async function findCanonicalCastableByName(
	name: string,
	accessContext?: { campaignId?: string | null },
	preferredTypes: readonly CanonicalCastableType[] = canonicalCastableTypes,
): Promise<CanonicalCastableEntry | null> {
	if (!name) return null;
	const lookup = name.trim().toLowerCase();
	const results = await listCanonicalEntriesBatch(
		preferredTypes,
		undefined,
		accessContext,
	);

	for (const type of preferredTypes) {
		const match = (results.get(type) ?? []).find(
			(entry) => entry.name.toLowerCase() === lookup,
		);
		if (match) return normalizeCastableEntry(match, type);
	}

	return null;
}

export async function findCanonicalCastableById(
	id: string | null | undefined,
	accessContext?: { campaignId?: string | null },
	preferredTypes: readonly CanonicalCastableType[] = canonicalCastableTypes,
): Promise<CanonicalCastableEntry | null> {
	if (!id) return null;
	const results = await listCanonicalEntriesBatch(
		preferredTypes,
		undefined,
		accessContext,
	);

	for (const type of preferredTypes) {
		const match = (results.get(type) ?? []).find((entry) => entry.id === id);
		if (match) return normalizeCastableEntry(match, type);
	}

	return null;
}

export interface CanonicalReferenceLookup {
	id?: string | null;
	name?: string | null;
}

export type CanonicalReferenceResolution<T> =
	| { matchedBy: "id"; entry: T }
	| { matchedBy: "name"; entry: T }
	| { matchedBy: "none"; entry: null };

/**
 * ID-first canonical reference resolver. Looks up an entry by static slug ID
 * first, falls back to a case-insensitive name match, and returns a
 * resolution object with a `matchedBy` discriminator so callers can
 * distinguish ID hits, legacy name hits, and unresolved (custom) entries.
 */
export async function resolveCanonicalReference(
	type: StaticCanonicalEntryType,
	ref: CanonicalReferenceLookup,
	accessContext?: { campaignId?: string | null },
): Promise<CanonicalReferenceResolution<StaticCompendiumEntry>> {
	if (ref.id) {
		const byId = await findCanonicalEntryById(type, ref.id, accessContext);
		if (byId) return { matchedBy: "id", entry: byId };
	}
	if (ref.name) {
		const byName = await findCanonicalEntryByName(type, ref.name);
		if (byName) return { matchedBy: "name", entry: byName };
	}
	return { matchedBy: "none", entry: null };
}

/**
 * Castable variant of `resolveCanonicalReference`. Tries each preferred
 * castable type (powers/spells) for an ID match before falling back to a
 * case-insensitive name match across the same set, returning a
 * `CanonicalCastableEntry` when found.
 */
export async function resolveCanonicalCastableReference(
	ref: CanonicalReferenceLookup,
	accessContext?: { campaignId?: string | null },
	preferredTypes: readonly CanonicalCastableType[] = canonicalCastableTypes,
): Promise<CanonicalReferenceResolution<CanonicalCastableEntry>> {
	if (ref.id) {
		const byId = await findCanonicalCastableById(
			ref.id,
			accessContext,
			preferredTypes,
		);
		if (byId) return { matchedBy: "id", entry: byId };
	}
	if (ref.name) {
		const byName = await findCanonicalCastableByName(
			ref.name,
			accessContext,
			preferredTypes,
		);
		if (byName) return { matchedBy: "name", entry: byName };
	}
	return { matchedBy: "none", entry: null };
}

/**
 * Sourcebook accessibility check that operates by canonical ID first. When an
 * ID is provided we resolve the entry, then verify its `source_book` is
 * accessible. Custom (unresolved) entries are treated as accessible because
 * they are user-authored and not gated by sourcebook entitlements.
 */
export async function isCanonicalEntryAccessible(
	type: StaticCanonicalEntryType,
	id: string | null | undefined,
	accessContext?: { campaignId?: string | null },
): Promise<boolean> {
	const entry = await findCanonicalEntryById(type, id, accessContext);
	if (!entry) {
		// Either no id supplied, or the id is unknown (custom entry). Custom
		// entries are not gated by sourcebook entitlements.
		return true;
	}
	return isSourcebookAccessible(entry.source_book, accessContext);
}

export async function isCanonicalCastableAccessible(
	id: string | null | undefined,
	accessContext?: { campaignId?: string | null },
	preferredTypes: readonly CanonicalCastableType[] = canonicalCastableTypes,
): Promise<boolean> {
	const entry = await findCanonicalCastableById(
		id,
		accessContext,
		preferredTypes,
	);
	if (!entry) return true;
	return isSourcebookAccessible(entry.source_book, accessContext);
}
export async function listLearnableCastables(
	options: LearnableCastableOptions = {},
): Promise<CanonicalCastableEntry[]> {
	const maxPowerLevel = getCastableLevelCap(
		options,
		options.castableKind ?? "spell",
	);
	const castables = await listCanonicalCastables(
		options.search,
		options.accessContext,
	);
	const filtered = castables.filter((entry) => {
		if (typeof maxPowerLevel === "number" && entry.power_level > maxPowerLevel)
			return false;

		return matchesCastableEligibility(entry, options);
	});

	const dedupedByName = new Map<string, CanonicalCastableEntry>();
	for (const entry of filtered) {
		const key = entry.name.trim().toLowerCase();
		const existing = dedupedByName.get(key);
		if (!existing) {
			dedupedByName.set(key, entry);
			continue;
		}

		dedupedByName.set(key, preferSpellForLearnableList(existing, entry));
	}

	return Array.from(dedupedByName.values()).sort(
		(a, b) => a.power_level - b.power_level || a.name.localeCompare(b.name),
	);
}

export async function listLearnableSpells(
	options: LearnableCastableOptions = {},
): Promise<CanonicalCastableEntry[]> {
	const pathGrants = getActivePathAbilityGrants({
		jobName: options.jobName,
		pathName: options.pathName,
		characterLevel: options.characterLevel,
		kind: "spell",
	});
	if (
		options.jobName &&
		!jobCanLearnSpells(options.jobName) &&
		pathGrants.length === 0
	) {
		return [];
	}
	const spells = await listCanonicalSpells(
		options.search,
		options.accessContext,
	);
	const accessTokens = getSpellAccessTokens(
		options.jobName,
		options.pathName,
		options.regentNames,
	);

	return spells
		.filter((entry) => {
			if (accessTokens.length === 0 && pathGrants.length === 0)
				return !options.jobName;
			return isCanonicalSpellLearnable(entry, options);
		})
		.sort(
			(a, b) => a.power_level - b.power_level || a.name.localeCompare(b.name),
		);
}

export async function listLearnablePowers(
	options: LearnableCastableOptions = {},
): Promise<CanonicalCastableEntry[]> {
	const pathGrants = getActivePathAbilityGrants({
		jobName: options.jobName,
		pathName: options.pathName,
		characterLevel: options.characterLevel,
		kind: "power",
	});
	if (
		options.jobName &&
		!jobCanLearnPowers(options.jobName) &&
		pathGrants.length === 0
	) {
		return [];
	}
	const powers = await listCanonicalPowers(
		options.search,
		options.accessContext,
	);

	return powers
		.filter((entry) => isCanonicalPowerLearnable(entry, options))
		.sort(
			(a, b) => a.power_level - b.power_level || a.name.localeCompare(b.name),
		);
}

export type LearnableTechniqueOptions = {
	search?: string;
	accessContext?: { campaignId?: string | null };
	maxLevel?: number | null;
	maxTechniqueLevel?: number | null;
	characterLevel?: number | null;
	jobName?: string | null;
	pathName?: string | null;
	regentNames?: string[] | null;
};

function getTechniqueLevelRequirement(entry: StaticCompendiumEntry): number {
	const direct =
		(entry as { level_requirement?: unknown }).level_requirement ??
		(entry as { requires_level?: unknown }).requires_level ??
		entry.level;
	return typeof direct === "number" ? direct : 0;
}

function getTechniqueLevelCap(
	options: LearnableTechniqueOptions,
): number | null {
	const explicit = options.maxTechniqueLevel ?? options.maxLevel;
	if (typeof explicit === "number") return explicit;
	if (typeof options.characterLevel === "number") return options.characterLevel;
	return null;
}

function getTechniqueClassRequirement(
	entry: StaticCompendiumEntry,
): string | null {
	const direct = (entry as { class_requirement?: unknown }).class_requirement;
	return typeof direct === "string" && direct.trim().length > 0 ? direct : null;
}

export function isCanonicalTechniqueLearnable(
	entry: StaticCompendiumEntry,
	options: LearnableTechniqueOptions = {},
): boolean {
	if (!isAbilityEntryComplete(entry, "technique")) return false;
	const pathGrants = getActivePathAbilityGrants({
		jobName: options.jobName,
		pathName: options.pathName,
		characterLevel: options.characterLevel,
		kind: "technique",
	});
	if (
		options.jobName &&
		!jobCanLearnTechniques(options.jobName) &&
		pathGrants.length === 0
	) {
		return false;
	}
	const maxLevel = getTechniqueLevelCap(options);
	if (
		typeof maxLevel === "number" &&
		getTechniqueLevelRequirement(entry) > maxLevel
	)
		return false;
	const pathGrantAllowed = pathGrants.some((grant) =>
		pathGrantMatchesTechniqueEntry(entry, grant, options.characterLevel),
	);
	if (pathGrantAllowed) return true;
	const accessTokens = getTechniqueAccessTokens(
		options.jobName,
		options.pathName,
		options.regentNames,
	);
	const classRequirement = getTechniqueClassRequirement(entry);
	if (classRequirement) {
		return accessTokens.includes(normalizeEligibilityToken(classRequirement));
	}
	const baseAllowed = jobCanLearnTechniques(options.jobName)
		? matchesTechniqueTokenEligibility(entry, accessTokens)
		: false;
	return baseAllowed;
}

export async function listLearnableTechniques(
	options: LearnableTechniqueOptions = {},
): Promise<StaticCompendiumEntry[]> {
	const pathGrants = getActivePathAbilityGrants({
		jobName: options.jobName,
		pathName: options.pathName,
		characterLevel: options.characterLevel,
		kind: "technique",
	});
	if (
		options.jobName &&
		!jobCanLearnTechniques(options.jobName) &&
		pathGrants.length === 0
	) {
		return [];
	}
	const maxLevel = getTechniqueLevelCap(options);
	const techniques = await listCanonicalEntries(
		"techniques",
		options.search,
		options.accessContext,
	);

	return techniques
		.filter((entry) => {
			if (
				typeof maxLevel === "number" &&
				getTechniqueLevelRequirement(entry) > maxLevel
			) {
				return false;
			}

			return isCanonicalTechniqueLearnable(entry, options);
		})
		.sort(
			(a, b) =>
				getTechniqueLevelRequirement(a) - getTechniqueLevelRequirement(b) ||
				a.name.localeCompare(b.name),
		);
}
