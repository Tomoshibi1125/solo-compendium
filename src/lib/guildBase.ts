// Guild Base — pure logic + types + local (guest-mode) store for guild
// facilities, the guild-skills tree, and the (light) fund-purchase model.
//
// Design rules (TTRPG, not an economy sim — see memory guild-economy-ttrpg-not-sim):
//   * Mods / upgrades / facilities / skills are BOUGHT with guild funds and are
//     UNGATED — if the guild can afford it, it can buy it. No prerequisite chains
//     or rank/level locks block a purchase. (Who may spend is a UI capability gate,
//     not encoded here.)
//   * Certain items may instead be Warden-granted: the grant path simply sets the
//     state with no fund cost (see `grantFacilityTier` / `grantGuildSkill`).
//
// The catalog DATA lives in the compendium content files
// (`data/compendium/guild-base-mods.ts` / `guild-skills.ts`); these pure ops take
// the catalog as arguments so they stay content-free and trivially testable —
// mirroring `guildTreasury.ts` / `guildQuests.ts`.

import { AppError } from "@/lib/appError";
import type { RaCurrencyId } from "@/lib/currency";
import {
	applyFundsDelta,
	type GuildFunds,
	getFundsBalance,
} from "@/lib/guildTreasury";
import type { FeatureEffect } from "@/types/featureEffects";

// ── Grounded benefits ────────────────────────────────────────────────────────
//
// A facility tier / guild skill grants benefits in one of three HONEST forms —
// no invented stat keys (the old `GuildBuff` model was cosmetic):
//   * `capability` — a real app hook that actually changes behaviour: a member-
//     cap bonus (added to the real roster cap) and/or extra crafting recipe ids
//     surfaced at the guild Forge (additive, never a gate).
//   * `effects`    — real 5e `FeatureEffect`s that apply to the character sheet
//     of any member whose guild has the benefit built (wired through the same
//     custom-modifier pipeline as feats — see `useCharacterGuildBenefits`).
//   * `benefit`    — narrative prose, for facilities with no fitting mechanic.
//     A benefit MUST NOT pretend to be a stat.

/** Real, wired capabilities a facility tier / guild skill can grant. */
export interface GuildCapability {
	/** Added to the real guild member cap. */
	memberCap?: number;
	/** Extra crafting recipe ids surfaced at the guild Forge (additive). */
	craftingOptions?: string[];
}

/** A benefit-bearing source (a facility tier or a guild skill). */
export interface GuildBenefitSource {
	capability?: GuildCapability;
	effects?: FeatureEffect[];
	benefit?: string;
}

// ── Catalog shapes (data lives in the content files) ─────────────────────────

export type GuildFacilityId =
	| "barracks"
	| "forge"
	| "war_room"
	| "vault"
	| "infirmary"
	| "archive"
	| "training_hall"
	| "armory"
	| "sanctum"
	| "observatory"
	| "essence_garden"
	| "great_hall";

export interface GuildFacilityTier extends GuildBenefitSource {
	/** 1-based tier; tier 0 means "not built". */
	tier: number;
	name: string;
	cost: { currency: RaCurrencyId; amount: number };
	description: string;
}

export interface GuildFacility {
	id: GuildFacilityId;
	name: string;
	/** Short narrative blurb. */
	summary: string;
	tiers: GuildFacilityTier[];
	source_book: "Rift Ascendant Canon";
}

export interface GuildSkill extends GuildBenefitSource {
	id: string;
	name: string;
	cost: { currency: RaCurrencyId; amount: number };
	description: string;
	source_book: "Rift Ascendant Canon";
}

/**
 * A purchasable guild HQ property. Buying one installs its bundled facility
 * tiers and records it as the guild's owned base; the guild then upgrades / mods
 * those wings through the normal facility + skill system. The blank `isLot`
 * parcel installs nothing — the guild raises every wing itself, so a guild that
 * wants a bespoke mix buys the (cheap) lot instead of a pre-built base.
 */
export interface GuildBaseProperty extends GuildBenefitSource {
	id: string;
	name: string;
	/** Short narrative blurb. */
	summary: string;
	description: string;
	cost: { currency: RaCurrencyId; amount: number };
	/** Facility tiers pre-built when the base is acquired (empty for the lot). */
	includedFacilities: Partial<Record<GuildFacilityId, number>>;
	/** True for the blank buildable parcel — no bundled facilities, cheapest. */
	isLot?: boolean;
	source_book: "Rift Ascendant Canon";
}

// ── State (the `guild_base` / `guild_skills` JSONB) ───────────────────────────

/** Per-facility built tier (0 = not built). */
export type GuildBaseState = Partial<Record<GuildFacilityId, number>>;
/** Unlocked guild-skill ids. */
export type GuildSkillsState = string[];
/** The guild's owned base property id (null = no base acquired yet). */
export type GuildBasePropertyState = string | null;

export const facilityLevel = (
	state: GuildBaseState | null | undefined,
	id: GuildFacilityId,
): number => Math.max(0, Math.trunc(state?.[id] ?? 0));

/** The next tier a facility can build, or null when already maxed. */
export const nextFacilityTier = (
	facility: GuildFacility,
	currentLevel: number,
): GuildFacilityTier | null =>
	facility.tiers.find((t) => t.tier === currentLevel + 1) ?? null;

/** Cost of the next facility tier, or null when maxed. */
export const facilityUpgradeCost = (
	facility: GuildFacility,
	currentLevel: number,
): { currency: RaCurrencyId; amount: number } | null =>
	nextFacilityTier(facility, currentLevel)?.cost ?? null;

const canAfford = (
	funds: GuildFunds | null | undefined,
	cost: { currency: RaCurrencyId; amount: number },
): boolean => getFundsBalance(funds, cost.currency) >= cost.amount;

/**
 * Buy the next tier of a facility with guild funds (ungated). Returns the new
 * base state + the debited funds, or throws when maxed / unaffordable.
 */
export const purchaseFacilityUpgrade = (params: {
	baseState: GuildBaseState | null | undefined;
	funds: GuildFunds | null | undefined;
	facility: GuildFacility;
}): { baseState: GuildBaseState; funds: GuildFunds } => {
	const { baseState, funds, facility } = params;
	const level = facilityLevel(baseState, facility.id);
	const tier = nextFacilityTier(facility, level);
	if (!tier) {
		throw new AppError(
			`${facility.name} is already at its highest tier.`,
			"INVALID_INPUT",
		);
	}
	if (!canAfford(funds, tier.cost)) {
		throw new AppError(
			"Insufficient guild funds for that upgrade.",
			"INVALID_INPUT",
		);
	}
	return {
		baseState: { ...(baseState ?? {}), [facility.id]: tier.tier },
		funds: applyFundsDelta(funds, tier.cost.currency, -tier.cost.amount),
	};
};

/** Warden-grant: set a facility to a tier with no fund cost. */
export const grantFacilityTier = (
	baseState: GuildBaseState | null | undefined,
	facilityId: GuildFacilityId,
	tier: number,
): GuildBaseState => ({
	...(baseState ?? {}),
	[facilityId]: Math.max(0, Math.trunc(tier)),
});

/** Buy a guild skill with funds (ungated). Throws if already owned / unaffordable. */
export const purchaseGuildSkill = (params: {
	skillsState: GuildSkillsState | null | undefined;
	funds: GuildFunds | null | undefined;
	skill: GuildSkill;
}): { skillsState: GuildSkillsState; funds: GuildFunds } => {
	const { skillsState, funds, skill } = params;
	const owned = skillsState ?? [];
	if (owned.includes(skill.id)) {
		throw new AppError(`${skill.name} is already unlocked.`, "INVALID_INPUT");
	}
	if (!canAfford(funds, skill.cost)) {
		throw new AppError(
			"Insufficient guild funds for that skill.",
			"INVALID_INPUT",
		);
	}
	return {
		skillsState: [...owned, skill.id],
		funds: applyFundsDelta(funds, skill.cost.currency, -skill.cost.amount),
	};
};

/** Warden-grant: unlock a guild skill with no fund cost (idempotent). */
export const grantGuildSkill = (
	skillsState: GuildSkillsState | null | undefined,
	skillId: string,
): GuildSkillsState => {
	const owned = skillsState ?? [];
	return owned.includes(skillId) ? owned : [...owned, skillId];
};

/**
 * Merge a base's bundled facility tiers into the built-facility state, never
 * downgrading a wing the guild already raised higher (relocating keeps progress).
 */
const installIncludedFacilities = (
	baseState: GuildBaseState | null | undefined,
	base: GuildBaseProperty,
): GuildBaseState => {
	const next: GuildBaseState = { ...(baseState ?? {}) };
	for (const [id, tier] of Object.entries(base.includedFacilities)) {
		const facilityId = id as GuildFacilityId;
		next[facilityId] = Math.max(next[facilityId] ?? 0, Math.trunc(tier ?? 0));
	}
	return next;
};

/**
 * Acquire a guild base property with funds (ungated). Installs its bundled
 * facility tiers, records it as the owned base, and debits the cost. Throws when
 * the guild already calls this base home or can't afford it. Buying a DIFFERENT
 * base relocates the HQ — the owned id changes and already-built wings are kept.
 */
export const purchaseGuildBaseProperty = (params: {
	ownedBaseId: GuildBasePropertyState;
	baseState: GuildBaseState | null | undefined;
	funds: GuildFunds | null | undefined;
	base: GuildBaseProperty;
}): { baseProperty: string; baseState: GuildBaseState; funds: GuildFunds } => {
	const { ownedBaseId, baseState, funds, base } = params;
	if (ownedBaseId === base.id) {
		throw new AppError(
			`The guild already calls ${base.name} home.`,
			"INVALID_INPUT",
		);
	}
	if (!canAfford(funds, base.cost)) {
		throw new AppError(
			"Insufficient guild funds for that base.",
			"INVALID_INPUT",
		);
	}
	return {
		baseProperty: base.id,
		baseState: installIncludedFacilities(baseState, base),
		funds: applyFundsDelta(funds, base.cost.currency, -base.cost.amount),
	};
};

/** Warden-grant a base property at no cost (installs its bundled facilities). */
export const grantGuildBaseProperty = (params: {
	baseState: GuildBaseState | null | undefined;
	base: GuildBaseProperty;
}): { baseProperty: string; baseState: GuildBaseState } => ({
	baseProperty: params.base.id,
	baseState: installIncludedFacilities(params.baseState, params.base),
});

/** The fully-resolved benefits a guild's built Base grants. */
export interface AggregatedGuildEffects {
	/** Added on top of the contribution-derived member cap. */
	memberCapBonus: number;
	/** De-duplicated extra crafting recipe ids unlocked at the Forge. */
	craftingOptions: string[];
	/** Real 5e effects applied to every member's character sheet. */
	effects: FeatureEffect[];
	/** Narrative-only benefits (no mechanical hook). */
	benefits: string[];
}

/**
 * Resolve every benefit from built facility tiers + unlocked skills into the
 * real hooks the app consumes. Facility tiers are cumulative (a tier-3 facility
 * grants its tier-1..3 benefits).
 */
export const aggregateGuildEffects = (params: {
	facilities: GuildFacility[];
	skills: GuildSkill[];
	baseState: GuildBaseState | null | undefined;
	skillsState: GuildSkillsState | null | undefined;
	/** Optional base-property catalog + the guild's owned base id, so the base's
	 *  own inherent perk (location / prestige) folds into the resolved benefits. */
	bases?: GuildBaseProperty[];
	baseProperty?: GuildBasePropertyState;
}): AggregatedGuildEffects => {
	let memberCapBonus = 0;
	const craftingOptions: string[] = [];
	const effects: FeatureEffect[] = [];
	const benefits: string[] = [];

	const add = (src: GuildBenefitSource) => {
		if (src.capability?.memberCap) memberCapBonus += src.capability.memberCap;
		for (const id of src.capability?.craftingOptions ?? []) {
			if (!craftingOptions.includes(id)) craftingOptions.push(id);
		}
		if (src.effects) effects.push(...src.effects);
		if (src.benefit) benefits.push(src.benefit);
	};

	for (const facility of params.facilities) {
		const level = facilityLevel(params.baseState, facility.id);
		for (const tier of facility.tiers) {
			if (tier.tier <= level) add(tier);
		}
	}
	const owned = new Set(params.skillsState ?? []);
	for (const skill of params.skills) {
		if (owned.has(skill.id)) add(skill);
	}
	if (params.baseProperty && params.bases) {
		const ownedBase = params.bases.find((b) => b.id === params.baseProperty);
		if (ownedBase) add(ownedBase);
	}
	return { memberCapBonus, craftingOptions, effects, benefits };
};

// ── Display formatters (shared by GuildDetail + GuildBaseDetail) ──────────────

/** Human label for one real 5e `FeatureEffect` in a guild context. */
export const formatGuildEffectLabel = (effect: FeatureEffect): string => {
	switch (effect.kind) {
		case "initiative_bonus":
			return `+${effect.value} Initiative`;
		case "attack_bonus":
			return `+${effect.value} Attack${
				effect.weaponType ? ` (${effect.weaponType})` : ""
			}`;
		case "damage_bonus":
			return `+${effect.value} Damage${
				effect.damageType ? ` (${effect.damageType})` : ""
			}`;
		case "ac_bonus":
			return `+${effect.value} AC`;
		case "speed_bonus":
			return `+${effect.value} ft Speed`;
		case "ability_score":
			return `+${effect.value} ${effect.target}`;
		case "hp_per_level":
			return `+${effect.value} HP / level`;
		case "hp_flat":
			return `+${effect.value} HP`;
		case "save_proficiency":
			return `${effect.ability} save proficiency`;
		case "passive_bonus":
			return `+${effect.value} ${effect.passive}`;
		case "proficiency":
			return `${effect.target} proficiency`;
		case "expertise":
			return `${effect.skill} expertise`;
		case "resistance":
			return `${effect.damageType} resistance`;
		case "advantage":
			return `Advantage on ${effect.rollType}`;
		case "resource_grant":
			return `${effect.uses}× ${effect.resource} / ${effect.recovery} rest`;
		case "spell_grant":
			return "Grants a spell";
		case "ac_formula":
			return "Alternate AC formula";
		default:
			return "Effect";
	}
};

/** Short labels for a capability block (member cap / crafting options). */
export const formatGuildCapabilityLabels = (
	capability?: GuildCapability,
): string[] => {
	const labels: string[] = [];
	if (capability?.memberCap) labels.push(`+${capability.memberCap} Member Cap`);
	const recipes = capability?.craftingOptions?.length ?? 0;
	if (recipes > 0) {
		labels.push(`+${recipes} Forge recipe${recipes === 1 ? "" : "s"}`);
	}
	return labels;
};

/** One flat list of labels summarising a tier/skill's capability + effects + benefit. */
export const summarizeGuildBenefits = (src: GuildBenefitSource): string[] => [
	...formatGuildCapabilityLabels(src.capability),
	...(src.effects ?? []).map(formatGuildEffectLabel),
	...(src.benefit ? [src.benefit] : []),
];

/** Group key so same-kind numeric effects (e.g. tiered +Initiative) merge for display. */
const effectGroupKey = (effect: FeatureEffect): string => {
	switch (effect.kind) {
		case "attack_bonus":
			return `attack_bonus:${effect.weaponType ?? ""}`;
		case "damage_bonus":
			return `damage_bonus:${effect.damageType ?? ""}`;
		case "ability_score":
			return `ability_score:${effect.target}`;
		case "passive_bonus":
			return `passive_bonus:${effect.passive}`;
		default:
			return effect.kind;
	}
};

/**
 * Net display labels for a guild's resolved benefits — member-cap bonus, Forge
 * recipes, and effects SUMMED by kind (so a tier-3 War Room reads "+3 Initiative",
 * not three "+1" badges), followed by narrative benefits.
 */
export const describeAggregatedGuildEffects = (
	agg: AggregatedGuildEffects,
): string[] => {
	const labels: string[] = [];
	if (agg.memberCapBonus > 0) labels.push(`+${agg.memberCapBonus} Member Cap`);
	if (agg.craftingOptions.length > 0) {
		labels.push(
			`+${agg.craftingOptions.length} Forge recipe${
				agg.craftingOptions.length === 1 ? "" : "s"
			}`,
		);
	}
	const order: string[] = [];
	const merged = new Map<string, FeatureEffect>();
	for (const effect of agg.effects) {
		const key = effectGroupKey(effect);
		const prev = merged.get(key);
		if (
			prev &&
			"value" in prev &&
			"value" in effect &&
			typeof prev.value === "number" &&
			typeof effect.value === "number"
		) {
			merged.set(key, { ...prev, value: prev.value + effect.value });
		} else if (!prev) {
			merged.set(key, effect);
			order.push(key);
		}
	}
	for (const key of order) {
		const effect = merged.get(key);
		if (effect) labels.push(formatGuildEffectLabel(effect));
	}
	return labels;
};

// NOTE: Base state (built facility tiers + unlocked skill ids) is persisted as
// JSONB columns ON the guild row (`guilds.base_facilities` / `guilds.guild_skills`),
// so guest-mode reads/writes go through the guild local store in `useGuilds.ts`
// (`loadLocalGuilds`/`saveLocalGuilds`) — no separate base store is needed.
