/**
 * Digital Character Sheet Parity Features - Inspiration & Death Saves
 */
import type { ConditionEntry } from "@/lib/conditionSystem";

export interface CharacterInspiration {
	inspiration_points: number;
	inspiration_used: boolean;
}

export interface DeathSaves {
	death_save_successes: number;
	death_save_failures: number;
	is_stable: boolean;
}

export type ResourceRecharge =
	| "short-rest"
	| "long-rest"
	| "encounter"
	| "daily"
	| "none";

/** Where a tracker row came from — auto-seeded pools reconcile against
 * `sourceKey`; user-created rows stay untouched by reconciliation. */
export type CustomResourceOrigin = "job-pool" | "migrated" | "manual";

export interface CustomResource {
	id: string;
	name: string;
	current: number;
	max: number;
	dieSize?: number;
	recharge?: ResourceRecharge;
	notes?: string;
	origin?: CustomResourceOrigin;
	/** Stable identity for auto-seeded rows (e.g. "job-pool:flux-pool"). */
	sourceKey?: string;
}

/** Per-character tracking preferences (Warden tables differ on ammo rules). */
export interface ResourceTrackingPrefs {
	/** When true, each attack with an ammunition weapon auto-spends 1 ammo.
	 * Default false — spending is manual unless the table opts in. */
	autoSpendAmmo: boolean;
}

export interface CharacterResources {
	// Inspiration
	inspiration: CharacterInspiration;

	// Death Saves
	death_saves: DeathSaves;

	// Temporary HP tracking
	temp_hp_sources: Array<{
		amount: number;
		source: string;
		duration?: number;
		expires_at?: string;
	}>;

	// Custom resource trackers
	custom_resources: CustomResource[];

	// Character conditions (migrated to resources for state persistence)
	conditions: ConditionEntry[];

	// Tracking preferences (e.g. opt-in ammo auto-spend)
	tracking: ResourceTrackingPrefs;
}

// Initialize character resources
export function initializeCharacterResources(): CharacterResources {
	return {
		inspiration: {
			inspiration_points: 0,
			inspiration_used: false,
		},
		death_saves: {
			death_save_successes: 0,
			death_save_failures: 0,
			is_stable: false,
		},
		temp_hp_sources: [],
		custom_resources: [],
		conditions: [],
		tracking: { autoSpendAmmo: false },
	};
}

const clampNumber = (value: number, min: number, max: number) =>
	Math.min(max, Math.max(min, value));

export function normalizeCharacterResources(
	resources:
		| Partial<CharacterResources>
		| Record<string, unknown>
		| null
		| undefined,
): CharacterResources {
	const defaults = initializeCharacterResources();
	if (!resources) return defaults;

	const inspiration =
		(resources.inspiration as Partial<CharacterInspiration>) ||
		defaults.inspiration;
	const deathSaves =
		(resources.death_saves as Partial<DeathSaves>) || defaults.death_saves;
	const tempSources = Array.isArray(resources.temp_hp_sources)
		? (resources.temp_hp_sources as CharacterResources["temp_hp_sources"])
		: [];
	const conditions =
		resources &&
		"conditions" in resources &&
		Array.isArray(resources.conditions)
			? (resources.conditions as ConditionEntry[])
			: [];
	const customResources = Array.isArray(resources.custom_resources)
		? resources.custom_resources
				.filter(
					(resource: unknown) =>
						resource && typeof (resource as CustomResource).name === "string",
				)
				.map((resource: unknown) => {
					const r = resource as CustomResource;
					const max = Number.isFinite(r.max) ? Math.max(0, r.max) : 0;
					const current = Number.isFinite(r.current)
						? clampNumber(r.current, 0, max)
						: max;
					const dieSize =
						Number.isFinite(r.dieSize) && r.dieSize && r.dieSize > 0
							? r.dieSize
							: undefined;
					const recharge = r.recharge || "none";
					return {
						...r,
						max,
						current,
						dieSize,
						recharge,
					};
				})
		: defaults.custom_resources;

	return {
		inspiration: {
			inspiration_points:
				typeof inspiration.inspiration_points === "number"
					? inspiration.inspiration_points
					: defaults.inspiration.inspiration_points,
			inspiration_used: Boolean(inspiration.inspiration_used),
		},
		death_saves: {
			death_save_successes:
				typeof deathSaves.death_save_successes === "number"
					? deathSaves.death_save_successes
					: defaults.death_saves.death_save_successes,
			death_save_failures:
				typeof deathSaves.death_save_failures === "number"
					? deathSaves.death_save_failures
					: defaults.death_saves.death_save_failures,
			is_stable: Boolean(deathSaves.is_stable),
		},
		temp_hp_sources: tempSources,
		custom_resources: customResources,
		conditions,
		tracking: {
			autoSpendAmmo: Boolean(
				(resources.tracking as Partial<ResourceTrackingPrefs> | undefined)
					?.autoSpendAmmo,
			),
		},
	};
}

export function applyResourceRest(
	resources: CharacterResources,
	restType: "short" | "long",
): CharacterResources {
	const resetOnShort = new Set<ResourceRecharge>(["short-rest", "encounter"]);
	const resetOnLong = new Set<ResourceRecharge>([
		"long-rest",
		"short-rest",
		"encounter",
		"daily",
	]);

	const resetMap = restType === "short" ? resetOnShort : resetOnLong;

	const updatedResources = resources.custom_resources.map((resource) => {
		const recharge = resource.recharge || "none";
		if (!resetMap.has(recharge)) return resource;
		return { ...resource, current: resource.max };
	});

	return {
		...resources,
		custom_resources: updatedResources,
		death_saves:
			restType === "long"
				? {
						death_save_successes: 0,
						death_save_failures: 0,
						is_stable: false,
					}
				: resources.death_saves,
	};
}

// Calculate total temporary HP
export function calculateTotalTempHP(resources: CharacterResources): number {
	const now = new Date();
	return resources.temp_hp_sources
		.filter((source) => !source.expires_at || new Date(source.expires_at) > now)
		.reduce((total, source) => total + source.amount, 0);
}

// Add temporary HP
export function addTemporaryHP(
	resources: CharacterResources,
	amount: number,
	source: string,
	duration?: number,
): CharacterResources {
	const newSource = {
		amount,
		source,
		duration,
		expires_at: duration
			? new Date(Date.now() + duration * 60 * 1000).toISOString()
			: undefined,
	};

	return {
		...resources,
		temp_hp_sources: [...resources.temp_hp_sources, newSource],
	};
}

/**
 * Spend temporary HP to absorb incoming damage.
 *
 * RA house rule: temp HP from multiple sources POOLS (see
 * `calculateTotalTempHP`) rather than following 5e's "keep the higher, discard
 * the rest". That is deliberate — do not "correct" it to RAW.
 *
 * Sources drain in array order (oldest first), so a short-lived buff granted
 * early is spent before a later, longer-lived one. Expired sources are skipped
 * and left untouched for `clearExpiredTempHP` to reap.
 *
 * Pure: returns new resources plus how much was actually absorbed. The caller
 * persists and applies the remainder to real HP.
 */
export function consumeTemporaryHP(
	resources: CharacterResources,
	damage: number,
): { resources: CharacterResources; absorbed: number } {
	const incoming = Math.max(0, Math.floor(damage));
	if (incoming === 0) return { resources, absorbed: 0 };

	const now = new Date();
	let remaining = incoming;
	const nextSources = resources.temp_hp_sources.map((source) => {
		if (remaining <= 0) return source;
		const expired = source.expires_at && new Date(source.expires_at) <= now;
		if (expired) return source;
		const available = Math.max(0, source.amount);
		const spent = Math.min(available, remaining);
		remaining -= spent;
		return { ...source, amount: available - spent };
	});

	return {
		// Fully-spent sources are dropped so the tracker doesn't accumulate
		// zero-amount rows across a fight.
		resources: {
			...resources,
			temp_hp_sources: nextSources.filter((source) => source.amount > 0),
		},
		absorbed: incoming - remaining,
	};
}

// Clear expired temporary HP
export function clearExpiredTempHP(
	resources: CharacterResources,
): CharacterResources {
	const now = new Date();
	return {
		...resources,
		temp_hp_sources: resources.temp_hp_sources.filter(
			(source) => !source.expires_at || new Date(source.expires_at) > now,
		),
	};
}

// Handle death save
export function handleDeathSave(
	resources: CharacterResources,
	success: boolean,
): {
	updated: CharacterResources;
	outcome: "stable" | "dead" | "critical" | "ongoing";
} {
	const updated = { ...resources };
	updated.death_saves = { ...updated.death_saves };

	if (success) {
		updated.death_saves.death_save_successes++;
		if (updated.death_saves.death_save_successes >= 3) {
			updated.death_saves.is_stable = true;
			return { updated, outcome: "stable" };
		}
	} else {
		updated.death_saves.death_save_failures++;
		if (updated.death_saves.death_save_failures >= 3) {
			return { updated, outcome: "dead" };
		}
	}

	return { updated, outcome: "ongoing" };
}

// Reset death saves (when stabilized or healed)
export function resetDeathSaves(
	resources: CharacterResources,
): CharacterResources {
	return {
		...resources,
		death_saves: {
			death_save_successes: 0,
			death_save_failures: 0,
			is_stable: false,
		},
	};
}

// Apply inspiration
export function applyInspiration(
	resources: CharacterResources,
): CharacterResources {
	return {
		...resources,
		inspiration: {
			inspiration_points: Math.max(
				0,
				resources.inspiration.inspiration_points - 1,
			),
			inspiration_used: true,
		},
	};
}

// Gain inspiration
export function gainInspiration(
	resources: CharacterResources,
): CharacterResources {
	return {
		...resources,
		inspiration: {
			inspiration_points: resources.inspiration.inspiration_points + 1,
			inspiration_used: false,
		},
	};
}
