import type {
	StaticCompendiumEntry,
	StaticDataProvider,
} from "@/data/compendium/providers/types";
import type { Json } from "@/integrations/supabase/types";
import {
	entryHasAccessToken,
	getDerivedPowerTags,
	getDerivedTechniqueTags,
	getPowerAccessTokens,
	getSpellAccessTokens,
	getTechniqueAccessTokens,
	jobCanLearnPowers,
	jobCanLearnSpells,
	jobCanLearnTechniques,
	normalizeJobAccessToken,
} from "@/lib/jobAbilityAccess";
import { filterRowsBySourcebookAccess } from "@/lib/sourcebookAccess";

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

type LearnableCastableOptions = {
	search?: string;
	accessContext?: { campaignId?: string | null };
	maxPowerLevel?: number | null;
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

function formatActivationText(value: unknown): string | null {
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

function formatRangeText(value: unknown): string | null {
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

function formatDurationText(value: unknown): string | null {
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

	return null;
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
		canonicalType === "powers" ? getDerivedPowerTags(entry) : [];
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
		damage_type: extractDamageType(entry, attack),
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
	const entryTags = Array.isArray(entry.tags) ? entry.tags : [];
	return entryHasAccessToken(entryTags, tokens);
}

function matchesTechniqueTokenEligibility(
	entry: StaticCompendiumEntry,
	tokens: readonly string[],
): boolean {
	if (tokens.length === 0) return false;
	const rawTags = Array.isArray(entry.tags) ? entry.tags : [];
	return entryHasAccessToken(
		[...rawTags, ...getDerivedTechniqueTags(entry)],
		tokens,
	);
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
		(results.get(type) ?? []).map((entry) =>
			normalizeCastableEntry(entry, type),
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

export async function listLearnableCastables(
	options: LearnableCastableOptions = {},
): Promise<CanonicalCastableEntry[]> {
	const castables = await listCanonicalCastables(
		options.search,
		options.accessContext,
	);
	const filtered = castables.filter((entry) => {
		if (
			typeof options.maxPowerLevel === "number" &&
			entry.power_level > options.maxPowerLevel
		) {
			return false;
		}

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
	if (options.jobName && !jobCanLearnSpells(options.jobName)) return [];
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
			if (
				typeof options.maxPowerLevel === "number" &&
				entry.power_level > options.maxPowerLevel
			) {
				return false;
			}

			if (accessTokens.length === 0) return true;
			if (!Array.isArray(entry.tags) || entry.tags.length === 0) return true;
			return matchesTokenEligibility(entry, accessTokens);
		})
		.sort(
			(a, b) => a.power_level - b.power_level || a.name.localeCompare(b.name),
		);
}

export async function listLearnablePowers(
	options: LearnableCastableOptions = {},
): Promise<CanonicalCastableEntry[]> {
	if (options.jobName && !jobCanLearnPowers(options.jobName)) return [];
	const powers = await listCanonicalPowers(
		options.search,
		options.accessContext,
	);
	const accessTokens = getPowerAccessTokens(
		options.jobName,
		options.pathName,
		options.regentNames,
	);

	return powers
		.filter((entry) => matchesTokenEligibility(entry, accessTokens))
		.sort(
			(a, b) => a.power_level - b.power_level || a.name.localeCompare(b.name),
		);
}

type LearnableTechniqueOptions = {
	search?: string;
	accessContext?: { campaignId?: string | null };
	maxLevel?: number | null;
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

function getTechniqueClassRequirement(
	entry: StaticCompendiumEntry,
): string | null {
	const direct = (entry as { class_requirement?: unknown }).class_requirement;
	return typeof direct === "string" && direct.trim().length > 0 ? direct : null;
}

export async function listLearnableTechniques(
	options: LearnableTechniqueOptions = {},
): Promise<StaticCompendiumEntry[]> {
	if (options.jobName && !jobCanLearnTechniques(options.jobName)) return [];
	const techniques = await listCanonicalEntries(
		"techniques",
		options.search,
		options.accessContext,
	);
	const accessTokens = getTechniqueAccessTokens(
		options.jobName,
		options.pathName,
		options.regentNames,
	);

	return techniques
		.filter((entry) => {
			if (
				typeof options.maxLevel === "number" &&
				getTechniqueLevelRequirement(entry) > options.maxLevel
			) {
				return false;
			}

			const classRequirement = getTechniqueClassRequirement(entry);
			if (classRequirement) {
				return accessTokens.includes(
					normalizeEligibilityToken(classRequirement),
				);
			}

			return matchesTechniqueTokenEligibility(entry, accessTokens);
		})
		.sort(
			(a, b) =>
				getTechniqueLevelRequirement(a) - getTechniqueLevelRequirement(b) ||
				a.name.localeCompare(b.name),
		);
}
