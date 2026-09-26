export type CompanionInitiativeMode = "independent" | "linked";
export type CompanionReactionPool = "separate" | "shared-rider";
export type CompanionProgressionMode = "fixed" | "milestone" | "xp" | "manual";

export interface CompanionTurnEntry {
	id: string;
	initiative: number | null | undefined;
	created_at?: string | null;
	companion_instance_id?: string | null;
	initiative_anchor_character_id?: string | null;
}

export interface CompanionCombatProfile {
	initiativeMode?: CompanionInitiativeMode;
	reactionPool: CompanionReactionPool;
	actionEconomy: Record<string, unknown> | null;
	progressionMode: CompanionProgressionMode | null;
}

export interface CompanionMountProfile {
	riderLimit: number | null;
	allowedRiderSizes: string[] | null;
	allowedTerrain: string[] | null;
	requiresTack: boolean | null;
	requiresTraining: boolean | null;
}

export interface CompanionRestRule {
	heal: { kind: "none" } | { kind: "full" } | { kind: "flat"; amount: number };
	conditions: "clear" | "preserve" | null;
	clearDowned: boolean | null;
	resources: Record<string, unknown> | null;
}

const recordOrNull = (value: unknown): Record<string, unknown> | null =>
	value && typeof value === "object" && !Array.isArray(value)
		? (value as Record<string, unknown>)
		: null;

const stringArrayOrNull = (value: unknown): string[] | null => {
	if (!Array.isArray(value)) return null;
	const values = value.filter(
		(entry): entry is string =>
			typeof entry === "string" && entry.trim().length > 0,
	);
	return values.length === value.length ? values : null;
};

/**
 * Shared deterministic turn-order resolver for tracker/session consumers.
 * Rules-bearing initiative stays the primary key. Ties are technical ordering,
 * not a new game bonus: persisted creation order wins, then stable row id.
 */
export function resolveTurnOrder<T extends CompanionTurnEntry>(
	entries: readonly T[],
): T[] {
	return entries
		.map((entry, index) => ({ entry, index }))
		.sort((left, right) => {
			const initiativeDelta =
				Number(right.entry.initiative ?? 0) -
				Number(left.entry.initiative ?? 0);
			if (initiativeDelta !== 0) return initiativeDelta;
			const leftCreated = left.entry.created_at ?? "";
			const rightCreated = right.entry.created_at ?? "";
			if (leftCreated && rightCreated && leftCreated !== rightCreated) {
				return leftCreated.localeCompare(rightCreated);
			}
			const idDelta = left.entry.id.localeCompare(right.entry.id);
			return idDelta !== 0 ? idDelta : left.index - right.index;
		})
		.map(({ entry }) => entry);
}

/** Stable living identity is the dedupe key; source/name never is. */
export function mergeCompanionTurnEntries<T extends CompanionTurnEntry>(
	current: readonly T[],
	incoming: readonly T[],
): T[] {
	const result = [...current];
	const companionIndex = new Map<string, number>();
	for (let index = 0; index < result.length; index += 1) {
		const instanceId = result[index]?.companion_instance_id;
		if (instanceId) companionIndex.set(instanceId, index);
	}
	for (const entry of incoming) {
		const instanceId = entry.companion_instance_id;
		if (instanceId && companionIndex.has(instanceId)) {
			result[companionIndex.get(instanceId) as number] = entry;
			continue;
		}
		result.push(entry);
		if (instanceId) companionIndex.set(instanceId, result.length - 1);
	}
	return result;
}

export function readCompanionCombatProfile(
	raw: unknown,
): CompanionCombatProfile {
	const profile = recordOrNull(raw);
	const combat = recordOrNull(profile?.combat);
	const progression = recordOrNull(profile?.progression);
	const initiativeMode =
		combat?.initiativeMode === "independent" ||
		combat?.initiativeMode === "linked"
			? combat.initiativeMode
			: undefined;
	const reactionPool: CompanionReactionPool =
		combat?.reactionPool === "shared-rider" ? "shared-rider" : "separate";
	const progressionMode =
		progression?.mode === "fixed" ||
		progression?.mode === "milestone" ||
		progression?.mode === "xp" ||
		progression?.mode === "manual"
			? progression.mode
			: null;
	return {
		initiativeMode,
		reactionPool,
		actionEconomy: recordOrNull(combat?.actionEconomy),
		progressionMode,
	};
}

export function readCompanionMountProfile(
	raw: unknown,
): CompanionMountProfile | null {
	const profile = recordOrNull(raw);
	if (!profile) return null;
	const riderLimit =
		typeof profile.riderLimit === "number" &&
		Number.isInteger(profile.riderLimit) &&
		profile.riderLimit >= 0
			? profile.riderLimit
			: null;
	return {
		riderLimit,
		allowedRiderSizes: stringArrayOrNull(profile.allowedRiderSizes),
		allowedTerrain: stringArrayOrNull(profile.allowedTerrain),
		requiresTack:
			typeof profile.requiresTack === "boolean" ? profile.requiresTack : null,
		requiresTraining:
			typeof profile.requiresTraining === "boolean"
				? profile.requiresTraining
				: null,
	};
}

/** Missing rest policy is manual/no-op; no universal healing is synthesized. */
export function readCompanionRestRule(
	profileRaw: unknown,
	restKind: "short" | "long",
): CompanionRestRule | null {
	const profile = recordOrNull(profileRaw);
	const rest = recordOrNull(profile?.rest);
	const rule = recordOrNull(rest?.[restKind]);
	if (!rule) return null;
	const heal = recordOrNull(rule.heal);
	let parsedHeal: CompanionRestRule["heal"];
	if (!heal || heal.kind === "none") {
		parsedHeal = { kind: "none" };
	} else if (heal.kind === "full") {
		parsedHeal = { kind: "full" };
	} else if (
		heal.kind === "flat" &&
		typeof heal.amount === "number" &&
		Number.isFinite(heal.amount) &&
		heal.amount >= 0
	) {
		parsedHeal = { kind: "flat", amount: heal.amount };
	} else {
		return null;
	}
	const conditions =
		rule.conditions === "clear" || rule.conditions === "preserve"
			? rule.conditions
			: null;
	return {
		heal: parsedHeal,
		conditions,
		clearDowned:
			typeof rule.clearDowned === "boolean" ? rule.clearDowned : null,
		resources: recordOrNull(rule.resources),
	};
}

export interface MountEligibilityInput {
	profile: CompanionMountProfile | null;
	riderSize?: string | null;
	terrain?: string | null;
	hasTack?: boolean | null;
	isTrained?: boolean | null;
}

export interface MountEligibility {
	valid: boolean;
	reason?:
		| "MOUNT_PROFILE_REQUIRED"
		| "MOUNT_RIDER_LIMIT_REJECTED"
		| "MOUNT_RIDER_SIZE_REJECTED"
		| "MOUNT_TERRAIN_REJECTED"
		| "MOUNT_TACK_REQUIRED"
		| "MOUNT_TRAINING_REQUIRED";
}

export function evaluateMountEligibility(
	input: MountEligibilityInput,
): MountEligibility {
	const profile = input.profile;
	if (!profile) return { valid: false, reason: "MOUNT_PROFILE_REQUIRED" };
	if (profile.riderLimit !== null && profile.riderLimit < 1) {
		return { valid: false, reason: "MOUNT_RIDER_LIMIT_REJECTED" };
	}
	if (
		profile.allowedRiderSizes &&
		(!input.riderSize || !profile.allowedRiderSizes.includes(input.riderSize))
	) {
		return { valid: false, reason: "MOUNT_RIDER_SIZE_REJECTED" };
	}
	if (
		profile.allowedTerrain &&
		(!input.terrain || !profile.allowedTerrain.includes(input.terrain))
	) {
		return { valid: false, reason: "MOUNT_TERRAIN_REJECTED" };
	}
	if (profile.requiresTack === true && input.hasTack !== true) {
		return { valid: false, reason: "MOUNT_TACK_REQUIRED" };
	}
	if (profile.requiresTraining === true && input.isTrained !== true) {
		return { valid: false, reason: "MOUNT_TRAINING_REQUIRED" };
	}
	return { valid: true };
}
